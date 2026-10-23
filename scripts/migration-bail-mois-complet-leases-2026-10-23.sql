-- Bail : remise sur le PREMIER MOIS COMPLET + enregistrement des baux dans `leases` (demande Jérôme du 23/10/2026).
-- Suite de scripts/migration-bail-remise-caution-2026-10-22.sql. À appliquer AVANT de déployer le code (le générateur
-- écrit la nouvelle colonne). Idempotent : peut être rejoué sans effet.
--
-- Pourquoi :
--   1. Entrée en fin de mois : la remise était retirée du prorata (ex. 7 jours = 332 €) ; une remise de 735 € ne
--      rentrait pas et le formulaire bloquait. Règle de Jérôme : entrée le 1er → remise sur ce mois ; sinon → sur le
--      mois suivant (premier mois complet). Le mois visé est écrit dans le bail ET stocké, le déclencheur le suit.
--   2. `leases` n'a plus aucune ligne depuis le 28/04/2026 : le générateur insère status = 'draft', refusé par
--      leases_status_check (active, ended, terminated, signed), erreur ignorée par le code.
--
-- Checklist §12 (Schema_Supabase_LaVilla.md) : aucune vue ne lit ces colonnes ; RLS inchangée (leases_admin_all,
-- leases_service_all) ; aucune fonction SECURITY DEFINER ; pas de nouvelle table (backup inchangé) ; doc à mettre à jour.

-- 1. Mois de la remise (AAAA-MM), sur le locataire et sur le bail.
alter table public.tenants add column if not exists first_month_discount_month text;
alter table public.leases  add column if not exists first_month_discount_month text;

do $$ begin
  alter table public.tenants add constraint tenants_first_month_discount_month_check
    check (first_month_discount_month is null or first_month_discount_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$');
exception when duplicate_object then null; end $$;

comment on column public.tenants.first_month_discount_month is
  'Mois (AAAA-MM) sur lequel porte first_month_discount_eur : mois d''entrée si entrée le 1er, sinon le mois suivant (premier mois complet).';

-- Baux déjà générés avec une remise (3 brouillons au 23/10/2026, tous entrés un 1er) : même règle.
update public.tenants
   set first_month_discount_month = case when extract(day from move_in_date) = 1
                                         then to_char(move_in_date, 'YYYY-MM')
                                         else to_char(move_in_date + interval '1 month', 'YYYY-MM') end
 where first_month_discount_eur > 0 and first_month_discount_month is null and move_in_date is not null;

-- 2. Déclencheur : la remise porte sur le mois stocké (repli : la même règle, calculée depuis la date d'entrée).
create or replace function public.apply_first_month_discount()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_discount numeric;
  v_move_in date;
  v_month text;
begin
  select t.first_month_discount_eur, t.move_in_date, t.first_month_discount_month
    into v_discount, v_move_in, v_month
    from public.tenants t
   where t.id = new.tenant_id;

  if v_discount is null or v_discount <= 0 then
    return new;
  end if;
  if v_month is null and v_move_in is not null then
    v_month := case when extract(day from v_move_in) = 1 then to_char(v_move_in, 'YYYY-MM')
                    else to_char(v_move_in + interval '1 month', 'YYYY-MM') end;
  end if;
  if v_month is null or new.month is distinct from v_month then
    return new;
  end if;
  if coalesce(new.notes, '') ilike '%remise 1er mois%' then
    return new;
  end if;

  new.expected_amount := greatest(0, round(new.expected_amount - v_discount, 2));
  new.notes := concat_ws(' · ', nullif(new.notes, ''),
    'Remise 1er mois complet −' || replace(to_char(v_discount, 'FM999990.00'), '.', ',') || ' €');
  return new;
end;
$$;
-- (le déclencheur trg_payments_first_month_discount existe déjà et appelle cette fonction : rien à recréer)

-- 3. `leases` accepte le statut 'draft' que le générateur écrit (bail généré, pas encore signé).
alter table public.leases drop constraint if exists leases_status_check;
alter table public.leases add constraint leases_status_check
  check (status = any (array['draft'::text, 'signed'::text, 'active'::text, 'ended'::text, 'terminated'::text]));
