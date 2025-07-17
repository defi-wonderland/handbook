---
id: coding
title: Coding
sidebar_label: Coding
---

# Coding Guidelines

## Setup

- Clone Wonderland repo: https://github.com/defi-wonderland/optimism/
- Install mise and dependencies from `mise.toml`
- Contracts are under [`packages/contracts-bedrock`](https://github.com/defi-wonderland/optimism/tree/develop/packages/contracts-bedrock)
- Read the contributing guide (no need to build the entire monorepo): https://github.com/ethereum-optimism/optimism/blob/develop/CONTRIBUTING.md

## Coding Style

- Contracts guide: https://devdocs.optimism.io/contracts-bedrock/

## Contracts Insight

These are the contracts to pay special attention to and get a deep understanding of them:

### L1 Contracts

- **OptimismPortal2**: Main entry point for deposits and withdrawals
- **ETHLockbox**: Manages ETH deposits and withdrawals
- **SystemConfig**: System-wide configuration parameters
- **L1CrossDomainMessenger**: Handles cross-domain message passing
- **L1StandardBridge**: Standard bridge for token transfers
- **SuperchainConfig**: Superchain-wide configuration
- **OPContractsManager**: Manages contract deployments and upgrades

### L2 Contracts

#### Core

- **L1Block**: Provides L1 block information to L2
- **L2CrossDomainMessenger**: Handles L2 to L1 message passing
- **L2StandardBridge**: Standard bridge implementation for L2
- **L2ToL1MessagePasser**: Manages L2 to L1 message passing

#### Interop

- **CrossL2Inbox**: Handles cross-L2 message passing
- **ETHLiquidity**: Manages ETH liquidity across chains
- **L2ToL2CrossDomainMessenger**: Enables L2 to L2 communication
- **SuperchainERC20**: Standard token implementation for interop
- **SuperchainETHBridge**: ETH bridge implementation for interop
- **SuperchainTokenBridge**: Token bridge implementation for interop

### General

- **L2Genesis**: L2 genesis configuration
- **Setup**: System setup and initialization
