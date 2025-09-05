# Solidity in a Nutshell

This page serves as a starting point for learning Solidity. It includes recommended resources and challenges to support your learning journey. While it’s not expected to complete everything during the onboarding period, you’re welcome to explore and work through it at your own pace.

Feel free to use this section as a reference throughout your onboarding or whenever you want to deepen your knowledge of Solidity.

## Why learn Solidity

As a researcher, it's important to have the ability to read and understand Solidity code, along with a grasp of the language's basic nuances. You don't need to dive deep into advanced technical details, but it's crucial to be aware of common security concerns and issues in writing smart contracts.

This foundational knowledge will help you analyze protocols more effectively and contribute to discussions on smart contract design and evaluation.

## Mental models for reading contracts

When reading or designing contracts, think in terms of a few core dimensions:

### State and storage
Map what is persisted and who mutates it. Separate persistent `storage` from temporary `memory`/`calldata`, identify hot write paths, and look for append-only patterns or explicit deletes to manage gas. If upgrades are planned, check that the storage layout is forward-compatible.

### Access and authority
Surface which functions are externally callable versus internal, and which roles (`owner`, `admin`, role-based access) gate sensitive actions. Verify approval scopes (ERC-20/721) and that approvals clear on transfer. Don’t rely solely on modifiers—make sure invariants hold regardless of `msg.sender` being a contract or EOA.

### Invariants and accounting
Write down the properties that must always hold (conservation of balances, supply bounds, monotonic indexes) and trace where they can break across multi-function flows. Ensure reads-after-writes remain consistent in the presence of reentrancy or callbacks, and assess whether rounding or precision loss compounds over time.

### Time and sequencing
Identify where state changes depend on `block.timestamp` or block order. Distinguish lazy accrual (on interaction) from eager updates (per block), and account for windows, cliffs, cooldowns, or decay. Remember miner timestamp latitude (~±15s) and reason about sequencing across transactions.

### External calls and trust boundaries
Trace every call that leaves the contract (tokens, receivers, oracles, callbacks) and make explicit what is assumed about the callee. Follow checks-effects-interactions, update internal state before external calls, and use receiver checks (`safeTransferFrom`) when sending to contracts.

### Upgrades and mutability
For upgradeable systems, confirm who controls upgrades (multisig, timelock), how storage collisions are prevented, and which parameters governance can change. Tie parameter mutability back to economic guarantees to understand how behavior can shift over time.

### Gas, scalability, and DoS
Evaluate worst-case costs: ensure loops are bounded by trusted sets (not user data), minimize and batch writes, and keep view functions indexer-friendly. Consider whether pathologically high gas costs enable griefing or denial-of-service under network congestion.

### Code reuse and composition

#### Abstract Contracts: The Blueprint Pattern

Abstract contracts define shared structure and behavior while deferring specifics to concrete implementations. In practice, protocols depend on abstract interfaces and base contracts as blueprints, implementing only the domain logic.

Libraries such as OpenZeppelin provide well-audited abstract bases (e.g., token standards, access control) so teams inherit proven behavior instead of rewriting it. Seeing abstract bases and interfaces is usually a sign the system is leaning on established components rather than bespoke code.

#### Inheritance and modules

Solidity supports multiple inheritance, and production contracts typically compose audited modules—`Ownable`, `AccessControl`, `Pausable`, `ReentrancyGuard`—instead of reimplementing common features.

When reading such contracts, verify which parent implementation actually executes (C3 linearization defines method resolution), how constructors or initializers are invoked, and whether functions are correctly marked `virtual`/`override` with compatible visibility. Watch for function selector collisions across parents and for unintended storage layout interactions when multiple ancestors define state.

### Access and visibility

#### Function Visibility

Function visibility:
- **`public`**: callable internally and externally
- **`external`**: callable only from other contracts/EOAs
- **`internal`**: callable by this contract and children
- **`private`**: callable only by this contract

Gas tip: prefer `external` for functions with large input arrays/strings when not used internally, since parameters are read from calldata.

Use `external` and `calldata` for large inputs you only read; prefer `internal`/`private` for helper routines, and avoid unnecessary state writes.

#### Storage: memory vs calldata vs storage

At a glance: `storage` is persistent and expensive; `memory` is temporary and writable; `calldata` is temporary and read-only (most gas-efficient for external parameters).

Practical storage tips: pack structs to improve slot utilization, prefer `calldata` for external read-only parameters, minimize `SSTORE` operations due to high cost, and delete unused storage to reclaim gas where applicable.

