/**
 * Bloc « Trois vérifications » — article « Non, La Villa Coliving n'est pas une arnaque » (brief v2 du 15/10/2026,
 * décisions Q1-Q20 de Jérôme du 16/10/2026). Inséré par BlogPostPage à la place des marqueurs `<!-- verifier -->`
 * (bloc complet, après le titre « Trois vérifications, trente secondes ») et `<!-- verifier:court -->` (encadré
 * « Vérifier en 30 secondes » après le premier paragraphe, Q11 : atteignable en un scroll sur mobile).
 *
 * Aucune donnée d'entité en dur : note Google = GOOGLE_REVIEWS via STATS_DISPLAY.googleRating, toujours suivie du lien
 * « Voir les avis » (règle L3) ; société = LEGAL_ENTITY (SCI Sleep In seule, Q3) ; maisons = ENTITY_HOUSES et leurs pages
 * (zone seulement, jamais de rue ni de coordonnées : décision sécurité du 12/10/2026, Q2). Aucun appel Supabase, aucune
 * date calculée : rendu identique au prérendu et au client.
 *
 * Mesure : `verify_click` (paramètre `target` = google | registre | maison), seul événement ajouté par le brief.
 */
import type { ReactNode } from "react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL, STATS_DISPLAY } from "@/data/stats";
import { ENTITY_HOUSES, LEGAL_ENTITY } from "@/data/entityFacts";

export type VerifyBlockVariant = "full" | "short";
type VerifyTarget = "google" | "registre" | "maison";

/** Ancre du bloc complet — cible du lien « Le détail ↓ » de l'encadré court. */
export const VERIFY_BLOCK_ID = "verifier";

function trackVerify(target: VerifyTarget) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "verify_click", { target });
  } catch { /* noop — l'analytics ne bloque jamais l'UI */ }
}

const linkBtn =
  "inline-flex min-h-[44px] items-center gap-1.5 px-4 rounded-lg border border-[#1C1917] text-sm font-semibold text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-colors";

