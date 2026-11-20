// En-tête contextuel de /candidature (Lot B du brief « Formulaire, hydratation, mesure », 01/10/2026).
// Le script #lvc-cand-ctx d'index.html pose html.lvc-cand-ctx (hauteur réservée, micro-réassurance
// masquée) pour les lieux dont JoinPageV4 affiche l'en-tête : (L'Appart, étape E3, 13/11/2026) les lieux qui ont une page,
// PLACE_PAGE_KEYS de src/data/places.ts — les 3 maisons et L'Appart, sous leur clé PUBLIQUE (la clé interne de la base,
// qui ne circule jamais dans une URL du site, reste sans en-tête).
// Si les deux listes divergent, un lieu aurait un en-tête sans place réservée (décalage) ou une
// place réservée sans en-tête (vide).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as P from '../../src/data/places.ts';

const HTML = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const SCRIPT = /<script id="lvc-cand-ctx">([\s\S]*?)<\/script>/.exec(HTML)?.[1];

/** Lieux dont /candidature affiche l'en-tête : ceux qui ont une page (PLACE_PAGE_KEYS), ordre alphabétique. */
function placeKeys() {
  return [...P.PLACE_PAGE_KEYS].sort();
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

test('liste des lieux du script = PLACE_PAGE_KEYS (src/data/places.ts) : les 3 maisons et L\'Appart', () => {
  const inScript = /\^\(([a-z|]+)\)\$/.exec(SCRIPT)?.[1].split('|').sort();
  assert.deepEqual(inScript, placeKeys());
  assert.deepEqual(placeKeys(), ['lappart', 'lavilla', 'lelodge', 'leloft']); // ordre alphabétique
});

test('classe posée seulement sur /candidature et /en/candidature avec un lieu connu', () => {
  for (const slug of placeKeys()) {
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
