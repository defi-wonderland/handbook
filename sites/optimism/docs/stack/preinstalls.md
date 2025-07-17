# Preinstalls

:::important
These are deployed at fixed addresses right from the chain’s genesis, but they are developed by third parties. So, do your own research.
:::

Why? Certain widely used contracts (like `Safe`, `Multicall3` or `create2Deployer`) are “preinstalled” for convenience. Developers don’t need to redeploy them. The thing is that OP team is not directly responsible for their code.

- **`Safe and SafeL2`**: both are multi-sig wallets that support confirmations via signed messages ([ERC191](https://eips.ethereum.org/EIPS/eip-191)). The main difference is that SafeL2 emits events, and Safe don’t.
- **`MultiSend` and `MultiSendCallOnly`:** batch multiple transactions into a single one, handy for complex operations. **`CallOnly`** variant restricts the batched ops to `CALL` instructions (no delegatecall, etc.)
- **`SafeSingletonFactory`**: Used by Safe-related contracts for deterministic deployment, referencing Arachnid’s approach. Includes chain ID in the pre-signed tx to avoid cross-chain replay issues.
- **`Multicall3`:** it would be use for aggregating read calls in one RPC request (gasless for read-only) or executing multiple state changes in a single transaction.
- **`Create2Deployer`**: it is a wrapper for CREATE2deployments → so you can predict the contract address ahead of time. It also includes a special function to deploy the ERC1820 implementer.
- CreateX: it extends the CREATE2/CREATE3 logic with extra salt protection.
- **Arachnid’s Deterministic Deployment Proxy:** Another approach to cross-chain deterministic deployments. Uses a one-time-use “deployer account” so the address is always the same across any chain.
- **`Permit2`**: Next-gen token approval system (meta-transactions), simplifying token approvals across dApps.
- **ERC-4337 `EntryPoint` / `SenderCreator` (v0.6.0 & v0.7.0):** Core contracts for ERC-4337’s account abstraction, verifying and executing batches of UserOperations. The `SenderCreator` is used to deploy new smart accounts in a neutral context.