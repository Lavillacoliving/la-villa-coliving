/**
 * Justification du prix — source unique (Lot L4 « Justification du prix, version courte », brief v3.1 du 09/10/2026, décision D8
 * de Jérôme : textes A.3 et A.4 validés, « 37 à 42 m² de surface de vie par colocataire » retiré de A.3 tant que les surfaces du
 * Loft et du Lodge ne sont pas fixées, tableau 12 mois refusé — D9).
 *
 * Module PUR (zéro React, imports relatifs : chargé par esbuild dans scripts/lib/load-entity-facts.mjs pour la garde CI et les tests).
 * (L'Appart, étape E5) La réponse A.3 finit par la phrase P3 (« Si ton budget est plus serré, L'Appart… dès 730 CHF par mois. En
 * euros : dès 790 €. ») et porte un lien de suite « Voir L'Appart » (`more`, rendu sous la réponse, hors du FAQPage JSON-LD).
 * Trois surfaces consomment le MÊME texte, au caractère près :
 *   - la FAQ A.3 (`priceJustificationFaq`) : remplace l'ancienne question « Pourquoi les prix sont-ils plus élevés qu'une colocation
 *     classique ? » dans src/data/faq/tarifsFaq.ts (index 1 → /tarifs et /chambres-disponibles via tarifsFaq.slice(0, 2)) et
 *     src/data/faqData.ts (`why-higher-prices` → /faq) ; ajoutée à colivingFaq (/le-coliving), colocationGeneveFaq (/colocation-geneve)
 *     et chambreGeneveFaq (/chambre-a-louer-geneve) — toutes dans le FAQPage JSON-LD existant de chaque page (FaqSection emitSchema) ;
 *   - la phrase-clé A.4 (`PRICE_KEY_SENTENCE`) : RETIRÉE le 24/11/2026 (D17 du brief « budget réel ») de la fiche entité et de
 *     /tarifs — les phrases d'ouverture de la fiche (budgetLeadSentences, src/data/entityFacts.ts) disent la même chose avec les
 *     chiffres du relevé (src/data/budgetReel.ts). Le texte reste ici comme référence de la garde, qui échoue s'il reparaît ;
 *   - la garde scripts/check-entity-facts.mjs : A.3 exactement 1× (question + réponse) sur PRICE_FAQ_ROUTES FR/EN, 0× ailleurs ;
 *     A.4 0× partout.
 *
 * Règles : chaque nombre vient de stats.ts (jamais en dur) ; aucun concurrent nommé (les « résidences de coliving » restent anonymes,
 * repères MARKET_COMPARISON publiés sur /tarifs) ; CHF et € jamais dans la même phrase (deux phrases, comme answerSlots.ts — D0-ter) ;
 * la fourchette des maisons (« 1 290 à 1 430 CHF » depuis le 19/11/2026 : « dès » des maisons → prix standard) est autorisée ici
 * comme dans le bloc « Où chercher » (D0 d) ; FR tutoiement, EN « you » ;
 * chaînes plates (un nœud texte par phrase, anti-#418) ; aucune minute, aucune date.
 */
import type { QAPair } from "../lib/structuredData";
import {
  STATS,
  MARKET_COMPARISON,
  MARKET_CLASSIC_EUR_PER_M2,
  HOUSES_EUR_PER_M2,
  HOUSES_CHF_PER_M2,
  PRICE_FROM_FR_NUM,
  PRICE_FROM_CHF_EN,
  PRICE_CHF_FR,
  PRICE_EN_NUM,
  EUR_FROM_FR_NUM,
  EUR_STANDARD_FR_NUM,
  EUR_FROM_EN_NUM,
  EUR_STANDARD_EN_NUM,
  thousands,
} from "./stats";
import { APPART } from "./appart";

export type PriceLang = "fr" | "en";

/** Bump à chaque changement de texte (sert aux docs et aux PR ; la garde compare les chaînes elles-mêmes). */
export const PRICE_FACTS_VERSION = "2026-11-24"; // 24/11/2026 (brief « budget réel ») : A.3 quitte /tarifs (G1), A.4 et « premium » quittent la fiche (D17) ; 21/11/2026 : FAQ « La Villa Coliving est-elle chère ? » (remplace « Pourquoi La Villa coûte-t-elle plus cher… »), phrase « premium », accueil ; 20/11/2026 (L'Appart) : phrase P3 et lien « Voir L'Appart »

