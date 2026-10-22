-- Bail : remise sur le 1er mois et caution en 1, 2 ou 3 fois (demande Jérôme du 22/10/2026).
-- À appliquer AVANT de déployer le code du générateur de bail (sinon l'insertion du bail échoue : colonnes absentes).
-- Idempotent : peut être rejoué sans effet.
--
-- Checklist §12 (Schema_Supabase_LaVilla.md) :
--   1. Vues : aucune vue ne lit ces colonnes ; ADD COLUMN ne casse aucune vue existante.
--   2. RLS : policies de tenants / leases / payments inchangées (portail : le locataire lit sa ligne, colonnes comprises).
--   2ter. Aucune fonction SECURITY DEFINER : la fonction du déclencheur s'exécute avec les droits de celui qui insère
--      (Process Compta en service_role, onglet Suivi loyers en admin connecté : tous deux lisent tenants).
--   3. logAudit : nouvelle action `deposit_installment_received` (src/lib/auditLog.ts).
--   5. Backup VPS : pas de nouvelle table.

-- 1. Locataire : remise accordée sur le 1er mois (EUR, charges comprises) et échéancier de la caution.
alter table public.tenants
  add column if not exists first_month_discount_eur numeric,
  add column if not exists deposit_installments smallint not null default 1,
  add column if not exists deposit_installments_received smallint not null default 0;

do $$ begin
  alter table public.tenants add constraint tenants_first_month_discount_check
    check (first_month_discount_eur is null or first_month_discount_eur >= 0);
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.tenants add constraint tenants_deposit_installments_check
    check (deposit_installments between 1 and 3
           and deposit_installments_received between 0 and deposit_installments);
exception when duplicate_object then null; end $$;

comment on column public.tenants.first_month_discount_eur is
  'Remise accordée sur le montant du 1er mois (EUR, charges comprises), geste commercial inscrit au bail. NULL = aucune.';
comment on column public.tenants.deposit_installments is
  'Caution versée en 1, 2 ou 3 fois : à la signature, puis avec le 2e et le 3e loyer (avant le 5).';
comment on column public.tenants.deposit_installments_received is
  'Nombre d''échéances de caution reçues (0 à deposit_installments). Toutes reçues = deposit_received.';

-- 2. Bail : photographie des mêmes conditions au moment de la génération.
alter table public.leases
  add column if not exists first_month_discount_eur numeric,
  add column if not exists deposit_installments smallint not null default 1;

-- 3. Loyer attendu du mois d'entrée : la remise est retirée à la création de la ligne `payments`, quel que soit
--    l'auteur (Process Compta V4, onglet Suivi loyers). Une seule fois : la note « Remise 1er mois » sert de repère.
create or replace function public.apply_first_month_discount()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_discount numeric;
  v_move_in date;
begin
  select t.first_month_discount_eur, t.move_in_date
    into v_discount, v_move_in
    from public.tenants t
   where t.id = new.tenant_id;

  if v_discount is null or v_discount <= 0 or v_move_in is null then
    return new;
  end if;
  if new.month is distinct from to_char(v_move_in, 'YYYY-MM') then
    return new;
  end if;
  if coalesce(new.notes, '') ilike '%remise 1er mois%' then
    return new;
  end if;

  new.expected_amount := greatest(0, round(new.expected_amount - v_discount, 2));
  new.notes := concat_ws(' · ', nullif(new.notes, ''),
    'Remise 1er mois −' || replace(to_char(v_discount, 'FM999990.00'), '.', ',') || ' €');
  return new;
end;
$$;

drop trigger if exists trg_payments_first_month_discount on public.payments;
create trigger trg_payments_first_month_discount
  before insert on public.payments
  for each row execute function public.apply_first_month_discount();
