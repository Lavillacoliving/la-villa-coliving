/**
 * Types des tables ajoutées par le lot 1 du bail v3 (scripts/migration-bail-v3-lot1-2026-10-26.sql).
 * Les interfaces reprennent les colonnes telles qu'elles existent en base ; aucune logique ici.
 */
export type LegalForm = 'indivision' | 'sci' | 'autre';
export type RelocationException = 'first_letting' | 'vacancy_18m' | 'works' | 'undervalued';
export type DpeClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface EntityRow {
  id: string;
  code: string;
  name: string;
  bank_account: string | null;
  iban: string | null;
  bic: string | null;
  siren: string | null;
  legal_form: LegalForm | null;
  legal_name: string | null;
  trade_name: string | null;
  registration: string | null;
  capital_eur: number | null;
  siege: string | null;
  vat_mention: string;
}

export interface Signatory {
  name: string;
  quality: string;
  order: number;
  default?: boolean;
}

export interface Mandate {
  mandatary: string;
  since: string;
  scope: string;
  account?: string;
}

export interface EntityLegalRow {
  id: string;
  entity_id: string;
  signatories: Signatory[];
  mandate: Mandate | null;
  updated_at: string;
}

export type PoolType = 'none' | 'outdoor' | 'outdoor_heated' | 'indoor';

export interface PropertyEquipment {
  pool?: PoolType;
  pool_size?: string;
  sauna?: boolean;
  sauna_seats?: number;
  gym?: boolean;
  cinema?: boolean;
  game_room?: boolean;
  pool_house?: boolean;
  vegetable_garden?: boolean;
  volleyball?: boolean;
  terraces?: boolean;
  bbq?: boolean;
  garden_m2?: number;
}

export interface PropertyChargesRow {
  id: string;
  property_id: string;
  fiscal_year: number;
  method: 'provisional_2025_plus_10' | 'manual_closing';
  status: 'provisoire' | 'valide';
  total_recoverable_eur: number;
  room_count: number;
  per_room_month_eur: number;
  effective_from: string;
  validated_at: string | null;
  validated_by: string | null;
  notes: string | null;
}

export interface PropertyChargesLineRow {
  id: string;
  property_charges_id: string;
  poste_code: string;
  label: string;
  amount_eur: number;
  recoverable_pct: number;
  recoverable_eur: number;
  source: string | null;
  sort_order: number;
}

/** Ligne de la vue v_property_current_charges : forfait courant d'une maison. */
export interface CurrentChargesRow {
  property_id: string;
  house_slug: string;
  property_charges_id: string;
  fiscal_year: number;
  method: PropertyChargesRow['method'];
  status: PropertyChargesRow['status'];
  total_recoverable_eur: number;
  room_count: number;
  per_room_month_eur: number;
  effective_from: string;
  validated_at: string | null;
}

export interface ServiceCatalogRow {
  id: string;
  property_id: string;
  service: string;
  frequency: string | null;
  provider: string | null;
  evidence: string | null;
  vat_criterion: string | null;
  active_from: string;
  active_to: string | null;
  version: string;
  sort_order: number;
}

export interface ServiceLogRow {
  id: string;
  property_id: string;
  logged_on: string;
  service: string;
  provider: string | null;
  evidence_url: string | null;
  participants: number | null;
  notes: string | null;
  entered_by: string | null;
}
