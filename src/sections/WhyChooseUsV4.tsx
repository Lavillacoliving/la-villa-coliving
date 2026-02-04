import { useLanguage } from '@/contexts/LanguageContext';
import { Rocket, Wifi, Users, Shield } from 'lucide-react';

export function WhyChooseUsV4() {
  const { language } = useLanguage();

  const items = [
    {
      icon: Rocket,
      title: language === 'en' ? 'Move In Tomorrow' : 'Emménagez Demain',
      description: language === 'en' 
        ? 'Fully furnished, all-inclusive homes. No furniture shopping, no utility setup, no stress. Just bring your suitcase and start living.'
        : 'Maisons entièrement meublées, tout inclus. Pas d\'achat de meubles, pas de configuration des services, pas de stress.',
      number: '01',
    },
    {
      icon: Wifi,
      title: language === 'en' ? 'Work From Paradise' : 'Travaillez du Paradis',
      description: language === 'en'
        ? 'High-speed fiber, dedicated workspaces, and quiet zones. Your productivity sanctuary with a built-in community.'
        : 'Fibre haut débit, espaces de travail dédiés et zones calmes. Votre sanctuaire de productivité.',
      number: '02',
    },
    {
      icon: Users,
      title: language === 'en' ? 'Instant Friends' : 'Amis Instantanés',
      description: language === 'en'
        ? 'Curated communities of like-minded professionals. No more lonely evenings—your tribe is waiting.'
        : 'Communautés sélectionnées de professionnels partageant les mêmes valeurs. Votre tribu vous attend.',
      number: '03',
    },
    {
      icon: Shield,
      title: language === 'en' ? 'Zero Admin Stress' : 'Zéro Stress Administratif',
      description: language === 'en'
        ? 'One monthly payment covers everything. We handle cleaning, maintenance, bills, and repairs. You just live.'
        : 'Un paiement mensuel couvre tout. Nous gérons le ménage, la maintenance, les factures.',
      number: '04',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
            {language === 'en' ? 'Why La Villa' : 'Pourquoi La Villa'}
          </span>
          <h2 
            className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-4"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' ? 'Why Choose Us?' : 'Pourquoi Nous Choisir?'}
          </h2>
          <p className="text-lg text-[#666] max-w-xl">
            {language === 'en' 
              ? 'Experience coliving designed for modern professionals'
              : 'Découvrez le coliving conçu pour les professionnels modernes'}
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-px bg-[#e5e5e5]">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-10 group hover:bg-[#fafafa] transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="text-5xl font-light text-[#e5e5e5] group-hover:text-[#c44536] transition-colors">
                  {item.number}
                </span>
                <div className="w-12 h-12 border border-[#e5e5e5] flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#1a1a1a]" />
                </div>
              </div>

              <h3 className="text-xl font-medium text-[#1a1a1a] mb-4">
                {item.title}
              </h3>
              <p className="text-[#666] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
