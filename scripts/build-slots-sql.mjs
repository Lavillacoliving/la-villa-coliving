#!/usr/bin/env node
/**
 * Lot L1 « Ingénierie des créneaux » (brief v3.1 du 09/10/2026), sous-lot L1.E — générateur du SQL idempotent qui
 * pose les créneaux M1-M4 (et le pied commun D1) dans les articles de blog stockés en base.
 *
 *   node scripts/build-slots-sql.mjs                 → écrit scripts/l1-answer-slots-<date>.sql
 *   node scripts/build-slots-sql.mjs --write-diff    → + scripts/l1-answer-slots-<date>.dry-run.md (diff lisible pour la PR)
 *   node scripts/build-slots-sql.mjs --dry-run       → n'écrit rien, affiche chaque modification (ancien / nouveau / occurrences)
 *   options : --posts-json <fichier> (lit un export JSON de blog_posts au lieu du REST — développement hors ligne, le SQL
 *             produit est alors marqué comme tel) · --date AAAA-MM-JJ (suffixe des fichiers, défaut SQL_DATE)
 *
 * Ce que fait le script :
 *  1. charge la source unique (scripts/lib/load-entity-facts.mjs → src/data/answerSlots.ts, entityFacts.ts, stats.ts) et
 *     résout la liste déclarative scripts/l1-slots.edits.mjs (buildEdits) ;
 *  2. relit le contenu VIVANT (content_fr / content_en) des articles touchés par REST (clé anon, lecture seule — même
 *     motif que scripts/check-entity-facts.mjs) ; jamais d'écriture en base : le SQL est appliqué par Jérôme ;
 *  3. exige EXACTEMENT 1 occurrence de chaque `find` dans la colonne vivante, et que le `replace` n'y soit présent
 *     qu'autant de fois qu'il l'est dans `find` (sinon la garde d'idempotence ou le retour arrière seraient faux) ;
 *     simule l'application séquentielle (détecte les chevauchements) ; scanne chaque `replace` : chaînes interdites
 *     (« 15 min », promesse sur le garant, Gaillard, voiture, vouvoiement FR, placeholders) et concurrents (liste
 *     COMPETITOR_NAMES / scripts/competitors.local.json ; absente → avertissement, scan non exécuté) ;
 *  4. écrit le SQL : en-tête, BEGIN, un UPDATE … replace() dollar-quoté par modification avec garde
 *     position(ancien) > 0 [AND position(nouveau) = 0], updated_at = now(), bloc « Aperçu des ancrages », COMMIT,
 *     bloc « Vérification » (une ligne par article), bloc « Retour arrière » (inverses, commentés).
 *  Code de sortie 1 à la moindre anomalie ; rien n'est écrit dans ce cas.
 *
 * Les fonctions pures sont exportées et testées dans tools/test/build-slots-sql.test.mjs.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { sqlDollar, sqlString } from './lib/article-checks.mjs';
import { buildMatchers, scanText, parseNamesEnv } from './lib/competitor-scan.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SQL_DATE = '2026-10-09';
export const TABLE = 'blog_posts';

// Même projet / clé anon (lecture seule) que scripts/prerender.mjs et scripts/check-entity-facts.mjs.
const SUPABASE_URL = 'https://tefpynkdxxfiefpkgitz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZnB5bmtkeHhmaWVmcGtnaXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTg5NDksImV4cCI6MjA4NjQ3NDk0OX0.X_Z85w6L4i1IkVevMK73hpFRClCpgh0Gh0WMY9pdDtw';

// ── Fonctions pures ────────────────────────────────────────────────────────────────────────────────

/** Occurrences non chevauchantes de `needle` dans `hay` (0 pour une aiguille vide). */
export function countOccurrences(hay, needle) {
  if (!needle) return 0;
  return String(hay).split(needle).length - 1;
}

/** Tag de dollar-quoting `base`, `base1`, `base2`… : le premier dont `$tag$` n'apparaît dans aucun des textes. Jamais `$$`. */
export function pickTag(base, texts) {
  if (!/^[a-z][a-z0-9]*$/.test(base)) throw new Error(`pickTag : base « ${base} » invalide`);
  for (let i = 0; i < 1000; i++) {
    const tag = i === 0 ? base : `${base}${i}`;
    if (!texts.some((t) => String(t).includes(`$${tag}$`))) return tag;
  }
  throw new Error('pickTag : aucun tag libre');
}

