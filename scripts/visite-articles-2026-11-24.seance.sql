-- ============================================================================
-- SEANCE "visite-articles" (2026-11-24) : "Programmer une visite" hors du site - lot 2 (articles du blog, plan du 24/11/2026, par. 2 et annexe A) : appels a agir vers le formulaire, REGLE A SEULEMENT (decision de Jerome du 24/11/2026)
-- Variante 100 % ASCII et compacte de scripts/visite-articles-2026-11-24.sql (meme lot, memes ancres), generee le 2026-11-24T18:16:54.510Z
-- par scripts/build-seance-sql.mjs. Un seul appel : BEGIN, un bloc DO, COMMIT, puis une verification en lecture seule.
-- Gardes : 43 articles publies, chaque champ dans l'etat de la preparation (md5 complet), resultat
-- recalcule en base et compare au md5 calcule ici AVANT chaque UPDATE, une ligne par UPDATE, md5 de sortie de tous les champs.
-- Au moindre ecart : exception, tout est annule, rien n'est ecrit. Relancer apres succes : refuse par la garde d'entree (sans effet).
-- Sauvegarde (etat remplace) : scripts/backups/visite-articles-2026-11-24.avant.json ; retour arriere : scripts/backups/visite-articles-2026-11-24.retour-arriere.sql.
-- NE PAS EXECUTER SANS LE GO EXPLICITE DE JEROME. Le declencheur blog_posts_updated_at met aussi updated_at a now().
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

DO $seance$
DECLARE
  n integer;
  v text;
  ecarts text;
