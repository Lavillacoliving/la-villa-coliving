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
