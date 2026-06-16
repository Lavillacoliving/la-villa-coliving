# Consolidation blog — RUNBOOK (à exécuter par Jérôme)

**But.** Terminer la dé-cannibalisation du blog : fusionner 9 articles « sources » dans
leurs piliers, puis les rediriger en 301. Le contenu utile est récupéré AVANT toute
redirection (rien de positionné n'est perdu).

**État de départ (constaté le 16/06/2026).** 10 des 20 redirections du plan étaient
**déjà en place** (couche « clones » traitée lors d'une passe précédente). Ce dossier
traite **les 10 qui restaient** : la typo Léman Express + 9 fusions.

**Mode.** Rien n'est activé automatiquement. Tu lances les scripts toi-même, dans l'ordre
ci-dessous. Tout est sur la branche Git `seo/consolidation-blog` (rien n'est sur `main`).

---

## Les 9 fusions (source → pilier)

| Source (sera dépubliée + 301) | → Pilier (reçoit le contenu) | Impr. 28j |
|---|---|---|
| meilleurs-quartiers-frontaliers-geneve | ou-habiter-frontalier-suisse-villes-france-pas-cher | 956 |
| loyer-frontalier-geneve-combien-payer | budget-colocation-geneve-guide-complet | 529 |
| temps-trajet-annemasse-geneve-par-quartier | transport-annemasse-geneve-leman-express | 52 |
| studio-geneve-vs-colocation-france-budget | budget-colocation-geneve-guide-complet | 43 |
| chambre-meublee-annemasse-geneve | colocation-annemasse-ville-la-grand-ambilly | 28 |
| arriver-seul-geneve-guide-30-jours | demenager-geneve-frontalier-checklist | 24 |
| geneve-sans-voiture-mobilite-douce-frontaliers | transport-annemasse-geneve-leman-express | 15 |
| economies-coliving-tout-inclus-geneve | budget-colocation-geneve-guide-complet | 3 |
| 5-erreurs-logement-frontalier-geneve | arnaques-logement-frontalier-geneve-eviter | 1 |

Plus la typo `transport-…-leman-expres` (sans « s ») → `…-leman-express` (301 seule, pas de contenu).

---

## Fichiers de ce dossier

- `01-fusion-budget.sql` … `07-orphelin-avantages.sql` — insèrent le contenu récupéré dans chaque pilier.
- `08-maillage-interne.sql` — repointe tous les liens internes vers les piliers (sans casser les ancres).
- `09-depublication.sql` — dépublie les 9 sources (is_published=false).
- `10-verification.sql` — contrôles finaux (lecture seule).
- `salvage/*.md` — **aperçu lisible** du contenu ajouté à chaque pilier (à relire avant de lancer).
- Hors dossier, déjà appliqués sur la branche : `vercel.json` (20 nouvelles 301 + correction d'une chaîne) et `src/data/blogIntentBuckets.ts` (9 slugs retirés).

---

## ORDRE D'EXÉCUTION

> Les SQL se lancent dans **Supabase → SQL Editor → New query → coller → Run**.
> Projet : **tefpynkdxxfiefpkgitz** (vérifie en haut à gauche).
> Chaque script finit par un SELECT de contrôle : lis-le avant de passer au suivant.

**Étape 1 — Relire le contenu récupéré.** Ouvre les fichiers `salvage/*.md` et survole-les.
C'est ce qui sera ajouté aux piliers. Si une section te gêne, dis-le moi, on ajuste avant.

**Étape 2 — Fusions (contenu).** Lance dans l'ordre `01` → `07`. Chaque script est
idempotent (un garde-fou empêche de l'insérer deux fois). Le contrôle doit montrer
`section_inseree = true` et une longueur (`len_fr`) en hausse.

**Étape 3 — Maillage interne.** Lance `08-maillage-interne.sql`. Le dernier SELECT doit
renvoyer **0 ligne** (plus aucun lien interne vers une page qui sera redirigée).

**Étape 4 — (recommandé) Coup d'œil aux piliers.** Sur le site (ou via le dashboard),
ouvre 2-3 piliers (budget, ou-habiter, transport) et vérifie que les nouvelles sections
s'affichent proprement.

**Étape 5 — Dépublication.** Lance `09-depublication.sql`. Contrôle : les 9 sources à
`false`, total publiés = **32**.

**Étape 6 — Vérification.** Lance `10-verification.sql`. Tout doit être au vert
(piliers publiés, sections présentes, 0 lien mort, 32 publiés).

**Étape 7 — Déploiement.** Mettre la branche en production :
```
git checkout main
git merge seo/consolidation-blog
git push
```
(ou dis-moi « go » et je le fais.) Le push déclenche l'Action « Pre-render & Deploy »
qui régénère **sitemap.xml + rewrites + pages prerendered** à partir des 32 articles
publiés (les 9 sources en sortent toutes seules), commit, et Vercel déploie. Les 301 du
`vercel.json` sont préservées par l'Action et passent en prod avec le merge.

> ⚠️ L'étape 5 (dépublication) doit être faite **avant** l'étape 7 (sinon le prerender
> régénérerait les 9 articles comme publiés).

**Étape 8 — Après mise en ligne.**
- Teste quelques redirections (doivent renvoyer **un seul** saut 301 → 200) :
  ```
  curl -sI https://www.lavillacoliving.com/blog/meilleurs-quartiers-frontaliers-geneve | grep -i "location\|HTTP"
  curl -sI https://www.lavillacoliving.com/blog/loyer-frontalier-geneve-combien-payer  | grep -i "location\|HTTP"
  ```
- Google Search Console : resoumets `https://www.lavillacoliving.com/sitemap.xml` et
  demande la réindexation des piliers (budget, ou-habiter, transport, arnaques, demenager,
  colocation-annemasse, coliving-annemasse).

---

## Points à valider (décisions)

1. **Mot-clé « colocation genève » — choix d'attribution.** Le plan demandait de recibler
   le pilier *budget* sur « colocation genève », mais ce terme est déjà la cible du pilier
   `trouver-colocation-geneve-frontalier` ET de la landing `/colocation-geneve`. Pour éviter
   de recréer la cannibalisation qu'on combat, j'ai plutôt reciblé *budget* sur **« budget /
   prix logement frontalier » + « ville frontière suisse pas cher »** (j'ai rempli sa
   meta-description, qui était vide). Si tu préfères la version littérale du plan, dis-le.
2. **Orphelin à 239 impressions** (`annemasse-…-guide-complet`, supprimé le 09/06) :
   enquête faite. Il était à ~90 % un doublon du pilier `coliving-annemasse-…-avantages`,
   **sauf** une section « Vie culturelle, sport et gastronomie » — récupérée depuis le git
   et le CSV de sauvegarde, et réinjectée (script `07`).
3. **5 clones déjà redirigés** pointent vers `/le-coliving` (et non vers le pilier blog
   prévu). Ce sont des pages à 0 clic ; je les ai laissées telles quelles. Dis-moi si tu
   veux l'alignement strict.

---

## Rollback

- **Avant déploiement** : ne merge pas. La branche est isolée, `main` n'est pas touché.
- **Annuler une dépublication** : `UPDATE blog_posts SET is_published=true WHERE slug='…';`
- **Annuler le contenu/redirections** : `git revert` du/des commit(s) de la branche.
  Les sources sont **dépubliées, pas supprimées** — leur contenu reste récupérable en base.

## Récap chiffré

| | Avant | Après |
|---|---|---|
| Articles publiés (FR) | 41 | 32 |
| Redirections 301 (vercel.json) | 81 | 101 |
| Liens internes vers pages redirigées | plusieurs | 0 |
