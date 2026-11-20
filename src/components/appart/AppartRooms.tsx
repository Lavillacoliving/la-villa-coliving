/**
 * Section « L'Appart » des pages de listes (/chambres-disponibles, /colocation-geneve, /chambre-a-louer-geneve,
 * /chambre-a-louer-annemasse) — décision n° 31 (P4, à confirmer par Jérôme) : à part, sous son titre de gamme, jamais mêlée
 * aux cartes des maisons ; les compteurs et le filtre du haut de page restent ceux des maisons (« N chambres se libèrent
 * d'ici… » : les 4 chambres de février les fausseraient).
 *
 * Deux états de la base, un composant :
 *  - état B (v_public_rooms rend les chambres de L'Appart) : titre, chapeau, les cartes de L'Appart, puis le lien de sa liste
 *    d'attente et, quand les cartes n'en portent pas (variante « default »), « Découvrir L'Appart » ;
 *  - état A (aucune ligne de L'Appart) : le repli — date d'ouverture, « dès », lien vers /lappart — à la place des cartes, sur
 *    les listes de la marque (`fallback`) ; rien sur /chambre-a-louer-annemasse, qui porte déjà le bloc statique (AppartTeaser).
 * La pastille d'une carte vient de SA ligne de la vue (libre, datée) : jamais « disponible » sans que la vue le dise.
 *
 * Les cartes ne sont pas écrites ici : la page les rend (`children`), avec sa variante et sa mesure, comme ses cartes des
 * maisons — l'inventaire des pages à cartes (tools/test/all-inclusive.test.mjs) les voit ainsi dans la page qui les monte.
 * Textes : appartListText (src/data/appartFacts.ts), source du 13/11/2026, au caractère près ; aucun nombre ici.
 * Hydratation : `known` et les cartes viennent de l'état embarqué, puis du magasin des chambres : premier rendu = HTML prérendu.
 * Mesure : liste d'attente = `cta_click` (position « waitlist », comme sur /chambres-disponibles) ; liens vers /lappart =
 * `house_discover_click` (position « appart_rooms », ou « appart_rooms_fallback » pour le repli), toujours la clé publique.
 */
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { APPART } from "@/data/appart";
import { appartListText } from "@/data/appartFacts";
import { placeDiscoverLabel } from "@/data/places";

/** Nom GA4 de la page hôte (snake_case, le même en français et en anglais : conventions de price_why_click). */
export type AppartRoomsPage = "chambres_disponibles" | "colocation_geneve" | "chambre_a_louer_geneve" | "chambre_a_louer_annemasse";

export interface AppartRoomsProps {
  /** La vue rend-elle des chambres de L'Appart (état B) ? Non (état A) : le repli si `fallback`, sinon rien. */
  known: boolean;
  /** Repli de l'état A à la place des cartes : listes de la marque. Absent sur /chambre-a-louer-annemasse (bloc statique). */
  fallback?: boolean;
  /** Lien « Découvrir L'Appart » sous les cartes, quand elles n'en portent pas (variante « default »). */
  discoverLink?: boolean;
  /** Page hôte (mesure). */
  page: AppartRoomsPage;
  /** Niveau du titre : h2 pour une section de la page, h3 dans la section des chambres. */
  headingLevel?: 2 | 3;
  className?: string;
  /** Les cartes de L'Appart (état B), rendues par la page. Rien : chapeau et liens seuls (aucune chambre libre ni datée). */
  children?: ReactNode;
  /** (Corrections du 13/11/2026) La vue rend L'Appart mais aucune chambre libre ni datée (état « complet ») : une ligne le dit,
   *  au-dessus de la liste d'attente. À calculer sur TOUTES les chambres de L'Appart (jamais après un filtre de la page). */
  full?: boolean;
}

const TITLE_ID = "appart-rooms-titre";
const PAGE_PATH = `/${APPART.key}`;
const WAITLIST_PATH = `/candidature?property_interest=${APPART.key}&room_interest=liste-attente`;
const LINK_CLASS =
  "inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#8A6508] transition-colors";

export function AppartRooms({ known, fallback = false, discoverLink = false, page, headingLevel = 2, className = "", children, full = false }: AppartRoomsProps) {
  const { language } = useLanguage();
  if (!known && !fallback) return null;
  const L = language === "en" ? "en" : "fr";
  const t = appartListText(L);
  const Heading = headingLevel === 3 ? "h3" : "h2";

  const track = (event: string, params: Record<string, unknown>) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, { ...params, house: APPART.key, page, language: L });
    } catch { /* noop */ }
  };

  return (
    <section data-appart-rooms={known ? "chambres" : "repli"} aria-labelledby={TITLE_ID} className={className}>
      <Heading id={TITLE_ID} className="text-2xl md:text-3xl font-light text-[#1C1917] leading-tight" style={{ fontFamily: '"DM Serif Display", serif' }}>
        {t.title}
      </Heading>
      {known ? (
        <>
          <p className="mt-2 mb-6 max-w-3xl text-[#57534E] leading-relaxed">{t.lead}</p>
          {full && <p data-appart-full className="max-w-3xl font-semibold text-[#1C1917]">{t.full}</p>}
          {children}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <LocalizedLink
              to={WAITLIST_PATH}
              onClick={() => track("cta_click", { cta_position: "waitlist", cta_target: "/candidature" })}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 border border-[#1C1917] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              {t.waitlist}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LocalizedLink>
            {discoverLink && (
              <LocalizedLink to={PAGE_PATH} onClick={() => track("house_discover_click", { cta_position: "appart_rooms" })} className={LINK_CLASS}>
                {placeDiscoverLabel(APPART.key, L)}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </LocalizedLink>
            )}
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl border border-[#E7E5E4] bg-[#FAF9F6] p-6 md:p-8">
          <p className="max-w-3xl text-[#44403C] leading-relaxed">{t.fallbackText}</p>
          <LocalizedLink to={PAGE_PATH} onClick={() => track("house_discover_click", { cta_position: "appart_rooms_fallback" })} className={`mt-3 ${LINK_CLASS}`}>
            {t.fallbackLink}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </LocalizedLink>
        </div>
      )}
    </section>
  );
}
