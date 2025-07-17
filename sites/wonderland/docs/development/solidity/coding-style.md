# Coding Style

To ensure uniformity across different teams and projects, we follow a specific coding style for Solidity. We use [solhint-community](https://github.com/solhint-community/solhint-community) for linting Solidity code. 

:::tip
If a partner requests it, we will use the style they prefer.
:::

Below are the basic rules applied to all of our Solidity projects:

**Reference**: https://github.com/defi-wonderland/solidity-foundry-boilerplate/blob/main/.solhint.json

```json
{
  "extends": "solhint:recommended",
  "rules": {
    "compiler-version": ["warn"],
    "quotes": "off",
    "func-visibility": ["warn", { "ignoreConstructors": true }],
    "no-inline-assembly": "off",
    "no-empty-blocks": "off",
    "private-vars-leading-underscore": ["warn", { "strict": false }],
    "ordering": "warn",
    "avoid-low-level-calls": "off",
    "named-parameters-mapping": "warn"
  }
}
```

## Additional Principles

In addition to Solhint rules, Wonderland employs several additional principles to maintain clean, readable, and maintainable code.

### Code Organization

Always separate interfaces from contracts.

### **Import Syntax**:

Always use named imports, to avoid inadvertedly bringing into scope all names defined in a package :

✅ Do:

```solidity
import {IERC20, ERC20} from '@libraries/ERC20.sol';
```

❌ Don’t:

```solidity
import '@libraries/ERC20.sol';
```

- Minimize imports by grouping related items from a single file.
- Use remappings for clarity and maintainability instead of relative paths.

✅ Do:

```solidity
import {IERC20, ERC20} from '@libraries/ERC20.sol';
```

❌ Don’t:

```solidity
// No remappings, not grouped imports
import {IERC20} from '../../@libraries/ERC20.sol';
import {ERC20} from '../../@libraries/ERC20.sol';
```

### **Import Order:**

1. External Libraries
2. Internal Libraries
3. Local Interfaces
4. Local Contracts

### Naming Conventions

**Variable Naming**

State Variables

- **Immutable** and **Constant** Variables: Use `UPPERCASE_SNAKE_CASE`**.**
- **Public** and **External** Variables: Use `camelCase`.
- **Private** and **Internal** Variables: Use `_camelCase`, prefixed with an underscore `_`.

Local Variables

- Use `_camelCase`, starting with an underscore `_`.

Function Arguments and Return Values

- Function arguments and return value names should use `_camelCase` and always start with an underscore `_`.

Interface Naming: 

- Interfaces must always start with the letter `I` (e.g., `IUserRegistry`).

### Events

- **Naming**: Events should always be named in the **past** tense.
- **Definition:** Always define events in the contract interface.
- **Standard:** Always emit events when storage or state is changed.

### Errors

- **Naming**: Errors should be prefixed with the contract name and use `CapWords` style.
- **Definition**: Errors must be defined in interfaces whenever possible.

### Structs & Enums

- **Naming**: Structs and Enums should be named using the `CapWords` style
- **Definition**: Always define Structs and Enums in the interface.