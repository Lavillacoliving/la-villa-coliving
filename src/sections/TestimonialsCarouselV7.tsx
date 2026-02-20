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
      role: language === 'en' ? 'Resident for 2 years' : 'Résident depuis 2 ans',
      location: 'La Villa',
      quote: language === 'en'
        ? 'What I love is the balance between privacy and community. I have my own space, but there\'s always someone to share a meal or a laugh with.'
        : 'Ce que j\'aime, c\'est l\'équilibre entre intimité et vie en communauté. J\'ai mon espace, mais il y a toujours quelqu\'un pour partager un repas ou un fou rire.',
      initials: 'G',
    },
    {
      name: 'Aude',
      role: language === 'en' ? 'Resident for 1 year' : 'Résidente depuis 1 an',
      location: 'Le Loft',
      quote: language === 'en'
        ? 'Moving into Le Loft was the best decision of my move to Geneva. Everything is taken care of, I just enjoy living here.'
        : 'Emménager au Loft a été la meilleure décision de mon installation à Genève. Tout est pris en charge, je profite juste de la vie ici.',
      initials: 'A',
    },
    {
      name: 'Ines',
      role: language === 'en' ? 'Resident for 6 months' : 'Résidente depuis 6 mois',
      location: 'La Villa',
      quote: language === 'en'
        ? 'Pool, sauna, gym, yoga... and above all, an incredible community. It\'s nothing like what you\'d imagine for a shared house.'
        : 'Piscine, sauna, sport, yoga… et surtout une communauté incroyable. Ça n\'a rien à voir avec ce qu\'on imagine d\'une colocation.',
      initials: 'I',
    },
    {
      name: 'Florian',
      role: language === 'en' ? 'Resident for 1.5 years' : 'Résident depuis 1 an et demi',
      location: 'Le Lodge',
      quote: language === 'en'
        ? 'I work in Geneva and live 20 min away in a house with pool, gym, and incredible people. My colleagues can\'t believe it.'
        : 'Je travaille à Genève et je vis à 20 min dans une maison avec piscine, salle de sport et des gens incroyables. Mes collègues n\'en reviennent pas.',
      initials: 'F',
    },
    {
      name: 'Marcos',
      role: language === 'en' ? 'Resident for 8 months' : 'Résident depuis 8 mois',
      location: 'Le Loft',
      quote: language === 'en'
        ? 'The indoor pool sold me, but the community made me stay. This is a whole lifestyle, not just a room.'
        : 'La piscine intérieure m\'a convaincu, mais c\'est la communauté qui m\'a fait rester. C\'est un vrai mode de vie, pas juste une chambre.',
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
