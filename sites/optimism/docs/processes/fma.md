---
id: fma
title: Failure Mode Analysis
sidebar_label: FMA
---

# Failure Mode Analysis

## Purpose

Systematically identify potential failure scenarios in system upgrades or changes and outline corresponding recovery strategies to mitigate risks.

## References

- [Optimism Design Docs Repo](https://github.com/ethereum-optimism/design-docs)
- [Wonderland Design Docs Repo](https://github.com/defi-wonderland/design-docs)
- [FMA Template](https://github.com/ethereum-optimism/design-docs/blob/main/assets/fma-template.md)

## Important Sections

### Metadata

Document ownership and review status:

- Author: Name of the individual drafting the document
- Created at: Date of creation
- Initial Reviewers: Names of initial reviewers
- Need Approval From: Security team member responsible for final approval
- Status: Current document status (Draft, In Review, Implementing Actions, Final)

### Introduction

Brief overview of the project or change being analyzed, including:

- Project context
- Scope of changes
- Key objectives
- System components affected

### Failure Modes and Recovery Paths

For each potential failure mode, document:

- Description: Detailed explanation of the failure scenario
- Risk Assessment: Evaluation of severity and likelihood
- Mitigations: Strategies to prevent or mitigate the failure
- Recovery Path: Step-by-step recovery procedures

### Audit Requirements

Document specific audit needs:

- Required audit scope
- Critical areas for review
- Security considerations

### Action Items

Track implementation progress:

- Risk mitigation tasks
- Implementation requirements
- Testing needs
- Documentation updates

### Appendix

Supporting information:

- Technical references
- Related documentation
- Additional context
- Supporting data

## Workflow

- The `main` branch in the Wonderland repo should remain stable and unchanged
- For new work, create a feature branch (e.g., `sc-feat/<feature>` or `sc-fix/<fix>`)
- Within this, create further branches (`feat/<X>`, `fix/<Y>`) for specific tasks
- Open internal PRs targeting the main feature branch
- After all internal PRs are merged, raise an external PR to the `main` branch of the Optimism repo

## Collaboration

- Schedule sync review sessions with Optimism to present the FMA and incorporate feedback
- Initial FMA drafts can be started in Notion for easier iteration and team input
- Migrate to GitHub for final review and versioning
- Ensure security team approval before finalizing
