/**
 * Bloc « L'Appart — l'essentiel » : la fiche PROPRE à L'Appart (décision n° 13 de la critique du 13/11/2026, à confirmer),
 * pendant de <EntityFacts/> pour la page /lappart. Jamais la fiche de la marque sur cette page : elle porte la note Google,
 * « 100+ résidents » et « piscine… dans chaque maison », des preuves des maisons qui ne s'attachent pas à L'Appart.
 *
 * Contenu (src/data/appartFacts.ts, `appartFactsText`) : la phrase canonique de L'Appart, ses loyers, ce qui est compris, son
 * trajet, le bail, la caution et les frais, le garant, puis la phrase canonique de la marque — chacune une seule fois sur la page
 * (garde check:facts, étape E2g), rendue comme UN nœud texte (aucun séparateur <!-- --> au milieu d'une phrase). Bouton et
 * microcopie : ceux de la fiche de la marque, hors du comptage « 1× par page », vérifiés dans le bloc.
 *
 * Pur : aucune donnée Supabase, aucune date calculée — HTML prérendu = premier rendu du navigateur (anti-#418).
 * Mesure : même porte interne que la fiche de la marque (`src=entity_facts`), position `appart_facts` ; événement GA4
 * `entity_facts_click` avec `house: "lappart"`.
 */
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { markInternalRef } from "@/lib/attribution";
import { APPART } from "@/data/appart";
import { APPART_FACTS_VERSION, appartFactsText } from "@/data/appartFacts";

export interface AppartFactsProps {
  className?: string;
  /** Langue forcée ; sinon celle de l'URL. */
  lang?: "fr" | "en";
}

export function AppartFacts({ className = "", lang }: AppartFactsProps) {
  const { language } = useLanguage();
  const L = lang ?? (language === "en" ? "en" : "fr");
  const t = appartFactsText(L);

  const params = new URLSearchParams();
  params.set("property_interest", APPART.key);
  params.set("src", "entity_facts");
  params.set("article", APPART.key);
  params.set("pos", "appart_facts");
  const to = `/candidature?${params.toString()}`;

  const track = () => {
    markInternalRef("entity_facts", APPART.key, "appart_facts");
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "entity_facts_click", {
        page: APPART.key, house: APPART.key, language: L,
      });
    } catch { /* noop */ }
  };

  return (
    <aside
      id="appart-facts"
      data-appart-facts-version={APPART_FACTS_VERSION}
      aria-labelledby="appart-facts-title"
      className={`not-prose my-12 rounded-lg border border-[#E7E5E4] bg-[#FAF9F6] p-6 md:p-8 text-[#44403C] ${className}`}
    >
      <h2
        id="appart-facts-title"
        className="text-2xl md:text-3xl text-[#1C1917] mb-4"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        {t.title}
      </h2>
      <p className="leading-relaxed mb-4">{t.paragraph}</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        {t.bullets.map((b, i) => (
          <li key={i} className="leading-relaxed">{b}</li>
        ))}
      </ul>
      <LocalizedLink
        to={to}
        onClick={track}
        className="inline-flex items-center px-6 py-3 border border-[#1C1917] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#1C1917] hover:text-white transition-colors"
      >
        {t.cta}
      </LocalizedLink>
      <p className="mt-2 text-sm text-[#57534E]">{t.ctaNote}</p>
    </aside>
  );
}
