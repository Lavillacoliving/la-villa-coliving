#!/usr/bin/env node
/**
 * Variante « séance » d'un lot déclaratif de scripts/build-slots-sql.mjs (24/11/2026, lot 2 « Programmer une visite » : articles
 * du blog) — la forme qu'un SEUL appel (execute_sql du connecteur Supabase, ou un seul collage dans le SQL Editor) applique d'un
 * bloc : 100 % ASCII (littéraux U&'' : accents, tirets cadratins, flèches et espaces insécables ne transitent pas), compacte (les
 * substitutions, pas les textes entiers), gardée par l'empreinte md5 COMPLÈTE de chaque champ avant et après. Même modèle que la
 * variante --seance de scripts/blog-budget-reel.mjs (lot 4 « budget réel », même jour), dont il reprend les fonctions pures
 * (sqlAscii, decodeSqlAscii, md5, cpLength, pseudoHtml).
 *
 *   node scripts/build-seance-sql.mjs --edits ./visite-articles.edits.mjs --name visite-articles --date 2026-11-24 --expect-published 43
 *   options : --posts-json <fichier>  (hors ligne : contrôles et rapport seulement, ni SQL ni sauvegarde)
 *
 * AUCUNE ÉCRITURE EN BASE, JAMAIS : lecture REST avec la clé anon (SELECT), relue dans scripts/check-entity-facts.mjs (ni recopiée
 * ni affichée). Le SQL produit s'applique plus tard, après le GO explicite de Jérôme.
 *
 * Écrit, si tout est au vert :
 *   scripts/<name>-<date>.seance.sql                   la séance : BEGIN, un bloc DO (nombre d'articles publiés, md5 d'entrée de
 *                                                      chaque champ, substitutions, md5 du résultat AVANT chaque UPDATE, une ligne
 *                                                      par UPDATE, md5 de sortie de tous les champs), COMMIT, vérification
 *   scripts/backups/<name>-<date>.avant.json           instantané des articles touchés (lecture seule : l'état que la séance remplace)
 *   scripts/backups/<name>-<date>.attendu-apres.json   md5 attendu de chaque champ après la séance
 *   scripts/backups/<name>-<date>.retour-arriere.sql   retour arrière compact, 100 % ASCII (substitutions inverses), gardé par les
 *                                                      md5 d'après, résultat comparé aux md5 d'avant
 * et toujours : tools/out/<name>-<date>.gardes.md (rapport des contrôles, gitignoré).
 *
 * Contrôles (un seul échec : ni SQL ni sauvegarde) :
 *  1. ceux de build-slots-sql sur chaque modification (exactement 1 occurrence de l'ancien texte, nouveau texte absent, chaînes
 *     interdites, concurrents de la liste locale) et la simulation séquentielle par champ ;
 *  2. la simulation des fonctions de Postgres (replace() enchaînés) redonne le texte calculé ; md5 et longueurs ;
 *  3. gardes du site rejouées sur le texte rendu de chaque champ (Markdown → HTML approché, jetons résolus), AVANT et APRÈS :
 *     check:slots (créneaux de L1_TARGETS, ancre du bloc « Où chercher », promesses garant, phrases d'appel cassées, questions 👉
 *     à lien, densité de la marque) et check:facts (chaînes interdites, note Google, « 15 min » + Genève, deux gammes, règle des
 *     minutes, phrases canoniques), vouvoiement : toute alerte qui APPARAÎT après la modification arrête tout ;
 *  4. sources des pages de décision (content/decision-pages/<slug>.<lang>.md) : chaque nouveau texte y est, l'ancien n'y est plus ;
 *  5. relecture des fichiers produits : 100 % ASCII, littéraux U&'' relus = substitutions, retour arrière simulé = md5 d'avant.
 * Fonctions pures exportées.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { columnOf, checkEdit, applyEdits, forbiddenIssues as insertedTextIssues, countOccurrences, preview, COLUMNS, POST_STATE_WATCH } from './build-slots-sql.mjs';
import { md5, cpLength, sqlAscii, decodeSqlAscii, pseudoHtml, sqlString } from './blog-budget-reel.mjs';
import { buildMatchers, scanText, parseNamesEnv } from './lib/competitor-scan.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, '..');
export const TABLE = 'blog_posts';

// ── Fonctions pures ────────────────────────────────────────────────────────────────────────────────

/** Texte ramené à l'ASCII imprimable (commentaires et messages du SQL) : accents retirés, guillemets et tirets simplifiés. */
export function asciiFold(s) {
  return String(s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[«“][   ]?/g, '"').replace(/[   ]?[»”]/g, '"').replace(/[‘’]/g, "'").replace(/[—–]/g, '-').replace(/→/g, '->')
    .replace(/[   ]/g, ' ').replace(/°/g, 'o').replace(/·/g, '-').replace(/§/g, 'par.').replace(/…/g, '...').replace(/€/g, 'EUR')
    .replace(/[^\x20-\x7e]/g, '?');
}
/** Message RAISE : ASCII, « ' » doublée, « % » littéral doublé. */
const raiseText = (s) => asciiFold(s).replace(/'/g, "''").replace(/%/g, '%%');

/** Application façon Postgres : replace() remplace TOUTES les occurrences, dans l'ordre des substitutions. */
export function simulateReplaces(text, ops) {
  let v = String(text);
  for (const o of ops) v = v.split(o.find).join(o.replace);
  return v;
}
/** Substitutions inverses (retour arrière) : dans l'ordre inverse, nouveau → ancien. */
export function reverseReplaces(ops) {
  return [...ops].reverse().map((o) => ({ ...o, find: o.replace, replace: o.find }));
}

/** Champs touchés, dans l'ordre slug puis colonne (ordre de COLUMNS) ; `rows` = lignes vivantes par slug. */
export function groupChanges(edits, rowsBySlug) {
  const keys = [];
  for (const e of edits) { const k = `${e.slug}\u0000${columnOf(e)}`; if (!keys.includes(k)) keys.push(k); }
  keys.sort((a, b) => {
    const [sa, ca] = a.split('\u0000'); const [sb, cb] = b.split('\u0000');
    return sa < sb ? -1 : sa > sb ? 1 : COLUMNS.indexOf(ca) - COLUMNS.indexOf(cb);
  });
  return keys.map((k, i) => {
    const [slug, field] = k.split('\u0000');
    const ops = edits.filter((e) => e.slug === slug && columnOf(e) === field);
    const from = rowsBySlug.get(slug)?.[field];
    const sim = typeof from === 'string' ? applyEdits(from, ops) : { text: undefined, failures: [`${slug}.${field} : champ absent en base`] };
    return { n: i + 1, total: keys.length, slug, field, lang: field.endsWith('_en') ? 'en' : 'fr', ops, from, to: sim.text, simFailures: sim.failures,
      fromMd5: typeof from === 'string' ? md5(from) : null, toMd5: typeof sim.text === 'string' ? md5(sim.text) : null,
      fromLen: typeof from === 'string' ? cpLength(from) : null, toLen: typeof sim.text === 'string' ? cpLength(sim.text) : null };
  });
}

/** CASE SQL qui choisit la colonne `champ` de la ligne `b` parmi les colonnes du lot. */
export function fieldCase(fields, champ = 'e.champ', alias = 'b') {
  return `CASE ${champ} ${fields.map((f) => `WHEN ${sqlString(f)} THEN ${alias}.${f}`).join(' ')} END`;
}

/** Une étape du bloc DO : lire le champ, enchaîner les replace(), comparer le md5 du résultat AVANT d'écrire, une ligne écrite. */
export function renderStep(c, name, { ops = c.ops, fromMd5 = c.fromMd5, toMd5 = c.toMd5, fromLen = c.fromLen, toLen = c.toLen } = {}) {
  const label = raiseText(`${name} [${c.n}/${c.total}] ${c.slug}.${c.field}`);
  const slug = sqlString(c.slug);
  return [
    `  -- [${c.n}/${c.total}] ${c.slug}.${c.field} : ${ops.length} substitution(s), ${fromLen} -> ${toLen} caracteres`,
    ...ops.map((o) => `  --   ${asciiFold(o.note ?? '').slice(0, 150)}`),
    `  SELECT ${c.field} INTO v FROM public.${TABLE} WHERE slug = ${slug};`,
    ...ops.map((o) => `  v := replace(v, ${sqlAscii(o.find)}, ${sqlAscii(o.replace)});`),
    `  IF md5(v) IS DISTINCT FROM '${toMd5}' THEN RAISE EXCEPTION '${label} : resultat calcule md5 % au lieu de ${toMd5} -- tout est annule', md5(v); END IF;`,
    `  UPDATE public.${TABLE} SET ${c.field} = v, updated_at = now() WHERE slug = ${slug} AND md5(${c.field}) = '${fromMd5}';`,
    '  GET DIAGNOSTICS n = ROW_COUNT;',
    `  IF n <> 1 THEN RAISE EXCEPTION '${label} : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;`,
  ].join('\n');
}

/**
 * Bloc DO complet (séance ou retour arrière). `side` = 'aller' (md5 d'entrée = fromMd5) ou 'retour' (entrée = toMd5, substitutions
 * inverses, sortie = fromMd5). `expectPublished` (aller seulement) : nombre d'articles publiés exigé avant toute écriture.
 */
export function renderDoBlock(changes, { name, side = 'aller', expectPublished = null, tag = 's' }) {
  const fields = [...new Set(changes.map((c) => c.field))];
  const slugs = [...new Set(changes.map((c) => c.slug))].sort();
  const enter = (c) => (side === 'aller' ? c.fromMd5 : c.toMd5);
  const exit = (c) => (side === 'aller' ? c.toMd5 : c.fromMd5);
  const values = (pick) => changes.map((c) => `    (${sqlString(c.slug)}, ${sqlString(c.field)}, '${pick(c)}')`).join(',\n');
  const who = raiseText(name);
  const lines = [
    `DO $${tag}$`,
    'DECLARE',
    '  n integer;',
    '  v text;',
    '  ecarts text;',
    'BEGIN',
  ];
  if (side === 'aller' && Number.isInteger(expectPublished)) {
    lines.push(
      `  -- 0. nombre d'articles publies : ${expectPublished}`,
      `  SELECT count(*) INTO n FROM public.${TABLE} WHERE is_published IS TRUE;`,
      `  IF n <> ${expectPublished} THEN RAISE EXCEPTION '${who} : % article(s) publie(s) au lieu de ${expectPublished} -- rien n''est ecrit', n; END IF;`,
    );
  }
  lines.push(
    `  -- 1. ${slugs.length} articles, une ligne chacun${side === 'aller' ? ', tous publies' : ''}`,
    `  SELECT count(*) INTO n FROM public.${TABLE} WHERE slug IN (${slugs.map(sqlString).join(', ')})${side === 'aller' ? ' AND is_published IS TRUE' : ''};`,
    `  IF n <> ${slugs.length} THEN RAISE EXCEPTION '${who} : % ligne(s) au lieu de ${slugs.length} -- rien n''est ecrit', n; END IF;`,
    `  -- 2. garde d'entree : md5 complet de chaque champ = ${side === 'aller' ? 'etat de la preparation' : 'etat attendu apres la seance'}`,
    "  SELECT string_agg(e.slug || '.' || e.champ, ', ' ORDER BY e.slug, e.champ) INTO ecarts FROM (VALUES",
    values(enter),
    '  ) AS e(slug, champ, md5_attendu)',
    `  LEFT JOIN public.${TABLE} b ON b.slug = e.slug`,
    `  WHERE b.slug IS NULL OR md5(${fieldCase(fields)}) IS DISTINCT FROM e.md5_attendu;`,
    `  IF ecarts IS NOT NULL THEN RAISE EXCEPTION '${who} : champ(s) different(s) de l''etat attendu, rien n''est ecrit -- %', ecarts; END IF;`,
    `  -- 3. ${changes.length} champs, un par un`,
    ...changes.map((c) => renderStep(c, name, side === 'aller' ? {} : { ops: reverseReplaces(c.ops), fromMd5: c.toMd5, toMd5: c.fromMd5, fromLen: c.toLen, toLen: c.fromLen })),
    `  -- 4. garde de sortie : md5 complet de chaque champ = ${side === 'aller' ? 'etat calcule a la preparation' : "etat d'avant la seance"}`,
    "  SELECT string_agg(e.slug || '.' || e.champ, ', ' ORDER BY e.slug, e.champ) INTO ecarts FROM (VALUES",
    values(exit),
    '  ) AS e(slug, champ, md5_attendu)',
    `  LEFT JOIN public.${TABLE} b ON b.slug = e.slug`,
    `  WHERE b.slug IS NULL OR md5(${fieldCase(fields)}) IS DISTINCT FROM e.md5_attendu;`,
    `  IF ecarts IS NOT NULL THEN RAISE EXCEPTION '${who} : etat obtenu different de l''etat attendu, tout est annule -- %', ecarts; END IF;`,
    'END',
    `$${tag}$;`,
  );
  return lines.join('\n');
}

/** Vérification en lecture seule : une ligne par champ, ok = md5 attendu (après la séance, ou d'avant pour le retour arrière). */
export function renderVerification(changes, { expect = 'apres' } = {}) {
  const fields = [...new Set(changes.map((c) => c.field))];
  const rows = changes.map((c) => `  (${sqlString(c.slug)}, ${sqlString(c.field)}, '${expect === 'apres' ? c.toMd5 : c.fromMd5}', ${expect === 'apres' ? c.toLen : c.fromLen})`);
  return [
    `SELECT e.slug, e.champ, md5(${fieldCase(fields)}) = e.md5_attendu AS ok, length(${fieldCase(fields)}) AS longueur, e.longueur_attendue, b.updated_at`,
    'FROM (VALUES',
    rows.join(',\n'),
    ') AS e(slug, champ, md5_attendu, longueur_attendue)',
    `JOIN public.${TABLE} b ON b.slug = e.slug`,
    'ORDER BY e.slug, e.champ;',
  ].join('\n');
}

/** Littéraux U&'' d'un fichier, décodés, dans l'ordre. */
export const asciiLiterals = (sql) => [...String(sql).matchAll(/U&'(?:[^']|'')*'/g)].map((x) => decodeSqlAscii(x[0]));
/** Le fichier n'a que de l'ASCII imprimable et des sauts de ligne. */
export const isAscii = (s) => !/[^\x0a\x20-\x7e]/.test(String(s));

/** Vouvoiement (même motif que la garde check:facts, texte visible français). */
export const vousCount = (text) => [...String(text).matchAll(/(?<!rendez-)\bvous\b|\bvotre\b|\bvos\b/gi)].length;

/**
 * Alertes des gardes du site sur le texte rendu d'un champ d'article (Markdown approché → HTML). `site` = { m, facts, slots }.
 * Retourne { issues: Set<string>, needles: Map<clé, bool>, anchorOk: bool|null, vous, brand }.
 */
export function pageReport(site, md, lang, slug) {
  const { m, facts, slots } = site;
  const resolved = m.resolveContentTokens(md, lang);
  const html = pseudoHtml(m.typoFr(resolved));
  const text = facts.visibleText(html);
  const file = `${lang === 'en' ? 'en-' : ''}blog-${slug}.html`;
  const issues = new Set();
  const add = (rule, list) => { for (const x of list) issues.add(`${rule} : ${x}`); };
  add('check:facts forbiddenIssues', facts.forbiddenIssues(html, text, file));
  add('check:facts googleRatingIssues', facts.googleRatingIssues(text, m));
  add('check:facts geneva15Issues', facts.geneva15Issues(html));
  add('check:facts gammeMixIssues', facts.gammeMixIssues(html, file, m, []));
  if (!/^(en-)?(observatoire|blog-(transport|temps-trajet|cout-transport))/.test(file)) add('check:facts minuteIssues', facts.minuteIssues(html, m.ENTITY_FACTS.genevaMinutes));
  add('check:facts canonicalSentenceIssues', facts.canonicalSentenceIssues(text, lang, {}, m));
  const guarded = slots.exemptForbidden(text);
  for (const fb of slots.FORBIDDEN_PHRASES) if (fb.re.test(guarded)) issues.add(`check:slots garant : ${fb.label}`);
  for (const b of slots.CTA_BROKEN_PATTERNS) if (b.re.test(text)) issues.add(`check:slots phrase d'appel cassée : ${b.label}`);
  for (const q of slots.ctaQuestionLinks(html)) issues.add(`check:slots question 👉 à lien : ${q.slice(0, 80)}`);
  // Créneaux exigés (L1_TARGETS) sur cet article.
  const needles = new Map();
  const target = slots.L1_TARGETS.find((t) => t.route === `/blog/${slug}`);
  for (const key of target?.needles ?? []) {
    let needle = null;
    try { needle = slots.resolveNeedle(m, key, lang); } catch { /* clé non résolue : comptée absente */ }
    needles.set(key, typeof needle === 'string' && (slots.hasNeedle(text, needle) || slots.hasNeedle(text, m.typoFr(needle))));
  }
  // Ancre du bloc « Où chercher » (allowlist) : le titre ou le marqueur doit rester.
  let anchorOk = null;
  const entry = m.OU_CHERCHER_ARTICLES?.[slug];
  if (entry) {
    const entityIndex = resolved.indexOf('<!-- entity-facts -->');
    anchorOk = m.resolveOuChercherCut(resolved, entry, lang, entityIndex === -1 ? null : entityIndex) !== null;
  }
  return { issues, needles, anchorOk, vous: lang === 'fr' ? vousCount(text) : 0, brand: slots.brandCount(text) };
}

/** Comparaison avant / après d'un champ : alertes nouvelles (bloquantes), levées, créneaux perdus, ancre perdue, vouvoiement, marque. */
export function compareReports(before, after, { brandMax = 12 } = {}) {
  const added = [...after.issues].filter((x) => !before.issues.has(x));
  const removed = [...before.issues].filter((x) => !after.issues.has(x));
  const lostNeedles = [...before.needles].filter(([k, ok]) => ok && !after.needles.get(k)).map(([k]) => k);
  const missingBoth = [...before.needles].filter(([k, ok]) => !ok && !after.needles.get(k)).map(([k]) => k);
  const anchorLost = before.anchorOk === true && after.anchorOk === false;
  const vousUp = after.vous > before.vous;
  const brandUp = after.brand > before.brand && after.brand > brandMax;
  return { added, removed, lostNeedles, missingBoth, anchorLost, vousUp, brandUp, blocking: added.length > 0 || lostNeedles.length > 0 || anchorLost || vousUp || brandUp };
}

/** Contrôle des sources des pages de décision : nouveau texte présent, ancien absent. `sources` = Map « slug.lang » → texte. */
export function decisionSourceIssues(edits, sources) {
  const failures = [], warnings = [], ok = [];
  for (const e of edits) {
    const src = sources.get(`${e.slug}.${e.lang}`);
    if (typeof src !== 'string') continue;
    const nF = countOccurrences(src, e.find), nR = countOccurrences(src, e.replace);
    const where = `content/decision-pages/${e.slug}.${e.lang}.md`;
    if (nF > 0) failures.push(`${where} : l'ancien texte est encore là (${nF}×) — « ${preview(e.find)} » (une republication le ramènerait)`);
    else if (nR === 0) warnings.push(`${where} : ni l'ancien ni le nouveau texte — « ${preview(e.replace)} » (source différente de la base ?)`);
    else ok.push(where);
  }
  return { failures, warnings, ok };
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
async function restGet(query) {
  const { url, key } = await supabaseAccess();
  const res = await fetch(`${url}/rest/v1/${query}`, { headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`lecture REST : HTTP ${res.status}`);
  return res.json();
}
const BACKUP_COLUMNS = ['slug', 'id', 'is_published', 'published_at', 'updated_at', 'title_fr', 'title_en', 'meta_description_fr', 'meta_description_en'];

async function readIf(p) { try { return await fs.readFile(p, 'utf8'); } catch { return null; } }

async function competitorMatchers() {
  let names = [];
  if (process.env.COMPETITOR_NAMES) names = parseNamesEnv(process.env.COMPETITOR_NAMES);
  else { const local = await readIf(path.join(__dirname, 'competitors.local.json')); if (local) names = JSON.parse(local).names ?? []; }
  return names.length ? buildMatchers(names) : null;
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (k) => { const i = args.indexOf(k); return i === -1 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
  const editsFile = typeof opt('--edits') === 'string' ? opt('--edits') : null;
  const name = typeof opt('--name') === 'string' ? opt('--name') : null;
  const date = typeof opt('--date') === 'string' ? opt('--date') : null;
  const expectRaw = opt('--expect-published');
  const expectPublished = typeof expectRaw === 'string' ? Number(expectRaw) : null;
  const postsJson = typeof opt('--posts-json') === 'string' ? opt('--posts-json') : null;
  if (!editsFile || !name || !date) { console.error('usage : node scripts/build-seance-sql.mjs --edits ./<lot>.edits.mjs --name <base> --date AAAA-MM-JJ [--expect-published N] [--posts-json f]'); process.exit(2); }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error('--name : minuscules, chiffres, tirets ; --date : AAAA-MM-JJ'); process.exit(2); }
  if (expectRaw !== null && !Number.isInteger(expectPublished)) { console.error('--expect-published : nombre entier attendu'); process.exit(2); }

  const editsPath = path.isAbsolute(editsFile) ? editsFile : path.resolve(__dirname, editsFile);
  const mod = await import(pathToFileURL(editsPath).href);
  const { loadEntityFacts } = await import('./lib/load-entity-facts.mjs');
  const m = await loadEntityFacts();
  const edits = mod.buildEdits(m);
  const slugs = [...new Set(edits.map((e) => e.slug))].sort();
  const generatedAt = new Date().toISOString();
  const lines = []; // rapport
  const failures = [], warnings = [];
  const check = (ok, text, details = []) => { lines.push(`- ${ok === null ? '·' : ok ? '✓' : '✗'} ${text}`); for (const d of details) lines.push(`  - ${d}`); if (ok === false) failures.push(text); };

  // Lecture (REST anon, SELECT) ou fichier hors ligne.
  let rows, publishedCount, source;
  const fields = [...new Set(edits.map(columnOf))];
  if (postsJson) {
    const all = JSON.parse(await fs.readFile(path.resolve(postsJson), 'utf8'));
    const list = Array.isArray(all) ? all : all.rows ?? Object.values(all);
    rows = list.filter((r) => slugs.includes(r.slug));
    publishedCount = list.filter((r) => r.is_published === true).length;
    source = `fichier ${path.basename(postsJson)} (HORS LIGNE)`;
  } else {
    const cols = [...new Set([...BACKUP_COLUMNS, 'content_fr', 'content_en', ...fields])];
    rows = await restGet(`${TABLE}?select=${cols.join(',')}&slug=in.(${slugs.join(',')})`);
    publishedCount = (await restGet(`${TABLE}?select=slug,is_published`)).filter((r) => r.is_published === true).length;
    source = `REST anon (lecture seule) le ${generatedAt}`;
  }
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  check(rows.length === slugs.length && rows.every((r) => r.is_published === true), `${slugs.length} articles visés, ${rows.length} lus, tous publiés : ${rows.every((r) => r.is_published === true) ? 'oui' : 'non'}`, slugs.filter((s) => !bySlug.has(s)).map((s) => `absent : ${s}`));
  if (expectPublished !== null) check(publishedCount === expectPublished, `articles publiés lus (anon) : ${publishedCount} (attendu ${expectPublished} — la séance le revérifie en base)`);

  // 1. Contrôles de build-slots-sql + concurrents.
  const editFailures = [];
  for (const e of edits) editFailures.push(...checkEdit(e, bySlug.get(e.slug)?.[columnOf(e)]));
  check(editFailures.length === 0, `${edits.length} substitutions : ancien texte présent exactement 1 fois, nouveau texte absent`, editFailures);
  const textIssues = edits.flatMap((e) => insertedTextIssues(e.replace, e.lang, { column: columnOf(e) }).map((x) => `${e.slug} (${e.lang}) : ${x}`));
  check(textIssues.length === 0, 'Chaînes interdites de build-slots-sql (garant, Gaillard, voiture, « 15 min », vouvoiement, balises, jetons) absentes des nouveaux textes', textIssues);
  const matchers = await competitorMatchers();
  if (!matchers) { check(null, 'Concurrents : liste locale absente (scripts/competitors.local.json ou COMPETITOR_NAMES) — scan non exécuté'); warnings.push('scan concurrents non exécuté'); }
  else {
    const hits = edits.flatMap((e) => scanText(e.replace, matchers).map((h) => `${e.slug} (${e.lang}) : « ${h.excerpt} »`));
    check(hits.length === 0, 'Aucun concurrent de la liste locale dans les nouveaux textes (les noms ne sont jamais écrits ici)', hits);
  }

  // 2. Champs : simulation séquentielle et façon Postgres.
  const changes = groupChanges(edits, bySlug);
  const simFailures = changes.flatMap((c) => c.simFailures);
  const pgDiff = changes.filter((c) => typeof c.to === 'string' && simulateReplaces(c.from, c.ops) !== c.to).map((c) => `${c.slug}.${c.field}`);
  check(simFailures.length === 0 && pgDiff.length === 0, `${changes.length} champs : simulation séquentielle sans chevauchement ; replace() enchaînés de Postgres = même texte`, [...simFailures, ...pgDiff.map((x) => `écart Postgres : ${x}`)]);
  const watch = [...POST_STATE_WATCH, ...(Array.isArray(mod.POST_STATE_WATCH) ? mod.POST_STATE_WATCH : [])];
  const watchHits = changes.filter((c) => typeof c.to === 'string').flatMap((c) => watch.filter((re) => re.test(c.to)).map((re) => `${c.slug}.${c.field} : ${re}`));
  check(watchHits.length === 0 ? true : null, `Texte résultant : aucun motif surveillé (POST_STATE_WATCH du lot et du générateur)`, watchHits);
  if (watchHits.length) warnings.push(...watchHits);

  // 3. Gardes du site rejouées (avant / après).
  const site = { m, facts: await import('./check-entity-facts.mjs'), slots: await import('./check-answer-slots.mjs') };
  const guardDetails = [];
  let blocking = 0, needleChecks = 0;
  const lifted = [];
  for (const c of changes) {
    if (!['content_fr', 'content_en'].includes(c.field) || typeof c.to !== 'string') continue;
    const before = pageReport(site, c.from, c.lang, c.slug);
    const after = pageReport(site, c.to, c.lang, c.slug);
    const cmp = compareReports(before, after, { brandMax: site.slots.BRAND_MAX });
    needleChecks += before.needles.size;
    for (const x of cmp.added) guardDetails.push(`${c.slug} (${c.lang}) — NOUVELLE alerte : ${x}`);
    for (const k of cmp.lostNeedles) guardDetails.push(`${c.slug} (${c.lang}) — créneau perdu : ${k}`);
    if (cmp.anchorLost) guardDetails.push(`${c.slug} (${c.lang}) — ancre du bloc « Où chercher » perdue`);
    if (cmp.vousUp) guardDetails.push(`${c.slug} (${c.lang}) — vouvoiement en hausse (${before.vous} → ${after.vous})`);
    if (cmp.brandUp) guardDetails.push(`${c.slug} (${c.lang}) — « La Villa Coliving » ${after.brand} fois (> ${site.slots.BRAND_MAX})`);
    for (const k of cmp.missingBoth) lines.push(`  - (info) ${c.slug} (${c.lang}) : créneau « ${k} » non retrouvé dans le rendu approché, avant comme après`);
    for (const x of cmp.removed) lifted.push(`${c.slug} (${c.lang}) — ${x}`);
    if (cmp.blocking) blocking++;
  }
  check(blocking === 0, `Gardes du site rejouées sur ${changes.length} textes rendus, avant et après (check:slots : ${needleChecks} créneaux, ancre « Où chercher », garant, phrases d'appel, densité ; check:facts : interdits, note Google, « 15 min », deux gammes, minutes, phrases canoniques ; vouvoiement) : ${blocking ? `${blocking} champ(s) avec une alerte nouvelle` : 'aucune alerte nouvelle'}`, guardDetails);
  if (lifted.length) check(null, `Alertes levées par la modification : ${lifted.length}`, lifted);

  // 4. Sources des pages de décision.
  const sources = new Map();
  for (const e of edits) {
    const t = await readIf(path.join(ROOT, 'content', 'decision-pages', `${e.slug}.${e.lang}.md`));
    if (t !== null) sources.set(`${e.slug}.${e.lang}`, t);
  }
  const declared = Array.isArray(mod.DECISION_PAGE_SLUGS) ? mod.DECISION_PAGE_SLUGS : null;
  const withSource = [...new Set([...sources.keys()].map((k) => k.replace(/\.(fr|en)$/, '')))].sort();
  const ds = decisionSourceIssues(edits, sources);
  const declaredDiff = declared ? [...declared.filter((s) => !withSource.includes(s)).map((s) => `déclarée sans source touchée : ${s}`), ...withSource.filter((s) => !declared.includes(s)).map((s) => `source touchée non déclarée : ${s}`)] : [];
  check(ds.failures.length === 0 && declaredDiff.length === 0, `Pages de décision : ${withSource.length} pages (${sources.size} fichiers sources), ${ds.ok.length} phrases déjà à jour dans content/decision-pages`, [...ds.failures, ...declaredDiff]);
  if (ds.warnings.length) { check(null, 'Pages de décision : phrases introuvables dans la source', ds.warnings); warnings.push(...ds.warnings); }

  // 5. Fichiers.
  const seancePath = path.join(__dirname, `${name}-${date}.seance.sql`);
  const backupPath = path.join(__dirname, 'backups', `${name}-${date}.avant.json`);
  const afterPath = path.join(__dirname, 'backups', `${name}-${date}.attendu-apres.json`);
  const rollbackPath = path.join(__dirname, 'backups', `${name}-${date}.retour-arriere.sql`);
  const reportPath = path.join(ROOT, 'tools', 'out', `${name}-${date}.gardes.md`);
  const written = [];
  if (failures.length === 0 && !postsJson) {
    const nFr = edits.filter((e) => e.lang === 'fr').length, nEn = edits.length - nFr;
    const headerCommon = [
      `-- ${changes.length} champs de ${slugs.length} articles publies, ${edits.length} substitutions (${nFr} FR, ${nEn} EN) ; liste : scripts/${path.basename(editsPath)}`,
      `-- Lecture de la base a la preparation : ${asciiFold(source)}`,
      ...changes.map((c) => `--   [${c.n}/${changes.length}] ${c.slug}.${c.field} : ${c.ops.length} subst. ; ${c.fromLen} -> ${c.toLen} car. ; md5 ${c.fromMd5} -> ${c.toMd5}`),
    ];
    const doc = typeof mod.sqlDoc === 'function' ? mod.sqlDoc(m) : {};
    const seance = [
      [
        '-- ============================================================================',
        `-- SEANCE "${name}" (${date}) : ${asciiFold(doc.lot ?? name)}`,
        `-- Variante 100 % ASCII et compacte de scripts/${name}-${date}.sql (meme lot, memes ancres), generee le ${generatedAt}`,
        '-- par scripts/build-seance-sql.mjs. Un seul appel : BEGIN, un bloc DO, COMMIT, puis une verification en lecture seule.',
        `-- Gardes : ${Number.isInteger(expectPublished) ? `${expectPublished} articles publies, ` : ''}chaque champ dans l'etat de la preparation (md5 complet), resultat`,
        '-- recalcule en base et compare au md5 calcule ici AVANT chaque UPDATE, une ligne par UPDATE, md5 de sortie de tous les champs.',
        '-- Au moindre ecart : exception, tout est annule, rien n\'est ecrit. Relancer apres succes : refuse par la garde d\'entree (sans effet).',
        `-- Sauvegarde (etat remplace) : scripts/backups/${path.basename(backupPath)} ; retour arriere : scripts/backups/${path.basename(rollbackPath)}.`,
        '-- NE PAS EXECUTER SANS LE GO EXPLICITE DE JEROME. Le declencheur blog_posts_updated_at met aussi updated_at a now().',
        ...headerCommon,
        '-- ============================================================================',
      ].join('\n'),
      'BEGIN;',
      renderDoBlock(changes, { name, side: 'aller', expectPublished, tag: 'seance' }),
      'COMMIT;',
      `-- Verification (lecture seule, apres COMMIT) : ok = true sur les ${changes.length} lignes\n${renderVerification(changes, { expect: 'apres' })}`,
    ].join('\n\n') + '\n';
    const rollback = [
      [
        '-- ============================================================================',
        `-- RETOUR ARRIERE de la seance "${name}" (${date}), genere le ${generatedAt} par scripts/build-seance-sql.mjs. 100 % ASCII.`,
        '-- Remet le texte d\'avant la seance par les substitutions inverses (nouveau -> ancien, dans l\'ordre inverse). Garde d\'entree : chaque',
        '-- champ dans l\'etat attendu APRES la seance (md5 de scripts/backups/' + path.basename(afterPath) + ') ; resultat compare au md5 d\'avant',
        `-- (scripts/backups/${path.basename(backupPath)}) avant chaque UPDATE ; une transaction : toute anomalie annule tout.`,
        '-- Si un champ a change depuis la seance, rien n\'est ecrit : repartir de la sauvegarde. updated_at ne revient pas a sa valeur d\'origine.',
        ...headerCommon,
        '-- ============================================================================',
      ].join('\n'),
      'BEGIN;',
      renderDoBlock(changes, { name: `${name} retour arriere`, side: 'retour', tag: 'retour' }),
      'COMMIT;',
      `-- Verification (lecture seule) : ok = true sur les ${changes.length} lignes (textes d'avant la seance)\n${renderVerification(changes, { expect: 'avant' })}`,
    ].join('\n\n') + '\n';

    // Relecture : ASCII, littéraux = substitutions (aller puis retour), retour arrière simulé = md5 d'avant.
    const selfIssues = [];
    if (!isAscii(seance)) selfIssues.push('séance : caractère hors ASCII');
    if (!isAscii(rollback)) selfIssues.push('retour arrière : caractère hors ASCII');
    // Le délimiteur du bloc DO n'apparaît qu'à l'ouverture et à la fermeture.
    if (seance.split('$seance$').length - 1 !== 2) selfIssues.push('séance : délimiteur $seance$ présent ailleurs que autour du bloc');
    if (rollback.split('$retour$').length - 1 !== 2) selfIssues.push('retour arrière : délimiteur $retour$ présent ailleurs que autour du bloc');
    const expectedFwd = changes.flatMap((c) => c.ops.flatMap((o) => [o.find, o.replace]));
    const expectedBack = changes.flatMap((c) => reverseReplaces(c.ops).flatMap((o) => [o.find, o.replace]));
    const litFwd = asciiLiterals(seance), litBack = asciiLiterals(rollback);
    if (litFwd.length !== expectedFwd.length || litFwd.some((s, i) => s !== expectedFwd[i])) selfIssues.push(`séance : littéraux relus ≠ substitutions (${litFwd.length} / ${expectedFwd.length})`);
    if (litBack.length !== expectedBack.length || litBack.some((s, i) => s !== expectedBack[i])) selfIssues.push(`retour arrière : littéraux relus ≠ substitutions inverses (${litBack.length} / ${expectedBack.length})`);
    const backDiff = changes.filter((c) => md5(simulateReplaces(c.to, reverseReplaces(c.ops))) !== c.fromMd5).map((c) => `${c.slug}.${c.field}`);
    if (backDiff.length) selfIssues.push(`retour arrière : les substitutions inverses ne redonnent pas le texte d'origine (${backDiff.join(', ')})`);
    // Chaque substitution d'un champ ne vise qu'un endroit au moment du retour (sinon replace() toucherait aussi un autre passage).
    for (const c of changes) {
      let v = c.to;
      for (const o of reverseReplaces(c.ops)) { const k = countOccurrences(v, o.find); if (k !== 1) selfIssues.push(`retour arrière : ${c.slug}.${c.field} — « ${preview(o.find)} » ${k}× au moment de son tour`); v = v.split(o.find).join(o.replace); }
    }
    check(selfIssues.length === 0, `Relecture : séance et retour arrière 100 % ASCII (${Math.round(Buffer.byteLength(seance) / 1024)} Ko et ${Math.round(Buffer.byteLength(rollback) / 1024)} Ko), ${litFwd.length} + ${litBack.length} littéraux U&'' relus à l'identique, retour arrière simulé = md5 d'avant sur les ${changes.length} champs`, selfIssues);

    if (failures.length === 0) {
      const backup = {
        takenAt: generatedAt,
        source: `REST ${TABLE} (anon, lecture seule), préparation du lot « ${name} » ; état que la séance remplace (ses gardes md5 l'exigent au caractère près).`,
        fields,
        rows: slugs.map((s) => {
          const r = bySlug.get(s);
          const out = {};
          for (const k of BACKUP_COLUMNS) out[k] = r[k] ?? null;
          out.md5 = Object.fromEntries(changes.filter((c) => c.slug === s).map((c) => [c.field, c.fromMd5]));
          out.content_fr = r.content_fr ?? null;
          out.content_en = r.content_en ?? null;
          for (const f of fields) if (!(f in out)) out[f] = r[f] ?? null;
          return out;
        }),
      };
      const expected = Object.fromEntries(slugs.map((s) => [s, Object.fromEntries(changes.filter((c) => c.slug === s).map((c) => [c.field, c.toMd5]))]));
      await fs.mkdir(path.dirname(backupPath), { recursive: true });
      await fs.writeFile(seancePath, seance, 'utf8');
      await fs.writeFile(rollbackPath, rollback, 'utf8');
      await fs.writeFile(backupPath, JSON.stringify(backup, null, 1) + '\n', 'utf8');
      await fs.writeFile(afterPath, JSON.stringify(expected, null, 1) + '\n', 'utf8');
      written.push(seancePath, backupPath, afterPath, rollbackPath);
    }
  } else if (postsJson) check(null, 'Hors ligne (--posts-json) : ni SQL ni sauvegarde écrits');

  const report = [
    `# Séance « ${name} » (${date}) — contrôles`,
    '',
    `Généré le ${generatedAt} par \`scripts/build-seance-sql.mjs\` · liste \`scripts/${path.basename(editsPath)}\` · ${edits.length} substitutions, ${changes.length} champs, ${slugs.length} articles · lecture : ${source}. Aucune écriture en base.`,
    '',
    ...lines,
    '',
    failures.length ? `**${failures.length} contrôle(s) en échec : rien n'est écrit (ni SQL, ni sauvegarde).**` : `**Tout est au vert.** Fichiers : ${written.map((p) => `\`${path.relative(ROOT, p)}\``).join(', ') || '—'}.`,
  ].join('\n') + '\n';
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, report, 'utf8');
  console.log(report);
  console.log(`rapport : ${path.relative(ROOT, reportPath)}`);
  if (failures.length) process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => { console.error(`✗ ${err.message}`); process.exit(1); });
}
