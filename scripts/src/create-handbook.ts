/**
 * Create a new handbook site from the template
 * Usage: ts-node scripts/create-handbook.ts <site-name>
 */

import fs from "fs-extra";
import path from "path";

// Simple path resolution: scripts/src -> repo root -> sites
const TEMPLATE_DIR = path.resolve(__dirname, "..", "..", "sites", "template");
const SITES_DIR = path.resolve(__dirname, "..", "..", "sites");

const siteName = process.argv[2];

if (!siteName) {
  console.error("❌ Please provide a site name");
  console.error("Usage: ts-node scripts/create-handbook.ts <site-name>");
  process.exit(1);
}

// Check for valid characters (alphanumeric, hyphens, underscores)
if (!/^[a-zA-Z0-9_-]+$/.test(siteName)) {
  console.error(
    "❌ Site name can only contain letters, numbers, hyphens, and underscores"
  );
  process.exit(1);
}

// Check if site already exists
const targetDir = path.join(SITES_DIR, siteName);
if (fs.existsSync(targetDir)) {
  console.error(`❌ Site '${siteName}' already exists at ${targetDir}`);
  process.exit(1);
}

try {
  // 1. Copy template to new site
  fs.copySync(TEMPLATE_DIR, targetDir);

  // 2. Update package.json with the new site name and correct copy-static script
  const packageJsonPath = path.join(targetDir, "package.json");
  const packageJson = fs.readJsonSync(packageJsonPath);
  packageJson.name = `${siteName}`;
  packageJson.scripts["copy-static"] = `pnpm --filter scripts copy-static sites/${siteName}/static/common`;
  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

  console.log(`✅ Created new handbook site: ${siteName}`);
  console.log(`📁 Location: ${targetDir}`);
  console.log(`🚀 Next steps:`);
  console.log(`   1. cd sites/${siteName}`);
  console.log(`   2. pnpm build:assets`);
  console.log(`   3. pnpm start`);
} catch (error) {
  console.error(`❌ Failed to create handbook site: ${error}`);
  process.exit(1);
}
