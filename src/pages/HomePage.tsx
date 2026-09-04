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
import { LocalizedLink } from '@/components/LocalizedLink';
import { ArrowRight } from 'lucide-react';
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SEO } from '@/components/SEO';
import { FaqSection } from '@/components/FaqSection';
import { buildHomeLodgingBusinessSchema } from '@/lib/structuredData';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN } from '@/data/stats';
import { homeFaq } from '@/data/faq/homeFaq';
import { useSectionViewTracking } from '@/lib/sectionViewTracking';

export function HomePage() {
  const { language } = useLanguage();
  // section_view (Lot 1b) : ids posés ICI dans des wrappers neutres, PAS dans les
  // composants V7 — le Lot 2 réordonnera les sections sans casser la mesure.
  useSectionViewTracking();

  // Même pattern gtag que BlocOffre : l'analytics ne bloque jamais l'UI.
  const trackPostGrid = (target: string) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: "post_grid",
        cta_target: target,
      });
    } catch { /* noop */ }
  };

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
          ? "3 houses on the Geneva border, not a 300-room residence. Pool, sauna, gym. Private room, all inclusive, no application fee. Reply within 48 h."
          : "3 maisons à la frontière de Genève, pas une résidence de 300 chambres. Piscine, sauna, salle de sport. Chambre privée tout inclus, 0 frais de dossier."}
        url="https://www.lavillacoliving.com/"
        image="https://www.lavillacoliving.com/images/villa_portrait.webp"
        jsonLd={buildHomeLodgingBusinessSchema(language === "en" ? "en" : "fr")}
        // Le LodgingBusiness ci-dessus porte le même @id que le LocalBusiness générique :
        // on coupe ce dernier pour n'avoir qu'une fiche business sur l'accueil.
        omitLocalBusiness
      />
      <div data-home-section="hero"><Hero /></div>
      {/* Nos maisons remonté juste après le bandeau "Piscine, sauna & salle de sport"
          (fin du Hero) : le couloir Nos 3 Maisons -> maison -> candidature génère
          ~46 % des candidatures (GA4). */}
      <div data-home-section="houses_preview"><HousesPreview /></div>
      {/* Rangée post-grille (Lot 2) : rattrape ceux qui sortent de la grille sans
          cliquer une maison — deux sorties utiles (comparer / tarifs). Bande
          discrète, PAS un deuxième hero ; aucune image → zéro CLS. */}
      <div data-home-section="post_grid">
        <div className="bg-white border-b border-[#E7E5E4] py-6 md:py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12">
            <LocalizedLink
              to="/nos-maisons"
              onClick={() => trackPostGrid("/nos-maisons")}
              className="inline-flex items-center gap-2 text-sm text-[#57534E] uppercase tracking-wider text-center hover:text-[#1C1917] transition-colors"
            >
              {language === "en"
                ? "Torn between the three? Compare them"
                : "Tu hésites entre les trois ? Compare-les"}
              <ArrowRight className="w-4 h-4 flex-none text-[#D4A574]" />
            </LocalizedLink>
            <LocalizedLink
              to="/tarifs"
              onClick={() => trackPostGrid("/tarifs")}
              className="inline-flex items-center gap-2 text-sm text-[#57534E] uppercase tracking-wider text-center hover:text-[#1C1917] transition-colors"
            >
              {language === "en"
                ? "All inclusive, one single rent"
                : "Tout inclus, un seul loyer"}
              <ArrowRight className="w-4 h-4 flex-none text-[#D4A574]" />
            </LocalizedLink>
          </div>
        </div>
      </div>
      {/* features_paiement = la section « Un seul paiement. Zéro surprise. »
          (FeaturesV7) — métrique d'atteinte du Lot 2 (réf. ~16 % [EST]),
          remontée juste sous la grille par le réordonnancement du Lot 2. */}
      <div data-home-section="features_paiement"><Features /></div>
      <div data-home-section="trust_badges"><TrustBadges /></div>
      <div data-home-section="why_choose_us"><WhyChooseUs /></div>
      <div data-home-section="testimonials"><TestimonialsCarousel /></div>
      <div data-home-section="how_to_join"><HowToJoin /></div>
      <div data-home-section="latest_blog"><LatestBlogV7 /></div>
      {/* FAQ visible + FAQPage schema (front A6 : PAA « coliving genève »).
          L'intro sert de phrase citable produit (extraction IA / AI Overviews). */}
      <div data-home-section="faq">
        <FaqSection
          title={language === "en" ? "Coliving near Geneva — your questions" : "Le coliving près de Genève — tes questions"}
          items={language === "en" ? homeFaq.en : homeFaq.fr}
          emitSchema
          id="faq-coliving-geneve"
          intro={
            <p>
              {language === "en"
                ? `La Villa Coliving: 29 all-inclusive furnished rooms from ${PRICE_SHARED_CHF_EN}/month in 3 houses with pool, sauna and gym, 20 minutes from Geneva — no application fee.`
                : `La Villa Coliving : 29 chambres meublées tout inclus dès ${PRICE_SHARED_CHF_FR}/mois dans 3 maisons avec piscine, sauna et salle de sport, à 20 minutes de Genève — sans frais de dossier.`}
            </p>
          }
        />
      </div>
      <div data-home-section="cta_final"><CTASection /></div>
      <WhatsAppButton />
    </main>
  );
}
