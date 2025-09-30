# On words and keys, a guide to Mnemonic Phrases

When you set up a new Ethereum wallet, you are almost always presented with a list of 12 or 24 words. The software instructs you to write them down and keep them secret, as they are the master key to your digital assets. It feels strange, entrusting value to a short sequence of words like `army`, `van`, `defense`, `carry`.

In a world of advanced cryptography, why do we rely on something as low tech as a list of words? How can they possibly be secure? The security of your Ethereum account depends entirely on the security of its private key. Mnemonic phrases are the human friendly backup method for the  randomness that generates these keys. Understanding how they work is key to understanding self sovereignty.

This explainer will demystify this foundational process. We'll start with how wallet standards create an interoperable ecosystem and then dive deep into **BIP-39**, the specific standard that turns random data into the words you see.

As wallet technology matured, a set of common industry standards emerged to make them interoperable, secure, and flexible. Though they originated as "Bitcoin Improvement Proposals" (BIPs), their utility has made them the foundation for most wallets, including for Ethereum. Key among them are:

- **BIP-39** Defines how to turn random data into a mnemonic word list and then into a master seed.
- **BIP-32** Defines hierarchical deterministic (HD) wallets, allowing a single seed to generate a tree of keys.
- **BIP-44** Defines a specific path structure for this tree, enabling a single seed to support multiple accounts and multiple cryptocurrencies in a standard way.

These standards interlock to create a powerful, open system. A user can export a mnemonic phrase generated on one wallet and import it into a completely different one, recovering all their keys and addresses. We will focus on the first and most user facing part of this stack, BIP-39.

## The source of unpredictability

At its core, a private key is just a very large, unpredictable number. If an adversary can guess that number, they can take your assets. Therefore, the entire security of your account hinges on the number being **truly unpredictable**.

The essential problem is that computers are deterministic machines and are exceptionally bad at creating genuine randomness. So where do we get the initial spark of unpredictability, the **entropy**, needed to create a secure key?

A wallet application must look outside its own code and draw from a chaotic source. *Hardware wallets* use a dedicated chip to generate randomness from unpredictable physical phenomena like thermal noise or microscopic variations in silicon. This is considered the gold standard for entropy. Meanwhile *software wallets* do not have dedicated hardware for this task. They rely on the operating system to provide randomness  from unpredictable sources like mouse movements, keyboard input timing or network packet arrivals.

:::warning
If this step is flawed, if the entropy source is predictable, then everything that follows is insecure.
:::


![BIP-39.png](\img\diagrams\BIP-39.png)

## The BIP-39 standard

Once we have a secure source of random data, we face a new problem. How can a human possibly back up a 128 bit string of ones and zeros without error?

The key insight here is that we can **encode** this binary data into a more human friendly format. This is precisely what BIP-39 does, providing a standardized bridge from machine readable randomness to human readable words.

Let's walk through the process, as visualized in the diagram.

The journey begins with a string of pure entropy, for a 12 word phrase, this is 128 bits, like this example from the *Mastering Ethereum* book. To protect against transcription errors, a small checksum is created by hashing this entropy with SHA-256 and taking the first few bits. This checksum is then appended to the original entropy, resulting in a slightly longer string of 132 bits. This combined string is then split into 12 equal segments of 11 bits each. Each of these 11 bit segments represents a number that serves as an index to look up a word from a specially [curated list of 2048 words](https://github.com/hatgit/BIP39-wordlist-printable-en/blob/master/BIP39-en-printable.txt). The sequence of words found this way forms the final mnemonic phrase, a human readable and error checked representation of the initial randomness.

But this list of words is not your final key. It’s worth noting that the mnemonic phrase is actually the input to create the master **seed** from which all your keys will be derived. This second stage of the transformation, as the diagram shows, takes the mnemonic phrase and combines it with a `salt`. The salt is composed of the string constant "mnemonic" concatenated with an **optional** user supplied passphrase. These are fed into a *key stretching function* called PBKDF2. Its purpose is to make the process computationally expensive by running the inputs through 2048 rounds of HMAC-SHA512 hashing. This deliberate difficulty makes brute force guessing of mnemonics computationally prohibitive. The final output of this intensive process is a single, powerful 512 bit seed from which all other keys are derived as we gonna see in the following explainers.

### Is secure a 12 word mnemonic ?

The intuition that just "choosing 12 words" seems insecure is understandable, but it underestimates the scale of the numbers involved, let’s solve this. 

The BIP-39 wordlist has 2,048 words. So, for a 12 word phrase, the total number of possible ordered combinations is  $2048^{12}$  . To make sense of that number, we can think in powers of two. Since 

 $2048 = 2^{11}$, the equation becomes  $(2^{11})^{12} = 2^{132}$ so guessing your specific 12 word phrase is not just impractical, it is computationally and physically impossible with current and foreseeable technology.

### The passphrase

BIP-39 includes an **optional** passphrase feature that is both powerful and dangerous. It allows you to add a custom word or sentence to your mnemonic, which acts as a second factor and generates a completely different seed. This protects your funds if someone physically steals your written down mnemonic words.

However, this feature comes with a trade off. **If you forget your passphrase, your funds are gone** w**ith** no recovery mechanism. 

## Conclusion

The BIP-39 standard is more than a clever technical specification. By solving the critical user experience problem of backing up incomprehensible binary data, it created a common language for wallet recovery. This standard allows a user to generate a seed on one wallet and restore it on any other compatible wallet years later, breaking down walled gardens and preventing vendor lock in.

This journey from abstract randomness to a simple list of words is an example of how we build systems that are not only secure but also empowering and accessible. It gives us a single, powerful seed, the root of digital sovereignty. However, the story doesn't end there, that seed is the starting point for a vast, branching tree of potential accounts. The process of navigating from this single root to a specific key for a specific purpose is governed by its own crucial standard. This standardized map, known as a **derivation path**, provides the final link between our mnemonic phrase and our onchain activity, a topic we will explore in detail next.