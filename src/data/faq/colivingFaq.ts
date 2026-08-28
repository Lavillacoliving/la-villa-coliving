import type { QAPair } from "@/lib/structuredData";
import { PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN, STATS } from "@/data/stats";

// §4 du playbook AEO — /le-coliving (définitionnel). Tutoiement, texte verbatim.
export const colivingFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Qu'est-ce que le coliving ?",
      a: "Le coliving est un mode de logement où chaque résident dispose de sa chambre meublée privée dans une maison partagée, avec tous les services réunis dans un seul loyer : charges, internet, ménage, espaces communs, services et vie de communauté. Chez La Villa Coliving, cela prend la forme de maisons de 7 à 12 résidents près de Genève, avec piscine, sauna et salle de sport, des cours de sport et de yoga et des événements.",
    },
    {
      q: "Quelle est la différence entre coliving et colocation ?",
      a: "En colocation, on loue ensemble un logement pour réduire les coûts. En coliving, comme chez La Villa Coliving, tout est inclus et géré pour toi dans un loyer unique, la maison est équipée et pensée pour la vie commune, et la communauté est sélectionnée. C'est une colocation avec de nombreux avantages supplémentaires (équipements et services), sans les contraintes d'organisation.",
    },
    {
      q: "À qui s'adresse le coliving ?",
      a: "Le coliving s'adresse surtout aux jeunes professionnels, frontaliers, expatriés et télétravailleurs qui veulent un logement prêt à vivre et une vie sociale sans gérer la logistique du quotidien. Les résidents de La Villa Coliving, près de Genève, sont en majorité de jeunes professionnels et expatriés en quête d'une communauté à taille humaine.",
    },
    {
      q: "Quelle est la différence entre le coliving et Airbnb ?",
      a: `Airbnb, c'est de la location courte durée, meublée mais sans vie de communauté ni engagement de long terme. Le coliving, comme chez La Villa Coliving, c'est un vrai lieu de vie : tu y résides plusieurs mois à plusieurs années, dans une communauté stable de 7 à 12 personnes, avec tous les services inclus dans un loyer mensuel unique dès ${PRICE_SHARED_CHF_FR}.`,
    },
    {
      q: "Le coliving est-il adapté si je suis plutôt introverti ?",
      a: "Oui. Chez La Villa Coliving, tu gardes ta chambre privée pour ton intimité, et la vie commune reste une invitation, jamais une obligation. Les événements — dîners, pizza party, cours de sport — sont optionnels. Les maisons à taille humaine de 7 à 12 résidents rendent les liens plus naturels et moins intimidants qu'un grand immeuble.",
    },
    {
      q: "Quels sont les inconvénients du coliving ?",
      a: `Le coliving a de vrais inconvénients : tu partages la cuisine et les espaces communs, tu as moins d'intimité qu'en studio, et l'entrée se fait sur candidature — donc avec un délai et une sélection, sans garantie d'être retenu. La vie en communauté ne convient pas à tout le monde. En contrepartie, ta chambre privée de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m² préserve ton espace, et chez La Villa Coliving les événements restent optionnels : tu participes quand tu veux, jamais par obligation.`,
    },
    {
      q: "Quel est le prix d'une colocation à Genève ?",
      a: `Compte 1 200 à 1 600 CHF par mois pour une chambre en colocation dans le centre de Genève, et 900 à 1 200 CHF en périphérie. Côté France voisine, une chambre se loue plutôt entre 600 et 900 € par mois, hors charges. À ces montants s'ajoutent souvent la caution, un garant et d'éventuels frais d'agence. En coliving, tout est réuni dans un loyer unique : chez La Villa Coliving, la chambre meublée tout inclus démarre dès ${PRICE_SHARED_CHF_FR}/mois, sans frais de dossier.`,
    },
    {
      q: "Y a-t-il du coliving près de Genève ?",
      a: `Oui. La Villa Coliving gère trois maisons de coliving à 20 minutes du centre de Genève, côté France : à Ville-la-Grand, Ambilly et Annemasse. Chacune propose des chambres meublées de 17 à 25 m², tout inclus dès ${PRICE_SHARED_CHF_FR}/mois, avec piscine, sauna et salle de sport.`,
    },
  ],
  en: [
    {
      q: "What is coliving?",
      a: "Coliving is a housing model where each resident has their own private furnished room in a shared house, with all services bundled into a single rent: utilities, internet, cleaning, common spaces, services and community life. At La Villa Coliving, this takes the form of houses of 7 to 12 residents near Geneva, with a pool, sauna and gym, sport and yoga classes and events.",
    },
    {
      q: "What is the difference between coliving and shared housing?",
      a: "With shared housing, you rent a place together to cut costs. With coliving, as at La Villa Coliving, everything is included and managed for you in a single rent, the house is equipped and designed for community living, and the community is curated. It's shared housing with many extra benefits (amenities and services), without the organisational hassle.",
    },
    {
      q: "Who is coliving for?",
      a: "Coliving is mainly for young professionals, cross-border workers, expats and remote workers who want a ready-to-live home and a social life without handling day-to-day logistics. Residents at La Villa Coliving, near Geneva, are mostly young professionals and expats looking for a human-scale community.",
    },
    {
      q: "What is the difference between coliving and Airbnb?",
      a: `Airbnb is short-term rental, furnished but without community life or long-term commitment. Coliving, as at La Villa Coliving, is a real place to live: you stay for several months to several years, in a stable community of 7 to 12 people, with all services included in a single monthly rent from ${PRICE_SHARED_CHF_EN}.`,
    },
    {
      q: "Is coliving suitable if I'm rather introverted?",
      a: "Yes. At La Villa Coliving you keep your private room for your privacy, and shared life remains an invitation, never an obligation. Events — dinners, pizza parties, sport classes — are optional. The human-scale houses of 7 to 12 residents make connections more natural and less intimidating than a large building.",
    },
    {
      q: "What are the downsides of coliving?",
      a: `Coliving has real downsides: you share the kitchen and common areas, you get less privacy than in a studio, and entry goes through an application — so there is a delay and a selection process, with no guarantee of getting a room. Community living simply isn't for everyone. On the flip side, your private room of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² protects your own space, and at La Villa Coliving events stay optional: you join when you feel like it, never out of obligation.`,
    },
    {
      q: "How much does a room in a Geneva flatshare cost?",
      a: `Expect CHF 1,200 to 1,600 per month for a room in a shared flat in central Geneva, and CHF 900 to 1,200 on the outskirts. On the French side of the border, a room usually rents for 600 to 900 € per month, excluding utilities. On top of that, expect a deposit, often a guarantor, and sometimes agency fees. Coliving bundles everything into a single rent: at La Villa Coliving, an all-inclusive furnished room starts from ${PRICE_SHARED_CHF_EN}/month, with no application fee.`,
    },
    {
      q: "Is there coliving near Geneva?",
      a: `Yes. La Villa Coliving runs three coliving houses 20 minutes from Geneva city center, on the French side: in Ville-la-Grand, Ambilly and Annemasse. Each offers furnished rooms of 17 to 25 m², all inclusive from ${PRICE_SHARED_CHF_EN}/month, with a pool, sauna and gym.`,
    },
  ],
};
