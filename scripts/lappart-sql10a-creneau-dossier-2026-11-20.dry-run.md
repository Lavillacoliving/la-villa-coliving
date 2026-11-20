# L'Appart — SQL n° 10a, créneau « dossier » : aperçu de la substitution

Généré le 2026-11-19T16:51:07.517Z par `scripts/build-slots-sql.mjs` · ancres vérifiées sur le fichier posts-apres-3bis.json (HORS LIGNE — ne pas appliquer ce SQL, régénérer sans --posts-json) · 2 modifications sur 1 articles · SQL : `scripts/lappart-sql10a-creneau-dossier-2026-11-20.sql`.

Légende : « Avant » = créneau des trois maisons (fourchette en jeton) ; « Après » = créneau des deux gammes (source du 13/11/2026).

## Résumé par article

| Article | FR | EN | updated_at en base | fr / en (caractères) |
|---|---|---|---|---|
| `dossier-location-frontalier-suisse-france` | 1 (adminSlot) | 1 (adminSlot) | 2026-11-19T14:26:48.508096+00:00 | 9013 / 8362 |

## Détail

### 1. `dossier-location-frontalier-suisse-france` (fr) · adminSlot

créneau « dossier » (check:slots, adminSlot:dossier) : trois maisons de coliving et L'Appart

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Chez La Villa Coliving (trois maisons à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.
````

**Après**

````text
Chez La Villa Coliving (trois maisons de coliving à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus, et une colocation à Annemasse dès 730 CHF par mois), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
Chez La Villa Coliving (trois maisons de coliving à Ville-la-Grand, Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus, et une colocation à Annemasse dès 730 CHF par mois), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.
````

### 2. `dossier-location-frontalier-suisse-france` (en) · adminSlot

créneau « dossier » (check:slots, adminSlot:dossier) : trois maisons de coliving et L'Appart

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
At La Villa Coliving (three houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.
````

**Après**

````text
At La Villa Coliving (three coliving houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive, and a flatshare in Annemasse from CHF 730 a month), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
At La Villa Coliving (three coliving houses in Ville-la-Grand, Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive, and a flatshare in Annemasse from CHF 730 a month), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.
````
