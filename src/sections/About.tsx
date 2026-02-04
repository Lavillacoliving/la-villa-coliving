import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function About() {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: "50+", label: "Happy Colivers", color: "#10b981" },
    { icon: MapPin, value: "30min", label: "To Geneva", color: "#f97316" },
    { icon: Heart, value: "100%", label: "Satisfaction", color: "#f43f5e" },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-white">
      {/* Pop Colorful Blobs */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-[#10b981]/12 blob hidden lg:block" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-[#f97316]/10 blob-reverse hidden lg:block" />

      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-sharp-lg">
              <img
                src="/public/ACTIVITES & ILLUSTRATIONS/colocs.jpg"
                alt="La Villa Coliving"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Stats Card */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-3xl p-6 shadow-sharp-lg border-2 border-[#e2e8f0] hidden md:block">
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
                        style={{ background: `${stat.color}15` }}
                      >
                        <Icon size={22} style={{ color: stat.color }} />
                      </div>
                      <p className="text-2xl font-black text-[#0f172a]">
                        {stat.value}
                      </p>
                      <p className="text-xs text-[#64748b] font-bold">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decorative Border */}
            <div className="absolute -inset-4 border-2 border-[#10b981]/25 rounded-[3rem] -z-10" />
          </div>

          {/* Content */}
          <div>
            <span className="inline-flex items-center gap-2 text-[#10b981] text-sm font-extrabold uppercase tracking-wider mb-4">
              <span className="w-8 h-1.5 bg-[#10b981] rounded-full" />
              About La Villa
            </span>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[#0f172a]"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {t.about.title}
            </h2>

            <div className="space-y-4 text-[#475569] text-lg leading-relaxed mb-8">
              <p>{t.about.description}</p>
              <p>{t.about.description2}</p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                "Curated Community",
                "Premium Amenities",
                "Prime Location",
                "All-Inclusive",
              ].map((item, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-[#d1fae5] text-sm font-extrabold text-[#10b981]"
                >
                  {item}
                </span>
              ))}
            </div>

            <Link
              to="/our-houses"
              className="inline-flex items-center gap-2 text-[#10b981] font-extrabold hover:gap-4 transition-all group"
            >
              {t.about.cta}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
