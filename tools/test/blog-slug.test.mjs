// Slug d'article du dashboard (audit indexation 07/10/2026). Import direct du module TS : Node 24 retire les types.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  normalizeBlogSlug, isValidBlogSlug, blogSlugRedirectCommand, checkBlogSlugChange, isBlogSlugLockedByCode, postsLinkingToSlug,
} from '../../src/lib/blogSlug.ts';

test('normalizeBlogSlug : accents, majuscules, espaces, ponctuation, tirets fusionnés et rognés', () => {
  assert.equal(normalizeBlogSlug('vivre-a-annemasse-quand-on-travaille-a-genève'), 'vivre-a-annemasse-quand-on-travaille-a-geneve');
  assert.equal(normalizeBlogSlug('  Vivre à Annemasse, quand on travaille à Genève !  '), 'vivre-a-annemasse-quand-on-travaille-a-geneve');
  assert.equal(normalizeBlogSlug("L'été à Ville-la-Grand -- 2026"), 'l-ete-a-ville-la-grand-2026');
  assert.equal(normalizeBlogSlug('Cœur_de_Genève/Œuvre'), 'coeur-de-geneve-oeuvre');
  assert.equal(normalizeBlogSlug('---déjà--propre---'), 'deja-propre');
  assert.equal(normalizeBlogSlug('Ça coûte 1 370 CHF'), 'ca-coute-1-370-chf');
  assert.equal(normalizeBlogSlug('!!!'), '');
  assert.equal(normalizeBlogSlug('budget-colocation-geneve-guide-complet'), 'budget-colocation-geneve-guide-complet');
  // Forme décomposée (NFD saisie telle quelle : e + U+0301) et accent seul.
  assert.equal(normalizeBlogSlug('gene\u0300ve'), 'geneve');
  assert.equal(normalizeBlogSlug('\u0301'), '');
});

test('normalizeBlogSlug : la plage des diacritiques est écrite en échappements lisibles, pas en caractères combinants', () => {
  const src = readFileSync(new URL('../../src/lib/blogSlug.ts', import.meta.url), 'utf8');
  assert.ok(src.includes('[\\u0300-\\u036f]'), 'plage \\u0300-\\u036f attendue en clair');
  assert.ok(!/[\u0300-\u036f]/.test(src), 'aucun caractère combinant littéral dans le source');
});

test('isValidBlogSlug : format ^[a-z0-9]+(-[a-z0-9]+)*$', () => {
  for (const ok of ['a', 'permis-g-frontalier-geneve', 'cout-transport-frontalier-geneve-2026']) assert.ok(isValidBlogSlug(ok), ok);
  for (const ko of ['', '-a', 'a-', 'a--b', 'A-b', 'genève', 'a b', 'a/b', 'a_b']) assert.ok(!isValidBlogSlug(ko), ko);
});

test('checkBlogSlugChange : inchangé, invalide, figé par le code, renommage brouillon / publié / ancien slug hors format', () => {
  assert.deepEqual(checkBlogSlugChange('Mon Article', 'mon-article', true), { kind: 'unchanged', slug: 'mon-article' });
  assert.deepEqual(checkBlogSlugChange('???', 'mon-article', true), { kind: 'invalid', slug: '' });
  assert.deepEqual(checkBlogSlugChange('Nouveau titre', 'mon-article', false), { kind: 'rename', slug: 'nouveau-titre', redirect: 'none', redirectCommand: null });
  assert.deepEqual(checkBlogSlugChange('nouveau-titre', 'mon-article', true), {
    kind: 'rename', slug: 'nouveau-titre', redirect: 'command', redirectCommand: 'node scripts/redirects.mjs --add /blog/mon-article /blog/nouveau-titre',
  });
  // Ancien slug hérité hors format : pas de commande (source à percent-encoder, caractères shell possibles).
  assert.deepEqual(checkBlogSlugChange('propre', "l'été à genève", true), { kind: 'rename', slug: 'propre', redirect: 'manual', redirectCommand: null });
  // Figé par le code : refusé, même en brouillon ; ressaisir le même slug reste « inchangé ».
  assert.deepEqual(checkBlogSlugChange('autre', 'trouver-colocation-geneve-frontalier', true, true), { kind: 'locked', slug: 'trouver-colocation-geneve-frontalier' });
  assert.deepEqual(checkBlogSlugChange('autre', 'page-decision', false, true), { kind: 'locked', slug: 'page-decision' });
  assert.deepEqual(checkBlogSlugChange('Page Decision', 'page-decision', true, true), { kind: 'unchanged', slug: 'page-decision' });
  assert.equal(blogSlugRedirectCommand('a', 'b'), 'node scripts/redirects.mjs --add /blog/a /blog/b');
});

test('isBlogSlugLockedByCode : slug cité par le code ou marqueur <!-- entity-facts --> dans le markdown', () => {
  const locked = new Set(['trouver-colocation-geneve-frontalier']);
  assert.ok(isBlogSlugLockedByCode('trouver-colocation-geneve-frontalier', ['texte'], locked));
  assert.ok(isBlogSlugLockedByCode('page-decision', ['intro\n\n<!-- entity-facts -->\n\n## Suite', null], locked));
  assert.ok(isBlogSlugLockedByCode('page-decision', [null, '<!--entity-facts-->'], locked));
  assert.ok(!isBlogSlugLockedByCode('article-libre', ['texte', null, undefined], locked));
});

test('postsLinkingToSlug : liens relatifs, absolus et /en, sans faux positif sur un slug plus long', () => {
  const posts = [
    { id: '1', slug: 'cible', content_fr: 'voir [ici](/blog/cible).', content_en: null },
    { id: '2', slug: 'b', content_fr: 'x', content_en: 'see [it](https://www.lavillacoliving.com/en/blog/cible#faq)' },
    { id: '3', slug: 'c', content_fr: '[autre](/blog/cible-2026) et [liste](/blog)', content_en: null },
    { id: '4', slug: 'd', content_fr: '[q](/blog/cible?src=x)', content_en: undefined },
  ];
  assert.deepEqual(postsLinkingToSlug(posts, 'cible', '1').map((p) => p.id), ['2', '4']);
  assert.deepEqual(postsLinkingToSlug(posts, 'cible').map((p) => p.id), ['1', '2', '4']);
});
