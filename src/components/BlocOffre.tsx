import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Check } from "lucide-react";
import { STATS, formatPriceChf, houseAvailabilityLabel, type HouseKey } from "@/data/stats";
import { colocGeneveHref } from "@/lib/siteLinks";
import type { IntentBucket } from "@/data/blogIntentBuckets";

// Bloc offre — le pont blog → formulaire (plan blog-conversion 07/07/2026).
// Constat GA4 : 369 sessions blog/28j → 0 candidature. Les lecteurs lisaient
// puis repartaient sans jamais rencontrer l'offre. Ce bloc la matérialise
// (photo maison + prix + candidature) au milieu et en fin de chaque article.
// Règles : registre tu (bloc produit), prix via STATS uniquement, jamais de
// CTA conversationnel (WhatsApp/DM) — le tunnel est self-service jusqu'au
// formulaire, l'humain (Fanny/Jérôme) prend le relais après.

// L'attribution est portée par l'URL (?src=bloc_offre&article={slug}), lue par
// le formulaire puis persistée en BDD (prospects). Params custom, PAS utm_* :
// des utm sur liens internes redémarrent l'attribution de session GA4.
const CANDIDATURE_REF = (slug: string) =>
  `/candidature?src=bloc_offre&article=${encodeURIComponent(slug)}`;

// Maison mise en avant selon l'article : la commune nommée dans le slug gagne.
// Le Loft = TOUJOURS sa piscine intérieure (règle visuelle permanente).
const HOUSES: Record<HouseKey, { label: string; img: string; descFr: string; descEn: string }> = {
  lavilla: {
    label: "La Villa",
    img: "/images/la villa.webp",
    descFr: "10 chambres · piscine · jardin — Ville-la-Grand",
    descEn: "10 rooms · pool · garden — Ville-la-Grand",
  },
  leloft: {
    label: "Le Loft",
    img: "/images/la villa coliving le loft piscine.webp",
    descFr: "7 chambres · piscine intérieure — Ambilly",
    descEn: "7 rooms · indoor pool — Ambilly",
  },
  lelodge: {
    label: "Le Lodge",
    img: "/images/le lodge.webp",
    descFr: "12 chambres · sauna · gym — Annemasse",
    descEn: "12 rooms · sauna · gym — Annemasse",
  },
};

export function houseForArticle(slug: string): HouseKey {
  if (/annemasse|lodge|quartiers-annemasse/.test(slug)) return "lelodge";
  if (/ambilly|loft/.test(slug)) return "leloft";
  return "lavilla";
}

// Accroche par intent bucket (proximité de la décision logement — cf.
// blogIntentBuckets.ts). Le bouton primaire est TOUJOURS « Candidater »
// (décision débrief 07/07 : objectif = garnir la BDD de prospects) ; seule
// l'accroche s'adapte au contexte de lecture.
const HEADLINES: Record<IntentBucket, { fr: string; en: string }> = {
  high: { fr: "Tu cherches une chambre près de Genève ?", en: "Looking for a room near Geneva?" },
  medium: { fr: "Envie d'un logement tout inclus près de Genève ?", en: "Want all-inclusive housing near Geneva?" },
  admin: { fr: "Tu prépares ton installation côté France ?", en: "Planning your move to the French side?" },
  life: { fr: "Envie d'habiter à 20 min du centre de Genève, sans la galère ?", en: "Want to live 20 min from Geneva city center, hassle-free?" },
  coliving: { fr: "Envie de vivre en coliving près de Genève ?", en: "Want to live in coliving near Geneva?" },
};

interface BlocOffreProps {
  variant: "mid" | "end";
  slug: string;
  bucket: IntentBucket;
}

