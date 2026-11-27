import { LocalizedLink } from "@/components/LocalizedLink";
import { HouseAvailabilityLine } from "@/components/HouseAvailabilityLine";
import { responsiveImage } from "@/lib/responsiveImage";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STATS_DISPLAY, HOUSE_SURFACES, thousands } from "@/data/stats";
import { ENTITY_HOUSES, type EntityHouseSlug } from "@/data/entityFacts";
import { HOME_PHOTOS } from "@/data/homePhotos";
import {
  useRoomAvailability,
  houseBadgeLabel,
  houseBadgeTone,
  type BadgeTone,
  type HouseKey,
} from "@/lib/availability";

/**
 * VERSION 9: STONE & BRASS
 * Houses preview — photo cards, tags overlay, CTA link
 *
 * (Lot 2a, brief « Accueil : récit, avis, photos » du 27/11/2026, §0.2 et §0.9) Vraies photos n° 2, 3 et 4 (La Villa : fichier
 * de 640 px, D18), cartes sans bordure ni fond. Décisions de Jérôme du 27/11 (A10) : l'étiquette de trajet passe sous la
 * photo (mêmes textes), la commune à droite du nom, le nombre de résidents seulement dans la pastille (la ligne d'icônes
 * commune + résidents, doublon, est retirée). Textes, liens et événements inchangés.
 */

/** Pastille de disponibilité sur la photo : teinte et accent (version B) ; « liste d'attente » reste neutre. */
const CARD_CHIP_CLASS: Record<BadgeTone, string> = {
  available: "bg-lvc-tint text-lvc-accent",
  upcoming: "bg-lvc-tint text-lvc-accent",
  full: "bg-white text-lvc-text",
};

