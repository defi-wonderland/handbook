import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro/welcome',
    {
      type: 'category',
      label: 'Background',
      collapsible: false,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'background/overview',
      },
      items: [
        'background/notes',
        'background/UTXOs',
        'background/nullifiers',
        'background/zero-knowledge-proofs',
        'background/zk-circuits',
      ],
    },
    {
      type: 'category',
      label: 'Stack',
      collapsible: false,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'stack/overview',
      },
      items: [{ 
        type: 'category', label: 'Public State', items: [
          'stack/public-state/storage', 
          'stack/public-state/settlement', 
          'stack/public-state/avm'
        ] 
      },
      { 
        type: 'category', label: 'Private State', items: [
          'stack/private-state/pxe-and-notes', 
          'stack/private-state/private-kernel' 
        ] 
      },
      'stack/transaction-lifecycle',
      'stack/wrapping-up'
    ],
    },
    {
      type: 'category',
      label: 'Consensus / Block Productino',
      collapsible: false,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'consensus-block-production/overview',
      },
      items: [
        'consensus-block-production/sequencing',
        'consensus-block-production/proving',
        'consensus-block-production/fallback-mechanisms',
      ],
    },
  ],
};

export default sidebars;