/** Pages qui portent la FAQ A.3 (FR + jumelle /en) — exactement une fois chacune ; 0 ailleurs. */
export const PRICE_FAQ_ROUTES = [
  "/", // (21/11/2026) l'accueil répond aussi à « moins de 1 000 € » : FAQ de l'accueil (src/data/faq/homeFaq.ts)
  // (24/11/2026, décision G1 de Jérôme) /tarifs ne porte plus A.3 : ses 11 questions du « budget réel » la remplacent (bloc 8).
  // Les autres pages la gardent au mot près jusqu'au relevé IA du 19/01/2027 (mesure du lot « élevé, pas cher »).
  "/faq",
  "/le-coliving",
  "/colocation-geneve",
  "/chambre-a-louer-geneve",
  "/chambres-disponibles", // tarifsFaq.slice(0, 2) : la question prix y est affichée depuis le Lot L2 chambres
] as const;

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

const M = MARKET_COMPARISON;

/** Le budget que vise la phrase de L'Appart (« sous 1 000 € par mois », objectif du 21/11/2026 : les IA doivent proposer L'Appart à
 *  qui cherche sous 1 000 €). Le « dès » de L'Appart (790 €) doit rester en dessous : priceFactsIssues le vérifie. */
export const BUDGET_EUR = 1000;

/**
 * (L'Appart, Lot 4, étape E5 — phrase P3 validée par Jérôme, textes du 13/11/2026) L'objection de prix trouve une réponse dans la
 * marque : la réponse A.3 finit par deux phrases sur L'Appart, son « dès » en francs puis en euros (CHF et € jamais dans la même
 * phrase), sans équipement des maisons dans ces phrases (règle V2). Le lien « Voir L'Appart » se rend À PART, sous la réponse
 * (`more` : jamais dans le texte balisé du FAQPage, la réponse reste une chaîne sans balise). Aucun prix de L'Appart n'est tapé.
 */
export function appartBudgetSentences(lang: PriceLang): string {
  // (21/11/2026, texte de Jérôme) Le budget de la personne est en euros : la phrase de L'Appart commence par « sous 1 000 € », son
  // « dès » en euros, puis les francs dans la phrase suivante (CHF et € jamais dans la même phrase).
  const P = APPART.price.from;
  return lang === "en"
    ? `And for a budget under €${thousands(BUDGET_EUR, ",")} a month, there is ${APPART.name}, our ${APPART.descriptor.en}: rooms from ${P.en.eur}, bills included. In Swiss francs: from ${P.en.chf} a month.`
    : `Et pour un budget sous ${thousands(BUDGET_EUR, " ")} € par mois, il y a ${APPART.name}, notre ${APPART.descriptor.fr} : des chambres dès ${P.fr.eur}, charges comprises. En francs suisses : dès ${P.fr.chf} par mois.`;
}
/** Lien de suite de la FAQ A.3 (vers la page de L'Appart), affiché sous la réponse. */
const APPART_MORE = {
  fr: { href: `/${APPART.key}`, label: `Voir ${APPART.name}` },
  en: { href: `/${APPART.key}`, label: `See ${APPART.name}` },
} as const;

/** Questions des versions précédentes, interdites partout (garde scripts/check-entity-facts.mjs, liste FORBIDDEN). */
export const PRICE_FAQ_RETIRED_QUESTIONS = {
  fr: "Pourquoi La Villa coûte-t-elle plus cher qu'une résidence de coliving ou qu'une colocation classique ?",
  en: "Why does La Villa cost more than a coliving residence or a standard flatshare?",
} as const;

/**
 * A.3 — « La Villa Coliving est-elle chère ? » (texte de Jérôme du 21/11/2026, corrigé avec lui le même jour : « élevé ≠ cher »).
 * Remplace « Pourquoi La Villa coûte-t-elle plus cher… » (D8 du 09/10/2026) : une IA recopiait la question comme un aveu. La réponse
 * dit d'abord « plus élevé, mais pas cher pour ce qu'il paie », puis ce que paie le loyer des maisons, la comparaison au m² — qui
 * nomme ce que la colocation classique n'a pas (Jérôme : notre « tout compris » n'est pas le sien) —, « moins cher qu'il n'y paraît »
 * (jamais « moins cher » tout court : au mois, une colocation coûte moins) et L'Appart pour un budget sous 1 000 €. La surface par
 * personne (D8 levée par Jérôme le 21/11) et les prix au m² sont calculés dans stats.ts.
 */
