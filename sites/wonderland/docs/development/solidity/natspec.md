# Natspec

[NatSpec comments](https://docs.soliditylang.org/en/latest/natspec-format.html) are an essential part of writing clean, maintainable, and well-documented Solidity code. They are critical not only for security reviewers but also for other developers and users interacting with your contracts. Additionally, tools like `forge doc` and `Etherscan` can parse NatSpec comments to generate documentation, making function parameters, return values, and contract behavior easier to understand. 

Wonderland is relying on `lintspec` to enforce the adoption of high-quality NatSpec comments and catch issues early. It comes with sensible defaults and helps us to:

- Ensure that all constructors, variables, functions, structs, errors, events, and modifiers have proper NatSpec comments.
- Find and report misspelled or missing `@param` or `@return` annotations.
- Verify that public and external functions include the `@inheritdoc` tag when inheriting documentation from base contracts.

NatSpec's machine-readability coupled with [`lintspec`](https://github.com/beeb/lintspec) allows us to enforce completeness and consistency, ensuring that documentation is both comprehensive and aligned with the contract’s actual functionality.

The tool is suitable for use on both [interfaces](https://github.com/defi-wonderland/solidity-foundry-boilerplate/blob/main/src/interfaces/IGreeter.sol
) and [contracts](https://github.com/defi-wonderland/solidity-foundry-boilerplate/blob/main/src/contracts/Greeter.sol
).
