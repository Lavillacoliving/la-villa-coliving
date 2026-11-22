/**
 * Génère public/llms.txt (FR) et public/en/llms.txt (EN) depuis la fiche de faits canonique
 * (src/data/entityFacts.ts, + STATS pour {{LIVING_SPACE}} depuis le lot L2 du 09/10/2026) et les gabarits
 * scripts/llms-template.{fr,en}.md (Lot S1.3).
 * Les fichiers générés sont COMMITTÉS (le workflow ne committe que le prérendu) ; la garde
 * scripts/check-entity-facts.mjs régénère en mémoire et échoue s'ils diffèrent → « npm run build:llms ».
 * La date « Dernière mise à jour » = ENTITY_FACTS_VERSION (pas la date du jour : sortie déterministe).
 * (L'Appart, Lot 4, étape E5 — textes de la source du 13/11/2026) Deux gammes, jamais fondues : les trois premiers faits clés
 * sont les trois phrases canoniques (marque, maisons, L'Appart) au caractère près ; chaque autre fait nomme sa gamme (« des
 * maisons », « de L'Appart ») ; L'Appart a sa ligne de propriété (qui dit ce qui lui MANQUE) et son lien ; aucun prix de
 * L'Appart dans une phrase qui nomme piscine, sauna ou salle de sport (garde check:facts, llmsGammeIssues).
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { loadEntityFacts, ROOT } from './lib/load-entity-facts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function factsLines(lang, m) {
  const F = m.ENTITY_FACTS;
  const std = lang === 'en' ? `CHF ${String(F.price.standardChf).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : `${String(F.price.standardChf).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} CHF`;
  const stdEur = lang === 'en' ? `€${String(F.price.standardEur).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : `${String(F.price.standardEur).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`;
  const villa = F.houses.find((h) => h.slug === 'lavilla');
  // (13/11/2026) Trois paliers : le « dès » des maisons (F.price.fromChf / fromEur), le prix standard et son nombre de chambres,
  // puis le détail des chambres de La Villa à salle d'eau partagée, chambre par chambre (sharedBathTiersText, src/data/stats.ts).
  const privateRooms = F.totalRooms - villa.sharedBathRooms;
  // (L'Appart, E5) Faits de L'Appart = APPART (src/data/appart.ts) : paliers, surfaces, ouverture, trajet (appartCommuteLine).
  const A = m.APPART, AP = A.price, STD = A.rooms.standard, SUITE = A.rooms.suite;
  const nStd = STD.numbers.length;
  const perPerson = lang === 'en' ? `€${m.thousands(AP.suitePerPersonEur, ',')}` : `${m.thousands(AP.suitePerPersonEur, ' ')} €`;
  if (lang === 'en') {
    return [
      `- ${m.BRAND_CANONICAL_SENTENCE.en}`,
      `- ${m.MAISONS_CANONICAL_SENTENCE.en}`,
      `- ${m.APPART_CANONICAL_SENTENCE.en}`,
      `- Location of the houses: Ville-la-Grand, Ambilly, Annemasse (Haute-Savoie, France) — ${F.commuteFormula.en}`,
      `- Location of ${A.name}: ${A.commune}, near the station — ${m.appartCommuteLine('en')}`,
      `- Prices in the houses: ${std}/month (${stdEur}) with a private shower room (${privateRooms} of ${F.totalRooms} rooms); at La Villa, ${villa.sharedBathRooms} rooms sharing a shower room between 2 rooms: ${m.sharedBathTiersText('en', { perMonth: true, eur: true })}`,
      `- Prices at ${A.name}: ${AP.room.en.chf}/month (${AP.room.en.eur}) for each of the ${m.numberWord(nStd, 'en')} ${STD.surfaceM2} m² rooms; ${AP.suite.en.chf}/month (${AP.suite.en.eur}) for the ${SUITE.surfaceM2} m² suite, for one or two people, or ${perPerson} each for two`,
      `- Included in the houses: utilities, fibre up to ${F.fiberSpeed}, common-area cleaning ${F.cleaningPerWeek} times a week, pool, sauna, gym, streaming, yoga and events`,
      `- Included at ${A.name}: bills, fibre, streaming, cleaning of the shared areas once a week ${m.cleaningSharedBath('en')}, access to the houses' yoga and fitness classes; not included: bed linen and towels, cleaning products and household supplies; ${A.name} has no pool, sauna or gym`,
      `- ${A.name} opens for rent in ${A.opensOnLabel.en}`,
      `- Target: Swiss cross-border workers, expats, young professionals working in Geneva; students and apprentices welcome at ${A.name}`,
      `- ${F.lease.months}-month lease: free to leave at any time with ${F.lease.noticeMonths} month's notice`,
      `- No application fee, no agency fee; deposit of ${F.depositMonths} months' rent excluding charges, payable in 1, 2 or 3 instalments depending on your application`,
      `- ${F.totalResidents}+ residents welcomed in the houses since ${F.foundingLabel.en}, run directly by the two founders (${F.founders.join(' and ')}), regular events (pizza nights, yoga classes, afterworks)`,
      // (Lot L3, Jérôme 09/10/2026) D3 : ancienne ligne « occupancy over 5 years » retirée ; D4 : note Google (STATS_DISPLAY.googleRating) + lien fiche.
      `- Reviews: ${m.STATS_DISPLAY.en.googleRating} — ${F.googleReviews.url}`,
    ].join('\n');
  }
  return [
    `- ${m.BRAND_CANONICAL_SENTENCE.fr}`,
    `- ${m.MAISONS_CANONICAL_SENTENCE.fr}`,
    `- ${m.APPART_CANONICAL_SENTENCE.fr}`,
    `- Localisation des maisons : Ville-la-Grand, Ambilly, Annemasse (Haute-Savoie, France) — ${F.commuteFormula.fr}`,
    `- Localisation de ${A.name} : ${A.commune}, quartier de la gare — ${m.appartCommuteLine('fr')}`,
    `- Prix des maisons : ${std}/mois (${stdEur}) avec salle d'eau privative (${privateRooms} chambres sur ${F.totalRooms}) ; à La Villa, ${villa.sharedBathRooms} chambres à salle d'eau partagée entre 2 chambres : ${m.sharedBathTiersText('fr', { perMonth: true, eur: true })}`,
    `- Prix de ${A.name} : ${AP.room.fr.chf}/mois (${AP.room.fr.eur}) pour chacune des ${nStd} chambres de ${STD.surfaceM2} m² ; ${AP.suite.fr.chf}/mois (${AP.suite.fr.eur}) pour la suite de ${SUITE.surfaceM2} m², pour une ou deux personnes, soit ${perPerson} par personne à deux`,
    `- Inclus dans les maisons : charges, fibre jusqu'à ${F.fiberSpeed}, ménage des espaces communs ${F.cleaningPerWeek} fois par semaine, piscine, sauna, salle de sport, streaming, yoga et événements`,
    `- Inclus à ${A.name} : charges, fibre, streaming, ménage des parties communes une fois par semaine ${m.cleaningSharedBath('fr')}, accès aux cours de yoga et de sport des maisons ; non compris : linge de lit et serviettes, produits d'entretien et fournitures ; ${A.name} n'a ni piscine, ni sauna, ni salle de sport`,
    `- ${A.name} ouvre à la location en ${A.opensOnLabel.fr}`,
    `- Public : frontaliers Suisse, expats, jeunes professionnels qui travaillent à Genève ; étudiants et alternants acceptés à ${A.name}`,
    `- Bail de ${F.lease.months} mois : libre de partir à tout moment avec ${F.lease.noticeMonths} mois de préavis`,
    `- Sans frais de dossier ni d'agence ; caution de ${F.depositMonths} mois de loyer hors charges, payable en 1, 2 ou 3 fois selon ton dossier`,
    `- ${F.totalResidents}+ résidents accueillis dans les maisons depuis ${F.foundingLabel.fr}, gestion en direct par les deux fondateurs (${F.founders.join(' et ')}), événements réguliers (pizza party, cours de yoga, afterworks)`,
    // (Lot L3, Jérôme 09/10/2026) D3 : ancienne ligne « occupation sur 5 ans » retirée ; D4 : note Google (STATS_DISPLAY.googleRating) + lien fiche.
    `- Avis : ${m.STATS_DISPLAY.fr.googleRating} — ${F.googleReviews.url}`,
  ].join('\n');
}

function houseLines(lang, m) {
  const houses = m.ENTITY_FACTS.houses.map((h) => (lang === 'en'
    ? `- ${h.label}: ${h.rooms} rooms, ${h.commune} — ${h.amenities.en}. ${h.commute.en.charAt(0).toUpperCase()}${h.commute.en.slice(1)}.`
    : `- ${h.label} : ${h.rooms} chambres, ${h.commune} — ${h.amenities.fr}. ${h.commute.fr.charAt(0).toUpperCase()}${h.commute.fr.slice(1)}.`));
  // (L'Appart, E5) Même gabarit que les maisons (chambres, commune, équipements, trajet), mais la case « équipements » dit ce
  // qui MANQUE : un assistant ne lui prête pas la piscine de la ligne d'au-dessus. Aucun prix dans cette ligne.
  const A = m.APPART, line = m.appartCommuteLine(lang);
  const Line = `${line.charAt(0).toUpperCase()}${line.slice(1)}`;
  houses.push(lang === 'en'
    ? `- ${A.name}: ${A.rooms.total} rooms, ${A.commune}, near the station — a flatshare in a ${A.flat.surfaceM2} m² flat, with no pool, sauna or gym. ${Line}.`
    : `- ${A.name} : ${A.rooms.total} chambres, ${A.commune}, quartier de la gare — colocation dans un appartement de ${A.flat.surfaceM2} m², sans piscine, ni sauna, ni salle de sport. ${Line}.`);
  return houses.join('\n');
}

/** (Lot L2, 09/10/2026) Espace de vie par colocataire — STATS.livingSpacePerResidentMin/Max (fact block §1), plus de « 38 m² » en dur. */
function livingSpace(lang, m) {
  const S = m.STATS;
  return lang === 'en'
    ? `${S.livingSpacePerResidentMin} to ${S.livingSpacePerResidentMax} m² of living space per flatmate`
    : `${S.livingSpacePerResidentMin} à ${S.livingSpacePerResidentMax} m² d'espace de vie par colocataire`;
}

