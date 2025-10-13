# Property-based fuzzing

We use Forge's Foundry for our fuzzing campaigns, using coverage guidance and corpus persistence (require forge v1.3.0 or higher).

## File structure

We follow an inheritance pattern to standardize the creation of a new forge invariant testing suite, even tho if some contracts are empty when not needed. It includes:

- `Setup` deploys the protocol, the handlers, initialize what's needed, *set the target contract and/or selectors*
- `Invariant` inherits from `Setup` and contains the invariant to test (as *view functions*, notice the reverting call bubbling up pattern for this)
- `HandlersTarget` inherits from all the handlers, with the target contract as constructor argument
- `handlers/HandlerFoo` inherits from `HandlersTarget` and contains the handler for the foo function
- `ExecutionPaths` inherits from `Setup` and contains regular (non-invariants) test funciton to test complete execution paths (see below)

optional, mostly based on the overall complexity of the project:

- `handlers/BaseHandler` contains common helper functions for the handler, or project agnostic handlers (ie `handler_warp` for instance).
- `handlers/GhostStorage` contains the ghost variables and related helper functions

Here is a visual representation of the structure above.

```solidity
// Invariants and setup:
// ./test/invariants/fuzz/Setup.t.sol
Setup is Test {
    function setUp() public {
        myContractToTest = new MyContractToTest();
        handlers = new HandlersTarget(myContractToTest);

        (...)
        
        targetContract(address(handlersTarget));

        // Target chosen selectors only - useful when inheriting Test for instance
        bytes4[] memory selectors = new bytes4[](2);
        selectors[0] = bytes4(keccak256("foo()"));
        selectors[1] = bytes4(keccak256("bar()"));
        targetSelectors(FuzzSelector({ addr: address(anotherHandler), selectors: selectors }));
    }
}

// ./test/invariants/fuzz/Invariant.t.sol
Invariant is Setup {
    function invariant_myInvariant() public view {
        if(handlers.failedTx()) assertEq(...);
        else assertEq(...);
    }

    function test_reproducer() public {
        // A reproducer to debug a failing invariant, forge --mt test_reproducer
    }
}

// -------------------------------------
// Handlers:

// ./test/invariants/fuzz/HandlersTarget.t.sol
HandlersTarget is HandlerFoo {
    constructor(MyContractToTest _myContractToTest) BaseHandler(_myContractToTest) {}
}

// ./test/invariants/fuzz/handlers/HandlerFoo.t.sol
HandlerFoo is BaseHandler {
    function handler_foo() public {
        try myContractToTest.foo() {
            failedTx = false;
            ghost_fooBar = ...;
        } catch {
            failedTx = true;
        }
    }
}

// ./test/invariants/fuzz/handlers/BaseHandler.t.sol
BaseHandler is GhostStorage {
    MyContractToTest public myContractToTest;

    constructor(MyContractToTest _myContractToTest) {
        myContractToTest = _myContractToTest;
    }

    function handler_warp(uint256 _delta) public {
        vm.warp(block.timestamp + _delta);
    }
}

// ./test/invariants/fuzz/handlers/GhostStorage.t.sol
GhostStorage {
    uint256 public ghost_fooBar;
    bool public failedTx;
}

```

## Contracts and functions

