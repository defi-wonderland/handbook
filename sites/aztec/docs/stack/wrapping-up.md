# Wrapping Up

You’ve built a working mental model of Aztec’s stack:

- Private state uses a dual‑tree design (note hash + nullifier) and read=write semantics to keep reads current and unlinkable.
- Public state lives in the Public Data Tree (indexed Merkle), supporting membership and non‑membership at the head.
- Wallets prove the private phase via the kernel chain and hand off to the network; the sequencer executes public phases (non‑revertible → setup → app logic → teardown) and settles fees in teardown.
- dApps query balances via contract methods; wallets/PXE select notes internally. Only contracts read notes.

From here, you can dive deeper where it matters most to you:

- Private execution and kernels: see `Private Kernel` and the circuit topology in the protocol specs.
- Transaction execution and statuses: the AVM public simulator and receipt mapping in `aztec‑packages`.
- State trees and proving: Note/Nullifier/Public Data trees in the protocol specs.

## 🧠 Knowledge Check

#### Q1: Why do reads of private mutable values emit a nullifier and re‑create the note?
<details>
<summary>Solution</summary>
Non‑membership in the nullifier tree must be checked at the head by the sequencer. Emitting the nullifier ties validity to “currentness”, re‑creating the note (new randomness) keeps the value available without linkability.
</details>

#### Q2: Which trees are append‑only versus indexed, and why?
<details>
<summary>Solution</summary>
Note Hash and Archive trees are append‑only (membership with historical roots). Nullifier and Public Data trees are indexed to support efficient non‑membership at head.
</details>

#### Q3: Where are transaction fees settled, and what happens on failure?
<details>
<summary>Solution</summary>
Fees are settled in the teardown phase. If teardown reverts, receipt status is `teardown_reverted`; non‑revertible effects remain.
</details>

#### Q4: How should dApps obtain a user’s private balance?
<details>
<summary>Solution</summary>
Through contract methods (e.g. `balance_of_private`). dApps don’t read raw notes; wallets/PXE select notes internally when building transactions.
</details>

#### Q5: Who checks non‑membership and when can historical roots be used?
<details>
<summary>Solution</summary>
Non‑membership is checked by the sequencer at the head (indexed trees). Historical roots can be used for membership in append‑only trees.
</details>
