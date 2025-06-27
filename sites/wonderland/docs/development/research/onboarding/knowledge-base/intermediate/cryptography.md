# Cryptography

If you don't have a background in math, we strongly recommend starting with [this gentle introduction to number theory](https://explained-from-first-principles.com/number-theory/#exhaustive-search) before diving into cryptography.

> *"At the outbreak of the Second World War, possibly no shortage was more acute — or less publicized — than that of qualified cryptographers." — Laurence D. Smith, Cryptography: The Science of Secret Writing.*

Cryptography has long played a decisive role in world affairs. In World War I, a young American cryptographer "threw the General Staff into a state of alarm" at Saint-Mihiel in 1918 by cracking a supposedly "unbreakable" cipher. The implications were clear: secrecy in communication was not optional, but vital. A single compromise could tip the balance of a battle.

By World War II, the role of codebreakers had expanded dramatically. Cryptographic breakthroughs — such as the deciphering of German Enigma or Japanese naval codes — had direct strategic consequences. A careless transmission, especially one sent both in cipher and plain text, could reveal entire encryption systems and undermine months of planning.

Today, the battlefield has shifted to digital networks and cryptography secures everything from bank transfers to blockchain protocols. But the lessons endure: robust encryption and careful key management remain foundational to privacy and security.

Against this historical backdrop, the sections that follow trace the evolution of cryptography. We begin with the three major types of cryptographic primitives, then talk about the pivotal problem of **key distribution**, the **Diffie-Hellman** solution, and the advent of **RSA**. We continue with **elliptic curves**, including **ECDH**, **ECDSA**, and **pairing-based protocols**.

## Cryptographic Primitives: Symmetric, Asymmetric, and Hash Functions

### Symmetric Encryption
In **symmetric** cryptography, both parties share a *single secret key* used for both encryption and decryption. Algorithms like AES (Advanced Encryption Standard) and ChaCha20 are widely used for their speed and efficiency.

**Drawback:** Key distribution. If Alice and Bob are on different continents, how do they agree on a secret key without interception?

### Asymmetric (Public-Key) Encryption
**Asymmetric cryptography** solves this problem with a key pair:

- A **public key** (shared freely)
- A **private key** (kept secret)

Anyone can encrypt a message using the public key, but only the private key can decrypt it. RSA and elliptic curve cryptography (ECC) are two major systems here. Asymmetric cryptography is computationally more expensive but enables secure communication without pre-shared secrets.

### Cryptographic Hash Functions
Hash functions are one-way operations that map input data to a fixed-size output. Key properties include:

- **Determinism**: Same input, same output
- **Preimage resistance**: Hard to reverse
- **Collision resistance**: Hard to find two inputs with the same hash

Hashes underpin digital signatures, Merkle trees, password security, and zero-knowledge proofs. Common algorithms: SHA-256, Keccak (used in Ethereum).

## The Problem of Key Distribution

Symmetric systems once required **physical key exchange**. This worked for spies, but not for global internet systems. Even the strongest ciphers are useless if the keys are compromised.

In the 1970s, public-key cryptography changed everything. Anyone can encrypt with Bob's public key, but only Bob can decrypt it with his private key. Today, hybrid systems like TLS combine asymmetric key exchange (RSA or Diffie-Hellman) with symmetric session keys (AES) for performance.

## Diffie-Hellman: A Breakthrough in Secure Key Exchange

The **Diffie-Hellman (DH)** protocol allows two parties to generate a shared secret over an insecure channel. Here’s how it works (finite field version):

1. Choose a large prime $p$ and generator $g$.
2. Alice picks random $a$, computes $A = g^a \bmod p$.
3. Bob picks random $b$, computes $B = g^b \bmod p$.
4. Shared secret: Alice computes $B^a = g^{ab} \bmod p$, Bob computes $A^b = g^{ab} \bmod p$.

The **discrete logarithm problem** protects the exchange: it is hard to derive $a$ or $b$ from $g^a$ or $g^b$.

## RSA: Public-Key Encryption Built on Factorization

**RSA** (1977) was the first practical public-key system. Its security depends on the hardness of factoring large integers.

### Key Generation

1. Choose large primes $p$ and $q$
2. Compute $n = pq$, $\phi(n) = (p-1)(q-1)$
3. Choose public exponent $e$ (e.g., 65537)
4. Compute private key $d$ where $d \equiv e^{-1} \pmod{\phi(n)}$

