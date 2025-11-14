# Kohaku navigating ethereum's three transitions

To fulfill its vision of a globally accessible settlement layer, Ethereum must navigate three crucial and interconnected technical transitions, all at once.

- The **L2 scaling transition**, where everyone moves to rollups.
- The **wallet security transition**, where everyone moves to smart contract wallets.
- The **privacy transition**, where privacy preserving features become the default, not a niche.

Without the first, Ethereum fails because it's too expensive. Without the second, it fails because users will not feel safe storing their assets. And without the third, it fails because default radical transparency is an unacceptable privacy sacrifice for mainstream use. We cannot pick and choose, we need all of them.

The key insight is that these are UX problems, and the primary battlefield is the wallet. This is where **Kohaku** enters, an Ethereum Foundation supported project designed not to be a final wallet, but to provide tools for the *entire ecosystem* to navigate these transitions.

## A multiplied identity

The core mental model for Ethereum users has always been simple, one user equals one address. This model is shattering. An L2 centric world means you have an address on Arbitrum, on Optimism, and so on. Smart contract wallets complicate this further, and the privacy transition could rely on stealth addresses, where you generate a new, cryptographically unlinkable address for every single interaction.

But the problem runs deeper than just user facing complexity. The reason the privacy transition is lagging is that building these features is extremely difficult. For a wallet team to offer private sends or social recovery today, they need deep, specialized knowledge of cryptography and a zoo of different privacy protocols. This high barrier to entry is what prevents privacy from becoming a standard feature.

This creates a dual challenge on the one hand, a tangled web of coordination issues that pulls the user's identity apart, and on the other, immense technical complexity that stops developers from building the solutions. Without a new cohesive approach that solves this for *both* users and developers, the experience will become so complex that centralized, non private solutions will win.

## A public goods toolkit

Kohaku's core mission is not to be another wallet, but to provide the fundamental building blocks to help **all wallets** solve these problems. It does this through three main pillars.

1. An **SDK** exposing strong privacy and security primitives that any wallet can integrate.
2. A **power user oriented reference wallet** to showcase the SDK, test its features on mainnet and serve as an example for developers.
3. **Collaborations with existing wallets** to help them integrate the SDK, as success is measured by adoption in other wallets.

## The Kohaku Toolkit Features for the Future

The SDK aims to provide a suite of tools that wallets can adopt to offer a cohesive experience. Here are some of the key features being worked on.

| **Feature** | **Purpose** |
| --- | --- |
| **Private Transactions** | Send and receive funds privately. |
| **Built in Light Client** | Avoid RPC surveillance and data leaks. |
| **Per dApp Accounts** | Isolate your activity between applications. |
| **Standardized Social Recovery** | Recover a lost account without a seed phrase. |
| **Post Quantum Safeguards** | Protect assets from future quantum attacks. |
| **ZK Hardware Signers** | Authorize private actions on a hardware device. |
| **Account Spending Policies** | Set spending limits and rules to limit risk. |
| **Universal Hardware Standard** | Use any hardware wallet without vendor lock in. |

## Path to adoption

The Kohaku approach is highly pragmatic. Wallet development is a complex and competitive space, so forcing a monolithic solution is a non starter. This is why the SDK is designed as a modular **plugin system**. A wallet team can adopt just the privacy components, for example, without rearchitecting their entire application. This modularity is key to encouraging incremental adoption across the ecosystem and accelerating a process that would otherwise be much slower.

The Kohaku project is an investment in the public infrastructure of the user experience layer, providing the Lego bricks for the ecosystem to build this future. The tools are being built.

The larger and more difficult question remains for the entire community, will we embrace the coordination required to use them to build a private, secure, and scalable future for everyone?

## References

- [What I would love to see in a wallet](https://vitalik.eth.limo/general/2024/12/03/wallets.html) - Vitalik Buterin
- [Why I support privacy](https://vitalik.eth.limo/general/2025/04/14/privacy.html) - Vitalik Buterin
- [The three transitions](https://vitalik.eth.limo/general/2023/06/09/three_transitions.html) - Vitalik Buterin
- [A maximally simple L1 privacy roadmap](https://ethereum-magicians.org/t/a-maximally-simple-l1-privacy-roadmap/23459) - Ethereum Magicians
- [Kohaku Roadmap](https://notes.ethereum.org/@niard/KohakuRoadmap) - Ethereum Foundation Notes