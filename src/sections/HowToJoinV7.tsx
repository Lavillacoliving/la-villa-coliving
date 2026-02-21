import { Link } from 'react-router-dom';
import { ArrowRight, PenLine, Video, KeyRound } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 9: STONE & BRASS — CONDO PREMIUM
 * How to join — 3-col grid, brass step numbers, icon boxes
 */

export function HowToJoinV7() {
  const { language } = useLanguage();

  const steps = [
    {
      icon: PenLine,
      number: '01',
      title: language === 'en' ? 'Online application' : 'Candidature en ligne',
      description: language === 'en'
        ? 'Tell us about yourself in 2 minutes. No CV needed.'
        : 'Parlez-nous de vous en 2 minutes. Sans CV.',
    },
    {
      icon: Video,
      number: '02',
      title: language === 'en' ? 'Meet the team' : 'Échange avec l\'équipe',
      description: language === 'en'
        ? 'A quick 15-minute video call to get to know each other.'
        : 'Un appel vidéo de 15 minutes pour faire connaissance.',
    },
    {
      icon: KeyRound,
      number: '03',
      title: language === 'en' ? 'Move in' : 'Emménagez',
      description: language === 'en'
        ? 'Sign, deposit, and welcome home.'
        : 'Signature, caution, et bienvenue chez vous.',
    },
  ];

  return (
    <section className="py-24 bg-[#F5F2ED]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[13px] font-semibold tracking-wider uppercase text-[#78716C] mb-5 block">
            {language === 'en' ? 'HOW TO JOIN' : 'COMMENT NOUS REJOINDRE'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] tracking-tight mb-4">
            {language === 'en' ? 'Joining is simple' : 'Nous rejoindre est simple'}
          </h2>
          <p className="text-[#78716C] text-lg max-w-lg mx-auto">
            {language === 'en'
              ? 'Three steps. Quick application, no commitment.'
              : 'Trois étapes. Candidature rapide, sans engagement.'}
          </p>
        </div>

        {/* Steps — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#E7E5E4] p-8 hover:border-[#44403C]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all duration-300"
            >
              {/* Step number */}
              <span className="text-[13px] font-semibold tracking-wider uppercase text-[#D4A574] mb-4 block">
                {language === 'en' ? `Step ${step.number}` : `Étape ${step.number}`}
              </span>

              {/* Icon box */}
              <div className="w-10 h-10 bg-[#FAF9F6] rounded-xl flex items-center justify-center mb-5">
                <step.icon className="w-5 h-5 text-[#44403C]" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-[#1C1917] mb-2">{step.title}</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/candidature"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#44403C] text-white font-semibold rounded-lg hover:bg-[#1C1917] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#44403C] focus-visible:ring-offset-2"
          >
            {language === 'en' ? 'Apply now' : 'Rejoindre La Villa'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
