import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Header et footer ALLÉGÉS des pages d'atterrissage payantes (LP).
 *
 * Pourquoi pas simplement « pas de header/footer » (brief LOT 2 : « pas de footer
 * complet ») : `scripts/prerender.mjs` refuse de prérendre une route dont le shell
 * n'est pas exactement [<header> … <footer>] — fail-fast « shell non reconnu »,
 * la page ne serait pas prérendue DU TOUT et l'objectif LCP < 2,5 s deviendrait
 * hors d'atteinte. On garde donc les deux balises, vidées de leur substance.
 *
 * Header : le logo seul, NON cliquable. Sur une page payante, chaque lien de
 * navigation est une sortie de tunnel — le visiteur a déjà cliqué une annonce,
 * on ne lui rouvre pas le site.
 * Footer : strictement les deux obligations légales.
 */

export function LpHeader() {
  return (
    // Voile sombre dégressif derrière le logo : le logo est clair et le hero
    // ouvre sur un ciel bleu vif — sans ce voile il devient illisible (constaté
    // au rendu mobile le 24/08). L'ombre portée seule ne suffisait pas.
    <header className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/50 to-transparent pb-10 pt-5">
      <div className="container-custom flex justify-center md:justify-start">
        <img
          src="/logos/NEW Logo La Villa-14.png"
          alt="La Villa Coliving"
          width={132}
          height={44}
          className="h-9 w-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)]"
        />
      </div>
    </header>
  );
}

export function LpFooter() {
  const { language } = useLanguage();
  const en = language === "en";
  const prefix = en ? "/en" : "";
  return (
    <footer className="bg-[#1C1917] py-8">
      <div className="container-custom flex flex-col items-center gap-3 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#A8A29E]">
          <Link
            to={`${prefix}/mentions-legales`}
            className="underline underline-offset-4 hover:text-white transition-colors"
          >
            {en ? "Legal notice" : "Mentions légales"}
          </Link>
          <Link
            to={`${prefix}/politique-de-confidentialite`}
            className="underline underline-offset-4 hover:text-white transition-colors"
          >
            {en ? "Privacy policy" : "Politique de confidentialité"}
          </Link>
        </div>
        <p className="text-xs text-[#78716C]">
          © {new Date().getFullYear()} La Villa Coliving
        </p>
      </div>
    </footer>
  );
}
