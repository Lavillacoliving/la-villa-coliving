-- =================================================================================================================
-- Retour arrière de scripts/migration-offre-premiere-annee-2026-11-21.sql (NON exécuté ; GO de Jérôme).
-- ⚠ Supprime la table offer_rewards et ses lignes : à ne passer qu'avant tout bail signé sous l'offre, ou après export des lignes.
-- Remet create_lease_v3 dans son état du 21/11/2026 (relevé pg_get_functiondef), sans les remboursements.
-- =================================================================================================================
begin;
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

  return jsonb_build_object('tenant_id', v_tenant_id, 'lease_id', v_lease_id);
end;
$function$;
revoke all on function public.create_lease_v3(jsonb) from public, anon;
grant execute on function public.create_lease_v3(jsonb) to authenticated, service_role;
drop table if exists public.offer_rewards;
commit;
