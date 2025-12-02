---
title: Overview
description: Philosophy and overview of leveraging AI agents in the Wonderland development lifecycle.
---

# AI-Assisted Development

## Goal & Philosophy

The goal of this workflow is to standardize the use of AI agents to improve and automate critical stages of our development process.
By incorporating "AI Loops" into our workflow, we aim to produce solutions that are more comprehensive than traditional linear development,
identifying blind spots early in the definition phase.

### The "Base 7" Principle

:::info
**These guidelines are not meant to produce a final product autonomously.**
:::

Instead, they raise the baseline. If a perfect outcome is a score of **10**, we aim to use these workflows to start every project at
a **7 or 8**, rather than starting from scratch (0) or a rough draft (3).

## Core Requirements

To ensure quality across all AI-assisted guides, the following inputs are mandatory:

1.  **Well-defined Inputs:** Clear project requirements, context from previous steps, and adherence
    to our [Best Practices](/docs/development/frontend/best-practices).
2.  **Prompt Templates:** Utilizing specific, tested prompts to ensure replicable outcomes.
3.  **Acceptance Criteria:** Specific metrics to verify the AI output is usable.

## The Workflow

The AI-assisted lifecycle is split into four distinct stages. Please follow them in order:

- [**1. Tech Design**](/docs/development/frontend/ai-assisted-project-setup/tech-design)
  Generating high-quality Technical Design Documents (TDDs) and architecture flows using Gemini and GPT.
- [**2. UI Generation**](/docs/development/frontend/ai-assisted-project-setup/ui-generation)
  Translating TDDs into prompts for visual mockups using UXCanvas and other generative design tools.
- [**3. Repository Scaffolding**](/docs/development/frontend/ai-assisted-project-setup/repo-scaffolding)
  Generating the actual code base, folder structure, and initial components using Cursor or PureCode.
- [**4. Automated Testing**](/docs/development/frontend/ai-assisted-project-setup/test)
  Establishing the baseline for End-to-End tests using Synpress and Playwright.
