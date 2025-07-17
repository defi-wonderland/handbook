---
id: execution-and-sequencing
title: Execution and Sequencing
sidebar_label: Execution and Sequencing
---

:::info reference
This is a high-level overview of the sequencing and execution layer. For more depth, refer to [this section](https://specs.optimism.io/interop/sequencer.html) of the OP Specs.
:::

Interop introduces a new validity model for block production. Sequencers must now validate executing messages during block building. This ensures that cross-chain messages maintain safety guarantees across the Superchain.

## Block Building and Message Validation

A block is valid only if all executing messages in it are valid. To check validity, the block builder:
	1.	Executes the transaction locally.
	2.	Extracts logs and checks if any are executing messages.
	3.	For each executing message, fetches the initiating log from the source chain using the message Identifier.
	
	:::note Where is the Identifier stored?
	Identifiers are used off-chain by sequencers and relayers. They reference logs emitted on a source chain and are included in the transaction’s access list on the destination chain for validation.
	:::

	4.	Validates:
	•	Origin address matches.
	•	Log index, block number, and timestamp are consistent.
	•	Log hash matches the expected msgHash.

This can be done via a trusted RPC or by requiring cryptographic proof. If any message is invalid, the block must not be included.

```solidity
if (id.timestamp != block.timestamp) {
  return false;
}
```

## Safety Levels

Messages and blocks exist on a spectrum of safety:
- unsafe: Minimal guarantees. Built by a sequencer and can be reorganised.
- cross-unsafe: All cross-chain messages are valid, but the data may not be fully published.
- safe: All data is available. The block can still be reorganised.
- finalized: Economic finality is guaranteed. Reorging would slash Ethereum validators.

To promote a block from unsafe to safe, the initiating messages of all executing messages must be resolved as safe.

## Sequencer Policy and Flexibility

The OP Stack uses a sequencer policy to reduce synchrony requirements. A sequencer can lag behind other chains without halting block production. However, any executing message from a remote chain must still be validated, either:
- As safe (preferred),
- Or as unsafe (higher latency risk, may cause reorgs).

This allows for different tradeoffs between liveness and finality, depending on the source chain.

## Supervisor: Tracking Cross-Chain Safety

The Supervisor tracks all chains in a cluster and their message states. It provides APIs to:
	•	Check if an executing message exists and meets a minimum safety level.
	•	Get the global superRoot at a timestamp, which includes the output roots of all chains.

A sample `supervisor_checkAccessList` call checks if the message access list meets a safety threshold:
```json
{
  "inboxEntries": [...],
  "minSafety": "safe",
  "executingDescriptor": {
    "timestamp": "0x...",
    "timeout": "0x0"
  }
}
```

This helps block builders ensure they only include valid executing messages.

## Shared Sequencing

Shared sequencing is possible when one block builder controls multiple chains. In this case, cross-chain composability can be synchronous: messages can be sent and executed at the same timestamp. This is critical for atomic actions across OP Chains.

Some security considerations are: 
- Including unsafe messages allows faster bridging but risks reorgs.
- Sequencers relying on preconfirmation messages can have those reorganised away by remote sequencers.
- Advanced builders may include intra-block messages if they verify them carefully.
