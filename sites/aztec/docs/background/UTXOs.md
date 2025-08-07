# UTXOs

A UTXO (Unspent Transaction Output) is a cryptographic record representing a commitment to a value (e.g. a token amount or a state) that has not yet been spent. Inspired by Bitcoin's model, Aztec uses UTXOs to represent discrete state fragments that are consumed and replaced by new UTXOs in a transaction.

Each UTXO contains:

- A payload (e.g. value, owner's public key, asset ID)
- A commitment, a cryptographic hash that binds together the payload and some associated randomness, locking the data in a private and unforgeable container.
- A position in a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree) used to verify existence and support efficient lookups.
- A reference to an owner who can later spend the UTXO via a Zero Knowledge Proof (optional in some cases).

Unlike Bitcoin, these UTXOs are **private** and can represent **arbitrary data**, not just currency.

We can think of a UTXO as an object with the following fields:

- `value`: The amount or data represented
- `owner_pub_key`: Public key of the UTXO owner
- `randomness`: Used to prevent brute-force attacks and deducing the commitment from the value and owner
- `nonce`: A hidden value added by Aztec to prevent collisions when creating the same note with the same randomness multiple times
- `commitment`: `Hash(value, owner_pub_key, randomness, nonce)`

### Spending a UTXO Token Balance

When a user spends a UTXO representing a token balance:

1. They demonstrate possession of the token balance by using a secret key.
2. They prove the UTXO exists in the Merkle tree without revealing its contents.
3. They generate a **nullifier**, which acts as a unique fingerprint ensuring this UTXO token balance cannot be used again.  
   **Nothing** in the proof or the nullifier reveals which specific UTXO token balance is being spent.
4. They prove that the nullifier wasn't previously recorded in the nullifier tree, ensuring the token balance is not double-spent.

:::note Concept
We will define nullifier in the following sections.
:::

5. They create new UTXOs for recipients, each with its own encrypted commitment.

### Example: Private Transfer

Let’s say Alice holds a private UTXO containing **10 AZT** tokens. This UTXO's commitment is inserted into the Merkle tree.

When Alice wants to spend it, she:

- Proves she knows the preimage of the commitment (e.g. the original value, asset type, key, and randomness).

:::info
**Reminder of the definition of Preimage:**

Let $$f: A \rightarrow B$$ be a map between sets $A$ and $B$. 

Let $Y \subseteq B$. Then the preimage of $Y$ under $f$ is denoted by $f^{-1}(Y)$, and is the set of all elements of $A$ that map to elements in $Y$ under $f$. Thus $f^{-1}(Y) = \{a \in A \mid f(a) \in Y\}$.

In other words, the preimage of a set $Y \subseteq B$ is made up of all the elements in the domain $A$ that, when plugged into the function $f$, give you something inside $Y$. 

You're essentially tracing the function backwards from the set $Y$ in the codomain, and collecting all the inputs from $A$ that map to it.
:::

- Generates a nullifier for the spent UTXO
- Publishes the nullifier to the nullifier tree
- Creates a new UTXO for Bob containing the 10 AZT, encrypted with his public key

:::note UTXO Lifecycle
A UTXO goes through several states during its lifecycle:

1. **Creation**: A new UTXO is created and its commitment inserted into the Merkle tree.
2. **Active**: The UTXO exists in the tree and can be spent.
3. **Spent**: When used, a nullifier is generated and the UTXO becomes invalid.
4. **Replacement**: New UTXOs are created to replace the spent ones. In the case of tokens, total value is preserved.

:::
