---
title: Generating UI Mocks
description: Converting Technical Designs into visual prototypes using AI.
---

# Generating UI Mocks

This process guides you through generating high-quality UI mockups, starting from an existing TDD. The goal is to
translate technical specs into production-ready design ideas efficiently.

## Tool Recommendations

- **Prompt Engineering:** Gemini 2.5 Pro
- **Visual Generation:** **UXCanvas.ai** (Recommended), v0.dev, or Magic Patterns.

## Workflow Steps

### 1. Context Definition

Start from your **Technical Design Document** created in the previous stage. Select a specific feature or screen to focus on.
If the UX flow is non-trivial, write a short textual description of the user flow.

### 2. Meta-Prompting

We use an AI to control the AI.

1.  Feed your feature context into **Gemini 2.5 Pro**.
2.  Ask it to generate a **Design Prompt** suitable for a visual generator.
3.  _Requirement:_ The prompt must include app identity, visual style (e.g., "Dark mode DeFi dashboard"),
    required UI elements, and strictly defined user steps.

### 3. Visual Generation

1.  Take the generated prompt and input it into **UXCanvas.ai** (or alternatives).
2.  **Important:** Target one screen at a time. Most tools cannot handle complex multi-step flows in a single pass.

:::warning Flexibility is Key
Do not rely on a single tool. If UXCanvas yields poor results for a specific style, rotate to v0.dev or
Magic Patterns to explore alternative layouts.
:::
