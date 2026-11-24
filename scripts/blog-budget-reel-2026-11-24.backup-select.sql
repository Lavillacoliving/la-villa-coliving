-- ============================================================================
-- Sauvegarde AVANT écriture — lecture seule (SELECT). Lot 4 « budget réel » + G3 — généré le 2026-11-24T15:42:00.865Z par scripts/blog-budget-reel.mjs.
-- À exécuter juste AVANT blog-budget-reel-2026-11-24.sql, après le GO de Jérôme. Enregistrer le résultat COMPLET (une ligne par article ;
-- colonne « ligne » = la ligne entière en JSON) dans un fichier daté, hors du site public — modèle du dépôt :
-- scripts/backups/blog-budget-reel-2026-11-24.avant.json (comme scripts/backups/a1-alignement-2026-11-02.avant.json).
-- « etat_conforme » doit valoir true sur chaque ligne : les champs sont ceux de l'essai à blanc. Sinon, ne pas écrire.
-- ============================================================================
SELECT b.slug, now() AS sauvegarde_le, b.updated_at, b.read_time_min,
       CASE b.slug
         WHEN 'budget-colocation-geneve-guide-complet' THEN md5(b.content_fr) = '6aae6eef3e2ad75f6485ded6fd34c1b3' AND md5(b.content_en) = 'b636768861c9af236969ee1f750876d9' AND md5(b.meta_description_fr) = '813f1cc2af8eb4378625b213d7f46ae3' AND md5(b.meta_description_en) = 'bc5ed456d639bc0307aa473bc557da05'
         WHEN 'coliving-communaute-reels-amis-geneve-annemasse' THEN md5(b.content_fr) = '41d9520cef0ab51cb0d86d8ff2e4351f' AND md5(b.content_en) = '6d366ced1018ffb005478796d7f1d3f2'
         WHEN 'guide-ressources-frontalier-geneve' THEN md5(b.content_fr) = 'e0374d23d1d65f565a3d64ecee0efc0f' AND md5(b.content_en) = '1f99bba7865030ecaca3e2132406c5b1'
         WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN md5(b.content_fr) = 'c611f41f82d024a47848dc530ef459d7' AND md5(b.content_en) = '96bcbe9ef34878095f42c08db303f368'
         WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN md5(b.content_fr) = '924a4f7f5443ef3cfe87a85433d014ad' AND md5(b.content_en) = '643d425fe71611f4747c03bfd929259f'
       END AS etat_conforme,
       md5(b.content_fr) AS md5_content_fr, md5(b.content_en) AS md5_content_en,
       md5(b.meta_description_fr) AS md5_meta_description_fr, md5(b.meta_description_en) AS md5_meta_description_en,
       to_jsonb(b) AS ligne
FROM public.blog_posts b
WHERE b.slug IN ('budget-colocation-geneve-guide-complet', 'coliving-communaute-reels-amis-geneve-annemasse', 'guide-ressources-frontalier-geneve', 'lodge-annemasse-coliving-premium-portes-geneve', 'quartiers-annemasse-ou-vivre-selon-profil')
ORDER BY b.slug;
