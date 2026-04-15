# Chain-specific addresses

## The problem

An Ethereum address like `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` is valid on any EVM-compatible chain.

In a multichain world this can cause problems: tokens sent on the wrong chain, broken UIs, frustrated users. 

## The standards

To address this, we worked on three complementary "Interoperable Address" standards

- [ERC-7930](https://eips.ethereum.org/EIPS/eip-7930) defines interoperable addresses (a binary format, for use onchain)
- [ERC-7828](https://eips.ethereum.org/EIPS/eip-7828) defines interoperable names (a human-readable form for user-facing contexts)
- Chain Agnostic Improvement Proposal 350 ([CAIP-350](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-350.md), which includes a registry of the standard serialization between binary and text representations for different chain ecosystems)

<div style={{maxWidth: '600px', margin: '1.5rem auto', borderRadius: '8px', overflow: 'hidden'}}>
  <video controls width="100%" style={{display: 'block'}}>
    <source src="/videos/chain-specific-addresses.mp4" type="video/mp4" />
  </video>
</div>

## Two representations

The standards define two representations: a human-readable name, and a compact binary encoding.

| Format | Example | When you use it |
| --- | --- | --- |
| **Name** | `vitalik.eth@ethereum` | Show in UIs, share with people |
| **Address** | `0x00010000010114d8da6bf2...` | On-chain storage, wire transfer |

To bring these standards to life we collaborated with Unruggable on an [onchain chain registry](https://ens.domains/blog/post/on-eth-chain-registry) (`on.eth`), which was approved for use by the ENS DAO.

We also developed a dedicated typescript package for easy integration of interoperable addresses, `@wonderland/interop-addresses`

> 📌 To learn more, feel free to check our [documentation](https://docs.interop.wonderland.xyz/addresses), explore the [landing page](https://interopaddress.com/) and interact with the [demo app](https://interop.wonderland.xyz/addresses).