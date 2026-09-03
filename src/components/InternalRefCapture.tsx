import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureInternalRef } from "@/lib/attribution";

// Lot 1 attribution (03/09/2026) — pendant SPA de l'appel de main.tsx : une navigation
// interne (LocalizedLink) ne recharge pas la page, donc `?src=bloc_offre&article=…`
// posé sur /candidature ou une page maison doit être relu à chaque changement d'URL.
// Écriture write-once (première touche jamais écrasée), aucun élément DOM rendu :
// le shell [header…footer] attendu par scripts/prerender.mjs et l'hydratation ne
// changent pas. Même pattern que RouteChangeTracker.
export function InternalRefCapture() {
  const { search, pathname } = useLocation();
  useEffect(() => {
    captureInternalRef(search, pathname);
  }, [search, pathname]);
  return null;
}