*Source: [Solidity Storage Guide](https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html#storage-memory-and-the-stack)*

### Proxy patterns: upgradeable contracts

#### Transparent Proxy Pattern

**Mechanism:** Proxy contract delegates all calls to the implementation contract using `delegatecall`, preserving proxy's storage context.

Transparent proxies delegate calls to an implementation using `delegatecall`, preserving the proxy's storage. Upgrades are gated (e.g., by an admin or timelock) to point the proxy at a new implementation.

#### UUPS (Universal Upgradeable Proxy Standard)

**Key Difference:** Upgrade logic in implementation contract instead of proxy, reducing proxy complexity.

With UUPS, the upgrade function lives in the implementation contract itself (not the proxy). This reduces proxy complexity but makes correct `_authorizeUpgrade` logic and secure ownership/roles critical.

#### Storage collision prevention

The thing is that storage layout changes between implementations can corrupt data.

**Solutions:**
1. **Append-only storage**: Never change existing variable order/types
2. **Storage gaps**: Reserve storage slots for future variables
3. **Unstructured storage**: Use assembly to store at specific slots

Storage collisions are avoided via append-only layouts, reserved storage gaps, or unstructured storage patterns.

**Research Applications:**
When analyzing upgradeable protocols:
1. **Storage layout**: Are storage changes compatible?
2. **Access control**: Who can upgrade? Multisig? Timelock?
3. **Implementation verification**: Is new implementation audited?
4. **Emergency procedures**: Can upgrades be paused/reverted?

*Source: [OpenZeppelin Proxy Patterns](https://docs.openzeppelin.com/contracts/4.x/api/proxy), [UUPS Standard](https://eips.ethereum.org/EIPS/eip-1822)*

### Patterns in practice

#### Synthetix StakingRewards: time-based incentives

This contract distributes a reward token over time to users who stake a different token. It is a canonical example of the Incentives pattern.

This design funds a `rewardRate` over a `rewardsDuration`, tracks user balances and global supply, and accrues rewards lazily via a cumulative `rewardPerTokenStored` that updates on user interactions such as stake, withdraw, or claim. Users retrieve accrued rewards with `getReward()` and can exit by withdrawing and claiming in one step.

As a mental model: rewards are time-based, accrual is lazy to save gas, users are checkpointed (`userRewardPerTokenPaid`) to avoid double-counting, and core state tracks total stake, per-user balances, the cumulative index, and pending rewards.

Rewards are computed as `rewardPerToken() = previous + (elapsed * rewardRate / totalStaked)` and per-user `earned(account) = balance * (currentRPT - userCheckpoint) + pending`, with an `updateReward` step that advances both global and per-user checkpoints before state-changing actions.

See [Synthetix Docs](https://docs.synthetix.io/) as a reference : )

#### UniswapV2 Pair: constant product AMM

Each `UniswapV2Pair` contract is the market for a specific token pair and also issues LP tokens that represent proportional ownership of the pool and fees.

The pair maintains the invariant `reserve0 * reserve1 = k` (with fee adjustments), defines prices by reserve ratios, mints LP tokens when users add both assets proportionally, burns LP tokens to withdraw reserves, accumulates a 0.3% swap fee into the pool (growing `k` over time), and records cumulative prices to enable TWAPs.

As a mental model: trades occur against pooled liquidity rather than order books, prices are deterministic via a bonding curve, LP tokens represent proportional ownership and fee claims, and arbitrage aligns pool prices with external markets.

#### Gnosis Safe Multisig: threshold signatures

Multi-owner wallets execute transactions only when a threshold number of owners sign the same payload. Key ideas: threshold security, nonces to prevent replay, multiple signature schemes (EIP-712/EthSign/contract), and ordered signature verification to prevent duplicates.

Key takeaways for the mental model: execution requires a signature threshold, nonces prevent replay, multiple signature schemes may be accepted, and ordered verification prevents duplicates.

*Sources: [UniswapV2 Core](https://github.com/Uniswap/v2-core), [Gnosis Safe Contracts](https://github.com/safe-global/safe-contracts), [Synthetix Docs](https://docs.synthetix.io/)*

### General resources

#### Starting from scratch - **This must be addressed during the onboarding.**

1. **Blockchain Basics (Cyfrin Updraft)**
    
    Begin with this course to build foundational knowledge about blockchain concepts. While the initial sections may feel introductory, the content from **Section 15 to Section 23** provides highly valuable insights that are essential for understanding smart contract development.
    
    [Learn Blockchain Basics - Cyfrin Updraft](https://updraft.cyfrin.io/courses/blockchain-basics)
    
2. **Solidity 101 (Cyfrin Updraft)**
    
    After completing Blockchain Basics, move on to this course to gain an overview of Solidity best practices, basic variable types, and the core concepts of smart contract development. This course will give you the tools to confidently analyze Solidity code and understand its structure.
    
- [Learn Solidity Smart Contract Development - Cyfrin Updraft](https://updraft.cyfrin.io/courses/solidity)

### Deep dive, foundry - Optional

If you feel confident after completing the recommended resources and want to continue building your Solidity expertise, consider diving into the following courses:

1. **Learn to Code Solidity Smart Contracts with Foundry (Cyfrin Updraft)**
    
    Explore how to use Foundry. This course will guide you through coding, testing, and deploying Solidity contracts using Foundry.
    
- [Learn To Code Solidity Smart Contracts with Foundry - Cyfrin Updraft](https://updraft.cyfrin.io/courses/foundry)
- [Advanced Smart Contract Development With Foundry](https://updraft.cyfrin.io/courses/advanced-foundry)

## Additional Resources

If you are more about reading, we recommend you:
- [Solidity by Example](https://solidity-by-example.org/)
- [Solidity Documentation](https://docs.soliditylang.org/en/v0.8.29/)
- [Ethereum for Web Developers by Santiago Palladino](https://link.springer.com/book/10.1007/978-1-4842-5278-9)
- [RareSkills learn Solidity](https://www.rareskills.io/learn-solidity)
- [Solidity Coding Style](/docs/development/solidity/coding-style.md) : The handbook includes a detailed section on Solidity, read it!
- [Alchemy University: Ethereum Course](https://www.alchemy.com/university/courses/ethereum) - This is an introduction that covers Ethereum fundamentals, cryptography, and includes interactive challenges.

:::tip Note
If you think we’re missing an important resource, feel free to let us know!
:::

## Optional Exercises

Feeling curious? Here are some cool exercises and challenges:

- https://www.damnvulnerabledefi.xyz/
- https://ethernaut.openzeppelin.com/
