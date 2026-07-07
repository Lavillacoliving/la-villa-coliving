import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Helmet } from "react-helmet";
import {
  ArrowRight,
  Check,
  Users,
  Gem,
  Eye,
  HeartHandshake,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  BarChart3,
} from "lucide-react";
import { STATS, STATS_DISPLAY } from "@/data/stats";
import {
  FOUNDERS,
  HOUSES,
  LAVILLA_EMAIL,
  LAVILLA_PHONE,
  buildAboutPageSchema,
  buildBreadcrumbSchema,
} from "@/lib/structuredData";

/**
 * Page « Qui sommes-nous » — hub de confiance E-E-A-T (brief v2, 2026-07-06).
 * Rôle : réassurance anti-arnaque + page-auteur de référence (toutes les bylines
 * du blog pointent ici) + transparence (entités, contact, avis).
 * Parti pris : « maison de famille tenue par deux personnes », à l'opposé d'une
 * plateforme — on mène avec l'histoire, pas un organigramme.
 */

// [JÉRÔME] Portraits réels à fournir (facteur n°1 de crédibilité — brief §10.1) :
// déposer /public/images/fondateurs/jerome.webp et fanny.webp puis remplacer
// FOUNDER_PHOTOS ci-dessous. En attendant : monogramme (volontaire, pas d'image cassée).
const FOUNDER_PHOTOS: Record<"jerome" | "fanny", string | null> = {
  jerome: null,
  fanny: null,
};

