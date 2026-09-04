-- ============================================================================
-- Lot 7 SEO funnel — 3 articles GSC + ou-habiter : title / meta (7.3), sources dans le corps (condition Q4 de
-- Jérôme), ancres blog vers les pages Annemasse (7.4, objectif exact+partiel < 50 %). GO Jérôme 04/09/2026
-- (réponses Q1-Q5). À appliquer via MCP execute_sql dans la fenêtre du merge ; visible au prérendu suivant.
-- title_fr/title_en = <title> ET H1 (BlogPostPage) ; meta_description_* = <meta name="description">.
-- Longueurs vérifiées : titles ≤ 65 c., metas ≤ 155 c. Rollback : bloc en bas (anciennes valeurs exactes).
-- ============================================================================

-- Contrôle AVANT
select slug, title_fr, length(meta_description_fr) as m_fr, title_en, length(meta_description_en) as m_en
from blog_posts where slug in ('allocations-familiales-frontalier-geneve-2026','cout-de-la-vie-suisse-france-frontalier-2026','budget-colocation-geneve-guide-complet','ou-habiter-frontalier-suisse-villes-france-pas-cher') order by slug;

-- 7.3 — allocations (3 229 impr / 16 clics / pos 8,3 ; requêtes « allocation suisse frontalier montant », « allocations familiales suisse 2026 »)
update blog_posts set
  title_fr = 'Allocations familiales frontalier 2026 : montants et priorité',
  meta_description_fr = 'Allocations familiales frontalier Genève 2026 : 311 CHF par enfant en Suisse, priorité France/Suisse, complément différentiel, congé maternité, démarches.',
  title_en = 'Family allowances for frontaliers 2026: amounts and priority rule',
  meta_description_en = 'Geneva frontalier family allowances 2026: Swiss amounts (CHF 311/child), France/Switzerland priority rule, differential top-up, maternity leave, steps.',
  updated_at = now()
where slug = 'allocations-familiales-frontalier-geneve-2026';

-- 7.3 — cout-de-la-vie (2 229 / 13 / pos 7,4 ; « prix de la vie en suisse vs france » 72 impr 0 clic)
update blog_posts set
  title_fr = 'Coût de la vie Suisse vs France 2026 : prix réels et vrai bilan',
  meta_description_fr = 'Prix de la vie en Suisse vs France en 2026 : loyer ×2-3, courses, restaurants, LAMal vs CMU, transport. Le vrai bilan chiffré d''un frontalier de Genève.',
  updated_at = now()
where slug = 'cout-de-la-vie-suisse-france-frontalier-2026';

-- 7.3 — budget (1 117 / 10 / pos 6,8)
update blog_posts set
  title_fr = 'Budget colocation Genève 2026 : loyers réels et coût total',
  meta_description_fr = 'Combien coûte vraiment une colocation à Genève en 2026 ? Loyers réels par ville, studio vs colocation vs coliving, charges cachées et comment économiser.',
  updated_at = now()
where slug = 'budget-colocation-geneve-guide-complet';

-- 7.3 — ou-habiter : meta FR 163 → 148 c.
update blog_posts set
  meta_description_fr = 'Où habiter quand on travaille à Genève ? Les 7 villes frontalières les moins chères côté France : loyers réels 600-1 100 €, trajet, impôts (2026).',
  updated_at = now()
where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';

-- Q4 — sources dans le corps (fragments uniques, idempotent)
update blog_posts set content_fr = replace(content_fr, $l7$> Ces montants sont ceux du **canton de Genève**$l7$, $l7$> Source : barème genevois des allocations familiales (loi cantonale LAF), montants 2026 publiés par l'État de Genève (Office cantonal des assurances sociales) ; minima fédéraux : OFAS.
>
> Ces montants sont ceux du **canton de Genève**$l7$), updated_at = now()
where slug = 'allocations-familiales-frontalier-geneve-2026' and position($l7$> Ces montants sont ceux du **canton de Genève**$l7$ in content_fr) > 0 and position($l7$> Source : barème genevois$l7$ in content_fr) = 0;

update blog_posts set content_fr = replace(content_fr, $l7$> Ordres de grandeur 2026, charges en sus.$l7$, $l7$> Ordres de grandeur 2026, charges en sus. Sources : OCSTAT (loyers du parc en place, 2025) et annonces relevées par notre [Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve) (juin 2026), côté Genève comme côté France.$l7$), updated_at = now()
where slug = 'cout-de-la-vie-suisse-france-frontalier-2026' and position($l7$> Ordres de grandeur 2026, charges en sus.$l7$ in content_fr) > 0 and position($l7$Sources : OCSTAT$l7$ in content_fr) = 0;

