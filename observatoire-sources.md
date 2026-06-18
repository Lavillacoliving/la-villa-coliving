# Observatoire « Loyer studio × Trajet » — Sources & méthodologie (Édition 1, 2026)

> **Édition 1 = corridor rive gauche / Léman Express → Genève-Eaux-Vives** (17 communes du Genevois français pour qui Eaux-Vives est le pôle naturel). Le Pays de Gex (→ aéroport/Nations) et le Genevois-sud (→ centre) feront l'objet d'éditions ultérieures (anti-biais : on ne compare jamais une commune à un pôle qui n'est pas le sien).
> Données = `public/data/observatoire-data-2026.csv`. La Villa Coliving = **éditrice neutre, absente de tous les chiffres**.
> **Règle : chaque valeur est sourcée. Aucun chiffre inventé.**
>
> **Métrique = STUDIO, loyer d'annonce RÉEL** (ce que cherche un jeune actif arrivant à Genève). Choix assumé après constat : les indices de loyers de référence (ANIL côté France, OCSTAT côté Genève) sous-estiment le marché réel de la relocation — notamment l'OCSTAT, qui mesure le stock de baux en cours (y compris anciens, sous le marché) et fait apparaître Genève bien moins chère qu'elle ne l'est pour un nouvel arrivant.

---

## 1. LOYER STUDIO — France (Le Figaro Immobilier, juin 2026)
- **Source** : Le Figaro Immobilier, page « Prix m2 immobilier à <commune> », section **« Loyer au m2 » → « Loyers au m2 par nombre de pièces » → ligne « Studios / 1 pièce »**. URL type : `https://immobilier.lefigaro.fr/prix-immobilier/<slug>/ville-<code_insee>`. Pages **mises à jour le 02/06/2026** (estimations au 01/05/2026). Méthodologie Le Figaro : https://immobilier.lefigaro.fr/acheter/76-methodologie-des-prix-de-l-immobilier/
- **Indicateur affiché** : **loyer studio €/m²** (loyer d'annonce). **Loyer €/mois = €/m² × 30 m²** (studio de référence — comme le 37 m² ANIL pour le T1-T2 : isole l'effet du €/m²). Colonnes CSV : `loyer_studio_eur_m2`, `loyer_studio_eur_mois_ref30m2`.
- **Collecte** : Jérôme a relevé les 17 PDF Le Figaro (18/06/2026, dossier `prix immo/`). Extraction par script (pypdf) de la ligne « Studios / 1 pièce » de la section location.
- **Valeurs** : studio €/m² de 21 (Bonneville) à 34 (Ambilly) ; voir le CSV pour le détail commune par commune (la valeur du CSV fait foi).
- **3 communes sans studio publié** (Le Figaro affiche « - ») → **loyer 2-pièces** de la même page, **signalé par `*`** sur la page + colonne `studio_source=2pieces` : **Bons-en-Chablais** (21), **Bonne** (23), **Machilly** (23). Le 2-pièces est le format le plus proche du studio (proxy conservateur).

## 2. TEMPS DE TRAJET (vers Genève-Eaux-Vives, heure de pointe)
- **Relevés Jérôme sur Google Maps**, destination **Genève-Eaux-Vives**, **arrivée ~9h15 un jour de semaine** (heure de pointe), porte-à-porte :
  - `transport_public_min` : meilleur itinéraire transports en commun (train + tram/bus + correspondance) — c'est la colonne « transports publics ».
  - `velo_min` : itinéraire vélo (voie verte ; indépendant du trafic). Affiché « — » au-delà de 75 min (plus un mode du quotidien).
  - `voiture_min` : itinéraire voiture le plus rapide en pointe.
- **`train_lex_eauxvives_min`** : temps **Léman Express direct, gare-à-gare**, horaires officiels. Ex. Annemasse 8 min, Reignier 25 min.

## 3. LÉMAN EXPRESS — gares & cadence en heure de pointe (horaire officiel 2026)
- **Source** : horaire officiel Léman Express 2026 (en vigueur depuis le 14/12/2025) — lemanexpress.com, ge.ch, Annemasse Agglo, ca-frontaliers.com.
- **Cadence en pointe vers Genève** (colonne `cadence_lex_pointe_min`) :
  - **Annemasse ↔ Genève : ~10 min** (tronçon central L1-L4 cumulées). → concerne aussi **Ville-la-Grand** et **Ambilly** (gare d'Annemasse limitrophe : `gare_lex=oui`, 8 min, cadence 10).
  - **Direction Évian (L1) et La Roche-sur-Foron (L2+L3) : ~30 min** → Machilly, Bons-en-Chablais, Thonon, Évian (L1) ; Reignier-Ésery, La Roche-sur-Foron (L2+L3).
  - **Direction Saint-Gervais (L3) et Annecy (L2) : ~1 train/heure** → **Bonneville** (60) et **Annecy** (60) — à signaler comme peu pratiques au quotidien malgré le LEX.
- **Gaillard** = desservi par le **tram 17** (pas de gare LEX) → `gare_lex=non`, note « Tram 17 ». Ambilly est aussi sur le tram, mais affiché via sa gare (8 min).

## 4. REPÈRE GENÈVE — studio, marché RÉEL (CHF)
- **Source** : annonces réelles **ImmoStreet.ch**, zone **Eaux-Vives (Genève)**, relevé **juin 2026** (PDF export, 7 résultats 1-2 pièces). **Hors logements étudiants** (960/1010 CHF, réservés étudiants, hors marché) **et hors meublés** (premium).
- **Affiché : fourchette ≈ 1 600–2 000 CHF/mois** (et non un point unique) — l'échantillon est restreint car **le studio non meublé est réellement rare à Eaux-Vives**. Le studio non meublé « standard » du lot = 1 780 CHF / 35 m² (≈ 51 CHF/m²) ; les studios meublés montent à 2 470 CHF. **Fourchette volontairement conservatrice** (choix Jérôme 18/06) : on en trouve parfois dès **1 600**, et **~2 000** = niveau studio Eaux-Vives = plafond du curseur budget de la page.
- **Gardé en CHF** (jamais converti / mélangé aux € français). **€ et CHF proches de la parité (≈ 1:1)** → les chiffres se lisent directement côte à côte (990 € ≈ 950 CHF).
- *(Remplace l'ancien repère OCSTAT ~1 120 CHF : la statistique cantonale mesure le STOCK des baux en cours, pas le loyer d'annonce qu'un nouvel arrivant paie réellement. C'est la correction de fond de cette édition.)*

## 5. CHIFFRE-CHOC (hero) — la falaise de la frontière
- **Studio Genève-Eaux-Vives ≈ 1 600–2 000 CHF** vs **Annemasse ≈ 990 € (studio Le Figaro, 8 min en Léman Express) = près de moitié moins.** Comparaison de format homogène (studio/studio), monnaies affichées telles quelles (parité ≈ 1:1). La vraie rupture de prix est la **frontière**, pas la distance dans la France (gradient France réel mais modéré : Annemasse 990 € → Bonneville 630 €, −36 %, et non-monotone car Annecy/Évian = loin **et** chers, effet tourisme/lac).

## 6. PÉRIMÈTRE — 17 communes (toutes 74, Haute-Savoie)
Annemasse, Ville-la-Grand, Ambilly, Gaillard, Étrembières, Vétraz-Monthoux, Cranves-Sales, Bonne, Saint-Cergues, Machilly, Bons-en-Chablais, Thonon-les-Bains, Évian-les-Bains, Reignier-Ésery, La Roche-sur-Foron, Bonneville, Annecy (repère élargissement, axe L2). Codes INSEE vérifiés.

## Récapitulatif qualité
| Donnée | Statut |
|---|---|
| Loyer studio €/m² (14/17) | ✅ Le Figaro 02/06/2026 (loyer d'annonce réel) |
| Loyer 2-pièces proxy (3/17) | ✅ Le Figaro, signalé `*` (Bons-en-Chablais, Bonne, Machilly) |
| Transports publics / vélo / voiture (17) | ✅ Google Maps pointe, porte-à-porte (relevé Jérôme) |
| LEX direct + cadence pointe | ✅ horaire officiel Léman Express 2026 |
| Repère Genève studio CHF | ✅ annonces ImmoStreet juin 2026, fourchette 1 600–2 000 (hors étudiants/meublés) |

## TODO édition suivante (V2)
- **og:image en PNG** : les réseaux sociaux (FB/Twitter/LinkedIn) ne rendent pas le SVG → exporter `observatoire-loyer-trajet-2026.svg` en PNG pour un aperçu social. (Le SVG reste l'image meta + le graphe in-page.)
- Élargir l'échantillon Genève (ImmoStreet + Immoscout) pour resserrer la fourchette studio.
- Corridors Pays de Gex (→ aéroport/Nations) et Genevois-sud (→ centre).
- Re-relever les studio €/m² Le Figaro + l'horaire LEX avant chaque nouvelle édition.
