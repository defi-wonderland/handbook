# Overview

Aztec is a Zero-Knowledge SNARK L2. This means there's an L1 *verifier contract* (a.k.a. *rollup
contract*) that keeps track of the current state of the blockchain and verifies proper L2 execution
through ZK proofs before updating its known L2 state to a new one.

Blocks are divided in epochs of 32 blocks each, and the rollup contract expects the proof of an
entire epoch. Once an epoch's proof is submitted and accepted by the contract, it is considered
finalized and no reorg can happen unless the L1 itself gets reorg'd.

When a new epoch begins, a random committee is elected from the validator set to sequence the
epoch's blocks. Each *slot* in the epoch gets assigned a random proposer from the committee to
sequence its block, and the blocks are each produced and committed to in the L1 in order *without
proving*.

Once the epoch is fully sequenced, proving begins in simultaneou to the new epoch's sequencing.
Proving is decoupled from sequencing so that a sequencer needn't have the hardware required for
proving. Instead, a coordination mechanism between provers and sequencers is defined, which allows
provers to quote their price for proving, and sequencers to bid for one of them.

If the proof arrives to the L1 contract in time (before the next epoch's sequencing is done), the
epoch is finalized. Otherwise, both epochs are discarded and block production begins again from the
last finalized epoch.

There are two fallback mechanisms that enter into effect whenever the happy path is not traversed,
in order to ensure liveliness and finality:
- Based fallback
- Forced inclussion queue
