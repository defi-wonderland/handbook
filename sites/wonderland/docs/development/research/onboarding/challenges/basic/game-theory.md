# Game Theory

## Overview

This challenge is designed to test your ability to apply game-theoretic magic such as best responses, dominated strategies, and Nash equilibrium to real-world adversarial scenarios in DeFi. You will construct formal models, estimate key parameters, and analyze the economic feasibility of attacks and defences across multiple settings.

## Submission Requirements

All work must be submitted to the GitHub repository assigned to you during onboarding. Organize your repository using the following directory structure:

* `/models`: Include all mathematical models or formal derivations if applicable.
* `/diagrams`: Provide visual illustrations such as payoff diagrams, equilibrium maps, or attack trees.
* `solution.md`: Include your formal analysis, explanations, and conclusions.

## Mandatory Task

- **Validator Collusion and Slashing Risk** (MANDATORY) 

Analyze the strategic behavior of validators in a Cosmos-based staking network where validators can either follow the protocol honestly or attempt collusion for additional rewards. In Tendermint, if ≥ 1⁄3 of power is Byzantine, the chain can halt; if > 2⁄3, the coalition can finalize an arbitrary block. 

1. According to the Tendermint model, define the following parameters:

    * Reward $R$ for honest participation
    * Additional gain $G$ from successful collusion
    * Probability $p$ of detection and slashing
    * Slashing penalty $S$

2. Determine the best-response strategy for an individual validator given the parameters above.

3. Analyze the Nash equilibrium among $N$ validators under different values of $p$ and $S$.

4. Explore how protocol-level changes to detection mechanisms or penalty sizes shift the equilibrium toward greater or lesser collusion risk.

## Optional Tasks (You must choose one)

### Option A: MEV Sandwich Attack on DEX Users

Model the incentives of an MEV searcher performing a sandwich attack against a large DEX trade.

1. Construct the payoff matrix between:

    - A user who can either submit a large swap as a single transaction or split it across multiple smaller transactions
    - An MEV searcher who can choose to front-run and back-run (sandwich) the trade or abstain from interference

2. Incorporate the following parameters:

    - Gas cost per transaction
    - Slippage effects on the user’s execution
    - Expected profit margin of the searcher from the sandwich

3. Analyze the user’s best-response strategy under varying gas prices and slippage protection levels.

4. Evaluate the competitive equilibrium among multiple MEV searchers, considering the diminishing returns from overlapping attacks.

### Option B: Attacks on Governance

**Governance Attack** 

Evaluate the feasibility of a governance attack under the Terra Blockchain governance, and identify the risks and implications that could arise given different situations. The analysis should propose a conceptual framework that enables the governance to systematically assess the risk of governance attacks, assuming that Quorum Q = 40 %, Approval T = 50 %, Veto V = 33.4 %, respond:

- The feasibility of a governance attack under the current quorum rules.
- The risks and trade-offs associated with potentially lowering the quorum threshold.
- The impact of the current LUNA tokenomics on the potential distribution of voting power.
- The potential return on investment (ROI) for a malicious actor attempting to carry out a successful attack.
- Relevant factors such as token concentration, historical participation, and existing defence mechanisms.

## Deliverables

For each part of the challenge, you must provide:

* Formal models: Include all mathematical expressions, payoff functions, and equilibrium characterizations.
* Diagrams: Provide clear visualizations such as attack decision trees, cost-benefit plots, or equilibrium maps.
* Final writeup: Deliver a formal summary explaining your models, outlining key insights, and assessing the effectiveness of different defensive strategies.

## Purpose and Learning Outcomes

This challenge is intended to cultivate your ability to:
- Identify and formalize the economic incentives driving attacker and defender behavior in DeFi systems.
- Apply game-theoretic tools to analyze adversarial interactions within protocol design.
- Produce technically rigorous research artefacts suitable for internal use or external publication.

## How to Submit Your Work

- All work for your chosen challenge must be committed to the GitHub repository assigned to you during onboarding.
- Include diagrams/charts to illustrate key points.
- Maintain a technical focus throughout.
- No need to delve extremely deep into the underlying systems: focus on tokenomics, and wisely manage your time.
- Structure your commits with meaningful messages that outline the progress of your work. see [Git Practices](/docs/processes/github/git-practices.md) for reference.
- Ensure your final submission is well-organized, with supporting files, diagrams, or models included as needed.

## Helpful Resources 🎓

A quick knowledge boost before you dive in:

1. [Byzantine Consensus Algorithm in Tendermint](https://github.com/tendermint/tendermint/blob/main/spec/consensus/consensus.md).
2. [MEV and me](https://www.paradigm.xyz/2021/02/mev-and-me).
3. [Cosmos Governance Module](https://github.com/cosmos/governance/blob/master/overview.md).

# 🍀 Good luck!
