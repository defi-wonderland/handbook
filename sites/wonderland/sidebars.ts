import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    "intro/welcome",
    {
      type: "category",
      label: "Processes",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "processes/overview",
      },
      items: [
        "processes/overview",
        "processes/project-lifecycle",
        {
          type: "category",
          label: "GitHub",
          items: [
            "processes/github/overview",
            "processes/github/git-environment",
            "processes/github/git-practices",
            "processes/github/pr-guidelines/pr-guidelines",
            "processes/github/repo-readiness",
            "processes/github/ssh-setup",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Development",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "development/overview",
      },
      items: [
        "development/overview",
        {
          type: "category",
          label: "Research",
          items: [
            "development/research/research-overview",
            "development/research/manifesto",
            "development/research/methodology",
            "development/research/technical-writing",
            {
              type: "category",
              label: "Onboarding",
              items: [
                "development/research/onboarding/overview",
                {
                  type: "category",
                  label: "Knowledge Base",
                  items: [
                    "development/research/onboarding/knowledge-base/overview",
                    {
                      type: "category",
                      label: "Basics",
                      items: [
                        "development/research/onboarding/knowledge-base/basics/tokenomics",
                        "development/research/onboarding/knowledge-base/basics/game-theory",
                      ],
                    },
                    {
                      type: "category",
                      label: "Intermediate",
                      items: [
                        "development/research/onboarding/knowledge-base/intermediate/solidity",
                        "development/research/onboarding/knowledge-base/intermediate/cryptography",
                      ],
                    },
                    {
                      type: "category",
                      label: "DeFi",
                      items: [
                        "development/research/onboarding/knowledge-base/defi/limit-order",
                        "development/research/onboarding/knowledge-base/defi/amm",
                        "development/research/onboarding/knowledge-base/defi/lending-protocol",
                      ],
                    },
                    {
                      type: "category",
                      label: "Core",
                      items: [
                        "development/research/onboarding/knowledge-base/core/evm",
                        "development/research/onboarding/knowledge-base/core/oracles",
                        "development/research/onboarding/knowledge-base/core/bridges",
                        "development/research/onboarding/knowledge-base/core/layer_2",
                      ],
                    },
                  ],
                },
                {
                  type: "category",
                  label: "Challenges",
                  items: [
                    {
                      type: "category",
                      label: "Basic",
                      items: [
                        "development/research/onboarding/challenges/basic/game-theory",
                        "development/research/onboarding/challenges/basic/tokenomics",
                      ],
                    },
                    {
                      type: "category",
                      label: "Intermediate",
                      items: [
                        "development/research/onboarding/challenges/intermediate/cryptography",
                        "development/research/onboarding/challenges/intermediate/solidity",
                      ],
                    },
                    {
                      type: "category",
                      label: "DeFi",
                      items: [
                        "development/research/onboarding/challenges/defi/defi",
                      ],
                    },
                    {
                      type: "category",
                      label: "Core",
                      items: [
                        "development/research/onboarding/challenges/core/core",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Solidity",
          items: [
            "development/solidity/coding-style",
            "development/solidity/natspec",
            {
              type: "category",
              label: "Onboarding",
              items: [
                "development/solidity/onboarding/getting-started",
                "development/solidity/onboarding/knowledge-base",
                {
                  type: "category",
                  label: "Challenges",
                  items: [
                    "development/solidity/onboarding/challenges/overview",
                    "development/solidity/onboarding/challenges/swapper",
                    "development/solidity/onboarding/challenges/oracle-relayer",
                    "development/solidity/onboarding/challenges/flashloan",
                    "development/solidity/onboarding/challenges/security-challenges",
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Offchain",
          items: [
            "development/offchain/best-practices",
            "development/offchain/rpc-request",
            {
              type: "category",
              label: "Onboarding",
              items: [
                "development/offchain/onboarding/overview",
                "development/offchain/onboarding/knowledge-base",
                "development/offchain/onboarding/challenge",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Frontend",
          items: [
            "development/frontend/best-practices",
            {
              type: "category",
              label: "Onboarding",
              items: [
                "development/frontend/onboarding/overview",
                "development/frontend/onboarding/front-knowledge-base",
                "development/frontend/onboarding/frontend-dev-challenge",
              ],
            },
            {
              type: "category",
              label: "AI-Assisted Project Setup",
              items: [
                "development/frontend/ai-assisted-project-setup/overview",
                "development/frontend/ai-assisted-project-setup/tech-design",
                "development/frontend/ai-assisted-project-setup/ui-generation",
                "development/frontend/ai-assisted-project-setup/repo-scaffolding",
                "development/frontend/ai-assisted-project-setup/test",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "QA",
          items: [
            "development/qa/qa-overview",
            "development/qa/manual-testing-process",
            {
              type: "category",
              label: "Web3 E2E Automation",
              items: [
                "development/qa/web3-e2e-automation/overview",
                "development/qa/web3-e2e-automation/which-tests-should-be-automated",
                "development/qa/web3-e2e-automation/design-patterns",
                "development/qa/web3-e2e-automation/locator-strategies",
              ],
            },
            "development/qa/risk-based-testing",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Security",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "security/overview",
      },
      items: [
        "security/internal-reviews",
        {
          type: "category",
          label: "Multisig",
          items: [
            "security/multisig/hardware-requirements",
            "security/multisig/safe-config",
            "security/multisig/wallet-config",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Testing",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "testing/overview",
      },
      items: [
        "testing/unit-integration",
        "testing/mutation-testing",
        {
          type: "category",
          label: "Advanced Testing",
          items: [
            "testing/advanced-testing/overview",
            "testing/advanced-testing/property-based-fuzzing",
            "testing/advanced-testing/formal-verification",
            "testing/advanced-testing/invariants-writing",
          ],
        },
        "testing/campaign-processes",
      ],
    },
    "outro/contribute",
  ],
};

export default sidebars;
