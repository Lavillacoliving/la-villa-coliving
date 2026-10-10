/**
 * Fiche de faits canonique de l'entité La Villa Coliving (Lot S1, brief « Socle entité », 05/09/2026).
 *
 * Pourquoi : les assistants IA lisaient des pages différentes du site et en tiraient des prix,
 * des minutes, des durées et des cautions différents (baseline 03/09 : 11 recommandations exactes
 * sur 58). Cette fiche est rendue à l'identique — au caractère près, FR et EN — par
 * <EntityFacts/> sur 14 pages money et 8 articles (D13), asserte par scripts/check-entity-facts.mjs
 * (base ↔ source ↔ HTML prérendu ↔ llms.txt) et réutilisée par scripts/build-llms-txt.mjs.
 *
 * Règles :
 *  - `src/data/stats.ts` reste le MAÎTRE numérique (prix dérivés du contrat en €, taux BCE figé,
 *    chambres par maison, surfaces, ménage, caution, bail) ; ce fichier assemble et rédige.
 *  - Textes = chaînes plates (pas de JSX), nombres formatés par `thousands()` (jamais toLocaleString :
 *    règle anti-#418), aucune date calculée, aucune donnée Supabase : fonction pure, rendu identique
 *    au build (Puppeteer) et au client.
 *  - Imports RELATIFS uniquement et zéro React : les scripts Node (esbuild) chargent ce module.
 *  - Une valeur non arbitrée porte le préfixe ENTITY_FACTS_PLACEHOLDER : visible en preview,
 *    refusée au build par check-entity-facts.mjs.
 *
 * Décisions Jérôme du 04-05/09/2026 (plan §2 bis) : D1-D3 trajets par maison · D4 20 min partout ·
 * D5 « Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis. » (révisée le 29/09/2026, plus d'engagement minimum) ·
 * D6 aucune promesse sur le garant, seule la caution (2 mois hors charges) · D7 loyer contractuel en € ·
 * D9 16-24 m² (bornes de v_public_rooms) · D10 Instagram la_villa_coliving_geneva, pas de Facebook ·
 * D12 le bloc ne cite que le prix d'appel « dès 1 370 CHF » (jamais 1 430).
 * (Lot L3, D4 Jérôme 09/10/2026) Puce « Avis : 4,8/5 sur Google (36 avis). » = GOOGLE_REVIEWS via STATS_DISPLAY.googleRating ;
 * jamais d'aggregateRating. Le lien « Voir les avis » vit dans les pages (hero, /candidature…), pas dans la fiche (chaînes plates).
 */
import {
  STATS,
  STATS_DISPLAY,
  GOOGLE_REVIEWS,
  STATS_SHARED_BATH,
  CONTRACT_EUR,
  ROOMS_BY_HOUSE,
  PRICE_SHARED_CHF_FR,
  PRICE_SHARED_CHF_EN,
  EUR_SHARED_FR_NUM,
  EUR_SHARED_EN_NUM,
  TRANSIT,
  GENEVA_COMMUTE_FORMULA,
  GOOGLE_REVIEWS_LINK_LABEL,
} from "./stats";
import { FOUNDERS, FOUNDING_DATE, LAVILLA_SAME_AS } from "../lib/structuredData";
import { PRICE_KEY_SENTENCE } from "./priceFacts";

export type EntityLang = "fr" | "en";
export type EntityHouseSlug = keyof typeof ROOMS_BY_HOUSE;

/** Incrémenter à chaque changement de texte : porté par data-entity-facts-version, comparé par la CI. */
// (Lot L1 « ingénierie des créneaux », 09/10/2026) Trajets réalignés sur TRANSIT (D1-L1), paragraphe sur la formule D1.
// (Lot L3, relecture adverse du 10/10/2026) La puce « Avis » expose son lien (reviewsLink) : la fiche ne publie jamais la note sans « Voir les avis ».
// (Lot L4 « justification du prix », D8, 10/10/2026) Puce « phrase-clé » A.4 (PRICE_KEY_SENTENCE, src/data/priceFacts.ts) après le loyer ;
// la même phrase ouvre le bloc tarifs de /tarifs — la garde l'attend donc 2× sur /tarifs, 1× ailleurs.
// (Lot L3, 10/10/2026) Puce « Avis : 4,8/5 sur Google (36 avis). » ajoutée (D4) — à incrémenter à chaque relevé mensuel
// (la date sert aussi de « Dernière mise à jour » dans llms.txt : garder une vraie date AAAA-MM-JJ, suffixe b, c… si besoin).
export const ENTITY_FACTS_VERSION = "2026-10-10";

