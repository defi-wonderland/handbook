Generated authors map (not a blog post)

This directory contains the generated authors.yml used by the blog. Do not edit it manually; it is overwritten by the generator.

Source of truth
- Default URL: https://raw.githubusercontent.com/defi-wonderland/web/dev/src/data/squad.json
- Override with env: SQUAD_JSON_URL
- Relative pfp paths are prefixed with SQUAD_IMAGE_BASE (default https://wonderland.xyz).

How to regenerate
- From repo root: pnpm --filter @handbook/scripts script:util:authors
- The Wonderland site also regenerates on:
  - pnpm start (via prestart)
  - pnpm build (as part of build:assets)

Mapping rules
- Keys: slugified, lowercase of the display name
- name: first word of display name (e.g., "Skeletor Spaceman" → Skeletor)
- title: first word of role/position, with exceptions:
  - Partner Lead preserved
  - Chief … → initials (e.g., Chief Security Officer → CSO); Chief Testing Officer → C. Testing Officer
- description: bullet lists collapsed into a single paragraph
- image_url: absolute URL
- page: preserved from existing file and forced for skeletor-spaceman
