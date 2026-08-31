// Données structurées (schema.org / JSON-LD) — source unique.
// Règle d'or AEO : le texte d'une réponse balisée doit être IDENTIQUE au texte visible.
// buildFaqPageSchema() construit donc le FAQPage à partir des mêmes paires {q,a} affichées.

import { STATS, STATS_SHARED_BATH, PRICE_FR_NUM, PRICE_EN_NUM, PRICE_SHARED_FR_NUM, PRICE_SHARED_EN_NUM } from "@/data/stats";

const SITE = "https://www.lavillacoliving.com";

/**
 * @id unique de l'entité La Villa Coliving dans le knowledge graph.
 * Porté par : l'Organization de /qui-sommes-nous, le LodgingBusiness de l'accueil
 * et le LocalBusiness générique de SEO.tsx → Google fusionne les trois en une seule fiche.
 */
export const ORG_ID = `${SITE}/#organization`;

/**
 * Profils publics officiels — source unique pour tous les `sameAs`.
 * Le lien share.google est la fiche Google Business (une seule fiche, confirmé 04/08).
 */
export const LAVILLA_SAME_AS = [
  "https://www.instagram.com/lavillacoliving/",
  "https://www.facebook.com/lavillacoliving",
  "https://share.google/OR9wy40wVx80aeQei",
];

// Coordonnées publiques — confirmées par Jérôme (2026-06-05).
export const LAVILLA_PHONE = "+33664315134";
export const LAVILLA_EMAIL = "contact@lavillacoliving.com";

/** Une question / réponse, déjà résolue dans la langue de la page. */
export type QAPair = { q: string; a: string };

/**
 * Adresse postale du siège — source unique.
 * `addressRegion` inclus : le bloc LocalBusiness de SEO.tsx le portait déjà,
 * pas HOUSES[0] ; les deux divergaient.
 */
export const LAVILLA_POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "34 rue du Foron",
  addressLocality: "Ville-la-Grand",
  addressRegion: "Haute-Savoie",
  postalCode: "74100",
  addressCountry: "FR",
} as const;

export interface HouseInfo {
  slug: string;
  name: string;
  url: string;
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  /** Coordonnées rooftop-exactes (Base Adresse Nationale, géocodées le 15/08/2026, score > 0,95). */
  geo: { lat: number; lng: number };
}

/** Les 3 maisons — source unique pour le schema (adresses confirmées, geo BAN rooftop). */
export const HOUSES: HouseInfo[] = [
  {
    slug: "lavilla",
    name: "La Villa — Ville-la-Grand",
    url: `${SITE}/lavilla`,
    streetAddress: "34 rue du Foron",
    addressLocality: "Ville-la-Grand",
    postalCode: "74100",
    geo: { lat: 46.205146, lng: 6.232634 },
  },
  {
    slug: "leloft",
    name: "Le Loft — Ambilly",
    url: `${SITE}/leloft`,
    streetAddress: "1 rue des Marronniers",
    addressLocality: "Ambilly",
    postalCode: "74100",
    geo: { lat: 46.196367, lng: 6.226278 },
  },
  {
    slug: "lelodge",
    name: "Le Lodge — Annemasse",
    url: `${SITE}/lelodge`,
    streetAddress: "8 rue de Romagny",
    addressLocality: "Annemasse",
    postalCode: "74100",
    geo: { lat: 46.194519, lng: 6.241576 },
  },
];

/**
 * FAQPage construit depuis les paires VISIBLES → garantit JSON-LD == texte affiché
 * (condition #2 du playbook AEO). À passer à <SEO jsonLd> ou via un <Helmet> dédié.
 */
