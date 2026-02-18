import { useLanguage } from "@/contexts/LanguageContext";
import { Quote } from "lucide-react";

export function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      quote: t.testimonials.testimonial1.quote,
      author: t.testimonials.testimonial1.author,
      role: t.testimonials.testimonial1.role,
      house: t.testimonials.testimonial1.location,
      color: "bg-[#10b981]",
    },
    {
      quote: t.testimonials.testimonial2.quote,
      author: t.testimonials.testimonial2.author,
      role: t.testimonials.testimonial2.role,
      house: t.testimonials.testimonial2.location,
      color: "bg-[#f97316]",
    },
    {
      quote: t.testimonials.testimonial3.quote,
      author: t.testimonials.testimonial3.author,
      role: t.testimonials.testimonial3.role,
      house: t.testimonials.testimonial3.location,
      color: "bg-[#f43f5e]",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#10b981]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#f97316]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-6">
            {t.testimonials.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              {/* Quote icon */}
              <div
                className={`w-12 h-12 ${testimonial.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Quote text */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-8">
                "{testimonial.quote}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div
                  className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}
                >
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#0f172a]">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {testimonial.house}
                  </div>
                </div>
              </div>

              {/* Decorative gradient */}
              <div
                className={`absolute -bottom-4 -right-4 w-24 h-24 ${testimonial.color} opacity-0 group-hover:opacity-10 rounded-full blur-xl transition-opacity duration-500`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
