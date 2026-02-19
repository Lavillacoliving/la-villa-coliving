import { Link } from "react-router-dom";
import { ArrowRight, PenLine, Video, KeyRound } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: BOUTIQUE HOSPITALITY
 * How to join — clean, no organic shapes
 */

export function HowToJoinV7() {
  const { language } = useLanguage();

  const steps = [
    {
      icon: PenLine,
      number: "01",
      title: language === "en" ? "Online application" : "Candidature en ligne",
      description: language === "en"
        ? "Tell us about yourself in 2 minutes. No CV required."
        : "Parlez-nous de vous en 2 minutes. Sans CV.",
    },
    {
      icon: Video,
      number: "02",
      title: language === "en" ? "Chat with the team" : "Échange avec l'équipe",
      description: language === "en"
        ? "A quick video call to get to know each other."
        : "Un appel vidéo rapide pour faire connaissance.",
    },
    {
      icon: KeyRound,
      number: "03",
      title: language === "en" ? "Move in" : "Emménagez",
      description: language === "en"
        ? "Sign, deposit, and welcome home."
        : "Signature, caution, et bienvenue chez vous.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#FAF8F3] relative overflow-hidden">
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="text-[#2D6A4F] text-sm font-semibold tracking-[0.08em] uppercase mb-6 block">
              {language === "en" ? "HOW TO JOIN" : "COMMENT NOUS REJOINDRE"}
            </span>

            <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-6 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {language === "en" ? "Joining is simple" : "Nous rejoindre est simple"}
            </h2>

            <p className="text-[#4A4A4A] text-lg leading-relaxed mb-10 max-w-lg">
              {language === "en"
                ? "Three simple steps. Quick application, no commitment."
                : "Trois étapes simples. Candidature rapide, sans engagement."}
            </p>

            {/* CTA */}
            <Link
              to="/join-us"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#2D6A4F] text-white font-semibold rounded-lg hover:bg-[#1B4332] hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(27,67,50,0.2)] transition-all duration-300"
            >
              {language === "en" ? "Start your application" : "Commencer votre candidature"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Right - Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group flex gap-6 p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_2px_8px_rgba(27,67,50,0.06)] hover:shadow-[0_12px_48px_rgba(27,67,50,0.12)] hover:translate-y-[-4px] transition-all duration-400"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-[#F0F4F1] flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-[#2D6A4F]" />
                   </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-[#2D6A4F] font-semibold">{step.number}</span>
                    <h3 className="text-lg font-bold text-[#1A1A1A]">{step.title}</h3>
                  </div>
                  <p className="text-[#4A4A4A] text-sm leading-relaxed">{step.description}</p>
               </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
