import { Link } from 'react-router-dom';
import { ArrowRight, PenLine, Video, KeyRound } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 7: PREMIUM + FACTUEL
 * How to join — vouvoiement, icônes lucide-react
 */

export function HowToJoinV7() {
  const { language } = useLanguage();

  const steps = [
    {
      icon: PenLine,
      number: '01',
      title: language === 'en' ? 'Apply online' : 'Candidature en ligne',
      description: language === 'en'
        ? 'Tell us about yourself in 2 minutes. No CV required.'
        : 'Parlez-nous de vous en 2 minutes. Sans CV.',
    },
    {
      icon: Video,
      number: '02',
      title: language === 'en' ? 'Meet the team' : 'Échange avec l\'équipe',
      description: language === 'en'
        ? 'A quick video call to get to know each other.'
        : 'Un appel vidéo rapide pour faire connaissance.',
    },
    {
      icon: KeyRound,
      number: '03',
      title: language === 'en' ? 'Move in' : 'Emménagez',
      description: language === 'en'
        ? 'Sign, pay deposit, and welcome home.'
        : 'Signature, caution, et bienvenue chez vous.',
    },
  ];

  return (
    <section className="py-24 bg-[#faf9f5] relative overflow-hidden">
      {/* Organic shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#7c9a6d]/10 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-[#7c9a6d]/15 text-[#7c9a6d] text-sm font-medium rounded-full mb-6">
              {language === 'en' ? 'How to join' : 'Comment nous rejoindre'}
            </span>

            <h2 className="text-4xl md:text-5xl font-light text-[#3d4a38] mb-6 leading-tight">
              {language === 'en' ? 'Joining is' : 'Nous rejoindre est'}
              <span className="font-medium text-[#7c9a6d]"> {language === 'en' ? 'simple' : 'simple'}</span>
            </h2>

            <p className="text-[#5a6355] text-lg leading-relaxed mb-10 max-w-lg">
              {language === 'en'
                ? 'Three simple steps. Quick application, no commitment.'
                : 'Trois étapes simples. Candidature rapide, sans engagement.'}
            </p>

            {/* CTA */}
            <Link
              to="/join-us"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#7c9a6d] text-white font-medium rounded-full hover:bg-[#6b8560] transition-all duration-300 hover:shadow-[0_8px30px_rgba(124,154,109,0.35)]"
            >
              {language === 'en' ? 'Start your application' : 'Commencer votre candidature'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Right - Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group flex gap-6 p-6 rounded-3xl bg-white border border-[#7c9a6d]/10 hover:border-[#7c9a6d]/30 hover:shadow-[0_10px40px_rgba(124,154,109,0.1)] transition-all duration-500"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-[#7c9a6d]/10 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-[#7c9a6d]" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-[#7c9a6d] font-medium">{step.number}</span>
                    <h3 className="text-lg font-medium text-[#3d4a38]">{step.title}</h3>
                  </div>
                  <p className="text-[#7c8a72] text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
