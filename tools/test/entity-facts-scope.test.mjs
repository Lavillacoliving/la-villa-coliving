// Périmètre du bloc entité : les pages de décision versionnées dans content/decision-pages/
// (hors gabarit _TEMPLATE) sont reconnues par la garde check-entity-facts (correctif du 08/09/2026).
import test from 'node:test';
import assert from 'node:assert/strict';
import { decisionPageSlugs, ENTITY_FACTS_MONEY_ROUTES } from '../../scripts/check-entity-facts.mjs';

test('decisionPageSlugs() liste les .meta.json de content/decision-pages sans le gabarit', async () => {
  const slugs = await decisionPageSlugs();
  assert.ok(Array.isArray(slugs));
  assert.ok(slugs.includes('s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france'), 'C1 attendue dans le périmètre');
  assert.ok(!slugs.some((s) => s.startsWith('_')), 'le gabarit _TEMPLATE ne doit pas entrer dans le périmètre');
  assert.deepEqual(slugs, [...slugs].sort(), 'liste triée (sortie déterministe)');
});

test('les 14 pages money restent dans le périmètre', () => {
  assert.equal(ENTITY_FACTS_MONEY_ROUTES.length, 14);
  assert.ok(ENTITY_FACTS_MONEY_ROUTES.includes('/chambres-disponibles'));
});

// ── (Lot L1, 10/2026) Trajets par maison et formule Genève : source unique chargée via esbuild ──
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';

test('ENTITY_HOUSES[].commute : deux segments « · », minutes porte-à-porte de TRANSIT, tram du Loft', async () => {
  const m = await loadEntityFacts();
  assert.equal(m.ENTITY_HOUSES.length, 3);
  for (const h of m.ENTITY_HOUSES) {
    const T = m.TRANSIT.byHouse[h.slug];
    assert.ok(T, `${h.slug} absent de TRANSIT.byHouse`);
    for (const lang of ['fr', 'en']) {
      const segments = h.commute[lang].split(' · ');
      assert.equal(segments.length, 2, `${h.slug}/${lang} : « ${h.commute[lang]} »`);
      assert.match(segments[1], new RegExp(`\\b${T.eauxVivesDoorToDoorMin} min\\b`), `${h.slug}/${lang} : minutes porte-à-porte`);
      assert.match(segments[0], new RegExp(`\\b${T.stationWalkMin} min\\b`), `${h.slug}/${lang} : minutes jusqu'à la gare`);
      if (h.slug === 'leloft') assert.match(segments[0], new RegExp(`tram 17.*\\b${T.tramWalkMin} min\\b`), `leloft/${lang} : tram`);
      else assert.doesNotMatch(h.commute[lang], /tram/);
    }
  }
});

test('entityFactsText(lang).paragraph se termine par GENEVA_COMMUTE_FORMULA[lang] + « . »', async () => {
  const m = await loadEntityFacts();
  for (const lang of ['fr', 'en']) {
    const formula = m.GENEVA_COMMUTE_FORMULA[lang];
    assert.ok(formula.length > 40);
    assert.ok(m.entityFactsText(lang).paragraph.endsWith(`${formula}.`), `${lang} : « …${m.entityFactsText(lang).paragraph.slice(-80)} »`);
    assert.doesNotMatch(formula, /\b15 min/);
  }
});
