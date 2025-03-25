# Onboarding

This is the onboarding process for new developers joining the Offchain team. It provides a challenge that introduces key concepts, tools, and best practices we use in our development workflow.

The onboarding process consists of a practical challenge - building a UniswapV2 TVL aggregator. This project is designed to familiarize you with:

- Our monorepo structure and development patterns
- TypeScript best practices and architectural principles 
- Testing methodologies and documentation standards
- Common tools and libraries we use
- Our GitHub workflow and code review process

By completing this challenge, you'll gain hands-on experience with the technologies and practices outlined in our [best practices guide](./best-practices.md).

## UniswapV2 Multichain TVL Aggregator Challenge

## Context ℹ

Develop a system to aggregate and report Total Value Locked (TVL) from UniswapV2 pools across multiple blockchains. This project aims to create a robust, efficient, and scalable solution for TVL tracking in decentralized finance (DeFi) ecosystems.

## Goals 

- Create a monorepo-based application for multichain TVL aggregation. Just the API, no frontend needed
- Implement efficient data fetching using virtual batching and multicall techniques
- Develop a flexible and extensible architecture for future enhancements
- Ensure high test coverage and deployment readiness
- Get a grasp on the tech and tools we commonly use

### Tracking

Use the Linear project assigned to you during the onboarding process. There you’ll find all the tasks for the challenge too. Feel free to write any issue/sub-issue that you may consider necessary

[Remember our guidelines on PRs](https://www.notion.so/General-guidelines-bb8b0a84d06841279337fd4502124d42?pvs=21)


## Starting point: Tech design 

Given the starter UML diagram provided, work on a brief tech-design for the challenge

Tech design must address:

- Which is the plan?
- 1 Sequence diagram (include diff contracts)
- 1 UML (relationship between missing modules)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/7683bccd-1174-4689-a817-b27fd9d7ef00/e0ff657c-20c6-40f8-99ce-0e24bb9f3134/image.png)

## Coding fun 

Create the challenge repo using the [Wonder’s Repo Creator](https://github.com/defi-wonderland/repo-creatooor) and the [Offchain-Turborepo-Boilerplate](https://github.com/defi-wonderland/ts-turborepo-boilerplate) template. Give it a meaningful name 🙂

## Must-do Components

- Monorepo Structure:
    - Utilize monorepo template
- Pricing Module:
    - Fetch prices from Coingecko and DeFiLlama
    - Implement [factory pattern](https://refactoring.guru/design-patterns/singleton) for provider selection
    - Add caching with 60-second TTL
- Logger:
    - Implement using [singleton pattern](https://refactoring.guru/design-patterns/singleton)
- EVM Provider:
    - Implement `readContract`  method
    - Utilize `Viem` as the blockchain interfacing client (we ❤️ viem)
- Batching System:
    - Develop a batching contract for fetching TVL from different pools of Uniswap using token addresses as inputs
    - Use `Foundry` for smart contract development
        - Note: don’t need to become an expert on SC development
    - Extend EVM Provider with `readBatchContract` and test your contract implementation
- TVL Provider:
    - Support multiple chains
    - Implement [proxy pattern](https://refactoring.guru/design-patterns/proxy) for caching (`TVLProviderWithCache`)
- API:
    - Create a single GET endpoint: `/tvl`
    - Implement controller and services with dependency injection
    - Return TVL for specified chains based on request body
    - Implement environment variable validation for all apps
    - Swagger docs
- Testing (this should be done along the way):
    - Use `Vitest` for testing framework
    - Achieve minimum 90% code coverage
- Deployment:
    - Provide Dockerfile for local API deployment

### Criteria

- Code design and modularity
- Tests, tests and tests!
- Proper building process
- Consider error handling
- Documentation, how can i use each library?
- Clean project structure and DRY

## Next steps

Write some notes with your experience working on the challenge. All feedback is really welcomed and appreciated, as it help us on improving the challenge for the future