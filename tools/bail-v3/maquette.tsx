/**
 * Génère les maquettes PDF du bail v3 avec le moteur du site (@react-pdf/renderer, mêmes styles que BailPDF.tsx).
 * Usage (depuis la racine du dépôt) :
 *   npx esbuild tools/bail-v3/maquette.tsx --bundle --platform=node --format=esm --packages=external \
 *     --alias:@=./src --jsx=automatic --outfile=tools/bail-v3/.build/maquette.mjs
 *   node tools/bail-v3/.build/maquette.mjs <dossier-de-sortie>
 */
import path from "node:path";
import fs from "node:fs";
import { renderToFile } from "@react-pdf/renderer";
import { buildLeaseV3 } from "@/lib/bailV3/clauses";
import { BailV3PDF } from "@/lib/bailV3/BailV3PDF";
import { CASES } from "./cases";
import { NOTICE_INFORMATION_2023, NOTICE_SOURCE, NOTICE_TITLE } from "@/data/noticeInformation2023";

const outDir = process.argv[2];
if (!outDir) { console.error("usage: maquette.mjs <dossier-de-sortie>"); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const logo = path.resolve(process.cwd(), "public/logos/logo-full.png");
if (!fs.existsSync(logo)) { console.error("logo introuvable :", logo); process.exit(1); }

for (const [key, input] of Object.entries(CASES)) {
  const doc = buildLeaseV3(input);
  // BAIL_V3_JSON=<dossier> : exporte aussi le document structuré (relecture Word, diff de texte)
  if (process.env.BAIL_V3_JSON) {
    fs.mkdirSync(process.env.BAIL_V3_JSON, { recursive: true });
    fs.writeFileSync(path.join(process.env.BAIL_V3_JSON, `${key}.json`), JSON.stringify(doc, null, 1));
  }
  const file = path.join(outDir, `Maquette_Bail_v3_${key}.pdf`);
  await renderToFile(<BailV3PDF doc={doc} logoSrc={logo} notice={{ title: NOTICE_TITLE, source: NOTICE_SOURCE, sections: NOTICE_INFORMATION_2023 }} />, file);
  const p = doc.pricing;
  console.log(`${key}: HC ${p.hc} € (cible ${p.hcTarget}, plafond ${p.cap ?? "—"}${p.capped ? ", plafonné" : ""}) · total ${p.total} € · dépôt ${p.deposit} € · frais ${p.fees} €` +
    (p.prorataDays ? ` · prorata ${p.prorataDays}/30 = ${p.prorataTotal} €` : "") + ` → ${file}`);
}
