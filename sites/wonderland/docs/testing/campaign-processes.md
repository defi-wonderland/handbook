# Testing Processes

## Guidelines summary: what do we do?

This article describes the guidelines we're following for all things testing related. These are based on various sources and exchange with other projects (partners or not). As they are relying on tools which are actively being developed, they are not set in stone and will continue to evolve.

We have built these guidelines for every Wonderland member to follow. As we are contributing to many codebases, it became important for us to adopt a "Wonderland style" (see the related  solidity best practices article). Having a consistent way of writing tests ensures homogeneity (to a certain degree at least), which, in turn, allows us to easily study, compare and update our practices, for the whole organisation.

## Responsibilities: who does it?

### Continuous Quality Assurance (QA), which includes:

- **Unit Tests**
- **Integration Tests**
- **End-to-End (E2E) Tests (if applicable)**

Who? Every solidity developer is responsible for these.

### Advanced Testing (AT), including

- **Invariant/property based fuzzing**
- **Formal Verification: Symbolic Execution**

Who? Advanced testing team - this is a team whose sole focus is complex test design and implementation (ideally, one member of this team has been working on the project as a developer)

### **Protocol properties/invariant collection**

Sliding responsibility, based on the timeline (research/design team, then team lead/developers)

## Timeline: when do we do it?

- Before development:
    - Collect our first protocol properties
- During development:
    - Write unit tests
    - Write integration tests
    - Update protocol properties
- At the end of development:
    - Internal review
    - Advanced testing:
        - Finish collecting properties
        - Fuzzing campaigns
        - (Symbolic execution)

## Guidelines: how do we do it?

### Design Phase:

While the project is still being defined and refined, we start preparing the advanced tests by collecting some invariants. This initial collection is often a first draft, as many of these invariants might still change during the development.

### Implementation Phase

- **Unit Tests (QA)**
    - Unit tests *must* be implemented continuously, cross-testing is recommended, with developer A implementing the logic and developer B writing the unit tests.
    - Aim for path coverage if the logic has few independent conditions; otherwise, branch coverage is preferred.
    - Tools like Bulloak *might* be used for listing branches/conditions to test.
    - Good unit tests *must* have a comprehensive branch test in addition to a high coverage, tending toward 100% by the end of the implementation phase.
    - CI *might* have an action to enforce a non-inferior branch coverage on new PRs.
    - Tests which are not implemented *must* use `vm.skip(true)`, and must NOT be commented out or left as an empty body. The linter should prohibit empty blocks in tests.
    - Unit tests *must* be solitary tests, testing only one part of the logic and mocking the rest.
    - The whole range of values leading to the same behaviour should be used in fuzzed parameters.
    - Only one path should be tested at a time, especially when using fuzzed inputs.
    - Forge being efficient, the number of runs made by the fuzzer shouldn't be reduced below the default 1000 (if tests are taking too long to run with this value, then a design fault should be suspected)
    - Use forge-std's `bound` when there is more than a single value to exclude from the fuzzed value. `vm.assume` should be avoided as much as possible, or only to exclude a single value, like `address(0)` for instance (attention should be made to multiple "hidden" assumes)

**Example:**

```solidity
function foo(uint256 input) external {
    return input < 10;
}

function test_foo_whenInputLesserThanTen(uint256 inputToTest) external {
    inputToTest = bound(inputToTest, 0, 9);
    assertTrue(foo(inputToTest));
}

function test_foo_whenInputGTETen(uint256 inputToTest) external {
    inputToTest = bound(input, 10, type(uint256).max);
    assertFalse(foo(inputToTest));
}

// And NOT (testing 2 paths)
function test_foo(uint256 inputToTest) external {
    if(inputToTest < 10) assertTrue(foo(inputToTest));
    else assertFalse(foo(inputToTest));
}

```

**Counter-example - assume and low runs:**

> Note: This example would show a case where using vm. Assuming with low runs can lead to incorrect conclusions about the non-existence of multiples of 10.

- **Integration Tests (QA)**:
    - They *should* be conducted during development (top-down with stubs/bottom-up with drivers), this avoids having a test debt at the end of the project and helps find potential high-level bugs along the way.
    - If the protocol interacts with other external contracts, they should be run on a fork of the relevant network, at a set block height, using `createSelectFork(string calldata urlOrAlias, uint256 block)` or `createSelectFork(string calldata urlOrAlias, bytes32 transaction)`.
    - Integration tests should be conducted following user stories, leading from an entry point A to an end-state B. They are therefore stateful and have multiple transactions.
