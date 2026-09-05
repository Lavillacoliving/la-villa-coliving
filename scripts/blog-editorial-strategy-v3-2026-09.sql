-- ============================================================================
-- blog_editorial_strategy v3 — checklist factuelle alignée sur la fiche entité (Lot S1.8)
-- Date       : 2026-09-05 · plan valide par Jerome le 04/09/2026, decisions D1-D13 du 05/09
-- GO Jerome  : A APPLIQUER PAR JEROME (SQL Editor / MCP). Le generateur n8n (CRON dimanche 8h)
--              lit la ligne is_active = true a chaque execution : la v2 (04/08/2026) contient encore
--              « 1 380 CHF unique prix citable », « Menage 2x/semaine », « 150+ residents »,
--              « pas de garant francais exige » et demande de recopier un FACT BLOCK dans chaque article.
--
-- Methode : la v3 est construite par replace() successifs sur le texte de la v2 (aucune recopie a la
-- main, donc aucun risque de perdre une regle) ; la v2 est desactivee, jamais supprimee.
-- ============================================================================

BEGIN;

INSERT INTO public.blog_editorial_strategy (version, is_active, content_md)
SELECT 3, true,
  replace(replace(replace(replace(replace(replace(replace(content_md,
    '(v1, 27/07/2026)',
    '(v3, 05/09/2026 — faits alignés sur la fiche entité src/data/entityFacts.ts ; v2 04/08 citabilité IA ; v1 27/07)'),
    '- 1 380 CHF/mois tout inclus (unique prix citable)',
    '- Prix dans la prose : « dès 1 370 CHF/mois tout inclus » (jamais 1 430 dans un article — le détail des paliers vit sur /tarifs et dans la fiche entité injectée par le site)'),
    '- Caution 2 mois HORS charges, pas de garant français exigé, 0 frais de dossier',
    '- Caution 2 mois HORS charges · 0 frais de dossier ni d''agence · AUCUNE promesse sur le garant (ne jamais écrire « pas de garant exigé ») · bail : « Bail de 12 mois. Engagement minimum de 3 mois, puis 1 mois de préavis. » · chambres de 16 à 24 m²'),
    '- Ménage 2×/semaine · fibre "jusqu''à 8 Gb/s" · PAS de jacuzzi au Lodge',
    '- Ménage 3×/semaine dans les 3 maisons · fibre "jusqu''à 8 Gb/s" · PAS de jacuzzi au Lodge'),
    '- Léman Express Annemasse→Cornavin 20 min · Le Lodge à ~9 min de la gare · Tram 17 (Ambilly)',
    '- Genève centre à 20 min porte-à-porte, partout (hero compris) · La Villa : gare d''Annemasse à 10 min à pied · Le Loft : gare à 10 min à pied, tram 17 à 5 min · Le Lodge : gare à 9 min à pied'),
    '- 116 200 frontaliers (OCSTAT fin 2025) · 150+ résidents depuis 2021 · 99 % d''occupation · 4,9/5',
    '- 116 200 frontaliers (OCSTAT fin 2025) · 100+ résidents depuis octobre 2021 (jamais « 150+ ») · 99 % d''occupation · 4,9/5 = enquêtes résidents (NPS interne), toujours étiqueté ainsi'),
    '- Reprendre le FACT BLOCK canonique (1 380 CHF tout inclus, 29 chambres, 3 maisons, ~20 min de Genève) une fois par article, mot pour mot',
    '- Ne PAS recopier de bloc de faits : le bloc « La Villa Coliving — l''essentiel » est injecté par le site (composant EntityFacts) sur les 8 articles piliers ; une page de décision pose la ligne <!-- entity-facts --> à l''endroit voulu (après le tableau d''options). Les faits cités dans la prose sont ceux de src/data/entityFacts.ts (dès 1 370 CHF, 29 chambres, 3 maisons, 16-24 m², 20 min porte-à-porte)')
FROM public.blog_editorial_strategy
WHERE version = 2;

UPDATE public.blog_editorial_strategy SET is_active = false WHERE version = 2;

COMMIT;

-- Verification : chaque ancre de la v2 doit avoir disparu de la v3 (attendu : 6 lignes a « false »)
--   SELECT anchor, (SELECT content_md FROM blog_editorial_strategy WHERE version = 3) LIKE '%' || anchor || '%' AS encore_present
--   FROM unnest(ARRAY[
--     '1 380 CHF/mois tout inclus (unique prix citable)',
--     'pas de garant français exigé',
--     'Ménage 2×/semaine',
--     'Léman Express Annemasse→Cornavin 20 min',
--     '150+ résidents depuis 2021',
--     'Reprendre le FACT BLOCK canonique']) AS anchor;
--   SELECT version, is_active, length(content_md) FROM blog_editorial_strategy ORDER BY version;  -- v3 active, v2 inactive
--
-- RETOUR ARRIERE : UPDATE blog_editorial_strategy SET is_active = (version = 2);  (puis DELETE de la v3 si souhaite)