/**
 * Phrase garant canonique (D0 amendement b, Jérôme 09/10/2026) — la SEULE formulation admise sur le site :
 * jamais « sans garant », jamais « toujours avant la visite ». Reprise par le bloc « Où chercher » (Ton dossier),
 * la réponse A.6 des articles (src/data/answerSlots.ts) et la FAQ « Il faut un garant ? » (situationsFaq).
 */
export const GUARANTOR_SENTENCE = {
  fr: "un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite",
  en: "a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit",
} as const;

/** Ligne courte de trajet d'une maison (A.1, D1-L1) : deux segments « a · b » (RoomDetailPage les affiche séparément). */
export function houseCommuteLine(slug: EntityHouseSlug, lang: EntityLang): string {
  const T = TRANSIT.byHouse[slug];
  const ev = T.eauxVivesDoorToDoorMin;
  if (slug === "leloft") {
    const tram = TRANSIT.byHouse.leloft.tramWalkMin;
    return lang === "en"
      ? `tram 17 stop ${tram} min on foot, Annemasse station ${T.stationWalkMin} min · Geneva Eaux-Vives in ${ev} min door-to-door`
      : `tram 17 à ${tram} min à pied, gare d'Annemasse à ${T.stationWalkMin} min · Genève-Eaux-Vives en ${ev} min porte-à-porte`;
  }
  return lang === "en"
    ? `Annemasse station ${T.stationWalkMin} min on foot · Geneva Eaux-Vives in ${ev} min door-to-door`
    : `gare d'Annemasse à ${T.stationWalkMin} min à pied · Genève-Eaux-Vives en ${ev} min porte-à-porte`;
}
/** Préfixe d'une valeur non encore arbitrée (bloquant au build). */
export const ENTITY_FACTS_PLACEHOLDER = "[FAIT À CONFIRMER";

export interface EntityHouse {
  slug: EntityHouseSlug;
  label: string;
  commune: string;
  rooms: number;
  /** Chambres à salle d'eau partagée entre 2 chambres (prix d'appel) — 4 à La Villa, 0 ailleurs. */
  sharedBathRooms: number;
  /** Équipements distinctifs, forme courte (cartes, houses.ts). */
  amenities: Record<EntityLang, string>;
  /** Trajet canonique (D1-L1, 09/10/2026) : ligne courte A.1 dérivée de TRANSIT, une phrase par maison. */
  commute: Record<EntityLang, string>;
  /** Quartier, quand la commune ne suffit pas (Le Lodge : Romagny) — phrases de commune du lot L1. */
  district?: Record<EntityLang, string>;
}

const MIN = STATS.genevaCenterMinutes;

export const ENTITY_HOUSES: readonly EntityHouse[] = [
  {
    slug: "lavilla",
    label: "La Villa",
    commune: "Ville-la-Grand",
    rooms: ROOMS_BY_HOUSE.lavilla,
    sharedBathRooms: STATS_SHARED_BATH.rooms,
    amenities: { fr: "piscine extérieure chauffée · sauna · salle de sport", en: "heated outdoor pool · sauna · gym" },
    commute: { fr: houseCommuteLine("lavilla", "fr"), en: houseCommuteLine("lavilla", "en") },
  },
  {
    slug: "leloft",
    label: "Le Loft",
    commune: "Ambilly",
    rooms: ROOMS_BY_HOUSE.leloft,
    sharedBathRooms: 0,
    amenities: { fr: "piscine intérieure chauffée · sauna · salle de sport", en: "heated indoor pool · sauna · gym" },
    commute: { fr: houseCommuteLine("leloft", "fr"), en: houseCommuteLine("leloft", "en") },
  },
  {
    slug: "lelodge",
    label: "Le Lodge",
    commune: "Annemasse",
    rooms: ROOMS_BY_HOUSE.lelodge,
    sharedBathRooms: 0,
    amenities: { fr: "piscine · sauna · chalet fitness", en: "pool · sauna · fitness chalet" },
    commute: { fr: houseCommuteLine("lelodge", "fr"), en: houseCommuteLine("lelodge", "en") },
    district: { fr: "quartier de Romagny", en: "Romagny district" },
  },
];

