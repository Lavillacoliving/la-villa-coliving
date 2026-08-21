import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractAnchors, classifyAnchor, mainText, segmentBody } from '../lib/html-links.mjs';

const HTML = `<!doctype html><html><head><title>t</title><link rel="alternate" hreflang="fr" href="/x"></head><body>
<header><nav><a href="/" class="text-[#1C1917] hover:text-[#44403C]">Accueil</a><a href="/tarifs" class="text-[#1C1917]">Tarifs</a></nav></header>
<main>
 <p>On parle de colocation à Annemasse et encore de colocation annemasse, sans lien. Voir <a class="text-[#D4A574] hover:underline" href="/blog/fiscalite-frontalier-geneve-impots-2026" data-discover="true">Impôt frontalier &amp; calcul</a>.</p>
 <a href="/candidature?src=bloc_offre&amp;article=x" class="inline-flex px-8 py-4 bg-[#D4A574] rounded-lg">Candidater</a>
 <a href="https://www.lavillacoliving.com/lelodge" class="group block bg-white border">Le Lodge</a>
 <a href="/blog/autre-article" class="group bg-white border">Article lié</a>
 <a href="/lavilla" class="text-[#D4A574] hover:underline" data-discover="true"><img alt="La Villa jardin" src="/i.webp"></a>
 <a href="https://www.ge.ch/permis" class="text-[#D4A574] hover:underline" target="_blank" rel="noopener noreferrer">Office cantonal</a>
 <a href="mailto:hello@lavillacoliving.com">mail</a>
 <a href="https://www.lavillacoliving.com/colocation-geneve/" class="text-[#D4A574] hover:underline">colocation à Genève</a>
</main>
<footer><nav><a href="/mentions-legales" class="text-[#A8A29E] hover:text-[#E0BB8A]">Mentions</a></nav></footer>
</body></html>`;

test('segmentation header/main/footer', () => {
  const s = segmentBody(HTML);
  assert.equal(s.ok, true);
  assert.ok(s.headerEnd < s.mainStart && s.mainStart < s.mainEnd && s.mainEnd < s.footerStart);
});

test('extraction : zones, sous-types, cibles, entités, externes', () => {
  const { anchors } = extractAnchors(HTML);
  const by = href => anchors.find(a => a.href === href);
  assert.equal(anchors.length, 11);
  assert.equal(by('/').zone, 'nav');
  assert.equal(by('/mentions-legales').zone, 'footer');
  const edi = by('/blog/fiscalite-frontalier-geneve-impots-2026');
  assert.equal(edi.zone, 'content'); assert.equal(edi.subtype, 'editorial'); assert.equal(edi.text, 'Impôt frontalier & calcul');
  const cta = by('/candidature?src=bloc_offre&article=x');
  assert.equal(cta.subtype, 'cta'); assert.equal(cta.target, '/candidature');
  assert.equal(by('https://www.lavillacoliving.com/lelodge').subtype, 'cards');
  assert.equal(by('https://www.lavillacoliving.com/lelodge').target, '/lelodge');
  assert.equal(by('/blog/autre-article').subtype, 'related');
  const img = by('/lavilla'); assert.equal(img.isImage, true); assert.equal(img.text, 'La Villa jardin');
  const ext = by('https://www.ge.ch/permis'); assert.equal(ext.external, true); assert.equal(ext.target, null);
  assert.equal(by('mailto:hello@lavillacoliving.com').target, null);
  const slash = by('https://www.lavillacoliving.com/colocation-geneve/');
  assert.equal(slash.target, '/colocation-geneve'); assert.ok(slash.issues.includes('trailing-slash'));
});

test('classification des ancres', () => {
  assert.equal(classifyAnchor('La Villa Coliving', '/'), 'marque');
  assert.equal(classifyAnchor('https://www.lavillacoliving.com/tarifs', '/tarifs'), 'url_nue');
  assert.equal(classifyAnchor('Colocation Annemasse', '/annemasse-colocation'), 'exact');
  assert.equal(classifyAnchor('voir la colocation à Annemasse', '/annemasse-colocation'), 'partiel');
  assert.equal(classifyAnchor('en savoir plus', '/annemasse-colocation'), 'generique');
  assert.equal(classifyAnchor('Le Lodge', '/lelodge'), 'exact');
  assert.equal(classifyAnchor('Le Lodge à Annemasse', '/annemasse-colocation'), 'marque');
  assert.equal(classifyAnchor('', '/x', undefined, { isImage: true }), 'image');
});

test('mainText : texte du <main> sans balises', () => {
  const t = mainText(HTML);
  assert.ok(t.includes('colocation à Annemasse'));
  assert.ok(!t.includes('Mentions'));
  assert.ok(!t.includes('<a'));
});
