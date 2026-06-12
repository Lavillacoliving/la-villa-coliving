# RAPPORT D'ÉCART — PHASE 4a (liens localisés EN — fusion C6 + P4)

> Branche `feat/liens-localises-en` · 2026-06-13 · Référence : plan validé (audit C6 requalifié) + Design B validé.

## Constat d'origine (audit du 12/06, validé par Jérôme)
- C6 « pages EN en retard de génération » : **OBSOLÈTE** — parité structurelle parfaite sur les 9 paires money, wording canonique EN à jour. **0 contenu à réécrire.**
- Le VRAI problème : ~106 liens internes codés en dur vers les URLs **FR** ; la home `/en` servait **0 lien** vers `/en/*`, `/en/blog` envoyait ses 40 cartes vers les articles FR ; le **toggle de langue ne changeait jamais l'URL** (reload/partage → retour au FR ; attribution GA4 des 55 % de candidatures internationales polluée).
- Acquis pré-phase (à ne pas refaire) : liens in-body des articles localisés le 11/06 (`76d4a494`) ; alts de HousesPreviewV7 déjà bilingues.

## Réalisé (5 commits)
1. **C1** — `src/lib/localizedPath.ts` (`localizePath`/`mirrorPath`, 14 assertions) + `src/components/LocalizedLink.tsx`. Routes privées (`/portail`, `/dashboard`, `/reset-password`, `/mon-espace`) exclues du préfixe.
2. **C2** — **l'URL devient la source de vérité de la langue** : `LanguageContext` dérive la langue de `useLocation` ; le toggle navigue vers l'URL miroir (query+hash préservés, position de lecture restaurée — `scroll-behavior:smooth` global contourné en `instant`) ; provider déplacé dans `BrowserRouter` ; `ScrollToTop` ignore les bascules de langue.
3. **C3** — Navbar (+`isActive` localisé), Footer, 5 sections V7 → `LocalizedLink`.
4. **C4** — 12 pages publiques migrées ; `loc()` de BlogPostPage unifié sur `localizePath`. Fichiers morts non routés exclus.
5. **C5** — LodgingBusiness JSON-LD bilingue (description/priceRange/amenities EN sur `/en`) ; 6 alts d'images conditionnels (logo nav/footer, hero, 3 maisons du pilier).

## Preuves (HTML prérendu committé + navigateur)
- `/en` : 37 liens `/en/*` (avant 0) · `/en/blog` : 40/40 cartes vers `/en/blog/*` (avant 0) · `/en/tarifs` 28 · `/en/colocation-geneve` 45 · `/en/candidature` 21.
- Contre-test FR : **0** `href="/en` dans le corps des pages FR (aucune fuite).
- Toggle vérifié en navigateur : `/tarifs` scroll 600 px → `/en/tarifs` scroll 600 px, contenu EN, `html lang=en`.
- tsc OK, build 115/115.

## Écarté / hors périmètre
- Réécriture de contenu EN (parité confirmée). Simplification des ~8 liens déjà conditionnels (idempotence de `localizePath` les rend inoffensifs). Fichiers morts. Pages légales (déjà gérées en dur FR/EN, conformes).

## Chaîne EN complète jusqu'au formulaire (P4)
Article EN → maisons EN → `/en/candidature` : tous les maillons servent désormais des URLs `/en/*`. Le formulaire `/en/candidature` était déjà bilingue (audit parité). KPI P4 (« chemins EN → Candidater dans le path exploration GA4 ») = mesure post-déploiement, 2-3 semaines de données.

## Vérification en préversion (checklist Jérôme/Claude)
1. Préversion Vercel de la branche → naviguer `/en` : tous les clics restent en `/en/*` (sauf Portail).
2. Toggle FR↔EN sur 3 pages : l'URL change, la position de lecture est conservée.
3. `curl` : `grep -c 'href="/en'` ≥ 20 sur les pages EN prérendues ; 0 sur les pages FR.
4. GA4 Temps réel : naviguer la chaîne EN → les page_view remontent avec les chemins `/en/*`.
