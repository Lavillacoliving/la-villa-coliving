/**
 * Préchargement du module de page AVANT hydrateRoot (fix hydratation #418,
 * 2026-08-10, avec les marqueurs Suspense posés par scripts/prerender.mjs).
 *
 * Toutes les pages sont en React.lazy : au premier rendu client, le chunk de
 * la page n'est pas encore là et la boundary <Suspense> reste « déshydratée »
 * (DOM prérendu conservé) jusqu'à son arrivée. Pendant cette fenêtre, un
 * setState précoce peut forcer React à abandonner le DOM serveur et re-rendre
 * le contenu (coût CPU, surtout mobile/réseau lent). Précharger le module de
 * la route courante réduit cette fenêtre à quelques microtâches.
 *
 * ⚠️ Miroir des routes PRÉRENDUES de App.tsx (mêmes spécificateurs d'import →
 * Vite réutilise le même chunk). Nouvelle page prérendue = l'ajouter ici.
 * Les routes SPA (/portail, /dashboard…) ne passent jamais par ici
 * (createRoot, pas d'hydratation).
 */

type Loader = () => Promise<unknown>;

const STATIC_LOADERS: Record<string, Loader> = {
  "/": () => import("@/pages/HomePage"),
  "/annemasse-colocation": () => import("@/pages/AnnemasseColocationPage"),
  "/chambre-a-louer-annemasse": () => import("@/pages/ChambreLouerAnnemassePage"),
  "/le-coliving": () => import("@/pages/ColivingPageV4"),
  "/nos-maisons": () => import("@/pages/HousesPageV4"),
  "/services": () => import("@/pages/ServicesPageV4"),
  "/tarifs": () => import("@/pages/RatesPageV4"),
  "/faq": () => import("@/pages/FAQPageV4"),
  "/candidature": () => import("@/pages/JoinPageV4"),
  // LP payante (LOT 2) : prérendue mais ABSENTE de cette table jusqu'au 26/08 —
  // `preloadRouteModule` retombait donc sur NotFoundPage, React ne pouvait pas
  // réconcilier le DOM prérendu et détruisait le hero pour le reconstruire
  // (LCP mesuré 4,04 s, dont ~2,9 s de pure attente d'hydratation).
  // Les deux langues pointent le MÊME spécificateur qu'App.tsx → même chunk Vite.
  "/chambres-septembre": () => import("@/pages/ChambresSeptembrePage"),
  "/rooms-september": () => import("@/pages/ChambresSeptembrePage"),
  "/blog": () => import("@/pages/BlogPage"),
  "/lavilla": () => import("@/pages/HouseDetailPage"),
  "/leloft": () => import("@/pages/HouseDetailPage"),
  "/lelodge": () => import("@/pages/HouseDetailPage"),
  "/investisseurs": () => import("@/pages/InvestisseursPage"),
  "/observatoire-logement-frontalier-geneve": () => import("@/pages/ObservatoireLogementFrontalierPage"),
  "/qui-sommes-nous": () => import("@/pages/QuiSommesNousPage"),
  "/charte-transparence": () => import("@/pages/CharteTransparencePage"),
  "/mentions-legales": () => import("@/pages/MentionsLegalesPage"),
  "/politique-de-confidentialite": () => import("@/pages/PolitiqueConfidentialitePage"),
  // Servi uniquement en /en/colocation-geneve (pilier EN) — le préfixe /en est
  // retiré par la normalisation ci-dessous.
  "/colocation-geneve": () => import("@/pages/ColocationGenevePage"),
};

export function preloadRouteModule(pathname: string): Promise<unknown> {
  let p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/en") p = "/";
  else if (p.startsWith("/en/")) p = p.slice(3);

  const loader =
    p.startsWith("/blog/")
      ? () => import("@/pages/BlogPostPage")
      : (STATIC_LOADERS[p] ??
        // URL inconnue avec contenu prérendu = 404.html (NotFoundPage)
        (() => import("@/pages/NotFoundPage")));

  // Ne JAMAIS bloquer l'hydratation sur un échec de préchargement (offline,
  // chunk introuvable…) : React.lazy retentera et gérera l'erreur lui-même.
  return loader().catch(() => undefined);
}
