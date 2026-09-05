/**
 * Bloc « La Villa Coliving — l'essentiel » (fiche de faits canonique).
 *
 * STUB du Lot C0 (brief « Conquête IA ») : le composant réel est livré par le Lot S1 du brief
 * « Socle entité » (source unique `src/data/entityFacts.ts`, texte identique sur toutes les
 * pages, CTA attribué `src=entity_facts`). Tant que S1 n'est pas mergé, ce stub ne rend RIEN :
 * le rendu des articles reste strictement identique à aujourd'hui, et le marqueur
 * `<!-- entity-facts -->` d'un futur article n'affiche aucun texte de remplissage en production.
 *
 * Contrat (fixé par le plan du 04/09/2026, conservé par S1) :
 *   page       slug de la page hôte → `?article=<page>` dans le CTA (attribution)
 *   houseSlug  pages maisons → `?property_interest=<slug>`
 *   children   UNE phrase de contexte propre à la page (pages de décision), rendue après le
 *              paragraphe canonique, jamais dans les chaînes vérifiées par la CI.
 */
import type { ReactNode } from "react";
import type { HouseKey } from "@/lib/availability";

export interface EntityFactsProps {
  page: string;
  houseSlug?: HouseKey;
  children?: ReactNode;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EntityFacts(_props: EntityFactsProps) {
  return null;
}
