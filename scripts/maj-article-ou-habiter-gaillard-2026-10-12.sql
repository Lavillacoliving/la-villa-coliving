-- scripts/maj-article-ou-habiter-gaillard-2026-10-12.sql — décision Jérôme du 12/10/2026 (point 5 de la note de suivi) :
-- Gaillard retiré de l'extrait FR/EN (EN : liste ouverte « … Divonne and more », le corps numérote toujours Gaillard en 3e), de la meta EN et des tags de l'article « Top 7 des villes » (ou-habiter-frontalier-suisse-villes-france-pas-cher).
-- Le corps de l'article (section « 3. Gaillard — La frontière à pied », tableau) n'est PAS touché (hors décision). Gardes par position(), rejouable.
BEGIN;
UPDATE public.blog_posts SET
  excerpt_fr = replace(excerpt_fr, 'Annemasse, Gaillard, Saint-Julien...', 'Annemasse, Ville-la-Grand, Saint-Julien...'),
  excerpt_en = replace(excerpt_en, 'Annemasse, Ville-la-Grand, Gaillard, Saint-Julien, Ferney-Voltaire, Thonon, Divonne', 'Annemasse, Ville-la-Grand, Saint-Julien, Ferney-Voltaire, Thonon, Divonne and more'),
  meta_description_en = replace(meta_description_en, 'Annemasse, Gaillard, Saint-Julien and more', 'Annemasse, Ville-la-Grand, Saint-Julien and more'),
  tags = array_remove(tags, 'gaillard'),
  updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position('Annemasse, Gaillard, Saint-Julien...' IN excerpt_fr) > 0
  AND position('Ville-la-Grand, Gaillard, Saint-Julien' IN excerpt_en) > 0
  AND position('Annemasse, Gaillard, Saint-Julien and more' IN meta_description_en) > 0;
COMMIT;
-- Vérification : les 4 colonnes sans « Gaillard »
SELECT slug, excerpt_fr LIKE '%Gaillard%' AS fr, excerpt_en LIKE '%Gaillard%' AS en, meta_description_en LIKE '%Gaillard%' AS meta_en, 'gaillard' = ANY(tags) AS tag, length(meta_description_en) AS meta_en_len
FROM public.blog_posts WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
-- Retour arrière
-- Retour arrière (gardé, rejouable) :
-- UPDATE public.blog_posts SET excerpt_fr = replace(excerpt_fr, 'Annemasse, Ville-la-Grand, Saint-Julien...', 'Annemasse, Gaillard, Saint-Julien...'), excerpt_en = replace(excerpt_en, 'Ville-la-Grand, Saint-Julien, Ferney-Voltaire, Thonon, Divonne and more', 'Ville-la-Grand, Gaillard, Saint-Julien, Ferney-Voltaire, Thonon, Divonne'), meta_description_en = replace(meta_description_en, 'Annemasse, Ville-la-Grand, Saint-Julien and more', 'Annemasse, Gaillard, Saint-Julien and more'), tags = array_append(tags, 'gaillard'), updated_at = now()
-- WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' AND NOT ('gaillard' = ANY(tags)) AND position('Annemasse, Ville-la-Grand, Saint-Julien...' IN excerpt_fr) > 0 AND position('Divonne and more' IN excerpt_en) > 0;
