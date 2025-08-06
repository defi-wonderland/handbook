# Zero-Knowledge Proofs

Imagine you want to prove a fact without revealing any details behind it. Sounds paradoxical? That’s the heart of **zero-knowledge proofs** (ZKPs).

Whether it’s showing you own a password, know a secret key, or that a number is a square modulo a composite, ZKPs let you *convince without revealing*.

## What Is a ZKP?

A **zero-knowledge proof** is a protocol between two parties:
- **Peggy**, the *prover*, who knows some secret (called the witness),
- **Victor**, the *verifier*, who wants to be convinced that Peggy knows the secret.

A ZKP lets Peggy convince Victor that a statement is true, without revealing *why* it’s true.

More formally, a ZKP satisfies three properties:
- **Completeness**: If the statement is true and Peggy follows the protocol, Victor will be convinced.
- **Soundness**: If the statement is false, a cheating Peggy cannot convince Victor (except with very low probability).
- **Zero-knowledge**: Victor learns nothing beyond the truth of the statement, not even the witness Peggy holds.

## Example: Proving You Know a Secret Number

Let’s say Peggy wants to prove she knows a secret number `x`, such that:

$$Y = g^x$$

Here, $g$ is a known group generator and $Y$ is a public value. This is called a **proof of knowledge of a discrete logarithm**. The naive approach would be for Peggy to send `x`, but that defeats the purpose,  we want to prove **without revealing** $x$.

## First Attempt: Blinding with Randomness

Peggy tries hiding the secret with a random number $k$. She sends:
$s = k + x$

Victor checks:
- $g^s$ should equal $Y * g^k$

- This checks out if $s = k + x$ 
- But it's insecure — Victor can just compute `x = s - k`


## Second Attempt: Hiding the Randomness in the Exponent

Peggy now sends:
- $R = g^k$

She computes:
- $s = k + x$

Victor verifies:
- $g^s == R * Y$

Now, Victor can’t compute $x$, because he doesn’t know $k$ and solving $R = g^k$ is hard (the discrete log problem). But... this version still has a **fatal flaw**.

## Third Attempt: Preventing Cheating

Peggy could cheat by choosing $s$ and computing a fake $R = g^s / Y$. That makes the check pass — without her knowing $x$.

To prevent this, Victor needs to add his own randomness. This leads us to a **three-step interactive protocol** known as a **Sigma protocol**:

1. **Commitment**: Peggy sends $R = g^k$
2. **Challenge**: Victor sends a random challenge $c$
3. **Response**: Peggy replies with $s = k + c * x$

Victor verifies:
$$ g^s ?= R \times Y^c $$

- Peggy must know `x` to produce `s` that satisfies the equation  
- If she guesses `c`, she’s wrong with high probability

This is called the **Schnorr identification protocol** and it’s:
- Complete 
- Sound 
- Zero-knowledge (in the honest-verifier model) 

## Making It Non-Interactive: Fiat-Shamir Heuristic

While elegant, Sigma protocols are **interactive** — Peggy and Victor need to be online at the same time.

In 1986, **Fiat and Shamir** proposed a solution: replace the random challenge `c` with a **hash of the transcript**.

Peggy computes:
```rust
c = H(R, message)
s = k + c \* x
```

She sends $(R, s)$ to anyone.  
Anyone can verify:
$g^s \stackrel{?}{=} R \cdot Y^{H(R, \text{message})}$
:::note Reference
This is a **digital signature**: a non-interactive zero-knowledge proof that the signer knows `x` and signed a message.
:::

## Another Classic Example: Proving a Square Root Modulo N

Peggy publishes `N = p * q`, a large composite number (only she knows `p` and `q`). She wants to prove that a number `y` is a **square modulo N** — that is, there exists `x` such that:

```rust
x^2 ≡ y mod N
```

She does not want to reveal `x`.

The protocol goes like this:

1. Peggy picks random `r`, computes `s = r^2 mod N`, and sends `s` to Victor
2. Victor sends a random challenge bit `β ∈ {0, 1}`
3. Peggy replies with:
   - `z = r` if `β = 0`
   - `z = x * r` if `β = 1`

Victor checks:
- If `β = 0`: `z^2 ≡ s mod N`
- If `β = 1`: `z^2 ≡ y * s mod N`

Why it works:
- If Peggy knows `x`, she can always respond correctly
- If not, she can only cheat on one of the two cases (50% chance)
- Repeating the protocol 80 times reduces the chance of cheating to 2⁻⁸⁰

:::note reference
This is a **perfect zero-knowledge proof**, Victor gains nothing except confidence that the statement is true.
:::

## What Makes It “Zero-Knowledge”?

Victor learns nothing useful, because:

- He could have simulated the interaction on his own by generating random triples $(s, β, z)$ that satisfy the equations
- If someone else (like Trudy) sees the transcript, they gain no proof, because Victor could have faked it

Different levels of zero-knowledge:
- **Perfect**: Simulated and real transcripts are *identical*
- **Statistical**: They are *almost* identical
- **Computational**: No efficient algorithm can tell the difference

# References

Wong, D. (n.d.). Real-World Cryptography
Hoffstein, J., Pipher, J., & Silverman, J. H. (2008). An introduction to mathematical cryptography. Springer.
