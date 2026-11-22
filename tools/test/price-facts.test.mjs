// Justification du prix (Lot L4, brief v3.1 — décision D8 de Jérôme du 09/10/2026) : invariants de la source unique
// src/data/priceFacts.ts (chargée via esbuild) et de ses consommateurs (tarifsFaq, fiche entité), plus la garde HTML sur fixtures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { visibleText, forbiddenIssues } from '../../scripts/check-entity-facts.mjs';

const m = await loadEntityFacts();
const LANGS = ['fr', 'en'];
const norm = (s) => s.replace(/[ \t\r\n]+/g, ' ').trim();
const count = (hay, needle) => hay.split(needle).length - 1;

test('priceFactsIssues() : aucune incohérence interne', () => {
  assert.deepEqual(m.priceFactsIssues(), []);
});

test('A.3 « La Villa Coliving est-elle chère ? » (21/11/2026) : marque nommée, nombres de la source unique, « moins cher qu\'il n\'y paraît »', () => {
  for (const lang of LANGS) {
    const faq = m.priceJustificationFaq(lang);
    const to = lang === 'en' ? 'to' : 'à';
    assert.equal(faq.q, lang === 'en' ? 'Is La Villa Coliving expensive?' : 'La Villa Coliving est-elle chère ?');
    assert.notEqual(faq.q, m.PRICE_FAQ_RETIRED_QUESTIONS[lang]);
    assert.match(faq.a, /La Villa Coliving/);
    assert.ok(faq.a.includes(`${m.STATS.roomSizeMin} ${to} ${m.STATS.roomSizeMax} m²`), `${lang} : 16 à 24 m²`);
    assert.ok(faq.a.includes(`${m.STATS.livingSpacePerResidentMin} ${to} ${m.STATS.livingSpacePerResidentMax} m²`), `${lang} : surface par personne`);
    assert.equal(m.STATS.livingSpacePerResidentMin, 38, 'décision de Jérôme du 21/11 : de 38…');
    assert.equal(m.STATS.livingSpacePerResidentMax, 49, '… à 49 m² par personne');
    assert.ok(faq.a.includes(lang === 'en' ? '€31 to €40' : '31 à 40 €'), `${lang} : prix au m² des maisons`);
    assert.ok(faq.a.includes(lang === 'en' ? '€25 to €45' : '25 à 45 €'), `${lang} : prix au m² de la colocation classique`);
    assert.ok(faq.a.includes(lang === 'en' ? "It's cheaper than it looks." : "C'est moins cher qu'il n'y paraît."));
    assert.doesNotMatch(faq.a, lang === 'en' ? /\bcheaper\b(?! than it looks)/ : /moins cher(?! qu'il n'y paraît)/, `${lang} : jamais « moins cher » tout court`);
    assert.ok(faq.a.endsWith(m.appartBudgetSentences(lang)), `${lang} : L'Appart sous 1 000 € finit la réponse`);
    assert.ok(m.appartBudgetSentences(lang).includes(lang === 'en' ? '€1,000' : '1\u00a0000 €'), `${lang} : budget sous 1 000 €`);
    assert.doesNotMatch(faq.a, /\b\d{1,3}\s?min\b/i, `${lang} : aucune minute`);
    if (lang === 'fr') assert.doesNotMatch(faq.a + faq.q, /\b(vous|votre|vos)\b/i, 'tutoiement');
  }
});

test('phrase « premium » (21/11/2026) : FR/EN, sans prix, surfaces de la source unique, dans la fiche entité', () => {
  for (const lang of LANGS) {
    const s = m.PREMIUM_SENTENCE[lang];
    assert.ok(s.startsWith(lang === 'en' ? "Premium, for us, doesn't mean expensive." : 'Premium, chez nous, ne veut pas dire cher.'));
    assert.doesNotMatch(s, /CHF|€/);
    assert.ok(s.includes(`${m.STATS.livingSpacePerResidentMin} ${lang === 'en' ? 'to' : 'à'} ${m.STATS.livingSpacePerResidentMax} m²`));
    assert.equal(m.entityFactsStrings(lang).filter((x) => x === s).length, 1, `${lang} : une puce de la fiche`);
  }
});

test('A.3 : CHF et € jamais dans la même phrase ; les deux montants viennent de stats.ts', () => {
  for (const lang of LANGS) {
    const a = m.priceJustificationFaq(lang).a;
    for (const sentence of a.split(/(?<=[.!?])\s+/)) assert.ok(!(/CHF/.test(sentence) && /€/.test(sentence)), `${lang} : « ${sentence.slice(0, 60)} »`);
    const chf = lang === 'en' ? `${m.ENTITY_FACTS.price.en.fromChf} to ` : `${m.ENTITY_FACTS.price.fr.fromChf.replace(' CHF', '')} à `;
    assert.ok(a.includes(chf), `${lang} : fourchette CHF « ${chf}… »`);
  }
});

