// Jetons de faits des articles (src/lib/contentTokens.ts) — (13/11/2026) deux jetons de fourchette et un « dès » des maisons.
// Le texte des articles en base porte ces jetons ; le site les résout au rendu (BlogPostPage), les scripts Node n'en ont qu'un
// miroir (scripts/lib/article-checks.mjs). Ce test tient les deux listes égales et fige ce que chaque jeton rend.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { CONTENT_TOKENS as MIRROR, unknownTokens } from '../../scripts/lib/article-checks.mjs';

const m = await loadEntityFacts();
const NB = '\u00A0';
const R = (md, lang) => m.resolveContentTokens(md, lang);

test('liste miroir de scripts/lib/article-checks.mjs = CONTENT_TOKENS de la source, dans le même ordre', () => {
  assert.deepEqual([...m.CONTENT_TOKENS], MIRROR);
  assert.ok(MIRROR.includes('PRIX_FOURCHETTE') && MIRROR.includes('PRIX_FOURCHETTE_TABLEAU'));
  assert.equal(new Set(MIRROR).size, MIRROR.length, 'aucun doublon');
});

test('chaque jeton connu est résolu dans les deux langues ; un jeton inconnu reste tel quel', () => {
  for (const lang of ['fr', 'en']) {
    for (const t of m.CONTENT_TOKENS) {
      const out = R(`a {{${t}}} b`, lang);
      assert.doesNotMatch(out, /\{\{|\}\}|undefined/, `${t} (${lang}) : « ${out} »`);
      assert.notEqual(out, 'a  b', `${t} (${lang}) : valeur vide`);
    }
    assert.equal(R('prix {{PRIX_INCONNU}}', lang), 'prix {{PRIX_INCONNU}}');
    assert.equal(R('texte sans jeton', lang), 'texte sans jeton');
  }
  assert.deepEqual(unknownTokens('{{PRIX_DES}} {{PRIX_FOURCHETTE}} {{PRIX_INCONNU}}'), ['PRIX_INCONNU']);
});

test('PRIX_DES / PRIX_DES_EUR = le « dès » des maisons (HOUSES_FROM), PRIX_PRIVATIF = le prix standard', () => {
  assert.equal(R('{{PRIX_DES}}', 'fr'), m.HOUSES_FROM.fr.chf);
  assert.equal(R('{{PRIX_DES}}', 'en'), m.HOUSES_FROM.en.chf);
  assert.equal(R('{{PRIX_DES_EUR}}', 'fr'), m.HOUSES_FROM.fr.eur);
  assert.equal(R('{{PRIX_DES_EUR}}', 'en'), m.HOUSES_FROM.en.eur);
  // Valeurs figées (voulu : un changement de tarif doit être vu ici).
  assert.equal(R('dès {{PRIX_DES}}/{{PRIX_DES_EUR}} tout inclus, {{PRIX_PRIVATIF}}/{{PRIX_PRIVATIF_EUR}} avec salle d\'eau privative', 'fr'),
    `dès 1${NB}290 CHF/1${NB}380 € tout inclus, 1${NB}430 CHF/1${NB}530 € avec salle d'eau privative`);
  assert.equal(R('from {{PRIX_DES}}/{{PRIX_DES_EUR}} all inclusive, {{PRIX_PRIVATIF}}/{{PRIX_PRIVATIF_EUR}} with a private shower room', 'en'),
    'from CHF 1,290/€1,380 all inclusive, CHF 1,430/€1,530 with a private shower room');
  // Pied commun des articles : la phrase rendue garde la graphie du site (U+00A0 en français, « CHF 1,290 » en anglais).
  assert.equal(R('une chambre meublée tout inclus coûte à partir de {{PRIX_DES}}/mois', 'fr'), `une chambre meublée tout inclus coûte à partir de 1${NB}290 CHF/mois`);
  assert.equal(R('an all-inclusive furnished room costs from {{PRIX_DES}}/month', 'en'), 'an all-inclusive furnished room costs from CHF 1,290/month');
});

test('PRIX_FOURCHETTE / PRIX_FOURCHETTE_TABLEAU = priceRangeText() / priceRangeCell(), au caractère près', () => {
  for (const lang of ['fr', 'en']) {
    assert.equal(R('{{PRIX_FOURCHETTE}}', lang), m.priceRangeText(lang));
    assert.equal(R('{{PRIX_FOURCHETTE_TABLEAU}}', lang), m.priceRangeCell(lang));
  }
  assert.equal(R('{{PRIX_FOURCHETTE}}', 'fr'), `1${NB}290 à 1${NB}430 CHF`);
  assert.equal(R('{{PRIX_FOURCHETTE}}', 'en'), 'CHF 1,290 to 1,430');
  assert.equal(R('{{PRIX_FOURCHETTE_TABLEAU}}', 'fr'), `1${NB}290 – 1${NB}430 CHF`);
  assert.equal(R('{{PRIX_FOURCHETTE_TABLEAU}}', 'en'), '1,290 – 1,430 CHF');
  // Borne basse de la fourchette = le « dès » de la fiche entité (une seule constante : les deux ne peuvent pas diverger).
  assert.ok(m.priceRangeText('fr').startsWith(m.HOUSES_FROM.fr.chfNum) && m.priceRangeText('en').includes(m.HOUSES_FROM.en.chfNum));
});

test('créneaux vérifiés par check:slots : écrits avec un jeton en base, ils se rendent comme la phrase canonique', () => {
  for (const lang of ['fr', 'en']) {
    const range = m.priceRangeText(lang);
    for (const sentence of [m.budgetVariantText(lang), m.coutDeLaVieRowLabel(lang), m.adminSlotSentence('fiscalite', lang), m.adminSlotSentence('dossier', lang)]) {
      assert.equal(sentence.split(range).length - 1, 1, `la phrase canonique porte la fourchette une fois (${lang})`);
      const stored = sentence.replace(range, '{{PRIX_FOURCHETTE}}');
      assert.equal(R(stored, lang), sentence);
      // Tel que l'article l'affiche (typoFr après les jetons) : identique, la règle des milliers ne touche pas une graphie déjà insécable.
      assert.equal(m.typoFr(R(stored, lang)), m.typoFr(sentence));
    }
  }
});

test('le rendu des jetons de prix ne contient jamais l\'ancien prix en francs (garde check:facts), ni un séparateur de milliers ordinaire en français', () => {
  const all = ['PRIX_DES', 'PRIX_DES_EUR', 'PRIX_PRIVATIF', 'PRIX_PRIVATIF_EUR', 'PRIX_FOURCHETTE', 'PRIX_FOURCHETTE_TABLEAU'];
  for (const lang of ['fr', 'en']) {
    const out = all.map((t) => R(`{{${t}}}`, lang)).join(' | ');
    assert.doesNotMatch(out, /1[\u00A0\u202F ]?380 CHF|1,380 CHF|CHF 1,380/, out);
    if (lang === 'fr') assert.doesNotMatch(out, /\d \d{3}/, 'milliers en espace insécable (U+00A0), jamais en espace ordinaire');
  }
});
