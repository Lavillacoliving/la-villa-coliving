-- ============================================================================
-- Migration : ajout du statut prospect « Froid » (prospect en attente)
-- Date      : 2026-09-02
-- Demande   : Jerome — le dashboard Prospects ne permettait pas la gestion a
--             moyen terme : un candidat qui veut emmenager dans 4 mois n'a
--             sa place ni dans le pipeline actif (il l'encombre), ni dans
--             « Perdu » (il n'est pas perdu). Nouvelle colonne kanban
--             « Froids / Morts » = cold + lost + do_not_contact, classee par
--             mois d'emmenagement souhaite pour relancer au bon moment.
--
-- Table     : public.prospects
-- Contrainte: prospects_status_check  (10 valeurs -> 11)
-- Valeur    : cold   (libelle dashboard : « Froid »)
--
-- Checklist Schema_Supabase_LaVilla.md §12 :
--   1. Vues v_* : aucune vue ne filtre sur prospects.status (inchange depuis
--      la migration do_not_contact du 26/07) -> RAS.
--   2. RLS : prospects n'est pas exposee au portail/site public -> RAS.
--   2bis. Alignement des 3 points : cette contrainte + STATUS_LABELS /
--         STATUS_COLORS / PIPELINE_COLUMNS dans
--         src/pages/dashboard/DashboardProspectsPage.tsx sont mis a jour dans
--         le meme lot (branche feat/prospects-pipeline-moyen-terme).
--         L'Edge Function send-candidature-email ne pose PAS de status
--         (defaut 'new') : rien a y changer.
--   3. entities.ts / AuditAction : non concernes (status_change existe deja).
--   4. Trace : ce fichier.
--   5. Backup VPS : pas de nouvelle table.
--   6. Doc : mettre a jour la ligne `status` du §6.1 de
--      Schema_Supabase_LaVilla.md APRES execution (11 valeurs, `cold` ajoute
--      le 02/09/2026) — jamais avant (lecon du 27/07 : la doc reflete
--      pg_get_constraintdef, pas l'intention d'une migration).
--
-- Comptages bulletin (scripts/lot4-bulletin-metrics-rpc.sql,
-- scripts/utm-attribution-2026-08-22.sql) : `cold` ne tombe ni dans
-- « en_cours » ni dans « contrat_ou_signe », comme lost / do_not_contact —
-- c'est voulu (prospect en attente, pas en cours de traitement).
--
-- Ordre de deploiement : executer ce SQL AVANT de merger la branche sur main,
-- sinon le bouton « ❄ Froid » du dashboard est refuse en 23514.
--
-- Ajouter une valeur a un CHECK est PERMISSIF : aucune ligne existante ne peut
-- devenir invalide.
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
    'cold'::text,            -- <- ajout 2026-09-02
    'lost'::text,
    'do_not_contact'::text
  ]));

COMMIT;

-- Verification (doit lister cold) :
--   SELECT pg_get_constraintdef(oid) FROM pg_constraint
--   WHERE conrelid = 'public.prospects'::regclass AND conname = 'prospects_status_check';

-- ---------------------------------------------------------------------------
-- RETOUR ARRIERE
-- Attention : basculer d'abord les lignes deja passees au nouveau statut,
-- sinon l'ADD CONSTRAINT echoue.
--
-- BEGIN;
--   UPDATE public.prospects SET status = 'contacted' WHERE status = 'cold';
--   ALTER TABLE public.prospects DROP CONSTRAINT prospects_status_check;
--   ALTER TABLE public.prospects
--     ADD CONSTRAINT prospects_status_check
--     CHECK (status = ANY (ARRAY['new'::text,'contacted'::text,'photos_sent'::text,
--       'visit_scheduled'::text,'visit_done'::text,'interested'::text,
--       'contract_sent'::text,'signed'::text,'lost'::text,'do_not_contact'::text]));
-- COMMIT;
-- ---------------------------------------------------------------------------
