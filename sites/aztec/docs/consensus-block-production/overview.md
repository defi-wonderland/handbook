# Overview

Aztec is a Zero-Knowledge SNARK L2. The blockchain state is committed to in an L1 contract known as
the *rollup contract*. In order to advance the contract from the current state to the next state,
the rollup contract expects a valid ZK proof of transition.

Blocks are grouped in epochs of 32 blocks each, and the rollup contract expects the proof of an
entire epoch. Once an epoch's proof is submitted and accepted by the contract, the epoch is
considered finalized and no Aztec reorg can happen unless the L1 itself reorgs.

Aztec consensus and block production can be divided into four parts:
1) Transaction propagation
2) Sequencing
3) Proving
4) Fallback mechanisms

### Transaction propagation

Users' PXEs produce and gossip `Tx` objects. Amongst other information, these contain:
- Transaction hash
- Transaction effects (nullifiers, logs, etc)
- The ZK proof for the private execution
- The enqueued public calls

These are gossiped to at least one node. Uppon receival of a `Tx` object, a node checks its validity
and then forwards it to its known pairs. This defines a mempool of transactions that are pending
execution.

### Sequencing

Roughly, when a new epoch begins

1) A random committee is elected from the validator set
2) Proposers are sampled from the committee for each of the epoch's slot
3) Each proposer produces a block and, uppon collecting enough attestations, publishes to the rollup
   contract *without proving*

### Proving

Once an epoch is fully sequenced, proving begins in simultaneous to the new epoch's sequencing.
Proving is decoupled from sequencing so that a sequencer needn't have the hardware required for
proving. Instead, a coordination mechanism between provers and sequencers is defined, which allows
provers to quote their price for proving, and sequencers to bid for one of them.

If the proof arrives to the L1 contract in time (before the next epoch's sequencing is done), the
epoch is finalized. Otherwise, both epochs are discarded and block production begins again from the
last finalized epoch.

### Fallback mechanisms

There are two fallback mechanisms that enter into effect whenever the happy path is not traversed:
- Based fallback: ensures liveliness
- Forced inclussion queue: ensures finality

## Up next

The following pages explain the later three points in more detail.

## References

- [Aztec's Block Production System](https://forum.aztec.network/t/request-for-comments-aztecs-block-production-system/6155)

### Source code
- [Tx object](https://github.com/AztecProtocol/aztec-packages/blob/286fbfae25b173d372164eedd7b22926eac32b2a/yarn-project/stdlib/src/tx/tx.ts#L27)
