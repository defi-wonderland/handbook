---
sidebar_position: 4
title: Challenges
---

# Circom Challenges

These challenges are designed to build your Circom intuition through progressively harder puzzles. The early ones teach syntax and patterns; the later ones teach you to think like an attacker.

## How This Works

Each challenge has:
- A **circuit template** with missing constraints
- A **test file** that defines what "passing" means
- **Hints** (try not to peek)

Your job is to complete the circuit so all tests pass. For security challenges, you'll also need to write exploit tests that demonstrate vulnerabilities in intentionally broken circuits.

## Getting Started

```bash
cd circom-onboarding/challenges
npm install

# Run a specific challenge
npm test -- --grep "Addition"

# Run all challenges
npm test
```

---

## Level 1: Foundations

These build basic Circom fluency. If you've never written a circuit, start here.

### Challenge 1.1: Addition

**Objective**: Create a circuit that proves knowledge of two numbers that sum to a public output.

```circom
// circuits/Addition.circom
pragma circom 2.1.0;

template Addition() {
    signal input a;
    signal input b;
    signal output sum;

    // TODO: Constrain sum to equal a + b
}

component main = Addition();
```

**Test it passes**:
- `a=3, b=5` should produce `sum=8`
- `a=0, b=0` should produce `sum=0`

<details>
<summary>Hint</summary>
This is the simplest possible circuit. One line, one operator.
</details>

---

### Challenge 1.2: NotEqual

**Objective**: Create a circuit that enforces two inputs are NOT equal.

```circom
// circuits/NotEqual.circom
pragma circom 2.1.0;

include "circomlib/circuits/comparators.circom";

template NotEqual() {
    signal input a;
    signal input b;

    // TODO: Constrain that a != b
    // Hint: Use IsEqual from circomlib and constrain its output
}

component main = NotEqual();
```

**Test it passes**:
- `a=5, b=7` should succeed
- `a=5, b=5` should **fail** (constraint not satisfied)

<details>
<summary>Hint</summary>
Use `IsEqual()` from circomlib. Its output is 1 if equal, 0 if not. What should you constrain it to?
</details>

---

### Challenge 1.3: Multiplication Chain

**Objective**: Prove knowledge of three factors that multiply to a public product.

```circom
// circuits/Mul3.circom
pragma circom 2.1.0;

template Mul3() {
    signal input a;
    signal input b;
    signal input c;
    signal output product;

    // TODO: Constrain product = a * b * c
    // Remember: Circom constraints must be quadratic (degree 2 max)
    // You'll need an intermediate signal
}

component main = Mul3();
```

**Test it passes**:
- `a=2, b=3, c=4` should produce `product=24`

<details>
<summary>Hint</summary>
You can't do `a * b * c` directly (cubic). Use an intermediate signal: `temp <== a * b`, then `product <== temp * c`.
</details>

---

## Level 2: Building Blocks

Now you'll use circomlib components and handle real cryptographic patterns.

### Challenge 2.1: Commitment

**Objective**: Create a Poseidon commitment circuit.

```circom
// circuits/Commitment.circom
pragma circom 2.1.0;

include "circomlib/circuits/poseidon.circom";

template Commitment() {
    signal input secret;
    signal input nullifier;
    signal output commitment;

    // TODO: commitment = Poseidon(secret, nullifier)
}

component main {public [commitment]} = Commitment();
```

**Test it passes**:
- Given any `secret` and `nullifier`, `commitment` should match `poseidon([secret, nullifier])`
- Different inputs must produce different outputs (collision resistance)

<details>
<summary>Hint</summary>
Instantiate `Poseidon(2)`, connect `inputs[0]` and `inputs[1]`, use `.out`.
</details>

---

### Challenge 2.2: Range Check

**Objective**: Prove a value is less than 2^n without revealing it.

```circom
// circuits/RangeCheck.circom
pragma circom 2.1.0;

include "circomlib/circuits/bitify.circom";

template RangeCheck(n) {
    signal input value;

    // TODO: Constrain value < 2^n
    // Hint: If a number fits in n bits, it's less than 2^n
}

component main = RangeCheck(64);
```

**Test it passes**:
- `value = 2^64 - 1` should succeed
- `value = 2^64` should **fail**

<details>
<summary>Hint</summary>
Use `Num2Bits(n)`. If the number doesn't fit in n bits, the constraint fails.
</details>

---

### Challenge 2.3: Safe Division

**Objective**: Prove a / b = c without division-by-zero.

