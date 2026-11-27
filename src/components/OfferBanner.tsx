import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHydrated } from "@/hooks/useHydrated";
import { readPrerenderFlag } from "@/lib/prerenderEmbeddedState";
import {
  KNOWN_OFFER_IDS,
  OFFER_BANNER_DISMISS_MS,
  OFFER_ID,
  OFFER_PATH_FR,
  OFFER_TEXTS_BY_ID,
  OFFER_WINDOWS,
  isOfferBannerPath,
  offerAt,
  trackOfferCta,
  type OfferId,
} from "@/data/offer";

/**
 * Bandeau de l'offre en cours (offre « Pose tes valises avant l'hiver », brief Jérôme du 06/10/2026, §3 ; depuis le
 * 21/11/2026, l'offre « Ta première année avec nous » prend le relais le 24/11 à 0 h, heure de Paris — offerAt(),
 * src/data/offer.ts). Rendu DANS le <header> fixe de NavbarV7, au-dessus de la barre de navigation, sur les pages de
 * OFFER_BANNER_PATHS (FR + miroirs EN) ; fermable (localStorage, 7 jours, une clé PAR OFFRE : qui a fermé le bandeau d'hiver
 * voit le nouveau) ; n'apparaît que pendant une offre (fenêtres OFFER_WINDOWS).
 *
 * Zéro décalage à l'hydratation (même logique que le correctif #418 du Lot B) :
 *  - le HTML prérendu contient le bandeau de l'offre en cours au prérendu (sans localStorage), marqué `data-offer-id` ;
 *  - AVANT la première peinture, le script inline #lvc-offer d'index.html décide (fenêtre en cours + sa fermeture) et
 *    pose html.lvc-offer-on : la hauteur du bandeau est réservée (variable --lvc-banner-h, src/index.css)
 *    et les pages à `main.pt-16` reçoivent leur compensation dès le premier rendu ; sans la classe, le
 *    bandeau est masqué en CSS — jamais un bandeau qui apparaît puis disparaît ;
 *  - pendant l'hydratation, ce composant reproduit le HTML (repère `__offer_banner__` capturé par main.tsx = l'offre
 *    du bandeau prérendu ; « 1 » = HTML d'avant le 21/11, toujours l'hiver) ; une fois hydraté, il rend l'état réel (page,
 *    offre en cours, fermeture) et tient la classe à jour (navigation SPA, fermeture). Le <header> étant fixe,
 *    monter/démonter le bandeau ne déplace jamais le contenu de la page : seule la classe (compensation) compte, et elle
 *    est posée avant la peinture. À la bascule, tant que le robot n'a pas refait le prérendu, le bandeau d'hiver prérendu
 *    s'affiche le temps de l'hydratation, puis le texte de la nouvelle offre le remplace (même hauteur, même lien).
 */

function dismissedRecently(key: string, now: number = Date.now()): boolean {
  try {
    const at = Number(window.localStorage.getItem(key) ?? 0);
    return at > 0 && now - at < OFFER_BANNER_DISMISS_MS;
  } catch {
    return false;
  }
}

/** Offre du bandeau prérendu (repère de main.tsx) : un identifiant connu, « 1 » (HTML d'avant le 21/11 = l'hiver), sinon null. */
function prerenderedBannerOffer(): OfferId | null {
  const flag = readPrerenderFlag("__offer_banner__");
  if (flag === "1") return OFFER_ID;
  return (KNOWN_OFFER_IDS as readonly string[]).includes(flag ?? "") ? (flag as OfferId) : null;
}

const dismissKeyOf = (id: OfferId): string => OFFER_WINDOWS.find((w) => w.id === id)?.dismissKey ?? "";

export function OfferBanner() {
  const { language } = useLanguage();
  const L = language === "en" ? ("en" as const) : ("fr" as const);
  const { pathname } = useLocation();
  const hydrated = useHydrated();
  const [closed, setClosed] = useState(false);

  // État réel (après hydratation, et dès le premier rendu en navigation SPA ou au prérendu) : l'offre en cours, sa clé.
  const current = offerAt();
  const live = !!current && isOfferBannerPath(pathname) && !closed && !dismissedRecently(current.dismissKey);
  // Pendant l'hydratation : ce que le HTML prérendu contient, ni plus ni moins.
  const shown: OfferId | null = hydrated ? (live && current ? current.id : null) : prerenderedBannerOffer();

  // La classe de compensation suit l'état RÉEL seulement (jamais l'état de l'hydratation : le script
  // inline l'a déjà posée correctement avant la peinture — la toucher ici ferait clignoter la page).
  useLayoutEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("lvc-offer-on", live);
    return () => root.classList.remove("lvc-offer-on");
  }, [hydrated, live]);

  if (!shown) return null;
  const texts = OFFER_TEXTS_BY_ID[shown][L];

  const dismiss = () => {
    setClosed(true);
    try {
      window.localStorage.setItem(dismissKeyOf(shown), String(Date.now()));
    } catch {
      /* stockage indisponible : fermé pour cette page seulement */
    }
  };

  return (
    // (Lot 2a, 27/11/2026, décision de Jérôme) Fond doré comme le bouton principal ; texte, flèche et croix en encre (7,9:1).
    // Texte, lien et événement offer_cta_click inchangés. Composant partagé : vaut pour toutes les pages du bandeau.
    <div className="lvc-offer-banner bg-lvc-gold text-lvc-ink" data-offer-id={shown}>
      <div className="container-custom h-full flex items-center justify-center gap-2 sm:gap-4">
        <LocalizedLink
          to={OFFER_PATH_FR}
          onClick={() => trackOfferCta("banner", { language: L, page_path: pathname })}
          className="text-sm font-medium text-center leading-snug text-lvc-ink underline-offset-4 hover:underline"
        >
          {texts.banner}
        </LocalizedLink>
        <button
          type="button"
          onClick={dismiss}
          aria-label={texts.bannerClose}
          className="shrink-0 p-1.5 -mr-1.5 rounded text-lvc-ink hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lvc-ink"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
