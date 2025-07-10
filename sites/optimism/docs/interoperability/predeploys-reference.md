---
id: predeploys-reference
title: Predeploys
sidebar_label: Predeploys
---

:::info reference
This is a high-level summary of predeploys. For more technical details, see the [Predeploys Spec](https://specs.optimism.io/interop/predeploys.html).
:::

The OP Stack introduces a set of system-level contracts, or predeploys, that are deployed at fixed addresses across all OP Chains. These contracts define the foundation for interop: message validation, token transfers, ETH bridging, and standard contract deployment patterns. This section describes each predeploy’s role and interface in the Superchain.

## `CrossL2Inbox`

`CrossL2Inbox` (0x420...022) is the contract responsible for validating messages on the destination chain. Any user or contract can call it to confirm that a message emitted on a source chain is valid, meets all protocol invariants, and was explicitly declared in the access list.

Message validation is done by calling `validateMessage`, which takes an `Identifier` struct and the `keccak256` hash of the payload. If the message is valid, the contract emits the ExecutingMessage event, which acts as proof of execution. This pattern lets smart contracts verify events from other chains in a trust-minimized way.

To validate cross-chain messages, transactions must predeclare the message in the access list using three entries: 
- a Type 1 lookup identity (which includes the chain ID, block number, timestamp, and log index)
- an optional Type 2 chain ID extension (for large chain IDs),
- and a Type 3 checksum. The checksum binds the identifier to the message payload and is required to pass validation. Access list validation happens outside the EVM, enabling safe and efficient execution at block building time.

Because access lists are not available in deposit transactions, `CrossL2Inbox` cannot be used from L1-triggered deposits. Instead, execution must happen through standard transactions.

## `L2ToL2CrossDomainMessenger`

This contract is the standard interface for applications and bridges to send and receive messages. It wraps the `CrossL2Inbox` (0x4200...023) functionality with replay protection and domain binding, enforcing one-time execution on the correct destination chain.

Apps initiate messages using sendMessage, which accepts a destination chain ID, a target address on that chain, and the payload. The contract emits a `SentMessage` event containing the message metadata, and stores the message hash to prevent duplication. On the destination chain, the message is relayed with `relayMessage`, which calls `validateMessage`, verifies correctness, and executes the payload on the target contract. The `relayMessage` function also emits a `RelayedMessage` event including the return data hash, which downstream consumers can use for additional verification.

This contract is used internally by Superchain bridges and token standards, and developers are encouraged to use it as their default messaging interface.

## `SuperchainTokenBridge`

This contract (0x4200...028) enables token transfers using the `SuperchainERC20` standard. On the source chain, the app calls `sendERC20`, which burns the token from the sender, emits the `SentERC20` event, and sends a message to the bridge on the destination chain. On the receiving side, `relayERC20` is called, which validates the message and calls `crosschainMint` on the `SuperchainERC20` contract to mint the tokens to the recipient. The bridge only works with `SuperchainERC20` tokens that implement the [`IERC7802`](https://eips.ethereum.org/EIPS/eip-7802) interface and exposes strict invariants to ensure conservation of supply and deterministic bridging behavior.

## `SuperchainETHBridge` and `ETHLiquidity`

These two (1) (0x4200...024) and (2) (0x4200...025) contracts work together to handle ETH bridging. The user initiates a transfer by calling `sendETH` with the destination chain and recipient address, and attaching ETH as `msg.value`. This ETH is deposited into the `ETHLiquidity` contract via a call to burn, and a `SendETH` message is emitted and propagated.

On the destination chain, a relayer calls `relayETH`, which validates the message, withdraws ETH from `ETHLiquidity` using mint, and transfers it to the user with `SafeSend`. This mechanism guarantees ETH fungibility across chains without needing wrapped representations or liquidity pools.

Only the Superchain bridge contract is authorized to call burn and mint, preventing misuse and ensuring that ETH movements always correspond to valid cross-chain messages.

:::info reference
The following predeploys won't be available in the first Interop Mainnet iteration, but should be in the future.
:::

## `OptimismSuperchainERC20Factory`

This factory (0x4200...026) contract deploys `SuperchainERC20` tokens using the `CREATE3` opcode and a Beacon proxy pattern. Anyone can deploy a new token by calling deploy with the remoteToken address, name, symbol, and decimals. The factory computes a deterministic address using the metadata hash as a salt and emits `OptimismSuperchainERC20Created` with the new token address and metadata.

The Beacon proxy allows multiple tokens to share the same implementation while supporting upgrades. Each token stores its own metadata and remote reference and exposes `crosschainMint` and `crosschainBurn` to the Superchain bridge.

## `OptimismMintableERC20Factory`

This is the legacy token factory (0x4200...012) for L1 ↔ L2 bridging. Tokens created here are meant to represent L1 assets in L2 environments and are compatible with the `L2StandardBridge`. Developers can call `createOptimismMintableERC20` to deploy a token with a remote L1 address and optional decimals.

Mintable tokens can be converted to their `SuperchainERC20` representation by calling `L2StandardBridge.convert`, which handles the burn/mint logic for migration.

## `L2StandardBridge`

This bridge (0x4200...010) supports migration of tokens from legacy `MintableERC20` format to the new interop-compatible standard. The convert function takes a from and to token address and an amount, verifies that the two tokens are a valid pair (same decimals, same remote token, one legacy and one superchain), and then burns amount from the legacy token and mints the same amount in the `SuperchainERC20`. The Converted event is emitted upon success.

:::warning
This predeploy is already available, but the *interop compatible* version won't be available on the first iteration of it.
:::

This flow allows existing applications using `L1 <-> L2` assets to smoothly transition to Superchain-native interop standards.
