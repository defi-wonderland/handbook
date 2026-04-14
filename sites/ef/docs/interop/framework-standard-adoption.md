# A framework for standard adoption

## The Framework

Wallets with working solutions ignoring new communication standards, bridges with no reason to adopt a shared interface, token frameworks fragmenting instead of converging, and account abstraction proposals struggling to justify the migration cost. It seems that the same forces keep appearing in each case, pulling in directions that make adoption harder than the technical merits would suggest. 

What follows is a framework for understanding those forces. 
It covers five dimensions that determine whether a standard gets adopted, how they interact, what happens when formal standardisation isn't working, and what the alternatives look like.

## The thesis

Whether an ERC succeeds depends on a few dimensions interacting with each other. Assessing them together gives you a better read on whether pushing a standard into a given market will help, or just be ignored.

## The dimensions

### 1. Market maturity at introduction

Does the standard arrive before or after the market has formed?

ERC-20 is the canonical greenfield case. The standard existed when the first tokens launched. No installed base to convert, no migration cost, no incumbents with something to lose. Everyone used it because it was *the* way to do the thing. The standard and the market grew up together.

Compare that to trying to standardise something in a market that already has players with share. Incumbents have built tooling, integrations, and mental models around whatever they already do. Switching costs are real, and the benefits of standardisation need to clearly outweigh them.

There's probably a sweet spot: a market mature enough to know what it needs but young enough that no single approach is entrenched. Identifying that window in advance could be complicated, but it feels like it should be possible.

### 2. Competitive differentiation vs. commodity infrastructure

Is the thing being standardised a source of competitive advantage for existing players?

EIP-712 (typed structured data signing) is a good commodity example. Having a proprietary signing mechanism didn't help any wallet; it just made things worse for users. Better UX and readable signing prompts were obvious wins, and they didn't threaten anyone's moat. It still took time, but adoption happened because nobody had a strong reason to resist.

Cross-chain bridging is the opposite, and it's worth being precise about *why*. It's not just that bridges prefer their own approach; it's that adopting a portability standard like ERC-7786 reduces switching costs for every app using your protocol. You're making it easier for your customers to leave. If your competitors haven't done the same, you've given something up for nothing. Even if all bridges would collectively benefit from a common standard (less fragmentation, bigger market), there's little incentive for any individual bridge to move first.

This is sharper than just "competitive dynamics." Bridges aren't being irrational or short-sighted — the incentives just don't point toward adoption. A standard like this would need to offer something beyond portability (new capabilities, security guarantees, cost savings) to change the calculus.

The same dynamic plays out one layer up with cross-chain token frameworks. Every bridge has built its own (OFT for LayerZero, NTT for Wormhole, ITS for Axelar, CCT for Chainlink). They all do roughly the same thing, variations of burn/mint or lock/mint, but each bridge wants theirs to be the one token issuers adopt. Open standards like xERC20 and ERC-7802 have tried to provide a neutral alternative, with limited adoption for the same reasons.

And then there are the players who skip the whole game. USDC built CCTP, USDT built USDT0. When you're that large, you don't need a standard or a third-party framework; you just build your own infrastructure.

This creates a segmented market. The biggest players vertically integrate. The middle market is actually well-served by the existing frameworks — bridges are competing to serve token issuers, intent protocols are competing to serve apps, and the competition itself produces decent options for anyone big enough to matter to them. It's the long tail that's left without good choices: too small for incumbents to court, too small to build their own infrastructure. A neutral standard or framework arguably only appeals to this long tail. The question is whether there's enough value in serving that segment to justify the effort. This applies to cross-chain token standards, to cross-chain messaging (ERC-7786), and to solver/intent interoperability (ERC-7683, the OIF) — in each case, the players who most need a neutral standard are the ones with the least leverage to drive its adoption.

### 3. Complexity of the standard

Is the standard simple enough to actually get adopted, even if it's imperfect?

ERC-20 again. It has well-known flaws (the approve/transferFrom pattern, no transfer hooks, tokens getting stuck in contracts). But it was simple. Easy to implement, easy to understand, easy to build tooling around.

