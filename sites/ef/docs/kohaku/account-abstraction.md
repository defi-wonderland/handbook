# Account abstraction


The Kohaku project framed Ethereum's evolution around three critical shifts. This document dives deep into the engine driving one of them the **wallet security transition**.

The goal of this transition is to move every user to a smart contract wallet. Why? Because Ethereum's historical division between rigid, insecure EOAs and flexible smart accounts is a source of massive user friction. **Account Abstraction** is the set of proposals designed to eliminate this division by creating a single, unified account type.

Here, we will explore the journey from the siloed approach of **ERC-4337** to the unifying bridge of **EIP-7702**.

### **The great account divide**

Ethereum has two account types.

1. **Externally Owned Accounts (EOAs)** are controlled by a single private key. They are rigid and unforgiving. Lose your key and you lose everything.
2. **Smart Accounts** are controlled by code. They are flexible and can have features like social recovery or spending limits.

The core issue is that only EOAs can start transactions and pay for gas. A smart account can't act on its own. This forces clumsy workarounds and creates a two-tiered system for users.

### **ERC-4337 A separate universe**

**ERC-4337** was a breakthrough that simulated account abstraction without a core protocol change. It created a parallel transaction system for smart accounts.

The diagram below shows this flow. Instead of a normal transaction (white path), a smart account sends a `UserOperation` intent to a separate "alternative mempool" (blue path). Specialized **Bundlers** package these into a regular transaction, which hits a global **EntryPoint** contract to execute the `UserOperation`.


![4337.png](\img\diagrams\4337.png)

This architecture is powerful. It enables **Paymasters** who can sponsor gas fees and allows for batching multiple actions into a single click.

But its main drawback is massive, **ERC-4337 is a silo.** It is not backward compatible so if you have an existing EOA, you can't use it. You must create a new smart account and migrate all your assets, history and identity. This leaves the vast majority of Ethereum users and capital on the sidelines.

### **EIP-7702 the unifying Bridge**

**EIP-7702**, part of the Pectra upgrade, solves this silo problem with an elegant fix. It allows an EOA to **temporarily act like a smart contract for one transaction.** By doing this, it makes account abstraction features **native to the protocol** for the first time.

The diagram shows how. An EOA uses a new `type 4` transaction to grant itself temporary `code`. This transforms the signature from a static authorization into programmable logic. The transaction includes an **authorization list**, which defines what the temporary contract is allowed to do.

![7702.png](\img\diagrams\7702.png)

This is crucial for wallet developers, a wallet can now define on the fly rules for a single transaction, such as:

- On-demand multisig checks.
- dApp-specific spending limits or permissions.
- Gas sponsorship policies without external relayers.

After the transaction, the EOA reverts to its normal state. It gets all the power of a smart account with none of the permanent overhead. This brings account abstraction to everyone instantly, with no need to migrate assets.

### **Completing the circuit 7702 + 4337**

Thinking of these EIPs as competitors is wrong. The real unlock is how they work together. **EIP-7702 is the native onramp to the ERC-4337 ecosystem.**

An EOA user can now sign a single 7702 transaction. This transaction's temporary `code` can be built to do one thing perfectly, create and authorize an ERC-4337 `UserOperation`.

This means any EOA can now leverage the entire infrastructure built for 4337.

- A dApp's **Paymaster** can sponsor gas for an EOA user.
- An EOA user can **batch** an approve and a swap into one atomic action.

EIP-7702 provides the native protocol hook and ERC-4337 provides the rich application layer services. Together, they unify Ethereum's accounts. The ultimate goal is an experience where the user doesn't know or care about account types. There is just *their account,* a secure and programmable entry point to the decentralized web.

For more details on ERC-4337, see the [official documentation](https://docs.erc4337.io/).