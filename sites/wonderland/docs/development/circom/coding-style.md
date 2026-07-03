---
sidebar_position: 2
title: Coding Style
---

# Circom Coding Style Guide

> *Code is read far more often than it's written. Write for the reader.*

This guide documents our conventions for writing Circom circuits at Wonderland. Following these patterns makes code easier to review, audit, and maintain.

## File Organization

### Project Structure

```
circuits/
├── templates/              # Reusable circuit templates
│   └── helpers/           # Small utility circuits
├── main/                  # Production instantiations
├── test/                  # Test instantiations (smaller params)
├── circuits.json          # Circuit configuration
└── docs/                  # Technical documentation
```

**Why this structure?**

- **templates/**: Contains the actual circuit logic. These are parameterized and reusable.
- **main/**: Production wrappers that instantiate templates with real parameters.
- **test/**: Test wrappers with smaller parameters for faster iteration.
- **helpers/**: Small, single-purpose circuits that compose into larger ones.

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Templates | PascalCase | `NoteCommitment.circom` |
| Main instantiations | lowercase | `deposit.circom` |
| Test instantiations | lowercase_config | `transact_2x2.circom` |
| Helpers | PascalCase | `ValueConservation.circom` |

## Template Structure

Every template follows the same structure. This makes code scannable and predictable.

```circom
pragma circom 2.1.0;

// ============================================================
// INCLUDES
// ============================================================
include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "../helpers/NoteCommitment.circom";

/**
 * @title MyCircuit
 * @notice One-line description of what this circuit does
 * @dev Detailed explanation of the algorithm:
 *      - Step 1: What happens first
 *      - Step 2: What happens next
 *      - Key insight: Why this approach works
 * @param maxDepth Maximum tree depth supported
 * @param nInputs Number of input notes
 */
template MyCircuit(maxDepth, nInputs) {
    // ======================== INPUT SIGNALS ========================
    signal input publicValue;         // Publicly known value
    signal input privateSecret;       // Hidden from verifier
    signal input siblings[maxDepth];  // Merkle proof siblings

    // ======================== OUTPUT SIGNALS ========================
    signal output commitment;         // The resulting commitment
    signal output nullifierHash;      // For double-spend prevention

    // ======================== CONSTRAINTS ========================

    // 1. Compute the commitment
    // Binds the public and private inputs together
    component hasher = Poseidon(2);
    hasher.inputs[0] <== publicValue;
    hasher.inputs[1] <== privateSecret;
    commitment <== hasher.out;

    // 2. Validate the value range
    // Prevents overflow attacks on comparison
    component comparator = LessThan(128);
    comparator.in[0] <== publicValue;
    comparator.in[1] <== 2 ** 128;
    comparator.out === 1;

    // 3. Compute nullifier hash
    // Used to prevent double-spending without revealing the secret
    component nullHasher = Poseidon(1);
    nullHasher.inputs[0] <== privateSecret;
    nullifierHash <== nullHasher.out;
}
```

### The Three Sections

1. **INPUT SIGNALS**: All inputs, grouped by purpose
2. **OUTPUT SIGNALS**: All outputs
3. **CONSTRAINTS**: The constraint logic, with intermediate signals and components declared just before they're used

## Naming Conventions

### Signals

| Type | Convention | Examples |
|------|------------|----------|
| Inputs | camelCase, descriptive | `inputValue`, `ownerAddress`, `treeDepth` |
| Outputs | camelCase, descriptive | `commitment`, `nullifierHash`, `isValid` |
| Arrays | plural camelCase | `siblings`, `pathIndices`, `inputValues` |
| Booleans | `is` prefix | `isValid`, `isEqual`, `isInRange` |

### Templates

| Type | Convention | Examples |
|------|------------|----------|
| Main templates | PascalCase, noun | `Deposit`, `Transact`, `Withdraw` |
| Helper templates | PascalCase, describes function | `NoteCommitment`, `ValueConservation` |
| Parameters | camelCase | `maxDepth`, `nInputs`, `fieldBits` |

### Components

```circom
// Good: descriptive names that indicate purpose
component commitmentHasher = Poseidon(4);
component rangeCheck = LessThan(128);
component merkleProof = BinaryMerkleRoot(maxDepth);

