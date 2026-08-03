-- ============================================================================
-- Migration : ajout de prospects.lost_reason (raison de perte structuree)
-- Date      : 2026-08-04
-- Demande   : plan fusionne A1 (GO Jerome 03/08) — les 10 prospects "lost"
--             actuels n'ont AUCUNE raison consignee : impossible de savoir
--             pourquoi on perd (prix ? distance ? timing ?). Le dashboard
--             rendra la raison obligatoire au passage en "lost" (cote UI).
--
-- Table     : public.prospects
-- Colonne   : lost_reason text NULL
-- Contrainte: prospects_lost_reason_check (8 valeurs ou NULL)
--
-- Checklist Schema_Supabase_LaVilla.md §12 :
--   1. Vues v_* : aucune vue ne lit prospects.lost_reason (colonne nouvelle),
--      v_form_submissions_clean ne touche pas prospects -> RAS.
--   2. RLS : aucune policy modifiee ; la colonne suit les policies existantes
--      de prospects (dashboard authenticated uniquement).
--   2bis. Alignement des 3 points : contrainte + dropdown dashboard
--      (LOST_REASON_LABELS dans DashboardProspectsPage.tsx) livres dans le
--      meme lot. L'Edge Function send-candidature-email ne pose jamais de
--      lost_reason -> rien a y changer.
--   3. entities.ts / AuditAction : pas de nouvelle action (status_change
--      existant, enfin branche — dette logAudit reglee dans le meme lot).
--   4. Trace : ce fichier.
--   5. Backup VPS : pas de nouvelle table, dump prospects inchange (une
--      colonne de plus dans le meme dump).
--
-- NULL autorise : l'historique (10 lost sans raison) reste valide, et les
-- statuts non-lost n'ont pas de raison. L'obligation "raison si lost" est
-- portee par le dashboard (UI), pas par un CHECK croise — plus simple et
-- sans migration de donnees.
--
-- Retour arriere : voir le bloc commente en fin de fichier.
-- ============================================================================

BEGIN;

ALTER TABLE public.prospects
  ADD COLUMN IF NOT EXISTS lost_reason text;

ALTER TABLE public.prospects
  DROP CONSTRAINT IF EXISTS prospects_lost_reason_check;

ALTER TABLE public.prospects
  ADD CONSTRAINT prospects_lost_reason_check
  CHECK (lost_reason IS NULL OR lost_reason = ANY (ARRAY[
    'trop_cher'::text,            -- budget insuffisant / prix juge trop eleve
    'trop_loin'::text,            -- localisation / trajet
    'timing_decale'::text,        -- besoin plus tard ou chambre pas libre a sa date
    'autre_logement'::text,       -- a trouve ailleurs
    'sans_reponse'::text,         -- ghosting apres 2+ relances
    'profil_incompatible'::text,  -- refus cote La Villa (fit communaute, dossier)
    'chambre_indisponible'::text, -- aucune chambre a proposer (pool plein)
    'autre'::text
  ]));

COMMIT;

-- ============================================================================
-- VERIFICATION (apres application)
-- ============================================================================
-- select column_name, is_nullable from information_schema.columns
--   where table_name = 'prospects' and column_name = 'lost_reason';
-- select conname from pg_constraint where conname = 'prospects_lost_reason_check';
-- update public.prospects set lost_reason = 'invalide_test' where false; -- doit passer (0 ligne)
--
-- ============================================================================
-- RETOUR ARRIERE (si necessaire)
-- ============================================================================
-- BEGIN;
-- ALTER TABLE public.prospects DROP CONSTRAINT IF EXISTS prospects_lost_reason_check;
-- ALTER TABLE public.prospects DROP COLUMN IF EXISTS lost_reason;
-- COMMIT;
