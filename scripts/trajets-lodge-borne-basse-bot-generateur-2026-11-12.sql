-- ============================================================================
-- Le Lodge, borne basse — base de connaissances du bot et consigne du générateur d'articles (décisions de Jérôme du 12/11/2026)
-- Écrit par la session du 12/11/2026 depuis la source unique de la branche fix/trajets-lodge-borne-basse (TRANSIT, GENEVA_COMMUTE_FORMULA) ;
-- textes « avant » lus en base le 12/11/2026 (lecture seule).
-- Pourquoi   : knowledge_base répond aux prospects (bot Messenger / Instagram / WhatsApp) et sert de source au générateur d'articles du
--              dimanche (n8n), qui lit aussi la consigne active blog_editorial_strategy. Sans cette mise à jour, le bot et les futurs
--              articles reprendraient « 30 min jusqu'au centre », que la garde check:facts de la branche interdit désormais.
-- Contenu    : 3 réponses de knowledge_base et consigne v8 = replace() successifs sur la v7, v7 désactivée, jamais supprimée.
--              Garde d'entrée (bloc DO) : si une réponse ou la v7 a changé depuis la lecture du 12/11/2026, rien n'est appliqué.
--              Garde de sortie (bloc DO avant COMMIT) : si l'état obtenu n'est pas l'état attendu (md5), la transaction est annulée.
--              Aucune adresse dans ces réponses (contrôlé en base et sur ce fichier).
-- Textes validés par Jérôme le 12/11/2026 à 22 h (« Oui, mets en ligne ») :
--   (1) coliving-geneva-area et what-makes-lavilla-different — « à seulement 25 minutes du centre de Genève » / « just 25 minutes from Geneva city center » : la formule de marque
--       (« 25 min jusqu'au centre »), meilleur cas des trois maisons (Le Lodge 25 min de Rive, La Villa 26, Le Loft 32 en tram).
--       La seconde disait « à seulement 30 minutes de Genève » : même promesse, destination désormais nommée.
--   (2) location-geneva — « Toutes sont à moins de 30 minutes du centre de Genève » ne peut pas devenir « moins de 25 » (La Villa 26 min, Le Loft 32 min) :
--       proposition « Elles sont toutes entre 25 et 32 minutes du centre de Genève (Rive), porte-à-porte, selon la maison » / « All are between 25 and 32 minutes from Geneva city center (Rive), door to door, depending on the house ».
-- Ordre      : indépendant des gardes du site ; à appliquer dans la même séance que scripts/trajets-lodge-borne-basse-2026-11-12.sql, et avant le prochain
--              passage du générateur d'articles (dimanche 8 h selon Schema_Supabase_LaVilla.md §8.3, soit le 15/11/2026).
-- Encodage   : UTF-8 (tirets cadratins, guillemets français, accents) — ne pas normaliser. Aucune espace insécable dans les textes.
-- ============================================================================
BEGIN;
-- Garde tout-ou-rien : si une réponse ou la consigne v7 a changé depuis la lecture du 12/11/2026, rien n'est appliqué.
DO $garde$
BEGIN
  IF (SELECT count(*) FROM public.knowledge_base WHERE (id = '195aa837-da20-4dba-a3e7-cb427a241db7'::uuid AND md5(answer) = '589f07a1cd12b10fcf54f67d46ac1424' AND md5(answer_en) = 'e738242bf30e082616b5cfc8baa0737f') OR (id = '8f3ac24a-5d52-46f2-9a8f-1f85524d0351'::uuid AND md5(answer) = '57a2798e7962b1972183cef45add643d' AND md5(answer_en) = 'f89bad1da2fc26350ef3af346bf0ab68') OR (id = 'cace0dd5-542c-4d0c-b561-f7e19166aea4'::uuid AND md5(answer) = 'fac54df9f68e102b78d15142f34f4b40' AND md5(answer_en) = '45e397061a5a268ec19a24e93e6051ad')) <> 3
     OR (SELECT count(*) FROM public.blog_editorial_strategy WHERE version = 7 AND is_active AND md5(content_md) = 'ae19c47f08a1bb06380723bc5edd33ed') <> 1
     OR EXISTS (SELECT 1 FROM public.blog_editorial_strategy WHERE version = 8)
  THEN RAISE EXCEPTION 'trajets-lodge-borne-basse : la base a changé depuis le 12/11/2026, rien n''est appliqué (relire et régénérer le fichier)';
  END IF;
END
$garde$;

-- knowledge_base « Y a-t-il du coliving près de Genève ? » (195aa837…, coliving-geneva-area) — texte validé par Jérôme le 12/11/2026
UPDATE public.knowledge_base
SET answer = replace(answer, 'à seulement 30 minutes du centre de Genève', 'à seulement 25 minutes du centre de Genève'),
    answer_en = replace(answer_en, 'just 30 minutes from Geneva city center', 'just 25 minutes from Geneva city center'),
    updated_at = now()
WHERE id = '195aa837-da20-4dba-a3e7-cb427a241db7'::uuid AND md5(answer) = '589f07a1cd12b10fcf54f67d46ac1424' AND md5(answer_en) = 'e738242bf30e082616b5cfc8baa0737f';

-- knowledge_base « Où sont exactement situées les maisons ? » (8f3ac24a…, location-geneva) — texte validé par Jérôme le 12/11/2026
UPDATE public.knowledge_base
SET answer = replace(answer, 'Toutes sont à moins de 30 minutes du centre de Genève', 'Elles sont toutes entre 25 et 32 minutes du centre de Genève (Rive), porte-à-porte, selon la maison'),
    answer_en = replace(answer_en, 'All are within 30 minutes of Geneva city center', 'All are between 25 and 32 minutes from Geneva city center (Rive), door to door, depending on the house'),
    updated_at = now()
WHERE id = '8f3ac24a-5d52-46f2-9a8f-1f85524d0351'::uuid AND md5(answer) = '57a2798e7962b1972183cef45add643d' AND md5(answer_en) = 'f89bad1da2fc26350ef3af346bf0ab68';

-- knowledge_base « Qu'est-ce qui différencie La Villa Coliving des autres espaces de coliving ? » (cace0dd5…, what-makes-lavilla-different) — texte validé par Jérôme le 12/11/2026
UPDATE public.knowledge_base
SET answer = replace(answer, 'à seulement 30 minutes de Genève', 'à seulement 25 minutes du centre de Genève'),
    answer_en = replace(answer_en, 'just 30 minutes from Geneva', 'just 25 minutes from Geneva city center'),
    updated_at = now()
WHERE id = 'cace0dd5-542c-4d0c-b561-f7e19166aea4'::uuid AND md5(answer) = 'fac54df9f68e102b78d15142f34f4b40' AND md5(answer_en) = '45e397061a5a268ec19a24e93e6051ad';

-- blog_editorial_strategy : v8 = v7 avec « 25 min jusqu'au centre » ; v7 désactivée seulement si la v8 existe
INSERT INTO public.blog_editorial_strategy (version, is_active, content_md, updated_by)
SELECT 8, true,
  replace(replace(content_md, '(v7, 12/11/2026 — ', '(v8, 12/11/2026 — Le Lodge, borne basse du relevé : porte-à-porte jusqu''à Rive 25 min, jusqu''à Cornavin 32 min, formule « 25 min jusqu''au centre », décisions de Jérôme ; v7 12/11/2026 — '), 'Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d''Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu''au centre', 'Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d''Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu''au centre'),
  'Claude Code — Le Lodge, borne basse, décisions de Jérôme du 12/11/2026'
FROM public.blog_editorial_strategy
WHERE version = 7 AND is_active = true AND md5(content_md) = 'ae19c47f08a1bb06380723bc5edd33ed'
  AND NOT EXISTS (SELECT 1 FROM public.blog_editorial_strategy WHERE version = 8);
UPDATE public.blog_editorial_strategy SET is_active = false
WHERE version = 7 AND EXISTS (SELECT 1 FROM public.blog_editorial_strategy WHERE version = 8 AND is_active = true);
-- Garde de sortie : état attendu (md5 calculés en base par SELECT le 12/11/2026), sinon tout est annulé.
DO $sortie$
BEGIN
  IF (SELECT count(*) FROM public.knowledge_base WHERE (id = '195aa837-da20-4dba-a3e7-cb427a241db7'::uuid AND md5(answer) = '7e2ac8cebe2b66c9a99f3af96975b55b' AND md5(answer_en) = '3ad5935d05d63390f444910cfdd00bff') OR (id = '8f3ac24a-5d52-46f2-9a8f-1f85524d0351'::uuid AND md5(answer) = '1bc8bc15039cc8c4c8069c347e255670' AND md5(answer_en) = '123eadae90da373d5b16aefc513871dc') OR (id = 'cace0dd5-542c-4d0c-b561-f7e19166aea4'::uuid AND md5(answer) = '28b66fb0639b579290cbb904473a7f10' AND md5(answer_en) = '6661ba89bfd153f12b3550bf250fac5d')) <> 3
     OR (SELECT count(*) FROM public.blog_editorial_strategy WHERE version = 8 AND is_active AND md5(content_md) = '1b66dc2211f3d775dc8d8648a277b38f' AND length(content_md) = 7982) <> 1
     OR (SELECT count(*) FROM public.blog_editorial_strategy WHERE is_active) <> 1
  THEN RAISE EXCEPTION 'trajets-lodge-borne-basse : état obtenu différent de l''état attendu, tout est annulé';
  END IF;
END
$sortie$;
COMMIT;
-- Vérification (lecture seule) — résultats attendus indiqués sous chaque requête.
-- SELECT left(id::text, 8) AS id8, md5(answer) AS fr, md5(answer_en) AS en FROM public.knowledge_base WHERE id IN ('195aa837-da20-4dba-a3e7-cb427a241db7', '8f3ac24a-5d52-46f2-9a8f-1f85524d0351', 'cace0dd5-542c-4d0c-b561-f7e19166aea4') ORDER BY id;
--   195aa837 · 7e2ac8cebe2b66c9a99f3af96975b55b · 3ad5935d05d63390f444910cfdd00bff
--   8f3ac24a · 1bc8bc15039cc8c4c8069c347e255670 · 123eadae90da373d5b16aefc513871dc
--   cace0dd5 · 28b66fb0639b579290cbb904473a7f10 · 6661ba89bfd153f12b3550bf250fac5d
-- SELECT count(*) FROM public.blog_editorial_strategy WHERE version = 8 AND (content_md ~ '30 min jusqu''au centre' OR position('Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d''Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu''au centre' IN content_md) = 0);
--   0
-- SELECT version, is_active, md5(content_md) AS md5, length(content_md) AS longueur FROM public.blog_editorial_strategy WHERE version IN (7, 8) ORDER BY version DESC;
--   8 · true · 1b66dc2211f3d775dc8d8648a277b38f · 7982
--   7 · false · ae19c47f08a1bb06380723bc5edd33ed · 7814
-- Retour arrière (retirer /* et */ puis exécuter) : nouveaux textes → anciens, consigne v7 réactivée, v8 désactivée (jamais supprimée).
-- Restauration complète des 3 réponses (texte et date) : scripts/backups/trajets-lodge-borne-basse-bot-2026-11-12.retour-arriere.sql.
/*
BEGIN;
UPDATE public.knowledge_base SET answer = replace(answer, 'à seulement 25 minutes du centre de Genève', 'à seulement 30 minutes du centre de Genève'), answer_en = replace(answer_en, 'just 25 minutes from Geneva city center', 'just 30 minutes from Geneva city center'), updated_at = now() WHERE id = '195aa837-da20-4dba-a3e7-cb427a241db7'::uuid;
UPDATE public.knowledge_base SET answer = replace(answer, 'Elles sont toutes entre 25 et 32 minutes du centre de Genève (Rive), porte-à-porte, selon la maison', 'Toutes sont à moins de 30 minutes du centre de Genève'), answer_en = replace(answer_en, 'All are between 25 and 32 minutes from Geneva city center (Rive), door to door, depending on the house', 'All are within 30 minutes of Geneva city center'), updated_at = now() WHERE id = '8f3ac24a-5d52-46f2-9a8f-1f85524d0351'::uuid;
UPDATE public.knowledge_base SET answer = replace(answer, 'à seulement 25 minutes du centre de Genève', 'à seulement 30 minutes de Genève'), answer_en = replace(answer_en, 'just 25 minutes from Geneva city center', 'just 30 minutes from Geneva'), updated_at = now() WHERE id = 'cace0dd5-542c-4d0c-b561-f7e19166aea4'::uuid;
UPDATE public.blog_editorial_strategy SET is_active = (version = 7) WHERE version IN (7, 8);
COMMIT;
*/
