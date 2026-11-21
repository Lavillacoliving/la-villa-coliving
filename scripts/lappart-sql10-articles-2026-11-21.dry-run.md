# L'Appart — SQL n° 10, phrases d'articles : aperçu des substitutions

Généré le 2026-11-21T09:46:16.265Z par `scripts/build-slots-sql.mjs` · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-21T09:46:16.263Z · 29 modifications sur 11 articles · SQL : `scripts/lappart-sql10-articles-2026-11-21.sql`.

Légende : « Avant » = texte vivant du 21/11/2026 ; « Après » = texte avec L'Appart (jetons de prix résolus par le site à l'affichage).

## Résumé par article

| Article | FR | EN | updated_at en base | fr / en (caractères) |
|---|---|---|---|---|
| `budget-colocation-geneve-guide-complet` | 1 (phrase) | 1 (phrase) | 2026-11-20T09:56:59.747586+00:00 | 18797 / 14812 |
| `choc-culturel-franco-suisse-expatrie-geneve` | — | 1 (phrase) | 2026-11-19T11:57:43.20886+00:00 | 10976 / 10307 |
| `coliving-annemasse-geneve-frontaliers-avantages` | 1 (phrase) | 1 (phrase) | 2026-11-19T11:57:43.20886+00:00 | 12605 / 11749 |
| `coliving-colocation-ou-studio-geneve-comparatif` | 1 (phrase) | 1 (phrase) | 2026-11-12T21:48:49.13221+00:00 | 14297 / 13809 |
| `coliving-geneve-frontaliers-guide-complet` | 1 (phrase) | 1 (phrase) | 2026-11-19T14:27:12.782459+00:00 | 9584 / 8627 |
| `colocation-annemasse-ville-la-grand-ambilly` | 2 (phrase, phrase) | 2 (phrase, phrase) | 2026-11-20T09:56:59.747586+00:00 | 8756 / 7825 |
| `living-in-france-working-in-geneva` | 1 (phrase) | 1 (phrase) | 2026-11-19T11:57:43.20886+00:00 | 17559 / 15941 |
| `ou-habiter-en-france-quand-on-travaille-a-geneve` | 2 (phrase, phrase) | 2 (phrase, phrase) | 2026-11-20T09:56:59.747586+00:00 | 14933 / 14750 |
| `quartiers-annemasse-ou-vivre-selon-profil` | 1 (phrase) | 1 (phrase) | 2026-11-19T11:57:43.20886+00:00 | 10138 / 9036 |
| `temps-trajet-annemasse-geneve-par-quartier` | 1 (phrase) | 1 (phrase) | 2026-11-19T11:57:43.20886+00:00 | 9229 / 8616 |
| `trouver-colocation-geneve-frontalier` | 3 (phrase, phrase, phrase) | 3 (phrase, phrase, phrase) | 2026-11-20T09:56:59.747586+00:00 | 5983 / 5598 |

## Détail

### 1. `coliving-annemasse-geneve-frontaliers-avantages` (fr) · phrase

encart d'appel : L'Appart d'abord, puis les 3 maisons de coliving

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse
````

**Après**

````text
À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **730 CHF/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **1 290 CHF/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse
````

### 2. `coliving-annemasse-geneve-frontaliers-avantages` (en) · phrase

call-out: L'Appart first, then the 3 coliving houses

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse
````

**Après**

````text
At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **CHF 730/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **CHF 1,290/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse
````

### 3. `colocation-annemasse-ville-la-grand-ambilly` (fr) · phrase

encart d'appel : L'Appart d'abord, puis les 3 maisons de coliving

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse
````

**Après**

````text
À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **730 CHF/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **1 290 CHF/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse
````

### 4. `colocation-annemasse-ville-la-grand-ambilly` (en) · phrase

call-out: L'Appart first, then the 3 coliving houses

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse
````

**Après**

````text
At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **CHF 730/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **CHF 1,290/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse
````

### 5. `colocation-annemasse-ville-la-grand-ambilly` (fr) · phrase

phrase de commune de L'Appart après celle du Lodge (« Annemasse centre »)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.
````

**Après**

````text
À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte. Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte.
````

### 6. `colocation-annemasse-ville-la-grand-ambilly` (en) · phrase

L'Appart's local sentence after Le Lodge's (« Annemasse center »)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.
````

**Après**

````text
In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.
````

### 7. `coliving-geneve-frontaliers-guide-complet` (fr) · phrase

