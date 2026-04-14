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
      label: 'KOHAKU',
      collapsible: false,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'kohaku/overview',
      },
      items: [
        {
          type: 'category',
          label: 'Security & Trust Assumptions',
          collapsible: true,
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'kohaku/trustless-rpc',
              label: 'Trustless RPC',
            },
            {
              type: 'doc',
              id: 'kohaku/relayers',
              label: 'Relayers',
            },
            {
              type: 'doc',
              id: 'kohaku/account-abstraction',
              label: 'Account abstraction',
            },
          ],
        },
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
            {
              type: 'doc',
              id: 'privacy-pools/pp-overview',
              label: 'Privacy Pools overview',
            },
            {
              type: 'doc',
              id: 'privacy-pools/notes',
              label: 'Anatomy of a note',
            },
      
            {
              type: 'doc',
              id: 'privacy-pools/batch-withdrawal',
              label: 'Batch withdrawal',
            },
            {
              type: 'doc',
              id: 'privacy-pools/note-selection-algorithm',
              label: 'Note selection algorithm',
            },
            {
              type: 'doc',
              id: 'privacy-pools/the-proof',
              label: 'The proof',
            }
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'INTEROP',
      collapsible: false,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'interop/intro-interop',
      },
      items: [
        {
          type: 'doc',
          id: 'interop/chain-specific-addresses',
          label: 'Chain-specific addresses',
        },
        {
          type: 'doc',
          id: 'interop/open-intents',
          label: 'Open Intents and cross-chain interoperability',
        },
        {
          type: 'category',
          label: 'DEEP DIVES',
          collapsible: false,
          collapsed: false,
          link: {
            type: 'doc',
            id: 'interop/deep-dives',
          },
          items: [
            {
              type: 'doc',
              id: 'interop/erc-5792-eip-7702',
              label: 'ERC-5792 and EIP-7702: wallet communication',
            },
            {
              type: 'doc',
              id: 'interop/cross-chain-token-standards',
              label: 'Cross-chain token standards and ERC-7786',
            },
          ],
        },
        {
          type: 'category',
          label: 'A FRAMEWORK FOR STANDARD ADOPTION',
          collapsible: false,
          collapsed: false,
          link: {
            type: 'doc',
            id: 'interop/framework-standard-adoption',
          },
          items: [
            {
              type: 'doc',
              id: 'interop/framework-standard-adoption',
              label: 'The framework',
            },
          ],
        },
        {
          type: 'category',
          label: 'APPENDIX',
          collapsible: false,
          collapsed: false,
          link: {
            type: 'doc',
            id: 'interop/glossary',
          },
          items: [
            {
              type: 'doc',
              id: 'interop/glossary',
              label: 'Glossary',
            },
          ],
        },
      ],
    },
  ],
};

export default sidebars;
