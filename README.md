# Wonderland Handbook

This repository is a **monorepo** containing multiple Docusaurus-based handbooks for Wonderland. Each handbook serves as a central knowledge base for specific processes, guidelines, and best practices. The monorepo structure allows for shared configuration, assets, and tooling across all handbook sites.

## 🧪 Getting Started

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
pnpm --filter [name]-handbook dev              # Start the site locally
```

**Example with the Wonderland handbook:**

```bash
pnpm install
pnpm --filter wonderland-handbook build:assets
pnpm --filter wonderland-handbook dev
```

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Building for Production

To create a production build:

```bash
pnpm --filter [name]-handbook build
```

The static site will be generated in the `sites/[name]/build` directory.

---

## 🛠️ Creating a New Site

To create a new Docusaurus site in this monorepo:

1. **Create folder**: `sites/my-new-site`

2. **Add required files**:

   - `docusaurus.config.ts` → extend from `@common-config/preset/commonConfig`
   - `sidebars.ts` → even if minimal, must exist
   - `src/css/custom.css` → required by commonConfig, can be empty
   - `static/` → for site-specific assets (e.g. logos, images)
   - `.gitignore` → add `static/fonts/` and `static/img/` to avoid committing shared assets

3. **Install dependencies** (if needed):

   ```bash
   pnpm install
   ```

4. **Update workspace scripts**:
   Add a new entry in `sites/my-new-site/package.json`:
   ```json
   {
     "scripts": {
       "copy-static": "node ../../packages/common-config/dist/scripts/copyStaticTo.js static"
     }
   }
   ```

## Contributing

1. Create a new branch for your changes
2. Make your changes in the `handbook/docs` directory
3. If you add new folders or files, you must also update `sidebars.ts`:

- This file defines the sidebar navigation using [Docusaurus sidebar configuration](https://docusaurus.io/docs/sidebar).
- Add your new documents to the appropriate category, or create a new one as needed.

4. Test locally using `pnpm run start`
5. Submit a pull request

If you have any ideas for improving the handbook, feel free to open an issue (check the templates!) to start a discussion!