présentation de l'offre : 3 maisons de coliving, puis L'Appart

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
— 29 chambres privées meublées dans 3 maisons (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.
````

**Après**

````text
— 29 chambres privées meublées dans 3 maisons de coliving (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare, 4 chambres dès **{{PRIX_APPART_DES}}/mois**, sans frais de dossier.
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
— 29 chambres privées meublées dans 3 maisons de coliving (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **1 290 CHF/mois**, et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare, 4 chambres dès **730 CHF/mois**, sans frais de dossier.
````

### 8. `coliving-geneve-frontaliers-guide-complet` (en) · phrase

offer: 3 coliving houses, then L'Appart

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
— 29 private furnished rooms across 3 houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, no application fee.
````

**Après**

````text
— 29 private furnished rooms across 3 coliving houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, and [L'Appart](/en/lappart), a flatshare in Annemasse near the station, 4 rooms from **{{PRIX_APPART_DES}}/month**, no application fee.
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
— 29 private furnished rooms across 3 coliving houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **CHF 1,290/month**, and [L'Appart](/en/lappart), a flatshare in Annemasse near the station, 4 rooms from **CHF 730/month**, no application fee.
````

### 9. `living-in-france-working-in-geneva` (fr) · phrase

inventaire de la marque : L'Appart après les 3 maisons, sans piscine

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés.
````

**Après**

````text
les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés. Et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare : un appartement de 4 chambres, sans piscine, sauna ni salle de sport.
````

### 10. `living-in-france-working-in-geneva` (en) · phrase

brand inventory: L'Appart after the 3 houses, no pool

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
the shared spaces (living room, kitchen, pool, sauna, gym) are communal.
````

**Après**

````text
the shared spaces (living room, kitchen, pool, sauna, gym) are communal. And [L'Appart](/en/lappart), a flatshare in Annemasse, near the station: a 4-room flat, with no pool, sauna or gym.
````

### 11. `temps-trajet-annemasse-geneve-par-quartier` (fr) · phrase

29 chambres = les maisons

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
C'est là que se trouvent 10 des 29 chambres de La Villa Coliving.
````

**Après**

````text
C'est là que se trouvent 10 des 29 chambres des maisons de La Villa Coliving.
````

### 12. `temps-trajet-annemasse-geneve-par-quartier` (en) · phrase

29 rooms = the houses

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
It's home to 10 of La Villa Coliving's 29 rooms.
````

**Après**

````text
It's home to 10 of the 29 rooms in La Villa Coliving's houses.
````

### 13. `trouver-colocation-geneve-frontalier` (fr) · phrase

budget : L'Appart entre la location classique et le coliving (prix en jetons, euros à part)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Pour cadrer ton budget précisément selon ton salaire
````

**Après**

````text
Entre les deux, [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare, loue ses chambres dès {{PRIX_APPART_DES}} par mois, charges comprises. En euros : dès {{PRIX_APPART_DES_EUR}}. Pour cadrer ton budget précisément selon ton salaire
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
Entre les deux, [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare, loue ses chambres dès 730 CHF par mois, charges comprises. En euros : dès 790 €. Pour cadrer ton budget précisément selon ton salaire
````

### 14. `trouver-colocation-geneve-frontalier` (en) · phrase

budget: L'Appart between a classic rental and coliving (token prices, euros apart)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
To frame your budget precisely by salary
````

**Après**

````text
In between, [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station, lets its rooms from {{PRIX_APPART_DES}} a month, bills included. In euros: from {{PRIX_APPART_DES_EUR}}. To frame your budget precisely by salary
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
In between, [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station, lets its rooms from CHF 730 a month, bills included. In euros: from €790. To frame your budget precisely by salary
````

### 15. `trouver-colocation-geneve-frontalier` (fr) · phrase

les maisons sont des maisons de coliving

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
tout inclus dans trois maisons situées côté France
````

**Après**

````text
tout inclus dans trois maisons de coliving situées côté France
````

### 16. `trouver-colocation-geneve-frontalier` (en) · phrase

the houses are coliving houses

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
all-inclusive shared rooms in three houses located on the French side
````

**Après**

````text
all-inclusive shared rooms in three coliving houses located on the French side
````

### 17. `trouver-colocation-geneve-frontalier` (fr) · phrase

la colocation de la marque : L'Appart, sans prix ici (le prix est plus haut)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
À partir de {{PRIX_DES}}/mois.
````

**Après**

````text
À partir de {{PRIX_DES}}/mois. Et [L'Appart](/lappart), notre colocation de 4 chambres à Annemasse, quartier de la gare.
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
À partir de 1 290 CHF/mois. Et [L'Appart](/lappart), notre colocation de 4 chambres à Annemasse, quartier de la gare.
````

### 18. `trouver-colocation-geneve-frontalier` (en) · phrase

the brand's flatshare: L'Appart, no price here (given above)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
From {{PRIX_DES}}/month.
````

**Après**

````text
From {{PRIX_DES}}/month. And [L'Appart](/en/lappart), our 4-room flatshare in Annemasse, near the station.
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
From CHF 1,290/month. And [L'Appart](/en/lappart), our 4-room flatshare in Annemasse, near the station.
````

### 19. `choc-culturel-franco-suisse-expatrie-geneve` (en) · phrase

alignment: the 29 rooms are the houses' (the French already says so)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
That's what La Villa Coliving offers: 29 rooms in three houses on the French side
````

**Après**

````text
That's what La Villa Coliving's houses offer: 29 rooms in three houses on the French side
````

### 20. `budget-colocation-geneve-guide-complet` (fr) · phrase

budget : L'Appart entre la colocation classique et le coliving (euros à part)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
**Pas encore de fiche de salaire suisse ?**
````

**Après**

````text
Entre la colocation classique et le coliving, il y a aussi [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, dans le quartier de la gare : 4 chambres meublées dès {{PRIX_APPART_DES}} par mois, charges, fibre, streaming et ménage des communs compris. En euros : dès {{PRIX_APPART_DES_EUR}}.

**Pas encore de fiche de salaire suisse ?**
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
Entre la colocation classique et le coliving, il y a aussi [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, dans le quartier de la gare : 4 chambres meublées dès 730 CHF par mois, charges, fibre, streaming et ménage des communs compris. En euros : dès 790 €.

**Pas encore de fiche de salaire suisse ?**
````

### 21. `budget-colocation-geneve-guide-complet` (en) · phrase

budget: L'Appart between a standard flatshare and coliving (euros apart)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
**No Swiss payslip yet?**
````

**Après**

````text
Between a standard flatshare and coliving, there's also [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: 4 furnished rooms from {{PRIX_APPART_DES}} a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros: from {{PRIX_APPART_DES_EUR}}.

**No Swiss payslip yet?**
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
Between a standard flatshare and coliving, there's also [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: 4 furnished rooms from CHF 730 a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros: from €790.

**No Swiss payslip yet?**
````

### 22. `quartiers-annemasse-ou-vivre-selon-profil` (fr) · phrase

profil 1 : la phrase de commune de L'Appart avant « Tu commandes ton train »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Tu commandes ton train, pas l'inverse.
````

**Après**

````text
Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte. Tu commandes ton train, pas l'inverse.
````

### 23. `quartiers-annemasse-ou-vivre-selon-profil` (en) · phrase

profile 1: L'Appart's local sentence at the end of « Where to aim »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
door to door.

**The real test:** measure the actual walking time
````

**Après**

````text
door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.

**The real test:** measure the actual walking time
````

### 24. `ou-habiter-en-france-quand-on-travaille-a-geneve` (fr) · phrase

profil 4 (budget serré) : L'Appart, forme compacte CHF/€ des pages de décision

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Pour un premier poste, deux pièges reviennent
````

**Après**

````text
Si ton budget est vraiment serré, regarde [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare : des chambres dès {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} par mois, charges, fibre, streaming et ménage des communs compris.

Pour un premier poste, deux pièges reviennent
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
Si ton budget est vraiment serré, regarde [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare : des chambres dès 730 CHF/790 € par mois, charges, fibre, streaming et ménage des communs compris.

Pour un premier poste, deux pièges reviennent
````

### 25. `ou-habiter-en-france-quand-on-travaille-a-geneve` (en) · phrase

profile 4 (tight budget): L'Appart, compact CHF/€ form of decision pages

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
For a first job, two traps come up again and again
````

**Après**

````text
If your budget is really tight, have a look at [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: rooms from {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} a month, with bills, fibre, streaming and cleaning of the shared areas included.

For a first job, two traps come up again and again
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
If your budget is really tight, have a look at [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: rooms from CHF 730/€790 a month, with bills, fibre, streaming and cleaning of the shared areas included.

For a first job, two traps come up again and again
````

### 26. `coliving-colocation-ou-studio-geneve-comparatif` (fr) · phrase

couples : la suite de L'Appart se loue à deux (page de décision)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Un couple qui veut partager une seule chambre, ou une famille, a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Chez nous, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres.
````

**Après**

````text
Une famille a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Dans nos maisons, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres, ou partager la suite de [L'Appart](/lappart), notre colocation à Annemasse, quartier de la gare.
````

### 27. `coliving-colocation-ou-studio-geneve-comparatif` (en) · phrase

couples: L'Appart's suite is let to two people (decision page)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
A couple who want to share a single room, or a family, need a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). With us, each room is let to one person; a couple can come by taking two rooms.
````

**Après**

````text
A family needs a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). In our houses, each room is let to one person; a couple can come by taking two rooms, or share the suite at [L'Appart](/en/lappart), our flatshare in Annemasse, near the station.
````

### 28. `ou-habiter-en-france-quand-on-travaille-a-geneve` (fr) · phrase

couples : la règle « une chambre, une personne » est celle des maisons (page de décision)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
chez nous, une chambre accueille une seule personne (un couple peut en prendre deux).
````

**Après**

````text
dans nos maisons, une chambre accueille une seule personne (un couple peut en prendre deux), et à L'Appart, seule la suite se loue à deux.
````

### 29. `ou-habiter-en-france-quand-on-travaille-a-geneve` (en) · phrase

couples: « one room, one person » is the houses' rule (decision page)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
with us, each room is for one person (a couple can take two).
````

**Après**

````text
in our houses, each room is for one person (a couple can take two), and at L'Appart only the suite is let to two people.
````
