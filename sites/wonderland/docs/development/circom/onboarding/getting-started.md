---
sidebar_position: 1
title: Getting Started
---

# Circom Onboarding

Welcome to Wonderland's Circom onboarding. By the end of this journey, you'll be able to write secure circuits, test them properly, and avoid the pitfalls that have cost the ecosystem millions.

## What You'll Learn

1. **Foundations** - How ZK proofs work, what constraints are, why trusted setups exist
2. **Circom Language** - Templates, signals, the critical difference between `<--` and `<==`
3. **Hands-On Practice** - Progressive challenges from basic arithmetic to security puzzles
4. **Real Protocol** - Build Tornado Cash from scratch
5. **Security** - The vulnerabilities that have cost millions, and how to avoid them
6. **Testing** - Why circuit testing is fundamentally different from traditional testing
7. **Style** - How we write circuits at Wonderland

## The Curriculum

| Module | Description | Link |
|--------|-------------|------|
| **ZK Fundamentals** | Proofs, circuits, R1CS, trusted setups | [Overview](./zk-fundamentals) |
| **Circom Language** | Templates, signals, constraints vs witness | [Circom Overview](./circom-language) |
| **Challenges** | Progressive puzzles including security exploits | [Challenges](./challenges) |
| **Tornado Cash** | Full protocol implementation | [Remaking Tornado](./tornado-cash) |
| **Best Practices** | Security patterns and common vulnerabilities | [Best Practices](./best-practices) |
| **Testing** | Six-dimensional testing methodology | [Testing Guidelines](./testing-guidelines) |
| **Coding Style** | Wonderland conventions | [Coding Style](../coding-style) |

## Prerequisites

Before diving in, make sure you're comfortable with:

- **Solidity development** - It is useful to have completed our [Solidity onboarding](/docs/development/solidity/onboarding/getting-started)
- **Basic cryptography** - Hash functions, commitment schemes, basic finite field math
- **TypeScript** - For writing tests and reference implementations

New to zero-knowledge proofs entirely? Start with [Santiago Palladino's beginner guide](https://dev.to/spalladino/a-beginners-intro-to-coding-zero-knowledge-proofs-c56) before continuing.

## Environment Setup

### 1. Install Circom

```bash
# Install Rust (if needed)
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

# Clone and build Circom
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

# Verify installation
circom --version
```

### 2. Install snarkjs

```bash
npm install -g snarkjs
snarkjs --version
```

### 3. Install Circomspect (static analyzer)

```bash
cargo install circomspect
circomspect --version
```

### 4. Clone the Onboarding Repository

```bash
git clone https://github.com/wonderland-learning/onboarding-circom.git
cd circom-onboarding
```

## The Learning Path

This onboarding is structured as a progressive journey. Each section builds on the previous one.

### Phase 1: Foundations

| Module | What You'll Learn | Time |
|--------|------------------|------|
| [ZK Fundamentals](./zk-fundamentals) | Proofs, constraints, R1CS, trusted setups | 2-3 hours |
| [Circom Language](./circom-language) | Templates, signals, operators, constraint vs witness | 1-2 hours |

**Checkpoint**: You should be able to explain why `<--` is dangerous without `===`.

### Phase 2: Hands-On Practice

| Module | What You'll Build | Time |
|--------|------------------|------|
| [Little Circom Challenges](./challenges) | Progressively harder puzzles | 4-6 hours |
| [Remaking Tornado Cash](./tornado-cash) | Complete privacy protocol | 8-12 hours |

**Checkpoint**: All challenge tests passing. Tornado circuit verified on-chain.

### Phase 3: Security & Quality

| Module | What You'll Master | Time |
|--------|-------------------|------|
| [Best Practices](./best-practices) | Common vulnerabilities, defense patterns | 2-3 hours |
| [Testing Guidelines](./testing-guidelines) | Six-dimensional testing, soundness | 2-3 hours |
| [Coding Style](../coding-style) | Wonderland conventions, documentation | 1 hour |

**Checkpoint**: Can identify vulnerabilities in unfamiliar code. Test suite follows all six dimensions.

## Deliverables

By the end of this onboarding, you should have:

- [ ] All challenge puzzles passing (Easy, Medium, Hard, Security)
- [ ] A working Tornado Cash implementation with tests
- [ ] Written analysis of the Tornado cryptographic model
- [ ] Demonstrated ability to review circuit code for vulnerabilities

## Quick Reference

### The Golden Rules

1. **Use `<==` by default.** Only use `<--` when you can't express the constraint directly, and always pair it with `===`.

2. **Constrain all component outputs.** Comparators, equality checks, and logic gates are useless without `output === expectedValue`.

3. **Never trust `assert`.** It's witness-generation only, not a constraint.

4. **Test soundness, not just correctness.** Your circuit rejecting invalid inputs is more important than accepting valid ones.

5. **Reference implementations are mandatory.** If you can't write the logic in TypeScript, you don't understand it well enough to constrain it.

### Essential Commands

```bash
# Compile a circuit
circom circuit.circom --r1cs --wasm --sym

# Run static analysis
circomspect circuits/
circom --inspect circuit.circom

# Generate witness
node circuit_js/generate_witness.js circuit_js/circuit.wasm input.json witness.wtns

# Create proof
snarkjs groth16 prove circuit.zkey witness.wtns proof.json public.json

# Verify proof
snarkjs groth16 verify verification_key.json public.json proof.json
```

### Useful Links

- [Official Circom Docs](https://docs.circom.io/)
- [Circomlib](https://github.com/iden3/circomlib) - Standard library
- [ZKRepl](https://zkrepl.dev/) - Browser playground
- [bugs.zksecurity.xyz](https://bugs.zksecurity.xyz/) - Learn from real bugs

## Getting Help

Stuck? Here's what to do:

1. **Check the error message carefully.** Circom errors are often cryptic but informative.
2. **Use ZKRepl** to test small circuit fragments.
3. **Run `circomspect`** - it often catches the issue.
4. **Ask in your onboarding thread** on Discord with:
   - The circuit code (minimal reproduction)
   - The exact error message
   - What you've already tried

Ready to begin? Start with the [ZK Fundamentals](./zk-fundamentals) to understand how zero-knowledge proofs work, or jump straight to the [Challenges](./challenges) if you prefer learning by doing.