// Bad: generic names
component p = Poseidon(4);
component lt = LessThan(128);
component tree = BinaryMerkleRoot(maxDepth);
```

## Comments

### JSDoc Headers

Every template needs a JSDoc header:

```circom
/**
 * @title NoteCommitment
 * @notice Computes a commitment for notes in the protocol
 * @dev precommitment = Poseidon(addressHash, tokenId, value, metadata)
 *      commitment = Poseidon(precommitment, label)
 * @param None - this template has no parameters
 */
```

Required tags:
- `@title`: Template name
- `@notice`: One-line user-facing description
- `@dev`: Technical details, algorithm explanation
- `@param`: For each template parameter

### Section Headers

Use visual separators to organize code:

```circom
// ======================== INPUT SIGNALS ========================

// ======================== OUTPUT SIGNALS ========================

// ======================== CONSTRAINTS ========================
```

### Inline Comments

```circom
// Good: explains WHY, not WHAT
// Constrain to 128 bits to prevent aliasing attacks on comparison
component valueBits = Num2Bits(128);

// Bad: restates the code
// Create Num2Bits component with 128 bits
component valueBits = Num2Bits(128);
```

For constraint logic, use numbered steps:

```circom
// 1. Compute precommitment
// Binds owner, value, and metadata to prevent manipulation
component precommitmentHasher = Poseidon(4);
precommitmentHasher.inputs[0] <== ownerAddressHash;
// ...

// 2. Compute final commitment
// Adding the label allows different commitment types
component commitmentHasher = Poseidon(2);
// ...
```

## Constraint Patterns

### Always Use `<==` When Possible

```circom
// Good: combined assign + constrain
output <== a * b;

// Only use this pattern when you can't express directly
result <-- complexNonQuadraticComputation();
result === verifiableEquivalent;
```

### Always Constrain Component Outputs

```circom
// Good: comparator output is constrained
component isValid = LessThan(128);
isValid.in[0] <== value;
isValid.in[1] <== maxValue;
isValid.out === 1;  // ALWAYS constrain!

// Bad: comparator output ignored
component isValid = LessThan(128);
isValid.in[0] <== value;
isValid.in[1] <== maxValue;
// isValid.out not constrained - VULNERABILITY!
```

### Range Checks Before Comparisons

```circom
// Good: validate range before comparing
component valueBits = Num2Bits(128);
valueBits.in <== value;

component lt = LessThan(128);
lt.in[0] <== value;
lt.in[1] <== maxValue;
lt.out === 1;

// Bad: compare without range validation
component lt = LessThan(252);  // Vulnerable to aliasing!
lt.in[0] <== value;
lt.in[1] <== maxValue;
lt.out === 1;
```

### Declare Before Use

Intermediate signals and components should be declared immediately before they're used, not in a separate section at the top:

```circom
// Good: declare right before use
// 1. Hash the inputs
component hasher = Poseidon(2);
hasher.inputs[0] <== a;
hasher.inputs[1] <== b;

// 2. Store intermediate result
signal intermediate;
intermediate <== hasher.out * 2;

// Bad: declaring everything at the top
signal intermediate;
component hasher = Poseidon(2);
// ... lots of code later ...
hasher.inputs[0] <== a;  // Hard to follow
```

### Loop Patterns

```circom
// Good: declare array, then use in loop
component hashers[nInputs];
for (var i = 0; i < nInputs; i++) {
    hashers[i] = Poseidon(2);
    hashers[i].inputs[0] <== values[i];
    hashers[i].inputs[1] <== salts[i];
    commitments[i] <== hashers[i].out;
}

// Accumulator pattern with var-to-signal conversion
var sum = 0;
for (var i = 0; i < nInputs; i++) {
    sum = sum + values[i];
}
// Convert var to signal to constrain it
signal totalSum;
totalSum <== sum;
```

## Common Anti-Patterns

### Don't Trust `assert`

```circom
// WRONG: assert doesn't create constraints
template Bad() {
    signal input x;
    assert(x > 0);  // Prover can ignore this!
}

// RIGHT: use actual constraints
template Good() {
    signal input x;
    component isPositive = GreaterThan(252);
    isPositive.in[0] <== x;
    isPositive.in[1] <== 0;
    isPositive.out === 1;
}
```

### Don't Use 254-bit Comparisons

```circom
// WRONG: vulnerable to aliasing
component lt = LessThan(254);

