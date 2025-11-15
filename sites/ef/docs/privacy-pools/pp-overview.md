# Privacy Pools overview

The history of onchain privacy has often felt like a choice between two extremes. On one side, you have the default state of Ethereum a perfectly transparent, auditable ledger where every action is forever linked to your public address. On the other side, you have systems that aim for perfect, untraceable anonymity a complete "black box". While the latter achieves a pure form of privacy, it has struggled with a perception problem, and more importantly, a composability problem within a financial ecosystem that must inevitably interface with the outside world.

This raises an important question. Is there a third path? Can we build systems that provide meaningful privacy for legitimate users, breaking the linkability of their transactions, while also offering mechanisms to prove their funds do not originate from illicit sources? Protocols like **Privacy Pools** represent this middle ground. They aim to provide privacy that is not an all or nothing monolith but is instead **compliance aware**.

### Core Capabilities

The key insight here is moving beyond a simple deposit and withdraw model. The dissociation of funds is achieved by allowing users to prove membership within specific groups ("my funds are from a compliant source") without sacrificing their anonymity within that group ("you don't know who I am").

Some of the protocol's core features include

- **Partial Withdrawals** Users are not required to withdraw their entire deposit at once. They can withdraw portions of their deposited value while leaving the remainder private, similar to spending part of a cash note and receiving change.
- **Multi-Asset Support** The architecture is asset agnostic, supporting both ETH and a wide range of ERC20 tokens within the same framework.
- **Compliance Integration** Through the Association Set Provider, the protocol offers a robust hook for compliance, allowing users to prove their funds meet certain criteria.
- **Non-Custodial Design** Users always maintain control of their funds. The protocol smart contracts hold assets, but access is exclusively controlled by the user's cryptographic secrets.
- **Ragequit Mechanism** The non-custodial guarantee is further enforced by a mechanism that allows original depositors to publicly recover their funds if they are unable or unwilling to use the private withdrawal feature.
- **Batch Withdrawals** The system is designed to handle multiple private withdrawals within a single on-chain transaction, providing a more flexible user experience.
- **Note Selection Algorithm** At the wallet level, a user is abstracted away from the complexity of managing their private funds. An algorithm automatically selects the optimal combination of deposits to use for a given withdrawal.

### How It Works The Cryptographic Gears

The system's privacy comes from a few key cryptographic ideas that work together.

First, the creation of a **private note**. When you deposit ETH or a token into the pool, your wallet does something offchain, it generates two large random numbers a **secret** and a **nullifier**. These are derived from your wallet's master secret (the `appSecret` we explored in the [signature derivation protocol](../wallet/signature-derivation.md#step-4-deriving-the-secret)). Your wallet then uses these secrets, along with the deposit value, to generate a cryptographic **commitment** that gets sent to the onchain contract. This bundle of offchain secrets and the onchain commitment conceptually forms a **"Note"** your private, provable claim on the deposited funds.

This creates a fundamental shift away from the standard Ethereum account model. On Ethereum, your `0x` address owns your funds. Here, ownership is detached from an address and is instead embodied by the secrets within the note, it’s a UTXO model. Possession of the note's secret and nullifier is what grants the ability to spend the funds. This means the note is a private bearer asset, if you securely transfer its secret data to someone else you have transferred ownership.

Second, the **ZK Proof**. The protocol uses ZK-SNARKs for a few different purposes to prove valid statements without revealing secret information.

- **Commitment Proofs** are used to verify the ownership of a specific commitment or "note". This is the basic proof that you possess the secret key to a deposited fund.
- **Merkle Proofs** are used to demonstrate that your note is a member of a larger set (like the main deposit tree or a special Association Set) without revealing your note's specific position within it.
- **Withdrawal Proofs** combine these ideas to verify both ownership of a note and its inclusion in the state, while also revealing the unique nullifier to prevent double-spending.

Third, the **Association Set**. Here is where the compliance becomes concrete. The **Association Set Provider (ASP)** is a crucial compliance layer that controls which deposits can be privately withdrawn under its specific ruleset. It maintains a list of approved deposit labels (commitments) and provides the data necessary for users to generate cryptographic proofs of their inclusion. This allows the ASP to enable or revoke deposit eligibility, bridging user privacy with regulatory requirements without ever deanonymizing the users themselves.

Fourth, the **Relayer**.  If you submit the withdrawal transaction yourself, your address paying the gas fee creates a public link. To prevent this, the proof and withdrawal instructions are passed to a third-party Relayer. The Relayer submits the transaction on your behalf, paying the gas from their own address. For this service, they are compensated with a small fee taken from your withdrawn amount.

Finally, because the protocol is designed to be fully non-custodial, you are always in control of your funds. This guarantee is enforced by an important escape hatch called **`ragequit`**. If your deposit is not included in an ASP's set for any reason, or you simply choose not to use the privacy features, the `ragequit` function allows your original depositing address to publicly withdraw its exact deposit. You sacrifice the privacy of that specific transaction, but you are never at risk of losing your assets.

### The System in Motion

It's helpful to visualize the whole flow as a sequence of actions between the key actors.

![PP overview](/img/diagrams/pp_overview.png)

### What’s Next? Going Deeper

This overview explains the conceptual model of Privacy Pools and the roles of the different actors. Now, to move from theory to practice, we must explore the engineering that makes this possible. Our guide from here is broken down into three focused parts.

- **The building block, what are private notes?**
This part introduces the *what*. It establishes the **note** as the core object of the entire system and the foundation upon which all privacy is built.
- **How do privacy pools work?**
Now that the reader understands Notes, we can explain the machinery that protects them. This document covers the *how*, detailing the ZK proofs, smart contracts, and relayers that works together.
