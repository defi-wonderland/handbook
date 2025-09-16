---
slug: lets-deploy
title: Figuring out how the ideal solidity deploy setup looks like
description: Devops must get to DeFi
date: 2025-09-25
tags: [devtooling]
authors: [teddy]
---

> This is the first in a saga of two blogposts. Here we're concerned with the state of the art of EVM smart contract deployments, comparing it against our needs, and figuring out a wishlist of what we should build to bridge the gap between the two.  
In the following installment, we'll properly specify how to implement that wishlist in a manner similar to how we produce Idea Drafts for our partners in order to gather feedback from the broader community.

<!-- consider making an introduction of the existing alternatives & our needs before this -->


## What we want out of a deployment 'framework'

### No loss of generality compared to `forge script`

#### Why

We ship stuff that's _interesting_, in a way that lives in the edge of what developer tooling supports.
[cannon](https://usecannon.com/learn), for example, has a very small set of stuff it actually supports. Those things that it actually supports, does in a very comfy way, but things outside of that have very poor ergonomics. For example, a timelocked transfer in cannon should be done like this:

```toml
[invoke.TransferTimelocked]
target="Timelock"
func="schedule"
args=[
    "<%=settings.dai %>", # target
    "0",                  # value
                          # data -- ERC20 transfer teddy 500e18
    "0x00000000000000000000000073DD1BEA873DD1BEA873DD1BEA873DD1BEA873DD00000000000000000000000000000000000000000000001b1ae4d6e2ef500000",
    HashZero,             # predecessor
    HashZero,             # salt
    "<%=settings.timelockDelay %>"
]
```

Which is a total pain to write and audit.

While from Solidity, edge cases are not as edgy:

```solidity
timelock.schedule({
    target: dai,
    value: 0,
    data: abi.encodeCall(IERC20.transfer, teddyAddr, teddyAmount),
    predecessor: bytes32(0),
    salt: bytes32(0),
    delay: Constants.TIMELOCK_DELAY
});
```

See? Almost readable.

Another very good feature of foundry which we should not lose is the ability to choose to broadcast a call or not. While the approach of doing so in-line _can_ potentially break stuff if done incorrectly, and having clearer boundaries between broadcast vs non-broadcast zones _could_ be benefitial, being able to perform essentially static calls and compute complex values in the same framework the deployments are performed is a very useful tool.

#### What this means

Whatever we build will have to be glorified tooling for `forge script`. If you think about the latter [as a triangle](http://vimcasts.org/blog/2012/08/on-sharpening-the-saw/), the former might sharpen its tip (by allowing to submit Safe txs) or widen its base (by making actions easier to audit by abi-decoding them in a frontend), but must not get in the way of what foundry already does well.

### Ease of development, or You Must Accept This Tool Will Crash, And Make It Easy To Fix (Or At Least To Understand How It Broke).

The end-er the user of a tool, the least acceptable is for it to crash. We [as developers](https://x.com/cakesandcourage/status/1461481653059129345), pulled the proverbial short stick on that one, turning our _ability_ to un-break computers into an _expectation_ that what we use will break, and we will be responsible for fixing it. While it might be possible to mitigate this by choosing to be users of _products_ instead of [operators](https://duskos.org/#operator) of _tools_ for a subset of what we do between our keyboards, the reality is that _operators_ are who build useful infrastructure, and _user_ is the thing you have to keep around in order to keep billing a credit card.

What I am getting at is: The tool must be invoked by foundry in a `ffi`, not the other way around (a.k.a invoking `whatevertool deploy` and having that invoke foundry). It can (and should) be abstracted away slightly so the intention of the calls isn't obscured behind the verbosity of calling whatever kind of executable from Solidity, but keeping `foundry {test,script}` as the entrypoint ensures:

- Our tool can be kept as a black box up to the _very_ last step of an operator debugging what's wrong with the deployment.
- Operators of our tool can use it from foundry interfaces they are already familiar with. A.K.A ensuring nobody ends up editing a minified file inside `node_modules` to pass `-vvvv` and get a stack trace. Or even worse, having to patch/re-build _our_ tool to figure out how to ship _their_ protocol.
- Debugging tools, such as stack traces (or even `forge debug`!) should remain maximally useful.

### Auditability

- **Making Sure Actions Are Understandable**: This means abi-decoding the actions to be performed. It is most useful for non-devs and standard (even repetitive?) actions. This in particular is the domain of canon guard, so we could separate the usecases and not worry as hard about it for Our Upcoming Tool.
- **Making Sure Bytecode Matches Contract**: This is the domain of sourcify and etherscan, solved from the early days of Ethereum.
- **Making Sure Contract Matches Codebase**: For deployments or post-deploy operations complex enough that it's not trivial to inspect the actions themselves, a very big attack surface remains on submitting an action for signing that is not what has been audited or manually reviewed. Said adversarial contract could look very similar to the real thing and e.g. introduce a subtle but knowingly exploitable bug, and very easily slip through a re-review of the code itself.

> [!NOTE]
> Uncharted territory ahead

To solve all three problems listed above, but especially the last one, Our Tool should:

- Prominently display the git repo + commit hash of the codebase where the deployment is being proposed
- Verify the code on etherscan of all the deployed contracts.
- Check, with `forge verify-bytecode` that:
    - The bytecode for deployment of new contracts matches what is on the codebase (a small file making the matches explicit might be necessary)


### Security

### First-class support for Safe
