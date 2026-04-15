# Cross-chain token standards and ERC-7786

## A standard everyone needs, but that no one adopts

ERC-7786 defines a standard interface for cross-chain messaging. The standard starts from the following idea: if it were possible for all bridges to expose the same API, developers could switch providers without rewriting their contracts and building bridge-agnostic applications would become practical.

Cross-chain token standards tried to do the same for token portability. Both xERC20 (driven by Connext and Wonderland) and ERC-7802 (proposed by Optimism and Uniswap) allow a token to work with any bridge without being tied to a single one.

**So, what is the difference?** These standards differ in how much control they give the issuer. xERC20 offers granular control with bridge whitelisting and minting rate limits per bridge. On the other hand, ERC-7802 limits itself to the minimum, two `crosschainMint` and `crosschainBurn` functions.

All these standards solve real problems. However, none achieved significant adoption.

## The timing was not right

Just like the lesson learned in our section [ERC-5792 and EIP-7702: a retrospective](./erc-5792-eip-7702.md) , the mistake of looking for a solution to a problem already solved repeats itself here. It is a game theory problem. Each bridge already has its own standard working and being the first to adopt a unified one means opening the door for your clients to migrate to the competition. What is interesting about this scenario is that staying put has no cost, if this mentality is adopted by the entire ecosystem, the result is a standard with very low adoption.

