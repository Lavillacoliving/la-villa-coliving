// Règle UNIQUE de résolution des charges — à utiliser partout où l'on ventile
// un loyer en « loyer nu + charges » : quittances, fiches locataires, portail.
//
// Deux régimes coexistent en base depuis la migration 2026-09-01 :
//  - LEGACY : baux signés avant le 01/09/2026 — trois postes (énergie /
//    maintenance / services). Colonnes nommées *_chf mais montants en EUR
//    (dette de schéma historique). Override locataire possible, sinon valeur
//    de la propriété.
//  - FORFAIT : baux 2026-09 — un forfait unique de charges récupérables
//    (décret 87-713), snapshoté sur le locataire à la signature.
//
// Le régime est décidé par le LOCATAIRE (son bail), jamais par la propriété :
// une maison passée au forfait ne doit PAS rebasculer ses locataires legacy.
// Sans contexte locataire (affichage maison), le forfait propriété fait foi.

export interface ChargesSource {
  charges_forfait_eur?: number | null;
  charges_energy_chf?: number | null;
  charges_maintenance_chf?: number | null;
  charges_services_chf?: number | null;
}

export interface ChargesResolues {
  /** Total mensuel des charges, en EUR. */
  total: number;
  /** true = trio historique ; false = forfait unique 2026-09. */
  isLegacy: boolean;
}

export function resolveCharges(
  tenant?: ChargesSource | null,
  property?: ChargesSource | null
): ChargesResolues {
  const forfaitTenant = tenant?.charges_forfait_eur;
  if (forfaitTenant !== null && forfaitTenant !== undefined) {
    return { total: Number(forfaitTenant), isLegacy: false };
  }

  // Pas de locataire : contexte maison — le forfait propriété s'applique s'il existe.
  if (!tenant) {
    const forfaitProp = property?.charges_forfait_eur;
    if (forfaitProp !== null && forfaitProp !== undefined) {
      return { total: Number(forfaitProp), isLegacy: false };
    }
  }

  const poste = (t?: number | null, p?: number | null) => Number(t ?? p ?? 0);
  return {
    total:
      poste(tenant?.charges_energy_chf, property?.charges_energy_chf) +
      poste(tenant?.charges_maintenance_chf, property?.charges_maintenance_chf) +
      poste(tenant?.charges_services_chf, property?.charges_services_chf),
    isLegacy: true,
  };
}