function houseLinks(lang, m) {
  const A = m.APPART;
  // (L'Appart, E5) Le lien de L'Appart après ceux des maisons : URL nue, clé PUBLIQUE de la page (APPART.key).
  return [...m.ENTITY_FACTS.houses.map((h) => (lang === 'en'
    ? `- ${h.label} (${h.rooms} rooms): https://www.lavillacoliving.com/en/${h.slug}`
    : `- ${h.label} (${h.rooms} ch.) : https://www.lavillacoliving.com/${h.slug}`)),
  lang === 'en'
    ? `- ${A.name}, flatshare in ${A.commune} (${A.rooms.total} rooms): https://www.lavillacoliving.com/en/${A.key}`
    : `- ${A.name}, colocation à ${A.commune} (${A.rooms.total} ch.) : https://www.lavillacoliving.com/${A.key}`].join('\n');
}

/** (A2, 11/10/2026) Occupation du volet « Vu de nos maisons » : valeur exacte + base, depuis la source unique (OCCUPANCY). */
function occupancyLine(lang, m) {
  const o = m.OCCUPANCY, d = m.OCCUPANCY_DISPLAY[lang];
  return lang === 'en'
    ? `${d.value} of room-days excluding each house's first ${o.rampUpWeeks} weeks (${o.sinceLabel.en} → ${o.measuredOnLabel.en})`
    : `${d.value} des jours-chambre hors les ${o.rampUpWeeks} premières semaines de chaque maison (${o.sinceLabel.fr} → ${o.measuredOnLabel.fr})`;
}

