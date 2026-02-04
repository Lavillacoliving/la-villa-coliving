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

export function HomePage() {
  return (
    <main>
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
