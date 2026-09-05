import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeText, decodeForScan, buildMatchers, scanText, scanHtml, parseNamesEnv, isAllowed } from '../../scripts/lib/competitor-scan.mjs';

const M = buildMatchers(['Kley', 'La Casa', 'Écla']);

test('normalizeText : accents, casse, apostrophes, espaces', () => {
  assert.equal(normalizeText('  Écla   d’Archamps '), " ecla d'archamps ");
});

test('frontières de mot : « Kley » ≠ « Kleyber », « kley. » compte', () => {
  assert.equal(scanText('chez Kleyber rien', M).length, 0);
  assert.equal(scanText('voir kley.', M).length, 1);
  assert.equal(scanText('KLEY et kley', M).length, 2);
});

test('multi-mots et variantes : espace, tiret, casse, accent', () => {
  assert.equal(scanText('La Casa, la-casa, LA  CASA', M).length, 3);
  assert.equal(scanText('ecla / Ecla / ÉCLA', M).length, 3);
  assert.equal(scanText('déclaration', M).length, 0, 'ecla dans déclaration ne doit pas matcher');
});

test('scanHtml : occurrence dans le JSON embarqué échappé et dans les entités HTML', () => {
  const html = '<script type="application/json" id="__blog_post_data__">{"content_fr":"Voir **Kley** \\u00e0 Gen\\u00e8ve"}</script><p>&Eacute;cla &amp; co</p>';
  const hits = scanHtml(html, M);
  assert.ok(hits.some((h) => h.name === 'Kley'));
  // &Eacute; n'est pas décodé (entité nommée rare) mais « Écla » l'est via &#201; :
  const hits2 = scanHtml('<p>&#201;cla</p>', M);
  assert.equal(hits2.length, 1);
  assert.equal(decodeForScan('a\\/b &nbsp;&quot;x&quot;'), 'a/b  "x"');
});

test('parseNamesEnv + isAllowed (fichier, date)', () => {
  assert.deepEqual(parseNamesEnv(' Kley, La Casa ;Écla\n'), ['Kley', 'La Casa', 'Écla']);
  const hit = { name: 'Kley' };
  const allow = [{ name: 'kley', file: 'blog-x.html', until: '2099-01-01' }, { name: 'La Casa', until: '2000-01-01' }];
  assert.equal(isAllowed(hit, 'blog-x.html', allow), true);
  assert.equal(isAllowed(hit, 'blog-y.html', allow), false);
  assert.equal(isAllowed({ name: 'La Casa' }, 'blog-x.html', allow), false, 'exclusion expirée');
});
