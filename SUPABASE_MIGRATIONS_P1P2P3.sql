-- ============================================================
-- MIGRATIONS SUPABASE — Audit P1/P2/P3 (Session 34, 23/02/2026)
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================================

-- 1. TABLE EVENTS (si pas encore créée)
-- Utilisée par useEvents.ts + DashboardEventsPage.tsx
CREATE TABLE IF NOT EXISTS events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'community',
  title_fr text NOT NULL,
  title_en text,
  date date NOT NULL,
  time time,
  location text,
  description_fr text,
  description_en text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_property ON events(property_id);

-- RLS pour events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "events_admin_all" ON events
  FOR ALL USING (
    auth.jwt() ->> 'email' IN ('jerome@lavillacoliving.com', 'fanny@lavillacoliving.com')
  );

-- Service role full access
CREATE POLICY "events_service_all" ON events
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users can read (for portail)
CREATE POLICY "events_auth_read" ON events
  FOR SELECT USING (auth.role() = 'authenticated');


-- 2. TABLE LEASES (P1.10)
-- Persiste les baux générés depuis DashboardNouveauBailPage
CREATE TABLE IF NOT EXISTS leases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_first_name text NOT NULL,
  tenant_last_name text NOT NULL,
  tenant_email text,
  property_id uuid REFERENCES properties(id),
  room_number integer,
  rent_chf numeric(10,2),
  rent_eur numeric(10,2),
  deposit_eur numeric(10,2),
  start_date date NOT NULL,
  end_date date,
  exchange_rate numeric(6,4),
  charges_energy_chf numeric(10,2) DEFAULT 0,
  charges_maintenance_chf numeric(10,2) DEFAULT 0,
  charges_services_chf numeric(10,2) DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'ended', 'terminated')),
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leases_property ON leases(property_id);
CREATE INDEX IF NOT EXISTS idx_leases_status ON leases(status);

ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leases_admin_all" ON leases
  FOR ALL USING (
    auth.jwt() ->> 'email' IN ('jerome@lavillacoliving.com', 'fanny@lavillacoliving.com')
  );

CREATE POLICY "leases_service_all" ON leases
  FOR ALL USING (auth.role() = 'service_role');


-- 3. TABLE AUDIT_LOG (P3.13)
-- Logs toutes les actions admin pour traçabilité
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_admin_all" ON audit_log
  FOR ALL USING (
    auth.jwt() ->> 'email' IN ('jerome@lavillacoliving.com', 'fanny@lavillacoliving.com')
  );

CREATE POLICY "audit_service_all" ON audit_log
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to INSERT (so logging works from dashboard)
CREATE POLICY "audit_auth_insert" ON audit_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 4. COLONNE is_visible_annuaire sur tenants (P2.11)
-- Permet aux locataires de se rendre visibles dans l'annuaire communautaire
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenants' AND column_name = 'is_visible_annuaire') THEN
    ALTER TABLE tenants ADD COLUMN is_visible_annuaire boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenants' AND column_name = 'bio') THEN
    ALTER TABLE tenants ADD COLUMN bio text;
  END IF;
END $$;


-- 5. BUCKET tenant-files (P1.7)
-- Créer via le dashboard Supabase : Storage > New Bucket > "tenant-files" (private)
-- Ou via SQL :
INSERT INTO storage.buckets (id, name, public)
VALUES ('tenant-files', 'tenant-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies pour tenant-files
CREATE POLICY "tenant_files_admin_all" ON storage.objects
  FOR ALL USING (
    bucket_id = 'tenant-files' AND
    auth.jwt() ->> 'email' IN ('jerome@lavillacoliving.com', 'fanny@lavillacoliving.com')
  );

CREATE POLICY "tenant_files_service_all" ON storage.objects
  FOR ALL USING (
    bucket_id = 'tenant-files' AND auth.role() = 'service_role'
  );


-- ============================================================
-- VÉRIFICATION
-- ============================================================
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name IN ('events', 'leases', 'audit_log');
--
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'tenants' AND column_name IN ('is_visible_annuaire', 'bio');
--
-- SELECT id FROM storage.buckets WHERE id = 'tenant-files';
