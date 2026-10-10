# `src/data/` — source unique des chiffres du site et routine mensuelle

Toute valeur affichée sur le site (prix, trajets, chambres, note, résidents, occupation) vit dans ce dossier — d'abord dans
`stats.ts` — et nulle part en dur dans une page, un composant ou un script. Les textes canoniques (fiche entité, llms.txt)
sont assemblés par `entityFacts.ts` et vérifiés en CI (`npm run check:facts`). Règles complètes : `CLAUDE.md` §1 et §4 et
`../lavilla-docs/CLAUDE.md`.

## Routine mensuelle (créée au lot L3 « Note Google et preuves », 09/10/2026)

À faire une fois par mois (rappel à Jérôme, hors code) ; chaque point = une constante à relire, puis `npx tsc -b`,
`npm run build:llms`, `npm run build:local` (la garde compare le HTML **prérendu** à la source : sans reprérendu elle échoue
mécaniquement après un bump de version), `npm run check:facts`, et un commit par lot.

| Quoi | Où | Comment |
|---|---|---|
| **Note Google** | `stats.ts` → `GOOGLE_REVIEWS` | Ouvrir la fiche (`GOOGLE_REVIEWS.url`), relever note et nombre d'avis ; mettre à jour `rating` (virgule, FR), `ratingEn` (point), `count`, `checkedOn` (AAAA-MM-JJ). Toujours étiquetée « sur Google » / « on Google », toujours avec le lien « Voir les avis » / « See the reviews » (`GOOGLE_REVIEWS_LINK_LABEL`). **Jamais** d'`aggregateRating` ni de `Review` en JSON-LD. |
| ↳ fiche entité | `entityFacts.ts` → `ENTITY_FACTS_VERSION` | La puce « Avis : … » change avec la note : incrémenter la version (date du jour, suffixe `b`, `c`… si plusieurs changements le même jour — llms.txt n'en garde que la date), sinon la garde refuse le prérendu. |
| ↳ llms.txt | `scripts/build-llms-txt.mjs` | `npm run build:llms` régénère `public/llms.txt` et `public/en/llms.txt` (committés) ; la ligne « Avis : … » suit `STATS_DISPLAY.googleRating`. |
| ↳ 2 articles en base | Supabase `blog_posts` (SQL, jamais à la main dans le dashboard) | Ces articles portent la note **en dur** (FR et EN) et doivent être réécrits à chaque relevé : `coliving-communaute-reels-amis-geneve-annemasse` et `lodge-annemasse-coliving-premium-portes-geneve` (« note moyenne de X/5 » → la phrase de `STATS_DISPLAY.googleRating` ; les deux disaient aussi « plus de 150 résidents » → « plus de 100 résidents » (`STATS.totalResidents`), relevé REST du 10/10/2026). Générateur : `node scripts/build-slots-sql.mjs --edits ./l3-social-proof.edits.mjs --name l3-social-proof --write-diff` ; dry-run, puis exécution SQL ; reprérendu ensuite. |
| **Groupe Facebook** | `stats.ts` → `FACEBOOK_GROUP` | Statistiques admin du groupe → Engagement : `membersApprox` (arrondi à la centaine, écrit via `thousands()`), `postsLast28Days` (relevé, jamais écrit dans une phrase), `postsPerMonth` (« une centaine d'annonces par mois » tant que c'est vrai), `checkedOn`. |
| **Trajets** | `stats.ts` → `TRANSIT` | Remesure à chaque changement d'horaire Léman Express (décembre) et au plus tard tous les 12 mois : temps de train, porte-à-porte par maison (Google Maps, lundi 8 h, marche et attente comprises), `measuredOn` / `measuredOnLabel`. Règle D1 : arrondi au 5 le plus proche, jamais vers le bas par confort. |
| **Résidents** | `stats.ts` → `STATS.totalResidents` + `STATS_SOURCE` | « 100+ résidents depuis 2021 » est soutenu par la vue Supabase `v_social_proof` (`resident_history` ∪ `tenants`, dédoublonnés sur le nom normalisé — migration `scripts/resident-history-2026-10-09.sql`, appliquée le 10/10/2026 ; le bloc INSERT nominatif n'est pas dans le dépôt : `python3 -I scripts/import-resident-history.py --assemble` l'écrit dans `tools/out/`). Vérifier `distinct_residents_since_opening ≥ STATS.totalResidents` (119 au 10/10/2026, première lecture réelle de la vue) ; mettre à jour la date dans `STATS_SOURCE`. Jamais « 150 » ni « 50+ personnes par an ». |
| **Occupation** | `stats.ts` → `OCCUPANCY` | Réservée à `/investisseurs`, toujours avec sa base (`OCCUPANCY_DISPLAY` : « ≈ N % de jours-chambre occupés depuis l'ouverture (oct. 2021 → mois de mesure) » — ouverture publiée = octobre 2021 (décision Jérôme 10/10/2026), même si la vue mesure depuis la première entrée du 17/09/2021). Relire `v_social_proof.by_house` / `occupancy_pct_all` (jours-chambre plafonnés), mettre à jour `pct` (arrondi), `measuredOn`, `measuredOnLabel` — `measuredOn` pilote aussi « N ans d'expérience » (`YEARS_IN_OPERATION` = année de mesure − `foundedYear`, années civiles, jamais `Date` : un relevé de janvier 2027 affichera « 6 ans » bien que l'ouverture date de septembre 2021). L'ancien « taux d'occupation sur 5 ans » n'existe plus ; l'Observatoire garde sa propre fourchette (méthodologie datée) jusqu'au bulletin suivant. Valeur initiale (98) = nouvelle base à faire valider par Jérôme. |

## Garde-fous à ne pas contourner

- Prix : `CONTRACT_EUR` (maître, €) et `TAUX_BCE` figé → le CHF est dérivé (`chfAffiche`), arrondi à la dizaine inférieure.
- Chambres : `ROOMS_BY_HOUSE` = `v_public_rooms` (garde CI) ; disponibilité **jamais** en dur (`src/lib/availability.ts`).
- Chaînes plates, un nœud texte par phrase, jamais `toLocaleString` ni `Date` dans les textes rendus (anti-#418).
- FR = tutoiement (sauf mentions légales et `/investisseurs`, registre B2B), EN = « you » ; parité FR/EN ; jamais un concurrent nommé.

## Entité et annuaires (Lot L6, 10/10/2026)

- **NAP** (nom, adresses, téléphone, URL) = `LAVILLA_NAP` (`src/lib/structuredData.ts`), dans la forme exacte de la fiche Google (une seule fiche pour les trois maisons) : « La Villa Coliving » · +33 6 64 31 51 34 · https://www.lavillacoliving.com · siège 34 rue du Foron, 74100 Ville-la-Grand, France · Le Loft 1 rue des Marronniers, 74100 Ambilly · Le Lodge 8 rue de Romagny, 74100 Annemasse. À reporter **tel quel** sur bookmycoliving, coliving.com et La Carte des Colocs (action Jérôme) ; toute divergence (abréviation, numéro différent) affaiblit l'entité.
- **sameAs** : `LAVILLA_SAME_AS` (Instagram, fiche Google par `cid` = `GOOGLE_REVIEWS.url`, La Carte des Colocs `.com`, profil Roomlala) au niveau de l'organisation ; `HOUSES[].sameAs` par maison (bookmycoliving ×3, coliving.com pour La Villa, annonces Roomlala). Jamais de page Facebook (D10) ; pas de LinkedIn (décision Jérôme 10/10/2026 : aucune page entreprise).
- **alternateName** (D11) : `LAVILLA_ALTERNATE_NAMES` — sur chaque fiche d'organisation, vérifié par `check:facts`.
- **Bing** (D12) : pas de balise ni de `BingSiteAuth.xml` — importer les sites vérifiés depuis Google Search Console dans Bing Webmaster Tools (compte Google de Jérôme) ; repli seulement si l'import échoue.
- Validation après déploiement : validator.schema.org et Rich Results Test sur `/`, `/lavilla`, `/leloft`, `/lelodge`, `/nos-maisons`, `/tarifs`, `/chambres-disponibles`, un article — un seul nœud par @id, aucune propriété inventée.
