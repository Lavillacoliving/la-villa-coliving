-- ============================================================================
-- Trajets des maisons — base de connaissances du bot et consigne du générateur d'articles (décisions de Jérôme du 12/11/2026)
-- Généré par la session du 12/11/2026 depuis la source unique de la branche fix/trajets-maisons-2026-11 (TRANSIT, houseLocation.ts,
-- entityFacts.ts) ; textes « avant » lus en base le 12/11/2026 (lecture seule).
-- Pourquoi   : knowledge_base répond aux prospects (bot Messenger / Instagram / WhatsApp) et sert de source au générateur d'articles du
--              dimanche (n8n), qui lit aussi la consigne active blog_editorial_strategy. Sans cette mise à jour, le bot et les futurs
--              articles reprendraient les anciens temps (gare 14 / 18 / 10 min, « 18 à 24 min », tram « Place de l'Étoile à 1 min »).
-- Contenu    : 3 réponses de knowledge_base (gardées par md5 : une réponse modifiée entre-temps n'est pas touchée) ; consigne v7 =
--              replace() successifs sur la v6 (gardée par md5), v6 désactivée, jamais supprimée. Les adresses présentes dans ces
--              réponses ne sont PAS touchées ici (question de sécurité à part, en attente de Jérôme).
-- Ordre      : indépendant des gardes du site ; à appliquer dans la même séance que scripts/trajets-maisons-2026-11-12.sql.
-- Encodage   : UTF-8 (tirets cadratins, points médians, guillemets français) — ne pas normaliser.
-- ============================================================================
BEGIN;

-- knowledge_base « Où sont vos colivings ? » (ea888493…)
UPDATE public.knowledge_base
SET answer = replace(replace(answer, 'accès très facile à Genève en tram ou Léman Express (10-15 min)', 'accès très facile à Genève en tram ou Léman Express (Genève-Eaux-Vives en 16 à 17 min porte-à-porte selon la maison)'), 'La Villa à Ville-la-Grand (gare CEVA à 8 min à pied), Le Loft à Ambilly (tram à 5 min à pied), Le Lodge à Annemasse (gare à 9 min à pied).', 'La Villa à Ville-la-Grand (gare d''Annemasse à 9 min à pied), Le Loft à Ambilly (tram 17 à 8 min à pied, gare à 9 min), Le Lodge à Annemasse (gare à 8 min à pied, tram 17 à 2 min).'),
    answer_en = replace(replace(answer_en, 'very easy access to Geneva by tram or Léman Express (10-15 min)', 'very easy access to Geneva by tram or Léman Express (Geneva Eaux-Vives 16 to 17 min door to door depending on the house)'), 'La Villa in Ville-la-Grand (CEVA station 8 min on foot), Le Loft in Ambilly (tram 5 min on foot), Le Lodge in Annemasse (station 9 min on foot).', 'La Villa in Ville-la-Grand (Annemasse station 9 min on foot), Le Loft in Ambilly (tram 17 8 min on foot, station 9 min), Le Lodge in Annemasse (station 8 min on foot, tram 17 2 min).'),
    updated_at = now()
WHERE id = 'ea888493-d67a-468b-81d3-3fd71d254b79'::uuid AND md5(answer) = '3eda742bd997d9377cfaddfc1bb268e1' AND md5(answer_en) = '1341f72de043b23ced105b9c296eb8e2';

-- knowledge_base « Où se trouve Le Loft ? » (68157220…)
UPDATE public.knowledge_base
SET answer = replace(answer, 'À 5 min à pied du tram (arrêt Croix d''Ambilly, direct Genève) et 14 min de la gare d''Annemasse.', 'À 8 min à pied du tram 17 (arrêt Croix-d''Ambilly, direct Genève) et 9 min de la gare d''Annemasse.'),
    updated_at = now()
WHERE id = '68157220-02d8-495b-930f-e740fd03c674'::uuid AND md5(answer) = '390a0f6062ab89f2f84cefd962c1bf43';

-- knowledge_base « Comment aller à Genève depuis vos maisons ? » (cd499a27…)
UPDATE public.knowledge_base
SET answer = replace(replace(answer, 'Le Loft : arrêt tram Croix d''Ambilly à 5 min à pied (direct Genève), gare à 14 min.', 'Le Loft : arrêt tram Croix-d''Ambilly à 8 min à pied (direct Genève), gare à 9 min.'), 'Le Lodge : arrêt tram Place de l''Étoile à 1 min (!), gare à 8 min.', 'Le Lodge : arrêt tram Barbusse (place de l''Étoile) à 2 min, gare à 8 min.'),
    updated_at = now()
WHERE id = 'cd499a27-4bfb-4961-90ac-9ddf1b262b5c'::uuid AND md5(answer) = 'b82b2bea7fd8f488d72683400fe4afa9';

-- blog_editorial_strategy : v7 = v6 avec les nouveaux trajets ; v6 désactivée seulement si la v7 existe
INSERT INTO public.blog_editorial_strategy (version, is_active, content_md, updated_by)
SELECT 7, true,
  replace(replace(replace(replace(replace(content_md, '(v6, 10/10/2026 — ', '(v7, 12/11/2026 — trajets des maisons : gare à pied 9 / 9 / 8 min (La Villa / Le Loft / Le Lodge), porte-à-porte Eaux-Vives 17 / 17 / 16 min, tram 17 du Lodge à l''arrêt Barbusse (place de l''Étoile), décisions de Jérôme ; v6 10/10/2026 — '), 'Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d''Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu''au centre', 'Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d''Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu''au centre'), 'gare d''Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte', 'gare d''Annemasse à 9 min à pied · Genève-Eaux-Vives en 17 min porte-à-porte'), 'tram 17 à 8 min à pied, gare d''Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte', 'tram 17 à 8 min à pied, gare d''Annemasse à 9 min · Genève-Eaux-Vives en 17 min porte-à-porte'), 'gare d''Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte', 'gare d''Annemasse à 8 min à pied · Genève-Eaux-Vives en 16 min porte-à-porte'),
  'Claude Code — trajets des maisons, décisions de Jérôme du 12/11/2026'
FROM public.blog_editorial_strategy
WHERE version = 6 AND is_active = true AND md5(content_md) = '8895dbb2b9c50bb1f64b615cf9424266'
  AND NOT EXISTS (SELECT 1 FROM public.blog_editorial_strategy WHERE version = 7);
UPDATE public.blog_editorial_strategy SET is_active = false
WHERE version = 6 AND EXISTS (SELECT 1 FROM public.blog_editorial_strategy WHERE version = 7 AND is_active = true);
COMMIT;
-- Vérification (lecture seule)
-- SELECT left(id::text, 8), md5(answer), md5(answer_en), updated_at FROM public.knowledge_base WHERE left(id::text, 8) IN ('ea888493', '68157220', 'cd499a27');
-- SELECT version, is_active, length(content_md) FROM public.blog_editorial_strategy ORDER BY version DESC LIMIT 2;  -- → v7 true, v6 false
-- SELECT count(*) FROM public.blog_editorial_strategy WHERE version = 7 AND content_md ~ '18 à 24 min|à 14 min à pied|à 18 min ·|à 10 min à pied ·';  -- → 0
-- Retour arrière (commenté) : UPDATE public.blog_editorial_strategy SET is_active = (version = 6) WHERE version IN (6, 7);
--   les réponses knowledge_base se restaurent par les replace() inverses (textes « avant » ci-dessus).
