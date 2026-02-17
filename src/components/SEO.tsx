import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

export function SEO({
  title,
  description,
  image = "https://www.lavillacoliving.com/images/la villa jardin.webp",
  url = "https://www.lavillacoliving.com",
  type = "website",
  jsonLd,
}: SEOProps) {
  const { language } = useLanguage();

  const defaultTitle =
    language === "en"
      ? "La Villa Coliving | Premium Coliving Near Geneva"
      : "Colocation & Coliving Premium près de Genève | La Villa Coliving";

  const defaultDescription =
    language === "en"
      ? "Premium coliving near Geneva. 29 furnished rooms, all-inclusive from 1,380 CHF/month. Heated pool, gym, sauna, fiber internet. Ideal for expats, cross-border workers & young professionals."
      : "Colocation et coliving premium près de Genève. 29 chambres meublées tout inclus dès 1 380 CHF/mois. Piscine chauffée, salle de sport, sauna, fibre optique. Idéal frontaliers, expats et jeunes professionnels.";

  const siteTitle = title ? `${title} | La Villa Coliving` : defaultTitle;
  const siteDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={siteDescription} />
      <meta
        name="keywords"
        content={
          language === "en"
            ? "coliving geneva, shared housing geneva, coliving near geneva, furnished rooms geneva, expat housing geneva, cross-border worker housing, digital nomad geneva, coliving grand geneve, all-inclusive coliving, la villa coliving"
            : "colocation genève, coliving genève, colocation annemasse, colocation frontalier genève, chambre meublée genève, coliving près de genève, colocation tout inclus genève, logement frontalier genève, colocation ville-la-grand, la villa coliving"
        }
      />
      <meta name="author" content="La Villa Coliving" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="language" content={language} />
      <link rel="canonical" href={url} />

      {/* Hreflang tags pour le SEO multilingue */}
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="fr" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
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
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data - Organization (default) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "La Villa Coliving",
          url: "https://www.lavillacoliving.com",
          logo: "https://www.lavillacoliving.com/logos/logo-full.png",
          description: siteDescription,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Ville-la-Grand",
            addressRegion: "Haute-Savoie",
            postalCode: "74100",
            addressCountry: "FR",
          },
          contactPoint: {
            "@type": "ContactPoint",
            email: "contact@lavillacoliving.com",
            telephone: "+33626235336",
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
