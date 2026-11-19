/**
 * L'Appart — les deux questions de sa FAQ qui le comparent aux maisons : n° 3 « L'Appart a-t-il une piscine ? » et n° 4 « Quelle
 * est la différence entre L'Appart et les maisons de La Villa Coliving ? ». TEXTE UNIQUE des trois pages qui les posent (14/11/2026,
 * CB-4 ; source des textes : PAGE-LAPPART.md § 10, questions 3 et 4, SURFACES-LOT4.md S5.4 et S5.5) :
 *  - /lappart, à leur place dans sa FAQ (appartFaq, src/data/appartPage.ts) ;
 *  - /tarifs et /faq, après les deux questions de prix de L'Appart (appartPriceFaq, src/data/faq/tarifsFaq.ts ; src/data/faqData.ts),
 *    dans le FAQPage existant de chaque page ;
 *  - la garde de mélange des gammes lit les mêmes chaînes : appartGammeExempt (src/data/appartFacts.ts) les prend ici pour ses
 *    exceptions « page.faq.3.q », « page.faq.3.r » et « page.faq.4.r ». Elles nomment piscine, sauna et salle de sport pour les NIER
 *    à L'Appart ou les RENVOYER aux maisons, et jamais dans la phrase d'un prix de L'Appart (règle V2).
 *
 * Module léger : /tarifs et /faq ne chargent ni la fiche, ni le tableau, ni les listes de L'Appart (appartFacts.ts) pour ces deux
 * réponses. Aucun calcul au chargement (rien qu'une fonction), zéro React, chaînes plates. Aucun nombre tapé : APPART pour L'Appart,
 * MAISONS_REFERRAL (src/data/entityFacts.ts) pour les maisons (règle de frontière : eslint.config.js, tools/test/appart-boundary.test.mjs).
 */
import { APPART } from "./appart";
import { MAISONS_REFERRAL } from "./entityFacts";
import { aOrAn } from "./stats";
import { cleaningSharedBath, timesPerWeek } from "./appartWords";

type AppartLang = "fr" | "en";

export interface AppartHousesQA {
  /** Identifiant de la source des textes : « page.faq.3 » (piscine), « page.faq.4 » (différence avec les maisons). */
  id: "page.faq.3" | "page.faq.4";
  q: string;
  a: string;
}

/** Les deux questions, dans l'ordre de /lappart (piscine, puis différence) ; mêmes chaînes sur /lappart, /tarifs et /faq. */
export function appartHousesFaq(lang: AppartLang): readonly [AppartHousesQA, AppartHousesQA] {
  const A = APPART, R = MAISONS_REFERRAL, P = A.price;
  if (lang === "en") {
    return [
      {
        id: "page.faq.3",
        q: `Does ${A.name} have a pool?`,
        a: `No. ${A.name} has no pool, sauna or gym: it's a flatshare in a flat, not a coliving house. You do have access to the yoga and fitness classes held at La Villa Coliving's houses. And if you want a pool and a sauna at home, that's the houses, from ${R.from.en} a month.`,
      },
      {
        id: "page.faq.4",
        q: `What's the difference between ${A.name} and La Villa Coliving's houses?`,
        a: `The houses are colivings: ${R.residents.min} to ${R.residents.max} housemates, rooms of ${R.surfaces.min} to ${R.surfaces.max} m², a pool, a sauna and a gym in every house, shared areas cleaned ${timesPerWeek(R.cleaningPerWeek, "en")}, from ${R.from.en} a month. ${A.name} is a flatshare: ${A.rooms.total} rooms in a ${A.flat.surfaceM2} m² flat near ${A.commune} station, rooms of ${A.rooms.surface.min} to ${A.rooms.surface.max} m², ${aOrAn(A.flat.livingKitchenM2)} ${A.flat.livingKitchenM2} m² living room and kitchen and a balcony, shared areas cleaned ${timesPerWeek(A.cleaningPerWeek, "en")} ${cleaningSharedBath("en")}, from ${P.from.en.chf} a month. Same founders, same lease, same deposit, and no application fee either way.`,
      },
    ];
  }
  return [
    {
      id: "page.faq.3",
      q: `${A.name} a-t-il une piscine ?`,
      a: `Non. ${A.name} n'a ni piscine, ni sauna, ni salle de sport : c'est une colocation dans un appartement, pas une maison de coliving. Tu as accès aux cours de yoga et de sport organisés dans les maisons de La Villa Coliving. Et si tu veux la piscine et le sauna à domicile, ce sont les maisons, dès ${R.from.fr} par mois.`,
    },
    {
      id: "page.faq.4",
      q: `Quelle est la différence entre ${A.name} et les maisons de La Villa Coliving ?`,
      a: `Les maisons sont des colivings : ${R.residents.min} à ${R.residents.max} colocataires, des chambres de ${R.surfaces.min} à ${R.surfaces.max} m², une piscine, un sauna et une salle de sport dans chaque maison, le ménage des communs ${timesPerWeek(R.cleaningPerWeek, "fr")}, dès ${R.from.fr} par mois. ${A.name} est une colocation : ${A.rooms.total} chambres dans un appartement de ${A.flat.surfaceM2} m² dans le quartier de la gare d'${A.commune}, des chambres de ${A.rooms.surface.min} à ${A.rooms.surface.max} m², un séjour-cuisine de ${A.flat.livingKitchenM2} m² et un balcon, le ménage des communs ${timesPerWeek(A.cleaningPerWeek, "fr")} ${cleaningSharedBath("fr")}, dès ${P.from.fr.chf} par mois. Mêmes fondateurs, même bail, même caution, et 0 € de frais de dossier dans les deux cas.`,
    },
  ];
}