/** Rendu complet d'un llms.txt (pur : même sortie pour une même source). */
export async function renderLlms(lang, m) {
  const tpl = await fs.readFile(path.join(__dirname, `llms-template.${lang}.md`), 'utf8');
  const F = m.ENTITY_FACTS;
  const instagram = `@${F.sameAs[0].replace(/\/$/, '').split('/').pop()} (${F.sameAs[0]})`;
  return tpl
    .replace('{{FACTS}}', factsLines(lang, m))
    .replace('{{HOUSES}}', houseLines(lang, m))
    // (Lot L1, 10/2026) Bloc « Où chercher une chambre côté France » — même texte que le composant <OuChercher variant="full"/>.
    .replace('{{OU_CHERCHER}}', m.ouChercherMarkdown(lang))
    .replace('{{HOUSE_LINKS}}', houseLinks(lang, m))
    .replace('{{LIVING_SPACE}}', livingSpace(lang, m))
    // (21/11/2026, lot « élevé, pas cher ») Prix au m² des maisons (stats.ts), phrase « premium » et FAQ « La Villa Coliving est-elle
    // chère ? » : mêmes chaînes que le site (src/data/priceFacts.ts), jamais retapées.
    .replace('{{HOUSES_CHF_PER_M2}}', m.housesChfPerM2Text(lang))
    .replace('{{PREMIUM}}', m.PREMIUM_SENTENCE[lang])
    .replace('{{PRICE_FAQ_Q}}', m.priceJustificationFaq(lang).q)
    .replace('{{PRICE_FAQ_A}}', m.priceJustificationFaq(lang).a)
    .replace(/\{\{OCCUPANCY\}\}/g, occupancyLine(lang, m)) // (A2, 11/10/2026) même mesure que /investisseurs et l'Observatoire
    // (Lot L2, 09/10/2026, D1) Libellé de marque unique « 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte » = STATS_DISPLAY.distance.
    .replace(/\{\{DISTANCE\}\}/g, m.STATS_DISPLAY[lang].distance)
    // (L'Appart, E5) En-tête à deux gammes : nombre de maisons, nom et descripteur de L'Appart (APPART).
    .replace(/\{\{NB_MAISONS\}\}/g, String(F.totalHouses))
    .replace(/\{\{APPART_DESCRIPTOR\}\}/g, m.APPART.descriptor[lang])
    .replace(/\{\{APPART\}\}/g, m.APPART.name)
    .replace(/\{\{MIN\}\}/g, String(F.genevaMinutes))
    .replace(/\{\{RESPONSE_HOURS\}\}/g, String(F.responseHours))
    .replace(/\{\{DEPOSIT_MONTHS\}\}/g, String(F.depositMonths))
    .replace('{{INSTAGRAM}}', instagram)
    .replace('{{UPDATED}}', F.version.slice(0, 10)); // AAAA-MM-JJ : un suffixe de version (b, c…) ne fuit pas dans llms.txt
}

export const LLMS_FILES = { fr: path.join(ROOT, 'public', 'llms.txt'), en: path.join(ROOT, 'public', 'en', 'llms.txt') };

async function main() {
  const m = await loadEntityFacts();
  for (const lang of ['fr', 'en']) {
    const out = await renderLlms(lang, m);
    await fs.writeFile(LLMS_FILES[lang], out);
    console.log(`✅ ${path.relative(ROOT, LLMS_FILES[lang])} (${out.length} car.)`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
}
