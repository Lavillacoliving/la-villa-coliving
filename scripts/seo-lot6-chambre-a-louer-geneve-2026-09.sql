-- ============================================================================
-- Lot 6 SEO funnel — /chambre-a-louer-geneve (spécification révisée du 04/09/2026, §6.3)
-- Maillage entrant depuis les 2 articles de l'intention : budget-colocation (au passage, « 15 minutes de Genève »
-- → 20 minutes, décision Jérôme 04/09) et cout-de-la-vie. Ancres : « chambre à louer près de Genève »,
-- « chambres meublées à louer ». À appliquer via MCP execute_sql APRÈS validation ; fragments vérifiés uniques.
-- ============================================================================

-- Contrôle AVANT (attendu : lie_page = false ; budget reste_15_min = true)
select slug, (content_fr ~ '\]\(/chambre-a-louer-geneve\)') as lie_page, substring(content_fr from '\[([^\]]+)\]\(/chambre-a-louer-geneve\)') as ancre, (content_fr ~ '15 minutes de Genève') as reste_15_min from blog_posts where slug in ('budget-colocation-geneve-guide-complet','cout-de-la-vie-suisse-france-frontalier-2026') order by slug;

-- « chambre à louer près de Genève »
update blog_posts set content_fr = replace(content_fr, $l6$les solutions pour vivre confortablement à 15 minutes de Genève.$l6$, $l6$les solutions pour vivre confortablement à 20 minutes de Genève, par exemple une [chambre à louer près de Genève](/chambre-a-louer-geneve) meublée et tout inclus.$l6$), updated_at = now() where slug = 'budget-colocation-geneve-guide-complet' and position($l6$les solutions pour vivre confortablement à 15 minutes de Genève.$l6$ in content_fr) > 0;

-- « chambres meublées à louer »
update blog_posts set content_fr = replace(content_fr, $l6$et combien il te reste vraiment au bout du compte.$l6$, $l6$et combien il te reste vraiment au bout du compte. Sur le logement, la version la plus simple de l'arbitrage, ce sont nos [chambres meublées à louer](/chambre-a-louer-geneve) côté France, tout inclus, prix en CHF.$l6$), updated_at = now() where slug = 'cout-de-la-vie-suisse-france-frontalier-2026' and position($l6$et combien il te reste vraiment au bout du compte.$l6$ in content_fr) > 0;

-- Contrôle APRÈS (attendu : lie_page = true, ancres attendues, reste_15_min = false)
select slug, (content_fr ~ '\]\(/chambre-a-louer-geneve\)') as lie_page, substring(content_fr from '\[([^\]]+)\]\(/chambre-a-louer-geneve\)') as ancre, (content_fr ~ '15 minutes de Genève') as reste_15_min from blog_posts where slug in ('budget-colocation-geneve-guide-complet','cout-de-la-vie-suisse-france-frontalier-2026') order by slug;