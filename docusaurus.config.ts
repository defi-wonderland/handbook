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
  url: 'https://wonderland-handbook.vercel.app/',
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

          // recursive function to get all mdx files with their paths
          const getMdxFiles = async (
            dir: string,
            relativePath: string = '',
            depth: number = 0
          ) => {
            const entries = await fs.promises.readdir(dir, {
              withFileTypes: true,
            });

            // Sort entries to ensure consistent order
            entries.sort((a, b) => {
              // Directories come first
              if (a.isDirectory() && !b.isDirectory()) return -1;
              if (!a.isDirectory() && b.isDirectory()) return 1;
              // Then sort alphabetically
              return a.name.localeCompare(b.name);
            });

            for (const entry of entries) {
              const fullPath = path.join(dir, entry.name);
              const currentRelativePath = path.join(relativePath, entry.name);

              if (entry.isDirectory()) {
                // Add directory as a header with proper nesting level
                const dirName = entry.name
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                const headingLevel = '#'.repeat(depth + 2); // Start with ## for root folders
                allMdx.push(`\n${headingLevel} ${dirName}\n`);
                await getMdxFiles(fullPath, currentRelativePath, depth + 1);
              } else if (entry.name.endsWith('.md')) {
                // Read the file content
                const content = await fs.promises.readFile(fullPath, 'utf8');

                // Extract title from frontmatter if it exists
                let title = entry.name.replace('.md', '');
                const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
                if (frontmatterMatch) {
                  const titleMatch = frontmatterMatch[1].match(/title:\s*(.+)/);
                  if (titleMatch) {
                    title = titleMatch[1].trim();
                  }
                }

                // Add the file with its title and proper nesting level
                const headingLevel = '#'.repeat(depth + 3); // Files are one level deeper than their folder
                allMdx.push(`\n${headingLevel} ${title}\n\n${content}`);
              }
            }
          };

          await getMdxFiles(contentDir);
          return { allMdx };
        },
        postBuild: async ({ content, routes, outDir }) => {
          const { allMdx } = content as { allMdx: string[] };

          // Write concatenated MDX content with proper spacing
          const concatenatedPath = path.join(outDir, 'llms-full.txt');
          await fs.promises.writeFile(
            concatenatedPath,
            allMdx.join('\n\n---\n\n')
          );

          // Find the docs plugin route
          const docsPluginRoute = routes.find(
            (route) => route.plugin?.name === 'docusaurus-plugin-content-docs'
          );

          if (!docsPluginRoute?.routes) {
            console.warn('No docs routes found');
            return;
          }

          // Find the root docs route
          const rootDocsRoute = docsPluginRoute.routes.find(
            (route) => route.path === '/'
          );

          if (!rootDocsRoute?.props?.version) {
            console.warn('No version found in docs route');
            return;
          }

          const version = rootDocsRoute.props.version as {
            docs?: Record<string, { title: string; description?: string }>;
          };

          if (!version.docs) {
            console.warn('No docs found in version');
            return;
          }

          // Create docs records
          const docsRecords = Object.entries(version.docs).map(
            ([docPath, doc]) => {
              const description = doc.description || '';
              return `- [${doc.title}](${docPath}): ${description}`;
            }
          );

          // Build up llms.txt file
          const llmsTxt = `# ${
            context.siteConfig.title
          }\n\n## Docs\n\n${docsRecords.join('\n')}`;

          // Write llms.txt file
          const llmsTxtPath = path.join(outDir, 'llms.txt');
          await fs.promises.writeFile(llmsTxtPath, llmsTxt);
        },
      };
    },
  ],
};

export default config;
