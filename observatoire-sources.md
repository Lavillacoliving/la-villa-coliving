# Observatoire « Loyer × Trajet » — Sources & méthodologie (Édition 2026)

> Relevé effectué le **2026-06-16**. Données = `public/data/observatoire-data-2026.csv` (séparateur `;`, décimales françaises `,`).
> **Règle absolue : chaque valeur est sourcée ou marquée `—`/`TODO`. Aucun chiffre inventé.** La Villa n'apparaît dans aucun chiffre (éditrice neutre).
> ⚠️ **À valider par Jérôme ligne par ligne avant publication** (crédibilité presse).

---

## 1. LOYER (ANIL « Carte des loyers » 2025)

- **Source** : « Carte des loyers — Indicateurs de loyers d'annonce par commune en 2025 », Ministère du Logement / DGALN-DHUP + **ANIL** + Groupe SeLoger + leboncoin. Données **3ᵉ trimestre 2025**, édition publiée le **11/12/2025**.
- **Page dataset** : https://www.data.gouv.fr/datasets/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025
- Deux indicateurs retenus (colonne `loypredm2`) :
  - **`loyer_appt_eur_m2`** = appartements (ensemble). Fichier `pred-app-mef-dhup.csv`.
  - **`loyer_t1t2_eur_m2`** = appartements **1-2 pièces (T1-T2)** — *le plus pertinent pour studios/colocation*. Fichier `pred-app12-mef-dhup.csv` (`.../20251211-144934/`).
