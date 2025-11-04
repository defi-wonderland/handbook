# Understanding wallet mechanisms


![contract-storage-read](/img/diagrams/wallet-mechanism.png)

When you interact with Ethereum, whether sending ETH or using DeFi protocols, you're relying on a wallet mechanism. But what exactly is this system, and why does it work the way it does?

At its heart, a wallet is a specialized piece of software for managing cryptographic keys and using them to create valid messages that the Ethereum blockchain can understand. To do this, the wallet's mechanism must reliably perform three core functions, which we can think of as the three acts of a wallet's life, **initialization**, **transaction generation**, and **transaction broadcast**.

This diagram shows a simplified but complete journey. Let's break down each stage.

## **Initialization, the birth of an account**

Before a wallet can do anything, it must create a unique, secure identity on the network. This is the initialization phase.

It begins not with a private key, but with randomness. A wallet generates a random number that is used as a **mnemonic phrase** or **seed**. This phrase is the ultimate backup, the root from which all keys are derived. This step is critical, if the randomness is not cryptographically secure, an attacker could potentially regenerate the seed and gain control of the account.

The natural question that arises is, how does this phrase become a key? The process is a bit more involved than the diagram shows. The mnemonic phrase is put through a key derivation function (standardized in BIP-39) to produce a single master seed. This seed is then used, along with a derivation path (like `m/44'/60'/0'/0/0` for Ethereum), to generate a specific 32-byte **private key** (`sk`). This is the single most important secret a user holds.

From this private key, a **public key** (`pk`) is derived using the `secp256k1` elliptic curve algorithm. This is a one way, you can generate a public key from a private key, but you cannot go the other way around. The public key is then hashed using the `Keccak-256` algorithm, and the last 20 bytes of that hash become the public **Ethereum address** (the `0x...`).

Finally, the private key itself is encrypted with a user password and placed in **secure storage** on the device. This ensures that even if an attacker gets access to your device's files, they still cannot access the `sk` without also knowing your password.

## Transaction Generation

Once initialized, the wallet can create transactions. A transaction is, fundamentally, a signed message that proposes a state change.

The process of creating this message is the **transaction generation algorithm**. It begins by gathering the transaction details, what the diagram calls `state trx info`. For Ethereum, this includes the recipient (`to`), the `value` of ETH being sent, and an optional `data` field for smart contract interactions. It also includes `gasLimit` and fee parameters.

Crucially, it includes a **nonce**. The nonce is a simple counter that tracks the number of transactions sent from your account. It starts at 0 and increments by one for every transaction. This is essential for preventing replay attacks.

The wallet bundles all these details into a structured object, hashes it (using `Keccak-256`), and creates a unique **transaction hash**. Now, the wallet needs to prove that you, the owner of the private key, authorize this intent. The user is prompted for their password, which temporarily decrypts the private key into the wallet's memory. The wallet then uses this decrypted private key to **sign** the transaction hash using the Elliptic Curve Digital Signature Algorithm (`ECDSA`). This produces a cryptographic **signature** (`r,s,v`). This signature is a mathematical proof that the owner of the private key corresponding to the public key has approved this exact transaction hash.

## Verification and broadcast

At this point, the wallet has created a signed instruction, but it's still just local data on a user's device. The final step is to publish it to the network so it can be executed. This is the role of the **transaction broadcast algorithm**.
The wallet combines the original transaction data with the signature, creating a message that can be understood by any Ethereum node. When a node receives the transaction, it performs a quick verification. It uses the signature to recover the public key of the signer. If the address derived from that recovered public key matches the `from` address of the transaction, the signature is valid. The transaction is then added to the "mempool," a waiting area for pending transactions. If the signature is invalid, the node simply rejects and discards it.

## Why This Architecture Matters

This three-phase structure exists because each component solves a specific problem that can't be solved by the others.

**Initialization is necessary** because you need a cryptographic identity that persists across sessions but remains secure. You can't generate new keys every time you want to transact - that would make it impossible to receive funds or maintain state. But you also can't store keys in plaintext - that would make theft trivial.

**Transaction generation is necessary** because blockchain networks need structured, authorized requests for state changes. You can't just send raw commands - they need to be properly formatted, ordered (via nonce), and cryptographically signed. The signing process proves authorization without requiring the network to trust you.

**Broadcast verification is necessary** because decentralized networks have no central authority to validate transactions. Every node needs to independently verify that transactions are properly authorized before propagating them. The verification step prevents invalid or malicious transactions from spreading through the network.

## Looking Forward

Notice how each phase depends on the others. The initialization creates the keys that transaction generation uses. Transaction generation creates the signatures that broadcast verification checks. Break any component, and the entire system fails.

This interdependency also creates network effects. Because every Ethereum wallet uses the same basic mechanism, wallets are interoperable. You can use your seed phrase with MetaMask, hardware wallets, or any other client. DeFi protocols can rely on standardized signature formats. The entire ecosystem builds on shared cryptographic foundations.