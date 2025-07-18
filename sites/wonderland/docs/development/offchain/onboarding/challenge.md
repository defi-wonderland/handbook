---
title: Coding Challenge
---

# UniswapV2 Multichain TVL Aggregator Challenge

## Context

Develop a system to aggregate and report Total Value Locked (TVL) from UniswapV2 pools across multiple blockchains. This project aims to create a robust, efficient, and scalable solution for TVL tracking in decentralized finance (DeFi) ecosystems.

## Goals

- Create a monorepo-based application for multichain TVL aggregation. Just the API, no frontend needed
- Implement efficient data fetching using virtual batching and multicall techniques
- Develop a flexible and extensible architecture for future enhancements
- Ensure high test coverage and deployment readiness
- Get a grasp on the tech and tools we commonly use

## Starting point: Tech design

Given the starter UML diagram provided, work on a brief tech design for the challenge.

Tech design must address:

- Which is the plan?
- 1 Sequence diagram (include diff contracts)
- 1 UML (relationship between missing modules)

![offchain-img.png](/img/offchain-img.jpg)

## Coding fun

Create the challenge repo using the [Wonder's Repo Creator](https://github.com/defi-wonderland/repo-creatooor) and the [Offchain-Turborepo-Boilerplate](https://github.com/defi-wonderland/ts-turborepo-boilerplate) template. Give it a meaningful name 🙂

## Must-do Components

- Monorepo Structure:
  - Utilize monorepo template
- Pricing Module:
  - Fetch prices from Coingecko and DeFiLlama
  - Implement [factory pattern](https://refactoring.guru/design-patterns/factory-method) for provider selection
  - Add caching with 60-second TTL
- Logger:
  - Implement using [singleton pattern](https://refactoring.guru/design-patterns/singleton)
- EVM Provider:
  - Implement `readContract` method
  - Utilize `Viem` as the blockchain interfacing client (we ❤️ viem)
- Batching System:
  - Develop a batching contract for fetching TVL from different pools of Uniswap using token addresses as inputs
  - Use `Foundry` for smart contract development
    - Note: don't need to become an expert on SC development
  - Extend EVM Provider with `readBatchContract` and test your contract implementation
- TVL Provider:
  - Support multiple chains
  - Implement [proxy pattern](https://refactoring.guru/design-patterns/proxy) for caching (`TVLProviderWithCache`)
- API:
  - Create a single GET endpoint: `/tvl`
  - Implement the controller and services with dependency injection
  - Return TVL for specified chains based on the request body
  - Implement environment variable validation for all apps
  - Swagger docs
- Testing (this should be done along the way):
  - Use `Vitest` for testing framework
  - Achieve a minimum 90% code coverage
- Deployment:
  - Provide Dockerfile for local API deployment

### Criteria

- Code design and modularity
- Tests, tests and tests!
- Proper building process
- Consider error handling
- Documentation, how can I use each library?
- Clean project structure and DRY

## Next steps

Write some notes on your experience working on the challenge. All feedback is welcome and appreciated, as it helps us improve the challenge for the future.
