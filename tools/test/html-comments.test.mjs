import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripAuthoringComments, isReactMarker } from '../../scripts/lib/html-comments.mjs';

test('marqueurs React reconnus', () => {
  for (const m of ['$', '/$', '$?', '$!', '&', '/&', ' ']) assert.equal(isReactMarker(m), true, m);
  for (const m of ['', '  ', ' Google tag ', 'Favicon', '$$', 'x']) assert.equal(isReactMarker(m), false, JSON.stringify(m));
});

test('head : tous les commentaires partent, y compris multi-lignes ; les balises restent', () => {
  const html = `<!doctype html><html><head>\n    <!-- Google tag (gtag.js) -->\n    <script src="g.js"></script>\n    <!-- Microsoft Clarity — INTÉGRATION TEMPORAIRE (24/08/2026)\n      ligne 2\n      ligne 3 -->\n    <meta name="description" content="x" />\n    <!-- Favicon -->\n  </head><body><div id="root"><div><header>h</header><!--$--><main>a<!-- -->b</main><!--/$--><footer>f</footer></div></div></body></html>`;
  const out = stripAuthoringComments(html);
  assert.ok(!out.includes('Google tag'));
  assert.ok(!out.includes('Clarity'));
  assert.ok(!out.includes('Favicon'));
  assert.ok(out.includes('<script src="g.js"></script>'));
  assert.ok(out.includes('<meta name="description" content="x" />'));
  assert.ok(out.includes('<!--$--><main>a<!-- -->b</main><!--/$-->'), 'marqueurs React conservés');
});

test('body : commentaire d\'auteur retiré, marqueurs conservés, sans head', () => {
  const html = `<div><!-- note dev --><p>x</p><!--$?--><!--$!--><!--&--><!--/&--></div>`;
  assert.equal(stripAuthoringComments(html), '<div><p>x</p><!--$?--><!--$!--><!--&--><!--/&--></div>');
});

test('sans commentaire : identique', () => {
  const html = '<html><head></head><body>ok</body></html>';
  assert.equal(stripAuthoringComments(html), html);
});
