
# On relayers privacy and fragmenting trust

There is a fundamental challenge that users of privacy protocols on Ethereum eventually face. After successfully shielding your assets, you wish to withdraw them. But to do so, you must submit a transaction, which requires gas. How do you pay for gas without using a funded account, which would create a fresh link and potentially unravel the very privacy you worked to create?

A common answer has been the **relayer**. This is a service that submits your transaction and pays the gas for you, usually taking a fee from the withdrawn funds. The model is powerful because it decouples your identity from the on chain transaction origin. To an observer, the transaction comes from the relayer. But we have only moved the trust problem, the relayer learns your IP address and the final destination of your funds, creating a new private link off chain.

The natural question is, can we do better? I think yes and it requires us to thoughtfully compose several powerful primitives like **Stealth Addresses** (as in ERC 5564) and **Account Abstraction** (ERC 4337). The key insight is that we can architect a withdrawal flow that programmatically **fragments trust**, making it exponentially harder for any single entity to deanonymize a user.

### **The relayer's advantage**

Before designing a solution, it is important to map out the information a relayer, or more accurately a modern ERC 4337 paymaster, collects. The service sees the user's IP address, which links the request to a real world network location. It also sees the transaction's content, including the destination address, the amount, and its timing. If a user withdraws from a privacy pool to an exchange using a relayer, that relayer knows a person at a certain IP address sent a specific amount to that exchange, the challenge is to break this link.

### **Two hop withdrawal**

The core vulnerability is that a single entity sees both the origin (your request) and the destination. The solution is to split the withdrawal into two distinct "hops" using a different, unlinkable paymaster for each.

**Hop 1, private withdrawal to a temporary stealth address**

Instead of withdrawing to your final address, you first generate a new, one time **stealth address**. You then construct a `UserOperation` to withdraw funds from the privacy pool to this temporary address and send it to a paymaster service. What does the paymaster for this first hop see? It sees your IP address and knows you are withdrawing from a privacy pool. But critically, **it only sees the funds moving to an opaque stealth address**. It has no idea who controls this address. From its perspective, the trail goes cold.

**Hop 2, gasless consolidation**

You now construct a *second* `UserOperation` which instructs the stealth address to send its new assets to your final destination. You submit this second operation to a *different* paymaster service and the privacy gain comes from ensuring that this second request cannot be easily linked to the first. The paymaster for hop two sees a request from a seemingly random smart account to send funds to a destination, but it has **no context that these funds originated from a privacy pool**. The crucial link is broken. This protection becomes much stronger if you submit the second request from a different network location, for example by using a VPN.


### **Trust fragmentation not elimination**

It is worth noting that this architecture does not achieve perfect, trustless privacy. Rather, it achieves **trust fragmentation**. An adversary wishing to deanonymize you would now need to be in control of *both* paymaster services and successfully correlate the activity between them based on timing and amounts, a difficult data analysis challenge.

A natural question to ask is, why not just use a VPN with a single relayer?  Even if they do not know your personal identity, they know something important about your address's history. The two hop model is more powerful because it specifically breaks this _informational_ link for any single party. The first paymaster does not see the final destination and the second paymaster does not see the privacy pool origin. No single entity learns the full story, leaving behind fewer valuable traces.