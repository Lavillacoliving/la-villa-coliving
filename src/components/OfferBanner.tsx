import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHydrated } from "@/hooks/useHydrated";
import { readPrerenderFlag } from "@/lib/prerenderEmbeddedState";
import {
  OFFER_BANNER_DISMISS_KEY,
  OFFER_BANNER_DISMISS_MS,
  OFFER_PATH_FR,
  OFFER_TEXTS,
  isOfferActive,
  isOfferBannerPath,
  trackOfferCta,
} from "@/data/offer";

/**
 * Bandeau fin de l'offre « Pose tes valises avant l'hiver » (brief Jérôme du 06/10/2026, §3).
 * Rendu DANS le <header> fixe de NavbarV7, au-dessus de la barre de navigation, sur les pages de
 * OFFER_BANNER_PATHS (FR + miroirs EN) ; fermable (localStorage, 7 jours) ; disparaît après OFFER_END.
 *
 * Zéro décalage à l'hydratation (même logique que le correctif #418 du Lot B) :
 *  - le HTML prérendu contient le bandeau (le prérendu tourne pendant l'offre, sans localStorage) ;
 *  - AVANT la première peinture, le script inline #lvc-offer d'index.html décide (date + fermeture) et
 *    pose html.lvc-offer-on : la hauteur du bandeau est réservée (variable --lvc-banner-h, src/index.css)
 *    et les pages à `main.pt-16` reçoivent leur compensation dès le premier rendu ; sans la classe, le
 *    bandeau est masqué en CSS — jamais un bandeau qui apparaît puis disparaît ;
 *  - pendant l'hydratation, ce composant reproduit le HTML (repère `__offer_banner__` capturé par
 *    main.tsx) ; une fois hydraté, il rend l'état réel (page, date, fermeture) et tient la classe à jour
 *    (navigation SPA, fermeture). Le <header> étant fixe, monter/démonter le bandeau ne déplace jamais le
 *    contenu de la page : seule la classe (compensation) compte, et elle est posée avant la peinture.
 */

function dismissedRecently(now: number = Date.now()): boolean {
  try {
    const at = Number(window.localStorage.getItem(OFFER_BANNER_DISMISS_KEY) ?? 0);
    return at > 0 && now - at < OFFER_BANNER_DISMISS_MS;
  } catch {
    return false;
  }
}

export function OfferBanner() {
  const { language } = useLanguage();
  const L = language === "en" ? ("en" as const) : ("fr" as const);
  const { pathname } = useLocation();
  const hydrated = useHydrated();
  const [closed, setClosed] = useState(false);

  // État réel (après hydratation, et dès le premier rendu en navigation SPA ou au prérendu).
  const live = isOfferBannerPath(pathname) && !closed && isOfferActive() && !dismissedRecently();
  // Pendant l'hydratation : ce que le HTML prérendu contient, ni plus ni moins.
  const visible = hydrated ? live : readPrerenderFlag("__offer_banner__") === "1";

  // La classe de compensation suit l'état RÉEL seulement (jamais l'état de l'hydratation : le script
  // inline l'a déjà posée correctement avant la peinture — la toucher ici ferait clignoter la page).
  useLayoutEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("lvc-offer-on", live);
    return () => root.classList.remove("lvc-offer-on");
  }, [hydrated, live]);

  if (!visible) return null;

  const dismiss = () => {
    setClosed(true);
    try {
      window.localStorage.setItem(OFFER_BANNER_DISMISS_KEY, String(Date.now()));
    } catch {
      /* stockage indisponible : fermé pour cette page seulement */
    }
  };

  return (
    <div className="lvc-offer-banner bg-[#1C1917] text-white">
      <div className="container-custom h-full flex items-center justify-center gap-2 sm:gap-4">
        <LocalizedLink
          to={OFFER_PATH_FR}
          onClick={() => trackOfferCta("banner", { language: L, page_path: pathname })}
          className="text-xs sm:text-sm font-medium text-center leading-snug hover:text-[#D4A574] transition-colors"
        >
          {OFFER_TEXTS[L].banner}
        </LocalizedLink>
        <button
          type="button"
          onClick={dismiss}
          aria-label={OFFER_TEXTS[L].bannerClose}
          className="shrink-0 p-1.5 -mr-1.5 rounded text-[#A8A29E] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A574]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
