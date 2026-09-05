/**
 * Redirections `vercel.json` — helpers PURS + CLI (Lot C0.3, brief « Conquête IA », 09/2026).
 *
 * Contexte : `vercel.json` porte ~100 redirections maintenues à la main (toutes `permanent: true`,
 * donc 308) ; les `rewrites` sont régénérés par scripts/prerender.mjs (updateVercelJson) qui
 * conserve les `redirects`. Invariant du site : AUCUNE chaîne (une destination n'est jamais
 * elle-même une source). Quand un article B, déjà cible de A → B, est consolidé dans C, il faut
 * écrire A → C et B → C, jamais B → C seul.
 *
 * Usage CLI :
 *   node scripts/redirects.mjs --add /blog/ancien /blog/nouveau            # FR + jumeau /en
 *   node scripts/redirects.mjs --add /ancienne-page /nouvelle-page --fr-only
 *   node scripts/redirects.mjs --add … --dry-run                            # affiche sans écrire
 * Le fichier est réécrit avec la même sérialisation que prerender.mjs (JSON indenté 2 + \n).
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const VERCEL_JSON = path.join(__dirname, '..', 'vercel.json');

/** Chemin canonique : « / » initial, ni query/fragment, ni slash final (trailingSlash:false). */
export function normalizePath(p) {
  if (typeof p !== 'string' || !p.trim()) throw new Error('chemin vide');
  let s = p.trim();
  if (/^https?:\/\//i.test(s)) s = new URL(s).pathname;
  if (!s.startsWith('/')) s = `/${s}`;
  s = s.replace(/[?#].*$/, '');
  if (s.length > 1) s = s.replace(/\/+$/, '');
  return s;
}

/** Une source Vercel peut contenir des motifs (`:slug`, `:path*`) : convertit en RegExp. */
export function sourceToRegExp(source) {
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const withParams = escaped
    .replace(/\\:([A-Za-z_][A-Za-z0-9_]*)\\\*/g, '(?:.*)')  // :path* (échappé : \:path\*)
    .replace(/:([A-Za-z_][A-Za-z0-9_]*)\\\*/g, '(?:.*)')
    .replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, '[^/]+');
  return new RegExp(`^${withParams}$`);
}

/** Retourne la redirection dont la source (exacte ou motif) capture `pathname`, sinon null. */
export function findRedirectFor(config, pathname) {
  const p = normalizePath(pathname);
  for (const r of config.redirects ?? []) {
    if (r.source === p) return r;
    if (r.source.includes(':') && sourceToRegExp(r.source).test(p)) return r;
  }
  return null;
}

/**
 * Ajoute (ou met à jour) une redirection `from` → `to`, en retargetant toute entrée qui pointait
 * vers `from` (pas de chaîne). Mute `config` et retourne la liste des changements.
 * Refuse : from === to ; `to` déjà source d'une redirection (il faudrait viser sa destination).
 */
export function addRedirect(config, from, to, { permanent = true } = {}) {
  const src = normalizePath(from);
  const dst = normalizePath(to);
  if (src === dst) throw new Error(`redirection sur elle-même : ${src}`);
  config.redirects ??= [];
  const chain = findRedirectFor(config, dst);
  if (chain) {
    throw new Error(`chaîne refusée : ${dst} est déjà redirigé vers ${chain.destination} — vise ${chain.destination} directement`);
  }
  const changes = [];
  for (const r of config.redirects) {
    if (r.destination === src) {
      changes.push({ type: 'retarget', source: r.source, from: r.destination, to: dst });
      r.destination = dst;
    }
  }
  const existing = config.redirects.find((r) => r.source === src);
  if (existing) {
    if (existing.destination !== dst) {
      changes.push({ type: 'update', source: src, from: existing.destination, to: dst });
      existing.destination = dst;
    } else {
      changes.push({ type: 'unchanged', source: src, to: dst });
    }
    existing.permanent = permanent;
  } else {
    config.redirects.push({ source: src, destination: dst, permanent });
    changes.push({ type: 'add', source: src, to: dst });
  }
  if ((config.rewrites ?? []).some((rw) => rw.source === src)) {
    changes.push({ type: 'warn', source: src, message: `« ${src} » est aussi une source de rewrite : la page prérendue ne sera plus servie (retire-la de STATIC_ROUTES_FR ou dépublie l'article, puis relance le prérendu).` });
  }
  return changes;
}

/** FR + jumeau EN (`/en/x`) ; pas de jumeau si `from` est déjà sous /en. */
export function addRedirectPair(config, from, to, opts) {
  const src = normalizePath(from);
  const changes = addRedirect(config, src, to, opts);
  if (src !== '/en' && !src.startsWith('/en/')) {
    const dst = normalizePath(to);
    const enFrom = src === '/' ? '/en' : `/en${src}`;
    const enTo = dst === '/' ? '/en' : dst.startsWith('/en/') || dst === '/en' ? dst : `/en${dst}`;
    changes.push(...addRedirect(config, enFrom, enTo, opts));
  }
  return changes;
}

export async function loadConfig(file = VERCEL_JSON) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

export async function saveConfig(config, file = VERCEL_JSON) {
  await fs.writeFile(file, JSON.stringify(config, null, 2) + '\n');
}

async function main() {
  const args = process.argv.slice(2);
  const i = args.indexOf('--add');
  if (i === -1 || !args[i + 1] || !args[i + 2]) {
    console.error('Usage : node scripts/redirects.mjs --add <from> <to> [--fr-only] [--dry-run] [--file vercel.json]');
    process.exit(2);
  }
  const fileIdx = args.indexOf('--file');
  const file = fileIdx !== -1 ? path.resolve(args[fileIdx + 1]) : VERCEL_JSON;
  const config = await loadConfig(file);
  const changes = args.includes('--fr-only')
    ? addRedirect(config, args[i + 1], args[i + 2])
    : addRedirectPair(config, args[i + 1], args[i + 2]);
  for (const c of changes) {
    if (c.type === 'warn') console.log(`⚠️  ${c.message}`);
    else if (c.type === 'retarget') console.log(`↪  ${c.source} : ${c.from} → ${c.to} (retarget, pas de chaîne)`);
    else if (c.type === 'add') console.log(`＋ ${c.source} → ${c.to}`);
    else if (c.type === 'update') console.log(`✎  ${c.source} : ${c.from} → ${c.to}`);
    else console.log(`＝ ${c.source} → ${c.to} (déjà en place)`);
  }
  if (args.includes('--dry-run')) { console.log('(dry-run : vercel.json non modifié)'); return; }
  await saveConfig(config, file);
  console.log(`✅ ${path.basename(file)} écrit — ${config.redirects.length} redirections. Lance ensuite : node scripts/check-redirects.mjs`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
}
