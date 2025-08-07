import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { merge } from "webpack-merge";
import commonConfig from "@handbook/common-config/preset/commonDocusaurusConfig";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const localConfig: Config = {
  title: "Aztec Handbook",
  tagline: "The Wonderland Onboarding to Aztec",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://aztec.handbook.wonderland.xyz",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  organizationName: "defi-wonderland",
  projectName: "aztec-handbook",

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/defi-wonderland/handbook/tree/main/sites/aztec",
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
    image: "img/aztec-social-card.jpg",
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
          value:
            '<style>#disclaimer-btn::before { content: ""; width: 16px; height: 16px; background-image: url("/common/img/icons/information-circle.svg"); background-size: contain; background-repeat: no-repeat; margin-right: 8px; } #disclaimer-btn:hover { color: #d1d5db; } @media (max-width: 996px) { #disclaimer-btn { display: none !important; } }</style><button id="disclaimer-btn" style="background: none; border: none; color: #5D6B98; cursor: pointer; margin-left: 8px; display: flex; align-items: center; font-size: 14px; font-family: inherit; transition: color 0.2s ease;">Disclaimer</button>',
        },
      ],
      hideOnScroll: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default merge(commonConfig, localConfig);
