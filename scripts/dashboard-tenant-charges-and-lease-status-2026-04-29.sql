-- =====================================================================
-- Migration : Charges individualisées + Statut de bail (flow Yousign)
-- Date      : 2026-04-29
-- Auteur    : Jérôme + Claude (Cowork)
-- Projet    : Dashboard La Villa Coliving
--
-- Objectifs :
--   1) Charges forfaitaires individualisables par locataire (override
--      du niveau propriété, fallback automatique si NULL).
--   2) Cycle de vie d'un bail (draft → sent_yousign → signed → active
--      → cancelled) pour gérer le workflow Yousign.
--   3) Réception de la caution explicite (boolean) au lieu d'être
--      auto-marquée comme reçue à la création du bail.
--
-- ⚠️ À exécuter dans Supabase SQL Editor (projet : la-villa-loyers)
-- =====================================================================

-- =====================================================================
-- 1. CHARGES INDIVIDUALISÉES PAR LOCATAIRE (nullable = hérite propriété)
-- =====================================================================

ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS charges_energy_chf      NUMERIC(10,2) NULL,
  ADD COLUMN IF NOT EXISTS charges_maintenance_chf NUMERIC(10,2) NULL,
  ADD COLUMN IF NOT EXISTS charges_services_chf    NUMERIC(10,2) NULL;

COMMENT ON COLUMN tenants.charges_energy_chf      IS 'Override des charges énergie (CHF) — NULL = hérite de properties.charges_energy_chf';
COMMENT ON COLUMN tenants.charges_maintenance_chf IS 'Override des charges maintenance (CHF) — NULL = hérite de properties.charges_maintenance_chf';
COMMENT ON COLUMN tenants.charges_services_chf    IS 'Override des charges services (CHF) — NULL = hérite de properties.charges_services_chf';


-- =====================================================================
-- 2. STATUT DE BAIL (cycle de vie Yousign)
-- =====================================================================

-- ENUM vérifié via CHECK constraint (plus simple à modifier qu'un type ENUM Postgres)
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS lease_status TEXT NOT NULL DEFAULT 'active';

ALTER TABLE tenants
  DROP CONSTRAINT IF EXISTS tenants_lease_status_check;

ALTER TABLE tenants
  ADD CONSTRAINT tenants_lease_status_check
  CHECK (lease_status IN ('draft','sent_yousign','signed','active','cancelled'));

COMMENT ON COLUMN tenants.lease_status IS
  'Cycle de vie du bail : draft (créé, pas envoyé) → sent_yousign (envoyé pour signature) → signed (signé reçu) → active (caution + 1er loyer reçus) → cancelled (annulé avant signature). Default: active pour les fiches existantes.';


-- =====================================================================
-- 3. RÉCEPTION CAUTION EXPLICITE
-- =====================================================================

-- La table tenants a déjà `deposit_received_date` (TIMESTAMP/DATE).
-- On ajoute un booléen `deposit_received` pour permettre à Jérôme
-- de cocher "caution reçue" sans avoir à entrer une date à la main,
-- tout en gardant `deposit_received_date` qui est posée automatiquement
-- au moment de la confirmation.

ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS deposit_received BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill : tous les locataires existants qui ont une date de réception
-- caution sont considérés comme "reçue".
UPDATE tenants
   SET deposit_received = TRUE
 WHERE deposit_received_date IS NOT NULL;

COMMENT ON COLUMN tenants.deposit_received IS
  'TRUE = caution physiquement reçue sur le compte. Default FALSE à la création (le bail n''implique pas la réception).';


-- =====================================================================
-- 4. INDEXES (filtrage rapide par statut sur le dashboard)
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_tenants_lease_status     ON tenants(lease_status);
CREATE INDEX IF NOT EXISTS idx_tenants_deposit_received ON tenants(deposit_received) WHERE deposit_received = FALSE;


-- =====================================================================
-- 5. AUDIT — pour traçabilité dans audit_log
-- =====================================================================

-- Note : aucun trigger SQL ajouté ici. Les transitions de statut
-- (draft→sent→signed→active) et la confirmation de caution sont
-- enregistrées côté front via logAudit() dans le dashboard React.


-- =====================================================================
-- 6. VÉRIFICATION (à exécuter manuellement après migration)
-- =====================================================================

-- SELECT column_name, data_type, is_nullable, column_default
--   FROM information_schema.columns
--  WHERE table_name = 'tenants'
--    AND column_name IN ('charges_energy_chf','charges_maintenance_chf','charges_services_chf','lease_status','deposit_received')
--  ORDER BY column_name;

-- SELECT lease_status, COUNT(*) FROM tenants GROUP BY lease_status;
-- SELECT deposit_received, COUNT(*) FROM tenants GROUP BY deposit_received;