```circom
// circuits/SafeDivide.circom
pragma circom 2.1.0;

include "circomlib/circuits/comparators.circom";

template SafeDivide() {
    signal input a;
    signal input b;
    signal output c;

    // TODO:
    // 1. Constrain b != 0
    // 2. Constrain c = a / b (remember: a = b * c in finite fields)
}

component main = SafeDivide();
```

**Test it passes**:
- `a=10, b=2` should produce `c=5`
- `a=7, b=0` should **fail** (division by zero prevented)

<details>
<summary>Hint</summary>
Use `IsZero()` to check b, constrain its output to 0. For division: `c <-- a / b` then `c * b === a`.
</details>

---

## Level 3: Security Challenges

These teach you to think like an auditor. You'll find and fix vulnerabilities.

### Challenge 3.1: The Missing Constraint

**Objective**: This circuit has a critical bug. Find it and write an exploit test.

```circom
// circuits/VulnerableHash.circom
pragma circom 2.1.0;

include "circomlib/circuits/poseidon.circom";

template VulnerableHash() {
    signal input preimage;
    signal output hash;

    component hasher = Poseidon(1);
    hasher.inputs[0] <== preimage;

    hash <-- hasher.out;  // BUG: Can you spot it?
}

component main {public [hash]} = VulnerableHash();
```

**Your tasks**:
1. Identify the vulnerability
2. Write a test that exploits it (prove a false preimage)
3. Fix the circuit

<details>
<summary>Hint</summary>
What's the difference between `<--` and `<==`? Can a malicious prover set `hash` to anything?
</details>

---

### Challenge 3.2: The Unconstrained Comparator

**Objective**: This age verification circuit is broken. Exploit it.

```circom
// circuits/VulnerableAgeCheck.circom
pragma circom 2.1.0;

include "circomlib/circuits/comparators.circom";

template VulnerableAgeCheck() {
    signal input age;
    signal output isAdult;

    component check = GreaterEqThan(8);
    check.in[0] <== age;
    check.in[1] <== 18;

    isAdult <== check.out;
    // What's missing?
}

component main {public [isAdult]} = VulnerableAgeCheck();
```

**Your tasks**:
1. Prove you're "an adult" with `age=5`
2. Explain why this works
3. Fix the circuit

<details>
<summary>Hint</summary>
The comparator computes `isAdult`, but is there any constraint forcing `isAdult` to match the comparison result?
</details>

---

### Challenge 3.3: The Aliasing Attack

**Objective**: Exploit field arithmetic overflow.

```circom
// circuits/VulnerableCommitment.circom
pragma circom 2.1.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/bitify.circom";

template VulnerableCommitment() {
    signal input value;
    signal output commitment;

    // "Validate" value fits in 254 bits
    component bits = Num2Bits(254);
    bits.in <== value;

    // Hash it
    component hasher = Poseidon(1);
    hasher.inputs[0] <== value;
    commitment <== hasher.out;
}

component main {public [commitment]} = VulnerableCommitment();
```

**Your tasks**:
1. Find two different `value` inputs that produce the same `commitment`
2. Explain how this enables double-spending
3. Fix the circuit

<details>
<summary>Hint</summary>
What happens when `value = x` and `value = x + p` where p is the field prime? Both "fit" in 254 bits in different ways...
</details>

---

### Challenge 3.4: The Assert Trap

**Objective**: Bypass the "validation" in this circuit.

```circom
// circuits/VulnerableValidation.circom
pragma circom 2.1.0;

template VulnerableValidation() {
    signal input value;
    signal output doubled;

    // "Ensure" value is positive
    assert(value > 0);

    doubled <== value * 2;
}

component main = VulnerableValidation();
```

**Your tasks**:
1. Prove `doubled = 0` (which should be impossible if value > 0)
2. Explain why `assert` doesn't work as expected
3. Fix the circuit using proper constraints

<details>
<summary>Hint</summary>
`assert` only runs during witness generation. A malicious prover controls witness generation...
</details>

---

## Level 4: Integration Challenges

Full circuits that combine multiple concepts.

### Challenge 4.1: Merkle Proof

**Objective**: Verify Merkle tree membership without revealing which leaf.

```circom
// circuits/MerkleProof.circom
pragma circom 2.1.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/mux1.circom";

template MerkleProof(depth) {
    signal input leaf;
    signal input root;
    signal input pathIndices[depth];  // 0 = left, 1 = right
    signal input siblings[depth];

    // TODO: Verify the Merkle proof
    // At each level: hash(left, right) where position depends on pathIndex
    // Final hash should equal root
}

component main {public [root]} = MerkleProof(10);
```

