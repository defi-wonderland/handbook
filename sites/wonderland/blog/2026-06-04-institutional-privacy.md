---
slug: privacy-is-all-you-need
title: "Institutional Privacy"
description: "Status quo: Current hazards and how to solve them"
date: 2026-06-04
tags: [Institutional Privacy, Applied Cryptography]
authors: [lera, skeletor, matias-nisenson]
image: /img/blog-posts-img/institutional-privacy/cover.png
---

## Introduction

### Why This Handbook Exists

Financial institutions are increasingly exploring public blockchain infrastructure for payments, settlement, asset issuance, and tokenization.

The benefits are well understood. Blockchains, which are essentially shared infrastructure, can reduce operational complexity, settlement can occur faster, assets become programmable, and systems that were previously fragmented can interoperate more easily.

At the same time, moving financial activity onto public infrastructure introduces a challenge that traditional financial systems were never designed to solve.

Most public blockchains make transaction data broadly visible. Balances, transfers, wallet activity, and transaction histories can often be observed by anyone with access to the network. While this transparency provides important benefits for verification and security, it creates obvious concerns for institutions that operate in environments where confidentiality is expected.

For many years, the conversation around privacy in digital assets was largely limited to anonymity-focused systems. As a result, many institutions concluded that privacy technologies were either incompatible with regulation, too immature for production use, or both.

The landscape has since changed significantly.

Recent advances in cryptography and confidential computing have made it possible to protect sensitive information while maintaining auditability, compliance, and verifiability. Rather than choosing between complete transparency and complete opacity, institutions can now design systems that reveal information only to the parties authorized to see it. This concept, often referred to as selective disclosure, is becoming one of the foundational design principles of modern privacy infrastructure.

The purpose of this handbook is to provide a practical framework for understanding that landscape. It is intended for leaders evaluating digital asset strategy, tokenization initiatives, settlement infrastructure, and privacy-preserving financial applications. It is equally intended for technical teams responsible for evaluating implementation approaches and deployment readiness.

Throughout this handbook, we focus on a simple question: How can financial institutions preserve the confidentiality requirements of modern finance while benefiting from the openness, interoperability, and efficiency of public blockchain infrastructure?

Many of the technologies discussed in this handbook are already operating in production environments today. Others are approaching maturity rapidly. As more financial activity moves on-chain, understanding these technologies and their tradeoffs is becoming increasingly important.

This handbook is intended to serve as a map for that process.

<!-- truncate -->

## Section 1: The Privacy Problem in Financial Services

### Privacy in Finance Today

Privacy is often discussed as a new challenge introduced by digital assets. In reality, confidentiality is already embedded throughout modern financial infrastructure. However, this does not mean the information is hidden from everyone. Different participants receive access to different information depending on their role within the system.

Financial infrastructure has evolved around this principle. Information is disclosed where necessary and protected where it is not. Put differently, modern financial systems are built around controlled visibility.

### What Changes on Public Blockchains

Public blockchains introduce a different model. Rather than relying on a central institution to maintain records and verify transactions, blockchain networks distribute that responsibility across a network of participants.

This architecture creates many of the properties that have made blockchain technology attractive to financial institutions. Records are shared, transactions can be independently verified, and systems can interoperate without requiring a single operator to coordinate activity. As a result, participants can verify activity directly from the network rather than relying exclusively on records maintained by a single intermediary.

The same transparency that enables these benefits also creates a challenge. On many public blockchains, transaction activity is visible by default. Depending on the system, participants may be able to observe balances, transfers, wallet activity, transaction history, and relationships between accounts.

This visibility provides strong guarantees around verification and auditability. It also introduces information exposure that does not exist in traditional financial systems.

### The Cost of Information Leakage

Not all information has equal value. Some information is valuable precisely because it reveals intent, relationships, or future activity. In traditional financial systems, information is often abstracted behind institutions. This abstraction allows stakeholders to interact with the financial system without receiving access to every piece of information within it.

Public blockchain infrastructure reduces many of these layers of abstraction. As a result, information that would traditionally remain visible only to a limited group of participants can become visible to a much broader audience.

For institutions evaluating blockchain infrastructure, this creates an important tension. The transparency that makes public blockchains powerful can also create operational, legal, and competitive risks if sensitive information becomes broadly observable. This is one of the central conundrums privacy technologies seek to address.

### Why the Answer Is Not Simpler Than It Looks

