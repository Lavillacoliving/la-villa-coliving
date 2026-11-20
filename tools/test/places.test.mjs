// Lieux publics (L'Appart, brief du 12/11/2026) : src/data/places.ts, chargé tel quel par Node 24.
// 1. Clés, gammes, libellés, lecture des chemins, libellé des chambres (la n° 5 de L'Appart = « Suite »).
// 2. Le chargeur des gardes (scripts/lib/load-entity-facts.mjs) expose chaque export de places.ts : deux `export *` du
//    même nom disparaîtraient sans message.
// 3. Miroirs : les listes écrites à la main ailleurs (vercel.json, index.html, prerender.mjs, hydration-check.mjs,
//    routePreload.ts, App.tsx, roomPages.json) suivent PLACE_PAGE_KEYS, l'interrupteur des pages de lieu — une page de
//    lieu oubliée dans routePreload.ts préchargerait la page d'erreur (piège du 26/08/2026 : 3 s de LCP perdues).
// 4. Contexte de navigation et fiches chambres (houseContext.ts, roomPages.ts) : seuls les lieux qui ont une page.
// 5. Le pont des clés publique → interne (src/lib/placeBridge.ts, étape E2) : deux importateurs au plus, hors bundle d'entrée.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import * as P from '../../src/data/places.ts';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');
const sorted = (xs) => [...xs].sort();
/** Les valeurs d'une liste écrite en JavaScript ou TypeScript : `const NOM = [ '…', "…" ]`. */
function listLiteral(src, name) {
  const m = new RegExp(`const ${name}\\b[^=]*=\\s*(?:new Set\\()?\\[([\\s\\S]*?)\\]`).exec(src);
  assert.ok(m, `liste ${name} introuvable`);
  return [...m[1].replace(/\/\/.*$/gm, '').matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
}
const pageRoutes = () => P.PLACE_PAGE_KEYS.map((k) => `/${k}`);

/** Modules du site qui lisent places.ts par l'alias `@/` : bundle esbuild en mémoire, comme les gardes. */
async function bundle(contents) {
  const out = await build({
    stdin: { contents, resolveDir: ROOT, loader: 'ts' },
    bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022',
    alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent',
  });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text, 'utf8').toString('base64')}`);
}

test('clés : 3 maisons dans l\'ordre d\'affichage, puis L\'Appart sous sa clé publique', () => {
  assert.deepEqual([...P.MAISON_KEYS], ['lavilla', 'leloft', 'lelodge']);
  assert.equal(P.APPART_KEY, 'lappart');
  assert.deepEqual([...P.PLACE_KEYS], [...P.MAISON_KEYS, P.APPART_KEY]);
  assert.equal(P.PLACE_KEYS_PATTERN, 'lavilla|leloft|lelodge|lappart');
  assert.equal(P.MAISON_KEYS_PATTERN, 'lavilla|leloft|lelodge');
});

test('gammes et libellés : une entrée par lieu, les maisons d\'un côté, L\'Appart de l\'autre', () => {
  assert.deepEqual(sorted(Object.keys(P.GAMME)), sorted(P.PLACE_KEYS));
  for (const k of P.MAISON_KEYS) assert.equal(P.GAMME[k], 'maisons', k);
  assert.equal(P.GAMME.lappart, 'appart');
  assert.deepEqual(P.PLACE_LABEL, { lavilla: 'La Villa', leloft: 'Le Loft', lelodge: 'Le Lodge', lappart: "L'Appart" });
});

test('isMaisonKey / isAppartKey / isPlaceKey : rien d\'autre que les clés exactes', () => {
  for (const k of P.MAISON_KEYS) {
    assert.equal(P.isMaisonKey(k), true, k);
    assert.equal(P.isPlaceKey(k), true, k);
    assert.equal(P.isAppartKey(k), false, k);
  }
  assert.equal(P.isAppartKey('lappart'), true);
  assert.equal(P.isPlaceKey('lappart'), true);
  assert.equal(P.isMaisonKey('lappart'), false);
  for (const v of ['', 'lechalet', 'autre-lieu', 'LAPPART', 'Lavilla', 'lappart ', ' lelodge', 'toString', 'constructor', '__proto__', 'hasOwnProperty', null, undefined, 4, {}, ['lavilla']]) {
    assert.equal(P.isPlaceKey(v), false, String(v));
    assert.equal(P.isMaisonKey(v), false, String(v));
    assert.equal(P.isAppartKey(v), false, String(v));
  }
});

test('assertNever : lève une erreur qui nomme la valeur', () => {
  assert.throws(() => P.assertNever('lechalet'), /places : cas non traité \(lechalet\)/);
});

test('placeFromPath : page d\'un lieu, FR ou EN, barre finale tolérée ; rien d\'autre', () => {
  for (const k of P.PLACE_KEYS) {
    assert.equal(P.placeFromPath(`/${k}`), k);
    assert.equal(P.placeFromPath(`/${k}/`), k);
    assert.equal(P.placeFromPath(`/en/${k}`), k);
  }
  for (const p of ['/', '/en', '/nos-maisons', '/lavilla/chambre-2', '/lappart/chambre-5', '/xlavilla', '/lavillax', '/fr/lavilla', '/en/en/lavilla', '/lechalet', '/LAPPART', 'lavilla', '/lavilla//']) {
    assert.equal(P.placeFromPath(p), null, p);
  }
});

test('roomFromPath : fiche d\'un lieu, numéro à 1 ou 2 chiffres ; rien d\'autre', () => {
  assert.deepEqual(P.roomFromPath('/lelodge/chambre-4'), { place: 'lelodge', roomNumber: 4 });
  assert.deepEqual(P.roomFromPath('/en/leloft/chambre-12/'), { place: 'leloft', roomNumber: 12 });
  assert.deepEqual(P.roomFromPath('/lappart/chambre-5'), { place: 'lappart', roomNumber: 5 });
  for (const p of ['/lelodge/chambre-', '/lelodge/chambre-123', '/lelodge/chambre-4x', '/lelodge', '/lechalet/chambre-1', '/lelodge/chambre-4/photos', '/en/lelodge/room-4']) {
    assert.equal(P.roomFromPath(p), null, p);
  }
});

test('roomLabel : « Chambre N » / « Room N » ; la n° 5 de L\'Appart s\'appelle « Suite », la n° 5 d\'une maison non', () => {
  assert.equal(P.APPART_SUITE_ROOM_NUMBER, 5);
  assert.equal(P.roomLabel('lelodge', 4, 'fr'), 'Chambre 4');
  assert.equal(P.roomLabel('lelodge', 4, 'en'), 'Room 4');
  assert.equal(P.roomLabel('lappart', 2, 'fr'), 'Chambre 2');
  assert.equal(P.roomLabel('lappart', 2, 'en'), 'Room 2');
  assert.equal(P.roomLabel('lappart', 5, 'fr'), 'Suite');
  assert.equal(P.roomLabel('lappart', 5, 'en'), 'Suite');
  for (const k of P.MAISON_KEYS) assert.equal(P.roomLabel(k, 5, 'fr'), 'Chambre 5', k);
});

test('places.ts est un module feuille : aucun import', () => {
  assert.doesNotMatch(read('src/data/places.ts'), /^\s*import\b/m);
});

test('PLACE_PAGE_KEYS : les 3 maisons au moins, rien hors des lieux publics', () => {
  for (const k of P.MAISON_KEYS) assert.ok(P.PLACE_PAGE_KEYS.includes(k), k);
  for (const k of P.PLACE_PAGE_KEYS) assert.ok(P.PLACE_KEYS.includes(k), k);
  assert.equal(new Set(P.PLACE_PAGE_KEYS).size, P.PLACE_PAGE_KEYS.length);
});

test('chargeur des gardes : chaque export de places.ts est exposé, à la même valeur', async () => {
  const m = await loadEntityFacts();
  const names = Object.keys(P);
  assert.ok(names.length >= 15, names.join(', '));
  for (const name of names) {
    assert.ok(name in m, `${name} absent du chargeur (nom en double dans un autre module ?)`);
    if (typeof P[name] === 'function') assert.equal(typeof m[name], 'function', name);
    else assert.deepEqual(m[name], P[name], name);
  }
});

test('miroir vercel.json : en-têtes noindex des fiches chambres = PLACE_PAGE_KEYS', () => {
  const headers = JSON.parse(read('vercel.json')).headers ?? [];
  const rooms = headers
    .map((h) => ({ h, m: /^\/(?:en\/)?\(([a-z|]+)\)\/\(chambre-\[0-9\]\+\)$/.exec(h.source) }))
    .filter((x) => x.m);
  assert.deepEqual(rooms.map((x) => x.h.source.startsWith('/en/')).sort(), [false, true], 'deux en-têtes attendus (FR et /en)');
  for (const { h, m } of rooms) {
    assert.deepEqual(sorted(m[1].split('|')), sorted(P.PLACE_PAGE_KEYS), h.source);
    assert.ok(h.headers.some((x) => x.key === 'X-Robots-Tag' && x.value === 'noindex'), h.source);
  }
});

test('miroir index.html : en-tête contextuel de /candidature (#lvc-cand-ctx) = PLACE_PAGE_KEYS', () => {
  const script = /<script id="lvc-cand-ctx">([\s\S]*?)<\/script>/.exec(read('index.html'))?.[1] ?? '';
  const keys = /\^\(([a-z|]+)\)\$/.exec(script)?.[1].split('|');
  assert.ok(keys, 'motif des lieux introuvable');
  assert.deepEqual(sorted(keys), sorted(P.PLACE_PAGE_KEYS));
});

test('miroirs du prérendu : routes, fil d\'Ariane, maisons sous « Nos maisons », hydratation', () => {
  const prerender = read('scripts/prerender.mjs');
  const routes = listLiteral(prerender, 'STATIC_ROUTES_FR');
  for (const r of pageRoutes()) assert.ok(routes.includes(r), `STATIC_ROUTES_FR sans ${r}`);
  // Fil d'Ariane « Accueil > Nos maisons > maison » : les maisons seulement (L'Appart, s'il a une page, est sous l'accueil).
  assert.deepEqual(sorted(listLiteral(prerender, 'HOUSE_SLUGS')), sorted(P.MAISON_KEYS));
  // Libellés du fil d'Ariane (FR puis EN) = PLACE_LABEL, entre apostrophes ou guillemets.
  for (const k of P.PLACE_PAGE_KEYS) {
    const labels = [...prerender.matchAll(new RegExp(`^\\s+${k}: (?:'((?:[^'\\\\]|\\\\.)*)'|"([^"]*)"),$`, 'gm'))]
      .map((x) => (x[1] !== undefined ? x[1].replace(/\\(.)/g, '$1') : x[2]));
    assert.deepEqual(labels, [P.PLACE_LABEL[k], P.PLACE_LABEL[k]], `libellés du fil d'Ariane de ${k}`);
  }
  // Hydratation : par STATIC (FR et /en ajoutés par le script) ou par ROUTES (FR et /en écrits l'un et l'autre).
  const hydrationSrc = read('scripts/hydration-check.mjs');
  const hStatic = listLiteral(hydrationSrc, 'STATIC');
  const hRoutes = listLiteral(hydrationSrc, 'ROUTES');
  for (const r of pageRoutes()) {
    assert.ok(hStatic.includes(r) || (hRoutes.includes(r) && hRoutes.includes(`/en${r}`)), `hydration-check sans ${r} (FR et EN)`);
  }
});

