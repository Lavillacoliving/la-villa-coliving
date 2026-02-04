import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqData, faqCategories } from '@/data/faqData';
import { Search, MessageCircle } from 'lucide-react';

export function FAQPage() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter FAQ based on search and category
  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      item.question[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer[language].toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === null || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group FAQ by category
  const groupedFAQ = filteredFAQ.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof faqData>);

  const categories = faqCategories[language];

  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white">
        {/* Pop Colorful Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-radial from-[#10b981]/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-[#f97316]/10 blob hidden lg:block" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#f43f5e]/8 blob-reverse hidden lg:block" />
        
        <div className="container-custom relative text-center">
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl mb-6 text-[#0f172a]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {t.faqPage.hero.title}
          </h1>
          <p className="text-xl text-[#475569] mb-8 font-medium">
            {t.faqPage.hero.subtitle}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.faqPage.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-[#10b981] focus:outline-none transition-colors text-[#0f172a]"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding relative bg-[#f8fafc]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-lg font-extrabold mb-6 text-[#0f172a]">
                  {t.faqPage.categories.title}
                </h3>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${
                      activeCategory === null
                        ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-sharp'
                        : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white hover:shadow-sharp'
                    }`}
                  >
                    {language === 'en' ? 'All Questions' : 'Toutes les Questions'}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${
                        activeCategory === category
                          ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-sharp'
                          : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white hover:shadow-sharp'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </nav>

                {/* Contact CTA */}
                <div className="mt-8 p-6 bg-white rounded-2xl shadow-sharp">
                  <MessageCircle className="w-8 h-8 text-[#f97316] mb-4" />
                  <h4 className="font-bold text-[#0f172a] mb-2">
                    {language === 'en' ? 'Still have questions?' : 'Encore des questions ?'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {t.faqPage.hero.contact}
                  </p>
                  <a
                    href="mailto:hello@lavillacoliving.com"
                    className="inline-flex items-center text-[#10b981] font-bold hover:underline"
                  >
                    {language === 'en' ? 'Contact us' : 'Contactez-nous'}
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Lists */}
            <div className="lg:col-span-3 space-y-12">
              {searchQuery && filteredFAQ.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'No questions found matching your search.' 
                      : 'Aucune question trouvée correspondant à votre recherche.'}
                  </p>
                </div>
              ) : (
                Object.entries(groupedFAQ).map(([category, items]) => (
                  <div key={category} id={category.toLowerCase().replace(/\s+/g, '-')}>
                    <h2 
                      className="text-2xl font-black mb-6 text-[#0f172a]"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      {category}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {items.map((item) => (
                        <AccordionItem 
                          key={item.id} 
                          value={item.id}
                          className="card-ultra px-6 border-none"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-5 text-[#0f172a] font-extrabold">
                            {item.question[language]}
                          </AccordionTrigger>
                          <AccordionContent className="text-[#475569] pb-5 leading-relaxed font-medium">
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
