import { ArrowRight, BedDouble, Calendar, Check, Sparkles, Train } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { SEO } from "@/components/SEO";
import { FaqSection } from "@/components/FaqSection";
import { RoomCard } from "@/components/RoomCard";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { HouseAvailabilityLine } from "@/components/HouseAvailabilityLine";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOUSES } from "@/data/houses";
import { STATS, PRICE_CHF_FR, PRICE_CHF_EN, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN } from "@/data/stats";
import { colocGeneveHref } from "@/lib/siteLinks";
import type { QAPair } from "@/lib/structuredData";
import { useAllRooms, splitRooms, type HouseKey, type PublicRoom } from "@/lib/availability";

/**
 * /chambre-a-louer-geneve · /en/chambre-a-louer-geneve — Lot 6 du plan SEO funnel (04/09/2026).
 * Requête de CONQUÊTE « chambre à louer genève » (140/mois, +357 %). Angle : le lecteur cherche
 * « Genève » et découvre le côté France — une chambre meublée dans une maison de coliving, pas une
 * chambre chez l'habitant ni une sous-location. Même grammaire que /chambre-a-louer-annemasse
 * (qui reste la page locale), cartes chambres du store partagé (Lot 3), FAQ via buildFaqPageSchema.
 * Fact block : « dès 1 370 CHF », 17-23 m², 20 min du centre, caution 2 mois hors charges, 0 frais.
 */
const FAQ: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Où trouver une chambre à louer près de Genève quand on travaille en Suisse ?",
      a: `Côté France, à 20 minutes du centre. Les chambres abordables autour de Genève sont à Annemasse, Ville-la-Grand et Ambilly, reliées au centre par le Léman Express et le tram 17. La Villa Coliving y propose ${STATS.totalRooms} chambres meublées dans ${STATS.totalHouses} maisons, tout inclus dès ${PRICE_SHARED_CHF_FR}/mois.`,
    },
    {
      q: `Combien coûte une chambre meublée près de Genève chez La Villa Coliving ?`,
      a: `Dès ${PRICE_SHARED_CHF_FR}/mois tout inclus pour une chambre dont la salle d'eau est partagée avec une seule autre chambre, ${PRICE_CHF_FR}/mois avec salle d'eau privative. Le loyer comprend les charges, la fibre jusqu'à 8 Gb/s, le ménage des communs 3 fois par semaine, les espaces communs (piscine, sauna, salle de sport selon la maison) et les événements. Aucun frais de dossier ni d'agence ; caution de 2 mois de loyer hors charges.`,
    },
    {
      q: "Quelle différence avec une chambre chez l'habitant ou une sous-location à Genève ?",
      a: "Une chambre chez l'habitant ou une sous-location se loue souvent sans bail solide, avec les charges à part et sans espace commun pensé pour vivre. Chez La Villa, tu signes un bail meublé à ton nom, tu paies un seul loyer tout compris et tu partages une maison entière, avec 7 à 12 colocataires qui travaillent comme toi à Genève ou dans la région.",
    },
    {
      q: "Quel dossier faut-il pour louer une chambre près de Genève ?",
      a: "Une candidature en ligne de deux minutes, puis un contrat de travail ou une promesse d'embauche et une pièce d'identité. On te répond sous 48 h, on organise une visite sur place ou en visio, et le bail meublé se signe en ligne. La caution est de 2 mois de loyer hors charges.",
    },
    {
      q: "Combien de temps peut-on rester ?",
      a: `Le bail meublé est de 12 mois renouvelable, avec un préavis d'un mois. Nos résidents restent en moyenne ${STATS.averageStayMonths} mois : le temps de s'installer à Genève, de trouver son rythme de frontalier et souvent bien plus.`,
    },
    {
      q: "Y a-t-il une chambre disponible tout de suite ?",
      a: "La disponibilité réelle de nos 3 maisons est affichée en continu sur la page des chambres disponibles, avec les dates de libération. S'il n'y a rien à ta date, tu peux rejoindre la liste d'attente de la maison qui te plaît : on te prévient dès qu'une chambre se libère.",
    },
  ],
  en: [
    {
      q: "Where can you rent a room near Geneva when you work in Switzerland?",
      a: `On the French side, 20 minutes from the centre. Affordable rooms around Geneva are in Annemasse, Ville-la-Grand and Ambilly, linked to the centre by the Léman Express and tram 17. La Villa Coliving offers ${STATS.totalRooms} furnished rooms in ${STATS.totalHouses} houses there, all inclusive from ${PRICE_SHARED_CHF_EN}/month.`,
    },
    {
      q: "How much is a furnished room near Geneva at La Villa Coliving?",
      a: `From ${PRICE_SHARED_CHF_EN}/month all inclusive for a room whose shower room is shared with one other room, ${PRICE_CHF_EN}/month with a private shower room. Rent covers utilities, fibre up to 8 Gb/s, cleaning of the common areas 3 times a week, the shared spaces (pool, sauna, gym depending on the house) and events. No application or agency fee; deposit of 2 months' rent excluding charges.`,
    },
    {
      q: "How is it different from a room in someone's flat or a sublet in Geneva?",
      a: "A room in someone's home or a sublet often comes without a solid lease, with utilities on top and no shared space designed for living. At La Villa you sign a furnished lease in your own name, pay a single all-inclusive rent and share a whole house with 7 to 12 flatmates who, like you, work in Geneva or nearby.",
    },
    {
      q: "What paperwork do you need to rent a room near Geneva?",
      a: "A two-minute online application, then an employment contract or job offer and an ID. We reply within 48 hours, arrange a visit on site or by video, and the furnished lease is signed online. The deposit is 2 months' rent excluding charges.",
    },
    {
      q: "How long can you stay?",
      a: `The furnished lease runs 12 months, renewable, with one month's notice. Our residents stay ${STATS.averageStayMonths} months on average: time to settle in Geneva, find your cross-border rhythm and often much longer.`,
    },
    {
      q: "Is there a room available right now?",
      a: "Real availability across our 3 houses is shown continuously on the available rooms page, with opening dates. If nothing matches your date, join the waiting list of the house you like: we tell you as soon as a room opens up.",
    },
  ],
};

