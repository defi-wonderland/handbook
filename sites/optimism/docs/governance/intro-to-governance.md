---
id: intro-to-governance
title: Governance in a nutshell
sidebar_label: Governance in a nutshell
---

# Governance in a nutshell

Before we get into Optimism-specific contracts, let’s zoom out.

On-chain governance is a mechanism for managing shared infrastructure using verifiable rules. In practice, governance contracts behave similarly to multisigs, but with vote weights distributed across token holders rather than multisig signers.

At its core, governance is about managing change. A **proposal** is just a transaction (or set of transactions): a list of target addresses, call data, and sometimes ETH values. Token holders vote to approve or reject the proposal. If the vote passes and quorum is met, the transaction can be executed onchain. If it fails, it’s simply discarded.

Voting power is usually determined by the number of tokens an address holds at a specific snapshot block. Most systems also allow **delegation**, meaning you can assign your voting power to another address to vote on your behalf.

Some proposals affect onchain systems directly (e.g. upgrading a contract). Others are **signalling-only** (e.g. changing a community guideline or legal structure). In those cases, proposals still follow the same governance flow, but their “execution” happens through offchain coordination or manual implementation.

## Common Terms

These are the core terms used across most governance systems, including Optimism:

- **Proposal**: A governance action defined by a set of addresses and calldata. Often restricted to users with a minimum token balance.
- **Vote**: A signal (usually onchain) cast by a token holder. Can be FOR, AGAINST, or ABSTAIN.
- **Voting Power**: The influence a voter has, usually based on token holdings at a snapshot block. Voting power can be delegated.
- **Voting Period**: A fixed duration during which votes can be submitted. If quorum isn’t reached, the proposal fails.
- **Quorum**: The minimum percentage of voting power that must participate for a proposal to be valid.
- **Timelock**: A delay between passing a proposal and executing it. Gives time for reactions before changes take effect.
- **Queued / Execution**: Proposals are queued in a timelock contract after passing, and only then executed.

## The Proposal Lifecycle

While implementations vary, the lifecycle of a proposal usually looks like this:

```nasm
Pending ⭢ Active ⭢ Defeated ⭢ Cancelled
			                 ⮑ Succeeded ⭢ Queued ⭢ Executed
				                   ⮑----------⮑-------⮑  Expired
```
- **Pending**: Proposal exists, but voting hasn’t started (waiting for delay).
- **Active**: Voting is open.
- **Succeeded**: Quorum was reached and a majority voted FOR.
- **Queued**: Added to timelock. Awaiting delay before execution.
- **Executed**: Transactions have been run.
- **Defeated / Canceled / Expired**: Proposal did not pass or was invalidated.

:::info Reference
When in doubt about how a transition works, [just read the contract.](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/governance) 
:::

## Compound’s Bravo + OpenZeppelin’s Governor

The most influential governance systems today trace back to [Compound’s Governor Bravo](https://docs.compound.finance/v2/governance/). It introduced:

- Support for explicit ABSTAIN votes
- Upgradeable architecture
- Reason strings on vote calls (`castVoteWithReason`)

OpenZeppelin later extended Bravo to create a fully composable [Governor](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/governance/Governor.sol) base contract, which defines the lifecycle (propose → vote → queue → execute), and lets developers plug in extensions for voting, quorum logic, timelocks, and more.

In particular, the [`GovernorCompatibilityBravo`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/governance/compatibility/GovernorCompatibilityBravo.sol) contract matches the Bravo API, enabling drop-in compatibility with Compound-style frontends.

## Function Primer

### Proposal Management

| Function | Description |
|----------|-------------|
| `propose()` | Create a new proposal (must meet threshold) |
| `queue()` | Queue a passed proposal for timelock |
| `execute()` | Execute proposal after delay |
| `cancel()` | Cancel a proposal if conditions change |

### Voting

| Function | Description |
|----------|-------------|
| `castVote()` | Submit a vote (FOR/AGAINST/ABSTAIN) |
| `castVoteWithReason()` | Submit a vote with an explanation |
| `getReceipt()` | View voting record for an address |

### Querying

| Function | Description |
|----------|-------------|
| `state()` | Get current proposal state (Pending, Active, etc.) |
| `getActions()` | See what the proposal will execute |
| `quorumVotes()` | Check quorum required for proposal to pass |

## Design Patterns in Governance

Most governance systems in Ethereum share the same building blocks:
- A voting mechanism that calculates token-weighted power at a specific block (snapshot).
- A registry of proposals with metadata like start/end blocks, vote tallies, and actions.
- A time lock controller that enforces a minimum delay before execution.
- A quorum and approval threshold to ensure decisions are legitimate.

On top of this, each protocol adds its mechanics: delegation systems, role-based permissions, modular thresholds, and custom voting logic.

Some proposals are executable, others are advisory. Some are submitted by anyone, others require approval. Governance is always opinionated; the trick is making those opinions legible and upgradeable.

## Limitations and Responsibilities

Governance systems can encode process, but not intention. They can enforce thresholds, track votes, and trigger transactions, but they can’t make communities healthy or decisions wise.

As you move deeper into OP governance, keep in mind:
- Power structures can be encoded, but legitimacy is earned.
- Permissionless doesn’t mean consequence-free.
- The goal is alignment.

Governance is still an evolving experiment. And in the next section, we’ll look at how its infrastructure reflects that approach.