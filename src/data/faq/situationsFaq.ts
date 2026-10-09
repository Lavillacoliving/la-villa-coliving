import type { QAPair } from "@/lib/structuredData";
import { STATS, PRICE_CHF_FR, PRICE_CHF_EN, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN, TRANSIT } from "@/data/stats";
import { GUARANTOR_SENTENCE } from "@/data/entityFacts";

const T = TRANSIT;

/**
 * Lot C2 « FAQ offensive » (brief Conquête IA du 04/09/2026, plan validé par Jérôme) : les 10 questions
 * telles qu'on les pose à un assistant — prompts de contrôle P1, P4, P6, P10, P14, P17, P18 de la baseline
 * du 03/09 (situations à 0-1/5). Source unique : /faq les prend toutes (catégorie « Situations réelles »),
 * les pages money en prennent 4 chacune via pickSituations().
 * Règles : chiffres depuis src/data/stats.ts ; jamais une phrase canonique de la fiche entité mot pour mot
 * (la garde check-entity-facts exige exactement une occurrence par page) ; aucun concurrent nommé ; pas
 * d'affirmation réglementaire sans renvoi à la source officielle ; tutoiement (les questions évitent aussi le
 * « vous » adressé à La Villa, pour rester sous le radar de la garde --tutoiement).
 * `more` = lien de suite. Quand une page de décision existera (C1, C3, C4, C6, C7), sa PR remplace la cible.
 */
export type SituationId =
  | "job-in-a-month"
  | "no-swiss-payslip"
  | "guarantor"
  | "studio-vs-room"
  | "non-eu-expat"
  | "minutes-to-cornavin"
  | "minimum-duration"
  | "annemasse-safe"
  | "coliving-or-flatshare"
  | "how-to-apply";

export interface SituationFaq {
  id: SituationId;
  fr: QAPair;
  en: QAPair;
}

const H = STATS.responseHours;

