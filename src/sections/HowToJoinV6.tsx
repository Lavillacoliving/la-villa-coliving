import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Users, Home, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 6: CHALEUR + PREMIUM + MODERNITÉ
 * How to join avec design chaud et premium
 */

export function HowToJoinV6() {
  const { language } = useLanguage();

  const steps = [
    {
      number: '01',
      icon: FileText,
      title: language === 'en' ? 'Apply Online' : 'Candidature en Ligne',
      description: language === 'en'
        ? 'Fill out our simple application form and tell us about yourself.'
        : 'Remplissez notre formulaire de candidature simple et parlez-nous de vous.',
    },
    {
      number: '02',
      icon: Users,
      title: language === 'en' ? 'Meet the Community' : 'Rencontrez la Communauté',
      description: language === 'en'
        ? 'Have a video call with us and meet some current residents.'
        : 'Ayez un appel vidéo avec nous et rencontrez quelques résidents actuels.',
    },
    {
      number: '03',
      icon: Home,
      title: language === 'en' ? 'Move In' : 'Emménagez',
      description: language === 'en'
        ? 'Sign your contract, pay your deposit, and welcome home!'
        : 'Signez votre contrat, payez votre caution, et bienvenue chez vous !',
    },
  ];

  return (
    <section className="py-24 bg-[#faf8f5] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#c4705a]/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-[#e8dfd1]/60 text-[#c4705a] text-xs uppercase tracking-[0.25em] font-medium rounded-full mb-6">
              {language === 'en' ? 'How It Works' : 'Comment Ça Marche'}
            </span>
            
            <h2 className="text-4xl md:text-5xl font-light text-[#3d3632] mb-6 leading-tight">
              {language === 'en' ? 'Joining Is' : 'Rejoindre Est'}
              <span className="font-medium text-[#c4705a]"> {language === 'en' ? 'Simple' : 'Simple'}</span>
            </h2>
            
            <p className="text-[#5a524d] text-lg leading-relaxed mb-10 max-w-lg">
              {language === 'en' 
                ? 'We\'ve designed our process to be straightforward and welcoming. No complicated paperwork, just genuine connections.'
                : 'Nous avons conçu notre processus pour être simple et accueillant. Pas de paperasse compliquée, juste des connexions authentiques.'}
            </p>

            {/* CTA */}
            <Link 
              to="/join-us"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#c4705a] text-white font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(196,112,90,0.35)]"
            >
              <span className="relative z-10">{language === 'en' ? 'Start Your Application' : 'Commencer Votre Candidature'}</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-[#b05d48] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>

          {/* Right - Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="group flex gap-6 p-6 rounded-2xl bg-white border border-[#e8dfd1]/50 hover:border-[#c4705a]/30 hover:shadow-[0_10px_40px_rgba(196,112,90,0.08)] transition-all duration-500"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-[#f5f0e8] flex items-center justify-center group-hover:bg-[#c4705a] transition-colors duration-300">
                    <step.icon className="w-7 h-7 text-[#c4705a] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-[#c4705a] font-medium">{step.number}</span>
                    <h3 className="text-lg font-medium text-[#3d3632]">{step.title}</h3>
                  </div>
                  <p className="text-[#8a817a] text-sm leading-relaxed">{step.description}</p>
                </div>
                <div className="flex-shrink-0 self-center">
                  <div className="w-8 h-8 rounded-full border-2 border-[#e8dfd1] flex items-center justify-center group-hover:border-[#c4705a] group-hover:bg-[#c4705a] transition-all duration-300">
                    <Check className="w-4 h-4 text-[#e8dfd1] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