- **E2E Tests (QA)**:
    - These are considered *optional*,* as they might be less relevant in some projects (for instance, strictly onchain deliverable versus bridge with heavy onchain dependencies)
    - They *might* be horizontal E2E from entry point to end-state, or vertical across the stack if significant logic is performed off-chain.
- **Differential Testing (QA)**: differential testing *should* be performed during refactor (e.g., using Forge snapshot for gas comparison).
- **Slither in CI**: Consider adding Slither to the CI workflow, but be mindful of potential codebase clutter from skip comments. Care is to be taken not to be over-sensitive; better to have a few real positives than a lot of false negatives. Setting on failing on high or medium severities *might* help in this regard.
- **slither-mutate (coming with medusa/echidna) or [vertigo-rs](https://github.com/RareSkills/vertigo-rs)**: both are still in development, it *might* provide an extra safety net, without creating a huge overhead. It *may* be run occasionally against the whole test suite, uncovering untested logic. For instance, after installing slither, just run `slither-mutate path/to/contract/contract.sol-- test-cmd yarn test:unit` or the python invocation of vertigo (the "rs" means RareSkills, not Rust…)

### Pre and during internal review

- **Properties & Invariants Documentation**:
    - A (short) brainstorm session *might* be scheduled, to finalize the list of invariants which will be studied
    - An actor-based approach *might* be used, to keep the focus on higher level invariants
    - The testing team lead *must* compile the properties in a table in `src/test/invariant/PROPERTIES.md`. This file must include at least three columns:
        - **Id:** A sequential number.
        - **Properties**: Clear, concise English descriptions.
        - Covered: An empty check box
        - A fourth column *might* be used, for classification purposes:
            - **Type**: Categorise using [Certora's categories](https://github.com/Certora/Tutorials/blob/master/06.Lesson_ThinkingProperties/Categorizing_Properties.pdf):
                - Valid state: The protocol can only be in valid states based on the spec.
                - State transition: Protocol state changes follow specific orders or conditions.
                - Variable transition: Protocol variables change in defined ways.
                - High-level property: Properties of the system as a whole.
                - Unit test: Target specific functions for detailed examination.

Example

```markdown
| Id | Properties                                        | Type       | Covered|
|----|---------------------------------------------------|------------|--------|
| 1  | Total supply should be the contract's ETH balance | High level |   [ ]  |
| 2  | Transfer between addresses shouldn't modify supply| High level |   [ ]  |
```

- **Invariant Implementation (QA/AT)**: The lead/advanced tester *must* implement the invariants starting from higher-level to lower-level properties in the `PROPERTIES.md` file. Complex protocols may require deployment tricks for Medusa.
- **Echnidna/Medusa (AT)**: *should* be used for stateful testing, using the coverage (HTML autogenerated) to discover additional properties.
- **Kontrol / Halmos (AT)**: *might* be used for formal verification (symbolic execution or using K formalism)
- Any finished campaign *must* be run for at least a couple of weeks on the dedicated server
- **CI Workflow (AT)**:
    - Medusa and Halmos/Kontrol *should* be in the CI workflow, once the advanced tests are finalised.
    - Mutation tests *might* be used as testing suite validation tools, granted *the branch coverage is 100%.*

## Repo organisation: How do we keep sanity?

```
.
├── src/
│   └── MyContract.sol
└── test/
    ├── unit/
    │   ├── Foo.t.sol
    │   ├── Bar.t.sol
    │   └── MyContract.tree
    ├── integration/
    │   └── MyContract.t.sol
    ├── E2E/
    │   └── MyContract.t.sol
    └── invariants/
        ├── PROPERTIES.md
        ├── fuzz/
        |   ├── handlers/
        |   |   ├── HandlerA.sol
		    |   |   ├── HandlerAgents.sol
		    |   |   └── HandlerParent.sol
        |   ├── properties/
        |   |   ├── PropertiesA.sol
		    |   |   └── PropertiesParent.sol
        │   ├── FuzzTest.t.sol
        │   ├── Reproducers.t.sol
        |   └── Setup.sol
        └── symbolic/
            └── KontrolTest.t.sol
```

Contract name *should* reflect the test technique used, `contract UnitMyContract` for instance.