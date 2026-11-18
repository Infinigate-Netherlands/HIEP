---
id: HIEP-UPD-0014
title: HIEP roadmap and bilingual portal source aligned
date: 2026-11-18
type: documentation
status: completed
summary: Roadmap and English/Dutch portal source were aligned with the reviewed README baseline, correcting outdated links and operational publication claims.
tags:
  - documentation
  - portal
  - roadmap
  - localization
commits:
  - e9dcc5d409819e2d0702827912ee223068183853
pullRequests:
  - 11
---

# HIEP roadmap and bilingual portal source aligned

## Summary

Roadmap and English/Dutch portal source were aligned with the reviewed README baseline, correcting outdated links and operational publication claims.

## Why this matters

Consistent public source content helps readers understand current project maturity without mistaking merged portal code for a completed Pages publication.

## Changes

- Correct roadmap publication claims and describe merged technical work separately from unverified CI runtime and planned capabilities.
- Add reviewed English/Dutch portal functionality, language preference handling and translated timeline fallbacks.
- Retain the relative timeline fetch and safe text rendering; add focus, skip-link and reduced-motion support.
- Replace obsolete repository links and condense resource content, using text-only proposed branding without deleting the logo asset.

## Related work

- [PR #11](https://github.com/Infinigate-Netherlands/HIEP/pull/11), merged on 18 November 2026.
- [Merge commit e9dcc5d409819e2d0702827912ee223068183853](https://github.com/Infinigate-Netherlands/HIEP/commit/e9dcc5d409819e2d0702827912ee223068183853).

## Known limitations

This milestone is the merge of portal source, not a GitHub Pages deployment. The workflow remained disabled and the hosted site still served the earlier deployment. PR #11 records 11 passing local tests using a simulated DOM and an untracked test file, not browser validation or tests added to CI. Browser accessibility/layout, branding and translations remained subject to review. Existing Project Updates, generated timeline data, workflows and approval metadata were unchanged.

## Next steps

Review the candidate in a real browser and complete content review before any separately authorized publication. Adding milestone sources does not by itself update the hosted timeline.
