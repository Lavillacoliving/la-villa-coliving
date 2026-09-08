-- ============================================================================
-- Correctif éditorial : retirer « Gaillard » de l'extrait de l'article quartiers d'Annemasse
-- Demande Jérôme du 08/09/2026 (relecture C3 : « Gaillard est un repoussoir pour les prospects »).
-- L'extrait s'affiche dans les cartes « à lire aussi » (dont la page C3) et sur /blog.
-- Appliqué via MCP le 08/09/2026 ~12:55 UTC · le corps de l'article (guide par quartier) n'est pas modifié.
-- Le commit de ce fichier déclenche le prérendu (chemin scripts/), qui réécrit les cartes.
-- ============================================================================
BEGIN;

UPDATE public.blog_posts SET
  excerpt_fr = replace(excerpt_fr, 'Romagny, Ambilly, Ville-la-Grand, Gaillard...', 'Romagny, Ambilly, Ville-la-Grand...'),
  excerpt_en = replace(excerpt_en, 'Romagny, Ambilly, Ville-la-Grand, Gaillard...', 'Romagny, Ambilly, Ville-la-Grand...'),
  updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND (excerpt_fr LIKE '%Ville-la-Grand, Gaillard...%' OR excerpt_en LIKE '%Ville-la-Grand, Gaillard...%');

COMMIT;

-- Vérification : SELECT excerpt_fr, excerpt_en FROM blog_posts WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil';