At first glance, the solution appears straightforward. If transparency creates the problem, reducing transparency should solve it. In practice, the challenge is more nuanced. Financial institutions do not simply require confidentiality. They also require auditability, accountability, compliance, and operational assurance.

This means that a system that hides everything from everyone is rarely useful in a regulated environment. Regulators need access to relevant information. Auditors need to verify records. Institutions need mechanisms for monitoring risk and investigating incidents.

The objective of privacy technology, therefore, is controlled visibility. Financial institutions already operate this way today. Different participants receive access to different information depending on their role and responsibilities. The challenge now becomes reproducing this model onchain.

### Why Private Chains Are Not a Complete Answer

Many institutions initially concluded that private blockchain networks are the natural solution. If public visibility creates confidentiality concerns, limiting participation to a known set of entities must solve the problem. The reality is that private networks can be useful in certain contexts and continue to play an important role across parts of the industry. However, they also introduce tradeoffs.

Many of the benefits that have attracted institutions to blockchain infrastructure stem from operating on shared networks. Liquidity, neutrality, interoperability, composability, and access to broader ecosystems become more difficult to achieve when activity is isolated within a closed environment.

As organizations evaluate tokenization, settlement, and digital asset infrastructure, they often find themselves balancing two competing objectives: They want the benefits that come from operating on public infrastructure, and they want the confidentiality expected in modern financial systems.

Historically, this tradeoff was difficult to resolve. Today, advances in cryptography and confidential computing are making it possible to approach the problem differently. The remainder of this handbook explores how.

## Section 2: What Web3 Privacy Actually Enables

### The Core Insight: Verification Without Disclosure

Historically, verification and disclosure have been closely linked. If an institution wanted to verify information, it generally needed access to the underlying data. For example, a bank verifies identity by collecting personal information, while an auditor verifies operations by reviewing records. In each case, the ability to verify something depends on access to the underlying information.

Recent advances in cryptography and confidential computing have begun to change this relationship. It is now increasingly possible to prove that a statement is true without revealing all of the information used to prove it. This allows new interactions between stakeholders that weren't possible before. For example, a user can prove they satisfy a compliance requirement without revealing their identity, or an institution can demonstrate ownership or authorization without revealing details of the underlying transaction.

This shift fundamentally changes how privacy can be implemented on public infrastructure. Historically, privacy was often achieved by controlling access to information and restricting who could view it. It required participants to trust the systems and intermediaries in place. Today, privacy can increasingly be enforced at the information layer itself.

Rather than choosing between transparency and confidentiality, institutions can increasingly benefit from both by designing systems where information is disclosed only to the parties authorized to receive it.

### What Is Now Possible?

The practical implications are significant. Many of the confidentiality requirements that institutions associate with traditional financial systems can now be implemented on public blockchain infrastructure while preserving the benefits of blockchains. Below are some examples of what is possible today with public blockchain infrastructure.

#### Shared Infrastructure Without Universal Visibility

One of the primary benefits of public blockchain infrastructure is that multiple institutions, assets, applications, and service providers can operate on the same underlying network. Rather than maintaining separate systems that require constant coordination and reconciliation, participants can interact through a shared source of truth. Historically, this introduced a tradeoff. Blockchains increased transparency, but that transparency often came at the expense of confidentiality.

Privacy technologies are increasingly making it possible to separate participation from visibility. Multiple institutions can operate on the same infrastructure without requiring every participant to see every piece of information generated by the system. This allows institutions to benefit from interoperability and common infrastructure without accepting universal transparency as a prerequisite.

#### Selective Regulatory Disclosure

Financial institutions operate in highly regulated environments. Compliance, reporting, audits, and supervision all require information to be shared with regulators, auditors, and authorized counterparties. Up until recently, satisfying these requirements often meant providing direct access to underlying records and sensitive information.

Today, institutions can increasingly design systems where regulators, auditors, and counterparties can verify specific facts without requiring all underlying information to be disclosed. Rather than exposing complete records, institutions can prove that a requirement has been satisfied while revealing only the information necessary for verification. Or, depending on the privacy model, institutions can prove a requirement has been satisfied mathematically, without revealing any information at all. This allows institutions to maintain confidentiality while continuing to satisfy regulatory and compliance requirements.

#### Private Identity and Credentials

Identity verification has traditionally required institutions to collect, store, and protect large amounts of personal information. This approach creates operational complexity, increases the amount of sensitive information institutions are responsible for securing, and expands the potential impact of data breaches.

