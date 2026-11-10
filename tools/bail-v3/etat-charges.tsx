/**
 * Rend des exemples de l'« État récapitulatif des charges » (lot 2 du bail v3) avec le moteur du site, pour vérifier la
 * mise en page sans passer par le tableau de bord. Données fictives sauf les trois forfaits provisoires 2026.
 * Usage (depuis la racine du dépôt) :
 *   npx esbuild tools/bail-v3/etat-charges.tsx --bundle --platform=node --format=esm --packages=external \
 *     --alias:@=./src --jsx=automatic --outfile=tools/bail-v3/.build/etat-charges.mjs
 *   node tools/bail-v3/.build/etat-charges.mjs <dossier-de-sortie>
 */
import path from "node:path";
import fs from "node:fs";
import { renderToFile } from "@react-pdf/renderer";
import { ChargesStatementPDF } from "@/lib/bailV3/ChargesStatementPDF";
import { statementFromExercise, type ChargesExercise, type ChargesUnit } from "@/lib/bailV3/chargesEntry";
import { chargePosteLabel } from "@/data/chargePostes";

const outDir = process.argv[2];
if (!outDir) { console.error("usage: etat-charges.mjs <dossier-de-sortie>"); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const logo = path.resolve(process.cwd(), "public/logos/logo-full.png");

const line = (id: string, n: number, poste: string, amount: number, pct: number, source: string | null): ChargesExercise["lines"][number] => ({
  id: `${id}-${n}`, property_charges_id: id, poste_code: poste, label: chargePosteLabel(poste), amount_eur: amount, recoverable_pct: pct,
  recoverable_eur: Math.round(amount * pct) / 100, source, sort_order: n,
});

export const SAMPLE_EXERCISES: Record<string, { house: { name: string; address: string }; lessor: { name: string; address: string } | null; unit?: ChargesUnit; ex: ChargesExercise }> = {
  LaVilla_2026_provisoire: {
    house: { name: "La Villa", address: "34 rue du Foron, 74100 Ville-la-Grand" },
    lessor: { name: "Indivision Austin-Piot", address: "34 rue du Foron, 74100 Ville-la-Grand" },
    ex: {
      id: "villa-2026", property_id: "villa", fiscal_year: 2026, method: "provisional_2025_plus_10", status: "provisoire", total_recoverable_eur: 41312, room_count: 10,
      per_room_month_eur: 344.27, effective_from: "2026-10-26", validated_at: null, validated_by: null, notes: "note interne",
      lines: [line("villa-2026", 0, "projection_2025_plus_10", 41312, 100, null)],
    },
  },
  LeLodge_2026_exemple_cloture: {
    house: { name: "Le Lodge", address: "8 rue de Romagny, 74100 Annemasse" },
    lessor: { name: "SCI Sleep In", address: "8 rue du Mont-Blanc, 74100 Annemasse" },
    ex: {
      id: "lodge-2026", property_id: "lodge", fiscal_year: 2026, method: "manual_closing", status: "valide", total_recoverable_eur: 0, room_count: 12,
      per_room_month_eur: 0, effective_from: "2027-03-01", validated_at: "2027-02-18T09:30:00Z", validated_by: "exemple", notes: null,
      lines: [
        line("lodge-2026", 0, "eau", 6240.5, 100, "clôture cabinet 2026"),
        line("lodge-2026", 1, "energie", 21480, 100, "clôture cabinet 2026"),
        line("lodge-2026", 2, "proprete_communs", 14400, 100, "clôture cabinet 2026"),
        line("lodge-2026", 3, "espaces_verts", 3600, 100, "clôture cabinet 2026"),
        line("lodge-2026", 4, "consommables", 1850.75, 100, "clôture cabinet 2026"),
        line("lodge-2026", 5, "chaudiere_entretien", 480, 90, "contrat d'entretien"),
        line("lodge-2026", 6, "teom", 451, 100, "avis de taxe foncière 2026"),
        line("lodge-2026", 7, "assainissement", 1120, 100, "clôture cabinet 2026"),
      ],
    },
  },
  // Bien loué en entier, hors générateur de bail : montant par mois, pas de mention du forfait légal, pas de bailleur imprimé.
  MontBlanc_exemple_logement_entier: {
    house: { name: "Mont-Blanc", address: "8 rue du Mont-Blanc, 74100 Annemasse" },
    lessor: null,
    unit: "logement",
    ex: {
      id: "mb-2026", property_id: "mb", fiscal_year: 2026, method: "manual_closing", status: "valide", total_recoverable_eur: 0, room_count: 1,
      per_room_month_eur: 0, effective_from: "2027-03-01", validated_at: "2027-02-18T09:30:00Z", validated_by: "exemple", notes: null,
      lines: [
        line("mb-2026", 0, "eau", 1320.4, 100, "clôture cabinet 2026"),
        line("mb-2026", 1, "energie", 2980, 100, "clôture cabinet 2026"),
        line("mb-2026", 2, "chaudiere_entretien", 210, 90, "contrat d'entretien"),
        line("mb-2026", 3, "teom", 412, 100, "avis de taxe foncière 2026"),
      ],
    },
  },
};

for (const [key, { house, lessor, unit, ex }] of Object.entries(SAMPLE_EXERCISES)) {
  const st = statementFromExercise(ex, house, lessor, "2026-11-10", unit);
  const file = path.join(outDir, `Etat_charges_${key}.pdf`);
  await renderToFile(<ChargesStatementPDF st={st} logoSrc={fs.existsSync(logo) ? logo : null} />, file);
  console.log(`${key} (${st.unit}) : total ${st.total} € · ${st.per_room_month} € par mois et par ${st.unit} → ${file}`);
}
