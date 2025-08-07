# Automated Market Makers

This section is an introduction to how AMMs work. It is important to read the resources and links, as the most valuable information is there.

AMMs are protocols that do away with traditional limit-order books by letting users trade against a shared pool of deposited assets, using various formula-based approaches to determine prices rather than matching discrete orders. By learning how these formulas work, we can understand the core mechanics of an AMM, including how liquidity is added or removed, how prices move when trades occur, and why LPs, liquidity providers, face potential gains and risks such as impermanent loss. 

A common starting point is the constant product model:

$x \cdot y = k$

Where $x$ and $y$ are on-chain balances of two distinct assets, and $k$ is a fixed constant (at least before factoring in fees). When a user swaps one asset for the other, the pool's new balances $x'$ and $y'$ still need to satisfy $x' \cdot y' \geq k$. The difference arises from the trading fee and the fact that $k$ can effectively increase over time as more liquidity or fees are added. From this product formula emerges the important concept of **price impact.**

:::tip
**Price slippage:** It's the gap between the price you expect for a trade and the price at which it ultimately goes through, often caused by swift market shifts between placing an order and its execution.

**Price Impact:** Trading a larger amount of one token will shift the balance significantly, thereby moving the quoted price of the second token more and more.
:::

**As an example,** assuming the current ETH/DAI price is $2000 and the initial liquidity pair has 62,500,000 DAI and 25,000 ETH. This will give you a constant product of 1.56 billion. The table shows the price slippage or premium that you will have to pay as your transaction sizes grow:

| **ETH Purcharsed** | **Cost per ETH in DAI** | **Total Cost in DAI** | **Premium** | **New DAI Reserve** | **New ETH Reserve** | **k** |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 2500 |  |  | 62,500,000 | 25,000 | 1,562,500,000 |
| 1 | 2500.10 | 2500 | 0.00% | 62,502,500.10 | 24,999 | 1,562,500,000 |
| 10 | 2501.00 | 25010 | 0.04% | 62,525,010.00 | 24,990 | 1,562,500,000 |
| 100 | 2510.04 | 251004 | 0.40% | 62,751,004.02 | 24,900 | 1,562,500,000 |
| 1000 | 2604.17 | 2604,167 | 4.17% | 65,104,166.67 | 24,000 | 1,562,500,000 |
| 10000 | 4166.67 | 41666,667 | 66.67% | 104,166,666.67 | 15,000 | 1,562,500,000 |
| 20000 | 12500.00 | 250000000 | 400% | 312,500,000 | 5,000 | 1,562,500,000 |
| 25000 | Infinity | Infinity | Infinity | Infinity | 0 | 1,562,500,000 |

*This example has been extracted from Lau, D., Wong, D., Chan, A., & Tan, Y. (2021). Decentralized Exchanges. In How To DeFi (pp. 27 - 54). Published by CoinGecko.*

---

At a high level, the instantaneous price of asset A relative to B in a two-asset pool can be approximated by $x/y$, but each swap changes $(x,y)$ and thus modifies the quoted price. 

Though the constant product design is by far the most popular, other AMMs are built on different invariants. A **constant sum** AMM governed by x + y = k treats the pool as maintaining a strictly linear relationship between asset balances. This allows near-zero price impact as long as the real-world price ratio remains close to 1:1. However, if the market shifts away from that ratio, traders can drain one side of the pool entirely, because the sum of reserves alone does not protect against price divergence. Still, other formulas permit multiple tokens or custom weightings, such as the constant mean design for three or more assets:

$(x_1 \cdot x_2 \cdot ... \cdot x_n)^{1/n} = k$

Where each xi could be weighted differently, making it possible to structure liquidity among multiple assets in varying ratios. 

While these rules govern how pools quote prices, liquidity providers have incentives to deposit assets because each swap generates **fees**, typically deducted from the asset a trader inputs. LPs receive LP tokens that track their share of the total pool. Over time, fees accrue in the pool's balances, potentially increasing the amount of underlying assets each LP token can claim. However, liquidity providers also face **impermanent loss**, which can reduce or negate fee gains if the prices of the pooled assets diverge. Some AMMs allow community voting on the fee level, in which case the largest LP token holders can influence protocol parameters.

### How to calculate the share of liquidity someone provides to the pool

In many AMM protocols, the first liquidity provider sets the initial ratio of the two tokens by depositing some amount of each. A common formula for minting the very first LP tokens is:

$LP_{minted} = \sqrt{x \cdot y}$

Where $x$ and $y$ are the respective token amounts provided. This approach ensures a fair initial distribution of LP tokens that reflects how much liquidity the first depositor contributed. When new liquidity is later added, the number of newly minted LP tokens usually depends on how much the provider's deposit changes the pool's total reserves.

### Fee Mechanics

