# Mental model

Use this as a mental model for research at Wonderland: Visibility → Framing → Context → Direction → Design. It’s a starting point, not a script. Projects change; we adapt while keeping the work visible and the writing crisp.

## How we begin

Every project starts by making it visible. In Notion’s Research Home, the Projects Overview is our living index. After a short kickoff with the Partner Lead, we open a Stage 0 index: a single page that captures the question, constraints, links, owners, and what “good” looks like for the next two weeks. It’s the anchor we keep updating as we learn.

## Framing with the partner

We begin by understanding what the partner actually wants and why now. Sometimes a scope doc exists; often it doesn’t. If that's the case, ask for a short kickoff to set expectations and define scope. Read what exists. Highlight unknown terms, and keep a small glossary (tools, components, new concepts). If context is missing, ask your Partner Lead or teammate, do a quick “background of the background research” to collect base knowledge, and reuse prior work by linking to it rather than re‑explaining.

## Deepening context

Once the ask is framed, we explore beyond it. The aim is to surface approaches, constraints, and risks before proposing solutions. Background notes usually cover three threads: 
- The partner’s context and questions
- How things work today (the “background of the background”)
- A concrete technical exploration that tests assumptions. 
When useful, add an appendix to park adjacent ideas or optional features. Breaking work into smaller pieces is healthy. Along the way, look sideways: how have others solved similar problems across chains, protocols, and tooling? Capture a few plausible paths and what each would imply.

## Shaping a direction

With context in place, we shape a draft direction and align quickly before writing more. If an Idea Draft exists, refine it or use your research to inform the Tech Design. If not, write a crisp one‑pager or spike: the direction you recommend, the viable alternatives, the key trade‑offs, and a short rationale (“Why this? Why not that?”). Do a 15‑minute pre‑brief with the Team Lead / Partner Lead / Architect, fold in feedback, and co‑draft with them. A quick sync before and after drafting saves cycles.

## From draft to design

When a direction is chosen, we converge on a buildable plan. See [Project Lifecycle — Tech Design](/docs/processes/project-lifecycle#tech-design-). The document is based on the approved Idea Draft and spells out contracts and external functions, off‑chain components, key interactions, time estimates, and risks with mitigations. The partner signs it. It’s authored by a Team Lead with an Architect or Researcher; Research supports through focused reviews rather than owning authorship.

## If something feels off

This work is iterative, not strictly linear. Do it right from the start. Don’t move forward on shaky assumptions. Keep writing clear and legible: use diagrams, explain your chain of thought, and assume the reader has no context. See [Technical Writing](/docs/development/research/technical-writing).

## Tools we reach for

- [Tenderly](https://tenderly.co/) for simulating contract behavior
- Block explorers
- [Dune](https://dune.com/home) for on‑chain analytics
- Cursor / Claude Code / Codex to understand repositories and large projects quickly
- [Deepwiki](https://deepwiki.org/) to generate concise documentation from codebases, quick