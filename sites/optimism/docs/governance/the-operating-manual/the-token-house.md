---
id: the-token-house
title: The Token House
sidebar_label: The Token House
---

The Token House is one of the two governing bodies of the Optimism Collective. It is composed of OP holders who have self-delegated or received delegated voting power. It plays a central role in shaping the development of the ecosystem by voting on governance proposals and Missions that allocate OP across the Collective.

## Role in the Collective

The Token House governs through token-based voting, where OP holders either:
- Delegate their voting power to themselves (self-delegation), or
- Delegate it to another address (a representative or “delegate”)

Any address with delegated OP voting power can participate in governance. Delegates are expected to contribute actively by reviewing proposals, participating in public discussions, and voting responsibly in line with the Collective’s values.

## Responsibilities

The Token House is responsible for voting on most governance proposals, including those that affect:
- The protocol and governance contract (Governor Upgrades)
- Treasury spending and inflation adjustments
- Governance Fund Missions and other ecosystem grants
- Maintenance upgrades and emergency network fixes
- Governance procedures (elections, structure changes, ratifications)
- Code of conduct violations or representative removals

The Token House also participates in veto power when applicable, particularly over certain Citizens’ House proposals.

## Governance Mechanism

Token House governance is executed via an on-chain Governor contract, deployed at: [0xcDF27F107725988f2261Ce2256bDfCdE8B382B10](https://optimistic.etherscan.io/address/0xcdf27f107725988f2261ce2256bdfcde8b382b10)

## Delegates

While any token holder can self-delegate and vote, the system relies on a subset of active, high-voting-power delegates who review proposals and signal their readiness for a vote.

Proposal authors often need explicit approval from Top 100 delegates (by voting power) to proceed, depending on the proposal type.

Delegates are expected to act by the [Rules of Engagement](https://gov.optimism.io/t/rules-of-engagement-2-0/5728) and [Optimist Expectations](https://gov.optimism.io/t/optimist-expectations/7241).

## Treasury and Mission Governance

A key function of the Token House is the governance of OP allocation through Missions:
- Governance Fund Missions are proposed and reviewed by the Grants Council
- Builders apply to these Missions and, if selected, receive OP grants
- Voting on these grants is conducted via the same Governor contract

Mission-related decisions are subject to the same quorum and approval thresholds as other proposal types.

## Implementation and Execution

Although the Token House formally approves proposals through on-chain voting, execution responsibilities often fall to the Optimism Foundation, including:
- Performing legal and compliance checks (e.g. KYC for grantees)
- Coordinating technical upgrades or disbursements
- Communicating implementation status post-approval

The Foundation operates as a steward and is expected to decentralize its role over time.

## Constitutional Alignment

The Token House operates within the framework defined by the Working Constitution, which has the following principles:

- **Governance minimization**: When multiple options achieve the same outcome, choose the least complex
- **Forkability and exit**: collective freedom must be protected
- **Anti-plutocracy**: token-based governance must be balanced by human-centric governance (Citizens)
- **Impact = Profit**: proposals should aim to reward meaningful contributions to the ecosystem
