/**
 * Empreinte du CONTENU d'une page prérendue (lot indexation du 08/10/2026, audit GSC du 07/10).
 *
 * Sert à dater honnêtement le <lastmod> des pages statiques du sitemap : scripts/prerender.mjs compare
 * l'empreinte du HTML qu'il vient de rendre à celle du fichier déjà présent dans public/prerendered/
 * et ne date la page du run que si l'empreinte a changé. Le prérendu tourne deux fois par jour (cron
 * 05:00 et 13:00 UTC) : avant ce correctif, les ~44 pages statiques FR+EN annonçaient « modifiée
 * aujourd'hui » chaque jour, et Google finit par ignorer un lastmod qui ment.
 *
 * PÉRIMÈTRE = ce qui est réellement SERVI. En production, scripts/inject-prerendered.mjs ne garde du
 * fichier prérendu que le contenu de <div id="root"> et les balises SEO du <head> (title, meta
 * name/property, canonical, hreflang, JSON-LD dédoublonnés par @type), réinjectés dans l'index.html
 * du build courant. L'empreinte porte sur ce même sous-ensemble, extrait par les mêmes fonctions
 * (scripts/lib/prerendered-extract.mjs) : une modification d'index.html (script analytics, métas
 * techniques, liens vers les chunks) ne date aucune page. Constat de la relecture du 08/10 : le merge
 * de chore/analytics-hygiene (e970dd4 → 6bdf569, index.html seul) aurait daté les 44 pages.
 *
 * Dans ce périmètre, l'empreinte neutralise UNIQUEMENT ce qui varie d'un run à l'autre sans que la
 * page change :
 *   1. les hachages de noms d'assets Vite (`/assets/index-Ddp035oS.js` → `/assets/index.js`), au cas
 *      où une référence d'asset figurerait dans le contenu servi ;
 *   2. les identifiants React `useId` (React 19.2 : `_r_4s_` ; formats antérieurs `«r4s»`, `:r4s:`)
 *      et ceux que Radix en dérive (`radix-_r_4s_`), portés par id / aria-controls / aria-labelledby…
 *      Ils dépendent de l'ordre de montage des composants pendant le rendu Puppeteer : la FAQ passe de
 *      `radix-_r_4s_` à `radix-_r_p_` d'un run à l'autre sans changement de texte (bot 2e3650c, 06/10).
 *      On remplace chaque identifiant par son RANG D'APPARITION : deux rendus du même contenu donnent
 *      la même suite, et le lien id ↔ aria-controls reste comparé ;
 *   3. l'ORDRE des blocs JSON-LD servis : react-helmet les insère dans l'ordre où les composants
 *      montent, qui varie d'un run à l'autre (/le-coliving : LocalBusiness puis FAQPage, ou l'inverse
 *      — bots 9806155 → 3313dbf). Un bloc JSON-LD n'a pas de sens positionnel : on compare la liste
 *      triée des blocs servis (après le dédoublonnage par @type de l'injection). Un bloc ajouté,
 *      retiré ou modifié change toujours l'empreinte ;
 *   4. les marqueurs techniques du mois de rendu, `__render_month__` (pied de page, toutes les pages)
 *      et `__pipeline_ref_month__` (pipeline des chambres) : ce sont des repères d'hydratation, pas du
 *      contenu, et sans neutralisation les 44 pages seraient datées au premier run de chaque mois. Le
 *      TEXTE qui dépend du mois (« Places limitées pour novembre » sur /tarifs, dates du pipeline)
 *      reste dans l'empreinte ;
 *   5. l'année du copyright du pied de page (« © 2026 ») : changement non significatif au sens de
 *      Google, il daterait toutes les pages au 1ᵉʳ janvier ;
 *   6. les blancs (repliés).
 *
 * Ce qui n'est PAS neutralisé, volontairement : les disponibilités de chambres (statut, date « dès le
 * 15 octobre », nombre de chambres libres, badge) et tout texte visible. Ce sont de vrais changements
 * de contenu de /chambres-disponibles, des pages maisons, de la home… : la page doit alors être datée
 * du run (verdict EN-6 de l'audit). Le clignotement du bloc Offer de /colocation-geneve (InStock ou
 * PreOrder selon le run : deux blocs Offer différents dans le HTML prérendu, l'injection sert le
 * premier) est un vrai écart du contenu servi, laissé visible exprès : il relève d'un lot séparé
 * (ColocationGenevePage.tsx, garde « un seul Offer par page »).
 *
 * Fonctions PURES ; testées dans tools/test/content-fingerprint.test.mjs.
 */

