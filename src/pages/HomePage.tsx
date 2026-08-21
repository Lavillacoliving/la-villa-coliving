// VERSION 7: JEUNE + NOMADE + ZEN + FRAIS
// Palette: Sauge + Terracotta doux + Crème frais
import {
  Hero,
  TrustBadges,
  WhyChooseUs,
  Features,
  HousesPreview,
  TestimonialsCarousel,
  HowToJoin,
  CTASection
} from '@/sections/HomeSectionsV7';
import { LatestBlogV7 } from '@/sections/LatestBlogV7';
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SEO } from '@/components/SEO';
import { FaqSection } from '@/components/FaqSection';
import { buildHomeLodgingBusinessSchema } from '@/lib/structuredData';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRICE_CHF_FR, PRICE_CHF_EN } from '@/data/stats';
import { homeFaq } from '@/data/faq/homeFaq';

export function HomePage() {
  const { language } = useLanguage();

  return (
    <main>
      {/* Titles rollbackés le 10/08/2026 : test A6 « prix dans le title »
          ARRÊTÉ sur données CTR (0 clic / 15 impressions post-03/08 sur la
          requête money « coliving geneve », CTR historique ~45 %). Le prix ne
          doit PLUS apparaître dans un <title> — il reste en meta description
          et dans le priceRange du schema.
          Contrainte : title + « | La Villa Coliving » ≤ 65 c. (règle B2). */}
      <SEO
        title={language === "en"
          ? "Premium Coliving & Shared Housing Near Geneva"
          : "Colocation & Coliving Premium près de Genève"}
        description={language === "en"
          ? "3 houses on the Geneva border — not a 300-room residence. Pool. Sauna. Gym. Private 17-23 m² room, all inclusive, no application fee. Reply within 48h."
          : "3 maisons à la frontière de Genève — pas une résidence de 300 chambres. Piscine. Sauna. Salle de sport. Chambre privée 17-23 m² tout inclus, 0 frais de dossier."}
        url="https://www.lavillacoliving.com/"
        image="https://www.lavillacoliving.com/images/villa_portrait.webp"
        jsonLd={buildHomeLodgingBusinessSchema(language === "en" ? "en" : "fr")}
        // Le LodgingBusiness ci-dessus porte le même @id que le LocalBusiness générique :
        // on coupe ce dernier pour n'avoir qu'une fiche business sur l'accueil.
        omitLocalBusiness
      />
      <Hero />
      {/* Nos maisons remonté juste après le bandeau "Piscine, sauna & salle de sport"
          (fin du Hero) : le couloir Nos 3 Maisons -> maison -> candidature génère
          ~46 % des candidatures (GA4). */}
      <HousesPreview />
      <TrustBadges />
      <WhyChooseUs />
      <Features />
      <TestimonialsCarousel />
      <HowToJoin />
      <LatestBlogV7 />
      {/* FAQ visible + FAQPage schema (front A6 : PAA « coliving genève »).
          L'intro sert de phrase citable produit (extraction IA / AI Overviews). */}
      <FaqSection
        title={language === "en" ? "Coliving near Geneva — your questions" : "Le coliving près de Genève — tes questions"}
        items={language === "en" ? homeFaq.en : homeFaq.fr}
        emitSchema
        id="faq-coliving-geneve"
        intro={
          <p>
            {language === "en"
              ? `La Villa Coliving: 29 all-inclusive furnished rooms from ${PRICE_CHF_EN}/month in 3 houses with pool, sauna and gym, 20 minutes from Geneva — no application fee.`
              : `La Villa Coliving : 29 chambres meublées tout inclus dès ${PRICE_CHF_FR}/mois dans 3 maisons avec piscine, sauna et salle de sport, à 20 minutes de Genève — sans frais de dossier.`}
          </p>
        }
      />
      <CTASection />
      <WhatsAppButton />
    </main>
  );
}
