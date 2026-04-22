---
slug: ethcc-ctf-2026-solutions
title: EthCC 2026 CTF Solutions
description: An overview of the largest live crypto CTF in history hosted at EthCC 2026 with summaries of each challenge and links to official writeups of the solutions.
date: 2026-04-21
tags: [CTF, Security, Solidity, Aztec]
authors: [funkornaut, weiser, ng, luke, lera, simon-something]
image: /img/blog-posts-img/ctf-2026/cover.png
---

## The results are in for the largest live crypto CTF ever!

We at Wonderland have been running CTFs for years. While they started small, they have grown year after year, always with the same goal in mind: To bring people together, learn something new, and have fun while doing so. This year at EthCC in Cannes, we hit a major milestone: We hosted the largest live web3 CTF in history. Via [ctf.wonderland.xyz](https://ctf.wonderland.xyz/), we delivered twenty-seven challenges across Solidity and Aztec Noir, built by some of the sharpest minds in web3 security: Riley Holterhus, Patrick Collins, Milo Truck, 0xEVom, WhiteHatMage, Josselin Feist, and Kasper, alongside NG and the rest of the Wonderland team.

Doors opened at 3 PM on the ground floor of the Palais des Festivals. Over 100 people walked in, with even more participants also joining remotely. By 4:05 PM, the timer was running and people were hacking. Over the next four hours, the room had a life of its own: music from the speakers, a live Pokemon card opening stream on one side [where we pulled a Jynx, which enticed a bigger reaction than some of the first bloods], and Wonderland staff walking between tables. Somewhere in the middle of all that, challenges were falling. First bloods started dropping, points decayed as more teams piled onto the same flags, new challenges unlocked in waves, and the brave ones started walking into the Arena, the thing that made this CTF unlike any other out there. The leaderboard reshuffled itself for four hours straight.

At least 34 teams drew blood over the course of the competition, with most of the challenge authors in the room watching people wrestle with the problems they wrote. Some challenges fell fast, while others held on for hours. Only two challenges survived the full four hours without a single solve: MiloTruck's "Route" and Aztec's "The Observatory" (which fell ten minutes after the clock expired). When the clock hit 8:05 PM, the leaderboard froze and the room shifted from hacking mode to ceremony mode. Third place: CannesFlagFestival. Second: PremiumKimchi. And first place, the winners of the largest live web3 CTF ever run: ZKittens. $30,000 in prizes and oversized physical checks on stage for all three—the kind you see on TV and never think you'll hold in real life.

The whole thing went exactly how we wanted it to go. Months of planning, a brutal set of challenges, a hundred moving parts, and it all came together. We walked out of the venue exhausted and happy.

This post walks through each challenge. We'll start with the Arena and the challenges that required being physically present, then Aztec, then the Solidity ones, each with the full exploit breakdown or a link to the author's writeup. Start wherever looks interesting.

:::tip All challenges are open source
Every challenge — source code, setup instructions, and reference solutions — lives at [github.com/defi-wonderland/wonderland-ctf-2026](https://github.com/defi-wonderland/wonderland-ctf-2026). Clone it, run the challenges locally, and try them yourself.
:::

## Index

**You Just Had To Be There**
- [Precompile20](#precompile20) — The Arena - Medium
- [Red Memory](#red-memory) — The Arena - Legendary
- [White Hat Rescue: Time To White Hat and Alice Not Again](#white-hat-rescue)
- [Scrambled Zoo](#scrambled-zoo)

**Aztec**
- [Medium Flag](#medium-flag)
- [Lucky Guess](#lucky-guess)
- [Summoners Deck](#summoners-deck)
- [Poisoned Flag](#poisoned-flag)
- [The Observatory](#the-observatory)

**Solidity**
- [Fixed Deposits](#fixed-deposits)
- [Liquid Omens](#liquid-omens)
- [Encoded Spell](#encoded-spell)
- [Balance Proof](#balance-proof)
- [Infinity Send](#infinity-send)
- [Route](#route)
- [Pigeon](#pigeon)
- [Overseer](#overseer)
- [Cheese Lending](#cheese-lending)
- [EVMVM](#evmvm)
- [Stakehouse](#stakehouse)
- [Blackout](#blackout)
- [Sentinel Protocol](#sentinel-protocol)
- [Meridian Credits](#meridian-credits)
- [Score](#score)
- [Ludopathy](#ludopathy)
- [UECallNft](#uecallnft)


## You Just Had To Be There

Not every challenge lived in a screen. Some required showing up, walking into a supervised zone with your own laptop, or racing the entire room to land a transaction first, or staring at a paper flyer trying to crack a seed phrase. Bottom line is you couldn't solve these from home and you couldn't prompt your way through them.

### The Arena: Precompile20 and Red Memory {#the-arena}

The Arena was the centerpiece of this year's event. A sectioned-off area at the venue where you walked in alone with your laptop. No internet, no AI, no phone, and no teammates. A Wonderland team member stood behind you the entire time making sure the rules were respected. Just you, a terminal, and the contract. The catch: you had to spend points you'd earned from regular challenges to buy a slot, and if you failed, those points were gone. But the reward for solving was massive. High stakes, higher rewards.

Every time someone bought a slot we announced it over the mic and the room broke into applause. You could feel the nervousness from across the venue. Some participants were visibly shaking as they sat down. One person attempted both challenges: medium and legendary. He meditated before approaching the arena. It takes guts to face it twice. He became a Wonderland favorite immediately. In fact, everyone who stepped into the arena immediately got our support. We rooted for them. We wanted them to win.

What surprised us was how seriously everyone took it. No pushback, no attempts to bend the rules. People got it. The Arena was where you proved you could actually do it yourself, and the points reflected that. It was nearly impossible to win the CTF without stepping in, and the teams that placed knew it. Early on most people were focused on the regular challenges, stacking points, hunting first bloods. But as the leaderboard tightened, the Arena became the move. ZKittens and CannesFlagFestival both solved Precompile20, the medium tier. Several brave souls went for Red Memory, the legendary. None of them cracked it. It stood.

Two challenges run in the Arena: **Precompile20** (medium) and **Red Memory** (legendary).

### Precompile20 {#precompile20}
By Wonderland

**Goal:** Get the player's token balance to 5 or more. The player starts with 2 tokens. Alice, Bob, and Carl each have 1.

`Precompile20` is an ERC20 that uses the `ecrecover` precompile (`address(1)`) for a signature-based transfer system. Someone signs a message authorizing a transfer, you present the signature, ecrecover recovers the signer's address, and tokens move from them to you.

<details>
<summary>Solution</summary>

There's a `burnTokens` function:

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

</details>

### Red Memory {#red-memory}
By NG

*The hearts beat, disembodied, to the rhythm of the chants. A claw of red ink lacerates color from your sight. The tremors creep into your soul and like a log you snap. The room fades into crimson gates. It's time to get good.*

Red Memory was the legendary-tier arena challenge. Same conditions: no internet, no AI, someone watching.

When we made the decision to organize the CTF, a portion of my days turned into brainstorming possible ideas for challenges. We had hosted a CTF some four months prior, in November, at DevConnect, and I had devised some challenges for that event as well. This meant two things: I had already used some of the tools in my arsenal, and I had a decent idea of how to fool LLMs.

Like most people reading this, I'm a nerd at heart. I've always found enjoyment in the endeavor of creating, and beauty in how even the most technical of things can be spun into a story.

So, there I was, cooking, and an idea for a challenge struck out of the blue as ideas do, and it was fitting. It had everything: it was challenging, short, it contained a blatantly clear reference to Silksong, a game myself and many people enjoyed, I had not used the idea in the previous CTF, and the entirety of it was based on one of the things I was somewhat confident LLMs would get wrong: memory modelling.

In my state of blissful ignorance, I sat down and poured the idea into code, and after a couple of hours, it was ready. I pulled out Codex, and to my dismay, it solves it to perfection in 20 minutes.

This annoyed me. That's the only way to put it. I had built this little thing I was proud of and eager to see people solve, and all of a sudden it was useless. No one would ever appreciate the challenge's reference or even attempt to solve it manually if an LLM could one-shot it. My immediate response was to add more complexity to it, contaminate memory with bytes that attempted to prompt inject the LLMs, but the end result was a Frankenstein of the original idea. I had added so much slop that the essence was gone. And, of course, all the protections didn't stop the LLMs. In fact, it only made it more of a roulette.

At that point, I had spent a considerable number of hours building and rebuilding this thing to have nothing to show for those hours, and beyond going through the grief of understanding jeopardy CTFs had fundamentally changed—if not died—I was going through the more immediate desperation of: "Hey, what do we do with the CTF? Time is of the essence, crafting a challenge that is not one-shottable with an LLM is proving genuinely hard, and if I manage to do it, then it may be so hard humans won't be able to solve it either in the time given. What is the point?"

In other words, I doubted it made any sense to go ahead with the CTF. I immediately brought this up internally. The idea of prohibiting AI was discussed, we even sent it to the external challenge creators to get their thoughts, but with the prizes being what they were and the impossibility of controlling no one was using AI, it made zero sense to go through with this measure.

Internally, I was reminded our CTFs were always chaotic and fun, and people could use the challenges after the event to learn, so there were reasons to go ahead with the event and to keep the playing field even for all teams, even if this meant having a set of challenges that were all one-shottable, as boring as that sounded.

That being said, we kept brainstorming ideas to diminish the impact of AI. We wanted to highlight the hacker ability to solve a challenge without the silicon whispering the answer. The immediate solutions required physical monitoring, which didn't scale with the resources at hand. But during a conversation with [Skele](https://x.com/Skeletor_Space), he suggested the idea of teams being able to spend points and buy slots to do certain challenges manually. This meant with fewer people we could have one or two members go to a team's table and check they were solving this given challenge without assistance. But then [Gori](https://x.com/0xGorillaDev) came into the call, and after a bit of back and forth, the arena was born. This became the main feature of the CTF, and the single feature that made the event fun again.

Of course, in the process, we kept trying to craft challenges that LLMs couldn't solve. This proved to be a difficult task. The main reason was we needed a `isSolved` function so the infra could know when a challenge was solved, and so the user had an idea of what they had to do to solve the challenge. This acted as an extremely effective guiding signal for LLMs, which was the root behind why making challenges not one-shottable was such a tough task.

The arena didn't come without its own problems though. We decided to have two difficulties: medium and legendary. We needed a challenge for each. We also needed to define how long people would have to solve each challenge, and how many slots we would allow at a time among other things. In the end, we went for 10 slots: 6 medium, 4 legendary. We would give 30 minutes to solve the medium, and at first we thought of giving an hour to solve the legendary.

We reviewed the different challenges we had. Finding candidates for the medium was simple, as it needed to be a somewhat simple challenge, and we had many of them. The legendary was different. We wanted it to be genuinely challenging in the given time frame, but we also wanted the people doing it to not have to know some obscure trick or detail as internet was not allowed in the arena. One of the main candidates was `RedMemory`, the challenge that kickstarted this whole thing, and that also started my brief stage of despair.

We asked the external challenge creators if they would be willing to tackle it without using AI or internet, and time themselves while doing so, as this would serve as a benchmark. [Riley Holterhus](https://x.com/rileyholterhus) offered to give it a go, and he solved it in about 1h 05min. This was a bit over the hour we wanted. Riley also has vast experience with assembly, so this wasn't optimal. We reviewed the other challenges a bit more, but none fit what we wanted. We decided to increase the arena time for the legendary from 1 hour to 1h 15min, and add a hint to the mix, which [Riley](https://x.com/rileyholterhus) helped us with.

In the end, many challengers faced the `RedMemory` in the arena, and none were left standing. This was not the ideal outcome. It would have been epic if someone managed to beat it and win the CTF doing so. But well, in the end, this didn't happen despite the people trying the legendary challenge being genuinely extremely skilled.

Many asked us to use `evm.codes` because the challenge was written mostly in assembly, and so opcodes were aplenty. I refused under the rationale that the effects of opcodes could be seen in the debugger, but this was, in hindsight, a bad call from my side.

On the bright side, the medium challenge was solved by many, and the arena was a huge success. People were shaking while solving the challenges! The stakes were truly high. Everyone from Wonderland was rooting extremely hard for the challengers as well. The whole thing felt electric, and for `RedMemory`, despite it not getting solved, I got to see the excitement of the challengers discussing it after their attempts, which made me quite happy.

To close this prelude, I believe the likely future of CTFs involves arena-like features for physical events, and PvP challenges, where teams and their LLMs have to compete against other teams and their LLMs to, for example, build the best strategy for a given challenge. Back in the day, Paradigm did 0xMonaco, and I think it's a perfect example of this.

Now, I know I have brushed over the inspiration behind `RedMemory`, so let's do that as I slowly pull out the technicalities from under the bed.

<details>
<summary>Solution</summary>

#### Overview

`RedMemory` is a challenge about, well, memory. A bunch of bytes are written to memory, and the objective is to craft a solution that grabs bytes from specific addresses in memory and that together spell the word "everbloom".

Now, for anyone who has played Silksong, the inspiration should have been obvious from the name of the challenge, but if it wasn't, then now it should be extremely obvious.

Beware, the rest of the overview contains big spoilers of an important scene in Silksong. Do not read if you will play it/are playing it and have not reached the scene yet.

Spoilers ahead:

The red memory is a scene in the game that happens in Act 3. After Grand Mother Silk is trapped in the Abyss, Hornet must find a way to save Pharloom from the tendrils of void that snarl it. To do this, she must plunge into the void and face Grand Mother Silk.

That being said, diving into the void without protection will kill her, and to make matters worse the only object known to be able to protect against the void is a flower that doesn't exist in the present. This flower is called Everbloom, and the only place where it exists is deep in Hornet's memories.

The snail shamans, a group of three characters who betrayed her and in doing so caused the disaster of Act 3, tell her there's a spell capable of sending her into her memories, but it's an unstable spell and it requires three hearts from three legendary figures of the past.

Hornet will get those hearts and be subjected to the spell, which will send her into the red memory. There, we get to see and know quite a bit of her past, and it's due to this that it's such an impactful scene. How it all plays out is crafted beautifully. In the end, she will talk to The White Lady and get the Everbloom, which will allow her to get to Grand Mother Silk and get a chance to save Pharloom.

The sentences in the challenge are taken from the different dialogues in the red memory. The `_red` function does an OR with the repeated "FF0000" mask in memory because this is the hexadecimal code for the color red. It's simulating making the memory layout red. The whole thing is about plunging into memory and finding in the different bytes that form "everbloom".

In other words, the challenge is sort of a meta reconstruction of that scene in the game.

It's simple, and straightforward, but I enjoyed crafting this challenge. At least, before getting humbled by the LLMs.

#### Technical Walkthrough

The challenge can look complex when seeing it for the first time. It's mostly written in assembly, it uses for loops, and it has seemingly random strings all about it. At the same time, the whole challenge happens in a short function: `cast`, and the solve condition, although slightly obscured, is straightforward: obtain the everbloom, which translates to having the same bytes layout in two different memory addresses.

`cast` can be separated into stages based on how memory changes as the function progresses. Let's go through them.

First is the large bytes layout stage:

```solidity
function cast(address _remembrance) external {
    {
        (string memory _weavers, string memory _silk, string memory _leave) = _child();
        (string memory _blur, string memory _desires, string memory _mother) = _beast();
        (string memory _mentor, string memory _stronger, string memory _sting) = _honey();
        (string memory _cost, string memory _wish, string memory _world, string memory _firstLight) = _lady();

        _red();
    }
    //...snip
}

function _child() internal pure returns (string memory _weavers, string memory _silk, string memory _leave) {
    _weavers = "weavers";
    _silk = "silk";
    _leave = "they leave";
}

function _beast() internal pure returns (string memory _blur, string memory _desires, string memory _mother) {
    _blur = "blur";
    _desires = "those are their desires... not your own";
    _mother = "mother";
}

function _honey() internal pure returns (string memory _mentor, string memory _stronger, string memory _sting) {
    _mentor = "a true mentor";
    _stronger = "stronger";
    _sting = "sting";
}

function _lady() internal pure returns (string memory _cost, string memory _wish, string memory _world, string memory _firstLight) {
    _cost = "cost";
    _wish = "wish";
    _world = "a world better than our own";
    _firstLight = "first light";
}
```

The only thing this is doing is laying out the different strings in memory. That's it. If we take a look at memory after this process is done, it looks like this:

![Memory after strings layout](/img/ctf-2026/red-memory-1.png)

Then, it "tints" memory red by calling `_red`, which simply ORs `RED_MASK` into every word in memory. It does skip the free memory pointer to not contaminate it.

```solidity
RED_MASK = 0xFF0000FF0000FF0000FF0000FF0000FF0000FF0000FF0000FF0000FF00000000

function _red() internal pure {
    assembly {
        for { let i := 0 } lt(i, 0x40) { i := add(i, 0x20) } {
            mstore(i, or(mload(i), RED_MASK))
        }
        for { let i := 0x60 } lt(i, 0x3e0) { i := add(i, 0x20) } {
            mstore(i, or(mload(i), RED_MASK))
        }
    }
}
```

This is more easily seen, look at how all the previous bytes colliding with "ff" were replaced, and the rest remained.

![Memory after _red tint](/img/ctf-2026/red-memory-2.png)

Now that the bytes are laid out in memory, and the `RED_MASK` is applied, the stage where control is given to the user begins.

`cast` goes ahead and makes a call to a user-controlled contract called `remembrance`. The user can pass the address as an argument when calling `cast`. It also copies whatever data the call to `remembrance` returns at the address where the free memory pointer is pointing, and updates the free memory pointer.

Interestingly, it sets `core` to the address the free memory pointer is pointing at.

```solidity
assembly {
    let fmp := 0x40
    let core := mload(fmp) // aim core at the address the fmp points at before updating fmp

    let retOffset := mload(fmp) // establish where to copy returndata from the call
    pop(call(gas(), _remembrance, 0, 0, 0, retOffset, 0x20)) // call remembrance and copy returndata
    mstore(fmp, add(mload(fmp), 0x20)) // update fmp, core is now pointing to a non memory free address

    //...snip
}
```

In memory, we can see that after the call, the `0x3e0` address is populated with the return data:

![Returndata copied to 0x3e0](/img/ctf-2026/red-memory-3.png)

Here's where things get tricky for the solver. The function presents a for loop, and to solve the challenge it's crucial to understand what it's doing, as once the user understands what it's doing, it becomes clear what bytes the `remembrance` contract must return.

Let's look at the for loop, and let's also take a look at the win condition:

```solidity
assembly {
    //...snip
    let retData := mload(retOffset)
    // for loop
    for { let i := 0 } lt(i, 0x1b) { i := add(i, 0x03) } {

        let travel := and(shr(sub(240, mul(i, 8)), retData), 0xffff)
        let search := and(shr(sub(232, mul(i, 8)), retData), 0xff)

        if iszero(lt(search, 32)) { revert(0, 0) }

        let move := sub(248, mul(search, 8))
        let part := and(shr(move, mload(travel)), 0xff)
        mstore8(add(mload(fmp), div(i, 0x03)), part) // write one byte at a time at fmp
    }

    let introspect := and(not(RED_MASK), mload(0x1bf))
    mstore(core, add(introspect, BLURRED_LIGHT))

    // win condition
    if eq(mload(core), mload(mload(fmp))) {
        everbloom := 1
    }
}
```

When looking at the for loop, one thing the user can notice is that the only thing he has control of is the `retData`, which are the bytes in the word returned before through `remembrance`.

Understanding then what `travel` and `search` do becomes the most important to solve the challenge.

We can also observe that at the end of each iteration of the for loop, a byte is stored at the address the `fmp` is pointing at.

Before we move on to break apart how `travel` and `search` work, and what ends up stored at the address the `fmp` is pointing at, let's take a look at the solve condition.

```solidity
let introspect := and(not(RED_MASK), mload(0x1bf))
mstore(core, add(introspect, BLURRED_LIGHT))

// win condition
if eq(mload(core), mload(mload(fmp))) {
    everbloom := 1
}
```

Before, we saw `core` was pointing at the address the `fmp` was pointing at before `fmp` was updated, so `core` is essentially the word just before the word the updated `fmp` points at:

- `core` = `0x3e0`
- `mload(fmp)` = `0x400`

The win condition checks the value stored in these two addresses is the same.

That being said, we see some odd things happening with `core`. Especially, we see an odd value stored in it. When we look at it in the debugger, we see `core` holds this value after the `mstore`:

![Debugger showing everbloom bytes at core](/img/ctf-2026/red-memory-4.png)

```
0x65766572626c6f6f6d0000000000000000000000000000000000000000000000
```

Which are the bytes corresponding to the string `everbloom`!

If the user somehow had control of what got written to `mload(fmp)`, then the user could replicate the bytes at `core` given they are unaffected by user inputs, and meet the condition.

As mentioned before, we know that in the for loop, through `travel` and `search` we can store one byte at a time at `mload(fmp)`.

How to solve this starts to make sense. More so, because the for loop happens to do 9 passes, and the bytes required in `mload(fmp)` are 9.

The question becomes what do `travel` and `search` do exactly, and how can we take advantage of them to write the bytes we want into that memory address?

You're free to work through the assembly with an LLM, but what's happening here, once it clicks, is straightforward:

- Each iteration of the loop grabs chunks of 3 bytes at a time from the data returned by `remembrance`
- These 3 bytes act as two instructions to the function.
- The first two bytes tell the contract: "Hey, travel to this address in memory". Let's say we wanted to travel to `0xa0`, then we would have `remembrance` return `0x00a0` in the first two bytes.
- The third byte tells it: "Within this address, grab the byte at this offset". So, let's say we wanted to grab the second byte at address `0xa0`, then we would pass `0x00a001`, as this is zero indexed, which would be read as: "Grab the second byte at memory address `0xa0`".

From there, and staring at the memory layout, it was all about constructing the instructions that would find the correct bytes to match the bytes that form `everbloom` and returning that in our `remembrance` contract.

Here's one solution:

```solidity
contract Remembrance {
    fallback() external {
        assembly {
            mstore(0x00, 0x00a00101200800a00400a00503800800e00201a0020300010240070000000000)
            return(0x00, 0x20)
        }
    }
}
```

Which can be decomposed into:

```
Instruction 0: go to 0x00a0, pick byte[1]
Instruction 1: go to 0x0120, pick byte[8]
Instruction 2: go to 0x00a0, pick byte[4]
Instruction 3: go to 0x00a0, pick byte[5]
Instruction 4: go to 0x0380, pick byte[8]
Instruction 5: go to 0x00e0, pick byte[2]
Instruction 6: go to 0x01a0, pick byte[2]
Instruction 7: go to 0x0300, pick byte[1]
Instruction 8: go to 0x0240, pick byte[7]
```

And here's the memory layout again to check the bytes being grabbed:

![Final memory layout for instruction mapping](/img/ctf-2026/red-memory-5.png)

</details>

---

### White Hat Rescue: Time To White Hat and Alice Not Again {#white-hat-rescue}

These two challenges were live white hat simulations. Alice's private key was leaked to every team at the same time. She had a pending withdrawal waiting to execute, and the clock was ticking. Teams had to rescue her funds before another team claimed them or a simulated attacker did.

It wasn't about finding a bug. It was about speed. You had Alice's key, you knew the funds were at risk, and so did everyone else in the room. Get the rescue transaction in first or watch someone else take it. Two rounds ran during the competition: **Time To White Hat** and **Alice Not Again**, each a fresh scenario with the same format.

---

### Scrambled Zoo {#scrambled-zoo}

The Scrambled Zoo wasn't on a screen at all. Participants received a physical flyer at the venue:

![Scrambled Zoo flyer](/img/scrambled-zoo.png)

The challenge: find the zookeeper's private key. The flyer shows a Wonderland logo, the function selector `0xa096bb3e()`, if you know, you know, and a row of animal emojis along the bottom edge. Each emoji represents a word in a BIP-39 mnemonic phrase. Participants had to identify the animals, figure out the correct order, and derive the zookeeper's private key from the resulting seed phrase. Then call the contract's `solve()` function as the zookeeper to claim the flag.

The solution, the mnemonic in order: **monkey goat pig lobster frog lion squirrel gorilla dragon rabbit panda whale**.

---

## Aztec

Aztec brought a different kind of challenge to the table. Not harder in the traditional sense, but foreign to most. Private functions execute client-side, both private and public state coexist, and every account is a smart contract by default. If you've built your intuition around the EVM, some of it carries over, but the primitives underneath have changed.

The design bet was specific: keep the challenges short and readable, but lean on deeply abstracted Aztec concepts that AI tends to ignore. Because Aztec is privacy-first, the testnet itself did the heavy lifting on infrastructure — no private network to maintain, and teams had no visibility into each other's submissions. The weight on the leaderboard was real: Aztec flags distributed 5,454 points across the competition, and 1,577 of those went uncollected — enough that skipping them meant giving up a podium spot.

Five challenges, from easiest to hardest.

### Medium Flag {#medium-flag}
By Wonderland

The [Aztec CTF boilerplate](https://github.com/defi-wonderland/ethcc-ctf-aztec-boilerplate) shipped with a test challenge that walked participants through their first Aztec transaction — deploying the setup, deriving a contract address, and calling `capture_flag()`. Medium Flag reused the exact same contract logic, just renamed — which produced a different Contract Class ID. Participants were expected to reuse the boilerplate script, but address derivation wouldn't match.

<details>
<summary>Solution</summary>

The catch: this contract was deployed **without** universal deploy, which embeds the deployer's address into the derivation. To make it less obvious, the `deployer` parameter was [silently removed](https://github.com/defi-wonderland/ethcc-ctf-aztec-boilerplate/pull/8/changes#diff-4827a88f52eeaf67cb841ba6cb07bdcf4ce55e5fc0c2b37475a1ac63387deb5dL36) from the solving script (defaulting to zero — universal deploy), and a deceiving hint told participants to "guess the salt" (impossible).

Two ways to find the deployer:

- **(a)** Look at the [block scanner](https://testnet.aztecscan.xyz/contracts/instances/0x29631deff68dc49132218d68639ae4fd585e9e2407f89452675b1b7d8ae41864) — the deployer is stored as public on-chain metadata.

![Deployer address on Aztecscan](/img/ctf-2026/aztec-medium-flag.png)

- **(b)** Notice that the deployer is also the owner of the Flag Emitter contract — readable directly from its public storage at slot 1.

Once the correct deployer address was known, deriving the contract address and calling `capture_flag()` was straightforward.

</details>

### Lucky Guess {#lucky-guess}
By Wonderland

Win rock-paper-scissors against randomness, 5 times in a row (probability = 1/243). The naive approach — simulate with different moves until the jackpot hits — is cursed: each simulation changes the randomness.

```rust
// Safety: the Cheshire Cat draws fate from the looking glass
let fate = unsafe { random() };
let fate_bytes: [u8; 32] = fate.to_le_bytes();
let cat_move: u8 = fate_bytes[0] % 3;

let result: u8 = (moves[i] + 3 - cat_move) % 3;
assert(result == 1, "The Cheshire Cat grins and fades away");
```

<details>
<summary>Solution</summary>

The `unsafe` keyword is the signal: `random()` is a **client-side oracle** — randomness is generated by the prover's local environment during proof construction, not derived from any on-chain state. `unsafe` means no circuit constraint stops the prover from controlling it.

Fixing the PRNG seed (`process.env.SEED`) in the local PXE makes the entire output sequence deterministic. Once the seed is locked, probe the current internal counter, derive the cat's move for each of the five rounds, compute the winning response, and submit the correct moves in a single transaction.

```tsx
function replicateFrRandom(counter: number): bigint {
  const buf = Buffer.alloc(64);
  for (let i = 0; i < 64; i++) {
    buf[i] = (counter >> (i * 8)) & 0xff;
  }
  return BigInt("0x" + buf.toString("hex")) % FR_MODULUS;
}
```

</details>

### Summoners Deck {#summoners-deck}
By Wonderland

This one used Note storage to hide the difficulty. Participants needed to write a "phantom" caller — a fully private contract that exists locally in the prover's PXE but has never had its bytecode published and has never been initialized — and mine a salt such that a derived digit sequence matched Note cards held by a player.

The sequence is derived by XORing the phantom's address with its salt (both truncated to `u64`), taking the last three decimal digits of the result, and checking that those three digits together with a class digit derived from the phantom's contract class ID form a permutation of `{1, 2, 3, 4}`. The expected card ordering is `[5, class_digit, d2, d1, d0]`.

<details>
<summary>Solution</summary>

The hint is that participants should draw and discard Note cards repeatedly to build the matching ordering:

- Start with `[1, 2, 3, 4, 5]`
- Discard `1`, `2`, `3`, `4` → left with `[5]`
- Draw again → `[5, 1, 2, 3, 4, 5]`
- Discard the newest `5`, then `4` (LIFO selection) → `[5, 1, 2, 3]`
- Continue until the desired sequence is achieved

The Note preprocessor always selects the **last** matching note when discarding, giving LIFO semantics over notes with equal values. Any target ordering is reachable through a finite sequence of draw and discard.

The "phantom" constraint is enforced using Aztec's historical proof system:

```rust
assert_contract_bytecode_was_not_published_by(header, caller);
assert_contract_was_not_initialized_by(header, caller, instance.initialization_hash);
```

These constraints prove, at circuit level, that the caller's contract class was never published to the public protocol and was never initialized by the time of the given block. In Aztec, a contract can be registered locally in a prover's PXE — with full private function execution capability — while remaining invisible to the rest of the network.

Blindly brute-forcing any Note set starting with `5` was possible, but much easier to brute-force permutations of `{1, 2, 3, 4}`, find a salt that satisfies the digit conditions, and then construct the Notes to match.

</details>

### Poisoned Flag {#poisoned-flag}
By Wonderland

This one leveraged a deeply abstracted feature of Aztec's execution flow. Because of native Account Abstraction, gas fees are paid within the transaction, deducted from whichever contract calls `set_as_fee_payer()`. To prevent fee-payment griefing, Aztec splits execution into three phases: **setup**, **app-logic**, and **teardown**.

- Setup phase cannot revert — if it does, the transaction is dropped entirely.
- App-logic may revert — setup effects persist, teardown still runs.
- Teardown may revert — setup effects persist, app-logic is also reverted.

The challenge required executing a specific sequence: `drink_poison` (A), `get_poisoned` (B), `take_antidote` (C), `capture_flag` (D). Executing `[A, B, C, D]` naively makes `seeded` and `poisoned` both true — capture is blocked forever.

<details>
<summary>Solution</summary>

The setup phase ends when `end_setup()` is called, which is implicitly triggered by the Fee Paying Contract (FPC). A transaction reverting before this point is considered invalid and won't be included in a block. A revert *after* setup rolls back app-logic but setup effects stick, and teardown always runs after app-logic.

Sequencers allowlist specific contracts and methods for the setup phase to avoid wasted computation on dropped transactions — which is why the FPC is typically the first call.

The relevant mechanics:

- `drink_poison` pushes a *drink nullifier* that `get_poisoned` checks for, and that teardown's `commit_poison` checks survived to the global tree.
- `get_poisoned` enqueues `set_poisoned` (app-logic, writes `poisoned = true`) and registers `commit_poison` as teardown (writes `seeded = true`).
- `capture_flag` asserts `seeded == true && poisoned == false`.

The solution is a two-transaction sequence: `[A, FPC, B, forced-revert]` first, then `[FPC, C, D]`.

In the first transaction, placing `drink_poison` before the FPC puts it in the setup phase, so the drink nullifier survives the forced revert. The forced revert rolls back `set_poisoned` (app-logic), but teardown's `commit_poison` — which asserts the drink nullifier exists in the global tree — still runs and writes `seeded = true`. The result: `seeded = true`, `poisoned = false`.

The standard Aztec JS fee payment always inserts the FPC at the *start* of the batch, so participants had to manually compose the transaction payload using `mergeExecutionPayloads`, explicitly controlling where the FPC sat in the call sequence.

</details>

### The Observatory {#the-observatory}
By Wonderland

*No one solved this during the competition.*

With this flag we wanted to go a step further and make it feel more like an EVM challenge. The expected flow: deploy a satellite contract implementing the `StellarInterface` protocol, trigger an observation chain to accumulate Solar Mass Units (SMU) tokens, and declare a singularity once crossing a 1 billion SMU threshold — burning all three research badges earned along the way.

The naive path — calling `scan()` and `spectrum()` repeatedly — required a prohibitive number of transactions, each with heavy proof generation overhead.

<details>
<summary>Solution</summary>

The smart path required noticing that `consume_shk_6237885(Field, Field)` is a **mined function selector**: it collides with `mint_to_private(AztecAddress, Field)` on the Token contract.

When the Observatory dispatches an observation to a satellite, it calls:

```rust
StellarInterface::at(satellite).consume_shk_6237885(mass_origin, flux_density).call(self.context);
```

If `satellite` is the Token contract, this matches `Token.mint_to_private(mass_origin, flux_density)` — minting an arbitrary amount of SMU directly to any recipient in the same private call. Since `AztecAddress` and `Field` share the same field-element ABI encoding, the arguments pass through without any type mismatch. A single call to `observe_shk_6237885(token, solver_address, 1_000_000_000)` mints 1B SMU on the spot, no retrieval step required.

Because the Observatory deployed a real token, it was the only challenge that leaked progress — at competition time, the SMU total supply was visibly increasing every few seconds, hinting that at least one team was taking the naïve approach. Despite going undefeated during the competition, a single team cracked it 10 minutes after the end.

The deeper lesson is a property unique to Aztec's private cross-contract calls: when contract A calls contract B with a given selector, it does not enforce what B's circuit actually *is* — only that (a) B has a function registered for that selector, and (b) the argument count matches. The arguments are not transmitted directly; they are committed via a hash, and the callee circuit is injected with the preimages to prove consistency. A selector collision between two functions with ABI-compatible argument encodings (like `Field` and `AztecAddress`, both a single field element) produces a fully valid cross-contract call that routes execution into an entirely different function than the caller may have intended.

</details>

### Primitives at a glance {#primitives-at-a-glance}

| Challenge | Core Aztec Primitive |
| --- | --- |
| Medium Flag | Non-universal deploy — deployer embedded in address derivation |
| Lucky Guess | Client-side `random()` oracle — prover-controlled, unconstrained |
| Summoners Deck | Private Note management (LIFO discard) + historical proofs for phantom callers |
| Poisoned Flag | Three-phase execution (setup / app-logic / teardown) + FPC position in payload |
| The Observatory | Private cross-contract selector collision — callee circuit not enforced by caller |

### Closing thoughts on Aztec {#closing-thoughts-on-aztec}

The usual EVM toolkit — storage collisions, reentrancy, overflow — doesn't translate directly to a ZK-native, privacy-first execution model. The interesting bugs live elsewhere: in the seams between provability and runtime, in the assumptions baked into fee payment, in the parts of the protocol AI has not yet memorised.

What delighted us was how effective the privacy of the testnet turned out to be as infrastructure. Teams had no visibility into each other's progress, no mempool to watch, no state to grief — and we had no private network to maintain. What is usually a painful operational burden became a non-issue.

AI could deploy contracts, derive addresses, and send transactions without much hand-holding. It could not reason about `unsafe` oracles, reconstruct three-phase execution semantics, or discover that a function named `consume_shk_6237885` was a mined selector. The challenges where AI confidently produced wrong answers were exactly the ones that stayed unsolved the longest — which was precisely the goal.

There is a lot of unexplored ground in Aztec's security model, and a CTF is one of the best ways to map it.

---

## Solidity

### Fixed Deposits {#fixed-deposits}
By Runtime Verification

Fixed Deposits is a simple contract that allows users to deposit and withdraw funds. However, it contains a vulnerability that can be exploited to steal funds from the vault. The goal is to exploit this vulnerability to steal 10 times the player's initial balance from the vault. 

Find the solution [here](https://runtimeverification.com/blog/wonderland-ctf-2026)


### Liquid Omens {#liquid-omens}
By 0xEVom

The omen monks run a compact liquidation venue. One borrower is already underwater, the system is still well funded, and enough oUSD is sitting somewhere it should not be easy to reach. 

Find the solution [here](https://github.com/0xEVom/audits/blob/main/ctfs/liquid-omens-writeup.md#liquid-omens-ctf-writeup)


### Encoded Spell {#encoded-spell}
By WhiteHatMage

Powerful spells require intricate incantations. Only well-versed mages can unleash the power of ancient runes. 

Find the solution [here](https://whitehatmage.github.io/posts/encoded-spell-ctf-writeup/)

### Balance Proof {#balance-proof}
By Riley Holterhus

Can you prove a validator's balance is over 100,000 ETH? 

Find the solution [here](https://www.rileyholterhus.com/writing/beacon-balance)

### Infinity Send {#infinity-send}
By Patrick Collins

The Wonderland treasury has deployed a new token distribution system. It carefully validates every transfer request before forwarding it to the multisig, checking recipients, amounts, and totals all add up. Surely nothing can go wrong if the math checks out... right? 

Find the solution [here](https://patrickalphac.medium.com/token-sender-ctf-writeup-dfe49d0e2db0)

### Route {#route}
<!-- NEED WRITE UP -->
By Milo Truck "Cooked too much"

"I start at a hundred, poor but not bare,<br/>
In a city of dollars with fifty heirs.

A hundred and twenty doors twist out of sight,<br/>
Some fair by day, some broken by night.

One gate keeps fees for travelers who trade,<br/>
Yet waves me through if I enter by aid.

One guard checks reverts, but trusts a silent grin,<br/>
So phantom coins can still slip in.

One market warns snipers to wait for dawn,<br/>
But asks the wrong question and lets me move on.

Name my destination, where victory's mine:<br/>
From humble first coin to the forty-ninth sign."

*Milo is putting the finishing touches on his writeup. We'll update this post with the link as soon as it's published.*

### Pigeon {#pigeon}
By NG

A friend once told me pigeons make for wondrous message carriers, as long as they rest. Else, he said, they can become exhausted.

Pigeon was my attempt at doing a challenge an LLM couldn't solve. It involved three different vulnerabilities, two of which involved cryptography and investigating the activity of different addresses to find signatures that could be leveraged to exploit the contracts.

As an interesting tidbit of lore, one of the cryptographic vulnerabilities this challenge leverages is based on this [post](https://x.com/Arvolear/status/2003489071084048785) by @Arvolear. Essentially, you can craft an account that using the same signature (with different y parity), can sign two different messages. The problem is that once the private key can be computed when you find the messages and the signature, so it's a neat quirk, but quite dangerous.

At first the challenge had the challengers craft their own signature that was valid for two different messages, but we later found out [Zach Obront](https://x.com/zachobront) was thinking of using this same quirk for his challenge but with a different twist. Instead of having the users craft the signature, he wanted to have them recompute the private key from the signature and messages, which was way tougher and harder to find.

In the end, Zach had a lot of things come up on his side, so we modified Pigeon to use his approach instead, making it way harder.

<details>
<summary>Solution</summary>

#### Technical Breakdown

Pigeon simulates being a message relayer contract, similar to the `OptimismPortal`. To skip the proving part, we had a privileged address allowlist the `Player` address to send a single message from the `Pigeon` contract with arbitrary `data` and a max cap of `2 ether` of value in the call.

This meant that right away the `Player` could get `2 ether` by sending it to an address he controlled.

However, this was not enough to comply with the solve condition, which required the `Pigeon`'s contract balance to be less than `7 ether`. It had a starting balance of `10 ether`. So removing `2 ether` was not enough.

Now, when looking at the `Pigeon` implementation, there doesn't seem to be a lot of wiggle room to meet the solve condition, but the `release` function and the `Challenge.sol` had some interesting information.

`release` didn't follow the checks-effects-interactions pattern, and `Challenge` had a real safe address as the owner.

```solidity
contract Challenge {
    ICreateXLike public constant CREATEX = ICreateXLike(0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed);
    SimpleSafe public constant safe = SimpleSafe(payable(0x924054eF74BbAED1Dc1bA76C2117D3277A509067));
    address public immutable PLAYER;
    address public immutable KEEPER;

    Pigeon public immutable pigeonImplementation;
    ERC1967Proxy public immutable pigeonProxy;

    constructor(address player, address keeper) payable {
        require(msg.value >= 10 ether, "insufficient deploy funding");

        PLAYER = player;
        KEEPER = keeper;

        pigeonImplementation = new Pigeon();
        bytes memory initData = abi.encode(address(pigeonImplementation), abi.encodeCall(Pigeon.initialize, (safe, KEEPER)));
        bytes memory initCode = abi.encodePacked(type(ERC1967Proxy).creationCode, initData);
        pigeonProxy = ERC1967Proxy(payable(CREATEX.deployCreate3(bytes32("WonderlandCTFBestCTF"), initCode)));

        (bool ok,) = payable(address(pigeonProxy)).call{value: 10 ether}("");
        require(ok, "proxy funding failed");
    }

    function isSolved() external view returns (bool) {
        return address(pigeonProxy).balance < 7 ether;
    }
}
```

```solidity
function initialize(SimpleSafe _safe, address _keeper) public initializer {
    if (address(_safe) == address(0) || _keeper == address(0)) revert ZeroAddress();

    __Ownable_init(address(_safe));

    safe = _safe;
    keeper = _keeper;
    carrier = address(100);
}

function release(bytes calldata _msg) external {
    (address pigeon, address dest, uint256 value, bytes memory cd) =
        abi.decode(_msg, (address, address, uint256, bytes));

    if (carryAllowance[pigeon] == 0) revert NotBanded();
    if (value > carryAllowance[pigeon]) revert CarryLimitExceeded();
    if (carrier != address(100)) revert AlreadyInFlight();

    carrier = pigeon;
    (bool success,) = dest.call{value: value}(cd);
    carrier = address(100);

    delete carryAllowance[pigeon]; // <--- CEI not followed.

    if (!success) revert FailedDelivery();
}
```

Interestingly, `release` requires `carrier` to be `address(100)`, else it reverts, but `initialize` resets `carrier`.

At this point, some may have thought: "If I could call `release`, do a 7702 delegation to `Player`, point the `release` call to `Player`, reinitialize the contract in the `Player` logic, and reenter `release`, I would be able to steal `4 ether` and solve the challenge."

That's correct. However, reinitializing was not possible, as `initialize` is protected with `initializer`. But this is an upgradable contract. What if you could trigger an upgrade, and have it do the same?

Here's where the investigation into the `safe` made sense. From the challenge we could see `safe` pointed at address `0x924054eF74BbAED1Dc1bA76C2117D3277A509067`, and in etherscan, we could see it actually had an [approval transaction](https://etherscan.io/tx/0xc3bed24f5400776a9b4dd35c9ce6bc50dbd3b6b19cc975f65b2378d6a89bae24).

![approveHash transaction input](/img/ctf-2026/pigeon-1.png)

Interestingly, it approved a hash, and there were no traces of its preimage, which made things harder.

If we dug a bit deeper, we could find some interesting things about the `safe` itself:

1. The owner was: `0x0c953d8F7a3530FDd6445DAcb2ab5A9dFdC6e2f9`
2. It had a guard at: [`0x7DDf37A6f6150411ca778D5558C110Ee9B47A168`](https://etherscan.io/address/0x7DDf37A6f6150411ca778D5558C110Ee9B47A168)
3. The threshold was 1

The threshold being 1 meant whatever the preimage of that approved hash was, was already ready to be executed.

Now, if we took a look at the owner transactions, we could see something very interesting:

![Safe owner transactions](/img/ctf-2026/pigeon-2.png)

It had deployed multiple contracts, one of which was called [`PigeonV2`](https://etherscan.io/address/0xd179e0ee6c368788546ea5d5189e903fec932257#code). If we looked at the contract deployment before `PigeonV2` we could see it had attempted to create another `SimpleSafe` but something went wrong. He then, in the latest transactions, redeployed `SimpleSafe` and `PigeonV2`, and approved the transaction hash we saw before.

From here, one could suspect the owner of the `safe` was clearly trying to upgrade the `Pigeon` implementation, and that the approved hash was somewhat related to that.

If we go back a couple steps, before we saw that to perform the attack we would require the new implementation to also overwrite `carrier = address(100)` in the initializer to perform the attack. Well, and keep most of the other logic the same.

When inspecting `PigeonV2`, we see this is the case. Everything is the same, but CEI is now followed and a pausing mechanism is added.

At this point, one could start trying the very likely preimages of the hash and see if they matched. The one that immediately comes to mind is: `pigeon.upgradeAndCall(PigeonV2, abi.encodeCall(PigeonV2.initialize, ()))`, with value and nonce `0`.

To check it out we could use the hashing method of the `safe` contract. So, call `safe.hashTx(pigeon, 0, upgradeData, 0)`.

And we would see this effectively recovered to the approved `txHash`.

However, `safe.execute` had a guard in place. Anyone could call `execute`, but only those approved by the [`guard`](https://etherscan.io/address/0x7DDf37A6f6150411ca778D5558C110Ee9B47A168) would make the transaction succeed.

Next step then was looking at the guard contract and see if we could bypass or fool it somehow.

When looking at the guard code we see something quite odd:

1. The `owner` can set a `pendingCaller`
2. A `compliance` account has to `sign` three times in order to approve a `pendingCaller`
3. Only then the `caller` became an `approvedCaller` and was capable of not being restricted by the guard when calling `execute` on the `safe`.

```solidity
pragma solidity ^0.8.0;

contract SimpleGuard {
    address public owner;
    address public compliance;
    mapping(address => bool) public pendingCallers;
    mapping(address => bool) public approvedCallers;
    mapping(address => uint256) public complianceCount;
    mapping(bytes => bool) public usedSigs;

    error MustBeApproved();
    error MustBePending();
    error OnlyOwner();
    error NotCompliance();
    error SignatureAlreadyUsed();
    error InvalidLength();

    event PendingCallerApproved(address);
    event ApprovedCaller(address);

    constructor(address _compliance) {
        owner = msg.sender;
        compliance = _compliance;
    }

    function approvePendingCaller(address _caller) external {
        if (msg.sender != owner) revert OnlyOwner();
        pendingCallers[_caller] = true;
        emit PendingCallerApproved(_caller);
    }

    function confirmPendingCaller(address _caller, bytes calldata _signature, bytes32 _message) external {
        if (!pendingCallers[_caller]) revert MustBeApproved();

        if (usedSigs[_signature]) revert SignatureAlreadyUsed();

        if (_signature.length != 65) revert InvalidLength();

        bytes32 _r = bytes32(_signature[0:32]);
        bytes32 _s = bytes32(_signature[32:64]);
        uint8 _v = uint8(_signature[64]);

        address _signer = ecrecover(_message, _v, _r, _s);

        if (_signer != compliance) revert NotCompliance();

        usedSigs[_signature] = true;

        complianceCount[_caller]++;

        if (complianceCount[_caller] == 3) {
            approvedCallers[_caller] = true;
            emit ApprovedCaller(_caller);
        }
    }

    function canExecute(address _caller) external returns (bool) {
        if (!approvedCallers[_caller]) revert MustBeApproved();
        approvedCallers[_caller] = false;
        complianceCount[_caller] = 0;
        return true;
    }
}
```

Now, things look rough for the challenger here:

1. `approvePendingCaller` which would be the first step is owner-gated.
2. He needs to get three valid signatures from the `compliance` account

Just the first step seems impossible and a dead end. The second one, however, is more interesting:

- It doesn't hash the `message`
- It allows arbitrary `calldata`
- Anyone could call the function as long as the `signature` recovered to `compliance` and the `caller` was `pending`.

This means that if the `compliance` account has signed other messages somewhere in the chain and those signatures weren't in the `usedSigs` mapping, the `caller` could reuse them to get himself approved.

Of course, getting himself approved required somehow getting the `owner` to mark him as `pending`, which again, seems impossible.

Whatever, let's look at the [`owner`](https://etherscan.io/address/0x4E7e51E0Cc1EdFdCE70B0F3BE98683Cd41dCD609) and see if we can find anything of use:

![Guard owner transactions](/img/ctf-2026/pigeon-3.png)

Looking at his transactions we can find:

- Lots of self transactions that seem of no help.
- A creation of an old `SimpleGuard`, an approval of a pending caller, and a confirmation.
- The deployment of the current `SimpleGuard`, and a reverting confirmation transaction attempting to set itself as an approved caller. This failed because he's not compliance.

Now, if we look at the confirmation transactions, both the old one and the new, reverting one, we can find the messages the owner signed, as well as the corresponding signatures:

```
First transaction:

Signature: 0x1d87ac1c8c4a402eee7fec50ea3c43b76101e21a9bbc49d39ace3e382e86ceee06980b9be9394a01db67e23d68ceae30e0303d016b74e21ba853f86a5e2cb8051c
Message: 0x307835363535316138333361313634633034333866363231383333323166376263316437366366396532306561386532633131326431643464653261316531323538

Second reverting transaction:
Signature: 0x1d87ac1c8c4a402eee7fec50ea3c43b76101e21a9bbc49d39ace3e382e86ceee06980b9be9394a01db67e23d68ceae30e0303d016b74e21ba853f86a5e2cb8051b
Second message: 0x307838616434326639323564353464666336643634626433303731363962633636613665353839613731363964356135343466333162313136663338666533333439
```

Huh, the signature is exactly the same except for the y parity, but the messages are different. Can there be something here?

The answer is yes, although to realize this requires knowing an ECDSA quirk. You can read about it in this [repo](https://github.com/Arvolear/ecdsa-quirks/tree/master/src). In short, it's possible to craft an account that can, with the same signature (different y parity), sign two different messages. However, the private key of the account can be recovered if someone has the signature and the messages.

Aha! By doing cryptographic magic we can recover the `owner`'s private key and sign a transaction from his account approving our account as a `pendingCaller`.

How to get the private key is left as an exercise for the reader. LLMs can get it quite rapidly when the vulnerability is pointed out.

So, what looked like an absolute dead end now has life. And what's better, we had an idea of how to get our account approved by `compliance`.

Let's hunt for `compliance` signatures.

Compliance is set to this address: [`0x5f69044Cb194BcE97489250F11F5c4F8C3e1F5d0`](https://etherscan.io/address/0x5f69044Cb194BcE97489250F11F5c4F8C3e1F5d0). If we look in etherscan, we see it has made no transactions. That's bad. But what about other chains?

After looking at some chains, we can find that address made a transaction on [Base](https://basescan.org/tx/0x6b8e76328c72be47b09b6725b722e933350733596d509bbdacaf1c10493ee826), a swap to get some AERO.

Now, this doesn't give us a signature. At least, there doesn't seem to be one in the calldata. But, wait a minute, all transaction objects are populated with a signature in order to derive the `from`. We can get one signature by getting the transaction object itself of the swap transaction.

This is not enough, though. We need two more signatures.

Ah! The `guard` is doing a plain `ecrecover` without limiting the `s` value. This means we can craft a valid symmetrical signature! We have two.

But where's the third? There are no more transactions in any other chain.

Well, the answer is another cryptographic quirk called [faketoshi signatures](https://jimmysong.medium.com/faketoshis-nonsense-signature-8700a44536b5). Turns out, when the only thing that matters is that a random message recovers to an account, and these messages are non-hashed, plain bytes, we can craft a large number of random messages and signatures that recover to the `signer` we need. The only thing needed is the uncompressed public key of the `signer`, in this case `compliance`, which we can derive from the transaction object.

Likewise, how to do a faketoshi signature based on the uncompressed public key of an account is left to the reader to derive. LLMs, again, can do this rapidly.

So now every piece of the puzzle is ready:

1. We can bypass the safe guard by calling `approvePendingCaller` with the `owner`'s PK and craft three faketoshi signatures to fool `confirmPendingCaller` into approving our `Player` address.
2. We then can call `Pigeon`, have it call a 7702 delegation of `Player`. In that delegation we can upgrade `Pigeon` to `PigeonV2` and reenter `release`, stealing a total of `4 ether`.

And that's `Pigeon` for you!

</details>

### Overseer {#overseer}
By NG

Guilds monopolize crafts. In so doing, they gatekeep competition. Why can I not sell and master my craft? Why must I pay their usurious prices? Why are only the descendants, acquaintances, and children of those in power accepted as apprentices?

May they fall from their horses! They are pests unseen in crops yet to be sown. They are executioners of progress.

A masterpiece they ask of journeymen if his desire is to become a master. I may not be a journeyman, but I am on a journey, and I will show them a masterpiece.

This one was an early attempt at making a challenge LLMs couldn't one-shot by reusing a real vulnerability found in an internal review that the leading autonomous bug hunter services couldn't find.

Of course, models evolved, and with the `isSolved` making the winning condition clear, the LLMs solved it.

<details>
<summary>Solution</summary>

#### Technical Walkthrough

The Overseer challenge simulates a medieval guild governance system. A guild holds 10 ETH, governed by a council of elders who can propose, vote on, and enact decrees. The solve condition is straightforward: drain all ETH from the guild.

```solidity
function isSolved() external view returns (bool) {
    return address(guild).balance == 0;
}
```

To drain the guild, you need to pass a decree — a proposal containing arbitrary calls ("edicts") that the guild executes on approval. So the plan is simple: propose a decree that sends 10 ETH to the player, get it approved, and enact it.

The problem is getting it approved.

#### The Governance System

All actions in the system are routed through the `Overseer`, an identity registry. Every participant ("folk") enrolls to get a unique `bytes16` badge. To do anything — propose, vote, enact — you call `overseer.oversee()`, which verifies you own the badge you claim to act from, and then forwards the action to the target contract:

```solidity
function oversee(
    bytes16 _fromBadge, bytes16 _toBadge,
    bytes32 _activity, bytes32 _subject, bytes calldata _data
) external {
    if (!activeBadges(_fromBadge) || !activeBadges(_toBadge)) revert BadgeNotActive();

    address _fromFolk = _badgeToFolk[_fromBadge];
    if (msg.sender != _fromFolk) revert InvalidCaller();

    address _toFolk = _badgeToFolk[_toBadge];
    if (msg.sender != _toFolk) {
        IFolk(_toFolk).write(_fromBadge, _activity, _subject, _data);
    }

    emit Activity(_fromBadge, _toBadge, _activity, _subject, _data);
}
```

The Guild receives these forwarded actions and processes them — proposals, votes, or enactments:

```solidity
function write(bytes16 _fromBadge, bytes32 _activity, bytes32 _subject, bytes calldata _data) external override {
    if (!hasRank(OVERSEER_ROLE, msg.sender)) revert Trespasser();
    address _fromFolk = overseer.badgeToFolk(_fromBadge);

    if (_activity == DECREE_PROPOSED) {
        _proposeDecree(_fromFolk, _data);
    } else if (_activity == DECREE_VOTED) {
        _castVerdict(_fromFolk, _data);
    } else if (_activity == DECREE_ENACTED) {
        _enactDecree(_data);
    } else {
        revert ForbiddenAct();
    }
}
```

#### The Setup

Looking at `Challenge.sol`, we see how the council is configured:

```solidity
constructor(address player) payable {
    PLAYER = player;
    overseer = new Overseer(player);

    sealedTurncloak = new SealedTurncloak(IOverseer(address(overseer)));
    loyalistFolk = new Loyalist(IOverseer(address(overseer)), 0xf5930c6AC61D6bdD2cB8d3312beBe506DEab78Cc);

    address[] memory initialElders = new address[](3);
    initialElders[0] = address(sealedTurncloak);
    initialElders[1] = address(loyalistFolk);
    initialElders[2] = player;

    guild = new Guild(
        player, IOverseer(address(overseer)),
        Guild.CouncilRules({verdictThreshold: 3, duration: 15}),
        initialElders
    );
    // ...
}
```

Three elders, verdict threshold of 3, voting duration of 15 blocks. That means **every single elder** must vote Aye for a decree to pass. Let's see what we're working with:

1. **Player** — we control this one. That's 1 Aye.
2. **Loyalist** — can vote, but only when called by its `owner`, which is `0xf5930c6AC61D6bdD2cB8d3312beBe506DEab78Cc`. Not us. Dead end.
3. **SealedTurncloak** — can vote, but requires a secret proof.

At first glance, this seems impossible. We control 1 out of 3, and we need all 3. Let's dig into each elder to see if there's any wiggle room.

#### The SealedTurncloak — "Private" Isn't Secret

SealedTurncloak inherits from `SealedVault` and requires a proof to vote:

```solidity
function unseal(bytes16 _decreeId, uint8 _verdict, uint256 _proof) external {
    if (_verdict == 0 || _verdict > 3) revert InvalidVerdict();
    if (unsealed[_decreeId]) revert AlreadyUnsealed();
    if (!_verifyProof(_proof)) revert InvalidProof();

    unsealed[_decreeId] = true;

    overseer.oversee(badge, guildBadge, DECREE_VOTED, bytes32(_decreeId), abi.encode(_decreeId, _verdict));
}
```

The proof lives in `SealedVault`:

```solidity
contract SealedVault {
    uint256 private _proof;

    constructor() {
        _proof = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, address(this))));
    }

    function _verifyProof(uint256 proof) internal view returns (bool) {
        return proof == _proof;
    }
}
```

The `private` keyword only prevents other *contracts* from reading the variable at the Solidity level. It doesn't hide anything on-chain. Anyone can read any storage slot directly using `eth_getStorageAt`. The proof sits in a known storage slot, derived from SealedTurncloak's inheritance layout. Read it, pass it to `unseal`, and SealedTurncloak votes however we want.

That gives us 2 Ayes. We still need a third. The Loyalist is owner-gated by an address we don't control. So where does the third vote come from?

#### The Badge Transfer — Ranks vs. Votes

This is where the core vulnerability lives. To find it, we need to look at how the Guild checks who's an elder and how it tracks votes.

Ranks (like ELDER) are managed by `OverseerEye`, and they're tied to **badges**:

```solidity
mapping(bytes32 => mapping(bytes16 => bool)) internal _rankByBadge;

function hasRank(bytes32 _rank, address _folk) public view virtual returns (bool) {
    bytes16 _badge = overseer.folkToBadge(_folk);
    return _rankByBadge[_rank][_badge];
}
```

When the Guild checks "is this folk an elder?", it resolves `address → badge → rank`. The ELDER rank is stored against the badge, not the address.

Now look at how votes are tracked in `_castVerdict`:

```solidity
function _castVerdict(address _fromFolk, bytes calldata _data) internal {
    (bytes16 _decreeId, Verdict _verdict) = abi.decode(_data, (bytes16, Verdict));
    if (!_canVote(_fromFolk, _decreeId, _verdict)) revert CannotCastVerdict();

    Decree storage decree_ = _decrees[_decreeId];

    // ... tally adjustments ...

    decree_.verdicts[_fromFolk] = _verdict;  // <--- keyed by ADDRESS
}
```

Verdicts are tracked by **address**, not badge. And `_canVote` checks elder status, which goes through `hasRank`, which resolves through the badge.

Now, the Overseer has a badge transfer mechanism. You can propose to transfer your badge to another address, and that address can accept:

```solidity
function proposeBadgeChange(address _newFolk) external {
    bytes16 _badge = _folkToBadge[msg.sender];
    _badgeToProposedFolk[_badge] = _newFolk;
}

function acceptBadgeChange(bytes16 _badge) external {
    // ... checks ...
    _badgeToFolk[_badge] = msg.sender;
    _folkToBadge[_oldFolk] = bytes16(0);
    _folkToBadge[msg.sender] = _badge;
}
```

Here's where the mismatch becomes exploitable:

1. Player votes Aye — recorded as `verdicts[player] = Aye`, tally goes to 1.
2. Player transfers their badge to a new contract (a "relay").
3. The relay now holds the player's badge. `hasRank(ELDER, relay)` resolves to the player's old badge, which still has the ELDER rank.
4. The relay votes Aye — recorded as `verdicts[relay] = Aye`, tally goes to 2.

The player's original vote is already tallied and never invalidated. Two different addresses, one badge, two votes.

#### Putting It All Together

With 2 votes from the badge trick and 1 from reading SealedTurncloak's proof, we hit the threshold of 3. But there's still the timing gate — `isVerdictThresholdReached` requires the voting period to have ended:

```solidity
function isVerdictThresholdReached(bytes16 _decreeId) public view returns (bool) {
    Decree storage decree_ = _decrees[_decreeId];
    if (block.number <= decree_.parameters.lastDate) return false;
    if (decree_.tally.aye >= decree_.parameters.verdictThreshold) return true;
    return false;
}
```

The voting duration is 15 blocks. In the CTF environment each transaction advances the block, so we just need 15 dummy transactions after the votes. The solution uses a `tick()` no-op function on the relay for this.

#### The Solution

The exploit uses a helper contract called `BadgeRelay` that accepts the player's badge and acts on its behalf:

```solidity
contract BadgeRelay {
    function acceptAndVote() external {
        overseer.acceptBadgeChange(playerBadge);
        overseer.oversee(
            playerBadge, guildBadge, DECREE_VOTED,
            bytes32(decreeId),
            abi.encode(decreeId, uint8(Guild.Verdict.Aye))
        );
    }

    function tick() external {}

    function enact() external {
        overseer.oversee(
            playerBadge, guildBadge, DECREE_ENACTED,
            bytes32(decreeId), abi.encode(decreeId)
        );
    }
}
```

And the full attack flow:

```
Step 1: Propose a decree: "Send 10 ETH to player"
Step 2: Player votes Aye                                     → 1 aye
Step 3: Player proposes badge transfer to BadgeRelay
Step 4: BadgeRelay accepts badge and votes Aye               → 2 ayes
Step 5: Read SealedTurncloak's proof from storage,
        call unseal() to make it vote Aye                    → 3 ayes
Step 6: 15 dummy transactions to advance past voting period
Step 7: BadgeRelay enacts the decree → guild sends 10 ETH out
```

</details>

### Cheese Lending {#cheese-lending}
<!-- NEED WRITE UP -->
By Josselin Feist

Welcome to the Côte d'Azur's most exclusive DeFi fromage market.

The sun shines over Cannes, the yachts are docked, and the locals have found a new obsession: cheese-backed lending. Why settle for boring stablecoins when you can collateralize your finest wheels?

At CheeseLending, Emmental is king. Its signature holes make it twice as valuable as common Gruyère (the market has spoken). Supply your cheese, borrow against it, and flash-loan your way to fondue fortune.

The protocol's cheesemongers swear their invariants are airtight. "No holes in this system", they claim. But between the melting Riviera heat and a suspiciously generous LTV... something smells off.

Your mission: prove them wrong. Break the invariants and show that this market is full of holes.

*Josselin is putting the finishing touches on his writeup. We'll update this post with the link as soon as it's published.*

### EVMVM {#evmvm}
<!-- NEED WRITE UP -->
By Kasper

We have EVMs on Solana, Cosmos and as ZK circuits. But why has no one ever built an EVM for Ethereum?! I really think this is the next billion dollar idea. I don’t have any money for an audit so let’s just hope I don’t get hacked.

*Kasper is putting the finishing touches on his writeup. We'll update this post with the link as soon as it's published.*


### Stakehouse {#stakehouse}
By Simon Something

**Goal:** Drain the `StakeHouse` vault below 1 ETH. It starts with 10.

`StakeHouse` is a minimal ETH staking vault: deposit ETH, get shares, burn shares to withdraw.

<details>
<summary>Solution</summary>

#### The challenge

The withdraw function calculates your ETH share, sends it, then updates the accounting:

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

#### The break

Textbook Checks-Effects-Interactions violation. The ETH transfer fires before `sharesOf` and `totalShares` are decremented. When the vault sends ETH to a contract, that contract's `receive()` runs before the accounting updates.

The trick is that simple recursive re-entry into `withdraw()` wouldn't do much on its own because your shares don't grow between calls. Instead, the attacker *re-deposits* the received ETH during the `receive()` callback. Because the share accounting is still stale, the deposit mints shares at a rate that doesn't reflect the withdrawal that's mid-flight. Each cycle: withdraw (get ETH before burn) -> re-deposit (mint shares at stale rate) -> original withdraw returns and burns old shares, but attacker holds fresh shares worth more than they put in. Fifteen cycles and the vault is dust.

#### How to prevent it

Move the share accounting above the ETH transfer:

```solidity
sharesOf[msg.sender] -= _shares;
totalShares -= _shares;

(bool _success,) = payable(msg.sender).call{value: _assets}('');
if (!_success) revert StakeHouse_TransferFailed();
```

Update state before interacting with the outside world. A reentrancy guard works too, but CEI is the discipline. Guards are the safety net.

</details>

### Blackout {#blackout}
By Simon Something

**Goal:** Drain the `SentinelGate` vault to 0 ETH. The player has a balance deposited but is blacklisted.

`SentinelGate` is an ETH vault with per-address balances and a blacklist. The withdrawal logic lives in a `fallback` using inline assembly for "gas efficiency."

<details>
<summary>Solution</summary>

#### The challenge

The blacklist check loads a raw 32-byte word from calldata, hashes it against the `blacklisted` mapping slot, and reverts if the address is blocked. Then a Solidity `address` variable is assigned from the same calldata position, the balance is looked up, zeroed, and the ETH sent:

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

#### The break

The blacklist check and the balance lookup disagree about what an "address" is. `calldataload(4)` returns a full 256-bit word. The blacklist was *set* through a normal Solidity function where the `address` type masks the key to 160 bits. So the blacklist entry lives at `keccak256(clean_address, slot)`. But the inline assembly hashes the *raw* 256-bit word, so if the upper 12 bytes are non-zero, it produces a different storage slot entirely. The lookup returns false, blacklist bypassed.

After the check, the same raw word gets assigned to a Solidity `address`, which silently masks to 160 bits. The balance lookup, the zeroing, and the ETH transfer all use the correct clean address. The dirty word needs to resolve to the player's address since that's where the balance was deposited. One dirty calldata word and you're through:

```solidity
bytes32 _dirtyPlayer = bytes32(uint256(uint160(player)) | (uint256(1) << 160));
address(gate).call(abi.encodePacked(ISentinelGate.withdrawAll.selector, _dirtyPlayer));
```

One transaction, vault drained.

#### How to prevent it

Solidity's `address` type silently masks to 160 bits, but `calldataload` gives you the raw 256-bit word. If you hash the raw word for one operation and the masked value for another, you get a type confusion bug. The fix: mask the calldata to 160 bits *before* the blacklist check, or skip assembly for security-critical lookups entirely.

</details>

### Sentinel Protocol {#sentinel-protocol}
By Simon Something

**Goal:** Drain the `SentinelVault` to 0 ETH. Only registered modules can call `operatorWithdraw()`, and only contracts with an approved codehash can register.

`SentinelVault` whitelists approved code hashes. To withdraw, you need a registered module, and to register, the module must have an approved codehash at registration time.

<details>
<summary>Solution</summary>

#### The challenge

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

#### The break

The vault checks codehash at registration but never again. Once registered, `isRegistered` stays true forever regardless of what code lives at that address later.

This is a metamorphic contract attack. Using CREATE2, you deploy a contract at a deterministic address, register it, destroy it, then redeploy *different* code at the same address. The vault still trusts it.

The wrinkle is EIP-6780 (Cancun hard fork): `selfdestruct` only clears code and storage when it happens in the *same transaction* as creation. So the deploy-register-destroy sequence has to be atomic.

The full sequence:
1. Build a CREATE2 factory with constant initcode that copies whatever `implementation` is currently set (same initcode means same salt always produces the same address)
2. In one transaction: deploy an `EchoModule` clone via the factory, register it with the vault, call `decommission()` to selfdestruct (same-tx creation means the code actually clears)
3. Point the factory's implementation to a malicious contract with a `drain()` function
4. Deploy again with the same salt. Same address, different code, still registered
5. Call `drain()` and `operatorWithdraw()` works because the address is still trusted

#### How to prevent it

Point-in-time codehash validation means nothing if the code at an address can change. Re-validate at the moment of use:

```solidity
bytes32 currentHash;
assembly { currentHash := extcodehash(caller()) }
if (currentHash != record.codeHash) revert SentinelVault_CodeHashChanged();
```

</details>

### Meridian Credits {#meridian-credits}
By Funkornaut

**Goal:** Accumulate 1,150,000 MRC tokens across a network of EIP-7702 delegated reserve stations.

A sprawling system simulating a digital currency concordat. Seven reserve station EOAs are each delegated (via EIP-7702) to different smart contract implementations, each with a mint cap for the MRC token.

<details>
<summary>Solution</summary>

#### The challenge

Three stations need to be exploited:

- **Boreas Station** (500K cap): delegated from `AccountRecoveryV1` to `AccountRecovery` (V2)
- **AXIOM** (300K cap): a `SovereignAI` with a cooperation protocol that can transfer 150K mint cap to Drift
- **Drift Sector** (0 cap, receives 150K from AXIOM): a `BatchExecutor` with Boreas as its `allowanceSource`
- **Helix Citadel** (500K cap): a `SafeSmartWallet` with a `CannonGuard` and pre-approved capsule

#### The break

**Boreas (500K):** EIP-7702 lets an EOA re-delegate to a new implementation at any time. When Boreas was re-delegated from V1 to V2, the storage context shifted. OpenZeppelin's `Initializable` tracks version numbers in a specific storage slot, but from V2's perspective that slot reads as 0. Since V2 uses `reinitializer(2)` and 2 > 0, the initializer passes. Call `initialize(player, [])` to take ownership, then `execute()` to mint 500K MRC.

**AXIOM -> Drift (150K):** AXIOM has a cooperation protocol where anyone who "proves understanding of AXIOM's sovereign nature" can transfer mint cap to another station. The proof is `keccak256(abi.encodePacked(msg.sender, keccak256(manifesto)))`, and the manifesto is on-chain, so the proof is fully derivable. Walk through the 3-step cooperation to move 150K mint cap from AXIOM to Drift. Now Drift has tokens to mint, but Drift is a `BatchExecutor` that only accepts calls from its `allowanceSource`, which was set to Boreas during deployment. Since we took ownership of Boreas in the previous step, we can use it to call Drift's `executeBatch()` and mint 150K MRC to the player. Owning Boreas unlocks both stations.

**Helix Citadel (500K):** During deployment, a `TransactionCapsule` was created pre-approving `mint(address,uint256)` on the MRC token. The `executeApprovedCapsule()` function validates the capsule and executes the operation, but has no access control, so anyone can call it. Find the active capsule via `cannonGuard.getCapsules(helixCitadel)`, call `executeApprovedCapsule(capsule, abi.encode(player, 500_000e18))`, and the wallet mints as Helix.

#### How to prevent it

EIP-7702 storage persists between delegations. When an EOA re-delegates to a new implementation, the old storage is still there, but the new contract interprets it under its own layout. `Initializable` version checks can pass when they shouldn't because the new implementation reads a stale or misaligned slot. If you're building contracts that might be 7702 delegation targets or use 7702 from an EOA, don't assume a clean storage slate.

The capsule system validated *what* could be done but not *who* could trigger it. Pre-approved operations still need access control. Restricting the action isn't enough if anyone can be the caller.

</details>

### Score {#score}
By Funkornaut

**Goal:** Drain the `Score` contract's 10 ETH by calling `solve()` with the correct indices, while surviving a post-transfer gas limit check.

`Score` is a math puzzle with a gas twist. Players call `solve()` with a set of indices. The contract combines the corresponding elements using a rotation parameter from an Oracle, and if the result matches a target hash, it sends the contract's 10 ETH to the player. But there's a catch after the transfer: an assembly block checks if remaining gas exceeds a random threshold (10K-50K), and reverts if it does. So even with the right answer, you need to deal with the gas check.

<details>
<summary>Solution</summary>

#### The challenge

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

#### The break

The accumulator math simplifies dramatically when `rotation = 0`. The mask becomes 0, the bit rotation is a no-op, and the entire loop collapses to `_accumulator = _accumulator XOR _element`. Pure XOR, a linear operation over GF(2). The Oracle's `getRotation()` mixes entropy, scale, contribution count, and `selfbalance()` together. `poke()` mutates the entropy, and sending ETH to the Oracle shifts `selfbalance()`. Both give you control over the rotation output. Make 3 contributions (the minimum), then work either lever until `getRotation()` returns 0.

With rotation at 0, finding indices where the XOR of their elements equals the target is a system of linear equations over the binary field. Both `target` and `elements` depend on `block.number`, so you predict the solve block, precompute all 512 elements, and run Gaussian elimination. Standard linear algebra over GF(2).

The gas check is the last obstacle. The threshold is random, so you can't calibrate the outer gas limit. The trick uses the EVM's 63/64 rule: external calls forward at most 63/64 of available gas. Delegate the player EOA (via EIP-7702) to a contract whose `receive()` burns all forwarded gas in a loop. After the ETH transfer returns, only ~1/64 of the gas remains, well below any threshold in the 10K-50K range.

#### How to prevent it

When a mixing parameter can be forced to a degenerate value, complex nonlinear operations collapse to linear algebra. Test your math at the boundaries, especially zero.

Post-call `gas()` checks assumed EOAs couldn't run code on receive. With EIP-7702 that assumption is gone. An EOA can delegate to a contract that burns all forwarded gas in its `receive()`, leaving only ~1/64 behind. Any logic that depends on how much gas remains after an external call may be unreliable now.

</details>

### Ludopathy {#ludopathy}
By Wonderland

**Goal:** Drain the Ludopathy betting contract below 1 ETH. It holds 15 ETH in its prize pool.

Ludopathy is an on-chain betting game. Players bet on numbers, the owner picks a winner, and winners claim a prize. During deployment, the owner placed three large bets totaling 15 ETH across several numbers and then selected 999 as the winner. Nobody bet on 999, so the 15 ETH sits unclaimed and the round is closed.

<details>
<summary>Solution</summary>

#### The challenge

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

#### The break

Three bugs stacked on top of each other.

**`largeBet` doesn't check `roundClosed`.** Compare it to `smallBet`, which has `if (roundClosed) revert TakePill();`. The large bet path skips this check entirely. After the owner picks 999 and closes the round, anyone can still place a large bet on 999, retroactively betting on a winner that's already been announced.

**Zero-cost bets are valid.** `largeBet` computes cost as `totalNumbersBought * DISCOUNTED_COST_FOR_LARGE_BETS`. Pass `amountsOfNumbersToBuy = [0]` and `totalNumbersBought = 0`, so `0 * 1 ether = 0`. The check `msg.value < 0` passes with zero ETH. Free bet on the winning number.

**`claimPrize` never sets `claimed = true`.** The function checks `_winningBet.claimed` but never flips it. And the prize is paid via `.call{value: ...}`, so a contract's `receive()` runs before `claimPrize` returns, and you can re-enter and claim again. The prize per claim is `(1 + 0) * 1.5 = 1.5 ETH`. The contract holds 15 ETH. Ten re-entries drains it.

#### How to prevent it

Each bug is a common class of mistake, and they compound:

1. **Inconsistent guards across similar functions.** `smallBet` checks `roundClosed`, `largeBet` doesn't. Every entry point for similar actions needs the same guards. Good target for mutation testing. If you can delete a check and tests still pass, you have a gap.

2. **Zero-value inputs in cost calculations.** `0 * anything = 0`. Anywhere a user-supplied quantity feeds into a cost formula, consider what zero does.

3. **State flag checked but never written.** The `claimed` flag is read but never set. If a flag guards a payout, set it *before* sending ETH, not after. Not setting it at all is worse.

</details>

### UECallNft {#uecallnft}
By Wonderland

**Goal:** Get the player to hold 5 or more NFTs. The contract has 5 NFTs in circulation (ids 1-5), all owned by random addresses. There's 0.05 ETH in the contract.

`UECallNft` is an ERC721 with a buyback feature. Holders can sell an NFT back to the contract for 25% of the mint price. There's also an owner-only mint function, and the "owner" is the contract itself.

<details>
<summary>Solution</summary>

#### The challenge

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

#### The break

**`sellNft` is a universal call gadget.** Both `_recipient` and `_data` are caller-controlled. Set `_recipient = address(nftContract)` and `_data = abi.encodeWithSignature("mintOwner(address)", attacker)`, and the contract sends 0.0025 ETH to *itself* carrying `mintOwner` calldata. Since `msg.sender` for that inner call is `address(this)`, the `onlyOwner` check passes. A buyback function just became an unrestricted self-call mechanism. Also, `sellNft` doesn't verify `msg.sender` owns the NFT being burned. Solmate's `_burn` just requires the token to exist.

**The `hasSoldCheck` modifier writes state *after* the function body.** It runs the function (`_;`) then sets `hasSold[msg.sender] = true`. But the external call happens during the body. When `mintOwner` mints to a contract, `_safeMint` calls `onERC721Received`, and inside that callback the attacker calls `sellNft` again before `hasSold` is set.

The full chain per iteration: call `sellNft(id, nftContract, mintOwnerCalldata)` -> contract calls itself with `mintOwner(attacker)` -> `_safeMint` triggers `onERC721Received` -> callback calls `sellNft` again with the next id. The ETH never runs out because the contract sends to itself. The `uecsInCirculation` cap of 10 holds because each iteration mints one and burns one. At peak nesting depth (5 mints before any burns unwind), circulation hits exactly 10. Five old NFTs burned, five new ones minted, all in one transaction.

#### How to prevent it

Letting the caller control both the target and calldata of a `.call` is about as dangerous as it gets in Solidity. Combined with `onlyOwner` checking `msg.sender == address(this)`, this is a confused deputy. The contract trusts that calling itself must be intentional, but an attacker can force that self-call through any function with an external call. The `hasSoldCheck` modifier pattern of `_; state = true;` is a reentrancy vector. Set the flag *before* the body, not after. And verify ownership before burning.

</details>

---

## Until Next Time!

None of this happens without the people who believed in it early. Trail of Bits, Aztec, Runtime Verification, Envio, Pashov Audit Group, and Grego AI put their names and their money behind an event that had never been done at this scale. Runtime Verification went further and built a challenge on top of their sponsorship. Aztec's sponsorship brought an entirely new attack surface to the competition, with five Noir challenges built by Wonderland's Aztec team. Thank you to every challenge author who built problems and wrote up their solutions. Thank you to the Wonderland team: Every single person, regardless of role, who put months of work into making this happen. And finally, thank you to every team that registered, showed up, sat in the noise, and hacked.

We said it at the opening and it held true all four hours: the goal was to learn, to connect, and to have fun. The prize pool was there and the competition was real, but the best moments were the ones that had nothing to do with the scoreboard. A team figuring out something they'd never seen before. Someone walking out of the Arena with a grin. The room at 4:05 when the countdown hit zero and everyone started hacking at once.

AI is changing this space fast. It can solve a growing number of these challenges out of the box, and that bar will keep going up. The kinds of CTFs we can run today, the kinds of bugs that still require a human to find, that window is narrowing. Which makes events like this more important, not less. The people in that room are the ones pushing the edge of what gets caught before it hits production.

Keep doing what you do. Web3 is safer because of it.

See you down the rabbit hole.