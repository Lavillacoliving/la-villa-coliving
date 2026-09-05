/**
 * Brouillon .md → SQL de publication d'une page de décision (Lot C0.2, brief « Conquête IA », 09/2026).
 *
 * Source de vérité : content/decision-pages/<slug>.fr.md, <slug>.en.md, <slug>.meta.json (relus dans la PR).
 * Le script VALIDE (scripts/lib/article-checks.mjs : mots, marqueur, tableau d'options, FAQ, liens, tokens,
 * metas, concurrents, URL redirigées, image) puis écrit le SQL — que Jérôme applique (SQL Editor / MCP) :
 * Claude Code n'écrit jamais en base.
 *
 * Usage :
 *   npm run article:sql -- <slug> --mode insert            # brouillon (is_published = false)
 *   npm run article:sql -- <slug> --mode update            # relecture : UPDATE du contenu, updated_at = now()
 *   npm run article:sql -- <slug> --mode update --publish  # publication : is_published = true (+ published_at si vide)
 *   options : --links (maillage entrant depuis meta.inbound) · --consolidate (dépublie meta.consolidates + repointe
 *             les liens) · --out <fichier> · --force (écrit malgré des échecs, pour itérer) · --dry-run
 * Sortie : scripts/nouvel-article-<slug>.sql (insert) ou scripts/maj-article-<slug>-<AAAA-MM-JJ>.sql (update).
 *
 * ⚠️ Publier = SQL de publication + merge/push du code dans la MÊME séance : le prérendu tourne 2× par jour
 *    (05 h et 13 h UTC) et rendrait un article publié avec le code de main.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { checkContent, checkMeta, wordCount, readTimeMin, sqlString, sqlDollar, sqlArray, AUTHOR_CANONICAL } from './lib/article-checks.mjs';
import { buildMatchers, scanText } from './lib/competitor-scan.mjs';
import { loadConfig, findRedirectFor } from './redirects.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'decision-pages');
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };

async function readIf(file) { try { return await fs.readFile(file, 'utf8'); } catch { return null; } }

async function loadCompetitorMatchers() {
  const names = process.env.COMPETITOR_NAMES
    ? process.env.COMPETITOR_NAMES.split(/[,\n;]/).map((s) => s.trim()).filter(Boolean)
    : JSON.parse((await readIf(path.join(__dirname, 'competitors.local.json'))) ?? '{"names":[]}').names ?? [];
  return { matchers: buildMatchers(names), count: names.length };
}

function sqlInsert(meta, fr, en, publish) {
  const words = wordCount(fr);
  const cols = ['slug', 'title_fr', 'title_en', 'excerpt_fr', 'excerpt_en', 'meta_description_fr', 'meta_description_en', 'content_fr', 'content_en', 'author', 'category', 'image_url', 'read_time_min', 'tags', 'source', 'is_published', 'published_at', 'updated_at'];
  const vals = [sqlString(meta.slug), sqlString(meta.title_fr), sqlString(meta.title_en), sqlString(meta.excerpt_fr), sqlString(meta.excerpt_en), sqlString(meta.meta_description_fr), sqlString(meta.meta_description_en), sqlDollar(fr, 'fr'), sqlDollar(en, 'en'), sqlString(meta.author ?? AUTHOR_CANONICAL), sqlString(meta.category), sqlString(meta.image_url), String(readTimeMin(words)), sqlArray(meta.tags), sqlString('manual'), publish ? 'true' : 'false', publish ? 'now()' : 'NULL', 'now()'];
  return `INSERT INTO public.blog_posts (\n  ${cols.join(', ')}\n) VALUES (\n  ${vals.join(',\n  ')}\n);`;
}

function sqlUpdate(meta, fr, en, publish) {
  const words = wordCount(fr);
  const sets = [
    `title_fr = ${sqlString(meta.title_fr)}`, `title_en = ${sqlString(meta.title_en)}`,
    `excerpt_fr = ${sqlString(meta.excerpt_fr)}`, `excerpt_en = ${sqlString(meta.excerpt_en)}`,
    `meta_description_fr = ${sqlString(meta.meta_description_fr)}`, `meta_description_en = ${sqlString(meta.meta_description_en)}`,
    `content_fr = ${sqlDollar(fr, 'fr')}`, `content_en = ${sqlDollar(en, 'en')}`,
    `author = ${sqlString(meta.author ?? AUTHOR_CANONICAL)}`, `category = ${sqlString(meta.category)}`, `image_url = ${sqlString(meta.image_url)}`,
    `read_time_min = ${readTimeMin(words)}`, `tags = ${sqlArray(meta.tags)}`,
    ...(publish ? ['is_published = true', 'published_at = COALESCE(published_at, now())'] : []),
    'updated_at = now()',
  ];
  return `UPDATE public.blog_posts SET\n  ${sets.join(',\n  ')}\nWHERE slug = ${sqlString(meta.slug)};`;
}

function sqlInbound(meta) {
  const out = [];
  for (const inb of meta.inbound ?? []) {
    const linkFr = `[${inb.anchor_fr}](/blog/${meta.slug})`;
    const linkEn = `[${inb.anchor_en}](/en/blog/${meta.slug})`;
    out.push(`-- Lien entrant depuis « ${inb.slug} » (ancre FR « ${inb.anchor_fr} », EN « ${inb.anchor_en} ») — idempotent
UPDATE public.blog_posts SET
  content_fr = replace(content_fr, ${sqlString(inb.anchor_fr)}, ${sqlString(linkFr)}),
  content_en = replace(content_en, ${sqlString(inb.anchor_en)}, ${sqlString(linkEn)}),
  updated_at = now()
WHERE slug = ${sqlString(inb.slug)}
  AND content_fr NOT LIKE ${sqlString(`%](/blog/${meta.slug})%`)}
  AND (content_fr LIKE ${sqlString(`%${inb.anchor_fr}%`)} OR content_en LIKE ${sqlString(`%${inb.anchor_en}%`)});`);
  }
  return out.join('\n\n');
}

function sqlConsolidate(meta) {
  const out = [];
  for (const old of meta.consolidates ?? []) {
    out.push(`-- Consolidation de « ${old} » dans « ${meta.slug} » : dépublication (JAMAIS de DELETE — runbook scripts/consolidation/00-RUNBOOK.md)
UPDATE public.blog_posts SET is_published = false, updated_at = now() WHERE slug = ${sqlString(old)};
-- Repointage des liens internes vers l'ancien slug (FR, EN, et liens /blog/ écrits dans l'EN)
UPDATE public.blog_posts SET
  content_fr = replace(content_fr, ${sqlString(`](/blog/${old})`)}, ${sqlString(`](/blog/${meta.slug})`)}),
  content_en = replace(replace(content_en, ${sqlString(`](/en/blog/${old})`)}, ${sqlString(`](/en/blog/${meta.slug})`)}), ${sqlString(`](/blog/${old})`)}, ${sqlString(`](/en/blog/${meta.slug})`)}),
  updated_at = now()
WHERE content_fr LIKE ${sqlString(`%](/blog/${old})%`)} OR content_en LIKE ${sqlString(`%/blog/${old})%`)};
-- Côté code (même PR) : node scripts/redirects.mjs --add /blog/${old} /blog/${meta.slug} ; retirer « ${old} » de src/data/blogIntentBuckets.ts ;
-- ajouter la paire à scripts/redirects.expected.json.`);
  }
  return out.join('\n\n');
}

async function main() {
  const slug = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--mode' && args[args.indexOf(a) - 1] !== '--out');
  const mode = opt('--mode');
  if (!slug || !['insert', 'update'].includes(mode)) {
    console.error('Usage : node scripts/build-article-sql.mjs <slug> --mode insert|update [--publish] [--links] [--consolidate] [--out f] [--force] [--dry-run]');
    process.exit(2);
  }
  const publish = args.includes('--publish');
  const [fr, en, metaRaw] = await Promise.all([readIf(path.join(CONTENT_DIR, `${slug}.fr.md`)), readIf(path.join(CONTENT_DIR, `${slug}.en.md`)), readIf(path.join(CONTENT_DIR, `${slug}.meta.json`))]);
  const failures = [], warnings = [];
  if (!fr) failures.push(`${slug}.fr.md absent`);
  if (!en) failures.push(`${slug}.en.md absent`);
  if (!metaRaw) failures.push(`${slug}.meta.json absent`);
  if (failures.length) { for (const f of failures) console.error(`❌ ${f}`); process.exit(1); }
  const meta = JSON.parse(metaRaw);
  if (meta.slug !== slug) failures.push(`meta.slug « ${meta.slug} » ≠ nom des fichiers « ${slug} »`);

  const config = await loadConfig().catch(() => ({ redirects: [] }));
  const isRedirected = (p) => !!findRedirectFor(config, p);
  const words = meta.words ?? undefined; // override test/relecture uniquement — documenté dans le README
  for (const [lang, md] of [['fr', fr], ['en', en]]) {
    const r = checkContent(md, lang, { isRedirected, words });
    failures.push(...r.failures); warnings.push(...r.warnings);
    console.log(`   ${lang} : ${r.stats.words} mots · ${r.stats.h2} sections · ${r.stats.faq} Q/R · ${r.stats.tables} tableau(x) · ${r.stats.links} liens`);
  }
  const m = checkMeta(meta); failures.push(...m.failures); warnings.push(...m.warnings);
  if (meta.image_url) { try { await fs.access(path.join(ROOT, 'public', decodeURIComponent(meta.image_url))); } catch { failures.push(`image_url « ${meta.image_url} » introuvable dans public/`); } }
  const { matchers, count } = await loadCompetitorMatchers();
  if (count === 0) warnings.push('aucune liste de concurrents (COMPETITOR_NAMES / scripts/competitors.local.json) : scan concurrents non exécuté');
  else for (const [lang, text] of [['fr', fr], ['en', en], ['meta', JSON.stringify(meta)]]) for (const h of scanText(text, matchers)) failures.push(`${lang} : concurrent nommé « ${h.name} » … ${h.excerpt} …`);

  for (const w of warnings) console.log(`   ⚠️  ${w}`);
  for (const f of failures) console.log(`   ❌ ${f}`);
  if (failures.length && !args.includes('--force')) { console.error(`\n❌ ${failures.length} échec(s) — SQL non écrit (corrige le brouillon, ou --force pour itérer).`); process.exit(1); }

  const today = new Date().toISOString().slice(0, 10);
  const parts = [
    `-- ============================================================================`,
    `-- ${mode === 'insert' ? 'Nouvel article' : 'Mise à jour'} : ${meta.slug} (page de décision — brief « Conquête IA »)`,
    `-- Généré le ${today} par scripts/build-article-sql.mjs depuis content/decision-pages/${slug}.{fr,en}.md + .meta.json`,
    `-- Mode : ${mode}${publish ? ' + publication' : ' (brouillon, is_published = false)'} · à appliquer par Jérôme (SQL Editor / MCP)`,
    `-- ${publish ? '⚠️ PUBLIER = appliquer ce SQL ET merger le code dans la même séance (prérendu 05 h / 13 h UTC).' : 'Relecture : https://www.lavillacoliving.com/blog/' + slug + '?preview=lavilla2026 (et /en/blog/…)'}`,
    `-- ============================================================================`,
    '', 'BEGIN;', '',
    mode === 'insert' ? sqlInsert(meta, fr, en, publish) : sqlUpdate(meta, fr, en, publish),
  ];
  if (args.includes('--links')) { const s = sqlInbound(meta); if (s) parts.push('', s); else warnings.push('--links : meta.inbound vide'); }
  if (args.includes('--consolidate')) { const s = sqlConsolidate(meta); if (s) parts.push('', s); else warnings.push('--consolidate : meta.consolidates vide'); }
  parts.push('', 'COMMIT;', '',
    '-- Vérification :',
    `--   SELECT slug, is_published, published_at, updated_at, read_time_min, length(content_fr) AS fr, length(content_en) AS en,`,
    `--          (SELECT count(*) FROM regexp_matches(content_fr, '\\*\\*[^*]+\\?\\*\\*', 'g')) AS faq_fr,`,
    `--          position('<!-- entity-facts -->' IN content_fr) AS marker_fr, position('<!-- entity-facts -->' IN content_en) AS marker_en`,
    `--   FROM blog_posts WHERE slug = ${sqlString(meta.slug)};`,
    ...((meta.consolidates ?? []).length ? [`--   SELECT slug FROM blog_posts WHERE is_published AND (${meta.consolidates.map((o) => `content_fr LIKE '%](/blog/${o})%' OR content_en LIKE '%/blog/${o})%'`).join(' OR ')});  -- attendu : 0 ligne`] : []),
    '');
  const sql = parts.join('\n');
  const out = typeof opt('--out') === 'string' ? path.resolve(opt('--out')) : path.join(__dirname, mode === 'insert' ? `nouvel-article-${slug}.sql` : `maj-article-${slug}-${today}.sql`);
  if (args.includes('--dry-run')) { console.log(sql); return; }
  await fs.writeFile(out, sql);
  console.log(`\n✅ ${path.relative(ROOT, out)} écrit (${sql.length} car.)${failures.length ? ' — AVEC des échecs (--force)' : ''}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
}
