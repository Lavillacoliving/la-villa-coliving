import { EntityFacts } from "@/components/EntityFacts";
import { LocalizedLink } from "@/components/LocalizedLink";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { colocGeneveHref } from "@/lib/siteLinks";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { FaqSection } from "@/components/FaqSection";
import { chambreAnnemasseFaq } from "@/data/faq/chambreAnnemasseFaq";
import {
  BedDouble,
  Train,
  Check,
  ArrowRight,
  Euro,
  Calendar,
  Sparkles,
} from "lucide-react";
import { PRICE_CHF_FR, PRICE_CHF_EN, TRANSIT } from "@/data/stats";
import { ENTITY_HOUSES } from "@/data/entityFacts";
import { communeSentences } from "@/data/answerSlots";
import { OuChercher } from "@/components/OuChercher";
import { HOUSES } from "@/data/houses";

// (Lot L1 « ingénierie des créneaux », 10/2026) Page scopée Lodge : la valeur de LA maison (D1 : « pages maisons :
// la valeur de la maison »), jamais le « 20 min » générique ; minutes depuis TRANSIT (D1-L1, relevés du 08/10/2026).
const LODGE = TRANSIT.byHouse.lelodge;
import { RoomCard } from "@/components/RoomCard";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { HouseAvailabilityLine } from "@/components/HouseAvailabilityLine";
import { useHouseRooms, splitRooms, type PublicRoom } from "@/lib/availability";


