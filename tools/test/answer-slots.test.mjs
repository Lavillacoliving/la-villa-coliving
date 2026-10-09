// Créneaux de réponse (Lot L1, brief v3.1 du 09/10/2026) : invariants de la source unique src/data/answerSlots.ts
// (chargée via esbuild) et fonctions pures de la garde scripts/check-answer-slots.mjs sur des fixtures HTML.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { visibleText } from '../../scripts/check-entity-facts.mjs';
import {
  ANSWER_SLOTS_LIVE, L1_TARGETS, OU_CHERCHER_MONEY_ROUTES, FORBIDDEN_PHRASES, BRAND_MAX,
  ouChercherPerimeter, resolveNeedle, tagAttrs, countOuChercher, extractOuChercherSection, compareBlocks,
  nextElementAfter, checkAnchorAfter, orphanMarkers, stripAsides, normalizeNeedle, hasNeedle,
  embeddedBlogData, embeddedContent, embeddedAllText, plainMarkdown, embeddedHasText, brandCount, isDbPage, runChecks,
  FORBIDDEN_EXEMPT, exemptForbidden,
} from '../../scripts/check-answer-slots.mjs';

const m = await loadEntityFacts();
const LANGS = ['fr', 'en'];
const VARIANTS = ['full', 'short'];

// ── Source unique ────────────────────────────────────────────────────────────────────────────────────────────────

test('answerSlotsIssues() : aucune incohérence interne', () => {
  assert.deepEqual(m.answerSlotsIssues(), []);
});

test('bloc « Où chercher » : FR et EN ont le même nombre de chaînes par variante ; court ⊂ complet', () => {
  for (const v of VARIANTS) assert.equal(m.ouChercherStrings('fr', v).length, m.ouChercherStrings('en', v).length, v);
  assert.equal(m.ouChercherStrings('fr', 'full').length, 1 + 2 * 6, 'titre + 6 couples h3/p');
  assert.equal(m.ouChercherStrings('fr', 'short').length, 1 + 2 * 4, 'titre + 4 couples h3/p');
  for (const lang of LANGS) {
    const full = m.ouChercherStrings(lang, 'full');
    for (const s of m.ouChercherStrings(lang, 'short')) assert.ok(full.includes(s), `${lang} : « ${s.slice(0, 40)} » du bloc court absent du bloc complet`);
  }
});

