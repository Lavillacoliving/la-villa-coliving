// Paliers de prix (13/11/2026) : trois loyers contractuels dans CONTRACT_EUR (src/data/stats.ts), CHF affichés dérivés, « dès » des
// maisons = palier le plus bas, et garde chambre par chambre contre v_public_rooms (roomPriceIssues, et tierSurfaceIssues pour la
// surface du palier le moins cher citée par la FAQ des tarifs — scripts/check-entity-facts.mjs).
// Les valeurs figées ici (1 380 € → 1 290 CHF…) sont VOULUES : un changement de tarif doit faire échouer ce test, puis être
// accompagné du SQL des chambres (rooms.rent_eur / rent_chf) dans le même créneau que le code.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { roomPriceIssues, tierSurfaceIssues, forbiddenIssues } from '../../scripts/check-entity-facts.mjs';

const m = await loadEntityFacts();
const F = m.ENTITY_FACTS;
const NB = '\u00A0';

/** Base conforme : 29 chambres de v_public_rooms, chacune au loyer de son palier (mêmes colonnes que la requête de la garde). */
function conformingRows() {
  const rows = [];
  for (const [house, n] of Object.entries({ lavilla: 10, leloft: 7, lelodge: 12 })) {
    for (let i = 1; i <= n; i++) {
      const tier = F.price.sharedBathTiers.find((t) => t.house === house && t.rooms.includes(i));
      rows.push({
        house_slug: house,
        room_number: i,
        bathroom_type: tier ? 'shared' : 'private',
        rent_eur: tier ? tier.eur : F.price.standardEur,
        rent_chf: tier ? tier.chf : F.price.standardChf,
      });
    }
  }
  return rows;
}
const withRoom = (rows, house, n, patch) => rows.map((r) => (r.house_slug === house && r.room_number === n ? { ...r, ...patch } : r));

test('CONTRACT_EUR : trois paliers en euros, CHF dérivés au taux figé (dizaine inférieure), jamais saisis', () => {
  assert.deepEqual({ standard: m.CONTRACT_EUR.standard, sharedBath: m.CONTRACT_EUR.sharedBath, sharedBathSmall: m.CONTRACT_EUR.sharedBathSmall }, { standard: 1530, sharedBath: 1470, sharedBathSmall: 1380 });
  assert.equal(m.STATS.priceChf, 1430);
  assert.deepEqual(m.SHARED_BATH_TIERS.map((t) => [t.rooms, t.eur, t.chf]), [[[3, 4], 1470, 1370], [[7, 8], 1380, 1290]]);
  assert.equal(m.STATS_SHARED_BATH.rooms, 4, 'les 4 chambres à salle d\'eau partagée = somme des paliers');
  assert.equal(m.STATS_SHARED_BATH.tiers, m.SHARED_BATH_TIERS);
});

test('« dès » des maisons : palier le plus bas, en euros comme en francs, graphies FR (U+00A0, unité après) et EN (virgule, unité avant)', () => {
  assert.equal(m.HOUSES_FROM.eur, 1380);
  assert.equal(m.HOUSES_FROM.chf, 1290);
  assert.equal(m.HOUSES_FROM.eur, Math.min(m.CONTRACT_EUR.standard, m.CONTRACT_EUR.sharedBath, m.CONTRACT_EUR.sharedBathSmall));
  assert.equal(m.HOUSES_FROM.chf, Math.min(m.STATS.priceChf, ...m.SHARED_BATH_TIERS.map((t) => t.chf)), 'le minimum en euros donne le minimum en francs');
  assert.deepEqual(m.HOUSES_FROM.fr, { chfNum: `1${NB}290`, chf: `1${NB}290 CHF`, eurNum: `1${NB}380`, eur: `1${NB}380 €` });
  assert.deepEqual(m.HOUSES_FROM.en, { chfNum: '1,290', chf: 'CHF 1,290', eurNum: '1,380', eur: '€1,380' });
});

test('fiche entité : prix d\'appel = « dès » des maisons ; paliers à salle d\'eau partagée détaillés chambre par chambre', () => {
  assert.equal(F.price.fromChf, 1290);
  assert.equal(F.price.fromEur, 1380);
  assert.equal(F.price.standardChf, 1430);
  assert.equal(F.price.standardEur, 1530);
  assert.equal(F.price.fr.fromChf, `1${NB}290 CHF`);
  assert.equal(F.price.fr.fromEur, `1${NB}380 €`);
  assert.equal(F.price.en.fromChf, 'CHF 1,290');
  assert.equal(F.price.en.fromEur, '€1,380');
  assert.deepEqual(F.price.sharedBathTiers.map((t) => [t.house, t.rooms, t.eur, t.chf]), [['lavilla', [3, 4], 1470, 1370], ['lavilla', [7, 8], 1380, 1290]]);
  const villa = F.houses.find((h) => h.slug === 'lavilla');
  assert.equal(villa.sharedBathRooms, 4);
  assert.equal(F.price.sharedBathTiers.reduce((n, t) => n + t.rooms.length, 0), villa.sharedBathRooms);
  for (const lang of ['fr', 'en']) {
    const bullets = m.entityFactsText(lang).bullets.join('\n');
    assert.ok(bullets.includes(lang === 'en' ? 'from CHF 1,290/month (contractual rent in euros: from €1,380)' : `dès 1${NB}290 CHF/mois (loyer contractuel en euros : dès 1${NB}380 €)`), `${lang} : puce prix`);
    assert.doesNotMatch(bullets, /1[\u00A0 ,]?370|1[\u00A0 ,]?470/, `${lang} : la fiche ne détaille pas les paliers (D12)`);
  }
});

