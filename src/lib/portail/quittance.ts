/**
 * Portail locataire — règles de la quittance de loyer et du bouton « Voir mon bail » (lot « portail » du bail v3,
 * 10/11/2026). Fonctions pures, sans import : la page Mon bail les appelle, tools/test/portail-quittance.test.mjs
 * les vérifie.
 *
 * Deux générations de fiches locataire cohabitent :
 *  - bail v3 : la fiche porte le loyer hors charges (tenants.rent_eur) et le forfait de charges
 *    (tenants.charges_forfait_eur) ; le bailleur est l'entité juridique de la maison (entities) ;
 *  - baux antérieurs : la fiche n'a pas ces deux montants ; la quittance garde son calcul d'origine (charges de la
 *    fiche maison, bailleur « La Villa Coliving »), inchangé tant que Jérôme n'a pas tranché le rattrapage.
 */

const r2 = (n: number) => Math.round(n * 100) / 100;

export interface QuittanceFiche {
  rent_eur: number | null | undefined;             // loyer hors charges du bail v3
  charges_forfait_eur: number | null | undefined;  // forfait de charges du bail v3
  move_in_date: string | null | undefined;         // AAAA-MM-JJ
}

/** La fiche vient-elle d'un bail v3 (loyer hors charges et forfait renseignés) ? */
export function isV3Fiche(f: QuittanceFiche): boolean {
  return Number(f.rent_eur) > 0 && f.charges_forfait_eur != null && Number(f.charges_forfait_eur) >= 0;
}

export interface QuittanceSplit {
  rent: number;      // loyer hors charges
  charges: number;   // charges
  basis: "bail_v3" | "fiche_maison";
}

/**
 * Répartition d'une somme reçue entre loyer et charges.
 * Bail v3 : dans les proportions du bail (loyer hors charges / forfait). La même règle couvre le mois complet, le
 * prorata d'entrée ou de sortie, la remise du premier mois (consentie « sur le loyer et le forfait ») et les mois
 * d'avant ou d'après une révision annuelle (loyer et forfait sont révisés ensemble). Pour le mois d'entrée, quand la
 * somme reçue est exactement le prorata en trentièmes du bail, la quittance reprend ses deux montants au centime.
 * Baux antérieurs : calcul d'origine — charges de la fiche maison, loyer = reçu − charges (jamais négatif).
 */
export function quittanceSplit(o: { received: number; month: string; fiche: QuittanceFiche; propertyCharges: number }): QuittanceSplit {
  const received = Number(o.received) || 0;
  if (!isV3Fiche(o.fiche)) {
    const charges = Number(o.propertyCharges) || 0;
    return { rent: Math.max(0, received - charges), charges, basis: "fiche_maison" };
  }
  const hc = Number(o.fiche.rent_eur);
  const forfait = Number(o.fiche.charges_forfait_eur);
  let charges = r2(received * forfait / (hc + forfait));
  const moveIn = o.fiche.move_in_date || "";
  if (moveIn.slice(0, 7) === o.month) {
    const day = Number(moveIn.slice(8, 10));
    if (day > 1) {
      const days = 30 - day + 1;
      const prorataHc = r2(hc * days / 30);
      const prorataForfait = r2(forfait * days / 30);
      if (Math.abs(received - (prorataHc + prorataForfait)) <= 0.011) charges = prorataForfait;
    }
  }
  return { rent: r2(received - charges), charges, basis: "bail_v3" };
}

export interface LessorSource {
  is_coliving: boolean;
  legal_entity_name: string | null | undefined;   // properties.legal_entity_name (baux antérieurs)
  siege_social: string | null | undefined;        // properties.siege_social
  siret: string | null | undefined;               // properties.siret
  property_address: string | null | undefined;
  /** Entité juridique de la maison (entities), lue par le portail ; nulle si elle n'a pas d'identité juridique. */
  entity?: { legal_name: string | null; legal_form: string | null; trade_name: string | null; registration: string | null; siege: string | null } | null;
}

export interface QuittanceLessor {
  name: string;                 // nom imprimé du bailleur
  designation: string;          // dans une phrase : « la SCI Sleep In », « l'Indivision Austin-Piot »
  address: string;
  siret: string;                // baux antérieurs : « SIRET : … »
  registration: string | null;  // bail v3 : immatriculation telle qu'au bail
  brand: string;                // enseigne (« La Villa Coliving ») : adresse du locataire et pied de page
}

