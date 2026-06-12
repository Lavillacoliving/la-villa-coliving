import { LocalizedLink } from "@/components/LocalizedLink";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { WaitlistForm } from "@/components/WaitlistForm";
import {
  MapPin,
  Clock,
  Train,
  Euro,
  Home,
  Users,
  Waves,
  Dumbbell,
  Wifi,
  ArrowRight,
  Check,
  Star,
  Shield,
  Tv,
  UtensilsCrossed,
  Globe,
  Briefcase,
  Laptop2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FaqSection } from "@/components/FaqSection";
import { buildFaqPageSchema } from "@/lib/structuredData";
import { colocationGeneveFaq } from "@/data/faq/colocationGeneveFaq";

// FAQ §3 (bilingue, tutoiement) : voir src/data/faq/colocationGeneveFaq.ts

interface BlogPost {
  id: string; slug: string;
  title_fr: string; title_en: string | null;
  image_url: string | null;
  read_time_min: number; category: string;
}

export function ColocationGenevePage() {
  const { language } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function loadBlogPosts() {
      try {
        const { data } = await supabase
          .from("blog_posts")
          .select("id,slug,title_fr,title_en,image_url,read_time_min,category")
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(4);
        setBlogPosts(data || []);
      } catch (e) { console.error(e); }
    }
    loadBlogPosts();
  }, []);

  // FAQ §3 résolue dans la langue courante + schema FAQPage construit depuis le texte VISIBLE.
  const colocationFAQ = colocationGeneveFaq[language === "en" ? "en" : "fr"];
  const faqSchema = buildFaqPageSchema(colocationFAQ);

  // Offer schema — separate JSON-LD block.
  // (AggregateRating retiré : la note 4,9 vient d'un NPS interne, non balisable en schema.)
  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: language === "en"
      ? "Furnished room in shared housing near Geneva"
      : "Chambre meublée en colocation près de Genève",
    description: language === "en"
      ? "All-inclusive furnished room: rent, utilities, fiber internet, cleaning 2x/week, pool, gym, sauna, yoga classes, community events."
      : "Chambre meublée tout inclus : loyer, charges, fibre internet, ménage 2x/semaine, piscine, gym, sauna, cours de yoga, événements communautaires.",
    price: "1380",
    priceCurrency: "CHF",
    priceValidUntil: "2026-12-31",
    availability: "https://schema.org/InStock",
    url: "https://www.lavillacoliving.com/colocation-geneve",
    seller: {
      "@type": "Organization",
      name: "La Villa Coliving",
      url: "https://www.lavillacoliving.com",
    },
    areaServed: [
      { "@type": "City", name: "Genève" },
      { "@type": "City", name: "Annemasse" },
    ],
  };

  // Freshness signal for the money page. Bump PAGE_LAST_UPDATED whenever the page
  // content is meaningfully refreshed so Google sees a recent dateModified.
  const PAGE_LAST_UPDATED = "2026-06-12";
  // First commit of this page in the repo (git log --diff-filter=A) — verifiable.
  const PAGE_FIRST_PUBLISHED = "2026-02-17";
  // timeZone UTC : une chaîne YYYY-MM-DD est parsée à minuit UTC — sans cette
  // option, les visiteurs en UTC− verraient la veille (incohérent avec le JSON-LD).
  const lastUpdatedLabel = new Date(PAGE_LAST_UPDATED).toLocaleDateString(
    language === "en" ? "en-US" : "fr-FR",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: "https://www.lavillacoliving.com/colocation-geneve",
    name: language === "en"
      ? "Shared Housing near Geneva — All-Inclusive Rooms"
      : "Colocation Genève — chambres meublées tout inclus",
    inLanguage: language === "en" ? "en" : "fr",
    datePublished: PAGE_FIRST_PUBLISHED,
    dateModified: PAGE_LAST_UPDATED,
  };

  return (
    <main className="relative pt-16">
      <SEO
        title={
          language === "en"
            ? "Shared Housing near Geneva — All-Inclusive Rooms from CHF 1,380"
            : "Colocation Genève : chambres meublées tout inclus dès 1 380 CHF"
        }
        description={
          language === "en"
            ? "Shared housing near Geneva, French side: all-inclusive furnished room from CHF 1,380/mo (utilities, fiber, cleaning). No application fee. Pool, sauna, gym."
            : "Colocation près de Genève côté France : chambre meublée tout inclus dès 1 380 CHF/mois (charges, fibre, ménage). Sans frais de dossier. Piscine, sauna, gym."
        }
        url="https://www.lavillacoliving.com/colocation-geneve"
        image="https://www.lavillacoliving.com/images/villa_portrait.webp"
        jsonLd={faqSchema}
      />
      {/* Separate JSON-LD blocks for Offer + WebPage (dateModified) — avoids @graph parsing issues */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(offerSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      </Helmet>

      {/* ===== HERO ===== */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {language === "en" ? "Shared housing near Geneva" : "Colocation Grand Genève"}
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1917] mb-6 leading-tight"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? (
              <>
                <span className="text-[#D4A574]">Shared Housing Geneva</span>
                <br />
                All-Inclusive Furnished Rooms
              </>
            ) : (
              <>
                <span className="text-[#D4A574]">Colocation Genève</span>
                <br />Chambres Meublées Tout Inclus
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-[#57534E] max-w-3xl mx-auto mb-10 leading-relaxed">
            {language === "en"
              ? "Live on the French side, work in Geneva. 29 fully furnished, all-inclusive rooms across 3 designer houses in Ville-la-Grand, Ambilly and Annemasse. Pool, gym, sauna, fiber internet — no application fee, everything included."
              : "Vivez côté France, travaillez à Genève. 29 chambres meublées tout inclus dans 3 maisons design à Ville-la-Grand, Ambilly et Annemasse. Piscine, gym, sauna, fibre optique — pas de frais de dossier, tout est compris."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LocalizedLink
              to="/candidature"
              className="inline-flex items-center gap-2 bg-[#D4A574] text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors"
            >
              {language === "en" ? "Apply Now" : "Candidater"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
            <LocalizedLink
              to="/nos-maisons"
              className="inline-flex items-center gap-2 border border-[#1C1917] text-[#1C1917] px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              {language === "en" ? "View Our Houses" : "Voir Nos Maisons"}
            </LocalizedLink>
          </div>

          {/* C2 preuve sociale + C3 réassurance — visible sans scroll */}
          <p className="mt-6 text-sm text-[#57534E]">
            {language === "en"
              ? "★ 4.9/5 · 150+ residents since 2021 · 99% occupancy"
              : "★ 4,9/5 · 150+ résidents depuis 2021 · 99 % d'occupation"}
          </p>
          <p className="mt-1 text-xs text-[#78716C]">
            {language === "en" ? "Reply within 48h · No application fee" : "Réponse sous 48h · Aucun frais de dossier"}
          </p>
          {/* Fraîcheur visible (cohérente avec le dateModified du JSON-LD WebPage) */}
          <p className="mt-1 text-xs text-[#A8A29E]">
            {language === "en" ? `Updated ${lastUpdatedLabel}` : `Mis à jour le ${lastUpdatedLabel}`}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-[#78716C]">
            <span className="flex items-center gap-2">
              <Home className="w-4 h-4" /> 29{" "}
              {language === "en" ? "rooms" : "chambres"}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> 3{" "}
              {language === "en" ? "houses" : "maisons"}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> 20 min{" "}
              {language === "en" ? "from Geneva" : "de Genève"}
            </span>
            <span className="flex items-center gap-2">
              <Euro className="w-4 h-4" />{" "}
              {language === "en" ? "From" : "Dès"} 1 380 CHF/
              {language === "en" ? "month" : "mois"}
            </span>
          </div>
        </div>
      </section>

      {/* ===== POURQUOI LA COLOCATION CÔTÉ FRANCE ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Why Choose Shared Housing on the French Side?"
              : "Pourquoi Choisir la Colocation Côté France ?"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-16">
            {language === "en"
              ? "Geneva is one of the most expensive cities in the world for housing. Living across the border gives you Swiss salaries with French cost of living."
              : "Genève est l'une des villes les plus chères au monde pour se loger. Vivre côté France vous donne un salaire suisse avec un coût de vie français."}
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Card 1: Savings */}
            <div className="bg-[#FAF9F6] p-8">
              <Euro className="w-8 h-8 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "Save 30-50% on Housing" : "Économisez 30 à 50% sur le Logement"}
              </h3>
              <p className="text-[#57534E] leading-relaxed mb-4">
                {language === "en"
                  ? "A studio in Geneva starts at 1,800 CHF/month — without furniture or services. At La Villa, you get a fully furnished room with pool, gym, sauna, cleaning 2x/week, weekly yoga & sports classes, monthly community events and community dinners — from 1,380 CHF/month."
                  : "Un studio à Genève coûte minimum 1 800 CHF/mois — sans meubles ni services. Chez La Villa, vous avez une chambre meublée avec piscine, gym, sauna, ménage 2x/semaine, cours de yoga et sport hebdomadaires, événements communautaires et dîners communautaires mensuels — dès 1 380 CHF/mois."}
              </p>
              <div className="bg-white p-4 border border-[#E7E5E4]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#78716C]">
                    Studio Genève
                  </span>
                  <span className="font-medium text-[#1C1917]">
                    1 800 - 2 500 CHF
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#78716C]">
                    + {language === "en" ? "Utilities & internet" : "Charges & internet"}
                  </span>
                  <span className="font-medium text-[#1C1917]">
                    + 200 - 400 CHF
                  </span>
                </div>
                <div className="border-t border-[#E7E5E4] my-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#D4A574]">
                      La Villa ({language === "en" ? "all included" : "tout compris"})
                    </span>
                    <span className="font-medium text-[#D4A574]">
                      1 380 CHF
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Tax Benefits */}
            <div className="bg-[#FAF9F6] p-8">
              <Shield className="w-8 h-8 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "Cross-Border Tax Benefits" : "Avantages Fiscaux Frontaliers"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "As a cross-border worker in Geneva, you're taxed at source in Switzerland — often at a lower rate than in France. You enjoy Swiss salaries while benefiting from French cost of living: groceries, leisure, transport, and healthcare costs are significantly lower on the French side."
                  : "En tant que frontalier à Genève, vous êtes imposé à la source en Suisse — souvent à un taux inférieur au taux français. Vous bénéficiez d'un salaire suisse avec un coût de vie français : courses, loisirs, transports et santé sont nettement moins chers côté France."}
              </p>
            </div>

            {/* Card 3: Transport */}
            <div className="bg-[#FAF9F6] p-8">
              <Train className="w-8 h-8 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "20 min from Geneva Centre" : "20 min du Centre de Genève"}
              </h3>
              <p className="text-[#57534E] leading-relaxed mb-4">
                {language === "en"
                  ? "Our houses are located in the heart of the cross-border area, with excellent connections to Geneva."
                  : "Nos maisons sont situées au cœur de la zone frontalière, avec d'excellentes connexions vers Genève."}
              </p>
              <ul className="space-y-2 text-[#57534E]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
                  <span>
                    <strong>Léman Express :</strong> Annemasse → Cornavin en 20 min
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
                  <span>
                    <strong>{language === "en" ? "By car" : "En voiture"} :</strong>{" "}
                    15 min {language === "en" ? "via Moillesulaz border" : "via la douane de Moillesulaz"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
                  <span>
                    <strong>Tram 17 :</strong>{" "}
                    {language === "en" ? "Bel-Air in under 30 minutes" : "Bel-Air en moins de 30 minutes"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
                  <span>
                    <strong>{language === "en" ? "By bike" : "À vélo"} :</strong>{" "}
                    {language === "en"
                      ? "Cycle paths to the Swiss border"
                      : "Pistes cyclables jusqu'à la frontière suisse"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 4: Quality of Life */}
            <div className="bg-[#FAF9F6] p-8">
              <Star className="w-8 h-8 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "Premium Quality of Life" : "Qualité de Vie Premium"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "Forget the isolation of a tiny studio. At La Villa, you live in designer houses with pool, gym, sauna, garden, coworking spaces, and a vibrant international community. Weekly yoga & sports classes, monthly community events, monthly community dinners — cleaning 2x/week, maintenance, streaming subscriptions all included."
                  : "Oubliez l'isolement d'un petit studio. Chez La Villa, vous vivez dans des maisons design avec piscine, salle de sport, sauna, jardin, espaces coworking et une communauté internationale dynamique. Cours de yoga et sport hebdomadaires, événements communautaires mensuels, dîners communautaires mensuels — ménage 2x/semaine, entretien, abonnements streaming inclus."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LE MARCHÉ DE LA COLOCATION À GENÈVE EN 2026 ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "The Shared Housing Market in Geneva in 2026"
              : "Le Marché de la Colocation à Genève en 2026"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-12">
            {language === "en"
              ? "Understanding the Geneva rental landscape helps you make the right housing choice."
              : "Comprendre le paysage locatif genevois vous aide à faire le bon choix de logement."}
          </p>

          <div className="prose prose-lg max-w-none text-[#57534E] leading-relaxed space-y-6">
            {language === "en" ? (
              <>
                <p>
                  Geneva is one of the tightest rental markets in Europe. With a vacancy rate consistently below 1%, finding an apartment — let alone an affordable one — is a significant challenge for anyone relocating to the area. The city's position as a hub for international organizations, finance, and technology drives relentless demand for housing, while supply remains structurally constrained by limited buildable land and strict urban planning regulations.
                </p>
                <p>
                  In 2026, the average rent for a studio in Geneva ranges from 1,800 to 2,500 CHF per month, unfurnished and excluding utilities. For a one-bedroom apartment, expect to pay 2,200 to 3,200 CHF. These prices make Geneva one of the most expensive cities in the world for housing, on par with Zurich, London, and New York. Even finding a room in a traditional shared flat in Geneva — a colocation — typically costs between 1,000 and 1,500 CHF per month, with no services included: no cleaning, no furnished common areas, and often aging infrastructure.
                </p>
                <p>
                  This situation has fueled the rise of cross-border living. The French side of the Greater Geneva area — towns like Annemasse, Ville-la-Grand, Ambilly, and Saint-Julien-en-Genevois — offers rents that are 30 to 50% lower than in Geneva itself. A cross-border worker (frontalier) earning a Swiss salary while living in France enjoys a dramatic improvement in purchasing power. The Leman Express rail link, which connects Annemasse to Geneva Cornavin station in just 20 minutes, has made this lifestyle more practical than ever. Today, around 116,200 frontaliers commute daily from France to work in the canton of Geneva (OCSTAT, end of 2025).
                </p>
                <p>
                  Within this context, coliving has emerged as a compelling alternative to traditional shared housing near Geneva. Unlike a standard colocation where tenants share an apartment and manage everything themselves, coliving offers a professionally managed environment with curated communities, fully furnished rooms, and comprehensive services included in a single monthly payment. At La Villa Coliving, residents enjoy premium shared housing from 1,380 CHF per month — all inclusive: rent, utilities, fiber internet, housekeeping twice a week, pool, gym, sauna, weekly yoga and sports classes, monthly community events, and community dinners. This represents exceptional value compared to both a Geneva studio and a traditional cross-border colocation.
                </p>
                <p>
                  For professionals relocating to work in Geneva — whether as frontaliers, expats joining international organizations, or remote workers seeking a vibrant community — coliving on the French border offers the ideal balance: Swiss-level salaries with French-side affordability, premium amenities, and a ready-made social network. The demand for shared housing in Geneva and its surrounding area continues to grow, and modern coliving spaces like La Villa are leading this transformation.
                </p>
              </>
            ) : (
              <>
                <p>
                  Genève est l'un des marchés locatifs les plus tendus d'Europe. Avec un taux de vacance constamment inférieur à 1%, trouver un appartement — a fortiori abordable — représente un défi majeur pour quiconque s'installe dans la région. La position de la ville comme centre d'organisations internationales, de finance et de technologie génère une demande incessante de logements, alors que l'offre reste structurellement limitée par le manque de terrains constructibles et des réglementations urbanistiques strictes.
                </p>
                <p>
                  En 2026, le loyer moyen pour un studio à Genève se situe entre 1 800 et 2 500 CHF par mois, non meublé et hors charges. Pour un deux-pièces, comptez 2 200 à 3 200 CHF. Ces prix font de Genève l'une des villes les plus chères au monde pour se loger, au même niveau que Zurich, Londres ou New York. Même une chambre en colocation à Genève coûte généralement entre 1 000 et 1 500 CHF par mois, sans aucun service inclus : pas de ménage, pas d'espaces communs meublés, et souvent des infrastructures vieillissantes.
                </p>
                <p>
                  Cette situation a alimenté l'essor de la vie transfrontalière. Le côté français du Grand Genève — des communes comme Annemasse, Ville-la-Grand, Ambilly ou Saint-Julien-en-Genevois — offre des loyers 30 à 50% moins chers qu'à Genève. Un frontalier touchant un salaire suisse tout en vivant en France bénéficie d'un gain de pouvoir d'achat considérable. Le Léman Express, qui relie Annemasse à la gare de Genève Cornavin en seulement 20 minutes, a rendu ce mode de vie plus pratique que jamais. Aujourd'hui, près de 116 200 frontaliers font le trajet quotidien entre la France et le canton de Genève (OCSTAT, fin 2025).
                </p>
                <p>
                  Dans ce contexte, le coliving s'impose comme une alternative séduisante à la colocation classique près de Genève. Contrairement à une colocation traditionnelle où les locataires partagent un appartement et gèrent tout eux-mêmes, le coliving propose un environnement géré professionnellement avec des communautés sélectionnées, des chambres entièrement meublées et des services complets inclus dans un paiement mensuel unique. Chez La Villa Coliving, les résidents profitent d'une colocation premium dès 1 380 CHF par mois — tout compris : loyer, charges, fibre internet, ménage deux fois par semaine, piscine, gym, sauna, cours de yoga et sport hebdomadaires, événements communautaires mensuels et dîners communautaires. Cela représente un rapport qualité-prix exceptionnel comparé à un studio à Genève ou une colocation frontalière classique.
                </p>
                <p>
                  Pour les professionnels qui s'installent pour travailler à Genève — qu'ils soient frontaliers, expatriés rejoignant des organisations internationales ou télétravailleurs en quête d'une communauté dynamique — la colocation côté frontière française offre l'équilibre idéal : salaires suisses avec des coûts côté France, prestations premium et un réseau social prêt à l'emploi. La demande de colocation à Genève et dans sa périphérie continue de croître, et les espaces de coliving modernes comme La Villa sont à la pointe de cette transformation.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== NOS 3 RÉSIDENCES ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "3 Houses, 3 Locations, 1 Community"
              : "3 Maisons, 3 Adresses, 1 Communauté"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-16">
            {language === "en"
              ? "All within the Grand Geneva cross-border area, 15 minutes from the Swiss border."
              : "Toutes dans la zone frontalière du Grand Genève, à 15 minutes de la frontière suisse."}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* La Villa */}
            <LocalizedLink to="/lavilla" className="group bg-white border border-[#E7E5E4] hover:border-[#D4A574] transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/la villa jardin.webp"
                  alt={language === "en" ? "La Villa Coliving — premium shared housing with heated pool in Ville-la-Grand, near Geneva" : "La Villa Coliving — colocation premium avec piscine chauffée à Ville-la-Grand, près de Genève"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#1C1917] mb-1">La Villa</h3>
                <p className="text-sm text-[#D4A574] flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> Ville-la-Grand
                </p>
                <p className="text-sm text-[#57534E] mb-4">
                  {language === "en"
                    ? "370m² designer house on 2,000m² estate. Heated pool, sauna, gym. 10 rooms."
                    : "Maison design de 370m² sur domaine de 2 000m². Piscine chauffée, sauna, gym. 10 chambres."}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#78716C]">
                  <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> {language === "en" ? "Pool" : "Piscine"}</span>
                  <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> Gym</span>
                  <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Fibre</span>
                </div>
              </div>
            </LocalizedLink>

            {/* Le Loft */}
            <LocalizedLink to="/leloft" className="group bg-white border border-[#E7E5E4] hover:border-[#D4A574] transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/le loft glamour.webp"
                  alt={language === "en" ? "Le Loft Coliving — modern shared housing with indoor pool in Ambilly, near Geneva" : "Le Loft Coliving — colocation moderne avec piscine intérieure à Ambilly, près de Genève"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#1C1917] mb-1">Le Loft</h3>
                <p className="text-sm text-[#D4A574] flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> Ambilly
                </p>
                <p className="text-sm text-[#57534E] mb-4">
                  {language === "en"
                    ? "Charming townhouse with indoor pool, sauna, gym. Spacious designer rooms. 7 rooms."
                    : "Maison de ville charmante avec piscine intérieure, sauna, gym. Chambres design spacieuses. 7 chambres."}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#78716C]">
                  <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> {language === "en" ? "Pool" : "Piscine"}</span>
                  <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> Gym</span>
                  <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Fibre</span>
                </div>
              </div>
            </LocalizedLink>

            {/* Le Lodge */}
            <LocalizedLink to="/lelodge" className="group bg-white border border-[#E7E5E4] hover:border-[#D4A574] transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/le lodge piscine.webp"
                  alt={language === "en" ? "Le Lodge Coliving — shared housing with pool and gym in Annemasse, 10 min from Geneva" : "Le Lodge Coliving — colocation avec piscine et salle de sport à Annemasse, à 10 min de Genève"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#1C1917] mb-1">Le Lodge</h3>
                <p className="text-sm text-[#D4A574] flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> Annemasse
                </p>
                <p className="text-sm text-[#57534E] mb-4">
                  {language === "en"
                    ? "Spacious estate near Annemasse centre. Pool house, fitness chalet, large garden. 12 rooms."
                    : "Domaine spacieux proche du centre d'Annemasse. Pool house, chalet fitness, grand jardin. 12 chambres."}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#78716C]">
                  <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> {language === "en" ? "Pool" : "Piscine"}</span>
                  <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> Gym</span>
                  <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Fibre</span>
                </div>
              </div>
            </LocalizedLink>
          </div>

          <div className="text-center mt-12">
            <LocalizedLink
              to="/nos-maisons"
              className="inline-flex items-center gap-2 text-[#D4A574] font-medium hover:underline"
            >
              {language === "en" ? "Explore all houses in detail" : "Explorer toutes nos maisons en détail"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* ===== NOS QUARTIERS FRONTALIERS ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Our Cross-Border Neighborhoods"
              : "Nos Quartiers Frontaliers"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-16">
            {language === "en"
              ? "Three distinct towns, each with its own character — all within 15 minutes of the Swiss border."
              : "Trois communes distinctes, chacune avec son caractère — toutes à 15 minutes de la frontière suisse."}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Ville-la-Grand */}
            <div className="bg-white p-8 border border-[#E7E5E4]">
              <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#D4A574]" />
              </div>
              <h3 className="text-xl font-medium text-[#1C1917] mb-1">Ville-la-Grand</h3>
              <p className="text-sm text-[#D4A574] mb-4">La Villa</p>
              <div className="text-sm text-[#57534E] leading-relaxed space-y-3">
                {language === "en" ? (
                  <>
                    <p>A quiet residential town just 5 minutes from the Swiss border, Ville-la-Grand offers a peaceful environment with tree-lined streets and local parks. La Villa sits on a 2,000 m² estate with a private garden, heated pool, and serene surroundings — ideal for those who value calm after a busy day in Geneva.</p>
                    <p>Local shops and restaurants are within walking distance. The town is connected to Annemasse station by bus (10 minutes), giving easy access to the Leman Express and onward to Geneva Cornavin. Bike paths connect directly to the Swiss border, making cycle commuting a real option for those working near the Moillesulaz crossing.</p>
                    <p>Ville-la-Grand is the perfect choice for residents who prefer a calm, residential atmosphere with direct garden access while remaining minutes from the economic hub of Geneva. The colocation at La Villa combines this tranquility with premium amenities rarely found in traditional shared housing near Geneva.</p>
                  </>
                ) : (
                  <>
                    <p>Ville résidentielle calme à seulement 5 minutes de la frontière suisse, Ville-la-Grand offre un cadre paisible avec ses rues bordées d'arbres et ses parcs. La Villa est implantée sur un domaine de 2 000 m² avec jardin privatif, piscine chauffée et un environnement serein — idéal pour ceux qui apprécient le calme après une journée active à Genève.</p>
                    <p>Les commerces et restaurants de proximité sont accessibles à pied. La commune est reliée à la gare d'Annemasse par bus (10 minutes), offrant un accès facile au Léman Express et à Genève Cornavin. Des pistes cyclables mènent directement à la frontière suisse, faisant du vélo une option réelle pour les frontaliers travaillant près du passage de Moillesulaz.</p>
                    <p>Ville-la-Grand est le choix idéal pour les résidents qui préfèrent une atmosphère calme et résidentielle avec accès direct au jardin, tout en restant à quelques minutes du pôle économique de Genève. La colocation à La Villa associe cette tranquillité à des prestations premium rarement proposées en colocation près de Genève.</p>
                  </>
                )}
              </div>
            </div>

            {/* Ambilly */}
            <div className="bg-white p-8 border border-[#E7E5E4]">
              <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#D4A574]" />
              </div>
              <h3 className="text-xl font-medium text-[#1C1917] mb-1">Ambilly</h3>
              <p className="text-sm text-[#D4A574] mb-4">Le Loft</p>
              <div className="text-sm text-[#57534E] leading-relaxed space-y-3">
                {language === "en" ? (
                  <>
                    <p>Ambilly is the closest French town to Geneva, sitting right at the Swiss border. Le Loft, our charming townhouse with indoor pool, is within walking distance of the Moillesulaz border crossing — making it the fastest commute option for those working in central Geneva.</p>
                    <p>Direct bus and tram lines connect Ambilly to Geneva's public transport network (TPG). The urban feel of the area means restaurants, cafés, and shops are steps away. Annemasse train station is a short bus ride, and the planned extension of Geneva's tram network will further improve connectivity.</p>
                    <p>Ambilly suits residents who want the convenience of being right at the border with easy access to both Annemasse and Geneva. Le Loft offers a modern colocation experience in a prime frontalier location — ideal for those who commute daily to Geneva and want to minimize their travel time while enjoying premium coliving amenities.</p>
                  </>
                ) : (
                  <>
                    <p>Ambilly est la commune française la plus proche de Genève, située directement à la frontière suisse. Le Loft, notre maison de ville avec piscine intérieure, se trouve à distance de marche du passage frontière de Moillesulaz — offrant le trajet le plus court pour ceux qui travaillent dans le centre de Genève.</p>
                    <p>Des lignes de bus et de tram directes relient Ambilly au réseau de transports genevois (TPG). L'ambiance urbaine du quartier signifie que restaurants, cafés et commerces sont à deux pas. La gare d'Annemasse est accessible en quelques minutes de bus, et l'extension prévue du réseau de tram genevois améliorera encore la connectivité.</p>
                    <p>Ambilly convient aux résidents qui souhaitent la commodité d'être directement à la frontière avec un accès facile à Annemasse comme à Genève. Le Loft offre une colocation moderne dans un emplacement frontalier stratégique — idéal pour les frontaliers qui font le trajet quotidien vers Genève et veulent minimiser leur temps de transport tout en profitant d'un coliving premium.</p>
                  </>
                )}
              </div>
            </div>

            {/* Annemasse */}
            <div className="bg-white p-8 border border-[#E7E5E4]">
              <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#D4A574]" />
              </div>
              <h3 className="text-xl font-medium text-[#1C1917] mb-1">Annemasse</h3>
              <p className="text-sm text-[#D4A574] mb-4">Le Lodge</p>
              <div className="text-sm text-[#57534E] leading-relaxed space-y-3">
                {language === "en" ? (
                  <>
                    <p>Annemasse is the dynamic heart of the French side of Greater Geneva. With over 40,000 inhabitants, it offers a full urban experience: shopping centers, restaurants, cultural venues, a cinema, and regular markets. Le Lodge, our largest residence with 12 rooms, sits on a spacious estate near the town center.</p>
                    <p>The Leman Express station in Annemasse is a game-changer: direct trains reach Geneva Cornavin in just 20 minutes, with frequent departures throughout the day. This makes Annemasse the best-connected French town for commuting to Geneva by public transport. The town also has excellent road access to the Geneva motorway network.</p>
                    <p>Annemasse is perfect for residents who want an urban lifestyle with all amenities at their doorstep while being just a train ride from Geneva. Le Lodge combines the liveliness of city living with the calm of a private estate — a colocation experience that bridges the best of cross-border frontalier living near Geneva.</p>
                  </>
                ) : (
                  <>
                    <p>Annemasse est le cœur dynamique du côté français du Grand Genève. Avec plus de 40 000 habitants, elle offre une vie urbaine complète : centres commerciaux, restaurants, lieux culturels, cinéma et marchés réguliers. Le Lodge, notre plus grande résidence avec 12 chambres, est situé sur un domaine spacieux proche du centre-ville.</p>
                    <p>La gare Léman Express d'Annemasse change la donne : des trains directs rejoignent Genève Cornavin en seulement 20 minutes, avec des départs fréquents tout au long de la journée. Cela fait d'Annemasse la commune française la mieux connectée pour les trajets vers Genève en transports en commun. La ville bénéficie également d'un excellent accès routier au réseau autoroutier genevois.</p>
                    <p>Annemasse est parfaite pour les résidents qui veulent un mode de vie urbain avec toutes les commodités à portée de main, tout en étant à un trajet en train de Genève. Le Lodge allie l'animation de la vie citadine au calme d'un domaine privatif — une expérience de colocation frontalière qui réunit le meilleur de la vie transfrontalière près de Genève.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TOUT INCLUS ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Everything Included in Your Rent"
              : "Tout Est Compris dans Votre Loyer"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-16">
            {language === "en"
              ? "No hidden fees, no surprise bills. One simple monthly payment covers everything."
              : "Pas de frais cachés, pas de mauvaises surprises. Un seul paiement mensuel couvre tout."}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Home, label: language === "en" ? "Furnished private room" : "Chambre privée meublée" },
              { icon: Euro, label: language === "en" ? "Rent & all utilities" : "Loyer & toutes les charges" },
              { icon: Wifi, label: language === "en" ? "Pro fiber internet" : "Internet fibre Pro" },
              { icon: Waves, label: language === "en" ? "Pool access" : "Accès piscine" },
              { icon: Dumbbell, label: language === "en" ? "Gym & sauna" : "Salle de sport & sauna" },
              { icon: Star, label: language === "en" ? "Weekly yoga & sports classes" : "Cours de yoga & sport hebdomadaires" },
              { icon: Users, label: language === "en" ? "Monthly community events" : "Événements communautaires mensuels" },
              { icon: Check, label: language === "en" ? "Housekeeping 2x/week" : "Ménage 2x/semaine" },
              { icon: UtensilsCrossed, label: language === "en" ? "Monthly community dinners" : "Dîners communautaires mensuels" },
              { icon: Tv, label: language === "en" ? "Streaming subscriptions" : "Abonnements streaming" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[#FAF9F6]">
                <item.icon className="w-5 h-5 text-[#D4A574] flex-shrink-0" />
                <span className="text-[#1C1917]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Propriétaire, pas agence — narratif premium */}
          <div className="max-w-3xl mx-auto mt-12 bg-[#FAF9F6] border border-[#D4A574]/30 rounded-2xl p-8 text-center">
            <p className="text-[#57534E] leading-relaxed">
              {language === "en"
                ? "Unlike an agency, we rent our houses directly. No middleman, no agency fees, no application fee: you deal directly with the owners, who want you to feel at home, for a long time."
                : "Contrairement à une agence, nous louons nos maisons en direct. Pas d'intermédiaire, pas d'honoraires d'agence, pas de frais de dossier : vous traitez directement avec les propriétaires, qui ont tout intérêt à ce que vous vous sentiez bien, longtemps."}
            </p>
          </div>

          <div className="text-center mt-12">
            <LocalizedLink
              to="/tarifs"
              className="inline-flex items-center gap-2 text-[#D4A574] font-medium hover:underline"
            >
              {language === "en" ? "See detailed pricing" : "Voir les tarifs détaillés"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* ===== POUR QUI ? ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-16 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Who Lives at La Villa?"
              : "Qui Vit à La Villa ?"}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                Icon: MapPin,
                title: language === "en" ? "Cross-Border Workers" : "Frontaliers",
                desc: language === "en"
                  ? "Working in Geneva, living in France. Save on rent while enjoying Swiss salaries."
                  : "Travailler à Genève, vivre en France. Économisez sur le loyer tout en profitant d'un salaire suisse.",
              },
              {
                Icon: Globe,
                title: language === "en" ? "Expats & Internationals" : "Expats & Internationaux",
                desc: language === "en"
                  ? "New to the area? Join a welcoming community. No need to furnish or deal with admin alone."
                  : "Nouveau dans la région ? Rejoignez une communauté accueillante. Pas besoin de meubler ni de gérer l'administratif seul.",
              },
              {
                Icon: Briefcase,
                title: language === "en" ? "Young Professionals" : "Jeunes Professionnels",
                desc: language === "en"
                  ? "Start your career near Geneva with flexible, affordable, premium housing."
                  : "Démarrez votre carrière près de Genève avec un logement flexible, abordable et premium.",
              },
              {
                Icon: Laptop2,
                title: language === "en" ? "Remote Workers" : "Télétravailleurs",
                desc: language === "en"
                  ? "Coworking spaces, fast fiber internet, and a community of like-minded professionals."
                  : "Espaces coworking, fibre internet rapide et une communauté de professionnels motivés.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center mb-4 mx-auto"><item.Icon className="w-6 h-6 text-[#D4A574]" /></div>
                <h3 className="text-lg font-medium text-[#1C1917] mb-2">{item.title}</h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CE QUE DISENT NOS RÉSIDENTS ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "What Our Residents Say"
              : "Ce Que Disent Nos Résidents"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-16">
            {language === "en"
              ? "Real stories from people who chose coliving near Geneva."
              : "Témoignages de ceux qui ont choisi la colocation près de Genève."}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Marie L.",
                profile: language === "en" ? "Cross-border worker, consultant in Geneva" : "Frontalière, consultante à Genève",
                quote: language === "en"
                  ? "Moving to La Villa was the best decision when I relocated for work. Instead of spending months searching for a flat in Geneva, I moved in within two weeks. The community is amazing — I've made real friends here, and the 20-minute commute to Cornavin is a breeze."
                  : "Emménager à La Villa a été la meilleure décision quand je me suis installée pour le travail. Au lieu de passer des mois à chercher un appartement à Genève, j'ai emménagé en deux semaines. La communauté est incroyable — je me suis fait de vrais amis ici, et le trajet de 20 minutes jusqu'à Cornavin est un jeu d'enfant.",
              },
              {
                name: "Thomas K.",
                profile: language === "en" ? "Expat, developer at the UN" : "Expat, développeur à l'ONU",
                quote: language === "en"
                  ? "As an expat arriving in Geneva, I had no network and no idea where to live. La Villa gave me a furnished room, a ready-made social circle, and incredible amenities. The pool and gym alone would cost 200 CHF/month in Geneva. It's unbeatable value."
                  : "En tant qu'expat arrivant à Genève, je n'avais pas de réseau et aucune idée d'où vivre. La Villa m'a offert une chambre meublée, un cercle social prêt à l'emploi et des équipements incroyables. La piscine et la salle de sport seules coûteraient 200 CHF/mois à Genève. C'est imbattable.",
              },
              {
                name: "Sarah M.",
                profile: language === "en" ? "Young professional, marketing in Geneva" : "Jeune pro, marketing à Genève",
                quote: language === "en"
                  ? "I was paying 2,100 CHF for a tiny studio in Carouge. Now I pay 1,380 CHF for a much better quality of life: a beautiful room, cleaning twice a week, yoga classes, and a vibrant community. I save money AND live better. I wish I'd found this place sooner."
                  : "Je payais 2 100 CHF pour un minuscule studio à Carouge. Maintenant je paie 1 380 CHF pour une bien meilleure qualité de vie : une belle chambre, le ménage deux fois par semaine, des cours de yoga et une communauté vibrante. J'économise ET je vis mieux. J'aurais aimé trouver cet endroit plus tôt.",
              },
              {
                name: "Lucas D.",
                profile: language === "en" ? "Remote worker, freelance IT" : "Télétravailleur, freelance IT",
                quote: language === "en"
                  ? "Working from home can be isolating, but at La Villa it's the opposite. The coworking spaces are great, the fiber internet never drops, and there's always someone to grab lunch or go for a run with. It's the perfect balance between productivity and social life."
                  : "Le télétravail peut être isolant, mais à La Villa c'est tout le contraire. Les espaces coworking sont super, la fibre ne coupe jamais, et il y a toujours quelqu'un pour déjeuner ou aller courir. C'est l'équilibre parfait entre productivité et vie sociale.",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 border border-[#E7E5E4]">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#D4A574] fill-[#D4A574]" />
                  ))}
                </div>
                <p className="text-[#57534E] leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-medium text-[#1C1917]">{testimonial.name}</p>
                  <p className="text-sm text-[#78716C]">{testimonial.profile}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COLOCATION VS STUDIO COMPARATIF ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Coliving vs Studio in Geneva: The Comparison"
              : "Colocation vs Studio à Genève : Le Comparatif"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-12">
            {language === "en"
              ? "See why our coliving is the smartest choice for living near Geneva."
              : "Découvrez pourquoi notre colocation est le choix le plus malin pour vivre près de Genève."}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#FAF9F6]">
                  <th className="border border-[#E7E5E4] px-6 py-4 text-left font-medium text-[#1C1917]"></th>
                  <th className="border border-[#E7E5E4] px-6 py-4 text-left font-medium text-[#D4A574]">
                    La Villa Coliving
                  </th>
                  <th className="border border-[#E7E5E4] px-6 py-4 text-left font-medium text-[#78716C]">
                    Studio Genève
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [language === "en" ? "Monthly cost" : "Coût mensuel", language === "en" ? "From 1,380 CHF (all-incl.)" : "Dès 1 380 CHF (tout compris)", "1 800 - 2 500 CHF + charges"],
                  [language === "en" ? "Furnished" : "Meublé", "✓ " + (language === "en" ? "Fully furnished" : "Entièrement meublé"), language === "en" ? "Usually unfurnished" : "Généralement non meublé"],
                  [language === "en" ? "Pool" : "Piscine", "✓ " + (language === "en" ? "Pool included" : "Piscine incluse"), "✗"],
                  ["Gym / Sauna", "✓ " + (language === "en" ? "Included" : "Inclus"), "✗ " + (language === "en" ? "Extra 80-150 CHF/month" : "En plus : 80-150 CHF/mois")],
                  ["Internet", "✓ " + (language === "en" ? "Pro fiber included" : "Fibre Pro incluse"), "~50 CHF/" + (language === "en" ? "month" : "mois")],
                  [language === "en" ? "Cleaning" : "Ménage", "✓ " + (language === "en" ? "2x/week, included" : "2x/semaine, inclus"), language === "en" ? "You manage" : "À votre charge"],
                  [language === "en" ? "Community" : "Communauté", "✓ " + (language === "en" ? "Monthly events, yoga & sports, community dinners" : "Événements mensuels, yoga & sport, dîners communautaires"), "✗ " + (language === "en" ? "Isolated" : "Isolé")],
                  [language === "en" ? "Lease" : "Bail", language === "en" ? "12 months, renewable" : "12 mois, renouvelable", language === "en" ? "12+ months lease" : "Bail 12+ mois"],
                  [language === "en" ? "Deposit" : "Caution", language === "en" ? "2 months excl. charges" : "2 mois hors charges", language === "en" ? "3 months typical" : "3 mois généralement"],
                ].map(([label, villa, studio], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAF9F6]"}>
                    <td className="border border-[#E7E5E4] px-6 py-3 font-medium text-[#1C1917]">{label}</td>
                    <td className="border border-[#E7E5E4] px-6 py-3 text-[#1C1917]">{villa}</td>
                    <td className="border border-[#E7E5E4] px-6 py-3 text-[#57534E]">{studio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== GUIDE ÉTAPE PAR ÉTAPE ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "How to Find Shared Housing in Geneva: Step-by-Step Guide"
              : "Comment Trouver une Colocation à Genève : Guide Étape par Étape"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-16">
            {language === "en"
              ? "Finding the right shared housing in the Geneva area doesn't have to be stressful. Follow these five steps."
              : "Trouver la bonne colocation dans la région de Genève ne doit pas être stressant. Suivez ces cinq étapes."}
          </p>

          <div className="space-y-8 max-w-3xl mx-auto">
            {[
              {
                step: 1,
                title: language === "en" ? "Define your budget and criteria" : "Définissez votre budget et vos critères",
                desc: language === "en"
                  ? "Start by setting a clear monthly budget. Consider not just rent but also utilities, internet, gym membership, and commuting costs. In the Geneva area, an all-inclusive colocation like La Villa at 1,380 CHF/month can be more cost-effective than a cheaper room plus separate expenses. Think about what matters most: proximity to work, amenities, community, or outdoor space."
                  : "Commencez par fixer un budget mensuel clair. Prenez en compte non seulement le loyer mais aussi les charges, l'internet, la salle de sport et les frais de transport. Dans la région de Genève, une colocation tout inclus comme La Villa à 1 380 CHF/mois peut être plus rentable qu'une chambre moins chère avec des dépenses séparées. Réfléchissez à ce qui compte le plus : proximité du travail, équipements, communauté ou espaces verts.",
              },
              {
                step: 2,
                title: language === "en" ? "Explore your options: Swiss side vs French side" : "Explorez les options : côté suisse vs côté France",
                desc: language === "en"
                  ? "A room in a shared flat in Geneva costs 1,000-1,500 CHF/month without services. On the French side, cross-border coliving offers the same access to Geneva at 30-50% lower cost of living. The Leman Express connects Annemasse to Geneva Cornavin in 20 minutes, making the French border towns a practical and financially smart choice for anyone working in Geneva."
                  : "Une chambre en colocation à Genève coûte 1 000 à 1 500 CHF/mois sans services. Côté français, le coliving frontalier offre le même accès à Genève pour un coût de vie 30 à 50% inférieur. Le Léman Express relie Annemasse à Genève Cornavin en 20 minutes, faisant des communes frontalières françaises un choix pratique et financièrement avisé pour quiconque travaille à Genève.",
              },
              {
                step: 3,
                title: language === "en" ? "Visit the spaces and meet the community" : "Visitez les espaces et rencontrez la communauté",
                desc: language === "en"
                  ? "Nothing replaces an in-person visit. At La Villa, we organize private tours of our three houses so you can see the rooms, common areas, pool, gym, and sauna. You'll meet current residents and get a real feel for the community atmosphere. This step is essential — coliving is about the people as much as the place."
                  : "Rien ne remplace une visite en personne. Chez La Villa, nous organisons des visites privées de nos trois maisons pour que vous puissiez voir les chambres, les espaces communs, la piscine, la salle de sport et le sauna. Vous rencontrerez les résidents actuels et ressentirez l'atmosphère de la communauté. Cette étape est essentielle — le coliving, c'est autant les personnes que le lieu.",
              },
              {
                step: 4,
                title: language === "en" ? "Prepare your application" : "Préparez votre dossier",
                desc: language === "en"
                  ? "To apply, you'll need a valid ID, proof of employment (or enrollment), and a brief description of yourself. If you're a cross-border worker, your Swiss work permit (permis G) or employment contract is helpful. Unlike traditional Geneva rentals that demand extensive financial guarantees, our process is straightforward and transparent."
                  : "Pour candidater, vous aurez besoin d'une pièce d'identité valide, d'un justificatif d'emploi (ou d'inscription) et d'une courte description de vous-même. Si vous êtes frontalier, votre permis de travail suisse (permis G) ou contrat de travail est utile. Contrairement aux locations genevoises traditionnelles qui exigent d'importantes garanties financières, notre processus est simple et transparent.",
              },
              {
                step: 5,
                title: language === "en" ? "Move in within 2 weeks" : "Emménagez en 2 semaines",
                desc: language === "en"
                  ? "Once your application is accepted, move-in can happen within two weeks. Your room is ready, fully furnished, with everything included from day one. No need to set up internet, buy furniture, or sign multiple contracts. Just bring your bags and start your new life near Geneva."
                  : "Une fois votre candidature acceptée, l'emménagement peut se faire en deux semaines. Votre chambre est prête, entièrement meublée, avec tout inclus dès le premier jour. Pas besoin d'installer internet, d'acheter des meubles ou de signer plusieurs contrats. Apportez simplement vos valises et commencez votre nouvelle vie près de Genève.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 bg-[#D4A574] text-white rounded-full flex items-center justify-center font-medium text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1C1917] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <LocalizedLink
              to="/candidature"
              className="inline-flex items-center gap-2 bg-[#D4A574] text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors"
            >
              {language === "en" ? "Start Your Application" : "Commencer Votre Candidature"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* ===== FAQ (§3, accordéon Radix → réponses dans le DOM) ===== */}
      <FaqSection
        title={language === "en" ? "Frequently asked questions" : "Questions fréquentes sur la colocation près de Genève"}
        items={colocationFAQ}
      />

      {/* ===== ARTICLES UTILES ===== */}
      {blogPosts.length > 0 && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2
              className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en"
                ? "Useful Guides for Cross-Border Workers"
                : "Guides Utiles pour les Frontaliers"}
            </h2>
            <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-12">
              {language === "en"
                ? "Everything you need to know about living near Geneva."
                : "Tout ce que vous devez savoir pour vivre près de Genève."}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogPosts.map((post) => {
                // Ancres dé-optimisées depuis le PILIER : jamais « colocation (à) Genève »
                // en texte cliquable vers un satellite (règle hub & spoke, Phase 2).
                const ANCHOR_OVERRIDES: Record<string, { fr: string; en: string }> = {
                  "trouver-colocation-geneve-frontalier": {
                    fr: "Comment chercher et éviter les arnaques (guide 2026)",
                    en: "How to search and avoid scams (2026 guide)",
                  },
                };
                const override = ANCHOR_OVERRIDES[post.slug];
                const title = override
                  ? (language === "en" ? override.en : override.fr)
                  : (language === "en" && post.title_en) ? post.title_en : post.title_fr;
                return (
                  <LocalizedLink
                    to={`/blog/${post.slug}`}
                    key={post.id}
                    className="group bg-[#FAF9F6] border border-[#E7E5E4] overflow-hidden hover:border-[#D4A574]/30 hover:shadow-lg transition-all"
                  >
                    {post.image_url && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={post.image_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-[#1C1917] line-clamp-2 group-hover:text-[#D4A574] transition-colors">
                        {title}
                      </h3>
                      <span className="flex items-center gap-1 text-xs text-[#78716C] mt-2">
                        <Clock className="w-3 h-3" /> {post.read_time_min} min
                      </span>
                    </div>
                  </LocalizedLink>
                );
              })}
            </div>
            <div className="text-center mt-8">
              <LocalizedLink to="/blog" className="inline-flex items-center gap-2 text-[#D4A574] font-medium hover:underline">
                {language === "en" ? "View all articles" : "Voir tous les articles"}
                <ArrowRight className="w-4 h-4" />
              </LocalizedLink>
            </div>
          </div>
        </section>
      )}

      {/* ===== RELATED PAGES (maillage entrant vers /annemasse-colocation + /chambre-a-louer-annemasse) ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Looking for the Annemasse-specific view?"
              : "Vous cherchez la vue spécifique Annemasse ?"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-12">
            {language === "en"
              ? "Our 3 houses are all located in Annemasse Agglo (Ville-la-Grand, Ambilly, Annemasse). If you're zooming in on the local angle, here are two dedicated pages."
              : "Nos 3 maisons sont toutes situées dans Annemasse Agglo (Ville-la-Grand, Ambilly, Annemasse). Si vous zoomez sur l'angle local, voici deux pages dédiées."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocalizedLink
              to="/annemasse-colocation"
              className="group bg-[#FAF9F6] border border-[#E7E5E4] p-8 hover:border-[#D4A574]/30 hover:shadow-lg transition-all"
            >
              <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-3 block font-medium">
                {language === "en" ? "Annemasse coliving guide" : "Guide colocation Annemasse"}
              </span>
              <h3 className="text-xl font-medium text-[#1C1917] mb-3 group-hover:text-[#D4A574] transition-colors">
                {language === "en"
                  ? "Coliving in Annemasse — 29 rooms, 3 houses"
                  : "Colocation Annemasse — 29 chambres, 3 maisons"}
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed mb-4">
                {language === "en"
                  ? "Why Annemasse Agglo, real travel times to Geneva, 3-house comparison, what's included in CHF 1,380/mo."
                  : "Pourquoi Annemasse Agglo, temps de trajet réels vers Genève, comparatif des 3 maisons, ce qui est inclus dans 1 380 CHF/mois."}
              </p>
              <span className="inline-flex items-center gap-2 text-[#D4A574] text-sm font-medium group-hover:gap-3 transition-all">
                {language === "en" ? "Read the guide" : "Lire le guide"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </LocalizedLink>

            <LocalizedLink
              to="/chambre-a-louer-annemasse"
              className="group bg-[#FAF9F6] border border-[#E7E5E4] p-8 hover:border-[#D4A574]/30 hover:shadow-lg transition-all"
            >
              <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-3 block font-medium">
                {language === "en" ? "Furnished rooms Annemasse" : "Chambres meublées Annemasse"}
              </span>
              <h3 className="text-xl font-medium text-[#1C1917] mb-3 group-hover:text-[#D4A574] transition-colors">
                {language === "en"
                  ? "Furnished rooms to rent in Annemasse from CHF 1,380/mo"
                  : "Chambres meublées à louer à Annemasse dès 1 380 CHF/mois"}
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed mb-4">
                {language === "en"
                  ? "Direct transactional view: room types, vs studio Annemasse, 4-step move-in process, current availability."
                  : "Vue transactionnelle directe : types de chambres, vs studio Annemasse, process emménagement en 4 étapes, disponibilités actuelles."}
              </p>
              <span className="inline-flex items-center gap-2 text-[#D4A574] text-sm font-medium group-hover:gap-3 transition-all">
                {language === "en" ? "Check availability" : "Voir les disponibilités"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* ===== INTERNAL LINKING — Essentials guides for un-crawled articles ===== */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6] border-t border-[#E7E5E4]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-8 text-center" style={{ fontFamily: "DM Serif Display, serif" }}>
            {language === "en" ? "Essential reads for cross-border workers" : "Lectures essentielles pour les frontaliers"}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm max-w-3xl mx-auto">
            {[
              { fr: "Les meilleurs quartiers frontaliers autour de Genève", en: "Best cross-border districts around Geneva", slug: "meilleurs-quartiers-frontaliers-geneve" },
              { fr: "Fiscalité du frontalier à Genève : impôts 2026", en: "Cross-border taxation in Geneva: 2026 rules", slug: "fiscalite-frontalier-geneve-impots-2026" },
              { fr: "Le budget complet d'un logement frontalier à Genève", en: "The full budget of cross-border housing near Geneva", slug: "budget-colocation-geneve-guide-complet" },
              { fr: "Où habiter quand on est frontalier suisse — Top 7 villes", en: "Where to live as a Swiss cross-border worker — Top 7 towns", slug: "ou-habiter-frontalier-suisse-villes-france-pas-cher" },
              { fr: "Télétravail frontalier Genève : règles 2026", en: "Cross-border remote work Geneva: 2026 rules", slug: "teletravail-frontalier-geneve-regles-2026" },
              { fr: "Se loger à Genève quand on est expatrié", en: "Housing in Geneva as an expat", slug: "colocation-expats-geneve-guide" },
            ].map((item) => (
              <li key={item.slug} className="flex items-start gap-2">
                <span className="text-[#D4A574]">→</span>
                <LocalizedLink to={language === "en" ? `/en/blog/${item.slug}` : `/blog/${item.slug}`} className="text-[#1C1917] hover:text-[#D4A574] hover:underline transition-colors">
                  {language === "en" ? item.en : item.fr}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== C4 — LISTE PRIORITAIRE (waitlist) ===== */}
      <section className="py-20 lg:py-28 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {language === "en" ? "Priority list" : "Liste prioritaire"}
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4" style={{ fontFamily: "DM Serif Display, serif" }}>
            {language === "en" ? "No spot right now? Get first in line." : "Pas de place tout de suite ? Soyez prioritaire."}
          </h2>
          <p className="text-[#57534E] max-w-xl mx-auto mb-10">
            {language === "en"
              ? "Our houses fill fast. Join the priority list — we'll reach out the moment a room matching your profile opens up."
              : "Nos maisons se remplissent vite. Rejoignez la liste prioritaire : on vous contacte dès qu'une chambre correspondant à votre profil se libère."}
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 lg:py-32 bg-[#1C1917] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-4xl font-light mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Ready to Find Your Room Near Geneva?"
              : "Prêt à Trouver Votre Chambre près de Genève ?"}
          </h2>
          <p className="text-[#78716C] text-lg mb-10 max-w-xl mx-auto">
            {language === "en"
              ? "Apply in 2 minutes. We'll get back to you within 48 hours. Move in within 2 weeks."
              : "Candidatez en 2 minutes. Réponse sous 48h. Emménagement en 2 semaines."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LocalizedLink
              to="/candidature"
              className="inline-flex items-center gap-2 bg-[#D4A574] text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors"
            >
              {language === "en" ? "Apply Now" : "Candidater Maintenant"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
            <LocalizedLink
              to="/tarifs"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-white hover:text-[#1C1917] transition-colors"
            >
              {language === "en" ? "View Pricing" : "Voir les Tarifs"}
            </LocalizedLink>
          </div>
        </div>
      </section>
      {/* C3 — CTA collante mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[#E7E5E4] px-4 py-3">
        <LocalizedLink
          to="/candidature"
          className="flex items-center justify-center gap-2 w-full bg-[#D4A574] text-white py-3 rounded-lg text-sm font-semibold uppercase tracking-wider"
        >
          {language === "en" ? "Apply — reply within 48h" : "Candidater — réponse sous 48h"}
          <ArrowRight className="w-4 h-4" />
        </LocalizedLink>
      </div>
    </main>
  );
}