Today, institutions can increasingly verify specific attributes without requiring all underlying information to be disclosed. A participant may be able to prove they satisfy a requirement without revealing the information used to establish that fact. This changes the flow of information itself. Rather than collecting, storing, and repeatedly sharing sensitive information, institutions can increasingly verify what they need to know without collecting and storing data.

#### Auditable Privacy

Privacy and transparency are often treated as opposing objectives. Historically, increasing confidentiality frequently reduced visibility for auditors, regulators, and other authorized parties. Modern privacy technologies are beginning to change this assumption.

Institutions can increasingly design systems that preserve confidentiality while maintaining the ability to verify activity, demonstrate compliance, and perform audits. This enables institutions to maintain confidentiality where it is needed while preserving accountability where it is required.

### The Privacy Primitive Families

The technologies that enable these capabilities generally fall into four categories. Each of the below addresses a different problem.

| Primitive | Core Function |
| --- | --- |
| Zero-Knowledge Proofs (ZK) | Prove information without revealing the underlying data |
| Secure Multi-Party Computation (MPC) | Distribute trust and control across multiple parties |
| Trusted Execution Environments (TEE) | Execute sensitive workloads inside isolated environments |
| Fully Homomorphic Encryption (FHE) | Perform computation directly on encrypted data |

## Section 3: The Regulatory Frame

### The Throughline Across Jurisdictions

A common misconception is that financial regulation requires financial information to be publicly visible. In practice, most relevant regulatory frameworks are concerned with accountability. Institutions must be able to identify relevant participants, maintain records, satisfy compliance obligations, and provide information when required. This is an important distinction.

Most relevant regulations do not require every transaction, balance, or relationship to be visible to the public. They require the appropriate parties to have access to the information necessary to perform their responsibilities.

For privacy systems, the question is therefore not whether information can remain private. The question is whether regulators, auditors, and obligated entities can access the information they need when they need it.

### Regulatory Snapshot

| Framework | Primary Concern | Implication |
| --- | --- | --- |
| FATF Travel Rule | Information sharing between obligated entities | Required information must be available to authorized parties. |
| MiCA & AMLR | Compliance, traceability, and accountability | Privacy systems must preserve oversight and compliance capabilities. |
| FinCEN | AML, sanctions compliance, and recordkeeping | Institutions must be able to identify participants and provide information when required. |
| GDPR | Protection of personal information | Data collection and disclosure should be minimized where possible. |

*Sources: FATF Recommendation 16; FATF Virtual Asset Guidance (2021); Regulation (EU) 2023/1114 (MiCA); Regulation (EU) 2024/1624 (AMLR); FinCEN FIN-2019-G001 and related BSA guidance; Regulation (EU) 2016/679 (GDPR).*

### What This Means for System Design

Across jurisdictions, privacy is not necessarily incompatible with regulation. The consistent requirement is that institutions remain able to satisfy compliance obligations, support oversight, and provide information to authorized parties when necessary. When evaluating privacy technologies, institutions should focus not only on what information remains confidential, but also on how information can be selectively disclosed, audited, and accessed when required.

## Section 4: Banking Use Cases

The previous sections focused on the problem privacy technologies are designed to solve. This section focuses on where they create value for financial institutions.

Privacy technologies are typically introduced to support broader initiatives such as tokenization, settlement, cross-border payments, digital identity, and asset servicing. Privacy only becomes relevant because these initiatives often involve information that institutions cannot disclose publicly.

The following examples illustrate how privacy technologies can be applied to real financial workflows, the confidentiality challenges they address, and what becomes possible when privacy can be implemented directly on public blockchain infrastructure.

### Tokenized Funds and RWA Subscriptions

#### Why Institutions Are Exploring This Onchain

Tokenization allows financial assets to be represented on blockchain infrastructure, where they can settle faster, integrate more easily with other applications, and become accessible to a broader set of participants.

For funds, private credit, money market products, and other RWAs, this can reduce operational complexity, improve transferability, and create more efficient distribution channels.

#### Privacy Challenge

Tokenization also introduces confidentiality concerns. Fund managers generally do not want investor allocations, subscription activity, portfolio positions, or redemption behavior to be publicly visible. Investors similarly do not want holdings, investment decisions, or transaction history exposed to competitors, counterparties, or the broader market.

