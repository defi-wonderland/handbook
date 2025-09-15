import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const SQUAD_URL = 'https://raw.githubusercontent.com/defi-wonderland/web/dev/src/data/squad.json';
const PFP_BASE = 'https://raw.githubusercontent.com/defi-wonderland/web/dev/public/img/pfp';
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

const findPfp = async (baseName: string): Promise<string | null> => {
  const candidates = /\.[a-zA-Z0-9]+$/.test(baseName)
    ? [baseName]
    : ['png', 'jpg', 'jpeg', 'webp', 'svg'].map(ext => `${baseName}.${ext}`);

  for (const candidate of candidates) {
    try {
      const url = `${PFP_BASE}/${encodeURIComponent(candidate)}`;
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) return url;
    } catch {}
  }
  return null;
};

async function generateAuthors(): Promise<Record<string, AuthorEntry>> {
  console.log('🔄 Fetching squad data...');

  const existing = fs.existsSync(AUTHORS_PATH)
    ? yaml.load(fs.readFileSync(AUTHORS_PATH, 'utf8')) || {}
    : {};

  const squad = await fetch(SQUAD_URL).then(r => r.json()) as SquadMember[];
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
      ...(pfp && { image_url: await findPfp(pfp.replace('/img/pfp/', '')) }),
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

// Run if this script is executed directly
if (process.argv[1]?.endsWith('generate-authors.ts')) {
  generateAuthors().catch(console.error);
}

export { generateAuthors };