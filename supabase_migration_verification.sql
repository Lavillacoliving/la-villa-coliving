-- ============================================================
-- Migration : Vérification humaine des rapprochements factures
-- Date : 2026-02-26
-- À exécuter dans Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. Ajouter storage_path sur invoices (chemin dans bucket compta)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- 2. Ajouter colonnes de vérification sur bank_transactions
ALTER TABLE bank_transactions ADD COLUMN IF NOT EXISTS verified_by TEXT;
ALTER TABLE bank_transactions ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- 3. Index pour requêtes de vérification (performance)
CREATE INDEX IF NOT EXISTS idx_bt_rapprochement_verified
  ON bank_transactions(entity_id, rapprochement_status)
  WHERE rapprochement_status = 'verified';

-- 4. Vérification : lister les nouvelles colonnes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'invoices' AND column_name = 'storage_path'
UNION ALL
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'bank_transactions' AND column_name IN ('verified_by', 'verified_at')
ORDER BY column_name;