ERC-4337 (account abstraction) is the counterpoint. Many components (EntryPoint, UserOperation, Bundlers, Paymasters) trying to accommodate a wide range of use cases from day one. Most projects only need a subset of what it offers, and the complexity itself becomes the barrier.

There seems to be a pattern where simple-but-flawed standards get adopted and then the "better" replacement struggles to displace them. ERC-20's successors (ERC-777, ERC-1155, and more recently ERC-6909) have each been technically superior in various ways, but ERC-20 remains dominant. That said, the story isn't over: 6909 is gaining traction as a simpler multi-token alternative, so it's possible that the right combination of simplicity and timing can still break through. But the general pattern seems to favour adoption speed over correctness.

Standards that depend on unadopted standards inherit their adoption problem. Standards that depend on unfinished specifications inherit a different one — it introduces uncertainty about when the missing pieces will materialise. Either way, each unresolved dependency gives adopters one more reason to wait.

### 4. Does the standard enable something new?

There's a difference between a standard that unlocks new capabilities and one that just provides a unified interface over things that already work. Standards that enable something genuinely new (ERC-20 made tokens possible, EIP-712 made human-readable signing possible) have a much stronger adoption pull than standards that are purely abstraction layers.

ERC-7786 (cross-chain messaging gateway) is instructive here. It defines a common interface for cross-chain messaging, but it doesn't give bridges any new capabilities. Every bridge it abstracts over already works. The standard offers portability and reduced vendor lock-in, which matters to apps, but offers nothing to the bridges themselves. You're asking people to do integration work to get something they technically already have, just in a more standardised form.

And this makes the competitive problem worse: if a standard only provides abstraction and the main beneficiary is portability, you're asking incumbents to make it easier for customers to leave.

### 5. Composability dependency

How much does the thing being standardised need to be composable with the rest of the ecosystem?

This amplifies first-mover advantage and switching costs. The more composable something needs to be, the stronger the lock-in to whatever standard arrives first.

Tokens interact with everything: DEXs, lending protocols, aggregators, wallets, portfolio trackers, block explorers. The entire DeFi stack is shaped around ERC-20's interface. A token the ecosystem doesn't recognise is a dead token, which is why alternative token standards have struggled even when they're technically better. The ecosystem *is* ERC-20 shaped, and any new standard either needs to be backwards compatible or needs enough of the stack to adopt it simultaneously.

Infrastructure at the edges (bridging, relay networks, off-chain indexing) has shallower composability requirements. You need interoperability at the interface points, but the whole stack doesn't need to understand your internals. The cost of fragmentation is lower, the pressure to converge is weaker, and competing approaches can coexist.

When composability dependency is high, early simple standards become almost impossible to displace regardless of their flaws. When it's low, formal standardisation matters less because the market can tolerate heterogeneity. This partly explains why it's less important for bridging to be standardised than for tokens.

## How these interact

ERC-20 hit the virtuous cycle: greenfield, commodity, simple, enabled something new, high composability. Once adoption started, it accelerated. Every new DEX that supported ERC-20 made it harder to launch a non-ERC-20 token.

The vicious cycle is the reverse. Brownfield, competitive, complex, pure abstraction, low composability. ERC-7786 arguably hits all five. Too many reasons not to adopt and not enough pressure to converge.

Plotting the examples against the dimensions:

|  | Market | Competition | Complexity | New capability? | Composability |
| --- | --- | --- | --- | --- | --- |
| ERC-20 | Greenfield | Commodity | Simple | Yes (tokens) | High |
| ERC-4626 | Brownfield | Commodity | Simple | Yes (vault composability) | Moderate |
| EIP-712 | Brownfield | Commodity | Simple | Yes (readable signing) | Low |
| ERC-5792 | Brownfield | Commodity | Simple | Yes (wallet capabilities) | Moderate |
| EIP-7702 | Brownfield | Commodity | Simple* | Yes (EOA smart accounts) | High |
| ERC-4337 | Brownfield | Mixed | Complex | Yes (account abstraction) | Moderate |
| ERC-7683 | Brownfield | Competitive | Complex | No (abstraction) | Low |
| ERC-7786 | Brownfield | Competitive | Moderate** | No (abstraction) | Low |

