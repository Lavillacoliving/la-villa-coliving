-- ============================================================================
-- Lot 4 « budget réel » — durée de lecture de l'article du budget : 10 → 14 min (décision de Jérôme du 24/11/2026 :
-- même rythme de lecture qu'aujourd'hui ; l'article passe de 3 203 à 4 438 mots en français).
-- NE PAS EXÉCUTER SANS LE GO EXPLICITE DE JÉRÔME. Dans la même séance, juste APRÈS scripts/blog-budget-reel-2026-11-24.sql
-- (ou sa variante --seance). Gardé : la ligne n'est touchée que si la valeur est encore 10 ; sinon, exception, rien n'est écrit.
-- Le déclencheur blog_posts_updated_at met aussi updated_at à now().
-- Retour arrière : UPDATE public.blog_posts SET read_time_min = 10
--   WHERE slug = 'budget-colocation-geneve-guide-complet' AND read_time_min = 14;
-- ============================================================================
DO $budget_reel_lecture$
DECLARE
  n integer;
BEGIN
  UPDATE public.blog_posts SET read_time_min = 14
    WHERE slug = 'budget-colocation-geneve-guide-complet' AND read_time_min = 10;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'read_time_min de l''article du budget : % ligne(s) modifiée(s), 1 attendue — rien n''est écrit', n;
  END IF;
END
$budget_reel_lecture$;

-- Vérification (lecture seule) : read_time_min = 14.
SELECT slug, read_time_min FROM public.blog_posts WHERE slug = 'budget-colocation-geneve-guide-complet';