// (Lot L2, 09/10/2026) Chaque carte ouvre sur la ligne courte A.1 de SA maison (ENTITY_HOUSES, dérivée de TRANSIT — D1) ;
// le badge porte le « 20 min » de marque, toujours qualifié (STATS_DISPLAY.distance). Plus de « CEVA » ni de surface en dur.
const commuteOf = (slug: EntityHouseSlug, lang: "fr" | "en") => {
  const h = ENTITY_HOUSES.find((x) => x.slug === slug);
  if (!h) throw new Error(`entityFacts : maison inconnue ${slug}`);
  return h.commute[lang];
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function HousesPreviewV7() {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const availability = useRoomAvailability();
  const badge = (house: HouseKey) =>
    houseBadgeLabel(availability.byHouse[house], availability.known, L);
  const tone = (house: HouseKey) =>
    houseBadgeTone(availability.byHouse[house], availability.known);
  const plotVilla = thousands(HOUSE_SURFACES.lavilla.plotM2, L === "en" ? "," : " "); // espace insécable en FR (convention stats.ts)

  const houses = [
    {
      id: "lavilla",
      name: "La Villa",
      location: "Ville-la-Grand",
      residents: "10",
      photo: HOME_PHOTOS.cardLaVilla,
      focal: "50% 50%",
      description: language === "en"
        ? `${cap(commuteOf("lavilla", "en"))}. Heated pool, ${plotVilla} m² garden, nature reserve.`
        : `${cap(commuteOf("lavilla", "fr"))}. Piscine chauffée, ${plotVilla} m² de jardin, réserve naturelle.`,
      availability: badge("lavilla"),
      tone: tone("lavilla"),
    },
    {
      id: "leloft",
      name: "Le Loft",
      location: "Ambilly",
      residents: "7",
      photo: HOME_PHOTOS.cardLeLoft,
      focal: "50% 60%",
      description: language === "en"
        ? `${cap(commuteOf("leloft", "en"))}. Year-round heated indoor pool, Finnish sauna.`
        : `${cap(commuteOf("leloft", "fr"))}. Piscine intérieure chauffée toute l'année, sauna finlandais.`,
      availability: badge("leloft"),
      tone: tone("leloft"),
    },
    {
      id: "lelodge",
      name: "Le Lodge",
      location: "Annemasse",
      residents: "12",
      photo: HOME_PHOTOS.cardLeLodge,
      focal: "50% 62%",
      description: language === "en"
        ? `${cap(commuteOf("lelodge", "en"))}. The largest: pool house, full fitness chalet with sauna & arcade.`
        : `${cap(commuteOf("lelodge", "fr"))}. Le plus grand : pool house, chalet fitness complet avec sauna et jeu d'arcade.`,
      availability: badge("lelodge"),
      tone: tone("lelodge"),
    },
  ];

  return (
    // (Lot 2a, 27/11/2026, version B §0.9) Cartes sans bordure ni fond : photo 3:2, pastilles, nom et commune, trajet, texte.
    <section className="py-10 md:py-[72px] bg-lvc-page">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 md:mb-8">
          <div>
            <span className="lvc-eyebrow">
              {language === "en" ? "OUR HOUSES" : "NOS MAISONS"}
            </span>
            <h2 className="lvc-display text-[30px] md:text-[42px] leading-[1.1] text-lvc-ink mt-3">
              {language === "en" ? "3 houses, 3 personalities" : "3 maisons, 3 personnalités"}
            </h2>
          </div>
          <LocalizedLink
            to="/nos-maisons"
            className="group mt-4 md:mt-0 inline-flex items-center gap-2 text-lvc-ink font-semibold text-[15px] hover:gap-3 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-lvc-ink focus-visible:ring-offset-2 rounded-lg"
          >
            {language === "en" ? "See all houses" : "Voir toutes les maisons"}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>

        {/* Houses grid — trois colonnes tant que chaque carte garde 300 px (§0.9). */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
          {houses.map((house) => (
            <div key={house.id} data-reveal className="flex flex-col gap-3">
            {/* (Lot 1 de la refonte des pages de vente, 24/11/2026) Mesure du passage principal du parcours (accueil → maison) :
                `house_discover_click`, comme « Découvrir L'Appart ». Jamais bloquant. */}
            <LocalizedLink
              to={`/${house.id}`}
              onClick={() => {
                try {
                  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "house_discover_click", {
                    house: house.id, cta_position: "home_houses", page: "home", language: L,
                  });
                } catch { /* noop */ }
              }}
              className="group block rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lvc-ink focus-visible:ring-offset-4"
            >
              {/* Photo */}
              <div className="lvc-zoom relative aspect-[3/2] overflow-hidden rounded-[22px]">
                <img
                  src={house.photo.src}
                  alt={house.photo.alt[L]}
                  width={house.photo.width}
                  height={house.photo.height}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: house.focal }}
                  loading="lazy"
                  decoding="async"
                  {...responsiveImage(house.photo.src, "(min-width: 1280px) 387px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, calc(100vw - 40px)")}
                />
                {/* Tag résidents */}
                <span className="absolute top-3.5 left-3.5 bg-white text-lvc-ink text-[13px] font-semibold px-3 py-1.5 rounded-full">
                  {house.residents} {language === "en" ? "residents" : "résidents"}
                </span>
                {/* Availability badge — couleur dérivée de la dispo réelle, pas du libellé.
                    Libellé null (dispo inconnue) = pas de badge, jamais de chiffre inventé. */}
                {house.availability && house.tone && (
                  <span className={`absolute bottom-3.5 left-3.5 text-[13px] font-semibold px-3 py-1.5 rounded-full ${CARD_CHIP_CLASS[house.tone]}`}>
                    {house.availability}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="pt-4 px-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-semibold text-lvc-ink">{house.name}</h3>
                  <span className="text-sm text-lvc-muted">{house.location}</span>
                </div>
                {/* Ligne de trajet — (Lot L2, 09/10/2026) libellé canonique D1 dès sm ; sur mobile, forme courte SANS minute
                    (destination + mode, pas de « 20 min » hors libellé canonique). Textes de l'ancienne étiquette, inchangés. */}
                <p className="mt-1.5 text-[13px] font-semibold leading-snug text-lvc-accent">
                  <span className="hidden sm:inline">{STATS_DISPLAY[L].distance}</span>
                  <span className="sm:hidden">{L === "en" ? "Geneva Eaux-Vives by Léman Express" : "Genève-Eaux-Vives en Léman Express"}</span>
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-lvc-text">
                  {house.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-lvc-ink group-hover:gap-2.5 transition-all duration-300">
                  {language === "en" ? "Discover" : "Découvrir"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </LocalizedLink>
              {/* (Lot 3 SEO funnel — 3.3) Porte vers /chambres-disponibles?maison=… */}
              <HouseAvailabilityLine house={house.id as HouseKey} className="px-1" linkClassName="text-lvc-accent" />
            </div>
          ))}
        </div>

        {/* (Lot 2 de la refonte des pages de vente, 24/11/2026) « Compare-les » juste sous les cartes. La ligne d'ancrages
            Annemasse / Genève (R5) est dans « Autres options » (HomeArgumentsV8), mêmes mots. */}
        <div className="mt-8 md:mt-10 text-center">
          <LocalizedLink
            to="/nos-maisons"
            onClick={() => {
              try {
                (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
                  cta_position: "houses_compare", cta_target: "/nos-maisons", language,
                });
              } catch { /* noop */ }
            }}
            className="inline-flex items-center justify-center gap-2 text-sm md:text-base text-lvc-ink underline underline-offset-4 decoration-[#A8A29E] hover:decoration-lvc-ink transition-colors"
          >
            {language === "en" ? "Torn between the three? Compare them" : "Tu hésites entre les trois ? Compare-les"}
            <ArrowRight className="w-4 h-4 flex-none" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
