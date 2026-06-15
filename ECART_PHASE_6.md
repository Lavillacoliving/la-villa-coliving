# ECART_PHASE_6 — Optimisation funnel conversion (P1 / P2 / P3)

> Branche `feat/unification-editoriale` (4b et 6 livrées en un seul run, à la demande de Jérôme).
> Source : `Analyse_Funnel_GA4_2026-06.md`. Intègre **P1, P2, P3 uniquement** (P4 = fusionnée dans 4a ; P5 = hors scope n8n).
> Constat clé du rapport : les 3 pages maisons = 46 % des arrivées sur /candidature → P1 prioritaire.

## Rappel : le sprint des 11-12/06 avait déjà livré une grande partie
| Reco | Déjà acquis (avant cette phase) |
|---|---|
| P1 | CTA candidature above-fold (11/06), colonne prix sticky **desktop**, galeries product-first |
| P2 | CTA primaire doré « Découvrir nos 3 maisons » sous la tagline (cite l'analyse GA4) ; preuve sociale dans le hero |
| P3 | CTA intent-aware 4 variantes + CTA mid-article (seuil 800 mots) + événement GA4 `cta_click` |

## P1 — Pages maisons (HouseDetailPage, 1 composant = /lavilla /leloft /lelodge)
| Action plan | Statut | Preuve |
|---|---|---|
| **P1a — CTA sticky MOBILE** | **Fait** | barre `md:hidden fixed bottom-0 inset-x-0 z-40` + spacer `md:hidden h-16` (anti-recouvrement) ; LocalizedLink → /candidature. Prérendu : « Candidater — réponse sous 48h » (FR) / « Apply — reply within 48h » (EN) |
| **P1b — Réassurance + délai** | **Fait** | « réponse sous 48 h » (engagement existant conservé, arbitrage #13 ; pas de passage à 24 h) |
| **P1c — Wording CTA** (#12 option a) | **Fait** | « Candidater » conservé + réassurance (jamais de promesse de réservation) ; tracking `trackCta("sticky_mobile")` |
| **P1d — Dispo réelle par maison** (#6) | **Fait** | badges dérivés de `AVAILABILITY` (cf. C3 / ECART_PHASE_4B) ; maisons complètes → CTA « Liste d'attente » → /candidature |

## P2 — Home (HeroV7, HousesPreviewV7)
| Action plan | Statut | Preuve |
|---|---|---|
| Preuve sociale 1er écran | **Fait** | hero « 4,9/5 — 150+ résidents depuis 2021 » (note + cumul résidents au-dessus de la ligne de flottaison) |
| Encart « disponibilités du moment » (#6) | **Fait** | compteur hero dynamique `totalAvailabilityLabel()` + mois courant, dérivé de la source unique |
| CTA primaire doré | **Déjà en place** (sprint 12/06) — non régressé |

## P3 — Blog (BlogPostPage, blogIntentBuckets.ts)
| Action plan | Statut | Constat |
|---|---|---|
| Bloc mid-article bilingue | **Vérifié, déjà conforme** | s'affiche selon la langue de l'article (FR/EN) |
| Couverture articles fort trafic | **Vérifié** | CTA intent-aware déjà actif, seuil 800 mots couvre les articles longs |
| Position | **Inchangé** (split médiane, fenêtre 25-75 %) — écart non significatif vs « après 2-3ᵉ § », pas de modification |

> P3 était déjà livré au sprint 11-12/06 : cette phase l'a **vérifié**, pas réécrit (conforme au rapport d'écart).

## Écarts vs plan (assumés)
1. **4b et 6 livrées sur une seule branche** (`feat/unification-editoriale`) à la demande explicite de Jérôme (« on enchaine avec le reste (4b) et 6 en un seul run »). Le plan prévoyait 2 branches ; fusion validée par l'utilisateur. Cohérent car P1d (dispo) et C3 partagent la même source unique — les séparer aurait dupliqué le travail sur `stats.ts`.
2. **P2/P3 majoritairement vérification, pas création** : le sprint des 11-12/06 avait pris l'essentiel. Seul P1a (sticky mobile) était un vrai manque → c'est le cœur de ce qui a été ajouté.

## KPIs — cadrage (rappel)
Taux cibles du rapport (40 % maison→Candidater, 50 % home→Maisons, 5 % blog→maisons) = **objectifs de mesure post-déploiement**, PAS critères d'acceptation du code. Relecture du funnel GA4 « Parcours Candidature » après 2-3 semaines de données propres (`form_submit` réparé le 10/06).

## Vérification effectuée
- Prérendu : sticky CTA mobile présent FR + EN sur les 3 pages maisons, spacer anti-recouvrement, `md:hidden` (invisible desktop, pas de collision avec la colonne prix sticky desktop `md:+`).
- Claims cohérents site-wide : 48 h (délai), dispo (source unique).
- Revue adversariale : sticky CTA sans double-préfixe de langue (`localizePath` idempotent), `trackCta`/`ArrowRight` définis. **Verdict SHIP.**
- ⚠️ **Préversion mobile à confirmer par Jérôme** sur un vrai navigateur (le préversion headless a `innerHeight=0` → le scroll/sticky n'est pas testable en local). Idem `cta_click` en GA4 Temps réel depuis la préversion.
