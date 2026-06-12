# RAPPORT D'ÉCART — PHASE 3 (ego bait « guide ressources frontalier » FR + EN)

> Branche `feat/pan-malin-linkbaits` · 2026-06-13 · Brief Pan Malin LOTS 0-2 (LOT 3 observatoire = Phase 5).

## LOT 0 — Reconnaissance (acquis de l'audit du 12/06, revérifiés)
- Prix **1 380 CHF/mois confirmé** sur /tarifs ✅ (valeur de l'article conservée).
- `/prerendered/*.html` : protégé (noindex + Disallow) — le point de fuite signalé par le brief était déjà corrigé ✅.
- Recouvrement : `living-in-france-working-in-geneva` = guide lifestyle (0 mention permis G/GTE/CAGI) → **création sans redirection**, titles différenciés (décision #4 validée).
- Slugs libres ; pipeline = INSERT SQL `blog_posts` + Action (vercel.json/sitemap/prerender automatiques).

## LOT 1 + LOT 2 — Publication FR + EN (préparée, en attente exécution SQL par Jérôme)
**Fichier : `scripts/nouvel-article-guide-ressources-frontalier.sql`** — INSERT en **BROUILLON** (`is_published = false`), une seule ligne couvrant FR et EN.

Conformité au brief, avec les adaptations suivantes (validées au plan ou à entériner) :
| Point | Brief | Réalisé |
|---|---|---|
| Contenu FR | intégrer tel quel | ✅ tel quel (tutoiement conservé — cible C1) ; `{:target="_blank"}` retirés (le renderer ouvre les liens externes en nouvel onglet d'office) ; commentaires HTML retirés |
| Ancre pilier | « colocation à Genève » dans la section La Villa | ✅ (« Découvre nos maisons » → « colocation à Genève ») |
| Slug EN | `cross-border-worker-resources-guide-geneva` | ⚠️ **slug FR identique sous /en/** (convention du site — le slug du brief casserait routage et hreflang ; décision #4) |
| Meta title dédié | « Guide des ressources du frontalier (Genève) \| La Villa » | ⚠️ le système n'a qu'UN champ titre (H1 = title tag) → H1 long conservé, suffixe marque auto-omis >65c. Meta description du brief reprise telle quelle ✅ |
| EN | adaptation, angle CAGI/expat renforcé | ✅ rédigée (intro internationaux, CAGI étoffé « if you are new to the region… start here ») |
| JSON-LD Article + FAQPage | requis | ✅ BlogPosting existant + **NOUVEAU : extraction FAQ markdown → FAQPage** (voir ci-dessous) |
| Maillage entrant | depuis /colocation-geneve + home | ✅ pilier : « Le guide des ressources du frontalier » en tête des Lectures essentielles ; home : bloc LatestBlog **dynamique** (l'article y apparaîtra seul à la publication) |
| og:image | visuel existant, URL propre | ✅ `/images/espace-commun.webp` (sans espaces — piège og:image évité) |
| Lien observatoire | TODO différé | ✅ pointe provisoirement vers l'article temps-trajet ; TODO[observatoire] documenté dans le SQL (Phase 5) |

## Évolution pipeline — FAQPage automatique sur les articles
`BlogPostPage` extrait désormais les paires Q/R des sections `## FAQ…` / `## … questions …` (questions en gras terminées par « ? ») et émet un **FAQPage JSON-LD** (texte = visible, markdown aplati — règle AEO). Testé sur les **40 articles publiés** : un seul match, `coliving-frais-dossier-geneve-annemasse` (4 Q/R propres) — **c'est le résidu FAQPage demandé par le brief Phase 4, livré ici**. Aucun faux positif.

## Séquence de publication (ordre IMPORTANT)
1. **Jérôme** : Supabase → SQL Editor → exécuter `scripts/nouvel-article-guide-ressources-frontalier.sql` (le SELECT final doit montrer la ligne, `is_published = false`).
2. **Jérôme** : relecture FR + EN via `/dashboard/blog` → onglet **Brouillons** → Preview (FR et EN). Corrections éventuelles dans l'éditeur.
3. **GO Jérôme** → bouton **Publier** au dashboard.
4. **Claude** : merge de cette branche (le lien pilier ne doit PAS partir en prod avant la publication, sinon lien mort) → l'Action prérend tout (article FR+EN, sitemap, rewrites) → vérifications live (curl HTML brut : texte + FAQ intégraux sans JS, JSON-LD valides).
5. **Jérôme** : lancement de l'outreach (Templates A-E du Plan d'Autorité) — action humaine.

## Risques
- Lien pilier → article : mort tant que l'article n'est pas publié (géré par l'ordre ci-dessus ; en préversion de branche, c'est attendu).
- Cannibalisation d'intention avec le guide lifestyle : titles différenciés + maillage croisé à surveiller en GSC.
