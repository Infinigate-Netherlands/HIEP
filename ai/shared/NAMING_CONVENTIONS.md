# HIEP Naming Conventions

## Purpose

This document defines naming conventions used throughout the Healthcare Identity Eco
Platform.

Consistency is preferred over personal naming preferences.

## Project Name

Use:

**Healthcare Identity Eco Platform**

Use the abbreviation:

**HIEP**

Do not introduce alternative expansions of HIEP.

## Document Prefix

Managed HIEP documents use the prefix:

`HIEP`

Examples:

- `HIEP-BUS-001.md`
- `HIEP-ARC-001.md`
- `HIEP-SEC-001.md`
- `HIEP-VND-001.md`
- `HIEP-GOV-001.md`

## Document Categories

Preferred category identifiers include:

| Identifier | Category |
|---|---|
| BUS | Business |
| ARC | Architecture |
| SEC | Security |
| VND | Vendor |
| INT | Integration |
| DEM | Demo platform |
| WKS | Workshop |
| MKT | Marketing |
| GOV | Governance |
| GLS | Glossary |
| ADR | Architecture Decision Record |

Additional identifiers may be introduced when documented and consistently applied.

The configured managed document types are currently `BUS`, `ARC`, `SEC`, `VND`, `GOV` and `GLS`. The other category labels above do not establish support in managed-document tooling.

## Numbering

Numbered documents use three digits.

Examples:

`001`

`002`

`010`

`100`

Do not use:

`1`

`01`

## Markdown Files

Use descriptive PascalCase or the managed HIEP document convention depending on the
purpose of the file.

Examples:

`Architecture-Principles.md`

`Document-Lifecycle.md`

`HIEP-ARC-001.md`

## Directories

Use lowercase directory names unless a technical convention requires otherwise.

Examples:

`docs`

`templates`

`workshops`

`diagrams`

## PowerShell

Use approved PowerShell verb-noun naming.

Examples:

`Get-HIEPConfiguration`

`Test-HIEPConfiguration`

`Initialize-HIEPContent`

HIEP-specific functions should normally use `HIEP` in the noun.

## PowerShell Variables

Use PascalCase for variables.

Examples:

`$RepositoryRoot`

`$ConfigurationPath`

`$TemplatePath`

Avoid cryptic abbreviations.

## JSON

Use camelCase for JSON properties.

Examples:

`defaultBranch`

`overwriteExisting`

`populateEmptyFiles`

`sharedContext`

## Mermaid

Use short, stable node identifiers and readable labels.

Example:

```text
IdP["Identity Provider"]
App["Healthcare Application"]
```

Do not use generated random identifiers unless required.

## Git Branches

Preferred branch prefixes include:

feature/

fix/

docs/

refactor/

chore/

Examples:

feature/content-bootstrap

docs/security-architecture

## Commits

HIEP uses Conventional Commits.

Examples:

feat: add content bootstrap

fix: correct repository path validation

docs: add architecture principles

refactor: simplify bootstrap configuration

chore: update development settings

## General Rule

Names should communicate intent without requiring repository-specific tribal
knowledge.

When introducing a new naming pattern, document it before using it broadly.
