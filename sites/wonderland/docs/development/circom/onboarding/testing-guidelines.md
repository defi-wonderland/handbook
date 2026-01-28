---
sidebar_position: 7
title: Testing Guidelines
---

# Circom Testing Guidelines

Testing ZK circuits is fundamentally different from testing traditional software. When you test a web API, you're checking that it returns the right response. When you test a ZK circuit, you're checking two very different things: that honest provers can create valid proofs (**completeness**), and that dishonest provers cannot create proofs for false statements (**soundness**).

This guide documents how we approach circuit testing at Wonderland, drawing on industry best practices and lessons learned from real-world vulnerabilities.

## Why Testing ZK Circuits is Hard

Before diving into methodology, let's understand why this is challenging.

### The Asymmetry Problem

Research shows that **96% of circuit-layer vulnerabilities are underconstrained bugs** (soundness issues). Yet testing for soundness is fundamentally harder than testing for completeness:

- **Completeness bugs** are easy to find: run the honest prover and check if valid inputs produce valid proofs
- **Soundness bugs** require crafting malicious witnesses that the circuit *should* reject but doesn't

To catch a soundness bug, you have to think like an attacker. What inputs would a malicious prover try? What constraints might be missing?

### The Test Oracle Problem

In traditional testing, you know when something is wrong: the function returns an unexpected value. In ZK circuits, a proof either verifies or it doesn't. The challenge is knowing whether a *valid* proof represents a *legitimate* computation.

This is why reference implementations matter so much, they give you an oracle to compare against.

## The Testing Philosophy

Our methodology is built on a simple premise: **circuits should be tested against a reference implementation that mirrors the circuit logic exactly**.

Why a separate reference? Because it's a "source of truth" independent of the circuit. If the reference and the circuit disagree, one of them is wrong. And usually it's easier to debug TypeScript than constraint systems.

We also believe in **multi-dimensional validation**. A circuit that computes the right output isn't necessarily secure. We test six dimensions:

| Dimension | Question | What It Catches |
| --- | --- | --- |
| **Correctness** | Does it compute what we expect? | Logic errors |
| **Determinism** | Same inputs, same witness? | Non-deterministic behavior |
| **Collision Resistance** | Different inputs, different outputs? | Hash/commitment bugs |
| **Soundness** | Does it reject invalid inputs? | Missing constraints |
| **Boundaries** | What happens at extremes? | Overflow, underflow |
| **Fuzzing** | What about random inputs? | Edge cases we missed |

## The Testing Stack

### Recommended Tools

| Tool | Purpose | Why |
| --- | --- | --- |
| **Circomkit** | Circuit testing framework | Type-safe, reduces boilerplate, fast witness testing |
| **Mocha + Chai** | Test framework | Standard, well-supported |
| **circomlibjs** | JS implementations | Poseidon, MiMC for reference |
| **circomspect** | Static analysis | Catches issues before tests |
| **circom --inspect** | Built-in analyzer | Quick underconstraint check |

The key insight is that **Circomkit** lets us test circuits without generating full proofs. We compute witnesses and check constraint satisfaction, which is orders of magnitude faster than the full prove/verify cycle.

### Circomkit Setup

```tsx
import { Circomkit, WitnessTester } from "circomkit";

export const circomkit = new Circomkit({
    verbose: false,
    protocol: "groth16",  // or "plonk", "fflonk"
    inspect: true,
    include: ["./node_modules", "./node_modules/circomlib/circuits"],
});
```

Circomkit provides type-safe testers. If your circuit has inputs `a`, `b` and output `out`:

```tsx
let circuit: WitnessTester<["a", "b"], ["out"]>;

before(async () => {
    circuit = await circomkit.WitnessTester("MyCircuit", {
        file: "path/to/circuit",
        template: "MyTemplate",
        params: [param1, param2],
    });
});
```

### Mocha Configuration

Circuit tests are slow. Set generous timeouts:

```json
{
  "node-option": ["loader=ts-node/esm"],
  "spec": ["test/**/*.test.ts"],
  "timeout": 300000,
  "exit": true,
  "recursive": true
}
```

