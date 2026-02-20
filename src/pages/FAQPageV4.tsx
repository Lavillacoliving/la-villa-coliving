import { useState } from "react";
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
    <main className="relative pt-20">
      <SEO
        title={language === "en" ? "FAQ — Coliving Near Geneva" : "FAQ — Colocation & Coliving près de Genève"}
        description={language === "en"
          ? "Answers to common questions about coliving at La Villa near Geneva: pricing, move-in process, services included, transport to Geneva, community life."
          : "Réponses aux questions fréquentes sur la colocation à La Villa près de Genève : tarifs, emménagement, services inclus, transport vers Genève, vie communautaire."}
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
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1C1917] mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? (
              <>
                Questions<span className="text-[#44403C]">?</span>
              </>
            ) : (
              <>
                Des Questions<span className="text-[#44403C]">?</span>
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

                {/* Contact CTA */}
                <div className="mt-8 p-6 bg-white border border-[#E7E5E4]">
                  <MessageCircle className="w-6 h-6 text-[#D4A574] mb-4" />
                  <h4 className="font-medium text-[#1C1917] mb-2">
                    {language === "en"
                      ? "Still have questions?"
                      : "Encore des questions ?"}
                  </h4>
                  <p className="text-sm text-[#57534E] mb-4">
                    {language === "en"
                      ? "Can't find what you're looking for? Reach out—we're happy to help."
                      : "Tu ne trouves pas ce que tu cherches ? Contacte-nous."}
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
