---
title: State visibility and data flow
description: How to think about private/public state and data flow in apps.
---

# State visibility and data flow

Aztec splits state into private notes (owned by accounts or contracts) and public storage. Designing a good app means deciding which data lives where and how it flows between the two worlds.

## Private state

Represent balances and positions as notes. You prove ownership and validity privately and nullify notes on spend to prevent double‑use. `Aztec.nr` provides three helpers that hide the note mechanics behind a clean API:

- `PrivateMutable`: a single updatable note, “replace” emits a nullifier for the old value and inserts a new one. See [this file.](https://github.com/AztecProtocol/aztec-packages/blob/master/noir-projects/aztec-nr/aztec/src/state_vars/private_mutable.nr)
- `PrivateImmutable`: a single, never‑changing note initialized once. See [this file.](https://github.com/AztecProtocol/aztec-packages/blob/master/noir-projects/aztec-nr/aztec/src/state_vars/private_immutable.nr)
- `PrivateSet`: a collection of notes where the “value” is an accumulation you define (sum, min, etc.). [See this file](https://github.com/AztecProtocol/aztec-packages/blob/master/noir-projects/aztec-nr/aztec/src/state_vars/private_set.nr)

Read user secrets via PXE oracles during private execution, never try to pull secrets from public code.

## Public state

Publish only what must be shared or coordinated across users (pool totals, price oracles, settlement queues). Use PublicMutable for regular storage and PublicImmutable for constructor‑like values:

- PublicMutable: generic public storage; read/write helpers. [See this page](https://github.com/AztecProtocol/aztec-packages/blob/master/noir-projects/aztec-nr/aztec/src/state_vars/public_mutable.nr) for reference.
- PublicImmutable: initialized once in public, readable in public/private/utility. [See this page](https://github.com/AztecProtocol/aztec-packages/blob/master/noir-projects/aztec-nr/aztec/src/state_vars/public_immutable.nr) for reference.

When you must read public values in private, use `DelayedPublicMutable` so the PXE can prove against a recent, guaranteed‑not‑yet‑changed value. This introduces a bounded “include by” timestamp but avoids leaking which exact public value you read.

:::tip Reference
[See Delayed Public Mutable](https://github.com/AztecProtocol/aztec-packages/blob/master/noir-projects/aztec-nr/aztec/src/state_vars/delayed_public_mutable/delayed_public_mutable.nr)
and check [the design notes](https://github.com/AztecProtocol/aztec-packages/blob/next/docs/docs/developers/reference/smart_contract_reference/storage/delayed_public_mutable.md).
:::

## Data flow bridges

From private to public: validate secrets and compute effects privately, then enqueue a minimal public function that applies the update using commitments/nullifiers from the proof.

From public to private: read public data in private via archive‑tree membership proofs; avoid synchronous public reads from private functions.

Maps exist in both worlds and help structure storage. Keys are fields; values can be complex types. See the Map docs and token examples in aztec‑packages for `read`, `write`, and `at` usage.

:::tip Reference
[Check map reference](https://github.com/AztecProtocol/aztec-packages/tree/master/noir-projects/aztec-nr/aztec/src/state_vars/map)
:::

## Privacy considerations

Crossing private→public leaks information (arguments, events, messages). Crossing public→private can leak timing if you assert current values in public. Prefer `DelayedPublicMutable` for configs you must read in private and budget for `include_by_timestamp`. [See the privacy considerations doc](https://github.com/AztecProtocol/aztec-packages/blob/master/docs/docs/developers/reference/considerations/privacy_considerations.md) for a catalogue of leaky patterns and how to mitigate them. 

## References

- [Smart Contract Reference](https://github.com/AztecProtocol/aztec-packages/tree/next/docs/docs/developers/reference/smart_contract_reference)
- [Aztec Noir](https://github.com/AztecProtocol/aztec-packages/tree/next/noir-projects/aztec-nr)