// D6 du brief « conversion Ads » (13/10/2026) : le déploiement sert aussi les assets de la version précédente — UNE seule
// version, jamais d'accumulation (consigne de Jérôme). Fonctions pures + scénarios complets contre un petit serveur local.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { isSafeAssetName, extractAssetRefs, planCarry, sourceOrigins, run, MANIFEST_FILE, PRODUCTION_ORIGIN } from '../../scripts/keep-previous-assets.mjs';

test('isSafeAssetName : noms plats d\'assets Vite seulement', () => {
  for (const ok of ['index-CybeRo5Y.js', 'EntityFacts--QjpvCk4.js', 'index-D2QlNaTD.css', 'font-a_b.woff2']) assert.ok(isSafeAssetName(ok), ok);
  for (const bad of ['../index.js', 'a/b.js', 'index.html', '.hidden.js', '', null, 'x..js/..']) assert.ok(!isSafeAssetName(bad), String(bad));
});

test('extractAssetRefs : HTML, __vite__mapDeps, import("./…"), url(/assets/…)', () => {
  const html = '<script type="module" crossorigin src="/assets/index-AAA111.js"></script><link rel="stylesheet" href="/assets/index-BBB222.css"><img src="/images/le lodge.webp">';
  assert.deepEqual(extractAssetRefs(html), ['index-AAA111.js', 'index-BBB222.css']);
  const js = 'const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomePage-Bf_-1.js","assets/x--Q.css"])))=>i.map(i=>d[i]);' +
    'const P=()=>import("./RatesPageV4-Box1raEE.js");import{a as b}from"./vendor-Zz9.js";';
  assert.deepEqual(extractAssetRefs(js), ['HomePage-Bf_-1.js', 'RatesPageV4-Box1raEE.js', 'vendor-Zz9.js', 'x--Q.css']);
  assert.deepEqual(extractAssetRefs('@font-face{src:url(/assets/inter-abc123.woff2) format("woff2")}'), ['inter-abc123.woff2']);
  assert.deepEqual(extractAssetRefs('see /public/assets-folder and ../assets/../x.js'), []);
});

test('planCarry : nouvelle version → ses fichiers ; même version (rebuild du bot) → la version d\'avant ; sans manifeste → exploration', () => {
  const own = ['index-NEW.js', 'shared-S.js'];
  assert.deepEqual(planCarry({ live: null, own }), { mode: 'bootstrap', carry: [] });
  assert.deepEqual(planCarry({ live: { own: ['../x.js'] }, own }), { mode: 'bootstrap', carry: [] });
  assert.deepEqual(planCarry({ live: { own: ['index-OLD.js', 'shared-S.js'], previous: ['index-OLDER.js'] }, own }),
    { mode: 'new-version', carry: ['index-OLD.js', 'shared-S.js'] }, 'jamais la version d\'avant-hier (pas d\'accumulation)');
  assert.deepEqual(planCarry({ live: { own: ['shared-S.js', 'index-NEW.js'], previous: ['index-OLD.js', 'index-OLD.js'] }, own }),
    { mode: 'same-version', carry: ['index-OLD.js'] });
});

test('sourceOrigins : hors Vercel rien ; production ; preview = alias de branche puis production ; KEEP_ASSETS_ORIGIN prioritaire', () => {
  assert.deepEqual(sourceOrigins({}), []);
  assert.deepEqual(sourceOrigins({ VERCEL: '1', VERCEL_ENV: 'production', VERCEL_BRANCH_URL: 'x-git-main.vercel.app' }), [PRODUCTION_ORIGIN]);
  assert.deepEqual(sourceOrigins({ VERCEL: '1', VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: 'site-git-feat-x.vercel.app' }), ['https://site-git-feat-x.vercel.app', PRODUCTION_ORIGIN]);
  assert.deepEqual(sourceOrigins({ VERCEL: '1', VERCEL_ENV: 'preview' }), [PRODUCTION_ORIGIN]);
  assert.deepEqual(sourceOrigins({ KEEP_ASSETS_ORIGIN: 'http://127.0.0.1:4173/', VERCEL: '1' }), ['http://127.0.0.1:4173']);
});