update blog_posts set content_fr = replace(content_fr, $l7$- **Loyer 30 à 50% moins cher** qu'à Genève, pour une qualité de vie souvent équivalente voire supérieure$l7$, $l7$- **Loyer 30 à 50 % moins élevé** qu'à Genève d'après les annonces relevées par notre [Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve) (juin 2026), pour une qualité de vie souvent équivalente voire supérieure$l7$), updated_at = now()
where slug = 'budget-colocation-geneve-guide-complet' and position($l7$- **Loyer 30 à 50% moins cher** qu'à Genève, pour une qualité de vie souvent équivalente voire supérieure$l7$ in content_fr) > 0;

-- 7.4 — ancres blog vers /chambre-a-louer-annemasse (3 → marque / URL nue / générique)
update blog_posts set content_fr = replace(content_fr, $l7$[chambre à louer à Annemasse](/chambre-a-louer-annemasse)$l7$, $l7$[le Lodge](/chambre-a-louer-annemasse)$l7$), updated_at = now() where slug = 'lodge-annemasse-coliving-premium-portes-geneve' and position($l7$[chambre à louer à Annemasse](/chambre-a-louer-annemasse)$l7$ in content_fr) > 0;
update blog_posts set content_fr = replace(content_fr, $l7$[chambres à louer à Annemasse](/chambre-a-louer-annemasse)$l7$, $l7$[lavillacoliving.com/chambre-a-louer-annemasse](/chambre-a-louer-annemasse)$l7$), updated_at = now() where slug = 'coliving-annemasse-geneve-frontaliers-avantages' and position($l7$[chambres à louer à Annemasse](/chambre-a-louer-annemasse)$l7$ in content_fr) > 0;
update blog_posts set content_fr = replace(content_fr, $l7$[chambres à louer à Annemasse](/chambre-a-louer-annemasse)$l7$, $l7$[voir les disponibilités du Lodge](/chambre-a-louer-annemasse)$l7$), updated_at = now() where slug = 'transport-annemasse-geneve-leman-express' and position($l7$[chambres à louer à Annemasse](/chambre-a-louer-annemasse)$l7$ in content_fr) > 0;

-- 7.4 — ancres blog vers /annemasse-colocation (5 ; regexp_replace sans 'g' = première occurrence seulement)
update blog_posts set content_fr = regexp_replace(content_fr, $l7$\[colocation à Annemasse\]\(/annemasse-colocation\)$l7$, $l7$[La Villa Coliving à Annemasse](/annemasse-colocation)$l7$), updated_at = now() where slug = 'lodge-annemasse-coliving-premium-portes-geneve' and position($l7$[colocation à Annemasse](/annemasse-colocation)$l7$ in content_fr) > 0;
update blog_posts set content_fr = regexp_replace(content_fr, $l7$\[colocation à Annemasse\]\(/annemasse-colocation\)$l7$, $l7$[lavillacoliving.com/annemasse-colocation](/annemasse-colocation)$l7$), updated_at = now() where slug = 'quartiers-annemasse-ou-vivre-selon-profil' and position($l7$[colocation à Annemasse](/annemasse-colocation)$l7$ in content_fr) > 0;
update blog_posts set content_fr = replace(content_fr, $l7$[colocation à Annemasse](/annemasse-colocation)$l7$, $l7$[notre guide d'Annemasse](/annemasse-colocation)$l7$), updated_at = now() where slug = 'transport-annemasse-geneve-leman-express' and position($l7$[colocation à Annemasse](/annemasse-colocation)$l7$ in content_fr) > 0;
update blog_posts set content_fr = replace(content_fr, $l7$[colocation à Annemasse](/annemasse-colocation)$l7$, $l7$[Annemasse, côté La Villa Coliving](/annemasse-colocation)$l7$), updated_at = now() where slug = 'cout-transport-frontalier-geneve-2026' and position($l7$[colocation à Annemasse](/annemasse-colocation)$l7$ in content_fr) > 0;
update blog_posts set content_fr = replace(content_fr, $l7$[colocation à Annemasse](/annemasse-colocation)$l7$, $l7$[le guide de la vie à Annemasse](/annemasse-colocation)$l7$), updated_at = now() where slug = 'espaces-verts-coliving-lodge-annemasse' and position($l7$[colocation à Annemasse](/annemasse-colocation)$l7$ in content_fr) > 0;

-- 7.4 (marge) — 3 ancres blog de plus : /annemasse-colocation ×2, /chambre-a-louer-annemasse ×1 (première occurrence)
update blog_posts set content_fr = regexp_replace(content_fr, $l7$\[colocation à Annemasse\]\(/annemasse-colocation\)$l7$, $l7$[le guide d'Annemasse](/annemasse-colocation)$l7$), updated_at = now() where slug = 'temps-trajet-annemasse-geneve-par-quartier' and position($l7$[colocation à Annemasse](/annemasse-colocation)$l7$ in content_fr) > 0;
update blog_posts set content_fr = regexp_replace(content_fr, $l7$\[colocation à Annemasse\]\(/annemasse-colocation\)$l7$, $l7$[Annemasse avec La Villa Coliving](/annemasse-colocation)$l7$), updated_at = now() where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' and position($l7$[colocation à Annemasse](/annemasse-colocation)$l7$ in content_fr) > 0;
update blog_posts set content_fr = regexp_replace(content_fr, $l7$\[chambres à louer à Annemasse\]\(/chambre-a-louer-annemasse\)$l7$, $l7$[le Lodge, à Annemasse](/chambre-a-louer-annemasse)$l7$), updated_at = now() where slug = 'cout-transport-frontalier-geneve-2026' and position($l7$[chambres à louer à Annemasse](/chambre-a-louer-annemasse)$l7$ in content_fr) > 0;

-- Contrôle APRÈS (attendu : titles/metas neufs, 3 sources présentes, ancres remplacées)
select slug, title_fr, length(meta_description_fr) as m_fr, (content_fr ~ 'Source : barème genevois|Sources : OCSTAT|Observatoire du logement frontalier') as source_corps
from blog_posts where slug in ('allocations-familiales-frontalier-geneve-2026','cout-de-la-vie-suisse-france-frontalier-2026','budget-colocation-geneve-guide-complet','ou-habiter-frontalier-suisse-villes-france-pas-cher') order by slug;
select slug, m[1] as ancre from blog_posts, lateral regexp_matches(content_fr, '(\[[^\]]{2,80}\]\(/(?:chambre-a-louer-annemasse|annemasse-colocation)\))', 'g') m
where slug in ('lodge-annemasse-coliving-premium-portes-geneve','coliving-annemasse-geneve-frontaliers-avantages','transport-annemasse-geneve-leman-express','quartiers-annemasse-ou-vivre-selon-profil','cout-transport-frontalier-geneve-2026','espaces-verts-coliving-lodge-annemasse','temps-trajet-annemasse-geneve-par-quartier','ou-habiter-frontalier-suisse-villes-france-pas-cher') order by 1, 2;

-- ---------------------------------------------------------------------------
-- ROLLBACK 7.3 (anciennes valeurs exactes, relevées le 04/09/2026)
-- update blog_posts set title_fr = 'Allocations frontalier 2026 : ce que tu peux toucher', meta_description_fr = 'Allocations familiales frontalier Genève 2026 : montants suisses (311 CHF/enfant), règle de priorité France/Suisse, congé maternité, démarches.', title_en = 'Family allowances for frontaliers 2026', meta_description_en = 'Geneva frontalier family allowances 2026: Swiss amounts (CHF 311/child), France/Switzerland priority rule, differential top-up, maternity leave, procedures.' where slug = 'allocations-familiales-frontalier-geneve-2026';
-- update blog_posts set title_fr = 'Coût de la vie Suisse vs France 2026 : prix, loyers, salaires', meta_description_fr = 'Coût de la vie Suisse vs France en 2026 : loyer ×2-3, courses, restaurants, LAMal vs CMU, transport. Le vrai bilan chiffré du frontalier de Genève.' where slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
-- update blog_posts set title_fr = 'Budget colocation Genève 2026 : combien ça coûte vraiment ?', meta_description_fr = 'Combien coûte vraiment un logement frontalier à Genève en 2026 ? Prix réels par ville, studio vs colocation vs coliving, charges cachées et économies.' where slug = 'budget-colocation-geneve-guide-complet';
-- update blog_posts set meta_description_fr = 'Où habiter quand on travaille à Genève ? Les 7 villes frontalières suisses les moins chères côté France : loyers réels 600-1 100 €, temps de trajet, impôts (2026).' where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';

-- ---------------------------------------------------------------------------
-- APPLIQUÉ le 04/09/2026 via MCP execute_sql après « GO » Jérôme : 7.3 (4 title/meta, longueurs 61/63/58 c. et 154/152/153/146 c.),
-- Q4 (3 sources présentes dans le corps : LAF/OFAS, OCSTAT + Observatoire, Observatoire), 7.4 (11 ancres blog, première
-- occurrence seulement pour lodge/quartiers/temps-trajet/ou-habiter/cout-transport). Contrôle après : conforme.
-- ---------------------------------------------------------------------------

-- Correctif 04/09 16:35 (appliqué) : pour le classifieur de link:graph, « La Villa Coliving » + « Annemasse » = partiel
-- (mot-clé « coliving annemasse » de /annemasse-colocation) → 3 ancres blog repassées en marque via « Le Lodge » :
-- lodge « Le Lodge, à Annemasse », ou-habiter « Annemasse avec Le Lodge », cout-transport « Annemasse, côté Le Lodge »
-- (même correction côté code : home et pages Loft/Lodge). Objectif < 50 % atteint au prochain prérendu (≈ 28 %).
