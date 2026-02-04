import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

export function HowToJoinV4() {
  const { language } = useLanguage();

  const steps = [
    {
      number: '01',
      title: language === 'en' ? 'Discover' : 'Découvrir',
      description: language === 'en'
        ? 'Learn what makes La Villa unique. Coliving is more than shared housing—it\'s a lifestyle designed for connection.'
        : 'Apprenez ce qui rend La Villa unique. Le coliving, c\'est plus qu\'une colocation—c\'est un mode de vie.',
      cta: language === 'en' ? 'Explore The Concept' : 'Explorer Le Concept',
      link: '/the-coliving',
    },
    {
      number: '02',
      title: language === 'en' ? 'Explore' : 'Explorer',
      description: language === 'en'
        ? 'Tour our beautifully designed homes, each crafted for modern community living.'
        : 'Visitez nos maisons magnifiquement designées, chacune conçue pour la vie communautaire moderne.',
      cta: language === 'en' ? 'View Our Houses' : 'Voir Nos Maisons',
      link: '/our-houses',
    },
    {
      number: '03',
      title: language === 'en' ? 'Apply' : 'Candidater',
      description: language === 'en'
        ? 'Complete your application and meet your future community. We\'ll guide you through every step.'
        : 'Complétez votre candidature et rencontrez votre future communauté. Nous vous guidons à chaque étape.',
      cta: language === 'en' ? 'Start Your Application' : 'Commencer Ma Candidature',
      link: '/join-us',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
            {language === 'en' ? 'Get Started' : 'Commencer'}
          </span>
          <h2 
            className="text-4xl md:text-5xl font-light text-[#1a1a1a]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' ? 'How to Join' : 'Comment Nous Rejoindre'}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-px bg-[#e5e5e5]">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#fafafa] p-10 group hover:bg-white transition-colors"
            >
              <span className="text-6xl font-light text-[#e5e5e5] group-hover:text-[#c44536] transition-colors block mb-8">
                {step.number}
              </span>

              <h3 className="text-xl font-medium text-[#1a1a1a] mb-4">
                {step.title}
              </h3>
              <p className="text-[#666] leading-relaxed mb-8">
                {step.description}
              </p>

              <Link
                to={step.link}
                className="inline-flex items-center gap-2 text-[#1a1a1a] font-medium hover:text-[#c44536] transition-colors"
              >
                {step.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
