'use strict';

// Dependency-free simulated-DOM checks; no real browser, server or network.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'portal/index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'portal/assets/js/site.js'), 'utf8');

class Element {
    constructor(tag = 'div') { this.tag = tag; this.children = []; this.dataset = {}; this.attributes = {}; this.textContent = ''; this.listeners = {}; }
    setAttribute(key, value) { this.attributes[key] = value; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
    addEventListener(event, callback) { this.listeners[event] = callback; }
}

async function portal({ stored = null, blocked = false, updates = [], ok = true, reject = false, response, pending = false, invalidJson = false } = {}) {
    const timeline = new Element();
    const count = new Element();
    const requests = [];
    const group = new Element();
    const buttons = ['en', 'nl'].map(language => { const button = new Element('button'); button.dataset.language = language; return button; });
    const nodes = { 'data-i18n': [], 'data-i18n-aria': [], 'data-i18n-content': [] };
    for (const attribute of Object.keys(nodes)) {
        for (const match of html.matchAll(new RegExp(attribute + '="([^"]+)"', 'g'))) {
            const node = new Element();
            node.dataset[{ 'data-i18n': 'i18n', 'data-i18n-aria': 'i18nAria', 'data-i18n-content': 'i18nContent' }[attribute]] = match[1];
            nodes[attribute].push(node);
        }
    }
    const storage = { value: stored };
    const document = {
        documentElement: { lang: 'en' }, title: '',
        getElementById: id => ({ timeline, 'timeline-count': count })[id],
        createElement: tag => new Element(tag),
        querySelector: () => group,
        querySelectorAll: selector => selector === '[data-language]' ? buttons : nodes[selector.slice(1, -1)]
    };
    const context = vm.createContext({ document, window: { localStorage: {
        getItem: () => { if (blocked) throw new Error('blocked'); return storage.value; },
        setItem: (key, value) => { if (blocked) throw new Error('blocked'); storage.value = value; }
    } }, fetch: async (url, options) => {
        requests.push({ url, options });
        if (pending) return new Promise(() => {});
        if (reject) throw new Error('offline');
        return { ok, json: async () => {
            if (invalidJson) throw new Error('invalid JSON');
            return response === undefined ? { updates } : response;
        } };
    } });
    vm.runInContext(script, context);
    await new Promise(resolve => setImmediate(resolve));
    return { context, document, timeline, count, requests, nodes, buttons, storage, click: language => buttons.find(button => button.dataset.language === language).listeners.click() };
}

const update = { id: 'HIEP-UPD-0007', title: 'Project Update creation tooling implemented', summary: 'HIEP can now create structured Project Updates through its PowerShell tooling.', date: '2026-09-17', type: 'development', status: 'completed' };

test('all static text, accessibility and metadata keys have both translations', async () => {
    const app = await portal();
    const translations = vm.runInContext('translations', app.context);
    assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.nl).sort());
    for (const [attribute, nodes] of Object.entries(app.nodes)) {
        const property = { 'data-i18n': 'i18n', 'data-i18n-aria': 'i18nAria', 'data-i18n-content': 'i18nContent' }[attribute];
        for (const node of nodes) for (const language of ['en', 'nl']) assert.ok(translations[language][node.dataset[property]]);
    }
});

test('new visitors default to English; invalid preference is ignored', async () => {
    assert.equal((await portal()).document.documentElement.lang, 'en');
    assert.equal((await portal({ stored: 'unknown' })).document.documentElement.lang, 'en');
});

test('language switch updates text, labels, metadata, pressed state and saved preference', async () => {
    const app = await portal();
    app.click('nl');
    assert.equal(app.document.documentElement.lang, 'nl');
    assert.equal(app.storage.value, 'nl');
    assert.equal(app.nodes['data-i18n-aria'][0].attributes['aria-label'], 'Hoofdnavigatie');
    assert.match(app.nodes['data-i18n-content'][0].attributes.content, /zorg/);
    assert.equal(app.buttons[1].attributes['aria-pressed'], 'true');
    app.click('en');
    assert.equal(app.storage.value, 'en');
    assert.equal(app.document.documentElement.lang, 'en');
});

test('saved preference restores Dutch on a new visit', async () => {
    assert.equal((await portal({ stored: 'nl' })).document.documentElement.lang, 'nl');
});

test('blocked storage does not prevent language switching', async () => {
    const app = await portal({ blocked: true });
    app.click('nl');
    assert.equal(app.document.documentElement.lang, 'nl');
});

test('canonical update and its Dutch translation render and switch correctly', async () => {
    const app = await portal({ updates: [update] });
    assert.equal(app.timeline.children[0].children[1].textContent, update.title);
    app.click('nl');
    assert.match(app.timeline.children[0].children[1].textContent, /projectupdates/);
    assert.equal(app.timeline.children[0].children[1].attributes.lang, 'nl');
    assert.equal(app.timeline.attributes['aria-busy'], 'false');
});

test('existing historical translations match source wording without requiring every update translated', async () => {
    const app = await portal();
    const dictionary = vm.runInContext('timelineDutch', app.context);
    const sources = sourceUpdates();
    for (const [id, translation] of Object.entries(dictionary)) {
        const source = sources.find(update => update.id === id);
        assert.ok(source, 'translation must refer to an existing source: ' + id);
        assert.equal(translation.sourceTitle, source.title);
        assert.equal(translation.sourceSummary, source.summary);
        assert.ok(translation.title && translation.summary);
    }
});

test('changed canonical wording invalidates stale translations', async () => {
    const app = await portal({ stored: 'nl', updates: [{ ...update, title: 'Changed title' }] });
    assert.equal(app.timeline.children[0].children[1].textContent, 'Changed title');
    assert.equal(app.timeline.children[0].children[1].attributes.lang, 'en');
    assert.match(app.timeline.children[0].children[3].textContent, /Engels/);
});

