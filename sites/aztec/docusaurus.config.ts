import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { merge } from "webpack-merge";
import commonConfig from "@handbook/common-config/preset/commonDocusaurusConfig";
import { DISCLAIMER_BUTTON_HTML } from "@handbook/common-config/config";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const localConfig: Config = {
  title: "Aztec Handbook",
  tagline: "The Wonderland Onboarding to Aztec",
  favicon: "common/img/favicon.svg",

  // Set the production url of your site here
  url: "https://aztec.handbook.wonderland.xyz",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  organizationName: "defi-wonderland",
  projectName: "aztec-handbook",

  markdown: {
      mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/common/img/favicon.svg',
        sizes: 'any'
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        href: '/common/img/favicon.ico',
        sizes: '64x64'
      }
    }
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/defi-wonderland/handbook/tree/main/sites/aztec",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
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

  themeConfig: {
    image: "img/social-card.png",
    navbar: {
      title: "",
      logo: {
        alt: "Aztec Handbook",
        src: "common/img/wonderland-aztec-navbar-logo.svg",
        srcDark: "common/img/wonderland-aztec-navbar-logo.svg",
        style: { height: "100%", width: "auto" },
      },
      items: [
        {
          type: "html",
          position: "right",
          value: DISCLAIMER_BUTTON_HTML,
        },
      ],
      hideOnScroll: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default merge(commonConfig, localConfig);
