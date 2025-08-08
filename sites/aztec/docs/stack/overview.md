# Overview 

Aztec's global state is a cryptographically authenticated set of data structures that encode the persistent status of the network, updated only when new L2 blocks are sequenced and verified. It is structured as a collection of cryptographic Merkle trees, each serving distinct roles in maintaining privacy, preventing double-spends, synchronizing with L1, and executing public contract logic.

Unlike traditional blockchains that rely on a single key–value Merkle tree, Aztec supports both private and public state. The privacy constraints of zk execution apply to private state and require a dual‑tree design (append‑only note tree and indexed nullifier tree) with asymmetric update and access semantics. Public state is handled separately in an indexed key–value Public Data Tree with conventional membership and non‑membership checks.

## Dual-Tree Design for Private State

The private state **must** be updated without revealing correlations between accesses. The standard Merkle key-value paradigm is unsuitable because updates, even if encrypted, would leak timing and structure.

To circumvent this, Aztec uses:

* A **note tree**: an append-only Merkle tree storing note hashes.
* A **nullifier tree**: an indexed Merkle tree marking spent notes, used to prevent reuse.

This enables safe updates through a **replace-via-append** strategy:

1. Inserting a new note into the data tree.
2. Emitting a deterministic nullifier derived from the old note.

### Nullifier Computation and Isolation

To prevent cross-contract interference and ensure unlinkability, nullifiers are:

* **Isolated** by contract (something like `nullifier = hash([contract, base_nullifier], DOMAIN)`).
* **Deterministically derived** from note preimage data (ownership secret/randomness).
* **Secret-derived**: computed using a secret (e.g. the owner's siloed nullifier secret key or note randomness). This prevents linking notes to their nullifiers; even if someone creates a note for another user, they cannot tell when it is spent because they cannot compute the nullifier, despite the computation being deterministic.

Incorrect or non-deterministic nullifier computation risks either **revealing identity** or **enabling double-spend**.

## Secure State Access

State reads during proving introduce subtle consistency and privacy concerns:

* **Membership in Notes Tree**: Users prove inclusion of notes using append-only history. Since the tree never deletes leaves, historical roots can be used.

* **Non-Membership in Nullifier Tree**: Must be proved **at the head** of the chain. A user cannot prove non-membership themselves because the set of nullifiers changes frequently.

Instead, the **sequencer performs the non-membership check and inserts the nullifier**:

* Transactions include the nullifier.
* The sequencer checks it's not already present, proves non-membership, and inserts it.
* Conflicting nullifiers will fail inclusion.

### Read = Write (why reads nullify)

For private, mutable values, you cannot prove that you are reading the current value yourself because non-membership in the nullifier tree must be checked at the head of the chain (by the sequencer). To tie your transaction’s validity to the value being current, the transaction:

* Emits the nullifier for the previously active note (the sequencer proves non-membership and inserts it), and
* Re-creates the note with the same plaintext and fresh randomness so it remains available for future reads/writes.

This makes reads mutating operations. Semantic indistinguishability from writes is a side effect, not the primary reason. A consequence is that shared notes become mutable: once read and re-emitted, any transactions depending on the original may be invalidated.

## State Categories and Merkle Tree Types

In Aztec, global state is partitioned across five specialized Merkle trees:

| Tree                   | Purpose                                      | Type        | Proof Support                                          |
| ---------------------- | -------------------------------------------- | ----------- | ------------------------------------------------------ |
| **Note Hash Tree**     | Stores commitments to new private notes      | Append-only | Membership                                             |
| **Nullifier Tree**     | Stores spent-note nullifiers, prevents reuse | Indexed     | Non-membership                                         |
| **Public Data Tree**   | Key-value store for public contract state    | Indexed     | Membership + Non-membership                            |
| **L1→L2 Message Tree** | Stores inbound messages from L1              | Append-only | Membership (uses nullifier tree for replay protection) |
| **Archive Tree**       | Stores historic block headers                | Append-only | Membership (used in private proofs)                    |

### Indexed Merkle Trees

Used for the **nullifier** and **public data** trees, indexed Merkle trees (IMTs) enable efficient non-membership proofs:

* Each leaf contains a `(value, nextValue, nextIndex)` triple.
* Trees behave like a Merkle-linked list, allowing binary search for bounding nodes.

This avoids sparse tree overhead and reduces the cost of non-membership proofs from 256 hashes to log-scaled bounds.

## Isolation and Commitment Semantics

Isolation is used extensively across the trees to prevent cross-domain interference. For example:

```rust
fn compute_siloed_note_hash(commitment, contract, tx):
  let index = index_of(commitment, tx.commitments)
  let nonce = hash([tx.tx_hash, index], NOTE_HASH_NONCE)
  let unique = hash([nonce, commitment], UNIQUE_NOTE_HASH)
  return hash([contract, unique], SILOED_NOTE_HASH)
```

Each note commitment is made unique and siloed per contract to enforce:

* Independence of contract states
* Unique nullifiers per note (prevents nullifier collisions / faerie-gold attacks)

:::note
A faerie-gold attack is a class of replay or double-spend attack where two distinct notes (commitments) are constructed such that they share the same nullifier. If this occurs, spending one note (emitting its nullifier) would unintentionally invalidate the other, allowing an attacker to "spend" the same nullifier multiple times or disrupt contract logic.
:::

Replay prevention is enforced by the nullifier tree via sequencer-checked non-membership. Note uniqueness exists to avoid different notes sharing the same nullifier, not to provide replay resistance.

## Tree Structure in Header Commitments

State commitments in Aztec block headers include snapshots of each tree. These enable:

* Stateless proving from archived block roots
* Efficient syncing via tree frontiers

![trees](/img/diagrams/trees-relationship.png)

Each `Snapshot` includes the Merkle root and the next available leaf index to enforce append-only semantics.

## Wonky Trees and Rollup Composition

Aztec uses **unbalanced 'wonky' trees** for rollup circuit composition, avoiding padding of empty transactions:

* Rollups are constructed as left-filled binary trees of variable depth.
* This enables efficient aggregation of any number of transactions.
* Output roots are used in L1↔L2 message validation and archive proofs.

:::note Reference
See [this section](https://github.com/AztecProtocol/aztec-packages/blob/next/docs/docs/protocol-specs/state/tree-implementations.md#wonky-merkle-trees) in Aztec Protocol Specs for further information.
:::
## References
- [Protocol Specs](https://github.com/AztecProtocol/aztec-packages/tree/next/docs/docs/protocol-specs/state)
- [Trees Implementation](https://github.com/AztecProtocol/aztec-packages/tree/next/yarn-project/stdlib/src/trees)