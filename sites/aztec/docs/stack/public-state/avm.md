# Aztec Virtual Machine (AVM)

:::warning
If you are a new developer starting to work on Aztec, feel free to skip this section. It's a quick walkthrough of the AVM and not strictly necessary to read. The most up-to-date version will always be found in the Aztec repository. 
:::

This section is a bottom‑up walkthrough of **how public Aztec code actually runs**. We go from a Noir snippet in your IDE all the way to an AVM proof that any Ethereum node can verify. The goal is to provide quick links to implementations and serve as a handy guide.

At a high level, you write a Noir public function, the transpiler converts Brillig into AVM bytecode, and the sequencer simulates that bytecode, recording side effects and gas. Those side effects feed the public kernel. The transpiler’s entry point is in [`avm-transpiler/src/transpile.rs`](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs) and the instruction encoding is defined in [`avm-transpiler/src/instructions.rs`](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/instructions.rs).

The AVM behaves like a classic fetch -> decode -> execute VM with explicit control flow (`JUMP_32`, `JUMPI_32`, `INTERNALCALL`, `INTERNALRETURN`, `RETURN`, `REVERT_*`) defined in [`avm-transpiler/src/opcodes.rs`](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/opcodes.rs). During transpilation, a Brillig -> AVM program‑counter map is maintained and jump targets are resolved after layout ([PC mapping and resolution](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L445-L449), [resolution pass](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L480-L514)).

