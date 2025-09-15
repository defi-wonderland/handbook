/*
  Sync authors.yml from defi-wonderland/web squad.json

  - Fetch squad.json
  - Map fields into Docusaurus blog authors format
  - Download profile pictures to sites/wonderland/static/img/pfp (configurable)
  - Update image_url in authors.yml (local or raw URLs via env)
  - Preserve custom fields present in authors.yml
  - Create a backup authors.yml.bak
  - Output a machine-readable summary to stdout and to a summary file
*/

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { z } from "zod";

type Json = unknown;

const SQUAD_URL =
  process.env.SQUAD_JSON_URL ||
  "https://raw.githubusercontent.com/defi-wonderland/web/dev/src/data/squad.json";

const RAW_PFP_BASE =
  process.env.RAW_PFP_BASE ||
  "https://raw.githubusercontent.com/defi-wonderland/web/dev/public/img/pfp";

// Resolve monorepo root from this file's location (scripts/src -> repo root)
const REPO_ROOT = process.env.MONOREPO_ROOT
  ? path.resolve(process.env.MONOREPO_ROOT)
  : path.resolve(__dirname, "..", "..");
const TARGET_SITE = process.env.TARGET_SITE || "wonderland";
const AUTHORS_YML_PATH = path.resolve(
  REPO_ROOT,
  "sites",
  TARGET_SITE,
  "blog",
  "authors.yml",
);
const AUTHORS_YML_BACKUP_PATH = `${AUTHORS_YML_PATH}.bak`;
const LOCAL_PFP_DIR = path.resolve(
  REPO_ROOT,
  "sites",
  TARGET_SITE,
  "static",
  "img",
  "pfp",
);

const USE_RAW_PFP_URLS = (process.env.USE_RAW_PFP_URLS || "false").toLowerCase() === "true";
const DELETE_MISSING = (process.env.DELETE_MISSING || "false").toLowerCase() === "true";

// Optional explicit removals, comma-separated slugs
const EXPLICIT_REMOVE = new Set(
  (process.env.AUTHOR_REMOVE_SLUGS || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0),
);

// Default alias map for known renames
const defaultAliasMap: Record<string, string> = {
  // handbook slug -> canonical slug
  "skeletor-spaceman": "skeletor",
  "wei3er-hase": "weiser",
  "0xmono": "mono",
};

function parseAliasesEnv(): Record<string, string> {
  const raw = process.env.AUTHOR_SLUG_ALIASES;
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (typeof k === "string" && typeof v === "string" && k && v) out[k] = v;
      }
      return out;
    }
  } catch {
    // ignore invalid JSON
  }
  return {};
}

const aliasMap: Record<string, string> = { ...defaultAliasMap, ...parseAliasesEnv() };

// Accept a variety of field names to be robust against source changes
const SquadMemberSchema = z
  .object({
    // Slug is optional; will fallback to derived slug from name
    slug: z.string().min(1).optional(),
    id: z.string().min(1).optional(),
    handle: z.string().min(1).optional(),
    username: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    displayName: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    role: z.string().min(1).optional(),
    position: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    bio: z.string().min(1).optional(),
    about: z.string().min(1).optional(),
    image: z.string().min(1).optional(),
    avatar: z.string().min(1).optional(),
    pfp: z.string().min(1).optional(),
    photo: z.string().min(1).optional(),
    socials: z
      .object({
        twitter: z.string().optional(),
        github: z.string().optional(),
        website: z.string().optional(),
        linkedin: z.string().optional(),
      })
      .partial()
      .optional(),
  })
  .passthrough();

const SquadSchema = z.array(SquadMemberSchema);

type SquadMember = z.infer<typeof SquadMemberSchema>;

type AuthorEntry = Record<string, unknown>;
type AuthorsYaml = Record<string, AuthorEntry>;

function toKebabCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pick<T extends Json>(
  obj: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return undefined;
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

async function fetchJson<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`Failed to fetch JSON ${url}: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

async function downloadToFile(url: string, filePath: string): Promise<void> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, buffer);
}

async function tryFindExistingPfp(
  baseNameOrFilename: string,
): Promise<{ filename: string; url: string } | null> {
  // If input contains an extension, try it directly
  const hasExt = /\.[a-zA-Z0-9]+$/.test(baseNameOrFilename);
  const candidates: string[] = [];
  if (hasExt) {
    candidates.push(baseNameOrFilename);
  } else {
    const exts = ["png", "jpg", "jpeg", "webp", "svg"];
    for (const ext of exts) candidates.push(`${baseNameOrFilename}.${ext}`);
  }
  for (const candidate of candidates) {
    const url = `${RAW_PFP_BASE}/${encodeURIComponent(candidate)}`;
    try {
      const head = await fetch(url, { method: "HEAD" });
      if (head.ok) return { filename: candidate, url };
    } catch {
      // ignore and try next
    }
  }
  return null;
}

function loadAuthorsYaml(filePath: string): AuthorsYaml {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const doc = yaml.load(content);
  if (doc == null) return {};
  if (typeof doc !== "object" || Array.isArray(doc)) {
    throw new Error(`Invalid authors.yml format. Expected mapping at root.`);
  }
  return doc as AuthorsYaml;
}

function dumpAuthorsYaml(authors: AuthorsYaml): string {
  // Keep two-space indentation, plain style, unlimited line width to avoid wrapping
  return yaml.dump(authors, {
    indent: 2,
    noRefs: true,
    lineWidth: -1,
    sortKeys: false,
  });
}

function getExistingOrderKeys(original: AuthorsYaml): string[] {
  return Object.keys(original);
}

function mergePreservingCustomFields(
  existing: AuthorEntry | undefined,
  updates: AuthorEntry,
): AuthorEntry {
  const result: AuthorEntry = { ...(existing ?? {}) };
  for (const [k, v] of Object.entries(updates)) {
    // Overwrite only mapped fields, leave unknown custom fields as-is
    result[k] = v;
  }
  return result;
}

function getSlug(member: SquadMember): string | null {
  const explicit = pick(member as Record<string, unknown>, ["slug", "id", "handle", "username"]);
  if (explicit) return explicit;
  const name = pick(member as Record<string, unknown>, ["name", "displayName"]);
  if (!name) return null;
  const derived = toKebabCase(name);
  return aliasMap[derived] || derived;
}

function getName(member: SquadMember): string | null {
  return (
    pick(member as Record<string, unknown>, ["name", "displayName"]) || null
  );
}

function getTitle(member: SquadMember): string | undefined {
  return pick(member as Record<string, unknown>, ["title", "role", "position"]);
}

function getDescription(member: SquadMember): string | undefined {
  return pick(member as Record<string, unknown>, ["bio", "description", "about"]);
}

function normalizeDescription(input: string | undefined): string | undefined {
  if (!input) return input;
  // Replace CRLF to LF, split paragraphs, trim each line
  const lines = input
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => l.replace(/^[-•]\s*/, ""));
  // Join with single spaces to form a paragraph
  let text = lines.join(" ");
  // Normalize spaces around punctuation
  text = text.replace(/\s{2,}/g, " ").trim();
  return text;
}

function getPfp(member: SquadMember): string | undefined {
  return pick(member as Record<string, unknown>, ["pfp", "image", "avatar", "photo"]);
}

function getImageUrlForFilename(filename: string): string {
  if (USE_RAW_PFP_URLS) {
    return `${RAW_PFP_BASE}/${encodeURIComponent(filename)}`;
  }
  // Prefer local path if file exists, otherwise fall back to raw URL
  const localFsPath = path.resolve(LOCAL_PFP_DIR, filename);
  if (fs.existsSync(localFsPath)) return `/img/pfp/${filename}`;
  return `${RAW_PFP_BASE}/${encodeURIComponent(filename)}`;
}

function extractFilenameFromImageUrl(url: unknown): string | null {
  if (typeof url !== "string" || url.trim().length === 0) return null;
  try {
    // Handles both /img/pfp/name.png and full URLs
    const parts = url.split("/");
    const file = parts[parts.length - 1];
    if (file && /\.[a-zA-Z0-9]+$/.test(file)) return file;
  } catch {
    // ignore
  }
  return null;
}

async function main(): Promise<void> {
  const summary: {
    added: string[];
    updated: string[];
    unchanged: string[];
    skipped: { slug?: string; reason: string }[];
    downloadedImages: string[];
    missingInSquad: string[];
  } = { added: [], updated: [], unchanged: [], skipped: [], downloadedImages: [], missingInSquad: [] };

  // Load existing authors.yml
  const existingAuthors = loadAuthorsYaml(AUTHORS_YML_PATH);
  const existingOrder = getExistingOrderKeys(existingAuthors);

  // Backup authors.yml
  if (fs.existsSync(AUTHORS_YML_PATH)) {
    fs.copyFileSync(AUTHORS_YML_PATH, AUTHORS_YML_BACKUP_PATH);
  }

  // Fetch and validate squad
  const raw = await fetchJson<Json>(SQUAD_URL);
  const squad = SquadSchema.safeParse(raw);
  if (!squad.success) {
    throw new Error(`squad.json structure invalid: ${squad.error.toString()}`);
  }

  // Prepare local pfp dir when using local images
  if (!USE_RAW_PFP_URLS) ensureDir(LOCAL_PFP_DIR);

  for (const member of squad.data) {
    const slug = getSlug(member);
    let name = getName(member);
    if (!slug || !name) {
      summary.skipped.push({ reason: `Missing slug or name` });
      continue;
    }
    // Exception: force "Skeletor" as display name
    if (slug === "skeletor") name = "Skeletor";
    const title = getTitle(member);
    const description = normalizeDescription(getDescription(member));
    const pfpBase = getPfp(member);

    let finalFilename: string | null = null;
    if (pfpBase) {
      try {
        const found = await tryFindExistingPfp(pfpBase);
        if (found) {
          finalFilename = found.filename;
          if (!USE_RAW_PFP_URLS) {
            // Download locally
            const toPath = path.resolve(LOCAL_PFP_DIR, finalFilename);
            await downloadToFile(found.url, toPath);
            summary.downloadedImages.push(finalFilename);
          }
        }
      } catch (err) {
        summary.skipped.push({ slug, reason: `pfp download failed: ${(err as Error).message}` });
      }
    }

    // If we couldn't resolve a pfp from squad.json, attempt to reuse existing filename to rewrite URL
    if (!finalFilename) {
      const existing = existingAuthors[slug];
      const existingUrl = existing ? (existing["image_url"] as unknown) : undefined;
      const existingFile = extractFilenameFromImageUrl(existingUrl);
      if (existingFile) finalFilename = existingFile;
    }

    const mapped: AuthorEntry = {
      name,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(finalFilename ? { image_url: getImageUrlForFilename(finalFilename) } : {}),
    };
    // Map common socials if present
    const socials = (member as Record<string, unknown>)["socials"] as
      | Record<string, string>
      | undefined;
    if (socials) {
      const { twitter, github, website, linkedin } = socials as Record<string, string>;
      if (twitter) (mapped as Record<string, unknown>)["twitter"] = twitter;
      if (github) (mapped as Record<string, unknown>)["github"] = github;
      if (website) (mapped as Record<string, unknown>)["website"] = website;
      if (linkedin) (mapped as Record<string, unknown>)["linkedin"] = linkedin;
    }

    const existing = existingAuthors[slug];
    if (!existing) {
      existingAuthors[slug] = mapped;
      summary.added.push(slug);
    } else {
      const prevDump = JSON.stringify(existing);
      existingAuthors[slug] = mergePreservingCustomFields(existing, mapped);
      const nextDump = JSON.stringify(existingAuthors[slug]);
      if (prevDump === nextDump) summary.unchanged.push(slug);
      else summary.updated.push(slug);
    }
  }

  // Maintain existing order, append any new keys at the end sorted alphabetically by slug
  const finalAuthors: AuthorsYaml = {};
  const existingKeys = new Set(Object.keys(existingAuthors));
  const beforeKeys = new Set(Object.keys(existingAuthors));
  for (const key of existingOrder) {
    if (key in existingAuthors) finalAuthors[key] = existingAuthors[key];
  }
  const remaining = Array.from(existingKeys).filter((k) => !existingOrder.includes(k));
  remaining.sort((a, b) => a.localeCompare(b));
  for (const key of remaining) finalAuthors[key] = existingAuthors[key];

  // Determine authors missing in squad (kept but reported)
  const squadSlugs = new Set(
    squad.data
      .map((m) => getSlug(m))
      .filter((s): s is string => typeof s === "string" && s.length > 0),
  );
  for (const key of beforeKeys) {
    if (!squadSlugs.has(key)) summary.missingInSquad.push(key);
  }

  // Apply removals: explicit set and optionally any missing in squad
  const removals = new Set<string>(EXPLICIT_REMOVE);
  if (DELETE_MISSING) summary.missingInSquad.forEach((k) => removals.add(k));
  for (const r of removals) delete finalAuthors[r];

  const newYaml = dumpAuthorsYaml(finalAuthors);
  const prevYaml = fs.existsSync(AUTHORS_YML_PATH)
    ? fs.readFileSync(AUTHORS_YML_PATH, "utf8")
    : "";

  if (newYaml !== prevYaml) {
    fs.writeFileSync(AUTHORS_YML_PATH, newYaml, "utf8");
  }

  // Write CI summary if available
  const summaryLines: string[] = [];
  summaryLines.push(`Authors sync summary`);
  summaryLines.push("");
  summaryLines.push(`Added: ${summary.added.length}`);
  if (summary.added.length) summaryLines.push(`- ${summary.added.join(", ")}`);
  summaryLines.push(`Updated: ${summary.updated.length}`);
  if (summary.updated.length) summaryLines.push(`- ${summary.updated.join(", ")}`);
  summaryLines.push(`Unchanged: ${summary.unchanged.length}`);
  summaryLines.push(`Skipped: ${summary.skipped.length}`);
  if (summary.skipped.length) {
    for (const s of summary.skipped) {
      summaryLines.push(`- ${s.slug ?? "(unknown)"}: ${s.reason}`);
    }
  }
  if (summary.missingInSquad.length) {
    const kept = DELETE_MISSING ? 0 : summary.missingInSquad.length;
    if (kept > 0) {
      summaryLines.push(`Missing in squad.json (kept): ${kept}`);
      summaryLines.push(`- ${summary.missingInSquad.join(", ")}`);
    } else {
      summaryLines.push(`Missing in squad.json removed: ${summary.missingInSquad.length}`);
    }
  }
  summaryLines.push(`Images downloaded: ${summary.downloadedImages.length}`);
  if (summary.downloadedImages.length) {
    for (const img of summary.downloadedImages) summaryLines.push(`- ${img}`);
  }

  const summaryText = summaryLines.join("\n");
  // eslint-disable-next-line no-console
  console.log(summaryText);

  const githubSummary = process.env.GITHUB_STEP_SUMMARY;
  if (githubSummary) {
    try {
      fs.appendFileSync(githubSummary, `${summaryText}\n`);
    } catch {
      // ignore
    }
  }

  // Write a workspace summary file for PR bodies/comments
  try {
    fs.writeFileSync(path.resolve(REPO_ROOT, "AUTHORS_SYNC_SUMMARY.md"), `${summaryText}\n`, "utf8");
  } catch {
    // ignore
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(`❌ Sync failed:`, err);
  process.exitCode = 1;
});


