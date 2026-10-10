// Règles de preuves sociales de la garde scripts/check-entity-facts.mjs (Lot L3 « Note Google et preuves », décisions D3/D4
// de Jérôme du 09/10/2026) : « 4,9/5 » et « enquêtes résidents » interdits, « 150 résidents » / « 50+ personnes » interdits,
// « 99 % » d'occupation interdit hors Observatoire, JSON-LD sans aggregateRating ni Review, verdict adaptatif sur la vue
// v_social_proof — sur des fixtures HTML ; puis la liste déclarative scripts/l3-social-proof.edits.mjs contre la source réelle.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  forbiddenIssues, nearWindow, NEAR_WINDOW, ratingMarkupIssues, socialProofVerdict, SOCIAL_PROOF_VIEW, SOCIAL_PROOF_MIGRATION,
} from '../../scripts/check-entity-facts.mjs';
import { buildEdits, sqlDoc, POST_STATE_WATCH } from '../../scripts/l3-social-proof.edits.mjs';
import { forbiddenIssues as insertedForbidden, applyEdits, checkEdit } from '../../scripts/build-slots-sql.mjs';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';

// Le <head> et les scripts ne sont jamais du texte visible : la fixture y glisse les anciennes chaînes pour le prouver.
const page = (body) => `<!DOCTYPE html><html lang="fr"><head><title>t</title><meta name="description" content="Note 4,9/5 enquêtes résidents, 99 % d'occupation"><script>var s = "150 résidents";</script></head><body><nav>La Villa Coliving</nav><main>${body}</main></body></html>`;
const p = (...sentences) => page(sentences.map((s) => `<p>${s}</p>`).join(''));
/** Grille de statistiques : valeur dans un bloc, étiquette dans le bloc suivant (forme de l'ancien hero et de /candidature). */
const tile = (value, label) => page(`<div class="grid"><div><div class="v">${value}</div><div class="l">${label}</div></div></div>`);
const only = (issues, re) => { assert.equal(issues.length, 1, issues.join('\n') || '(aucun message)'); assert.match(issues[0], re); };

test('D4 : « 4,9/5 » et « enquêtes résidents » / « resident surveys » interdits, dans toutes leurs graphies', () => {
  const r = forbiddenIssues(p('★ 4,9/5 (enquêtes résidents) · 100+ résidents depuis 2021'));
  assert.equal(r.length, 2, r.join('\n'));
  assert.ok(r.some((x) => /4,9\/5/.test(x)) && r.some((x) => /enquêtes résidents/.test(x)));
  const en = forbiddenIssues(p('4.9/5 — resident surveys 2021-2026'));
  assert.equal(en.length, 2, en.join('\n'));
  only(forbiddenIssues(p('Note 4,9 / 5 · 100 avis')), /4,9\/5/);
  only(forbiddenIssues(p('une note moyenne de 4,9 sur 5')), /4,9\/5/);
  only(forbiddenIssues(p('rated 4.9 out of 5 by residents')), /4,9\/5/);
  only(forbiddenIssues(p("Note moyenne — enquête résidents 2021-2026")), /enquêtes résidents/);
  only(forbiddenIssues(p('our resident survey says')), /resident surveys/);
});

test('D4 : la note Google « 4,8/5 sur Google (36 avis) » et son lien passent ; « des dizaines d\'avis Google » (vrai) passe', () => {
  assert.deepEqual(forbiddenIssues(p(
    '4,8/5 sur Google (36 avis) — <a href="https://maps.google.com/?cid=14514002506022967350" target="_blank" rel="noopener noreferrer">Voir les avis</a>',
    '4.8/5 on Google (36 reviews) — See the reviews',
    'Avis : 4,8/5 sur Google (36 avis).',
    'Nous sommes une entreprise établie depuis 2021, avec des dizaines d\'avis Google vérifiables et une adresse physique que tu peux visiter.',
    'with dozens of verifiable Google reviews and a physical address you can visit',
    'La Villa Coliving affiche une note de 4,8/5 sur Google (36 avis) et un séjour moyen de 13 mois (9 mois hors longs séjours) : on reste parce qu\'on s\'y sent bien — voir les avis.',
    'un loyer de 1 490 CHF', 'depuis 2019, 5 ans', '4,95 % de taux', '14,9/5 n\'existe pas',
  )), []);
});

