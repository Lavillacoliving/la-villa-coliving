-- ════════════════════════════════════════════════════════════════════════
-- 09 — DÉPUBLICATION des 9 articles sources (DERNIÈRE étape SQL avant le rebuild)
-- ────────────────────────────────────────────────────────────────────────
-- À LANCER APRÈS 01→08 (fusion du contenu + maillage interne) et SEULEMENT
-- une fois que tu as vérifié que les piliers ont bien absorbé le contenu.
--
-- Effet : is_published = false → au prochain prerender, ces slugs sortent
-- automatiquement du sitemap, des rewrites vercel.json et des fichiers
-- prerendered/. Les 301 (déjà dans vercel.json, voir 11-vercel) prennent le relais.
--
-- ⚠️ On DÉPUBLIE, on ne SUPPRIME PAS (pas de DELETE) : garder ces lignes en
--    brouillon permet de récupérer le contenu en cas de besoin (cf. l'orphelin
--    annemasse-…-guide-complet qui, lui, avait été supprimé).
-- ⚠️ À lancer AVANT le rebuild (sinon le prerender les régénère).
-- Projet Supabase : tefpynkdxxfiefpkgitz  (vérifie le projet en haut à gauche)
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts SET is_published = false, updated_at = now()
WHERE slug IN (
  'loyer-frontalier-geneve-combien-payer',            -- → budget-colocation-geneve-guide-complet
  'studio-geneve-vs-colocation-france-budget',        -- → budget-colocation-geneve-guide-complet
  'economies-coliving-tout-inclus-geneve',            -- → budget-colocation-geneve-guide-complet
  'meilleurs-quartiers-frontaliers-geneve',           -- → ou-habiter-frontalier-suisse-villes-france-pas-cher
  'chambre-meublee-annemasse-geneve',                 -- → colocation-annemasse-ville-la-grand-ambilly
  'temps-trajet-annemasse-geneve-par-quartier',       -- → transport-annemasse-geneve-leman-express
  'geneve-sans-voiture-mobilite-douce-frontaliers',   -- → transport-annemasse-geneve-leman-express
  'arriver-seul-geneve-guide-30-jours',               -- → demenager-geneve-frontalier-checklist
  '5-erreurs-logement-frontalier-geneve'              -- → arnaques-logement-frontalier-geneve-eviter
);

-- ─── Contrôle : les 9 doivent être false ───
SELECT slug, is_published, updated_at FROM blog_posts
WHERE slug IN (
  'loyer-frontalier-geneve-combien-payer','studio-geneve-vs-colocation-france-budget',
  'economies-coliving-tout-inclus-geneve','meilleurs-quartiers-frontaliers-geneve',
  'chambre-meublee-annemasse-geneve','temps-trajet-annemasse-geneve-par-quartier',
  'geneve-sans-voiture-mobilite-douce-frontaliers','arriver-seul-geneve-guide-30-jours',
  '5-erreurs-logement-frontalier-geneve'
) ORDER BY is_published, slug;

-- ─── Contrôle global : il doit rester 32 articles publiés (41 − 9) ───
SELECT count(*) AS articles_publies FROM blog_posts WHERE is_published = true;
