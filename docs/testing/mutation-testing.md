# Mutation testing

grrrnrrnbbblblbblbmmmmutttaaaaaaant

Having good tests is nice, but how can you know they are actually good?

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

Having a mathematical certainty with a formal method is nice too, but what if the assertion are bugged, or preconditions are too constrained? You can only be sure of what you’ve implemented, not what you expect to have implemented

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

To fix this, we use mutation testing. While we manually mutate some isolated assertion while writing our tests (to check their predictive value), we use tools to automate mutation of the whole codebase.

For test built with Foundry, we use vertigo-rs, while Medusa can be fairly easily fuzzed with slither-mutate (note: for bigger codebase or test base, it might be too slow). Symbolic tests with Kontrol or Halmos are too computation intensive to be currently mutated.

We’re currently working on another tool, aimed at assessing the predictive power of a Medusa corpus (by mutating the related properties) but is currently not production-ready.

For the avid readers, here are additional *optional* ressources:

- Certora has developed [Gambit](https://docs.certora.com/en/latest/docs/gambit/index.html), which has been forecasted as potentially integrated with Foundry for a couple of years now (draft PR slowly dying);
- non-focusing on solidity only, the big name in mutation testing is universalmutator (lots of languages supported, incl solidity). This tool will produce (and store by default) thousands of mutants