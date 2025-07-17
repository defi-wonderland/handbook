---
id: governor-walkthrough
title: Governor Walkthrough
sidebar_label: Governor Walkthrough
---

# The Optimism Governor Walkthrough

The Optimism Governor is based on the OpenZeppelin’s Governor, customized to support Optimism’s governance needs: signaling proposals, customizable voting rules, subdelegations, and so on.

In the long run anyone should be able to propose changes, but safeguards like delegate approvals, quorum thresholds, and timelocks are required to ensure quality and protect against manipulation.

Some useful resources: 

- [Governor GitHub Repo (voteagora)](https://github.com/voteagora/optimism-governor)  
- [vote.optimism.io](https://vote.optimism.io/): front-end interface for participation

## Architecture and Deployment

The [`OptimismGovernor`](https://github.com/voteagora/optimism-governor/blob/main/src/OptimismGovernor.sol) contract is upgradeable, following a proxy pattern:

- `Governor Proxy`: `0xcDF27F107725988f2261Ce2256bDfCdE8B382B10`
- `Alligator` (subdelegations): `0x7f08F3095530B67CdF8466B7a923607944136Df0`
- `ProposalTypesConfigurator`: `0xCE52b7cc490523B3e81C3076D5ae5Cca9a3e2D6F`
- `VotableSupplyOracle`: `0x1b7CA7437748375302bAA8954A2447fC3FBE44CC`

While proposals today are signaling-only for most types (i.e., they do not trigger automatic onchain execution), the system enforces the full governance lifecycle: `Pending → Active → Succeeded → Queued → Executed`. The key exceptions are Governance Fund (Missions) proposals and certain Security Council proposals, which do cause onchain token transfers, for example, transferring OP to fund a Mission or allocating ETH from the treasury.

## Core Roles

- **`admin`**: Owns the proxy and controls upgrades. Does not vote or propose.
- **`manager`**: Can create proposals, execute them, or update system parameters.
- **`voters`**: Any address with delegated OP, either directly or through Alligator.

## Inheritance

```solidity
contract OptimismGovernor is
    Initializable,
    GovernorUpgradeableV2,
    GovernorCountingSimpleUpgradeableV2,
    GovernorVotesUpgradeableV2,
    GovernorVotesQuorumFractionUpgradeableV2,
    GovernorSettingsUpgradeableV2
``` 

Each inherited contract contributes:
- `GovernorUpgradeableV2`: Core lifecycle logic, proposal state machine
- `GovernorCountingSimpleUpgradeableV2`: Vote tallying (for/against/abstain)
- `GovernorVotesUpgradeableV2`: Gets historical voting power at a given block
- `GovernorVotesQuorumFractionUpgradeableV2`: Legacy support for % quorum
- `GovernorSettingsUpgradeableV2`: Configurable parameters (e.g. voting period)

:::warning
The Optimism Governor overrides some of these base contracts, notably quorum and proposal thresholds, using a `ProposalTypesConfigurator` and `VotableSupplyOracle`
:::

## Proposal Flow

The Governor supports two proposal paths:

```solidity
propose(...):               // Standard proposal
proposeWithModule(...):     // Proposal with custom voting module
```

Only the `manager` or `timelock()` can call propose. Each proposal is assigned a `proposalType`, which maps to specific quorum/approval thresholds in the `ProposalTypesConfigurator`.

Voting is handled via:
- `castVote()`: standard token-based voting
- `castVoteFromAlligator()`: partial delegation via the Alligator contract
- `VoteCastWithParams`: supports modules that require additional input (e.g., ranked or approval voting)

Proposals are executed via the Timelock contract, using `execute()` or `executeWithModule()`.

## The key Modules

### Alligator - Subdelegations

The Alligator enables partial delegation, a user can split their voting power across multiple delegates using absolute or relative rules. These delegations can be chained (A → B → C) and validated onchain using authority[] arrays.

The key structures are:
- `subdelegations[from][to]`: maps delegations
- `SubdelegationRules`: define allowance, `maxRedelegations`, timing, and custom logic
- Supports batched voting with `castVoteWithReasonAndParamsBatched(...)`

The contract validates that:
1. Each delegation is valid and within limits
2. The final sender is authorized
3. No overuse or double-voting has occurred

It then forwards votes to `castVoteFromAlligator()` on the Governor.

## ProposalTypesConfigurator

Proposals can have different voting requirements depending on their type. This configurator allows each `proposalType` to define:
- quorum (e.g. 5100 = 51%)
- approvalThreshold (e.g. 7600 = 76%)
- name, description, module (if any)

Proposal thresholds are stored with 1e4 scaling (10000 = 100%). The Governor calls `proposalTypesConfigurator.proposalTypes(proposalTypeId)` during voting and quorum checks.

## Votable Supply Oracle

Instead of total token supply, quorum is based on votable supply — the total OP that has been delegated. This is retrieved at proposal creation block and used to calculate thresholds dynamically.

- **Fallback**: if `votableSupply()` returns zero, the Governor falls back to total token supply.

## Functions Summary

**Proposal Management**
- `propose()` / `proposeWithModule()`
- `setVotingDelay()`, `setVotingPeriod()`, `setProposalThreshold()`
- `setProposalDeadline()`: update deadline during voting
- `cancel()`, `cancelWithModule()`

**Voting**
- `castVote()`
- `castVoteFromAlligator(...)`
- `increaseWeightCast(...)`: internal weight accounting for partial votes

**Execution**
- `queue()`, `queueWithModule()`
- `execute()`, `executeWithModule()`

## Future Extensions

We are working on an upgrade that is evolving toward permissionless proposals, enforced via `DelegatesProposalValidator` contract, it gates access to `propose()` based on delegate approvals and submission windows, allowing any qualifying participant to propose, while still preserving cycle alignment.
