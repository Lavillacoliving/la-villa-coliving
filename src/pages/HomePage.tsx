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

export function HomePage() {
  return (
    <main>
      <SEO
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
