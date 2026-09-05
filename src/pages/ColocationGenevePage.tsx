import { EntityFacts } from "@/components/EntityFacts";
import { Helmet } from "react-helmet";
import { ArrowRight, Check, Train, Users, Home, Clock, Euro } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { SEO } from "@/components/SEO";
import { FaqSection } from "@/components/FaqSection";
import { RoomCard } from "@/components/RoomCard";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { HouseAvailabilityLine } from "@/components/HouseAvailabilityLine";
import { WaitlistForm } from "@/components/WaitlistForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOUSES } from "@/data/houses";
import { colocationGeneveFaq } from "@/data/faq/colocationGeneveFaq";
import { STATS, STATS_SHARED_BATH, PRICE_CHF_FR, PRICE_CHF_EN, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN } from "@/data/stats";
import { COLOC_GENEVE_ARTICLE, COLOC_GENEVE_PILLAR_EN, COLOC_GENEVE_PILLAR_FR } from "@/lib/siteLinks";
import { useAllRooms, splitRooms, type HouseKey, type PublicRoom } from "@/lib/availability";

/**
 * /colocation-geneve · /en/colocation-geneve — Lot 5 du plan SEO funnel, spécification révisée du
 * 04/09/2026 (gel levé par Jérôme). Page money « je cherche une chambre » : la SERP « colocation genève »
 * récompense la FORME D'UN INVENTAIRE (chambres, prix, dates) qui répond aux quatre questions
 * « Autres questions posées ». Structure en 8 blocs : cartes chambres au-dessus de la ligne de
 * flottaison → combien ça coûte → comment faire (frontalier ou résident suisse) → nos 3 maisons →
 * à N min de Genève → où chercher → FAQ (FAQPage) → CTA. L'article « Trouver une colocation à Genève »
 * garde l'intention « comment chercher » ; pas de canonical entre les deux.
 * Règles : CHF des deux côtés de toute comparaison, jamais un loyer français en euros ici, aucun
 * concurrent nommé, jamais « complet », tutoiement, prix depuis src/data/stats.ts.
 * Données : store partagé v_public_rooms (Lot 3) — les cartes sont dans le HTML prérendu (RoomsEmbed).
 */
const PAGE_LAST_UPDATED = "2026-09-04";
const PAGE_FIRST_PUBLISHED = "2026-02-17";
const HOUSE_ORDER: HouseKey[] = ["lavilla", "leloft", "lelodge"];

