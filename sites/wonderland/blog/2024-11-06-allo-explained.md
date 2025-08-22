---
slug: allo-explained
title: Allo v2.1 explained, from strategies to extensions
description: Communities need resources, projects need grants, and countries need to distribute capital. Allo is a flexible and transparent library for managing on-chain capital allocation.
date: 2024-11-06
tags: [DeFi]
authors: [lumi]
image: /img/blog-posts-img/allo-explained/allo.png
---

## Why would you need to allocate capital?

> Just as different nutrients can change the expression of a flower, different approaches to capital allocation can change how on-chain communities express themselves. *—Owocki, On-chain Capital Allocation Handbook*

Communities need resources, projects need grants, and countries need to distribute capital. Allocation is everywhere, and we’re all familiar with the pitfalls it can have. Yet, distributing grants effectively is no small challenge, it requires thoughtful allocation to ensure resources are directed to where they’re most impactful. **Allo** was developed to address this need, providing a flexible and transparent library for managing on-chain capital allocation.
<!-- truncate -->
Allo enables organizations to implement different **allocation strategies**. Whether it’s direct grants, [quadratic funding](https://allo.expert/mechanisms/quadratic-funding), or [retroactive public goods funding](https://allo.expert/mechanisms/retro-funding), it allows communities to tailor allocation approaches to meet specific requirements. In traditional settings, inefficiencies, middlemen, and misaligned incentives often hinder how funds move from sponsors to grantees. Just as we have standards for tokens, **we need standards for capital allocation**. That’s where Allo comes in, providing a modular library of audited contracts to solve the traditional inefficiencies in capital distribution.

## Allo v2.1: The new release

We **partnered** with [Gitcoin](https://www.gitcoin.co/) to develop [**Allo v2.1**](https://github.com/allo-protocol/allo-v2.1), an evolution of its previous version. By keeping the core architecture of v2 intact, v2.1 introduces an upgrade that modularizes allocation workflows into **strategies** and **extensions**. 

This approach improves composability and the dev experience, enabling the creation of reusable utility libraries for features like voting, gating, or milestone-based funding.

We’ve mentioned strategies, but before diving in, let's define some key terms we will be using:

- **Strategy**: A contract that contains custom logic for capital allocation and distribution.
- **Pool**: Some set of funds/tokens to be distributed.

As a recap, **Allo** relies on two core contracts that form the backbone of its architecture:

- [`Allo.sol`](https://github.com/allo-protocol/allo-v2.1/blob/dev/contracts/core/Allo.md): The command center of  interactions. It manages the creation of pools, allows strategies to be set, and coordinates the allocation of funds to the right recipients. The Allo contract will transfer a pool to the strategy once it is initialized.
- [`Registry.sol`](https://github.com/allo-protocol/allo-v2.1/blob/dev/contracts/core/Registry.md): Here is where profiles live. They serve as essential entities for dApps, offering identity management, access control, and interaction capabilities. The system has mechanisms for creating profiles, updating metadata, and handling fund recovery.

Beyond the core contracts, we now have **Allocation Libraries** and **Extensions**. These components are designed to work in harmony, enabling rapid development that suits different needs.As a recap, **Allo** relies on three fundamental contracts that form the backbone of its architecture:

- [`Allo.sol`](https://github.com/allo-protocol/allo-v2.1/blob/dev/contracts/core/Allo.md): The central controller of all interactions. It manages the creation of pools, allows strategies to be set, and coordinates the allocation of funds to the right recipients. The Allo contract will transfer the pool to the strategy once it is initialized.
- [`Registry.sol`](https://github.com/allo-protocol/allo-v2.1/blob/dev/contracts/core/Registry.md): Here is where profiles live. They serve as essential entities for dApps, offering identity management, access control, and interaction capabilities. The system has mechanisms for creating profiles, updating metadata, and handling fund recovery.
- [`Anchor.sol`](https://github.com/allo-protocol/allo-v2.1/blob/dev/contracts/core/Anchor.md): It enables secure calls to target addresses linked to profiles. It is accessible only to profile owners, and ensures authorized interactions and controlled operations, using the `Registry.sol` for ownership.

In addition to the core contracts, we now have **Allocation Libraries** and **Extensions**. These components are designed to work in harmony, enabling devs to create custom workflows for different funding needs.

**Allocation Strategies** control how a pool is distributed, and Allo v2.1 provides a modular approach to creating them:

- `BaseStrategy.sol`: A contract that defines the core functions to ensure compatibility with Allo’s standard — We will look into more detail shortly.
- **Custom Strategies**: Devs can extend `BaseStrategy` and Extensions to customize allocation methods tailored to specific requirements.

**Extensions** act like plug-ins to customize strategies without altering core contracts, adding flexibility such as eligibility checks. 

![blocks.png](/img/blog-posts-img/allo-explained/blocks.png)


They are organized into categories that can be combined to form specific allocation flows:

- **Gating**: Controls access based on conditions like NFT ownership, token balance, or attestations.
- **Register**: Manages recipient registration, defining who can be funded and under what conditions.
- **Allocate**: Manages allocation time windows or limits allocations to approved allocators.
- **Milestones**: Enables milestone-based funding, where funds are released progressively based on recipients achieving predefined goals.

> 💡 Extensions also offer customization by **overriding** certain functions of it. For example, in [`RegisterRecipientsExtension`](https://github.com/allo-protocol/allo-v2.1/blob/dev/contracts/strategies/extensions/register/RecipientsExtension.sol), you can override `processRecipient` to add custom logic on how to whitelist or manage a recipient upon registration.

For example, a milestone-based extension can be combined with a strategy to create a funding flow where each milestone must be verified before additional funds are released. 

So far, we’ve provided an overview of the building blocks that form the Allo ecosystem. Now, let’s dive deeper into how we can work with these strategies and extensions.

## Building a Custom Allocation Strategy

You can use an existing strategy or create a custom one. In general, what should you take into account when creating new strategies? 

As mentioned, there are two entities: **extensions** and **strategies**. Keep the core allocation logic inside the **strategy contract**, while modular and reusable components, such as access control or voting mechanisms, should be managed within extensions. 

A common question when designing new strategies is: *Where do the funds go first?* In Allo v2.1, the [`Allo` contract](https://github.com/allo-protocol/allo-v2.1/blob/dev/contracts/core/Allo.md) is where pools are created and strategies managed. But, Allo contract doesn’t hold funds; when creating or funding a pool, the funds are transferred to the strategy, unless the strategy specifies otherwise. We can think of it as a set of **legos**:

![building.png](/img/blog-posts-img/allo-explained/building.png)

Before diving into implementation, let’s take a closer look at `BaseStrategy` . It provides a standardized framework for developing new allocation methods. By implementing this contract, we can ensure that the strategies are **compatible** with the broader Allo ecosystem. 

Standardization brings two main benefits: **consistency** and **security**. First, it allows for predictable interactions across different strategies, making integrations seamless. Second, it reduces the risk of errors by leveraging pre-built, thoroughly tested functions, which is relevant for handling on-chain funds safely. 

There are 4 key functions that we should care about:

- `initialize`: Sets up the initial state for the strategy, typically linking it with a pool and configuring any necessary metadata. This function is called by the Allo contract when a pool is created with the strategy. At this stage, we also initialize any extensions the strategy might be using.
- `_allocate`: Handles the allocation of funds to recipients based on the strategy’s internal logic. Each custom strategy defines its allocation methodology by overriding this function.
- `_distribute`: Manages the distribution of allocated funds to recipients. This function ensures that once the allocation logic is completed, funds are transferred securely.
- `_register`: Registers recipients based on the strategy’s requirements. This allows custom strategies to define who is eligible to receive funding or allocate resources.
    
It's **recommended** to ensure that recipients are registered through `Registry.sol` before executing the strategy.
    

When you extend `BaseStrategy`, these functions serve as predefined placeholders that **you have to customize** based on your strategy’s needs. 

### Our Goal: A Stakeholder-Weighted Voting Strategy

In this example, we’ll override these functions to implement a **Stakeholder-Weighted Voting Strategy**. The strategy distributes funds based on the **weighted votes** of **stakeholders**. Each stakeholder’s voting power is proportional to their ERC20 token holdings. 

When planning a new strategy, having a structured approach helps in effectively utilizing the library resources. So, let’s try to do that with our example:

- We need to have a clear goal, - in this case, to distribute funds based on the weighted votes of stakeholders.
- Since our idea involves managing an **allocation period**, we will use the `AllocationExtension` rather than implementing our timing logic from scratch. Plus, as we need to manage the voting logic outside allocation, we will create a new `VotingExtension` for that.
- Now, let’s walk through the voting interactions:
    - The grants round works over a specific active allocation period.
    - Stakeholders vote for one project during the active allocation period.
    - After said voting period ends, the strategy allocates and distributes funds based on the collected votes.

Some guidelines we will implement are:

- Everyone can register through the `_register`  function.
- Anyone can vote, but only once per recipient. This is solely to simplify the logic of our strategy contract.

> **For additional context or to see how other extensions work**, [check out here](https://github.com/allo-protocol/allo-v2.1/tree/dev/contracts/strategies/extensions), you will find more implementations such as Gating or Milestone-based funding extensions.

Here’s what we’ll do:

- **Set up a Custom Extension:** First, we’ll create an extension called `VotingExtension`. This will handle the voting logic (casting votes, calculating payouts and voting power), allowing stakeholders to cast weighted votes based on their ERC20 token balance.
- **Set up a Custom Strategy:** Once the extension is in place, we’ll create the Stakeholder-Weighted Voting Strategy (`SWV`) that integrates the `VotingExtension` and `AllocationExtension` to allocate funds based on the votes and certain timelines.

The general flow will be: 

- a registered voter chooses a project to vote for,
- votes during the allocation period,
- and the allocation logic distributes funds once voting is over.

![flow.png](/img/blog-posts-img/allo-explained/flow.png)

How will we calculate the allocation? We will use the following formula:

Let $W_i$ be the total weighted votes for project $i$;  $T$ be the total funds available in the pool and $W_{total}$ be the sum of all weighted votes across all projects. 

Then, the allocation $A_i$ for each project $i$ is calculated as: $A_i = \frac{W_i}{W_{total}}  \times T$ , where $W_{total} = \sum_{j=1}^{n}{W_j}$. 

> 💡 Note that $\sum_{j=1}^{n}$is the sum of all of the terms between  $j = 1$  and $n$. So in this case, we are adding all  votes $W_i$ for the whole range of voters, between $W_{j = 1}$ and $W_n$.

For example, if we had 3 voters ($V_i$) with these balances:

- $V_1$ = 1 ETH
- $V_2$ = 2 ETH
- $V_3$ = 2 ETH

Each voter can vote for one project ($P_i$), and our pool will have 1000 ETH to be allocated. Let’s asume the votes ended as follows:

- $P_1$ = $V_2$  & $V_3$
- $P_2$ = $V_1$
- $P_3$ = Nothing.

Then, the weighted votes for each project:

- $W_1$ = $V2$ + $V3$ = 4 ETH
- $W_2$ = $V1$ = 1 ETH
- $W_3$ = 0 ETH (since it received no votes)

So, the total weighted votes will be:

$W_{total}=W1+W2+W3=4+1+0=5$ ETH

As **$P_1$** received 2 votes from $V_2$  and $V_3$, then it has the 80% of the allocation **(800 ETH), $P_2$** receives **200 ETH** and **$P_3$** receives **0 ETH**.

### The Walk-through

To start, we’ll set up a new development environment using Foundry —use the [Solidity Foundry Boilerplate](https://github.com/defi-wonderland/solidity-foundry-boilerplate). To include the necessary Allo contracts, you can clone the repo inside your project:

```bash
git clone https://github.com/allo-protocol/allo-v2.1/tree/dev
```

Now we can start with our `VotingExtension` , which introduces voting power based on the token balance of each voter. We’ll need to import `IERC20` from `@openzeppelin` and `BaseStrategy` from the repo we just cloned.

As the contract is thought to be used as a lego, we will name it as `abstract` :

```solidity
abstract contract VotingExtension is BaseStrategy {
```

Then, we would like to be able to define a voting token, and keep track of the `totalWeightedVotes`. This is because they will be used to calculate the allocation amount for each recipient. Lastly, we need a mapping that keeps track of the votes each recipient receives.

```solidity
    address public immutable VOTING_TOKEN;

    uint256 public totalWeightedVotes;
    
    mapping(address recipient => uint256 votes) public recipientVotes;
```

To ensure the contract behaves as expected, we define two custom errors: `VotingExtension_InvalidRecipient` is thrown if the recipient address is invalid (e.g., zero address), and `VotingExtension_NoVotingPower` is used when a voter doesn’t have any tokens to vote with.

```solidity
error VotingExtension_InvalidRecipient();
error VotingExtension_NoVotingPower();
```

When creating any strategy or extension, we need to tell the base strategy: ‘Hey! I created this new thing!’, this and the voting token are defined in the constructor:

```solidity
constructor(address _allo, address _votingToken)
    BaseStrategy(_allo, 'VotingExtension'){
    VOTING_TOKEN = _votingToken;
}
```

The `castVote` function allows stakeholders to vote for recipients. It validates the recipient’s address, calculates the voter’s token balance (voting power), and updates the recipient's votes and the total weighted votes.

```solidity
function castVote(address _recipient) external{
        
        if (_recipient == address(0)) revert VotingExtension_InvalidRecipient();
        
        uint256 _votingPower = _calculateVotingPower(msg.sender);

        if (_votingPower == 0) revert VotingExtension_NoVotingPower();

        _recipientVotes[_recipient] += _votingPower;
        
        totalWeightedVotes += _votingPower;
}
```

The `_calculateVotingPower` function retrieves the token balance of a voter from the `VOTING_TOKEN` contract. This balance determines the voter’s influence in the allocation process.

```solidity
    function _calculateVotingPower(address _voter) internal returns (uint256 _votingPower) {
        return IERC20(VOTING_TOKEN).balanceOf(_voter);
    }
```

The `_calculatePayout` function uses the formula  $A_i = \frac{W_i}{W_{total}}  \times T$ to determine the allocation for each recipient. It iterates over the recipient list, computing their share based on the votes they received.

```solidity
function _calculatePayout(address[] memory _recipients) internal returns (uint256[] memory _payouts){
		for (uint256 _i = 0; _i < _recipients.length; _i++){
            _payouts[_i] = ( _recipientVotes[_recipients[_i]] / totalWeightedVotes ) * _poolAmount; 
 }
}
```

The `SWV` contract is the strategy that combines `VotingExtension` with `AllocationExtension` to manage voting, allocation periods, and fund distribution. We start by importing the necessary dependencies: `SafeERC20` from `@openzeppelin,` the `VotingExtension` we just created and the `AllocationExtension` from the repo we cloned.

Now, SWV will inherit from the extensions, but also from `BaseStrategy`. 

> 💡 By inheriting the `BaseStrategy` into the strategy you kinda enforce it to implement these functions like register, allocate, distribute.

```solidity
contract SWV is BaseStrategy, VotingExtension, AllocationExtension {
```

We declare two mappings to track whether recipients are registered and whether voters have already voted. These help enforce the rules of the strategy.

```solidity
using SafeERC20 for IERC20;

mapping(address => bool) public recipients;
mapping(address => bool) public hasVoted;
```

Then, we will define the errors that will arrise if there is an invalid recipient, a voter already voted, or we receive an extrange recipient array.

```solidity
error SWV_InvalidRecipient();
error SWV_AlreadyVoted();
error SWV_InvalidRecipientArray();
```

The constructor initializes the `VotingExtension`, passing the `Allo` contract address and the voting token.

```solidity
    constructor(
        address _allo,
        address _votingToken,
    )
        VotingExtension(_allo, _votingToken)
    { }
```

One important function we need to include is `_initializeStrategy`, it decodes the allocation period data and initializes the `AllocationExtension`. Note that all the extensions we use that has an `*_init` function, should be initialize like this:

```solidity
function _initializeStrategy(uint256 __poolId, bytes memory _data) internal virtual {
	 (uint64 _allocationStart, uint64 _allocationEnd) = abi.decode(
			_data,
      (uint64, uint64)
      );

      __AllocationExtension_init(new address[](0), _allocationStart, _allocationEnd, false);
    }
```

The `_register` function allows recipients to register themselves. It validates the recipient addresses and marks them as eligible to receive funds.

```solidity
function _register(address[] memory _recipients, bytes memory _data, address _sender)
    internal
    virtual
    override
    returns (address[] memory _recipientIds){
        
        uint256 _length = _recipients.length;
        for (uint256 _i; _i < _length; _i++) {
            address _recipient = _recipients[_i];
            if (_recipient == address(0)) {
                revert SWV_InvalidRecipient();
            }
            recipients[_recipient] = true;
        }
        }
```

Now, the `_allocate` function handles the voting process. It ensures that voters can only vote once and that recipients are valid. Votes are cast using the `castVote` function from the `VotingExtension`, the results of the voting will determine how much of the pool each recipient will take that’s why `castVote` is being called inside `_allocate` :

```solidity
    function _allocate(address[] memory _recipients, uint256[] memory _amounts, bytes memory _data, address _sender)
        internal
        virtual
        override onlyActiveAllocation{
            for(uint _i = 0; i < _recipients.length; _i++){
                if(hasVoted[msg.sender]) revert SWV_AlreadyVoted();
                if(recipients[_recipients[_i]]) revert SWV_InvalidRecipient(); 
                castVote(_recipients[_i]);
                emit Allocated(_recipients[_i], _sender, _amounts[_i], _data);
            }
        }
```

Lastly, we need to distribute our funds, for doing that the `_distribute` function calculates payouts using `_calculatePayout` and transfers funds to recipients.

```solidity
    function _distribute(address[] memory _recipientIds, bytes memory _data, address _sender) internal virtual override onlyAfterAllocation{

        uint256[] memory _payouts = _calculatePayout(_recipientIds);
        if(_payouts.length == _recipientIds.length) revert SWV_InvalidRecipientArray();
        for(uint256 _i; _i < _payouts.length; _i++){    
            uint256 payout = _payouts[_i];
            if(payout == 0) revert SWV_NoAllocation();
            if(!recipients[_recipientIds[_i]]) revert SWV_InvalidRecipient();
            IERC20(_poolToken).safeTransfer(_recipientIds[_i], payout);
            emit Distributed(_recipientIds[_i], payout, _data);
        }
    }
```

Though not explicitly used, this function validates allocators. It returns `true` in this implementation, allowing any allocator.

```solidity
    function _isValidAllocator(address _allocator) internal view virtual override returns (bool){
        return true;
    }
```

To deploy and set up the strategy, follow these steps:

1. Deploy `SWV`: This contract will inherit from `VotingExtension` and `AllocationExtension`, as they are abstract contracts we don't need to deploy them.
2. Create a Pool in `Allo.sol`: Use `createPoolWithCustomStrategy()` to link the strategy with a pool.

Configure the pool’s metadata, including the token address, initial funding, and manager details. When the pool is created, `Allo.sol` triggers the `initialize()` function in `SWV`, completing the setup.

For further details, explore the codebase [here](https://github.com/defi-wonderland/allo-use-example). 

Happy coding! ✨

> ⚠️ **Note:** The code provided in this article is for **illustrative purposes** and **should not** be used in production as-is.