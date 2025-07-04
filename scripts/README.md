# Handbook Scripts

Scripts for creating new handbook repos and copying shared static assets.

- `create-handbook.ts`: Create a new handbook site from template.
- `copyStaticTo.ts`: Copy shared static assets to a handbook site.

## Usage

```sh
pnpm create-handbook my-handbook
pnpm --filter scripts copy-static sites/my-handbook/static
```

## Development

```bash
pnpm --filter scripts test
``` 