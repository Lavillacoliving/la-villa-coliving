// Données structurées (schema.org / JSON-LD) — source unique.
// Règle d'or AEO : le texte d'une réponse balisée doit être IDENTIQUE au texte visible.
// buildFaqPageSchema() construit donc le FAQPage à partir des mêmes paires {q,a} affichées.

import { STATS } from "@/data/stats";

const SITE = "https://www.lavillacoliving.com";

// Coordonnées publiques — confirmées par Jérôme (2026-06-05).
export const LAVILLA_PHONE = "+33664315134";
export const LAVILLA_EMAIL = "contact@lavillacoliving.com";

/** Une question / réponse, déjà résolue dans la langue de la page. */
export type QAPair = { q: string; a: string };

export interface HouseInfo {
  slug: string;
  name: string;
  url: string;
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  /** Coordonnées au centre de la commune (à affiner en rooftop-exact via Google Maps si besoin). */
  geo: { lat: number; lng: number };
}

/** Les 3 maisons — source unique pour le schema (adresses confirmées). */
export const HOUSES: HouseInfo[] = [
  {
    slug: "lavilla",
    name: "La Villa — Ville-la-Grand",
    url: `${SITE}/lavilla`,
    streetAddress: "34 rue du Foron",
    addressLocality: "Ville-la-Grand",
    postalCode: "74100",
    geo: { lat: 46.2031, lng: 6.2475 },
  },
  {
    slug: "leloft",
    name: "Le Loft — Ambilly",
    url: `${SITE}/leloft`,
    streetAddress: "1 rue des Marronniers",
    addressLocality: "Ambilly",
    postalCode: "74100",
    geo: { lat: 46.194, lng: 6.223 },
  },
  {
    slug: "lelodge",
    name: "Le Lodge — Annemasse",
    url: `${SITE}/lelodge`,
    streetAddress: "8 rue de Romagny",
    addressLocality: "Annemasse",
    postalCode: "74100",
    geo: { lat: 46.1958, lng: 6.2364 },
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
    name: "La Villa Coliving",
    description: en
      ? `All-inclusive premium coliving near Geneva: ${STATS.totalHouses} houses (${STATS.totalRooms} furnished rooms) ${STATS.genevaCenterMinutes} minutes from Geneva city center, on the French side, with pool, sauna and gym in every house.`
      : `Coliving premium tout inclus près de Genève : ${STATS.totalHouses} maisons (${STATS.totalRooms} chambres meublées) à ${STATS.genevaCenterMinutes} minutes du centre de Genève, côté France, avec piscine, sauna et salle de sport dans chaque maison.`,
    url: `${SITE}/`,
    logo: `${SITE}/logos/logo-full.png`,
    image: `${SITE}/images/villa_portrait.webp`,
    telephone: LAVILLA_PHONE,
    email: LAVILLA_EMAIL,
    priceRange: en ? `from ${STATS.priceChf} CHF/month` : `dès ${STATS.priceChf} CHF/mois`,
    areaServed: ["Genève", "Annemasse", "Ville-la-Grand", "Ambilly", "Grand Genève"],
    knowsLanguage: ["fr", "en"],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: en ? "Swimming pool" : "Piscine", value: true },
      { "@type": "LocationFeatureSpecification", name: "Sauna", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "Gym" : "Salle de sport", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? `Fiber internet up to ${STATS.fiberSpeed}` : `Internet fibre jusqu'à ${STATS.fiberSpeed}`, value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "Common areas cleaning included" : "Ménage des parties communes inclus", value: true },
    ],
    sameAs: ["https://www.instagram.com/lavillacoliving/"],
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

/** Offre « chambre tout inclus » — prix sourcé depuis STATS (single source). */
export function buildRoomOfferSchema(opts: { name: string; description: string; url: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: opts.name,
    description: opts.description,
    price: String(STATS.priceChf),
    priceCurrency: "CHF",
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
  csvUrl: string;
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
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: opts.csvUrl,
      },
    ],
  };
}
