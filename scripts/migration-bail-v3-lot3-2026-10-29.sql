-- =================================================================================================================
-- Bail v3 — lot 3 (29/10/2026) : générateur v3. Migration additive et idempotente, à appliquer APRÈS le lot 1.
--   1. properties : tènement de plusieurs bâtiments (Le Lodge, Le Loft) — article II 2.1 du bail
--   2. entity_legal : mandat d'administration entre indivisaires (Fanny Piot → Jérôme Austin, 28/10/2026) : un seul signataire
--   3. services_catalog : annexe A alignée sur le texte validé (relectures des 28-29/10/2026), version 2026-10
--   4. create_lease_v3(jsonb) : écritures du générateur en une transaction (ancien locataire désactivé, tenants, leases)
-- Retour arrière : scripts/migration-bail-v3-lot3-2026-10-29-rollback.sql
-- =================================================================================================================

-- ---------------------------------------------------------------------------------------------------------------
-- 1. Bâtiments du tènement (puces de l'article II 2.1) ; vide = « Maison individuelle à usage d'habitation sise … »
-- ---------------------------------------------------------------------------------------------------------------
-- Tènement de plusieurs bâtiments (Le Lodge ; Jérôme 28/10/2026) : liste rendue en puces dans l'article II, 2.1 ; vide = phrase générique.
alter table public.properties
  add column if not exists buildings_fr jsonb not null default '[]'::jsonb,
  add column if not exists buildings_en jsonb not null default '[]'::jsonb;
comment on column public.properties.buildings_fr is 'Bail v3, article II 2.1 : bâtiments du tènement (puces) ; vide = « Maison individuelle à usage d''habitation sise … ».';
alter table public.properties
  add column if not exists buildings_intro_fr text,
  add column if not exists buildings_intro_en text;
comment on column public.properties.buildings_intro_fr is 'Bail v3, article II 2.1 : phrase qui introduit la liste des bâtiments ; null = « Tènement immobilier sis …, constitué de N bâtiments distincts : ».';
-- Le Loft (relecture Jérôme 29/10/2026) : maison de ville de 298 m² en deux bâtiments (238 m² habitables + annexe de 60 m²), 234 m² d'extérieurs et terrasses.
update public.properties set
  buildings_intro_fr = 'Maison de ville à usage d''habitation sise 1 rue des Marronniers, 74100 Ambilly, d''une surface totale de 298 m² répartie sur deux bâtiments :',
  buildings_intro_en = 'Townhouse for residential use at 1 rue des Marronniers, 74100 Ambilly, with a total area of 298 m² spread over two buildings:',
  buildings_fr = '["le bâtiment principal, d''une surface habitable de 238 m², comprenant 7 chambres louées séparément et des parties communes ;", "le bâtiment annexe, d''une surface de 60 m², comprenant une salle de sport, une salle TV, un sauna et une piscine intérieure."]'::jsonb,
  buildings_en = '["the main building, with a habitable area of 238 m², comprising 7 rooms let separately and common areas;", "the annex building, 60 m², comprising a gym, a TV room, a sauna and an indoor pool."]'::jsonb
where slug = 'leloft' and buildings_fr = '[]'::jsonb;
update public.properties set
  buildings_fr = '["une maison individuelle à usage d''habitation d''une surface habitable totale de 380 m², comprenant 12 chambres louées séparément et des parties communes, complétée par un grenier de 100 m² ;", "une maison de piscine aménagée, avec cuisine et salle à manger, de 26 m² ;", "un « chalet fitness » de 65 m², comprenant une salle de sport et un sauna ;", "une réserve de 18 m²."]'::jsonb,
  buildings_en = '["a detached house for residential use with a total habitable area of 380 m², comprising 12 rooms let separately and common areas, plus a 100 m² attic;", "a converted pool house with kitchen and dining room, 26 m²;", "a 65 m² \"fitness chalet\" with gym and sauna;", "an 18 m² storage room."]'::jsonb
where slug = 'lelodge' and buildings_fr = '[]'::jsonb;

-- ---------------------------------------------------------------------------------------------------------------
-- 2. Indivision Austin-Piot : mandat d'administration entre indivisaires (art. 815-3 C. civ.) signé le 28/10/2026.
--    Le générateur lit entity_legal.mandate : scope contenant « indivis » → le mandataire signe seul, au nom des deux.
-- ---------------------------------------------------------------------------------------------------------------
update public.entity_legal
set mandate = jsonb_build_object(
  'mandatary', 'Jérôme Austin',
  'since', '2026-10-28',
  'scope', 'Mandat d''administration entre indivisaires (article 815-3 du Code civil) : baux, congés, loyers, dépôts, états des lieux, contrats de prestations — signé le 28 octobre 2026 par Fanny Piot'
), updated_at = now()
where entity_id = 'c882e0ab-306b-490a-88cb-30578f3715fa' and mandate is null;

-- ---------------------------------------------------------------------------------------------------------------
-- 3. Annexe A validée (version 2026-10) : les lignes du seed initial qui ne figurent plus sont fermées au 28/10/2026,
--    la liste validée est insérée (une ligne par maison coliving).
-- ---------------------------------------------------------------------------------------------------------------
update public.services_catalog set active_to = date '2026-10-28'
where version = '2026-10' and active_to is null and active_from < date '2026-10-29'
  and service not in (
    'Entretien et nettoyage des parties communes intérieures (cuisines, salle à manger, salons, buanderie, sanitaires communs, circulations)',
    'Entretien des extérieurs : jardin, piscine, élagage', 'Sauna, salle de sport, électroménager, chaudière : maintenance et dépannage',
    'Consommables des parties communes (papier toilette, essuie-tout, lessive, produits d''entretien)', 'Connectivité : fibre très haut débit, Wi-Fi dans toute la maison',
    'Animation communautaire : au moins un événement par mois', 'Cours de yoga', 'Coaching sportif (remise en forme)',
    'Assistance et dépannage : canal WhatsApp dédié, réponse sous 48 h ouvrées, organisation des interventions',
    'Gestion de la communauté : comité d''accueil, plateforme numérique (états des lieux, règlement, calendrier), sélection participative des nouveaux colocataires',
    'Kit linge : parure de lit et serviette mises à disposition à l''entrée, restituées à la sortie, jamais renouvelées ni blanchies',
    'Exclus : nettoyage des chambres et salles d''eau privatives (même en option), renouvellement et blanchissage du linge, petit déjeuner et restauration, permanence d''accueil');
insert into public.services_catalog (property_id, service, frequency, provider, evidence, vat_criterion, active_from, version, sort_order)
select p.id, s.service, s.frequency, s.provider, s.evidence, null, date '2026-10-29', '2026-10', s.sort_order
from public.properties p
cross join (values
  ('Entretien et nettoyage des parties communes intérieures (cuisines, salle à manger, salons, buanderie, sanitaires communs, circulations)', '3 interventions par semaine, jours fixes', 'Entreprise de propreté (contrat annuel)', 'Contrat, factures mensuelles', 1),
  ('Entretien des extérieurs : jardin, piscine, élagage', 'Jardin : passages réguliers en saison, élagage annuel ; piscine : entretien en saison, analyse de l''eau, hivernage', 'Jardinier, pisciniste (contrats)', 'Contrats, factures', 2),
  ('Sauna, salle de sport, électroménager, chaudière : maintenance et dépannage', 'Maintenance préventive annuelle, dépannage', 'Prestataires spécialisés', 'Contrats, factures', 3),
  ('Consommables des parties communes (papier toilette, essuie-tout, lessive, produits d''entretien)', 'Panier mensuel, réassort à la demande', 'Bailleur (achats)', 'Factures, bon de livraison', 4),
  ('Connectivité : fibre très haut débit, Wi-Fi dans toute la maison', 'Continu', 'Opérateur', 'Contrat, factures', 5),
  ('Animation communautaire : au moins un événement par mois', 'Mensuel', 'Bailleur, fournisseurs', 'Factures', 6),
  ('Cours de yoga', 'Mensuel, sur place', 'Intervenant indépendant (contrat de prestation)', 'Contrat, factures', 7),
  ('Coaching sportif (remise en forme)', 'Mensuel', 'Intervenant indépendant', 'Contrat, factures', 8),
  ('Assistance et dépannage : canal WhatsApp dédié, réponse sous 48 h ouvrées, organisation des interventions', 'Continu', 'Bailleur', 'Journal horodaté des demandes', 9),
  ('Gestion de la communauté : comité d''accueil, plateforme numérique (états des lieux, règlement, calendrier), sélection participative des nouveaux colocataires', 'À chaque départ et en continu', 'Bailleur et résidents', 'Comptes rendus, historique de la plateforme', 10),
  ('Kit linge : parure de lit et serviette mises à disposition à l''entrée, restituées à la sortie, jamais renouvelées ni blanchies', 'À l''entrée', 'Bailleur', 'État des lieux d''entrée (Etadly)', 11),
  ('Exclus : nettoyage des chambres et salles d''eau privatives (même en option), renouvellement et blanchissage du linge, petit déjeuner et restauration, permanence d''accueil', '—', '—', 'Liste négative à l''article IX, 9.3', 12)
) as s(service, frequency, provider, evidence, sort_order)
where p.is_coliving = true
  and not exists (select 1 from public.services_catalog sc where sc.property_id = p.id and sc.service = s.service and sc.active_to is null);

-- ---------------------------------------------------------------------------------------------------------------
-- 4. create_lease_v3 : une transaction pour l'ancien locataire (désactivé), le nouveau locataire et la fiche du bail.
--    Appelée par le générateur (supabase.rpc) ; admin seulement ; le PDF et tenant_documents suivent côté client.
-- ---------------------------------------------------------------------------------------------------------------
create or replace function public.create_lease_v3(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
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
$$;
-- Checklist §12 (2ter) : SECURITY DEFINER → jamais exécutable par anon (clé publique du site) ; dashboard connecté + service_role.
revoke all on function public.create_lease_v3(jsonb) from public, anon;
grant execute on function public.create_lease_v3(jsonb) to authenticated, service_role;
comment on function public.create_lease_v3(jsonb) is 'Bail v3 (lot 3) : crée le locataire et la fiche du bail en une transaction, désactive l''ancien locataire si fourni. Admin seulement.';
