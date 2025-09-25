# Knowledge Base 

The Knowledge Base serves as the cornerstone of our onboarding process. It contains information about our organization’s coding style, best practices, and the tools we use to write, test, and maintain Solidity code. By familiarizing yourself with the Knowledge Base, you ensure that you can align with our standards and workflows.

:::tip
Wonderland's standards are what make us unique. Adhering to these best practices is a critical part of onboarding and should be approached with diligence and care.
:::

## Essential Resources

### Git & Development Practices
Start by reviewing our [Git Practices](docs/processes/github/git-practices.md) guide, which outlines our software management processes and best practices. Also, take a look at [the Pull Request Guidelines](docs/processes/github/pr-guidelines/pr-guidelines.md).

### Coding Standards
Next, familiarize yourself with our core coding standards:
- [NatSpec Best Practices](docs/development/solidity/natspec.md)
- [Solidity Coding Style](docs/development/solidity/coding-style.md)
- [Gas Optimization Guide](https://www.rareskills.io/post/gas-optimization)

### DeFi & Dapps
Understanding the DeFi ecosystem is crucial for building robust smart contracts.
- A curated list of [DeFi & Dapps](docs/development/solidity/defi-dapps.md) resources.

It introduces you to the foundational contracts, standards, and patterns that every DeFi developer should know.

### Testing Framework
Testing is fundamental to our development process. We have developed a systematic approach to ensure comprehensive coverage while maintaining test quality and performance.

Key Guidelines:
- [ ] Test setup should be simple and focused
- [ ] Tests should cover all logical branches and edge cases.
- [ ] Every Unit Test should target a single branch or path.
- [ ] Variables must not be shadowed.
- [ ] Maintain sync between `.tree` files and `.t.sol` test files.
- [ ] Every `mockCall()` has the corresponding `expectCall()` verification.
- [ ] Aim for 1000+ fuzz runs with relevant parameter clamping.
- [ ] Use `bound()` instead of `vm.assume()` for fuzzing.

Learn about our processes:
- Our approach to [Unit and Integration Testing](docs/testing/unit-integration.md) with Foundry
- Our [Solidity Foundry Boilerplate](https://github.com/defi-wonderland/solidity-foundry-boilerplate) - our starter template for Solidity projects

Once you're comfortable with these guidelines, you'll be ready to tackle the challenges!