import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root")!;

// Capture de l'état embarqué par le prerender (fix CLS 07/2026) AVANT l'hydratation :
// les routes sont en React.lazy, donc le DOM prerendu (et ses <script type="application/json">)
// peut être remplacé avant l'exécution du chunk de la page. Ici, le DOM est garanti intact.
const prerenderState: Record<string, string> = {};
for (const id of ["__blog_post_data__", "__blog_list_data__"]) {
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
  // Pre-rendered page: hydrate existing HTML (keeps content visible, no flash)
  hydrateRoot(rootElement, app);
} else {
  // SPA fallback (dashboard, portail, etc.): render from scratch
  createRoot(rootElement).render(app);
}