/** Littéraux SQL d'une modification : F = ancien texte, R = nouveau texte, col = colonne. */
export function quoteEdit(edit) {
  const F = sqlDollar(edit.find, pickTag('f', [edit.find]));
  const R = sqlDollar(edit.replace, pickTag('r', [edit.replace]));
  return { F, R, col: `content_${edit.lang}` };
}

/**
 * UPDATE idempotent. Garde A : l'ancien texte est présent. Garde B (position(nouveau) = 0) : seulement quand le nouveau
 * texte n'est pas un fragment de l'ancien — pour une suppression (nouveau ⊂ ancien), B serait toujours fausse ; sans B,
 * la garde A suffit puisque l'ancien disparaît. Pour un ajout (nouveau ⊃ ancien), B empêche la double application.
 */
export function renderUpdate(edit) {
  const { F, R, col } = quoteEdit(edit);
  const guardB = edit.find.includes(edit.replace) ? '' : `\n  AND position(${R} IN ${col}) = 0`;
  return `UPDATE ${TABLE}\nSET ${col} = replace(${col}, ${F}, ${R}),\n    updated_at = now()\nWHERE slug = ${sqlString(edit.slug)}\n  AND position(${F} IN ${col}) > 0${guardB};`;
}

/** Inverse exact : remet l'ancien texte, mêmes gardes miroir (position(ancien) = 0 sauf si l'ancien est un fragment du nouveau). */
export function renderRollback(edit) {
  const { F, R, col } = quoteEdit(edit);
  const guardB = edit.replace.includes(edit.find) ? '' : `\n  AND position(${F} IN ${col}) = 0`;
  return `UPDATE ${TABLE}\nSET ${col} = replace(${col}, ${R}, ${F}),\n    updated_at = now()\nWHERE slug = ${sqlString(edit.slug)}\n  AND position(${R} IN ${col}) > 0${guardB};`;
}

/** Condition SQL « la modification est en place » : nouveau présent (ajout) ou ancien absent (substitution / suppression). */
export function appliedCondition(edit) {
  const { F, R, col } = quoteEdit(edit);
  return edit.replace.includes(edit.find) ? `position(${R} IN ${col}) > 0` : `position(${F} IN ${col}) = 0`;
}

/** Vérification : une ligne par article, fr_ok / en_ok (NULL quand la langue n'est pas touchée). */
export function renderVerification(edits) {
  const slugs = [...new Set(edits.map((e) => e.slug))].sort();
  const column = (lang) => {
    const whens = slugs
      .map((slug) => {
        const conds = edits.filter((e) => e.slug === slug && e.lang === lang).map(appliedCondition);
        return conds.length ? `    WHEN ${sqlString(slug)} THEN (${conds.join('\n      AND ')})` : null;
      })
      .filter(Boolean);
    return whens.length ? `  CASE slug\n${whens.join('\n')}\n  END AS ${lang}_ok` : `  NULL::boolean AS ${lang}_ok`;
  };
  return `SELECT slug,\n${column('fr')},\n${column('en')}\nFROM ${TABLE}\nWHERE slug IN (${slugs.map(sqlString).join(', ')})\nORDER BY slug;`;
}

