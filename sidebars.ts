import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

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
    'intro/welcome',
    {
      type: 'category',
      label: 'Processes',
      link: {
        type: 'doc',
        id: 'processes/overview'
      },
      items: [
        'processes/overview',
        'processes/project-lifecycle',
        {
          type: 'category',
          label: 'GitHub',
          items: [
            'processes/github/overview',
            'processes/github/git-environment', 
            'processes/github/git-practices',
            'processes/github/pr-guidelines',
            'processes/github/repo-readiness',
            'processes/github/ssh-setup',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Development',
      link: {
        type: 'doc',
        id: 'development/overview',
      },
      items: [
        'development/overview',
        {
          type: 'category',
          label: 'Research',
          items: [
            'development/research/overview',
            'development/research/technical-writing',
            {
              type: 'category',
              label: 'Onboarding',
              items: [
                'development/research/onboarding/overview',
                {
                  type: 'category',
                  label: 'Knowledge Base',
                  items: [
                    'development/research/onboarding/knowledge-base/overview',
                    {
                      type: 'category',
                      label: 'Basics',
                      items: [
                        'development/research/onboarding/knowledge-base/basics/tokenomics'
                      ]
                    },
                    {
                      type: 'category',
                      label: 'DeFi',
                      items: [
                        'development/research/onboarding/knowledge-base/defi/limit-order',
                        'development/research/onboarding/knowledge-base/defi/amm',
                        'development/research/onboarding/knowledge-base/defi/lending-protocol'
                      ]
                    },
                    {
                      type: 'category',
                      label: 'Intermediate',
                      items: [
                        'development/research/onboarding/knowledge-base/intermediate/solidity'
                      ]
                    }
                  ],
                },
                {
                  type: 'category',
                  label: 'Challenges',
                  items: [
                    'development/research/onboarding/challenges/overview',
                    {
                      type: 'category',
                      label: 'Basic',
                      items: [
                        'development/research/onboarding/challenges/basic/game-theory',
                        'development/research/onboarding/challenges/basic/tokenomics'
                      ]
                    },
                    {
                      type: 'category',
                      label: 'Intermediate',
                      items: [
                        'development/research/onboarding/challenges/intermediate/cryptography',
                        'development/research/onboarding/challenges/intermediate/solidity'
                      ]
                    },
                    {
                      type: 'category',
                      label: 'DeFi',
                      items: [
                        'development/research/onboarding/challenges/defi/defi'
                      ]
                    },
                    {
                      type: 'category',
                      label: 'Core',
                      items: [
                        'development/research/onboarding/challenges/core/core'
                      ]
                    }
                  ]
                }
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Solidity',
          items: [
            'development/solidity/coding-style',
            'development/solidity/natspec',
            {
              type: 'category',
              label: 'Onboarding',
              items: [
                'development/solidity/onboarding/getting-started',
                'development/solidity/onboarding/knowledge-base',
                {
                  type: 'category',
                  label: 'Challenges',
                  items: [
                    'development/solidity/onboarding/challenges/overview',
                    'development/solidity/onboarding/challenges/swapper',
                    'development/solidity/onboarding/challenges/oracle-relayer',
                    'development/solidity/onboarding/challenges/flashloan',
                    'development/solidity/onboarding/challenges/security-challenges',
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Offchain',
          items: [
            'development/offchain/best-practices',
            'development/offchain/rpc-request',
            {
              type: 'category',
              label: 'Onboarding',
              items: [
                'development/offchain/onboarding/overview',
                'development/offchain/onboarding/knowledge-base',
                'development/offchain/onboarding/challenge',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Frontend',
          items: [
            'development/frontend/best-practices',
            {
              type: 'category',
              label: 'Onboarding',
              items: [
                'development/frontend/onboarding/overview',
                'development/frontend/onboarding/front-knowledge-base',
                'development/frontend/onboarding/frontend-dev-challenge',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Security',
      link: {
        type: 'doc',
        id: 'security/overview'
      },
      items: [
        'security/internal-reviews',
        {
          type: 'category',
          label: 'Multisig',
          items: [
            'security/multisig/hardware-requirements',
            'security/multisig/safe-config',
            'security/multisig/wallet-config',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Testing',
      link: {
        type: 'doc',
        id: 'testing/overview'
      },
      items: [
        'testing/campaign-processes',
        'testing/unit-integration',
      ],
    },
    'outro/contribute',
  ],
};

export default sidebars;
