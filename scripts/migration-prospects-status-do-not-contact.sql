-- ============================================================================
-- Migration : ajout du statut prospect « Ne pas recontacter »
-- Date      : 2026-07-26
-- Demande   : Jerome — nouveau choix dans le menu deroulant Statut de la fiche
--             prospect, pour sortir definitivement un contact du pipeline.
--
-- Table     : public.prospects
-- Contrainte: prospects_status_check  (9 valeurs -> 10)
-- Valeur    : do_not_contact   (libelle dashboard : « Ne pas recontacter »)
--
-- Checklist Schema_Supabase_LaVilla.md §12 :
--   1. Vues v_* : aucune vue ne filtre sur prospects.status (verifie) -> RAS.
--   2. RLS : prospects n'est pas exposee au portail/site public -> RAS.
--   2bis. Alignement des 3 points : cette contrainte + les dropdowns du
--         dashboard (STATUS_LABELS / STATUS_COLORS dans
--         src/pages/dashboard/DashboardProspectsPage.tsx) sont mis a jour
--         dans le meme lot. L'Edge Function send-candidature-email ne pose
--         PAS de status prospect (elle laisse le defaut 'new') : rien a y
--         changer, et l'ajout d'une valeur est de toute facon permissif.
--   3. entities.ts / AuditAction : non concernes (pas de nouvelle action CRUD).
--   4. Trace : ce fichier.
--   5. Backup VPS : pas de nouvelle table.
--
-- Ajouter une valeur a un CHECK est PERMISSIF : aucune ligne existante ne peut
-- devenir invalide (les 79 lignes utilisent les 9 valeurs deja autorisees).
--
-- Retour arriere : voir le bloc commente en fin de fichier.
-- ============================================================================

BEGIN;

ALTER TABLE public.prospects
  DROP CONSTRAINT IF EXISTS prospects_status_check;

ALTER TABLE public.prospects
  ADD CONSTRAINT prospects_status_check
  CHECK (status = ANY (ARRAY[
    'new'::text,
    'contacted'::text,
    'photos_sent'::text,
    'visit_scheduled'::text,
    'visit_done'::text,
    'interested'::text,
    'contract_sent'::text,
    'signed'::text,
    'lost'::text,
    'do_not_contact'::text   -- <- ajout 2026-07-26
  ]));

COMMIT;

-- Verification (doit lister do_not_contact) :
--   SELECT pg_get_constraintdef(oid) FROM pg_constraint
--   WHERE conrelid = 'public.prospects'::regclass AND conname = 'prospects_status_check';

-- ---------------------------------------------------------------------------
-- RETOUR ARRIERE
-- Attention : basculer d'abord les eventuelles lignes deja passees au nouveau
-- statut, sinon l'ADD CONSTRAINT echoue.
--
-- BEGIN;
--   UPDATE public.prospects SET status = 'lost' WHERE status = 'do_not_contact';
--   ALTER TABLE public.prospects DROP CONSTRAINT prospects_status_check;
--   ALTER TABLE public.prospects
--     ADD CONSTRAINT prospects_status_check
--     CHECK (status = ANY (ARRAY['new'::text,'contacted'::text,'photos_sent'::text,
--       'visit_scheduled'::text,'visit_done'::text,'interested'::text,
--       'contract_sent'::text,'signed'::text,'lost'::text]));
-- COMMIT;
-- ---------------------------------------------------------------------------
