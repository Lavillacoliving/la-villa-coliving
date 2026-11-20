// (L'Appart, Lot 4, étape E5) Les faits de la MARQUE à deux gammes : trois phrases canoniques (fiche, llms.txt), fiche JSON-LD de
// la marque sans équipement des maisons, chaînes interdites « dès 530 € » et « au L'Appart », phrase P3 de la FAQ A.3, outils
// opérateur (L'Appart = ancre de marque, page money). Modules chargés via esbuild, comme les gardes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { forbiddenIssues, canonicalSentenceIssues, brandAmenityIssues, visibleText } from '../../scripts/check-entity-facts.mjs';
import { llmsGammeIssues, gammeSentenceIssues, HOUSE_AMENITY_RE } from '../../scripts/lib/gamme-rules.mjs';
import { renderLlms } from '../../scripts/build-llms-txt.mjs';
import { MONEY_PAGES } from '../../scripts/lib/article-checks.mjs';
import { BRAND_RE, MONEY_ROUTES, MONEY_KEYWORDS, MENTION_PATTERNS } from '../../tools/lib/config.mjs';
import { classifyAnchor } from '../../tools/lib/html-links.mjs';

const m = await loadEntityFacts();
const LANGS = ['fr', 'en'];
const page = (s) => `<html><head><title>t</title></head><body><main><p>${s}</p></main></body></html>`;
const flatten = (node, acc = []) => { if (node && typeof node === 'object') { if (node['@type']) acc.push(node); for (const v of Object.values(node)) { if (Array.isArray(v)) v.forEach((x) => flatten(x, acc)); else if (v && typeof v === 'object') flatten(v, acc); } } return acc; };

test('fiche de la marque : 9 puces, les trois phrases canoniques une fois chacune, aucune incohérence interne', () => {
  assert.deepEqual(m.entityFactsIssues(), []);
  for (const lang of LANGS) {
    const t = m.entityFactsText(lang);
    assert.equal(t.bullets.length, 9);
    const all = [t.title, t.paragraph, ...t.bullets].join(' ');
    for (const s of [m.BRAND_CANONICAL_SENTENCE[lang], m.MAISONS_CANONICAL_SENTENCE[lang], m.APPART_CANONICAL_SENTENCE[lang]]) {
      assert.equal(all.split(s).length - 1, 1, `${lang} : « ${s.slice(0, 40)}… » une fois`);
    }
    assert.ok(t.paragraph.startsWith(m.BRAND_CANONICAL_SENTENCE[lang]), 'le paragraphe s\'ouvre sur la phrase de la marque');
    assert.equal(t.bullets[0], m.MAISONS_CANONICAL_SENTENCE[lang]);
    assert.equal(t.bullets[3], m.APPART_CANONICAL_SENTENCE[lang]);
    // V2, par phrase : aucune phrase de la fiche ne porte un montant de L'Appart et un équipement des maisons.
    assert.deepEqual(gammeSentenceIssues([t.paragraph, ...t.bullets].flatMap((b) => b.split(/(?<=[.!?;])\s+/)), m), []);
  }
});

test('canonicalSentenceIssues : 1× sur la fiche de la marque, +1 (marque, L\'Appart) sur la fiche de L\'Appart, 0× ailleurs', () => {
  for (const lang of LANGS) {
    const fiche = visibleText(page(m.entityFactsStrings(lang).join(' ')));
    assert.deepEqual(canonicalSentenceIssues(fiche, lang, { brandFiche: true }, m), []);
    assert.equal(canonicalSentenceIssues(fiche, lang, {}, m).length, 3, 'fiche de la marque hors périmètre : 3 écarts');
    assert.deepEqual(canonicalSentenceIssues('aucune phrase', lang, {}, m), []);
    const twice = `${fiche} ${m.MAISONS_CANONICAL_SENTENCE[lang]}`;
    assert.match(canonicalSentenceIssues(twice, lang, { brandFiche: true }, m).join(), /des maisons présente 2 fois \(attendu 1\)/);
    const appartPage = `${m.APPART_CANONICAL_SENTENCE[lang]} … ${m.BRAND_CANONICAL_SENTENCE[lang]}`;
    assert.deepEqual(canonicalSentenceIssues(appartPage, lang, { appartFiche: true }, m), []);
  }
});

