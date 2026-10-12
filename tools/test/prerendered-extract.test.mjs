// Extraction des blocs JSON-LD du prérendu (scripts/lib/prerendered-extract.mjs) : origine Helmet vs pipeline (10/10/2026).
// L'injecteur ne remet data-react-helmet="true" que sur les blocs que react-helmet avait rendus ; un BreadcrumbList ajouté par
// scripts/prerender.mjs (sans attribut) doit rester sans attribut, sinon Helmet le retire du DOM après hydratation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractSeoTags, jsonLdBlocks, jsonLdContents } from '../../scripts/lib/prerendered-extract.mjs';

const HTML = `<!DOCTYPE html><html><head><title>t</title>
<script type="application/ld+json" data-react-helmet="true">{"@context":"https://schema.org","@type":"LocalBusiness","@id":"x#organization"}</script>
<script type="application/ld+json" data-react-helmet="true">{"@type":"FAQPage"}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[]}</script>
</head><body><div id="root"><p>${'x'.repeat(80)}</p><script type="application/ld+json">{"@type":"WebPage"}</script>
<script type="application/ld+json" data-react-helmet="true">{"@type":"FAQPage","dup":true}</script></div></body></html>`;

test('jsonLdBlocks : contenu + origine Helmet, dans l\'ordre du document', () => {
  const b = jsonLdBlocks(HTML);
  assert.deepEqual(b.map((x) => x.helmet), [true, true, false, false, true]);
  assert.deepEqual(jsonLdContents(HTML), b.map((x) => x.content));
});

test('extractSeoTags : jsonLdHelmet aligné sur jsonLd après dédoublonnage par @type', () => {
  const seo = extractSeoTags(HTML);
  const types = seo.jsonLd.map((c) => JSON.parse(c)['@type']);
  assert.deepEqual(types, ['LocalBusiness', 'FAQPage', 'BreadcrumbList', 'WebPage']);
  assert.deepEqual(seo.jsonLdHelmet, [true, true, false, false]);
  assert.equal(seo.jsonLd.length, seo.jsonLdHelmet.length);
});
