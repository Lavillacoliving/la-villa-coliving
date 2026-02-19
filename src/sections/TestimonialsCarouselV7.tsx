import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: BOUTIQUE HOSPITALITY
 * Testimonials — dark bg, no emojis, vouvoiement
 */

export function TestimonialsCarouselV7() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sophie",
      role: language === "en" ? "Product Designer" : "Designer Produit",
      location: "Geneva",
      quote: language === "en"
        ? "What convinced me was the size. 10 people in a house with a pool — that doesn't exist anywhere else."
        : "Ce qui m'a convaincue, c'est la taille. 10 personnes dans une maison avec piscine — ça n'existe nulle part ailleurs.",
      avatar: "S",
    },
    {
      name: "Thomas",
      role: language === "en" ? "Software Engineer" : "Ingénieur Logiciel",
      location: "Paris",
      quote: language === "en"
        ? "After two years of classic coliving, La Villa is another world. The space, the amenities, the community — everything is different."
        : "Après deux ans de coliving classique, La Villa c'est un autre monde. L'espace, les équipements, la communauté — tout est différent.",
      avatar: "T",
    },
    {
      name: "Marie",
      role: language === "en" ? "Marketing Manager" : "Responsable Marketing",
      location: "Brussels",
      quote: language === "en"
        ? "I work in Geneva and live in a house with a garden, pool and sauna for CHF 1,380. My colleagues can't believe it."
        : "Je travaille à Genève et je vis dans une maison avec jardin, piscine et sauna pour 1 380 CHF. Mes collègues n'en reviennent pas.",
      avatar: "M",
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
    <section className="py-24 md:py-32 bg-[#1B4332] relative overflow-hidden">
      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4B87A] text-sm font-semibold tracking-[0.08em] uppercase mb-6 block">
            {language === "en" ? "TESTIMONIALS" : "TÉMOIGNAGES"}
          </span>
          <h2 className="text-3xl md:text-4xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {language === "en" ? "What our residents say" : "Ce qu'en disent nos résidents"}
          </h2>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Testimonial content */}
            <div className="text-center px-8 md:px-16">
              {/* Avatar */}
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white text-2xl font-medium shadow-lg">
                {testimonials[currentIndex].avatar}
              </div>

              <p className="text-xl md:text-2xl text-white/85 leading-relaxed mb-8">
                "{testimonials[currentIndex].quote}"
              </p>

              <div>
                <div className="text-white font-medium">{testimonials[currentIndex].name}</div>
                <div className="text-white/50 text-sm">
                  {testimonials[currentIndex].role} — {testimonials[currentIndex].location}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                { mestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-[#D4B87A]"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white transition-all duration-300"
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
