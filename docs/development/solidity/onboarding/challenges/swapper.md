# Swapper

In this challenge, you’ll create a Swapper Contract that allows users to pool tokens, swap them collectively, and withdraw the results without needing to trust a central party. Divided into three tasks, this challenge will teach you how to build DeFi tools, interact with DEXs like Uniswap, and automate workflows using Keep3r. 

## Swapper MVP

Create a swapper contract that will collect deposits, swap them all at once and allow depositors to withdraw their tokens.

Why would this be useful? Let's say swapping DAI to WETH costs around 10, and making an ERC20 transfer costs 20. If I have friends and my "friends" want to exchange DAI for ETH as well, a way to save some money would be to transfer our DAI to one person that we all trust. He/she would make the swap and then transfer the respective ETH to each one of us.

This contract aims to allow this functionality while removing the trust assumption in a person. For example, many people would be able to provide DAI, and then one single good person (will improve this later) would call a `swap` function and make the swap for everyone. After this, each person would be able to withdraw their respective ETH.

**Definition of Done**

- Has a `fromToken` and a `toToken` property that can be both set in the constructor.
- Has a `provide(amount)` function that will take the amount of the `fromToken` from the function caller.
- Has a `swap` function that will exchange all provided tokens into the `toToken`
- Has a `withdraw` function that allows the user that provided the tokens to withdraw the `toTokens` that he should be allowed to withdraw.
- Make sure the user can withdraw its `fromToken` before in case they were not yet swapped
- Governor (deployer) will need to provide `toToken` liquidity

For the sake of simplicity: We can assume a 1 to 1 relationship between `fromToken` and `toToken`.

Also, there should be enough Unit tests and the swap function should be integration tested with a fork of mainnet

## Uniswap V2 Integration

- Change swap functionality to use uniswap-v2 pool (use WETH-DAI pair).
- Swap from ETH (msg.value) to DAI
- In addition to `provide(amount)`, the contract should be able to work in an identical way when receiving ETH via direct transfer

**Definition of Done**

- Logic described in elevator pitch
- Unit and integration tests

## Keep3r Network Integration
Create a keep3r job contract, that should comply to the keep3r network interface and:

- Has a `work()` function that can only be called every 10 minutes. This function work should call on `Swapper.swap()`. Effeactively, allowing the swap to only be executed every 10 minutes.
- Has a `workable() returns (bool)` function that returns true only if work can be executed. `work` should `require(workable)`

**Definition of Done**

- Logic described in elevator pitch
- Unit and integration tests