Privacy technologies make it possible to issue, subscribe to, hold, and transfer tokenized assets without exposing all underlying information to every participant on the network. Investor eligibility can be verified, ownership can be validated, and regulators or auditors can receive relevant information without making that information public.

#### Example Workflow

1. A fund manager launches a tokenized private credit fund on public blockchain infrastructure.
2. An investor completes onboarding and proves they satisfy the fund's eligibility requirements.
3. The subscription is processed and ownership is recorded onchain.
   - **Result:** The investor receives the benefits of digital ownership and settlement while sensitive information such as identity, allocations, and portfolio exposure remain visible only to authorized parties.
   - **Plus:** The fund manager benefits from shared infrastructure, programmable assets, and simplified settlement without sacrificing confidentiality.

### KYC / AML Credential Issuance

#### Why Institutions Are Exploring This Onchain

Identity and compliance remain foundational requirements for financial services. Whether opening an account, subscribing to a fund, or sending a payment, participants must satisfy onboarding and compliance requirements.

As financial activity moves onchain, institutions need ways to establish trust without recreating the same verification process across every platform and application. Digital credentials offer a potential solution by allowing participants to prove that specific requirements have already been satisfied.

#### Privacy Challenge

Traditional identity verification requires institutions to collect, store, and share sensitive personal information. As more organizations participate in a workflow, more copies of that information are created, increasing operational costs and expanding potential points of exposure.

Privacy technologies make it possible to verify attributes such as KYC status, accreditation, or service eligibility without repeatedly sharing the underlying information. This allows institutions to maintain compliance while reducing the amount of sensitive data that must be collected, stored, transmitted, and protected throughout the system.

#### Example Workflow

1. A financial institution performs onboarding and KYC checks for a customer.
2. Once the verification process is complete, the institution issues a credential attesting that the customer satisfies the required compliance standards.
   - **Result:** The institution retains the information necessary to satisfy its regulatory obligations, but the customer does not need to repeatedly share the same information with every service they use.
3. The customer later uses that credential to access a second tokenized fund, payment network, or financial application operating on public blockchain infrastructure.
4. Rather than repeating the onboarding process or sharing personal information again, the customer proves they satisfy the relevant requirements.
   - **Result:** The second institution can verify compliance requirements without collecting, storing, and protecting the same information a second time.
   - **Plus:** The customer accesses the service while maintaining greater control over how their information is shared, and with less friction in their user journey.

### Cross-Border Payments with Travel Rule Compliance

#### Why Institutions Are Exploring This Onchain

Cross-border payments often involve multiple intermediaries, fragmented messaging systems, reconciliation processes, and settlement delays. Blockchains offer the potential for faster settlement, continuous operation, and a shared source of truth between participants.

#### Privacy Challenge

Cross-border payments contain sensitive information about customers, counterparties, payment flows, and commercial relationships. At the same time, institutions must satisfy sanctions screening, AML controls, and Travel Rule obligations.

Privacy technologies make it possible to verify that required compliance checks have been completed and that payment instructions are valid without exposing all underlying information to the broader network. Required information can remain available to authorized parties while reducing public visibility into customer activity and commercial relationships.

#### Example Workflow

1. A customer initiates a cross-border payment through a regulated financial institution.
2. The institution performs sanctions screening, AML checks, and collects the information required to satisfy Travel Rule obligations.
3. Rather than embedding sensitive customer and counterparty information directly into a public system, the institution generates privacy-preserving attestations that the required compliance checks have been completed.
   - **Result:** Customer information remains visible to authorized parties while remaining hidden from the broader network.
4. The payment is submitted to a public blockchain network for settlement.
   - **Result:** The network verifies that the transaction is valid without requiring customer identities, payment details, or supporting compliance information to be publicly visible.
5. If required, regulators and authorized institutions can access the information necessary for oversight, auditing, and compliance.
   - **Result:** The payment benefits from blockchain infrastructure while reducing exposure of customer information, commercial relationships, and payment activity.

### Interbank Settlement and Payments

#### Why Institutions Are Exploring This Onchain

Interbank settlement often requires multiple parties to coordinate across separate systems, maintain reconciled records, and manage operational processes that can introduce delays and complexity.

Blockchains offer an alternative model. Participating institutions can settle against a common source of truth, reducing reconciliation requirements and enabling faster movement of value between counterparties.

#### Privacy Challenge

Banks may need to coordinate around settlement, but they generally do not want to expose all of their activity to one another. Treasury operations, liquidity management, payment flows, and counterparty relationships often contain commercially sensitive information.

