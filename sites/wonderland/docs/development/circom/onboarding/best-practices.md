---
sidebar_position: 6
title: Best Practices
---

# Circom Best Practices

> *In zero-knowledge cryptography, what you don't constrain can and will be exploited.*

Welcome to our guide on writing secure Circom circuits. If you're building ZK applications at Wonderland, this document will help you avoid the pitfalls that have led to millions of dollars in vulnerabilities across the ecosystem.

## Why This Matters

Zero-knowledge proofs are beautiful but unforgiving. Unlike traditional programming where bugs might cause crashes or incorrect outputs, ZK circuit bugs can allow attackers to generate valid proofs for false statements. The verifier happily accepts these proofs because, mathematically, they check out, even though the underlying claim is a lie.

The good news? Most vulnerabilities follow predictable patterns. Learn them once, and you'll spot them everywhere.

There's also a deeper challenge we'll revisit later: **the test oracle problem**. In traditional testing, you know when something is wrong because the function returns an unexpected value. In ZK circuits, a proof either verifies or it doesn't. The challenge is knowing whether a *valid* proof represents a *legitimate* computation. This is why we always build reference implementations—they give you an independent source of truth to compare against.

But first, let's build the mental model you need to understand these vulnerabilities.

## The Mental Model You Need

Before diving into specific pitfalls, let's build the right mental model.

### Signals, Constraints, and Witnesses

When you write a Circom circuit, you're actually writing two programs in one:

1. **The Witness Generator**: Computes values during proof generation
2. **The Constraint System**: Defines what the verifier checks

Here's the critical insight: **the verifier only sees the constraints**. Any computation you do that doesn't end up as a constraint might as well not exist from a security perspective.

```circom
signal intermediate;
intermediate <-- expensiveComputation();  // Prover computes this
intermediate === expectedValue;            // Verifier checks this
```

The `<--` operator says "compute this value" (witness generation). The `===` operator says "enforce this relationship" (constraint). If you forget the constraint, the prover can set `intermediate` to literally anything.

### The Operator Cheat Sheet

| Operator | What It Does | Secure? |
| --- | --- | --- |
| `<==` | Assigns AND constrains | Yes |
| `<--` | Only assigns (witness) | Dangerous alone |
| `===` | Only constrains | Yes |
| `=` | Variable assignment | N/A (not for signals) |

**The golden rule**: Use `<==` by default. Only reach for `<--` when you have a specific reason, and always pair it with `===`.

## The Pitfalls That Break Circuits

### The Under-Constrained Signal

This is the big one. It's responsible for more ZK vulnerabilities than any other pattern.

**The Bug**:

```circom
template Divide() {
    signal input a;
    signal input b;
    signal output c;

    c <-- a / b;  // Compute division
    // Oops, forgot to constrain!
}
```

What's wrong here? The circuit computes `c = a / b` during proof generation, but it never *enforces* this relationship. A malicious prover can set `c` to any value and the proof will still verify.

**The Fix**:

```circom
template Divide() {
    signal input a;
    signal input b;
    signal output c;

    c <-- a / b;     // Compute division
    c * b === a;     // Constrain: c must satisfy c * b = a
}
```

**Real-World Impact**: This exact bug appeared in Tornado Cash. The MIMC hash output used `<--` without a constraint, allowing attackers to forge proofs. The Tornado team had to exploit their own vulnerability to drain funds before attackers could. The fix? Changing two characters: `<--` to `<==`.

### The Assert Deception

If you're coming from traditional programming, `assert` feels like a natural way to enforce conditions. In Circom, it's a trap.

**The Bug**:

```circom
template OnlyPositive() {
    signal input x;
    assert(x > 0);  // This does NOT create a constraint!
}
```

Circom's `assert` only runs during witness generation. It's a compile-time check, not a runtime constraint. A malicious prover can simply remove the assert and generate a valid proof with `x = 0`.

**The Fix**:

```circom
template OnlyPositive() {
    signal input x;

    // Use a comparator component and constrain its output
    component isPositive = GreaterThan(252);
    isPositive.in[0] <== x;
    isPositive.in[1] <== 0;
    isPositive.out === 1;  // This IS a constraint
}
```

**When to use assert**: Only for compile-time parameter validation, like ensuring template parameters are within expected ranges. Never for input validation.

### The Aliasing Attack

Circom operates over a prime field (BN254, approximately 254 bits). This creates a subtle but devastating vulnerability.

**The Problem**: Field arithmetic wraps around. If `p` is the field prime, then `x` and `x + p` are mathematically identical. When you convert a number to bits, both representations satisfy the constraints.

```circom
template Vulnerable() {
    signal input x;
    component n2b = Num2Bits(254);
    n2b.in <== x;
    // Both x and (x + p) work here!
}
```

This enables double-spending attacks. An attacker can generate a hash using value `x`, then create another valid proof using `x + p`. Same hash, different witnesses.

**The Fix**: Use strict versions or smaller bit widths:

```circom
// Option 1: Use Num2Bits_strict (includes alias check)
component n2b = Num2Bits_strict();
n2b.in <== x;

// Option 2: Use fewer than 254 bits
component n2b = Num2Bits(128);  // Safe for values < 2^128
n2b.in <== x;
```

For token amounts and similar values, 128 bits is plenty and avoids aliasing entirely.

**Important Caveat**: If you change the default prime in the Circom compiler (the `-p` option), be aware that `Num2Bits_strict`, `Bits2Num_strict`, `AliasCheck`, and `CompConstant` are all **hardcoded for 254 bits**. You'll need to modify these templates for other field sizes.

### The Unconstrained Comparator

Many Circom templates from `circomlib` assume you'll constrain their outputs. If you don't, they're useless for security.

**The Bug**:

```circom
template CheckAge() {
    signal input age;

    component isAdult = GreaterEqThan(8);
    isAdult.in[0] <== age;
    isAdult.in[1] <== 18;
    // isAdult.out is computed but never constrained!
}
```

The comparator computes whether `age >= 18`, but since the output isn't constrained, a prover can ignore it entirely.

**The Fix**:

```circom
template CheckAge() {
    signal input age;

    component isAdult = GreaterEqThan(8);
    isAdult.in[0] <== age;
    isAdult.in[1] <== 18;
    isAdult.out === 1;  // Actually enforce the check
}
```

**Components that need output constraints**:

- All comparators (`LessThan`, `GreaterThan`, `LessEqThan`, `GreaterEqThan`)
- Equality checks (`IsZero`, `IsEqual`)
- Logic gates (`AND`, `OR`, `NOT`, `XOR`)
- Multiplexers (the selector input)

### The Depth Bypass

When working with Merkle trees, a subtle issue arises with the `BinaryMerkleRoot` template from zk-kit.

**The Problem**: If you pass a `depth` greater than `maxDepth`, the template returns 0 instead of failing. An attacker could exploit this to bypass tree verification.

```circom
// If depth > maxDepth, this silently returns 0
component proof = BinaryMerkleRoot(maxDepth);
proof.depth <== attackerControlledDepth;  // Set to maxDepth + 1
proof.out === root;  // This checks 0 === root, which fails...
                     // ...unless root happens to be 0!
```

**The Fix**: Always validate depth before using it:

```circom
component depthCheck = LessEqThan(6);
depthCheck.in[0] <== depth;
depthCheck.in[1] <== maxDepth;
depthCheck.out === 1;  // Fail if depth > maxDepth

component proof = BinaryMerkleRoot(maxDepth);
// ... rest of proof verification
```

### The BigInt Validation Gap

When working with big integers (values larger than the field size), libraries like `circom-bigint` and `circom-pairing` split values into "limbs." A common vulnerability is assuming inputs are properly formatted without enforcing it.

**The Problem**: Many BigInt templates assume their callers will validate inputs. The `BigLessThan` template, for example, computes a comparison but if you don't constrain its output, an attacker can provide oversized limbs.

