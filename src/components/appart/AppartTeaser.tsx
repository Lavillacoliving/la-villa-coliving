/**
 * Bloc statique « L'Appart » des pages de la marque (accueil, /nos-maisons, /tarifs, /annemasse-colocation,
 * /chambre-a-louer-annemasse) : une photo, un texte propre à CHAQUE page et un lien vers /lappart (source des textes du
 * 13/11/2026, table du bloc statique ; `appartTeaser`, src/data/appartTeaser.ts).
 *
 * Jamais une phrase canonique ici (critique A1/X2) : ces pages portent déjà la fiche de la marque, et la garde y compte chaque
 * phrase canonique exactement une fois. Statique : rien ne dépend de la base, le bloc est le même dans les deux états (L'Appart
 * absent ou présent dans v_public_rooms). `data-appart-teaser` porte la page (garde : un bloc par page de la liste, aucun ailleurs).
 *
 * Image : la cuisine côté plaque (image du haut de /lappart), cadrée sur son point focal ; chargement différé, dimensions
 * réelles (pas de décalage de mise en page), variantes responsive (scripts/optimize-images.mjs). Sauf sur l'accueil : « une
 * bande courte […], pas d'image » (source des textes, SURFACES S9.3 ; réunion des étapes du 13/11/2026, à confirmer).
 * Mesure : `house_discover_click` (house « lappart », position « appart_teaser »), comme « Découvrir la maison ».
 */
import { ArrowRight } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { APPART } from "@/data/appart";
// (Corrections du 13/11/2026, relecture technique) Modules légers : le texte du bloc et l'image du haut seulement, ni
// appartFacts.ts ni l'album (l'accueil, « Nos maisons » et /tarifs n'en ont pas besoin).
import { appartTeaser, type AppartTeaserRoute } from "@/data/appartTeaser";
import { LAPPART_HERO } from "@/data/appartCovers";
import { responsiveImage } from "@/lib/responsiveImage";

export interface AppartTeaserProps {
  /** Page hôte (chemin FR) : choisit le texte du bloc. */
  page: AppartTeaserRoute;
  /** Langue forcée ; sinon celle de l'URL. */
  lang?: "fr" | "en";
  /** Niveau du titre (h2 par défaut). */
  headingLevel?: 2 | 3;
  className?: string;
}

/** Photo du bloc, par page hôte : aucune sur l'accueil (bande courte, source des textes S9.3). */
const WITH_IMAGE: Record<AppartTeaserRoute, boolean> = {
  "/": false,
  "/nos-maisons": true,
  "/tarifs": true,
  "/annemasse-colocation": true,
  "/chambre-a-louer-annemasse": true,
};

/** Nom GA4 de la page hôte (snake_case, le même en français et en anglais). */
const GA_PAGE: Record<AppartTeaserRoute, string> = {
  "/": "home",
  "/nos-maisons": "nos_maisons",
  "/tarifs": "tarifs",
  "/annemasse-colocation": "annemasse_colocation",
  "/chambre-a-louer-annemasse": "chambre_a_louer_annemasse",
};

export function AppartTeaser({ page, lang, headingLevel = 2, className = "" }: AppartTeaserProps) {
  const { language } = useLanguage();
  const L = lang ?? (language === "en" ? "en" : "fr");
  const t = appartTeaser(page, L);
  const img = LAPPART_HERO.wide;
  const withImage = WITH_IMAGE[page];
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const titleId = `appart-teaser-title-${GA_PAGE[page]}`;

  const track = () => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "house_discover_click", {
        house: APPART.key, cta_position: "appart_teaser", page: GA_PAGE[page], language: L,
      });
    } catch { /* noop */ }
  };

  return (
    <section data-appart-teaser={page} aria-labelledby={titleId} className={`not-prose ${className}`}>
      <div className={`grid ${withImage ? "md:grid-cols-5" : ""} overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white`}>
        {withImage && (
          <div className="relative h-52 sm:h-64 md:h-auto md:min-h-[280px] md:col-span-2">
            <img
              src={img.src}
              {...responsiveImage(img.src, "(min-width: 768px) 40vw, 100vw")}
              alt={img.alt[L]}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: img.focal }}
              loading="lazy"
              width={img.w}
              height={img.h}
            />
          </div>
        )}
        <div className={`p-6 md:p-8 ${withImage ? "md:col-span-3" : ""} flex flex-col`}>
          {t.eyebrow && <p className="lvc-eyebrow mb-2">{t.eyebrow}</p>}
          <Heading
            id={titleId}
            className="lvc-display text-2xl md:text-3xl text-[#1C1917] leading-tight"
          >
            {t.title}
          </Heading>
          <p className="mt-3 text-[#44403C] leading-relaxed">{t.text}</p>
          <LocalizedLink
            to={`/${APPART.key}`}
            onClick={track}
            className="mt-5 self-start inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#b8860b] transition-colors"
          >
            {t.link}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
