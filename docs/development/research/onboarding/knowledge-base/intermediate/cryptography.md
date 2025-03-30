# Cryptography

If you don't have a background in math, we strongly recommend reading https://explained-from-first-principles.com/number-theory/#exhaustive-search before diving into Cryptography. 

> *"At the outbreak of the Second World War, possibly no shortage was more acute — or less publicized — than that of qualified cryptographers." — Laurence D. Smith, Cryptography: The Science of Secret Writing.*
> 

Cryptography has long been crucial to military operations. In World War I, a young American cryptographer "threw the General Staff into a state of alarm" at Saint-Mihiel in 1918 by easily deciphering a supposedly "unbreakable" cipher—one that the German forces were almost certain to break as well. This incident underscores why "the secrecy of communications is vital" and how a single compromise might lead to catastrophe on the battlefield.

By World War II, the role of codebreakers and cryptographers had expanded dramatically. From Allied efforts against German U-boats to the deciphering of Japanese communications, cryptographic expertise often tipped the balance. The cipher experts had to cope with Japanese and with countless other languages. A slip—like accidentally transmitting a message both in cipher and in plain text—could reveal an entire encryption system to enemy forces in an instant.

Today, cryptography extends far beyond the battlefield, but the lessons remain: robust encryption and careful key management are paramount. Whether securing financial transactions or protecting data, cryptography ensures critical information never falls into the wrong hands.

Against this historical backdrop, the sections that follow will explain how cryptography matured from basic substitution ciphers into sophisticated schemes based on fundamental mathematical problems. We will begin with the three major types of cryptography, then move to the classic puzzle of **key distribution**, showing how **Diffie–Hellman** revolutionized secure communications. Next, we will highlight **RSA** and its reliance on the hardness of factorization. We then move on to **elliptic curves**, covering not only elliptic-curve Diffie–Hellman and elliptic-curve digital signatures, but also advanced **pairing-based** protocols that underpin many cutting-edge cryptographic systems in use today.

## Symmetric vs. Asymmetric Crypto vs. Hash Functions

In **symmetric** cryptography, both sender and receiver share the *same key* for encryption and decryption. Algorithms such as AES (Advanced Encryption Standard) or ChaCha20 operate on this principle, providing speed and efficiency once the key is in place. The **main drawback** is how to distribute that key securely. If Alice and Bob are on opposite sides of the world, they must still find a way to share a secret key that an eavesdropper cannot steal—no trivial task.

In **asymmetric** (public-key) cryptography, each user has:

- A freely shareable public key
- A closely guarded private key

Data encrypted with the public key can only be decrypted by the holder of the private key. This separation of public and private components solves many of the logistical hurdles of symmetric cryptography: there is no need to pre-share a common secret. RSA and elliptic-curve systems are prime examples. However, these schemes rely on deeper mathematical assumptions (e.g., factoring large numbers or solving discrete logs on elliptic curves), and they tend to be more computationally expensive for encryption/decryption than symmetric algorithms.

## The problem of key distribution

Historically, symmetric systems required **physical key delivery** or secure channels that rarely existed. Even robust ciphers collapse if keys are compromised. As networks globalized, purely symmetric models became impractical.

The 1970s public-key breakthrough resolved this elegantly: anyone can encrypt messages with Bob's public key (freely available online), knowing only Bob's private key can decrypt them. Hybrid systems now dominate—for example, TLS uses asymmetric exchanges (RSA/Diffie-Hellman) to establish symmetric session keys (AES) for bulk encryption.

## Diffie-Hellman

The **Diffie–Hellman** (DH) protocol addresses the key-distribution problem by letting two parties, Alice and Bob, generate a shared secret over an insecure channel without initially sharing any secret. In a **finite-field** variant, we choose:

1. A large prime $p$ and a generator $g$ (an element of $\mathbb{Z}_p^*$ with high order)

:::tip
$\mathbb{Z}_p^*$ denotes the set of all integers $\{0, 1, 2, \dots, p-1\}$ with addition and multiplication performed **modulo $p$.** Because $p$ is prime, every nonzero element in this set has a multiplicative inverse.
:::

1. Alice picks a random integer $a$ and computes her public value $A = g^a \bmod p$.
2. Bob picks a random integer $b$ and computes his public value $B = g^b \bmod p$

To find the shared secret, Alice computes $B^a \bmod p=(g^b)^a = g^{ab} \bmod p$. Bob computes $A^b \bmod p = (g^a)^b = g^{ab} \bmod p$. They both arrive at the same number $g^{ab} \bmod p$, which functions as their private key. The discrete logarithm problem (recovering $a$ from $g^a$) is assumed to be hard, so an eavesdropper cannot easily compute $g^{ab}$ from the observed values. 

:::tip
Read more about Diffie-Hellman in https://www.geeksforgeeks.org/implementation-diffie-hellman-algorithm/
:::

## RSA: Factorization as a Foundation

**RSA** (Rivest–Shamir–Adleman, 1977) sort of revolutionized cryptography by providing the first practical implementation of public-key encryption. Its security relies on the computational difficulty of **factoring large integers** into primes.