Privacy technologies make it possible for institutions to settle onchain without exposing all underlying activity to every participant on the network. Settlement can be verified, balances can be updated, and transactions can be completed while limiting visibility into the information associated with those activities.

#### Example Workflow

1. Bank A initiates a transfer to Bank B.
2. The participating institutions verify that the transaction satisfies the required settlement and compliance requirements.
3. The transaction is submitted onchain.
   - **Result:** The network verifies that the transaction is valid and updates the relevant state without requiring all participating institutions to view the underlying details.
4. Settlement is completed and recorded on a shared source of truth.
   - **Result:** The participating institutions benefit from faster settlement and reduced reconciliation requirements while maintaining confidentiality around balances, payment flows, and treasury activity.

### Confidential Trading and Order Flow

#### Why Institutions Are Exploring This Onchain

Institutions are increasingly exploring digital asset markets to access tokenized assets, new liquidity venues, and blockchain-based financial infrastructure. Blockchains can simplify settlement, reduce operational complexity, and allow assets to move more efficiently between participants.

#### Privacy Challenge

Trading activity often contains some of the most commercially sensitive information within financial markets. Orders, positions, execution strategies, and trading intentions can reveal valuable information about a participant's behavior and future activity.

Privacy technologies make it possible to separate trade execution from public disclosure. Orders can be submitted, matched, and executed without exposing all underlying information to every participant observing the network, reducing information leakage around trading activity, positions, and execution strategies.

#### Example Workflow

1. An institution submits an order to buy or sell a tokenized asset through a trading venue operating onchain.
2. Matching and execution requirements are evaluated.
   - **Result:** The market can verify that the order is valid and eligible for execution without requiring all participants to see the underlying order details.
3. The trade is executed and settled.
   - **Result:** The institution gains access to shared liquidity and onchain settlement while reducing exposure of trading intentions, positions, and execution strategies.
4. Authorized parties retain access to the information necessary for auditing, compliance, and regulatory oversight.
   - **Result:** The market remains accountable while preserving confidentiality where it is commercially necessary.

## Section 5: Privacy Technology Deep Dive

Not all privacy technologies solve the same problem. Some are designed to verify information without revealing it, others protect custody, enable confidential computation, or allow encrypted data to remain usable while hidden from participants.

Understanding these differences is often more important than understanding the underlying cryptography. The following section provides a high-level overview of the four primary privacy technologies institutions are evaluating today, their strengths, limitations, and current level of maturity.

### Zero-Knowledge Proofs (ZK)

Zero-knowledge proofs allow one party to prove that a statement is true without revealing the underlying information used to prove it. For example, an institution can prove that a transaction is valid, funded, and compliant without revealing the amount, participants, or supporting records.

This makes ZK one of the most important building blocks for disclosure control. Unlike traditional systems, where verification often requires sharing the underlying information, ZK allows parties to verify claims without receiving the data itself. The technology is already widely deployed across digital asset infrastructure, including privacy applications, identity systems, and blockchain networks. It is one of the most mature privacy technologies available today. Its primary limitation is that it proves facts about information but is not designed to manage shared encrypted state between many participants.

### Multi-Party Computation (MPC)

Multi-party computation allows multiple parties to jointly control or process information without any individual party ever possessing the complete secret. In digital assets, MPC is most commonly used for custody and key management, where a signing key is distributed across multiple parties rather than existing in a single location.

The primary benefit is the removal of single points of compromise. Rather than trusting one administrator, server, or hardware device, institutions can distribute control across multiple participants. MPC is one of the most mature technologies discussed in this handbook and is widely used across banks, custodians, and exchanges today. Its primary limitation is that MPC produces no independently verifiable artifact on its own, which is why it is often combined with other privacy technologies.

### Trusted Execution Environments (TEE)

Trusted execution environments allow data to be processed inside a protected hardware environment that other parties can verify. Rather than trusting an operator's word, participants can verify that approved software processed their information.

TEEs are valuable because they provide confidential computation with performance close to traditional systems. This makes them particularly useful for workloads that are difficult to support using other privacy technologies. TEEs are already widely deployed across cloud infrastructure and digital asset systems. Their primary limitation is their trust model, which depends on the security of the underlying hardware and the vendor that manufactures it.

### Fully Homomorphic Encryption (FHE)

