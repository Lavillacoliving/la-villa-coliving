/**
 * Encart A.8 « Pas de chambre libre chez nous ? » (Lot L5 « Groupe Facebook comme ressource nommée », D10 = oui, 10/10/2026).
 *
 * Rendu identique partout : sous la liste des chambres des 3 pages maisons, sur /chambres-disponibles et sur l'écran de
 * confirmation de /candidature. Texte unique : src/data/answerSlots.ts (facebookCallout) depuis FACEBOOK_GROUP (stats.ts) —
 * la phrase est UN nœud texte, le lien est un élément séparé (anti-#418 ; la garde compare le texte au caractère près).
 * Lien normal (jamais nofollow), nouvel onglet. Le groupe n'entre jamais dans sameAs (D10 du socle).
 * Mesure : événement GA4 `facebook_group_click` (position, maison, langue) — hors Supabase.
 */
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FACEBOOK_GROUP } from "@/data/stats";
import { facebookCallout, FACEBOOK_GROUP_VERSION } from "@/data/answerSlots";

export interface FacebookGroupCalloutProps {
  /** Emplacement (GA4) : house_rooms · chambres_disponibles · candidature_success. */
  position: string;
  house?: string;
  className?: string;
}

export function FacebookGroupCallout({ position, house, className = "" }: FacebookGroupCalloutProps) {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const t = facebookCallout(L);
  const track = () => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "facebook_group_click", {
        position, house: house ?? "none", language,
      });
    } catch { /* noop */ }
  };
  return (
    <aside
      id="facebook-group"
      data-facebook-group-version={FACEBOOK_GROUP_VERSION}
      aria-label={L === "en" ? "Facebook group" : "Groupe Facebook"}
      className={`not-prose rounded-lg border border-[#E7E5E4] bg-[#FAF9F6] p-6 md:p-8 text-[#44403C] ${className}`}
    >
      <p className="leading-relaxed mb-4">{t.sentence}</p>
      <a
        href={FACEBOOK_GROUP.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={track}
        className="inline-flex items-center gap-2 text-[#1C1917] font-medium underline underline-offset-4 hover:text-[#D4A574] transition-colors"
      >
        {t.cta}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </a>
    </aside>
  );
}
