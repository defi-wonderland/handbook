---
slug: rip-oracles
title: "RIP, Oracles"
description: "Status quo: Current hazards and how to solve them"
date: 2022-12-26
tags: [Price, Oracles]
authors: [parti]
image: /img/blog-posts-img/rip-oracles/cover.jpg
---

Oracles are a single point of failure and can make or break a DeFi protocol. They are reliable until a black swan event happens…

Unfortunately, crypto is a flock of black swans, so you better be prepared.

![](/img/blog-posts-img/rip-oracles/swan.jpg)

## Are we talking about this again?
<!-- truncate -->

There are a plethora of resources to understand the importance of oracles. We recommend this [interview](https://www.youtube.com/watch?v=TPXTmVdlyoc) if you are interested.

But what’s the status quo of oracles? We know that no solution is perfect, but we must understand what’s going on in order to make informed decisions. We must be aware of the risks and act accordingly.

![](/img/blog-posts-img/rip-oracles/meme.jpg)

> _“But we have Chainlink! A decentralized solution that works like a charm”_

## Chainlink

**TL;DR:** Chainlink is the most widely used solution in DeFi. It’s the most reliable and cheap, but incentives for nodes are centralized and non-scalable, making the whole system permissioned.

![](/img/blog-posts-img/rip-oracles/chainlink.png)

- **Incentives are centralized:** Right now, incentives for data feeders are not decentralized since they rely on Chainlink, a centralized entity. They are subsidized and paid via LINK emissions from a multi-sig (an additional potential point of failure).
- **Incentives will keep being centralized:** [An upgrade](https://blog.chain.link/sustainably-growing-chainlink/) is scheduled for decentralizing these payments using a stake/slash mechanism. The Chainlink Node Operator [recently paid 30M LINK](https://etherscan.io/address/0x98c63b7b319dfbdf3d811530f2ab9dfe4983af9d#tokentxns) to bootstrap these mechanisms.
  - Notice this is still centralized/subsidized, and it’s relying on the assumption that eventually, users will sponsor data feeders
  - This is not sustainable in the long run
  - What happens if Chainlink stops working? (regulations / prolonged bear market / mismanagement / etc.)
- **Corruption risk:** Nodes are in charge of billions of dollars in DeFi, which is [dangerous even with slashing mechanisms](https://ercwl.medium.com/whats-wrong-with-the-chainlink-2-0-whitepaper-for-simpletons-d50f27049464).
  - Even if unlikely, there is room for censorship/bribery and extortion.
  - Nodes monopolize MEV: even though we can’t say this is a corrupted procedure, it is an undesirable property of a decentralized system.
- **Scaling tension:** Reward system is not compatible with scaling
  - The more nodes on the system (more decentralized), the more rewards dilute for each of them.
  - The more data fed into the system, the more rewards dilute for each node.
- **Permissioned:** As a result of the scaling tension, incentivized Data feeds are whitelisted.
  - Anyone can create an oracle for their token, which will work as long as it gets paid. Maintaining its keepers in the long term is extremely expensive.

There are also issues with the API, [software](https://www.cryptotimes.io/venus-protocol-loses-11m-after-chainlinks-suspension-of-luna-value/), and [gas](https://twitter.com/nomorebear/status/1238153064751628291) dependence.

> _“Well, at least Maker secures its $8b billion with a custom-made oracle. We can copy that model, right? right?”_

## Maker’s solution

**TLDR:** Maker’s internal oracle, which defends more than $8b, is expensive to maintain and therefore, not efficient for scale.

![](/img/blog-posts-img/rip-oracles/maker.png)

Maker uses their oracle to report collaterals’ prices in the protocol. Although this oracle is not designed to be used by other protocols, we might consider using the same methodology on our protocol, right?

- **Unsustainable:** Having an entire network of keepers frequently updating costs requires gas subsidies and enough incentives to make this task worthwhile. This might not be an issue [for Maker](https://twitter.com/bantg/status/1431593857423118342) but it is for small and medium protocols.
- **Gas dependance**: Maker also had issues with [gas](https://insights.glassnode.com/what-really-happened-to-makerdao/) dependence.

> _“Uniswap is full of Giga brains; Uniswap v3 must be the solution!”_

## Uniswap v3

**TLDR:** Uniswap v3 introduced a novel way of querying price data. It is decentralized and sustainable (thanks to swappers and LP’s subsidies), but it is complicated to rely on due to liquidity’s unpredictability.

![](/img/blog-posts-img/rip-oracles/uniswap.png)

Uniswap has the most decentralized and sustainable solution for oracles, but it also has a long track of exploits and manipulations. This improved after v3, but it’s [still happening](https://twitter.com/raricapital/status/1455569653820973057), and it’s prone to a PoS multi-block attack.

- **Trust issues:** Oracle quality depends on pool’s liquidity, but that depends on external providers.
  - Most [LPs stay for as long as it’s profitable](https://twitter.com/FloatProtocol/status/1482184042850263042), making it hard for the users of the oracle to predict the oracle’s future status.
  - Even protocols that provide liquidity for their own token might decide to remove liquidity for a set of different reasons at any time.
- **Complexity:** Concentrated liquidity is a double-edged sword. It enormously increases capital efficiency for LPs, but it also makes manipulation easier.
  - Many protocols willing to have an oracle do not fully understand how Uniswap works. They either opt out or get rekt.
- **Multi-block attack:** With the recent move from PoW to PoS consensus on Ethereum, predictability on block proposers was also introduced. Chances are that some big players will propose multiple blocks in a row with [high frequency](https://alrevuelta.github.io/posts/ethereum-mev-multiblock). A potential attack on Uniswap TWAP could consist of price manipulation while leaving out of the blocks any external arbitrage, hence doing this for free (minus trading fees).

Medians were [suggested](https://github.com/euler-xyz/median-oracle) several times as an alternative to the standard TWAP to filter away multi-block attacks. But:

- Median filters away fast movements but cannot differentiate manipulations from legitimate price swings.
- Medians are always laggier than TWAPs (see Uniswap below), as they take longer to react.
- Medians are not smooth, a desirable property for many use cases (Dutch auction liquidations, for instance).

## The solution

**Price** is a permissionless and reliable solution that leverages UniV3 and keeper automation to provide safe price quotes on any existing token.

![](/img/blog-posts-img/rip-oracles/price.png)

Price is built on top of Uniswap v3, thus inheriting all its decentralization and sustainable features. In addition, it solves the issues we marked above:

- **Trust issues:** Price makes liquidity trustworthy and predictable for the oracle’s users.
- **Complexity:** Everything is managed by smart contracts. We created a hassle-free experience for our users.
- **Multi-block attacks:** Price uses automation to detect and correct price manipulations, including multi-block attacks. These corrections unlock safer, more precise TWAPs, even for short time frames.

![](/img/blog-posts-img/rip-oracles/meme-2.png)

### **And the best of it all? Price is just around the corner…**

The alpha release is scheduled for January 2023. You can find many more details in the [docs](https://docs.oracles.rip/)