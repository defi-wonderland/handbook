# Flashloan

Now, you’ll create a Flash Loan Contract that enables users to borrow funds instantly and repay them within a single transaction. Divided into three tasks, you’ll learn how to build flash loans, execute arbitrage strategies between DEXs, and aggregate loans from multiple providers (Aave, Uniswap, and your contract).

## Flashloan MVP
Create a flash-loan contract that:

- Lets users deposit and withdraw any type of funds (tokens and ETH)
- Has a `flashLoan(address[] _tokens, uint256[] _amounts)` that allows anyone to get the funds and repay them with a 0.001% extra
    - check: https://docs.uniswap.org/protocol/V2/concepts/core-concepts/flash-swaps
    - check: https://github.com/WETH10/WETH10/blob/main/contracts/WETH10.sol#L135
    - check: https://docs.aave.com/developers/guides/flash-loans

**Definition of Done**

- Logic described in elevator pitch
- Unit and integration tests
## Arbitrage Test
Create an e2e test that does an arbitrage between 2 unbalanced uniswap v2 and sushiswap pools using the flash loan

**Definition of Done**

- Logic described in elevator pitch
- Unit and integration tests
## Flashloan Aggregator
Create another contract that flash-loans from multiple flash-loan providers.

i.e. flash-loan 100M (70M from uniswapV2, 20M from aave, 10M from your flash-loan contract)

**Definition of Done**

- Logic described in elevator pitch
- Unit and integration tests