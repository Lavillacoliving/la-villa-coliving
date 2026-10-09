// Règles d'emplacement de la garde scripts/check-entity-facts.mjs (Lot L2 « Emplacement et transport », 09/10/2026) :
// formulations D6/D7 interdites (FORBIDDEN), « 15 min » lié à Genève (D1), promesse en voiture / aéroport / A40 sur les
// pages en code, qualificatifs de la règle des minutes, découpe en phrases et lignes de tableau — sur des fixtures HTML.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isCodePage, GENEVA_RE, FIFTEEN_MIN_RE, isFifteenExempt, CAR_MINUTES_RE, AIRPORT_MINUTES_RE, A40_RE, MINUTE_QUALIFIER,
  visibleText, textBlocks, tableRows, sentences, forbiddenIssues, minuteIssues, geneva15Issues, carPromiseIssues,
} from '../../scripts/check-entity-facts.mjs';

// Le <head> et les scripts ne sont jamais du texte visible : la fixture y glisse une phrase fautive pour le prouver.
const page = (body) => `<!DOCTYPE html><html lang="fr"><head><title>t</title><meta name="description" content="Genève à 15 min en voiture"><script>var s = "Aéroport de Genève : 25 min en voiture";</script><style>p{}</style></head><body><nav>La Villa Coliving</nav><main>${body}</main></body></html>`;
const p = (...sentences) => page(sentences.map((s) => `<p>${s}</p>`).join(''));
const row = (...cells) => page(`<table><tbody><tr>${cells.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr></tbody></table>`);

test('isCodePage : les pages blog (index compris) viennent de la base, tout le reste du code', () => {
  for (const f of ['lavilla.html', 'en-faq.html', 'annemasse-colocation.html', 'lelodge-chambre-1.html', 'index.html', 'en.html']) assert.equal(isCodePage(f), true, f);
  for (const f of ['blog-x.html', 'en-blog-x.html', 'blog.html', 'en-blog.html']) assert.equal(isCodePage(f), false, f);
});

test('FIFTEEN_MIN_RE : 15 min / minutes / -minute / 15-20 / 15 à 20 / 15 to 20 ; pas 115, 2.15, 15-25, 15 km', () => {
  for (const s of ['15 min', '15 minutes', 'a 15-minute drive', '15-20 min', '15–20 minutes', '15 à 20 min', '15 to 20 minutes', '~15 min', '10-15 min', 'en moins de 15 min', '15 min']) assert.match(s, FIFTEEN_MIN_RE, s);
  for (const s of ['115 min', '2.15 min', '1,15 min', '15-25 min', '15 km', '15 CHF', '15 minimum']) assert.doesNotMatch(s, FIFTEEN_MIN_RE, s);
});

test('isFifteenExempt : marche, cadence, supplément, temps de lecture — rattachés au 15, pas à la phrase', () => {
  for (const s of [
    '10-15 minutes à pied du Palais des Nations à Genève',
    "Genève-Sécheron station (Léman Express), 10-15 minutes' walk from the Palais des Nations",
    'a 15-minute walk to Geneva',
    'walking 15 minutes from Geneva station',
    'Des trains pour Genève toutes les 15 minutes',
    'trains to Geneva every 15 minutes',
    'Genève : compte 15 min de plus en heure de pointe',
    'Geneva: allow an extra 15 minutes at rush hour',
    'Genève · 15 min de lecture',
  ]) assert.equal(isFifteenExempt(s), true, s);
  for (const s of [
    '15 min en voiture de Genève',
    'Genève en moins de 15 min',
    'Moins de 20 min porte-à-porte vers Genève — 15 min en voiture, gare à 5 min à pied',
    'sont à 15-20 minutes de Genève en Léman Express',
  ]) assert.equal(isFifteenExempt(s), false, s);
});

