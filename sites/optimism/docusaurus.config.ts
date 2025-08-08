import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { merge } from "webpack-merge";
import commonConfig from "@handbook/common-config/preset/commonDocusaurusConfig";
import { DISCLAIMER_BUTTON_HTML } from "@handbook/common-config/config";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const localConfig: Config = {
  title: "OP Handbook",
  tagline: "The Wonderland Onboarding to Optimism",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://optimism.handbook.wonderland.xyz",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  organizationName: "defi-wonderland",
  projectName: "op-handbook",

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/defi-wonderland/handbook/tree/main/sites/optimism",
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
    image: "img/op-social-card.jpg",
    navbar: {
      title: "",
      logo: {
        alt: "OP Handbook",
        src: "common/img/wonderland-op-navbar-logo.svg",
        srcDark: "common/img/wonderland-op-navbar-logo.svg",
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
