# Partial Notes

There are a few instances where the value of a user's note cannot be known in private. Partial notes
are a way to transfer public to private without revealing the recipient.

To do this, partial notes have a cryptographic commitment to the owner and other data, without a
specification of its value. This way, a public function can *complete* them by setting the value in
public, and emitting the hash corresponding to a normal note.

In order to preserve the total supply, a partial note's completion in public is necessarily
accompanied by decrementing the public balances of the sender by an equivalent amount.

### Motivation example: AMMs

There are many instances where the value of a note isn't known in privateland. For instance, Aztec's
[reference AMM](https://github.com/AztecProtocol/aztec-packages/blob/v3.0.0-nightly.20251023/noir-projects/noir-contracts/contracts/app/amm_contract/src/main.nr#L37)
is based in Uniswap V2's constant product formula.

In order for the AMM to work without outside intervention, the pool's balances for `token0` and
`token1` are public, and its balance movements after a user's swap will therefore also be public.

Now, consider an exact-in swap. The input token can be transferred private to public, but the output
amount depends on things that may happen in public.

Instead of doing a normal public to private transfer, which would reveal the user's address, the AMM
prepares a partial note for the output token in private. Once the value is known in publicland, it
needs only complete the partial note with the output amount.

## Mechanism

In order for this to work, the complete note's hash must be a function of the commitment to the data
and the note's value. In the previous section, you've seen the default implementation of a note's
hash by the `#[note]` macro. To allow for partial note's mechanism, [`UintNote`](https://github.com/AztecProtocol/aztec-packages/blob/v3.0.0-nightly.20251023/noir-projects/aztec-nr/uint-note/src/uint_note.nr#L29)
uses the `#[custom_note]` macro instead, which allows for the definition of a custom note hash.

The hash is then computed as follows:
```rust
let commitment = poseidon2_hash_with_separator(
    [owner, storage_slot, amount]
    GENERATOR_INDEX__NOTE_HASH,
);
let hash = poseidon2_hash_with_separator([commitment, value] GENERATOR_INDEX__NOTE_HASH);
```

The commitment is computed in private and stored in a `PartialUintNote` that can then be made
public.

## Bonus: previous mechanism

Partial notes used to have a different hash. While it was changed for performance reasons, its
homomorphic property with respect to addition makes it worth mentioning. The complete hash was
computed as follows:
```rust
let hash = owner * g_owner + storage_slot * g_slot + randomness * g_randomness + value * g_value
```
where the `g` variables are distinct generators of the elliptic curve.

By taking a note's `hash` and adding `delta_value * g_value`, you'd construct the hash for a note
with `value + delta_value`.
