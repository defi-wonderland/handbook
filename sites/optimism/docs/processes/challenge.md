---
id: challenge
title: Challenge
sidebar_label: Challenge
---

# Challenge

## Task

Fork the Optimism monorepo and implement a Predeploy that enables ERC721 token interoperability across the Superchain.

## Requirements

### Technical Requirements

- Fork the Optimism monorepo
- Create a new Predeploy contract for ERC721 interoperability
- Implement cross-chain token transfer functionality
- Ensure compatibility with existing bridge contracts
- Follow Optimism's security and coding standards
- Run `just pre-pr`, `just semgrep` and `just test` before submitting the PR

### Implementation Details

The Predeploy should:

- Support ERC721 token transfers between L2s
- Handle token metadata and ownership tracking
- Implement proper access control
- Include comprehensive test coverage
- Document all functions and events

### Testing Requirements

- Unit tests for all contract functions
- Integration tests with bridge contracts
- Fuzz tests for edge cases

## Resources

- [Optimism Monorepo](https://github.com/ethereum-optimism/optimism)
- [Contracts Guide](https://devdocs.optimism.io/contracts-bedrock/)
- [ERC721 Standard](https://eips.ethereum.org/EIPS/eip-721)
