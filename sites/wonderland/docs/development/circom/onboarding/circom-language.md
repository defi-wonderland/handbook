---
sidebar_position: 3
title: Circom Language
---

# Circom Language

The Circom language helps us create an *arithmetic circuit*, and the compiler generates *R1CS constraints* and the *witness calculator*.

:::info
Circom 2.0 applies strong type checking and static analysis to early detect programs that do not meet the intended semantics of the language.
:::

The aim of a Circom program is twofold:

- Provide a symbolic description of the circuit, and
- Provide an efficient way to compute the witness from the inputs (`wasm` or `C++`).

Programmers must explicitly add all constraints. Constraints can be simplified and signals removed at compilation time, but new signals are never introduced.

The main challenges in Circom are distinguishing constraint-generation code from witness-generation code, and tracking what values are [known at compile-time](https://docs.circom.io/circom-language/circom-insight/unknowns/) versus runtime. Some language constructs only work for witness generation, like [boolean or comparison operators](https://docs.circom.io/circom-language/basic-operators/), or require compile-time values, such as [control flow statements](https://docs.circom.io/circom-language/control-flow/). Understanding constraint versus witness generation times helps prevent underconstrained computation bugs.

## Templates and Components

:::tip
These notes are based on [this class by the Iden3 team](https://www.youtube.com/watch?v=6XxVeBFmIFs).
:::

Actual circuits are called **components**. A component is created by instantiation of a **template**, which is a parameterized general description of a circuit.

```circom
template Multiplier() {
    signal input in1;
    signal input in2;
    signal output out;
    out <== in1 * in2;
}

component main = Multiplier();
```

## The Three Operators

A key feature is that Circom provides different instructions to:

### `===` — Constraint Only

Work only at the symbolic level (defining new constraints), saying **"this should be constrained"**:

```circom
out === in1 * in2;
```

### `<--` — Assignment Only

Work at the computational level (defining how to compute a signal):

```circom
out <-- in1 * in2;
```

This assigns a value to `out` but creates **no constraint**.

### `<==` — Assignment AND Constraint

Do both with a single operator:

```circom
out <== in1 * in2;
```

This will generate a constraint `in1 * in2 - out = 0`.

## When You Can't Use `<==`

It would be desirable to always use `<==` because then we get both: the value of the signal from other signals and also a constraint. Sometimes it's not possible.

Let's say we want to design a circuit that checks if the input is zero:

```circom
template isZero() {
    signal input in;
    signal output out;

    out <== (in == 0);  // ❌ COMPILER ERROR!
}
```

The compiler will say **NO!** because `(in == 0)` is not a quadratic constraint. So you might try:

```circom
template isZero() {
    signal input in;
    signal output out;

    out <-- (in == 0);  // ⚠️ NO CONSTRAINT!
}
```

But now we don't have an actual constraint... so what can we do?

```circom
template isZero() {
    signal input in;
    signal output out;

    signal inv;
    inv <-- in != 0 ? 1/in : 0;
    out <== -in * inv + 1;
    in * out === 0;
}
```

This works by introducing an intermediate signal that expresses the inverse of the input signal. We assign the value with `<--` **and also** add the constraint `in * out === 0`.

:::warning
Using `<--` and `===` does not guarantee the equivalence between the symbolic and computational representations of the circuit. It is the programmer's responsibility to ensure they match.
:::

## Composing Templates

Circuits are built by combining templates (from circomlib library for example):

```circom
template MultiAND(n) {
    signal input in[n];
    signal output out;

    var sum = 0;  // Variables can change, signals cannot
    for (var i = 0; i < n; i++) {
        sum = sum + in[i];
    }

    component isz = IsZero();
    isz.in <== sum - n;
    out <== isz.out;
}
```

We use the **variable** `sum` to compute an addition inside a loop and a parameter `n` to fix the number of input signals.

Variables are *symbolic expressions* when building constraints and *numbers* in the field when computing the witness.

## Constraints vs. Witness Computation

A Circom program has two representations:

- The R1CS constraints
- The executable code (witness generator)

**The compiler does not check whether they are related or not.** If `<--` is not used, we are safe. Otherwise, it is the programmer's responsibility to show that the code is safe: both must express the same relation between signals, and the computed witness MUST be the only solution to the constraints.

## Circom 2.0 Changes

There have been important changes in Circom 2.0:

### Semicolons are Mandatory

`;` is required at the end of statements.

### Public/Private Keywords

`private` and `public` are not used in templates anymore. The only remaining keyword is `public`, which is used when defining the main component:

```circom
template Multiplier() {
    signal input in1;
    signal input in2;
    signal output out;
    out <== in1 * in2;
}

component main {public [in1, in2]} = Multiplier();
```

- All **output signals** of main component are public
- **Input signals** of main component are private if not stated otherwise
- All other signals are private and cannot be made public

### No Signal-Dependent Control Flow

In Circom 2.0 the circuit can never depend on the value of a signal. Think of it as a physical circuit. Constraint generation cannot depend on unknown information at compile time.

```circom
// ❌ NOT ALLOWED
template Bad() {
    signal input x;
    signal output y;

    if (x < 6) {  // Can't branch on signal value!
        y <== x * 2;
    }
}
```

This is **NOT** allowed because constraints would depend on the value of the condition, which is unknown during constraint generation.

### Other Changes

- Signals and components must be defined at level 0
- Arrays must have constant size at compile time
- All paths in the control flow of a function must have a return statement

## Resources

- [Santiago Palladino's Beginner Guide](https://dev.to/spalladino/a-beginners-intro-to-coding-zero-knowledge-proofs-c56)
- [Official Circom Docs](https://docs.circom.io/)
- [0xPARC Learning Materials](https://learn.0xparc.org/materials/circom/learning-group-1/intro-zkp)
- [RareSkills Circom Tutorial](https://rareskills.io/post/circom-tutorial)
- [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)
- [PLONK Paper](https://eprint.iacr.org/2019/953.pdf)
- [gnark Documentation](https://docs.gnark.consensys.net/)
