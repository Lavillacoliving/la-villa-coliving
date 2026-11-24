// /tarifs, tableau « Tous les prix, chambre par chambre » (L'Appart, Lot 4, étape E5) : ordre des colonnes (V2-18, 14/11/2026).
// Sur téléphone, le tableau (640 px au moins) défile dans son cadre : à 375 px, on voit sa première colonne et les deux colonnes
// de prix, d'où l'ordre Gamme · CHF · € · Chambres · Salle d'eau. Ce test le fige en français et en anglais, sur la page rendue
// par react-dom/server (comme un premier rendu) : l'en-tête, puis chaque ligne (la gamme en <th scope="row">, le loyer en CHF,
// le loyer en euros, puis les chambres et la salle d'eau, sans prix).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Texte visible d'un fragment HTML (balises → espace, entités décodées, insécables gardées, espaces repliés). */
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/[ \t\r\n]+/g, ' ').trim();

// La page, regroupée en un module CommonJS dans un dossier temporaire (React et ses dépendances compris).
const dir = mkdtempSync(path.join(tmpdir(), 'lvc-tarifs-'));
const entry = `
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RatesPageV4 } from "@/pages/RatesPageV4";
export function render(lang) {
  const html = renderToStaticMarkup(<MemoryRouter initialEntries={[lang === "en" ? "/en/tarifs" : "/tarifs"]}><LanguageProvider><RatesPageV4 /></LanguageProvider></MemoryRouter>);
  Helmet.renderStatic();
  return html;
}
`;
const out = path.join(dir, 'tarifs.cjs');
await build({
  stdin: { contents: entry, resolveDir: ROOT, loader: 'tsx' },
  bundle: true, outfile: out, format: 'cjs', platform: 'node', target: 'node20', jsx: 'automatic',
  alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent', loader: { '.css': 'empty', '.svg': 'dataurl', '.png': 'dataurl', '.jpg': 'dataurl', '.webp': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env': '{"DEV":false,"PROD":true,"MODE":"production"}' },
});
const P = createRequire(import.meta.url)(out);
const HTML = { fr: P.render('fr'), en: P.render('en') };
rmSync(dir, { recursive: true, force: true });

/** Les lignes du tableau de l'échelle des prix : pour chaque cellule, sa balise, ses attributs et son texte. */
function scaleRows(html) {
  const i = html.indexOf('aria-labelledby="echelle-prix-title"');
  assert.ok(i !== -1, 'section « Tous les prix, chambre par chambre » absente');
  const table = html.slice(html.indexOf('<table', i), html.indexOf('</table>', i));
  return [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)]
    .map((r) => [...r[1].matchAll(/<(t[hd])\b([^>]*)>([\s\S]*?)<\/t[hd]>/g)].map((c) => ({ tag: c[1], attrs: c[2], text: text(c[3]) })));
}

// (24/11/2026, brief « budget réel », bloc 5 de /tarifs, annexes A et B) Nouvel en-tête du tableau « Les prix, chambre par chambre ».
const HEADER = {
  fr: ['Chambre', 'Prix par mois, tout compris', 'Loyer du bail', 'Nombre de chambres', "Salle d'eau"],
  en: ['Room', 'Price per month, all-inclusive', 'Rent on the lease', 'Number of rooms', 'Bathroom'],
};
const CHF = { fr: /^\d{1,3}(?:[   ]\d{3})* CHF$/, en: /^CHF \d{1,3}(?:,\d{3})*$/ };
const EUR = { fr: /^\d{1,3}(?:[   ]\d{3})* €$/, en: /^€\d{1,3}(?:,\d{3})*$/ };

test('/tarifs, « Tous les prix, chambre par chambre » : la gamme, puis les deux prix, puis les chambres et la salle d\'eau (V2-18)', () => {
  for (const lang of ['fr', 'en']) {
    const [head, ...rows] = scaleRows(HTML[lang]);
    assert.deepEqual(head.map((c) => c.text), HEADER[lang], `${lang} : en-tête`);
    assert.ok(head.every((c) => c.tag === 'th'), `${lang} : en-tête en <th>`);
    assert.ok(rows.length >= 2, `${lang} : ${rows.length} ligne(s)`);
    for (const r of rows) {
      const cells = r.map((c) => c.text);
      const where = `${lang} : « ${cells.join(' | ')} »`;
      assert.equal(r.length, HEADER[lang].length, where);
      assert.ok(r[0].tag === 'th' && /\bscope="row"/.test(r[0].attrs), `${where} : la gamme en <th scope="row">`);
      assert.match(cells[1], CHF[lang], `${where} : 2e colonne = loyer en CHF`);
      assert.match(cells[2], EUR[lang], `${where} : 3e colonne = loyer en euros`);
      for (const k of [0, 3, 4]) assert.doesNotMatch(cells[k], /CHF|€/, `${where} : colonne ${k + 1} sans prix`);
    }
  }
});
