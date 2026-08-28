# mining-gsc — mode d'emploi (débutant terminal)

Outil du Brief n°2 (Chantier 1). Il lit les exports Google Search Console et produit un rapport
Markdown « striking distance » : les requêtes qui sont proches du top 3 et qui cliquent moins
que la moyenne du compte, les pages sous la courbe, les impressions sans clic et l'état de la
watchlist « money » (coliving geneve, colocation annemasse…).

Zéro installation : Node (déjà présent pour le site) suffit. Il ne modifie rien au site et
n'envoie rien nulle part : lecture des exports, écriture dans `tools/out/` (dossier gitignoré —
les données GSC ne doivent **jamais** être commitées).

## Les 3 commandes

Toujours depuis la racine du repo (`la-villa-coliving/`) :

```bash
# 1. Lancer le mining sur un ou plusieurs dossiers d'export Search Console
node tools/mining-gsc.mjs --csv "../GSC_exports/DATA/https___www" --csv "../GSC_exports/DATA/https___www-4" --csv "../GSC_exports/DATA/https___www-5"

# 2. Ouvrir le rapport (le nom contient le mois des données, ex. juin 2026)
open tools/out/mining_gsc_2026-06.md

# 3. Vérifier que l'outil est sain (tests automatiques, données synthétiques)
npm run test:tools
```

Raccourci npm équivalent à la commande 1 : `npm run mining:gsc -- --csv "../GSC_exports/DATA/https___www"`
(le `--` est obligatoire pour passer les options). `node tools/mining-gsc.mjs --help` liste toutes les options.

## Où déposer les exports

### Exports de l'interface Search Console (mode `--csv`)

1. Dans Search Console → Performances → bouton **Exporter** → **Télécharger au format CSV**.
   Tu obtiens un zip ; dézippe-le : il contient `Pages.csv`, `Queries.csv` (ou `Requêtes.csv`),
   `Filters.csv`, `Chart.csv`, `Countries.csv`, `Devices.csv`…
2. Dépose le **dossier dézippé** quelque part hors du repo, par exemple
   `../GSC_exports/DATA/<nom parlant>/` (un dossier par export, ne renomme pas les fichiers).
3. Un dossier = un **segment**, déduit du filtre Pays de l'export : `France` → France,
   `Switzerland`/`Suisse` → Suisse, sans filtre pays → global. Pour un rapport complet,
   exporte 3 fois la même période : sans filtre, filtre France, filtre Suisse — puis passe
   les 3 dossiers avec 3 `--csv`.
4. Un export avec un filtre **Requête** (ex. « colocation geneve ») est accepté : il ne sert
   qu'à la section watchlist (pages positionnées sur cette requête), jamais à la courbe.
5. Un export **comparé** (deux périodes, en-tête à 9 colonnes) est détecté : la période la plus
   récente est retenue (`--period previous` pour l'autre) et le rapport le dit.

Interface en anglais ou en français, les deux sont reconnus (BOM, guillemets, retours ligne dans
les requêtes : OK).

### Réponses de la sonde n8n (mode `--json`)

Fichier(s) JSON contenant la réponse de l'API Search Analytics (`{rows:[…]}`, tableau n8n
`[{json:{rows:[…]}}]`, ou liste de lignes `{keys,clicks,impressions,ctr,position}`). Plusieurs
fichiers = pagination, ils sont concaténés :

```bash
node tools/mining-gsc.mjs --json sonde_p1.json --json sonde_p2.json
```

Les dimensions (`keys`) sont devinées par leur valeur (URL → page, code à 3 lettres → pays,
sinon requête). Si une requête ressemble à un code pays (« spa », « bus »…), force l'ordre avec
`--dims page,query,country`. Pays groupés : `fra` → France, `che` → Suisse, le reste → « Autres
pays », plus un segment France + Suisse pondéré.

## Comment lire la sortie

Le rapport `tools/out/mining_gsc_AAAA-MM.md` (+ un `.json` avec les mêmes chiffres) a 8 sections :

