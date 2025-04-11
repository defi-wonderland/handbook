# Safe(ty) - Multisig Configuration

:::tip
- **DOs:**
    - Ensure added signers increase security (e.g., 2/2 > 2/3 for safety).
    - Use backups, sharding, or dead-man switches.
    - Separate daily ops, treasury, and governance into distinct Safes.
    - Regularly check for accuracy by proposing faulty transactions.
    - Implement Guard Smart Contracts for transaction rules.
    - Audit contracts and test in sandbox environments before mainnet.
- **DO NOTs:**
    - Rely on one Safe for all operations.
    - Use delegate calls.
    - Deploy without testing—always test configurations and contracts before going live.
:::

## Addition of signers should INCREASE the operational safety of the multisig.

Adding signers should enhance security rather than compromise it. 

- A 2/2 safe is inherently more secure than a 2/3 safe, as the latter increases the attack surface—two of three signers are easier to compromise than two of two.

## Losing access to a signer is NOT permitted

It must be impossible for a signer to lose their ability to sign. This can be achieved by any or a combination of the following methods:

1. Sharding & Backup — read [Hardware Wallet Configuration](./hardware-requirements.md) 
2. Dead-Man Switch — Use bonded time-locked inactivity triggers or social recovery mechanisms. Trusted parties can reassign signer roles securely.

:::tip
Redundancy ensures continuity in critical situations.
:::

## Variable security profiles for execution

**It is crucial to differentiate between operational/daily transactions and sensitive ones, and to assign them to different Safes with appropriate security measures.**

For instance:

- **Operational Safes**: Designed for small, regular transactions (e.g., monthly payments under $1,000), with lighter approval thresholds for convenience.
- **Governance or Treasury Safes**: Handle high-value funds or sensitive actions (e.g., changing thresholds, upgrading contracts) with stricter security requirements.

### Guard Smart Contracts

Currently, there is no built-in way to enforce this on-chain (via the official Safe app), but it is straightforward to build a **Guard Smart Contract** to enforce these "safety lanes."

:::tip
A **Guard Smart Contract** is a modular contract that enforces specific security rules for multisig operations. It acts as a protective layer for your multisig wallet, validating transactions and ensuring they conform to predefined safety parameters before execution. 

This approach is often used with solutions like **Gnosis Safe**, which allows custom Guard contracts to be added. — Read https://docs.safe.global/advanced/smart-account-guards. 

:::

:::warning
**Delegate calls** are **EXTREMELY** dangerous, and should be avoided at all costs.
:::

## Multichain Address Availability

Pretty straightforward: **create a Safe without risks of frontrunning or duplication** while ensuring consistent functionality across chains. Multichain setups are crucial for organizations operating in diverse ecosystems, as they allow for seamless, secure transactions and governance. You can:

1. **Self-Replication with Latest Security Settings**:
    - The Safe should replicate itself across chains while adapting to changes in signers or parameters.
    - Dynamically compute the **salt** (initialization code) to reflect the current state of the Safe (e.g., signer list, thresholds, and modules). This prevents conflicts or accidental duplication when deploying on new chains.
    
:::tip
    Use the `CREATE2` opcode to deploy contracts with deterministic addresses. 
:::
    
:::tip
The Safe UI is pretty good at addressing this, but it's important to verify whether security settings are consistently maintained across different chains when changes are made.
:::
    
2. **Cross-chain module and guard compatibility:**
    - Ensure that modules and guards are designed to function seamlessly across multiple chains.
    - If chain-specific modules are required, they should adhere to a shared security framework to prevent vulnerabilities in a multichain setup.
    
:::tip
    Use modular architecture to allow easy upgrades or adjustments for chain-specific needs.
:::
    
3. **Multichain Deployer Contract**:
    - Create a **Multichain Deployer Contract**, owned by the original Safe, to handle deployments as trusted transactions.
    - This contract:
        - Tracks deployments across chains.
        - Enforces uniform initialization parameters.
        - Manages updates centrally for security and efficiency.

:::tip
Treat multichain deployments as secure Safe transactions, requiring approvals or governance from the original Safe.
:::

## One safe to rule them all? NOT!

You **should NOT** rely on a single Safe for *everything,* you'll just increase operational complexity and will most likely fuck-up. 

You can use monthly allowances for piggy-bank operations, but ideally you should have these be set to a separate operational multisig, that has a different security profile. Basically, segment responsibilities into separate Safes: 

- **Operational Safes**: Small daily transactions.
- **Treasury Safes**: Secure critical funds.
- **Governance Safes**: Handle upgrades and sensitive decisions.

Critical roles or access Safes should NOT double as treasuries. **Segmentation simplifies operations and reduces risk.**

:::tip
The use of security-focused/upgrade/management/payments multisigs might sound like a headache, but it's a MUST to keep shit simple, since you'll need periphery smart contracts and custom configs to make a Safe truly safe. 
:::

## Test your transaction reviewers constantly

Transaction reviewers are the first line of defense against faulty or malicious transactions.

- Test their vigilance by proposing incorrect data.
- Rotate out reviewers who fail to catch issues to prevent a false sense of security

Ideally, you'd setup bounties (or penalties) for catching faulty transactions. 

You should also propose some faulty data purposely to check if people are really watching, and rotate the ones that do not, since those will provide a false sense of security, which is a slow killer.

## All contracts should follow best practices

:::warning
No new or changed contracts should be set to interact or modify safe functionality without going through the proper development cycles.
:::

1. Develop modular and reusable code.
2. Audit smart contracts extensively before deployment.
3. Test in sandbox environments before interacting with mainnet safes.

## Resources (and sources)

https://pkqs90.github.io/posts/gnosis-safe-walkthrough/

https://medium.com/gnosis-pm/formal-verification-a-journey-deep-into-the-gnosis-safe-smart-contracts-b00daf354a9c

https://academy.binance.com/en/articles/threshold-signatures-explained

https://empoweredlaw.wordpress.com/2014/05/25/multi-signature-accounts-for-corporate-governance/

https://safehodl.github.io/multisig/

https://forum.openzeppelin.com/t/list-of-solidity-libraries-in-the-wild/2250#heading--multisig