import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { mirrorPath } from "@/lib/localizedPath";

export function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Le toggle de langue navigue vers l'URL miroir (/x ↔ /en/x) : même page,
    // autre langue — on conserve la position de lecture au lieu de remonter.
    const isLanguageSwitch = mirrorPath(prevPathname.current) === pathname;
    prevPathname.current = pathname;
    if (!isLanguageSwitch) {
      // 'instant' : évite l'animation smooth globale lors d'un changement de page
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}
