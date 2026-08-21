-- Trace de la migration Supabase appliquée le 21/08/2026 (MCP apply_migration
-- « checkpoint_2026_08_21_is_test_candidats_uniques ») — checkpoint perf & leads, R1.
-- Checklist §12 (lavilla-docs/Schema_Supabase_LaVilla.md) :
--   1. Vue v_form_submissions_clean : DROP + CREATE (expose is_test, ne dédoublonne que
--      les vraies soumissions), security_invoker=true conservé, grant select anon/auth/service.
--   2. RLS : inchangée (colonnes ajoutées avec défaut false ; policies existantes intactes).
--   2bis. Aucune contrainte CHECK modifiée. Edge Function v12 pose is_test (payload isTest).
--   3. entities.ts / logAudit : non concernés.
--   4. Trace : ce fichier.  5. Backup VPS : colonnes exportées avec les tables existantes.
--   6. Doc : Schema_Supabase_LaVilla.md — MàJ 21/08/2026 (section prospects / form_submissions / RPC).
-- Additif et réversible. Voir le contenu exact dans l'historique des migrations Supabase.

alter table public.prospects        add column if not exists is_test boolean not null default false;
alter table public.form_submissions add column if not exists is_test boolean not null default false;
-- ... vue + RPC : voir la migration (bulletin_seo_metrics → clé `candidats_uniques`
--     {s1_7j, s2_7j, total_30j, multi_30j, lignes_30j} ; `candidatures.tests_30j`).