test('toute chaîne canonique : ni token, ni « 15 min », ni vouvoiement (FR), ni balise', () => {
  const all = [];
  for (const lang of LANGS) {
    for (const v of VARIANTS) for (const s of m.ouChercherStrings(lang, v)) all.push([lang, s]);
    for (const s of m.communeSentences(lang)) all.push([lang, s]);
    all.push([lang, m.communeSentence('lelodge', lang, { openedIn: 2026 })]);
    for (const fn of ['a6Text', 'budgetRowLabel', 'budgetVariantText', 'comparatifRowLabel', 'coutDeLaVieRowLabel', 'priceRangeText', 'priceRangeCell']) all.push([lang, m[fn](lang)]);
    all.push([lang, m.GUARANTOR_SENTENCE[lang]]);
  }
  assert.ok(all.length > 40);
  for (const [lang, s] of all) {
    assert.ok(typeof s === 'string' && s.trim().length > 0);
    assert.doesNotMatch(s, /\{\{/, s);
    assert.doesNotMatch(s, /\b15 min/, s);
    assert.doesNotMatch(s, /</, s);
    if (lang === 'fr') assert.doesNotMatch(s, /(?<!rendez-)\bvous\b|\bvotre\b|\bvos\b/i, s);
  }
});

test('communeSentence : option openedIn dans la parenthèse, trois communes dans l\'ordre Lodge, Villa, Loft', () => {
  const plain = m.communeSentence('lelodge', 'fr');
  const opened = m.communeSentence('lelodge', 'fr', { openedIn: 2026 });
  assert.notEqual(plain, opened);
  assert.match(opened, /\(12 chambres, quartier de Romagny, ouvert en 2026\)/);
  assert.doesNotMatch(plain, /ouvert en/);
  assert.match(m.communeSentence('lelodge', 'en', { openedIn: 2026 }), /\(12 rooms, Romagny district, opened in 2026\)/);
  assert.deepEqual(m.communeSentences('fr'), ['lelodge', 'lavilla', 'leloft'].map((s) => m.communeSentence(s, 'fr')));
  for (const lang of LANGS) for (const s of m.communeSentences(lang)) assert.ok(s.includes('La Villa Coliving'), s);
});

test('ouChercherMarkdown : un H2 et six H3, dans l\'ordre des chaînes du bloc complet', () => {
  for (const lang of LANGS) {
    const md = m.ouChercherMarkdown(lang);
    assert.equal((md.match(/^## /gm) ?? []).length, 1, lang);
    assert.equal((md.match(/^### /gm) ?? []).length, 6, lang);
    const strings = m.ouChercherStrings(lang, 'full');
    assert.ok(md.startsWith(`## ${strings[0]}`));
    for (const s of strings) assert.ok(md.includes(s), `${lang} : « ${s.slice(0, 40)} »`);
  }
});

// ── Périmètre et cibles de la garde ───────────────────────────────────────────────────────────────────────────────

test('ouChercherPerimeter : 18 fichiers (4 money + 5 articles de OU_CHERCHER_ARTICLES) × FR/EN, fichiers prérendus nommés comme routeToFile', () => {
  const p = ouChercherPerimeter(m);
  assert.equal(p.length, 18);
  assert.equal(p.filter((x) => x.lang === 'fr').length, 9);
  assert.equal(Object.keys(OU_CHERCHER_MONEY_ROUTES).length, 4);
  assert.equal(p.filter((x) => x.kind === 'article' && x.lang === 'fr').length, Object.keys(m.OU_CHERCHER_ARTICLES).length);
  const files = p.map((x) => x.file);
  assert.ok(files.includes('colocation-geneve.html') && files.includes('en-colocation-geneve.html'));
  assert.ok(files.includes('blog-trouver-colocation-geneve-frontalier.html') && files.includes('en-blog-trouver-colocation-geneve-frontalier.html'));
  assert.equal(new Set(files).size, 18, 'aucun doublon');
  const art = p.find((x) => x.route === '/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france');
  assert.equal(art.variant, 'short');
  assert.equal(art.anchor.kind, 'before-entity-facts');
});

test('resolveNeedle : chaque clé de L1_TARGETS se résout en phrase canonique ; clé inconnue → erreur', () => {
  assert.equal(resolveNeedle(m, 'commune:lelodge:2026', 'fr'), m.communeSentence('lelodge', 'fr', { openedIn: 2026 }));
  assert.equal(resolveNeedle(m, 'commune:leloft', 'en'), m.communeSentence('leloft', 'en'));
  assert.equal(resolveNeedle(m, 'guarantor', 'en'), m.GUARANTOR_SENTENCE.en);
  assert.equal(resolveNeedle(m, 'budgetRowLabel', 'fr'), m.budgetRowLabel('fr'));
  assert.throws(() => resolveNeedle(m, 'inconnu', 'fr'), /clé de créneau inconnue/);
  for (const t of L1_TARGETS) for (const lang of LANGS) for (const k of t.needles) assert.ok(resolveNeedle(m, k, lang).length > 10, `${t.route} ${k} ${lang}`);
  assert.equal(typeof ANSWER_SLOTS_LIVE, 'boolean');
  assert.equal(L1_TARGETS.length, 14);
});

// ── Fonctions pures sur fixtures HTML ─────────────────────────────────────────────────────────────────────────────

const SERIF = 'style="font-family: &quot;DM Serif Display&quot;, serif;"';
/** Miroir du markup de src/components/OuChercher.tsx tel que Puppeteer le sérialise (U+00A0 → &nbsp;). */
function blockHtml(lang, variant, page, { version = m.OU_CHERCHER_VERSION, mutate = (s) => s } = {}) {
  const enc = (s) => mutate(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00A0/g, '&nbsp;');
  const t = m.ouChercherText(lang, variant);
  const inner = [`<h2 id="ou-chercher-title" class="x" ${SERIF}>${enc(t.title)}</h2>`, ...t.sections.map((s) => `<h3 class="y" ${SERIF}>${enc(s.h3)}</h3><p class="z">${enc(s.p)}</p>`)].join('');
  return `<section id="ou-chercher" data-ou-chercher-variant="${variant}" data-ou-chercher-version="${version}" data-ou-chercher-page="${page}" aria-labelledby="ou-chercher-title" class="">${inner}</section>`;
}
const page = (body, { lang = 'fr', embedded = null } = {}) => `<!DOCTYPE html><html lang="${lang}"><head><title>t</title><style>p{}</style></head><body><nav>La Villa Coliving</nav><main>${body}</main>${embedded ? `<script type="application/json" id="__blog_post_data__">${JSON.stringify(embedded).replace(/</g, '\\u003c')}</script>` : ''}</body></html>`;

test('tagAttrs / countOuChercher / extractOuChercherSection : attributs, imbrication, after', () => {
  assert.deepEqual(tagAttrs('<section id="a" data-x="1 2" class="">'), { id: 'a', 'data-x': '1 2', class: '' });
  const html = `<div><section class="outer"><p>avant</p>${blockHtml('fr', 'short', 'p1')}\n<h2>Suite</h2></section></div>`;
  assert.equal(countOuChercher(html), 1);
  const sec = extractOuChercherSection(html);
  assert.ok(sec && !sec.unclosed);
  assert.equal(sec.attrs['data-ou-chercher-variant'], 'short');
  assert.equal(sec.attrs['data-ou-chercher-version'], m.OU_CHERCHER_VERSION);
  assert.ok(sec.html.startsWith('<section id="ou-chercher"') && sec.html.endsWith('</section>'));
  assert.equal(sec.after, '\n<h2>Suite</h2></section></div>');
  // Section imbriquée dans le bloc : la fermeture correspondante est trouvée.
  const nested = '<section id="ou-chercher"><h2>T</h2><section><p>x</p></section></section><p>après</p>';
  assert.equal(extractOuChercherSection(nested).after, '<p>après</p>');
  assert.equal(extractOuChercherSection('<p>rien</p>'), null);
  assert.equal(extractOuChercherSection('<section id="ou-chercher"><p>jamais fermée').unclosed, true);
});

test('compareBlocks : égalité au caractère près après décodage (&nbsp; → U+00A0), diff localisé', () => {
  for (const lang of LANGS) for (const v of VARIANTS) {
    const cmp = compareBlocks(blockHtml(lang, v, 'p'), m.ouChercherStrings(lang, v));
    assert.ok(cmp.ok, `${lang}/${v} : ${JSON.stringify(cmp.diffs[0])}`);
    assert.equal(cmp.actual.length, m.ouChercherStrings(lang, v).length);
  }
  // Un espace normal à la place de l'insécable dans « 1 370 » = différence.
  const nbspLost = blockHtml('fr', 'full', 'p', { mutate: (s) => s.replace(/\u00A0/g, ' ') });
  const c1 = compareBlocks(nbspLost, m.ouChercherStrings('fr', 'full'));
  assert.equal(c1.ok, false);
  assert.ok(c1.diffs.every((d) => d.actual !== d.expected));
  // Un mot changé dans le H3 « Les zones » (index 1).
  const changed = blockHtml('fr', 'full', 'p', { mutate: (s) => (s === 'Les zones' ? 'Les secteurs' : s) });
  const c2 = compareBlocks(changed, m.ouChercherStrings('fr', 'full'));
  assert.deepEqual(c2.diffs, [{ index: 1, actual: 'Les secteurs', expected: 'Les zones' }]);
  // Variante courte rendue là où la complète est attendue : nombre de blocs différent.
  const c3 = compareBlocks(blockHtml('fr', 'short', 'p'), m.ouChercherStrings('fr', 'full'));
  assert.equal(c3.ok, false);
  assert.equal(c3.actual.length, 9);
  assert.equal(c3.expected.length, 13);
  // Les retours à la ligne et indentations du HTML sont repliés, pas les insécables.
  assert.ok(compareBlocks('<section id="ou-chercher">\n  <h2>\n    Titre  long\n  </h2>\n</section>', ['Titre long']).ok);
});

test('nextElementAfter / checkAnchorAfter : H2 d\'ancrage après blancs, commentaires React et <div> ouvrant ; aside entité', () => {
  const anchor = { kind: 'before-heading', fr: 'Comment éviter les arnaques ?', en: 'How to avoid scams?' };
  const h2 = `\n<!--$--><h2 class="c" ${SERIF}>Comment éviter les arnaques ?</h2>\n<p>Le marché…</p>`;
  assert.equal(nextElementAfter(h2).tag, 'h2');
  assert.equal(nextElementAfter(h2).text, 'Comment éviter les arnaques ?');
  assert.equal(checkAnchorAfter(h2, anchor, 'fr').ok, true);
  assert.equal(checkAnchorAfter(h2, anchor, 'en').ok, false, 'le titre EN n\'est pas celui-là');
  assert.equal(checkAnchorAfter('<div class="w"><h2 id="x">How to avoid scams?</h2>', anchor, 'en').ok, true, 'wrapper ouvrant ignoré');
  assert.equal(checkAnchorAfter('<h2>Comment &eacute;viter les arnaques ?</h2>', anchor, 'fr').ok, false, 'entité HTML nommée non décodée = titre différent (jamais émis par Puppeteer)');
  assert.equal(checkAnchorAfter('<h2>Comment <strong>éviter</strong> les arnaques ?</h2>', anchor, 'fr').ok, true, 'balise inline dans le titre tolérée');
  const r = checkAnchorAfter('<p class="mb-6">Un paragraphe</p><h2>Comment éviter les arnaques ?</h2>', anchor, 'fr');
  assert.equal(r.ok, false);
  assert.match(r.found, /^<p>/);
  assert.match(r.expected, /Comment éviter les arnaques \?/);
  assert.equal(checkAnchorAfter('</div><h2>Comment éviter les arnaques ?</h2>', anchor, 'fr').ok, false, 'fin de conteneur = bloc mal placé');
  assert.equal(checkAnchorAfter('', anchor, 'fr').ok, false);
  const ef = { kind: 'before-entity-facts' };
  assert.equal(checkAnchorAfter('\n\n<aside id="entity-facts" data-entity-facts-version="v" class="x"><p>…</p></aside>', ef, 'fr').ok, true);
  assert.equal(checkAnchorAfter('<aside class="my-10"><p>offre</p></aside><aside id="entity-facts"></aside>', ef, 'fr').ok, false, 'le bloc offre n\'est pas le bloc entité');
  assert.equal(checkAnchorAfter('<h2>Titre</h2>', ef, 'fr').ok, false);
});

test('orphanMarkers : marqueur rendu en texte (encodé &lt;!-- ou nu) détecté ; vrai commentaire HTML ignoré', () => {
  assert.equal(orphanMarkers(page('<p>a</p><!-- entity-facts --><p>b</p><!--$--><!-- -->')).length, 0);
  const hits = orphanMarkers(page('<p>Texte avant.</p><p>&lt;!-- ou-chercher:court --&gt;</p><p>après</p>'));
  assert.equal(hits.length, 1);
  assert.match(hits[0], /<!-- ou-chercher:court -->/);
  assert.ok(orphanMarkers(page('<p>&amp;lt;!-- x</p>')).length >= 1, 'double encodage aussi');
  assert.equal(orphanMarkers(page('<p>sain</p><script>var s = "<!-- pas visible -->";</script>')).length, 0, 'les scripts ne sont pas du texte visible');
});

test('normalizeNeedle / hasNeedle : blancs repliés des deux côtés, U+00A0 distinct, balises inline transparentes via visibleText', () => {
  assert.equal(normalizeNeedle('  a \n\t b  '), 'a b');
  assert.equal(normalizeNeedle('1\u00A0370'), '1\u00A0370');
  assert.equal(hasNeedle('x a   b\n c y', 'a b c'), true);
  assert.equal(hasNeedle('1 370 CHF', '1\u00A0370 CHF'), false, 'espace normal ≠ insécable');
  assert.equal(hasNeedle('1&nbsp;370', '1\u00A0370'), false, 'hasNeedle ne décode pas : décoder avant (visibleText)');
  const needle = m.budgetRowLabel('fr');
  const html = page(`<table><tr><td><strong>Chambre en coliving</strong> tout inclus côté France —\n <a href="/x">La Villa Coliving</a></td><td>1&nbsp;370 – 1&nbsp;430 CHF</td></tr></table>`);
  assert.equal(hasNeedle(visibleText(html), needle), true);
  assert.equal(hasNeedle(visibleText(html), m.priceRangeCell('fr')), true);
});

test('stripAsides : asides (imbriqués, multiples) retirés, le reste intact', () => {
  const html = '<p>a</p><aside class="offer"><p>La Villa Coliving</p><aside><p>x</p></aside></aside><p>b</p><aside id="entity-facts"><p>c</p></aside><p>d</p>';
  assert.equal(stripAsides(html), '<p>a</p><p>b</p><p>d</p>');
  assert.equal(stripAsides('<p>sans aside</p>'), '<p>sans aside</p>');
  assert.equal(stripAsides('<p>a</p><aside><p>jamais fermé'), '<p>a</p>');
  assert.equal(stripAsides('<p>a</p></aside><p>b</p>'), '<p>a</p></aside><p>b</p>', 'fermeture orpheline ignorée');
});

test('état embarqué : lecture du JSON (échappement \\u003c), contenu par langue, markdown aplati, recherche du créneau', () => {
  const needle = m.a6Text('fr');
  const post = { slug: 's', content_fr: `Intro.\n\n**${needle.slice(0, 30)}**${needle.slice(30)}\n\n| ${m.coutDeLaVieRowLabel('fr')} | 1 |\n<p>html</p>`, content_en: `Intro. [${m.a6Text('en')}](/en/faq)` };
  const html = page('<p>corps</p>', { embedded: { post, related: [] } });
  assert.ok(html.includes('\\u003cp>html'), 'fixture : « < » échappé comme BlogPostPage');
  assert.equal(embeddedBlogData(html).post.slug, 's');
  assert.equal(embeddedContent(html, 'fr'), post.content_fr);
  assert.equal(embeddedContent(html, 'en'), post.content_en);
  assert.equal(embeddedContent(page('<p>sans état</p>'), 'fr'), null);
  assert.equal(embeddedBlogData(page('<p>x</p>').replace('</body>', '<script type="application/json" id="__blog_post_data__">{pas du json</script></body>')), null);
  assert.equal(plainMarkdown('**gras** `code` [lien](/x) ![img](/i.webp) *it*'), 'gras code lien  it');
  assert.equal(embeddedHasText(html, 'fr', needle), true, 'gras partiel transparent');
  assert.equal(embeddedHasText(html, 'fr', m.coutDeLaVieRowLabel('fr')), true, 'cellule de tableau');
  assert.equal(embeddedHasText(html, 'en', m.a6Text('en')), true, 'lien transparent');
  assert.equal(embeddedHasText(html, 'fr', m.budgetVariantText('fr')), false);
  assert.equal(embeddedHasText(page('<p>x</p>'), 'fr', needle), null, 'inconnu sans état');
  // embeddedAllText : contenu + titre + extrait + meta de l'article, titres/extraits des cartes liées.
  const rich = page('<p>c</p>', { embedded: { post: { slug: 's', content_fr: 'corps', title_fr: 'Titre FR', excerpt_fr: 'Extrait', meta_description_fr: 'Meta', content_en: 'body', title_en: 'Title EN' }, related: [{ title_fr: 'Lié 1', excerpt_fr: 'Extrait lié', title_en: 'Related 1' }] } });
  assert.equal(embeddedAllText(rich, 'fr'), 'corps\nTitre FR\nExtrait\nMeta\nLié 1\nExtrait lié');
  assert.equal(embeddedAllText(rich, 'en'), 'body\nTitle EN\nRelated 1');
  assert.equal(embeddedAllText(page('<p>x</p>'), 'fr'), null);
});

test('exemptForbidden : le titre EN de l\'article « sans garant français » ne déclenche pas la règle, le reste oui', () => {
  assert.equal(FORBIDDEN_EXEMPT.length, 1);
  const title = 'Renting in France with No French Guarantor: The Cross-Border Guide';
  const hit = (s) => FORBIDDEN_PHRASES.some((f) => f.re.test(exemptForbidden(s)));
  assert.equal(hit(`Tips ${title} A Swiss franc salary`), false);
  assert.equal(hit(`${title}. In coliving, no French guarantor required.`), true, 'la promesse dans le corps reste interdite');
  assert.equal(hit('No French guarantor? The Visale guarantee'), true, 'insensible à la casse hors titre exempté');
});

test('brandCount / isDbPage / FORBIDDEN_PHRASES', () => {
  assert.equal(brandCount('La Villa Coliving, La Villa Coliving. la villa coliving'), 2);
  assert.ok(BRAND_MAX >= 12);
  assert.equal(isDbPage('blog-trouver-colocation-geneve-frontalier.html'), true);
  assert.equal(isDbPage('en-blog-x.html'), true);
  assert.equal(isDbPage('blog.html'), true);
  assert.equal(isDbPage('colocation-geneve.html'), false);
  assert.equal(isDbPage('en-faq.html'), false);
  const hit = (s) => FORBIDDEN_PHRASES.some((f) => f.re.test(s));
  assert.equal(hit("Tu auras besoin d'un garant"), true);
  assert.equal(hit('tu auras besoin d’un garant'), true, 'apostrophe typographique');
  assert.equal(hit("You'll need a guarantor"), true);
  assert.equal(hit('you will need a guarantor'), true);
  assert.equal(hit('with no French guarantor'), true);
  assert.equal(hit('Dossier de location sans garant français'), false, 'titre d\'article autorisé');
  assert.equal(hit(m.GUARANTOR_SENTENCE.fr), false);
  assert.equal(hit(m.GUARANTOR_SENTENCE.en), false);
});

// ── runChecks de bout en bout sur un prérendu synthétique ─────────────────────────────────────────────────────────

function syntheticPages({ mutateBlock, dropNeedles = false } = {}) {
  const pages = new Map();
  const perimeter = ouChercherPerimeter(m);
  const anchorHtml = (p) => (p.anchor.kind === 'before-entity-facts' ? '<aside id="entity-facts"><p>fiche</p></aside>' : `<h2 class="c">${p.anchor[p.lang]}</h2><p>suite</p>`);
  for (const p of perimeter) {
    const block = blockHtml(p.lang, p.variant, p.route.replace(/^\/(blog\/)?/, ''), mutateBlock ? { mutate: mutateBlock } : {});
    const body = p.kind === 'article' ? `<div class="blog-content"><p>intro</p>${block}\n${anchorHtml(p)}</div>` : `<section><p>hero</p></section>${block}`;
    pages.set(p.file, page(body, { lang: p.lang, embedded: p.kind === 'article' ? { post: { slug: p.route.slice(6), content_fr: 'x', content_en: 'y' }, related: [] } : null }));
  }
  for (const t of L1_TARGETS) for (const lang of LANGS) {
    const file = perimeter.find((p) => p.route === t.route && p.lang === lang)?.file ?? `${lang === 'en' ? 'en-' : ''}${t.route.slice(1).replace(/\//g, '-')}.html`;
    const needles = dropNeedles ? [] : t.needles.map((k) => resolveNeedle(m, k, lang));
    const body = `<p>${needles.map((n) => n.replace(/\u00A0/g, '&nbsp;')).join('</p><p>')}</p><aside class="offer"><p>La Villa Coliving</p></aside>`;
    const existing = pages.get(file);
    pages.set(file, existing ? existing.replace('<main>', `<main>${body}`) : page(body, { lang, embedded: t.route.startsWith('/blog/') ? { post: { slug: t.route.slice(6), content_fr: 'x', content_en: 'y' }, related: [] } : null }));
  }
  pages.set('faq.html', page('<p>Page sans bloc.</p>', { lang: 'fr' }));
  return pages;
}

test('runChecks : prérendu synthétique conforme → 0 échec, stats cohérentes (modes M1 et complet)', () => {
  const pages = syntheticPages();
  const m1 = runChecks(m, pages, { m1Only: true });
  assert.deepEqual(m1.failures, [], m1.failures.join('\n'));
  assert.equal(m1.stats.perimeter, 18);
  assert.equal(m1.stats.blocksOk, 18);
  assert.equal(m1.stats.needlesChecked, 0, '--m1-only ne vérifie pas les créneaux');
  const full = runChecks(m, pages, { live: true });
  assert.deepEqual(full.failures, [], full.failures.join('\n'));
  assert.equal(full.stats.needlesChecked, 2 * L1_TARGETS.reduce((n, t) => n + t.needles.length, 0));
  assert.equal(full.stats.forbiddenFailures + full.stats.forbiddenWarnings, 0);
});

test('runChecks : bloc hors périmètre, page absente, variante/version/texte faux, ancre déplacée → échecs M1', () => {
  const pages = syntheticPages();
  pages.set('faq.html', page(blockHtml('fr', 'short', 'faq'), { lang: 'fr' }));
  pages.delete('en-colocation-geneve.html');
  pages.set('annemasse-colocation.html', page(blockHtml('fr', 'full', 'annemasse-colocation'), { lang: 'fr' }));
  pages.set('chambre-a-louer-geneve.html', page(blockHtml('fr', 'full', 'x', { version: '1999-01-01' }), { lang: 'fr' }));
  pages.set('blog-trouver-colocation-geneve-frontalier.html', page(`<div>${blockHtml('fr', 'full', 'x')}<p>un paragraphe</p><h2>Comment éviter les arnaques ?</h2></div>`, { lang: 'fr' }));
  const r = runChecks(m, pages, { m1Only: true });
  const f = r.failures.join('\n');
  assert.match(f, /faq\.html : bloc « Où chercher » hors périmètre/);
  assert.match(f, /en-colocation-geneve\.html : page prérendue ABSENTE/);
  assert.match(f, /annemasse-colocation\.html : variante « full » \(attendu short\)/);
  assert.match(f, /annemasse-colocation\.html : texte du bloc ≠ source \(13 bloc\(s\) rendus, 9 attendus\)/);
  assert.match(f, /chambre-a-louer-geneve\.html : version du bloc « 1999-01-01 »/);
  assert.match(f, /blog-trouver-colocation-geneve-frontalier\.html : après le bloc, <p> « un paragraphe » — attendu <h2> « Comment éviter les arnaques \? »/);
  assert.equal(r.stats.outOfScope, 1);
  assert.equal(r.stats.blocksOk, 18 - 4);
});

test('runChecks : créneaux absents — stricts sur les pages money, adaptatifs sur les articles (avertissement, ou échec si déjà en base ou si live)', () => {
  const pages = syntheticPages({ dropNeedles: true });
  const adaptive = runChecks(m, pages, { live: false }); // mode adaptatif explicite (gel du 09/10 : ANSWER_SLOTS_LIVE = true par défaut)
  const moneyMissing = 2 * 2 * 3; // 2 routes money × FR/EN × 3 phrases de commune
  assert.equal(adaptive.stats.needleFailures, moneyMissing, adaptive.failures.join('\n'));
  assert.ok(adaptive.failures.every((x) => /^(en-)?(annemasse-colocation|chambre-a-louer-annemasse)\.html : créneau/.test(x)), adaptive.failures.join('\n'));
  assert.equal(adaptive.stats.needleWarnings, adaptive.stats.needlesChecked - moneyMissing);
  assert.ok(adaptive.warnings.some((w) => /blog-budget-colocation-geneve-guide-complet\.html : créneau « budgetRowLabel » absent .*SQL du lot pas encore appliqué/.test(w)));
  // SQL déjà appliqué (créneau dans l'état embarqué) mais prérendu sans le texte : échec même en mode adaptatif.
  const slug = 'quartiers-annemasse-ou-vivre-selon-profil';
  const withDb = page('<p>rien</p>', { lang: 'fr', embedded: { post: { slug, content_fr: `Texte. ${m.communeSentence('lelodge', 'fr')}`, content_en: 'y' }, related: [] } });
  pages.set(`blog-${slug}.html`, withDb);
  const r2 = runChecks(m, pages, { live: false });
  assert.ok(r2.failures.some((x) => x.startsWith(`blog-${slug}.html : créneau « commune:lelodge »`) && /présent dans l'état embarqué/.test(x)), r2.failures.join('\n'));
  // Mode live : tout créneau absent est un échec.
  const live = runChecks(m, pages, { live: true });
  assert.equal(live.stats.needleWarnings, 0);
  assert.equal(live.stats.needleFailures, live.stats.needlesChecked);
});

test('runChecks : marqueur orphelin, promesse garant (code strict / article adaptatif), densité', () => {
  const pages = syntheticPages();
  pages.set('faq.html', page('<p>Pas encore de fiche ? &lt;!-- ou-chercher --&gt; Tu auras besoin d\'un garant.</p>', { lang: 'fr' }));
  pages.set('blog-x.html', page('<p>You will need a guarantor.</p>', { lang: 'en', embedded: { post: { slug: 'x', content_fr: 'You will need a guarantor.', content_en: '' }, related: [] } }));
  pages.set('blog-y.html', page('<p>Tu auras besoin d’un garant.</p>', { lang: 'fr', embedded: { post: { slug: 'y', content_fr: 'Phrase corrigée.', content_en: '' }, related: [] } }));
  pages.set('blog-z.html', page('<p>Dossier de location sans garant français</p>', { lang: 'fr' }));
  // Carte « article lié » dont le titre est le titre EN exempté : rien ; carte dont l'extrait (en base) porte la promesse : avertissement.
  pages.set('en-blog-t.html', page('<h1>Transport</h1><aside><h3>Renting in France with No French Guarantor: The Cross-Border Guide</h3><p>You will need a guarantor, they say.</p></aside>', { lang: 'en', embedded: { post: { slug: 't', content_en: 'Trains.', content_fr: '' }, related: [{ title_en: 'Renting in France with No French Guarantor: The Cross-Border Guide', excerpt_en: 'You will need a guarantor, they say.' }] } }));
  pages.set('en-blog.html', page('<h2>Renting in France with No French Guarantor: The Cross-Border Guide</h2>', { lang: 'en' }));
  pages.set('colocation-geneve.html', pages.get('colocation-geneve.html').replace('<main>', `<main><p>${Array(13).fill('La Villa Coliving').join(' · ')}</p>`));
  const r = runChecks(m, pages, { live: false }); // comportement adaptatif testé explicitement
  const f = r.failures.join('\n');
  assert.match(f, /faq\.html : marqueur orphelin visible/);
  assert.match(f, /faq\.html : « tu auras besoin d'un garant » dans le texte visible/);
  assert.match(f, /blog-y\.html : « tu auras besoin d'un garant » .*absente de l'état embarqué/);
  assert.doesNotMatch(f, /blog-z\.html|en-blog-t\.html|en-blog\.html/);
  assert.ok(r.warnings.some((w) => /blog-x\.html : « you will need a guarantor » .*à retirer par le SQL du lot/.test(w)), r.warnings.join('\n'));
  assert.ok(r.warnings.some((w) => /en-blog-t\.html : « you will need a guarantor » .*à retirer par le SQL du lot/.test(w)), 'extrait de carte liée = base, donc avertissement');
  assert.ok(!r.warnings.some((w) => /« no French guarantor »/.test(w)), 'titre exempté nulle part signalé');
  assert.ok(r.warnings.some((w) => /colocation-geneve\.html : « La Villa Coliving » 1[4-9] fois/.test(w)), r.warnings.join('\n'));
  assert.equal(r.stats.orphanPages, 1);
  assert.equal(r.stats.forbiddenFailures, 2);
  assert.equal(r.stats.forbiddenWarnings, 2);
  assert.equal(r.stats.densityPages, 1);
  // En --m1-only, l'orphelin reste un échec mais ni garant ni densité ne sont évalués.
  const m1 = runChecks(m, pages, { m1Only: true });
  assert.equal(m1.stats.orphanPages, 1);
  assert.equal(m1.stats.forbiddenFailures + m1.stats.densityPages, 0);
});
