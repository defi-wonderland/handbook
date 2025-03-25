# Natspec

NatSpec comments are an essential part of writing clean, maintainable, and well-documented Solidity code. They are critical not only for internal and external auditors but also for other developers and users interacting with your contracts. Additionally, tools like `forge doc` and `Etherscan` can parse NatSpec comments to generate documentation, making function parameters, return values, and contract behaviour easier to understand. 

More importantly, NatSpec's machine-readability coupled with `natspec-smells`  allows us to enforce completeness and consistency, ensuring that documentation is both comprehensive and aligned with the contract’s actual functionality. This not only improves clarity but also helps catch missing or inaccurate details.

## **Tool**

To enforce the adoption of high-quality NatSpec comments and catch issues early, Wonderland has developed the NatSpec-Smells tool: https://github.com/defi-wonderland/natspec-smells. Some features are:

- Ensures that all constructors, variables, functions, structs, errors, events, and modifiers have proper NatSpec comments.
- Finds and reports misspelled or missing @param or @return annotations.
- Verifies that public and external functions include the @inheritdoc tag when inheriting documentation from base contracts.

**Some examples:**

Interface with NatSpec: https://github.com/defi-wonderland/solidity-foundry-boilerplate/blob/main/src/interfaces/IGreeter.sol

Contract with NatSpec: https://github.com/defi-wonderland/solidity-foundry-boilerplate/blob/main/src/contracts/Greeter.sol