import crypto from 'node:crypto';
import { extractRootContent, extractSeoTags } from './prerendered-extract.mjs';

// Nom d'asset Vite : `<nom>-<hash>.<ext>` sous /assets/. Le hash fait 8 caractères base64url
// (A-Z a-z 0-9 _ -). Le préfixe est pris au plus court : `vendor-react-AbCdEfGh.js` devient
// `vendor.js` des deux côtés, ce qui suffit à une comparaison.
const ASSET_HASH_RE = /(\/assets\/[^"'\s?#)]*?)-[A-Za-z0-9_-]{8,}\.([A-Za-z0-9]+)\b/g;

// Identifiants useId : React ≥ 19.1 « _r_<base32>_ » (éventuellement préfixé, ex. radix-_r_4s_),
// React 19.0 « «r<base32>» », React 18 « :r<base32>: ». Le suffixe base32 est en minuscules.
const USE_ID_RE = /_r_[0-9a-z]+_|«r[0-9a-z]+»|:r[0-9a-z]+:/g;

// Bloc JSON-LD complet (balise ouvrante avec ses attributs, contenu, balise fermante).
const JSON_LD_RE = /<script\b[^>]*\btype="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g;

// Valeur des marqueurs techniques du mois de rendu (src/lib/renderMonth.tsx, src/components/RoomPipeline.tsx).
const MONTH_MARKER_RE = /(<script\b[^>]*\bid="__(?:render_month|pipeline_ref_month)__"[^>]*>)[^<]*(<\/script>)/g;

// Année du copyright : « © 2026 », « ©2026 » ou « © <!-- -->2026 » (séparateur de nœuds texte React).
const COPYRIGHT_YEAR_RE = /©(\s*(?:<!-- -->)?\s*)\d{4}/g;

const byString = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const sortedEntries = (obj) => Object.entries(obj || {}).sort(([a], [b]) => byString(a, b));

/**
 * Sous-ensemble servi d'une page prérendue, sérialisé : contenu de #root puis balises SEO du <head>
 * (comme scripts/inject-prerendered.mjs). Sans #root (entrée inattendue), tout le document, blocs
 * JSON-LD retirés de leur position et ajoutés triés en fin.
 */
function servedSubset(html) {
  const root = extractRootContent(html);
  if (root === null) {
    const jsonLd = [];
    const rest = html.replace(JSON_LD_RE, (block) => {
      jsonLd.push(block.replace(/\s+/g, ' ').trim());
      return '';
    });
    return `${rest}\n${jsonLd.sort(byString).join('\n')}`;
  }
  const seo = extractSeoTags(html);
  return [
    root,
    `<title>${seo.title ?? ''}`,
    ...sortedEntries(seo.metaName).map(([k, v]) => `<meta name="${k}" content="${v}">`),
    `<canonical>${seo.canonical ?? ''}`,
    ...sortedEntries(seo.metaProperty).map(([k, v]) => `<meta property="${k}" content="${v}">`),
    ...(seo.hreflang || []).map(({ lang, href }) => `<hreflang ${lang}>${href}`).sort(byString),
    ...(seo.jsonLd || []).map((j) => `<ld+json>${j.replace(/\s+/g, ' ').trim()}`).sort(byString),
  ].join('\n');
}

/** Contenu servi normalisé : ce qui reste quand on retire le bruit d'un run (voir l'en-tête). */
export function normalizeForFingerprint(html) {
  if (typeof html !== 'string') return '';
  const ranks = new Map();
  return servedSubset(html)
    .replace(MONTH_MARKER_RE, '$1$2')
    .replace(COPYRIGHT_YEAR_RE, '©$1')
    .replace(ASSET_HASH_RE, '$1.$2')
    .replace(USE_ID_RE, (id) => {
      if (!ranks.has(id)) ranks.set(id, ranks.size);
      return `_rid${ranks.get(id)}_`;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

/** Empreinte SHA-1 (hex) du contenu servi normalisé. */
export function contentFingerprint(html) {
  return crypto.createHash('sha1').update(normalizeForFingerprint(html)).digest('hex');
}
