---
title: Interoperability Overview
sidebar_label: Overview
pagination_next: interoperability/intro-to-interop
---

# Interoperability 

This section introduces the cross-chain architecture of the Superchain: how OP Chains pass messages, transfer tokens and ETH, and coordinate state safely without relying on Ethereum L1 for every interaction.

We’ll start from first principles: what interop means in the OP Stack, how messages are structured, and what guarantees must hold for them to be valid. You’ll learn the lifecycle of a message, from emission to validation, and the key invariants that protect the system from reorgs, expired data, or spoofed origins.

Then we’ll walk through the messaging protocol and predeploy contracts that power interop: `CrossL2Inbox`, `L2ToL2CrossDomainMessenger`, `SuperchainTokenBridge`, `SuperchainETHBridge`, and the `ETHLiquidity` system. These predeploys are deployed at the same address on every OP Chain and define the protocol surface for cross-chain execution.

We’ll explore the mechanics of bridging both tokens and ETH using the Superchain standards—how `SuperchainERC20` tokens are burned and minted, and how ETH flows across chains without being wrapped. You’ll also see how interoperability is secured at the block level through execution safety, verifier checks, and access list-based message gating.

Finally, we’ll walk through the verification and sequencing pipeline: how blocks move from unsafe to safe to finalized, how sequencers handle cross-chain dependencies, and how the Supervisor RPC and dependency graph ensure messages are safely validated across the Superchain.

By the end of this section, you should be able to answer:
- What makes a cross-chain message valid?
- How do OP Chains send and execute messages without relying on Ethereum L1?
- What are the roles of CrossL2Inbox and L2ToL2CrossDomainMessenger?
- How do tokens and ETH move between chains using the Superchain bridges?
- What does the dependency set enforce, and how do chains define trust boundaries?
- What is the difference between unsafe, cross-unsafe, safe, and finalized blocks?
- How does the verifier resolve safety and prevent replay or invalid execution?
- What risks are introduced by preconfirmations or cyclic dependencies?
- Why does interop require consistent predeploy addresses across chains?

Let's understand how OP Chains talk to each other and what keeps the system safe.