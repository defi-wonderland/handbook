---
title: RPC Request Batching
---
# RPC Request Batching: Easily 10x your requests performance

Making individual HTTP requests sucks, that's why since Web2 we have been using bundles, image sprite sheets, and so on…

Same happens in Web3, and that's why `Multicall` exists, but we can do better!

At Wonderland, we have developed a different approach to batch requests, which is infinite times more flexible: **Constructor Batching Method**.

## The benefits

- **Independent**: Doesn't require any extra deployed contracts to work (undistinguishable from a contract deployment).
- **Versatile**: Can perform complex code logic, not restricting itself to batching individual calls into an array.
- **Efficient**: Solidity logic (vs making calls) can make the reading more efficient, reducing the load on the RPC provider.

## But how????

Solidity constructors are a thing of beauty which runs in the node's memory before contract deployment, we are going to take advantage of that 😈.

The goal of the Constructor Batching Method is to force the RPC to process Solidity code in memory and return the execution result. Since Solidity doesn't support returning arguments in the `constructor` logic, assembly is used to force returning data.

The magic of forcing the constructor to return data is that we save ourselves the step of deploying a contract and then calling the batching function. With this in mind, we can simulate the deployment, execute the constructor's logic, include arbitrary calls to external contracts, and return the data we need. All in one step. All in one request.

:::tip
Since the calls are made during the `constructor` runtime, all sub-calls to other contracts will be called with a `msg.sender` being the address where the virtual contract would be deployed. The contract cannot implement any external methods, as they will be inexistent during the creation time.
:::

## Step by step

To illustrate this approach, two simple solidity contracts are created. The source code can be downloaded from https://github.com/defi-wonderland/rpc-batching-sample:

1. **PoolManager**: This contract simulates a pool manager containing a function capable of querying a single pool at a time.
2. **BatchPoolManagerData**: This contract implements where magic happens. It will perform the necessary calls, store them in an array, and then return all the data. By doing this, RPCs can simulate the deployment of this contract and get the data in a single call instead of having to call `PoolManager`'s querying method multiple times. 

First, let's examine the `PoolManager` contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IPoolManager, Data} from '../interfaces/IPoolManager.sol';

contract PoolManager is IPoolManager {
  uint256 private constant _FAKE_LIQUIDITY = 10000;
  uint256 private constant _FAKE_NUM_POOLS = 50;

  /// @inheritdoc IPoolManager
  function queryPool(uint _poolId) public pure returns (Data memory _pool) {
    return Data({id: _poolId, liquidity: _FAKE_LIQUIDITY});
  }

  /// @inheritdoc IPoolManager
  function numPools() external pure returns (uint256 _numPools) {
    return _FAKE_NUM_POOLS;
  }
}
```

The `queryPool` method of the `PoolManager` contract receives an id and returns fake pool liquidity for the purposes of the example. Querying data for many pools would require querying the RPC node successively by calling the `queryPool` method with different ids. It will do a request per query, which can reduce our speed and stress the node.

![request.png](/img/rpc-batching-1.png)

It would look like this if we were to call all the pools:

```tsx
const poolCount = await poolManager.numPools();

const poolDataArray = [];
for (let i = 0; i < poolCount; i++) {
  poolDataArray.push(await poolManager.queryPool(i));
}
```

## Batching calls

To avoid doing a ton of calls, we will create the **`BatchPoolManagerData`** contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IPoolManager, Data} from '../interfaces/IPoolManager.sol';

// this contract is used to fetch multiple pools from the PoolManager contract
contract BatchPoolManagerData {

	// definition of the batching input data
  constructor(IPoolManager _poolManager) {
		// fetch the number of pools the script will query
    uint256 _poolsToFetch = _poolManager.numPools();

		// create an array where the return data is going to be stored
    Data[] memory _returnData = new Data[](_poolsToFetch);

    // fetch data for each pool
    for (uint256 _i = 0; _i < _poolsToFetch; _i++) {
      _returnData[_i] = _poolManager.queryPool(_i);
    }

    // encode the return data
    bytes memory _data = abi.encode(_returnData);

    // force constructor to return data via assembly
    assembly {
			// abi.encode adds an additional offset (32 bytes) that we need to skip
      let _dataStart := add(_data, 32)
			// msize() gets the size of active memory in bytes.
      // if we subtract msize() from _dataStart, the output will be
      // the amount of bytes from _dataStart to the end of memory
      // which due to how the data has been laid out in memory, will coincide with
      // where our desired data ends.
			let _dataEnd := sub(msize(), _dataStart)
			// starting from _dataStart, get all the data in memory.
      return(_dataStart, _dataEnd)
    }
  }
}
```

## Consuming batch data from the client

Lastly, we need to consume the data from our client.

Take a look at the following sample code:

```solidity
import { PoolManager__factory, BatchPoolManagerData__factory, IPoolManager } from '@typechained';
import { ethers } from 'hardhat';
const ERROR_SIGNATURE = "08c379a0"
// encode the input data for BatchPoolManagerData's constructor arguments
const inputData = ethers.utils.defaultAbiCoder.encode(['address'], [poolManager.address]);

// concatenate the bytecode of BatchPoolManagerData with the input data.
// the slice is done to remove the 0x prefix from the input data added by the encoding
const contractCreationCode = batchPoolManagerDataFactory.bytecode.concat(inputData.slice(2));

// do an eth_call with contractCreationCode as the data argument to deploy the
// virtual constructor and get back the desired data
const returnedData = await ethers.provider.call({ data: contractCreationCode });
let decoded;
try {
	// decode the returned data to get the array of tuples using the same data types as the Data struct in the PoolManager contract
	decoded = ethers.utils.defaultAbiCoder.decode(['tuple(uint256,uint256)[]'], returnedData);
}
catch (err) {
	// decode error if constructor reverted the tx
	if (returnedData.slice(2, 10) == "08c379a0") {
		throw new Error(ethers.utils.toUtf8String('0x' + returnedData.slice(10)));
	}
	throw new Error(`something went wrong: ${err}`);
}

```

Graphically the batched RPC request would look like this: only one call to get `n` pools instead of `1 + n` calls (`numPools` + n `queryPool`).

![rpc-2.png](/img/rpc-batching-2.png)

And that's all. The data is now available to be requested by the client with only one call to the RPC.

:::tip
A sample working version of this method can be found at  https://github.com/defi-wonderland/rpc-batching-sample
:::

## RPC Support

- ✅ Infura
- ✅ Alchemy
- ✅ Tenderly Web3 Gateways
- ✅ Hardhat
- ✅ Ankr
- ✅ LlamaNodes
- ❎ Anvil

## Real-life examples

Public repositories using the Constructor Batching Method we found:

- Price Oracle App: [Batch contract](https://github.com/price-oracle/app/blob/main/solidity/contracts/BatchPoolManagerData.sol) & [Decode function](https://github.com/price-oracle/app/blob/116dedda7494459b9c7836dc240933281bf781e9/src/services/poolManagerFactoryService.ts#L82).
- DrGorilla's UniV2-burn: [Batch contract](https://github.com/drgorillamd/UniV2-burn/blob/master/contracts/BatchRequest.sol#L17) & [Decode function](https://github.com/drgorillamd/UniV2-burn/blob/master/scripts/controller.js).