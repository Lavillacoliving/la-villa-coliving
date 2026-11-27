import { useEffect } from "react";

/**
 * Apparition au défilement (brief « Accueil : récit, avis, photos » du 27/11/2026, lot 2a, §0.9 « Mouvement ») : opacité de
 * 0 à 1 et montée de 16 px, 500 ms, ease-out, UNE fois, sur les blocs `[data-reveal]` situés SOUS l'écran au chargement.
 *
 * Garde-fous :
 * - le HTML prérendu ne change pas et tout reste visible sans JavaScript : l'état de départ (`lvc-reveal-pending`) est posé ici,
 *   côté client, après l'hydratation, et seulement sur les blocs hors écran (jamais rien qui apparaît puis disparaît) ;
 * - `prefers-reduced-motion: reduce` ou pas d'IntersectionObserver : rien n'est posé ;
 * - navigateur piloté par un robot (`navigator.webdriver`, comme la garde des mesures d'audience d'index.html) : rien n'est
 *   posé — sinon le robot du prérendu (Puppeteer) figeait `lvc-reveal-pending` dans le HTML servi, et sans JavaScript les
 *   blocs seraient restés invisibles (constaté au point d'étape du 27/11/2026) ;
 * - `transform` et `opacity` seulement (aucun décalage de mise en page, CLS inchangé) ; aucune bibliothèque.
 */
export function useReveal(selector = "[data-reveal]") {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (navigator.webdriver) return;
    const fold = window.innerHeight;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => el.getBoundingClientRect().top > fold,
    );
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("lvc-reveal-in");
          el.classList.remove("lvc-reveal-pending");
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    for (const el of nodes) {
      el.classList.add("lvc-reveal-pending");
      observer.observe(el);
    }
    return () => {
      observer.disconnect();
      for (const el of nodes) el.classList.remove("lvc-reveal-pending");
    };
  }, [selector]);
}
