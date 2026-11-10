-- Retour arrière de l insertion d A1 (02/11/2026) : la ligne n existait pas avant (scripts/backups/a1-insert-2026-11-02.avant.json).
-- Ne supprime que le brouillon non publié ; sans effet une fois l article publié (la publication aura son propre retour arrière).
-- À exécuter seulement sur décision de Jérôme.
BEGIN;
DELETE FROM public.blog_posts
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND is_published = false;
COMMIT;
