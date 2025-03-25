# Hardware Requirements for Signers

:::tip
- **DOs:**
    - Use an isolated device **solely** for signing transactions.
    - Enable biometric verification (face ID, fingerprint).
    - Set up remote wipe/lock features.
    - Use secure networks (3G/4G) or a VPN on Wi-Fi.
    - Implement U2F keys for extra authentication.
- **DO NOT:**
    - Use the isolated device for personal tasks.
    - Connect to public or untrusted Wi-Fi.
    - Store recovery phrases digitally.
    - Skip factory resets before initial setup.
:::


**Device Isolation** minimizes the exposure of sensitive assets to threats like malicious code, phishing, and unauthorized access. 

By dedicating specific devices solely to signing and managing multisig transactions, the risk from internet use, software vulnerabilities, or malicious code is significantly reduced. 

**Key advantages include:** 

- **Reduced attack surface:** Restricting a device to essential functions minimizes the chances of malware and other harmful software getting in.
- **Protection against phishing attacks:** Limited internet exposure means isolated devices are less vulnerable to phishing sites or deceptive email-based attacks.
- **Controlled Software Environment:** Only secure, vetted applications (e.g. Ledger Live, MetaMask, Safari / Chrome) are installed. Custom software and version control ensures updates are managed carefully, reducing unexpected risks.
- **Secure Network Use:** Avoiding untrusted networks (e.g. public Wi-Fi at airports or cafes) minimizes exposure to network-based attacks.
- **Strict User Access:** Only authorized users can access the device, adding an extra layer of security.
- **Simplified Monitoring and Auditing:** With a device dedicated to signing, monitoring becomes simpler, and keeping settings and apps secure is easier with fewer variables to track. ****

## Device

The hardware wallet should only be used on an **isolated device** (e.g. a dedicated laptop or tablet). 

This minimizes the risk of exposure to malicious code via compromised software. 

This device should be used exclusively for signing transactions and **must not be used for any personal** purposes.

There are a few essential precautions we should implement:

- **Biometric Verification:** Have a second layer of protection with biometric authentication (Face ID, Touch ID or Fingerprint) on the isolated device or an external device attached for this purpose.
- **Remote Wiping / Locking:** Having the ability to remotely wipe or lock a device in case of loss, theft, or compromise ensures that if a device is misplaced or falls into unauthorized hands, all sensitive data (including keys, access credentials, and security configurations ) can be immediately erased or locked.
- **Wifi-Free Device (Optional):** Ideally, the isolated device should never connect to public
Wi-Fi. Using device with a 3G/4G connection via eSIM significantly reduces the attack surface by avoiding public or potentially malicious networks (e.g. airports, hotels) while traveling.
- **VPN (Optional)**: If the device doesn’t support 3G/4G connectivity, use a VPN for an additional layer of protection on Wi-Fi. The VPN will encrypt internet traffic, helping protect sensitive data when connecting over potentially unsecure or public networks. This could mitigate many man-in-the-middle attacks (e.g. [Mullvad](https://mullvad.net/en)).
- U2F — Universal 2nd Factor: If the device supports it, you can use U2F security keys (e.g., Yubikey) as an extra layer of authentication for apps like 1Password or other key management tools. While not strictly necessary if you’re already using a hardware wallet, adding a U2F key can further improve your security setup by providing multi-layered protection in other use scenarios.

:::warning
**Factory Reset:** All devices / hardware wallets used for signing transactions should be factory reset multiple times before initial setup to ensure no pre-installed malware or vulnerabilities are present.
:::

# Hardware Recommendation

- Apple iPad Air or iPad 10 Gen, with Cellular
    - 10 hours of battery life
    - Compact
    - Cellular ESIM
    - Biometric Verification
    - An extra keyboard / cover for it will make things easier
    - Supports U2F as Yubikey
    - Metamask and hardware wallets support

To be honest, 

Any device with **face** or **fingerprint** **id**, and bluetooth or usb adaptator that works with the hardware wallet will be enough. Also touch ID / fingerprint could be added as an external device too.