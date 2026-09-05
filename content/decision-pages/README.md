# Pages de décision — brouillons (source de vérité en git)

Une page de décision (brief « Conquête IA », 04/09/2026) est un **article du blog** (`blog_posts`, markdown,
un seul slug FR/EN : `/blog/<slug>` et `/en/blog/<slug>`) écrit pour répondre aux questions que les candidats
posent aux assistants IA, avec La Villa nommée comme option. Le rendu (prérendu, hreflang, sitemap, bloc offre,
FAQPage, byline, fil d'Ariane) est celui de tous les articles ; trois extensions du rendu (Lot C0) :

1. **Bloc entité** : une ligne `<!-- entity-facts -->` seule, **après le tableau d'options, jamais en tête**
   (hors des 40 % de début). `BlogPostPage` la remplace par `<EntityFacts/>` (fiche de faits canonique, Lot S1).
   Le paragraphe qui suit = la phrase de contexte propre à la page (« Pour un nouveau job dans un mois : dossier
   en 2 minutes, réponse sous 48 h, visite dans la semaine »).
2. **Tokens de faits** (jamais de prix en dur) : `{{PRIX_DES}}` (dès 1 370 CHF), `{{PRIX_PRIVATIF}}` (1 430 CHF),
   `{{NB_CHAMBRES}}`, `{{NB_MAISONS}}`, `{{MIN_GENEVE}}`, `{{CAUTION_MOIS}}` — uniquement dans le contenu
   (pas dans les titres, extraits ni metas). Source : `src/lib/contentTokens.ts` ← `src/data/stats.ts`.
3. **Tableau d'options** (GFM) à colonnes imposées : `| Option | Prix | Délai réaliste | Dossier demandé | Durée minimum |`
   (EN : `| Option | Price | Realistic timeline | Paperwork required | Minimum stay |`), 4 catégories anonymes
   (studio en ville, colocation classique, coliving côté France, résidence/appart'hôtel) + éventuellement la ligne
   La Villa avec tokens. **Aucune marque autre que La Villa.** Une devise par cellule (CHF côté Genève, € côté France).

## Règles vérifiées par `npm run article:sql -- <slug> --mode insert|update`
- 1 800 à 2 500 mots FR, EN à parité (même fourchette) ; sections en `##` (≥ 6) ; « En bref » (3-4 puces) après le chapô ;
  `## Quand ce n'est pas le bon choix` avant la FAQ ; réponse d'abord dans chaque section.
- FAQ : titre `## Questions fréquentes …` (ou `## FAQ …`), 5 à 8 paires au format `**Question ?**` + paragraphe(s)
  (2-4 phrases), pas de `###` dans la section — c'est le format que `extractFaqPairs` transforme en `FAQPage`.
- Liens : ≥ 1 vers `/candidature` (auto-instrumenté `src=article_cta`), ≥ 1 page money, ≥ 1 pilier éditorial ;
  en EN, tous les liens internes en `/en/…` ; jamais vers une URL redirigée (`vercel.json`).
- Metas (`<slug>.meta.json`) : title ≤ 50 car. (le suffixe « | La Villa Coliving » porte le total à 70), **jamais de
  prix dans le title**, meta description 110-155 car., `author` = `Jerome Austin` (byline + Person + AuthorBox),
  `category` ∈ coliving/lifestyle/tips/geneva/community, ≥ 3 tags, `image_url` existante dans `public/`,
  `intent_bucket` (à reporter dans `src/data/blogIntentBuckets.ts`), `inbound` (2 pages existantes → nouvelle page :
  `{slug, anchor_fr, anchor_en}`), `consolidates` (slugs à dépublier + 308).
- Aucun concurrent nommé (scan avec `scripts/competitors.local.json` ou `COMPETITOR_NAMES`) ; tutoiement ; sources
  officielles datées pour tout fait réglementaire, sinon marqueur `[À VÉRIFIER]` (bloquant en relecture).

## Circuit d'une page (une branche `content/<slug>`, une PR)
1. Copier `_TEMPLATE.fr.md`, `_TEMPLATE.en.md`, `_TEMPLATE.meta.json` en `<slug>.*`.
2. `npm run article:sql -- <slug> --mode insert` → `scripts/nouvel-article-<slug>.sql` (brouillon `is_published = false`).
3. Jérôme applique le SQL ; relecture sur le site réel : `/blog/<slug>?preview=lavilla2026` (FR et `/en/blog/…`).
4. Itérations : `--mode update` → `scripts/maj-article-<slug>-<date>.sql`.
5. Maillage et consolidation : `--links` (meta.inbound) et `--consolidate` (meta.consolidates) ; côté code :
   `node scripts/redirects.mjs --add /blog/<ancien> /blog/<slug>`, `src/data/blogIntentBuckets.ts`,
   `scripts/redirects.expected.json`, lien `more` dans `src/data/faqData.ts`.
6. Build local double (`npx tsc -b && npm run build:local && npm run build`), `npm run check:competitors --
   --routes /blog/<slug>,/en/blog/<slug>`, `npm run check:redirects`, `npm run lint:seo`, `node scripts/hydration-check.mjs`.
7. PR : brouillons, SQL, captures mobile/desktop, sorties des contrôles, JSON-LD validé, liens entrants/sortants, prompts de contrôle.
8. **GO Jérôme puis, dans la même séance** : `--mode update --publish [--links --consolidate]` appliqué, puis merge/push.
   Le prérendu tourne à 05 h et 13 h UTC : un article publié en base sans son code mergé serait rendu avec l'ancien code.