test('D3 : « 150 résidents » / « 150+ residents » / « more than 150 residents » et « 50+ personnes par an » interdits ; « 100+ » et « 250+ » passent', () => {
  only(forbiddenIssues(p('Depuis 2021, plus de 150 résidents sont passés par nos trois maisons.')), /150 résidents/);
  only(forbiddenIssues(p('150+ residents since 2021')), /150 résidents/);
  only(forbiddenIssues(p('Since 2021, more than 150 residents have lived in our three houses')), /150 résidents/);
  only(forbiddenIssues(p('150 résidents')), /150 résidents/);
  only(forbiddenIssues(p('50+ personnes par an')), /50\+ personnes/);
  only(forbiddenIssues(p('50+ people a year')), /50\+ personnes/);
  only(forbiddenIssues(p('50 + résidents chaque année')), /50\+ personnes/);
  assert.deepEqual(forbiddenIssues(p('100+ résidents depuis 2021', '100+ residents since 2021', 'Plus de 100 résidents ont choisi nos maisons', '250+ personnes', '1 150 résidents à Genève', '50 personnes', '7 à 12 résidents par maison')), []);
});

test('D3 : « 99 % » d\'occupation interdit hors Observatoire — phrase, tuile voisine, « 98-99 % » ; sans contexte d\'occupation, rien', () => {
  only(forbiddenIssues(p('99 % d\'occupation sur 5 ans'), undefined, 'index.html'), /99 %/);
  only(forbiddenIssues(p('99% occupancy rate over 5 years'), undefined, 'en.html'), /99 %/);
  only(forbiddenIssues(tile('99%', 'Taux d\'occupation sur 5 ans'), undefined, 'candidature.html'), /99 %/);
  only(forbiddenIssues(tile('99%', 'Occupancy rate over 5 years'), undefined, 'en-candidature.html'), /99 %/);
  only(forbiddenIssues(p('taux d\'occupation de 98-99 % sur nos maisons'), undefined, 'investisseurs.html'), /99 %/);
  only(forbiddenIssues(p('99 % d\'occupation sur 5 ans')), /99 %/, 'sans nom de fichier : la règle s\'applique (pas d\'exemption)');
  assert.deepEqual(forbiddenIssues(p('99 % des frontaliers passent par la gare d\'Annemasse.'), undefined, 'blog-x.html'), [], 'pas de contexte d\'occupation');
  assert.deepEqual(forbiddenIssues(p('Un remplissage de 99 % des demandes traitées.'), undefined, 'faq.html'), [], '« remplissage » n\'est pas « occupation »');
  assert.deepEqual(forbiddenIssues(p('≈ 98 % de jours-chambre occupés depuis l\'ouverture (sept. 2021 → oct. 2026)'), undefined, 'investisseurs.html'), [], 'OCCUPANCY (98) sur /investisseurs passe');
  assert.deepEqual(forbiddenIssues(p('Taux d\'occupation 1999 %')), [], 'le 99 n\'est pas la fin d\'un autre nombre');
});

test('D3 : l\'Observatoire (FR et EN) garde son « 98-99 % » d\'occupation (méthodologie first-party datée)', () => {
  const obs = p('Taux d\'occupation observé : 98-99 % sur les trois maisons (méthodologie first-party, relevé daté).');
  assert.deepEqual(forbiddenIssues(obs, undefined, 'observatoire-logement-frontalier-geneve.html'), []);
  assert.deepEqual(forbiddenIssues(obs, undefined, 'en-observatoire-logement-frontalier-geneve.html'), []);
  assert.equal(forbiddenIssues(obs, undefined, 'blog-observatoire-x.html').length, 1, 'un article qui recopie le chiffre n\'est pas l\'Observatoire');
  // L'exemption ne couvre que « 99 % » : les autres règles restent actives sur l'Observatoire.
  const r = forbiddenIssues(p('4,9/5 (enquêtes résidents)', 'occupation 98-99 %'), undefined, 'observatoire-logement-frontalier-geneve.html');
  assert.equal(r.length, 2, r.join('\n'));
  assert.ok(r.some((x) => x.startsWith('« 4,9/5 »')) && r.some((x) => x.startsWith('« enquêtes résidents »')) && !r.some((x) => x.startsWith('« 99 % »')), r.join('\n'));
});

