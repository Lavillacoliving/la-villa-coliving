// Lot 1c (Brief Conversion V2, 29/08/2026) — patch Safari < 16.4 de
// mdast-util-gfm-autolink-literal : le littéral lookbehind de l'autolink email
// est remplacé (patch-package) par une construction gardée
// `try { new RegExp(lookbehind) } catch { repli sans lookbehind }`.
// Ces tests vérifient (1) que le patch est bien appliqué dans node_modules,
// (2) que l'autolink email fonctionne toujours via la vraie chaîne mdast,
// (3) que le repli sans lookbehind + la garde JS `previous()` acceptent et
// rejettent EXACTEMENT les mêmes emails que le lookbehind d'origine.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmAutolinkLiteral } from 'micromark-extension-gfm-autolink-literal';
import { gfmAutolinkLiteralFromMarkdown } from 'mdast-util-gfm-autolink-literal';
import { unicodePunctuation, unicodeWhitespace } from 'micromark-util-character';

const LIB = new URL(
  '../../node_modules/mdast-util-gfm-autolink-literal/lib/index.js',
  import.meta.url,
);

test('le patch est appliqué dans node_modules (sinon : npm install, qui rejoue patch-package)', () => {
  const src = readFileSync(LIB, 'utf8');
  assert.ok(src.includes('function emailRegex'), 'fabrique emailRegex absente — patch non appliqué');
  assert.ok(src.includes('[emailRegex(), findEmail]'), 'findEmail ne passe pas par la fabrique gardée');
  assert.ok(
    !src.includes('[/(?<='),
    'un littéral lookbehind subsiste dans le tableau findAndReplace — esbuild le reconvertirait en new RegExp cassé sur Safari 16.0-16.3',
  );
});

function parseLinks(md) {
  const tree = fromMarkdown(md, {
    extensions: [gfmAutolinkLiteral()],
    mdastExtensions: [gfmAutolinkLiteralFromMarkdown()],
  });
  const links = [];
  (function walk(node) {
    if (node.type === 'link') links.push(node.url);
    if (node.children) node.children.forEach(walk);
  })(tree);
  return links;
}

test('autolink email intact via la chaîne mdast réelle (chemin lookbehind sous Node)', () => {
  assert.deepEqual(parseLinks('Écris à jerome@lavillacoliving.com pour visiter.'), [
    'mailto:jerome@lavillacoliving.com',
  ]);
  assert.deepEqual(parseLinks('(contact : hello@la-villa.co.uk).'), [
    'mailto:hello@la-villa.co.uk',
  ]);
  // Précédé d'une lettre hors \w (é) : le tokenizer micromark (couche non
  // patchée) linke déjà noreply@… ; le transform mdast ignore les liens
  // existants. Comportement identique avant/après patch — on fige la réalité.
  assert.deepEqual(parseLinks('énoreply@example.com'), ['mailto:noreply@example.com']);
  // Label finissant par un tiret/chiffre : refusé par findEmail.
  assert.deepEqual(parseLinks('a b@c-'), []);
});

// Équivalence lookbehind ↔ (repli + garde previous) : mêmes patterns que la lib.
const WITH_LOOKBEHIND = () =>
  new RegExp('(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)', 'gu');
const FALLBACK = () => /([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/g;

// Réplique de previous(match, email=true) de la lib (lib/index.js).
function previousOk(input, index) {
  const code = input.charCodeAt(index - 1);
  return (
    (index === 0 || unicodeWhitespace(code) || unicodePunctuation(code)) &&
    code !== 47 // pas de slash avant un email
  );
}

function accepted(regexFactory, input, guarded) {
  const re = regexFactory();
  const out = [];
  let m;
  while ((m = re.exec(input)) !== null) {
    if (!guarded || previousOk(input, m.index)) out.push(`${m.index}:${m[1]}@${m[2]}`);
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  return out;
}

// Dans la lib, previous() s'applique aux DEUX chemins (findEmail l'appelle
// toujours) : l'équivalence à prouver est donc garde+repli ≡ garde+lookbehind.
test('le repli sans lookbehind + previous() accepte exactement les mêmes emails', () => {
  const corpus = [
    'jerome@lavillacoliving.com',
    'contact fanny@la-villa.fr et jerome@lavillacoliving.com',
    '(fanny@la-villa.fr)',
    'préfixé:éuser@example.com', // é avant : rejet des deux côtés
    'chemin/user@example.com', // slash avant : rejet des deux côtés
    'multi.part+tag@sub.domain-x.co',
    'fin de phrase user@ex.com.',
    'a@b', // pas de point dans le domaine : aucun match
    'tiret user@ex-com', // idem
    '«typo»mail@ex.com',
    '\tmail@ex.com après tabulation',
  ];
  for (const input of corpus) {
    assert.deepEqual(
      accepted(FALLBACK, input, true),
      accepted(WITH_LOOKBEHIND, input, true),
      `divergence lookbehind/repli sur : ${JSON.stringify(input)}`,
    );
  }
});