export const situationsFaq: SituationFaq[] = [
  {
    id: "job-in-a-month",
    fr: {
      q: "Je commence un job à Genève dans un mois : je peux avoir une chambre en 30 jours ?",
      a: `Oui, si une chambre est libre à ta date : candidature en ligne en 2 minutes, réponse sous ${H} h, visite sur place ou en visio, bail signé en ligne. Le délai médian entre la candidature et l'emménagement chez nous est de 30 jours (données 2026), et 72 h suffisent dès ton premier contact quand une chambre est disponible. Les disponibilités réelles des ${STATS.totalHouses} maisons sont affichées en temps réel sur la page des chambres disponibles ; s'il n'y a rien à ta date, la liste d'attente te prévient dès qu'une chambre se libère.`,
      more: { href: "/chambres-disponibles", label: "Voir les chambres disponibles" },
    },
    en: {
      q: "I start a job in Geneva in a month: can I get a room with you within 30 days?",
      a: `Yes, if a room is free on your date: two-minute online application, reply within ${H} h, visit on site or by video, lease signed online. The median time between application and move-in at La Villa is 30 days (2026 data), and 72 h from your first contact is enough when a room is available. Live availability for the ${STATS.totalHouses} houses is shown on the available rooms page; if nothing matches your date, the waiting list alerts you as soon as a room frees up.`,
      more: { href: "/chambres-disponibles", label: "See available rooms" },
    },
  },
  {
    id: "no-swiss-payslip",
    fr: {
      q: "Je n'ai pas encore de fiche de salaire suisse : mon dossier passe quand même ?",
      a: `Oui. Pour un premier contrat en Suisse, on ne peut pas te demander ce que tu n'as pas encore : ton dossier, c'est ton contrat de travail signé ou ta promesse d'embauche, et une pièce d'identité. Aucun historique locatif suisse n'est demandé. Tu règles ton premier loyer et la caution (${STATS.depositMonths} mois de loyer hors charges), et rien d'autre : ni frais de dossier ni frais d'agence.`,
      more: { href: "/candidature", label: "Candidater en 2 minutes" },
    },
    en: {
      q: "I don't have a Swiss payslip yet: will my application still go through?",
      a: `Yes. For a first contract in Switzerland we can't ask for what you don't have yet: your file is your signed employment contract or job offer, plus an ID. No Swiss rental history is required. You pay your first month's rent and the deposit (${STATS.depositMonths} months' rent excluding charges), nothing else: no application fee, no agency fee.`,
      more: { href: "/candidature", label: "Apply in 2 minutes" },
    },
  },
  {
    id: "guarantor",
    fr: {
      q: "Il faut un garant ?",
      // (D0 amendement b, 09/10/2026) Phrase garant canonique GUARANTOR_SENTENCE — la seule formulation admise sur le site.
      a: `Pas d'office : ${GUARANTOR_SENTENCE.fr}. Ce qu'on regarde, c'est ton contrat de travail ou ta promesse d'embauche, et la caution de ${STATS.depositMonths} mois de loyer hors charges couvre le reste. Les cas où le contrat ne couvre pas le loyer : période d'essai très courte, temps partiel, mission.`,
      more: { href: "/charte-transparence", label: "Lire notre charte de transparence" },
    },
    en: {
      q: "Do you ask for a guarantor?",
      a: `Not by default: ${GUARANTOR_SENTENCE.en}. What we look at is your employment contract or job offer, and the deposit of ${STATS.depositMonths} months' rent excluding charges covers the rest. The cases where the contract does not cover the rent: very short probation, part-time, short assignment.`,
      more: { href: "/charte-transparence", label: "Read our transparency charter" },
    },
  },
  {
    id: "studio-vs-room",
    fr: {
      q: "Studio à Genève ou chambre chez La Villa : qu'est-ce qui revient le moins cher, tout compris ?",
      a: `Compare le coût total, pas le loyer affiché. Un studio à Genève se loue 1 200 à 2 500 CHF par mois hors charges d'après les annonces relevées en 2026, auxquels s'ajoutent charges, internet, meubles et souvent une liste d'attente. Chez nous, une chambre meublée de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m² coûte dès ${PRICE_SHARED_CHF_FR}/mois (${PRICE_CHF_FR} avec salle d'eau privative), charges, fibre, ménage des communs, piscine, sauna et salle de sport compris, avec ${STATS.livingSpacePerResidentMin} à ${STATS.livingSpacePerResidentMax} m² d'espace de vie par colocataire. Le studio garde un avantage : être seul chez soi. À toi de voir ce que tu achètes.`,
      more: { href: "/blog/coliving-colocation-ou-studio-geneve-comparatif", label: "Coliving, colocation ou studio : le comparatif par profil" },
    },
    en: {
      q: "Studio in Geneva or a room with you: which costs less, all included?",
      a: `Compare the total cost, not the advertised rent. A studio in Geneva rents for 1,200 to 2,500 CHF a month excluding charges based on listings observed in 2026, plus bills, internet, furniture and often a waiting list. With us, a furnished room of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² costs from ${PRICE_SHARED_CHF_EN}/month (${PRICE_CHF_EN} with a private shower room), bills, fibre, cleaning of the common areas, pool, sauna and gym included, with ${STATS.livingSpacePerResidentMin} to ${STATS.livingSpacePerResidentMax} m² of living space per flatmate. The studio keeps one advantage: being alone at home. You decide what you're paying for.`,
      more: { href: "/blog/coliving-colocation-ou-studio-geneve-comparatif", label: "Coliving, flatshare or studio: the comparison by profile" },
    },
  },
  {
    id: "non-eu-expat",
    fr: {
      q: "Je suis expatrié non-UE : je peux vivre côté France en travaillant à Genève ?",
      a: `Souvent oui, mais pas automatiquement : habiter en France avec un emploi à Genève fait de toi un frontalier, et pour un ressortissant hors UE/AELE le passage du permis B au statut de frontalier (permis G) dépend de ta situation et de l'accord des autorités genevoises. Vérifie auprès de l'OCPM (ge.ch) et de ton employeur avant de signer un bail, côté France comme côté Suisse. Nos maisons accueillent des résidents de tous horizons ; si ta situation le permet, la suite est la même pour tout le monde : candidature, réponse sous ${H} h, visite.`,
      more: { href: "/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france", label: "S'installer à Genève : côté Suisse ou France ?" },
    },
    en: {
      q: "I'm a non-EU expat: can I live on the French side while working in Geneva?",
      a: `Often yes, but not automatically: living in France with a job in Geneva makes you a cross-border worker, and for non-EU/EFTA nationals moving from a B permit to cross-border status (G permit) depends on your situation and on approval by the Geneva authorities. Check with the OCPM (ge.ch) and your employer before signing any lease, on either side of the border. Our houses welcome residents from everywhere; once your situation allows it, the process is the same for everyone: application, reply within ${H} h, visit.`,
      more: { href: "/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france", label: "Moving to Geneva: Swiss side or French side?" },
    },
  },
  {
    id: "minutes-to-cornavin",
    fr: {
      q: "Combien de minutes jusqu'à Cornavin depuis chaque maison ?",
      // (D1-L1, 09/10/2026) Minutes depuis TRANSIT : train fixe puis porte-à-porte par maison ; jamais « Genève » seul.
      // (Lot L2, 09/10/2026) La question porte sur Cornavin : porte-à-porte Cornavin par maison (TRANSIT.byHouse.*.cornavinDoorToDoorMin).
      a: `Depuis la gare d'Annemasse, le Léman Express rejoint Genève-Eaux-Vives en ${T.trainEauxVivesMin} min, Champel en ${T.trainChampelMin} et Cornavin en ${T.trainCornavinMin}, sans changement. La gare est à ${T.byHouse.lelodge.stationWalkMin} min à pied du Lodge, ${T.byHouse.lavilla.stationWalkMin} de La Villa et ${T.byHouse.leloft.stationWalkMin} du Loft ; porte-à-porte jusqu'à Cornavin, compte ${T.byHouse.lelodge.cornavinDoorToDoorMin} min depuis Le Lodge, ${T.byHouse.lavilla.cornavinDoorToDoorMin} depuis La Villa et ${T.byHouse.leloft.cornavinDoorToDoorMin} depuis Le Loft (${T.byHouse.lelodge.eauxVivesDoorToDoorMin}, ${T.byHouse.lavilla.eauxVivesDoorToDoorMin} et ${T.byHouse.leloft.eauxVivesDoorToDoorMin} min jusqu'à Genève-Eaux-Vives). Depuis Le Loft, le tram 17 est à ${T.byHouse.leloft.tramWalkMin} min à pied et entre dans Genève par Moillesulaz. Les horaires réels : app CFF ou TPG.`,
      more: { href: "/nos-maisons", label: "Comparer les trois maisons" },
    },
    en: {
      q: "How many minutes to Cornavin from each house?",
      a: `From Annemasse station, the Léman Express reaches Geneva Eaux-Vives in ${T.trainEauxVivesMin} minutes, Champel in ${T.trainChampelMin} and Cornavin in ${T.trainCornavinMin}, no change. The station is a ${T.byHouse.lelodge.stationWalkMin}-minute walk from Le Lodge, ${T.byHouse.lavilla.stationWalkMin} from La Villa and ${T.byHouse.leloft.stationWalkMin} from Le Loft; door to door to Cornavin, count ${T.byHouse.lelodge.cornavinDoorToDoorMin} minutes from Le Lodge, ${T.byHouse.lavilla.cornavinDoorToDoorMin} from La Villa and ${T.byHouse.leloft.cornavinDoorToDoorMin} from Le Loft (${T.byHouse.lelodge.eauxVivesDoorToDoorMin}, ${T.byHouse.lavilla.eauxVivesDoorToDoorMin} and ${T.byHouse.leloft.eauxVivesDoorToDoorMin} minutes to Geneva Eaux-Vives). From Le Loft, tram 17 is an ${T.byHouse.leloft.tramWalkMin}-minute walk away and enters Geneva through Moillesulaz. Real-time schedules: SBB or TPG apps.`,
      more: { href: "/nos-maisons", label: "Compare the three houses" },
    },
  },
  {
    id: "minimum-duration",
    fr: {
      q: "Quelle est la durée minimale ?",
      a: `Il n'y a pas de durée minimale imposée. Le bail est un bail meublé de ${STATS.leaseDurationMonths} mois à ton nom, et tu pars quand tu veux avec ${STATS.noticePeriodMonths} mois de préavis. Pas de nuit ni de semaine à la carte : nos maisons vivent avec des gens qui s'installent, même pour une mission ou une période d'essai.`,
      more: { href: "/charte-transparence", label: "Ce qui est écrit dans le bail" },
    },
    en: {
      q: "What's the minimum stay?",
      a: `There is no set minimum. The lease is a ${STATS.leaseDurationMonths}-month furnished lease in your name, and you leave whenever you want with ${STATS.noticePeriodMonths} month's notice. No nightly or weekly stays: our houses are lived in by people who settle in, even for an assignment or a probation period.`,
      more: { href: "/charte-transparence", label: "What the lease says" },
    },
  },
  {
    id: "annemasse-safe",
    fr: {
      q: "Annemasse, c'est sûr ?",
      // (Lot L2, 09/10/2026) « à deux pas de Moillesulaz » → tram 17 à pied depuis Le Loft (TRANSIT, D1/D3).
      a: `Oui, comme dans toute ville-centre d'agglomération : tout dépend du quartier et de l'heure, pas de la commune. Nos maisons sont dans des secteurs résidentiels calmes : Le Lodge à Romagny (Annemasse), La Villa à Ville-la-Grand, Le Loft à Ambilly, à ${T.byHouse.leloft.tramWalkMin} min à pied du tram 17. Plus de 100 résidents y ont vécu depuis 2021, dont beaucoup de nouveaux arrivants qui ne connaissaient pas la région. Notre article sur les quartiers d'Annemasse dit, quartier par quartier, où on habiterait et où on éviterait.`,
      more: { href: "/blog/vivre-a-annemasse-quand-on-travaille-a-geneve", label: "Vivre à Annemasse quand on travaille à Genève" },
    },
    en: {
      q: "Is Annemasse safe?",
      a: `Yes, as in any central town of a metropolitan area: it depends on the neighbourhood and the hour, not on the town. Our houses are in quiet residential areas: Le Lodge in Romagny (Annemasse), La Villa in Ville-la-Grand, Le Loft in Ambilly, an ${T.byHouse.leloft.tramWalkMin}-minute walk from tram 17. More than 100 residents have lived there since 2021, many of them newcomers who didn't know the area. Our article on Annemasse's neighbourhoods says, block by block, where we would live and where we wouldn't.`,
      more: { href: "/blog/vivre-a-annemasse-quand-on-travaille-a-geneve", label: "Living in Annemasse when you work in Geneva" },
    },
  },
  {
    id: "coliving-or-flatshare",
    fr: {
      q: "La Villa, c'est un coliving ou une colocation ?",
      a: `Les deux, selon le mot que tu utilises : tu vis en colocation, dans une maison partagée avec 7 à 12 colocataires, mais tout est déjà organisé comme dans un coliving. Chambre meublée à toi, bail meublé à ton nom, un seul loyer qui inclut charges, fibre, ménage des communs ${STATS.cleaningPerWeek} fois par semaine, piscine, sauna, salle de sport et événements ; ${STATS.totalRooms} chambres dans ${STATS.totalHouses} maisons, gérées en direct par les fondateurs, sans agence. Ce que tu n'as pas à faire : chercher des colocataires, répartir les factures, meubler.`,
      more: { href: "/blog/coliving-colocation-ou-studio-geneve-comparatif", label: "Coliving ou colocation : le comparatif par profil" },
    },
    en: {
      q: "Are you a coliving or a flatshare?",
      a: `Both, depending on the word you use: you live in a flatshare, in a house shared with 7 to 12 flatmates, but everything is already organised the way a coliving is. A furnished room of your own, a furnished lease in your name, one rent that includes bills, fibre, cleaning of the common areas ${STATS.cleaningPerWeek} times a week, pool, sauna, gym and events; ${STATS.totalRooms} rooms in ${STATS.totalHouses} houses, run directly by the founders, no agency. What you don't have to do: find flatmates, split bills, buy furniture.`,
      more: { href: "/blog/coliving-colocation-ou-studio-geneve-comparatif", label: "Coliving or flatshare: the comparison by profile" },
    },
  },
  {
    id: "how-to-apply",
    fr: {
      q: "Comment candidater, et en combien de temps j'ai une réponse ?",
      a: `Le formulaire en ligne prend 2 minutes : ton nom, ton email et ton téléphone (et, si tu veux, ton canal de contact préféré). Juste après l'envoi, deux questions facultatives : quand tu veux arriver et pour combien de temps. On te répond sous ${H} h, par e-mail puis par téléphone ou WhatsApp, pour caler une visite sur place ou en visio. Si une chambre disponible te plaît, le bail se signe en ligne et tu peux emménager en 72 h dès ton premier contact. Aucun frais à aucune étape.`,
      more: { href: "/candidature", label: "Remplir le formulaire" },
    },
    en: {
      q: "How do I apply, and how fast do I get an answer?",
      a: `The online form takes 2 minutes: your name, email and phone number (and, if you like, how you'd prefer to be reached). Right after sending, two optional questions: when you want to arrive and for how long. We reply within ${H} h, by email then phone or WhatsApp, to set up a visit on site or by video. If you like an available room, the lease is signed online and you can move in within 72 h of your first contact. No fees at any step.`,
      more: { href: "/candidature", label: "Fill in the form" },
    },
  },
];

/** Sous-ensemble ordonné pour la mini-FAQ d'une page money (4 questions, différentes par page). */
export function pickSituations(ids: SituationId[], lang: "fr" | "en"): QAPair[] {
  return ids.map((id) => {
    const s = situationsFaq.find((x) => x.id === id);
    if (!s) throw new Error(`Situation FAQ inconnue : ${id}`);
    return s[lang];
  });
}
