// Album compact des pages maisons (lot 2 « retenue premium », sous-lot A — 11/2026) : choix des 6 vignettes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compactIndices, albumPicks } from '../../src/lib/gallery.ts';

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
