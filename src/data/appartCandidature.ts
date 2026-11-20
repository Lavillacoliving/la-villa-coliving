/**
 * L'Appart — en-tête de /candidature quand on arrive de L'Appart (`?property_interest=lappart`, étape E3 ; source des textes du
 * 13/11/2026, identifiants `candidature.*`, « à confirmer » par Jérôme). Module à part, et petit : la page de candidature (la
 * page de conversion) ne charge ainsi ni les textes de la page de L'Appart (src/data/appartPage.ts) ni ceux de la fiche.
 *
 * Rendu après l'hydratation, comme l'en-tête des maisons (le HTML prérendu de /candidature est commun à toutes les URL à
 * paramètres). Les textes gardent la clé PUBLIQUE ; la clé interne n'apparaît jamais ici (src/lib/placeBridge.ts, à l'envoi).
 * Module pur : zéro React, chaînes plates, aucune date.
 */
import { APPART } from "./appart";
import { ENTITY_FACTS_CTA } from "./entityFacts";
import { APPART_SUITE_ROOM_NUMBER } from "./places";

export type AppartCandidatureLang = "fr" | "en";

/**
 * « Ta candidature concerne : » puis « L'Appart », « L'Appart — chambre 2 », « L'Appart — suite » ou « L'Appart — liste
 * d'attente ». `lead` et `subject` sont rendus l'un après l'autre (le sujet en gras) : le texte visible est celui de la source
 * au caractère près.
 */
export function appartCandidatureHeader(
  lang: AppartCandidatureLang,
  room: { number?: number | null; waitlist?: boolean } = {},
): { lead: string; subject: string } {
  const lead = lang === "en" ? "Your application is for: " : "Ta candidature concerne : ";
  let detail = "";
  if (room.number) detail = room.number === APPART_SUITE_ROOM_NUMBER ? "suite" : (lang === "en" ? `room ${room.number}` : `chambre ${room.number}`);
  else if (room.waitlist) detail = lang === "en" ? "waiting list" : "liste d'attente";
  return { lead, subject: detail ? `${APPART.name} — ${detail}` : APPART.name };
}

/** La chambre demandée vient de partir (état B, après le chargement de la vue). */
export function appartCandidatureRoomGone(lang: AppartCandidatureLang): string {
  return lang === "en"
    ? `This room has just been taken — send your application anyway, we'll offer you the next one at ${APPART.name}.`
    : `Cette chambre vient de partir — envoie quand même ta candidature, on te propose la prochaine libération à ${APPART.name}.`;
}

/** Ligne de prix de l'en-tête : « Tout compris dès 730 CHF/mois · Réponse sous 48 h » (texte composé, à relire) — le « dès » de
 *  L'Appart (jamais celui des maisons), la microcopie de réponse des fiches (ENTITY_FACTS_CTA). */
export function appartCandidaturePriceLine(lang: AppartCandidatureLang): string {
  const from = APPART.price.from;
  return lang === "en"
    ? `All-inclusive from ${from.en.chf}/month · ${ENTITY_FACTS_CTA.en.note}`
    : `Tout compris dès ${from.fr.chf}/mois · ${ENTITY_FACTS_CTA.fr.note}`;
}
