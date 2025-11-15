# Framing the seed problem

Imagine onboarding to a suite of private applications for messaging, payments, and storage, where each one asks you to meticulously write down its own unique recovery phrase, warning you that a single typo could mean the permanent loss of your data. It is no surprise that most people quietly abandon the process right there, the real surprise is that we, as builders, ever expected them to continue.

Privacy on Ethereum should not demand the creation of a parallel identity system, especially when users already possess wallets, master seeds and established mental models for what it means to approve an onchain action. The current experience of **seed fatigue**, where every new privacy app demands its own secret, creates two simultaneous failure modes at once. It leads to the **UX failure** of juggling a growing pile of backups, which pushes users toward insecure practices like copy pasting mnemonics into notes apps and it results in the **ecosystem failure** of fracturing the account space into isolated *privacy islands* that cannot interoperate with the rest of Ethereum.

Let me explain why this matters. **The wallet is the client of onchain life.** If gaining privacy requires a user to manage a separate siloed identity, effectively a new client with its own secret, then the path of least resistance will be to simply remain non private. This isn't about removing options for advanced users, but rather establishing a more secure and accessible default. The aim should be to create a standard where, for most users and use cases, *one seed is enough*. From that single root of trust, everything else a user needs can and should be derived in a way that is deterministic, auditable, recoverable, and crucially, phishing resilient.

While the key insight here is simple, **derive application specific secrets from the single, primary master seed**, the danger lies in its implementation. Naive approaches are catastrophically insecure. We will outline the fundamental properties that any robust derivation system must satisfy and propose two concrete paths forward to build a secure, interoperable ecosystem where any existing wallet becomes a gateway to privacy.

### Core design principles

To design a robust protocol, we first need to define what it must accomplish. The requirements can be understood from three perspectives the user, the system, and the developer.

For **users**, the system must provide a secure and standardized way to derive secrets from their one master seed. This must be **fully and deterministically recoverable**. A user must be able to regenerate all their application secrets on any new device using only their master seed phrase, with no reliance on external services. Critically, before any secret is generated, the user must give **informed and unambiguous consent**. The wallet prompt must make it crystal clear that they are generating a key for a specific application, not signing a transaction that moves assets.

For the **system** itself, several strict security guarantees are non negotiable.
**Strict seed containment** is paramount. The master seed must never, under any circumstances, leave its secure environment (like a hardware wallet's secure chip or a software wallet's encrypted keystore). All derivation operations must happen inside this boundary.
This is coupled with **seed isolation**, which means the derivation must be a one way function. Compromising an application's derived secret must not allow an attacker to reverse engineer the master seed or any other secrets. This ensures an application hack doesn't endanger a user's main onchain funds.
Finally, **cross application isolation** is essential. Secrets for App A and App B must be cryptographically independent. A breach in one must reveal nothing about the other. And of course, the protocol must be highly **resistant to phishing and forgery**.

For **developers**, the protocol needs to be a reliable foundation. This means **interoperability** is key. The method must be a clear, public specification to prevent a world where every wallet implements its own incompatible and likely insecure approach. The protocol should also provide a **simple, extensible primitive**. It should do one thing well derive a single, high entropy root secret for an application. This allows developers to build their own complex cryptographic schemes on top of a simple, audited foundation.

### The Shape of the Solution Two Paths Forward

So, how do we actually build a system that satisfies all these requirements using today's infrastructure? The choice of implementation strategy hinges on a single, critical factor whether or not we can modify hardware wallet firmware. This assumption cleanly divides the problem into two viable and complementary approaches.

1. **The Signature-Based Approach**. This is a pragmatic solution designed to work with the ecosystem as it exists today. It requires no firmware updates and can be implemented by any wallet that supports standard interfaces like EIP-1193.
2. **The Hardware-Native Approach**. This is a more elegant and long term solution. It represents the ideal future where wallet manufacturers implement a new, dedicated firmware primitive for derivation. While it requires wider ecosystem coordination, it offers a superior user experience and even stronger security guarantees.

It's worth noting that these two paths are not mutually exclusive. In fact, they are perfectly compatible. We can and should deploy the signature based solution immediately to solve the seed fatigue problem today, while simultaneously building support for the hardware native approach as the eventual standard. This is how we make real progress ship what works now, while creating better foundations for the future.

### A brief comparison

Both approaches can be designed to achieve the same core security guarantees, but they get there in different ways, leading to important trade offs in usability, deployability, and the precise nature of the security model.

| Criterion | Signature-Based | Hardware-Native |
| --- | --- | --- |
| **Compatibility** | Works Today | Requires Firmware Update |
| **User Experience** | Signature Prompt | Simple Approval |
| **Phishing Defense** | Information Asymmetry | Procedural Separation |
| **Core Dependency** | Deterministic Signatures | Hardened Derivation |
| **Security Boundary** | Wallet Software | Secure Enclave |

The precise mechanics of how these approaches work will be unpacked in subsequent posts but the trade offs are already clear.

### The path to seamless privacy

Forcing users to manage a zoo of secret phrases is not a sustainable path forward. The two pronged strategy of a signature-based protocol for today and a hardware-native protocol for tomorrow provides a powerful roadmap. Both methods deliver the necessary guarantees of seed containment, isolation, and phishing resistance, finally freeing users from the nightmare of managing dozens of mnemonics. By building these standardized primitives, we can transform wallets from simple asset containers into true identity managers, unlocking a new wave of applications where privacy is not a feature you opt into, but a guarantee you can depend on.