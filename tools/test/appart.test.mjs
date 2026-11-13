// L'Appart (brief du 12/11/2026, étape E2) : faits (src/data/appart.ts), emplacement (appartLocation.ts), textes partagés
// (appartFacts.ts), photos (appartPhotos.ts), aiguillage par lieu (placeLocation.ts), pont des clés (src/lib/placeBridge.ts),
// faits de la marque (ENTITY_FACTS.appart / .brand), nœud JSON-LD et offres de /chambres-disponibles. Chargés comme les gardes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { scanGenericAddresses } from '../../scripts/lib/private-locations.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const m = await loadEntityFacts();
const LANGS = ['fr', 'en'];
const nb = (s) => s.replace(/\u00a0/g, ' ');
const HOUSE_AMENITY = /piscine|sauna|salle de sport|\bpools?\b|\bgym\b/i;

/** Modules du site par l'alias `@/` : bundle esbuild en mémoire, comme les gardes. */
async function bundle(contents) {
  const out = await build({
    stdin: { contents, resolveDir: ROOT, loader: 'ts' },
    bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022',
    alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent',
  });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text, 'utf8').toString('base64')}`);
}

test('contrôles internes : aucun écart (faits, emplacement, textes, fiche de la marque)', () => {
  assert.deepEqual(m.appartIssues(), []);
  assert.deepEqual(m.appartLocationIssues(), []);
  assert.deepEqual(m.appartFactsIssues(), []);
  assert.deepEqual(m.entityFactsIssues(), []);
});

test('prix : saisis en euros, francs dérivés au taux figé (790 € → 730 CHF, 1 060 € → 990 CHF) ; « dès » = la chambre ; suite à deux = 530 €', () => {
  const A = m.APPART;
  assert.deepEqual(m.APPART_CONTRACT_EUR, { room: 790, suite: 1060 });
  assert.equal(A.price.room.chf, 730);
  assert.equal(A.price.suite.chf, 990);
  assert.equal(A.price.from, A.price.room);
  assert.equal(A.price.suitePerPersonEur, 530);
  assert.deepEqual([A.price.room.fr.chf, A.price.room.en.chf, nb(A.price.suite.fr.eur), A.price.suite.en.eur], ['730 CHF', 'CHF 730', '1 060 €', '€1,060']);
  // Constante séparée des maisons : le « dès » des maisons ne descend pas à 790 €.
  assert.equal(m.HOUSES_FROM.eur, 1380);
});

test('faits : 4 chambres n° 2 à 5 (jamais le n° 1), suite n° 5 « Suite », 12 et 22 m², 151 m², ouverture au 1er février 2027', () => {
  const A = m.APPART;
  assert.equal(A.key, 'lappart');
  assert.equal(A.name, "L'Appart");
  assert.deepEqual([...A.rooms.numbers], [2, 3, 4, 5]);
  assert.equal(A.rooms.suite.number, m.APPART_SUITE_ROOM_NUMBER);
  assert.deepEqual([A.rooms.standard.surfaceM2, A.rooms.suite.surfaceM2, A.flat.surfaceM2], [12, 22, 151]);
  assert.equal(A.opensOn, '2027-02-01');
  assert.deepEqual(A.opensOnLabel, { fr: '1er février 2027', en: '1 February 2027' });
  assert.equal(m.roomLabel('lappart', 5, 'fr'), 'Suite');
  assert.equal(m.roomCapacityLabel('lappart', 5, 'fr'), '1 ou 2 personnes');
  assert.equal(m.roomCapacityLabel('lappart', 5, 'en'), '1 or 2 people');
  assert.equal(m.roomCapacityLabel('lappart', 2, 'fr'), null);
  for (const k of m.MAISON_KEYS) assert.equal(m.roomCapacityLabel(k, 5, 'fr'), null, k);
  // Aucune distance ni coordonnée du logement dans les faits (décision 27 ; le dépôt est public).
  assert.doesNotMatch(JSON.stringify(A), /"(?:lat|lng|latitude|longitude|geo|street\w*|address\w*|\w*DistanceM|\w*Km|diagnosedOn)"/);
});

test('marque : 4 adresses, 33 chambres, de 730 à 1 430 CHF (790 à 1 530 €) ; les clés « maisons » de ENTITY_FACTS ne changent pas', () => {
  const F = m.ENTITY_FACTS;
  assert.deepEqual(F.brand, { places: 4, totalRooms: 33, price: { fromChf: 730, fromEur: 790, toChf: 1430, toEur: 1530 } });
  assert.equal(F.totalHouses, 3); assert.equal(F.totalRooms, 29);
  assert.deepEqual([F.price.fromChf, F.price.standardChf], [1290, 1430]);
  assert.deepEqual(F.surfaces, { min: 16, max: 24 });
  const A = F.appart;
  assert.equal(A.rooms, 4); assert.deepEqual([...A.numbers], [2, 3, 4, 5]); assert.equal(A.suite, 5); assert.equal(A.sharedBathRooms, 3);
  assert.deepEqual(A.surfaces, { min: 12, max: 22 });
  assert.deepEqual({ ...A.price, tiers: undefined }, { fromChf: 730, fromEur: 790, toChf: 990, toEur: 1060, tiers: undefined });
  assert.deepEqual(A.price.tiers.map((t) => [[...t.rooms], t.eur, t.chf, t.surfaceM2, t.bathroom]), [[[2, 3, 4], 790, 730, 12, 'shared'], [[5], 1060, 990, 22, 'private']]);
  assert.equal(A.opensOn, '2027-02-01');
});

test('phrases canoniques de L\'Appart et de la marque : texte de la source, au caractère près (insécables comprises)', () => {
  assert.equal(nb(m.APPART_CANONICAL_SENTENCE.fr), "L'Appart, colocation à Annemasse, quartier de la gare : 4 chambres meublées de 12 à 22 m² dans un appartement de 151 m², charges, fibre, streaming et ménage des communs compris, dès 730 CHF/mois (loyer contractuel en euros : dès 790 €). La suite accueille une ou deux personnes.");
  assert.equal(nb(m.APPART_CANONICAL_SENTENCE.en), "L'Appart, a flatshare in Annemasse, near the station: 4 furnished rooms of 12 to 22 m² in a 151 m² flat, bills, fibre, streaming and cleaning of the shared areas included, from CHF 730/month (contractual rent in euros: from €790). The suite is for one or two people.");
  assert.equal(nb(m.BRAND_CANONICAL_SENTENCE.fr), 'La Villa Coliving : 4 adresses côté France, à la frontière de Genève — 3 maisons de coliving et un appartement en colocation, 33 chambres, tout compris dès 730 CHF/mois (loyer contractuel en euros : dès 790 €).');
  assert.equal(nb(m.BRAND_CANONICAL_SENTENCE.en), 'La Villa Coliving: 4 locations on the Geneva border, French side — 3 coliving houses and one shared flat, 33 rooms, all inclusive from CHF 730/month (contractual rent in euros: from €790).');
  assert.equal(m.MAISONS_CROSS_LINK.fr, 'Tu veux piscine et sauna ? Les maisons, dès 1\u00a0290 CHF.');
  assert.equal(m.MAISONS_CROSS_LINK.en, 'Want a pool and a sauna? The houses, from CHF 1,290.');
});

test('fiche de L\'Appart : 9 chaînes ; paragraphe et dernière puce = phrases canoniques ; bail, caution, bouton = ceux de la fiche de la marque', () => {
  for (const lang of LANGS) {
    const t = m.appartFactsText(lang), brand = m.entityFactsText(lang);
    assert.equal(m.appartFactsStrings(lang).length, 9);
    assert.equal(t.paragraph, m.APPART_CANONICAL_SENTENCE[lang]);
    assert.equal(t.bullets[6], m.BRAND_CANONICAL_SENTENCE[lang]);
    assert.ok(brand.bullets.includes(t.bullets[3]) && t.bullets[3] === m.LEASE_SENTENCE[lang], `${lang} : bail`);
    assert.ok(brand.bullets.includes(t.bullets[4]) && t.bullets[4] === m.FEES_DEPOSIT_SENTENCE[lang], `${lang} : caution et frais`);
    assert.ok(t.bullets[5].endsWith(`${m.GUARANTOR_SENTENCE[lang]}.`), `${lang} : garant`);
    assert.equal(t.bullets[2], `${lang === 'en' ? 'Commute: ' : 'Trajet : '}${m.appartCommuteLine(lang)}.`);
    assert.deepEqual([t.cta, t.ctaNote], [brand.cta, brand.ctaNote]);
    // Ni preuve des maisons, ni équipement des maisons, ni formule de trajet de la marque.
    for (const s of m.appartFactsStrings(lang)) {
      assert.doesNotMatch(s, HOUSE_AMENITY, s);
      assert.doesNotMatch(s, /4[,.]8\/5|Google|100\+|13 (?:mois|months)|occupation|occupancy|16 (?:à|to) 17|20 min|29 (?:chambres|rooms)/, s);
    }
  }
  assert.deepEqual(m.APPART_FACTS_ROUTES, ['/lappart']);
  assert.match(m.APPART_FACTS_VERSION, /^\d{4}-\d{2}-\d{2}[a-z]?$/);
});

test('exceptions de la garde de gamme : 9 identifiants, 10 chaînes par langue, chacune nomme un équipement et le nie ou renvoie aux maisons', () => {
  assert.equal(m.APPART_GAMME_EXEMPT_IDS.length, 9);
  for (const lang of LANGS) {
    const strings = m.appartGammeExemptStrings(lang);
    assert.equal(strings.length, 10, lang);
    for (const s of strings) {
      assert.match(s, HOUSE_AMENITY, s);
      for (const sentence of s.split(/(?<=[.!?;])\s+/).filter((x) => HOUSE_AMENITY.test(x))) {
        assert.deepEqual(m.appartAmountsIn(sentence), [], `${lang} : prix de L'Appart à côté d'un équipement — ${sentence}`);
      }
    }
    // La ligne du tableau est la même source que la page.
    const row = m.appartIncluded(lang).rows.find((r) => HOUSE_AMENITY.test(r.item));
    assert.deepEqual([row.item, row.status, row.detail], [...m.appartGammeExempt(lang)['page.compris.tableau.l13']]);
    assert.ok(row.detail.endsWith(row.detailLink.text) && row.detailLink.text === m.MAISONS_CROSS_LINK[lang] && row.detailLink.href === '/nos-maisons');
  }
});

test('montants de L\'Appart bornés : « 530 € » ne se lit pas dans « 1 530 € », ni « 990 » dans « 1 990 »', () => {
  assert.deepEqual(m.appartAmountsIn('Chambre à 1\u00a0530 € par mois'), []);
  assert.deepEqual(m.appartAmountsIn('1 530 €, €1,530, 1.530, 1990, 7300, 17300'), []);
  assert.deepEqual(m.appartAmountsIn('730 CHF, CHF 990, 1\u00a0060 €, €1,060, 530 €'), ['730', '990', '1\u00a0060', '1,060', '530']);
  assert.deepEqual(m.appartAmountsIn('dès 790 € par mois'), ['790']);
});

test('blocs statiques : 5 pages, un texte propre à chacune, jamais une phrase canonique (de L\'Appart, de la marque ni de la fiche)', () => {
  assert.deepEqual([...m.APPART_TEASER_ROUTES], ['/', '/nos-maisons', '/tarifs', '/annemasse-colocation', '/chambre-a-louer-annemasse']);
  for (const lang of LANGS) {
    const canon = [...m.appartFactsStrings(lang), ...m.entityFactsStrings(lang), m.APPART_CANONICAL_SENTENCE[lang], m.BRAND_CANONICAL_SENTENCE[lang]];
    const texts = m.APPART_TEASER_ROUTES.map((r) => m.appartTeaser(r, lang));
    assert.equal(new Set(texts.map((t) => t.text)).size, 5, `${lang} : un texte par page`);
    for (const t of texts) {
      for (const c of canon) assert.ok(!t.text.includes(c) && !t.title.includes(c), `${lang} : phrase canonique dans un bloc statique`);
      assert.ok(t.text.includes(lang === 'en' ? 'CHF 730' : '730 CHF'), `${lang} : « dès 730 CHF » dans le bloc`);
    }
  }
});

test('emplacement : ligne courte, ligne longue, tableau (8 lignes, minutes seulement), note du 12 novembre, départ de la gare', () => {
  assert.equal(m.appartCommuteLine('fr'), "gare d'Annemasse à 5 min à pied, tram 17 à 2 min · Genève-Eaux-Vives en 13 min porte-à-porte");
  assert.equal(m.appartCommuteLine('en'), 'Annemasse station 5 min on foot, tram 17 stop 2 min · Geneva Eaux-Vives in 13 min door-to-door');
  for (const lang of LANGS) {
    const rows = m.appartCommuteRows(lang);
    assert.equal(rows.length, 8);
    for (const r of rows) assert.doesNotMatch(r.value, /\bk?m\b(?!²)/, r.value);
    assert.match(m.appartCommuteNote(lang), /12 (?:novembre|November) 2026/);
    assert.equal(m.appartNearby().length, 0, 'commerces pas encore relevés : section masquée');
    for (const s of m.appartLocationStrings(lang)) {
      assert.doesNotMatch(s, /\b\d+(?:[.,]\d+)?\s?k?m(?![²\w])/, `${lang} : distance — ${s}`);
      assert.deepEqual(scanGenericAddresses(s), [], `${lang} : « numéro + voie » — ${s}`);
    }
  }
  // L'Appart reste hors des agrégats de la marque (fourchettes calculées sur les maisons).
  assert.deepEqual(m.houseLocationIssues(), []);
  assert.equal(m.TRANSIT.doorToDoorEauxVivesMin, 16);
  assert.equal(m.TRANSIT.byHouse.lappart, undefined);
  // Carte et lien : depuis la gare (point public), seules coordonnées publiées.
  const g = m.publicGeo(m.APPART_PLACE);
  assert.ok(m.appartDirectionsUrl('fr').includes(encodeURIComponent(`${g.lat},${g.lng}`)));
  assert.match(m.appartMapLegend('fr'), /gare d'Annemasse/);
  assert.deepEqual([m.TRANSIT.trainEauxVivesMin, m.TRANSIT.trainChampelMin, m.TRANSIT.trainCornavinMin], [m.ANNEMASSE_TRAIN_MIN.eauxVives, m.ANNEMASSE_TRAIN_MIN.champel, m.ANNEMASSE_TRAIN_MIN.cornavin]);
});

test('règle d\'article anglais de L\'Appart = celle des maisons (copie : L\'Appart n\'importe pas houseLocation.ts)', () => {
  const src = readFileSync(path.join(ROOT, 'src/data/appartLocation.ts'), 'utf8');
  const copy = /const EN_ARTICLE_ISSUE = \/(.+)\/;/.exec(src)?.[1];
  assert.equal(copy, m.EN_ARTICLE_ISSUE_RE.source);
});

test('aiguillage par lieu : une maison rend exactement ses chaînes d\'aujourd\'hui ; L\'Appart, les siennes', () => {
  for (const lang of LANGS) {
    for (const k of m.MAISON_KEYS) {
      assert.equal(m.placeNeighbourhood(k, lang), m.houseNeighbourhood(k, lang));
      assert.equal(m.placeZone(k, lang), m.houseZone(k, lang));
      assert.equal(m.placeCommuteLine(k, lang), m.houseCommuteLine(k, lang));
      assert.deepEqual(m.placeCommuteRows(k, lang), m.houseCommuteRows(k, lang));
      assert.equal(m.placeCommuteNote(k, lang), m.houseCommuteNote(lang));
      assert.equal(m.placeDirectionsUrl(k, lang), m.houseDirectionsUrl(k, lang));
      assert.deepEqual(m.placeLocationStrings(k, lang), m.houseLocationStrings(k, lang));
      assert.equal(m.placeDirectionsStart(k, lang), null);
      assert.equal(m.placeMapLegend(k, lang), null);
      assert.equal(m.placeLocationVersion(k), m.HOUSE_LOCATION_VERSION);
    }
    assert.equal(m.placeNeighbourhood('lappart', lang), m.appartNeighbourhood(lang));
    assert.equal(m.placeCommuteLine('lappart', lang), m.appartCommuteLine(lang));
    assert.deepEqual(m.placeLocationStrings('lappart', lang), m.appartLocationStrings(lang));
    assert.equal(m.placeBorder('lappart', lang), undefined);
    assert.deepEqual(m.placeNearby('lappart', lang), []);
  }
  assert.equal(m.placeLocationVersion('lappart'), m.APPART_LOCATION_VERSION);
  // Contenu du tableau fourni par la page de L'Appart = les fonctions d'emplacement de L'Appart.
  for (const lang of LANGS) {
    assert.deepEqual(m.appartCommuteTable(lang), { rows: m.appartCommuteRows(lang), note: m.appartCommuteNote(lang), directionsUrl: m.appartDirectionsUrl(lang), directionsStart: m.appartDirectionsStart(lang) });
  }
});

test('les pages des maisons n\'embarquent aucun texte de L\'Appart par le tableau des trajets (HouseCommuteTable n\'importe que houseLocation)', () => {
  const src = readFileSync(path.join(ROOT, 'src/components/HouseCommuteTable.tsx'), 'utf8');
  assert.doesNotMatch(src, /from\s+["'][^"']*\/(?:appartLocation|placeLocation|appartFacts|appart)["']/);
  assert.match(src, /from "@\/data\/houseLocation"/);
});

test('JSON-LD : nœud de L\'Appart (4 chambres, 730–990 CHF, ses équipements, point public), offres avec le loyer en euros', () => {
  for (const lang of LANGS) {
    const n = m.buildAppartLodgingNode(lang);
    assert.equal(n['@id'], m.placeLodgingId('lappart'));
    assert.equal(n['@id'], 'https://www.lavillacoliving.com/lappart#lodging');
    assert.equal(n.parentOrganization['@id'], m.ORG_ID);
    assert.equal(n.numberOfRooms, 4);
    assert.equal(nb(n.priceRange), lang === 'en' ? 'CHF 730–990/month' : '730–990 CHF/mois');
    assert.equal(n.amenityFeature.length, 6);
    assert.doesNotMatch(JSON.stringify(n), HOUSE_AMENITY);
    assert.equal(n.address.streetAddress, undefined);
    assert.deepEqual([n.geo.latitude, n.geo.longitude], [m.publicGeo(m.APPART_PLACE).lat, m.publicGeo(m.APPART_PLACE).lng]);
    assert.equal(n.currenciesAccepted, undefined); assert.equal(n.aggregateRating, undefined); assert.equal(n.makesOffer, undefined);
    assert.equal(m.buildAppartLodgingNode(lang, { context: true })['@context'], 'https://schema.org');
    const list = m.buildAvailableRoomsItemList([
      { house_slug: 'lappart', room_number: 5, rent_chf: 990, rent_eur: '1060.00', availability: 'occupied', available_from: '2027-02-01', surface_m2: '22.0' },
      { house_slug: 'lavilla', room_number: 7, rent_chf: 1290, rent_eur: 1380, availability: 'available', available_from: null, surface_m2: 16 },
    ], lang);
    const [suite, villa] = list.itemListElement.map((x) => x.item);
    assert.equal(suite.name, "L'Appart — Suite");
    assert.equal(suite.itemOffered.name, "Suite — L'Appart");
    assert.equal(suite.itemOffered.containedInPlace['@id'], m.placeLodgingId('lappart'));
    assert.equal(suite.availabilityStarts, '2027-02-01');
    assert.deepEqual(suite.priceSpecification.map((p) => [p.price, p.priceCurrency, p.unitCode]), [[990, 'CHF', 'MON'], [1060, 'EUR', 'MON']]);
    assert.equal(villa.name, `La Villa — ${lang === 'en' ? 'Room' : 'Chambre'} 7`);
    assert.deepEqual(villa.priceSpecification.map((p) => [p.price, p.priceCurrency]), [[1290, 'CHF'], [1380, 'EUR']]);
  }
});

test('photos : 10 fichiers publiés, tous présents ; album de 8 sans les deux clichés en double ; vignette du JSON-LD = image du haut', () => {
  const files = m.lappartPhotoFiles();
  assert.equal(files.length, 10);
  for (const src of files) {
    assert.ok(existsSync(path.join(ROOT, 'public', src)), src);
    assert.match(src, /^\/images\/lappart\/lappart-[a-z0-9-]+\.webp$/, src);
  }
  const album = m.LAPPART_ALBUM.map((p) => p.src);
  assert.equal(album.length, 8);
  assert.ok(!album.includes(m.LAPPART_HERO.wide.src) && !album.includes(m.LAPPART_ROOM_COVER.src), 'cuisine-5 et cuisine-4 hors album (mêmes clichés que cuisine-2 et cuisine-1)');
  assert.equal(m.LAPPART_ALBUM_COVERS.length, 6);
  for (const c of m.LAPPART_ALBUM_COVERS) assert.ok(album.includes(c), c);
  assert.equal(m.APPART_PLACE.image, m.LAPPART_HERO.wide.src);
  // Noms neutres pour les pièces non confirmées ; aucun texte alternatif ne nomme séjour, entrée ni chambre.
  for (const p of [m.LAPPART_HERO.wide, m.LAPPART_HERO.tall, m.LAPPART_ROOM_COVER, ...m.LAPPART_ALBUM]) {
    assert.doesNotMatch(p.src, /sejour|entree|chambre/);
    for (const lang of LANGS) {
      assert.doesNotMatch(p.alt[lang], /séjour|entrée|living room|entrance|chambre|bedroom|\brue\b|street/i, p.alt[lang]);
      assert.deepEqual(scanGenericAddresses(p.alt[lang]), []);
    }
  }
});

test('pont des clés : la clé interne n\'existe que là ; une clé inconnue passe telle quelle ; aucun texte de L\'Appart ne la porte', () => {
  const keys = m.INTERNAL_ONLY_KEYS;
  assert.equal(keys.length, 1);
  const internal = m.toInternalPropertySlug('lappart');
  assert.ok(keys.includes(internal), 'la clé de L\'Appart est une clé interne');
  assert.ok(internal !== 'lappart' && !m.isPlaceKey(internal), 'clé interne ≠ clé publique');
  for (const k of m.MAISON_KEYS) assert.equal(m.toInternalPropertySlug(k), k);
  for (const v of ['', 'autre', 'LAPPART']) assert.equal(m.toInternalPropertySlug(v), v);
  const published = LANGS.flatMap((lang) => [
    ...m.appartFactsAllStrings(lang), ...m.appartLocationStrings(lang), JSON.stringify(m.buildAppartLodgingNode(lang)),
    m.appartDirectionsUrl(lang), ...m.lappartPhotoFiles(), JSON.stringify(m.APPART), JSON.stringify(m.APPART_PLACE),
  ]).join('\n').toLowerCase();
  for (const k of keys) assert.ok(!published.includes(k.toLowerCase()), 'clé interne dans un texte, un chemin ou le JSON-LD de L\'Appart');
});

test('prix d\'appel et carte d\'un lieu : L\'Appart « dès 730 CHF » ; les maisons, inchangées', async () => {
  const P = await bundle("export * from './src/lib/housePrice'; export { placeCard, HOUSES } from './src/data/houses';");
  assert.equal(nb(P.placePriceLabel('lappart', 'fr')), 'dès 730 CHF/mois');
  assert.equal(P.placePriceLabel('lappart', 'en'), 'from CHF 730/month');
  for (const k of m.MAISON_KEYS) for (const lang of LANGS) assert.equal(P.placePriceLabel(k, lang), P.housePriceLabel(k, lang), `${k} ${lang}`);
  assert.deepEqual(P.placeCard('lappart'), { label: "L'Appart", img: m.LAPPART_HERO.wide.src, commune: 'Annemasse' });
  for (const k of m.MAISON_KEYS) assert.deepEqual([P.placeCard(k).label, P.placeCard(k).img], [P.HOUSES[k].label, P.HOUSES[k].img], k);
});

test('chargeur des gardes : chaque export des modules de L\'Appart est exposé, à la même valeur (aucun nom en double)', async () => {
  for (const mod of ['./src/data/appart', './src/data/appartLocation', './src/data/appartFacts', './src/data/appartPhotos', './src/data/placeLocation', './src/lib/placeBridge']) {
    const x = await bundle(`export * from '${mod}';`);
    const names = Object.keys(x);
    assert.ok(names.length > 0, mod);
    for (const name of names) {
      assert.ok(name in m, `${mod} : ${name} absent du chargeur (nom en double dans un autre module ?)`);
      if (typeof x[name] === 'function') assert.equal(typeof m[name], 'function', name);
      else assert.deepEqual(m[name], x[name], name);
    }
  }
});
