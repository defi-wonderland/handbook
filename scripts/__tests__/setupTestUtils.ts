/**
 * Jest setup file for scripts package tests
 * This file runs before each test file
 */

import fs from "fs/promises";
import path from "path";
import { beforeAll, afterAll, afterEach } from "@jest/globals";

// Create a temporary directory for test files
const TEST_TEMP_DIR = path.join(__dirname, "../.tmp/temp-test-files");

// Clean up function to remove test files
export const cleanupTestFiles = async (): Promise<void> => {
  try {
    await fs.rm(TEST_TEMP_DIR, { recursive: true, force: true });
  } catch (error) {
    // Ignore errors if directory doesn't exist
  }
};

// Setup function to create test directory
export const setupTestFiles = async (): Promise<string> => {
  await cleanupTestFiles();
  await fs.mkdir(TEST_TEMP_DIR, { recursive: true });
  return TEST_TEMP_DIR;
};

// Global setup - runs once before all tests
beforeAll(async () => {
  await setupTestFiles();
});

// Global teardown - runs once after all tests
afterAll(async () => {
  await cleanupTestFiles();
});

// Clean up after each test
afterEach(async () => {
  // Clean up any files created during the test
  try {
    const testFiles = await fs.readdir(TEST_TEMP_DIR);
    for (const file of testFiles) {
      await fs.rm(path.join(TEST_TEMP_DIR, file), {
        recursive: true,
        force: true,
      });
    }
  } catch (error) {
    // Ignore errors if directory doesn't exist
  }
});

export const pathExists = async (filePath: string): Promise<boolean> => {
  return await fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);
};
