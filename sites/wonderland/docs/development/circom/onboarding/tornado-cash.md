---
sidebar_position: 5
title: Remaking Tornado Cash
---

# Remaking Tornado Cash

:::caution Educational Purpose Only
This is for educational purposes only, as it is the most basic and well-known zk system on Ethereum today.
:::

## Objective

Understand and implement the core cryptographic concepts behind Tornado Cash, one of the most influential zkApps on Ethereum.

## Learning Resources

1. **Read the Tornado Cash Whitepaper:** [berkeley-defi.github.io](https://berkeley-defi.github.io/assets/material/Tornado%20Cash%20Whitepaper.pdf). Focus on understanding the commitment scheme, nullifier concept, and the overall architecture.
2. **Watch the Technical Breakdown:** [0xPARC Learning Materials](https://learn.0xparc.org/materials/circom/learning-group-1/breaking-down-tornado/). Pay attention to how the circuits are constructed and how the proof system works. (Or read [RareSkills guide](https://rareskills.io/post/how-does-tornado-cash-work))
3. **Review Circom Documentation:** [docs.circom.io](https://docs.circom.io/). Familiarize yourself with the language.

## Tasks

### Part 1: Understanding the System

- Explain how Tornado Cash achieves transaction privacy
- Describe the role of commitments and nullifiers in the protocol
- Outline the deposit and withdrawal flow, including what information is public vs. private
- Explain why a Merkle tree is used and how it enables anonymous withdrawals

### Part 2: Circuit Implementation

- Write a Circom circuit that verifies:
    - Knowledge of a valid commitment (preimage of a hash)
    - Membership of that commitment in a Merkle tree
    - Correct computation of the nullifier hash
- Test your circuit with sample inputs
- Generate a proof and verify it

### Part 3: Smart Contract Development

- Implement a simplified Tornado Cash smart contract with:
    - `deposit()` function that accepts commitments
    - `withdraw()` function that verifies proofs and nullifiers
    - Merkle tree storage for commitments
    - Nullifier tracking to prevent double-spending
- Write tests (unit testing and e2e)

## Deliverables

- [ ] Written report explaining the concepts (Part 1)
- [ ] Circom circuit code with test cases (Part 2)
- [ ] Smart contract code with deployment scripts and tests (Part 3)
