-- Bail v3 — Lot 1 : modèle de données (brief Bail v3 du 26/10/2026, PLAN_BAIL_V3_LOTS_2026-10-26.md, GO Jérôme du 26/10).
-- Rétro-compatible : ajouts seulement (colonnes, tables, vue, seeds) ; rien n'est renommé ni supprimé ; les baux v2
-- existants et le générateur actuel continuent de fonctionner. Idempotent : rejouable sans effet.
-- Retour arrière : scripts/migration-bail-v3-lot1-2026-10-26-rollback.sql (supprime colonnes et tables ajoutées).
--
-- Checklist §12 (Schema_Supabase_LaVilla.md) :
--   1. Vues : ADD COLUMN ne casse aucune vue existante ; nouvelle vue v_property_current_charges (security_invoker).
--   2. RLS : nouvelles tables en is_admin() + service_role ; entity_legal (signataires, mandat) jamais lisible par
--      `authenticated` ; services_catalog lisible par `authenticated` (portail, plus tard). Policies existantes inchangées.
--   2ter. Aucune fonction SECURITY DEFINER.
--   3. entities.ts : LEGAL_FORM_OPTIONS, DPE_CLASSES, RELOCATION_EXCEPTIONS ; auditLog : entité `entity`.
--   5. Backup VPS : ajouter entity_legal, property_charges, property_charges_lines, services_catalog, service_log
--      à la liste de /opt/scripts/backup-supabase.sh (toutes ont un `id` uuid triable).
--   6. Doc : Schema_Supabase_LaVilla.md « MàJ 26/10/2026 — Bail v3 lot 1 » après application.
--
-- Décisions reprises : D13 (La Villa = indivision Austin-Piot), D12-bis (forfaits provisoires 344 / 336 / 356 €),
-- D8/D9 (forfait = total ÷ chambres ÷ 12), Q5 (colonnes tenants existantes réutilisées), Q6 (bloc légal sur entities,
-- signataires/mandat admin seulement), Q11 (classe DPE sans date), Q12 (pas de complément maison), Q13 (saisie manuelle
-- des charges : aucune table de mapping bancaire), Q16 (Etadly), D16 (animateur de communauté dès le 01/07/2027).

-- ---------------------------------------------------------------------------------------------------------------
-- 1. entities : identité juridique du bailleur, lue par le bail v3 à la place de properties.legal_* (gardés pour Mont-Blanc)
-- ---------------------------------------------------------------------------------------------------------------
alter table public.entities
  add column if not exists legal_form text,
  add column if not exists legal_name text,
  add column if not exists trade_name text,
  add column if not exists registration text,
  add column if not exists capital_eur numeric,
  add column if not exists siege text,
  add column if not exists vat_mention text not null default 'Loyers et charges non soumis à la TVA (article 261 D 4° du CGI)';

do $$ begin
  alter table public.entities add constraint entities_legal_form_check
    check (legal_form is null or legal_form in ('indivision', 'sci', 'autre'));
exception when duplicate_object then null; end $$;

comment on column public.entities.legal_form is 'indivision | sci | autre — pilote le bloc bailleur du bail v3 (deux signatures pour une indivision).';
comment on column public.entities.legal_name is 'Dénomination juridique imprimée au bail (« Indivision Austin-Piot », « SCI Sleep In »).';
comment on column public.entities.trade_name is 'Enseigne (« La Villa Coliving »).';
comment on column public.entities.registration is 'Immatriculation imprimée au bail (SIRET pour l''indivision, RCS + SIRET pour la SCI).';
comment on column public.entities.vat_mention is 'Mention TVA imprimée au bail ; jamais de numéro de TVA (décision du 26/10/2026).';

update public.entities set
  legal_form = 'indivision',
  legal_name = 'Indivision Austin-Piot',
  trade_name = 'La Villa Coliving',
  registration = 'SIRET 898 236 518 00012',
  siege = '34 rue du Foron, 74100 Ville-la-Grand'
where code = 'LMP' and legal_form is null;

update public.entities set
  legal_form = 'sci',
  legal_name = 'SCI Sleep In',
  trade_name = 'La Villa Coliving',
  registration = 'RCS Thonon-les-Bains 882 153 810 — SIRET 882 153 810 00016',
  capital_eur = 1000,
  siege = '8 rue du Mont-Blanc, 74100 Annemasse'