test('geneva15Issues : échec sur « 15 min » + Genève (même en voiture), rien sur les exceptions, lignes de tableau lues, un message par texte fautif', () => {
  assert.equal(geneva15Issues(p('Moins de 20 min porte-à-porte vers Genève — 15 min en voiture, frontière de Moillesulaz à 2 km.')).length, 1);
  assert.equal(geneva15Issues(p('Nos trois maisons sont à 15-20 minutes de Genève en Léman Express ou tram.')).length, 1);
  assert.equal(geneva15Issues(p('La gare d\'Annemasse : Genève en moins de 15 min.')).length, 1);
  assert.equal(geneva15Issues(p("Genève-Sécheron station, 10-15 minutes' walk from the Palais des Nations.")).length, 0);
  assert.equal(geneva15Issues(p('À 10-15 minutes à pied du Palais des Nations, à Genève.')).length, 0);
  assert.equal(geneva15Issues(p('Des trains pour Genève toutes les 15 minutes.')).length, 0);
  assert.equal(geneva15Issues(p('Rive en 31 min porte-à-porte depuis Genève.')).length, 0);
  assert.equal(geneva15Issues(p('Cornavin en 15 min.')).length, 0, 'sans Genève dans la phrase : c\'est la règle FORBIDDEN « Cornavin 15 min » qui s\'en charge');
  assert.equal(geneva15Issues(p('Colocation Genève | 1 200-1 600 CHF | 15-25 min')).length, 0, 'fourchette de marché 15-25 : hors règle (décision page par page)');
  assert.equal(geneva15Issues(row('Genève (voiture)', '15 min', 'A40')).length, 1, 'destination et durée dans deux cellules voisines');
  assert.equal(geneva15Issues(p('Genève à 15 min.', 'Genève à 15 min.')).length, 1, 'même texte fautif deux fois = un message');
  assert.equal(geneva15Issues(page('<p>Rien à signaler.</p>')).length, 0, 'head et script ignorés');
});

test('CAR_MINUTES_RE / AIRPORT_MINUTES_RE / A40_RE : formes prises et formes laissées', () => {
  for (const s of ['15 min en voiture', '25 min by car', 'a 10-minute drive', '20 minutes driving', 'En voiture : 15 min.', 'By car: 15 min', 'Car: 15-20 minutes', 'Aéroport de Genève | 25-30 min | Voiture (autoroute A40)', '5 min voiture (Lodge/Villa)', '5 min car (Lodge/Villa)', '30 à 40 minutes en transport en commun ou en voiture']) assert.match(s, CAR_MINUTES_RE, s);
  for (const s of ['Gare à 10 min à pied ; parking voiture gratuit', 'à 20 min, car le train est direct', 'Rive en 31 min porte-à-porte', '23 min de train · 40 min porte-à-porte', 'Vélo (Voie Verte) : 26 min (7,9 km)', 'Parking voiture disponible']) assert.doesNotMatch(s, CAR_MINUTES_RE, s);
  for (const s of ['Aéroport de Genève : 25 min en voiture', 'Geneva Airport: 30 min', '30 minutes to the airport', 'L\'aéroport (GVA) est à environ 30 à 40 minutes', 'GVA in 40 min']) assert.match(s, AIRPORT_MINUTES_RE, s);
  for (const s of ['L\'aéroport de Genève (GVA) se rejoint en train depuis la gare d\'Annemasse : Léman Express jusqu\'à Genève Cornavin, puis correspondance pour l\'aéroport.', 'Geneva Airport is reached by Léman Express from Annemasse station.', 'Gare à 10 min à pied.']) assert.doesNotMatch(s, AIRPORT_MINUTES_RE, s);
  assert.match('Voiture (autoroute A40)', A40_RE);
  assert.match('the A40 motorway', A40_RE);
  assert.doesNotMatch('A400 m', A40_RE);
});

