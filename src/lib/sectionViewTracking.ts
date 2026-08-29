import { useEffect } from "react";

// section_view — mesure d'atteinte des sections de la home (Brief V2, Lot 1b) :
// tranche l'ambiguïté cliqueurs/rebondeurs de la « falaise » après la grille
// maisons, et sert de métrique de jugement du réordonnancement (Lot 2 :
// atteinte de la section paiement avant/après, en ratio par vue de page).
//
// Seuil : 50 % de la section visible, OU la section couvre ≥ 50 % du viewport —
// sans cette seconde condition, une section plus haute que 2 écrans (fréquent
// sur mobile) n'atteint JAMAIS un intersectionRatio de 0,5 et ne serait jamais
// comptée. Une émission par section et par vue de page (jamais dupliquée au
// re-scroll : l'élément est désobservé après émission).
//
// Les ids vivent dans des wrappers neutres posés par la page (data-home-section),
// PAS dans les composants de section : le Lot 2 peut réordonner les sections
// sans casser l'instrumentation.
export function useSectionViewTracking(attribute = "data-home-section") {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(`[${attribute}]`));
    if (nodes.length === 0) return;

    const fired = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).getAttribute(attribute) ?? "";
          if (!id || fired.has(id)) continue;
          const viewportCoverage =
            entry.intersectionRect.height / Math.max(1, window.innerHeight);
          if (entry.intersectionRatio >= 0.5 || viewportCoverage >= 0.5) {
            fired.add(id);
            try {
              (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(
                "event",
                "section_view",
                { section_id: id },
              );
            } catch {
              /* l'analytics ne bloque jamais l'UI */
            }
            observer.unobserve(entry.target);
          }
        }
      },
      // Paliers denses : la condition « couvre 50 % du viewport » doit être
      // réévaluée pendant la traversée des sections hautes (l'observer ne
      // rappelle qu'aux franchissements de seuil).
      { threshold: Array.from({ length: 11 }, (_, i) => i * 0.05) },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [attribute]);
}