> EIP-7702 is simple at the protocol level but pushed complexity into the application layer by shipping no default. See the enshrinement spectrum discussion below.
> 

The successes cluster toward the top of the table, the failures toward the bottom. The interesting cases are in the middle:

- Alternative token standards have the composability need that *should* create convergence pressure, but the brownfield reality tends to lock in the incumbent. Better to be compatible with the flawed standard the ecosystem already speaks (though ERC-6909 may be testing whether a simpler approach can crack this).
- Bridging standards, even in a relative greenfield, don't have deep composability needs. Competing approaches can coexist and the market may never converge. That might be fine.
- EIP-712 shows that commodity + brownfield + simple can still succeed. Nobody had a reason to resist, so patience worked. It just took years.
- ERC-4626 (tokenised vault standard) is the strongest brownfield success. Yield vaults already existed across Yearn, Aave, Compound and others, each with their own interface. But the standard worked because deposit, withdraw, and share accounting aren't where vault providers compete; yield strategy is. Standardising the interface actually helped them because aggregators could integrate any 4626 vault without custom work. Standardisation works in a brownfield market when the standardised surface isn't anyone's moat. Compare that to bridging, where the interface *is* the lock-in.
- ERC-5792 has a similar profile to 712: commodity (the app-wallet interface isn't anyone's moat), simple, enables something new. The multi-stakeholder coordination is the bottleneck, not the incentives. This will likely succeed but slowly, for the same reasons 712 did — nobody has a reason to resist, but nobody has an urgent reason to prioritise it either.
- EIP-7702 is the odd one out. It scores well on most dimensions but the adoption story is muddled because the *protocol change* succeeded (it shipped in Pectra) while the *ecosystem impact* underdelivered. The missing default meant the good scores on the table didn't translate into good outcomes for users. Dimensions aren't the whole story; execution matters too.
- Alignment with the protocol’s overall roadmap could provide a boost to adoption. EIP-8141 was reviewed by researchers working on censorship resistance (FOCIL), statelessness, and quantum resistance. They found it architecturally compatible with all three. Standards that fit into where the protocol is already headed may face less resistance, it is worth keeping an eye on its development.
- A competitive + greenfield + simple standard may succeed early but fragment later as businesses form around it and find ways to differentiate.

## When formal standardisation isn't working

Even when the dimensions above suggest a standard *could* succeed, the standardisation process itself has costs that are easy to underestimate.

Standards require consensus, and consensus takes time. Every participant has different priorities, different constraints, different ideas about what the standard should look like. The result is often a long, draining process of discussion and negotiation that consumes serious time and energy from people who could be building things. And the output is, almost by definition, a compromise: not the best solution for any particular use case, but the least objectionable one across all of them. A standard designed to satisfy every stakeholder's requirements risks satisfying none of them well enough to drive adoption.

ERC-7683 (cross-chain intents) is a good example. It had endorsement and community interest, but the standard had to accommodate different intent protocol designs, so it parameterised orders with implementation-specific fields (`orderData`). The result is only superficially standardised: fillers that want to fill "ERC-7683 orders" still need protocol-specific logic for each subtype, which isn't meaningfully different from having no standard. The standard also imposed gas overhead that made it less efficient than going direct, so where it has been adopted (e.g. by Across), it's been used as a wrapper event rather than the native interface. Solvers are still mostly integrating with individual protocols. Everyone's requirements were accommodated on paper. Nobody's behaviour changed.

This is the hidden cost. Even when a standard eventually ships, the time spent in committee is time the market kept evolving. Incumbents deepened their integrations, developers built workarounds, and the window for the standard to matter may have narrowed or closed. The standard arrives, technically sound, broadly agreed-upon, and the market shrugs because it already moved on.

This doesn't mean standardisation is never worth it. But the bar should be higher than "it would be nice if everyone did this the same way." The process cost needs to be weighed against a realistic probability of market impact, and when that probability is low, the alternatives below are probably a better use of everyone's time.

## Three alternatives

