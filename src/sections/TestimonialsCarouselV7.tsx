import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 7: PREMIUM + FACTUEL
 * Testimonials — emojis supprimés des quotes, vouvoiement
 */

export function TestimonialsCarouselV7() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sophie',
      role: language === 'en' ? 'Product Designer' : 'Designer Produit',
      location: 'Geneva',
      quote: language === 'en'
        ? 'Moved in solo, left with a family. La Villa is more than a house — it\'s a real community.'
        : 'Arrivée seule, partie avec une famille. La Villa, c\'est plus qu\'une maison — c\'est une vraie communauté.',
      avatar: 'S',
      color: 'from-[#7c9a6d] to-[#a8c5d9]',
    },
    {
      name: 'Thomas',
      role: language === 'en' ? 'Software Engineer' : 'Ingénieur Logiciel',
      location: 'Paris',
      quote: language === 'en'
        ? 'Best WiFi I\'ve had in any coliving. Plus the people are genuinely interesting.'
        : 'Meilleur WiFi que j\'ai eu en coliving. Et les gens sont vraiment intéressants.',
      avatar: 'T',
      color: 'from-[#d4897a] to-[#7c9a6d]',
    },
    {
      name: 'Marie',
      role: language === 'en' ? 'Marketing Manager' : 'Responsable Marketing',
      location: 'Brussels',
      quote: language === 'en'
        ? 'Finally a place where I can work, relax, and make real friends. A true game changer.'
        : 'Enfin un endroit où je peux travailler, me relaxer et me faire de vrais amis. Un vrai changement de vie.',
      avatar: 'M',
      color: 'from-[#a8c5d9] to-[#d4897a]',
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
    <section className="py-24 bg-[#3d4a38] relative overflow-hidden">
      {/* Organic shapes */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#7c9a6d]/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4897a]/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#7c9a6d]/20 text-[#7c9a6d] text-sm font-medium rounded-full mb-6">
            {language === 'en' ? 'What they say' : 'Ce qu\'ils disent'}
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-white">
            {language === 'en' ? 'Real people,' : 'De vraies personnes,'}
            <span className="font-medium text-[#7c9a6d]"> {language === 'en' ? 'real stories' : 'vraies histoires'}</span>
          </h2>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Testimonial content */}
            <div className="text-center px-8 md:px-16">
              {/* Avatar */}
              <div className={`w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br ${testimonials[currentIndex].color} flex items-center justify-center text-white text-2xl font-medium shadow-lg`}>
                {testimonials[currentIndex].avatar}
              </div>

              <p className="text-xl md:text-2xl text-[#c8d4c0] leading-relaxed mb-8">
                "{testimonials[currentIndex].quote}"
              </p>

              <div>
                <div className="text-white font-medium">{testimonials[currentIndex].name}</div>
                <div className="text-[#8a9a80] text-sm">
                  {testimonials[currentIndex].role} &bull; {testimonials[currentIndex].location}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-[#7c9a6d]/30 flex items-center justify-center text-[#a8b5a0] hover:border-[#7c9a6d] hover:text-[#7c9a6d] transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-[#7c9a6d]'
                        : 'bg-[#5a6b52] hover:bg-[#7c8a72]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-[#7c9a6d]/30 flex items-center justify-center text-[#a8b5a0] hover:border-[#7c9a6d] hover:text-[#7c9a6d] transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
