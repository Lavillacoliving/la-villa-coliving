#!/usr/bin/env node
/**
 * Lot 4 « budget réel » (brief de Jérôme du 24/11/2026, « Articles du blog : les chiffres du budget réel ») — ESSAI À BLANC des
 * 79 opérations du fichier JSON du brief (blog_remplacements_budget_reel_2026-11-24.json, qui FAIT FOI) sur trois articles de
 * blog_posts, et, dans une liste SÉPARÉE, G3 (décision de Jérôme du 24/11/2026) : la note Google écrite en clair dans deux
 * autres articles (scripts/blog-budget-reel-g3.edits.json).
 *
 *   node scripts/blog-budget-reel.mjs                       → essai à blanc : lit, contrôle, calcule, écrit les documents et le SQL
 *   options : --ops <fichier>      fichier JSON des opérations (défaut : scripts/blog-budget-reel-2026-11-24.ops.json, copie amendée,
 *                                  ou la variable LVC_BUDGET_REEL_OPS)
 *             --g3 <fichier>       liste G3 (défaut : scripts/blog-budget-reel-g3.edits.json) · --sans-g3 : sans G3
 *             --docs <dossier>     documents lisibles (diff par champ + résultats des contrôles ; défaut : tools/out/blog-budget-reel,
 *                                  gitignoré)
 *             --date AAAA-MM-JJ    suffixe des fichiers SQL (défaut 2026-11-24)
 *             --retour-arriere <fichier>  écrit EN PLUS le SQL de retour arrière (100 % ASCII : opérations inverses gardées par
 *                                  l'empreinte des nouveaux textes, résultat comparé à l'empreinte d'origine) — à produire au moment
 *                                  de la séance, à côté de la sauvegarde
 *             --seance <fichier>   écrit EN PLUS une variante « séance » du SQL : 100 % ASCII (littéraux U&) et compacte (les
 *                                  opérations au lieu des textes entiers), mêmes gardes — pour un outil qui recopie la requête
 *             --posts-json <fichier>  lit un export JSON de blog_posts au lieu du REST (hors ligne : SQL marqué « ne pas appliquer »)
 *
 * AUCUNE ÉCRITURE EN BASE, JAMAIS : ce script n'a pas de chemin d'écriture. Il lit les lignes par REST avec la clé anon (SELECT
 * seulement, même projet et même clé que scripts/check-entity-facts.mjs, dont la constante est relue à l'exécution : la clé n'est
 * ni recopiée ici ni affichée). Le SQL produit s'applique PLUS TARD, dans une séance à part, après le GO explicite de Jérôme sur
 * le diff (brief § 3.2 et § 7) : d'abord scripts/blog-budget-reel-<date>.backup-select.sql (sauvegarde des lignes complètes),
 * puis scripts/blog-budget-reel-<date>.sql (une seule transaction).
 *
 * Contrôles (un seul échec arrête tout) :
 *  - AVANT calcul (brief § 3.3), sur le contenu d'origine : longueur (caractères, comme length() de Postgres) et 10 premiers
 *    caractères du md5 de chaque champ = état attendu du fichier JSON, updated_at inchangé ; chaque `old`, `anchor`, `start` et
 *    `end` présent EXACTEMENT une fois ; `set_field` : le champ entier vaut `old` ; aucun chevauchement entre deux opérations ;
 *    nombre d'opérations par article et par champ = tableau du brief § 3.1 ; liste des chaînes retirées = liste du § 3.4.
 *    Échec → rien n'est écrit (ni document, ni SQL).
 *  - APRÈS calcul (brief § 3.4) : aucun `old` ne subsiste (sauf s'il fait partie de son `new`) ; chaque `new` et chaque `text`
 *    présent une fois ; jetons {{…}} du nouveau contenu dans la liste du § 2 (et connus du site) ; aucun jeton dans une meta ;
 *    chaque tableau Markdown garde le même nombre de colonnes sur toutes ses lignes ; dans l'article du budget (FR, EN, metas),
 *    plus aucune chaîne du § 3.4 (aussi après repli des espaces insécables) ; G3 : plus d'ancienne note.
 *    Échec → les documents sont écrits (pour comprendre), le SQL ne l'est pas.
 *  - Complémentaires (hors brief, n'empêchent rien) : gardes du site rejouées sur le texte rendu (check:slots, check:facts,
 *    chargées depuis l'arbre de travail), longueur des metas, concurrents, vouvoiement, temps de lecture.
 *
 * Le SQL : BEGIN ; un bloc DO par champ modifié — ligne présente une fois, md5 COMPLET de la valeur actuelle = celui de l'essai à
 * blanc, UPDATE du champ entier (texte dollar-quoté) avec updated_at = now(), exactement 1 ligne touchée (GET DIAGNOSTICS), puis md5
 * du texte écrit = celui calculé ici (détecte un texte altéré en transit) ; sinon RAISE EXCEPTION, donc tout est annulé ;
 * COMMIT ; vérification en lecture seule. Partie 1 = les 79 opérations ; Partie 2 = G3, à part.
 * Fonctions pures exportées (testables).
 */
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath, pathToFileURL } from 'url';
import { CONTENT_TOKENS, wordCount, readTimeMin, META_MAX, META_MIN } from './lib/article-checks.mjs';
import { buildMatchers, scanText, parseNamesEnv } from './lib/competitor-scan.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, '..');
export const SQL_DATE = '2026-11-24';
export const TABLE = 'blog_posts';
export const BUDGET_SLUG = 'budget-colocation-geneve-guide-complet';
// (24/11/2026) Défaut = la copie du dépôt, amendée par Jérôme (B-FR-31 et B-EN-28 retirés : pas de date d'ouverture de L'Appart ;
// l'original du brief, 79 opérations, reste dans ~/Downloads/blog_remplacements_budget_reel_2026-11-24.json).
export const DEFAULT_OPS = process.env.LVC_BUDGET_REEL_OPS || path.join(__dirname, 'blog-budget-reel-2026-11-24.ops.json');
export const DEFAULT_G3 = path.join(__dirname, 'blog-budget-reel-g3.edits.json');
export const DEFAULT_DOCS = path.join(ROOT, 'tools', 'out', 'blog-budget-reel');
/** Clé de l'état attendu dans les fichiers d'opérations. */
export const EXPECTED_STATE_KEY = 'etat_attendu_au_2026-11-24';

/** Brief § 3.1 : 79 opérations, réparties ainsi (33 en français et 30 en anglais pour l'article du budget, metas comprises). */
export const EXPECTED_TOTAL = 79;
export const EXPECTED_COUNTS = Object.freeze({
  'budget-colocation-geneve-guide-complet': { content_fr: 32, meta_description_fr: 1, content_en: 29, meta_description_en: 1 },
  'guide-ressources-frontalier-geneve': { content_fr: 6, content_en: 6 },
  'quartiers-annemasse-ou-vivre-selon-profil': { content_fr: 2, content_en: 2 },
});
/** Champs qu'une opération peut viser (brief § 4 : aucun autre champ — ni titre, ni slug, ni extrait, ni image, ni étiquettes). */
export const FIELDS = ['content_fr', 'content_en', 'meta_description_fr', 'meta_description_en'];
/** Seuls champs où le site remplace les jetons {{…}} (BlogPostPage → resolveContentTokens) : jamais dans une meta. */
export const TOKEN_FIELDS = ['content_fr', 'content_en'];
/** Clés obligatoires par type d'opération (règles du fichier JSON). */
export const OP_KEYS = Object.freeze({
  replace: ['old', 'new'],
  insert_before: ['anchor', 'text'],
  replace_section: ['start', 'end', 'new'],
  set_field: ['old', 'new'],
});
/** Brief § 2 : les jetons de prix admis dans le nouveau contenu. */
export const BRIEF_TOKENS = Object.freeze(['PRIX_DES', 'PRIX_DES_EUR', 'PRIX_FOURCHETTE', 'PRIX_FOURCHETTE_TABLEAU', 'PRIX_PRIVATIF_EUR', 'PRIX_APPART_DES', 'PRIX_APPART_DES_EUR']);
/** Brief § 3.4 : chaînes qui ne doivent plus exister dans l'article du budget (FR et EN) — comparées à la liste du fichier JSON. */
export const BRIEF_FORBIDDEN = Object.freeze([
  '500-700 €', '500 – 700 €', '€500-700', '1 200 – 1 600', '1 200-1 600', '1,200 – 1,600', '1,200-1,600',
  '1 600 CHF/mois', '1,600 CHF/month', 'moins de 24 heures', 'under 24 hours', 'statistique.ge.ch', '{{PRIX_DES}}',
]);
/** G3 : l'ancienne note ne doit plus exister dans les champs touchés. */
export const G3_FORBIDDEN = Object.freeze(['4,8/5 sur Google (36 avis)', '4.8/5 on Google (36 reviews)']);

const FIELD_LABEL = {
  content_fr: 'texte de l\'article, français',
  content_en: 'texte de l\'article, anglais',
  meta_description_fr: 'description de la page (meta), français',
  meta_description_en: 'description de la page (meta), anglais',
};
const OP_LABEL = { replace: 'remplacement', insert_before: 'insertion', replace_section: 'section remplacée', set_field: 'champ entier remplacé' };
const SHORT = {
  'budget-colocation-geneve-guide-complet': 'budget',
  'guide-ressources-frontalier-geneve': 'guide-ressources',
  'quartiers-annemasse-ou-vivre-selon-profil': 'quartiers-annemasse',
  'coliving-communaute-reels-amis-geneve-annemasse': 'coliving-communaute',
  'lodge-annemasse-coliving-premium-portes-geneve': 'lodge-annemasse',
};

// ── Fonctions pures ────────────────────────────────────────────────────────────────────────────────

/** Longueur en caractères (points de code), comme length() de Postgres sur un texte UTF-8 — pas String.length (UTF-16). */
export const cpLength = (s) => [...String(s)].length;
/** md5 hexadécimal des octets UTF-8, comme md5(text) de Postgres. */
export const md5 = (s) => crypto.createHash('md5').update(String(s), 'utf8').digest('hex');

/** Occurrences de `needle` dans `hay`, CHEVAUCHEMENTS COMPRIS (« exactement une fois » doit être sans ambiguïté). */
export function countOccurrences(hay, needle) {
  if (!needle) return 0;
  let n = 0;
  for (let i = String(hay).indexOf(needle); i !== -1; i = String(hay).indexOf(needle, i + 1)) n++;
  return n;
}

/** Horodatage normalisé en UTC à la microseconde (« 2026-11-21 10:21:32.19045+00 » = « 2026-11-21T10:21:32.19045+00:00 »). */
export function normalizeTimestamp(ts) {
  const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.(\d{1,6}))?(Z|[+-]\d{2}(?::?\d{2})?)?$/.exec(String(ts ?? '').trim());
  if (!m) return null;
  const frac = (m[3] ?? '').padEnd(6, '0');
  const off = m[4] ?? 'Z';
  if (/^(Z|[+-]00(:?00)?)$/.test(off)) return `${m[1]}T${m[2]}.${frac}Z`;
  const d = new Date(`${m[1]}T${m[2]}${off.length === 3 ? `${off}:00` : off}`);
  return Number.isNaN(d.getTime()) ? null : `${d.toISOString().slice(0, 19)}.${frac}Z`;
}

/** Structure d'un fichier d'opérations (brief ou G3) : table, clé, types, clés obligatoires, champs, identifiants uniques. */
export function validateOpsFile(doc, label) {
  const failures = [];
  if (!doc || typeof doc !== 'object') return { ops: [], failures: [`${label} : fichier illisible`] };
  if (doc.table !== TABLE) failures.push(`${label} : table « ${doc.table} » (attendu ${TABLE})`);
  if (doc.cle !== 'slug') failures.push(`${label} : clé « ${doc.cle} » (attendu slug)`);
  const ops = Array.isArray(doc.operations) ? doc.operations : [];
  if (!ops.length) failures.push(`${label} : aucune opération`);
  const ids = new Set();
  ops.forEach((op, i) => {
    const where = `${label} · opération n° ${i + 1}${op?.id ? ` (${op.id})` : ''}`;
    if (!OP_KEYS[op?.op]) { failures.push(`${where} : type « ${op?.op} » inconnu`); return; }
    if (typeof op.slug !== 'string' || !op.slug) failures.push(`${where} : slug absent`);
    if (!FIELDS.includes(op.field)) failures.push(`${where} : champ « ${op.field} » hors périmètre (${FIELDS.join(', ')})`);
    if (typeof op.id !== 'string' || !op.id) failures.push(`${where} : identifiant absent`);
    else if (ids.has(op.id)) failures.push(`${where} : identifiant en double`);
    else ids.add(op.id);
    for (const k of OP_KEYS[op.op]) if (typeof op[k] !== 'string' || op[k] === '') failures.push(`${where} : « ${k} » absent ou vide`);
    if ((op.op === 'replace' || op.op === 'set_field') && op.old === op.new) failures.push(`${where} : « new » identique à « old »`);
  });
  return { ops, failures };
}