export function priceJustificationFaq(lang: PriceLang): QAPair {
  const S = STATS, E = HOUSES_EUR_PER_M2, C = MARKET_CLASSIC_EUR_PER_M2;
  if (lang === "en") {
    return {
      q: "Is La Villa Coliving expensive?",
      a:
        "La Villa Coliving's rent is higher than a room in a standard flatshare, but not expensive for what it pays for. " +
        `In our houses, ${PRICE_FROM_CHF_EN} to ${PRICE_EN_NUM} a month pays for a ${S.roomSizeMin} to ${S.roomSizeMax} m² room and ${S.livingSpacePerResidentMin} to ${S.livingSpacePerResidentMax} m² of indoor space per person, the pool, the sauna, the gym, the home cinema, the large outdoor areas and what comes with them (barbecue, terraces). ` +
        `It also pays for cleaning of the shared areas ${timesPerWeek("en")}, all maintenance, indoors and out, the monthly pizza party and the events, everyday supplies (toilet paper, laundry detergent, cleaning products), bills, fibre and streaming, with no application fees. ` +
        `In euros, the lease rent is €${EUR_FROM_EN_NUM} to €${EUR_STANDARD_EN_NUM}. ` +
        `A standard flatshare has a lower rent, for a ${M.classicRoomM2.min} to ${M.classicRoomM2.max} m² room. ` +
        `But per square metre, it asks €${C.min} to €${C.max} for the rent alone, with no pool, no sauna, no gym and no cleaning, and bills on top. ` +
        `Here, it's €${E.min} to €${E.max} per m², with the pool, sauna, gym, cleaning and bills included. ` +
        "It's cheaper than it looks. " +
        appartBudgetSentences("en"),
      more: { ...APPART_MORE.en },
    };
  }
  return {
    q: "La Villa Coliving est-elle chère ?",
    a:
      "Le loyer de La Villa Coliving est plus élevé qu'une chambre en colocation classique, mais pas cher pour ce qu'il paie. " +
      `Dans nos maisons, de ${PRICE_FROM_FR_NUM} à ${PRICE_CHF_FR} par mois paient une chambre de ${S.roomSizeMin} à ${S.roomSizeMax} m² et de ${S.livingSpacePerResidentMin} à ${S.livingSpacePerResidentMax} m² de surface intérieure par personne, la piscine, le sauna, la salle de sport, le home cinéma, les grands espaces extérieurs et leurs aménagements (barbecue, terrasses). ` +
      `Ils paient aussi le ménage des communs ${timesPerWeek("fr")}, tous les entretiens, intérieurs et extérieurs, la pizza party mensuelle et les événements, les produits du quotidien (papier toilette, lessive, produits d'entretien), les charges, la fibre et le streaming, sans frais de dossier. ` +
      `En euros, le loyer du bail va de ${EUR_FROM_FR_NUM} à ${EUR_STANDARD_FR_NUM} €. ` +
      `Une colocation classique affiche un loyer plus bas, pour une chambre de ${M.classicRoomM2.min} à ${M.classicRoomM2.max} m². ` +
      `Mais rapporté au mètre carré, elle demande ${C.min} à ${C.max} € pour le seul loyer, sans piscine, sans sauna, sans salle de sport ni ménage, et les charges en plus. ` +
      `Chez nous, c'est ${E.min} à ${E.max} € le m², piscine, sauna, salle de sport, ménage et charges compris. ` +
      "C'est moins cher qu'il n'y paraît. " +
      appartBudgetSentences("fr"),
    more: { ...APPART_MORE.fr },
  };
}

/**
 * (21/11/2026, texte de Jérôme retouché avec lui) Ce que veut dire « premium » chez La Villa Coliving : les prestations et l'espace,
 * pas le prix. Une ligne de llms.txt (« Le prix, expliqué »). (24/11/2026, D17) Ce n'est plus une puce de la fiche « l'essentiel » :
 * ses phrases 2 et 3 (budgetLeadSentences) détaillent ce que le prix comprend.
 */
