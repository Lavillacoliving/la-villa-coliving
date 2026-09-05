import { EntityFacts } from "@/components/EntityFacts";
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
 * /chambre-a-louer-geneve · /en/chambre-a-louer-geneve — Lot 6 du plan SEO funnel, spécification révisée
 * du 04/09/2026. Requête de CONQUÊTE « chambre à louer genève » (140/mois, +357 %) : la SERP est 100 %
 * annuaires — la page a la FORME D'UN ANNUAIRE (liste datée en CHF d'abord), le texte vient après.
 * Blocs : liste des chambres → prix d'une chambre à Genève (PAA loyer moyen, coût total) → chambre meublée
 * prête à vivre → chez l'habitant, sous-location ou coliving ? → conditions pour louer → nos 3 maisons →
 * à N min de Genève → FAQ (FAQPage, 5 questions) → CTA. Pas de cible « étudiant » (décision 03/09).
 * Fact block : « dès 1 370 CHF », 16-24 m² (STATS.roomSizeMin/Max), 20 min porte à porte (décision Jérôme 04/09), caution 2 mois
 * hors charges, 0 frais ; jamais « moins cher que Genève » : coût total et confort, CHF des deux côtés.
 * /chambre-a-louer-annemasse reste la page locale (inventaire du Lodge), liée en croisé.
 */
const MIN = STATS.genevaCenterMinutes;
const FAQ: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Quel est le loyer moyen d'une chambre à louer à Genève ?",
      a: "À Genève même, d'après les annonces relevées en 2026, une chambre en colocation ou chez l'habitant se loue le plus souvent entre 1 000 et 1 500 CHF par mois, charges, internet et ménage souvent en plus (relevé de notre Observatoire du logement frontalier, juin 2026), et l'offre est rare (taux de vacance sous 1 %, OCSTAT). C'est pour ça que beaucoup cherchent leur chambre côté France, à 20 minutes du centre : le même budget donne une chambre meublée dans une maison entière.",
    },
    {
      q: `Combien coûte une chambre meublée près de Genève chez La Villa Coliving ?`,
      a: `Dès ${PRICE_SHARED_CHF_FR}/mois tout inclus pour une chambre dont la salle d'eau est partagée avec une seule autre chambre, ${PRICE_CHF_FR}/mois avec salle d'eau privative. Le montant est le coût mensuel total : loyer, charges, fibre jusqu'à 8 Gb/s, ménage des communs 3 fois par semaine, espaces communs (piscine, sauna, salle de sport selon la maison) et événements. 0 frais de dossier, 0 frais d'agence, caution de ${STATS.depositMonths} mois de loyer hors charges.`,
    },
    {
      q: "Quelles sont les conditions pour louer une chambre près de Genève ?",
      a: `Une candidature en ligne de deux minutes, puis un contrat de travail ou une promesse d'embauche et une pièce d'identité. Aucun historique locatif suisse ni garant suisse n'est demandé. Réponse sous 48 h, visite sur place ou en visio, bail meublé français à ton nom (${STATS.leaseDurationMonths} mois renouvelable, préavis d'${STATS.noticePeriodMonths} mois) signé en ligne, emménagement possible en une semaine.`,
    },
    {
      q: "Où trouver une chambre chez l'habitant près de Genève ?",
      a: "Les portails d'annonces et les groupes d'entraide en proposent, des deux côtés de la frontière, avec leurs limites : pas toujours de bail, des charges à part, un coin dans le logement de quelqu'un d'autre. Chez La Villa, ce n'est pas une chambre chez l'habitant : tu loues ta chambre avec un bail à ton nom, dans une maison partagée avec 7 à 12 colocataires qui travaillent à Genève ou dans la région, sans propriétaire sur place.",
    },
    {
      q: "Chambre chez l'habitant, sous-location ou coliving : quelle différence ?",
      a: "Chez l'habitant, tu vis chez quelqu'un, selon ses règles. En sous-location, ton droit d'occuper dépend du bail d'un autre. En coliving, tu signes un bail direct, meublé, à ton nom, avec un seul loyer tout compris, et tu partages une maison pensée pour vivre à plusieurs. Les trois existent près de Genève ; seule la dernière te donne un contrat solide et une maison entière.",
    },
  ],
  en: [
    {
      q: "What is the average rent for a room in Geneva?",
      a: "In Geneva itself, based on listings observed in 2026, a room in a shared flat or in someone's home usually rents for 1,000 to 1,500 CHF a month, often with bills, internet and cleaning on top (our cross-border housing Observatory survey, June 2026), and supply is scarce (vacancy rate below 1%, OCSTAT). That is why many people look for their room on the French side, 20 minutes from the centre: the same budget gets a furnished room in a whole house.",
    },
    {
      q: "How much is a furnished room near Geneva at La Villa Coliving?",
      a: `From ${PRICE_SHARED_CHF_EN}/month all inclusive for a room whose shower room is shared with one other room, ${PRICE_CHF_EN}/month with a private shower room. The figure is the total monthly cost: rent, bills, fibre up to 8 Gb/s, cleaning of the common areas 3 times a week, shared spaces (pool, sauna, gym depending on the house) and events. No application or agency fee, deposit of ${STATS.depositMonths} months' rent excluding charges.`,
    },
    {
      q: "What are the conditions to rent a room near Geneva?",
      a: `A two-minute online application, then an employment contract or job offer and an ID. No Swiss rental history or Swiss guarantor is required. Reply within 48 h, visit on site or by video, French furnished lease in your name (${STATS.leaseDurationMonths} months renewable, ${STATS.noticePeriodMonths}-month notice) signed online, move-in possible within a week.`,
    },
    {
      q: "Where can you find a room in someone's home near Geneva?",
      a: "Listing portals and community groups offer them on both sides of the border, with their limits: not always a lease, bills on top, a corner of someone else's home. At La Villa it is not a room in someone's home: you rent your room with a lease in your name, in a house shared with 7 to 12 flatmates who work in Geneva or nearby, with no landlord on site.",
    },
    {
      q: "Room in someone's home, sublet or coliving: what is the difference?",
      a: "In someone's home you live by their rules. In a sublet, your right to stay depends on someone else's lease. In coliving you sign a direct, furnished lease in your name, with a single all-inclusive rent, and share a house designed for living together. All three exist near Geneva; only the last one gives you a solid contract and a whole house.",
    },
  ],
};

