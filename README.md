# Healthcare Identity Eco Platform (HIEP)

HIEP is a documentation-as-code project for secure digital identity and access
management in healthcare. It brings reusable knowledge, architecture principles,
security guidance and interoperable patterns together in a reviewable repository.

The organizational owner is **Infinigate Nederland**. The public upstream is
[Infinigate-Netherlands/HIEP](https://github.com/Infinigate-Netherlands/HIEP).
HIEP pursues open, vendor-neutral collaboration and knowledge sharing. It is under
development, not a production identity service or a commercial Infinigate product.

## Project status, roadmap and updates

Visit the [public project portal](https://infinigate-netherlands.github.io/HIEP/)
for published project information and the timeline. Public availability does not
mean automated publication is currently active; see the dated deployment status
below.

| Maturity | Current position |
| --- | --- |
| Implemented | Repository/bootstrap foundation, standards, templates and PowerShell tooling for document metadata, candidate identifiers and validation |
| Implemented | Structured Project Updates, update creation/validation, timeline generation and a static HTML/CSS/JavaScript portal |
| Merged, runtime unverified | Separate build/package/deploy jobs and additional CI regression/syntax checks; PR #9 is merged |
| Under development | Public architecture/security content, contribution guidance, bilingual portal review and project handover |
| Planned | Local/private HIEP distribution, synchronization design, AI/MCP integrations and publication eligibility enforcement |

A directory, placeholder or Draft document is not evidence of a completed or
approved capability. Candidate identifier allocation is not identifier reservation.
Local test success does not prove GitHub runtime success or release acceptance.

## Public upstream and intended local instances

The public upstream is the reusable documentation and tooling baseline. Markdown,
structured metadata, templates, PowerShell and Git support traceable changes and
collaborative review. It does not host production healthcare identity services.

The intended architecture separates this public baseline from local HIEP instances
containing an organization's own context. Private extensions are intended to stay
in separately access-controlled repositories or storage, outside public upstream
and public build output. This is a planned distribution direction, not a delivered
installer, supported release model or automatic synchronization mechanism.

Shared AI context files exist in [ai/shared/](ai/shared/). Future AI integrations
may assist local knowledge work, subject to explicit access and disclosure
controls. Live AI/MCP integrations and automated public/private synchronization
are not implemented distribution capabilities.

The [LICENSE](LICENSE) file is currently empty. Public repository visibility does
not supply licensing terms; distribution and reuse rights require resolution.

## Information handling and governance

Repository administration, document ownership, review, governance approval and
publication clearance are separate concepts. A GitHub permission, review, merge,
successful validation or deployment does not establish governance authority or
publication authorization. Draft proposals are not approved organizational policy.

Internal, Confidential and Restricted content, credentials, customer-specific
information and private governance records must remain outside public contributions
and generated artifacts. Classification and lifecycle metadata must be preserved.
Summarization or metadata removal does not by itself make private source material
eligible for publication.

The current workflow provides technical deployment conditions, not an enforced
Publication Eligibility Gate. Publication eligibility and the authority to approve
publication remain separate from validation success. This overview does not
establish new approval roles or governance policy.

## Architecture principles

The [Architecture Principles](standards/Architecture-Principles.md) guide design:

- treat identity as a security boundary and verify explicitly;
- apply least privilege and minimize permanent privilege;
- prefer phishing-resistant authentication where appropriate;
- separate authentication from authorization;
- design for the complete identity lifecycle;
- use open standards and interoperability where practical;
- minimize trust and design for failure;
- make security observable and protect sensitive data;
- separate logical from physical architecture;
- automate repeatable controls and document decisions and assumptions.

These principles guide further work; their presence is not proof of a complete
solution architecture or production implementation.

## Repository structure and documentation

| Area | Purpose |
| --- | --- |
| [docs/00-reference/](docs/00-reference/) | Reference material and project foundations |
| [docs/01-business/](docs/01-business/) | Business context and use cases |
| [docs/02-architecture/](docs/02-architecture/) | Architecture documentation |
| [docs/03-security/](docs/03-security/) | Security documentation |
| [docs/04-vendors/](docs/04-vendors/) | Vendor knowledge |
| [docs/09-governance/](docs/09-governance/) | Governance documentation |
| [docs/glossary/](docs/glossary/) | Terminology |
| [standards/](standards/) | Documentation and engineering standards |
| [templates/documents/](templates/documents/) | Managed-document templates |
| [src/HIEP.Tools/](src/HIEP.Tools/) | PowerShell automation, targeting PowerShell 7.4+ |
| [build/](build/) | Bootstrap and machine-readable configuration |
| [tests/](tests/) | Managed-document and workflow regression tests |
| [updates/](updates/) | Structured Project Updates |
| [portal/](portal/) | Static public portal source |
| [ai/shared/](ai/shared/) | Shared AI context |

Some public document files are empty placeholders. Their location describes the
intended subject, not completed content or approval.

Managed documents follow the
[Document Standard](standards/HIEP-Document-Standard.md) and
[Document Lifecycle](standards/Document-Lifecycle.md). Authors should also follow
the [Markdown](standards/Markdown-Standards.md),
[Mermaid](standards/Mermaid-Standards.md) and
[PowerShell](standards/PowerShell-Standards.md) standards.
Validation checks implemented rules; it does not grant governance approval.

## Project updates and timeline

Project Updates have stable identifiers and structured metadata. See the
[update guide](updates/README.md) and
[Project Update Standard](standards/Project-Update-Standard.md).

The timeline generator transforms updates into portal data. It does not establish
publication clearance for source text or metadata. Eligible public content must be
reviewed separately before distribution.

## GitHub Actions and GitHub Pages

Verified status as of **18 November 2026**, against public main
`2c3791142b872aecada7fe5edd33f568c32a9230`:

- PR #9 is merged. Its additional technical checks passed local validation;
  successful execution of the new CI on GitHub has not yet been demonstrated.
- The single `Deploy HIEP Portal` workflow is `disabled_manually`.
- GitHub Pages is configured for workflow-based deployment.
- The [portal](https://infinigate-netherlands.github.io/HIEP/) and
  [timeline data](https://infinigate-netherlands.github.io/HIEP/data/timeline.json)
  were reachable with HTTP 200 during the Phase A inventory.
- The last recorded successful Pages deployment was **23 September 2026**, from
  commit `b6ee08b73c32c2a5621ee7a543a4f603934ff190`.
- The latest recorded Actions run was the failed PR #7 run on 18 November 2026,
  before the newer CI configuration was merged.

The site remains publicly available while automated publication is paused.
Reachability does not demonstrate deployment of current main or the local
bilingual portal revision.

When enabled, the configured workflow behaves as follows:

| Job | Conditions and work |
| --- | --- |
| build | Branch pushes, pull requests and manual dispatch: regression tests, JavaScript/PowerShell syntax checks, Project Update validation and timeline generation |
| package | Only manual dispatch with `deploy=true` on main, after successful build; prepares the Pages artifact |
| deploy | Same explicit dispatch/main conditions, after successful build and package; deploys the artifact |

Manual dispatch defaults to `deploy=false`. Ordinary pushes and pull requests do
not package or deploy. Default token permissions are contents-read; Pages/OIDC
write permissions exist only in the deployment job. Technical opt-in does not
supply publication authorization.

See the [workflow source](.github/workflows/deploy-portal.yml) and
[Actions history](https://github.com/Infinigate-Netherlands/HIEP/actions).
Repository-wide managed-document validation is not currently a CI gate because
public placeholders are incomplete. Pester runner compatibility and YAML/actionlint
coverage remain follow-up work.

## Roadmap and next priorities

[ROADMAP.md](ROADMAP.md) records the high-level development direction. Its statements
describing automated publication as operational predate the current workflow pause;
use the dated status above for current deployment facts.

Next priorities are controlled CI activation and a validation-only run with
`deploy=false`, runtime/log review, publication-governance decisions, bilingual
portal review, public architecture/security documentation and a controlled handover.
Local distribution, synchronization and AI integration remain planned work without
a claimed release date or completion percentage.

## Contributing

Follow the repository standards and propose small, traceable changes against the
public upstream. Keep private organizational context out of public issues, PRs,
logs and artifacts. Do not change classification or approval metadata simply to
make content publishable.

Contribution guidance is still developing. Document maturity, governance approval,
licensing, technical validation and publication clearance must each be assessed on
their own evidence. This README does not authorize workflow activation or deployment.
