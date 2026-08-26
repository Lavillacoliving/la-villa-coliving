#!/usr/bin/env node
/**
 * link-graph — carte réelle du maillage interne (Brief n°2, Chantier 7 — 21/08/2026).
 *
 * Source : les pages PRÉRENDUES (public/prerendered/*.html) = l'output réel des
 * composants live (pages V4, nav/footer/sections V7) ET du contenu blog (markdown
 * Supabase → <a>). C'est la seule vue complète « qui lie qui, avec quelle ancre ».
 *
 * Usage (débutant : voir tools/README.md) :
 *   git pull --rebase && node tools/link-graph.mjs            → tools/out/link_graph.md (+ .json)
 *   node tools/link-graph.mjs --route /annemasse-colocation    → détail d'une page
 *   node tools/link-graph.mjs --lang en                        → restreint aux pages EN
 *   node tools/link-graph.mjs --snapshot docs/link_graph_2026-08-21.md   → copie datée committable
 *
 * Zéro dépendance. Ne touche à rien : lecture seule + écriture dans --out (défaut tools/out/).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { loadKnownRoutes, loadRedirects, routeToFile } from '../scripts/seo-lint.mjs';
import { extractAnchors, classifyAnchor, mainText } from './lib/html-links.mjs';
import { MONEY_ROUTES, MONEY_KEYWORDS, THRESHOLDS, MENTION_PATTERNS, SITE } from './lib/config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PRERENDERED = path.join(ROOT, 'public', 'prerendered');

// ─── CLI ────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const opt = (name, def = null) => { const i = argv.indexOf(name); return i === -1 ? def : (argv[i + 1] ?? true); };
if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`link-graph — carte du maillage interne à partir de public/prerendered/
  --out DIR        dossier de sortie (défaut tools/out)
  --route /chemin  détail d'une page (entrants / sortants) dans le terminal
  --lang fr|en     restreint l'analyse aux pages de cette langue
  --snapshot FILE  écrit aussi une copie datée du rapport (ex. docs/link_graph_2026-08-21.md)
  --json           affiche le JSON du graphe sur stdout (en plus des fichiers)`);
  process.exit(0);
}
const OUT_DIR = path.resolve(ROOT, String(opt('--out', 'tools/out')));
const ONLY_ROUTE = opt('--route');
const LANG = opt('--lang');
const SNAPSHOT = opt('--snapshot');

// ─── helpers ────────────────────────────────────────────────
const fmt = n => Number(n).toLocaleString('fr-FR');
const pct = (a, b) => (b ? `${(100 * a / b).toFixed(0)} %` : '—');
const table = (headers, rows) => rows.length
  ? ['| ' + headers.join(' | ') + ' |', '|' + headers.map(() => '---').join('|') + '|', ...rows.map(r => '| ' + r.map(c => String(c ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ') + ' |')].join('\n')
  : '_(aucune ligne)_';
const langOf = route => (route === '/en' || route.startsWith('/en/')) ? 'en' : 'fr';
const isBlog = route => /^\/(en\/)?blog\/.+/.test(route);
const CONTEXTUAL = new Set(['editorial', 'cta', 'content-other', 'image']);
const sh = cmd => { try { return execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return ''; } };

async function main() {
  // ── provenance
  const head = sh('git rev-parse --short HEAD');
  const branch = sh('git branch --show-current');
  const prerenderDate = sh('git log -1 --format=%ci -- public/prerendered');
  const status = sh('git status -sb').split('\n')[0] || '';
  const behind = /behind (\d+)/.exec(status);

  // ── routes & fichiers
  const sitemapRoutes = await loadKnownRoutes();
  const files = (await fs.readdir(PRERENDERED)).filter(f => f.endsWith('.html'));
  const fileSet = new Set(files);
  let routes = sitemapRoutes.filter(r => fileSet.has(routeToFile(r)));
  const missingFiles = sitemapRoutes.filter(r => !fileSet.has(routeToFile(r)));
  const knownFiles = new Set(sitemapRoutes.map(routeToFile));
  const extraFiles = files.filter(f => !knownFiles.has(f) && f !== '404.html');
  if (LANG) routes = routes.filter(r => langOf(r) === LANG);
  const routeSet = new Set(routes);
  const redirects = await loadRedirects();
  const resolveRedirect = p => {
    if (redirects.exact.has(p)) return { target: redirects.map.get(p) || p, via: true };
    for (const pat of redirects.patterns) if (pat.rx.test(p)) return { target: pat.dest, via: true };
    return { target: p, via: false };
  };

  // ── lecture + extraction
  const pages = new Map(); // route → { anchors, segmentation, text }
  const edges = [];
  const externals = new Map(); // host → Set(routes)
  const atypical = [];
  for (const route of routes) {
    const html = await fs.readFile(path.join(PRERENDERED, routeToFile(route)), 'utf-8');
    const { anchors, segmentation } = extractAnchors(html);
    if (!segmentation.ok) atypical.push(route);
    pages.set(route, { anchors, text: isBlog(route) ? mainText(html) : '' });
    for (const a of anchors) {
      if (a.external) {
        const host = (a.href.match(/^https?:\/\/([^/]+)/i) || [])[1];
        if (host) { if (!externals.has(host)) externals.set(host, new Set()); externals.get(host).add(route); }
        continue;
      }
      if (!a.target) continue;
      const { target, via } = resolveRedirect(a.target);
      if (target === route) continue; // self-link
      edges.push({
        source: route, target, viaRedirect: via, zone: a.zone, subtype: a.subtype,
        anchor: a.text, isImage: a.isImage, nofollow: a.nofollow,
        contextual: a.zone === 'content' && CONTEXTUAL.has(a.subtype),
        crossLang: a.zone === 'content' && routeSet.has(target) && langOf(route) !== langOf(target), // assets (/data, /images) exclus
        href: a.href,
      });
    }
  }

  // ── agrégats par route
  const stat = () => ({ in: [], out: [], inNav: 0, inFooter: 0, inRelated: 0, inCards: 0, inEditorial: 0, inCta: 0, inOther: 0, inContextual: 0, inContextualSources: new Set(), inEditorialFromBlog: 0 });
  const byRoute = new Map();
  const ensure = r => { if (!byRoute.has(r)) byRoute.set(r, stat()); return byRoute.get(r); };
  for (const r of routes) ensure(r);
  for (const e of edges) {
    ensure(e.source).out.push(e);
    const t = ensure(e.target);
    t.in.push(e);
    if (e.zone === 'nav') t.inNav++;
    else if (e.zone === 'footer') t.inFooter++;
    else if (e.subtype === 'related') t.inRelated++;
    else if (e.subtype === 'cards') t.inCards++;
    else if (e.subtype === 'editorial') { t.inEditorial++; if (isBlog(e.source)) t.inEditorialFromBlog++; }
    else if (e.subtype === 'cta') t.inCta++;
    else t.inOther++;
    if (e.contextual) { t.inContextual++; t.inContextualSources.add(e.source); }
  }

  // ── money pages
  const moneyPresent = MONEY_ROUTES.filter(r => routeSet.has(r));
  const moneyRows = [];
  const underfed = [];
  const anchorReport = [];
  for (const r of moneyPresent) {
    const s = byRoute.get(r);
    moneyRows.push([r, s.inNav, s.inFooter, s.inEditorial, s.inCta, s.inRelated + s.inCards, s.inOther, s.inContextual, s.inContextualSources.size, s.inEditorialFromBlog]);
    if (s.inContextual < THRESHOLDS.underfedContextual || (isBlog(r) ? false : s.inEditorialFromBlog === 0)) {
      underfed.push([r, s.inContextual, s.inEditorialFromBlog, s.inContextual < THRESHOLDS.underfedContextual ? `< ${THRESHOLDS.underfedContextual} contextuels` : '0 lien éditorial depuis le blog']);
    }
    // ancres contextuelles entrantes
    const ctx = s.in.filter(e => e.contextual);
    const dist = { marque: 0, url_nue: 0, generique: 0, exact: 0, partiel: 0, image: 0 };
    const anchorCount = new Map();
    for (const e of ctx) {
      const c = classifyAnchor(e.anchor, r, MONEY_KEYWORDS, { isImage: e.isImage });
      dist[c] = (dist[c] || 0) + 1;
      const k = (e.anchor || '(image)').toLowerCase();
      anchorCount.set(k, (anchorCount.get(k) || 0) + 1);
    }
    const n = ctx.length;
    const exactish = dist.exact + dist.partiel;
    const top = [...anchorCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `« ${k} » ×${v}`).join(' · ');
    const flags = [];
    if (n >= THRESHOLDS.overOptimizedMinN && exactish / n >= THRESHOLDS.overOptimizedShare) flags.push(`exact+partiel ${pct(exactish, n)} ≥ ${THRESHOLDS.overOptimizedShare * 100} %`);
    const topShare = anchorCount.size ? Math.max(...anchorCount.values()) / n : 0;
    if (n >= THRESHOLDS.overOptimizedMinN && topShare >= THRESHOLDS.sameAnchorShare) flags.push(`une même ancre ${pct(Math.max(...anchorCount.values()), n)}`);
    anchorReport.push([r, n, pct(dist.marque, n), pct(dist.url_nue, n), pct(dist.generique, n), pct(exactish, n), top || '—', flags.join(' ; ') || '—']);
  }

  // ── orphelines
  const orphanStrict = routes.filter(r => byRoute.get(r).in.length === 0);
  const orphanCtx = routes.filter(r => byRoute.get(r).in.length > 0 && byRoute.get(r).inContextual === 0 && !isBlog(r) ? true : (isBlog(r) && byRoute.get(r).inContextual === 0 && byRoute.get(r).inRelated === 0));

  // ── opportunités blog → money (mentions sans lien éditorial)
  const opportunities = [];
  for (const route of routes.filter(isBlog)) {
    const lang = langOf(route);
    const text = pages.get(route).text;
    const linkedEditorial = new Set(byRoute.get(route).out.filter(e => e.subtype === 'editorial').map(e => e.target));
    for (const [target, re] of Object.entries(MENTION_PATTERNS[lang] || {})) {
      if (!routeSet.has(target) || target === route) continue;
      const matches = [...text.matchAll(re)];
      if (matches.length < THRESHOLDS.mentionMin || linkedEditorial.has(target)) continue;
      const i = matches[0].index;
      const excerpt = text.slice(Math.max(0, i - 80), i + matches[0][0].length + 80).trim();
      const tStat = byRoute.get(target);
      const ctx = tStat.in.filter(e => e.contextual);
      const exactish = ctx.filter(e => ['exact', 'partiel'].includes(classifyAnchor(e.anchor, target, MONEY_KEYWORDS, { isImage: e.isImage }))).length;
      const suggest = ctx.length >= 5 && exactish / ctx.length >= 0.4 ? 'générique ou marque' : 'partiel (naturel) ou générique';
      opportunities.push({ route, target, mentions: matches.length, excerpt, suggest, priority: MONEY_ROUTES.indexOf(target) === -1 ? 99 : MONEY_ROUTES.indexOf(target) });
    }
  }
  opportunities.sort((a, b) => b.mentions - a.mentions || a.priority - b.priority);

  // ── divers
  const crossLang = edges.filter(e => e.crossLang);
  const viaRedirect = edges.filter(e => e.viaRedirect);
  const donors = routes.map(r => [r, byRoute.get(r).out.filter(e => e.subtype === 'editorial').length]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 15);
  const zoneTotals = edges.reduce((acc, e) => { acc[e.zone] = (acc[e.zone] || 0) + 1; return acc; }, {});
  const subTotals = edges.reduce((acc, e) => { acc[e.subtype] = (acc[e.subtype] || 0) + 1; return acc; }, {});
  const avgCtx = lang => { const rs = routes.filter(r => langOf(r) === lang && !isBlog(r)); return rs.length ? (rs.reduce((s, r) => s + byRoute.get(r).inContextual, 0) / rs.length).toFixed(1) : '—'; };

  // ── --route : détail terminal
  if (ONLY_ROUTE) {
    const s = byRoute.get(ONLY_ROUTE);
    if (!s) { console.error(`Route inconnue ou absente du sitemap : ${ONLY_ROUTE}`); process.exit(2); }
    console.log(`# ${ONLY_ROUTE}\n\nEntrants : ${s.in.length} (nav ${s.inNav} · footer ${s.inFooter} · éditorial ${s.inEditorial} · cta ${s.inCta} · related/cards ${s.inRelated + s.inCards} · autres ${s.inOther}) — contextuels ${s.inContextual} depuis ${s.inContextualSources.size} page(s)\n`);
    console.log(table(['source', 'zone', 'sous-type', 'ancre', 'classe'], s.in.filter(e => e.zone !== 'nav' && e.zone !== 'footer').map(e => [e.source, e.zone, e.subtype, e.anchor || '(image)', classifyAnchor(e.anchor, ONLY_ROUTE, MONEY_KEYWORDS, { isImage: e.isImage })])));
    console.log(`\nSortants contextuels : ${s.out.filter(e => e.contextual).length}`);
    console.log(table(['cible', 'sous-type', 'ancre'], s.out.filter(e => e.contextual).map(e => [e.target, e.subtype, e.anchor || '(image)'])));
    return;
  }

  // ── rapport Markdown
  const today = new Date().toISOString().slice(0, 10);
  const md = [];
  md.push(`# Carte du maillage interne — ${today}\n`);
  md.push(`**Provenance** : branche \`${branch || '?'}\` · HEAD \`${head || '?'}\` · prérendus commités le ${prerenderDate || '?'} · ${routes.length} pages analysées (${sitemapRoutes.length} au sitemap${LANG ? `, filtre --lang ${LANG}` : ''}) · ${edges.length} liens internes.`);
  if (behind) md.push(`\n> ⚠️ **Le dépôt local est en retard de ${behind[1]} commit(s) sur origin** : les prérendus peuvent être périmés. Faire \`git pull --rebase\` puis relancer.`);
  if (missingFiles.length) md.push(`\n> ⚠️ ${missingFiles.length} route(s) du sitemap sans fichier prérendu : ${missingFiles.join(', ')}`);
  if (extraFiles.length) md.push(`\n> ℹ️ Fichiers prérendus hors sitemap : ${extraFiles.join(', ')}`);
  if (atypical.length) md.push(`\n> ℹ️ Pages sans structure header/main/footer complète (tout compté en contenu) : ${atypical.join(', ')}`);
  md.push(`\nMéthode : un lien est **contextuel** s'il est dans \`<main>\` et n'est ni une carte (\`related\`/\`cards\`) ni du chrome ; \`editorial\` = lien markdown du blog (classe \`text-[#D4A574] hover:underline\`). Classes d'ancre : marque · URL nue · générique · exact/partiel (règle off-site 40/25/25/10, ici à titre d'alerte). Pilier \`/colocation-geneve\` : gelé 25/08 → 05/10 (page seule) — les liens **vers** lui restent autorisés.\n`);

  md.push(`## 1. Chiffres globaux\n`);
  md.push(table(['zone', 'liens'], Object.entries(zoneTotals).map(([k, v]) => [k, fmt(v)])));
  md.push('\n' + table(['sous-type', 'liens'], Object.entries(subTotals).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, fmt(v)])));
  md.push(`\nMoyenne d'entrants contextuels par page (hors blog) : FR ${avgCtx('fr')} · EN ${avgCtx('en')}. Domaines externes liés : ${externals.size}.\n`);

  md.push(`## 2. Pages money — entrants par type\n`);
  md.push(table(['page', 'nav', 'footer', 'éditorial', 'cta', 'related/cards', 'autres', '**contextuels**', 'sources distinctes', 'éditoriaux depuis le blog'], moneyRows));

  md.push(`\n## 3. Pages money sous-alimentées (< ${THRESHOLDS.underfedContextual} entrants contextuels, ou 0 lien éditorial depuis le blog)\n`);
  md.push(table(['page', 'contextuels', 'éditoriaux blog', 'motif'], underfed));

  md.push(`\n## 4. Orphelines\n`);
  md.push(`- **Strictes (0 entrant)** : ${orphanStrict.length ? orphanStrict.join(', ') : 'aucune'}`);
  md.push(`- **Quasi-orphelines contextuelles (entrants seulement via nav/footer/cartes)** : ${orphanCtx.length ? orphanCtx.join(', ') : 'aucune'}`);
  md.push(`- **Hors sitemap** : ${extraFiles.length ? extraFiles.join(', ') : 'aucune'}\n`);

  md.push(`## 5. Ancres contextuelles entrantes par page money (vs 40 % marque / 25 % URL nue / 25 % générique / 10 % exact)\n`);
  md.push(table(['page', 'n', 'marque', 'URL nue', 'générique', 'exact+partiel', 'top ancres', 'alerte'], anchorReport));

  md.push(`\n## 6. Opportunités blog → pages money (mentions sans lien éditorial, ≥ ${THRESHOLDS.mentionMin})\n`);
  md.push(`Correction = SQL sur \`blog_posts.content_fr/en\` (pas dans le repo) ; ancre suggérée selon la distribution actuelle de la cible ; ne jamais re-pointer l'article élu vers le pilier en sens inverse pendant le gel.\n`);
  md.push(table(['article', 'cible', 'mentions', 'extrait (1ʳᵉ mention)', 'ancre suggérée'], opportunities.slice(0, 45).map(o => [o.route, o.target, o.mentions, '…' + o.excerpt + '…', o.suggest])));
  if (opportunities.length > 45) md.push(`\n_(${opportunities.length - 45} autres dans le JSON)_`);

  md.push(`\n## 7. Fuites cross-langue (liens de contenu FR→EN ou EN→FR) et liens vers des redirections\n`);
  md.push(table(['source', 'cible', 'sous-type', 'ancre'], crossLang.slice(0, 40).map(e => [e.source, e.target, e.subtype, e.anchor || '(image)'])));
  md.push('\n' + table(['source', 'href', 'cible finale', 'zone'], viaRedirect.slice(0, 40).map(e => [e.source, e.href, e.target, e.zone])));

  md.push(`\n## 8. Top donneurs (pages avec le plus de liens éditoriaux sortants)\n`);
  md.push(table(['page', 'liens éditoriaux sortants'], donors));

  md.push(`\n## 9. Paramètres\n`);
  md.push(`- MONEY_ROUTES (présentes) : ${moneyPresent.join(', ')}\n- Seuils : ${JSON.stringify(THRESHOLDS)}\n- Source : \`public/prerendered/\` (régénérer : \`npm run build:local && npm run build\`) · sitemap : \`public/sitemap.xml\` · redirections : \`vercel.json\`\n- Script : \`tools/link-graph.mjs\` · config : \`tools/lib/config.mjs\` · extraction : \`tools/lib/html-links.mjs\` (réutilise \`scripts/seo-lint.mjs\`)`);

  const report = md.join('\n') + '\n';
  await fs.mkdir(OUT_DIR, { recursive: true });
  const mdPath = path.join(OUT_DIR, 'link_graph.md');
  const jsonPath = path.join(OUT_DIR, 'link_graph.json');
  await fs.writeFile(mdPath, report, 'utf-8');
  const json = {
    generatedAt: new Date().toISOString(), head, branch, prerenderDate, behind: behind ? Number(behind[1]) : 0,
    routes, edges, money: moneyRows, underfed, anchors: anchorReport, opportunities, orphanStrict, orphanCtx, crossLang, viaRedirect, externals: [...externals].map(([h, s]) => [h, s.size]),
  };
  await fs.writeFile(jsonPath, JSON.stringify(json, null, 1), 'utf-8');
  if (SNAPSHOT) { const sp = path.resolve(ROOT, String(SNAPSHOT)); await fs.mkdir(path.dirname(sp), { recursive: true }); await fs.writeFile(sp, report, 'utf-8'); }
  if (argv.includes('--json')) console.log(JSON.stringify(json));
  console.log(`✅ ${routes.length} pages · ${edges.length} liens → ${path.relative(ROOT, mdPath)} (+ .json)${SNAPSHOT ? ` · instantané : ${SNAPSHOT}` : ''}`);
  console.log(`   money sous-alimentées : ${underfed.length} · orphelines strictes : ${orphanStrict.length} · quasi-orphelines : ${orphanCtx.length} · opportunités blog→money : ${opportunities.length} · liens vers redirections : ${viaRedirect.length}`);
  if (behind) console.log(`   ⚠️ dépôt en retard de ${behind[1]} commit(s) — git pull --rebase puis relancer`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
