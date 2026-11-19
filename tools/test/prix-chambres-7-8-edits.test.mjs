// Lot « prix des chambres 7 et 8 de La Villa » (13/11/2026) : invariants des listes de scripts/prix-chambres-7-8.edits.mjs.
// Sans réseau : les listes sont construites depuis la source unique, jamais comparées à la base (c'est le rôle de build-slots-sql).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { forbiddenIssues, columnOf, TOKEN_COLUMNS } from '../../scripts/build-slots-sql.mjs';
import {
  OLD, FOOTER_SLUGS, OLD_PRICE_RES, derived, editsJetons, editsBascule, editsMetas, editsFourchettes,
} from '../../scripts/prix-chambres-7-8.edits.mjs';
import { buildEdits as jetons } from '../../scripts/prix-chambres-7-8-jetons.edits.mjs';
import { buildEdits as bascule } from '../../scripts/prix-chambres-7-8-bascule.edits.mjs';
import { buildEdits as metas } from '../../scripts/prix-chambres-7-8-metas.edits.mjs';
import { buildEdits as fourchettes } from '../../scripts/prix-chambres-7-8-fourchettes.edits.mjs';

const m = await loadEntityFacts();
const P = m.ENTITY_FACTS.price;
const slugsOf = (edits) => new Set(edits.map((e) => e.slug));
const hasOldPrice = (s) => OLD_PRICE_RES.some((re) => new RegExp(re.source).test(s));
const RANGE_TOKEN = /\{\{PRIX_FOURCHETTE(?:_TABLEAU)?\}\}/;

test('fichiers d\'entrée de build-slots-sql : chacun rend sa liste', () => {
  assert.deepEqual(jetons(m), editsJetons(m));
  assert.deepEqual(bascule(m), editsBascule(m));
  assert.deepEqual(metas(m), editsMetas(m));
  assert.deepEqual(fourchettes(m), editsFourchettes(m));
});

test('SQL 1 — jetons : l\'ancien prix d\'appel devient {{PRIX_DES}}, dans le texte des articles seulement', () => {
  const edits = editsJetons(m);
  assert.equal(edits.length, 100);
  assert.equal(slugsOf(edits).size, 36);
  assert.equal(new Set(FOOTER_SLUGS).size, FOOTER_SLUGS.length, 'pied commun : un article par ligne');
  for (const e of edits) {
    assert.ok(TOKEN_COLUMNS.includes(columnOf(e)), `${e.slug} : colonne de texte attendue`);
    assert.ok(hasOldPrice(e.find), `${e.slug} (${e.lang}) : l'ancre porte l'ancien prix`);
    assert.ok(e.replace.includes('{{PRIX_DES}}') && !hasOldPrice(e.replace), `${e.slug} (${e.lang}) : jeton posé, plus d'ancien prix`);
    assert.equal(e.replace.replace('{{PRIX_DES}}', ''), e.find.replace(/CHF 1,370|1,370 CHF|1\u00A0370 CHF/, ''), `${e.slug} (${e.lang}) : seul le prix change`);
    assert.deepEqual(forbiddenIssues(e.replace, e.lang, { column: columnOf(e) }), []);
  }
});

