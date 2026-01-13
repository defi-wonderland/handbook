---
id: testing-guidelines
title: Testing Guidelines
sidebar_label: Testing Guidelines
---

# Testing Guidelines

Testing is the first line of defense against bugs and exploits. In systems that handle real value and compose across chains, tests aren't optional, they're how we sleep at night.

This guide explains how we test code in the Optimism ecosystem: the structure and conventions you must follow, what kinds of tests to write, how to organize them, and best practices for writing maintainable test suites.

We'll walk through:

- Linting rules and naming conventions enforced by our tooling
- File organization and test contract structure
- The types of tests you should write (unit, integration, fuzz, invariant)
- How to set up test environments with Foundry
- Best practices for writing clear, fast, and reliable tests
- Coverage and CI/CD expectations

By the end of this guide, you should be able to answer:

- What naming convention must my test functions follow?
- How should I structure my test files and contracts?
- What distinguishes a unit test from an integration test?
- How do I write a fuzz test, and when should I use one?
- How do I test cross-chain interactions and message passing?
- How do I write tests that pass linting and review on the first try?

Let's build confidence through tests.

---

## Linting and Structure

All tests in the OP Stack follow strict linting and organizational rules. These rules are enforced by custom linters and Forge tooling to ensure consistency, readability, and maintainability across the codebase.

Before writing any test, you must understand these rules. Tests that violate them will not pass CI.

---

### Function Naming Rules

All test functions must follow a specific naming pattern:

**General Format:**

```
<prefix>_<subject>_<condition>_<status>
```

**Components:**

| Part        | Description                                                   | Example                             |
| ----------- | ------------------------------------------------------------- | ----------------------------------- |
| `prefix`    | Test type: `test`, `testFuzz`, or `testDiff`                  | `test`, `testFuzz`                  |
| `subject`   | Function or feature being tested                              | `transfer`, `deposit`               |
| `condition` | Context or scenario (optional for success cases)              | `insufficientBalance`, `whenPaused` |
| `status`    | Outcome: `succeeds`, `reverts`, `fails`, `works`, `benchmark` | `succeeds`, `reverts`               |

---

**Linting Rules:**

| Rule                  | Description                                                                             | ✅ Correct                                                               | ❌ Incorrect                                |
| --------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------- |
| **doubleUnderscores** | Double underscores are not allowed                                                      | `test_transfer_succeeds`                                                 | `test__transfer_succeeds`                   |
| **camelCase**         | Each part separated by `_` must start with lowercase                                    | `test_transfer_insufficientBalance_reverts`                              | `test_Transfer_InsufficientBalance_reverts` |
| **partsCount**        | Must have exactly 3 or 4 parts                                                          | `test_transfer_succeeds`<br/>`test_transfer_insufficientBalance_reverts` | `test_transfer`                             |
| **prefix**            | Must start with `test`, `testFuzz`, or `testDiff`                                       | `test_transfer_succeeds`<br/>`testFuzz_deposit_succeeds`                 | `testSomething_succeeds`                    |
| **suffix**            | Must end with valid status keyword                                                      | `test_transfer_succeeds`<br/>`test_deposit_benchmark`                    | `test_transfer_worksAndFails`               |
| **failureParts**      | Tests ending with `reverts` or `fails` must have 4 parts (including a condition/reason) | `test_transfer_insufficientBalance_reverts`                              | `test_transfer_reverts`                     |

---

**Valid Status Keywords:**

- `succeeds` - Test expects successful execution
- `reverts` - Test expects a revert
- `fails` - Test expects a failure
- `works` - Test verifies functionality
- `benchmark` - Performance benchmark test
- `benchmark_<number>` - Numbered benchmark variant

---

**Examples:**

```solidity
// ✅ Correct - 3 parts, success case
function test_deposit_succeeds() public { }

// ✅ Correct - 4 parts, failure case with reason
function test_withdraw_insufficientBalance_reverts() public { }

// ✅ Correct - 4 parts, specific condition
function test_transfer_whenPaused_reverts() public { }

// ✅ Correct - fuzz test
function testFuzz_deposit_succeeds(uint256 amount) public { }

// ❌ Wrong - only 2 parts
function test_deposit() public { }

// ❌ Wrong - revert without condition
function test_deposit_reverts() public { }

// ❌ Wrong - capital letter after underscore
function test_Deposit_succeeds() public { }

// ❌ Wrong - double underscore
function test__deposit_succeeds() public { }

// ❌ Wrong - invalid prefix
function testSomething_deposit_succeeds() public { }
```

