// Gardes par gamme (L'Appart, étape E2g ; ARCHITECTURE § 4) : base par gamme sur les relevés de v_public_rooms « état A » (avant la
// bascule) et « état B » (4 chambres de L'Appart) et sur 6 anomalies ; garde de mélange des gammes (règles a, b, c, d) sur des
// pages d'exemple bâties avec les VRAIES briques (react-dom/server, comme un premier rendu) ; fiche « L'Appart — l'essentiel » et
// blocs statiques. Règles pures : scripts/lib/gamme-rules.mjs ; extraction du HTML et câblage : scripts/check-entity-facts.mjs.
// La clé interne de L'Appart n'est jamais écrite ici : elle se lit dans le pont (INTERNAL_ONLY_KEYS) et ne sort dans aucun message.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import {
  classifyViewRows, appartDbIssues, appartSurfaceIssues, appartPageTextIssues, gammeSentenceIssues, llmsGammeIssues,
  jsonLdGammeIssues, maisonProofRules, maisonOnlyRules, appartExemptStrings, HOUSE_AMENITY_RE, isAppartPageFile, appartPageFiles,
  placeKeyLabel, APPART_TEASER_ALL_REQUIRED, appartTeaserExpectedText,
} from '../../scripts/lib/gamme-rules.mjs';
import {
  dbFactsIssues, maisonDbIssues, roomPriceIssues, gammeMixIssues, appartFactsBlockIssues, appartTeaserBlocks, appartTeaserIssues,
  headTexts, visibleText,
} from '../../scripts/check-entity-facts.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const m = await loadEntityFacts();
const LANGS = ['fr', 'en'];
const fixture = (s) => { const j = JSON.parse(readFileSync(path.join(ROOT, `tools/test/fixtures/v_public_rooms.etat-${s}.json`), 'utf8')); return Array.isArray(j) ? j : j.rows; };
const ROWS_A = fixture('A');
const ROWS_B = fixture('B');
const BEFORE = '2026-11-13';
const AFTER = '2027-02-02';
const appartRows = (rows) => rows.filter((r) => r.house_slug === m.APPART_KEY);
const patchRoom = (rows, n, p) => rows.map((r) => (r.house_slug === m.APPART_KEY && r.room_number === n ? { ...r, ...p } : r));
const [INTERNAL] = m.INTERNAL_ONLY_KEYS;
const noKey = (msgs) => assert.ok(!msgs.join('\n').toLowerCase().includes(String(INTERNAL).toLowerCase()), 'un message recopie la clé interne');

// ── Base, par gamme ──────────────────────────────────────────────────────────────────────────────────────────────────────────

test('relevés : état A = 29 lignes des 3 maisons ; état B = les mêmes + 4 lignes de L\'Appart ; aucun lieu inconnu', () => {
  const a = classifyViewRows(ROWS_A, m), b = classifyViewRows(ROWS_B, m);
  assert.deepEqual([...a.byPlace.keys()], ['lavilla', 'leloft', 'lelodge']);
  assert.deepEqual([...a.byPlace.values()].map((x) => x.length), [10, 7, 12]);
  assert.deepEqual([...b.byPlace.keys()], ['lavilla', 'leloft', 'lelodge', 'lappart']);
  assert.equal(b.byPlace.get('lappart').length, 4);
  assert.deepEqual(a.unknown, []); assert.deepEqual(b.unknown, []);
});

