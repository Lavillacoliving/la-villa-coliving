/**
 * Bloc « Où chercher une chambre côté France quand on travaille à Genève » (Lot L1 « ingénierie des créneaux »,
 * brief v3.1 du 09/10/2026, M1).
 *
 * Rendu IDENTIQUE partout (4 pages money en JSX, 5 articles via l'allowlist src/data/ouChercherArticles.ts, FR et
 * EN) : les assistants IA recopient les titres et les listes des pages lues ; La Villa est nommée dans le créneau
 * « opérateurs de coliving ». Textes = src/data/answerSlots.ts (source unique, chiffres depuis stats.ts) ; la garde
 * scripts/check-answer-slots.mjs compare le HTML prérendu à ouChercherStrings() au caractère près.
 *
 * Une <section> (contenu principal, L1.2 — pas un <aside> : la garde retire les asides avant de chercher la marque
 * sous un H2), un H2 puis des couples H3/P ; chaque chaîne est UN nœud texte (aucune balise inline, aucun {a}{b}
 * adjacent : prerender.mjs n'insère donc jamais de <!-- --> au milieu d'une phrase), aucune donnée Supabase, aucune
 * date : HTML prérendu et premier rendu client identiques (aucun risque #418). Pas de CTA en v1 (le bloc entité
 * adjacent en porte un).
 *
 * Props : `variant` (full : zones + 4 canaux + dossier ; short : 4 canaux) ; `page` = slug hôte (attribut data,
 * pour les relectures) ; `tone` = classes d'un article (celles de BlogPostPage.mdComponents) ou d'une page money.
 */
import { Fragment } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { OU_CHERCHER_VERSION, ouChercherText, type OuChercherVariant } from "@/data/answerSlots";

export interface OuChercherProps {
  variant: OuChercherVariant;
  page: string;
  tone?: "article" | "page";
  className?: string;
}

const SERIF = { fontFamily: '"DM Serif Display", serif' } as const;

export function OuChercher({ variant, page, tone = "page", className = "" }: OuChercherProps) {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const t = ouChercherText(L, variant);
  const article = tone === "article";
  const h2Class = article
    ? "text-2xl md:text-3xl font-semibold text-[#1C1917] mt-12 mb-4"
    : "text-3xl md:text-4xl font-light text-[#1C1917] mb-6";
  const h3Class = article
    ? "text-xl md:text-2xl font-semibold text-[#1C1917] mt-8 mb-3"
    : "text-xl md:text-2xl font-medium text-[#1C1917] mt-8 mb-3";
  const pClass = article ? "mb-6 leading-relaxed" : "text-[#57534E] leading-relaxed mb-6";

  return (
    <section
      id="ou-chercher"
      data-ou-chercher-variant={variant}
      data-ou-chercher-version={OU_CHERCHER_VERSION}
      data-ou-chercher-page={page}
      aria-labelledby="ou-chercher-title"
      className={className}
    >
      <h2 id="ou-chercher-title" className={h2Class} style={SERIF}>{t.title}</h2>
      {t.sections.map((s) => (
        <Fragment key={s.key}>
          <h3 className={h3Class} style={SERIF}>{s.h3}</h3>
          <p className={pClass}>{s.p}</p>
        </Fragment>
      ))}
    </section>
  );
}
