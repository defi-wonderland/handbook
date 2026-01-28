---
sidebar_position: 2
title: ZK Fundamentals
---

# ZK Fundamentals

> *Zero Knowledge Proofs prove the validity of a computation, not knowledge of a certain fact. They do not carry out the computation. They take an agreed-upon computation, a proof that the computation was carried out, and the result of the computation, then determine if the prover really ran the computation and produced the output.*

This page covers the theoretical foundations of zero-knowledge proofs and Circom. If you prefer to learn by doing, head to the [Challenges](./challenges) and come back here when you want to understand *why* things work.

> *Want to go deeper? See the [0xPARC zkBook](https://0xparti.github.io/zkBook/)*

## Zero Knowledge Proofs

A zero-knowledge proof is a protocol between two parties:

The **prover** can convince the **verifier** that some **statement** is valid whilst revealing nothing more than the validity of the statement. And they have 3 core properties:

- **Completeness**: an honest prover can convince a verifier.
- **Soundness**: a malicious prover cannot convince a verifier.
- **Zero Knowledge**: the verifier learns nothing beyond the fact that the statement is true.

:::note
There are proving systems that are complete and sound, but not zero knowledge.
:::

Given a *circuit* and the inputs, the prover runs the circuit and generates a proof. Given the proof, the public input and the output the verifier can check that the prover knows the private input and executed the circuit. And lastly, the proof does not reveal anything about the private input.

## zkSNARKs

Succinct Non-Interactive Argument of Knowledge. They are not interactive, but we generally pay a price: a trusted setup. What SNARKs do is transform our R1CS constraints into Quadratic Algebraic Points (QAP) form. They will generate a relatively short proof, and there are implementations with constant verification time. SnarkJS is an implementation of zk-SNARKs.

## Arithmetic Circuits

zk-SNARKs can prove computational statements, but they can't operate on computations directly. The statement must first be converted into an *arithmetic circuit*, which is a circuit consisting of wires that carry values from a *finite field* $F_p$ and connect them through addition and multiplication gates $\mod p$.

Most computational problems we care about can be converted into arithmetic circuits, but it's not always obvious how.

### Finite Fields

Given a prime number $p$, the finite field $F_p$ consists of the set $\{0, 1, \dots, p-1\}$ on which we add and multiply numbers modulo p.

As an example, let's define $F_7 = \{0,1,2,3,4,5,6\}$, so we have a clock. What would be the result of $15 \mod 7$?

If you think of a rope going around the clock, it would make 2 complete rounds and then move till 1. That way, $15 \mod 7 = 1$.

For Ethereum and Circom, we work with the prime:

```
p = 21888242871839275222246405745257275088548364400416034343698204186575808495617
```

(those are 254 bits!)

This is the order of the [scalar field](https://en.wikipedia.org/wiki/Scalar_field) of the BN254 curve, as defined in [EIP-196](https://eips.ethereum.org/EIPS/eip-196).

For programmable cryptography, a circuit will take *input signals* that are values in $\{0,\dots,p-1\}$, and then it performs additions and multiplications $\mod p$, and produces outputs.

As an example, this circuit computes `out = a x b + c`:

```circom
template Example() {
    signal input a;
    signal input b;
    signal input c;
    signal output out;

    signal d;       // intermediate signal

    d <== a * b;    // multiplication gate (generates 1 constraint)
    out <== d + c;  // addition (free, no constraint)
}
```

The circuit has 5 signals:

- **Input signals**: a, b, c
- **Intermediate signal**: d
- **Output signal**: out

And 1 constraint, only the multiplication. The addition is *free* of constraints because they just combine into linear terms within an existing constraint (there is more about this in the R1CS section below).

### Constraints and R1CS

To use zk-SNARK protocols, we describe relationships between signals as a system of equations. These equations are called *constraints*, conditions that the signals must satisfy.

A **Rank-1 Constraint System (R1CS)** expresses each constraint in this form:

$$
(a_1 \times s_1 + \dots a_n \times s_n) \times (b_1 \times s_1 + \dots b_n \times s_n) = (c_1 \times s_1 + \dots c_n \times s_n)
$$

Where $s_1, \dots s_n$ are signals and a, b, c are constant coefficients. Constraints must be quadratic, linear or constant (no higher-degree terms allowed).

For our example circuit, the R1CS consists of:

```
d = a x b   (mod p)
out = d + c (mod p)
```

By substituting, we can combine them:

```
out = a x b + c (mod p)
```

Each multiplication gate becomes one constraint. Addition gates are "free" they just combine into the linear terms. This is why **constraint count** (roughly equal to multiplication count) is the primary metric for circuit complexity.

### The Witness

A witness is an assignment of concrete values to all signals in the circuit.

Given inputs, computing intermediate and output signals is straightforward. So why talk about *"circuit satisfiability"*? Because zero knowledge lets us prove we know values satisfying the circuit *"without revealing those values."*

Using our example circuit (`out = a x b + c`), suppose we want to prove we know `a` and `b` that produce a certain output:

- `a`, `b` as private inputs (hidden from verifier)
- `c`, `out` as public signals (known to verifier)

A **valid** witness in $F_7$: $\{a = 3, b = 4, c = 6, \text{out} = 4\}$ checks $3 \times 4 + 6 = 18 \equiv 4 (\mod 7)$

An **invalid** witness: $\{a = 1, b = 2, c = 1, \text{out} = 0\}$ fails because $1 \times 2 + 1 = 3 \not\equiv 0 \space (\mod 7)$

:::warning
Circuits must be designed so public signals don't leak private inputs. If in this example $b$ were public instead of private, an attacker could solve $a = \frac{(\text{out} - c)}{b \mod p}$ directly from the constraint structure, the private value would be trivially recoverable. Real circuits **MUST** ensure the relationship between public and private signals doesn't allow such back-solving.
:::

### What Operations Can You Represent?

Since circuits only have addition and multiplication gates, some operations require tricks:

| **Operation** | **Native?** | **How** |
| --- | --- | --- |
| **Addition** | ✅ | Direct gate |
| **Multiplication** | ✅ | Direct gate |
| **Subtraction** | ✅ | Add the additive inverse (a - b = a + (p - b)) |
| **Division** | ⚠️ | Multiply by multiplicative inverse |
| **Comparison (`<`, `>`)** | ⚠️ | Decompose into bits, compare bit by bit |
| **Conditionals** | ⚠️ | Compute both branches, select with multiplication |
| **Loops** | ⚠️ | Unroll at compile time (fixed iteration count) |
| **Bitwise ops** | ⚠️ | Binary decomposition |

## Compilation, Execution and Proving

Working with circuits involves three distinct phases: compiling your circuit into constraints, executing it with concrete inputs to produce a witness, and generating a cryptographic proof.

The Circom compiler takes the `.circom` source file and produces two artifacts:

- **R1CS File:** The Rank 1 Constraint System encoding all the mathematical constraints your circuit must satisfy. This is static, it defines *what* relationships must hold between signals.
- **Witness generator:** An executable program that knows *how* to compute valid signal values given inputs. It embeds the circuit's logic but contains no cryptography.
- Executing the circuit means obtaining the value for all signals, and that is the witness itself.

### Execution

You feed concrete values (both public and private inputs) into the witness calculator. It runs deterministic computation and outputs a **witness file** containing assignments for every signal in the circuit.

This phase is just computation. No proofs yet, no cryptography. The witness calculator is essentially a normal program that happens to produce outputs satisfying R1CS constraints.

### Proving

This is where the cryptography happens. SnarkJS takes three inputs:

- The R1CS (what constraints exist)
- The witness (values satisfying those constraints)
- A proving key (from the trusted setup)

It produces a **proof** (a succinct cryptographic object). "Succinct" means the proof size and verification time stay small regardless of how complex the original computation was.

Anyone can then verify this proof using:

- The verification key (public, from trusted setup)
- The public inputs/outputs

The verifier learns nothing about the private inputs, only that *some* valid assignment exists that satisfies all constraints.

## Trusted Setups

A **trusted setup** is a one-time ceremony that generates cryptographic parameters required by certain proving systems. The ceremony produces structured reference strings (SRS) that embed a secret, this secret must be forgotten afterward, because anyone who knows it can forge proofs (that is also called the *toxic waste*).

### Powers of Tau

A powers-of-tau setup consists of two series of elliptic curve points:

$$
[G_1, G_1 \times s, \dots, G_1 \times s^{n-1}] \space \space \space
[G_2, G_2 \times s, \dots, G_2 \times s^{m-1}]
$$

$G_1$ and $G_2$ are the generator points of the two curve groups (in BLS12-381, $G_1$ points are 48 bytes compressed, $G_2$ are 96 bytes). The value $s$ is the secret, which is used to generate all these points, and then must be destroyed.

To make a [KZG commitment](https://www.zkdocs.com/docs/zkdocs/commitments/kzg_polynomial_commitment/) to a polynomial $P(x) = \sum c_i \times x^i$, you compute $\sum c_i \times S_i$ where $S_i = G_1 \times s^i$. The $G_2$ points enable verification of polynomial evaluations via [pairings](https://vitalik.eth.limo/general/2017/01/14/exploring_ecp.html).

### Why Hidden Relationships Matter

Consider the alternative: you could use random, unrelated points $S_0, S_1, \dots, S_{n-1}$ as your commitment basis. This is what IPA (Inner Product Argument) proofs do. The problem is that a commitment to polynomial $P(x)$ under one set of base points commits to a *different* polynomial under modified base points. If you double $S_2$, you halve the coefficient $c_2$ in what the commitment represents.

This means any verification procedure must somehow account for every single base point, which is basically impossible to compute.

With a trusted setup, there is a guaranteed mathematical relationship $S_{i+1} = s \times S_i$ with the same factor between every adjacent pair. An *edited* setup $S_0, S_1, 2 \times S_2, S_3, \dots$ cannot be valid, because the relationship breaks. This lets us verify in constant time using pairings instead of touching every point.

### Why the Secret Breaks Everything

If $s$ is known, the commitment scheme collapses. A commitment $C$ to polynomial $P(x)$ is also a valid commitment to:

- $P(x)\times x / s$
- $P(x) - x + s$
- infinitely many other polynomials

The attacker can craft proofs for false statements. The secret must exist momentarily to create the algebraic structure, then vanish.

### Multi-Participant Ceremonies

A single-participant setup requires trusting one person. The solution is chaining participants, so secrets multiply together.

Participant receives the current setup and picks their own random $t$:

$$
\text{Input}:  [G_1, G_1\times s, G_1 \times s^2, ...]
$$
$$
\text{Output}: [G_1, G_1\times s \times t, G_1\times s^2 \times t^2, ...] = [G_1, G_1 \times (st), G_1 \times (st)^2, ...]
$$

The new secret is $s\times t$. Finite fields have the property that if you know $s$ but not $t$, and $t$ is uniformly random, you know *nothing* about $s \times t$. Chain hundreds of participants, and the combined secret is unknowable as long as any single participant deletes their contribution.

### Verifying the Ceremony

Each participant publishes a proof: the $G_1 \times s$ point they received, plus $G_2 \times t$ (their contribution). This enables a pairing check at each step:

$$
e(G_1\times(s\times t), G_2) = e(G_1\times s, G_2 \times t)
$$

This verifies the output actually incorporates both the previous setup and the new secret, preventing a malicious last participant from replacing everything with their own setup.

To verify the powers are correctly constructed (same $s$ between all adjacent points), you'd naively check $e(S_{i+1}, G_2) = e(S_i, G_{2} \times s)$ for every $i$. That's $O(n)$ pairings. Instead, take random linear combinations:

$$
L_1 = \sum{r_i\times S_i} \text{ for i = 0 to n-1}
$$
$$
L_2 = \sum{r_i\times S_{i+1}} \text{ (same coefficients, shifted by one)}
$$

A single pairing check $e(L_2, G_2) = e(L_1, G_2 \times s)$ verifies the entire structure with overwhelming probability.

In practice we will have a two phase setup:

1. **Powers of Tau (universal):** Produces curve points reusable by any circuit on that curve. Ethereum's BN254 ceremony had thousands of participants. This only needs to happen once per curve.
2. **Circuit-specific phase:** Transforms the universal setup into proving/verification keys for a particular R1CS. This is deterministic, so there are no new secrets, anyone can compute it.

When we run `snarkjs groth16 setup`, we're doing the circuit-specific phase against an existing Powers of Tau transcript.
