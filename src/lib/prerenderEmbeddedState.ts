/**
 * État embarqué dans le HTML prérendu pour hydrater sans fetch (pattern du fix
 * CLS blog 07/2026, généralisé pour le fix hydratation #418 08/2026).
 *
 * Un composant qui fetch ses données en useEffect rend « vide » au premier
 * rendu client : jamais égal au snapshot Puppeteer → mismatch d'hydratation
 * (#418) et re-render du contenu. Remède : le composant sérialise ses données
 * dans un <script type="application/json" id="…"> (donc présent dans le
 * snapshot), et les relit de façon SYNCHRONE à l'initialisation du state —
 * premier rendu client identique au snapshot, fetch évité.
 *
 * ⚠️ main.tsx capture ces scripts AVANT hydrateRoot dans __PRERENDER_STATE__
 * (le DOM prérendu peut être remplacé avant l'exécution du chunk de page) :
 * tout nouvel id utilisé ici DOIT être ajouté à la liste de main.tsx.
 *
 * (BlogPage/BlogPostPage portent leur propre copie historique de ce pattern.)
 */

export function readEmbeddedArray<T>(id: string): T[] | null {
  if (typeof window === "undefined") return null;
  try {
    const stash = (window as unknown as { __PRERENDER_STATE__?: Record<string, string> })
      .__PRERENDER_STATE__;
    const raw = stash?.[id] ?? document.getElementById(id)?.textContent;
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    // Tableau vide = capture prématurée du prerender → refaire le fetch normal.
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

/** Sérialisation sûre pour dangerouslySetInnerHTML (« < » échappé). */
export function embedJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