---

### Contract Naming Rules

Test contracts follow a hierarchical naming pattern based on their purpose:

| Type                    | Pattern                               | Purpose                                      | Example                                   |
| ----------------------- | ------------------------------------- | -------------------------------------------- | ----------------------------------------- |
| **Initialization**      | `<ContractName>_TestInit`             | Reusable setup/initialization logic          | `OptimismPortal2_TestInit`                |
| **Function-specific**   | `<ContractName>_<FunctionName>_Test`  | Tests for a single function                  | `OptimismPortal2_DepositTransaction_Test` |
| **Uncategorized**       | `<ContractName>_Uncategorized_Test`   | Miscellaneous tests that don't fit elsewhere | `OptimismPortal2_Uncategorized_Test`      |
| **Integration**         | `<ContractName>_Integration_Test`     | Integration-level testing across contracts   | `OptimismPortal2_Integration_Test`        |
| **Harness**             | `<ContractName>_Harness`              | Basic test harness exposing internals        | `OptimismPortal2_Harness`                 |
| **Specialized Harness** | `<ContractName>_<Descriptor>_Harness` | Specialized harness variant                  | `OptimismPortal2_Upgradeable_Harness`     |

---

**Example:**

```solidity
// Base initialization contract
contract OptimismPortal2_TestInit is Test {
    OptimismPortal2 portal;

    function setUp() public {
        portal = new OptimismPortal2();
    }
}

// Function-specific test contract
contract OptimismPortal2_DepositTransaction_Test is OptimismPortal2_TestInit {
    function test_depositTransaction_succeeds() public {
        // Test implementation
    }

    function test_depositTransaction_insufficientGas_reverts() public {
        // Test implementation
    }
}

// Another function-specific test contract
contract OptimismPortal2_FinalizeWithdrawal_Test is OptimismPortal2_TestInit {
    function test_finalizeWithdrawal_succeeds() public {
        // Test implementation
    }
}
```

---

### File Organization Rules

Test files must follow strict organization rules:

| Aspect                  | Rule                                                                             | Example                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Location**            | Must be in `test/` directory and end with `.t.sol`                               | `test/L1/OptimismPortal2.t.sol`                                                                                        |
| **Source Match**        | Each test file must correspond to a file in `src/`                               | `test/L1/OptimismPortal2.t.sol` → `src/L1/OptimismPortal2.sol`                                                         |
| **Contract Name**       | Test contract name must match the filename (without extension)                   | File: `OptimismPortal2.t.sol`<br/>Contract: `OptimismPortal2_TestInit`                                                 |
| **Function Validation** | The function referenced in test contract names must exist in the source contract | If you have `OptimismPortal2_DepositTransaction_Test`, then `depositTransaction()` must exist in `OptimismPortal2.sol` |
| **Directory Structure** | Mirror the `src/` directory structure in `test/`                                 | `src/L1/OptimismPortal2.sol` → `test/L1/OptimismPortal2.t.sol`<br/>`src/L2/L1Block.sol` → `test/L2/L1Block.t.sol`      |

---

### File Structure Pattern

Every test file should follow this standard layout:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

// 1. Forge imports
import { Test } from "forge-std/Test.sol";

// 2. Testing utilities
import { TestUtils } from "test/utils/TestUtils.sol";

// 3. Scripts (if needed)
import { Deploy } from "scripts/Deploy.s.sol";

// 4. Interfaces
import { IOptimismPortal } from "interfaces/L1/IOptimismPortal.sol";

// 5. Libraries
import { Types } from "libraries/Types.sol";

// 6. Contracts being tested
import { OptimismPortal2 } from "src/L1/OptimismPortal2.sol";

/// @title OptimismPortal2_TestInit
/// @notice Shared initialization and setup for OptimismPortal2 tests
contract OptimismPortal2_TestInit is Test {
    // State variables
    OptimismPortal2 public portal;
    address public alice;
    address public bob;

    // Constructor (if needed for complex setup)
    constructor() { }

    /// @notice Set up the test environment
    function setUp() public virtual {
        // Deploy contracts
        portal = new OptimismPortal2();

        // Set up test accounts
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        // Fund accounts
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
    }

    /// @notice Helper function example
    function _createDepositTransaction() internal returns (bytes memory) {
        // Helper logic
    }
}