test('nearWindow : fenêtre de ±NEAR_WINDOW autour de la première occurrence qui porte le contexte ; null sinon', () => {
  assert.equal(NEAR_WINDOW, 120);
  const text = `${'a'.repeat(300)} 99 % ${'b'.repeat(300)} 99 % taux d'occupation ${'c'.repeat(300)}`;
  const win = nearWindow(text, /99[  ]?%/, /occupation/i);
  assert.ok(win && /occupation/.test(win) && win.length <= 2 * 120 + 4, win);
  assert.ok(!win.startsWith('a'.repeat(50)), 'la première occurrence (sans contexte) est passée');
  assert.equal(nearWindow(text, /99[  ]?%/, /remplissage/i), null);
  assert.equal(nearWindow('99 % occupation', /99[  ]?%/, /occupation/, 5), null, 'contexte hors fenêtre réduite');
  assert.ok(nearWindow('99 % occupation', /99[  ]?%/, /occupation/, 20));
});

test('ratingMarkupIssues : aggregateRating et "@type": "Review" (simple ou en tableau) interdits en JSON-LD ; une fiche sans note passe', () => {
  const ld = (obj) => `<!DOCTYPE html><html><head><script type="application/ld+json">${JSON.stringify(obj)}</script></head><body><p>4,8/5 sur Google (36 avis)</p></body></html>`;
  assert.deepEqual(ratingMarkupIssues(ld({ '@context': 'https://schema.org', '@type': 'LodgingBusiness', name: 'La Villa Coliving', sameAs: ['https://maps.google.com/?cid=14514002506022967350'] })), []);
  only(ratingMarkupIssues(ld({ '@type': 'LodgingBusiness', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: 36 } })), /aggregateRating/);
  only(ratingMarkupIssues(ld({ '@type': 'LodgingBusiness', review: [{ '@type': 'Review', reviewRating: { '@type': 'Rating', ratingValue: 5 } }] })), /Review/);
  only(ratingMarkupIssues(ld({ '@type': ['LocalBusiness', 'Review'] })), /Review/);
  only(ratingMarkupIssues('<html><body><script type="application/ld+json">{ "@type" : "Review" }</script></body></html>'), /Review/, 'JSON invalide ou espacé : repli sur le texte brut');
  assert.deepEqual(ratingMarkupIssues(ld({ '@type': 'Article', about: 'ReviewAction is not a Review', potentialAction: { '@type': 'ReviewAction' } })), [], 'ReviewAction ≠ Review');
});

test('socialProofVerdict : vue absente = avertissement (migration à appliquer), injoignable = avertissement, présente = échec sous le seuil, chiffre remonté', () => {
  const absent = socialProofVerdict({ error: 'HTTP 404: {"code":"PGRST205","details":null,"hint":"Perhaps you meant the table \'public.v_public_rooms\'","message":"Could not find the table \'public.v_social_proof\' in the schema cache"}' }, 100);
  assert.deepEqual(absent.failures, []);
  assert.equal(absent.warnings.length, 1);
  assert.match(absent.warnings[0], new RegExp(`${SOCIAL_PROOF_VIEW} absente : migration ${SOCIAL_PROOF_MIGRATION.replace(/[.]/g, '\\.')}`));
  assert.match(absent.warnings[0], /100\+ résidents/);
  assert.equal(absent.info, null);
  for (const err of ['HTTP 500: {"code":"42P01","message":"relation does not exist"}', 'Timeout']) {
    const r = socialProofVerdict({ error: err }, 100);
    assert.deepEqual(r.failures, [], err);
    assert.equal(r.warnings.length, 1, err);
  }
  assert.match(socialProofVerdict({ error: 'Timeout' }, 100).warnings[0], /injoignable/);
  const ok = socialProofVerdict({ rows: [{ distinct_residents_since_opening: 122, first_move_in: '2021-09-17', current_residents: 26, occupancy_pct_all: '97.7', computed_on: '2026-10-09' }] }, 100);
  assert.deepEqual(ok.failures, []); assert.deepEqual(ok.warnings, []);
  assert.deepEqual(ok.info, { distinct: 122, since: '2021-09-17', occupancyPctAll: '97.7', computedOn: '2026-10-09' });
  assert.deepEqual(socialProofVerdict({ rows: [{ distinct_residents_since_opening: '100' }] }, 100).failures, [], 'égalité = soutenu (≥), valeur texte acceptée');
  const low = socialProofVerdict({ rows: [{ distinct_residents_since_opening: 95 }] }, 100);
  assert.equal(low.failures.length, 1); assert.match(low.failures[0], /95 résidents distincts .* < STATS\.totalResidents 100/);
  assert.equal(socialProofVerdict({ rows: [] }, 100).failures.length, 1, 'vue présente mais vide = échec (pas un silence)');
  assert.equal(socialProofVerdict({ rows: [{ foo: 1 }] }, 100).failures.length, 1, 'colonne absente = échec');
});

