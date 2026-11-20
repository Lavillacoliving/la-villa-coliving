/**
 * Garde « aucune clé interne » (L'Appart, brief du 12/11/2026, Lot 3 point 10 ; décision Q9 / n° 10, à confirmer ; étape E2g).
 *
 * La base range L'Appart sous une clé INTERNE ; le site ne publie que sa clé publique (`lappart`). Un seul fichier du site fait le
 * lien : src/lib/placeBridge.ts, dont INTERNAL_ONLY_KEYS donne la liste à chercher — aucune clé n'est recopiée ici ni dans un test.
 *
 * Ce qui est cherché (périmètre Q19 : ce qui est publié et lu par un moteur ou un assistant, pas le JavaScript) :
 *   - le contenu de chaque fichier texte de public/ (pages prérendues — texte, attributs, `id`, liens, états embarqués, JSON-LD —,
 *     llms.txt, plan du site, robots.txt, CSV de l'Observatoire…) ; le nom de chaque fichier et dossier de public/ ;
 *   - index.html (coquille de toutes les pages) et vercel.json (réécritures, redirections, en-têtes) ;
 *   - les clés de src/data/roomPages.json (elles deviennent des URL).
 * Recherche : texte normalisé comme la garde des rues (normalizeForScan : entités HTML, encodage d'URL, échappements JSON, accents,
 * casse), puis la clé D'UN SEUL TENANT : les mêmes lettres en deux mots, séparés par un tiret ou une espace, ne sont pas visées
 * (un nom de lieu courant peut s'écrire ainsi). Aucune exception au départ ; une exception est nominative : un fichier et un texte
 * exact.
 * Un article de blog vient de la base : une clé dans l'URL d'un lien EXTERNE y est un avertissement (elle ne doit pas arrêter le
 * robot) ; partout ailleurs, c'est un échec.
 * Confidentialité : aucun message ne recopie une clé (fichier, ligne, nombre ; un nom de fichier est masqué).
 * Utilisé par scripts/check-entity-facts.mjs (en CI, après chaque prérendu) ; testé dans tools/test/internal-keys.test.mjs, qui
 * contrôle aussi les SOURCES du dépôt (liste blanche INTERNAL_KEY_SOURCE_ALLOWLIST, ci-dessous).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { normalizeForScan, blankSpans } from './private-locations.mjs';

/** Domaines du site : un lien vers eux n'est pas un lien externe. */
export const SITE_HOSTS = ['lavillacoliving.com', 'www.lavillacoliving.com'];

/** Fichiers de public/ lus en texte ; les autres (images) ne sont contrôlés que par leur nom. */
export const PUBLIC_TEXT_EXT = /\.(?:html?|txt|xml|csv|json|svg|md|css|js|mjs|webmanifest)$/i;

/** Exceptions nominatives `{ file, text }` (chemin relatif à la racine du dépôt, texte exact) — aucune au départ. */
export const INTERNAL_KEY_EXCEPTIONS = Object.freeze([]);

/**
 * Fichiers SOURCES du dépôt qui portent légitimement la clé interne (tous la portaient déjà sur main, sauf le pont des clés) :
 * code interne (tableau de bord, bail, page de démonstration, fonction d'envoi des candidatures), SQL de 2026-08, test de
 * l'en-tête de candidature, CLAUDE.md. Contrôle local (tools/test/internal-keys.test.mjs) : il attrape une fuite avant le build.
 */
export const INTERNAL_KEY_SOURCE_ALLOWLIST = Object.freeze([
  'CLAUDE.md',
  'scripts/property-interest-2026-08-24.sql',
  'src/lib/entities.ts',
  'src/lib/placeBridge.ts',
  'src/pages/dashboard/DashboardLocatairesPage.tsx',
  'src/pages/dashboard/DashboardLoyersPage.tsx',
  'src/pages/dashboard/DashboardProspectsPage.tsx',
  'src/pages/dev/ChargesPreviewDev.tsx',
  'supabase/functions/send-candidature-email/index.ts',
  'tools/bail-v3/etat-charges.tsx',
  'tools/test/cand-ctx.test.mjs',
]);

