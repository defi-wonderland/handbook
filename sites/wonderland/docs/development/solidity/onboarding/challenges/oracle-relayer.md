# Oracle Relayer

The goal is to create a Price Oracle Contract that aggregates price data from multiple sources like Uniswap, Curve, and Chainlink. Divided into three tasks, this challenge will teach you how to build a flexible and robust price oracle, interact with multiple DeFi protocols, and implement advanced pricing mechanisms like Time-weighted Average Price(TWAP).

## Oracle Relayer MVP

Create an oracle contract that:

- Has a shared interface to query on-chain price data.
- Has a view function `getAmountOut(_tokenIn, _amountIn, _tokenOut) returns (_amountOut)`.
- The governor can manage specific wrappers for pairs and tokens, as well as a default wrapper.
- Pairs have priority over tokens, and tokens over the default wrapper.
- Must have wrappers: UniswapV2, UniswapV3, Curve, and Chainlink.

Example workflow:

1. The Governor deploys the Price Oracle Contract.
2. The Governor deploys the UniswapV2 wrapper.
3. The Governor deploys the Curve wrapper.
4. The Governor deploys the UniswapV3 wrapper.
5. The Governor defines that the pair DAI/USDT should go through the Curve wrapper.
6. The Governor defines that the token DAI should go through the UniswapV2 wrapper.
7. The Governor defined that the default wrapper should be the UniswapV3 wrapper.
8. A user uses `getAmountOut(DAI, 100, UNI)`, so the request should be routed through the UniswapV2 wrapper.
9. A user uses `getAmountOut(DAI, 100, USDT)`, so the request should be routed through the Curve wrapper.
10. A user uses `getAmountOut(UNI, 100, USDT)`, so the request should be routed through the UniswapV3 wrapper.

**Definition of Done**

- Logic described in the elevator pitch is completed.
- Implementation has Unit and integration tests.

## Best Price

Implement an external function that loops through pairs, tokens, and default routes to find the highest price for a given pair.

**Definition of Done**

- Logic described in the elevator pitch is completed.
- Implementation has Unit and integration tests.

## Uniswap V3 TWAP

Implement a function to enable users to query TWAP data from the oracle, aiming for a better manipulation-resistant price calculation.

The external function could look something like:

```
function getTWAPAmountOut(_tokenIn, _amountIn, _tokenOut, _timeAgo) returns (_twapAmountOut)
```

**Definition of Done**

- Logic described in the elevator pitch is completed.
- Implementation has Unit and integration tests.