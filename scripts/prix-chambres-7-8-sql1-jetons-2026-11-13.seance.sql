-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa - SQL 1 - jetons " des " : FORME D'EXECUTION EN SEANCE.
-- 100 substitutions sur 36 articles publies, regroupees en 15 UPDATE dans UN SEUL bloc DO (une instruction,
-- donc une transaction implicite). Memes ancres et memes textes que scripts/prix-chambres-7-8-sql1-jetons-2026-11-13.sql (listes de
-- scripts/prix-chambres-7-8.edits.mjs) ; textes en UTF-8 lisible, chaque espace insecable ecrite chr(160) pour que le fichier voyage sans risque.
-- Garde d'entree = md5 de l'etat attendu avant ; garde de sortie = md5 de scripts/backups/prix-chambres-7-8-2026-11-13.attendu-apres.json.
-- Tout ou rien : au moindre ecart, l'exception annule tout le bloc.
-- Peut etre execute AVANT la mise en ligne du code (le site connait deja {{PRIX_DES}}) ; au plus tard juste avant le SQL 3.
-- Ecrit par un outil de la seance (hors depot) ; NON EXECUTE a la date du fichier.
-- ============================================================================
DO $seance$
DECLARE ecarts text;
BEGIN
  -- garde d'entree : les 36 articles sont publies et dans l'etat attendu avant ce SQL
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('allocations-familiales-frontalier-geneve-2026', '498125f1071094ac5821407b1f48fc64', '3916990ac6a85b5955e887567ff9241a'),
    ('arnaques-logement-frontalier-geneve-eviter', 'decab98e498573ec8fc89bda541a7965', '2a21f34e0fbf2b83e5456d269528e2d2'),
    ('assurance-sante-frontalier-lamal-cmu-budget', '8d6a3cf91d96541e836316f4c1faeab2', '5043b66f0e4864fa50dd9fb444af6be9'),
    ('banque-telephone-internet-frontalier-bons-plans', '2e4fe88dc026233ec694b841d7d6380c', '791ff9a68ebe98fb79428887db8acd36'),
    ('budget-colocation-geneve-guide-complet', '5636302ac33ba16a8df57c7ffce746a1', 'ce9883a02a7b7c1303428b72fd67655c'),
    ('choc-culturel-franco-suisse-expatrie-geneve', 'd041ed1ec207749463eaaccc5305fa72', 'b983aaf83e0416c180f43470244a5a46'),
    ('coliving-annemasse-geneve-frontaliers-avantages', 'b5aff1db4bc19409e0694dd5aafbb0d3', '8b49f2e6a92054d0585dab932417bf2a'),
    ('coliving-communaute-reels-amis-geneve-annemasse', 'b71b1dda649a6643eaa1d4a265cb6c45', '172e9e4ed5bbb2da66e32a2d18b3c2f2'),
    ('coliving-frais-dossier-geneve-annemasse', '6c584eb1c666a3757759150216e89863', 'eceea3cfbf314cbd28849509b1a7c330'),
    ('coliving-geneve-frontaliers-guide-complet', '94669bd75e3e5ebf8674cf3fff218541', '2e22c24cd1444c1cd67e8b1680934728'),
    ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', '3bbf0a7592e8267fef85c61caf85647c', '92358e745e252add58daf0b833826c4d'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'e2759aaf33a777bedb35aa89489baab1', '49c29be53292ab634801a6516d00c1ae'),
    ('cout-de-la-vie-suisse-france-frontalier-2026', '551a233f45e3fa68b7458499f29da75d', '7521631a936fbf4d9e0bd41e295c0cf3'),
    ('cout-transport-frontalier-geneve-2026', 'f0058ecc34ffe115e995ba2453142467', '00fa668731c14f2284bb0bdb7c5e93bb'),
    ('declaration-impots-frontalier-2026', '30b7521a312c4dad3afb7457d05cd799', '6494579df6046fea658bf81ddd9645b4'),
    ('dossier-location-frontalier-suisse-france', '1661f15c804208d026208e71313cfae2', '057bfdf36f207d3197faf59be26e2e85'),
    ('ecole-internationale-geneve-frontalier-ou-habiter', '3d9ea69577de8cef8aac16d263fccce3', 'd9f1fcda9205be8cf1886e23f819f094'),
    ('espaces-verts-coliving-lodge-annemasse', '5f676cd1e1877de4164321909aaca062', '6b6981cb96eda40c5e4126794d0badb5'),
    ('fiscalite-frontalier-geneve-impots-2026', '3c57c0166ea3087aecc24f13afcfbdf6', 'cc6553974a658c34df0a8fdf111548c4'),
    ('grand-geneve-2026-nouveautes-frontaliers', 'df07300c90e3a78ccd648ecc45c6962b', 'ddae62627d582ad072e6a92b1ec0fa11'),
    ('guide-ressources-frontalier-geneve', '6de2758f7809a98a869e9636d78c9ad5', '9a193874b4ff02d846aaac22f408288f'),
    ('living-in-france-working-in-geneva', '1c27716be6523110142bb55c4d129f68', '009645a7ec866906fada80d50ca31a58'),
    ('optimiser-espace-coliving-productivite-bien-etre', '7414c1ad5b614423ee7521d7daf98461', 'a2d035498057962f260332d696ea0eaa'),
    ('organisations-internationales-geneve-ou-habiter', 'f58015e7e69c048031e57fd26171c6b0', '4cd6b72892b1b2a841bafc9a2bb7891f'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', '89cacf647c58e7974aa5de5c3273c111', 'e3c4434ad7768eb1b5ffea92e879cbf1'),
    ('permis-g-frontalier-geneve', 'f23b0894fe85deb4b7940b5d6dcf774b', 'b5d4c43c484712f79356de233d6999c1'),
    ('quartiers-annemasse-ou-vivre-selon-profil', '769c602e49193a2564bd7f38fa624281', 'f1188fcebc2e4d599f816e33ea52e58f'),
    ('quitter-son-logement-guide-pratique', '0f1b830a2600c74c861455fab7a8473d', '1b04f1a639970719e2c62340bd611c86'),
    ('salaire-suisse-net-frontalier-2026', '646cbc8c23a6e1c2de671c29597b9e91', '8359c41ff235bfa5b979cbc7eea28a05'),
    ('se-faire-reseau-geneve-arriver-seul', '723c8bef4ac1a90aced13a2c5552e410', '2c95d64a69a2c2e728099e17bea8b4bb'),
    ('teletravail-frontalier-geneve-regles-2026', 'f5d2af31d1eefabfd7d49bfa296f2b77', 'b3c4f1f3398fd75ef56ed790513df2ff'),
    ('temps-trajet-annemasse-geneve-par-quartier', '4c65bd4464a1a82030dea6f6132a5235', '66c12b60b7f787e952e4f87060f0d487'),
    ('transport-annemasse-geneve-leman-express', '486ae9b9820973eb9a1b3c418a82108a', 'af2a5ab6b48a834cbc7fa02c27d9af87'),
    ('trouver-colocation-geneve-frontalier', '7c671d2a16ecac0e01a49898d4a735d2', '724102ec36a0dfef29d1ecd1a78591bf'),
    ('trouver-logement-avant-d-arriver-geneve', '6c8bf0fb53ac6124a84732ee1e6200b4', '0e6e7095bfc535f14ec1321cc1c43247'),
    ('vie-quotidienne-frontalier-courses-sport-sorties', '532520b28e04c7bd1f03dd76c8ae3442', '519e43c6f1b4109000ae60a68fadf92b')
  ) AS e(slug, c0, c1) LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(coalesce(b.content_fr, '')) <> e.c0 OR md5(coalesce(b.content_en, '')) <> e.c1 OR b.is_published IS NOT TRUE;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'prix-chambres-7-8 : la base n''est pas dans l''etat attendu avant ce SQL, rien n''est applique - %', ecarts; END IF;

  -- 22 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('coûte à partir de **1' || chr(160) || '370 CHF/mois**'), 'coûte à partir de **{{PRIX_DES}}/mois**'),
      content_en = replace(content_en, 'costs from **CHF 1,370/month**', 'costs from **{{PRIX_DES}}/month**')
  WHERE slug IN ('allocations-familiales-frontalier-geneve-2026', 'arnaques-logement-frontalier-geneve-eviter', 'banque-telephone-internet-frontalier-bons-plans', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-frais-dossier-geneve-annemasse', 'cout-de-la-vie-suisse-france-frontalier-2026', 'cout-transport-frontalier-geneve-2026', 'declaration-impots-frontalier-2026', 'ecole-internationale-geneve-frontalier-ou-habiter', 'espaces-verts-coliving-lodge-annemasse', 'fiscalite-frontalier-geneve-impots-2026', 'optimiser-espace-coliving-productivite-bien-etre', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'permis-g-frontalier-geneve', 'quitter-son-logement-guide-pratique', 'se-faire-reseau-geneve-arriver-seul', 'teletravail-frontalier-geneve-regles-2026', 'transport-annemasse-geneve-leman-express', 'trouver-logement-avant-d-arriver-geneve', 'vie-quotidienne-frontalier-courses-sport-sorties');

  -- 1 article(s) - content_fr : 3 - content_en : 3
  UPDATE public.blog_posts
  SET content_fr = replace(replace(replace(content_fr, ('coûte à partir de **1' || chr(160) || '370 CHF/mois**'), 'coûte à partir de **{{PRIX_DES}}/mois**'), ('Le coliving, dès 1' || chr(160) || '370 CHF, est serré'), 'Le coliving, dès {{PRIX_DES}}, est serré'), ('Le coliving, dès 1' || chr(160) || '370 CHF, est très confortable'), 'Le coliving, dès {{PRIX_DES}}, est très confortable'),
      content_en = replace(replace(replace(content_en, 'costs from **CHF 1,370/month**', 'costs from **{{PRIX_DES}}/month**'), 'Coliving, from 1,370 CHF, is tight', 'Coliving, from {{PRIX_DES}}, is tight'), 'Coliving, from 1,370 CHF, is very comfortable', 'Coliving, from {{PRIX_DES}}, is very comfortable')
  WHERE slug IN ('assurance-sante-frontalier-lamal-cmu-budget');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('tout inclus dès **1' || chr(160) || '370 CHF/mois** dans 3 maisons'), 'tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons'),
      content_en = replace(content_en, 'rooms from **CHF 1,370/month** across 3 houses', 'rooms from **{{PRIX_DES}}/month** across 3 houses')
  WHERE slug IN ('coliving-annemasse-geneve-frontaliers-avantages');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('**Tout inclus dès 1' || chr(160) || '370 CHF par mois**'), '**Tout inclus dès {{PRIX_DES}} par mois**'),
      content_en = replace(content_en, '**All inclusive from CHF 1,370 per month**', '**All inclusive from {{PRIX_DES}} per month**')
  WHERE slug IN ('coliving-communaute-reels-amis-geneve-annemasse');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('tout inclus dès **1' || chr(160) || '370 CHF/mois**, sans frais de dossier.'), 'tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.'),
      content_en = replace(content_en, 'all-inclusive from **CHF 1,370/month**, no application fee.', 'all-inclusive from **{{PRIX_DES}}/month**, no application fee.')
  WHERE slug IN ('coliving-geneve-frontaliers-guide-complet');

  -- 1 article(s) - content_fr : 3 - content_en : 3
  UPDATE public.blog_posts
  SET content_fr = replace(replace(replace(content_fr, ('coûte à partir de **1' || chr(160) || '370 CHF/mois**'), 'coûte à partir de **{{PRIX_DES}}/mois**'), ('c''est dès 1' || chr(160) || '370 CHF par mois, tout compris'), 'c''est dès {{PRIX_DES}} par mois, tout compris'), ('- **Budget** : dès 1' || chr(160) || '370 CHF tout compris'), '- **Budget** : dès {{PRIX_DES}} tout compris'),
      content_en = replace(replace(replace(content_en, 'costs from **CHF 1,370/month**', 'costs from **{{PRIX_DES}}/month**'), 'it''s from CHF 1,370 per month, all-inclusive', 'it''s from {{PRIX_DES}} per month, all-inclusive'), '- **Budget**: from CHF 1,370 all-inclusive', '- **Budget**: from {{PRIX_DES}} all-inclusive')
  WHERE slug IN ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie');

  -- 1 article(s) - content_fr : 2 - content_en : 2
  UPDATE public.blog_posts
  SET content_fr = replace(replace(content_fr, ('- Prix : dès 1' || chr(160) || '370 CHF/mois tout compris'), '- Prix : dès {{PRIX_DES}}/mois tout compris'), ('tout inclus dès **1' || chr(160) || '370 CHF/mois** dans 3 maisons'), 'tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons'),
      content_en = replace(replace(content_en, '- Price: from CHF 1,370/month all-inclusive', '- Price: from {{PRIX_DES}}/month all-inclusive'), 'rooms from **CHF 1,370/month** across 3 houses', 'rooms from **{{PRIX_DES}}/month** across 3 houses')
  WHERE slug IN ('colocation-annemasse-ville-la-grand-ambilly');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('tout inclus dès **1' || chr(160) || '370 CHF/mois**, sans frais de dossier.'), 'tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.'),
      content_en = replace(content_en, 'rooms from **CHF 1,370/month**, no application fee.', 'rooms from **{{PRIX_DES}}/month**, no application fee.')
  WHERE slug IN ('dossier-location-frontalier-suisse-france');

  -- 1 article(s) - content_fr : 2 - content_en : 2
  UPDATE public.blog_posts
  SET content_fr = replace(replace(content_fr, ('coûte à partir de **1' || chr(160) || '370 CHF/mois**'), 'coûte à partir de **{{PRIX_DES}}/mois**'), ('**Dès 1' || chr(160) || '370 CHF par mois, tout inclus**'), '**Dès {{PRIX_DES}} par mois, tout inclus**'),
      content_en = replace(replace(content_en, 'costs from **CHF 1,370/month**', 'costs from **{{PRIX_DES}}/month**'), '**From CHF 1,370 per month, all-inclusive**', '**From {{PRIX_DES}} per month, all-inclusive**')
  WHERE slug IN ('grand-geneve-2026-nouveautes-frontaliers');

  -- 1 article(s) - content_fr : 2 - content_en : 2
  UPDATE public.blog_posts
  SET content_fr = replace(replace(content_fr, ('coûte à partir de **1' || chr(160) || '370 CHF/mois**'), 'coûte à partir de **{{PRIX_DES}}/mois**'), ('À partir de 1' || chr(160) || '370 CHF/mois. Le prix affiché'), 'À partir de {{PRIX_DES}}/mois. Le prix affiché'),
      content_en = replace(replace(content_en, 'costs from **CHF 1,370/month**', 'costs from **{{PRIX_DES}}/month**'), 'From 1,370 CHF/month. The advertised price', 'From {{PRIX_DES}}/month. The advertised price')
  WHERE slug IN ('guide-ressources-frontalier-geneve');

  -- 1 article(s) - content_fr : 2 - content_en : 2
  UPDATE public.blog_posts
  SET content_fr = replace(replace(content_fr, ('coûte à partir de **1' || chr(160) || '370 CHF/mois**'), 'coûte à partir de **{{PRIX_DES}}/mois**'), ('avec des chambres dès 1' || chr(160) || '370 CHF par mois tout inclus'), 'avec des chambres dès {{PRIX_DES}} par mois tout inclus'),
      content_en = replace(replace(content_en, 'costs from **CHF 1,370/month**', 'costs from **{{PRIX_DES}}/month**'), 'with rooms from CHF 1,370 a month all inclusive', 'with rooms from {{PRIX_DES}} a month all inclusive')
  WHERE slug IN ('living-in-france-working-in-geneva');

  -- 1 article(s) - content_fr : 2 - content_en : 2
  UPDATE public.blog_posts
  SET content_fr = replace(replace(content_fr, ('coûte à partir de **1' || chr(160) || '370 CHF/mois**'), 'coûte à partir de **{{PRIX_DES}}/mois**'), ('(type le nôtre, dès 1' || chr(160) || '370 CHF/mois)'), '(type le nôtre, dès {{PRIX_DES}}/mois)'),
      content_en = replace(replace(content_en, 'costs from **CHF 1,370/month**', 'costs from **{{PRIX_DES}}/month**'), '(like ours, from CHF 1,370/month)', '(like ours, from {{PRIX_DES}}/month)')
  WHERE slug IN ('quartiers-annemasse-ou-vivre-selon-profil');

  -- 1 article(s) - content_fr : 2 - content_en : 2
  UPDATE public.blog_posts
  SET content_fr = replace(replace(content_fr, ('coûte à partir de **1' || chr(160) || '370 CHF/mois**'), 'coûte à partir de **{{PRIX_DES}}/mois**'), ('— dès 1' || chr(160) || '370 CHF/mois, avec une communauté'), '— dès {{PRIX_DES}}/mois, avec une communauté'),
      content_en = replace(replace(content_en, 'costs from **CHF 1,370/month**', 'costs from **{{PRIX_DES}}/month**'), '— from CHF 1,370/month, with a community', '— from {{PRIX_DES}}/month, with a community')
  WHERE slug IN ('salaire-suisse-net-frontalier-2026');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('— tout inclus dès 1' || chr(160) || '370 CHF/mois.'), '— tout inclus dès {{PRIX_DES}}/mois.'),
      content_en = replace(content_en, '— all-inclusive from CHF 1,370/month.', '— all-inclusive from {{PRIX_DES}}/month.')
  WHERE slug IN ('temps-trajet-annemasse-geneve-par-quartier');

  -- 1 article(s) - content_fr : 5 - content_en : 5
  UPDATE public.blog_posts
  SET content_fr = replace(replace(replace(replace(replace(content_fr, ('coûte à partir de **1' || chr(160) || '370 CHF/mois**'), 'coûte à partir de **{{PRIX_DES}}/mois**'), ('déjà installée — dès 1' || chr(160) || '370 CHF/mois, à'), 'déjà installée — dès {{PRIX_DES}}/mois, à'), ('d''une salle de sport. À partir de 1' || chr(160) || '370 CHF/mois.'), 'd''une salle de sport. À partir de {{PRIX_DES}}/mois.'), ('tout inclus dès 1' || chr(160) || '370 CHF/mois, avec piscine'), 'tout inclus dès {{PRIX_DES}}/mois, avec piscine'), ('porte-à-porte, dès 1' || chr(160) || '370 CHF/mois.'), 'porte-à-porte, dès {{PRIX_DES}}/mois.'),
      content_en = replace(replace(replace(replace(replace(content_en, 'costs from **CHF 1,370/month**', 'costs from **{{PRIX_DES}}/month**'), 'already settled in — from 1,370 CHF/month, 20 min', 'already settled in — from {{PRIX_DES}}/month, 20 min'), 'a sauna and a gym. From CHF 1,370/month.', 'a sauna and a gym. From {{PRIX_DES}}/month.'), 'room from CHF 1,370/month, with a pool', 'room from {{PRIX_DES}}/month, with a pool'), 'door to door, from CHF 1,370/month.', 'door to door, from {{PRIX_DES}}/month.')
  WHERE slug IN ('trouver-colocation-geneve-frontalier');

  -- garde de sortie : les articles sont dans l'etat attendu, sinon tout est annule
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('allocations-familiales-frontalier-geneve-2026', 'e79369a52cd84d86c156147ef3206ed9', 'f1a26a08f21654d0a73eef182443975c'),
    ('arnaques-logement-frontalier-geneve-eviter', 'a0a272aa9f1e3c5e8b38f823ddfa3557', '8aa16939a7d1726ad26db227306ec84c'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'e7f262ed2811d39d9e9c6826ffba1e2f', 'fbfc33a174d297a34fff75fb1c6fb3c5'),
    ('banque-telephone-internet-frontalier-bons-plans', '3e2150ef4e0ab67da199abe57c267f1f', 'd157a0dc3f237107a45f00036c0080f3'),
    ('budget-colocation-geneve-guide-complet', 'c31ed259f60ac5205056b6238ab9d4c8', '9ea22e86d9cdd6afa01b915be33a0e64'),
    ('choc-culturel-franco-suisse-expatrie-geneve', '021c53edee917447a40717d4cb3d40a2', 'cd3eec4f6c20fc99187bbad7e72e07cb'),
    ('coliving-annemasse-geneve-frontaliers-avantages', '6fca2d851cbac1deea10f93ee7389f09', 'efb7699e18fbf08a3d32b957ee3ad9c0'),
    ('coliving-communaute-reels-amis-geneve-annemasse', '597dcda3b31700cd078d51301224f0a0', '96c1bfe1ad947eadc7ff251da39a6170'),
    ('coliving-frais-dossier-geneve-annemasse', '37a562375841619b0a852c7839e12727', '8f5607d5683cbbcaea1c6257a4540779'),
    ('coliving-geneve-frontaliers-guide-complet', 'f75052f94bab36944fcd71462f302b4f', 'f5185766934b3b4fc6446bafd6ee7b35'),
    ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', '76e799c0daa4ed423a69550be39a8e15', '69627a8cacc9cb03d299fa62815a6782'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'b2894b6458ef90099f987a9726ea47d0', 'a25b158196586800d46e8eff396a0dad'),
    ('cout-de-la-vie-suisse-france-frontalier-2026', '8dc53f0773ee7555e7f83263a001d5a4', '9c06252cdf4a4d23f5c9932feadaf592'),
    ('cout-transport-frontalier-geneve-2026', '685ca45925c4ff36daf5bb8b3fc8260f', '14bc08cbc63d4f9396ddb72289c25c7e'),
    ('declaration-impots-frontalier-2026', '7579cb289d62486eff0528c029cc58a7', 'da16b1607adc15e973f15d5c4935847a'),
    ('dossier-location-frontalier-suisse-france', 'a91414517ae8ccfbd38fac22e2899545', '848f68242e27af5259571bc8d0a47e3f'),
    ('ecole-internationale-geneve-frontalier-ou-habiter', '9122bb124765422957f589768b9fe9db', '81e4a3f2e0022c6bbd9ed31aa04ee0ad'),
    ('espaces-verts-coliving-lodge-annemasse', '85f9684e3e9981a48e329ea210af6c6f', 'b43508604e3ff9967d8a6aa09013bd24'),
    ('fiscalite-frontalier-geneve-impots-2026', 'e90900b11661bb98b9210a4d21285820', '32c0951a6765365fc2a4c3f589562eae'),
    ('grand-geneve-2026-nouveautes-frontaliers', '837b05da46713e9ef2faf2d5e95cd1c3', 'ef7502f1c758d4c489e09dacc2b298de'),
    ('guide-ressources-frontalier-geneve', 'e429ed1caec4b6e9ce9945335c16017f', '47a1551d0adf6ab9137b31ac0b1ec6f5'),
    ('living-in-france-working-in-geneva', 'ab7d4c95ffdb005c48b96bcc494104e4', '93b373c06334f0adb0dc972e9a0c5b7c'),
    ('optimiser-espace-coliving-productivite-bien-etre', 'c11c245c11951cea4716450ca19c6827', 'fbac1fd59af8ba57171543c468501cc6'),
    ('organisations-internationales-geneve-ou-habiter', '45ca18b88584d0ed06ecde70cb112cab', '51e97c16ce7ffa4159a723230339db8d'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', '6e52ecfa4e9fc808e97db82908e82d94', 'cac318bb85f9ff5fe26d37a0a2b7f44c'),
    ('permis-g-frontalier-geneve', '2801913179f6d906f2445d08613ffb92', '24c13b4a2d06845ed9260779d02484ca'),
    ('quartiers-annemasse-ou-vivre-selon-profil', 'bb5119ec81931787374591d2fe1ee47b', '0fe7121d61ef6ab4827e564c11c33173'),
    ('quitter-son-logement-guide-pratique', 'b0f42803cb35d813f52e89d8c7f5cfc2', 'fe5c8e24c82b863b4b85165dd9c3b905'),
    ('salaire-suisse-net-frontalier-2026', 'e9bd14b6195b739e7294f4e0ffa91b39', '907147b3455433c0a7a3132f4d25b4d9'),
    ('se-faire-reseau-geneve-arriver-seul', '8a036e0762a5e0957f908ea71fd7a61d', '324c3ceb6ddb74cdde2cb37492276091'),
    ('teletravail-frontalier-geneve-regles-2026', 'cfbdbcb63089873de1331273fa7c34b7', '478143470199e347eafe5d0faea06a65'),
    ('temps-trajet-annemasse-geneve-par-quartier', '40d102b88a06f2c88d514f454d1acc90', '349757faed493ea3167f9e4ae8e0421a'),
    ('transport-annemasse-geneve-leman-express', '18d83d1451b3b6c5908f402cf8f946b0', 'dd20b78c727b9c27e2586a071c186921'),
    ('trouver-colocation-geneve-frontalier', '773f0c73a15d9720a23c9be16e2c94ff', '71e271481a0af753c2d838449fd63c7f'),
    ('trouver-logement-avant-d-arriver-geneve', '5b8bcd10d38332e821756e60bf83bc83', 'af6641e2c883667ffff8b1103ed7130b'),
    ('vie-quotidienne-frontalier-courses-sport-sorties', 'af287b3519f955fd47e458883f4d7cc8', '20e241df350d8d51965294041a85dc9e')
  ) AS e(slug, c0, c1) LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(coalesce(b.content_fr, '')) <> e.c0 OR md5(coalesce(b.content_en, '')) <> e.c1;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'prix-chambres-7-8 : l''etat obtenu n''est pas l''etat attendu, tout est annule - %', ecarts; END IF;
END
$seance$;