/** Les clés, normalisées comme le texte (minuscules, sans accents) ; vides écartées. */
export function keyNeedles(keys) {
  return [...new Set((keys ?? []).map((k) => normalizeForScan(k).trim()).filter(Boolean))];
}

const lineOf = (text, index) => {
  let n = 1;
  for (let i = text.indexOf('\n'); i !== -1 && i < index; i = text.indexOf('\n', i + 1)) n++;
  return n;
};

/** Lignes (dans l'ordre) où une clé apparaît d'un seul tenant dans un texte déjà normalisé. */
function keyLines(normalized, needles) {
  const lines = [];
  for (const nd of needles) {
    for (let i = normalized.indexOf(nd); i !== -1; i = normalized.indexOf(nd, i + nd.length)) lines.push(lineOf(normalized, i));
  }
  return lines.sort((a, b) => a - b);
}

const linesLabel = (lines) => {
  const u = [...new Set(lines)];
  return `ligne${u.length > 1 ? 's' : ''} ${u.slice(0, 8).join(', ')}${u.length > 8 ? '…' : ''}`;
};

/** Valeurs des liens EXTERNES (href vers un autre domaine que le site) d'un HTML : [{ index, length }] dans le texte brut. */
export function externalHrefSpans(html) {
  const spans = [];
  for (const m of String(html ?? '').matchAll(/\bhref\s*=\s*(["'])(https?:\/\/[^"']*)\1/gi)) {
    let host = '';
    try { host = new URL(m[2].replace(/&amp;/g, '&')).hostname.toLowerCase(); } catch { host = ''; }
    if (SITE_HOSTS.includes(host)) continue;
    spans.push({ index: m.index + m[0].indexOf(m[2]), length: m[2].length });
  }
  return spans;
}

/**
 * Clés internes dans un texte (pur). `keys` = INTERNAL_ONLY_KEYS. Options : `externalLinksAsWarnings` (article de blog : une clé
 * dans l'URL d'un lien externe = avertissement) ; `exceptions` = textes exacts tolérés dans CE texte. Renvoie
 * `{ failures, warnings }` : des messages sans la clé (nombre et lignes).
 */
export function internalKeyLeaks(text, keys, { externalLinksAsWarnings = false, exceptions = [] } = {}) {
  const needles = keyNeedles(keys);
  const failures = [], warnings = [];
  if (needles.length === 0) return { failures, warnings };
  let raw = String(text ?? '');
  if (externalLinksAsWarnings) {
    const hits = externalHrefSpans(raw).filter((s) => needles.some((nd) => normalizeForScan(raw.slice(s.index, s.index + s.length)).includes(nd)));
    if (hits.length) {
      warnings.push(`clé interne dans l'URL d'un lien externe (${hits.length} lien(s), ${linesLabel(hits.map((s) => lineOf(raw, s.index)))}) — contenu de la base : corriger l'article`);
      raw = blankSpans(raw, [...hits].sort((a, b) => b.index - a.index));
    }
  }
  let normalized = normalizeForScan(raw);
  for (const ex of exceptions) {
    const t = normalizeForScan(ex).trim();
    if (!t) continue;
    const spans = [];
    for (let i = normalized.indexOf(t); i !== -1; i = normalized.indexOf(t, i + t.length)) spans.push({ index: i, length: t.length });
    normalized = blankSpans(normalized, spans.reverse());
  }
  const lines = keyLines(normalized, needles);
  if (lines.length) failures.push(`clé interne de la base trouvée ${lines.length} fois (${linesLabel(lines)}) — seule la clé publique se publie (src/lib/placeBridge.ts)`);
  return { failures, warnings };
}

/** Un nom (fichier, dossier, clé d'URL) porte-t-il une clé interne ? */
export function nameHasKey(name, keys) {
  const n = normalizeForScan(name);
  return keyNeedles(keys).some((nd) => n.includes(nd));
}

/** Nom affichable : la clé remplacée par « <clé interne> » (ou le nom entier masqué s'il ne la porte qu'encodée). */
export function maskKeys(name, keys) {
  let out = String(name);
  for (const k of keys ?? []) if (k) out = out.replace(new RegExp(String(k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '<clé interne>');
  return nameHasKey(out, keys) ? '(nom masqué)' : out;
}

/**
 * Clé interne dans les SOURCES du dépôt (pur) : `files` = [{ path, text }] ; un fichier hors de `allowlist` qui la porte = un
 * message (chemin, nombre, lignes ; jamais la clé).
 */
export function sourceKeyIssues(files, keys, allowlist = INTERNAL_KEY_SOURCE_ALLOWLIST) {
  const out = [];
  for (const f of files ?? []) {
    if (allowlist.includes(f.path)) continue;
    const r = internalKeyLeaks(f.text, keys);
    for (const msg of r.failures) out.push(`${maskKeys(f.path, keys)} : ${msg} — hors de la liste blanche (INTERNAL_KEY_SOURCE_ALLOWLIST, scripts/lib/internal-keys.mjs)`);
    if (nameHasKey(f.path, keys)) out.push(`${maskKeys(f.path, keys)} : le chemin du fichier porte la clé interne`);
  }
  return out;
}

/** Article de blog prérendu (contenu de la base) ? */
const isBlogPage = (rel) => /^public\/prerendered\/(?:en-)?blog-[^/]+\.html$/.test(rel);

/**
 * Toutes les surfaces publiées sous `root` (la racine du dépôt) : contenu des fichiers texte de public/, noms de public/,
 * index.html, vercel.json, clés de src/data/roomPages.json. Renvoie `{ failures, warnings, read, names }` (messages préfixés du
 * chemin relatif, sans la clé). Un fichier attendu absent (vercel.json, index.html) n'est pas une erreur ici.
 */
export async function internalKeySurfaceIssues({ root, keys, exceptions = INTERNAL_KEY_EXCEPTIONS }) {
  const failures = [], warnings = [];
  let read = 0, names = 0;
  if (keyNeedles(keys).length === 0) return { failures, warnings, read, names, skipped: true };
  const exceptionsFor = (rel) => exceptions.filter((e) => e.file === rel).map((e) => e.text);
  const scanText = async (rel, opts = {}) => {
    let text;
    try { text = await fs.readFile(path.join(root, rel), 'utf8'); } catch { return; }
    read++;
    const r = internalKeyLeaks(text, keys, { ...opts, exceptions: exceptionsFor(rel) });
    for (const msg of r.failures) failures.push(`${maskKeys(rel, keys)} : ${msg}`);
    for (const msg of r.warnings) warnings.push(`${maskKeys(rel, keys)} : ${msg}`);
  };
  const walk = async (relDir) => {
    let entries;
    try { entries = await fs.readdir(path.join(root, relDir), { withFileTypes: true }); } catch { return; }
    for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const rel = `${relDir}/${e.name}`;
      names++;
      if (nameHasKey(e.name, keys)) failures.push(`${maskKeys(rel, keys)} : nom de ${e.isDirectory() ? 'dossier' : 'fichier'} qui porte la clé interne — il devient une URL publique`);
      if (e.isDirectory()) await walk(rel);
      else if (PUBLIC_TEXT_EXT.test(e.name)) await scanText(rel, { externalLinksAsWarnings: isBlogPage(rel) });
    }
  };
  await walk('public');
  await scanText('index.html');
  await scanText('vercel.json');
  try {
    const roomPages = JSON.parse(await fs.readFile(path.join(root, 'src/data/roomPages.json'), 'utf8'));
    for (const k of Object.keys(roomPages)) if (nameHasKey(k, keys)) failures.push(`src/data/roomPages.json : une clé de lieu porte la clé interne — elle deviendrait une URL de fiche chambre (${maskKeys(k, keys)})`);
  } catch { /* fichier absent : rien à contrôler */ }
  return { failures, warnings, read, names, skipped: false };
}
