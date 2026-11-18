'use strict';

// Static contract and decision-table checks, not a general YAML/actionlint parser.
// No dependencies, network, workflow execution or deployment.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../.github/workflows/deploy-portal.yml'), 'utf8').replace(/\r\n/g, '\n');
const jobSource = source.split('\njobs:\n')[1];
assert.ok(jobSource, 'jobs mapping exists');
const matches = [...jobSource.matchAll(/^  ([a-z][a-z-]*):\n/gm)];
const jobs = Object.fromEntries(matches.map((match, index) => [match[1], jobSource.slice(match.index, matches[index + 1]?.index)]));
const condition = job => jobs[job].match(/^    if: \$\{\{ (.+) \}\}$/m)?.[1];

// Evaluate the deliberately limited expression grammar used by these guards.
// Reject unknown syntax rather than silently treating it as safe.
function allows(expression, event, ref, deploy, build = 'success', packaged = 'success') {
    assert.ok(expression);
    const values = { 'github.event_name': event, 'github.ref': ref, 'inputs.deploy': deploy, 'needs.build.result': build, 'needs.package.result': packaged };
    return expression.split(' && ').map(term => {
        const match = term.match(/^(github\.(?:event_name|ref)|inputs\.deploy|needs\.(?:build|package)\.result) == ('[^']*'|true)$/);
        assert.ok(match, 'guard must use the reviewed expression grammar: ' + term);
        return values[match[1]] === (match[2] === 'true' ? true : match[2].slice(1, -1));
    }).every(Boolean);
}

function runBlocks(job) {
    const lines = jobs[job].split('\n');
    const blocks = [];
    for (let index = 0; index < lines.length; index++) {
        if (!/^        run: \|$/.test(lines[index])) continue;
        const block = [];
        for (index++; index < lines.length && (lines[index] === '' || /^ {10}/.test(lines[index])); index++) block.push(lines[index].slice(10));
        index--;
        blocks.push(block.join('\n').trim());
    }
    return blocks;
}

test('workflow structure and triggers remain narrowly defined', () => {
    assert.deepEqual(Object.keys(jobs), ['build', 'package', 'deploy']);
    assert.match(source, /^on:\n  push:\n    branches:\n      - '\*\*'\n  pull_request:\n  workflow_dispatch:/m);
    assert.doesNotMatch(source, /\t|pull_request_target:|workflow_run:|repository_dispatch:|schedule:/);
    assert.match(source, /deploy:\n        description: '[^'\n]+'\n        type: boolean\n        required: false\n        default: false/);
});

test('only deployment holds Pages and OIDC write permissions', () => {
    const header = source.split('\njobs:\n')[0];
    assert.match(header, /permissions:\n  contents: read\n/);
    assert.doesNotMatch(header, /pages:|id-token:/);
    assert.doesNotMatch(jobs.build + jobs.package, /permissions:|pages: write|id-token: write|secrets:/);
    assert.match(jobs.deploy, /permissions:\n      pages: write\n      id-token: write/);
    assert.equal((source.match(/pages: write/g) || []).length, 1);
    assert.equal((source.match(/id-token: write/g) || []).length, 1);
});

test('normal validation has no upload, deployment action or deployment dependency', () => {
    assert.doesNotMatch(jobs.build, /upload-pages-artifact|upload-artifact|deploy-pages|needs:|    if:/);
    assert.match(jobs.build, /Test-HIEPProjectUpdate -Path \./);
    assert.match(jobs.build, /New-HIEPProjectTimeline/);
    assert.doesNotMatch(source, /continue-on-error:|always\(\)/);
});

test('all ordinary events and false or absent dispatch inputs prohibit publication', () => {
    for (const job of ['package', 'deploy']) {
        for (const event of ['push', 'pull_request', 'pull_request_target', 'workflow_run', 'schedule']) {
            for (const ref of ['refs/heads/main', 'refs/heads/develop', 'refs/tags/main']) {
                for (const deploy of [undefined, false, true]) assert.equal(allows(condition(job), event, ref, deploy), false);
            }
        }
        for (const deploy of [undefined, false]) assert.equal(allows(condition(job), 'workflow_dispatch', 'refs/heads/main', deploy), false);
    }
});

test('explicit dispatch succeeds only on the main branch', () => {
    for (const job of ['package', 'deploy']) {
        assert.equal(allows(condition(job), 'workflow_dispatch', 'refs/heads/main', true), true);
        for (const ref of ['refs/heads/develop', 'refs/heads/feature/main', 'refs/tags/main', 'refs/pull/7/merge']) {
            assert.equal(allows(condition(job), 'workflow_dispatch', ref, true), false);
        }
    }
});

test('failed, cancelled or skipped validation blocks packaging and deployment', () => {
    assert.match(jobs.package, /^    needs: build$/m);
    assert.match(jobs.deploy, /^    needs: \[build, package\]$/m);
    for (const status of ['failure', 'cancelled', 'skipped']) {
        for (const job of ['package', 'deploy']) assert.equal(allows(condition(job), 'workflow_dispatch', 'refs/heads/main', true, status), false);
        assert.equal(allows(condition('deploy'), 'workflow_dispatch', 'refs/heads/main', true, 'success', status), false);
    }
});

test('packaging uses the validated revision and preserves timeline generation', () => {
    assert.match(jobs.package, /ref: \$\{\{ github.sha \}\}/);
    assert.equal(runBlocks('build').length, 5);
    assert.equal(runBlocks('package').length, 1);
    assert.equal(runBlocks('build')[4], runBlocks('package')[0]);
    assert.match(jobs.package, /uses: actions\/upload-pages-artifact@v3/);
    assert.match(jobs.package, /path: portal/);
    assert.match(jobs.deploy, /name: github-pages/);
    assert.match(jobs.deploy, /uses: actions\/deploy-pages@v4/);
    assert.doesNotMatch(jobs.deploy, /shell:|run:|uses: actions\/checkout/);
});

test('dispatch is explicitly described as separate from publication authorization', () => {
    assert.match(source, /requires separate publication authorization/);
    assert.match(source, /do not grant clearance/);
});

test('build includes mandatory technical checks with explicit failure handling', () => {
    const blocks = runBlocks('build');
    assert.equal(blocks.length, 5);
    assert.match(jobs.build, /name: Run workflow regression tests/);
    assert.match(jobs.build, /name: Check JavaScript syntax/);
    assert.match(jobs.build, /name: Check PowerShell syntax/);
    assert.match(blocks[0], /node --test tests\/workflow.Tests.cjs/);
    assert.match(blocks[0], /\$LASTEXITCODE -ne 0/);
    assert.match(blocks[1], /node --check \$File.FullName/);
    assert.match(blocks[1], /\$LASTEXITCODE -ne 0/);
    assert.match(blocks[2], /Parser\]::ParseFile/);
    assert.match(blocks[2], /if \(\$ErrorCount -gt 0\)/);
    for (const block of blocks.slice(0, 3)) assert.match(block, /throw /);
    assert.doesNotMatch(jobs.build, /Test-HIEPDocument|Invoke-Pester|continue-on-error|upload-artifact|upload-pages-artifact/);
});

