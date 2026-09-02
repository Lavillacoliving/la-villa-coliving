import { Component, type ErrorInfo, type ReactNode } from "react";
import { isChunkLoadError } from "@/lib/lazyWithRetry";

/**
 * Filet de sécurité du site public (Lot C — fallback chunk, 02/09/2026).
 *
 * Avant : aucun ErrorBoundary dans l'application — toute erreur de rendu ou d'import
 * dynamique remontait à la racine et React démontait tout (page blanche, sans issue pour
 * le visiteur). Ici : un écran sobre, dans la charte, avec un bouton « Recharger la page ».
 *
 * Placement : autour du <Suspense> d'App.tsx, keyé par le chemin courant pour qu'une
 * navigation vers une autre page réinitialise l'état d'erreur. Ne rend AUCUN élément DOM
 * supplémentaire en fonctionnement normal : le HTML prérendu et l'hydratation sont inchangés.
 *
 * Deux messages : chunk manquant (nouvelle version du site publiée) ou erreur d'exécution.
 * Tracké `chunk_error` (kind: chunk | runtime).
 */

interface Props {
  children: ReactNode;
  /** Langue dérivée de l'URL (/en/*), comme LanguageProvider. */
  en: boolean;
}

interface State {
  error: Error | null;
}

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    try {
      (window as GtagWindow).gtag?.("event", "chunk_error", {
        kind: isChunkLoadError(error) ? "chunk" : "runtime",
        message: String(error?.message ?? error).slice(0, 150),
        component_stack: (info.componentStack ?? "").trim().slice(0, 200),
        page_path: window.location.pathname,
      });
    } catch {
      /* noop — l'analytics ne bloque jamais l'UI */
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const { en } = this.props;
    const chunk = isChunkLoadError(error);

    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 pt-28 pb-16 bg-white">
        <div className="card-ultra bg-white rounded-2xl border border-[#E7E5E4] shadow-sm p-8 max-w-md text-center">
          <h1
            className="text-2xl md:text-3xl mb-3 text-[#1C1917]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {en ? "This page didn't load" : "Cette page n'a pas pu se charger"}
          </h1>
          <p className="text-[#57534E] font-medium mb-6">
            {chunk
              ? en
                ? "A new version of the site has just been published. Reload the page to get it."
                : "Une nouvelle version du site vient d'être publiée. Recharge la page pour la récupérer."
              : en
                ? "Something went wrong on our side. Reloading the page usually fixes it."
                : "Quelque chose s'est mal passé de notre côté. Recharger la page règle généralement le problème."}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#D4A574] text-[#1C1917] font-bold rounded-full hover:bg-[#E0BB8A] transition-colors"
          >
            {en ? "Reload the page" : "Recharger la page"}
          </button>
          <p className="mt-5 text-sm text-[#78716C]">
            <a href={en ? "/en" : "/"} className="underline underline-offset-4 hover:text-[#1C1917]">
              {en ? "Back to home" : "Retour à l'accueil"}
            </a>
          </p>
        </div>
      </main>
    );
  }
}
