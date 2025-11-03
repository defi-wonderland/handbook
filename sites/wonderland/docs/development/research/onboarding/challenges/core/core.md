# Core
When you applied to Wonderland, you selected one of the following topics for your challenge. Now, you’ll pick one of the other two options to further expand your knowledge and skills. Choose wisely, as this will deepen your expertise in key areas of core infrastructure.

## 1. Oracles
**a. Analysis**: Analyze 2–3 of the most relevant oracles. For each, compare:

- Security
- Sustainability
- Decentralization

**b. Design**:

- How would you design an ideal oracle from scratch in a world where gas is free?
- How would you design an oracle from scratch in a world where gas is extremely expensive (in L1 only)?

**c. Modelling**:

- Cost of attack and potential profit (or economic feasibility) for an attack on a lending protocol that uses Uniswap V2 (spot) and Chainlink as sources.

## 2. Stablecoins

**a. Analysis**: Analyze 2–3 of the most relevant stablecoins. For each, compare:

- Backing mechanism
- Sustainability
- Decentralization

**b. Design**:

- *Environment without liquidation risk*: How would you design an ideal stablecoin in a world where collateral cannot lose value?
- *Environment with highly risky collateral*: How would you design a stablecoin from scratch in a scenario where all collateral assets are highly volatile and prone to liquidation?

**c. Modelling**:
Model the economic feasibility (cost of attack vs. potential profit) of a specific attack on a DeFi protocol that relies on stablecoins. Your model should analyze the conditions under which an attack becomes profitable and suggest potential mitigation measures. Choose one of the following three scenarios to model and analyze:

- De-Peg of an algorithmic stablecoin.
- Oracle manipulation on a lending protocol.
- Bank run on a centralized stablecoin.

## 3. Bridges

**a. Analysis**:
Analyze the most relevant bridges. For each, compare the following:

- Security
- Decentralization
- Trust Assumptions

**b. Design**:

- How would you design an ideal bridge from scratch in a world where gas is free?
- How would you design a bridge from scratch in a world where gas is extremely expensive (in L1 only)?

**c. Modelling**:

- Cost of attacking a bridge with minting rights and the potential profit for the attacker.

## 4. Privacy in the EVM: Tornado Cash & Privacy Pools

**a. Analysis**:
Compare Tornado Cash and Privacy Pools across the following dimensions:

- Anonymity model: How each system achieves privacy and what information still leaks
- Security: Cryptographic assumptions, attack surfaces, deanonymization vectors
- Compliance stance: Tornado’s undifferentiated anonymity vs. Privacy Pools’ association/exclusion proofs
- Composability: Gas costs, integration with dApps, UX implications

**b. Design**:

- How would you design an ideal private transfer/swap system in a world where compliance is *not* a problem?
- How would you design one in a world where compliance is a requirement (e.g. users must prove “clean” origins or credentials without revealing their identity)?

**c. Modelling**:

- Model the cost and feasibility of deanonymizing users in Tornado-style systems (consider anonymity set size, timing, value correlation, etc.)
- Model potential attacks on Privacy Pools-style systems and analyze the incentives for attackers or regulators

## How to Submit Your Work

- All work for your chosen challenge must be committed to the **GitHub repository** assigned to you during onboarding.
- Structure your commits clearly, with meaningful messages that outline the progress of your work. See [Git Practices](/docs/processes/github/git-practices.md) for reference.
- Ensure your final submission is well-organized, with supporting files, diagrams, or models included as needed.

## Next Steps

- Choose one of the above options and approach it with a mix of theoretical analysis, practical evaluation, and creative problem-solving.
- If you need guidance or clarification, reach out! 😊

## 🍀 Good luck!