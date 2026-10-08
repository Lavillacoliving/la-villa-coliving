// Empreinte de contenu des pages prérendues (lot indexation du 08/10/2026) : scripts/lib/content-fingerprint.mjs.
// Ce qui varie d'un run du bot à l'autre SANS changement de contenu doit donner la même empreinte ;
// tout vrai changement (texte, disponibilité, JSON-LD modifié) doit la changer.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { contentFingerprint, normalizeForFingerprint } from '../../scripts/lib/content-fingerprint.mjs';

const page = ({ asset = 'index-Ddp035oS', ids = ['_r_4s_', '_r_4t_'], jsonLd = ['A', 'B'], status = 'disponible maintenant', ws = ' ',
  headScript = 'window.dataLayer=[]', month = '2026-10', year = '2026', title = 'Chambres disponibles', inRoot = '' } = {}) =>
  `<html><head><title>${title}</title><script>${headScript}</script><script type="module" src="/assets/${asset}.js"></script>` +
  `<link rel="stylesheet" href="/assets/index-BI0pDZ22.css"><meta name="description" content="Desc">` +
  jsonLd.map((t) => `<script type="application/ld+json" data-react-helmet="true">{"@type":"${t}"}</script>`).join('') +
  `</head><body><div id="root"><div><button aria-controls="radix-${ids[0]}" id="radix-${ids[1]}">Q</button>` +
  `<div id="radix-${ids[0]}" aria-labelledby="radix-${ids[1]}">R</div>${ws}<p>Chambre 8 :${ws}${status}</p>${inRoot}` +
  `<footer>© <!-- -->${year} La Villa<script type="application/json" id="__render_month__">["${month}"]</script></footer></div></div>` +
  `<script type="module" src="/assets/${asset}.js"></script></body></html>`;

test('hachages d\'assets Vite neutralisés', () => {
  assert.equal(contentFingerprint(page()), contentFingerprint(page({ asset: 'index-Xy_9-AbC' })));
  assert.equal(contentFingerprint(page({ inRoot: '<img src="/assets/photo-Ddp035oS.webp">' })),
    contentFingerprint(page({ inRoot: '<img src="/assets/photo-Xy_9-AbC.webp">' })));
  assert.match(normalizeForFingerprint(page({ inRoot: '<img src="/assets/photo-Ddp035oS.webp">' })), /\/assets\/photo\.webp/);
});

test('identifiants useId / Radix neutralisés (rang d\'apparition)', () => {
  assert.equal(contentFingerprint(page()), contentFingerprint(page({ ids: ['_r_p_', '_r_q_'] })));
  // Formats React antérieurs
  const old = (a, b) => `<div id="${a}" aria-labelledby="${b}">x</div><span id="${b}"></span>`;
  assert.equal(contentFingerprint(old('«r1»', '«r2»')), contentFingerprint(old('«ra»', '«rb»')));
  assert.equal(contentFingerprint(old(':r1:', ':r2:')), contentFingerprint(old(':r7:', ':r9:')));
});

test('le lien id ↔ aria-controls reste comparé', () => {
  // Même nombre d'identifiants, mais l'association est inversée : ce n'est plus la même page.
  assert.notEqual(contentFingerprint(page()), contentFingerprint(page({ ids: ['_r_4t_', '_r_4t_'] })));
});

test('ordre des blocs JSON-LD neutralisé, doublon de même @type non servi', () => {
  assert.equal(contentFingerprint(page()), contentFingerprint(page({ jsonLd: ['B', 'A'] })));
  // L'injection dédoublonne par @type (le premier gagne) : un second bloc identique n'est pas servi.
  assert.equal(contentFingerprint(page()), contentFingerprint(page({ jsonLd: ['A', 'B', 'A'] })));
});

test('un bloc JSON-LD servi ajouté, retiré ou modifié change l\'empreinte', () => {
  assert.notEqual(contentFingerprint(page()), contentFingerprint(page({ jsonLd: ['A'] })));
  assert.notEqual(contentFingerprint(page()), contentFingerprint(page({ jsonLd: ['A', 'B', 'C'] })));
  assert.notEqual(contentFingerprint(page()), contentFingerprint(page({ jsonLd: ['A', 'Offer'] })));
});

