import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root")!;
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
