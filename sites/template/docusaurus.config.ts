import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { merge } from "webpack-merge";
import commonConfig from "@handbook/common-config/preset/commonDocusaurusConfig";
import { DISCLAIMER_BUTTON_HTML } from "@handbook/common-config/config";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const localConfig: Config = {
  title: "Documentation",
  tagline:
    "A comprehensive guide to our project, processes, and best practices.",
  favicon: "common/img/favicon.svg",

  // Set the production url of your site here
  url: "https://your-domain.com/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "your-organization", // Usually your GitHub org/user name.
  projectName: "your-project", // Usually your repo name.

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
        alt: "Documentation",
        src: "img/logo.svg",
        style: { height: "100%", width: "auto" },
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
