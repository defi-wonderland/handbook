# Cryptography

This assignment combines **classical cipher-breaking** with the **analysis of cryptographic failures in DeFi privacy systems**. The focus is on reasoning, written explanation, and clear demonstration of concepts.

## **Part 1 – Breaking the Vigenère Cipher**

A DeFi team once used a **Vigenère cipher** to hide configuration data in GitHub. You intercepted this ciphertext:

```
LXFOPVEFRNHR XWXKSHVGKDX YHKWQMVHJ EHGJZXPXW BXKNDH 
LBJWGK XJJGJJBVJ XWKSHGKZM ZHKWQQ QKTSXHW BGJEFH 
BPHMCVGK XJHGKL XWHJVJDJ EGZKLFHH GTJTHG JXGJTEJ
```

**Hints:**
* Key length = 5
* Plaintext contains **DeFi terminology**
* English text

**Tasks:**
1. Use the **Index of Coincidence** to justify the 5-letter key length.
2. Apply **frequency analysis** to each key position.
3. Recover the 5-letter key.
4. Decrypt the plaintext and explain its meaning.
5. Reflect: Why do substitution ciphers fail against statistical attacks?

**Deliverables:**
* A short report explaining your method and reasoning.
* The recovered key and decrypted message.
* (Optional) a script or table showing frequency analysis.

## **Part 2 - Tornado Cash Vulnerability Analysis**
Tornado Cash, a blockchain mixer, had several cryptographic design flaws. Your job is to analyze them and propose fixes.

**Vulnerability 1 - Weak Randomness**
* Explain how predictable `Date.now()` nullifiers and small secret space (\~20 bits) let attackers brute-force commitments and link deposits/withdrawals.
* Compare with secure randomness (256 bits).

**Vulnerability 2 - Nullifier Collisions**
* Show how two users could end up with the same nullifier, leading to **double-spending**.
* Propose a fix: e.g., domain separation in hash derivation.

**Vulnerability 3 - Merkle Proof Manipulation**
* Explain how invalid proofs could bypass membership checks.
* Suggest mitigations (stricter proof verification, circuit audits).

**Privacy Pools Improvements**
* Summarize how **association sets**, **improved nullifier derivation**, and **compliance-friendly proofs** solve many Tornado Cash issues.
* Discuss trade-offs between privacy and compliance.

**Deliverables:**
* A written vulnerability report (bullet-point or essay style).
* Explanations of attacks in clear language (pseudocode optional).
* Recommended fixes for each vulnerability.
* A short comparison: **Tornado Cash vs. Privacy Pools**.

## **Submission Instructions**

* Submit two documents:
  * `part1-vigenere.md`: explanation, key, decrypted text, reflection.
  * `part2-tornadocash.md`: vulnerability analysis and fixes.
* No heavy coding required: focus on reasoning, clarity, and correctness.
* Include diagrams/tables if they help illustrate your points.