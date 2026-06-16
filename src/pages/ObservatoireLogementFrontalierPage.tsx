import { useState, type ReactNode } from "react";
import { Helmet } from "react-helmet";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { buildDatasetSchema } from "@/lib/structuredData";
import { Train, Bike, Car, Wallet, Download, ArrowRight, MapPin, Info } from "lucide-react";

// ──────────────────────────────────────────────────────────────────────────
// Observatoire « Loyer × Trajet » — Édition 1 : corridor rive gauche → Eaux-Vives.
// La Villa = éditrice NEUTRE, jamais dans les chiffres (cf. brief Pan Malin).
// Données = public/data/observatoire-data-2026.csv (source unique, sourcée).
// Loyer T1-T2 charges comprises (ANIL 2025). Trajets vers Genève-Eaux-Vives,
// heure de pointe (arrivée ~9h15), relevés Google Maps 16/06/2026.
// ──────────────────────────────────────────────────────────────────────────

type Commune = {
  name: string;
  mois: number; // loyer T1-T2 €/mois (charges comprises)
  m2: number; // loyer T1-T2 €/m²
  pt: number; // transport public, min (porte-à-porte, pointe)
  velo: number; // vélo, min (voie verte)
  voiture: number; // voiture, min (pointe)
  train: number | null; // Léman Express direct, gare-à-gare (min) — bonus
};

const COMMUNES: Commune[] = [
  { name: "Annemasse", mois: 835, m2: 22.58, pt: 16, velo: 21, voiture: 28, train: 8 },
  { name: "Ville-la-Grand", mois: 632, m2: 17.09, pt: 27, velo: 27, voiture: 24, train: null },
  { name: "Ambilly", mois: 907, m2: 24.52, pt: 24, velo: 21, voiture: 24, train: null },
  { name: "Gaillard", mois: 851, m2: 23.01, pt: 37, velo: 21, voiture: 26, train: null },
  { name: "Étrembières", mois: 852, m2: 23.02, pt: 49, velo: 30, voiture: 22, train: null },
  { name: "Vétraz-Monthoux", mois: 884, m2: 23.90, pt: 68, velo: 32, voiture: 35, train: null },
  { name: "Cranves-Sales", mois: 856, m2: 23.13, pt: 66, velo: 38, voiture: 35, train: null },
  { name: "Bonne", mois: 851, m2: 23.01, pt: 52, velo: 49, voiture: 35, train: null },
  { name: "Saint-Cergues", mois: 851, m2: 22.99, pt: 62, velo: 50, voiture: 30, train: null },
  { name: "Machilly", mois: 685, m2: 18.50, pt: 30, velo: 50, voiture: 28, train: 22 },
  { name: "Bons-en-Chablais", mois: 677, m2: 18.31, pt: 35, velo: 63, voiture: 35, train: 28 },
  { name: "Thonon-les-Bains", mois: 700, m2: 18.91, pt: 50, velo: 112, voiture: 60, train: 43 },
  { name: "Évian-les-Bains", mois: 786, m2: 21.24, pt: 59, velo: 148, voiture: 70, train: 52 },
  { name: "Reignier-Ésery", mois: 745, m2: 20.14, pt: 36, velo: 58, voiture: 30, train: 25 },
  { name: "La Roche-sur-Foron", mois: 693, m2: 18.74, pt: 43, velo: 89, voiture: 35, train: 32 },
  { name: "Bonneville", mois: 701, m2: 18.94, pt: 54, velo: 99, voiture: 35, train: 48 },
  { name: "Annecy", mois: 774, m2: 20.92, pt: 88, velo: 171, voiture: 55, train: 63 },
];

const VELO_MAX = 75; // au-delà, le vélo n'est plus un mode du quotidien → « — »
const SITE = "https://www.lavillacoliving.com";
const CSV_URL = "/data/observatoire-data-2026.csv";