export function ChambreLouerGenevePage() {
  const { language } = useLanguage();
  const en = language === "en";
  const L = en ? "en" as const : "fr" as const;
  const allRooms = useAllRooms();
  const { candidates } = splitRooms(allRooms.rooms);
  const trackRoomCta = (room: PublicRoom) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: "chambre_geneve_room_card", cta_target: "/candidature", house: room.house_slug,
        room_id: `chambre-${room.room_number}`, language,
      });
    } catch { /* noop */ }
  };
  const linkCls = "text-[#1C1917] underline hover:text-[#D4A574]";

  return (
    <main className="relative pt-16">
      <SEO
        // §6 variante B : pas de prix dans le title (S33), « près de Genève » = l'honnêteté du côté France.
        title={en ? "Furnished room to rent near Geneva" : "Chambre à louer près de Genève, meublée"}
        description={en
          ? `Room to rent near Geneva: furnished 17-23 m², all inclusive from ${PRICE_SHARED_CHF_EN}/month, French side 20 min from the centre. No agency fee, reply within 48 h.`
          : `Chambre à louer près de Genève : meublée 17-23 m², tout inclus dès ${PRICE_SHARED_CHF_FR}/mois, côté France à 20 min du centre. 0 frais d'agence, réponse sous 48 h.`}
        image="https://www.lavillacoliving.com/images/le loft/rooms/Chambre 5/chambre-5-vue-large.webp"
      />

      {/* ===== HERO ===== */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {en ? "Furnished rooms · French side of Geneva" : "Chambres meublées · côté France de Genève"}
          </span>
          <h1
            className="text-4xl md:text-6xl font-light text-[#1C1917] mb-6 leading-tight"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {en ? "Furnished, all-inclusive room to rent near Geneva" : "Chambre à louer près de Genève, meublée et tout inclus"}
          </h1>
          <p className="text-lg md:text-xl text-[#57534E] max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
            {en
              ? `Looking for a room to rent in Geneva? Most of them are actually on the French side, 20 minutes from the centre. At La Villa Coliving it is neither a room in someone's flat nor a sublet: a furnished 17-23 m² room in a coliving house with shared spaces, all inclusive from ${PRICE_SHARED_CHF_EN}/month, no agency fee.`
              : `Tu cherches une chambre à louer à Genève ? La plupart sont en réalité côté France, à 20 minutes du centre. Chez La Villa Coliving, ce n'est ni une chambre chez l'habitant ni une sous-location : une chambre meublée de 17 à 23 m² dans une maison de coliving avec ses espaces communs, tout inclus dès ${PRICE_SHARED_CHF_FR}/mois, sans frais d'agence.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LocalizedLink
              to="/chambres-disponibles"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1917] text-white font-semibold rounded-full hover:bg-[#44403C] transition-colors"
            >
              {en ? "See available rooms" : "Voir les chambres disponibles"}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            <LocalizedLink
              to="/tarifs"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1C1917] text-[#1C1917] font-semibold rounded-full hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              {en ? "See pricing" : "Voir les tarifs"}
            </LocalizedLink>
          </div>
          <p className="mt-6 text-xs text-[#78716C]">
            {en ? "Reply within 48 h · No application fee · Video tour available" : "Réponse sous 48 h · Aucun frais de dossier · Visite en visio possible"}
          </p>
        </div>
      </section>

      {/* ===== LES CHAMBRES EN CE MOMENT (store partagé, Lot 3) ===== */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-light text-[#1C1917] mb-3" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {candidates.length > 0
              ? (en
                ? `${candidates.length} room${candidates.length > 1 ? "s" : ""} to rent now or soon`
                : `${candidates.length} chambre${candidates.length > 1 ? "s" : ""} à louer maintenant ou bientôt`)
              : (en ? "Next openings, house by house" : "Prochaines disponibilités, maison par maison")}
          </h2>
          <p className="text-[#57534E] mb-8 max-w-2xl">
            {en
              ? "Real availability of our 3 houses on the French side, with dates and prices. Each room has its own application."
              : "La dispo réelle de nos 3 maisons côté France, avec dates et prix. Chaque chambre a sa propre candidature."}
          </p>
          {candidates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {candidates.map((room) => (
                <RoomCard
                  key={`${room.house_slug}:${room.room_number}`}
                  house={room.house_slug}
                  houseName={HOUSES[room.house_slug].label}
                  room={room}
                  fallbackImage={HOUSES[room.house_slug].img}
                  showHouse
                  onCtaClick={trackRoomCta}
                />
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2">
            {(["lavilla", "leloft", "lelodge"] as HouseKey[]).map((k) => (
              <HouseAvailabilityLine key={k} house={k} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CE QUE TU LOUES VRAIMENT ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {en ? "What you actually rent" : "Ce que tu loues vraiment"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1C1917] text-white p-8 md:col-span-2">
              <BedDouble className="w-10 h-10 text-[#D4A574] mb-4" />
              <p className="text-2xl font-bold text-[#D4A574] mb-4">
                {en ? `From ${PRICE_SHARED_CHF_EN}/month — all inclusive` : `Dès ${PRICE_SHARED_CHF_FR}/mois — tout inclus`}
              </p>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                {en
                  ? `${PRICE_SHARED_CHF_EN}/month all inclusive for rooms whose shower room is shared with just one other room, cleaned by our housekeeping team. ${PRICE_CHF_EN}/month all inclusive with a private shower room. Furnished rooms of 17 to 23 m², ${STATS.livingSpacePerResidentMin}-${STATS.livingSpacePerResidentMax} m² of living space per resident once the shared spaces are counted.`
                  : `${PRICE_SHARED_CHF_FR}/mois tout inclus pour les chambres dont la salle d'eau est partagée avec une seule autre chambre, entretenue par notre équipe de ménage. ${PRICE_CHF_FR}/mois tout inclus avec salle d'eau privative. Chambres meublées de 17 à 23 m², ${STATS.livingSpacePerResidentMin} à ${STATS.livingSpacePerResidentMax} m² d'espace de vie par résident avec les espaces communs.`}
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                {(en
                  ? ["Furnished lease in your name", "Utilities and fibre up to 8 Gb/s included", "Housekeeping of common areas 3×/week", "Pool, sauna, gym depending on the house", "No agency fee, no application fee"]
                  : ["Bail meublé à ton nom", "Charges et fibre jusqu'à 8 Gb/s comprises", "Ménage des communs 3×/semaine", "Piscine, sauna, salle de sport selon la maison", "0 frais d'agence, 0 frais de dossier"]
                ).map((item) => (
                  <li key={item} className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 border border-[#E7E5E4]">
              <Sparkles className="w-10 h-10 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {en ? "A room in someone's flat, or a sublet in Geneva?" : "Une chambre chez l'habitant, ou une sous-location à Genève ?"}
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                {en
                  ? "Often no solid lease, utilities on top, a corner of someone else's home. Here you get a whole house: your room, and a kitchen, living room, garden and shared spaces designed to live in, with people who work in Geneva like you."
                  : "Souvent pas de vrai bail, des charges en plus, un coin dans le logement de quelqu'un d'autre. Ici, une maison entière : ta chambre, et une cuisine, un salon, un jardin et des espaces communs pensés pour vivre, avec des gens qui travaillent à Genève comme toi."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POURQUOI CÔTÉ FRANCE ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <Train className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {en ? "Why the French side, 20 minutes from Geneva" : "Pourquoi côté France, à 20 minutes de Genève"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(en
              ? [
                  ["Geneva city centre in 20 minutes", "Léman Express from Annemasse (Eaux-Vives in 8 min, Cornavin direct), tram 17 from Moillesulaz, buses TPG. Door to door, count 20 minutes."],
                  ["Space and comfort, not a compromise", `${STATS.livingSpacePerResidentMin} to ${STATS.livingSpacePerResidentMax} m² of living space per resident, a real garden, a pool or a gym depending on the house. The choice is comfort, not the smallest possible flat.`],
                  ["Simple paperwork for cross-border workers", "Furnished lease in French law, a single monthly rent, a clear proof of address for your permit G and Swiss employer. We reply within 48 hours."],
                ]
              : [
                  ["Genève centre en 20 minutes", "Léman Express depuis Annemasse (Eaux-Vives en 8 min, Cornavin direct), tram 17 depuis Moillesulaz, bus TPG. Porte à porte, compte 20 minutes."],
                  ["De l'espace et du confort, pas un compromis", `${STATS.livingSpacePerResidentMin} à ${STATS.livingSpacePerResidentMax} m² d'espace de vie par résident, un vrai jardin, une piscine ou une salle de sport selon la maison. Le choix, c'est le confort, pas le plus petit logement possible.`],
                  ["Des démarches simples pour un frontalier", "Bail meublé en droit français, un seul loyer mensuel, un justificatif de domicile clair pour ton permis G et ton employeur suisse. Réponse sous 48 h."],
                ]
            ).map(([title, text]) => (
              <div key={title} className="bg-[#FAF9F6] p-8">
                <h3 className="text-xl font-medium text-[#1C1917] mb-3">{title}</h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-[#57534E]">
            {en ? "Looking for a flatshare rather than a single room? " : "Tu cherches plutôt une colocation qu'une chambre seule ? "}
            <LocalizedLink to={colocGeneveHref(language)} className={linkCls}>
              {en ? "Shared housing in Geneva, French side" : "Colocation à Genève, côté France"}
            </LocalizedLink>
          </p>
        </div>
      </section>

      {/* ===== COMMENT LOUER — 4 ÉTAPES ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {en ? "How to rent your room — 4 steps" : "Comment louer ta chambre — 4 étapes"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "1", fr: ["Candidature en ligne", "2 minutes pour ton profil, ta date d'arrivée et la maison qui te plaît."], en: ["Online application", "2 minutes for your profile, move-in date and favourite house."] },
              { num: "2", fr: ["Réponse sous 48 h", "On t'appelle pour confirmer la disponibilité et le fit avec la maison."], en: ["Reply within 48 h", "We call to confirm availability and the fit with the house."] },
              { num: "3", fr: ["Visite", "Sur place ou en visio, de la maison et de la chambre disponible."], en: ["Visit", "On site or by video, of the house and the available room."] },
              { num: "4", fr: ["Emménagement", "Bail meublé signé en ligne, caution de 2 mois hors charges, tu arrives avec ta valise."], en: ["Move in", "Furnished lease signed online, 2-month deposit excluding charges, you arrive with your suitcase."] },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#1C1917] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">{step.num}</div>
                <h3 className="text-lg font-medium text-[#1C1917] mb-2">{(en ? step.en : step.fr)[0]}</h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{(en ? step.en : step.fr)[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        title={en ? "Renting a room near Geneva — frequently asked questions" : "Louer une chambre près de Genève — questions fréquentes"}
        items={FAQ[L]}
        emitSchema
      />

      {/* ===== CTA ===== */}
      <section className="py-24 lg:py-32 bg-[#1C1917] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Calendar className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-light mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? "See the rooms available right now" : "Voir les chambres disponibles maintenant"}
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            {en
              ? `Availability changes every week across our ${STATS.totalRooms} rooms. Pick a room or join a waiting list: we reply within 48 h.`
              : `Les disponibilités évoluent chaque semaine sur nos ${STATS.totalRooms} chambres. Choisis une chambre ou rejoins une liste d'attente : on te répond sous 48 h.`}
          </p>
          <LocalizedLink
            to="/chambres-disponibles"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1C1917] font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            {en ? "Available rooms" : "Chambres disponibles"}
            <ArrowRight className="w-5 h-5" />
          </LocalizedLink>
        </div>
      </section>

      {/* ===== Pages liées ===== */}
      <section className="py-12 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#78716C] mb-4">{en ? "Related pages" : "Pages liées"}</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <LocalizedLink to={colocGeneveHref(language)} className={linkCls}>{en ? "Shared housing Geneva" : "Colocation Genève"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/chambre-a-louer-annemasse" className={linkCls}>{en ? "Rooms for rent in Annemasse" : "Chambre à louer à Annemasse"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/annemasse-colocation" className={linkCls}>{en ? "Annemasse coliving guide" : "Colocation à Annemasse"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/nos-maisons" className={linkCls}>{en ? "Our 3 houses" : "Nos 3 maisons"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/tarifs" className={linkCls}>{en ? "Pricing" : "Tarifs"}</LocalizedLink>
          </div>
        </div>
      </section>

      {/* État chambres embarqué au prérendu — toutes maisons, instance unique par page. */}
      <RoomsEmbed />
      <WhatsAppButton context="chambre-a-louer-geneve" />
    </main>
  );
}
