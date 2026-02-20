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

  {/* TODO: remplacer par vrais témoignages — voir avis Google ou WhatsApp */}
  const testimonials = [
    {
      name: 'Claire',
      role: language === 'en' ? 'Resident' : 'Résidente',
      location: 'Le Loft',
      quote: language === 'en'
        ? 'What convinced me was the size. 10 people in a house with a pool — you won\'t find that anywhere else.'
        : 'Ce qui m\'a convaincue, c\'est la taille. 10 personnes dans une maison avec piscine — ça n\'existe nulle part ailleurs.',
      initials: 'C',
    },
    {
      name: 'Marc',
      role: language === 'en' ? 'Resident' : 'Résident',
      location: 'La Villa',
      quote: language === 'en'
        ? 'After two years of regular coliving, La Villa is a different world. The space, the amenities, the community — everything is different.'
        : 'Après deux ans de coliving classique, La Villa c\'est un autre monde. L\'espace, les équipements, la communauté — tout est différent.',
      initials: 'M',
    },
    {
      name: 'Laura',
      role: language === 'en' ? 'Resident' : 'Résidente',
      location: 'Le Lodge',
      quote: language === 'en'
        ? 'I work in Geneva and live in a house with a garden, pool, and sauna for CHF 1,380. My colleagues can\'t believe it.'
        : 'Je travaille à Genève et je vis dans une maison avec jardin, piscine et sauna pour 1 380 CHF. Mes collègues n\'en reviennent pas.',
      initials: 'L',
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
                  {testimonials[currentIndex].role} &bull; {testimonials[currentIndex].location}
                </div>
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
