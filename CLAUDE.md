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
- 2 builds Vercel back-to-back après chaque push : le 2ᵉ (commit `auto-prerender:`) fait foi pour le SEO
- Sessions concurrentes : travailler sur des branches `feat/*`, ne jamais éditer un checkout sans vérifier `git status`

## Garde-fous acquisition & autorité (Brief n°2 — 21/08/2026)

Chargés à chaque session : ils complètent `../lavilla-docs/CLAUDE.md` (ne pas dupliquer, y renvoyer). Source des faits : `FACT_BLOCK_ET_MESURE_IA_2026-08-04.md` §1, `Arbitrage_Final_Plan_Fusionne_2026-08-03.md`, `lavilla-docs/Plan_Autorite_Linkbuilding.md`.

### 1. Fact block canonique (toute divergence = bug, pas une variante)
- **La Villa Coliving** — coliving et colocation premium à la frontière de Genève, côté France. **29 chambres meublées** (17-23 m², privées) dans **3 maisons** : La Villa (Ville-la-Grand), Le Loft (Ambilly), Le Lodge (Annemasse).
- **Tout inclus dès 1 380 CHF/mois** (le « dès » est obligatoire ; source chiffrée = `src/data/stats.ts` → `PRICE_CHF_FR/EN`, jamais un montant en dur) : charges, fibre jusqu'à 8 Gb/s, ménage des communs 2×/semaine (→ 3× au 31/08), piscine, sauna, salle de sport, yoga, événements. **0 frais de dossier, 0 frais d'agence.** Caution : **2 mois de loyer hors charges** (jamais « 1 mois », jamais chiffrée).
- ⚠️ Péremption : prix valable jusqu'au 31/08/2026 ; bascule 01/09 via `feat/tarifs-2026-09` (montants actés 13/08 : **1 430 CHF**, et **1 370 CHF** pour 4 chambres à salle d'eau partagée → « dès 1 370 CHF »). Le jour de la bascule : mettre à jour ce bloc, `public/llms.txt` FR/EN, GBP, annuaires.
- Genève centre à **~20 min porte-à-porte** (Léman Express depuis Annemasse : Eaux-Vives en 8 min) — canonique partout, **hero de la home compris** (décision Jérôme du 03/09/2026, Q9 du plan SEO funnel : l'ancienne exception « 15 min » est levée). Les temps réels par maison restent affichés sur leurs pages (Lodge et Annemasse : 15 min en Léman Express direct).
- **100+ résidents** depuis octobre 2021 (jamais « 150+ ») · séjour « **13 mois en moyenne (9 mois hors longs séjours)** » · **37-42 m² d'espace de vie par colocataire** · pas de jacuzzi au Lodge · seuil de solvabilité 2,5× détaillé sur `/candidature` uniquement.
- **4,9/5 = enquêtes résidents (NPS interne)**, toujours étiqueté ainsi ; note Google réelle 4,5 → **aucun `aggregateRating` tant que Google < 4,7**.
- Jamais « moins cher que Genève » (le positionnement = confort et espace) ; **jamais un concurrent nommé** (texte, alt, meta, JSON-LD, annuaires, presse).

### 2. Doctrine 3 fronts + gel du pilier
- « coliving geneve / geneva » = **DÉFENSE** (must-win, ligne rouge : pos > 3 en FR+CH deux semaines de suite) · « colocation / chambre Annemasse » = **CONQUÊTE** (front principal FR, 880 rech./mois) · « colocation geneve » = **CHALLENGE au critère** (arbitrage 25/08, kill 05/10), jamais au détriment des deux autres. Genève reste l'ancre sémantique partout (titles « près de Genève », GBP, llms.txt, presse).
- **Pilier `/colocation-geneve` : gel LEVÉ le 04/09/2026** (décision Jérôme, Lot 5 du plan SEO funnel) : la page money FR revit à `/colocation-geneve` (intention « je cherche une chambre » : cartes chambres + FAQ), l'article `trouver-colocation-geneve-frontalier` garde l'intention « comment chercher » et lie la page en intro (ancre exacte « colocation à Genève côté France »). Pas de canonical entre les deux. `colocGeneveHref()` (`src/lib/siteLinks.ts`) reste l'interrupteur unique des ancres internes FR/EN.

### 3. Ancres (règle du Plan Autorité) — 40 % marque · 25 % URL nue · 25 % génériques · 10 % exact-match
Off-site d'abord ; on-site, la règle sert d'alerte sur les ancres contextuelles (`npm run link:graph`). Jamais 100 % « colocation [ville] » vers une même page.

### 4. Interdits (toutes surfaces)
Prix dans un `<title>` (décision S33 : CTR coupé) · chiffre de disponibilité en dur (`v_public_rooms` est la seule source) · € et CHF dans la même phrase (CHF = loyers La Villa, € = coûts côté France ; conversions uniquement au taux figé de l'Observatoire, étiquetées) · achat de liens, PBN, faux avis, plateformes qui facturent le locataire (Studapart, Roomlala…) · génération de pages en masse (vagues de 3-5 pages mesurées au bulletin, une intention = une page vérifiée en SERP) · automatisation de l'envoi d'outreach, de la relation presse ou du WhatsApp (on prépare, l'humain envoie) · modification de la logique d'envoi du formulaire (Edge `send-candidature-email`) sans plan validé.

### 5. Registre
FR commercial = **tutoiement** (site, blog, FAQ, metas) ; vouvoiement seulement sur mentions légales / politique de confidentialité ; Observatoire = registre neutre/impersonnel ; EN = « you » ; titres FR sans Title Case.

### 6. Travail & données
Brief n°2 = branche `feature/acquisition-autorite` ; commit par lot ; `tsc -b` puis `npm run build:local` **puis un 2ᵉ `npm run build`** (sinon `dist/` contient les prérendus de l'exécution précédente) ; `npm run lint:seo` ; `tools/out/` est gitignoré ; **jamais** de données GSC/GA4 brutes, d'URL de webhook n8n ni de clé dans le repo (la sonde `UjjxjZ4IiKU5o4P9` se lit via la variable d'env locale `GSC_SONDE_URL`).
Outils opérateur (mode d'emploi débutant : `tools/README.md`) : `npm run link:graph` (carte du maillage interne) · `npm run mining:gsc` (striking distance / CTR) · `npm run test:tools`.
