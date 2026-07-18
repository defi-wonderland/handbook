# Overview

As we begin learning about Aztec, we’ll encounter several concepts that differ significantly from what’s typically found in public blockchains like Ethereum. These include **notes**, **nullifiers**, and **UTXOs**, terms that might resonate with those who have experience with Bitcoin, but could feel unfamiliar to others.

To understand why these concepts exist, it’s helpful to first grasp what makes Aztec different.

Aztec is building a new kind of L2: one where functions, variables, smart contracts and even bytecode can be private, and users can interact with the chain through encrypted state. It is designed to support both private and public smart contract execution. This model splits execution into two distinct environments:

- **Private functions** are executed on the user’s own device within the **Private Execution Environment (PXE)**. These computations are never broadcast on-chain. Instead, they produce *proofs* that attest to the correctness of the private execution.
- **Public functions**, by contrast, are executed on-chain by the **Aztec Virtual Machine (AVM)**, a public environment conceptually similar to Ethereum’s EVM.

A single Aztec transaction may begin with private logic in the PXE and then trigger public logic in the AVM. However, this flow is **directional**: private functions can enqueue public ones, but public functions **CANNOT** call back into private code. Which ensures that private data remains strictly client-side and controlled by the user.

Aztec also maintains **two types of state**:

- **Private state** is structured around **notes** and tracked using Merkle trees of notes and nullifiers (we will define all of that in a bit).
- **Public state** resembles a traditional Ethereum-style network, with global state updates written to a public data tree.

In the following pages, we’ll define key terms, like UTXOs, notes, nullifiers, zero-knowledge proofs, and circuits that form the foundation of Aztec’s privacy model. 

Let's get private!
