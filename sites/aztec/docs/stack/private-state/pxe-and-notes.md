# PXE and Notes

## What is the PXE?

The Private Execution Environment (PXE) is designed to run on a user's local machine. It acts as a personal, trusted environment that manages a user's private data, such as their secret keys and notes, and handles all the cryptographic heavy lifting required to interact with the network while preserving privacy.

At its core, the PXE serves as a client to an Node. While the Node provides a view of the public state of the network, the PXE is responsible for everything that happens on the user's side *before* a transaction is sent to the network, which includes:

- **State Management**: it stores a user's private state. This isn't just limited to secret keys; it also includes a database of all the notes a user owns, which represent their assets or private data within different applications. It keeps track of which notes are available to be spent and which have already been nullified.
- **Note Discovery and Decryption**: it continuously syncs with the Aztec network, scanning for incoming notes intended for the user. It uses the user's keys to try and decrypt data from the chain, and when it successfully decrypts a note, it adds it to the user's local database.
- **Transaction Simulation and Proving**: when a user wants to perform an action, like sending funds, the PXE simulates the transaction locally. It then orchestrates the creation of a zero-knowledge proof by stepping through the necessary private kernel circuits. This process proves that the user is authorized to perform the action (e.g. they own the notes they're trying to spend) without revealing any of the underlying private data.
- **Interface for dApps**: developers can build applications that interact with the PXE, allowing users to manage their assets and interact with smart contracts in a privacy-preserving way.

In essence, the PXE is the user's private gateway to the network. 

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

A user's private state is affected by on-chain events. For the PXE to be useful, it must have an up-to-date view of the user's notes and state. This is the job of the **`Synchronizer`**. It continuously monitors the Aztec Node for new blocks, scans the block data, and attempts to decrypt logs with the user's registered keys. When it finds a new note belonging to the user, it passes it to the `NoteDataProvider` to be stored in the local database. This synchronization process ensures that a user's PXE always reflects their current state on the network, allowing them to see new assets as they arrive.

### Proving Engine: Kernel Prover and Oracle

The most computationally intensive task the PXE performs is generating proofs for private transactions. This is handled by a (pretty elegant) proving engine composed of two main parts:

-   **[`PrivateKernelExecutionProver`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/private_kernel/private_kernel_execution_prover.ts)**: This is the logic that sequences the steps of a private transaction. A single user action can involve multiple function calls (e.g. a "merge and split" of notes). This components walks through this execution tree and, for each step, prepares the inputs for the appropriate private kernel circuit (`init`, `inner`, or `tail`).

-   **[`PrivateKernelOracle`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/private_kernel/private_kernel_oracle.ts)**: The kernel circuits cannot directly access the network or the PXE's database while they are running. The [`PrivateKernelOracleImpl`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/private_kernel/private_kernel_oracle_impl.ts) acts as a data bridge. Before the prover runs a circuit, it uses the oracle to fetch all the necessary data—such as Merkle proofs for note inclusion, contract bytecode, or the user's keys. The oracle gathers this information and provides it as private inputs to the circuit, ensuring the proof can be generated in a self-contained, deterministic environment.

## The Lifecycle of a Note in the PXE

The PXE is where the lifecycle of a note is practically managed. From a user's perspective, a note's journey is defined by how their PXE discovers, stores, and ultimately nullifies it.

### 1. Discovery, Decryption, and Storage

A note's life in the PXE begins with discovery. The [`Synchronizer`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/synchronizer/synchronizer.ts) component is in constant communication with an Aztec Node, observing newly mined blocks. For each transaction in a block, the `Synchronizer` fetches the associated encrypted logs. It then iterates through all the accounts (and their corresponding keys) managed by the PXE's [`KeyStore`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/key-store/src/key_store.ts) and attempts to decrypt these logs.

If a log is successfully decrypted, it means a new note intended for the user has been found. The `Synchronizer` reconstructs the full note data from the decrypted log. This new note, now in its plaintext form, is handed over to the [`NoteDataProvider`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/storage/note_data_provider/note_dao.ts).

The `NoteDataProvider` then saves the note to the local [`KVStore`](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/kv-store). Besides storing the note's content, it also creates several indexes to make finding the note later fast and easy. For instance, it indexes the note by its contract address, its storage slot, and its owner. This way, when a dApp asks, "show me all my `TokenA` notes", the PXE can answer the query efficiently without having to scan every note it owns.

### 2. Querying for Spendable Notes

Once a note is stored in the `NoteDataProvider`, it is considered **active** and is available to be used in future transactions. When a user wants to initiate an action (e.g. make a payment), their wallet application will query the [`PXEService`](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/pxe/src/pxe_service/pxe_service.ts) for available notes.

A request to [`pxe.getNotes(filter)`](https://github.com/AztecProtocol/aztec-packages/blob/f0619dd82429a5973f3e1da8d7eb0877264908e3/yarn-project/pxe/src/pxe_service/pxe_service.ts#L657-L676) allows an application to specify criteria to find suitable notes. The filter can include the note's contract address, owner, or even a minimum value, to ensure only relevant notes are returned. The `NoteDataProvider` uses its indexes to quickly gather and return the requested notes to the application, which can then select which ones to use as inputs for the new transaction.

### 3. Spending and Nullification

When a user decides to spend a note, it becomes an input to a new private transaction. The `PXEService` simulates the execution, and the `PrivateKernelExecutionProver` generates a proof that this note is being consumed. A key part of this proof is the creation of a **nullifier**, a unique value that signals that the input note has been used.

The transaction, containing the new note commitments and the nullifier(s) for the spent note(s), is sent to the Node and eventually included in a block.

The PXE that *sent* the transaction doesn't immediately mark the note as spent. Instead, it waits for the `Synchronizer` to see the transaction confirmed on-chain. During its next sync, the `Synchronizer` will process the block containing the transaction and see the new nullifier. Since the PXE knows which nullifier corresponds to which of its stored notes, it will recognize this nullifier and instruct the `NoteDataProvider` to update the note's status.

The `NoteDataProvider` moves the note from the "active" set to the "nullified" set. The note's data is not deleted, it is preserved as a historical record, but it is no longer considered spendable and will not be returned in queries for active notes. This final step completes the note's lifecycle within the PXE, ensuring that the user's local state accurately reflects the public state of the network.

## Private Message Delivery and the PXE

The protocol specification for [Private Message Delivery](https://github.com/AztecProtocol/aztec-packages/tree/next/docs/docs/protocol-specs/private-message-delivery) outlines a system for securely sending private data between users. The PXE is the practical, client-side implementation of this system. As we said, it is the component that holds the user's keys, receives the messages, and manages the resulting private state.

### PXE's Role in Note Discovery

We need a **note discovery protocol** to help users find their notes without having to trial-decrypt every transaction on the network. This is often achieved by using "tags", data derived from a shared secret between the sender and receiver.

The `Synchronizer` is the engine that performs this discovery. When a user registers an account with their PXE, they are also providing the keys necessary to generate these shared secrets. The `Synchronizer` can then compute the expected tags for incoming messages and efficiently query the Aztec Node for logs that match those tags. This makes the PXE the active agent in the user's chosen note discovery scheme.

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

### The Destination for Private Data

Ultimately, the goal of private message delivery is to transmit the plaintext of a note to its new owner. The PXE is the final destination for this data. After a sender's application encrypts a note using the recipient's public key (which may have been fetched with the help of the sender's PXE), and after the recipient's `Synchronizer` discovers and decrypts it, the note finds its home in the recipient's `NoteDataProvider`.

As a tl;dr, the entire system of encryption, tagging, and broadcasting is designed to guide a note from its creation in one user's private execution to its storage and future use in another user's PXE, keeping its contents confidential from the public network.

## References

- [PXE Service Source Code](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/pxe/src/pxe_service)
- [Private Kernel Source Code](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/pxe/src/private_kernel)
- [Storage Source Code](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/pxe/src/storage)
- [Private Message Delivery Specification](https://github.com/AztecProtocol/aztec-packages/tree/next/docs/docs/protocol-specs/private-message-delivery)
- [KVStore](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/kv-store)