test('carPromiseIssues : voiture, aéroport et A40 (pages en code) ; rien sur un trajet mesuré ou l\'accès aéroport sans minute', () => {
  const r1 = carPromiseIssues(p('Aéroport de Genève : 25 min en voiture'));
  assert.equal(r1.length, 2, r1.join('\n'));
  assert.ok(r1.some((x) => /promesse en voiture/.test(x)) && r1.some((x) => /aéroport/.test(x)));
  const r2 = carPromiseIssues(row('Geneva Airport', '25-30 min', 'Car (A40 highway)'));
  assert.equal(r2.length, 3, r2.join('\n'));
  assert.ok(r2.some((x) => /A40/.test(x)));
  assert.equal(carPromiseIssues(p('En voiture : 15 min.')).length, 1);
  assert.equal(carPromiseIssues(p('Centre d\'Annemasse (cinéma, restaurants, gare) : 10 min en voiture ou en vélo')).length, 1);
  assert.equal(carPromiseIssues(p('Évite les abords immédiats de l\'autoroute A40 (bruit).')).length, 1, 'A40 sur une page en code = échec ; les articles ne passent pas par cette fonction');
  assert.deepEqual(carPromiseIssues(p(
    'Rive en 31 min porte-à-porte depuis La Villa.',
    'Gare d\'Annemasse à 10 min à pied ; parking voiture disponible.',
    'L\'aéroport de Genève (GVA) se rejoint en train depuis la gare d\'Annemasse : Léman Express jusqu\'à Genève Cornavin, puis correspondance pour l\'aéroport.',
    'Vélo : centre de Genève (Rive) en 26 min par la Voie Verte.',
  )), []);
  assert.deepEqual(carPromiseIssues(p('Genève à 25 min en voiture.', 'Genève à 25 min en voiture.')).length, 1, 'dédoublonné');
});

test('forbiddenIssues (L2) : formulations D6/D7 interdites — positives', () => {
  const one = (html, re) => { const r = forbiddenIssues(html); assert.equal(r.length, 1, `${html}\n${r.join('\n')}`); assert.match(r[0], re); };
  one(p('La frontière suisse est mitoyenne à La Villa.'), /mitoyenne/);
  one(p('The Swiss border adjoins La Villa.'), /mitoyenne/);
  one(p('Ville-la-Grand — residential and family-friendly, border-adjacent to the northeast.'), /mitoyenne/);
  one(p('bordered by the Foron nature reserve, the border next door'), /mitoyenne/);
  one(p('La Villa, right on the border.'), /right on the border/);
  one(p('Réserve naturelle au pas de la porte'), /au pas de la porte/);
  one(p('Frontière de Moillesulaz : 500 m, 5 min à pied'), /500 m, 5 min/);
  one(p('Moillesulaz border: 500 m, 5 min walk'), /500 m, 5 min/);
  one(p('Genève CHUV / OMS : 20-25 min'), /CHUV/);
  one(p('La gare d\'Annemasse — terminus du Léman Express vers Genève Cornavin'), /terminus/);
  one(p('la gare d\'Annemasse (terminus français du Léman Express)'), /terminus/);
  one(p('a station that is the French terminus of the Léman Express'), /terminus/);
  one(p('Annemasse station — Léman Express terminus'), /terminus/);
  one(p('ligne de bus 7 directe'), /numéro de ligne de bus/);
  one(p('direct bus line 7'), /numéro de ligne de bus/);
  one(p('Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse) : 1 min à pied'), /tram à 1 min/);
  one(p('Tram 17 stop: 1-minute walk'), /tram à 1 min/);
  const tpn = forbiddenIssues(p('Bus TPN ligne 61 (arrêt à 200 m)'));
  assert.equal(tpn.length, 2, tpn.join('\n'));
  assert.ok(tpn.some((x) => /TPN/.test(x)) && tpn.some((x) => /numéro de ligne de bus/.test(x)));
  const etoile = forbiddenIssues(p('Tram Place de l\'Étoile à 1 min à pied'));
  assert.equal(etoile.length, 2, etoile.join('\n'));
});

