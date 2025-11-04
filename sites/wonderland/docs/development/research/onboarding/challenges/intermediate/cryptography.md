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

## **Part 2 - Tornado Cash Privacy Analysis and Improvements**
Tornado Cash did not rely on weak randomness, and nullifier collisions are not a practical attack under standard assumptions. Instead, most privacy failures in practice come from deanonymization heuristics and user/operational patterns. Your job is to analyze the actual privacy model, common leakage vectors, and how newer designs (e.g., Privacy Pools) adjust the trade-offs.

**Background facts (read carefully before you analyze)**
- Notes are constructed with high-entropy secrets generated via secure RNG (two ~31-byte values such as `nullifier` and `secret`).
- Commitments are computed in-circuit from these secrets; a `nullifierHash` prevents double-spends and is tracked on-chain.
- Hashes used are SNARK-friendly (e.g., MiMC or Poseidon variants). Collisions are computationally infeasible; double-spend attempts are blocked by the spent-nullifier set.
- Merkle membership is enforced inside the zkSNARK. Bypassing it would require a proof-system/verification break, not just an invalid off-chain proof.

**Tasks:**
1. Explain the Tornado Cash note model: what are `nullifier`, `secret`, `commitment`, and `nullifierHash`? Why does high-entropy RNG matter here?
2. Analyze practical deanonymization heuristics:
- Fixed denominations and timing correlation between deposit and withdrawal
- Relayer/gas/fee patterns and UX artifacts that leak linkage
= Small or tainted anonymity sets and their impact
3. Propose mitigations and best practices to reduce linkage risk within Tornado-style mixers (operational guidance, relayer hygiene, delaying strategies, denomination choice, etc.).
4. Compare with **Privacy Pools**: explain association sets and selective disclosures, and how they shift the privacy-compliance trade-off. Where do they help, and what new trade-offs do they introduce?

**Deliverables:**
- A written privacy analysis focused on real-world deanonymization heuristics and mitigations.
- A correct explanation of the note construction and nullifier design (debunking weak-randomness and collision misconceptions).
- A short comparison: **Tornado Cash vs. Privacy Pools**.

### **How to Submit Your Work**
- All work for your chosen challenge must be committed to the **GitHub repository** assigned to you during onboarding.
- Structure your commits clearly, with meaningful messages that outline the progress of your work. See [Git Practices](/docs/processes/github/git-practices.md) for reference.
- Ensure your final submission is well-organized, with supporting files, diagrams, or models included as needed.

## 🍀 Good luck!