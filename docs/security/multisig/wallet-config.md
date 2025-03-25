# Hardware Wallet Configuration

:::tip
- **DOs:**
    - Split your 24-word seed phrase into multiple parts (e.g., 2-of-3 or 3-of-5 schemes) to improve security and prevent single points of failure.
    - Use durable metal plates to back up shards, as they withstand disasters like fire or water damage.
    - Store shards in separate, secure, and fireproof locations to mitigate risks from theft or natural disasters.
- **DO NOTs:**
    - Write or store the entire seed phrase in a single location or medium.
    - Store all shards together.
    - Overcomplicate the process—stick to manageable schemes (e.g., 2-of-3) to reduce the risk of human error.
:::

**Seed Phrase Security** strengthens wallet recovery and asset protection by splitting your seed phrase into shards and engraving backups on durable metal plates. By combining sharding schemes like **2-of-3**, secure storage you greatly reduce risks from theft, disasters, and unauthorized access.

# Wallet Factory Reset

As a measure to mitigate potential exploits involving temporary firmware modifications or un-authorized state access on hardware wallets, we recommend performing multiple factory resets. This helps reduce the risk of such exploits.

:::tip
**Recommended Action:** Perform a factory reset on the device three times.
:::

# Sharding

Wallet sharding is the process of splitting your **24-word seed phrase** into multiple parts (**shards**) and distributing them across different secure locations. This way, no single shard can reconstruct the wallet by itself, providing an extra layer of security against loss or theft.

### Why?

- **Reduces the risk of single point failure**: If someone gains access to one shard, they cannot access your funds.
- **Protects against disasters**: By distributing shards in different locations, you increase your chances of recovery even if one location is compromised (e.g. fire or flood).
- **Adds redundancy**: Using a multi-shard scheme like **2 of 3** or **3 of 5**, you can lose some shards and still recover your wallet.

## Setup

### Simple Manual Split

In this method, the seed phrase is divided into **3 parts**, and any **2 parts** are sufficient to reconstruct the entire seed phrase.

:::warning

**You should never write down your whole seed phrase anywhere.**

:::

As an example, you could split your **24-word seed phrase** into:

- **Shard 1:** Words 1-8, Words 9-16
- **Shard 2:** Words 9-16, Words 17-24
- **Shard 3:** Words 1-8, Words 17-24

With this method:

- Any **2 shards** can be combined to reconstruct the full 24-word phrase.

:::warning

When splitting, you should always use a 24 word seed phrase, since splits are prone to brute-force the missing words. **As an example:**

- A 12 word seed phrase shard can be brute forced in: ~109 seconds
- A 24 word seed phrase shard will take: 3830854 years
:::

## Engrave the Shards on Metal Plates!

A highly durable backup option, unlike paper, metal plates will remain legible even in the event of a fire, flood, or physical impact, significantly improving the longevity and reliability of your shards:

- Clearly engrave each shard’s words on a separate plate.
- **Label** each plate (e.g. “Shard 1 of 3”).
- **Use a stamping kit** for durability and readiness.
- Double-check, mistakes could render the shard unusable.

## Storage

Distribute the shards in **separate and secure locations**

- Avoid storing all shards in one location, as this defeats the purpose of sharding.
- Choose secure and fireproof storage options. (Metal plates will solve this)