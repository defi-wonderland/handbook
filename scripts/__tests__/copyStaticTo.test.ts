import fs from "fs/promises";
import path from "path";
import { describe, it, expect, beforeEach } from "@jest/globals";
import { setupTestFiles, pathExists } from "./setupTestUtils";
import { copyStaticTo, CopyStaticError } from "../src/copyStaticTo";

const REPO_ROOT = path.resolve(__dirname, "../..");

// These call copyStaticTo() in-process. The previous version shelled out via
// `npx ts-node`, whose resolution/fetch is nondeterministic in CI (cold cache
// -> network) and made this suite flaky; an in-process call is deterministic.
describe("copyStaticTo", () => {
  let testDir: string;

  beforeEach(async () => {
    // Each test gets a fresh temp test dir
    testDir = await setupTestFiles();
  });

  describe("copies all files to the target directory", () => {
    it("creates the target directory if it does not exist", async () => {
      const relativeTarget = path.relative(REPO_ROOT, path.join(testDir, "new-target"));
      const resolvedTarget = path.resolve(REPO_ROOT, relativeTarget);

      copyStaticTo(relativeTarget);

      expect(await pathExists(resolvedTarget)).toBe(true);
    });

    it("uses the existing target directory if it already exists", async () => {
      const relativeTarget = path.relative(REPO_ROOT, path.join(testDir, "existing-target"));
      const resolvedTarget = path.resolve(REPO_ROOT, relativeTarget);
      await fs.mkdir(resolvedTarget, { recursive: true });

      copyStaticTo(relativeTarget);

      expect(await pathExists(resolvedTarget)).toBe(true);
    });

    it("copies the shared static files into the target", async () => {
      const relativeTarget = path.relative(REPO_ROOT, path.join(testDir, "with-files"));
      const resolvedTarget = copyStaticTo(relativeTarget);

      const copied = await fs.readdir(resolvedTarget);
      expect(copied.length).toBeGreaterThan(0);
    });
  });

  it("throws if no target path is provided", () => {
    expect(() => copyStaticTo(undefined)).toThrow(CopyStaticError);
    expect(() => copyStaticTo(undefined)).toThrow(/provide a target path/i);
  });
});
