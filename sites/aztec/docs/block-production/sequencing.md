# Sequencing

Each epoch is sequenced *without proving* until it is complete. Such chain of unproven blocks is
called the *pending chain*, which is dispatched for proving only after it's been completely
sequenced.

The sequencing of an epoch can be summarized in the following steps

```mermaid
sequenceDiagram
    Validator set-->>Committee: Sample without replacement
    Committee-->>Proposers: Sample with replacement
    loop each proposer
        Note over Proposers: Construct block
        Proposers->>Committee: Send block proposal
        loop each committee member
            alt block proposal is valid
                Committee->>Proposers: Send attestation
            end
        end
        alt quorum of attestations
            Proposers->>Rollup contract: Block commitment
            Proposers->>Rollup contract: Post TxEffects to blob DA
        end
    end
```

Each proposer must catch up to the previous proposer before they start constructing their own
blocks.

## Epoch initialization

At the start of an epoch, a committee is [elected pseudorandomly](https://github.com/AztecProtocol/aztec-packages/blob/v2.0.0-nightly.20250820/l1-contracts/src/core/libraries/crypto/SampleLib.sol#L33), along with the set of committee
members that will act as proposers. Randomness is sampled from randao at a previous epoch and a
random seed derived from it:

```solidity
seed = uint256(keccak256(abi.encode(epoch, randao[epoch-2])))
```

The sampling occurs as follows:
- **Committee**: Draw `TARGET_COMMITTEE_SIZE` indices pseudorandomly *without replacement*. At the
  time of writing, this is done with a Fisher-Yates shuffle algorithm.
- [**Proposers**](https://forum.aztec.network/t/request-for-comments-aztecs-block-production-system/6155): Draw 32 indices from the committee *with replacement*.

### Validator lookahead

The validator set used to compute the committee at epoch $$N$$ is taken from a snapshot of the
validator set at 1 second before the start of epoch $$N-1$$. Since the randao value used for seed
generation is that of epoch $$N-2$$, this means the committee and proposers are known one full epoch
in advance.

## Block building

Inside an epoch, slots are filled in sequence. Each slot's assigned proposer waits for all previous
blocks to be committed to in the rollup contract. They'll then catch their state up with the latest
committed state and begin their own block construction and proposal.

The proposer collects enough `Tx` objects from their view of the mempool to sequence a valid block.
For any TX ordering, the proposer can simulate their execution *without proving* to know what state
changes are introduced by the resulting block. After settling for one specific list of TXs, the
proposer uses the simulation's results to construct a [`BlockProposal`](https://github.com/AztecProtocol/aztec-packages/blob/v2.0.0-nightly.20250820/yarn-project/stdlib/src/p2p/block_proposal.ts#L37)
, consisting of:
- `blockNumber`: the block number
- `signature`: the proposal's signature by the proposer
- `payload`: what the signature is over
  - block header, including the archive root after this block is added
  - archive root after block
  - state after block
- `txHashes`: TX hashes
- `txs`: (optional) the block's complete transaction data

:::note
The archive tree is a tree whose leaves are the previous blocks' headers
:::

The proposer then forwards the proposal to the committee in order to collect attestations.

## Block propagation

Just like with transactions, all nodes re-broadcast block proposals to their known peers after a
basic *P2P validity check*.

This check currently ensures:
- A committee has been defined in the rollup contract for the slot the proposal belongs to
- The proposal is for either the current or the next slot
- The proposer is the correct one for the slot

## Proposal attestation

When a commitee member receives a block proposal, they should [verify the proposal](https://github.com/AztecProtocol/aztec-packages/blob/v2.0.0-nightly.20250820/yarn-project/validator-client/src/validator.ts#L251)
and send a `BlockAttestation` back to the proposer. This verification includes the P2P validity
check, as well as checks that the proposal is consistent with the previous known state, and the
proposed block executes correctly.

In detail, the consistency checks are:
- The block previous to the proposal is known
- The proposal's *previous* archive root matches the previous block's archive root
- The L1->L2 messages in the proposal match the ones in the rollup contract

:::note
As commented in the code, some of the attestation checks may be promoted to P2P validity checks,
tightening the gossip checks.
:::

If all check pass, the attester sends the proposer a `BlockAttestation`, consisting of the same
`blockNumber` and `payload` as the proposal, as well as the attester's `signature`.

## On-chain block commitment

After receiving the quorum of attestations, the block producer will submit their block proposal to
the L1 contract by calling `RollupCore::propose` with:
- `ProposeArgs` object that includes the proposed block's header
- The committee attestations
- Data for blob DA

At this point, the rollup contract will prune any epochs that failed to prove. It will then
- Validate the proposal, abort if it fails
- Add it to the pending chain
- Handle L1-L2 messages

### Validating the proposal

The following elements are [validated](https://github.com/AztecProtocol/aztec-packages/blob/v2.0.0-nightly.20250820/yarn-project/p2p/src/msg_validators/block_proposal_validator/block_proposal_validator.ts#L15):
- Blob data: checks that the data in the blobs is the same as the data provided for the proofs.
- Header data: does some sanity checks (e.g. the last archive root in the header must be the last
  root's archive root, timestamp must be the one corresponding to the slot) as well as checking for
  data availability.
- Proposer: checks that the proposer corresponding to the block has properly signed the block.

Attestations aren't validated eagerly during the `propose` call but rather assumed correct
optimistically. Sequencers validate attestations off-chain during catch-up and, if a mistake is
found, will invoke the L1 contract's `invalidateBadAttestation` or
`invalidateInsufficientAttestations` function, in accordance to whether an invalid signature or an
invalid amount of attestation has been found in an L1 proposed block.

### Updating the pending chain

The [L1 contract](https://github.com/AztecProtocol/aztec-packages/blob/v2.0.0-nightly.20250820/yarn-project/validator-client/src/validator.ts#L251)
's storage keeps track of both historical data and temporary data.

The following historical data is updated:
- Number of pending blocks
- The archive tree root for this slot

The following data for this block is stored temporarily in a circular storage buffer:
- Header hash
- Blob commitments hash
- Payload digest
- Slot number
- Fee header:
  - Excess mana
  - Mana used
  - Fee asset price
  - Congestion cost
  - Prover cost

### Handling L1-L2 messages

This consists of consuming the pending L1->L2 messages up to this block's start and inserting the
L2->L1 messages into the outbox. The latter can only be consumed after the epoch is confirmed.

## Catching-up with the latest block

Once a block is persisted in the L1 contract, all sequencers must catch up to it by re-executing the
transactions in order to have the latest view of the blockchain. At this stage, sequencers will
ensure the block has the correct amount of attestations.
