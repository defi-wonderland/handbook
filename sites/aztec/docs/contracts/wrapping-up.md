# Wrapping up

In this section, you learned:

- Why accounts own identity, authorization (authwits), nonces, and fees, while apps stay “dumb” and focus on domain state and logic
- How authwits are formed, verified (private/public), and made single‑use and time‑bounded
- How fee‑first execution and nonce policies prevent partial execution and replay
- How to split work between private and public functions, and what leaks when crossing boundaries
- How Aztec state works: PrivateMutable/PrivateImmutable/PrivateSet, PublicMutable/PublicImmutable, and when to use `DelayedPublicMutable`
- How wallets/PXE fit in: key management, simulation, proving, and request formatting

Below are short review questions to check understanding. Expand each to see a suggested answer.

## 🧠 Knowledge Check

### 1. What does an account contract own versus an application contract?

<details>
<summary>Answer</summary>

Accounts own identity and policy: authorization (authwits), nonce/replay rules, and fee policy; they route fee then app payloads. Apps own domain state and logic, expose private/public functions, and avoid user auth and fee logic.

</details>

### 2. Why does the account execute the fee payload before the app payload?

<details>
<summary>Answer</summary>

To ensure sponsorship/gas rules are satisfied and abort early if funding fails; it also prevents partial execution of app logic without paying fees.

</details>

### 3. What makes a good authwit message?

<details>
<summary>Answer</summary>

Domain‑separated data that binds chain id, account, entrypoint selector, commitments to app/fee payloads, scoped nonce (and expiry), and any sponsor context. It should be single‑use and time‑bounded.

</details>

### 4. Public vs private: when should logic live in each?

<details>
<summary>Answer</summary>

Private functions validate secrets and produce commitments/nullifiers; public functions apply minimal, verifiable updates and emit events. Keep heavy checks private and observable effects public.

</details>

### 5. Why use DelayedPublicMutable when reading public values in private?

<details>
<summary>Answer</summary>

It guarantees a value cannot change before a future timestamp, letting the PXE prove over recent historical state while bounding staleness and avoiding public assertions that leak which value you read.

</details>

### 6. What are PrivateMutable, PrivateImmutable, and PrivateSet?

<details>
<summary>Answer</summary>

Helpers over notes: PrivateMutable is a single updatable note (replace emits a nullifier); PrivateImmutable is a single note set once; PrivateSet is a collection whose “value” is an accumulation you define.

</details>

### 7. How do public apps act “under user approval” without verifying signatures?

<details>
<summary>Answer</summary>

They require an authwit: compute the message hash for the exact action, check the canonical auth registry (or consume a flag), and immediately execute; the wallet/account produced the witness.

</details>

### 8. What should be included in a nonce policy, and why might you scope nonces?

<details>
<summary>Answer</summary>

Include ordering and cancellation semantics (bump/cancel). Scope nonces per app or spender to avoid cross‑app contention and enable parallel intent streams.

</details>

### 9. Name two privacy leaks when crossing private → public.

<details>
<summary>Answer</summary>

Arguments and events of the public call become visible; timing and the number of side effects (nullifiers, notes, messages) can fingerprint the transaction.

</details>

### 10. How do you emit events privately?

<details>
<summary>Answer</summary>

Define an #[event] and use `emit_event_in_private_log` to write encrypted logs visible only to intended viewers; public events/logs are visible to all.

</details>

### 11. Why are chain id and version included in the authwit outer hash?

<details>
<summary>Answer</summary>

To prevent cross‑chain or cross‑fork replays; the witness is valid only on the specific chain/version.

</details>

### 12. What belongs in storage maps on Aztec and how are keys/values handled?

<details>
<summary>Answer</summary>

Maps exist in public and private. Keys are Fields (or serializable to Field); values can be complex types. Private maps manage notes behind the scenes; public maps write serialized values to storage.

</details>