/** Bailleur imprimé sur la quittance : l'entité juridique pour un bail v3, le libellé d'origine sinon. */
export function quittanceLessor(src: LessorSource, v3: boolean): QuittanceLessor {
  const brand = src.entity?.trade_name || "La Villa Coliving";
  if (v3 && src.entity?.legal_name) {
    const name = src.entity.legal_name;
    const bare = name.replace(/^(SCI|Indivision)\s+/i, "");
    const designation = src.entity.legal_form === "sci" ? `la SCI ${bare}` : src.entity.legal_form === "indivision" ? `l'Indivision ${bare}` : name;
    return { name, designation, address: src.entity.siege || src.siege_social || src.property_address || "", siret: "", registration: src.entity.registration || null, brand };
  }
  const isSleepIn = (src.legal_entity_name || "").toLowerCase().includes("sleep in");
  const name = src.is_coliving ? "La Villa Coliving" : (src.legal_entity_name || "La Villa Coliving");
  const base = src.siege_social || src.property_address || "";
  return { name, designation: name, address: isSleepIn ? "Sleep In SCI — " + base : base, siret: src.siret || "", registration: null, brand: name };
}

export interface TenantDocLike { type: string | null; label: string | null; file_url: string | null; uploaded_at: string | null }
export interface StorageFileLike { name: string; updated_at: string | null }

/**
 * Le bail à ouvrir depuis « Voir mon bail » : le document de type « bail » le plus récent de la fiche (le générateur
 * v3 l'enregistre), sinon le fichier « Bail… » le plus récent du dossier du locataire (baux antérieurs).
 * La table des baux n'est pas lisible par un locataire : on ne la consulte pas.
 */
export function findLeaseDocument(tenantId: string, docs: TenantDocLike[], files: StorageFileLike[]): { path: string; label: string } | null {
  const fromDocs = docs.filter((d) => d.type === "bail" && d.file_url)
    .sort((a, b) => (b.uploaded_at || "").localeCompare(a.uploaded_at || ""))[0];
  if (fromDocs) return { path: fromDocs.file_url as string, label: fromDocs.label || "Bail" };
  const fromFiles = files.filter((f) => /^bail/i.test(f.name) && /\.pdf$/i.test(f.name))
    .sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""))[0];
  return fromFiles ? { path: `tenants/${tenantId}/${fromFiles.name}`, label: fromFiles.name } : null;
}

/** Où télécharger un document : « tenant-files/… » désigne l'autre dossier de fichiers, tout le reste « operations ». */
export function documentLocation(fileUrl: string): { bucket: "operations" | "tenant-files"; path: string } {
  return fileUrl.startsWith("tenant-files/")
    ? { bucket: "tenant-files", path: fileUrl.slice("tenant-files/".length) }
    : { bucket: "operations", path: fileUrl };
}

/** Fichiers du dossier du locataire qui ne sont pas déjà listés comme documents (évite un bail affiché deux fois). */
export function filesNotInDocuments<F extends StorageFileLike>(tenantId: string, docs: TenantDocLike[], files: F[]): F[] {
  const known = new Set(docs.map((d) => d.file_url).filter(Boolean));
  return files.filter((f) => !known.has(`tenants/${tenantId}/${f.name}`));
}

/** Parmi plusieurs fiches actives au même e-mail (doublons), celle du portail : une vraie chambre, la plus récente. */
export function pickTenantFiche<T extends { room_number: number | string | null; move_in_date: string | null }>(rows: T[]): T | null {
  if (!rows.length) return null;
  const real = rows.filter((r) => Number(r.room_number) > 0);
  const pool = real.length ? real : rows;
  return pool.slice().sort((a, b) => (b.move_in_date || "").localeCompare(a.move_in_date || ""))[0];
}

/**
 * Lignes d'une adresse postale, sans le pays : « 34 rue du Foron – 74100 Ville-la-Grand – France » →
 * [« 34 rue du Foron », « 74100 Ville-la-Grand »]. Ne coupe que sur une virgule ou un tiret entouré d'espaces :
 * jamais dans « Ville-la-Grand » ni « Mont-Blanc » (l'ancien découpage de la quittance imprimait « 74100 Ville / la »).
 */
export function addressLines(addr: string | null | undefined): string[] {
  return String(addr || "")
    .split(/\s+[\u2013\u2014-]\s+|\s*,\s*/)
    .map((part) => part.trim())
    .filter((part) => part && !/^france$/i.test(part));
}
