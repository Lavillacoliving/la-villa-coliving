import { EntityFacts } from "@/components/EntityFacts";
import { LocalizedLink } from "@/components/LocalizedLink";
import { colocGeneveHref } from "@/lib/siteLinks";
import { HouseAvailabilityLine } from "@/components/HouseAvailabilityLine";
import { responsiveImage } from "@/lib/responsiveImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Users, ArrowRight, Check, X } from "lucide-react";
import { SEO } from "@/components/SEO";
import { FaqSection } from "@/components/FaqSection";
import { FacebookGroupLine } from "@/components/FacebookGroupLine";
import { maisonsFaq } from "@/data/faq/maisonsFaq";
import { AppartTeaser } from "@/components/appart/AppartTeaser";
import { WhatsAppTextLink } from "@/components/WhatsAppButton";
import { STATS, STATS_DISPLAY, HOUSE_SURFACES, ROOMS_BY_HOUSE, thousands, PRICE_FR_NUM, PRICE_EN_NUM, PRICE_FROM_FR_NUM, PRICE_FROM_EN_NUM, PRICE_FROM_CHF_FR, PRICE_FROM_CHF_EN, EUR_STANDARD_FR_NUM, EUR_STANDARD_EN_NUM, EUR_FROM_FR_NUM, EUR_FROM_EN_NUM } from "@/data/stats";
import { ENTITY_HOUSES, type EntityHouseSlug } from "@/data/entityFacts";
import {
  useRoomAvailability,
  houseBadgeLabel,
  houseBadgeTone,
  BADGE_CHIP_CLASS,
  type HouseKey,
} from "@/lib/availability";

// (Lot L2, 09/10/2026) Surfaces lues dans HOUSE_SURFACES (D2) ; trajets = ligne courte A.1 de ENTITY_HOUSES (D1) ;
// « 20 min » toujours qualifié par STATS_DISPLAY.distance. Plus aucune minute ni surface d'emplacement en dur ici.
const SURF = HOUSE_SURFACES;
const commuteOf = (slug: EntityHouseSlug, lang: "fr" | "en") => {
  const h = ENTITY_HOUSES.find((x) => x.slug === slug);
  if (!h) throw new Error(`entityFacts : maison inconnue ${slug}`);
  return h.commute[lang];
};
/** Majuscule initiale pour une cellule de tableau (la ligne courte A.1 commence en minuscule) — comme HousesPreviewV7. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** (Lot 1 de la refonte, 24/11/2026) « de 7 à 12 résidents » : bornes lues dans ROOMS_BY_HOUSE (une chambre = un résident). */
const RESIDENTS_MIN = Math.min(...Object.values(ROOMS_BY_HOUSE));
const RESIDENTS_MAX = Math.max(...Object.values(ROOMS_BY_HOUSE));

/** Mesure GA4 (lot 1 de la refonte, 24/11/2026) : quel élément de la carte mène à la maison — jamais bloquant. */
function track(event: string, params: Record<string, unknown>): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, params);
  } catch { /* noop */ }
}

