---
id: bye
title: Wrapping up
sidebar_label: Wrapping up
---

At this point, you’ve walked through the foundational mental models behind the OP Stack, from how Layer 2s inherit security through state commitments and data availability, to how modular rollups restructure traditional blockchain responsibilities into flexible, interoperable components.

You’ve seen how data flows from Ethereum to L2 and back again. You’ve looked at what happens when that flow is disrupted, by reorgs, fault proofs, or message mismatches. You’ve broken down what each component in the system does and why it matters.

More importantly, you’ve built the kind of context that lets you ask better questions when things go wrong.

From here, you can start exploring the design docs, dive into the repositories, or contribute to the system’s governance. What you build next depends on your specialization (governance, interop, etc.), but this foundation will carry you through all of it.

You’re ready! Let’s keep going.

## 🧠 Knowledge Check

#### Q1: What are the components of an output root posted by OP Stack to Ethereum?

<details>
<summary> Solution</summary>

An output root is a hash derived from:
- The L2 state root
- The storage root of the withdrawal contract
- The latest L1 block hash
- A version number

Together, these components commit to the entire L2 state and make withdrawal verification and fault proofs possible.
</details>

#### Q2: Why are reorgs a risk for deposits from L1 to L2?

<details>
<summary> Solution</summary>

Because deposits depend on L1 logs being final. If the L1 block containing a deposit gets reorged out, the deposit event might disappear.

The OP Stack mitigates this by delaying deposit inclusion on L2 — waiting a few Ethereum blocks before treating the deposit as canonical.
</details>

#### Q3: What is the formal interface of the derivation and execution process?
<details>
<summary> Solution</summary>

- Derivation: `derive(S_prev, DA) → { payload | null }`
- Execution: `execute(S_prev, payload) → S_next`

Together, these form the state transition function of the rollup.
</details>

#### Q4: How does the OP Stack ensure that any invalid state transition can be challenged?

<details>
<summary> Solution</summary>

By using fault proofs, which re-execute transitions using:
- The previous and next state roots
- The DA layer
- The same derivation and execution logic

If the computed state doesn't match the posted commitment, the transition is invalid. The MIPS VM and PreImageOracle are used to execute disputes deterministically on L1.
</details>

#### Q5: What is the role of the `op-node` and `op-geth` in the modular stack?

<details>
<summary> Solution</summary>

- `op-node`: Consensus client. It handles derivation, sequencing, and communication with the engine API.
- `op-geth`: Execution client. It runs the EVM, processes deposit transactions, and executes payloads.

Together, they form the rollup’s version of consensus and execution.
</details>

#### Q6: What happens if a sequencer fails to include a deposit within 12 hours?

<details>
<summary> Solution</summary>

The sequencer’s L2 chain becomes non-canonical. Forced inclusion mechanisms kick in, ensuring that the deposit is eventually included regardless of sequencer behavior.

This ensures censorship resistance and enforces the order of L1-originating messages.
</details>

#### Q7: What’s the difference between a precompile and a predeploy?

<details>
<summary> Solution</summary>

- **Precompiles**: Native code at fixed addresses (e.g. P256VERIFY). Requires a protocol upgrade to change.
- **Predeploys**: EVM bytecode at fixed addresses (e.g. L1Block, GasPriceOracle). Can be proxies, easier to upgrade, and used like normal contracts.
</details>

#### Q8: What does the L2 `COINBASE` opcode return on the OP Stack?

<details>
<summary> Solution</summary>

It returns the **sequencer’s fee wallet address**, not a miner or validator address. This remains constant across blocks, unlike Ethereum where it changes per block.
</details>

#### Q9: Why is address aliasing used in OP Stack?

<details>
<summary> Solution</summary>

To prevent L1 contracts from impersonating L2 contracts due to address collisions.

When an L1 contract sends a message to L2, its address is modified by adding a constant offset (`+0x1111...1111`) so that it doesn't conflict with existing L2 contract addresses.
</details>

#### Q10: What is the purpose of `L2ToL1MessagePasser`?

<details>
<summary> Solution</summary>

It records all L2-initiated withdrawals. This storage root is used as part of the output root commitment, and is checked during withdrawal proofs on L1 to ensure the withdrawal was indeed initiated.
</details>

## 🧠 What Would Happen If...

These questions are meant to stretch your mental model, to help you reason about edge cases, adversarial scenarios, and design tradeoffs in the OP Stack.

#### Q11: What would happen if the sequencer includes a deposit out of order?

<details>
<summary> Solution</summary>

That block would be **invalid**.

Deposits must be included in the exact order they were emitted on L1. If a sequencer includes them out of order, it breaks the determinism of state derivation. Honest nodes would reject the block, and a fault proof could challenge it. Canonicality is enforced by the protocol.
</details>

#### Q12: What happens if an L1 contract tries to call an L2 contract that checks for a specific `msg.sender`?

<details>
<summary> Solution</summary>

If the L2 contract is expecting the *original* L1 address, the check will fail.

Due to address aliasing, `msg.sender` appears as `L1_address + ALIAS_OFFSET`. Developers must either:
- Account for aliasing in their checks, or
- Use predeploys like `L2CrossDomainMessenger` that abstract away aliasing details.
</details>

#### Q13: What happens if data posted in a blob becomes unavailable after the fact?

<details>
<summary> Solution</summary>

Anyone trying to verify the associated state transition, e.g., in a fault proof, would **fail** to reconstruct the transition.

This breaks the assumption of verifiability. DA is part of the trust model. Without it, the system becomes non-provable and no longer secure. This is why Ethereum DA is often preferred: it ensures full reconstructibility.
</details>

#### Q14: What if a user starts a withdrawal on L2, but the sequencer censors it and never posts the output root?

<details>
<summary> Solution</summary>

The system has **permissionless output proposals** and **fault proofs** (or will, on most OP Chains). Eventually, someone else, not the sequencer, can post the correct output root to L1.

The dispute game can then be used to resolve state. This protects users from sequencer censorship, assuming a working fault-proof system and availability of L2 data.
</details>

#### Q15: What if two rollups post the same contract to the same address on L2, but with different bytecode?

<details>
<summary> Solution</summary>

This is totally possible, because rollups are separate chains. Even if both use the same address (e.g. via `CREATE2`), the bytecode may differ.

That’s why trust in a contract must be scoped to its **specific chain context**.
</details>