Every major messaging protocol has already deployed its own interface, put contracts on dozens of chains and onboarded clients. LayerZero supports over [150 chains](https://layerzeroscan.com/). Wormhole has processed over [70B in cumulative volume](https://messari.io/report/wormhole-scaling-interoperability-across-chains-and-institutions). Axelar, Hyperlane and Chainlink CCIP each carved out their own segment with specialized security models and tooling.

From a developer's perspective, these protocols expose fairly similar interfaces and capabilities. The differences come down to specific features, security models and gas optimizations. Most of their contracts are already in production and some are immutable. Migrating to a new standard would mean disrupting their entire operation for something that offers them no tangible benefit.

Technically superior standards routinely fail to displace incumbents that work well enough. An example of this can be seen outside of the blockchain space. IPv4 continues to dominate the internet despite IPv6 being available for decades.

## Different players, different incentives

This problem does not refer to coordination, it is a problem of incentive structure.

From a dApp's perspective, being tied to a single bridge is a risk, and ERC-7786 allows them to have optionality.

For a bridge, the calculus is different. A cross-chain messaging protocol might prefer to maintain the friction that retains its clients. If migrating to another bridge becomes easy, retaining clients becomes harder.

Given that ERC-7786 exists, the rational response for any individual bridge that intends to keep its clients is not to push for the adoption of this type of standards. Being one of the first to push for this change means risking client loss without gaining anything the bridge does not already have.

## Abstraction alone does not drive adoption

Even if timing and incentives aligned, ERC-7786 faces another problem. It wraps existing bridges but does not add any additional layer. Every major messaging protocol already provides its own verification layer.

Previously, aggregation projects like [Glacis](https://www.glacislabs.com/), [Hashi](https://crosschain-alliance.gitbook.io/hashi) and xERC20 had the same adoption problems. The problem is that a standard interface over already functional solutions does not generate incentives for adoption. On the other hand, it can end up introducing integration risk, as was the case with [Glacis](https://www.glacislabs.com/) and [Hashi](https://crosschain-alliance.gitbook.io/hashi).

Displacing already functional standards, even if fragmented, must offer real improvements in security and/or incentives that justify the migration.

## Token standards tell the same story

The same dynamics that blocked ERC-7786 appear in cross-chain token standards. Each protocol built its own framework ([OFT](https://docs.layerzero.network/v2/concepts/applications/oft-standard), [NTT](https://wormhole.com/products/native-token-transfers), [ITS](https://www.axelar.network/its), [CCT](https://docs.chain.link/ccip/concepts/cross-chain-token), Warp Token) and the open standards failed to displace them.

[Adoption numbers](https://messari.io/report/layerzero-scaling-stablecoin-issuers-with-the-oft-standard) can be misleading. As of May 2025 it would seem that OFT is the dominant standard with "\$150B supported". But if we look at that number more closely, \$138.6B come from a single partnership with Tether's USDT0 through a lock-and-mint wrapper and native OFTs represent only 4.6% (\$11.4B). The fragmentation persists.

## What would need to change?

ERC-7786 and the token standards failed for overlapping reasons. Nobody needs to change when existing solutions work well enough, nobody can change when the standard depends on others that are not ready and nobody wants to push for change when incentives punish the first bridge to do so.

Five lessons emerge from this:

- Incentive alignment matters more than technical elegance. These standards needed bridges to adopt them, but bridges had no strong reason to do so. Future standards must offer something to the actors whose adoption they depend on, not just those who benefit from the abstraction.
- Third-party bridges will not adopt these standards voluntarily. But if Ethereum moves toward native rollups, based rollups and synchronous composability, ERC-7786 or a similar standard could find a natural place in that infrastructure. A recent [ERC-7965](https://eips.ethereum.org/EIPS/eip-7965) (proof-based broadcasting) attempts to address the "abstraction without added value" problem by adding trustless verification through cryptographic proofs on top of ERC-7786, though this deepens the dependency chain further.
- Dependency chains multiply friction. If one standard requires another to function, each unfinished dependency gives adopters a reason to wait.
- Abstraction alone does not drive adoption. Adding a new layer must introduce real value beyond portability, whether that is security guarantees, economic incentives or protocol-level enforcement.
- Demand must exist before a standard can take hold. Today, very few apps depend on multiple bridges simultaneously. Tokens that go multichain tend to commit to a single bridge. The largest players vertically integrate — Circle with [CCTP](https://www.circle.com/es-la/cross-chain-transfer-protocol) and Tether with [USDT0](https://usdt0.to/) control both the token and the bridging infrastructure, account for a large share of bridge volume and have an altogether different business structure.

## Appendix

### Why proprietary bridges exist

Canonical bridges inherit all of Ethereum's security but they are slow, around 7 days for optimistic rollups and between 1-5 hours for ZK rollups. Proprietary messaging protocols exist because they trade trust assumptions for speed:

| Protocol | Typical latency |
| --- | --- |
| [Circle CCTP v2](https://www.circle.com/blog/cctp-v2-the-future-of-cross-chain) | seconds (Fast Transfer, pre-finality) or standard |
| [LayerZero](https://layerzero.network/blog/the-lzread-deep-dive) | source finality + Decentralized Verifier Network (DVN) verification + execution |
| [Wormhole](https://wormhole.com/docs/products/reference/consistency-levels/) | source finality + Guardian consensus |
| [Axelar](https://docs.axelar.dev/learn/txduration/) | source finality + validator confirmation |
| [Hyperlane](https://eco.com/support/en/articles/11813938-hyperlane-warp-routes-guide-complete-cross-chain-token-bridge-tutorial) | source finality + Interchain Security Module (ISM) verification + 1 block |
| [Chainlink CCIP](https://docs.chain.link/ccip/ccip-execution-latency) | source finality + Decentralized Oracle Network (DON) relay |

Latency for almost all of them depends on source chain finality. Circle CCTP v2 is the exception with its [Fast Transfer](https://www.circle.com/cross-chain-transfer-protocol) mechanism.

Not all protocols can afford a custom bridge like Circle with CCTP. That is why multiple protocols built their own token framework to address this problem: OFT (LayerZero), NTT (Wormhole), ITS (Axelar), Warp Token (Hyperlane) and CCT (Chainlink CCIP).

On the other hand, xERC20 and ERC-7802 are open standards where the issuer retains sovereignty.

Finally, although custom verification mechanisms offer benefits, default configurations remain the most widely used in practice. Each additional verification scheme introduces a potential point of failure.

## Sources

- [ERC-7786 Specification (GitHub)](https://github.com/ethereum/ERCs/blob/master/ERCS/erc-7786.md)
- [ERC-7786 Official EIP](https://eips.ethereum.org/EIPS/eip-7786)
- [ERC-7786 Documentation Site](https://www.erc7786.org/)
- [ERC-7930: Interoperable Addresses](https://eips.ethereum.org/EIPS/eip-7930)
- [CAIP-350: Binary Serialisation](https://chainagnostic.org/CAIPs/caip-350)
- [Ethereum Magicians Discussion](https://ethereum-magicians.org/t/erc-7786-cross-chain-messaging-gateway/21374)
- [OpenZeppelin Community Contracts — Cross-chain Docs](https://docs.openzeppelin.com/community-contracts/crosschain)
- [OpenZeppelin & Axelar OpenBridge Announcement](https://www.axelar.network/blog/erc-7786-openbridge)
- [LiFi — Comparing Token Frameworks](https://li.fi/knowledge-hub/comparing-token-frameworks/)
- [xERC20 (Connext)](https://www.connext.network/xerc20)
- [Arbitrum Interoperability Post](https://medium.com/offchainlabs/bringing-interoperability-to-arbitrum-and-ethereum-ba97ea99d9ff)
- [@kramnotmark on ERC-7786](https://x.com/kramnotmark/status/1907508307541295312)
- [LayerZero — The Default is Many Chains](https://layerzero.network/blog/the-default-is-many-chains)
- [Messari — LayerZero Stablecoin Report](https://messari.io/report/layerzero-scaling-stablecoin-issuers-with-the-oft-standard)
- [Messari — Wormhole Report](https://messari.io/report/wormhole-scaling-interoperability-across-chains-and-institutions)
- [Circle CCTP v2](https://www.circle.com/blog/cctp-v2-the-future-of-cross-chain)
- [Axelar Latency](https://docs.axelar.dev/learn/txduration/)
- [Wormhole Consistency Levels](https://wormhole.com/docs/products/reference/consistency-levels/)
- [LayerZero Scan](https://layerzeroscan.com/)
- [Chainlink CCIP Directory](https://docs.chain.link/ccip/directory/mainnet)