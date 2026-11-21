/**
 * Désignation du logement pour le bail d'un logement entier (générateur de bail v2 : aperçu HTML et PDF).
 *
 * (20/11/2026, décision de Jérôme : « Oui, tout le bloc ») Le texte du bloc « Consistance du logement » — localisation, étage,
 * surface et composition, cadastre, lots, identifiant fiscal, équipements accessoires — ne vit plus dans le code : il est lu en
 * base, dans `properties.lease_designation` (jsonb, lisible par l'équipe et par les locataires du bien seulement, jamais par le
 * site public). Le code ne garde que les titres génériques A, B et C du bail. Sans désignation en base, le bail affiche un
 * repère « à compléter » au lieu d'un texte faux.
 */
export interface LeaseDesignation {
  /** Paragraphes de « A. Consistance du logement », dans l'ordre (localisation, surface et composition, cadastre…). */
  consistance: string[];
  /** Puces sous la consistance (lots de copropriété, identifiant fiscal du logement…). */
  lots: string[];
  /** Paragraphes de « C. Désignation des locaux et équipements accessoires… » (parking…). */
  accessoires: string[];
}

const textes = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];

/** Lit la valeur brute de `properties.lease_designation` ; `null` si elle manque ou ne porte aucun texte. */
export function readLeaseDesignation(raw: unknown): LeaseDesignation | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const d: LeaseDesignation = { consistance: textes(o.consistance), lots: textes(o.lots), accessoires: textes(o.accessoires) };
  return d.consistance.length || d.lots.length || d.accessoires.length ? d : null;
}

/** Repères affichés quand la fiche du bien ne porte pas (encore) la désignation. */
export const LEASE_DESIGNATION_MISSING = {
  consistance: "Désignation du logement à compléter dans la fiche du bien",
  accessoires: "Équipements accessoires à compléter dans la fiche du bien",
} as const;

const echapper = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const repere = (s: string): string => `<span style="color:#c0392b;font-style:italic">[${s}]</span>`;

/** Bloc A-B-C de l'aperçu HTML du bail v2 (logement entier). */
export function leaseDesignationHtml(d: LeaseDesignation | null): string {
  const consistance = d?.consistance.length
    ? d.consistance.map((t) => `<p>${echapper(t)}</p>`).join("\n          ")
    : `<p>${repere(LEASE_DESIGNATION_MISSING.consistance)}</p>`;
  const lots = d?.lots.length
    ? `\n          <ul>\n            ${d.lots.map((t) => `<li>${echapper(t)}</li>`).join("\n            ")}\n          </ul>`
    : "";
  const accessoires = d?.accessoires.length
    ? d.accessoires.map((t) => `<p>${echapper(t)}</p>`).join("\n          ")
    : `<p>${repere(LEASE_DESIGNATION_MISSING.accessoires)}</p>`;
  return [
    "<h3>A. Consistance du logement</h3>",
    `          ${consistance}${lots}`,
    "          <h3>B. Destination des locaux : usage d'habitation</h3>",
    "          <h3>C. Désignation des locaux et équipements accessoires de l'immeuble à usage privatif du locataire :</h3>",
    `          ${accessoires}`,
  ].join("\n");
}
