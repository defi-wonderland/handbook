import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Squad data and profile pictures are vendored into this repo (see
// data/squad.json and static/img/pfp/; refresh steps in data/README.md).
// They used to be fetched at build time from the (now private)
// defi-wonderland/web repo over unauthenticated raw.githubusercontent.com,
// which 404s and left authors.yml ungenerated -> the Docusaurus build then
// failed to resolve blog author keys. Reading local files keeps the build
// hermetic and deterministic.
const SQUAD_PATH = path.resolve(__dirname, '..', 'data', 'squad.json');
const PFP_DIR = path.resolve(__dirname, '..', 'static', 'img', 'pfp');
const PFP_PUBLIC_BASE = '/img/pfp';
const AUTHORS_PATH = path.resolve(process.cwd(), 'blog', 'authors.yml');

// Aliases: original-slug -> target-slug OR original-slug -> display-name
export const ALIASES: Record<string, string> = {
  'skeletor-spaceman': 'skeletor', // slug alias
  'wei3er-hase': 'weiser',         // slug alias
  '0xmono': 'mono',                // slug alias
};

// Name overrides for specific slugs
export const NAME_OVERRIDES: Record<string, string> = {
  'skeletor': 'Skeletor',
};

type SquadMember = {
  slug?: string;
  id?: string;
  handle?: string;
  username?: string;
  name?: string;
  displayName?: string;
  title?: string;
  role?: string;
  position?: string;
  description?: string;
  bio?: string;
  about?: string;
  pfp?: string;
  image?: string;
  avatar?: string;
  photo?: string;
  socials?: Record<string, string>;
};

type AuthorEntry = Record<string, unknown>;

const pick = (obj: Record<string, unknown>, keys: string[]): string | undefined => {
  const key = keys.find(k => typeof obj[k] === 'string' && obj[k]?.toString().trim());
  return key ? obj[key] as string : undefined;
};

const kebabCase = (str: string): string => str.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const getSlug = (member: SquadMember): string | null => {
  const explicit = pick(member, ['slug', 'id', 'handle', 'username']);
  if (explicit) return explicit;

  const name = pick(member, ['name', 'displayName']);
  if (!name) return null;

  return kebabCase(name);
};

const normalizeText = (text: string): string =>
  text.replace(/\r\n/g, '\n')
      .split(/\n+/)
      .map(l => l.trim().replace(/^[-•]\s*/, ''))
      .filter(Boolean)
      .join(' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

// Resolve a profile picture against the vendored static/img/pfp directory and
// return the public (Docusaurus-served) path, or null if no file matches.
const findPfp = (baseName: string): string | null => {
  const candidates = /\.[a-zA-Z0-9]+$/.test(baseName)
    ? [baseName]
    : ['png', 'jpg', 'jpeg', 'webp', 'svg'].map(ext => `${baseName}.${ext}`);

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(PFP_DIR, candidate))) {
      return `${PFP_PUBLIC_BASE}/${encodeURIComponent(candidate)}`;
    }
  }
  return null;
};

async function generateAuthors(): Promise<Record<string, AuthorEntry>> {
  console.log('🔄 Reading vendored squad data...');

  const existing = fs.existsSync(AUTHORS_PATH)
    ? yaml.load(fs.readFileSync(AUTHORS_PATH, 'utf8')) || {}
    : {};

  const squad = JSON.parse(fs.readFileSync(SQUAD_PATH, 'utf8')) as SquadMember[];
  const authors: Record<string, AuthorEntry> = {};

  for (const member of squad) {
    const derivedSlug = getSlug(member);
    if (!derivedSlug) continue;

    let name = pick(member, ['name', 'displayName']);
    if (!name) continue;

    // Apply slug aliases
    const finalSlug = ALIASES[derivedSlug] || derivedSlug;

    // Apply name overrides
    const finalName = NAME_OVERRIDES[finalSlug] || name;

    const title = pick(member, ['title', 'role', 'position']);
    const desc = pick(member, ['bio', 'description', 'about']);
    const pfp = pick(member, ['pfp', 'image', 'avatar', 'photo']);

    const author = {
      ...existing[finalSlug], // Preserve existing custom fields first
      name: finalName, // Use final name (either original or overridden)
      ...(title && { title }),
      ...(desc && { description: normalizeText(desc) }),
      ...(pfp && { image_url: findPfp(pfp.replace('/img/pfp/', '')) }),
      ...(member.socials ?? {}),
      page: true
    };

    // Filter out falsy values
    const cleanAuthor = Object.fromEntries(Object.entries(author).filter(([, v]) => v));
    authors[finalSlug] = cleanAuthor;
  }

  fs.writeFileSync(AUTHORS_PATH, yaml.dump(authors, { indent: 2, lineWidth: -1 }));
  console.log(`✅ Generated ${Object.keys(authors).length} authors`);

  return authors;
}

// Run if this script is executed directly. Fail loudly (non-zero exit) so a
// missing/invalid squad file breaks the build instead of silently producing an
// empty authors map that fails later inside `docusaurus build`.
if (process.argv[1]?.endsWith('generate-authors.ts')) {
  generateAuthors().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { generateAuthors };
