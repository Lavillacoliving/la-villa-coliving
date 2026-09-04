-- ============================================================================
-- Lot 5 SEO funnel — /colocation-geneve revit (gel levé par Jérôme le 04/09/2026)
-- PARTIE A : l'article « Trouver une colocation à Genève » garde l'intention « comment chercher » et lie la
--   page money en intro, ancre exacte « colocation à Genève côté France » (demande Jérôme).
-- PARTIE B (à valider à part) : le pied de page commun « 👉 Tu cherches une [colocation à Genève](…) ? » de
--   30 articles pointe encore l'article ; l'intention « je cherche » est celle de la page money → repointer.
-- À appliquer via MCP execute_sql APRÈS validation de LOT5_COLOCATION_GENEVE_2026-09-04.md ; idempotent.
-- ============================================================================

-- Contrôle AVANT (attendu : intro_lie_page = false ; 30 pieds de page vers l'article)
select (content_fr ~ '\]\(/colocation-geneve\)') as intro_lie_page from blog_posts where slug = 'trouver-colocation-geneve-frontalier';
select count(*) as pieds_de_page_article from blog_posts where is_published and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;

-- PARTIE A
update blog_posts set content_fr = replace(content_fr, $l5$Voici comment t'y prendre, étape par étape, sans perdre de temps ni te faire avoir.$l5$, $l5$Voici comment t'y prendre, étape par étape, sans perdre de temps ni te faire avoir. Et si tu veux directement voir les chambres libres et candidater, va sur notre page [colocation à Genève côté France](/colocation-geneve).$l5$), updated_at = now() where slug = 'trouver-colocation-geneve-frontalier' and position($l5$Voici comment t'y prendre, étape par étape, sans perdre de temps ni te faire avoir.$l5$ in content_fr) > 0;

-- PARTIE B (30 articles ; l'article « trouver » lui-même n'a pas ce pied de page)
update blog_posts set content_fr = replace(content_fr, $l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$, $l5$[colocation à Genève](/colocation-geneve)$l5$), updated_at = now() where is_published and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;

-- Contrôle APRÈS (attendu : true ; 0 ; 30)
select (content_fr ~ '\]\(/colocation-geneve\)') as intro_lie_page from blog_posts where slug = 'trouver-colocation-geneve-frontalier';
select count(*) as pieds_de_page_article from blog_posts where is_published and position($l5$[colocation à Genève](/blog/trouver-colocation-geneve-frontalier)$l5$ in content_fr) > 0;
select count(*) as pieds_de_page_page from blog_posts where is_published and position($l5$[colocation à Genève](/colocation-geneve)$l5$ in content_fr) > 0;