// ── Liste déclarative L3 contre la source réelle (esbuild) ───────────────────────────────────────────
const LIVE = {
  // Phrases vivantes du 10/10/2026 (REST anon), réduites aux passages touchés — la vraie vérification est celle du générateur.
  communaute: {
    fr: "Depuis 2021, plus de 150 résidents d'une quinzaine de nationalités sont passés par nos maisons.\n\nCe n'est pas un hasard si nos maisons affichent une note moyenne de 4,9/5 et un séjour moyen de 13 mois (9 mois hors longs séjours) : on reste parce qu'on s'y sent bien.",
    en: "Since 2021, more than 150 residents from some fifteen nationalities have lived in our houses.\n\nIt's no coincidence our houses hold an average rating of 4.9/5 and an average stay of 13 months (9 months excluding long stays): people stay because they feel good here.",
  },
  lodge: {
    fr: 'Depuis 2021, plus de 150 résidents sont passés par nos trois maisons, avec une note moyenne de 4,9/5.',
    en: 'Since 2021, more than 150 residents have lived in our three houses, with an average rating of 4.9/5.',
  },
};

test('buildEdits(source réelle) : 10 modifications, 2 articles, parité FR/EN, textes insérés = source (note Google + lien), rien de l\'ancien monde', async () => {
  const m = await loadEntityFacts();
  const edits = buildEdits(m);
  assert.equal(edits.length, 10);
  assert.deepEqual([...new Set(edits.map((e) => e.slug))].sort(), ['coliving-communaute-reels-amis-geneve-annemasse', 'lodge-annemasse-coliving-premium-portes-geneve']);
  for (const slug of new Set(edits.map((e) => e.slug))) {
    const fr = edits.filter((e) => e.slug === slug && e.lang === 'fr').map((e) => e.mechanism).sort();
    const en = edits.filter((e) => e.slug === slug && e.lang === 'en').map((e) => e.mechanism).sort();
    assert.deepEqual(fr, en, `${slug} : parité FR/EN`);
  }
  const keys = new Set();
  for (const e of edits) {
    assert.ok(['D3', 'D4'].includes(e.mechanism) && ['fr', 'en'].includes(e.lang), `${e.slug} : lang/mécanisme`);
    const k = `${e.slug}/${e.lang}/${e.find}`; assert.ok(!keys.has(k), `ancre dupliquée : ${k}`); keys.add(k);
    assert.deepEqual(insertedForbidden(e.replace, e.lang), [], `${e.slug} (${e.lang}) · ${e.note} : « ${e.replace} »`);
    assert.doesNotMatch(e.replace, /4[,.]9|150|enquêtes|surveys|note moyenne|average rating/i, e.replace);
    assert.doesNotMatch(e.replace, /<[a-z!/]/i, 'pas de HTML : le rendu du blog ouvre les liens externes en nouvel onglet');
    if (e.mechanism === 'D3') assert.ok(e.replace.includes(`${m.STATS.totalResidents} r`), `${e.slug} (${e.lang}) : STATS.totalResidents`);
  }
  // D4 : chaque article, dans chaque langue, reçoit la note Google (STATS_DISPLAY.googleRating) ET le lien vers la fiche.
  for (const slug of new Set(edits.map((e) => e.slug))) for (const lang of ['fr', 'en']) {
    const d4 = edits.filter((e) => e.slug === slug && e.lang === lang && e.mechanism === 'D4').map((e) => e.replace).join('\n');
    assert.ok(d4.includes(m.STATS_DISPLAY[lang].googleRating), `${slug}/${lang} : note Google`);
    assert.ok(d4.includes(`](${m.GOOGLE_REVIEWS.url})`), `${slug}/${lang} : lien vers la fiche`);
    const label = m.GOOGLE_REVIEWS_LINK_LABEL[lang];
    assert.ok(d4.includes(`[${label.charAt(0).toLowerCase()}${label.slice(1)}](`), `${slug}/${lang} : libellé D4 « ${label} »`);
    assert.ok(d4.includes(lang === 'fr' ? 'sur Google' : 'on Google'), `${slug}/${lang} : étiquette « sur Google »`);
  }
  // Application simulée sur les phrases vivantes : chaque ancre unique, résultat sans ancien monde, veille POST_STATE_WATCH muette.
  for (const [slug, live] of [['coliving-communaute-reels-amis-geneve-annemasse', LIVE.communaute], ['lodge-annemasse-coliving-premium-portes-geneve', LIVE.lodge]]) {
    for (const lang of ['fr', 'en']) {
      const mine = edits.filter((e) => e.slug === slug && e.lang === lang);
      for (const e of mine) assert.deepEqual(checkEdit(e, live[lang]), [], `${slug}/${lang} : « ${e.find} »`);
      const sim = applyEdits(live[lang], mine);
      assert.deepEqual(sim.failures, []);
      for (const re of POST_STATE_WATCH) assert.doesNotMatch(sim.text, re, `${slug}/${lang} : ${re}`);
      assert.ok(sim.text.includes(m.STATS_DISPLAY[lang].googleRating) && sim.text.includes(m.GOOGLE_REVIEWS.url), `${slug}/${lang} : note + lien`);
      assert.deepEqual(forbiddenIssues(p(sim.text), undefined, `${lang === 'en' ? 'en-' : ''}blog-${slug}.html`), [], `${slug}/${lang} : la garde CI accepte le texte résultant`);
    }
  }
  // Les faits voisins hors stats.ts restent en base, intacts.
  const comFr = applyEdits(LIVE.communaute.fr, edits.filter((e) => e.slug === 'coliving-communaute-reels-amis-geneve-annemasse' && e.lang === 'fr')).text;
  assert.ok(comFr.includes("d'une quinzaine de nationalités") && comFr.includes('(9 mois hors longs séjours)') && comFr.includes('Depuis 2021'));
  const doc = sqlDoc(m);
  assert.equal(doc.versions.ENTITY_FACTS_VERSION, m.ENTITY_FACTS_VERSION);
  assert.equal(doc.versions['GOOGLE_REVIEWS.checkedOn'], m.GOOGLE_REVIEWS.checkedOn);
  assert.match(doc.lot, /Lot L3/);
});

