-- ============================================================================
-- Migration : kanban Prospects v2 — statut « À recontacter » + alertes chambre
-- Date      : 2026-09-03
-- Demande   : Jérôme (GO du 03/09 sur la maquette « Kanban Prospects v2 »)
--   1. Nouvelle colonne d'attente « À recontacter » → nouveau statut `recontact`
--      sur public.prospects (la date de relance utilise la colonne EXISTANTE
--      prospects.next_followup_date : aucune colonne ajoutée sur prospects).
--   2. Colonne « Alertes chambre » alimentée par public.waitlist (inscriptions
--      « Juste me prévenir » des pages maisons, en ligne depuis le 03/09 08:25) :
--      le dashboard doit LIRE la table et MARQUER une alerte traitée.
--
-- Tables    : public.prospects (contrainte prospects_status_check : 11 → 12 valeurs)
--             public.waitlist  (2 colonnes + 2 policies RLS gardées par is_admin())
--
-- Checklist Schema_Supabase_LaVilla.md §12 :
--   1. Vues v_* : aucune vue ne filtre sur prospects.status ni ne lit waitlist → RAS.
--   2. RLS : waitlist n'avait qu'une policy (INSERT anon, le site). Ajout de SELECT +
--      UPDATE gardés par is_admin() — la MÊME garde que admin_full_prospects : seuls
--      les comptes admin du dashboard lisent/modifient ; un résident connecté au
--      portail (authenticated mais pas admin) et le site (anon) ne gagnent rien.
--   2bis. Contrainte CHECK : STATUS_LABELS / STATUS_COLORS / PIPELINE_COLUMNS de
--         src/pages/dashboard/DashboardProspectsPage.tsx sont mis à jour dans le
--         même lot (branche feat/kanban-prospects-v2). L'Edge Function
--         send-candidature-email ne pose pas de status (défaut 'new') : rien à changer.
--   3. entities.ts / AuditAction : non concernés (status_change / create existent).
--   4. Trace : ce fichier.
--   5. Backup VPS : pas de nouvelle table.
--   6. Doc : §6.1 (12 valeurs, `recontact`) et §6.4 (`waitlist` : prospect_id,
--      handled_at, policies) de Schema_Supabase_LaVilla.md, APRÈS exécution.
--
-- Comptages bulletin (scripts/lot4-bulletin-metrics-rpc.sql) : `recontact` ne tombe
-- ni dans « en_cours » ni dans « contrat_ou_signe », comme cold — voulu (en attente).
--
-- Ordre de déploiement : exécuter ce SQL AVANT de merger la branche, sinon le bouton
-- « ↻ À recontacter » est refusé (23514) et la colonne « Alertes chambre » reste vide
-- (42501). Tout est permissif/additif : aucune ligne existante ne devient invalide.
--
-- Retour arrière : bloc commenté en fin de fichier.
-- ============================================================================

BEGIN;

-- 1. prospects.status : ajout de `recontact` (« À recontacter »)
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
    'cold'::text,
    'recontact'::text,       -- <- ajout 2026-09-03 (« À recontacter »)
    'lost'::text,
    'do_not_contact'::text
  ]));

-- 2. waitlist : traçabilité du traitement d'une alerte par le dashboard
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS prospect_id uuid NULL REFERENCES public.prospects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS handled_at timestamptz NULL;

COMMENT ON COLUMN public.waitlist.prospect_id IS 'Fiche prospect créée depuis cette alerte (dashboard, « Créer le prospect »).';
COMMENT ON COLUMN public.waitlist.handled_at  IS 'Alerte traitée (prospect créé ou ignorée) : disparaît de la colonne « Alertes chambre ».';

-- 3. waitlist : lecture + mise à jour par le dashboard (admins seulement, comme prospects)
DROP POLICY IF EXISTS waitlist_select_admin ON public.waitlist;
CREATE POLICY waitlist_select_admin ON public.waitlist
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS waitlist_update_admin ON public.waitlist;
CREATE POLICY waitlist_update_admin ON public.waitlist
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

COMMIT;

-- Vérification :
--   SELECT pg_get_constraintdef(oid) FROM pg_constraint
--   WHERE conrelid = 'public.prospects'::regclass AND conname = 'prospects_status_check';
--   -- doit lister recontact
--   SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'waitlist' AND column_name IN ('prospect_id','handled_at');
--   -- doit renvoyer 2 lignes
--   SELECT polname, polcmd FROM pg_policy WHERE polrelid = 'public.waitlist'::regclass;
--   -- doit lister waitlist_insert_anon (a), waitlist_select_admin (r), waitlist_update_admin (w)

-- ---------------------------------------------------------------------------
-- RETOUR ARRIÈRE
-- Attention : basculer d'abord les lignes déjà passées en `recontact`.
--
-- BEGIN;
--   UPDATE public.prospects SET status = 'cold' WHERE status = 'recontact';
--   ALTER TABLE public.prospects DROP CONSTRAINT prospects_status_check;
--   ALTER TABLE public.prospects ADD CONSTRAINT prospects_status_check
--     CHECK (status = ANY (ARRAY['new'::text,'contacted'::text,'photos_sent'::text,
--       'visit_scheduled'::text,'visit_done'::text,'interested'::text,'contract_sent'::text,
--       'signed'::text,'cold'::text,'lost'::text,'do_not_contact'::text]));
--   DROP POLICY IF EXISTS waitlist_select_admin ON public.waitlist;
--   DROP POLICY IF EXISTS waitlist_update_admin ON public.waitlist;
--   ALTER TABLE public.waitlist DROP COLUMN IF EXISTS prospect_id, DROP COLUMN IF EXISTS handled_at;
-- COMMIT;
-- ---------------------------------------------------------------------------
