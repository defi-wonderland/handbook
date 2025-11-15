import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { merge } from "webpack-merge";
import { themes as prismThemes } from "prism-react-renderer";
import commonConfig from "@handbook/common-config/preset/commonDocusaurusConfig";
import { DISCLAIMER_BUTTON_HTML } from "@handbook/common-config/config";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const localConfig: Config = {
  title: "Ethereum Foundation Handbook",
  tagline:
    "A comprehensive guide to our project, processes, and best practices.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://ef.handbook.wonderland.xyz",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "defi-wonderland",
  projectName: "ef-handbook",

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "docs",
          // Please change this to your repo.
          // Remove this to remove the 'edit this page' links.
          editUrl: "https://github.com/defi-wonderland/handbook/tree/main/sites/ef",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: [
            "./static/common/styles/global.css",
            "./src/css/local.css",
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
    image: "img/social-card.png",
    navbar: {
      logo: {
        alt: "Documentation",
        src: "img/wonderland-ef-navbar-logo.svg",
        style: { height: "100%", width: "auto" },
      },
      style: "dark",
      items: [
        {
          type: "html",
          position: "right",
          value: DISCLAIMER_BUTTON_HTML,
        },
      ],
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ["solidity", "bash", "mermaid", "java", "nasm"],
    },
    mermaid: {
      theme: { light: 'base', dark: 'dark' },
      options: {
        theme: 'dark',
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default merge(commonConfig, localConfig);