// ── Relecture adverse du 10/10/2026 ──────────────────────────────────────────────────────────────────────────────────

test('socialProofVerdict : vue présente mais non lisible en anon (401/403/42501) = échec, pas un avertissement « injoignable »', () => {
  for (const err of ['HTTP 401: {"message":"JWT"}', 'HTTP 403: {"code":"42501","message":"permission denied for view v_social_proof"}', 'permission denied for relation v_social_proof']) {
    const r = socialProofVerdict({ error: err }, 100);
    assert.equal(r.failures.length, 1, err);
    assert.match(r.failures[0], /GRANT SELECT/);
    assert.deepEqual(r.warnings, []);
  }
});

test('RGPD : la migration committée ne contient AUCUNE ligne nominative entre ses marqueurs (le dépôt est public)', async () => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const { ROOT } = await import('../../scripts/lib/load-entity-facts.mjs');
  const sql = await fs.readFile(path.join(ROOT, SOCIAL_PROOF_MIGRATION), 'utf8');
  const b = sql.indexOf('-- >>> INSERTS resident_history'), e = sql.indexOf('-- <<< INSERTS resident_history');
  assert.ok(b > 0 && e > b, 'marqueurs présents');
  const block = sql.slice(b, e);
  assert.doesNotMatch(block, /INSERT INTO/, 'aucun INSERT dans le dépôt');
  assert.doesNotMatch(block, /^\s*\('(?:lavilla|leloft|lelodge)',/m, 'aucune ligne de données');
  assert.match(block, /--assemble/, 'le placeholder explique comment assembler localement');
  assert.doesNotMatch(sql, /full_name\s*=\s*'/, 'aucun nom en clair ailleurs dans le fichier');
});

test('fiche entité : la puce « Avis » est suivie du lien « Voir les avis » (reviewsLink), FR et EN', async () => {
  const m = await loadEntityFacts();
  for (const lang of ['fr', 'en']) {
    const t = m.entityFactsText(lang);
    assert.ok(t.bullets.includes(t.reviewsLink.bullet), `${lang} : la puce du lien est une puce rendue`);
    assert.equal(t.reviewsLink.href, m.GOOGLE_REVIEWS.url);
    assert.equal(t.reviewsLink.label, m.GOOGLE_REVIEWS_LINK_LABEL[lang]);
    assert.ok(!m.entityFactsStrings(lang).includes(t.reviewsLink.label), `${lang} : le libellé du lien n'est pas une chaîne canonique comptée 1×`);
  }
});
