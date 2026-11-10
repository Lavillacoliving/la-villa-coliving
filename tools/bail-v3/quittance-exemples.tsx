/**
 * Rend des exemples de quittance du portail (lot « portail » du bail v3) pour vérifier la mise en page sans compte
 * locataire : un bail v3 (mois complet, mois d'entrée) et un bail antérieur (rendu d'origine). Données fictives.
 * Usage (depuis la racine du dépôt) :
 *   npx esbuild tools/bail-v3/quittance-exemples.tsx --bundle --platform=node --format=esm --packages=external \
 *     --alias:@=./src --jsx=automatic --outfile=tools/bail-v3/.build/quittance-exemples.mjs
 *   node tools/bail-v3/.build/quittance-exemples.mjs <dossier-de-sortie>
 * (les deux images du gabarit — logo et signature — sont chargées depuis le site : connexion nécessaire)
 */
import path from "node:path";
import fs from "node:fs";
import { renderToFile } from "@react-pdf/renderer";
import { QuittancePDF } from "@/pages/portail/QuittancePDF";
import { isV3Fiche, quittanceLessor, quittanceSplit, type LessorSource, type QuittanceFiche } from "@/lib/portail/quittance";

const outDir = process.argv[2];
if (!outDir) { console.error("usage: quittance-exemples.mjs <dossier-de-sortie>"); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

const LODGE: LessorSource = {
  is_coliving: true, legal_entity_name: "Sleep In", siege_social: "8 rue du Mont-Blanc – 74100 Annemasse – France", siret: "882 153 810 00016",
  property_address: "8 rue de Romagny - 74100 Annemasse",
  entity: { legal_name: "SCI Sleep In", legal_form: "sci", trade_name: "La Villa Coliving", registration: "RCS Thonon-les-Bains 882 153 810 — SIRET 882 153 810 00016", siege: "8 rue du Mont-Blanc, 74100 Annemasse" },
};
const VILLA: LessorSource = {
  is_coliving: true, legal_entity_name: "LA VILLA", siege_social: "34 rue du Foron – 74100 Ville-la-Grand – France", siret: "898 236 518 00012",
  property_address: "34 rue du Foron - 74100 Ville-la-Grand",
  entity: { legal_name: "Indivision Austin-Piot", legal_form: "indivision", trade_name: "La Villa Coliving", registration: "SIRET 898 236 518 00012", siege: "34 rue du Foron, 74100 Ville-la-Grand" },
};

interface Case { house: string; address: string; room: string; lessor: LessorSource; fiche: QuittanceFiche; propertyCharges: number; month: string; label: string; start: string; end: string; received: number }
const CASES: Record<string, Case> = {
  v3_LeLodge_mois_complet: { house: "Le Lodge", address: "8 rue de Romagny - 74100 Annemasse - France", room: "1", lessor: LODGE, fiche: { rent_eur: 1194, charges_forfait_eur: 336, move_in_date: "2026-12-15" }, propertyCharges: 420, month: "2027-01", label: "Janvier 2027", start: "01/01/2027", end: "31/01/2027", received: 1530 },
  v3_LeLodge_mois_entree: { house: "Le Lodge", address: "8 rue de Romagny - 74100 Annemasse - France", room: "1", lessor: LODGE, fiche: { rent_eur: 1194, charges_forfait_eur: 336, move_in_date: "2026-12-15" }, propertyCharges: 420, month: "2026-12", label: "Décembre 2026", start: "01/12/2026", end: "31/12/2026", received: 816 },
  v3_LaVilla_mois_complet: { house: "La Villa", address: "34 rue du Foron - 74100 Ville-la-Grand - France", room: "7", lessor: VILLA, fiche: { rent_eur: 1126, charges_forfait_eur: 344, move_in_date: "2026-12-01" }, propertyCharges: 360, month: "2027-01", label: "Janvier 2027", start: "01/01/2027", end: "31/01/2027", received: 1470 },
  bail_anterieur_LaVilla: { house: "La Villa", address: "34 rue du Foron - 74100 Ville-la-Grand - France", room: "7", lessor: VILLA, fiche: { rent_eur: null, charges_forfait_eur: null, move_in_date: "2026-03-01" }, propertyCharges: 360, month: "2026-10", label: "Octobre 2026", start: "01/10/2026", end: "31/10/2026", received: 1460 },
};

for (const [key, c] of Object.entries(CASES)) {
  const v3 = isV3Fiche(c.fiche);
  const split = quittanceSplit({ received: c.received, month: c.month, fiche: c.fiche, propertyCharges: c.propertyCharges });
  const lessor = quittanceLessor(c.lessor, v3);
  const data = {
    bailleur_name: lessor.name, bailleur_address: lessor.address, bailleur_siret: lessor.siret,
    ...(split.basis === "bail_v3" ? { bailleur_designation: lessor.designation, bailleur_registration: lessor.registration, brand_name: lessor.brand, rent_label: "Loyer hors charges", charges_label: "Forfait de charges" } : {}),
    locataire_name: "Camille Exemple", property_name: c.house, property_address: c.address, room_number: c.room, is_coliving: true,
    month_label: c.label, period_start: c.start, period_end: c.end, loyer_nu: split.rent, charges: split.charges, total: c.received,
    payment_date: "05/" + c.start.slice(3), generated_date: "10/11/2026",
  };
  const file = path.join(outDir, `Quittance_${key}.pdf`);
  await renderToFile(<QuittancePDF data={data} />, file);
  console.log(`${key} : ${split.basis} · loyer ${split.rent} € · charges ${split.charges} € · bailleur ${lessor.name}`);
}
