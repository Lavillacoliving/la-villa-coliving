// Logique YMYL pure (sans composant) — partagée par les blocs E-E-A-T du blog
// (src/components/YmylNotice.tsx). Séparée pour satisfaire react-refresh/only-export-components.

// Les 16 articles YMYL du brief E-E-A-T (Partie A.2, 2026-07-06), par domaine — le
// domaine choisit la formule « nous ne sommes pas… » (fiscal ≠ santé ≠ immigration).
export type YmylDomain = "fiscal" | "immigration" | "sante" | "argent" | "logement";

export const YMYL_ARTICLES: Record<string, YmylDomain> = {
  // Priorité haute — fiscal / droit / santé
  "fiscalite-frontalier-geneve-impots-2026": "fiscal",
  "declaration-impots-frontalier-2026": "fiscal",
  "salaire-suisse-net-frontalier-2026": "fiscal",
  "avenant-fiscal-40-frontalier-geneve": "fiscal",
  "teletravail-frontalier-geneve-regles-2026": "fiscal",
  "permis-g-frontalier-geneve": "immigration",
  "allocations-familiales-frontalier-geneve-2026": "fiscal",
  "3e-pilier-frontalier-geneve": "fiscal",
  "assurance-sante-frontalier-lamal-cmu-budget": "sante",
  "guide-ressources-frontalier-geneve": "fiscal",
  // Priorité moyenne — argent / budget / démarches
  "cout-de-la-vie-suisse-france-frontalier-2026": "argent",
  "cout-transport-frontalier-geneve-2026": "argent",
  "budget-colocation-geneve-guide-complet": "argent",
  "dossier-location-frontalier-suisse-france": "logement",
  "banque-telephone-internet-frontalier-bons-plans": "argent",
  "arnaques-logement-frontalier-geneve-eviter": "logement",
};

export function isYmyl(slug: string): boolean {
  return slug in YMYL_ARTICLES;
}

// « Nous ne sommes pas X » selon le domaine de l'article.
export const YMYL_NOT_US: Record<YmylDomain, { fr: string; en: string }> = {
  fiscal: { fr: "conseillers fiscaux ni juristes", en: "tax advisers or lawyers" },
  immigration: { fr: "conseillers en immigration ni juristes", en: "immigration advisers or lawyers" },
  sante: { fr: "professionnels de santé ni assureurs", en: "healthcare professionals or insurers" },
  argent: { fr: "conseillers financiers ni courtiers", en: "financial advisers or brokers" },
  logement: { fr: "juristes ni agents immobiliers", en: "lawyers or real-estate agents" },
};

// Domaines « officiels » retenus pour l'encadré Sources (administrations FR/CH +
// relais institutionnels). Un lien sortant hors liste (média, blog…) n'y figure pas.
const OFFICIAL_HOSTS = [
  ".gouv.fr",
  ".admin.ch",
  "ge.ch",
  "ch.ch",
  "service-public.fr",
  "ameli.fr",
  "caf.fr",
  "urssaf.fr",
  "insee.fr",
  "avs-ai.ch",
  "cleiss.fr",
  "francetravail.fr",
  "frontalier.org",
];

function isOfficialHost(hostname: string): boolean {
  const h = hostname.replace(/^www\./, "");
  return OFFICIAL_HOSTS.some((d) => (d.startsWith(".") ? h.endsWith(d) : h === d || h.endsWith(`.${d}`)));
}

/**
 * Extrait les liens officiels du markdown visible → liste {label, url, host} dédupliquée.
 * Même règle d'or que le FAQPage : l'encadré Sources est DÉRIVÉ du contenu affiché, il
 * ne peut pas se désynchroniser des liens réellement présents dans l'article.
 */
export function extractOfficialSources(md: string): { label: string; url: string; host: string }[] {
  const out: { label: string; url: string; host: string }[] = [];
  const seen = new Set<string>();
  const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    try {
      const url = new URL(m[2]);
      if (!isOfficialHost(url.hostname)) continue;
      const key = `${url.hostname}${url.pathname}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ label: m[1].trim(), url: m[2], host: url.hostname.replace(/^www\./, "") });
    } catch {
      // URL malformée dans le contenu → on l'ignore simplement
    }
  }
  return out.slice(0, 12);
}
