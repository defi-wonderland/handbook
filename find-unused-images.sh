#!/bin/bash

echo "🔍 Finding unused images..."
echo ""

unused_count=0
unused_images="/tmp/unused_images.txt"
> "$unused_images"

# Read all images
while IFS= read -r image_path; do
  # Get just the filename
  filename=$(basename "$image_path")

  # Search for references in code files (tsx, ts, js, jsx, md, mdx, css, json, yml)
  references=$(grep -r "$filename" --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" --include="*.md" --include="*.mdx" --include="*.css" --include="*.json" --include="*.yml" --include="*.yaml" . 2>/dev/null | grep -v node_modules | grep -v ".git" | grep -v build | grep -v dist | wc -l | tr -d ' ')

  if [ "$references" -eq 0 ]; then
    echo "❌ UNUSED: $image_path"
    echo "$image_path" >> "$unused_images"
    ((unused_count++))
  fi
done < /tmp/all_images.txt

echo ""
echo "=================================="
echo "Found $unused_count unused images"
echo "List saved to: $unused_images"
echo "=================================="
