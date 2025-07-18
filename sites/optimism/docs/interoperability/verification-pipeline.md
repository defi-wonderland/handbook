---
id: verification-pipeline
title: Verification
sidebar_label: Verification
---

:::info reference
This is a high-level overview of the verification process. After reading it, refer to [this section](https://specs.optimism.io/interop/verifier.html) of the OP Specs for more depth.
:::

The verifier is the final line of defence for cross-chain correctness. It validates that each L2 block in the cluster upholds the messaging invariants and promotes it to a higher level of safety if it does.

The verifier operates by inspecting both the data availability of a block and the correctness of its cross-chain dependencies. This validation process ensures that a block can only be considered safe if all executing messages it includes point to initiating messages that have been resolved as safe.

## Safety Levels

Every L2 block falls somewhere on a spectrum of safety:

| Level        | Description |
|--------------|-------------|
| `unsafe`     | Unverified block from the sequencer. No cross-chain messages are validated. |
| `cross-unsafe` | Cross-chain messages have been verified, but the block has not yet been fully published to data availability. |
| `safe`       | The block has been fully published and all dependencies resolved. It may still be reorganised. |
| `finalized`  | Irreversible. Guaranteed by Ethereum's proof-of-stake consensus. |

Each level builds on the previous one, and a block can only be promoted if it satisfies a strict set of conditions.

## Verifier Logic

The verifier receives a stream of blocks from the sequencer and attempts to validate them by applying the following logic:

### 1. Promote to `cross-unsafe`

A block can be promoted from `unsafe` to `cross-unsafe` once all of its cross-chain messages have been validated. Specifically:

- Each executing message must have a valid initiating message.
- That initiating message must originate from a chain in the local dependency set.
- The log identified must match the expected hash and timestamp.
- Message expiry must not have elapsed.

The verifier builds a dependency graph of all chains. Each block is a vertex. Each executing message introduces an edge from the source block to the destination block. If the source block becomes invalid, all dependent blocks are marked invalid.

:::note
The `cross-unsafe` label is not exposed to RPC users. It is used internally for staging safety promotions.
:::

### 2. Promote to `safe`

Once the block’s data has been published to the DA layer and its cross-chain graph is valid, the verifier promotes the block to `safe`.

- A `safe` block **may** still be reorganized if a reorg occurs on the DA layer.
- A block is only promoted to `safe` if all its inputs (including executing messages and dependencies) are also `safe`.

### 3. Promote to `finalized`

A block is considered `finalized` when it has been confirmed through Ethereum’s finality mechanism. This means:

- All data availability is finalized on L1.
- All remote dependencies are finalized on their respective chains.
- Reorgs are impossible unless Ethereum consensus itself is violated.

This is the strongest safety level. Finalized data can be used for long-term commitments or irreversible actions.

## Honest Verifier

An honest verifier mimics the logic of a sequencer, but applies stricter rules before accepting blocks as safe. It:

- Reproduces transaction execution for the entire block.
- Verifies that each executing message points to a valid initiating message.
- Rejects any block where a message violates invariants.
- Builds and prunes the dependency graph across chains.

The verifier never speculatively includes messages. It only promotes blocks after the entire dependency graph is resolved.

### What makes it stricter?

While the verifier and sequencer both run the same block derivation and execution logic, their trust models and promotion rules differ. The sequencer optimistically produces low-latency blocks, whereas the verifier ensures correctness and finality before recognizing a block as safe.

| Feature                    | **Sequencer**                                                | **Honest Verifier**                                           |
|---------------------------|--------------------------------------------------------------|---------------------------------------------------------------|
| **Block construction**     | Builds blocks using mempool, DA inputs                       | Replays sequencer blocks deterministically                     |
| **Cross-chain messages**   | Included speculatively                                       | Fully resolved before execution                               |
| **Dependency handling**    | May include executing messages before source is confirmed    | Requires full dependency graph to be resolved                 |
| **Safety labels**          | Produces `unsafe` blocks                                     | Promotes blocks from `unsafe` → `safe` once rules are met     |
| **Reorg handling**         | May follow reorgs, no rollback enforcement                   | Filters out reorged, invalid, or unsafe-dependent blocks       |
| **Trust model**            | Relies on sequencer key + user optimism                      | Enforces deterministic validity checks                        |

The verifier plays a critical role in the safety pipeline because it’s what promotes blocks from `unsafe` to `safe` or `finalized` status, by re-validating them against strict protocol invariants.

## Recap

The verifier ensures that cross-chain execution is correct, safe, and backed by finality. It is the only entity capable of safely promoting blocks in a way that guarantees cross-chain consistency.

Interop only works if blocks agree on their shared messages. The verifier is what makes that agreement enforceable.