import { Link } from "react-router-dom";
import { ArrowRight, Home, Users, Heart, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: BOUTIQUE HOSPITALITY
 * Hero full-bleed + Bandeau USP + Strip positionnement
 */

export function HeroV7() {
  const { language } = useLanguage();

  return (
    <>
      {/* ═══ HERO — Photo full-bleed ═══ */}
      <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/la villa jardin.webp"
            alt={language === "en"
              ? "La Villa Coliving — premium house with pool near Geneva"
              : "La Villa Coliving — maison premium avec piscine près de Genève"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/90 via-[#1B4332]/40 to-transparent" />
        </div>

        {/* Content — aligned bottom-left */}
        <div className="relative z-10 container-custom w-full">
          {/* Badge */}
          <div className="mb-7">
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-white text-[13px] font-semibold tracking-[0.06em] uppercase">
              <span className="w-1.5 h-1.5 bg-[#D4B87A] rounded-full" />
              {language === "en" ? "Boutique Coliving — Grand Genève" : "Coliving boutique — Grand Genève"}
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 max-w-2xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            {language === "en" ? (
              <>3 houses. 7 to 12 residents.<br /><em className="text-[#D4B87A]">All inclusive.</em></>
            ) : (
              <>3 maisons. 7 à 12 résidents.<br /><em className="text-[#D4B87A]">Tout inclus.</em></>
            )}
          </h1>

          {/* Description */}
          <p className="text-lg text-white/80 max-w-xl mb-9 leading-relaxed">
            {language === "en"
              ? "Rooms from 16 to 23 m² in real houses with pool, sauna, and gym — shared with 10 people, not 300. All-inclusive from CHF 1,380/month."
              : "Des chambres de 16 à 23 m² dans de vraies maisons avec piscine, sauna et salle de sport — partagés avec 10 personnes, pas 300. Tout inclus dès 1 380 CHF/mois."}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14">
            <Link to="/our-houses" className="inline-flex items-center gap-2 bg-white text-[#1B4332] px-8 py-4 rounded-lg font-semibold hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] transition-all duration-300">
              {language === "en" ? "Explore our houses" : "Découvrir nos maisons"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/join-us" className="inline-flex items-center gap-2 border-[1.5px] border-white/40 text-white px-8 py-4 rounded-lg font-semibold hover:border-white hover:bg-white/10 transition-all duration-300">
              {language === "en" ? "Apply" : "Candidater"}
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-8 md:gap-12 pt-8 border-t border-white/15">
            {[
              { value: "100+", label: language === "en" ? "Residents since 2021" : "Résidents depuis 2021" },
              { value: "16-23 m²", label: language === "en" ? "Private rooms" : "Chambres privées" },
              { value: "1 380 CHF", label: language === "en" ? "All inclusive / month" : "Tout inclus / mois" },
              { value: "4.9/5", label: language === "en" ? "Resident rating" : "Note résidents" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-2xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>{stat.value}</span>
                <span className="text-xs text-white/50 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BANDEAU PARTIE 1 : USPs exceptionnelles ═══ */}
      <div className="bg-[#1B4332] pt-16 pb-12">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[#D4B87A] text-sm font-semibold tracking-[0.08em] uppercase mb-4 block">
              {language === "en" ? "What makes us unique" : "Ce qui nous rend uniques"}
            </span>
            <h2 className="text-3xl md:text-4xl text-white mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {language === "en"
                ? <>Pool, sauna & gym —<br /><em className="text-[#D4B87A]">in every single house.</em></>
                : <>Piscine, sauna & salle de sport —<br /><em className="text-[#D4B87A]">dans chaque maison.</em></>}
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              {language === "en"
                ? "This level of amenities is unheard of in coliving. Most don't even have a pool. We have one in all three houses — plus private yoga, fitness classes, pizza nights, and 17 more items included."
                : "Ce niveau de prestations est inédit en coliving. La plupart n'ont même pas de piscine. Nous en avons une dans les 3 maisons — plus yoga privé, cours de fitness, pizza party et 17 autres postes inclus."}
            </p>
          </div>

          {/* 5 USP Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                image: "/images/la villa coliving le loft piscine.webp",
                title: language === "en" ? "Pool" : "Piscine",
                desc: language === "en" ? "Indoor or outdoor, in every house" : "Intérieure ou extérieure, dans chaque maison",
                highlight: language === "en" ? "In all 3 houses" : "Dans les 3 maisons",
              },
              {
                image: "/images/la villa coliving le lodge-sauna2.webp",
                title: "Sauna",
                desc: language === "en" ? "Finnish sauna + jacuzzi at Le Lodge" : "Sauna finlandais + jacuzzi au Lodge",
                highlight: language === "en" ? "In all 3 houses" : "Dans les 3 maisons",
              },
              {
                image: "/images/la villa coliving le lodge-gym.webp",
                title: language === "en" ? "Gym" : "Salle de sport",
                desc: language === "en" ? "Fully equipped in each house" : "Entièrement équipée dans chaque maison",
                highlight: language === "en" ? "In all 3 houses" : "Dans les 3 maisons",
              },
              {
                image: "/images/la villa yoga.webp",
                title: language === "en" ? "Private classes" : "Cours privés",
                desc: language === "en" ? "Weekly yoga & fitness included" : "Yoga & fitness hebdo inclus",
                highlight: language === "en" ? "Included in rent" : "Inclus dans le loyer",
              },
              {
                image: "/images/le loft glamour.webp",
                title: language === "en" ? "16-23 m² rooms" : "Chambres 16-23 m²",
                desc: language === "en" ? "50% larger than coliving average" : "50% plus grandes que la moyenne",
                highlight: language === "en" ? "Private bathroom" : "SDB privative",
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-white/70 text-sm mb-2">{item.desc}</p>
                    <span className="inline-block px-3 py-1 bg-[#D4B87A]/20 text-[#D4B87A] text-xs font-semibold rounded-full backdrop-blur-sm w-fit">
                      {item.highlight}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phrase de rappel */}
          <p className="text-center text-white/50 mt-8 text-sm">
            {language === "en"
              ? "All of this is included in your rent. 1,380 CHF/month. Nothing extra. Ever."
              : "Tout ceci est inclus dans votre loyer. 1 380 CHF/mois. Rien en plus. Jamais."}
          </p>
        </div>
      </div>

      {/* ═══ BANDEAU PARTIE 2 : Positionnement taille humaine ═══ */}
      <div className="bg-[#1B4332] border-t border-white/10 py-8">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            {[
              { icon: <Home className="w-5 h-5" />, text: language === "en" ? <>Real <strong className="text-white">houses</strong>, not residences</> : <>De <strong className="text-white">vraies maisons</strong>, pas des résidences</> },
              { icon: <Users className="w-5 h-5" />, text: language === "en" ? <><strong className="text-white">7 to 12</strong> residents, not 300</> : <><strong className="text-white">7 à 12</strong> résidents, pas 300</> },
              { icon: <Heart className="w-5 h-5" />, text: language === "en" ? <><strong className="text-white">Founder</strong>-managed</> : <>Géré par les <strong className="text-white">fondateurs</strong></> },
              { icon: <MapPin className="w-5 h-5" />, text: language === "en" ? <><strong className="text-white">15-25 min</strong> from Geneva</> : <><strong className="text-white">15-25 min</strong> de Genève</> },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70 text-[15px]">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-[#D4B87A]">
                  {item.icon}
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
