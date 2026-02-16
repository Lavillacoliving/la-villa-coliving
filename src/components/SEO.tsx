import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title,
  description,
  image = "/images/la villa jardin.webp",
  url = "https://www.lavillacoliving.com",
  type = "website",
}: SEOProps) {
  const { language } = useLanguage();

  const defaultTitle =
    language === "en"
      ? "La Villa Coliving | Premium Coliving Near Geneva"
      : "La Villa Coliving | Coliving Premium près de Genève";

  const defaultDescription =
    language === "en"
      ? "Fully furnished homes designed for community living. All-inclusive, flexible stays, just 30 minutes from Geneva. Join 50+ happy colivers at La Villa."
      : "Maisons entièrement meublées conçues pour la vie communautaire. Tout inclus, séjours flexibles, à 30 minutes de Genève. Rejoignez 50+ colivers heureux à La Villa.";

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
            ? "coliving, geneva, shared housing, community living, furnished apartments, expat housing, digital nomad, remote work, la villa"
            : "coliving, genève, colocation, vie communautaire, appartements meublés, logement expat, nomade digital, télétravail, la villa"
        }
      />
      <meta name="author" content="La Villa Coliving" />
      <meta name="robots" content="index, follow" />
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

      {/* Structured Data */}
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
            addressLocality: "Grand Genève",
            addressCountry: "FR",
          },
          contactPoint: {
            "@type": "ContactPoint",
            email: "contact@lavillacoliving.com",
            contactType: "customer service",
          },
          sameAs: ["https://www.instagram.com/lavillacoliving/"],
        })}
      </script>
    </Helmet>
  );
}
