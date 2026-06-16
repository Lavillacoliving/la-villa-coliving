# Observatoire « Loyer × Trajet » — Sources & méthodologie (Édition 1, 2026)

> **Édition 1 = corridor rive gauche / Léman Express → Genève-Eaux-Vives** (17 communes du Genevois français pour qui Eaux-Vives est le pôle naturel). Le Pays de Gex (→ aéroport/Nations) et le Genevois-sud (→ centre) feront l'objet d'éditions ultérieures (anti-biais : on ne compare jamais une commune à un pôle qui n'est pas le sien).
> Données = `public/data/observatoire-data-2026.csv`. La Villa Coliving = **éditrice neutre, absente de tous les chiffres**.
> **Règle : chaque valeur est sourcée. Aucun chiffre inventé.**

---

## 1. LOYER (ANIL « Carte des loyers » 2025)
- **Source** : « Carte des loyers — Indicateurs de loyers d'annonce par commune en 2025 », Ministère du Logement / DGALN-DHUP + ANIL + Groupe SeLoger + leboncoin. Données **T3 2025**, publiée le 11/12/2025. https://www.data.gouv.fr/datasets/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025
- **Indicateur affiché** : appartements **1-2 pièces (T1-T2)** — fichier `pred-app12-mef-dhup.csv`, colonne `loypredm2`. **Loyer mensuel = €/m² × 37 m²** (surface de référence ANIL du T1-T2). Le €/m² « ensemble appartements » reste dans le CSV (colonne `loyer_appt_eur_m2`).
- **⚠️ Charges COMPRISES** (méthodo ANIL, verbatim) : loyer d'annonce **estimé (prédit)** pour un logement de référence non meublé, **charges comprises**. Surfaces réf. : ensemble 52 m²/22,2 ; T1-T2 **37 m²/22,9**. **Non comparable** à un loyer hors charges (dont OCSTAT, §3).
- **Mention obligatoire affichée** : « Estimations ANIL, à partir des données du Groupe SeLoger et de leboncoin ».
- Flag : **Machilly** = loyer T1-T2 prédit « à la maille » (granularité moindre).

## 2. TEMPS DE TRAJET (vers Genève-Eaux-Vives, heure de pointe)
- **Relevés Jérôme sur Google Maps, le 16/06/2026**, destination **Genève-Eaux-Vives**, **arrivée ~9h15 un jour de semaine** (heure de pointe), porte-à-porte :
  - `voiture_min` : itinéraire voiture le plus rapide en pointe.
  - `transport_public_min` : meilleur itinéraire transports en commun (train + tram/bus + correspondance) — c'est la colonne « transport public ».
  - `velo_min` : itinéraire vélo (voie verte ; indépendant du trafic). Affiché « — » au-delà de 75 min (plus un mode du quotidien).
- **`train_lex_eauxvives_min`** (bonus, dans le CSV) : temps **Léman Express direct, gare-à-gare**, depuis les horaires officiels (lemanexpress.com / oev-info.ch 2023-2025). Ex. Annemasse 8 min, Reignier 25 min. C'est le chiffre « punchy » (mais le porte-à-porte réel = la colonne transport public).
- **Pourquoi Eaux-Vives** : terminus CEVA central où le Léman Express amène directement les communes du corridor. Note page : « +~10-15 min pour Cornavin / rive droite ».

## 3. REPÈRE GENÈVE (CHF, hors charges — encadré méthodo, hors tableau)
- **OCSTAT** (IS N°14, nov. 2021) : **21,55 CHF/m²/mois** (hors charges). Gardé en CHF, jamais converti, jamais mélangé aux € français. ⚠️ Asymétrie charges comprises (FR) vs hors charges (OCSTAT) signalée.

## 4. PÉRIMÈTRE — 17 communes de l'édition 1 (toutes 74, Haute-Savoie)
Annemasse, Ville-la-Grand, Ambilly, Gaillard, Étrembières, Vétraz-Monthoux, Cranves-Sales, Bonne, Saint-Cergues, Machilly, Bons-en-Chablais, Thonon-les-Bains, Évian-les-Bains, Reignier-Ésery, La Roche-sur-Foron, Bonneville, Annecy (repère élargissement, axe L2). Codes INSEE vérifiés (villes-de-france.eu).

## Conditions de mesure (encadré méthodo de la page)
1. Loyer : ANIL 2025, T3 2025, **T1-T2 charges comprises**, loyer estimé (réf. 37 m²). Mention ANIL obligatoire. Ordres de grandeur indicatifs.
2. Trajet : porte-à-porte vers **Genève-Eaux-Vives**, **heure de pointe (arrivée ~9h15)**, relevé Google Maps 16/06/2026 (voiture + transport public) ; vélo par la voie verte ; Léman Express direct depuis les horaires officiels.
3. Repère Genève : OCSTAT 2021, CHF, **hors charges**.
4. La Villa = éditrice neutre, absente des chiffres.

## Récapitulatif qualité
| Donnée | Statut |
|---|---|
| Loyer T1-T2 €/m² + €/mois (17) | ✅ ANIL 2025, charges comprises (Machilly = maille) |
| Transport public / voiture (17) | ✅ Google Maps pointe, porte-à-porte, 16/06 (relevé Jérôme) |
| Vélo (17) | ✅ Google Maps voie verte ; « — » si > 75 min |
| Train LEX direct (9 à gare) | ✅ horaires officiels (bonus CSV) |
| Repère Genève CHF | ✅ OCSTAT 2021 (hors charges) |

## TODO édition suivante (V2)
- Corridors Pays de Gex (→ aéroport/Nations) et Genevois-sud (→ centre).
- Re-vérifier 2-3 temps train sur l'horaire en vigueur avant chaque édition.
- og:image : exporter la carte SVG en PNG pour un rendu social maximal (Twitter/FB).
- Couche « tension » (frontaliers/commune INSEE + construction Sit@del).
