// Album compact des pages maisons (lot 2 « retenue premium », sous-lot A — 11/2026) : choix des 6 vignettes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compactIndices, albumPicks, albumCover } from '../../src/lib/gallery.ts';
import { ALBUM_COVERS } from '../../src/data/albumCovers.ts';

const img = (category) => ({ category });

test('une photo par catégorie d\'abord, dans l\'ordre d\'apparition, puis on recommence', () => {
  const images = ['exterior', 'exterior', 'interior', 'common', 'room', 'exterior', 'amenity'].map(img);
  assert.deepEqual(compactIndices(images, 6), [0, 2, 3, 4, 6, 1]);
});

test('une seule catégorie : les premières photos, dans l\'ordre', () => {
  const images = Array.from({ length: 10 }, () => img('exterior'));
  assert.deepEqual(compactIndices(images, 6), [0, 1, 2, 3, 4, 5]);
});

test('moins de photos que de vignettes : toutes, sans doublon', () => {
  const images = ['room', 'exterior', 'room'].map(img);
  const picks = compactIndices(images, 6);
  assert.deepEqual([...picks].sort(), [0, 1, 2]);
  assert.equal(new Set(picks).size, picks.length);
});

test('album vide : aucune vignette ; résultat stable d\'un appel à l\'autre', () => {
  assert.deepEqual(compactIndices([], 6), []);
  const images = ['exterior', 'interior', 'exterior', 'common', 'interior', 'room', 'exterior', 'exterior'].map(img);
  assert.deepEqual(compactIndices(images, 6), compactIndices(images, 6));
  assert.equal(compactIndices(images, 6).length, 6);
});

const ph = (src, category) => ({ src, category });

test('albumPicks : une photo par catégorie (mise en avant d\'abord, sinon la première), puis une autre mise en avant en partant de la fin', () => {
  const images = [ph('e1', 'exterior'), ph('e2', 'exterior'), ph('i1', 'interior'), ph('i2', 'interior'), ph('c1', 'common'), ph('r1', 'room'), ph('r2', 'room'), ph('a1', 'amenity')];
  // mises en avant (ordre du carrousel) : r1, r2, i2, c1, e2, e1 — aucune en « amenity » : la première (la piscine) est prise
  assert.deepEqual(albumPicks(images, ['r1', 'r2', 'i2', 'c1', 'e2', 'e1'], 6).map((i) => images[i].src), ['e1', 'i2', 'c1', 'r1', 'a1', 'r2']);
});

test('albumPicks : photo mise en avant absente de l\'album → complétée, sans doublon ; sans mise en avant → une par catégorie puis le reste', () => {
  const images = [ph('e1', 'exterior'), ph('e1', 'exterior'), ph('i1', 'interior'), ph('c1', 'common'), ph('r1', 'room'), ph('a1', 'amenity'), ph('e3', 'exterior')];
  const picks = albumPicks(images, ['absente', 'r1', 'c1'], 6).map((i) => images[i].src);
  assert.deepEqual(picks, ['e1', 'i1', 'c1', 'r1', 'a1', 'e3']);
  assert.equal(new Set(picks).size, 6);
  const plain = [ph('e1', 'exterior'), ph('e2', 'exterior'), ph('i1', 'interior')];
  assert.deepEqual(albumPicks(plain, [], 6), compactIndices(plain, 6));
  assert.deepEqual(albumPicks([], ['x'], 6), []);
  assert.equal(albumPicks(images, ['r1'], 3).length, 3);
});

// (11/11/2026) Vignettes choisies à la main et validées par Jérôme : src/data/albumCovers.ts.
const ALBUM = [
  { src: '/a/ext-1.webp', category: 'exterior' },
  { src: '/a/ext-2.webp', category: 'exterior' },
  { src: '/a/int-1.webp', category: 'interior' },
  { src: '/a/room-1.webp', category: 'room' },
  { src: '/a/room-2.webp', category: 'room' },
  { src: '/a/pool.webp', category: 'amenity' },
  { src: '/a/gym.webp', category: 'amenity' },
];

test('albumCover : la liste choisie est suivie telle quelle, dans son ordre', () => {
  const cover = ['/a/pool.webp', '/a/room-2.webp', '/a/ext-2.webp'];
  assert.deepEqual(albumCover(ALBUM, cover, [], 3).map((i) => ALBUM[i].src), cover);
  // Plus d'entrées que de vignettes : on s'arrête au nombre demandé.
  assert.deepEqual(albumCover(ALBUM, cover, [], 2).map((i) => ALBUM[i].src), cover.slice(0, 2));
});

test('albumCover : entrée absente de l\'album ou répétée → ignorée, puis complétée par le choix automatique, sans doublon', () => {
  const picks = albumCover(ALBUM, ['/a/pool.webp', '/a/retiree.webp', '/a/pool.webp', '/a/gym.webp'], [], 5);
  const srcs = picks.map((i) => ALBUM[i].src);
  assert.deepEqual(srcs.slice(0, 2), ['/a/pool.webp', '/a/gym.webp']);
  assert.equal(srcs.length, 5);
  assert.equal(new Set(srcs).size, 5);
});

test('albumCover : sans liste → exactement le choix automatique', () => {
  assert.deepEqual(albumCover(ALBUM, undefined, ['/a/gym.webp'], 4), albumPicks(ALBUM, ['/a/gym.webp'], 4));
  assert.deepEqual(albumCover(ALBUM, [], [], 6), albumPicks(ALBUM, [], 6));
  assert.deepEqual(albumCover([], ['/a/pool.webp'], [], 6), []);
});

test('ALBUM_COVERS : 6 photos distinctes par maison, toutes présentes dans l\'album de la page', () => {
  const page = fs.readFileSync(new URL('../../src/pages/HouseDetailPage.tsx', import.meta.url), 'utf8');
  assert.deepEqual(Object.keys(ALBUM_COVERS).sort(), ['lavilla', 'lelodge', 'leloft']);
  for (const [house, cover] of Object.entries(ALBUM_COVERS)) {
    assert.equal(cover.length, 6, house + ' : 6 vignettes attendues');
    assert.equal(new Set(cover).size, 6, house + ' : vignette en double');
    const start = page.indexOf('\n  ' + house + ': {\n    name:');
    assert.ok(start > 0, house + ' : bloc de la maison introuvable dans HouseDetailPage.tsx');
    const a = page.indexOf('photoGallery: [', start);
    const album = page.slice(a, page.indexOf('\n    ],', a));
    for (const src of cover) assert.ok(album.includes('src: "' + src + '"'), house + ' : ' + src + ' absente de photoGallery');
  }
});
