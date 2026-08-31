import type { HouseKey } from "@/lib/availability";

// Fiche minimale par maison, clé = slug canonique properties.slug SANS tiret
// (« lavilla », « leloft », « lelodge ») — le même qui circule dans
// ?property_interest= et que l'Edge send-candidature-email traduit en uuid.
// Partagée entre le bloc offre du blog (BlocOffre) et l'en-tête contextuel de
// /candidature (Lot 1d). Ni adresse ni prix ici : adresses dans lib/entities.ts,
// prix via data/stats.ts (source unique).
export const HOUSES: Record<HouseKey, { label: string; img: string; descFr: string; descEn: string }> = {
  lavilla: {
    label: "La Villa",
    img: "/images/la villa.webp",
    descFr: "10 chambres · piscine · jardin — Ville-la-Grand",
    descEn: "10 rooms · pool · garden — Ville-la-Grand",
  },
  leloft: {
    label: "Le Loft",
    img: "/images/la villa coliving le loft piscine.webp",
    descFr: "7 chambres · piscine intérieure — Ambilly",
    descEn: "7 rooms · indoor pool — Ambilly",
  },
  lelodge: {
    label: "Le Lodge",
    img: "/images/le lodge.webp",
    descFr: "12 chambres · sauna · gym — Annemasse",
    descEn: "12 rooms · sauna · gym — Annemasse",
  },
};