### How It Works

1. **Key Generation**:
    - Choose two distinct large primes $p$ and $q$.
    - Compute modulus $n=p \times q$ and Euler's totient $\phi(n)=(p-1)(q-1)$
    - Select public exponent $e$ (commonly 65537) such that $\gcd(e,\phi(n))=1$.
    - Compute private exponent $d$ where $d \equiv e^{-1} \pmod{\phi(n)}$.
2. **Encryption/Decryption**:
    - Encrypt message $m$ (as integer): $c=m^e \bmod n$.
    - Decrypt ciphertext $c$: $m=c^d \bmod n$.

:::tip
**Why Factoring Matters**: If an attacker can factor $n$ into $p$ and $q$, they can compute $d$ and decrypt messages. Factoring large numbers (e.g., 2048-bit $n$) remains infeasible even for supercomputers using classical algorithms. 
:::
### Example with Small Primes

Let $p=3$, $q=11$:

- $n=33$, $\phi(n)=20$
- Choose $e=3$ (since $\gcd(3,20)=1$).
- Compute $d=7$ (because $3 \times 7 \equiv 1 \pmod{20}$).
- Encrypt $m=7$: $7^3 \bmod 33 = 13$
- Decrypt $13$: $13^7 \bmod 33 = 7$

While RSA is versatile (used in TLS, digital signatures), it's slower than symmetric encryption. Modern systems often combine RSA for key exchange with AES for bulk data.

## Elliptic Curve Cryptography (ECC)

**Elliptic curves** provide a more efficient alternative to RSA and finite-field Diffie–Hellman. A cryptographic elliptic curve is defined by $y^2 = x^3 + ax + b$ over a finite field, where points on the curve form a cyclic group. Some key things are:

- **Smaller Key Sizes**: A 256-bit ECC key offers security comparable to a 3072-bit RSA key.
- **Faster Computations**: Scalar multiplication (core ECC operation) is more efficient than modular exponentiation.

### Elliptic Curve Diffie–Hellman (ECDH)

Analogous to classic DH, but uses elliptic curve points:

1. Alice and Bob agree on a public curve (e.g., `secp256k1`) and base point $G$.
2. Alice picks private key $a$, computes public key $aG$ (point multiplication).
3. Bob picks private key $b$, computes public key $bG$.
4. Shared secret: $a(bG) = b(aG) = abG$.

The **Elliptic Curve Discrete Logarithm Problem (ECDLP)** ensures security: given $aG$ and $G$, finding $a$ is computationally infeasible.

### Elliptic Curve Digital Signatures (ECDSA)

Used in Ethereum for signing transactions:

1. **Signing**:
    - Private key $d$, message hash $h$.
    - Generate random $k$, compute $(x, y) = kG$.
    - Signature $(r, s) = (x \bmod n, k^{-1}(h + dr) \bmod n)$
2. **Verification**:
    - Compute $u_1 = hs^{-1} \bmod n$, $u_2 = rs^{-1} \bmod n$.
    - Check if $u_1G + u_2Q = (x, y)$, where $Q = dG$ is the public key.

# Hands On!

We strongly recommend you to do the Unit 1.1 and 1.2 from the [**Ethereum Bootcamp**](https://university.alchemy.com/course/ethereum/md/630e3d0a456dc80004ad6b6d) by Alchemy University. Specially, the cryptographic hashes assigment. Then, you can move to the challenge of this section:

# Resources

https://www.pearson.com/en-us/subject-catalog/p/cryptography-and-network-security-principles-and-practice/P200000003477/9780135764213

https://www.web3citizen.xyz/research/zk/articles/zk-101

https://www.cs.umd.edu/~waa/414-F11/IntroToCrypto.pdf

Neal Koblitz - [A Course in Number Theory and Cryptography](https://almuhammadi.com/sultan/crypto_books/Koblitz.2ndEd.pdf) (1994, Springer)

https://explained-from-first-principles.com/number-theory/

Phillip Rogaway, [The Moral Character of Cryptographic Work](https://eprint.iacr.org/2015/1162.pdf)

https://polkadot-blockchain-academy.github.io/pba-book/cryptography/index.html

If curious about the history of cryptography, see  https://www.geeksforgeeks.org/history-of-cryptography/

https://archive.org/details/cryptography-the-science-of-secret-writing-laurence-d.-smith/page/14/mode/1up 

### Eliptic Curve

https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/

https://www.youtube.com/watch?v=dCvB-mhkT0w

Chapter 4 from Mastering Ethereum

**Pairings**

https://blog.statebox.org/elliptic-curve-pairings-213131769fac

https://medium.com/@VitalikButerin/exploring-elliptic-curve-pairings-c73c1864e627

https://www.math.ru.nl/~bosma/Students/MScThesis_DennisMeffert.pdf

https://people.cs.nctu.edu.tw/~rjchen/ECC2012S/Elliptic%20Curves%20Number%20Theory%20And%20Cryptography%202n.pdf