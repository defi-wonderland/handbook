// This script copies the contents of the shared "static" directory in ui-components
// to a site's local "static" folder before build time.
// Docusaurus only serves static assets from each site's own /static directory,
// so shared fonts/images must be copied explicitly into each site.

import fs from "fs-extra";
import path from "path";

const from = path.resolve(__dirname, "..", "..", "static", "common");

const to = process.argv[2];
console.log("From:", from);
console.log("To:", to);

if (!to) {
  console.error("Please provide a target path: pnpm copy-static <target>");
  process.exit(1);
}

const toPath = path.resolve(to);

// Ensure the target directory exists (create it if it doesn't)
fs.ensureDirSync(toPath);

fs.copySync(from, toPath, { overwrite: true });
console.log(`✅ Copied static assets to ${toPath}`);
