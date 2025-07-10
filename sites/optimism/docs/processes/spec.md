---
id: spec
title: Spec
sidebar_label: Spec
---

# Spec Doc

## Purpose

Document the technical implementation details, including invariants, ABI specifications, events, and architectural decisions.

## References

- [Optimism Specs Repo](https://github.com/ethereum-optimism/specs)
- [Wonderland Specs Repo](https://github.com/defi-wonderland/specs)

## Important Sections

### Invariants

Properties that must always hold true in the system, covering state consistency, protocol rules, and security guarantees.

### Interfaces

Documentation of all system interfaces, including function signatures, parameters, return values, and access controls.

### Properties

System characteristics across state management, behavior, and performance requirements.

## Workflow

- The `main` branch in the Wonderland repo should remain stable and unchanged.
- For new work, create a feature branch (e.g., `sc-feat/<feature>` or `sc-fix/<fix>`).
- Within this, create further branches (`feat/<X>`, `fix/<Y>`) for specific tasks and open internal PRs targeting the main feature branch.
- Run the linters defined in the justfile (`just lint`) before submitting PRs.
- After all internal PRs have been merged, raise an external PR from the feature branch to the `main` branch of the Optimism repo.

## Collaboration

- For significant changes, schedule sync review sessions with Optimism to present the spec doc and incorporate feedback.
- Initial spec drafts can be started in Notion for easier iteration and team input, and then migrated to GitHub for final review and versioning.