// RIGHT: use 252 max, or better yet, match your value's actual range
component lt = LessThan(128);  // For 128-bit values
```

### Don't Ignore Depth Validation

```circom
// WRONG: depth could exceed maxDepth
component proof = BinaryMerkleRoot(maxDepth);
proof.depth <== userProvidedDepth;  // Could be > maxDepth!

// RIGHT: validate first
component depthCheck = LessEqThan(6);
depthCheck.in[0] <== userProvidedDepth;
depthCheck.in[1] <== maxDepth;
depthCheck.out === 1;

component proof = BinaryMerkleRoot(maxDepth);
proof.depth <== userProvidedDepth;
```

## Documentation Standards

### Every Circuit Needs a Doc

Create a markdown file in `docs/circuits/` for each main circuit:

```markdown
# CircuitName

## Overview
One paragraph explaining what this circuit does and why.

## Signals

### Inputs
| Signal | Type | Description |
|--------|------|-------------|
| `secret` | private | The user's secret key |
| `root` | public | Merkle tree root |

### Outputs
| Signal | Type | Description |
|--------|------|-------------|
| `nullifierHash` | public | Hash for double-spend prevention |

## Algorithm
1. Step one explanation
2. Step two explanation
...

## Constraint Count
- Total: X constraints
- Poseidon hashes: Y
- Comparisons: Z

## Security Considerations
- List any assumptions
- Note any edge cases
- Reference related best practices
```

## Testing Conventions

### Test File Structure

```typescript
describe("MyCircuit", () => {
    let circuit: WitnessTester<Inputs, Outputs>;

    before(async () => {
        circuit = await circomkit.WitnessTester("MyCircuit", { ... });
    });

    describe("Correctness", () => { ... });
    describe("Determinism", () => { ... });
    describe("Collision Resistance", () => { ... });
    describe("Soundness", () => { ... });
    describe("Boundaries", () => { ... });
    describe("Fuzzing", () => { ... });
});
```

### Test Naming

```typescript
// Good: describes what should happen
it("should reject invalid Merkle proof", async () => { ... });
it("should match reference implementation", async () => { ... });
it("should handle maximum valid value", async () => { ... });

// Bad: vague or implementation-focused
it("test1", async () => { ... });
it("works", async () => { ... });
it("calls Poseidon correctly", async () => { ... });
```

### Common Utilities

Place in `test/common/index.ts`:

```typescript
// Circomkit instance
export const circomkit = new Circomkit({ ... });

// Constants
export const FIELD_PRIME = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

// Reference implementations
export async function calculateCommitment(...): Promise<bigint> { ... }

// Generators
export function randomFieldElement(): bigint { ... }
export function randomBoundedValue(bits: number): bigint { ... }
```

## Checklist

Before submitting a circuit for review:

**Structure**
- [ ] Follows the three-section template structure (inputs, outputs, constraints)
- [ ] JSDoc header with all required tags
- [ ] Section headers for visual organization
- [ ] Intermediate signals/components declared just before use
- [ ] Numbered constraint logic steps

**Naming**
- [ ] PascalCase templates, camelCase signals
- [ ] Descriptive component names (not `p`, `lt`, `c`)
- [ ] Array signals are plural

**Security**
- [ ] All `<--` paired with `===`
- [ ] All component outputs constrained
- [ ] Range checks before comparisons
- [ ] No `assert` for security checks
- [ ] No `LessThan(254)` (use 252 max)
- [ ] Depth validation for Merkle trees

**Documentation**
- [ ] Markdown doc in `docs/circuits/`
- [ ] Signal table with descriptions
- [ ] Algorithm explanation
- [ ] Security considerations noted

**Testing**
- [ ] All six test categories covered
- [ ] Reference implementation exists
- [ ] Soundness tests for each input
- [ ] Static analysis passing (`circomspect`, `circom --inspect`)

## Further Reading

- [Circom Language Reference](https://docs.circom.io/circom-language/signals/)
- [Circomlib Source Code](https://github.com/iden3/circomlib) - Study the official implementations
- [Best Practices](./onboarding/best-practices) - Security patterns
- [Testing Guidelines](./onboarding/testing-guidelines) - Comprehensive testing methodology