const hub = COMMUNES.find((c) => c.name === "Annemasse")!;
const far = COMMUNES.find((c) => c.name === "Bons-en-Chablais")!;
const dropPct = Math.round((1 - far.mois / hub.mois) * 100); // -19 %

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
  const PAGE_LAST_UPDATED = "2026-06-16";
  const updatedLabel = new Date(PAGE_LAST_UPDATED).toLocaleDateString(en ? "en-US" : "fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const datasetSchema = buildDatasetSchema({
    name: en
      ? "Cross-border housing observatory — Rent × Commute, left-bank Geneva (2026)"
      : "Observatoire du logement frontalier — Loyer × Trajet, rive gauche de Genève (2026)",
    description: en
      ? "Monthly rent of a studio/1-2 room flat crossed with commute time to Geneva-Eaux-Vives, for 17 municipalities of the French Genevois along the Léman Express axis. Rent: ANIL 2025 (charges included). Commute by public transport, bike and car at peak hour."
      : "Loyer mensuel d'un studio/T1-T2 croisé au temps de trajet vers Genève-Eaux-Vives, pour 17 communes du Genevois français le long de l'axe Léman Express. Loyer : ANIL 2025 (charges comprises). Trajet en transport public, vélo et voiture à l'heure de pointe.",
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
      ? "Where to live on the French side without straying far from Geneva — Rent × Commute observatory"
      : "Où se loger côté France sans s'éloigner de Genève — l'observatoire Loyer × Trajet",
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

  // Couleur par palier de loyer (sobre, charte La Villa).
  const tier = (mois: number) => (mois <= 700 ? "#6B8E6B" : mois <= 850 ? "#D4A574" : "#A0623C");

  // ── Mini-infographie « Loyer × Trajet » (transport public) — l'objet partageable.
  const VW = 800, VH = 430, PADL = 86, PADR = 24, PADT = 36, PADB = 64;
  const ptMax = 90, moisMin = 600, moisMax = 950;
  const sx = (pt: number) => PADL + (Math.min(pt, ptMax) / ptMax) * (VW - PADL - PADR);
  const sy = (mois: number) => PADT + ((moisMax - mois) / (moisMax - moisMin)) * (VH - PADT - PADB);
  const labelled = new Set(["Ville-la-Grand", "Annemasse", "Bons-en-Chablais", "Ambilly", "Évian-les-Bains", "Annecy"]);

  const modeBtns: { k: ModeKey; icon: typeof Train; fr: string; en: string }[] = [
    { k: "pt", icon: Train, fr: "Transport public", en: "Public transport" },
    { k: "velo", icon: Bike, fr: "Vélo", en: "Bike" },
    { k: "voiture", icon: Car, fr: "Voiture", en: "Car" },
  ];

  return (
    <main className="relative pt-16">
      <SEO
        title={
          en
            ? "Geneva cross-border housing observatory — rent × commute (2026)"
            : "Observatoire du logement frontalier Genève — loyer × trajet (2026)"
        }
        description={
          en
            ? "Where to live near Geneva on the French side within your budget? 17 municipalities ranked by monthly rent and commute time (public transport, bike, car). Free open data."
            : "Où se loger près de Genève côté France dans ton budget ? 17 communes classées par loyer mensuel et temps de trajet (transport public, vélo, voiture). Données ouvertes."
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
          <p className="text-lg text-[#57534E] max-w-3xl mx-auto mb-8 leading-relaxed">
            {en
              ? "Rive gauche / Léman Express corridor → Geneva-Eaux-Vives. The monthly rent of a studio crossed with the real commute, for 17 municipalities of the French Genevois. You set the budget — we show you where you fit."
              : "Corridor rive gauche / Léman Express → Genève-Eaux-Vives. Le loyer mensuel d'un studio croisé au temps de trajet réel, pour 17 communes du Genevois français. Tu fixes le budget — on te montre où tu rentres."}
          </p>
          <div className="inline-flex items-baseline gap-2 bg-white border border-[#E7E5E4] rounded-md px-5 py-3">
            <span className="text-3xl font-medium text-[#1C1917]">−{Math.abs(dropPct)} %</span>
            <span className="text-sm text-[#57534E]">
              {en
                ? `of rent ${far.pt - hub.pt} min further along the Léman Express (${hub.name} → ${far.name})`
                : `de loyer ${far.pt - hub.pt} min plus loin sur le Léman Express (${hub.name} → ${far.name})`}
            </span>
          </div>
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
                ? "Scatter chart: monthly T1-T2 rent versus public-transport time to Geneva-Eaux-Vives for 17 municipalities."
                : "Nuage de points : loyer mensuel T1-T2 selon le temps en transport public vers Genève-Eaux-Vives pour 17 communes."
            }
          >
            <rect x="0" y="0" width={VW} height={VH} fill="#FAF9F6" rx="8" />
            {/* axes */}
            <line x1={PADL} y1={VH - PADB} x2={VW - PADR} y2={VH - PADB} stroke="#E7E5E4" strokeWidth="1" />
            <line x1={PADL} y1={PADT} x2={PADL} y2={VH - PADB} stroke="#E7E5E4" strokeWidth="1" />
            {[600, 700, 800, 900].map((m) => (
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
            <text x={18} y={VH / 2} textAnchor="middle" fontSize="12" fill="#57534E" transform={`rotate(-90 18 ${VH / 2})`}>
              {en ? "Monthly rent, studio/1-2 rooms (€)" : "Loyer mensuel, studio/T1-T2 (€)"}
            </text>
            {/* Eaux-Vives anchor */}
            <g>
              <circle cx={PADL} cy={VH - PADB} r="5" fill="#1C1917" />
              <text x={PADL + 8} y={VH - PADB - 8} fontSize="11" fontWeight="500" fill="#1C1917">Genève-Eaux-Vives</text>
            </g>
            {/* points */}
            {COMMUNES.map((c) => (
              <g key={c.name}>
                <circle cx={sx(c.pt)} cy={sy(c.mois)} r="6" fill={tier(c.mois)} stroke="#fff" strokeWidth="1.5" />
                {labelled.has(c.name) && (
                  <text x={sx(c.pt) + 9} y={sy(c.mois) + 4} fontSize="11" fill="#44403C">{c.name}</text>
                )}
              </g>
            ))}
            {/* logo + url (objet qui circule) */}
            <text x={VW - PADR} y={PADT - 14} textAnchor="end" fontSize="12" fill="#A8A29E">lavillacoliving.com</text>
          </svg>
          <p className="text-center text-xs text-[#A8A29E] mt-3">
            {en
              ? "Each dot = a municipality. Lower-left = closest & cheapest. La Villa Coliving, neutral editor."
              : "Chaque point = une commune. En bas à gauche = au plus proche et au moins cher. La Villa Coliving, éditrice neutre."}
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
                max={950}
                step={25}
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
                ? `of 17 municipalities within budget (studio/1-2 room rent).`
                : `communes sur 17 dans ton budget (loyer d'un studio/T1-T2).`}
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
                  <Th onClick={() => toggleSort("mois")} right>{en ? "Rent €/mo" : "Loyer €/mois"}</Th>
                  <Th onClick={() => toggleSort("pt")} right active={mode === "pt"}>
                    <Train className="inline w-3.5 h-3.5 mb-0.5" />
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
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-[#1C1917] whitespace-nowrap">{c.mois} €</td>
                      <Td active={mode === "pt"}>{c.pt} min</Td>
                      <Td active={mode === "velo"}>{c.velo > VELO_MAX ? "—" : `${c.velo} min`}</Td>
                      <Td active={mode === "voiture"}>{c.voiture} min</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#A8A29E] mt-3 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            {en
              ? "Times door-to-door to Geneva-Eaux-Vives at morning peak (arrival ~9:15). “—” bike = too far to cycle daily. The Léman Express is even faster station-to-station (e.g. Annemasse 8 min)."
              : "Temps porte-à-porte vers Genève-Eaux-Vives à l'heure de pointe (arrivée ~9h15). « — » vélo = trop loin au quotidien. Le Léman Express est plus rapide encore de gare à gare (ex. Annemasse 8 min)."}
          </p>
        </div>
      </section>

      {/* ===== PALIERS DE TRAJET ===== */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-8 text-center" style={{ fontFamily: "DM Serif Display, serif" }}>
            {en ? "Rent by commute band (public transport)" : "Le loyer par palier de trajet (transport public)"}
          </h2>
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
                    {en ? "avg. rent · " : "loyer moyen · "}
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
              {en ? "Rent: " : "Loyer : "}
              <a href="https://www.data.gouv.fr/datasets/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025" target="_blank" rel="noopener" className="text-[#D4A574] hover:underline">
                {en ? "ANIL “Carte des loyers” 2025" : "« Carte des loyers » ANIL 2025"}
              </a>
              {en
                ? " — estimated advertised rent for a 1-2 room flat (37 m² reference), charges included, Q3 2025. Indicative orders of magnitude. "
                : " — loyer d'annonce estimé pour un T1-T2 (réf. 37 m²), charges comprises, T3 2025. Ordres de grandeur indicatifs. "}
              <em>{en ? "“ANIL estimates, from Groupe SeLoger and leboncoin data.”" : "« Estimations ANIL, à partir des données du Groupe SeLoger et de leboncoin »."}</em>
            </li>
            <li>
              {en
                ? "Commute: door-to-door to Geneva-Eaux-Vives at morning peak (arrival ~9:15), surveyed on Google Maps (16/06/2026) for car & public transport; bike via the greenway. Direct Léman Express times are timetable-based (lemanexpress.com)."
                : "Trajet : porte-à-porte vers Genève-Eaux-Vives à l'heure de pointe (arrivée ~9h15), relevé sur Google Maps (16/06/2026) pour voiture & transport public ; vélo par la voie verte. Les temps Léman Express directs proviennent des horaires officiels (lemanexpress.com)."}
            </li>
            <li>
              {en
                ? "Geneva reference (kept in CHF): ~21.55 CHF/m²/month (OCSTAT 2021) — without charges, so not directly comparable with the French charges-included figures."
                : "Repère Genève (gardé en CHF) : ~21,55 CHF/m²/mois (OCSTAT 2021) — hors charges, donc non directement comparable aux loyers français charges comprises."}
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
