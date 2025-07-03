import fs from "fs/promises";
import path from "path";
import { execFileSync } from "child_process";
import { setupTestFiles } from "./setupTestUtils";
import { describe, it, expect, beforeEach } from "@jest/globals";
import { pathExists } from "./setupTestUtils";

const SCRIPT_PATH = path.join(__dirname, "../src/copyStaticTo.ts");
const REPO_ROOT = path.resolve(__dirname, "../..");

describe("copyStaticTo CLI", () => {
  let testDir: string;

  beforeEach(async () => {
    // Each test gets a fresh temp test dir
    testDir = await setupTestFiles();
  });

  describe("copies all files to the target directory", () => {
    it("creates the target directory if it does not exist", async () => {
      // Use a relative path for the target (relative to repo root)
      const relativeTarget = path.relative(REPO_ROOT, path.join(testDir, "new-target"));

      // Run the script as a CLI from the repo root, passing the relative target dir
      execFileSync("npx", ["ts-node", SCRIPT_PATH, relativeTarget], {
        stdio: "inherit",
        cwd: REPO_ROOT,
      });

      // Assert: the target directory was created at the resolved absolute path
      const resolvedTarget = path.resolve(REPO_ROOT, relativeTarget);
      const targetExists = await pathExists(resolvedTarget);
      expect(targetExists).toBe(true);
    });

    it("uses the existing target directory if it already exists", async () => {
      // Create the target directory using the resolved absolute path
      const relativeTarget = path.relative(REPO_ROOT, path.join(testDir, "existing-target"));
      const resolvedTarget = path.resolve(REPO_ROOT, relativeTarget);
      await fs.mkdir(resolvedTarget, { recursive: true });

      // Run the script as a CLI from the repo root, passing the relative target dir
      execFileSync("npx", ["ts-node", SCRIPT_PATH, relativeTarget], {
        stdio: "inherit",
        cwd: REPO_ROOT,
      });

      // Assert: the target directory still exists at the resolved absolute path
      const targetExists = await pathExists(resolvedTarget);
      expect(targetExists).toBe(true);
    });
  });

  it("exits and logs error if no target path is provided", async () => {
    try {
      // Run the script as a CLI from the repo root, passing the target dir
      execFileSync("npx", ["ts-node", SCRIPT_PATH], {
        stdio: "pipe",
        cwd: REPO_ROOT,
      });

      // Assert: the script should have exited with an error
      throw new Error("Should have exited with error");
    } catch (error: any) {
      expect(error.status).not.toBe(0);
      expect(error.stderr.toString()).toMatch(/provide a target path/i);
    }
  });
});
