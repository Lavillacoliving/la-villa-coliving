import type { QAPair } from "@/lib/structuredData";
import { PRICE_CHF_FR, PRICE_CHF_EN, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN, STATS_DISPLAY } from "@/data/stats";
import { ENTITY_HOUSES } from "@/data/entityFacts";

// §9 du playbook AEO — /nos-maisons (vue d'ensemble & choix). Tutoiement, texte verbatim.
// (Lot L2 « Emplacement et transport », 09/10/2026) « 20 min » toujours qualifié (STATS_DISPLAY.distance, D1) ; trajets
// par maison = les trois lignes courtes ENTITY_HOUSES[].commute (A.1), jamais une minute en dur. Séparateur « : » (pas
// « — ») : la garde check-entity-facts exige la puce « Trajets : … » de la fiche entité exactement une fois par page.
const commutes = (lang: "fr" | "en") => ENTITY_HOUSES.map((h) => `${h.label}${lang === "en" ? ": " : " : "}${h.commute[lang]}`).join(". ");

export const maisonsFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Combien de maisons de coliving La Villa propose-t-elle près de Genève ?",
      a: `La Villa Coliving gère trois maisons de coliving côté France, à ${STATS_DISPLAY.fr.distance} : La Villa à Ville-la-Grand (10 résidents), Le Loft à Ambilly (7 résidents) et Le Lodge à Annemasse (12 résidents). Chacune dispose d'une piscine, d'un sauna, d'une salle de sport et d'un espace home cinéma.`,
    },
    {
      q: "Quelle maison choisir entre La Villa, Le Loft et Le Lodge ?",
      a: `Les trois maisons de La Villa Coliving offrent la même expérience tout inclus, à ${PRICE_CHF_FR}/mois (${PRICE_SHARED_CHF_FR}/mois pour les 4 chambres de La Villa à salle d'eau partagée entre 2 chambres, entretien par notre équipe de ménage inclus). La Villa, à Ville-la-Grand, séduit par son grand jardin et son emplacement au calme ; Le Loft, à Ambilly, par sa piscine intérieure chauffée toute l'année ; Le Lodge, à Annemasse, par sa taille et son chalet fitness. Le choix dépend de l'ambiance recherchée et des disponibilités.`,
    },
    {
      q: "Toutes les maisons ont-elles une piscine ?",
      a: "Oui. Les trois maisons de La Villa Coliving disposent d'une piscine : extérieure chauffée à La Villa (Ville-la-Grand), extérieure au Lodge (Annemasse) et intérieure chauffée toute l'année au Loft (Ambilly). Chacune a aussi un sauna, une salle de sport, un home cinéma et des jeux (babyfoot et/ou arcade) inclus dans le loyer.",
    },
    {
      q: "Les maisons sont-elles toutes proches de Genève ?",
      a: `Oui. Les trois maisons de La Villa Coliving sont côté France, à ${STATS_DISPLAY.fr.distance}. ${commutes("fr")}.`,
    },
  ],
  en: [
    {
      q: "How many coliving houses does La Villa offer near Geneva?",
      a: `La Villa Coliving runs three coliving houses on the French side, ${STATS_DISPLAY.en.distance}: La Villa in Ville-la-Grand (10 residents), Le Loft in Ambilly (7 residents) and Le Lodge in Annemasse (12 residents). Each has a pool, a sauna, a gym and a home cinema space.`,
    },
    {
      q: "Which house should you choose between La Villa, Le Loft and Le Lodge?",
      a: `The three La Villa Coliving houses offer the same all-inclusive experience, at ${PRICE_CHF_EN}/month (${PRICE_SHARED_CHF_EN}/month for the 4 rooms at La Villa with a shower room shared between 2 rooms, cleaning by our housekeeping team included). La Villa, in Ville-la-Grand, stands out for its large garden and quiet location; Le Loft, in Ambilly, for its indoor pool heated year-round; Le Lodge, in Annemasse, for its size and its fitness chalet. The choice depends on the atmosphere you're after and availability.`,
    },
    {
      q: "Do all the houses have a pool?",
      a: "Yes. All three La Villa Coliving houses have a pool: heated outdoor at La Villa (Ville-la-Grand), outdoor at Le Lodge (Annemasse) and indoor heated year-round at Le Loft (Ambilly). Each also has a sauna, a gym, a home cinema and games (table football and/or arcade) included in the rent.",
    },
    {
      q: "Are all the houses close to Geneva?",
      a: `Yes. All three La Villa Coliving houses are on the French side, ${STATS_DISPLAY.en.distance}. ${commutes("en")}.`,
    },
  ],
};
