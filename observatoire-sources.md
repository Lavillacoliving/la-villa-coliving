# Observatoire « Loyer × Trajet » — Sources & méthodologie (Édition 2026)

> Relevé effectué le **2026-06-16**. Données = `public/data/observatoire-data-2026.csv` (séparateur `;`, décimales françaises `,`).
> **Règle absolue : chaque valeur est sourcée ou marquée `TODO`. Aucun chiffre inventé.** La Villa n'apparaît dans aucun chiffre (éditrice neutre).
> ⚠️ **À valider par Jérôme ligne par ligne avant publication** (crédibilité presse).

---

## 1. LOYER — €/m² (colonne `loyer_eur_m2`)

- **Source** : « Carte des loyers — Indicateurs de loyers d'annonce par commune en 2025 », Ministère du Logement / DGALN-DHUP, en partenariat avec **ANIL**, INRAE, Groupe SeLoger et leboncoin.
- **Données** : annonces du **3ᵉ trimestre 2025**, édition publiée le **11 décembre 2025** (dernière disponible).
- **Page dataset** : https://www.data.gouv.fr/datasets/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025
- **Fichier utilisé** (appartements, toutes typologies) : `pred-app-mef-dhup.csv` — colonne `loypredm2`.
  - https://static.data.gouv.fr/resources/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025/20251211-145010/pred-app-mef-dhup.csv
- **Unité** : **€/m² par mois, charges comprises**, appartements.
- **⚠️ Définition exacte à respecter sur la page** : ce n'est PAS une médiane brute d'annonces, mais un **loyer d'annonce ESTIMÉ (prédit)** par modèle hédonique pour un **appartement de référence** (52 m²), charges comprises. Formulation rigoureuse à employer : « loyer d'annonce estimé (€/m², charges comprises) — Carte des loyers 2025, données T3 2025 ». Le dataset fournit aussi un intervalle de confiance par commune (`lwr.IPm2`/`upr.IPm2`) si on veut afficher l'incertitude.
- **Mention d'attribution OBLIGATOIRE (verbatim, à afficher dans l'encadré méthodo)** :
  > **Estimations ANIL, à partir des données du Groupe SeLoger et de leboncoin**
- **Flag qualité** : **Machilly (74158)** → valeur prédite « à la maille » (cluster homogène environnant), granularité locale moindre que les autres communes (prédites au niveau commune). Toujours une valeur officielle, mais à signaler.
- **Désambiguïsation** : Bonneville = INSEE **74042** (Haute-Savoie), pas 80113 (Somme).

## 2. LOYER T2-TYPE — € (colonne `loyer_t2_45m2_eur`)

- **Calculé** : `loyer_eur_m2 × 45 m²` (T2 de référence ~45 m²), arrondi à l'euro. **Valeur dérivée, pas une donnée brute** — à présenter comme « ordre de grandeur pour un T2 d'environ 45 m² ».

## 3. TEMPS DE TRAJET TRAIN (colonnes `train_cornavin_min`, `train_eauxvives_min`)

- **Source** : fiches horaires officielles **Léman Express** (édition 2023, valable 11.12.2022→09.12.2023) tracées train par train ; tronçon central **Annemasse–Genève** re-confirmé sur l'horaire officiel **2025** (151 « Annemasse–Genève–Coppet », oev-info.ch).
  - L1 (Évian/Thonon/Bons/Machilly) : https://www.lemanexpress.com/wp-content/uploads/2022/11/2023_LEX_FH_L1_EVI_COP.pdf
  - L2 (Annecy/La Roche/Reignier) : https://www.lemanexpress.com/wp-content/uploads/2022/11/2023_LEX_FH_L2_ANN_COP.pdf
  - L3 (Bonneville) : https://www.lemanexpress.com/wp-content/uploads/2022/11/2023_LEX_FH_L3_SGF_COP.pdf
  - Tronçon Annemasse–Genève 2025 : https://www.oev-info.ch/sites/default/files/fap/2025/pdf/151.pdf
- **Fenêtre** : pointe matin (arrivée Genève ~07h–08h30). Deux gares d'arrivée centrales fournies : **Genève-Cornavin** (gare principale) et **Genève-Eaux-Vives** (terminus CEVA, plus proche/rapide sur les branches est ; ≈ Cornavin −14 min).
- **15 communes avec gare directe** ; **10 sans gare** (« — » = réponse réelle, desserte bus uniquement) — confirmé via la liste canonique des 45 gares du réseau.
- **Cas particuliers** :
  - **Saint-Julien-en-Genevois** : gare TER existante MAIS pas de liaison directe Genève (ligne vers Annemasse ; pour Cornavin = changement à Bellegarde, ~46 min, **confiance moyenne** — Wikipédia/Trainline, SNCF-Connect inaccessible). Mode réel = bus/voiture. À traiter avec prudence sur la page.
  - **Saint-Cergues** : gare « St-Cergues-Les Voirons » **fermée aux voyageurs**, les L1 passent sans arrêt → « — ».
