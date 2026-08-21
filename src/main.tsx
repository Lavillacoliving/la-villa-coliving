import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { preloadRouteModule } from "@/lib/routePreload";
import { captureAttribution, captureTestFlag } from "@/lib/attribution";

// Attribution Ads (utm_* + gclid) et marqueur de test (?test=1) : capturés ICI, dès
// l'exécution du bundle et AVANT l'hydratation — l'URL d'atterrissage est encore intacte,
// quelle que soit la page d'entrée (/, /en, blog, pages Annemasse…). First-touch de
// session, write-once, sessionStorage (voir src/lib/attribution.ts). Aucun accès au DOM :
// zéro impact sur l'hydratation. Brief UTM/GCLID du 22/08/2026 (prérequis Ads 25/08).
captureAttribution();
captureTestFlag();

const rootElement = document.getElementById("root")!;

// Capture de l'état embarqué par le prerender (fix CLS 07/2026) AVANT l'hydratation :
// les routes sont en React.lazy, donc le DOM prerendu (et ses <script type="application/json">)
// peut être remplacé avant l'exécution du chunk de la page. Ici, le DOM est garanti intact.
const prerenderState: Record<string, string> = {};
for (const id of ["__blog_post_data__", "__blog_list_data__", "__latest_blog_data__", "__colocation_blog_data__", "__room_availability_data__"]) {
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
    hydrateRoot(rootElement, app);
  });
} else {
  // SPA fallback (dashboard, portail, etc.): render from scratch
  createRoot(rootElement).render(app);
}
