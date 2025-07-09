---
id: bye
title: Wrapping Up
sidebar_label: Wrapping Up
---

The Superchain is not a network of isolated rollups. It is an interoperable system. And interoperability is not just a feature—it is a protocol-level commitment. This section unpacks the architecture that makes that commitment safe, expressive, and scalable.

At the core is the message-passing model: a log on a source chain, an event on a destination, and a set of invariants that bind them together. This model allows applications to compose across chains as if they were one, without relying on external bridges, wrappers, or trust assumptions.

We’ve shown how the `CrossL2Inbox` enforces validity, how access lists control message execution at the block-building layer, and how the `L2ToL2CrossDomainMessenger` wraps these primitives with replay protection and domain binding. Token and ETH transfers build on this system. The `SuperchainTokenBridge`, `SuperchainETHBridge`, and their respective liquidity providers handle value movement without fragmentation. The `SuperchainERC20` standard guarantees consistency across deployments.

Execution safety is enforced through a sequencer model that can tolerate latency, compose asynchronously, and still guarantee eventual consistency. Sequencers coordinate loosely but validate strictly. The verifier pipeline then promotes blocks along a safety spectrum—from unsafe to finalized—while checking every dependency and enforcing application-level invariants.

The contracts that make all of this work, the predeploys, are stable, fixed-address components of the OP Stack. They expose clean interfaces for validation, bridging, minting, and conversion. Developers don’t need to reimplement any of this. They just need to understand how to compose with it.

In a Superchain context, “multi-chain” doesn’t mean fragmented. It means modular. And interop is the *glue*.

## Knowledge Check

<details>
<summary>Why do we split messages into initiating and executing parts?</summary>


Initiating messages are emitted on the source chain and recorded as logs. Executing messages replay those logs on the destination chain. This separation allows messages to be verified and relayed asynchronously across OP Chains.

</details>


<details>
<summary>What conditions must be true for a message to be considered valid?</summary>


The executing message must reference a valid initiating message from a chain in the dependency set. The message must pass the timestamp, chain ID, and expiry invariants, and the checksum must match.

</details>


<details>
<summary>What happens if the checksum in the access list doesn't match?</summary>


The message is rejected and cannot be executed. The checksum is the critical component for validating message integrity, and mismatches indicate tampering or invalid execution context.

</details>


<details>
<summary>Why does the `SuperchainTokenBridge` rely on the `crosschainBurn` and `crosschainMint` functions?</summary>


These functions enforce that token supply changes are coordinated between chains. Burn removes tokens on the source chain, and Mint restores them on the destination. Without this, tokens could be duplicated across chains.

</details>


<details>
<summary>What are the risks of using unsafe messages in block building?</summary>


Messages from unsafe blocks might later be invalidated during reorgs. Including them reduces latency but increases risk. If the message proves invalid, the block must be reorged, leading to instability.

</details>


<details>
<summary>Why is ETH never minted directly in the Superchain?</summary>


All ETH originates from L1 and must be conserved. ETH is “burned” on the source chain via `ETHLiquidity.burn()` and “minted” on the destination chain via mint(), but this is really just moving pre-allocated liquidity.

</details>


<details>
<summary>What does it mean for a block to be 'cross-unsafe'?</summary>


A cross-unsafe block has valid cross-chain messages, but the block itself or some dependencies are still unsafe. It’s part of the transition to ‘safe’, but not yet finalized.

</details>


<details>
<summary>What invariant prevents message replay across chains?</summary>


The combination of the `Identifier` and `msgHash`, verified via access list checksum, ensures each message can only be executed once per destination chain. Replay attempts will fail checksum validation or be marked as already executed.

</details>


<details>
<summary>Why are predeploy addresses the same across all OP Chains?</summary>


Deterministic addresses allow tooling, contracts, and relayers to work across chains without needing custom configuration. This makes interop feel native and predictable.

</details>


<details>
<summary>What breaks if chains have different dependency sets?</summary>


A chain can only execute messages from chains in its dependency set. If dependencies are misaligned, messages may become unplayable, leading to lost assets or stuck contracts.

</details>
