# Private Kernel

The Private Kernel is responsible for executing the private aspects of a transaction in a way that preserves user privacy. It is a sequence of circuits run on the user's own device (within the [PXE](./pxe-and-notes.md)) that takes a series of private function calls, proves their correct execution, and aggregates their results, all without revealing any confidential information.

This is the only part of the core protocol that is truly **zero-knowledge**. While many "zk-Rollups" use SNARKs for their succinctness (to compress computation), Aztec's private kernel also uses them for their zero-knowledge property. It ensures that all details of a private transaction—the functions called, the arguments passed, the notes consumed and created—remain completely private to the user. This is why Aztec is sometimes called a "zk-zk-Rollup" or an "_actual_ zk-Rollup".

At a high level, the private kernel's job is to:
1.  **Prove** that a sequence of private function executions is valid according to the rules of the respective smart contracts.
2.  **Enforce** protocol-level rules (e.g., ensuring counters are correct, function calls are properly formed).
3.  **Accumulate** the side-effects of the private functions (new note hashes, nullifiers, L2-to-L1 messages, and enqueued public function calls).
4.  **Produce** a single, verified proof of the entire private phase of the transaction, with public outputs that can be consumed by the rest of the network without leaking private data.

## The Kernel Chain

A single transaction can involve multiple private function calls, potentially creating a complex execution tree. For example, a single top-level call might make several nested calls to other private functions. The Private Kernel handles this complexity by processing each private function call in sequence, one at a time.

It does this by creating a "chain" of proofs. Each step in the chain takes the proof from the previous step and the execution trace of the *next* private function call. It then produces a new, updated proof that attests to the validity of the entire sequence so far. This is orchestrated by the [`PrivateKernelExecutionProver`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/private_kernel/private_kernel_execution_prover.ts) in the PXE.

This chain is not made of a single, repeating circuit. Instead, there are four specialized types of kernel circuits that are used at different stages of the process:

1.  **Initial Private Kernel:** This is always the first circuit in the chain. It takes the user's transaction request and the first private function call, performs special "first-run" checks, and kicks off the proof chain.
2.  **Inner Private Kernel:** This is the workhorse circuit. For every subsequent private function call, an inner kernel circuit is run. It verifies the proof from the previous kernel step, processes the new function call, and appends its side-effects to the accumulated data.
3.  **Reset Private Kernel:** This is a special "cleanup" circuit that can be run at any point in the chain. Its job is to process and clear out "transient" data—for example, proving that a read request for a note was valid. This makes room for more data to be accumulated in subsequent steps. There are different variations of the reset kernel for different data types.
4.  **Tail Private Kernel:** This is always the last circuit in the private kernel chain. It performs final processing on the accumulated side-effects from all previous steps. Crucially, it sorts the data into **revertible** and **non-revertible** buckets and formats the final public outputs that will be passed on to the public execution phase and eventually the rollup.

