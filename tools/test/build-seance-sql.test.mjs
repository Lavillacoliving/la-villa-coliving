// Variante « séance » d'un lot déclaratif (scripts/build-seance-sql.mjs, 24/11/2026) et la liste du lot « Programmer une visite »
// (scripts/visite-articles.edits.mjs) : fonctions pures seulement, aucune lecture réseau.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  asciiFold, simulateReplaces, reverseReplaces, groupChanges, renderDoBlock, renderVerification, asciiLiterals, isAscii,
  compareReports, decisionSourceIssues, vousCount,
} from '../../scripts/build-seance-sql.mjs';
import { md5 } from '../../scripts/blog-budget-reel.mjs';
import { buildEdits, EXPECTED, DECISION_PAGE_SLUGS } from '../../scripts/visite-articles.edits.mjs';

const NB = ' ';
const edits = [
  { slug: 'mon-article', lang: 'fr', mechanism: 'A', note: 'lien « candidate ici »', find: '[candidate ici](/candidature)', replace: '[programme une visite](/candidature)' },
  { slug: 'mon-article', lang: 'fr', mechanism: 'A', note: 'phrase', find: `réponse${NB}sous 48 h — candidate`, replace: `réponse${NB}sous 48 h — demande ta visite` },
  { slug: 'mon-article', lang: 'en', mechanism: 'A', note: 'link “apply”', find: "[apply](/en/candidature) — we'll", replace: "[book a visit](/en/candidature) — we'll" },
];
const rows = new Map([['mon-article', {
  slug: 'mon-article',
  content_fr: `Intro.\n\nTu peux [candidate ici](/candidature). Et réponse${NB}sous 48 h — candidate.`,
  content_en: "Intro.\n\nOr [apply](/en/candidature) — we'll reply.",
}]]);

test('asciiFold : accents, guillemets, tirets, flèches, insécables, € → ASCII imprimable', () => {
  assert.equal(asciiFold(`« Candidate en 2 minutes → » — 150 €${NB}!`), '"Candidate en 2 minutes ->" - 150 EUR !');
  assert.ok(isAscii(asciiFold('Ça, c’est déjà l’été · § 3 …')));
});

test('simulateReplaces / reverseReplaces : aller-retour exact', () => {
  const [fr] = groupChanges(edits, rows);
  const to = simulateReplaces(fr.from, fr.ops);
  assert.equal(to, `Intro.\n\nTu peux [programme une visite](/candidature). Et réponse${NB}sous 48 h — demande ta visite.`);
  assert.equal(simulateReplaces(to, reverseReplaces(fr.ops)), fr.from);
});

test('groupChanges : un champ par slug et colonne, ordre FR puis EN, md5 et longueurs en points de code', () => {
  const ch = groupChanges(edits, rows);
  assert.deepEqual(ch.map((c) => `${c.slug}.${c.field}:${c.ops.length}`), ['mon-article.content_fr:2', 'mon-article.content_en:1']);
  assert.equal(ch[0].fromMd5, md5(rows.get('mon-article').content_fr));
  assert.equal(ch[0].toMd5, md5(ch[0].to));
  assert.deepEqual(ch.flatMap((c) => c.simFailures), []);
  const missing = groupChanges([{ ...edits[0], slug: 'absent' }], rows);
  assert.equal(missing[0].toMd5, null);
  assert.equal(missing[0].simFailures.length, 1);
});

test('renderDoBlock : 100 % ASCII, littéraux U&\'\' relus = substitutions, gardes md5 d\'entrée et de sortie, publié', () => {
  const ch = groupChanges(edits, rows);
  const sql = renderDoBlock(ch, { name: 'essai', side: 'aller', expectPublished: 43, tag: 'seance' });
  assert.ok(isAscii(sql));
  assert.deepEqual(asciiLiterals(sql), ch.flatMap((c) => c.ops.flatMap((o) => [o.find, o.replace])));
  assert.match(sql, /count\(\*\) INTO n FROM public\.blog_posts WHERE is_published IS TRUE;\n {2}IF n <> 43 THEN/);
  for (const c of ch) {
    assert.ok(sql.includes(`AND md5(${c.field}) = '${c.fromMd5}';`));
    assert.ok(sql.includes(`IF md5(v) IS DISTINCT FROM '${c.toMd5}'`));
  }
  assert.equal(sql.split('$seance$').length - 1, 2);
  const back = renderDoBlock(ch, { name: 'essai retour', side: 'retour', tag: 'retour' });
  assert.ok(isAscii(back));
  assert.ok(!back.includes('is_published IS TRUE'));
  assert.deepEqual(asciiLiterals(back), ch.flatMap((c) => reverseReplaces(c.ops).flatMap((o) => [o.find, o.replace])));
  assert.ok(back.includes(`AND md5(content_fr) = '${ch[0].toMd5}';`));
  assert.match(renderVerification(ch), /md5_attendu AS ok/);
});

test('compareReports : alerte nouvelle, créneau perdu, ancre perdue, vouvoiement en hausse → bloquant ; alerte levée → non', () => {
  const base = { issues: new Set(['ancienne']), needles: new Map([['a6Text', true]]), anchorOk: true, vous: 0, brand: 3 };
  assert.equal(compareReports(base, { ...base, issues: new Set() }).blocking, false);
  assert.equal(compareReports(base, { ...base, issues: new Set(['ancienne', 'nouvelle']) }).blocking, true);
  assert.equal(compareReports(base, { ...base, needles: new Map([['a6Text', false]]) }).blocking, true);
  assert.equal(compareReports(base, { ...base, anchorOk: false }).blocking, true);
  assert.equal(compareReports(base, { ...base, vous: 1 }).blocking, true);
  assert.equal(vousCount('Vous et votre dossier, rendez-vous demain'), 2);
});

test('decisionSourceIssues : ancien texte encore là = échec ; ni l\'un ni l\'autre = avertissement', () => {
  const sources = new Map([['mon-article.fr', 'Tu peux [programme une visite](/candidature).'], ['mon-article.en', "Or [apply](/en/candidature) — we'll reply."]]);
  const r = decisionSourceIssues(edits, sources);
  assert.equal(r.ok.length, 1);
  assert.equal(r.failures.length, 1);
  assert.equal(r.warnings.length, 1);
});

test('visite-articles.edits : règle A seulement, 40 FR / 35 EN / 33 articles, adresses des liens inchangées, aucun mot de l\'ancien monde', () => {
  const list = buildEdits();
  assert.equal(list.filter((e) => e.lang === 'fr').length, EXPECTED.fr);
  assert.equal(list.filter((e) => e.lang === 'en').length, EXPECTED.en);
  assert.equal(new Set(list.map((e) => e.slug)).size, EXPECTED.articles);
  const urls = (s) => [...s.matchAll(/\]\(([^)\s]+)\)/g)].map((x) => x[1]);
  for (const e of list) {
    assert.deepEqual(urls(e.replace), urls(e.find), `${e.slug} : adresse modifiée`);
    assert.doesNotMatch(e.replace.replace(/\]\([^)]*\)/g, ']'), /candidat|postul|\bappl(?:y|ying|ication)\b/i, e.slug);
    assert.ok(!urls(e.find).some((u) => /lappart/.test(u)), `${e.slug} : lien de L'Appart`);
  }
  // Règle B / C non appliquée : l'article « s'installer » (B seulement) n'est pas dans la liste.
  assert.ok(!list.some((e) => e.slug === 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france'));
  for (const s of DECISION_PAGE_SLUGS) assert.ok(list.some((e) => e.slug === s), s);
});
