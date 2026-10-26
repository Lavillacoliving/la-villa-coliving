-- Retour arrière du lot 1 du bail v3 (scripts/migration-bail-v3-lot1-2026-10-26.sql).
-- ATTENTION : supprime les tables et colonnes ajoutées, et donc leurs données (seeds, saisies de charges, catalogue).
-- Les colonnes rent_eur / charges_forfait_eur / previous_tenant_* de tenants, antérieures au lot 1, sont conservées.
drop view if exists public.v_property_current_charges;
drop table if exists public.service_log;
drop table if exists public.services_catalog;
drop table if exists public.property_charges_lines;
drop table if exists public.property_charges;
drop table if exists public.entity_legal;

alter table public.leases
  drop column if exists lease_version, drop column if exists rent_hc_eur, drop column if exists irl_quarter,
  drop column if exists irl_value, drop column if exists previous_rent_hc_eur, drop column if exists previous_rent_paid_on,
  drop column if exists previous_rent_last_revision_on, drop column if exists previous_tenant_departure_on,
  drop column if exists relocation_cap_hc_eur, drop column if exists relocation_exception, drop column if exists exposed_premium_eur,
  drop column if exists relocation_override_reason, drop column if exists entry_fee_eur, drop column if exists entity_snapshot,
  drop column if exists services_catalog_version, drop column if exists exchange_rate_date, drop column if exists lease_duration_months;

alter table public.tenants drop column if exists insurance_expiry;
alter table public.rooms drop column if exists volume_m3, drop column if exists bloc_a, drop column if exists justified_rent_eur;
alter table public.properties
  drop column if exists dpe_class, drop column if exists surface_total_m2, drop column if exists equipment,
  drop column if exists setting_clause_fr, drop column if exists setting_clause_en, drop column if exists zone_tendue,
  drop column if exists relocation_exception_default, drop column if exists niveau_encadrement;
update public.properties set legal_entity_type = 'Société créée de fait entre personnes physiques' where slug = 'lavilla' and legal_entity_type = 'Indivision';
alter table public.entities
  drop column if exists legal_form, drop column if exists legal_name, drop column if exists trade_name,
  drop column if exists registration, drop column if exists capital_eur, drop column if exists siege, drop column if exists vat_mention;
