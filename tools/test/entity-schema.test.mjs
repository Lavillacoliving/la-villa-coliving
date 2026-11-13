// Entité JSON-LD (Lot L6, brief v3.1 — D11 alternateName, L6.2 nœud LodgingBusiness unique par maison, L6.3 sameAs, L6.5 ItemList
// des chambres, L6.6 NAP) : invariants de src/lib/structuredData.ts (chargé via esbuild) et de la garde entityGraphIssues.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { entityGraphIssues } from '../../scripts/check-entity-facts.mjs';
import { scanGenericAddresses } from '../../scripts/lib/private-locations.mjs';

const m = await loadEntityFacts();
const LANGS = ['fr', 'en'];
const flatten = (node, acc = []) => { if (node && typeof node === 'object') { if (node['@type']) acc.push(node); for (const v of Object.values(node)) { if (Array.isArray(v)) v.forEach((x) => flatten(x, acc)); else if (v && typeof v === 'object') flatten(v, acc); } } return acc; };

test('D11 : alternateName identiques sur les fiches d\'organisation (LocalBusiness, LodgingBusiness accueil), sameAs avec la fiche Google par cid', () => {
  assert.deepEqual([...m.LAVILLA_ALTERNATE_NAMES], ['La Villa Coliving Genève', 'La Villa Coliving Annemasse', 'LaVilla Coliving']);
  for (const lang of LANGS) {
    for (const node of [m.buildLocalBusinessSchema(lang, 'desc'), m.buildHomeLodgingBusinessSchema(lang)]) {
      assert.equal(node['@id'], m.ORG_ID);
      assert.deepEqual(node.alternateName, [...m.LAVILLA_ALTERNATE_NAMES]);
      assert.ok(node.sameAs.includes(m.GOOGLE_BUSINESS_PROFILE_URL));
      assert.ok(!node.sameAs.some((u) => /share\.google/.test(u)), 'plus de lien court share.google');
      assert.ok(!node.sameAs.some((u) => /facebook\.com/.test(u)), 'jamais Facebook dans sameAs (D10)');
      assert.equal(node.department.length, 3);
      for (const d of node.department) { assert.match(d['@id'], /#lodging$/); assert.equal(d.parentOrganization['@id'], m.ORG_ID); }
    }
  }
  assert.equal(m.GOOGLE_BUSINESS_PROFILE_URL, m.GOOGLE_REVIEWS.url);
});

test('L6.2 : un nœud LodgingBusiness par maison — @id, nom, numberOfRooms, priceRange, amenityFeature = ENTITY_HOUSES.amenities, sameAs bookmycoliving, pas de currenciesAccepted', () => {
  for (const h of m.HOUSES) {
    const eh = m.ENTITY_HOUSES.find((x) => x.slug === h.slug);
    for (const lang of LANGS) {
      const n = m.buildHouseLodgingNode(h, lang);
      assert.equal(n['@id'], `${h.url}#lodging`);
      assert.equal(n['@context'], undefined, 'pas de @context dans department');
      assert.equal(m.buildHouseLodgingNode(h, lang, { context: true })['@context'], 'https://schema.org');
      assert.equal(n.name, `La Villa Coliving — ${h.label}`);
      assert.ok(n.alternateName.includes(h.label) && n.alternateName.includes(`La Villa Coliving — ${h.commune}`));
      assert.equal(n.parentOrganization['@id'], m.ORG_ID);
      assert.equal(n.numberOfRooms, eh.rooms);
      // (12/10/2026, sécurité) Ni rue ni coordonnées exactes dans le nœud maison : commune + point public arrondi.
      assert.equal(n.address.streetAddress, undefined);
      assert.equal(n.address.addressLocality, h.addressLocality);
      assert.deepEqual([n.geo.latitude, n.geo.longitude], [m.publicGeo(h).lat, m.publicGeo(h).lng]);
      assert.equal(n.currenciesAccepted, undefined);
      assert.equal(n.aggregateRating, undefined);
      assert.ok(n.sameAs.some((u) => /bookmycoliving\.com\/property\//.test(u)), `${h.slug} : bookmycoliving`);
      assert.equal(n.amenityFeature.length, h.amenityFeatures[lang].length);
      // Les 3 premiers équipements = ceux de la fiche entité (piscine · sauna · sport/chalet), même langue, insensible à la casse.
      const fromFacts = eh.amenities[lang].split(' · ').map((x) => x.trim().toLowerCase());
      const first3 = n.amenityFeature.slice(0, 3).map((a) => a.name.toLowerCase());
      assert.deepEqual(first3, fromFacts, `${h.slug} ${lang} : équipements ≠ fiche entité`);
      // (13/11/2026) La Villa : du « dès » des maisons (1 290 CHF, chambres 7 et 8) au prix standard.
      if (h.slug === 'lavilla') assert.match(n.priceRange, lang === 'en' ? /^CHF 1,290–1,430\/month$/ : /^1[\u00A0 ]290–1[\u00A0 ]430 CHF\/mois$/);
      else assert.match(n.priceRange, lang === 'en' ? /^CHF 1,430\/month$/ : /^1[\u00A0 ]430 CHF\/mois$/);
    }
  }
});

test('L6.5 : ItemList des chambres — Offer mensuelle, LeaseOut, offeredBy, Accommodation rattachée à sa maison, jamais numberOfRooms ; vide → undefined', () => {
  const rooms = [
    { house_slug: 'lavilla', room_number: 3, rent_chf: 1370, rent_eur: '1470.00', availability: 'available', available_from: null, surface_m2: '16' },
    { house_slug: 'lelodge', room_number: 11, rent_chf: 1430, availability: 'soon', available_from: '2026-11-01', surface_m2: 18 },
    { house_slug: 'leloft', room_number: 2, rent_chf: null, availability: 'soon', available_from: null, surface_m2: null },
  ];
  assert.equal(m.buildAvailableRoomsItemList([], 'fr'), undefined);
  for (const lang of LANGS) {
    const list = m.buildAvailableRoomsItemList(rooms, lang);
    assert.equal(list['@type'], 'ItemList'); assert.equal(list.numberOfItems, 3);
    const offers = list.itemListElement.map((x) => x.item);
    // (L'Appart, 13/11/2026) Deux spécifications de prix quand le loyer contractuel en euros est connu : CHF (affiché) puis EUR.
    assert.deepEqual(offers[0].priceSpecification.map((p) => [p['@type'], p.price, p.priceCurrency, p.unitCode]), [['UnitPriceSpecification', 1370, 'CHF', 'MON'], ['UnitPriceSpecification', 1470, 'EUR', 'MON']]);
    assert.equal(offers[0].price, 1370); assert.equal(offers[0].priceCurrency, 'CHF');
    assert.deepEqual(offers[1].priceSpecification.map((p) => p.priceCurrency), ['CHF'], 'sans loyer en euros : CHF seul');
    assert.equal(offers[0].availability, 'https://schema.org/InStock'); assert.equal(offers[1].availability, 'https://schema.org/PreOrder');
    assert.equal(offers[1].availabilityStarts, '2026-11-01');
    assert.equal(offers[2].price, undefined, 'sans loyer connu, pas de prix');
    for (const o of offers) {
      assert.equal(o.businessFunction, 'http://purl.org/goodrelations/v1#LeaseOut');
      assert.equal(o.offeredBy['@id'], m.ORG_ID);
      assert.equal(o.itemOffered['@type'], 'Accommodation');
      assert.match(o.itemOffered.containedInPlace['@id'], /#lodging$/);
      assert.equal(o.numberOfRooms, undefined); assert.equal(o.itemOffered.numberOfRooms, undefined);
      assert.match(o.url, lang === 'en' ? /\/en\/(lavilla|leloft|lelodge)$/ : /com\/(lavilla|leloft|lelodge)$/);
    }
    assert.deepEqual(entityGraphIssues(flatten(list), 'chambres-disponibles.html', m), []);
  }
});

test('garde entityGraphIssues : fiche sans alternateName, nœud maison sans parentOrganization, currenciesAccepted, page maison sans bloc autonome', () => {
  const org = m.buildLocalBusinessSchema('fr', 'd');
  assert.deepEqual(entityGraphIssues(flatten(org), 'tarifs.html', m), []);
  const bad = JSON.parse(JSON.stringify(org)); delete bad.alternateName; bad.department[0].parentOrganization = { '@id': 'x' }; bad.department[1].currenciesAccepted = 'EUR';
  const issues = entityGraphIssues(flatten(bad), 'tarifs.html', m);
  assert.ok(issues.some((i) => /alternateName D11/.test(i)) && issues.some((i) => /parentOrganization/.test(i)) && issues.some((i) => /currenciesAccepted/.test(i)), issues.join(' | '));
  const house = m.HOUSES[1];
  const page = [m.buildHouseLodgingNode(house, 'fr', { context: true }), org];
  assert.deepEqual(entityGraphIssues(flatten(page), 'leloft.html', m), []);
  assert.ok(entityGraphIssues(flatten([org]), 'leloft.html', m).some((i) => /0 bloc\(s\) LodgingBusiness autonome/.test(i)));
  assert.ok(entityGraphIssues(flatten([m.buildHouseLodgingNode(m.HOUSES[0], 'fr', { context: true }), org]), 'leloft.html', m).some((i) => /autonome/.test(i)), 'bloc d\'une autre maison = échec');
});

test('(L\'Appart, E2g) entityGraphIssues par lieu : le nœud de L\'Appart est reconnu (4 chambres) ; sa page porte son bloc autonome dès qu\'elle existe', () => {
  for (const lang of LANGS) {
    // Fiche de la marque telle que l'étape E5 la posera : les 3 maisons et L'Appart dans `department`.
    const org = m.buildLocalBusinessSchema(lang, 'd');
    const brand = { ...org, numberOfRooms: 33, department: [...org.department, m.buildAppartLodgingNode(lang)] };
    assert.deepEqual(entityGraphIssues(flatten(brand), 'tarifs.html', m), []);
    const wrong = JSON.parse(JSON.stringify(brand)); wrong.department[3].numberOfRooms = 5;
    assert.deepEqual(entityGraphIssues(flatten(wrong), 'tarifs.html', m), ['lappart : numberOfRooms=5 ≠ 4']);
    const orphan = JSON.parse(JSON.stringify(brand)); delete orphan.department[3].parentOrganization;
    assert.deepEqual(entityGraphIssues(flatten(orphan), 'tarifs.html', m), ['lappart : nœud #lodging sans parentOrganization @id de l\'entité']);
  }
  const node = m.buildAppartLodgingNode('fr', { context: true });
  const org = m.buildLocalBusinessSchema('fr', 'd');
  // Tant que L'Appart n'a pas de page (PLACE_PAGE_KEYS = les 3 maisons), rien n'est exigé sur lappart.html ; depuis l'étape E3
  // (13/11/2026), la valeur réelle l'exige.
  assert.deepEqual(entityGraphIssues(flatten([org]), 'lappart.html', { ...m, PLACE_PAGE_KEYS: m.MAISON_KEYS }), []);
  assert.deepEqual(entityGraphIssues(flatten([org]), 'lappart.html', m), ['0 bloc(s) LodgingBusiness autonome(s) du lieu lappart (attendu 1)']);
  // Dès l'étape E3 (PLACE_PAGE_KEYS = les 4 lieux) : exactement un bloc autonome de L'Appart, sur sa page FR et EN.
  const e3 = { ...m, PLACE_PAGE_KEYS: m.PLACE_KEYS };
  assert.deepEqual(entityGraphIssues(flatten([node, org]), 'lappart.html', e3), []);
  assert.deepEqual(entityGraphIssues(flatten([m.buildAppartLodgingNode('en', { context: true }), m.buildLocalBusinessSchema('en', 'd')]), 'en-lappart.html', e3), []);
  assert.deepEqual(entityGraphIssues(flatten([org]), 'lappart.html', e3), ['0 bloc(s) LodgingBusiness autonome(s) du lieu lappart (attendu 1)']);
  assert.deepEqual(entityGraphIssues(flatten([node, node, org]), 'lappart.html', e3), ['2 bloc(s) LodgingBusiness autonome(s) du lieu lappart (attendu 1)']);
  // Les pages des maisons, inchangées.
  assert.deepEqual(entityGraphIssues(flatten([m.buildHouseLodgingNode(m.HOUSES[1], 'fr', { context: true }), org]), 'leloft.html', e3), []);
});

test('L6.6 : NAP — nom, téléphone affiché et E.164 ; plus aucune adresse dans le code (13/11/2026 : base et documentation privée)', () => {
  assert.equal(m.LAVILLA_NAP.name, 'La Villa Coliving');
  assert.equal(m.LAVILLA_NAP.phoneE164.replace(/\s/g, ''), m.LAVILLA_NAP.phoneDisplay.replace(/\s/g, ''));
  assert.deepEqual(Object.keys(m.LAVILLA_NAP).sort(), ['email', 'name', 'phoneDisplay', 'phoneE164', 'url']);
  for (const h of m.HOUSES) assert.equal(Object.hasOwn(h, 'streetAddress'), false, `${h.slug} : HOUSES ne porte plus de rue`);
  // Aucune forme « numéro + voie » dans ce que le module expose aux pages (NAP, maisons, identité de l'organisation).
  assert.deepEqual(scanGenericAddresses(JSON.stringify([m.LAVILLA_NAP, m.HOUSES, m.ORG_IDENTITY])), []);
});
