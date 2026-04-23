# Storage Slots

Storage slots define where and how public data is persisted in the global state tree. Unlike the EVM's simple key-value model, Aztec’s design is based on two primary constraints:

1. The need for Merkle-based authenticated data structures (for zero-knowledge proving).
2. The requirement to preserve strict isolation and determinism between contracts (via siloing).

This section describes how public contract state is structured, accessed, and verified using typed memory, Merkle proofs, and VM-enforced invariants.

## Slot Addressing and Siloing

Each public storage variable maps to a **storage slot**, which is a ~254-bit field element (`Fr`) that acts as a key in the Public Data Tree.

Slots are application-defined rather than compiler-assigned. Two terms are useful:

* **Raw slot**: the application-chosen 254-bit key. This can be a fixed literal (e.g. `1`, `2`, `3`) or it can be derived by hashing structured inputs (a namespace and indices). Not all raw slots are hashed, many layouts use fixed numeric slots.
* **Siloed slot**: the final on-chain key obtained by combining the contract’s address with the raw slot.

When deriving a raw slot via hashing, the inputs typically include:

* A namespace or field identifier (e.g. variable/selector)
* Optional indices or struct-field discriminants (for mappings, arrays, etc.)

To enforce contract-level isolation, the final storage key is **siloed** using the contract’s address:

```ts
siloed_slot = hash([contract_address, raw_slot], PUBLIC_DATA_LEAF)
```

This ensures contract-level isolation: even if two contracts pick the same raw slot, their siloed slots differ.

### Examples

Fixed numeric raw slots (no hashing). Many native/simple types, or macro-generated layouts, use literal slots directly:

```rust
#[abi(storage)]
global CONTRACT_NAME_STORAGE_LAYOUT = StorageLayout {
    balance: dep::aztec::prelude::Storable { slot: 1 },
    owner: dep::aztec::prelude::Storable { slot: 2 },
    token_map: dep::aztec::prelude::Storable { slot: 3 },
};
```

Hashed raw slots (derived from domain inputs). Useful for maps, arrays, and namespaced fields:

```ts
// Derive a raw slot from a namespace and an index/key
raw_slot = hash(["balances", owner], RAW_PUBLIC_DATA_SLOT)
// Then silo by contract to get the actual storage key
siloed_slot = hash([contract_address, raw_slot], PUBLIC_DATA_LEAF)
```

:::note Comparison to Solidity
Conceptually similar to Solidity’s storage slots, but with a key difference: Solidity does not let you directly control slot allocation (see discussion in [`ethereum/solidity/issue/597`: Allow specifying storage locations](https://github.com/ethereum/solidity/issues/597)). In aztec-nr, slot addresses are derived programmatically, giving the developer explicit control over allocation and namespacing, and avoiding compiler-controlled layout constraints.
:::

This means that one contract cannot overwrite another contract’s state, even if their raw slot encodings collide.

## AVM Memory Model and Type Safety

The Aztec Virtual Machine (AVM) interacts with storage via **typed** memory and indirect addressing. Memory in the AVM is structured as:

* **Main Memory**: mutable, typed memory used for storage operations.
* **Calldata / Returndata**: read-only buffers, all tagged as `field`.

Each memory cell is tagged with a **range-constrained type**, and the AVM enforces strict tag matching for all read/write instructions. The primary types used in storage access are:

| Tag | Type    | Max Value         | Use Case                 |
| --- | ------- | ----------------- | ------------------------ |
| 3   | `u32`   | $2^{32} - 1$    | Memory addresses         |
| 6   | `field` | $p - 1$ (BN254) | Slot values and calldata |

To load a slot, the contract uses an **indirect memory access**. Here `offset` is a `u32` pointer into main memory where the computed slot address (`Fr`) has been stored:

```ts
assert T[offset] == u32
slot_address = M[offset]
```

This lets contracts compute slot addresses at runtime and dereference them via a pointer, enabling dynamic resolution (e.g., loops, maps, arrays) and letting the AVM enforce type-tag checks on pointers and values.

## Reading from a Storage Slot

A read is described by a `ContractStorageRead` object, which captures the requested slot, value, execution order, and contract:

```ts
ContractStorageRead {
  storageSlot: Fr,
  currentValue: Fr,
  counter: number,
  contractAddress: AztecAddress
}
```

When the `contract_storage_read` syscall is invoked:

1. The **slot address** is loaded from memory, with tag `u32`
2. A **siloed key** is computed from the contract + slot
3. A **Merkle membership proof** is performed against the Public Data Tree (an Indexed Merkle Tree)
4. The read value is returned into VM memory at a destination offset, tagged as `field`

:::note
The “write” in step 4 refers to placing the returned value into AVM main memory so the contract can use it in subsequent instructions. The Public Data Tree is not modified by reads.
:::

![contract-storage-read](/img/diagrams/memory-check.png)

As an overview, the process begins when a contract or an address emits a `ContractStorageRead` object, referencing the slot to be accessed. The AVM performs a two-step memory dereference: it first loads the slot pointer from memory, then ensures its type tag is `u32`, enforcing it is a valid offset. The actual slot value is read using indirect memory access (`M[M[offset]]`).

The executing contract then issues a `contract_storage_read` syscall, which computes a siloed storage key using the calling contract’s address and the raw slot. This key is used to perform a Merkle membership proof against the Public Data Tree, an Indexed Merkle Tree. Upon verification, the corresponding value is returned to the AVM and written back into memory with tag field, completing the read.

## Writing to a Storage Slot

Writes are structured similarly via `ContractStorageUpdateRequest`, which includes:

```ts
ContractStorageUpdateRequest {
  storageSlot: Fr,
  newValue: Fr,
  counter: number,
  contractAddress: AztecAddress
}
```

The syscall `contract_storage_update_request` triggers:

* Membership or non-membership proof in the Public Data Tree
* Slot insert (if new) or value overwrite (if existing)
* Enforcement of tag checks on memory: `u32` slot, `field` value

## Type Conversions and Safety

Data loaded from calldata or return values is tagged as `field` by default. For narrower data types (e.g. `u64`, `u32`), the contract must explicitly cast:

```ts
CALLDATACOPY cdOffset size memOffset  // copies field-typed data
CAST<u64> memOffset dstOffset         // narrows tag with range checks
```

Incorrect or missing tags during AVM execution will trigger reverts.

## As a TL;DR...

Storage slots provide a typed, Merkle-authenticated interface to public contract state. The model ensures:

* **Contract isolation** through address-based siloing
* **Proving compatibility** via indexed Merkle tree structure
* **Type soundness** enforced at the VM level through memory tags
* **Dynamic addressing** through `u32`-typed indirect access

This lays the foundation for verifiable, programmable, and scalable public state within the protocol's architecture.
