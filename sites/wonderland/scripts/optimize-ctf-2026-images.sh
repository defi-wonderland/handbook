#!/usr/bin/env bash
# Optimizes new images added for the EthCC 2026 CTF Solutions blog post.
#
# - Cover (hero banner, ~4MB): resized to max 1920px wide + pngquant.
# - Screenshots in ctf-2026/: pngquant only, preserving dimensions.
#
# Writes optimized copies to /tmp/ctf-2026-optimized for inspection.
# After reviewing, run with --apply to replace originals in place.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../static/img" && pwd)"
COVER="$ROOT/blog-posts-img/ctf-2026/cover.png"
SHOTS_DIR="$ROOT/ctf-2026"
TMP_DIR="/tmp/ctf-2026-optimized"
APPLY=false

for arg in "$@"; do
  [[ "$arg" == "--apply" ]] && APPLY=true
done

command -v pngquant >/dev/null || { echo "pngquant missing (brew install pngquant)"; exit 1; }
command -v sips >/dev/null || { echo "sips missing (macOS builtin)"; exit 1; }

rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR/blog-posts-img/ctf-2026" "$TMP_DIR/ctf-2026"

size() { stat -f%z "$1"; }
kb() { awk -v b="$1" 'BEGIN { printf "%.1f KB", b/1024 }'; }
pct() { awk -v a="$1" -v b="$2" 'BEGIN { if (b==0) print "-"; else printf "%.0f%%", (1 - a/b) * 100 }'; }

echo "== Optimizing =="
printf "%-45s %12s %12s %8s\n" "file" "before" "after" "saved"
printf "%-45s %12s %12s %8s\n" "---------------------------------------------" "------------" "------------" "--------"

# Cover: resize to max 1920 wide, then pngquant
cover_out="$TMP_DIR/blog-posts-img/ctf-2026/cover.png"
cp "$COVER" "$cover_out"
sips --resampleWidth 1920 "$cover_out" >/dev/null
pngquant --quality 82-95 --strip --force --output "$cover_out" "$cover_out"
orig=$(size "$COVER"); new=$(size "$cover_out")
printf "%-45s %12s %12s %8s\n" "blog-posts-img/ctf-2026/cover.png" "$(kb "$orig")" "$(kb "$new")" "$(pct "$new" "$orig")"

# Screenshots: pngquant only (keep dimensions, they are already small & precise)
for src in "$SHOTS_DIR"/*.png; do
  name=$(basename "$src")
  out="$TMP_DIR/ctf-2026/$name"
  cp "$src" "$out"
  pngquant --quality 85-95 --strip --force --output "$out" "$out" || cp "$src" "$out"
  orig=$(size "$src"); new=$(size "$out")
  printf "%-45s %12s %12s %8s\n" "ctf-2026/$name" "$(kb "$orig")" "$(kb "$new")" "$(pct "$new" "$orig")"
done

echo
total_before=$(find "$ROOT/blog-posts-img/ctf-2026" "$SHOTS_DIR" -name "*.png" -exec stat -f%z {} + | awk '{s+=$1} END {print s}')
total_after=$(find "$TMP_DIR" -name "*.png" -exec stat -f%z {} + | awk '{s+=$1} END {print s}')
printf "Total: %s -> %s (%s saved)\n" "$(kb "$total_before")" "$(kb "$total_after")" "$(pct "$total_after" "$total_before")"
echo
echo "Preview at: $TMP_DIR"

if $APPLY; then
  echo
  echo "== Applying in place =="
  cp "$TMP_DIR/blog-posts-img/ctf-2026/cover.png" "$COVER"
  for f in "$TMP_DIR/ctf-2026"/*.png; do
    cp "$f" "$SHOTS_DIR/$(basename "$f")"
  done
  echo "Done."
else
  echo "Run again with --apply to replace originals."
fi
