# Wonderland Handbook

This repository contains the Wonderland Handbook, a documentation site built with Docusaurus. The handbook serves as a central knowledge base for Wonderland's processes, guidelines, and best practices.

## Structure

- `handbook/` - Contains the Docusaurus website source code
  - `docs/` - Documentation content in Markdown format
  - `src/` - Custom React components and styles
  - `docusaurus.config.js` - Main Docusaurus configuration

## Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Local Development

From the monorepo root:

1. Install dependencies:
```bash
pnpm install
```

2. Build assets and start the development server:
```bash
pnpm --filter wonderland-handbook build:assets
pnpm --filter wonderland-handbook start
```

This will start a local development server and open your browser. Changes are reflected in real-time.

### Building for Production

To create a production build:

```bash
pnpm --filter wonderland-handbook build
```

The static site will be generated in the `sites/wonderland/build` directory.

### Deployment

The handbook is automatically deployed to Vercel when changes are pushed to the main branch.

## Contributing

### To the handbook:
1. Create a new branch for your changes
2. Make your changes in the `docs/` directory
3. If you add new folders or files, you must also update `sidebars.ts`:
  - This file defines the sidebar navigation using [Docusaurus sidebar configuration](https://docusaurus.io/docs/sidebar).
  - Add your new documents to the appropriate category, or create a new one as needed.
4. Test locally using `pnpm --filter wonderland-handbook start`
5. Submit a pull request

If you have any ideas for improving the handbook, feel free to open an issue (check the templates!) to start a discussion! 

### To the blog:

Add a new Markdown/MDX file under `sites/wonderland/blog/`.

- Frontmatter (at the top of the file):
  ```md
  ---
  title: Your post title
  description: One-sentence summary shown in previews
  authors:
    - key: lumi            # must exist in `blog/authors.yml`
  date: 2024-11-06         # ISO date; time optional
  image: /img/blog/slug/cover.png   # social/OG image
  tags: [topic1, topic2]   # optional
  ---
  ```
  - For multiple authors, use an array of `{ key }` objects. Example: `[{ key: lumi }, { key: shishigami }]`.
  - Author profiles live in `sites/wonderland/blog/authors.yml` (keys must match).

- Images:
  - Put post-specific images under `sites/wonderland/static/img/blog-posts-img/<slug>/`.
  - Reference them with absolute paths: `/img/blog-posts-img/<slug>/image.png`.
  - Recommended: a `cover.png` (1200×630) for social sharing via the `image` frontmatter.

- Naming:
  - Prefer date-prefixed filenames to keep chronology: `YYYY-MM-DD-<slug>.md(x)`.
  - The `<slug>` will become your URL segment. Keep it short, lowercase, and hyphenated.

- Content tips:
  - Use standard Markdown. Code blocks get Prism syntax highlighting (e.g. solidity, ts).
  - Headings create the right-hand table of contents automatically.
  - For math, LaTeX is supported via remark-math/rehype-katex.

- Local preview:
  ```bash
  pnpm --filter wonderland-handbook start
  ```

- PR checklist:
  - Nice to have: in your PR description, add a small thread about your article to share on Wonderland's twitter 🤍 Remember to include a small description about yourself. Reference [here](https://x.com/DeFi_Wonderland/status/1958612299859841473) and [here](https://x.com/DeFi_Wonderland/status/1958249234429575375).
  - Frontmatter present and valid.
  - Images placed in `static/img/blog-posts-img/<slug>/` and referenced with `/img/blog-posts-img/<slug>/...`.
  - Links work and code blocks render.
  - Authors exist in `blog/authors.yml` (or add them there).
