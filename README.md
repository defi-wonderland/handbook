# Wonderland Handbook

This repository is a **monorepo** containing multiple Docusaurus-based handbooks for Wonderland. Each handbook serves as a central knowledge base for specific processes, guidelines, and best practices. The monorepo structure allows for shared configuration, assets, and tooling across all handbook sites.

## 🧪 Getting Started

### Node.js Version Management

This monorepo enforces Node.js 22.19.0 and pnpm 10.11.0. Use `.nvmrc` for version management:

```bash
nvm use
```

The monorepo uses a shared configuration system where common assets (fonts, styles, images) and configurations are centralized in the `packages/common-config` package. After installation, you'll need to build these common files and copy them to your specific handbook site.

The build process works as follows:

1. **Install dependencies** across all packages and sites
2. **Build common files** from the shared configuration package
3. **Copy shared assets** to the target site's `static/common/` directory (this directory is gitignored)
4. **Start the development server** for your handbook

Note: Each site can have its own static assets (like site-specific images or documents) placed directly in the `static/` directory, outside of the `common/` folder.

From the root of the monorepo:

```bash
pnpm install                                   # Install all dependencies across packages/sites
pnpm --filter [name]-handbook build:assets     # Build common files, and copy them into the specific site
pnpm --filter [name]-handbook start              # Start the site locally
```

**Example with the Wonderland handbook:**

```bash
pnpm install
pnpm --filter wonderland-handbook build:assets
pnpm --filter wonderland-handbook start
```

### Prerequisites

- Node.js (v22.19.0) - Use `.nvmrc` for version management
- pnpm package manager (v10.11.0)

### Building for Production

To create a production build:

```bash
pnpm --filter [name]-handbook build
```

The static site will be generated in the `sites/[name]/build` directory.

---

## 🛠️ Creating a New Site

To create a new handbook site from the template:

```bash
pnpm create-handbook <site-name>
```

This will:
1. Create a new site in `sites/<site-name>` based on the template
2. Update the package.json with the correct site name
3. Set up all necessary configurations

**Example:**
```bash
pnpm create-handbook my-new-handbook
```

After creation, you can build and start the new site:
```bash
cd sites/my-new-handbook
pnpm build:assets
pnpm start
```

**Note:** Site names can only contain letters, numbers, hyphens, and underscores.

## Contributing

1. Create a new branch for your changes
2. Make your changes in the `handbook/docs` directory
3. If you add new folders or files, you must also update `sidebars.ts`:

- This file defines the sidebar navigation using [Docusaurus sidebar configuration](https://docusaurus.io/docs/sidebar).
- Add your new documents to the appropriate category, or create a new one as needed.

4. Test locally using `pnpm run start`
5. Submit a pull request

If you have any ideas for improving the handbook, feel free to open an issue (check the templates!) to start a discussion!