- **⚠️ Réserve presse** : minutages des branches issus de l'horaire **2023** (stables d'année en année). **Avant publication, re-vérifier les 2-3 temps affichés sur l'horaire 2026 en vigueur** (cff.ch / lemanexpress.com) — écarts attendus ±1-2 min.

## 4. TEMPS DE TRAJET VOITURE (colonne `voiture_min`)

- **Source** : relevé **Google Maps**, itinéraire commune → **Plainpalais (centre de Genève, 1205)**, mode voiture, **le 16/06/2026**. Valeur = itinéraire le plus rapide affiché. Les 25 relevés un par un (origine pinée par code postal/département, résolution de commune vérifiée à chaque fois — Cranves-Sales re-fait car le CP 74380 renvoyait d'abord Lucinges).
- **⚠️ Conditions = trafic COURANT au moment du relevé**, pas le pic strict de 8h. Les libellés Maps indiquaient « circulation normale / moins dense que d'habitude » → ces temps représentent un **niveau normal-à-léger** (≈ hors pointe). **La pointe matin ENTRANTE vers Genève (passage de frontière) est sensiblement plus élevée** sur les axes concernés. Le réglage « Partir à 8h » de Maps n'a pas pu être automatisé (widget résistant).
- **À écrire honnêtement sur la page** : « Temps voiture indicatif (Google Maps, conditions courantes, juin 2026) ». Ne PAS présenter comme un temps de pointe garanti. **Décision Jérôme** : (a) publier tels quels avec ce libellé, (b) re-relever quelques communes-clés à 8h pour un chiffre de pointe, ou (c) garder le train comme angle principal et la voiture en complément.
- **Ordres de grandeur cohérents** : cœur frontalier 17-30 min (Saint-Julien/Collonges/Archamps 17-19 ; Annemasse 28 ; Gaillard 22), Pays de Gex 26-42 (Ferney 26, Gex 42), Chablais lointain 41-63 (Bons 41, Thonon 55, Évian 63), Annecy 43.

## 5. REPÈRE GENÈVE — CHF (hors CSV communes, encadré méthodo)

- **Source primaire** : **OCSTAT** (Office cantonal de la statistique, Genève), *Informations statistiques N°14, novembre 2021 — « Niveau des loyers, résultats 2021 »*.
  - https://statistique.ge.ch/tel/publications/2021/informations_statistiques/autres_themes/is_loyers_14_2021.pdf
- **Chiffres (mai 2021, loyer libre, hors charges)** : **21,55 CHF/m²/mois** · loyer moyen **1 439 CHF/mois** · nouveaux locataires (au plus près du marché) **27,60 CHF/m²**.
- **Gardé en CHF** (jamais converti, jamais mélangé aux € français — règle brief). Sert de **point haut de comparaison** (« côté France, le loyer est nettement plus bas »).
- **MAJ 2024** : chiffres par-pièce existent (presse immobilier.ch/20min) mais attribution plus faible (« canton » pas OCSTAT nommé) et **pas de CHF/m²** → si un CHF/m² 2024 est requis : `TODO` (puiser dans les tableaux Excel OCSTAT T 05.04.2.01).

## 6. CODES INSEE (colonne `code_insee`)

- Source : villes-de-france.eu (miroir du Code officiel géographique INSEE), recoupé Wikipédia/INSEE. Les 25 vérifiés. (Saint-Julien-en-Genevois est bien en Haute-Savoie 74 malgré le nom « Genevois ».)

---

## Récapitulatif qualité (à valider par Jérôme)

| Donnée | Statut | Niveau de confiance |
|---|---|---|
| Loyer €/m² (25 communes) | ✅ Sourcé (ANIL 2025) | Élevé (sauf Machilly = maille) |
| Loyer T2-type | ✅ Calculé (×45 m²) | Dérivé assumé |
| Temps train (15 communes à gare) | ✅ Sourcé (horaires LEX) | Élevé (Saint-Julien = moyen) |
| « — » train (10 communes) | ✅ Réel (pas de gare) | Élevé |
| Temps voiture | ✅ Relevé Google Maps 16/06 | Conditions courantes ≈ hors pointe (pas le pic 8h strict) |
| Repère Genève CHF | ✅ Sourcé (OCSTAT 2021) | Élevé (millésime 2021) |

**Prochaine étape : validation Jérôme du CSV, puis construction de la page (LOT 3b).**
