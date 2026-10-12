import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countOccurrences, pickTag, quoteEdit, renderUpdate, renderRollback, appliedCondition, renderVerification,
  renderRollbackBlock, checkEdit, applyEdits, forbiddenIssues, renderSql, renderDryRun, preview, TABLE,
} from '../../scripts/build-slots-sql.mjs';
import { buildEdits, FOOTER_SLUGS, FOOTER_EN_HEAD_BY_SLUG, NB, MINUS } from '../../scripts/l1-slots.edits.mjs';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';

const sub = { slug: 'mon-article', lang: 'fr', mechanism: 'M3', note: 'ligne du tableau', find: `| Coliving | 1${NB}370 CHF |`, replace: `| Chambre en coliving | 1${NB}370 – 1${NB}430 CHF |` };
const del = { slug: 'mon-article', lang: 'en', mechanism: 'M1', note: 'section removed', find: '## Where to look\n\nSome text.\n\n## Next heading', replace: '## Next heading' };
const add = { slug: 'mon-article', lang: 'fr', mechanism: 'M4', note: 'paragraphe ajouté', find: 'Dernier paragraphe.', replace: 'Dernier paragraphe.\n\nPas encore de fiche de salaire suisse ? Réponse.' };
const meta = { generatedAt: '2026-10-09T10:00:00.000Z', date: '2026-10-09', source: 'un jeu de test', versions: { entity: 'v1', ouChercher: 'v2' }, live: [{ slug: 'mon-article', updated_at: '2026-10-01', fr: 100, en: 90 }] };

test('countOccurrences : 0, 1, n, aiguille vide, non chevauchant', () => {
  assert.equal(countOccurrences('abc', 'x'), 0);
  assert.equal(countOccurrences('abcabc', 'bca'), 1);
  assert.equal(countOccurrences('a b a b a', 'a'), 3);
  assert.equal(countOccurrences('aaa', 'aa'), 1);
  assert.equal(countOccurrences('abc', ''), 0);
  assert.equal(countOccurrences(`1${NB}370 et 1 370`, `1${NB}370`), 1);
});

test('pickTag : $f$ libre, sinon $f1$, $f2$… ; jamais $$', () => {
  assert.equal(pickTag('f', ['texte sans dollar']), 'f');
  assert.equal(pickTag('f', ['x $f$ y']), 'f1');
  assert.equal(pickTag('f', ['$f$ et $f1$']), 'f2');
  assert.throws(() => pickTag('', ['x']));
  const e = { ...sub, find: 'ancre avec $f$ dedans', replace: 'nouveau avec $r$ dedans' };
  const sql = renderUpdate(e);
  assert.match(sql, /\$f1\$ancre avec \$f\$ dedans\$f1\$/);
  assert.match(sql, /\$r1\$nouveau avec \$r\$ dedans\$r1\$/);
  assert.doesNotMatch(sql, /\$\$/);
});

test('renderUpdate (substitution) : replace() dollar-quoté, gardes A et B, updated_at, U+00A0 conservé', () => {
  const sql = renderUpdate(sub);
  assert.equal(sql, [
    `UPDATE ${TABLE}`,
    `SET content_fr = replace(content_fr, $f$| Coliving | 1${NB}370 CHF |$f$, $r$| Chambre en coliving | 1${NB}370 – 1${NB}430 CHF |$r$),`,
    '    updated_at = now()',
    "WHERE slug = 'mon-article'",
    `  AND position($f$| Coliving | 1${NB}370 CHF |$f$ IN content_fr) > 0`,
    `  AND position($r$| Chambre en coliving | 1${NB}370 – 1${NB}430 CHF |$r$ IN content_fr) = 0;`,
  ].join('\n'));
  assert.ok(sql.includes(NB), 'l\'espace insécable est conservé tel quel');
  assert.doesNotMatch(sql, /1 370/, 'pas d\'espace normal substitué');
});

