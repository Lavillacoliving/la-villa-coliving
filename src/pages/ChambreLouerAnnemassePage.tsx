import { LocalizedLink } from "@/components/LocalizedLink";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { colocGeneveHref } from "@/lib/siteLinks";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import {
  BedDouble,
  Train,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Euro,
  Calendar,
  Sparkles,
} from "lucide-react";
import { PRICE_CHF_FR, PRICE_CHF_EN } from "@/data/stats";
import { HOUSES } from "@/data/houses";
import { RoomCard } from "@/components/RoomCard";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { HouseAvailabilityLine } from "@/components/HouseAvailabilityLine";
import { useHouseRooms, splitRooms, type PublicRoom } from "@/lib/availability";

// ───────────────────────────────────────────────────────────────────────
// FAQ (FR) — cible "chambre à louer annemasse" 170/mois + "studio annemasse" 590/mois
// ───────────────────────────────────────────────────────────────────────
const chambreFAQ = [
  {
    q: "Quel est le prix d'une chambre meublée à Annemasse chez La Villa Coliving ?",
    a: `Les 12 chambres du Lodge, à Annemasse Romagny, sont à ${PRICE_CHF_FR}/mois tout inclus : loyer, charges, fibre, ménage des communs 3 fois par semaine, sauna, salle de sport, piscine et jardin, événements. Chaque chambre a sa salle d'eau privative. Pas de frais d'agence, pas de frais de dossier, caution de 2 mois de loyer hors charges, restituée après l'état des lieux.`,
  },
  {
    q: "Les chambres à louer à Annemasse sont-elles vraiment meublées ?",
    a: "Oui, intégralement : lit double avec sa parure, bureau, placard sur mesure, salle d'eau privative. Les espaces communs du Lodge (cuisine, salon, terrasse, jardin, sauna, salle de sport) sont aussi entièrement équipés. Tu n'as qu'à arriver avec tes valises.",
  },
  {
    q: "Quelle différence entre un studio à Annemasse et une chambre au Lodge ?",
    a: `Un studio à Annemasse se loue en moyenne 700 à 950 € par mois charges non comprises : eau, électricité, internet, ménage et mobilier s'ajoutent. Au Lodge, ${PRICE_CHF_FR} tout inclus, avec des espaces communs pensés pour vivre et 11 colocataires qui travaillent à Genève ou dans la région. Compare le coût total, pas le loyer affiché.`,
  },
  {
    q: "Pour combien de temps peut-on louer une chambre à Annemasse ?",
    a: "Le bail meublé est de 12 mois renouvelable, avec un préavis d'un mois. Idéal pour s'installer durablement comme frontalier ou pour une période d'essai à Genève. Des baux plus courts sont étudiés au cas par cas selon les disponibilités.",
  },
  {
    q: "Quelles sont les disponibilités actuelles au Lodge ?",
    a: "La liste ci-dessus est lue en temps réel sur la même source que nos réservations : chaque chambre libre ou datée y figure avec sa date. S'il n'y a rien à ta date, rejoins la liste d'attente du Lodge, ou regarde les chambres de nos deux autres maisons à Ville-la-Grand et Ambilly sur la page des chambres à louer près de Genève.",
  },
  {
    q: "Comment se passe la visite avant de signer ?",
    a: "Après ta candidature, on organise une visite sur place ou en visio du Lodge et de la chambre disponible : tour de la maison, présentation des espaces communs et des services, et un échange avec un résident actuel. Réponse sous 48 h, bail signé en ligne.",
  },
];