test('forbiddenIssues (L2) : formulations légitimes laissées — négatives', () => {
  assert.deepEqual(forbiddenIssues(p(
    'on parle en réalité d\'une agglomération de communes mitoyennes, collée à la frontière genevoise',
    'the adjoining towns of Annemasse and Ambilly',
    'In the centre of Ambilly, the town right on the border: town hall 5 minutes on foot.',
    'Le Lodge : 500 m² sur 4 bâtiments au cœur de 1 500 m² de jardins.',
    'Parc Montessuit : 9 min à pied',
    'Arrêt de bus Albert Hénon à 8 min à pied ; arrêt de bus Annemasse-Étoile à 2 min à pied.',
    'Gare d\'Annemasse à 1 min à pied du marché.',
    'Évite les abords immédiats de l\'autoroute A40.',
    'Le Foron, la rivière-frontière, longe la rue.',
    'Lidl à 4 min à pied (300 m), 17 à 20 m².',
    'Le tram 17 relie Annemasse à Lancy-Pont-Rouge ; les bus TPG desservent la gare.',
    'Gare d\'Annemasse (Léman Express), un train toutes les 10 min en heure de pointe.',
    // (09/10/2026) « bus 7 » suivi d'une unité est une durée, pas un numéro de ligne (D7).
    'Annemasse-Étoile bus stop, the bus 7 minutes away on foot.',
    'Arrêt de bus 7 min à pied.',
  )), []);
});

test('MINUTE_QUALIFIER (L2) : Rive, Champel, Lancy, Puplinge, Foron, Voie Verte, porte-à-porte, door to door qualifient une minute', () => {
  for (const s of ['Rive en 31 min', 'Champel en 10 min', 'Lancy-Pont-Rouge en 16 min', 'Puplinge à 14 min', 'le Foron à 8 min', 'Voie Verte : 26 min', '22 min porte-à-porte', '22 min door to door', '22 min door-to-door', 'Cornavin en 23 min', '8 min à pied']) assert.match(s, MINUTE_QUALIFIER, s);
  for (const s of ['Genève en 25 min', 'centre de Genève à 15 minutes', 'arrive à 25 min']) assert.doesNotMatch(s, MINUTE_QUALIFIER, s);
  assert.match('Genève', GENEVA_RE); assert.match('Geneva', GENEVA_RE); assert.match('geneve', GENEVA_RE); assert.doesNotMatch('Annemasse', GENEVA_RE);
});

test('minuteIssues (S2, inchangée) : minute non canonique ni qualifiée dans une phrase « Genève » ; blocs seulement', () => {
  assert.equal(minuteIssues(p('Genève à 25 min.'), 20).length, 1);
  assert.equal(minuteIssues(p('Genève à 20 min.'), 20).length, 0);
  assert.equal(minuteIssues(p('Rive en 31 min porte-à-porte depuis Genève.'), 20).length, 0);
  assert.equal(minuteIssues(p('Genève-Eaux-Vives en 22 min porte-à-porte.'), 20).length, 0);
  assert.equal(minuteIssues(p('Genève · 15 min de lecture'), 20).length, 0);
  assert.equal(minuteIssues(row('Genève', '25 min'), 20).length, 0, 'cellules séparées : la règle S2 ne lit pas la ligne entière (CI --strict inchangée)');
});

test('visibleText / textBlocks / tableRows / sentences : head et scripts exclus, cellules jointes par « | », entités décodées (U+00A0 conservé)', () => {
  const html = row('Mode', 'Gen&egrave;ve-Eaux-Vives', '7&nbsp;min de train &middot; 22 min porte-&agrave;-porte');
  assert.deepEqual(tableRows(html), ['Mode | Gen&egrave;ve-Eaux-Vives | 7 min de train &middot; 22 min porte-&agrave;-porte |'], 'entités nommées non décodées : jamais émises par Puppeteer');
  const html2 = row('Mode', 'Genève', '7&nbsp;min');
  assert.deepEqual(tableRows(html2), ['Mode | Genève | 7 min |']);
  assert.ok(sentences(html2).includes('Mode | Genève | 7 min |'));
  assert.ok(textBlocks(html2).includes('Genève'));
  const vt = visibleText(page('<p>Un&nbsp;texte &#x27;simple&#x27;.</p>'));
  assert.ok(vt.includes('Un texte \'simple\'.'), vt);
  assert.doesNotMatch(vt, /voiture|Aéroport/, 'head et script exclus');
});
