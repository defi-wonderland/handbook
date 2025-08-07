# Aztec Handbook by Wonderland

This repository contains the Onboarding to Aztec by Wonderland, a documentation site built with Docusaurus. The handbook serves as a central knowledge base for the researchers, devs and architects involved in the protocol.

## Structure

- `docs/` - Documentation content in Markdown format
- `src/` - Custom React components and styles
- `static/` - Static assets (images, fonts, etc.)
  - `common/` - Shared assets from the monorepo (gitignored)
- `docusaurus.config.ts` - Main Docusaurus configuration
- `sidebars.ts` - Indexer for the docs

## Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Local Development

From the root of the monorepo:

1. Install dependencies:

```bash
pnpm install
```

2. Build common assets and start the development server:

```bash
pnpm --filter aztec-handbook build:assets
pnpm --filter aztec-handbook start
```

This will start a local development server and open your browser. Changes are reflected in real-time.

### Building for Production

To create a production build:

```bash
pnpm --filter aztec-handbook build
```

The static site will be generated in the `sites/aztec/build` directory.

### Deployment

The handbook is automatically deployed to Vercel when changes are pushed to the main branch.

## Contributing

1. Create a new branch for your changes
2. Make your changes in the `sites/aztec/docs` directory
3. If you add new folders or files, you must also update `sidebars.ts`:

- This file defines the sidebar navigation using [Docusaurus sidebar configuration](https://docusaurus.io/docs/sidebar).
- Add your new documents to the appropriate category, or create a new one as needed.

4. Test locally using `pnpm --filter aztec-handbook start`
5. Submit a pull request

If you have any ideas for improving the handbook, feel free to open an issue (check the templates!) to start a discussion!
