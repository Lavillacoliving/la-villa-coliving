# tools/ — outils opérateur SEO (Brief n°2, 21/08/2026)

Scripts Node sans dépendance, lisibles et rejouables par un débutant terminal. Ils **ne modifient rien** sur le site : ils lisent le repo (pages prérendues, sitemap, `vercel.json`) ou des exports, et écrivent dans `tools/out/` (ignoré par git).

> Prérequis une seule fois : être dans le dossier du repo (`cd "…/la-villa-coliving"`) et avoir fait `npm install`.
> Avant toute mesure : `git pull --rebase` (sinon les pages prérendues peuvent être périmées — le script le signale).

## 1. Carte du maillage interne — `npm run link:graph`

Ce que ça fait : lit les 117+ pages prérendues (`public/prerendered/`) — c'est exactement ce que Google voit — et reconstruit **qui lie qui, avec quelle ancre**, en distinguant le chrome (nav, footer), les cartes automatiques (maisons, articles liés) et les liens **contextuels** (texte des pages, liens markdown du blog, CTA).

```bash
git pull --rebase
npm run link:graph
open tools/out/link_graph.md        # ou l'ouvrir dans l'éditeur
```

Options utiles :
```bash
node tools/link-graph.mjs --route /annemasse-colocation      # détail d'une page (entrants, ancres, classes)
node tools/link-graph.mjs --lang en                           # pages anglaises seulement
node tools/link-graph.mjs --snapshot docs/link_graph_AAAA-MM-JJ.md   # copie datée à committer
```

Le rapport contient : chiffres globaux · entrants par type pour chaque page money · pages money **sous-alimentées** · orphelines (3 niveaux) · **distribution des ancres** par page money vs la règle 40 % marque / 25 % URL nue / 25 % générique / 10 % exact (alerte si sur-optimisation) · **opportunités blog → pages money** (mentions textuelles sans lien) · fuites cross-langue · liens vers redirections · top pages donneuses.

Pour régénérer des prérendus frais en local : `npm run build:local && npm run build` (le 2ᵉ `build` est indispensable : il injecte les prérendus de la dernière exécution).

Paramètres à ajuster dans `tools/lib/config.mjs` : liste des pages money (`MONEY_ROUTES`, à tenir alignée avec `STATIC_PAGE_CONFIG` de `scripts/prerender.mjs`), mots-clés exact par page, seuils d'alerte, motifs de mentions.

## 2. Mining Search Console (striking distance) — `npm run mining:gsc`

Voir `tools/README-mining-gsc.md` (même dossier) : formats d'entrée (export CSV de Search Console ou JSON de la sonde n8n), options, lecture du rapport `tools/out/mining_gsc_AAAA-MM.md`.

Mode **sonde** (données fraîches, page × requête × pays) : la sonde n8n « Cowork — Sonde Google » doit être active (à désactiver après usage : webhook sans authentification). Son URL Production se met dans le terminal, jamais dans un fichier du repo :
```bash
export GSC_SONDE_URL="https://…/webhook/…"
node tools/gsc-sonde-pull.mjs                       # 3 mois glissants → ../GSC_exports/sonde/*.json (hors repo)
node tools/mining-gsc.mjs --json ../GSC_exports/sonde/gsc_page-query-country_<début>_<fin>_p1.json
```

## 3. Tests — `npm run test:tools`

Vérifie les extracteurs sur des données synthétiques (`tools/test/`). À lancer après toute modification de `tools/lib/*`.

## Règles
- Jamais de données GSC/GA4 brutes, d'URL de webhook ni de clé dans le repo (`tools/out/` est gitignoré).
- Les sorties sont des **diagnostics** : toute modification de page ou de contenu blog reste un lot à part, validé, mesuré au bulletin.
- Pilier `/colocation-geneve` gelé du 25/08 au 05/10 (page seule) : les liens **vers** lui sont autorisés.

## Gardes de contenu (Lot C0, 09/2026)

