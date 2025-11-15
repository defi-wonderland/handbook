# What is a wallet, really

Every interaction with Ethereum, from simple transfers to complex DeFi operations, flows through a wallet. Yet despite their importance, wallets remain one of the most underexplored areas in blockchain infrastructure. Poor wallet design creates barriers to adoption, security vulnerabilities, and user experiences that fall far short of what decentralized technology should enable.

This chapter explores wallet architecture because understanding wallets is fundamental to grasping how Ethereum works in practice. The design decisions made in wallet infrastructure determine whether decentralized technology empowers users or merely creates new forms of friction and risk.

## Understanding the wallet primitive

A wallet, at its core, is an interface for managing **cryptographic authority.** It doesn't store your ETH (that lives on the blockchain), and it's not really "holding" anything in the traditional sense. Instead, it manages the cryptographic keys that prove you have the right to move assets and execute transactions.

This distinction creates design challenges. Traditional software can rely on centralized recovery mechanisms, customer support, and "forgot password" flows. Wallet designers must build for a world where **the user is ultimately responsible for their own security**, while still creating experiences that don't overwhelm newcomers. The wallet interface might disappear or the company behind it might shut down, but as long as users have their private key, their assets remain accessible.

## Core wallet components

What fundamental elements must every wallet address? Understanding these components helps clarify the trade-offs involved in different wallet architectures.

### **Key generation and management**

Everything starts here. The process must begin with cryptographically secure randomness to create a private key. Most modern wallets use **hierarchical deterministic (HD)** structures, which allow a single secret (the "seed phrase") to generate a nearly infinite tree of keys and addresses. This is a massive improvement over early wallets where every single key had to be backed up individually.

The fundamental choice between generating and storing this key in a dedicated piece of hardware  versus in software on your computer or phone shapes the entire security model. It's worth remembering that instances of poor randomness generation in software have led to mass wallet drains in the past, making this seemingly simple first step absolutely critical to get right.

### **Address derivation and account management**

For Ethereum, the path from a private key to an address is specific. You take the private key, use elliptic curve cryptography (the `secp256k1` curve, specifically) to derive a public key, hash that public key with Keccak-256, and then take the last 20 bytes of that hash. The result is the familiar `0x`... address.

Modern wallets, of course, must handle more complexity. They manage derivation paths for multiple blockchains, and increasingly they must support not just these traditional externally owned accounts (EOAs) but also smart contract wallets, which we will explore later.

### **Transaction signing and authorization**

When users approve transactions, wallets must create signatures that prove ownership without revealing private keys. Equally important is the context around that signature. EIP-712 structured data signing allows wallets to present human-readable information rather than raw hex strings.

Smart contract wallets add programmable authorization logic, enabling multisignature requirements, spending limits, and recovery mechanisms beyond basic EOA capabilities.

### **Network Communication**

Very few users run their own full Ethereum node, it's resource intensive. Instead, wallets typically communicate with the blockchain through specialized services called RPC providers. This is a pragmatic trade off. This dependency affects both performance and privacy. The choice of RPC provider influences transaction speed, reliability, and how much of your metadata (like your IP address and the addresses you are querying) gets leaked. These are not just technical details, they are core user experience and privacy decisions.

## Anchoring Wallet Design

Every wallet design is fundamentally defined by the answers to three core questions. Who controls the keys? How does the account authorize actions? And how does a user connect to it? These choices around **custody, architecture, and integration** are not independent variables.

It's common to see custody presented as a binary choice, but I think it's more useful to see it as a **spectrum of responsibility**. At one end, you have **full self custody** via traditional EOAs, a model that is beautifully sovereign but also brutally unforgiving, as a single lost seed phrase means permanent loss. At the other end are fully managed models. The most interesting design space, however, lies in the middle. Here, smart contracts and cryptography allow for **delegated custody**. This isn't about giving up control, it's about programming new forms of it, like using a 2-of-3 multisig for social recovery or using multiparty computation (MPC) to create a key that is never whole in any single place. The natural question isn't "custodial or not?" but rather "what level of user responsibility and what type of fallback mechanisms are we designing for?"

This leads directly to **wallet architecture**. Historically, Ethereum has had a rigid split between simple, key based **Externally Owned Accounts (EOAs)** and powerful but complex **smart contract wallets**. The limitations of EOAs, requiring ETH for gas, having a single point of failure, and lacking native recovery, are well known barriers. The key insight of **account abstraction** is to dissolve this distinction. Standards like **EIP 4337**, which creates a parallel mempool for `UserOperations`, and **EIP-7702**, which lets EOAs temporarily gain smart contract powers, are steering us toward a future where every account can be "smart." This unlocks programmable authorization, allowing for gas sponsorship, batched transactions, and spending limits. This power comes with its own design trade offs around upgradeability due to this flexibility introduces vulnerabilities through admin keys or governance mechanisms.

Finally, these choices in custody and architecture are delivered to the user through an **integration pattern**. The dominant model has been the **user managed wallet**. Here, the user brings their own  key manager like MetaMask, a hardware wallet, or a mobile wallet connected via WalletConnect and manually approves interactions with the application. This model's strength is its clear separation of concerns. It preserves full user control and interoperability, allowing a user to interact with thousands of dApps from a single, trusted interface. But this model also introduces significant friction, especially for anyone not already steeped in crypto culture. The need to install an extension, safely store a seed phrase, and manage network switching can be a daunting barrier to entry.

This friction has led to the rise of the **embedded wallet**. Here, the application itself provisions and manages a wallet for the user, often invisibly behind the scenes, creating a seamless, Web2 like onboarding experience. The immediate challenge this creates, of course, is a security one. Where exactly *is* that key being managed? Simply storing it in a browser's local storage is convenient but fragile. More robust solutions must solve the problem of **key exposure**, often using techniques like multiparty computation (MPC) or leveraging device level secure enclaves via passkeys.

While architecture defines what a wallet is, integration defines how users experience it. The choice affects onboarding flows, security assumptions, and transaction signing patterns.

# What's next ?

This chapter has sketched the general landscape of wallet architecture, giving us a shared map of the core components and their natural trade offs. The natural question that arises, is how these fundamental primitives must be examined in needs of privacy.

This is where our work begins in earnest. In the sections that follow, we will go deeper into the cryptographic core, detailing our specific approach to crucial areas like **randomness generation**,  **derivation paths**, **mnemonic phrase generation**, and **secure storage**. It's in these foundational details, far below the user interface, where the real architecture of privacy is built.