/// @title OptimismPortal2_DepositTransaction_Test
/// @notice Tests for the depositTransaction function
contract OptimismPortal2_DepositTransaction_Test is OptimismPortal2_TestInit {
    /// @notice Tests successful deposit
    function test_depositTransaction_succeeds() public {
        // Test implementation
    }

    /// @notice Tests deposit with insufficient gas
    function test_depositTransaction_insufficientGas_reverts() public {
        // Test implementation
    }

    /// @notice Fuzz test for deposit amounts
    function testFuzz_depositTransaction_succeeds(uint256 amount) public {
        // Fuzz test implementation
    }
}

/// @title OptimismPortal2_FinalizeWithdrawal_Test
/// @notice Tests for the finalizeWithdrawal function
contract OptimismPortal2_FinalizeWithdrawal_Test is OptimismPortal2_TestInit {
    function test_finalizeWithdrawal_succeeds() public {
        // Test implementation
    }

    function test_finalizeWithdrawal_alreadyFinalized_reverts() public {
        // Test implementation
    }
}
```

---

### Example: Real File Structure

Here's how `OptimismPortal2.t.sol` is organized in practice:

```
test/L1/OptimismPortal2.t.sol
│
├─ SPDX and pragma
├─ Imports (grouped by category)
│   ├─ Forge imports
│   ├─ Testing utilities
│   ├─ Scripts
│   ├─ Interfaces
│   ├─ Libraries
│   └─ Contracts
│
├─ OptimismPortal2_TestInit
│   ├─ State variables
│   ├─ Constructor (if needed)
│   ├─ setUp() function
│   └─ Helper functions
│
├─ OptimismPortal2_DepositTransaction_Test
│   ├─ test_depositTransaction_succeeds()
│   ├─ test_depositTransaction_insufficientGas_reverts()
│   └─ testFuzz_depositTransaction_succeeds()
│
├─ OptimismPortal2_FinalizeWithdrawal_Test
│   ├─ test_finalizeWithdrawal_succeeds()
│   └─ test_finalizeWithdrawal_alreadyFinalized_reverts()
│
└─ OptimismPortal2_Integration_Test
    └─ Integration tests