The diagram from the [High-Level Topology spec](https://github.com/AztecProtocol/aztec-packages/blob/next/docs/docs/protocol-specs/circuits/high-level-topology.md) illustrates this flow, showing how private function calls (`f0`, `f1`, etc.) are fed one-by-one into the Private Kernel sequence (`init0`, `inner0`, `reset0`, `tail0`).

Let's look at each of these circuits in more detail.

:::note
Kernels do not perform oracle calls during proving and do not use `rand()`. Their structure is designed for prefetching all required inputs and then processing them in one pass for performance and simplicity. All circuit private inputs are unconstrained; oracle return values are identical in status to private inputs and must be constrained by the circuit.
:::

### 1. The Initial Kernel

As its name suggests, the `Initial Private Kernel` circuit is always the first one executed. It has several unique responsibilities that only need to happen once per transaction:

- **Validating the Transaction Request:** It checks that the first private function call matches the user's intent, as specified in the `TransactionRequest`. This ensures that the transaction being executed is the one the user actually authorized.
- **Creating the Transaction Nullifier:** The initial kernel computes a hash of the `TransactionRequest` and emits this as the **very first nullifier** of the transaction. This transaction-level nullifier prevents transaction replays by acting as a unique identifier for the transaction (this is not the transaction hash, even though it may appear similar).
- **Validating the First Function Call:** It performs a series of checks on the first private function execution, including:
    - Verifying the function's proof.
    - Ensuring the function being called actually exists within the specified contract's class.
    - Validating the counters that order events within the function call.
- **Passing on Accumulated Data:** It takes all the side-effects from this first function call (note hashes, nullifiers, logs, etc.) and places them into the `transient_accumulated_data` field in its public outputs, ready for the next kernel circuit in the chain.

:::note reference
You can find the detailed specification for this circuit in [`private-kernel-initial.mdx`](https://github.com/AztecProtocol/aztec-packages/blob/next/docs/docs/protocol-specs/circuits/private-kernel-initial.mdx).
::: 

### 2. The Inner Kernel

After the initial kernel has run, the `Inner Private Kernel` takes over for all subsequent private function calls. Its role is to incrementally build upon the proof chain:

1.  **Verify the Previous Proof:** It takes the public inputs and proof from the previous kernel iteration (which could be an initial kernel, or another inner kernel) and verifies that they are valid.
2.  **Process the Next Function Call:** It takes the data for the next private function call in the execution trace and performs the same validation checks as the initial kernel (verifying the proof, checking function existence, validating counters, etc.).
3.  **Append Side-Effects:** It takes the side-effects from the current function call and appends them to the `transient_accumulated_data` it received from the previous kernel step.
4.  **Output a New Proof:** It generates a new proof and a new set of public inputs that now represent the accumulated state of the transaction up to this point.

This process repeats for every private function call in the transaction, with each inner kernel iteration adding one more link to the chain.

### 3. The Reset Kernel

During a complex transaction, the `transient_accumulated_data` can fill up with "transient" information, which is data that is created and consumed within the same transaction. A prime example is a **read request**. If a function needs to read a note that was just created by a previous function in the same transaction, it emits a read request.

The `Reset Private Kernel` is a special-purpose circuit designed to handle these cases. Instead of processing a new function call, it processes the existing accumulated data:

- **Validating Read Requests:** It can take a read request for a settled value (from a past transaction) and perform the Merkle membership check to prove it exists in the state trees. Or, it can take a read request for a pending value (from the current transaction) and prove it was emitted earlier in this same transaction.
- **Clearing Transient Notes:** If a note is created and then nullified within the same transaction, the reset kernel can validate this and remove both the note hash and the nullifier from the accumulated data, freeing up space.
- **Validating Keys:** It can also handle key validation requests, ensuring secret keys were derived correctly.

By running a reset kernel, the PXE can "clean up" the accumulated data mid-transaction, allowing for more events to be processed than would otherwise fit in a single kernel iteration. 

:::note Reference
The detailed specification for this circuit is in [`private-kernel-reset.md`](https://github.com/AztecProtocol/aztec-packages/blob/next/docs/docs/protocol-specs/circuits/private-kernel-reset.md).
:::

### 4. The Tail Kernel

Once all private function calls have been processed by the initial and inner kernels, and any necessary resets have occurred, the `Tail Private Kernel` runs once to finalize the private phase of the transaction. It has several critical final responsibilities:

- **Final Proof Verification:** It verifies the proof of the very last kernel iteration.
- **Siloing Values:** It takes all the accumulated note hashes, nullifiers, and L2->L1 messages and "silos" them. This means hashing them with the contract address that produced them, ensuring that a nullifier from one contract cannot be confused with a nullifier from another. It also makes note hashes unique by hashing them with a nonce derived from the transaction nullifier.
- **Ordering and Splitting Data:** This is its most important job. It takes the final, unordered list of side-effects and sorts them chronologically based on their counters. It then splits these sorted lists into two buckets:
- **Non-Revertible Data:** Side-effects that should be processed even if the public part of the transaction fails (e.g. the transaction nullifier).
- **Revertible Data:** Side-effects that should only be processed if the public part of the transaction succeeds.
- **Producing Final Outputs:** It produces the final `AccumulatedData` (both revertible and non-revertible) and the list of enqueued public function calls. These are the public outputs of the entire private kernel phase.

:::note reference
The detailed specification for this circuit can be found in [`private-kernel-tail.md`](https://github.com/AztecProtocol/aztec-packages/blob/next/docs/docs/protocol-specs/circuits/private-kernel-tail.md).
:::

## From Private to Public: The Kernel Output

The output of the Tail Kernel is a crucial bridge between the private and public phases of a transaction. It hands off a structured, verified set of data to the next component in the chain (e.g. a Sequencer's AVM simulator), which is responsible for public execution. The [`tx_execution.cpp`](https://github.com/AztecProtocol/aztec-packages/blob/next/barretenberg/cpp/src/barretenberg/vm2/simulation/tx_execution.cpp) file is where the implementation lives.

The hand-off is built around the two main buckets of data produced by the Tail Kernel: `nonRevertibleAccumulatedData` and `revertibleAccumulatedData`. The public execution environment processes these in distinct phases:

1.  **Non-Revertible Phase**: First, the simulator processes all `nonRevertibleAccumulatedData`. This includes inserting the core transaction nullifier, along with any other side effects (note hashes, nullifiers) that *must* be included on-chain, regardless of what happens in the public domain. These actions are final.

2.  **Public Setup**: The simulator executes the public functions enqueued for the "setup" phase of the transaction. These are for pre-transaction logic that should also not be reverted.

3.  **Revertible Phase**: This is where the atomicity of private/public interactions is enforced.
    - The simulator first creates a **checkpoint** of the state trees.
    - It then processes the `revertibleAccumulatedData`, inserting the revertible note hashes and nullifiers into the trees.
    - Next, it executes the main "app logic" public function calls.
    - If any of these public function calls fail or revert, the simulator can simply **discard** all changes made since the checkpoint. This effectively erases the `revertibleAccumulatedData` and the effects of the failed public calls, as if they never happened. If everything succeeds, the checkpoint is committed.

4.  **Teardown Phase**: Finally, regardless of the outcome of the revertible phase, teardown logic is executed. This is where transaction fees are settled (deducted from the payer) and any protocol-defined reimbursements/refunds are finalized.

This elegant structure, with the kernel carefully sorting side-effects and the public VM executing them in phases, is what allows us to build complex applications that atomically interact with both private and public state.

## References

- [PXE Implementation](https://github.com/AztecProtocol/aztec-packages/tree/7e505bcd7fcd90a7d5fe893194272157cc9ec848/yarn-project/pxe)
- [Private Kernel Execution Prover](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/private_kernel/private_kernel_execution_prover.ts)
- [High Level Circuit Topology](https://github.com/AztecProtocol/aztec-packages/blob/next/docs/docs/protocol-specs/circuits/high-level-topology.md)
- [Private Kernel Tail Circuit Spec](https://github.com/AztecProtocol/aztec-packages/blob/next/docs/docs/protocol-specs/circuits/private-kernel-tail.md)
- [Transaction Execution Implementation](https://github.com/AztecProtocol/aztec-packages/blob/next/barretenberg/cpp/src/barretenberg/vm2/simulation/tx_execution.cpp)