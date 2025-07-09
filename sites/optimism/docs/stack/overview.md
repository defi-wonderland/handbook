---
title: Stack Overview
sidebar_label: Overview
pagination_next: stack/previous-knowledge
---

# What You Should Know Before Diving In

The OP Stack is a modular system, but understanding is about developing the instincts to reason about rollups, trust-minimized bridges, and onchain fault tolerance.

Before we walk you through the specifics of the OP Stack, this section revisits foundational concepts that every OP developer and researcher should be comfortable with. These ideas aren’t unique to Optimism, but core to how Layer 2s interoperate with Ethereum, and how validity emerges from modular systems.

We’ll start with:

- **What makes a Layer 2 a Layer 2**, and how rollups post data and state commitments to Ethereum for security and settlement.
- **How reorganizations (reorgs)** can impact finality, and what assumptions we should or shouldn't make.
- **Why modular architectures matter** — and how Optimism translates that theory into practice across execution, consensus, and data availability.

Then, we introduce the OP Stack itself. We’ll break down each layer: Consensus, Execution, and Settlement, and explain how data flows from L1 to L2, how blocks are built and verified, and how state transitions are validated.

We also cover the practical machinery of bridging: deposits, withdrawals, output roots, and dispute games. These flows are relevant to understand not only for application builders, but also for anyone working on cross-chain interop, governance, or security.

By the end of this section, you should be able to answer:

- What actually gets posted to L1 in an optimistic rollup?
- What happens if someone tries to cheat?
- Why do we care about DA layers and blob types?
- What’s different about building on OP Stack vs Ethereum?

Let’s build up your mental model, so you’re not just following the docs, but seeing the system clearly.