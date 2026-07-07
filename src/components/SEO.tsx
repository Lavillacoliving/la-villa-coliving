import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { FOUNDERS, FOUNDING_DATE, ABOUT_PAGE_LIVE } from "@/lib/structuredData";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}

export function SEO({
  title,
  description,
  image = "https://www.lavillacoliving.com/images/la villa jardin.webp",
  url: _url, // kept for backward compat — canonical is now computed from useLocation()
  type = "website",
  jsonLd,
  noindex = false,
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
      ? "Premium coliving near Geneva. 29 furnished rooms, all-inclusive from 1,380 CHF/month. Heated pool, gym, sauna, fiber internet. Ideal for expats, cross-border workers & young professionals."
      : "Colocation et coliving premium près de Genève. 29 chambres meublées tout inclus dès 1 380 CHF/mois. Piscine chauffée, salle de sport, sauna, fibre optique. Idéal frontaliers, expats et jeunes professionnels.";

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

      {/* Hreflang tags pour le SEO multilingue */}
      {!noindex &&
        (() => {
          const base = "https://www.lavillacoliving.com";
          const urlPath = siteUrl.replace(base, "") || "/";
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

      {/* Structured Data — LocalBusiness (défaut sur toutes les pages) — SEO local.
          PAS d'aggregateRating (la note 4,9/5 = NPS interne, non balisable). */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "La Villa Coliving",
          url: "https://www.lavillacoliving.com",
          logo: "https://www.lavillacoliving.com/logos/logo-full.png",
          image: "https://www.lavillacoliving.com/images/villa_portrait.webp",
          description: siteDescription,
          telephone: "+33664315134",
          email: "contact@lavillacoliving.com",
          priceRange: language === "en" ? "From CHF 1,380/month" : "Dès 1 380 CHF/mois",
          address: {
            "@type": "PostalAddress",
            streetAddress: "34 rue du Foron",
            addressLocality: "Ville-la-Grand",
            addressRegion: "Haute-Savoie",
            postalCode: "74100",
            addressCountry: "FR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 46.2031,
            longitude: 6.2475,
          },
          areaServed: ["Genève", "Annemasse", "Ville-la-Grand", "Ambilly", "Grand Genève"],
          // E-E-A-T : fondation + fondateurs identifiables (sameAs LinkedIn) sur toutes
          // les pages — Google corrobore l'existence des personnes hors du site.
          // url de la page fondateurs ajoutée automatiquement quand ABOUT_PAGE_LIVE=true.
          foundingDate: FOUNDING_DATE,
          founder: [FOUNDERS.jerome, FOUNDERS.fanny].map((f) => ({
            "@type": "Person",
            name: f.name,
            ...(ABOUT_PAGE_LIVE ? { url: "https://www.lavillacoliving.com/qui-sommes-nous" } : {}),
            sameAs: [f.linkedin],
          })),
          contactPoint: {
            "@type": "ContactPoint",
            email: "contact@lavillacoliving.com",
            telephone: "+33664315134",
            contactType: "customer service",
            availableLanguage: ["French", "English"],
          },
          sameAs: ["https://www.instagram.com/lavillacoliving/"],
        })}
      </script>

      {/* Additional Structured Data (page-specific) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
