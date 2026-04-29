-- =====================================================================
-- SECURITY FIX — RLS sur tenant_ledger + security_invoker sur 19 vues
-- Date : 2026-04-29
-- Contexte : mail Supabase 27 Apr 2026 — "Table publicly accessible"
-- Pattern policies reproduit depuis : public.payments
-- =====================================================================

-- ─────────────────────────────────────────────────────────────────────
-- PARTIE 1 — tenant_ledger : activer RLS + créer 5 policies
-- (mêmes policies que public.payments — admin emails + tenant own + is_admin())
-- ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.tenant_ledger ENABLE ROW LEVEL SECURITY;

-- Drop si existent déjà (idempotence — script peut être relancé sans erreur)
DROP POLICY IF EXISTS "Admin insert tenant_ledger" ON public.tenant_ledger;
DROP POLICY IF EXISTS "Admin read all tenant_ledger" ON public.tenant_ledger;
DROP POLICY IF EXISTS "Admin update tenant_ledger" ON public.tenant_ledger;
DROP POLICY IF EXISTS "Admins full access tenant_ledger" ON public.tenant_ledger;
DROP POLICY IF EXISTS "Tenant read own tenant_ledger" ON public.tenant_ledger;

-- Admin insert (jerome / fanny seulement)
CREATE POLICY "Admin insert tenant_ledger"
  ON public.tenant_ledger
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'email'::text) = ANY (ARRAY[
      'jerome@lavillacoliving.com'::text,
      'fanny@lavillacoliving.com'::text
    ])
  );

-- Admin read all (jerome / fanny seulement)
CREATE POLICY "Admin read all tenant_ledger"
  ON public.tenant_ledger
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email'::text) = ANY (ARRAY[
      'jerome@lavillacoliving.com'::text,
      'fanny@lavillacoliving.com'::text
    ])
  );

-- Admin update (jerome / fanny seulement)
CREATE POLICY "Admin update tenant_ledger"
  ON public.tenant_ledger
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email'::text) = ANY (ARRAY[
      'jerome@lavillacoliving.com'::text,
      'fanny@lavillacoliving.com'::text
    ])
  );

-- Admins full access via is_admin() — couvre INSERT/SELECT/UPDATE/DELETE
CREATE POLICY "Admins full access tenant_ledger"
  ON public.tenant_ledger
  FOR ALL
  TO public
  USING (is_admin());

-- Tenant read own (chaque locataire voit son propre ledger uniquement)
-- ⚠️ Cette policy suppose que tenant_ledger a une colonne `tenant_id`.
-- Si la table n'a pas cette colonne, cette policy échouera — commenter alors.
CREATE POLICY "Tenant read own tenant_ledger"
  ON public.tenant_ledger
  FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenants.id
      FROM tenants
      WHERE tenants.email = (auth.jwt() ->> 'email'::text)
    )
  );

-- ─────────────────────────────────────────────────────────────────────
-- PARTIE 2 — Les 19 vues : ajouter security_invoker = true
-- Cela force chaque vue à exécuter ses SELECT avec les permissions
-- de l'utilisateur courant (et donc à respecter le RLS des tables
-- sous-jacentes, qui sont déjà sécurisées). PostgreSQL 15+, Supabase OK.
-- ─────────────────────────────────────────────────────────────────────

ALTER VIEW public.available_rooms                 SET (security_invoker = true);
ALTER VIEW public.v_agent_data                    SET (security_invoker = true);
ALTER VIEW public.v_cash_flows                    SET (security_invoker = true);
ALTER VIEW public.v_entity_summary                SET (security_invoker = true);
ALTER VIEW public.v_latest_market_data            SET (security_invoker = true);
ALTER VIEW public.v_latest_portfolio              SET (security_invoker = true);
ALTER VIEW public.v_market_summary                SET (security_invoker = true);
ALTER VIEW public.v_monthly_dashboard             SET (security_invoker = true);
ALTER VIEW public.v_monthly_expenses              SET (security_invoker = true);
ALTER VIEW public.v_portfolio_drawdown            SET (security_invoker = true);
ALTER VIEW public.v_portfolio_weekly              SET (security_invoker = true);
ALTER VIEW public.v_position_by_bloc              SET (security_invoker = true);
ALTER VIEW public.v_position_cost_basis           SET (security_invoker = true);
ALTER VIEW public.v_rapprochement_kpi             SET (security_invoker = true);
ALTER VIEW public.v_tenant_balance                SET (security_invoker = true);
ALTER VIEW public.v_tenant_payment_history        SET (security_invoker = true);
ALTER VIEW public.v_unmatched_transactions        SET (security_invoker = true);
ALTER VIEW public.v_weekly_insights_by_agent      SET (security_invoker = true);
ALTER VIEW public.v_weekly_intelligence_summary   SET (security_invoker = true);

-- ─────────────────────────────────────────────────────────────────────
-- PARTIE 3 — Vérification post-fix
-- ─────────────────────────────────────────────────────────────────────

-- Check 1 : tenant_ledger doit avoir rls_enabled=true + 5 policies
SELECT
  'tenant_ledger' AS object,
  c.relrowsecurity AS rls_enabled,
  COUNT(p.polname) AS policies_count,
  CASE
    WHEN c.relrowsecurity AND COUNT(p.polname) >= 5 THEN '✅ FIX OK'
    ELSE '❌ FIX KO — relancer le script'
  END AS status
FROM pg_class c
LEFT JOIN pg_policy p ON p.polrelid = c.oid
WHERE c.relname = 'tenant_ledger' AND c.relkind = 'r'
GROUP BY c.relrowsecurity;

-- Check 2 : les 19 vues doivent avoir security_invoker=true dans reloptions
SELECT
  c.relname AS view_name,
  CASE
    WHEN array_to_string(c.reloptions, ',') LIKE '%security_invoker=true%' THEN '✅ security_invoker'
    ELSE '❌ MISSING — relancer'
  END AS status
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'v'
  AND (c.relname LIKE 'v\_%' ESCAPE '\' OR c.relname = 'available_rooms')
ORDER BY status DESC, c.relname;

-- Check 3 : recap global — devrait montrer 0 ❌ RLS DISABLED
SELECT
  c.relname AS object_name,
  CASE c.relkind WHEN 'r' THEN 'TABLE' WHEN 'v' THEN 'VIEW' END AS type,
  CASE
    WHEN c.relkind = 'v' AND array_to_string(c.reloptions, ',') LIKE '%security_invoker=true%' THEN '✅ security_invoker'
    WHEN c.relkind = 'r' AND c.relrowsecurity THEN '✅ RLS enabled'
    WHEN c.relkind = 'v' THEN '❌ VIEW without security_invoker'
    ELSE '❌ RLS DISABLED'
  END AS rls_status
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind IN ('r', 'v')
ORDER BY rls_status DESC, c.relname;