export function ChambreLouerGenevePage() {
  const { language } = useLanguage();
  const en = language === "en";
  const L = en ? "en" as const : "fr" as const;
  const allRooms = useAllRooms();
  const { candidates } = splitRooms(allRooms.rooms);
  const n = candidates.length;
  const trackRoomCta = (room: PublicRoom) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: "chambre_geneve_room_card", cta_target: "/candidature", house: room.house_slug,
        room_id: `chambre-${room.room_number}`, language,
      });
    } catch { /* noop */ }
  };
  const link = "text-[#1C1917] underline underline-offset-4 hover:text-[#D4A574]";
  const h2 = "text-3xl md:text-4xl font-light text-[#1C1917] mb-6";
  const serif = { fontFamily: '"DM Serif Display", serif' } as const;

  return (
    <main className="relative pt-16">
      <SEO
        // §6 variante B : pas de prix dans le title (Q8, confirmé le 04/09) ; meta sans « 3 mois minimum » (Q13, confirmé le 04/09).
        // (ajustement Jérôme 04/09) pluriel aligné sur le H1 + « tout inclus », sans prix (Q8) ; > 65 c. avec la marque → pas de suffixe (S33).
        title={en ? "Rooms to rent near Geneva: furnished, all inclusive" : "Chambres à louer près de Genève : meublées, tout inclus"}
        description={en
          ? `Furnished rooms to rent on the French side, ${MIN} min door to door from Geneva: bills, fibre, cleaning included, from ${PRICE_SHARED_CHF_EN}. Live availability.`
          : `Chambres meublées à louer côté France, à ${MIN} min porte-à-porte de Genève : charges, fibre et ménage compris, dès ${PRICE_SHARED_CHF_FR} tout inclus. Dispo en temps réel.`}
        image="https://www.lavillacoliving.com/images/le loft/rooms/Chambre 5/chambre-5-vue-large.webp"
      />

      {/* ===== HERO ===== */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {en ? "Furnished rooms · French side of Geneva" : "Chambres meublées · côté France de Genève"}
          </span>
          <h1 className="text-4xl md:text-6xl font-light text-[#1C1917] mb-6 leading-tight" style={serif}>
            {en ? "Rooms to rent near Geneva, furnished and all inclusive" : "Chambres à louer près de Genève, meublées et tout inclus"}
          </h1>
          <p className="text-lg md:text-xl text-[#57534E] max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
            {en
              ? `Looking for a room to rent in Geneva? Most affordable ones are on the French side, ${MIN} minutes door to door from the centre. Below: every room available in our ${STATS.totalHouses} houses, with date and price in CHF, all inclusive from ${PRICE_SHARED_CHF_EN}/month. Neither a room in someone's home nor a sublet: a lease in your name in a whole house.`
              : `Tu cherches une chambre à louer à Genève ? La plupart des chambres abordables sont côté France, à ${MIN} minutes porte-à-porte du centre. Ci-dessous, toutes les chambres disponibles dans nos ${STATS.totalHouses} maisons, avec la date et le prix en CHF, tout inclus dès ${PRICE_SHARED_CHF_FR}/mois. Ni chambre chez l'habitant ni sous-location : un bail à ton nom dans une maison entière.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#chambres" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1917] text-white font-semibold rounded-full hover:bg-[#44403C] transition-colors">
              {en ? "See the rooms" : "Voir les chambres"}
              <ArrowRight className="w-5 h-5" />
            </a>
            <LocalizedLink to="/tarifs" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1C1917] text-[#1C1917] font-semibold rounded-full hover:bg-[#1C1917] hover:text-white transition-colors">
              {en ? "See pricing" : "Voir les tarifs"}
            </LocalizedLink>
          </div>
          <p className="mt-6 text-xs text-[#78716C]">
            {en ? "Reply within 48 h · No application fee · Video tour available" : "Réponse sous 48 h · Aucun frais de dossier · Visite en visio possible"}
          </p>
        </div>
      </section>

      {/* ===== BLOC 1 — LA LISTE (forme d'annuaire : chambres, prix, dates) ===== */}
      <section id="chambres" className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={h2} style={serif}>
            {n > 0
              ? (en ? `${n} furnished room${n > 1 ? "s" : ""} to rent near Geneva, all inclusive` : `${n} chambre${n > 1 ? "s" : ""} à louer près de Genève, meublée${n > 1 ? "s" : ""} et tout inclus`)
              : (en ? "Next rooms opening near Geneva, house by house" : "Prochaines chambres près de Genève, maison par maison")}
          </h2>
          <p className="text-[#57534E] mb-8 max-w-2xl">
            {en
              ? "Sorted by opening date. Real availability of our 3 houses on the French side, read from the same data as our bookings: size, bathroom, price in CHF, date. Each room has its own application."
              : "Triées par date de libération. La dispo réelle de nos 3 maisons côté France, lue sur la même source que nos réservations : surface, salle d'eau, prix en CHF, date. Chaque chambre a sa propre candidature."}
          </p>
          {n > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {candidates.map((room) => (
                <RoomCard key={`${room.house_slug}:${room.room_number}`} house={room.house_slug} houseName={HOUSES[room.house_slug].label} room={room} fallbackImage={HOUSES[room.house_slug].img} showHouse onCtaClick={trackRoomCta} />
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2 mb-6">
            {(["lavilla", "leloft", "lelodge"] as HouseKey[]).map((k) => <HouseAvailabilityLine key={k} house={k} />)}
          </div>
          <p className="text-sm text-[#57534E]">
            {en ? "Nothing at your date? " : "Rien à ta date ? "}
            <LocalizedLink to="/chambres-disponibles" className={link}>{en ? "Join a waiting list on the available rooms page" : "Rejoins une liste d'attente sur la page des chambres disponibles"}</LocalizedLink>
            {en ? " — we reply within 48 h." : " — on te répond sous 48 h."}
          </p>
        </div>
      </section>

      {/* ===== H2 — PRIX D'UNE CHAMBRE À LOUER À GENÈVE ===== */}
      <section className="py-20 lg:py-24 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className={h2} style={serif}>{en ? "Price of a room to rent in Geneva" : "Prix d'une chambre à louer à Genève"}</h2>
          <p className="text-[#57534E] leading-relaxed mb-6">
            {en
              ? `In Geneva itself, based on listings observed in 2026, a room usually rents for 1,000 to 1,500 CHF a month and a studio 1,800 to 2,500 CHF excluding charges, around 50 CHF/m² advertised according to our cross-border housing Observatory survey (June 2026); the vacancy rate is below 1% (OCSTAT). « Cheap room in Geneva »: compare the total cost, not the advertised rent. In Geneva you add bills, an internet subscription, cleaning and the furniture to buy to the bare rent; on the French side, at La Villa Coliving, the package from ${PRICE_SHARED_CHF_EN}/month includes everything: furnished room, bills, fibre, cleaning of the common areas, pool, sauna, gym. Comfort and space make the difference, not the lowest rent.`
              : `À Genève même, d'après les annonces relevées en 2026, une chambre se loue le plus souvent entre 1 000 et 1 500 CHF par mois, et un studio 1 800 à 2 500 CHF hors charges, soit autour de 50 CHF/m² en annonce selon le relevé de notre Observatoire du logement frontalier (juin 2026) ; le taux de vacance est sous 1 % (OCSTAT). « Chambre pas chère à Genève » : compare le coût total, pas le loyer affiché. À Genève, au loyer nu s'ajoutent les charges, l'abonnement internet, le ménage et le mobilier à acheter ; côté France, chez La Villa Coliving, le forfait dès ${PRICE_SHARED_CHF_FR}/mois comprend tout : chambre meublée, charges, fibre, ménage des communs, piscine, sauna, salle de sport. Le confort et l'espace font la différence, pas le loyer le plus bas.`}
          </p>
          <p className="text-sm text-[#78716C] mb-6">
            {en ? "Source and method: " : "Source et méthode : "}
            <LocalizedLink to="/observatoire-logement-frontalier-geneve" className="underline underline-offset-4 hover:text-[#1C1917]">{en ? "our cross-border housing Observatory, Geneva and the Léman Express axis (June 2026)" : "notre Observatoire du logement frontalier, Genève et l'axe Léman Express (juin 2026)"}</LocalizedLink>
          </p>
          <div className="bg-white border border-[#E7E5E4] p-6 md:p-8 mb-6">
            <BedDouble className="w-8 h-8 text-[#D4A574] mb-3" />
            <p className="text-2xl font-bold text-[#D4A574] mb-3">{en ? `From ${PRICE_SHARED_CHF_EN}/month, total monthly cost` : `Dès ${PRICE_SHARED_CHF_FR}/mois, coût mensuel total`}</p>
            <p className="text-[#57534E] leading-relaxed mb-4">
              {en
                ? `${PRICE_SHARED_CHF_EN} for a room whose shower room is shared with one other room, ${PRICE_CHF_EN} with a private shower room. Compare total cost with total cost, in CHF on both sides: here nothing is added at the end of the month.`
                : `${PRICE_SHARED_CHF_FR} pour une chambre dont la salle d'eau est partagée avec une seule autre chambre, ${PRICE_CHF_FR} avec salle d'eau privative. Compare coût total et coût total, en CHF des deux côtés : ici, rien ne s'ajoute en fin de mois.`}
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-[#44403C]">
              {(en
                ? [`Furnished room, ${STATS.roomSizeMin}-${STATS.roomSizeMax} m²`, "Bills, water, heating, fibre up to 8 Gb/s", "Cleaning of common areas 3×/week", "Pool, sauna, gym depending on the house", "No agency fee, no application fee", `Deposit: ${STATS.depositMonths} months' rent excluding charges`]
                : [`Chambre meublée, ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m²`, "Charges, eau, chauffage, fibre jusqu'à 8 Gb/s", "Ménage des communs 3×/semaine", "Piscine, sauna, salle de sport selon la maison", "0 frais d'agence, 0 frais de dossier", `Caution : ${STATS.depositMonths} mois de loyer hors charges`]
              ).map((item) => <li key={item} className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" />{item}</li>)}
            </ul>
          </div>
          <p className="text-[#57534E]"><LocalizedLink to="/tarifs" className={link}>{en ? "See what the rent includes" : "Voir le détail des tarifs"}</LocalizedLink></p>
        </div>
      </section>

      {/* ===== H2 — CHAMBRE MEUBLÉE, PRÊTE À VIVRE ===== */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className={h2} style={serif}>{en ? "A furnished room, ready to live in" : "Chambre meublée, prête à vivre"}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-[#1C1917] mb-2">{en ? "In the room" : "Dans la chambre"}</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                {en
                  ? `17 to 23 m², a double bed with linen, a desk, storage, fibre up to 8 Gb/s, and a shower room that is private or shared with a single other room. You arrive with a suitcase.`
                  : `${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², un lit double avec sa parure, un bureau, des rangements, la fibre jusqu'à 8 Gb/s, et une salle d'eau privative ou partagée avec une seule autre chambre. Tu arrives avec une valise.`}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#1C1917] mb-2">{en ? "In the house" : "Dans la maison"}</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                {en
                  ? `A kitchen, a living room, a garden, and depending on the house a pool, a sauna or a gym: ${STATS.livingSpacePerResidentMin} to ${STATS.livingSpacePerResidentMax} m² of living space per resident. Common areas cleaned 3 times a week, weekly yoga, monthly events, and 7 to 12 flatmates who work in Geneva like you.`
                  : `Une cuisine, un salon, un jardin, et selon la maison une piscine, un sauna ou une salle de sport : ${STATS.livingSpacePerResidentMin} à ${STATS.livingSpacePerResidentMax} m² d'espace de vie par résident. Communs entretenus 3 fois par semaine, yoga hebdomadaire, événements mensuels, et 7 à 12 colocataires qui travaillent à Genève comme toi.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== H2 — CHEZ L'HABITANT, SOUS-LOCATION OU COLIVING ? ===== */}
      <section className="py-20 lg:py-24 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className={h2} style={serif}>{en ? "Room in someone's home, sublet or coliving?" : "Chambre chez l'habitant, sous-location ou coliving ?"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(en
              ? [["In someone's home", "You live in the landlord's flat, by their rules, often without a real lease. Fine for a few weeks; hard to make a home."], ["Sublet", "Your right to stay depends on someone else's lease. Bills on top, no guarantee of duration, and the main tenant between you and the owner."], ["Coliving at La Villa", "A direct, furnished lease in your name, a single all-inclusive rent, a whole house shared with people who work in Geneva, and no landlord on site."]]
              : [["Chez l'habitant", "Tu vis dans le logement du propriétaire, selon ses règles, souvent sans vrai bail. Bien pour quelques semaines ; difficile d'en faire un chez-toi."], ["Sous-location", "Ton droit d'occuper dépend du bail de quelqu'un d'autre. Charges en plus, aucune garantie de durée, et le locataire principal entre toi et le propriétaire."], ["Coliving chez La Villa", "Un bail direct, meublé, à ton nom, un seul loyer tout compris, une maison entière partagée avec des gens qui travaillent à Genève, et pas de propriétaire sur place."]]
            ).map(([t, d]) => (
              <div key={t} className={`p-6 ${t.includes("Villa") ? "bg-[#1C1917] text-white" : "bg-white border border-[#E7E5E4]"}`}>
                <Sparkles className={`w-6 h-6 mb-3 ${t.includes("Villa") ? "text-[#D4A574]" : "text-[#78716C]"}`} />
                <h3 className="text-lg font-medium mb-2">{t}</h3>
                <p className={`text-sm leading-relaxed ${t.includes("Villa") ? "text-white/80" : "text-[#57534E]"}`}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== H2 — CONDITIONS POUR LOUER UNE CHAMBRE ===== */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className={h2} style={serif}>{en ? "Conditions to rent a room" : "Conditions pour louer une chambre"}</h2>
          <p className="text-[#57534E] leading-relaxed mb-8">
            {en
              ? "A Geneva lease usually asks for a Swiss rental history, a local guarantor and a deposit of up to three months. On the French side, at La Villa, the file is simple and the same for cross-border workers and Swiss residents who move over:"
              : "Un bail genevois demande le plus souvent un historique locatif suisse, un garant local et un dépôt pouvant atteindre trois mois. Côté France, chez La Villa, le dossier est simple et le même pour un frontalier ou un résident suisse qui passe la frontière :"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "1", fr: ["Candidature en ligne", "2 minutes : ton profil, ta date d'arrivée, la maison qui te plaît."], en: ["Online application", "2 minutes: your profile, move-in date and favourite house."] },
              { num: "2", fr: ["Dossier", "Contrat de travail ou promesse d'embauche, pièce d'identité. Ni historique locatif suisse ni garant suisse."], en: ["File", "Employment contract or job offer, ID. No Swiss rental history, no Swiss guarantor."] },
              { num: "3", fr: ["Réponse sous 48 h et visite", "Sur place ou en visio, de la maison et de la chambre."], en: ["Reply within 48 h and visit", "On site or by video, of the house and the room."] },
              { num: "4", fr: ["Bail et emménagement", `Bail meublé à ton nom signé en ligne, caution de ${STATS.depositMonths} mois hors charges, tu arrives avec ta valise.`], en: ["Lease and move-in", `Furnished lease in your name signed online, ${STATS.depositMonths}-month deposit excluding charges, you arrive with your suitcase.`] },
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

      {/* ===== H2 — NOS 3 MAISONS ===== */}
      <section className="py-20 lg:py-24 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={h2} style={serif}>{en ? "Our 3 houses" : "Nos 3 maisons"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["lavilla", "leloft", "lelodge"] as HouseKey[]).map((k) => (
              <div key={k} className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden flex flex-col">
                <LocalizedLink to={`/${k}`} className="block relative aspect-[16/10] overflow-hidden">
                  <img src={HOUSES[k].img} alt={HOUSES[k].label} className="w-full h-full object-cover" loading="lazy" width={800} height={500} />
                </LocalizedLink>
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <h3 className="text-xl font-medium text-[#1C1917]">{HOUSES[k].label}</h3>
                  <p className="text-sm text-[#78716C]">{en ? HOUSES[k].descEn : HOUSES[k].descFr}</p>
                  <HouseAvailabilityLine house={k} />
                  <LocalizedLink to={`/${k}`} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#1C1917] hover:text-[#D4A574]">
                    {en ? `Discover ${HOUSES[k].label}` : `Découvrir ${HOUSES[k].label}`}<ArrowRight className="w-4 h-4" />
                  </LocalizedLink>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-[#57534E]">
            {en ? "Rooms in Annemasse only? " : "Uniquement à Annemasse ? "}
            <LocalizedLink to="/chambre-a-louer-annemasse" className={link}>{en ? "Le Lodge in Annemasse: 12 rooms" : "Le Lodge, à Annemasse : 12 chambres"}</LocalizedLink>
            {en ? " · Looking for a flatshare rather than a single room? " : " · Plutôt une colocation qu'une chambre seule ? "}
            <LocalizedLink to={colocGeneveHref(language)} className={link}>{en ? "Shared housing in Geneva, French side" : "Colocation à Genève côté France"}</LocalizedLink>
          </p>
        </div>
      </section>

      {/* ===== H2 — À N MIN DE GENÈVE ===== */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Train className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
          <h2 className={h2} style={serif}>{en ? `${MIN} minutes door to door from Geneva` : `À ${MIN} min porte-à-porte de Genève`}</h2>
          <p className="text-[#57534E] leading-relaxed max-w-3xl mx-auto mb-8">
            {en
              ? `Door to door, count ${MIN} minutes to the centre of Geneva: Léman Express from Annemasse (Eaux-Vives in 8 minutes, Cornavin in 15 minutes by direct train), tram 17 from the Moillesulaz border, TPG buses. The border is a few minutes from every house.`
              : `Porte à porte, compte ${MIN} minutes jusqu'au centre de Genève : Léman Express depuis Annemasse (Eaux-Vives en 8 minutes, Cornavin en 15 minutes de train direct), tram 17 depuis la douane de Moillesulaz, bus TPG. La frontière est à quelques minutes de chaque maison.`}
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-[#44403C]">
            {(en
              ? [["Le Lodge · Annemasse", "Léman Express direct, Cornavin in 15 min"], ["Le Loft · Ambilly", "500 m from the Moillesulaz border, tram 17"], ["La Villa · Ville-la-Grand", "Léman Express and tram 17 within walking distance"]]
              : [["Le Lodge · Annemasse", "Léman Express direct, Cornavin en 15 min"], ["Le Loft · Ambilly", "À 500 m de la douane de Moillesulaz, tram 17"], ["La Villa · Ville-la-Grand", "Léman Express et tram 17 à pied"]]
            ).map(([t, d]) => <div key={t} className="bg-[#FAF9F6] p-5"><p className="font-medium text-[#1C1917] mb-1">{t}</p><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      {/* (Lot S1) Fiche de faits canonique */}
      <section className="py-10 bg-white"><div className="max-w-3xl mx-auto px-6"><EntityFacts page="chambre-a-louer-geneve" /></div></section>
      <FaqSection title={en ? "Renting a room near Geneva — frequently asked questions" : "Louer une chambre près de Genève — questions fréquentes"} items={FAQ[L]} emitSchema />

      {/* ===== CTA ===== */}
      <section className="py-24 lg:py-32 bg-[#1C1917] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Calendar className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-light mb-6" style={serif}>{en ? "See the rooms available right now" : "Voir les chambres disponibles maintenant"}</h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            {en ? `Availability changes every week across our ${STATS.totalRooms} rooms. Pick a room or join a waiting list: we reply within 48 h.` : `Les disponibilités évoluent chaque semaine sur nos ${STATS.totalRooms} chambres. Choisis une chambre ou rejoins une liste d'attente : on te répond sous 48 h.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LocalizedLink to="/chambres-disponibles" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1C1917] font-semibold rounded-full hover:bg-gray-100 transition-colors">{en ? "Available rooms" : "Chambres disponibles"}<ArrowRight className="w-5 h-5" /></LocalizedLink>
            <LocalizedLink to="/candidature" className="inline-flex items-center gap-2 px-8 py-4 border border-white/40 text-white font-semibold rounded-full hover:bg-white hover:text-[#1C1917] transition-colors">{en ? "Apply" : "Candidater"}</LocalizedLink>
          </div>
        </div>
      </section>

      {/* ===== Pages liées ===== */}
      <section className="py-12 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#78716C] mb-4">{en ? "Related pages" : "Pages liées"}</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <LocalizedLink to="/chambres-disponibles" className={link}>{en ? "Available rooms" : "Chambres disponibles"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to={colocGeneveHref(language)} className={link}>{en ? "Shared housing Geneva" : "Colocation Genève"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/chambre-a-louer-annemasse" className={link}>{en ? "lavillacoliving.com/en/chambre-a-louer-annemasse" : "lavillacoliving.com/chambre-a-louer-annemasse"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/annemasse-colocation" className={link}>{en ? "Our Annemasse guide" : "Notre guide d'Annemasse"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/nos-maisons" className={link}>{en ? "Our 3 houses" : "Nos 3 maisons"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/tarifs" className={link}>{en ? "Pricing" : "Tarifs"}</LocalizedLink>
          </div>
        </div>
      </section>

      <RoomsEmbed />
      <WhatsAppButton context="chambre-a-louer-geneve" />
    </main>
  );
}