test('SQL 3 — bascule : fourchette en clair par défaut, même rendu avec les jetons', () => {
  const clair = editsBascule(m), jet = editsBascule(m, { ranges: 'jetons' });
  assert.equal(clair.length, 64);
  assert.equal(slugsOf(clair).size, 12);
  assert.equal(jet.length, clair.length);
  clair.forEach((e, i) => {
    assert.ok(!RANGE_TOKEN.test(e.replace), `${e.slug} (${e.lang}) : pas de jeton de fourchette le jour J`);
    assert.ok(!hasOldPrice(m.resolveContentTokens(e.replace, e.lang)), `${e.slug} (${e.lang}) : plus d'ancien prix dans le texte rendu`);
    assert.equal(m.resolveContentTokens(jet[i].replace, e.lang), m.resolveContentTokens(e.replace, e.lang), `${e.slug} (${e.lang}) : les deux modes rendent le même texte`);
    assert.equal(jet[i].find, e.find);
    assert.deepEqual(forbiddenIssues(e.replace, e.lang, { column: columnOf(e) }), []);
    // Tournure : « de 1 290 à 1 430 CHF », jamais « à 1 290 à 1 430 CHF ».
    if (e.lang === 'fr') assert.ok(!m.resolveContentTokens(e.replace, 'fr').includes(`à ${m.priceRangeText('fr')}`), `${e.slug} : « à » devant la fourchette`);
  });
  assert.ok(jet.some((e) => RANGE_TOKEN.test(e.replace)));
  for (const s of slugsOf(clair)) assert.ok(slugsOf(editsJetons(m)).has(s), `${s} : touché par le SQL 3 donc d'abord par le SQL 1`);
});

test('SQL 4 — metas et posts Facebook : prix en clair, aucun jeton', () => {
  const edits = editsMetas(m);
  assert.equal(edits.length, 10);
  assert.equal(slugsOf(edits).size, 3);
  for (const e of edits) {
    assert.match(columnOf(e), /^(meta_description|facebook_post)_(fr|en)$/);
    assert.ok(!e.replace.includes('{{'), `${e.slug} (${e.lang}) : jamais de jeton hors du texte d'un article`);
    assert.ok(hasOldPrice(e.find) && !hasOldPrice(e.replace));
    assert.deepEqual(forbiddenIssues(e.replace, e.lang, { column: columnOf(e) }), []);
  }
});

test('SQL 3 bis — fourchettes en jetons : dérivé de la bascule, aucun changement visible', () => {
  const edits = editsFourchettes(m);
  const replaced = new Set(editsBascule(m).map((e) => `${e.slug}|${e.lang}|${e.replace}`));
  assert.equal(edits.length, 30);
  assert.equal(slugsOf(edits).size, 11);
  for (const e of edits) {
    assert.ok(replaced.has(`${e.slug}|${e.lang}|${e.find}`), `${e.slug} (${e.lang}) : l'ancre est un texte posé par le SQL 3`);
    assert.ok(RANGE_TOKEN.test(e.replace));
    assert.equal(m.resolveContentTokens(e.replace, e.lang), m.resolveContentTokens(e.find, e.lang));
    assert.deepEqual(forbiddenIssues(e.replace, e.lang, { column: columnOf(e) }), []);
  }
});

test('chiffres dérivés : la formule redonne les chiffres publiés, puis ceux du nouveau prix', (t) => {
  // derived() lève une erreur si, avec l'ancien prix, la formule ne redonne pas les chiffres publiés.
  const D = derived(m);
  assert.deepEqual(OLD, { fromChf: 1370, fromEur: 1470, standardChf: 1430, standardEur: 1530 });
  assert.equal(D.cout.total[0], 2510 - OLD.fromChf + P.fromChf);
  if (P.fromChf !== 1290 || P.standardChf !== 1430) return t.skip('valeurs figées pour 1 290 / 1 430 CHF : la source a changé');
  assert.deepEqual(D.budget, [29, 22, 16]);
  assert.equal(D.sante1, 31);
  assert.deepEqual(D.sante2, [22, 25]);
  assert.deepEqual(D.fiscalite.reste1, [2780, 3050]);
  assert.deepEqual(D.fiscalite.part2, [23, 24]);
  assert.deepEqual(D.fiscalite.reste2, [4035, 4410]);
  assert.deepEqual(D.fiscalite.part3, [17, 18]);
  assert.deepEqual(D.cout.total, [2430, 3180]);
  assert.deepEqual(D.cout.rows, [
    { part: [29, 33], reste: [1200, 1950] }, { part: [24, 27], reste: [2100, 2850] }, { part: [22, 24], reste: [2750, 3500] },
  ]);
  assert.deepEqual(D.cout.seuil, [4300, 4800]);
});
