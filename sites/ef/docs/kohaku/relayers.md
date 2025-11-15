# Exploring Private Withdrawals: Beyond Relayers

The fundamental challenge of privacy protocols is simple: after shielding your assets, how do you withdraw them without revealing who you are? The transaction needs gas, but paying for gas from a funded account creates exactly the link you're trying to avoid, so you end up relying on a third party.

## The relayer problem

The traditional solution is a **relayer**, a service that submits your transaction and pays gas, taking a fee from the withdrawn funds. This decouples your identity from the on-chain transaction origin. An observer sees the transaction coming from the relayer, not from you.

But we've only moved the problem. While zero-knowledge proofs hide the origin of funds (the relayer can't trace which deposit you're withdrawing), the relayer still learns critical metadata:
- Your IP address (linking the withdrawal to a network location)
- The destination of your funds (where the money is going)
- The withdrawal amount and timing (when and how much)

Is there anything we could do about this? Let's explore these experimental solutions, just to play around with the challenges privacy brings and the creative and innovative approaches that could be implemented.

**Note: These are research directions and proposed solutions, not currently implemented in Kohaku.** They represent the cutting edge of privacy-preserving withdrawal mechanisms that could be integrated in future iterations. 

## Privacy paymasters: eliminating relayers entirely

[ERC-4337](https://docs.erc4337.io/) enables **Account Abstraction** without protocol changes, introducing a powerful alternative to traditional relayers through **paymasters**—smart contracts that can sponsor gas fees on behalf of users.

### Understanding the ERC-4337 flow

Unlike regular Ethereum transactions, ERC-4337 uses a specialized architecture:

1. **UserOperation mempool**: Instead of the canonical Ethereum tx pool, UserOperations are submitted to an alternative mempool
2. **Bundlers**: These services monitor the alt mempool, pick up UserOperations, bundle multiple operations together, and submit them to the blockchain
3. **EntryPoint contract**: An on-chain contract that processes bundles and manages paymasters
4. **Paymasters**: Optional contracts that sponsor gas fees instead of the sender paying directly

When a bundler includes a UserOperation with a paymaster, the paymaster pays the gas for that transaction. The bundler validates the UserOperation locally before bundling, and after execution, collected fees are paid to the bundler.

### How privacy paymasters work

1. **Generate proof locally**: Create a withdrawal proof inside your wallet (no external service needed)

2. **Construct UserOperation**: From a new, unfunded account, specify:
   - `paymaster = PrivacyPaymaster` (the contract that will pay gas)
   - `paymasterData = withdrawal proof + destination`
   - The sender account doesn't need to exist on-chain yet

3. **Submit to alt mempool**: Send the UserOperation via `eth_sendUserOperation` to a bundler's RPC endpoint
   - You don't need ETH to submit—it's just an HTTP request
   - The bundler validates it by calling `simulateValidation()` on the EntryPoint
   - **Important**: Without additional protection, the bundler sees your IP address

4. **Bundler includes in bundle**: The bundler picks up your UserOperation from the alt mempool and bundles it with others

### Paymaster validation and execution

The EntryPoint calls the paymaster's `validatePaymasterUserOp()` method, which:
- Verifies the withdrawal proof is valid (by querying the privacy contract)
- Checks the withdrawal is made to the paymaster's address
- Returns approval to sponsor the gas

**Execution flow:**
1. Paymaster agrees to pay gas (based on proof validation)
2. User's account is deployed (or ERC-7702 delegation is set if it's an EOA)
3. Withdrawal executes, sending funds to the paymaster
4. EntryPoint calls paymaster's `postOp()` method
5. Paymaster deducts `actualGasCost` and sends remaining funds to the user's new account (or another address specified in `paymasterData`)

### What this solves (and what it doesn't)

**Advantages over traditional relayers:**
- **No gas needed**: You don't need ETH to submit—the paymaster pays everything
- **Fresh account**: The sender account has no on-chain history (it's created during execution)
- **Decentralized**: Anyone can run a bundler, multiple options available through the [Shared Mempool](https://docs.erc4337.io/bundlers/userop-mempool-overview)
- **No special trust**: Bundlers can't steal funds or censor specific users (with Shared Mempool)
- **Composable**: Works with any privacy protocol that can generate withdrawal proofs

**The remaining problem:**

When you submit the UserOperation via HTTP to a bundler's RPC endpoint, that bundler still sees your IP address—the same metadata leak as traditional relayers. The bundler knows:
- Your IP address
- The withdrawal amount (from the UserOperation)
- The destination address
- The timing

This is where OHTTP becomes essential.

## Network-layer privacy with OHTTP-RPC

**Oblivious HTTP (OHTTP)** ([RFC 9458](https://www.ietf.org/rfc/rfc9458.html)) solves the IP address problem by separating network identity from request content through a three-party model:

### The OHTTP architecture

- **Relay server**: Sees your IP address but cannot decrypt your requests
- **Gateway server**: Decrypts requests but doesn't know your identity  
- **Bundler RPC**: Receives UserOperations from the gateway, not your IP

The relay and gateway must be operated by different entities. An observer would need to compromise both to link your IP to your transaction content.

### Complete privacy: paymasters + OHTTP

For maximum privacy, submit your UserOperation through an OHTTP relay/gateway pair:

1. **Your wallet** generates withdrawal proof and creates UserOperation
2. **OHTTP relay** sees your IP but not the transaction content (it's encrypted with HPKE)
3. **OHTTP gateway** decrypts and forwards to bundler's RPC, but doesn't know your IP
4. **Bundler** validates and includes the UserOperation in a bundle, sees transaction but not your IP
5. **Privacy paymaster** validates the proof via EntryPoint and pays for gas
6. **On-chain** the transaction appears to come from your new account, funded by the paymaster

Now no single entity has enough information to deanonymize you:
- Relay knows your IP, not your transaction
- Gateway knows your transaction, not your IP
- Bundler knows your transaction, not your IP
- Paymaster validates the proof, but doesn't know who submitted it
- The Shared Mempool propagates your UserOp across bundlers, preventing censorship



The privacy paymaster model should be generic enough to work with any privacy protocol that can generate withdrawal proofs. Key design principles:



This architecture represents a fundamental improvement over relayers. It's trustless, decentralized through the Shared Mempool, and composable with other privacy primitives. The key insight is that account abstraction isn't just about better UX—it's a fundamental privacy tool when combined with zero-knowledge proofs and network-layer privacy.

For more details on ERC-4337, see the [official documentation](https://docs.erc4337.io/).