test('sharedBathTiersText / sharedBathPricesText : numéros et prix lus dans la source, quatre formes', () => {
  assert.equal(m.sharedBathTiersText('fr'), `1${NB}370 CHF pour les chambres 3 et 4 et 1${NB}290 CHF pour les chambres 7 et 8`);
  assert.equal(m.sharedBathTiersText('en'), 'CHF 1,370 for rooms 3 and 4 and CHF 1,290 for rooms 7 and 8');
  assert.equal(m.sharedBathTiersText('fr', { perMonth: true }), `1${NB}370 CHF/mois pour les chambres 3 et 4 et 1${NB}290 CHF/mois pour les chambres 7 et 8`);
  assert.equal(m.sharedBathTiersText('en', { perMonth: true }), 'CHF 1,370/month for rooms 3 and 4 and CHF 1,290/month for rooms 7 and 8');
  assert.equal(m.sharedBathTiersText('fr', { perMonth: true, eur: true }), `1${NB}370 CHF/mois (1${NB}470 €) pour les chambres 3 et 4 et 1${NB}290 CHF/mois (1${NB}380 €) pour les chambres 7 et 8`);
  assert.equal(m.sharedBathTiersText('en', { perMonth: true, eur: true }), 'CHF 1,370/month (€1,470) for rooms 3 and 4 and CHF 1,290/month (€1,380) for rooms 7 and 8');
  assert.equal(m.sharedBathPricesText('fr'), `1${NB}290 ou 1${NB}370 CHF`);
  assert.equal(m.sharedBathPricesText('en'), 'CHF 1,290 or 1,370');
});

test('aucune phrase de palier ne réveille la garde « ancien prix en francs » (le loyer en euros du palier d\'entrée suivi de « CHF »)', () => {
  const stale = (text) => forbiddenIssues('', text).filter((i) => /ancien prix/.test(i));
  const texts = [];
  for (const lang of ['fr', 'en']) {
    texts.push(m.sharedBathTiersText(lang), m.sharedBathTiersText(lang, { perMonth: true }), m.sharedBathTiersText(lang, { perMonth: true, eur: true }), m.sharedBathPricesText(lang));
    texts.push(...m.entityFactsStrings(lang), m.priceJustificationFaq(lang).a, m.priceRangeText(lang), m.priceRangeCell(lang));
    texts.push(...m.ouChercherStrings(lang, 'full'), ...m.ouChercherStrings(lang, 'short'));
    texts.push(Object.values(m.HOUSES_FROM[lang]).join(' | '));
  }
  for (const t of texts) assert.deepEqual(stale(t), [], t.slice(0, 80));
  // Le tableau de /offre-hiver en anglais avec une ligne du palier des chambres 7 et 8 (retirée le 19/11/2026 : aucune
  // chambre de l'offre à ce prix ; elle peut revenir), tel que la garde le lirait (cellules jointes par une espace) : « (€1,380) CHF 645 ».
  assert.deepEqual(stale('CHF 1,290 (€1,380) CHF 645 (€690) CHF 1,370 (€1,470) CHF 685 (€735)'), []);
  // La règle elle-même reste vivante : l'ancien prix en francs est toujours refusé, dans les trois graphies.
  for (const old of [`1${NB}380 CHF`, '1 380 CHF', '1,380 CHF', 'CHF 1,380']) assert.equal(stale(`dès ${old} par mois`).length, 1, old);
});

test('roomPriceIssues : une base conforme aux paliers ne lève rien', () => {
  const rows = conformingRows();
  assert.equal(rows.length, 29);
  assert.deepEqual(roomPriceIssues(rows, F), []);
  // rent_eur renvoyé en texte par PostgREST (numeric) : même verdict.
  assert.deepEqual(roomPriceIssues(rows.map((r) => ({ ...r, rent_eur: `${r.rent_eur}.00`, room_number: String(r.room_number) })), F), []);
});

