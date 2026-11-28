/**
 * Bloc « La Villa Coliving — l'essentiel » — fiche de faits canonique (Lot S1, brief « Socle entité »).
 *
 * Rendu IDENTIQUE partout (14 pages money + 8 articles, FR et EN) : la valeur pour un modèle de langage
 * (Lot L3, D4 — 10/10/2026 : la puce « Avis » est suivie du lien « Voir les avis » vers la fiche Google, élément séparé.)
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
 *
 * `collapseOnMobile` (sous-lot A, décision Jérôme du 11/11/2026 — pages maisons ; étendu à /nos-maisons et à l'accueil, où la
 * fiche passe sous la FAQ, par les lots 1 et 2 de la refonte des pages de vente, décisions de Jérôme du 24/11/2026) : sur mobile, la fiche
 * s'arrête après son premier paragraphe, sous un bouton « Voir tout l'essentiel ». Le reste (phrase de contexte, puces,
 * bouton, microcopie) est masqué en CSS et reste dans le HTML : la garde check:facts lit toujours les mêmes phrases.
 * Replié au prérendu comme au premier rendu du navigateur (aucun écart d'hydratation) ; toujours déplié à partir de md.
 * (25/11/2026, décision de Jérôme : « sur de nombreuses pages le bloc n'est pas fermé ») Replié PARTOUT par défaut : les 14 pages
 * et les 8 articles qui portent la fiche, comme les pages maisons, /nos-maisons et l'accueil. `collapseOnMobile={false}` reste
 * possible, aucune page ne s'en sert.
 */
import { useState, type ReactNode } from "react";
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
  /** Sur mobile, replie la fiche après son premier paragraphe (tout reste dans le HTML). Vrai par défaut depuis le 25/11/2026 : partout. */
  collapseOnMobile?: boolean;
}

export function EntityFacts({ page, houseSlug, children, className = "", collapseOnMobile = true }: EntityFactsProps) {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const t = entityFactsText(L);
  const [open, setOpen] = useState(false);
  const folded = collapseOnMobile && !open;

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
  // (24/11/2026, brief « budget réel ») « Voir le calcul » : lien simple (chargement complet, le navigateur descend à l'ancre du HTML
  // prérendu) vers le bloc 2 de /tarifs ; sur /tarifs, une ancre dans la page. Événement `essentiel_calcul_click` (page d'origine).
  const calcHref = page === "tarifs" ? `#${t.calcLink.anchor}` : `${t.calcLink.path}#${t.calcLink.anchor}`;
  const trackCalc = () => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "essentiel_calcul_click", { page, language });
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
        className="lvc-display text-2xl md:text-3xl text-[#1C1917] mb-4"
      >
        {t.title}
      </h2>
      {/* (24/11/2026, budget réel) Les six phrases d'ouverture ; la 1re (le prix) reste visible quand la fiche est repliée. */}
      <p className="leading-relaxed mb-4">{t.lead[0]}</p>
      {folded ? (
        <button
          type="button"
          aria-expanded={false}
          aria-controls="entity-facts-more"
          onClick={() => {
            setOpen(true);
            try {
              (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "fold_toggle", {
                fold: "entity_facts", state: "open", house: houseSlug ?? "none", language,
              });
            } catch { /* noop */ }
          }}
          className="md:hidden text-sm font-semibold text-[#1C1917] underline underline-offset-4"
        >
          {L === "en" ? "See all the essentials" : "Voir tout l'essentiel"}
        </button>
      ) : null}
      <div id="entity-facts-more" className={folded ? "hidden md:block" : undefined}>
      {t.lead.slice(1).map((s, i) =>
        i === 3 ? (
          // Phrase 5 (repères de Genève) : la phrase = un nœud texte dans son <span>, puis une espace et le lien (anti-#418).
          <p key={i} className="leading-relaxed mb-4">
            <span>{s}</span>{" "}
            <a href={calcHref} onClick={trackCalc} className="underline underline-offset-4 text-[#1C1917] hover:text-[#D4A574] transition-colors">
              {t.calcLink.label}
            </a>
          </p>
        ) : (
          <p key={i} className="leading-relaxed mb-4">{s}</p>
        ),
      )}
      <p className="leading-relaxed mb-4">{t.paragraph}</p>
      {children ? <p className="leading-relaxed mb-4 text-[#57534E]">{children}</p> : null}
      <ul className="list-disc pl-6 space-y-2 mb-6">
        {t.bullets.map((b, i) => (
          <li key={i} className="leading-relaxed">
            {b === t.reviewsLink.bullet ? (
              // (Lot L3, D4) La note n'est jamais publiée sans le lien vers la fiche Google : phrase = un nœud texte dans son
              // <span>, puis un espace et le <a> (aucun nœud texte adjacent → le HTML prérendu reste hydratable).
              <>
                <span>{b}</span>{" "}
                <a
                  href={t.reviewsLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 text-[#1C1917] hover:text-[#D4A574] transition-colors"
                >
                  {t.reviewsLink.label}
                </a>
              </>
            ) : (
              b
            )}
          </li>
        ))}
      </ul>
      {/* (Retenue premium, lot 1, T13 — 13/10/2026) Bouton secondaire en casse normale ; la réassurance en microcopie dessous. */}
      <LocalizedLink
        to={to}
        onClick={track}
        className="lvc-btn-secondary inline-flex items-center px-6 py-3 text-sm"
      >
        {t.cta}
      </LocalizedLink>
      <p className="mt-2 text-sm text-[#57534E]">{t.ctaNote}</p>
      </div>
    </aside>
  );
}