test('miroirs de l\'application : préchargement et routes de chaque page de lieu', () => {
  const preload = read('src/lib/routePreload.ts');
  const app = read('src/App.tsx');
  for (const r of pageRoutes()) {
    assert.match(preload, new RegExp(`^\\s+"${r}": \\(\\) => import\\("@/pages/\\w+"\\),$`, 'm'), `routePreload.ts sans ${r}`);
    assert.ok(app.includes(`<Route path="${r}" `), `App.tsx sans la route ${r}`);
    assert.ok(app.includes(`<Route path="/en${r}" `), `App.tsx sans la route /en${r}`);
  }
});

test('pont des clés (src/lib/placeBridge.ts) : importé par la candidature et la liste d\'attente seulement', () => {
  // Il n'existe qu'à partir de l'étape E2 ; avant, aucun fichier ne doit l'importer. Jamais par un module du bundle d'entrée.
  const allowed = ['src/components/RoomPipeline.tsx', 'src/pages/JoinPageV4.tsx'];
  const files = (dir) => readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(`${dir}/${e.name}`) : /\.(ts|tsx|mjs|js)$/.test(e.name) ? [`${dir}/${e.name}`] : []);
  const importsBridge = /from\s+["'][^"']*\/placeBridge(?:\.ts)?["']|import\(\s*["'][^"']*\/placeBridge/;
  // Le motif reconnaît bien un import (le test ne passe pas à vide).
  assert.match('import { toInternalPropertySlug } from "@/lib/placeBridge";', importsBridge);
  assert.match("const m = await import('../lib/placeBridge.ts');", importsBridge);
  const importers = files('src').filter((f) => importsBridge.test(read(f)));
  for (const f of importers) assert.ok(allowed.includes(f), `${f} importe le pont des clés`);
});

test('roomPages.json : fiches chambres seulement pour un lieu qui a une page', () => {
  const json = JSON.parse(read('src/data/roomPages.json'));
  const keys = Object.keys(json).filter((k) => !k.startsWith('_'));
  assert.ok(keys.length > 0);
  for (const k of keys) {
    assert.ok(P.PLACE_PAGE_KEYS.includes(k), `${k} : fiches chambres sans page de lieu`);
    assert.ok(Array.isArray(json[k]) && json[k].every((n) => Number.isInteger(n) && n >= 1 && n <= 99), k);
  }
});

test('contexte de navigation (houseContext.ts) : seuls les lieux qui ont une page', async () => {
  const H = await bundle("export * from './src/lib/houseContext';");
  for (const k of P.PLACE_KEYS) {
    const hasPage = P.PLACE_PAGE_KEYS.includes(k);
    for (const p of [`/${k}`, `/${k}/`, `/en/${k}`]) {
      assert.equal(H.houseSlugFromPath(p), hasPage ? k : null, p);
      assert.equal(H.applyHref(p), hasPage ? `/candidature?property_interest=${k}` : '/candidature', p);
    }
  }
  for (const p of ['/', '/nos-maisons', '/lelodge/chambre-4', '/candidature']) {
    assert.equal(H.houseSlugFromPath(p), null, p);
    assert.equal(H.applyHref(p), '/candidature', p);
  }
});

test('fiches chambres (roomPages.ts) : chemins, routes et lecture des URL suivent roomPages.json', async () => {
  const R = await bundle("export * from './src/data/roomPages';");
  const json = JSON.parse(read('src/data/roomPages.json'));
  const expected = P.PLACE_KEYS.flatMap((k) => (Array.isArray(json[k]) ? json[k] : []).map((n) => `/${k}/chambre-${n}`));
  assert.deepEqual(R.ROOM_PAGE_PATHS, expected);
  assert.deepEqual(sorted(Object.keys(R.ROOM_PAGES)), sorted(P.PLACE_KEYS));
  for (const p of expected) {
    const [, k, n] = /^\/(\w+)\/chambre-(\d+)$/.exec(p);
    assert.deepEqual(R.parseRoomPagePath(p), { house: k, roomNumber: Number(n) }, p);
    assert.deepEqual(R.parseRoomPagePath(`/en${p}/`), { house: k, roomNumber: Number(n) }, p);
  }
  // Une fiche que roomPages.json ne déclare pas n'existe pas, quel que soit le lieu.
  for (const k of P.PLACE_KEYS) {
    const declared = Array.isArray(json[k]) ? json[k] : [];
    const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].find((n) => !declared.includes(n));
    assert.equal(R.parseRoomPagePath(`/${k}/chambre-${missing}`), null, `${k} ${missing}`);
  }
});