const { spawnSync } = require('node:child_process');
const powershell = process.env.HIEP_TEST_PWSH || 'pwsh';
function executeCheck(prelude, block) {
    const result = spawnSync(powershell, ['-NoProfile', '-NonInteractive', '-Command', "$ErrorActionPreference = 'Stop'; " + prelude + '\n' + block], { encoding: 'utf8' });
    assert.ifError(result.error);
    assert.notEqual(result.status, null, result.stderr);
    return result;
}

test('native test and syntax failures produce nonzero exit codes', () => {
    const blocks = runBlocks('build');
    const mockNode = 'function node { $global:LASTEXITCODE = 17 }; ';
    const mockFiles = "function Get-ChildItem { [pscustomobject]@{ Extension = '.js'; FullName = 'synthetic.js' } }; ";
    for (const [prelude, block] of [[mockNode, blocks[0]], [mockNode + mockFiles, blocks[1]]]) {
        const result = executeCheck(prelude, block);
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /failed/);
    }
});

test('PowerShell parse errors and empty file discovery fail closed', () => {
    const block = runBlocks('build')[2];
    const mockFiles = "function Get-ChildItem { [pscustomobject]@{ Extension = '.ps1'; FullName = 'nonexistent-synthetic-file.ps1' } }; ";
    const result = executeCheck(mockFiles, block);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /PowerShell syntax validation failed/);
    for (const check of runBlocks('build').slice(1, 3)) {
        const empty = executeCheck('function Get-ChildItem { }; ', check);
        assert.notEqual(empty.status, 0);
        assert.match(empty.stderr, /No .* files found/);
    }
});
