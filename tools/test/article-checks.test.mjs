import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkContent, checkMeta, extractFaqPairs, extractGfmTables, findMarkers, wordCount, unknownTokens, sqlDollar, readTimeMin, ENTITY_FACTS_MARKER } from '../../scripts/lib/article-checks.mjs';

const faq = (n) => Array.from({ length: n }, (_, i) => `**Question numéro ${i + 1}, avec un point d'interrogation ?**\n\nRéponse courte numéro ${i + 1}. Une deuxième phrase pour faire vrai.\n`).join('\n');
const filler = (words) => Array.from({ length: words }, (_, i) => `mot${i}`).join(' ');

function draft({ words = 1900, markers = 1, table = true, lang = 'fr', pairs = 6, badChoice = true, links = true } = {}) {
  const en = lang === 'en';
  const pre = en ? '/en' : '';
  const header = en ? '| Option | Price | Realistic timeline | Paperwork required | Minimum stay |' : '| Option | Prix | Délai réaliste | Dossier demandé | Durée minimum |';
  const tbl = table ? `${header}\n|---|---|---|---|---|\n| Studio | 1 800 CHF | 6 semaines | 3 fiches | 12 mois |\n| Coloc | 900 € | 4 semaines | garant | 12 mois |\n| Coliving | {{PRIX_DES}} | 2 semaines | contrat | 3 mois |\n| Apart'hôtel | 2 500 € | 1 jour | CB | 1 nuit |\n` : '';
  const marker = Array.from({ length: markers }, () => ENTITY_FACTS_MARKER).join('\n\n');
  const linksMd = links ? `[Candidater](${pre}/candidature) · [chambres](${pre}/chambre-a-louer-geneve) · [guide](${pre}/blog/trouver-colocation-geneve-frontalier)` : '';
  return `Chapô qui répond d'abord. ${filler(40)}\n\n**En bref**\n- a\n- b\n\n## Section 1\n\n${filler(Math.floor(words * 0.25))}\n\n## Section 2\n\n${filler(Math.floor(words * 0.25))}\n\n## Section 3\n\n${filler(Math.floor(words * 0.1))}\n\n## Les options\n\n${tbl}\n${marker}\n\nPour un nouveau job dans un mois : dossier en 2 minutes, réponse sous 48 h. ${linksMd}\n\n## Section 5\n\n${filler(Math.floor(words * 0.3))}\n\n## ${badChoice ? (en ? "When it's not the right choice" : "Quand ce n'est pas le bon choix") : 'Autre'}\n\n${filler(40)}\n\n## ${en ? 'Frequently asked questions' : 'Questions fréquentes'}\n\n${faq(pairs)}\n`;
}

test('brouillon conforme : 0 échec', () => {
  const r = checkContent(draft(), 'fr');
  assert.deepEqual(r.failures, [], r.failures.join('\n'));
  assert.ok(r.stats.words >= 1800);
  const e = checkContent(draft({ lang: 'en' }), 'en');
  assert.deepEqual(e.failures, [], e.failures.join('\n'));
});