export function HousesPageV4() {
  const { language } = useLanguage();
  const L: "fr" | "en" = language === "en" ? "en" : "fr";
  const availability = useRoomAvailability();
  // (Lot L2, 09/10/2026) Milliers FR = espace insécable U+00A0 (une espace ordinaire laissait « 2 000 » sécable).
  const plotVilla = thousands(SURF.lavilla.plotM2, L === "en" ? "," : " ");
  const plotLodge = thousands(SURF.lelodge.plotM2, L === "en" ? "," : " ");

  const houses = [
    {
      id: "lavilla",
      name: "La Villa",
      location: "Ville-la-Grand",
      description:
        language === "en"
          ? `${SURF.lavilla.livingM2} m² of designed living on a ${plotVilla} m² estate bordering a nature reserve. Heated pool, sauna, gym, and more.`
          : `${SURF.lavilla.livingM2} m² de vie design sur un domaine de ${plotVilla} m² bordant une réserve naturelle. Piscine chauffée, sauna, gym et plus.`,
      image: "/images/villa_portrait.webp",
      alt: language === "en"
        ? "La Villa — premium coliving with heated pool, gym and sauna in Ville-la-Grand near Geneva"
        : "La Villa — colocation premium avec piscine chauffée, gym et sauna à Ville-la-Grand près de Genève",
      capacity: "10",
      price: language === "en" ? PRICE_EN_NUM : PRICE_FR_NUM,
      features: language === "en"
        ? ["Heated outdoor pool", "Sauna (5 seats)", "Gym", `${plotVilla} m² garden`]
        : ["Piscine chauffée extérieure", "Sauna (5 places)", "Salle de sport", `Jardin ${plotVilla} m²`],
    },
    {
      id: "leloft",
      name: "Le Loft",
      location: "Ambilly",
      description:
        language === "en"
          ? `A ${SURF.leloft.livingM2} m² townhouse with urban sophistication. Year-round heated indoor pool, Finnish sauna, gym, and spacious designer rooms.`
          : `Maison de ville de ${SURF.leloft.livingM2} m² avec sophistication urbaine. Piscine intérieure chauffée toute l'année, sauna finlandais, gym et chambres design spacieuses.`,
      image: "/images/la villa coliving le loft piscine.webp",
      alt: language === "en"
        ? "Le Loft — urban coliving with indoor pool and designer rooms in Ambilly near Geneva"
        : "Le Loft — colocation urbaine avec piscine intérieure et chambres design à Ambilly près de Genève",
      capacity: "7",
      price: language === "en" ? PRICE_EN_NUM : PRICE_FR_NUM,
      features: language === "en"
        ? ["Year-round indoor pool", "Finnish sauna", "Gym", "Outdoor kitchen"]
        : ["Piscine intérieure toute l'année", "Sauna finlandais", "Salle de sport", "Cuisine extérieure"],
    },
    {
      id: "lelodge",
      name: "Le Lodge",
      location: "Annemasse",
      description:
        language === "en"
          ? "Our newest and largest home (Jan 2026). Pool house, full fitness chalet with sauna & arcade."
          : "Notre maison la plus récente et la plus grande (jan. 2026). Pool house, chalet fitness complet avec sauna et jeu d'arcade.",
      image: "/images/le lodge piscine.webp",
      // (Lot L2, 09/10/2026) Plus de minute dans l'alt (« 10 min de Genève » n'était soutenu par aucune mesure).
      alt: language === "en"
        ? "Le Lodge — coliving with pool, gym and gardens in Annemasse near Geneva"
        : "Le Lodge — colocation avec piscine, gym et jardins à Annemasse près de Genève",
      capacity: "12",
      price: language === "en" ? PRICE_EN_NUM : PRICE_FR_NUM,
      features: language === "en"
        ? ["Outdoor pool + pool house", "Sauna", "Full fitness chalet", "Arcade & games"]
        : ["Piscine + pool house", "Sauna", "Chalet fitness complet", "Arcade & jeux"],
    },
  ];

  const comparisonRows = [
    {
      label: language === "en" ? "Size" : "Surface",
      values: [`${SURF.lavilla.livingM2} m²`, `${SURF.leloft.livingM2} m²`, `${SURF.lelodge.livingM2} m²`],
    },
    {
      label: language === "en" ? "Plot" : "Terrain",
      // (Lot 2, 03/09 ; corrigé Lot L2, 09/10/2026) séparateur de milliers FR = espace insécable U+00A0 (plotVilla/plotLodge), EN = virgule.
      // (Lot L2, 09/10/2026) Le « 330 m² » du Loft n'était sourcé nulle part → cellule vide (HOUSE_SURFACES.leloft n'a pas de terrain).
      values: [`${plotVilla} m²`, "—", `${plotLodge} m²`],
    },
    {
      label: language === "en" ? "Residents" : "Résidents",
      values: ["10", "7", "12"],
    },
    {
      label: language === "en" ? "Pool" : "Piscine",
      values: [
        language === "en" ? "Outdoor heated" : "Extérieure chauffée",
        language === "en" ? "Indoor year-round" : "Intérieure toute l'année",
        language === "en" ? "Outdoor + pool house" : "Extérieure + pool house",
      ],
    },
    {
      label: "Sauna",
      values: [
        language === "en" ? "Infrared (5 seats)" : "Infrarouge (5 places)",
        language === "en" ? "Finnish (2 seats)" : "Finlandais (2 places)",
        language === "en" ? "Finnish sauna (5 seats)" : "Sauna finlandais (5 places)",
      ],
    },
    {
      label: language === "en" ? "Gym" : "Salle de sport",
      values: [true, true, true],
    },
    {
      label: language === "en" ? "Private bathrooms" : "SDB privatives",
      values: [
        language === "en" ? "Most rooms" : "La plupart",
        language === "en" ? "All rooms" : "Toutes",
        language === "en" ? "All rooms" : "Toutes",
      ],
    },
    {
      label: "DPE",
      values: ["D", "C", "B"],
    },
    {
      label: language === "en" ? "Transport to Geneva" : "Transport vers Genève",
      // (Lot L2, 09/10/2026) Ligne courte A.1 par maison (ENTITY_HOUSES, dérivée de TRANSIT) — plus de « CEVA à 9 min » ; majuscule initiale.
      values: [cap(commuteOf("lavilla", L)), cap(commuteOf("leloft", L)), cap(commuteOf("lelodge", L))],
    },
    {
      label: language === "en" ? "Price" : "Tarif",
      values: language === "en"
        ? [`${PRICE_FROM_EN_NUM}–${PRICE_EN_NUM} CHF (€${EUR_FROM_EN_NUM}–${EUR_STANDARD_EN_NUM})`, `${PRICE_EN_NUM} CHF (€${EUR_STANDARD_EN_NUM})`, `${PRICE_EN_NUM} CHF (€${EUR_STANDARD_EN_NUM})`]
        : [`${PRICE_FROM_FR_NUM}–${PRICE_FR_NUM} CHF (${EUR_FROM_FR_NUM}–${EUR_STANDARD_FR_NUM} €)`, `${PRICE_FR_NUM} CHF (${EUR_STANDARD_FR_NUM} €)`, `${PRICE_FR_NUM} CHF (${EUR_STANDARD_FR_NUM} €)`],
    },
  ];

  return (
    <main className="relative pt-16">
      <SEO
        title={language === "en" ? "3 coliving houses near Geneva" : "3 maisons de coliving près de Genève"}
        // (Lot L2, 09/10/2026) « 20 min » qualifié (STATS_DISPLAY.distance, D1) ; chambres = STATS.totalRooms ; meta ≤ 155 c. (FR 152 / EN 147, mesuré).
        description={language === "en"
          ? `La Villa, Le Loft, Le Lodge: pool, sauna, gym, ${STATS_DISPLAY.en.distance}. ${STATS.totalRooms} rooms all inclusive from ${PRICE_FROM_CHF_EN}.`
          : `La Villa, Le Loft, Le Lodge : piscine, sauna, gym, à ${STATS_DISPLAY.fr.distance}. ${STATS.totalRooms} chambres tout inclus dès ${PRICE_FROM_CHF_FR}.`}
        url="https://www.lavillacoliving.com/nos-maisons"
      />
      {/* Hero — (Lot 1 de la refonte des pages de vente, décisions de Jérôme du 24/11/2026) Deux phrases qui vendent et les
          trois maisons en lien, au lieu du paragraphe d'ancrages (ses trois liens descendent sous le tableau « Côte à côte ») ;
          la fiche « l'essentiel » passe sous la FAQ. Marges réduites sur mobile : la première maison arrive au 2ᵉ écran. */}
      <section className="py-16 md:py-24 lg:py-32 bg-[#F5F2ED]">
        <div className="container-custom text-center">
          <span className="lvc-eyebrow mb-4">
            {language === "en" ? "Our Homes" : "Nos maisons"}
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl text-[#1C1917] mb-6"
          >
            {language === "en" ? (
              <>
                Three <em className="lvc-h1-accent">Homes</em>.
              </>
            ) : (
              <>
                Trois <em className="lvc-h1-accent">maisons</em>.
              </>
            )}
          </h1>
          {/* Faits lus dans les sources : ROOMS_BY_HOUSE (résidents), STATS_DISPLAY.distance (trajet toujours qualifié, D1),
              HOUSES_FROM (« dès » des maisons). Aucun prix de L'Appart ici (deux gammes). */}
          <p className="text-lg md:text-xl text-[#57534E] max-w-2xl mx-auto">
            {language === "en"
              ? <>{`Three houses for ${RESIDENTS_MIN} to ${RESIDENTS_MAX} residents, each with a pool, sauna and gym, ${STATS_DISPLAY.en.distance}. All-inclusive furnished rooms from ${PRICE_FROM_CHF_EN} a month: `}<LocalizedLink to="/lavilla" onClick={() => track("house_discover_click", { house: "lavilla", cta_position: "nos_maisons_intro", page: "nos-maisons", language: L })} className="underline underline-offset-4 hover:text-[#1C1917]">La Villa</LocalizedLink>{", "}<LocalizedLink to="/leloft" onClick={() => track("house_discover_click", { house: "leloft", cta_position: "nos_maisons_intro", page: "nos-maisons", language: L })} className="underline underline-offset-4 hover:text-[#1C1917]">Le Loft</LocalizedLink>{" and "}<LocalizedLink to="/lelodge" onClick={() => track("house_discover_click", { house: "lelodge", cta_position: "nos_maisons_intro", page: "nos-maisons", language: L })} className="underline underline-offset-4 hover:text-[#1C1917]">Le Lodge</LocalizedLink>{"."}</>
              : <>{`Trois maisons de ${RESIDENTS_MIN} à ${RESIDENTS_MAX} résidents, chacune avec piscine, sauna et salle de sport, à ${STATS_DISPLAY.fr.distance}. Chambres meublées tout inclus dès ${PRICE_FROM_CHF_FR} par mois : `}<LocalizedLink to="/lavilla" onClick={() => track("house_discover_click", { house: "lavilla", cta_position: "nos_maisons_intro", page: "nos-maisons", language: L })} className="underline underline-offset-4 hover:text-[#1C1917]">La Villa</LocalizedLink>{", "}<LocalizedLink to="/leloft" onClick={() => track("house_discover_click", { house: "leloft", cta_position: "nos_maisons_intro", page: "nos-maisons", language: L })} className="underline underline-offset-4 hover:text-[#1C1917]">Le Loft</LocalizedLink>{" et "}<LocalizedLink to="/lelodge" onClick={() => track("house_discover_click", { house: "lelodge", cta_position: "nos_maisons_intro", page: "nos-maisons", language: L })} className="underline underline-offset-4 hover:text-[#1C1917]">Le Lodge</LocalizedLink>{"."}</>}
          </p>
        </div>
      </section>

      {/* Houses Cards */}
      <section className="py-12 md:py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {houses.map((house) => (
              <div
                key={house.id}
                className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden hover:border-[#44403C]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all duration-300 flex flex-col"
              >
                {/* Photo */}
                <LocalizedLink
                  to={`/${house.id}`}
                  onClick={() => track("house_discover_click", { house: house.id, cta_position: "nos_maisons_photo", page: "nos-maisons", language: L })}
                  className="block relative aspect-[16/10] overflow-hidden group"
                >
                  <img
                    src={house.image}
                    alt={house.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    {...responsiveImage(house.image, "(min-width: 768px) 33vw, 100vw")}
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#1C1917] text-xs font-semibold px-3 py-1.5 rounded-lg">
                    {house.capacity} {language === "en" ? "residents" : "résidents"}
                  </span>
                  {/* (Lot L2, 09/10/2026) Libellé canonique D1 dès sm ; sur mobile, forme courte SANS minute (destination + mode) :
                      le libellé complet tenait sur 3 lignes à 375 px. */}
                  <span className="absolute top-4 right-4 max-w-[60%] text-right bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                    <span className="hidden sm:inline">{STATS_DISPLAY[L].distance}</span>
                    <span className="sm:hidden">{L === "en" ? "Geneva Eaux-Vives by Léman Express" : "Genève-Eaux-Vives en Léman Express"}</span>
                  </span>
                  {/* Pastille dispo — couleur dérivée de la dispo réelle (v_public_rooms), pas du libellé.
                      Libellé null (dispo inconnue) = pas de pastille, jamais de chiffre inventé. */}
                  {(() => {
                    const label = houseBadgeLabel(availability.byHouse[house.id as HouseKey], availability.known, language);
                    const tone = houseBadgeTone(availability.byHouse[house.id as HouseKey], availability.known);
                    return label && tone ? (
                      <span className={`absolute bottom-4 left-4 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-lg ${BADGE_CHIP_CLASS[tone]}`}>
                        {label}
                      </span>
                    ) : null;
                  })()}
                </LocalizedLink>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3 text-xs text-[#78716C]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {house.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {house.capacity}
                    </span>
                  </div>

                  <h2
                    className="text-2xl text-[#1C1917] mb-3"
                  >
                    {house.name}
                  </h2>

                  <p className="text-sm text-[#57534E] leading-relaxed mb-5">
                    {house.description}
                  </p>

                  {/* Key features */}
                  <div className="space-y-2 mb-6">
                    {house.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[#44403C]">
                        <Check className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-auto pt-5 border-t border-[#E7E5E4]">
                    <div className="flex items-baseline gap-2 mb-4">
                      {/* La Villa : 4 chambres sur 10 à salle d'eau partagée → « dès » = palier le plus bas (HOUSES_FROM, stats.ts) */}
                      {house.name === "La Villa" && (
                        <span className="text-sm text-[#78716C]">
                          {language === "en" ? "from" : "dès"}
                        </span>
                      )}
                      <span className="text-2xl font-light text-[#D4A574]">
                        {house.name === "La Villa"
                          ? (language === "en" ? PRICE_FROM_EN_NUM : PRICE_FROM_FR_NUM)
                          : house.price}{" "}
                        CHF
                      </span>
                      <span className="text-sm font-light text-[#78716C]">
                        {house.name === "La Villa"
                          ? (language === "en" ? `(€${EUR_FROM_EN_NUM})` : `(${EUR_FROM_FR_NUM} €)`)
                          : (language === "en" ? `(€${EUR_STANDARD_EN_NUM})` : `(${EUR_STANDARD_FR_NUM} €)`)}
                      </span>
                      <span className="text-sm text-[#78716C]">
                        / {language === "en" ? "month" : "mois"}
                      </span>
                    </div>

                    {/* (24/11/2026, § 4.7) « Programmer une visite » est plus long que « Postuler » : les deux boutons passent à la
                        ligne quand ils ne tiennent pas côte à côte (flex-wrap + flex-auto), sans jamais couper un libellé. */}
                    <div className="flex flex-wrap gap-3">
                      <LocalizedLink
                        to={`/${house.id}`}
                        onClick={() => track("house_discover_click", { house: house.id, cta_position: "nos_maisons_button", page: "nos-maisons", language: L })}
                        className="lvc-btn-primary flex-auto whitespace-nowrap inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
                      >
                        {language === "en" ? "Discover" : "Découvrir"}
                        <ArrowRight className="w-4 h-4" />
                      </LocalizedLink>
                      <LocalizedLink
                        to={`/candidature?property_interest=${house.id}`}
                        onClick={() => track("cta_click", { cta_position: "nos_maisons_card", cta_target: "/candidature", house: house.id, language: L })}
                        className="lvc-btn-secondary flex-auto whitespace-nowrap inline-flex items-center justify-center px-5 py-3 text-sm"
                      >
                        {language === "en" ? "Book a visit" : "Programmer une visite"}
                      </LocalizedLink>
                    </div>
                    {house.id === "lelodge" ? (
                      <p className="mt-3 text-sm text-[#78716C]">
                        <LocalizedLink to="/annemasse-colocation" className="underline hover:text-[#D4A574] transition-colors">
                          {language === "en" ? "lavillacoliving.com/en/annemasse-colocation" : "lavillacoliving.com/annemasse-colocation"}
                        </LocalizedLink>
                        {" · "}
                        <LocalizedLink to="/chambre-a-louer-annemasse" className="underline hover:text-[#D4A574] transition-colors">
                          {language === "en" ? "lavillacoliving.com/en/chambre-a-louer-annemasse" : "lavillacoliving.com/chambre-a-louer-annemasse"}
                        </LocalizedLink>
                      </p>
                    ) : (
                      <LocalizedLink
                        to={`/${house.id}`}
                        onClick={() => track("house_discover_click", { house: house.id, cta_position: "nos_maisons_link", page: "nos-maisons", language: L })}
                        className="mt-3 inline-block text-sm text-[#78716C] underline hover:text-[#D4A574] transition-colors"
                      >
                        {language === "en" ? `Flatshare in ${house.location}` : `Colocation à ${house.location}`}
                      </LocalizedLink>
                    )}
                    {/* (Lot 3 SEO funnel — 3.3) Porte vers /chambres-disponibles?maison=… */}
                    <HouseAvailabilityLine house={house.id as HouseKey} className="mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* (L'Appart, Lot 4, étape E5 — Q16) Section distincte, après les trois maisons et avant « Comparer » : L'Appart n'est pas une
              quatrième maison (son texte le dit d'emblée) ; le titre « Trois Maisons. » et le tableau à 3 colonnes restent vrais. */}
          <div className="mt-12 md:mt-16"><AppartTeaser page="/nos-maisons" /></div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="lvc-eyebrow mb-4">
              {language === "en" ? "Compare" : "Comparer"}
            </span>
            <h2
              className="text-3xl md:text-4xl text-[#1C1917]"
            >
              {language === "en" ? "Side by Side" : "Côte à côte"}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-[#1C1917]">
                  <th className="text-left py-4 pr-6 text-sm font-semibold text-[#78716C] uppercase tracking-wider w-1/4">
                    {language === "en" ? "Feature" : "Caractéristique"}
                  </th>
                  {houses.map((house) => (
                    <th key={house.id} className="py-4 px-4 text-center w-1/4">
                      <span className="text-lg text-[#1C1917]" style={{ fontFamily: '"DM Serif Display", serif' }}>
                        {house.name}
                      </span>
                      <span className="block text-xs text-[#78716C] mt-1">{house.location}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr key={index} className={`border-b border-[#E7E5E4] ${index % 2 === 0 ? "bg-[#FAF9F6]" : "bg-white"}`}>
                    <td className="py-4 pr-6 text-sm font-medium text-[#44403C]">
                      {row.label}
                    </td>
                    {row.values.map((val, i) => (
                      <td key={i} className="py-4 px-4 text-center text-sm text-[#57534E]">
                        {val === true ? (
                          <Check className="w-5 h-5 text-[#D4A574] mx-auto" />
                        ) : val === false ? (
                          <X className="w-5 h-5 text-[#78716C]/40 mx-auto" />
                        ) : (
                          val
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* (Lot 1 de la refonte, 24/11/2026) Les trois liens de l'ancien paragraphe d'ouverture, mêmes ancres (Lot 4 SEO funnel :
              ancre exacte vers la home, URL championne sur « coliving genève ») : déplacés, ni ajoutés ni retirés. */}
          <p className="mt-8 text-sm text-[#57534E] text-center">
            {language === "en" ? "See also: " : "Voir aussi : "}
            <LocalizedLink to="/" className="underline underline-offset-4 hover:text-[#1C1917]">
              {language === "en" ? "coliving Geneva" : "coliving Genève"}
            </LocalizedLink>
            {" · "}
            <LocalizedLink to={colocGeneveHref(language)} className="underline underline-offset-4 hover:text-[#1C1917]">
              {language === "en" ? "shared housing in Geneva, French side" : "colocation à Genève côté France"}
            </LocalizedLink>
            {" · "}
            <LocalizedLink to="/chambre-a-louer-geneve" className="underline underline-offset-4 hover:text-[#1C1917]">
              {language === "en" ? "room to rent near Geneva" : "chambre à louer près de Genève"}
            </LocalizedLink>
          </p>
        </div>
      </section>

      <FaqSection
        title={language === "en" ? "Our houses — frequently asked questions" : "Nos maisons — questions fréquentes"}
        items={maisonsFaq[language === "en" ? "en" : "fr"]}
        emitSchema
        // (Brief du 05/11/2026, D2) Groupe Facebook nommé et attribué, en fin de FAQ, avant la fiche et la phrase d'appel.
        outro={<FacebookGroupLine position="nos_maisons_end" />}
      />

      {/* (Lot S1) Fiche de faits canonique — même contenu, même source.
          (Lot 1 de la refonte des pages de vente, décision de Jérôme du 24/11/2026) Sous la FAQ et repliée sur mobile, comme sur
          les pages maisons : en tête de page, elle repoussait la première maison à l'écran 5. Tout reste dans le HTML. */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6"><EntityFacts page="nos-maisons" className="!my-0" collapseOnMobile /></div>
      </section>

      {/* CTA — (Lot 1 de la refonte, 24/11/2026) Le dernier bloc propose d'écrire ou de programmer une visite, au lieu de renvoyer
          vers la FAQ qu'on vient de lire. Libellé « Programmer une visite » (étape 1 bis), comme le reste du site et le formulaire. */}
      <section className="py-24 bg-[#1C1917]">
        <div className="container-custom text-center">
          <h2
            className="text-3xl md:text-4xl text-white mb-4"
          >
            {language === "en"
              ? "Not Sure Which One?"
              : "Pas certain de ton choix ?"}
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            {language === "en"
              ? `Message us on WhatsApp and we'll help you choose. Or book a visit, on site or by video: reply within ${STATS.responseHours}\u00a0h.`
              : `Écris-nous sur WhatsApp, on t'aide à choisir. Ou programme une visite, sur place ou en vidéo : réponse sous ${STATS.responseHours}\u00a0h.`}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LocalizedLink
              to="/candidature"
              onClick={() => track("cta_click", { cta_position: "nos_maisons_footer", cta_target: "/candidature", language: L })}
              className="lvc-btn-primary inline-flex items-center gap-2 px-8 py-4"
            >
              {language === "en" ? "Book a visit" : "Programmer une visite"}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            <WhatsAppTextLink context={language === "en" ? "Our houses" : "Nos maisons"} onDark />
          </div>
        </div>
      </section>
    </main>
  );
}
