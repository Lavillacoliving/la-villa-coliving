import { useState } from "react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { colocGeneveHref } from "@/lib/siteLinks";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData, faqCategories } from "@/data/faqData";
import { Search, MessageCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PRICE_CHF_FR, PRICE_CHF_EN } from "@/data/stats";

export function FAQPageV4() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter FAQ based on search and category
  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.question[language]
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.answer[language].toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === null || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Group FAQ by category
  const groupedFAQ = filteredFAQ.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof faqData>,
  );

  // Map English category keys to localized display names
  const categoryDisplayName = (categoryKey: string): string => {
    const enIndex = faqCategories.en.indexOf(categoryKey);
    if (enIndex !== -1) return faqCategories[language][enIndex];
    return categoryKey;
  };

  return (
    <main className="relative pt-16">
      <SEO
        title={language === "en" ? "FAQ — Your Questions About Coliving" : "FAQ — Vos Questions sur le Coliving"}
        description={language === "en"
          ? "Answers to all your questions about La Villa Coliving: pricing, duration, community, amenities, application process."
          : "Réponses à toutes vos questions sur La Villa Coliving : prix, durée, communauté, équipements, processus de candidature."}
        url="https://www.lavillacoliving.com/faq"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((item) => ({
              "@type": "Question",
              name: item.question[language],
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer[language],
              },
            })),
          })}
        </script>
      </Helmet>
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "Help Center" : "Centre d'Aide"}
          </span>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-light text-[#1C1917] mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? (
              <>
                FAQ — Coliving &amp; shared housing near Geneva
              </>
            ) : (
              <>
                FAQ — Coliving &amp; colocation près de Genève
              </>
            )}
          </h1>
          <p className="text-lg text-[#57534E] max-w-2xl mx-auto mb-10">
            {language === "en"
              ? "Everything you need to know about life at La Villa."
              : "Tout ce que tu dois savoir sur la vie à La Villa."}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78716C]" />
            <input
              type="text"
              placeholder={
                language === "en"
                  ? "Search questions..."
                  : "Rechercher des questions..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors text-[#1C1917]"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-xs uppercase tracking-widest text-[#78716C] mb-6">
                  {language === "en"
                    ? "Browse by Category"
                    : "Parcourir par Catégorie"}
                </h3>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`w-full text-left px-5 py-4 border transition-all ${
                      activeCategory === null
                        ? "border-[#D4A574] bg-[#D4A574] text-white"
                        : "border-[#E7E5E4] text-[#57534E] hover:border-[#1C1917] hover:text-[#1C1917]"
                    }`}
                  >
                    {language === "en"
                      ? "All Questions"
                      : "Toutes les Questions"}
                  </button>
                  {faqCategories.en.map((categoryKey, index) => (
                    <button
                      key={categoryKey}
                      onClick={() => setActiveCategory(categoryKey)}
                      className={`w-full text-left px-5 py-4 border transition-all ${
                        activeCategory === categoryKey
                          ? "border-[#D4A574] bg-[#D4A574] text-white"
                          : "border-[#E7E5E4] text-[#57534E] hover:border-[#1C1917] hover:text-[#1C1917]"
                      }`}
                    >
                      {faqCategories[language][index]}
                    </button>
                  ))}
                </nav>

                {/* Colocation Genève link — SEO maillage */}
                <LocalizedLink
                  to={colocGeneveHref(language)}
                  className="mt-8 block p-6 bg-[#FAF9F6] border border-[#E7E5E4] hover:border-[#D4A574]/40 transition-colors group"
                >
                  <h4 className="font-medium text-[#1C1917] mb-2 group-hover:text-[#D4A574] transition-colors">
                    {language === "en"
                      ? "Shared Housing Geneva"
                      : "Colocation Genève"}
                  </h4>
                  <p className="text-sm text-[#57534E]">
                    {language === "en"
                      ? `29 furnished rooms, all-inclusive from ${PRICE_CHF_EN}/mo. See the full guide →`
                      : `29 chambres meublées, tout inclus dès ${PRICE_CHF_FR}/mois. Voir le guide complet →`}
                  </p>
                </LocalizedLink>

                {/* Frais d'entrée article — SEO maillage */}
                <LocalizedLink
                  to={language === "en" ? "/en/blog/coliving-frais-dossier-geneve-annemasse" : "/blog/coliving-frais-dossier-geneve-annemasse"}
                  className="mt-4 block p-6 bg-[#FAF9F6] border border-[#E7E5E4] hover:border-[#D4A574]/40 transition-colors group"
                >
                  <h4 className="font-medium text-[#1C1917] mb-2 group-hover:text-[#D4A574] transition-colors">
                    {language === "en"
                      ? "Move-in fees explained"
                      : "Frais d'entrée : le guide"}
                  </h4>
                  <p className="text-sm text-[#57534E]">
                    {language === "en"
                      ? "Application, agency, booking fees: what the law allows and how to move in for €0. Read the guide →"
                      : "Frais de dossier, agence, réservation : ce que dit la loi et comment emménager pour 0 €. Lire le guide →"}
                  </p>
                </LocalizedLink>

                {/* Contact CTA */}
                <div className="mt-4 p-6 bg-white border border-[#E7E5E4]">
                  <MessageCircle className="w-6 h-6 text-[#D4A574] mb-4" />
                  <h4 className="font-medium text-[#1C1917] mb-2">
                    {language === "en"
                      ? "Still have questions?"
                      : "Encore des questions ?"}
                  </h4>
                  <p className="text-sm text-[#57534E] mb-4">
                    {language === "en"
                      ? "Can't find what you're looking for? Reach out—we're happy to help."
                      : "Vous ne trouvez pas ce que vous cherchez ? Contactez-nous."}
                  </p>
                  <a
                    href="mailto:hello@lavillacoliving.com"
                    className="text-[#D4A574] font-medium hover:underline"
                  >
                    {language === "en" ? "Contact us" : "Contacte-nous"}
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Lists */}
            <div className="lg:col-span-3 space-y-12">
              {searchQuery && filteredFAQ.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#57534E]">
                    {language === "en"
                      ? "No questions found matching your search."
                      : "Aucune question trouvée correspondant à ta recherche."}
                  </p>
                </div>
              ) : (
                Object.entries(groupedFAQ).map(([category, items]) => (
                  <div
                    key={category}
                    id={category.toLowerCase().replace(/\s+/g, "-")}
                  >
                    <h2
                      className="text-2xl font-light text-[#1C1917] mb-6"
                      style={{ fontFamily: "DM Serif Display, serif" }}
                    >
                      {categoryDisplayName(category)}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-">
                      {items.map((item) => (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className="bg-white border border-[#E7E5E4] px-6"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-5 text-[#1C1917] font-medium">
                            {item.question[language]}
                          </AccordionTrigger>
                          <AccordionContent className="text-[#57534E] pb-5 leading-relaxed">
                            {item.answer[language]}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
