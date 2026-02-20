import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 9: STONE & BRASS — CONDO PREMIUM
 * Testimonials — cream bg, brass quote marks, neutral avatars
 */

export function TestimonialsCarouselV7() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Gary',
      role: 'Résident depuis janvier 2026',
      location: 'Le Lodge',
      subtitle: 'Moved back from the US',
      quote: 'The space looks perfect. I recently moved back home to Europe after working in the US. Will be pursuing a new career and think the space would be an amazing opportunity to build a new community and start a new chapter.',
      initials: 'G',
    },
    {
      name: 'Aude',
      role: 'Résidente depuis juillet 2025',
      location: 'La Villa',
      subtitle: "Aujourd'hui au Lodge",
      quote: "L'emplacement est vraiment top, et les colocs ont l'air très sympas, ça donne envie !",
      initials: 'A',
    },
    {
      name: 'Marcos',
      role: 'Résident depuis décembre 2024',
      location: 'Le Loft',
      subtitle: '',
      quote: 'Je me sentais déjà chez moi !',
      initials: 'M',
    },
    {
      name: 'Gary',
      role: 'Résident depuis janvier 2026',
      location: 'Le Lodge',
      subtitle: 'Soirée inter-maisons',
      quote: 'Thank you so much for organizing the soirée pizza last night, I really enjoyed it, and it was great to spend time with everyone from all the residences.',
      initials: 'G',
    },
    {
      name: 'Florian',
      role: 'Résident depuis plus de 2 ans',
      location: 'La Villa',
      subtitle: '',
      quote: 'C\'était vraiment vraiment super 🫶',
      initials: 'F',
    },
    {
      name: 'Marcos',
      role: 'Résident depuis décembre 2024',
      location: 'Le Loft',
      subtitle: 'After work inter-maisons',
      quote: 'Merci pour l\'after work c\'était génial ✨',
      initials: 'M',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-[#FAF9F6]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[13px] font-semibold tracking-wider uppercase text-[#78716C] mb-5 block">
            {language === 'en' ? 'TESTIMONIALS' : 'TÉMOIGNAGES'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] tracking-tight">
            {language === 'en' ? 'What our residents say' : 'Ce qu\'en disent nos résidents'}
          </h2>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E7E5E4] p-8 md:p-12">
            {/* Decorative quote mark */}
            <div className="flex justify-center mb-6">
              <Quote className="w-10 h-10 text-[#D4A574]" />
            </div>

            {/* Testimonial text */}
            <p className="text-lg md:text-xl text-[#44403C] leading-relaxed text-center italic mb-8">
              "{testimonials[currentIndex].quote}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5F2ED] flex items-center justify-center text-[#44403C] text-sm font-semibold">
                {testimonials[currentIndex].initials}
              </div>
              <div>
                <div className="text-[#1C1917] font-semibold">{testimonials[currentIndex].name}</div>
                <div className="text-[#78716C] text-sm">
                  {testimonials[currentIndex].location} &bull; {testimonials[currentIndex].role}
                </div>
                {testimonials[currentIndex].subtitle && (
                  <div className="text-[#D4A574] text-xs mt-0.5">
                    {testimonials[currentIndex].subtitle}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-lg border border-[#E7E5E4] flex items-center justify-center text-[#78716C] hover:border-[#44403C] hover:text-[#1C1917] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#44403C] focus-visible:ring-offset-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#44403C] focus-visible:ring-offset-2 ${
                    index === currentIndex
                      ? 'w-8 bg-[#D4A574]'
                      : 'w-2 bg-[#E7E5E4] hover:bg-[#78716C]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-lg border border-[#E7E5E4] flex items-center justify-center text-[#78716C] hover:border-[#44403C] hover:text-[#1C1917] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#44403C] focus-visible:ring-offset-2"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
