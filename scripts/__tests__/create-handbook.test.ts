import { describe, it, expect } from "@jest/globals";
import fs from "fs/promises";
import path from "path";
import { execFileSync, spawn, execSync } from "child_process";
import { pathExists } from "./setupTestUtils";

const SCRIPT_PATH = path.join(__dirname, "../src/create-handbook.ts");
const REPO_ROOT = path.resolve(__dirname, "../..");

// Helper function to read and parse JSON file
async function readJson(filePath: string): Promise<any> {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

// Helper function to check if a port is in use using lsof
function isPortInUse(port: number): boolean {
  try {
    execSync(`lsof -i :${port}`, { stdio: "ignore" });
    return true; // Port is in use
  } catch (error) {
    return false; // Port is not in use
  }
}

describe("create-handbook CLI", () => {
  it("creates a new site with valid name", async () => {
    const siteName = "test-handbook";
    const targetDir = path.join(REPO_ROOT, "sites", siteName);

    try {
      // Run the script from the repo root
      execFileSync("npx", ["ts-node", SCRIPT_PATH, siteName], {
        cwd: REPO_ROOT,
        stdio: "inherit",
      });

      // Verify the site directory was created
      expect(await pathExists(targetDir)).toBe(true);

      // Verify package.json exists and was updated with correct name
      const packageJsonPath = path.join(targetDir, "package.json");
      expect(await pathExists(packageJsonPath)).toBe(true);

      const packageJson = await readJson(packageJsonPath);
      expect(packageJson.name).toBe(`${siteName}`);
    } finally {
      // Clean up
      await fs.rm(targetDir, { recursive: true, force: true });
    }
  });

  it("creates a site that can be built and started successfully", async () => {
    const siteName = "test-build-start-handbook";
    const targetDir = path.join(REPO_ROOT, "sites", siteName);

    try {
      // Create the handbook
      execFileSync("npx", ["ts-node", SCRIPT_PATH, siteName], {
        cwd: REPO_ROOT,
        stdio: "inherit",
      });

      // Verify the site was created
      expect(await pathExists(targetDir)).toBe(true);

      // Change to the site directory
      const siteCwd = path.join(REPO_ROOT, "sites", siteName);

      // Test build:assets command
      execFileSync("pnpm", ["build:assets"], {
        cwd: siteCwd,
        stdio: "inherit",
      });

      // Verify static assets were copied
      const staticDir = path.join(siteCwd, "static", "common");
      expect(await pathExists(staticDir)).toBe(true);

      // Test build command
      execFileSync("pnpm", ["build"], {
        cwd: siteCwd,
        stdio: "inherit",
      });

      // Verify build output exists
      const buildDir = path.join(siteCwd, "build");
      expect(await pathExists(buildDir)).toBe(true);

      // Test start command by actually starting the server and checking if it's listening on port 3000
      const startProcess = spawn("pnpm", ["start"], {
        cwd: siteCwd,
        stdio: "pipe",
      });

      // Wait for server to be ready with retry mechanism
      let serverReady = false;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds total
      
      while (!serverReady && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        serverReady = isPortInUse(3000);
        attempts++;
      }
      
      expect(serverReady).toBe(true);

      // Send Ctrl+C (SIGINT) to the process and wait for it to exit
      startProcess.kill("SIGINT");
      await new Promise((resolve) => startProcess.on("exit", resolve));
    } finally {
      // Clean up
      await fs.rm(targetDir, { recursive: true, force: true });
    }
  }, 60000); // 60 second timeout for this test, since we need to Build, Start, and Stop the server
});
