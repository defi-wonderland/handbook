# Anatomy of a note

The previous sections established a clear goal to move from Ethereum's default transparency to a model of privacy by default. We also introduced Privacy Pools as a practical implementation of this idea, a system that breaks transaction linkability by shifting from a public account model to a private UTXO model. At the heart of this shift is the concept of a **Note**. 

### What is a note ?

As we've established, the protocol's privacy stems from its use of a UTXO model. Unlike in Ethereum's account model where your balance is a single number, here your private funds are a collection of discrete Notes. This naturally leads to the core rule of the system.

 **One Deposit = One New Note.**

But what *is* a Note, cryptographically speaking? It is not a token, nor is it a single piece of data stored onchain. A Note is best understood as a bundle of data, composed of private secrets held by the user and a public representation as a commitment stored onchain. Control over the Note is defined by the ability to use its private secrets to generate a valid [zk proof](./the-proof.md) of ownership. Without these secrets, the value or spendability is inaccessible.

### Deconstructing a note

The generation of every Note is deterministic, starting from a single master `rootSecret` stored in the user's wallet. This ensures that the wallet can always regenerate all of its Note data from a single seed, a crucial feature for backup and recovery.

The process begins by using a Key Derivation Function (HKDF) to derive an `appSecret`, which in this case will be a `masterNullifier` and a `masterSecret`. These two master keys act as the roots for deterministically generating the unique private components for every individual Note a user creates.

![Secret and nullifier derivation](/img/diagrams/secret_nullifier.png)

As shown above, for each new deposit (and thus each new Note), the wallet derives a unique `nullifier` and `secret` from these master keys. These become the private inputs for the Note, known only to the user.

Once a deposit is made and the private inputs are generated, they are combined with the public details of the deposit, its `value` and a `label` to create the final onchain `commitment`. This process uses a SNARK-friendly hash function like Poseidon for onchain efficiency.

![Note inputs](/img/diagrams/note_inputs.png)

The construction is a two step hash:

1. A `precommitment` is created by hashing the private inputs (`nullifier` and `secret`).
2. The final `commitment` is created by hashing this `precommitment` with the public inputs (`value` and `label`).

The inputs are separated into two distinct categories:

- **Private Inputs:** The `secret` and `nullifier`, which are derived from the user's `rootSecret` and remain in the wallet.
- **Public Inputs:** The `value` of the Note (e.g., 1 ETH) and the `label`, a unique identifier shared among all withdrawal commitments that are children of a single deposit commitment.

Ultimately, only the final `commitment` is published onchain. This public hash acts as a placeholder for the deposited funds without revealing any of the private data used to create it.

### The Inherent Challenge of Composition

This design, where each Note is a discrete and indivisible object, is the source of the system's privacy. However, it also introduces a subtle but critical challenge, **composition**.

Privacy Pools v1 does not support incremental deposits into an existing Note, resulting in fragmented balances across multiple Notes. The wallet abstracts this complexity by presenting a unified balance to users, but under the hood, it must handle batch operations transparently.

The more significant challenge arises when you want to make a withdrawal that is *larger* than any single Note you possess. When a user wants to withdraw 0.8 ETH, but  only holds two Notes of 0.5 ETH each the system leaves you stuck. You cannot combine the value of these two Notes in a single withdrawal because each valid withdrawal proof is tied to spending a single Note commitment.

This creates two distinct but related problems that must be solved.

First, the system should be *capable* of using several Notes at the same time to fund a single withdrawal. For that, we created the **Batch Withdrawer**. This is the onchain mechanism, a specialized contract designed to process and validate the spending of multiple notes simultaneously and atomically in a single transaction. 

Second, from all the available notes a user possesses, the system needs to intelligently pick the best combination to use for a withdrawal. The goal is to maximize the user's privacy without requiring them to be a cryptography expert. For that reason, the wallet implements a n**ote selection algorithm**. This is the client side logic that analyzes a user's entire set of notes and chooses the optimal subset to construct a withdrawal, turning the complex task of UTXO management into a seamless user experience.

### Conclusion

The note is the cryptographic primitive that enables onchain privacy. However, using these individual notes to make withdrawals is impractical if it’s not handle properly.

This is solved by two components working together:

1. The **[Batch Withdrawer](./batch-withdrawal.md)** contract, which allows multiple notes to be spent at once.
2. The **[Note Selection Algorithm](./note-selection-algorithm.md)** in the wallet, which chooses the right notes to maximize privacy.

The following will explain how each of them works.