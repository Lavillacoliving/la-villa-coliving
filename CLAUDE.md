# CLAUDE.md — la-villa-coliving (site + dashboard + portail)

## Source de savoir obligatoire

La documentation canonique du système (infrastructure, schéma Supabase, conventions) vit dans le repo privé **`Lavillacoliving/lavilla-docs`**, normalement cloné localement dans `../lavilla-docs/`.

**AVANT toute intervention** (code, schéma, infra), lire :
- `../lavilla-docs/Infrastructure_LaVilla.md` — cartographie complète (Vercel, Supabase, n8n, VPS, DNS, backups)
- `../lavilla-docs/Schema_Supabase_LaVilla.md` — schéma de la base ; **checklist §12 obligatoire avant toute modification de schéma**
- `../lavilla-docs/CLAUDE.md` — règles d'usage transverses

Si `../lavilla-docs/` est absent : `git clone git@github.com:Lavillacoliving/lavilla-docs.git ../lavilla-docs`

## Rappels critiques (détail dans lavilla-docs)

- `src/lib/entities.ts` = source unique des IDs/constantes ; slugs de propriétés SANS tirets (`lavilla`, `leloft`, `lelodge`, `montblanc`)
- `logAudit()` obligatoire sur toute action CRUD critique ; design gold `#b8860b` ; bilingue FR/EN
- CI stricte : valider avec `tsc -b` (pas `--noEmit`) avant commit ; build complet local = `npm run build:local`
- `git pull --rebase` avant tout push (le bot prerender committe en parallèle)
- **Push sur `main` = déploiement production immédiat** (Vercel). Jamais sans GO explicite de Jérôme.
- La production se déploie au commit du bot `auto-prerender:` (ou au commit vide qu'il pousse) : Vercel ignore le build du commit poussé (« Ignored Build Step », constat du 13/10/2026) — compter ~20 min entre la fusion et la mise en ligne, gardes CI comprises
- `npm run build` garde les JS/CSS de la version précédente (`scripts/keep-previous-assets.mjs`, manifeste `/lvc-assets.json`, D6 du 13/10/2026) : une seule version, jamais bloquant ; retour arrière = retirer l'étape du script `build`
- Images : tout `public/` est recopié dans chaque déploiement Vercel (quota « Deployment Storage » de 10 Go du plan Hobby) → seulement du WebP ≤ 1920 px de large dans `public/images` ; les originaux JPG/PNG/HEIC/MOV restent hors du dépôt (`.gitignore`, `scripts/convert-images.cjs`) ; une ancienne URL `.jpg` reçoit son jumeau `.webp` (rewrite de secours dans `scripts/prerender.mjs`)
- Sessions concurrentes : travailler sur des branches `feat/*`, ne jamais éditer un checkout sans vérifier `git status`

## Garde-fous acquisition & autorité (Brief n°2 — 21/08/2026)

Chargés à chaque session : ils complètent `../lavilla-docs/CLAUDE.md` (ne pas dupliquer, y renvoyer). Source des faits : `FACT_BLOCK_ET_MESURE_IA_2026-08-04.md` §1, `Arbitrage_Final_Plan_Fusionne_2026-08-03.md`, `lavilla-docs/Plan_Autorite_Linkbuilding.md`.

### 1. Règles d'or — résumé (le détail est dans `docs/claude/` et fait foi)
Ce fichier est chargé à chaque session : il ne garde que les règles qui valent pour **tout** changement. Le détail (formulations exactes, exceptions, décisions de Jérôme) est dans `docs/claude/`, déplacé tel quel le 24/11/2026 : le lire **avant** de toucher au sujet concerné (tableau ci-dessous). En cas de doute entre ce résumé et un document de `docs/claude/`, le document fait foi.

- **Les faits vivent dans le code, jamais ici** : chiffres dans `src/data/stats.ts`, phrases canoniques dans `src/data/entityFacts.ts`, faits de L'Appart dans `src/data/appart*.ts`. Toute divergence = bug ; garde CI `npm run check:facts`. **Base et code changent dans le même créneau.**
- **Deux gammes, jamais fondues** : 3 maisons de coliving avec piscine, sauna et salle de sport (La Villa, Le Loft, Le Lodge) et L'Appart, colocation à Annemasse, sans ces équipements. Jamais un prix de L'Appart dans la même phrase ou la même ligne de tableau que « piscine », « sauna » ou « salle de sport ».
- **Adresses** : aucune rue de maison ni de L'Appart nulle part dans le dépôt (code, commentaire, test, SQL, sauvegarde), ni coordonnées exactes. **Avant tout push**, sur un arbre propre : `npx vite build && LVC_PRIVATE_LOCATIONS_FILE=<fichier hors dépôt> npm run check:locations -- --require --require-dist`.
- **Jamais un concurrent nommé** (texte, alt, meta, JSON-LD, annuaires, presse — garde `check:competitors`) ; jamais « moins cher que Genève ».
- **Prix** : jamais dans un `<title>` ; € et CHF jamais dans la même phrase hors chaînes de la source unique ; disponibilité = `v_public_rooms` seulement, jamais un chiffre en dur ; le « dès » et les paliers suivent des règles précises : lire `docs/claude/faits-et-prix.md` avant d'écrire un prix.
- **Note Google** : toujours « sur Google » avec le lien « Voir les avis » ; aucun `aggregateRating` ni `"@type": "Review"` en JSON-LD.
- **Trajets** : valeurs de `TRANSIT` seulement, destination toujours nommée, jamais de promesse en voiture ni de durée vers l'aéroport.

| Avant de toucher à… | Lire d'abord |
|---|---|
| un prix, la caution, le garant, le bail, un délai, une preuve sociale (résidents, note Google, occupation), la FAQ « chère ? » | `docs/claude/faits-et-prix.md` |
| L'Appart (textes, prix, ouverture, disponibilité, listes, gardes des deux gammes) | `docs/claude/lappart.md` |
| un trajet, une minute, un quartier, la frontière, une carte | `docs/claude/trajets-emplacement.md` |
| une adresse, un lieu, un écran qui imprime une adresse (bail, quittance, courrier) | `docs/claude/adresses.md` |
| le bloc « Où chercher » (créneaux L1), le groupe Facebook | `docs/claude/creneaux-facebook.md` |
| le JSON-LD, `sameAs`, l'entité, l'article « C'est réel ? » | `docs/claude/jsonld-entite.md` |
| les exceptions € / CHF, les jetons de prix des articles, la liste complète des interdits | `docs/claude/interdits.md` |
| une page maison ou l'accueil sur mobile | `docs/claude/pages-maisons-mobile.md` |

### 2. Doctrine 3 fronts + gel du pilier
- « coliving geneve / geneva » = **DÉFENSE** (must-win, ligne rouge : pos > 3 en FR+CH deux semaines de suite) · « colocation / chambre Annemasse » = **CONQUÊTE** (front principal FR, 880 rech./mois) · « colocation geneve » = **CHALLENGE au critère** (arbitrage 25/08, kill 05/10), jamais au détriment des deux autres. Genève reste l'ancre sémantique partout (titles « près de Genève », GBP, llms.txt, presse).
- **Pilier `/colocation-geneve` : gel LEVÉ le 04/09/2026** (décision Jérôme, Lot 5 du plan SEO funnel) : la page money FR revit à `/colocation-geneve` (intention « je cherche une chambre » : cartes chambres + FAQ), l'article `trouver-colocation-geneve-frontalier` garde l'intention « comment chercher » et lie la page en intro (ancre exacte « colocation à Genève côté France »). Pas de canonical entre les deux. `colocGeneveHref()` (`src/lib/siteLinks.ts`) reste l'interrupteur unique des ancres internes FR/EN.

### 3. Ancres (règle du Plan Autorité) — 40 % marque · 25 % URL nue · 25 % génériques · 10 % exact-match
Off-site d'abord ; on-site, la règle sert d'alerte sur les ancres contextuelles (`npm run link:graph`). Jamais 100 % « colocation [ville] » vers une même page.

### 4. Interdits — résumé (liste complète et exceptions : `docs/claude/interdits.md`)
Prix dans un `<title>` · chiffre de disponibilité en dur · € et CHF dans la même phrase hors chaînes de la source unique · achat de liens, PBN, faux avis, recours à des plateformes qui facturent le locataire · génération de pages en masse · automatisation de l'envoi d'outreach, de la relation presse ou du WhatsApp (on prépare, l'humain envoie) · modification de la logique d'envoi du formulaire sans plan validé · formulations d'emplacement et de preuves sociales refusées par `check:facts` · pour L'Appart : un prix à côté des équipements des maisons, son étage, un jour d'ouverture, une rue, une distance en mètres.

### 5. Registre
FR commercial = **tutoiement** (site, blog, FAQ, metas) ; vouvoiement seulement sur mentions légales / politique de confidentialité ; Observatoire = registre neutre/impersonnel ; EN = « you » ; titres FR sans Title Case.
**Ton du blog (décision Jérôme du 16/10/2026, tout article : nouveau, mise à jour, traduction EN)** = celui de `content/decision-pages/non-la-villa-coliving-nest-pas-une-arnaque.fr.md` / `.en.md` : voix « nous » de Jérôme et Fanny (deux humains, pas une marque) ; franc et chaleureux, un peu d'humour, zéro posture — on assume ce qui coince (« on va être francs : c'est frustrant ») ; ouverture sur une scène réelle (message de candidat cité mot pour mot, anonymisé) ; pas de superlatifs ni de ton brochure, phrases courtes qui se disent à voix haute ; le lecteur vérifie par lui-même plutôt que de nous croire sur parole (preuves cliquables) ; l'article reste utile même à qui ne viendra jamais chez nous ; chiffres prudents (jamais « la plupart » sans donnée) ; EN : même voix, idiomes naturels, jamais de calque.

### 6. Travail & données
Brief n°2 = branche `feature/acquisition-autorite` ; commit par lot ; `tsc -b` puis `npm run build:local` **puis un 2ᵉ `npm run build`** (sinon `dist/` contient les prérendus de l'exécution précédente) ; `npm run lint:seo` ; gardes du prérendu : `npm run check:facts -- --strict`, `npm run check:slots` (créneaux L1 ; `--m1-only` avant la séance SQL), `npm run check:competitors`, `npm run check:redirects`, `node scripts/hydration-check.mjs`, `npm run check:locations -- --require --require-dist` (rues des maisons, §1 — **avant tout push**, sur un arbre propre, après `npx vite build`, avec `LVC_PRIVATE_LOCATIONS_FILE` ; il ne lit pas l'historique : une rue committée puis retirée part quand même avec le push) ; `tools/out/` est gitignoré ; Bing Webmaster Tools : site vérifié depuis le 04/08/2026, sitemap soumis, IndexNow en CI (`scripts/indexnow-ping.mjs`) — aucune balise ni `BingSiteAuth.xml` à ajouter, rapport « AI Performance » relevé chaque mois (Jérôme 09/10/2026) ; **jamais** de données GSC/GA4 brutes, d'URL de webhook n8n ni de clé dans le repo (la sonde `UjjxjZ4IiKU5o4P9` se lit via la variable d'env locale `GSC_SONDE_URL`).
Outils opérateur (mode d'emploi débutant : `tools/README.md`) : `npm run link:graph` (carte du maillage interne) · `npm run mining:gsc` (striking distance / CTR) · `npm run test:tools`.
**Mesure propre — règle permanente (Lot C, 01/10/2026)** : GA4 et Clarity ne se chargent plus sous automatisation (`navigator.webdriver`), pour un robot déclaré, hors du nom d'hôte de production ni dans l'espace résident/équipe (garde `#lvc-analytics` d'`index.html`, tests `tools/test/analytics-guard.test.mjs`). Tout script qui charge des pages bloque **en plus** les domaines analytics (`scripts/lib/block-analytics.mjs`) ; tout navigateur réel de vérification contre la production entre par `?internal=1` (trafic interne) ou `?ga_debug=1` (DebugView, aussi interne). Jamais de soumission de test sans `?test=1`.

### 7. Pages maisons et accueil sur mobile (sous-lot A du lot 2 « retenue premium » — cadrage D1 à D8 validé le 16/10/2026, décisions Jérôme des 10 et 11/11/2026) → `docs/claude/pages-maisons-mobile.md`
