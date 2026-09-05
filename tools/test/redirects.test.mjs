import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addRedirect, addRedirectPair, normalizePath, findRedirectFor, sourceToRegExp } from '../../scripts/redirects.mjs';
import { checkStatic } from '../../scripts/check-redirects.mjs';

const base = () => ({
  redirects: [
    { source: '/blog/a-ancien', destination: '/blog/b', permanent: true },
    { source: '/en/blog/a-ancien', destination: '/en/blog/b', permanent: true },
    { source: '/product-page/:slug', destination: '/tarifs', permanent: true },
  ],
  rewrites: [{ source: '/blog/b', destination: '/prerendered/blog-b.html' }],
});

test('normalizePath : slash initial, ni query, ni slash final, URL absolue acceptée', () => {
  assert.equal(normalizePath('blog/x/'), '/blog/x');
  assert.equal(normalizePath('/blog/x?utm=1#h'), '/blog/x');
  assert.equal(normalizePath('https://www.lavillacoliving.com/blog/x'), '/blog/x');
  assert.equal(normalizePath('/'), '/');
  assert.throws(() => normalizePath('   '));
});

test('sourceToRegExp : motifs :slug et :path*', () => {
  assert.ok(sourceToRegExp('/product-page/:slug').test('/product-page/chambre-1'));
  assert.ok(!sourceToRegExp('/product-page/:slug').test('/product-page/a/b'));
  assert.ok(sourceToRegExp('/_api/:path*').test('/_api/a/b/c'));
  assert.ok(findRedirectFor(base(), '/product-page/x'));
  assert.equal(findRedirectFor(base(), '/blog/b'), null);
});

test('addRedirect : ajout simple + avertissement si la source est aussi un rewrite', () => {
  const cfg = base();
  const changes = addRedirect(cfg, '/blog/b', '/blog/c');
  // /blog/b devient source : la paire existante a-ancien → b est retargetée vers c (pas de chaîne)
  assert.deepEqual(cfg.redirects.find((r) => r.source === '/blog/a-ancien').destination, '/blog/c');
  assert.ok(cfg.redirects.some((r) => r.source === '/blog/b' && r.destination === '/blog/c' && r.permanent === true));
  assert.ok(changes.some((c) => c.type === 'retarget' && c.source === '/blog/a-ancien'));
  assert.ok(changes.some((c) => c.type === 'add'));
  assert.ok(changes.some((c) => c.type === 'warn'), 'la source /blog/b est un rewrite → avertissement');
});

test('addRedirect : refuse une chaîne (cible déjà redirigée) et une boucle', () => {
  const cfg = base();
  assert.throws(() => addRedirect(cfg, '/blog/z', '/blog/a-ancien'), /chaîne refusée/);
  assert.throws(() => addRedirect(cfg, '/blog/z', '/blog/z'), /elle-même/);
});

test('addRedirect : idempotent (deuxième appel = unchanged) et mise à jour de destination', () => {
  const cfg = base();
  addRedirect(cfg, '/old', '/new');
  const again = addRedirect(cfg, '/old', '/new');
  assert.ok(again.some((c) => c.type === 'unchanged'));
  const upd = addRedirect(cfg, '/old', '/newer');
  assert.ok(upd.some((c) => c.type === 'update' && c.from === '/new' && c.to === '/newer'));
  assert.equal(cfg.redirects.filter((r) => r.source === '/old').length, 1);
});

test('addRedirectPair : jumeau EN créé, pas de jumeau pour une source /en', () => {
  const cfg = base();
  addRedirectPair(cfg, '/blog/x', '/blog/y');
  assert.ok(cfg.redirects.some((r) => r.source === '/blog/x' && r.destination === '/blog/y'));
  assert.ok(cfg.redirects.some((r) => r.source === '/en/blog/x' && r.destination === '/en/blog/y'));
  const n = cfg.redirects.length;
  addRedirectPair(cfg, '/en/blog/only', '/en/blog/target');
  assert.equal(cfg.redirects.length, n + 1);
});

test('checkStatic : détecte chaîne, doublon, source = rewrite, sitemap redirigé, attendu manquant', () => {
  const cfg = base();
  cfg.redirects.push({ source: '/blog/b', destination: '/blog/c', permanent: true }); // crée une chaîne a-ancien → b → c
  cfg.redirects.push({ source: '/blog/b', destination: '/blog/c', permanent: true }); // doublon
  cfg.redirects.push({ source: '/x', destination: '/y', permanent: false, statusCode: 302 }); // pas permanent
  const sitemap = '<urlset><url><loc>https://www.lavillacoliving.com/blog/a-ancien</loc><xhtml:link rel="alternate" hreflang="en" href="https://www.lavillacoliving.com/en/blog/b"/></url></urlset>';
  const { failures, warnings } = checkStatic(cfg, sitemap, [{ from: '/blog/a-ancien', to: '/blog/c' }, { from: '/absent', to: '/z' }]);
  const text = failures.join('\n');
  assert.match(text, /chaîne : « \/blog\/a-ancien »/);
  assert.match(text, /doublon : source « \/blog\/b »/);
  assert.match(text, /conflit : « \/blog\/b »/);
  assert.match(text, /sitemap : « \/blog\/a-ancien »/);
  assert.match(text, /attendu : « \/blog\/a-ancien » → « \/blog\/b », attendu « \/blog\/c »/);
  assert.match(text, /attendu : « \/absent » n'est pas redirigé/);
  assert.match(text, /politique : « \/x »/);
  assert.equal(warnings.length, 0);
});

test('checkStatic : configuration saine → 0 échec ; statusCode 301 accepté ; slash final = avertissement', () => {
  const cfg = base();
  cfg.redirects.push({ source: '/lp', destination: '/dispo', statusCode: 301 });
  cfg.redirects.push({ source: '/legacy/', destination: '/', permanent: true });
  const { failures, warnings } = checkStatic(cfg, '<urlset><url><loc>https://www.lavillacoliving.com/blog/b</loc></url></urlset>', [{ from: '/blog/a-ancien', to: '/blog/b' }]);
  assert.deepEqual(failures, []);
  assert.equal(warnings.length, 1);
});
