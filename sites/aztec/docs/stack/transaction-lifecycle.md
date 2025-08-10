# Transaction Lifecycle

This page tells the story of a transaction from a user click to final inclusion, connecting each step to the corresponding code in the Aztec network.

## From intent to a private proof

The journey begins in the wallet. Using the PXE as a library, the wallet simulates private function calls and proves them using the private kernel chain: initial → inner → optional reset → tail. The tail kernel packages the outcome into two buckets: non‑revertible effects (for example, the transaction‑level nullifier) and revertible effects (note hashes, nullifiers, L2→L1 messages), along with public call requests (and an optional teardown request). See the private kernel flow in the protocol docs and PXE:

- High‑level topology of circuits: [High‑Level Topology](https://github.com/AztecProtocol/aztec-packages/blob/next/docs/docs/protocol-specs/circuits/high-level-topology.md)
- PXE prover orchestration: [`private_kernel_execution_prover.ts`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/private_kernel/private_kernel_execution_prover.ts)

## Handoff to the network

The wallet submits the proved transaction to a node. The sequencer runs the public portion in the AVM simulator, applying effects in phases defined by `TxExecutionPhase`.

- Phases enum: [`processed_tx.ts`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/stdlib/src/tx/processed_tx.ts)
- Public simulator: [`public_tx_simulator.ts`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/simulator/src/public/public_tx_simulator/public_tx_simulator.ts)

## Public execution, phase by phase

1. Non‑revertible. The simulator first applies non‑revertible effects from the private phase (e.g. inserts the core transaction nullifier) and makes non‑revertible artifacts available. These persist regardless of later failures.

2. Public setup. If requested, setup calls are executed next. Like non‑revertible effects, they are not rolled back by failures in later phases.

3. Revertible (app logic). The simulator creates a checkpoint, inserts revertible nullifiers and note hashes, and executes app‑logic public calls. If any call fails, the simulator rolls back to the checkpoint and the receipt status is set to `app_logic_reverted`. Non‑revertible effects remain.

4. Teardown. Finally, the simulator settles fees and completes protocol‑defined reimbursements/refunds using teardown gas limits. If teardown fails, the receipt status is set to `teardown_reverted`. Non‑revertible effects remain. Fee settlement occurs here. See the fee deduction in teardown inside the simulator.

- Receipt/status mapping: [`tx_receipt.ts`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/stdlib/src/tx/tx_receipt.ts)

## Inclusion, reorgs, and reading state

If all phases succeed, the transaction’s public effects are included in the block. The wallet advances its local view to the tip on demand via the Synchronizer (detecting reorgs as needed):

- Synchronizer: [`synchronizer.ts`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/synchronizer/synchronizer.ts)

Private membership proofs can use historical roots thanks to append‑only trees, but non‑membership in the nullifier tree must be checked at the head of the chain by the sequencer. This is why reads of private mutable values emit a nullifier and re‑create the note (see “Read = Write” in the Overview).

## What to remember

- Wallets prove the private phase and produce non‑revertible/revertible effects.
- The sequencer applies effects in phases: non‑revertible → setup → app logic (checkpoint/rollback) → teardown (fees).
- Receipt statuses reflect where a failure occurred; non‑revertible effects persist.