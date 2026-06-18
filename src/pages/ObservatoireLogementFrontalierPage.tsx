import { useState, type ReactNode } from "react";
import { Helmet } from "react-helmet";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { buildDatasetSchema } from "@/lib/structuredData";
import { Train, Bus, Bike, Car, Wallet, Download, ArrowRight, MapPin, Info } from "lucide-react";

// ──────────────────────────────────────────────────────────────────────────
// Observatoire « Loyer × Trajet » — Édition 1 : corridor rive gauche → Eaux-Vives.
// La Villa = éditrice NEUTRE, jamais dans les chiffres (cf. brief Pan Malin).
// Données = public/data/observatoire-data-2026.csv (source unique, sourcée).
// Loyer = STUDIO €/m² réel (Le Figaro, page MAJ 02/06/2026) × 30 m² de référence.
//   3 communes sans studio publié (Bons-en-Chablais, Bonne, Machilly) = loyer 2-pièces (proxy *).
// Trajets vers Genève-Eaux-Vives, heure de pointe (arrivée ~9h15), relevés Google Maps.
// Cadence = horaire officiel Léman Express 2026. Repère Genève = annonces marché ImmoStreet.
// ──────────────────────────────────────────────────────────────────────────

type Commune = {
  name: string;
  m2: number; // loyer studio €/m² (Le Figaro 06/2026) ; * si proxy 2-pièces
  mois: number; // = m2 × 30 m² (studio de référence)
  pt: number; // transport public, min (porte-à-porte, pointe)
  velo: number; // vélo, min (voie verte)
  voiture: number; // voiture, min (pointe)
  train: number | null; // Léman Express direct, gare-à-gare (min)
  cadence: number | null; // cadence LEX en pointe (min entre 2 trains vers Genève)
  proxy?: boolean; // studio non publié → loyer 2-pièces
  tram?: boolean; // desservi par le tram (pas de gare LEX)
};

// Studio de référence : 30 m² (le €/mois isole l'effet du €/m², comme le 37 m² ANIL pour le T1-T2).
const REF_M2 = 30;

const COMMUNES: Commune[] = [
  { name: "Annemasse", m2: 33, mois: 990, pt: 16, velo: 21, voiture: 28, train: 8, cadence: 10 },
  { name: "Ville-la-Grand", m2: 30, mois: 900, pt: 27, velo: 27, voiture: 24, train: 8, cadence: 10 },
  { name: "Ambilly", m2: 34, mois: 1020, pt: 24, velo: 21, voiture: 24, train: 8, cadence: 10 },
  { name: "Gaillard", m2: 33, mois: 990, pt: 37, velo: 21, voiture: 26, train: null, cadence: null, tram: true },
  { name: "Étrembières", m2: 33, mois: 990, pt: 49, velo: 30, voiture: 22, train: null, cadence: null },
  { name: "Vétraz-Monthoux", m2: 32, mois: 960, pt: 68, velo: 32, voiture: 35, train: null, cadence: null },
  { name: "Cranves-Sales", m2: 31, mois: 930, pt: 66, velo: 38, voiture: 35, train: null, cadence: null },
  { name: "Bonne", m2: 23, mois: 690, pt: 52, velo: 49, voiture: 35, train: null, cadence: null, proxy: true },
  { name: "Saint-Cergues", m2: 24, mois: 720, pt: 62, velo: 50, voiture: 30, train: null, cadence: null },
  { name: "Machilly", m2: 23, mois: 690, pt: 30, velo: 50, voiture: 28, train: 22, cadence: 30, proxy: true },
  { name: "Bons-en-Chablais", m2: 21, mois: 630, pt: 35, velo: 63, voiture: 35, train: 28, cadence: 30, proxy: true },
  { name: "Thonon-les-Bains", m2: 24, mois: 720, pt: 50, velo: 112, voiture: 60, train: 43, cadence: 30 },
  { name: "Évian-les-Bains", m2: 30, mois: 900, pt: 59, velo: 148, voiture: 70, train: 52, cadence: 30 },
  { name: "Reignier-Ésery", m2: 31, mois: 930, pt: 36, velo: 58, voiture: 30, train: 25, cadence: 30 },
  { name: "La Roche-sur-Foron", m2: 27, mois: 810, pt: 43, velo: 89, voiture: 35, train: 32, cadence: 30 },
  { name: "Bonneville", m2: 21, mois: 630, pt: 54, velo: 99, voiture: 35, train: 48, cadence: 60 },
  { name: "Annecy", m2: 29, mois: 870, pt: 88, velo: 171, voiture: 55, train: 63, cadence: 60 },
];

