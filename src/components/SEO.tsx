import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildLocalBusinessSchema } from "@/lib/structuredData";
import { HREFLANG_NO_ALTERNATES } from "@/lib/siteLinks";
import { STATS, PRICE_FROM_CHF_EN, PRICE_FROM_CHF_FR } from "@/data/stats";
import { APPART } from "@/data/appart";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
  /**
   * Page noindex qui garde quand même sa canonical auto-référente (page d'offre temporaire
   * /offre-hiver, brief du 06/10/2026 : « noindex, follow, canonical sur elle-même »). Toujours
   * sans hreflang. inject-prerendered.mjs conserve la canonical trouvée dans le HTML prérendu.
   */
  selfCanonical?: boolean;
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
  selfCanonical = false,
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

  // (L'Appart, Lot 4, étape E5 — texte du 13/11/2026 « à confirmer ») Repli des pages sans description propre ET description de la
  // fiche d'entreprise de ces pages : deux gammes, deux phrases (jamais le prix de L'Appart dans la phrase de la piscine).
  const defaultDescription =
    language === "en"
      ? `Coliving and flatshare near Geneva, on the French side. ${STATS.totalHouses} coliving houses with a pool, sauna and gym: from ${PRICE_FROM_CHF_EN}/month, all inclusive. ${APPART.name}, a flatshare in ${APPART.commune}: from ${APPART.price.from.en.chf}/month.`
      : `Coliving et colocation près de Genève, côté France. ${STATS.totalHouses} maisons de coliving avec piscine, sauna et salle de sport : dès ${PRICE_FROM_CHF_FR}/mois tout compris. ${APPART.name}, colocation à ${APPART.commune} : dès ${APPART.price.from.fr.chf}/mois.`;

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
      {/* Pas de canonical ni de hreflang sur une page noindex (404) — sauf canonical demandée (selfCanonical) */}
      {(!noindex || selfCanonical) && <link rel="canonical" href={siteUrl} />}

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
          lu depuis les sources uniques. PAS d'aggregateRating ni de Review (D4, 09/10/2026) : la note publiée est celle de
          la fiche Google (GOOGLE_REVIEWS), jamais balisée sur son propre site. */}
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
