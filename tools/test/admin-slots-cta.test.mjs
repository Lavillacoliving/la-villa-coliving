// Brief du 13/10/2026 « créneaux nommés des articles admin + phrases d'appel » : fonctions pures du fichier d'éditions
// scripts/admin-slots-cta.edits.mjs et invariants des modifications générées (sans réseau : buildEdits(m) seulement).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import {
  CTA_QUESTION, CTA_LINES, capitalizeAnchor, enTarget, moveLinksOut, dropColumn, rentShareOfNet, studioPremiumChf, buildEdits,
} from '../../scripts/admin-slots-cta.edits.mjs';

const m = await loadEntityFacts();
const edits = buildEdits(m);
const QUESTION_HAS_LINK = /^👉 \*\*[^*]*\]\([^)]*\)[^*]*\*\*/;

test('moveLinksOut — FR, un lien : question fixe, lien en fin de paragraphe, majuscule, reste inchangé', () => {
  const line = '👉 **Tu cherches une [voir nos chambres côté France](/colocation-geneve) ?** À **La Villa Coliving**, dès 1 370 CHF.';
  assert.equal(moveLinksOut(line, 'fr'), `👉 **${CTA_QUESTION.fr}** À **La Villa Coliving**, dès 1 370 CHF. → [Voir nos chambres côté France](/colocation-geneve)`);
});

test('moveLinksOut — FR et EN, deux liens : séparés par « · », ordre conservé', () => {
  const fr = '👉 **Tu cherches une [chambres en colocation côté France](/colocation-geneve) ou une [colocation à Annemasse](/annemasse-colocation) ?** Suite.';
  assert.equal(moveLinksOut(fr, 'fr'), `👉 **${CTA_QUESTION.fr}** Suite. → [Chambres en colocation côté France](/colocation-geneve) · [Colocation à Annemasse](/annemasse-colocation)`);
  const en = '👉 **Looking for [La Villa Coliving, French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?** Rest.';
  assert.equal(moveLinksOut(en, 'en'), `👉 **${CTA_QUESTION.en}** Rest. → [La Villa Coliving, French side](/en/colocation-geneve) · [In Annemasse](/en/annemasse-colocation)`);
});

test('moveLinksOut — gabarit inconnu : erreur explicite (jamais de remplacement silencieux)', () => {
  assert.throws(() => moveLinksOut('👉 **Tu vises Annemasse et ses alentours ?** Suite.', 'fr'), /non reconnue/);
  assert.equal(capitalizeAnchor('[a room on the French side](/x)'), '[A room on the French side](/x)');
});

test('CTA_LINES : 56 lignes (28 FR / 28 EN), une par article et par langue, toutes au gabarit', () => {
  assert.equal(CTA_LINES.length, 56);
  assert.equal(CTA_LINES.filter((c) => c.lang === 'fr').length, 28);
  assert.equal(new Set(CTA_LINES.map((c) => `${c.slug}/${c.lang}`)).size, 56);
  for (const c of CTA_LINES) assert.doesNotThrow(() => moveLinksOut(c.line, c.lang), c.slug);
});

test('buildEdits : 92 modifications, (article, langue, ancien texte) uniques', () => {
  assert.equal(edits.length, 92);
  assert.equal(new Set(edits.map((e) => `${e.slug}/${e.lang}/${e.find}`)).size, 92);
});

test('EN : une cible interne sans /en devient /en explicite (quartiers-annemasse) ; FR et cibles /en/ inchangées', () => {
  assert.equal(enTarget('[Shared housing in Annemasse](/annemasse-colocation)'), '[Shared housing in Annemasse](/en/annemasse-colocation)');
  assert.equal(enTarget('[A room](/en/colocation-geneve)'), '[A room](/en/colocation-geneve)');
  const en = '👉 **Looking for [shared housing in Annemasse](/annemasse-colocation)?** At X.';
  assert.equal(moveLinksOut(en, 'en'), `👉 **${CTA_QUESTION.en}** At X. → [Shared housing in Annemasse](/en/annemasse-colocation)`);
  const fr = '👉 **Tu cherches une [colocation à Annemasse](/annemasse-colocation) ?** À X.';
  assert.ok(moveLinksOut(fr, 'fr').endsWith('→ [Colocation à Annemasse](/annemasse-colocation)'));
});

test('« WiFi » à bord du Léman Express : absent de tout texte inséré (décision du 13/10/2026)', () => {
  for (const e of edits) assert.ok(!/(rames|trainsets|units|en train|by train|Léman Express|confortablement assis|comfortably seated)[^.]{0,90}WiFi/i.test(e.replace), `${e.slug}/${e.lang}`);
  assert.equal(edits.filter((e) => e.mechanism === 'fact').length, 4); // cout-transport + guide-ressources, FR et EN
});

test('après correctif : aucune question 👉 en gras ne porte de lien, aucune forme cassée ne subsiste', () => {
  for (const e of edits.filter((x) => x.mechanism === 'cta')) {
    assert.ok(!QUESTION_HAS_LINK.test(e.replace), `${e.slug}/${e.lang} : lien encore dans la question`);
    assert.ok(!/Tu cherches une \[|Looking for \[|Découvre la \[le|notre \[chambres|Discover our \[see/.test(e.replace), `${e.slug}/${e.lang}`);
  }
});

test('lot B : la phrase porteuse du nom vient de adminSlotSentence(), marque une seule fois par créneau', () => {
  const bySlot = { 'permis-g': 'permis-g-frontalier-geneve', fiscalite: 'fiscalite-frontalier-geneve-impots-2026', salaire: 'salaire-suisse-net-frontalier-2026', dossier: 'dossier-location-frontalier-suisse-france', oi: 'organisations-internationales-geneve-ou-habiter', choc: 'choc-culturel-franco-suisse-expatrie-geneve' };
  for (const [key, slug] of Object.entries(bySlot)) {
    for (const lang of ['fr', 'en']) {
      const sentence = m.adminSlotSentence(key, lang);
      const carriers = edits.filter((e) => e.slug === slug && e.lang === lang && e.replace.includes(sentence));
      assert.equal(carriers.length, 1, `${key}/${lang} : ${carriers.length} modification(s) porteuse(s)`);
      const added = carriers[0].replace.split('La Villa Coliving').length - carriers[0].find.split('La Villa Coliving').length;
      assert.ok(added <= 1, `${key}/${lang} : ${added} mentions ajoutées`);
    }
  }
});

test('lot B : aucune phrase garant (la formule canonique est déjà au § 7 de dossier-location), aucun « 18 % de nos résidents »', () => {
  for (const e of edits) {
    assert.ok(!/garant|guarantor/i.test(e.replace) || /garant/i.test(e.find), `${e.slug}/${e.lang} : garant introduit`);
    assert.ok(!/18 ?% (de nos résidents|of our residents)/i.test(e.replace));
  }
});

test('calculs : part du loyer 20-27 % du net (1 370 / 7 000 ; 1 430 / 5 300), écart avec le studio ≈ 500-800 CHF', () => {
  assert.deepEqual(rentShareOfNet(m), { low: 20, high: 27 });
  assert.deepEqual(studioPremiumChf(m), { low: 500, high: 800 });
});

test('dropColumn : retire la colonne demandée de chaque ligne, séparateur compris', () => {
  const t = '| A | B | C |\n|---|:---:|:---:|\n| 1 | 2 | 3 |';
  assert.equal(dropColumn(t, 1), '| A | C |\n|---|:---:|\n| 1 | 3 |');
});
