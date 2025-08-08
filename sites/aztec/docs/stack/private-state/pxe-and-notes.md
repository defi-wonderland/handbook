# PXE and Notes

## What is the PXE?

The Private Execution Environment (PXE) is a local tool that helps users manage their private data and perform cryptographic operations needed to interact with the Aztec network. It is not responsible for continuous syncing, trial decryption, or automatic note discovery. 

Instead, contracts and applications are given the tools to find or receive the messages necessary to locate notes. The PXE's role is to provide utilities and APIs that assist users and contracts in processing private data, managing secret keys, and generating zero-knowledge proofs for transactions. It does not act as a general-purpose client or perform background scanning for notes. Developers can use the PXE to build privacy-preserving applications, but the responsibility for finding and handling notes lies with the contract logic and user workflows, not with the PXE itself.

## Core Components and Architecture

The PXE is not a single monolithic program but a collection of distinct components working in concert. The implementation can be found in the [`pxe_service.ts`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/pxe_service/pxe_service.ts) file.

### `PXEService`: The orchestrator

At the heart of the environment is the [`PXEService`](https://github.com/AztecProtocol/aztec-packages/blob/f0619dd82429a5973f3e1da8d7eb0877264908e3/yarn-project/pxe/src/pxe_service/pxe_service.ts#L108) class. It acts as the main entry point and orchestrator, tying all other components together. When a user or a dApp initiates an action, such as sending a transaction or querying for notes, the `PXEService` coordinates the necessary steps, delegating tasks to the specialized components responsible for storage, synchronization, and proving.

### Data Providers and the `KVStore`

The PXE needs to store private data locally and persistently. It achieves this through a set of specialized **Data Provider** classes, each responsible for a specific type of data:

-   **`NoteDataProvider`**: Manages the user's collection of notes, both active (spendable) and nullified (spent). It uses multiple indexes to allow for efficient querying, for example, finding all notes for a specific contract or all notes received by a certain user account.
-   **`ContractDataProvider`**: Stores information about smart contracts the user has interacted with, including their artifacts and addresses.
-   **`AddressDataProvider`**: Manages the set of addresses (accounts) the user controls within the PXE.
-   **`KeyStore`**: Securely holds the user's secret keys.

All these providers are built on top of a generic key-value store (`AztecAsyncKVStore`), which handles the low-level data persistence. 

### The Synchronizer

A user's private state is affected by on-chain events. The **`Synchronizer`** is a library component the wallet calls to advance PXE’s internal view of the network to the tip of the chain and detect reorgs. It does not run continuously and does not scan blocks in the background. When invoked by the wallet, it processes relevant blocks/logs and updates local state accordingly.

### Proving Engine: Kernel Prover and Oracle

The most computationally intensive task the PXE performs is generating proofs for private transactions. This is handled by a (pretty elegant) proving engine composed of two main parts:

-   **[`PrivateKernelExecutionProver`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/private_kernel/private_kernel_execution_prover.ts)**: This is the logic that sequences the steps of a private transaction. A single user action can involve multiple function calls (e.g. a "merge and split" of notes). This components walks through this execution tree and, for each step, prepares the inputs for the appropriate private kernel circuit (`init`, `inner`, or `tail`).

-   **[`PrivateKernelOracle`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/private_kernel/private_kernel_oracle.ts)**: The kernel circuits cannot directly access the network or the PXE's database while they are running. The [`PrivateKernelOracleImpl`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/private_kernel/private_kernel_oracle_impl.ts) acts as a data bridge. Before the prover runs a circuit, it uses the oracle to fetch the necessary data—such as Merkle proofs for note inclusion, contract bytecode, public key material and key “fingerprints” (never raw secret keys), and randomness that cannot be generated inside the circuit. Oracle outputs are injected as private inputs to the circuit; all private inputs are unconstrained by default and must be validated by circuit constraints.

:::note
Kernels do not perform oracle calls during proving and do not use `rand()`. Their structure is designed for prefetching all required inputs and then processing them in one pass for performance and simplicity.
:::

## The Lifecycle of a Note in the PXE

The PXE is where the lifecycle of a note is practically managed. From a user's perspective, a note's journey is defined by how their PXE discovers, stores, and ultimately nullifies it.

### 1. Discovery, Decryption, and Storage

A note's life in the PXE begins when the wallet asks the Synchronizer to advance state. Upon request, the [`Synchronizer`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/synchronizer/synchronizer.ts) fetches the necessary blocks or logs from an Aztec Node and uses wallet-provided keys/tagging schemes to identify and decrypt the user’s messages (no continuous trial decryption). Newly recovered notes are reconstructed and handed to the [`NoteDataProvider`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/storage/note_data_provider/note_dao.ts) for local storage.

The `NoteDataProvider` then saves the note to the local [`KVStore`](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/kv-store). Besides storing the note's content, it also creates several indexes to make finding the note later fast and easy. For instance, it indexes the note by its contract address, its storage slot, and its owner. This way, when a dApp asks, "what is my private `TokenA` balance?" the PXE can compute it efficiently; when constructing a transaction, the wallet uses these indexes to select notes internally (not exposed to the dApp).

### 2. Querying for Spendable Notes

Once a note is stored in the `NoteDataProvider`, it is considered **active** and is available to be used in future transactions. When a user wants to initiate an action (e.g. make a payment), the wallet queries the [`PXEService`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/pxe_service/pxe_service.ts) to select notes internally.

:::note App-facing APIs
End-user dApps should query a user’s private balance, not raw notes. Raw note inspection is the job of contracts and the PXE; contracts read notes and emit nullifiers. Wallets/dApps surface balances and rely on the PXE to select notes internally when constructing transactions.
:::

A request to [`pxe.getNotes(filter)`](https://github.com/AztecProtocol/aztec-packages/blob/f0619dd82429a5973f3e1da8d7eb0877264908e3/yarn-project/pxe/src/pxe_service/pxe_service.ts#L657-L676) allows an application to specify criteria to find suitable notes. The filter can include the note's contract address, owner, or even a minimum value, to ensure only relevant notes are returned. The `NoteDataProvider` uses its indexes to quickly gather and return the requested notes to the application, which can then select which ones to use as inputs for the new transaction.

### 3. Spending and Nullification

When a user decides to spend a note, it becomes an input to a new private transaction. The `PXEService` simulates the execution, and the `PrivateKernelExecutionProver` generates a proof that this note is being consumed. A key part of this proof is the creation of a **nullifier**, a unique value that signals that the input note has been used.

The transaction, containing the new note commitments and the nullifier(s) for the spent note(s), is sent to the Node and eventually included in a block.

The PXE that *sent* the transaction doesn't immediately mark the note as spent. Instead, it waits for the `Synchronizer` to see the transaction confirmed on-chain. During its next sync, the `Synchronizer` will process the block containing the transaction and see the new nullifier. Since the PXE knows which nullifier corresponds to which of its stored notes, it will recognize this nullifier and instruct the `NoteDataProvider` to update the note's status.

The `NoteDataProvider` moves the note from the "active" set to the "nullified" set. The note's data is not deleted, it is preserved as a historical record, but it is no longer considered spendable and will not be returned in queries for active notes. This final step completes the note's lifecycle within the PXE, ensuring that the user's local state accurately reflects the public state of the network.

## Private Message Delivery and the PXE

The protocol specification for [Private Message Delivery](https://github.com/AztecProtocol/aztec-packages/tree/next/docs/docs/protocol-specs/private-message-delivery) outlines a system for securely sending private data between users. The PXE is the practical, client-side implementation of this system. As we said, it is the component that holds the user's keys, receives the messages, and manages the resulting private state.

### PXE's Role in Note Discovery

Note discovery avoids trial-decrypting the entire network by relying on tags derived from sender/receiver secrets. When the wallet invokes it, the Synchronizer computes the expected tags (given the registered keys) and queries an Aztec Node for matching logs. It then decrypts only those matching messages and updates local state. The PXE does not autonomously scan; the wallet drives when and how discovery runs.

### PXE as an Oracle for Sending Notes

The [guidelines for sending notes](https://github.com/AztecProtocol/aztec-packages/blob/9071986bfe3af58c70d2c80c10f523e22bfe4cb4/docs/docs/protocol-specs/private-message-delivery/send-note-guidelines.md#L4) recommend that applications first look for a recipient's encryption keys and precompile preferences in a public registry. However, a user may not have registered yet. To handle this case and allow users to receive notes even before they've interacted with the network, applications can rely on the sender's environment.

As shown in the pseudocode for [`provably_send_note`](https://github.com/AztecProtocol/aztec-packages/blob/372980b2f09de871ee7152879dcda8bdfe254b9d/docs/docs/protocol-specs/private-message-delivery/send-note-guidelines.md?plain=1#L21-L41):
```rust
fn provably_send_note(recipient, note, encryption_type)

    let block_number = context.latest_block_number
    let public_state_root = context.roots[block_number].public_state
    let storage_slot = calculate_slot(registry_address, registry_base_slot, recipient)

    let public_keys, precompile_address
    if storage_slot in public_state_root
        context.update_tx_max_valid_block_number(block_number + N)
        public_keys, precompile_address = indexed_merkle_read(public_state_root, storage_slot)
    else if recipient in pxe_oracle
        address_preimage = pxe_oracle.get_preimage(recipient)
        assert hash(address_preimage) == recipient
        public_keys, precompile_address = address_preimage
    else
        registry_address.assert_non_membership(recipient)
        return

    batch_private_delegate_call(precompile_address.encrypt_and_broadcast, { public_keys, encryption_type, recipient, note })
```

If a recipient is not in the public registry, the application can make an oracle call to the sender's PXE: `pxe_oracle.get_preimage(recipient)`. The PXE, if it has been given the recipient's address details out-of-band, can provide the necessary public keys.

:::note Illustrative snippet
The `pxe_oracle.get_preimage(recipient)` call is documentation pseudocode, not a stable, exported client API. App UIs should query balances via contract methods (e.g. `balance_of_private`) and rely on the PXE/wallet to select notes internally when building transactions. Key/recipient resolution may be implemented app-side using local PXE facilities, but is not exposed as a generic `get_preimage` API.
:::

### The Destination for Private Data

Ultimately, the goal of private message delivery is to transmit the plaintext of a note to its new owner. The PXE is the final destination for this data. After a sender's application encrypts a note using the recipient's public key (which may have been fetched with the help of the sender's PXE), and after the recipient's `Synchronizer` discovers and decrypts it, the note finds its home in the recipient's `NoteDataProvider`.

As a tl;dr, the entire system of encryption, tagging, and broadcasting is designed to guide a note from its creation in one user's private execution to its storage and future use in another user's PXE, keeping its contents confidential from the public network.

## References

- [PXE Service Source Code](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/pxe/src/pxe_service)
- [Private Kernel Source Code](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/pxe/src/private_kernel)
- [Storage Source Code](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/pxe/src/storage)
- [Private Message Delivery Specification](https://github.com/AztecProtocol/aztec-packages/tree/next/docs/docs/protocol-specs/private-message-delivery)
- [KVStore](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/kv-store)