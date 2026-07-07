import type { QAPair } from "@/lib/structuredData";
import { PRICE_CHF_FR, PRICE_CHF_EN } from "@/data/stats";

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
      a: `Airbnb, c'est de la location courte durée, meublée mais sans vie de communauté ni engagement de long terme. Le coliving, comme chez La Villa Coliving, c'est un vrai lieu de vie : tu y résides plusieurs mois à plusieurs années, dans une communauté stable de 7 à 12 personnes, avec tous les services inclus dans un loyer mensuel unique dès ${PRICE_CHF_FR}.`,
    },
    {
      q: "Le coliving est-il adapté si je suis plutôt introverti ?",
      a: "Oui. Chez La Villa Coliving, tu gardes ta chambre privée pour ton intimité, et la vie commune reste une invitation, jamais une obligation. Les événements — dîners, pizza party, cours de sport — sont optionnels. Les maisons à taille humaine de 7 à 12 résidents rendent les liens plus naturels et moins intimidants qu'un grand immeuble.",
    },
    {
      q: "Y a-t-il du coliving près de Genève ?",
      a: `Oui. La Villa Coliving gère trois maisons de coliving à 20 minutes du centre de Genève, côté France : à Ville-la-Grand, Ambilly et Annemasse. Chacune propose des chambres meublées de 17 à 23 m², tout inclus dès ${PRICE_CHF_FR}/mois, avec piscine, sauna et salle de sport.`,
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
      a: `Airbnb is short-term rental, furnished but without community life or long-term commitment. Coliving, as at La Villa Coliving, is a real place to live: you stay for several months to several years, in a stable community of 7 to 12 people, with all services included in a single monthly rent from ${PRICE_CHF_EN}.`,
    },
    {
      q: "Is coliving suitable if I'm rather introverted?",
      a: "Yes. At La Villa Coliving you keep your private room for your privacy, and shared life remains an invitation, never an obligation. Events — dinners, pizza parties, sport classes — are optional. The human-scale houses of 7 to 12 residents make connections more natural and less intimidating than a large building.",
    },
    {
      q: "Is there coliving near Geneva?",
      a: `Yes. La Villa Coliving runs three coliving houses 20 minutes from Geneva city center, on the French side: in Ville-la-Grand, Ambilly and Annemasse. Each offers furnished rooms of 17 to 23 m², all inclusive from ${PRICE_CHF_EN}/month, with a pool, sauna and gym.`,
    },
  ],
};
