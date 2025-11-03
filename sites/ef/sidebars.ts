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
      label: 'WALLET',
      collapsible: false,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'wallet/what-is',
      },
      items: [
        {
          type: 'doc',
          id: 'wallet/what-is',
          label: 'What is a wallet, really',
        },
        {
          type: 'doc',
          id: 'wallet/mechanisms',
          label: 'Understanding wallet mechanisms',
        },
        {
          type: 'doc',
          id: 'wallet/mnemonic',
          label: 'On words and keys, a guide to Mnemonic Phrases',
        },
        {
          type: 'doc',
          id: 'wallet/security',
          label: 'Mapping the derivation attack surface',
        },
        {
          type: 'doc',
          id: 'wallet/problem-frame',
          label: 'Framing the seed problem',
        },
        {
          type: 'doc',
          id: 'wallet/signature-derivation',
          label: 'Deriving secrets from signatures',
        },
        {
          type: 'doc',
          id: 'wallet/hardware-derivation',
          label: 'The endgame, hardware native derivation',
        },
      ],
    },
    {
      type: 'category',
      label: 'PRIVACY POOLS',
      collapsible: false,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'privacy-pools/privacy-by-default',
      },
      items: [
        {
          type: 'doc',
          id: 'privacy-pools/privacy-by-default',
          label: 'Privacy by default',
        },
      ],
    },
  ],
};

export default sidebars;
