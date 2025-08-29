import fs from "fs";
import path from "path";
import YAML from "yaml";

type RawMember = Record<string, unknown>;

type SquadSource = RawMember[] | { members?: RawMember[] } | Record<string, RawMember>;

const DEFAULT_SQUAD_URL =
  process.env.SQUAD_JSON_URL ||
  "https://raw.githubusercontent.com/defi-wonderland/web/dev/src/data/squad.json";

const IMAGE_BASE = process.env.SQUAD_IMAGE_BASE || "https://wonderland.xyz";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const AUTHORS_YAML_PATH = path.resolve(
  REPO_ROOT,
  "sites",
  "wonderland",
  "blog",
  "generated",
  "authors.yml"
);

const PAGE_ALLOWLIST = new Set<string>(["skeletor-spaceman"]);

function safeString(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim();
  return undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  return undefined;
}

function slugify(candidate: string): string {
  return candidate
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_.]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-/g, "")
    .replace(/-$/g, "");
}

function ensureAbsoluteImageUrl(imagePath: string | undefined): string | undefined {
  if (!imagePath) return undefined;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (!imagePath.startsWith("/")) return `${IMAGE_BASE}/${imagePath}`;
  return `${IMAGE_BASE}${imagePath}`;
}

function readExistingPageFlags(filePath: string): Set<string> {
  try {
    if (!fs.existsSync(filePath)) return new Set();
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = YAML.parse(raw) as Record<string, any> | null;
    if (!parsed || typeof parsed !== "object") return new Set();
    const result = new Set<string>();
    for (const [key, value] of Object.entries(parsed)) {
      if (value && typeof value === "object" && (value as any).page === true) {
        result.add(key);
      }
    }
    return result;
  } catch {
    return new Set();
  }
}

function normalizeDescription(text: string | undefined): string {
  if (!text) return "";
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    // remove common bullet markers only when at line start
    .map((line) => line.replace(/^[-•]\s+/, ""))
    // drop empty lines
    .filter((line) => line.length > 0);

  const joined = lines.join(" ");
  return joined.replace(/\s{2,}/g, " ").trim();
}

function firstWord(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const token = value.trim().split(/\s+/)[0];
  return token || undefined;
}

function deriveTitle(member: RawMember): string | undefined {
  return (
    safeString((member as any).position)
  );
}

function formatTitle(rawTitle: string | undefined): string | undefined {
  if (!rawTitle) return undefined;
  const t = rawTitle.trim();
  if (t.length === 0) return undefined;

  // If multiple roles combined (e.g., "Co-founder & Architect"), keep the rightmost role
  const splitByAmp = t.split(/\s*&\s*/);
  const rightmost = splitByAmp[splitByAmp.length - 1] || t;
  const normalized = rightmost.trim();

  // Exception 1: keep exact 'Partner Lead'
  if (normalized.toLowerCase() === "partner lead") return "Partner Lead";

  // Exception 2: roles starting with 'Chief' → initials
  if (/^chief\b/i.test(normalized)) {
    // Special-case: disambiguate Chief Testing Officer from CTO
    if (/^chief\s+testing\s+officer$/i.test(normalized)) {
      return "C. Testing Officer";
    }
    const initials = normalized
      .split(/\s+/)
      .map((w) => (w[0] || "").toUpperCase())
      .join("");
    return initials;
  }

  // Default: first word only
  return firstWord(normalized);
}

async function fetchSquad(url: string): Promise<SquadSource> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch squad JSON: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as SquadSource;
}

function normalizeMembers(source: SquadSource): RawMember[] {
  if (Array.isArray(source)) return source;
  if (source && typeof source === "object") {
    if (Array.isArray((source as any).members)) return (source as any).members as RawMember[];
    // object map keyed by handle
    const entries = Object.entries(source as Record<string, RawMember>).map(([k, v]) => ({
      handle: k,
      ...(v || {}),
    }));
    return entries as unknown as RawMember[];
  }
  return [];
}

function deriveKey(member: RawMember): string | undefined {
  // Prefer the human-readable display name for key generation
  const nameFirst = safeString(member.name) || safeString((member as any).displayName);
  if (nameFirst) return slugify(nameFirst);
  // Fallbacks if name is missing
  const fallback = safeString((member as any).slug) || safeString(member.handle) || safeString((member as any).id);
  return fallback ? slugify(fallback) : undefined;
}

function mapMember(member: RawMember, pageAllowlist: Set<string>) {
  const key = deriveKey(member);
  if (!key) return undefined as unknown as [string, any] | undefined;

  const name = firstWord(safeString(member.name) || safeString((member as any).displayName)) || key;
  const title = formatTitle(deriveTitle(member)) || "";
  const rawDescription =
    safeString((member as any).bio) || safeString((member as any).description) || "";
  const description = normalizeDescription(rawDescription);
  const pfp = safeString((member as any).pfp) || safeString((member as any).image) || safeString((member as any).image_url);
  const pageFlag = asBoolean((member as any).page);

  const result: Record<string, unknown> = { name };

  const imageUrl = ensureAbsoluteImageUrl(pfp);
  if (title && title.length > 0) {
    result.title = title;
  }
  if (description && description.length > 0) {
    result.description = description;
  }
  if (imageUrl && imageUrl.length > 0) {
    result.image_url = imageUrl;
  }

  // Force author pages for all entries
  result.page = true;

  return [key, result] as [string, Record<string, unknown>];
}

async function main() {
  const existingPageFlags = readExistingPageFlags(AUTHORS_YAML_PATH);

  try {
    const raw = await fetchSquad(DEFAULT_SQUAD_URL);
    const members = normalizeMembers(raw);

    const mappedEntries = members
      .map((m) => mapMember(m, existingPageFlags))
      .filter(Boolean) as [string, Record<string, unknown>][];

    // Keep stable alphabetical order by key
    mappedEntries.sort((a, b) => a[0].localeCompare(b[0]));

    const authors: Record<string, unknown> = Object.fromEntries(mappedEntries);
    const yamlOut = YAML.stringify(authors);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(AUTHORS_YAML_PATH), { recursive: true });
    fs.writeFileSync(AUTHORS_YAML_PATH, yamlOut);

    console.log(`✅ Generated authors.yml from squad JSON → ${AUTHORS_YAML_PATH}`);
  } catch (err: any) {
    console.warn(
      `⚠️  Skipping authors generation due to error: ${err?.message || String(err)}. Keeping existing file.`
    );
    process.exitCode = 0;
  }
}

main();