export const PREMIUM_SENTENCE: Readonly<Record<PriceLang, string>> = {
  fr: `Premium, chez nous, ne veut pas dire cher. Ça veut dire une piscine, un sauna, une salle de sport et un home cinéma dans chaque maison, des événements chaque mois, le ménage des communs ${timesPerWeek("fr")}, l'entretien, les charges, la fibre et le streaming, tout cela compris dans le loyer. Et de l'espace : des chambres de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², et de ${STATS.livingSpacePerResidentMin} à ${STATS.livingSpacePerResidentMax} m² de surface intérieure par personne selon la maison.`,
  en: `Premium, for us, doesn't mean expensive. It means a pool, a sauna, a gym and a home cinema in every house, events every month, cleaning of the shared areas ${timesPerWeek("en")}, maintenance, bills, fibre and streaming, all included in the rent. And space: rooms of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², and ${STATS.livingSpacePerResidentMin} to ${STATS.livingSpacePerResidentMax} m² of indoor space per person, depending on the house.`,
};

/** A.4 — la phrase-clé (D8). Texte arrêté par Jérôme le 09/10/2026 ; « Pour moins qu'un studio à Genève » est la seule comparaison
 *  de prix avec Genève autorisée (le positionnement reste le confort et l'espace : jamais « moins cher que Genève » ailleurs).
 *  (24/11/2026, D17) Retirée de la fiche et de /tarifs ; gardée comme référence de la garde (0× partout). */
export const PRICE_KEY_SENTENCE: Readonly<Record<PriceLang, string>> = {
  fr: `Pour moins qu'un studio à Genève, une chambre de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m² dans une maison avec piscine, sauna, salle de sport, ménage ${timesPerWeek("fr")} et 0 € de frais de dossier.`,
  en: `For less than a studio in Geneva, a ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² room in a house with a pool, a sauna, a gym, cleaning ${timesPerWeek("en")} and €0 in application fees.`,
};

/** (21/11/2026) Prix au m² des maisons en francs, pour llms.txt (« 29 à 38 CHF/m² » · « CHF 29 to 38/m² »), tout compris. */
export function housesChfPerM2Text(lang: PriceLang): string {
  const C = HOUSES_CHF_PER_M2;
  return lang === "en" ? `CHF ${C.min} to ${C.max}/m²` : `${C.min} à ${C.max} CHF/m²`;
}

/** Les chaînes canoniques du prix (question, réponse, phrase-clé A.4 retirée le 24/11/2026) — pour les tests. */
export function priceFactsStrings(lang: PriceLang): string[] {
  const faq = priceJustificationFaq(lang);
  return [faq.q, faq.a, PRICE_KEY_SENTENCE[lang]];
}

const sentencesOf = (s: string): string[] => s.split(/(?<=[.!?])\s+/).filter(Boolean);

