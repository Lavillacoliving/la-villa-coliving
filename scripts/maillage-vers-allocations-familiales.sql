-- ════════════════════════════════════════════════════════════════════════
-- Maillage vers l'article #5 (allocations familiales) — il recevait 0 lien
-- 3 liens FR + 3 EN depuis les contextes « famille » de #1, #2, #3.
-- Ancrages robustes : URLs ASCII pures (leçon des REPLACE ratés).
-- Arguments en dollar-quoting pour éviter tout bug d'apostrophe.
-- ════════════════════════════════════════════════════════════════════════

-- ── #1 Salaire — FAQ "100 000 CHF" : après la mention conjoint/enfants
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  $a$700 CHF/mois de plus.$a$,
  $b$700 CHF/mois de plus. Et pour tes droits famille, vois notre [guide allocations familiales frontalier](/blog/allocations-familiales-frontalier-geneve-2026).$b$
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  $a$add 400 to 700 CHF/month.$a$,
  $b$add 400 to 700 CHF/month. For your family entitlements, see our [frontalier family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026).$b$
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- ── #2 École — liste "Pour aller plus loin" (FR) : nouvelle ligne
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  $a$(/blog/cout-transport-frontalier-geneve-2026)$a$,
  $b$(/blog/cout-transport-frontalier-geneve-2026)
- [Allocations familiales frontalier : le guide 2026](/blog/allocations-familiales-frontalier-geneve-2026)$b$
) WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter';

-- ── #2 École — section budget (EN) : lien enchaîné au guide salaire
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  $a$guide](/en/blog/salaire-suisse-net-frontalier-2026).$a$,
  $b$guide](/en/blog/salaire-suisse-net-frontalier-2026) and our [frontalier family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026).$b$
) WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter';

-- ── #3 Coût de la vie — FAQ famille : après la conclusion de la réponse
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  $a$se loge en France.$a$,
  $b$se loge en France. Et compte les [allocations familiales frontalier](/blog/allocations-familiales-frontalier-geneve-2026) : 311 CHF/enfant dès le premier à Genève.$b$
) WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';

UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  $a$as long as you live in France.$a$,
  $b$as long as you live in France. And count [frontalier family allowances](/en/blog/allocations-familiales-frontalier-geneve-2026): CHF 311/child from the first in Geneva.$b$
) WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';

-- Touch updated_at
UPDATE blog_posts SET updated_at = NOW()
WHERE slug IN ('salaire-suisse-net-frontalier-2026','ecole-internationale-geneve-frontalier-ou-habiter','cout-de-la-vie-suisse-france-frontalier-2026');

-- Vérification : chaque article doit contenir le lien (FR et EN)
SELECT slug,
  (content_fr LIKE '%(/blog/allocations-familiales-frontalier-geneve-2026)%')     AS lien_fr_ok,
  (content_en LIKE '%(/en/blog/allocations-familiales-frontalier-geneve-2026)%')  AS lien_en_ok
FROM blog_posts
WHERE slug IN ('salaire-suisse-net-frontalier-2026','ecole-internationale-geneve-frontalier-ou-habiter','cout-de-la-vie-suisse-france-frontalier-2026')
ORDER BY slug;
