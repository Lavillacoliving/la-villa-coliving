# Prix des chambres 7 et 8 — SQL 3 bis : fourchettes en jetons (13/11/2026)

Généré le 2026-11-19T16:45:25.843Z par `scripts/build-slots-sql.mjs` · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-19T16:45:25.840Z · 30 modifications sur 11 articles · SQL : `scripts/prix-chambres-7-8-sql3bis-fourchettes-2026-11-20.sql`.

Légende : « Avant » = texte posé par le SQL 3 ; « Après » = le même texte avec le jeton ; « Rendu sur le site » = identique à « Avant ».

## Résumé par article

| Article | FR | EN | updated_at en base | fr / en (caractères) |
|---|---|---|---|---|
| `budget-colocation-geneve-guide-complet` | 4 (jeton, jeton, jeton, jeton) | 4 (jeton, jeton, jeton, jeton) | 2026-11-19T14:26:48.508096+00:00 | 18773 / 14790 |
| `colocation-annemasse-ville-la-grand-ambilly` | 1 (jeton) | 1 (jeton) | 2026-11-19T14:26:48.508096+00:00 | 8746 / 7815 |
| `cout-de-la-vie-suisse-france-frontalier-2026` | 2 (jeton, jeton) | 2 (jeton, jeton) | 2026-11-19T14:26:48.508096+00:00 | 13257 / 11925 |
| `dossier-location-frontalier-suisse-france` | 1 (jeton) | 1 (jeton) | 2026-11-19T14:26:48.508096+00:00 | 9011 / 8361 |
| `fiscalite-frontalier-geneve-impots-2026` | 1 (jeton) | 1 (jeton) | 2026-11-19T14:26:48.508096+00:00 | 10725 / 10067 |
| `guide-ressources-frontalier-geneve` | 1 (jeton) | 1 (jeton) | 2026-11-19T14:26:48.508096+00:00 | 40438 / 37285 |
| `organisations-internationales-geneve-ou-habiter` | 1 (jeton) | 1 (jeton) | 2026-11-19T14:26:48.508096+00:00 | 7446 / 6824 |
| `ou-habiter-en-france-quand-on-travaille-a-geneve` | 1 (jeton) | 1 (jeton) | 2026-11-19T14:26:48.508096+00:00 | 14931 / 14749 |
| `salaire-suisse-net-frontalier-2026` | 1 (jeton) | 1 (jeton) | 2026-11-19T14:26:48.508096+00:00 | 13931 / 11229 |
| `trouver-colocation-geneve-frontalier` | 1 (jeton) | 1 (jeton) | 2026-11-19T14:26:48.508096+00:00 | 5981 / 5597 |
| `trouver-logement-avant-d-arriver-geneve` | 1 (jeton) | 1 (jeton) | 2026-11-19T14:26:48.508096+00:00 | 14606 / 14108 |

## Détail

### 1. `budget-colocation-geneve-guide-complet` (fr) · jeton

fourchette en clair → jeton (ligne « coliving » du tableau des loyers)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
La Villa Coliving | — | — | 1 290 – 1 430 CHF |
````

**Après**

````text
La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
La Villa Coliving | — | — | 1 290 – 1 430 CHF |
````

### 2. `budget-colocation-geneve-guide-complet` (en) · jeton

fourchette en clair → jeton (ligne « coliving » du tableau des loyers)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
La Villa Coliving | — | — | 1,290 – 1,430 CHF |
````

**Après**

````text
La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
La Villa Coliving | — | — | 1,290 – 1,430 CHF |
````

### 3. `budget-colocation-geneve-guide-complet` (fr) · jeton

fourchette en clair → jeton (créneau vérifié par check:slots (budgetVariantText))

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving
````

**Après**

````text
Chambre en coliving côté France : {{PRIX_FOURCHETTE}} tout inclus chez La Villa Coliving
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving
````

### 4. `budget-colocation-geneve-guide-complet` (en) · jeton

fourchette en clair → jeton (créneau vérifié par check:slots (budgetVariantText))

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving
````

**Après**

````text
Coliving room on the French side: {{PRIX_FOURCHETTE}} all inclusive at La Villa Coliving
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving
````

### 5. `budget-colocation-geneve-guide-complet` (fr) · jeton

fourchette en clair → jeton (ligne Ville-la-Grand du tableau par commune (La Villa : trois paliers))

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
| 500 – 700 € | 1 290 – 1 430 CHF |
````

