# Lot L3 — note Google et preuves : aperçu des modifications SQL des articles en base

Généré le 2026-10-10T08:33:50.506Z par `scripts/build-slots-sql.mjs` · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-10-10T08:33:50.504Z · 10 modifications sur 2 articles · SQL : `scripts/l3-social-proof-2026-10-09.sql`.

Légende : les textes « Avant » sont copiés au caractère près depuis la base (content_fr / content_en), les textes « Après » viennent de la source unique (`src/data/stats.ts` : GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL, STATS_DISPLAY.googleRating, STATS.totalResidents). Mécanismes : D4 note Google « 4,8/5 sur Google (36 avis) » + lien « voir les avis » vers la fiche (jamais d'aggregateRating) · D3 nombre de résidents (« plus de 100 », jamais 150). « des dizaines d'avis Google » (article arnaques) est vrai et reste tel quel.

## Résumé par article

| Article | FR | EN | updated_at en base | fr / en (caractères) |
|---|---|---|---|---|
| `coliving-communaute-reels-amis-geneve-annemasse` | 3 (D3, D4, D4) | 3 (D3, D4, D4) | 2026-09-29T11:20:24.853765+00:00 | 10926 / 9543 |
| `lodge-annemasse-coliving-premium-portes-geneve` | 2 (D3, D4) | 2 (D3, D4) | 2026-10-10T07:59:57.333901+00:00 | 15131 / 13463 |

## Détail

### 1. `coliving-communaute-reels-amis-geneve-annemasse` (fr) · D3

intro (L5, absente du recon) : « plus de 150 résidents d'une quinzaine de nationalités » → « plus de 100 résidents » (STATS.totalResidents ; 150 contredisait le reste du site)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
plus de 150 résidents
````

**Après**

````text
plus de 100 résidents
````

### 2. `coliving-communaute-reels-amis-geneve-annemasse` (en) · D3

intro (L5, not in the recon): “more than 150 residents from some fifteen nationalities” → “more than 100 residents” (STATS.totalResidents)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
more than 150 residents
````

**Après**

````text
more than 100 residents
````

### 3. `coliving-communaute-reels-amis-geneve-annemasse` (fr) · D4

L75 : « nos maisons affichent une note moyenne de 4,9/5 » → « La Villa Coliving affiche une note de 4,8/5 sur Google (36 avis) » (STATS_DISPLAY.fr.googleRating ; une seule fiche Google, celle de la marque)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
nos maisons affichent une note moyenne de 4,9/5
````

**Après**

````text
La Villa Coliving affiche une note de 4,8/5 sur Google (36 avis)
````

### 4. `coliving-communaute-reels-amis-geneve-annemasse` (fr) · D4

L75, fin de phrase : lien « voir les avis » vers la fiche Google (D4 : la note est toujours accompagnée du lien)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
: on reste parce qu'on s'y sent bien.
````

**Après**

````text
: on reste parce qu'on s'y sent bien — [voir les avis](https://maps.google.com/?cid=14514002506022967350).
````

### 5. `coliving-communaute-reels-amis-geneve-annemasse` (en) · D4

L75: “our houses hold an average rating of 4.9/5 and an average stay of” → “La Villa Coliving is rated 4.8/5 on Google (36 reviews), with an average stay of” (STATS_DISPLAY.en.googleRating ; relecture 10/10 : le verbe « hold » régissait les deux compléments)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
our houses hold an average rating of 4.9/5 and an average stay of
````

**Après**

````text
La Villa Coliving is rated 4.8/5 on Google (36 reviews), with an average stay of
````

### 6. `coliving-communaute-reels-amis-geneve-annemasse` (en) · D4

L75, end of sentence: “see the reviews” link to the Google listing (D4)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
: people stay because they feel good here.
````

**Après**

````text
: people stay because they feel good here — [see the reviews](https://maps.google.com/?cid=14514002506022967350).
````

### 7. `lodge-annemasse-coliving-premium-portes-geneve` (fr) · D3

L13 : « plus de 150 résidents sont passés par nos trois maisons » → « plus de 100 résidents » (STATS.totalResidents)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
plus de 150 résidents
````

**Après**

````text
plus de 100 résidents
````

### 8. `lodge-annemasse-coliving-premium-portes-geneve` (fr) · D4

L13 : « avec une note moyenne de 4,9/5. » → « avec une note de 4,8/5 sur Google (36 avis) — voir les avis. » (STATS_DISPLAY.fr.googleRating + lien D4)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
avec une note moyenne de 4,9/5.
````

**Après**

````text
avec une note de 4,8/5 sur Google (36 avis) — [voir les avis](https://maps.google.com/?cid=14514002506022967350).
````

### 9. `lodge-annemasse-coliving-premium-portes-geneve` (en) · D3

L13: “more than 150 residents have lived in our three houses” → “more than 100 residents” (STATS.totalResidents)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
more than 150 residents
````

**Après**

````text
more than 100 residents
````

### 10. `lodge-annemasse-coliving-premium-portes-geneve` (en) · D4

L13: “with an average rating of 4.9/5.” → “rated 4.8/5 on Google (36 reviews) — see the reviews.” (STATS_DISPLAY.en.googleRating + D4 link)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
with an average rating of 4.9/5.
````

**Après**

````text
rated 4.8/5 on Google (36 reviews) — [see the reviews](https://maps.google.com/?cid=14514002506022967350).
````
