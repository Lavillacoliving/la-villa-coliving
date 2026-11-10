-- Retour arrière de l'insertion d'A3 (30/10/2026) : la ligne n'existait pas avant (scripts/backups/a3-insert-2026-10-30.avant.json).
-- Ne supprime que le brouillon non publié ; sans effet une fois l'article publié (la publication a son propre retour arrière).
-- À exécuter seulement sur décision de Jérôme.
BEGIN;
DELETE FROM public.blog_posts
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND is_published = false;
COMMIT;