**Après**

````text
| 500 – 700 € | {{PRIX_FOURCHETTE_TABLEAU}} |
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
| 500 – 700 € | 1 290 – 1 430 CHF |
````

### 6. `budget-colocation-geneve-guide-complet` (en) · jeton

fourchette en clair → jeton (ligne Ville-la-Grand du tableau par commune (La Villa : trois paliers))

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
| 500–700 € | 1,290 – 1,430 CHF |
````

**Après**

````text
| 500–700 € | {{PRIX_FOURCHETTE_TABLEAU}} |
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
| 500–700 € | 1,290 – 1,430 CHF |
````

### 7. `colocation-annemasse-ville-la-grand-ambilly` (fr) · jeton

fourchette en clair → jeton (ligne « coliving » du tableau des prix)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |
````

**Après**

````text
| Coliving premium tout compris | {{PRIX_FOURCHETTE_TABLEAU}}/mois |
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |
````

### 8. `colocation-annemasse-ville-la-grand-ambilly` (en) · jeton

fourchette en clair → jeton (ligne « coliving » du tableau des prix)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |
````

**Après**

````text
| All-inclusive premium coliving | {{PRIX_FOURCHETTE_TABLEAU}}/month |
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |
````

### 9. `cout-de-la-vie-suisse-france-frontalier-2026` (fr) · jeton

fourchette en clair → jeton (créneau vérifié par check:slots (coutDeLaVieRowLabel))

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier
````

**Après**

````text
ex. La Villa Coliving : {{PRIX_FOURCHETTE}} tout inclus, 0 € de frais de dossier
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier
````

### 10. `cout-de-la-vie-suisse-france-frontalier-2026` (en) · jeton

fourchette en clair → jeton (créneau vérifié par check:slots (coutDeLaVieRowLabel))

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee
````

**Après**

````text
e.g. La Villa Coliving: {{PRIX_FOURCHETTE}} all inclusive, no application fee
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee
````

### 11. `dossier-location-frontalier-suisse-france` (fr) · jeton

fourchette en clair → jeton (créneau vérifié par check:slots (adminSlot:dossier))

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier
````

**Après**

````text
Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier
````

### 12. `dossier-location-frontalier-suisse-france` (en) · jeton

fourchette en clair → jeton (créneau vérifié par check:slots (adminSlot:dossier))

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file
````

**Après**

````text
Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file
````

### 13. `fiscalite-frontalier-geneve-impots-2026` (fr) · jeton

fourchette en clair → jeton (créneau vérifié par check:slots (adminSlot:fiscalite))

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre
````

**Après**