export function ChambreLouerAnnemassePage() {
  const { language } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  // (Lot 6 SEO funnel, addendum 04/09) Page re-scopée : l'inventaire du Lodge uniquement (Annemasse),
  // les deux autres maisons vivent sur /chambre-a-louer-geneve. Même store que les pages maisons.
  const lodgeRooms = useHouseRooms("lelodge");
  const { candidates, occupied } = splitRooms(lodgeRooms.rooms);
  const trackRoomCta = (room: PublicRoom) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: "chambre_annemasse_room_card", cta_target: "/candidature", house: "lelodge",
        room_id: `chambre-${room.room_number}`, language,
      });
    } catch { /* noop */ }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: chambreFAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="relative pt-16">
      <SEO
        // (Lot 6, §6 variante B) Page locale re-scopée sur le Lodge ; pas de prix dans le title (Q8).
        title={language === "en" ? "Rooms for rent in Annemasse, all inclusive" : "Chambre à louer à Annemasse, tout inclus"}
        description={
          language === "en"
            ? `Furnished rooms to rent in Annemasse: the Lodge's 12 rooms, private shower room, all inclusive ${PRICE_CHF_EN}/month, Geneva in 15 min. Reply within 48 h.`
            : `Chambre meublée à louer à Annemasse : les 12 chambres du Lodge, salle d'eau privative, tout inclus ${PRICE_CHF_FR}/mois, Genève en 15 min. Réponse sous 48 h.`
        }
        url="https://www.lavillacoliving.com/chambre-a-louer-annemasse"
        image="https://www.lavillacoliving.com/images/le lodge/rooms/la villa coliving le lodge-78.webp"
        jsonLd={faqSchema}
      />

      {/* ===== HERO ===== */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {language === "en" ? "Furnished rooms · Le Lodge, Annemasse 74100" : "Chambres meublées · Le Lodge, Annemasse 74100"}
          </span>
          <h1
            className="text-4xl md:text-6xl font-light text-[#1C1917] mb-6 leading-tight"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {language === "en"
              ? "Rooms to rent in Annemasse: the Lodge's 12 furnished rooms, all inclusive"
              : "Chambres à louer à Annemasse : les 12 chambres du Lodge, meublées et tout inclus"}
          </h1>
          <p className="text-lg md:text-xl text-[#57534E] max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
            {language === "en"
              ? `12 furnished rooms with private shower room at the Lodge, in Annemasse Romagny, ${PRICE_CHF_EN}/month all inclusive. Léman Express direct to Geneva Cornavin in 15 minutes. Renting a room made simpler than a furnished studio: bed, desk, fibre, bills and cleaning included, and a whole house to live in.`
              : `12 chambres meublées avec salle d'eau privative au Lodge, à Annemasse Romagny, ${PRICE_CHF_FR}/mois tout inclus. Léman Express direct Genève Cornavin en 15 minutes. Une location de chambre plus simple qu'un studio meublé : lit, bureau, fibre, charges et ménage compris, et une maison entière pour vivre.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LocalizedLink
              to="/candidature"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1917] text-white font-semibold rounded-full hover:bg-[#44403C] transition-colors"
            >
              {language === "en" ? "Check availability" : "Voir les disponibilités"}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            <LocalizedLink
              to="/tarifs"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1C1917] text-[#1C1917] font-semibold rounded-full hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              {language === "en" ? "See pricing" : "Voir les tarifs"}
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* ===== (Lot 6, addendum 04/09) L'INVENTAIRE DU LODGE — forme d'annuaire, jamais « complet » ===== */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-3"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {candidates.length > 0
              ? (language === "en"
                ? `${candidates.length} room${candidates.length > 1 ? "s" : ""} to rent at the Lodge now or soon`
                : `${candidates.length} chambre${candidates.length > 1 ? "s" : ""} à louer au Lodge maintenant ou bientôt`)
              : (language === "en" ? "Next rooms opening at the Lodge" : "Prochaines chambres au Lodge")}
          </h2>
          <p className="text-[#57534E] mb-8 max-w-2xl">
            {language === "en"
              ? `Real availability of the Lodge's 12 rooms, read from the same data as our bookings: size, floor, price in CHF, opening date. ${occupied.length > 0 ? `The other ${occupied.length} rooms are occupied without a known date.` : ""}`
              : `La dispo réelle des 12 chambres du Lodge, lue sur la même source que nos réservations : surface, étage, prix en CHF, date de libération. ${occupied.length > 0 ? `Les ${occupied.length} autres chambres sont occupées sans date connue.` : ""}`}
          </p>
          {candidates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {candidates.map((room) => (
                <RoomCard key={room.room_number} house="lelodge" houseName={HOUSES.lelodge.label} room={room} fallbackImage={HOUSES.lelodge.img} onCtaClick={trackRoomCta} />
              ))}
            </div>
          )}
          <div className="flex flex-col gap-3 mb-6">
            <HouseAvailabilityLine house="lelodge" />
            <p className="text-sm text-[#57534E]">
              {language === "en" ? "Nothing at your date? " : "Rien à ta date ? "}
              <LocalizedLink to="/candidature?property_interest=lelodge&room_interest=liste-attente" className="underline underline-offset-4 hover:text-[#1C1917]">
                {language === "en" ? "Join the Lodge's waiting list" : "Rejoins la liste d'attente du Lodge"}
              </LocalizedLink>
              {language === "en" ? " · Rooms in our two other houses, Ville-la-Grand and Ambilly: " : " · Les chambres de nos deux autres maisons, à Ville-la-Grand et Ambilly : "}
              <LocalizedLink to="/chambre-a-louer-geneve" className="underline underline-offset-4 hover:text-[#1C1917]">
                {language === "en" ? "rooms to rent near Geneva" : "chambre à louer près de Genève"}
              </LocalizedLink>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1C1917] text-white p-8 md:col-span-2">
              <BedDouble className="w-10 h-10 text-[#D4A574] mb-4" />
              <p className="text-2xl font-bold text-[#D4A574] mb-4">
                {language === "en" ? `${PRICE_CHF_EN}/month — all inclusive, private shower room` : `${PRICE_CHF_FR}/mois — tout inclus, salle d'eau privative`}
              </p>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                {language === "en"
                  ? "One price for the Lodge's 12 rooms, each with its own shower room. The figure is the total monthly cost: rent, bills, fibre, cleaning of the common areas, shared spaces and events. Nothing is added at the end of the month."
                  : "Un seul prix pour les 12 chambres du Lodge, chacune avec sa salle d'eau. Le montant est le coût mensuel total : loyer, charges, fibre, ménage des communs, espaces communs et événements. Rien ne s'ajoute en fin de mois."}
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "Designer furniture, private shower room" : "Mobilier design, salle d'eau privative"}</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "8 Gb/s fibre" : "Fibre 8 Gb/s"}</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "Bills included" : "Charges comprises"}</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "Housekeeping 3×/week" : "Ménage 3×/semaine"}</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "Sauna, gym, pool and garden" : "Sauna, salle de sport, piscine et jardin"}</li>
              </ul>
            </div>
            <div className="bg-[#FAF9F6] p-8">
              <Sparkles className="w-10 h-10 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-2">
                {language === "en" ? "What about a classic studio in Annemasse?" : "Et un studio classique à Annemasse ?"}
              </h3>
              <p className="text-2xl font-bold text-[#78716C] mb-4">{language === "en" ? "700-950 €/mo +" : "700-950 €/mois +"}</p>
              <p className="text-sm text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "700–950 €/month on paper — but bills on top, furniture not included, no community and no shared spaces."
                  : "700–950 €/mois en apparence — mais charges en plus, à meubler soi-même, sans communauté ni espaces partagés."}
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <LocalizedLink
              to="/tarifs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1917] text-white font-semibold rounded-full hover:bg-[#44403C] transition-colors"
            >
              {language === "en" ? "See what's included in the rent" : "Voir le détail des tarifs"}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {language === "en"
              ? "Why rent your room at the Lodge, Annemasse"
              : "Pourquoi louer ta chambre au Lodge, à Annemasse"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-3xl mx-auto">
            {(language === "en"
              ? [
                  "12 furnished rooms — one house, one community",
                  `All inclusive ${PRICE_CHF_EN}/month (no surprises)`,
                  "Move in within a week (no paperwork friction)",
                  "Léman Express direct to Geneva Cornavin 15 min",
                  "Sauna, gym, pool and garden at the Lodge",
                  "fiber internet up to 8 Gb/s",
                  "Cleaning three times a week of common areas",
                  "Weekly yoga and fitness classes included",
                  "Monthly community events",
                  "No agency fees, no application fees",
                  "Flexible 12-month lease, 1-month notice",
                ]
              : [
                  "12 chambres meublées — une maison, une communauté",
                  `Tout inclus ${PRICE_CHF_FR}/mois (zéro surprise)`,
                  "Emménagement en moins d'une semaine (zéro friction administrative)",
                  "Léman Express direct Genève Cornavin en 15 min",
                  "Sauna, salle de sport, piscine et jardin au Lodge",
                  "Internet fibre jusqu'à 8 Gb/s",
                  "Ménage 3 fois par semaine des espaces communs",
                  "Cours hebdomadaires yoga et fitness inclus",
                  "Événements communautaires mensuels",
                  "Aucun frais d'agence, aucun frais de dossier",
                  "Bail flexible 12 mois, préavis 1 mois",
                ]
            ).map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="text-[#D4A574] mt-1 flex-shrink-0" size={20} />
                <span className="text-[#57534E] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRANSPORT (compact) ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Train className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-6"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {language === "en" ? "15 min from Geneva Cornavin" : "À 15 min de Genève Cornavin"}
          </h2>
          <p className="text-lg text-[#57534E] leading-relaxed max-w-3xl mx-auto">
            {language === "en"
              ? "Annemasse station is the Léman Express terminus — direct train to Geneva Cornavin in 15 minutes, no transfer. Tram 17 TPG and direct buses also connect to central Geneva. Whether you commute daily or visit occasionally, our 3 houses are optimised for cross-border life."
              : "La gare d'Annemasse est le terminus du Léman Express — train direct Genève Cornavin en 15 minutes, sans correspondance. Le Tram 17 TPG et des bus directs desservent aussi le centre de Genève. Que tu fasses le trajet quotidien ou occasionnellement, nos 3 maisons sont optimisées pour la vie frontalière."}
          </p>
          <LocalizedLink
            to="/annemasse-colocation"
            className="inline-flex items-center gap-2 mt-8 text-[#D4A574] font-medium hover:underline"
          >
            {language === "en" ? "See full Annemasse coliving guide" : "Voir le guide complet colocation Annemasse"}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {language === "en" ? "How to rent your room — 4 steps" : "Comment louer ta chambre — 4 étapes"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                num: "1",
                title_fr: "Candidature en ligne",
                title_en: "Online application",
                desc_fr: "5 min pour remplir ton profil (motivation, contexte pro, dates d'emménagement).",
                desc_en: "5 min to fill your profile (motivation, pro context, move-in dates).",
              },
              {
                num: "2",
                title_fr: "Échange sous 48h",
                title_en: "Reply within 48h",
                desc_fr: "On t'appelle pour confirmer la disponibilité et vérifier le fit communauté.",
                desc_en: "We call to confirm availability and check community fit.",
              },
              {
                num: "3",
                title_fr: "Visite",
                title_en: "Visit",
                desc_fr: "Tour physique ou virtuel de la résidence et de la chambre disponible.",
                desc_en: "Physical or virtual tour of the house and available room.",
              },
              {
                num: "4",
                title_fr: "Emménagement 1 sem.",
                title_en: "Move in within a week",
                desc_fr: "Bail meublé signé en ligne, caution 2 mois hors charges, emménagement avec une valise.",
                desc_en: "Furnished lease signed online, 2-month deposit excluding charges, move in with a suitcase.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#1C1917] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-medium text-[#1C1917] mb-2">
                  {language === "en" ? step.title_en : step.title_fr}
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  {language === "en" ? step.desc_en : step.desc_fr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {language === "en" ? "Frequently asked questions" : "Questions fréquentes"}
          </h2>
          <div className="space-y-4">
            {chambreFAQ.map((item, i) => (
              <div key={i} className="bg-[#FAF9F6] border border-[#E7E5E4]">
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-medium text-[#1C1917] pr-4">{item.q}</span>
                  {openFAQ === i ? (
                    <ChevronUp className="w-5 h-5 text-[#D4A574] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#78716C] flex-shrink-0" />
                  )}
                </button>
                {openFAQ === i && (
                  <div className="px-6 pb-5 text-[#57534E] leading-relaxed border-t border-[#E7E5E4] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 lg:py-32 bg-[#1C1917] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Calendar className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
          <h2
            className="text-3xl md:text-4xl font-light mb-6"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {language === "en"
              ? "Check current room availability"
              : "Voir les chambres disponibles maintenant"}
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            {language === "en"
              ? "Disponibilités change weekly across our 29 rooms. Fill the form, we get back within 48h with the rooms that match your move-in date and profile."
              : "Les disponibilités évoluent chaque semaine sur nos 29 chambres. Remplis le formulaire, on revient sous 48h avec les chambres qui matchent ta date d'emménagement et ton profil."}
          </p>
          <LocalizedLink
            to="/candidature"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1C1917] font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            {language === "en" ? "Apply now" : "Candidater maintenant"}
            <ArrowRight className="w-5 h-5" />
          </LocalizedLink>
        </div>
      </section>

      {/* ===== Internal linking ===== */}
      <section className="py-12 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#78716C] mb-4">
            {language === "en" ? "Related pages" : "Pages liées"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <LocalizedLink to="/annemasse-colocation" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Annemasse coliving guide" : "Guide colocation Annemasse"}
            </LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            {/* (Lot 4 SEO funnel) Ancre exacte vers la home, URL championne sur « coliving genève ». */}
            <LocalizedLink to="/" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Coliving Geneva" : "Coliving Genève"}
            </LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to={colocGeneveHref(language)} className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Shared housing Geneva" : "Colocation Genève"}
            </LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            {/* (Lot 6 SEO funnel) Page sœur côté Genève. */}
            <LocalizedLink to="/chambre-a-louer-geneve" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Room to rent near Geneva" : "Chambre à louer près de Genève"}
            </LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/nos-maisons" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Our 3 houses" : "Nos 3 maisons"}
            </LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/lelodge" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Le Lodge — 12 rooms Annemasse" : "Le Lodge — 12 chambres Annemasse"}
            </LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/tarifs" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Pricing" : "Tarifs"}
            </LocalizedLink>
          </div>
          <Euro className="w-5 h-5 text-[#D4A574]/40 mx-auto mt-6" />
        </div>
      </section>
      <WhatsAppButton context={language === "en" ? "Rooms for rent Annemasse" : "Chambre à louer Annemasse"} />
      {/* (Lot 6) État chambres du Lodge embarqué au prérendu — instance unique par page. */}
      <RoomsEmbed house="lelodge" />
    </main>
  );
}
