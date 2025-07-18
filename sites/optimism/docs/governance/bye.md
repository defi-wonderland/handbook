---
id: bye
title: Wrapping up
sidebar_label: Wrapping up
---

# Wrapping Up

To wrap up, where the OP Stack defines *how the system runs*, governance defines *how it changes*. It encodes: who can propose, who can vote, and who can veto. And because governance must evolve with the Collective, it’s designed to be both programmable and flexible: via modules, managers, and community experimentation.

As you’ve seen, governance isn’t just about casting votes. It’s about trust minimization, fault tolerance, consent, and credible neutrality. The system must balance legitimacy with execution, and decentralization with security.

Now that you’ve studied the full structure, we encourage you to sit with some deeper technical questions:

## 🧠 Questions to think about

<details>
<summary>Why separate the Governor from the Proposal Validator?</summary>

The Validator acts as a permissioned gatekeeper, enforcing off-chain rules (like delegate approval) in an on-chain format. It allows us to evolve the proposal logic independently from the core voting and execution engine. What trade-offs are we making in doing so?
</details>

<details>
<summary>What could go wrong if the ProposalTypesConfigurator is centralized?</summary>

Since quorum and approval thresholds depend on proposal type IDs, a compromised Configurator could lower requirements to push malicious proposals through. How would you design a decentralized alternative?
</details>

<details>
<summary>How would you detect a subdelegation abuse via Alligator?</summary>

If voting power is subdelegated to multiple downstream voters, how do we ensure no over-delegation occurs? What data structures or interfaces would help us prevent double-spending of votes?
</details>

<details>
<summary>Can we remove the Manager role entirely?</summary>

What would need to change in the system to remove the Manager's power to submit proposals, configure thresholds, or change voting deadlines? Could this be replaced with a DAO-controlled policy engine?
</details>

<details>
<summary>What does 'forkability' look like in governance?</summary>

If a delegate or group of citizens disagrees with the direction of governance, can they fork the system? What technical mechanisms or social affordances (e.g. reproducible config, open contracts) enable this?
</details>

### Keep Building

Governance is never done. If you're working on tooling, researching modules, or helping design the next iteration of participation, it shapes the protocol!

You can follow ongoing governance upgrades in:
- [vote.optimism.io](https://vote.optimism.io/)
- [gov.optimism.io](https://gov.optimism.io/)
- [github.com/voteagora](https://github.com/voteagora)