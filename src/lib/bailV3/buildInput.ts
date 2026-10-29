/**
 * Passerelle base → bail v3 : transforme les lignes Supabase (properties, rooms, entities, entity_legal, leases)
 * en entrées du moteur de clauses (LeaseV3Input). Aucune requête ici : le générateur charge, ce module traduit.
 */
import type { LeaseV3Entity, LeaseV3Property, LeaseV3Room } from "./clauses";
import type { EntityLegalRow, EntityRow, PropertyEquipment, Signatory } from "./types";

/** Colonnes de properties lues par le générateur v3 (lot 1 + lot 3). */
export interface PropertyV3Row {
  id: string; slug: string | null; name: string; address: string; city: string | null; room_count: number;
  common_areas: string[] | null; entity_id: string | null; is_coliving: boolean;
  dpe_class: string | null; surface_total_m2: number | null; equipment: PropertyEquipment | null;
  setting_clause_fr: string | null; zone_tendue: boolean | null; relocation_exception_default: string | null;
  buildings_fr?: string[] | null; buildings_intro_fr?: string | null;
}
/** Colonnes de rooms lues par le générateur v3. */
export interface RoomV3Row {
  id: string; property_id: string; name: string; room_number: number; surface_m2: number; floor: string | null;
  location_detail: string | null; bathroom_type: string | null; bathroom_detail: string | null;
  has_parking: boolean | null; has_balcony: boolean | null; has_terrace: boolean | null;
  rent_eur: number | null; rent_chf: number | null; bloc_a?: { summary?: string } | null;
}
/** Colonnes de leases utiles au « dernier loyer du précédent locataire ». */
export interface LeaseFactsRow {
  lease_version: string | null; status: string | null; start_date: string | null; end_date: string | null;
  rent_eur: number | null; rent_hc_eur: number | null; charges_forfait_eur: number | null;
  charges_energy_chf: number | null; charges_maintenance_chf: number | null; charges_services_chf: number | null;
}

/** « 1 rue des Marronniers - 74100 Ambilly - France » → « 1 rue des Marronniers, 74100 Ambilly ». */
export function leaseAddress(raw: string): string {
  return raw.split(/\s+[-–]\s+/).map((s) => s.trim()).filter((s) => s && !/^france$/i.test(s)).join(", ");
}

