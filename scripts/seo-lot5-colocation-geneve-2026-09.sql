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
update blog_posts set content_fr = replace(content_fr, $l5$Il existe une solution rapide, abordable et sociale : la **colocation côté France**.$l5$, $l5$Il existe une solution rapide, abordable et sociale : la **[colocation à Genève côté France](/colocation-geneve)**.$l5$), updated_at = now() where slug = 'colocation-expats-geneve-guide' and position($l5$Il existe une solution rapide, abordable et sociale : la **colocation côté France**.$l5$ in content_fr) > 0;

-- « colocation Genève »
update blog_posts set content_fr = replace(content_fr, $l5$et comment emménager sans frais d'entrée près de Genève.$l5$, $l5$et comment emménager sans frais d'entrée près de Genève. Pour voir ce que ça donne concrètement, notre page [colocation Genève](/colocation-geneve) liste les chambres disponibles, prix en CHF et dates.$l5$), updated_at = now() where slug = 'coliving-frais-dossier-geneve-annemasse' and position($l5$et comment emménager sans frais d'entrée près de Genève.$l5$ in content_fr) > 0;

-- « coloc Genève tout inclus »
update blog_posts set content_fr = replace(content_fr, $l5$se tournent vers la **colocation côté France** comme alternative intelligente.$l5$, $l5$se tournent vers la **colocation côté France** comme alternative intelligente (voir notre [coloc Genève tout inclus](/colocation-geneve), chambres et prix en CHF).$l5$), updated_at = now() where slug = 'budget-colocation-geneve-guide-complet' and position($l5$se tournent vers la **colocation côté France** comme alternative intelligente.$l5$ in content_fr) > 0;

-- PARTIE B (option, NON recommandée telle quelle — voir en-tête)
-- update blog_posts set content_fr = replace(content_fr, $l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$, $l5$[colocation à Genève](/colocation-geneve)$l5$), updated_at = now() where is_published and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;

-- Contrôle APRÈS (attendu : lie_page = true sur les 4, ancres attendues)
select slug, (content_fr ~ '\]\(/colocation-geneve\)') as lie_page, substring(content_fr from '\[([^\]]+)\]\(/colocation-geneve\)') as ancre from blog_posts where slug in ('trouver-colocation-geneve-frontalier','colocation-expats-geneve-guide','coliving-frais-dossier-geneve-annemasse','budget-colocation-geneve-guide-complet') order by slug;
-- ---------------------------------------------------------------------------
-- PARTIE B bis (04/09, réponse à la question de Jérôme) : relais des 30 pieds de page vers la page money AVEC ancres
-- variées — 3 variantes réparties 10/10/10 par ordre alphabétique des slugs, aucune ancre > 34 % des entrants
-- (garde-fou « même ancre ≥ 60 % » de link:graph respecté). Idempotent : le fragment d'origine n'existe qu'avant.
-- ---------------------------------------------------------------------------
-- variante 1 : « colocation à Genève côté France » (10 articles)
update blog_posts set content_fr = replace(content_fr, $l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$, $l5$[colocation à Genève côté France](/colocation-geneve)$l5$), updated_at = now() where slug in ('allocations-familiales-frontalier-geneve-2026', 'avenant-fiscal-40-frontalier-geneve', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-vs-colocation-differences', 'cout-de-la-vie-suisse-france-frontalier-2026', 'dossier-location-frontalier-suisse-france', 'grand-geneve-2026-nouveautes-frontaliers', 'optimiser-espace-coliving-productivite-bien-etre', 'permis-g-frontalier-geneve', 'se-faire-reseau-geneve-arriver-seul') and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;
-- variante 2 : « chambre en colocation près de Genève » (10 articles)
update blog_posts set content_fr = replace(content_fr, $l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$, $l5$[chambre en colocation près de Genève](/colocation-geneve)$l5$), updated_at = now() where slug in ('arnaques-logement-frontalier-geneve-eviter', 'banque-telephone-internet-frontalier-bons-plans', 'coliving-annemasse-geneve-frontaliers-avantages', 'colocation-annemasse-ville-la-grand-ambilly', 'declaration-impots-frontalier-2026', 'ecole-internationale-geneve-frontalier-ou-habiter', 'guide-ressources-frontalier-geneve', 'organisations-internationales-geneve-ou-habiter', 'quitter-son-logement-guide-pratique', 'teletravail-frontalier-geneve-regles-2026') and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;
-- variante 3 : « colocation à Genève » (10 articles)
update blog_posts set content_fr = replace(content_fr, $l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$, $l5$[colocation à Genève](/colocation-geneve)$l5$), updated_at = now() where slug in ('assurance-sante-frontalier-lamal-cmu-budget', 'budget-colocation-geneve-guide-complet', 'coliving-frais-dossier-geneve-annemasse', 'colocation-expats-geneve-guide', 'demenager-geneve-frontalier-checklist', 'fiscalite-frontalier-geneve-impots-2026', 'living-in-france-working-in-geneva', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'salaire-suisse-net-frontalier-2026', 'vie-quotidienne-frontalier-courses-sport-sorties') and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;
-- Contrôle : attendu 0 pied de page vers l'article, 30 vers la page
select (select count(*) from blog_posts where is_published and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0) as vers_article, (select count(*) from blog_posts where is_published and content_fr ~ '\]\(/colocation-geneve\)') as vers_page;
