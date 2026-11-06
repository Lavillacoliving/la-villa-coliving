// Groupe Facebook comme ressource nommée (Lot L5, brief v3.1 — D5 validé le 08/10, D10 = oui le 09/10/2026) : invariants de la
// source unique (answerSlots.ts : A.7 mention, A.8 encart) et des gardes (check-answer-slots : aiguilles, phrases interdites, encart).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { visibleText } from '../../scripts/check-entity-facts.mjs';
import { resolveNeedle, FORBIDDEN_PHRASES, L1_TARGETS, countFacebookCallout, checkFacebookCallouts, countFacebookLine, checkFacebookLines } from '../../scripts/check-answer-slots.mjs';

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
  assert.deepEqual([...m.FACEBOOK_CALLOUT_ROUTES], ['/lavilla', '/leloft', '/lelodge']);
  // (13/10/2026, D2 du brief « conversion Ads ») /chambres-disponibles : encart seulement sans chambre libre ni datée.
  assert.deepEqual([...m.FACEBOOK_CALLOUT_OPTIONAL_ROUTES], ['/chambres-disponibles']);
});

test('L5.4 (réduit le 11/10/2026, règles publiées — C3) : « annonces vérifiées » reste interdit, « modéré » autorisé ; A.7/A.8 disent « règles publiées »', () => {
  const rule = FORBIDDEN_PHRASES.find((f) => /vérifiées/.test(f.label));
  assert.ok(rule, 'règle L5.4 présente');
  for (const bad of ['des annonces vérifiées chaque jour', 'verified listings only']) assert.match(bad, rule.re);
  for (const ok of ['un groupe modéré contre les arnaques', 'moderated against scams', 'animé et modéré par notre équipe']) assert.doesNotMatch(ok, rule.re);
  for (const lang of LANGS) {
    for (const s of m.facebookStrings(lang)) assert.doesNotMatch(s, rule.re, s);
    const pinned = lang === 'en' ? /run and moderated by .*published rules, suspicious listings removed/ : /animé et modéré par .*règles publiées, annonces douteuses retirées/;
    assert.match(m.facebookMention(lang), pinned, `${lang} : A.7`);
    assert.match(m.facebookCallout(lang).sentence, pinned, `${lang} : A.8`);
    assert.ok(m.ouChercherStrings(lang, 'short').some((s) => pinned.test(s)), `${lang} : canal 3 du bloc`);
  }
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

test('D2 (13/10/2026) : /chambres-disponibles accepte 0 ou 1 encart ; s\'il est affiché, texte vérifié au caractère près', () => {
  const asideOf = (lang, sentence = m.facebookCallout(lang).sentence) =>
    `<aside id="facebook-group" data-facebook-group-version="${m.FACEBOOK_GROUP_VERSION}"><p>${sentence}</p><a href="${m.FACEBOOK_GROUP.url}">${m.facebookCallout(lang).cta}</a></aside>`;
  const page = (inner) => `<html><body>${inner}</body></html>`;
  const base = [['lavilla.html', page(asideOf('fr'))], ['en-lavilla.html', page(asideOf('en'))], ['leloft.html', page(asideOf('fr'))],
    ['en-leloft.html', page(asideOf('en'))], ['lelodge.html', page(asideOf('fr'))], ['en-lelodge.html', page(asideOf('en'))]];
  const run = (fr, en) => checkFacebookCallouts(m, new Map([...base, ['chambres-disponibles.html', page(fr)], ['en-chambres-disponibles.html', page(en)]]));
  assert.deepEqual(run('', '').failures, [], 'chambres libres ou datées : encart masqué, garde verte');
  assert.deepEqual(run(asideOf('fr'), asideOf('en')).failures, [], 'aucune chambre : encart affiché, conforme');
  assert.ok(run(asideOf('fr', 'Texte modifié'), '').failures.some((f) => /^chambres-disponibles\.html : texte/.test(f)), 'texte altéré = échec');
  assert.ok(run(asideOf('fr').repeat(2), '').failures.some((f) => /^chambres-disponibles\.html : 2 encart/.test(f) && /0 ou 1/.test(f)), 'deux encarts = échec');
});

test('visibleText : la phrase A.8 est retrouvée telle quelle dans un HTML prérendu (apostrophes, insécables)', () => {
  for (const lang of LANGS) {
    const c = m.facebookCallout(lang);
    const html = `<aside id="facebook-group"><p>${c.sentence.replace(/'/g, '&#x27;')}</p><a>${c.cta}</a></aside>`;
    assert.ok(visibleText(html).includes(c.sentence), lang);
  }
});

// ── Brief du 05/11/2026 (D1-D5) : ligne A.9 sur l'accueil et /nos-maisons, attribution à la marque partout ─────────────
test('A.9 : textes arrêtés par Jérôme au mot près (FR/EN), lien séparé, routes / et /nos-maisons', () => {
  const fr = m.facebookLine('fr'), en = m.facebookLine('en');
  assert.equal(fr.sentence, 'Tu cherches aussi ailleurs ? Notre groupe Facebook public « Coliving & Colocation à Genève et alentours ! », animé et modéré par l\'équipe de La Villa Coliving, publie chaque semaine des chambres et colocations côté France, les nôtres et celles des autres.');
  assert.equal(en.sentence, 'Looking elsewhere too? Our public Facebook group "Coliving & Colocation à Genève et alentours !", run and moderated by the La Villa Coliving team, posts rooms and flatshares on the French side every week — ours and other people\'s.');
  assert.equal(fr.cta, 'Voir le groupe'); assert.equal(en.cta, 'See the group');
  assert.deepEqual([...m.FACEBOOK_LINE_ROUTES], ['/', '/nos-maisons']);
  for (const lang of LANGS) {
    assert.equal(resolveNeedle(m, 'facebookLine', lang), m.facebookLine(lang).sentence);
    assert.equal(m.facebookLine(lang).sentence.split(m.FACEBOOK_GROUP.name).length - 1, 1, `${lang} : nom du groupe une fois`);
  }
  for (const route of m.FACEBOOK_LINE_ROUTES) assert.ok(L1_TARGETS.some((x) => x.route === route && x.needles.includes('facebookLine')), route);
});

test('D5 : encart A.8 attribué à « l\'équipe de La Villa Coliving » / « the La Villa Coliving team », plus jamais « notre équipe » ; la garde l\'interdit', () => {
  assert.match(m.facebookCallout('fr').sentence, /animé et modéré par l'équipe de La Villa Coliving \(règles publiées, annonces douteuses retirées\)/);
  assert.match(m.facebookCallout('en').sentence, /run and moderated by the La Villa Coliving team \(published rules, suspicious listings removed\)/);
  for (const lang of LANGS) for (const s of m.facebookStrings(lang)) assert.doesNotMatch(s, /modéré par notre équipe|moderated by our team/i, s);
  const rule = FORBIDDEN_PHRASES.find((f) => /notre équipe/.test(f.label));
  assert.ok(rule, 'règle D5 présente');
  for (const bad of ['Le groupe, animé et modéré par notre équipe (règles publiées)', 'run and moderated by our team']) assert.match(bad, rule.re);
  for (const ok of [m.facebookCallout('fr').sentence, m.facebookLine('en').sentence, 'notre équipe te répond sous 48 h']) assert.doesNotMatch(ok, rule.re);
});

test('garde A.9 : exactement 1 ligne par page cible (FR + EN), texte au caractère près, nom et attribution 1×, lien ; 0 ailleurs', () => {
  const line = (lang) => `<p data-facebook-line="true" data-facebook-group-version="${m.FACEBOOK_GROUP_VERSION}">${m.facebookLine(lang).sentence} <a href="${m.FACEBOOK_GROUP.url}" target="_blank" rel="noopener">${m.facebookLine(lang).cta}</a></p>`;
  const page = (inner) => `<html><body><main>${inner}</main></body></html>`;
  const ok = new Map([['index.html', page(line('fr'))], ['en.html', page(line('en'))], ['nos-maisons.html', page(line('fr'))], ['en-nos-maisons.html', page(line('en'))], ['tarifs.html', page('')]]);
  assert.equal(countFacebookLine(page(line('fr'))), 1); assert.equal(countFacebookLine(page('')), 0);
  assert.deepEqual(checkFacebookLines(m, ok).failures, []);
  const twice = new Map(ok); twice.set('index.html', page(line('fr') + line('fr')));
  assert.ok(checkFacebookLines(m, twice).failures.some((f) => /index\.html : 2 ligne/.test(f)));
  const missing = new Map(ok); missing.set('en-nos-maisons.html', page(''));
  assert.ok(checkFacebookLines(m, missing).failures.some((f) => /en-nos-maisons\.html : 0 ligne/.test(f)));
  const dupName = new Map(ok); dupName.set('nos-maisons.html', page(line('fr') + `<p>${m.FACEBOOK_GROUP.name}</p>`));
  assert.ok(checkFacebookLines(m, dupName).failures.some((f) => /nos-maisons\.html : « Coliving & Colocation/.test(f) && /2 fois/.test(f)));
  const outside = new Map(ok); outside.set('tarifs.html', page(line('fr')));
  assert.ok(checkFacebookLines(m, outside).failures.some((f) => /tarifs\.html : ligne Facebook A\.9 hors périmètre/.test(f)));
  const noLink = new Map(ok); noLink.set('en.html', page(line('en').replace(m.FACEBOOK_GROUP.url, 'https://example.org/')));
  assert.ok(checkFacebookLines(m, noLink).failures.some((f) => /en\.html : lien du groupe/.test(f)));
});