Fully homomorphic encryption allows computation to be performed directly on encrypted data. In practical terms, this means multiple parties can interact with the same data without first decrypting it.

This capability makes FHE one of the most promising technologies for confidential balances, confidential assets, and other privacy-preserving financial applications. At the same time, it is also the least mature of the technologies discussed in this handbook. While production deployments now exist, adoption remains early relative to ZK, MPC, and TEE systems. Institutions evaluating FHE should carefully consider performance requirements, operational complexity, and vendor maturity as the technology continues to develop.

| Technology | Best Used For | Maturity |
| --- | --- | --- |
| ZK | Proving facts without revealing information | Mature |
| MPC | Removing single points of trust and custody risk | Mature |
| TEE | Fast confidential computation | Mature |
| FHE | Shared encrypted state and confidential balances | Emerging |

## Section 6: Architectural Patterns

The privacy technologies discussed in the previous section are rarely deployed in isolation. In practice, production systems combine multiple primitives to address different requirements within the same workflow. One technology may protect custody, another may enable confidential computation, another may provide auditability, and another may support regulatory disclosure.

As a result, institutions should avoid viewing privacy technologies as competing alternatives. In most real-world deployments, they are complementary components of a broader system. The examples below illustrate how these technologies can be combined to support common financial workflows.

### Confidential Trading & Order Matching

```
Wallet
  ↓
MPC custody
  ↓
TEE matching engine
  ↓
ZK settlement proof
  ↓
Selective disclosure layer
```

MPC protects custody by removing single points of compromise. The TEE provides confidential matching at high speed, while ZK creates an independently verifiable record that the match was executed correctly. A selective disclosure layer ensures that counterparties and regulators can access required information without exposing the order book publicly.

### Tokenized Funds & RWA Subscriptions

```
Wallet
  ↓
Threshold-MPC custody
  ↓
Confidential balances (FHE)
  ↓
ZK proof of investor eligibility
  ↓
Selective disclosure to issuer and regulator
```

FHE protects investor balances, while ZK allows investors to prove eligibility requirements without revealing unnecessary information. MPC secures privileged controls and selective disclosure ensures that issuers and regulators retain appropriate visibility.

### KYC & AML Credentials

```
Identity provider
  ↓
MPC credential issuance
  ↓
ZK credential held in wallet
  ↓
Selective disclosure proof
```

Credentials can be issued without creating a single point of compromise and later used to prove specific attributes without revealing the underlying personal information.

No single privacy technology solves every problem. Production systems are composed of multiple layers, each responsible for protecting different forms of information, satisfying different operational requirements, and supporting different trust assumptions. The objective in exploring privacy solutions is to understand how different technologies can be combined to support a specific business workflow.

## Section 7: What Teams Get Wrong

Privacy is one of the most overloaded terms in digital assets. Different technologies solve different problems, operate under different trust assumptions, and make different tradeoffs around performance, confidentiality, and operational complexity.

As a result, teams often evaluate privacy systems using incomplete mental models. This means the most common mistakes are typically architectural. The following sections highlight several recurring misconceptions and implementation risks institutions should understand before exploring and selecting a privacy architecture.

### Confusing Privacy with Anonymity

One of the most common conflations in digital assets is that privacy and anonymity are the same thing. Most financial institutions do not require anonymity, they need confidentiality. The objective of privacy systems is therefore not to prevent anyone from accessing information, it is to ensure that information is only available to the parties authorized to receive it.

This distinction is important because many discussions around privacy technologies focus on hiding information from everyone. In practice, institutions generally need the opposite. They need the ability to selectively disclose information to regulators, auditors, counterparties, and internal stakeholders while preventing unnecessary public exposure.

Privacy should be generally understood as controlled visibility rather than anonymity. A system can be highly private while remaining fully auditable. Similarly, a system can provide anonymity while failing to satisfy the requirements of regulated financial institutions. Conflating these concepts often leads teams to evaluate the wrong technologies, apply the wrong requirements, and misunderstand the role privacy plays within modern financial systems.

### Assuming One Primitive is Enough

A common misconception is that privacy can be achieved by selecting a single privacy technology. In practice, institutions deploy systems, not primitives. Different privacy technologies solve different problems. One technology may protect identity while another may protect transaction execution.

As a result, evaluating a privacy architecture solely through the lens of a single primitive often produces misleading conclusions. A system built entirely around one privacy technology may still expose sensitive information elsewhere in the workflow.