test('empty and failed timelines have translated accessible messages', async () => {
    const empty = await portal({ stored: 'nl' });
    assert.match(empty.timeline.children[0].textContent, /geen projectupdates/);
    for (const options of [{ ok: false }, { reject: true }, { response: {} }, { updates: [null] }]) {
        const failed = await portal({ ...options, stored: 'nl' });
        assert.match(failed.timeline.children[0].textContent, /niet beschikbaar/);
        assert.equal(failed.timeline.attributes['aria-busy'], 'false');
    }
});

test('timeline text is never parsed as HTML', async () => {
    const value = '<img src=x onerror=alert(1)>';
    const app = await portal({ updates: [{ ...update, title: value, summary: value }] });
    assert.equal(app.timeline.children[0].children[1].textContent, value);
    assert.equal(app.timeline.children[0].children[2].textContent, value);
    assert.doesNotMatch(script, /innerHTML|outerHTML|insertAdjacentHTML|document\.write/);
});

test('canonical links, fragment targets, text-only branding and static architecture', () => {
    assert.doesNotMatch(html, /scorpido74|<iframe|<img|https?:\/\/[^"\s]+\.js/);
    assert.match(html, /https:\/\/github.com\/Infinigate-Netherlands\/HIEP/);
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes('id="' + match[1] + '"'));
    assert.match(html, /Initiated and powered by Infinigate Netherlands/);
});

function sourceUpdates(directory = path.join(root, 'updates')) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) return sourceUpdates(file);
        if (!entry.name.endsWith('.md') || entry.name === 'README.md') return [];
        // Simple display fixture extraction, not a replacement for the HIEP validator.
        const text = fs.readFileSync(file, 'utf8');
        return [Object.fromEntries(['id', 'title', 'summary', 'date', 'type', 'status'].map(key => {
            const match = text.match(new RegExp('^' + key + ': (.+)$', 'm'));
            assert.ok(match, 'missing fixture field: ' + key);
            return [key, match[1].trim()];
        }))];
    });
}

test('counts follow loaded arrays for zero, one, fourteen and future totals in both languages', async () => {
    for (const size of [0, 1, 14, 27]) {
        const updates = Array.from({ length: size }, (_, index) => ({ ...update, id: 'synthetic-' + index }));
        const app = await portal({ updates });
        assert.equal(app.count.hidden, false);
        assert.equal(app.count.textContent, 'Loaded ' + size + ' project updates.');
        assert.equal(app.timeline.children.length, size || 1);
        app.click('nl');
        assert.equal(app.count.textContent, size + ' projectupdates geladen.');
        app.click('en');
        assert.equal(app.count.textContent, 'Loaded ' + size + ' project updates.');
    }
});

test('optional JSON count metadata cannot override successfully loaded array length', async () => {
    for (const count of [999, -1, 'unsafe', null]) {
        const app = await portal({ response: { count, updates: [update, { ...update, id: 'synthetic' }] } });
        assert.equal(app.count.textContent, 'Loaded 2 project updates.');
    }
});

test('loading and all request/data failures clear and hide counts in either language', async () => {
    for (const stored of ['en', 'nl']) {
        for (const options of [
            { pending: true }, { ok: false }, { reject: true }, { invalidJson: true },
            { response: null }, { response: {} }, { response: { updates: 'invalid' } },
            { updates: [null] }, { updates: [{ ...update, title: 42 }] }
        ]) {
            const app = await portal({ stored, ...options });
            assert.equal(app.count.hidden, true);
            assert.equal(app.count.textContent, '');
            app.click(stored === 'nl' ? 'en' : 'nl');
            assert.equal(app.count.hidden, true);
            assert.equal(app.count.textContent, '');
        }
    }
});

test('all current source updates render with dynamic count and untranslated updates use English fallback', async () => {
    const updates = sourceUpdates();
    const app = await portal({ stored: 'nl', updates });
    const dictionary = vm.runInContext('timelineDutch', app.context);
    assert.equal(app.count.textContent, updates.length + ' projectupdates geladen.');
    assert.equal(app.timeline.children.length, updates.length);
    updates.forEach((update, index) => {
        const article = app.timeline.children[index];
        assert.equal(article.children[0].children[3].textContent, update.id);
        if (!Object.hasOwn(dictionary, update.id)) {
            assert.equal(article.children[1].textContent, update.title);
            assert.equal(article.children[1].attributes.lang, 'en');
            assert.match(article.children[3].textContent, /Engels/);
        }
    });
});

test('received order is preserved and language changes do not refetch the timeline', async () => {
    const updates = [
        { ...update, id: 'synthetic-old', date: '2020-01-01' },
        { ...update, id: 'synthetic-new', date: '2030-01-01' }
    ];
    const app = await portal({ updates });
    const renderedIds = () => app.timeline.children.map(article => article.children[0].children[3].textContent);
    assert.deepEqual(renderedIds(), updates.map(update => update.id));
    app.click('nl');
    assert.deepEqual(renderedIds(), updates.map(update => update.id));
    assert.equal(app.requests.length, 1);
    assert.equal(app.requests[0].url, 'data/timeline.json');
    assert.equal(app.requests[0].options.cache, 'no-store');
});

test('count is an initially hidden atomic status message and timeline copy has no fixed total', () => {
    assert.match(html, /<p id="timeline-count" role="status" aria-atomic="true" hidden><\/p>/);
    assert.doesNotMatch(html, /nine existing source updates|no corresponding Project Update yet/);
    assert.doesNotMatch(script, /nine existing source updates|negen bestaande bronupdates/);
});
