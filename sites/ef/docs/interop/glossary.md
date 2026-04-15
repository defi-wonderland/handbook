# Glossary

| Term | What it is |
| --- | --- |
| **Ethereum Improvement Proposals (EIPs)** | Define protocol-level changes |
| **Ethereum Request for Comments (ERCs)** | Define application-level standards |
| **Software Development Kit (SDK)** | A collection of tools that developers use to build applications on top of a platform |
| **Provider** | An adapter wrapping a bridge (Across, Relay, etc.) that translates its API into the SDK's format |
| **Aggregator** | The central hub coordinating multiple providers. Your single entry point |
| **Quote** | An offer from a provider: how much you get, fees, estimated time, and the steps to execute |
| **Intent** | What the user wants to do, expressed as "send X tokens from chain A to chain B" |
| **Solver** | An actor that fulfills intents. They compete to offer the best price |
| **Open Intents Framework (OIF)** | Modular infrastructure for intent layers: origination, fulfillment, settlement and rebalancing. Collaborative effort between the EF, Hyperlane, OpenZeppelin, Wonderland and others |
| **Interoperable Address** | An address that carries its chain info with it, following [ERC-7930](https://eips.ethereum.org/EIPS/eip-7930) |