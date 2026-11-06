/**
 * Ligne A.9 « Tu cherches aussi ailleurs ? » (brief de Jérôme du 05/11/2026, D1-D4) : le groupe Facebook nommé ET attribué à
 * « l'équipe de La Villa Coliving » sur l'accueil (sous la section maisons) et sur /nos-maisons (fin de page, avant la phrase
 * d'appel). ChatGPT ne lit pas Facebook : il ne connaît le groupe que par les pages qui le nomment.
 *
 * Retenue premium : une phrase, aucun bouton ni encart, le nom du groupe une fois. Texte unique : src/data/answerSlots.ts
 * (facebookLine) depuis FACEBOOK_GROUP (stats.ts). La phrase est UN nœud texte, le lien un élément séparé (anti-#418 ; la garde
 * check-answer-slots compare le texte au caractère près). Lien normal (jamais nofollow), nouvel onglet, rel="noopener".
 * Mesure : événement GA4 `facebook_group_click` (même événement que l'encart A.8, position distincte).
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { FACEBOOK_GROUP } from "@/data/stats";
import { facebookLine, FACEBOOK_GROUP_VERSION } from "@/data/answerSlots";

export interface FacebookGroupLineProps {
  /** Emplacement (GA4) : home_houses · nos_maisons_end. */
  position: string;
  className?: string;
}

export function FacebookGroupLine({ position, className = "" }: FacebookGroupLineProps) {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const t = facebookLine(L);
  const track = () => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "facebook_group_click", { position, house: "none", language });
    } catch { /* noop */ }
  };
  return (
    <p data-facebook-line data-facebook-group-version={FACEBOOK_GROUP_VERSION} className={`text-sm leading-relaxed text-[#57534E] ${className}`}>
      {t.sentence}{" "}
      <a
        href={FACEBOOK_GROUP.url}
        target="_blank"
        rel="noopener"
        onClick={track}
        className="whitespace-nowrap font-medium text-[#1C1917] underline underline-offset-4 hover:text-[#b8860b] transition-colors"
      >
        {t.cta}
      </a>
    </p>
  );
}
