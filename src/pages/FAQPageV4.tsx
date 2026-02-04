import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData, faqCategories } from "@/data/faqData";
import { Search, MessageCircle } from "lucide-react";

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

  const categories = faqCategories[language];

  return (
    <main className="relative pt-20">
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "Help Center" : "Centre d'Aide"}
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1a1a1a] mb-6"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {language === "en" ? (
              <>
                Questions<span className="text-[#a02c1f]">?</span>
              </>
            ) : (
              <>
                Des Questions<span className="text-[#a02c1f]">?</span>
              </>
            )}
          </h1>
          <p className="text-lg text-[#666] max-w-2xl mx-auto mb-10">
            {language === "en"
              ? "Everything you need to know about life at La Villa."
              : "Tout ce que vous devez savoir sur la vie à La Villa."}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" />
            <input
              type="text"
              placeholder={
                language === "en"
                  ? "Search questions..."
                  : "Rechercher des questions..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-[#e5e5e5] focus:border-[#c44536] focus:outline-none transition-colors text-[#1a1a1a]"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-xs uppercase tracking-widest text-[#999] mb-6">
                  {language === "en"
                    ? "Browse by Category"
                    : "Parcourir par Catégorie"}
                </h3>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`w-full text-left px-5 py-4 border transition-all ${
                      activeCategory === null
                        ? "border-[#c44536] bg-[#c44536] text-white"
                        : "border-[#e5e5e5] text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                    }`}
                  >
                    {language === "en"
                      ? "All Questions"
                      : "Toutes les Questions"}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-5 py-4 border transition-all ${
                        activeCategory === category
                          ? "border-[#c44536] bg-[#c44536] text-white"
                          : "border-[#e5e5e5] text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </nav>

                {/* Contact CTA */}
                <div className="mt-8 p-6 bg-white border border-[#e5e5e5]">
                  <MessageCircle className="w-6 h-6 text-[#c44536] mb-4" />
                  <h4 className="font-medium text-[#1a1a1a] mb-2">
                    {language === "en"
                      ? "Still have questions?"
                      : "Encore des questions ?"}
                  </h4>
                  <p className="text-sm text-[#666] mb-4">
                    {language === "en"
                      ? "Can't find what you're looking for? Reach out—we're happy to help."
                      : "Vous ne trouvez pas ce que vous cherchez ? Contactez-nous."}
                  </p>
                  <a
                    href="mailto:hello@lavillacoliving.com"
                    className="text-[#c44536] font-medium hover:underline"
                  >
                    {language === "en" ? "Contact us" : "Contactez-nous"}
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Lists */}
            <div className="lg:col-span-3 space-y-12">
              {searchQuery && filteredFAQ.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#666]">
                    {language === "en"
                      ? "No questions found matching your search."
                      : "Aucune question trouvée correspondant à votre recherche."}
                  </p>
                </div>
              ) : (
                Object.entries(groupedFAQ).map(([category, items]) => (
                  <div
                    key={category}
                    id={category.toLowerCase().replace(/\s+/g, "-")}
                  >
                    <h2
                      className="text-2xl font-light text-[#1a1a1a] mb-6"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {category}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-">
                      {items.map((item) => (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className="bg-white border border-[#e5e5e5] px-6"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-5 text-[#1a1a1a] font-medium">
                            {item.question[language]}
                          </AccordionTrigger>
                          <AccordionContent className="text-[#666] pb-5 leading-relaxed">
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
