# Property-based fuzzing

We use Medusa for fuzzing campaigns, as it's fast, saves the corpus used between campaigns and, unlike Echidna, supports Cancun.

Our most frequent testing mode is assertion-based external test. In other words, we deploy the target contract and interact with it from the test contract, instead of inheriting it.

Trail of Bits released a [hands-on tutorial on Echidna](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis/echidna), which is, for now, the entry-point for our Testers training. Medusa is similar to Echidna enough for the videos and tutorial to be useful, and they also provide the general fuzzing knowledge applicable to any framework.

We’ve build and use some additional tools build around Medusa, to ease the test-writing process:

- [Youdusa](https://github.com/defi-wonderland/youdusa-rs), to generate tests based on failed properties.
- [Medusa](https://github.com/defi-wonderland/medusa-gen-rs) template generator
- Trail of Bits has [a collection of properties](https://blog.trailofbits.com/2023/02/27/reusable-properties-ethereum-contracts-echidna/) for erc20/erc721/etc, these should be the standard to use when testing a contract relying on these standard (in addition to tests for any custom logic)

## File structure

We follow an inheritance pattern to standardize the creation of a new medusa testing suite, even tho if some contracts are empty when not needed. It includes:

- `FuzzTest` as the entry point for the suite
- `PropertiesParent` inherits all the properties children contracts, allows to divide them when needed
- `HandlerParent` inherits all the handlers children, which all track the ghost variables if applicable
- `HandlerAgent`
- `Setup` deploys the protocol and performs the necessary initialization
- `Reproducer` not deployed as standard contract, this is used to quickly debug failing properties, using Forge. It inherit the whole test suite (`FuzzTest` ’s child) but isn’t the fuzzing target.

```solidity
// ./test/invariant/fuzz/FuzzTest.t.sol
FuzzTest is PropertiesParent {}

// ./test/invariant/fuzz/properties/PropertiesParent.sol
PropertiesParent is PropertiesA, PropertiesB, etc

// ./test/invariant/fuzz/properties/PropertiesA.sol
PropertiesA is HandlersParent {}
PropertiesB is HandlersParent {}

// ./test/invariant/fuzz/handlers/HandlersParent.sol
HandlersParent is HandlerA, HandlerB, etc

HandlerA is Setup {}
HandlerB is Setup {}

// ./test/invariant/fuzz/Setup.sol
Setup is Test, Utils {}

// ./test/invariant/fuzz/utils/Utils.sol
(...)
```

Here is the visual representation of the structure above. Note that in a real project, handlers and properties will have different names, e.g. `HandlerStaking` and `PropertiesStaking` for a contract named `Staking`.

![Medusa tests inheritance](/img/fuzz-inheritance.jpg)

## Contracts and functions

Property functions should start with the prefix `property_`, while handler function should start with `handler_`. Properties are made to make an assumption, while handlers allows to expose some functions from the contract under test (with optional constraints or ghost variables, which should start with `ghost_`). `setup_` functions can be used for one-off

Do not forget to mark ghost or otherwise internal helper as `internal`, as it would be called by the fuzzer if public. Additionally, function selectors can be white- or black-listed in the medusa toml.

```solidity
// medusa fuzz --compilation-target ./test/invariant/fuzz/FuzzTest.t.sol --target-contracts "FuzzTest"

contract FuzzTest is PropertiesParent {
	// Foundry debug function
	function test_debug() public {
		counter.increment(89);
		assertEq(counter.count, 89);
	}
}

contract PropertiesParent is HandlersParent {
	function property_counterIsAccurate() public {
		assert(ghost_counter == counter.count());
	}
}

contract HandlersParent is Setup {
	uint256 internal ghost_counter;

	function handler_increment(uint256 howMuch) public {
		counter.increment(howMuch);
		ghost_counter += howMuch;
	}
}

contract Setup {
	Counter counter;

	constructor() {
		counter = new Counter();
	}
}
```

### Reproducer:

Based on the failing sequence, we include a test function to easily recreate (and fix) the issue (either in the test -often- or the underlying implementation -less often)

> [Call Sequence]

1. FuzzTest.property_IHaveFailed(string,uint256)(’arg’, 0x00…012) (block=123, time=9999, gas=1, gasprice=1, value=0, sender=0x0000…000123)
2. FuzzTest.property_IHaveFailedToo(string,uint256)(1, 1) (block=456, time=123456, gas=1, gasprice=1, value=0, sender=0x0000…00b33f)
   >

```solidity
contract Reproducer is FuzzTest {
	function test_property_IHaveFailed() external {
		vm.roll(124);
		vm.warp(9999);
		vm.prank(address(123));
		this.property_IHaveFailed('arg', address(12));

		vm.roll(456);
		vm.warp(123456);
		vm.prank(address(b33f));
		this.property_IHaveFailedToo(1,1);
	}
}
```

This test function can then be run using `forge test --mt test_property_IHaveFailed` .

The conversion between the trace and the reproducing example can be automated using Youdusa (either as campaign handler or from a log file).

## Caveats

One important property of Medusa is that it swallows any reverts happening during testing and hence the output might be all green even if every external call in your test has reverted. To propagate the errors, we use the following pattern.

```solidity
function property_myTest() public {
  // Preconditions
  vm.warp(123);

  vm.prank(owner);

  // Action
  try foo.bar() {
    // postconditions
    assert(foo.baz() == 4);
  catch {
    assert(false); // never revert
  }
}
```

In the `try` block, we’re asserting the properties the test is supposed to cover and the `catch` block ensures the revert is treated as a failing test. Alternatively, we could add more conditions to the assert in the `catch` block, this is used to allow reverts under certain conditions, e.g. if invalid parameters were passed to the external call.

## Tips and tricks

- Regularly review the coverage report to assess if you're testing what should be tested
- if there is an external dependency with a hardcoded address, just add it as deployed in the yaml (same as a lib, but without having to link it - last 2 in this example, `MockBridge` and `Create2Deployer`)

![Predeploy contracts for Medusa](/img/fuzz-predeploy.png)

- When reviewing a PR for a fuzzing campaign, it’s crucial to run the fuzzer for a few minutes and check for coverage gaps in the assertion tests. It’s otherwise too easy to have tests silently skip most of the interesting stuff due to early reverts.
- As some of our projects are relying on crosschain messaging, we use a mock bridge. The main idea is to use the single chain provided by Medusa/Echidna (or even Halmos), and use a contract acting as a bridge (in summary, a queue containing all the crosschain message + a handler to “flush”/relay all message to their targets - avoiding atomic bridging, which isn’t realistic).
  Further logic can be included for, eg, have a non-fifo ordering (lifo, random, etc), rely on additional relayers/hyperlane/etc.

## Beyond writing tests

Having a good _and tidy_ properties and invariant test suite is nice, but would be useless if it wasn’t being actively used. As the space the fuzzer has to explore grows (in the worst case scenario) exponentially, running fuzzing campaign for a decent amount of time is mandatory.

## Additional Resources

[Building secure contracts](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis/echidna), a Echidna tutorial.

[Solutions](https://github.com/crytic/echidna-streaming-series/tree/main) from the Trail of Bits youtube streams.
