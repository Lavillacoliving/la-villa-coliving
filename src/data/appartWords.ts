/**
 * L'Appart — nombres écrits en lettres et fréquences (« trois chambres », « une fois par semaine »), partagés par les textes de
 * src/data/appartFacts.ts et le bloc statique src/data/appartTeaser.ts.
 *
 * (Corrections du 13/11/2026, relecture technique) Sortis d'appartFacts.ts avec le bloc statique : l'accueil, « Nos maisons » et
 * /tarifs ne chargent plus tout appartFacts (fiche, tableau, listes, exceptions) pour le seul texte de leur bloc. Aucun texte
 * ne change. Module pur : aucun import, zéro React.
 */

export type AppartWordLang = "fr" | "en";

export const APPART_WORD_FR: Readonly<Record<number, string>> = { 1: "un", 2: "deux", 3: "trois", 4: "quatre", 5: "cinq" };
export const APPART_WORD_EN: Readonly<Record<number, string>> = { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five" };
export const APPART_ORDINAL_FR: Readonly<Record<number, string>> = { 4: "quatrième", 5: "cinquième" };
export const APPART_ORDINAL_EN: Readonly<Record<number, string>> = { 4: "fourth", 5: "fifth" };
export const APPART_TIMES_FR: Readonly<Record<number, string>> = { 1: "une fois", 2: "deux fois", 3: "trois fois" };
export const APPART_TIMES_EN: Readonly<Record<number, string>> = { 1: "once", 2: "twice", 3: "three times" };

export const capital = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
/** « trois » / « three » ; un nombre hors table s'écrit en chiffres (et appartFactsIssues le signale : relire le texte). */
export const word = (n: number, lang: AppartWordLang): string => (lang === "en" ? APPART_WORD_EN : APPART_WORD_FR)[n] ?? String(n);
export const ordinal = (n: number, lang: AppartWordLang): string => (lang === "en" ? APPART_ORDINAL_EN : APPART_ORDINAL_FR)[n] ?? String(n);
export const timesPerWeek = (n: number, lang: AppartWordLang): string =>
  lang === "en" ? `${APPART_TIMES_EN[n] ?? `${n} times`} a week` : `${APPART_TIMES_FR[n] ?? `${n} fois`} par semaine`;
