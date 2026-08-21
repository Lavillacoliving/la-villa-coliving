// Configuration du mining Search Console (tools/mining-gsc.mjs).
// Brief n°2 — Chantier 1 (21/08/2026). Zéro dépendance.
// Aucune donnée GSC ici : seulement la watchlist, les seuils et les correspondances pays.
import { SITE } from './config.mjs';

export { SITE };

/** Requêtes « money » suivies dans chaque rapport (section 5), déjà normalisées (minuscules). */
export const WATCHLIST = [
  'coliving geneve',
  'coliving geneva',
  'coliving genève',
  'colocation geneve',
  'colocation genève',
  'coliving annemasse',
  'la villa coliving',
  'colocation annemasse',
  'chambre à louer annemasse',
  'chambre a louer annemasse',
  'room for rent geneva',
  'chambre a louer geneve',
  'colocation geneve les mieux notés',
  'meilleur coliving geneve',
  'coliving geneve avis',
  'la villa coliving avis',
];

/** Requêtes de marque (exclues de la courbe CTR et du striking distance). Surchargeable par --brand. */
export const BRAND_RE_DEFAULT = /la ?villa|lavilla|villa coliving/i;

/** Libellés pays des filtres d'export UI (EN/FR) → segment. Tout autre libellé → 'global'. */
export const COUNTRY_LABEL_TO_SEGMENT = {
  france: 'fr',
  switzerland: 'ch',
  suisse: 'ch',
};

/** Codes pays ISO alpha-3 (sonde API, minuscules) → groupe. Tout autre code → 'autres'. */
export const COUNTRY_ISO_TO_SEGMENT = {
  fra: 'fr',
  che: 'ch',
};

/** Libellés humains des segments. */
export const SEGMENT_LABELS = {
  global: 'Global (tous pays)',
  fr: 'France',
  ch: 'Suisse',
  frch: 'France + Suisse (pondéré)',
  autres: 'Autres pays',
};

/** Seuils par défaut (tous surchargeables en CLI quand un drapeau existe). */
export const DEFAULTS = {
  minImpr: 20,            // striking distance : impressions minimales (--min-impr)
  posMin: 4,              // striking distance : position minimale (--pos-min)
  posMax: 15,             // striking distance : position maximale (--pos-max)
  minImprNoclick: 30,     // impressions sans clic : impressions minimales (--min-impr-noclick)
  minImprPage: 50,        // pages sous la courbe : impressions minimales
  underCurveRatio: 0.6,   // page « sous la courbe » si CTR < 0,6 × attendu
  segmentMinImpr: 2000,   // segment < 2 000 impressions → courbe globale réutilisée
  curveMinImpr: 100,      // bucket fiable si I ≥ 100 …
  curveMinRows: 3,        // … et n ≥ 3 lignes
  curveMinBuckets: 3,     // courbe propre retenue si ≥ 3 buckets observés, sinon courbe globale réutilisée
  topN: 50,               // striking distance : top 50
  period: 'latest',       // mode comparaison : 'latest' | 'previous'
};
