# Aztec Virtual Machine (AVM)

:::warning
If you are new developer starting to work on Aztec, feel free to skip this section. It's a quick walkthrough through the AVM, but it is not extremely necessary to read.
:::

This section is a bottom‑up walkthrough of **how public Aztec code actually runs**. We go from a Noir `fn public …` on your IDE, all the way to an AVM proof that any Ethereum node can check.

## From Noir Source to AVM Byte‑code

1. **Compile → ACIR**: `noirc` turns each public function into an ACIR program.

2. **Transpile → AVM**: `aztec-avm-transpiler` in
   [`src/main.rs`](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/avm-transpiler/src/main.rs) walks every
   `BrilligCall` inside the single ACIR function, extracts the Brillig op‑list and replaces it with
   AVM instructions:

   ```rust
   // Pseudocode
   let brillig = extract_brillig_from_acir(&acir_prog);
   let (avm, map) = brillig_to_avm(brillig); // returns Vec<AvmInstruction>
   ```

3. **Pack & Commit**: The byte‑code is Base‑64 encoded and hashed (Poseidon) into a commitment. The class ID and commitment become part of the “contract class hint”:

   ```rust
   AvmContractClassHint { class_id, artifact_hash, private_functions_root, packed_bytecode }
   ```

   That commitment is verified at deploy‑time by the *Bytecode‑Validation Circuit*.

## Bootstrapping a Public Call

When a user asks the sequencer to run `myToken.transferPublic()`, the prover constructs the **Session Input**:

```text
AvmSessionInputs {
  globals,                     // L1 block data, random seed …
  address   = contract,        // AztecAddress being executed
  sender    = caller,
  l2GasLeft = gasSettings.l2,
  daGasLeft = gasSettings.da,
  calldata  = encoded args,
  …
}
```
Three things are immediately initialised:

* **Execution Env.**: calldata, sender, fee table.
* **Machine State**: `pc = 0`, `callPtr = 1`, the tagged memory heap.
* **Gas Controller**:`l2GasLeft`, `daGasLeft` (clamped by `clampGasSettingsForAVM`).

Everything is now ready for the main loop.

## One Clock‑Cycle in the AVM

> Instruction fetch ➜ decode ➜ sub‑ops ➜ commit (repeat until `RETURN` or `REVERT`).

1. **Fetch**: `BytecodeTable.lookup(callPtr, pc)` returns an `AvmInstruction`.
2. **Decode**: The static lookup table translates the opcode into a list of *sub‑operations*.
3. **Dispatch**:
   * Memory ops → **Memory Controller** (`LOAD`, `STORE`).
   * ALU / Hash → dedicated **Chiplet** (e.g. `SHA256COMPRESSION`).
   * Storage ↔ **Storage Controller** (`SLOAD`, `SSTORE`).
   * Flow → **Control‑Flow Unit** (update `pc`, maybe push/pop call stack).
   * Side‑effects → **Accumulator** (`EMITNOTEHASH`, `SENDL2TOL1MSG`).
4. **Update gas**: each op debits `daGas` or `l2Gas` (see `opcodes.yml`).
5. **Increment CLK**: next row in the circuit trace.

### Worked example: `ADD<u32> a b dst`

| Sub‑Op  | Component | Source      | Destination |
| ------- | --------- | ----------- | ----------- |
| `LOAD`  | Memory    | `M[a]`      | `I_a`       |
| `LOAD`  | Memory    | `M[b]`      | `I_b`       |
| `ADD`   | ALU       | `I_a`/`I_b` | `I_c`       |
| `STORE` | Memory    | `I_c`       | `M[dst]`    |

All four sub‑ops fit in **one** clock row because no chiplet exceeds row budget.

## Memory & Type‑Tags

* **Address space**: 2³² words, addressed by `u32`.
* **Tag set**: `{uninit,u8,u16,u32,u64,u128,field}`.
* **Rule**: first read of a word after `CALL` sees `0/uninit`; every later read must match the last `STORE`.

The Memory table columns are:

```
CALL_PTR | CLK | ADDR | VAL | TAG | IN_TAG | RW | TAG_ERR
```

A mismatch sets `TAG_ERR` ⇒ proof fails.

## Public Storage Access

High‑level Noir uses `PublicMutable<T>`.
When `storage.admin.write(newAdmin)` is compiled:

1. Guest code hashes slot with contract address → `siloedSlot`.
2. Compiler emits `SSTORE` with operands `(slotPtr, valPtr)`.
3. Storage Controller translates into two Merkle operations on the **Public Data Tree** and appends a `ContractStorageUpdateRequest` to the side‑effect list.