export function buildFaqPageSchema(items: QAPair[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * Entité mère de l'accueil : LodgingBusiness avec les 3 maisons en `department`.
 * PAS d'`aggregateRating` (la note 4,9 vient d'un NPS interne → non balisable).
 * Prix / fibre sourcés depuis STATS pour rester cohérents partout.
 */
export function buildHomeLodgingBusinessSchema(language: "fr" | "en" = "fr"): Record<string, unknown> {
  const en = language === "en";
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": ORG_ID,
    name: "La Villa Coliving",
    description: en
      ? `All-inclusive premium coliving near Geneva: ${STATS.totalHouses} houses (${STATS.totalRooms} furnished rooms) ${STATS.genevaCenterMinutes} minutes from Geneva city center, on the French side, with pool, sauna and gym in every house.`
      : `Coliving premium tout inclus près de Genève : ${STATS.totalHouses} maisons (${STATS.totalRooms} chambres meublées) à ${STATS.genevaCenterMinutes} minutes du centre de Genève, côté France, avec piscine, sauna et salle de sport dans chaque maison.`,
    url: `${SITE}/`,
    logo: `${SITE}/logos/logo-full.png`,
    image: `${SITE}/images/villa_portrait.webp`,
    telephone: LAVILLA_PHONE,
    email: LAVILLA_EMAIL,
    priceRange: en ? `CHF ${PRICE_SHARED_EN_NUM}–${PRICE_EN_NUM}/month` : `${PRICE_SHARED_FR_NUM}–${PRICE_FR_NUM} CHF/mois`,
    // Offre citable par les moteurs et les IA (AI Overviews cite déjà nos prix —
    // autant qu'ils viennent d'une donnée structurée exacte). Prix via STATS :
    // deux niveaux depuis le 01/09/2026 → AggregateOffer 1 390–1 440.
    makesOffer: {
      "@type": "AggregateOffer",
      name: en
        ? "All-inclusive furnished room in coliving near Geneva"
        : "Chambre meublée tout inclus en coliving près de Genève",
      description: en
        ? `Furnished room of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², all utilities, fibre internet, cleaning, pool, sauna and gym included. No application fee.`
        : `Chambre meublée de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², charges, internet fibre, ménage, piscine, sauna et salle de sport inclus. Sans frais de dossier.`,
      lowPrice: String(STATS_SHARED_BATH.priceChf),
      highPrice: String(STATS.priceChf),
      priceCurrency: "CHF",
      offerCount: STATS.totalRooms,
      availability: "https://schema.org/InStock",
      url: `${SITE}${en ? "/en" : ""}/tarifs`,
      seller: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
    },
    areaServed: ["Genève", "Annemasse", "Ville-la-Grand", "Ambilly", "Grand Genève"],
    knowsLanguage: ["fr", "en"],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: en ? "Swimming pool" : "Piscine", value: true },
      { "@type": "LocationFeatureSpecification", name: "Sauna", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "Gym" : "Salle de sport", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? `Fiber internet up to ${STATS.fiberSpeed}` : `Internet fibre jusqu'à ${STATS.fiberSpeed}`, value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "Common areas cleaning included" : "Ménage des parties communes inclus", value: true },
    ],
    sameAs: LAVILLA_SAME_AS,
    numberOfRooms: STATS.totalRooms,
    // E-E-A-T : mêmes champs identité que le LocalBusiness générique (qu'il remplace
    // sur l'accueil depuis le 15/08 — prop omitLocalBusiness de SEO.tsx).
    foundingDate: FOUNDING_DATE,
    founder: [
      buildFounderPersonSchema(FOUNDERS.jerome, language),
      buildFounderPersonSchema(FOUNDERS.fanny, language),
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: LAVILLA_EMAIL,
      telephone: LAVILLA_PHONE,
      contactType: "customer service",
      availableLanguage: ["French", "English"],
    },
    // `address` racine — Google la réclame sur LodgingBusiness (« Rich results
    // validation error » relevé au crawl du 23/07/2026 sur / et /en). Les
    // adresses par maison vivaient déjà dans `department[].address`, mais
    // l'entité mère n'en avait aucune.
    address: LAVILLA_POSTAL_ADDRESS,
    geo: { "@type": "GeoCoordinates", latitude: HOUSES[0].geo.lat, longitude: HOUSES[0].geo.lng },
    department: HOUSES.map((h) => ({
      "@type": "LodgingBusiness",
      name: h.name,
      url: h.url,
      address: {
        "@type": "PostalAddress",
        streetAddress: h.streetAddress,
        addressLocality: h.addressLocality,
        postalCode: h.postalCode,
        addressCountry: "FR",
      },
      geo: { "@type": "GeoCoordinates", latitude: h.geo.lat, longitude: h.geo.lng },
    })),
  };
}

/**
 * Fondateurs — source unique pour les bylines blog, la page /qui-sommes-nous et les
 * schemas Person. `dbAuthorName` = valeur ASCII du champ blog_posts.author (pipeline
 * SQL ASCII-safe) ; `name` = graphie affichée. sameAs LinkedIn = corroboration
 * d'identité hors site (E-E-A-T), URLs confirmées par Jérôme (2026-07-06).
 */
export interface Founder {
  name: string;
  dbAuthorName: string;
  linkedin: string;
  jobTitle: { fr: string; en: string };
}

export const FOUNDERS: Record<"jerome" | "fanny", Founder> = {
  jerome: {
    name: "Jérôme Austin",
    dbAuthorName: "Jerome Austin",
    linkedin: "https://www.linkedin.com/in/jeromeaustin1/",
    jobTitle: {
      fr: "Cofondateur de La Villa Coliving",
      en: "Co-founder of La Villa Coliving",
    },
  },
  fanny: {
    name: "Fanny Bela",
    dbAuthorName: "Fanny Bela",
    linkedin: "https://www.linkedin.com/in/fanny-bela-24793138/",
    jobTitle: {
      fr: "Cofondatrice de La Villa Coliving",
      en: "Co-founder of La Villa Coliving",
    },
  },
};

/** Mois de commercialisation de la première maison (confirmé Jérôme : octobre 2021). */
export const FOUNDING_DATE = "2021-10";

