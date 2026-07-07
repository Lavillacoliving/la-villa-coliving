import type { QAPair } from "@/lib/structuredData";
import { PRICE_CHF_FR, PRICE_CHF_EN } from "@/data/stats";

// §9 du playbook AEO — /nos-maisons (vue d'ensemble & choix). Tutoiement, texte verbatim.
export const maisonsFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Combien de maisons de coliving La Villa propose-t-elle près de Genève ?",
      a: "La Villa Coliving gère trois maisons de coliving à moins de 20 minutes du centre de Genève, côté France : La Villa à Ville-la-Grand (10 résidents), Le Loft à Ambilly (7 résidents) et Le Lodge à Annemasse (12 résidents). Chacune dispose d'une piscine, d'un sauna, d'une salle de sport et d'un espace home cinéma.",
    },
    {
      q: "Quelle maison choisir entre La Villa, Le Loft et Le Lodge ?",
      a: `Les trois maisons de La Villa Coliving offrent la même expérience tout inclus dès ${PRICE_CHF_FR}/mois. La Villa, à Ville-la-Grand, séduit par son grand jardin et son emplacement au calme ; Le Loft, à Ambilly, par sa piscine intérieure chauffée toute l'année ; Le Lodge, à Annemasse, par sa taille et son chalet fitness. Le choix dépend de l'ambiance recherchée et des disponibilités.`,
    },
    {
      q: "Toutes les maisons ont-elles une piscine ?",
      a: "Oui. Les trois maisons de La Villa Coliving disposent d'une piscine : extérieure chauffée à La Villa (Ville-la-Grand), extérieure au Lodge (Annemasse) et intérieure chauffée toute l'année au Loft (Ambilly). Chacune a aussi un sauna, une salle de sport, un home cinéma et des jeux (babyfoot et/ou arcade) inclus dans le loyer.",
    },
    {
      q: "Les maisons sont-elles toutes proches de Genève ?",
      a: "Oui. Les trois maisons de La Villa Coliving se trouvent à moins de 20 minutes porte-à-porte du centre de Genève, côté France : en Léman Express depuis la gare d'Annemasse (à 10 min à pied de La Villa, 9 min du Lodge) ou en tram pour Le Loft, à Ambilly.",
    },
  ],
  en: [
    {
      q: "How many coliving houses does La Villa offer near Geneva?",
      a: "La Villa Coliving runs three coliving houses under 20 minutes from Geneva city center, on the French side: La Villa in Ville-la-Grand (10 residents), Le Loft in Ambilly (7 residents) and Le Lodge in Annemasse (12 residents). Each has a pool, a sauna, a gym and a home cinema space.",
    },
    {
      q: "Which house should you choose between La Villa, Le Loft and Le Lodge?",
      a: `The three La Villa Coliving houses offer the same all-inclusive experience from ${PRICE_CHF_EN}/month. La Villa, in Ville-la-Grand, stands out for its large garden and quiet location; Le Loft, in Ambilly, for its indoor pool heated year-round; Le Lodge, in Annemasse, for its size and its fitness chalet. The choice depends on the atmosphere you're after and availability.`,
    },
    {
      q: "Do all the houses have a pool?",
      a: "Yes. All three La Villa Coliving houses have a pool: heated outdoor at La Villa (Ville-la-Grand), outdoor at Le Lodge (Annemasse) and indoor heated year-round at Le Loft (Ambilly). Each also has a sauna, a gym, a home cinema and games (table football and/or arcade) included in the rent.",
    },
    {
      q: "Are all the houses close to Geneva?",
      a: "Yes. All three La Villa Coliving houses are under 20 minutes door-to-door from Geneva city center, on the French side: by Léman Express from Annemasse station (a 10-min walk from La Villa, 9 min from Le Lodge) or by tram for Le Loft, in Ambilly.",
    },
  ],
};
