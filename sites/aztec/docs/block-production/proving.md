# Proving

## L1 verifier

Verification on L1 starts with a call to the core rollup contract's [`submitEpochRootProof`](https://github.com/AztecProtocol/aztec-packages/blob/v3.0.0-nightly.20251112/l1-contracts/src/core/libraries/rollup/EpochProofLib.sol#L104)
function.

At this point, the pending chain is [pruned](https://github.com/AztecProtocol/aztec-packages/blob/v3.0.0-nightly.20251112/l1-contracts/src/core/libraries/rollup/STFLib.sol#L145)
from all epochs whose proving deadline has expired, resetting the chain tip to the last proven
block.

### Pruning in detail
TODO: how does this pruning and proving interact?

I'd expect Aztec's tip to be independent of Ethereum's tip, and any epoch proof must be submitted
