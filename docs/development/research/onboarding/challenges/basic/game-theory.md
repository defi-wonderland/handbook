# Game Theory

## Overview

This challenge is designed to test your ability to apply game-theoretic magic such as best responses, dominated strategies, and Nash equilibrium to real-world adversarial scenarios in DeFi. You will construct formal models, estimate key parameters, and analyze the economic feasibility of attacks and defenses across multiple settings.

## Submission Requirements

All work must be submitted to the GitHub repository assigned to you during onboarding. Organize your repository using the following directory structure:

* `/models`: Include all mathematical models or formal derivations if applicable.
* `/diagrams`: Provide visual illustrations such as payoff diagrams, equilibrium maps, or attack trees.
* `solution.md`: Include your formal analysis, explanations, and conclusions.

## Oracle Manipulation Attack

Analyze the feasibility of an attack on a lending protocol that relies on two types of price oracles:
    - Uniswap V2 TWAP oracle
    - Chainlink aggregated price feed

1. Define the attacker’s cost to manipulate the Uniswap TWAP over $T$ blocks, given:

   * Liquidity $L$ in the pool
   * Desired price shift $\Delta P$
   * Block time

2. Define the attacker’s cost to manipulate the Chainlink oracle, given:

   * Total number of independent data sources $N$
   * Fraction $f$ of sources required to be compromised or bribed
   * Per-source manipulation cost

3. Calculate the maximum borrowable amount under manipulated prices, based on the protocol’s loan-to-value ratio $\theta$, the attacker’s collateral deposit $A_{\text{collateral}}$, and the final manipulated price $P_{\text{manipulated}}$.

4. Compute the net profit:

   $$
   \Pi = B_{\text{borrow}} - C_{\text{manipulation}} - A_{\text{collateral}} \times P_{\text{initial}}
   $$

   where $B_{\text{borrow}}$ is the borrowed amount, $C_{\text{manipulation}}$ is the total cost of manipulation, and $P_{\text{initial}}$ is the initial price of the collateral.

5. Analyze under which combinations of liquidity, oracle parameters, and time windows the attack becomes profitable.

6. Propose protocol-side mitigations and evaluate their potential effectiveness in reducing the feasibility of the attack.

## MEV Sandwich Attack on DEX Users

Model the incentives of a MEV searcher performing a sandwich attack against a large DEX trade.

1. Construct the payoff matrix between:

    - A user who can either submit a large swap as a single transaction or split it across multiple smaller transactions
    - An MEV searcher who can choose to front-run and back-run (sandwich) the trade or abstain from interference

2. Incorporate the following parameters:

    - Gas cost per transaction
    - Slippage effects on the user’s execution
    - Expected profit margin of the searcher from the sandwich

3. Analyze the user’s best-response strategy under varying gas price and slippage protection levels.

4. Evaluate the competitive equilibrium among multiple MEV searchers, considering the diminishing returns from overlapping attacks.

## Validator Collusion and Slashing Risk

Analyze the strategic behavior of validators in a staking network where validators can either follow the protocol honestly or attempt collusion for additional rewards.

1. Define the following parameters:

    - Reward $R$ for honest participation
    - Additional gain $G$ from successful collusion
    - Probability $p$ of detection and slashing
    - Slashing penalty $S$

2. Determine the best-response strategy for an individual validator given the parameters above.

3. Analyze the Nash equilibrium among $N$ validators under different values of $p$ and $S$.

4. Explore how protocol-level changes to detection mechanisms or penalty sizes shift the equilibrium toward greater or lesser collusion risk.

## Deliverables

For each part of the challenge, you must provide:

    - Formal models: Include all mathematical expressions, payoff functions, and equilibrium characterizations.
    - Diagrams: Provide clear visualizations such as attack decision trees, cost-benefit plots, or equilibrium maps.
    - Final writeup: Deliver a formal summary explaining your models, outlining key insights, and assessing the effectiveness of different defensive strategies.

## Purpose and Learning Outcomes

This challenge is intended to cultivate your ability to:
- Identify and formalize the economic incentives driving attacker and defender behavior in DeFi systems.
- Apply game-theoretic tools to analyze adversarial interactions within protocol design.
- Produce technically rigorous research artifacts suitable for internal use or external publication.

## How to Submit Your Work

- All work for your chosen challenge must be committed to the GitHub repository assigned to you during onboarding.
- Include diagrams/charts to illustrate key points.
- Maintain a technical focus throughout.
- No need to delve extremely deep into the underlying systems—focus on tokenomics, and wisely manage your time.
- Structure your commits clearly, with meaningful messages that outline the progress of your work, see [Git Practices](/docs/processes/github/git-practices.md) for reference.
- Ensure your final submission is well-organized, with supporting files, diagrams, or models included as needed.

# 🍀 Good luck!