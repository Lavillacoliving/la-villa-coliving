-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa - SQL 4 - metas et posts Facebook : FORME D'EXECUTION EN SEANCE.
-- 10 substitutions sur 3 articles publies, regroupees en 3 UPDATE dans UN SEUL bloc DO (une instruction,
-- donc une transaction implicite). Memes ancres et memes textes que scripts/prix-chambres-7-8-sql4-metas-2026-11-13.sql (listes de
-- scripts/prix-chambres-7-8.edits.mjs) ; textes en UTF-8 lisible, chaque espace insecable ecrite chr(160) pour que le fichier voyage sans risque.
-- Garde d'entree = md5 de l'etat attendu avant ; garde de sortie = md5 de scripts/backups/prix-chambres-7-8-2026-11-13.attendu-apres.json.
-- Tout ou rien : au moindre ecart, l'exception annule tout le bloc.
-- A executer dans le meme creneau que la fusion de feat/prix-chambres-7-8 (sans effet sur les gardes du site).
-- Ecrit par un outil de la seance (hors depot) ; NON EXECUTE a la date du fichier.
-- ============================================================================
DO $seance$
DECLARE ecarts text;
BEGIN
  -- garde d'entree : les 3 articles sont publies et dans l'etat attendu avant ce SQL
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('coliving-geneve-frontaliers-guide-complet', 'debb7f9af119243f9d13e20c8a95652a', '9f5ad0c2f76ed6c6d32494e99ac7ca2f', 'e4cf2d9e5a7cb3351417663d340ac68f', '8c20b023a0effd80bdb0ec7625538473'),
    ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'da00ed1113a98da6ff21a09e7b398762', '86a85f001e18af762409ed99b257aa30', '92b7ac0b3a9a98dfc0e5972c6ad3e7f7', 'e05fb6d50bfb3eb1afdf8d2c45c9e7d4'),
    ('lodge-annemasse-coliving-premium-portes-geneve', 'a50ddcf4fb7413ed29e5aa93be805ae8', '9b3f9847c9a0ad116e07b357900382bb', '7777c9e8226f5e74c22d50e5b66a6396', '999f6b5d11ba1be376c98ae0b105cde6')
  ) AS e(slug, c0, c1, c2, c3) LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(coalesce(b.meta_description_fr, '')) <> e.c0 OR md5(coalesce(b.meta_description_en, '')) <> e.c1 OR md5(coalesce(b.facebook_post_fr, '')) <> e.c2 OR md5(coalesce(b.facebook_post_en, '')) <> e.c3 OR b.is_published IS NOT TRUE;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'prix-chambres-7-8 : la base n''est pas dans l''etat attendu avant ce SQL, rien n''est applique - %', ecarts; END IF;

  -- 1 article(s) - meta_description_fr : 1 - meta_description_en : 1 - facebook_post_fr : 1 - facebook_post_en : 1
  UPDATE public.blog_posts
  SET meta_description_fr = replace(meta_description_fr, ('près de Genève dès 1' || chr(160) || '370 CHF/mois.'), ('près de Genève dès 1' || chr(160) || '290 CHF/mois.')),
      meta_description_en = replace(meta_description_en, 'near Geneva from 1,370 CHF/month.', 'near Geneva from 1,290 CHF/month.'),
      facebook_post_fr = replace(facebook_post_fr, ('✨ dès 1' || chr(160) || '370 CHF/mois tout inclus'), ('✨ dès 1' || chr(160) || '290 CHF/mois tout inclus')),
      facebook_post_en = replace(facebook_post_en, '✨ from CHF 1,370/month all-inclusive', '✨ from CHF 1,290/month all-inclusive')
  WHERE slug IN ('coliving-geneve-frontaliers-guide-complet');

  -- 1 article(s) - meta_description_fr : 1 - meta_description_en : 1 - facebook_post_fr : 1 - facebook_post_en : 1
  UPDATE public.blog_posts
  SET meta_description_fr = replace(meta_description_fr, ('trajet 20 min, dès 1' || chr(160) || '370 CHF tout compris'), ('trajet 20 min, dès 1' || chr(160) || '290 CHF tout compris')),
      meta_description_en = replace(meta_description_en, '20-min commute, from 1,370 CHF all-inclusive', '20-min commute, from 1,290 CHF all-inclusive'),
      facebook_post_fr = replace(facebook_post_fr, ('✨ Dès 1' || chr(160) || '370 CHF/mois'), ('✨ Dès 1' || chr(160) || '290 CHF/mois')),
      facebook_post_en = replace(facebook_post_en, '✨ From CHF 1,370/month', '✨ From CHF 1,290/month')
  WHERE slug IN ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie');

  -- 1 article(s) - meta_description_fr : 0 - meta_description_en : 0 - facebook_post_fr : 1 - facebook_post_en : 1
  UPDATE public.blog_posts
  SET facebook_post_fr = replace(facebook_post_fr, ('tout compris dès 1' || chr(160) || '370 CHF/mois.'), ('tout compris à 1' || chr(160) || '430 CHF/mois.')),
      facebook_post_en = replace(facebook_post_en, 'all-inclusive from CHF 1,370/month.', 'all-inclusive at CHF 1,430/month.')
  WHERE slug IN ('lodge-annemasse-coliving-premium-portes-geneve');

  -- garde de sortie : les articles sont dans l'etat attendu, sinon tout est annule
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('coliving-geneve-frontaliers-guide-complet', '49e74e3d691d76ee9ecf7f14131def64', '18d68f6f9e636733dec845b20d682a53', '38c94b84959d3b97436c6a4dd638fae0', '9748ec1730f682b66ef4e2129e7729bd'),
    ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', '7b820acef18b129a6683b7b589500aa1', '822de73a7c7ba292138df0dbaede61dc', '901ade8f5796fa4ef06b47b4ba5d9ff5', '9a587565243d00eb3c69258b43a3abe7'),
    ('lodge-annemasse-coliving-premium-portes-geneve', 'a50ddcf4fb7413ed29e5aa93be805ae8', '9b3f9847c9a0ad116e07b357900382bb', '48a22573ac2b26060e59bf27110ab7ba', '76c59d6555f552ad075370379e1cb556')
  ) AS e(slug, c0, c1, c2, c3) LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(coalesce(b.meta_description_fr, '')) <> e.c0 OR md5(coalesce(b.meta_description_en, '')) <> e.c1 OR md5(coalesce(b.facebook_post_fr, '')) <> e.c2 OR md5(coalesce(b.facebook_post_en, '')) <> e.c3;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'prix-chambres-7-8 : l''etat obtenu n''est pas l''etat attendu, tout est annule - %', ecarts; END IF;
END
$seance$;