| Section | Ce qu'elle dit | Quoi en faire |
|---|---|---|
| 0 Provenance | fichiers lus, fenêtre de dates, segments, part de requêtes anonymisées, avertissements | vérifier que la fenêtre et les segments sont ceux attendus |
| 1 Courbe CTR du compte | CTR moyen du site par position (1 → 21+), par segment, avec l'origine de chaque valeur (observé / interpolé / référence) | c'est l'étalon : une requête « attendue à 5 % » est comparée à ça, pas à une courbe générique |
| 2 Striking distance | requêtes hors marque en position 4-15 (≥ 20 impressions), classées par **score** = clics perdus (sous la courbe) + potentiel si +3 places ; `money` = requête de la watchlist | candidats title/meta (écart négatif) ou contenu/maillage (potentiel +3) — à arbitrer avec le bulletin |
| 3 Pages sous la courbe | pages ≥ 50 impressions dont le CTR est < 60 % de l'attendu | revoir title/meta/extraits ; en mode CSV la méthode est « indicatif » (position moyenne de la page) |
| 4 Impressions sans clic | requêtes à 0 clic malgré ≥ 30 impressions : « snippet/title » si position ≤ 10, « position » sinon ; « bruit probable » = requête parasite | idem : snippet si déjà visible, sinon d'abord remonter |
| 5 Watchlist money | les 16 requêtes stratégiques : position pondérée, impressions, CTR vs attendu, statut (acquis top 3 / striking / hors fenêtre / absente) | suivi des 3 fronts ; `colocation geneve` y figure même hors striking |
| 6 Paramètres | seuils utilisés | pour reproduire ou ajuster (`--min-impr`, `--pos-min`, `--pos-max`, `--brand`…) |
| 7 Limites | ce que les chiffres ne disent pas | à relire avant de présenter un chiffre comme une promesse |

Conventions : nombres au format français (« 1 234 », « 12,3 % »), **écart** = CTR − CTR attendu
(négatif = sous la courbe), positions toujours pondérées par les impressions, requêtes de marque
(`la villa`, `lavilla`, `villa coliving`) exclues des sections 1-2-4 mais présentes en watchlist.

Le fichier du même mois est **écrasé** à chaque lancement (`--month 2026-07` pour forcer un mois,
`--out autre/dossier` pour écrire ailleurs).

## Erreurs fréquentes

| Message | Cause | Solution |
|---|---|---|
| `Indique au moins une entrée : --csv DOSSIER … ou --json FICHIER` | aucune entrée | ajouter `--csv "chemin/du/dossier"` |
| `Dossier introuvable ou illisible : …` | chemin faux ou espace non protégé | mettre le chemin entre guillemets, vérifier avec `ls "…"` |
| `Aucun fichier .csv dans …` | tu as passé le zip ou le dossier parent | dézipper, passer le dossier qui contient `Pages.csv` |
| `Aucun Pages.csv / Queries.csv reconnu dans …` | ce n'est pas un export « Performances » (ex. export Indexation / Core Web Vitals) | refaire l'export depuis Performances → Exporter |
| `Choisis un seul mode : --csv … OU --json …` | les deux options à la fois | deux lancements séparés |
| `--month attend le format AAAA-MM` | ex. `--month juin` | `--month 2026-06` |
| `Regex de marque invalide (--brand)` | parenthèse non fermée, etc. | ex. `--brand "la ?villa|lavilla"` |
| `Fenêtre de dates inconnue …` (avertissement, pas une erreur) | filtre Date relatif (« Last 3 months ») sans `Chart.csv` | ajouter `--month AAAA-MM` ou remettre le `Chart.csv` de l'export |
| Courbe « réutilisée (segment Global) » pour France/Suisse | segment < 2 000 impressions ou trop peu de buckets observés | normal : la courbe globale sert d'étalon ; le rapport l'indique |
| `npm run test:tools` échoue | une modification a cassé un parseur | lire le test rouge ; les fixtures sont synthétiques dans `tools/test/fixtures/` |

## Fichiers

- `tools/mining-gsc.mjs` — la commande (CLI, rapport Markdown + JSON)
- `tools/lib/gsc-parse.mjs` — lecture des CSV (UI) et JSON (sonde), normalisation
- `tools/lib/ctr-curve.mjs` — courbe CTR du compte, striking distance, pages sous la courbe, sans clic, watchlist
- `tools/lib/gsc-config.mjs` — watchlist money, regex de marque, seuils par défaut
- `tools/lib/md.mjs` — tableaux Markdown et formats français
- `tools/test/gsc-parse.test.mjs`, `tools/test/ctr-curve.test.mjs`, `tools/test/fixtures/` — tests (`node --test`)

Règles maison : aucune donnée GSC brute dans le repo (`tools/out/` est gitignoré), aucune
dépendance npm, la watchlist se modifie dans `tools/lib/gsc-config.mjs` uniquement.
