# Nullifiers

A nullifier is a unique *cryptographic fingerprint* derived from a spent note. It acts as a non-linkable yet verifiable proof of spend, allowing the protocol to prevent double-spending while maintaining privacy.

Each nullifier is deterministically derived from a note and the secret key of the spender, but in such a way that:

- It cannot be reverse-engineered to reveal the note or spender.
- It does not link to the new notes being created in the same transaction.
- It ensures that each note can be spent only once under the intended semantics.

Nullifiers are inserted into a **nullifier tree**. A transaction is valid only if the nullifiers it generates are not already present in the tree. In Aztec, nullifiers are *siloed* by contract address before being inserted into the tree, ensuring they are unique to a contract and cannot be reused across different contracts.

:::note Reference
The implementation of the `compute_siloed_note_nullifier` is detailed [here](https://github.com/AztecProtocol/aztec-packages/blob/2b9c409698cf0f475a7a9f5884117c8ad2a4f79a/noir-projects/aztec-nr/aztec/src/note/utils.nr#L77-L90). 
:::

Some properties are that they are:

- **Usually one-to-one**: Each note typically has exactly one nullifier when spent, although there are valid patterns (e.g. delegated actions) where a single note may produce multiple nullifiers.
- **Non-malleable**: Cannot be modified without invalidating the proof.
- **Unlinkable**: Does not reveal which note or who spent it.
- **Deterministic and unique**: Prevents the reuse of a note within its specific context.

A canonical computation is:  
`nullifier = H(note_secret_data, secret_key, constant)`

Where:
- `note_secret_data` includes value, randomness, and asset type.
- `secret_key` is tied to the note's owner.
- `H` is a collision-resistant hash function, specifically `poseidon2_hash_with_separator`.

:::note Reference
For reference in `poseidon2_hash_with_separator`, see [this line](https://github.com/AztecProtocol/aztec-packages/blob/a45107e7f95b675cb2768b6bcb06483b511141f4/noir-projects/aztec-nr/aztec/src/hash.nr#L7).
:::

- `constant` ensures domain separation and is circuit-specific.

#### Example (Basic Spending):
Alice owns a note with:
- `value = 10`
- `owner_pub_key = H(secret_key)`
- `randomness = r1`

To spend it, she computes:  
`nullifier = H(H(10, r1, asset_id), secret_key, CONST)`

This nullifier is inserted into the tree. Any future attempt to reuse the same note will produce a duplicate nullifier and fail.

## Delegated Nullifiers (One-to-Many Case)

Some systems extend the nullifier model to support *multiple actions per note*, while still preventing duplicate executions. For example, consider **voting with a delegated note**:

- A delegator shares their balance note with a delegatee.
- The delegatee cannot see the note's amount but can act (e.g. vote) on its behalf.
- For each voting action, the system generates a **distinct nullifier** based on:
  - The delegated note.
  - The **tally (contract) address**.
  - A **nonce** to avoid collisions.

A delegated nullifier might be computed as:  
`nullifier = H(delegated_note, tally_address, nonce)`

In this model:
- The delegated note remains reusable across multiple votes.
- The system tracks each action individually by enforcing **per-action nullification**, not whole-note nullification.
- The original note may only be fully nullified when the delegation is revoked or modified.

## Nullifier Tree

As discussed earlier, a **Nullifier Tree** is a **sparse Merkle tree** used to track nullifiers. Each leaf corresponds to a nullifier that uniquely and privately marks a note as consumed (or an action as performed).

It plays a central role in:

- Preventing double-spending or re-use.
- Verifying transaction correctness.
- Ensuring unique execution of actions.

Key properties:

- **Append-only**: Nullifiers are only ever added.
- **Public visibility**: Nullifiers are revealed and stored on-chain.
- **Efficient verification**: Tree structure enables $O(\log n)$ inclusion checks.
- **Privacy-preserving**: Nullifiers reveal neither the original note nor the spender.

### Flow Overview

1. **Spending**:
    - A note is consumed in a private function.
    - A nullifier is computed and emitted.
    - It is appended to the nullifier tree.

2. **Verification**:
    - Before a transaction is accepted, each nullifier is checked.
    - The system proves none of them are already in the tree using functions like [`prove_nullifier_non_inclusion`](https://github.com/AztecProtocol/aztec-packages/blob/a45107e7f95b675cb2768b6bcb06483b511141f4/noir-projects/aztec-nr/aztec/src/history/nullifier_non_inclusion.nr#L23-L55).
    - For spent notes, the system can prove inclusion using [`prove_nullifier_inclusion`](https://github.com/AztecProtocol/aztec-packages/blob/a45107e7f95b675cb2768b6bcb06483b511141f4/noir-projects/aztec-nr/aztec/src/history/nullifier_inclusion.nr#L21-L45).

3. **Synchronization**:
    - Clients and provers sync the latest tree root.
    - Merkle paths allow proving non-existence efficiently.