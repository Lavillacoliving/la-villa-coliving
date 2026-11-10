-- ============================================================================
-- Séance de publication d'A3 du 30/10/2026 (brief « Genève profils »), sur feu vert de Jérôme (« Oui, publie A3 »).
-- SQL EXÉCUTÉ (MCP, 17:15 UTC) : équivalent en une transaction de scripts/a3-publication-liens-2026-10-30.sql (22 retouches)
-- puis de scripts/maj-article-trouver-logement-avant-d-arriver-geneve-2026-10-30.sql (publication + consolidation) :
--   · chaînes en U&'' (ASCII pur, aucune espace insécable à recopier) ;
--   · A3 : remplacements D-S6 sur le brouillon déjà en base plutôt que le contenu complet (métadonnées identiques, md5 vérifié) ;
--   · bloc final d'assertions : md5 attendus de 15 lignes (calculés sur l'état vivant sauvegardé), A3 publié, checklist
--     dépubliée, 42 articles publiés, aucun lien publié vers une URL redirigée — au moindre écart, rien n'est écrit.
--     (Un premier passage a été annulé par ces assertions : longueur attendue de meilleurs-quartiers fausse, 5402 au lieu de 5401.)
-- Sauvegarde : scripts/backups/a3-publication-2026-10-30.avant.json · retour arrière : .retour-arriere.sql (même dossier).
-- ============================================================================
BEGIN;
UPDATE blog_posts SET content_fr = replace(content_fr, U&'- [Arriver seul \00E0 Gen\00E8ve : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)', U&'- [Se loger c\00F4t\00E9 France avant d''arriver \00E0 Gen\00E8ve](/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';
UPDATE blog_posts SET content_en = replace(content_en, U&'- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)', U&'- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'- [Arriver seul \00E0 Gen\00E8ve : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)', U&'- [Se loger c\00F4t\00E9 France avant d''arriver \00E0 Gen\00E8ve](/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve';
UPDATE blog_posts SET content_en = replace(content_en, U&'- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)', U&'- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'- [Arriver seul \00E0 Gen\00E8ve : le guide des 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)', U&'- [Se loger c\00F4t\00E9 France avant d''arriver \00E0 Gen\00E8ve](/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'dossier-location-frontalier-suisse-france';
UPDATE blog_posts SET content_en = replace(content_en, U&'- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)', U&'- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'dossier-location-frontalier-suisse-france';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'- [Arriver seul \00E0 Gen\00E8ve : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)', U&'- [Se loger c\00F4t\00E9 France avant d''arriver \00E0 Gen\00E8ve](/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'se-faire-reseau-geneve-arriver-seul';
UPDATE blog_posts SET content_en = replace(content_en, U&'- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)', U&'- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'se-faire-reseau-geneve-arriver-seul';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'- [Arriver seul \00E0 Gen\00E8ve : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)', U&'- [Se loger c\00F4t\00E9 France avant d''arriver \00E0 Gen\00E8ve](/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties';
UPDATE blog_posts SET content_en = replace(content_en, U&'- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)', U&'- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'- [Arriver seul \00E0 Gen\00E8ve : les 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)
- [D\00E9m\00E9nager pr\00E8s de Gen\00E8ve : la checklist compl\00E8te](/blog/demenager-geneve-frontalier-checklist)', U&'- [Se loger c\00F4t\00E9 France avant d''arriver \00E0 Gen\00E8ve](/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'organisations-internationales-geneve-ou-habiter';
UPDATE blog_posts SET content_en = replace(content_en, U&'- [Arriving alone in Geneva: the first 30 days](/en/blog/demenager-geneve-frontalier-checklist)
- [Moving near Geneva: the complete checklist](/en/blog/demenager-geneve-frontalier-checklist)', U&'- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)') WHERE slug = 'organisations-internationales-geneve-ou-habiter';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'Une fois ta ville choisie, [la checklist d\00E9m\00E9nagement de La Villa](/blog/demenager-geneve-frontalier-checklist) t''\00E9vite d''oublier une d\00E9marche.', U&'Une fois ta ville choisie, [le calendrier pour te loger c\00F4t\00E9 France avant d''arriver](/blog/trouver-logement-avant-d-arriver-geneve) t''\00E9vite d''oublier une \00E9tape.') WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
UPDATE blog_posts SET content_en = replace(content_en, U&'Once you''ve picked your town, [La Villa''s moving checklist](/en/blog/demenager-geneve-frontalier-checklist) makes sure you don''t miss a step.', U&'Once you''ve picked your town, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) makes sure you don''t miss a step.') WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'D\00E9couvre [nos maisons](/nos-maisons).

## En r\00E9sum\00E9', U&'D\00E9couvre [nos maisons](/nos-maisons).

Si tu n''as pas encore de logement et que tu ne peux pas visiter avant d''arriver, [notre calendrier de J-60 au jour J](/blog/trouver-logement-avant-d-arriver-geneve) te dit quoi faire et quand.

## En r\00E9sum\00E9') WHERE slug = 'permis-g-frontalier-geneve';
UPDATE blog_posts SET content_en = replace(content_en, U&'Discover [our houses](/en/nos-maisons).

## In short', U&'Discover [our houses](/en/nos-maisons).

If you don''t have a place yet and can''t view before you arrive, [our countdown from D-60 to day 0](/en/blog/trouver-logement-avant-d-arriver-geneve) tells you what to do and when.

## In short') WHERE slug = 'permis-g-frontalier-geneve';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'Si c''est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio.', U&'Si c''est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio. Si tu as deux mois devant toi, [le calendrier pour te loger c\00F4t\00E9 France avant d''arriver](/blog/trouver-logement-avant-d-arriver-geneve) commence \00E0 J-60.') WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france';
UPDATE blog_posts SET content_en = replace(content_en, U&'If it is the French side, you send two or three applications and ask for a video visit.', U&'If it is the French side, you send two or three applications and ask for a video visit. If you have two months ahead of you, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) starts at D-60.') WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'Un vrai propri\00E9taire comprendra la d\00E9marche.

## L''arnaque n\00B02', U&'Un vrai propri\00E9taire comprendra la d\00E9marche.

Si tu cherches \00E0 distance, [notre calendrier pour te loger c\00F4t\00E9 France avant d''arriver](/blog/trouver-logement-avant-d-arriver-geneve) place ces v\00E9rifications au bon moment, avant de verser quoi que ce soit.

## L''arnaque n\00B02') WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';
UPDATE blog_posts SET content_en = replace(content_en, U&'A real landlord will understand the request.

## Scam #2', U&'A real landlord will understand the request.

If you''re searching from a distance, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) puts these checks at the right point, before you pay anything.

## Scam #2') WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'**juin-ao\00FBt** offre plus de choix mais aux prix les plus hauts.', U&'**juin-ao\00FBt** offre plus de choix mais aux prix les plus hauts. Si tu arrives d''ailleurs, [le calendrier pour te loger c\00F4t\00E9 France avant d''arriver](/blog/trouver-logement-avant-d-arriver-geneve) cale chaque \00E9tape de J-60 au jour J.') WHERE slug = 'guide-ressources-frontalier-geneve';
UPDATE blog_posts SET content_en = replace(content_en, U&'**June-August** offers more choice but at the highest prices.', U&'**June-August** offers more choice but at the highest prices. If you''re moving from elsewhere, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) sets out each step from D-60 to day 0.') WHERE slug = 'guide-ressources-frontalier-geneve';
UPDATE blog_posts SET content_fr = replace(replace(content_fr, U&'**Le p\00E9rim\00E8tre part de ton lieu de travail.** Un poste aux Eaux-Vives ou aux HUG ne se vit pas comme un poste aux Nations ou \00E0 l''a\00E9roport. Notre guide [o\00F9 habiter en France quand on travaille \00E0 Gen\00E8ve](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) raisonne profil par profil, et [les villes c\00F4t\00E9 France, compar\00E9es](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune.', U&'**Le p\00E9rim\00E8tre part de ton lieu de travail.** Un poste aux Eaux-Vives ou aux HUG ne se vit pas comme un poste aux Nations ou \00E0 l''a\00E9roport. [Les villes c\00F4t\00E9 France, compar\00E9es](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.'), U&'
- [O\00F9 habiter en France quand on travaille \00E0 Gen\00E8ve ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
', U&'
'),
  content_en = replace(replace(content_en, U&'**Your area starts from your workplace.** A job in Eaux-Vives or at the HUG hospitals is a different daily life from a job at the UN or the airport. Our guide to [where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) works through it profile by profile, and [the French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town.', U&'**Your area starts from your workplace.** A job in Eaux-Vives or at the HUG hospitals is a different daily life from a job at the UN or the airport. [The French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.'), U&'
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
', U&'
'),
  is_published = true, published_at = COALESCE(published_at, now()), updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve' AND is_published = false;
UPDATE blog_posts SET is_published = false, updated_at = now() WHERE slug = 'demenager-geneve-frontalier-checklist';
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/demenager-geneve-frontalier-checklist)', '](/blog/trouver-logement-avant-d-arriver-geneve)'),
  content_en = replace(replace(content_en, '](/en/blog/demenager-geneve-frontalier-checklist)', '](/en/blog/trouver-logement-avant-d-arriver-geneve)'), '](/blog/demenager-geneve-frontalier-checklist)', '](/en/blog/trouver-logement-avant-d-arriver-geneve)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/demenager-geneve-frontalier-checklist)%' OR content_en LIKE '%/blog/demenager-geneve-frontalier-checklist)%';
DO $chk$
DECLARE bad text;
BEGIN
  SELECT string_agg(e.slug, ', ') INTO bad FROM (VALUES
    ('arnaques-logement-frontalier-geneve-eviter','c955bb0a3defe9d9e3a1ca63ceb3821b','0da0ed2b0201fd1fb443388d935dcc79'),
    ('banque-telephone-internet-frontalier-bons-plans','3f4f1e0bc195ceb8f15ac2e12b41ba96','626525bdba437eb86bc9c4cf57c9a716'),
    ('choc-culturel-franco-suisse-expatrie-geneve','fff667f0157d3ac9d8ed07a107edd49a','2667b2b5c06906d0cdfbbe23cd203528'),
    ('demenager-geneve-frontalier-checklist','30507e9465fec2b59a1b19619b4dbaac','e88adbd22ab482394a0be4fb0cdaac0f'),
    ('dossier-location-frontalier-suisse-france','1661f15c804208d026208e71313cfae2','057bfdf36f207d3197faf59be26e2e85'),
    ('guide-ressources-frontalier-geneve','522fcdc81caefdce4e5428a676d5644e','fb249370bdacacac5e9a9a7739767bb0'),
    ('living-in-france-working-in-geneva','9cd9a52954da69ce53a504f931f4e4e8','6a0f6c040083cee2a9f72acf4e0fea1d'),
    ('organisations-internationales-geneve-ou-habiter','06b5648910d92151ceac2f0fda1b7d14','db31904c67d0d3b5447b50627d95bd2e'),
    ('ou-habiter-frontalier-suisse-villes-france-pas-cher','9dc3f7a948d0dd02e87176d4f9693a76','1b0c676814df3f7f4684d46f838488c9'),
    ('permis-g-frontalier-geneve','d6411be083b7be76f15b2d0f14ff3154','1e72043f6f629edcf5bd36f07b1eb57a'),
    ('quitter-son-logement-guide-pratique','749c378604fd58452a4b591b40e25f15','cf193a0af5119b52be0991278e2853a6'),
    ('s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france','0d6ce808826d611a509086d52ab83cda','4a63d1e0bf7b8c5c1b7126567826b6db'),
    ('se-faire-reseau-geneve-arriver-seul','399f8780e371dbe153a00ab6ab374d0b','3a30f44308298776e0bb7e85a784c676'),
    ('trouver-logement-avant-d-arriver-geneve','a5f00eead58497d9be2acb63b8584a78','1b5ec74a55c5b08980f23bc41ee788fa'),
    ('vie-quotidienne-frontalier-courses-sport-sorties','599d2f860890e3093e1446915cd9440f','36cacea23a0fa366bda7cd315e17440e')) AS e(slug, f, en)
  LEFT JOIN blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(b.content_fr) <> e.f OR md5(b.content_en) <> e.en;
  IF bad IS NOT NULL THEN RAISE EXCEPTION 'md5 inattendu, rien n''est ecrit : %', bad; END IF;
  IF (SELECT count(*) FROM blog_posts WHERE slug = 'meilleurs-quartiers-frontaliers-geneve' AND length(content_fr) = 5401
        AND md5(content_en) = '8d831f425c31a9ac5b0214f278d78a8e' AND position('](/blog/trouver-logement-avant-d-arriver-geneve)' IN content_fr) > 0 AND NOT is_published) <> 1
    THEN RAISE EXCEPTION 'meilleurs-quartiers inattendu'; END IF;
  IF (SELECT is_published FROM blog_posts WHERE slug = 'trouver-logement-avant-d-arriver-geneve') IS NOT TRUE OR (SELECT published_at FROM blog_posts WHERE slug = 'trouver-logement-avant-d-arriver-geneve') IS NULL
    THEN RAISE EXCEPTION 'A3 non publie'; END IF;
  IF (SELECT is_published FROM blog_posts WHERE slug = 'demenager-geneve-frontalier-checklist') IS NOT FALSE THEN RAISE EXCEPTION 'checklist encore publiee'; END IF;
  IF (SELECT count(*) FROM blog_posts WHERE is_published) <> 42 THEN RAISE EXCEPTION 'nombre d''articles publies <> 42'; END IF;
  IF EXISTS (SELECT 1 FROM blog_posts WHERE is_published AND (content_fr LIKE '%/blog/demenager-geneve-frontalier-checklist)%' OR content_en LIKE '%/blog/demenager-geneve-frontalier-checklist)%' OR content_fr LIKE '%/blog/arriver-seul-geneve-guide-30-jours)%' OR content_en LIKE '%/blog/arriver-seul-geneve-guide-30-jours)%'))
    THEN RAISE EXCEPTION 'lien restant vers une URL redirigee'; END IF;
END $chk$;
COMMIT;