test('roomPriceIssues : base à moitié mise à jour (une seule des deux chambres du palier d\'entrée, ou le franc sans l\'euro) = échec', () => {
  const rows = conformingRows();
  // Avant le SQL : les chambres 7 et 8 encore à l'ancien palier.
  const before = withRoom(withRoom(rows, 'lavilla', 7, { rent_eur: 1470, rent_chf: 1370 }), 'lavilla', 8, { rent_eur: 1470, rent_chf: 1370 });
  const i0 = roomPriceIssues(before, F);
  assert.equal(i0.length, 2);
  assert.match(i0[0], /lavilla chambre 7 à 1470 € \/ 1370 CHF, la fiche dit 1380 € \/ 1290 CHF \(palier salle d'eau partagée\)/);
  // Une seule chambre changée : le minimum de la base est bon, la garde par bornes ne voyait rien.
  const half = withRoom(rows, 'lavilla', 8, { rent_eur: 1470, rent_chf: 1370 });
  assert.equal(Math.min(...half.map((r) => r.rent_chf)), F.price.fromChf);
  const i1 = roomPriceIssues(half, F);
  assert.equal(i1.length, 1);
  assert.match(i1[0], /lavilla chambre 8/);
  // Le franc changé sans l'euro.
  const chfOnly = withRoom(rows, 'lavilla', 7, { rent_eur: 1470 });
  assert.match(roomPriceIssues(chfOnly, F).join('\n'), /lavilla chambre 7 à 1470 € \/ 1290 CHF/);
  // Les chambres 3 et 4 descendues par erreur au palier d'entrée.
  const wrongTier = withRoom(rows, 'lavilla', 3, { rent_eur: 1380, rent_chf: 1290 });
  assert.match(roomPriceIssues(wrongTier, F).join('\n'), /lavilla chambre 3 à 1380 € \/ 1290 CHF, la fiche dit 1470 € \/ 1370 CHF/);
  // Une chambre standard à un autre prix.
  const std = withRoom(rows, 'lelodge', 5, { rent_chf: 1370, rent_eur: 1470 });
  assert.match(roomPriceIssues(std, F).join('\n'), /lelodge chambre 5 à 1470 € \/ 1370 CHF, la fiche dit 1530 € \/ 1430 CHF \(prix standard\)/);
});

test('roomPriceIssues : type de salle d\'eau et palier doivent se correspondre ; chambre de palier absente ; rent_eur absent', () => {
  const rows = conformingRows();
  const sharedNoTier = withRoom(rows, 'leloft', 2, { bathroom_type: 'shared' });
  assert.match(roomPriceIssues(sharedNoTier, F).join('\n'), /leloft chambre 2 a une salle d'eau partagée mais n'est dans aucun palier/);
  const tierNotShared = withRoom(rows, 'lavilla', 7, { bathroom_type: 'private' });
  assert.match(roomPriceIssues(tierNotShared, F).join('\n'), /lavilla chambre 7 est dans un palier « salle d'eau partagée » de la fiche, la base dit « private »/);
  const missing = rows.filter((r) => !(r.house_slug === 'lavilla' && r.room_number === 8));
  assert.match(roomPriceIssues(missing, F).join('\n'), /lavilla chambre 8 \(palier 1380 € \/ 1290 CHF\) absente de v_public_rooms/);
  // rent_eur NULL : seul le franc est comparé (comme le contrôle des bornes).
  assert.deepEqual(roomPriceIssues(rows.map((r) => ({ ...r, rent_eur: null })), F), []);
  assert.match(roomPriceIssues(withRoom(rows.map((r) => ({ ...r, rent_eur: null })), 'lavilla', 7, { rent_chf: 1370 }), F).join('\n'), /lavilla chambre 7 à \? € \/ 1370 CHF/);
});

test('tierSurfaceIssues : « les plus petites des quatre, environ 16 m² » (FAQ des tarifs) gardé contre la base, plus par STATS.roomSizeMin', () => {
  // Surfaces de v_public_rooms relues le 13/11/2026 : chambres 3 et 4 = 19 et 18 m², 7 et 8 = 15,5 et 16 m² (les autres : 20 ici).
  const surf = { 3: 19, 4: 18, 7: 15.5, 8: 16 };
  const rows = conformingRows().map((r) => ({ ...r, surface_m2: r.house_slug === 'lavilla' && surf[r.room_number] ? surf[r.room_number] : 20 }));
  assert.deepEqual(F.price.sharedBathTiers.map((t) => [t.rooms, t.approxM2]), [[[3, 4], null], [[7, 8], 16]]);
  assert.deepEqual(tierSurfaceIssues(rows, F), []);
  // numeric renvoyé en texte (« 15.5 ») : même verdict.
  assert.deepEqual(tierSurfaceIssues(rows.map((r) => ({ ...r, surface_m2: `${r.surface_m2}` })), F), []);
  // Chambre 7 remesurée à 17,5 m² (→ 18) : « environ 16 m² » devient faux.
  assert.match(tierSurfaceIssues(withRoom(rows, 'lavilla', 7, { surface_m2: 17.5 }), F).join('\n'), /lavilla chambre 7 à 17\.5 m² \(Math\.round 18\) ≠ « environ 16 m² »/);
  // Chambre 4 plus petite que la 8 : « les plus petites des quatre » devient faux.
  assert.match(tierSurfaceIssues(withRoom(rows, 'lavilla', 4, { surface_m2: 15 }), F).join('\n'), /les chambres 7 et 8 \(palier le moins cher\) ne sont plus les plus petites/);
  // Surface absente : la phrase n'est plus vérifiable.
  assert.match(tierSurfaceIssues(withRoom(rows, 'lavilla', 8, { surface_m2: null }), F).join('\n'), /lavilla chambre 8 sans surface/);
});