// ── Scénarios complets : un « site en ligne » servi depuis un dossier, un nouveau build dans un autre ──────────────────────
async function makeDist(root, files, manifest) {
  await fs.mkdir(path.join(root, 'assets'), { recursive: true });
  for (const [name, content] of Object.entries(files)) await fs.writeFile(path.join(root, 'assets', name), content);
  if (manifest) await fs.writeFile(path.join(root, MANIFEST_FILE), JSON.stringify(manifest));
  return root;
}
function serve(root) {
  const types = { js: 'text/javascript', css: 'text/css', json: 'application/json', html: 'text/html' };
  const server = http.createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = p === '/' ? path.join(root, 'index.html') : path.join(root, p);
    try {
      const body = await fs.readFile(file);
      res.writeHead(200, { 'content-type': types[path.extname(file).slice(1)] || 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(200, { 'content-type': 'text/html' }).end('<!doctype html><p>repli SPA</p>'); // pire cas : HTML en 200
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` })));
}

test('scénario : nouvelle version — copie la version en ligne, jamais celle d\'avant, manifeste à une seule version', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kpa-'));
  const live = await makeDist(path.join(tmp, 'live'), { 'index-OLD.js': 'import("./Page-OLD.js")', 'Page-OLD.js': 'x', 'shared-S.js': 's' },
    { schema: 1, own: ['Page-OLD.js', 'index-OLD.js', 'shared-S.js'], previous: ['index-OLDER.js'] });
  const next = await makeDist(path.join(tmp, 'next'), { 'index-NEW.js': 'import("./Page-NEW.js")', 'Page-NEW.js': 'y', 'shared-S.js': 's' });
  const { server, origin } = await serve(live);
  try {
    const r = await run({ env: { KEEP_ASSETS_ORIGIN: origin }, distDir: next });
    const files = (await fs.readdir(path.join(next, 'assets'))).sort();
    assert.deepEqual(files, ['Page-NEW.js', 'Page-OLD.js', 'index-NEW.js', 'index-OLD.js', 'shared-S.js']);
    assert.ok(!files.includes('index-OLDER.js'), 'pas d\'accumulation');
    assert.deepEqual(r.previous, ['Page-OLD.js', 'index-OLD.js', 'shared-S.js']);
    const m = JSON.parse(await fs.readFile(path.join(next, MANIFEST_FILE), 'utf8'));
    assert.deepEqual(m.own, ['Page-NEW.js', 'index-NEW.js', 'shared-S.js']);
    assert.deepEqual(m.previous, r.previous);
  } finally { server.close(); await fs.rm(tmp, { recursive: true, force: true }); }
});

test('scénario : rebuild du bot (même version) — la version d\'avant reste servie', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kpa-'));
  const live = await makeDist(path.join(tmp, 'live'), { 'index-NEW.js': 'n', 'index-OLD.js': 'o' },
    { schema: 1, own: ['index-NEW.js'], previous: ['index-OLD.js'] });
  const next = await makeDist(path.join(tmp, 'next'), { 'index-NEW.js': 'n' });
  const { server, origin } = await serve(live);
  try {
    const r = await run({ env: { KEEP_ASSETS_ORIGIN: origin }, distDir: next });
    assert.deepEqual((await fs.readdir(path.join(next, 'assets'))).sort(), ['index-NEW.js', 'index-OLD.js']);
    assert.deepEqual(r.previous, ['index-OLD.js']);
  } finally { server.close(); await fs.rm(tmp, { recursive: true, force: true }); }
});

test('scénario : premier déploiement (pas de manifeste en ligne) — exploration HTML → entrée → chunks, repli HTML refusé', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kpa-'));
  const live = path.join(tmp, 'live');
  await makeDist(live, {
    'index-OLD.js': 'const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Home-OLD.js","assets/Home-OLD.css"])))=>i;import("./Gone-OLD.js")',
    'Home-OLD.js': 'import("./Deep-OLD.js")', 'Deep-OLD.js': 'd', 'Home-OLD.css': '@font-face{src:url(/assets/font-OLD.woff2)}', 'font-OLD.woff2': 'f',
  });
  await fs.writeFile(path.join(live, 'index.html'), '<script type="module" src="/assets/index-OLD.js"></script>');
  const next = await makeDist(path.join(tmp, 'next'), { 'index-NEW.js': 'n' });
  const { server, origin } = await serve(live);
  try {
    const r = await run({ env: { KEEP_ASSETS_ORIGIN: origin }, distDir: next });
    const files = (await fs.readdir(path.join(next, 'assets'))).sort();
    assert.deepEqual(files, ['Deep-OLD.js', 'Home-OLD.css', 'Home-OLD.js', 'font-OLD.woff2', 'index-NEW.js', 'index-OLD.js']);
    assert.ok(!files.includes('Gone-OLD.js'), 'réponse HTML (fichier absent) jamais enregistrée comme JS');
    assert.deepEqual(r.previous, ['Deep-OLD.js', 'Home-OLD.css', 'Home-OLD.js', 'font-OLD.woff2', 'index-OLD.js']);
  } finally { server.close(); await fs.rm(tmp, { recursive: true, force: true }); }
});

test('scénario : source injoignable — aucune copie, manifeste écrit, aucune exception', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kpa-'));
  const next = await makeDist(path.join(tmp, 'next'), { 'index-NEW.js': 'n' });
  try {
    const r = await run({ env: { KEEP_ASSETS_ORIGIN: 'http://127.0.0.1:9' }, distDir: next });
    assert.deepEqual(r, { own: ['index-NEW.js'], previous: [] });
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(next, MANIFEST_FILE), 'utf8')).own, ['index-NEW.js']);
  } finally { await fs.rm(tmp, { recursive: true, force: true }); }
});
