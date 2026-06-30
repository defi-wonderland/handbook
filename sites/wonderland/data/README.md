# Vendored squad data

`squad.json` (author metadata) and the profile pictures in
`../static/img/pfp/` are a **vendored snapshot** of the team data that lives in
the private [`defi-wonderland/web`](https://github.com/defi-wonderland/web)
repo (`src/data/squad.json` and `public/img/pfp/`).

`scripts/generate-authors.ts` reads these local files at build time
(`prebuild`) to generate `blog/authors.yml`. They are vendored — not fetched —
because the build previously pulled them over unauthenticated
`raw.githubusercontent.com`, which now returns `404` for the private `web`
repo and silently left `authors.yml` empty, breaking the Docusaurus build.

## Refreshing the snapshot

When the team list changes in `defi-wonderland/web`, refresh the vendored copy
(requires `gh` auth with read access to `defi-wonderland/web`). From this
directory:

```sh
# 1. squad.json
gh api repos/defi-wonderland/web/contents/src/data/squad.json?ref=dev \
  --jq '.content' | base64 -d > squad.json

# 2. profile pictures
gh api repos/defi-wonderland/web/contents/public/img/pfp?ref=dev \
  --jq '.[] | "\(.name)\t\(.download_url)"' \
| while IFS=$'\t' read -r name url; do
    curl -sSL "$url" -o "../static/img/pfp/$name"
  done
```

Then run `pnpm generate-authors` and commit the changes.
