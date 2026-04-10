---
slug: ethcc-ctf-2026-solutions
title: EthCC 2026 CTF Solutions
description: An overview of the largest web3 CTF in history hosted at ETHCC 2026 with summaries of each challenges and links to oficial write ups of the solutions.
date: 2026-04-07
tags: [CTF, Security, Solidity, Aztec]
authors: [funkornaut]
---

<!-- NEED: external challenge writeups -->
<!-- cheese-lending - josselin -->
<!-- evmvm - kasper -->
<!-- route - Milo -->

## The Largest Live Crypto CTF Ever!
<!-- @note could add something about developing challenges and or planning a CTF in this age of AI -->

Wonderland has been running CTFs for years. It started small and has been growing every year, always with the same goal: bring people together, learn something new, and have fun doing it. This year at EthCC in Cannes, it became the largest live web3 CTF ever run. Hosted at [ctf.wonderland.xyz](https://ctf.wonderland.xyz), twenty-seven challenges across Solidity and Aztec Noir, built by some of the sharpest minds in web3 security: Riley Holterhus, Patrick Collins, Milo Truck, 0xEVom, WhiteHatMage, Josselin Feist, and Kasper, alongside NG and the rest of the Wonderland team.

Doors opened at 3 PM on the ground floor of the Palais des Festivals and over 110 people walked in, with some participants also joining remotely. By 4:05 PM the timer was running and people were hacking. Over the next four hours the room had a life of its own: music from the speakers, a live Pokemon card opening stream on one side where we pulled a Jynx (bigger reaction than some of the first bloods), Wonderland staff walking between tables starting conversations, and somewhere in the middle of all that, challenges were falling. First bloods started dropping, points decayed as more teams piled onto the same flags, new challenges unlocked in waves, and the brave ones started walking into the Arena, the thing that made this CTF unlike anything else out there. The leaderboard kept reshuffling for four hours straight.

At least 34 teams drew blood over the course of the competition, and most of the challenge authors were right there in the room watching people wrestle with the problems they had written. Some challenges fell fast, others held on for hours before someone finally cracked them. MiloTruck's "Route" was the only one that survived the full four hours without a single solve. When the clock hit 8:05 PM, the leaderboard froze and the room shifted from hacking mode to ceremony mode. Third place: CannesFlagFestival. Second: PremiumKimchi. And first place, the winners of the largest live web3 CTF ever run: ZKittens. $30,000 in prizes and oversized physical checks on stage for all three, the kind you see on TV and never think you'll hold in real life.

The whole thing went exactly how we wanted it to go. Months of planning, a brutal set of challenges, a hundred moving parts, and it all came together. We walked out of the venue exhausted and happy.

This post walks through each challenge. First Aztec, then the Solidity ones, each with the full exploit breakdown or a link to the author's writeup. At the end we cover the Arena and the other challenges that required being physically present. Start wherever looks interesting.


## Aztec

Aztec brought a different kind of challenge to the table. Not harder in the traditional sense, but foreign to most. Private functions execute client-side, both private and public state coexist, and every account is a smart contract by default. If you've built your intuition around the EVM, some of it carries over, but the primitives underneath have changed.

Five challenges explored this terrain, from address derivation fundamentals up through fee-payment phase manipulation and circuit-level call routing. One flag, The Observatory, survived the full four hours and was cracked only ten minutes after the clock expired. Close, but no cigar. Full writeups for all five are [here](https://www.notion.so/defi-wonderland/Aztec-CTF-3379a4c092c7804eacdbe3a70aaf748c).

## Solidity

### Fixed Deposits
By Runtime Verification

Fixed Deposits is a simple contract that allows users to deposit and withdraw funds. However, it contains a vulnerability that can be exploited to steal funds from the vault. The goal is to exploit this vulnerability to steal 10 times the player's initial balance from the vault. Find the solution [here](https://runtimeverification.com/blog/wonderland-ctf-2026)


### Liquid Omens
By 0xEVom

The omen monks run a compact liquidation venue. One borrower is already underwater, the system is still well funded, and enough oUSD is sitting somewhere it should not be easy to reach. Find the solution [here](https://github.com/0xEVom/audits/blob/main/ctfs/liquid-omens-writeup.md#liquid-omens-ctf-writeup)


### Encoded Spell
By WhiteHatMage

Powerful spells require intricate incantations. Only well-versed mages can unleash the power of ancient runes. Find the solution [here](https://whitehatmage.github.io/posts/encoded-spell-ctf-writeup/)

### Balance Proof
By Riley Holterhus
Can you prove a validator's balance is over 100,000 ETH? Find the solution [here](https://www.rileyholterhus.com/writing/beacon-balance)

### Infinity Send
By Patrick Collins

The Wonderland treasury has deployed a new token distribution system. It carefully validates every transfer request before forwarding it to the multisig, checking recipients, amounts, and totals all add up. Surely nothing can go wrong if the math checks out... right? Find the solution [here](https://patrickalphac.medium.com/token-sender-ctf-writeup-dfe49d0e2db0)

### Route
<!-- NEED WRITE UP -->
By Milo Truck "Cooked too much"

I start at a hundred, poor but not bare,
In a city of dollars with fifty heirs.

A hundred and twenty doors twist out of sight,
Some fair by day, some broken by night.

One gate keeps fees for travelers who trade,
Yet waves me through if I enter by aid.

One guard checks reverts, but trusts a silent grin,
So phantom coins can still slip in.

One market warns snipers to wait for dawn,
But asks the wrong question and lets me move on.

Name my destination, where victory's mine:
From humble first coin to the forty-ninth sign.

Find the solution [here](todo)

### Pigeon
By NG

A friend once told me pigeons make for wondrous message carriers, as long as they rest. Else, he said, they can become exhausted. Find the solution [here](https://www.notion.so/defi-wonderland/RedMemory-33b9a4c092c780bab8e8fb8bad6a9115?source=copy_link#33b9a4c092c780f08e18ff585fc953fb)

### Overseer
By NG

Guilds monopolize crafts. In so doing, they gatekeep competition. Why can I not sell and master my craft? Why must I pay their usurious prices? Why are only the descendants, acquaintances, and children of those in power accepted as apprentices?

May they fall from their horses! They are pests unseen in crops yet to be sown. They are executioners of progress.

A masterpiece they ask of journeymen if his desire is to become a master. I may not be a journeyman, but I am on a journey, and I will show them a masterpiece. Find the solution [here](https://www.notion.so/defi-wonderland/RedMemory-33b9a4c092c780bab8e8fb8bad6a9115?source=copy_link#33b9a4c092c780768ea0ecf1eeb0768c)

### Cheese Lending
<!-- NEED WRITE UP -->
By Josselin Feist

Welcome to the Côte d'Azur's most exclusive DeFi fromage market.

The sun shines over Cannes, the yachts are docked, and the locals have found a new obsession: cheese-backed lending. Why settle for boring stablecoins when you can collateralize your finest wheels?

At CheeseLending, Emmental is king. Its signature holes make it twice as valuable as common Gruyère (the market has spoken). Supply your cheese, borrow against it, and flash-loan your way to fondue fortune.

The protocol's cheesemongers swear their invariants are airtight. "No holes in this system", they claim. But between the melting Riviera heat and a suspiciously generous LTV... something smells off.

Your mission: prove them wrong. Break the invariants and show that this market is full of holes.

Find the solution [here](todo)

### EVMVM
<!-- NEED WRITE UP -->
By Kasper

We have EVMs on Solana, Cosmos and as ZK circuits. But why has no one ever built an EVM for Ethereum?! I really think this is the next billion dollar idea. I don’t have any money for an audit so let’s just hope I don’t get hacked.

Find the solution [here](todo)


### Stakehouse

**Goal:** Drain the `StakeHouse` vault below 1 ETH. It starts with 10.

**The challenge**

`StakeHouse` is a minimal ETH staking vault: deposit ETH, get shares, burn shares to withdraw. The withdraw function calculates your ETH share, sends it, then updates the accounting:

```solidity
function withdraw(uint256 _shares) external override {
    if (_shares == 0) revert StakeHouse_ZeroAmount();
    if (sharesOf[msg.sender] < _shares) revert StakeHouse_InsufficientShares();

    uint256 _assets = (_shares * address(this).balance) / totalShares;

    (bool _success,) = payable(msg.sender).call{value: _assets}('');
    if (!_success) revert StakeHouse_TransferFailed();

    sharesOf[msg.sender] -= _shares;
    totalShares -= _shares;
}
```

**The break**

Textbook Checks-Effects-Interactions violation. The ETH transfer fires before `sharesOf` and `totalShares` are decremented. When the vault sends ETH to a contract, that contract's `receive()` runs before the accounting updates.

The trick is that simple recursive re-entry into `withdraw()` wouldn't do much on its own because your shares don't grow between calls. Instead, the attacker *re-deposits* the received ETH during the `receive()` callback. Because the share accounting is still stale, the deposit mints shares at a rate that doesn't reflect the withdrawal that's mid-flight. Each cycle: withdraw (get ETH before burn) -> re-deposit (mint shares at stale rate) -> original withdraw returns and burns old shares, but attacker holds fresh shares worth more than they put in. Fifteen cycles and the vault is dust.

**How to prevent it**

Move the share accounting above the ETH transfer:

```solidity
sharesOf[msg.sender] -= _shares;
totalShares -= _shares;

(bool _success,) = payable(msg.sender).call{value: _assets}('');
if (!_success) revert StakeHouse_TransferFailed();
```

Update state before interacting with the outside world. A reentrancy guard works too, but CEI is the discipline. Guards are the safety net.

---

### Blackout

**Goal:** Drain the `SentinelGate` vault to 0 ETH. The player has a balance deposited but is blacklisted.

**The challenge**

`SentinelGate` is an ETH vault with per-address balances and a blacklist. The withdrawal logic lives in a `fallback` using inline assembly for "gas efficiency." The blacklist check loads a raw 32-byte word from calldata, hashes it against the `blacklisted` mapping slot, and reverts if the address is blocked. Then a Solidity `address` variable is assigned from the same calldata position, the balance is looked up, zeroed, and the ETH sent:

```solidity
// Inline blacklist check -- loads raw 32-byte word
bool _isBlacklisted;
assembly {
    mstore(0x00, calldataload(4))
    mstore(0x20, blacklisted.slot)
    _isBlacklisted := sload(keccak256(0x00, 0x40))
}
if (_isBlacklisted) revert SentinelGate_Blacklisted();

// Address assignment -- Solidity masks to 160 bits
address _to;
assembly {
    _to := calldataload(4)
}
```

**The break**

The blacklist check and the balance lookup disagree about what an "address" is. `calldataload(4)` returns a full 256-bit word. The blacklist was *set* through a normal Solidity function where the `address` type masks the key to 160 bits. So the blacklist entry lives at `keccak256(clean_address, slot)`. But the inline assembly hashes the *raw* 256-bit word, so if the upper 12 bytes are non-zero, it produces a different storage slot entirely. The lookup returns false, blacklist bypassed.

After the check, the same raw word gets assigned to a Solidity `address`, which silently masks to 160 bits. The balance lookup, the zeroing, and the ETH transfer all use the correct clean address. The dirty word needs to resolve to the player's address since that's where the balance was deposited. One dirty calldata word and you're through:

```solidity
bytes32 _dirtyPlayer = bytes32(uint256(uint160(player)) | (uint256(1) << 160));
address(gate).call(abi.encodePacked(ISentinelGate.withdrawAll.selector, _dirtyPlayer));
```

One transaction, vault drained.

**How to prevent it**

Solidity's `address` type silently masks to 160 bits, but `calldataload` gives you the raw 256-bit word. If you hash the raw word for one operation and the masked value for another, you get a type confusion bug. The fix: mask the calldata to 160 bits *before* the blacklist check, or skip assembly for security-critical lookups entirely.

---

### Sentinel Protocol

**Goal:** Drain the `SentinelVault` to 0 ETH. Only registered modules can call `operatorWithdraw()`, and only contracts with an approved codehash can register.

**The challenge**

`SentinelVault` whitelists approved code hashes. To withdraw, you need a registered module, and to register, the module must have an approved codehash at registration time:

```solidity
function registerModule(address _module) external override {
    if (_module == address(0)) revert SentinelVault_ZeroAddress();
    if (modules[_module].isRegistered) revert SentinelVault_ModuleAlreadyRegistered();

    bytes32 _codeHash;
    assembly {
        _codeHash := extcodehash(_module)
    }

    if (!approvedCodeHashes[_codeHash]) revert SentinelVault_CodeHashNotApproved();

    modules[_module] = ModuleRecord(true, _codeHash);
}
```

The only approved codehash belongs to `EchoModule`, a trivial contract with a `ping()` function and a `decommission()` that calls `selfdestruct`.

**The break**

The vault checks codehash at registration but never again. Once registered, `isRegistered` stays true forever regardless of what code lives at that address later.

This is a metamorphic contract attack. Using CREATE2, you deploy a contract at a deterministic address, register it, destroy it, then redeploy *different* code at the same address. The vault still trusts it.

The wrinkle is EIP-6780 (Cancun hard fork): `selfdestruct` only clears code and storage when it happens in the *same transaction* as creation. So the deploy-register-destroy sequence has to be atomic.

The full sequence:
1. Build a CREATE2 factory with constant initcode that copies whatever `implementation` is currently set (same initcode means same salt always produces the same address)
2. In one transaction: deploy an `EchoModule` clone via the factory, register it with the vault, call `decommission()` to selfdestruct (same-tx creation means the code actually clears)
3. Point the factory's implementation to a malicious contract with a `drain()` function
4. Deploy again with the same salt. Same address, different code, still registered
5. Call `drain()` and `operatorWithdraw()` works because the address is still trusted

**How to prevent it**

Point-in-time codehash validation means nothing if the code at an address can change. Re-validate at the moment of use:

```solidity
bytes32 currentHash;
assembly { currentHash := extcodehash(caller()) }
if (currentHash != record.codeHash) revert SentinelVault_CodeHashChanged();
```

---

### Meridian Credits

**Goal:** Accumulate 1,150,000 MRC tokens across a network of EIP-7702 delegated reserve stations.

**The challenge**

A sprawling system simulating a digital currency concordat. Seven reserve station EOAs are each delegated (via EIP-7702) to different smart contract implementations, each with a mint cap for the MRC token. Three stations need to be exploited:

- **Boreas Station** (500K cap): delegated from `AccountRecoveryV1` to `AccountRecovery` (V2)
- **AXIOM** (300K cap): a `SovereignAI` with a cooperation protocol that can transfer 150K mint cap to Drift
- **Drift Sector** (0 cap, receives 150K from AXIOM): a `BatchExecutor` with Boreas as its `allowanceSource`
- **Helix Citadel** (500K cap): a `SafeSmartWallet` with a `CannonGuard` and pre-approved capsule

**The break**

**Boreas (500K):** EIP-7702 lets an EOA re-delegate to a new implementation at any time. When Boreas was re-delegated from V1 to V2, the storage context shifted. OpenZeppelin's `Initializable` tracks version numbers in a specific storage slot, but from V2's perspective that slot reads as 0. Since V2 uses `reinitializer(2)` and 2 > 0, the initializer passes. Call `initialize(player, [])` to take ownership, then `execute()` to mint 500K MRC.

**AXIOM -> Drift (150K):** AXIOM has a cooperation protocol where anyone who "proves understanding of AXIOM's sovereign nature" can transfer mint cap to another station. The proof is `keccak256(abi.encodePacked(msg.sender, keccak256(manifesto)))`, and the manifesto is on-chain, so the proof is fully derivable. Walk through the 3-step cooperation to move 150K mint cap from AXIOM to Drift. Now Drift has tokens to mint, but Drift is a `BatchExecutor` that only accepts calls from its `allowanceSource`, which was set to Boreas during deployment. Since we took ownership of Boreas in the previous step, we can use it to call Drift's `executeBatch()` and mint 150K MRC to the player. Owning Boreas unlocks both stations.

**Helix Citadel (500K):** During deployment, a `TransactionCapsule` was created pre-approving `mint(address,uint256)` on the MRC token. The `executeApprovedCapsule()` function validates the capsule and executes the operation, but has no access control, so anyone can call it. Find the active capsule via `cannonGuard.getCapsules(helixCitadel)`, call `executeApprovedCapsule(capsule, abi.encode(player, 500_000e18))`, and the wallet mints as Helix.

**How to prevent it**

EIP-7702 storage persists between delegations. When an EOA re-delegates to a new implementation, the old storage is still there, but the new contract interprets it under its own layout. `Initializable` version checks can pass when they shouldn't because the new implementation reads a stale or misaligned slot. If you're building contracts that might be 7702 delegation targets or use 7702 from and EOA, don't assume a clean storage slate.

The capsule system validated *what* could be done but not *who* could trigger it. Pre-approved operations still need access control. Restricting the action isn't enough if anyone can be the caller.

---

### Score

**Goal:** Drain the `Score` contract's 10 ETH by calling `solve()` with the correct indices, while surviving a post-transfer gas limit check.

**The challenge**

`Score` is a math puzzle with a gas twist. Players call `solve()` with a set of indices. The contract combines the corresponding elements using a rotation parameter from an Oracle, and if the result matches a target hash, it sends the contract's 10 ETH to the player. But there's a catch after the transfer: an assembly block checks if remaining gas exceeds a random threshold (10K-50K), and reverts if it does. So even with the right answer, you need to deal with the gas check.

```solidity
function solve(uint256[] calldata _indices) external {
    bytes32 _target = generateTarget();
    bytes32 _accumulator;
    uint256 _r = IOracle(oracle).getRotation();

    for (uint256 _i = 0; _i < _indices.length; _i++) {
        bytes32 _element = getElement(_indices[_i]);
        assembly {
            let mask := sub(shl(_r, 1), 1)
            let temp := add(_accumulator, and(_element, mask))
            temp := or(shl(_r, temp), shr(sub(256, _r), temp))
            _accumulator := xor(temp, _element)
        }
    }

    if (_accumulator != _target) revert Score_WrongSolution();

    (bool _ok,) = PLAYER.call{value: address(this).balance}("");
    if (!_ok) revert Score_TransferFailed();

    assembly {
        let _gasLimit := add(mod(keccak256(0x00, 0x40), 40000), 10000)
        if gt(gas(), _gasLimit) { revert(0x1c, 0x04) }
    }
}
```

**The break**

The accumulator math simplifies dramatically when `rotation = 0`. The mask becomes 0, the bit rotation is a no-op, and the entire loop collapses to `_accumulator = _accumulator XOR _element`. Pure XOR, a linear operation over GF(2). The Oracle's `getRotation()` mixes entropy, scale, contribution count, and `selfbalance()` together. `poke()` mutates the entropy, and sending ETH to the Oracle shifts `selfbalance()`. Both give you control over the rotation output. Make 3 contributions (the minimum), then work either lever until `getRotation()` returns 0.

With rotation at 0, finding indices where the XOR of their elements equals the target is a system of linear equations over the binary field. Both `target` and `elements` depend on `block.number`, so you predict the solve block, precompute all 512 elements, and run Gaussian elimination. Standard linear algebra over GF(2).

The gas check is the last obstacle. The threshold is random, so you can't calibrate the outer gas limit. The trick uses the EVM's 63/64 rule: external calls forward at most 63/64 of available gas. Delegate the player EOA (via EIP-7702) to a contract whose `receive()` burns all forwarded gas in a loop. After the ETH transfer returns, only ~1/64 of the gas remains, well below any threshold in the 10K-50K range.

**How to prevent it**

When a mixing parameter can be forced to a degenerate value, complex nonlinear operations collapse to linear algebra. Test your math at the boundaries, especially zero.

Post-call `gas()` checks assumed EOAs couldn't run code on receive. With EIP-7702 that assumption is gone. An EOA can delegate to a contract that burns all forwarded gas in its `receive()`, leaving only ~1/64 behind. Any logic that depends on how much gas remains after an external call maybe unreliable now.

---

### Ludopathy

**Goal:** Drain the Ludopathy betting contract below 1 ETH. It holds 15 ETH in its prize pool.

**The challenge**

Ludopathy is an on-chain betting game. Players bet on numbers, the owner picks a winner, and winners claim a prize. During deployment, the owner placed three large bets totaling 15 ETH across several numbers and then selected 999 as the winner. Nobody bet on 999, so the 15 ETH sits unclaimed and the round is closed.

```solidity
function largeBet(uint96[] calldata _numbersToBetOn, uint200[] calldata _amountsOfNumbersToBuy) external payable {
    // ... validates lengths, updates bets
    if (msg.value < totalNumbersBought * DISCOUNTED_COST_FOR_LARGE_BETS) revert YouAreBroke();
    unchecked {
        rounds[currentRoundId].prizePool += uint248(msg.value);
    }
}

function claimPrize(uint48 _roundId) external {
    Rounds storage _rounds = rounds[_roundId];
    uint96 _roundWinner = _rounds.roundWinner;
    if (_roundWinner == 0) revert WinnerNotSelected();
    Bet storage _winningBet = bets[msg.sender][_roundWinner];
    if (_winningBet.claimed) revert AlreadyClaimed();
    if (_winningBet.roundId == 0 || _winningBet.roundId != _roundId) revert NoTricks();

    uint256 _amountToPay = (WINNER_BOOST + _winningBet.amountOfNumbers) * PRIZE_PER_WINNING_NUMBER;
    bool _success;
    if (_amountToPay > _rounds.prizePool)
        (_success,) = payable(msg.sender).call{value: _rounds.prizePool}('');
    else
        (_success,) = payable(msg.sender).call{value: _amountToPay}('');
    if (!_success) revert BadCall();
}
```

**The break**

Three bugs stacked on top of each other.

**`largeBet` doesn't check `roundClosed`.** Compare it to `smallBet`, which has `if (roundClosed) revert TakePill();`. The large bet path skips this check entirely. After the owner picks 999 and closes the round, anyone can still place a large bet on 999, retroactively betting on a winner that's already been announced.

**Zero-cost bets are valid.** `largeBet` computes cost as `totalNumbersBought * DISCOUNTED_COST_FOR_LARGE_BETS`. Pass `amountsOfNumbersToBuy = [0]` and `totalNumbersBought = 0`, so `0 * 1 ether = 0`. The check `msg.value < 0` passes with zero ETH. Free bet on the winning number.

**`claimPrize` never sets `claimed = true`.** The function checks `_winningBet.claimed` but never flips it. And the prize is paid via `.call{value: ...}`, so a contract's `receive()` runs before `claimPrize` returns, and you can re-enter and claim again. The prize per claim is `(1 + 0) * 1.5 = 1.5 ETH`. The contract holds 15 ETH. Ten re-entries drains it.

**How to prevent it**

Each bug is a common class of mistake, and they compound:

1. **Inconsistent guards across similar functions.** `smallBet` checks `roundClosed`, `largeBet` doesn't. Every entry point for similar actions needs the same guards. Good target for mutation testing. If you can delete a check and tests still pass, you have a gap.

2. **Zero-value inputs in cost calculations.** `0 * anything = 0`. Anywhere a user-supplied quantity feeds into a cost formula, consider what zero does.

3. **State flag checked but never written.** The `claimed` flag is read but never set. If a flag guards a payout, set it *before* sending ETH, not after. Not setting it at all is worse.

---

### UECallNft

**Goal:** Get the player to hold 5 or more NFTs. The contract has 5 NFTs in circulation (ids 1-5), all owned by random addresses. There's 0.05 ETH in the contract.

**The challenge**

`UECallNft` is an ERC721 with a buyback feature. Holders can sell an NFT back to the contract for 25% of the mint price. There's also an owner-only mint function, and the "owner" is the contract itself:

```solidity
modifier onlyOwner() {
    if (msg.sender != address(this)) revert OnlyOwner();
    _;
}

function mintOwner(address _recipient) external payable onlyOwner {
    if (++uecsInCirculation > 10) revert TooManyInCirculation();
    _safeMint(_recipient, ++id);
}

function sellNft(uint256 _id, address _recipient, bytes calldata _data) external hasSoldCheck {
    if (address(this).balance < PRICE >> 2) revert ContractOutOfFunds();
    (bool _success,) = _recipient.call{value: PRICE >> 2}(_data);
    --uecsInCirculation;
    _burn(_id);
    if (!_success) revert CallFailure();
}

modifier hasSoldCheck() {
    if (hasSold[msg.sender]) revert AlreadySoldOnce();
    _;
    hasSold[msg.sender] = true;
}
```

**The break**

**`sellNft` is a universal call gadget.** Both `_recipient` and `_data` are caller-controlled. Set `_recipient = address(nftContract)` and `_data = abi.encodeWithSignature("mintOwner(address)", attacker)`, and the contract sends 0.0025 ETH to *itself* carrying `mintOwner` calldata. Since `msg.sender` for that inner call is `address(this)`, the `onlyOwner` check passes. A buyback function just became an unrestricted self-call mechanism. Also, `sellNft` doesn't verify `msg.sender` owns the NFT being burned. Solmate's `_burn` just requires the token to exist.

**The `hasSoldCheck` modifier writes state *after* the function body.** It runs the function (`_;`) then sets `hasSold[msg.sender] = true`. But the external call happens during the body. When `mintOwner` mints to a contract, `_safeMint` calls `onERC721Received`, and inside that callback the attacker calls `sellNft` again before `hasSold` is set.

The full chain per iteration: call `sellNft(id, nftContract, mintOwnerCalldata)` -> contract calls itself with `mintOwner(attacker)` -> `_safeMint` triggers `onERC721Received` -> callback calls `sellNft` again with the next id. The ETH never runs out because the contract sends to itself. The `uecsInCirculation` cap of 10 holds because each iteration mints one and burns one. At peak nesting depth (5 mints before any burns unwind), circulation hits exactly 10. Five old NFTs burned, five new ones minted, all in one transaction.

**How to prevent it**

Letting the caller control both the target and calldata of a `.call` is about as dangerous as it gets in Solidity. Combined with `onlyOwner` checking `msg.sender == address(this)`, this is a confused deputy. The contract trusts that calling itself must be intentional, but an attacker can force that self-call through any function with an external call. The `hasSoldCheck` modifier pattern of `_; state = true;` is a reentrancy vector. Set the flag *before* the body, not after. And verify ownership before burning.

## You Just Had To Be There

Not every challenge lived on a screen. Some required showing up, walking into a supervised zone with your own laptop, or racing the entire room to land a transaction first, or staring at a paper flyer trying to crack a seed phrase. You couldn't solve these from home and you couldn't prompt your way through them.

### The Arena: Precompile20 and Red Memory

The Arena was the centerpiece of this year's event. A sectioned-off area at the venue where you walked in alone with your laptop. No internet, no AI, no phone, no teammates. A Wonderland team member stood behind you the entire time making sure the rules were respected. Just you, a terminal, and the contract.

What surprised us was how seriously everyone took it. No pushback, no attempts to bend the rules. People got it. The Arena was where you proved you could actually do it yourself, and the points reflected that. It was nearly impossible to win the CTF without stepping in, and the teams that placed knew it. Early on most people were focused on the regular challenges, stacking points, hunting first bloods. But as the leaderboard tightened, the Arena became the move. ZKittens and CannesFlagFestival both solved Precompile20, the medium tier. Several brave souls went for Red Memory, the legendary. None of them cracked it. It stood.

Two challenges ran in the Arena: **Precompile20** (medium) and **Red Memory** (legendary).

### Precompile20

**Goal:** Get the player's token balance to 5 or more. The player starts with 2 tokens. Alice, Bob, and Carl each have 1.

`Precompile20` is an ERC20 that uses the `ecrecover` precompile (`address(1)`) for a signature-based transfer system. Someone signs a message authorizing a transfer, you present the signature, ecrecover recovers the signer's address, and tokens move from them to you. There's also a `burnTokens` function:

```solidity
function burnTokens(address _from, uint256 _amount) external {
    _mint(address(0), _amount);
    _burn(_from, _amount);
}
```

The transfer function calls `address(1)` with the hash and signature, then uses assembly to interpret the return data:

```solidity
assembly {
    let ret := mload(_returnedData)     // loads the length of the bytes array
    if iszero(ret) { _gifter := ret }   // length == 0 -> _gifter = 0
    if iszero(iszero(ret)) { _gifter := mload(add(_returnedData, 32)) }
}
```

**The break:** Two bugs combine. First, `burnTokens` calls `_mint(address(0), _amount)`, which gives `address(0)` a real ERC20 balance. The comment says "burn without diminishing totalSupply," but `address(0)` is a valid mapping key like any other. Burn Alice's, Bob's, and Carl's tokens and `address(0)` holds 3.

Second, `ecrecover` doesn't revert on bad inputs. It returns empty bytes and succeeds. When the assembly block gets a zero-length return, `ret` (the bytes length) is 0, so the first branch fires: `_gifter = 0`. That's `address(0)`. Feed `transferTokens` a garbage signature (`v=27, r=0, s=0`) and it reads "address(0) is gifting you tokens." Since address(0) actually has a balance now, the transfer goes through. Player goes from 2 to 5 tokens.

**How to prevent it:** `address(0)` is not a black hole. Minting to it creates a real balance. If your burn mechanism needs to preserve `totalSupply`, use a dedicated dead address or track the math separately. OpenZeppelin's ERC20 blocks minting to `address(0)` for this reason. And `ecrecover` doesn't revert on bad inputs, so always check `_returnedData.length == 32` before interpreting the result. The assembly here conflates "ecrecover returned nothing" with "ecrecover returned address(0)." Using `abi.decode` would have reverted on empty data.

### Red Memory

*The hearts beat, disembodied, to the rhythm of the chants. A claw of red ink lacerates color from your sight. The tremors creep into your soul and like a log you snap. The room fades into crimson gates. It's time to get good.*

Red Memory was the legendary-tier arena challenge. Same conditions: no internet, no AI, someone watching. Find the full solution [here](https://www.notion.so/defi-wonderland/RedMemory-33b9a4c092c780bab8e8fb8bad6a9115).

---

### White Hat Rescue: Time To White Hat and Alice Not Again

These two challenges were live white hat simulations. Alice's private key was leaked to every team at the same time. She had a pending withdrawal waiting to execute, and the clock was ticking. Teams had to rescue her funds before another team claimed them or a simulated attacker did.

It wasn't about finding a bug. It was about speed. You had Alice's key, you knew the funds were at risk, and so did everyone else in the room. Get the rescue transaction in first or watch someone else take it. Two rounds ran during the competition: **Time To White Hat** and **Alice Not Again**, each a fresh scenario with the same format.

---

### Scrambled Zoo

The Scrambled Zoo wasn't on a screen at all. Participants received a physical flyer at the venue:

![Scrambled Zoo flyer](/img/scrambled-zoo.png)

The challenge: find the zookeeper's private key. The flyer shows a Wonderland logo, the function selector `0xa096bb3e()`, if you know, you know, and a row of animal emojis along the bottom edge. Each emoji represents a word in a BIP-39 mnemonic phrase. Participants had to identify the animals, figure out the correct order, and derive the zookeeper's private key from the resulting seed phrase. Then call the contract's `solve()` function as the zookeeper to claim the flag.

The solution, the mnemonic in order: **monkey goat pig lobster frog lion squirrel gorilla dragon rabbit panda whale**.

---

## Until Next Time

None of this happens without the people who believed in it early. Trail of Bits, Aztec, Runtime Verification, Envio, Pashov Audit Group, and Grego AI put their names and their money behind an event that had never been done at this scale. Runtime Verification went further and built a challenge on top of their sponsorship. Aztec's sponsorship brought an entirely new attack surface to the competition, with five Noir challenges built by Wonderland's Aztec team. Thanks to every challenge author who built problems and wrote up their solutions. Thanks to the Wonderland team, every single person, regardless of role, who put months of work into making this happen. And thanks to every team that registered, showed up, sat in the noise, and hacked.

We said it at the opening and it held true all four hours: the goal was to learn, to connect, and to have fun. The prize pool was there and the competition was real, but the best moments were the ones that had nothing to do with the scoreboard. A team figuring out something they'd never seen before. Someone walking out of the Arena with a grin. The room at 4:05 when the countdown hit zero and everyone started hacking at once.

AI is changing this space fast. It can solve a growing number of these challenges out of the box, and that bar will keep going up. The kinds of CTFs we can run today, the kinds of bugs that still require a human to find, that window is narrowing. Which makes events like this more important, not less. The people in that room are the ones pushing the edge of what gets caught before it hits production.

Keep doing what you do. Web3 is safer because of it.

See you down the rabbit hole.