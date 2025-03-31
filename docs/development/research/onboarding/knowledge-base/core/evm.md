# Ethereum Core

:::tip
We strongly recommend you to dive into the core concepts listed [here](https://inevitableeth.com/en/home/concepts) before diving into how Ethereum works. 
:::

There are many ways to explain Ethereum—how it works, what it enables, and the key standards that define it. However, we believe the best place to start is with its ethos.

It is often described as a trustless world computer— a shared, decentralized platform where participants can execute code, exchange value, and collaborate without needing central intermediaries. As you probably know, unlike first-generation blockchains that focus on simple value transfers, Ethereum's main innovation is its **programmability**: through *smart contracts*, participants can encode arbitrary logic that runs deterministically across a global network of nodes.

The core motivation is to generalize Bitcoin's concept of a decentralized ledger into a [**Turing-complete platform**](https://en.wikipedia.org/wiki/Turing_completeness#:~:text=In%20colloquial%20usage%2C%20the%20terms,purpose%20computer%20or%20computer%20language.). By abstracting the ledger into a robust, distributed state machine, Ethereum extends the blockchain paradigm far beyond payment use cases.

At its core, Ethereum consists of three main components:

1. [**The Ethereum Virtual Machine (EVM)**](https://www.notion.so/Ethereum-Core-1ac9a4c092c78009ae48c59fef656503?pvs=21) – the decentralized execution environment.
2. **The Blockchain** – the shared ledger securing transactions and state changes.
3. **The Network** – the global peer-to-peer infrastructure that keeps Ethereum running.

This guide will explore these components in-depth, along with the standards and mechanisms that make Ethereum such a powerful platform.

:::tip
For reference on the historical side, we encourage you to read https://inevitableeth.com/home/background/history-finance.
:::

# The EVM

The *brain* of Ethereum. The EVM is a specialized, stack-based execution environment that runs the [smart contracts](https://ethereum.org/en/developers/docs/smart-contracts/) trustlessly on every node. It's deterministic: given the same input state and instructions, it always produces the same result.

It has a **Stack-based architecture** because each contract invocation operates in an isolated EVM instance, which uses a [256-bit word](https://en.wikipedia.org/wiki/256-bit_computing), [LIFO stack](https://www.geeksforgeeks.org/lifo-last-in-first-out-approach-in-programming/) as its primary data structure. All operations consume operands from the top of the stack and push results back onto it. 

Also, we will differentiate between memory and storage. The first one is volatile, and transient across execution. Measured in bytes, allocated in 32-byte chunks, it is freed after code execution. While the second one is persistent, a 32-byte key-value store unique to each contract address. Written changes remain across transactions. 

:::info
Both memory and storage cost gas, but storage writes are significantly more expensive because they're committed to chain state.
:::

The EVM supports around 150+ opcodes as described in the [Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf). Each opcode has a defined gas cost. Some rely on environment data, while others manipulate the stack or contract state.

:::tip
**Deeper Dive:** 

- [learnevm](https://www.notion.so/Ethereum-Core-1ac9a4c092c78009ae48c59fef656503?pvs=21) offers opcode-by-opcode explanations and hands-on examples.
- *Mastering Ethereum* (Chapter 8 & 9) shows how contracts translate into EVM bytecode, with practical dev insights.
:::

You might be asking: why should I care? And the answer is that a good mental model of the EVM's fundamentals is really important for you to design protocols that rely on EVM-friendly patterns.

## Gas and Execution Model

**Gas** is the EVM's integral mechanism for metering and limiting computations. It ensures that complex or infinite loops can't stall the network and that each operation has an associated economic cost.

**Gas Per Operation:** Each opcode has a base cost (e.g., 3 gas for `ADD`) plus possible additional costs (e.g., `SSTORE` can vary based on whether a storage slot goes from zero to non-zero). — See the Appendix G of [Yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf).

**Gas Limit and Fees:** A transaction specifies a gas limit (how much the sender is willing to spend—. Unused gas is refunded, but if execution runs out of gas, all state changes revert (an OOG —Out of Gas— exception). — You should check out the [EIP-1559](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md) that introduced a base fee that is burned + a priority fee that goes to block proposers.

**Block-Level Constraints:**  Each block has a **gas limit** (now effectively a "gas target" times an elasticity multiplier). Overly complex transactions might use the entire block's gas allotment, limiting throughput. The base fee is then adjusted from block to block to keep average consumption near a target.

:::tip
**Further Reading:** 

- Mastering Ethereum explains how gas influences contract design, especially with patterns like **optimizing for minimal SSTORE usage — See Chapter 13**
- The [Ethereum Gitbook](https://cypherpunks-core.github.io/ethereumbook/02intro.html) covers real-world examples of gas optimization in DeFi or NFT minting contracts.
:::

## Contracts

Contracts in Ethereum are not *"launched and run somewhere else"*—they are **deployed** to the EVM, then **invoked** by transactions or message calls. Let's break this down:

- **Contract Creation**
    - A special transaction with `to = null` is used to deploy code.
    - During creation, an **init code** segment runs to set up the contract's storage or code. The final code is then stored at the address.
        
        We recommend you to watch this video : ) 👇
        
        https://www.youtube.com/watch?v=_tcyI_lNvo0
        
- **Message Calls**
    - When an externally owned account (EOA) or another contract calls a contract, the EVM executes the runtime bytecode.
    - Contracts can call other contracts, forming complex interactions.
- **Deterministic & Atomic**
    - Any changes to contract storage only finalize if **no** exceptions (including OOG) occur. Otherwise the state reverts.
    - This atomic, all-or-nothing approach is fundamental for building robust, predictable decentralized protocols.

- **The [Yellow Paper, sec. 7 & 8](https://ethereum.github.io/yellowpaper/paper.pdf) —** Formal definitions of contract creation, message calls, and how code executes step by step.
- [Mastering Ethereum](https://wiki.anomalous.xyz/pdfs/mastering-ethereum.pdf), Chapter 6 and Chapter 7, show applied examples (ERC-20).

## Examples

To give a flavor of how this looks under the hood, here's a simplified snippet focusing on `SSTORE`:

```nasm
# Pseudocode for storing a value in contract storage:
PUSH 0x01      # The value to store
PUSH 0x00      # The key in storage (slot 0)
SSTORE
```

- **Gas Implications**: Storing a non-zero value in an empty slot costs significantly more (20,000 gas pre-London adjustments) than updating a slot from non-zero to another non-zero.
- **Memory vs. Storage**: If a contract just needs data during execution, storing it in **memory** is cheaper. But for cross-transaction persistence, you need **storage**.

For a deeper discussion of how these operations are priced, see the Appendix G in the *Yellow Paper* or [learnevm's Working with Memory and Storage.](https://learnevm.com/chapters/evm/memory)

This was a short introduction, we encorage you to read https://cypherpunks-core.github.io/ethereumbook/13evm.html and the references that have been attached.  

# The Blockchain

## State Transition System

At its heart, Ethereum is a **transaction-based state machine**. Each transaction modifies a global state (balances, storage, etc.), and blocks group these transactions in an orderly sequence.

**State Evolves Block by Block:** Each block includes a set of valid transactions, and the network collectively "*"executes*" these on top of the previous state to arrive at a new state. [Mastering Ethereum](https://wiki.anomalous.xyz/pdfs/mastering-ethereum.pdf) (Ch. 4 & 5) and the [Ethereum Gitbook](https://cypherpunks-core.github.io/ethereumbook/02intro.html) detail how balances, contract storage, and code get updated deterministically.

**Block Structure: a b**locks contain:

- A **header** (metadata like parent block hash, timestamp, base fee).
- A **list of transactions**.
- (Post-merge) A set of **withdrawals** for PoS validators.
- An (unused) "ommers" field, legacy from PoW.

If you want to dive deep into this, the [Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf), sections 4 & 11, rigorously define the block header fields (e.g., `stateRoot`, `transactionsRoot`, `receiptsRoot`) and how they point to tries that represent the world state, transactions, and transaction receipts.

Understanding this state transition mechanism is key to analyzing **transaction ordering** (MEV considerations), **chain reorg** scenarios, or how new features like proto-danksharding might integrate with existing block structures.

## Consensus & Forks

Historically, Ethereum started with **proof-of-work (PoW)**—similar to Bitcoin's approach—but later transitioned to **proof-of-stake (PoS)** via *The Merge*. This shift changed how blocks are proposed and finalized.

1. **Proof of Work to Proof of Stake**
    - Under [PoW](https://youtu.be/bBC-nXj3Ng4?t=870), miners expended computational resources solving cryptographic challenges, securing the chain in return for block rewards.
    - Under PoS, *validators* lock up ether as stake and are randomly selected to propose blocks. Honest participation is rewarded; malicious activity can cause slashing of stake.
2. **Forks & Upgrades**
    - Ethereum uses *hard forks* (e.g., [Homestead](https://github.com/ethereum/homestead-guide/blob/master/source/introduction/the-homestead-release.rst), [Byzantium](https://github.com/ethereum/wiki/wiki/Byzantium-Hard-Fork-changes), London) to upgrade protocol rules.
    - Some forks have been contentious (like the DAO fork). *The Merge* itself was a major overhaul, switching out the PoW engine for PoS while keeping the EVM and accounts layer intact.

:::tip
See https://inevitableeth.com/home/ethereum/network/consensus/PoW-vs-PoS for reference.
:::

# The Network

While the EVM and the blockchain provide Ethereum's computational and data-security layers, **the network** is what ties it all together globally. Nodes discover each other, exchange transactions, and synchronize new blocks—ensuring a single coherent state.

## The P2P Layer

We need to discover nodes, right? For doing that, Ethereum relies on the devp2p protocol suite, which covers everything from initial node discovery to encrypted data transport. This has been introduced in the EIP-8, as an overview:

1. Node Discovery: Uses a kademlia-like protocol (UDP based) to find peers. Once discovered, a node's identity and capabilities are exchanged, so others know which subprotocols you support.
2. Peer connections & devp2p RLPx: After discovery, nodes set up an encrypted TCP session using RLPx, with ephemeral key exchange.
    
    They will do a handshake, exchanging a Hello —or *Status*— message. EIP-8 ensures that version mismatches or extra list elements do not break the handshake — older nodes can interoperate with newer devp2p versions.
    
    The handshake and subsequent devp2p messages are encoded in RLP (Recursive Length Prefix). Extra fields or new versions can be gracefully ignored if the node doesn't recognize them.
    

:::info
**Ref. [EIP-8](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-8.md)** – Explains the relaxed decoding rules for devp2p "hello" packets, RLPx discovery, and ephemeral key negotiation. This approach was critical for pushing future upgrades like RLPx v5 without fracturing the network.
:::

1. Message Gossiping: once the handshake completes, nodes gossip new transactions, blocks, receipts, etc. as part of the eth subprotocol. So that the entire network quickly sees fresh data and coverages on a canonical chain. 

## Client Diversity

**As you probably know, clients a**re software implementations that speak the protocol's rules. Having multiple clients fosters resilience against bugs and centralization:

- **Prominent Clients**
    - **Geth** (Go-Ethereum) – Historically the most used.
    - **Prysm, Lighthouse, Teku** – Clients for the PoS consensus layer (Beacon chain).
    - **Nethermind**, **Besu**, and (formerly) **OpenEthereum** – Additional choices with various performance trade-offs.
- **Why Multiple Clients?**
    - A single reference client (like "Bitcoin Core") can become a single point of failure.
    - If one client's implementation has a consensus bug, others might reject it, preventing chain-wide meltdown.

:::info
Deeper info in https://cypherpunks-core.github.io/ethereumbook/03clients.html
:::

## Key Sync Mechanisms & Upgrades

### Syncing a Node

When you first run an Ethereum client, it **syncs** from the genesis block to the tip:

- **Full Sync** (in older versions) – Download every block and execute all transactions.
- **Fast Sync** or **Snap Sync** – Trust the state root after some checkpoint and fetch the state tries or "snapshots" on demand.
- **Light Clients** – Only download block headers and request proofs for specific state data, minimal disk usage.

### Network Upgrades

Ethereum's approach to protocol evolution includes **hard forks**:

- **Block number or TTD triggers**
    - e.g., "Byzantium" fork at block 4,370,000 (PoW era).
    - *The Merge* triggered by the Terminal Total Difficulty (TTD) instead of block number.
- **Backward-incompatible changes** require node upgrades. Non-upgraded nodes follow the old chain, forming a fork if there's disagreement (like the classic "DAO fork").

## Takeaways

So, as a takeaway, the network can be seen as the "circulatory system," it carries blocks, transactions, and state across thousands of nodes. Node diversity ensures resilience, while a robust devp2p protocol ensures timely data propagation. For a researcher, comprehending how nodes discover each other, gossip transactions, and keep the chain in sync helps you:

- Pinpoint potential **latency-based** attack vectors.
- Evaluate finality times or block distribution for advanced protocols.
- Explore how L2 or cross-chain solutions integrate at the node level.

With the EVM, the blockchain, and the network under your belt, the next step is to examine **the standards**—EIPs and ERCs—that unify development practices and enable new functionalities across the Ethereum ecosystem. 

# The EIPs

Ethereum Improvement Proposals are the way we propose protocol upgrades, application standards and ecosystem processes. They will describe both **technical specifications** or ecosystem and the **rational** behind them. **Every major change starts as an EIP.**

## What are EIPs, and why do they matter?

**An EIP** is a design document for introducing or discussing changes in Ethereum. Authors describe the motivation, the specification, and (often) a reference implementation. Whether it's a fundamental shift in the core protocol (like [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)) or a contract standard —they are ERCs now—, EIPs are the "source of truth."

- **They are community-driven:** Anyone can propose an EIP by opening a Pull Request on the [ethereum/EIPs GitHub repository](https://github.com/ethereum/EIPs). It is then discussed on forums such as Ethereum Magicians, ensuring open debate and iteration.
- **It tries to achieve a consensus at scale:** Critical "Core" EIPs (e.g., changing consensus rules) must achieve near-universal buy-in from client developers, node operators, and the broader community. This distributed acceptance is fundamental to the Ethereum ethos of permissionless evolution.
- **Historically anchored:** EIP-1 launched in 2015, based on Bitcoin's BIP process. This has since grown into a robust system for documenting changes, from large upgrades (The Merge) to small meta-proposals like EIP-5757, which clarifies how external resources can be referenced by EIPs.

## The EIP Lifecycle

An EIP typically moves through these stages:

1. **Idea**
    - Start with a concept in mind (maybe you want to propose a new cross-chain protocol).
    - You share an overview on forums like [Ethereum Magicians](https://ethereum-magicians.org/) to gather support and feedback.
2. **Draft**
    - Once you have minimal consensus that this is viable, you create or finalize a PR in the [EIPs GitHub repo](https://github.com/ethereum/EIPs).
    - An EIP editor merges it, assigns it an official EIP number, and your proposal is now tracked as a draft.
3. **Review**
    - The EIP is refined publicly, with the community (and EIP editors) giving feedback for at least 45 days.
    - If it gains traction and thorough discussion, an editor can move it to **Last Call**.
4. **Last Call**
    - The final chance for any major change. Typically lasts 14 days unless there's a substantial revision.
    - If no major objection arises, the EIP can be marked **Final**.
5. **Final**
    - Means "it's done on paper." For a **Core** EIP, being Final does **not** guarantee immediate activation on the network. Instead, it often waits for an upcoming upgrade (fork) that includes it.
    - Some EIPs remain "finalized" only on an application level (e.g., an ERC standard that dApps can optionally adopt).

Additionally:

- **Stagnant**: If there's no activity for 6+ months, the EIP becomes inactive.
- **Withdrawn**: The author retracts it.
- **Living**: A special permanent-draft status for "evergreen" EIPs like EIP-1.

:::tip
It is *super* useful to be updated with the EIPs, for doing that, we recommend you check out [EIPs.wtf](https://www.eips.wtf/), [EIP.Fun](http://EIP.Fun) and [EIPs Insight](https://eipsinsight.com/). Also, if interested in discussing, you should refer to [Ethereum Magicians Forum](https://ethereum-magicians.org/) —it is the primary place to discuss EIPs with other devs/researchers.
:::

## Who Oversees EIPs?

- **EIP Editors**: Volunteers that check the correctness, style, and structure of EIP submissions. They assign EIP numbers and can move EIPs through statuses if criteria are met. Current editors include well-known community members like Alex Beregszaszi, Greg Colvin, Micah Zoltu, etc.
- **Core Devs & the Community**: For protocol-level changes, the entire developer community weighs in. Ultimately, clients (e.g., Geth, Nethermind, Besu) must implement the EIP in a fork if it's a consensus-level change. If they do not, the chain can split.

## Some historical EIPs

### **EIP-1559** – London Upgrade (August 2021)

It overhauled the fee market by introducing a *base fee* that is burned, plus a *priority fee* to block proposers. Aims to reduce fee volatility, make gas pricing more predictable, and partially offset ETH issuance by burning fees. The key features were:

- Transaction "max fee" and "max priority fee" replaced the old single gasPrice model.
- Introduced block elasticity mechanism, so blocks can handle short congestion spikes.
- The base fee gradually adjusts, aiming for a gas usage target per block.

:::info
Read https://eips.ethereum.org/EIPS/eip-1559 and watch https://www.youtube.com/watch?v=MGemhK9t44Q
:::

### **EIP-779** – The DAO Fork (July 2016)

It documented the consensus rules that implemented the DAO fork after the major DAO hack, returning funds to the contract's rightful owners. This event led to two chains: Ethereum (forked) and Ethereum Classic (unforked). Keep in midn that it was:

- A hard fork to effectively reverse transactions from a compromised contract.
- It sparked debate around immutability vs. community intervention.

:::info
See https://eips.ethereum.org/EIPS/eip-779
:::

### **EIP-7** – `DELEGATECALL` Introduction (late 2015)

`DELEGATECALL` replaced the older `CALLCODE` opcode, addressing issues where `CALLCODE` didn't preserve `msg.sender` or `msg.value` as the *original* caller. This was a key enabler for proxy contract patterns, libraries, and composable "logic & data" separation. The important things are that:

- Code is called in the *context* of the current contract.
- `msg.sender` remains the original caller, enabling advanced patterns like "upgradeable proxies."

:::info
See https://ethereum.stackexchange.com/questions/3667/difference-between-call-callcode-and-delegatecall
:::

### **EIP-1014** – `CREATE2` Opcode (2019)

- **Why Important**Introduced a new way to compute a contract's address before it's deployed, using `create2`. This helps in "counterfactual" contract deployments, where you can *reserve* an address in advance, which is vital in meta-transactions or on-chain address commitments.
- Address formula is $$keccak256(0xFF, sender, salt, code)$$ all known at creation time.
- Allows advanced patterns in DeFi, state channels, "factory" contracts, etc.

:::info
Read https://eips.ethereum.org/EIPS/eip-1014 — We use this **all the time**.  
:::

### **EIP-3675** – Transition to Proof of Stake (The Merge)

Provided the final specs for removing proof of work from Ethereum, switching block validation entirely to proof of stake. Marked the biggest consensus-layer change to Ethereum since its inception. It eliminated ETH issuance from mining, replaced with validator rewards and slashing logic.

:::info
See https://eips.ethereum.org/EIPS/eip-3675
:::

# The ERCs

Ethereum Request for Comments are a subset of EIPs that define **standards for applications, pr**imarily around tokens and smart contract interfaces. They ensure that different dApps, wallets, and contracts can interact with each other without drama.  We encourage you to dive into the most popular ones in https://eips.ethereum.org/erc.


**Now… is time to check the resources! This is just an overview, Ethereum is way to broad to explain in one document. And most importantly: ask questions!**

# Resources

[Inevitable Ethereum](https://inevitableeth.com/)

[Learn EVM](https://learnevm.com/chapters/intro/overview)

[Mastering Ethereum - EVM Chapter](https://cypherpunks-core.github.io/ethereumbook/13evm.html)

[Ethereum Whitepaper](https://ethereum.org/content/whitepaper/whitepaper-pdf/Ethereum_Whitepaper_-_Buterin_2014.pdf)

[Mastering Ethereum](https://wiki.anomalous.xyz/pdfs/mastering-ethereum.pdf)

[Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)

[Ethereum 2.0 Book](https://eth2book.info/)

[Ethereum Magicians Forum](https://ethereum-magicians.org/)

[The End Game for Oracles](https://ethresear.ch/t/the-end-game-for-oracles/19276)