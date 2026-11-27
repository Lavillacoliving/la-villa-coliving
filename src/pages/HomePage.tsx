import { EntityFacts } from "@/components/EntityFacts";
// VERSION 7: JEUNE + NOMADE + ZEN + FRAIS
// Palette: Sauge + Terracotta doux + Crème frais
import {
  Hero,
  HousesPreview,
  CTASection
} from '@/sections/HomeSectionsV7';
import {
  HomeStats,
  HomeWhy,
  HomePrice,
  HomeVisit,
  HomeOtherOptions,
} from '@/sections/HomeArgumentsV8';
import { LatestBlogV7 } from '@/sections/LatestBlogV7';
import { HomeStory } from '@/sections/HomeStory';
import { HomeLifeBand } from '@/sections/HomeLifeBand';
import { HomeReviews } from '@/sections/HomeReviews';
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SEO } from '@/components/SEO';
import { FaqSection } from '@/components/FaqSection';
import { buildHomeLodgingBusinessSchema } from '@/lib/structuredData';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRICE_FROM_CHF_FR, PRICE_FROM_CHF_EN, STATS_DISPLAY } from '@/data/stats';
import { homeFaq } from '@/data/faq/homeFaq';
import { APPART } from '@/data/appart';
import { useSectionViewTracking } from '@/lib/sectionViewTracking';
import { useReveal } from '@/lib/useReveal';

/**
 * Accueil — (lot 2 de la refonte des pages de vente, maquette téléphone validée par Jérôme le 24/11/2026 ; rapport « Pages qui
 * vendent », § 4.1) une argumentation. Clarity (30 jours, téléphones) : 38 % des visiteurs ne défilaient pas, 30 % voyaient
 * les maisons et 5 % le premier « Candidater » (écran 14).
 *
 * (Lot 2a, brief « Accueil : récit, avis, photos » du 27/11/2026, §0.1, version B §0.9) L'accueil raconte ce que vivent les
 * résidents, avec de vraies photos : promesse → quatre chiffres → maisons → Récit → bande « Ce qui ne se vit qu'ici » et
 * rangée de vie → Avis (extraits d'avis Google, note Google et « 100+ résidents » — V2 du 27/11 remplace « pas d'extraits
 * d'avis » du 24/11) → « Une communauté, pas un immeuble » → « Le prix, expliqué » (D14) → « Viens nous rencontrer » →
 * autres options (L'Appart, groupe Facebook) → FAQ → fiche « l'essentiel » (repliée sur mobile) → derniers articles →
 * dernier appel. On ajoute et on réordonne : rien de ce que lisent Google et les IA n'est retiré ni réécrit (FAQ et FAQPage,
 * introduction de la FAQ, fiche, bloc L'Appart, ligne Facebook et JSON-LD restent dans le HTML).
 */
export function HomePage() {
  const { language } = useLanguage();
  // section_view (Lot 1b) : ids posés ICI dans des wrappers neutres, PAS dans les composants — on réordonne les sections
  // sans casser la mesure. (Lot 2 de la refonte) Mêmes noms pour les blocs qui restent (comparaison avant / après) :
  // hero, houses_preview, why_choose_us, how_to_join, appart_teaser, faq, entity_facts, latest_blog, cta_final ; nouveaux :
  // home_stats, price_explained, google_rating, other_options. Retirés : post_grid, features_paiement, trust_badges, testimonials.
  // (Lot 2a, 27/11/2026, point 7 de Jérôme) Nouveaux : story, life, reviews ; « reviews » remplace « google_rating » (la note
  // Google vit dans la section Avis). Date de bascule = date de mise en ligne du lot (rapport final).
  useSectionViewTracking();
  // (Lot 2a, §0.9) Apparition au défilement des blocs [data-reveal] sous l'écran — posée après l'hydratation, jamais au prérendu.
  useReveal();

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
      <div data-home-section="home_stats"><HomeStats /></div>
      {/* Les maisons, juste après la promesse : le couloir accueil → maison → candidature est le premier du site (GA4). */}
      <div data-home-section="houses_preview"><HousesPreview /></div>
      {/* (Lot 2a, 27/11/2026) Récit « Tu arrives sans connaître personne. Ça ne dure pas. » (§0.3 A). */}
      <div data-home-section="story"><HomeStory /></div>
      {/* (Lot 2a) Bande « Ce qui ne se vit qu'ici » et rangée de vie (§0.3 B, six vignettes légendées). */}
      <div data-home-section="life"><HomeLifeBand /></div>
      {/* (Lot 2a) Avis : extraits Google + note Google + « 100+ résidents » (ancienne section google_rating). */}
      <div data-home-section="reviews"><HomeReviews /></div>
      {/* Textes inchangés ; « Le prix, expliqué » après les avis (D14). */}
      <div data-home-section="why_choose_us"><HomeWhy /></div>
      <div data-home-section="price_explained"><HomePrice /></div>
      <div data-home-section="how_to_join"><HomeVisit /></div>
      {/* L'Appart (bloc statique, data-appart-teaser), ligne du groupe Facebook A.9 et liens Annemasse / Genève. */}
      <div data-home-section="other_options"><HomeOtherOptions /></div>
      {/* FAQ visible + FAQPage schema (front A6 : PAA « coliving genève »).
          L'intro sert de phrase citable produit (extraction IA / AI Overviews). */}
      <div data-home-section="faq">
        <FaqSection
          title={language === "en" ? "Coliving near Geneva — your questions" : "Le coliving près de Genève — tes questions"}
          items={language === "en" ? homeFaq.en : homeFaq.fr}
          emitSchema
          id="faq-coliving-geneve"
          padding="py-12 md:py-24 lg:py-32"
          intro={
            <p>
              {/* (Lot L2, 09/10/2026) « 20 min » toujours qualifié : STATS_DISPLAY.distance (D1). (L'Appart, E5) Deux gammes, deux
                  phrases : jamais le prix de L'Appart dans la phrase de la piscine (règle V2). */}
              {language === "en"
                ? `La Villa Coliving: 29 all-inclusive furnished rooms from ${PRICE_FROM_CHF_EN}/month in 3 houses with pool, sauna and gym, ${STATS_DISPLAY.en.distance} — no application fee. And ${APPART.name}, a ${APPART.descriptor.en}: ${APPART.rooms.total} rooms from ${APPART.price.from.en.chf}/month, with bills, fibre, streaming and cleaning of the shared areas included.`
                : `La Villa Coliving : 29 chambres meublées tout inclus dès ${PRICE_FROM_CHF_FR}/mois dans 3 maisons avec piscine, sauna et salle de sport, à ${STATS_DISPLAY.fr.distance} — sans frais de dossier. Et ${APPART.name}, ${APPART.descriptor.fr} : ${APPART.rooms.total} chambres dès ${APPART.price.from.fr.chf}/mois, charges, fibre, streaming et ménage des communs compris.`}
            </p>
          }
        />
      </div>
      {/* (Lot S1, brief Socle entité) Fiche de faits canonique — même texte sur 14 pages money et 8 articles.
          (Lot 2 de la refonte, décision de Jérôme du 24/11/2026) Sous la FAQ, repliée sur mobile : tout reste dans le HTML. */}
      <div data-home-section="entity_facts" className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-10 md:py-16"><EntityFacts page="home" className="!my-0" collapseOnMobile /></div>
      </div>
      <div data-home-section="latest_blog"><LatestBlogV7 /></div>
      <div data-home-section="cta_final"><CTASection /></div>
      <WhatsAppButton />
    </main>
  );
}
