# Overview

Since Aztec is a ZK SNARK L2, the blockchain's state is committed to in an L1 contract known as the
*rollup contract*. In order to advance the contract from the current state to the next state,
the rollup contract expects a valid ZK proof of transition.

Aztec blocks are grouped in epochs of 32 blocks each, and the rollup contract expects the proof of
an entire epoch. Once an epoch's proof is submitted and accepted by the contract, the epoch is
finalized and no Aztec reorg can happen unless the L1 itself reorgs.

[Aztec block production](https://forum.aztec.network/t/request-for-comments-aztecs-block-production-system/6155)
can be divided into four parts:
1) Transaction propagation
2) Sequencing
3) Proving
4) Fallback mechanisms

### Transaction propagation

PXEs produce and share [`Tx` objects](https://github.com/AztecProtocol/aztec-packages/blob/286fbfae25b173d372164eedd7b22926eac32b2a/yarn-project/stdlib/src/tx/tx.ts#L27),
which include the following information:
- Transaction hash
- Transaction effects (nullifiers, logs, etc)
- The ZK proof for the private execution
- The enqueued public calls

These are gossiped to at least one node. Once a node receives a `Tx` object, it verifies its
validity and then forwards it to its known peers. This process forms a [mempool](https://learnmeabitcoin.com/technical/mining/memory-pool/),
which consists of all the transactions that are awaiting execution. The TX validity check ensures
the ZK proof for private execution is valid and that fees will be paid correctly.

### Sequencing

Roughly, when a new epoch begins:

1) A random committee is elected from the validator set
2) Proposers are sampled from the committee for each of the epoch's slot
3) Each proposer produces a block. They then broadcast it to the committee for attestations and,
   upon collecting enough attestations, publishes to the rollup contract *without proving*

### Proving

Once an epoch is fully sequenced, proving happens simultaneously to the next epoch's sequencing.
Proving is decoupled from sequencing so that a sequencer needn't have the hardware required for
proving. Instead, a coordination mechanism between provers and sequencers is defined, which allows
provers to quote their price for proving, and sequencers to bid for one of them.

If the proof arrives at the L1 contract in time (before the next epoch's sequencing is done), the
epoch is finalized. Otherwise, both epochs are discarded and block production begins again from the
last finalized epoch.

### Fallback mechanisms

There are two fallback mechanisms that enter into effect whenever the happy path is not traversed:
- Based fallback: ensures liveness
- Forced inclusion queue: ensures finality

## Up next

The following pages explain sequencing, proving, and fallback mechanisms in more detail.
