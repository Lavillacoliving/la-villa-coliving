/**
 * Justification du prix — source unique (Lot L4 « Justification du prix, version courte », brief v3.1 du 09/10/2026, décision D8
 * de Jérôme : textes A.3 et A.4 validés, « 37 à 42 m² de surface de vie par colocataire » retiré de A.3 tant que les surfaces du
 * Loft et du Lodge ne sont pas fixées, tableau 12 mois refusé — D9).
 *
 * Module PUR (zéro React, imports relatifs : chargé par esbuild dans scripts/lib/load-entity-facts.mjs pour la garde CI et les tests).
 * Trois surfaces consomment le MÊME texte, au caractère près :
 *   - la FAQ A.3 (`priceJustificationFaq`) : remplace l'ancienne question « Pourquoi les prix sont-ils plus élevés qu'une colocation
 *     classique ? » dans src/data/faq/tarifsFaq.ts (index 1 → /tarifs et /chambres-disponibles via tarifsFaq.slice(0, 2)) et
 *     src/data/faqData.ts (`why-higher-prices` → /faq) ; ajoutée à colivingFaq (/le-coliving), colocationGeneveFaq (/colocation-geneve)
 *     et chambreGeneveFaq (/chambre-a-louer-geneve) — toutes dans le FAQPage JSON-LD existant de chaque page (FaqSection emitSchema) ;
 *   - la phrase-clé A.4 (`PRICE_KEY_SENTENCE`) : puce de la fiche entité (src/data/entityFacts.ts, donc ~50 pages) et chapeau du
 *     bloc tarifs de /tarifs (RatesPageV4) ;
 *   - la garde scripts/check-entity-facts.mjs : A.3 exactement 1× (question + réponse) sur PRICE_FAQ_ROUTES FR/EN, 0× ailleurs ;
 *     A.4 2× sur /tarifs (chapeau + fiche), 1× sur les autres pages de la fiche.
 *
 * Règles : chaque nombre vient de stats.ts (jamais en dur) ; aucun concurrent nommé (les « résidences de coliving » restent anonymes,
 * repères MARKET_COMPARISON publiés sur /tarifs) ; CHF et € jamais dans la même phrase (deux phrases, comme answerSlots.ts — D0-ter) ;
 * la fourchette « 1 370 à 1 430 CHF » est autorisée ici comme dans le bloc « Où chercher » (D0 d) ; FR tutoiement, EN « you » ;
 * chaînes plates (un nœud texte par phrase, anti-#418) ; aucune minute, aucune date.
 */
import type { QAPair } from "../lib/structuredData";
import {
  STATS,
  MARKET_COMPARISON,
  PRICE_SHARED_FR_NUM,
  PRICE_SHARED_CHF_EN,
  PRICE_CHF_FR,
  PRICE_EN_NUM,
  EUR_SHARED_FR_NUM,
  EUR_STANDARD_FR_NUM,
  EUR_SHARED_EN_NUM,
  EUR_STANDARD_EN_NUM,
} from "./stats";

export type PriceLang = "fr" | "en";

/** Bump à chaque changement de texte (sert aux docs et aux PR ; la garde compare les chaînes elles-mêmes). */
export const PRICE_FACTS_VERSION = "2026-10-10";

/** Pages qui portent la FAQ A.3 (FR + jumelle /en) — exactement une fois chacune ; 0 ailleurs. */
export const PRICE_FAQ_ROUTES = [
  "/tarifs",
  "/faq",
  "/le-coliving",
  "/colocation-geneve",
  "/chambre-a-louer-geneve",
  "/chambres-disponibles", // tarifsFaq.slice(0, 2) : la question prix y est affichée depuis le Lot L2 chambres
] as const;

/** Page dont le chapeau du bloc tarifs reprend la phrase-clé A.4 (en plus de la fiche entité). */
export const PRICE_KEY_SENTENCE_ROUTE = "/tarifs";

