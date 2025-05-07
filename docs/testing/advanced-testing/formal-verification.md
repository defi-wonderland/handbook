# Formal verification

While all other tests aim to find bugs using specific values (such as 123, address(69), etc.), even when guided by coverage like Medusa, they can only demonstrate the presence of a bug, not its absence. Formal verification, on the other hand, allows the opposite. It provides mathematical certainty by proving the correctness of the system being tested - essentially confirming the absence of bugs, *given the properties being assessed*.

## Symbolic Execution

The main principle of formal verification is to translate the system being studied into a formal model with a set of formal specifications, which are then proved. In other words, the code becomes math that we play with. There are multiple techniques to do so, but not all of them have been ported into the blockchain space. Historically, `solc` uses either satisfiability modulo theory (SMT) or Horn clauses satisfiability. The SMT solving is usually done using Z3 (see some [toys example of Z3 in this repo](https://github.com/simon-something/rust-z3-examples), in Rust for clarity). Note that solc offers a few other solvers.

We’ll briefly review the underlying intuition behind SMT solving in a really simplified way, to illustrate the process of “express code as math, then do math stuff with it to conclude some things”.

Let’s say we’d like to formally verify this abs function which returns the absolute value of a signed integer:

```solidity
function abs(int256 x) public returns(int256) {
  if(x < 0) return -x;
  else return x;
}
```

We can rewrite it as the following logic formula:
`x < 0 implies result=-x (1) AND x >= 0 implies result=x (2)`   

And now add the following property we’d like to prove, which is the intended behaviour of an abs function, ie return positive values only: `assert(result >= 0); (3)`

(1), (2) and (3) are forming a system we’d like to solve. If this system can be solved, then the property is valid or *satisfiable* (ie a set of values a satisfying it)*;* if not, there is no valid solution, meaning this property is not part of the system, we say the property is unsatisfiable.

In practice, as we want to not only prove that *one* solution is valid, but that *all* of them are, we try to prove the opposite of (3) - if `(1) AND (2) AND NOT(3)` is unsat, then there is no way *at all* to break our invariant.

SMT solving starts by translating the problem into a boolean satisfiability problem:

```solidity
bool b1 = x < 0; (1)
bool b2 = result == -x; (1)
bool b3 = x >= 0; (2)
bool b4 = result == x; (2)
bool b5 = result >= 0; (3)
```

The original constraints are expressed in the following bool logic (using -> for logical implication)
`(b1 -> b2) && (b3 -> b4) && b5`, which is equivalent to `(!b1 || b2) && (!b3 || b4) && b5`

A simplified way the SAT solver would solve this is (DLLP(T), as z3 would use for instance):

- find any unit clause (ie containing a single literal, like b5 is here)
- set it to true (as there is no other choice, it *has* to be true if we want SAT)
- propagate if possible (ie replace b5 in other clauses), this is the “unit propagation” - none here
- if there is no other unit clause, chose another literal: try setting b1 to false -> it doesn't change others clauses
- try b3 true -> b4 needs to be true then (!b3 || b4 is therefore true) -> this is solved with (b1 F, b2 T/F, b3 T, b4 T)

After having solved this boolean formula, the solution is “fed” back to the theory solver, which basically starts from the solved statement, and check if "it makes sense". In the example above this would mean converting back to arithmetic and look for impossible results. 

> b1 F means x >= 0
b2 can be whatever, result is -x or is not
b3 T means x >= 0
b4 T means result == x
b5 T means result >= 0
> 

this system can be simplified as `(x >= 0) and (result = x) and (result >= 0)`, which gather no contradiction/the system is satisfiable and we’ve proved it (we can produce examples, like x = 1 and result = 1 for instance), the solver will return SAT.

One of the most used SMT solver/prover is [Z3](https://github.com/Z3Prover/z3/wiki#background), built by Microsoft. It is the default solver for solc, Halmos or some parts of Kontrol. 

## Concolic execution

Solving the whole system at once can be a daunting task, even for a smart solver. An approach to ease that process is to leverage *fuzzing along symbolic execution*. Concolic engines alternates CONCrete execution (where they collect symbolic path constraints) and symbOLIC one (solving constraints to find the next execution path).

Here is a quick overview of the whole process:

- set random concrete values (eg x := 5)
- concrete execution, along current path’s predicates collection
- negation of one of the predicates (last or first one for instance)
- solve this mutated path condition
- unsat → go to two (to negate the next predicate)
- sat → set the concrete values to the numerical example as concrete value (eg x := 13), go to one

In practice, each run starts with a concrete value (initially random, within the given type) and collect the *predicates* for the corresponding symbolic variables along the execution of the concrete path.

```solidity
function tryMe(uint256 x) public {
	uint256 y = x + 2; // (1)
	uint256 z;
	
	if (y > 5) z = 15; 
	else z = 1; 

	if(y != 0) emit Heyaaaa();
}
```

The corresponding symbolic variable for x is noted `αx`.

Let’s say we start with the concrete value `x = 120` (initially random, within an uint256 range), the predicate for y in (1) is `y = αx + 2`.

As we reach the *if* clause, given it returns true in our concrete execution (122 > 5), we record the following predicate as the *path condition -* how we can, symbolically, reach that specific path. Here, `αx + 2 > 5` (the symbolic representation of y is bigger than 5)

Continuing our concrete execution, `z = 15`. We reach the second *if*, which is another branching evaluating to true in our concrete execution (ie 122 ≠ 0). We record this as another predicate in our path condition (ie y not zero): `(αx + 2 > 5) ∧ (αx + 2 != 0)`. Our concrete execution stops there (as we emit `Heyaaaa` - shake it, shake, shake it).

The next step is where we actually leverage symbolic execution (until now, we only collected predicates): to find the next branch to execute, we *iteratively* *negates* the predicates in the path condition we’ve now built (which one depends on the tooling/strategy, principle remains the same tho) and *solve* this new path → if it is satisfiable, the solver will give us a numerical example, which we can then use for another concrete execution (potentially discovering new conditions, etc).

In our example, if we are on the depth-first side of the force, we’ll negate the latest predicate, and then “going up” (ie first negate `(αx + 2 != 0)`, explore, and only after we don’t have new paths condition, negate `(αx + 2 > 5)`).

This comes with one of the key optimization of concolic execution: as all predicates *preceding* the one we negate are still valid in that path (eg our path condition is `P1 and P2 and P3 and P4` , if we mutate P3, we cannot keep P4 - we don’t know anything about that predicate anymore - *but* P1 and P2 are still part of that path condition and are satisfiable), our solver can reuse these (in 2 ways: either reusing this prefix as is, the space to explore being reduced; either via ”incremental solving” where the solver keep track of previous assertions). 

In other words, for any given simple path condition with n predicates (simple as in “straight line”, without loop or subbranches), the number of time we call the solver is in O(n) while the global “cost of solving” (ie how much we need to solve new predicates/we cannot reuse previous ones) in O(n^2) (ie 1 + 2 + …+ n = n(n+1)/2 which is n^2 complexity). In comparison, a symbolic execution based solving would solve every branches, from scratch (meaning O(2^n) calls to the solver, each having the same n predicates to solve (we don’t reuse), or a O(n x 2^n) global cost).

In our example, negating the second predicate is `¬(αx + 2 != 0) => αx + 2 == 0`, so the whole path condition becomes `(αx + 2 > 5) ∧ (αx + 2 == 0)` → this is trivially not solvable, as these predicates are mutually exclusive (ie 0 > 5).

We then go to the previous predicate of our original path condition and negate it: `¬(αx + 2 > 5) => ax + 2 <= 5` , leading us to solve the complete path condition of `(αx + 2 <= 5) ∧ (αx + 2 != 0)` . This is solvable (ie x can take any value in [0, 1, 2, 3]), our solver will give us a numerical example (1 for instance).

From there, we iteratively continue this process (concrete execution with `x = 1`, collect the branch condition, negate, solve, execute the new branch, etc).

## Reachability / Kontrol

Another approach to formal verification is reachability logic. Instead of exploring every executable path with symbolic inputs, this approach operates over the semantic of the language, defined using the K framework.

K is a framework for formally defining a programming languages or hardware. Kontrol is a tool built on top of K, used to prove properties reachability (”based on a given state and the language semantic, can I *reach* this other state?”).

To do so, Kontrol rewrite what’s called the *configuration* (the state - ie memory, storage, etc - organised in nested cells) using the language semantic defined in K. It then rewrite the reachability claims themselves, to check if any configuration satisfying the pre-conditions can be rewritten into one satisfying the post-condition ("under these assumptions, all executions must eventually satisfy this condition").

As Kontrol isn't building path constraints to solve them (as a symbolic execution engine would), but rather focus on working directly on the semantic itself, it allows handling things which are usually hard for solvers (unbounded loops for instance). For specific, non-trivial, properties, Kontrol supports *auxiliay lemmas*, allowing providing intermediate results, to "guide" the proof. 

## Tools

Kontrol and Halmos are the tools currently best integrated with Forge. Properties are written in solidity and most cheatcodes are supported.

Variable instantiation is either done automatically or via a dedicated, additional cheatcode.

ItyFuzz is currently the most used concolic execution engines (working with a set of detectors for common vulnerabilities).

## Kontrol

Kontrol relies on an implementation of the EVM bytecode semantic in K (the KEVM). 

See the Kontrol docs for a basic test example https://docs.runtimeverification.com/kontrol/guides/kontrol-example/property-verification-using-kontrol 

### Notes

- `setUp()` function is run by default, constructor **not**, meaning a global non-constant or immutable variable will **not** be initialized. There is a default flag to do it though.
- Kontrol looks for tests starting with `prove_`, `check_` and `_test`.
- The rule of thumb for running multithreaded compilation/prove is 1 core and 8Gb per runner

## Halmos

On the other hand, Halmos is more straightforward as it rely on z3 (or any arbitraty solver) under the hood, using a symbolic evm (in Python). It doesn’t involved an EVM formalization like Kontrol, and is “pure” symbolic execution (variable are symbolic, and used to build constraints, then a solver is used to prove if these constraints can be solved or not).

This drastically increase its’ speed for proving properties, and makes it even friendlier to use when coming from Foundry. The trade-off being some bigger limitations, for instance to unroll loops (computationally intensive) or solve divisions.

## Resources

- [Kontrol documentation](https://docs.runtimeverification.com/kontrol)
- https://www.youtube.com/watch?v=dMoBd0F4cjQ
- More in-depth presentation by Juan Conejero at EthCC this year: [https://ethcc.io/archive/Getting-started-with-Kontrol-a-formal-verification-tool](https://ethcc.io/archive/Getting-started-with-Kontrol-a-formal-verification-tool)
- Here is an earlier presentation at EthCluj, of both Simbolik and Kontrol: https://ethcc.io/archive/Getting-started-with-Kontrol-a-formal-verification-tool
- [A more advanced example](https://runtimeverification.com/blog/using-kontrol-to-tackle-complexities-caused-by-dynamically-sized-constructs) of how to use loop invariants in Kontrol for handling unbounded inputs, something unique to Kontrol's capabilities.
- [A Wonderland podcast](https://drive.google.com/file/d/1KusMkjKsDRe0FV3TFkNr_6jOWxJ0QF6Z/view?usp=sharing) with Palina and Andrei from RuntimeVerification presenting Kontrol - see the kcfg part
- https://www.youtube.com/watch?v=9PLnQStkiUo for a more theoretical talk about K itself, and how Kontrol is built on top of it
- [OP CI Kontrol tests](https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts-bedrock/test/kontrol)
- [WETH9 testing](https://github.com/horsefacts/weth-invariant-testing/blob/main/test/WETH9.symbolic.t.sol) with Halmos