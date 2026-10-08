// Lecture et comparaison de sitemaps (lot indexation du 08/10/2026) : scripts/lib/sitemap-lastmod.mjs,
// utilisé par scripts/prerender.mjs (dates conservées) et scripts/indexnow-ping.mjs (URL modifiées).
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSitemapLastmod, diffSitemaps, w3cDatetime, notYetLive } from '../../scripts/lib/sitemap-lastmod.mjs';

const S = 'https://www.lavillacoliving.com';
const entry = (loc, lastmod) => `  <url>\n    <loc>${S}${loc}</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${S}/en${loc}" />\n` +
  (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') + `    <changefreq>weekly</changefreq>\n  </url>`;
const sitemap = (...entries) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <!-- ═══ STATIC PAGES — FR ═══ -->\n${entries.join('\n')}\n</urlset>\n`;

test('parseSitemapLastmod : <loc> → <lastmod>, alternates ignorés, urlset ignoré', () => {
  const m = parseSitemapLastmod(sitemap(entry('/', '2026-10-07'), entry('/tarifs', '2026-09-04')));
  assert.deepEqual([...m], [[`${S}/`, '2026-10-07'], [`${S}/tarifs`, '2026-09-04']]);
});

test('une entrée sans lastmod ne vole pas celui de la suivante', () => {
  const m = parseSitemapLastmod(sitemap(entry('/a', null), entry('/b', '2026-10-01')));
  assert.equal(m.get(`${S}/a`), null);
  assert.equal(m.get(`${S}/b`), '2026-10-01');
});

test('entrée illisible → Map vide', () => {
  assert.equal(parseSitemapLastmod(undefined).size, 0);
  assert.equal(parseSitemapLastmod('pas du xml').size, 0);
});

test('diffSitemaps : nouvelles + lastmod modifié soumises, inchangées et retirées non', () => {
  const prev = parseSitemapLastmod(sitemap(entry('/', '2026-10-01'), entry('/faq', '2026-09-04'), entry('/blog/vieux', '2026-09-04')));
  const cur = parseSitemapLastmod(sitemap(entry('/', '2026-10-08'), entry('/faq', '2026-09-04'), entry('/blog/nouveau', '2026-10-08')));
  const d = diffSitemaps(prev, cur);
  assert.deepEqual(d.added, [`${S}/blog/nouveau`]);
  assert.deepEqual(d.modified, [`${S}/`]);
  assert.deepEqual(d.removed, [`${S}/blog/vieux`]);
  assert.equal(d.unchanged, 1);
  assert.deepEqual(d.toSubmit, [`${S}/`, `${S}/blog/nouveau`]); // ordre du sitemap courant
});

test('diffSitemaps : aucun changement → rien à soumettre', () => {
  const xml = sitemap(entry('/', '2026-10-01'), entry('/faq', '2026-09-04'));
  const d = diffSitemaps(parseSitemapLastmod(xml), parseSitemapLastmod(xml));
  assert.deepEqual(d.toSubmit, []);
  assert.equal(d.unchanged, 2);
});

test('w3cDatetime : W3C Datetime à la seconde, UTC', () => {
  assert.equal(w3cDatetime(new Date(Date.UTC(2026, 9, 8, 13, 4, 21, 987))), '2026-10-08T13:04:21+00:00');
  assert.match(w3cDatetime(new Date()), /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\+00:00$/);
});

test('deux changements le même jour : lastmod distincts, l\'URL est resoumise', () => {
  const at05 = parseSitemapLastmod(sitemap(entry('/', '2026-10-08T05:12:03+00:00'), entry('/faq', '2026-09-04')));
  const at13 = parseSitemapLastmod(sitemap(entry('/', '2026-10-08T13:09:44+00:00'), entry('/faq', '2026-09-04')));
  assert.deepEqual(diffSitemaps(at05, at13).toSubmit, [`${S}/`]);
});

test('notYetLive : URL dont le lastmod publié n\'est pas encore celui du run', () => {
  const cur = parseSitemapLastmod(sitemap(entry('/', '2026-10-08T13:09:44+00:00'), entry('/faq', '2026-09-04'), entry('/blog/nouveau', '2026-10-08')));
  const liveOld = parseSitemapLastmod(sitemap(entry('/', '2026-10-08T05:12:03+00:00'), entry('/faq', '2026-09-04')));
  const urls = [`${S}/`, `${S}/blog/nouveau`];
  assert.deepEqual(notYetLive(liveOld, cur, urls), urls);
  assert.deepEqual(notYetLive(cur, cur, urls), []);
  assert.deepEqual(notYetLive(new Map(), cur, urls), urls);
});
