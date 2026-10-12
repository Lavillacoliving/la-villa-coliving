// Registre des marqueurs de contenu (src/lib/contentMarkers.ts, Lot L1 « ingénierie des créneaux », 10/2026), chargé
// par le même bundle esbuild que les gardes CI : une ligne SEULE `<!-- nom[:variante] -->`, lignes-commentaires
// retirées du rendu, jamais à travers plusieurs lignes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';

const m = await loadEntityFacts();

test('findContentMarkers : nom, variante, position ; indentation tolérée', () => {
  const md = 'Intro.\n\n<!-- entity-facts -->\n\nTexte.\n\n   <!--  ou-chercher:court  -->   \n\nFin.';
  const found = m.findContentMarkers(md);
  assert.equal(found.length, 2);
  assert.equal(found[0].name, 'entity-facts');
  assert.equal(found[0].variant, undefined);
  assert.equal(md.slice(found[0].index, found[0].index + found[0].length), '<!-- entity-facts -->');
  assert.equal(found[1].name, 'ou-chercher');
  assert.equal(found[1].variant, 'court');
  assert.equal(md.slice(found[1].index, found[1].index + found[1].length), '   <!--  ou-chercher:court  -->   ', 'la ligne entière (indentation comprise) est la coupe');
});

test('findContentMarkers : un commentaire inline, en majuscules ou à variante non alphabétique n\'est pas un marqueur', () => {
  assert.deepEqual(m.findContentMarkers('texte <!-- entity-facts --> suite'), []);
  assert.deepEqual(m.findContentMarkers('<!-- entity-facts --> suite'), []);
  assert.deepEqual(m.findContentMarkers('<!-- Entity-Facts -->'), [], 'minuscules seulement');
  assert.deepEqual(m.findContentMarkers('<!-- ou-chercher:v2 -->'), [], 'variante = lettres seulement');
});

test('isKnownMarker : registre et variantes', () => {
  assert.equal(m.isKnownMarker('entity-facts'), true);
  assert.equal(m.isKnownMarker('entity-facts', 'court'), false, 'entity-facts n\'a aucune variante');
  assert.equal(m.isKnownMarker('ou-chercher'), true);
  assert.equal(m.isKnownMarker('ou-chercher', 'court'), true);
  assert.equal(m.isKnownMarker('ou-chercher', 'long'), false);
  assert.equal(m.isKnownMarker('foo'), false);
  // Un marqueur inconnu a la forme d'un marqueur (trouvé) mais n'est pas dans le registre.
  const unknown = m.findContentMarkers('<!-- foo:bar -->');
  assert.equal(unknown.length, 1);
  assert.equal(m.isKnownMarker(unknown[0].name, unknown[0].variant), false);
  assert.deepEqual(Object.keys(m.KNOWN_MARKERS).sort(), ['entity-facts', 'ou-chercher']);
});

test('stripCommentLines / findCommentLines : toute ligne-commentaire, connue ou non, indentée ou non', () => {
  const md = 'A\n<!-- entity-facts -->\nB\n  <!-- note d\'auteur : à relire -->  \nC\n<!-- ou-chercher:court -->\nD';
  assert.equal(m.stripCommentLines(md), 'A\n\nB\n\nC\n\nD');
  const lines = m.findCommentLines(md);
  assert.equal(lines.length, 3);
  assert.equal(md.slice(lines[1].index, lines[1].index + lines[1].length), '  <!-- note d\'auteur : à relire -->  ');
});

test('stripCommentLines : un commentaire sur plusieurs lignes n\'est PAS retiré, ni un commentaire inline', () => {
  const multi = 'A\n<!-- début\nmilieu\nfin -->\nB';
  assert.equal(m.stripCommentLines(multi), multi);
  assert.deepEqual(m.findCommentLines(multi), []);
  const inline = 'A <!-- x --> B';
  assert.equal(m.stripCommentLines(inline), inline);
});

test('COMMENT_LINE_RE et CONTENT_MARKER_LINE_RE : miroirs exacts de scripts/lib/article-checks.mjs', async () => {
  const checks = await import('../../scripts/lib/article-checks.mjs');
  assert.equal(m.COMMENT_LINE_RE.source, checks.COMMENT_LINE_RE.source);
  assert.equal(m.CONTENT_MARKER_LINE_RE.source, checks.CONTENT_MARKER_LINE_RE.source);
  assert.deepEqual(m.KNOWN_MARKERS, checks.KNOWN_MARKERS);
});
