// Garde pages maisons (Lot L2 « Emplacement et transport », 09/10/2026) : fonctions pures de scripts/house-pages-check.mjs
// sur un prérendu synthétique bâti depuis la source unique (houseLocation.ts, ENTITY_HOUSES, ROOM_SURFACE_BY_HOUSE).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { checkHouseLocation, checkRoomSurfaceByHouse, mainTextAfterH1, COMMUTE_WINDOW } from '../../scripts/house-pages-check.mjs';

const m = await loadEntityFacts();
const SLUGS = ['lavilla', 'leloft', 'lelodge'];
const LANGS = ['fr', 'en'];

/** Encodage de Puppeteer / React : &, <, apostrophe (&#x27;), U+00A0 (&nbsp;). */
const enc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#x27;').replace(/ /g, '&nbsp;');

/** Miroir minimal de HouseDetailPage : fil d'Ariane, H1, hero, « À propos » (longDescription), section Localisation, fiche entité. */
function housePage(slug, lang, { version = m.HOUSE_LOCATION_VERSION, commute = true, neighbourhoodTimes = 1, link = true, before = '' } = {}) {
  const h = m.ENTITY_HOUSES.find((x) => x.slug === slug);
  const nb = enc(m.houseNeighbourhood(slug, lang));
  const url = m.houseDirectionsUrl(slug, lang).replace(/&/g, '&amp;');
  const desc = `${before}${lang === 'en' ? 'Our house, in town' : 'Notre maison, en ville'} : ${commute ? h.commute[lang] : 'see below'}. ${'Lorem ipsum. '.repeat(20)}`;
  // Comme sur la vraie page, équipements, chambres et galerie séparent la description de la section Localisation
  // et de la fiche entité (qui porte aussi la ligne de trajet) : tout ce qui suit est hors fenêtre de 1 500 caractères.
  const middle = `<h2>Équipements</h2><p>${'Piscine, sauna, salle de sport. '.repeat(60)}</p>`;
  return `<!DOCTYPE html><html lang="${lang}"><head><title>t</title><meta name="description" content="${nb}"></head><body>` +
    `<nav>La Villa Coliving</nav><main class="relative"><p>Accueil › Maisons</p><h1 class="x">${h.label} — <span>coliving</span></h1>` +
    `<p>${h.commune}, Grand Genève 10 résidents 370 m² Candidater Tout inclus : dès 1&nbsp;370 CHF/mois</p><h2>À propos</h2><p>${enc(desc)}</p>${middle}` +
    `<section data-house-location-version="${version}"><h2>Localisation</h2>${Array(neighbourhoodTimes).fill(`<p>${nb}</p>`).join('')}` +
    `<table><tbody><tr><th>Mode</th><td>Dest</td><td>7 min</td></tr></tbody></table>` +
    `${link ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${m.houseDirectionsLabel(lang)}</a>` : ''}</section>` +
    `<aside id="entity-facts"><p>${enc(h.commute[lang])}</p></aside></main></body></html>`;
}

test('checkHouseLocation : page conforme → aucun échec (3 maisons × FR/EN) ; la méta description ne compte pas comme occurrence', () => {
  for (const slug of SLUGS) for (const lang of LANGS) {
    const r = checkHouseLocation(housePage(slug, lang), slug, lang, m);
    assert.deepEqual(r, [], `${slug}/${lang}\n${r.join('\n')}`);
  }
});

test('mainTextAfterH1 : texte visible du <main> à partir du H1, balises inline du H1 tolérées', () => {
  const t = mainTextAfterH1(housePage('lavilla', 'fr'));
  assert.ok(t.startsWith('La Villa — coliving'), t.slice(0, 60));
  assert.doesNotMatch(t, /Accueil › Maisons/);
  assert.ok(t.includes(m.ENTITY_HOUSES[0].commute.fr));
  assert.equal(COMMUTE_WINDOW, 1500);
});

test('checkHouseLocation : ligne de trajet absente ou repoussée au-delà de la fenêtre → échec nommé', () => {
  const r1 = checkHouseLocation(housePage('leloft', 'en', { commute: false }), 'leloft', 'en', m);
  assert.equal(r1.length, 1, r1.join('\n'));
  assert.match(r1[0], /^en-leloft\.html : ligne de trajet « tram 17 stop 8 min on foot/);
  const r2 = checkHouseLocation(housePage('lelodge', 'fr', { before: 'Un long préambule. '.repeat(90) }), 'lelodge', 'fr', m);
  assert.equal(r2.length, 1, r2.join('\n'));
  assert.match(r2[0], /lelodge\.html : ligne de trajet .* absente des 1500 premiers caractères/);
});

test('checkHouseLocation : phrase de quartier 0 ou 2 fois, version absente ou périmée, lien manquant → échecs nommés', () => {
  const zero = checkHouseLocation(housePage('lavilla', 'fr', { neighbourhoodTimes: 0 }), 'lavilla', 'fr', m);
  assert.equal(zero.length, 1, zero.join('\n'));
  assert.match(zero[0], /lavilla\.html : phrase de quartier \(houseNeighbourhood\) présente 0 fois/);
  const twice = checkHouseLocation(housePage('lavilla', 'en', { neighbourhoodTimes: 2 }), 'lavilla', 'en', m);
  assert.match(twice[0], /en-lavilla\.html : phrase de quartier .* présente 2 fois/);
  const old = checkHouseLocation(housePage('leloft', 'fr', { version: '1999-01-01' }), 'leloft', 'fr', m);
  assert.equal(old.length, 1, old.join('\n'));
  assert.match(old[0], new RegExp(`leloft\\.html : data-house-location-version="${m.HOUSE_LOCATION_VERSION}" présent 0 fois`));
  const noLink = checkHouseLocation(housePage('lelodge', 'en', { link: false }), 'lelodge', 'en', m);
  assert.equal(noLink.length, 2, noLink.join('\n'));
  assert.match(noLink[0], /en-lelodge\.html : lien « Check my commute » absent \(href attendu : https:\/\/www\.google\.com\/maps\/dir\//);
  assert.match(noLink[1], /libellé « Check my commute » absent/);
  // Lien présent mais vers une autre origine : échec (l'attribut doit être exactement houseDirectionsUrl).
  const wrong = housePage('lavilla', 'fr').replace(/origin=[^&"]+/, 'origin=Annemasse');
  assert.ok(checkHouseLocation(wrong, 'lavilla', 'fr', m).some((x) => /lien « Calculer mon trajet » absent/.test(x)));
  // Maison inconnue de la source : un seul échec explicite.
  const unknown = checkHouseLocation('<main></main>', 'lechalet', 'fr', m);
  assert.equal(unknown.length, 1);
  assert.match(unknown[0], /lechalet\.html : lechalet absent de ENTITY_HOUSES/);
});

test('checkHouseLocation : page de production AVANT le lot L2 (sans section) → les quatre règles tombent, messages lisibles', () => {
  const legacy = `<!DOCTYPE html><html><head></head><body><main><h1>La Villa</h1><p>Notre maison amirale, à 10 minutes à pied de la gare d'Annemasse.</p><section><h2>Localisation</h2><p>La frontière suisse est mitoyenne à La Villa.</p></section></main></body></html>`;
  const r = checkHouseLocation(legacy, 'lavilla', 'fr', m);
  assert.equal(r.length, 5, r.join('\n'));
  assert.ok(r.every((x) => x.startsWith('lavilla.html : ')));
});

