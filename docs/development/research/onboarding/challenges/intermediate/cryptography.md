# Cryptography

## **Analyzing a Vulnerable Diffie-Hellman Implementation**

### **Scenario**

Alice and Bob are attempting to establish a shared secret using the Diffie-Hellman algorithm. However, they unknowingly introduce a critical vulnerability by using a weak prime number for their calculations. Trudy, an attacker, intercepts their communication and exploits this flaw to compute the shared secret. Your task is to analyze the vulnerability, demonstrate how Trudy exploits it, and explain why the protocol fails in this case.

### **Modified Diffie-Hellman Implementation**

In this scenario:

- Alice and Bob agree on the following **public parameters**:
    - **P = 15** (a composite number instead of a prime)
    - **G = 9** (a primitive root modulo P)
- Alice chooses a private key, **a = 4**, and Bob chooses a private key, **b = 3**
- They compute their public keys:
    - Alice:
        
        x = G^a mod P = 9^4 mod 15
        
    - Bob:
        
        y = G^b mod P = 9^3 mod 15
        
- They exchange the public keys x and y, and each computes the shared secret key:
    - Alice:
        
        k_a = y^a mod P
        
    - Bob:
        
        k_b = x^b mod P
        
1. Identify and explain the vulnerability in using **P = 15**
2. Demonstrate how Trudy can brute-force the private keys to compute the shared secret.
3. Provide a step-by-step breakdown of Trudy's attack.

### **Questions to Address**

1. Why is using a prime number for P critical in the Diffie-Hellman algorithm?
2. How does the choice of P = 15 make the shared secret easier to compute for an attacker?
3. What steps does Trudy follow to compute the shared secret? Provide calculations and notes on the reasoning.

### **How to Submit Your Work**

- All work for your chosen challenge must be committed to the **GitHub repository** assigned to you during onboarding.
- Structure your commits clearly, with meaningful messages that outline the progress of your work, see [Git Practices](/docs/processes/github/git-practices.md) for reference.
- Ensure your final submission is well-organized, with supporting files, diagrams, or models included as needed.

# 🍀 Good luck!