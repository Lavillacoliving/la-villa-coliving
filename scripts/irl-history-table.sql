-- Table de cache de l'Indice de Référence des Loyers (IRL) publié par l'INSEE.
-- Utilisée par l'Edge Function get-irl comme dernier recours
-- si l'API INSEE (api.insee.fr) est indisponible.
--
-- Convention :
--   period   = trimestre INSEE au format "YYYY-Qn" (ex: "2026-Q1")
--   value    = valeur de l'indice (ex: 146.6)
--   date_jo  = date de publication au Journal Officiel (ex: "2026-04-16")
--   source   = origine ('insee' uniquement pour l'instant)

create table if not exists public.irl_history (
  id         uuid        primary key default gen_random_uuid(),
  period     text        not null,
  value      numeric     not null,
  date_jo    date,
  source     text        not null default 'insee',
  fetched_at timestamptz not null default now(),
  unique (period)
);

create index if not exists idx_irl_history_period_desc
  on public.irl_history (period desc);

-- RLS activée. Lecture autorisée pour anon/authenticated (utile si on veut un jour
-- lire l'historique directement depuis le frontend). L'écriture passe par
-- l'Edge Function qui utilise la service_role.
alter table public.irl_history enable row level security;

drop policy if exists "irl_history_anon_read" on public.irl_history;
create policy "irl_history_anon_read"
  on public.irl_history
  for select
  to anon, authenticated
  using (true);
