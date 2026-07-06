---
title: Generating Tech Designs
description: How to use AI to generate TDDs and Architecture Diagrams.
---

# Generating Tech Designs

This process defines how to leverage AI to generate high-quality Technical Design Documents (TDDs) for UI projects.
The approach relies on separating logic generation from diagram generation for optimal results.

## Tool Recommendations

- **Text & Logic:** **Gemini 2.5**. It produces technical, concise outputs well-aligned with our engineering standards.
- **Diagrams:** **GPT-4o**. It generates clearer Mermaid syntax and provides structured explanations for both technical and non-technical audiences.

## Workflow Steps

The process consists of three specific iterations:

### Iteration 1: The Draft (Gemini 2.5)

Use the official **Input Template** which includes the role, functional requirements, and context (tech stack, dependencies).

1.  Run the model to generate an initial draft.
2.  Explicitly ask for an **"Open Questions and Thoughts"** section to surface ambiguities.

### Iteration 2: Refinement (Gemini 2.5)

1.  Review the "Open Questions" from Iteration 1.
2.  Provide answers and clarifications to the model.
3.  Request a final, polished **Technical Design Document** that strictly follows the UI Tech Design Template.

### Iteration 3: Architecture (GPT-4o)

1.  Feed the final TDD text into GPT-4o.
2.  Ask the model to generate **Mermaid diagrams only**.
3.  Ensure every diagram focuses on system architecture or user flow and is followed by a brief, clear explanation.
