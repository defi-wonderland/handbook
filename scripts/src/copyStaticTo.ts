// This script copies the contents of the shared "static" directory in
// common-config to a site's local "static" folder before build time.
// Docusaurus only serves static assets from each site's own /static directory,
// so shared fonts/images must be copied explicitly into each site.

import fs from "fs";
import path from "path";

// scripts/src -> repo root -> packages/common-config/static/common
const SOURCE_DIR = path.resolve(__dirname, "..", "..", "packages", "common-config", "static", "common");
const REPO_ROOT = path.resolve(__dirname, "..", "..");

// Thrown for actionable CLI errors so the entry point can map them to a
// non-zero exit, while tests can assert on them in-process.
export class CopyStaticError extends Error {}

// Copy the shared static assets into `target` (a path relative to the repo
// root, or absolute), creating the target directory if needed. Returns the
// resolved absolute target path.
export function copyStaticTo(target: string | undefined): string {
  if (!target) {
    throw new CopyStaticError("Please provide a target path: pnpm copy-static <target>");
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    throw new CopyStaticError(`Source directory does not exist: ${SOURCE_DIR}`);
  }

  const toPath = path.resolve(REPO_ROOT, target);
  fs.mkdirSync(toPath, { recursive: true });
  fs.cpSync(SOURCE_DIR, toPath, { recursive: true, force: true });
  return toPath;
}

// CLI entry point: run only when executed directly (e.g. `ts-node
// src/copyStaticTo.ts <target>`), not when imported by tests.
if (process.argv[1]?.endsWith("copyStaticTo.ts")) {
  try {
    const toPath = copyStaticTo(process.argv[2]);
    console.log(`✅ Copied static assets to ${toPath}`);
  } catch (error) {
    console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
