# Hardware native derivation

In our last discussion, we explored a signature based method for deriving application secrets, a beautiful workaround that allows us to solve the "seed fatigue" problem using the tools that wallets support today. The process relies on asking the user to sign a specially crafted message, this adds a multistep user flow that feels like a transaction, which can create hesitation and ambiguity for less technical users.

This naturally leads us to ask, what would a solution designed from first principles look like? what if we could build directly on the most secure foundation the user possesses ? their **hardware wallet**.  Doing this requires a small modification to the device's internal software, known as **firmware**. By adding a single, specialized function at the hardware level, we can create a system that is not only simpler but also fundamentally more secure.

:::info A Note on Scope
While this document focuses on hardware wallets as the gold standard, the concept of a native `derive_app_secret` function is an architectural primitive that applies to any type of wallet. We concentrate on the hardware implementation because it is the most challenging case and offers the strongest security guarantees, but the principles discussed are broadly applicable.
:::


This post will specify that ideal solution a hardware native derivation function, `derive_app_secret`. We will explore its benefits, how it works under the hood, and the broader implications of this new primitive.

![hardware derivation.png](\img\diagrams\hardware-derivation.png)

### Going native

The beauty of a hardware native approach like this lies in its simplicity. It replaces the complex cryptography of the signature method with clean **procedural separation**. The phishing defense is not a clever cryptographic puzzle, it is a physical barrier inside the device.

There are two primary benefits to this shift.

1. **Simpler Ux.** Instead of a complex signing prompt that resembles a transaction, the user is presented with a approval screen like: "Allow PrivacyPools dApp to access its data?" This is an unambiguous consent flow that is easy to understand.
2. **A secure trust boundary.** The hardware approach moves the operation into the **secure enclave** of the device. The master seed never leaves the chip, the intermediate keys are created and destroyed on the chip, and the final secret is derived and returned in one atomic operation. The trust boundary shrinks from the entire host wallet software to just the hardened, audited silicon chip.

This approach treats the hardware wallet not just as a signer, but as a true **root of trust** for the user's entire digital identity.

### The black box

The core proposal is a new firmware function, `derive_app_secret`. When a host wallet calls this function, the entire process executes atomically inside the hardware's secure enclave.

The internal flow is a two phase process designed for minimalism and security.

1. **BIP-32 Derivation.** The firmware first uses its existing BIP-32 implementation to derive a child key. Think of a master seed and its derived keys as a family tree. "Normal" derivation is like having public records if you find a child key, you might be able to find information about its parent. **Hardened derivation**, which is mandatory in this protocol, is different. It's like a one way street using a mathematical process that makes it computationally impossible to go from the child key back to the parent. This is done along a specific, app registered derivation path (for example, `m/44'/8888'/0'`) creating a cryptographic firewall.  Even if one application's secret is completely compromised, it reveals nothing about the master seed or any other application's secret.
2. **HKDF finalization.** The resulting intermediate key is not the final secret. It is a raw private key and we don't want to return that. Instead, it is immediately fed into an `HKDF-Extract` function, this step is crucial because it acts as a **finalizer**. It takes the structured private key and transforms it into a blob of pure, unstructured entropy, like scrambling a message into random noise. This final `appSecret` has no mathematical properties of a signing key, so it cannot be accidentally imported into another wallet or used to sign a transaction. Using a protocol specific "salt" during this step also ensures that this particular "scrambling" is unique to our protocol, preventing any cross protocol misuse.

It's worth noting we deliberately split the standard `Extract-then-Expand` model of HKDF. The firmware performs only the simple `HKDF-Extract` step, which is a single, atomic function call. We leave the more complex `HKDF-Expand` step, which often involves loops and variable logic, to the application's SDK. This decision follows the principle of **minimal firmware complexity**, keeping the code on the most secure part of the system as simple and auditable as possible.

### Shared responsibility

Security emerges from a strict separation of concerns between three actors.

- **The Firmware.** The hardware's job is to do the math correctly and to be an honest reporter. It guarantees cryptographic isolation through hardened derivation and provides a trusted display for user consent. But it is "blind" to context and trusts the host wallet to have vetted the request.
- **The host wallet or interface.** The **host wallet** is the software on your computer or phone that acts as the bridge to your hardware device, an interface. This software is the primary defense against phishing, so it must ensure that a malicious application cannot simply ask for another application's secret. It does this by maintaining a strict permission model, verifying which websites can request which derivation paths.
- **The user.** The final line of defense is the user's physical confirmation on the device's trusted display. So, could an attacker trick the user? An attacker could try to make the host wallet request a secret for "Angel App" when they are actually "Evil App". However, the hardware device itself is the final verifier. The prompt on its physical screen is the ground truth. It would show the real request, "Derive secret for Evil App?". It is the user's responsibility to read this trusted prompt carefully before pressing "Approve".

### Conclusion

Hardware native derivation represents a more mature, robust, and elegant endgame. It offers a superior user experience, a drastically smaller trust boundary, and a cleaner security model based on procedural separation. It transforms the wallet from a simple signer into a true root of trust for a user's entire digital life. The path to implementing this is not trivial, but building these foundational primitives is essential for unlocking the next wave of secure, private, and user friendly applications on Ethereum.