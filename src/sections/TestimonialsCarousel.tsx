import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

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
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "One of the best coliving experiences of my life. I arrived knowing no one and left with a family. The curated community makes all the difference.",
    quoteFr: "Une des meilleures expériences de coliving de ma vie. Je suis arrivé ne connaissant personne et je suis parti avec une famille. La communauté sélectionnée fait toute la différence.",
    author: "Louise",
    age: 27,
    role: "Marketing Manager",
    roleFr: "Responsable Marketing",
    house: "La Villa",
    duration: "18 months",
    durationFr: "18 mois",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    quote: "When I told my family I was going to live with 10 other people, they were curious and a bit skeptical. Honestly, I was a little scared at first. But La Villa exceeded all my expectations.",
    quoteFr: "Quand j'ai dit à ma famille que j'allais habiter avec 10 autres personnes, ils étaient curieux et un peu sceptiques. Honnêtement, j'ai eu un peu peur au début. Mais La Villa a dépassé toutes mes attentes.",
    author: "Carla",
    age: 29,
    role: "UX Designer",
    roleFr: "Designer UX",
    house: "Le Loft",
    duration: "12 months",
    durationFr: "12 mois",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
  {
    quote: "La Villa is not just a living experience, it's building a second family. My housemates are my second family. I've never felt so supported and connected.",
    quoteFr: "La Villa, ce n'est pas simplement une expérience de vie, c'est aussi construire une deuxième famille. Mes colocataires sont ma deuxième famille. Je ne me suis jamais senti aussi soutenu et connecté.",
    author: "Marcus",
    age: 32,
    role: "Software Engineer",
    roleFr: "Ingénieur Logiciel",
    house: "La Villa",
    duration: "24 months",
    durationFr: "24 mois",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    quote: "La Villa is the chance to build a network in Geneva, meet people who become friends, and connect with profiles I would never have met otherwise. Pure gold for expats!",
    quoteFr: "La Villa, c'est la chance de se faire un réseau à Genève, de rencontrer des gens qui deviennent des amis, et de croiser des profils qu'on n'aurait jamais connus autrement. De l'or pur pour les expats !",
    author: "Akira",
    age: 31,
    role: "Consultant",
    roleFr: "Consultant",
    house: "Le Loft",
    duration: "8 months",
    durationFr: "8 mois",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    quote: "I needed to immerse myself in the local culture and there's no better way than coliving at La Villa. The all-inclusive aspect saved me so much hassle as a newcomer.",
    quoteFr: "J'avais besoin de m'imprégner de la culture locale et il n'y a pas de meilleur moyen que le coliving à La Villa. L'aspect tout inclus m'a épargné tant de tracas en tant que nouveau venu.",
    author: "Eva",
    age: 26,
    role: "PhD Student",
    roleFr: "Doctorante",
    house: "La Villa",
    duration: "15 months",
    durationFr: "15 mois",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  },
  {
    quote: "After 2.5 years at La Villa, I can say it was a superb experience. A beautiful house, but above all, beautiful encounters! The community events are incredible.",
    quoteFr: "Après 2 ans et demi à La Villa, je peux dire que c'était une superbe expérience. Une belle maison, mais surtout de belles rencontres ! Les événements communautaires sont incroyables.",
    author: "Thomas",
    age: 34,
    role: "Entrepreneur",
    roleFr: "Entrepreneur",
    house: "Le Loft",
    duration: "30 months",
    durationFr: "30 mois",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
];

export function TestimonialsCarousel() {
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
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#10b981]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f97316]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f43f5e]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-[#f97316] text-sm font-extrabold uppercase tracking-wider mb-4">
            <span className="w-8 h-1.5 bg-[#f97316] rounded-full" />
            {language === 'en' ? 'Community Stories' : 'Histoires de la Communauté'}
            <span className="w-8 h-1.5 bg-[#f97316] rounded-full" />
          </span>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' 
              ? 'Discover the Stories of Our Colivers' 
              : 'Découvre les Histoires de Nos Colivers'}
          </h2>
          <p className="text-lg text-gray-400">
            {language === 'en'
              ? 'Real experiences from real people who called La Villa home'
              : 'Des expériences réelles de vraies personnes qui ont fait de La Villa leur chez-vous'}
          </p>
        </div>

        {/* Main Carousel */}
        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Quote Icon */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#f97316] to-[#f43f5e] rounded-2xl flex items-center justify-center shadow-lg shadow-[#f97316]/30 z-20">
            <Quote className="w-8 h-8 text-white" />
          </div>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 pt-16">
            <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
              {/* Author Image & Info */}
              <div className="text-center md:text-left">
                <div className="relative w-32 h-32 mx-auto md:mx-0 mb-4">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.author}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentTestimonial.age}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-1">
                  {currentTestimonial.author}
                </h4>
                <p className="text-[#f97316] font-medium text-sm mb-2">
                  {language === 'en' ? currentTestimonial.role : currentTestimonial.roleFr}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm">
                  <span>{currentTestimonial.house}</span>
                  <span>·</span>
                  <span>{language === 'en' ? currentTestimonial.duration : currentTestimonial.durationFr}</span>
                </div>
                
                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start gap-1 mt-3">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#f97316] text-[#f97316]" />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="relative">
                <blockquote className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium italic">
                  "{language === 'en' ? currentTestimonial.quote : currentTestimonial.quoteFr}"
                </blockquote>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/20"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/20"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-[#f97316]'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { value: '4.9', label: language === 'en' ? 'Average Rating' : 'Note Moyenne', suffix: '/5' },
            { value: '50+', label: language === 'en' ? 'Happy Colivers' : 'Colivers Heureux', suffix: '' },
            { value: '85%', label: language === 'en' ? 'Stay Longer' : 'Restent Plus Longtemps', suffix: '' },
            { value: '92%', label: language === 'en' ? 'Recommend Us' : 'Nous Recommandent', suffix: '' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                {stat.value}<span className="text-[#f97316]">{stat.suffix}</span>
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