test('brandAmenityIssues : la fiche de la marque (33 chambres, L\'Appart dans department) n\'a ni piscine, ni sauna, ni salle de sport', () => {
  for (const lang of LANGS) {
    const nodes = flatten([m.buildLocalBusinessSchema(lang, 'd'), m.buildHomeLodgingBusinessSchema(lang)]);
    assert.deepEqual(brandAmenityIssues(nodes, m), []);
    const org = nodes.find((n) => n['@id'] === m.ORG_ID);
    assert.equal(org.numberOfRooms, m.ENTITY_FACTS.brand.totalRooms);
  }
  const bad = { '@type': 'LocalBusiness', '@id': m.ORG_ID, numberOfRooms: m.ENTITY_FACTS.brand.totalRooms, amenityFeature: [{ '@type': 'LocationFeatureSpecification', name: 'Piscine', value: true }] };
  assert.equal(brandAmenityIssues([bad], m).length, 1);
  const fibre = { ...bad, amenityFeature: [{ '@type': 'LocationFeatureSpecification', name: `Internet fibre jusqu'à ${m.ENTITY_FACTS.fiberSpeed}`, value: true }] };
  assert.equal(brandAmenityIssues([fibre], m).length, 1, 'le débit de fibre des maisons non plus');
  const housesOnly = { ...bad, numberOfRooms: m.ENTITY_FACTS.totalRooms };
  assert.deepEqual(brandAmenityIssues([housesOnly], m), [], 'fiche des seules maisons (sans L\'Appart) : la piscine reste permise');
  const house = { '@type': 'LodgingBusiness', '@id': `${m.HOUSES[0].url}#lodging`, numberOfRooms: 10, amenityFeature: bad.amenityFeature };
  assert.deepEqual(brandAmenityIssues([house], m), [], 'nœud d\'une maison : ses équipements');
});

test('chaînes interdites : « dès 530 € » (P5) et « au L\'Appart » (V7), bornées', () => {
  for (const s of ['Chambres dès 530 € par mois.', 'À partir de 530 euros.', 'Rooms from €530 a month.', 'starting at 530 EUR', 'Rendez-vous au L\'Appart.', 'La cuisine du L’Appart.']) {
    assert.equal(forbiddenIssues(page(s)).length, 1, s);
  }
  for (const s of ['Dès 1 530 € dans les maisons.', 'from €1,530', '1 060 € par mois, soit 530 € par personne à deux.', 'au l\'appartement', 'Bienvenue à L\'Appart, la cuisine de L\'Appart.']) {
    assert.deepEqual(forbiddenIssues(page(s)), [], s);
  }
});

test('llms.txt : trois phrases canoniques une fois chacune, L\'Appart (propriété, lien), aucun jeton, aucun mélange des gammes', async () => {
  for (const lang of LANGS) {
    const out = await renderLlms(lang, m);
    assert.doesNotMatch(out, /\{\{[A-Z_]+\}\}/);
    assert.deepEqual(canonicalSentenceIssues(out, lang, { brandFiche: true }, m), []);
    assert.deepEqual(llmsGammeIssues(out, m), []);
    const lines = out.split('\n');
    assert.equal(lines.filter((l) => l === `- ${m.BRAND_CANONICAL_SENTENCE[lang]}`).length, 1, 'fait clé n° 1 = phrase de la marque');
    assert.ok(lines.some((l) => l.startsWith(`- ${m.APPART.name}`) && l.includes(m.appartCommuteLine(lang).slice(1))), 'ligne de propriété de L\'Appart');
    assert.ok(out.includes(`https://www.lavillacoliving.com/${lang === 'en' ? 'en/' : ''}${m.APPART.key}`), 'lien de L\'Appart');
    assert.ok(out.includes(m.APPART.descriptor[lang]), 'en-tête : descripteur de L\'Appart');
    for (const key of m.INTERNAL_ONLY_KEYS ?? []) assert.ok(!out.toLowerCase().includes(String(key).toLowerCase()), 'aucune clé interne');
  }
});

test('FAQ A.3 : la réponse se termine par la phrase P3 (L\'Appart, sans équipement des maisons) et porte le lien « Voir L\'Appart »', () => {
  assert.deepEqual(m.priceFactsIssues(), []);
  for (const lang of LANGS) {
    const faq = m.priceJustificationFaq(lang);
    assert.ok(faq.a.endsWith(m.appartBudgetSentences(lang)));
    assert.ok(!HOUSE_AMENITY_RE.test(m.appartBudgetSentences(lang)));
    assert.equal(faq.more?.href, `/${m.APPART.key}`);
  }
});

test('outils : L\'Appart = ancre de marque (pas « l\'appartement »), page money des articles et du graphe des liens', () => {
  assert.ok(MONEY_PAGES.includes(`/${m.APPART.key}`));
  assert.ok(MONEY_ROUTES.includes(`/${m.APPART.key}`) && MONEY_ROUTES.includes(`/en/${m.APPART.key}`));
  assert.ok(MONEY_KEYWORDS[`/${m.APPART.key}`] && MONEY_KEYWORDS[`/en/${m.APPART.key}`]);
  assert.ok(BRAND_RE.test("l'appart") && !BRAND_RE.test("l'appartement"));
  assert.equal(classifyAnchor('Voir L’Appart', `/${m.APPART.key}`), 'marque');
  assert.equal(classifyAnchor("un appartement en colocation", `/${m.APPART.key}`), 'generique');
  assert.equal(('L’Appart, l\'appartement et L\'Appart'.match(MENTION_PATTERNS.fr[`/${m.APPART.key}`]) ?? []).length, 2);
});