test('deux blocs de même @type dont l\'ordre s\'inverse : le bloc servi change, l\'empreinte aussi', () => {
  // Cas /colocation-geneve : Offer InStock et Offer PreOrder, l'injection sert le premier.
  const offers = (first, second) => page({ jsonLd: [] }).replace('</head>',
    `<script type="application/ld+json">{"@type":"Offer","availability":"${first}"}</script>` +
    `<script type="application/ld+json">{"@type":"Offer","availability":"${second}"}</script></head>`);
  assert.notEqual(contentFingerprint(offers('InStock', 'PreOrder')), contentFingerprint(offers('PreOrder', 'InStock')));
  assert.equal(contentFingerprint(offers('InStock', 'PreOrder')), contentFingerprint(offers('InStock', 'InStock')));
});

test('blancs repliés', () => {
  assert.equal(contentFingerprint(page()), contentFingerprint(page({ ws: '\n    ' })));
});

test('une disponibilité qui change est un vrai changement de contenu', () => {
  assert.notEqual(contentFingerprint(page()), contentFingerprint(page({ status: 'dès le 15 octobre' })));
});

test('le <head> non servi (index.html : analytics, assets) est ignoré, les balises SEO comptent', () => {
  assert.equal(contentFingerprint(page()), contentFingerprint(page({ headScript: 'window.dataLayer=[];/* Clarity v2 */' })));
  assert.notEqual(contentFingerprint(page()), contentFingerprint(page({ title: 'Chambres libres' })));
  assert.notEqual(contentFingerprint(page()), contentFingerprint(page().replace('content="Desc"', 'content="Autre"')));
});

test('marqueur technique du mois de rendu neutralisé, texte dépendant du mois conservé', () => {
  assert.equal(contentFingerprint(page()), contentFingerprint(page({ month: '2026-11' })));
  const pipe = (m) => page({ inRoot: `<script type="application/json" id="__pipeline_ref_month__">["${m}"]</script>` });
  assert.equal(contentFingerprint(pipe('2026-10')), contentFingerprint(pipe('2026-11')));
  assert.notEqual(contentFingerprint(page({ inRoot: '<p>Places limitées pour novembre 2026.</p>' })),
    contentFingerprint(page({ inRoot: '<p>Places limitées pour décembre 2026.</p>' })));
});

test('année du copyright neutralisée', () => {
  assert.equal(contentFingerprint(page()), contentFingerprint(page({ year: '2027' })));
});

test('entrée invalide : empreinte stable, pas d\'exception', () => {
  assert.equal(normalizeForFingerprint(undefined), '');
  assert.equal(contentFingerprint(null), contentFingerprint(undefined));
});

// Vrais prérendus du bot, sans changement de contenu entre deux runs (ignoré si l'historique git manque,
// ex. clone superficiel de la CI) :
//   0306007 → 2e3650c (06/10) : seuls les identifiants Radix ont changé (cité par l'audit, SYS-04) ;
//   9806155 → 3313dbf (03/10) : l'ordre des blocs JSON-LD de react-helmet a changé sur /le-coliving.
// Les 44 pages statiques du sitemap doivent garder la même empreinte.
const REPO = fileURLToPath(new URL('../..', import.meta.url));
const git = (...args) => execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] });
const hasCommit = (c) => { try { git('cat-file', '-e', `${c}^{commit}`); return true; } catch { return false; } };
for (const [a, b] of [['0306007', '2e3650c'], ['9806155', '3313dbf']]) {
  test(`prérendus réels ${a} → ${b} : pages statiques sans changement = même empreinte`, { skip: !(hasCommit(a) && hasCommit(b)) && 'historique git absent' }, () => {
    const sitemap = git('show', `${b}:public/sitemap.xml`);
    const routes = [...sitemap.matchAll(/<loc>https:\/\/www\.lavillacoliving\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/').filter((r) => !/\/blog\/./.test(r));
    assert.equal(routes.length, 44);
    let rawDiffer = 0;
    for (const r of routes) {
      const file = `public/prerendered/${r === '/' ? 'index.html' : `${r.slice(1).replace(/\//g, '-')}.html`}`;
      const before = git('show', `${a}:${file}`);
      const after = git('show', `${b}:${file}`);
      if (before !== after) rawDiffer++;
      assert.equal(contentFingerprint(before), contentFingerprint(after), r);
    }
    assert.ok(rawDiffer > 0, 'la paire doit contenir des HTML bruts différents, sinon le test ne prouve rien');
  });
}
