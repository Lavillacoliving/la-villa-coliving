// En-tête contextuel de /candidature (Lot B du brief « Formulaire, hydratation, mesure », 01/10/2026).
// Le script #lvc-cand-ctx d'index.html pose html.lvc-cand-ctx (hauteur réservée, micro-réassurance
// masquée) pour les maisons dont JoinPageV4 affiche l'en-tête, c'est-à-dire les clés de HOUSES.
// Si les deux listes divergent, une maison aurait un en-tête sans place réservée (décalage) ou une
// place réservée sans en-tête (vide).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const HTML = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const HOUSES_SRC = readFileSync(new URL('../../src/data/houses.ts', import.meta.url), 'utf8');
const SCRIPT = /<script id="lvc-cand-ctx">([\s\S]*?)<\/script>/.exec(HTML)?.[1];

function housesKeys() {
  const block = /export const HOUSES[^=]*=\s*\{([\s\S]*?)\n\};/.exec(HOUSES_SRC)?.[1] ?? '';
  return [...block.matchAll(/^ {2}([a-z]+): \{/gm)].map((m) => m[1]).sort();
}

function run(url) {
  const u = new URL(url, 'https://www.lavillacoliving.com');
  const classes = new Set();
  const document = { documentElement: { classList: { add: (c) => classes.add(c) } } };
  vm.runInContext(SCRIPT, vm.createContext({ location: { pathname: u.pathname, search: u.search }, document }));
  return classes.has('lvc-cand-ctx');
}

test('le script existe et ne contient aucun marqueur de commentaire HTML', () => {
  assert.ok(SCRIPT, 'script #lvc-cand-ctx introuvable');
  assert.ok(!SCRIPT.includes('<!--') && !SCRIPT.includes('-->'));
});

test('liste des maisons du script = clés de HOUSES (src/data/houses.ts)', () => {
  const inScript = /\^\(([a-z|]+)\)\$/.exec(SCRIPT)?.[1].split('|').sort();
  assert.deepEqual(inScript, housesKeys());
  assert.deepEqual(housesKeys(), ['lavilla', 'lelodge', 'leloft']); // ordre alphabétique
});

test('classe posée seulement sur /candidature et /en/candidature avec une maison connue', () => {
  for (const slug of housesKeys()) {
    assert.equal(run(`/candidature?property_interest=${slug}`), true, slug);
    assert.equal(run(`/en/candidature?property_interest=${slug}&room_interest=chambre-2`), true, slug);
    assert.equal(run(`/candidature?src=bloc_offre&property_interest=${slug}`), true, slug);
  }
  for (const url of [
    '/candidature',
    '/candidature?property_interest=montblanc',
    '/candidature?property_interest=constructor',
    '/candidature?property_interest=LeLodge',
    '/candidature?xproperty_interest=lelodge',
    '/lelodge?property_interest=lelodge',
    '/chambres-disponibles?maison=lelodge',
  ]) {
    assert.equal(run(url), false, url);
  }
});
