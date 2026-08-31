import { useLanguage } from "@/contexts/LanguageContext";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Check, ArrowRight, Home, Sparkles, X, Star, Droplets } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { colocGeneveHref } from "@/lib/siteLinks";
import { Helmet } from "react-helmet";
import { SEO } from "@/components/SEO";
import { FaqSection } from "@/components/FaqSection";
import { tarifsFaq } from "@/data/faq/tarifsFaq";
import { buildBreadcrumbSchema, buildRoomsAggregateOfferSchema } from "@/lib/structuredData";
import { STATS, PRICE_FR_NUM, PRICE_EN_NUM, PRICE_CHF_FR, PRICE_CHF_EN, PRICE_SHARED_FR_NUM, PRICE_SHARED_EN_NUM, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN, CONTRACT_EUR, EUR_STANDARD_FR_NUM, EUR_SHARED_FR_NUM, EUR_STANDARD_EN_NUM, EUR_SHARED_EN_NUM } from "@/data/stats";
import {
  GENEVA_STUDIO_COSTS,
  GENEVA_STUDIO_BASE_RENT_FR,
  GENEVA_STUDIO_BASE_RENT_EN,
  GENEVA_STUDIO_TOTAL_FR,
  GENEVA_STUDIO_TOTAL_EN,
  MONTHLY_SAVINGS_CHF,
  YEARLY_SAVINGS_FR_NUM,
  YEARLY_SAVINGS_EN_NUM,
  VILLA_EUR_PER_M2_FR,
  VILLA_EUR_PER_M2_EN,
} from "@/data/pricingComparison";