Trois contrôles supplémentaires, exécutés en CI après le prérendu (`.github/workflows/prerender.yml`) et à la main :

- `npm run check:redirects` — `vercel.json` × `public/sitemap.xml` × `public/prerendered/*.html` : aucune chaîne de
  redirection, aucune URL du sitemap redirigée, paires de consolidation attendues (`scripts/redirects.expected.json`),
  et (depuis l'audit d'indexation du 07/10/2026) aucune URL interne du HTML prérendu ni de `llms.txt` — liens,
  canonical, hreflang, og:url, JSON-LD `item`/`url`/`@id`/`mainEntityOfPage`/`sameAs`/`target` — qui redirige :
  source de `vercel.json`, slash final (« /en/ »), apex sans www, http. Un lien écrit dans le markdown d'un article
  (en base) n'est qu'un avertissement, à repointer depuis le dashboard ou en SQL ; tout le reste bloque le bot. En
  CI, échecs et avertissements sont aussi publiés en annotations (lisibles sans compte GitHub). Le HTML lu est celui
  du DERNIER prérendu (`public/prerendered/`) : après une modification de code, lance d'abord `npm run build:local`,
  sinon la garde juge l'ancien HTML. `--no-html` saute ce contrôle, `--dist` y ajoute `dist/` (hors CI uniquement).
  Après un déploiement :
  `node scripts/check-redirects.mjs --expect scripts/redirects.expected.json --net` (308 puis 200 en un saut ; l'apex
  en 307 n'y est qu'un avertissement : c'est un réglage Vercel > Domains, pas `vercel.json`).
  Pour ajouter une redirection sans créer de chaîne : `node scripts/redirects.mjs --add /blog/ancien /blog/nouveau`
  (c'est aussi la commande que le dashboard affiche, à transmettre à Claude, quand on renomme le slug d'un article
  publié ; le dashboard refuse de renommer un slug cité par le code : fiche entité, maillage, page de décision).
- `npm run check:competitors` — aucun nom de concurrent dans le HTML prérendu ni `llms.txt`. La liste n'est jamais
  dans le repo : copier `scripts/competitors.example.json` en `scripts/competitors.local.json` (gitignoré) ; en CI,
  secret GitHub `COMPETITOR_NAMES` (noms séparés par des virgules). Sans liste : avertissement, pas de blocage.
- `npm run article:sql -- <slug> --mode insert|update` — valide un brouillon `content/decision-pages/<slug>.*` et
  écrit le SQL de publication (voir `content/decision-pages/README.md`).
- `npm run check:facts -- --strict` — fiche entité × `v_public_rooms` × HTML prérendu × `llms.txt`, plus (Lot L2
  « Emplacement et transport », 09/10/2026) les règles d'emplacement : formulations D6/D7 interdites sur toutes les
  pages sauf légales (« mitoyenne », « TPN », numéro de ligne de bus, « tram à 1 min », « 500 m, 5 min à pied »,
  « CHUV », « terminus du Léman Express »), « 15 min » dans une phrase qui nomme Genève (même en voiture) et, sur
  les pages en code seulement (hors blog), toute promesse en voiture, durée vers l'aéroport ou « A40 » — ces deux
  dernières règles bloquent en `--strict` (la CI), avertissent sinon. `node scripts/house-pages-check.mjs` vérifie en
  plus, par maison et par langue, la phrase de quartier (une fois), la ligne de trajet `ENTITY_HOUSES[].commute` dans
  les 1 500 premiers caractères après le H1, `data-house-location-version`, le lien « Calculer mon trajet » (Google
  Maps depuis l'adresse de la maison) et `ROOM_SURFACE_BY_HOUSE` = min/max de `v_public_rooms.surface_m2`. Ces deux
  gardes lisent `public/prerendered/` : après une modification de code, `npm run build:local` d'abord. Tests :
  `tools/test/location-rules.test.mjs`, `house-location.test.mjs`, `house-pages-check.test.mjs`.
