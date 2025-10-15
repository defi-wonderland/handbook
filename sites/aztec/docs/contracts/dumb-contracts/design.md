---
title: Designing Contracts
description: What app contracts should contain and why auth lives in accounts.
---

# Designing Contracts

On Aztec, applications focus on state transitions and domain logic. Identity, authorization, nonces, and fees live in the user’s account. This separation makes apps reusable and auditable, and lets wallets evolve auth UX without touching apps.

## Mental model

- The account authorizes, orders, and funds a request. The app implements domain rules.
- Private functions validate secrets and produce commitments/nullifiers. Public functions apply minimal, verifiable updates to public storage and emit events.
- When acting with user approval in public, use an authwit: bind exactly what will be executed, and consume the approval immediately.

## What belongs in the app

- Domain state and invariants (balances, positions, orders, etc.)
- Private logic that consumes app-siloed user secrets via PXE oracles
- Public logic that updates public state or coordinates cross‑contract effects
- Events and selectors that make the contract easy to integrate and index

## What does not belong in the app

- User authentication (signatures, MFA, WebAuthn)
- Fee payment policy or sponsorship rules
- Global nonce/intent handling

These are owned by the account and enforced before your app code runs.

## Why this matters

Keeping apps “dumb” reduces attack surface and proof costs. It avoids duplicating fragile auth logic across many apps and ensures the same user can interact with many apps through a single account policy.

## Private vs public functions (with examples)

Aztec apps have two execution domains:

- Private functions run inside the PXE. They can read user secrets via oracles, update private state, and produce proofs. Their effects are committed to via notes and nullifiers.
- Public functions run on‑chain. They update public state and can emit events; they cannot read private data directly.

### Example: Public swap requires an authwit when caller != sender

Source: `noir-contracts/contracts/app/uniswap_contract/src/main.nr`

1) Public entrypoint with explicit `sender`
```rust
#[public]
fn swap_public(sender: AztecAddress, /* ... */) {
```

2) If someone else submits, require a public authwit from `sender`
```rust
if (!sender.eq(context.msg_sender())) {
  assert_current_call_valid_authwit_public(&mut context, sender);
}
```

3) Move funds in (public) before continuing
```noir
Token::at(input_asset)
  .transfer_in_public(sender, context.this_address(), input_amount, nonce_for_transfer_approval)
  .call(&mut context);
```

Why this design works
- The app never verifies signatures. `assert_current_call_valid_authwit_public` computes the same inner hash the wallet/account approved (using `msg_sender`, selector and `args_hash`) and checks it in the canonical auth registry. It only runs when a third party is submitting on behalf of `sender`.
- `transfer_in_public` is a public operation that requires the token’s own approval logic (often another authwit) to succeed; funds visibly move to this contract before any further action.

Invariants
- If `sender == msg_sender`, no extra approval is needed (self‑submit). Otherwise, public authwit is mandatory.
- Never mutate app state before the transfer succeeds, or you risk partial effects.

Pitfalls
- Forgetting to include fee/sponsor context in the authorized message (if your app supports sponsorship).
- Not scoping the transfer approval nonce tightly; reuse can enable replay.

### Example: Private swap validates secrets, then enqueues minimal public work

1) Private entrypoint validates configs and moves funds to public
```noir
#[private]
fn swap_private(/* ... */) {
  // validate bridge config privately, then
  Token::at(input_asset)
    .transfer_to_public(context.msg_sender(), context.this_address(), input_amount, nonce_for_transfer_to_public_approval)
    .call(&mut context);
```

2) Enqueue the minimal public step to exit to L1
```noir
  Uniswap::at(context.this_address())
    ._approve_bridge_and_exit_input_asset_to_L1(input_asset, input_asset_bridge, input_amount)
    .enqueue(&mut context);
}
```

Pattern: perform heavy checks privately; let the public side commit observable effects using data proven by the private proof.
Notes
- The function takes `input_asset` as a parameter and asserts it matches the bridge’s expected token. Private code cannot read public return values, so we fetch and check private bridge config instead of calling a public getter.
- Moving funds with `transfer_to_public` exposes only the minimum necessary information on L2 while preserving private validation of user secrets.

### Example: Public helper computes the same message hash and consumes the approval

1) Compute the same message hash the wallet/account will sign
```noir
let selector = FunctionSelector::from_signature("burn_public((Field),u128,Field)");
let message_hash = compute_authwit_message_hash_from_call(
  token_bridge,
  token,
  context.chain_id(),
  context.version(),
  selector,
  [context.this_address().to_field(), amount as Field, authwit_nonce],
);
```

2) Set authorization and immediately consume it in the call
```noir
set_authorized(&mut context, message_hash, true);
TokenBridge::at(token_bridge)
  .exit_to_l1_public(storage.portal_address.read(), amount, storage.portal_address.read(), authwit_nonce)
  .call(&mut context);
```

Pattern: bind exactly what will be executed, set the auth flag, and consume it immediately. Keep the nonce policy tight so approvals can’t be replayed.
What each field means
- caller = the contract that will perform the action (here, the bridge)
- consumer = the contract that must accept the action (here, the token)
- selector = the exact function to be authorized
- args = stable encoding of who spends what and under which nonce
Why include chain id and version
- They prevent cross‑chain or cross‑fork replay. See aztec‑nr `authwit` helpers for the full derivation.
Optimization note
- If approve and consume happen in the same tx, public state updates are squashed in the final diff, so the set/consume cost is minimized.

## Gotchas

- Don’t try to read private data from public functions; use oracles and proofs instead.
- Avoid leaking unnecessary information in public arguments or events.
- Be explicit about which side (private/public) owns each invariant.

## References
- Example apps: search [`noir-projects/noir-contracts/contracts/app/*` in aztec‑packages](https://github.com/AztecProtocol/aztec-packages/tree/master/noir-projects/noir-contracts/contracts/app/)
