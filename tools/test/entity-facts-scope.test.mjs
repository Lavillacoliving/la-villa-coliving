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

// ── (Retenue premium, lot 1, T13 — décision Jérôme du 13/10/2026) Bouton de la fiche en casse normale, sans promesse ;
//    bouton et microcopie hors du comptage « 1× par page », vérifiés une fois DANS le bloc ──
import { entityFactsCtaIssues } from '../../scripts/check-entity-facts.mjs';

test('T13 : « Candidater » / « Apply » + microcopie 48 h, hors entityFactsStrings, vérifiés dans le bloc', async () => {
  const m = await loadEntityFacts();
  for (const lang of ['fr', 'en']) {
    const t = m.entityFactsText(lang);
    const h = m.ENTITY_FACTS.responseHours;
    assert.equal(t.cta, lang === 'fr' ? 'Candidater' : 'Apply');
    assert.equal(t.ctaNote, lang === 'fr' ? `Réponse sous ${h} h` : `Reply within ${h} h`);
    assert.doesNotMatch(t.cta, /\d|réponse|reply/i, `${lang} : aucune promesse dans le libellé du bouton`);
    assert.ok(!m.entityFactsStrings(lang).includes(t.cta), `${lang} : le bouton n'est pas compté 1× par page`);
    assert.ok(!m.entityFactsStrings(lang).includes(t.ctaNote), `${lang} : la microcopie n'est pas comptée 1× par page`);
    // Le même mot ailleurs sur la page (barre fixée, cartes) ne compte pas : seul le bloc est lu.
    const page = (label, note) =>
      `<a href="/candidature">${t.cta}</a><p>${t.ctaNote}</p>` +
      `<aside id="entity-facts" data-entity-facts-version="v"><h2>T</h2><ul><li>P</li></ul>` +
      `<a href="/candidature?src=entity_facts">${label}</a><p class="mt-2">${note}</p></aside>` +
      `<div><a href="/candidature">${t.cta}</a></div>`;
    assert.deepEqual(entityFactsCtaIssues(page(t.cta, t.ctaNote), t), [], `${lang} : bloc conforme`);
    assert.equal(entityFactsCtaIssues(page(`${t.cta} — 48 h`, t.ctaNote), t).length, 1, `${lang} : ancien libellé refusé`);
    assert.equal(entityFactsCtaIssues(page(t.cta, ''), t).length, 1, `${lang} : microcopie absente refusée`);
    assert.equal(entityFactsCtaIssues('<main><p>sans bloc</p></main>', t).length, 1, `${lang} : bloc absent signalé`);
  }
});