BEGIN
  -- 0. nombre d'articles publies : 43
  SELECT count(*) INTO n FROM public.blog_posts WHERE is_published IS TRUE;
  IF n <> 43 THEN RAISE EXCEPTION 'visite-articles : % article(s) publie(s) au lieu de 43 -- rien n''est ecrit', n; END IF;
  -- 1. 33 articles, une ligne chacun, tous publies
  SELECT count(*) INTO n FROM public.blog_posts WHERE slug IN ('arnaques-logement-frontalier-geneve-eviter', 'assurance-sante-frontalier-lamal-cmu-budget', 'banque-telephone-internet-frontalier-bons-plans', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-annemasse-geneve-frontaliers-avantages', 'coliving-colocation-ou-studio-geneve-comparatif', 'coliving-communaute-reels-amis-geneve-annemasse', 'coliving-frais-dossier-geneve-annemasse', 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'colocation-annemasse-ville-la-grand-ambilly', 'cout-transport-frontalier-geneve-2026', 'dossier-location-frontalier-suisse-france', 'espaces-verts-coliving-lodge-annemasse', 'fiscalite-frontalier-geneve-impots-2026', 'grand-geneve-2026-nouveautes-frontaliers', 'guide-ressources-frontalier-geneve', 'ia-solitude-lien-social-coliving', 'living-in-france-working-in-geneva', 'lodge-annemasse-coliving-premium-portes-geneve', 'non-la-villa-coliving-nest-pas-une-arnaque', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'salaire-suisse-net-frontalier-2026', 'se-faire-reseau-geneve-arriver-seul', 'teletravail-frontalier-geneve-regles-2026', 'temps-trajet-annemasse-geneve-par-quartier', 'transport-annemasse-geneve-leman-express', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve', 'vie-quotidienne-frontalier-courses-sport-sorties', 'vivre-a-annemasse-quand-on-travaille-a-geneve') AND is_published IS TRUE;
  IF n <> 33 THEN RAISE EXCEPTION 'visite-articles : % ligne(s) au lieu de 33 -- rien n''est ecrit', n; END IF;
  -- 2. garde d'entree : md5 complet de chaque champ = etat de la preparation
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
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'visite-articles : champ(s) different(s) de l''etat attendu, rien n''est ecrit -- %', ecarts; END IF;
  -- 3. 62 champs, un par un
  -- [1/62] arnaques-logement-frontalier-geneve-eviter.content_fr : 1 substitution(s), 12659 -> 12675 caracteres
  --   annexe A no 1 - encadre final : "Candidate chez La Villa Coliving" -> "Programme une visite chez La Villa Coliving", sur place ou en video
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';
  v := replace(v, U&'[Candidate chez La Villa Coliving](/candidature) \2014 visite sur place, bail l\00e9gal, z\00e9ro mauvaise surprise.', U&'[Programme une visite chez La Villa Coliving](/candidature) \2014 sur place ou en vid\00e9o, bail l\00e9gal, z\00e9ro mauvaise surprise.');
  IF md5(v) IS DISTINCT FROM '421193cb93ac811068719b6e80379f25' THEN RAISE EXCEPTION 'visite-articles [1/62] arnaques-logement-frontalier-geneve-eviter.content_fr : resultat calcule md5 % au lieu de 421193cb93ac811068719b6e80379f25 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'arnaques-logement-frontalier-geneve-eviter' AND md5(content_fr) = 'a0a272aa9f1e3c5e8b38f823ddfa3557';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [1/62] arnaques-logement-frontalier-geneve-eviter.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [2/62] arnaques-logement-frontalier-geneve-eviter.content_en : 1 substitution(s), 11494 -> 11506 caracteres
  --   appendix A no. 1 - closing box: "Apply to La Villa Coliving" -> "Book a visit at La Villa Coliving", on site or by video
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';
  v := replace(v, U&'[Apply to La Villa Coliving](/en/candidature) \2014 on-site visits, legal lease, zero nasty surprises.', U&'[Book a visit at La Villa Coliving](/en/candidature) \2014 on site or by video, legal lease, zero nasty surprises.');
  IF md5(v) IS DISTINCT FROM 'ebb5f9e3e8bfa6f512bb3fd19a930379' THEN RAISE EXCEPTION 'visite-articles [2/62] arnaques-logement-frontalier-geneve-eviter.content_en : resultat calcule md5 % au lieu de ebb5f9e3e8bfa6f512bb3fd19a930379 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'arnaques-logement-frontalier-geneve-eviter' AND md5(content_en) = '8aa16939a7d1726ad26db227306ec84c';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [2/62] arnaques-logement-frontalier-geneve-eviter.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [3/62] assurance-sante-frontalier-lamal-cmu-budget.content_fr : 1 substitution(s), 9601 -> 9602 caracteres
  --   annexe A no 2 - lien final "postule directement" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
  v := replace(v, U&'[postule directement](/candidature)', U&'[programme une visite](/candidature)');
  IF md5(v) IS DISTINCT FROM '462f14df0e91aac44e1f7849b3ff859a' THEN RAISE EXCEPTION 'visite-articles [3/62] assurance-sante-frontalier-lamal-cmu-budget.content_fr : resultat calcule md5 % au lieu de 462f14df0e91aac44e1f7849b3ff859a -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget' AND md5(content_fr) = '1a4b3fe8451a9e722ac75060d0151544';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [3/62] assurance-sante-frontalier-lamal-cmu-budget.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [4/62] assurance-sante-frontalier-lamal-cmu-budget.content_en : 1 substitution(s), 9053 -> 9051 caracteres
  --   appendix A no. 2 - closing link "apply directly" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
  v := replace(v, U&'[apply directly](/en/candidature)', U&'[book a visit](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'ebad1e57236ac6038cdc4cda178df16e' THEN RAISE EXCEPTION 'visite-articles [4/62] assurance-sante-frontalier-lamal-cmu-budget.content_en : resultat calcule md5 % au lieu de ebad1e57236ac6038cdc4cda178df16e -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget' AND md5(content_en) = '09e8e5060862b513b248866d6bc6b298';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [4/62] assurance-sante-frontalier-lamal-cmu-budget.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [5/62] banque-telephone-internet-frontalier-bons-plans.content_fr : 1 substitution(s), 10156 -> 10163 caracteres
  --   annexe A no 3 - lien final "candidate ici" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';
  v := replace(v, U&'[candidate ici](/candidature)', U&'[programme une visite](/candidature)');
  IF md5(v) IS DISTINCT FROM '64cfd1ef0292e4ac8bd6a99ee176b237' THEN RAISE EXCEPTION 'visite-articles [5/62] banque-telephone-internet-frontalier-bons-plans.content_fr : resultat calcule md5 % au lieu de 64cfd1ef0292e4ac8bd6a99ee176b237 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'banque-telephone-internet-frontalier-bons-plans' AND md5(content_fr) = '3e2150ef4e0ab67da199abe57c267f1f';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [5/62] banque-telephone-internet-frontalier-bons-plans.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [6/62] banque-telephone-internet-frontalier-bons-plans.content_en : 1 substitution(s), 9416 -> 9418 caracteres
  --   appendix A no. 3 - closing link "apply here" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';
  v := replace(v, U&'[apply here](/en/candidature)', U&'[book a visit](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '22d34f36cc5719598520195715bde521' THEN RAISE EXCEPTION 'visite-articles [6/62] banque-telephone-internet-frontalier-bons-plans.content_en : resultat calcule md5 % au lieu de 22d34f36cc5719598520195715bde521 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'banque-telephone-internet-frontalier-bons-plans' AND md5(content_en) = 'd157a0dc3f237107a45f00036c0080f3';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [6/62] banque-telephone-internet-frontalier-bons-plans.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [7/62] budget-colocation-geneve-guide-complet.content_fr : 2 substitution(s), 25343 -> 25342 caracteres
  --   annexe A no 4 - "candidater des maintenant pour figurer sur la liste d'attente" -> "te manifester des maintenant..."
  --   annexe A no 4 - "depose ta [candidature en 2 minutes]" -> "[demande ta visite en 2 minutes]"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'budget-colocation-geneve-guide-complet';
  v := replace(v, U&'la meilleure strat\00e9gie est de candidater d\00e8s maintenant pour figurer sur la liste d''attente', U&'la meilleure strat\00e9gie est de te manifester d\00e8s maintenant pour figurer sur la liste d''attente');
  v := replace(v, U&'ou d\00e9pose ta [candidature en 2 minutes](https://www.lavillacoliving.com/candidature)', U&'ou [demande ta visite en 2 minutes](https://www.lavillacoliving.com/candidature)');
  IF md5(v) IS DISTINCT FROM 'b1d4ba71e554b6d902568aa4e0cb6edf' THEN RAISE EXCEPTION 'visite-articles [7/62] budget-colocation-geneve-guide-complet.content_fr : resultat calcule md5 % au lieu de b1d4ba71e554b6d902568aa4e0cb6edf -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet' AND md5(content_fr) = '6e1cb671a0ccb8a1958ca70d4046ac01';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [7/62] budget-colocation-geneve-guide-complet.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [8/62] budget-colocation-geneve-guide-complet.content_en : 2 substitution(s), 21219 -> 21221 caracteres
  --   appendix A no. 4 - "apply now to get on the waiting list" -> "get in touch now..."
  --   appendix A no. 4 - "submit your [application in 2 minutes]" -> "[request your visit in 2 minutes]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'budget-colocation-geneve-guide-complet';
  v := replace(v, U&'the best strategy is to apply now to get on the waiting list', U&'the best strategy is to get in touch now to get on the waiting list');
  v := replace(v, U&'or submit your [application in 2 minutes](https://www.lavillacoliving.com/en/candidature)', U&'or [request your visit in 2 minutes](https://www.lavillacoliving.com/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'd9923621649c469c785f9477a0a5a6ce' THEN RAISE EXCEPTION 'visite-articles [8/62] budget-colocation-geneve-guide-complet.content_en : resultat calcule md5 % au lieu de d9923621649c469c785f9477a0a5a6ce -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet' AND md5(content_en) = '19b1894b952eb95c042e8acbc360b40f';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [8/62] budget-colocation-geneve-guide-complet.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [9/62] choc-culturel-franco-suisse-expatrie-geneve.content_fr : 1 substitution(s), 10975 -> 10982 caracteres
  --   annexe A no 5 - lien final "candidate ici" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve';
  v := replace(v, U&'[candidate ici](/candidature)', U&'[programme une visite](/candidature)');
  IF md5(v) IS DISTINCT FROM '7d83440c304812118e2760265bf18ff3' THEN RAISE EXCEPTION 'visite-articles [9/62] choc-culturel-franco-suisse-expatrie-geneve.content_fr : resultat calcule md5 % au lieu de 7d83440c304812118e2760265bf18ff3 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve' AND md5(content_fr) = '021c53edee917447a40717d4cb3d40a2';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [9/62] choc-culturel-franco-suisse-expatrie-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [10/62] choc-culturel-franco-suisse-expatrie-geneve.content_en : 1 substitution(s), 10314 -> 10316 caracteres
  --   appendix A no. 5 - closing link "apply here" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve';
  v := replace(v, U&'[apply here](/en/candidature)', U&'[book a visit](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '874b0de4456e9981acbba5f3301b674f' THEN RAISE EXCEPTION 'visite-articles [10/62] choc-culturel-franco-suisse-expatrie-geneve.content_en : resultat calcule md5 % au lieu de 874b0de4456e9981acbba5f3301b674f -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve' AND md5(content_en) = '63b4e154230f8eb6e765cc87d4a64eff';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [10/62] choc-culturel-franco-suisse-expatrie-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [11/62] coliving-annemasse-geneve-frontaliers-avantages.content_fr : 1 substitution(s), 12736 -> 12746 caracteres
  --   annexe A no 6 - "Postule en 2 minutes" -> "Demande ta visite en 2 minutes"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages';
  v := replace(v, U&'[Postule en 2 minutes](/candidature)', U&'[Demande ta visite en 2 minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM '86de3563aa27a33f5cccb708e8a2143c' THEN RAISE EXCEPTION 'visite-articles [11/62] coliving-annemasse-geneve-frontaliers-avantages.content_fr : resultat calcule md5 % au lieu de 86de3563aa27a33f5cccb708e8a2143c -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages' AND md5(content_fr) = 'd1dbc5fd76720a86e05c5759337b449d';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [11/62] coliving-annemasse-geneve-frontaliers-avantages.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [12/62] coliving-annemasse-geneve-frontaliers-avantages.content_en : 1 substitution(s), 11875 -> 11888 caracteres
  --   appendix A no. 6 - "Apply in 2 minutes" -> "Request your visit in 2 minutes"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages';
  v := replace(v, U&'[Apply in 2 minutes](/en/candidature)', U&'[Request your visit in 2 minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '947df784366680e1944547cc09a44adc' THEN RAISE EXCEPTION 'visite-articles [12/62] coliving-annemasse-geneve-frontaliers-avantages.content_en : resultat calcule md5 % au lieu de 947df784366680e1944547cc09a44adc -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages' AND md5(content_en) = 'f1b79e724e88add74f990474f97d37b3';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [12/62] coliving-annemasse-geneve-frontaliers-avantages.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [13/62] coliving-colocation-ou-studio-geneve-comparatif.content_fr : 3 substitution(s), 14350 -> 14338 caracteres
  --   annexe A no 7 (1/3) - verdict "nouveau job" : "candidature en deux minutes" -> "demande en deux minutes"
  --   annexe A no 7 (2/3) - lien "candidature en deux minutes" -> "demande en deux minutes"
  --   annexe A no 7 (3/3) - FAQ "72 h" : "candidature en deux minutes" -> "demande en deux minutes"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif';
  v := replace(v, U&'pas dans un magasin de meubles : candidature en deux minutes, r\00e9ponse sous 48 h', U&'pas dans un magasin de meubles : demande en deux minutes, r\00e9ponse sous 48 h');
  v := replace(v, U&'[candidature en deux minutes](/candidature)', U&'[demande en deux minutes](/candidature)');
  v := replace(v, U&'si une chambre est disponible : candidature en deux minutes, r\00e9ponse sous 48 h', U&'si une chambre est disponible : demande en deux minutes, r\00e9ponse sous 48 h');
  IF md5(v) IS DISTINCT FROM '930668c2cdd287e5ba2635eb194c9f48' THEN RAISE EXCEPTION 'visite-articles [13/62] coliving-colocation-ou-studio-geneve-comparatif.content_fr : resultat calcule md5 % au lieu de 930668c2cdd287e5ba2635eb194c9f48 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif' AND md5(content_fr) = '75763563cd668930542f6246bf5309ec';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [13/62] coliving-colocation-ou-studio-geneve-comparatif.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [14/62] coliving-colocation-ou-studio-geneve-comparatif.content_en : 3 substitution(s), 13863 -> 13851 caracteres
  --   appendix A no. 7 (1/3) - "new job" verdict: "a two-minute application" -> "a two-minute request"
  --   appendix A no. 7 (2/3) - link "a two-minute application" -> "a two-minute request"
  --   appendix A no. 7 (3/3) - "72 h" FAQ: "a two-minute application" -> "a two-minute request"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif';
  v := replace(v, U&'not in a furniture store: a two-minute application, a reply within 48 h', U&'not in a furniture store: a two-minute request, a reply within 48 h');
  v := replace(v, U&'[a two-minute application](/en/candidature)', U&'[a two-minute request](/en/candidature)');
  v := replace(v, U&'if a room is available: a two-minute application, a reply within 48 h', U&'if a room is available: a two-minute request, a reply within 48 h');
  IF md5(v) IS DISTINCT FROM 'ef081b6bf8f474db3a7768261fcefd1b' THEN RAISE EXCEPTION 'visite-articles [14/62] coliving-colocation-ou-studio-geneve-comparatif.content_en : resultat calcule md5 % au lieu de ef081b6bf8f474db3a7768261fcefd1b -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif' AND md5(content_en) = 'e2039f8a3fd0cb9b72b945f8254177d2';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [14/62] coliving-colocation-ou-studio-geneve-comparatif.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [15/62] coliving-communaute-reels-amis-geneve-annemasse.content_fr : 1 substitution(s), 11078 -> 11089 caracteres
  --   annexe A no 8 - "Candidate des maintenant" -> "Programme une visite des maintenant"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse';
  v := replace(v, U&'[Candidate d\00e8s maintenant](/candidature)', U&'[Programme une visite d\00e8s maintenant](/candidature)');
  IF md5(v) IS DISTINCT FROM 'f5629db0f3163d21a4efe38e72f45099' THEN RAISE EXCEPTION 'visite-articles [15/62] coliving-communaute-reels-amis-geneve-annemasse.content_fr : resultat calcule md5 % au lieu de f5629db0f3163d21a4efe38e72f45099 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse' AND md5(content_fr) = '06a1c4140726bd66b76972347543e208';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [15/62] coliving-communaute-reels-amis-geneve-annemasse.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [16/62] coliving-communaute-reels-amis-geneve-annemasse.content_en : 1 substitution(s), 9701 -> 9708 caracteres
  --   appendix A no. 8 - "Apply now" -> "Book a visit now"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse';
  v := replace(v, U&'[Apply now](/en/candidature)', U&'[Book a visit now](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '94afbbcd59dc0703857a9fb6d15ca6d8' THEN RAISE EXCEPTION 'visite-articles [16/62] coliving-communaute-reels-amis-geneve-annemasse.content_en : resultat calcule md5 % au lieu de 94afbbcd59dc0703857a9fb6d15ca6d8 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse' AND md5(content_en) = 'fd57faa8263716e11fddf5c2cb758e72';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [16/62] coliving-communaute-reels-amis-geneve-annemasse.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [17/62] coliving-frais-dossier-geneve-annemasse.content_fr : 1 substitution(s), 8229 -> 8237 caracteres
  --   annexe A no 9 - "candidate en 2 minutes, gratuitement" -> "demande ta visite en 2 minutes, gratuitement"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'coliving-frais-dossier-geneve-annemasse';
  v := replace(v, U&'[candidate en 2 minutes, gratuitement](/candidature)', U&'[demande ta visite en 2 minutes, gratuitement](/candidature)');
  IF md5(v) IS DISTINCT FROM '3f8438674919323dc78b8ff498815f78' THEN RAISE EXCEPTION 'visite-articles [17/62] coliving-frais-dossier-geneve-annemasse.content_fr : resultat calcule md5 % au lieu de 3f8438674919323dc78b8ff498815f78 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'coliving-frais-dossier-geneve-annemasse' AND md5(content_fr) = '37a562375841619b0a852c7839e12727';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [17/62] coliving-frais-dossier-geneve-annemasse.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [18/62] coliving-frais-dossier-geneve-annemasse.content_en : 1 substitution(s), 7317 -> 7330 caracteres
  --   appendix A no. 9 - "apply in 2 minutes, for free" -> "request your visit in 2 minutes, for free"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'coliving-frais-dossier-geneve-annemasse';
  v := replace(v, U&'[apply in 2 minutes, for free](/en/candidature)', U&'[request your visit in 2 minutes, for free](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '0155d81fd699348a87f3736d67771ebb' THEN RAISE EXCEPTION 'visite-articles [18/62] coliving-frais-dossier-geneve-annemasse.content_en : resultat calcule md5 % au lieu de 0155d81fd699348a87f3736d67771ebb -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'coliving-frais-dossier-geneve-annemasse' AND md5(content_en) = '8f5607d5683cbbcaea1c6257a4540779';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [18/62] coliving-frais-dossier-geneve-annemasse.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [19/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_fr : 1 substitution(s), 3926 -> 3936 caracteres
  --   annexe A no 10 - "Postule en 2 minutes" -> "Demande ta visite en 2 minutes"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie';
  v := replace(v, U&'[Postule en 2 minutes](/candidature)', U&'[Demande ta visite en 2 minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM '9c7fa5e10c0250610453f58d0bb34282' THEN RAISE EXCEPTION 'visite-articles [19/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_fr : resultat calcule md5 % au lieu de 9c7fa5e10c0250610453f58d0bb34282 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' AND md5(content_fr) = '76e799c0daa4ed423a69550be39a8e15';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [19/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [20/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_en : 1 substitution(s), 3805 -> 3818 caracteres
  --   appendix A no. 10 - "Apply in 2 minutes" -> "Request your visit in 2 minutes"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie';
  v := replace(v, U&'[Apply in 2 minutes](/en/candidature)', U&'[Request your visit in 2 minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '0f91d57d8a59cd556f24fc990b1aabff' THEN RAISE EXCEPTION 'visite-articles [20/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_en : resultat calcule md5 % au lieu de 0f91d57d8a59cd556f24fc990b1aabff -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' AND md5(content_en) = '69627a8cacc9cb03d299fa62815a6782';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [20/62] coliving-transfrontalier-geneve-annemasse-nouvelle-vie.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [21/62] colocation-annemasse-ville-la-grand-ambilly.content_fr : 1 substitution(s), 9096 -> 9104 caracteres
  --   annexe A no 11 - "Candidate en 2 minutes ->" -> "Demande ta visite en 2 minutes ->"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly';
  v := replace(v, U&'[Candidate en 2 minutes \2192](/candidature)', U&'[Demande ta visite en 2 minutes \2192](/candidature)');
  IF md5(v) IS DISTINCT FROM 'ba2ff875fc62fcce502101770bb7120c' THEN RAISE EXCEPTION 'visite-articles [21/62] colocation-annemasse-ville-la-grand-ambilly.content_fr : resultat calcule md5 % au lieu de ba2ff875fc62fcce502101770bb7120c -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly' AND md5(content_fr) = '83446efaedc38c1f81ee4483f0a764a6';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [21/62] colocation-annemasse-ville-la-grand-ambilly.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [22/62] cout-transport-frontalier-geneve-2026.content_fr : 1 substitution(s), 9118 -> 9128 caracteres
  --   annexe A no 12 - "postule en 2 minutes" -> "demande ta visite en 2 minutes"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'cout-transport-frontalier-geneve-2026';
  v := replace(v, U&'[postule en 2 minutes](/candidature)', U&'[demande ta visite en 2 minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM '7f810ca06a9788323fad6f08ce778a38' THEN RAISE EXCEPTION 'visite-articles [22/62] cout-transport-frontalier-geneve-2026.content_fr : resultat calcule md5 % au lieu de 7f810ca06a9788323fad6f08ce778a38 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'cout-transport-frontalier-geneve-2026' AND md5(content_fr) = '685ca45925c4ff36daf5bb8b3fc8260f';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [22/62] cout-transport-frontalier-geneve-2026.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [23/62] cout-transport-frontalier-geneve-2026.content_en : 1 substitution(s), 8490 -> 8503 caracteres
  --   appendix A no. 12 - "apply in 2 minutes" -> "request your visit in 2 minutes"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'cout-transport-frontalier-geneve-2026';
  v := replace(v, U&'[apply in 2 minutes](/en/candidature)', U&'[request your visit in 2 minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'b9b10af172ca3c132975ad4c4b583a68' THEN RAISE EXCEPTION 'visite-articles [23/62] cout-transport-frontalier-geneve-2026.content_en : resultat calcule md5 % au lieu de b9b10af172ca3c132975ad4c4b583a68 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'cout-transport-frontalier-geneve-2026' AND md5(content_en) = '14bc08cbc63d4f9396ddb72289c25c7e';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [23/62] cout-transport-frontalier-geneve-2026.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [24/62] dossier-location-frontalier-suisse-france.content_fr : 1 substitution(s), 9076 -> 9087 caracteres
  --   annexe A no 13 - "Candidate chez La Villa Coliving" -> "Programme une visite chez La Villa Coliving"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'dossier-location-frontalier-suisse-france';
  v := replace(v, U&'[Candidate chez La Villa Coliving](/candidature)', U&'[Programme une visite chez La Villa Coliving](/candidature)');
  IF md5(v) IS DISTINCT FROM 'cea73ddf37342422bae6a8ae37932136' THEN RAISE EXCEPTION 'visite-articles [24/62] dossier-location-frontalier-suisse-france.content_fr : resultat calcule md5 % au lieu de cea73ddf37342422bae6a8ae37932136 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'dossier-location-frontalier-suisse-france' AND md5(content_fr) = '448c659713dcfa9faf20a282a69b001b';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [24/62] dossier-location-frontalier-suisse-france.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [25/62] dossier-location-frontalier-suisse-france.content_en : 1 substitution(s), 8421 -> 8428 caracteres
  --   appendix A no. 13 - "Apply to La Villa Coliving" -> "Book a visit at La Villa Coliving"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'dossier-location-frontalier-suisse-france';
  v := replace(v, U&'[Apply to La Villa Coliving](/en/candidature)', U&'[Book a visit at La Villa Coliving](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '784e3b1b5f6fbbd48e032b4119d0417c' THEN RAISE EXCEPTION 'visite-articles [25/62] dossier-location-frontalier-suisse-france.content_en : resultat calcule md5 % au lieu de 784e3b1b5f6fbbd48e032b4119d0417c -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'dossier-location-frontalier-suisse-france' AND md5(content_en) = '64ea66b19de7121de19e062918f38668';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [25/62] dossier-location-frontalier-suisse-france.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [26/62] espaces-verts-coliving-lodge-annemasse.content_fr : 1 substitution(s), 3543 -> 3553 caracteres
  --   annexe A no 14 - "postule en 2 minutes" -> "demande ta visite en 2 minutes"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'espaces-verts-coliving-lodge-annemasse';
  v := replace(v, U&'[postule en 2 minutes](/candidature)', U&'[demande ta visite en 2 minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM '868364a8d3c11b30e1d3d72018f61d83' THEN RAISE EXCEPTION 'visite-articles [26/62] espaces-verts-coliving-lodge-annemasse.content_fr : resultat calcule md5 % au lieu de 868364a8d3c11b30e1d3d72018f61d83 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'espaces-verts-coliving-lodge-annemasse' AND md5(content_fr) = '85f9684e3e9981a48e329ea210af6c6f';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [26/62] espaces-verts-coliving-lodge-annemasse.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [27/62] espaces-verts-coliving-lodge-annemasse.content_en : 1 substitution(s), 3258 -> 3271 caracteres
  --   appendix A no. 14 - "apply in 2 minutes" -> "request your visit in 2 minutes"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'espaces-verts-coliving-lodge-annemasse';
  v := replace(v, U&'[apply in 2 minutes](/en/candidature)', U&'[request your visit in 2 minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'bdb7d5c1dbeb8578cc9b35cb9ed7c110' THEN RAISE EXCEPTION 'visite-articles [27/62] espaces-verts-coliving-lodge-annemasse.content_en : resultat calcule md5 % au lieu de bdb7d5c1dbeb8578cc9b35cb9ed7c110 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'espaces-verts-coliving-lodge-annemasse' AND md5(content_en) = 'b43508604e3ff9967d8a6aa09013bd24';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [27/62] espaces-verts-coliving-lodge-annemasse.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [28/62] fiscalite-frontalier-geneve-impots-2026.content_fr : 1 substitution(s), 10726 -> 10725 caracteres
  --   annexe A no 15 - "depose ta [candidature]" -> "[programme une visite]"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
  v := replace(v, U&'ou d\00e9pose ta [candidature](/candidature)', U&'ou [programme une visite](/candidature)');
  IF md5(v) IS DISTINCT FROM '6dcab202f709f1bb0b9f43bccd91ae6e' THEN RAISE EXCEPTION 'visite-articles [28/62] fiscalite-frontalier-geneve-impots-2026.content_fr : resultat calcule md5 % au lieu de 6dcab202f709f1bb0b9f43bccd91ae6e -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026' AND md5(content_fr) = '66e071d1a76a875e1cfd14f2f15f2d48';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [28/62] fiscalite-frontalier-geneve-impots-2026.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [29/62] fiscalite-frontalier-geneve-impots-2026.content_en : 1 substitution(s), 10067 -> 10056 caracteres
  --   appendix A no. 15 - "submit your [application]" -> "[book a visit]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
  v := replace(v, U&'or submit your [application](/en/candidature)', U&'or [book a visit](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '7cf38cf7ddd02c989801430a1a5ce8fa' THEN RAISE EXCEPTION 'visite-articles [29/62] fiscalite-frontalier-geneve-impots-2026.content_en : resultat calcule md5 % au lieu de 7cf38cf7ddd02c989801430a1a5ce8fa -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026' AND md5(content_en) = '97d11ac02770348b1e15e0332667b1c6';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [29/62] fiscalite-frontalier-geneve-impots-2026.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [30/62] grand-geneve-2026-nouveautes-frontaliers.content_fr : 1 substitution(s), 8678 -> 8686 caracteres
  --   annexe A no 16 - "Candidate en 2 minutes ->" -> "Demande ta visite en 2 minutes ->"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers';
  v := replace(v, U&'[Candidate en 2 minutes \2192](/candidature)', U&'[Demande ta visite en 2 minutes \2192](/candidature)');
  IF md5(v) IS DISTINCT FROM '118c2871bfadd8871aba39d8b57a013b' THEN RAISE EXCEPTION 'visite-articles [30/62] grand-geneve-2026-nouveautes-frontaliers.content_fr : resultat calcule md5 % au lieu de 118c2871bfadd8871aba39d8b57a013b -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers' AND md5(content_fr) = '837b05da46713e9ef2faf2d5e95cd1c3';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [30/62] grand-geneve-2026-nouveautes-frontaliers.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [31/62] guide-ressources-frontalier-geneve.content_fr : 1 substitution(s), 40523 -> 40531 caracteres
  --   annexe A no 17 - "candidate en quelques minutes, gratuitement" -> "demande ta visite en quelques minutes, gratuitement"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'guide-ressources-frontalier-geneve';
  v := replace(v, U&'[candidate en quelques minutes, gratuitement](/candidature)', U&'[demande ta visite en quelques minutes, gratuitement](/candidature)');
  IF md5(v) IS DISTINCT FROM '363544b549f614f77ac335a513c9393d' THEN RAISE EXCEPTION 'visite-articles [31/62] guide-ressources-frontalier-geneve.content_fr : resultat calcule md5 % au lieu de 363544b549f614f77ac335a513c9393d -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'guide-ressources-frontalier-geneve' AND md5(content_fr) = '4e84b7b69337597b05f9364fb23b4ecd';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [31/62] guide-ressources-frontalier-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [32/62] guide-ressources-frontalier-geneve.content_en : 1 substitution(s), 37360 -> 37373 caracteres
  --   appendix A no. 17 - "apply in a few minutes, for free" -> "request your visit in a few minutes, for free" (URL unchanged)
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'guide-ressources-frontalier-geneve';
  v := replace(v, U&'[apply in a few minutes, for free](/candidature)', U&'[request your visit in a few minutes, for free](/candidature)');
  IF md5(v) IS DISTINCT FROM '816c2011d4208287df2c67c28e33434a' THEN RAISE EXCEPTION 'visite-articles [32/62] guide-ressources-frontalier-geneve.content_en : resultat calcule md5 % au lieu de 816c2011d4208287df2c67c28e33434a -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'guide-ressources-frontalier-geneve' AND md5(content_en) = '0ebd782c01bc887ae7f911c91fd3bbdd';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [32/62] guide-ressources-frontalier-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [33/62] ia-solitude-lien-social-coliving.content_fr : 1 substitution(s), 11865 -> 11874 caracteres
  --   annexe A no 18 - "candidate en ligne" -> "demande une visite en ligne"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'ia-solitude-lien-social-coliving';
  v := replace(v, U&'[candidate en ligne](/candidature)', U&'[demande une visite en ligne](/candidature)');
  IF md5(v) IS DISTINCT FROM 'ce8cdf824419ff68d0ee74eb5787e853' THEN RAISE EXCEPTION 'visite-articles [33/62] ia-solitude-lien-social-coliving.content_fr : resultat calcule md5 % au lieu de ce8cdf824419ff68d0ee74eb5787e853 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'ia-solitude-lien-social-coliving' AND md5(content_fr) = '01e5c5f389f2793f3841fba29a7c385e';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [33/62] ia-solitude-lien-social-coliving.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [34/62] ia-solitude-lien-social-coliving.content_en : 1 substitution(s), 11130 -> 11137 caracteres
  --   appendix A no. 18 - "apply online" -> "book a visit online"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'ia-solitude-lien-social-coliving';
  v := replace(v, U&'[apply online](/en/candidature)', U&'[book a visit online](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'a314c25c7a3c136375b948ae1f5dc444' THEN RAISE EXCEPTION 'visite-articles [34/62] ia-solitude-lien-social-coliving.content_en : resultat calcule md5 % au lieu de a314c25c7a3c136375b948ae1f5dc444 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'ia-solitude-lien-social-coliving' AND md5(content_en) = '4930e9a0921fe2d8873772875fed3389';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [34/62] ia-solitude-lien-social-coliving.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [35/62] living-in-france-working-in-geneva.content_fr : 1 substitution(s), 17698 -> 17706 caracteres
  --   annexe A no 19 - "Candidate en 2 minutes ->" -> "Demande ta visite en 2 minutes ->"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'living-in-france-working-in-geneva';
  v := replace(v, U&'[Candidate en 2 minutes \2192](/candidature)', U&'[Demande ta visite en 2 minutes \2192](/candidature)');
  IF md5(v) IS DISTINCT FROM '77360b9c15f389c6ca5d00b0ce60e440' THEN RAISE EXCEPTION 'visite-articles [35/62] living-in-france-working-in-geneva.content_fr : resultat calcule md5 % au lieu de 77360b9c15f389c6ca5d00b0ce60e440 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'living-in-france-working-in-geneva' AND md5(content_fr) = '8ca01ef2e6f54803102ef8b3719f92a7';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [35/62] living-in-france-working-in-geneva.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [36/62] lodge-annemasse-coliving-premium-portes-geneve.content_fr : 2 substitution(s), 15231 -> 15160 caracteres
  --   annexe A no 20 - etape 1 : "Tu remplis le [formulaire de candidature]... ton profil..." -> "Tu [demandes ta visite en ligne] : prenom, nom, email et t
  --   annexe A no 20 - conclusion : "[candidate directement] pour verifier la disponibilite" -> "[programme une visite] : on verifie avec toi les chambres d
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve';
  v := replace(v, U&'Tu remplis le [formulaire de candidature](/candidature) en ligne en pr\00e9sentant ton profil, ta situation professionnelle et tes attentes vis-\00e0-vis de la vie en coliving.', U&'Tu [demandes ta visite en ligne](/candidature) : pr\00e9nom, nom, email et t\00e9l\00e9phone, deux minutes.');
  v := replace(v, U&'ou [candidate directement](/candidature) pour v\00e9rifier la disponibilit\00e9 des chambres.', U&'ou [programme une visite](/candidature) : on v\00e9rifie avec toi les chambres disponibles.');
  IF md5(v) IS DISTINCT FROM '653fa950f876d37cf0e77391653ec2df' THEN RAISE EXCEPTION 'visite-articles [36/62] lodge-annemasse-coliving-premium-portes-geneve.content_fr : resultat calcule md5 % au lieu de 653fa950f876d37cf0e77391653ec2df -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve' AND md5(content_fr) = '22c4f489d9f7b2e52b1850deeb91bd24';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [36/62] lodge-annemasse-coliving-premium-portes-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [37/62] lodge-annemasse-coliving-premium-portes-geneve.content_en : 2 substitution(s), 13561 -> 13519 caracteres
  --   appendix A no. 20 - step 1: "You fill in the online [application form] presenting your profile..." -> "You [book your visit online]: first name, last 
  --   appendix A no. 20 - conclusion: "[apply directly] to check room availability" -> "[book a visit]: we'll check room availability with you"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve';
  v := replace(v, U&'You fill in the online [application form](/en/candidature) presenting your profile, your professional situation, and what you expect from coliving life.', U&'You [book your visit online](/en/candidature): first name, last name, email and phone, two minutes.');
  v := replace(v, U&'or [apply directly](/en/candidature) to check room availability.', U&'or [book a visit](/en/candidature): we''ll check room availability with you.');
  IF md5(v) IS DISTINCT FROM '446fe06be4794ec06827f0f08089defd' THEN RAISE EXCEPTION 'visite-articles [37/62] lodge-annemasse-coliving-premium-portes-geneve.content_en : resultat calcule md5 % au lieu de 446fe06be4794ec06827f0f08089defd -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve' AND md5(content_en) = '39fe2e66bbded4b3298eb6c0d95dd3d2';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [37/62] lodge-annemasse-coliving-premium-portes-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [38/62] non-la-villa-coliving-nest-pas-une-arnaque.content_fr : 2 substitution(s), 5580 -> 5585 caracteres
  --   annexe A no 21 - etape 1 : "Tu [candidates en ligne]" -> "Tu [demandes une visite en ligne]"
  --   annexe A no 21 - "Avant de candidater, trois lectures utiles" -> "Avant ta visite, trois lectures utiles"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque';
  v := replace(v, U&'1. Tu [candidates en ligne](/candidature), ou tu nous \00e9cris.', U&'1. Tu [demandes une visite en ligne](/candidature), ou tu nous \00e9cris.');
  v := replace(v, U&'Avant de candidater, trois lectures utiles', U&'Avant ta visite, trois lectures utiles');
  IF md5(v) IS DISTINCT FROM '902cbd6463b9be2a76995439414ddb28' THEN RAISE EXCEPTION 'visite-articles [38/62] non-la-villa-coliving-nest-pas-une-arnaque.content_fr : resultat calcule md5 % au lieu de 902cbd6463b9be2a76995439414ddb28 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque' AND md5(content_fr) = 'f775c5487c9c2e9e01accec0ca059eeb';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [38/62] non-la-villa-coliving-nest-pas-une-arnaque.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [39/62] non-la-villa-coliving-nest-pas-une-arnaque.content_en : 2 substitution(s), 5127 -> 5135 caracteres
  --   appendix A no. 21 - step 1: "You [apply online]" -> "You [book a visit online]"
  --   appendix A no. 21 - "Before you apply, three useful reads" -> "Before your visit, three useful reads"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque';
  v := replace(v, U&'1. You [apply online](/en/candidature), or you message us.', U&'1. You [book a visit online](/en/candidature), or you message us.');
  v := replace(v, U&'Before you apply, three useful reads', U&'Before your visit, three useful reads');
  IF md5(v) IS DISTINCT FROM '0d83c2f4d59b95d6c651dc676941ed20' THEN RAISE EXCEPTION 'visite-articles [39/62] non-la-villa-coliving-nest-pas-une-arnaque.content_en : resultat calcule md5 % au lieu de 0d83c2f4d59b95d6c651dc676941ed20 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque' AND md5(content_en) = '2f52c75a0be32fd11b4ab33fa8968ef9';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [39/62] non-la-villa-coliving-nest-pas-une-arnaque.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [40/62] organisations-internationales-geneve-ou-habiter.content_fr : 2 substitution(s), 7455 -> 7460 caracteres
  --   annexe A no 22 - titre "Comment candidater si tu es en poste OI" -> "Comment demander une visite si tu es en poste OI"
  --   annexe A no 22 - "Envoie ta candidature via notre [formulaire en ligne]" -> "Demande ta visite via notre [formulaire en ligne]"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'organisations-internationales-geneve-ou-habiter';
  v := replace(v, U&'## Comment candidater si tu es en poste OI', U&'## Comment demander une visite si tu es en poste OI');
  v := replace(v, U&'Envoie ta candidature via notre [formulaire en ligne](/candidature).', U&'Demande ta visite via notre [formulaire en ligne](/candidature).');
  IF md5(v) IS DISTINCT FROM 'b71bebeae2db2aed4be4431387a95865' THEN RAISE EXCEPTION 'visite-articles [40/62] organisations-internationales-geneve-ou-habiter.content_fr : resultat calcule md5 % au lieu de b71bebeae2db2aed4be4431387a95865 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'organisations-internationales-geneve-ou-habiter' AND md5(content_fr) = 'aa8c3e47ba6f02e6b75c63acc3bfc403';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [40/62] organisations-internationales-geneve-ou-habiter.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [41/62] organisations-internationales-geneve-ou-habiter.content_en : 2 substitution(s), 6833 -> 6835 caracteres
  --   appendix A no. 22 - heading "How to apply if you're in an IO position" -> "How to book a visit if you're in an IO position"
  --   appendix A no. 22 - "Submit your application via our [online form]" -> "Request your visit via our [online form]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'organisations-internationales-geneve-ou-habiter';
  v := replace(v, U&'## How to apply if you''re in an IO position', U&'## How to book a visit if you''re in an IO position');
  v := replace(v, U&'Submit your application via our [online form](/en/candidature).', U&'Request your visit via our [online form](/en/candidature).');
  IF md5(v) IS DISTINCT FROM '4c2993940c9ab8e054c09f6c2c77aa78' THEN RAISE EXCEPTION 'visite-articles [41/62] organisations-internationales-geneve-ou-habiter.content_en : resultat calcule md5 % au lieu de 4c2993940c9ab8e054c09f6c2c77aa78 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'organisations-internationales-geneve-ou-habiter' AND md5(content_en) = '0153c8d996c3fcc27f099f0fd17d62f5';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [41/62] organisations-internationales-geneve-ou-habiter.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [42/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_fr : 1 substitution(s), 15248 -> 15247 caracteres
  --   annexe A no 23 - "[la candidature se fait a distance]" -> "[la visite peut se faire en video]"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve';
  v := replace(v, U&'et [la candidature se fait \00e0 distance](/candidature).', U&'et [la visite peut se faire en vid\00e9o](/candidature).');
  IF md5(v) IS DISTINCT FROM '728830e3268710fedcda0d1cc2e8944c' THEN RAISE EXCEPTION 'visite-articles [42/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_fr : resultat calcule md5 % au lieu de 728830e3268710fedcda0d1cc2e8944c -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve' AND md5(content_fr) = '4d574f07ea1e3c5be550e3ee1432668b';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [42/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [43/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_en : 1 substitution(s), 15079 -> 15079 caracteres
  --   appendix A no. 23 - "[you can apply remotely]" -> "[you can visit by video]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve';
  v := replace(v, U&'and [you can apply remotely](/en/candidature).', U&'and [you can visit by video](/en/candidature).');
  IF md5(v) IS DISTINCT FROM '2bb0b68bbd498c60281e07594aa4ebd1' THEN RAISE EXCEPTION 'visite-articles [43/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_en : resultat calcule md5 % au lieu de 2bb0b68bbd498c60281e07594aa4ebd1 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve' AND md5(content_en) = 'ed8beb6c19c7c4326304d24be1145e89';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [43/62] ou-habiter-en-france-quand-on-travaille-a-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [44/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_fr : 1 substitution(s), 15422 -> 15428 caracteres
  --   annexe A no 24 - "la [candidature prend deux minutes]" -> "la [demande de visite prend deux minutes]" (comme /tarifs)
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
  v := replace(v, U&'la [candidature prend deux minutes](/candidature)', U&'la [demande de visite prend deux minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM 'cf8a57d27961ce843a6b3801ccc51201' THEN RAISE EXCEPTION 'visite-articles [44/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_fr : resultat calcule md5 % au lieu de cf8a57d27961ce843a6b3801ccc51201 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' AND md5(content_fr) = '7915537294651377c0b3ed1d54aaaec4';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [44/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [45/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_en : 1 substitution(s), 15423 -> 15425 caracteres
  --   appendix A no. 24 - "the [application takes two minutes]" -> "the [visit request takes two minutes]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
  v := replace(v, U&'the [application takes two minutes](/en/candidature)', U&'the [visit request takes two minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'b36f66e0c6ca4a7ecbec61ae4635f071' THEN RAISE EXCEPTION 'visite-articles [45/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_en : resultat calcule md5 % au lieu de b36f66e0c6ca4a7ecbec61ae4635f071 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' AND md5(content_en) = '6d3bd0f546ac82d91d17fa4b18160efe';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [45/62] ou-habiter-frontalier-suisse-villes-france-pas-cher.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [46/62] salaire-suisse-net-frontalier-2026.content_fr : 1 substitution(s), 13932 -> 13942 caracteres
  --   annexe A no 26 - "Postule en 2 min" -> "Demande ta visite en 2 min"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'salaire-suisse-net-frontalier-2026';
  v := replace(v, U&'[Postule en 2 min](/candidature)', U&'[Demande ta visite en 2 min](/candidature)');
  IF md5(v) IS DISTINCT FROM 'a81f27c83096f31567725db9b32feaeb' THEN RAISE EXCEPTION 'visite-articles [46/62] salaire-suisse-net-frontalier-2026.content_fr : resultat calcule md5 % au lieu de a81f27c83096f31567725db9b32feaeb -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'salaire-suisse-net-frontalier-2026' AND md5(content_fr) = '22750bc4eaea6e2353f8a3a5b4108d37';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [46/62] salaire-suisse-net-frontalier-2026.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [47/62] salaire-suisse-net-frontalier-2026.content_en : 1 substitution(s), 11229 -> 11242 caracteres
  --   appendix A no. 26 - "Apply in 2 min" -> "Request your visit in 2 min"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'salaire-suisse-net-frontalier-2026';
  v := replace(v, U&'[Apply in 2 min](/en/candidature)', U&'[Request your visit in 2 min](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '952930f0f371885c0066203275c65678' THEN RAISE EXCEPTION 'visite-articles [47/62] salaire-suisse-net-frontalier-2026.content_en : resultat calcule md5 % au lieu de 952930f0f371885c0066203275c65678 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'salaire-suisse-net-frontalier-2026' AND md5(content_en) = '6b7199efcade88f6f1ee47d1b54ff59f';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [47/62] salaire-suisse-net-frontalier-2026.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [48/62] se-faire-reseau-geneve-arriver-seul.content_fr : 1 substitution(s), 10721 -> 10728 caracteres
  --   annexe A no 27 - lien final "candidate ici" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'se-faire-reseau-geneve-arriver-seul';
  v := replace(v, U&'[candidate ici](/candidature)', U&'[programme une visite](/candidature)');
  IF md5(v) IS DISTINCT FROM '2d4b970fecc46e8d877eadb098c5cd43' THEN RAISE EXCEPTION 'visite-articles [48/62] se-faire-reseau-geneve-arriver-seul.content_fr : resultat calcule md5 % au lieu de 2d4b970fecc46e8d877eadb098c5cd43 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'se-faire-reseau-geneve-arriver-seul' AND md5(content_fr) = '5f255786c31080dad2f46e841ff72e22';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [48/62] se-faire-reseau-geneve-arriver-seul.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [49/62] se-faire-reseau-geneve-arriver-seul.content_en : 1 substitution(s), 9683 -> 9685 caracteres
  --   appendix A no. 27 - closing link "apply here" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'se-faire-reseau-geneve-arriver-seul';
  v := replace(v, U&'[apply here](/en/candidature)', U&'[book a visit](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '5aa4d833077af44d1640f7eb4c64589f' THEN RAISE EXCEPTION 'visite-articles [49/62] se-faire-reseau-geneve-arriver-seul.content_en : resultat calcule md5 % au lieu de 5aa4d833077af44d1640f7eb4c64589f -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'se-faire-reseau-geneve-arriver-seul' AND md5(content_en) = '86f42944cba64a2f03cc86fd50793b26';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [49/62] se-faire-reseau-geneve-arriver-seul.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [50/62] teletravail-frontalier-geneve-regles-2026.content_fr : 1 substitution(s), 11727 -> 11740 caracteres
  --   annexe A no 28 - lien final "postule" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
  v := replace(v, U&'[postule](/candidature)', U&'[programme une visite](/candidature)');
  IF md5(v) IS DISTINCT FROM '9d24bdf33b60c48968e28d9338e36891' THEN RAISE EXCEPTION 'visite-articles [50/62] teletravail-frontalier-geneve-regles-2026.content_fr : resultat calcule md5 % au lieu de 9d24bdf33b60c48968e28d9338e36891 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026' AND md5(content_fr) = 'cfbdbcb63089873de1331273fa7c34b7';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [50/62] teletravail-frontalier-geneve-regles-2026.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [51/62] teletravail-frontalier-geneve-regles-2026.content_en : 1 substitution(s), 10835 -> 10842 caracteres
  --   appendix A no. 28 - closing link "apply" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
  v := replace(v, U&'[apply](/en/candidature)', U&'[book a visit](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '06d90f258b2b347d513f4663b09034ca' THEN RAISE EXCEPTION 'visite-articles [51/62] teletravail-frontalier-geneve-regles-2026.content_en : resultat calcule md5 % au lieu de 06d90f258b2b347d513f4663b09034ca -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026' AND md5(content_en) = '478143470199e347eafe5d0faea06a65';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [51/62] teletravail-frontalier-geneve-regles-2026.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [52/62] temps-trajet-annemasse-geneve-par-quartier.content_fr : 1 substitution(s), 9240 -> 9241 caracteres
  --   annexe A no 29 - lien final "postule directement" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier';
  v := replace(v, U&'[postule directement](/candidature)', U&'[programme une visite](/candidature)');
  IF md5(v) IS DISTINCT FROM '137c997b5e48423f3c7562f16b54d8b2' THEN RAISE EXCEPTION 'visite-articles [52/62] temps-trajet-annemasse-geneve-par-quartier.content_fr : resultat calcule md5 % au lieu de 137c997b5e48423f3c7562f16b54d8b2 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier' AND md5(content_fr) = '9704b6cfc46258a26051912f9670fbb3';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [52/62] temps-trajet-annemasse-geneve-par-quartier.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [53/62] temps-trajet-annemasse-geneve-par-quartier.content_en : 1 substitution(s), 8629 -> 8627 caracteres
  --   appendix A no. 29 - closing link "apply directly" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier';
  v := replace(v, U&'[apply directly](/en/candidature)', U&'[book a visit](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '5e50b97066de8f92f4a4b621ff62bd84' THEN RAISE EXCEPTION 'visite-articles [53/62] temps-trajet-annemasse-geneve-par-quartier.content_en : resultat calcule md5 % au lieu de 5e50b97066de8f92f4a4b621ff62bd84 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier' AND md5(content_en) = 'fe56cc2f07f9aced97bcbb7ab04653b2';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [53/62] temps-trajet-annemasse-geneve-par-quartier.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [54/62] transport-annemasse-geneve-leman-express.content_fr : 1 substitution(s), 8451 -> 8459 caracteres
  --   annexe A no 30 - "Candidate en 2 minutes ->" -> "Demande ta visite en 2 minutes ->"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'transport-annemasse-geneve-leman-express';
  v := replace(v, U&'[Candidate en 2 minutes \2192](/candidature)', U&'[Demande ta visite en 2 minutes \2192](/candidature)');
  IF md5(v) IS DISTINCT FROM 'ec1013dd9d8d3110ed5369358056d7fe' THEN RAISE EXCEPTION 'visite-articles [54/62] transport-annemasse-geneve-leman-express.content_fr : resultat calcule md5 % au lieu de ec1013dd9d8d3110ed5369358056d7fe -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'transport-annemasse-geneve-leman-express' AND md5(content_fr) = '18d83d1451b3b6c5908f402cf8f946b0';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [54/62] transport-annemasse-geneve-leman-express.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [55/62] trouver-colocation-geneve-frontalier.content_fr : 2 substitution(s), 6302 -> 6323 caracteres
  --   annexe A no 31 - intro : "voir les chambres libres et candidater" -> "... et programmer une visite" (ancre exacte du lien inchangee)
  --   annexe A no 31 - "postule en 2 minutes" -> "demande ta visite en 2 minutes" (adresse ?src=bloc_offre inchangee)
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'trouver-colocation-geneve-frontalier';
  v := replace(v, U&'voir les chambres libres et candidater, va sur notre page [colocation \00e0 Gen\00e8ve c\00f4t\00e9 France](/colocation-geneve)', U&'voir les chambres libres et programmer une visite, va sur notre page [colocation \00e0 Gen\00e8ve c\00f4t\00e9 France](/colocation-geneve)');
  v := replace(v, U&'[postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)', U&'[demande ta visite en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)');
  IF md5(v) IS DISTINCT FROM '647b7e68636b78fe11ec28eebfb120cc' THEN RAISE EXCEPTION 'visite-articles [55/62] trouver-colocation-geneve-frontalier.content_fr : resultat calcule md5 % au lieu de 647b7e68636b78fe11ec28eebfb120cc -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'trouver-colocation-geneve-frontalier' AND md5(content_fr) = 'cfe95e5a61ce18b2a4d4f53ef99bedaa';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [55/62] trouver-colocation-geneve-frontalier.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [56/62] trouver-colocation-geneve-frontalier.content_en : 1 substitution(s), 5892 -> 5905 caracteres
  --   appendix A no. 31 - "Apply in 2 minutes" -> "Request your visit in 2 minutes"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'trouver-colocation-geneve-frontalier';
  v := replace(v, U&'[Apply in 2 minutes](/en/candidature)', U&'[Request your visit in 2 minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '76eb649b45c4c4e156c7e2c0134e5216' THEN RAISE EXCEPTION 'visite-articles [56/62] trouver-colocation-geneve-frontalier.content_en : resultat calcule md5 % au lieu de 76eb649b45c4c4e156c7e2c0134e5216 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'trouver-colocation-geneve-frontalier' AND md5(content_en) = '76bd3f5a06482f8f12a22d5de9129cab';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [56/62] trouver-colocation-geneve-frontalier.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [57/62] trouver-logement-avant-d-arriver-geneve.content_fr : 1 substitution(s), 14607 -> 14596 caracteres
  --   annexe A no 32 - "[la candidature se remplit a distance], avant meme la premiere visite" -> "[la visite peut se faire en video], avant meme ton arrive
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'trouver-logement-avant-d-arriver-geneve';
  v := replace(v, U&'et [la candidature se remplit \00e0 distance](/candidature), avant m\00eame la premi\00e8re visite.', U&'et [la visite peut se faire en vid\00e9o](/candidature), avant m\00eame ton arriv\00e9e.');
  IF md5(v) IS DISTINCT FROM '970eb45b0ce422ec5edcb50bc0e521a9' THEN RAISE EXCEPTION 'visite-articles [57/62] trouver-logement-avant-d-arriver-geneve.content_fr : resultat calcule md5 % au lieu de 970eb45b0ce422ec5edcb50bc0e521a9 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'trouver-logement-avant-d-arriver-geneve' AND md5(content_fr) = '776c47ed3dd36ffebd406b5e6bae0b70';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [57/62] trouver-logement-avant-d-arriver-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [58/62] trouver-logement-avant-d-arriver-geneve.content_en : 1 substitution(s), 14108 -> 14092 caracteres
  --   appendix A no. 32 - "[the application can be done remotely], before you've even had a viewing" -> "[the visit can be done by video], before you even a
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'trouver-logement-avant-d-arriver-geneve';
  v := replace(v, U&'and [the application can be done remotely](/en/candidature), before you''ve even had a viewing.', U&'and [the visit can be done by video](/en/candidature), before you even arrive.');
  IF md5(v) IS DISTINCT FROM '42191eb68554b67ddaf9038432b71f4e' THEN RAISE EXCEPTION 'visite-articles [58/62] trouver-logement-avant-d-arriver-geneve.content_en : resultat calcule md5 % au lieu de 42191eb68554b67ddaf9038432b71f4e -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'trouver-logement-avant-d-arriver-geneve' AND md5(content_en) = '16e04c72f98037ba987174508fd3de2e';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [58/62] trouver-logement-avant-d-arriver-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [59/62] vie-quotidienne-frontalier-courses-sport-sorties.content_fr : 1 substitution(s), 9467 -> 9474 caracteres
  --   annexe A no 33 - lien final "candidate ici" -> "programme une visite"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties';
  v := replace(v, U&'[candidate ici](/candidature)', U&'[programme une visite](/candidature)');
  IF md5(v) IS DISTINCT FROM 'feab38517cebf43149b63ab52f013ab7' THEN RAISE EXCEPTION 'visite-articles [59/62] vie-quotidienne-frontalier-courses-sport-sorties.content_fr : resultat calcule md5 % au lieu de feab38517cebf43149b63ab52f013ab7 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties' AND md5(content_fr) = 'af287b3519f955fd47e458883f4d7cc8';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [59/62] vie-quotidienne-frontalier-courses-sport-sorties.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [60/62] vie-quotidienne-frontalier-courses-sport-sorties.content_en : 1 substitution(s), 8721 -> 8723 caracteres
  --   appendix A no. 33 - closing link "apply here" -> "book a visit"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties';
  v := replace(v, U&'[apply here](/en/candidature)', U&'[book a visit](/en/candidature)');
  IF md5(v) IS DISTINCT FROM 'e6103080cbff0e7ffba7635de81b3679' THEN RAISE EXCEPTION 'visite-articles [60/62] vie-quotidienne-frontalier-courses-sport-sorties.content_en : resultat calcule md5 % au lieu de e6103080cbff0e7ffba7635de81b3679 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties' AND md5(content_en) = '20e241df350d8d51965294041a85dc9e';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [60/62] vie-quotidienne-frontalier-courses-sport-sorties.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [61/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_fr : 1 substitution(s), 12791 -> 12797 caracteres
  --   annexe A no 34 - "la [candidature prend deux minutes]" -> "la [demande de visite prend deux minutes]"
  SELECT content_fr INTO v FROM public.blog_posts WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve';
  v := replace(v, U&'la [candidature prend deux minutes](/candidature)', U&'la [demande de visite prend deux minutes](/candidature)');
  IF md5(v) IS DISTINCT FROM '566256ca07b180c5d9d1ff9248318fa6' THEN RAISE EXCEPTION 'visite-articles [61/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_fr : resultat calcule md5 % au lieu de 566256ca07b180c5d9d1ff9248318fa6 -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_fr = v, updated_at = now() WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve' AND md5(content_fr) = 'e865b33e2b9e24530798e13dd60a1310';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [61/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_fr : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- [62/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_en : 1 substitution(s), 12488 -> 12490 caracteres
  --   appendix A no. 34 - "the [application takes two minutes]" -> "the [visit request takes two minutes]"
  SELECT content_en INTO v FROM public.blog_posts WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve';
  v := replace(v, U&'the [application takes two minutes](/en/candidature)', U&'the [visit request takes two minutes](/en/candidature)');
  IF md5(v) IS DISTINCT FROM '8149714ea63047bb21397affc67b942c' THEN RAISE EXCEPTION 'visite-articles [62/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_en : resultat calcule md5 % au lieu de 8149714ea63047bb21397affc67b942c -- tout est annule', md5(v); END IF;
  UPDATE public.blog_posts SET content_en = v, updated_at = now() WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve' AND md5(content_en) = '0b3a6cc82f2385b22a1ac5681388807b';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-articles [62/62] vivre-a-annemasse-quand-on-travaille-a-geneve.content_en : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- 4. garde de sortie : md5 complet de chaque champ = etat calcule a la preparation
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
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'visite-articles : etat obtenu different de l''etat attendu, tout est annule -- %', ecarts; END IF;
END
$seance$;

COMMIT;

-- Verification (lecture seule, apres COMMIT) : ok = true sur les 62 lignes
SELECT e.slug, e.champ, md5(CASE e.champ WHEN 'content_fr' THEN b.content_fr WHEN 'content_en' THEN b.content_en END) = e.md5_attendu AS ok, length(CASE e.champ WHEN 'content_fr' THEN b.content_fr WHEN 'content_en' THEN b.content_en END) AS longueur, e.longueur_attendue, b.updated_at
FROM (VALUES
  ('arnaques-logement-frontalier-geneve-eviter', 'content_fr', '421193cb93ac811068719b6e80379f25', 12675),
  ('arnaques-logement-frontalier-geneve-eviter', 'content_en', 'ebb5f9e3e8bfa6f512bb3fd19a930379', 11506),
  ('assurance-sante-frontalier-lamal-cmu-budget', 'content_fr', '462f14df0e91aac44e1f7849b3ff859a', 9602),
  ('assurance-sante-frontalier-lamal-cmu-budget', 'content_en', 'ebad1e57236ac6038cdc4cda178df16e', 9051),
  ('banque-telephone-internet-frontalier-bons-plans', 'content_fr', '64cfd1ef0292e4ac8bd6a99ee176b237', 10163),
  ('banque-telephone-internet-frontalier-bons-plans', 'content_en', '22d34f36cc5719598520195715bde521', 9418),
  ('budget-colocation-geneve-guide-complet', 'content_fr', 'b1d4ba71e554b6d902568aa4e0cb6edf', 25342),
  ('budget-colocation-geneve-guide-complet', 'content_en', 'd9923621649c469c785f9477a0a5a6ce', 21221),
  ('choc-culturel-franco-suisse-expatrie-geneve', 'content_fr', '7d83440c304812118e2760265bf18ff3', 10982),
  ('choc-culturel-franco-suisse-expatrie-geneve', 'content_en', '874b0de4456e9981acbba5f3301b674f', 10316),
  ('coliving-annemasse-geneve-frontaliers-avantages', 'content_fr', '86de3563aa27a33f5cccb708e8a2143c', 12746),
  ('coliving-annemasse-geneve-frontaliers-avantages', 'content_en', '947df784366680e1944547cc09a44adc', 11888),
  ('coliving-colocation-ou-studio-geneve-comparatif', 'content_fr', '930668c2cdd287e5ba2635eb194c9f48', 14338),
  ('coliving-colocation-ou-studio-geneve-comparatif', 'content_en', 'ef081b6bf8f474db3a7768261fcefd1b', 13851),
  ('coliving-communaute-reels-amis-geneve-annemasse', 'content_fr', 'f5629db0f3163d21a4efe38e72f45099', 11089),
  ('coliving-communaute-reels-amis-geneve-annemasse', 'content_en', '94afbbcd59dc0703857a9fb6d15ca6d8', 9708),
  ('coliving-frais-dossier-geneve-annemasse', 'content_fr', '3f8438674919323dc78b8ff498815f78', 8237),
  ('coliving-frais-dossier-geneve-annemasse', 'content_en', '0155d81fd699348a87f3736d67771ebb', 7330),
  ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'content_fr', '9c7fa5e10c0250610453f58d0bb34282', 3936),
  ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'content_en', '0f91d57d8a59cd556f24fc990b1aabff', 3818),
  ('colocation-annemasse-ville-la-grand-ambilly', 'content_fr', 'ba2ff875fc62fcce502101770bb7120c', 9104),
  ('cout-transport-frontalier-geneve-2026', 'content_fr', '7f810ca06a9788323fad6f08ce778a38', 9128),
  ('cout-transport-frontalier-geneve-2026', 'content_en', 'b9b10af172ca3c132975ad4c4b583a68', 8503),
  ('dossier-location-frontalier-suisse-france', 'content_fr', 'cea73ddf37342422bae6a8ae37932136', 9087),
  ('dossier-location-frontalier-suisse-france', 'content_en', '784e3b1b5f6fbbd48e032b4119d0417c', 8428),
  ('espaces-verts-coliving-lodge-annemasse', 'content_fr', '868364a8d3c11b30e1d3d72018f61d83', 3553),
  ('espaces-verts-coliving-lodge-annemasse', 'content_en', 'bdb7d5c1dbeb8578cc9b35cb9ed7c110', 3271),
  ('fiscalite-frontalier-geneve-impots-2026', 'content_fr', '6dcab202f709f1bb0b9f43bccd91ae6e', 10725),
  ('fiscalite-frontalier-geneve-impots-2026', 'content_en', '7cf38cf7ddd02c989801430a1a5ce8fa', 10056),
  ('grand-geneve-2026-nouveautes-frontaliers', 'content_fr', '118c2871bfadd8871aba39d8b57a013b', 8686),
  ('guide-ressources-frontalier-geneve', 'content_fr', '363544b549f614f77ac335a513c9393d', 40531),
  ('guide-ressources-frontalier-geneve', 'content_en', '816c2011d4208287df2c67c28e33434a', 37373),
  ('ia-solitude-lien-social-coliving', 'content_fr', 'ce8cdf824419ff68d0ee74eb5787e853', 11874),
  ('ia-solitude-lien-social-coliving', 'content_en', 'a314c25c7a3c136375b948ae1f5dc444', 11137),
  ('living-in-france-working-in-geneva', 'content_fr', '77360b9c15f389c6ca5d00b0ce60e440', 17706),
  ('lodge-annemasse-coliving-premium-portes-geneve', 'content_fr', '653fa950f876d37cf0e77391653ec2df', 15160),
  ('lodge-annemasse-coliving-premium-portes-geneve', 'content_en', '446fe06be4794ec06827f0f08089defd', 13519),
  ('non-la-villa-coliving-nest-pas-une-arnaque', 'content_fr', '902cbd6463b9be2a76995439414ddb28', 5585),
  ('non-la-villa-coliving-nest-pas-une-arnaque', 'content_en', '0d83c2f4d59b95d6c651dc676941ed20', 5135),
  ('organisations-internationales-geneve-ou-habiter', 'content_fr', 'b71bebeae2db2aed4be4431387a95865', 7460),
  ('organisations-internationales-geneve-ou-habiter', 'content_en', '4c2993940c9ab8e054c09f6c2c77aa78', 6835),
  ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'content_fr', '728830e3268710fedcda0d1cc2e8944c', 15247),
  ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'content_en', '2bb0b68bbd498c60281e07594aa4ebd1', 15079),
  ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', 'cf8a57d27961ce843a6b3801ccc51201', 15428),
  ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', 'b36f66e0c6ca4a7ecbec61ae4635f071', 15425),
  ('salaire-suisse-net-frontalier-2026', 'content_fr', 'a81f27c83096f31567725db9b32feaeb', 13942),
  ('salaire-suisse-net-frontalier-2026', 'content_en', '952930f0f371885c0066203275c65678', 11242),
  ('se-faire-reseau-geneve-arriver-seul', 'content_fr', '2d4b970fecc46e8d877eadb098c5cd43', 10728),
  ('se-faire-reseau-geneve-arriver-seul', 'content_en', '5aa4d833077af44d1640f7eb4c64589f', 9685),
  ('teletravail-frontalier-geneve-regles-2026', 'content_fr', '9d24bdf33b60c48968e28d9338e36891', 11740),
  ('teletravail-frontalier-geneve-regles-2026', 'content_en', '06d90f258b2b347d513f4663b09034ca', 10842),
  ('temps-trajet-annemasse-geneve-par-quartier', 'content_fr', '137c997b5e48423f3c7562f16b54d8b2', 9241),
  ('temps-trajet-annemasse-geneve-par-quartier', 'content_en', '5e50b97066de8f92f4a4b621ff62bd84', 8627),
  ('transport-annemasse-geneve-leman-express', 'content_fr', 'ec1013dd9d8d3110ed5369358056d7fe', 8459),
  ('trouver-colocation-geneve-frontalier', 'content_fr', '647b7e68636b78fe11ec28eebfb120cc', 6323),
  ('trouver-colocation-geneve-frontalier', 'content_en', '76eb649b45c4c4e156c7e2c0134e5216', 5905),
  ('trouver-logement-avant-d-arriver-geneve', 'content_fr', '970eb45b0ce422ec5edcb50bc0e521a9', 14596),
  ('trouver-logement-avant-d-arriver-geneve', 'content_en', '42191eb68554b67ddaf9038432b71f4e', 14092),
  ('vie-quotidienne-frontalier-courses-sport-sorties', 'content_fr', 'feab38517cebf43149b63ab52f013ab7', 9474),
  ('vie-quotidienne-frontalier-courses-sport-sorties', 'content_en', 'e6103080cbff0e7ffba7635de81b3679', 8723),
  ('vivre-a-annemasse-quand-on-travaille-a-geneve', 'content_fr', '566256ca07b180c5d9d1ff9248318fa6', 12797),
  ('vivre-a-annemasse-quand-on-travaille-a-geneve', 'content_en', '8149714ea63047bb21397affc67b942c', 12490)
) AS e(slug, champ, md5_attendu, longueur_attendue)
JOIN public.blog_posts b ON b.slug = e.slug
ORDER BY e.slug, e.champ;
