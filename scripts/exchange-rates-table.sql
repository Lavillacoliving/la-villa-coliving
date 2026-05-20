-- Table de cache des taux de change EUR/CHF (et autres si besoin un jour)
-- Utilisée par l'Edge Function get-exchange-rate comme dernier recours
-- si Frankfurter et la BCE XML sont tous les deux indisponibles.
--
-- Convention :
--   from_currency / to_currency = codes ISO 4217 (ex: EUR, CHF)
--   rate_date = date à laquelle le taux s'applique (date de cotation BCE)
--   source = 'frankfurter' | 'ecb_xml' (origine du taux)

create table if not exists public.exchange_rates (
  id            uuid        primary key default gen_random_uuid(),
  from_currency text        not null,
  to_currency   text        not null,
  rate          numeric     not null,
  rate_date     date        not null,
  source        text        not null,
  fetched_at    timestamptz not null default now(),
  unique (from_currency, to_currency, rate_date)
);

create index if not exists idx_exchange_rates_lookup
  on public.exchange_rates (from_currency, to_currency, rate_date desc);

-- RLS activée par sécurité.
-- La lecture par l'anon est utile si on veut un jour lire directement
-- depuis le frontend (sans passer par l'Edge Function), donc on l'autorise.
-- L'écriture reste réservée au service_role (utilisé par l'Edge Function).
alter table public.exchange_rates enable row level security;

drop policy if exists "exchange_rates_anon_read" on public.exchange_rates;
create policy "exchange_rates_anon_read"
  on public.exchange_rates
  for select
  to anon, authenticated
  using (true);
