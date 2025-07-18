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

1. Create a new branch for your changes
2. Make your changes in the `docs/` directory
3. If you add new folders or files, you must also update `sidebars.ts`:
  - This file defines the sidebar navigation using [Docusaurus sidebar configuration](https://docusaurus.io/docs/sidebar).
  - Add your new documents to the appropriate category, or create a new one as needed.
4. Test locally using `pnpm --filter wonderland-handbook start`
5. Submit a pull request

If you have any ideas for improving the handbook, feel free to open an issue (check the templates!) to start a discussion! 