# Happy Tests Checklist

## La Checklist

- [ ]  Fuzzed variables are clamped using `bound`, *not* `vm.assume`
- [ ]  The number of fuzz runs is 1000 or higher
- [ ]  Every single unit test covers a single branch or path
- [ ]  There are no shadowed variables
- [ ]  `.tree` and `.t.sol` files are in sync
- [ ]  Every `mockCall` has the corresponding `expectCall`
- [ ]  Only relevant parameters are fuzzed
- [ ]  Tests follow pre-conditions, action, post-conditions pattern
- [ ]  Setup complexity should be as low as possible

### The what?

This checklist aims to ease early unit test review for any given project. No crying in despair and stuff, this isn’t a new burden for everyone, as these are mostly things we’re all doing - we just formalize them and make sure everything is covered ;)

> Checklist-wut?
> 

For context, we aim to cover system-wide invariants during a fuzzing campaign. This means all the “smaller” ones (i.e., not stateful and, most of the time, framing only a single function) are not tested. Therefore, we rely on them *having appropriate unit tests*.

> Ok but Checklist-wut?
> 

So, before filtering an invariant out of the testing campaign, we need to ensure it is properly tested so as not to create a gap where an important protocol property is not tested.

> Cool story bruh, I have 100% coverage and Checklist-wut?
> 

Coverage is a lie—or the way people think about it is a lie. 100% statement or branch coverage doesn’t bring new information; it’s useless. Coverage is a *detection tool* best used when it is not maximal (”I have a 95% coverage, why? Can I fix it or is something irrreachable?”).

> Hmm, kk, Checklist-wut tho?
> 

While reviewing random test suites, we noticed some patterns leading to suboptimal unit tests, which resulted in misleading coverage and potential bugs slipping through our testing nets. As we rely on unit test safety and soundness to optimize our fuzzing campaigns, we created a small checklist to ensure Wonderland avoids common pitfalls. And yes, every item on this list comes from real-life bugs, *sometimes in prod,* in Wonderland*.*

In practice, this is a cross-checked list—similar to how flight attendants verify "doors armed and cross-checked" before takeoff to prevent catastrophic errors (aka everyone dying at 35,000ft). The test author should complete the checklist first, followed by a second verification from the PR reviewer.

No need to add extra admin work, going through the checklist while writing/reviewing is enough, as you now get the importance of it, right?…. Right??

If you *really* wanna document it, add it as a comment in the related PR.

## General considerations

The first few items avoid having non-efficient tests, meaning even if the test logic is correct, it will be *slow* to execute - a slow set of tests leads to not running it at all (”ain’t nobody got time for tests”) or with a low number of fuzzer runs (”it anyway passed last time I ran it, in the Summer of 1993”) - both seen in some projects. For further reading, see Clean Code’s Chapter 9: the “F” part of the F.I.R.S.T unit tests rule stands for *Fast.*

## Breakdown

### Using bound

Using `vm.assume` on a range of values will discard every fuzzer run where the condition is false. For a single value, this doesn’t create (too much of) an issue. But if a whole range of values is discarded, this will result in abnormally slow test runs. Remember how unit testing in Javascript felt? Yeah, that kind of slow.

