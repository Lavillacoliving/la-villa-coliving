-- ============================================================================
-- RETOUR ARRIERE de la seance "visite-articles" (2026-11-24), genere le 2026-11-24T18:16:54.510Z par scripts/build-seance-sql.mjs. 100 % ASCII.
-- Remet le texte d'avant la seance par les substitutions inverses (nouveau -> ancien, dans l'ordre inverse). Garde d'entree : chaque
-- champ dans l'etat attendu APRES la seance (md5 de scripts/backups/visite-articles-2026-11-24.attendu-apres.json) ; resultat compare au md5 d'avant
-- (scripts/backups/visite-articles-2026-11-24.avant.json) avant chaque UPDATE ; une transaction : toute anomalie annule tout.
-- Si un champ a change depuis la seance, rien n'est ecrit : repartir de la sauvegarde. updated_at ne revient pas a sa valeur d'origine.
-- 62 champs de 33 articles publies, 75 substitutions (40 FR, 35 EN) ; liste : scripts/visite-articles.edits.mjs
-- Lecture de la base a la preparation : REST anon (lecture seule) le 2026-11-24T18:16:54.510Z
--   [1/62] arnaques-logement-frontalier-geneve-eviter.content_fr : 1 subst. ; 12659 -> 12675 car. ; md5 a0a272aa9f1e3c5e8b38f823ddfa3557 -> 421193cb93ac811068719b6e80379f25
--   [2/62] arnaques-logement-frontalier-geneve-eviter.content_en : 1 subst. ; 11494 -> 11506 car. ; md5 8aa16939a7d1726ad26db227306ec84c -> ebb5f9e3e8bfa6f512bb3fd19a930379
--   [3/62] assurance-sante-frontalier-lamal-cmu-budget.content_fr : 1 subst. ; 9601 -> 9602 car. ; md5 1a4b3fe8451a9e722ac75060d0151544 -> 462f14df0e91aac44e1f7849b3ff859a
--   [4/62] assurance-sante-frontalier-lamal-cmu-budget.content_en : 1 subst. ; 9053 -> 9051 car. ; md5 09e8e5060862b513b248866d6bc6b298 -> ebad1e57236ac6038cdc4cda178df16e
--   [5/62] banque-telephone-internet-frontalier-bons-plans.content_fr : 1 subst. ; 10156 -> 10163 car. ; md5 3e2150ef4e0ab67da199abe57c267f1f -> 64cfd1ef0292e4ac8bd6a99ee176b237
--   [6/62] banque-telephone-internet-frontalier-bons-plans.content_en : 1 subst. ; 9416 -> 9418 car. ; md5 d157a0dc3f237107a45f00036c0080f3 -> 22d34f36cc5719598520195715bde521
--   [7/62] budget-colocation-geneve-guide-complet.content_fr : 2 subst. ; 25343 -> 25342 car. ; md5 6e1cb671a0ccb8a1958ca70d4046ac01 -> b1d4ba71e554b6d902568aa4e0cb6edf
--   [8/62] budget-colocation-geneve-guide-complet.content_en : 2 subst. ; 21219 -> 21221 car. ; md5 19b1894b952eb95c042e8acbc360b40f -> d9923621649c469c785f9477a0a5a6ce
--   [9/62] choc-culturel-franco-suisse-expatrie-geneve.content_fr : 1 subst. ; 10975 -> 10982 car. ; md5 021c53edee917447a40717d4cb3d40a2 -> 7d83440c304812118e2760265bf18ff3
--   [10/62] choc-culturel-franco-suisse-expatrie-geneve.content_en : 1 subst. ; 10314 -> 10316 car. ; md5 63b4e154230f8eb6e765cc87d4a64eff -> 874b0de4456e9981acbba5f3301b674f
--   [11/62] coliving-annemasse-geneve-frontaliers-avantages.content_fr : 1 subst. ; 12736 -> 12746 car. ; md5 d1dbc5fd76720a86e05c5759337b449d -> 86de3563aa27a33f5cccb708e8a2143c
--   [12/62] coliving-annemasse-geneve-frontaliers-avantages.content_en : 1 subst. ; 11875 -> 11888 car. ; md5 f1b79e724e88add74f990474f97d37b3 -> 947df784366680e1944547cc09a44adc
--   [13/62] coliving-colocation-ou-studio-geneve-comparatif.content_fr : 3 subst. ; 14350 -> 14338 car. ; md5 75763563cd668930542f6246bf5309ec -> 930668c2cdd287e5ba2635eb194c9f48
--   [14/62] coliving-colocation-ou-studio-geneve-comparatif.content_en : 3 subst. ; 13863 -> 13851 car. ; md5 e2039f8a3fd0cb9b72b945f8254177d2 -> ef081b6bf8f474db3a7768261fcefd1b
--   [15/62] coliving-communaute-reels-amis-geneve-annemasse.content_fr : 1 subst. ; 11078 -> 11089 car. ; md5 06a1c4140726bd66b76972347543e208 -> f5629db0f3163d21a4efe38e72f45099
--   [16/62] coliving-communaute-reels-amis-geneve-annemasse.content_en : 1 subst. ; 9701 -> 9708 car. ; md5 fd57faa8263716e11fddf5c2cb758e72 -> 94afbbcd59dc0703857a9fb6d15ca6d8
--   [17/62] coliving-frais-dossier-geneve-annemasse.content_fr : 1 subst. ; 8229 -> 8237 car. ; md5 37a562375841619b0a852c7839e12727 -> 3f8438674919323dc78b8ff498815f78
--   [18/62] coliving-frais-dossier-geneve-annemasse.content_en : 1 subst. ; 7317 -> 7330 car. ; md5 8f5607d5683cbbcaea1c6257a4540779 -> 0155d81fd699348a87f3736d67771ebb
--   [19/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_fr : 1 subst. ; 3926 -> 3936 car. ; md5 76e799c0daa4ed423a69550be39a8e15 -> 9c7fa5e10c0250610453f58d0bb34282
--   [20/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_en : 1 subst. ; 3805 -> 3818 car. ; md5 69627a8cacc9cb03d299fa62815a6782 -> 0f91d57d8a59cd556f24fc990b1aabff
--   [21/62] colocation-annemasse-ville-la-grand-ambilly.content_fr : 1 subst. ; 9096 -> 9104 car. ; md5 83446efaedc38c1f81ee4483f0a764a6 -> ba2ff875fc62fcce502101770bb7120c
--   [22/62] cout-transport-frontalier-geneve-2026.content_fr : 1 subst. ; 9118 -> 9128 car. ; md5 685ca45925c4ff36daf5bb8b3fc8260f -> 7f810ca06a9788323fad6f08ce778a38
--   [23/62] cout-transport-frontalier-geneve-2026.content_en : 1 subst. ; 8490 -> 8503 car. ; md5 14bc08cbc63d4f9396ddb72289c25c7e -> b9b10af172ca3c132975ad4c4b583a68
--   [24/62] dossier-location-frontalier-suisse-france.content_fr : 1 subst. ; 9076 -> 9087 car. ; md5 448c659713dcfa9faf20a282a69b001b -> cea73ddf37342422bae6a8ae37932136
--   [25/62] dossier-location-frontalier-suisse-france.content_en : 1 subst. ; 8421 -> 8428 car. ; md5 64ea66b19de7121de19e062918f38668 -> 784e3b1b5f6fbbd48e032b4119d0417c
--   [26/62] espaces-verts-coliving-lodge-annemasse.content_fr : 1 subst. ; 3543 -> 3553 car. ; md5 85f9684e3e9981a48e329ea210af6c6f -> 868364a8d3c11b30e1d3d72018f61d83
--   [27/62] espaces-verts-coliving-lodge-annemasse.content_en : 1 subst. ; 3258 -> 3271 car. ; md5 b43508604e3ff9967d8a6aa09013bd24 -> bdb7d5c1dbeb8578cc9b35cb9ed7c110
--   [28/62] fiscalite-frontalier-geneve-impots-2026.content_fr : 1 subst. ; 10726 -> 10725 car. ; md5 66e071d1a76a875e1cfd14f2f15f2d48 -> 6dcab202f709f1bb0b9f43bccd91ae6e
--   [29/62] fiscalite-frontalier-geneve-impots-2026.content_en : 1 subst. ; 10067 -> 10056 car. ; md5 97d11ac02770348b1e15e0332667b1c6 -> 7cf38cf7ddd02c989801430a1a5ce8fa
--   [30/62] grand-geneve-2026-nouveautes-frontaliers.content_fr : 1 subst. ; 8678 -> 8686 car. ; md5 837b05da46713e9ef2faf2d5e95cd1c3 -> 118c2871bfadd8871aba39d8b57a013b
--   [31/62] guide-ressources-frontalier-geneve.content_fr : 1 subst. ; 40523 -> 40531 car. ; md5 4e84b7b69337597b05f9364fb23b4ecd -> 363544b549f614f77ac335a513c9393d
--   [32/62] guide-ressources-frontalier-geneve.content_en : 1 subst. ; 37360 -> 37373 car. ; md5 0ebd782c01bc887ae7f911c91fd3bbdd -> 816c2011d4208287df2c67c28e33434a
--   [33/62] ia-solitude-lien-social-coliving.content_fr : 1 subst. ; 11865 -> 11874 car. ; md5 01e5c5f389f2793f3841fba29a7c385e -> ce8cdf824419ff68d0ee74eb5787e853
--   [34/62] ia-solitude-lien-social-coliving.content_en : 1 subst. ; 11130 -> 11137 car. ; md5 4930e9a0921fe2d8873772875fed3389 -> a314c25c7a3c136375b948ae1f5dc444
--   [35/62] living-in-france-working-in-geneva.content_fr : 1 subst. ; 17698 -> 17706 car. ; md5 8ca01ef2e6f54803102ef8b3719f92a7 -> 77360b9c15f389c6ca5d00b0ce60e440
--   [36/62] lodge-annemasse-coliving-premium-portes-geneve.content_fr : 2 subst. ; 15231 -> 15160 car. ; md5 22c4f489d9f7b2e52b1850deeb91bd24 -> 653fa950f876d37cf0e77391653ec2df
--   [37/62] lodge-annemasse-coliving-premium-portes-geneve.content_en : 2 subst. ; 13561 -> 13519 car. ; md5 39fe2e66bbded4b3298eb6c0d95dd3d2 -> 446fe06be4794ec06827f0f08089defd
--   [38/62] non-la-villa-coliving-nest-pas-une-arnaque.content_fr : 2 subst. ; 5580 -> 5585 car. ; md5 f775c5487c9c2e9e01accec0ca059eeb -> 902cbd6463b9be2a76995439414ddb28
--   [39/62] non-la-villa-coliving-nest-pas-une-arnaque.content_en : 2 subst. ; 5127 -> 5135 car. ; md5 2f52c75a0be32fd11b4ab33fa8968ef9 -> 0d83c2f4d59b95d6c651dc676941ed20
--   [40/62] organisations-internationales-geneve-ou-habiter.content_fr : 2 subst. ; 7455 -> 7460 car. ; md5 aa8c3e47ba6f02e6b75c63acc3bfc403 -> b71bebeae2db2aed4be4431387a95865
--   [41/62] organisations-internationales-geneve-ou-habiter.content_en : 2 subst. ; 6833 -> 6835 car. ; md5 0153c8d996c3fcc27f099f0fd17d62f5 -> 4c2993940c9ab8e054c09f6c2c77aa78
--   [42/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_fr : 1 subst. ; 15248 -> 15247 car. ; md5 4d574f07ea1e3c5be550e3ee1432668b -> 728830e3268710fedcda0d1cc2e8944c
--   [43/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_en : 1 subst. ; 15079 -> 15079 car. ; md5 ed8beb6c19c7c4326304d24be1145e89 -> 2bb0b68bbd498c60281e07594aa4ebd1
--   [44/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_fr : 1 subst. ; 15422 -> 15428 car. ; md5 7915537294651377c0b3ed1d54aaaec4 -> cf8a57d27961ce843a6b3801ccc51201
--   [45/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_en : 1 subst. ; 15423 -> 15425 car. ; md5 6d3bd0f546ac82d91d17fa4b18160efe -> b36f66e0c6ca4a7ecbec61ae4635f071
--   [46/62] salaire-suisse-net-frontalier-2026.content_fr : 1 subst. ; 13932 -> 13942 car. ; md5 22750bc4eaea6e2353f8a3a5b4108d37 -> a81f27c83096f31567725db9b32feaeb
--   [47/62] salaire-suisse-net-frontalier-2026.content_en : 1 subst. ; 11229 -> 11242 car. ; md5 6b7199efcade88f6f1ee47d1b54ff59f -> 952930f0f371885c0066203275c65678
--   [48/62] se-faire-reseau-geneve-arriver-seul.content_fr : 1 subst. ; 10721 -> 10728 car. ; md5 5f255786c31080dad2f46e841ff72e22 -> 2d4b970fecc46e8d877eadb098c5cd43
--   [49/62] se-faire-reseau-geneve-arriver-seul.content_en : 1 subst. ; 9683 -> 9685 car. ; md5 86f42944cba64a2f03cc86fd50793b26 -> 5aa4d833077af44d1640f7eb4c64589f
--   [50/62] teletravail-frontalier-geneve-regles-2026.content_fr : 1 subst. ; 11727 -> 11740 car. ; md5 cfbdbcb63089873de1331273fa7c34b7 -> 9d24bdf33b60c48968e28d9338e36891
--   [51/62] teletravail-frontalier-geneve-regles-2026.content_en : 1 subst. ; 10835 -> 10842 car. ; md5 478143470199e347eafe5d0faea06a65 -> 06d90f258b2b347d513f4663b09034ca
--   [52/62] temps-trajet-annemasse-geneve-par-quartier.content_fr : 1 subst. ; 9240 -> 9241 car. ; md5 9704b6cfc46258a26051912f9670fbb3 -> 137c997b5e48423f3c7562f16b54d8b2
--   [53/62] temps-trajet-annemasse-geneve-par-quartier.content_en : 1 subst. ; 8629 -> 8627 car. ; md5 fe56cc2f07f9aced97bcbb7ab04653b2 -> 5e50b97066de8f92f4a4b621ff62bd84
--   [54/62] transport-annemasse-geneve-leman-express.content_fr : 1 subst. ; 8451 -> 8459 car. ; md5 18d83d1451b3b6c5908f402cf8f946b0 -> ec1013dd9d8d3110ed5369358056d7fe
--   [55/62] trouver-colocation-geneve-frontalier.content_fr : 2 subst. ; 6302 -> 6323 car. ; md5 cfe95e5a61ce18b2a4d4f53ef99bedaa -> 647b7e68636b78fe11ec28eebfb120cc
--   [56/62] trouver-colocation-geneve-frontalier.content_en : 1 subst. ; 5892 -> 5905 car. ; md5 76bd3f5a06482f8f12a22d5de9129cab -> 76eb649b45c4c4e156c7e2c0134e5216
--   [57/62] trouver-logement-avant-d-arriver-geneve.content_fr : 1 subst. ; 14607 -> 14596 car. ; md5 776c47ed3dd36ffebd406b5e6bae0b70 -> 970eb45b0ce422ec5edcb50bc0e521a9
--   [58/62] trouver-logement-avant-d-arriver-geneve.content_en : 1 subst. ; 14108 -> 14092 car. ; md5 16e04c72f98037ba987174508fd3de2e -> 42191eb68554b67ddaf9038432b71f4e
--   [59/62] vie-quotidienne-frontalier-courses-sport-sorties.content_fr : 1 subst. ; 9467 -> 9474 car. ; md5 af287b3519f955fd47e458883f4d7cc8 -> feab38517cebf43149b63ab52f013ab7
--   [60/62] vie-quotidienne-frontalier-courses-sport-sorties.content_en : 1 subst. ; 8721 -> 8723 car. ; md5 20e241df350d8d51965294041a85dc9e -> e6103080cbff0e7ffba7635de81b3679
--   [61/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_fr : 1 subst. ; 12791 -> 12797 car. ; md5 e865b33e2b9e24530798e13dd60a1310 -> 566256ca07b180c5d9d1ff9248318fa6
--   [62/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_en : 1 subst. ; 12488 -> 12490 car. ; md5 0b3a6cc82f2385b22a1ac5681388807b -> 8149714ea63047bb21397affc67b942c
-- ============================================================================

BEGIN;

DO $retour$
DECLARE
  n integer;
  v text;
  ecarts text;
BEGIN
  -- 1. 33 articles, une ligne chacun
  SELECT count(*) INTO n FROM public.blog_posts WHERE slug IN ('arnaques-logement-frontalier-geneve-eviter', 'assurance-sante-frontalier-lamal-cmu-budget', 'banque-telephone-internet-frontalier-bons-plans', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-annemasse-geneve-frontaliers-avantages', 'coliving-colocation-ou-studio-geneve-comparatif', 'coliving-communaute-reels-amis-geneve-annemasse', 'coliving-frais-dossier-geneve-annemasse', 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'colocation-annemasse-ville-la-grand-ambilly', 'cout-transport-frontalier-geneve-2026', 'dossier-location-frontalier-suisse-france', 'espaces-verts-coliving-lodge-annemasse', 'fiscalite-frontalier-geneve-impots-2026', 'grand-geneve-2026-nouveautes-frontaliers', 'guide-ressources-frontalier-geneve', 'ia-solitude-lien-social-coliving', 'living-in-france-working-in-geneva', 'lodge-annemasse-coliving-premium-portes-geneve', 'non-la-villa-coliving-nest-pas-une-arnaque', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'salaire-suisse-net-frontalier-2026', 'se-faire-reseau-geneve-arriver-seul', 'teletravail-frontalier-geneve-regles-2026', 'temps-trajet-annemasse-geneve-par-quartier', 'transport-annemasse-geneve-leman-express', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve', 'vie-quotidienne-frontalier-courses-sport-sorties', 'vivre-a-annemasse-quand-on-travaille-a-geneve');
  IF n <> 33 THEN RAISE EXCEPTION 'visite-articles retour arriere : % ligne(s) au lieu de 33 -- rien n''est ecrit', n; END IF;
  -- 2. garde d'entree : md5 complet de chaque champ = etat attendu apres la seance
  SELECT string_agg(e.slug || '.' || e.champ, ', ' ORDER BY e.slug, e.champ) INTO ecarts FROM (VALUES
    ('arnaques-logement-frontalier-geneve-eviter', 'content_fr', '421193cb93ac811068719b6e80379f25'),
    ('arnaques-logement-frontalier-geneve-eviter', 'content_en', 'ebb5f9e3e8bfa6f512bb3fd19a930379'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'content_fr', '462f14df0e91aac44e1f7849b3ff859a'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'content_en', 'ebad1e57236ac6038cdc4cda178df16e'),
    ('banque-telephone-internet-frontalier-bons-plans', 'content_fr', '64cfd1ef0292e4ac8bd6a99ee176b237'),
    ('banque-telephone-internet-frontalier-bons-plans', 'content_en', '22d34f36cc5719598520195715bde521'),
    ('budget-colocation-geneve-guide-complet', 'content_fr', 'b1d4ba71e554b6d902568aa4e0cb6edf'),
    ('budget-colocation-geneve-guide-complet', 'content_en', 'd9923621649c469c785f9477a0a5a6ce'),
    ('choc-culturel-franco-suisse-expatrie-geneve', 'content_fr', '7d83440c304812118e2760265bf18ff3'),
    ('choc-culturel-franco-suisse-expatrie-geneve', 'content_en', '874b0de4456e9981acbba5f3301b674f'),
    ('coliving-annemasse-geneve-frontaliers-avantages', 'content_fr', '86de3563aa27a33f5cccb708e8a2143c'),
    ('coliving-annemasse-geneve-frontaliers-avantages', 'content_en', '947df784366680e1944547cc09a44adc'),
    ('coliving-colocation-ou-studio-geneve-comparatif', 'content_fr', '930668c2cdd287e5ba2635eb194c9f48'),
    ('coliving-colocation-ou-studio-geneve-comparatif', 'content_en', 'ef081b6bf8f474db3a7768261fcefd1b'),
    ('coliving-communaute-reels-amis-geneve-annemasse', 'content_fr', 'f5629db0f3163d21a4efe38e72f45099'),
    ('coliving-communaute-reels-amis-geneve-annemasse', 'content_en', '94afbbcd59dc0703857a9fb6d15ca6d8'),
    ('coliving-frais-dossier-geneve-annemasse', 'content_fr', '3f8438674919323dc78b8ff498815f78'),
    ('coliving-frais-dossier-geneve-annemasse', 'content_en', '0155d81fd699348a87f3736d67771ebb'),
    ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'content_fr', '9c7fa5e10c0250610453f58d0bb34282'),
    ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'content_en', '0f91d57d8a59cd556f24fc990b1aabff'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'content_fr', 'ba2ff875fc62fcce502101770bb7120c'),
    ('cout-transport-frontalier-geneve-2026', 'content_fr', '7f810ca06a9788323fad6f08ce778a38'),
    ('cout-transport-frontalier-geneve-2026', 'content_en', 'b9b10af172ca3c132975ad4c4b583a68'),
    ('dossier-location-frontalier-suisse-france', 'content_fr', 'cea73ddf37342422bae6a8ae37932136'),
    ('dossier-location-frontalier-suisse-france', 'content_en', '784e3b1b5f6fbbd48e032b4119d0417c'),
    ('espaces-verts-coliving-lodge-annemasse', 'content_fr', '868364a8d3c11b30e1d3d72018f61d83'),
    ('espaces-verts-coliving-lodge-annemasse', 'content_en', 'bdb7d5c1dbeb8578cc9b35cb9ed7c110'),
    ('fiscalite-frontalier-geneve-impots-2026', 'content_fr', '6dcab202f709f1bb0b9f43bccd91ae6e'),
    ('fiscalite-frontalier-geneve-impots-2026', 'content_en', '7cf38cf7ddd02c989801430a1a5ce8fa'),
    ('grand-geneve-2026-nouveautes-frontaliers', 'content_fr', '118c2871bfadd8871aba39d8b57a013b'),
    ('guide-ressources-frontalier-geneve', 'content_fr', '363544b549f614f77ac335a513c9393d'),
    ('guide-ressources-frontalier-geneve', 'content_en', '816c2011d4208287df2c67c28e33434a'),
    ('ia-solitude-lien-social-coliving', 'content_fr', 'ce8cdf824419ff68d0ee74eb5787e853'),
    ('ia-solitude-lien-social-coliving', 'content_en', 'a314c25c7a3c136375b948ae1f5dc444'),
    ('living-in-france-working-in-geneva', 'content_fr', '77360b9c15f389c6ca5d00b0ce60e440'),
    ('lodge-annemasse-coliving-premium-portes-geneve', 'content_fr', '653fa950f876d37cf0e77391653ec2df'),
    ('lodge-annemasse-coliving-premium-portes-geneve', 'content_en', '446fe06be4794ec06827f0f08089defd'),
    ('non-la-villa-coliving-nest-pas-une-arnaque', 'content_fr', '902cbd6463b9be2a76995439414ddb28'),
    ('non-la-villa-coliving-nest-pas-une-arnaque', 'content_en', '0d83c2f4d59b95d6c651dc676941ed20'),
    ('organisations-internationales-geneve-ou-habiter', 'content_fr', 'b71bebeae2db2aed4be4431387a95865'),
    ('organisations-internationales-geneve-ou-habiter', 'content_en', '4c2993940c9ab8e054c09f6c2c77aa78'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'content_fr', '728830e3268710fedcda0d1cc2e8944c'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'content_en', '2bb0b68bbd498c60281e07594aa4ebd1'),
    ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', 'cf8a57d27961ce843a6b3801ccc51201'),
    ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', 'b36f66e0c6ca4a7ecbec61ae4635f071'),
    ('salaire-suisse-net-frontalier-2026', 'content_fr', 'a81f27c83096f31567725db9b32feaeb'),
    ('salaire-suisse-net-frontalier-2026', 'content_en', '952930f0f371885c0066203275c65678'),
    ('se-faire-reseau-geneve-arriver-seul', 'content_fr', '2d4b970fecc46e8d877eadb098c5cd43'),
    ('se-faire-reseau-geneve-arriver-seul', 'content_en', '5aa4d833077af44d1640f7eb4c64589f'),
    ('teletravail-frontalier-geneve-regles-2026', 'content_fr', '9d24bdf33b60c48968e28d9338e36891'),
    ('teletravail-frontalier-geneve-regles-2026', 'content_en', '06d90f258b2b347d513f4663b09034ca'),
    ('temps-trajet-annemasse-geneve-par-quartier', 'content_fr', '137c997b5e48423f3c7562f16b54d8b2'),
    ('temps-trajet-annemasse-geneve-par-quartier', 'content_en', '5e50b97066de8f92f4a4b621ff62bd84'),
    ('transport-annemasse-geneve-leman-express', 'content_fr', 'ec1013dd9d8d3110ed5369358056d7fe'),
    ('trouver-colocation-geneve-frontalier', 'content_fr', '647b7e68636b78fe11ec28eebfb120cc'),
    ('trouver-colocation-geneve-frontalier', 'content_en', '76eb649b45c4c4e156c7e2c0134e5216'),
    ('trouver-logement-avant-d-arriver-geneve', 'content_fr', '970eb45b0ce422ec5edcb50bc0e521a9'),
    ('trouver-logement-avant-d-arriver-geneve', 'content_en', '42191eb68554b67ddaf9038432b71f4e'),
    ('vie-quotidienne-frontalier-courses-sport-sorties', 'content_fr', 'feab38517cebf43149b63ab52f013ab7'),
    ('vie-quotidienne-frontalier-courses-sport-sorties', 'content_en', 'e6103080cbff0e7ffba7635de81b3679'),
    ('vivre-a-annemasse-quand-on-travaille-a-geneve', 'content_fr', '566256ca07b180c5d9d1ff9248318fa6'),
    ('vivre-a-annemasse-quand-on-travaille-a-geneve', 'content_en', '8149714ea63047bb21397affc67b942c')
  ) AS e(slug, champ, md5_attendu)
  LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(CASE e.champ WHEN 'content_fr' THEN b.content_fr WHEN 'content_en' THEN b.content_en END) IS DISTINCT FROM e.md5_attendu;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'visite-articles retour arriere : champ(s) different(s) de l''etat attendu, rien n''est ecrit -- %', ecarts; END IF;
  -- 3. 62 champs, un par un
  -- [1/62] arnaques-logement-frontalier-geneve-eviter.content_fr : 1 substitution(s), 12675 -> 12659 caracteres
  --   annexe A no 1 - encadre final : "Candidate chez La Villa Coliving" -> "Programme une visite chez La Villa Coliving", sur place ou en video
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';
  v := replace(v, U&'[Programme une visite chez La Villa Coliving](/candidature) \2014 sur place ou en vid\00e9o, bail l\00e9gal, z\00e9ro mauvaise surprise.', U&'[Candidate chez La Villa Coliving](/candidature) \2014 visite sur place, bail l\00e9gal, z\00e9ro mauvaise surprise.');
  IF md5(v) IS DISTINCT FROM 'a0a272aa9f1e3c5e8b38f823ddfa3557' THEN RAISE EXCEPTION 'visite-articles retour arriere [1/62] arnaques-logement-frontalier-geneve-eviter.content_fr : resultat calcule md5 % au lieu de a0a272aa9f1e3c5e8b38f823ddfa3557 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'arnaques-logement-frontalier-geneve-eviter' AND md5(content_fr) = '421193cb93ac811068719b6e80379f25';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [1/62] arnaques-logement-frontalier-geneve-eviter.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [2/62] arnaques-logement-frontalier-geneve-eviter.content_en : 1 substitution(s), 11506 -> 11494 caracteres
  --   appendix A no. 1 - closing box: "Apply to La Villa Coliving" -> "Book a visit at La Villa Coliving", on site or by video
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';
  v := replace(v, U&'[Book a visit at La Villa Coliving](/en/candidature) \2014 on site or by video, legal lease, zero nasty surprises.', U&'[Apply to La Villa Coliving](/en/candidature) \2014 on-site visits, legal lease, zero nasty surprises.');
  IF md5(v) IS DISTINCT FROM '8aa16939a7d1726ad26db227306ec84c' THEN RAISE EXCEPTION 'visite-articles retour arriere [2/62] arnaques-logement-frontalier-geneve-eviter.content_en : resultat calcule md5 % au lieu de 8aa16939a7d1726ad26db227306ec84c -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'arnaques-logement-frontalier-geneve-eviter' AND md5(content_en) = 'ebb5f9e3e8bfa6f512bb3fd19a930379';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [2/62] arnaques-logement-frontalier-geneve-eviter.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [3/62] assurance-sante-frontalier-lamal-cmu-budget.content_fr : 1 substitution(s), 9602 -> 9601 caracteres
  --   annexe A no 2 - lien final "postule directement" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
  v := replace(v, U&'[programme une visite](/candidature)', U&'[postule directement](/candidature)');
  IF md5(v) IS DISTINCT FROM '1a4b3fe8451a9e722ac75060d0151544' THEN RAISE EXCEPTION 'visite-articles retour arriere [3/62] assurance-sante-frontalier-lamal-cmu-budget.content_fr : resultat calcule md5 % au lieu de 1a4b3fe8451a9e722ac75060d0151544 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget' AND md5(content_fr) = '462f14df0e91aac44e1f7849b3ff859a';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [3/62] assurance-sante-frontalier-lamal-cmu-budget.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [4/62] assurance-sante-frontalier-lamal-cmu-budget.content_en : 1 substitution(s), 9051 -> 9053 caracteres
  --   appendix A no. 2 - closing link "apply directly" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
  v := replace(v, U&'[book a visit](/en/candidature)', U&'[apply directly](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '09e8e5060862b513b248866d6bc6b298' THEN RAISE EXCEPTION 'visite-articles retour arriere [4/62] assurance-sante-frontalier-lamal-cmu-budget.content_en : resultat calcule md5 % au lieu de 09e8e5060862b513b248866d6bc6b298 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget' AND md5(content_en) = 'ebad1e57236ac6038cdc4cda178df16e';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [4/62] assurance-sante-frontalier-lamal-cmu-budget.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [5/62] banque-telephone-internet-frontalier-bons-plans.content_fr : 1 substitution(s), 10163 -> 10156 caracteres
  --   annexe A no 3 - lien final "candidate ici" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';
  v := replace(v, U&'[programme une visite](/candidature)', U&'[candidate ici](/candidature)');
  IF md5(v) IS DISTINCT FROM '3e2150ef4e0ab67da199abe57c267f1f' THEN RAISE EXCEPTION 'visite-articles retour arriere [5/62] banque-telephone-internet-frontalier-bons-plans.content_fr : resultat calcule md5 % au lieu de 3e2150ef4e0ab67da199abe57c267f1f -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'banque-telephone-internet-frontalier-bons-plans' AND md5(content_fr) = '64cfd1ef0292e4ac8bd6a99ee176b237';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [5/62] banque-telephone-internet-frontalier-bons-plans.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [6/62] banque-telephone-internet-frontalier-bons-plans.content_en : 1 substitution(s), 9418 -> 9416 caracteres
  --   appendix A no. 3 - closing link "apply here" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';
  v := replace(v, U&'[book a visit](/en/candidature)', U&'[apply here](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'd157a0dc3f237107a45f00036c0080f3' THEN RAISE EXCEPTION 'visite-articles retour arriere [6/62] banque-telephone-internet-frontalier-bons-plans.content_en : resultat calcule md5 % au lieu de d157a0dc3f237107a45f00036c0080f3 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'banque-telephone-internet-frontalier-bons-plans' AND md5(content_en) = '22d34f36cc5719598520195715bde521';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [6/62] banque-telephone-internet-frontalier-bons-plans.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [7/62] budget-colocation-geneve-guide-complet.content_fr : 2 substitution(s), 25342 -> 25343 caracteres
  --   annexe A no 4 - "depose ta [candidature en 2 minutes]" -> "[demande ta visite en 2 minutes]"
  --   annexe A no 4 - "candidater des maintenant pour figurer sur la liste d'attente" -> "te manifester des maintenant..."
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'budget-colocation-geneve-guide-complet';
  v := replace(v, U&'ou [demande ta visite en 2 minutes](https://www.lavillacoliving.com/candidature)', U&'ou d\00e9pose ta [candidature en 2 minutes](https://www.lavillacoliving.com/candidature)');
  v := replace(v, U&'la meilleure strat\00e9gie est de te manifester d\00e8s maintenant pour figurer sur la liste d''attente', U&'la meilleure strat\00e9gie est de candidater d\00e8s maintenant pour figurer sur la liste d''attente');
  IF md5(v) IS DISTINCT FROM '6e1cb671a0ccb8a1958ca70d4046ac01' THEN RAISE EXCEPTION 'visite-articles retour arriere [7/62] budget-colocation-geneve-guide-complet.content_fr : resultat calcule md5 % au lieu de 6e1cb671a0ccb8a1958ca70d4046ac01 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet' AND md5(content_fr) = 'b1d4ba71e554b6d902568aa4e0cb6edf';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [7/62] budget-colocation-geneve-guide-complet.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [8/62] budget-colocation-geneve-guide-complet.content_en : 2 substitution(s), 21221 -> 21219 caracteres
  --   appendix A no. 4 - "submit your [application in 2 minutes]" -> "[request your visit in 2 minutes]"
  --   appendix A no. 4 - "apply now to get on the waiting list" -> "get in touch now..."
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'budget-colocation-geneve-guide-complet';
  v := replace(v, U&'or [request your visit in 2 minutes](https://www.lavillacoliving.com/en/candidature)', U&'or submit your [application in 2 minutes](https://www.lavillacoliving.com/en/candidature)');
  v := replace(v, U&'the best strategy is to get in touch now to get on the waiting list', U&'the best strategy is to apply now to get on the waiting list');
  IF md5(v) IS DISTINCT FROM '19b1894b952eb95c042e8acbc360b40f' THEN RAISE EXCEPTION 'visite-articles retour arriere [8/62] budget-colocation-geneve-guide-complet.content_en : resultat calcule md5 % au lieu de 19b1894b952eb95c042e8acbc360b40f -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet' AND md5(content_en) = 'd9923621649c469c785f9477a0a5a6ce';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [8/62] budget-colocation-geneve-guide-complet.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [9/62] choc-culturel-franco-suisse-expatrie-geneve.content_fr : 1 substitution(s), 10982 -> 10975 caracteres
  --   annexe A no 5 - lien final "candidate ici" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve';
  v := replace(v, U&'[programme une visite](/candidature)', U&'[candidate ici](/candidature)');
  IF md5(v) IS DISTINCT FROM '021c53edee917447a40717d4cb3d40a2' THEN RAISE EXCEPTION 'visite-articles retour arriere [9/62] choc-culturel-franco-suisse-expatrie-geneve.content_fr : resultat calcule md5 % au lieu de 021c53edee917447a40717d4cb3d40a2 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve' AND md5(content_fr) = '7d83440c304812118e2760265bf18ff3';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [9/62] choc-culturel-franco-suisse-expatrie-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [10/62] choc-culturel-franco-suisse-expatrie-geneve.content_en : 1 substitution(s), 10316 -> 10314 caracteres
  --   appendix A no. 5 - closing link "apply here" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve';
  v := replace(v, U&'[book a visit](/en/candidature)', U&'[apply here](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '63b4e154230f8eb6e765cc87d4a64eff' THEN RAISE EXCEPTION 'visite-articles retour arriere [10/62] choc-culturel-franco-suisse-expatrie-geneve.content_en : resultat calcule md5 % au lieu de 63b4e154230f8eb6e765cc87d4a64eff -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve' AND md5(content_en) = '874b0de4456e9981acbba5f3301b674f';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [10/62] choc-culturel-franco-suisse-expatrie-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [11/62] coliving-annemasse-geneve-frontaliers-avantages.content_fr : 1 substitution(s), 12746 -> 12736 caracteres
  --   annexe A no 6 - "Postule en 2 minutes" -> "Demande ta visite en 2 minutes"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages';
  v := replace(v, U&'[Demande ta visite en 2 minutes](/candidature)', U&'[Postule en 2 minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM 'd1dbc5fd76720a86e05c5759337b449d' THEN RAISE EXCEPTION 'visite-articles retour arriere [11/62] coliving-annemasse-geneve-frontaliers-avantages.content_fr : resultat calcule md5 % au lieu de d1dbc5fd76720a86e05c5759337b449d -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages' AND md5(content_fr) = '86de3563aa27a33f5cccb708e8a2143c';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [11/62] coliving-annemasse-geneve-frontaliers-avantages.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [12/62] coliving-annemasse-geneve-frontaliers-avantages.content_en : 1 substitution(s), 11888 -> 11875 caracteres
  --   appendix A no. 6 - "Apply in 2 minutes" -> "Request your visit in 2 minutes"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages';
  v := replace(v, U&'[Request your visit in 2 minutes](/en/candidature)', U&'[Apply in 2 minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'f1b79e724e88add74f990474f97d37b3' THEN RAISE EXCEPTION 'visite-articles retour arriere [12/62] coliving-annemasse-geneve-frontaliers-avantages.content_en : resultat calcule md5 % au lieu de f1b79e724e88add74f990474f97d37b3 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages' AND md5(content_en) = '947df784366680e1944547cc09a44adc';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [12/62] coliving-annemasse-geneve-frontaliers-avantages.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [13/62] coliving-colocation-ou-studio-geneve-comparatif.content_fr : 3 substitution(s), 14338 -> 14350 caracteres
  --   annexe A no 7 (3/3) - FAQ "72 h" : "candidature en deux minutes" -> "demande en deux minutes"
  --   annexe A no 7 (2/3) - lien "candidature en deux minutes" -> "demande en deux minutes"
  --   annexe A no 7 (1/3) - verdict "nouveau job" : "candidature en deux minutes" -> "demande en deux minutes"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif';
  v := replace(v, U&'si une chambre est disponible : demande en deux minutes, r\00e9ponse sous 48 h', U&'si une chambre est disponible : candidature en deux minutes, r\00e9ponse sous 48 h');
  v := replace(v, U&'[demande en deux minutes](/candidature)', U&'[candidature en deux minutes](/candidature)');
  v := replace(v, U&'pas dans un magasin de meubles : demande en deux minutes, r\00e9ponse sous 48 h', U&'pas dans un magasin de meubles : candidature en deux minutes, r\00e9ponse sous 48 h');
  IF md5(v) IS DISTINCT FROM '75763563cd668930542f6246bf5309ec' THEN RAISE EXCEPTION 'visite-articles retour arriere [13/62] coliving-colocation-ou-studio-geneve-comparatif.content_fr : resultat calcule md5 % au lieu de 75763563cd668930542f6246bf5309ec -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif' AND md5(content_fr) = '930668c2cdd287e5ba2635eb194c9f48';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [13/62] coliving-colocation-ou-studio-geneve-comparatif.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [14/62] coliving-colocation-ou-studio-geneve-comparatif.content_en : 3 substitution(s), 13851 -> 13863 caracteres
  --   appendix A no. 7 (3/3) - "72 h" FAQ: "a two-minute application" -> "a two-minute request"
  --   appendix A no. 7 (2/3) - link "a two-minute application" -> "a two-minute request"
  --   appendix A no. 7 (1/3) - "new job" verdict: "a two-minute application" -> "a two-minute request"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif';
  v := replace(v, U&'if a room is available: a two-minute request, a reply within 48 h', U&'if a room is available: a two-minute application, a reply within 48 h');
  v := replace(v, U&'[a two-minute request](/en/candidature)', U&'[a two-minute application](/en/candidature)');
  v := replace(v, U&'not in a furniture store: a two-minute request, a reply within 48 h', U&'not in a furniture store: a two-minute application, a reply within 48 h');
  IF md5(v) IS DISTINCT FROM 'e2039f8a3fd0cb9b72b945f8254177d2' THEN RAISE EXCEPTION 'visite-articles retour arriere [14/62] coliving-colocation-ou-studio-geneve-comparatif.content_en : resultat calcule md5 % au lieu de e2039f8a3fd0cb9b72b945f8254177d2 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif' AND md5(content_en) = 'ef081b6bf8f474db3a7768261fcefd1b';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [14/62] coliving-colocation-ou-studio-geneve-comparatif.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [15/62] coliving-communaute-reels-amis-geneve-annemasse.content_fr : 1 substitution(s), 11089 -> 11078 caracteres
  --   annexe A no 8 - "Candidate des maintenant" -> "Programme une visite des maintenant"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse';
  v := replace(v, U&'[Programme une visite d\00e8s maintenant](/candidature)', U&'[Candidate d\00e8s maintenant](/candidature)');
  IF md5(v) IS DISTINCT FROM '06a1c4140726bd66b76972347543e208' THEN RAISE EXCEPTION 'visite-articles retour arriere [15/62] coliving-communaute-reels-amis-geneve-annemasse.content_fr : resultat calcule md5 % au lieu de 06a1c4140726bd66b76972347543e208 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse' AND md5(content_fr) = 'f5629db0f3163d21a4efe38e72f45099';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [15/62] coliving-communaute-reels-amis-geneve-annemasse.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [16/62] coliving-communaute-reels-amis-geneve-annemasse.content_en : 1 substitution(s), 9708 -> 9701 caracteres
  --   appendix A no. 8 - "Apply now" -> "Book a visit now"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse';
  v := replace(v, U&'[Book a visit now](/en/candidature)', U&'[Apply now](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'fd57faa8263716e11fddf5c2cb758e72' THEN RAISE EXCEPTION 'visite-articles retour arriere [16/62] coliving-communaute-reels-amis-geneve-annemasse.content_en : resultat calcule md5 % au lieu de fd57faa8263716e11fddf5c2cb758e72 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse' AND md5(content_en) = '94afbbcd59dc0703857a9fb6d15ca6d8';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [16/62] coliving-communaute-reels-amis-geneve-annemasse.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [17/62] coliving-frais-dossier-geneve-annemasse.content_fr : 1 substitution(s), 8237 -> 8229 caracteres
  --   annexe A no 9 - "candidate en 2 minutes, gratuitement" -> "demande ta visite en 2 minutes, gratuitement"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'coliving-frais-dossier-geneve-annemasse';
  v := replace(v, U&'[demande ta visite en 2 minutes, gratuitement](/candidature)', U&'[candidate en 2 minutes, gratuitement](/candidature)');
  IF md5(v) IS DISTINCT FROM '37a562375841619b0a852c7839e12727' THEN RAISE EXCEPTION 'visite-articles retour arriere [17/62] coliving-frais-dossier-geneve-annemasse.content_fr : resultat calcule md5 % au lieu de 37a562375841619b0a852c7839e12727 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'coliving-frais-dossier-geneve-annemasse' AND md5(content_fr) = '3f8438674919323dc78b8ff498815f78';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [17/62] coliving-frais-dossier-geneve-annemasse.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [18/62] coliving-frais-dossier-geneve-annemasse.content_en : 1 substitution(s), 7330 -> 7317 caracteres
  --   appendix A no. 9 - "apply in 2 minutes, for free" -> "request your visit in 2 minutes, for free"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'coliving-frais-dossier-geneve-annemasse';
  v := replace(v, U&'[request your visit in 2 minutes, for free](/en/candidature)', U&'[apply in 2 minutes, for free](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '8f5607d5683cbbcaea1c6257a4540779' THEN RAISE EXCEPTION 'visite-articles retour arriere [18/62] coliving-frais-dossier-geneve-annemasse.content_en : resultat calcule md5 % au lieu de 8f5607d5683cbbcaea1c6257a4540779 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'coliving-frais-dossier-geneve-annemasse' AND md5(content_en) = '0155d81fd699348a87f3736d67771ebb';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [18/62] coliving-frais-dossier-geneve-annemasse.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [19/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_fr : 1 substitution(s), 3936 -> 3926 caracteres
  --   annexe A no 10 - "Postule en 2 minutes" -> "Demande ta visite en 2 minutes"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie';
  v := replace(v, U&'[Demande ta visite en 2 minutes](/candidature)', U&'[Postule en 2 minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM '76e799c0daa4ed423a69550be39a8e15' THEN RAISE EXCEPTION 'visite-articles retour arriere [19/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_fr : resultat calcule md5 % au lieu de 76e799c0daa4ed423a69550be39a8e15 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' AND md5(content_fr) = '9c7fa5e10c0250610453f58d0bb34282';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [19/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [20/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_en : 1 substitution(s), 3818 -> 3805 caracteres
  --   appendix A no. 10 - "Apply in 2 minutes" -> "Request your visit in 2 minutes"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie';
  v := replace(v, U&'[Request your visit in 2 minutes](/en/candidature)', U&'[Apply in 2 minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '69627a8cacc9cb03d299fa62815a6782' THEN RAISE EXCEPTION 'visite-articles retour arriere [20/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_en : resultat calcule md5 % au lieu de 69627a8cacc9cb03d299fa62815a6782 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' AND md5(content_en) = '0f91d57d8a59cd556f24fc990b1aabff';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [20/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [21/62] colocation-annemasse-ville-la-grand-ambilly.content_fr : 1 substitution(s), 9104 -> 9096 caracteres
  --   annexe A no 11 - "Candidate en 2 minutes ->" -> "Demande ta visite en 2 minutes ->"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly';
  v := replace(v, U&'[Demande ta visite en 2 minutes \2192](/candidature)', U&'[Candidate en 2 minutes \2192](/candidature)');
  IF md5(v) IS DISTINCT FROM '83446efaedc38c1f81ee4483f0a764a6' THEN RAISE EXCEPTION 'visite-articles retour arriere [21/62] colocation-annemasse-ville-la-grand-ambilly.content_fr : resultat calcule md5 % au lieu de 83446efaedc38c1f81ee4483f0a764a6 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly' AND md5(content_fr) = 'ba2ff875fc62fcce502101770bb7120c';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [21/62] colocation-annemasse-ville-la-grand-ambilly.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [22/62] cout-transport-frontalier-geneve-2026.content_fr : 1 substitution(s), 9128 -> 9118 caracteres
  --   annexe A no 12 - "postule en 2 minutes" -> "demande ta visite en 2 minutes"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'cout-transport-frontalier-geneve-2026';
  v := replace(v, U&'[demande ta visite en 2 minutes](/candidature)', U&'[postule en 2 minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM '685ca45925c4ff36daf5bb8b3fc8260f' THEN RAISE EXCEPTION 'visite-articles retour arriere [22/62] cout-transport-frontalier-geneve-2026.content_fr : resultat calcule md5 % au lieu de 685ca45925c4ff36daf5bb8b3fc8260f -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'cout-transport-frontalier-geneve-2026' AND md5(content_fr) = '7f810ca06a9788323fad6f08ce778a38';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [22/62] cout-transport-frontalier-geneve-2026.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [23/62] cout-transport-frontalier-geneve-2026.content_en : 1 substitution(s), 8503 -> 8490 caracteres
  --   appendix A no. 12 - "apply in 2 minutes" -> "request your visit in 2 minutes"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'cout-transport-frontalier-geneve-2026';
  v := replace(v, U&'[request your visit in 2 minutes](/en/candidature)', U&'[apply in 2 minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '14bc08cbc63d4f9396ddb72289c25c7e' THEN RAISE EXCEPTION 'visite-articles retour arriere [23/62] cout-transport-frontalier-geneve-2026.content_en : resultat calcule md5 % au lieu de 14bc08cbc63d4f9396ddb72289c25c7e -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'cout-transport-frontalier-geneve-2026' AND md5(content_en) = 'b9b10af172ca3c132975ad4c4b583a68';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [23/62] cout-transport-frontalier-geneve-2026.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [24/62] dossier-location-frontalier-suisse-france.content_fr : 1 substitution(s), 9087 -> 9076 caracteres
  --   annexe A no 13 - "Candidate chez La Villa Coliving" -> "Programme une visite chez La Villa Coliving"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'dossier-location-frontalier-suisse-france';
  v := replace(v, U&'[Programme une visite chez La Villa Coliving](/candidature)', U&'[Candidate chez La Villa Coliving](/candidature)');
  IF md5(v) IS DISTINCT FROM '448c659713dcfa9faf20a282a69b001b' THEN RAISE EXCEPTION 'visite-articles retour arriere [24/62] dossier-location-frontalier-suisse-france.content_fr : resultat calcule md5 % au lieu de 448c659713dcfa9faf20a282a69b001b -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'dossier-location-frontalier-suisse-france' AND md5(content_fr) = 'cea73ddf37342422bae6a8ae37932136';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [24/62] dossier-location-frontalier-suisse-france.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [25/62] dossier-location-frontalier-suisse-france.content_en : 1 substitution(s), 8428 -> 8421 caracteres
  --   appendix A no. 13 - "Apply to La Villa Coliving" -> "Book a visit at La Villa Coliving"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'dossier-location-frontalier-suisse-france';
  v := replace(v, U&'[Book a visit at La Villa Coliving](/en/candidature)', U&'[Apply to La Villa Coliving](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '64ea66b19de7121de19e062918f38668' THEN RAISE EXCEPTION 'visite-articles retour arriere [25/62] dossier-location-frontalier-suisse-france.content_en : resultat calcule md5 % au lieu de 64ea66b19de7121de19e062918f38668 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'dossier-location-frontalier-suisse-france' AND md5(content_en) = '784e3b1b5f6fbbd48e032b4119d0417c';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [25/62] dossier-location-frontalier-suisse-france.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [26/62] espaces-verts-coliving-lodge-annemasse.content_fr : 1 substitution(s), 3553 -> 3543 caracteres
  --   annexe A no 14 - "postule en 2 minutes" -> "demande ta visite en 2 minutes"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'espaces-verts-coliving-lodge-annemasse';
  v := replace(v, U&'[demande ta visite en 2 minutes](/candidature)', U&'[postule en 2 minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM '85f9684e3e9981a48e329ea210af6c6f' THEN RAISE EXCEPTION 'visite-articles retour arriere [26/62] espaces-verts-coliving-lodge-annemasse.content_fr : resultat calcule md5 % au lieu de 85f9684e3e9981a48e329ea210af6c6f -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'espaces-verts-coliving-lodge-annemasse' AND md5(content_fr) = '868364a8d3c11b30e1d3d72018f61d83';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [26/62] espaces-verts-coliving-lodge-annemasse.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [27/62] espaces-verts-coliving-lodge-annemasse.content_en : 1 substitution(s), 3271 -> 3258 caracteres
  --   appendix A no. 14 - "apply in 2 minutes" -> "request your visit in 2 minutes"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'espaces-verts-coliving-lodge-annemasse';
  v := replace(v, U&'[request your visit in 2 minutes](/en/candidature)', U&'[apply in 2 minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'b43508604e3ff9967d8a6aa09013bd24' THEN RAISE EXCEPTION 'visite-articles retour arriere [27/62] espaces-verts-coliving-lodge-annemasse.content_en : resultat calcule md5 % au lieu de b43508604e3ff9967d8a6aa09013bd24 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'espaces-verts-coliving-lodge-annemasse' AND md5(content_en) = 'bdb7d5c1dbeb8578cc9b35cb9ed7c110';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [27/62] espaces-verts-coliving-lodge-annemasse.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [28/62] fiscalite-frontalier-geneve-impots-2026.content_fr : 1 substitution(s), 10725 -> 10726 caracteres
  --   annexe A no 15 - "depose ta [candidature]" -> "[programme une visite]"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
  v := replace(v, U&'ou [programme une visite](/candidature)', U&'ou d\00e9pose ta [candidature](/candidature)');
  IF md5(v) IS DISTINCT FROM '66e071d1a76a875e1cfd14f2f15f2d48' THEN RAISE EXCEPTION 'visite-articles retour arriere [28/62] fiscalite-frontalier-geneve-impots-2026.content_fr : resultat calcule md5 % au lieu de 66e071d1a76a875e1cfd14f2f15f2d48 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026' AND md5(content_fr) = '6dcab202f709f1bb0b9f43bccd91ae6e';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [28/62] fiscalite-frontalier-geneve-impots-2026.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [29/62] fiscalite-frontalier-geneve-impots-2026.content_en : 1 substitution(s), 10056 -> 10067 caracteres
  --   appendix A no. 15 - "submit your [application]" -> "[book a visit]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
  v := replace(v, U&'or [book a visit](/en/candidature)', U&'or submit your [application](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '97d11ac02770348b1e15e0332667b1c6' THEN RAISE EXCEPTION 'visite-articles retour arriere [29/62] fiscalite-frontalier-geneve-impots-2026.content_en : resultat calcule md5 % au lieu de 97d11ac02770348b1e15e0332667b1c6 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026' AND md5(content_en) = '7cf38cf7ddd02c989801430a1a5ce8fa';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [29/62] fiscalite-frontalier-geneve-impots-2026.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [30/62] grand-geneve-2026-nouveautes-frontaliers.content_fr : 1 substitution(s), 8686 -> 8678 caracteres
  --   annexe A no 16 - "Candidate en 2 minutes ->" -> "Demande ta visite en 2 minutes ->"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers';
  v := replace(v, U&'[Demande ta visite en 2 minutes \2192](/candidature)', U&'[Candidate en 2 minutes \2192](/candidature)');
  IF md5(v) IS DISTINCT FROM '837b05da46713e9ef2faf2d5e95cd1c3' THEN RAISE EXCEPTION 'visite-articles retour arriere [30/62] grand-geneve-2026-nouveautes-frontaliers.content_fr : resultat calcule md5 % au lieu de 837b05da46713e9ef2faf2d5e95cd1c3 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers' AND md5(content_fr) = '118c2871bfadd8871aba39d8b57a013b';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [30/62] grand-geneve-2026-nouveautes-frontaliers.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [31/62] guide-ressources-frontalier-geneve.content_fr : 1 substitution(s), 40531 -> 40523 caracteres
  --   annexe A no 17 - "candidate en quelques minutes, gratuitement" -> "demande ta visite en quelques minutes, gratuitement"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'guide-ressources-frontalier-geneve';
  v := replace(v, U&'[demande ta visite en quelques minutes, gratuitement](/candidature)', U&'[candidate en quelques minutes, gratuitement](/candidature)');
  IF md5(v) IS DISTINCT FROM '4e84b7b69337597b05f9364fb23b4ecd' THEN RAISE EXCEPTION 'visite-articles retour arriere [31/62] guide-ressources-frontalier-geneve.content_fr : resultat calcule md5 % au lieu de 4e84b7b69337597b05f9364fb23b4ecd -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'guide-ressources-frontalier-geneve' AND md5(content_fr) = '363544b549f614f77ac335a513c9393d';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [31/62] guide-ressources-frontalier-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [32/62] guide-ressources-frontalier-geneve.content_en : 1 substitution(s), 37373 -> 37360 caracteres
  --   appendix A no. 17 - "apply in a few minutes, for free" -> "request your visit in a few minutes, for free" (URL unchanged)
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'guide-ressources-frontalier-geneve';
  v := replace(v, U&'[request your visit in a few minutes, for free](/candidature)', U&'[apply in a few minutes, for free](/candidature)');
  IF md5(v) IS DISTINCT FROM '0ebd782c01bc887ae7f911c91fd3bbdd' THEN RAISE EXCEPTION 'visite-articles retour arriere [32/62] guide-ressources-frontalier-geneve.content_en : resultat calcule md5 % au lieu de 0ebd782c01bc887ae7f911c91fd3bbdd -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'guide-ressources-frontalier-geneve' AND md5(content_en) = '816c2011d4208287df2c67c28e33434a';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [32/62] guide-ressources-frontalier-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [33/62] ia-solitude-lien-social-coliving.content_fr : 1 substitution(s), 11874 -> 11865 caracteres
  --   annexe A no 18 - "candidate en ligne" -> "demande une visite en ligne"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'ia-solitude-lien-social-coliving';
  v := replace(v, U&'[demande une visite en ligne](/candidature)', U&'[candidate en ligne](/candidature)');
  IF md5(v) IS DISTINCT FROM '01e5c5f389f2793f3841fba29a7c385e' THEN RAISE EXCEPTION 'visite-articles retour arriere [33/62] ia-solitude-lien-social-coliving.content_fr : resultat calcule md5 % au lieu de 01e5c5f389f2793f3841fba29a7c385e -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'ia-solitude-lien-social-coliving' AND md5(content_fr) = 'ce8cdf824419ff68d0ee74eb5787e853';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [33/62] ia-solitude-lien-social-coliving.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [34/62] ia-solitude-lien-social-coliving.content_en : 1 substitution(s), 11137 -> 11130 caracteres
  --   appendix A no. 18 - "apply online" -> "book a visit online"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'ia-solitude-lien-social-coliving';
  v := replace(v, U&'[book a visit online](/en/candidature)', U&'[apply online](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '4930e9a0921fe2d8873772875fed3389' THEN RAISE EXCEPTION 'visite-articles retour arriere [34/62] ia-solitude-lien-social-coliving.content_en : resultat calcule md5 % au lieu de 4930e9a0921fe2d8873772875fed3389 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'ia-solitude-lien-social-coliving' AND md5(content_en) = 'a314c25c7a3c136375b948ae1f5dc444';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [34/62] ia-solitude-lien-social-coliving.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [35/62] living-in-france-working-in-geneva.content_fr : 1 substitution(s), 17706 -> 17698 caracteres
  --   annexe A no 19 - "Candidate en 2 minutes ->" -> "Demande ta visite en 2 minutes ->"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'living-in-france-working-in-geneva';
  v := replace(v, U&'[Demande ta visite en 2 minutes \2192](/candidature)', U&'[Candidate en 2 minutes \2192](/candidature)');
  IF md5(v) IS DISTINCT FROM '8ca01ef2e6f54803102ef8b3719f92a7' THEN RAISE EXCEPTION 'visite-articles retour arriere [35/62] living-in-france-working-in-geneva.content_fr : resultat calcule md5 % au lieu de 8ca01ef2e6f54803102ef8b3719f92a7 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'living-in-france-working-in-geneva' AND md5(content_fr) = '77360b9c15f389c6ca5d00b0ce60e440';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [35/62] living-in-france-working-in-geneva.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [36/62] lodge-annemasse-coliving-premium-portes-geneve.content_fr : 2 substitution(s), 15160 -> 15231 caracteres
  --   annexe A no 20 - conclusion : "[candidate directement] pour verifier la disponibilite" -> "[programme une visite] : on verifie avec toi les chambres d
  --   annexe A no 20 - etape 1 : "Tu remplis le [formulaire de candidature]... ton profil..." -> "Tu [demandes ta visite en ligne] : prenom, nom, email et t
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve';
  v := replace(v, U&'ou [programme une visite](/candidature) : on v\00e9rifie avec toi les chambres disponibles.', U&'ou [candidate directement](/candidature) pour v\00e9rifier la disponibilit\00e9 des chambres.');
  v := replace(v, U&'Tu [demandes ta visite en ligne](/candidature) : pr\00e9nom, nom, email et t\00e9l\00e9phone, deux minutes.', U&'Tu remplis le [formulaire de candidature](/candidature) en ligne en pr\00e9sentant ton profil, ta situation professionnelle et tes attentes vis-\00e0-vis de la vie en coliving.');
  IF md5(v) IS DISTINCT FROM '22c4f489d9f7b2e52b1850deeb91bd24' THEN RAISE EXCEPTION 'visite-articles retour arriere [36/62] lodge-annemasse-coliving-premium-portes-geneve.content_fr : resultat calcule md5 % au lieu de 22c4f489d9f7b2e52b1850deeb91bd24 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve' AND md5(content_fr) = '653fa950f876d37cf0e77391653ec2df';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [36/62] lodge-annemasse-coliving-premium-portes-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [37/62] lodge-annemasse-coliving-premium-portes-geneve.content_en : 2 substitution(s), 13519 -> 13561 caracteres
  --   appendix A no. 20 - conclusion: "[apply directly] to check room availability" -> "[book a visit]: we'll check room availability with you"
  --   appendix A no. 20 - step 1: "You fill in the online [application form] presenting your profile..." -> "You [book your visit online]: first name, last 
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve';
  v := replace(v, U&'or [book a visit](/en/candidature): we''ll check room availability with you.', U&'or [apply directly](/en/candidature) to check room availability.');
  v := replace(v, U&'You [book your visit online](/en/candidature): first name, last name, email and phone, two minutes.', U&'You fill in the online [application form](/en/candidature) presenting your profile, your professional situation, and what you expect from coliving life.');
  IF md5(v) IS DISTINCT FROM '39fe2e66bbded4b3298eb6c0d95dd3d2' THEN RAISE EXCEPTION 'visite-articles retour arriere [37/62] lodge-annemasse-coliving-premium-portes-geneve.content_en : resultat calcule md5 % au lieu de 39fe2e66bbded4b3298eb6c0d95dd3d2 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve' AND md5(content_en) = '446fe06be4794ec06827f0f08089defd';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [37/62] lodge-annemasse-coliving-premium-portes-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [38/62] non-la-villa-coliving-nest-pas-une-arnaque.content_fr : 2 substitution(s), 5585 -> 5580 caracteres
  --   annexe A no 21 - "Avant de candidater, trois lectures utiles" -> "Avant ta visite, trois lectures utiles"
  --   annexe A no 21 - etape 1 : "Tu [candidates en ligne]" -> "Tu [demandes une visite en ligne]"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque';
  v := replace(v, U&'Avant ta visite, trois lectures utiles', U&'Avant de candidater, trois lectures utiles');
  v := replace(v, U&'1. Tu [demandes une visite en ligne](/candidature), ou tu nous \00e9cris.', U&'1. Tu [candidates en ligne](/candidature), ou tu nous \00e9cris.');
  IF md5(v) IS DISTINCT FROM 'f775c5487c9c2e9e01accec0ca059eeb' THEN RAISE EXCEPTION 'visite-articles retour arriere [38/62] non-la-villa-coliving-nest-pas-une-arnaque.content_fr : resultat calcule md5 % au lieu de f775c5487c9c2e9e01accec0ca059eeb -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque' AND md5(content_fr) = '902cbd6463b9be2a76995439414ddb28';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [38/62] non-la-villa-coliving-nest-pas-une-arnaque.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [39/62] non-la-villa-coliving-nest-pas-une-arnaque.content_en : 2 substitution(s), 5135 -> 5127 caracteres
  --   appendix A no. 21 - "Before you apply, three useful reads" -> "Before your visit, three useful reads"
  --   appendix A no. 21 - step 1: "You [apply online]" -> "You [book a visit online]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque';
  v := replace(v, U&'Before your visit, three useful reads', U&'Before you apply, three useful reads');
  v := replace(v, U&'1. You [book a visit online](/en/candidature), or you message us.', U&'1. You [apply online](/en/candidature), or you message us.');
  IF md5(v) IS DISTINCT FROM '2f52c75a0be32fd11b4ab33fa8968ef9' THEN RAISE EXCEPTION 'visite-articles retour arriere [39/62] non-la-villa-coliving-nest-pas-une-arnaque.content_en : resultat calcule md5 % au lieu de 2f52c75a0be32fd11b4ab33fa8968ef9 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque' AND md5(content_en) = '0d83c2f4d59b95d6c651dc676941ed20';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [39/62] non-la-villa-coliving-nest-pas-une-arnaque.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [40/62] organisations-internationales-geneve-ou-habiter.content_fr : 2 substitution(s), 7460 -> 7455 caracteres
  --   annexe A no 22 - "Envoie ta candidature via notre [formulaire en ligne]" -> "Demande ta visite via notre [formulaire en ligne]"
  --   annexe A no 22 - titre "Comment candidater si tu es en poste OI" -> "Comment demander une visite si tu es en poste OI"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'organisations-internationales-geneve-ou-habiter';
  v := replace(v, U&'Demande ta visite via notre [formulaire en ligne](/candidature).', U&'Envoie ta candidature via notre [formulaire en ligne](/candidature).');
  v := replace(v, U&'## Comment demander une visite si tu es en poste OI', U&'## Comment candidater si tu es en poste OI');
  IF md5(v) IS DISTINCT FROM 'aa8c3e47ba6f02e6b75c63acc3bfc403' THEN RAISE EXCEPTION 'visite-articles retour arriere [40/62] organisations-internationales-geneve-ou-habiter.content_fr : resultat calcule md5 % au lieu de aa8c3e47ba6f02e6b75c63acc3bfc403 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'organisations-internationales-geneve-ou-habiter' AND md5(content_fr) = 'b71bebeae2db2aed4be4431387a95865';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [40/62] organisations-internationales-geneve-ou-habiter.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [41/62] organisations-internationales-geneve-ou-habiter.content_en : 2 substitution(s), 6835 -> 6833 caracteres
  --   appendix A no. 22 - "Submit your application via our [online form]" -> "Request your visit via our [online form]"
  --   appendix A no. 22 - heading "How to apply if you're in an IO position" -> "How to book a visit if you're in an IO position"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'organisations-internationales-geneve-ou-habiter';
  v := replace(v, U&'Request your visit via our [online form](/en/candidature).', U&'Submit your application via our [online form](/en/candidature).');
  v := replace(v, U&'## How to book a visit if you''re in an IO position', U&'## How to apply if you''re in an IO position');
  IF md5(v) IS DISTINCT FROM '0153c8d996c3fcc27f099f0fd17d62f5' THEN RAISE EXCEPTION 'visite-articles retour arriere [41/62] organisations-internationales-geneve-ou-habiter.content_en : resultat calcule md5 % au lieu de 0153c8d996c3fcc27f099f0fd17d62f5 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'organisations-internationales-geneve-ou-habiter' AND md5(content_en) = '4c2993940c9ab8e054c09f6c2c77aa78';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [41/62] organisations-internationales-geneve-ou-habiter.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [42/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_fr : 1 substitution(s), 15247 -> 15248 caracteres
  --   annexe A no 23 - "[la candidature se fait a distance]" -> "[la visite peut se faire en video]"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve';
  v := replace(v, U&'et [la visite peut se faire en vid\00e9o](/candidature).', U&'et [la candidature se fait \00e0 distance](/candidature).');
  IF md5(v) IS DISTINCT FROM '4d574f07ea1e3c5be550e3ee1432668b' THEN RAISE EXCEPTION 'visite-articles retour arriere [42/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_fr : resultat calcule md5 % au lieu de 4d574f07ea1e3c5be550e3ee1432668b -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve' AND md5(content_fr) = '728830e3268710fedcda0d1cc2e8944c';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [42/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [43/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_en : 1 substitution(s), 15079 -> 15079 caracteres
  --   appendix A no. 23 - "[you can apply remotely]" -> "[you can visit by video]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve';
  v := replace(v, U&'and [you can visit by video](/en/candidature).', U&'and [you can apply remotely](/en/candidature).');
  IF md5(v) IS DISTINCT FROM 'ed8beb6c19c7c4326304d24be1145e89' THEN RAISE EXCEPTION 'visite-articles retour arriere [43/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_en : resultat calcule md5 % au lieu de ed8beb6c19c7c4326304d24be1145e89 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve' AND md5(content_en) = '2bb0b68bbd498c60281e07594aa4ebd1';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [43/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [44/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_fr : 1 substitution(s), 15428 -> 15422 caracteres
  --   annexe A no 24 - "la [candidature prend deux minutes]" -> "la [demande de visite prend deux minutes]" (comme /tarifs)
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
  v := replace(v, U&'la [demande de visite prend deux minutes](/candidature)', U&'la [candidature prend deux minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM '7915537294651377c0b3ed1d54aaaec4' THEN RAISE EXCEPTION 'visite-articles retour arriere [44/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_fr : resultat calcule md5 % au lieu de 7915537294651377c0b3ed1d54aaaec4 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' AND md5(content_fr) = 'cf8a57d27961ce843a6b3801ccc51201';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [44/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [45/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_en : 1 substitution(s), 15425 -> 15423 caracteres
  --   appendix A no. 24 - "the [application takes two minutes]" -> "the [visit request takes two minutes]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
  v := replace(v, U&'the [visit request takes two minutes](/en/candidature)', U&'the [application takes two minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '6d3bd0f546ac82d91d17fa4b18160efe' THEN RAISE EXCEPTION 'visite-articles retour arriere [45/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_en : resultat calcule md5 % au lieu de 6d3bd0f546ac82d91d17fa4b18160efe -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' AND md5(content_en) = 'b36f66e0c6ca4a7ecbec61ae4635f071';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [45/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [46/62] salaire-suisse-net-frontalier-2026.content_fr : 1 substitution(s), 13942 -> 13932 caracteres
  --   annexe A no 26 - "Postule en 2 min" -> "Demande ta visite en 2 min"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'salaire-suisse-net-frontalier-2026';
  v := replace(v, U&'[Demande ta visite en 2 min](/candidature)', U&'[Postule en 2 min](/candidature)');
  IF md5(v) IS DISTINCT FROM '22750bc4eaea6e2353f8a3a5b4108d37' THEN RAISE EXCEPTION 'visite-articles retour arriere [46/62] salaire-suisse-net-frontalier-2026.content_fr : resultat calcule md5 % au lieu de 22750bc4eaea6e2353f8a3a5b4108d37 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'salaire-suisse-net-frontalier-2026' AND md5(content_fr) = 'a81f27c83096f31567725db9b32feaeb';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [46/62] salaire-suisse-net-frontalier-2026.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [47/62] salaire-suisse-net-frontalier-2026.content_en : 1 substitution(s), 11242 -> 11229 caracteres
  --   appendix A no. 26 - "Apply in 2 min" -> "Request your visit in 2 min"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'salaire-suisse-net-frontalier-2026';
  v := replace(v, U&'[Request your visit in 2 min](/en/candidature)', U&'[Apply in 2 min](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '6b7199efcade88f6f1ee47d1b54ff59f' THEN RAISE EXCEPTION 'visite-articles retour arriere [47/62] salaire-suisse-net-frontalier-2026.content_en : resultat calcule md5 % au lieu de 6b7199efcade88f6f1ee47d1b54ff59f -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'salaire-suisse-net-frontalier-2026' AND md5(content_en) = '952930f0f371885c0066203275c65678';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [47/62] salaire-suisse-net-frontalier-2026.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [48/62] se-faire-reseau-geneve-arriver-seul.content_fr : 1 substitution(s), 10728 -> 10721 caracteres
  --   annexe A no 27 - lien final "candidate ici" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'se-faire-reseau-geneve-arriver-seul';
  v := replace(v, U&'[programme une visite](/candidature)', U&'[candidate ici](/candidature)');
  IF md5(v) IS DISTINCT FROM '5f255786c31080dad2f46e841ff72e22' THEN RAISE EXCEPTION 'visite-articles retour arriere [48/62] se-faire-reseau-geneve-arriver-seul.content_fr : resultat calcule md5 % au lieu de 5f255786c31080dad2f46e841ff72e22 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'se-faire-reseau-geneve-arriver-seul' AND md5(content_fr) = '2d4b970fecc46e8d877eadb098c5cd43';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [48/62] se-faire-reseau-geneve-arriver-seul.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [49/62] se-faire-reseau-geneve-arriver-seul.content_en : 1 substitution(s), 9685 -> 9683 caracteres
  --   appendix A no. 27 - closing link "apply here" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'se-faire-reseau-geneve-arriver-seul';
  v := replace(v, U&'[book a visit](/en/candidature)', U&'[apply here](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '86f42944cba64a2f03cc86fd50793b26' THEN RAISE EXCEPTION 'visite-articles retour arriere [49/62] se-faire-reseau-geneve-arriver-seul.content_en : resultat calcule md5 % au lieu de 86f42944cba64a2f03cc86fd50793b26 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'se-faire-reseau-geneve-arriver-seul' AND md5(content_en) = '5aa4d833077af44d1640f7eb4c64589f';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [49/62] se-faire-reseau-geneve-arriver-seul.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [50/62] teletravail-frontalier-geneve-regles-2026.content_fr : 1 substitution(s), 11740 -> 11727 caracteres
  --   annexe A no 28 - lien final "postule" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
  v := replace(v, U&'[programme une visite](/candidature)', U&'[postule](/candidature)');
  IF md5(v) IS DISTINCT FROM 'cfbdbcb63089873de1331273fa7c34b7' THEN RAISE EXCEPTION 'visite-articles retour arriere [50/62] teletravail-frontalier-geneve-regles-2026.content_fr : resultat calcule md5 % au lieu de cfbdbcb63089873de1331273fa7c34b7 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026' AND md5(content_fr) = '9d24bdf33b60c48968e28d9338e36891';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [50/62] teletravail-frontalier-geneve-regles-2026.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [51/62] teletravail-frontalier-geneve-regles-2026.content_en : 1 substitution(s), 10842 -> 10835 caracteres
  --   appendix A no. 28 - closing link "apply" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
  v := replace(v, U&'[book a visit](/en/candidature)', U&'[apply](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '478143470199e347eafe5d0faea06a65' THEN RAISE EXCEPTION 'visite-articles retour arriere [51/62] teletravail-frontalier-geneve-regles-2026.content_en : resultat calcule md5 % au lieu de 478143470199e347eafe5d0faea06a65 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026' AND md5(content_en) = '06d90f258b2b347d513f4663b09034ca';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [51/62] teletravail-frontalier-geneve-regles-2026.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [52/62] temps-trajet-annemasse-geneve-par-quartier.content_fr : 1 substitution(s), 9241 -> 9240 caracteres
  --   annexe A no 29 - lien final "postule directement" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier';
  v := replace(v, U&'[programme une visite](/candidature)', U&'[postule directement](/candidature)');
  IF md5(v) IS DISTINCT FROM '9704b6cfc46258a26051912f9670fbb3' THEN RAISE EXCEPTION 'visite-articles retour arriere [52/62] temps-trajet-annemasse-geneve-par-quartier.content_fr : resultat calcule md5 % au lieu de 9704b6cfc46258a26051912f9670fbb3 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier' AND md5(content_fr) = '137c997b5e48423f3c7562f16b54d8b2';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [52/62] temps-trajet-annemasse-geneve-par-quartier.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [53/62] temps-trajet-annemasse-geneve-par-quartier.content_en : 1 substitution(s), 8627 -> 8629 caracteres
  --   appendix A no. 29 - closing link "apply directly" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier';
  v := replace(v, U&'[book a visit](/en/candidature)', U&'[apply directly](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'fe56cc2f07f9aced97bcbb7ab04653b2' THEN RAISE EXCEPTION 'visite-articles retour arriere [53/62] temps-trajet-annemasse-geneve-par-quartier.content_en : resultat calcule md5 % au lieu de fe56cc2f07f9aced97bcbb7ab04653b2 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier' AND md5(content_en) = '5e50b97066de8f92f4a4b621ff62bd84';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [53/62] temps-trajet-annemasse-geneve-par-quartier.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [54/62] transport-annemasse-geneve-leman-express.content_fr : 1 substitution(s), 8459 -> 8451 caracteres
  --   annexe A no 30 - "Candidate en 2 minutes ->" -> "Demande ta visite en 2 minutes ->"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'transport-annemasse-geneve-leman-express';
  v := replace(v, U&'[Demande ta visite en 2 minutes \2192](/candidature)', U&'[Candidate en 2 minutes \2192](/candidature)');
  IF md5(v) IS DISTINCT FROM '18d83d1451b3b6c5908f402cf8f946b0' THEN RAISE EXCEPTION 'visite-articles retour arriere [54/62] transport-annemasse-geneve-leman-express.content_fr : resultat calcule md5 % au lieu de 18d83d1451b3b6c5908f402cf8f946b0 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'transport-annemasse-geneve-leman-express' AND md5(content_fr) = 'ec1013dd9d8d3110ed5369358056d7fe';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [54/62] transport-annemasse-geneve-leman-express.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [55/62] trouver-colocation-geneve-frontalier.content_fr : 2 substitution(s), 6323 -> 6302 caracteres
  --   annexe A no 31 - "postule en 2 minutes" -> "demande ta visite en 2 minutes" (adresse ?src=bloc_offre inchangee)
  --   annexe A no 31 - intro : "voir les chambres libres et candidater" -> "... et programmer une visite" (ancre exacte du lien inchangee)
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'trouver-colocation-geneve-frontalier';
  v := replace(v, U&'[demande ta visite en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)', U&'[postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)');
  v := replace(v, U&'voir les chambres libres et programmer une visite, va sur notre page [colocation \00e0 Gen\00e8ve c\00f4t\00e9 France](/colocation-geneve)', U&'voir les chambres libres et candidater, va sur notre page [colocation \00e0 Gen\00e8ve c\00f4t\00e9 France](/colocation-geneve)');
  IF md5(v) IS DISTINCT FROM 'cfe95e5a61ce18b2a4d4f53ef99bedaa' THEN RAISE EXCEPTION 'visite-articles retour arriere [55/62] trouver-colocation-geneve-frontalier.content_fr : resultat calcule md5 % au lieu de cfe95e5a61ce18b2a4d4f53ef99bedaa -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'trouver-colocation-geneve-frontalier' AND md5(content_fr) = '647b7e68636b78fe11ec28eebfb120cc';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [55/62] trouver-colocation-geneve-frontalier.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [56/62] trouver-colocation-geneve-frontalier.content_en : 1 substitution(s), 5905 -> 5892 caracteres
  --   appendix A no. 31 - "Apply in 2 minutes" -> "Request your visit in 2 minutes"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'trouver-colocation-geneve-frontalier';
  v := replace(v, U&'[Request your visit in 2 minutes](/en/candidature)', U&'[Apply in 2 minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '76bd3f5a06482f8f12a22d5de9129cab' THEN RAISE EXCEPTION 'visite-articles retour arriere [56/62] trouver-colocation-geneve-frontalier.content_en : resultat calcule md5 % au lieu de 76bd3f5a06482f8f12a22d5de9129cab -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'trouver-colocation-geneve-frontalier' AND md5(content_en) = '76eb649b45c4c4e156c7e2c0134e5216';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [56/62] trouver-colocation-geneve-frontalier.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [57/62] trouver-logement-avant-d-arriver-geneve.content_fr : 1 substitution(s), 14596 -> 14607 caracteres
  --   annexe A no 32 - "[la candidature se remplit a distance], avant meme la premiere visite" -> "[la visite peut se faire en video], avant meme ton arrive
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'trouver-logement-avant-d-arriver-geneve';
  v := replace(v, U&'et [la visite peut se faire en vid\00e9o](/candidature), avant m\00eame ton arriv\00e9e.', U&'et [la candidature se remplit \00e0 distance](/candidature), avant m\00eame la premi\00e8re visite.');
  IF md5(v) IS DISTINCT FROM '776c47ed3dd36ffebd406b5e6bae0b70' THEN RAISE EXCEPTION 'visite-articles retour arriere [57/62] trouver-logement-avant-d-arriver-geneve.content_fr : resultat calcule md5 % au lieu de 776c47ed3dd36ffebd406b5e6bae0b70 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'trouver-logement-avant-d-arriver-geneve' AND md5(content_fr) = '970eb45b0ce422ec5edcb50bc0e521a9';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [57/62] trouver-logement-avant-d-arriver-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [58/62] trouver-logement-avant-d-arriver-geneve.content_en : 1 substitution(s), 14092 -> 14108 caracteres
  --   appendix A no. 32 - "[the application can be done remotely], before you've even had a viewing" -> "[the visit can be done by video], before you even a
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'trouver-logement-avant-d-arriver-geneve';
  v := replace(v, U&'and [the visit can be done by video](/en/candidature), before you even arrive.', U&'and [the application can be done remotely](/en/candidature), before you''ve even had a viewing.');
  IF md5(v) IS DISTINCT FROM '16e04c72f98037ba987174508fd3de2e' THEN RAISE EXCEPTION 'visite-articles retour arriere [58/62] trouver-logement-avant-d-arriver-geneve.content_en : resultat calcule md5 % au lieu de 16e04c72f98037ba987174508fd3de2e -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'trouver-logement-avant-d-arriver-geneve' AND md5(content_en) = '42191eb68554b67ddaf9038432b71f4e';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [58/62] trouver-logement-avant-d-arriver-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [59/62] vie-quotidienne-frontalier-courses-sport-sorties.content_fr : 1 substitution(s), 9474 -> 9467 caracteres
  --   annexe A no 33 - lien final "candidate ici" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties';
  v := replace(v, U&'[programme une visite](/candidature)', U&'[candidate ici](/candidature)');
  IF md5(v) IS DISTINCT FROM 'af287b3519f955fd47e458883f4d7cc8' THEN RAISE EXCEPTION 'visite-articles retour arriere [59/62] vie-quotidienne-frontalier-courses-sport-sorties.content_fr : resultat calcule md5 % au lieu de af287b3519f955fd47e458883f4d7cc8 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties' AND md5(content_fr) = 'feab38517cebf43149b63ab52f013ab7';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [59/62] vie-quotidienne-frontalier-courses-sport-sorties.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [60/62] vie-quotidienne-frontalier-courses-sport-sorties.content_en : 1 substitution(s), 8723 -> 8721 caracteres
  --   appendix A no. 33 - closing link "apply here" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties';
  v := replace(v, U&'[book a visit](/en/candidature)', U&'[apply here](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '20e241df350d8d51965294041a85dc9e' THEN RAISE EXCEPTION 'visite-articles retour arriere [60/62] vie-quotidienne-frontalier-courses-sport-sorties.content_en : resultat calcule md5 % au lieu de 20e241df350d8d51965294041a85dc9e -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties' AND md5(content_en) = 'e6103080cbff0e7ffba7635de81b3679';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [60/62] vie-quotidienne-frontalier-courses-sport-sorties.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [61/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_fr : 1 substitution(s), 12797 -> 12791 caracteres
  --   annexe A no 34 - "la [candidature prend deux minutes]" -> "la [demande de visite prend deux minutes]"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve';
  v := replace(v, U&'la [demande de visite prend deux minutes](/candidature)', U&'la [candidature prend deux minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM 'e865b33e2b9e24530798e13dd60a1310' THEN RAISE EXCEPTION 'visite-articles retour arriere [61/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_fr : resultat calcule md5 % au lieu de e865b33e2b9e24530798e13dd60a1310 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve' AND md5(content_fr) = '566256ca07b180c5d9d1ff9248318fa6';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [61/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [62/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_en : 1 substitution(s), 12490 -> 12488 caracteres
  --   appendix A no. 34 - "the [application takes two minutes]" -> "the [visit request takes two minutes]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve';
  v := replace(v, U&'the [visit request takes two minutes](/en/candidature)', U&'the [application takes two minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '0b3a6cc82f2385b22a1ac5681388807b' THEN RAISE EXCEPTION 'visite-articles retour arriere [62/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_en : resultat calcule md5 % au lieu de 0b3a6cc82f2385b22a1ac5681388807b -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve' AND md5(content_en) = '8149714ea63047bb21397affc67b942c';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles retour arriere [62/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- 4. garde de sortie : md5 complet de chaque champ = etat d'avant la seance
  SELECT string_agg(e.slug || '.' || e.champ, ', ' ORDER BY e.slug, e.champ) INTO ecarts FROM (VALUES
    ('arnaques-logement-frontalier-geneve-eviter', 'content_fr', 'a0a272aa9f1e3c5e8b38f823ddfa3557'),
    ('arnaques-logement-frontalier-geneve-eviter', 'content_en', '8aa16939a7d1726ad26db227306ec84c'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'content_fr', '1a4b3fe8451a9e722ac75060d0151544'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'content_en', '09e8e5060862b513b248866d6bc6b298'),
    ('banque-telephone-internet-frontalier-bons-plans', 'content_fr', '3e2150ef4e0ab67da199abe57c267f1f'),
    ('banque-telephone-internet-frontalier-bons-plans', 'content_en', 'd157a0dc3f237107a45f00036c0080f3'),
    ('budget-colocation-geneve-guide-complet', 'content_fr', '6e1cb671a0ccb8a1958ca70d4046ac01'),
    ('budget-colocation-geneve-guide-complet', 'content_en', '19b1894b952eb95c042e8acbc360b40f'),
    ('choc-culturel-franco-suisse-expatrie-geneve', 'content_fr', '021c53edee917447a40717d4cb3d40a2'),
    ('choc-culturel-franco-suisse-expatrie-geneve', 'content_en', '63b4e154230f8eb6e765cc87d4a64eff'),
    ('coliving-annemasse-geneve-frontaliers-avantages', 'content_fr', 'd1dbc5fd76720a86e05c5759337b449d'),
    ('coliving-annemasse-geneve-frontaliers-avantages', 'content_en', 'f1b79e724e88add74f990474f97d37b3'),
    ('coliving-colocation-ou-studio-geneve-comparatif', 'content_fr', '75763563cd668930542f6246bf5309ec'),
    ('coliving-colocation-ou-studio-geneve-comparatif', 'content_en', 'e2039f8a3fd0cb9b72b945f8254177d2'),
    ('coliving-communaute-reels-amis-geneve-annemasse', 'content_fr', '06a1c4140726bd66b76972347543e208'),
    ('coliving-communaute-reels-amis-geneve-annemasse', 'content_en', 'fd57faa8263716e11fddf5c2cb758e72'),
    ('coliving-frais-dossier-geneve-annemasse', 'content_fr', '37a562375841619b0a852c7839e12727'),
    ('coliving-frais-dossier-geneve-annemasse', 'content_en', '8f5607d5683cbbcaea1c6257a4540779'),
    ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'content_fr', '76e799c0daa4ed423a69550be39a8e15'),
    ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'content_en', '69627a8cacc9cb03d299fa62815a6782'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'content_fr', '83446efaedc38c1f81ee4483f0a764a6'),
    ('cout-transport-frontalier-geneve-2026', 'content_fr', '685ca45925c4ff36daf5bb8b3fc8260f'),
    ('cout-transport-frontalier-geneve-2026', 'content_en', '14bc08cbc63d4f9396ddb72289c25c7e'),
    ('dossier-location-frontalier-suisse-france', 'content_fr', '448c659713dcfa9faf20a282a69b001b'),
    ('dossier-location-frontalier-suisse-france', 'content_en', '64ea66b19de7121de19e062918f38668'),
    ('espaces-verts-coliving-lodge-annemasse', 'content_fr', '85f9684e3e9981a48e329ea210af6c6f'),
    ('espaces-verts-coliving-lodge-annemasse', 'content_en', 'b43508604e3ff9967d8a6aa09013bd24'),
    ('fiscalite-frontalier-geneve-impots-2026', 'content_fr', '66e071d1a76a875e1cfd14f2f15f2d48'),
    ('fiscalite-frontalier-geneve-impots-2026', 'content_en', '97d11ac02770348b1e15e0332667b1c6'),
    ('grand-geneve-2026-nouveautes-frontaliers', 'content_fr', '837b05da46713e9ef2faf2d5e95cd1c3'),
    ('guide-ressources-frontalier-geneve', 'content_fr', '4e84b7b69337597b05f9364fb23b4ecd'),
    ('guide-ressources-frontalier-geneve', 'content_en', '0ebd782c01bc887ae7f911c91fd3bbdd'),
    ('ia-solitude-lien-social-coliving', 'content_fr', '01e5c5f389f2793f3841fba29a7c385e'),
    ('ia-solitude-lien-social-coliving', 'content_en', '4930e9a0921fe2d8873772875fed3389'),
    ('living-in-france-working-in-geneva', 'content_fr', '8ca01ef2e6f54803102ef8b3719f92a7'),
    ('lodge-annemasse-coliving-premium-portes-geneve', 'content_fr', '22c4f489d9f7b2e52b1850deeb91bd24'),
    ('lodge-annemasse-coliving-premium-portes-geneve', 'content_en', '39fe2e66bbded4b3298eb6c0d95dd3d2'),
    ('non-la-villa-coliving-nest-pas-une-arnaque', 'content_fr', 'f775c5487c9c2e9e01accec0ca059eeb'),
    ('non-la-villa-coliving-nest-pas-une-arnaque', 'content_en', '2f52c75a0be32fd11b4ab33fa8968ef9'),
    ('organisations-internationales-geneve-ou-habiter', 'content_fr', 'aa8c3e47ba6f02e6b75c63acc3bfc403'),
    ('organisations-internationales-geneve-ou-habiter', 'content_en', '0153c8d996c3fcc27f099f0fd17d62f5'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'content_fr', '4d574f07ea1e3c5be550e3ee1432668b'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'content_en', 'ed8beb6c19c7c4326304d24be1145e89'),
    ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', '7915537294651377c0b3ed1d54aaaec4'),
    ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', '6d3bd0f546ac82d91d17fa4b18160efe'),
    ('salaire-suisse-net-frontalier-2026', 'content_fr', '22750bc4eaea6e2353f8a3a5b4108d37'),
    ('salaire-suisse-net-frontalier-2026', 'content_en', '6b7199efcade88f6f1ee47d1b54ff59f'),
    ('se-faire-reseau-geneve-arriver-seul', 'content_fr', '5f255786c31080dad2f46e841ff72e22'),
    ('se-faire-reseau-geneve-arriver-seul', 'content_en', '86f42944cba64a2f03cc86fd50793b26'),
    ('teletravail-frontalier-geneve-regles-2026', 'content_fr', 'cfbdbcb63089873de1331273fa7c34b7'),
    ('teletravail-frontalier-geneve-regles-2026', 'content_en', '478143470199e347eafe5d0faea06a65'),
    ('temps-trajet-annemasse-geneve-par-quartier', 'content_fr', '9704b6cfc46258a26051912f9670fbb3'),
    ('temps-trajet-annemasse-geneve-par-quartier', 'content_en', 'fe56cc2f07f9aced97bcbb7ab04653b2'),
    ('transport-annemasse-geneve-leman-express', 'content_fr', '18d83d1451b3b6c5908f402cf8f946b0'),
    ('trouver-colocation-geneve-frontalier', 'content_fr', 'cfe95e5a61ce18b2a4d4f53ef99bedaa'),
    ('trouver-colocation-geneve-frontalier', 'content_en', '76bd3f5a06482f8f12a22d5de9129cab'),
    ('trouver-logement-avant-d-arriver-geneve', 'content_fr', '776c47ed3dd36ffebd406b5e6bae0b70'),
    ('trouver-logement-avant-d-arriver-geneve', 'content_en', '16e04c72f98037ba987174508fd3de2e'),
    ('vie-quotidienne-frontalier-courses-sport-sorties', 'content_fr', 'af287b3519f955fd47e458883f4d7cc8'),
    ('vie-quotidienne-frontalier-courses-sport-sorties', 'content_en', '20e241df350d8d51965294041a85dc9e'),
    ('vivre-a-annemasse-quand-on-travaille-a-geneve', 'content_fr', 'e865b33e2b9e24530798e13dd60a1310'),
    ('vivre-a-annemasse-quand-on-travaille-a-geneve', 'content_en', '0b3a6cc82f2385b22a1ac5681388807b')
  ) AS e(slug, champ, md5_attendu)
  LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(CASE e.champ WHEN 'content_fr' THEN b.content_fr WHEN 'content_en' THEN b.content_en END) IS DISTINCT FROM e.md5_attendu;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'visite-articles retour arriere : etat obtenu different de l''etat attendu, tout est annule -- %', ecarts; END IF;
END
$retour$;

COMMIT;

-- Verification (lecture seule) : ok = true sur les 62 lignes (textes d'avant la seance)
SELECT e.slug, e.champ, md5(CASE e.champ WHEN 'content_fr' THEN b.content_fr WHEN 'content_en' THEN b.content_en END) = e.md5_attendu AS ok, length(CASE e.champ WHEN 'content_fr' THEN b.content_fr WHEN 'content_en' THEN b.content_en END) AS longueur, e.longueur_attendue, b.updated_at
FROM (VALUES
  ('arnaques-logement-frontalier-geneve-eviter', 'content_fr', 'a0a272aa9f1e3c5e8b38f823ddfa3557', 12659),
  ('arnaques-logement-frontalier-geneve-eviter', 'content_en', '8aa16939a7d1726ad26db227306ec84c', 11494),
  ('assurance-sante-frontalier-lamal-cmu-budget', 'content_fr', '1a4b3fe8451a9e722ac75060d0151544', 9601),
  ('assurance-sante-frontalier-lamal-cmu-budget', 'content_en', '09e8e5060862b513b248866d6bc6b298', 9053),
  ('banque-telephone-internet-frontalier-bons-plans', 'content_fr', '3e2150ef4e0ab67da199abe57c267f1f', 10156),
  ('banque-telephone-internet-frontalier-bons-plans', 'content_en', 'd157a0dc3f237107a45f00036c0080f3', 9416),
  ('budget-colocation-geneve-guide-complet', 'content_fr', '6e1cb671a0ccb8a1958ca70d4046ac01', 25343),
  ('budget-colocation-geneve-guide-complet', 'content_en', '19b1894b952eb95c042e8acbc360b40f', 21219),
  ('choc-culturel-franco-suisse-expatrie-geneve', 'content_fr', '021c53edee917447a40717d4cb3d40a2', 10975),
  ('choc-culturel-franco-suisse-expatrie-geneve', 'content_en', '63b4e154230f8eb6e765cc87d4a64eff', 10314),
  ('coliving-annemasse-geneve-frontaliers-avantages', 'content_fr', 'd1dbc5fd76720a86e05c5759337b449d', 12736),
  ('coliving-annemasse-geneve-frontaliers-avantages', 'content_en', 'f1b79e724e88add74f990474f97d37b3', 11875),
  ('coliving-colocation-ou-studio-geneve-comparatif', 'content_fr', '75763563cd668930542f6246bf5309ec', 14350),
  ('coliving-colocation-ou-studio-geneve-comparatif', 'content_en', 'e2039f8a3fd0cb9b72b945f8254177d2', 13863),
  ('coliving-communaute-reels-amis-geneve-annemasse', 'content_fr', '06a1c4140726bd66b76972347543e208', 11078),
  ('coliving-communaute-reels-amis-geneve-annemasse', 'content_en', 'fd57faa8263716e11fddf5c2cb758e72', 9701),
  ('coliving-frais-dossier-geneve-annemasse', 'content_fr', '37a562375841619b0a852c7839e12727', 8229),
  ('coliving-frais-dossier-geneve-annemasse', 'content_en', '8f5607d5683cbbcaea1c6257a4540779', 7317),
  ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'content_fr', '76e799c0daa4ed423a69550be39a8e15', 3926),
  ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'content_en', '69627a8cacc9cb03d299fa62815a6782', 3805),
  ('colocation-annemasse-ville-la-grand-ambilly', 'content_fr', '83446efaedc38c1f81ee4483f0a764a6', 9096),
  ('cout-transport-frontalier-geneve-2026', 'content_fr', '685ca45925c4ff36daf5bb8b3fc8260f', 9118),
  ('cout-transport-frontalier-geneve-2026', 'content_en', '14bc08cbc63d4f9396ddb72289c25c7e', 8490),
  ('dossier-location-frontalier-suisse-france', 'content_fr', '448c659713dcfa9faf20a282a69b001b', 9076),
  ('dossier-location-frontalier-suisse-france', 'content_en', '64ea66b19de7121de19e062918f38668', 8421),
  ('espaces-verts-coliving-lodge-annemasse', 'content_fr', '85f9684e3e9981a48e329ea210af6c6f', 3543),
  ('espaces-verts-coliving-lodge-annemasse', 'content_en', 'b43508604e3ff9967d8a6aa09013bd24', 3258),
  ('fiscalite-frontalier-geneve-impots-2026', 'content_fr', '66e071d1a76a875e1cfd14f2f15f2d48', 10726),
  ('fiscalite-frontalier-geneve-impots-2026', 'content_en', '97d11ac02770348b1e15e0332667b1c6', 10067),
  ('grand-geneve-2026-nouveautes-frontaliers', 'content_fr', '837b05da46713e9ef2faf2d5e95cd1c3', 8678),
  ('guide-ressources-frontalier-geneve', 'content_fr', '4e84b7b69337597b05f9364fb23b4ecd', 40523),
  ('guide-ressources-frontalier-geneve', 'content_en', '0ebd782c01bc887ae7f911c91fd3bbdd', 37360),
  ('ia-solitude-lien-social-coliving', 'content_fr', '01e5c5f389f2793f3841fba29a7c385e', 11865),
  ('ia-solitude-lien-social-coliving', 'content_en', '4930e9a0921fe2d8873772875fed3389', 11130),
  ('living-in-france-working-in-geneva', 'content_fr', '8ca01ef2e6f54803102ef8b3719f92a7', 17698),
  ('lodge-annemasse-coliving-premium-portes-geneve', 'content_fr', '22c4f489d9f7b2e52b1850deeb91bd24', 15231),
  ('lodge-annemasse-coliving-premium-portes-geneve', 'content_en', '39fe2e66bbded4b3298eb6c0d95dd3d2', 13561),
  ('non-la-villa-coliving-nest-pas-une-arnaque', 'content_fr', 'f775c5487c9c2e9e01accec0ca059eeb', 5580),
  ('non-la-villa-coliving-nest-pas-une-arnaque', 'content_en', '2f52c75a0be32fd11b4ab33fa8968ef9', 5127),
  ('organisations-internationales-geneve-ou-habiter', 'content_fr', 'aa8c3e47ba6f02e6b75c63acc3bfc403', 7455),
  ('organisations-internationales-geneve-ou-habiter', 'content_en', '0153c8d996c3fcc27f099f0fd17d62f5', 6833),
  ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'content_fr', '4d574f07ea1e3c5be550e3ee1432668b', 15248),
  ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'content_en', 'ed8beb6c19c7c4326304d24be1145e89', 15079),
  ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', '7915537294651377c0b3ed1d54aaaec4', 15422),
  ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', '6d3bd0f546ac82d91d17fa4b18160efe', 15423),
  ('salaire-suisse-net-frontalier-2026', 'content_fr', '22750bc4eaea6e2353f8a3a5b4108d37', 13932),
  ('salaire-suisse-net-frontalier-2026', 'content_en', '6b7199efcade88f6f1ee47d1b54ff59f', 11229),
  ('se-faire-reseau-geneve-arriver-seul', 'content_fr', '5f255786c31080dad2f46e841ff72e22', 10721),
  ('se-faire-reseau-geneve-arriver-seul', 'content_en', '86f42944cba64a2f03cc86fd50793b26', 9683),
  ('teletravail-frontalier-geneve-regles-2026', 'content_fr', 'cfbdbcb63089873de1331273fa7c34b7', 11727),
  ('teletravail-frontalier-geneve-regles-2026', 'content_en', '478143470199e347eafe5d0faea06a65', 10835),
  ('temps-trajet-annemasse-geneve-par-quartier', 'content_fr', '9704b6cfc46258a26051912f9670fbb3', 9240),
  ('temps-trajet-annemasse-geneve-par-quartier', 'content_en', 'fe56cc2f07f9aced97bcbb7ab04653b2', 8629),
  ('transport-annemasse-geneve-leman-express', 'content_fr', '18d83d1451b3b6c5908f402cf8f946b0', 8451),
  ('trouver-colocation-geneve-frontalier', 'content_fr', 'cfe95e5a61ce18b2a4d4f53ef99bedaa', 6302),
  ('trouver-colocation-geneve-frontalier', 'content_en', '76bd3f5a06482f8f12a22d5de9129cab', 5892),
  ('trouver-logement-avant-d-arriver-geneve', 'content_fr', '776c47ed3dd36ffebd406b5e6bae0b70', 14607),
  ('trouver-logement-avant-d-arriver-geneve', 'content_en', '16e04c72f98037ba987174508fd3de2e', 14108),
  ('vie-quotidienne-frontalier-courses-sport-sorties', 'content_fr', 'af287b3519f955fd47e458883f4d7cc8', 9467),
  ('vie-quotidienne-frontalier-courses-sport-sorties', 'content_en', '20e241df350d8d51965294041a85dc9e', 8721),
  ('vivre-a-annemasse-quand-on-travaille-a-geneve', 'content_fr', 'e865b33e2b9e24530798e13dd60a1310', 12791),
  ('vivre-a-annemasse-quand-on-travaille-a-geneve', 'content_en', '0b3a6cc82f2385b22a1ac5681388807b', 12488)
) AS e(slug, champ, md5_attendu, longueur_attendue)
JOIN public.blog_posts b ON b.slug = e.slug
ORDER BY e.slug, e.champ;