````text
(chez La Villa Coliving, {{PRIX_FOURCHETTE}} par mois pour une chambre
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre
````

### 14. `fiscalite-frontalier-geneve-impots-2026` (en) · jeton

fourchette en clair → jeton (créneau vérifié par check:slots (adminSlot:fiscalite))

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room
````

**Après**

````text
(at La Villa Coliving, {{PRIX_FOURCHETTE}} a month for a room
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room
````

### 15. `organisations-internationales-geneve-ou-habiter` (fr) · jeton

fourchette en clair → jeton (ligne « coliving » du tableau des options)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |
````

**Après**

````text
(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, tout inclus |
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |
````

### 16. `organisations-internationales-geneve-ou-habiter` (en) · jeton

fourchette en clair → jeton (ligne « coliving » du tableau des options)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |
````

**Après**

````text
(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, all inclusive |
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |
````

### 17. `ou-habiter-en-france-quand-on-travaille-a-geneve` (fr) · jeton

fourchette en clair → jeton (phrase du guide)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
pour une personne de 1 290 à 1 430 CHF par mois tout inclus
````

**Après**

````text
pour une personne de {{PRIX_FOURCHETTE}} par mois tout inclus
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
pour une personne de 1 290 à 1 430 CHF par mois tout inclus
````

### 18. `ou-habiter-en-france-quand-on-travaille-a-geneve` (en) · jeton

fourchette en clair → jeton (phrase du guide)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive
````

**Après**

````text
furnished single rooms at {{PRIX_FOURCHETTE}} a month, all inclusive
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive
````

### 19. `salaire-suisse-net-frontalier-2026` (fr) · jeton

fourchette en clair → jeton (phrase du coliving tout inclus)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
coliving tout inclus (1 290 à 1 430 CHF par mois)
````

**Après**

````text
coliving tout inclus ({{PRIX_FOURCHETTE}} par mois)
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
coliving tout inclus (1 290 à 1 430 CHF par mois)
````

### 20. `salaire-suisse-net-frontalier-2026` (en) · jeton

fourchette en clair → jeton (phrase du coliving tout inclus)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
all-inclusive coliving (CHF 1,290 to 1,430 a month)
````

**Après**

````text
all-inclusive coliving ({{PRIX_FOURCHETTE}} a month)
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
all-inclusive coliving (CHF 1,290 to 1,430 a month)
````

### 21. `trouver-logement-avant-d-arriver-geneve` (fr) · jeton

fourchette en clair → jeton (phrase du guide)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus
````

**Après**

````text
porte-à-porte, pour {{PRIX_FOURCHETTE}} par mois tout inclus
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus
````

### 22. `trouver-logement-avant-d-arriver-geneve` (en) · jeton

fourchette en clair → jeton (phrase du guide)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
door to door, for CHF 1,290 to 1,430 a month all inclusive
````

**Après**

````text
door to door, for {{PRIX_FOURCHETTE}} a month all inclusive
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
door to door, for CHF 1,290 to 1,430 a month all inclusive
````

### 23. `budget-colocation-geneve-guide-complet` (fr) · jeton

fourchette en clair → jeton (taux de change : fourchette en francs et loyer contractuel en euros)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros
````

**Après**

````text
un loyer de {{PRIX_FOURCHETTE}} correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de 1 380 € à 1 530 €, libellé en euros
````

### 24. `budget-colocation-geneve-guide-complet` (en) · jeton

fourchette en clair → jeton (exchange rate: range in francs and contractual rent in euros)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros
````

**Après**

````text
a {{PRIX_FOURCHETTE}} rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
a CHF 1,290 to 1,430 rent corresponds to a contractual rent of €1,380 to €1,530, set in euros
````

### 25. `guide-ressources-frontalier-geneve` (fr) · jeton

fourchette en clair → jeton (« se situe autour de 1 370 CHF » → la fourchette des maisons)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
— coûte de 1 290 à 1 430 CHF par mois.)*
````

**Après**

````text
— coûte de {{PRIX_FOURCHETTE}} par mois.)*
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
— coûte de 1 290 à 1 430 CHF par mois.)*
````

### 26. `guide-ressources-frontalier-geneve` (en) · jeton

fourchette en clair → jeton ("sits around 1,370 CHF" → the houses' price range)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
— costs CHF 1,290 to 1,430 a month.)*
````

**Après**

````text
— costs {{PRIX_FOURCHETTE}} a month.)*
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
— costs CHF 1,290 to 1,430 a month.)*
````

### 27. `trouver-colocation-geneve-frontalier` (fr) · jeton

fourchette en clair → jeton (« ou autour de 1 370 CHF » → la fourchette des maisons)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
ou de 1 290 à 1 430 CHF tout inclus en coliving premium
````

**Après**

````text
ou de {{PRIX_FOURCHETTE}} tout inclus en coliving premium
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
ou de 1 290 à 1 430 CHF tout inclus en coliving premium
````

### 28. `trouver-colocation-geneve-frontalier` (en) · jeton

fourchette en clair → jeton ("or around 1,370 CHF" → the houses' price range)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
or CHF 1,290 to 1,430 all-inclusive in premium coliving
````

**Après**

````text
or {{PRIX_FOURCHETTE}} all-inclusive in premium coliving
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
or CHF 1,290 to 1,430 all-inclusive in premium coliving
````

### 29. `cout-de-la-vie-suisse-france-frontalier-2026` (fr) · jeton

fourchette en clair → jeton (loyer pris pour le calcul (fourchette) et total des dépenses)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.
````

**Après**

````text
côté France, {{PRIX_FOURCHETTE}} par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.
````

### 30. `cout-de-la-vie-suisse-france-frontalier-2026` (en) · jeton

fourchette en clair → jeton (rent used for the maths (range) and total spending)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.
````

**Après**

````text
on the French side, {{PRIX_FOURCHETTE}} a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.
````

**Rendu sur le site** (jetons résolus par `src/lib/contentTokens.ts`)

````text
on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.
````