const VELO_MAX = 75; // au-delà, le vélo n'est plus un mode du quotidien → « — »
const SITE = "https://www.lavillacoliving.com";
const CSV_URL = "/data/observatoire-data-2026.csv";

const hub = COMMUNES.find((c) => c.name === "Annemasse")!; // 990 € studio, 8 min LEX
// Repère Genève-Eaux-Vives : loyer d'annonce RÉEL d'un studio (ImmoStreet, juin 2026, hors
// logements étudiants/meublés). Fourchette volontairement conservatrice : on en trouve parfois
// dès 1 600 CHF, jusqu'à ~2 000 (niveau studio Eaux-Vives). Gardé en CHF. € et CHF ≈ parité.
const GENEVA_CHF_RANGE = "1 600–2 000";

type ModeKey = "pt" | "velo" | "voiture";
type SortKey = "name" | "mois" | ModeKey;

export function ObservatoireLogementFrontalierPage() {
  const { language } = useLanguage();
  const en = language === "en";

  const [budget, setBudget] = useState(850);
  const [mode, setMode] = useState<ModeKey>("pt");
  const [sortKey, setSortKey] = useState<SortKey>("mois");
  const [sortDir, setSortDir] = useState(1);

  const PAGE_FIRST_PUBLISHED = "2026-06-16";
  const PAGE_LAST_UPDATED = "2026-06-18";
  const updatedLabel = new Date(PAGE_LAST_UPDATED).toLocaleDateString(en ? "en-US" : "fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const datasetSchema = buildDatasetSchema({
    name: en
      ? "Cross-border housing observatory — Studio rent × Commute, left-bank Geneva (2026)"
      : "Observatoire du logement frontalier — Loyer studio × Trajet, rive gauche de Genève (2026)",
    description: en
      ? "Real advertised studio rent (Le Figaro, June 2026) crossed with commute time to Geneva-Eaux-Vives, for 17 municipalities of the French Genevois along the Léman Express axis, including peak-hour train frequency. Geneva benchmark: real market listings (ImmoStreet)."
      : "Loyer d'annonce réel d'un studio (Le Figaro, juin 2026) croisé au temps de trajet vers Genève-Eaux-Vives, pour 17 communes du Genevois français le long de l'axe Léman Express, avec la cadence des trains en heure de pointe. Repère Genève : annonces réelles du marché (ImmoStreet).",
    url: `${SITE}/observatoire-logement-frontalier-geneve`,
    csvUrl: `${SITE}${CSV_URL}`,
    datePublished: PAGE_FIRST_PUBLISHED,
    dateModified: PAGE_LAST_UPDATED,
    language: en ? "en" : "fr",
    spatial: COMMUNES.map((c) => c.name),
  });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: en
      ? "A studio costs nearly half as much one stop across the border — Rent × Commute observatory"
      : "Un studio coûte près de moitié moins de l'autre côté de la frontière — l'observatoire Loyer × Trajet",
    inLanguage: en ? "en" : "fr",
    datePublished: PAGE_FIRST_PUBLISHED,
    dateModified: PAGE_LAST_UPDATED,
    author: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "La Villa Coliving",
      logo: { "@type": "ImageObject", url: `${SITE}/logos/logo-full.png` },
    },
    mainEntityOfPage: `${SITE}/observatoire-logement-frontalier-geneve`,
  };

  const modeVal = (c: Commune, m: ModeKey): number | null => {
    if (m === "velo") return c.velo > VELO_MAX ? null : c.velo;
    return c[m];
  };

  const sorted = [...COMMUNES].sort((a, b) => {
    if (sortKey === "name") return sortDir * a.name.localeCompare(b.name);
    if (sortKey === "mois") return sortDir * (a.mois - b.mois);
    const va = modeVal(a, sortKey as ModeKey) ?? 9999;
    const vb = modeVal(b, sortKey as ModeKey) ?? 9999;
    return sortDir * (va - vb);
  });
  const inBudget = COMMUNES.filter((c) => c.mois <= budget).length;

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir((d) => -d);
    else {
      setSortKey(k);
      setSortDir(1);
    }
  }

  // Couleur par palier de loyer studio (sobre, charte La Villa).
  const tier = (mois: number) => (mois <= 750 ? "#6B8E6B" : mois <= 950 ? "#D4A574" : "#A0623C");

  // ── Mini-infographie « Loyer studio × Trajet » (transport public) — l'objet partageable.
  const VW = 800, VH = 430, PADL = 92, PADR = 24, PADT = 40, PADB = 64;
  const ptMax = 90, moisMin = 600, moisMax = 1050;
  const sx = (pt: number) => PADL + (Math.min(pt, ptMax) / ptMax) * (VW - PADL - PADR);
  const sy = (mois: number) => PADT + ((moisMax - mois) / (moisMax - moisMin)) * (VH - PADT - PADB);
  const labelled = new Set(["Ville-la-Grand", "Annemasse", "Ambilly", "Bons-en-Chablais", "Bonneville", "Annecy"]);

  const modeBtns: { k: ModeKey; icon: typeof Bus; fr: string; en: string }[] = [
    { k: "pt", icon: Bus, fr: "Transport public", en: "Public transport" },
    { k: "velo", icon: Bike, fr: "Vélo", en: "Bike" },
    { k: "voiture", icon: Car, fr: "Voiture", en: "Car" },
  ];

  return (
    <main className="relative pt-16">
      <SEO
        title={
          en
            ? "Geneva cross-border housing observatory — studio rent × commute (2026)"
            : "Observatoire du logement frontalier Genève — loyer studio × trajet (2026)"
        }
        description={
          en
            ? "Where to live near Geneva on the French side within your budget? 17 towns ranked by real studio rent, commute time and Léman Express frequency. A studio is nearly half the price one stop across the border. Free open data."
            : "Où se loger près de Genève côté France dans ton budget ? 17 communes classées par loyer studio réel, temps de trajet et cadence du Léman Express. Un studio coûte près de moitié moins de l'autre côté de la frontière. Données ouvertes."
        }
        image={`${SITE}/images/observatoire-loyer-trajet-2026.svg`}
        type="article"
        jsonLd={datasetSchema}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      {/* ===== HERO ===== */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {en ? "Cross-border housing observatory · Edition 1" : "Observatoire du logement frontalier · Édition 1"}
          </span>
          <h1
            className="text-4xl md:text-5xl font-light text-[#1C1917] mb-5 leading-tight"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {en ? "Where to live near Geneva " : "Où se loger près de Genève "}
            <span className="text-[#D4A574]">{en ? "without straying far?" : "sans s'éloigner ?"}</span>
          </h1>
          <p className="text-lg text-[#57534E] max-w-3xl mx-auto mb-9 leading-relaxed">
            {en
              ? "Rive gauche / Léman Express corridor → Geneva-Eaux-Vives. The real rent of a studio crossed with the actual commute, for 17 municipalities of the French Genevois. You set the budget — we show you where you fit."
              : "Corridor rive gauche / Léman Express → Genève-Eaux-Vives. Le loyer réel d'un studio croisé au temps de trajet réel, pour 17 communes du Genevois français. Tu fixes le budget — on te montre où tu rentres."}
          </p>

          {/* Chiffre-choc : la falaise de la frontière */}
          <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 bg-white border border-[#E7E5E4] rounded-xl px-6 py-5">
            <div className="text-center">
              <div className="text-2xl font-medium text-[#1C1917] whitespace-nowrap">≈ {GENEVA_CHF_RANGE} CHF</div>
              <div className="text-xs text-[#A8A29E] mt-0.5">{en ? "Geneva-Eaux-Vives · studio" : "Genève-Eaux-Vives · studio"}</div>
            </div>
            <div className="flex sm:flex-col items-center justify-center gap-1.5 text-[#D4A574] shrink-0">
              <Train className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-wider whitespace-nowrap">8 min</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-[#1C1917] whitespace-nowrap">≈ {hub.mois} €</div>
              <div className="text-xs text-[#A8A29E] mt-0.5">Annemasse · studio</div>
            </div>
          </div>
          <p className="mt-4 text-base text-[#44403C] font-medium">
            {en
              ? "Often half the rent, just across the border — 8 minutes on the Léman Express."
              : "Souvent moitié moins, juste de l'autre côté de la frontière — 8 minutes en Léman Express."}
          </p>
          <p className="mt-5 text-xs text-[#A8A29E]">
            {en ? `Updated ${updatedLabel}` : `Mis à jour le ${updatedLabel}`}
          </p>
        </div>
      </section>

      {/* ===== INFOGRAPHIE (objet partageable) ===== */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="w-full h-auto"
            role="img"
            aria-label={
              en
                ? "Scatter chart: monthly studio rent versus public-transport time to Geneva-Eaux-Vives for 17 municipalities."
                : "Nuage de points : loyer mensuel d'un studio selon le temps en transport public vers Genève-Eaux-Vives pour 17 communes."
            }
          >
            <rect x="0" y="0" width={VW} height={VH} fill="#FAF9F6" rx="8" />
            {/* axes */}
            <line x1={PADL} y1={VH - PADB} x2={VW - PADR} y2={VH - PADB} stroke="#E7E5E4" strokeWidth="1" />
            <line x1={PADL} y1={PADT} x2={PADL} y2={VH - PADB} stroke="#E7E5E4" strokeWidth="1" />
            {[600, 700, 800, 900, 1000].map((m) => (
              <g key={m}>
                <text x={PADL - 10} y={sy(m) + 4} textAnchor="end" fontSize="11" fill="#A8A29E">{m} €</text>
                <line x1={PADL} y1={sy(m)} x2={VW - PADR} y2={sy(m)} stroke="#F0EEE9" strokeWidth="1" />
              </g>
            ))}
            {[15, 30, 45, 60, 75, 90].map((t) => (
              <text key={t} x={sx(t)} y={VH - PADB + 18} textAnchor="middle" fontSize="11" fill="#A8A29E">{t}</text>
            ))}
            <text x={(VW + PADL) / 2} y={VH - 12} textAnchor="middle" fontSize="12" fill="#57534E">
              {en ? "Public-transport time to Eaux-Vives (min) →" : "Temps en transport public vers Eaux-Vives (min) →"}
            </text>
            <text x={20} y={VH / 2} textAnchor="middle" fontSize="12" fill="#57534E" transform={`rotate(-90 20 ${VH / 2})`}>
              {en ? "Monthly studio rent (€)" : "Loyer mensuel d'un studio (€)"}
            </text>
            {/* Genève-Eaux-Vives : repère central, loyer le plus haut (hors échelle €, en CHF) */}
            <g>
              <circle cx={PADL} cy={PADT} r="6" fill="#1C1917" />
              <text x={PADL + 9} y={PADT - 6} fontSize="11" fontWeight="600" fill="#1C1917">Genève-Eaux-Vives</text>
              <text x={PADL + 9} y={PADT + 8} fontSize="10" fill="#A0623C">≈ {GENEVA_CHF_RANGE} CHF · 0 min</text>
            </g>
            {/* points */}
            {COMMUNES.map((c) => {
              const x = sx(c.pt), y = sy(c.mois);
              const nearRight = x > VW - 140; // label vers la gauche pour ne pas sortir du cadre
              return (
                <g key={c.name}>
                  <circle cx={x} cy={y} r="6" fill={tier(c.mois)} stroke="#fff" strokeWidth="1.5" />
                  {labelled.has(c.name) && (
                    <text
                      x={nearRight ? x - 9 : x + 9}
                      y={y + 4}
                      textAnchor={nearRight ? "end" : "start"}
                      fontSize="11"
                      fill="#44403C"
                    >
                      {c.name}
                    </text>
                  )}
                </g>
              );
            })}
            {/* logo + url (objet qui circule) */}
            <text x={VW - PADR} y={PADT - 18} textAnchor="end" fontSize="12" fill="#A8A29E">lavillacoliving.com</text>
          </svg>
          <p className="text-center text-xs text-[#A8A29E] mt-3">
            {en
              ? "Each dot = a municipality. Top-left = Geneva (central, priciest). Lower-right = further & cheaper. La Villa Coliving, neutral editor."
              : "Chaque point = une commune. En haut à gauche = Genève (centrale, la plus chère). En bas à droite = plus loin et moins cher. La Villa Coliving, éditrice neutre."}
          </p>
        </div>
      </section>

      {/* ===== TABLEAU INTERACTIF ===== */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6">
          {/* curseur budget */}
          <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 mb-5">
            <div className="flex items-center gap-3 flex-wrap">
              <label htmlFor="budget" className="text-sm text-[#57534E] whitespace-nowrap flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#D4A574]" />
                {en ? "My housing budget" : "Mon budget logement"}
              </label>
              <input
                id="budget"
                type="range"
                min={600}
                max={2000}
                step={50}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="flex-1 min-w-[160px] accent-[#D4A574]"
              />
              <span className="text-base font-medium text-[#1C1917] whitespace-nowrap min-w-[96px] text-right">
                {budget} €/{en ? "mo" : "mois"}
              </span>
            </div>
            <p className="text-sm text-[#57534E] mt-2">
              <span className="font-medium text-[#1C1917]">{inBudget}</span>{" "}
              {en
                ? `of 17 municipalities within budget (studio rent).`
                : `communes sur 17 dans ton budget (loyer d'un studio).`}
              {budget >= 1600 && (
                <span className="text-[#A0623C]">
                  {en
                    ? " — at this budget you'd rent a studio in Geneva itself."
                    : " — à ce budget, tu paierais un studio à Genève même."}
                </span>
              )}
            </p>
          </div>

          {/* filtre mode */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-sm text-[#57534E]">{en ? "I commute by:" : "Je me déplace en :"}</span>
            {modeBtns.map(({ k, icon: Icon, fr, en: enL }) => {
              const active = mode === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setMode(k);
                    setSortKey(k);
                    setSortDir(1);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    active
                      ? "bg-[#D4A574] text-white border-[#D4A574]"
                      : "bg-white text-[#57534E] border-[#E7E5E4] hover:border-[#D4A574]"
                  }`}
                  aria-pressed={active}
                >
                  <Icon className="w-4 h-4" />
                  {en ? enL : fr}
                </button>
              );
            })}
          </div>

          {/* tableau (toutes les colonnes restent dans le DOM = lisible sans JS / crawlable) */}
          <div className="overflow-x-auto bg-white border border-[#E7E5E4] rounded-xl">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="border-b border-[#E7E5E4] text-left">
                  <Th onClick={() => toggleSort("name")}>{en ? "Municipality" : "Commune"}</Th>
                  <Th onClick={() => toggleSort("mois")} right>{en ? "Studio €/mo" : "Studio €/mois"}</Th>
                  <Th onClick={() => toggleSort("pt")} right active={mode === "pt"}>
                    <Bus className="inline w-3.5 h-3.5 mb-0.5" /> <span className="hidden sm:inline">Transports&nbsp;publics</span>
                  </Th>
                  <Th onClick={() => toggleSort("velo")} right active={mode === "velo"}>
                    <Bike className="inline w-3.5 h-3.5 mb-0.5" />
                  </Th>
                  <Th onClick={() => toggleSort("voiture")} right active={mode === "voiture"}>
                    <Car className="inline w-3.5 h-3.5 mb-0.5" />
                  </Th>
                </tr>
              </thead>
              <tbody>
                {/* Repère Genève-Eaux-Vives : 0 trajet, loyer CHF marché (toujours en tête, hors filtre budget) */}
                <tr className="border-b border-[#E7E5E4]" style={{ background: "#F7F1E8" }}>
                  <td className="px-3 py-2.5 text-[#1C1917] whitespace-nowrap font-medium">
                    Genève-Eaux-Vives
                    <span className="ml-1.5 text-[10px] uppercase tracking-wider text-[#A0623C]">({en ? "reference" : "repère"})</span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium text-[#1C1917] whitespace-nowrap">≈ {GENEVA_CHF_RANGE}&nbsp;CHF*</td>
                  <td className="px-3 py-2.5 text-right text-[#78716C]">0 min</td>
                  <td className="px-3 py-2.5 text-right text-[#78716C]">0 min</td>
                  <td className="px-3 py-2.5 text-right text-[#78716C]">0 min</td>
                </tr>
                {sorted.map((c) => {
                  const ok = c.mois <= budget;
                  return (
                    <tr
                      key={c.name}
                      className="border-b border-[#F0EEE9] last:border-0"
                      style={{ opacity: ok ? 1 : 0.4 }}
                    >
                      <td className="px-3 py-2.5 text-[#1C1917] whitespace-nowrap">
                        {ok && <span className="text-[#6B8E6B] mr-1.5">✓</span>}
                        {c.name}
                        {c.proxy && <span className="text-[#A8A29E]">&nbsp;*</span>}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-[#1C1917] whitespace-nowrap">{c.mois} €</td>
                      <TransportCell c={c} en={en} active={mode === "pt"} />
                      <Td active={mode === "velo"}>{c.velo > VELO_MAX ? "—" : `${c.velo} min`}</Td>
                      <Td active={mode === "voiture"}>{c.voiture} min</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* légende cadence LEX */}
          <div className="flex items-center gap-4 flex-wrap mt-3 text-xs text-[#78716C]">
            <span className="text-[#A8A29E]">{en ? "Léman Express frequency (peak):" : "Cadence Léman Express (pointe) :"}</span>
            <span className="inline-flex items-center gap-1"><span style={{ color: "#6B8E6B" }}>●</span> ≤ 15 min</span>
            <span className="inline-flex items-center gap-1"><span style={{ color: "#D4A574" }}>●</span> ~30 min</span>
            <span className="inline-flex items-center gap-1"><span style={{ color: "#A0623C" }}>●</span> {en ? "~1/h" : "~1 train/h"}</span>
          </div>

          <p className="text-xs text-[#A8A29E] mt-3 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            {en
              ? "Public transport: when a town is on the Léman Express, we show the direct station-to-station time (with peak frequency, dot) plus the real door-to-door time; otherwise tram/bus door-to-door, at morning peak (arrival ~9:15). “—” bike = too far to cycle daily."
              : "Transports publics : si la commune est sur le Léman Express, on affiche le temps direct gare-à-gare (avec la cadence en pointe, pastille) + le porte-à-porte réel ; sinon tram/bus porte-à-porte, à l'heure de pointe (arrivée ~9h15). « — » vélo = trop loin au quotidien."}
          </p>
          <p className="text-xs text-[#A8A29E] mt-2">
            {en
              ? "* Geneva reference: real advertised studio rent in Eaux-Vives, ≈1,600–2,000 CHF/mo (ImmoStreet listings, June 2026, excluding student/furnished lets — studios are scarce there). Shown in CHF; € and CHF are near parity. “*” next to a French town = studio not published by Le Figaro, 2-room rent shown instead."
              : "* Repère Genève : loyer d'annonce réel d'un studio à Eaux-Vives, ≈1 600–2 000 CHF/mois (annonces ImmoStreet, juin 2026, hors logements étudiants/meublés — le studio y est rare). Affiché en CHF ; € et CHF sont proches de la parité. « * » devant une commune française = studio non publié par Le Figaro, loyer 2-pièces affiché."}
          </p>
        </div>
      </section>

      {/* ===== PALIERS DE TRAJET ===== */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-3 text-center" style={{ fontFamily: "DM Serif Display, serif" }}>
            {en ? "Studio rent by commute band" : "Le loyer d'un studio par palier de trajet"}
          </h2>
          <p className="text-sm text-[#78716C] text-center mb-8 max-w-2xl mx-auto">
            {en
              ? "The immediate ring around Annemasse is the priciest; step a little further out and rent eases."
              : "Le premier cercle autour d'Annemasse est le plus cher ; en s'éloignant un peu, le loyer se détend."}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { lo: 0, hi: 30, label: en ? "Under 30 min" : "Moins de 30 min" },
              { lo: 30, hi: 45, label: "30–45 min" },
              { lo: 45, hi: 999, label: en ? "45 min and beyond" : "45 min et plus" },
            ].map((band) => {
              const list = COMMUNES.filter((c) => c.pt >= band.lo && c.pt < band.hi);
              const avg = list.length ? Math.round(list.reduce((s, c) => s + c.mois, 0) / list.length) : 0;
              return (
                <div key={band.label} className="bg-[#FAF9F6] rounded-xl p-5 text-center">
                  <p className="text-xs text-[#A8A29E] uppercase tracking-wider">{band.label}</p>
                  <p className="text-3xl font-medium text-[#1C1917] my-1">{avg} €</p>
                  <p className="text-xs text-[#57534E]">
                    {en ? "avg. studio · " : "studio moyen · "}
                    {list.length} {en ? "towns" : "communes"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== MÉTHODO ===== */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-medium text-[#1C1917] mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#D4A574]" />
            {en ? "Method & sources" : "Méthodologie & sources"}
          </h2>
          <ul className="text-sm text-[#57534E] space-y-2.5 leading-relaxed list-disc pl-5">
            <li>
              {en ? "Studio rent (France): " : "Loyer studio (France) : "}
              <a href="https://immobilier.lefigaro.fr/prix-immobilier/" target="_blank" rel="noopener" className="text-[#D4A574] hover:underline">
                {en ? "Le Figaro Immobilier" : "Le Figaro Immobilier"}
              </a>
              {en
                ? ` — advertised studio rent per m² per municipality (page updated 02/06/2026), × ${REF_M2} m² reference. 14 of 17 towns have a published studio rate; the other 3 (marked *) use the 2-room rent. Indicative orders of magnitude.`
                : ` — loyer d'annonce d'un studio au m² par commune (page MAJ 02/06/2026), × ${REF_M2} m² de référence. 14 communes sur 17 ont un studio publié ; les 3 autres (marquées *) reprennent le loyer 2-pièces. Ordres de grandeur indicatifs.`}
            </li>
            <li>
              {en
                ? "Commute: door-to-door to Geneva-Eaux-Vives at morning peak (arrival ~9:15), surveyed on Google Maps for car & public transport; bike via the greenway. Direct Léman Express times and peak frequency are from the official 2026 timetable (lemanexpress.com, ge.ch)."
                : "Trajet : porte-à-porte vers Genève-Eaux-Vives à l'heure de pointe (arrivée ~9h15), relevé sur Google Maps pour voiture & transport public ; vélo par la voie verte. Les temps Léman Express directs et la cadence en pointe proviennent de l'horaire officiel 2026 (lemanexpress.com, ge.ch)."}
            </li>
            <li>
              {en
                ? "Geneva benchmark (kept in CHF): real advertised studio rent in Eaux-Vives, ≈1,600–2,000 CHF/month (ImmoStreet listings, June 2026, excluding student & furnished lets) — a deliberately conservative range, as studios are genuinely scarce there. € and CHF are near parity, so the figures are directly readable side by side."
                : "Repère Genève (gardé en CHF) : loyer d'annonce réel d'un studio à Eaux-Vives, ≈1 600–2 000 CHF/mois (annonces ImmoStreet, juin 2026, hors logements étudiants & meublés) — fourchette volontairement conservatrice, le studio y étant réellement rare. € et CHF étant proches de la parité, les chiffres se lisent directement côte à côte."}
            </li>
            <li>
              {en
                ? "Edition 1 covers the left-bank / Léman Express corridor (Eaux-Vives pole). The Pays de Gex (→ airport/Nations) and southern Genevois (→ centre) corridors will be later editions."
                : "L'édition 1 couvre le corridor rive gauche / Léman Express (pôle Eaux-Vives). Le Pays de Gex (→ aéroport/Nations) et le Genevois sud (→ centre) feront l'objet d'éditions ultérieures."}
            </li>
            <li>{en ? "La Villa Coliving is the neutral editor — it never appears in the figures." : "La Villa Coliving est l'éditrice neutre — elle n'apparaît dans aucun chiffre."}</li>
          </ul>

          <a
            href={CSV_URL}
            download="observatoire-loyer-trajet-geneve-2026.csv"
            className="inline-flex items-center gap-2 mt-7 bg-[#1C1917] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors rounded-md"
          >
            <Download className="w-4 h-4" />
            {en ? "Download the data (CSV)" : "Télécharger les données (CSV)"}
          </a>
          <p className="text-xs text-[#A8A29E] mt-2">{en ? "Free to reuse with attribution (CC-BY)." : "Réutilisable librement avec mention de la source (CC-BY)."}</p>
        </div>
      </section>

      {/* ===== PIED — La Villa éditrice (sobre) ===== */}
      <section className="py-14 lg:py-20 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <MapPin className="w-6 h-6 text-[#D4A574] mx-auto mb-3" />
          <p className="text-[#57534E] leading-relaxed mb-6">
            {en
              ? "This observatory is published by La Villa Coliving, which runs all-inclusive coliving houses on the French side of Geneva. Want a turnkey room without the apartment hunt?"
              : "Cet observatoire est publié par La Villa Coliving, qui gère des maisons de coliving tout inclus côté France. Envie d'une chambre clé en main sans la chasse à l'appartement ?"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LocalizedLink
              to="/colocation-geneve"
              className="inline-flex items-center gap-2 border border-[#1C1917] text-[#1C1917] px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              {en ? "Shared housing in Geneva" : "La colocation à Genève"}
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

function Th({ children, onClick, right, active }: { children: ReactNode; onClick: () => void; right?: boolean; active?: boolean }) {
  return (
    <th
      onClick={onClick}
      className={`px-3 py-2.5 cursor-pointer select-none font-medium ${right ? "text-right" : "text-left"} ${active ? "text-[#D4A574]" : "text-[#57534E]"}`}
    >
      {children}
    </th>
  );
}

function Td({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <td className={`px-3 py-2.5 text-right whitespace-nowrap ${active ? "text-[#1C1917] font-medium" : "text-[#78716C]"}`}>
      {children}
    </td>
  );
}

// Colonne « Transports publics » fusionnée : Léman Express en priorité (temps direct gare-à-gare
// + cadence en pointe), avec le porte-à-porte réel juste en dessous ; sinon tram/bus porte-à-porte.
function TransportCell({ c, en, active }: { c: Commune; en: boolean; active?: boolean }) {
  const primary = active ? "text-[#1C1917]" : "text-[#57534E]";
  if (c.train != null) {
    const cad = c.cadence ?? 99;
    const color = cad <= 15 ? "#6B8E6B" : cad <= 30 ? "#D4A574" : "#A0623C";
    const cadLbl = cad >= 60 ? (en ? "1/h" : "1 train/h") : `${c.cadence} min`;
    return (
      <td className="px-3 py-2.5 text-right whitespace-nowrap">
        <div className="leading-tight">
          <div className={`font-medium ${primary}`}>
            {c.train} min <span className="text-[10px] font-normal text-[#78716C]">Léman&nbsp;Express</span>
          </div>
          <div className="text-[10px] text-[#A8A29E]">
            <span style={{ color }}>●</span> {cadLbl} · {en ? `door-to-door ${c.pt} min` : `porte-à-porte ${c.pt} min`}
          </div>
        </div>
      </td>
    );
  }
  return (
    <td className="px-3 py-2.5 text-right whitespace-nowrap">
      <div className="leading-tight">
        <div className={`font-medium ${primary}`}>{c.pt} min</div>
        <div className="text-[10px] text-[#A8A29E]">{c.tram ? "Tram 17" : "Bus / tram"}</div>
      </div>
    </td>
  );
}
