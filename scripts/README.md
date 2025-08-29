# Handbook Scripts

Scripts for creating new handbook repos and copying shared static assets.

- `create-handbook.ts`: Create a new handbook site from template.
- `copyStaticTo.ts`: Copy shared static assets to a handbook site.

## Authors Generation

Generate `authors.yml` for the Wonderland site from the web repo's squad JSON.

Usage:

```bash
pnpm --filter @handbook/scripts script:util:authors
```

Environment variables:

- `SQUAD_JSON_URL` (optional): Source JSON URL. Defaults to `https://raw.githubusercontent.com/defi-wonderland/web/dev/src/data/squad.json`.
- `SQUAD_IMAGE_BASE` (optional): Base URL to prefix relative `pfp` paths. Defaults to `https://wonderland.xyz`.

On failure to fetch, the existing `authors.yml` is preserved.

## Usage

```sh
pnpm create-handbook my-handbook
pnpm --filter @handbook/scripts copy-static sites/my-handbook/static/common
```

## Development

```bash
pnpm --filter @handbook/scripts test
```
