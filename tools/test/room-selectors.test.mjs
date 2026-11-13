// Sélecteurs de chambres (L'Appart, brief du 12/11/2026) : src/lib/roomSelectors.ts, chargé tel quel par Node 24, sur
// les deux relevés de la vue (tools/test/fixtures/v_public_rooms.etat-A.json : avant L'Appart ; etat-B.json : après la
// bascule, 4 lignes de L'Appart datées du 01/02/2027).
// 1. Entrée filtrée : une ligne d'un lieu inconnu du code n'atteint aucune page.
// 2. Défaut = maisons : l'inventaire « toutes les chambres » (useAllRooms) est le même avant et après la bascule —
//    pages de listes, compteurs et offre hiver ne voient jamais L'Appart.
// 3. L'Appart se demande par sa clé (useHouseRooms("lappart")) ; l'état embarqué suit les lieux demandés.
// 4. Câblage : le magasin (src/lib/availability.ts) et /offre-hiver passent bien par ces sélecteurs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as S from '../../src/lib/roomSelectors.ts';
import { MAISON_KEYS, PLACE_KEYS } from '../../src/data/places.ts';
import { isOfferRoom } from '../../src/data/offer.ts';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');
const A = JSON.parse(read('tools/test/fixtures/v_public_rooms.etat-A.json'));
const B = JSON.parse(read('tools/test/fixtures/v_public_rooms.etat-B.json'));
const ids = (rows) => rows.map((r) => `${r.house_slug}:${r.room_number}`);
const row = (house_slug, room_number, over = {}) => ({ house_slug, room_number, availability: 'occupied', available_from: null, ...over });
/** Corps d'une fonction exportée d'un fichier source (jusqu'à l'accolade fermante en début de ligne). */
function body(src, name) {
  const m = new RegExp(`export function ${name}\\b[\\s\\S]*?\\n\\}`).exec(src);
  assert.ok(m, `fonction ${name} introuvable`);
  return m[0];
}

test('relevés : A = 29 lignes des 3 maisons ; B = les mêmes, puis les 4 lignes de L\'Appart', () => {
  assert.equal(A.length, 29);
  assert.deepEqual([...new Set(A.map((r) => r.house_slug))].sort(), [...MAISON_KEYS].sort());
  assert.equal(B.length, 33);
  assert.deepEqual(B.slice(0, 29), A);
  assert.deepEqual(ids(B.slice(29)), ['lappart:2', 'lappart:3', 'lappart:4', 'lappart:5']);
});

test('entrée filtrée : un lieu inconnu est écarté, l\'ordre reçu est gardé', () => {
  const rows = [row('lelodge', 3), row('lechalet', 1), row('lappart', 2), row('', 1), row('LAPPART', 3), row('toString', 4), row('lavilla', 7), row(null, 5)];
  assert.deepEqual(ids(S.knownPlaceRows(rows)), ['lelodge:3', 'lappart:2', 'lavilla:7']);
  assert.deepEqual(ids(S.maisonRows(rows)), ['lelodge:3', 'lavilla:7']);
  assert.deepEqual(S.knownPlaceRows(A), A);
  assert.deepEqual(S.knownPlaceRows(B), B);
});

test('tri : maisons dans l\'ordre d\'affichage, puis L\'Appart, puis le numéro ; un lieu inconnu en dernier', () => {
  const rows = [row('lappart', 5), row('lelodge', 2), row('lechalet', 1), row('lavilla', 10), row('lappart', 2), row('leloft', 4), row('lavilla', 1)];
  assert.deepEqual(ids([...rows].sort(S.compareRooms)), ['lavilla:1', 'lavilla:10', 'leloft:4', 'lelodge:2', 'lappart:2', 'lappart:5', 'lechalet:1']);
  assert.deepEqual([...PLACE_KEYS], ['lavilla', 'leloft', 'lelodge', 'lappart']);
});

test('useAllRooms (allMaisonRooms) : les 3 maisons seulement, le même inventaire avant et après la bascule', () => {
  const a = S.allMaisonRooms(A);
  const b = S.allMaisonRooms(B);
  assert.equal(a.known, true);
  assert.equal(a.rooms.length, 29);
  assert.deepEqual(b, a);
  assert.ok(b.rooms.every((r) => MAISON_KEYS.includes(r.house_slug)));
  // Trié maison (La Villa → Le Loft → Le Lodge) puis numéro, quel que soit l'ordre reçu.
  assert.deepEqual(ids(S.allMaisonRooms([...B].reverse()).rooms), ids(a.rooms));
  assert.deepEqual(ids(a.rooms), ids([...A].sort((x, y) => MAISON_KEYS.indexOf(x.house_slug) - MAISON_KEYS.indexOf(y.house_slug) || x.room_number - y.room_number)));
});