test('checkRoomSurfaceByHouse : ROOM_SURFACE_BY_HOUSE = Math.round(min/max) de v_public_rooms.surface_m2 par maison', () => {
  const S = m.ROOM_SURFACE_BY_HOUSE;
  const db = (over = {}) => new Map(Object.entries(S).map(([slug, { min, max }]) => [slug, (over[slug] ?? [min + 0.4, (min + max) / 2, max - 0.4]).map((surface_m2) => ({ house_slug: slug, surface_m2 }))]));
  assert.deepEqual(checkRoomSurfaceByHouse(db(), m), []);
  assert.deepEqual(checkRoomSurfaceByHouse(db({ lelodge: [17, 19.4] }), m), [`lelodge : ROOM_SURFACE_BY_HOUSE = ${S.lelodge.min}-${S.lelodge.max} m², v_public_rooms = 17-19 m² (Math.round du min/max de surface_m2)`]);
  assert.deepEqual(checkRoomSurfaceByHouse(db({ lavilla: [15.5, 24] }), m), [], '15,5 → 16 (règle du Lot 7)');
  const withNew = db(); withNew.set('lechalet', [{ house_slug: 'lechalet', surface_m2: 20 }]);
  assert.deepEqual(checkRoomSurfaceByHouse(withNew, m), ['lechalet : absent de ROOM_SURFACE_BY_HOUSE (src/data/stats.ts) — nouvelle maison ?']);
  const missing = db(); missing.delete('leloft');
  assert.deepEqual(checkRoomSurfaceByHouse(missing, m), ['leloft : dans ROOM_SURFACE_BY_HOUSE mais aucune chambre publique en base']);
  assert.deepEqual(checkRoomSurfaceByHouse(db({ leloft: [null, undefined] }), m), [], 'surface_m2 absent : ignoré (la garde /tarifs le signale)');
  // Cohérence source : les bornes des trois maisons réunies = STATS.roomSizeMin / Max.
  assert.equal(Math.min(...Object.values(S).map((x) => x.min)), m.STATS.roomSizeMin);
  assert.equal(Math.max(...Object.values(S).map((x) => x.max)), m.STATS.roomSizeMax);
});
