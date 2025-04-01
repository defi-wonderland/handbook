import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import path from 'path';
import fs from 'fs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Wonderland Handbook',
  tagline:
    'A curated guide to our best practices, processes, and technical insights.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://wonderland-handbook.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'defi-wonderland', // Usually your GitHub org/user name.
  projectName: 'handbook', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace 'en' with 'zh-Hans'.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the 'edit this page' links.
          editUrl: 'https://github.com/defi-wonderland/handbook/tree/main/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    // Replace with your project's social card
    image: 'img/wonderland-social-card.png',
    navbar: {
      logo: {
        alt: 'Wonderland Handbook',
        src: 'img/logo.svg',
        style: { height: '100%', width: 'auto' },
        className: 'navbar-logo-center',
      },
      style: 'dark',
      items: [],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Wonderland.`,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    async function llmsTxtPlugin(context) {
      return {
        name: 'llms-txt-plugin',
        loadContent: async () => {
          const { siteDir } = context;
          const contentDir = path.join(siteDir, 'docs');
          const allMdx: string[] = [];
          const docsRecords: {
            title: string;
            path: string;
            description: string;
          }[] = [];

          const getMdxFiles = async (
            dir: string,
            relativePath: string = '',
            depth: number = 0
          ) => {
            const entries = await fs.promises.readdir(dir, {
              withFileTypes: true,
            });

            entries.sort((a, b) => {
              if (a.isDirectory() && !b.isDirectory()) return -1;
              if (!a.isDirectory() && b.isDirectory()) return 1;
              return a.name.localeCompare(b.name);
            });

            for (const entry of entries) {
              const fullPath = path.join(dir, entry.name);
              const currentRelativePath = path.join(relativePath, entry.name);

              if (entry.isDirectory()) {
                const dirName = entry.name
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                const headingLevel = '#'.repeat(depth + 2);
                allMdx.push(`\n${headingLevel} ${dirName}\n`);
                await getMdxFiles(fullPath, currentRelativePath, depth + 1);
              } else if (entry.name.endsWith('.md')) {
                const content = await fs.promises.readFile(fullPath, 'utf8');
                let title = entry.name.replace('.md', '');
                let description = '';

                const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
                if (frontmatterMatch) {
                  const titleMatch = frontmatterMatch[1].match(/title:\s*(.+)/);
                  const descriptionMatch =
                    frontmatterMatch[1].match(/description:\s*(.+)/);

                  if (titleMatch) {
                    title = titleMatch[1].trim();
                  }
                  if (descriptionMatch) {
                    description = descriptionMatch[1].trim();
                  }
                }

                const headingLevel = '#'.repeat(depth + 3);
                allMdx.push(`\n${headingLevel} ${title}\n\n${content}`);

                // Add to docs records for llms.txt
                docsRecords.push({
                  title,
                  path: currentRelativePath.replace(/\\/g, '/'),
                  description,
                });
              }
            }
          };

          await getMdxFiles(contentDir);
          return { allMdx, docsRecords };
        },
        postBuild: async ({ content, outDir, routes }) => {
          const { allMdx, docsRecords } = content as {
            allMdx: string[];
            docsRecords: { title: string; path: string; description: string }[];
          };

          // Write concatenated MDX content
          const concatenatedPath = path.join(outDir, 'llms-full.txt');
          await fs.promises.writeFile(
            concatenatedPath,
            allMdx.join('\n\n---\n\n')
          );

          // Create llms.txt with the requested format
          const llmsTxt = `# ${
            context.siteConfig.title
          }\n\n## Documentation\n\n${docsRecords
            .map(
              (doc) =>
                `- [${doc.title}](${
                  context.siteConfig.url
                }/docs/${doc.path.replace('.md', '')}): ${doc.description}`
            )
            .join('\n')}`;
          const llmsTxtPath = path.join(outDir, 'llms.txt');
          await fs.promises.writeFile(llmsTxtPath, llmsTxt);
        },
      };
    },
  ],
};

export default config;
