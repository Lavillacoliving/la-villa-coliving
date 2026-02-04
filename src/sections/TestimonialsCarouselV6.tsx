import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 6: CHALEUR + PREMIUM + MODERNITÉ
 * Testimonials carousel avec design chaud et premium
 */

export function TestimonialsCarouselV6() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sophie M.',
      role: language === 'en' ? 'Product Designer' : 'Designer Produit',
      location: 'Geneva',
      quote: language === 'en'
        ? 'La Villa completely changed my experience of moving to a new city. Within days, I had a group of friends and felt at home.'
        : 'La Villa a complètement changé mon expérience de déménagement dans une nouvelle ville. En quelques jours, j\'avais un groupe d\'amis et je me sentais chez moi.',
      avatar: 'S',
    },
    {
      name: 'Thomas L.',
      role: language === 'en' ? 'Software Engineer' : 'Ingénieur Logiciel',
      location: 'Lausanne',
      quote: language === 'en'
        ? 'The best decision I made this year. Beautiful house, amazing people, and everything is taken care of. I can focus on my work and enjoy life.'
        : 'La meilleure décision que j\'ai prise cette année. Belle maison, gens incroyables, et tout est pris en charge. Je peux me concentrer sur mon travail et profiter de la vie.',
      avatar: 'T',
    },
    {
      name: 'Marie K.',
      role: language === 'en' ? 'Marketing Manager' : 'Responsable Marketing',
      location: 'Annecy',
      quote: language === 'en'
        ? 'I was skeptical about coliving at first, but La Villa exceeded all my expectations. The community is genuine and the spaces are stunning.'
        : 'J\'étais sceptique sur le coliving au début, mais La Villa a dépassé toutes mes attentes. La communauté est authentique et les espaces sont magnifiques.',
      avatar: 'M',
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
    <section className="py-24 bg-[#3d3632] relative overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#c4705a]/10 to-transparent" />
      
      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#5a524d] text-[#c4705a] text-xs uppercase tracking-[0.25em] font-medium rounded-full mb-6">
            {language === 'en' ? 'Testimonials' : 'Témoignages'}
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-white">
            {language === 'en' ? 'What Our' : 'Ce Que Nos'}
            <span className="font-medium text-[#c4705a]"> {language === 'en' ? 'Residents Say' : 'Résidents Disent'}</span>
          </h2>
        </div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote icon */}
            <Quote className="absolute -top-4 left-0 w-12 h-12 text-[#c4705a]/30" />
            
            {/* Testimonial content */}
            <div className="text-center px-8 md:px-16">
              <p className="text-xl md:text-2xl text-[#c4bbb3] leading-relaxed mb-10 italic">
                "{testimonials[currentIndex].quote}"
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#c4705a] flex items-center justify-center text-white font-medium text-lg">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">{testimonials[currentIndex].name}</div>
                  <div className="text-[#8a817a] text-sm">
                    {testimonials[currentIndex].role} • {testimonials[currentIndex].location}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-[#5a524d] flex items-center justify-center text-[#c4bbb3] hover:border-[#c4705a] hover:text-[#c4705a] transition-all duration-300"
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
                        ? 'w-8 bg-[#c4705a]' 
                        : 'bg-[#5a524d] hover:bg-[#8a817a]'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-[#5a524d] flex items-center justify-center text-[#c4bbb3] hover:border-[#c4705a] hover:text-[#c4705a] transition-all duration-300"
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