## Project Structure

A well-organized circuit project separates concerns:

```
circuits/
├── circuits/
│   ├── templates/           # Reusable circuit templates
│   │   └── helpers/        # Small utility circuits
│   ├── main/               # Production instantiations
│   └── test/               # Test instantiations (smaller params)
├── test/
│   ├── common/
│   │   └── index.ts        # Shared utilities & reference implementations
│   ├── helpers/            # Tests for helper circuits
│   └── *.test.ts           # Main circuit tests
├── circuits.json           # Circuit configuration
└── .mocharc.json          # Test configuration
```

**Why separate `main/` and `test/`?** Production circuits often have large parameters (e.g., tree depth 32). Test instantiations use smaller parameters for faster iteration.

## Testing Patterns

### Pattern 1: Reference Implementation

Every circuit gets a TypeScript twin that computes the same thing:

```tsx
// reference.ts - mirrors your circuit logic exactly
export async function computeCommitment(
    secret: bigint,
    nullifier: bigint,
): Promise<bigint> {
    return await poseidon([secret, nullifier]);
}
```

Then test against it:

```tsx
it("should match reference implementation", async () => {
    const inputs = { secret: 123n, nullifier: 456n };
    const expected = await computeCommitment(inputs.secret, inputs.nullifier);
    await circuit.expectPass(inputs, { commitment: expected });
});
```

If this test fails, you know immediately: either your circuit or your reference has a bug.

### Pattern 2: Valid Input Factory

Complex circuits have many inputs. Build factories that generate complete, valid input sets:

```tsx
async function createValidInputs(overrides?: Partial<CircuitInputs>) {
    // Generate base valid inputs
    const secret = randomFieldElement();
    const nullifier = randomFieldElement();
    const commitment = await computeCommitment(secret, nullifier);

    // Build Merkle proof
    const tree = createTree([commitment, ...otherLeaves]);
    const proof = tree.generateProof(0);

    return {
        // Circuit inputs
        secret,
        nullifier,
        root: tree.root,
        siblings: padSiblings(proof.siblings, MAX_DEPTH),
        pathIndices: proof.pathIndices,

        // Test metadata (not passed to circuit)
        _commitment: commitment,

        // Allow overrides
        ...overrides,
    };
}
```

The `_` prefix convention marks values computed for verification but not passed to the circuit.

### Pattern 3: Soundness Test Matrix

Systematically corrupt each input and verify rejection:

```tsx
describe("Soundness", () => {
    let validInputs: CircuitInputs;

    beforeEach(async () => {
        validInputs = await createValidInputs();
    });

    it("should reject wrong secret", async () => {
        validInputs.secret = randomFieldElement();
        await circuit.expectFail(validInputs);
    });

    it("should reject wrong nullifier", async () => {
        validInputs.nullifier = randomFieldElement();
        await circuit.expectFail(validInputs);
    });

    it("should reject invalid Merkle root", async () => {
        validInputs.root = randomFieldElement();
        await circuit.expectFail(validInputs);
    });

    // One test per input field...
});
```

The `beforeEach` is crucial: fresh valid inputs for each test, so you know exactly which corruption caused the failure.

### Pattern 4: Multi-Configuration Testing

Parameterized circuits need testing across configurations:

```tsx
const CONFIGS = [
    { name: "small", params: [2, 8] },
    { name: "medium", params: [4, 16] },
    { name: "large", params: [8, 32] },
];

CONFIGS.forEach(({ name, params }) => {
    describe(`Configuration: ${name}`, () => {
        let circuit: WitnessTester<Inputs, Outputs>;

        before(async () => {
            circuit = await circomkit.WitnessTester(`Circuit_${name}`, {
                file: "templates/MyCircuit",
                template: "MyCircuit",
                params,
            });
        });

        // Run all test categories for this config
        runCorrectnessTests(circuit, params);
        runSoundnessTests(circuit, params);
        // ...
    });
});
```