/** Répartition des opérations par article et par champ. */
export function countsBySlugField(ops) {
  const out = {};
  for (const op of ops) { out[op.slug] ??= {}; out[op.slug][op.field] = (out[op.slug][op.field] ?? 0) + 1; }
  return out;
}

/** Contrôles d'une opération contre la valeur D'ORIGINE du champ (brief § 3.3). Retourne la liste des échecs. */
export function preCheckOp(op, original) {
  const where = `${op.id} (${op.slug} · ${op.field})`;
  if (typeof original !== 'string') return [`${where} : champ absent ou vide en base`];
  const out = [];
  const once = (key) => {
    const n = countOccurrences(original, op[key]);
    if (n !== 1) out.push(`${where} : « ${key} » présent ${n} fois dans le texte d'origine (attendu 1) — « ${preview(op[key])} »`);
    return n === 1;
  };
  if (op.op === 'replace') once('old');
  else if (op.op === 'insert_before') once('anchor');
  else if (op.op === 'replace_section') {
    const startOnce = once('start');
    const endOnce = once('end');
    if (startOnce && endOnce) {
      const a = original.indexOf(op.start), b = original.indexOf(op.end);
      if (a + op.start.length > b) out.push(`${where} : « start » ne précède pas « end » dans le texte d'origine`);
    }
  } else if (op.op === 'set_field' && original !== op.old) out.push(`${where} : le champ entier ne vaut pas « old » (longueur ${cpLength(original)} au lieu de ${cpLength(op.old)})`);
  return out;
}

/** Zone du texte d'origine que l'opération touche ou dont elle dépend (ancre comprise) — indices UTF-16. */
export function originalSpan(op, original) {
  if (op.op === 'replace') { const i = original.indexOf(op.old); return [i, i + op.old.length]; }
  if (op.op === 'insert_before') { const i = original.indexOf(op.anchor); return [i, i + op.anchor.length]; }
  if (op.op === 'replace_section') return [original.indexOf(op.start), original.indexOf(op.end) + op.end.length];
  return [0, original.length];
}

/** Deux opérations d'un même champ ne doivent jamais toucher la même zone du texte d'origine. */
export function overlapFailures(ops, original) {
  const spans = ops.map((op) => ({ op, span: originalSpan(op, original) })).sort((x, y) => x.span[0] - y.span[0] || x.span[1] - y.span[1]);
  const out = [];
  for (let i = 1; i < spans.length; i++) {
    const p = spans[i - 1], c = spans[i];
    if (c.span[0] < p.span[1]) out.push(`${p.op.id} et ${c.op.id} (${c.op.slug} · ${c.op.field}) se chevauchent dans le texte d'origine`);
  }
  return out;
}

/** Applique UNE opération (sans String.replace, qui interprète « $& » ou « $' » dans le texte de remplacement). */
export function applyOp(text, op) {
  const unique = (needle) => countOccurrences(text, needle) === 1;
  if (op.op === 'replace') {
    if (!unique(op.old)) return { failure: `${op.id} : « old » n'est plus unique au moment de l'appliquer (chevauchement ?)` };
    const i = text.indexOf(op.old);
    return { text: text.slice(0, i) + op.new + text.slice(i + op.old.length), at: i };
  }
  if (op.op === 'insert_before') {
    if (!unique(op.anchor)) return { failure: `${op.id} : « anchor » n'est plus unique au moment de l'appliquer` };
    const i = text.indexOf(op.anchor);
    return { text: text.slice(0, i) + op.text + text.slice(i), at: i };
  }
  if (op.op === 'replace_section') {
    if (!unique(op.start) || !unique(op.end)) return { failure: `${op.id} : « start » ou « end » n'est plus unique au moment de l'appliquer` };
    const a = text.indexOf(op.start), b = text.indexOf(op.end);
    if (a + op.start.length > b) return { failure: `${op.id} : « start » ne précède plus « end »` };
    return { text: text.slice(0, a) + op.new + text.slice(b), at: a };
  }
  if (text !== op.old) return { failure: `${op.id} : le champ ne vaut plus « old » au moment de l'appliquer` };
  return { text: op.new, at: 0 };
}

/** Applique les opérations d'un champ dans l'ordre du fichier. */
export function applyOps(original, ops) {
  let text = original;
  const failures = [];
  for (const op of ops) {
    const r = applyOp(text, op);
    if (r.failure) { failures.push(r.failure); continue; }
    text = r.text;
  }
  return { text, failures };
}

/** Contrôles d'une opération sur la valeur FINALE du champ (brief § 3.4). */
export function postCheckOp(op, final, original) {
  const where = `${op.id} (${op.slug} · ${op.field})`;
  const out = [];
  const exactly = (needle, expected, what) => {
    const n = countOccurrences(final, needle);
    if (n !== expected) out.push(`${where} : ${what} présent ${n} fois dans le nouveau texte (attendu ${expected}) — « ${preview(needle)} »`);
  };
  if (op.op === 'replace') {
    exactly(op.old, countOccurrences(op.new, op.old), '« old »');
    exactly(op.new, 1, '« new »');
  } else if (op.op === 'insert_before') {
    exactly(op.text, 1, '« text »');
    exactly(op.anchor, 1, '« anchor »');
    if (final.indexOf(op.text) + op.text.length !== final.indexOf(op.anchor)) out.push(`${where} : le texte inséré n'est pas juste avant l'ancre`);
  } else if (op.op === 'replace_section') {
    const oldSection = original.slice(original.indexOf(op.start), original.indexOf(op.end));
    exactly(oldSection, countOccurrences(op.new, oldSection), 'l\'ancienne section');
    exactly(op.new, 1, '« new »');
    exactly(op.end, 1, '« end »');
    if (final.indexOf(op.new) + op.new.length !== final.indexOf(op.end)) out.push(`${where} : la nouvelle section n'est pas suivie de « end »`);
  } else if (final !== op.new) out.push(`${where} : le champ ne vaut pas « new »`);
  return out;
}

const TOKEN_ANY_RE = /\{\{([^{}]*)\}\}/g;
/** Jetons d'un texte : { counts: {NOM: n}, issues: [] } — forme stricte {{NOM}}, liste du brief § 2, liste du site, champ admis. */
export function tokenReport(text, { field, allowed = BRIEF_TOKENS, site = CONTENT_TOKENS } = {}) {
  const counts = {};
  const issues = [];
  for (const m of String(text).matchAll(TOKEN_ANY_RE)) {
    const raw = m[1];
    counts[raw] = (counts[raw] ?? 0) + 1;
  }
  for (const [raw, n] of Object.entries(counts)) {
    const name = raw.trim();
    if (raw !== name || !/^[A-Z_]+$/.test(name)) issues.push(`jeton mal formé « {{${raw}}} » (${n}×) : forme stricte {{NOM}} attendue`);
    if (!allowed.includes(name)) issues.push(`jeton « {{${name}}} » (${n}×) hors de la liste du brief § 2`);
    if (!site.includes(name)) issues.push(`jeton « {{${name}}} » (${n}×) inconnu du site (src/lib/contentTokens.ts) : il resterait affiché tel quel`);
    if (field && !TOKEN_FIELDS.includes(field)) issues.push(`jeton « {{${name}}} » dans ${field} : le site ne remplace les jetons que dans le texte de l'article`);
  }
  const rest = String(text).replace(TOKEN_ANY_RE, '');
  if (/\{\{|\}\}/.test(rest)) issues.push('accolades doubles orphelines (« {{ » ou « }} » hors d\'un jeton)');
  return { counts, issues };
}

const TABLE_SEP_RE = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;
const BLOCK_START_RE = /^\s{0,3}(#{1,6}\s|>|[-*+]\s|\d+[.)]\s|```|~~~|<)/;
/** Cellules d'une ligne de tableau GFM (barres d'extrémité retirées, « \| » ne sépare pas). */
export function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  return s.split(/(?<!\\)\|/);
}
/** Tableaux Markdown (GFM) : ligne d'en-tête suivie d'une ligne de séparation, puis lignes à barres jusqu'à une ligne vide. */
export function markdownTables(md) {
  const lines = String(md).split('\n');
  const tables = [];
  for (let i = 0; i < lines.length - 1; i++) {
    if (!lines[i].includes('|') || !lines[i + 1].includes('|') || !TABLE_SEP_RE.test(lines[i + 1])) continue;
    const rows = [
      { line: i + 1, kind: 'en-tête', cells: splitRow(lines[i]).length, text: lines[i] },
      { line: i + 2, kind: 'séparation', cells: splitRow(lines[i + 1]).length, text: lines[i + 1] },
    ];
    let j = i + 2;
    while (j < lines.length && lines[j].trim() !== '' && lines[j].includes('|')) { rows.push({ line: j + 1, kind: 'ligne', cells: splitRow(lines[j]).length, text: lines[j] }); j++; }
    // GFM : une ligne de texte collée sous le tableau (sans ligne vide ni début de bloc) devient une ligne du tableau.
    const glued = j < lines.length && lines[j].trim() !== '' && !BLOCK_START_RE.test(lines[j]) ? { line: j + 1, text: lines[j] } : null;
    tables.push({ startLine: i + 1, header: lines[i], columns: rows[0].cells, rows, glued });
    i = j - 1;
  }
  return tables;
}
/** Échecs « nombre de colonnes » d'un texte Markdown (brief § 3.4). */
export function tableIssues(md) {
  const out = [];
  for (const t of markdownTables(md)) {
    for (const r of t.rows) if (r.cells !== t.columns) out.push(`tableau de la ligne ${t.startLine} (« ${preview(t.header, 60)} ») : ${r.kind} ligne ${r.line} à ${r.cells} colonnes au lieu de ${t.columns} — « ${preview(r.text, 90)} »`);
    if (t.glued) out.push(`tableau de la ligne ${t.startLine} : la ligne ${t.glued.line} est collée sous le tableau (sans ligne vide, GFM l'y ajoute comme une ligne à 1 colonne) — « ${preview(t.glued.text, 90)} »`);
  }
  return out;
}

/** Espaces insécables et fines repliées en espaces : une chaîne retirée ne doit pas survivre avec une autre espace. */
export const foldSpaces = (s) => String(s).replace(/[    ]/g, ' ');
/** Chaînes interdites présentes dans un texte : [{ s, raw, folded }]. */
export function forbiddenHits(text, list) {
  const folded = foldSpaces(text);
  return list.map((s) => ({ s, raw: countOccurrences(text, s), folded: countOccurrences(folded, foldSpaces(s)) })).filter((h) => h.raw || h.folded);
}

