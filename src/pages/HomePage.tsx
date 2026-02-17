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
          ? "Premium Coliving Near Geneva"
          : "Colocation & Coliving Premium près de Genève"}
        description={language === "en"
          ? "Premium coliving near Geneva. 29 furnished rooms in 3 houses, all-inclusive from 1,380 CHF/month. Heated pool, gym, sauna. Ideal for cross-border workers, expats & young professionals."
          : "Colocation et coliving premium à 15 min de Genève. 29 chambres meublées dans 3 maisons, tout inclus dès 1 380 CHF/mois. Piscine chauffée, gym, sauna. Idéal frontaliers, expats et jeunes pros."}
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