where code = 'SCI' and legal_form is null;

update public.entities set legal_form = 'autre' where code = 'MB' and legal_form is null;

-- ---------------------------------------------------------------------------------------------------------------
-- 2. entity_legal : signataires et mandat (réservé à l'admin ; entities reste lisible par les résidents pour l'IBAN)
-- ---------------------------------------------------------------------------------------------------------------
create table if not exists public.entity_legal (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null unique references public.entities(id) on delete cascade,
  signatories jsonb not null default '[]'::jsonb,
  mandate jsonb,
  updated_at timestamptz not null default now()
);
comment on table public.entity_legal is 'Signataires du bail par entité ([{name, quality, order, default}]) et mandat de gestion (NULL = art. 17 dormant). Admin seulement.';

alter table public.entity_legal enable row level security;
do $$ begin
  create policy entity_legal_admin_all on public.entity_legal for all using (is_admin()) with check (is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy entity_legal_service_all on public.entity_legal for all using (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;

insert into public.entity_legal (entity_id, signatories)
select e.id, '[{"name":"Jérôme Austin","quality":"propriétaire indivis","order":1,"default":true},{"name":"Fanny Piot","quality":"propriétaire indivis","order":2,"default":true}]'::jsonb
from public.entities e where e.code = 'LMP'
on conflict (entity_id) do nothing;

insert into public.entity_legal (entity_id, signatories)
select e.id, '[{"name":"Jérôme Austin","quality":"gérant","order":1,"default":true},{"name":"Fanny Piot","quality":"gérante","order":2,"default":false}]'::jsonb
from public.entities e where e.code = 'SCI'
on conflict (entity_id) do nothing;

-- ---------------------------------------------------------------------------------------------------------------
-- 3. properties : données de l'art. 2.1 et paramètres de zone ; type d'entité corrigé pour La Villa (D13)
-- ---------------------------------------------------------------------------------------------------------------
alter table public.properties
  add column if not exists dpe_class text,
  add column if not exists surface_total_m2 numeric,
  add column if not exists equipment jsonb not null default '{}'::jsonb,
  add column if not exists setting_clause_fr text,
  add column if not exists setting_clause_en text,
  add column if not exists zone_tendue boolean not null default true,
  add column if not exists relocation_exception_default text,
  add column if not exists niveau_encadrement boolean not null default false;

do $$ begin
  alter table public.properties add constraint properties_dpe_class_check
    check (dpe_class is null or dpe_class in ('A', 'B', 'C', 'D', 'E', 'F', 'G'));
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.properties add constraint properties_relocation_exception_default_check
    check (relocation_exception_default is null or relocation_exception_default in ('first_letting', 'vacancy_18m', 'works', 'undervalued'));
exception when duplicate_object then null; end $$;

comment on column public.properties.dpe_class is 'Classe DPE (A-G), sans date (décision du 26/10/2026).';
comment on column public.properties.surface_total_m2 is 'Surface totale de la maison imprimée à l''art. 2.1 (source : Master_Pricing C_Fiches_Maisons).';
comment on column public.properties.equipment is 'Équipements de la maison (piscine : none|outdoor|outdoor_heated|indoor, sauna, gym, cinema, game_room, pool_house, vegetable_garden, volleyball, terraces, bbq, garden_m2).';
comment on column public.properties.setting_clause_fr is 'Phrase de l''art. 2.1 décrivant le cadre de la maison (onglet Valorisation du Master_Pricing).';
comment on column public.properties.zone_tendue is 'Zone tendue : plafond de relocation = dernier loyer HC × (1 + IRL) sauf exception.';
comment on column public.properties.charges_forfait_eur is 'OBSOLÈTE depuis le lot 1 du bail v3 (26/10/2026) : le forfait courant vient de v_property_current_charges. Conservé, non lu.';

update public.properties set legal_entity_type = 'Indivision'
where slug = 'lavilla' and legal_entity_type = 'Société créée de fait entre personnes physiques';

update public.properties set dpe_class = 'D' where slug = 'lavilla' and dpe_class is null;
update public.properties set dpe_class = 'C' where slug = 'leloft' and dpe_class is null;
update public.properties set dpe_class = 'B' where slug = 'lelodge' and dpe_class is null;

update public.properties set surface_total_m2 = 365 where slug = 'lavilla' and surface_total_m2 is null;
update public.properties set surface_total_m2 = 458 where slug = 'lelodge' and surface_total_m2 is null;
update public.properties set surface_total_m2 = 298 where slug = 'leloft' and surface_total_m2 is null;

update public.properties set equipment = '{"pool":"outdoor_heated","pool_size":"12×5 m","sauna":true,"sauna_seats":5,"gym":true,"cinema":false,"game_room":true,"pool_house":false,"vegetable_garden":true,"volleyball":true,"terraces":true,"bbq":true,"garden_m2":1950}'::jsonb
where slug = 'lavilla' and equipment = '{}'::jsonb;
update public.properties set equipment = '{"pool":"outdoor","sauna":true,"gym":true,"cinema":true,"game_room":false,"pool_house":true,"vegetable_garden":true,"volleyball":false,"terraces":true,"bbq":true,"garden_m2":1500}'::jsonb
where slug = 'lelodge' and equipment = '{}'::jsonb;
update public.properties set equipment = '{"pool":"indoor","sauna":true,"gym":true,"cinema":false,"game_room":false,"pool_house":false,"vegetable_garden":false,"volleyball":false,"terraces":true,"bbq":false}'::jsonb
where slug = 'leloft' and equipment = '{}'::jsonb;

update public.properties set
  setting_clause_fr = 'Le logement objet du présent contrat est situé dans une maison individuelle s''inscrivant dans un cadre paysager d''environ 2 000 m² attaché à l''immeuble, comprenant un parc arboré et des espaces extérieurs aménagés. Le locataire a l''usage, dans les conditions prévues au règlement intérieur annexé, des parties communes intérieures et extérieures de la maison.',
  setting_clause_en = 'The accommodation covered by this contract is located in a detached house set in landscaped grounds of approximately 2,000 m² attached to the building, comprising a wooded park and landscaped outdoor areas. The tenant has the use, under the conditions set out in the house rules appended hereto, of the indoor and outdoor common areas of the house.'
where slug = 'lavilla' and setting_clause_fr is null;
update public.properties set
  setting_clause_fr = 'Le logement objet du présent contrat est situé dans une maison individuelle s''inscrivant dans un cadre paysager d''environ 1 500 m² attaché à l''immeuble, comprenant un parc arboré et des espaces extérieurs aménagés. Le locataire a l''usage, dans les conditions prévues au règlement intérieur annexé, des parties communes intérieures et extérieures de la maison.',
  setting_clause_en = 'The accommodation covered by this contract is located in a detached house set in landscaped grounds of approximately 1,500 m² attached to the building, comprising a wooded park and landscaped outdoor areas. The tenant has the use, under the conditions set out in the house rules appended hereto, of the indoor and outdoor common areas of the house.'
where slug = 'lelodge' and setting_clause_fr is null;
update public.properties set
  setting_clause_fr = 'Le logement objet du présent contrat est situé dans une maison individuelle disposant d''espaces extérieurs aménagés. Le locataire a l''usage, dans les conditions prévues au règlement intérieur annexé, des parties communes intérieures et extérieures de la maison.',
  setting_clause_en = 'The accommodation covered by this contract is located in a detached house with landscaped outdoor areas. The tenant has the use, under the conditions set out in the house rules appended hereto, of the indoor and outdoor common areas of the house.'
where slug = 'leloft' and setting_clause_fr is null;

-- ---------------------------------------------------------------------------------------------------------------
-- 4. rooms : volume, grille Bloc A (import au lot 4), loyer justifié. surface_m2 reste la surface contractuelle (chambre + salle d'eau).
-- ---------------------------------------------------------------------------------------------------------------
alter table public.rooms
  add column if not exists volume_m3 numeric,
  add column if not exists bloc_a jsonb,
  add column if not exists justified_rent_eur numeric;
comment on column public.rooms.bloc_a is 'Grille TARIFS 2026 de la chambre (scores, € par critère, surface chambre seule, base, complément justifié, exposé, solidité) — import lot 4 ; jamais un montant au bail.';
comment on column public.rooms.surface_m2 is 'Surface contractuelle de la chambre, salle d''eau privative comprise (validée chambre par chambre le 26/10/2026) ; source du bail, des frais et du site.';

-- ---------------------------------------------------------------------------------------------------------------
-- 5. tenants : échéance de l'attestation d'assurance (D5). Les colonnes rent_eur, charges_forfait_eur, previous_tenant_*
--    existent déjà (vides) et seront remplies par le générateur v3 (Q5). current_rent reste le total charges comprises.
-- ---------------------------------------------------------------------------------------------------------------
alter table public.tenants add column if not exists insurance_expiry date;
comment on column public.tenants.insurance_expiry is 'Fin de validité de l''attestation d''assurance habitation (MRH) ; rappel J-30 dans le dashboard.';
comment on column public.tenants.rent_eur is 'Loyer HORS charges du bail v3 (EUR). NULL pour les fiches créées par le générateur v2.';
comment on column public.tenants.charges_forfait_eur is 'Forfait de charges récupérables du bail v3 (EUR/mois), figé à la génération.';
comment on column public.tenants.current_rent is 'Total mensuel charges comprises (EUR) = rent_eur + charges_forfait_eur pour un bail v3. Lu par la compta (payments attendus) : ne pas changer de sens.';

-- ---------------------------------------------------------------------------------------------------------------
-- 6. leases : photographie complète du bail v3 (les colonnes v2 restent ; rent_eur = total charges comprises)
-- ---------------------------------------------------------------------------------------------------------------
alter table public.leases
  add column if not exists lease_version text not null default 'v2',
  add column if not exists rent_hc_eur numeric,
  add column if not exists irl_quarter text,
  add column if not exists irl_value numeric,
  add column if not exists previous_rent_hc_eur numeric,
  add column if not exists previous_rent_paid_on date,
  add column if not exists previous_rent_last_revision_on date,
  add column if not exists previous_tenant_departure_on date,
  add column if not exists relocation_cap_hc_eur numeric,
  add column if not exists relocation_exception text,
  add column if not exists exposed_premium_eur numeric,
  add column if not exists relocation_override_reason text,
  add column if not exists entry_fee_eur numeric,
  add column if not exists entity_snapshot jsonb,
  add column if not exists services_catalog_version text,
  add column if not exists exchange_rate_date date,
  add column if not exists lease_duration_months integer;

do $$ begin
  alter table public.leases add constraint leases_lease_version_check check (lease_version in ('v2', 'v3'));
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.leases add constraint leases_relocation_exception_check
    check (relocation_exception is null or relocation_exception in ('first_letting', 'vacancy_18m', 'works', 'undervalued'));
exception when duplicate_object then null; end $$;

comment on column public.leases.rent_eur is 'Total mensuel charges comprises (EUR). Bail v3 : = rent_hc_eur + charges_forfait_eur.';
comment on column public.leases.rent_chf is 'Montant CHF du générateur v2 (1 380 par défaut sur l''import du 24/02/2026). Un bail v3 n''écrit jamais de CHF : NULL.';
comment on column public.leases.exchange_rate is 'Taux 1 EUR = X CHF utilisé pour l''indication CHF (v3) ; les 27 baux importés le 24/02/2026 portent l''inverse (EUR par CHF, > 1).';
comment on column public.leases.lease_version is 'v2 = générateur historique ; v3 = template bi-entité (26/10/2026).';
comment on column public.leases.relocation_cap_hc_eur is 'Plafond de relocation = HC du précédent locataire × (1 + IRL), NULL si exception ou première location.';
comment on column public.leases.exposed_premium_eur is 'max(0, HC retenu − plafond) : ce que coûte une dérogation (relocation_override_reason obligatoire si > 0).';
comment on column public.leases.entity_snapshot is 'Bloc bailleur tel qu''imprimé (entities + entity_legal au moment de la génération).';

-- ---------------------------------------------------------------------------------------------------------------
-- 7. Charges récupérables saisies à la main, par maison et par exercice (décision du 26/10/2026 : pas de moteur)
-- ---------------------------------------------------------------------------------------------------------------
create table if not exists public.property_charges (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  fiscal_year integer not null,
  method text not null default 'manual_closing',
  status text not null default 'provisoire',
  total_recoverable_eur numeric not null default 0,
  room_count integer not null,
  per_room_month_eur numeric generated always as (round(total_recoverable_eur / room_count / 12, 2)) stored,
  effective_from date not null,
  validated_at timestamptz,
  validated_by text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_charges_method_check check (method in ('provisional_2025_plus_10', 'manual_closing')),
  constraint property_charges_status_check check (status in ('provisoire', 'valide')),
  constraint property_charges_total_check check (total_recoverable_eur >= 0),
  constraint property_charges_room_count_check check (room_count > 0),
  constraint property_charges_property_year_key unique (property_id, fiscal_year)
);
comment on table public.property_charges is 'Charges récupérables d''une maison pour un exercice (saisie manuelle depuis la clôture du cabinet) ; forfait par chambre et par mois = total ÷ chambres ÷ 12 (D8, D9).';

create table if not exists public.property_charges_lines (
  id uuid primary key default gen_random_uuid(),
  property_charges_id uuid not null references public.property_charges(id) on delete cascade,
  poste_code text not null,
  label text not null,
  amount_eur numeric not null default 0,
  recoverable_pct numeric not null default 100,
  recoverable_eur numeric generated always as (round(amount_eur * recoverable_pct / 100, 2)) stored,
  source text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint property_charges_lines_amount_check check (amount_eur >= 0),
  constraint property_charges_lines_pct_check check (recoverable_pct between 0 and 100)
);
comment on table public.property_charges_lines is 'Lignes de l''état récapitulatif des charges (art. 5.2) : poste du décret 87-713 (référentiel src/data/chargePostes.ts), montant annuel, % récupérable, source.';

alter table public.property_charges enable row level security;
alter table public.property_charges_lines enable row level security;
do $$ begin
  create policy property_charges_admin_all on public.property_charges for all using (is_admin()) with check (is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy property_charges_service_all on public.property_charges for all using (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy property_charges_lines_admin_all on public.property_charges_lines for all using (is_admin()) with check (is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy property_charges_lines_service_all on public.property_charges_lines for all using (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;

-- Seed D12-bis : exercice 2026 provisoire = réel 2025 + 10 % (La Villa 41 312 €, Le Lodge 48 372 €, Le Loft 29 883 €).
insert into public.property_charges (property_id, fiscal_year, method, status, total_recoverable_eur, room_count, effective_from, notes)
select p.id, 2026, 'provisional_2025_plus_10', 'provisoire', v.total, p.room_count, date '2026-10-26',
       'Forfait provisoire D12-bis (note du 26/10/2026) : réel 2025 récupérable + 10 %, en attendant la clôture 2026 saisie en février 2027.'
from public.properties p
join (values ('lavilla', 41312::numeric), ('lelodge', 48372::numeric), ('leloft', 29883::numeric)) as v(slug, total) on v.slug = p.slug
where not exists (select 1 from public.property_charges pc where pc.property_id = p.id and pc.fiscal_year = 2026);

insert into public.property_charges_lines (property_charges_id, poste_code, label, amount_eur, recoverable_pct, source, sort_order)
select pc.id, 'projection_2025_plus_10', 'Projection : charges récupérables réelles 2025 + 10 % (D12-bis)', pc.total_recoverable_eur, 100,
       'Master_Pricing_LaVilla.xlsx, onglet Tarifs Q42026 (26/10/2026)', 0
from public.property_charges pc
where pc.fiscal_year = 2026 and pc.method = 'provisional_2025_plus_10'
  and not exists (select 1 from public.property_charges_lines l where l.property_charges_id = pc.id);

-- Forfait courant par maison : la ligne la plus récente (effective_from ≤ aujourd'hui) ; dès qu'un exercice validé
-- existe pour la maison, les lignes provisoires ne comptent plus.
create or replace view public.v_property_current_charges
with (security_invoker = true) as
select distinct on (pc.property_id)
  pc.property_id, p.slug as house_slug, pc.id as property_charges_id, pc.fiscal_year, pc.method, pc.status,
  pc.total_recoverable_eur, pc.room_count, pc.per_room_month_eur, pc.effective_from, pc.validated_at
from public.property_charges pc
join public.properties p on p.id = pc.property_id
where pc.effective_from <= current_date
  and (pc.status = 'valide'
       or not exists (select 1 from public.property_charges v
                       where v.property_id = pc.property_id and v.status = 'valide' and v.effective_from <= current_date))
order by pc.property_id, pc.effective_from desc, pc.fiscal_year desc;
comment on view public.v_property_current_charges is 'Forfait de charges courant par maison (lu par le générateur v3 et l''onglet Maisons).';

-- ---------------------------------------------------------------------------------------------------------------
-- 8. Annexe A (catalogue des prestations par maison) et registre des prestations (art. 9.4)
-- ---------------------------------------------------------------------------------------------------------------
create table if not exists public.services_catalog (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  service text not null,
  frequency text,
  provider text,
  evidence text,
  vat_criterion text,
  active_from date not null default current_date,
  active_to date,
  version text not null default '2026-10',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.services_catalog is 'Annexe A du bail v3 : prestations incluses par maison (fréquence, exécutant, preuve, critère TVA 261 D). active_from/active_to = validité ; version = libellé imprimé au bail.';

create table if not exists public.service_log (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  logged_on date not null default current_date,
  service text not null,
  provider text,
  evidence_url text,
  participants integer,
  notes text,
  entered_by text,
  created_at timestamptz not null default now()
);
comment on table public.service_log is 'Registre des prestations réalisées (art. 9.4), saisi par Fanny puis par l''animateur ; export trimestriel = annexe B.';

alter table public.services_catalog enable row level security;
alter table public.service_log enable row level security;
do $$ begin
  create policy services_catalog_admin_all on public.services_catalog for all using (is_admin()) with check (is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy services_catalog_service_all on public.services_catalog for all using (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy services_catalog_authenticated_read on public.services_catalog for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy service_log_admin_all on public.service_log for all using (is_admin()) with check (is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy service_log_service_all on public.service_log for all using (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;

-- Seed du catalogue (version 2026-10) depuis l'art. II du contrat actuel, sans option de ménage de chambre ni renouvellement
-- du linge (D1, Q2) ; identique pour les trois maisons, ajustable dans l'onglet Maisons.
insert into public.services_catalog (property_id, service, frequency, provider, evidence, vat_criterion, active_from, sort_order)
select p.id, s.service, s.frequency, s.provider, s.evidence, s.vat_criterion, s.active_from, s.sort_order
from public.properties p
cross join (values
  ('Ménage des parties communes intérieures (passage léger et passage approfondi)', '3 fois par semaine', 'Prestataire de nettoyage', 'Factures du prestataire, registre', 'nettoyage_locaux', date '2026-10-26', 1),
  ('Entretien des extérieurs : piscine, jardin, élagage', 'Hebdomadaire en saison, mensuel hors saison', 'Pisciniste et jardinier', 'Factures des prestataires', null, date '2026-10-26', 2),
  ('Fournitures de base livrées à la maison (papier toilette, essuie-tout, lessive, produits d''entretien)', 'Mensuel', 'La Villa Coliving', 'Bons de livraison, factures', null, date '2026-10-26', 3),
  ('Box pour dîner communautaire', 'Mensuel', 'La Villa Coliving', 'Factures, registre', null, date '2026-10-26', 4),
  ('Événements communautaires (soirée mensuelle, événements inter-maisons)', 'Mensuel', 'Fanny Piot et Jérôme Austin', 'Registre des prestations', null, date '2026-10-26', 5),
  ('Cours de yoga', 'Mensuel', 'Intervenant extérieur', 'Registre des prestations', null, date '2026-10-26', 6),
  ('Coaching sportif (remise en forme)', 'Mensuel', 'Intervenant extérieur', 'Registre des prestations', null, date '2026-10-26', 7),
  ('Assistance par WhatsApp, réponse sous 48 h', 'Continu', 'Fanny Piot et Jérôme Austin', 'Journal des tickets', null, date '2026-10-26', 8),
  ('Comité d''accueil : rencontre et sélection des nouveaux colocataires', 'À chaque départ', 'Résidents et Fanny Piot', 'Registre des prestations', null, date '2026-10-26', 9),
  ('Kit linge (parure de lit et serviette) mis à disposition à l''entrée, restitué à la sortie, jamais renouvelé', 'À l''entrée', 'La Villa Coliving', 'État des lieux (Etadly)', 'linge_sans_renouvellement', date '2026-10-26', 10),
  ('Animateur de communauté (prestataire indépendant)', 'Hebdomadaire', 'Prestataire à désigner', 'Registre des prestations', null, date '2027-07-01', 11)
) as s(service, frequency, provider, evidence, vat_criterion, active_from, sort_order)
where p.is_coliving = true
  and not exists (select 1 from public.services_catalog sc where sc.property_id = p.id and sc.service = s.service);
