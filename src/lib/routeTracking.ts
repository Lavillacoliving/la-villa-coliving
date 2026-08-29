import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// route_change — corrige la cécité SPA côté GA4 (Brief Conversion V2, Lot 1b) :
// les navigations internes (navbar, cartes maisons, toggle langue) ne produisent
// aucun signal fiable en SPA — impossible de reconstruire les parcours réels vers
// /candidature par canal/device. Cet event trace chaque transition from → to.
// Le premier rendu (atterrissage) est exclu : page_view le couvre déjà.
//
// Option volontairement NON implémentée (à décider avec Jérôme, pas seul) :
// clarity("stop")/clarity("start") sur changement de route pour étanchéifier les
// scrollmaps Clarity — piste déjà notée par l'équipe dans le commentaire du
// snippet (index.html).
export function RouteChangeTracker() {
  const { pathname } = useLocation();
  const previousRef = useRef<string | null>(null);

  useEffect(() => {
    const previous = previousRef.current;
    previousRef.current = pathname;
    if (previous === null || previous === pathname) return;
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "route_change", {
        from_path: previous,
        to_path: pathname,
      });
    } catch {
      /* l'analytics ne bloque jamais l'UI */
    }
  }, [pathname]);

  return null;
}