test('suppression (nouveau ⊂ ancien) : pas de garde B à l\'aller, garde « ancien absent » au retour', () => {
  const up = renderUpdate(del);
  assert.match(up, /position\(\$f\$## Where to look[\s\S]*\$f\$ IN content_en\) > 0;$/);
  assert.doesNotMatch(up, /= 0/);
  const back = renderRollback(del);
  assert.match(back, /replace\(content_en, \$r\$## Next heading\$r\$, \$f\$## Where to look/);
  assert.match(back, /position\(\$r\$## Next heading\$r\$ IN content_en\) > 0/);
  assert.match(back, /position\(\$f\$## Where to look[\s\S]*\$f\$ IN content_en\) = 0;$/);
  assert.equal(appliedCondition(del), `position($f$${del.find}$f$ IN content_en) = 0`);
});

test('ajout (nouveau ⊃ ancien) : garde B à l\'aller, pas de garde « ancien absent » au retour, condition « nouveau présent »', () => {
  const up = renderUpdate(add);
  assert.match(up, /position\(\$r\$Dernier paragraphe\.\n\nPas encore[\s\S]*\$r\$ IN content_fr\) = 0;$/);
  const back = renderRollback(add);
  assert.match(back, /position\(\$r\$Dernier paragraphe\.[\s\S]*\$r\$ IN content_fr\) > 0;$/);
  assert.doesNotMatch(back, /= 0/);
  assert.equal(appliedCondition(add), `position($r$${add.replace}$r$ IN content_fr) > 0`);
});

test('inversion : appliquer puis appliquer l\'inverse rend le texte initial ; renderRollback échange F et R', () => {
  const text = `Intro.\n\n| Coliving | 1${NB}370 CHF |\n\nDernier paragraphe.\n\n## Where to look\n\nSome text.\n\n## Next heading\n\nFin.`;
  const forward = applyEdits(text, [sub, add, del]);
  assert.deepEqual(forward.failures, []);
  assert.ok(forward.text.includes(sub.replace) && forward.text.includes(add.replace) && !forward.text.includes('Some text.'));
  const inverse = [del, add, sub].map((e) => ({ ...e, find: e.replace, replace: e.find }));
  const back = applyEdits(forward.text, inverse);
  assert.deepEqual(back.failures, []);
  assert.equal(back.text, text);
  const { F, R } = quoteEdit(sub);
  assert.match(renderRollback(sub), new RegExp(`replace\\(content_fr, ${R.replace(/[$|]/g, '\\$&')}, ${F.replace(/[$|]/g, '\\$&')}\\)`));
});

test('checkEdit : 0 ou 2 occurrences = échec nommant slug/langue/note ; nouveau déjà présent = échec ; cas nominal = []', () => {
  const live = `Intro.\n\n| Coliving | 1${NB}370 CHF |\n\nDernier paragraphe.`;
  assert.deepEqual(checkEdit(sub, live), []);
  assert.deepEqual(checkEdit(add, live), []);
  const zero = checkEdit({ ...sub, find: 'absent' }, live);
  assert.equal(zero.length, 1); assert.match(zero[0], /mon-article \(fr\) · M3 · ligne du tableau : 0 occurrence/);
  const two = checkEdit(sub, `${live}\n${sub.find}`);
  assert.match(two.join('\n'), /2 occurrence/);
  const already = checkEdit(sub, `${live}\n${sub.replace}`);
  assert.match(already.join('\n'), /déjà présent 1 fois/);
  assert.match(checkEdit(sub, undefined).join('\n'), /colonne content_fr absente/);
  // suppression : le contexte conservé est présent une fois (dans l'ancre) → OK ; deux fois → échec (le retour arrière toucherait l'autre).
  const liveDel = 'x\n\n## Where to look\n\nSome text.\n\n## Next heading\n\ny';
  assert.deepEqual(checkEdit(del, liveDel), []);
  assert.match(checkEdit(del, `${liveDel}\n## Next heading`).join('\n'), /déjà présent 2 fois en base \(attendu 1\)/);
});

test('applyEdits : chevauchement détecté (ancre consommée par une modification précédente)', () => {
  const text = 'A B C';
  const r = applyEdits(text, [{ ...sub, find: 'A B', replace: 'X' }, { ...sub, find: 'B C', replace: 'Y' }]);
  assert.equal(r.failures.length, 1);
  assert.match(r.failures[0], /0 occurrence\(s\) de l'ancre après les modifications précédentes/);
});

test('forbiddenIssues : 15 min, promesses garant, Gaillard, voiture, vouvoiement FR (pas « rendez-vous »), placeholders, $$', () => {
  assert.deepEqual(forbiddenIssues('Genève-Eaux-Vives en 7 min de Léman Express, 18 à 24 min porte-à-porte', 'fr'), []);
  assert.match(forbiddenIssues('à 15 min de Genève', 'fr').join(), /15 min/);
  assert.deepEqual(forbiddenIssues('ouvert de 8 h 15 min', 'fr').length, 1, 'la règle est volontairement large');
  assert.match(forbiddenIssues('location sans garant', 'fr').join(), /garant/);
  assert.match(forbiddenIssues('no French guarantor needed', 'en').join(), /garant/);
  assert.match(forbiddenIssues('No guarantor needed. Just your contract.', 'en').join(), /promesse/);
  assert.deepEqual(forbiddenIssues('No guarantor in France? The Visale guarantee steps in.', 'en'), [], 'une question sur la situation du lecteur n\'est pas une promesse');
  assert.deepEqual(forbiddenIssues('Pas de garant français ? La garantie Visale prend le relais.', 'fr'), []);
  assert.match(forbiddenIssues('Pas de garant français ? Chez nous, sans garant.', 'fr').join(), /promesse/);
  assert.match(forbiddenIssues("tu auras besoin d'un garant", 'fr').join(), /proscrite/);
  assert.match(forbiddenIssues('Annemasse, Ambilly, Gaillard', 'fr').join(), /Gaillard/);
  assert.match(forbiddenIssues('Genève en 15 minutes en voiture', 'fr').join(), /voiture/);
  assert.match(forbiddenIssues('Vous arrivez avec votre valise', 'fr').join(), /vouvoiement/);
  assert.deepEqual(forbiddenIssues('prends rendez-vous', 'fr'), []);
  assert.deepEqual(forbiddenIssues('You arrive with your suitcase', 'en'), []);
  assert.match(forbiddenIssues('dès {{PRIX_DES}}', 'fr').join(), /placeholder/);
  assert.match(forbiddenIssues('a $$ b', 'fr').join(), /\$\$/);
  assert.match(forbiddenIssues('<br>', 'fr').join(), /balise/);
});

test('renderVerification : une ligne par slug, CASE par langue, NULL quand la langue n\'est pas touchée', () => {
  const sql = renderVerification([sub, add, del, { ...sub, slug: 'autre-article' }]);
  assert.match(sql, /^SELECT slug,\n  CASE slug\n/);
  assert.match(sql, /WHEN 'mon-article' THEN \(position\(\$f\$\| Coliving \| 1 370 CHF \|\$f\$ IN content_fr\) = 0\n      AND position\(\$r\$Dernier paragraphe/);
  assert.match(sql, /WHEN 'autre-article' THEN \(position\(/);
  assert.match(sql, /END AS fr_ok,\n  CASE slug\n    WHEN 'mon-article' THEN \(position\(\$f\$## Where to look[\s\S]*\) = 0\)\n  END AS en_ok/);
  assert.match(sql, /WHERE slug IN \('autre-article', 'mon-article'\)\nORDER BY slug;$/);
  assert.match(renderVerification([sub]), /NULL::boolean AS en_ok/);
});

test('renderRollbackBlock : inverses dans l\'ordre inverse, dans /* */ ; repli en lignes « -- » si un texte contient */', () => {
  const block = renderRollbackBlock([sub, del]);
  assert.match(block, /^-- ── Retour arrière[^\n]*\n\/\*\nBEGIN;\n\n/);
  assert.ok(block.indexOf('## Next heading') < block.indexOf('Chambre en coliving'), 'del (2e) est inversé avant sub (1er)');
  assert.match(block, /\n\nCOMMIT;\n\*\/$/);
  const fallback = renderRollbackBlock([{ ...sub, replace: 'a */ b' }]);
  assert.match(fallback, /^-- ── Retour arrière[^\n]*\n-- BEGIN;\n--\s*\n-- UPDATE/);
  assert.doesNotMatch(fallback, /^\/\*/m);
});

test('renderSql : en-tête, BEGIN, N UPDATE commentés, aperçu, COMMIT, vérification, retour arrière ; renderDryRun lisible', () => {
  const sql = renderSql([sub, del], meta);
  assert.match(sql, /^-- =+\n-- Lot L1 « Ingénierie des créneaux »/);
  assert.match(sql, /après déploiement du code L1/i);
  assert.match(sql, /-- 2 modifications · 1 articles/);
  assert.match(sql, /--   mon-article · 2026-10-01 · 100 \/ 90/);
  assert.match(sql, /\n\nBEGIN;\n\n-- \[1\/2\] mon-article \(fr\) · M3 · ligne du tableau\nUPDATE blog_posts\n/);
  assert.match(sql, /-- \[2\/2\] mon-article \(en\) · M1 · section removed\nUPDATE blog_posts\n/);
  assert.match(sql, /-- ── Aperçu des ancrages[\s\S]*-- \[2\] mon-article\/en · M1 : « ## Where to look⏎⏎Some text\.⏎⏎## Next heading » → « ## Next heading »/);
  assert.match(sql, /COMMIT;\n\n-- ── Vérification[\s\S]*ORDER BY slug;\n\n-- ── Retour arrière[\s\S]*\*\/\n$/);
  assert.equal(countOccurrences(sql, 'BEGIN;'), 2, 'un BEGIN à l\'aller, un dans le retour arrière');
  const md = renderDryRun([{ ...sub, count: 1, replaceCount: 0 }, { ...del, count: 1, replaceCount: 1 }], meta);
  assert.match(md, /^# Lot L1\.E/);
  assert.match(md, /\| `mon-article` \| 1 \(M3\) \| 1 \(M1\) \| 2026-10-01 \| 100 \/ 90 \|/);
  assert.match(md, /### 1\. `mon-article` \(fr\) · M3\n\nligne du tableau\n\nOccurrences de l'ancre en base : 1 \(attendu 1\) · nouveau texte déjà présent : 0 \(attendu 0\) · garde « nouveau absent » : oui/);
  assert.match(md, /### 2\. `mon-article` \(en\) · M1[\s\S]*déjà présent : 1 \(attendu 1\) · garde « nouveau absent » : non \(suppression\)/);
  assert.match(md, /\*\*Avant\*\*\n\n````text\n\| Coliving \| 1 370 CHF \|\n````/);
  assert.equal(preview('a\nb', 3), 'a⏎b');
  assert.equal(preview('a\nbc', 3), 'a⏎…');
});

test('buildEdits(source réelle) : liste cohérente, textes insérés sans chaîne interdite, pied commun sur les 25 articles', async () => {
  const m = await loadEntityFacts();
  const edits = buildEdits(m);
  assert.ok(edits.length >= 70, `${edits.length} modifications`);
  const keys = new Set();
  for (const e of edits) {
    assert.ok(['fr', 'en'].includes(e.lang) && ['M1', 'M2', 'M3', 'M4', 'footer', 'fix'].includes(e.mechanism), `${e.slug} : lang/mécanisme`);
    assert.ok(e.find && e.replace && e.find !== e.replace, `${e.slug} : find/replace`);
    const k = `${e.slug}/${e.lang}/${e.find}`;
    assert.ok(!keys.has(k), `ancre dupliquée : ${k.slice(0, 80)}`); keys.add(k);
    assert.deepEqual(forbiddenIssues(e.replace, e.lang), [], `${e.slug} (${e.lang}) · ${e.note} : « ${e.replace.slice(0, 80)} »`);
    assert.doesNotMatch(e.replace, /\]\((https?:\/\/)?(www\.)?(leboncoin|roomlala|lacartedescolocs)/i, 'plateformes jamais liées');
    if (e.lang === 'en') assert.doesNotMatch(e.replace, /\]\(\/(?!en\/)[a-z]/, `${e.slug} : lien interne EN sans /en/ — « ${e.replace.slice(0, 80)} »`);
  }
  const footer = edits.filter((e) => e.mechanism === 'footer');
  assert.equal(footer.length, FOOTER_SLUGS.length * 2);
  assert.equal(new Set(footer.map((e) => e.slug)).size, 25);
  for (const e of footer) assert.ok(e.replace.endsWith(`${m.GENEVA_COMMUTE_FORMULA[e.lang]}.`), 'formule D1 en fin de pied');
  // Têtes des 25 pieds EN (GO coordinateur) : un `fix` EN par slug qui passe le lien en /en/colocation-geneve, table alignée sur FOOTER_SLUGS.
  assert.deepEqual(Object.keys(FOOTER_EN_HEAD_BY_SLUG).sort(), [...FOOTER_SLUGS].sort());
  for (const slug of FOOTER_SLUGS) {
    const heads = edits.filter((e) => e.slug === slug && e.lang === 'en' && e.mechanism === 'fix' && e.find.includes('](/colocation-geneve)?**'));
    assert.equal(heads.length, 1, `${slug} : une tête de pied EN attendue`);
    assert.ok(heads[0].replace.includes('](/en/colocation-geneve)?**') && !heads[0].replace.includes('see our rooms'), `${slug} : tête de pied corrigée`);
  }
  assert.equal(edits.filter((e) => e.replace.includes('[a room on the French side](/en/colocation-geneve)')).length, 9, '8 têtes cassées parmi les 25 + colocation-annemasse');
  // Parité FR/EN par article (hors corrections ponctuelles propres à une langue et hors les deux M4 EN-only demandés par le
  // coordinateur, dont le FR est déjà conforme : coliving-transfrontalier, guide-ressources).
  const EN_ONLY_M4 = new Set(['coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'guide-ressources-frontalier-geneve']);
  for (const slug of EN_ONLY_M4) assert.ok(edits.some((e) => e.slug === slug && e.lang === 'en' && e.mechanism === 'M4'), `${slug} : M4 EN attendu`);
  const bySlug = (lang, mech) => new Set(edits.filter((e) => e.lang === lang && e.mechanism === mech && !EN_ONLY_M4.has(e.slug)).map((e) => e.slug));
  for (const mech of ['M1', 'M2', 'M3', 'M4']) assert.deepEqual([...bySlug('fr', mech)].sort(), [...bySlug('en', mech)].sort(), `parité ${mech}`);
  // Les textes canoniques sont bien ceux de la source (pas de copie figée).
  assert.ok(edits.some((e) => e.replace === m.a6Text('fr')) && edits.some((e) => e.replace === m.a6Text('en')));
  assert.ok(edits.some((e) => e.replace.includes(m.priceRangeCell('fr'))) && edits.some((e) => e.replace.includes(m.coutDeLaVieRowLabel('en'))));
  assert.ok(edits.some((e) => e.find.includes(MINUS) && e.replace.includes(MINUS)), 'U+2212 conservé dans cout-de-la-vie');
  assert.ok(edits.some((e) => e.find.includes(`1${NB}370`)), 'ancre avec U+00A0');
});