[bound](https://book.getfoundry.sh/reference/forge-std/bound), on the other hand, adjusts the input parameters, fitting them into the predefined boundaries and not wasting a single test run.

```solidity
function myFancyTest(uint256 fuzzedVariable) public {
	// Good
	fuzzedVariable = bound(fuzzedVariable, 1, type(uint128).max);
	
	// Not good
	vm.assume(fuzzedVariable > 0 && fuzzedVariable <= type(uint128).max);
...
```

### Number of fuzz runs

The whole point of fuzzing parameters in an unit test is to cover a range of values, lowering the number of runs goes in the exact opposite direction. This can be a codebase-threatening issue as fuzzed unit tests are written differently than their non-fuzzed equivalent: we all assume boundary values (0, 1, max, max - 1, etc.) are being handled by the fuzzer, and don’t write hedge cases tests anymore. This doesn’t end up well if the fuzzer does not have enough runs to explore these (cf the mod 10 example at the bottom of the [onboarding documents](https://www.notion.so/1739a4c092c7801c9b54d0aa53471ee9?pvs=21))

```solidity
// Good
/// forge-config: default.fuzz.runs = 256

// Not good
/// forge-config: default.fuzz.runs = 5
function myFancyTest(uint256 fuzzedVariable) public {
	...
}
```

### One unit test = one branch

This enforces another letter of F.I.R.S.T: unit tests must be **R**eproducible. By having 2 or more paths tested in a single test, we rely entirely on the fuzzer randomness to hit them all. Safety through randomness is not a thing and should be avoided (best case scenario, this leads to flaky tests, annoying enough to be fixed - worst case, some bugs are slipping through the testing net). If you really wanna do this, then make sure every branch of the test is used and formally verify your assumption instead of fuzzing - outside the scope of this list and probably of your unit test suite.

```solidity
function myFancyTest(uint256 fuzzedVariable) public {
	// Good
	assertEq(result == fuzzedVariable / 2, "Wrong result");
	
	// Not good
	if(fuzzedVariable > 0) assertEq(result == fuzzedVariable / 2, "Wrong result");
	else assertEq(result == type(uint256).max, "Not max if 0");
}
```

### Shadowing variables

We naturally tend to discard compiler warnings for test files. After all, we just want the logic to run and call it a day. Shadowing can be tricky to debug and lead to incomplete coverage. Avoid the foot-gunning, ban variable shadowing.

```solidity
uint256 _stakingPeriod = 3 days;

function test_reconfigureStakingPeriod() public {
	...
	// Good
	uint256 _reconfiguredStakingPeriod = 2 days;
	
	// OK
	_stakingPeriod = 2 days;
	
	// Not good
	uint256 _stakingPeriod = 2 days;
}
```

### Tree and test syncing

Bulloak tree’s can be painful to create and maintain at first. Yet, they are extremely powerful to use, provided they're well-maintained. We write unit tests for 3 persons: ourselves (most of the time, it kinda feels boring, we know a revert() will always revert), our future self, and others.

Good `(tree, test)` tuples are useful for all 3:

- ourselves: we formalize our functions, ideally test-drive our implementation, have a clearer vision of what we’ll test from the start, etc
- our future self: we have a handy design doc when we need to refactor 3 weeks later
- others: they have a falling test and 0 clues what it is about, they wanna refactor and not sure how X works/is tested, they want to make sure one scenario is indeed covered because a weird bug occurs in integration tests, etc.

The `(tree, test)` tuple needs love and affection; don't leave a branch untested or a test without a branch. Be good to nature, and water your tree.

<aside>
💡

Good: no test function without a corresponding branch in the tree; no branch without a corresponding test function.

</aside>

### Pairing mockCall and expectCall

A single `mockCall` will only ensure the test can run but misses the information about “did the call really occur and was it correct”. It also leads to hanging mockCalls in some cases, when the code is no longer calling a function but we’re still mocking it anyways.

To avoid these problems, always follow mock calls with an `expectCall`, or use [mockAndExpect](https://github.com/defi-wonderland/prophet-core/blob/dev/solidity/test/utils/Helpers.sol#L48-L51).

```solidity
// Good
function testXXX() public {
  vm.mockCall(...);
  vm.expectCall(...);
	...
}

// Not good
function testXXX(...) public {
  vm.mockCall(...);
  ...
}
```

### Concurrent fuzzed values

Having “giga-polydic” functions is a blockchain paradigm thing. While we can’t really force monadism, trying to fuzz every parameter at once might lead to subefficient behavior. For instance, trying to fuzz every parameter in `function gigadic(uint,uint,uint,uint,myStruct1,address)` might result in not-so-great efficiency. Instead, focus on the parameters relevant to the branch tested.

```solidity
// Good
function testXXX(address _caller) public {
	...
	assertEq(_caller, owner, "Not the owner");
}

function testYYY(uint256 _delay) public {}
function testZZZ(uint256 _stake) public {}
function testQQQ(address _owner) public {}

// Not good
function test(address _caller, uint256 _delay, uint256 _stake, address _owner) public {
  ...
	assertEq(_caller, owner, "Not the owner");
}
```

### Hoare logic

This is mostly a matter of clarity for both reviewers and future readers. Having well-defined pre-conditions/action/post-conditions helps quickly grasp the logic of the test.

If your test is small enough, placing a line break between the parts might be sufficient, but in larger tests explicitly marking pre-conditions, actions and post-conditions in comments is advisable.

```solidity
// Good
function test(uint256 _foo) public {
	// Pre-conditions
	_foo = bound(_foo, 1, 50);
	uint256 _bar = 10;
	uint256 _initial = target.kangaroo();
	assertGt(_initial, 10);
	
	vm.prank(CALLER);
	
	// Action
	uint256 _result = target.baz(_foo, _bar);
	
	// Post-conditions
	assertEq(_result, 200, "Wrong result");
	assertTrue(target.switch(), "Switch off");
}

// Not good
function test(uint256 _foo) public {
	_foo = bound(_foo, 1, 50);
	uint256 _bar = 10;
	uint256 _initial = target.kangaroo();

	vm.prank(CALLER);
	
	uint256 _result = target.baz(_foo, _bar);
	
	// Another action - "muddying" baz' postconditions
  target.doSomething();
  assertTrue(target.switch());
	
	// uho, what are we testing here? pre-conditions?
	assertGt(_initial, 10);
	
	assertEq(_result, 200, "Wrong result");
	assertTrue(target.switch(), "Switch off");
}
```

### Setup complexity

Often, the devil hides in the details. A 500 SLOC setup, with multiple inheritance, opens the door for *a lot* of devil-hiding details. If possible, actively refactor it to make it as clear and straightforward as possible. Use your rubber duck, ChatGPT or Clean Code’s boy scout “leave the campground cleaner than you’ve found it” technique.