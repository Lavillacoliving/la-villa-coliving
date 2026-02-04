import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  quoteFr: string;
  author: string;
  age: number;
  role: string;
  roleFr: string;
  house: string;
  duration: string;
  durationFr: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "One of the best coliving experiences of my life. I arrived knowing no one and left with a family.",
    quoteFr: "Une des meilleures expériences de coliving de ma vie. Je suis arrivé ne connaissant personne et je suis parti avec une famille.",
    author: "Louise",
    age: 27,
    role: "Marketing Manager",
    roleFr: "Responsable Marketing",
    house: "La Villa",
    duration: "18 months",
    durationFr: "18 mois",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    quote: "When I told my family I was going to live with 10 other people, they were skeptical. La Villa exceeded all my expectations.",
    quoteFr: "Quand j'ai dit à ma famille que j'allais habiter avec 10 autres personnes, ils étaient sceptiques. La Villa a dépassé toutes mes attentes.",
    author: "Carla",
    age: 29,
    role: "UX Designer",
    roleFr: "Designer UX",
    house: "Le Loft",
    duration: "12 months",
    durationFr: "12 mois",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
  {
    quote: "La Villa is not just a living experience, it's building a second family. I've never felt so supported.",
    quoteFr: "La Villa, ce n'est pas simplement une expérience de vie, c'est aussi construire une deuxième famille.",
    author: "Marcus",
    age: 32,
    role: "Software Engineer",
    roleFr: "Ingénieur Logiciel",
    house: "La Villa",
    duration: "24 months",
    durationFr: "24 mois",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    quote: "Pure gold for expats! The chance to build a network in Geneva and meet people who become friends.",
    quoteFr: "De l'or pur pour les expats ! La chance de se faire un réseau à Genève et de rencontrer des amis.",
    author: "Akira",
    age: 31,
    role: "Consultant",
    roleFr: "Consultant",
    house: "Le Loft",
    duration: "8 months",
    durationFr: "8 mois",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
];

export function TestimonialsCarouselV4() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 lg:py-32 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs text-[#666] uppercase tracking-[0.3em] mb-4 block">
            {language === 'en' ? 'Testimonials' : 'Témoignages'}
          </span>
          <h2 
            className="text-4xl md:text-5xl font-light text-white"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' ? 'What Our' : 'Ce Que Nos'}
            <br />
            <span className="font-medium text-[#c44536]">{language === 'en' ? 'Members Say' : 'Membres Disent'}</span>
          </h2>
        </div>

        {/* Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-square max-w-md">
              <div className="absolute -inset-4 border border-[#333]" />
              <img
                src={currentTestimonial.image}
                alt={currentTestimonial.author}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <Quote className="w-10 h-10 text-[#c44536] mb-6" />
              
              <blockquote className="text-2xl md:text-3xl text-white font-light leading-relaxed mb-8">
                "{language === 'en' ? currentTestimonial.quote : currentTestimonial.quoteFr}"
              </blockquote>

              <div className="flex items-center gap-4 mb-8">
                <div>
                  <div className="text-white font-medium">{currentTestimonial.author}, {currentTestimonial.age}</div>
                  <div className="text-[#666] text-sm">
                    {language === 'en' ? currentTestimonial.role : currentTestimonial.roleFr} · {currentTestimonial.house}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 border border-[#333] flex items-center justify-center text-white hover:border-[#c44536] hover:text-[#c44536] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 border border-[#333] flex items-center justify-center text-white hover:border-[#c44536] hover:text-[#c44536] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-[#666] text-sm ml-4">
                  {currentIndex + 1} / {testimonials.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