**Test it passes**:
- Valid proof for leaf in tree should succeed
- Wrong sibling at any level should fail
- Wrong pathIndex should fail

<details>
<summary>Hint</summary>
Use a loop. At each level, use Mux1 to select ordering, then Poseidon(2) to hash. Chain the result up.
</details>

---

### Challenge 4.2: Nullifier Scheme

**Objective**: Create a commitment + nullifier scheme for anonymous spending.

```circom
// circuits/Spend.circom
pragma circom 2.1.0;

include "circomlib/circuits/poseidon.circom";

template Spend() {
    signal input secret;
    signal input nullifier;
    signal output commitment;
    signal output nullifierHash;

    // TODO:
    // 1. commitment = Poseidon(secret, nullifier)
    // 2. nullifierHash = Poseidon(nullifier)
    //
    // The commitment goes in the Merkle tree (public)
    // The nullifierHash prevents double-spending (public)
    // The secret and nullifier remain private
}

component main {public [commitment, nullifierHash]} = Spend();
```

**Test it passes**:
- Same secret+nullifier always produces same commitment
- Same nullifier always produces same nullifierHash
- Can't determine secret from public outputs

---

### Challenge 4.3: Sudoku Verifier

**Objective**: Prove you know a valid Sudoku solution without revealing it.

```circom
// circuits/Sudoku.circom
pragma circom 2.1.0;

include "circomlib/circuits/comparators.circom";

template Sudoku() {
    signal input puzzle[9][9];   // 0 = empty cell
    signal input solution[9][9];

    // TODO:
    // 1. Solution matches puzzle (non-zero cells match)
    // 2. Each row contains 1-9 exactly once
    // 3. Each column contains 1-9 exactly once
    // 4. Each 3x3 box contains 1-9 exactly once
    // 5. All values are in range 1-9
}

component main {public [puzzle]} = Sudoku();
```

This is a hard challenge. Break it into helper templates:
- `UniqueNine()` - verifies 9 values are a permutation of 1-9
- `InRange(min, max)` - verifies a value is in range

---

## Bonus: The Audit Challenge

You've been given a circuit from an external team. Find all the bugs.

```circom
// circuits/Audit.circom
pragma circom 2.1.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/bitify.circom";

template Withdraw(treeDepth) {
    signal input secret;
    signal input nullifier;
    signal input amount;
    signal input root;
    signal input pathIndices[treeDepth];
    signal input siblings[treeDepth];

    signal output commitment;
    signal output nullifierHash;

    // Compute commitment
    component commitHasher = Poseidon(3);
    commitHasher.inputs[0] <== secret;
    commitHasher.inputs[1] <== nullifier;
    commitHasher.inputs[2] <== amount;
    commitment <-- commitHasher.out;  // Bug #1

    // Compute nullifier hash
    component nullHasher = Poseidon(1);
    nullHasher.inputs[0] <== nullifier;
    nullifierHash <== nullHasher.out;

    // Verify amount is reasonable
    assert(amount > 0);  // Bug #2
    assert(amount < 1000000);

    // Verify Merkle proof
    signal hashes[treeDepth + 1];
    hashes[0] <== commitment;

    component hashers[treeDepth];
    component mux[treeDepth];

    for (var i = 0; i < treeDepth; i++) {
        mux[i] = Mux1();
        mux[i].c[0] <== hashes[i];
        mux[i].c[1] <== siblings[i];
        mux[i].s <== pathIndices[i];

        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== mux[i].out;
        hashers[i].inputs[1] <== siblings[i];  // Bug #3
        hashes[i+1] <== hashers[i].out;
    }

    component rootCheck = IsEqual();
    rootCheck.in[0] <== hashes[treeDepth];
    rootCheck.in[1] <== root;
    // Bug #4: rootCheck.out not constrained

    // Range check on amount
    component amountBits = Num2Bits(254);  // Bug #5
    amountBits.in <== amount;
}

component main {public [root, nullifierHash]} = Withdraw(20);
```

**Your task**: Find all 5 bugs, explain each one, and write fixed code.

---

## Resources

- [RareSkills Zero-Knowledge Puzzles](https://github.com/RareSkills/zero-knowledge-puzzles) - Original inspiration
- [0xPARC Learning Resources](https://learn.0xparc.org/) - Deep dives
- [Circomlib Source](https://github.com/iden3/circomlib) - Study the implementations
- [ZKRepl](https://zkrepl.dev/) - Test snippets in browser

## Next Steps

Completed all challenges? Move on to:
- [Remaking Tornado Cash](./tornado-cash) - Full protocol implementation
- [Best Practices](./best-practices) - Production security patterns