```

---

## Types of Tests

Now that you understand the structure and naming rules, let's dive into what kinds of tests to write.

:::note Real Organization in the Monorepo

In practice, the Optimism monorepo does **not separate unit and integration tests into different folders** (`test/unit/` and `test/integration/`). Instead, **both types of tests coexist in the same `.t.sol` file**, distinguished only by the test contract name:

- `OptimismPortal2_DepositTransaction_Test` - unit tests for a specific function
- `OptimismPortal2_Integration_Test` - integration tests for the same contract

**Special Case: L1 Contracts**

L1 contracts are a different case since they have **upgrade tests** that use a defined OPCM (OP Contracts Manager) version, which adds additional complexity. These tests:

- Reuse the same test files
- Selectively skip tests that are impossible to run in certain contexts
- Have a more complex structure due to upgrade requirements

This practice differs from other projects (like Wonderland) where there is physical separation between unit and integration test folders. Optimism's current convention favors **logical grouping by contract** over physical separation by test type.

:::

### Unit Tests

Unit tests verify individual functions or components in isolation. They should be fast, deterministic, and focused on a single behavior.

**What to test:**

- Pure functions and state transitions
- Edge cases and boundary conditions
- Error handling and revert conditions
- Access control and authorization logic

**Example:**

```solidity
contract OptimismPortal2_DepositTransaction_Test is OptimismPortal2_TestInit {
    function test_depositTransaction_succeeds() public {
        // Setup
        uint256 value = 1 ether;
        uint64 gasLimit = 100_000;

        // Execute
        vm.prank(alice);
        portal.depositTransaction{value: value}(bob, value, gasLimit, false, bytes(""));

        // Assert
        assertEq(address(portal).balance, value);
    }

    function test_depositTransaction_insufficientValue_reverts() public {
        vm.expectRevert("Insufficient value");
        portal.depositTransaction(bob, 1 ether, 100_000, false, bytes(""));
    }
}
```

---

### Integration Tests

Integration tests verify how multiple components work together. They test real interactions between contracts, message passing, and system-level behaviors.

**What to test:**

- Cross-contract interactions
- Message passing between L1 and L2
- Bridge flows (deposits, withdrawals)
- Upgrade and migration scenarios

**Example:**

```solidity
contract Bridge_Integration_Test is Test {
    function test_depositAndWithdraw_succeeds() public {
        // Deposit on L1
        l1Bridge.deposit{value: 1 ether}(alice);

        // Relay message to L2
        _relayMessageToL2();

        // Verify balance on L2
        assertEq(l2Token.balanceOf(alice), 1 ether);

        // Withdraw back to L1
        vm.prank(alice);
        l2Bridge.withdraw(1 ether);

        // Finalize on L1
        _finalizeWithdrawal();

        // Verify final state
        assertEq(alice.balance, 1 ether);
    }
}
```

---

### Fuzz Tests

Fuzz tests run your code against randomly generated inputs to find unexpected edge cases and vulnerabilities.

**When to use fuzz tests:**

- Math-heavy functions (overflow, underflow, precision)
- Parsing and validation logic
- State machines with multiple valid transitions
- Anywhere you're unsure what inputs could break your assumptions

**Naming:** Must use `testFuzz` prefix.

**Example:**

```solidity
contract OptimismPortal2_DepositTransaction_Test is OptimismPortal2_TestInit {
    function testFuzz_depositTransaction_succeeds(uint256 amount, uint64 gasLimit) public {
        // Constrain inputs to valid ranges
        vm.assume(amount > 0 && amount <= 100 ether);
        vm.assume(gasLimit >= 21_000 && gasLimit <= 10_000_000);

        // Execute
        vm.deal(alice, amount);
        vm.prank(alice);
        portal.depositTransaction{value: amount}(bob, amount, gasLimit, false, bytes(""));

        // Assert invariant
        assertEq(address(portal).balance, amount);
    }
}
```

**Best practices:**

- Use `vm.assume()` to constrain inputs to valid ranges
- Test invariants that should hold for all inputs
- Start with broad ranges, narrow down if tests are slow

---

### Invariant Tests

Invariant tests (also called property-based tests) verify that certain properties always hold, even after arbitrary sequences of state changes.

**Example:**

```solidity
contract Token_Invariant_Test is Test {
    Token public token;
    Handler public handler;

    function setUp() public {
        token = new Token();
        handler = new Handler(token);
        targetContract(address(handler));
    }

    function invariant_totalSupplyEqualsSumOfBalances() public {
        assertEq(handler.sumOfBalances(), token.totalSupply());
    }
}
```

---

## Testing Tools

### Foundry

Foundry is the primary testing framework for Solidity contracts in the OP Stack. It's fast, gas-efficient, and has excellent tooling for fuzzing and invariant testing.

**Key commands:**

```bash
forge test                           # Run all tests
forge test --match-test testName     # Run specific test
forge test --match-contract ContractName  # Run tests in specific contract
forge test -vvv                      # Verbose output with stack traces
forge test --gas-report              # Show gas usage
forge coverage                       # Generate coverage report
forge snapshot                       # Create gas snapshot
```

**Useful flags:**

- `-vv` - Show console.log output
- `-vvv` - Show stack traces for failures
- `-vvvv` - Show stack traces for all tests
- `--gas-report` - Display gas usage per function

---

**Cheat codes:**

Foundry provides powerful cheat codes for test manipulation:

```solidity
// Identity and permissions
vm.prank(address)           // Set msg.sender for next call
vm.startPrank(address)      // Set msg.sender for all subsequent calls
vm.stopPrank()              // Stop the active prank

// Expectations
vm.expectRevert()           // Expect next call to revert
vm.expectRevert(bytes)      // Expect revert with specific error
vm.expectEmit(true, true, true, true)  // Expect specific event

// Time manipulation
vm.warp(timestamp)          // Set block.timestamp
vm.roll(blockNumber)        // Set block.number

// Balance manipulation
vm.deal(address, amount)    // Set ETH balance
deal(token, address, amount) // Set ERC20 balance

// State snapshots
uint256 snapshot = vm.snapshot()  // Save state
vm.revertTo(snapshot)       // Restore state

// Mocking
vm.mockCall(address, calldata, returndata)  // Mock contract call
vm.etch(address, bytecode)  // Set contract bytecode

// Utilities
makeAddr(string)            // Generate deterministic address
```

---

## Best Practices

### Test Organization

**Keep related tests together:**
Group tests by function in dedicated test contracts. This makes it easy to find tests and ensures proper inheritance from the init contract.

**Use descriptive names:**
Your test name should tell you exactly what it's testing and what the expected outcome is.

```solidity
// ✅ Good - clear what's being tested
function test_depositTransaction_whenPaused_reverts() public { }

