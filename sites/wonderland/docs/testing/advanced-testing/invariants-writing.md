# Invariants writing strategy

We take an opiniated approach of having targeted fuzzing campaign and formal verification. To maximize the efficiency (ie benefit/cost), we put a bigger emphasis on *what* we test than on *how* we do it - finding and formalizing the most important invariants being a key objective to do so.

We define *good* invariant as:

- Informative: cover a behaviour not or only partially covered by existing tests (unit or integration) - they bring new information (for instance, an invariant testing if `require(sender == owner)` reverts when the sender is not the owner brings no new information compared to an unit test).
- Realistic: the pre-condition must be something which is expected or at least achievable without breaking, for instance, EVM invariants with cheatcodes.

To find such, we start by establishing a protocol accounting (assets, liabilities and operations) which we then complete with others, non-accounting ones.

## Establish protocol accounting

We’ll use the following example throughout this doc:

- WonderPump is a novel ICO protocol
- It has a single contract, where Grifters can provide a type of tokens and users can send ETH to get it, following a pricing function.
- The protocol is getting a fee on each sale, in ETH, which can be redeemed via a dedicated function.

The accounting invariants should cover every actor’s balance and how it evolves through time (ie WonderPump token balance should be the sum of deposit minus token sold). A small, simplified, balance sheet helps doing this, as well as a summary of the accounting operations (this will already cover most of the ghost variables used):

- On the left side, list all the protocol liabilities (the token which are still in balance but “owned” to someone → a protocol fee) and “equity” (basically, how were the asset funded) → the main characteristic is these token are in balance but are not “accessible” anymore
- On the right side, list all the protocol assets (the token the protocol can “use” to do something) → these are the “tools” of the protocol (eg the token deposited by Grifter)
- As in traditional accounting, at each moment in time, both side should be equals (ideally - as there are sometimes some shortcut taken, this is a weak condition) or at least assets should be greater than liabilities (strong condition)
- The “accounting operation” are then describing the relation between all the balances (eg “a token deposit should increase the contract balance and the amount available to sell”)
- Here is WonderSwap accounting - if you have an accounting background, you’d notice it is only schematic:

| Liabilities/Equity | Assets         |
| ------------------ | -------------- |
| Token deposit      | Token to sell  |
| ETH for grifter    | ETH in balance |
| ETH protocol fee   |                |

And the related operations:

- A deposit from grifter should increase token deposit and token to sell (ACC-2)
- A sale should: (ACC-3)
  - Lower token deposited and token to sell
  - Increase eth for grifter, for the protocol fee and the eth in balance
- A fee withdrawn should lower eth protocol fee and eth in balance (ACC-4)
- Grifter withdraw should lower eth for grifter and eth in balance (ACC-5)

From there, the invariant are making sure these operations are properly influencing the balance and that, at all point in time, assets == liabilities

| ACC-1 | Assets == liabilities (token deposit == token to sell, and eth for grifter + eth protocol fee == eth in balance) |
| --- | --- |
| ACC-2 | see above |
|  | (…) |

One can easily check how most of the protocol behaviour and general “risky” invariants are already covered (eg no free mint, no fund stuck, etc)

## List non-duplicates

After this initial phase, the rest of the invariants will try to uncover any (un)expected behaviour, while making sure to not test something already implemented in the unit tests (eg “only Grifter can withdraw” has no interest if this is a onlyOwner modifier or similar for instance, as fuzzing will not cover any new logic). The emphasis should therefore be on “broader picture”, in other terms, stateful invariants, which requires a succession of transactions, each influenced by the state left by the previous one.

One noticeable exception are invariants around arithmetic (see infra).

### Other useful invariants

- Non-reversion invariants: after writing handler and properties around a call, it is often useful to add post-condition on the revert case (ie make sure every revert is explained)
- Protocol shutdown: With the accounting invariants in place, one powerful way to test them is to have a shutdown mechanism, which will unwind the whole protocol (pausing, emptying balances, etc), making sure no funds are stuck and all parties are made whole.

### Arithmetic

Having tightly coupled invariant is, quite obviously, useless (ie pasting the implementation in a test). One way to test complex arithmetic is to challenge its mathematical properties instead. These invariants should be reserved when the implementation is not straightforward (assembly or huge complexity).

example: x*y

- this should be commutative: x*y == y*x
- associative: (x*y*)*z == x*(y*z)
- 1 is the neutral element: if y = 1, x == k
- 0 is the absorbing element: if y = 0, x == k == 0
etc
