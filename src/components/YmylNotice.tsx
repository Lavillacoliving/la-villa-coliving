import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Encart d'avertissement YMYL (« Your Money or Your Life ») affiché en fin des
 * articles fiscaux/juridiques — signal de confiance (E-E-A-T) attendu par Google.
 *
 * Signature actuelle = organisation (« La Villa Coliving », Option 3).
 * Pour passer à un auteur nommé plus tard : changer `author` en base + ajouter une
 * bio ; cet encart reste valable tel quel.
 */
const YMYL_SLUGS = new Set([
  "fiscalite-frontalier-geneve-impots-2026",
  "declaration-impots-frontalier-2026",
  "3e-pilier-frontalier-geneve",
  "avenant-fiscal-40-frontalier-geneve",
  "teletravail-frontalier-geneve-regles-2026",
  "permis-g-frontalier-geneve",
  "assurance-sante-frontalier-lamal-cmu-budget",
]);

export function isYmyl(slug: string): boolean {
  return YMYL_SLUGS.has(slug);
}

export function YmylNotice() {
  const { language } = useLanguage();
  const fr = language !== "en";
  return (
    <aside className="mt-12 p-5 bg-[#FBF7F0] border border-[#E7D9C2] rounded-lg text-sm text-[#57534E]">
      <p className="font-medium text-[#1C1917] mb-1">
        {fr ? "Avertissement" : "Disclaimer"}
      </p>
      <p>
        {fr
          ? "Cet article est fourni à titre informatif et ne constitue pas un conseil fiscal personnalisé. Les règles évoluent et votre situation peut comporter des spécificités. Pour une décision engageante, consultez un fiduciaire ou un conseiller spécialisé en fiscalité transfrontalière."
          : "This article is provided for information only and does not constitute personalised tax advice. Rules change and your situation may have specifics. For any binding decision, consult a fiduciary or an adviser specialised in cross-border taxation."}
      </p>
      <p className="mt-2 text-xs text-[#78716C]">
        {fr
          ? "Sources : administrations officielles citées et liées dans l'article (liens vérifiés)."
          : "Sources: official administrations cited and linked in the article (links verified)."}
      </p>
    </aside>
  );
}