```circom
// VULNERABLE: BigLessThan outputs aren't constrained
component lt[k];
for (var i = 0; i < k; i++) {
    lt[i] = BigLessThan(n);
    lt[i].a <== someValue[i];
    lt[i].b <== prime[i];
    // lt[i].out is never constrained!
}
```

**Real-World Impact**: This pattern caused the critical vulnerability in `circom-pairing` that Veridise discovered. The `CoreVerifyPubkeyG1` circuit didn't constrain the outputs of its `BigLessThan` components, allowing attackers to forge BLS signatures.

**The Fix**: Always constrain BigInt comparison outputs:

```circom
for (var i = 0; i < k; i++) {
    lt[i] = BigLessThan(n);
    lt[i].a <== someValue[i];
    lt[i].b <== prime[i];
    lt[i].out === 1;  // Enforce the comparison
}
```

### The Witness File Manipulation

Here's something that might surprise you: a determined attacker doesn't need to find a mathematical flaw in your circuit. They can directly manipulate the witness file.

**How it works**: The `witness.wtns` file is a binary format. Circom doesn't provide an API to create these files from JSON, but an attacker can reverse-engineer the format and write arbitrary values. If your circuit has an unconstrained signal, they can:

1. Generate a valid witness with honest inputs
2. Locate the signal's position in the binary file
3. Overwrite it with a malicious value
4. Use snarkjs to generate a proof from the modified witness

The proof will verify because the constraints are satisfied, even though the witness violates your intended semantics.

**The Lesson**: This is why under-constrained signals are so dangerous. It's not just a theoretical concern; the exploitation is practical and straightforward.

## Arithmetic Gotchas

Beyond the structural pitfalls above, finite field arithmetic has its own quirks that can bite you.

### Signed vs. Unsigned Confusion

Here's something that trips up even experienced developers: Circom's comparison operators (`<`, `>`, `<=`, `>=`) treat field elements as **signed** integers.

The field is split like this:

- Values in `[0, p/2]` are positive
- Values in `[p/2+1, p-1]` are negative (interpreted as `value - p`)

This means `p/2 + 1` is actually considered *less than* `p/2` by Circom's operators!

**The Solution**: Always use explicit range proofs and the `LessThan(n)` template with appropriate bit widths:

```circom
// For values known to be < 2^128
component lt = LessThan(128);
lt.in[0] <== a;
lt.in[1] <== b;
lt.out === 1;  // a < b (treating both as unsigned 128-bit)
```

Never use `LessThan(254)`, it's vulnerable to aliasing. The maximum safe bit width is 252.

### The Range Proof Bypass

A subtle but critical issue arises when using comparators without constraining the bit length of inputs.

**The Problem**: The `LessThan` and `RangeProof` circuits expect inputs to fit within a certain number of bits. But if you don't explicitly constrain input bit lengths, an attacker can provide oversized values that overflow and wrap around.

```circom
// VULNERABLE: No bit constraint on inputs
template VulnerableRangeCheck() {
    signal input value;
    signal input maxValue;

    component lt = LessThan(252);
    lt.in[0] <== value;
    lt.in[1] <== maxValue;
    lt.out === 1;
    // An attacker could use value = p + smallNumber
    // which wraps to smallNumber and passes the check!
}
```

**Real-World Impact**: This exact pattern was found in Unirep's security review. The `RangeProof` circuit used `LessThan` but didn't constrain input bit lengths, allowing attackers to bypass range checks with overflowing values.

**The Fix**: Always constrain inputs to their expected bit range:

```circom
template SafeRangeCheck() {
    signal input value;
    signal input maxValue;

    // Constrain value to 128 bits
    component valueBits = Num2Bits(128);
    valueBits.in <== value;

    component lt = LessThan(128);
    lt.in[0] <== value;
    lt.in[1] <== maxValue;
    lt.out === 1;
}
```

### Division by Zero

Division in finite fields is multiplication by the modular inverse. When you divide by zero, the behavior is undefined, and undefined behavior in cryptography is exploitable.

