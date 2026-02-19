import { Waves, Sofa, BedDouble, Users, CheckCircle, TreePine } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: BOUTIQUE HOSPITALITY
 * Features — "wow factor" section, no organic shapes
 */

export function FeaturesV7() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Waves,
      title: language === "en" ? "Pool, sauna & gym" : "Piscine, sauna & salle de sport",
      description: language === "en"
        ? "In every house: pool (indoor at Le Loft, outdoor at La Villa and Le Lodge), sauna, fully equipped gym. At Le Lodge: jacuzzi."
        : "Dans chaque maison : piscine (intérieure au Loft, extérieure à La Villa et au Lodge), sauna, salle de sport. Au Lodge : jacuzzi.",
    },
    {
      icon: Sofa,
      title: language === "en" ? "Fully equipped houses" : "Maisons ultra-équipées",
      description: language === "en"
        ? "Double kitchen, designer furniture, TV & gaming room, foosball, BBQ, outdoor kitchen. At Le Lodge: arcade machine."
        : "Double cuisine, mobilier design, salle TV & gaming, babyfoot, BBQ XXL, cuisine extérieure. Au Lodge : jeu d'arcade.",
    },
    {
      icon: BedDouble,
      title: language === "en" ? "Spacious rooms from 16 to 23 m²" : "Chambres spacieuses de 16 à 23 m²",
      description: language === "en"
        ? "50% larger than the coliving average. Emma or Tediber mattress, designer furniture. Most with private bathroom."
        : "50% plus grandes que la moyenne coliving. Matelas Emma ou Tediber, mobilier design. La plupart avec salle de bain privative.",
    },
    {
      icon: Users,
      title: language === "en" ? "Active community life" : "Vie communautaire active",
      description: language === "en"
        ? "Monthly pizza party, meal basket, private yoga and fitness classes, board games, foosball. All included, all optional."
        : "Pizza Party mensuelle, panier repas, cours de yoga et fitness privés, jeux de société, babyfoot. Tout inclus, tout optionnel.",
    },
    {
      icon: CheckCircle,
      title: language === "en" ? "Truly all inclusive" : "Vraiment tout inclus",
      description: language === "en"
        ? "Utilities, 8 Gbps fiber, housekeeping 2×/week, parking, streaming, fitness classes, bed linen — 20 items in one payment."
        : "Charges, fibre 8 Gbps, ménage 2×/semaine, parking, streaming, cours de sport, linge de lit — 20 postes couverts en un seul paiement.",
    },
    {
      icon: TreePine,
      title: language === "en" ? "Stable community" : "Communauté stable",
      description: language === "en"
        ? "12-month leases — your housemates stay. Build lasting friendships, not passing acquaintances."
        : "Baux de 12 mois — vos colivers restent. Ici on construit des amitiés durables, pas des relations de passage.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F0F4F1] relative overflow-hidden">
      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#2D6A4F] text-sm font-semibold tracking-[0.08em] uppercase mb-6 block">
            {language === "en" ? "ALL INCLUSIVE — 20 ITEMS" : "TOUT INCLUS — 20 POSTES"}
          </span>
          <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {language === "en" ? "One payment. Zero surprises." : "Un seul paiement. Zéro surprise."}
          </h2>
          <p className="text-[#4A4A4A] text-lg">
            {language === "en"
              ? "Bring your suitcase. We take care of everything else — 20 expense items covered in a single rent of CHF 1,380/month."
              : "Apportez votre valise. Nous nous occupons de tout le reste — 20 postes de dépenses couverts en un seul loyer de 1 380 CHF/mois."}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_2px_8px_rgba(27,67,50,0.06)] hover:shadow-[0_12px_48px_rgba(27,67,50,0.12)] hover:translate-y-[-4px] transition-all duration-400"
            >
              <div className="w-12 h-12 bg-[#F0F4F1] rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#2D6A4F]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{feature.title}</h3>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
