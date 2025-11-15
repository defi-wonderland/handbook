# Batch Withdrawal

Privacy Pools allow users to generate new private claims on funds, as **[notes](./notes.md)**, in any amount. Users can then withdraw funds from these notes, either partially or totally. This is the foundation of the system's privacy.

However, the initial implementation has two key constraints. First, you cannot top-up more funds to a note once it is created. Second, there is no way to guarantee that a relayer will process multiple withdrawals atomically as a single logical transfer.

These constraints create a poor user experience because a user cannot make a payment for an amount greater than their single biggest note. This also leads to users accumulating many small "dust" notes that their wallet cannot automatically consolidate, forcing them into what is known in UTXO systems as "manual coin control", so we have to handle this complexity in some way.

This document explains the batch withdrawal mechanism, a design that solves this problem.

### The goals

This mechanism is designed to achieve three specific goals.

First, it should let a user withdraw from any number of their notes **in one transaction**. This is necessary for both efficiency and privacy. Processing multiple withdrawals separately is slow, costs more in gas fees and creates a series of onchain transactions that could potentially be linked degrading privacy.

Second, it has to guarantee **atomicity**. This means either the full set of withdrawals is processed successfully or the entire operation fails.

Third, the system should remain **trust minimized**. While a user relies on a relayer for the convenience of submitting their transaction, the protocol itself must not require the user to *trust* that relayer. This design removes the need for trust by making it cryptographically impossible for the relayer to act maliciously with a user's batch.

### The data structure

The core of the security model is a shared data structure called `BatchRelayData`. Its hash is embedded as a public input in every single zk-SNARK proof within a batch. This acts as a set of cryptographic handcuffs, binding all proofs to one single set of instructions.

```solidity
struct BatchRelayData {
    address recipient;
    address feeRecipient;
    uint256 relayFeeBPS;
    uint8   batchSize;
    uint256 totalValue;
}

```

This data is encoded and its hash is used in each proof. Therefore every proof is tied to the same recipient, fee, and most importantly, the **batchSize**. An attacker cannot mix and match proofs from different withdrawal attempts or alter the intended parameters.

### An example

![Batch withdrawal](/img/diagrams/batch_withdraw.png)

The user's wallet generate two proofs from two 5 ETH notes to withdraw 8 ETH. In short, the flow works like this:

1. The user's **Wallet** bundles proofs for each note being spent with a single set of instructions (`BatchRelayData`).
2. A **Relayer** submits this package to the `BatchWithdrawer` contract in one transaction.
3. The **Contract** first verifies that the number of proofs matches the instructions. If not, the transaction fails. If it matches, the contract processes all withdrawals and distributes the funds. This all or nothing logic guarantees atomicity.

### Why a partial withdrawal are not feasible

This design ensures that a malicious relayer cannot execute an incomplete batch. A relayer might be tempted to do this because a relayer's fee is often a percentage of the withdrawn amount, they could be incentivized to process only the largest notes in a batch to maximize their fee while saving on gas costs by skipping smaller ones.

The design protects against this with two arguments.

The first is to **call the pool directly**, attempting to bypass the `BatchWithdrawer`. This fails because each zk-SNARK proof specifies that the `BatchWithdrawer` contract must be the `msg.sender` to the pool. A call from any other address is rejected.

The second is to **call the BatchWithdrawer with a subset of proofs**. This fails because of the `batchSize` check. The contract executes a check `require(withdrawals.length == data.batchSize)`. If the number of proofs submitted does not match the number expected by all the other proofs, the transaction reverts.

The only path to a successful withdrawal is to submit the complete, unaltered batch.

### Conclusion

The `BatchWithdrawer` contract is a simple yet powerful mechanism that solves fund fragmentation. It provides a trust minimized and atomic way for users to combine multiple notes into a single transaction.

This now provides the *capability* to spend multiple notes atomically. The next logical question is, given a user's full set of Notes, *which ones should the wallet choose* for a given withdraw to maximize the user's privacy? This is the job of the **[note selection algorithm](./note-selection-algorithm.md)**.