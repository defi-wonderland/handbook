# Kohaku: The Privacy Layer Ethereum Deserves

Wallets are the window between users and the Ethereum world. They are the most critical, and often most underappreciated, layer of the infrastructure stack. A user only benefits from Ethereum's decentralization, censorship resistance, and security to the extent that their wallet also has these properties. And right now, wallets are failing on privacy.

Without privacy, Ethereum cannot fulfill its promise as a global financial system. Every transaction you make, every protocol you interact with, every asset you hold is permanently recorded and publicly visible. While transparency has its benefits, this level of exposure creates real risks to personal security and financial autonomy that will prevent mainstream adoption.

The technology to fix this exists. ZK-SNARKs are mature. Privacy Pools offer regulatory-friendly solutions without backdoors. The infrastructure is stabilizing. **Now is the time to take privacy on Ethereum seriously.** But here's the problem: making a private transfer today requires downloading a specialized "privacy wallet", understanding complex protocols, and accepting terrible UX. Most users simply won't do it. And they shouldn't have to.

**Kohaku** is how we fix this. Not by building another niche privacy wallet, but by giving every wallet in the ecosystem the tools to offer privacy by default. This is the Ethereum Foundation's commitment to making privacy as natural as sending any other transaction.

## The Wallet is the Battleground

Ethereum's roadmap is ambitious: scale, secure users with smart contract wallets, and provide privacy by default. These aren't optional features. Without scaling, Ethereum is too expensive. Without wallet security, users lose their assets. Without privacy, mainstream adoption is impossible.

But here's what is often missed: **all of these transitions happen at the wallet layer**. The wallet is where users experience Ethereum. It's where privacy either works seamlessly or doesn't exist at all.

Right now, wallets can't offer privacy because it's extraordinarily complex to build. You need deep knowledge of zero-knowledge proofs, cryptographic primitives, and protocol specifications. Each privacy solution has different integration requirements. Protocols evolve rapidly, requiring constant maintenance. Most wallet teams simply don't have the resources.

The result? Users are forced to choose between the wallets they trust and the privacy they need. This is unacceptable.

## Kohaku: Privacy Infrastructure for the Entire Ecosystem

Kohaku is a **privacy toolkit** that makes it trivial for any wallet to integrate robust privacy features. It's an SDK, a set of primitives, a public good designed to enable privacy across the entire Ethereum ecosystem.

The vision is simple: **wallets should have a notion of a shielded balance**. When you send funds, there should be a "send from shielded balance" option, ideally turned on by default. When you receive funds, your wallet should automatically generate stealth addresses. When you interact with a dapp, your wallet should use a fresh address isolated from your other activity. All of this should feel maximally natural from a UX perspective.

This is what Kohaku enables.

### Core Features: Privacy by Default

The Kohaku SDK provides everything a wallet needs to offer seamless privacy:

| **Feature** | **Purpose** |
| --- | --- |
| **Private Send & Receive** | Integrated privacy pools for shielded balances |
| **Stealth Addresses** | Automatic generation of unlinkable receiving addresses |
| **Per-dApp Accounts** | Isolate activity between applications by default |
| **Built-in Light Client** | Run Helios to eliminate RPC surveillance |
| **Private State Reads** | Execute `eth_call` privately using TEE+ORAM (moving to PIR) |
| **Social Recovery** | Recover accounts via ZKEmail, ZKPassport, Anon Aadhaar |
| **Post-Quantum Safeguards** | Optional PQ accounts with optimized verifiers |
| **ZK Hardware Signers** | Hardware wallet support for privacy protocols |
| **Spending Policies** | Configurable limits and rules for different signers |
| **Universal Hardware Standard** | Eliminate vendor lock-in with reference implementation |

### Modular by Design

The SDK uses a **plugin system**. Wallet teams can adopt the features they want without rebuilding their entire stack. Want private sends but not social recovery? Fine. Want to start with per-dapp accounts and add more later? Perfect. This modularity is critical for ecosystem-wide adoption.

## The Kohaku Reference Wallet: Proof of Concept

To demonstrate what's possible, the Ethereum Foundation is building the **Kohaku Wallet**, a reference browser extension that showcases these privacy features.

This is not a consumer product. It's an **experimental reference implementation**.

Built on Ambire's proven infrastructure, the reference wallet will progressively enable more private interactions within DeFi protocols, demonstrating that privacy and composability are not mutually exclusive.

## Success Means Ecosystem Adoption

Kohaku's success is not measured by downloads of the Kohaku wallet. **Success means privacy becomes default in MetaMask, Rabby, Rainbow, and every other wallet users already trust.**

This is a public goods project. The SDK is open source. The goal is collaboration, not competition. We're working directly with:

- **Wallet teams** to integrate the SDK
- **Privacy protocol teams** (Railgun, Privacy Pools) to expand the toolkit
- **Infrastructure providers** (Helios, Oblivious Labs, ZKnox) to strengthen the foundation
- **Research teams** (PSE and others) to push the boundaries

The vision: when you open your wallet in 2026, any wallet, privacy should be as natural as sending ETH. Not because you downloaded a special app, but because the entire ecosystem adopted the tools to make it happen.

## The Cypherpunk Endgame

Privacy is not a feature. It's a fundamental requirement for a free and open financial system. Ethereum has the technology. We have the talent. We have the infrastructure. What we need now is coordination.

Kohaku is the coordination mechanism. It's the SDK that makes privacy accessible. It's the reference implementation that proves it works. It's the public good that enables every wallet to offer what every user deserves: **privacy by default**.

The tools are being built. The question is whether the Ethereum community will embrace them. Whether we'll choose to build a surveillance dystopia or a private, secure, and truly decentralized future.

The choice is ours. Let's choose wisely.

## References

- [What I would love to see in a wallet](https://vitalik.eth.limo/general/2024/12/03/wallets.html) - Vitalik Buterin
- [Why I support privacy](https://vitalik.eth.limo/general/2025/04/14/privacy.html) - Vitalik Buterin
- [A maximally simple L1 privacy roadmap](https://ethereum-magicians.org/t/a-maximally-simple-l1-privacy-roadmap/23459) - Ethereum Magicians
- [Kohaku Roadmap](https://notes.ethereum.org/@niard/KohakuRoadmap) - Ethereum Foundation Notes
- [Ethereum Privacy: The Road to Self-Sovereignty](https://ethereum-magicians.org/t/ethereum-privacy-the-road-to-self-sovereignty/25423) - pcaversaccio
