import { Helmet } from "react-helmet";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { buildBreadcrumbSchema, HOUSES, LAVILLA_EMAIL, LAVILLA_PHONE, LAVILLA_POSTAL_ADDRESS } from "@/lib/structuredData";
import { STATS, PRICE_CHF_FR, PRICE_CHF_EN } from "@/data/stats";
import {
  Linkedin,
  Mail,
  Phone,
  ArrowRight,
  Database,
  Users,
  Gem,
  BadgeCheck,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

// ──────────────────────────────────────────────────────────────────────────
// Qui sommes-nous — v2 (brief correction 07/2026) : page image-led pour le public
// principal = FRONTALIERS qui cherchent une chambre (pas les journalistes).
// Ordre : hero photo couple → histoire (+photo maison) → co-fondateurs (portraits 4:5)
//   → valeurs → confiance (anti-arnaque) → données allégée + presse en 1 ligne → CTA.
// Prénoms AFFICHÉS (« Jérôme & Fanny ») + noms complets dans le JSON-LD Person
//   (sameAs LinkedIn — déjà publics via kit presse). foundingDate = octobre 2021.
// Photos : public/images/fondateur*-*.webp (portraits 4:5 fournis, ne pas déformer)
//   + visuels maisons de la bibliothèque (⚠️ règle : Le Loft = piscine INTÉRIEURE).
// Chiffres : STATS = source unique.
// ──────────────────────────────────────────────────────────────────────────

const SITE = "https://www.lavillacoliving.com";
const LINKEDIN_JEROME = "https://www.linkedin.com/in/jeromeaustin1/";
const LINKEDIN_FANNY = "https://www.linkedin.com/in/fanny-bela-24793138/";
const PRESS_PHONE_DISPLAY = "+33 6 64 31 51 34";

const IMG_JEROME = "/images/fondateur-jerome.webp";
const IMG_FANNY = "/images/fondatrice-fanny.webp";
const IMG_HISTOIRE = "/images/la villa jardin.webp";
const HOUSE_IMAGES: Record<string, string> = {
  lavilla: "/images/la villa.webp",
  leloft: "/images/la villa coliving le loft piscine.webp", // piscine intérieure (règle visuelle Loft)
  lelodge: "/images/le lodge.webp",
};

export function QuiSommesNousPage() {
  const { language } = useLanguage();
  const en = language === "en";

  const pageUrl = `${SITE}${en ? "/en" : ""}/qui-sommes-nous`;

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: en ? "Who we are — Jérôme & Fanny, founders" : "Qui sommes-nous — Jérôme & Fanny, fondateurs",
    url: pageUrl,
    inLanguage: en ? "en" : "fr",
    primaryImageOfPage: `${SITE}${IMG_HISTOIRE}`,
    mainEntity: {
      "@type": "Organization",
      name: "La Villa Coliving",
      url: SITE,
      logo: `${SITE}/logos/logo-full.png`,
      email: LAVILLA_EMAIL,
      telephone: LAVILLA_PHONE,
      foundingDate: "2021-10",
      address: LAVILLA_POSTAL_ADDRESS,
      areaServed: ["Genève", "Annemasse", "Grand Genève"],
      description: en
        ? `Premium coliving under direct management: ${STATS.totalHouses} houses, ${STATS.totalRooms} furnished rooms all-inclusive from ${PRICE_CHF_EN}/month, 20 minutes from Geneva on the French side.`
        : `Coliving premium en gestion directe : ${STATS.totalHouses} maisons, ${STATS.totalRooms} chambres meublées tout inclus dès ${PRICE_CHF_FR}/mois, à 20 minutes de Genève côté France.`,
      founder: [
        {
          "@type": "Person",
          name: "Jérôme Austin",
          givenName: "Jérôme",
          jobTitle: en ? "Co-founder" : "Co-fondateur",
          image: `${SITE}${IMG_JEROME}`,
          sameAs: [LINKEDIN_JEROME],
          worksFor: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
        },
        {
          "@type": "Person",
          name: "Fanny Bela",
          givenName: "Fanny",
          jobTitle: en ? "Co-founder" : "Co-fondatrice",
          image: `${SITE}${IMG_FANNY}`,
          sameAs: [LINKEDIN_FANNY],
          worksFor: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
        },
      ],
      sameAs: [
        "https://www.instagram.com/lavillacoliving/",
        "https://share.google/OR9wy40wVx80aeQei",
      ],
    },
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: en ? "Home" : "Accueil", url: `${SITE}${en ? "/en" : "/"}` },
    { name: en ? "Who we are" : "Qui sommes-nous", url: pageUrl },
  ]);

  const founders = [
    {
      img: IMG_JEROME,
      alt: en ? "Portrait of Jérôme, co-founder of La Villa Coliving" : "Portrait de Jérôme, cofondateur de La Villa Coliving",
      firstName: "Jérôme",
      role: en ? "Co-founder" : "Co-fondateur",
      bio: en
        ? "The direction and the concept: Jérôme opened the first house in 2021 and has been steering La Villa's development ever since. He also edits the cross-border housing observatory — the open-data study on rents and commute times around Geneva. Understanding the market better than anyone, to house people better than anyone."
        : "Le cap et le concept : Jérôme a ouvert la première maison en 2021 et pilote depuis le développement de La Villa. Il édite aussi l'Observatoire du logement frontalier — l'étude en données ouvertes sur les loyers et les trajets autour de Genève. Comprendre le marché mieux que personne, pour loger mieux que personne.",
      linkedin: LINKEDIN_JEROME,
    },
    {
      img: IMG_FANNY,
      alt: en ? "Portrait of Fanny, co-founder of La Villa Coliving" : "Portrait de Fanny, cofondatrice de La Villa Coliving",
      firstName: "Fanny",
      role: en ? "Co-founder" : "Co-fondatrice",
      bio: en
        ? "The soul and the face of the three houses: Fanny orchestrates arrivals, keeps every space up to the finest detail and brings the community to life every day. She's the one who answers residents — and often the reason they stay."
        : "L'âme et le visage des trois maisons : Fanny orchestre les arrivées, veille à l'exigence du détail dans chaque espace et fait vivre la communauté au quotidien. C'est elle qui répond aux résidents — et c'est souvent pour elle qu'ils restent.",
      linkedin: LINKEDIN_FANNY,
    },
  ];

  const values = [
    {
      icon: Users,
      title: en ? "Community, our reason for being" : "La communauté, notre raison d'être",
      text: en
        ? "We don't rent out rooms, we bring houses to life: a community dinner every month, yoga and sport every week, events all year round. Selecting housemates is only the first chapter — what happens next is what makes La Villa."
        : "On ne loue pas des chambres, on fait vivre des maisons : dîner communautaire chaque mois, yoga et sport chaque semaine, événements toute l'année. La sélection des colocataires n'est que le premier chapitre — c'est ce qui se passe après qui fait La Villa.",
    },
    {
      icon: HeartHandshake,
      title: en ? "Not a factory" : "Pas une usine",
      text: en
        ? "7 to 12 residents per house — not 300 per residence. Real houses with gardens, a pool and terraces, where everyone knows each other's first name. Three beautiful addresses rather than fifty average ones."
        : "7 à 12 résidents par maison — pas 300 par résidence. De vraies maisons avec jardin, piscine et terrasses, où chacun connaît le prénom des autres. Trois belles adresses plutôt que cinquante moyennes.",
    },
    {
      icon: Gem,
      title: en ? "Quality, no compromise" : "La qualité, sans compromis",
      text: en
        ? "Designer furniture, pool, sauna, gym — real amenities, maintained as if we lived there. Because we're there, every week."
        : "Mobilier design, piscine, sauna, salle de sport — de vraies prestations, entretenues comme si on y vivait. Parce qu'on y passe, chaque semaine.",
    },
    {
      icon: BadgeCheck,
      title: en ? "Direct and fully transparent" : "En direct, en toute transparence",
      text: en
        ? "One price, all inclusive: no application fees, no agency fees, no surprises. And no hotline — us, directly reachable, with an answer within 48 hours."
        : "Un seul prix, tout inclus : pas de frais de dossier, pas d'honoraires d'agence, pas de surprises. Et pas de hotline — nous, joignables en direct, réponse sous 48 h.",
    },
  ];

  return (
    <main className="relative pt-16">
      <SEO
        title={en ? "Who we are — Jérôme & Fanny, founders" : "Qui sommes-nous — Jérôme & Fanny, fondateurs"}
        description={
          en
            ? `Two co-founders, ${STATS.totalHouses} houses, ${STATS.totalResidents}+ residents since October ${STATS.foundedYear}. La Villa Coliving runs its colivings near Geneva with no agency and no hidden fees.`
            : `Deux co-fondateurs, ${STATS.totalHouses} maisons, ${STATS.totalResidents}+ résidents depuis octobre ${STATS.foundedYear}. La Villa Coliving gère ses colivings près de Genève sans agence ni frais cachés.`
        }
        image={`${SITE}${IMG_HISTOIRE}`}
        jsonLd={aboutSchema}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* ===== HERO — panneau texte pleine largeur ===== */}
      <section className="bg-[#1C1917]">
        <div className="flex items-center">
          <div className="max-w-5xl mx-auto w-full px-6 sm:px-10 lg:px-14">
            <div className="max-w-xl py-12 lg:py-24 text-white">
              <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-3 block font-medium">
                La Villa Coliving
              </span>
              <h1
                className="text-4xl md:text-5xl font-light mb-4 leading-tight"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                {en ? "Who we are" : "Qui sommes-nous"}
              </h1>
              <p className="text-base md:text-lg text-white/85 leading-relaxed">
                {en
                  ? `Two founders, three houses, one conviction: coliving is first and foremost about community. Since October ${STATS.foundedYear}, Jérôme and Fanny have run their Greater Geneva houses, on the French side, directly — no agency between you and us.`
                  : `Deux fondateurs, trois maisons, une conviction : le coliving est d'abord une histoire de communauté. Depuis octobre ${STATS.foundedYear}, Jérôme et Fanny gèrent leurs maisons du Grand Genève, côté France, en direct — sans agence entre toi et nous.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== L'HISTOIRE — texte + photo de maison (rythme éditorial) ===== */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3">
              <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-5" style={{ fontFamily: "DM Serif Display, serif" }}>
                {en ? "The story, in brief" : "L'histoire, en bref"}
              </h2>
              <div className="space-y-4 text-[#44403C] leading-relaxed">
                <p>
                  {en
                    ? `October ${STATS.foundedYear}: the first house opened in Ville-la-Grand, with a simple conviction — a coliving should be a living space designed around its community, not just an upgraded flatshare. Today, La Villa Coliving brings together ${STATS.totalHouses} houses — La Villa in Ville-la-Grand, Le Loft in Ambilly, Le Lodge in Annemasse — ${STATS.totalRooms} furnished rooms, all-inclusive from ${PRICE_CHF_EN}/month, ${STATS.genevaCenterMinutes} minutes from central Geneva.`
                    : `Octobre ${STATS.foundedYear} : la première maison ouvre à Ville-la-Grand, avec une conviction simple — un coliving doit être un lieu de vie pensé pour sa communauté, pas une colocation améliorée. Aujourd'hui, La Villa Coliving réunit ${STATS.totalHouses} maisons — La Villa à Ville-la-Grand, Le Loft à Ambilly, Le Lodge à Annemasse — soit ${STATS.totalRooms} chambres meublées tout inclus dès ${PRICE_CHF_FR}/mois, à ${STATS.genevaCenterMinutes} minutes du centre de Genève.`}
                </p>
                <p>
                  {en
                    ? `More than ${STATS.totalResidents} residents have lived there since: cross-border workers and expats arriving in the Geneva basin, most between 25 and 40. And renting is direct — the people who own and look after the houses are the ones you talk to, from the first message to the key handover. No agency, no middleman: us.`
                    : `Plus de ${STATS.totalResidents} résidents y ont vécu depuis : des frontaliers et des expats qui arrivent dans le bassin genevois, entre 25 et 40 ans pour la plupart. Et la location se fait en direct — ceux qui possèdent et entretiennent les maisons sont ceux à qui tu parles, du premier message à la remise des clés. Pas d'agence, pas d'intermédiaire : nous.`}
                </p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <img
                src={IMG_HISTOIRE}
                alt={en ? "One of La Villa's coliving houses near Geneva" : "Une des maisons de coliving La Villa près de Genève"}
                className="w-full aspect-[4/3] object-cover rounded-2xl shadow-sm"
                loading="lazy"
              />
            </div>
          </div>

          {/* Les 3 maisons — vignettes photo + maillage interne */}
          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {HOUSES.map((h) => (
              <LocalizedLink
                key={h.slug}
                to={`/${h.slug}`}
                className="group bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden hover:border-[#D4A574] transition-colors"
              >
                <img
                  src={HOUSE_IMAGES[h.slug]}
                  alt={`${h.name.split(" — ")[0]} ${en ? "in" : "à"} ${h.addressLocality}`}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="p-4">
                  <p className="text-sm font-medium text-[#1C1917] group-hover:text-[#A0623C] transition-colors">{h.name.split(" — ")[0]}</p>
                  <p className="text-xs text-[#78716C] mt-0.5">{h.addressLocality}</p>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LES CO-FONDATEURS — portraits réels 4:5 ===== */}
      <section className="py-14 lg:py-20 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-10 text-center" style={{ fontFamily: "DM Serif Display, serif" }}>
            {en ? "The co-founders" : "Les co-fondateurs"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {founders.map((f) => (
              <div key={f.firstName} className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden">
                <img src={f.img} alt={f.alt} className="w-full aspect-[4/5] object-cover" loading="lazy" />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-medium text-[#1C1917]" style={{ fontFamily: "DM Serif Display, serif" }}>{f.firstName}</h3>
                  <p className="text-xs text-[#A0623C] uppercase tracking-wider mt-1 mb-3">{f.role}</p>
                  <p className="text-sm text-[#57534E] leading-relaxed">{f.bio}</p>
                  <a
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener"
                    aria-label={`LinkedIn — ${f.firstName}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#E7E5E4] text-[#57534E] hover:border-[#D4A574] hover:text-[#A0623C] transition-colors mt-4"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NOS VALEURS ===== */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-10 text-center" style={{ fontFamily: "DM Serif Display, serif" }}>
            {en ? "Our values" : "Nos valeurs"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-[#FAF9F6] border border-[#E7E5E4] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#D4A574]/15 text-[#A0623C] flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#1C1917] mb-2">{v.title}</h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
          {/* Ambiance — deux photos qui respirent */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <img
              src="/images/la villa coliving le lodge-sauna.webp"
              alt={en ? "Sauna at Le Lodge — La Villa Coliving" : "Le sauna du Lodge — La Villa Coliving"}
              className="w-full aspect-[16/10] object-cover rounded-2xl"
              loading="lazy"
            />
            <img
              src="/images/le lodge living room.webp"
              alt={en ? "Living room at Le Lodge — La Villa Coliving" : "Le salon du Lodge — La Villa Coliving"}
              className="w-full aspect-[16/10] object-cover rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ===== POURQUOI NOUS FAIRE CONFIANCE — bloc anti-arnaque ===== */}
      <section className="py-14 lg:py-20 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1.5 bg-[#D4A574]" />
            <div className="p-6 sm:p-9">
              <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-7 text-center" style={{ fontFamily: "DM Serif Display, serif" }}>
                {en ? "Why you can trust us" : "Pourquoi tu peux nous faire confiance"}
              </h2>
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  {
                    fr: <><strong className="text-[#1C1917]">Depuis octobre 2021, plus de {STATS.totalResidents} résidents accueillis</strong> — un vrai historique, pas une promesse.</>,
                    en: <><strong className="text-[#1C1917]">Since October 2021, {STATS.totalResidents}+ residents hosted</strong> — a real track record, not a promise.</>,
                  },
                  {
                    fr: <><strong className="text-[#1C1917]">De vraies maisons, de vraies adresses.</strong> Viens les visiter avant de signer — sur place ou en visio.</>,
                    en: <><strong className="text-[#1C1917]">Real houses, real addresses.</strong> Come visit before you sign — in person or by video call.</>,
                  },
                  {
                    fr: <><strong className="text-[#1C1917]">Un seul prix, tout inclus.</strong> Aucun frais de dossier, aucun honoraire d'agence.</>,
                    en: <><strong className="text-[#1C1917]">One price, all inclusive.</strong> No application fees, no agency fees.</>,
                  },
                  {
                    fr: <><strong className="text-[#1C1917]">Des baux en règle, une caution encadrée par la loi française.</strong> On a même écrit <LocalizedLink to="/blog/arnaques-logement-frontalier-geneve-eviter" className="text-[#A0623C] underline underline-offset-2 hover:text-[#1C1917]">le guide anti-arnaque</LocalizedLink>.</>,
                    en: <><strong className="text-[#1C1917]">Proper leases, a deposit regulated by French law.</strong> We even wrote <LocalizedLink to="/blog/arnaques-logement-frontalier-geneve-eviter" className="text-[#A0623C] underline underline-offset-2 hover:text-[#1C1917]">the anti-scam guide</LocalizedLink>.</>,
                  },
                  {
                    fr: <><strong className="text-[#1C1917]">Une communauté sélectionnée</strong> — une maison où chacun a été choisi.</>,
                    en: <><strong className="text-[#1C1917]">A selected community</strong> — a house where everyone was chosen.</>,
                  },
                  {
                    fr: <><strong className="text-[#1C1917]">Un interlocuteur humain, sous 48 h</strong> — c'est nous qui te répondons.</>,
                    en: <><strong className="text-[#1C1917]">A human answer, within 48 hours</strong> — it's us who reply.</>,
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#57534E] leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-[#6B8E6B] shrink-0 mt-0.5" />
                    <span>{en ? item.en : item.fr}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NOS DONNÉES (allégée) + presse en une ligne ===== */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border-l-4 border-[#D4A574] bg-[#FAF9F6] rounded-r-xl p-5 sm:p-6">
            <h2 className="text-base font-semibold text-[#1C1917] mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#D4A574]" />
              {en ? "Our data" : "Nos données"}
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              {en
                ? "Our houses produce field data nobody else publishes — real all-inclusive rents, length of stay, occupancy. We publish these aggregates in open access (CC-BY) in the cross-border housing observatory."
                : "Nos maisons produisent des données de terrain que personne d'autre ne publie — loyers réels tout compris, durées de séjour, occupation. Nous les publions en accès ouvert (CC-BY) dans l'observatoire du logement frontalier."}{" "}
              <LocalizedLink
                to="/observatoire-logement-frontalier-geneve"
                className="text-[#A0623C] underline underline-offset-2 hover:text-[#1C1917] transition-colors whitespace-nowrap"
              >
                {en ? "See the observatory →" : "Voir l'observatoire →"}
              </LocalizedLink>
            </p>
          </div>
          <p className="text-xs text-[#A8A29E] mt-4 flex items-center gap-3 flex-wrap">
            <span>{en ? "Press:" : "Presse :"}</span>
            <a href={`mailto:${LAVILLA_EMAIL}`} className="inline-flex items-center gap-1 hover:text-[#A0623C] transition-colors">
              <Mail className="w-3 h-3" />
              {LAVILLA_EMAIL}
            </a>
            <a href={`tel:${LAVILLA_PHONE}`} className="inline-flex items-center gap-1 hover:text-[#A0623C] transition-colors">
              <Phone className="w-3 h-3" />
              {PRESS_PHONE_DISPLAY}
            </a>
            <span>{en ? "— figures freely quotable with attribution." : "— chiffres librement citables avec mention de la source."}</span>
          </p>
        </div>
      </section>

      {/* ===== CTA (sobre) ===== */}
      <section className="py-14 lg:py-20 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#57534E] leading-relaxed mb-6">
            {en
              ? "Looking for a turnkey room near Geneva?"
              : "Tu cherches une chambre clé en main près de Genève ?"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LocalizedLink
              to="/nos-maisons"
              className="inline-flex items-center gap-2 border border-[#1C1917] text-[#1C1917] px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              {en ? "Our houses" : "Nos maisons"}
            </LocalizedLink>
            <LocalizedLink
              to="/candidature"
              className="inline-flex items-center gap-2 bg-[#D4A574] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors"
            >
              {en ? "Apply" : "Candidater"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
