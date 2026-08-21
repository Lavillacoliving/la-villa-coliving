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

## 3. Tests — `npm run test:tools`

Vérifie les extracteurs sur des données synthétiques (`tools/test/`). À lancer après toute modification de `tools/lib/*`.

## Règles
- Jamais de données GSC/GA4 brutes, d'URL de webhook ni de clé dans le repo (`tools/out/` est gitignoré).
- Les sorties sont des **diagnostics** : toute modification de page ou de contenu blog reste un lot à part, validé, mesuré au bulletin.
- Pilier `/colocation-geneve` gelé du 25/08 au 05/10 (page seule) : les liens **vers** lui sont autorisés.