const WORDS: Record<PriceLang, Record<number, string>> = {
  fr: { 1: "une", 2: "deux", 3: "trois", 4: "quatre", 5: "cinq" },
  en: { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five" },
};
const word = (n: number, lang: PriceLang): string => WORDS[lang][n] ?? String(n);

/** « trois fois par semaine » / « three times a week » depuis STATS.cleaningPerWeek. */
export function timesPerWeek(lang: PriceLang): string {
  const n: number = STATS.cleaningPerWeek;
  if (lang === "en") return n === 1 ? "once a week" : n === 2 ? "twice a week" : `${word(n, "en")} times a week`;
  return `${n === 1 ? "une" : word(n, "fr")} fois par semaine`;
}

/** « un mois de préavis » / « one month's notice » depuis STATS.noticePeriodMonths. */
function noticeLabel(lang: PriceLang): string {
  const n: number = STATS.noticePeriodMonths;
  if (lang === "en") return n === 1 ? "one month's notice" : `${word(n, "en")} months' notice`;
  return n === 1 ? "un mois de préavis" : `${word(n, "fr")} mois de préavis`;
}

const M = MARKET_COMPARISON;

/** A.3 — la FAQ de justification du prix (D8), FR puis EN. */
export function priceJustificationFaq(lang: PriceLang): QAPair {
  if (lang === "en") {
    return {
      q: "Why does La Villa cost more than a coliving residence or a standard flatshare?",
      a:
        "Because you are not buying the same thing. " +
        `In a coliving residence, the rent pays for a studio in a building of up to ${M.megaColivingMaxRooms} rooms, with under ${M.megaColivingCommonM2PerResident} m² of shared space per resident; in a standard flatshare, a ${M.classicRoomM2.min} to ${M.classicRoomM2.max} m² room with bills on top. ` +
        `At La Villa, ${PRICE_SHARED_CHF_EN} to ${PRICE_EN_NUM} a month pays for a ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² room in a house of ${STATS.minResidentsPerHouse} to ${STATS.maxResidentsPerHouse} people, a pool, a sauna and a gym in the house, cleaning of the shared areas ${timesPerWeek("en")}, fibre, streaming and yoga classes. ` +
        `The contractual rent is €${EUR_SHARED_EN_NUM} to ${EUR_STANDARD_EN_NUM} a month, with €0 in application or agency fees. ` +
        `Over ${STATS.leaseDurationMonths} months, part of the gap comes back through what you do not pay for separately: gym, variable bills, subscriptions, move-in fees. ` +
        `And the ${STATS.leaseDurationMonths}-month lease can be ended with ${noticeLabel("en")}.`,
    };
  }
  return {
    q: "Pourquoi La Villa coûte-t-elle plus cher qu'une résidence de coliving ou qu'une colocation classique ?",
    a:
      "Parce que tu n'achètes pas la même chose. " +
      `Dans une résidence de coliving, le loyer paie un studio dans un immeuble qui peut compter jusqu'à ${M.megaColivingMaxRooms} chambres, avec moins de ${M.megaColivingCommonM2PerResident} m² d'espaces communs par résident ; dans une colocation classique, une chambre de ${M.classicRoomM2.min} à ${M.classicRoomM2.max} m² et des charges à part. ` +
      `Chez La Villa, ${PRICE_SHARED_FR_NUM} à ${PRICE_CHF_FR} par mois paient une chambre de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m² dans une maison de ${STATS.minResidentsPerHouse} à ${STATS.maxResidentsPerHouse} personnes, une piscine, un sauna et une salle de sport dans la maison, le ménage des espaces communs ${timesPerWeek("fr")}, la fibre, le streaming et les cours de yoga. ` +
      `Le loyer contractuel est de ${EUR_SHARED_FR_NUM} à ${EUR_STANDARD_FR_NUM} € par mois, avec 0 € de frais de dossier ou d'agence. ` +
      `Sur ${STATS.leaseDurationMonths} mois, une partie de l'écart revient par ce qui n'est pas à payer à côté : salle de sport, charges variables, abonnements, frais d'entrée. ` +
      `Et le bail de ${STATS.leaseDurationMonths} mois se quitte avec ${noticeLabel("fr")}.`,
  };
}

/** A.4 — la phrase-clé (D8). Texte arrêté par Jérôme le 09/10/2026 ; « Pour moins qu'un studio à Genève » est la seule comparaison
 *  de prix avec Genève autorisée (le positionnement reste le confort et l'espace : jamais « moins cher que Genève » ailleurs). */
export const PRICE_KEY_SENTENCE: Readonly<Record<PriceLang, string>> = {
  fr: `Pour moins qu'un studio à Genève, une chambre de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m² dans une maison avec piscine, sauna, salle de sport, ménage ${timesPerWeek("fr")} et 0 € de frais de dossier.`,
  en: `For less than a studio in Geneva, a ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² room in a house with a pool, a sauna, a gym, cleaning ${timesPerWeek("en")} and €0 in application fees.`,
};

/** Toutes les chaînes canoniques rendues (question, réponse, phrase-clé) — pour la garde et les tests. */
export function priceFactsStrings(lang: PriceLang): string[] {
  const faq = priceJustificationFaq(lang);
  return [faq.q, faq.a, PRICE_KEY_SENTENCE[lang]];
}

const sentencesOf = (s: string): string[] => s.split(/(?<=[.!?])\s+/).filter(Boolean);

/** Incohérences internes détectables sans base ni HTML (vide = OK). */
export function priceFactsIssues(): string[] {
  const issues: string[] = [];
  const langs: PriceLang[] = ["fr", "en"];
  for (const lang of langs) {
    const faq = priceJustificationFaq(lang);
    for (const [where, s] of [["q", faq.q], ["a", faq.a], ["key", PRICE_KEY_SENTENCE[lang]]] as const) {
      const tag = `${lang}.${where}`;
      if (/\{\{|\[FAIT À CONFIRMER|\[À VÉRIFIER/.test(s)) issues.push(`${tag} : placeholder`);
      if (/<[a-z]/i.test(s)) issues.push(`${tag} : balise HTML dans une chaîne canonique`);
      if (/\b\d{1,3}\s?(?:min|minutes?)\b/i.test(s)) issues.push(`${tag} : une minute de trajet n'a rien à faire dans la justification du prix`);
      if (lang === "fr" && /\b(vous|votre|vos)\b/i.test(s)) issues.push(`${tag} : vouvoiement`);
      if (/37\s?(?:à|-|–|to)\s?42/.test(s)) issues.push(`${tag} : « 37 à 42 m² » retiré de A.3/A.4 (D8)`);
      for (const sentence of sentencesOf(s)) {
        if (/CHF/.test(sentence) && /€/.test(sentence)) issues.push(`${tag} : CHF et € dans la même phrase — « ${sentence.slice(0, 60)}… »`);
      }
    }
    if (!faq.a.includes(String(M.megaColivingMaxRooms))) issues.push(`${lang}.a : repère ${M.megaColivingMaxRooms} chambres absent`);
    if (!faq.a.includes(`${STATS.roomSizeMin} ${lang === "en" ? "to" : "à"} ${STATS.roomSizeMax} m²`)) issues.push(`${lang}.a : surface des chambres absente`);
    if (!faq.a.includes(lang === "en" ? "€0" : "0 €")) issues.push(`${lang}.a : « 0 € de frais » absent`);
    if (!/La Villa/.test(faq.q) || !/La Villa/.test(faq.a)) issues.push(`${lang} : la marque doit être nommée dans la question et la réponse`);
  }
  if (sentencesOf(priceJustificationFaq("fr").a).length !== sentencesOf(priceJustificationFaq("en").a).length) issues.push("A.3 : nombre de phrases FR ≠ EN");
  return issues;
}