test('A.4 : phrase-clé FR/EN, surfaces et ménage depuis STATS, « 0 € » présent, aucune minute', () => {
  for (const lang of LANGS) {
    const k = m.PRICE_KEY_SENTENCE[lang];
    assert.ok(k.includes(`${m.STATS.roomSizeMin} ${lang === 'en' ? 'to' : 'à'} ${m.STATS.roomSizeMax} m²`));
    assert.ok(k.includes(lang === 'en' ? '€0' : '0 €'));
    assert.ok(k.includes(m.timesPerWeek(lang)));
    assert.doesNotMatch(k, /\b\d{1,3}\s?min\b/i);
  }
  assert.equal(m.timesPerWeek('fr'), m.STATS.cleaningPerWeek === 3 ? 'trois fois par semaine' : m.timesPerWeek('fr'));
});

test('consommateurs : tarifsFaq[1] = A.3 ; la fiche entité porte A.4 une fois par langue ; priceFactsStrings = 3 chaînes', () => {
  // tarifsFaq n'est pas dans le chargeur : on vérifie par la fiche (puce) et la cohérence des chaînes exposées.
  for (const lang of LANGS) {
    const strings = m.entityFactsStrings(lang);
    assert.equal(strings.filter((s) => s === m.PRICE_KEY_SENTENCE[lang]).length, 1, `${lang} : A.4 dans la fiche entité`);
    assert.equal(m.priceFactsStrings(lang).length, 3);
    assert.equal(m.priceFactsStrings(lang)[2], m.PRICE_KEY_SENTENCE[lang]);
  }
  assert.deepEqual([...m.PRICE_FAQ_ROUTES].sort(), ['/', '/chambre-a-louer-geneve', '/chambres-disponibles', '/colocation-geneve', '/faq', '/le-coliving', '/tarifs']);
  assert.equal(m.PRICE_KEY_SENTENCE_ROUTE, '/tarifs');
});

test('garde : l\'ancienne question « pourquoi plus élevés » est interdite (FR et EN), la nouvelle ne l\'est pas', () => {
  const page = (body) => `<html><body><main><p>${body}</p></main></body></html>`;
  const oldFr = page("Pourquoi les prix sont-ils plus élevés qu'une colocation classique ?");
  const oldEn = page('Why are your prices higher than a standard flatshare?');
  assert.ok(forbiddenIssues(oldFr, visibleText(oldFr), 'tarifs.html').some((i) => /pourquoi plus élevés/.test(i)));
  assert.ok(forbiddenIssues(oldEn, visibleText(oldEn), 'en-tarifs.html').some((i) => /pourquoi plus élevés/.test(i)));
  // (21/11/2026) La question A.3 du 09/10 (« Pourquoi La Villa coûte-t-elle plus cher… ») est retirée à son tour.
  for (const lang of LANGS) {
    const retired = page(m.PRICE_FAQ_RETIRED_QUESTIONS[lang]);
    assert.ok(forbiddenIssues(retired, visibleText(retired), lang === 'en' ? 'en-tarifs.html' : 'tarifs.html').some((i) => /ancienne question A\.3/.test(i)), `${lang} : question retirée interdite`);
  }
  for (const lang of LANGS) {
    const html = page(m.priceJustificationFaq(lang).q + ' ' + m.priceJustificationFaq(lang).a + ' ' + m.PRICE_KEY_SENTENCE[lang]);
    assert.deepEqual(forbiddenIssues(html, visibleText(html), lang === 'en' ? 'en-tarifs.html' : 'tarifs.html'), [], `${lang} : A.3/A.4 ne déclenchent aucune chaîne interdite`);
  }
});

test('garde : la comparaison des chaînes résiste au HTML (entités, espaces insécables)', () => {
  for (const lang of LANGS) {
    const faq = m.priceJustificationFaq(lang);
    const html = `<html><body><h3>${faq.q}</h3><p>${faq.a.replace(/&/g, '&amp;').replace(/'/g, '&#x27;')}</p></body></html>`;
    const text = visibleText(html);
    assert.equal(count(text, norm(faq.q)), 1);
    assert.equal(count(text, norm(faq.a)), 1, `${lang} : réponse retrouvée dans le texte visible`);
  }
});