The most effective privacy architectures are typically composed of multiple technologies working together, each addressing a different layer of the problem. Institutions should therefore evaluate privacy systems holistically rather than asking whether a particular primitive is sufficient on its own.

### Ignoring Operational Security

Privacy technologies can protect information within a system. They cannot, however, prevent participants from exposing that information themselves. A common mistake is assuming that strong cryptography eliminates the need for operational security. In practice, many privacy failures occur outside of the protocol itself.

Wallet addresses may become identifiable due to patterns. Internal systems may expose sensitive information. Improper key management can lead to a security vulnerability. As a result, the privacy guarantees of a system are often limited by the operational practices surrounding it.

This is particularly important for financial institutions, where sensitive information frequently moves between internal teams, service providers, counterparties, and regulators. A privacy architecture should therefore be evaluated alongside the operational processes that support it. While strong cryptography can significantly reduce information exposure, it cannot compensate for poor operational security.

### Authorized Participant Wallet Doxxing

Many privacy architectures focus on protecting transaction data, balances, identities, or application state. However, these protections can be significantly weakened if the participants themselves become identifiable.

This is particularly relevant for financial institutions. In many systems, certain wallets are publicly associated with known entities. Treasury wallets, market-making wallets, custody wallets, and operational accounts are often disclosed directly or become identifiable over time through public activity.

Once a wallet becomes associated with a known institution, observers can begin drawing conclusions from its behavior even if portions of the underlying transaction data remain private.

For example, an observer may not know the exact details of a transaction, but they may still know that a specific institution was active, interacted with a particular application, or participated in a specific workflow.

This creates an important distinction between transaction privacy and participant privacy. A system may successfully protect the contents of an interaction while still revealing who is interacting.

When evaluating privacy architectures, institutions should consider not only what information is protected, but also whether the identities of participating accounts can be inferred, linked, or publicly associated with known entities.

### Mock vs. Production Maturity Gap

Many privacy technologies perform well in demonstrations, benchmarks, and controlled environments. Production systems operate under very different conditions. A proof of concept may successfully demonstrate a privacy primitive, but that does not necessarily mean the surrounding system is ready for institutional deployment.

Operational resilience, monitoring, key management, recovery procedures, governance, upgradeability, integration requirements, and scalability often determine whether a system can support real-world workloads.

This distinction is particularly important in privacy infrastructure, where performance characteristics can change significantly as transaction volumes increase, user activity grows, or additional compliance requirements are introduced.

Institutions should therefore evaluate not only whether a privacy technology works, but whether it has been proven under realistic operating conditions. Questions such as operational history, production usage, security reviews, failure recovery procedures, and deployment complexity are often as important as the underlying cryptography itself. While a successful demonstration proves that a technology is possible, production adoption requires proving that it is reliable.

### Critical Scalability Bottlenecks

Privacy technologies introduce additional computational, operational, and infrastructure requirements. These vary significantly depending on the architecture being used.

Some systems increase latency. Others require specialized hardware. Some impose additional proving, verification, storage, or networking requirements. Others may perform well at small scale but encounter challenges as transaction volumes increase.

As a result, privacy should not be evaluated solely through the lens of confidentiality. Institutions must also understand the performance characteristics and operational tradeoffs associated with a given solution. This is particularly important for financial applications where settlement speed, transaction throughput, user experience, and operational reliability are critical requirements.

When evaluating privacy technologies, institutions should assess not only what information is protected, but also the cost of providing that protection. Privacy can be a tradeoff, and understanding that tradeoff is often as critical as understanding the privacy guarantees themselves.

### Tooling, Dependencies, and Vendor Lock-In

As covered in previous sections, institutions rarely deploy a privacy primitive in isolation. As a result, the long-term viability of a privacy architecture is often determined as much by its dependencies as by the privacy technology itself.

A system may rely on specialized proving infrastructure, proprietary hardware, trusted operators, external coordinators, managed services, or vendor-controlled components. While these dependencies may simplify deployment, they can also introduce operational, governance, and business risks.

This becomes particularly important when evaluating long-term adoption. A privacy architecture that depends on a single vendor, a small group of operators, or highly specialized infrastructure may be difficult to migrate, maintain, or replace in the future. Institutions should therefore evaluate not only the privacy guarantees of a system, but also the broader ecosystem that supports it.

Questions such as who operates the infrastructure, who controls upgrades, how components can be replaced, and what happens if a vendor ceases support are as important as the underlying privacy model. A privacy design should always be evaluated as a complete operational stack.