export const ENTITY_FACTS = {
  version: ENTITY_FACTS_VERSION,
  name: "La Villa Coliving",
  houses: ENTITY_HOUSES,
  totalHouses: STATS.totalHouses,
  totalRooms: STATS.totalRooms,
  surfaces: { min: STATS.roomSizeMin, max: STATS.roomSizeMax },
  price: {
    fromChf: STATS_SHARED_BATH.priceChf,
    fromEur: CONTRACT_EUR.sharedBath,
    standardChf: STATS.priceChf,
    standardEur: CONTRACT_EUR.standard,
    fr: { fromChf: PRICE_SHARED_CHF_FR, fromEur: `${EUR_SHARED_FR_NUM} €` },
    en: { fromChf: PRICE_SHARED_CHF_EN, fromEur: `€${EUR_SHARED_EN_NUM}` },
  },
  cleaningPerWeek: STATS.cleaningPerWeek,
  fiberSpeed: STATS.fiberSpeed,
  depositMonths: STATS.depositMonths,
  lease: { months: STATS.leaseDurationMonths, noticeMonths: STATS.noticePeriodMonths },
  genevaMinutes: MIN,
  transit: TRANSIT,
  commuteFormula: GENEVA_COMMUTE_FORMULA,
  guarantor: GUARANTOR_SENTENCE,
  founders: [FOUNDERS.jerome.name, FOUNDERS.fanny.name] as readonly string[],
  foundingDate: FOUNDING_DATE,
  foundingLabel: { fr: "octobre 2021", en: "October 2021" },
  totalResidents: STATS.totalResidents,
  responseHours: STATS.responseHours,
  sameAs: LAVILLA_SAME_AS,
  // (Lot L3, D4, 09/10/2026) Note Google — phrases prêtes (STATS_DISPLAY.googleRating) + url de la fiche pour llms.txt.
  googleReviews: {
    rating: GOOGLE_REVIEWS.rating,
    ratingEn: GOOGLE_REVIEWS.ratingEn,
    count: GOOGLE_REVIEWS.count,
    url: GOOGLE_REVIEWS.url,
    checkedOn: GOOGLE_REVIEWS.checkedOn,
    fr: STATS_DISPLAY.fr.googleRating,
    en: STATS_DISPLAY.en.googleRating,
  },
} as const;

export interface EntityFactsText {
  title: string;
  paragraph: string;
  bullets: readonly string[];
  cta: string;
  /** (Lot L3, D4) La puce « Avis : … » est TOUJOURS suivie du lien « Voir les avis » vers la fiche Google : le composant rend
   *  la phrase (un nœud texte) puis un <a> séparé — le libellé du lien n'entre pas dans entityFactsStrings (il vit aussi dans le hero). */
  reviewsLink: { bullet: string; label: string; href: string };
}

const houseList = (lang: EntityLang): string =>
  ENTITY_HOUSES.map((h, i) => {
    const rooms = lang === "en" ? `${h.rooms} rooms` : `${h.rooms} chambres`;
    const sep = i === ENTITY_HOUSES.length - 1 ? (lang === "en" ? " and " : " et ") : i === 0 ? "" : ", ";
    return `${sep}${h.label} ${lang === "en" ? "in" : "à"} ${h.commune} (${rooms})`;
  }).join("");

