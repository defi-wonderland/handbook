---
title: Automated Testing
description: Generating and refining End-to-End tests with AI.
---

# Automated Testing

We leverage AI agents (Claude-4 Sonnet or Gemini 2.5 Pro) to generate the foundation for our E2E test suites
using **Synpress** and **Playwright**.

## Current Status

- ✅ **Development Utility:** AI can successfully write the initial test files, saving significant boilerplate time.
- ✅ **Self-Healing:** We observed clear improvements when feeding test _failures_ back into the AI.
  It can iterate on `test-ids` and selectors without human intervention.
- ⚠️ **Production Readiness:** AI currently lacks the deep context to understand business logic nuances
  (e.g., confusing button labels). Manual review is required to ensure tests are robust.

## Workflow

1.  **Generate:** Feed the TDD user flow to the agent to create the initial Synpress/Playwright spec file.
2.  **Execute:** Run the tests in a local environment.
3.  **Iterate:** Copy/paste the failure logs back to the agent.
4.  **Refine:** Once the tests pass, manually review the code to ensure it tests the _intent_, not just the DOM
    (e.g., ensuring a Balance actually updates, not just that the text exists).
