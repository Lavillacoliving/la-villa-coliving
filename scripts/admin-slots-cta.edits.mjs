/**
 * Brief « Créneaux nommés dans les articles les plus cités par Copilot, et correction des phrases d'appel cassées »
 * (Jérôme, 13/10/2026) — liste DÉCLARATIVE des modifications de blog_posts, consommée par scripts/build-slots-sql.mjs :
 *
 *   node scripts/build-slots-sql.mjs --edits ./admin-slots-cta.edits.mjs --name admin-slots-cta --date 2026-10-13 --write-diff
 *
 * Décisions de Jérôme du 13/10/2026 (rapport RAPPORT_Reconnaissance_Creneaux_Admin_CTA_2026-10-13.md) :
 *  - Lot A — D-A, D-A2, D-A3 : question FIXE sur les 56 phrases d'appel « Tu cherches / Looking for » dont la question en
 *    gras portait un lien (28 cassées par la variation d'ancres du lot SEO 5 du 04/09/2026, 28 correctes), plus 4
 *    corrections hors question de même cause (dossier-location, temps-trajet, guide-ressources FR et EN). Le lien sort de la question et se place en fin de paragraphe, même ancre, même URL,
 *    majuscule initiale : une future passe de variation d'ancres ne pourra plus casser la grammaire. Garde : règle 7 de
 *    scripts/check-answer-slots.mjs.
 *  - Lot B — D-B0 amendé : La Villa Coliving nommée UNE fois par créneau, phrase porteuse du nom = adminSlotSentence()
 *    (src/data/answerSlots.ts, vérifiée par check:slots) ; B4 SANS phrase garant (la formule canonique
 *    GUARANTOR_SENTENCE figure déjà dans l'article, section « 7. Garant », via a6Text ; « toujours avant la visite »
 *    proposé par le brief est proscrit par la source et par FORBIDDEN) ; trajets au libellé canonique
 *    STATS_DISPLAY.distance (D1). D-B1 : durées vers les Nations non mesurées retirées (colonne du tableau, « 35-45
 *    minutes en train », paragraphe « 25 minutes jusqu'à Sécheron… voiture 40-60 minutes »). D-B2 : « 18 % » ET « profil
 *    type » retirés, titre neutre. D-B3 : « 29 chambres ».
 *  - Lot C — D3 : « des centaines de frontaliers » → « plus de 100 résidents depuis 2021 ».
 *
 * Règles (identiques à scripts/l1-slots.edits.mjs) : `find` copié AU CARACTÈRE PRÈS depuis la base (instantané du
 * 13/10/2026, espaces insécables U+00A0 écrites `${NB}`) ; `replace` = fonction de la source unique `m` : aucun prix,
 * aucune minute, aucun nombre de chambres, de maisons, de mois ou de résidents n'est écrit ici. Seuls nombres
 * littéraux : des valeurs de MARCHÉ citées par les articles (MARKET_*), signalées comme telles. Tutoiement FR, « you »
 * EN, parité FR/EN, aucun concurrent nommé, aucun superlatif, rien d'ajouté (retenue premium du 13/10/2026).
 */

export const NB = ' '; // espace insécable des nombres (« 1 370 »)
export const NNB = ' '; // espace fine insécable
export const MINUS = '−'; // signe moins typographique

/** Question fixe des phrases d'appel 👉 (D-A, décision de Jérôme du 13/10/2026). */
export const CTA_QUESTION = Object.freeze({
  fr: 'Tu cherches où te loger côté France ?',
  en: 'Looking for a place on the French side?',
});

const LINK = String.raw`\[[^\]]+\]\([^)]+\)`;
const CTA_HEAD = Object.freeze({
  fr: new RegExp(String.raw`^👉 \*\*Tu cherches une (${LINK})(?: ou une (${LINK}))? \?\*\*`),
  en: new RegExp(String.raw`^👉 \*\*Looking for (${LINK})(?: or (${LINK}))?\?\*\*`),
});

