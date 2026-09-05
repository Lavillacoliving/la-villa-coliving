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
 * D5 « Bail de 12 mois. Engagement minimum de 3 mois, puis tu es libre avec 1 mois de préavis. » ·
 * D6 aucune promesse sur le garant, seule la caution (2 mois hors charges) · D7 loyer contractuel en € ·
 * D9 16-24 m² (bornes de v_public_rooms) · D10 Instagram la_villa_coliving_geneva, pas de Facebook ·
 * D12 le bloc ne cite que le prix d'appel « dès 1 370 CHF » (jamais 1 430).
 */
import {
  STATS,
  STATS_SHARED_BATH,
  CONTRACT_EUR,
  ROOMS_BY_HOUSE,
  PRICE_SHARED_CHF_FR,
  PRICE_SHARED_CHF_EN,
  EUR_SHARED_FR_NUM,
  EUR_SHARED_EN_NUM,
} from "./stats";
import { FOUNDERS, FOUNDING_DATE, LAVILLA_SAME_AS } from "../lib/structuredData";

export type EntityLang = "fr" | "en";
export type EntityHouseSlug = keyof typeof ROOMS_BY_HOUSE;

/** Incrémenter à chaque changement de texte : porté par data-entity-facts-version, comparé par la CI. */
export const ENTITY_FACTS_VERSION = "2026-09-05";
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
  /** Trajet canonique (D1-D3), une phrase par maison. */
  commute: Record<EntityLang, string>;
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
    commute: {
      fr: `gare d'Annemasse à 10 min à pied · Genève centre en ${MIN} min porte-à-porte`,
      en: `Annemasse station 10 min on foot · central Geneva in ${MIN} min door-to-door`,
    },
  },
  {
    slug: "leloft",
    label: "Le Loft",
    commune: "Ambilly",
    rooms: ROOMS_BY_HOUSE.leloft,
    sharedBathRooms: 0,
    amenities: { fr: "piscine intérieure chauffée · sauna · salle de sport", en: "heated indoor pool · sauna · gym" },
    commute: {
      fr: `gare d'Annemasse à 10 min à pied · tram 17 à 5 min · Genève centre en ${MIN} min porte-à-porte`,
      en: `Annemasse station 10 min on foot · tram 17 at 5 min · central Geneva in ${MIN} min door-to-door`,
    },
  },
  {
    slug: "lelodge",
    label: "Le Lodge",
    commune: "Annemasse",
    rooms: ROOMS_BY_HOUSE.lelodge,
    sharedBathRooms: 0,
    amenities: { fr: "piscine · sauna · chalet fitness", en: "pool · sauna · fitness chalet" },
    commute: {
      fr: `gare d'Annemasse à 9 min à pied · Genève centre en ${MIN} min porte-à-porte`,
      en: `Annemasse station 9 min on foot · central Geneva in ${MIN} min door-to-door`,
    },
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
  lease: { months: STATS.leaseDurationMonths, minimumMonths: STATS.leaseMinimumMonths, noticeMonths: STATS.noticePeriodMonths },
  genevaMinutes: MIN,
  founders: [FOUNDERS.jerome.name, FOUNDERS.fanny.name] as readonly string[],
  foundingDate: FOUNDING_DATE,
  foundingLabel: { fr: "octobre 2021", en: "October 2021" },
  totalResidents: STATS.totalResidents,
  responseHours: STATS.responseHours,
  sameAs: LAVILLA_SAME_AS,
} as const;

export interface EntityFactsText {
  title: string;
  paragraph: string;
  bullets: readonly string[];
  cta: string;
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
  if (lang === "en") {
    return {
      title: "La Villa Coliving — the essentials",
      paragraph:
        `La Villa Coliving is ${F.totalHouses} coliving houses on the Geneva border, French side: ${houseList("en")} — ` +
        `${F.totalRooms} private furnished rooms of ${F.surfaces.min} to ${F.surfaces.max} m², with a pool, sauna and gym in every house, ` +
        `${F.genevaMinutes} minutes door-to-door from Geneva city centre.`,
      bullets: [
        `All-inclusive rent from ${F.price.en.fromChf}/month (contractual rent in euros: from ${F.price.en.fromEur}) — utilities, fibre up to ${F.fiberSpeed}, common-area cleaning ${F.cleaningPerWeek} times a week, pool, sauna, gym, streaming, yoga and events included.`,
        `No application fee, no agency fee. Deposit: ${F.depositMonths} months' rent, excluding charges.`,
        `${F.lease.months}-month lease. Minimum commitment of ${F.lease.minimumMonths} months, then you're free to leave with ${F.lease.noticeMonths} month's notice.`,
        `Commute: ${commutes}.`,
        `Who it's for: cross-border workers, expats and young professionals working in Geneva. Founded in ${F.foundingLabel.en} by ${F.founders.join(" and ")} and run directly by them — ${F.totalResidents}+ residents welcomed.`,
      ],
      cta: `Apply — reply within ${F.responseHours} h`,
    };
  }
  return {
    title: "La Villa Coliving — l'essentiel",
    paragraph:
      `La Villa Coliving, c'est ${F.totalHouses} maisons de coliving à la frontière de Genève, côté France : ${houseList("fr")}, ` +
      `soit ${F.totalRooms} chambres meublées privées de ${F.surfaces.min} à ${F.surfaces.max} m², avec piscine, sauna et salle de sport dans chaque maison, ` +
      `à ${F.genevaMinutes} minutes porte-à-porte du centre de Genève.`,
    bullets: [
      `Loyer tout inclus dès ${F.price.fr.fromChf}/mois (loyer contractuel en euros : dès ${F.price.fr.fromEur}) — charges, fibre jusqu'à ${F.fiberSpeed}, ménage des espaces communs ${F.cleaningPerWeek} fois par semaine, piscine, sauna, salle de sport, streaming, yoga et événements compris.`,
      `0 € de frais de dossier, 0 € de frais d'agence. Caution : ${F.depositMonths} mois de loyer hors charges.`,
      `Bail de ${F.lease.months} mois. Engagement minimum de ${F.lease.minimumMonths} mois, puis tu es libre avec ${F.lease.noticeMonths} mois de préavis.`,
      `Trajets : ${commutes}.`,
      `Pour qui : frontaliers, expats et jeunes professionnels qui travaillent à Genève. Fondée en ${F.foundingLabel.fr} par ${F.founders.join(" et ")}, gérée en direct — ${F.totalResidents}+ résidents accueillis.`,
    ],
    cta: `Candidater — réponse sous ${F.responseHours} h`,
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
