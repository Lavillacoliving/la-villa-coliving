-- ════════════════════════════════════════════════════════════════════════
-- REVERT pilier /colocation-geneve (25/08/2026) — volet CONTENU (Supabase blog_posts)
-- Inverse de scripts/maillage-contenus-vers-article-elu.sql (07/07/2026).
--
-- Côté code (branche feat/pilier-revert) : 308 retiré, pilier FR servi en 200,
-- navbar/footer/pages reviennent sur le pilier. Ce SQL ramène les ancres des
-- ARTICLES (base) de l'article élu vers le pilier — « consolidation totale du
-- maillage sur le vainqueur » (CONFRONTATION 03/08, D5).
--
-- ⚠️ À exécuter APRÈS le merge/déploiement du revert (sinon les liens bouclent
--    sur la 308 encore active). Réexécutable (no-op si déjà appliqué).
-- ⚠️ NE PAS toucher l'article élu lui-même : ses 3 liens vers /nos-maisons
--    (consolidation 07/07) restent valides — on ne les ramène pas.
-- Ancres REPLACE 100 % ASCII (pattern éprouvé anti-mojibake).
-- ════════════════════════════════════════════════════════════════════════

-- 0. Aperçu : quels articles FR pointent vers l'article élu ?
SELECT slug,
       (LENGTH(content_fr) - LENGTH(REPLACE(content_fr, '](/blog/trouver-colocation-geneve-frontalier)', ''))) / LENGTH('](/blog/trouver-colocation-geneve-frontalier)') AS nb_liens
FROM blog_posts
WHERE content_fr LIKE '%](/blog/trouver-colocation-geneve-frontalier)%'
  AND slug <> 'trouver-colocation-geneve-frontalier'
ORDER BY nb_liens DESC;

-- 1. Retour des ancres vers le pilier FR (hors l'article lui-même)
UPDATE blog_posts
SET content_fr = REPLACE(content_fr, '](/blog/trouver-colocation-geneve-frontalier)', '](/colocation-geneve)'),
    updated_at = NOW()
WHERE content_fr LIKE '%](/blog/trouver-colocation-geneve-frontalier)%'
  AND slug <> 'trouver-colocation-geneve-frontalier';

-- 2. Vérifications
SELECT
  (SELECT COUNT(*) FROM blog_posts WHERE content_fr LIKE '%](/blog/trouver-colocation-geneve-frontalier)%' AND slug <> 'trouver-colocation-geneve-frontalier') AS fr_restants_vers_elu_doit_etre_0,
  (SELECT COUNT(*) FROM blog_posts WHERE content_fr LIKE '%](/colocation-geneve)%') AS fr_pointant_vers_pilier,
  (SELECT COUNT(*) FROM blog_posts WHERE content_en LIKE '%](/en/colocation-geneve)%') AS en_pilier_inchange;
