/**
 * Génère public/llms.txt (FR) et public/en/llms.txt (EN) depuis la fiche de faits canonique
 * (src/data/entityFacts.ts, + STATS pour {{LIVING_SPACE}} depuis le lot L2 du 09/10/2026) et les gabarits
 * scripts/llms-template.{fr,en}.md (Lot S1.3).
 * Les fichiers générés sont COMMITTÉS (le workflow ne committe que le prérendu) ; la garde
 * scripts/check-entity-facts.mjs régénère en mémoire et échoue s'ils diffèrent → « npm run build:llms ».
 * La date « Dernière mise à jour » = ENTITY_FACTS_VERSION (pas la date du jour : sortie déterministe).
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
  if (lang === 'en') {
    return [
      `- ${F.totalRooms} private furnished rooms (${F.surfaces.min} to ${F.surfaces.max} m²) across ${F.totalHouses} houses (La Villa, Le Loft, Le Lodge)`,
      `- Location: Ville-la-Grand, Ambilly, Annemasse (Haute-Savoie, France) — ${F.commuteFormula.en}`,
      `- Price: all-inclusive from ${F.price.en.fromChf}/month (contractual rent in euros: from ${F.price.en.fromEur}) for the ${villa.sharedBathRooms} La Villa rooms sharing a shower room between 2 rooms; ${std}/month (${stdEur}) with a private shower room`,
      `- Included: utilities, fibre up to ${F.fiberSpeed}, common-area cleaning ${F.cleaningPerWeek} times a week, pool, sauna, gym, streaming, yoga and events`,
      `- Target: Swiss cross-border workers, expats, young professionals working in Geneva`,
      `- ${F.lease.months}-month lease: free to leave at any time with ${F.lease.noticeMonths} month's notice`,
      `- No application fee, no agency fee; deposit of ${F.depositMonths} months' rent excluding charges`,
      `- ${F.totalResidents}+ residents welcomed since ${F.foundingLabel.en}, run directly by the two founders (${F.founders.join(' and ')}), regular events (pizza nights, yoga classes, afterworks)`,
      `- 99% occupancy rate over 5 years`,
    ].join('\n');
  }
  return [
    `- ${F.totalRooms} chambres meublées privées (${F.surfaces.min} à ${F.surfaces.max} m²) dans ${F.totalHouses} maisons (La Villa, Le Loft, Le Lodge)`,
    `- Localisation : Ville-la-Grand, Ambilly, Annemasse (Haute-Savoie, France) — ${F.commuteFormula.fr}`,
    `- Prix : tout inclus dès ${F.price.fr.fromChf}/mois (loyer contractuel en euros : dès ${F.price.fr.fromEur}) pour les ${villa.sharedBathRooms} chambres de La Villa à salle d'eau partagée entre 2 chambres ; ${std}/mois (${stdEur}) avec salle d'eau privative`,
    `- Inclus : charges, fibre jusqu'à ${F.fiberSpeed}, ménage des espaces communs ${F.cleaningPerWeek} fois par semaine, piscine, sauna, salle de sport, streaming, yoga et événements`,
    `- Public : frontaliers Suisse, expats, jeunes professionnels qui travaillent à Genève`,
    `- Bail de ${F.lease.months} mois : libre de partir à tout moment avec ${F.lease.noticeMonths} mois de préavis`,
    `- Sans frais de dossier ni d'agence ; caution de ${F.depositMonths} mois de loyer hors charges`,
    `- ${F.totalResidents}+ résidents accueillis depuis ${F.foundingLabel.fr}, gestion en direct par les deux fondateurs (${F.founders.join(' et ')}), événements réguliers (pizza party, cours de yoga, afterworks)`,
    `- 99% d'occupation sur 5 ans d'exploitation`,
  ].join('\n');
}

function houseLines(lang, m) {
  return m.ENTITY_FACTS.houses.map((h) => (lang === 'en'
    ? `- ${h.label}: ${h.rooms} rooms, ${h.commune} — ${h.amenities.en}. ${h.commute.en.charAt(0).toUpperCase()}${h.commute.en.slice(1)}.`
    : `- ${h.label} : ${h.rooms} chambres, ${h.commune} — ${h.amenities.fr}. ${h.commute.fr.charAt(0).toUpperCase()}${h.commute.fr.slice(1)}.`)).join('\n');
}

/** (Lot L2, 09/10/2026) Espace de vie par colocataire — STATS.livingSpacePerResidentMin/Max (fact block §1), plus de « 38 m² » en dur. */
function livingSpace(lang, m) {
  const S = m.STATS;
  return lang === 'en'
    ? `${S.livingSpacePerResidentMin} to ${S.livingSpacePerResidentMax} m² of living space per flatmate`
    : `${S.livingSpacePerResidentMin} à ${S.livingSpacePerResidentMax} m² d'espace de vie par colocataire`;
}

function houseLinks(lang, m) {
  return m.ENTITY_FACTS.houses.map((h) => (lang === 'en'
    ? `- ${h.label} (${h.rooms} rooms): https://www.lavillacoliving.com/en/${h.slug}`
    : `- ${h.label} (${h.rooms} ch.) : https://www.lavillacoliving.com/${h.slug}`)).join('\n');
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
    .replace(/\{\{MIN\}\}/g, String(F.genevaMinutes))
    .replace(/\{\{RESPONSE_HOURS\}\}/g, String(F.responseHours))
    .replace(/\{\{DEPOSIT_MONTHS\}\}/g, String(F.depositMonths))
    .replace('{{INSTAGRAM}}', instagram)
    .replace('{{UPDATED}}', F.version);
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
