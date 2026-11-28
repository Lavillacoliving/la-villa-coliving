// Garde « Offer contradictoires » de check-entity-facts (08/10/2026) : /colocation-geneve servait, selon le
// run du bot, l'Offer InStock ou l'Offer PreOrder laissé par une instance react-helmet fantôme
// (scripts/inject-prerendered.mjs ne sert que le premier bloc de chaque @type).
import test from 'node:test';
import assert from 'node:assert/strict';
import { jsonLdConflicts } from '../../scripts/check-entity-facts.mjs';
import { extractSeoTags } from '../../scripts/lib/prerendered-extract.mjs';

const ld = (obj) => `<script type="application/ld+json" data-react-helmet="true">${JSON.stringify(obj)}</script>`;
const page = (...blocks) => `<html><head><title>t</title>${blocks.join('')}</head><body><div id="root"></div></body></html>`;
const offer = (availability, extra = {}) => ({ '@context': 'https://schema.org', '@type': 'Offer', price: '1370', priceCurrency: 'CHF', availability: `https://schema.org/${availability}`, ...extra });
const localBusiness = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'La Villa Coliving', offers: { '@type': 'AggregateOffer', lowPrice: 1370, highPrice: 1430, availability: 'https://schema.org/InStock' } };

test('Offer InStock + Offer PreOrder (cas /colocation-geneve des bots 1a6b23c, be9640a…) : échec', () => {
  const html = page(ld(localBusiness), ld(offer('PreOrder')), ld({ '@type': 'WebPage' }), ld(offer('InStock')));
  const { failures, warnings } = jsonLdConflicts(html);
  assert.equal(failures.length, 1);
  assert.match(failures[0], /disponibilité contradictoire \(PreOrder \/ InStock\)/);
  assert.deepEqual(warnings, []);
  // Ce que l'injection sert : le premier Offer seulement — d'où le clignotement d'un run à l'autre.
  assert.equal(extractSeoTags(html).jsonLd.filter((j) => j.includes('"@type":"Offer"')).length, 1);
});

test('un seul Offer de premier niveau, AggregateOffer imbriqué dans le LocalBusiness : rien à signaler', () => {
  assert.deepEqual(jsonLdConflicts(page(ld(localBusiness), ld(offer('PreOrder')))), { failures: [], warnings: [] });
  assert.deepEqual(jsonLdConflicts(page(ld(localBusiness), ld(offer('InStock')))), { failures: [], warnings: [] });
});

test('page sans Offer (chambres non chargées) : rien à signaler', () => {
  assert.deepEqual(jsonLdConflicts(page(ld(localBusiness), ld({ '@type': 'WebPage' }))), { failures: [], warnings: [] });
});

test('ItemList de /chambres-disponibles : offres imbriquées InStock et PreOrder légitimes', () => {
  const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: [
    { '@type': 'ListItem', position: 1, item: offer('InStock') },
    { '@type': 'ListItem', position: 2, item: offer('PreOrder', { availabilityStarts: '2026-11-01' }) },
  ] };
  assert.deepEqual(jsonLdConflicts(page(ld(localBusiness), ld(itemList))), { failures: [], warnings: [] });
});

test('deux blocs Offer identiques (dédoublonnés sans perte par l\'injection) : rien à signaler', () => {
  assert.deepEqual(jsonLdConflicts(page(ld(offer('InStock')), ld(offer('InStock')))), { failures: [], warnings: [] });
});

test('deux Offer de même disponibilité mais au contenu différent (prix) : échec', () => {
  const { failures } = jsonLdConflicts(page(ld(offer('InStock')), ld(offer('InStock', { price: '1430' }))));
  assert.equal(failures.length, 1);
  assert.match(failures[0], /2 blocs JSON-LD « Offer » différents/);
});

test('Offer et AggregateOffer de premier niveau contradictoires (deux @type, tous deux servis) : échec', () => {
  const agg = { '@context': 'https://schema.org', '@type': 'AggregateOffer', lowPrice: 1370, highPrice: 1430, availability: 'https://schema.org/InStock' };
  const { failures } = jsonLdConflicts(page(ld(agg), ld(offer('PreOrder'))));
  assert.equal(failures.length, 1);
  assert.match(failures[0], /InStock \/ PreOrder/);
});

// (28/11/2026) Cas réel : public/prerendered/colocation-geneve.html du bot 4cf95f81e (ordre LocalBusiness, WebPage, FAQPage,
// Offer, WebPage, BreadcrumbList) — WebPage fantôme au repli éditorial, puis celui à la date de l'inventaire.
const webPage = (dateModified) => ({ '@context': 'https://schema.org', '@type': 'WebPage', url: 'https://www.lavillacoliving.com/colocation-geneve', inLanguage: 'fr', datePublished: '2026-02-17', dateModified });

test('deux WebPage différents (cas /colocation-geneve du 10 au 28/11/2026) : échec, et l\'injection servait le premier', () => {
  const html = page(ld(localBusiness), ld(webPage('2026-09-04')), ld({ '@type': 'FAQPage' }), ld(offer('InStock')), ld(webPage('2026-11-24')));
  const { failures, warnings } = jsonLdConflicts(html);
  assert.equal(failures.length, 1);
  assert.match(failures[0], /2 blocs JSON-LD « WebPage » différents/);
  assert.deepEqual(warnings, []);
  const served = extractSeoTags(html).jsonLd.filter((j) => j.includes('"@type":"WebPage"'));
  assert.equal(served.length, 1);
  assert.match(served[0], /"dateModified":"2026-09-04"/);
});

test('un seul WebPage, ou deux WebPage identiques (servis une fois, sans perte) : rien à signaler', () => {
  assert.deepEqual(jsonLdConflicts(page(ld(localBusiness), ld(webPage('2026-11-24')), ld(offer('InStock')))), { failures: [], warnings: [] });
  assert.deepEqual(jsonLdConflicts(page(ld(webPage('2026-11-24')), ld(webPage('2026-11-24')))), { failures: [], warnings: [] });
});

test('deux blocs différents de tout autre @type : échec', () => {
  const { failures, warnings } = jsonLdConflicts(page(ld({ '@type': 'FAQPage', name: 'a' }), ld({ '@type': 'FAQPage', name: 'b' })));
  assert.equal(failures.length, 1);
  assert.match(failures[0], /« FAQPage »/);
  assert.deepEqual(warnings, []);
});