export function QuiSommesNousPage() {
  const { language } = useLanguage();
  const en = language === "en";
  const S = STATS_DISPLAY[en ? "en" : "fr"];

  const founderCards = [
    {
      key: "jerome" as const,
      founder: FOUNDERS.jerome,
      displayName: "Jérôme",
      role: en ? "Co-founder · Strategy & development" : "Cofondateur · Stratégie & développement",
      bio: en
        ? "I imagined La Villa as the house I would have loved to find when I arrived in the region: beautiful, well thought-out, scam-free, and full of life. My job is everything behind the scenes — designing the houses, keeping quality where it belongs, and making sure every detail delivers on the promise."
        : "J'ai imaginé La Villa comme la maison que j'aurais aimé trouver en arrivant dans la région : belle, bien pensée, sans arnaque, et pleine de vie. Mon travail, c'est tout ce qui se passe en coulisses — concevoir les maisons, garder la qualité au niveau, et faire en sorte que chaque détail tienne la promesse.",
    },
    {
      key: "fanny" as const,
      founder: FOUNDERS.fanny,
      displayName: "Fanny",
      role: en ? "Co-founder · House life & community" : "Cofondatrice · Vie des maisons & communauté",
      bio: en
        ? "My side is the day-to-day and the human part: welcoming residents, the atmosphere in the houses, the bond with each resident from move-in to move-out. So that the moment you walk through the door, you feel at home."
        : "Moi, c'est le quotidien et l'humain : l'accueil, l'ambiance des maisons, le lien avec chaque résident, de l'emménagement au départ. Qu'on ressente, en franchissant la porte, qu'on est chez soi.",
    },
  ];

  const values = [
    {
      icon: Users,
      title: en ? "A hand-picked community" : "Une communauté choisie",
      text: en
        ? "We don't fill rooms, we compose houses. Every application is reviewed, every move-in is a deliberate choice."
        : "On ne remplit pas des chambres, on compose des maisons. Chaque candidature est étudiée, chaque emménagement validé.",
    },
    {
      icon: Gem,
      title: en ? "Quality, no compromise" : "La qualité, sans compromis",
      text: en
        ? "Real designer furniture, real amenities, real spaces. Three beautiful houses rather than fifty average ones."
        : "Vrai mobilier design, vraies prestations, vrais espaces. Trois belles maisons plutôt que cinquante moyennes.",
    },
    {
      icon: Eye,
      title: en ? "Total transparency" : "La transparence, totale",
      text: en
        ? "One price, all inclusive. No application fee, no agency fee, no hidden costs. Ever."
        : "Un seul prix, tout inclus. Pas de frais de dossier, pas d'honoraires d'agence, pas de frais cachés. Jamais.",
    },
    {
      icon: HeartHandshake,
      title: en ? "Human scale" : "À taille humaine",
      text: en
        ? "No platform, no hotline. Us, directly, reachable — with a reply within 48 hours."
        : "Pas de plateforme, pas de hotline. Nous, en direct, joignables — et une réponse sous 48 h.",
    },
  ];

  const proofs = [
    en
      ? `Since ${STATS.foundedYear}, ${STATS.totalResidents}+ residents welcomed — a real track record, not a promise.`
      : `Depuis ${STATS.foundedYear}, plus de ${STATS.totalResidents} résidents accueillis — un vrai historique, pas une promesse.`,
    en
      ? "Real houses, real addresses. Come visit before you sign — on site or by video call."
      : "De vraies maisons, de vraies adresses. Viens les visiter avant de signer — sur place ou en visio.",
    en
      ? "One price, all inclusive. No application fee, no agency fee."
      : "Un seul prix, tout inclus. Aucun frais de dossier, aucun honoraire d'agence.",
    en
      ? "Compliant leases, a deposit regulated by French law."
      : "Des baux en règle, une caution encadrée par la loi française.",
    en
      ? "A selected community — a house where everyone was chosen."
      : "Une communauté sélectionnée — une maison où chacun a été choisi.",
    en
      ? "A human contact who replies within 48 hours — it's us answering."
      : "Un interlocuteur humain, sous 48 h — c'est nous qui te répondons.",
  ];

  const dataPoints = [
    {
      value: "99 %",
      label: en ? "occupancy over 5 years" : "d'occupation sur 5 ans",
    },
    {
      value: en ? "13 mo." : "13 mois",
      label: en
        ? "average stay (9 months excluding long stays)"
        : "de séjour moyen (9 mois hors longs séjours)",
    },
    {
      value: "100 %",
      label: en ? "of residents are cross-border workers" : "de résidents frontaliers",
    },
    {
      value: en ? "< 1 week" : "< 1 semaine",
      label: en
        ? "to fill a room (30-45 applications/month)"
        : "pour replacer une chambre (30-45 candidatures/mois)",
    },
  ];

  // Fiches Google Business par maison — [JÉRÔME] remplacer par les liens de partage
  // exacts des 3 fiches GBP si tu les as sous la main (Maps → Partager).
  const googleReviews = [
    { name: "La Villa", url: "https://www.google.com/search?q=La+Villa+Coliving+Ville-la-Grand+avis" },
    { name: "Le Loft", url: "https://www.google.com/search?q=La+Villa+Coliving+Le+Loft+Ambilly+avis" },
    { name: "Le Lodge", url: "https://www.google.com/search?q=La+Villa+Coliving+Le+Lodge+Annemasse+avis" },
  ];

  return (
    <main className="relative pt-16">
      <SEO
        title={en ? "Who we are — Jérôme & Fanny, founders" : "Qui sommes-nous ? Jérôme & Fanny, fondateurs"}
        description={
          en
            ? "Jérôme and Fanny, founders of La Villa Coliving: our story, our values, and why we personally run every house near Geneva."
            : "Jérôme et Fanny, fondateurs de La Villa Coliving : notre parcours, nos valeurs et pourquoi nous gérons nous-mêmes chaque maison près de Genève."
        }
        jsonLd={buildAboutPageSchema(en ? "en" : "fr")}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(
            buildBreadcrumbSchema([
              { name: en ? "Home" : "Accueil", url: `https://www.lavillacoliving.com${en ? "/en" : ""}/` },
              {
                name: en ? "Who we are" : "Qui sommes-nous",
                url: `https://www.lavillacoliving.com${en ? "/en" : ""}/qui-sommes-nous`,
              },
            ])
          )}
        </script>
      </Helmet>

      {/* ============================================ */}
      {/* 1 — HERO (dark) : deux personnes, pas une plateforme */}
      {/* ============================================ */}
      <section className="bg-[#1C1917] py-24 lg:py-32">
        <div className="container-custom text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
            {en ? "WHO WE ARE" : "QUI SOMMES-NOUS"}
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 max-w-4xl mx-auto"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {en
              ? "Behind La Villa, two people. Not a platform."
              : "Derrière La Villa, deux personnes. Pas une plateforme."}
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto">
            {en
              ? `We are Jérôme and Fanny. Since ${STATS.foundedYear}, we design and run every house, every community, every detail ourselves. No algorithm, no call center: just two people who answer the phone and welcome you in person.`
              : `Nous sommes Jérôme et Fanny. Depuis ${STATS.foundedYear}, nous concevons et gérons nous-mêmes chaque maison, chaque communauté, chaque détail. Pas d'algorithme, pas de call-center : juste deux personnes qui répondent au téléphone et t'accueillent en vrai.`}
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* 2 — NOTRE HISTOIRE (white)                   */}
      {/* ============================================ */}
      <section className="bg-white py-24 lg:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
                {en ? "OUR STORY" : "NOTRE HISTOIRE"}
              </span>
              <h2
                className="text-3xl md:text-4xl font-light text-[#1C1917] mb-8"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                {en ? "How it all began" : "Comment tout a commencé"}
              </h2>
              <div className="space-y-5 text-[#44403C] leading-relaxed">
                <p>
                  {en
                    ? "It all started from a simple observation. Around Geneva, finding housing on the French side is an obstacle course: soaring rents, dubious listings, deposit scams — and once you've moved in, isolation. Arriving alone in a new region, with no network, wears you down."
                    : "Tout est parti d'un constat simple. Autour de Genève, se loger côté France relève du parcours du combattant : loyers qui s'envolent, annonces douteuses, arnaques à la caution — et une fois installé, l'isolement. Arriver seul dans une nouvelle région, sans réseau, ça use."}
                </p>
                {/* [JÉRÔME] Le déclic (brief §10.2) : insérer ici, en une ou deux phrases, le vrai
                    moment / la vraie raison qui vous a décidés à lancer La Villa. C'est ce qui
                    donnera son âme à la page. */}
                <p>
                  {en
                    ? "So we decided to create exactly what we couldn't find: a house where you feel at home from day one, with real amenities — pool, sauna, gym —, a carefully chosen community, and zero bad surprises on price."
                    : "Nous avons décidé de créer exactement ce qui nous manquait : une maison où l'on se sent chez soi dès le premier jour, avec de vraies prestations — piscine, sauna, salle de sport —, une communauté choisie avec soin, et zéro mauvaise surprise sur le prix."}
                </p>
                <p>
                  {en ? (
                    <>
                      In October {STATS.foundedYear}, we opened our first house. Today, it's{" "}
                      <strong className="font-semibold text-[#1C1917]">{STATS.totalHouses} houses</strong> in
                      Ville-la-Grand, Ambilly and Annemasse,{" "}
                      <strong className="font-semibold text-[#1C1917]">{STATS.totalRooms} rooms</strong>, and{" "}
                      <strong className="font-semibold text-[#1C1917]">{STATS.totalResidents}+ residents</strong>{" "}
                      who have lived with us. Many stay far longer than planned — 13 months on average.
                    </>
                  ) : (
                    <>
                      En octobre {STATS.foundedYear}, nous avons ouvert notre première maison. Aujourd'hui, ce sont{" "}
                      <strong className="font-semibold text-[#1C1917]">{STATS.totalHouses} maisons</strong> à
                      Ville-la-Grand, Ambilly et Annemasse,{" "}
                      <strong className="font-semibold text-[#1C1917]">{STATS.totalRooms} chambres</strong>, et{" "}
                      <strong className="font-semibold text-[#1C1917]">
                        plus de {STATS.totalResidents} résidents
                      </strong>{" "}
                      passés chez nous. Beaucoup restent bien plus longtemps que prévu — 13 mois en moyenne.
                    </>
                  )}
                </p>
                <p>
                  {en
                    ? "We have no investors to satisfy, no growth-at-all-costs to show. Just the will to do things well, at human scale."
                    : "Nous n'avons ni investisseurs à satisfaire, ni croissance à tout prix à afficher. Juste l'envie de faire les choses bien, à taille humaine."}
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg">
              <img
                src="/images/la villa event.webp"
                alt={
                  en
                    ? "Residents gathered for an event at La Villa Coliving near Geneva"
                    : "Résidents réunis lors d'un événement à La Villa Coliving près de Genève"
                }
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 3 — LES FONDATEURS (cream) + LinkedIn        */}
      {/* ============================================ */}
      <section className="bg-[#FAF9F6] py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
              {en ? "THE FOUNDERS" : "LES FONDATEURS"}
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1C1917]"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {en ? "Who we are" : "Qui nous sommes"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {founderCards.map((card) => (
              <article
                key={card.key}
                className="bg-white border border-[#E7E5E4] rounded-lg p-8 flex flex-col items-center text-center"
              >
                {FOUNDER_PHOTOS[card.key] ? (
                  <img
                    src={FOUNDER_PHOTOS[card.key] as string}
                    alt={
                      en
                        ? `${card.founder.name}, ${card.role.toLowerCase()} of La Villa Coliving`
                        : `${card.founder.name}, ${card.role.toLowerCase()} de La Villa Coliving`
                    }
                    className="w-28 h-28 rounded-full object-cover mb-6"
                    loading="lazy"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-28 h-28 rounded-full bg-[#1C1917] text-[#D4A574] flex items-center justify-center text-3xl mb-6"
                    style={{ fontFamily: "DM Serif Display, serif" }}
                  >
                    {card.displayName.charAt(0)}
                  </div>
                )}
                <h3
                  className="text-2xl text-[#1C1917] mb-1"
                  style={{ fontFamily: "DM Serif Display, serif" }}
                >
                  {card.founder.name}
                </h3>
                <p className="text-sm text-[#D4A574] font-medium mb-5">{card.role}</p>
                <p className="text-[#57534E] leading-relaxed mb-6">{card.bio}</p>
                <a
                  href={card.founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 text-sm text-[#44403C] hover:text-[#D4A574] transition-colors duration-300"
                >
                  <Linkedin size={16} />
                  {en ? "LinkedIn profile" : "Profil LinkedIn"}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 4 — NOS VALEURS (white)                      */}
      {/* ============================================ */}
      <section className="bg-white py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
              {en ? "OUR VALUES" : "NOS VALEURS"}
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1C1917]"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {en ? "What we care about" : "Ce à quoi nous tenons"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-6 border border-[#E7E5E4] rounded-lg">
                  <div className="w-11 h-11 rounded-lg bg-[#F5F2ED] flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#D4A574]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#1C1917] mb-2">{v.title}</h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 5 — POURQUOI NOUS FAIRE CONFIANCE (cream)    */}
      {/* ============================================ */}
      <section className="bg-[#FAF9F6] py-24 lg:py-32">
        <div className="container-custom max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
            {en ? "TRUST" : "CONFIANCE"}
          </span>
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-10"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {en ? "Why you can trust us" : "Pourquoi tu peux nous faire confiance"}
          </h2>
          <ul className="space-y-4">
            {proofs.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#D4A574]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-[#D4A574]" />
                </span>
                <span className="text-[#44403C] leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-[#78716C]">
            {en ? (
              <>
                Scams are real on the cross-border housing market — we wrote{" "}
                <LocalizedLink
                  to="/blog/arnaques-logement-frontalier-geneve-eviter"
                  className="text-[#D4A574] hover:underline"
                >
                  the guide to spotting them
                </LocalizedLink>
                .
              </>
            ) : (
              <>
                Les arnaques existent vraiment sur le marché du logement frontalier — on a écrit{" "}
                <LocalizedLink
                  to="/blog/arnaques-logement-frontalier-geneve-eviter"
                  className="text-[#D4A574] hover:underline"
                >
                  le guide pour les repérer
                </LocalizedLink>
                .
              </>
            )}
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* 6 — NOS DONNÉES (dark) : signal Experience   */}
      {/* ============================================ */}
      <section className="bg-[#1C1917] py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
              {en ? "OUR DATA" : "NOS DONNÉES"}
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-white mb-4"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {en ? "What our houses teach us" : "Ce que nos maisons nous apprennent"}
            </h2>
            <p className="text-stone-300 max-w-2xl mx-auto">
              {en
                ? `Since ${STATS.foundedYear}, we don't just rent rooms: we observe the cross-border housing reality every day, from inside our own houses.`
                : `Depuis ${STATS.foundedYear}, on ne se contente pas de louer des chambres : on observe la réalité du logement frontalier au quotidien, depuis nos propres maisons.`}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center mb-12">
            {dataPoints.map((d) => (
              <div key={d.label}>
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{d.value}</p>
                <p className="text-stone-400 text-sm">{d.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <LocalizedLink
              to="/observatoire-logement-frontalier-geneve"
              className="inline-flex items-center gap-2 text-[#D4A574] font-semibold hover:text-[#E0BB8A] transition-colors duration-300"
            >
              <BarChart3 size={18} />
              {en
                ? "This is the raw material behind our Cross-border Housing Observatory"
                : "C'est cette matière qui nourrit notre Observatoire du logement frontalier"}
              <ArrowRight size={16} />
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 7 — TRANSPARENCE (white, sobre) : signal Trust */}
      {/* ============================================ */}
      <section className="bg-white py-16 lg:py-20 border-b border-[#E7E5E4]">
        <div className="container-custom max-w-3xl">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1917] mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {en ? "In full transparency" : "En toute transparence"}
          </h2>
          <div className="text-sm text-[#57534E] leading-relaxed space-y-4">
            <p>
              {en
                ? "La Villa Coliving is operated by two family-owned structures: SCI Sleep In (RCS Thonon-les-Bains 882 153 810) and La Villa LMP."
                : "La Villa Coliving est exploitée par deux structures familiales : la SCI Sleep In (RCS Thonon-les-Bains 882 153 810) et La Villa LMP."}
            </p>
            <ul className="space-y-2">
              {HOUSES.map((h) => (
                <li key={h.slug} className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#D4A574] mt-0.5 flex-shrink-0" />
                  <span>
                    {h.name} — {h.streetAddress}, {h.postalCode} {h.addressLocality}
                  </span>
                </li>
              ))}
            </ul>
            <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href={`mailto:${LAVILLA_EMAIL}`}
                className="inline-flex items-center gap-2 text-[#44403C] hover:text-[#D4A574] transition-colors"
              >
                <Mail size={16} className="text-[#D4A574]" />
                {LAVILLA_EMAIL}
              </a>
              <a
                href={`tel:${LAVILLA_PHONE}`}
                className="inline-flex items-center gap-2 text-[#44403C] hover:text-[#D4A574] transition-colors"
              >
                <Phone size={16} className="text-[#D4A574]" />
                +33 6 64 31 51 34
              </a>
            </p>
            <p>
              {en ? "Our Google listings (reviews): " : "Nos fiches Google (avis) : "}
              {googleReviews.map((g, i) => (
                <span key={g.name}>
                  {i > 0 && " · "}
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4A574] hover:underline"
                  >
                    {g.name}
                  </a>
                </span>
              ))}
              {" — "}
              {S.ratingSourced}.
            </p>
            <p>
              <LocalizedLink to="/mentions-legales" className="text-[#D4A574] hover:underline">
                {en ? "Legal notice" : "Mentions légales"}
              </LocalizedLink>
              {" · "}
              <LocalizedLink to="/politique-de-confidentialite" className="text-[#D4A574] hover:underline">
                {en ? "Privacy policy" : "Politique de confidentialité"}
              </LocalizedLink>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 8 — CTA final                                */}
      {/* ============================================ */}
      <section className="bg-[#FAF9F6] py-16 lg:py-24">
        <div className="container-custom text-center">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1917] mb-8"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {en
              ? "Want to see if La Villa is right for you?"
              : "Envie de voir si La Villa est faite pour toi ?"}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <LocalizedLink
              to="/nos-maisons"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4A574] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#E0BB8A] transition-all duration-300"
            >
              {en ? "Discover our houses" : "Découvrir nos maisons"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
            <LocalizedLink
              to="/candidature"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#E7E5E4] text-[#44403C] text-sm font-medium rounded-lg hover:border-[#D4A574] transition-all duration-300"
            >
              {en ? "Apply" : "Déposer ma candidature"}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