Different AMMs handle fees slightly differently, but many apply a fraction of the input token (for example, Uniswap V2 is set to 0.30%) before enforcing the invariant $x' \cdot y' \geq k$. This means only $(1 - fee) \cdot \Delta x$ effectively contributes to changing the pool's balances on one side, causing $k$ to increase over time.

### Impermanent Loss

Yet, participating as an LP involves **impermanent loss** when the underlying value of the pooled asset diverges significantly. One way to see this effect is to compare the outcome of depositing assets in the pool versus simply holding them. If an asset's external market price rises sharply, an AMM's constant function rebalances the pool to hold fewer of that now more valuable asset and more of the relatively cheaper asset. The following simplified formula captures the relative drop in value, assuming a two-asset constant product AMM:

$IL = 1 - \sqrt{\frac{p_{final}}{p_{initial} + 1}}$

Where $p_{initial}$ and $p_{final}$ are the initial and final price ratios of the two assets. This *loss* is termed impermanent because it can be offset by fees or reverted if prices move back toward their original ratio. Nevertheless, the risk remains that if a trader withdraws when prices have diverged, they lock in that reduced value.

### Other features

On the technical side, modern AMM designs address more than just the basic math. Some protocols implement  **features like [flash swaps](https://docs.uniswap.org/contracts/v2/guides/smart-contract-integration/using-flash-swaps)**. If the user cannot repay (plus any fee), the transaction reverts. This mechanism can support advanced arbitrage or refinancing strategies that might otherwise require cumbersome multi-step processes. Other AMMs implement on-chain **price oracles** by recording [time-weighted average prices](https://blog.uniswap.org/uniswap-v3-oracles) of the pool, which external contracts can trust more readily than a spot price from a single block. [To prevent an attacker from forcing a warped price at the end of a block](https://medium.com/@chinmayf/so-you-want-to-use-twap-1f992f9d3819), these AMMs often track the reserves at each trade event and accumulate a price history that is harder to manipulate with a single transaction.

AMMs can also combine with traditional limit order books. When these systems coexist, a user's trade might simultaneously interact with the order book if favorable bids or asks exist, or with the AMM pool if that yields a better rate. This dual-path design can deepen overall liquidity and narrow effective spreads. Some AMMs go further by introducing "auction slots," where an LP can bid part of their holdings for discounted trading fees, essentially reserving preferential treatment and capturing arbitrage returns that might otherwise be siphoned off by opportunistic traders.

Behind these mechanisms, an AMM must ensure that its core contract cannot be exploited. Common security patterns include tracking the pool's last known balances to avoid unexpected external transfers and locking key functions against reentrancy, so no malicious contract can repeatedly call the swap function in a single transaction. AMMs also handle edge cases like non-standard ERC-20 tokens that fail to return a boolean value on transfer, or tokens with highly unusual supply mechanics, by carefully verifying token balances or capping storage variables to prevent overflow.

### New AMM Designs

Newer AMMs sometimes go beyond the classic invariant formulas, implementing things such as **proactive market making** (which adapts to real-time price data), **dynamic curves** that shift with market volatility, or **multi-asset** pools that rebalance automatically based on user demand. Meanwhile, platforms like Uniswap V3 have introduced **concentrated liquidity** to improve capital efficiency, letting LPs collect more fees in the price ranges where most trading occurs.

### Security concerns

Behind these mechanisms, an AMM must ensure that its **core contract cannot be exploited**. Common security patterns include:

- Tracking the pool's last known balances to avoid unexpected external transfers,
- locking key functions against **reentrancy** so no malicious contract can repeatedly call the swap function,
- Verifying token balances, especially for **non-standard ERC-20** tokens or those with unusual supply mechanics.

Best practices also include thorough auditing of the math around fee collection and price updates, plus testing for scenarios where external price feeds or manipulative trades might create temporary imbalances. 

# An example: Uniswap V2

This *product invariant* approach for ERC-20 tokens is popularised by **Uniswap V2**. In this design, a pair contract holds two tokens, say Token A and Token B, and ensures the product of their on-chain balances remains at least k after accounting for a 0.30% fee on every trade. Those fees accrue to liquidity providers over time, tracked by LP tokens. Uniswap V2 also introduced *flash swaps,* letting users withdraw any token from the pool without upfront payment and repay it (plus fees) within the same transaction, enabling complex arbitrage or refinancing strategies without needing external financing. Another feature is its built-in time-weighted average price (TWAP) oracle: by accumulating price data at each block, Uniswap V2 lets other contracts calculate historical average prices less vulnerable to brief, manipulative spikes. The core–periphery architecture (with a minimal "core" holding funds and a "router" for user-friendly interactions) keeps the most critical pool logic simple and secure.

:::tip
To learn more about TWAP and Oracle Manipulation in Uni V2, see https://mirror.xyz/0xD28D1D7A6FDebEF46330210E65a1EF11bAfea11a/qdl4V9x3B9LmiJLw8XMw4zLBLv_jQZAnu-sd4YJwIUg.
:::

# More advanced AMMs

## Uniswap V3

As you probably know, Uniswap V3 is a DEX protocol that introduced features like concentrated liquidity and multiple fee tiers. You should be familiar with it, so we recommend to:

- **Read the [Uniswap V3 Book](https://uniswapv3book.com/).** It covers key concepts such as liquidity ranges and price calculations.
- Review the [Uniswap V3 Core Contracts](https://github.com/Uniswap/v3-core) and make some notes about how they work.

## StableSwap

StableSwap is an AMM model designed for low-slippage trading of stablecoins and other assets with tightly correlated values. Unlike constant-product AMMs, it blends a **constant sum** function (for low price impact near equilibrium) with a **constant product** function (to ensure liquidity is not depleted). This allows efficient trading between stablecoins while maintaining deep liquidity.

To understand its mechanics:

- **Read the [Curve Docs on StableSwap](https://docs.curve.fi/stableswap-exchange/overview/).** It explains how the formula reduces slippage and enhances capital efficiency.
- **Review the [Curve Smart Contracts](https://github.com/curvefi/curve-contract).** Studying the code provides insight into how liquidity is managed and how fees are distributed.

StableSwap's design minimizes impermanent loss for LPs and makes it the dominant model for stablecoin exchanges in DeFi.

# ⚡️Flash Questions

These are some questions that help to see if you have properly understood the things you just read : ) One important thing is to read the resources before answer them! 

:::tip
Want to register your answers? Go to the **GitHub Repository** associated with your onboarding, and commit the answers in a `AMM.markdown` file. 

:::

**Q1:**  In the formula x * y = k, what happens to the value of k when a trading fee is introduced? How does that impact the pool's total reserves over time?

<details>
<summary>✅ Solution</summary>

When a trading fee is introduced (for example, 0.30%), only (1-0.003) * change_in_x of the incoming tokens effectively contribute to the pool's balance. Because the pool receives slighlty more on one side than it gives out on the other, the constant k slowly increases. Over time, this growth in k reflects an increase in total reserves, which goes to liquidity providers as earned fees.
</details>

**Q2:** If you swapped a small amount of an asset vs. swapping a very large amount, how would the new asset balances differ in terms of price impact? Why?

<details>
<summary>✅ Solution</summary>

A **small swap** barely changes the ratio of x to y, so there's minimal price slippage. Conversely, a large swap significantly alerts that ratio, causing the quoted price to move farther from the original rate. The constant product formula x * y = k forces the price to shift more dramatically when a bigger trade depletes one side of the pool.
</details>

**Q3:** Why might a liquidity provider lose out compared to just holding the underlying tokens? In which scenarios could the fees earned be enough to offset this loss?

<details>
<summary>✅ Solution</summary>

LPs can face **impermanent loss** if the ratio of the pooled assets diverges from their initial ratio. The pool automatically rebalances to hold more of the cheaper asset and less of the more expensive one, potentially leading to a lower overall value than if the LP had simply held both assets separately. However, if the pool sees sufficient **trading volume and fees**, or if the asset prices revert toward the original ratio, those extra fees can **offset or even exceed** the impermanent loss.
</details>

**Q4:** Reentrancy is a known attack vector. Why is it particularly important for an AMM contract to lock or otherwise prevent recursive swap calls?

<details>
<summary>✅ Solution</summary>

An attacker could exploit reentrancy by calling the swap function multiple times **within the same transaction**, before the contract has updated its internal accounting. For an AMM handling real funds, this can lead to **draining assets** or bypassing safety checks. Preventing reentrancy ensures each swap fully updates the pool's balances and state **before** any subsequent calls can occur.
</details>

**Q5:** Can you name a situation where a single-sided deposit or a concentrated liquidity approach might be beneficial compared to the standard practice of depositing two tokens in equal value?

<details>
<summary>✅ Solution</summary>

- **Single-Sided Deposit**: If a user only holds one token (and doesn't want to swap for the other), single-sided deposits let them add liquidity without having to acquire the second token. Some AMMs automatically rebalance the other side.
- **Concentrated Liquidity**: In Uniswap V3, LPs can focus their liquidity within a specific price band where most trading occurs. This provides **higher capital efficiency** and potentially **greater fee earnings** if trades frequently happen in that range.
</details>

# Resources

https://www.machow.ski/posts/an_introduction_to_automated_market_makers/ - **MUST read. Awesome article.**

https://www.rareskills.io/uniswap-v2-book - Really recommended.

Lau, D., Wong, D., Chan, A., & Tan, Y. (2021). Decentralized Exchanges. In *How To DeFi* (pp. 27 - 54). Published by CoinGecko.

https://www.rareskills.io/post/uniswap-v2-tutorial

https://chain.link/education-hub/what-is-an-automated-market-maker-amm

https://xrpl.org/docs/concepts/tokens/decentralized-exchange/automated-market-makers

# Extra Exercises

https://ethernaut.openzeppelin.com/level/22 - Exercise 22