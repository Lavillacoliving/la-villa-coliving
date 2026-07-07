-- ════════════════════════════════════════════════════════════════════════
-- Maillage CONTENUS → article élu (complément débrief 07/07, §coliving-frais-dossier)
--
-- Les ancres « colocation Genève » DANS les contenus d'articles (base
-- Supabase) pointaient encore vers /colocation-geneve (redirigé 308).
-- Elles passent en direct vers l'article élu — dont coliving-frais-dossier,
-- explicitement cité au complément. FR uniquement : les contenus EN pointent
-- vers /en/colocation-geneve, le pilier EN conservé (200).
--
-- Sans effet sur trouver-colocation lui-même (ses liens ont déjà été
-- reroutés vers /nos-maisons par la consolidation — 0 occurrence restante).
-- Ancre 100 % ASCII. Réexécutable sans risque (no-op si déjà appliqué).
-- ════════════════════════════════════════════════════════════════════════

-- État avant (pour info) : combien d'articles FR portent encore l'ancienne cible ?
SELECT COUNT(*) AS articles_fr_a_rerouter
FROM blog_posts
WHERE content_fr LIKE '%](/colocation-geneve)%';

UPDATE blog_posts
SET content_fr = REPLACE(content_fr, '](/colocation-geneve)', '](/blog/trouver-colocation-geneve-frontalier)'),
    updated_at = NOW()
WHERE content_fr LIKE '%](/colocation-geneve)%';

-- Vérifications
SELECT
  (SELECT COUNT(*) FROM blog_posts WHERE content_fr LIKE '%](/colocation-geneve)%')  AS fr_restants_doit_etre_0,
  (SELECT COUNT(*) FROM blog_posts WHERE content_fr LIKE '%](/blog/trouver-colocation-geneve-frontalier)%') AS fr_pointant_vers_elu,
  (SELECT COUNT(*) FROM blog_posts WHERE content_en LIKE '%](/en/colocation-geneve)%') AS en_pilier_conserve,
  (SELECT content_fr LIKE '%](/blog/trouver-colocation-geneve-frontalier)%'
     FROM blog_posts WHERE slug = 'coliving-frais-dossier-geneve-annemasse') AS frais_dossier_maille_ok;
