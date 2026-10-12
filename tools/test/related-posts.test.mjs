// Bloc « Articles connexes » (lot indexation du 08/10/2026, audit GSC EN-5) : src/lib/relatedPosts.ts,
// importé tel quel (Node 24 retire les types). Choix déterministe et couverture de tout le blog.
import test from 'node:test';
import assert from 'node:assert/strict';
import { fnv1a32, ringDistance, pickRelatedPosts } from '../../src/lib/relatedPosts.ts';

// Valeurs de référence FNV-1a 32 bits (vecteurs publiés par l'auteur de l'algorithme).
test('fnv1a32 : vecteurs de référence', () => {
  assert.equal(fnv1a32(''), 0x811c9dc5);
  assert.equal(fnv1a32('a'), 0xe40c292c);
  assert.equal(fnv1a32('foobar'), 0xbf9cf968);
});

test('ringDistance : entier non signé 32 bits, nul pour soi-même', () => {
  assert.equal(ringDistance('x', 'x'), 0);
  const d = ringDistance('article-a', 'article-b');
  assert.ok(Number.isInteger(d) && d >= 0 && d < 2 ** 32);
});

// Blog fictif : 3 catégories, dont une de 2 articles (cas coliving / community du vrai blog).
const POSTS = [
  ...Array.from({ length: 12 }, (_, i) => ({ slug: `conseil-${i}`, category: 'tips' })),
  ...Array.from({ length: 6 }, (_, i) => ({ slug: `geneve-${i}`, category: 'geneva' })),
  { slug: 'coliving-a', category: 'coliving' },
  { slug: 'coliving-b', category: 'coliving' },
];

test('3 articles, jamais l\'article courant, même catégorie d\'abord', () => {
  for (const p of POSTS) {
    const rel = pickRelatedPosts(p.slug, p.category, POSTS);
    assert.equal(rel.length, 3);
    assert.ok(!rel.some((r) => r.slug === p.slug));
    const sameCount = POSTS.filter((x) => x.category === p.category).length - 1;
    const expectedSame = Math.min(3, sameCount);
    assert.ok(rel.slice(0, expectedSame).every((r) => r.category === p.category), p.slug);
    assert.ok(rel.slice(expectedSame).every((r) => r.category !== p.category), p.slug);
  }
});

test('déterministe : l\'ordre des candidats (ordre Supabase) est indifférent', () => {
  const shuffled = [...POSTS].reverse();
  for (const p of POSTS) {
    assert.deepEqual(
      pickRelatedPosts(p.slug, p.category, POSTS).map((r) => r.slug),
      pickRelatedPosts(p.slug, p.category, shuffled).map((r) => r.slug),
    );
  }
});

test('couverture : chaque article reçoit min(3, n − 1) liens de sa catégorie', () => {
  const inbound = new Map(POSTS.map((p) => [p.slug, 0]));
  for (const p of POSTS) {
    for (const r of pickRelatedPosts(p.slug, p.category, POSTS)) {
      if (r.category === p.category) inbound.set(r.slug, inbound.get(r.slug) + 1);
    }
  }
  for (const p of POSTS) {
    const n = POSTS.filter((x) => x.category === p.category).length;
    assert.equal(inbound.get(p.slug), Math.min(3, n - 1), p.slug);
  }
});

test('l\'article courant absent de la liste (requête .neq(id)) : même résultat', () => {
  const p = POSTS[0];
  assert.deepEqual(
    pickRelatedPosts(p.slug, p.category, POSTS.filter((x) => x.slug !== p.slug)).map((r) => r.slug),
    pickRelatedPosts(p.slug, p.category, POSTS).map((r) => r.slug),
  );
});

test('les champs des candidats sont conservés (objets d\'origine)', () => {
  const rich = POSTS.map((p) => ({ ...p, id: `id-${p.slug}`, title_fr: p.slug.toUpperCase() }));
  const rel = pickRelatedPosts('conseil-0', 'tips', rich);
  assert.ok(rel.every((r) => rich.includes(r)));
});
