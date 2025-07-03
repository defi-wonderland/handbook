# Coding Challenge

This challenge is designed to immerse you in Wonderland's development culture. You'll be working on tasks similar to your take-home assignment, but now adapted to align with our team's standards and best practices. 

As you navigate our workflows, we welcome your critical perspective—suggest improvements and alternatives when you identify better solutions. Success in this challenge means not just completing the technical tasks, but also demonstrating your ability to integrate into our collaborative environment and contribute to our continuous improvement.

## Project Setup

To begin the challenge, familiarize yourself with our technology stack by exploring our boilerplate repositories:

- [Next.js Boilerplate](https://github.com/defi-wonderland/web3-nextjs-boilerplate)
- [Vite Boilerplate](https://github.com/defi-wonderland/web3-vite-boilerplate)

## Contract References

Use the following contract addresses for your implementation:

**Sepolia Testnet**:

- `DAI`: `0x1D70D57ccD2798323232B2dD027B3aBcA5C00091`
- `USDC`: `0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47`

## Implementation Requirements

Your challenge should include the following components:

- Custom UI/UX design implementation using Material-UI
- Efficient data fetching with Multicall for balances and allowances:
    - [Multicall documentation](https://github.com/joshstevens19/ethereum-multicall?tab=readme-ov-file#ethereum-multicall)
    - [Viem Multicall implementation](https://viem.sh/docs/contract/multicall#multicall)
- Core functionality:
    - `transfer()` implementation
    - `approve()` implementation
    - `mint()` implementation
- Transaction history features:
    - Account history of transfers
    - Account history of approvals
- Testing requirements:
    - Comprehensive unit tests
    - End-to-end (e2e) tests