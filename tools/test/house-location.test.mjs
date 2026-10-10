// Emplacement par maison (Lot L2 « Emplacement et transport », 09/10/2026) : invariants de la source unique
// src/data/houseLocation.ts (chargée via esbuild) — règles D1 (destination nommée, deux nombres, jamais la voiture),
// D6 (le Foron, jamais « mitoyenne ») et D7 (arrêts nommés, deux ancres : Léman Express et tram 17).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';

const m = await loadEntityFacts();
const SLUGS = ['lavilla', 'leloft', 'lelodge'];
const LANGS = ['fr', 'en'];
const T = m.TRANSIT;

test('houseLocationIssues() : aucune incohérence interne ; HOUSE_SLUGS et HOUSE_LOCATION_VERSION', () => {
  assert.deepEqual(m.houseLocationIssues(), []);
  assert.deepEqual([...m.HOUSE_SLUGS], SLUGS);
  assert.match(m.HOUSE_LOCATION_VERSION, /^\d{4}-\d{2}-\d{2}$/);
});

test('parité FR/EN : même nombre de lignes de trajet, de commerces et de chaînes ; mêmes nombres ligne à ligne', () => {
  for (const slug of SLUGS) {
    const fr = m.houseCommuteRows(slug, 'fr'), en = m.houseCommuteRows(slug, 'en');
    assert.equal(fr.length, en.length, slug);
    for (let i = 0; i < fr.length; i++) assert.deepEqual(fr[i].value.match(/\d+/g), en[i].value.match(/\d+/g), `${slug} ligne ${i} : « ${fr[i].value} » / « ${en[i].value} »`);
    const nFr = m.houseNearby(slug, 'fr'), nEn = m.houseNearby(slug, 'en');
    assert.equal(nFr.length, nEn.length, slug);
    for (let i = 0; i < nFr.length; i++) assert.deepEqual(nFr[i].match(/\d+/g), nEn[i].match(/\d+/g), `${slug} commerce ${i}`);
    assert.equal(m.houseLocationStrings(slug, 'fr').length, m.houseLocationStrings(slug, 'en').length, slug);
    assert.equal(m.houseBorder(slug, 'fr') === undefined, m.houseBorder(slug, 'en') === undefined, `${slug} : frontière définie dans une seule langue`);
  }
});

