-- ============================================================================
-- Le Lodge, borne basse — APPLICATION EN SÉANCE des 60 substitutions de scripts/trajets-lodge-borne-basse-2026-11-12.sql (27 articles publiés),
-- regroupées en 5 UPDATE dans UN SEUL bloc DO : une instruction, donc une transaction implicite. Mêmes ancres et mêmes
-- textes que le fichier du dépôt (module scripts/trajets-lodge-borne-basse.edits.mjs) ; garde d'entrée = md5 de la sauvegarde ; garde de sortie = md5
-- de scripts/backups/trajets-lodge-borne-basse-2026-11-12.attendu-apres.json. Tout ou rien : au moindre écart, l'exception annule tout le bloc.
-- Forme exécutée en séance le 12/11/2026, sur GO de Jérôme, juste avant la fusion (écrite par un outil de la séance, hors dépôt).
-- ============================================================================
DO $seance$
DECLARE ecarts text;
BEGIN
  -- garde d'entrée : les 27 articles sont publiés et dans l'état sauvegardé
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('allocations-familiales-frontalier-geneve-2026', '4f2e3a5f0d88882368c719d5ea1845e5', '305f7d5b26ee1c2ffc09d6bff57f2637'),
    ('arnaques-logement-frontalier-geneve-eviter', '54ef54d9db1b6a5d07b54f86de09806c', '0478d0ba4a18bdb0c8d42acea095b802'),
    ('assurance-sante-frontalier-lamal-cmu-budget', '8bf1735e4d751432ad2ebe37ce22246b', '0c1909be2a3c3e5203b0540d2ebde8e0'),
    ('banque-telephone-internet-frontalier-bons-plans', 'c4d54ab8a6bda1489b75f14cd9a758e9', 'c1024956f321dbaeb10018934c79cb00'),
    ('budget-colocation-geneve-guide-complet', '68c634702202e5172d82279f7e8ac00f', '40fa2d90c19164b786203aeb3b019678'),
    ('choc-culturel-franco-suisse-expatrie-geneve', 'ad5734b8e924d1551a2de2d4898a9e31', 'e1527cf3eb2f7fc927e71fcd117a80b3'),
    ('coliving-colocation-ou-studio-geneve-comparatif', 'd4c046a7bf8ff6609930947c68dbe8a6', 'cbfc75b82dd20f0eb019f07e1bc4d067'),
    ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'a58ffb97cd358f608c2a383117691e85', '88d5cd5cef0914f46354368ccbd978c7'),
    ('cout-de-la-vie-suisse-france-frontalier-2026', '5085ac671461a36a3c01dba6bd5a6007', '17dda85fb5be9bb7da48dca0f48571d6'),
    ('declaration-impots-frontalier-2026', 'ea861dd7788ff2add16b887d49b503cf', '634bba391c89b98ae9591375010a02e5'),
    ('ecole-internationale-geneve-frontalier-ou-habiter', '0bf26a06c87fc08f2c9753463d874f97', '007002c6083daf3dbfc6c5a04059f9ac'),
    ('fiscalite-frontalier-geneve-impots-2026', '9fc0fbf316ce12f875fa39c05c2d5bf6', 'e14bf203d555fe47a3c6034e15b23975'),
    ('grand-geneve-2026-nouveautes-frontaliers', 'fc8b82cc8c74802fdf16c7add4171063', '6ca93fd02dfa0a5b1f141411e1b14a80'),
    ('guide-ressources-frontalier-geneve', '990c6069febcc04799ad24f28eea4fef', '5ce21358b9651360c14df3e1150e103a'),
    ('living-in-france-working-in-geneva', '8bf305ea33c0339ae8b36fa8484d931e', '28cecc1a2a1d4daf32c8d6217e3c0a40'),
    ('optimiser-espace-coliving-productivite-bien-etre', 'd2f14385649c09e8b752955b9819fbe2', '8f85a294450043d3702e70cbf8117453'),
    ('organisations-internationales-geneve-ou-habiter', 'fc2574406fccb6c1043b51881ded3b78', 'db2f727018a23d755b37243489c60978'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', '292cbd7f773eadd519ac56ecbe01f870', '37bc9e0214f1af88a382c5bda76f158d'),
    ('permis-g-frontalier-geneve', '409fa0fdb9cdf30dfb1a38816001344f', '2b88b48d743aacf87047ab066e0cf161'),
    ('quitter-son-logement-guide-pratique', '330f175863e56a963db005c00c964b8f', '751732a4765c5ef3c93d35ac5012af1d'),
    ('salaire-suisse-net-frontalier-2026', 'f718e409bb1ae32acedd2c384817090b', '5fc2cf4cab2623cb77aa53900bdfc667'),
    ('se-faire-reseau-geneve-arriver-seul', '19b081e841d69e9563a849eaa8e3b59b', '9c4d37518d81cefd15c60e523b0cf559'),
    ('teletravail-frontalier-geneve-regles-2026', 'e8b015238e19d4c4b629a338f87277b1', 'f2b08ca7b6509512572b32724380c9cc'),
    ('trouver-colocation-geneve-frontalier', 'de8b076299364c649350039c34a1482a', 'cb114b6e22ad0e5af22ef2dc5f3dca00'),
    ('trouver-logement-avant-d-arriver-geneve', 'bcff0c3897df385f3ae5ea32d0a29b75', 'b5b7883d573d001e3e1ccf3557c15105'),
    ('vie-quotidienne-frontalier-courses-sport-sorties', 'fd14e07432b609f6939b334060fc9a3d', 'f6ca4a53a699b9f34ecb3fda82158304'),
    ('vivre-a-annemasse-quand-on-travaille-a-geneve', '33bacd312625ac05323cfacf8c54fb96', 'cb0618ad4d5c30f3e317b4273b50fb3e')
  ) AS e(slug, f, en) LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(b.content_fr) <> e.f OR md5(b.content_en) <> e.en OR b.is_published IS NOT TRUE;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'trajets-lodge-borne-basse : la base n''est plus dans l''état sauvegardé, rien n''est appliqué — %', ecarts; END IF;

  -- 23 article(s) · 1 substitution(s) par langue
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
      content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$)
  WHERE slug IN ('allocations-familiales-frontalier-geneve-2026', 'arnaques-logement-frontalier-geneve-eviter', 'assurance-sante-frontalier-lamal-cmu-budget', 'banque-telephone-internet-frontalier-bons-plans', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'cout-de-la-vie-suisse-france-frontalier-2026', 'declaration-impots-frontalier-2026', 'ecole-internationale-geneve-frontalier-ou-habiter', 'fiscalite-frontalier-geneve-impots-2026', 'grand-geneve-2026-nouveautes-frontaliers', 'living-in-france-working-in-geneva', 'optimiser-espace-coliving-productivite-bien-etre', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'permis-g-frontalier-geneve', 'quitter-son-logement-guide-pratique', 'salaire-suisse-net-frontalier-2026', 'se-faire-reseau-geneve-arriver-seul', 'teletravail-frontalier-geneve-regles-2026', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve', 'vie-quotidienne-frontalier-courses-sport-sorties');

  -- 1 article(s) · 1 substitution(s) par langue
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, $f$20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$, $r$20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre$r$),
      content_en = replace(content_en, $f$20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$, $r$20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre$r$)
  WHERE slug IN ('coliving-colocation-ou-studio-geneve-comparatif');

  -- 1 article(s) · 1 substitution(s) par langue
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, $f$et à 30 minutes du centre (Rive)$f$, $r$et entre 25 et 32 minutes du centre (Rive) selon la maison$r$),
      content_en = replace(content_en, $f$and 30 minutes from the city centre (Rive)$f$, $r$and between 25 and 32 minutes from the city centre (Rive) depending on the house$r$)
  WHERE slug IN ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie');

  -- 1 article(s) · 3 substitution(s) par langue
  UPDATE public.blog_posts
  SET content_fr = replace(replace(replace(content_fr, $f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$), $f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$), $f$23 min de train, 33 min porte-à-porte depuis chaque maison$f$, $r$23 min de train, 32 à 33 min porte-à-porte selon la maison$r$),
      content_en = replace(replace(replace(content_en, $f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$), $f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$), $f$23 min by train, 33 min door to door from each house$f$, $r$23 min by train, 32 to 33 min door to door depending on the house$r$)
  WHERE slug IN ('guide-ressources-frontalier-geneve');

  -- 1 article(s) · 2 substitution(s) par langue
  UPDATE public.blog_posts
  SET content_fr = replace(replace(content_fr, $f$moins que bien des trajets à l'intérieur de Genève, et 30 minutes jusqu'au centre$f$, $r$moins que bien des trajets à l'intérieur de Genève, et 25 minutes jusqu'au centre$r$), $f$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$, $r$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre$r$),
      content_en = replace(replace(content_en, $f$less than many commutes inside Geneva, and 30 minutes to the city centre$f$, $r$less than many commutes inside Geneva, and 25 minutes to the city centre$r$), $f$Door to door, count 20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$, $r$Door to door, count 20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre$r$)
  WHERE slug IN ('vivre-a-annemasse-quand-on-travaille-a-geneve');

  -- garde de sortie : les 27 articles sont dans l'état attendu, sinon tout est annulé
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('allocations-familiales-frontalier-geneve-2026', '498125f1071094ac5821407b1f48fc64', '3916990ac6a85b5955e887567ff9241a'),
    ('arnaques-logement-frontalier-geneve-eviter', 'decab98e498573ec8fc89bda541a7965', '2a21f34e0fbf2b83e5456d269528e2d2'),
    ('assurance-sante-frontalier-lamal-cmu-budget', '8d6a3cf91d96541e836316f4c1faeab2', '5043b66f0e4864fa50dd9fb444af6be9'),
    ('banque-telephone-internet-frontalier-bons-plans', '2e4fe88dc026233ec694b841d7d6380c', '791ff9a68ebe98fb79428887db8acd36'),
    ('budget-colocation-geneve-guide-complet', '5636302ac33ba16a8df57c7ffce746a1', 'ce9883a02a7b7c1303428b72fd67655c'),
    ('choc-culturel-franco-suisse-expatrie-geneve', 'd041ed1ec207749463eaaccc5305fa72', 'b983aaf83e0416c180f43470244a5a46'),
    ('coliving-colocation-ou-studio-geneve-comparatif', '40f8a4a09aa3a18f5e9078ee0c5d0054', 'de02f0e0164f21c58ee97b0b32b5f959'),
    ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', '3bbf0a7592e8267fef85c61caf85647c', '92358e745e252add58daf0b833826c4d'),
    ('cout-de-la-vie-suisse-france-frontalier-2026', '551a233f45e3fa68b7458499f29da75d', '7521631a936fbf4d9e0bd41e295c0cf3'),
    ('declaration-impots-frontalier-2026', '30b7521a312c4dad3afb7457d05cd799', '6494579df6046fea658bf81ddd9645b4'),
    ('ecole-internationale-geneve-frontalier-ou-habiter', '3d9ea69577de8cef8aac16d263fccce3', 'd9f1fcda9205be8cf1886e23f819f094'),
    ('fiscalite-frontalier-geneve-impots-2026', '3c57c0166ea3087aecc24f13afcfbdf6', 'cc6553974a658c34df0a8fdf111548c4'),
    ('grand-geneve-2026-nouveautes-frontaliers', 'df07300c90e3a78ccd648ecc45c6962b', 'ddae62627d582ad072e6a92b1ec0fa11'),
    ('guide-ressources-frontalier-geneve', '6de2758f7809a98a869e9636d78c9ad5', '9a193874b4ff02d846aaac22f408288f'),
    ('living-in-france-working-in-geneva', '1c27716be6523110142bb55c4d129f68', '009645a7ec866906fada80d50ca31a58'),
    ('optimiser-espace-coliving-productivite-bien-etre', '7414c1ad5b614423ee7521d7daf98461', 'a2d035498057962f260332d696ea0eaa'),
    ('organisations-internationales-geneve-ou-habiter', 'f58015e7e69c048031e57fd26171c6b0', '4cd6b72892b1b2a841bafc9a2bb7891f'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', '89cacf647c58e7974aa5de5c3273c111', 'e3c4434ad7768eb1b5ffea92e879cbf1'),
    ('permis-g-frontalier-geneve', 'f23b0894fe85deb4b7940b5d6dcf774b', 'b5d4c43c484712f79356de233d6999c1'),
    ('quitter-son-logement-guide-pratique', '0f1b830a2600c74c861455fab7a8473d', '1b04f1a639970719e2c62340bd611c86'),
    ('salaire-suisse-net-frontalier-2026', '646cbc8c23a6e1c2de671c29597b9e91', '8359c41ff235bfa5b979cbc7eea28a05'),
    ('se-faire-reseau-geneve-arriver-seul', '723c8bef4ac1a90aced13a2c5552e410', '2c95d64a69a2c2e728099e17bea8b4bb'),
    ('teletravail-frontalier-geneve-regles-2026', 'f5d2af31d1eefabfd7d49bfa296f2b77', 'b3c4f1f3398fd75ef56ed790513df2ff'),
    ('trouver-colocation-geneve-frontalier', '7c671d2a16ecac0e01a49898d4a735d2', '724102ec36a0dfef29d1ecd1a78591bf'),
    ('trouver-logement-avant-d-arriver-geneve', '6c8bf0fb53ac6124a84732ee1e6200b4', '0e6e7095bfc535f14ec1321cc1c43247'),
    ('vie-quotidienne-frontalier-courses-sport-sorties', '532520b28e04c7bd1f03dd76c8ae3442', '519e43c6f1b4109000ae60a68fadf92b'),
    ('vivre-a-annemasse-quand-on-travaille-a-geneve', 'e865b33e2b9e24530798e13dd60a1310', '0b3a6cc82f2385b22a1ac5681388807b')
  ) AS e(slug, f, en) LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(b.content_fr) <> e.f OR md5(b.content_en) <> e.en;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'trajets-lodge-borne-basse : l''état obtenu n''est pas l''état attendu, tout est annulé — %', ecarts; END IF;
END
$seance$;
