# Intent protocols and solver concentration

## tl;dr

Intent bridges depend on solvers for liveness and liquidity. Although many designs are *technically* open, in practice order flow is concentrated in core-team solvers, creating longer-term centralization and market-power risk. Incentives and standardization (e.g., solver rewards/credit, OIF/ERC-7683) aim to broaden solver participation.

## Introduction

Intents have established themselves as a user-friendly and dynamic solution for interoperability.

In an intent-based bridge, a user's assets are escrowed on the origin chain, and a solver makes the required transfer on the destination chain, before claiming the locked origin funds.

Intent-based bridges therefore rely on solvers for liveness and liquidity. If there aren't solvers willing to fulfil an order, the user's funds will sit in escrow until they can be returned.

It is therefore interesting to investigate the solver landscape for intent-based bridging.

## Technically different

A first consideration is what solvers have to do to participate in a given intent bridge. Some protocols are more or less open to third party solvers, and all of them are different. There are a few different dimensions to consider:

- Registration: does a solver need to register to participate? If so, how are solvers approved (or not)? Is there some cost or bond to do so?
- Order flow: are intents purely onchain, or do solvers need to subscribe to an offchain API for gasless orders? In either case is there an offchain quoting system to connect to?
- Competition: fastest fill wins, a period of exclusivity, a Dutch auction?
- Integration: how much custom work does the solver need to do to to fill and settle intents?

Different protocols take different approaches on each of these dimensions. For example Across uses temporal exclusivity on a per-order basis, where a nominated relayer (registered in the `exclusive-relayer` repo) gets a deadline to fill an order before it opens to other solvers. Relay sits at the opposite end, with its team running the sole trusted solver. 1inch Fusion+ gates participation behind a whitelist of resolvers, where solvers must stake 1INCH to qualify. The protocol routes orders through its offchain order book and resolves each fill via a Dutch auction over HTLC escrows. In deBridge the barrier to entry is the ability to detect and claim orders before other solvers, so solver selection comes down to speed.

## Similar in practice

While it is informative to compare the relative openness of different intent bridges, it is more meaningful to observe what happens in practice.

This is where intent protocols which are technically different appear more similar, because in almost all cases the majority of user orders are solved by a small number of solvers operated by the protocol team themselves.

This is unsurprising in the case of Relay, which started out with a single "trusted solver" model, and which doesn't currently have a clear path for third-party solvers. However, we observe the same pattern in 1inch Fusion+ and deBridge, both exhibiting concentration levels close to 100% of bridge volume. The latter has gradually increased its concentration over time. Bungee (Socket) and Mayan both show concentration levels above 80%, while Across sits at roughly 60%. Even when third party solvers are able to participate, they are generally not capturing meaningful volume.

## Why the gap?

A few factors contribute to this "owner dominance". First comes protocol expertise - every protocol has its own nuances, and it is natural that the team should be best-placed to optimise for their specific protocol, while third-party solvers may not see a benefit in optimising in each venue.

The question is why they wouldn't see the benefit, and that raises a more fundamental issue, which is that bridging is a very price sensitive market. Most often users will be transferring the same asset between chains, and will generally hope for as close to 1:1 as possible. 

Meanwhile solvers have quite high costs, as they need to have liquidity across chains to meet demand, which is made worse by potentially long lock-ups while rebalancing via canonical bridges.

Given that the market is also relatively small, this ends up not being that attractive an opportunity for solvers, who might put the same capital to work elsewhere.

As a contrast, Cowswap's same-chain intent-based swap marketplace had more opportunity for margin (swaps), required less capital fragmentation (single chain only), and Cowswap also built in solver rewards, subsidising solvers' participation. Today's bear market doesn't have the same capacity for protocol subsidy for cross-chain intents, and Across are even looking to move away from their ACX token altogether.

Unlike third-party solvers, bridge protocol teams have a significant incentive to provide liquidity for their bridge even beyond their inherent expertise, as they might benefit from frontend fees and swap revenue, as well as potential offchain integration deals. They can accept same-asset bridge solving as a loss-leader to support their overall business. They are playing a different game, while some large third-party solvers are exiting the market altogether.

## Is it a problem?

In the short term, this concentration presents some risks (around liveness, for example, if a protocol solver goes down), but competition is largely keeping user-facing prices in check. While there isn't intra-protocol competition, inter-protocol bridge competition is fierce, and users are generally benefiting, particularly as intent-based bridges compete with message-passing bridges as well.

On a longer timeframe, there is some risk that prices increase, if a given bridge's market power grows. And this comes with an overall fragility, as with any dependency on a single entity or small group. While some might see "solver marketplaces" as a technical sleight of hand to escape regulatory scrutiny, it is also generally the case that bridge teams themselves don't want to be in this privileged position.

## How might this change?

It is important to re-emphasize how competitive the interop space is today, as bridges battle for market share in a down-market. There is less appetite than ever for altruism and alignment for alignment's sake.

That being said, a clear priority is to reduce the capital costs for solvers. There are several ways to do this. The 7-day withdrawal window on canonical rollup bridges introduces a significant cost to solver rebalancing, and shortening this to a day (or even hours!) would immediately improve solvers' cost structures. Enhancing capital efficiency is also a reason to accelerate fast finality of L1. Those research priorities would have a meaningful user impact.

At the application layer, solvers would also benefit from access to alternative liquidity sources - this has been proposed as "filler vaults", and both Eco and Sprinter have recently developed offerings in this area. This approach would reduce capital requirements, while allowing solvers to focus more on solving than on settlement.

Finally, standardisation efforts like the Open Intents Framework and ERC-7683 seek to reduce the burden of integration for solvers, potentially also allowing for more pooling of liquidity. While these efforts may in some ways seem counter to an individual protocol's priorities, if they can unlock deeper and more diverse solver liquidity, that would be beneficial to bridges, their users, and Ethereum.

## Sources
- [Wonderland — Interop Research dashboard (Dune)](https://dune.com/defi_wonderland/interop-research)
- [Open Intents Framework](https://docs.openintents.xyz/)
- [ERC-7683: Cross Chain Intents Standard](https://eips.ethereum.org/EIPS/eip-7683)
