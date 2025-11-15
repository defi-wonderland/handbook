# The RPC dilemma and a path to trustless wallets

When you open your wallet to check your ETH balance or swap tokens, you see a number on your screen. You trust that number but this raises an important question, where does that number actually come from? The immediate answer is "the blockchain" but the pathway from the decentralized global network to your device is more complex and centralized than many people realize. This pathway almost always runs through a Remote Procedure Call (RPC) endpoint.

The Ethereum ecosystem relies on RPC providers for its scale and usability. Running a full Ethereum node is resource intensive, requiring gigabytes of storage and constant maintenance, making it impractical for most. RPC providers abstract this complexity away, offering a simple URL that acts as an on ramp to the network. However, this convenience comes at a cost, one that is often invisible. In our rush for scale, we have adopted an architecture that introduces a significant, centralized point of trust. For a project like the Kohaku wallet, which is deeply aligned with the Ethereum ethos of minimizing trust assumptions, relying on a third party RPC is not a sustainable long term solution. The key insight here is that **the method by which a wallet communicates with the blockchain is as much a part of its security and trust model as the cryptography it uses.**

### The hidden costs of convenience

Outsourcing your view of the blockchain to a third party creates fundamental vulnerabilities in privacy, censorship resistance and data integrity.

**1. Privacy leaks**

When your wallet uses an RPC provider, it sends a stream of metadata to that provider's servers. This includes your IP address and every address you query. An RPC provider can link your real world identity to your onchain activity, building a comprehensive financial profile on you. If the Kohaku wallet supports privacy protocols, revealing all queries to a centralized provider significantly undermines those guarantees. The provider may not see the *content* of a private transaction, but seeing the *metadata* that you interacted with a privacy tool is powerful information in itself.

**2. Censorship**

Censorship resistance is a core value of Ethereum. An RPC provider, as a centralized entity, can be pressured to block transactions interacting with specific applications or addresses. When your wallet relies on such a provider, your access to the "permissionless" network suddenly becomes permissioned, with the provider acting as a gatekeeper.

**3. Data integrity**

When you ask an RPC provider for your account balance, you are trusting its answer completely. A malicious or compromised provider could lie about the state of a contract to trick you into signing a transaction, or they could front run your transaction after seeing it. This model directly contradicts the "don't trust, verify" ethos of decentralized systems.

### Towards a trustless wallet

So if the centralized RPC model is fundamentally flawed, what are the alternatives? The path forward involves moving from a model of trust to a model of verification.

The most trustless way to interact with Ethereum is to run your own full node, which downloads and independently verifies the entire chain. This is the gold standard, but as we have established, it remains impractical for most users.

A much more practical ideal for a wallet like Kohaku is to run a **light client**. A light client doesn't download the entire blockchain. Instead, it downloads only the block headers. When the light client needs to know a piece of information (like an account balance) it requests that data from a full node along with a **Merkle proof**. This proof allows the light client to locally and cryptographically verify that the information is correct and is part of the state represented by the trusted block header.

The security model is transformed
*   **RPC Model** "Dear Full Node, please tell me this balance." You **trust** the answer.
*   **Light Client Model** "Dear Full Node, please give me the data for this balance and a proof so I can verify it." You **verify** the answer.

<div style={{textAlign: 'center'}}>
  <img src="/img/diagrams/light_client.png" alt="Light client diagram" width="50%" />
</div>

The trust assumption is massively reduced. A leading implementation of this philosophy and the one most aligned with Kohaku's principles, is **Helios**.

### Helios as a practical solution

Helios is a trustless, efficient and portable multichain light client written in Rust. Its purpose is to convert an untrusted centralized RPC endpoint into a safe, verifiable local RPC for the user. It can sync in seconds, requires almost no storage and is lightweight enough to be compiled into WebAssembly and embedded directly inside wallets like Kohaku.

The genius of Helios lies in its simple, dual layer design. First, its **consensus layer** connects directly to Ethereum’s core consensus mechanism to get a cryptographically secure "fingerprint" of the blockchain’s true state, which serves as its anchor of truth. Then, its **execution layer** queries a normal, untrusted RPC provider for the data you need, like an account balance. The key step is that Helios never blindly trusts this data. Instead, it mathematically verifies the RPC’s response against the trusted fingerprint. If the data is honest, you see it. If the RPC tries to lie, Helios detects the mismatch and rejects the data. This powerful mechanism makes the RPC provider's honesty irrelevant, turning it into a simple messenger whose information is always verified locally on your device.

### Conclusion

Centralized RPC providers were a necessary bootstrapping tool for Ethereum, but relying on them indefinitely is to accept a ceiling on decentralization, privacy, and censorship resistance. The critical question therefore becomes not just "what is my balance," but **"how do I know this balance is correct?"** A wallet with an embedded light client like Helios answers this by becoming a true, verifying participant in the network, upholding the core ethos of user sovereignty and trust-minimization.