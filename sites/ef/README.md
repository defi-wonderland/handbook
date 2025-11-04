# Docusaurus Documentation Template

This is a template for creating new Docusaurus documentation sites within the handbook monorepo.

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Setup

1. Create a new site from the monorepo root:
```bash
pnpm create-handbook your-new-site
cd sites/your-new-site
```

2. Install dependencies (from monorepo root):
```bash
pnpm install
```

3. Build assets and start development:
```bash
pnpm --filter your-new-site build:assets
pnpm --filter your-new-site start
```

### Building for Production

```bash
pnpm --filter your-new-site build
```

## Customization

1. **Update Configuration**: Edit `docusaurus.config.ts` with your project details
2. **Add Content**: Replace content in `docs/` directory
3. **Update Sidebar**: Modify `sidebars.ts` to match your structure
4. **Add Images**: Place images in `static/img/`

## Project Structure

```
├── docs/           # Documentation content
├── src/            # Custom components and styles
├── static/         # Static assets
├── docusaurus.config.ts
└── sidebars.ts
```

## Deployment

Configure deployment in your hosting platform of choice (Vercel, Netlify, etc.). 