---
id: implementation
title: Implementation
sidebar_label: Implementation
---

# Implementation Doc

## Purpose

Develop and implement the code in the Optimism monorepo, following the design specifications and invariants defined in the previous steps.

## References

- [Optimism Monorepo](https://github.com/ethereum-optimism/optimism)
- [Wonderland Monorepo](https://github.com/defi-wonderland/optimism/)

## Implementation Process

### Code Development

- Follow the design specifications and invariants defined in previous documents
- Implement features and fixes in the Optimism monorepo
- Ensure code quality and maintainability
- Document code changes and additions

### Testing Requirements

Before submitting PRs, run the following commands:

- `just pre-pr`: Compile, run snapshots and code checks
- `just semgrep`: Run semgrep rules over the code
- `just test`: Run the test suite (L1 and L2)
- `just test-upgrade`: Run L1 test suite after forking and upgrading to the last version (requires RPC URL)

## Workflow

- The `develop` branch in the Wonderland repo should remain stable and unchanged
- For new work, create a feature branch (e.g., `sc-feat/<feature>` or `sc-fix/<fix>`)
- Within this, create further branches (`feat/<X>`, `fix/<Y>`) for specific tasks
- Open internal PRs targeting the main feature branch
- After all internal PRs are merged, raise an external PR to the `develop` branch of the Optimism repo
- CI authorization is required for external PRs:
  - Can be authorized by Optimism
  - Alternatively, Wonderland team members with push permissions can open PRs directly in the Optimism repo

## Collaboration

- Schedule sync review calls with Optimism to:
  - Present code changes
  - Provide implementation overview
  - Facilitate the async review process
- Maintain clear communication channels for questions and feedback
