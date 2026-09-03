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

import { isChunkLoadError, recoverFromChunkError } from "@/lib/lazyWithRetry";

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
  // Toute page prérendue DOIT figurer ici : absente, `preloadRouteModule` retombe sur
  // NotFoundPage, React ne peut pas réconcilier le DOM prérendu et le reconstruit
  // (LCP mesuré 4,04 s sur l'ancienne LP le 26/08, dont ~2,9 s d'attente d'hydratation).
  // (Lot 3 SEO funnel) /chambres-disponibles remplace la LP /chambres-septembre (301).
  "/chambres-disponibles": () => import("@/pages/ChambresDisponiblesPage"),
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

  // Chunk de page introuvable AVANT hydrateRoot (déploiement entre deux chargements,
  // Lot C 02/09/2026) : rechargement contrôlé, une seule fois, et on n'hydrate pas —
  // le HTML prérendu reste affiché jusqu'au rechargement. Si le chunk manque encore
  // après ce rechargement (déploiement incohérent), on n'hydrate pas non plus : la page
  // prérendue reste visible et ses liens (CTA, nav) fonctionnent en navigation classique —
  // préférable à un écran d'erreur sur une page marketing ; `chunk_error` est tracké.
  // Tout autre échec (offline…) ne bloque jamais l'hydratation : lazyWithRetry
  // retentera et gérera l'erreur.
  return loader().catch((error: unknown) => {
    if (!isChunkLoadError(error)) return undefined;
    recoverFromChunkError(`route:${p}`, error);
    return new Promise<never>(() => {});
  });
}
