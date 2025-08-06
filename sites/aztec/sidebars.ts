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
  docs: [
    'intro/welcome',
    {
      type: 'category',
      label: 'Stack',
      link: {
        type: 'doc',
        id: 'intro/welcome',
      },
      items: [
        'intro/welcome',
      ],
    },
    {
      type: 'category',
      label: 'Interoperability',
      link: {
        type: 'doc',
        id: 'intro/welcome',
      },
      items: [
        'intro/welcome',
      ],
    },
    {
      type: 'category',
      label: 'Governance',
      link: {
        type: 'doc',
        id: 'intro/welcome',
      },
      items: [
        'intro/welcome',
      ],
    },
    {
      type: 'category',
      label: 'Processes',
      link: {
        type: 'doc',
        id: 'intro/welcome',
      },
      items: [
        'intro/welcome',
      ],
    },
  ],
};

export default sidebars;