- **`loyer_t1t2_mois_37m2`** = `loyer_t1t2_eur_m2 × 37` (loyer mensuel d'un T1-T2 type), **calculé** sur la surface de référence ANIL.

### ⚠️ Définition exacte (à respecter sur la page — citations verbatim)
- **CHARGES COMPRISES** (confirmé 4× dans la méthodo officielle) : *« …estimer les indicateurs de loyers charges comprises »* (Note méthodo p.5) ; *« Ils correspondent au loyer du marché de la relocation et sont charges comprises »* (p.4). → **NON comparable à un loyer hors charges** (dont le repère OCSTAT Genève, §5). Toute comparaison doit le mentionner.
- **Loyer ESTIMÉ (prédit)**, pas une médiane brute : prédiction hédonique pour un **logement de référence non meublé**. Formulation : « loyer d'annonce estimé (€/m², charges comprises) — Carte des loyers 2025, T3 2025 ».
- **Surfaces de référence** (verbatim, Guide p.1 + Note méthodo Tableau 11) :
  - Appartement **ensemble** : **52 m²**, 22,2 m²/pièce.
  - Appartement **T1-T2** : **37 m²**, **22,9 m²/pièce**.
  - (T3+ : 72 m² ; maison : 92 m².)
- **Pas d'indicateur T1 seul** : la maille la plus fine = « 1-2 pièces ».
- **Mention d'attribution OBLIGATOIRE** (verbatim, Guide p.2) :
  > **Estimations ANIL, à partir des données du Groupe SeLoger et de leboncoin**
- **Flag qualité** : **Machilly (74158)** = valeur prédite « à la maille » (cluster), granularité locale moindre (et T1-T2 < ensemble, artefact de maille). Bonneville = INSEE **74042** (Haute-Savoie).

## 2. TEMPS TRAIN — Léman Express **DIRECT** (`train_eauxvives_min`, `train_cornavin_min`)

- **Source** : fiches horaires officielles **Léman Express** (édition 2023) tracées train par train ; tronçon Annemasse–Genève re-confirmé sur l'horaire 2025 (oev-info.ch 151).
- **⚠️ LIAISONS DIRECTES UNIQUEMENT** (colonne `gare_lex_directe`) : **9 communes** desservies en direct vers Genève sans correspondance (Annemasse, Annecy, Thonon, Évian, Bons-en-Chablais, Machilly, Reignier-Ésery, La Roche-sur-Foron, Bonneville). Les autres = « — ».
- Deux gares d'arrivée centrales : **Eaux-Vives** (terminus CEVA, plus proche) et **Cornavin** (gare principale, ≈ Eaux-Vives +14 min). Fenêtre pointe matin.
- **Saint-Julien-en-Genevois** : gare TER **mais pas de LEX direct** (via Bellegarde ~46 min) → `gare_lex_directe = non`, train = « — ». Mode réel = bus/voiture.
- **Saint-Cergues** : gare fermée aux voyageurs.
- ⚠️ Horaires branches 2023 (stables) → re-vérifier 2-3 temps sur l'horaire 2026 avant publi (±1-2 min).

## 3. TEMPS VOITURE (`voiture_min`)

- **Source** : relevé **Google Maps** (commune → Plainpalais, centre Genève), mode voiture, **le 16/06/2026**, itinéraire le plus rapide. 25 relevés, résolution de commune vérifiée à chaque fois.
- **⚠️ Conditions = trafic COURANT au relevé** (libellés Maps « circulation normale / moins dense que d'habitude » → niveau **normal-à-léger, ≈ hors pointe**), **pas le pic strict de 8h** (le réglage « Partir à 8h » de Maps n'a pas pu être automatisé). La **pointe matin entrante vers Genève (frontière) est plus élevée**. → afficher « temps voiture indicatif (Google Maps, conditions courantes, juin 2026) ».

## 4. TEMPS TRAM/BUS — réseau **TPG** (`tpg_min`, `tpg_ligne`)

- **Source** : pages officielles TPG (tpg.ch/lignes), recoupées Wikipédia/agrégateurs. **Couverture partielle** : seules les communes du **cordon frontalier immédiat** ont une ligne TPG vers le centre.
  - **Annemasse → Genève-Rive : 25 min (Tram 17)** — chiffre officiel TPG robuste, **le repère à mettre en avant**.
  - **Ferney-Voltaire → Cornavin : ~27 min (Bus 60/61)** · **Gex → Cornavin : ~44 min (Bus 61 BHNS)** · **Saint-Julien → Bel-Air : ~35 min (Bus 80)** — sourcés (confiance correcte).
  - **Ambilly / Gaillard** : sur le Tram 17, temps **estimés** (~22 / ~20 min, lecture de grille, non confirmés au stop-level → marqués « estimé »).
  - **Toutes les autres** : « — » (réseau **TAC** Annemasse Agglo ou **Proxim'iTi** → correspondance obligatoire vers le Tram 17 ; ou hors réseau TPG pour le Chablais/Faucigny/Annecy). Honnête : pas de ligne TPG directe vers le centre.
- **À écrire sur la page** : présenter le tram/bus comme **complément** (le Tram 17 = la star), pas comme une colonne exhaustive.

## 5. REPÈRE GENÈVE — CHF, **hors charges** (encadré méthodo, hors CSV communes)

- **Source primaire OCSTAT** (IS N°14, nov. 2021, « Niveau des loyers, résultats 2021 ») : https://statistique.ge.ch/tel/publications/2021/informations_statistiques/autres_themes/is_loyers_14_2021.pdf
- **21,55 CHF/m²/mois** · loyer moyen **1 439 CHF/mois** · nouveaux locataires **27,60 CHF/m²**. **HORS CHARGES.**
- ⚠️ **Asymétrie charges** : OCSTAT = hors charges ; ANIL France = charges comprises. La comparaison France↔Genève doit le signaler (sinon l'écart est surévalué). Gardé en CHF, jamais converti.

## 6. CODES INSEE — villes-de-france.eu (miroir COG INSEE), 25 vérifiés.

---

## Conditions de mesure (encadré méthodo à publier intégralement)
1. **Loyers** : ANIL Carte des loyers 2025, données T3 2025, **charges comprises**, appartements non meublés, loyer **estimé** (prédit) pour un logement de référence (ensemble 52 m² / T1-T2 37 m²). « Estimations ANIL, à partir des données du Groupe SeLoger et de leboncoin ». Ordres de grandeur indicatifs, hors situation individuelle.
2. **Train** : Léman Express, **liaisons directes** uniquement, vers Genève-Eaux-Vives / Cornavin, pointe matin, horaire 2023/2025.
3. **Voiture** : Google Maps, → centre Genève, **trafic courant au 16/06/2026** (≈ hors pointe).
4. **Tram/bus** : TPG, communes du cordon frontalier, lignes desservant directement le centre (Tram 17, Bus 60/61/80).
5. **Repère Genève** : OCSTAT 2021, CHF, **hors charges** (≠ charges comprises côté France).

## Récapitulatif qualité (à valider)
| Donnée | Statut | Confiance |
|---|---|---|
| Loyer appt + T1-T2 €/m² (25) | ✅ Sourcé ANIL 2025, charges comprises | Élevé (Machilly = maille) |
| Loyer mensuel T1-T2 (×37 m²) | ✅ Calculé (surface réf. ANIL) | Dérivé assumé |
| Train direct (9 communes à gare) | ✅ Sourcé horaires LEX | Élevé |
| Voiture (25) | ✅ Google Maps 16/06 | Conditions courantes ≈ hors pointe |
| Tram/bus TPG | ⚠️ Partiel : Annemasse solide ; Ferney/Gex/St-Julien OK ; reste « — » | Moyen/sourcé |
| Repère Genève CHF | ✅ OCSTAT 2021 (hors charges) | Élevé (millésime 2021) |
