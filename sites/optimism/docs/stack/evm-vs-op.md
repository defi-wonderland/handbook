---
id: evm-vs-op
title: EVM vs OP 
sidebar_label: EVM vs OP
---

:::info Reference
Reference [here](https://docs.optimism.io/stack/differences) for a deep dive.
:::

Although the OP stack aims for EVM-equivalence, there are a few differences we need to keep in mind.
## Bridging

Of course, Ethereum doesn’t have the concept of deposit transactions, but in the OP stack (and every L2), we do. 
:::info 
OP stack introduce new transaction type for this type of interactions, which is important for the execution client to consider said transactions are “valid” in its execution environment.
:::

For the bridging process between L1 and L2 the steps are:

1. When a deposit occurs on L1, it creates a deposit event
2. The sequencer monitors these events and includes them in L2 block data
3. While the sequencer has some flexibility in when to include deposits, there are strict rules:
   - Deposits must be included within 12 hours
   - Deposits must be processed in the exact order they occurred on L1
   - No deposits can be skipped or censored
4. If the sequencer fails to include deposits within the 12-hour window, its subsequent blocks are no longer considered canonical

This forced inclusion mechanism makes sure that all L1 to L2 deposits eventually get processed, even if the sequencer attempts to censor them. In contrast, withdrawals from L2 to L1 are handled asynchronously through a separate process.

## Opcode Differences

In principle, OP Stack tries to keep opcode behavior as 1:1 with Ethereum as possible. However, there are some special cases (because of the sequencer and the cross-chain messaging necessity):

| Opcode | Solidity | Notes |
| --- | --- | --- |
| `COINBASE` | `block.coinbase` | Returns the **Sequencer’s fee wallet**. On Ethereum, this is the miner/validator address and can vary per block. On OP Stack, it usually stays constant. |
| `PREVRANDAO` | `block.prevrandao` | Pulls the *most recent [RANDAO](https://eips.ethereum.org/EIPS/eip-4399) from L1*. Not the local L2 chain’s RANDAO. Handy if you rely on L1’s random seed. |
| `ORIGIN` | `tx.origin` | If the transaction was triggered by an **L1 smart contract**, it will be an ***aliased*** address on L2 (more on aliasing below). Otherwise behaves normally. |
| `CALLER` | `msg.sender` | Similar aliasing rules for the very **first call frame** if the L2 tx comes from an L1 contract. Internally, calls from one L2 contract to another remain standard. |

## Address Aliasing

:::info important
This is *superduperimportant* for cross-chain transactions.
:::

In typical L1, an L1 and L2 contract can share the same address but have totally different bytecode (i mean, they are separate chains, after all).

Without aliasing, an L1 contract might impersonate an L2 contract if they share an address. Basically, when an L1 smart contract sends a message into the L2, the sender on L2 doesn’t appear as the L1 contract’s real address. Instead, it’s `L1_contract_address + 0x1111000000000000000000000000000000001111`

EOAs keep their exact address from L1 → L2, but L1 contracts always get aliased to avoid collisions. Then, if a cross-chain tx is from an L1 contract, both `tx.origin` and `msg.sender` can reflect that aliased address in the L2 environment. In *all other cases*, these opcodes behave just like Ethereum.

### Sender mismatch issue

A **sender mismatch issue** will happen when a contract expects a specific address (for example, an L1 contract’s “real” address) but instead receives an **aliased** address on L2. Summarized it would be something like:

1. An L1 contract triggers a transaction on L2.
2. The L2 contract checks `msg.sender` or `tx.origin` to verify the caller.
3. Because of **address aliasing**, the caller on L2 appears as `OriginalAddress + 0x1111...1111` instead of `OriginalAddress`.
4. The L2 contract’s logic then fails or reverts because it expects `OriginalAddress` but sees the aliased version, producing a “mismatch.”

:::info The CREATE opcode
*Because of the behavior of the `CREATE` opcode, it is possible to create a contract on both L1 and on L2 that share the same address but have different bytecode.  — [OP Docs](https://docs.optimism.io/stack/differences#address-aliasing)* 
:::

## Fees

As you know, in Ethereum you pay only for execution gas. On a OP chain you will pay (1) the execution gas + (2) the L1 data fee for storing your transaction data. 

Also, the OP stack implements the [EIP-1559](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md), which allows a base fee mechanism, but the parameters can differ across chains. 

:::important
Here we should take a look at the chain-specific configs.
:::

### Mempool

The L2 Sequencer has an **internal** (private) mempool. The Sequencer still orders transactions primarily by gas price (higher fee = higher priority), but that’s at its own discretion.

## Chain Finality

In this case, it will track:

- Unsafe head: the tip of the chain, not yet posted to L1
- Safe head: posted on L1 but still in the challenge window
- Finalized: beyond the challenge period (unchallengable)

We have to keep in mind that fault proofs do not affect how L2 blocks finalize internally. They do affect finalization on L1 (especially for withdrawals). If a block is proven faulty, any pending withrawal from that block become invalid. 

:::important
Refer to [transaction finality](https://docs.optimism.io/stack/transactions/transaction-finality) for more details.
:::