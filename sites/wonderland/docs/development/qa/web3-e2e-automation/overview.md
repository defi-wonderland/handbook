---
title: Overview
---

# Web3 E2E automation

Web3 E2E (end-to-end) automation focuses on testing decentralized applications (dApps) from a user’s perspective, validating how smart contracts, wallets, frontends, and blockchain nodes interact in real-world scenarios. This type of automation typically involves tools like Playwright, Cypress, or Selenium, combined with test wallets, mock chains, or real testnets.

We use [Synpress with Playwright](https://docs.synpress.io/docs/setup-playwright) which combines modern e2e testing power with Web3 context. This is a powerful combination that simplifies the complexity of Web3 e2e testing by:

- Providing a reliable, scalable testing environment for dApps
- Automating browser wallet flows (MetaMask, Phantom)
- Offering a built-in mock wallet for testing without a real wallet (Ethereum Wallet Mock)
- Enabling seamless integration for launching local test networks (with Anvil)

> ✅ [Synpress with Playwright setup](https://www.notion.so/Synpress-setup-1fb9a4c092c7809fb305f33bf3b7a4fd?pvs=21)

## Best Practices

Best practices in E2E automation testing ensure that the testing process is efficient, reliable, maintainable, and scalable. Without them, automated tests can quickly become fragile, slow, or difficult to manage, defeating the purpose of automation.

- [Decide which tests should be automated](/docs/development/qa/web3-e2e-automation/which-tests-should-be-automated)
- [Design patterns for automation](/docs/development/qa/web3-e2e-automation/design-patterns)
- [Locator strategies](/docs/development/qa/web3-e2e-automation/locator-strategies)

:::tip
Make sure to check our [GitHub process guidelines](/docs/processes/github/overview).
:::
