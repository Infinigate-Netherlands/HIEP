#Requires -Version 7.4

Import-Module (Join-Path $PSScriptRoot '../src/HIEP.Tools/HIEP.Tools.psd1') -Force

Describe 'Test-HIEPDocument contract' {
    BeforeEach {
        $ErrorActionPreference = 'Stop'
        # Pester owns TestDrive; no fixture is placed in the real repository.
        $FixtureRoot = Join-Path $TestDrive ([guid]::NewGuid().ToString())
        $ConfigurationDirectory = Join-Path $FixtureRoot 'build/config'
        $DocumentDirectory = Join-Path $FixtureRoot 'docs/governance'
        $null = New-Item -ItemType Directory -Path $ConfigurationDirectory, $DocumentDirectory
        @{
            documentation = @{
                documentTypes = @{
                    GOV = @{ path = 'docs/governance' }
                }
            }
        } | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $ConfigurationDirectory 'HIEP.json')
        $DocumentPath = Join-Path $DocumentDirectory 'HIEP-GOV-001-synthetic.md'
        $DocumentText = @'
---
document:
  id: HIEP-GOV-001
  title: Synthetic fixture
  type: GOV
  version: 0.1.0
  status: Draft
  owner: Synthetic fixture owner
  authors: []
  created: 2026-01-01
  updated: 2026-01-02
  classification: Internal
  reviewers: []
  approvers: []
---

# Synthetic fixture
'@
        Set-Content -LiteralPath $DocumentPath -Value $DocumentText
    }

    # Approved here is a metadata value, never an approval assertion.
    foreach ($Status in @('Draft', 'Review', 'Approved', 'Deprecated', 'Archived')) {
        foreach ($Classification in @('Public', 'Internal', 'Confidential', 'Restricted')) {
            It "accepts $Status with $Classification" -TestCases @(@{
                Status = $Status
                Classification = $Classification
            }) {
                param ($Status, $Classification)
                $Text = $DocumentText.Replace('status: Draft', "status: $Status").Replace('classification: Internal', "classification: $Classification")
                Set-Content -LiteralPath $DocumentPath -Value $Text
                Test-HIEPDocument -Path $FixtureRoot | Should Be $true
                $Result = Test-HIEPDocument -Path $DocumentPath -PassThru
                $Result.Status | Should Be $Status
                $Result.Classification | Should Be $Classification
            }
        }
    }

    $InvalidValues = @(
        @{ Field = 'status'; Old = 'Draft'; Value = 'Unknown'; Error = 'Unsupported lifecycle status' }
        @{ Field = 'classification'; Old = 'Internal'; Value = 'Secret'; Error = 'Unsupported classification' }
        @{ Field = 'id'; Old = 'HIEP-GOV-001'; Value = 'invalid'; Error = 'Invalid HIEP document identifier' }
        @{ Field = 'type'; Old = 'GOV'; Value = 'ARC'; Error = 'Unsupported HIEP document type' }
        @{ Field = 'version'; Old = '0.1.0'; Value = '1.0'; Error = 'Invalid HIEP document version' }
        @{ Field = 'created'; Old = '2026-01-01'; Value = '2026-02-30'; Error = 'Invalid created date' }
        @{ Field = 'updated'; Old = '2026-01-02'; Value = 'invalid'; Error = 'Invalid updated date' }
        @{ Field = 'updated'; Old = '2026-01-02'; Value = '2025-12-31'; Error = 'earlier than created' }
    )
    It 'rejects invalid <Field> value <Value> without changing input' -TestCases $InvalidValues {
        param ($Field, $Old, $Value, $Error)
        Set-Content -LiteralPath $DocumentPath -Value $DocumentText.Replace("${Field}: $Old", "${Field}: $Value")
        $Before = (Get-FileHash -LiteralPath $DocumentPath).Hash
        { Test-HIEPDocument -Path $DocumentPath } | Should Throw $Error
        (Get-FileHash -LiteralPath $DocumentPath).Hash | Should Be $Before
    }

    $RequiredFields = @('id', 'title', 'type', 'version', 'status', 'owner', 'authors', 'created', 'updated', 'classification')
    foreach ($Field in $RequiredFields) {
        It "rejects missing $Field" -TestCases @(@{ Field = $Field }) {
            param ($Field)
            $Text = $DocumentText -replace "(?m)^  ${Field}:.*\r?\n", ''
            Set-Content -LiteralPath $DocumentPath -Value $Text
            { Test-HIEPDocument -Path $DocumentPath } | Should Throw "missing required metadata field '$Field'"
        }
    }

    It 'rejects absent front matter' {
        Set-Content -LiteralPath $DocumentPath -Value '# Synthetic fixture'
        { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'does not begin with YAML front matter'
    }

    It 'rejects mismatched ID and configured type' {
        $Configuration = Get-Content (Join-Path $ConfigurationDirectory 'HIEP.json') -Raw | ConvertFrom-Json
        $Configuration.documentation.documentTypes | Add-Member ARC @{ path = 'docs/architecture' }
        $Configuration | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $ConfigurationDirectory 'HIEP.json')
        Set-Content -LiteralPath $DocumentPath -Value $DocumentText.Replace('type: GOV', 'type: ARC')
        { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'does not match document identifier'
    }

    It 'rejects a filename with a different ID' {
        $OtherPath = Join-Path $DocumentDirectory 'HIEP-GOV-002-synthetic.md'
        Set-Content -LiteralPath $OtherPath -Value $DocumentText
        { Test-HIEPDocument -Path $OtherPath } | Should Throw 'Filename'
    }

    It 'rejects a document outside its configured directory' {
        $OtherPath = Join-Path $FixtureRoot 'HIEP-GOV-001-synthetic.md'
        Set-Content -LiteralPath $OtherPath -Value $DocumentText
        { Test-HIEPDocument -Path $OtherPath } | Should Throw 'expected'
    }

    It 'rejects duplicate IDs in a repository scan' {
        Set-Content -LiteralPath (Join-Path $DocumentDirectory 'HIEP-GOV-001-second.md') -Value $DocumentText
        { Test-HIEPDocument -Path $FixtureRoot } | Should Throw 'Duplicate HIEP document ID'
    }

    It 'preserves Boolean and PassThru output with empty participation lists' {
        $Before = (Get-FileHash -LiteralPath $DocumentPath).Hash
        $Result = @(Test-HIEPDocument -Path $FixtureRoot)
        $Result.Count | Should Be 1
        ($Result[0] -is [bool]) | Should Be $true
        $Result[0] | Should Be $true
        $Documents = @(Test-HIEPDocument -Path $FixtureRoot -PassThru)
        $Documents.Count | Should Be 1
        $Documents[0].Id | Should Be 'HIEP-GOV-001'
        $Documents[0].Path | Should Be $DocumentPath
        $Documents[0].Type | Should Be 'GOV'
        $Documents[0].Version | Should Be '0.1.0'
        @($Documents[0].Metadata.authors).Count | Should Be 0
        @($Documents[0].Metadata.reviewers).Count | Should Be 0
        @($Documents[0].Metadata.approvers).Count | Should Be 0
        (Get-FileHash -LiteralPath $DocumentPath).Hash | Should Be $Before
    }

    It 'exports the validator through the existing module manifest' {
        $Command = Get-Command Test-HIEPDocument -Module HIEP.Tools
        $Command.Name | Should Be 'Test-HIEPDocument'
        $Command.Parameters.ContainsKey('Path') | Should Be $true
        $Command.Parameters.ContainsKey('PassThru') | Should Be $true
    }

    It 'rejects duplicate metadata keys without changing input' {
        Set-Content -LiteralPath $DocumentPath -Value $DocumentText.Replace('  title: Synthetic fixture', "  title: Synthetic fixture`n  title: Conflicting title")
        $Before = (Get-FileHash -LiteralPath $DocumentPath).Hash
        { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'Duplicate HIEP metadata field'
        (Get-FileHash -LiteralPath $DocumentPath).Hash | Should Be $Before
    }

    It 'rejects duplicate document sections' {
        Set-Content -LiteralPath $DocumentPath -Value $DocumentText.Replace('document:', "document:`ndocument:")
        { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'Duplicate HIEP front matter'
    }

    It 'rejects duplicate keys with different casing' {
        Set-Content -LiteralPath $DocumentPath -Value $DocumentText.Replace('  title: Synthetic fixture', "  title: Synthetic fixture`n  Title: Conflicting title")
        { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'Duplicate HIEP metadata field'
    }

    It 'rejects inline flow collections rather than interpreting them as text' {
        Set-Content -LiteralPath $DocumentPath -Value $DocumentText.Replace('  title: Synthetic fixture', '  title: [first, second]')
        { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'Unsupported HIEP flow collection'
    }

    It 'rejects a scalar supplied for optional tags' {
        Set-Content -LiteralPath $DocumentPath -Value $DocumentText.Replace('  approvers: []', "  approvers: []`n  tags: invalid-scalar")
        { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'must be a list'
    }

    It 'rejects unsupported root content instead of silently ignoring it' {
        Set-Content -LiteralPath $DocumentPath -Value $DocumentText.Replace('document:', "unexpected: value`ndocument:")
        { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'Unsupported content before'
    }

    It 'rejects malformed indentation' {
        Set-Content -LiteralPath $DocumentPath -Value $DocumentText.Replace('  title:', '   title:')
        { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'Unsupported HIEP front matter syntax'
    }

    foreach ($Field in @('title', 'owner', 'status', 'classification')) {
        It "rejects a list supplied for scalar $Field" -TestCases @(@{ Field = $Field }) {
            param ($Field)
            $Text = $DocumentText -replace "(?m)^  ${Field}:.*$", "  ${Field}: []"
            Set-Content -LiteralPath $DocumentPath -Value $Text
            { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'must be a scalar string'
        }
    }

    foreach ($Field in @('authors', 'reviewers', 'approvers')) {
        It "rejects a scalar supplied for list $Field" -TestCases @(@{ Field = $Field }) {
            param ($Field)
            $Text = $DocumentText.Replace("  ${Field}: []", "  ${Field}: Synthetic person")
            Set-Content -LiteralPath $DocumentPath -Value $Text
            { Test-HIEPDocument -Path $DocumentPath } | Should Throw 'must be a list'
        }
    }
}
