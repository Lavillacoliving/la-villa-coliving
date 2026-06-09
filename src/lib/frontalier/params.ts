// Paramètres datés des outils frontalier (spec doc 3, §0).
// Principe : la LOGIQUE est stable, seuls ces ~chiffres changent chaque année.
// Source de vérité runtime = table Supabase `frontalier_params` (lue par useFrontalierParams) ;
// ces DEFAULT_PARAMS servent de FALLBACK (et permettent le prérendu / le fonctionnement
// avant que la table soit alimentée).
//
// ⚠️ VALEURS 2025 INDICATIVES — À CONFIRMER / SOURCER PAR JÉRÔME AVANT MISE EN LIGNE.
//    Elles alimentent une recommandation chiffrée : ne pas publier sans validation.

export interface FrontalierParams {
  year: number;
  /** Taux de la cotisation maladie subsidiaire (PUMa) sur l'assiette. Ex : 0.08 */
  cmu_taux: number;
  /** Abattement annuel appliqué au RFR avant cotisation (€). Ex : 25 % du PASS. */
  cmu_abattement: number;
  /** Prime LaMal mensuelle adulte (26+), canton Genève (CHF/mois). */
  lamal_prime_adulte_geneve: number;
  /** Prime LaMal mensuelle jeune adulte (19-25 ans), Genève (CHF/mois). */
  lamal_prime_jeune_adulte: number;
  /** Prime LaMal mensuelle enfant (0-18 ans), Genève (CHF/mois). */
  lamal_prime_enfant_geneve: number;
  /** Taux de conversion : 1 CHF = X € (daté). */
  chf_eur: number;
  /** Sources officielles + date, affichées sous le résultat. */
  sources: { label: string; url: string }[];
}

export const DEFAULT_PARAMS: FrontalierParams = {
  year: 2025,
  cmu_taux: 0.08,
  cmu_abattement: 11775, // 25 % du PASS 2025 (47 100 €)
  lamal_prime_adulte_geneve: 540, // CHF/mois — PLACEHOLDER à confirmer (OFSP/priminfo Genève)
  lamal_prime_jeune_adulte: 470, // CHF/mois — PLACEHOLDER
  lamal_prime_enfant_geneve: 140, // CHF/mois — PLACEHOLDER
  chf_eur: 1.05, // 1 CHF ≈ 1,05 € — PLACEHOLDER à dater
  sources: [
    { label: "Cotisation PUMa / maladie frontalier (URSSAF)", url: "https://www.urssaf.fr/" },
    { label: "PASS (plafond annuel sécurité sociale)", url: "https://www.urssaf.fr/" },
    { label: "Primes LaMal Genève (OFSP / priminfo)", url: "https://www.priminfo.admin.ch/" },
    { label: "Taux de change CHF/EUR (BCE)", url: "https://www.ecb.europa.eu/" },
  ],
};

/** Les clés que Jérôme doit confirmer/sourcer chaque automne (pour la table + ce fallback). */
export const PARAMS_TO_CONFIRM: (keyof FrontalierParams)[] = [
  "cmu_taux",
  "cmu_abattement",
  "lamal_prime_adulte_geneve",
  "lamal_prime_jeune_adulte",
  "lamal_prime_enfant_geneve",
  "chf_eur",
];
