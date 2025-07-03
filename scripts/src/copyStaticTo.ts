// This script copies the contents of the shared "static" directory in ui-components
// to a site's local "static" folder before build time.
// Docusaurus only serves static assets from each site's own /static directory,
// so shared fonts/images must be copied explicitly into each site.

import fs from "fs";
import path from "path";

// Simple path resolution: scripts/src -> repo root -> packages/common-config/static/common
const from = path.resolve(__dirname, "..", "..", "packages", "common-config", "static", "common");

const to = process.argv[2];

if (!to) {
  console.error("Please provide a target path: pnpm copy-static <target>");
  process.exit(1);
}

// The target should be a relative path from the repo root
// Since this script runs from scripts/, we need to go up one level to get to repo root
const repoRoot = path.resolve(__dirname, "..", "..");
const toPath = path.resolve(repoRoot, to);

// Check if source directory exists
if (!fs.existsSync(from)) {
  console.error(`❌ Source directory does not exist: ${from}`);
  process.exit(1);
}

// Ensure the target directory exists (create it if it doesn't)
fs.mkdirSync(toPath, { recursive: true });

try {
  fs.cpSync(from, toPath, { recursive: true, force: true });
  console.log(`✅ Copied static assets to ${toPath}`);
} catch (error) {
  console.error(`❌ Failed to copy static assets: ${error}`);
  process.exit(1);
}
