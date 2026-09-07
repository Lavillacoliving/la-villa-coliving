import type { QAPair } from "@/lib/structuredData";
import { STATS, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN } from "@/data/stats";
import { pickSituations } from "@/data/faq/situationsFaq";

// FAQ de /annemasse-colocation — les 7 questions historiques (cible « colocation annemasse »), sorties de la
// page le 07/09/2026 (Lot C2) : désormais FR **et** EN (la route /en servait la FAQ française et son JSON-LD),
// réponses présentes dans le DOM via FaqSection, bail aligné sur la décision D5 (12 mois, minimum 3, préavis 1),
// permis G renvoyé à l'OCPM plutôt qu'un délai affirmé. + 4 « situations réelles » (P10, Cornavin, P1, coliving).
// Trajet train (décision Jérôme 07/09, relecture C2) : Eaux-Vives 8 min, Cornavin ≈ 20 min — les « 15 min » des pages maisons/Annemasse sont à aligner en S2.
export const annemasseColocationFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Combien coûte une colocation à Annemasse chez La Villa Coliving ?",
      a: `Nos chambres privatives à Annemasse Agglo (Ville-la-Grand, Ambilly, Annemasse) sont à partir de ${PRICE_SHARED_CHF_FR}/mois tout inclus. Le prix comprend le loyer, les charges (eau, électricité, chauffage), la fibre jusqu'à 8 Gb/s, le ménage ${STATS.cleaningPerWeek} fois par semaine des communs, l'accès à la piscine chauffée, à la salle de sport et au sauna, les cours de yoga et fitness privés hebdomadaires, et les événements communautaires mensuels. Pas de frais d'agence, pas de frais de dossier.`,
    },
    {
      q: "Combien de temps pour aller à Genève depuis Annemasse ?",
      a: "Depuis la gare d'Annemasse, le Léman Express direct (sans correspondance) met 8 minutes jusqu'à Genève Eaux-Vives et 20 minutes environ jusqu'à Cornavin. En voiture, compte 15-20 min selon la douane (Moillesulaz est la plus rapide). Le Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse) dessert aussi le centre de Genève. L'aéroport de Genève est à 25-30 min en voiture.",
    },
    {
      q: "Quel quartier d'Annemasse Agglo choisir : Ville-la-Grand, Ambilly ou Annemasse ?",
      a: "Cela dépend de ta priorité. Ambilly est la commune la plus proche de la frontière suisse (Moillesulaz à 5 min à pied, Tram 17 à 5 min — idéal si tu veux marcher ou pédaler vers Genève). Ville-la-Grand est résidentielle et calme, frontière mitoyenne, idéale pour ceux qui cherchent du vert (réserve naturelle du Foron à la porte). Annemasse centre (quartier Romagny pour Le Lodge) offre la proximité de la gare Léman Express et de toutes les commodités urbaines.",
      more: { href: "/blog/vivre-a-annemasse-quand-on-travaille-a-geneve", label: "Vivre à Annemasse quand on travaille à Genève" },
    },
    {
      q: "Faut-il un permis G pour vivre à Annemasse et travailler à Genève ?",
      a: "Oui : pour travailler à Genève en habitant côté France, tu as besoin d'un permis G (permis frontalier). Ton employeur suisse en fait la demande une fois le contrat signé ; Annemasse Agglo se situe dans la zone frontalière éligible. Les conditions et les délais sont ceux des autorités genevoises (OCPM, ge.ch).",
    },
    {
      q: "Quelle est la durée du bail à Annemasse ?",
      a: `Le bail est un contrat de location meublée de ${STATS.leaseDurationMonths} mois renouvelable, avec un engagement minimum de ${STATS.leaseMinimumMonths} mois puis un préavis d'${STATS.noticePeriodMonths} mois. Cela convient aux frontaliers qui s'installent durablement comme à ceux en période d'essai à Genève. Le bail respecte le cadre français (loi Alur), avec une caution de ${STATS.depositMonths} mois hors charges et aucun frais d'agence.`,
    },
    {
      q: "Quelle différence entre colocation classique et coliving à Annemasse ?",
      a: `Une colocation classique implique généralement de gérer soi-même les charges (électricité, eau, internet), le ménage, l'entretien, et de meubler sa chambre. Notre coliving à Annemasse inclut tout dans un seul loyer : charges, fibre, ménage ${STATS.cleaningPerWeek}x/semaine, mobilier design, accès aux espaces premium (piscine, gym, sauna), événements communautaires. Le prix au mètre carré reste cohérent avec une colocation classique haut de gamme à Annemasse, mais sans aucune mauvaise surprise.`,
    },
    {
      q: "Comment réserver une chambre à Annemasse ?",
      a: `Remplis le formulaire sur notre page Candidature. Nous te rappelons sous ${STATS.responseHours} h pour un échange (motivation, contexte pro, disponibilité). Si le fit est bon, une visite est organisée dans la résidence qui correspond à ton profil (La Villa à Ville-la-Grand, Le Loft à Ambilly, Le Lodge à Annemasse Romagny). L'emménagement peut se faire en 2 à 4 semaines selon les disponibilités.`,
    },
    ...pickSituations(["annemasse-safe", "minutes-to-cornavin", "job-in-a-month", "coliving-or-flatshare"], "fr"),
  ],
  en: [
    {
      q: "How much does a flatshare room in Annemasse cost at La Villa Coliving?",
      a: `Our private rooms in Annemasse Agglo (Ville-la-Grand, Ambilly, Annemasse) start at ${PRICE_SHARED_CHF_EN}/month all inclusive. The price covers rent, bills (water, electricity, heating), fibre up to 8 Gb/s, cleaning of the common areas ${STATS.cleaningPerWeek} times a week, access to the heated pool, gym and sauna, weekly private yoga and fitness classes, and monthly community events. No agency fee, no application fee.`,
    },
    {
      q: "How long does it take to get to Geneva from Annemasse?",
      a: "From Annemasse station, the direct Léman Express (no change) takes 8 minutes to Geneva Eaux-Vives and about 20 minutes to Cornavin. By car, count 15-20 min depending on the border crossing (Moillesulaz is the fastest). TPG tram 17 (Lancy-Pont-Rouge ↔ Annemasse) also serves central Geneva. Geneva airport is 25-30 min by car.",
    },
    {
      q: "Which part of Annemasse Agglo should you choose: Ville-la-Grand, Ambilly or Annemasse?",
      a: "It depends on your priority. Ambilly is the closest to the Swiss border (Moillesulaz a 5-minute walk away, tram 17 at 5 minutes: ideal if you want to walk or cycle to Geneva). Ville-la-Grand is residential and quiet, right on the border, ideal if you want greenery (the Foron nature reserve on your doorstep). Central Annemasse (the Romagny district for Le Lodge) gives you the Léman Express station and every urban convenience nearby.",
      more: { href: "/blog/vivre-a-annemasse-quand-on-travaille-a-geneve", label: "Living in Annemasse when you work in Geneva" },
    },
    {
      q: "Do you need a G permit to live in Annemasse and work in Geneva?",
      a: "Yes: to work in Geneva while living on the French side you need a G permit (cross-border permit). Your Swiss employer applies for it once your contract is signed; Annemasse Agglo is within the eligible border zone. Conditions and processing times are those of the Geneva authorities (OCPM, ge.ch).",
    },
    {
      q: "How long is the lease in Annemasse?",
      a: `A ${STATS.leaseDurationMonths}-month renewable furnished lease with a ${STATS.leaseMinimumMonths}-month minimum commitment, then ${STATS.noticePeriodMonths} month's notice. It suits cross-border workers settling in for good as well as people on a probation period in Geneva. The lease follows French law (loi Alur), with a deposit of ${STATS.depositMonths} months' rent excluding charges and no agency fee.`,
    },
    {
      q: "What is the difference between a classic flatshare and coliving in Annemasse?",
      a: `In a classic flatshare you usually manage the bills (electricity, water, internet), the cleaning and the upkeep yourself, and furnish your room. Our coliving in Annemasse includes everything in one rent: bills, fibre, cleaning ${STATS.cleaningPerWeek} times a week, designer furniture, access to the premium spaces (pool, gym, sauna), community events. The price per square metre stays in line with a high-end classic flatshare in Annemasse, with no nasty surprises.`,
    },
    {
      q: "How do I book a room in Annemasse?",
      a: `Fill in the form on our application page. We call you back within ${STATS.responseHours} h for a chat (motivation, work context, availability). If it's a good fit, we organise a visit of the house that matches your profile (La Villa in Ville-la-Grand, Le Loft in Ambilly, Le Lodge in Annemasse Romagny). Move-in can happen within 2 to 4 weeks depending on availability.`,
    },
    ...pickSituations(["annemasse-safe", "minutes-to-cornavin", "job-in-a-month", "coliving-or-flatshare"], "en"),
  ],
};
