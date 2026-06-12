# RAPPORT D'ÉCART — PHASE 1 (hygiène technique + résiduel Phase 2 fusionné)

> Branche `fix/hygiene-technique` · 2026-06-12 · Audit complet : 10 agents lecture seule (curl live + repo) — détail dans le plan validé.
> Statuts : ✅ déjà fait (aucune action) · 🔶 partiellement fait (complété ici) · 🛠 à faire (fait ici) · ⛔ obsolète (écarté).

## Brief « Hygiène technique » vs réel

| Action du brief | Constat (preuve) | Statut | Action sur cette branche |
|---|---|---|---|
| LOT 1 — vrais 404 | Toute URL inconnue = HTTP 200 + shell SPA 2 344 o (curl live) ; cause : catch-all `/(.*) → /_spa.html` | 🛠 | **LOT A** : liste blanche de rewrites (le prerender régénère vercel.json), 6 rewrites SPA explicites (/portail, /dashboard, /reset-password, /mon-espace), `trailingSlash:false`, NotFoundPage prérendue → `dist/404.html` (statut 404 natif Vercel), prop `noindex` dans SEO.tsx (la 404 déclarait `index, follow`) |
| LOT 2 — 14 redirections 301 (tableau A) | Toutes déjà en 308 permanent, destinations 200 vérifiées une à une | ✅ | aucune |
| LOT 2 — tableau B « laisser en 404 » | Déjà redirigées en 308 vers des pages pertinentes | ⛔ | aucune (les 308 en place récupèrent les signaux résiduels Wix — préférable au 404) |
| LOT 2 — cas ambigus /location, /fr/members | Déjà tranchés et implémentés (→/nos-maisons, →/le-coliving) — entérinés par Jérôme (décision #1) | ✅ | aucune |
| LOT 3 — 6 vraies pages EN/FR | 200 + titles spécifiques + hreflang réciproques (curl) | ✅ | aucune |
| LOT 4 — sitemap | 110 loc propres, aucune URL fantôme | ✅ | amélioration bonus : `lastmod` blog = `updated_at` réel (LOT C) |
| LOT 4 — robots.txt | Manquait `/portail` et `/admin` | 🔶 | **LOT A** : ajoutés + `X-Robots-Tag: noindex` sur routes privées et `/_spa.html` (C10) |
| /prerendered/le-coliving.html | Déjà noindex (header) + Disallow | ✅ | aucune |
| C12 — pages de confiance | AUCUNE page légale (10 slugs en soft-404), 0 lien footer | 🛠 | **LOT B** : /mentions-legales + /politique-de-confidentialite FR+EN, liens footer, prerender+sitemap. ⚠️ Placeholders `[À COMPLÉTER]` — voir « Décisions/inputs Jérôme » |
| LOT 5 — réindexation GSC | — | 🛠 | Marche à suivre ci-dessous |

## Résiduel Phase 2 (fusionné — décision #9)

| Action | Constat | Action |
|---|---|---|
| Meta description pilier + site-wide | Déployées (22/22 pages, texte du brief mot pour mot) | ✅ aucune |
| Fraîcheur pilier | `dateModified` JSON-LD ok mais aucune mention visible | **LOT D** : « Mis à jour le {date} » visible dans le hero + `datePublished` (2026-02-17, date de création git de la page) |
| C5 navigation | Une seule NavbarV7 globale, « Colocation Genève » en 1ʳᵉ position partout | ⛔ obsolète (diagnostic antérieur au prerender du 12/06) |
| Maillage entrant pilier | 7/7 articles avec ancres cibles | ✅ aucune |
| Ancre limite pilier→satellite | « Trouver une colocation à Genève (2026) » (title de l'article, bloc Guides Utiles dynamique) | **LOT D** : override d'ancre dé-optimisée pour ce slug |
| LOT 3 décannibalisation (recentrage satellites) | — | ⛔ NON exécuté (conditionnel GSC 3-4 sem., déclenché par Jérôme) |

## Quick wins pipeline (décision #10 — GO Phase 1)

| Constat audit | Action |
|---|---|
| `meta_description_fr/en` stockées en base mais JAMAIS servies (la meta live = excerpt) | **LOT C** : branchées dans BlogPostPage (fallback excerpt) |
| JSON-LD articles : `dateModified = published_at` | **LOT C** : `updated_at` (les mises à jour d'articles sont enfin signalées) |
| Sitemap : `lastmod` = date du build sur 110 URLs | **LOT C** : `updated_at` réel pour les articles |
| `blog_calendar` lisible par la clé anon (fuite stratégie éditoriale) | SQL fourni à Jérôme (#11) — **vérification post-exécution à faire** |
| Code mort : 4 navbars + 6 heroes + 4 footers + 2 HomeSections jamais importés (vieux claims « 50+ colivers ») | **LOT D** : supprimés (18 fichiers, −2 094 lignes), tsc OK |

## Hors scope signalé (à décider plus tard, PAS dans cette branche)
- **Bandeau cookies** : GA4 se charge inconditionnellement et AUCUN bandeau de consentement n'existe — point de conformité ePrivacy/CNIL à trancher (impact mesure d'audience si ajouté). Mentionné honnêtement dans la politique de confidentialité.
- Ping sitemap Google/Bing dans l'Action : endpoints décommissionnés (inoffensif).

## Revue adversariale post-implémentation (3 lentilles × vérification, 13 findings confirmés)

**Corrigé sur la branche (LOT F)** :
- 🟠 *Panne Supabase pendant un prerender = destruction des 80 rewrites/fichiers blog committée et déployée automatiquement* (le catch-all amortissait ce scénario avant) → **fail-fast** : le script s'arrête (exit 1, l'Action échoue sans rien committer) sur erreur de fetch OU sur 0 article retourné.
- 🟠 *Article publié via le dashboard (« Publier ») = 404 dur jusqu'au prochain run de l'Action* → fallbacks `/blog/:slug` et `/en/blog/:slug` vers le shell SPA en fin de rewrites : les articles connus restent prérendus, un nouvel article s'affiche immédiatement côté client. (Effet secondaire assumé : les URLs poubelle sous `/blog/` restent en soft-200 — périmètre contenu ; les fantômes Wix, eux, sont hors `/blog/`.)
- 🟠 *`npm run prerender` lancé seul sans `dist/index.html` écraserait les 115 pages par des coquilles vides (exit 0)* → garde `fs.access(dist/index.html)` + une page rendue < 50 mots n'est jamais écrite + tout échec de rendu fait échouer le script.
- 🟡 *inject : skip silencieux d'une page cassée* → le build échoue désormais si un fichier prérendu n'a pas de contenu substantiel.
- 🟡 *« Mis à jour le » décalé d'un jour pour les visiteurs UTC−* → `timeZone: "UTC"`.

**Documenté, traité ailleurs ou backlog** :
- 🔴 *Placeholders légaux committés* → c'est le gate de merge #1 ci-dessous (connu, voulu).
- 🟡 404 servi en français sur les URLs `/en/*` inconnues (l'anglais revient à l'hydratation ; page noindex statut 404 → zéro impact SEO) — backlog optionnel.
- 🟡 `lastmod` des pages statiques = date de build (pré-existant ; le blog est corrigé) — backlog Phase 4.
- 🟡 Liste blanche à maintenir en phase avec App.tsx (garde-fou CI possible) — backlog ; commentaire de synchro en place.
- 🟡 `build:local` : dist/ en retard d'une génération (zéro impact prod, preview locale non représentative des statuts — d'où la checklist sur preview Vercel).

## Gates de merge — état au 12/06 soir
1. ✅ **Pages légales** : contenu réel intégré (Pages_Legales_Contenu.md — SCI SLEEP IN, RCS 882 153 810, SIRET, siège, TVA, directeur). Zéro placeholder restant (vérifié sur les 115 pages prérendues). 2 adaptations à valider par Jérôme : champs réels du formulaire en §2a (sans date de naissance/situation pro) ; pas de référence à un « bandeau cookies » inexistant en §2d/§7 (bandeau CMP = micro-lot à trancher, la note cookies du doc source manquait). Nota : médiateur de la consommation non nommé (paragraphe générique L.612-1 — un médiateur désigné est normalement attendu, à compléter quand Jérôme en aura un).
2. ✅ **Vérification GSC** : export du 12/06 analysé (synthèse sans listes d'URLs : 107 indexées / 60 non indexées au 05/06, impressions ~530/j). Catégories à risque toutes couvertes : soft 404 (6) = corrigés par cette branche ; redirects (8) = en place ; crawled-not-indexed (31) = fantômes déjà redirigés (vérifiés au curl un par un) ; junk /blog/* = fallback SPA. Filet : surveillance du rapport 404 GSC 2 semaines post-merge (redirect ciblé si une URL à trafic apparaît).
3. ⏳ **Préversion Vercel** : branche poussée (déploiement preview auto). Jérôme récupère l'URL (guide fourni) → je déroule la checklist ci-dessous moi-même.
4. ⏸ **#11 sécurité** (PAT GitHub + RLS blog_calendar) : reporté à la fin de la mission à la demande de Jérôme — je le guiderai pas à pas. D'ici là : remote git déjà nettoyé ; `blog_calendar` reste lisible publiquement (risque concurrence, pas de données perso).

## Checklist de préversion (statuts fiables UNIQUEMENT sur preview Vercel)
```bash
P=https://<url-de-preview>
curl -s -o /dev/null -w "%{http_code}\n" $P/url-totalement-bidon            # attendu 404
curl -s -o /dev/null -w "%{http_code}\n" $P/blog/article-inexistant         # attendu 404
curl -s $P/url-bidon | grep -c "noindex"                                    # attendu ≥1
curl -s -o /dev/null -w "%{http_code}\n" $P/tarifs                          # attendu 200
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" $P/tarifs/         # attendu 308 → /tarifs
curl -s -o /dev/null -w "%{http_code}\n" "$P/tarifs?utm_source=test"        # attendu 200
curl -s -o /dev/null -w "%{http_code}\n" $P/en/tarifs                       # attendu 200
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" $P/fr/rates        # attendu 308 → /tarifs
curl -s -o /dev/null -w "%{http_code}\n" $P/portail $P/dashboard/loyers $P/reset-password  # attendu 200 (shell SPA)
curl -sI $P/portail | grep -i x-robots-tag                                  # attendu noindex
curl -s -o /dev/null -w "%{http_code}\n" $P/mentions-legales $P/politique-de-confidentialite $P/en/mentions-legales  # attendu 200
curl -s -o /dev/null -w "%{http_code}\n" $P/llms.txt $P/robots.txt $P/sitemap.xml  # attendu 200
curl -sI $P/_spa.html | grep -i x-robots-tag                                # attendu noindex
```
+ test navigateur : login /portail, navigation /dashboard, F5 sur /portail/mon-bail.

## Marche à suivre GSC (APRÈS mise en production, décision Jérôme)
1. Inspection d'URL sur 2-3 anciennes URLs Wix (ex. /fr/copie-de-le-loft) → doivent être vues en redirection ; sur une URL bidon → 404.
2. Indexation → Pages → motifs « Soft 404 » et « Crawled – currently not indexed » → **Valider la correction**.
3. Inspection d'URL sur /colocation-geneve, /en/colocation-geneve, /blog/coliving-vs-colocation-differences → **Demander une indexation**.
4. Sitemaps → re-soumettre `sitemap.xml`.
5. Laisser 1 à 3 semaines ; surveiller le rapport 404 (si une URL à trafic y apparaît → me la donner, j'ajoute un redirect).