When formal standardisation isn't gaining traction, or when the process cost looks disproportionate to the likely impact, there are three strategic alternatives. Each has real trade-offs, and choosing the wrong one can be worse than doing nothing.

### Adopt the market leader

Accept the incumbent's approach *as* the standard. Stop trying to create a neutral alternative and rally around what already has critical mass.

OpenSea's NFT metadata standard is the clearest example. There was no ERC for how to structure NFT metadata (name, image, attributes). OpenSea defined a JSON schema, everyone building NFTs conformed to it because that's what OpenSea's marketplace displayed, and it became the de facto standard. No committee, no EIP process. The market leader set the terms and the ecosystem followed. This works when one player is clearly dominant and the cost of non-conformance is immediate (your NFTs look broken if you don't match OpenSea's format).

The trade-off is that you're giving up certainty of behaviour for speed and organic adoption. You can't have both. The market leader may change their API, may rent-seek, may make decisions that serve their business over the ecosystem. If you outsource standardisation to the market, you can't be frustrated when the market doesn't behave like a standards body.

### Build a better product

Rather than standardising what exists, build something new that's genuinely superior. Compete with the incumbents on merit rather than trying to coordinate them.

The advantage is clarity of focus. You're not constrained by consensus or backwards compatibility. You can be market-oriented: build for the user problem, not the committee room. A new product doesn't need everyone to agree; it just needs to be good enough that people choose it.

But it's just hard. Most "better products" fail because the incumbents have distribution, integrations, and user habits on their side. You're betting the quality delta is large enough to overcome switching costs.

There's also a subtler problem if you're a standards body or protocol foundation: building products may not be your comparative advantage or mandate. And the moment you start competing with ecosystem players, you change the relationship from coordinator to competitor. That shift can erode trust and willingness to collaborate on other things, even if the product itself is good. You might win the product battle and lose the coordination war.

