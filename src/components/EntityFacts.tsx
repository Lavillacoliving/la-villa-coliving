/**
 * Bloc « La Villa Coliving — l'essentiel » — fiche de faits canonique (Lot S1, brief « Socle entité »).
 *
 * Rendu IDENTIQUE partout (14 pages money + 8 articles, FR et EN) : la valeur pour un modèle de langage
 * est la répétition à l'identique. Aucune variante courte/longue, aucune date, aucune disponibilité,
 * aucun appel Supabase : le composant ne dépend que de src/data/entityFacts.ts (chaînes plates),
 * donc le HTML prérendu et le premier rendu client sont identiques (aucun risque #418).
 *
 * Chaque chaîne est rendue comme UN nœud texte (pas de {expr} adjacents) : prerender.mjs n'insère donc
 * jamais de séparateur <!-- --> au milieu d'une phrase, et scripts/check-entity-facts.mjs peut
 * comparer le texte au caractère près.
 *
 * Props : `page` = slug de la page hôte (→ ?article=<page>, utm_campaign) ; `houseSlug` sur les pages
 * maisons (→ ?property_interest=<slug>, exigé par scripts/house-pages-check.mjs) ; `children` = UNE phrase
 * de contexte propre à la page (pages de décision), rendue hors des chaînes canoniques.
 * Attribution : porte interne `entity_facts` (src/lib/attribution.ts), même mécanique que BlocOffre.
 */
import type { ReactNode } from "react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { markInternalRef } from "@/lib/attribution";
import type { HouseKey } from "@/lib/availability";
import { ENTITY_FACTS_VERSION, entityFactsText } from "@/data/entityFacts";

export interface EntityFactsProps {
  page: string;
  houseSlug?: HouseKey;
  children?: ReactNode;
  className?: string;
}

export function EntityFacts({ page, houseSlug, children, className = "" }: EntityFactsProps) {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const t = entityFactsText(L);

  const params = new URLSearchParams();
  if (houseSlug) params.set("property_interest", houseSlug);
  params.set("src", "entity_facts");
  params.set("article", page);
  params.set("pos", "entity_facts");
  const to = `/candidature?${params.toString()}`;

  const track = () => {
    markInternalRef("entity_facts", page, "entity_facts");
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "entity_facts_click", {
        page, house: houseSlug ?? "none", language,
      });
    } catch { /* noop */ }
  };

  return (
    <aside
      id="entity-facts"
      data-entity-facts-version={ENTITY_FACTS_VERSION}
      aria-labelledby="entity-facts-title"
      className={`not-prose my-12 rounded-lg border border-[#E7E5E4] bg-[#FAF9F6] p-6 md:p-8 text-[#44403C] ${className}`}
    >
      <h2
        id="entity-facts-title"
        className="text-2xl md:text-3xl font-light text-[#1C1917] mb-4"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        {t.title}
      </h2>
      <p className="leading-relaxed mb-4">{t.paragraph}</p>
      {children ? <p className="leading-relaxed mb-4 text-[#57534E]">{children}</p> : null}
      <ul className="list-disc pl-6 space-y-2 mb-6">
        {t.bullets.map((b, i) => (
          <li key={i} className="leading-relaxed">{b}</li>
        ))}
      </ul>
      <LocalizedLink
        to={to}
        onClick={track}
        className="inline-flex items-center px-6 py-3 bg-[#1C1917] text-white text-sm tracking-wider uppercase hover:bg-[#D4A574] transition-colors"
      >
        {t.cta}
      </LocalizedLink>
    </aside>
  );
}