/** Aperçu sur une ligne (sauts de ligne ⏎). */
export function preview(s, max = 80) {
  const one = String(s).replace(/\n/g, '⏎');
  return one.length > max ? `${one.slice(0, max - 1)}…` : one;
}
/** Numéro de ligne (1-based) d'un indice. */
export const lineOf = (text, index) => String(text).slice(0, Math.max(0, index)).split('\n').length;
/** Titre Markdown qui commence à l'indice ou le plus proche avant lui (« (début de l'article) » sinon). */
export function sectionOf(text, index) {
  let last = null;
  for (const h of String(text).matchAll(/^#{1,6}[ \t]+.+$/gm)) { if (h.index > index) break; last = h[0]; }
  return last ? last.trim() : '(début de l\'article, avant le premier titre)';
}
/** En-tête du tableau qui contient l'indice, s'il y en a un. */
export function tableHeaderAt(text, index) {
  const lines = String(text).split('\n');
  let li = lineOf(text, index) - 1;
  if (!lines[li]?.trim().startsWith('|')) return null;
  while (li > 0 && lines[li - 1].trim().startsWith('|')) li--;
  return lines[li];
}

// Diff mot à mot (plus longue sous-suite commune) : {-retiré-}{+ajouté+}, passages identiques longs raccourcis.
const WORD_RE = /[\p{L}\p{N}]+|\s+|[^\p{L}\p{N}\s]/gu;
export function wordDiffOps(a, b, maxCells = 6e6) {
  const A = String(a).match(WORD_RE) ?? [], B = String(b).match(WORD_RE) ?? [];
  const n = A.length, m = B.length;
  if ((n + 1) * (m + 1) > maxCells) return null;
  const L = new Uint32Array((n + 1) * (m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i * (m + 1) + j] = A[i] === B[j] ? L[(i + 1) * (m + 1) + j + 1] + 1 : Math.max(L[(i + 1) * (m + 1) + j], L[i * (m + 1) + j + 1]);
  const ops = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { ops.push(['=', A[i]]); i++; j++; }
    else if (L[(i + 1) * (m + 1) + j] >= L[i * (m + 1) + j + 1]) { ops.push(['-', A[i]]); i++; }
    else { ops.push(['+', B[j]]); j++; }
  }
  while (i < n) ops.push(['-', A[i++]]);
  while (j < m) ops.push(['+', B[j++]]);
  const common = ops.filter((o) => o[0] === '=').reduce((s, o) => s + o[1].length, 0);
  return { ops, similarity: (2 * common) / Math.max(1, String(a).length + String(b).length) };
}
/** Diff mot à mot rendu en texte : { text, groups } (groups = nombre de passages changés, pour juger de la lisibilité). */
export function renderWordDiff(ops, keep = 40) {
  const out = [];
  let eq = '', del = '', ins = '', groups = 0;
  const flushChange = () => { if (del || ins) groups++; if (del) out.push(`{-${del}-}`); if (ins) out.push(`{+${ins}+}`); del = ''; ins = ''; };
  const flushEq = (last) => {
    if (!eq) return;
    const first = out.length === 0;
    if (eq.length > (first || last ? keep : 2 * keep) + 5) out.push(first ? `…${eq.slice(-keep)}` : last ? `${eq.slice(0, keep)}…` : `${eq.slice(0, keep)} … ${eq.slice(-keep)}`);
    else out.push(eq);
    eq = '';
  };
  for (const [k, t] of ops) {
    if (k === '=') {
      // Une espace commune, au milieu d'un changement qui retire ET ajoute, reste dans le changement (des deux côtés) :
      // « {-1 200 -}{+820 +}– 1 » plutôt qu'en miettes.
      if (del && ins && /^\s+$/.test(t)) { del += t; ins += t; continue; }
      flushChange(); eq += t;
    } else { flushEq(false); if (k === '-') del += t; else ins += t; }
  }
  flushChange();
  flushEq(true);
  return { text: out.join('').replace(/\n/g, '⏎\n'), groups };
}

/** Phrases d'un texte (fin = . ! ? ; ou fin de ligne). */
export const sentencesOf = (text) => String(text).split(/(?<=[.!?;])\s+|\n+/).map((s) => s.trim()).filter(Boolean);

/** Markdown → HTML approximatif (titres, listes, citations, tableaux, liens) pour rejouer les gardes du site sur le texte rendu. */
export function pseudoHtml(md) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s) => esc(s).replace(/\[([^\]]*)\]\(([^)\s]*)[^)]*\)/g, '<a href="$2">$1</a>').replace(/\*\*|__|(?<![\p{L}\p{N}])[*_](?![\s])|`/gu, '');
  const out = [];
  let para = [];
  const flush = () => { if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`); para = []; };
  const lines = String(md).split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { flush(); continue; }
    if (line.includes('|') && lines[i + 1] && TABLE_SEP_RE.test(lines[i + 1]) && lines[i + 1].includes('|')) {
      flush();
      const rows = [line];
      i += 2;
      while (i < lines.length && lines[i].trim() && lines[i].includes('|')) rows.push(lines[i++]);
      i--;
      out.push(`<table>${rows.map((r) => `<tr>${splitRow(r).map((c) => `<td>${inline(c.trim())}</td>`).join('')}</tr>`).join('')}</table>`);
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) { flush(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue; }
    const li = /^\s*(?:[-*+]|\d+[.)])\s+(.*)$/.exec(line);
    if (li) { flush(); out.push(`<li>${inline(li[1])}</li>`); continue; }
    const q = /^\s*>\s?(.*)$/.exec(line);
    if (q) { flush(); out.push(`<blockquote><p>${inline(q[1])}</p></blockquote>`); continue; }
    para.push(line.trim());
  }
  flush();
  return `<html><head></head><body><main>${out.join('\n')}</main></body></html>`;
}

/** Tag de dollar-quoting absent de tous les textes (`base`, `base_1`, …). */
export function pickTag(base, texts) {
  for (let i = 0; i < 1000; i++) {
    const tag = i === 0 ? base : `${base}_${i}`;
    if (!texts.some((t) => String(t).includes(`$${tag}$`))) return tag;
  }
  throw new Error('pickTag : aucun tag libre');
}
export const sqlString = (s) => `'${String(s).replace(/'/g, "''")}'`;
/** Chaîne pour un message RAISE (guillemets doublés, « % » littéral doublé). */
const raiseText = (s) => String(s).replace(/'/g, "''").replace(/%/g, '%%');

/**
 * Bloc DO d'un champ : ligne présente une fois, md5 complet attendu, UPDATE du champ entier, exactement 1 ligne touchée, md5 du
 * texte écrit = md5 calculé. `c` = { n, total, part, slug, field, fromMd5, toMd5, value }.
 */
export function renderFieldBlock(c, tags) {
  const label = raiseText(`blog-budget-reel [${c.n}/${c.total}] ${c.slug}.${c.field}`);
  const col = c.field;
  if (!FIELDS.includes(col)) throw new Error(`renderFieldBlock : champ ${col} hors périmètre`);
  if (!/^[0-9a-f]{32}$/.test(c.fromMd5) || !/^[0-9a-f]{32}$/.test(c.toMd5)) throw new Error('renderFieldBlock : empreinte md5 invalide');
  if (String(c.value).includes(`$${tags.text}$`) || String(c.value).includes(`$${tags.block}$`)) throw new Error('renderFieldBlock : tag de dollar-quoting présent dans le texte');
  const slug = sqlString(c.slug);
  return [
    `DO $${tags.block}$`,
    'DECLARE',
    '  n integer;',
    '  empreinte text;',
    'BEGIN',
    `  SELECT count(*) INTO n FROM public.${TABLE} WHERE slug = ${slug};`,
    '  IF n <> 1 THEN',
    `    RAISE EXCEPTION '${label} : % ligne(s) pour ce slug, 1 attendue — tout est annulé', n;`,
    '  END IF;',
    `  SELECT md5(${col}) INTO empreinte FROM public.${TABLE} WHERE slug = ${slug};`,
    `  IF empreinte IS DISTINCT FROM '${c.fromMd5}' THEN`,
    `    RAISE EXCEPTION '${label} : empreinte md5 % au lieu de ${c.fromMd5} (le champ a changé depuis l''essai à blanc) — tout est annulé', empreinte;`,
    '  END IF;',
    `  UPDATE public.${TABLE}`,
    `     SET ${col} = $${tags.text}$${c.value}$${tags.text}$,`,
    '         updated_at = now()',
    `   WHERE slug = ${slug}`,
    `     AND md5(${col}) = '${c.fromMd5}';`,
    '  GET DIAGNOSTICS n = ROW_COUNT;',
    '  IF n <> 1 THEN',
    `    RAISE EXCEPTION '${label} : % ligne(s) modifiée(s) par l''UPDATE, 1 attendue — tout est annulé', n;`,
    '  END IF;',
    `  SELECT md5(${col}) INTO empreinte FROM public.${TABLE} WHERE slug = ${slug};`,
    `  IF empreinte IS DISTINCT FROM '${c.toMd5}' THEN`,
    `    RAISE EXCEPTION '${label} : texte écrit altéré (md5 % au lieu de ${c.toMd5} : espaces insécables, apostrophes ou fins de ligne changées en route ?) — tout est annulé', empreinte;`,
    '  END IF;',
    'END',
    `$${tags.block}$;`,
  ].join('\n');
}

/** Vérification en lecture seule : une ligne par champ, ok = md5 attendu. */
export function renderVerification(changes, { expect = 'to' } = {}) {
  const rows = changes.map((c) => `  (${sqlString(c.slug)}, ${sqlString(c.field)}, '${expect === 'to' ? c.toMd5 : c.fromMd5}', ${expect === 'to' ? c.toLen : c.fromLen})`);
  return [
    'SELECT v.slug, v.champ, md5(x.valeur) = v.md5_attendu AS ok, length(x.valeur) AS longueur, v.longueur_attendue, b.updated_at',
    'FROM (VALUES',
    rows.join(',\n'),
    ') AS v(slug, champ, md5_attendu, longueur_attendue)',
    `JOIN public.${TABLE} b ON b.slug = v.slug`,
    'CROSS JOIN LATERAL (SELECT CASE v.champ WHEN \'content_fr\' THEN b.content_fr WHEN \'content_en\' THEN b.content_en',
    '  WHEN \'meta_description_fr\' THEN b.meta_description_fr WHEN \'meta_description_en\' THEN b.meta_description_en END AS valeur) x',
    'ORDER BY v.slug, v.champ;',
  ].join('\n');
}

// ── Variante « séance » : 100 % ASCII et compacte (option --seance) ──────────────────────────────────
// Le SQL de référence pose le texte entier de chaque champ (229 Ko) ; pour l'appliquer par un outil qui recopie la requête
// (séances des lots précédents : 100 % ASCII, U&''), cette variante pose les seules opérations, sous forme de littéraux U&''
// (aucun caractère hors ASCII imprimable : espaces insécables, accents, tirets et sauts de ligne écrits \XXXX), avec les mêmes
// gardes : md5 complet avant, md5 du résultat calculé = celui de l'essai à blanc AVANT l'UPDATE, une seule ligne touchée.

/** Littéral SQL 100 % ASCII : U&'…' (\XXXX, \+XXXXXX pour les caractères hors plan de base), « ' » doublée, « \ » doublé. */
export function sqlAscii(s) {
  let out = '';
  for (const ch of String(s)) {
    const cp = ch.codePointAt(0);
    if (ch === "'") out += "''";
    else if (ch === '\\') out += '\\\\';
    else if (cp >= 0x20 && cp <= 0x7e) out += ch;
    else if (cp <= 0xffff) out += `\\${cp.toString(16).padStart(4, '0')}`;
    else out += `\\+${cp.toString(16).padStart(6, '0')}`;
  }
  return `U&'${out}'`;
}
/** Inverse de sqlAscii (relecture du fichier produit). */
export function decodeSqlAscii(lit) {
  const m = /^U&'([\s\S]*)'$/.exec(lit);
  if (!m) throw new Error('decodeSqlAscii : littéral U&\'…\' attendu');
  return m[1].replace(/''|\\\\|\\\+([0-9a-f]{6})|\\([0-9a-f]{4})/gi, (all, six, four) => (all === "''" ? "'" : all === '\\\\' ? '\\' : String.fromCodePoint(parseInt(six ?? four, 16))));
}
/** Expression PL/pgSQL d'une opération appliquée à la variable v (mêmes règles que applyOp, avec les fonctions de Postgres). */
export function seanceExpr(op) {
  if (op.op === 'replace') return `replace(v, ${sqlAscii(op.old)}, ${sqlAscii(op.new)})`;
  if (op.op === 'insert_before') return `replace(v, ${sqlAscii(op.anchor)}, ${sqlAscii(op.text + op.anchor)})`;
  if (op.op === 'replace_section') return `left(v, strpos(v, ${sqlAscii(op.start)}) - 1) || ${sqlAscii(op.new)} || substr(v, strpos(v, ${sqlAscii(op.end)}))`;
  return sqlAscii(op.new);
}
/** Simulation JS de seanceExpr (replace() de Postgres remplace TOUTES les occurrences ; strpos = première). */
export function simulateSeance(original, ops) {
  let v = original;
  for (const op of ops) {
    if (op.op === 'replace') v = v.split(op.old).join(op.new);
    else if (op.op === 'insert_before') v = v.split(op.anchor).join(op.text + op.anchor);
    else if (op.op === 'replace_section') v = v.slice(0, v.indexOf(op.start)) + op.new + v.slice(v.indexOf(op.end));
    else v = op.new;
  }
  return v;
}
/**
 * Opérations inverses d'un champ (retour arrière compact) : appliquées dans l'ordre inverse au NOUVEAU texte, elles redonnent le
 * texte d'origine. `original` sert à retrouver l'ancienne section d'un replace_section. Le résultat est vérifié par simulation
 * (md5) avant d'écrire quoi que ce soit.
 */
export function reverseOps(ops, original) {
  return [...ops].reverse().map((o) => {
    if (o.op === 'replace') return { ...o, op: 'replace', old: o.new, new: o.old };
    if (o.op === 'insert_before') return { ...o, op: 'replace', old: o.text + o.anchor, new: o.anchor };
    if (o.op === 'replace_section') return { ...o, op: 'replace', old: o.new, new: original.slice(original.indexOf(o.start), original.indexOf(o.end)) };
    return { ...o, op: 'set_field', new: o.old };
  });
}

/** Bloc DO « séance » d'un champ (messages sans accent : fichier 100 % ASCII). */
export function renderSeanceBlock(c, tag) {
  const label = raiseText(`blog-budget-reel [${c.n}/${c.total}] ${c.slug}.${c.field}`);
  const slug = sqlString(c.slug);
  return [
    `DO $${tag}$`,
    'DECLARE',
    '  n integer;',
    '  v text;',
    'BEGIN',
    `  SELECT count(*) INTO n FROM public.${TABLE} WHERE slug = ${slug};`,
    `  IF n <> 1 THEN RAISE EXCEPTION '${label} : % ligne(s) pour ce slug, 1 attendue -- tout est annule', n; END IF;`,
    `  SELECT ${c.field} INTO v FROM public.${TABLE} WHERE slug = ${slug};`,
    `  IF md5(v) IS DISTINCT FROM '${c.fromMd5}' THEN RAISE EXCEPTION '${label} : empreinte md5 % au lieu de ${c.fromMd5} (champ modifie depuis l''essai a blanc) -- tout est annule', md5(v); END IF;`,
    ...c.ops.map((op) => `  -- ${op.id} (${op.op})\n  v := ${seanceExpr(op)};`),
    `  IF md5(v) IS DISTINCT FROM '${c.toMd5}' THEN RAISE EXCEPTION '${label} : resultat calcule md5 % au lieu de ${c.toMd5} -- tout est annule', md5(v); END IF;`,
    `  UPDATE public.${TABLE} SET ${c.field} = v, updated_at = now() WHERE slug = ${slug} AND md5(${c.field}) = '${c.fromMd5}';`,
    '  GET DIAGNOSTICS n = ROW_COUNT;',
    `  IF n <> 1 THEN RAISE EXCEPTION '${label} : % ligne(s) modifiee(s) par l''UPDATE, 1 attendue -- tout est annule', n; END IF;`,
    'END',
    `$${tag}$;`,
  ].join('\n');
}

/** Relecture du SQL produit : chaque texte dollar-quoté, une fois extrait, a l'empreinte que sa garde attend. */
export function sqlSelfCheck(sql, changes, textTag) {
  const failures = [];
  const open = `= $${textTag}$`;
  let pos = 0;
  for (const c of changes) {
    const a = sql.indexOf(open, pos);
    if (a === -1) { failures.push(`SQL : texte de ${c.slug}.${c.field} introuvable`); break; }
    const start = a + open.length;
    const b = sql.indexOf(`$${textTag}$`, start);
    const extracted = sql.slice(start, b);
    if (md5(extracted) !== c.toMd5) failures.push(`SQL : le texte de ${c.slug}.${c.field} relu dans le fichier n'a pas l'empreinte attendue`);
    pos = b + 1;
  }
  return failures;
}

// ── E/S ────────────────────────────────────────────────────────────────────────────────────────────

/** URL et clé anon relues dans scripts/check-entity-facts.mjs (même projet, lecture seule) ; jamais affichées ni recopiées. */
async function supabaseAccess() {
  const src = await fs.readFile(path.join(__dirname, 'check-entity-facts.mjs'), 'utf8');
  const url = /const SUPABASE_URL = '([^']+)'/.exec(src)?.[1];
  const key = process.env.SUPABASE_ANON_KEY || /const SUPABASE_ANON_KEY = '([^']+)'/.exec(src)?.[1];
  if (!url || !key) throw new Error('URL ou clé anon introuvable (scripts/check-entity-facts.mjs) — rien n\'est lu');
  return { url, key };
}