In the wallet UX space, Porto is an interesting case. It uses ERC-5792 and EIP-7702, but rather than following ERC-4337's bundler/paymaster infrastructure for gas sponsorship, it built its own relayer approach. It adopted the standards where they were useful and routed around them where they weren't, shipping a product that delivers batching, sponsorship, and session keys without waiting for the full 4337 stack to mature. Tempo has extended this further with [Tempo Transactions](https://tempo.xyz/blog/tempo-transactions), building capabilities like stablecoin fee payment, atomic batching, concurrent execution, and passkey auth directly into the protocol as a native transaction type. It remains to be seen whether this works, but they're live in the market while other standards efforts are still grinding.

You could also argue the OIF is partly this play in the interop space: building a new framework intended to win on its merits rather than trying to standardise across existing bridge providers.

### Enshrine it in the protocol

Remove the market entirely by making the functionality part of the protocol itself. If the protocol provides the capability natively, there's no need for third-party solutions or standards coordination.

Once enshrined, it's just how things work. No coordination problem, no hold-outs, no competitive dynamics blocking adoption. Everyone building on the protocol gets the capability for free.

The trade-off is that you're killing the existing market, potentially destroying businesses that were providing this functionality. That may be justified if the market was extracting rents or creating fragmentation that harmed users, but it's a political and governance decision, not just a technical one. You also lose the benefits of competition: the protocol ossifies an approach, and if it turns out to be the wrong one, changing it is extremely expensive.

Not all enshrinement is equal, though. There's a range from enshrining a *flexible gadget* (a primitive that enables many approaches) to enshrining an *opinionated default* (a specific solution to a specific problem). Where you land on that range determines whether you actually resolve the coordination problem or just move it up a layer.

Enshrine a gadget and you get maximum flexibility but risk recreating the same fragmentation at the application layer. You've relocated the problem, not solved it. Enshrine an opinionated default and you sacrifice flexibility but deliver immediate, universal benefit. Most developers won't need to build alternatives because the default is good enough.

The thing I keep coming back to: **if you enshrine a flexible gadget, you need to also ship a default.** Flexibility without a default is an invitation for fragmentation. A sensible default with the option to override gives you most of the benefits of both: the 80% who just want things to work get a good experience out of the box, and the 20% who need something specific can still build it.

EIP-7702 is the cautionary tale. It enshrined account abstraction capabilities at the protocol layer: any EOA could delegate to any smart account. But it shipped no default account that wallets could just use. Each wallet developer was left to choose (or build) their own delegated smart account based on their own priorities. Some chose not to participate at all. The protocol-level coordination problem was solved, but an application-level coordination problem took its place. A default smart account with batching and gas sponsorship that wallets could adopt or override would have traded flexibility for immediate UX improvement. Most wallets would have just used the default, and users would have benefited on day one.

This pattern isn't limited to enshrinement. ERC-7683 has the same problem as a standard: it defines order types for cross-chain intents but leaves the actual order parameters as implementation-specific `orderData`. The standard is flexible enough to accommodate any intent protocol, but that flexibility means fillers still need per-protocol logic, and the "standardised" interface doesn't save them meaningful work. Whether you're enshrining at the protocol level or standardising at the application level, flexibility without opinionated defaults produces the same outcome: a technically compatible surface that isn't practically interoperable.

Enshrinement works when the capability is clearly a public good, when the protocol can commit to a specific enough approach, and when the governance process can absorb the political cost of displacing incumbents. And critically: when the enshrinement is opinionated enough, or ships a good enough default, that it actually resolves the problem rather than relocating it.

### Choosing between them

These aren't mutually exclusive, but they pull in different directions:

- Clear market leader and the functionality isn't a public good? Adopt the leader.
- Fragmented market and the problem is well-understood? Build a better product.
- Public good being poorly served by market competition? Enshrine it.

The worst outcome is trying all three simultaneously, or defaulting to formal standardisation when one of these alternatives would be a better fit.

## Failure modes

Each option has a characteristic way of going wrong:

- **Adopt the leader** leads to rent extraction and capture. The market leader, now blessed as the standard, raises prices, changes APIs, or makes decisions that serve their business over the ecosystem. You've traded fragmentation for dependency, and you may not be able to unwind it.
- **Build a better product** leads to execution failure and role confusion. The product doesn't win, and the foundation has spent credibility and resources competing with its own ecosystem. Even if the product is good, the shift from coordinator to competitor can damage the relationships needed for future coordination.
- **Enshrine it** leads to ossification or problem relocation. The protocol locks in the wrong approach and it's prohibitively expensive to change. Or the enshrinement is too flexible, a gadget without a default, and the coordination problem just moves up a layer with the added cost of having disrupted the existing market for no net benefit.

## Open questions

1. **Is ERC-4337 really a complexity problem, or a market maturity problem?** Account abstraction arrived in a brownfield market where wallets already work "well enough" for most users. The complexity may matter less than the fact that EOAs are entrenched. The problem is likely both, but they haven't been properly pulled apart yet.
2. **The 712 timeline.** Proposed in 2017, widely adopted much later. What drove the tipping point? Slow grind, or did a specific catalyst (maybe DeFi and permit signatures) push it over?
3. **Are there examples where a complex standard succeeded in Ethereum?** We haven't found one, which might itself be data.
4. **The token standards trajectory needs nuance.** The composability dimension explains why ERC-20 successors have struggled, but ERC-6909 is gaining traction, which complicates the "nothing can displace ERC-20" claim. Is 6909 succeeding because it's simpler, because it targets a different niche (multi-token), or because the ecosystem has matured enough to absorb a new standard? Worth watching.
5. **Is the long tail worth serving?** If the biggest players vertically integrate and the middle market is well-served by competing frameworks, neutral standards mainly benefit the long tail. Is there enough value there to justify the effort? Or does the long tail eventually get absorbed by the middle-market frameworks anyway?
6. **What does this framework imply for the OIF?** The OIF faces headwinds on most dimensions (brownfield, competitive, moderate complexity, unclear new capability, low composability). It seems to be pursuing standardisation, product-building, and ecosystem coordination simultaneously. The framework suggests picking one. Worth developing this into a concrete assessment.
7. **Does this framework apply outside Ethereum?** USB-C adoption, RSS vs. proprietary feeds, SMTP vs. proprietary email all seem like they'd fit the dimensions.