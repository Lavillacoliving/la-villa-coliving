/**
 * Référentiel des postes de charges récupérables (décret n° 87-713 du 26 août 1987) utilisé par la saisie manuelle
 * des charges par maison et par exercice (lot 2 du bail v3) et par l'état récapitulatif de l'art. 5.2.
 *
 * Décisions du 26/10/2026 : piscine et internet sont dans le loyer, hors forfait (D2) → 0 % ; chaudière = entretien
 * courant seulement (90 %) ; consommables à 100 % du poste (D11) ; la TEOM se saisit depuis l'avis de taxe foncière
 * (2026 : La Villa 685 €, Le Lodge 451 €, Le Loft 528 €) ; les frais de gestion assis sur la TEOM restent à 0 % tant
 * que le comptable ne les a pas confirmés.
 */
export interface ChargePoste {
  code: string;
  label: string;
  decretRef: string;
  defaultPct: number;
  hint?: string;
}

export const CHARGE_POSTES: readonly ChargePoste[] = [
  { code: 'eau', label: 'Eau froide et chaude (résidents et communs)', decretRef: 'Décret 87-713, I', defaultPct: 100 },
  { code: 'energie', label: 'Énergie : chauffage, eau chaude, électricité des communs', decretRef: 'Décret 87-713, I et II', defaultPct: 100, hint: 'Gaz de Bordeaux (gaz et électricité) depuis mars 2026' },
  { code: 'proprete_communs', label: 'Propreté des parties communes (prestataire de nettoyage)', decretRef: 'Décret 87-713, VI', defaultPct: 100 },
  { code: 'espaces_verts', label: 'Entretien courant des espaces verts', decretRef: 'Décret 87-713, V', defaultPct: 100, hint: 'Plantations et aménagements = bailleur' },
  { code: 'consommables', label: 'Produits et consommables des parties communes', decretRef: 'Décret 87-713, VI', defaultPct: 100 },
  { code: 'chaudiere_entretien', label: 'Entretien de la chaudière (contrat)', decretRef: 'Décret 87-713, II', defaultPct: 90, hint: 'Remplacement = bailleur' },
  { code: 'teom', label: "Taxe d'enlèvement des ordures ménagères (TEOM)", decretRef: 'Décret 87-713, VIII', defaultPct: 100, hint: 'Avis de taxe foncière, colonne « Taxe ordures ménagères »' },
  { code: 'teom_frais_gestion', label: 'Frais de gestion assis sur la TEOM (8 %)', decretRef: 'À confirmer avec le comptable', defaultPct: 0 },
  { code: 'assainissement', label: "Redevance d'assainissement", decretRef: 'Décret 87-713, VIII', defaultPct: 100 },
  { code: 'taxe_balayage', label: 'Taxe de balayage', decretRef: 'Décret 87-713, VIII', defaultPct: 100 },
  { code: 'desinsectisation', label: 'Désinsectisation, désinfection', decretRef: 'Décret 87-713, VI', defaultPct: 100 },
  { code: 'piscine_exploitation', label: 'Exploitation de la piscine (pisciniste, produits, pompe)', decretRef: 'Hors forfait (D2 : dans le loyer)', defaultPct: 0 },
  { code: 'internet', label: 'Internet et abonnements', decretRef: 'Hors forfait (D2 : dans le loyer)', defaultPct: 0 },
  { code: 'projection_2025_plus_10', label: 'Projection : charges récupérables réelles 2025 + 10 % (D12-bis)', decretRef: 'Forfait provisoire 2026', defaultPct: 100 },
  { code: 'autre', label: 'Autre poste récupérable (préciser)', decretRef: 'Décret 87-713', defaultPct: 100 },
] as const;

export function chargePosteLabel(code: string): string {
  return CHARGE_POSTES.find((p) => p.code === code)?.label ?? code;
}