export function BlocOffre({ variant, slug, bucket }: BlocOffreProps) {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const house = houseForArticle(slug);
  const h = HOUSES[house];
  const price = formatPriceChf(L);
  const to = CANDIDATURE_REF(slug);
  // Lien secondaire : la page maison quand l'article cible Le Lodge (4,65 % de
  // conversion atterrissage — meilleure page du site) ou Le Loft ; sinon le
  // guide « colocation Genève » (complément débrief 07/07, quick win /lelodge).
  const secondary =
    house === "lavilla"
      ? { to: colocGeneveHref(language), label: L === "en" ? "Shared housing in Geneva" : "Colocation Genève : le guide" }
      : { to: `/${house}`, label: L === "en" ? `Discover ${h.label}` : `Découvrir ${h.label}` };

  // Même pattern gtag gardé que le formulaire : l'analytics ne bloque jamais l'UI.
  const track = (target: string) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "blog_cta_click", {
        cta_position: variant, cta_target: target, article_slug: slug, intent: bucket, house, language,
      });
    } catch { /* noop */ }
  };

  const proofs: { fr: string; en: string }[] = [
    {
      fr: `${STATS.totalRooms} chambres meublées dans ${STATS.totalHouses} maisons`,
      en: `${STATS.totalRooms} furnished rooms across ${STATS.totalHouses} houses`,
    },
    {
      fr: `À ${STATS.genevaCenterMinutes} min du centre de Genève`,
      en: `${STATS.genevaCenterMinutes} min from Geneva city center`,
    },
    {
      // « 0 frais » = conséquence du modèle (location en direct), jamais une « interdiction »
      fr: "Location en direct — 0 frais d'agence, réponse sous 48 h",
      en: "Direct rental — no agency fees, reply within 48h",
    },
  ];

  if (variant === "mid") {
    // Variante compacte : interrompt la lecture sans l'écraser (mobile d'abord).
    return (
      <aside className="my-10 bg-[#FAF9F6] border border-[#E7E5E4] rounded-lg overflow-hidden not-prose">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-44 flex-none">
            <img
              src={h.img}
              alt={`${h.label} — coliving près de Genève`}
              className="w-full h-36 sm:h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-5 flex-1">
            <p className="text-[#1C1917] font-medium mb-1" style={{ fontFamily: "DM Serif Display, serif" }}>
              {HEADLINES[bucket][L]}
            </p>
            <p className="text-sm text-[#57534E] mb-3">
              {L === "en"
                ? <>All-inclusive from <strong className="text-[#1C1917]">{price}/month</strong> — {h.descEn}.</>
                : <>Tout inclus dès <strong className="text-[#1C1917]">{price}/mois</strong> — {h.descFr}.</>}
            </p>
            <LocalizedLink
              to={to}
              onClick={() => track(to)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4A574] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#E0BB8A] transition-all duration-300"
            >
              {L === "en" ? "Apply — 2 min, free" : "Candidater — 2 min, gratuit"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
          </div>
        </div>
      </aside>
    );
  }

  // Variante fin d'article : le bloc offre complet.
  return (
    <section className="py-12 lg:py-16 bg-[#FAF9F6] border-t border-[#E7E5E4]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white border border-[#E7E5E4] rounded-lg overflow-hidden md:grid md:grid-cols-[2fr,3fr]">
          <div className="relative">
            <img
              src={h.img}
              alt={`${h.label} — coliving près de Genève`}
              className="w-full h-52 md:h-full object-cover"
              loading="lazy"
            />
            <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-[#1C1917]">
              {houseAvailabilityLabel(house, L)}
            </span>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D4A574] font-semibold mb-2">
              La Villa Coliving · {h.label}
            </p>
            <h2 className="text-xl md:text-2xl font-light text-[#1C1917] mb-2" style={{ fontFamily: "DM Serif Display, serif" }}>
              {HEADLINES[bucket][L]}
            </h2>
            <p className="text-lg text-[#1C1917] font-medium mb-4">
              {L === "en" ? <>All-inclusive from <span className="text-[#D4A574]">{price}</span>/month</> : <>Tout inclus dès <span className="text-[#D4A574]">{price}</span>/mois</>}
            </p>
            <ul className="space-y-1.5 mb-6">
              {proofs.map((p) => (
                <li key={p.fr} className="flex items-start gap-2 text-sm text-[#57534E]">
                  <Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-none" />
                  {p[L]}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <LocalizedLink
                to={to}
                onClick={() => track(to)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4A574] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#E0BB8A] transition-all duration-300"
              >
                {L === "en" ? "Apply — 2 min, free" : "Candidater — 2 min, gratuit"}
                <ArrowRight className="w-4 h-4" />
              </LocalizedLink>
              <LocalizedLink
                to={secondary.to}
                onClick={() => track(secondary.to)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E7E5E4] text-[#44403C] text-sm font-medium rounded-lg hover:border-[#D4A574] transition-all duration-300"
              >
                {secondary.label}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
