# Oracle Relayer

The aim here is to create a Price Oracle Contract that aggregates on-chain price data from multiple sources like Uniswap, Curve, and Chainlink. Divided into three tasks, this challenge will teach you how to build a flexible and robust price oracle, interact with multiple DeFi protocols, and implement advanced pricing mechanisms like TWAP.

## Oracle Relayer MVP

Create an oracle contract that:

- Has a shared interface to query on-chain price data
- Has view function `getAmountOut(_tokenIn, _amountIn, _tokenOut) returns (_amountOut)`
- Governor has the ability to add specific wrappers for pairs and tokens, as well as a default wrapper
- Pairs have priority over tokens, and tokens over default
- Example must have wrappers for: uniswapV2, sushiswap, uniswapV3, curve, 1inch and chainlink

Example workflow:

1. Governor deploys
2. Governor deploys UniswapV2 wrapper
3. Governor deploys Curve wrapper
4. Governor deploys 1inch wrapper
5. Governor defines that pair DAI:USDT should go through Curve wrapper
6. Governor defines that token DAI should go through UniswapV2 wrapper
7. Governor defined that default wrapper should be 1inch wrapper
8. A user uses `getAmountOut(DAI, 100, UNI)`, so the request should be routed through UniswapV2 wrapper
9. A user uses `getAmountOut(DAI, 100, USDT)`, so the request should be routed through Curve wrapper
10. A user uses `getAmountOut(UNI, 100, USDT)`, so the request should be routed through 1inch wrapper

**Definition of Done**

- Logic described in elevator pitch
- Unit and integration tests

## Best Price

Have an external function that loops through pair, token, and default routes to find the highest price.

**Definition of Done**

- Logic described in elevator pitch
- Unit and integration tests

## Uniswap V3 TWAP

Add the possibility to query the oracle for TWAP data to get a better manipulation-resistant price calculation.

The external function could look something like `getTWAPAmountOut(_tokenIn, _amountIn, _tokenOut, _timeAgo) returns (_twapAmountOut)`

**Definition of Done**

- Logic described in elevator pitch
- Unit and integration tests