### Encryption/Decryption
- Encrypt: $c = m^e \bmod n$
- Decrypt: $m = c^d \bmod n$

If an attacker factors $n$, they can find $d$ and break the system. But factoring 2048-bit numbers remains infeasible for classical computers.

## Elliptic Curve Cryptography (ECC)

Elliptic curves offer smaller keys and faster operations compared to RSA. An elliptic curve is defined by $y^2 = x^3 + ax + b$ over a finite field. Points on the curve form a group with an addition operation.

### Advantages
- **256-bit ECC** key = **3072-bit RSA** key
- Faster signature generation and verification

### Elliptic Curve Diffie-Hellman (ECDH)

1. Choose curve (e.g. `secp256k1`) and base point $G$
2. Alice: private $a$, public $aG$
3. Bob: private $b$, public $bG$
4. Shared secret: $abG$

Security relies on the **Elliptic Curve Discrete Log Problem (ECDLP)**.

### Elliptic Curve Digital Signature Algorithm (ECDSA)

Used by Ethereum and Bitcoin:

- **Sign**:
  - Choose random $k$, compute $r = (kG)_x$
  - $s = k^{-1}(h + dr) \bmod n$
  - Signature: $(r, s)$
- **Verify**:
  - Compute $u_1 = hs^{-1}$, $u_2 = rs^{-1}$
  - Check: $u_1G + u_2Q = R$

## Pairing-Based Cryptography

Pairings map two elliptic curve points into a finite field, enabling new primitives:

- **Identity-based encryption**
- **BLS signatures** (used in Ethereum staking)
- **Zero-knowledge proofs** like zk-SNARKs

Pairings are bilinear and non-degenerate, enabling succinct multiparty verifications and aggregations.

For a deeper intro, check [Vitalik's guide](https://medium.com/@VitalikButerin/exploring-elliptic-curve-pairings-c73c1864e627).

## Hands-On

We strongly recommend Units 1.1 and 1.2 of the [**Ethereum Bootcamp**](https://university.alchemy.com/course/ethereum/md/630e3d0a456dc80004ad6b6d) by Alchemy. Focus especially on the **hash function assignments**.

Then, try the hands-on challenge at the end of this module.

## Further Reading

- [Cryptography and Network Security: Principles and Practice](https://www.pearson.com/en-us/subject-catalog/p/cryptography-and-network-security-principles-and-practice/P200000003477/9780135764213)
- [Introduction to Modern Cryptography (UMD)](https://www.cs.umd.edu/~waa/414-F11/IntroToCrypto.pdf)
- Neal Koblitz, [A Course in Number Theory and Cryptography](https://almuhammadi.com/sultan/crypto_books/Koblitz.2ndEd.pdf)
- [Explained From First Principles: Number Theory](https://explained-from-first-principles.com/number-theory/)
- Phillip Rogaway, [The Moral Character of Cryptographic Work](https://eprint.iacr.org/2015/1162.pdf)
- [Polkadot Blockchain Academy - Cryptography](https://polkadot-blockchain-academy.github.io/pba-book/cryptography/index.html)
- [History of Cryptography](https://www.geeksforgeeks.org/history-of-cryptography/)
- [Laurence D. Smith book (archive)](https://archive.org/details/cryptography-the-science-of-secret-writing-laurence-d.-smith/page/14/mode/1up)

**Elliptic Curves:**
- [Cloudflare ECC primer](https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/)
- [ECC YouTube explainer](https://www.youtube.com/watch?v=dCvB-mhkT0w)
- Chapter 4 of *Mastering Ethereum*

**Pairings:**
- [Statebox intro](https://blog.statebox.org/elliptic-curve-pairings-213131769fac)
- [Vitalik on pairings](https://medium.com/@VitalikButerin/exploring-elliptic-curve-pairings-c73c1864e627)
- [Dennis Meffert MSc thesis](https://www.math.ru.nl/~bosma/Students/MScThesis_DennisMeffert.pdf)
- [ECC & Pairings textbook (NCTU)](https://people.cs.nctu.edu.tw/~rjchen/ECC2012S/Elliptic%20Curves%20Number%20Theory%20And%20Cryptography%202n.pdf)
