---
id: governance-overview
title: Governance Overview
sidebar_label: Overview
pagination_next: governance/intro-to-governance
---

# Governance: What You Should Know

This section introduces how governance works in the Optimism Collective: how proposals are created, who gets to vote, what infrastructure runs the system, and how that infrastructure is evolving toward greater decentralization and permissionlessness.

We’ll start from the basics, what governance means in crypto, what proposals look like under the hood, and the vocabulary you’ll need to reason about things like quorums, thresholds, or veto rights.

Then we’ll walk through the **OP Governor** smart contracts and the modular architecture surrounding them: `Alligator`, `ProposalTypesConfigurator`, `VotableSupplyOracle`, and the emerging validator logic for permissionless proposals. If you're wondering *who proposes what, and how proposals actually work*, this section is for you.

We’ll also look at the **Operating Manual**, the dual-house structure (Token House & Citizens’ House), and how protocol upgrades, Retro Funding, and Missions are routed through this governance system.

Finally, we’ll end with a breakdown of our current work to open up Optimism governance to more direct participation, removing bottlenecks, making rule enforcement on-chain, and enabling a path to *trust-minimized proposal submission*.

By the end of this section, you should be able to answer:

- What’s the difference between an approval and a vote on Optimism?
- Who can propose? Who can vote? What powers are delegated?
- How do proposals move through states like Pending → Active → Executed?
- How is quorum calculated, and what makes a proposal “pass”?
- What is Alligator, and why is delegation logic so complicated?
- What happens if a delegate tries to push a proposal that violates cycle rules?
- What is permissionless governance, and what tradeoffs does it introduce?

Let’s dive into the design to understand who gets to change the rules.