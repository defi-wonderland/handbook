import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { merge } from "webpack-merge";
import commonConfig from "@handbook/common-config/preset/commonDocusaurusConfig";

const localConfig: Config = {
  title: "Wonderland Handbook",
  tagline:
    "A curated guide to our best practices, processes, and technical insights.",
  favicon: "img/favicon.ico",

  url: "https://handbook.wonderland.xyz",
  baseUrl: "/",

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
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/defi-wonderland/handbook/tree/main/sites/wonderland",
          // Hide the default sidebar on blog list pages
          blogSidebarCount: 0,
          postsPerPage: 12,
          // Enable author pages (path relative to the blog directory)
          authorsMapPath: "authors.yml",
          authorsBasePath: "authors",
          // Force Docusaurus to use our custom author posts page component
          blogAuthorsPostsComponent: "@site/src/theme/BlogAuthorsPostsPage",
          // Enable math for blog MDX as posts contain formulas
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
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
    stylesheets: [
      {
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
        type: "text/css",
      },
    ],
    image: "img/wonderland-social-card.png",
    navbar: {
      logo: {
        alt: "Wonderland Handbook",
        src: "img/logo.svg",
        style: { height: "100%", width: "auto" },
      },
      style: "dark",
      items: [
        {
          to: "/blog",
          label: "Blog",
          position: "right",
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default merge(commonConfig, localConfig);
