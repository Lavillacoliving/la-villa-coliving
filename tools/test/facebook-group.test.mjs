// Groupe Facebook comme ressource nommée (Lot L5, brief v3.1 — D5 validé le 08/10, D10 = oui le 09/10/2026) : invariants de la
// source unique (answerSlots.ts : A.7 mention, A.8 encart) et des gardes (check-answer-slots : aiguilles, phrases interdites, encart).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { visibleText } from '../../scripts/check-entity-facts.mjs';
import { resolveNeedle, FORBIDDEN_PHRASES, L1_TARGETS, countFacebookCallout, checkFacebookCallouts } from '../../scripts/check-answer-slots.mjs';

const m = await loadEntityFacts();
const LANGS = ['fr', 'en'];

test('answerSlotsIssues() reste vide avec A.7/A.8', () => {
  assert.deepEqual(m.answerSlotsIssues(), []);
});

test('A.7 : nom du groupe au caractère près, membres formatés, volume depuis FACEBOOK_GROUP, marque nommée, FR/EN', () => {
  for (const lang of LANGS) {
    const s = m.facebookMention(lang);
    assert.ok(s.includes(m.FACEBOOK_GROUP.name), lang);
    assert.match(s, lang === 'en' ? /about 1,600 members/ : /environ 1[ \u00A0\u202F]600 membres/, `${lang} : membres (thousands — même séparateur que le bloc « Où chercher »)`);
    assert.ok(s.includes(m.FACEBOOK_GROUP.postsPerMonth[lang]), `${lang} : volume`);
    assert.match(s, /La Villa Coliving/);
    assert.doesNotMatch(s, /\d{3}\s?(publications|posts)\b/, 'jamais un nombre de publications en dur');
    if (lang === 'fr') assert.doesNotMatch(s, /\b(vous|votre|vos)\b/i);
  }
});

test('A.7 markdown : même texte visible, le nom du groupe porte le lien', () => {
  for (const lang of LANGS) {
    const md = m.facebookMentionMarkdown(lang);
    assert.ok(md.includes(`](${m.FACEBOOK_GROUP.url})`));
    assert.equal(md.replace(/\[([^\]]+)\]\([^)]+\)/, '$1'), m.facebookMention(lang));
  }
});

test('A.8 : phrase + libellé du lien, nom du groupe, volume court, « Rejoindre le groupe » / « Join the group »', () => {
  const fr = m.facebookCallout('fr'), en = m.facebookCallout('en');
  assert.ok(fr.sentence.includes(m.FACEBOOK_GROUP.name) && en.sentence.includes(m.FACEBOOK_GROUP.name));
  assert.ok(fr.sentence.includes(m.FACEBOOK_GROUP.postsPerMonthShort.fr) && en.sentence.includes(m.FACEBOOK_GROUP.postsPerMonthShort.en));
  assert.equal(fr.cta, 'Rejoindre le groupe'); assert.equal(en.cta, 'Join the group');
  assert.match(fr.sentence, /^Pas de chambre libre chez nous/); assert.match(en.sentence, /^No room free with us/);
  assert.deepEqual([...m.FACEBOOK_CALLOUT_ROUTES], ['/lavilla', '/leloft', '/lelodge', '/chambres-disponibles']);
});

test('L5.4 : « annonces vérifiées » / « modéré contre les arnaques » interdits ; les textes A.7/A.8 ne les contiennent pas', () => {
  const rule = FORBIDDEN_PHRASES.find((f) => /vérifiées/.test(f.label));
  assert.ok(rule, 'règle L5.4 présente');
  for (const bad of ['des annonces vérifiées chaque jour', 'verified listings only', 'un groupe modéré contre les arnaques', 'moderated against scams']) assert.match(bad, rule.re);
  for (const lang of LANGS) for (const s of m.facebookStrings(lang)) assert.doesNotMatch(s, rule.re, s);
});

test('garde : aiguille « facebookMention » résolue, 4 articles ciblés, 0 ou 1 encart par page', () => {
  for (const lang of LANGS) assert.equal(resolveNeedle(m, 'facebookMention', lang), m.facebookMention(lang));
  const slugs = Object.keys(m.FACEBOOK_MENTION_ARTICLES);
  assert.equal(slugs.length, 4);
  for (const slug of slugs) {
    const t = L1_TARGETS.find((x) => x.route === `/blog/${slug}`);
    assert.ok(t && t.needles.includes('facebookMention'), slug);
  }
  const aside = `<aside id="facebook-group" data-facebook-group-version="${m.FACEBOOK_GROUP_VERSION}"><p>${m.facebookCallout('fr').sentence}</p><a href="${m.FACEBOOK_GROUP.url}">${m.facebookCallout('fr').cta}</a></aside>`;
  const page = (n) => `<html><body>${aside.repeat(n)}</body></html>`;
  assert.equal(countFacebookCallout(page(0)), 0); assert.equal(countFacebookCallout(page(1)), 1); assert.equal(countFacebookCallout(page(2)), 2);
  const pages = new Map([
    ['lavilla.html', page(1)], ['en-lavilla.html', page(1).replace(m.facebookCallout('fr').sentence, m.facebookCallout('en').sentence).replace(m.facebookCallout('fr').cta, m.facebookCallout('en').cta)],
    ['leloft.html', page(0)], ['tarifs.html', page(1)],
  ]);
  const r = checkFacebookCallouts(m, pages);
  assert.ok(r.failures.some((f) => /leloft\.html/.test(f) && /0/.test(f)), 'encart manquant = échec');
  assert.ok(r.failures.some((f) => /tarifs\.html/.test(f) && /hors périmètre/.test(f)), 'encart hors périmètre = échec');
  assert.ok(!r.failures.some((f) => /^lavilla\.html|^en-lavilla\.html/.test(f)), 'pages conformes sans échec');
  assert.ok(r.warnings.some((f) => /lelodge\.html.*absente/.test(f)), 'page prérendue absente = avertissement (échec déjà porté par check-entity-facts)');
});

test('visibleText : la phrase A.8 est retrouvée telle quelle dans un HTML prérendu (apostrophes, insécables)', () => {
  for (const lang of LANGS) {
    const c = m.facebookCallout(lang);
    const html = `<aside id="facebook-group"><p>${c.sentence.replace(/'/g, '&#x27;')}</p><a>${c.cta}</a></aside>`;
    assert.ok(visibleText(html).includes(c.sentence), lang);
  }
});