Type information is carried on instructions via `AvmTypeTag` (e.g., `SET_*`, `CAST_*`), for reference see [`AvmTypeTag` in instructions.rs](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/instructions.rs#L107-L119) and [SET/CAST generation](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L989-L1061)). Gas is visible at call boundaries and through environment getters: `CALL`/`STATICCALL` take `(l2_gas, da_gas)` operands ([calls](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L602-L644)), the VM exposes `l2GasLeft`/`daGasLeft` via `GETENVVAR_16` ([env getters](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L952-L973)), and the simulator reports L2 gas usage ([e2e assertion](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/end-to-end/src/e2e_avm_simulator.test.ts#L98-L109)).

External calls run in forked side‑effect traces, which achieves isolation: on revert, child side effects are discarded. On success they merge into the parent ([fork/merge in SideEffectTrace](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/simulator/src/public/side_effect_trace.ts#L95-L139)). The modules here support SHA‑256 compression, Poseidon2 permutation, Keccak‑f[1600] permutation, ToRadix (big‑endian), and ECADD directly; MSM is compiled as a procedure during transpilation ([gadget and procedure handling](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L1174-L1319)). This page focuses on the transpiler and simulator, proving happens downstream using the side effects produced here.

## From Noir Source to AVM Byte‑code

1. **Compile -> ACIR**: `noirc` turns each public function into an ACIR program.

2. **Transpile -> AVM**: The transpiler maps Brillig opcodes to AVM opcodes and emits final bytecode via `brillig_to_avm`, also returning a Brillig→AVM PC map for debugging and error attribution:
   - [Transpiler entry](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs)
   - [Instruction encoding](https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/instructions.rs)

   ```rust
   // Pseudocode
   let brillig = extract_brillig_from_acir(&acir_prog);
   let (bytecode, pc_map) = brillig_to_avm(&brillig); // returns (Vec<u8>, Vec<usize>)
   ```

3. **Pack & Commit**: The AVM bytecode comes from the transpiler. Commitment/validation live elsewhere, this page focuses on transpiler and simulator behavior.

   ```rust
   AvmContractClassHint { class_id, artifact_hash, private_functions_root, packed_bytecode }
   ```

The bytecode commitment is validated during deployment by protocol circuits. 

## Bootstrapping a Public Call

When a user asks the sequencer to run a public function, the AVM simulator receives calldata and reads execution context via environment opcodes (e.g. address, sender, gas left) exposed by `GETENVVAR_16`. See:
- Env getters map: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L952-L973`
- Opcode set: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/opcodes.rs`

Everything is now ready for the main loop.

## Instruction Encoding & Execution

AVM instructions are variable‑length, but consistent: opcode -> addressing‑mode (if present) -> operands -> optional type tag -> immediates. Addressing‑mode packs, per operand, an “indirect” bit and a “relative” bit. The word is U8 if $<= 4$ operands, else U16. Operands are encoded as U8/U16/U32/U64/U128 or Field immediates.
- Encoding order: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/instructions.rs#L61-L80`
- Addressing‑mode bits: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/instructions.rs#L180-L203`
- Operand encodings: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/instructions.rs#L121-L156`

## Memory & Type‑Tags

Type tags in this layer live on instructions (e.g. `SET_*`, `CAST_*`) via `AvmTypeTag`.
- `AvmTypeTag`: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/instructions.rs#L107-L119`
- `SET_*`/`CAST_*` generation: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L989-L1061`

## Public Storage Access

Public storage is accessed via `SLOAD`/`SSTORE` opcodes in the AVM bytecode, produced by the transpiler’s foreign call handlers:
- Opcodes: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/opcodes.rs#L148-L160`
- Transpiler handlers: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L1660-L1696` and `#L1564-L1600`

Side effects (including storage writes) are recorded by the simulator’s `SideEffectTrace` with per‑tx limits and a monotonically increasing counter:
- `https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/simulator/src/public/side_effect_trace.ts#L60-L113`
- Storage write limits and warm/cold tracking: `https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/simulator/src/public/side_effect_trace.ts#L153-L194`

## Internal Control Flow

Control flow is explicit: `JUMP_32`, `JUMPI_32`, `INTERNALCALL`, `INTERNALRETURN`, `RETURN`, `REVERT_*`. The transpiler also keeps a Brillig→AVM PC map and resolves jumps once all code (including procedures) is laid out:
- Opcodes: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/opcodes.rs#L44-L47`
- Jump resolution and PC mapping: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L445-L449` and `#L480-L514`

## Gas

- CALL/STATICCALL take explicit `l2_gas` and `da_gas` operands; environment getters expose `l2GasLeft` and `daGasLeft`:
  - Calls: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L602-L644`
  - Env getters (including gas left): `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L952-L973`
- L2 gas usage is tracked in simulation outputs; see the E2E test assertion:
  - `https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/end-to-end/src/e2e_avm_simulator.test.ts#L98-L109`

## Accrued Sub‑state (Side Effects)

The simulator buffers side effects (public data writes, note hashes, nullifiers, L2→L1 messages, public logs) with a counter and enforces protocol limits:
- `https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/simulator/src/public/side_effect_trace.ts#L60-L113`
- Limits and recorders: `https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/simulator/src/public/side_effect_trace.ts#L204-L250`

## Public Call Phases

Public calls are processed in three phases: Setup (non‑revertible), App Logic (revertible), and Teardown (non‑revertible). See:
- `https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/simulator/src/public/utils.ts#L3-L16`

## End‑to‑End Example (cheat‑sheet)

Put together: calldata is copied in (`CALLDATACOPY`), storage is read or updated (`SLOAD`/`SSTORE`), conditions branch with `JUMPI_32`, external calls use `CALL`/`STATICCALL` (with `(l2_gas, da_gas)` and HeapVector args), and execution terminates with `RETURN` or `REVERT_*`.

### To keep in mind...

- AVM bytecode is generated mechanically from Brillig by the transpiler: `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs`
- Addressing modes: per‑operand indirect/relative bits; instruction layout is opcode -> addressing‑mode -> operands -> optional tag -> immediates.
- Public storage, logs, messages, note hashes, and nullifiers are recorded via the simulator’s side‑effect trace with per‑tx limits: `https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/simulator/src/public/side_effect_trace.ts`
- Public calls execute across Setup/App‑Logic/Teardown phases: `https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/simulator/src/public/utils.ts#L3-L16`
- L2 gas usage is observable in simulation outputs; CALL/STATICCALL take `(l2_gas, da_gas)` operands:
   - `https://github.com/AztecProtocol/aztec-packages/blob/next/avm-transpiler/src/transpile.rs#L602-L644`
   - `https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/end-to-end/src/e2e_avm_simulator.test.ts#L98-L109`