const SELECT_COLUMNS = ['slug', 'id', 'is_published', 'updated_at', 'read_time_min', 'title_fr', 'title_en', 'meta_description_fr', 'meta_description_en', 'content_fr', 'content_en'];
async function fetchRows(slugs) {
  const { url, key } = await supabaseAccess();
  const q = `${url}/rest/v1/${TABLE}?select=${SELECT_COLUMNS.join(',')}&slug=in.(${slugs.join(',')})`;
  let res;
  try {
    res = await fetch(q, { headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
  } catch (err) { throw new Error(`lecture REST impossible (${err.name})`); }
  if (!res.ok) throw new Error(`lecture REST : HTTP ${res.status}`);
  return res.json();
}

async function readJson(p, label) {
  try { return JSON.parse(await fs.readFile(p, 'utf8')); } catch (err) { throw new Error(`${label} illisible (${p}) : ${err.message}`); }
}
async function readIf(p) { try { return await fs.readFile(p, 'utf8'); } catch { return null; } }

/** Source du site (jetons, gardes) : chargée depuis l'arbre de travail ; une erreur (fichier en cours d'édition) n'arrête rien. */
async function loadSite() {
  const site = { m: null, facts: null, slots: null, errors: [] };
  try { site.m = await (await import('./lib/load-entity-facts.mjs')).loadEntityFacts(); } catch (err) { site.errors.push(`source du site (src/) : ${err.message.split('\n')[0]}`); }
  try { site.facts = await import('./check-entity-facts.mjs'); } catch (err) { site.errors.push(`scripts/check-entity-facts.mjs : ${err.message.split('\n')[0]}`); }
  try { site.slots = await import('./check-answer-slots.mjs'); } catch (err) { site.errors.push(`scripts/check-answer-slots.mjs : ${err.message.split('\n')[0]}`); }
  return site;
}

async function competitorMatchers() {
  let names = [];
  if (process.env.COMPETITOR_NAMES) names = parseNamesEnv(process.env.COMPETITOR_NAMES);
  else { const local = await readIf(path.join(__dirname, 'competitors.local.json')); if (local) names = JSON.parse(local).names ?? []; }
  return names.length ? buildMatchers(names) : null;
}

// ── Documents lisibles ─────────────────────────────────────────────────────────────────────────────

const FENCE = '````';
const block = (s, lang = 'text') => [`${FENCE}${lang}`, s, FENCE].join('\n');
const fmtInt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const LEGEND = 'Comment lire : « Ce qui change » marque `{-le texte retiré-}` et `{+le texte ajouté+}` ; « … » abrège un passage identique ; ⏎ = retour à la ligne. Les jetons `{{…}}` (prix) sont remplacés à l\'affichage par le site : « Tel que le lecteur le verra » montre le résultat, avec les valeurs de la source du site au moment de l\'essai. Certaines espaces sont insécables (U+00A0), par exemple dans « 1 430 CHF » du tableau des communes : elles sont reprises telles quelles.';

/**
 * Document d'un champ. `opts.h` = niveau du titre principal (1 : un fichier par champ ; 2 : plusieurs champs dans un fichier) ;
 * `opts.compact` = sans tableau de chiffres, légende ni sommaire (G3 : une opération par champ).
 */
function renderFieldDoc(f, ctx, { h = 1, compact = false } = {}) {
  const { m } = ctx.site;
  const H = (n) => '#'.repeat(h - 1 + n);
  const lang = f.field.endsWith('_en') ? 'en' : 'fr';
  // Rendu des jetons seulement quand il y en a (sinon la ligne répéterait « Après », espaces insécables près).
  const rendered = (s) => (m && TOKEN_FIELDS.includes(f.field) && /\{\{/.test(s) ? m.typoFr(m.resolveContentTokens(s, lang)) : null);
  const ids = f.ops.map((o) => o.id);
  const out = [`${H(1)} « ${f.title} » — ${FIELD_LABEL[f.field]}`, ''];
  if (compact) out.push(`Article \`${f.slug}\` · champ \`${f.field}\` · ${fmtInt(f.fromLen)} → ${fmtInt(f.toLen)} caractères · md5 \`${f.fromMd5.slice(0, 10)}\` → \`${f.toMd5.slice(0, 10)}\`.`);
  else {
    out.push(
      `Essai à blanc du ${ctx.dateLabel} · article \`${f.slug}\` · champ \`${f.field}\`. **Rien n'est écrit dans la base.** Ce document montre, opération par opération, le texte d'aujourd'hui (« Avant ») et le texte qui sera enregistré après ton GO (« Après »)${TOKEN_FIELDS.includes(f.field) ? ' ; l\'annexe donne le texte complet après modification' : ''}.`,
      '',
      '| | Aujourd\'hui | Après |',
      '|---|---|---|',
      `| Longueur (caractères) | ${fmtInt(f.fromLen)} | ${fmtInt(f.toLen)} |`,
      `| Empreinte md5 | \`${f.fromMd5}\` | \`${f.toMd5}\` |`,
      `| Opérations | ${f.ops.length} (${ids.length > 3 ? `${ids[0]} à ${ids[ids.length - 1]}` : ids.join(', ')}) | |`,
      '',
      LEGEND,
      '',
      `${H(2)} Sommaire`,
      '',
      '| Opération | Pourquoi (fichier JSON) | Où, dans le texte d\'aujourd\'hui | Nature |',
      '|---|---|---|---|',
      ...f.ops.map((o) => `| ${o.id} | ${o.why.replace(/\|/g, '/')} | ${o.op === 'set_field' ? 'champ entier' : `ligne ${o.line} · ${o.section.replace(/\|/g, '/')}`} | ${OP_LABEL[o.op]} |`),
    );
  }
  for (const o of f.ops) {
    out.push('', `${H(2)} ${o.id} · ${o.why}`, '');
    if (o.op === 'set_field') out.push('Nature : le champ entier est remplacé.');
    else out.push(`Nature : ${OP_LABEL[o.op]} · où : ${o.section} (ligne ${o.line} du texte d'aujourd'hui).`);
    if (o.tableHeader) out.push('', `Ligne d'un tableau — son en-tête : \`${o.tableHeader.replace(/`/g, "'")}\``);
    if (o.op === 'insert_before') {
      out.push('', '**Inséré juste avant cette ligne (inchangée)**', '', block(o.anchor), '', '**Texte inséré**', '', block(o.text));
      const r = rendered(o.text);
      if (r !== null) out.push('', '**Tel que le lecteur le verra**', '', block(r));
      continue;
    }
    if (o.op === 'replace_section') {
      out.push('', `Toute la section, depuis « ${preview(o.start, 90)} » jusqu'à « ${preview(o.end, 90)} » (non compris), est remplacée.`);
      out.push('', `**Avant** (${fmtInt(cpLength(o.oldText))} caractères)`, '', block(o.oldText), '', `**Après** (${fmtInt(cpLength(o.new))} caractères)`, '', block(o.new));
      const r = rendered(o.new);
      if (r !== null) out.push('', '**Tel que le lecteur le verra**', '', block(r));
      continue;
    }
    if (o.contextBefore && o.context) {
      // Petite modification au milieu d'un paragraphe : la phrase entière, avant et après.
      out.push('', '**Avant, dans son paragraphe**', '', block(o.contextBefore), '', '**Après, dans son paragraphe**', '', block(o.context));
    } else out.push('', '**Avant**', '', block(o.old), '', '**Après**', '', block(o.new));
    const d = wordDiffOps(o.old, o.new);
    const w = d ? renderWordDiff(d.ops) : null;
    if (w && d.similarity >= 0.5 && w.groups <= 6) out.push('', '**Ce qui change**', '', block(w.text));
    else if (d && o.op !== 'set_field') out.push('', '_Passage réécrit : comparer « Avant » et « Après »._');
    const r = rendered(o.context ?? o.new);
    if (r !== null) out.push('', '**Tel que le lecteur le verra**', '', block(r));
  }
  if (TOKEN_FIELDS.includes(f.field) && !compact) {
    out.push('', '---', '', `${H(2)} Annexe — le texte complet après modification`, '', 'Markdown brut tel qu\'il sera enregistré (jetons non remplacés), pour relire l\'article d\'un bout à l\'autre.', '', block(f.to, 'markdown'));
  }
  return out.join('\n') + '\n';
}

function statusLine(ok, text) { return `| ${ok === true ? '✅' : ok === false ? '❌' : '⚠️'} | ${text.replace(/\|/g, '/')} |`; }

function renderControlsDoc(ctx) {
  const r = ctx.report;
  const out = [
    `# Essai à blanc du ${ctx.dateLabel} — résultats des contrôles (lot 4 « budget réel » + G3)`,
    '',
    `Généré le ${ctx.generatedAt} par \`scripts/blog-budget-reel.mjs\`. Base lue le ${ctx.readAt} (${ctx.source}). Opérations : \`${path.basename(ctx.opsPath)}\` (md5 \`${ctx.opsMd5}\`)${ctx.g3Path ? ` ; G3 : \`scripts/${path.basename(ctx.g3Path)}\` (md5 \`${ctx.g3Md5}\`)` : ' ; G3 : exclu (--sans-g3)'}.`,
    '',
    '## Verdict',
    '',
    r.briefOk
      ? `✅ **Tous les contrôles du brief (§ 3.3 et § 3.4) sont au vert.** Le SQL est écrit : \`scripts/${path.basename(ctx.sqlPath)}\` (une transaction, ${ctx.changes.length} champs) et la sauvegarde à lancer juste avant : \`scripts/${path.basename(ctx.backupPath)}\`. Rien n'a été écrit en base.`
      : `❌ **${r.post.length} échec(s) après calcul : le SQL n'est PAS écrit.** Détail ci-dessous.`,
    '',
    '## 1. Avant calcul, sur le contenu d\'origine (brief § 3.3)',
    '',
    '| | Contrôle |',
    '|---|---|',
    ...r.preLines.map(([ok, t]) => statusLine(ok, t)),
    '',
    '## 2. Après calcul (brief § 3.4)',
    '',
    '| | Contrôle |',
    '|---|---|',
    ...r.postLines.map(([ok, t]) => statusLine(ok, t)),
  ];
  if (r.post.length) out.push('', '### Échecs', '', ...r.post.map((f) => `- ${f}`));
  out.push('', '## 3. Champs modifiés', '', '| Partie | Article | Champ | Opérations | Longueur avant → après | md5 avant → après |', '|---|---|---|---|---|---|',
    ...ctx.changes.map((c) => `| ${c.part === 'g3' ? 'G3' : 'lot 4'} | \`${c.slug}\` | \`${c.field}\` | ${c.ops.length} | ${fmtInt(c.fromLen)} → ${fmtInt(c.toLen)} | \`${c.fromMd5.slice(0, 10)}\` → \`${c.toMd5.slice(0, 10)}\` |`));
  out.push('', '## 4. Contrôles complémentaires (hors brief : ils n\'empêchent rien, ils préviennent)', '', '| | Contrôle |', '|---|---|', ...r.extraLines.map(([ok, t]) => statusLine(ok, t)));
  if (r.extraDetails.length) out.push('', '### Détail', '', ...r.extraDetails.map((d) => `- ${d}`));
  out.push('', '## 5. Temps de lecture (brief § 3.6)', '', ...r.readTime.map((l) => `- ${l}`));
  out.push('', '## 6. Tableaux Markdown relus (nombre de colonnes)', '', '| Article · champ | Tableaux avant → après | Détail après modification (ligne de début : colonnes × lignes) |', '|---|---|---|',
    ...r.tables.map((t) => `| \`${SHORT[t.slug] ?? t.slug}\` · ${t.field} | ${t.before} → ${t.after.length} | ${t.after.map((x) => `l. ${x.startLine} : ${x.columns} × ${x.rows.length - 2}`).join(' · ') || '—'} |`));
  out.push('', '## 7. Jetons du nouveau contenu', '', '| Article · champ | Jetons (nombre) |', '|---|---|',
    ...r.tokens.map((t) => `| \`${SHORT[t.slug] ?? t.slug}\` · ${t.field} | ${Object.entries(t.counts).map(([k, n]) => `\`{{${k}}}\` ×${n}`).join(', ') || 'aucun'} |`));
  if (ctx.site.m) out.push('', `Valeurs des jetons à l'essai (source du site, arbre de travail) : ${BRIEF_TOKENS.map((k) => `\`{{${k}}}\` = « ${ctx.site.m.resolveContentTokens(`{{${k}}}`, 'fr')} » / « ${ctx.site.m.resolveContentTokens(`{{${k}}}`, 'en')} »`).join(' ; ')}.`);
  return out.join('\n') + '\n';
}

// ── Programme ──────────────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const opt = (name) => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
  for (const forbidden of ['--write', '--apply', '--execute', '--ecrire', '--appliquer']) {
    if (args.includes(forbidden)) { console.error(`${forbidden} : ce script n'écrit jamais en base. Le SQL produit s'applique après le GO de Jérôme, dans une séance à part.`); process.exit(2); }
  }
  const opsPath = path.resolve(typeof opt('--ops') === 'string' ? opt('--ops') : DEFAULT_OPS);
  const withG3 = !args.includes('--sans-g3');
  const g3Path = withG3 ? path.resolve(typeof opt('--g3') === 'string' ? opt('--g3') : DEFAULT_G3) : null;
  const docsDir = path.resolve(typeof opt('--docs') === 'string' ? opt('--docs') : DEFAULT_DOCS);
  const date = typeof opt('--date') === 'string' ? opt('--date') : SQL_DATE;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error(`--date « ${date} » : AAAA-MM-JJ attendu`); process.exit(2); }
  const rollbackPath = typeof opt('--retour-arriere') === 'string' ? path.resolve(opt('--retour-arriere')) : null;
  const seancePath = typeof opt('--seance') === 'string' ? path.resolve(opt('--seance')) : null;
  const postsJson = typeof opt('--posts-json') === 'string' ? path.resolve(opt('--posts-json')) : null;
  const sqlPath = path.join(__dirname, `blog-budget-reel-${date}.sql`);
  const backupPath = path.join(__dirname, `blog-budget-reel-${date}.backup-select.sql`);

  const pre = [];
  const preLines = [];
  const check = (ok, text, failures = []) => { preLines.push([ok, text]); if (!ok) pre.push(...(failures.length ? failures : [text])); };

  // 1. Fichiers d'opérations.
  const opsRaw = await readFile(opsPath, 'fichier d\'opérations du brief');
  const opsDoc = JSON.parse(opsRaw);
  const main1 = validateOpsFile(opsDoc, path.basename(opsPath));
  check(main1.failures.length === 0, `Fichier JSON du brief : structure valide (table ${TABLE}, clé slug, types et clés de chaque opération, identifiants uniques)`, main1.failures);
  const counts = countsBySlugField(main1.ops);
  const countIssues = [];
  // (24/11/2026) Amendements de Jérôme postérieurs au brief, écrits DANS le fichier d'opérations (`amendements[].retire` : id, slug,
  // champ) : les opérations retirées sortent du compte attendu, et aucune ne doit rester dans la liste.
  const removed = Array.isArray(opsDoc.amendements) ? opsDoc.amendements.flatMap((a) => (Array.isArray(a.retire) ? a.retire : [])) : [];
  const expectedTotal = EXPECTED_TOTAL - removed.length;
  const expectedCounts = JSON.parse(JSON.stringify(EXPECTED_COUNTS));
  for (const r of removed) {
    if (expectedCounts[r.slug]?.[r.field] === undefined) countIssues.push(`amendement : ${r.id} vise ${r.slug} · ${r.field}, hors du tableau du brief § 3.1`);
    else expectedCounts[r.slug][r.field] -= 1;
    if (main1.ops.some((o) => o.id === r.id)) countIssues.push(`amendement : ${r.id} est retiré mais encore dans la liste des opérations`);
  }
  if (main1.ops.length !== expectedTotal) countIssues.push(`${main1.ops.length} opérations (attendu ${expectedTotal}${removed.length ? ` = ${EXPECTED_TOTAL} du brief − ${removed.length} retirée(s)` : ''})`);
  for (const [slug, fields] of Object.entries(expectedCounts)) for (const [field, n] of Object.entries(fields)) if ((counts[slug]?.[field] ?? 0) !== n) countIssues.push(`${slug} · ${field} : ${counts[slug]?.[field] ?? 0} opération(s) (attendu ${n})`);
  for (const [slug, fields] of Object.entries(counts)) for (const field of Object.keys(fields)) if (EXPECTED_COUNTS[slug]?.[field] === undefined) countIssues.push(`${slug} · ${field} : hors du tableau du brief § 3.1`);
  check(countIssues.length === 0, `${main1.ops.length} opérations${removed.length ? ` (${removed.map((r) => r.id).join(', ')} retirées par amendement de Jérôme)` : ''}, réparties comme le tableau du brief § 3.1 (budget : 33 FR dont la meta, 30 EN dont la meta ; guide des ressources 6 et 6 ; quartiers d'Annemasse 2 et 2)`, countIssues);
  const listJson = opsDoc.chaines_retirees_article_budget ?? [];
  const sameList = listJson.length === BRIEF_FORBIDDEN.length && listJson.every((s, i) => s === BRIEF_FORBIDDEN[i]);
  check(sameList, `Liste des ${BRIEF_FORBIDDEN.length} chaînes retirées du fichier JSON = liste du brief § 3.4, au caractère près`, [`chaines_retirees_article_budget ≠ brief § 3.4 : ${JSON.stringify(listJson)}`]);
  let g3Doc = null, g3 = { ops: [], failures: [] }, g3Raw = null;
  if (withG3) {
    g3Raw = await readFile(g3Path, 'liste G3');
    g3Doc = JSON.parse(g3Raw);
    g3 = validateOpsFile(g3Doc, path.basename(g3Path));
    const mixed = g3.ops.filter((o) => counts[o.slug]);
    check(g3.failures.length === 0 && mixed.length === 0, `Liste G3 : structure valide, ${g3.ops.length} opérations, sur d'autres articles que les opérations du brief (listes séparées)`, [...g3.failures, ...mixed.map((o) => `${o.id} : G3 vise un article du lot 4 (${o.slug}) — les deux listes doivent rester séparées`)]);
  }
  if (pre.length) return finish({ pre, preLines });

  // 2. Lecture des lignes (REST anon, SELECT seulement).
  const lists = [{ part: 'lot4', doc: opsDoc, ops: main1.ops }, ...(withG3 ? [{ part: 'g3', doc: g3Doc, ops: g3.ops }] : [])];
  const slugs = [...new Set(lists.flatMap((l) => l.ops.map((o) => o.slug)))];
  let rows, source;
  const readAt = new Date().toISOString();
  if (postsJson) {
    const all = await readJson(postsJson, '--posts-json');
    rows = (Array.isArray(all) ? all : Object.values(all)).filter((x) => slugs.includes(x.slug));
    source = `fichier ${path.basename(postsJson)}, HORS LIGNE — SQL à ne pas appliquer`;
  } else {
    rows = await fetchRows(slugs);
    source = 'REST anon, lecture seule';
  }
  const bySlug = new Map();
  const rowIssues = [];
  for (const x of rows) { if (bySlug.has(x.slug)) rowIssues.push(`${x.slug} : plusieurs lignes`); bySlug.set(x.slug, x); }
  for (const s of slugs) {
    if (!bySlug.has(s)) rowIssues.push(`${s} : article absent de ${TABLE} (ou non publié : la clé anon ne lit que les articles publiés)`);
    else if (bySlug.get(s).is_published !== true) rowIssues.push(`${s} : is_published = ${bySlug.get(s).is_published}`);
  }
  check(rowIssues.length === 0, `${slugs.length} articles lus, une ligne chacun, tous publiés`, rowIssues);
  if (pre.length) return finish({ pre, preLines });

  // 3. État attendu (longueur, md5, updated_at) — brief § 2 et § 3.3.
  for (const l of lists) {
    const expected = l.doc[EXPECTED_STATE_KEY] ?? {};
    const issues = [];
    let fieldsChecked = 0;
    for (const [slug, st] of Object.entries(expected)) {
      const row = bySlug.get(slug);
      if (!row) { issues.push(`${slug} : absent`); continue; }
      if (normalizeTimestamp(st.updated_at) !== normalizeTimestamp(row.updated_at)) issues.push(`${slug} : updated_at ${row.updated_at} au lieu de ${st.updated_at} — l'article a changé depuis le relevé`);
      for (const field of FIELDS) {
        if (!st[field]) continue;
        fieldsChecked++;
        const v = row[field];
        if (typeof v !== 'string') { issues.push(`${slug}.${field} : vide`); continue; }
        if (cpLength(v) !== st[field].longueur) issues.push(`${slug}.${field} : ${cpLength(v)} caractères au lieu de ${st[field].longueur}`);
        if (md5(v).slice(0, 10) !== st[field].md5_10) issues.push(`${slug}.${field} : md5 ${md5(v).slice(0, 10)} au lieu de ${st[field].md5_10}`);
      }
    }
    const missing = [...new Set(l.ops.map((o) => o.slug))].filter((s) => !expected[s]);
    for (const s of missing) issues.push(`${s} : pas d'état attendu dans le fichier`);
    check(issues.length === 0, `${l.part === 'g3' ? 'G3' : 'Lot 4'} : ${fieldsChecked} champs de texte à l'état attendu (longueur en caractères, 10 premiers caractères du md5) et updated_at inchangé${l.part === 'lot4' ? ' — tableau du brief § 2' : ' — relevé du 24/11/2026'}`, issues);
  }

  // 4. Chaque ancre une fois dans le texte d'origine ; set_field ; chevauchements.
  for (const l of lists) {
    const issues = [];
    for (const op of l.ops) issues.push(...preCheckOp(op, bySlug.get(op.slug)?.[op.field]));
    const fieldKeys = [...new Set(l.ops.map((o) => `${o.slug}\u0000${o.field}`))];
    for (const k of fieldKeys) {
      const [slug, field] = k.split('\u0000');
      const mine = l.ops.filter((o) => o.slug === slug && o.field === field);
      if (mine.some((o) => o.op === 'set_field') && mine.length > 1) issues.push(`${slug}.${field} : set_field doit être la seule opération du champ`);
      if (!issues.length) issues.push(...overlapFailures(mine, bySlug.get(slug)[field]));
    }
    const nAnchors = l.ops.reduce((s, o) => s + (o.op === 'replace_section' ? 2 : 1), 0);
    check(issues.length === 0, `${l.part === 'g3' ? 'G3' : 'Lot 4'} : ${nAnchors} chaînes cherchées (old, anchor, start, end ; set_field = champ entier) trouvées chacune exactement une fois dans le texte d'origine, sans chevauchement`, issues);
  }
  if (pre.length) return finish({ pre, preLines });

  // 5. Calcul, champ par champ (articles dans l'ordre du fichier, champs dans l'ordre de FIELDS), opérations dans l'ordre du fichier.
  const changes = [];
  const post = [];
  const postLines = [];
  const pcheck = (ok, text, failures = []) => { postLines.push([ok, text]); if (!ok) post.push(...(failures.length ? failures : [text])); };
  for (const l of lists) {
    const slugsInOrder = [...new Set(l.ops.map((o) => o.slug))];
    const fieldKeys = slugsInOrder.flatMap((s) => FIELDS.filter((f) => l.ops.some((o) => o.slug === s && o.field === f)).map((f) => [s, f]));
    for (const [slug, field] of fieldKeys) {
      const row = bySlug.get(slug);
      const original = row[field];
      const ops = l.ops.filter((o) => o.slug === slug && o.field === field);
      const { text, failures } = applyOps(original, ops);
      post.push(...failures);
      changes.push({
        part: l.part, slug, field, title: row.title_fr, from: original, to: text,
        fromLen: cpLength(original), toLen: cpLength(text), fromMd5: md5(original), toMd5: md5(text),
        ops: ops.map((o) => {
          const at = originalSpan(o, original)[0];
          // Petit remplacement dans un paragraphe : le paragraphe entier, avant et après (lecture dans son contexte).
          const small = o.op === 'replace' && o.new.length < 160 && !o.new.includes('\n') && !o.old.includes('\n');
          const before = small ? contextSentence(original, o.old) : null;
          const after = small ? contextSentence(text, o.new) : null;
          const firstLine = (s) => preview(s.split('\n')[0], 90);
          const where = o.op === 'insert_before' ? `juste avant « ${firstLine(o.anchor)} »` : o.op === 'replace_section' ? `section « ${firstLine(o.start)} »` : `dans « ${preview(sectionOf(original, at), 90)} »`;
          return {
            ...o, line: lineOf(original, at), section: where, tableHeader: o.op === 'replace' ? tableHeaderAt(original, at) : null,
            oldText: o.op === 'replace_section' ? original.slice(original.indexOf(o.start), original.indexOf(o.end)) : undefined,
            contextBefore: before && before !== o.old ? before : null,
            context: after && after !== o.new ? after : null,
          };
        }),
      });
    }
  }
  pcheck(post.length === 0, `Les ${lists.reduce((s, l) => s + l.ops.length, 0)} opérations s'appliquent dans l'ordre du fichier, chaque cible encore unique à son tour`, [...post]);

  // 6. Contrôles après calcul.
  const opIssues = [];
  for (const c of changes) for (const op of c.ops) opIssues.push(...postCheckOp(op, c.to, c.from));
  pcheck(opIssues.length === 0, 'Aucun « old » ne subsiste (hors d\'un « new » qui le reprend) ; chaque « new » et chaque « text » présent exactement une fois ; insertions juste avant leur ancre ; sections suivies de leur « end »', opIssues);
  const tokenIssuesAll = [];
  const tokens = [];
  for (const c of changes) {
    const t = tokenReport(c.to, { field: c.field });
    tokens.push({ slug: c.slug, field: c.field, counts: t.counts });
    tokenIssuesAll.push(...t.issues.map((i) => `${c.slug}.${c.field} : ${i}`));
  }
  pcheck(tokenIssuesAll.length === 0, `Jetons {{…}} du nouveau contenu : tous dans la liste du brief § 2 (${BRIEF_TOKENS.length} jetons), forme stricte, connus du site, aucun dans une meta`, tokenIssuesAll);
  const tableIssuesAll = [];
  const tables = [];
  for (const c of changes.filter((x) => TOKEN_FIELDS.includes(x.field))) {
    tableIssuesAll.push(...tableIssues(c.to).map((i) => `${c.slug}.${c.field} : ${i}`));
    tables.push({ slug: c.slug, field: c.field, before: markdownTables(c.from).length, after: markdownTables(c.to) });
  }
  const nTables = tables.reduce((s, t) => s + t.after.length, 0);
  pcheck(tableIssuesAll.length === 0, `Tableaux Markdown : ${nTables} tableaux dans les ${tables.length} textes modifiés, chacun avec le même nombre de colonnes sur toutes ses lignes (en-tête et séparation comprises), aucune ligne collée sous un tableau`, tableIssuesAll);
  const budgetHits = [];
  for (const c of changes.filter((x) => x.slug === BUDGET_SLUG)) for (const h of forbiddenHits(c.to, BRIEF_FORBIDDEN)) budgetHits.push(`${c.slug}.${c.field} : « ${h.s} » encore présent (${h.raw} tel quel, ${h.folded} après repli des espaces insécables)`);
  const budgetFields = changes.filter((x) => x.slug === BUDGET_SLUG).map((x) => x.field);
  pcheck(budgetHits.length === 0 && budgetFields.length === 4, `Article du budget (${budgetFields.join(', ')}) : aucune des ${BRIEF_FORBIDDEN.length} chaînes du brief § 3.4, ni telle quelle ni après repli des espaces insécables`, budgetHits.length ? budgetHits : [`champs de l'article du budget contrôlés : ${budgetFields.join(', ')} (4 attendus)`]);
  if (withG3) {
    const g3Hits = [];
    for (const c of changes.filter((x) => x.part === 'g3')) for (const h of forbiddenHits(c.to, G3_FORBIDDEN)) g3Hits.push(`${c.slug}.${c.field} : « ${h.s} » encore présent`);
    pcheck(g3Hits.length === 0, 'G3 : l\'ancienne note (« 4,8/5 sur Google (36 avis) » / « 4.8/5 on Google (36 reviews) ») ne subsiste dans aucun des 4 champs', g3Hits);
  }
  const untouched = [];
  for (const c of changes) if (c.from === c.to) untouched.push(`${c.slug}.${c.field} : inchangé après calcul`);
  pcheck(untouched.length === 0, `${changes.length} champs modifiés, et seulement eux (aucun autre champ ni article dans le SQL)`, untouched);

  // 7. Contrôles complémentaires.
  const site = await loadSite();
  const extraLines = [];
  const extraDetails = [];
  const extra = (ok, text, details = []) => { extraLines.push([ok, text]); extraDetails.push(...details); };
  if (site.errors.length) extra(null, `Gardes du site partiellement chargées depuis l'arbre de travail (fichiers en cours de modification ?) : ${site.errors.join(' ; ')}`);
  const langOf = (field) => (field.endsWith('_en') ? 'en' : 'fr');
  const renderMd = (text, lang) => (site.m ? site.m.typoFr(site.m.resolveContentTokens(text, lang)) : text);
  const contentChanges = changes.filter((c) => TOKEN_FIELDS.includes(c.field));
  // 7a. check:slots — créneaux exigés dans le texte visible des articles (L1_TARGETS, mode strict).
  if (site.m && site.facts?.visibleText && site.slots?.L1_TARGETS && site.slots?.resolveNeedle) {
    const lost = [];
    let checked = 0;
    // Même repli que la garde (hasNeedle) quand il est exporté ; sinon, blancs repliés.
    const has = (text, needle) => (typeof site.slots.hasNeedle === 'function' ? site.slots.hasNeedle(text, needle) : text.replace(/\s+/g, ' ').includes(needle.replace(/\s+/g, ' ')));
    for (const c of contentChanges) {
      const target = site.slots.L1_TARGETS.find((t) => t.route === `/blog/${c.slug}`);
      if (!target) continue;
      const lang = langOf(c.field);
      const flat = (s) => site.facts.visibleText(pseudoHtml(renderMd(s, lang)));
      const before = flat(c.from), after = flat(c.to);
      for (const key of target.needles) {
        let needle;
        try { needle = site.slots.resolveNeedle(site.m, key, lang); } catch { needle = null; }
        if (typeof needle !== 'string' || !needle) continue;
        const nn = needle.replace(/\s+/g, ' ');
        checked++;
        const b = has(before, needle), a = has(after, needle);
        if (b && !a) lost.push(`check:slots — ${c.slug} (${lang}) : le créneau « ${key} » (« ${preview(nn, 110)} ») disparaît du texte ; L1_TARGETS l'exige sur /blog/${c.slug} (ANSWER_SLOTS_LIVE = true) : après l'écriture, le prochain prérendu échouera tant que la source (src/data/answerSlots.ts) ou la cible (scripts/check-answer-slots.mjs) n'est pas mise à jour dans la même livraison`);
        else if (!b && !a) extraDetails.push(`check:slots — ${c.slug} (${lang}) : « ${key} » absent avant comme après (rendu approché du Markdown)`);
      }
    }
    extra(lost.length ? false : true, `check:slots (créneaux exigés dans les articles touchés) : ${checked} créneaux relus avant et après${lost.length ? ` — ${lost.length} disparaissent` : ', aucun ne disparaît'}`, lost);
  } else extra(null, 'check:slots : non rejoué (source du site ou scripts/check-answer-slots.mjs non chargés)');
  // 7b. check:facts — chaînes interdites, note Google, « 15 min » + Genève, deux gammes : sur le texte rendu de l'article seul.
  if (site.m && site.facts) {
    const added = [], removed = [];
    let nPages = 0;
    for (const c of contentChanges) {
      const lang = langOf(c.field);
      const file = `${lang === 'en' ? 'en-' : ''}blog-${c.slug}.html`;
      const issuesOf = (md) => {
        const html = pseudoHtml(renderMd(md, lang));
        const text = site.facts.visibleText(html);
        const out = [];
        for (const fn of ['forbiddenIssues', 'googleRatingIssues', 'geneva15Issues', 'gammeMixIssues']) {
          if (typeof site.facts[fn] !== 'function') continue;
          try {
            const res = fn === 'forbiddenIssues' ? site.facts[fn](html, text, file) : fn === 'googleRatingIssues' ? site.facts[fn](text, site.m) : fn === 'gammeMixIssues' ? site.facts[fn](html, file, site.m, []) : site.facts[fn](html);
            out.push(...res.map((x) => `${fn} : ${x}`));
          } catch (err) { out.push(`${fn} : non rejoué (${err.message.split('\n')[0]})`); }
        }
        return out;
      };
      nPages++;
      const b = new Set(issuesOf(c.from)), a = issuesOf(c.to);
      for (const x of a) if (!b.has(x)) added.push(`${c.slug} (${lang}) — ${x}`);
      for (const x of b) if (!a.includes(x)) removed.push(`${c.slug} (${lang}) — ${x}`);
    }
    extra(added.length ? false : true, `check:facts (règles de texte rejouées sur ${nPages} textes rendus, avant/après) : ${added.length} nouvelle(s) alerte(s) après modification, ${removed.length} alerte(s) levée(s) par la modification`, [...added.map((x) => `check:facts, nouvelle alerte : ${x}`), ...removed.map((x) => `check:facts, alerte levée par la modification : ${x}`)]);
  } else extra(null, 'check:facts : non rejoué (source du site ou scripts/check-entity-facts.mjs non chargés)');
  // 7c. G3 : la nouvelle chaîne = la note de la source du site.
  if (withG3) {
    if (site.m?.STATS_DISPLAY) {
      const diffs = g3.ops.filter((o) => o.new !== site.m.STATS_DISPLAY[langOf(o.field)].googleRating).map((o) => `${o.id} : « ${o.new} » ≠ STATS_DISPLAY.${langOf(o.field)}.googleRating « ${site.m.STATS_DISPLAY[langOf(o.field)].googleRating} »`);
      extra(diffs.length === 0, `G3 : la note posée dans les articles est, au caractère près, celle de la source du site (STATS_DISPLAY.googleRating de src/data/stats.ts)`, diffs);
    } else extra(null, 'G3 : comparaison avec STATS_DISPLAY.googleRating non faite (source du site non chargée)');
  }
  // 7d. Metas : longueur (lot 7 : ≤ 155 ; seo-lint : ≤ 160) et jamais de prix de L'Appart, de jeton…
  for (const c of changes.filter((x) => !TOKEN_FIELDS.includes(x.field))) {
    const n = cpLength(c.to);
    extra(n <= META_MAX && n >= META_MIN, `${c.slug}.${c.field} : ${n} caractères (cible ${META_MIN} à ${META_MAX}, seo-lint alerte au-delà de 160 ; avant : ${c.fromLen})`);
  }
  // 7e. Concurrents dans les textes ajoutés (liste locale ; les noms ne sont jamais écrits ici).
  const matchers = await competitorMatchers();
  if (matchers) {
    const hits = [];
    for (const c of changes) for (const o of c.ops) for (const k of ['new', 'text']) if (o[k]) for (const h of scanText(o[k], matchers)) { const was = (o.old ?? o.oldText ?? '') && scanText(o.old ?? o.oldText ?? '', matchers).some((x) => x.name === h.name); hits.push(`${o.id} : un nom de la liste des concurrents ${was ? '(déjà présent dans le texte d\'origine)' : '(AJOUTÉ par l\'opération)'}`); }
    extra(hits.length === 0, `Aucun concurrent de la liste locale (scripts/competitors.local.json) dans les textes ajoutés`, hits);
  } else extra(null, 'Concurrents : liste locale absente, scan non fait');
  // 7f. Vouvoiement (FR commercial = tutoiement) dans les textes ajoutés.
  const VOUS_RE = /(?<![\p{L}-])(vous|votre|vos)(?![\p{L}])/iu;
  const vous = [];
  for (const c of changes.filter((x) => x.field.endsWith('_fr'))) for (const o of c.ops) for (const k of ['new', 'text']) if (o[k] && VOUS_RE.test(o[k])) vous.push(`${o.id} : vouvoiement dans le texte ajouté`);
  extra(vous.length === 0, 'Tutoiement : aucun « vous / votre / vos » dans les textes français ajoutés', vous);
  // 7g. L'Appart : jamais le jour d'ouverture (docs/claude/lappart.md, V2-22) — F1-h du brief ajoute « 1er février 2027 ».
  const dayRe = /\b1(?:er)? (?:février|February) 2027\b/;
  const days = [];
  for (const c of changes) for (const o of c.ops) for (const k of ['new', 'text']) if (o[k] && dayRe.test(o[k])) days.push(`${o.id} : « ${preview(o[k].match(dayRe)[0])} » — règle V2-22 (docs/claude/lappart.md : « jamais le jour », forme fixe « L'Appart ouvre à la location en février 2027 ») ; le brief (F1-h) dit la date validée pour /tarifs : à confirmer que V2-22 est levée`);
  extra(days.length ? null : true, 'L\'Appart : aucun jour d\'ouverture dans les textes ajoutés (V2-22)', days);
  // 7h. € et CHF dans une même phrase des textes ajoutés (règle CLAUDE.md § 1 : « hors chaînes de la source unique »).
  const mixed = [];
  for (const c of changes) for (const o of c.ops) for (const k of ['new', 'text']) {
    if (!o[k]) continue;
    const n = sentencesOf(o[k]).filter((s) => /CHF/.test(s) && /€/.test(s) && !/^\|/.test(s)).length;
    if (n) mixed.push(`${o.id} : ${n} phrase(s) avec € et CHF`);
  }
  extra(mixed.length ? null : true, `€ et CHF dans une même phrase (hors lignes de tableau) : ${mixed.length ? `${mixed.length} opération(s) concernée(s) — textes validés par Jérôme (F1) ; à garder en tête si la règle de CLAUDE.md § 1 s'applique aussi aux prix du marché` : 'aucune'}`, mixed);
  // 7i. Bloc entité (8 articles, coupe de repli avant le dernier titre des 40 % finaux) et mention A.7 du groupe Facebook.
  if (site.m?.fallbackEntityFactsCut && site.m?.ENTITY_FACTS_ARTICLES) {
    for (const c of contentChanges.filter((x) => site.m.ENTITY_FACTS_ARTICLES.has(x.slug))) {
      const lang = langOf(c.field);
      const cut = (md) => { const r = renderMd(md, lang); const p = site.m.fallbackEntityFactsCut(r); return p ? sectionOf(r, p.index + 1).replace(/\s+/g, ' ') : '(fin de l\'article)'; };
      const b = cut(c.from), a = cut(c.to);
      extra(b === a ? true : null, `Bloc « l'essentiel » de ${c.slug} (${lang}) : inséré avant « ${preview(a, 70)} »${b === a ? ' (inchangé)' : ` (avant : « ${preview(b, 70)} »)`}`);
    }
  }
  if (site.m?.FACEBOOK_MENTION_ARTICLES) {
    for (const c of contentChanges) {
      const anchor = site.m.FACEBOOK_MENTION_ARTICLES[c.slug]?.[langOf(c.field)];
      if (!anchor) continue;
      const b = countOccurrences(c.from, anchor), a = countOccurrences(c.to, anchor);
      extra(a === b && a === 1, `Ancre de la mention du groupe Facebook (A.7) dans ${c.slug} (${langOf(c.field)}) : « ${preview(anchor.trim(), 40)} » ${a} fois après (${b} avant)`);
    }
  }
  // 7j. Retours chariot, tabulations.
  const odd = changes.filter((c) => /[\r\t]/.test(c.to)).map((c) => `${c.slug}.${c.field} : retour chariot ou tabulation dans le nouveau texte`);
  extra(odd.length === 0, 'Aucun retour chariot ni tabulation dans les nouveaux textes (fins de ligne \\n seulement)', odd);

  // 8. Temps de lecture (brief § 3.6) : saisi, pas calculé — proposition.
  const readTime = [];
  let readTimeProposal = null;
  {
    const row = bySlug.get(BUDGET_SLUG);
    const fr = changes.find((c) => c.slug === BUDGET_SLUG && c.field === 'content_fr');
    const en = changes.find((c) => c.slug === BUDGET_SLUG && c.field === 'content_en');
    if (row && fr && en) {
      const w = { frB: wordCount(fr.from), frA: wordCount(fr.to), enB: wordCount(en.from), enA: wordCount(en.to) };
      const prop = Math.round((row.read_time_min * w.frA) / w.frB);
      readTime.push(`\`read_time_min\` est SAISI : une colonne de blog_posts, affichée telle quelle (« ${row.read_time_min} min ») par la page de l'article, l'index du blog et le bloc « derniers articles » ; modifiable dans le tableau de bord (DashboardBlogPage) ; seul scripts/build-article-sql.mjs le calcule, à la création d'une page de décision (mots ÷ 200, arrondi au-dessus).`);
      readTime.push(`Article du budget aujourd'hui : ${row.read_time_min} min pour ${fmtInt(w.frB)} mots en français (${fmtInt(w.enB)} en anglais), soit ${Math.round(w.frB / row.read_time_min)} mots/min. Après modification : ${fmtInt(w.frA)} mots (+${Math.round((100 * (w.frA - w.frB)) / w.frB)} %) et ${fmtInt(w.enA)} en anglais (+${Math.round((100 * (w.enA - w.enB)) / w.enB)} %).`);
      readTime.push(`Proposition : **${prop} min** (même rythme qu'aujourd'hui, appliqué au nouveau texte français). Avec la règle des pages de décision (200 mots/min), ce serait ${readTimeMin(w.frA)} min (${readTimeMin(w.enA)} en anglais) — mais seuls 12 articles sur 43 suivent cette règle. Le SQL ne le change pas : une ligne commentée l'attend, à activer sur décision de Jérôme.`);
      readTimeProposal = { current: row.read_time_min, proposal: prop };
    }
  }

  const report = {
    briefOk: post.length === 0, pre, preLines, post, postLines, extraLines, extraDetails, readTime, tables, tokens,
  };
  const generatedAt = new Date().toISOString();
  const ctx = {
    report, changes, site, generatedAt, readAt, source, opsPath, opsMd5: md5(opsRaw), g3Path, g3Md5: g3Raw ? md5(g3Raw) : null,
    sqlPath, backupPath, dateLabel: `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`,
  };

  // 9. Documents lisibles (toujours, dès que les contrôles d'avant calcul sont passés).
  await fs.mkdir(docsDir, { recursive: true });
  const written = [];
  const lot4 = changes.filter((c) => c.part === 'lot4');
  for (const [i, c] of lot4.entries()) {
    const p = path.join(docsDir, `DIFF_${i + 1}_${SHORT[c.slug] ?? c.slug}_${c.field}.md`);
    await fs.writeFile(p, renderFieldDoc(c, ctx), 'utf8');
    written.push(p);
  }
  const g3Changes = changes.filter((c) => c.part === 'g3');
  if (g3Changes.length) {
    const p = path.join(docsDir, 'DIFF_G3_note_google.md');
    const head = [
      '# G3 — note Google dans deux articles (hors des opérations du brief)',
      '',
      `Essai à blanc du ${ctx.dateLabel}. **Rien n'est écrit dans la base.** Décision de Jérôme du 24/11/2026 : la note Google écrite en clair dans ces deux articles passe au relevé du 23/11/2026, dans la même séance SQL que le lot 4. Liste séparée : \`scripts/${path.basename(g3Path)}\`. Recherche faite en lecture seule sur tous les articles (titres, extraits, metas, textes, posts Facebook, brouillons compris) : la note n'est écrite qu'à ces quatre endroits. Le lien « voir les avis » / « see the reviews » qui suit la note dans les deux articles ne change pas.`,
      '',
      'Comment lire : « Ce qui change » marque `{-le texte retiré-}` et `{+le texte ajouté+}`.',
      '',
      '',
    ].join('\n');
    await fs.writeFile(p, head + g3Changes.map((c) => renderFieldDoc(c, ctx, { h: 2, compact: true })).join('\n'), 'utf8');
    written.push(p);
  }
  const controlsPath = path.join(docsDir, `CONTROLES_essai_a_blanc_${date}.md`);

  // 10. SQL (seulement si tous les contrôles du brief sont au vert).
  let sqlOk = false;
  if (report.briefOk) {
    const allTexts = changes.flatMap((c) => [c.from, c.to]);
    const tags = { text: pickTag('budget_reel_texte', allTexts), block: pickTag('budget_reel_bloc', allTexts) };
    const ordered = [...changes.filter((c) => c.part === 'lot4'), ...changes.filter((c) => c.part === 'g3')];
    const total = ordered.length;
    const blocks = ordered.map((c, i) => ({ c, sql: renderFieldBlock({ n: i + 1, total, slug: c.slug, field: c.field, fromMd5: c.fromMd5, toMd5: c.toMd5, value: c.to }, tags) }));
    const offline = postsJson ? ['-- !!! HORS LIGNE : contenu lu dans un fichier, pas en base — NE PAS APPLIQUER ; régénérer sans --posts-json. !!!'] : [];
    const header = [
      '-- ============================================================================',
      '-- Lot 4 « budget réel » — articles du blog (brief de Jérôme du 24/11/2026) + G3 (note Google, décision de Jérôme du 24/11/2026)',
      `-- Généré le ${generatedAt} par scripts/blog-budget-reel.mjs (essai à blanc : contrôles du brief § 3.3 et § 3.4 au vert)`,
      `--   · opérations : ${path.basename(opsPath)} (md5 ${ctx.opsMd5}) — ${main1.ops.length} opérations, partie 1`,
      ...(withG3 ? [`--   · G3 : scripts/${path.basename(g3Path)} (md5 ${ctx.g3Md5}) — ${g3.ops.length} opérations, partie 2, à part`] : []),
      `--   · contenu lu le ${readAt} (${source})`,
      ...offline,
      '-- NE PAS EXÉCUTER SANS LE GO EXPLICITE DE JÉRÔME sur le diff (brief § 3.2 et § 7), juste avant la construction et le déploiement',
      '-- des lots 1 et 2 (brief § 3.5). Juste avant : exécuter ' + path.basename(backupPath) + ' et enregistrer le résultat complet',
      '-- (fichier daté, hors du site public — modèle : scripts/backups/<lot>-<date>.avant.json).',
      '-- Une seule transaction. Chaque champ est gardé par l\'empreinte md5 COMPLÈTE de sa valeur au moment de l\'essai à blanc ; une ligne',
      '-- absente, une empreinte différente, un UPDATE qui ne touche pas exactement une ligne ou un texte écrit dont l\'empreinte n\'est pas',
      '-- celle calculée lève une exception : tout est annulé, rien n\'est écrit. Relancer le fichier après succès échoue à la première',
      '-- garde (empreinte « avant » disparue) : sans effet. Le déclencheur blog_posts_updated_at met aussi updated_at à now().',
      '-- Fichier UTF-8 : il contient des espaces insécables (U+00A0) et des caractères typographiques (« – », « — », « € », « ’ ») ;',
      '-- ne pas le faire transiter par un éditeur ou un outil qui normalise les espaces ou les apostrophes (la dernière garde le verrait).',
      `-- ${total} champs (avant → après : longueur en caractères, md5) :`,
      ...ordered.map((c, i) => `--   [${i + 1}/${total}] ${c.part === 'g3' ? 'G3 · ' : ''}${c.slug}.${c.field} · ${c.ops.length} op. · ${c.fromLen} → ${c.toLen} · ${c.fromMd5} → ${c.toMd5}`),
      '-- ============================================================================',
    ];
    const rt = readTimeProposal;
    const parts = [
      header.join('\n'),
      'BEGIN;',
      `-- ══ Partie 1 — les ${main1.ops.length} opérations du fichier JSON du brief (3 articles, ${lot4.length} champs) ══════════════════════════`,
      ...blocks.filter((b) => b.c.part === 'lot4').map((b, i) => `-- [${i + 1}/${total}] ${b.c.slug}.${b.c.field} — ${b.c.ops.length} opération(s) : ${b.c.ops.map((o) => o.id).join(', ')}\n${b.sql}`),
      ...(rt ? [`-- Temps de lecture de l'article du budget (brief § 3.6) : SAISI (${rt.current} min aujourd'hui). Proposition : ${rt.proposal} min.\n-- Hors des 8 champs du brief : ligne à décommenter SEULEMENT sur décision de Jérôme.\n-- UPDATE public.${TABLE} SET read_time_min = ${rt.proposal} WHERE slug = ${sqlString(BUDGET_SLUG)} AND read_time_min = ${rt.current};`] : []),
      ...(g3Changes.length ? [`-- ══ Partie 2 — G3 : note Google (2 articles, ${g3Changes.length} champs), HORS des opérations du brief ═════════════════════════`,
        ...blocks.filter((b) => b.c.part === 'g3').map((b, i) => `-- [${lot4.length + i + 1}/${total}] G3 · ${b.c.slug}.${b.c.field} — ${b.c.ops.map((o) => `${o.id} : « ${o.old} » → « ${o.new} »`).join(' ; ')}\n${b.sql}`)] : []),
      'COMMIT;',
      `-- ── Vérification (lecture seule, après COMMIT) : ok = true sur les ${total} lignes ──\n${renderVerification(ordered)}`,
    ];
    const sql = parts.join('\n\n') + '\n';
    const selfIssues = sqlSelfCheck(sql, ordered, tags.text);
    if (selfIssues.length) { report.post.push(...selfIssues); report.briefOk = false; report.postLines.push([false, 'Relecture du SQL produit (textes dollar-quotés)']); }
    else {
      report.postLines.push([true, `Relecture du SQL produit : les ${total} textes dollar-quotés, relus dans le fichier, ont l'empreinte attendue par leur garde`]);
      const slugsAll = [...new Set(ordered.map((c) => c.slug))].sort();
      const conform = slugsAll.map((s) => {
        const cs = ordered.filter((c) => c.slug === s);
        return `         WHEN ${sqlString(s)} THEN ${cs.map((c) => `md5(b.${c.field}) = '${c.fromMd5}'`).join(' AND ')}`;
      });
      const backup = [
        '-- ============================================================================',
        `-- Sauvegarde AVANT écriture — lecture seule (SELECT). Lot 4 « budget réel »${g3Changes.length ? ' + G3' : ''} — généré le ${generatedAt} par scripts/blog-budget-reel.mjs.`,
        `-- À exécuter juste AVANT ${path.basename(sqlPath)}, après le GO de Jérôme. Enregistrer le résultat COMPLET (une ligne par article ;`,
        '-- colonne « ligne » = la ligne entière en JSON) dans un fichier daté, hors du site public — modèle du dépôt :',
        `-- scripts/backups/blog-budget-reel-${date}.avant.json (comme scripts/backups/a1-alignement-2026-11-02.avant.json).`,
        '-- « etat_conforme » doit valoir true sur chaque ligne : les champs sont ceux de l\'essai à blanc. Sinon, ne pas écrire.',
        '-- ============================================================================',
        `SELECT b.slug, now() AS sauvegarde_le, b.updated_at, b.read_time_min,`,
        '       CASE b.slug',
        conform.join('\n'),
        '       END AS etat_conforme,',
        '       md5(b.content_fr) AS md5_content_fr, md5(b.content_en) AS md5_content_en,',
        '       md5(b.meta_description_fr) AS md5_meta_description_fr, md5(b.meta_description_en) AS md5_meta_description_en,',
        '       to_jsonb(b) AS ligne',
        `FROM public.${TABLE} b`,
        `WHERE b.slug IN (${slugsAll.map(sqlString).join(', ')})`,
        'ORDER BY b.slug;',
      ].join('\n') + '\n';
      await fs.writeFile(sqlPath, sql, 'utf8');
      await fs.writeFile(backupPath, backup, 'utf8');
      written.push(sqlPath, backupPath);
      sqlOk = true;
      if (rollbackPath) {
        // Retour arrière compact, 100 % ASCII (même forme que la séance) : opérations inverses appliquées au NOUVEAU texte,
        // gardées par son empreinte ; le résultat recalculé doit redonner l'empreinte d'origine avant l'UPDATE.
        const back = ordered.map((c, i) => ({ ...c, n: i + 1, total, ops: reverseOps(c.ops, c.from), fromMd5: c.toMd5, toMd5: c.fromMd5, fromLen: c.toLen, toLen: c.fromLen }));
        const rbIssues = back.filter((c) => md5(simulateSeance(c.to, c.ops)) !== c.toMd5).map((c) => `retour arrière : ${c.slug}.${c.field} — les opérations inverses ne redonnent pas le texte d'origine`);
        const rtag = pickTag('r', back.flatMap((c) => c.ops.map(seanceExpr)));
        const rb = [
          [
            '-- ============================================================================',
            `-- RETOUR ARRIERE du lot 4 "budget reel"${g3Changes.length ? ' + G3' : ''} -- genere le ${generatedAt} par scripts/blog-budget-reel.mjs --retour-arriere.`,
            '-- 100 % ASCII. Remet les textes d\'origine (ceux de l\'essai a blanc, identiques a la sauvegarde si les gardes de l\'ecriture sont passees)',
            '-- par les operations inverses. Chaque champ est garde par l\'empreinte du NOUVEAU texte (sans effet si l\'ecriture n\'a pas eu lieu ou si',
            '-- le champ a rechange) ; le resultat recalcule doit avoir l\'empreinte d\'origine avant l\'UPDATE. Une transaction : toute anomalie annule tout.',
            '-- updated_at ne revient pas a sa valeur d\'origine (le declencheur blog_posts_updated_at le met a now()).',
            '-- ============================================================================',
          ].join('\n'),
          'BEGIN;',
          ...back.map((c) => `-- [${c.n}/${total}] ${c.part === 'g3' ? 'G3 - ' : ''}${c.slug}.${c.field}\n${renderSeanceBlock(c, rtag)}`),
          'COMMIT;',
          `-- Verification (lecture seule) : ok = true sur les ${total} lignes\n${renderVerification(ordered, { expect: 'from' })}`,
        ].join('\n\n') + '\n';
        if (/[^\x0a\x20-\x7e]/.test(rb)) rbIssues.push('retour arrière : caractère hors ASCII dans le fichier');
        if (rbIssues.length) report.extraLines.push([false, `Retour arrière NON écrit : ${rbIssues.join(' ; ')}`]);
        else {
          await fs.writeFile(rollbackPath, rb, 'utf8');
          written.push(rollbackPath);
          report.extraLines.push([true, `Retour arrière (100 % ASCII, ${Math.round(Buffer.byteLength(rb) / 1024)} Ko) : les opérations inverses, simulées, redonnent l'empreinte d'origine des ${total} champs`]);
        }
      }
      if (seancePath) {
        // Variante « séance » (100 % ASCII, compacte) : relue avant d'être écrite — simulation, ASCII, littéraux relus.
        const sc = ordered.map((c, i) => ({ ...c, n: i + 1, total }));
        const seanceIssues = sc.filter((c) => md5(simulateSeance(c.from, c.ops)) !== c.toMd5).map((c) => `séance : ${c.slug}.${c.field} — la simulation des fonctions de Postgres ne redonne pas le texte de l'essai`);
        const stag = pickTag('s', sc.flatMap((c) => c.ops.map(seanceExpr)));
        const lot4n = sc.filter((c) => c.part === 'lot4').length;
        const seanceSql = [
          [
            '-- ============================================================================',
            `-- Seance du lot 4 "budget reel" (articles du blog, brief de Jerome du 24/11/2026)${g3Changes.length ? ' + G3 (note Google)' : ''} : variante 100 % ASCII`,
            `-- et compacte de scripts/${path.basename(sqlPath)}, generee le ${generatedAt} par scripts/blog-budget-reel.mjs --seance.`,
            '-- Elle pose les operations (litteraux Unicode echappes, aucun caractere hors ASCII) au lieu des textes entiers ; memes gardes :',
            '-- md5 complet de chaque champ avant, resultat recalcule en base et compare au md5 de l\'essai a blanc AVANT l\'UPDATE, une seule',
            '-- ligne touchee par UPDATE, une seule transaction : toute anomalie annule tout. NE PAS EXECUTER SANS LE GO EXPLICITE DE JEROME.',
            `-- Juste avant : scripts/${path.basename(backupPath)} (sauvegarde des lignes completes, fichier date hors du site public).`,
            ...(postsJson ? ['-- !!! HORS LIGNE : contenu lu dans un fichier, pas en base -- NE PAS APPLIQUER. !!!'] : []),
            ...sc.map((c) => `--   [${c.n}/${total}] ${c.part === 'g3' ? 'G3 - ' : ''}${c.slug}.${c.field} : ${c.ops.length} op. ; ${c.fromLen} -> ${c.toLen} caracteres ; md5 ${c.fromMd5} -> ${c.toMd5}`),
            '-- ============================================================================',
          ].join('\n'),
          'BEGIN;',
          `-- == Partie 1 : les ${main1.ops.length} operations du fichier JSON du brief (${lot4n} champs) ==`,
          ...sc.filter((c) => c.part === 'lot4').map((c) => `-- [${c.n}/${total}] ${c.slug}.${c.field}\n${renderSeanceBlock(c, stag)}`),
          ...(g3Changes.length ? [`-- == Partie 2 : G3, note Google (${sc.length - lot4n} champs), HORS des operations du brief ==`,
            ...sc.filter((c) => c.part === 'g3').map((c) => `-- [${c.n}/${total}] G3 - ${c.slug}.${c.field}\n${renderSeanceBlock(c, stag)}`)] : []),
          'COMMIT;',
          `-- Verification (lecture seule, apres COMMIT) : ok = true sur les ${total} lignes\n${renderVerification(ordered)}`,
        ].join('\n\n') + '\n';
        if (/[^\x0a\x20-\x7e]/.test(seanceSql)) seanceIssues.push('séance : caractère hors ASCII dans le fichier');
        const expectedLits = sc.flatMap((c) => c.ops.flatMap((o) => (o.op === 'replace' ? [o.old, o.new] : o.op === 'insert_before' ? [o.anchor, o.text + o.anchor] : o.op === 'replace_section' ? [o.start, o.new, o.end] : [o.new])));
        const foundLits = [...seanceSql.matchAll(/U&'(?:[^']|'')*'/g)].map((x) => decodeSqlAscii(x[0]));
        if (foundLits.length !== expectedLits.length || foundLits.some((s, i) => s !== expectedLits[i])) seanceIssues.push(`séance : littéraux relus ≠ opérations (${foundLits.length} lus, ${expectedLits.length} attendus)`);
        if (seanceIssues.length) { report.extraLines.push([false, `Variante séance NON écrite : ${seanceIssues.join(' ; ')}`]); }
        else {
          await fs.writeFile(seancePath, seanceSql, 'utf8');
          written.push(seancePath);
          report.extraLines.push([true, `Variante séance (100 % ASCII, ${Math.round(Buffer.byteLength(seanceSql) / 1024)} Ko au lieu de ${Math.round(Buffer.byteLength(sql) / 1024)} Ko) : simulation des fonctions de Postgres = texte de l'essai pour les ${total} champs ; ${foundLits.length} littéraux relus à l'identique`]);
        }
      }
    }
  }
  await fs.writeFile(controlsPath, renderControlsDoc(ctx), 'utf8');
  written.push(controlsPath);
  return finish({ pre, preLines, post: report.post, postLines: report.postLines, extraLines, extraDetails, readTime, written, sqlOk, changes });
}