export function ChambreLouerAnnemassePage() {
  const { language } = useLanguage();
  // (Lot 6 SEO funnel, addendum 04/09) Page re-scopée : l'inventaire du Lodge uniquement (Annemasse),
  // les deux autres maisons vivent sur /chambre-a-louer-geneve. Même store que les pages maisons.
  const lodgeRooms = useHouseRooms("lelodge");
  const { candidates, occupied } = splitRooms(lodgeRooms.rooms);
  const L: "fr" | "en" = language === "en" ? "en" : "fr";
  const trackRoomCta = (room: PublicRoom) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: "chambre_annemasse_room_card", cta_target: "/candidature", house: "lelodge",
        room_id: `chambre-${room.room_number}`, language,
      });
    } catch { /* noop */ }
  };


  return (
    <main className="relative pt-16">
      <SEO
        // (Lot 6, §6 variante B) Page locale re-scopée sur le Lodge ; pas de prix dans le title (Q8).
        title={language === "en" ? "Rooms for rent in Annemasse, all inclusive" : "Chambre à louer à Annemasse, tout inclus"}
        description={
          language === "en"
            // (D1, 09/10/2026) Valeur du Lodge, qualifiée (Genève-Eaux-Vives, Léman Express) ; meta ≤ 155 caractères.
            ? `Furnished rooms to rent in Annemasse: the Lodge's 12 rooms, ${PRICE_CHF_EN}/month all inclusive, Geneva Eaux-Vives in ${LODGE.eauxVivesDoorToDoorMin} min door to door by Léman Express.`
            : `Chambre meublée à louer à Annemasse : les 12 chambres du Lodge, ${PRICE_CHF_FR}/mois tout inclus, Genève-Eaux-Vives en ${LODGE.eauxVivesDoorToDoorMin} min porte-à-porte en Léman Express.`
        }
        url="https://www.lavillacoliving.com/chambre-a-louer-annemasse"
        image="https://www.lavillacoliving.com/images/le lodge/rooms/la villa coliving le lodge-78.webp"
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
              ? `12 furnished rooms with private shower room at the Lodge, in Annemasse Romagny, ${PRICE_CHF_EN}/month all inclusive. Annemasse station is a ${LODGE.stationWalkMin}-minute walk, then the Léman Express reaches Geneva Eaux-Vives in ${TRANSIT.trainEauxVivesMin} minutes: ${LODGE.eauxVivesDoorToDoorMin} minutes door to door. Renting a room made simpler than a furnished studio: bed, desk, fibre, bills and cleaning included, and a whole house to live in.`
              : `12 chambres meublées avec salle d'eau privative au Lodge, à Annemasse Romagny, ${PRICE_CHF_FR}/mois tout inclus. La gare d'Annemasse est à ${LODGE.stationWalkMin} min à pied, puis le Léman Express rejoint Genève-Eaux-Vives en ${TRANSIT.trainEauxVivesMin} min : ${LODGE.eauxVivesDoorToDoorMin} min porte-à-porte. Une location de chambre plus simple qu'un studio meublé : lit, bureau, fibre, charges et ménage compris, et une maison entière pour vivre.`}
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

      {/* (Lot S1) Fiche de faits canonique */}
      <section className="py-10 bg-white">
        <div className="max-w-3xl mx-auto px-6"><EntityFacts page="chambre-a-louer-annemasse" /></div>
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
              {language === "en" ? " · Rooms in La Villa Coliving's two other houses, Ville-la-Grand and Ambilly: " : " · Les chambres des deux autres maisons de La Villa Coliving, à Ville-la-Grand et Ambilly : "}
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
                  "Move in within 72 h of your first contact if a room is available (no paperwork friction)",
                  `Léman Express direct: Geneva Eaux-Vives in ${TRANSIT.trainEauxVivesMin} min by train, ${LODGE.eauxVivesDoorToDoorMin} min door to door`,
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
                  "Emménagement en 72 h dès le premier contact si une chambre est disponible (zéro friction administrative)",
                  `Léman Express direct : Genève-Eaux-Vives en ${TRANSIT.trainEauxVivesMin} min de train, ${LODGE.eauxVivesDoorToDoorMin} min porte-à-porte`,
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

      {/* ===== LES TROIS MAISONS ET LEURS TRAJETS (Lot L1, M2 : trois phrases de commune A.5 + lignes de trajet A.1
          depuis la source unique ; H2 renommé le 09/10/2026) ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Train className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-6 text-center"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {language === "en"
              ? "Annemasse, Ville-la-Grand, Ambilly: La Villa Coliving's three houses and their commutes to Geneva"
              : "Annemasse, Ville-la-Grand, Ambilly : les trois maisons de La Villa Coliving et leurs trajets vers Genève"}
          </h2>
          <p className="text-lg text-[#57534E] leading-relaxed max-w-3xl mx-auto">{communeSentences(L).join(" ")}</p>
          <ul className="mt-6 space-y-2 text-[#57534E] max-w-3xl mx-auto list-disc pl-6">
            {ENTITY_HOUSES.map((h) => (
              <li key={h.slug}>{`${h.label} (${h.commune}) : ${h.commute[L]}`}</li>
            ))}
          </ul>
          {/* (Lot L2, 09/10/2026) D7 : tram 17 = ancre du Loft (Ambilly) uniquement, avec ses deux nombres ; gare d'Annemasse, jamais « terminus ». */}
          <p className="text-[#57534E] leading-relaxed max-w-3xl mx-auto mt-6">
            {language === "en"
              ? `From Annemasse station, the Léman Express also reaches Champel in ${TRANSIT.trainChampelMin} minutes and Cornavin in ${TRANSIT.trainCornavinMin}, no change; from Ambilly, tram 17 reaches Rive, in central Geneva, in ${TRANSIT.byHouse.leloft.tramStop.tramToRiveMin} minutes by tram.`
              : `Depuis la gare d'Annemasse, le Léman Express rejoint aussi Champel en ${TRANSIT.trainChampelMin} min et Cornavin en ${TRANSIT.trainCornavinMin} min, sans correspondance ; depuis Ambilly, le tram 17 rejoint Rive, au centre de Genève, en ${TRANSIT.byHouse.leloft.tramStop.tramToRiveMin} min de tram.`}
          </p>
          <div className="text-center">
            <LocalizedLink
              to="/annemasse-colocation"
              className="inline-flex items-center gap-2 mt-8 text-[#D4A574] font-medium hover:underline"
            >
              {language === "en" ? "See the full Annemasse guide" : "Voir le guide complet d'Annemasse"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* ===== OÙ CHERCHER (Lot L1 « ingénierie des créneaux », 10/2026 : bloc canonique M1 court, avant « Comment louer ») ===== */}
      <section className="py-20 lg:py-24 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-4xl mx-auto px-6">
          <OuChercher variant="short" page="chambre-a-louer-annemasse" />
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
                desc_fr: "2 minutes : tes coordonnées ; ta date d'emménagement et la durée, si tu les connais, juste après l'envoi.",
                desc_en: "2 minutes: your contact details; your move-in date and length of stay, if you know them, right after sending.",
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
                title_fr: "Emménagement en 72 h",
                title_en: "Move in within 72 h",
                desc_fr: "Bail meublé signé en ligne, caution 2 mois hors charges. Si une chambre est disponible, tu emménages avec une valise en 72 h dès ton premier contact.",
                desc_en: "Furnished lease signed online, 2-month deposit excluding charges. If a room is available, you move in with a suitcase within 72 h of your first contact.",
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

      {/* ===== FAQ (Lot C2, 07/09/2026) — FaqSection : FR + EN, réponses dans le DOM, un seul émetteur FAQPage ===== */}
      <FaqSection
        title={language === "en" ? "Frequently asked questions" : "Questions fréquentes"}
        items={chambreAnnemasseFaq[language === "en" ? "en" : "fr"]}
        emitSchema
      />

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
              ? "Availability changes every week across our 29 rooms. Fill the form, we get back within 48h with the rooms that match your move-in date and profile."
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
              {language === "en" ? "The guide to life in Annemasse" : "Le guide de la vie à Annemasse"}
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
              {language === "en" ? "See all the rooms" : "Voir toutes les chambres"}
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
