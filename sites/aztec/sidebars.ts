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
        'background/overview',
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
      items: [
        'stack/overview',
      ],
    },
    {
      type: 'category',
      label: 'Transactions',
      collapsible: false,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'transactions-messaging/overview',
      },
      items: [
        'transactions-messaging/overview',
      ],
    },
    {
      type: 'category',
      label: 'Governance',
      collapsible: false,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'governance/overview',
      },
      items: [
        'governance/overview',
      ],
    },
    {
      type: 'category',
      label: 'Privacy',
      collapsible: false,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'privacy/overview',
      },
      items: [
        'privacy/overview',
      ],
    },
  ],
};

export default sidebars;
