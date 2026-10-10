-- ============================================================================
-- blog_editorial_strategy v6 — faits alignés sur le brief « Ingénierie des créneaux » v3.1 (lots L1 à L6, 09-10/10/2026)
-- Date       : 2026-10-10 · GO global de Jérôme du 10/10/2026 (« Go pour tout »)
-- Pourquoi   : le générateur n8n (CRON dimanche 8 h) lit la ligne is_active = true ; la v5 (30/09) citait encore
--              « 99 % d'occupation », « 4,9/5 = enquêtes résidents », « Genève centre à 20 min porte-à-porte », les anciens
--              temps à pied (10/10/9 min) et aucune règle sur le groupe Facebook ni les plateformes — un article généré après
--              le lot L3 aurait recopié des chaînes désormais interdites par la garde CI (check:facts, check:slots).
-- Méthode    : v6 = replace() successifs sur le texte de la v5 (aucune recopie à la main) ; v5 désactivée, jamais supprimée.
--              Textes insérés = source unique (STATS_DISPLAY.fr.distance, GENEVA_COMMUTE_FORMULA.fr, ENTITY_HOUSES[].commute.fr,
--              GUARANTOR_SENTENCE.fr, STATS_DISPLAY.fr.googleRating, GOOGLE_REVIEWS.url, FACEBOOK_GROUP, answerSlots.ts).
-- Vérification : SELECT version, is_active FROM blog_editorial_strategy ORDER BY version → v6 true, v5 false ;
--              la v6 ne contient plus « 4,9/5 », « enquêtes résidents », « 99 % », « Genève centre à 20 min », « 10 min à pied ·
--              Le Loft ». Retour arrière : UPDATE … SET is_active = (version = 5).
-- ============================================================================

BEGIN;

INSERT INTO public.blog_editorial_strategy (version, is_active, content_md, updated_by)
SELECT 6, true,
  replace(replace(replace(replace(replace(content_md,
    '(v5, 29/09/2026 — restitution de la caution, jamais « sans frais » au départ ;',
    '(v6, 10/10/2026 — trajets D1 (destination nommée, deux nombres), note Google 4,8/5 avec lien, plus aucun taux d''occupation, groupe Facebook nommé, garant au cas par cas, plateformes nommées jamais recommandées — brief « Ingénierie des créneaux » v3.1 ; v5 29/09 restitution de la caution, jamais « sans frais » au départ ;'),
    '- Genève centre à 20 min porte-à-porte, partout (hero compris) · La Villa : gare d''Annemasse à 10 min à pied · Le Loft : gare à 10 min à pied, tram 17 à 5 min · Le Lodge : gare à 9 min à pied',
    '- Trajets (règle D1, Jérôme 09/10/2026, source src/data/stats.ts TRANSIT) : jamais « Genève » seul avec un temps — destination nommée, Léman Express par défaut, deux nombres (train + porte-à-porte) ; formule générique : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d''Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu''au centre » ; le « 20 min » s''écrit toujours « 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte » · La Villa : gare d''Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte · Le Loft : tram 17 à 8 min à pied, gare d''Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte · Le Lodge : gare d''Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte · jamais « 15 min », jamais de promesse en voiture ni vers l''aéroport, aucun numéro de ligne de bus (arrêt nommé), jamais « mitoyenne » (le Foron, rivière-frontière, borde La Villa), jamais « terminus du Léman Express », jamais « CHUV » (l''hôpital de Genève est le HUG)'),
    '- 116 200 frontaliers (OCSTAT fin 2025) · 100+ résidents depuis octobre 2021 (jamais « 150+ ») · 99 % d''occupation · 4,9/5 = enquêtes résidents (NPS interne), toujours étiqueté ainsi',
    '- 116 200 frontaliers (OCSTAT fin 2025) · 100+ résidents depuis octobre 2021 (jamais « 150+ », jamais « 50+ par an » — chiffre soutenu par la vue Supabase v_social_proof) · ne JAMAIS écrire de taux d''occupation (le « 99 % » est retiré du site) · note : uniquement « 4,8/5 sur Google (36 avis) » suivie du lien « voir les avis » (https://maps.google.com/?cid=14514002506022967350), ou rien du tout (la fiche entité injectée la porte) — jamais « 4,9/5 », jamais « enquêtes résidents », jamais de « note moyenne » non sourcée · groupe Facebook : « Coliving & Colocation à Genève et alentours ! » (environ 1 600 membres, une centaine d''annonces par mois, animé par l''équipe de La Villa Coliving — jamais un nombre de publications) ; jamais « annonces vérifiées » ni « modéré contre les arnaques » · plateformes (La Carte des Colocs, Leboncoin, Roomlala) nommées comme canaux, jamais recommandées ni liées, Roomlala toujours avec « frais de service possibles pour le locataire selon l''annonce » · jamais « moins cher que Genève » (le positionnement = confort et espace)'),
    'AUCUNE promesse sur le garant (ne jamais écrire « pas de garant exigé »)',
    'garant : une seule phrase autorisée — « un garant n''est demandé qu''au cas par cas, quand le contrat ne couvre pas le loyer — on t''en parle avant de te répondre, jamais après la visite » (jamais « pas de garant exigé », jamais « tu auras besoin d''un garant »)'),
    '20 min porte-à-porte',
    '20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte'),
  'Claude Code — brief « Ingénierie des créneaux » v3.1, lots L1-L6, GO global Jérôme 10/10/2026'
FROM public.blog_editorial_strategy
WHERE version = 5 AND is_active = true;

UPDATE public.blog_editorial_strategy SET is_active = false WHERE version = 5;

COMMIT;

-- Vérification (lecture seule)
-- SELECT version, is_active, length(content_md) FROM public.blog_editorial_strategy ORDER BY version;
-- SELECT n, left(line, 120) FROM public.blog_editorial_strategy, regexp_split_to_table(content_md, E'\n') WITH ORDINALITY AS t(line, n)
--   WHERE version = 6 AND line ~* '4,9|enquêtes|99 ?%|Genève centre à 20 min|gare à 10 min à pied';  -- → 0 ligne