test('dbFactsIssues, état A : aucun échec ; L\'Appart absent de la vue = une information, pas un échec', () => {
  const r = dbFactsIssues(ROWS_A, m, { today: BEFORE });
  assert.deepEqual(r.failures, []);
  assert.deepEqual(r.warnings, []);
  assert.equal(r.infos.length, 1);
  assert.match(r.infos[0], /^L'Appart absent de v_public_rooms \(état A/);
  assert.deepEqual(r.counts, { maisons: 29, appart: 0, unknown: 0 });
});

test('dbFactsIssues, état B : aucun échec — les contrôles des maisons ne lisent que les lignes des maisons', () => {
  const r = dbFactsIssues(ROWS_B, m, { today: BEFORE });
  assert.deepEqual(r.failures, []);
  assert.deepEqual(r.warnings, []);
  assert.deepEqual(r.infos, []);
  assert.deepEqual(r.counts, { maisons: 29, appart: 4, unknown: 0 });
  // Sans le classement, les contrôles d'avant jugeaient L'Appart comme une maison (relevé de l'étape E0) :
  assert.equal(roomPriceIssues(ROWS_B, m.ENTITY_FACTS).length, 7, 'chambres 2 à 4 (salle d\'eau partagée hors palier + prix) et suite');
  assert.ok(maisonDbIssues(ROWS_B, m.ENTITY_FACTS).some((f) => /33 chambres publiques dans les maisons, la fiche dit 29/.test(f)));
  assert.deepEqual(maisonDbIssues(ROWS_B.filter((x) => x.house_slug !== 'lappart'), m.ENTITY_FACTS), []);
});

test('anomalie 1 — un lieu inconnu dans la vue : échec (la vue est en avance sur le code) ; une clé interne n\'est jamais recopiée', () => {
  const extra = { ...ROWS_B[0], house_slug: 'lechalet', room_number: 1 };
  const r = dbFactsIssues([...ROWS_B, extra], m, { today: BEFORE });
  assert.equal(r.failures.length, 1, r.failures.join('\n'));
  assert.match(r.failures[0], /^base : lieu inconnu du site dans v_public_rooms : « lechalet » \(1 ligne\(s\)\)/);
  const leak = dbFactsIssues([...ROWS_B, { ...extra, house_slug: INTERNAL }, { ...extra, house_slug: INTERNAL, room_number: 2 }], m, { today: BEFORE });
  assert.equal(leak.failures.length, 1);
  assert.match(leak.failures[0], /clé interne \(masquée\) \(2 ligne\(s\)\)/);
  noKey(leak.failures);
  assert.equal(placeKeyLabel(String(INTERNAL).toUpperCase(), m), 'clé interne (masquée)');
  assert.equal(placeKeyLabel('', m), '(vide)');
});

test('anomalie 2 — 3 lignes de L\'Appart au lieu de 4 : échec (nombre, chambre absente)', () => {
  const r = dbFactsIssues(ROWS_B.filter((x) => !(x.house_slug === 'lappart' && x.room_number === 4)), m, { today: BEFORE });
  assert.deepEqual(r.failures, [
    'base : L\'Appart a 3 chambre(s) dans v_public_rooms, le code en attend 4 (APPART.rooms.total)',
    'base : L\'Appart Chambre 4 (n° 4) absente de v_public_rooms',
  ]);
});

test('anomalie 3 — le n° 1 (jamais publié) rendu public : échec', () => {
  const one = { ...appartRows(ROWS_B)[0], room_number: 1, name: 'L\'Appart 1' };
  const r = dbFactsIssues([...ROWS_B, one], m, { today: BEFORE });
  assert.ok(r.failures.includes('base : L\'Appart n° 1 publique — le n° 1 n\'est jamais publié : jamais dans la vue'), r.failures.join('\n'));
  assert.ok(r.failures.some((f) => /a 5 chambre\(s\)/.test(f)));
});

test('anomalie 4 — un loyer faux (en euros ou en francs), une surface ou une salle d\'eau fausse : échec qui nomme la chambre et les deux valeurs', () => {
  const eur = dbFactsIssues(patchRoom(ROWS_B, 3, { rent_eur: 800 }), m, { today: BEFORE });
  assert.deepEqual(eur.failures, ['base : L\'Appart Chambre 3 à 800 € / 730 CHF, le code dit 790 € / 730 CHF (APPART_CONTRACT_EUR, src/data/appart.ts)']);
  const chf = dbFactsIssues(patchRoom(ROWS_B, 5, { rent_chf: 1000 }), m, { today: BEFORE });
  assert.deepEqual(chf.failures, ['base : L\'Appart Suite à 1060 € / 1000 CHF, le code dit 1060 € / 990 CHF (APPART_CONTRACT_EUR, src/data/appart.ts)']);
  const m2 = dbFactsIssues(patchRoom(ROWS_B, 5, { surface_m2: 20 }), m, { today: BEFORE });
  assert.deepEqual(m2.failures, ['base : L\'Appart Suite à 20 m², le code dit 22 m² (APPART.rooms)']);
  assert.deepEqual(dbFactsIssues(patchRoom(ROWS_B, 2, { surface_m2: '12.0', rent_eur: '790.00' }), m, { today: BEFORE }).failures, [], 'nombres de l\'API en texte (« 12.0 », « 790.00 »)');
  const bath = dbFactsIssues(patchRoom(ROWS_B, 2, { bathroom_type: 'private' }), m, { today: BEFORE });
  assert.deepEqual(bath.failures, ['base : L\'Appart Chambre 2 — salle d\'eau « private », le code dit « shared »']);
  const moved = dbFactsIssues(patchRoom(ROWS_B, 5, { room_number: 6 }), m, { today: BEFORE });
  assert.ok(moved.failures.some((f) => /Suite \(n° 5\) absente/.test(f)) && moved.failures.some((f) => /n° 6 n'est pas une chambre de L'Appart/.test(f)), moved.failures.join('\n'));
});

test('anomalie 5 — date de libération ≠ date d\'ouverture du code, avant l\'ouverture : échec', () => {
  const r = dbFactsIssues(patchRoom(ROWS_B, 2, { available_from: '2027-03-01' }), m, { today: BEFORE });
  assert.deepEqual(r.failures, ['base : L\'Appart Chambre 2 libre le 2027-03-01, le code dit ouverture le 2027-02-01 (APPART.opensOn) — la date change dans le code et en base dans le même créneau']);
  assert.deepEqual(dbFactsIssues(patchRoom(ROWS_B, 2, { available_from: null }), m, { today: BEFORE }).failures, [], 'occupée sans date (un bail signé avant l\'ouverture) : permis');
});

test('anomalie 6 — une chambre « libre » avant l\'ouverture : échec ; après l\'ouverture : plus de contrôle de date, un avertissement', () => {
  const r = dbFactsIssues(patchRoom(ROWS_B, 5, { availability: 'available', available_from: null }), m, { today: BEFORE });
  assert.deepEqual(r.failures, ['base : L\'Appart Suite « libre » avant l\'ouverture du 2027-02-01 (APPART.opensOn) — jamais « disponible » avant l\'ouverture']);
  const open = ROWS_B.map((x) => (x.house_slug === 'lappart' ? { ...x, availability: 'available', available_from: null } : x));
  const after = dbFactsIssues(open, m, { today: AFTER });
  assert.deepEqual(after.failures, []);
  assert.equal(after.warnings.length, 1);
  assert.match(after.warnings[0], /la date d'ouverture \(2027-02-01\) est passée — retirer les mentions « dès février 2027 »/);
  assert.deepEqual(appartDbIssues([], m, { today: AFTER }).warnings, [], 'L\'Appart absent : rien à dire de la date');
});

test('surfaces de L\'Appart (garde des pages) : Math.round du min / max = APPART.rooms.surface ; rien sans ligne', () => {
  assert.deepEqual(appartSurfaceIssues(appartRows(ROWS_B), m), []);
  assert.deepEqual(appartSurfaceIssues([], m), []);
  assert.deepEqual(appartSurfaceIssues(patchRoom(appartRows(ROWS_B), 5, { surface_m2: 25 }), m), ['lappart : APPART.rooms.surface = 12-22 m², v_public_rooms = 12-25 m² (Math.round du min/max de surface_m2)']);
});

// ── Textes : preuves, équipements, montants ──────────────────────────────────────────────────────────────────────────────────

/** Les textes de L'Appart qui vivent sur ses pages (fiche, tableau, emplacement, ouverture, photos, exceptions). */
function appartPageStrings(lang) {
  const t = m.appartIncluded(lang);
  return [
    ...m.appartFactsStrings(lang),
    t.title, t.intro, ...t.header, ...t.rows.flatMap((r) => [r.item, r.status, r.detail]),
    ...m.appartLocationStrings(lang),
    m.appartOpeningSentence(lang), m.appartRoomPhotosSentence(lang),
    ...Object.values(m.appartGammeExempt(lang)).flatMap((v) => (typeof v === 'string' ? [v] : [...v])),
  ];
}

test('preuves des maisons (règle a) : chaque règle lit la source et reconnaît le texte publié ; aucun texte de L\'Appart ne la réveille', () => {
  const rules = maisonProofRules(m);
  const label = (re) => rules.find((r) => r.re.test(re))?.label ?? null;
  const samples = [
    m.STATS_DISPLAY.fr.googleRating, m.STATS_DISPLAY.en.googleRating, m.GOOGLE_REVIEWS_LINK_LABEL.fr, m.GOOGLE_REVIEWS_LINK_LABEL.en,
    m.STATS_DISPLAY.fr.residents, m.STATS_DISPLAY.en.residents,
    `${m.STATS.averageStayMonths} mois en moyenne`, `${m.STATS.averageStayMonths} months on average`,
    m.OCCUPANCY_DISPLAY.fr.value, m.OCCUPANCY_DISPLAY.en.value, m.OCCUPANCY_DISPLAY.fr.sentence,
    m.GENEVA_COMMUTE_FORMULA.fr, m.GENEVA_COMMUTE_FORMULA.en,
    m.STATS_DISPLAY.fr.distance, m.STATS_DISPLAY.en.distance,
    m.entityFactsText('fr').paragraph, m.entityFactsText('en').paragraph,
    `${m.STATS.livingSpacePerResidentMin} à ${m.STATS.livingSpacePerResidentMax} m² d'espace de vie`,
  ];
  for (const s of samples) assert.ok(label(s), `non reconnu : « ${s} »`);
  for (const lang of LANGS) for (const s of appartPageStrings(lang)) assert.equal(label(s), null, `${lang} : « ${s.slice(0, 80)} » réveille « ${label(s)} »`);
  // Bornes : « 129 chambres », « 1 100+ résidents », « 4,85/5 » ne sont pas des preuves des maisons.
  for (const s of ['129 chambres', '1 100+ résidents', 'note 4,85/5', '113 mois en moyenne']) assert.equal(label(s), null, s);
});

test('faits des maisons (règle b) : piscine, sauna, salle de sport (insécables comprises), « 16 à 24 m² » ; « fitness » et « sport » seuls ne comptent pas', () => {
  const amenity = maisonOnlyRules(m)[0].re, surfaces = maisonOnlyRules(m)[1].re;
  for (const s of ['piscine', 'Piscines', 'sauna', 'salle de sport', 'salle de sport', 'pool', 'Pools', 'gym']) assert.match(s, amenity);
  for (const s of ['gymnase', 'Liverpool', 'cours de yoga et de sport', 'fitness classes', 'spa']) assert.doesNotMatch(s, amenity);
  assert.equal(amenity, HOUSE_AMENITY_RE);
  assert.match('des chambres de 16 à 24 m²', surfaces); assert.match('rooms of 16 to 24 m²', surfaces);
  assert.doesNotMatch('116 à 24 m²', surfaces);
  // Exceptions : les chaînes de la source, au caractère près (insécables comprises), FR et EN — 10 par langue, les plus longues d'abord.
  const ex = appartExemptStrings(m);
  assert.equal(ex.length, 20);
  for (let i = 1; i < ex.length; i++) assert.ok(ex[i - 1].length >= ex[i].length);
  for (const s of ex) assert.match(s, /piscine|sauna|salle\s+de\s+sport|pool|gym/i);
});

test('règle c : un montant de L\'Appart (borné) et un équipement des maisons dans la même phrase = échec ; dans deux phrases = rien', () => {
  const split = (t) => t.split(/(?<=[.!?;])\s+/);
  assert.equal(gammeSentenceIssues(['Coliving tout compris dès 730 CHF avec piscine et sauna.'], m).length, 1);
  assert.match(gammeSentenceIssues(['Rooms from CHF 730 with pool and gym.'], m)[0], /prix de L'Appart \(730\) et équipement des maisons dans la même phrase/);
  assert.equal(gammeSentenceIssues(['Suite à 1 060 € et sauna.'], m).length, 1, '« 1 060 » : séparateur de milliers');
  assert.equal(gammeSentenceIssues(['Suite at €1,060, gym included.'], m).length, 1);
  assert.deepEqual(gammeSentenceIssues(split('Les maisons : piscine et sauna, dès 1 290 CHF. L\'Appart : dès 730 CHF, charges comprises.'), m), []);
  // Bornes (critique A8) : « 530 € » dans « 1 530 € », « 990 » dans « 1 990 » ou « 11 060 » ne sont pas des montants de L'Appart.
  for (const s of ['Chambre à 1 530 € avec piscine.', 'Room at €1,530 with pool.', '1 990 CHF, sauna compris.', 'Budget de 11 060 € avec salle de sport.']) assert.deepEqual(gammeSentenceIssues([s], m), [], s);
  // Ligne de tableau : une seule unité, toutes cellules comprises.
  assert.equal(gammeSentenceIssues(['L\'Appart | 790 € | piscine : non |'], m).length, 1);
  // Exception : une phrase qui appartient à un texte exempté (ici, une exception d'essai) passe.
  const mx = { ...m, appartGammeExemptStrings: () => ['Dès 730 CHF, sans piscine ni sauna.'] };
  assert.deepEqual(gammeSentenceIssues(['Dès 730 CHF, sans piscine ni sauna.'], mx), []);
  assert.equal(gammeSentenceIssues(['Dès 730 CHF, avec piscine.'], mx).length, 1);
  // Un même texte fautif n'est signalé qu'une fois.
  assert.equal(gammeSentenceIssues(['Dès 730 CHF avec piscine.', 'Dès 730 CHF avec piscine.'], m).length, 1);
});

test('règle c sur llms.txt : phrase par phrase, ligne de tableau entière, numéro de ligne ; les llms.txt d\'aujourd\'hui passent', () => {
  const r = llmsGammeIssues('# Titre\n- Maisons : piscine. L\'Appart : dès 730 CHF.\n- L\'Appart dès 730 CHF, avec sauna des maisons.\n| L\'Appart | 790 € | gym |', m);
  assert.equal(r.length, 2, r.join('\n'));
  assert.match(r[0], /^ligne 3 : prix de L'Appart \(730\)/);
  assert.match(r[1], /^ligne 4 : prix de L'Appart \(790\)/);
  for (const f of ['public/llms.txt', 'public/en/llms.txt']) assert.deepEqual(llmsGammeIssues(readFileSync(path.join(ROOT, f), 'utf8'), m), [], f);
});

test('textes de la source : aucune phrase de L\'Appart ne porte un de ses montants avec un équipement des maisons (fiche, tableau, blocs, listes)', () => {
  for (const lang of LANGS) assert.deepEqual(gammeSentenceIssues(m.appartFactsAllStrings(lang).flatMap((t) => t.split(/(?<=[.!?;])\s+/)), m), [], lang);
});

// ── JSON-LD ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

const flatten = (node, acc = []) => { if (Array.isArray(node)) node.forEach((x) => flatten(x, acc)); else if (node && typeof node === 'object') { if (node['@type']) acc.push(node); for (const v of Object.values(node)) flatten(v, acc); } return acc; };
/** Fiche de l'organisation telle que l'étape E5 la posera : 4 lieux dans `department`, 33 chambres, une offre par gamme. */
function brandOrg(lang = 'fr') {
  const org = m.buildLocalBusinessSchema(lang, 'd');
  const houses = org.makesOffer;
  return {
    ...org,
    numberOfRooms: m.ENTITY_FACTS.brand.totalRooms,
    department: [...org.department, m.buildAppartLodgingNode(lang)],
    makesOffer: [houses, { ...houses, name: 'Chambre en colocation à Annemasse', lowPrice: String(m.APPART.price.from.chf), highPrice: String(m.APPART.price.suite.chf), offerCount: m.APPART.rooms.total }],
  };
}

test('JSON-LD par gamme : les fiches de l\'organisation d\'aujourd\'hui et celle de l\'étape E5 passent ; le nœud de L\'Appart aussi', () => {
  for (const lang of LANGS) {
    assert.deepEqual(jsonLdGammeIssues(flatten(m.buildLocalBusinessSchema(lang, 'd')), m), []);
    assert.deepEqual(jsonLdGammeIssues(flatten(m.buildHomeLodgingBusinessSchema(lang)), m), []);
    assert.deepEqual(jsonLdGammeIssues(flatten(brandOrg(lang)), m), []);
    assert.deepEqual(jsonLdGammeIssues(flatten(m.buildAppartLodgingNode(lang, { context: true })), m), []);
    const list = m.buildAvailableRoomsItemList(ROWS_B.filter((r) => r.availability === 'available' || r.available_from), lang);
    assert.deepEqual(jsonLdGammeIssues(flatten(list), m), []);
  }
});

test('JSON-LD par gamme : numberOfRooms à sa place (33 sur la fiche seulement, = somme de department ; 4 sur L\'Appart seulement)', () => {
  const org = brandOrg();
  assert.ok(jsonLdGammeIssues(flatten({ ...org, numberOfRooms: 29 }), m).includes('fiche de l\'organisation : numberOfRooms=29 ≠ somme de ses lieux (department) 33'));
  const today = m.buildLocalBusinessSchema('fr', 'd');
  assert.ok(jsonLdGammeIssues(flatten({ ...today, numberOfRooms: 33 }), m).includes('fiche de l\'organisation : numberOfRooms=33 ≠ somme de ses lieux (department) 29'));
  assert.ok(jsonLdGammeIssues(flatten({ ...today, numberOfRooms: 10, department: undefined }), m).some((i) => /fiche de l'organisation : numberOfRooms=10 \(attendu 29 pour les maisons ou 33 pour la marque\)/.test(i)));
  assert.deepEqual(jsonLdGammeIssues([{ '@type': 'LodgingBusiness', '@id': 'x#lodging', numberOfRooms: 33 }], m), ['numberOfRooms=33 (chambres de la marque) hors de la fiche de l\'organisation']);
  assert.deepEqual(jsonLdGammeIssues([{ '@type': 'LodgingBusiness', '@id': 'x#lodging', numberOfRooms: 4 }], m), ['numberOfRooms=4 (chambres de L\'Appart) hors du nœud de L\'Appart']);
  assert.deepEqual(jsonLdGammeIssues([{ '@type': 'LodgingBusiness', numberOfRooms: 31 }], m), ['numberOfRooms=31 hors {29,33,10,7,12,4}']);
});

test('JSON-LD par gamme : chaque AggregateOffer dans la fourchette d\'UNE gamme, offerCount de cette gamme ; jamais 730–1 430', () => {
  const offer = (lowPrice, highPrice, extra = {}) => [{ '@type': 'AggregateOffer', lowPrice, highPrice, ...extra }];
  assert.deepEqual(jsonLdGammeIssues(offer('1290', '1430', { offerCount: 29 }), m), []);
  assert.deepEqual(jsonLdGammeIssues(offer('730', '990', { offerCount: 4 }), m), []);
  assert.match(jsonLdGammeIssues(offer('730', '1430'), m)[0], /^AggregateOffer 730-1430 hors des fourchettes permises \(maisons 1290-1430, L'Appart 730-990\)/);
  assert.match(jsonLdGammeIssues(offer('1370', '1430'), m)[0], /hors des fourchettes permises/, 'ancien « dès » des maisons');
  assert.deepEqual(jsonLdGammeIssues(offer('730', '990', { offerCount: 29 }), m), ['AggregateOffer 730-990 (L\'Appart) : offerCount=29 ≠ 4']);
  assert.deepEqual(jsonLdGammeIssues(offer('1290', '1430', { offerCount: 33 }), m), ['AggregateOffer 1290-1430 (maisons) : offerCount=33 ≠ 29']);
  assert.match(jsonLdGammeIssues(offer('730', '990', { description: 'Chambre meublée, piscine et sauna inclus.' }), m)[0], /^offre de L'Appart \(730-990\) qui nomme un équipement des maisons/);
});

test('JSON-LD par gamme : le nœud de L\'Appart et les offres de ses chambres ne nomment aucun équipement des maisons', () => {
  const node = m.buildAppartLodgingNode('fr', { context: true });
  const pool = { ...node, amenityFeature: [...node.amenityFeature, { '@type': 'LocationFeatureSpecification', name: 'Piscine', value: true }] };
  assert.deepEqual(jsonLdGammeIssues(flatten(pool), m), ['nœud de L\'Appart : équipement des maisons « Piscine »']);
  assert.deepEqual(jsonLdGammeIssues(flatten({ ...node, description: `${node.description} Sauna des maisons.` }), m).length, 1);
  const list = m.buildAvailableRoomsItemList(appartRows(ROWS_B), 'fr');
  const offers = flatten(list).filter((n) => n['@type'] === 'Offer');
  assert.equal(offers.length, 4);
  offers[0].description = 'Chambre de 12 m², salle de sport à deux pas.';
  assert.deepEqual(jsonLdGammeIssues(flatten(list), m), ['offre d\'une chambre de L\'Appart qui nomme un équipement des maisons — « Chambre de 12 m², salle de sport à deux pas. »']);
});

// ── Pages d'exemple, avec les vraies briques ─────────────────────────────────────────────────────────────────────────────────

const dir = mkdtempSync(path.join(tmpdir(), 'lvc-gamme-'));
const entry = `
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppartFacts } from "@/components/appart/AppartFacts";
import { AppartIncluded } from "@/components/appart/AppartIncluded";
import { AppartTeaser } from "@/components/appart/AppartTeaser";
import { EntityFacts } from "@/components/EntityFacts";
import { HouseCommuteTable } from "@/components/HouseCommuteTable";
import { appartCommuteTable } from "@/data/appartLocation";
import { RoomCard } from "@/components/RoomCard";
const wrap = (lang, node) => renderToStaticMarkup(<MemoryRouter initialEntries={[lang === "en" ? "/en/essai" : "/essai"]}><LanguageProvider>{node}</LanguageProvider></MemoryRouter>);
export const facts = (lang) => wrap(lang, <AppartFacts />);
export const included = (lang) => wrap(lang, <AppartIncluded />);
export const teaser = (lang, page) => wrap(lang, <AppartTeaser page={page} />);
export const brandFacts = (lang) => wrap(lang, <EntityFacts page="essai" />);
export const commute = (lang) => wrap(lang, <HouseCommuteTable slug="lappart" content={appartCommuteTable} />);
export const card = (lang, house, room, props = {}) => wrap(lang, <RoomCard house={house} houseName={props.houseName ?? house} room={room} fallbackImage="/images/essai.webp" {...props} />);
`;
const out = path.join(dir, 'briques.cjs');
await build({
  stdin: { contents: entry, resolveDir: ROOT, loader: 'tsx' },
  bundle: true, outfile: out, format: 'cjs', platform: 'node', target: 'node20', jsx: 'automatic',
  alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent',
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env': '{"DEV":false,"PROD":true,"MODE":"production"}' },
});
const B = createRequire(import.meta.url)(out);
rmSync(dir, { recursive: true, force: true });

const enc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#x27;');
/** Page de L'Appart d'exemple : en-tête, <main> (titre, textes d'exception, fiche, tableau, trajets, 4 cartes), pied de page des maisons. */
function appartPage(lang, { main = '', head = '', exemptPatch = null } = {}) {
  const ex = { ...m.appartGammeExempt(lang) };
  if (exemptPatch) Object.assign(ex, exemptPatch);
  const exemptHtml = ['page.chapeau.3', 'page.faq.3.q', 'page.faq.3.r', 'page.faq.4.r', 'page.maisons.h2', 'page.maisons.texte', 'page.complet.maisons']
    .map((id) => `<p>${enc(ex[id])}</p>`).join('');
  const cards = appartRows(ROWS_B).map((r) => B.card(lang, 'lappart', r, { houseName: m.APPART.name, showInclusions: false })).join('');
  const footer = lang === 'en' ? '3 coliving houses, 29 rooms, pool, sauna and gym in every house.' : '3 maisons, 29 chambres, piscine, sauna et salle de sport dans chaque maison.';
  return `<!DOCTYPE html><html lang="${lang}"><head><title>L&#x27;Appart : colocation à Annemasse | La Villa Coliving</title>` +
    `<meta name="description" content="${enc(m.APPART_CANONICAL_SENTENCE[lang])}">${head}</head><body><nav>La Villa Coliving</nav>` +
    `<main><h1>L&#x27;Appart</h1>${exemptHtml}${cards}${B.facts(lang)}${B.included(lang)}${B.commute(lang)}${main}</main>` +
    `<footer><p>${footer}</p></footer></body></html>`;
}

test('page de L\'Appart d\'exemple (vraies briques, 4 cartes de l\'état B, textes d\'exception) : aucun constat, FR et EN ; le pied de page des maisons n\'est pas lu', () => {
  for (const lang of LANGS) {
    const file = lang === 'en' ? 'en-lappart.html' : 'lappart.html';
    assert.deepEqual(gammeMixIssues(appartPage(lang), file, m), [], lang);
    assert.deepEqual(gammeMixIssues(appartPage(lang), lang === 'en' ? 'en-lappart-chambre-5.html' : 'lappart-chambre-2.html', m), [], `${lang} : fiche chambre`);
  }
});

test('règle a : la fiche de la MARQUE (note Google, 100+ résidents, 29 chambres, formule de trajet) sur une page de L\'Appart = échec', () => {
  for (const lang of LANGS) {
    const r = gammeMixIssues(appartPage(lang, { main: B.brandFacts(lang) }), lang === 'en' ? 'en-lappart.html' : 'lappart.html', m);
    for (const l of ['note Google des maisons', `« ${m.STATS.totalResidents}+ résidents »`, 'formule de trajet de la marque', `« ${m.STATS.totalRooms} chambres » (maisons)`]) {
      assert.ok(r.some((i) => i.startsWith(`preuve des maisons sur une page de L'Appart (${l}) — `)), `${lang} : ${l} — ${r.join(' | ')}`);
    }
    assert.ok(r.some((i) => /piscine, sauna ou salle de sport sur une page de L'Appart hors des textes/.test(i)), `${lang} : la fiche nomme piscine, sauna, salle de sport`);
  }
  // Le lien vers la fiche Google des maisons, seul, est aussi une preuve des maisons.
  const link = `<a href="${m.GOOGLE_REVIEWS.url}">Google</a>`;
  assert.ok(gammeMixIssues(appartPage('fr', { main: link }), 'lappart.html', m).includes('preuve des maisons sur une page de L\'Appart (lien vers la fiche Google des maisons)'));
});

test('règle b : la carte d\'une MAISON avec sa ligne « tout compris », un texte d\'exception changé d\'un caractère, une description qui nomme la piscine = échec', () => {
  const lodge = ROWS_B.find((r) => r.house_slug === 'lelodge');
  const houseCard = B.card('fr', 'lelodge', lodge, { houseName: 'Le Lodge' });
  assert.match(visibleText(houseCard), /piscine/i, 'la carte d\'une maison porte sa ligne « tout compris »');
  const r1 = gammeMixIssues(appartPage('fr', { main: houseCard }), 'lappart.html', m);
  assert.equal(r1.length, 1, r1.join('\n'));
  assert.match(r1[0], /^piscine, sauna ou salle de sport sur une page de L'Appart hors des textes qui les nient ou renvoient aux maisons \(3 fois\) — « ….*Tout compris : charges, fibre, ménage des communs, piscine, sauna et salle de sport/);
  // Un caractère changé DANS un texte d'exception : il n'est plus celui de la source, ses équipements (et ses surfaces) comptent.
  const changed = { 'page.maisons.texte': m.appartGammeExempt('fr')['page.maisons.texte'].replace('dans chacune', 'dans chacune,') };
  const r2 = gammeMixIssues(appartPage('fr', { exemptPatch: changed }), 'lappart.html', m);
  assert.deepEqual(r2.map((i) => i.split(' sur une page')[0]), ['piscine, sauna ou salle de sport', 'surfaces des chambres des maisons (« 16 à 24 m² »)'], 'comparaison au caractère près');
  // Un texte AJOUTÉ autour d'un texte d'exception, sans équipement, ne change rien : les équipements restent dans le texte exact.
  assert.deepEqual(gammeMixIssues(appartPage('fr', { exemptPatch: { 'page.maisons.h2': `${m.appartGammeExempt('fr')['page.maisons.h2']} Bonne visite.` } }), 'lappart.html', m), []);
  const desc = '<meta property="og:description" content="Colocation près de la gare, sans piscine.">';
  assert.deepEqual(gammeMixIssues(appartPage('fr', { head: desc }), 'lappart.html', m), ['piscine, sauna ou salle de sport sur une page de L\'Appart hors des textes qui les nient ou renvoient aux maisons (1 fois) — « …Colocation près de la gare, sans piscine.… » (titre ou description)']);
  // Une page qui n'est pas de L'Appart : les règles a et b ne s'y appliquent pas (les maisons y parlent de leurs équipements).
  assert.deepEqual(gammeMixIssues(appartPage('fr', { main: houseCard + B.brandFacts('fr') }), 'nos-maisons.html', m), []);
  assert.ok(gammeMixIssues('<html><head></head><body><p>x</p></body></html>', 'lappart.html', m).includes('page de L\'Appart sans <main> : la garde de gamme ne peut pas isoler le contenu de la page'));
  // Bloc « Dans nos maisons » de l'état B+ (L'Appart complet) : les cartes des maisons SANS leur ligne « tout compris »
  // (showInclusions={false}) ne nomment aucun équipement ; avec le texte d'exception qui les présente, la page passe.
  for (const lang of LANGS) {
    const quiet = B.card(lang, 'lelodge', lodge, { houseName: 'Le Lodge', showInclusions: false });
    assert.doesNotMatch(visibleText(quiet), HOUSE_AMENITY_RE, `${lang} : carte d'une maison sans sa ligne`);
    assert.deepEqual(gammeMixIssues(appartPage(lang, { main: quiet }), lang === 'en' ? 'en-lappart.html' : 'lappart.html', m), [], lang);
  }
});

test('ligne « tout compris » des cartes de L\'Appart (data-all-inclusive="appart") : jamais un équipement des maisons, sur toute page', () => {
  for (const lang of LANGS) {
    const card = B.card(lang, 'lappart', appartRows(ROWS_B)[0], { houseName: m.APPART.name });
    assert.match(card, /data-all-inclusive="appart"/, `${lang} : la carte de L'Appart porte sa ligne`);
    const page = (body) => `<html><head><title>t</title></head><body><main>${body}</main></body></html>`;
    assert.deepEqual(gammeMixIssues(page(card), lang === 'en' ? 'en-chambres-disponibles.html' : 'chambres-disponibles.html', m), [], lang);
    const bad = card.replace(/(<p data-all-inclusive="appart"[^>]*>)([^<]*)/, '$1$2 · piscine');
    const r = gammeMixIssues(page(bad), 'chambres-disponibles.html', m);
    assert.equal(r.length, 1, r.join('\n'));
    assert.match(r[0], /^ligne « tout compris » d'une carte de L'Appart qui nomme un équipement des maisons — « ….*· piscine… »$/);
  }
});

test('règle c, sur une page entière : une phrase, une ligne de tableau ou une description qui mêle les deux gammes = échec, quelle que soit la page', () => {
  const page = (body, head = '') => `<html><head><title>t</title>${head}</head><body><main>${body}</main></body></html>`;
  assert.equal(gammeMixIssues(page('<p>Tout compris dès 730 CHF, piscine et sauna.</p>'), 'index.html', m).length, 1);
  assert.equal(gammeMixIssues(page('<table><tr><td>L&#x27;Appart</td><td>790 €</td><td>piscine</td></tr></table>'), 'tarifs.html', m).length, 1);
  assert.equal(gammeMixIssues(page('<p>x</p>', '<meta name="description" content="Coliving dès 730 CHF avec piscine.">'), 'annemasse-colocation.html', m).length, 1);
  assert.deepEqual(gammeMixIssues(page('<p>Maisons : piscine, dès 1&nbsp;290 CHF.</p><p>L&#x27;Appart : dès 730 CHF.</p>'), 'index.html', m), []);
});

test('headTexts : titre, descriptions et titres Open Graph / Twitter, entités décodées (insécables conservées)', () => {
  const html = '<html><head><title>A &amp; B</title><meta name="description" content="dès 1&nbsp;290 CHF"><meta property="og:description" content="C"><meta property="twitter:title" content="D"><meta name="robots" content="noindex"></head><body></body></html>';
  assert.deepEqual(headTexts(html), ['A & B', 'dès 1 290 CHF', 'C', 'D']);
});

test('pages de L\'Appart : sa page et ses fiches, FR et EN ; exigées seulement quand L\'Appart a sa page (PLACE_PAGE_KEYS, étape E3)', () => {
  for (const f of ['lappart.html', 'en-lappart.html', 'lappart-chambre-2.html', 'en-lappart-chambre-5.html']) assert.ok(isAppartPageFile(f, m), f);
  for (const f of ['lavilla.html', 'lelodge-chambre-4.html', 'blog-lappart.html', 'lappart-chambre-123.html', 'tarifs.html']) assert.ok(!isAppartPageFile(f, m), f);
  assert.deepEqual(appartPageFiles(m, { lappart: [2, 3, 4, 5] }), [], 'avant l\'étape E3');
  const e3 = { ...m, PLACE_PAGE_KEYS: m.PLACE_KEYS };
  assert.deepEqual(appartPageFiles(e3, { lappart: [2, 5] }), ['lappart.html', 'en-lappart.html', 'lappart-chambre-2.html', 'en-lappart-chambre-2.html', 'lappart-chambre-5.html', 'en-lappart-chambre-5.html']);
  assert.deepEqual(appartPageFiles(e3, {}), ['lappart.html', 'en-lappart.html']);
});

// ── Fiche « L'Appart — l'essentiel » et blocs statiques ──────────────────────────────────────────────────────────────────────

test('fiche L\'Appart sur sa page : un bloc, la version, chaque phrase une fois, bouton et microcopie dans le bloc', () => {
  for (const lang of LANGS) assert.deepEqual(appartFactsBlockIssues(appartPage(lang), lang, m), [], lang);
  const twice = appartPage('fr', { main: B.facts('fr') });
  const r = appartFactsBlockIssues(twice, 'fr', m);
  assert.ok(r.includes('2 fiche(s) L\'Appart (id="appart-facts" ; attendu exactement 1)'), r.join('\n'));
  assert.ok(r.some((i) => /phrase de la fiche L'Appart présente 2 fois/.test(i)));
  // Une phrase canonique répétée hors de la fiche (un chapeau qui recopierait la phrase de L'Appart) : échec.
  const chapeau = appartPage('fr', { main: `<p>${enc(m.APPART_CANONICAL_SENTENCE.fr)}</p>` });
  assert.ok(appartFactsBlockIssues(chapeau, 'fr', m).some((i) => /présente 2 fois/.test(i)));
  const old = appartPage('fr').replace(`data-appart-facts-version="${m.APPART_FACTS_VERSION}"`, 'data-appart-facts-version="1999-01-01"');
  assert.ok(appartFactsBlockIssues(old, 'fr', m).includes(`version de la fiche L'Appart ≠ ${m.APPART_FACTS_VERSION} (APPART_FACTS_VERSION)`));
  const noCta = appartPage('fr').replace(/(<aside id="appart-facts"[\s\S]*?)<a\b[^>]*>Candidater<\/a>/, '$1');
  assert.ok(appartFactsBlockIssues(noCta, 'fr', m).some((i) => /bouton de la fiche « Candidater » présent 0 fois/.test(i)));
});

test('blocs statiques : le texte de la source sur sa page ; jamais sur une autre page ; jamais deux ; jamais une phrase canonique', () => {
  for (const lang of LANGS) for (const route of m.APPART_TEASER_ROUTES) {
    const blocks = appartTeaserBlocks(`<main>${B.teaser(lang, route)}</main>`);
    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].text, appartTeaserExpectedText(route, lang, m), `${lang} ${route}`);
    assert.deepEqual(appartTeaserIssues(blocks, route, lang, m), [], `${lang} ${route}`);
  }
  const home = appartTeaserBlocks(B.teaser('fr', '/'));
  assert.deepEqual(appartTeaserIssues(home, null, 'fr', m), ['1 bloc(s) statique(s) L\'Appart hors de leurs pages (APPART_TEASER_ROUTES)']);
  assert.ok(appartTeaserIssues(home, '/tarifs', 'fr', m).includes('bloc statique L\'Appart de la page « / » posé sur « /tarifs »'));
  assert.ok(appartTeaserIssues([...home, ...home], '/', 'fr', m).includes('2 blocs statiques L\'Appart (au plus 1 par page)'));
  const canon = [{ route: '/', text: `${appartTeaserExpectedText('/', 'fr', m)} ${m.APPART_CANONICAL_SENTENCE.fr}` }];
  const r = appartTeaserIssues(canon, '/', 'fr', m);
  assert.ok(r.some((i) => /texte du bloc statique L'Appart ≠ source/.test(i)) && r.some((i) => /phrase canonique dans le bloc statique/.test(i)), r.join('\n'));
  assert.equal(typeof APPART_TEASER_ALL_REQUIRED, 'boolean');
});

// ── Câblage ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

test('câblage : la garde des faits passe par les règles par gamme (base, HTML, llms.txt) et cherche la clé interne', () => {
  const src = readFileSync(path.join(ROOT, 'scripts/check-entity-facts.mjs'), 'utf8');
  const fn = (name) => src.slice(src.indexOf(`async function ${name}(`), src.indexOf('\n}\n', src.indexOf(`async function ${name}(`)));
  assert.match(fn('checkDb'), /dbFactsIssues\(rows, m, \{ today: new Date\(\)\.toISOString\(\)\.slice\(0, 10\) \}\)/);
  assert.match(fn('checkDb'), /select=house_slug,room_number,rent_chf,rent_eur,surface_m2,bathroom_type,availability,available_from/);
  assert.match(fn('checkHtml'), /gammeMixIssues\(html, f, m, nodes\)/);
  assert.match(fn('checkHtml'), /appartFactsBlockIssues\(html, appartFactsLang, m, text\)/);
  assert.match(fn('checkHtml'), /appartTeaserIssues\(teaserBlocks,/);
  assert.doesNotMatch(fn('checkHtml'), /numberOfRooms=\$\{n\.numberOfRooms\} hors/, 'l\'ancien contrôle numberOfRooms est remplacé par la règle par gamme');
  assert.match(fn('checkLlms'), /llmsGammeIssues\(actual, m\)/);
  assert.match(fn('main'), /internalKeySurfaceIssues\(\{ root: ROOT, keys: m\.INTERNAL_ONLY_KEYS \?\? \[\] \}\)/);
  noKey([src]);
});
