import type { QAPair } from "@/lib/structuredData";
import { STATS, PRICE_CHF_FR, PRICE_CHF_EN, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN } from "@/data/stats";

// FAQ de /colocation-geneve — spécification révisée du 04/09/2026 (Lot 5, gel levé) : les 4 questions
// « Autres questions posées » de la SERP « colocation genève » + « colocation ou coliving ? » + « quel délai ? ».
// Tutoiement, prix depuis la source unique, aucun concurrent nommé, CHF des deux côtés de la comparaison.
const MIN = STATS.genevaCenterMinutes;
export const colocationGeneveFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Combien coûte une colocation à Genève ?",
      a: `À Genève même, d'après les annonces relevées en 2026, une chambre en colocation se loue le plus souvent entre 1 000 et 1 500 CHF par mois, charges et internet souvent en plus, et il faut trouver la colocation. Côté France, chez La Villa Coliving, une chambre meublée en maison coûte dès ${PRICE_SHARED_CHF_FR}/mois tout inclus (${PRICE_CHF_FR} avec salle d'eau privative) : charges, fibre, ménage des communs, piscine, sauna, salle de sport et événements compris, à ${MIN} minutes du centre.`,
    },
    {
      q: "Quel est le loyer moyen à Genève ?",
      a: "Pour un studio à Genève, compte 1 800 à 2 500 CHF par mois hors charges d'après les annonces relevées en 2026 (autour de 50 CHF/m² en annonce, relevé de notre Observatoire du logement frontalier, juin 2026), et un taux de vacance inférieur à 1 % (OCSTAT) : l'offre est rare et les dossiers exigeants. C'est pour ça que beaucoup de frontaliers et de nouveaux arrivants cherchent leur colocation côté France, où le même budget donne une chambre dans une maison entière avec ses espaces communs.",
    },
    {
      q: "Comment faire une colocation en Suisse quand on travaille à Genève ?",
      a: `Deux profils, une même solution. Si tu es frontalier, tu vis côté France avec un permis G et tu es imposé à la source à Genève. Si tu es résident suisse et que tu passes côté France, tu deviens frontalier à ton tour. Chez La Villa, le bail est un bail meublé français à ton nom (${STATS.leaseDurationMonths} mois renouvelable, préavis d'${STATS.noticePeriodMonths} mois), la caution est de ${STATS.depositMonths} mois de loyer hors charges et il n'y a ni frais d'agence ni frais de dossier. Aucun historique locatif suisse n'est demandé.`,
    },
    {
      q: "Quel est le meilleur site pour trouver une colocation à Genève ?",
      a: "Il n'y en a pas un seul : les portails d'annonces, les groupes de colocataires et les annuaires spécialisés existent, avec leur lot d'annonces périmées et de dossiers à monter. Ce que nous ajoutons : une chambre prête à vivre, une communauté déjà là, un seul loyer tout compris et une réponse sous 48 h. Notre guide « Trouver une colocation à Genève » explique comment chercher, étape par étape.",
    },
    {
      q: "Colocation ou coliving : quelle différence ?",
      a: `La colocation classique, c'est un appartement que tu trouves et que tu gères à plusieurs : meubles, charges, internet, ménage. Le coliving, c'est une maison déjà équipée, avec des espaces communs pensés pour vivre ensemble (cuisine, salon, jardin, piscine ou salle de sport selon la maison) et un seul loyer. Chez La Villa, ${STATS.totalRooms} chambres dans ${STATS.totalHouses} maisons, ${STATS.livingSpacePerResidentMin} à ${STATS.livingSpacePerResidentMax} m² d'espace de vie par colocataire.`,
    },
    {
      q: "Quel délai pour emménager ?",
      a: `Candidature en ligne en 2 minutes, réponse sous 48 h, visite sur place ou en visio, bail signé en ligne : tu peux emménager en une semaine quand une chambre est libre. Les disponibilités réelles des ${STATS.totalHouses} maisons sont affichées sur cette page et sur la page des chambres disponibles ; s'il n'y a rien à ta date, la liste d'attente te prévient dès qu'une chambre se libère.`,
    },
  ],
  en: [
    {
      q: "How much does a flatshare cost in Geneva?",
      a: `In Geneva itself, based on listings observed in 2026, a room in a shared flat usually rents for 1,000 to 1,500 CHF per month, often with utilities and internet on top, and you still have to find the flatshare. On the French side, at La Villa Coliving, a furnished room in a house costs from ${PRICE_SHARED_CHF_EN}/month all inclusive (${PRICE_CHF_EN} with a private shower room): utilities, fibre, cleaning of the common areas, pool, sauna, gym and events included, ${MIN} minutes from the centre.`,
    },
    {
      q: "What is the average rent in Geneva?",
      a: "For a studio in Geneva, count 1,800 to 2,500 CHF per month excluding charges based on listings observed in 2026 (around 50 CHF/m² advertised, our cross-border housing Observatory survey, June 2026), with a vacancy rate below 1% (OCSTAT): supply is scarce and files demanding. That is why many cross-border workers and newcomers look for their flatshare on the French side, where the same budget gets you a room in a whole house with its shared spaces.",
    },
    {
      q: "How do you share a flat in Switzerland when you work in Geneva?",
      a: `Two profiles, one solution. If you are a cross-border worker, you live on the French side with a G permit and are taxed at source in Geneva. If you are a Swiss resident moving to the French side, you become a cross-border worker in turn. At La Villa the lease is a French furnished lease in your name (${STATS.leaseDurationMonths} months renewable, ${STATS.noticePeriodMonths}-month notice), the deposit is ${STATS.depositMonths} months' rent excluding charges, and there is no agency or application fee. No Swiss rental history is required.`,
    },
    {
      q: "What is the best website to find a flatshare in Geneva?",
      a: "There is no single one: listing portals, flatmate groups and specialised directories all exist, with their share of stale ads and paperwork. What we add: a room ready to live in, a community already there, a single all-inclusive rent and a reply within 48 h. Our guide « Finding a flatshare in Geneva » explains how to search, step by step.",
    },
    {
      q: "Flatshare or coliving: what is the difference?",
      a: `A classic flatshare is a flat you find and run together: furniture, bills, internet, cleaning. Coliving is a house already equipped, with shared spaces designed for living together (kitchen, living room, garden, pool or gym depending on the house) and a single rent. At La Villa, ${STATS.totalRooms} rooms in ${STATS.totalHouses} houses, ${STATS.livingSpacePerResidentMin} to ${STATS.livingSpacePerResidentMax} m² of living space per flatmate.`,
    },
    {
      q: "How quickly can you move in?",
      a: `Online application in 2 minutes, reply within 48 h, visit on site or by video, lease signed online: you can move in within a week when a room is free. Real availability across the ${STATS.totalHouses} houses is shown on this page and on the available rooms page; if nothing matches your date, the waiting list tells you as soon as a room opens up.`,
    },
  ],
};
