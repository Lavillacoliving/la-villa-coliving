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
import { SEO } from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export function HomePage() {
  const { language } = useLanguage();

  return (
    <main>
      <SEO
        title={language === "en"
          ? "Premium Coliving & Shared Housing Near Geneva"
          : "Colocation & Coliving Premium près de Genève"}
        description={language === "en"
          ? "29 furnished rooms in 3 houses with pool, sauna & gym. All-inclusive from CHF 1,380/month. Ideal for cross-border workers & expats."
          : "29 chambres meublées dans 3 maisons avec piscine, sauna et salle de sport. Tout inclus dès 1 380 CHF/mois. Idéal frontaliers et expats."}
        url="https://www.lavillacoliving.com/"
        image="https://www.lavillacoliving.com/images/villa_portrait.webp"
      />
      <Hero />
      <TrustBadges />
      <WhyChooseUs />
      <Features />
      <HousesPreview />
      <TestimonialsCarousel />
      <HowToJoin />
      <CTASection />
    </main>
  );
}
