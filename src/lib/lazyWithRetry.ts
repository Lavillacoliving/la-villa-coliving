import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/**
 * Chargement paresseux résilient aux déploiements (Lot C — fallback chunk, 02/09/2026).
 *
 * Symptôme corrigé : « Failed to fetch dynamically imported module …/assets/HouseDetailPage-*.js »
 * (Chrome, Samsung Internet) / « Importing a module script failed » (Safari, app Instagram).
 * Chaque déploiement Vercel renomme les chunks hachés ; un visiteur qui a encore l'ancien
 * HTML (onglet ouvert, cache) demande un fichier qui n'existe plus, reçoit la page 404 en
 * HTML, et `import()` échoue. Sans garde, l'erreur remonte au <Suspense> d'App.tsx, React
 * démonte la racine : page blanche (reproduit le 02/09 : `#root` vidé après navigation).
 *
 * Stratégie : sur un échec de chargement de chunk, un rechargement contrôlé, UNE fois
 * (drapeau sessionStorage), tracké `chunk_reload`. Si le chunk manque encore après ce
 * rechargement, l'erreur est relancée et l'ErrorBoundary propose « Recharger la page »
 * (tracké `chunk_error`) ; au chargement direct d'une page prérendue, on garde plutôt le
 * HTML prérendu tel quel (liens fonctionnels) sans hydrater. Le drapeau n'est levé que par
 * un import RÉUSSI : le prochain déploiement retrouve son rechargement silencieux, et deux
 * appelants du même chargement ne peuvent pas se relancer mutuellement.
 *
 * Trois points d'entrée partagent `recoverFromChunkError` :
 *  - `lazyWithRetry` (toutes les pages d'App.tsx, la lightbox photos) ;
 *  - `preloadRouteModule` (src/lib/routePreload.ts) — échec AVANT hydrateRoot ;
 *  - l'événement Vite `vite:preloadError` (src/main.tsx) — dépendance préchargée manquante.
 */

/** Drapeau unique : au plus un rechargement automatique jusqu'au prochain import réussi. */
const RELOAD_FLAG = "lvc_chunk_reload";

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

/** Même garde que les autres événements du site : l'analytics ne casse jamais l'UI. */
function track(event: "chunk_reload" | "chunk_error", params: Record<string, unknown>): void {
  try {
    (window as GtagWindow).gtag?.("event", event, {
      page_path: window.location.pathname,
      // sendBeacon : l'événement part même si la page se recharge juste après.
      transport_type: "beacon",
      ...params,
    });
  } catch {
    /* noop */
  }
}

/** Messages d'échec d'`import()` des navigateurs supportés + préchargement Vite. */
const CHUNK_ERROR_RE =
  /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS|Loading (CSS )?chunk/i;

export function isChunkLoadError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  return CHUNK_ERROR_RE.test(message);
}

/** sessionStorage peut être absent ou lever (navigation privée Safari, WebView bridée). */
function storage(): Storage | null {
  try {
    return typeof window !== "undefined" && window.sessionStorage ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

function hasReloaded(): boolean {
  try {
    return !!storage()?.getItem(RELOAD_FLAG);
  } catch {
    return false;
  }
}

/** Appelé après tout import réussi : le prochain déploiement retrouve son rechargement. */
export function clearReloadFlag(): void {
  try {
    storage()?.removeItem(RELOAD_FLAG);
  } catch {
    /* noop */
  }
}

/**
 * Tente de récupérer un échec de chargement de chunk.
 * @returns `true` si un rechargement a été déclenché — l'appelant doit alors rester en
 *   attente (la page va se recharger) ; `false` sinon — l'appelant relance l'erreur.
 * @param assumeChunkError l'appelant sait déjà qu'il s'agit d'un chunk (vite:preloadError).
 */
export function recoverFromChunkError(
  chunk: string,
  error: unknown,
  assumeChunkError = false,
): boolean {
  if (!assumeChunkError && !isChunkLoadError(error)) return false;
  const store = storage();
  if (!store) {
    // Sans stockage, impossible de garantir « une seule fois » : pas de boucle, on
    // laisse l'ErrorBoundary proposer le rechargement manuel.
    track("chunk_error", { chunk, attempt: 1, reason: "no_storage" });
    return false;
  }
  if (hasReloaded()) {
    // Déjà rechargé une fois et le chunk manque encore : on NE lève PAS le drapeau ici.
    // Plusieurs appelants se succèdent au même chargement (préchargement, puis lazy) :
    // lever le drapeau au premier permettrait au second de recharger → boucle infinie
    // (151 rechargements observés au test du 02/09). Seul un import réussi le lève.
    track("chunk_error", { chunk, attempt: 2 });
    return false;
  }
  try {
    store.setItem(RELOAD_FLAG, String(Date.now()));
  } catch {
    track("chunk_error", { chunk, attempt: 1, reason: "storage_write" });
    return false;
  }
  track("chunk_reload", { chunk, attempt: 1 });
  window.location.reload();
  return true;
}

/** Promesse jamais résolue : garde le fallback <Suspense> affiché pendant le rechargement. */
const PENDING_RELOAD = new Promise<never>(() => {});

/**
 * Remplace `React.lazy` pour tous les imports dynamiques du site public.
 * @param chunk nom lisible du module, envoyé dans les événements GA4.
 */
export function lazyWithRetry<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- même signature que React.lazy
  T extends ComponentType<any>,
>(importer: () => Promise<{ default: T }>, chunk: string): LazyExoticComponent<T> {
  return lazy(() =>
    importer().then(
      (mod) => {
        clearReloadFlag();
        return mod;
      },
      (error: unknown) => {
        if (recoverFromChunkError(chunk, error)) return PENDING_RELOAD;
        throw error;
      },
    ),
  );
}
