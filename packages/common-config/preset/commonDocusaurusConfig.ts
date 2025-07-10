import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";
import llmsTxtPlugin from "../plugins/llmsTxtPlugin";

const commonDocusaurusConfig: Partial<Config> = {
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace 'en' with 'zh-Hans'.
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],
  plugins: ["docusaurus-lunr-search", "vercel-analytics", llmsTxtPlugin],
  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      logo: {
        alt: "Wonderland Handbook",
        src: "img/logo.svg",
        style: { height: "100%", width: "auto" },
      },
      style: "dark",
      items: [
        {
          type: "dropdown",
          label: "Handbooks",
          position: "right",
          items: [
            {
              label: "Wonderland",
              to: "https://handbook.wonderland.xyz",
            },
            {
              label: "Optimism",
              to: "https://handbook.wonderland.xyz/optimism",
            },
            // // TODO: Enable when Aztec handbook is ready
            // // TODO: Remember to add the rewrite in vercel.json!
            // {
            //   label: "Aztec",
            //   to: "https://handbook.wonderland.xyz/aztec",
            //   target: "_blank",
            //   rel: "noopener noreferrer",
            // },
          ],
        },
        {
          to: "https://wonderland.xyz",
          position: "right",
          label: "Wonderland.xyz",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          html: '<a href="https://x.com/defi_wonderland" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; color: white; text-decoration: none;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><g clip-path="url(#a)"><path fill="white" d="M14.095 10.317 22.286 1h-1.94L13.23 9.088 7.552 1H1l8.59 12.231L1 23h1.94l7.51-8.543L16.448 23H23M3.64 2.432h2.982l13.723 19.207h-2.982"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg></a>',
        },
        {
          html: '<a href="https://github.com/defi-wonderland" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; color: white; text-decoration: none;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><g clip-path="url(#a)"><g clip-path="url(#b)"><path fill="white" d="M12.012 2.036a9.868 9.868 0 0 0-6.488 2.437 10.295 10.295 0 0 0-3.395 6.159c-.38 2.4.087 4.861 1.318 6.941a10.048 10.048 0 0 0 5.402 4.41c.497.094.682-.226.682-.496v-1.742c-2.782.629-3.37-1.37-3.37-1.37a2.733 2.733 0 0 0-1.113-1.5c-.903-.63.074-.63.074-.63.317.045.619.164.884.347.265.183.486.425.645.709.204.38.515.689.891.888a2.091 2.091 0 0 0 2.02-.033 2.192 2.192 0 0 1 .614-1.37c-2.223-.258-4.556-1.137-4.556-5.058a4.012 4.012 0 0 1 1.025-2.745c-.3-.884-.266-1.85.098-2.709 0 0 .842-.276 2.751 1.049 1.64-.46 3.37-.46 5.01 0 1.91-1.325 2.746-1.049 2.746-1.049.368.857.405 1.825.105 2.709a4.012 4.012 0 0 1 1.025 2.745c0 3.934-2.34 4.794-4.568 5.026a2.466 2.466 0 0 1 .681 1.885v2.809c0 .334.178.591.688.496a10.05 10.05 0 0 0 5.381-4.416 10.435 10.435 0 0 0 1.308-6.93 10.302 10.302 0 0 0-3.386-6.15A9.875 9.875 0 0 0 12.013 2v.037l-.001-.001Z"/></g></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath><clipPath id="b"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg></a>',
        },
      ],
      copyright: `© ${new Date().getFullYear()}. Wonder LTD. All Rights Reserved`,
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
      // Available languages: https://github.com/PrismJS/prism/tree/master/components
      // Default list: languagesToBundle - https://github.com/FormidableLabs/prism-react-renderer/blob/master/packages/generate-prism-languages/index.ts#L9-L26
      additionalLanguages: ["solidity", "bash", "mermaid", "java", "nasm"],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  },
};

export default commonDocusaurusConfig;