test('marqueur : absent, doublé, trop tôt, sans tableau avant', () => {
  assert.match(checkContent(draft({ markers: 0 }), 'fr').failures.join('\n'), /0 marqueur/);
  assert.match(checkContent(draft({ markers: 2 }), 'fr').failures.join('\n'), /2 marqueur/);
  assert.match(checkContent(draft({ table: false }), 'fr').failures.join('\n'), /aucun tableau d'options \(GFM\) avant le marqueur/);
  const early = `${ENTITY_FACTS_MARKER}\n\nphrase\n\n${draft({ markers: 0 })}`;
  assert.match(checkContent(early, 'fr').failures.join('\n'), /40 % de tête/);
});

test('FAQ : compte, ### interdit, miroir de BlogPostPage', () => {
  assert.match(checkContent(draft({ pairs: 3 }), 'fr').failures.join('\n'), /3 paire\(s\) FAQ/);
  const { pairs } = extractFaqPairs('## Questions fréquentes\n\n**Q un ?**\n\nRéponse **grasse** avec [lien](/x).\n\n**Q deux ?**\n\nR2.\n');
  assert.equal(pairs.length, 2);
  assert.equal(pairs[0].a, 'Réponse grasse avec lien.');
  const withH3 = draft().replace('## Questions fréquentes\n', '## Questions fréquentes\n\n### Sous-titre\n');
  assert.match(checkContent(withH3, 'fr').failures.join('\n'), /« ### » dans la section FAQ/);
});

test('mots, tokens, $$, section « pas le bon choix », liens obligatoires, EN en /en/', () => {
  assert.match(checkContent(draft({ words: 900 }), 'fr').failures.join('\n'), /mots \(attendu 1800-2500\)/);
  assert.deepEqual(unknownTokens('a {{PRIX_DES}} b {{FOO}} {{ NB_CHAMBRES }}'), ['FOO']);
  assert.match(checkContent(draft().replace('Chapô', 'Chapô {{FOO}} $$'), 'fr').failures.join('\n'), /token\(s\) inconnu|\$\$/);
  assert.match(checkContent(draft({ badChoice: false }), 'fr').failures.join('\n'), /pas le bon choix/);
  const f = checkContent(draft({ links: false }), 'fr').failures.join('\n');
  assert.match(f, /aucun lien vers \/candidature/); assert.match(f, /page money/); assert.match(f, /pilier/);
  const enBad = draft({ lang: 'en' }).replace('(/en/candidature)', '(/candidature)');
  assert.match(checkContent(enBad, 'en').failures.join('\n'), /sans préfixe \/en\//);
  const redirected = checkContent(draft(), 'fr', { isRedirected: (p) => p === '/blog/trouver-colocation-geneve-frontalier' });
  assert.match(redirected.failures.join('\n'), /URL redirigée/);
});

test('tableaux GFM et wordCount sans marqueur', () => {
  const t = extractGfmTables('x\n\n| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |\n\ny');
  assert.equal(t.length, 1); assert.deepEqual(t[0].headers, ['A', 'B']); assert.equal(t[0].rows, 2);
  assert.equal(wordCount(`un deux\n${ENTITY_FACTS_MARKER}\ntrois {{PRIX_DES}}`), 4);
  assert.equal(findMarkers(`a\n  <!--  entity-facts -->  \nb`).length, 1);
});

test('meta : title avec suffixe ≤ 70, prix interdit, meta ≤ 155, catégorie, tags, author', () => {
  const ok = { slug: 'ma-page-2026', title_fr: 'Titre court', title_en: 'Short title', excerpt_fr: 'x', excerpt_en: 'y', meta_description_fr: 'a'.repeat(140), meta_description_en: 'b'.repeat(140), author: 'Jerome Austin', category: 'geneva', tags: ['a', 'b', 'c'], image_url: '/images/x.webp', intent_bucket: 'medium' };
  assert.deepEqual(checkMeta(ok).failures, []);
  const bad = { ...ok, slug: 'Bad_Slug', title_fr: 'T'.repeat(60), title_en: 'Chambre à 1 370 CHF', meta_description_fr: 'a'.repeat(170), category: 'autre', tags: [], author: 'La Villa Team' };
  const r = checkMeta(bad);
  const f = r.failures.join('\n');
  assert.match(f, /slug/); assert.match(f, /title_fr : 60 car/); assert.match(f, /prix dans le title/); assert.match(f, /meta_description_fr : 170/); assert.match(f, /category/); assert.match(f, /tags/);
  assert.match(r.warnings.join('\n'), /author/);
});

test('helpers SQL', () => {
  assert.equal(sqlDollar('a $$ b', 'md'), '$md$a $$ b$md$');
  assert.throws(() => sqlDollar('x $md$ y'));
  assert.equal(readTimeMin(1900), 10);
});
