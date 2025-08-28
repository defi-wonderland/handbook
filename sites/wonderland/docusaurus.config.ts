import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { merge } from "webpack-merge";
import commonConfig from "@handbook/common-config/preset/commonDocusaurusConfig";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const localConfig: Config = {
  title: "Wonderland Handbook",
  tagline:
    "A curated guide to our best practices, processes, and technical insights.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://handbook.wonderland.xyz",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "defi-wonderland", // Usually your GitHub org/user name.
  projectName: "handbook", // Usually your repo name.

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the 'edit this page' links.
          editUrl: "https://github.com/defi-wonderland/handbook/tree/main/sites/wonderland",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: [
            "./src/css/local.css",
            "./static/common/styles/global.css",
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    image: "img/wonderland-social-card.png",
    navbar: {
      logo: {
        alt: "Wonderland Handbook",
        src: "img/logo.svg",
        style: { height: "100%", width: "auto" },
      },
      style: "dark",
      items: [],
    },
    mermaid: {
      theme: { light: 'base', dark: 'dark' },
      options: {
        theme: 'dark',
        themeVariables: {
          // Primary colors matching Wonderland theme
          primaryColor: '#1f55d5',        // --wonderland-blue
          primaryBorderColor: '#3c2a86',  // --wonderland-purple
          lineColor: '#a371ce',           // --wonderland-lila
          
          // Secondary colors
          secondaryColor: '#a371ce',      // --wonderland-lila
          tertiaryColor: '#978cfb',       // --wonderland-accent
          
          // Background colors
          background: '#0e152c',          // --wonderland-dark
          mainBkg: '#1c1f37',             // --wonderland-light
          secondBkg: '#283c7d',           // --wonderland-blue-700
          tertiaryBkg: '#4359a1',         // --wonderland-blue-600
          
          // Text colors
          textColor: '#f9f9fb',           // --wonderland-gray-50
          primaryTextColor: '#ffffff',
          secondaryTextColor: '#b9c0d4',  // --wonderland-gray-300
          
          // Node colors for sequence diagrams
          actor0: '#978cfb',              // --wonderland-accent (sidebar purple)
          actor1: '#978cfb',              // --wonderland-accent (sidebar purple)  
          actor2: '#978cfb',              // --wonderland-accent (sidebar purple)
          actor3: '#978cfb',              // --wonderland-accent (sidebar purple)
          actorBkg0: '#978cfb',
          actorBkg1: '#978cfb',
          actorBkg2: '#978cfb', 
          actorBkg3: '#978cfb',
          actorTextColor0: '#ffffff',
          actorTextColor1: '#ffffff',
          actorTextColor2: '#ffffff',
          actorTextColor3: '#ffffff',
          actorLineColor0: '#516dc9',     // --wonderland-blue-500
          actorLineColor1: '#4359a1',     // --wonderland-blue-600
          actorLineColor2: '#a371ce',
          actorLineColor3: '#978cfb',
          
          // Activation box colors
          activationBkgColor: '#283c7d',   // --wonderland-blue-700
          activationBorderColor: '#a371ce',// --wonderland-lila
          
          // Sequence numbers
          sequenceNumberColor: '#ffffff',
          
          // Notes
          noteBkgColor: '#404968',         // --wonderland-gray-700
          noteTextColor: '#ffffff',
          noteBorderColor: '#a371ce',      // --wonderland-lila
          
          // Loop/alt/opt colors  
          loopTextColor: '#ffffff',
          altTextColor: '#ffffff',
          optTextColor: '#ffffff',
          
          // Arrows
          arrowheadColor: '#a371ce',       // --wonderland-lila
          
          // Git/flowchart specific
          git0: '#1f55d5',                 // --wonderland-blue
          git1: '#3c2a86',                 // --wonderland-purple
          git2: '#a371ce',                 // --wonderland-lila  
          git3: '#978cfb',                 // --wonderland-accent
          git4: '#e95b9b',                 // --wonderland-pink
          git5: '#fecc40',                 // --wonderland-yellow
          git6: '#516dc9',                 // --wonderland-blue-500
          git7: '#7d89b0',                 // --wonderland-gray-400
          
          // Flowchart colors
          fillType0: '#1f55d5',
          fillType1: '#3c2a86', 
          fillType2: '#a371ce',
          fillType3: '#978cfb',
          fillType4: '#e95b9b',
          fillType5: '#fecc40',
          fillType6: '#516dc9',
          fillType7: '#7d89b0',
        }
      }
    },
  } satisfies Preset.ThemeConfig,
};

export default merge(commonConfig, localConfig);
