import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { merge } from "webpack-merge";
import commonConfig from "@handbook/common-config/preset/commonDocusaurusConfig";
import { DISCLAIMER_BUTTON_HTML } from "@handbook/common-config/config";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const localConfig: Config = {
  title: "Aerodrome Handbook",
  tagline:
    "The Wonderland Onboarding to Aerodrome",
  favicon: "common/img/favicon.svg",

  // Set the production url of your site here
  url: "https://your-domain.com/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "defi-wonderland", // Usually your GitHub org/user name.
  projectName: "handbook", // Usually your repo name.

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
          // Please change this to your repo.
          // Remove this to remove the 'edit this page' links.
          editUrl: "https://github.com/defi-wonderland/handbook/tree/main/sites/template",
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

  themeConfig: {
    image: "img/social-card.png",
    navbar: {
      logo: {
        alt: "Aerodrome Handbook",
        src: "img/chip.svg",
        srcDark: "img/chip.svg",
        style: { height: "30px", width: "auto" },
      },
      style: "dark",
      items: [
        {
          to: "https://your-website.com",
          position: "right",
          label: "Website",
        },
        {
          type: "html",
          position: "right",
          value: DISCLAIMER_BUTTON_HTML,
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default merge(commonConfig, localConfig);
