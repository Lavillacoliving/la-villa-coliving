import { useSyncExternalStore } from "react";

// `true` seulement après l'hydratation (Lot B du brief « Formulaire, hydratation, mesure »,
// 01/10/2026 — extrait de ChambresDisponiblesPage, où il pilotait déjà les filtres ?maison= / ?sdb=).
// Pendant l'hydratation, React lit le snapshot « serveur » (false) : le premier rendu client est
// identique au HTML prérendu, puis React re-rend aussitôt avec la vraie valeur (true). Un composant
// monté APRÈS l'hydratation (navigation SPA) vaut true dès son premier rendu — aucun flash.
//
// ⚠️ À réserver à ce qui dépend de l'URL (query string) et qui est ABSENT du snapshot sans
// paramètres : le prérendu est une capture Puppeteer d'un rendu client, où ce hook vaut déjà true.
// Gater un contenu présent dans le snapshot (date, mois, compteur…) créerait au contraire un
// mismatch — pour ceux-là, embarquer la valeur du prérendu (voir src/lib/renderMonth.tsx).
const noopSubscribe = () => () => {};
const getClient = () => true;
const getServer = () => false;

export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, getClient, getServer);
}