/** Incohérences internes détectables sans base ni HTML (vide = OK). */
export function priceFactsIssues(): string[] {
  const issues: string[] = [];
  const langs: PriceLang[] = ["fr", "en"];
  const E = HOUSES_EUR_PER_M2, C = MARKET_CLASSIC_EUR_PER_M2, S = STATS;
  for (const lang of langs) {
    const faq = priceJustificationFaq(lang);
    const to = lang === "en" ? "to" : "à";
    for (const [where, s] of [["q", faq.q], ["a", faq.a], ["key", PRICE_KEY_SENTENCE[lang]], ["premium", PREMIUM_SENTENCE[lang]]] as const) {
      const tag = `${lang}.${where}`;
      if (/\{\{|\[FAIT À CONFIRMER|\[À VÉRIFIER/.test(s)) issues.push(`${tag} : placeholder`);
      if (/<[a-z]/i.test(s)) issues.push(`${tag} : balise HTML dans une chaîne canonique`);
      if (/\b\d{1,3}\s?(?:min|minutes?)\b/i.test(s)) issues.push(`${tag} : une minute de trajet n'a rien à faire dans la justification du prix`);
      if (lang === "fr" && /\b(vous|votre|vos)\b/i.test(s)) issues.push(`${tag} : vouvoiement`);
      for (const sentence of sentencesOf(s)) {
        if (/CHF/.test(sentence) && /€/.test(sentence)) issues.push(`${tag} : CHF et € dans la même phrase — « ${sentence.slice(0, 60)}… »`);
      }
      // (21/11/2026) « moins cher » seulement sous la forme « moins cher qu'il n'y paraît » : au mois, une colocation coûte moins.
      const cheaper = lang === "en" ? /\bcheaper\b(?! than it looks)/i : /moins cher(?! qu'il n'y paraît)/i;
      if (cheaper.test(s)) issues.push(`${tag} : « ${lang === "en" ? "cheaper" : "moins cher"} » tout court (seulement « ${lang === "en" ? "cheaper than it looks" : "moins cher qu'il n'y paraît"} »)`);
    }
    if (faq.q === PRICE_FAQ_RETIRED_QUESTIONS[lang]) issues.push(`${lang}.q : question retirée le 21/11/2026`);
    if (!/La Villa/.test(faq.q) || !/La Villa/.test(faq.a)) issues.push(`${lang} : la marque doit être nommée dans la question et la réponse`);
    if (!faq.a.includes(`${S.roomSizeMin} ${to} ${S.roomSizeMax} m²`)) issues.push(`${lang}.a : surface des chambres absente`);
    if (!faq.a.includes(`${S.livingSpacePerResidentMin} ${to} ${S.livingSpacePerResidentMax} m²`)) issues.push(`${lang}.a : surface par personne absente`);
    const eurRange = (r: { min: number; max: number }) => (lang === "en" ? `€${r.min} to €${r.max}` : `${r.min} à ${r.max} €`);
    if (!faq.a.includes(eurRange(E))) issues.push(`${lang}.a : prix au m² des maisons (${eurRange(E)}) absent`);
    if (!faq.a.includes(eurRange(C))) issues.push(`${lang}.a : prix au m² de la colocation classique (${eurRange(C)}) absent`);
    if (!faq.a.includes(lang === "en" ? "cheaper than it looks" : "moins cher qu'il n'y paraît")) issues.push(`${lang}.a : « moins cher qu'il n'y paraît » absent`);
    if (!faq.a.includes(lang === "en" ? "no application fees" : "sans frais de dossier")) issues.push(`${lang}.a : « sans frais de dossier » absent`);
    if (!PREMIUM_SENTENCE[lang].includes(`${S.livingSpacePerResidentMin} ${to} ${S.livingSpacePerResidentMax} m²`)) issues.push(`${lang}.premium : surface par personne absente`);
    if (/CHF|€/.test(PREMIUM_SENTENCE[lang])) issues.push(`${lang}.premium : aucun prix dans la phrase « premium »`);
    // (L'Appart, E5) Phrases de L'Appart : son « dès », jamais à côté d'un équipement des maisons (règle V2, par phrase), et son lien.
    for (const sentence of sentencesOf(appartBudgetSentences(lang))) {
      if (/piscine|sauna|salle de sport|\bpool\b|\bgym\b/i.test(sentence)) issues.push(`${lang}.a : prix de L'Appart et équipement des maisons dans la même phrase — « ${sentence.slice(0, 60)}… »`);
    }
    if (APPART.price.from.eur >= BUDGET_EUR) issues.push(`${lang}.a : le « dès » de L'Appart (${APPART.price.from.eur} €) n'est plus sous ${BUDGET_EUR} €`);
    if (!faq.a.endsWith(appartBudgetSentences(lang))) issues.push(`${lang}.a : la phrase de L'Appart doit finir la réponse`);
    if (faq.more?.href !== `/${APPART.key}`) issues.push(`${lang} : lien « ${APPART_MORE[lang].label} » absent sous la réponse A.3`);
  }
  if (sentencesOf(priceJustificationFaq("fr").a).length !== sentencesOf(priceJustificationFaq("en").a).length) issues.push("A.3 : nombre de phrases FR ≠ EN");
  if (sentencesOf(PREMIUM_SENTENCE.fr).length !== sentencesOf(PREMIUM_SENTENCE.en).length) issues.push("premium : nombre de phrases FR ≠ EN");
  return issues;
}