test('useAllRooms : inconnu tant qu\'une maison manque (état embarqué d\'une page maison, ou de L\'Appart seul)', () => {
  assert.deepEqual(S.allMaisonRooms(null), { known: false, rooms: [] });
  assert.deepEqual(S.allMaisonRooms([]), { known: false, rooms: [] });
  assert.deepEqual(S.allMaisonRooms(A.filter((r) => r.house_slug === 'lelodge')), { known: false, rooms: [] });
  assert.deepEqual(S.allMaisonRooms(B.filter((r) => r.house_slug !== 'leloft')), { known: false, rooms: [] });
  assert.deepEqual(S.allMaisonRooms(B.filter((r) => r.house_slug === 'lappart')), { known: false, rooms: [] });
});

test('offre hiver : sur le relevé B, aucune chambre de L\'Appart parmi les chambres de l\'offre', () => {
  // Ce que fait /offre-hiver : splitRooms(useAllRooms().rooms).candidates.filter(isOfferRoom).
  const offer = S.allMaisonRooms(B).rooms.filter(isOfferRoom);
  assert.ok(offer.length > 0, 'le relevé doit contenir au moins une chambre de maison dans l\'offre');
  assert.equal(offer.filter((r) => r.house_slug === 'lappart').length, 0);
  // Sans le filtre des maisons, les 4 chambres de L'Appart (datées) entreraient dans l'offre : le test ne passe pas à vide.
  assert.equal(S.knownPlaceRows(B).filter(isOfferRoom).filter((r) => r.house_slug === 'lappart').length, 4);
});

test('useHouseRooms (placeRooms) : les chambres d\'un lieu, triées par numéro ; L\'Appart inconnu tant que la vue ne l\'a pas', () => {
  assert.deepEqual(S.placeRooms(A, 'lappart'), { known: false, rooms: [] });
  assert.deepEqual(S.placeRooms(null, 'lappart'), { known: false, rooms: [] });
  const appart = S.placeRooms([...B].reverse(), 'lappart');
  assert.equal(appart.known, true);
  assert.deepEqual(ids(appart.rooms), ['lappart:2', 'lappart:3', 'lappart:4', 'lappart:5']);
  for (const k of MAISON_KEYS) {
    assert.deepEqual(S.placeRooms(B, k), S.placeRooms(A, k), k);
    assert.ok(S.placeRooms(B, k).rooms.every((r) => r.house_slug === k), k);
  }
});

test('état embarqué (embedRows) : toutes les lignes sans argument, sinon celles des lieux demandés ; null si aucune', () => {
  assert.equal(S.embedRows(null), null);
  assert.equal(S.embedRows(B), B, 'sans argument : les lignes telles quelles');
  assert.deepEqual(ids(S.embedRows(B, 'lelodge')), ids(B.filter((r) => r.house_slug === 'lelodge')));
  assert.deepEqual(ids(S.embedRows(B, ['lelodge', 'lappart'])), ids(B.filter((r) => ['lelodge', 'lappart'].includes(r.house_slug))));
  assert.equal(S.embedRows(A, 'lappart'), null);
  assert.equal(S.embedRows(A, []), null);
  assert.equal(S.embedRows([]), null);
});

test('câblage : le magasin des chambres passe par les sélecteurs (entrée filtrée, useAllRooms = maisons)', () => {
  const src = read('src/lib/availability.ts');
  assert.match(src, /export type HouseKey = MaisonKey;/);
  assert.match(src, /export type PublicRoom<K extends PlaceKey = MaisonKey> = \{\n\s+house_slug: K;/);
  assert.match(body(src, 'useAllRooms'), /\n\s+return allMaisonRooms\(rows\);\n\}$/);
  assert.match(body(src, 'useHouseRooms'), /\n\s+return placeRooms\(rows, place\);\n\}$/);
  assert.match(body(src, 'useRoomsSnapshotFor'), /\n\s+return embedRows\(rows, places\);\n\}$/);
  // Les deux entrées du canal des chambres : le fetch et l'état embarqué.
  assert.match(src, /const rooms = knownPlaceRows\(data as unknown as IncomingRoom\[\]\);/);
  assert.match(src, /const known = embedded \? knownPlaceRows\(embedded\) : \[\];/);
  assert.equal((src.match(/publishRooms\(/g) ?? []).length, 2, 'une seule publication des lignes (après le filtre)');
});

test('câblage : /offre-hiver lit l\'inventaire des maisons (useAllRooms), jamais un lieu par sa clé', () => {
  const src = read('src/pages/OfferHiverPage.tsx');
  assert.match(src, /const all = useAllRooms\(\);/);
  assert.match(src, /splitRooms\(all\.rooms\)\.candidates\.filter\(isOfferRoom\)/);
  assert.doesNotMatch(src, /useHouseRooms|useRoomsSnapshotFor|lappart/);
});
