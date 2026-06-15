# ECART_PHASE_4B — Unification éditoriale (C1 / C2 / C3 / C7) + résidus 0-frais

> Branche `feat/unification-editoriale`. Matrice = plan validé 12/06 (Phase 4 scindée en 4a/4b).
> 4a (liens localisés EN) est déjà en production. 4b = la partie éditoriale.
> Vérifié sur le HTML **prérendu** (curl sans JS) après `npm run build:local` — 117/117 pages.

## Décisions appliquées (rappel des arbitrages Jérôme du 12/06)
- **#6 Option B** : disponibilité = source manuelle UNIQUE (`src/data/stats.ts → AVAILABILITY`).
- **#7** : claim générique = « 20 min du centre de Genève » / « 20 min from Geneva city center ».
- **#8 Tutoiement** FR sur les pages money (légal exclu, reste en vouvoiement assumé).

## Cause racine traitée : source unique des claims (`src/data/stats.ts`)
Avant, 4 endroits codaient les mêmes chiffres en dur et se contredisaient. Désormais **un seul fichier** :
- `STATS.rating = "4,9"` → `STATS_DISPLAY.fr.rating = "4,9"` / `.en = "4.9"` (graphie auto via `.replace(",",".")`), + `ratingSourced` (« 4,9/5 — enquêtes résidents »).
- `STATS_DISPLAY.*.residents = "150+ résidents depuis 2021"` / « 150+ residents since 2021 ».
- `AVAILABILITY = {lavilla:0, leloft:1, lelodge:0}` + helpers `houseAvailabilityLabel()` / `totalAvailabilityLabel()`.
→ Toute évolution future = 1 seule édition, plus de divergence possible.

## C1 — Registre (tutoiement FR)
| Action plan | Statut | Preuve |
|---|---|---|
| Pages money FR → tutoiement | **Fait** | JoinPageV4 (~16 conversions), RatesPageV4 (~11), ColivingPageV4, ColocationGenevePage, ServicesPageV4, AnnemasseColocationPage, ChambreLouerAnnemassePage |
| `src/i18n/translations.ts` FR-only | **Fait** | ~30 chaînes FR converties ; **objet `en` strictement intact** (revue adversariale confirmée) |
| Légal exclu | **Respecté** | mentions-légales / confidentialité restent en vouvoiement |
| Prérendu /tarifs | **Vérifié** | « tu économises » ×3, 0 « vous économisez » |

## C2 — Preuves sociales
| Action plan | Statut | Preuve (prérendu) |
|---|---|---|
| Aligner sur « 150+ résidents depuis 2021 » | **Fait** | home FR « 150+ résidents depuis 2021 », /candidature 150+ (0 « 100+ »), /le-coliving « 150+ résidents heureux » |
| Supprimer 100+ (/candidature) et 50+ (/le-coliving) | **Fait** | 0 compteur divergent sur les pages live |
| Note sourcée + graphie 4,9 FR | **Fait** | hero FR « 4,9/5 — 150+ résidents depuis 2021 » (virgule) ; hero EN « 4.9/5 — 150+ residents since 2021 » (point) ; attribut `title` = « enquêtes résidents » |
| Jamais d'aggregateRating | **Respecté** | 0 `aggregateRating` dans les JSON-LD |

> Hors scope (correct) : « 100+ via les banques » (comparatif de frais) et « 50+ personnes qui arrivent chaque année » (flux annuel ≠ cumul) dans le CORPS de 2 articles Supabase — claims factuellement distincts, intentionnellement non touchés.

## C3 — Disponibilité des chambres (Option B)
Source : `AVAILABILITY = {lavilla:0, leloft:1, lelodge:0}` → total 1. Les **4 affichages** en découlent :
| Surface | Affiche | Preuve prérendu |
|---|---|---|
| Hero home | « 1 chambre disponible » / « 1 room available » | ✔ FR + EN |
| Cartes home (HousesPreviewV7) | badge par maison + couleur (or si dispo, pierre si complet) | ✔ |
| Pages maisons (HouseDetailPage ×3) | La Villa « Complet », Le Loft « 1 chambre disponible », Le Lodge « Complet » | ✔ FR + EN |
| Formulaire /candidature | `totalAvailabilityLabel()` | ✔ |
| CTA liste d'attente (maisons complètes) | bascule auto → /candidature « Liste d'attente » | ✔ La Villa + Le Lodge |

> ⚠️ **{0,1,0} = valeurs PLACEHOLDER** (je ne connais pas la dispo réelle). C'est l'action manuelle n°1 de Jérôme. Tant qu'elles ne sont pas mises à jour, 2 maisons sur 3 s'affichent « Complet » + liste d'attente (cohérent par construction, à valider en préversion).

## C7 — Temps de trajet
| Action plan | Statut | Preuve |
|---|---|---|
| Claim générique = « 20 min du centre » | **Fait** | home FR ×8, home EN « 20 min from Geneva city center » ×8 ; 0 « 15 min de/from Geneva » générique résiduel |
| Conserver les temps par mode (pages maisons) | **Respecté** | « 9 min LEX », « 15 min via Léman Express → Cornavin », « 15 min en voiture » conservés (qualifiés) |
| Hero tagline | **Fait** | « à 20 min du centre de Genève » / « 20 min from Geneva city center » |

## Résidus 0-frais
| Action plan | Statut | Preuve |
|---|---|---|
| FAQ /faq : réponses absentes du HTML brut | **CORRIGÉ** | `accordion.tsx` : `forceMount` + `data-[state=closed]:hidden`. Réponses désormais dans le HTML prérendu (visuellement repliées). /faq « entièrement gratuit » présent hors JSON-LD ; /tarifs réponses FAQ présentes. JSON-LD = contenu visible (exigence Google) ✔ |
| Réassurance /candidature | **Présent** | « gratuit · sans engagement » (substance déjà en place) |

## Écarts vs plan (assumés)
1. **Code mort nettoyé au passage** (hors périmètre strict, mais zéro risque) : `TrustBadgesV4.tsx` portait « 4.9/5 » (graphie point en FR) et « 30min De Genève » (claim périmé) → corrigés en « 4,9/5 » FR + « 20min Du centre de Genève ». Composant non monté (0 import, 0 page prérendue) → aucun impact live, prévient une réutilisation accidentelle (cf. garde-fou roadmap Phase 2).
2. **`claims.ts` → `stats.ts`** : le plan proposait un nouveau fichier `claims.ts` ; j'ai étendu le `stats.ts` existant (déjà la source de vérité des chiffres) au lieu d'en créer un second — même effet, moins de fragmentation.

## Revue adversariale
1 agent indépendant, greps + `tsc -b --force` (exit 0) + eslint (exit 0). **Verdict : SHIP.** 0 BLOCKER, 0 MAJOR. Confirmé : objet `en` intact, grammaire FR correcte sur les 7 pages, logique C3 saine (libellés + couleurs dérivés du nombre réel), 0 résidu C7 générique, sticky CTA sans double-préfixe ni collision z-index, forceMount sans casse des 3 autres accordéons.
