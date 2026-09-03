import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { preloadRouteModule } from "@/lib/routePreload";
import { captureAttribution, captureTestFlag } from "@/lib/attribution";
import { recoverFromChunkError } from "@/lib/lazyWithRetry";

// Attribution Ads (utm_* + gclid) et marqueur de test (?test=1) : capturés ICI, dès
// l'exécution du bundle et AVANT l'hydratation — l'URL d'atterrissage est encore intacte,
// quelle que soit la page d'entrée (/, /en, blog, pages Annemasse…). First-touch de
// session, write-once, sessionStorage (voir src/lib/attribution.ts). Aucun accès au DOM :
// zéro impact sur l'hydratation. Brief UTM/GCLID du 22/08/2026 (prérequis Ads 25/08).
captureAttribution();
captureTestFlag();

// Lot C (02/09/2026) — dépendance préchargée introuvable (Vite émet `vite:preloadError` quand un
// <link rel="modulepreload"> d'un import dynamique échoue, typiquement un chunk renommé par un
// déploiement). Même rechargement contrôlé, une seule fois, que lazyWithRetry ; si on recharge,
// preventDefault() évite que Vite relance l'erreur dans l'arbre React.
window.addEventListener("vite:preloadError", (event) => {
  const payload = (event as Event & { payload?: unknown }).payload;
  if (recoverFromChunkError("vite:preloadError", payload, true)) event.preventDefault();
});

const rootElement = document.getElementById("root")!;

// Lot B (02/09/2026) — mesure des erreurs d'hydratation. Clarity ne voit qu'un « Minified React
// error #418 » indistinct ; GA4 reçoit ici la page, le TYPE de mismatch (html / text / attr) et
// si le navigateur est une WebView in-app (Instagram, Facebook, Samsung Internet…) qui modifie
// le DOM avant React — seul moyen de séparer nos régressions des causes hors de notre portée.
// L'erreur est ensuite remontée comme avant (reportError = comportement par défaut de React) :
// rien n'est caché à Clarity ni à la console.
function classifyHydrationError(message: string): "html" | "text" | "attr" | "other" {
  const m = /args\[\]=(html|text)/i.exec(message) ?? /server rendered (HTML|text)/i.exec(message);
  if (m) return m[1].toLowerCase() as "html" | "text";
  if (/attributes/i.test(message)) return "attr";
  return "other";
}
function reportHydrationError(error: unknown, errorInfo: { componentStack?: string }): void {
  const message = error instanceof Error ? error.message : String(error);
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "hydration_error", {
      page_path: window.location.pathname,
      kind: classifyHydrationError(message),
      in_app: /Instagram|FBAN|FBAV|SamsungBrowser|Line\/|Snapchat|TikTok/i.test(navigator.userAgent),
      message: message.slice(0, 150),
      component_stack: (errorInfo?.componentStack ?? "").trim().slice(0, 200),
      transport_type: "beacon",
    });
  } catch {
    /* noop — l'analytics ne bloque jamais l'UI */
  }
  if (typeof reportError === "function") reportError(error);
  else console.error(error);
}

// Capture de l'état embarqué par le prerender (fix CLS 07/2026) AVANT l'hydratation :
// les routes sont en React.lazy, donc le DOM prerendu (et ses <script type="application/json">)
// peut être remplacé avant l'exécution du chunk de la page. Ici, le DOM est garanti intact.
const prerenderState: Record<string, string> = {};
for (const id of ["__blog_post_data__", "__blog_list_data__", "__latest_blog_data__", "__colocation_blog_data__", "__room_availability_data__", "__rooms_level_data__", "__pipeline_ref_month__"]) {
  const el = document.getElementById(id);
  if (el?.textContent) prerenderState[id] = el.textContent;
}
(window as unknown as { __PRERENDER_STATE__: Record<string, string> }).__PRERENDER_STATE__ = prerenderState;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (rootElement.children.length > 0) {
  // Pre-rendered page: hydrate existing HTML (keeps content visible, no flash).
  // Le chunk lazy de la page est préchargé d'abord : la boundary Suspense
  // (déshydratée grâce aux marqueurs posés par scripts/prerender.mjs) est ainsi
  // hydratée immédiatement, sans fenêtre de course avec les premiers setState.
  preloadRouteModule(window.location.pathname).then(() => {
    hydrateRoot(rootElement, app, { onRecoverableError: reportHydrationError });
  });
} else {
  // SPA fallback (dashboard, portail, etc.): render from scratch
  createRoot(rootElement).render(app);
}