export function ColocationGenevePage() {
  const { language } = useLanguage();
  const en = language === "en";
  const L = en ? "en" as const : "fr" as const;
  const MIN = STATS.genevaCenterMinutes;
  const PILLAR_URL = `https://www.lavillacoliving.com${en ? COLOC_GENEVE_PILLAR_EN : COLOC_GENEVE_PILLAR_FR}`;
  const allRooms = useAllRooms();
  const { candidates } = splitRooms(allRooms.rooms);
  const n = candidates.length;
  const trackRoomCta = (room: PublicRoom) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: "coloc_geneve_room_card", cta_target: "/candidature", house: room.house_slug,
        room_id: `chambre-${room.room_number}`, language,
      });
    } catch { /* noop */ }
  };

  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: en ? "Furnished room in shared housing near Geneva, French side" : "Chambre meublée en colocation près de Genève, côté France",
    description: en
      ? "All-inclusive furnished room: rent, utilities, fibre internet, cleaning of common areas 3x/week, shared spaces and community events."
      : "Chambre meublée tout inclus : loyer, charges, fibre, ménage des communs 3x/semaine, espaces communs et événements.",
    price: String(STATS_SHARED_BATH.priceChf),
    priceCurrency: "CHF",
    priceValidUntil: "2026-12-31",
    availability: n > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    url: PILLAR_URL,
    seller: { "@type": "Organization", name: "La Villa Coliving", url: "https://www.lavillacoliving.com" },
    areaServed: [{ "@type": "City", name: "Genève" }, { "@type": "City", name: "Annemasse" }],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: PILLAR_URL,
    name: en ? "Shared housing in Geneva, the French-side version" : "Colocation à Genève, version côté France",
    inLanguage: en ? "en" : "fr",
    datePublished: PAGE_FIRST_PUBLISHED,
    dateModified: PAGE_LAST_UPDATED,
  };
  const lastUpdatedLabel = new Date(PAGE_LAST_UPDATED).toLocaleDateString(en ? "en-US" : "fr-FR", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  const h2 = "text-3xl md:text-4xl font-light text-[#1C1917] mb-6";
  const serif = { fontFamily: "DM Serif Display, serif" } as const;
  const link = "text-[#1C1917] underline underline-offset-4 hover:text-[#D4A574]";

  return (
    <main className="relative pt-16">
      <SEO
        // §6 variante B (décision Q8 : pas de prix dans le title). Meta de la spécification révisée du 04/09.
        // (correction Jérôme 04/09) « tout inclus » dans le title, le seul mot qui distingue la page des annonces ; > 65 c. avec la marque → pas de suffixe (S33).
        title={en ? "Shared housing in Geneva, French side: all-inclusive rooms" : "Colocation à Genève côté France : chambres tout inclus"}
        description={en
          ? `Shared housing in Geneva, French side: 3 houses ${MIN} min from the centre, furnished room, bills, fibre, cleaning included. Rooms, CHF prices, reply in 48 h.`
          : `Colocation à Genève côté France : 3 maisons à ${MIN} min du centre, chambre meublée tout inclus. Chambres disponibles, prix en CHF, réponse sous 48 h.`}
        url={PILLAR_URL}
        image="https://www.lavillacoliving.com/images/villa_portrait.webp"
        jsonLd={offerSchema}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      </Helmet>

      {/* ===== HERO ===== */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {en ? "Shared housing · Greater Geneva" : "Colocation · Grand Genève"}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1917] mb-6 leading-tight" style={serif}>
            {en ? "Shared housing in Geneva, the French-side version" : "Colocation à Genève, version côté France"}
          </h1>
          <p className="text-lg md:text-xl text-[#57534E] max-w-3xl mx-auto mb-8 leading-relaxed">
            {en
              ? `Live on the French side, work in Geneva. ${STATS.totalRooms} furnished rooms in ${STATS.totalHouses} houses in Ville-la-Grand, Ambilly and Annemasse, all inclusive from ${PRICE_SHARED_CHF_EN}/month, ${MIN} minutes from the centre. Real availability below, prices in CHF, reply within 48 h.`
              : `Vis côté France, travaille à Genève. ${STATS.totalRooms} chambres meublées dans ${STATS.totalHouses} maisons à Ville-la-Grand, Ambilly et Annemasse, tout inclus dès ${PRICE_SHARED_CHF_FR}/mois, à ${MIN} minutes du centre. Les disponibilités réelles ci-dessous, les prix en CHF, une réponse sous 48 h.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#chambres" className="inline-flex items-center gap-2 bg-[#D4A574] text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors">
              {en ? "See available rooms" : "Voir les chambres disponibles"}
              <ArrowRight className="w-4 h-4" />
            </a>
            <LocalizedLink to="/candidature" className="inline-flex items-center gap-2 border border-[#1C1917] text-[#1C1917] px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#1C1917] hover:text-white transition-colors">
              {en ? "Apply" : "Candidater"}
            </LocalizedLink>
          </div>
          <p className="mt-6 text-sm text-[#57534E]">
            {en
              ? `★ ${STATS.rating.replace(",", ".")}/5 (resident surveys) · ${STATS.totalResidents}+ residents since ${STATS.foundedYear} · no agency fee, no application fee`
              : `★ ${STATS.rating}/5 (enquêtes résidents) · ${STATS.totalResidents}+ résidents depuis ${STATS.foundedYear} · 0 frais d'agence, 0 frais de dossier`}
          </p>
          <p className="mt-1 text-xs text-[#A8A29E]">{en ? `Updated ${lastUpdatedLabel}` : `Mis à jour le ${lastUpdatedLabel}`}</p>
          <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-[#78716C]">
            <span className="flex items-center gap-2"><Home className="w-4 h-4" /> {STATS.totalRooms} {en ? "rooms" : "chambres"}</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {STATS.totalHouses} {en ? "houses" : "maisons"}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {MIN} min {en ? "from Geneva" : "de Genève"}</span>
            <span className="flex items-center gap-2"><Euro className="w-4 h-4" /> {en ? `From ${PRICE_SHARED_CHF_EN}/month` : `Dès ${PRICE_SHARED_CHF_FR}/mois`}</span>
          </div>
        </div>
      </section>

      {/* ===== BLOC 1 — LES CHAMBRES DISPONIBLES (au-dessus de la ligne de flottaison) ===== */}
      <section id="chambres" className="py-16 lg:py-20 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={h2} style={serif}>
            {n > 0
              ? (en ? `${n} shared-housing room${n > 1 ? "s" : ""} available near Geneva` : `${n} chambre${n > 1 ? "s" : ""} en colocation disponible${n > 1 ? "s" : ""} près de Genève`)
              : (en ? "Next openings near Geneva, house by house" : "Prochaines disponibilités près de Genève, maison par maison")}
          </h2>
          <p className="text-[#57534E] mb-8 max-w-2xl">
            {en
              ? "Real availability of our 3 houses, read from the same data as our bookings: room, size, bathroom, price in CHF, opening date. Each room has its own application."
              : "La dispo réelle de nos 3 maisons, lue sur la même source que nos réservations : chambre, surface, salle d'eau, prix en CHF, date de libération. Chaque chambre a sa propre candidature."}
          </p>
          {n > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {candidates.map((room) => (
                <RoomCard key={`${room.house_slug}:${room.room_number}`} house={room.house_slug} houseName={HOUSES[room.house_slug].label} room={room} fallbackImage={HOUSES[room.house_slug].img} showHouse onCtaClick={trackRoomCta} />
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2 mb-6">
            {HOUSE_ORDER.map((k) => <HouseAvailabilityLine key={k} house={k} />)}
          </div>
          <p className="text-sm text-[#57534E]">
            {en ? "Nothing at your date? " : "Rien à ta date ? "}
            <a href="#liste" className={link}>{en ? "Join the waiting list" : "Rejoins la liste d'attente"}</a>
            {en ? " — we reply within 48 h. " : " — on te répond sous 48 h. "}
            <LocalizedLink to="/chambres-disponibles" className={link}>{en ? "All available rooms, with dates and prices" : "Toutes les chambres disponibles, dates et prix"}</LocalizedLink>
          </p>
        </div>
      </section>

      {/* ===== H2 — COMBIEN COÛTE UNE COLOCATION À GENÈVE ? ===== */}
      <section className="py-20 lg:py-24 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className={h2} style={serif}>{en ? "How much does a flatshare cost in Geneva?" : "Combien coûte une colocation à Genève ?"}</h2>
          <p className="text-[#57534E] leading-relaxed mb-6">
            {en
              ? "In Geneva itself, based on listings observed in 2026, a room in a shared flat usually goes for 1,000 to 1,500 CHF a month, utilities and internet often on top; a studio, 1,800 to 2,500 CHF excluding charges, around 50 CHF/m² advertised according to our cross-border housing Observatory survey (June 2026). Supply is scarce (vacancy rate below 1%, OCSTAT) and every file competes with dozens of others."
              : "À Genève même, d'après les annonces relevées en 2026, une chambre en colocation part le plus souvent entre 1 000 et 1 500 CHF par mois, charges et internet souvent en plus ; un studio, 1 800 à 2 500 CHF hors charges, soit autour de 50 CHF/m² en annonce selon le relevé de notre Observatoire du logement frontalier (juin 2026). L'offre est rare (taux de vacance sous 1 %, OCSTAT) et chaque dossier se bat contre des dizaines d'autres."}
          </p>
          <p className="text-sm text-[#78716C] mb-6">
            {en ? "Source and method: " : "Source et méthode : "}
            <LocalizedLink to="/observatoire-logement-frontalier-geneve" className={link}>{en ? "our cross-border housing Observatory, Geneva and the Léman Express axis (June 2026)" : "notre Observatoire du logement frontalier, Genève et l'axe Léman Express (juin 2026)"}</LocalizedLink>
          </p>
          <div className="bg-white border border-[#E7E5E4] p-6 md:p-8 mb-6">
            <p className="text-2xl font-bold text-[#D4A574] mb-3">
              {en ? `From ${PRICE_SHARED_CHF_EN}/month all inclusive at La Villa` : `Dès ${PRICE_SHARED_CHF_FR}/mois tout inclus chez La Villa`}
            </p>
            <p className="text-[#57534E] leading-relaxed mb-4">
              {en
                ? `${PRICE_SHARED_CHF_EN} for a room whose shower room is shared with one other room, ${PRICE_CHF_EN} with a private shower room. Same currency on both sides of the comparison, and here the figure is the total monthly cost, not a bare rent:`
                : `${PRICE_SHARED_CHF_FR} pour une chambre dont la salle d'eau est partagée avec une seule autre chambre, ${PRICE_CHF_FR} avec salle d'eau privative. Même devise des deux côtés de la comparaison, et ici le chiffre est le coût mensuel total, pas un loyer nu :`}
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-[#44403C]">
              {(en
                ? [`Furnished room, ${STATS.roomSizeMin}-${STATS.roomSizeMax} m²`, "Utilities, water, heating, fibre up to 8 Gb/s", "Cleaning of common areas 3×/week", "Pool, sauna, gym depending on the house", "Yoga, events, community", "No agency fee, no application fee"]
                : [`Chambre meublée, ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m²`, "Charges, eau, chauffage, fibre jusqu'à 8 Gb/s", "Ménage des communs 3×/semaine", "Piscine, sauna, salle de sport selon la maison", "Yoga, événements, communauté", "0 frais d'agence, 0 frais de dossier"]
              ).map((item) => <li key={item} className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" />{item}</li>)}
            </ul>
          </div>
          <p className="text-[#57534E] leading-relaxed">
            {en ? "The point is not the lowest rent: it is space and comfort for a single, predictable monthly amount. " : "Le sujet n'est pas le loyer le plus bas : c'est de l'espace et du confort pour un montant mensuel unique et prévisible. "}
            <LocalizedLink to="/tarifs" className={link}>{en ? "See what the rent includes" : "Voir le détail des tarifs"}</LocalizedLink>
          </p>
        </div>
      </section>

      {/* ===== H2 — COMMENT FAIRE UNE COLOCATION À GENÈVE (FRONTALIER OU RÉSIDENT SUISSE) ===== */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className={h2} style={serif}>
            {en ? "How to share a flat in Geneva as a cross-border worker or a Swiss resident" : "Comment faire une colocation à Genève quand on est frontalier ou résident suisse"}
          </h2>
          <p className="text-[#57534E] leading-relaxed mb-8">
            {en
              ? "Two profiles come to the same place. The cross-border worker already lives in France and commutes to Geneva; the Swiss resident who moves to the French side becomes a cross-border worker (G permit, taxed at source in Geneva). In both cases, what changes is the housing paperwork, and it gets simpler:"
              : "Deux profils arrivent au même endroit. Le frontalier vit déjà en France et va travailler à Genève ; le résident suisse qui passe côté France devient frontalier à son tour (permis G, impôt à la source à Genève). Dans les deux cas, ce qui change, c'est le dossier logement, et il devient plus simple :"}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {(en
              ? [
                  ["The lease", `A French furnished lease in your name: ${STATS.leaseDurationMonths} months renewable, ${STATS.noticePeriodMonths}-month notice. No Swiss rental history required, no sublet.`],
                  ["The deposit", `${STATS.depositMonths} months' rent excluding charges, returned at the end of your stay. On the Swiss side, deposits often reach 3 months and the file is heavier.`],
                  ["The guarantor and the file", "An employment contract or job offer and an ID are enough. No agency fee, no application fee: you pay your first rent and the deposit, nothing else."],
                ]
              : [
                  ["Le bail", `Un bail meublé français à ton nom : ${STATS.leaseDurationMonths} mois renouvelable, préavis d'${STATS.noticePeriodMonths} mois. Aucun historique locatif suisse demandé, pas de sous-location.`],
                  ["La caution", `${STATS.depositMonths} mois de loyer hors charges, restitués en fin de séjour. Côté suisse, les dépôts atteignent souvent 3 mois et le dossier est plus lourd.`],
                  ["Le garant et le dossier", "Un contrat de travail ou une promesse d'embauche et une pièce d'identité suffisent. 0 frais d'agence, 0 frais de dossier : tu règles ton premier loyer et la caution, rien d'autre."],
                ]
            ).map(([t, d]) => (
              <div key={t} className="bg-[#FAF9F6] p-6">
                <h3 className="text-lg font-medium text-[#1C1917] mb-2">{t}</h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-[#57534E] leading-relaxed mt-8">
            {en ? "Shared housing in Geneva as a Swiss resident, or as a cross-border worker: the address is in France, the job in Geneva, the community in the house. " : "Colocation à Genève en résident suisse, ou colocation à Genève en frontalier : l'adresse est en France, le travail à Genève, la communauté dans la maison. "}
            <LocalizedLink to="/candidature" className={link}>{en ? "Apply in 2 minutes" : "Candidate en 2 minutes"}</LocalizedLink>
          </p>
        </div>
      </section>

      {/* ===== H2 — NOS 3 MAISONS ===== */}
      <section className="py-20 lg:py-24 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={h2} style={serif}>{en ? "Our 3 houses" : "Nos 3 maisons"}</h2>
          <p className="text-[#57534E] mb-10 max-w-2xl">
            {en
              ? `${STATS.totalRooms} rooms in ${STATS.totalHouses} houses, ${STATS.livingSpacePerResidentMin} to ${STATS.livingSpacePerResidentMax} m² of living space per flatmate. Each house has its own character; all three share the same all-inclusive rent and the same community.`
              : `${STATS.totalRooms} chambres dans ${STATS.totalHouses} maisons, ${STATS.livingSpacePerResidentMin} à ${STATS.livingSpacePerResidentMax} m² d'espace de vie par colocataire. Chaque maison a son caractère ; les trois partagent le même loyer tout inclus et la même communauté.`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOUSE_ORDER.map((k) => (
              <div key={k} className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden flex flex-col">
                <LocalizedLink to={`/${k}`} className="block relative aspect-[16/10] overflow-hidden">
                  <img src={HOUSES[k].img} alt={HOUSES[k].label} className="w-full h-full object-cover" loading="lazy" width={800} height={500} />
                </LocalizedLink>
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <h3 className="text-xl font-medium text-[#1C1917]">{HOUSES[k].label}</h3>
                  <p className="text-sm text-[#78716C]">{en ? HOUSES[k].descEn : HOUSES[k].descFr}</p>
                  <HouseAvailabilityLine house={k} />
                  <LocalizedLink to={`/${k}`} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#1C1917] hover:text-[#D4A574]">
                    {en ? `Discover ${HOUSES[k].label}` : `Découvrir ${HOUSES[k].label}`}
                    <ArrowRight className="w-4 h-4" />
                  </LocalizedLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== H2 — À N MIN DE GENÈVE ===== */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Train className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
          <h2 className={h2} style={serif}>{en ? `${MIN} minutes door to door from Geneva` : `À ${MIN} min porte-à-porte de Genève`}</h2>
          <p className="text-[#57534E] leading-relaxed max-w-3xl mx-auto mb-8">
            {en
              ? `Door to door, count ${MIN} minutes to the centre of Geneva. Léman Express from Annemasse (Eaux-Vives in 8 minutes, Cornavin direct), tram 17 from the Moillesulaz border, TPG buses, and the border itself is a few minutes away from every house.`
              : `Porte à porte, compte ${MIN} minutes jusqu'au centre de Genève. Léman Express depuis Annemasse (Eaux-Vives en 8 minutes, Cornavin direct), tram 17 depuis la douane de Moillesulaz, bus TPG, et la frontière elle-même à quelques minutes de chaque maison.`}
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-[#44403C]">
            {(en
              ? [["Le Lodge · Annemasse", "Léman Express direct, Cornavin in 15 min"], ["Le Loft · Ambilly", "500 m from the Moillesulaz border, tram 17"], ["La Villa · Ville-la-Grand", "Léman Express and tram 17 within walking distance"]]
              : [["Le Lodge · Annemasse", "Léman Express direct, Cornavin en 15 min"], ["Le Loft · Ambilly", "À 500 m de la douane de Moillesulaz, tram 17"], ["La Villa · Ville-la-Grand", "Léman Express et tram 17 à pied"]]
            ).map(([t, d]) => (
              <div key={t} className="bg-[#FAF9F6] p-5"><p className="font-medium text-[#1C1917] mb-1">{t}</p><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== H2 — OÙ CHERCHER UNE COLOCATION À GENÈVE ===== */}
      <section className="py-20 lg:py-24 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className={h2} style={serif}>{en ? "Where to look for a flatshare in Geneva" : "Où chercher une colocation à Genève"}</h2>
          <p className="text-[#57534E] leading-relaxed mb-4">
            {en
              ? "Listing portals, flatmate groups and specialised directories all exist, on both sides of the border. They work, with their share of stale ads, visits that lead nowhere and files to assemble for each landlord. Our guide explains how to search step by step, from the budget to the visit: "
              : "Les portails d'annonces, les groupes de colocataires et les annuaires spécialisés existent, des deux côtés de la frontière. Ils fonctionnent, avec leur lot d'annonces périmées, de visites pour rien et de dossiers à monter pour chaque propriétaire. Notre guide explique comment chercher, étape par étape, du budget à la visite : "}
            <LocalizedLink to={COLOC_GENEVE_ARTICLE} className={link}>{en ? "finding a flatshare in Geneva" : "trouver une colocation à Genève"}</LocalizedLink>.
          </p>
          <p className="text-[#57534E] leading-relaxed">
            {en
              ? "What we add to that search: a room that is ready (furnished, connected, cleaned), a community already living in the house, a single all-inclusive rent, and a human reply within 48 hours."
              : "Ce que nous ajoutons à cette recherche : une chambre déjà prête (meublée, connectée, entretenue), une communauté qui vit déjà dans la maison, un seul loyer tout compris, et une réponse humaine sous 48 h."}
          </p>
        </div>
      </section>

      {/* (Lot S1) Fiche de faits canonique */}
      <section className="py-10 bg-white"><div className="max-w-3xl mx-auto px-6"><EntityFacts page="colocation-geneve" /></div></section>
      <FaqSection
        title={en ? "Shared housing in Geneva — frequently asked questions" : "Colocation à Genève — questions fréquentes"}
        items={colocationGeneveFaq[L]}
        emitSchema
      />

      {/* ===== LISTE D'ATTENTE ===== */}
      <section id="liste" className="py-20 lg:py-24 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">{en ? "Waiting list" : "Liste d'attente"}</span>
          <h2 className={h2} style={serif}>{en ? "No room at your date? Be first in line." : "Pas de chambre à ta date ? Sois prioritaire."}</h2>
          <p className="text-[#57534E] max-w-xl mx-auto mb-10">
            {en ? "Rooms open up all year round. Leave your details: we contact you as soon as a room matching your profile frees up." : "Des chambres se libèrent toute l'année. Laisse tes coordonnées : on te contacte dès qu'une chambre correspondant à ton profil se libère."}
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 lg:py-32 bg-[#1C1917] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6" style={serif}>{en ? "Ready to find your room near Geneva?" : "Prêt à trouver ta chambre près de Genève ?"}</h2>
          <p className="text-[#78716C] text-lg mb-10 max-w-xl mx-auto">
            {en ? "Apply in 2 minutes. Reply within 48 h. Move in within a week." : "Candidate en 2 minutes. Réponse sous 48 h. Emménagement en une semaine."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LocalizedLink to="/chambres-disponibles" className="inline-flex items-center gap-2 bg-[#D4A574] text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors">
              {en ? "See available rooms" : "Voir les chambres disponibles"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
            <LocalizedLink to="/candidature" className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-white hover:text-[#1C1917] transition-colors">
              {en ? "Apply" : "Candidater"}
            </LocalizedLink>
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
            <LocalizedLink to="/annemasse-colocation" className={link}>{en ? "The Annemasse guide" : "Le guide d'Annemasse"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/chambre-a-louer-annemasse" className={link}>{en ? "The Lodge's rooms in Annemasse" : "Les chambres du Lodge à Annemasse"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/chambre-a-louer-geneve" className={link}>{en ? "Rooms for rent near Geneva" : "Chambre à louer près de Genève"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/le-coliving" className={link}>{en ? "What is coliving" : "Le coliving, c'est quoi ?"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/nos-maisons" className={link}>{en ? "Our 3 houses" : "Nos 3 maisons"}</LocalizedLink>
            <span className="text-[#E7E5E4]">·</span>
            <LocalizedLink to="/tarifs" className={link}>{en ? "Pricing" : "Tarifs"}</LocalizedLink>
          </div>
        </div>
      </section>

      {/* CTA collante mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[#E7E5E4] px-4 py-3">
        <LocalizedLink to="/chambres-disponibles" className="flex items-center justify-center gap-2 w-full bg-[#D4A574] text-white py-3 rounded-lg text-sm font-semibold uppercase tracking-wider">
          {en ? "Available rooms — reply within 48 h" : "Chambres disponibles — réponse sous 48 h"}
          <ArrowRight className="w-4 h-4" />
        </LocalizedLink>
      </div>

      {/* État chambres embarqué au prérendu — toutes maisons, instance unique par page. */}
      <RoomsEmbed />
    </main>
  );
}