// ❌ Bad - unclear what this tests
function test_deposit1() public { }
```

---

### Writing Clear Tests

**Good test structure: Arrange, Act, Assert**

```solidity
function test_withdraw_succeeds() public {
    // Arrange - set up test state
    vm.deal(alice, 10 ether);
    vm.prank(alice);
    portal.deposit{value: 1 ether}();

    // Act - execute the action
    vm.prank(alice);
    portal.withdraw(1 ether);

    // Assert - verify the outcome
    assertEq(address(portal).balance, 0);
    assertEq(alice.balance, 10 ether);
}
```

---

### Performance

**Keep tests fast:**

- Use `setUp()` to avoid repeated initialization
- Don't deploy contracts in every test if they can be shared
- Use gas snapshots to track gas costs over time (`forge snapshot`)
- Foundry runs tests in parallel by default

---

### Common Pitfalls

**Avoid:**

- Testing implementation details instead of behaviors
- Tests that depend on execution order
- Hardcoding addresses or magic numbers without explanation
- Skipping negative test cases
- Not constraining fuzz inputs properly

**Do:**

- Test what the contract does, not how it does it
- Make tests independent and isolated
- Use named constants for magic values
- Test both success and failure paths
- Use `vm.assume()` in fuzz tests to ensure valid inputs

---

## Coverage

Coverage measures what percentage of your code is executed during tests. It's a useful metric, but not the only measure of test quality.

**Good coverage targets:**

- Core contracts: 95%+ line coverage
- Peripheral contracts: 85%+ line coverage
- Critical paths: 100% coverage

**Generate coverage:**

```bash
forge coverage
forge coverage --report lcov  # Generate lcov report for tools
```

**What coverage doesn't tell you:**

- Whether your tests are actually testing the right things
- Whether edge cases are properly covered
- Whether invariants hold
- Whether the tests would catch real bugs

Coverage is necessary but not sufficient. Aim for high coverage, but also think critically about what you're testing.

---

## Examples

### Testing a Deposit Flow

```solidity
contract OptimismPortal2_DepositTransaction_Test is OptimismPortal2_TestInit {
    function test_depositTransaction_succeeds() public {
        uint256 value = 1 ether;
        uint64 gasLimit = 100_000;

        vm.expectEmit(true, true, false, true);
        emit TransactionDeposited(alice, bob, 0, value, gasLimit, false, bytes(""));

        vm.prank(alice);
        portal.depositTransaction{value: value}(bob, value, gasLimit, false, bytes(""));

        assertEq(address(portal).balance, value);
    }

    function test_depositTransaction_insufficientGas_reverts() public {
        vm.expectRevert("Gas limit too low");
        portal.depositTransaction(bob, 1 ether, 10_000, false, bytes(""));
    }

    function testFuzz_depositTransaction_succeeds(uint256 value, uint64 gasLimit) public {
        vm.assume(value > 0 && value <= 100 ether);
        vm.assume(gasLimit >= 21_000 && gasLimit <= 10_000_000);

        vm.deal(alice, value);
        vm.prank(alice);
        portal.depositTransaction{value: value}(bob, value, gasLimit, false, bytes(""));

        assertEq(address(portal).balance, value);
    }
}
```

---

### Testing Cross-Chain Messages

```solidity
contract CrossDomainMessenger_Integration_Test is Test {
    function test_sendMessage_relaysToL2_succeeds() public {
        bytes memory message = abi.encodeCall(target.execute, (data));

        // Send message from L1
        vm.prank(sender);
        l1Messenger.sendMessage(address(target), message, gasLimit);

        // Simulate relayer processing
        vm.prank(address(l2Messenger));
        target.execute(data);

        // Verify state change on L2
        assertTrue(target.executed());
    }
}
```

---

## Resources

- [Foundry Book](https://book.getfoundry.sh/) - Complete Foundry documentation
- [Foundry Cheatcodes Reference](https://book.getfoundry.sh/cheatcodes/) - All available cheat codes
- [OP Stack Test Examples](https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts-bedrock/test) - Real test files from the monorepo

---

> **Contributing**: These guidelines evolve as we learn. If you find better patterns or want to add examples, open a PR.
