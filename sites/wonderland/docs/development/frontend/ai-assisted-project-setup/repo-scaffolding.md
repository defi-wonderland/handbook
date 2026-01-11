---
title: Repository Scaffolding
description: Automating the setup of codebases, folder structures, and base components.
---

# Repository Scaffolding

To generate the base structure of the code repository, we utilize AI agents that are context-aware of
our implementation guidelines.

## Option A: Cursor (Full Project Setup)

**Best for:** Full repository structure, folder layout, and architecture compliance.

- **Model:** Claude 4 Sonnet (Consistently outperforms Gemini for file-tree generation).

### Steps to Reproduce

1.  **Setup:** Clone one of our standard boilerplate repositories:
    - [Next.js Boilerplate](https://github.com/defi-wonderland/web3-nextjs-boilerplate)
    - [Vite Boilerplate](https://github.com/defi-wonderland/web3-vite-boilerplate)
2.  **Index:** Open the project in Cursor and allow it to index the codebase.
3.  **Prompt:** Launch Cursor Agent using the TDD generated in step 1.
4.  **Context Injection:** You **must** copy references from our Handbook (specifically **Project Structure** and **Best Practices**)
    into the prompt. This enforces our specific code quality rules.
5.  **UI Reference:** Attach screenshots or a JSON representation of the design generated in the UI Mocks step.

## Option B: PureCode.ai (Component Level)

**Best for:** VS Code integration and strictly typed Material UI components.

### Steps to Reproduce

1.  **Installation:** Install the PureCode extension in VS Code.
2.  **Configuration:** Configure styling rules (e.g., "No hardcoded hex colors", "Use MUI system").
3.  **Action:** Upload the UI screenshot and prompt: _"Implement this UI using best practices for Material UI and Next.js."_

:::info Conclusion
**Cursor** is preferred for the "Big Picture" (creating the folder structure and routing). **PureCode** is preferred
for "Details" (creating the specific UI components inside those folders).
:::
