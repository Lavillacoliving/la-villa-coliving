/**
 * Articles de blog qui portent le bloc « La Villa Coliving — l'essentiel » SANS marqueur dans leur
 * markdown (Lot S1, brief « Socle entité », D13) : les 8 articles les plus cités par les assistants IA
 * (baseline 03/09 : 85 % des citations du site pointent vers des articles). Les pages de décision
 * (brief « Conquête IA ») posent, elles, le marqueur `<!-- entity-facts -->` dans leur texte.
 *
 * Position (plan §3.A, S1.5) : avant le premier titre des 40 % finaux dont le libellé annonce une
 * conclusion, sinon avant le dernier titre de cette zone, sinon en fin de markdown. Vérifié le 04/09 :
 * living-in-france et lodge-annemasse ont « Conclusion », ou-habiter / trouver-colocation /
 * guide-ressources « En résumé », dossier-location « Checklist finale », colocation-annemasse
 * « À lire aussi », budget-colocation tombe sur le dernier titre.
 */
export const ENTITY_FACTS_ARTICLES = new Set<string>([
  "living-in-france-working-in-geneva",
  "budget-colocation-geneve-guide-complet",
  "colocation-annemasse-ville-la-grand-ambilly",
  "ou-habiter-frontalier-suisse-villes-france-pas-cher",
  "lodge-annemasse-coliving-premium-portes-geneve",
  "trouver-colocation-geneve-frontalier",
  "dossier-location-frontalier-suisse-france",
  "guide-ressources-frontalier-geneve",
]);

export const ENTITY_FACTS_CONCLUSION_RE =
  /^(conclusion|en résumé|en bref|pour résumer|(ce qu'il faut )?retenir|checklist finale|à lire aussi|in short|key takeaways|summary|to sum up|final checklist|read also)/i;

/**
 * Point de coupe de repli pour un article de l'allowlist (fonction pure sur le markdown).
 * Retourne l'index d'un titre `#`/`##` (le bloc s'insère juste avant), ou null si aucun titre
 * dans les 40 % finaux (le bloc est alors rendu après le markdown).
 */
export function fallbackEntityFactsCut(md: string): { index: number; length: number } | null {
  const headings: { index: number; text: string }[] = [];
  const re = /^#{1,2}\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) headings.push({ index: m.index, text: m[1].trim() });
  const zone = headings.filter((h) => h.index >= md.length * 0.6);
  if (zone.length === 0) return null;
  const conclusion = zone.find((h) => ENTITY_FACTS_CONCLUSION_RE.test(h.text));
  const pick = conclusion ?? zone[zone.length - 1];
  return { index: pick.index, length: 0 };
}
