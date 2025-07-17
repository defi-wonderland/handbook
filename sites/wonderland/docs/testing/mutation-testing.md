# Mutation testing

Having good tests is nice, but how can you know they are good?

Coverage is one type of measure, but it can be easily tricked, like this (we say it’s a discovery tool, not a measure btw)

```solidity
function floor(uint a, uint b) public returns(uint) {
  if(b > 0) return a / b;
  
  return 0;
}

function test() public {
	assertGte(foo(10, 1), 0);
	assertEq(foo(0, 0), 0);
}
```

Having a mathematical certainty with a formal method is nice too, but what if the assertions are buggy, or the preconditions are too constrained? You can only be sure of what you’ve implemented, not what you *expect* to have implemented.

```solidity
function floor(uint a, uint b) public returns(uint) {
	return (a / b) + 1; // Le Bug
}

// Prove that this function never reverts
function prove_neverRevertTooConstrained(uint a, uint b) public {
	vm.assume(b > 0); // oops, overconstrained
	
	try this.call(abi.encodeCall(this.ceiling, (a, b))) {
	  assert(true);
	} catch {
	  assert(false);
	}
}

// Prove that the result is always the floor division
function prove_alwaysCorrect(uint a, uint b) public {
	vm.assume(b != 0);
	assert(floor(a, b) >= 0); // oops, always true, missing the bug
}
```

To fix this, we use mutation testing. While we manually mutate some isolated assertions while writing our tests (to check their predictive value), we use tools to automate the mutation of the whole codebase.

For tests built with Foundry, we currently use vertigo-rs, while Medusa can be fairly easily fuzzed with slither-mutate (note: for bigger codebases or test bases, it might be too slow). We're currently finishing a PR to integrate the mutation test in Foundry, see [this PR](https://github.com/foundry-rs/foundry/pull/10193) to find the latest development, the [issue](https://github.com/foundry-rs/foundry/issues/478) tracking it or the [current roadmap](https://github.com/simon-something/foundry/issues/2).

Symbolic tests with Kontrol or Halmos are too computationally intensive to be currently mutated. 