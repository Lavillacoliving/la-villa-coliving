import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildLocalBusinessSchema } from "@/lib/structuredData";
import { HREFLANG_NO_ALTERNATES } from "@/lib/siteLinks";
import { STATS, PRICE_SHARED_EN_NUM, PRICE_SHARED_CHF_FR } from "@/data/stats";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
  /**
   * Coupe le LocalBusiness générique quand la page émet déjà une fiche business
   * plus riche portant le même @id (cas de l'accueil : LodgingBusiness) —
   * sinon Google voit deux fiches concurrentes sur la même URL.
   */
  omitLocalBusiness?: boolean;
}

export function SEO({
  title,
  description,
  image = "https://www.lavillacoliving.com/images/la villa jardin.webp",
  url: _url, // kept for backward compat — canonical is now computed from useLocation()
  type = "website",
  jsonLd,
  noindex = false,
  omitLocalBusiness = false,
}: SEOProps) {
  const { language } = useLanguage();
  const location = useLocation();

  // Always compute canonical from actual route (fixes EN pages getting FR canonical)
  const computedUrl = `https://www.lavillacoliving.com${location.pathname}`;
  const siteUrl = computedUrl;

  const defaultTitle =
    language === "en"
      ? "La Villa Coliving | Premium Coliving Near Geneva"
      : "Colocation & Coliving Premium près de Genève | La Villa Coliving";

  const defaultDescription =
    language === "en"
      ? `Premium coliving near Geneva. ${STATS.totalRooms} furnished rooms, all-inclusive from ${PRICE_SHARED_EN_NUM} CHF/month. Heated pool, gym, sauna, fiber internet. Ideal for expats, cross-border workers & young professionals.`
      : `Colocation et coliving premium près de Genève. ${STATS.totalRooms} chambres meublées tout inclus dès ${PRICE_SHARED_CHF_FR}/mois. Piscine chauffée, salle de sport, sauna, fibre optique. Idéal frontaliers, expats et jeunes professionnels.`;

  // B2: append the brand suffix only while the title stays within the SERP display limit (~65 chars);
  // beyond that, use the bare descriptive title to avoid truncation. 65 (not 60) keeps the brand on
  // borderline brand-critical titles like the homepage; genuinely long blog titles still drop it.
  const brandedTitle = title ? `${title} | La Villa Coliving` : defaultTitle;
  const siteTitle = brandedTitle.length <= 65 ? brandedTitle : (title || defaultTitle);
  const siteDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* B5: set <html lang> per route language (fixes EN pages declaring lang="fr") */}
      <html lang={language === "en" ? "en" : "fr"} />
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={siteDescription} />
      {/* A3 (2026-06) : meta-keywords retiré — sans valeur SEO depuis ~2009 et identique sur toutes les pages. */}
      <meta name="author" content="La Villa Coliving" />
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}
      <meta name="language" content={language} />
      {/* Pas de canonical ni de hreflang sur une page noindex (404) */}
      {!noindex && <link rel="canonical" href={siteUrl} />}

      {/* Hreflang tags pour le SEO multilingue.
          Le miroir mécanique /en/X → /X ne vaut que si la page FR existe VRAIMENT :
          les routes listées dans HREFLANG_NO_ALTERNATES n'ont plus de pendant et
          n'émettent donc aucune balise (cf. siteLinks.ts pour le détail). */}
      {!noindex &&
        (() => {
          const base = "https://www.lavillacoliving.com";
          const urlPath = siteUrl.replace(base, "") || "/";
          if (HREFLANG_NO_ALTERNATES.has(urlPath)) return null;
          const frUrl = urlPath.startsWith("/en") ? `${base}${urlPath.replace(/^\/en(\/|$)/, "$1") || "/"}` : siteUrl;
          const enUrl = urlPath.startsWith("/en") ? siteUrl : `${base}/en${urlPath === "/" ? "" : urlPath}`;
          return [
            <link key="hreflang-fr" rel="alternate" hrefLang="fr" href={frUrl} />,
            <link key="hreflang-en" rel="alternate" hrefLang="en" href={enUrl} />,
            <link key="hreflang-default" rel="alternate" hrefLang="x-default" href={frUrl} />,
          ];
        })()}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="La Villa Coliving" />
      <meta
        property="og:locale"
        content={language === "en" ? "en_US" : "fr_FR"}
      />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data — LocalBusiness (défaut sur toutes les pages) — SEO local. (Lot S1, 05/09/2026)
          Construit par buildLocalBusinessSchema : 3 maisons en department, offre agrégée, sameAs, tout
          lu depuis les sources uniques. PAS d'aggregateRating (la note 4,9/5 = NPS interne, non balisable). */}
      {!omitLocalBusiness && <script type="application/ld+json">
        {JSON.stringify(buildLocalBusinessSchema(language === "en" ? "en" : "fr", siteDescription))}
      </script>}

      {/* Additional Structured Data (page-specific) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