Reads (`admin.read()`) create a `ContractStorageRead` object and perform a Merkle *membership* proof instead.

## Nested Calls & Call Pointers

`INTERNALCALL` sub‑op does:

```
newPtr   = nextCallPtr++      // 2,3,4,… in execution order
push {pc+1, curPtr} onto stack
pc       = 0
callPtr  = newPtr
```

Each pointer owns its byte‑code slice, memory segment and gas budget.
On `INTERNALRETURN`, the previous context is restored.


## Gas Accounting in Two Dimensions

* **l2Gas**: execution work proved in AVM.
* **daGas**: calldata hashed in L1 blobs.

Every sub‑op carries a `(daCost,l2Cost)` pair.
`clampGasSettingsForAVM` ensures `l2GasUsed_private + l2GasUsed_public ≤ MAX_L2_GAS_PER_TX`.

At the end the circuit computes

```
transactionFee = (gasUsed.da * feePerDaGas) + (gasUsed.l2 * feePerL2Gas)
```

and exposes it as a public input.

## Accrued Sub‑state

During execution the Accumulator buffers:

* **noteHashes**, **nullifiers**
* **L2→L1 messages** (`SENDL2TOL1MSG`) with Eth recipient.
* **Unencrypted logs** for ETH watchers.

At the end these vectors are packed into
`AvmCircuitPublicInputs.accumulatedData` and passed to the public‑kernel circuit.

## Circuit Boundary & Public Inputs

Public columns:

```
sessionInputs             // one row
calldata[ N ]             // fixed length
worldStateAccessTrace.*   // many rows
accruedSubstate.*         // many rows
sessionResults            // one row (gas left, reverted?)
```

These are exactly the fields of `AvmCircuitPublicInputs` defined in
`avm_circuit_public_inputs.ts`. A one‑to‑one lookup links each table in the proof to the corresponding column in the public inputs vector.

## End‑to‑End Example (cheat‑sheet)

1. **Dev:** writes:

   ```rust
   #[public]
   fn set_admin(new_admin: AztecAddress) {
       assert(context.msg_sender() == storage.admin.read());
       storage.admin.write(new_admin);
   }
   ```

2. **Client**: compile & transpile → AVM class commitment.

3. **Tx**: includes calldata `[selector, new_admin]` and gas settings.

4. **AVM** executes:

   | CLK | callPtr | pc | OP                  |               Gas |
   | --: | ------: | -: | ------------------- | ----------------: | 
   |   0 |       1 |  0 | `CALLDATACOPY`      |          read arg | 
   |   1 |       1 |  1 | `SLOAD` (`admin`)   | +membership proof |
   |   2 |       1 |  2 | `EQ_8` + `REVERT_8` |            branch |
   |   3 |       1 |  3 | `SSTORE` (`admin`)  |       +update req |
   |   4 |       1 |  4 | `RETURN`            |            finish |

5. **Circuit**: proves rows 0‑4 and outputs `accumulatedData` with one
   `ContractStorageUpdateRequest`.

6. **Public‑kernel**: re‑hashes the updated slot, updates the indexed Merkle tree root, and feeds the final proof to the Rollup circuit.

### To keep in mind...

* AVM byte‑code is generated mechanically from Brillig, committed at deploy time, and proven at runtime.
* Execution is **row‑based**: fetch, decode to sub‑ops, feed to specialised controllers/chiplets.
* Memory and Storage are Merkle‑enforced; type‑tags keep Noir and runtime in lock‑step.
* Two‑dimensional gas model (`da`, `l2`) is baked into every sub‑op.
* The circuit exposes exactly the data the next kernel needs, nothing more, nothing less.

## References
- [AVM Transpiler](https://github.com/AztecProtocol/aztec-packages/tree/7e505bcd7fcd90a7d5fe893194272157cc9ec848/avm-transpiler)
- [AVM TypeScript](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/yarn-project/stdlib/src/avm/avm.ts)
- [AVM Circuit Public Inputs](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/yarn-project/stdlib/src/avm/avm_circuit_public_inputs.ts)
- [Contract Storage Read](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/yarn-project/stdlib/src/avm/contract_storage_read.ts)
- [Gas](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/yarn-project/stdlib/src/avm/gas.ts)
- [Message Pack](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/yarn-project/stdlib/src/avm/message_pack.ts)
- [Instruction Set](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/docs/docs/protocol-specs/public-vm/instruction-set.mdx)
- [Type Structs](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/docs/docs/protocol-specs/public-vm/type-structs.md)
- [AVM Circuit](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/docs/docs/protocol-specs/public-vm/avm-circuit.md)
- [Gas Settings](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/yarn-project/stdlib/src/gas/gas_settings.ts)