/** « Un hall d'entrée » → « hall d'entrée » (liste des parties communes, article II 2.3). */
export function normalizeCommonArea(label: string): string {
  const s = label.trim().replace(/^(une?|des|les?|la|l')\s+/i, "").replace(/^l'/i, "");
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** Équipements de loisirs cités à l'article V (« piscine extérieure chauffée, sauna, salle de sport, salle de jeux »). */
export function leisureEquipmentText(eq: PropertyEquipment | null | undefined): string {
  if (!eq) return "équipements collectifs";
  const parts: string[] = [];
  if (eq.pool === "outdoor_heated") parts.push("piscine extérieure chauffée");
  else if (eq.pool === "outdoor") parts.push("piscine extérieure");
  else if (eq.pool === "indoor") parts.push("piscine intérieure");
  if (eq.sauna) parts.push("sauna");
  if (eq.gym) parts.push("salle de sport");
  if (eq.cinema) parts.push("home cinéma");
  if (eq.game_room) parts.push("salle de jeux");
  return parts.length ? parts.join(", ") : "équipements collectifs";
}

/**
 * Équipements de la salle d'eau (article II 2.2) — règle de Jérôme du 28/10/2026 : WC seulement au Loft 7 et dans les
 * salles d'eau partagées de La Villa (chambres 3-4 et 7-8) ; partout ailleurs « douche, lavabo ».
 * À remplacer par une colonne rooms.bathroom_fixtures au lot 4 (import des fiches chambres).
 */
export function bathroomFixtures(houseSlug: string | null | undefined, roomNumber: number): string {
  const withWc: Record<string, number[]> = { lavilla: [3, 4, 7, 8], leloft: [7], lelodge: [] };
  return (withWc[houseSlug || ""] || []).includes(roomNumber) ? "douche, lavabo, WC" : "douche, lavabo";
}

/** « Étage 1 » → « premier étage », « Rez-de-chaussée » → « rez-de-chaussée ». */
export function floorLabel(floor: string | null | undefined): string {
  if (!floor) return "[étage]";
  const m = floor.match(/(\d+)/);
  const ordinals = ["rez-de-chaussée", "premier étage", "deuxième étage", "troisième étage", "quatrième étage"];
  if (/rez/i.test(floor)) return "rez-de-chaussée";
  if (m && Number(m[1]) < ordinals.length) return ordinals[Number(m[1])];
  return floor.charAt(0).toLowerCase() + floor.slice(1);
}

export interface EntityOptions {
  /** SCI : index du gérant signataire dans entity_legal.signatories. */
  signatoryIndex?: number;
  /** Indivision : un seul indivisaire signe au nom des deux (mandat d'administration du 28/10/2026). */
  soleSignatory?: { index: number; mandate_from: number; mandate_date: string | null } | null;
  domicile?: string | null;
}

export function entityToLease(e: EntityRow, legal: EntityLegalRow | null, opts: EntityOptions = {}): LeaseV3Entity {
  const signatories: Signatory[] = (legal?.signatories || []).slice().sort((a, b) => a.order - b.order);
  const legalForm = e.legal_form || "autre";
  return {
    legal_form: legalForm,
    legal_name: e.legal_name || e.name,
    trade_name: e.trade_name || "La Villa Coliving",
    registration: e.registration || (e.siren ? `SIREN ${e.siren}` : "[immatriculation]"),
    capital_eur: e.capital_eur,
    siege: e.siege || "[siège]",
    vat_mention: e.vat_mention,
    signatories: signatories.length ? signatories : [{ name: "[signataire]", quality: legalForm === "sci" ? "gérant" : "indivisaire", order: 1 }],
    signatory_index: opts.signatoryIndex ?? Math.max(0, signatories.findIndex((s) => s.default)),
    sole_signatory: legalForm === "indivision" ? (opts.soleSignatory ?? undefined) : undefined,
    account_holder: e.bank_account || e.legal_name || e.name,
    bank: "Banque Palatine",
    iban: e.iban || "[IBAN]",
    bic: e.bic || "[BIC]",
    domicile: opts.domicile ?? undefined,
  };
}

export function propertyToLease(p: PropertyV3Row): LeaseV3Property {
  const eq = p.equipment || null;
  return {
    name: p.name,
    address: leaseAddress(p.address),
    commune: p.city || leaseAddress(p.address).split(",").pop()?.replace(/^\s*\d{5}\s*/, "").trim() || "[commune]",
    building_kind: p.slug === "leloft" ? "Maison de ville" : "Maison individuelle",
    buildings: p.buildings_fr && p.buildings_fr.length ? p.buildings_fr : null,
    buildings_intro: p.buildings_intro_fr || null,
    surface_total_m2: p.surface_total_m2,
    room_count: p.room_count,
    garden_m2: eq?.garden_m2 ?? null,
    setting_clause_fr: p.setting_clause_fr,
    common_areas: (p.common_areas || []).map(normalizeCommonArea),
    leisure_equipment: leisureEquipmentText(eq),
    dpe_class: p.dpe_class,
  };
}

export function roomToLease(r: RoomV3Row, houseSlug: string | null | undefined): LeaseV3Room {
  return {
    name: r.name,
    number: r.room_number,
    floor: floorLabel(r.floor),
    surface_m2: Number(r.surface_m2),
    bathroom: r.bathroom_type === "shared" ? "shared" : "private",
    bathroom_detail: bathroomFixtures(houseSlug, r.room_number),
    has_terrace: !!r.has_terrace,
    has_balcony: !!r.has_balcony,
    has_parking: !!r.has_parking,
    location_detail: r.location_detail,
    bloc_a_text: r.bloc_a?.summary || null,
  };
}

/** Loyer hors charges d'un bail : v3 = rent_hc_eur ; v2 = loyer EUR − forfait EUR (les colonnes *_chf des baux v2 contiennent des euros). */
export function leaseRentHc(l: LeaseFactsRow): number | null {
  if (l.rent_hc_eur != null) return Number(l.rent_hc_eur);
  if (l.rent_eur == null) return null;
  const forfait = l.charges_forfait_eur != null
    ? Number(l.charges_forfait_eur)
    : Number(l.charges_energy_chf || 0) + Number(l.charges_maintenance_chf || 0) + Number(l.charges_services_chf || 0);
  return Math.round(Number(l.rent_eur) - forfait);
}

export interface PreviousLeaseFacts { prev_hc: number | null; prev_paid_on: string | null; prev_revision: string | null; prev_departure: string | null; source: string | null }

/** Dernier bail de la chambre (hors annulés), pour l'encadré 2.6 : proposé au générateur, modifiable par Jérôme. */
export function previousLeaseFacts(leases: LeaseFactsRow[], todayIso: string): PreviousLeaseFacts {
  const usable = leases.filter((l) => l.status !== 'cancelled' && l.start_date).sort((a, b) => (b.start_date! > a.start_date! ? 1 : -1));
  const last = usable[0];
  if (!last) return { prev_hc: null, prev_paid_on: null, prev_revision: null, prev_departure: null, source: null };
  const hc = leaseRentHc(last);
  const departure = last.end_date && last.end_date < todayIso ? last.end_date : null;
  // dernier loyer payé : le 5 du dernier mois d'occupation connu (modifiable)
  const refMonth = (departure || todayIso).slice(0, 7);
  const olderThanAYear = last.start_date! < new Date(new Date(todayIso).getTime() - 365 * 86400000).toISOString().slice(0, 10);
  return {
    prev_hc: hc,
    prev_paid_on: `${refMonth}-05`,
    prev_revision: olderThanAYear ? "[révision à préciser]" : `aucune (bail du ${fDateFr(last.start_date!)})`,
    prev_departure: departure,
    source: `bail du ${fDateFr(last.start_date!)}${last.lease_version ? ` (${last.lease_version})` : ""}`,
  };
}

function fDateFr(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  return `${d === 1 ? "1er" : d} ${months[m - 1]} ${y}`;
}