/** « [voir nos chambres…](url) » → « [Voir nos chambres…](url) ». */
export const capitalizeAnchor = (link) => link.replace(/^\[(.)/, (_, c) => `[${c.toUpperCase()}`);

/**
 * Lot A (A.1) : question fixe ; liens sortis de la question, placés en fin de paragraphe après « → », même ancre, même
 * URL, majuscule initiale. Le reste de la ligne est INCHANGÉ (aucune valeur réécrite). Lève si le gabarit est inconnu.
 */
export function moveLinksOut(line, lang) {
  const head = CTA_HEAD[lang]?.exec(line);
  if (!head) throw new Error(`phrase d'appel 👉 non reconnue (${lang}) : ${line.slice(0, 80)}`);
  const links = [head[1], head[2]].filter(Boolean).map(capitalizeAnchor).join(' · ');
  const rest = line.slice(head[0].length).replace(/\s+$/, '');
  return `👉 **${CTA_QUESTION[lang]}**${rest} → ${links}`;
}

/** Les 56 lignes 👉 dont la question en gras portait un lien — copiées au caractère près de la base (13/10/2026). */
export const CTA_LINES = [
  { slug: 'allocations-familiales-frontalier-geneve-2026', lang: 'fr', line: `👉 **Tu cherches une [La Villa Coliving, côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'allocations-familiales-frontalier-geneve-2026', lang: 'en', line: `👉 **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'arnaques-logement-frontalier-geneve-eviter', lang: 'fr', line: `👉 **Tu cherches une [voir nos chambres côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'arnaques-logement-frontalier-geneve-eviter', lang: 'en', line: `👉 **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'assurance-sante-frontalier-lamal-cmu-budget', lang: 'fr', line: `👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'assurance-sante-frontalier-lamal-cmu-budget', lang: 'en', line: `👉 **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'avenant-fiscal-40-frontalier-geneve', lang: 'fr', line: `👉 **Tu cherches une [chambres en colocation côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'avenant-fiscal-40-frontalier-geneve', lang: 'en', line: `👉 **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'banque-telephone-internet-frontalier-bons-plans', lang: 'fr', line: `👉 **Tu cherches une [La Villa Coliving, côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'banque-telephone-internet-frontalier-bons-plans', lang: 'en', line: `👉 **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', line: `👉 **Tu cherches une [voir nos chambres côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'budget-colocation-geneve-guide-complet', lang: 'en', line: `👉 **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'fr', line: `👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'en', line: `👉 **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'fr', line: `👉 **Tu cherches une [chambres en colocation côté France](/colocation-geneve) ou une [colocation à Annemasse](/annemasse-colocation) ?** À **La Villa Coliving**, 29 chambres meublées tout inclus dès **1${NB}370 CHF/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse — voir aussi nos [lavillacoliving.com/chambre-a-louer-annemasse](/chambre-a-louer-annemasse). Sans frais de dossier.` },
  { slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'en', line: `👉 **Looking for [La Villa Coliving, French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?** At **La Villa Coliving**, 29 furnished all-inclusive rooms from **CHF 1,370/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse — see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.` },
  { slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'fr', line: `👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ou une [colocation à Annemasse](/annemasse-colocation) ?** À **La Villa Coliving**, 29 chambres meublées tout inclus dès **1${NB}370 CHF/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse — voir aussi nos [chambres à louer à Annemasse](/chambre-a-louer-annemasse). Sans frais de dossier.` },
  { slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'en', line: `👉 **Looking for [a room on the French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?** At **La Villa Coliving**, 29 furnished all-inclusive rooms from **CHF 1,370/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse — see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.` },
  { slug: 'cout-de-la-vie-suisse-france-frontalier-2026', lang: 'fr', line: `👉 **Tu cherches une [La Villa Coliving, côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'cout-de-la-vie-suisse-france-frontalier-2026', lang: 'en', line: `👉 **Looking for [a room on the French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'declaration-impots-frontalier-2026', lang: 'fr', line: `👉 **Tu cherches une [voir nos chambres côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'declaration-impots-frontalier-2026', lang: 'en', line: `👉 **Looking for [a room on the French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'demenager-geneve-frontalier-checklist', lang: 'fr', line: `👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'demenager-geneve-frontalier-checklist', lang: 'en', line: `👉 **Looking for [a room on the French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'ecole-internationale-geneve-frontalier-ou-habiter', lang: 'fr', line: `👉 **Tu cherches une [La Villa Coliving, côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'ecole-internationale-geneve-frontalier-ou-habiter', lang: 'en', line: `👉 **Looking for [a room on the French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'fiscalite-frontalier-geneve-impots-2026', lang: 'fr', line: `👉 **Tu cherches une [voir nos chambres côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'fiscalite-frontalier-geneve-impots-2026', lang: 'en', line: `👉 **Looking for [a room on the French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'grand-geneve-2026-nouveautes-frontaliers', lang: 'fr', line: `👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'grand-geneve-2026-nouveautes-frontaliers', lang: 'en', line: `👉 **Looking for [a room on the French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'guide-ressources-frontalier-geneve', lang: 'fr', line: `👉 **Tu cherches une [chambres en colocation côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'guide-ressources-frontalier-geneve', lang: 'en', line: `👉 **Looking for [a room on the French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'living-in-france-working-in-geneva', lang: 'fr', line: `👉 **Tu cherches une [La Villa Coliving, côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'living-in-france-working-in-geneva', lang: 'en', line: `👉 **Looking for [shared housing near Geneva](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'optimiser-espace-coliving-productivite-bien-etre', lang: 'fr', line: `👉 **Tu cherches une [voir nos chambres côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'optimiser-espace-coliving-productivite-bien-etre', lang: 'en', line: `👉 **Looking for [shared housing near Geneva](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', line: `👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'en', line: `👉 **Looking for [shared housing near Geneva](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', line: `👉 **Tu cherches une [chambres en colocation côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', line: `👉 **Looking for [shared housing near Geneva](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'permis-g-frontalier-geneve', lang: 'fr', line: `👉 **Tu cherches une [La Villa Coliving, côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'permis-g-frontalier-geneve', lang: 'en', line: `👉 **Looking for [shared housing near Geneva](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', line: `👉 **Tu cherches une [colocation à Annemasse](/annemasse-colocation) ?** À **La Villa Coliving** (Le Lodge à Annemasse, La Villa à Ville-la-Grand, Le Loft à Ambilly), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier.` },
  { slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', line: `👉 **Looking for [shared housing in Annemasse](/annemasse-colocation)?** At **La Villa Coliving** (Le Lodge in Annemasse, La Villa in Ville-la-Grand, Le Loft in Ambilly), a furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee.` },
  { slug: 'quitter-son-logement-guide-pratique', lang: 'fr', line: `👉 **Tu cherches une [voir nos chambres côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'quitter-son-logement-guide-pratique', lang: 'en', line: `👉 **Looking for [shared housing near Geneva](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'salaire-suisse-net-frontalier-2026', lang: 'fr', line: `👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'salaire-suisse-net-frontalier-2026', lang: 'en', line: `👉 **Looking for [a room on the French side](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'se-faire-reseau-geneve-arriver-seul', lang: 'fr', line: `👉 **Tu cherches une [chambres en colocation côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'se-faire-reseau-geneve-arriver-seul', lang: 'en', line: `👉 **Looking for [shared housing near Geneva](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'teletravail-frontalier-geneve-regles-2026', lang: 'fr', line: `👉 **Tu cherches une [La Villa Coliving, côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'teletravail-frontalier-geneve-regles-2026', lang: 'en', line: `👉 **Looking for [shared housing near Geneva](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', line: `👉 **Tu cherches une [colocation à Genève](/nos-maisons) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'trouver-colocation-geneve-frontalier', lang: 'en', line: `👉 **Looking for [shared housing near Geneva](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` },
  { slug: 'vie-quotidienne-frontalier-courses-sport-sorties', lang: 'fr', line: `👉 **Tu cherches une [voir nos chambres côté France](/colocation-geneve) ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1${NB}370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.` },
  { slug: 'vie-quotidienne-frontalier-courses-sport-sorties', lang: 'en', line: `👉 **Looking for [shared housing near Geneva](/en/colocation-geneve)?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.` }
];

/** Fragments exacts des corrections hors question (lot A) et des lots B et C — copiés de la base (13/10/2026). */
export const FRAG = {
  A_trajet_fr: { slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', find: `Découvre la [le guide d'Annemasse](/annemasse-colocation)` },
  A_guide_fr: { slug: 'guide-ressources-frontalier-geneve', lang: 'fr', find: `Découvre notre [chambres en colocation côté France](/colocation-geneve)` },
  A_guide_en: { slug: 'guide-ressources-frontalier-geneve', lang: 'en', find: `Discover our [see our rooms on the French side](/colocation-geneve) and [our all-inclusive rates](/tarifs)` },
  A_dossier_fr: { slug: 'dossier-location-frontalier-suisse-france', lang: 'fr', find: `notre [chambres en colocation côté France](/colocation-geneve) accepte les frontaliers` },
  C_banque_fr: { slug: 'banque-telephone-internet-frontalier-bons-plans', lang: 'fr', find: `Après avoir accompagné des centaines de frontaliers, voici la configuration que nous recommandons :` },
  C_banque_en: { slug: 'banque-telephone-internet-frontalier-bons-plans', lang: 'en', find: `After supporting hundreds of cross-border workers, here's the configuration we recommend:` },
  C_choc_fr: { slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'fr', find: `basé sur les retours de centaines de frontaliers passés par La Villa Coliving.` },
  C_choc_en: { slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'en', find: `based on feedback from hundreds of cross-border workers who've passed through La Villa Coliving.` },
  B1_fr: { slug: 'permis-g-frontalier-geneve', lang: 'fr', find: `Le permis G suppose une chose : une **adresse stable côté France** et un retour régulier chez toi. C'est là que le coliving prend tout son sens. Une chambre meublée dans une maison à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte te donne un justificatif de domicile clair, un bail propre pour tes démarches, et une communauté de frontaliers qui connaissent déjà les rouages. De quoi sécuriser ton installation pendant que tu gères la partie administrative. Découvre [nos maisons](/nos-maisons).` },
  B1_en: { slug: 'permis-g-frontalier-geneve', lang: 'en', find: `The permis G assumes one thing: a **stable address on the French side** and a regular return home. That's exactly where coliving makes sense. A furnished room in a house 20 min from Geneva Eaux-Vives by Léman Express, door to door gives you a clear proof of residence, a clean lease for your paperwork, and a community of cross-border workers who already know the ropes. A solid way to secure your move while you handle the admin side. Discover [our houses](/en/nos-maisons).` },
  B2_p2_fr: { slug: 'fiscalite-frontalier-geneve-impots-2026', lang: 'fr', find: `Le loyer du coliving, dès 1${NB}370 CHF tout inclus, est particulièrement facile à intégrer` },
  B2_p3_fr: { slug: 'fiscalite-frontalier-geneve-impots-2026', lang: 'fr', find: `Le coliving représente 20-26 % de ce net — parfaitement dans la zone de confort financier.` },
  B2_p2_en: { slug: 'fiscalite-frontalier-geneve-impots-2026', lang: 'en', find: `The all-inclusive coliving rent, from 1,370 CHF, is particularly easy to integrate into a budget` },
  B2_p3_en: { slug: 'fiscalite-frontalier-geneve-impots-2026', lang: 'en', find: `Coliving represents 20-26% of this net — perfectly within the financial comfort zone.` },
  B3_fr: { slug: 'salaire-suisse-net-frontalier-2026', lang: 'fr', find: `C'est très exactement l'arbitrage que font nos résidents, on le vit avec eux au quotidien. Et si tu pousses la logique jusqu'au coliving tout inclus, tu économises en plus sur les charges, l'internet, le ménage, l'abonnement piscine/gym, les abonnements streaming.` },
  B3_en: { slug: 'salaire-suisse-net-frontalier-2026', lang: 'en', find: `This is exactly the trade-off our residents make, and we live it with them daily. Push it further with all-inclusive coliving: utilities, internet, cleaning, pool/gym subscriptions all included.` },
  B4_fr: { slug: 'dossier-location-frontalier-suisse-france', lang: 'fr', find: `Si le parcours du combattant locatif te décourage, le coliving offre une alternative radicale : un processus de candidature simplifié (contrat de travail ou promesse d'embauche, garant seulement au cas par cas), un bail meublé tout inclus, et une entrée possible en quelques jours.

À La Villa Coliving, nous accueillons des dizaines de frontaliers chaque année. Nous connaissons les spécificités des contrats suisses, nous raisonnons en CHF, et nous savons qu'un salaire genevois de 5 000 CHF est un excellent profil locataire — même si les algorithmes des plateformes de location classiques ne le comprennent pas toujours.` },
  B4_en: { slug: 'dossier-location-frontalier-suisse-france', lang: 'en', find: `If the rental obstacle course discourages you, coliving offers a radical alternative: a simplified application process (employment contract or job offer, a guarantor only case by case), an all-inclusive furnished lease, and move-in possible within days.

At La Villa Coliving, we welcome dozens of cross-border workers every year. We understand Swiss contract specifics, we think in CHF, and we know that a Geneva salary of 5,000 CHF makes an excellent tenant profile — even if traditional rental platform algorithms don't always understand this.` },
  B5_table_fr: { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', find: `| Option | Loyer mensuel | Trajet → Nations | Communauté | Flexibilité |
|---|:---:|:---:|:---:|:---:|
| Studio Genève (quartier des Nations) | 2 000-2 800 CHF | 5-15 min à pied | ❌ Isolé | ❌ Bail long |
| Colocation Genève | 1 200-1 600 CHF | 15-25 min | ⚠️ Aléatoire | ❌ Bail long |
| Studio côté France | 700-950 € | 40-50 min | ❌ Isolé | ✅ Bail souple |
| Coliving La Villa | 1${NB}370 CHF | 35-45 min | ✅ Communauté | ✅ 1 mois préavis |` },
  B5_table_en: { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'en', find: `| Option | Monthly rent | Commute → Nations | Community | Flexibility |
|---|:---:|:---:|:---:|:---:|
| Studio Geneva (Nations area) | 2,000-2,800 CHF | 5-15 min walk | ❌ Isolated | ❌ Long lease |
| Flatshare Geneva | 1,200-1,600 CHF | 15-25 min | ⚠️ Random | ❌ Long lease |
| Studio French side | 700-950 € | 40-50 min | ❌ Isolated | ✅ Flexible |
| Coliving La Villa | 1,370 CHF | 35-45 min | ✅ Community | ✅ 1 month notice |` },
  B5_surcout_fr: { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', find: `Le surcoût de 400-600 CHF` },
  B5_surcout_en: { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'en', find: `The 400-600 CHF premium` },
  B5_train_fr: { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', find: `Avant 2019, vivre côté France et travailler aux Nations signifiait 1h-1h30 de trajet en voiture/bus. Aujourd'hui, c'est 35-45 minutes en train, confortablement assis, WiFi inclus.` },
  B5_train_en: { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'en', find: `Before 2019, living on the French side and working at the Nations meant 1h-1h30 commuting by car/bus. Today, it's 35-45 minutes by train, comfortably seated, WiFi included.` },
  B5_secheron_fr: { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', find: `minutes à pied du Palais des Nations.

Depuis Annemasse en Léman Express : 25 minutes jusqu'à Sécheron, puis 10-15 minutes de marche ou 1 arrêt de bus. Total : 35-45 minutes porte à porte. C'est compétitif avec la voiture en heures de pointe (40-60 minutes avec bouchons et parking).` },
  B5_secheron_en: { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'en', find: `minutes' walk from the Palais des Nations.

From Annemasse by Léman Express: 25 minutes to Sécheron, then 10-15 minutes' walk or 1 bus stop. Total: 35-45 minutes door to door. This is competitive with driving during rush hour (40-60 minutes with traffic and parking).` },
  B5_profil_fr: { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', find: `## Le profil type de l'expat OI chez La Villa Coliving

Environ 18 % de nos résidents travaillent dans une organisation internationale ou une ONG à Genève. Le profil type : 28-38 ans, arrivant d'un autre pays (souvent un autre poste ONU ou une mission terrain), contrat de 1-3 ans, célibataire ou en couple sans enfant.

Ce profil a des besoins spécifiques que le coliving remplit naturellement.` },
  B5_profil_en: { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'en', find: `## The typical IO expat profile at La Villa Coliving

About 18% of our residents work in an international organization or NGO in Geneva. The typical profile: 28-38 years old, arriving from another country (often another UN posting or field mission), 1-3 year contract, single or couple without children.

This profile has specific needs that coliving naturally fulfills.` },
  B6_rel_fr: { slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'fr', find: `que tes colocataires soient suisses, français ou d'une toute autre nationalité.` },
  B6_rel_en: { slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'en', find: `whether your housemates are Swiss, French or from an entirely different nationality.` },
  B6_concl_en: { slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'en', find: `in a welcoming, open setting.` },
  B6_concl_fr: { slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'fr', find: `29 résidents de toutes nationalités dans 3 maisons côté France` }
};

// ── Valeurs de MARCHÉ citées par les articles : ce ne sont PAS des faits La Villa ─────────────────────────────────────
/** fiscalite-frontalier-geneve-impots-2026 : « le net après impôts se situe entre 5 300 et 7 000 CHF/mois ». */
const MARKET_NET_CHF = Object.freeze({ low: 5300, high: 7000 });
/** organisations-internationales-geneve-ou-habiter : studio côté France « 700-950 € ». */
const MARKET_STUDIO_EUR = Object.freeze({ low: 700, high: 950 });
/** Bande de taux EUR→CHF : couvre le taux du site (0,9366, stats.ts) et celui cité par le brief (0,92). */
const EUR_CHF_BAND = Object.freeze([0.9, 0.95]);
/** dossier-location-frontalier-suisse-france : exemple de salaire genevois cité par l'article (inchangé). */
const MARKET_SALARY = Object.freeze({ fr: `5${NB}000 CHF`, en: 'CHF 5,000' });

const WORDS = Object.freeze({ 1: { fr: 'un', en: 'one' }, 2: { fr: 'deux', en: 'two' }, 3: { fr: 'trois', en: 'three' } });
function word(n, lang) {
  const w = WORDS[n]?.[lang];
  if (!w) throw new Error(`nombre ${n} sans forme écrite (${lang}) : compléter WORDS`);
  return w;
}

const round100 = (x) => Math.round(x / 100) * 100;

/** Écart mensuel coliving − studio côté France, arrondi à la centaine ; doit être identique sur toute la bande de taux. */
export function studioPremiumChf(m) {
  const { fromChf, standardChf } = m.ENTITY_FACTS.price;
  const at = (r) => [round100(fromChf - MARKET_STUDIO_EUR.high * r), round100(standardChf - MARKET_STUDIO_EUR.low * r)];
  const [a, b] = EUR_CHF_BAND.map(at);
  if (a[0] !== b[0] || a[1] !== b[1]) throw new Error(`écart coliving − studio instable selon le taux : ${a} / ${b}`);
  return { low: a[0], high: a[1] };
}

/** Part du loyer dans le net : prix bas / net haut, prix haut / net bas (1 370 / 7 000 ; 1 430 / 5 300). */
export function rentShareOfNet(m) {
  const { fromChf, standardChf } = m.ENTITY_FACTS.price;
  return {
    low: Math.round((fromChf / MARKET_NET_CHF.high) * 100),
    high: Math.round((standardChf / MARKET_NET_CHF.low) * 100),
  };
}

/** Tableau markdown sans la colonne `idx` (0 = première colonne). */
export function dropColumn(table, idx) {
  return table
    .split('\n')
    .map((row) => {
      const cells = row.split('|');
      cells.splice(idx + 1, 1);
      return cells.join('|');
    })
    .join('\n');
}

export const POST_STATE_WATCH = [
  /Tu cherches une \[/,
  /Looking for \[/,
  /Découvre la \[le/,
  /notre \[chambres/,
  /Discover our \[see/,
  /18 ?% (de nos résidents|of our residents)/i,
  /centaines de frontaliers|hundreds of cross-border workers/i,
  /dizaines de frontaliers chaque année|dozens of cross-border workers every year/i,
  /20-26 ?%/,
  /400-600 CHF/,
  /35-45 min/i,
];

export function sqlDoc() {
  return {
    lot: "Créneaux nommés des articles admin et phrases d'appel (brief de Jérôme du 13/10/2026, décisions du 13/10) : lot A (56 phrases d'appel + 4 corrections de même cause), lot B (6 articles FR/EN), lot C (preuves sociales D3)",
    sources: 'source unique (answerSlots.ts, entityFacts.ts, stats.ts) ; fragments copiés de la base le 13/10/2026 ; rapport RAPPORT_Reconnaissance_Creneaux_Admin_CTA_2026-10-13.md',
    apply: "Indépendant du code (textes d'articles) ; à appliquer AVANT de fusionner la garde (règle 7 de check:slots), puis relancer le prérendu.",
    encoding: 'Fichier UTF-8 avec insécables U+00A0 — ne pas normaliser.',
    dryRunTitle: "Créneaux admin et phrases d'appel — aperçu des substitutions SQL (13/10/2026)",
    legend: 'Légende : « Avant » = texte en base au 13/10/2026 ; « Après » = texte proposé.',
    versions: {},
  };
}

export function buildEdits(m) {
  const S = m.STATS;
  const F = m.ENTITY_FACTS;
  const D = m.STATS_DISPLAY;
  const n = F.totalResidents;
  const since = S.foundedYear;
  const price = { fr: m.priceRangeText('fr'), en: m.priceRangeText('en') };
  const houses = { fr: word(F.totalHouses, 'fr'), en: word(F.totalHouses, 'en') };
  const perHouse = { min: S.minResidentsPerHouse, max: S.maxResidentsPerHouse };
  const share = rentShareOfNet(m);
  const premium = studioPremiumChf(m);
  const e = (key, mechanism, note, replace) => {
    const f = FRAG[key];
    if (!f) throw new Error(`fragment inconnu : ${key}`);
    return { slug: f.slug, lang: f.lang, mechanism, note, find: f.find, replace: typeof replace === 'function' ? replace(f.find) : replace };
  };
  const out = [];

  // ── Lot A — phrases d'appel (A.1, D-A2, D-A3) ──────────────────────────────────────────────────────────────────────
  for (const { slug, lang, line } of CTA_LINES) {
    out.push({ slug, lang, mechanism: 'cta', note: "phrase d'appel 👉 : question fixe, lien sorti de la question (A.1, D-A2)", find: line, replace: moveLinksOut(line, lang) });
  }
  out.push(e('A_trajet_fr', 'cta', "« Découvre la [le guide…] » → « Découvre [le guide…] » (A.1)", (f) => f.replace('Découvre la [', 'Découvre [')));
  out.push(e('A_guide_fr', 'cta', "« Découvre notre [chambres…] » → « Découvre nos [chambres…] » (même cause : doublon de pied d'article du lot SEO 5)", (f) => f.replace('Découvre notre [', 'Découvre nos [')));
  out.push(e('A_guide_en', 'cta', '« Discover our [see our rooms…] » → « [See our rooms…] » ; cibles FR → EN comme le correctif L1 des pieds EN (même cause)',
    '[See our rooms on the French side](/en/colocation-geneve) and [our all-inclusive rates](/en/tarifs)'));
  out.push(e('A_dossier_fr', 'cta', "« notre [chambres…] accepte » → « nos [chambres…] sont ouvertes » (D-A3)", (f) => f.replace('notre [', 'nos [').replace('accepte les frontaliers', 'sont ouvertes aux frontaliers')));

  // ── Lot C — preuves sociales chiffrées non soutenues (D3) ───────────────────────────────────────────────────────────
  out.push(e('C_banque_fr', 'proof', 'D3 : « des centaines de frontaliers » → « plus de 100 résidents depuis 2021 »', (f) => f.replace('des centaines de frontaliers', `plus de ${n} résidents depuis ${since}`)));
  out.push(e('C_banque_en', 'proof', 'D3: « hundreds of cross-border workers » → « more than 100 residents since 2021 »', (f) => f.replace('hundreds of cross-border workers', `more than ${n} residents since ${since}`)));
  out.push(e('C_choc_fr', 'proof', 'D3 : introduction', `d'après les retours des plus de ${n} résidents passés par La Villa Coliving depuis ${since}.`));
  out.push(e('C_choc_en', 'proof', 'D3: introduction', `based on feedback from the more than ${n} residents who have lived at La Villa Coliving since ${since}.`));

  // ── Lot B1 — permis-g-frontalier-geneve ─────────────────────────────────────────────────────────────────────────────
  out.push(e('B1_fr', 'slot', 'B1 : créneau nommé — permis G et adresse stable',
    `Le permis G suppose une chose : une **adresse stable côté France** et un retour régulier chez toi. Si tu arrives sans logement, c'est souvent le justificatif de domicile qui bloque le dossier. ${m.adminSlotSentence('permis-g', 'fr')} Tu emménages avec des colocataires qui travaillent à Genève et sont passés par les mêmes démarches. Découvre [nos maisons](/nos-maisons).`));
  out.push(e('B1_en', 'slot', 'B1: named slot — permis G and a stable address',
    `The permis G assumes one thing: a **stable address on the French side** and a regular return home. If you arrive without housing, proof of residence is often what holds up the application. ${m.adminSlotSentence('permis-g', 'en')} You move in with housemates who work in Geneva and have been through the same steps. Discover [our houses](/en/nos-maisons).`));

  // ── Lot B2 — fiscalite-frontalier-geneve-impots-2026 (une seule mention : le 3ᵉ paragraphe dit « Ce loyer ») ───────
  out.push(e('B2_p2_fr', 'slot', 'B2 : créneau nommé — loyer tout inclus',
    `${m.adminSlotSentence('fiscalite', 'fr')} est particulièrement facile à intégrer`));
  out.push(e('B2_p3_fr', 'fix', 'B2 : calcul corrigé (prix bas / net haut, prix haut / net bas)', `Ce loyer représente ${share.low} à ${share.high} % de ce net, sous le seuil des 30 %.`));
  out.push(e('B2_p2_en', 'slot', 'B2: named slot — all-inclusive rent',
    `${m.adminSlotSentence('fiscalite', 'en')} is particularly easy to fit into a budget`));
  out.push(e('B2_p3_en', 'fix', 'B2: corrected calculation', `This rent represents ${share.low} to ${share.high}% of this net, below the 30% threshold.`));

  // ── Lot B3 — salaire-suisse-net-frontalier-2026 (une seule mention dans le paragraphe) ─────────────────────────────
  out.push(e('B3_fr', 'slot', "B3 : créneau nommé — l'arbitrage logement",
    `${m.adminSlotSentence('salaire', 'fr')} Et si tu pousses la logique jusqu'au coliving tout inclus (${price.fr} par mois), tu économises en plus sur les charges, l'internet, le ménage, la piscine et la salle de sport, les abonnements streaming.`));
  out.push(e('B3_en', 'slot', 'B3: named slot — the housing arbitrage',
    `${m.adminSlotSentence('salaire', 'en')} Push it further with all-inclusive coliving (${price.en} a month): utilities, internet, cleaning, pool and gym all included.`));

  // ── Lot B4 — dossier-location-frontalier-suisse-france (sans phrase garant : déjà au §7 de l'article) ───────────────
  out.push(e('B4_fr', 'slot', 'B4 : un dossier en trois pièces (sans phrase garant, déjà au §7) + preuve sociale D3', [
    `Si le parcours du combattant locatif te décourage, le coliving offre une autre voie. ${m.adminSlotSentence('dossier', 'fr')} Le bail est un bail meublé de ${F.lease.months} mois, résiliable avec ${word(F.lease.noticeMonths, 'fr')} mois de préavis, et tu peux emménager en quelques jours si une chambre est libre.`,
    `Plus de ${n} résidents sont passés par nos maisons depuis ${since} : nous connaissons les spécificités des contrats suisses, nous raisonnons en CHF, et nous savons qu'un salaire genevois de ${MARKET_SALARY.fr} est un excellent profil locataire, même quand les plateformes de location classiques ne le voient pas ainsi.`,
  ].join('\n\n')));
  out.push(e('B4_en', 'slot', 'B4: a three-item file (no guarantor sentence, already in §7) + D3 social proof', [
    `If the rental obstacle course discourages you, coliving offers another route. ${m.adminSlotSentence('dossier', 'en')} The lease is a ${F.lease.months}-month furnished lease you can end with ${word(F.lease.noticeMonths, 'en')} month's notice, and you can move in within days if a room is free.`,
    `More than ${n} residents have lived in our houses since ${since}: we understand Swiss contract specifics, we think in CHF, and we know that a Geneva salary of ${MARKET_SALARY.en} makes an excellent tenant profile, even when traditional rental platforms don't see it that way.`,
  ].join('\n\n')));

  // ── Lot B5 — organisations-internationales-geneve-ou-habiter ─────────────────────────────────────────────────────────
  const row = {
    fr: `| ${m.adminSlotSentence('oi', 'fr')} | ${m.priceRangeCell('fr')}, tout inclus | ✅ Maison de ${perHouse.min} à ${perHouse.max} personnes | ✅ ${F.lease.noticeMonths} mois de préavis |`,
    en: `| ${m.adminSlotSentence('oi', 'en')} | ${m.priceRangeCell('en')}, all inclusive | ✅ House of ${perHouse.min} to ${perHouse.max} people | ✅ ${F.lease.noticeMonths} month's notice |`,
  };
  for (const lang of ['fr', 'en']) {
    out.push(e(`B5_table_${lang}`, 'slot', 'B5a + D-B1 : colonne « Trajet → Nations » retirée, ligne La Villa (M3)', (f) => {
      const rows = dropColumn(f, 2).split('\n');
      const i = rows.findIndex((r) => r.includes('La Villa'));
      if (i < 0) throw new Error(`ligne La Villa introuvable dans le tableau OI (${lang})`);
      rows[i] = row[lang];
      return rows.join('\n');
    }));
  }
  out.push(e('B5_surcout_fr', 'fix', 'B5a bis : écart coliving − studio recalculé', `Le surcoût d'environ ${premium.low} à ${premium.high} CHF par mois`));
  out.push(e('B5_surcout_en', 'fix', 'B5a bis: premium recalculated', `The premium of roughly CHF ${premium.low} to ${premium.high} a month`));
  out.push(e('B5_train_fr', 'travel', 'D-B1 : durées non mesurées retirées (D1)', "Depuis 2019, vivre côté France et travailler aux Nations, c'est un trajet en train, confortablement assis, WiFi inclus."));
  out.push(e('B5_train_en', 'travel', 'D-B1: unmeasured durations removed (D1)', 'Since 2019, living on the French side and working at the Nations means a train commute, comfortably seated, WiFi included.'));
  out.push(e('B5_secheron_fr', 'travel', "D-B1 : paragraphe « 25 minutes jusqu'à Sécheron… voiture 40-60 minutes » retiré", (f) => f.slice(0, f.indexOf('\n\n'))));
  out.push(e('B5_secheron_en', 'travel', 'D-B1: paragraph « 25 minutes to Sécheron… driving 40-60 minutes » removed', (f) => f.slice(0, f.indexOf('\n\n'))));
  out.push(e('B5_profil_fr', 'proof', 'D-B2 : « 18 % » et « profil type » retirés, titre neutre',
    '## Ce dont un expat OI a besoin en arrivant\n\nUn expat OI qui arrive à Genève a des besoins spécifiques que le coliving remplit naturellement.'));
  out.push(e('B5_profil_en', 'proof', 'D-B2: « 18% » and « typical profile » removed, neutral heading',
    '## What an IO expat needs on arrival\n\nAn IO expat arriving in Geneva has specific needs that coliving naturally fulfills.'));

  // ── Lot B6 — choc-culturel-franco-suisse-expatrie-geneve ─────────────────────────────────────────────────────────────
  out.push(e('B6_rel_fr', 'slot', 'B6 : créneau nommé — relations sociales (reprise du comparatif publié)', (f) =>
    `${f} ${m.adminSlotSentence('choc', 'fr')}`));
  out.push(e('B6_rel_en', 'slot', 'B6: named slot — social relationships (as in the published comparison)', (f) =>
    `${f} ${m.adminSlotSentence('choc', 'en')}`));
  out.push(e('B6_concl_en', 'slot', 'B6: EN conclusion (parity with FR)', (f) =>
    `${f} That's what La Villa Coliving offers: ${F.totalRooms} rooms in ${houses.en} houses on the French side, ${D.en.distance}.`));
  out.push(e('B6_concl_fr', 'fix', 'D-B3 : « 29 résidents de toutes nationalités » → « 29 chambres »', `${F.totalRooms} chambres dans ${F.totalHouses} maisons côté France`));

  return out;
}