export function RatesPageV4() {
  const { language } = useLanguage();

  const includedItems = [
    language === "en"
      ? "Rent & utilities (electricity, water, heating)"
      : "Loyer & charges (électricité, eau, chauffage)",
    language === "en"
      ? "High-speed Pro fiber internet"
      : "Internet fibre Pro haut débit",
    language === "en" ? "Housekeeping three times a week" : "Ménage 3 fois par semaine",
    language === "en"
      ? "Pool & garden maintenance"
      : "Entretien piscine & jardin",
    language === "en"
      ? "Gym, sauna & wellness area"
      : "Salle de sport, sauna & espace bien-être",
    language === "en"
      ? "Weekly yoga & fitness classes"
      : "Cours de yoga & fitness hebdomadaires",
    language === "en" ? "Streaming subscriptions" : "Abonnements streaming",
    language === "en" ? "Community events" : "Événements communautaires",
    language === "en"
      ? "Monthly essentials delivery"
      : "Livraison essentiels mensuels",
    language === "en" ? "WhatsApp support" : "Support WhatsApp",
  ];

  // Detailed services data
  const detailedServices = [
    {
      category: language === "en" ? "Water & Energy" : "Eau & Énergie",
      icon: "water",
      items:
        language === "en"
          ? [
              "Electricity, heating & hot water",
              "Water for common areas & garden maintenance",
              "Pool water treatment & maintenance",
              "All repairs & technical interventions",
              "Boiler maintenance & servicing",
            ]
          : [
              "Électricité, chauffage & eau chaude",
              "Eau pour entretien parties communes & jardin",
              "Traitement & maintenance eau piscine",
              "Toutes réparations & interventions techniques",
              "Entretien chaudière & maintenance",
            ],
    },
    {
      category:
        language === "en" ? "Cleaning & Maintenance" : "Ménage & Entretien",
      icon: "clean",
      items:
        language === "en"
          ? [
              "Common areas cleaned 3x per week",
              "Room cleaning available as option",
              "Pool & garden maintenance",
              "Basic supplies delivered monthly",
              "Waste management & recycling",
            ]
          : [
              "Parties communes nettoyées 3x par semaine",
              "Ménage chambre disponible en option",
              "Entretien piscine & jardin",
              "Fournitures de base livrées mensuellement",
              "Gestion des déchets & recyclage",
            ],
    },
    {
      category:
        language === "en" ? "Community & Wellness" : "Communauté & Bien-être",
      icon: "wellness",
      items:
        language === "en"
          ? [
              "Yoga classes included",
              "Fitness coaching sessions",
              "Community dinners & events",
              "WhatsApp support < 48h response",
            ]
          : [
              "Cours de yoga inclus",
              "Séances de coaching sportif",
              "Dîners communautaires & événements",
              "Support WhatsApp",
            ],
    },
    {
      category: language === "en" ? "Subscriptions" : "Abonnements",
      icon: "subscriptions",
      items:
        language === "en"
          ? [
              "High-speed fiber internet",
              "Netflix & streaming services",
              "Home insurance guidance",
              "No agency fees",
              "No hidden charges",
            ]
          : [
              "Internet fibre haut débit",
              "Netflix & services streaming",
              "Assistance assurance habitation",
              "Sans frais d'agence",
              "Sans charges cachées",
            ],
    },
    {
      category: language === "en" ? "Taxes & Fees" : "Taxes & Frais",
      icon: "taxes",
      items:
        language === "en"
          ? [
              "Garbage collection tax",
              "Street cleaning tax",
              "Sewage & sanitation charges",
              "Property management included",
              "Move-in/move-out support",
            ]
          : [
              "Taxe enlèvement ordures ménagères",
              "Taxe de balayage",
              "Redevance assainissement",
              "Gestion immobilière incluse",
              "Accompagnement entrée/sortie",
            ],
    },
  ];

  // Houses data with images
  const houses = [
    {
      name: "La Villa",
      location: "Ville-la-Grand",
      image: "/images/villa_portrait.webp",
      alt: language === "en"
        ? `La Villa coliving Ville-la-Grand — all-inclusive furnished rooms from ${PRICE_SHARED_EN_NUM} CHF near Geneva`
        : `La Villa coliving Ville-la-Grand — chambres meublées tout inclus dès ${PRICE_SHARED_CHF_FR} près de Genève`,
      description:
        language === "en"
          ? "Elegant villa with pool & garden"
          : "Villa élégante avec piscine & jardin",
    },
    {
      name: "Le Loft",
      location: "Ambilly",
      image: "/images/le loft jardin.webp",
      alt: language === "en"
        ? `Le Loft coliving Ambilly — all-inclusive furnished rooms at ${PRICE_EN_NUM} CHF near Geneva`
        : `Le Loft coliving Ambilly — chambres meublées tout inclus à ${PRICE_CHF_FR} près de Genève`,
      description:
        language === "en"
          ? "Modern loft with big rooms"
          : "Loft moderne avec grandes chambres",
    },
    {
      name: "Le Lodge",
      location: "Annemasse",
      image: "/images/le lodge piscine.webp",
      alt: language === "en"
        ? `Le Lodge coliving Annemasse — all-inclusive furnished rooms at ${PRICE_EN_NUM} CHF near Geneva`
        : `Le Lodge coliving Annemasse — chambres meublées tout inclus à ${PRICE_CHF_FR} près de Genève`,
      description:
        language === "en"
          ? "Pool house, full fitness chalet with sauna & arcade"
          : "Pool house, chalet fitness complet avec sauna et jeu d'arcade",
    },
  ];

  // Comparatif marché : montants et économies centralisés dans src/data/pricingComparison.ts.

  // Même pattern gtag gardé que HouseDetailPage / WhatsAppButton : mesurer la
  // position du CTA qui convertit, sans jamais bloquer l'UI sur l'analytics.
  const trackCta = (position: string) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: position, cta_target: "/candidature", language,
      });
    } catch { /* noop */ }
  };
  const trackWhatsApp = (position: string) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "whatsapp_click", {
        position, language,
      });
    } catch { /* noop */ }
  };

  // Tableau « objection prix » — 3 colonnes, La Villa au centre.
  // Colonnes marché = observations (fourchettes, « le plus souvent ») ; colonne La Villa = faits contractuels.
  const pick = (t: { fr: string; en: string }) => (language === "en" ? t.en : t.fr);
  const objectionRows: Array<{
    label: { fr: string; en: string };
    classic: { fr: string; en: string };
    villa: { fr: string; en: string };
    studio: { fr: string; en: string };
    highlight?: boolean;
  }> = [
    {
      label: { fr: "Loyer mensuel", en: "Monthly rent" },
      classic: { fr: "700-1 000 €", en: "€700-1,000" },
      villa: {
        fr: `dès ${PRICE_SHARED_CHF_FR} tout inclus`,
        en: `from ${PRICE_SHARED_CHF_EN} all inclusive`,
      },
      studio: { fr: "1 800-2 500 CHF + charges", en: "CHF 1,800-2,500 + utilities" },
    },
    {
      label: { fr: "Surface chambre", en: "Room size" },
      classic: { fr: "9-12 m² (le plus souvent)", en: "9-12 m² (most often)" },
      villa: {
        fr: `${STATS.roomSizeMin}-${STATS.roomSizeMax} m²`,
        en: `${STATS.roomSizeMin}-${STATS.roomSizeMax} m²`,
      },
      studio: { fr: "20-30 m² (logement entier)", en: "20-30 m² (entire studio)" },
    },
    {
      label: {
        fr: "Espace de vie par colocataire",
        en: "Living space per flatmate",
      },
      classic: {
        fr: "22-28 m² (relevé août 2026)",
        en: "22-28 m² (surveyed August 2026)",
      },
      villa: {
        fr: "37-42 m² + extérieurs jusqu'à 2 000 m²",
        en: "37-42 m² + outdoor areas up to 2,000 m²",
      },
      studio: {
        fr: "tout le logement, mais seul",
        en: "the entire flat, but alone",
      },
    },
    {
      label: { fr: "Prix du m²", en: "Price per m²" },
      classic: { fr: "~25-45 €/m²", en: "~€25-45/m²" },
      villa: { fr: VILLA_EUR_PER_M2_FR, en: VILLA_EUR_PER_M2_EN },
      studio: { fr: "~85-110 CHF/m² + charges", en: "~CHF 85-110/m² + utilities" },
      highlight: true,
    },
    {
      label: { fr: "Charges, fibre, streaming", en: "Utilities, fibre, streaming" },
      classic: { fr: "rarement incluses", en: "rarely included" },
      villa: { fr: "incluses", en: "included" },
      studio: { fr: "200-400 CHF en plus", en: "CHF 200-400 on top" },
    },
    {
      label: { fr: "Piscine, sauna, salle de sport", en: "Pool, sauna, gym" },
      classic: { fr: "✗", en: "✗" },
      villa: { fr: "✓ dans chaque maison", en: "✓ in every house" },
      studio: { fr: "✗ (gym : 80-150 CHF/mois)", en: "✗ (gym: CHF 80-150/month)" },
    },
    {
      label: { fr: "Ménage professionnel", en: "Professional cleaning" },
      classic: { fr: "✗ (à ta charge)", en: "✗ (up to you)" },
      villa: {
        fr: "✓ 3×/sem",
        en: "✓ 3×/week",
      },
      studio: { fr: "✗", en: "✗" },
    },
    {
      label: {
        fr: "Entretien (jardinier, pisciniste, réparations)",
        en: "Upkeep (gardener, pool technician, repairs)",
      },
      classic: { fr: "propriétaire à relancer", en: "landlord to chase" },
      villa: {
        fr: "✓ équipe dédiée, réponse < 48 h",
        en: "✓ dedicated team, answer < 48 h",
      },
      studio: { fr: "à ta charge", en: "up to you" },
    },
    {
      label: { fr: "Événements & communauté", en: "Events & community" },
      classic: { fr: "selon la chance", en: "luck of the draw" },
      villa: { fr: "✓ organisés chaque mois", en: "✓ organised every month" },
      studio: { fr: "✗", en: "✗" },
    },
    {
      label: { fr: "Frais d'entrée (dossier, agence)", en: "Move-in fees (application, agency)" },
      classic: { fr: "200-700 € fréquents", en: "€200-700 common" },
      villa: { fr: "0 €", en: "€0" },
      studio: { fr: "souvent élevés", en: "often high" },
    },
    {
      label: { fr: "Caution", en: "Deposit" },
      classic: { fr: "variable", en: "varies" },
      villa: {
        fr: `${STATS.depositMonths} mois hors charges, étalable`,
        en: `${STATS.depositMonths} months excluding utilities, can be split`,
      },
      studio: { fr: "3 mois usuels", en: "3 months customary" },
    },
  ];

  return (
    <main className="relative pt-16">
      <SEO
        // Prix retiré du title le 15/08/2026 (doctrine A6/S33) — il reste en meta description.
        title={language === "en" ? "Rates — All-Inclusive Coliving Near Geneva" : "Tarifs Colocation Genève — Tout Compris"}
        description={language === "en"
          ? `All-inclusive coliving near Geneva from ${PRICE_SHARED_EN_NUM} CHF/month — no application or agency fees. Rent, utilities, gym, pool, WiFi, cleaning included.`
          : `Tarifs colocation tout inclus près de Genève dès ${PRICE_SHARED_CHF_FR}/mois, sans frais de dossier ni d'agence. Loyer, charges, gym, piscine, WiFi, ménage compris.`}
        url="https://www.lavillacoliving.com/tarifs"
      />
      <Helmet>
        {/* URLs localisées (…/en/tarifs en anglais) — même pattern que HouseDetailPage/BlogPostPage */}
        <script type="application/ld+json">{JSON.stringify(buildBreadcrumbSchema([
          { name: language === "en" ? "Home" : "Accueil", url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/` },
          { name: language === "en" ? "Rates" : "Tarifs", url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/tarifs` },
        ]))}</script>
        <script type="application/ld+json">{JSON.stringify(buildRoomsAggregateOfferSchema({
          name: language === "en" ? "All-inclusive furnished room near Geneva" : "Chambre meublée tout inclus près de Genève",
          description: language === "en"
            ? `All-inclusive coliving room from ${PRICE_SHARED_CHF_EN} to ${PRICE_CHF_EN}/month near Geneva — utilities, fiber, cleaning, pool, sauna, gym included.`
            : `Chambre de coliving tout inclus de ${PRICE_SHARED_CHF_FR} à ${PRICE_CHF_FR}/mois près de Genève — charges, fibre, ménage, piscine, sauna, salle de sport compris.`,
          url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/tarifs`,
        }))}</script>
      </Helmet>
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "Pricing" : "Tarification"}
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1C1917] mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? (
              <>
                Transparent <span className="text-[#D4A574]">Pricing</span>
              </>
            ) : (
              <>
                Tarifs <span className="text-[#D4A574]">Transparents</span>
              </>
            )}
          </h1>
          <p className="text-xl text-[#57534E] max-w-2xl mx-auto mb-4">
            {language === "en"
              ? `from ${PRICE_SHARED_EN_NUM} CHF/month (€${EUR_SHARED_EN_NUM}/month) — All inclusive`
              : `dès ${PRICE_SHARED_CHF_FR}/mois (${EUR_SHARED_FR_NUM} €/mois) — Tout inclus`}
          </p>
          <p className="text-lg text-[#78716C]">
            {language === "en"
              ? `At La Villa Coliving, rooms with a private shower room cost ${PRICE_CHF_EN}/month (€${EUR_STANDARD_EN_NUM}) all-inclusive. Those with a shared bathroom cost ${PRICE_SHARED_CHF_EN}/month (€${EUR_SHARED_EN_NUM}): rent, utilities, fiber, cleaning three times a week, gym, pool, streaming. No application or agency fees — deposit of 2 months' rent (excluding utilities).`
              : `À La Villa Coliving, les chambres avec salle d'eau privée coûtent ${PRICE_CHF_FR}/mois (${EUR_STANDARD_FR_NUM} €) tout compris. Celles avec salle de bain partagée coûtent ${PRICE_SHARED_CHF_FR}/mois (${EUR_SHARED_FR_NUM} €) : loyer, charges, fibre, ménage 3x/semaine, salle de sport, piscine, streaming. Sans frais de dossier ni d'agence — caution de 2 mois de loyer (hors charges).`}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {(language === "en"
              ? ["€0 application fee", "€0 agency fee", "€0 check-in fee"]
              : ["0 € de frais de dossier", "0 € d'honoraires d'agence", "0 € de frais d'état des lieux"]
            ).map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-4 py-2 bg-[#1C1917] text-white text-sm md:text-base font-semibold rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
          {/* Mention contractuelle euro (prix maître depuis le 01/09/2026) — montants via CONTRACT_EUR */}
          <p className="mt-6 max-w-2xl mx-auto text-xs text-[#78716C]">
            {language === "en"
              ? `Contractual rent in euros: €${EUR_SHARED_EN_NUM}–€${EUR_STANDARD_EN_NUM}/month depending on the room. CHF shown for guidance — ${CONTRACT_EUR.rateLabelEn} rate.`
              : `Loyer contractuel en euros : de ${EUR_SHARED_FR_NUM} à ${EUR_STANDARD_FR_NUM} €/mois selon la chambre. Affichage en CHF indicatif — taux d'${CONTRACT_EUR.rateLabelFr}.`}{" "}
            <LocalizedLink
              to="/charte-transparence"
              className="underline underline-offset-4 hover:text-[#1C1917] transition-colors"
            >
              {language === "en" ? "Read our transparency charter" : "Lire notre charte de transparence"}
            </LocalizedLink>
          </p>
        </div>
      </section>

      {/* COMPARISON SECTION - Geneva vs La Villa */}
      <section className="py-20 bg-[#1C1917]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A574]/20 text-[#E0BB8A] text-sm font-medium rounded-full mb-4">
              <Star className="w-4 h-4" />{" "}
              {language === "en"
                ? "Real Cost Comparison"
                : "Comparaison Réelle des Coûts"}
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              {language === "en"
                ? "Geneva Studio vs La Villa"
                : "Studio Genève vs La Villa"}
            </h2>
            <p className="text-[#A8A29E] max-w-2xl mx-auto">
              {language === "en"
                ? "See how much you actually save with our all-inclusive model"
                : "Découvre combien tu économises réellement avec notre modèle tout-inclus"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Geneva Studio */}
            <div className="bg-[#1C1917] rounded-2xl p-8 border border-[#333]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#666]/20 flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#b3b2b2]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {language === "en" ? "Geneva Studio" : "Studio Genève"}
                  </h3>
                  <p className="text-sm text-[#b3b2b2]">
                    {language === "en"
                      ? "Traditional rental"
                      : "Location traditionnelle"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-white">
                  <span>
                    {language === "en"
                      ? "Base rent (small studio)"
                      : "Loyer de base (petit studio)"}
                  </span>
                  <span className="font-medium">{language === "en" ? GENEVA_STUDIO_BASE_RENT_EN : GENEVA_STUDIO_BASE_RENT_FR}</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Electricity" : "Électricité"}
                  </span>
                  <span>+ {GENEVA_STUDIO_COSTS.electricity} CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Heating" : "Chauffage"}
                  </span>
                  <span>+ {GENEVA_STUDIO_COSTS.heating} CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Water" : "Eau"}
                  </span>
                  <span>+ {GENEVA_STUDIO_COSTS.water} CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" /> Internet
                  </span>
                  <span>+ {GENEVA_STUDIO_COSTS.internet} CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Cleaning service" : "Service ménage"}
                  </span>
                  <span>+ {GENEVA_STUDIO_COSTS.cleaning} CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Gym membership" : "Abonnement gym"}
                  </span>
                  <span>+ {GENEVA_STUDIO_COSTS.gym} CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en"
                      ? "Streaming services"
                      : "Services streaming"}
                  </span>
                  <span>+ {GENEVA_STUDIO_COSTS.streaming} CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Taxes & fees" : "Taxes & frais"}
                  </span>
                  <span>+ {GENEVA_STUDIO_COSTS.taxes} CHF</span>
                </div>
              </div>

              <div className="border-t border-[#333] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#d5d5d5]">
                    {language === "en" ? "Total monthly" : "Total mensuel"}
                  </span>
                  <span className="text-2xl font-medium text-[#d5d5d5]">
                    {language === "en" ? GENEVA_STUDIO_TOTAL_EN : GENEVA_STUDIO_TOTAL_FR}
                  </span>
                </div>
              </div>
            </div>

            {/* La Villa */}
            <div className="bg-white rounded-2xl p-8 relative overflow-hidden border border-[#E7E5E4] shadow-lg">
              <div className="absolute top-4 right-4 bg-[#D4A574] text-white text-xs font-bold px-3 py-1 rounded-full">
                {language === "en"
                  ? `SAVE ${MONTHLY_SAVINGS_CHF} CHF/MO`
                  : `ÉCONOMISE ${MONTHLY_SAVINGS_CHF} CHF/MOIS`}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#FAF9F6] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#D4A574]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#1C1917]">
                    La Villa Coliving
                  </h3>
                  <p className="text-base text-[#57534E]">
                    {language === "en" ? "All-inclusive" : "Tout-inclus"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-[#1C1917] font-medium text-base">
                  <span>
                    {language === "en"
                      ? "Your room (furnished)"
                      : "Ta chambre (meublée)"}
                  </span>
                  <span>{language === "en" ? PRICE_CHF_EN : PRICE_CHF_FR}</span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "Room from 17 to 25 m²"
                      : "Chambre de 17 à 25 m²"}
                  </span>
                  <span className="text-[#D4A574] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "Premium home & furniture"
                      : "Logement d'exception et mobilier premium"}
                  </span>
                  <span className="text-[#D4A574] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "All maintenance & repairs"
                      : "Tout entretien et réparations"}
                  </span>
                  <span className="text-[#D4A574] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "All utilities included"
                      : "Toutes charges incluses"}
                  </span>
                  <span className="text-[#D4A574] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "Yoga & fitness classes"
                      : "Cours yoga & fitness"}
                  </span>
                  <span className="text-[#D4A574] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "Pool, sauna & gym"
                      : "Piscine, sauna & sport"}
                  </span>
                  <span className="text-[#D4A574] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "Community events"
                      : "Événements communautaires"}
                  </span>
                  <span className="text-[#D4A574] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "Cleaning 3x/week"
                      : "Ménage 3x/semaine"}
                  </span>
                  <span className="text-[#D4A574] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" /> Internet & streaming
                  </span>
                  <span className="text-[#D4A574] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#E7E5E4] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#57534E]">
                    {language === "en" ? "Total monthly" : "Total mensuel"}
                  </span>
                  <span className="text-3xl font-bold text-[#1C1917]">
                    {language === "en" ? PRICE_CHF_EN : PRICE_CHF_FR}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Banner */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-[#D4A574] text-white px-8 py-6 rounded-2xl shadow-[0_10px_40px_rgba(212,165,116,0.3)]">
              <Star className="w-8 h-8 text-white" />
              <div className="text-center sm:text-left">
                <div className="text-sm opacity-90">
                  {language === "en"
                    ? "You save every month"
                    : "Tu économises chaque mois"}
                </div>
                <div className="text-3xl font-bold">{MONTHLY_SAVINGS_CHF} CHF</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/20"></div>
              <div className="text-center sm:text-left">
                <div className="text-sm opacity-90">
                  {language === "en" ? "That's per year" : "Soit par an"}
                </div>
                <div className="text-2xl font-bold">
                  {/* thousands() et non toLocaleString : séparateurs déterministes (règle anti-ICU, cf. stats.ts) */}
                  {language === "en" ? YEARLY_SAVINGS_EN_NUM : YEARLY_SAVINGS_FR_NUM} CHF
                </div>
              </div>
              <Star className="w-8 h-8 text-[#D4A574]" />
            </div>
            <p className="text-[#A8A29E] mt-4 text-sm">
              {language === "en"
                ? "+ An instant community, premium amenities & zero hassle!"
                : "+ Une communauté instantanée, équipements premium & zéro tracas !"}
            </p>
            <a
              href="https://wa.me/33664315134"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsApp("tarifs_economies")}
              className="mt-3 inline-block text-sm text-white/80 hover:text-[#E0BB8A] transition-colors duration-300"
            >
              {language === "en"
                ? "Or ask us a question directly on WhatsApp →"
                : "Ou pose-nous directement une question sur WhatsApp →"}
            </a>
            {/* CTA climax — juste après la démonstration d'économies, au pic de conviction */}
            <div className="mt-6">
              <LocalizedLink
                to="/candidature"
                onClick={() => trackCta("tarifs_climax")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4A574] text-white font-semibold rounded-lg hover:bg-[#E0BB8A] transition-colors duration-300"
              >
                {language === "en" ? "Apply — 2 min, free" : "Candidater — 2 min, gratuit"}
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>

      {/* OBJECTION PRIX — « Oui, nos prix sont plus élevés » + tableau comparatif 3 colonnes */}
      <section className="py-20 bg-[#FAF9F6]" id="objection-prix">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-light text-[#1C1917] mb-8"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en"
                ? "Yes, our prices are higher. Here's why — and what you get for it."
                : "Oui, nos prix sont plus élevés. Voici pourquoi — et ce que tu obtiens en échange."}
            </h2>
            {/* Argumentaire réécrit en 4 points (demande Jérôme 29/08) : surface,
                ménage, tout-inclus jusqu'aux fournitures, équipements premium.
                Jamais de concurrent nommé — on parle du « marché » et de la
                « colocation classique ». Chiffres via STATS (source unique). */}
            <div className="space-y-8 text-[#44403C] leading-relaxed">
              <p>
                {language === "en"
                  ? "A room in a standard flatshare costs less. Here is precisely what the difference buys you."
                  : "Une chambre en colocation classique coûte moins cher. Voici précisément ce que la différence t'achète."}
              </p>

              <div>
                <h3 className="text-lg font-semibold text-[#1C1917] mb-2">
                  {language === "en"
                    ? "1. Rooms up to twice as big — and twice the space to live in"
                    : "1. Des chambres jusqu'à deux fois plus grandes — et deux fois plus d'espace à vivre"}
                </h3>
                <p>
                  {language === "en" ? (
                    <>
                      A standard flatshare room is usually 9-12 m². Ours are{" "}
                      <strong>{STATS.roomSizeMin}-{STATS.roomSizeMax} m²</strong> — up to twice that.
                      And it does not stop at your door: counting the common areas, each housemate
                      has <strong>37-42 m² of living space</strong>, again about twice what a classic
                      flatshare leaves you.
                    </>
                  ) : (
                    <>
                      Une chambre en colocation classique fait le plus souvent 9 à 12 m². Les nôtres
                      font <strong>{STATS.roomSizeMin} à {STATS.roomSizeMax} m²</strong> — jusqu'à
                      deux fois plus. Et ça ne s'arrête pas à ta porte : espaces communs compris,
                      chaque colocataire dispose de{" "}
                      <strong>37 à 42 m² de surface de vie</strong>, là encore près du double de ce
                      que laisse une coloc classique.
                    </>
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1C1917] mb-2">
                  {language === "en"
                    ? `2. Housekeeping ${STATS.cleaningPerWeek}× a week`
                    : `2. Le ménage ${STATS.cleaningPerWeek} fois par semaine`}
                </h3>
                <p>
                  {language === "en" ? (
                    <>
                      Not once. Not twice, which is the best the market offers.{" "}
                      <strong>{STATS.cleaningPerWeek} visits a week</strong> from a professional team
                      across every shared space — kitchen, lounges, shared shower rooms. No cleaning
                      rota to negotiate, no chore to split: you come home, it is clean.
                    </>
                  ) : (
                    <>
                      Pas une fois. Pas deux, ce que propose au mieux le marché.{" "}
                      <strong>{STATS.cleaningPerWeek} passages par semaine</strong> d'une équipe
                      professionnelle dans tous les espaces partagés — cuisine, salons, salles d'eau
                      communes. Aucun planning de ménage à négocier, aucune corvée à répartir : tu
                      rentres, c'est propre.
                    </>
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1C1917] mb-2">
                  {language === "en"
                    ? "3. 100% of costs included, zero surprises"
                    : "3. 100 % des frais inclus, zéro surprise"}
                </h3>
                <p>
                  {language === "en" ? (
                    <>
                      One payment a month. It covers the rent, all utilities (water, electricity,
                      heating), fibre up to {STATS.fiberSpeed} and the streaming subscriptions — plus
                      everything nobody thinks to count:{" "}
                      <strong>
                        bedding and towels provided, cleaning products, cloths, and the basics —
                        toilet paper, laundry detergent, salt, pepper, oil
                      </strong>
                      . No application fee, no agency fee, no paid extras. You know your monthly cost
                      in advance, to the franc.
                    </>
                  ) : (
                    <>
                      Un seul paiement par mois. Il comprend le loyer, toutes les charges (eau,
                      électricité, chauffage), la fibre jusqu'à {STATS.fiberSpeed} et les abonnements
                      streaming — plus tout ce qu'on ne pense jamais à compter :{" "}
                      <strong>
                        parure de lit et serviettes fournies, produits d'entretien, chiffons, et les
                        fournitures de base — papier toilette, lessive, sel, poivre, huile
                      </strong>
                      . Aucun frais de dossier, aucun honoraire d'agence, aucune option payante. Tu
                      connais ta dépense du mois à l'avance, au franc près.
                    </>
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1C1917] mb-2">
                  {language === "en"
                    ? "4. Premium amenities and services"
                    : "4. Des équipements et des services premium"}
                </h3>
                <p>
                  {language === "en" ? (
                    <>
                      <strong>Pool, sauna, gym and landscaped outdoor areas</strong> in every house.
                      Private <strong>yoga and fitness classes every week</strong>, a{" "}
                      <strong>pizza night every month</strong>, and events all year round. These are
                      services no classic flatshare offers — and here, they are part of the rent.
                    </>
                  ) : (
                    <>
                      <strong>Piscine, sauna, salle de sport et extérieurs aménagés</strong> dans
                      chaque maison. Des{" "}
                      <strong>cours privés de yoga et de fitness chaque semaine</strong>, une{" "}
                      <strong>soirée pizza tous les mois</strong>, et des événements toute l'année.
                      Ce sont des services qu'aucune colocation classique ne propose — et ici, ils
                      sont compris dans le loyer.
                    </>
                  )}
                </p>
              </div>

              <p>
                {language === "en"
                  ? "If you are after the lowest rent in the area, that unfortunately will not be us. If you compare what every franc buys you, then come and visit a house!"
                  : "Si tu cherches le loyer le plus bas de l'agglomération, ce ne sera malheureusement pas nous. Si tu compares ce que chaque franc t'apporte, alors viens visiter une maison !"}
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-16">
            <h3
              className="text-2xl md:text-3xl font-light text-[#1C1917] mb-8 text-center"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en"
                ? "La Villa Coliving compared with a standard flatshare"
                : "La Villa Coliving comparé à la colocation classique"}
            </h3>
            <p
              className="md:hidden text-xs text-[#78716C] mb-2 text-right pr-1"
              aria-hidden="true"
            >
              {language === "en"
                ? "Swipe to compare →"
                : "Fais défiler pour comparer →"}
            </p>
            <div className="overflow-x-auto rounded-2xl border border-[#E7E5E4] bg-white shadow-sm">
              <table className="w-full min-w-[680px] border-separate border-spacing-0 text-sm">
                <caption className="sr-only">
                  {language === "en"
                    ? "Price and services comparison: standard flatshare, La Villa Coliving, Geneva studio"
                    : "Comparaison prix et services : colocation classique, La Villa Coliving, studio à Genève"}
                </caption>
                <thead>
                  <tr className="bg-[#1C1917] text-white">
                    <th
                      scope="col"
                      className="sticky left-0 z-[1] bg-[#1C1917] px-4 py-4 text-left font-medium w-[150px] min-w-[150px] md:w-auto md:min-w-[200px]"
                    >
                      <span className="sr-only">
                        {language === "en" ? "Criterion" : "Critère"}
                      </span>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left font-medium">
                      {language === "en"
                        ? "Standard flatshare (local area)"
                        : "Colocation classique (agglo)"}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-left font-bold bg-[#D4A574]"
                    >
                      La Villa Coliving
                    </th>
                    <th scope="col" className="px-4 py-4 text-left font-medium">
                      {language === "en" ? "Geneva studio" : "Studio Genève"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {objectionRows.map((row) => (
                    <tr key={row.label.fr} className="group">
                      <th
                        scope="row"
                        className={`sticky left-0 z-[1] bg-white border-r border-b border-[#E7E5E4] group-last:border-b-0 px-4 py-3 text-left align-top text-[#1C1917] w-[150px] min-w-[150px] md:w-auto md:min-w-[200px] ${
                          row.highlight ? "font-bold" : "font-medium"
                        }`}
                      >
                        {pick(row.label)}
                      </th>
                      <td className="border-b border-[#E7E5E4] group-last:border-b-0 px-4 py-3 align-top text-[#57534E]">
                        {pick(row.classic)}
                      </td>
                      <td
                        className={`border-b border-[#E7E5E4] group-last:border-b-0 px-4 py-3 align-top bg-[#F8EFE4] text-[#1C1917] ${
                          row.highlight ? "font-bold" : "font-semibold"
                        }`}
                      >
                        {pick(row.villa)}
                      </td>
                      <td className="border-b border-[#E7E5E4] group-last:border-b-0 px-4 py-3 align-top text-[#57534E]">
                        {pick(row.studio)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-center text-xs text-[#78716C]">
              {language === "en"
                ? `"Standard flatshare" and "Geneva studio" columns: market observations (indicative ranges). La Villa column: contractual facts. La Villa price per m²: contractual rent of €${EUR_STANDARD_EN_NUM} (${PRICE_CHF_EN}) ÷ 37-42 m² of living space per flatmate.`
                : `Colonnes « Colocation classique » et « Studio Genève » : observations de marché (fourchettes indicatives). Colonne La Villa : faits contractuels. Prix du m² La Villa : loyer contractuel de ${EUR_STANDARD_FR_NUM} € (${PRICE_CHF_FR}) ÷ 37-42 m² d'espace de vie par colocataire.`}
            </p>

            {/* Encadré méga-résidences — chiffres publics, concurrent non nommé */}
            <aside className="mt-10 max-w-3xl mx-auto bg-white border border-[#E7E5E4] border-l-4 border-l-[#D4A574] rounded-xl p-6 md:p-8">
              <p className="text-xs font-medium tracking-wider uppercase text-[#D4A574] mb-2">
                {language === "en" ? "Mega-residences" : "Méga-résidences"}
              </p>
              <h3
                className="text-xl md:text-2xl font-medium text-[#1C1917] mb-3"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                {language === "en"
                  ? "And compared to the new coliving mega-residences?"
                  : "Et face aux nouvelles méga-résidences de coliving ?"}
              </h3>
              <p className="text-[#44403C] leading-relaxed">
                {language === "en" ? (
                  <>
                    Near Geneva, recent mega-colivings house up to 776 rooms in a
                    single building, with around 3,000 m² of shared spaces —{" "}
                    <strong>
                      less than 4 m² of common areas per resident
                    </strong>
                    . Here: {STATS.minResidentsPerHouse} to{" "}
                    {STATS.maxResidentsPerHouse} flatmates per house,{" "}
                    <strong>15 to 20 m² of indoor common areas each</strong>,
                    plus the gardens, terraces and pools. At a comparable price,
                    it's not the same product: there, you rent a studio in a
                    service tower; here, you share a house.
                  </>
                ) : (
                  <>
                    Près de Genève, les méga-colivings récents logent jusqu'à 776
                    chambres dans un même bâtiment, avec environ 3 000 m²
                    d'espaces partagés —{" "}
                    <strong>
                      soit moins de 4 m² d'espaces communs par résident
                    </strong>
                    . Chez nous : {STATS.minResidentsPerHouse} à{" "}
                    {STATS.maxResidentsPerHouse} colocataires par maison,{" "}
                    <strong>15 à 20 m² d'espaces communs intérieurs chacun</strong>,
                    plus les jardins, terrasses et piscines. À prix comparable, ce
                    n'est pas le même produit : là-bas tu loues un studio dans une
                    tour de services ; ici tu partages une maison.
                  </>
                )}
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* MOVE-IN FEES COMPARISON — Et les frais pour emménager ? */}
      <section className="py-20 bg-[#1C1917] border-t border-[#333]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A574]/20 text-[#E0BB8A] text-sm font-medium rounded-full mb-4">
              <Sparkles className="w-4 h-4" />{" "}
              {language === "en" ? "Move-in fees" : "Frais d'entrée"}
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              {language === "en"
                ? "At La Villa Coliving, zero move-in fees"
                : "À La Villa Coliving, 0 € de frais d'emménagement"}
            </h2>
            <p className="text-[#b3b2b2] max-w-2xl mx-auto">
              {language === "en"
                ? "The cost you're often only shown at the end. Here, there isn't one."
                : "Le coût qu'on ne te montre souvent qu'à la fin. Chez nous, il n'y en a pas."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Market — neutral, anonymous */}
            <div className="bg-[#1C1917] rounded-2xl p-8 border border-[#333]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#666]/20 flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#b3b2b2]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {language === "en"
                      ? "Most coliving or shared-housing operators"
                      : "Ailleurs sur le marché du coliving ou de la colocation"}
                  </h3>
                  <p className="text-sm text-[#b3b2b2]">
                    {language === "en"
                      ? "Fees before you get the key"
                      : "Des frais avant même la clé"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Application fee" : "Frais de dossier"}
                  </span>
                  <span>{language === "en" ? "€200 to €700" : "de 200 à 700 €"}</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Agency fee" : "Honoraires d'agence"}
                  </span>
                  <span>{language === "en" ? "depends on size" : "selon la surface"}</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Booking fee" : "Frais de réservation"}
                  </span>
                  <span>{language === "en" ? "at signing" : "à la signature"}</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Check-in fee" : "Frais d'état des lieux"}
                  </span>
                  <span>{language === "en" ? "extra" : "en supplément"}</span>
                </div>
              </div>

              <div className="border-t border-[#333] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#d5d5d5]">
                    {language === "en" ? "Total to move in" : "Total à l'entrée"}
                  </span>
                  <span className="text-2xl font-medium text-[#d5d5d5]">
                    {language === "en" ? "€200 to €700" : "de 200 à 700 €"}
                  </span>
                </div>
                <p className="text-xs text-[#a8a29e] mt-2">
                  {language === "en"
                    ? "(on top of the security deposit)"
                    : "(en plus du dépôt de garantie)"}
                </p>
              </div>
            </div>

            {/* La Villa — highlighted */}
            <div className="bg-white rounded-2xl p-8 relative overflow-hidden border border-[#E7E5E4] shadow-lg">
              <div className="absolute top-4 right-4 bg-[#D4A574] text-white text-xs font-bold px-3 py-1 rounded-full">
                {language === "en" ? "€0 TO MOVE IN" : "0 € À L'ENTRÉE"}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#FAF9F6] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#D4A574]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#1C1917]">
                    {language === "en" ? "At La Villa" : "Chez La Villa"}
                  </h3>
                  <p className="text-base text-[#57534E]">
                    {language === "en"
                      ? "Direct owner, no agency"
                      : "Propriétaire en direct, pas d'agence"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en" ? "Application fee" : "Frais de dossier"}
                  </span>
                  <span className="text-[#D4A574] font-bold">{language === "en" ? "€0" : "0 €"}</span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en" ? "Agency fee" : "Honoraires d'agence"}
                  </span>
                  <span className="text-[#D4A574] font-bold">{language === "en" ? "€0" : "0 €"}</span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en" ? "Booking fee" : "Frais de réservation"}
                  </span>
                  <span className="text-[#D4A574] font-bold">{language === "en" ? "€0" : "0 €"}</span>
                </div>
                <div className="flex justify-between text-[#44403C]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en" ? "Check-in fee" : "Frais d'état des lieux"}
                  </span>
                  <span className="text-[#D4A574] font-bold">{language === "en" ? "€0" : "0 €"}</span>
                </div>
              </div>

              <div className="border-t border-[#E7E5E4] pt-4">
                <span className="text-[#57534E] text-sm block mb-1">
                  {language === "en" ? "Total to move in" : "Total à l'entrée"}
                </span>
                <span className="text-lg font-bold text-[#1C1917]">
                  {language === "en"
                    ? "Your first month's rent + a refundable deposit. That's it."
                    : "Ton 1er loyer + une caution remboursable. C'est tout."}
                </span>
              </div>
            </div>
          </div>

          {/* Note + CTA */}
          <div className="mt-12 max-w-3xl mx-auto text-center">
            <p className="text-[#b3b2b2] leading-relaxed">
              {language === "en"
                ? "Not a promo — it's our model. We rent our houses directly, with no agency, so there are no move-in fees to charge."
                : "Pas une promo — notre modèle. On loue nos maisons en direct, sans agence : il n'y a donc aucun frais d'entrée à facturer."}
            </p>
            <LocalizedLink
              to="/candidature"
              onClick={() => trackCta("tarifs_mid")}
              className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-[#D4A574] text-white font-semibold rounded-lg hover:bg-[#E0BB8A] transition-colors duration-300"
            >
              {language === "en" ? "Apply — it's free" : "Candidater — c'est gratuit"}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            <p className="mt-5 text-sm">
              <LocalizedLink
                to={language === "en" ? "/en/blog/coliving-frais-dossier-geneve-annemasse" : "/blog/coliving-frais-dossier-geneve-annemasse"}
                className="text-[#D4A574] hover:text-[#E0BB8A] underline underline-offset-4 transition-colors"
              >
                {language === "en"
                  ? "Application fees in a flat-share: what the law allows →"
                  : "Frais de dossier en colocation : ce que dit la loi →"}
              </LocalizedLink>
            </p>
            <p className="mt-2 text-sm">
              <LocalizedLink
                to="/annemasse-colocation"
                className="text-[#D4A574] hover:text-[#E0BB8A] underline underline-offset-4 transition-colors"
              >
                {language === "en"
                  ? "Looking on the Annemasse side? Shared housing in Annemasse →"
                  : "Tu cherches côté Annemasse ? Colocation à Annemasse →"}
              </LocalizedLink>
            </p>
          </div>
        </div>
      </section>

      {/* Price Cards WITH IMAGES */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-[#1C1917] mb-4">
              {language === "en" ? "Our Houses" : "Nos Maisons"}
            </h2>
            <p className="text-[#57534E]">
              {language === "en"
                ? "Same premium experience, three unique locations"
                : "Même expérience premium, trois lieux uniques"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {houses.map((house, index) => (
              <div
                key={index}
                className="bg-white border border-[#E7E5E4] overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={house.image}
                    alt={house.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-medium mb-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {house.name}
                    </h3>
                    <p className="text-sm text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {house.location}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-[#57534E] text-sm mb-6">
                    {house.description}
                  </p>

                  <div className="mb-8">
                    {/* La Villa : 4 chambres sur 10 à salle d'eau partagée → plancher 1 370 */}
                    {house.name === "La Villa" && (
                      <span className="text-[#78716C] mr-1">
                        {language === "en" ? "from" : "dès"}
                      </span>
                    )}
                    <span className="text-4xl font-light text-[#D4A574]">
                      {house.name === "La Villa"
                        ? (language === "en" ? PRICE_SHARED_EN_NUM : PRICE_SHARED_FR_NUM)
                        : (language === "en" ? PRICE_EN_NUM : PRICE_FR_NUM)}
                    </span>
                    <span className="text-[#78716C]">
                      {" "}
                      CHF/{language === "en" ? "mo" : "mois"}
                    </span>
                  </div>

                  <LocalizedLink
                    to={`/${house.name.toLowerCase().replace(/\s+/g, "")}`}
                    className="block w-full py-4 bg-[#1C1917] text-white text-center font-bold hover:bg-[#D4A574] transition-colors"
                  >
                    {language === "en" ? "VIEW DETAILS" : "VOIR LES DÉTAILS"}
                  </LocalizedLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DETAILED SERVICES SECTION */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
              {language === "en" ? "Detailed Breakdown" : "Détail Complet"}
            </span>
            <h2
              className="text-4xl md:text-5xl font-light text-[#1C1917] mb-4"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en"
                ? "What's Really Included"
                : "Ce Qui Est Inclus"}
            </h2>
            <p className="text-lg text-[#57534E] max-w-2xl mx-auto">
              {language === "en"
                ? "Every detail of our all-inclusive service. No surprises, no hidden costs."
                : "Chaque détail de notre service tout-inclus. Pas de surprises, pas de frais cachés."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedServices.map((service, index) => (
              <div
                key={index}
                className="bg-[#FAF9F6] rounded-2xl p-8 border border-[#E7E5E4] hover:border-[#D4A574]/30 transition-colors"
              >
                <div className="w-10 h-10 bg-[#F5F2ED] rounded-xl flex items-center justify-center mb-4">
                  <Droplets className="w-5 h-5 text-[#44403C]" />
                </div>
                <h3 className="text-xl font-medium text-[#1C1917] mb-4">
                  {service.category}
                </h3>
                <ul className="space-y-3">
                  {service.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[#57534E]"
                    >
                      <Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included - Quick List */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
                {language === "en" ? "Quick Overview" : "Aperçu Rapide"}
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1C1917] mb-8"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                {language === "en"
                  ? "Everything You Need"
                  : "Tout Ce Dont Tu As Besoin"}
              </h2>
              <p className="text-lg text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "One monthly payment covers absolutely everything. No hidden costs, no surprise bills."
                  : "Un paiement mensuel couvre absolument tout. Pas de coûts cachés, pas de factures surprises."}
              </p>
            </div>

            <div className="space-y-4">
              {includedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white p-4 rounded-xl border border-[#E7E5E4]"
                >
                  <div className="w-6 h-6 bg-[#D4A574]/10 border border-[#D4A574] flex items-center justify-center flex-shrink-0 mt-0.5 rounded">
                    <Check className="w-4 h-4 text-[#D4A574]" />
                  </div>
                  <span className="text-[#1C1917] font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-px bg-[#E7E5E4]">
            <div className="bg-[#FAF9F6] p-10">
              <h3 className="text-xl font-medium text-[#1C1917] mb-4">
                {language === "en" ? "Security Deposit" : "Caution"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "We require a security deposit equivalent to two months' rent excluding charges (standard in France). It is returned in full within 30 days of move-out, minus any deductions for damages. Payment can be spread over the first 2 months. A refundable deposit, yes — non-refundable move-in fees, never."
                  : "Nous demandons une caution de deux mois de loyer hors charges (standard en France). Elle est restituée intégralement dans les 30 jours suivant le départ, déduction faite des éventuels dommages. Le paiement peut être étalé sur les 2 premiers mois. Une caution remboursable, oui — des frais d'entrée non remboursables, jamais."}
              </p>
            </div>
            <div className="bg-[#FAF9F6] p-10">
              <h3 className="text-xl font-medium text-[#1C1917] mb-4">
                {language === "en" ? "Direct owner, not an agency" : "Propriétaire, pas agence"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "We rent our houses directly, with no middleman. That's why there are no move-in fees to charge — and why what you see is what you pay, at move-in and every month."
                  : "Nous louons nos maisons en direct, sans intermédiaire. C'est pour ça qu'il n'y a aucun frais d'entrée à facturer — et que ce que tu vois est ce que tu paies, à l'entrée comme chaque mois."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof + colocation-geneve link */}
      <section className="py-16 bg-white border-t border-[#E7E5E4]">
        <div className="container-custom max-w-3xl text-center">
          <p className="text-[#57534E] italic text-lg mb-2">
            {language === "en"
              ? `"I was paying CHF 2,200 for a tiny studio in Geneva. Here everything's included — pool, gym, and an amazing community."`
              : `"Je payais 2 200 CHF pour un petit studio à Genève. Ici, tout est inclus — piscine, gym et une communauté incroyable."`}
          </p>
          <p className="text-sm text-[#78716C] mb-6">
            — Marie L., {language === "en" ? "Consultant, cross-border worker" : "Consultante, frontalière"}
          </p>
          <LocalizedLink
            to={colocGeneveHref(language)}
            className="inline-flex items-center gap-2 text-[#D4A574] font-medium hover:underline"
          >
            {language === "en" ? "Learn more about shared housing near Geneva" : "En savoir plus sur la colocation près de Genève"}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>
      </section>

      <FaqSection
        title={language === "en" ? "Pricing — frequently asked questions" : "Questions fréquentes sur les tarifs"}
        items={tarifsFaq[language === "en" ? "en" : "fr"]}
        emitSchema
      />

      {/* CTA */}
      <section className="py-24 bg-[#D4A574]">
        <div className="container-custom text-center">
          <h2
            className="text-3xl md:text-4xl font-light text-white mb-4"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Ready to Save & Join?"
              : "Prêt à Économiser & Nous Rejoindre ?"}
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            {(() => {
              const now = new Date();
              const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
              const monthFr = next.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
              const monthEn = next.toLocaleDateString("en-US", { month: "long", year: "numeric" });
              return language === "en"
                ? `Save ${MONTHLY_SAVINGS_CHF} CHF/month and join ${STATS.totalResidents}+ happy residents. Limited spots for ${monthEn}.`
                : `Économise ${MONTHLY_SAVINGS_CHF} CHF/mois et rejoins ${STATS.totalResidents}+ résidents heureux. Places limitées pour ${monthFr}.`;
            })()}
          </p>
          <LocalizedLink
            to="/candidature"
            onClick={() => trackCta("tarifs_footer")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#D4A574] font-bold hover:bg-[#1C1917] hover:text-white transition-colors"
          >
            {language === "en" ? "APPLY NOW" : "CANDIDATER"}
            <ArrowRight className="w-5 h-5" />
          </LocalizedLink>
        </div>
      </section>
      {/* R3 (checkpoint 21/08) : canal court sur une page d'entrée — pas sur /candidature (71 % de complétion, on ne détourne pas). */}
      <WhatsAppButton context={language === "en" ? "Rates" : "Tarifs"} />
    </main>
  );
}
