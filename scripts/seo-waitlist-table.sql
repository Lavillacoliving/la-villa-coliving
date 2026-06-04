-- ============================================================
-- C4 — Table "waitlist" (liste prioritaire) + RLS
-- Projet : tefpynkdxxfiefpkgitz  (⚠️ vérifie le bon projet en haut à gauche)
-- Lancer : Supabase → SQL Editor → New query → coller TOUT → Run.
-- Le formulaire /colocation-geneve écrit dedans (insert anon autorisé).
-- ============================================================

create table if not exists public.waitlist (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  nom                  text not null,
  email                text not null,
  profil               text,
  propriete_souhaitee  text,
  date_souhaitee       text,
  message              text
);

-- RLS : on autorise UNIQUEMENT l'insertion publique (le formulaire anon).
-- Pas de policy SELECT/UPDATE/DELETE pour anon → les données ne sont lisibles
-- que via le dashboard / service_role (confidentialité).
alter table public.waitlist enable row level security;

drop policy if exists "waitlist_insert_anon" on public.waitlist;
create policy "waitlist_insert_anon"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- Vérif : la table existe et RLS est activée
select
  (select count(*) from public.waitlist)                                   as nb_lignes,
  (select relrowsecurity from pg_class where relname = 'waitlist')          as rls_active;