function ExternalLink({ href, target, children }: { href: string; target: VerifyTarget; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackVerify(target)} className={linkBtn}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

/** SIREN avec espaces insécables : jamais coupé en fin de ligne (« 882 153 / 810 » à 375 px). */
const SIREN = LEGAL_ENTITY.siren.replace(/ /g, "\u00A0");

function texts(en: boolean) {
  const rating = en ? STATS_DISPLAY.en.googleRating : STATS_DISPLAY.fr.googleRating;
  const reviewsLabel = en ? GOOGLE_REVIEWS_LINK_LABEL.en : GOOGLE_REVIEWS_LINK_LABEL.fr;
  const houses = ENTITY_HOUSES.map((h) => ({
    slug: h.slug,
    label: en
      ? `${h.label} in ${h.commune}${h.district ? ` (${h.district.en})` : ""}`
      : `${h.label} à ${h.commune}${h.district ? ` (${h.district.fr})` : ""}`,
  }));
  if (en) {
    return {
      rating,
      reviewsLabel,
      houses,
      google: {
        title: "Our Google listing",
        body: `${rating}: reviews left by people who have lived with us. Read them all, including the less enthusiastic ones: they're often the most useful.`,
      },
      company: {
        title: "Our company",
        body: `The website and the La Villa Coliving brand are run by ${LEGAL_ENTITY.name} (SIREN ${SIREN}), registered with the ${LEGAL_ENTITY.rcsCity} trade and companies register. And when you sign, check that the SIRET number on your lease exists in the official register.`,
        link: "See it in the official register",
      },
      homes: {
        title: "Our three houses",
        body: "Three houses, three towns: each page shows the house, its photos and its neighbourhood on the map. You get the exact address for the viewing.",
      },
      short: {
        title: "Check us in 30 seconds",
        rating: `Rating: ${rating}`,
        company: `Company: ${LEGAL_ENTITY.name}, SIREN ${SIREN}`,
        companyLink: "Official register",
        homes: `Houses: ${ENTITY_HOUSES.map((h) => h.label).join(", ")}`,
        homesLink: "See the houses",
        more: "The three checks in detail",
      },
    };
  }
  return {
    rating,
    reviewsLabel,
    houses,
    google: {
      title: "Notre fiche Google",
      body: `${rating} : des avis laissés par des gens qui ont vécu chez nous. Lis-les tous, y compris les moins enthousiastes : ce sont souvent les plus utiles.`,
    },
    company: {
      title: "Notre société",
      body: `Le site et la marque La Villa Coliving sont portés par la ${LEGAL_ENTITY.name} (SIREN ${SIREN}), immatriculée au RCS de ${LEGAL_ENTITY.rcsCity}. Et quand tu signes, vérifie que le SIRET indiqué sur ton bail existe bien sur l'annuaire officiel.`,
      link: "Voir la fiche sur l'annuaire officiel",
    },
    homes: {
      title: "Nos trois maisons",
      body: "Trois maisons, trois communes : chaque page montre la maison, ses photos et son quartier sur la carte. L'adresse exacte t'est donnée pour la visite.",
    },
    short: {
      title: "Vérifier en 30 secondes",
      rating: `Note : ${rating}`,
      company: `Société : ${LEGAL_ENTITY.name}, SIREN ${SIREN}`,
      companyLink: "Annuaire officiel",
      homes: `Maisons : ${ENTITY_HOUSES.map((h) => h.label).join(", ")}`,
      homesLink: "Voir les maisons",
      more: "Le détail des trois vérifications",
    },
  };
}

export function VerifyBlock({ variant }: { variant: VerifyBlockVariant }) {
  const { language } = useLanguage();
  const en = language === "en";
  const t = texts(en);

  if (variant === "short") {
    const rows: { text: string; node: ReactNode }[] = [
      { text: t.short.rating, node: <ExternalLink href={GOOGLE_REVIEWS.url} target="google">{t.reviewsLabel}</ExternalLink> },
      { text: t.short.company, node: <ExternalLink href={LEGAL_ENTITY.registryUrl} target="registre">{t.short.companyLink}</ExternalLink> },
      {
        text: t.short.homes,
        node: (
          <LocalizedLink to="/nos-maisons" onClick={() => trackVerify("maison")} className={linkBtn}>
            {t.short.homesLink}
          </LocalizedLink>
        ),
      },
    ];
    return (
      <aside
        data-verify-block="short"
        aria-labelledby="verify-short-title"
        className="not-prose my-8 rounded-lg border border-[#D4A574]/50 bg-[#FAF9F6] p-5 text-[#44403C]"
      >
        <p id="verify-short-title" className="text-xs uppercase tracking-widest text-[#A0623C] font-semibold mb-3">
          {t.short.title}
        </p>
        <ul className="space-y-3">
          {rows.map((r, i) => (
            <li key={i} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm leading-relaxed">
              <span>{r.text}</span>
              {r.node}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <a href={`#${VERIFY_BLOCK_ID}`} className="text-[#A0623C] underline underline-offset-4 hover:text-[#1C1917]">
            {t.short.more} ↓
          </a>
        </p>
      </aside>
    );
  }

  const card = "rounded-lg border border-[#E7E5E4] bg-white p-5 md:p-6";
  const num = "flex-shrink-0 w-8 h-8 rounded-full bg-[#1C1917] text-[#D4A574] flex items-center justify-center text-sm font-semibold";
  const h3 = "text-lg font-semibold text-[#1C1917] mb-2";
  return (
    // scroll-mt : l'ancre #verifier laisse visible le titre « ## » qui précède le bloc dans le markdown (barre de navigation fixe comprise).
    <div id={VERIFY_BLOCK_ID} data-verify-block="full" className="not-prose scroll-mt-40 my-8 text-[#44403C]">
      <ol className="space-y-4 list-none p-0 m-0">
        <li className={card}>
          <div className="flex gap-4">
            <span aria-hidden="true" className={num}>1</span>
            <div className="min-w-0">
              <h3 className={h3}>{t.google.title}</h3>
              <p className="leading-relaxed mb-4">{t.google.body}</p>
              <ExternalLink href={GOOGLE_REVIEWS.url} target="google">{t.reviewsLabel}</ExternalLink>
            </div>
          </div>
        </li>
        <li className={card}>
          <div className="flex gap-4">
            <span aria-hidden="true" className={num}>2</span>
            <div className="min-w-0">
              <h3 className={h3}>{t.company.title}</h3>
              <p className="leading-relaxed mb-4">{t.company.body}</p>
              <ExternalLink href={LEGAL_ENTITY.registryUrl} target="registre">{t.company.link}</ExternalLink>
            </div>
          </div>
        </li>
        <li className={card}>
          <div className="flex gap-4">
            <span aria-hidden="true" className={num}>3</span>
            <div className="min-w-0">
              <h3 className={h3}>{t.homes.title}</h3>
              <p className="leading-relaxed mb-4">{t.homes.body}</p>
              <div className="flex flex-wrap gap-2">
                {t.houses.map((h) => (
                  <LocalizedLink key={h.slug} to={`/${h.slug}`} onClick={() => trackVerify("maison")} className={linkBtn}>
                    {h.label}
                  </LocalizedLink>
                ))}
              </div>
            </div>
          </div>
        </li>
      </ol>
    </div>
  );
}
