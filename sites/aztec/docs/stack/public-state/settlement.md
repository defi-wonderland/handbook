# Settlement & Cross‑Layer Messaging 

Aztec finalises every L2 block on Ethereum **and** ferries data between the two layers without leaking private information.  This page first introduces the *portal/message‑box* abstraction that makes private cross‑layer calls possible, then walks through a single block from proof generation to message consumption.


## Portals and Message Boxes: the Big Idea

**Portals** are the L1 counter‑parts of Aztec contracts. A portal can be an L1 contract or even an EOA, but it is *logically* linked to a specific L2 address. 

```text
L1 portal  ↔  L2 contract
```
Because private execution is prepared off‑chain, Aztec cannot do a synchronous `CALL` from L2 → L1 (or vice‑versa) without leaking inputs. Instead it turns every cross‑domain call into a **message** that is:

1. **Inserted** on the *sending* layer (`pending` set).
2. **Moved** by the rollup proof to the *receiving* layer (`ready` set).
3. **Consumed** exactly once by the recipient, producing a nullifier.

We call the data structure that stores these leaves a **Message Box**.  There are two of them:

| Direction | Pending set lives on | Ready set lives on | Contract     |
| --------- | -------------------- | ------------------ | ------------ |
| L1 → L2   | `Inbox` (L1)         | Private state (L2) | [`Inbox.sol`](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/l1-contracts/src/core/messagebridge/Inbox.sol)  |
| L2 → L1   | Private state (L2)   | `Outbox` (L1)      | [`Outbox.sol`](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/l1-contracts/src/core/messagebridge/Outbox.sol#L14) |

:::note Properties
* Messages are *multi‑sets*: identical payload can be inserted many times.
* Only the recipient can spend a message.
* The rollup moves leaves atomically (`pending → ready`). If the proof lies, verification fails.
:::

### Why *pulling* instead of *pushing*?

Other roll‑ups **push** calldata from their bridge contract into user contracts, revealing full parameters. Aztec **pulls**:  the L1 portal calls its own logic and then **pulls** the corresponding message out of the Outbox. For deposits this leaks the amount on L1 (that’s inevitable) but hides the L2 recipient and the exact block in which it is claimed.

### Message formats

Below is **precisely** what gets hashed, stored, and verified at each hop. There are three layers:

| Layer                  | Purpose                                                     | Solidity / TS type          |
| ---------------------- | ----------------------------------------------------------- | --------------------------- |
| **Application**        | Arguments your portal passes (`recipient`, `payload` …)     | `L1ToL2Msg`, `L2ToL1Msg`    |
| **Commitment**         | Single 254‑bit field inserted into Merkle tree              | `leaf = sha256ToField(msg)` |
| **Sequencer DB / RPC** | Extra provenance so the sequencer can resume after a re‑org | `InboxMessage`              |

```solidity
// packages/contracts/src/core/libraries/DataStructures.sol

struct L1Actor {
  address actor;      // who sends on L1
  uint256 chainId;    // = block.chainid (anti‑replay)
}

struct L2Actor {
  bytes32 actor;      // Aztec address (field element)
  uint256 version;    // roll‑up version to prevent fork griefing
}

struct L1ToL2Msg {
  L1Actor  sender;       // auto‑filled as msg.sender + chainId
  L2Actor  recipient;    // supplied by caller (portal knows its L2 pair)
  bytes32  content;      // 32 B payload or sha256(bigPayload)
  bytes32  secretHash;   // commitment to random `r` → hides nullifier timing
  uint256  index;        // globalLeafIdx = treeNum * SIZE + localIdx
}

struct L2ToL1Msg {
  L2Actor  sender;
  L1Actor  recipient;
  bytes32  content;
  // `index` lives in the Outbox leaf, same idea as above
}
```

`L1ToL2Msg` and `L2ToL1Msg` are flattened → hashed with **SHA‑256 >> Field**¹. That 254‑bit field is the **only thing the Merkle tree stores**.

```ts
// packages/foundation/src/message_bridge/inbox_message.ts

export type InboxMessage = {
  index:         bigint;   // == L1ToL2Msg.index (global)
  leaf:          Fr;       // sha256ToField(L1ToL2Msg)
  l2BlockNumber: UInt32;   // tree number (‘inProgress’ when inserted)
  l1BlockNumber: bigint;   // for re‑org detection / proofs
  l1BlockHash:   Buffer32; // header hash at insertion time
  rollingHash:   Buffer16; // keccak16(chainLeafs), cheap block digest
};
```

:::note note
`sha256ToField(x)` = `BigInt(SHA256(x)) mod BN254_P`. The contracts use `Hash.sha256ToField()`, the circuits use the exact same constant.
:::
#### Field‑by‑field cheat‑sheet

| Field         | Where stored              | Why it exists                                               | Contract ref                                |
| ------------- | ------------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| `index`       | Inbox tree leaf & bitmap  | Uniqueness + nullifier derivation                           | `Inbox.sendL2Message()` lines 73‑80         |
| `secretHash`  | Leaf only (not in Outbox) | Lets user prove they own the message without revealing when | Same file, constructor comment              |
| `rollingHash` | Off‑chain DB / RPC        | Lets sequencer stream blocks with O(1) integrity            | `updateRollingHash()` in `inbox_message.ts` |
| `l1BlockHash` | Off‑chain only            | Detect L1 re‑orgs before proposing                          |-                        |

The **`updateRollingHash`** helper:

```ts
function updateRollingHash(h: Buffer16, leaf: Fr): Buffer16 {
  const input = Buffer.concat([h.toBuffer(), leaf.toBuffer()]);
  return Buffer16.fromBuffer(keccak256(input));
}
```

This mirrors the contract logic that emits `MessageSent(block, idx, leaf, newRollingHash)` so any observer can verify no leaves were skipped.


:::note Reference
See [this contract](https://github.com/AztecProtocol/aztec-packages/blob/next/noir-projects/noir-protocol-circuits/crates/types/src/messaging/l2_to_l1_message.nr) and [this line](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/yarn-project/stdlib/src/messaging/l1_to_l2_message.ts#L18-L30) for reference.
:::

Only the **commitment** (`sha256ToField(struct)`) is inserted; the full struct is reconstructed by the circuit.

## Off‑chain proof construction

* Users create **Kernel proofs**, each proof contains:
  note‑hashes, nullifiers, *inbox nullifiers* to spend, *outbox leaves* to emit.
* Sequencer batches kernels inside **`RollupCircuit`** → outputs new roots + proof `π`.

## `Rollup.sol` `propose()` on L1

```solidity
require(VERIFIER.verify(proof, publicInputs));   // 1
stateRoot   = publicInputs.stateRoot;            // 2
inboxRoot   = publicInputs.inboxRoot;
outboxRoot  = publicInputs.outboxRoot;
emit BlockProven(blockNum, stateRoot);
```

If step (1) fails, nothing changes. If it passes, all three roots are final.

## Inbox: L1 → L2

```solidity
(bytes32 leaf, uint256 idx) = INBOX.sendL2Message(recipient, cHash, sHash);
```

* Inserts `leaf` into `FrontierTree` of the *current* L2 block (`inProgressBlock`).
* Updates `InboxState.rollingHash` for cheap indexing.
* `RollupCircuit` later calls `Inbox.consume(blockNum)` → Merkle root.  The circuit must
  * prove membership for each leaf it wants to spend, and
  * create a nullifier that will be inserted into the nullifier tree.

## Outbox: L2 → L1

During proof generation the **kernel** emits an array `out_msgs`.  Rollup inserts these into an Outbox tree and outputs the new `outboxRoot`.

**On‑chain:**

```solidity
OUTBOX.insert(l2BlockNum, outboxRoot);
```

A **portal** redeems:

```solidity
OUTBOX.consume(msg, idx, siblingPath);  // marks bitmap nullified[idx] = 1
```
## Circuit consistency checks

* **Kernel**: verifies sender/recipient in contract tree, ranges, secretHash linking.
* **Rollup**: recomputes Merkle roots and compares to public inputs passed to `Rollup.sol`.

If any leaf or nullifier is out of place, `IVerifier.verify()` fails and the block is rejected.

## Putting it all together


|  Step | Who calls              | Code path                                                                       | Resulting state change                                                                     |
| ----- | ---------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
|  1   | **Alice**              | `FeeJuicePortal.depositToAztecPublic()`                                         | ETH/ERC‑20 escrowed; `Inbox.sendL2Message()` inserts `leaf_A`, returns `(leaf, idx)`       |
|  2    | **Sequencer**          | Includes `leaf_A`’s **nullifier** in Alice’s kernel proof                       | Kernel ensures `(sender == portal && recipient == L2Contract)`; outputs `inboxNullifier_A` |
|  3   | **`RollupCircuit`**      | Consumes `inboxNullifier_A`, inserts Alice’s **L2→L1** receipt into Outbox tree | Produces new roots `inboxRoot'`, `outboxRoot'`                                             |
|  4    | **`Rollup.sol`**         | `propose()` verifies `π` and writes the three roots                             | Emits `BlockProven` event; Inbox block `N` becomes **ready**                               |
|  5    | **`Bob (portal owner)`** | Calls `Outbox.consume(receipt, idx, path)`                                      | Bitmap `nullified[idx] = 1`; Bob’s L1 logic mints/moves the funds                          |

:::note note
All intermediate steps (e.g. pointer updates inside `FrontierTree`) are enforced by circuit equality constraints, a single bad hash breaks verification.
:::

### The 3 things you need to remember:

* **Async everywhere**: your L1 tx *fires‑and‑forgets*; handle retries/timeouts.
* Use `content = sha256(bigPayload)` when 32 bytes is not enough; reveal the payload off‑chain or via an L2 event.
* `secretHash` + nullifiers hide the exact consumption slot.

## References
- [Portals Documentation](https://docs.aztec.network/aztec/concepts/communication/portals)
- [Message Bridge Contract](https://github.com/AztecProtocol/aztec-packages/tree/next/l1-contracts/src/core/messagebridge)
- [Rollup Core Contract](https://github.com/AztecProtocol/aztec-packages/blob/next/l1-contracts/src/core/RollupCore.sol)
- [Outbox](https://github.com/AztecProtocol/aztec-packages/blob/7e505bcd7fcd90a7d5fe893194272157cc9ec848/l1-contracts/src/core/messagebridge/Outbox.sol#L14)
- [Rollup Contract](https://github.com/AztecProtocol/aztec-packages/blob/next/l1-contracts/src/core/Rollup.sol)