test('aucune chaîne rendue : voiture / car / aéroport, « 15 min », TPN, numéro de bus, mitoyenne, CHUV, terminus, placeholder, vouvoiement', () => {
  let n = 0;
  for (const slug of SLUGS) for (const lang of LANGS) for (const s of m.houseLocationStrings(slug, lang)) {
    n++;
    assert.doesNotMatch(s, /\bvoiture\b|\bcar\b|\bdriv(?:e|ing)\b|a[ée]roport|airport|\bA40\b/i, s);
    assert.doesNotMatch(s, /(?<![\d,.])15[   ]?min/i, s);
    assert.doesNotMatch(s, /\bTPN\b|ligne \d|line \d|\bbus \d|mitoyen|adjoin|next door|CHUV|au pas de la porte|terminus|500 m, 5 min/i, s);
    assert.doesNotMatch(s, /\{\{|\[FAIT|undefined|NaN|</, s);
    if (lang === 'fr') assert.doesNotMatch(s, /(?<!rendez-)\bvous\b|\bvotre\b|\bvos\b/i, s);
  }
  assert.ok(n >= 6 * 10, `${n} chaînes vérifiées`);
});

test('formatDistance : 750 → « 750 m », 1000 → « 1 km », 1300 → « 1,3 km » (FR) / « 1.3 km » (EN)', () => {
  assert.equal(m.formatDistance(750, 'fr'), '750 m');
  assert.equal(m.formatDistance(750, 'en'), '750 m');
  assert.equal(m.formatDistance(1000, 'fr'), '1 km');
  assert.equal(m.formatDistance(1000, 'en'), '1 km');
  assert.equal(m.formatDistance(1300, 'fr'), '1,3 km');
  assert.equal(m.formatDistance(1300, 'en'), '1.3 km');
});

test('houseDirectionsUrl : itinéraire Google Maps en transports depuis l\'adresse encodée de la maison vers Genève-Eaux-Vives', () => {
  for (const slug of SLUGS) for (const lang of LANGS) {
    const url = m.houseDirectionsUrl(slug, lang);
    assert.ok(url.startsWith('https://www.google.com/maps/dir/?api=1&'), url);
    assert.ok(url.includes(`origin=${encodeURIComponent(m.houseAddressLine(slug))}`), `${slug}/${lang} : adresse encodée absente — ${url}`);
    assert.ok(url.includes('travelmode=transit'), url);
    assert.match(url, /destination=[^&]*Eaux-Vives/, url);
    assert.doesNotMatch(url, /[  ]/, 'URL sans espace brut');
  }
  assert.equal(m.houseDirectionsLabel('fr'), 'Calculer mon trajet');
  assert.equal(m.houseDirectionsLabel('en'), 'Check my commute');
  assert.match(m.houseAddressLine('leloft'), /^1 rue des Marronniers, 74100 Ambilly$/, 'D11 : adresse du Loft');
});

test('houseCommuteRows : Loft = ligne « Tram 17 » vers Rive ; Villa et Lodge = ligne Rive en transports ; les trois = Eaux-Vives, Champel, Cornavin, vélo Voie Verte, gare à pied — valeurs de TRANSIT', () => {
  for (const slug of SLUGS) for (const lang of LANGS) {
    const rows = m.houseCommuteRows(slug, lang);
    const h = T.byHouse[slug];
    const tram = rows.filter((r) => r.mode === 'Tram 17');
    const rive = rows.filter((r) => /Rive/.test(r.destination) && !/^(Vélo|Bike)/.test(r.mode) && r.mode !== 'Tram 17');
    if (slug === 'leloft') {
      assert.equal(tram.length, 1, `${slug}/${lang}`);
      assert.match(tram[0].destination, /Rive/);
      assert.match(tram[0].value, new RegExp(`^${h.tramStop.tramToRiveMin} min .*\\b${h.riveDoorToDoorMin} min\\b`), tram[0].value);
      assert.equal(rive.length, 0, 'le Loft n\'a pas de ligne Rive « Transports » en plus du tram');
    } else {
      assert.equal(tram.length, 0, `${slug}/${lang} : le tram 17 est l'ancre du Loft seulement`);
      assert.equal(rive.length, 1, `${slug}/${lang}`);
      assert.match(rive[0].value, new RegExp(`^${h.riveDoorToDoorMin} min`), rive[0].value);
    }
    const ev = rows.filter((r) => /Eaux-Vives/.test(r.destination));
    assert.equal(ev.length, 1);
    assert.equal(ev[0].mode, 'Léman Express');
    assert.match(ev[0].value, new RegExp(`^${T.trainEauxVivesMin} min .*\\b${h.eauxVivesDoorToDoorMin} min\\b`), ev[0].value);
    const champel = rows.filter((r) => /Champel/.test(r.destination));
    assert.equal(champel.length, 1);
    assert.match(champel[0].value, new RegExp(`^${T.trainChampelMin} min`), champel[0].value);
    const cornavin = rows.filter((r) => /Cornavin/.test(r.destination));
    assert.equal(cornavin.length, 1);
    assert.equal(cornavin[0].mode, 'Léman Express');
    assert.match(cornavin[0].value, new RegExp(`^${T.trainCornavinMin} min .*\\b${h.cornavinDoorToDoorMin} min\\b`), cornavin[0].value);
    const bike = rows.filter((r) => /^(Vélo|Bike)/.test(r.mode));
    assert.equal(bike.length, 1);
    assert.match(bike[0].mode, /Voie Verte/);
    assert.match(bike[0].value, new RegExp(`^${h.bikeToRiveMin} min \\(`), bike[0].value);
    const walk = rows.filter((r) => /^(À pied|On foot)$/.test(r.mode));
    assert.ok(walk.length >= 1);
    assert.match(walk[0].destination, /Annemasse/);
    assert.match(walk[0].value, new RegExp(`^${h.stationWalkMin} min \\(`), walk[0].value);
    assert.equal(rows.filter((r) => r.mode === 'Léman Express').length, 3, 'Eaux-Vives, Champel, Cornavin');
    for (const r of rows) for (const k of ['mode', 'destination', 'value']) assert.ok(typeof r[k] === 'string' && r[k].trim().length > 0, `${slug}/${lang} ${k}`);
  }
});

test('D6 : houseNeighbourhood sans « mitoyenne » ; le Foron nommé pour La Villa et Le Loft ; Loft « 600 m, 8 min à pied » ; Le Lodge sans promesse de frontière', () => {
  for (const slug of SLUGS) for (const lang of LANGS) {
    const nb = m.houseNeighbourhood(slug, lang);
    assert.ok(nb.length > 60, nb);
    assert.doesNotMatch(nb, /mitoyen|adjoin|next door|border-adjacent/i, nb);
    // La phrase de quartier porte la marche jusqu'à l'ancre de la maison : tram 17 pour Le Loft, gare pour les deux autres.
    const anchorMin = slug === 'leloft' ? T.byHouse.leloft.tramWalkMin : T.byHouse[slug].stationWalkMin;
    assert.match(nb, new RegExp(`\\b${anchorMin}\\b`), `${slug}/${lang} : la phrase de quartier porte la marche jusqu'à ${slug === 'leloft' ? 'au tram 17' : 'la gare'}`);
  }
  assert.match(m.houseNeighbourhood('lavilla', 'fr'), /Foron/);
  assert.match(m.houseBorder('lavilla', 'fr'), /Foron/);
  assert.match(m.houseBorder('lavilla', 'en'), /Foron/);
  const b = T.byHouse.leloft.border;
  assert.match(m.houseBorder('leloft', 'fr'), new RegExp(`${b.foronDistanceM} m, ${b.foronWalkMin} min à pied`));
  assert.match(m.houseBorder('leloft', 'en'), new RegExp(`${b.foronDistanceM} m away, an ${b.foronWalkMin}-minute walk`));
  assert.doesNotMatch(m.houseBorder('leloft', 'fr'), /(?<!\d)500 m|(?<!\d)5 min|deux pas/, 'jamais « 500 m, 5 min à pied » (D6) — « 25 min à pied » jusqu\'à Moillesulaz est légitime');
  assert.equal(m.houseBorder('lelodge', 'fr'), undefined);
  assert.equal(m.houseBorder('lelodge', 'en'), undefined);
});

test('ENTITY_HOUSES[].commute = houseCommuteLine ; houseCommuteLong nomme la destination et porte deux nombres ; houseCommuteNote date les mesures', () => {
  for (const slug of SLUGS) for (const lang of LANGS) {
    const h = m.ENTITY_HOUSES.find((x) => x.slug === slug);
    assert.equal(h.commute[lang], m.houseCommuteLine(slug, lang));
    const long = m.houseCommuteLong(slug, lang);
    assert.match(long, /Eaux-Vives/, long);
    assert.match(long, /Voie Verte/, long);
    assert.match(long, new RegExp(`\\b${T.byHouse[slug].eauxVivesDoorToDoorMin} min`), long);
    // (09/10/2026) D1.3 pour les trois maisons, Loft compris : la phrase gare porte le temps de train ET le porte-à-porte.
    assert.match(long, new RegExp(`\\b${T.trainEauxVivesMin} min`), long);
    if (slug === 'leloft') assert.match(long, /Tram 17/i);
    assert.ok(m.houseCommuteNote(lang).includes(T.measuredOnLabel[lang]), m.houseCommuteNote(lang));
  }
});