Don't assume `(2, 8)` working means `(4, 16)` works. Different parameters exercise different code paths.

## The Six Test Categories

### 1. Correctness Tests

Does the circuit compute what we expect?

```tsx
describe("Correctness", () => {
    it("should match reference for known values", async () => {
        const inputs = { a: 3n, b: 5n };
        const expected = await reference(inputs);
        await circuit.expectPass(inputs, { out: expected });
    });

    it("should handle realistic production values", async () => {
        // Use actual addresses, realistic amounts
        const inputs = {
            address: BigInt("0x742d35Cc6634C0532925a3b844Bc454e4438f44e"),
            amount: 1000000000000000000n, // 1 ETH
        };
        const expected = await reference(inputs);
        await circuit.expectPass(inputs, { out: expected });
    });
});
```

### 2. Determinism Tests

Same inputs must always produce the same full witness:

```tsx
describe("Determinism", () => {
    it("should produce identical witnesses", async () => {
        const inputs = await createValidInputs();

        const witness1 = await circuit.calculateWitness(inputs);
        const witness2 = await circuit.calculateWitness(inputs);

        // Compare FULL witness, not just outputs
        expect(witness1).to.deep.equal(witness2);
    });
});
```

Why the full witness? Non-deterministic intermediate signals indicate undefined behavior that could be exploited.

### 3. Collision Resistance Tests

Different inputs must produce different outputs:

```tsx
describe("Collision Resistance", () => {
    it("should produce unique outputs for unique inputs", async () => {
        const outputs = new Set<string>();

        for (let i = 0; i < 100; i++) {
            const inputs = await createValidInputs();
            const witness = await circuit.compute(inputs, ["commitment"]);
            outputs.add(witness.commitment.toString());
        }

        expect(outputs.size).to.equal(100);
    });

    it("should be sensitive to each input field", async () => {
        const base = await createValidInputs();
        const baseOut = await circuit.compute(base, ["out"]);

        // Mutate each field and verify different output
        for (const field of Object.keys(base)) {
            if (field.startsWith("_")) continue;

            const mutated = { ...base, [field]: randomFieldElement() };
            const mutatedOut = await circuit.compute(mutated, ["out"]);

            expect(mutatedOut.out).to.not.equal(baseOut.out,
                `Output should change when ${field} changes`);
        }
    });
});
```

### 4. Soundness Tests

The circuit must reject invalid inputs:

```tsx
describe("Soundness", () => {
    it("should reject invalid Merkle proof", async () => {
        const inputs = await createValidInputs();
        inputs.root = randomFieldElement();

        await circuit.expectFail(inputs);
    });

    it("should reject values that violate constraints", async () => {
        const inputs = await createValidInputs();
        // Set output value higher than input (violates conservation)
        inputs.outputValue = inputs.inputValue + 1n;

        await circuit.expectFail(inputs);
    });

    it("should reject out-of-range values", async () => {
        const inputs = await createValidInputs();
        inputs.value = 2n ** 128n; // Exceeds allowed range

        await circuit.expectFail(inputs);
    });
});
```

### 5. Boundary Tests

Test the extremes:

```tsx
describe("Boundaries", () => {
    it("should handle zero", async () => {
        const inputs = await createValidInputs({ value: 0n });
        await circuit.expectPass(inputs);
    });

    it("should handle maximum valid value", async () => {
        const MAX_VALUE = 2n ** 128n - 1n;
        const inputs = await createValidInputs({ value: MAX_VALUE });
        await circuit.expectPass(inputs);
    });

    it("should reject overflow", async () => {
        const OVERFLOW = 2n ** 128n;
        const inputs = await createValidInputs({ value: OVERFLOW });
        await circuit.expectFail(inputs);
    });

    it("should handle field prime - 1", async () => {
        const P_MINUS_1 = FIELD_PRIME - 1n;
        const inputs = await createValidInputs({ secret: P_MINUS_1 });
        await circuit.expectPass(inputs);
    });
});
```

### 6. Fuzzing Tests

Random testing finds bugs you didn't think to look for:

```tsx
describe("Fuzzing", () => {
    it("should handle random valid inputs", async () => {
        for (let i = 0; i < 50; i++) {
            const inputs = await createValidInputs();
            const expected = await reference(inputs);
            await circuit.expectPass(inputs, { out: expected });
        }
    });

    it("should reject random invalid inputs", async () => {
        for (let i = 0; i < 50; i++) {
            const inputs = generateRandomInvalidInputs();
            await circuit.expectFail(inputs);
        }
    });
});
```

## Shared Utilities

Create a `test/common/` module with reusable utilities:

```tsx
// Circomkit instance
export const circomkit = new Circomkit({ /* config */ });

// Field constants
export const FIELD_PRIME = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

// Poseidon wrapper
let poseidonInstance: any;
export async function poseidon(inputs: bigint[]): Promise<bigint> {
    if (!poseidonInstance) {
        const { buildPoseidon } = await import("circomlibjs");
        poseidonInstance = await buildPoseidon();
    }
    return poseidonInstance.F.toObject(poseidonInstance(inputs));
}

// Random generators
export function randomFieldElement(): bigint {
    const bytes = new Uint8Array(31); // Stay under field size
    crypto.getRandomValues(bytes);
    return bytes.reduce((acc, b) => (acc << 8n) | BigInt(b), 0n);
}

export function randomBoundedValue(maxBits: number): bigint {
    const bytes = new Uint8Array(Math.ceil(maxBits / 8));
    crypto.getRandomValues(bytes);
    const mask = (1n << BigInt(maxBits)) - 1n;
    return bytes.reduce((acc, b) => (acc << 8n) | BigInt(b), 0n) & mask;
}

// Merkle tree helpers
export function padSiblings(siblings: bigint[], maxDepth: number): bigint[] {
    const padded = [...siblings];
    while (padded.length < maxDepth) padded.push(0n);
    return padded;
}
```

## Static Analysis: Run It First

Before writing tests, run static analysis:

```bash
# Circom's built-in inspector
circom --inspect circuits/main/MyCircuit.circom

# Circomspect (more thorough)
circomspect circuits/

# Allow specific warnings
circomspect circuits/ --allow P1000
```

Static analysis catches underconstraints faster than tests. Make it part of your workflow.

## CI/CD Integration

Recommended pipeline:

```yaml
jobs:
  static-analysis:
    steps:
      - run: circomspect circuits/
      - run: circom --inspect circuits/main/*.circom

  test:
    needs: static-analysis
    steps:
      - run: npm test
    timeout-minutes: 30

  build:
    needs: test
    steps:
      - run: npm run compile:all
      - run: npm run setup:all
```

**Key considerations:**

- **Timeouts**: Circuit tests are slow. 30+ minutes is normal.
- **Memory**: Witness generation needs RAM. Use larger CI runners.
- **Caching**: Cache `node_modules` and compiled circuits.
- **Parallelization**: Run different circuit tests in parallel jobs.

## Best Practices Summary

1. **Always test against reference implementations**
2. **Run static analysis before tests** (`circomspect`, `circom --inspect`)
3. **Test all six dimensions**: correctness, determinism, collision resistance, soundness, boundaries, fuzzing
4. **Use `beforeEach` for fresh fixtures in soundness tests**
5. **Test multiple configurations** for parameterized circuits
6. **Fuzz with 50+ random iterations minimum**
7. **Check constraint counts** - unexpected counts signal problems
8. **Document expected failures** with comments referencing circuit lines

## Further Reading

- [Circomkit](https://github.com/erhant/circomkit) - Testing framework documentation
- [circom-correctly-constrained](https://github.com/pluto/circom-correctly-constrained) - Reference on testing patterns
- [circom101](https://github.com/erhant/circom101) - In-depth Circom concepts
- [zkFuzz](https://zkfuzz.xyz/) - Mutation-based fuzzing for ZK circuits
- [0xPARC zk-bug-tracker](https://github.com/0xPARC/zk-bug-tracker) - Learn from real vulnerabilities