/**
 * ⚠️ INTERRUPTEUR — `true` depuis le 04/08/2026 : la page /qui-sommes-nous est routée
 * (branche feat/qui-sommes-nous-preview). Bylines et blocs auteur pointent vers la page,
 * et les schemas Person portent son `url`.
 */
export const ABOUT_PAGE_LIVE = true;

/** Retrouve un fondateur depuis le champ `author` d'un article (sinon null → auteur générique). */
export function getFounderByAuthorName(author: string | null | undefined): Founder | null {
  if (!author) return null;
  const a = author.trim().toLowerCase();
  if (a === "jerome austin" || a === "jérôme austin" || a === "jérôme" || a === "jerome") return FOUNDERS.jerome;
  if (a === "fanny bela" || a === "fanny") return FOUNDERS.fanny;
  return null;
}

/** Person schema d'un fondateur — sameAs = LinkedIn ; url = page fondateurs quand elle est en prod. */
export function buildFounderPersonSchema(founder: Founder, language: "fr" | "en" = "fr"): Record<string, unknown> {
  return {
    "@type": "Person",
    name: founder.name,
    jobTitle: founder.jobTitle[language],
    ...(ABOUT_PAGE_LIVE ? { url: `${SITE}/qui-sommes-nous` } : {}),
    sameAs: [founder.linkedin],
    worksFor: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
  };
}

/**
 * Schema de la page « Qui sommes-nous » : Organization complète (foundingDate,
 * founder → 2 Person, legalName) dans un @graph avec la fiche AboutPage.
 * PAS d'aggregateRating (règle du site : note 4,9 = enquêtes internes, non balisable).
 */
export function buildAboutPageSchema(language: "fr" | "en" = "fr"): Record<string, unknown> {
  const en = language === "en";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        url: `${SITE}${en ? "/en" : ""}/qui-sommes-nous`,
        name: en ? "Who we are — La Villa Coliving" : "Qui sommes-nous — La Villa Coliving",
        inLanguage: language,
        mainEntity: { "@id": ORG_ID },
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "La Villa Coliving",
        legalName: "SCI Sleep In",
        url: SITE,
        logo: `${SITE}/logos/logo-full.png`,
        image: `${SITE}/images/villa_portrait.webp`,
        foundingDate: FOUNDING_DATE,
        founder: [
          buildFounderPersonSchema(FOUNDERS.jerome, language),
          buildFounderPersonSchema(FOUNDERS.fanny, language),
        ],
        email: LAVILLA_EMAIL,
        telephone: LAVILLA_PHONE,
        areaServed: ["Genève", "Annemasse", "Ville-la-Grand", "Ambilly", "Grand Genève"],
        sameAs: ["https://www.instagram.com/lavillacoliving/"],
        description: en
          ? `Boutique coliving founded in ${STATS.foundedYear} and personally run by its two founders: ${STATS.totalHouses} houses, ${STATS.totalRooms} rooms near Geneva, ${STATS.totalResidents}+ residents welcomed.`
          : `Coliving boutique fondé en ${STATS.foundedYear} et géré en direct par ses deux fondateurs : ${STATS.totalHouses} maisons, ${STATS.totalRooms} chambres près de Genève, ${STATS.totalResidents}+ résidents accueillis.`,
      },
    ],
  };
}

/** Fil d'ariane (BreadcrumbList) — items {name, url} déjà localisés. */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** Offre agrégée « chambres tout inclus » — deux niveaux depuis le 01/09/2026, prix sourcés depuis STATS (single source). */
export function buildRoomsAggregateOfferSchema(opts: { name: string; description: string; url: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    name: opts.name,
    description: opts.description,
    lowPrice: String(STATS_SHARED_BATH.priceChf),
    highPrice: String(STATS.priceChf),
    priceCurrency: "CHF",
    offerCount: STATS.totalRooms,
    availability: "https://schema.org/InStock",
    url: opts.url,
    seller: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
  };
}

/**
 * Dataset (schema.org) — premier usage Dataset du site, pour l'observatoire.
 * `distribution` pointe le CSV téléchargeable. La Villa = éditrice neutre (creator/publisher),
 * jamais dans les chiffres. Licence CC-BY pour encourager la citation presse.
 */
export function buildDatasetSchema(opts: {
  name: string;
  description: string;
  url: string;
  csvUrls: string[];
  datePublished: string;
  dateModified: string;
  language: "fr" | "en";
  spatial: string[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.language,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    creator: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
    publisher: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    keywords:
      opts.language === "en"
        ? ["cross-border housing", "Geneva", "rent", "commute time", "Léman Express", "Greater Geneva"]
        : ["logement frontalier", "Genève", "loyer", "temps de trajet", "Léman Express", "Genevois français"],
    spatialCoverage: opts.spatial.map((name) => ({ "@type": "Place", name })),
    distribution: opts.csvUrls.map((contentUrl) => ({
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl,
    })),
  };
}
