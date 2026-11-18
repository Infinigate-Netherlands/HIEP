---
id: HIEP-UPD-0011
title: HIEP validation separated from explicit Pages deployment
date: 2026-11-18
type: development
status: completed
summary: Validation was separated from Pages artifact packaging and deployment, with ordinary pushes and pull requests restricted to validation.
tags:
  - ci
  - github-actions
  - github-pages
  - deployment
commits:
  - 11ef24664ca00d1659262b1b4010e0e3389e7680
pullRequests:
  - 8
---

# HIEP validation separated from explicit Pages deployment

## Summary

Validation was separated from Pages artifact packaging and deployment, with ordinary pushes and pull requests restricted to validation.

## Why this matters

Technical checks can be separated from public publication. Ordinary validation no longer needs the artifact-upload action path or Pages deployment permissions.

## Changes

- Separate build, package and deploy jobs while preserving Project Update validation and timeline generation.
- Default manual dispatch to deploy=false; require workflow_dispatch, deploy=true and main for packaging and deployment.
- Require successful prerequisite jobs and restrict Pages/OIDC write permissions to deploy.
- Add workflow regression coverage for triggers, permissions and deployment guards.

## Related work

- [PR #8](https://github.com/Infinigate-Netherlands/HIEP/pull/8), merged on 18 November 2026.
- [Merge commit 11ef24664ca00d1659262b1b4010e0e3389e7680](https://github.com/Infinigate-Netherlands/HIEP/commit/11ef24664ca00d1659262b1b4010e0e3389e7680).

## Known limitations

This milestone records workflow source changes, not operational deployment readiness. The workflow remained disabled manually and GitHub execution of the revised configuration had not been demonstrated. A deployment input is a technical condition, not publication clearance. The configured artifact scope remains the portal directory.

## Next steps

Review Actions dependencies and obtain separate authorization before activation or a validation-only run. Public deployment requires its own authorization.
