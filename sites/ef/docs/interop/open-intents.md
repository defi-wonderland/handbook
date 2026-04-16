# Open Intents and cross-chain interoperability

## Open Intents

Cross-chain operations today depend on proprietary integrations. Building on a single bridge locks the integration into that bridge. Users only get the rates it offers, with no way to compare against other options.

The [Open Intents Framework (OIF)](https://docs.openintents.xyz/) is a collaborative effort to standardize how intents are coordinated. Built around [ERC-7683](https://eips.ethereum.org/EIPS/eip-7683) (the cross-chain intent standard), the framework includes [specifications](https://github.com/openintentsframework/oif-specs), [reference contracts](https://github.com/openintentsframework/oif-contracts), a [reference solver](https://github.com/openintentsframework/oif-solver) and [aggregator](https://github.com/openintentsframework/oif-aggregator) that any team can use or build on. Wonderland contributes to the framework alongside the EF, Hyperlane, OpenZeppelin, Across, LiFi and others.

> 📌 To learn more about this initiative, visit the [Open Intents landing page](https://openintents.xyz/).

## Cross-chain interoperability

We built `@wonderland/interop-cross-chain` as a first-class client of the [OIF](https://docs.interop.wonderland.xyz/cross-chain/oif-provider). It also supports other providers (Across, Relay, Bungee, LIFI) to give app and wallet developers easy access to fetch and compare quotes from multiple providers.

> 📌 To learn more, feel free to check our [documentation](https://docs.interop.wonderland.xyz/cross-chain). Additionally, you can see it in action in the [cross-chain demo](https://interop.wonderland.xyz/cross-chain).