### Mempool Exposure

A system may successfully protect information once a transaction has been executed while still exposing information before execution occurs. This is particularly relevant on public blockchain networks, where transactions are often broadcast to the network before they are included in a block.

Depending on the architecture, pending transactions may reveal information about trading activity, transaction intent, counterparties, or other operational behavior before privacy protections are applied.

For institutions, this distinction is important. A transaction that is private after settlement may still leak sensitive information during the submission process. As a result, privacy should be evaluated across the full transaction lifecycle rather than solely at the point of execution or settlement.

When assessing a privacy architecture, institutions should understand not only how information is protected after a transaction is processed, but also how information is handled before execution occurs.

## Section 8: Evaluation Checklist

Privacy technologies are often evaluated through technical features, performance benchmarks, or cryptographic guarantees.

For institutions, the more useful approach is to evaluate privacy systems through the lens of business requirements, regulatory obligations, operational constraints, and long-term maintainability.

The following section can be used as a starting point when assessing a privacy architecture.

### Define the Information Being Protected

Before evaluating any technology, identify what information requires protection. Examples may include customer identity, account balances, payment activity, or portfolio positions. The goal should be to define the information that creates risk if exposed.

### Identify Authorized Viewers

Determine who should have access to that information. Examples may include customers, regulators, auditors, or counterparties. Privacy requirements are often easier to define in terms of who should and should not have access.

### Evaluate the Full Workflow

Assess where information is created, transmitted, processed, stored, and disclosed. Consider where information enters the system, where it can leak, and how information is shared, recovered, and disclosed when required.

### Assess Production Readiness

Consider whether the technology has been deployed in production, if it has operated at meaningful scale previously, and evaluate its operational history, security reviews, and recovery procedures.

### Evaluate Dependencies

Consider all of the dependencies the system will require. Who operates the infrastructure? Who controls upgrades? Can components be replaced? What happens if a vendor ceases to exist?

### Validate Regulatory Requirements

Evaluate how information can be disclosed to authorized parties and how applicable compliance obligations can be satisfied. Regulatory expectations continue to evolve, making flexibility an important consideration when designing privacy systems.

### Evaluate Privacy as an Overall System

Privacy should not be evaluated solely through the lens of a single primitive. The more important question is whether the overall system protects the information that matters while remaining usable, compliant, and operationally sustainable.

## Section 9: The Path Forward

For many years, institutions evaluating public blockchain infrastructure faced a difficult tradeoff: They could benefit from the openness, interoperability, and efficiency of blockchains, or they could preserve the confidentiality expected in modern finance. In most cases, achieving both was not practical.

Advances in cryptography, confidential computing, and privacy-preserving infrastructure have made it possible to design systems where sensitive information can remain protected while transactions, assets, and workflows continue to operate onchain. However, this does not mean privacy has been completely solved. Different technologies make different tradeoffs. Regulatory expectations continue to evolve. Operational requirements remain complex. Many systems are still maturing.

That said, the conversation has fundamentally shifted. We are no longer evaluating the possibility of privacy on public blockchain infrastructure. Instead, we now move to evaluate how privacy should be implemented, what tradeoffs are acceptable, and which technologies are appropriate for a given use case. For institutions exploring digital assets, tokenization, payments, settlement, and other blockchain-based financial applications, privacy should simply be viewed as another design consideration.

The objective is the same one financial institutions have pursued for decades: ensuring that information is available to the parties that need it while remaining protected from those that do not. The only difference is that now institutions have new tools available to achieve that goal. Understanding those tools, their capabilities, and their limitations is becoming an increasingly important part of building financial systems onchain.

## About Wonderland

Wonderland is a foundational engineering firm focused on building critical infrastructure for frontier technology. Over the past several years, we have worked across privacy, interoperability, payments, decentralized finance, Layer 2 infrastructure, security, stablecoins, and tokenization.

Institutions evaluating privacy systems must often navigate questions of architecture, implementation, compliance, operational risk, and long-term maintainability. Our work sits at the intersection of those disciplines. We help organizations evaluate privacy requirements, assess technology tradeoffs, design privacy-preserving systems, and implement production infrastructure.

If your institution is exploring privacy, tokenization, digital assets, or blockchain-based financial infrastructure, we would be happy to continue the conversation.

[wonderland.xyz](https://wonderland.xyz)
