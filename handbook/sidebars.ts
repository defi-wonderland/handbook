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
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro/welcome'],
    },
    {
      type: 'category',
      label: 'Processes',
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
      items: [
        'development/overview',
        {
          type: 'category',
          label: 'Frontend',
          items: [
            'development/frontend/best-practices',
            'development/frontend/onboarding',
          ],
        },
        {
          type: 'category',
          label: 'Offchain',
          items: [
            'development/offchain/best-practices',
            'development/offchain/onboarding',
          ],
        },
        {
          type: 'category',
          label: 'Research',
          items: [
            'development/research/onboarding',
            'development/research/technical-writing',
          ],
        },
        {
          type: 'category',
          label: 'Solidity',
          items: [
            'development/solidity/coding-style',
            'development/solidity/natspec',
            'development/solidity/onboarding/getting-started',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: [
        'security/overview',
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
      items: [
        'testing/overview',
        'testing/campaign-processes',
        'testing/unit-integration',
      ],
    },
    {
      type: 'category',
      label: 'Contribute',
      items: ['outro/contribute'],
    },
  ],
};

export default sidebars;

