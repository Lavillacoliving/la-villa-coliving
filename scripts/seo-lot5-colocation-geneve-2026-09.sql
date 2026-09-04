-- ============================================================================
-- Lot 5 SEO funnel — /colocation-geneve revit (gel levé par Jérôme le 04/09/2026, spécification révisée §5.4)
-- PARTIE A : maillage entrant depuis les articles de l'intention « colocation Genève », une ancre par article :
--   expats (pos 8,9 — seul capital de position) « colocation à Genève côté France » · frais-dossier (pos 12,6) « colocation Genève »
--   · trouver (intro, l'article garde « comment chercher ») « colocation à Genève côté France » · budget « coloc Genève tout inclus ».
-- PARTIE B (option, à valider à part) : les 30 pieds de page « 👉 Tu cherches une [colocation à Genève](article) ? » → la page.
--   ⚠️ 30 ancres identiques vers une même page déclencheraient l'alerte « même ancre ≥ 60 % » de link:graph : à n'appliquer
--   qu'avec des ancres variées (2ᵉ script) ou pas du tout. Recommandation : ne pas appliquer B pour l'instant.
-- Ligne rouge (addendum) : si l'article expats perd sa position 8,9 après le relais → canonical de l'article vers la page.
-- À appliquer via MCP execute_sql APRÈS validation ; REPLACE exact de fragments vérifiés uniques ; idempotent.
-- ============================================================================

-- Contrôle AVANT (attendu : lie_page = false partout)
select slug, (content_fr ~ '\]\(/colocation-geneve\)') as lie_page, substring(content_fr from '\[([^\]]+)\]\(/colocation-geneve\)') as ancre from blog_posts where slug in ('trouver-colocation-geneve-frontalier','colocation-expats-geneve-guide','coliving-frais-dossier-geneve-annemasse','budget-colocation-geneve-guide-complet') order by slug;

-- PARTIE A
-- « colocation à Genève côté France »
update blog_posts set content_fr = replace(content_fr, $l5$Voici comment t'y prendre, étape par étape, sans perdre de temps ni te faire avoir.$l5$, $l5$Voici comment t'y prendre, étape par étape, sans perdre de temps ni te faire avoir. Et si tu veux directement voir les chambres libres et candidater, va sur notre page [colocation à Genève côté France](/colocation-geneve).$l5$), updated_at = now() where slug = 'trouver-colocation-geneve-frontalier' and position($l5$Voici comment t'y prendre, étape par étape, sans perdre de temps ni te faire avoir.$l5$ in content_fr) > 0;

-- « colocation à Genève côté France »
update blog_posts set content_fr = replace(content_fr, $l5$Il existe une solution rapide, abordable et sociale : la **colocation côté France**.$l5$, $l5$Il existe une solution rapide, abordable et sociale : la [colocation à Genève côté France](/colocation-geneve).$l5$), updated_at = now() where slug = 'colocation-expats-geneve-guide' and position($l5$Il existe une solution rapide, abordable et sociale : la **colocation côté France**.$l5$ in content_fr) > 0;

-- « colocation Genève »
update blog_posts set content_fr = replace(content_fr, $l5$et comment emménager sans frais d'entrée près de Genève.$l5$, $l5$et comment emménager sans frais d'entrée près de Genève. Pour voir ce que ça donne concrètement, notre page [colocation Genève](/colocation-geneve) liste les chambres disponibles, prix en CHF et dates.$l5$), updated_at = now() where slug = 'coliving-frais-dossier-geneve-annemasse' and position($l5$et comment emménager sans frais d'entrée près de Genève.$l5$ in content_fr) > 0;

-- « coloc Genève tout inclus »
update blog_posts set content_fr = replace(content_fr, $l5$se tournent vers la **colocation côté France** comme alternative intelligente.$l5$, $l5$se tournent vers la **colocation côté France** comme alternative intelligente (voir notre [coloc Genève tout inclus](/colocation-geneve), chambres et prix en CHF).$l5$), updated_at = now() where slug = 'budget-colocation-geneve-guide-complet' and position($l5$se tournent vers la **colocation côté France** comme alternative intelligente.$l5$ in content_fr) > 0;

-- PARTIE B (option, NON recommandée telle quelle — voir en-tête)
-- update blog_posts set content_fr = replace(content_fr, $l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$, $l5$[colocation à Genève](/colocation-geneve)$l5$), updated_at = now() where is_published and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;

-- Contrôle APRÈS (attendu : lie_page = true sur les 4, ancres attendues)
select slug, (content_fr ~ '\]\(/colocation-geneve\)') as lie_page, substring(content_fr from '\[([^\]]+)\]\(/colocation-geneve\)') as ancre from blog_posts where slug in ('trouver-colocation-geneve-frontalier','colocation-expats-geneve-guide','coliving-frais-dossier-geneve-annemasse','budget-colocation-geneve-guide-complet') order by slug;
-- ---------------------------------------------------------------------------
-- PARTIE B bis (04/09, validée par Jérôme avec la 4ᵉ ancre) : relais des 30 pieds de page vers la page money AVEC ancres
-- variées — 4 variantes réparties 8/8/7/7 (tour de rôle sur l'ordre alphabétique des slugs), chaque ancre < 27 % des 30 pieds
-- de page (garde-fou « même ancre ≥ 60 % » de link:graph respecté). Idempotent : le fragment d'origine n'existe qu'avant.
-- ---------------------------------------------------------------------------
-- variante 1 : « colocation à Genève côté France » (8 articles)
update blog_posts set content_fr = replace(content_fr, $l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$, $l5$[colocation à Genève côté France](/colocation-geneve)$l5$), updated_at = now() where slug in ('allocations-familiales-frontalier-geneve-2026', 'banque-telephone-internet-frontalier-bons-plans', 'coliving-frais-dossier-geneve-annemasse', 'cout-de-la-vie-suisse-france-frontalier-2026', 'ecole-internationale-geneve-frontalier-ou-habiter', 'living-in-france-working-in-geneva', 'permis-g-frontalier-geneve', 'teletravail-frontalier-geneve-regles-2026') and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;
-- variante 2 : « chambre en colocation près de Genève » (8 articles)
update blog_posts set content_fr = replace(content_fr, $l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$, $l5$[chambre en colocation près de Genève](/colocation-geneve)$l5$), updated_at = now() where slug in ('arnaques-logement-frontalier-geneve-eviter', 'budget-colocation-geneve-guide-complet', 'coliving-vs-colocation-differences', 'declaration-impots-frontalier-2026', 'fiscalite-frontalier-geneve-impots-2026', 'optimiser-espace-coliving-productivite-bien-etre', 'quitter-son-logement-guide-pratique', 'vie-quotidienne-frontalier-courses-sport-sorties') and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;
-- variante 3 : « colocation à Genève » (7 articles)
update blog_posts set content_fr = replace(content_fr, $l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$, $l5$[colocation à Genève](/colocation-geneve)$l5$), updated_at = now() where slug in ('assurance-sante-frontalier-lamal-cmu-budget', 'choc-culturel-franco-suisse-expatrie-geneve', 'colocation-annemasse-ville-la-grand-ambilly', 'demenager-geneve-frontalier-checklist', 'grand-geneve-2026-nouveautes-frontaliers', 'organisations-internationales-geneve-ou-habiter', 'salaire-suisse-net-frontalier-2026') and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;
-- variante 4 : « chambres en colocation côté France » (7 articles)
update blog_posts set content_fr = replace(content_fr, $l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$, $l5$[chambres en colocation côté France](/colocation-geneve)$l5$), updated_at = now() where slug in ('avenant-fiscal-40-frontalier-geneve', 'coliving-annemasse-geneve-frontaliers-avantages', 'colocation-expats-geneve-guide', 'dossier-location-frontalier-suisse-france', 'guide-ressources-frontalier-geneve', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'se-faire-reseau-geneve-arriver-seul') and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;
-- Contrôle : attendu 0 pied de page vers l'article, 30 vers la page
select (select count(*) from blog_posts where is_published and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0) as vers_article, (select count(*) from blog_posts where is_published and content_fr ~ '\]\(/colocation-geneve\)') as vers_page;
-- ---------------------------------------------------------------------------
-- APPLIQUÉ le 04/09/2026 via MCP execute_sql, après GO Jérôme (4 corrections) : Partie A (4 UPDATEs, article expats
-- sans gras autour du lien) + Partie B bis en 4 ancres 8/8/7/7. Contrôle après : 30/30 pieds de page relayés vers la page
-- (l'article guide-ressources avait le pied de page en double → 2 ancres « chambres en colocation côté France »),
-- 34 liens vers /colocation-geneve au total, ancre la plus fréquente « colocation à Genève côté France » 9/34 = 26 %,
-- 12 articles gardent en corps un autre lien vers l'article « Trouver » (voulu : il garde l'intention « comment chercher »).
-- ---------------------------------------------------------------------------
-- PARTIE B ter — APPLIQUÉ le 04/09/2026 (soir) sur décision Jérôme : /colocation-geneve à 67 % d'ancres exactes/partielles
-- (page neuve + 30 pieds de page de la même famille) → 16 des 30 pieds de page repassés hors exact :
--   variante 1 (8) « colocation à Genève côté France » → marque « La Villa Coliving, côté France »
--   variante 2 (8) « chambre en colocation près de Genève » → générique « voir nos chambres côté France »
--   (variantes 3 « colocation à Genève » ×7 et 4 « chambres en colocation côté France » ×8 inchangées).
-- Contrôle après : 8 / 8 / 8 / 7 + 4 ancres de corps ; attendu ≈ 42 % exact+partiel au prochain prérendu.
-- ---------------------------------------------------------------------------
-- ---------------------------------------------------------------------------
-- PARTIE B ter EN — APPLIQUÉ le 04/09/2026 (soir) sur décision Jérôme : même profil côté EN — 29 pieds de page « shared housing near Geneva »
-- vers /en/colocation-geneve (71 % exact+partiel). Même remède que le FR : 16 des 29 en marque / générique, par ordre
-- alphabétique des slugs (8 marque, 8 générique), les autres inchangés (l'ancre exacte de la page EN reste majoritaire
-- sur les 13 restants, parité avec le FR). Contrôle après : « La Villa Coliving, French side » ×8 (allocations → coliving-annemasse-
-- avantages), « see our rooms on the French side » ×8 (colocation-annemasse → grand-geneve), « shared housing near Geneva » ×14
-- (12 articles, 2 doublons guide-ressources et salaire). Attendu ≈ 35 % exact+partiel au prochain prérendu.
update blog_posts set content_en = replace(content_en, $l8$[shared housing near Geneva](/colocation-geneve)$l8$, $l8$[La Villa Coliving, French side](/colocation-geneve)$l8$), updated_at = now()
where slug in (select slug from blog_posts where is_published and position($l8$[shared housing near Geneva](/colocation-geneve)$l8$ in content_en) > 0 order by slug limit 8);
update blog_posts set content_en = replace(content_en, $l8$[shared housing near Geneva](/colocation-geneve)$l8$, $l8$[see our rooms on the French side](/colocation-geneve)$l8$), updated_at = now()
where slug in (select slug from blog_posts where is_published and position($l8$[shared housing near Geneva](/colocation-geneve)$l8$ in content_en) > 0 order by slug limit 8);
-- ---------------------------------------------------------------------------
-- Marge (04/09 17:55, appliqué) : /en/colocation-geneve mesuré à 49 % après le prérendu → les pieds de page EN des 2 articles
-- qui le portaient en double (guide-ressources, salaire-suisse-net) passent en générique « see our rooms on the French side »
-- (3 ancres de plus) : 11 exactes / 11 génériques / 8 marque sur les pieds de page. Attendu ≈ 45 % au prérendu suivant.