/** Phrase du nouveau texte qui contient `needle` (pour lire une petite modification dans son contexte). */
function contextSentence(text, needle) {
  const i = text.indexOf(needle);
  if (i === -1) return null;
  const lineStart = text.lastIndexOf('\n', i) + 1;
  const lineEnd = text.indexOf('\n', i + needle.length);
  const line = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);
  if (line.trim().startsWith('|')) return null;
  return line.length <= 700 ? line : null;
}

async function readFile(p, label) {
  try { return await fs.readFile(p, 'utf8'); } catch (err) { throw new Error(`${label} illisible (${p}) : ${err.code ?? err.message}`); }
}

function finish(r) {
  const icon = (ok) => (ok === true ? '✓' : ok === false ? '✗' : '⚠');
  console.log('\nAvant calcul (brief § 3.3)');
  for (const [ok, t] of r.preLines ?? []) console.log(`  ${icon(ok)} ${t}`);
  if (r.pre?.length) {
    console.error(`\n✗ ${r.pre.length} échec(s) avant calcul — RIEN n'est écrit (ni document, ni SQL) :`);
    for (const f of r.pre) console.error(`  - ${f}`);
    process.exitCode = 1;
    return;
  }
  console.log('\nAprès calcul (brief § 3.4)');
  for (const [ok, t] of r.postLines ?? []) console.log(`  ${icon(ok)} ${t}`);
  console.log('\nComplémentaires (hors brief)');
  for (const [ok, t] of r.extraLines ?? []) console.log(`  ${icon(ok)} ${t}`);
  for (const d of r.extraDetails ?? []) console.log(`      · ${d}`);
  console.log('\nTemps de lecture');
  for (const l of r.readTime ?? []) console.log(`  · ${l.replace(/\*\*/g, '')}`);
  console.log('\nChamps modifiés');
  for (const c of r.changes ?? []) console.log(`  ${c.part === 'g3' ? 'G3  ' : 'lot4'} ${c.slug}.${c.field} · ${c.ops.length} op. · ${c.fromLen} → ${c.toLen} caractères`);
  console.log('\nFichiers écrits');
  for (const p of r.written ?? []) console.log(`  ${p}`);
  if (r.post?.length) {
    console.error(`\n✗ ${r.post.length} échec(s) après calcul — documents écrits pour comprendre, SQL NON écrit :`);
    for (const f of r.post) console.error(`  - ${f}`);
    process.exitCode = 1;
    return;
  }
  console.log(`\n✓ Essai à blanc au vert${r.sqlOk ? ' — SQL prêt pour la séance (après le GO de Jérôme)' : ''}. Aucune écriture en base.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => { console.error(`✗ ${err.message}`); process.exit(1); });
}
