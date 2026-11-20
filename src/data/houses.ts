import type { HouseKey } from "@/lib/availability";
import { ENTITY_HOUSES } from "@/data/entityFacts";
import { APPART } from "@/data/appart";
import { APPART_PLACE } from "@/lib/structuredData";
import { assertNever, type PlaceKey } from "@/data/places";

// Fiche minimale par maison, clé = slug canonique properties.slug SANS tiret
// (« lavilla », « leloft », « lelodge ») — le même qui circule dans
// ?property_interest= et que l'Edge send-candidature-email traduit en uuid.
// Partagée entre le bloc offre du blog (BlocOffre) et l'en-tête contextuel de
// /candidature (Lot 1d). Ni adresse ni prix ici : adresses dans lib/structuredData.ts,
// prix via data/stats.ts (source unique). (Lot S1, 05/09/2026) Le nombre de chambres
// et la commune viennent de src/data/entityFacts.ts — plus de « 10 chambres » en dur.
const facts = (slug: HouseKey) => {
  const h = ENTITY_HOUSES.find((x) => x.slug === slug);
  if (!h) throw new Error(`entityFacts : maison inconnue ${slug}`);
  return h;
};
const desc = (slug: HouseKey, lang: "fr" | "en", extra: string) => {
  const h = facts(slug);
  return lang === "en" ? `${h.rooms} rooms · ${extra} — ${h.commune}` : `${h.rooms} chambres · ${extra} — ${h.commune}`;
};

export const HOUSES: Record<HouseKey, { label: string; img: string; descFr: string; descEn: string }> = {
  lavilla: {
    label: "La Villa",
    img: "/images/la villa.webp",
    descFr: desc("lavilla", "fr", "piscine · jardin"),
    descEn: desc("lavilla", "en", "pool · garden"),
  },
  leloft: {
    label: "Le Loft",
    img: "/images/la villa coliving le loft piscine.webp",
    descFr: desc("leloft", "fr", "piscine intérieure"),
    descEn: desc("leloft", "en", "indoor pool"),
  },
  lelodge: {
    label: "Le Lodge",
    img: "/images/le lodge.webp",
    descFr: desc("lelodge", "fr", "sauna · gym"),
    descEn: desc("lelodge", "en", "sauna · gym"),
  },
};

/** (L'Appart, 13/11/2026) Carte minimale d'un lieu public, maison ou L'Appart : nom, image de vignette, commune. */
export interface PlaceCard {
  label: string;
  img: string;
  commune: string;
}

/**
 * Carte d'un lieu public (en-tête contextuel de /candidature, sections « L'Appart » des listes). Les maisons : HOUSES et
 * ENTITY_HOUSES, inchangés. L'Appart : son nom, sa vignette (la cuisine côté plaque, image du haut de sa page) et sa commune —
 * jamais la description « piscine · jardin » d'une maison.
 */
export function placeCard(place: PlaceKey): PlaceCard {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return { label: HOUSES[place].label, img: HOUSES[place].img, commune: facts(place).commune };
    case "lappart":
      return { label: APPART.name, img: APPART_PLACE.image, commune: APPART.commune };
    default:
      return assertNever(place);
  }
}
