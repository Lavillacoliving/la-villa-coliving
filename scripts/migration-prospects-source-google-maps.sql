-- ============================================================================
-- Migration OPTIONNELLE : valeur dediee `google_maps` dans prospects_source_check
-- Date       : 2026-09-02 (preparee, NON APPLIQUEE)
-- GO Jerome  : NON — a decider. Sans cette migration, tout fonctionne : le canal
--              « Google Maps » du formulaire est enregistre en `google`, le detail
--              exact restant en notes (« Canal declare : Google Maps »).
--
-- CONTEXTE
-- Le 02/09/2026, le select « Comment as-tu entendu parler de nous ? » du
-- formulaire /candidature gagne 3 choix : Facebook, WhatsApp, Google Maps.
-- Facebook et WhatsApp existent deja dans la contrainte (14 valeurs, verifiees
-- par pg_get_constraintdef le 02/09). Google Maps n'a pas de valeur dediee :
-- l'Edge send-candidature-email v16 le mappe volontairement sur `google` —
-- ecrire une valeur inconnue aurait declenche le filet et ecrase en `site_web`
-- (bug silencieux du 26/07/2026, cf. migration-prospects-source-google-article-blog.sql).
--
-- N'appliquer ce script QUE si l'on veut distinguer en base la fiche Google
-- Business Profile (Maps) de la recherche Google classique.
--
-- Checklist Schema_Supabase_LaVilla.md §12 :
--   1. Vues : aucune vue ne depend de prospects (RAS, idem 26/07).
--   2. RLS : prospects non exposee au portail/site public -> RAS.
--   2bis. ALIGNEMENT OBLIGATOIRE DES 3 POINTS, dans cet ordre :
--         a) cette contrainte (15 valeurs) ;
--         b) Edge send-candidature-email : PROSPECT_SOURCE_MAP["google-maps"]
--            passe de "google" a "google_maps", puis re-coller + Deploy ;
--         c) src/lib/entities.ts PROSPECT_SOURCE_OPTIONS : ajouter
--            ['google_maps', 'Google Maps'] (dropdown du dashboard Prospects).
--         Sans (a) avant (b) : rejet 23514 puis ecrasement en site_web.
--   3. entities.ts : cf. 2bis-c.
--   4. Trace : ce fichier.
--   6. Mettre a jour Schema_Supabase_LaVilla.md (tableau `source`, 15 valeurs).
-- ============================================================================

BEGIN;

-- 1) Contrainte : 14 -> 15 valeurs (ordre = pg_get_constraintdef du 02/09/2026)
ALTER TABLE public.prospects
  DROP CONSTRAINT IF EXISTS prospects_source_check;

ALTER TABLE public.prospects
  ADD CONSTRAINT prospects_source_check
  CHECK (source = ANY (ARRAY[
    'whatsapp'::text,
    'messenger'::text,
    'instagram'::text,
    'email'::text,
    'roomlala'::text,
    'leboncoin'::text,
    'facebook'::text,
    'appartager'::text,
    'site_web'::text,
    'bouche_a_oreille'::text,
    'autre'::text,
    'article_blog'::text,
    'google'::text,
    'parrainage'::text,
    'google_maps'::text        -- <- ajout (canal declare « Google Maps »)
  ]));

-- 2) Rebascule des prospects entres via le choix « Google Maps » du formulaire
--    depuis la v16 (enregistres en `google`, canal exact en notes).
UPDATE public.prospects
SET    source = 'google_maps',
       updated_at = now()
WHERE  source = 'google'
  AND  notes ~ 'Canal d[eé]clar[eé] : Google Maps';

COMMIT;

-- Verification :
--   SELECT source, count(*) FROM prospects GROUP BY source ORDER BY 2 DESC;
--
-- ---------------------------------------------------------------------------
-- RETOUR ARRIERE
-- BEGIN;
--   UPDATE public.prospects SET source = 'google' WHERE source = 'google_maps';
--   ALTER TABLE public.prospects DROP CONSTRAINT prospects_source_check;
--   ALTER TABLE public.prospects
--     ADD CONSTRAINT prospects_source_check
--     CHECK (source = ANY (ARRAY['whatsapp'::text,'messenger'::text,
--       'instagram'::text,'email'::text,'roomlala'::text,'leboncoin'::text,
--       'facebook'::text,'appartager'::text,'site_web'::text,
--       'bouche_a_oreille'::text,'autre'::text,'article_blog'::text,
--       'google'::text,'parrainage'::text]));
-- COMMIT;
-- ---------------------------------------------------------------------------
