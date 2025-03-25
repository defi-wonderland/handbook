# Wonderland Handbook

This repository contains the Wonderland Handbook, a documentation site built with Docusaurus. The handbook serves as a central knowledge base for Wonderland's processes, guidelines, and best practices.

## Structure

- `handbook/` - Contains the Docusaurus website source code
  - `docs/` - Documentation content in Markdown format
  - `src/` - Custom React components and styles
  - `docusaurus.config.js` - Main Docusaurus configuration

## Development

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager

### Local Development

1. Install dependencies:
```bash
cd handbook
npm i
```

2. Start the development server:
```bash
npm run start
```

This will start a local development server and open your browser. Changes are reflected in real-time.

### Building for Production

To create a production build:

```bash
cd handbook
npm run build
```

The static site will be generated in the `handbook/build` directory.

### Deployment

The handbook is automatically deployed to Vercel when changes are pushed to the main branch.

## Contributing

1. Create a new branch for your changes
2. Make your changes in the `handbook/docs` directory
3. Test locally using `npm run start`
4. Submit a pull request