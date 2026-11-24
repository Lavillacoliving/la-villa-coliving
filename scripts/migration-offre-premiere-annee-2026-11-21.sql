-- =================================================================================================================
-- Offre « Ta première année avec nous » — lot 2 (préparé le 21/11/2026 ; NON appliqué : GO de Jérôme attendu).
-- Migration additive et idempotente, en une transaction :
--   1. table offer_rewards : une ligne par remboursement à verser (paliers 2 à 4 : 300, 400 et 500 €), accès administrateur seulement ;
--   2. create_lease_v3(jsonb) : crée ces 3 lignes dans la même transaction que le bail quand p.offer_rewards est fourni (générateur
--      v3, option « Ta première année ») et renvoie leur nombre ; sans ce champ, comportement inchangé (offer_rewards = 0).
-- Le palier 1 (200 €) reste la remise du premier mois complet (first_month_discount_*) : déclencheur des paiements inchangé.
-- Retour arrière : scripts/migration-offre-premiere-annee-2026-11-21-rollback.sql
-- Checklist § 12 du schéma (lavilla-docs) : table nouvelle, RLS (administrateur + service), anon révoqué, aucune donnée bancaire
-- (l'IBAN arrive au lot 3, dans une table à part) ; la sauvegarde quotidienne du VPS est à étendre à cette table (hors dépôt).
-- =================================================================================================================
begin;

create table if not exists public.offer_rewards (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid not null references public.tenants(id),
  lease_id            uuid not null references public.leases(id),
  property_id         uuid not null references public.properties(id),
  offer_id            text not null default 'premiere-annee',
  tier                smallint not null,
  amount_eur          numeric(10,2) not null,
  reference_month     date not null,
  remind_on           date generated always as ((reference_month - interval '1 month')::date) stored,
  status              text not null default 'a_venir',
  informed_at         timestamptz,
  rib_requested_at    timestamptz,
  rib_received_at     timestamptz,
  paid_at             date,
  paid_amount_eur     numeric(10,2),
  bank_transaction_id uuid references public.bank_transactions(id) on delete set null,
  not_due_reason      text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  updated_by          text,
  constraint offer_rewards_tier_check check (tier in (2, 3, 4)),
  constraint offer_rewards_amount_check check (offer_id <> 'premiere-annee' or (tier = 2 and amount_eur = 300) or (tier = 3 and amount_eur = 400) or (tier = 4 and amount_eur = 500)),
  constraint offer_rewards_month_check check (extract(day from reference_month) = 1),
  constraint offer_rewards_status_check check (status in ('a_venir', 'a_prevenir', 'rib_demande', 'rib_recu', 'a_verser', 'verse', 'non_du')),
  constraint offer_rewards_non_du_check check (status <> 'non_du' or nullif(btrim(not_due_reason), '') is not null),
  constraint offer_rewards_verse_check check (status <> 'verse' or (paid_at is not null and paid_amount_eur is not null)),
  constraint offer_rewards_lease_tier_key unique (lease_id, tier)
);
comment on table public.offer_rewards is 'Offre « Ta première année » (bail signé du 26/11 au 31/12/2026) : remboursements des paliers 2 à 4 (300, 400, 500 €), versés par virement après l''encaissement des 4e, 7e et 13e loyers complets. Statuts calculés et confirmés par un humain dans le dashboard (lot 3) ; jamais de bascule silencieuse.';
comment on column public.offer_rewards.reference_month is 'Premier jour du 4e, 7e ou 13e mois complet de location.';
comment on column public.offer_rewards.remind_on is 'Un mois avant reference_month : prévenir le locataire et lui demander son RIB.';
create index if not exists offer_rewards_status_month_idx on public.offer_rewards (status, reference_month);
create index if not exists offer_rewards_tenant_idx on public.offer_rewards (tenant_id);
create unique index if not exists offer_rewards_bank_transaction_key on public.offer_rewards (bank_transaction_id) where bank_transaction_id is not null;

drop trigger if exists offer_rewards_updated_at on public.offer_rewards;
create trigger offer_rewards_updated_at before update on public.offer_rewards for each row execute function public.update_timestamp();

alter table public.offer_rewards enable row level security;
drop policy if exists offer_rewards_admin_all on public.offer_rewards;
create policy offer_rewards_admin_all on public.offer_rewards for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists offer_rewards_service_all on public.offer_rewards;
create policy offer_rewards_service_all on public.offer_rewards for all using (auth.role() = 'service_role');
revoke all on public.offer_rewards from anon;

CREATE OR REPLACE FUNCTION public.create_lease_v3(p jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  t jsonb := p->'tenant';
  l jsonb := p->'lease';
  v_tenant_id uuid;
  v_lease_id uuid;
  v_first date;
  v_rewards int := 0;
begin
  if not public.is_admin() then
    raise exception 'create_lease_v3 : réservé aux administrateurs';
  end if;
  if t is null or l is null then
    raise exception 'create_lease_v3 : payload incomplet (tenant, lease)';
  end if;

  if nullif(p->>'old_tenant_id', '') is not null then
    update public.tenants set is_active = false, updated_at = now() where id = (p->>'old_tenant_id')::uuid;
  end if;

  insert into public.tenants (
    first_name, last_name, email, phone, property_id, room_number, current_rent, rent_eur, charges_forfait_eur,
    is_active, lease_status, move_in_date, bail_end, deposit_amount, deposit_received, due_day,
    date_of_birth, place_of_birth, occupation, employer, previous_tenant_rent_eur, previous_tenant_departure_date,
    first_month_discount_eur, first_month_discount_month, deposit_installments, deposit_installments_received, notes
  ) values (
    t->>'first_name', t->>'last_name', t->>'email', nullif(t->>'phone', ''), (t->>'property_id')::uuid, (t->>'room_number')::int,
    (t->>'current_rent')::numeric, (t->>'rent_eur')::numeric, (t->>'charges_forfait_eur')::numeric,
    true, 'draft', (t->>'move_in_date')::date, nullif(t->>'bail_end', '')::date, (t->>'deposit_amount')::numeric, false, 5,
    nullif(t->>'date_of_birth', '')::date, nullif(t->>'place_of_birth', ''), nullif(t->>'occupation', ''), nullif(t->>'employer', ''),
    nullif(t->>'previous_tenant_rent_eur', '')::numeric, nullif(t->>'previous_tenant_departure_date', '')::date,
    nullif(t->>'first_month_discount_eur', '')::numeric, nullif(t->>'first_month_discount_month', ''),
    coalesce(nullif(t->>'deposit_installments', '')::smallint, 1), 0, t->>'notes'
  ) returning id into v_tenant_id;

  insert into public.leases (
    tenant_id, lease_version, property_id, room_number, tenant_first_name, tenant_last_name, tenant_email,
    rent_eur, rent_hc_eur, charges_forfait_eur, rent_chf, deposit_eur, start_date, end_date, lease_duration_months,
    exchange_rate, exchange_rate_date, irl_quarter, irl_value,
    previous_rent_hc_eur, previous_rent_paid_on, previous_rent_last_revision_on, previous_tenant_departure_on,
    relocation_cap_hc_eur, relocation_exception, exposed_premium_eur, relocation_override_reason, entry_fee_eur,
    entity_snapshot, services_catalog_version, first_month_discount_eur, first_month_discount_month, deposit_installments,
    status, is_active, generated_at
  ) values (
    v_tenant_id, coalesce(l->>'lease_version', 'v3'), (l->>'property_id')::uuid, (l->>'room_number')::int,
    l->>'tenant_first_name', l->>'tenant_last_name', l->>'tenant_email',
    (l->>'rent_eur')::numeric, (l->>'rent_hc_eur')::numeric, (l->>'charges_forfait_eur')::numeric, nullif(l->>'rent_chf', '')::numeric,
    (l->>'deposit_eur')::numeric, (l->>'start_date')::date, nullif(l->>'end_date', '')::date, nullif(l->>'lease_duration_months', '')::int,
    nullif(l->>'exchange_rate', '')::numeric, nullif(l->>'exchange_rate_date', '')::date, nullif(l->>'irl_quarter', ''), nullif(l->>'irl_value', '')::numeric,
    nullif(l->>'previous_rent_hc_eur', '')::numeric, nullif(l->>'previous_rent_paid_on', '')::date, nullif(l->>'previous_rent_last_revision_on', '')::date, nullif(l->>'previous_tenant_departure_on', '')::date,
    nullif(l->>'relocation_cap_hc_eur', '')::numeric, nullif(l->>'relocation_exception', ''), nullif(l->>'exposed_premium_eur', '')::numeric, nullif(l->>'relocation_override_reason', ''), nullif(l->>'entry_fee_eur', '')::numeric,
    l->'entity_snapshot', nullif(l->>'services_catalog_version', ''), nullif(l->>'first_month_discount_eur', '')::numeric, nullif(l->>'first_month_discount_month', ''),
    coalesce(nullif(l->>'deposit_installments', '')::smallint, 1), coalesce(nullif(l->>'status', ''), 'draft'), false, now()
  ) returning id into v_lease_id;

  -- (Offre « Ta première année », 21/11/2026) Les 3 remboursements (paliers 2 à 4 : 300, 400, 500 €) dans la MÊME transaction
  -- que le bail : un bail sous l'offre n'existe jamais sans eux. Contrôles : remise de 200 € sur le premier mois complet (palier 1),
  -- exactement les paliers 2, 3 et 4, aux mois +3, +6 et +12 du premier mois complet (4e, 7e et 13e loyers complets).
  if jsonb_typeof(p->'offer_rewards') = 'array' and jsonb_array_length(p->'offer_rewards') > 0 then
    v_first := to_date(nullif(l->>'first_month_discount_month', '') || '-01', 'YYYY-MM-DD');
    if v_first is null or coalesce(nullif(l->>'first_month_discount_eur', '')::numeric, 0) <> 200 then
      raise exception 'create_lease_v3 : offre premiere-annee sans remise de 200 € sur le premier mois complet';
    end if;
    insert into public.offer_rewards (tenant_id, lease_id, property_id, offer_id, tier, amount_eur, reference_month, updated_by)
    select v_tenant_id, v_lease_id, (l->>'property_id')::uuid, coalesce(nullif(r->>'offer_id', ''), 'premiere-annee'),
           (r->>'tier')::smallint, (r->>'amount_eur')::numeric, (r->>'reference_month')::date, 'create_lease_v3'
      from jsonb_array_elements(p->'offer_rewards') r;
    get diagnostics v_rewards = row_count;
    if v_rewards <> 3 or exists (
      select 1 from public.offer_rewards o
       where o.lease_id = v_lease_id
         and o.reference_month <> (v_first + make_interval(months => case o.tier when 2 then 3 when 3 then 6 when 4 then 12 end))::date
    ) then
      raise exception 'create_lease_v3 : remboursements de l''offre incohérents (attendu : paliers 2, 3, 4 aux mois +3, +6, +12 du premier mois complet)';
    end if;
  end if;

  return jsonb_build_object('tenant_id', v_tenant_id, 'lease_id', v_lease_id, 'offer_rewards', v_rewards);
end;
$function$;

revoke all on function public.create_lease_v3(jsonb) from public, anon;
grant execute on function public.create_lease_v3(jsonb) to authenticated, service_role;

commit;
