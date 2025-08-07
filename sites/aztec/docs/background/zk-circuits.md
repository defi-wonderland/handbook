# Circuits

Before we dive into how programs are written and proven in zero-knowledge systems, we first need to understand what a **circuit** is. In the context of ZKPs, circuits represent computations, but not in the way you might be used to from programming languages. Instead, these computations are expressed through mathematical constraints.

Let’s start from something familiar: arithmetic circuits.

## What is an Arithmetic Circuit?

An **arithmetic circuit** is a digital structure built to perform basic operations like addition, subtraction, multiplication, and division on binary inputs. Think of them as the hardware-level equivalent of arithmetic in your calculator or CPU.

At their core, arithmetic circuits are composed of interconnected **gates**:
- Adders (which sum values),
- Subtractors,
- Multipliers,
- Dividers.

These gates take inputs (like binary numbers), perform operations, and output results. More complex circuits can be built by chaining simpler ones together. For example, a **ripple-carry adder** combines multiple full adders to add multi-bit numbers, and a **Wallace tree multiplier** speeds up large multiplications.

While arithmetic circuits are common in digital electronics, their abstraction is equally useful in zero-knowledge settings, except we swap logic gates and binary data for **mathematical expressions over finite fields**.

## Arithmetic Circuits as Math

To translate this into zk-friendly terms, an arithmetic circuit is now seen as a **collection of mathematical constraints** over variables.

Instead of gates working on binary wires, we now have equations like:

```rust
x * y = z
```

Each constraint is a statement that must hold true for the entire computation to be valid. The variables `x`, `y`, and `z` are not constants, they’re **signals**, or unknown values, that the prover must assign in such a way that all constraints are satisfied.

For example, to represent the expression `c = (a * b)^2`, you can't write it directly in many ZK languages. Instead, you'd define intermediate variables like:

```rust
ab = a * b
c = ab * ab
```

Then you'd enforce constraints to ensure those equalities hold:

```rust
ab - a * b = 0
c - ab * ab = 0
```

## Introducing ZK Circuits

Now that we understand arithmetic circuits, we can define what a **zk circuit** is:

> A zk circuit is a mathematical representation of a computation, broken down into a set of constraints that must be satisfied. It is the formal object that gets proven inside a zero-knowledge proof.

In other words, a zk circuit doesn’t “run” like a program, but it defines what *must be true* about inputs, outputs, and intermediate steps, in order for a statement to be accepted.

Once the circuit is defined, we can do three things:
1. **Execute it** with actual inputs to compute all variables.
2. **Generate a proof** that all constraints are satisfied (using a zk proving system).
3. **Verify the proof** without learning anything about private inputs.

## What Makes ZK Circuits Special?

ZK circuits have a few key properties that distinguish them from regular programs:

### 1. **Constraints**
We will not write `if`/`else` or loops (though some languages support a form of them). Instead, your logic becomes a series of algebraic equalities (constraints) that the prover must satisfy.

For example:

```rust
x == 0 → y must be 1
x != 0 → y must be 0
```

is encoded using clever algebraic tricks and additional variables.

### 2. **Finite fields**
All arithmetic happens inside a **finite field**, meaning that values “wrap around” a large prime number. So, we will be working with elements in a modulo arithmetic system.

:::note Reference
See [this article](https://www.web3citizen.xyz/research/zk/articles/zk-101) for reference on the math side of things.
:::

### 3. **Execution vs. constraint generation**
When you write a zk circuit in a language like Circom or Noir, you're actually writing *two overlapping programs*:
- One part computes the **witness** (all intermediate values),
- The other defines the **constraints** (what must be true about those values).

If you forget to constrain a variable, it may lead to subtle bugs, called **underconstrained computation**, where a dishonest prover can produce a valid-looking proof for an invalid statement.

## Building Blocks of a zk Circuit

Every zk circuit has the following parts:

- **Inputs**: Divided into *public inputs* (known to the verifier) and *private inputs* (only known to the prover).
- **Intermediate variables**: Computed during the witness generation step.
- **Constraints**: Algebraic relationships that all variables must satisfy.
- **Outputs**: Values that are revealed and verified.

## Example: Proving a Squared Product

Let’s say you want to prove that you know two values `a` and `b`, such that the output `c` is equal to `(a * b)^2`.

In Circom, that might look like:

```js
template MultiplierSq() {
  signal input a;
  signal input b;
  signal output c;
  signal ab;

  ab <== a * b;
  c <== ab * ab;
}
```

This template enforces two constraints:

* `ab - a*b = 0`
* `c - ab*ab = 0`

The prover fills in actual values, computes `ab` and `c`, and then generates a zk proof that all constraints were satisfied.

The verifier, with just `c` and the proof, can be convinced that `a` and `b` exist — without learning anything about them.

:::note reference
We strongly suggest that you read [this article](https://dev.to/spalladino/a-beginners-intro-to-coding-zero-knowledge-proofs-c56) by Santiago Palladino to grasp the concept even further.
:::