```circom
template SafeDivide() {
    signal input a;
    signal input b;
    signal output c;

    // First, ensure b is not zero
    component nonZero = IsZero();
    nonZero.in <== b;
    nonZero.out === 0;  // b must NOT be zero

    // Now safe to divide
    c <-- a / b;
    c * b === a;
}
```

## Tools of the Trade

You don't have to find these bugs manually. The ecosystem has developed excellent tooling.

### Circomspect (Trail of Bits)

A static analyzer that catches common vulnerabilities:

```bash
# Install
cargo install circomspect

# Run on your circuits
circomspect circuits/

# Allow specific warnings if needed
circomspect circuits/ --allow P1000
```

Circomspect will flag:

- Signals assigned with `<--` that could use `<==`
- Unused variables and signals
- Shadowing declarations
- BN254-specific issues

### Circom's Built-in Inspector

```bash
circom --inspect circuit.circom
```

This catches basic under-constraint issues. Always run it.

### Picus (Veridise)

Uses symbolic execution to find under-constrained signals:

```bash
picus verify circuit.r1cs
```

More thorough than static analysis, but slower. See [Picus on GitHub](https://github.com/Veridise/Picus).

### Ecne (0xPARC)

Formally verifies that outputs are uniquely determined by inputs:

```bash
julia --project=. src/Ecne.jl --r1cs circuit.r1cs
```

### zkFuzz

A mutation-based fuzzing framework specifically designed for ZK circuits:

- Mutates `<--` assignments to detect soundness bugs
- Tests both soundness (can't prove false statements) and completeness (can prove true statements)
- Has found 85 bugs including 59 zero-days in real-world circuits

## Advanced: How Exploits Actually Work

We've covered what can go wrong. Now let's see how attackers actually exploit these vulnerabilities. Understanding the attack workflow helps you think defensively.

### Anatomy of a Soundness Attack

A soundness bug lets an attacker prove a false statement. Here's the typical attack flow:

1. **Identify an unconstrained signal**: Find a signal assigned with `<--` that lacks a corresponding `===` constraint.
2. **Generate a valid witness**: Run the circuit normally with honest inputs to produce `witness.wtns`.
3. **Locate the target signal**: The witness file is binary, but the format is documented. Each signal occupies a known position.
4. **Modify the witness**: Overwrite the unconstrained signal with a malicious value that still satisfies all constraints.
5. **Generate the fake proof**: Use snarkjs to create a proof from the modified witness. The verifier will accept it.

**Example from RareSkills**: In a `Mul3` circuit with an unconstrained intermediate signal `i`, an attacker can modify the witness so that `i` equals any value they want. If the circuit was supposed to enforce `out = c`, the attacker can make `out` equal anything.

### The zkSync Era Case Study

In September 2023, ChainLight disclosed a critical soundness vulnerability in zkSync Era's ZK-EVM circuits.

**The Bug**: When handling memory write instructions, the circuit constructed a `MemoryWriteQuery` from a 256-bit register value split into two 128-bit limbs. A linear combination was supposed to enforce relationships between these limbs, but the constraint was insufficient.

**The Impact**: A malicious prover could generate "proofs" for invalidly executed blocks that the L1 verifier contracts would accept. Matter Labs deployed a fix and awarded ChainLight $50K.

---

## The Testing Mindset

Now that you understand the vulnerabilities and how they're exploited, let's talk about how to catch them before attackers do.

Static analysis catches patterns, but testing catches logic errors. And here's the kicker: **research shows that 96% of circuit-layer vulnerabilities are underconstrained bugs** (soundness issues). These are exactly the bugs that are hardest to test for.

### The Asymmetry Problem

There's a fundamental asymmetry in ZK testing that makes it so challenging:

- **Completeness bugs** (the circuit rejects valid inputs) are easy to find. Run the honest prover with legitimate inputs. If it fails, you found a bug.
- **Soundness bugs** (the circuit accepts invalid inputs) are hard to find. You have to think like an attacker. What malicious inputs would they try? What constraints might be missing?

To catch a soundness bug, you have to craft a witness that the circuit *should* reject but doesn't. You're essentially trying to break your own circuit.

### The Six Dimensions of Circuit Testing

Every circuit needs tests covering:

| Dimension | Question | What It Catches |
| --- | --- | --- |
| **Correctness** | Does it compute what we expect? | Logic errors |
| **Determinism** | Same inputs, same witness? | Non-deterministic behavior |
| **Collision Resistance** | Different inputs, different outputs? | Hash/commitment bugs |
| **Soundness** | Does it reject invalid inputs? | Missing constraints |
| **Boundaries** | What happens at extremes? | Overflow, underflow |
| **Fuzzing** | What about random inputs? | Edge cases we missed |

The soundness tests are the most important and the most often neglected. For every input in your circuit, write a test that corrupts that input and verifies the circuit rejects it. If it doesn't reject, you've found a missing constraint.

We cover testing methodology in depth in our [Testing Guidelines](./testing-guidelines).

## Quick Reference Checklist

Here's everything we've covered, distilled into a pre-flight checklist. Before shipping any circuit:

- [ ] Ran `circomspect` and addressed all warnings
- [ ] Ran `circom --inspect` and reviewed output
- [ ] Every signal uses `<==` unless documented otherwise
- [ ] Every `<--` has a corresponding `===` constraint
- [ ] No `assert` statements for security checks
- [ ] All comparator outputs are constrained
- [ ] Range checks on values that could overflow
- [ ] Merkle tree depths are validated
- [ ] Division operations check for zero divisors
- [ ] TypeScript reference implementations exist (your oracle for "what's correct?")
- [ ] Test suite covers all six dimensions
- [ ] Soundness tests for every input field (corrupt it, verify rejection)
- [ ] External audit for production deployment

> Remember: in ZK, security isn't about preventing crashes. It's about preventing valid proofs for false statements. Every unconstrained signal is an invitation for exploitation.

---

## Further Reading

**Security Research**:

- [Hacking Underconstrained Circom Circuits](https://rareskills.io/post/underconstrained-circom) - RareSkills (step-by-step exploitation guide)
- [AliasCheck and Num2Bits_strict](https://rareskills.io/post/circom-aliascheck) - RareSkills (deep dive on field aliasing)
- [Circom-Pairing: A Million Dollar ZK Bug](https://medium.com/veridise/circom-pairing-a-million-dollar-zk-bug-caught-early-c5624b278f25) - Veridise
- [Finding Soundness Bugs in ZK Circuits](https://muellerberndt.medium.com/finding-soundness-bugs-in-zk-circuits-ea23387a0e1e) - Bernhard Mueller
- [Common Circom Pitfalls - Part 1](https://blog.zksecurity.xyz/posts/circom-pitfalls-1/) - ZKSecurity
- [Common Circom Pitfalls - Part 2](https://blog.zksecurity.xyz/posts/circom-pitfalls-2/) - ZKSecurity
- [It Pays to be Circomspect](https://blog.trailofbits.com/2022/09/15/it-pays-to-be-circomspect/) - Trail of Bits

**Audit Reports**:

- [circom-bigint Audit](https://veridise.com/wp-content/uploads/2023/02/VAR-circom-bigint.pdf) - Veridise (14 bugs found, 9 critical)

**Bug Databases**:

- [bugs.zksecurity.xyz](https://bugs.zksecurity.xyz/) - Documented ZK vulnerabilities
- [0xPARC zk-bug-tracker](https://github.com/0xPARC/zk-bug-tracker) - Community bug tracker
- [zkbugs](https://github.com/zksecurity/zkbugs) - Reproducible exploits

**Tools**:

- [Circomspect](https://github.com/trailofbits/circomspect) - Static analyzer
- [Circomkit](https://github.com/erhant/circomkit) - Testing framework
- [Ecne](https://github.com/franklynwang/EcneProject) - Formal verification
- [zkFuzz](https://zkfuzz.xyz/) - Mutation-based fuzzing
