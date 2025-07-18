---
id: design
title: Design
sidebar_label: Design
---

# Design Doc

## Purpose

Summarize the problem statement and proposed solution approach.

## References

- [Optimism Design Docs Repo](https://github.com/ethereum-optimism/design-docs)
- [Wonderland Design Docs Repo](https://github.com/defi-wonderland/design-docs)
- [Design Doc Template](https://github.com/ethereum-optimism/design-docs/blob/main/assets/design-doc-template.md)

## Template Sections

### [Project Name]: Design Doc

The title and metadata fields (Author, Created at, Reviewers, Approval Needed, Status) are used to track ownership and workflow.

### Purpose

A brief statement explaining why this design doc exists and the motivation behind the proposal.

### Summary

A concise overview of the proposal's key ideas, solution components, and expected outcomes. This section provides readers with a quick understanding of the core approach.

### Problem Statement + Context

A clear description of the problem being solved, including relevant background, system behaviors, and constraints.

### Proposed Solution

A detailed description of the design or architecture, including diagrams, algorithms, APIs, or workflows.

#### Resource Usage

Analysis of computational, storage, network, and other resource requirements, including costs and scaling considerations.

#### Single Point of Failure and Multi Client Considerations

Discussion of potential single points of failure, redundancy strategies, and multi-tenant concerns.

### Failure Mode Analysis

Examination of potential failure scenarios, their causes, impacts, and corresponding detection, mitigation, and recovery mechanisms.

### Impact on Developer Experience

Assessment of how the changes affect developers, covering tooling, APIs, debugging, and onboarding.

### Alternatives Considered

Brief evaluation of alternative approaches and reasons for their rejection.

### Risks & Uncertainties

Identification of key risks, unknowns, and potential mitigation strategies.

## Workflow

- The `main` branch in the Wonderland repo should remain stable and unchanged.
- For new work, create a feature branch (e.g., `sc-feat/<feature>` or `sc-fix/<fix>`).
- Within this, create further branches (`feat/<X>`, `fix/<Y>`) for specific tasks and open internal PRs targeting the main feature branch.
- After all internal PRs have been merged, raise an external PR from the feature branch to the `main` branch of the Optimism repo.

## Collaboration

- Schedule sync review sessions with Optimism to present the design doc and incorporate feedback.
- Initial design drafts can be started in Notion for easier iteration and team input, and then migrated to GitHub for final review and versioning.