/** Bloc « Retour arrière » : inverses dans l'ordre inverse, dans un commentaire-bloc SQL (ou en lignes « -- » si un texte contient un délimiteur de commentaire-bloc). */
export function renderRollbackBlock(edits) {
  const body = ['BEGIN;', ...[...edits].reverse().map(renderRollback), 'COMMIT;'].join('\n\n');
  const blockSafe = !edits.some((e) => /\/\*|\*\//.test(e.find + e.replace));
  if (blockSafe) {
    return `-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.\n/*\n${body}\n*/`;
  }
  return `-- ── Retour arrière (inverse exact) : retirer le préfixe « -- » de chaque ligne du bloc puis exécuter.\n${body.split('\n').map((l) => `-- ${l}`).join('\n')}`;
}

/** Aperçu court d'un texte : une ligne, sauts de ligne rendus ⏎. */
export function preview(s, max = 72) {
  const one = String(s).replace(/\n/g, '⏎');
  return one.length > max ? `${one.slice(0, max - 1)}…` : one;
}

/**
 * Contrôles d'une modification contre le contenu vivant d'une colonne. Retourne la liste des échecs (vide = OK).
 *  - `find` présent exactement 1 fois (0 ou ≥ 2 = la replace() SQL toucherait 0 ou plusieurs endroits) ;
 *  - `replace` présent dans le vivant exactement autant de fois que dans `find` (0 pour une substitution ou un ajout,
 *    1 pour une suppression gardant un contexte) : sinon la garde B rendrait l'UPDATE muet ou le retour arrière
 *    toucherait un autre passage.
 */
export function checkEdit(edit, live) {
  const label = `${edit.slug} (${edit.lang}) · ${edit.mechanism} · ${edit.note}`;
  const failures = [];
  if (typeof live !== 'string') { failures.push(`${label} : colonne content_${edit.lang} absente ou vide en base`); return failures; }
  const n = countOccurrences(live, edit.find);
  if (n !== 1) failures.push(`${label} : ${n} occurrence(s) de l'ancre en base (attendu 1) — « ${preview(edit.find)} »`);
  const expectedR = countOccurrences(edit.find, edit.replace);
  const r = countOccurrences(live, edit.replace);
  if (r !== expectedR) failures.push(`${label} : le nouveau texte est déjà présent ${r} fois en base (attendu ${expectedR}) — « ${preview(edit.replace)} »`);
  return failures;
}

/** Application séquentielle (simulation) : chaque ancre doit encore être unique au moment de son tour (chevauchements). */
export function applyEdits(text, edits) {
  const failures = [];
  let out = text;
  for (const e of edits) {
    const n = countOccurrences(out, e.find);
    if (n !== 1) { failures.push(`${e.slug} (${e.lang}) · ${e.note} : ${n} occurrence(s) de l'ancre après les modifications précédentes (chevauchement ?)`); continue; }
    out = out.split(e.find).join(e.replace);
  }
  return { text: out, failures };
}

/** Chaînes interdites dans un texte INSÉRÉ (CLAUDE.md §1/§4, D1, D6, décision du 09/10). `lang` ajoute le vouvoiement en FR. */
export const FORBIDDEN = [
  { re: /(?<![\d,.])\b15 ?min/i, label: '« 15 min » (la valeur n\'existe plus, D1.4)' },
  // Promesse = affirmation ; une QUESTION sur la situation du lecteur (« Pas de garant français ? », « No guarantor in France? »
  // suivie de Visale) n'en est pas une : la règle ne regarde que les phrases qui ne se terminent pas par « ? ».
  { re: /sans garant\b|no guarantor|without (a )?guarantor|toujours avant la visite|always before the (viewing|visit)/i, label: 'promesse sur le garant hors formule canonique', statementsOnly: true },
  { re: /tu auras besoin d'un garant|you'll need a guarantor|no French guarantor|aucun garant|zéro garant/i, label: 'formule garant proscrite (L1.F)' },
  { re: /Gaillard/, label: '« Gaillard » (hors des zones, décision 09/10)' },
  { re: /\b(en voiture|by car|driving)\b/i, label: 'promesse de trajet en voiture (D1.2)' },
  { re: /\{\{|\[À VÉRIFIER|\[FAIT À CONFIRMER/, label: 'placeholder' },
  { re: /\$\$/, label: '« $$ » (dollar-quoting)' },
  { re: /<[a-z!/]/i, label: 'balise HTML dans le markdown inséré' },
];
const VOUS_RE = /(?<![\p{L}-])(vous|votre|vos)(?![\p{L}])/iu;
/** Phrases d'un texte, terminateur conservé (« ? » inclus) — pour distinguer question et affirmation. */
export function sentencesOf(text) {
  return String(text).split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
}
export function forbiddenIssues(text, lang) {
  const out = [];
  for (const { re, label, statementsOnly } of FORBIDDEN) {
    const hit = statementsOnly ? sentencesOf(text).some((s) => !s.endsWith('?') && re.test(s)) : re.test(text);
    if (hit) out.push(label);
  }
  if (lang === 'fr' && VOUS_RE.test(text)) out.push('vouvoiement (FR commercial = tutoiement)');
  return out;
}

/** Chaînes dont on vérifie l'ABSENCE dans le texte résultant des articles touchés (avertissement : elles peuvent venir d'un passage non visé par ce lot). */
export const POST_STATE_WATCH = [
  /tu auras besoin d'un garant/i, /you'll need a guarantor/i, /no French guarantor/i, /sans garant français/i,
];

/** En-tête + corps du fichier SQL. `meta` : { generatedAt, source, versions: {entity, ouChercher}, live: [{slug, updated_at, fr, en}] }. */
export function renderSql(edits, meta) {
  const slugs = [...new Set(edits.map((e) => e.slug))].sort();
  const header = [
    '-- ============================================================================',
    '-- Lot L1 « Ingénierie des créneaux » (brief v3.1 du 09/10/2026) — sous-lot L1.E : créneaux M1-M4 et pied commun D1 dans les articles en base',
    `-- Généré le ${meta.generatedAt} par scripts/build-slots-sql.mjs depuis scripts/l1-slots.edits.mjs`,
    `--   · textes insérés = source unique src/data/answerSlots.ts + entityFacts.ts + stats.ts (ENTITY_FACTS_VERSION ${meta.versions.entity}, OU_CHERCHER_VERSION ${meta.versions.ouChercher})`,
    `--   · ancres vérifiées sur ${meta.source} : exactement 1 occurrence de chaque ancien texte, nouveau texte absent`,
    '-- À appliquer par Jérôme dans le SQL Editor APRÈS déploiement du code L1 (le bloc « Où chercher » rendu par le code remplace les sections retirées ici).',
    '-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n\'est pas un fragment de l\'ancien] — relancer le fichier est sans effet.',
    '-- Fichier UTF-8 : il contient des espaces insécables (U+00A0, « 1 370 ») et le signe moins U+2212 (cout-de-la-vie) — ne pas le faire transiter par un éditeur qui normalise les espaces.',
    `-- ${edits.length} modifications · ${slugs.length} articles · état en base à la génération (updated_at · longueur fr / en) :`,
    ...meta.live.map((l) => `--   ${l.slug} · ${l.updated_at ?? '?'} · ${l.fr} / ${l.en}`),
    '-- ============================================================================',
  ];
  const updates = edits.map((e, i) => `-- [${i + 1}/${edits.length}] ${e.slug} (${e.lang}) · ${e.mechanism} · ${e.note}\n${renderUpdate(e)}`);
  const apercu = [
    '-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──',
    ...edits.map((e, i) => `-- [${i + 1}] ${e.slug}/${e.lang} · ${e.mechanism} : « ${preview(e.find)} » → « ${preview(e.replace)} »`),
  ];
  const verification = `-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.\n${renderVerification(edits)}`;
  return [header.join('\n'), 'BEGIN;', ...updates, apercu.join('\n'), 'COMMIT;', verification, renderRollbackBlock(edits)].join('\n\n') + '\n';
}

/** Diff lisible (markdown) joint à la PR. `rows` : edits enrichis de { count, replaceCount }. */
export function renderDryRun(rows, meta) {
  const slugs = [...new Set(rows.map((e) => e.slug))].sort();
  const liveBySlug = new Map(meta.live.map((l) => [l.slug, l]));
  const fence = '````';
  const out = [
    '# Lot L1.E — aperçu des modifications SQL des articles en base',
    '',
    `Généré le ${meta.generatedAt} par \`scripts/build-slots-sql.mjs\` · ancres vérifiées sur ${meta.source} · ${rows.length} modifications sur ${slugs.length} articles · SQL : \`scripts/l1-answer-slots-${meta.date}.sql\`.`,
    '',
    'Légende : « 1 370 » contient un espace insécable (U+00A0) ; « − » est le signe moins U+2212 (cout-de-la-vie) ; les textes « Avant » sont copiés au caractère près depuis la base, les textes « Après » viennent de la source unique (`src/data/answerSlots.ts`, `entityFacts.ts`, `stats.ts`). Mécanismes : M1 retrait de section « Où chercher » (bloc rendu par le code) · M2 phrase de commune · M3 ligne de tableau · M4 réponse « sans fiche de salaire suisse » · footer pied commun (formule D1) · fix correction ponctuelle.',
    '',
    '## Résumé par article',
    '',
    '| Article | FR | EN | updated_at en base | fr / en (caractères) |',
    '|---|---|---|---|---|',
    ...slugs.map((slug) => {
      const fr = rows.filter((e) => e.slug === slug && e.lang === 'fr').map((e) => e.mechanism);
      const en = rows.filter((e) => e.slug === slug && e.lang === 'en').map((e) => e.mechanism);
      const l = liveBySlug.get(slug) ?? {};
      return `| \`${slug}\` | ${fr.length ? `${fr.length} (${fr.join(', ')})` : '—'} | ${en.length ? `${en.length} (${en.join(', ')})` : '—'} | ${l.updated_at ?? '?'} | ${l.fr ?? '?'} / ${l.en ?? '?'} |`;
    }),
    '',
    '## Détail',
  ];
  rows.forEach((e, i) => {
    out.push('', `### ${i + 1}. \`${e.slug}\` (${e.lang}) · ${e.mechanism}`, '', e.note, '', `Occurrences de l'ancre en base : ${e.count} (attendu 1) · nouveau texte déjà présent : ${e.replaceCount} (attendu ${countOccurrences(e.find, e.replace)}) · garde « nouveau absent » : ${e.find.includes(e.replace) ? 'non (suppression)' : 'oui'}`, '', '**Avant**', '', `${fence}text`, e.find, fence, '', '**Après**', '', `${fence}text`, e.replace, fence);
  });
  return out.join('\n') + '\n';
}

// ── E/S ────────────────────────────────────────────────────────────────────────────────────────────

async function fetchLive(slugs) {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=slug,content_fr,content_en,is_published,updated_at&slug=in.(${slugs.join(',')})`;
  const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`REST ${res.status} : ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

async function readIf(p) { try { return await fs.readFile(p, 'utf8'); } catch { return null; } }

async function competitorNames() {
  if (process.env.COMPETITOR_NAMES) return parseNamesEnv(process.env.COMPETITOR_NAMES);
  const local = await readIf(path.join(__dirname, 'competitors.local.json'));
  return local ? (JSON.parse(local).names ?? []) : [];
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (name) => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
  const dryRun = args.includes('--dry-run');
  const writeDiff = args.includes('--write-diff');
  const postsJson = opt('--posts-json');
  const date = typeof opt('--date') === 'string' ? opt('--date') : SQL_DATE;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error(`--date « ${date} » : format AAAA-MM-JJ attendu`); process.exit(1); }

  const { loadEntityFacts } = await import('./lib/load-entity-facts.mjs');
  const { buildEdits } = await import('./l1-slots.edits.mjs');
  const m = await loadEntityFacts();
  const edits = buildEdits(m);
  const slugs = [...new Set(edits.map((e) => e.slug))].sort();

  const failures = [];
  const warnings = [];

  // Unicité des ancres déclarées (même slug/langue/find deux fois = replace() SQL appliquée deux fois).
  const seen = new Set();
  for (const e of edits) { const k = `${e.slug}\u0000${e.lang}\u0000${e.find}`; if (seen.has(k)) failures.push(`${e.slug} (${e.lang}) : ancre déclarée deux fois — « ${preview(e.find)} »`); seen.add(k); }

  // Chaînes interdites + concurrents dans les textes insérés.
  for (const e of edits) for (const issue of forbiddenIssues(e.replace, e.lang)) failures.push(`${e.slug} (${e.lang}) · ${e.note} : ${issue} dans le nouveau texte`);
  const names = await competitorNames();
  if (names.length === 0) warnings.push('aucune liste de concurrents (COMPETITOR_NAMES / scripts/competitors.local.json) : scan concurrents non exécuté');
  else {
    const matchers = buildMatchers(names);
    for (const e of edits) for (const hit of scanText(e.replace, matchers)) failures.push(`${e.slug} (${e.lang}) : concurrent « ${hit.name} » dans le nouveau texte — « ${hit.excerpt} »`);
  }

  // Contenu vivant.
  let rows; let source;
  if (typeof postsJson === 'string') {
    const all = JSON.parse(await fs.readFile(path.resolve(postsJson), 'utf8'));
    rows = (Array.isArray(all) ? all : Object.values(all)).filter((r) => slugs.includes(r.slug));
    source = `le fichier ${path.basename(postsJson)} (HORS LIGNE — ne pas appliquer ce SQL, régénérer sans --posts-json)`;
    warnings.push(`contenu lu dans ${postsJson}, pas en base : SQL marqué hors ligne`);
  } else {
    rows = await fetchLive(slugs);
    source = `le contenu vivant de ${TABLE} (REST anon, lecture seule) le ${new Date().toISOString()}`;
  }
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  for (const slug of slugs) {
    const r = bySlug.get(slug);
    if (!r) { failures.push(`${slug} : article absent de ${TABLE}`); continue; }
    if (r.is_published === false) warnings.push(`${slug} : is_published = false`);
  }

  // Contrôles par modification + simulation séquentielle par slug/langue.
  const enriched = edits.map((e) => {
    const live = bySlug.get(e.slug)?.[`content_${e.lang}`];
    failures.push(...checkEdit(e, live));
    return { ...e, count: typeof live === 'string' ? countOccurrences(live, e.find) : 0, replaceCount: typeof live === 'string' ? countOccurrences(live, e.replace) : 0 };
  });
  for (const slug of slugs) for (const lang of ['fr', 'en']) {
    const live = bySlug.get(slug)?.[`content_${lang}`];
    const mine = edits.filter((e) => e.slug === slug && e.lang === lang);
    if (typeof live !== 'string' || mine.length === 0) continue;
    const sim = applyEdits(live, mine);
    failures.push(...sim.failures);
    for (const re of POST_STATE_WATCH) if (re.test(sim.text)) warnings.push(`${slug} (${lang}) : après application, le texte contient encore ${re} (passage hors du lot ?)`);
  }

  // Sortie.
  const meta = {
    generatedAt: new Date().toISOString(),
    date,
    source,
    versions: { entity: m.ENTITY_FACTS_VERSION, ouChercher: m.OU_CHERCHER_VERSION },
    live: slugs.map((slug) => { const r = bySlug.get(slug) ?? {}; return { slug, updated_at: r.updated_at, fr: r.content_fr?.length ?? 0, en: r.content_en?.length ?? 0 }; }),
  };

  if (dryRun) {
    for (const [i, e] of enriched.entries()) {
      console.log(`\n[${i + 1}/${enriched.length}] ${e.slug} (${e.lang}) · ${e.mechanism} · ${e.note}`);
      console.log(`  occurrences en base : ${e.count} (attendu 1) · nouveau déjà présent : ${e.replaceCount}`);
      console.log(`  − ${preview(e.find, 160)}`);
      console.log(`  + ${preview(e.replace, 160)}`);
    }
  }
  const perSlug = slugs.map((s) => `${s} fr=${edits.filter((e) => e.slug === s && e.lang === 'fr').length} en=${edits.filter((e) => e.slug === s && e.lang === 'en').length}`);
  console.log(`\n${edits.length} modifications · ${slugs.length} articles\n  ${perSlug.join('\n  ')}`);
  for (const w of warnings) console.warn(`⚠ ${w}`);
  if (failures.length) {
    console.error(`\n✗ ${failures.length} anomalie(s) — rien n'est écrit :`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, `l1-answer-slots-${date}.sql`);
  const diffPath = path.join(__dirname, `l1-answer-slots-${date}.dry-run.md`);
  if (!dryRun) { await fs.writeFile(sqlPath, renderSql(edits, meta), 'utf8'); console.log(`✓ SQL écrit : ${path.relative(process.cwd(), sqlPath)}`); }
  if (writeDiff) { await fs.writeFile(diffPath, renderDryRun(enriched, meta), 'utf8'); console.log(`✓ diff écrit : ${path.relative(process.cwd(), diffPath)}`); }
  if (dryRun && !writeDiff) console.log('(dry-run : rien n\'est écrit)');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => { console.error(`✗ ${err.message}`); process.exit(1); });
}