For forge to properly pick the invariant to test up, they need the `invariant_` prefix. Handler prefix are used for clarity (they *need* to be targeted in the Setup's `targetSelectors`), same as for ghost variables.

## Coverage estimation and execution paths

Having view functions to check invariant allows to circumvert one of Forge invariant test current limitation, which is the lack of coverage metric. To validate our test suite, we use an extra-contract, `ExecutionPaths`, which guides us during handler implementation and allow to demonstrate that our paths are executable (ie not silently reverting).

`ExecutionPaths` inherits from `Setup` (ie inherits all the handlers) and is then used to implement regular forge test (`test_`), using only handlers. These tests are recreating a known execution path, and have assertion along the way, to insure the handlers are all working.

Example taken from the Canon Guard contract:

```solidity
  /// @notice Test pre-approved transaction with short delay
  /// @dev Path: approve → queue → warp(SHORT_DELAY) → approve hashes → execute
  function test_preApprovedPath_SimpleActions() public {
    // 1. Queue SimpleActions (which internally approves it)
    handlersTarget.handler_queueSimpleAction(100 days);

    // 2. Verify it was queued as pre-approved
    address[] memory queuedBuilders = handlersTarget.canonGuard().getQueuedActionBuilders();
    assertEq(queuedBuilders.length, 1, 'Should have 1 queued transaction');

    address builder = queuedBuilders[0];
    (,, uint256 executableAt,, bool isPreApproved) = handlersTarget.canonGuard().transactionsInfo(builder);
    assertTrue(isPreApproved, 'Should be pre-approved');

    // 3. Warp past SHORT_TX_EXECUTION_DELAY
    handlersTarget.handler_warp(executableAt + 1);

    // 4. Approve hash with 3 signers (threshold)
    handlersTarget.handler_approveHash(0, 0); // signer[0] approves hash[0]
    handlersTarget.handler_approveHash(1, 0); // signer[1] approves hash[0]
    handlersTarget.handler_approveHash(2, 0); // signer[2] approves hash[0]

    // 5. Execute successfully
    handlersTarget.handler_executeTransaction(0); // Use seed 0 to select first transaction

    // 6. Verify execution succeeded (queue should be empty)
    queuedBuilders = handlersTarget.canonGuard().getQueuedActionBuilders();
    assertEq(queuedBuilders.length, 0, 'Queue should be empty after execution');
  }
```

This tests allow to quickly debug handlers when writing them, as well as create lcov files.

## Toml configutaiton

Invariants have their own profile in foundry.toml, a few important (non-default) values needs to be set to fully leverage Forge. `corpus_dir` not only will set the directory where the corpus will be saved, but also will activate coverage guidance - it should always be set. `show_solidity` is useful to quickly copy-paste the failing sequence in a reproducing test (in the `Invariant` contract, as a `test_` function).

```toml
[invariant]
timeout = 100 # Will run the invariant for 100 seconds
depth = 500 # Each sequence will have maximum 500 calls
show_metrics = true # Display metrics during the run (useful to check if stale)
fail_on_revert = true # If no revert is expected, this can be set to true (ie non-reverting invariants are covering everything)
corpus_dir = 'cache/corpus' # set the corpus directory
show_solidity = true # Once a failing invariant is found, display the solidity of the failing sequence (ie copy-pasteable in a reproducing test)
```

## Tips and tricks

- Call probability distribution can (fairly) easily be tweaked by using a helper contract - the fuzzer will call all function from all targeted contracts with the same probability, to skew this, a "middle-biasing-men" contract needs to be used.

Example if we want to call 75% of the time the foo handler (in HandlerABC) and 25% of the time the bar function (in HandlerDEF) - note how this should be done accross *all* target contracts:

```solidity
contract HandlerCall is HandlerABC, HandlerDEF {
    function callFooOne() public {
        handler_foo(); // From HandlerABC
    }

    function callFooTwo() public {
        handler_foo();
    }

    function callFooThree() public {
        handler_foo();
    }

    function callBar() public {
        handler_bar(); // From HandlerDEF
    }
}
```

- Regularly review the execution paths contract to assess if you're testing what should be tested

- if there is an external dependency with a hardcoded address, you can use Forge confort of vm cheatcodes and etch it.

- When reviewing a PR for a fuzzing campaign, it’s crucial to run the fuzzer for a few minutes and check for coverage gaps in the assertion tests. It’s otherwise too easy to have tests silently skip most of the interesting stuff due to early reverts.

## Beyond writing tests

Having a good *and tidy* properties and invariant test suite is nice, but would be useless if it wasn’t being actively used. As the space the fuzzer has to explore grows (in the worst case scenario) exponentially, running fuzzing campaign for a decent amount of time is mandatory.

## Additional Resources

[Building secure contracts](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis/echidna), a Echidna tutorial.

[Solutions](https://github.com/crytic/echidna-streaming-series/tree/main) from the Trail of Bits youtube streams.