/** Le texte canonique — identique sur toutes les pages, langue par langue. */
export function entityFactsText(lang: EntityLang): EntityFactsText {
  const F = ENTITY_FACTS;
  const commutes = ENTITY_HOUSES.map((h) => `${h.label} — ${h.commute[lang]}`).join(" ; ");
  const reviewsBullet = { fr: `Avis : ${F.googleReviews.fr}.`, en: `Reviews: ${F.googleReviews.en}.` };
  if (lang === "en") {
    return {
      title: "La Villa Coliving — the essentials",
      paragraph:
        `La Villa Coliving is ${F.totalHouses} coliving houses on the Geneva border, French side: ${houseList("en")} — ` +
        `${F.totalRooms} private furnished rooms of ${F.surfaces.min} to ${F.surfaces.max} m², with a pool, sauna and gym in every house. ` +
        `${F.commuteFormula.en}.`,
      bullets: [
        `All-inclusive rent from ${F.price.en.fromChf}/month (contractual rent in euros: from ${F.price.en.fromEur}) — utilities, fibre up to ${F.fiberSpeed}, common-area cleaning ${F.cleaningPerWeek} times a week, pool, sauna, gym, streaming, yoga and events included.`,
        PRICE_KEY_SENTENCE.en,
        `No application fee, no agency fee. Deposit: ${F.depositMonths} months' rent, excluding charges.`,
        `${F.lease.months}-month lease: you're free to leave at any time with ${F.lease.noticeMonths} month's notice.`,
        `Commute: ${commutes}.`,
        reviewsBullet.en,
        `Who it's for: cross-border workers, expats and young professionals working in Geneva. Founded in ${F.foundingLabel.en} by ${F.founders.join(" and ")} and run directly by them — ${F.totalResidents}+ residents welcomed.`,
      ],
      cta: `Apply — reply within ${F.responseHours} h`,
      reviewsLink: { bullet: reviewsBullet.en, label: GOOGLE_REVIEWS_LINK_LABEL.en, href: F.googleReviews.url },
    };
  }
  return {
    title: "La Villa Coliving — l'essentiel",
    paragraph:
      `La Villa Coliving, c'est ${F.totalHouses} maisons de coliving à la frontière de Genève, côté France : ${houseList("fr")}, ` +
      `soit ${F.totalRooms} chambres meublées privées de ${F.surfaces.min} à ${F.surfaces.max} m², avec piscine, sauna et salle de sport dans chaque maison. ` +
      `${F.commuteFormula.fr}.`,
    bullets: [
      `Loyer tout inclus dès ${F.price.fr.fromChf}/mois (loyer contractuel en euros : dès ${F.price.fr.fromEur}) — charges, fibre jusqu'à ${F.fiberSpeed}, ménage des espaces communs ${F.cleaningPerWeek} fois par semaine, piscine, sauna, salle de sport, streaming, yoga et événements compris.`,
      PRICE_KEY_SENTENCE.fr,
      `0 € de frais de dossier, 0 € de frais d'agence. Caution : ${F.depositMonths} mois de loyer hors charges.`,
      `Bail de ${F.lease.months} mois : tu es libre de partir à tout moment avec ${F.lease.noticeMonths} mois de préavis.`,
      `Trajets : ${commutes}.`,
      reviewsBullet.fr,
      `Pour qui : frontaliers, expats et jeunes professionnels qui travaillent à Genève. Fondée en ${F.foundingLabel.fr} par ${F.founders.join(" et ")}, gérée en direct — ${F.totalResidents}+ résidents accueillis.`,
    ],
    cta: `Candidater — réponse sous ${F.responseHours} h`,
    reviewsLink: { bullet: reviewsBullet.fr, label: GOOGLE_REVIEWS_LINK_LABEL.fr, href: F.googleReviews.url },
  };
}

/** Toutes les chaînes rendues (les deux langues) — pour les gardes. */
export function entityFactsStrings(lang: EntityLang): string[] {
  const t = entityFactsText(lang);
  return [t.title, t.paragraph, ...t.bullets, t.cta];
}

/** Incohérences internes détectables sans base (la CI ajoute la comparaison avec v_public_rooms). */
export function entityFactsIssues(): string[] {
  const issues: string[] = [];
  const sum = ENTITY_HOUSES.reduce((n, h) => n + h.rooms, 0);
  if (sum !== ENTITY_FACTS.totalRooms) issues.push(`somme des chambres par maison (${sum}) ≠ totalRooms (${ENTITY_FACTS.totalRooms})`);
  if (ENTITY_HOUSES.length !== ENTITY_FACTS.totalHouses) issues.push(`nombre de maisons (${ENTITY_HOUSES.length}) ≠ totalHouses (${ENTITY_FACTS.totalHouses})`);
  for (const lang of ["fr", "en"] as const) {
    for (const s of entityFactsStrings(lang)) {
      if (s.includes(ENTITY_FACTS_PLACEHOLDER) || /\{\{|\[À VÉRIFIER/.test(s)) issues.push(`${lang} : placeholder dans « ${s.slice(0, 60)}… »`);
      if (/\d\.\d{3}/.test(s)) issues.push(`${lang} : séparateur de milliers non canonique dans « ${s.slice(0, 60)}… »`);
    }
  }
  return issues;
}

export function entityFactsHasPlaceholders(): boolean {
  return entityFactsIssues().some((i) => i.includes("placeholder"));
}
