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
      className: 'sidebar-category',
      items: [
        'intro/welcome'
      ]
    },
    {
      type: 'category',
      label: 'Development',
      className: 'sidebar-category',
      items: [
        'development/overview',
        {
          type: 'category',
          label: 'Frontend',
          className: 'sidebar-category',
          items: [
            'development/frontend/overview',
            'development/frontend/best-practices',
            'development/frontend/onboarding'
          ]
        },
        {
          type: 'category',
          label: 'Solidity',
          className: 'sidebar-category',
          items: [
            'development/solidity/overview',
            'development/solidity/coding-style',
            'development/solidity/natspec',
            'development/solidity/onboarding/getting-started'
          ]
        },
        {
          type: 'category',
          label: 'Offchain',
          className: 'sidebar-category',
          items: [
            'development/offchain/overview',
            'development/offchain/best-practices',
            'development/offchain/onboarding'
          ]
        },
        {
          type: 'category',
          label: 'Research',
          className: 'sidebar-category',
          items: [
            'development/research/overview',
            'development/research/technical-writing',
            'development/research/onboarding'
          ]
        },
        {
          type: 'category',
          label: 'Processes',
          className: 'sidebar-category',
          items: [
            'development/processes/overview',
            'development/processes/project-lifecycle',
            'development/processes/github',
            'development/processes/git-practices'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Security',
      className: 'sidebar-category',
      items: [
        'security/internal-reviews',
        {
          type: 'category',
          label: 'Multisig',
          className: 'sidebar-category',
          items: [
            'security/multisig/hardware-requirements',
            'security/multisig/wallet-config',
            'security/multisig/safe-config'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Testing',
      className: 'sidebar-category',
      items: [
        'testing/unit-integration',
        'testing/campaign-processes'
      ]
    }
  ]
};

export default sidebars;
