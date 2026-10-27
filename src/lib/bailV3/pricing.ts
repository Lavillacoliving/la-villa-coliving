/**
 * Calculs purs du bail v3 (décisions du 26/10/2026) : loyer hors charges cible = palier − forfait ; plafond de relocation
 * en zone tendue = dernier loyer HC × (1 + IRL) sauf exception ; HC retenu = min(cible, plafond) sauf dérogation motivée ;
 * dépôt = 2 × HC ; frais de dossier et d'état des lieux = surface × (10 + 3) € ; prorata du mois d'entrée en trentièmes.
 */
import type { RelocationException } from "./types";

export interface PricingInput {
  totalCc: number;            // palier charges comprises (rooms.rent_eur)
  forfait: number;            // forfait de charges courant de la maison (EUR/mois)
  prevHc: number | null;      // dernier loyer HC du précédent locataire (NULL = première location)
  prevDepartureIso?: string | null;
  irlNew: number;
  irlOld: number;
  zoneTendue: boolean;
  exception?: RelocationException | null;
  override?: boolean;         // dérogation : appliquer le loyer cible malgré le plafond (motif obligatoire, audit)
  surfaceM2: number;
  feeDossierM2?: number;      // 10 € par défaut
  feeEdlM2?: number;          // 3 € par défaut
  startIso: string;
  eurChf: number;             // 1 EUR = X CHF (indicatif)
  depositMonths?: number;     // 2 par défaut (plafond meublé)
}

export interface Pricing {
  hcTarget: number;
  cap: number | null;
  capApplies: boolean;        // zone tendue, précédent locataire parti depuis moins de 18 mois, pas d'exception
  capped: boolean;            // le plafond est inférieur à la cible
  hc: number;
  total: number;
  exposedPremium: number;     // ce que coûte la dérogation par mois (0 si pas de dérogation)
  deposit: number;
  feeDossier: number;
  feeEdl: number;
  fees: number;
  prorataDays: number | null; // trentièmes du mois d'entrée (NULL si entrée le 1er)
  prorataHc: number;
  prorataForfait: number;
  prorataTotal: number;
  chfHc: number;
  chfTotal: number;
}

const r0 = (n: number) => Math.round(n);
const r2 = (n: number) => Math.round(n * 100) / 100;

export function monthsBetween(aIso: string, bIso: string): number {
  const [ay, am] = aIso.split("-").map(Number);
  const [by, bm] = bIso.split("-").map(Number);
  return (by - ay) * 12 + (bm - am);
}

export function computePricing(i: PricingInput): Pricing {
  const hcTarget = i.totalCc - i.forfait;
  const vacancyOk = !i.prevDepartureIso || monthsBetween(i.prevDepartureIso, i.startIso) < 18;
  const capApplies = i.zoneTendue && i.prevHc != null && i.prevHc > 0 && !i.exception && vacancyOk;
  const cap = capApplies ? r0((i.prevHc as number) * (i.irlNew / i.irlOld)) : null;
  const capped = cap != null && cap < hcTarget;
  const hc = capped && !i.override ? (cap as number) : hcTarget;
  const exposedPremium = capped && i.override ? hcTarget - (cap as number) : 0;
  const total = hc + i.forfait;
  const deposit = (i.depositMonths ?? 2) * hc;
  const feeDossier = r2(i.surfaceM2 * (i.feeDossierM2 ?? 10));
  const feeEdl = r2(i.surfaceM2 * (i.feeEdlM2 ?? 3));
  const day = Number(i.startIso.slice(8, 10));
  const prorataDays = day > 1 ? 30 - day + 1 : null;
  const prorataHc = prorataDays ? r2(hc * prorataDays / 30) : 0;
  const prorataForfait = prorataDays ? r2(i.forfait * prorataDays / 30) : 0;
  return {
    hcTarget, cap, capApplies, capped, hc, total, exposedPremium, deposit,
    feeDossier, feeEdl, fees: r0(feeDossier + feeEdl),
    prorataDays, prorataHc, prorataForfait, prorataTotal: r2(prorataHc + prorataForfait),
    chfHc: r0(hc * i.eurChf), chfTotal: r0(total * i.eurChf),
  };
}
