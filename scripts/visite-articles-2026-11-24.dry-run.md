# « Programmer une visite » — articles du blog (règle A) : aperçu des modifications SQL

Généré le 2026-11-24T18:16:54.421Z par `scripts/build-slots-sql.mjs` · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-24T18:16:54.414Z · 75 modifications sur 33 articles · SQL : `scripts/visite-articles-2026-11-24.sql`.

Légende : les textes « Avant » sont copiés au caractère près depuis la base (content_fr / content_en, lecture REST anon du 24/11/2026) ; les textes « Après » reprennent les mots du site. Seul le texte des liens change, jamais leur adresse. Mécanisme : A = appel à agir vers notre formulaire (règle A du plan, annexe A). Les phrases de la règle B (notre parcours : « Notre processus de candidature », « Si tu candidates », « avant de candidater ? », « Candidater chez La Villa est entièrement gratuit », « le délai médian entre la candidature et l'emménagement ») et de la règle C (sélection, marché, dossier, permis G, « application fee ») ne sont PAS modifiées (décision du 24/11/2026) ; l'article s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france (B seulement) n'est pas touché.

## Résumé par article

| Article | FR | EN | updated_at en base | fr / en (caractères) |
|---|---|---|---|---|
| `arnaques-logement-frontalier-geneve-eviter` | 1 (A) | 1 (A) | 2026-11-19T11:57:43.20886+00:00 | 12660 / 11495 |
| `assurance-sante-frontalier-lamal-cmu-budget` | 1 (A) | 1 (A) | 2026-11-19T14:26:48.508096+00:00 | 9602 / 9054 |
| `banque-telephone-internet-frontalier-bons-plans` | 1 (A) | 1 (A) | 2026-11-19T11:57:43.20886+00:00 | 10157 / 9417 |
| `budget-colocation-geneve-guide-complet` | 2 (A, A) | 2 (A, A) | 2026-11-24T16:58:38.684155+00:00 | 25344 / 21220 |
| `choc-culturel-franco-suisse-expatrie-geneve` | 1 (A) | 1 (A) | 2026-11-21T10:21:32.19045+00:00 | 10976 / 10315 |
| `coliving-annemasse-geneve-frontaliers-avantages` | 1 (A) | 1 (A) | 2026-11-21T10:21:32.19045+00:00 | 12737 / 11876 |
| `coliving-colocation-ou-studio-geneve-comparatif` | 3 (A, A, A) | 3 (A, A, A) | 2026-11-22T08:32:50.079676+00:00 | 14350 / 13863 |
| `coliving-communaute-reels-amis-geneve-annemasse` | 1 (A) | 1 (A) | 2026-11-24T16:58:24.279782+00:00 | 11078 / 9701 |
| `coliving-frais-dossier-geneve-annemasse` | 1 (A) | 1 (A) | 2026-11-19T11:57:43.20886+00:00 | 8230 / 7318 |
| `coliving-transfrontalier-geneve-annemasse-nouvelle-vie` | 1 (A) | 1 (A) | 2026-11-19T14:27:12.782459+00:00 | 3927 / 3806 |
| `colocation-annemasse-ville-la-grand-ambilly` | 1 (A) | — | 2026-11-21T10:21:32.19045+00:00 | 9097 / 8176 |
| `cout-transport-frontalier-geneve-2026` | 1 (A) | 1 (A) | 2026-11-19T11:57:43.20886+00:00 | 9119 / 8491 |
| `dossier-location-frontalier-suisse-france` | 1 (A) | 1 (A) | 2026-11-20T14:12:50.186527+00:00 | 9077 / 8422 |
| `espaces-verts-coliving-lodge-annemasse` | 1 (A) | 1 (A) | 2026-11-19T11:57:43.20886+00:00 | 3544 / 3259 |
| `fiscalite-frontalier-geneve-impots-2026` | 1 (A) | 1 (A) | 2026-11-20T09:56:59.747586+00:00 | 10727 / 10068 |
| `grand-geneve-2026-nouveautes-frontaliers` | 1 (A) | — | 2026-11-19T11:57:43.20886+00:00 | 8679 / 7512 |
| `guide-ressources-frontalier-geneve` | 1 (A) | 1 (A) | 2026-11-24T16:58:24.279782+00:00 | 40524 / 37361 |
| `ia-solitude-lien-social-coliving` | 1 (A) | 1 (A) | 2026-11-19T14:31:10.186085+00:00 | 11865 / 11130 |
| `living-in-france-working-in-geneva` | 1 (A) | — | 2026-11-21T10:21:32.19045+00:00 | 17699 / 16057 |
| `lodge-annemasse-coliving-premium-portes-geneve` | 2 (A, A) | 2 (A, A) | 2026-11-24T16:58:24.279782+00:00 | 15231 / 13561 |
| `non-la-villa-coliving-nest-pas-une-arnaque` | 2 (A, A) | 2 (A, A) | 2026-10-16T12:42:59.833452+00:00 | 5580 / 5127 |
| `organisations-internationales-geneve-ou-habiter` | 2 (A, A) | 2 (A, A) | 2026-11-20T09:56:59.747586+00:00 | 7456 / 6834 |
| `ou-habiter-en-france-quand-on-travaille-a-geneve` | 1 (A) | 1 (A) | 2026-11-21T10:21:32.19045+00:00 | 15249 / 15080 |
| `ou-habiter-frontalier-suisse-villes-france-pas-cher` | 1 (A) | 1 (A) | 2026-11-12T14:46:34.264977+00:00 | 15422 / 15423 |
| `salaire-suisse-net-frontalier-2026` | 1 (A) | 1 (A) | 2026-11-20T09:56:59.747586+00:00 | 13933 / 11230 |
| `se-faire-reseau-geneve-arriver-seul` | 1 (A) | 1 (A) | 2026-11-19T16:37:46.768178+00:00 | 10722 / 9684 |
| `teletravail-frontalier-geneve-regles-2026` | 1 (A) | 1 (A) | 2026-11-19T11:57:43.20886+00:00 | 11728 / 10836 |
| `temps-trajet-annemasse-geneve-par-quartier` | 1 (A) | 1 (A) | 2026-11-21T10:21:32.19045+00:00 | 9241 / 8630 |
| `transport-annemasse-geneve-leman-express` | 1 (A) | — | 2026-11-19T11:57:43.20886+00:00 | 8452 / 7409 |
| `trouver-colocation-geneve-frontalier` | 2 (A, A) | 1 (A) | 2026-11-21T10:21:32.19045+00:00 | 6303 / 5893 |
| `trouver-logement-avant-d-arriver-geneve` | 1 (A) | 1 (A) | 2026-11-20T09:56:59.747586+00:00 | 14608 / 14109 |
| `vie-quotidienne-frontalier-courses-sport-sorties` | 1 (A) | 1 (A) | 2026-11-19T11:57:43.20886+00:00 | 9468 / 8722 |
| `vivre-a-annemasse-quand-on-travaille-a-geneve` | 1 (A) | 1 (A) | 2026-11-12T21:48:49.13221+00:00 | 12791 / 12488 |

## Détail

### 1. `arnaques-logement-frontalier-geneve-eviter` (fr) · A

annexe A n° 1 · encadré final : « Candidate chez La Villa Coliving » → « Programme une visite chez La Villa Coliving », sur place ou en vidéo

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Candidate chez La Villa Coliving](/candidature) — visite sur place, bail légal, zéro mauvaise surprise.
````

**Après**

````text
[Programme une visite chez La Villa Coliving](/candidature) — sur place ou en vidéo, bail légal, zéro mauvaise surprise.
````

### 2. `arnaques-logement-frontalier-geneve-eviter` (en) · A

appendix A no. 1 · closing box: “Apply to La Villa Coliving” → “Book a visit at La Villa Coliving”, on site or by video

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Apply to La Villa Coliving](/en/candidature) — on-site visits, legal lease, zero nasty surprises.
````

**Après**

````text
[Book a visit at La Villa Coliving](/en/candidature) — on site or by video, legal lease, zero nasty surprises.
````

### 3. `assurance-sante-frontalier-lamal-cmu-budget` (fr) · A

annexe A n° 2 · lien final « postule directement » → « programme une visite »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[postule directement](/candidature)
````

**Après**

````text
[programme une visite](/candidature)
````

### 4. `assurance-sante-frontalier-lamal-cmu-budget` (en) · A

appendix A no. 2 · closing link “apply directly” → “book a visit”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply directly](/en/candidature)
````

**Après**

````text
[book a visit](/en/candidature)
````

### 5. `banque-telephone-internet-frontalier-bons-plans` (fr) · A

annexe A n° 3 · lien final « candidate ici » → « programme une visite »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[candidate ici](/candidature)
````

**Après**

````text
[programme une visite](/candidature)
````

### 6. `banque-telephone-internet-frontalier-bons-plans` (en) · A

appendix A no. 3 · closing link “apply here” → “book a visit”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply here](/en/candidature)
````

**Après**

````text
[book a visit](/en/candidature)
````

### 7. `budget-colocation-geneve-guide-complet` (fr) · A

annexe A n° 4 · « candidater dès maintenant pour figurer sur la liste d'attente » → « te manifester dès maintenant… »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
la meilleure stratégie est de candidater dès maintenant pour figurer sur la liste d'attente
````

**Après**

````text
la meilleure stratégie est de te manifester dès maintenant pour figurer sur la liste d'attente
````

### 8. `budget-colocation-geneve-guide-complet` (fr) · A

annexe A n° 4 · « dépose ta [candidature en 2 minutes] » → « [demande ta visite en 2 minutes] »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
ou dépose ta [candidature en 2 minutes](https://www.lavillacoliving.com/candidature)
````

**Après**

````text
ou [demande ta visite en 2 minutes](https://www.lavillacoliving.com/candidature)
````

### 9. `budget-colocation-geneve-guide-complet` (en) · A

appendix A no. 4 · “apply now to get on the waiting list” → “get in touch now…”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
the best strategy is to apply now to get on the waiting list
````

**Après**

````text
the best strategy is to get in touch now to get on the waiting list
````

### 10. `budget-colocation-geneve-guide-complet` (en) · A

appendix A no. 4 · “submit your [application in 2 minutes]” → “[request your visit in 2 minutes]”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
or submit your [application in 2 minutes](https://www.lavillacoliving.com/en/candidature)
````

**Après**

````text
or [request your visit in 2 minutes](https://www.lavillacoliving.com/en/candidature)
````

### 11. `choc-culturel-franco-suisse-expatrie-geneve` (fr) · A

annexe A n° 5 · lien final « candidate ici » → « programme une visite »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[candidate ici](/candidature)
````

**Après**

````text
[programme une visite](/candidature)
````

### 12. `choc-culturel-franco-suisse-expatrie-geneve` (en) · A

appendix A no. 5 · closing link “apply here” → “book a visit”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply here](/en/candidature)
````

**Après**

````text
[book a visit](/en/candidature)
````

### 13. `coliving-annemasse-geneve-frontaliers-avantages` (fr) · A

annexe A n° 6 · « Postule en 2 minutes » → « Demande ta visite en 2 minutes »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Postule en 2 minutes](/candidature)
````

**Après**

````text
[Demande ta visite en 2 minutes](/candidature)
````

### 14. `coliving-annemasse-geneve-frontaliers-avantages` (en) · A

appendix A no. 6 · “Apply in 2 minutes” → “Request your visit in 2 minutes”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Apply in 2 minutes](/en/candidature)
````

**Après**

````text
[Request your visit in 2 minutes](/en/candidature)
````

### 15. `coliving-colocation-ou-studio-geneve-comparatif` (fr) · A

annexe A n° 7 (1/3) · verdict « nouveau job » : « candidature en deux minutes » → « demande en deux minutes »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
pas dans un magasin de meubles : candidature en deux minutes, réponse sous 48 h
````

**Après**

````text
pas dans un magasin de meubles : demande en deux minutes, réponse sous 48 h
````

### 16. `coliving-colocation-ou-studio-geneve-comparatif` (fr) · A

annexe A n° 7 (2/3) · lien « candidature en deux minutes » → « demande en deux minutes »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[candidature en deux minutes](/candidature)
````

**Après**

````text
[demande en deux minutes](/candidature)
````

### 17. `coliving-colocation-ou-studio-geneve-comparatif` (fr) · A

annexe A n° 7 (3/3) · FAQ « 72 h » : « candidature en deux minutes » → « demande en deux minutes »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
si une chambre est disponible : candidature en deux minutes, réponse sous 48 h
````

**Après**

````text
si une chambre est disponible : demande en deux minutes, réponse sous 48 h
````

### 18. `coliving-colocation-ou-studio-geneve-comparatif` (en) · A

appendix A no. 7 (1/3) · “new job” verdict: “a two-minute application” → “a two-minute request”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
not in a furniture store: a two-minute application, a reply within 48 h
````

**Après**

````text
not in a furniture store: a two-minute request, a reply within 48 h
````

### 19. `coliving-colocation-ou-studio-geneve-comparatif` (en) · A

appendix A no. 7 (2/3) · link “a two-minute application” → “a two-minute request”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[a two-minute application](/en/candidature)
````

**Après**

````text
[a two-minute request](/en/candidature)
````

### 20. `coliving-colocation-ou-studio-geneve-comparatif` (en) · A

appendix A no. 7 (3/3) · “72 h” FAQ: “a two-minute application” → “a two-minute request”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
if a room is available: a two-minute application, a reply within 48 h
````

**Après**

````text
if a room is available: a two-minute request, a reply within 48 h
````

### 21. `coliving-communaute-reels-amis-geneve-annemasse` (fr) · A

annexe A n° 8 · « Candidate dès maintenant » → « Programme une visite dès maintenant »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Candidate dès maintenant](/candidature)
````

**Après**

````text
[Programme une visite dès maintenant](/candidature)
````

### 22. `coliving-communaute-reels-amis-geneve-annemasse` (en) · A

appendix A no. 8 · “Apply now” → “Book a visit now”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Apply now](/en/candidature)
````

**Après**

````text
[Book a visit now](/en/candidature)
````

### 23. `coliving-frais-dossier-geneve-annemasse` (fr) · A

annexe A n° 9 · « candidate en 2 minutes, gratuitement » → « demande ta visite en 2 minutes, gratuitement »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[candidate en 2 minutes, gratuitement](/candidature)
````

**Après**

````text
[demande ta visite en 2 minutes, gratuitement](/candidature)
````

### 24. `coliving-frais-dossier-geneve-annemasse` (en) · A

appendix A no. 9 · “apply in 2 minutes, for free” → “request your visit in 2 minutes, for free”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply in 2 minutes, for free](/en/candidature)
````

**Après**

````text
[request your visit in 2 minutes, for free](/en/candidature)
````

### 25. `coliving-transfrontalier-geneve-annemasse-nouvelle-vie` (fr) · A

annexe A n° 10 · « Postule en 2 minutes » → « Demande ta visite en 2 minutes »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Postule en 2 minutes](/candidature)
````

**Après**

````text
[Demande ta visite en 2 minutes](/candidature)
````

### 26. `coliving-transfrontalier-geneve-annemasse-nouvelle-vie` (en) · A

appendix A no. 10 · “Apply in 2 minutes” → “Request your visit in 2 minutes”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Apply in 2 minutes](/en/candidature)
````

**Après**

````text
[Request your visit in 2 minutes](/en/candidature)
````

### 27. `colocation-annemasse-ville-la-grand-ambilly` (fr) · A

annexe A n° 11 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Candidate en 2 minutes →](/candidature)
````

**Après**

````text
[Demande ta visite en 2 minutes →](/candidature)
````

### 28. `cout-transport-frontalier-geneve-2026` (fr) · A

annexe A n° 12 · « postule en 2 minutes » → « demande ta visite en 2 minutes »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[postule en 2 minutes](/candidature)
````

**Après**

````text
[demande ta visite en 2 minutes](/candidature)
````

### 29. `cout-transport-frontalier-geneve-2026` (en) · A

appendix A no. 12 · “apply in 2 minutes” → “request your visit in 2 minutes”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply in 2 minutes](/en/candidature)
````

**Après**

````text
[request your visit in 2 minutes](/en/candidature)
````

### 30. `dossier-location-frontalier-suisse-france` (fr) · A

annexe A n° 13 · « Candidate chez La Villa Coliving » → « Programme une visite chez La Villa Coliving »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Candidate chez La Villa Coliving](/candidature)
````

**Après**

````text
[Programme une visite chez La Villa Coliving](/candidature)
````

### 31. `dossier-location-frontalier-suisse-france` (en) · A

appendix A no. 13 · “Apply to La Villa Coliving” → “Book a visit at La Villa Coliving”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Apply to La Villa Coliving](/en/candidature)
````

**Après**

````text
[Book a visit at La Villa Coliving](/en/candidature)
````

### 32. `espaces-verts-coliving-lodge-annemasse` (fr) · A

annexe A n° 14 · « postule en 2 minutes » → « demande ta visite en 2 minutes »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[postule en 2 minutes](/candidature)
````

**Après**

````text
[demande ta visite en 2 minutes](/candidature)
````

### 33. `espaces-verts-coliving-lodge-annemasse` (en) · A

appendix A no. 14 · “apply in 2 minutes” → “request your visit in 2 minutes”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply in 2 minutes](/en/candidature)
````

**Après**

````text
[request your visit in 2 minutes](/en/candidature)
````

### 34. `fiscalite-frontalier-geneve-impots-2026` (fr) · A

annexe A n° 15 · « dépose ta [candidature] » → « [programme une visite] »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
ou dépose ta [candidature](/candidature)
````

**Après**

````text
ou [programme une visite](/candidature)
````

### 35. `fiscalite-frontalier-geneve-impots-2026` (en) · A

appendix A no. 15 · “submit your [application]” → “[book a visit]”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
or submit your [application](/en/candidature)
````

**Après**

````text
or [book a visit](/en/candidature)
````

### 36. `grand-geneve-2026-nouveautes-frontaliers` (fr) · A

annexe A n° 16 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Candidate en 2 minutes →](/candidature)
````

**Après**

````text
[Demande ta visite en 2 minutes →](/candidature)
````

### 37. `guide-ressources-frontalier-geneve` (fr) · A

annexe A n° 17 · « candidate en quelques minutes, gratuitement » → « demande ta visite en quelques minutes, gratuitement »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[candidate en quelques minutes, gratuitement](/candidature)
````

**Après**

````text
[demande ta visite en quelques minutes, gratuitement](/candidature)
````

### 38. `guide-ressources-frontalier-geneve` (en) · A

appendix A no. 17 · “apply in a few minutes, for free” → “request your visit in a few minutes, for free” (URL unchanged)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply in a few minutes, for free](/candidature)
````

**Après**

````text
[request your visit in a few minutes, for free](/candidature)
````

### 39. `ia-solitude-lien-social-coliving` (fr) · A

annexe A n° 18 · « candidate en ligne » → « demande une visite en ligne »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[candidate en ligne](/candidature)
````

**Après**

````text
[demande une visite en ligne](/candidature)
````

### 40. `ia-solitude-lien-social-coliving` (en) · A

appendix A no. 18 · “apply online” → “book a visit online”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply online](/en/candidature)
````

**Après**

````text
[book a visit online](/en/candidature)
````

### 41. `living-in-france-working-in-geneva` (fr) · A

annexe A n° 19 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Candidate en 2 minutes →](/candidature)
````

**Après**

````text
[Demande ta visite en 2 minutes →](/candidature)
````

### 42. `lodge-annemasse-coliving-premium-portes-geneve` (fr) · A

annexe A n° 20 · étape 1 : « Tu remplis le [formulaire de candidature]… ton profil… » → « Tu [demandes ta visite en ligne] : prénom, nom, email et téléphone, deux minutes. » (champs obligatoires du formulaire)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Tu remplis le [formulaire de candidature](/candidature) en ligne en présentant ton profil, ta situation professionnelle et tes attentes vis-à-vis de la vie en coliving.
````

**Après**

````text
Tu [demandes ta visite en ligne](/candidature) : prénom, nom, email et téléphone, deux minutes.
````

### 43. `lodge-annemasse-coliving-premium-portes-geneve` (fr) · A

annexe A n° 20 · conclusion : « [candidate directement] pour vérifier la disponibilité » → « [programme une visite] : on vérifie avec toi les chambres disponibles »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
ou [candidate directement](/candidature) pour vérifier la disponibilité des chambres.
````

**Après**

````text
ou [programme une visite](/candidature) : on vérifie avec toi les chambres disponibles.
````

### 44. `lodge-annemasse-coliving-premium-portes-geneve` (en) · A

appendix A no. 20 · step 1: “You fill in the online [application form] presenting your profile…” → “You [book your visit online]: first name, last name, email and phone, two minutes.”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
You fill in the online [application form](/en/candidature) presenting your profile, your professional situation, and what you expect from coliving life.
````

**Après**

````text
You [book your visit online](/en/candidature): first name, last name, email and phone, two minutes.
````

### 45. `lodge-annemasse-coliving-premium-portes-geneve` (en) · A

appendix A no. 20 · conclusion: “[apply directly] to check room availability” → “[book a visit]: we'll check room availability with you”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
or [apply directly](/en/candidature) to check room availability.
````

**Après**

````text
or [book a visit](/en/candidature): we'll check room availability with you.
````

### 46. `non-la-villa-coliving-nest-pas-une-arnaque` (fr) · A

annexe A n° 21 · étape 1 : « Tu [candidates en ligne] » → « Tu [demandes une visite en ligne] »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
1. Tu [candidates en ligne](/candidature), ou tu nous écris.
````

**Après**

````text
1. Tu [demandes une visite en ligne](/candidature), ou tu nous écris.
````

### 47. `non-la-villa-coliving-nest-pas-une-arnaque` (fr) · A

annexe A n° 21 · « Avant de candidater, trois lectures utiles » → « Avant ta visite, trois lectures utiles »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Avant de candidater, trois lectures utiles
````

**Après**

````text
Avant ta visite, trois lectures utiles
````

### 48. `non-la-villa-coliving-nest-pas-une-arnaque` (en) · A

appendix A no. 21 · step 1: “You [apply online]” → “You [book a visit online]”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
1. You [apply online](/en/candidature), or you message us.
````

**Après**

````text
1. You [book a visit online](/en/candidature), or you message us.
````

### 49. `non-la-villa-coliving-nest-pas-une-arnaque` (en) · A

appendix A no. 21 · “Before you apply, three useful reads” → “Before your visit, three useful reads”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Before you apply, three useful reads
````

**Après**

````text
Before your visit, three useful reads
````

### 50. `organisations-internationales-geneve-ou-habiter` (fr) · A

annexe A n° 22 · titre « Comment candidater si tu es en poste OI » → « Comment demander une visite si tu es en poste OI »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
## Comment candidater si tu es en poste OI
````

**Après**

````text
## Comment demander une visite si tu es en poste OI
````

### 51. `organisations-internationales-geneve-ou-habiter` (fr) · A

annexe A n° 22 · « Envoie ta candidature via notre [formulaire en ligne] » → « Demande ta visite via notre [formulaire en ligne] »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Envoie ta candidature via notre [formulaire en ligne](/candidature).
````

**Après**

````text
Demande ta visite via notre [formulaire en ligne](/candidature).
````

### 52. `organisations-internationales-geneve-ou-habiter` (en) · A

appendix A no. 22 · heading “How to apply if you're in an IO position” → “How to book a visit if you're in an IO position”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
## How to apply if you're in an IO position
````

**Après**

````text
## How to book a visit if you're in an IO position
````

### 53. `organisations-internationales-geneve-ou-habiter` (en) · A

appendix A no. 22 · “Submit your application via our [online form]” → “Request your visit via our [online form]”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
Submit your application via our [online form](/en/candidature).
````

**Après**

````text
Request your visit via our [online form](/en/candidature).
````

### 54. `ou-habiter-en-france-quand-on-travaille-a-geneve` (fr) · A

annexe A n° 23 · « [la candidature se fait à distance] » → « [la visite peut se faire en vidéo] »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
et [la candidature se fait à distance](/candidature).
````

**Après**

````text
et [la visite peut se faire en vidéo](/candidature).
````

### 55. `ou-habiter-en-france-quand-on-travaille-a-geneve` (en) · A

appendix A no. 23 · “[you can apply remotely]” → “[you can visit by video]”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
and [you can apply remotely](/en/candidature).
````

**Après**

````text
and [you can visit by video](/en/candidature).
````

### 56. `ou-habiter-frontalier-suisse-villes-france-pas-cher` (fr) · A

annexe A n° 24 · « la [candidature prend deux minutes] » → « la [demande de visite prend deux minutes] » (comme /tarifs)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
la [candidature prend deux minutes](/candidature)
````

**Après**

````text
la [demande de visite prend deux minutes](/candidature)
````

### 57. `ou-habiter-frontalier-suisse-villes-france-pas-cher` (en) · A

appendix A no. 24 · “the [application takes two minutes]” → “the [visit request takes two minutes]”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
the [application takes two minutes](/en/candidature)
````

**Après**

````text
the [visit request takes two minutes](/en/candidature)
````

### 58. `salaire-suisse-net-frontalier-2026` (fr) · A

annexe A n° 26 · « Postule en 2 min » → « Demande ta visite en 2 min »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Postule en 2 min](/candidature)
````

**Après**

````text
[Demande ta visite en 2 min](/candidature)
````

### 59. `salaire-suisse-net-frontalier-2026` (en) · A

appendix A no. 26 · “Apply in 2 min” → “Request your visit in 2 min”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Apply in 2 min](/en/candidature)
````

**Après**

````text
[Request your visit in 2 min](/en/candidature)
````

### 60. `se-faire-reseau-geneve-arriver-seul` (fr) · A

annexe A n° 27 · lien final « candidate ici » → « programme une visite »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[candidate ici](/candidature)
````

**Après**

````text
[programme une visite](/candidature)
````

### 61. `se-faire-reseau-geneve-arriver-seul` (en) · A

appendix A no. 27 · closing link “apply here” → “book a visit”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply here](/en/candidature)
````

**Après**

````text
[book a visit](/en/candidature)
````

### 62. `teletravail-frontalier-geneve-regles-2026` (fr) · A

annexe A n° 28 · lien final « postule » → « programme une visite »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[postule](/candidature)
````

**Après**

````text
[programme une visite](/candidature)
````

### 63. `teletravail-frontalier-geneve-regles-2026` (en) · A

appendix A no. 28 · closing link “apply” → “book a visit”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply](/en/candidature)
````

**Après**

````text
[book a visit](/en/candidature)
````

### 64. `temps-trajet-annemasse-geneve-par-quartier` (fr) · A

annexe A n° 29 · lien final « postule directement » → « programme une visite »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[postule directement](/candidature)
````

**Après**

````text
[programme une visite](/candidature)
````

### 65. `temps-trajet-annemasse-geneve-par-quartier` (en) · A

appendix A no. 29 · closing link “apply directly” → “book a visit”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply directly](/en/candidature)
````

**Après**

````text
[book a visit](/en/candidature)
````

### 66. `transport-annemasse-geneve-leman-express` (fr) · A

annexe A n° 30 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Candidate en 2 minutes →](/candidature)
````

**Après**

````text
[Demande ta visite en 2 minutes →](/candidature)
````

### 67. `trouver-colocation-geneve-frontalier` (fr) · A

annexe A n° 31 · intro : « voir les chambres libres et candidater » → « … et programmer une visite » (ancre exacte du lien inchangée)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
voir les chambres libres et candidater, va sur notre page [colocation à Genève côté France](/colocation-geneve)
````

**Après**

````text
voir les chambres libres et programmer une visite, va sur notre page [colocation à Genève côté France](/colocation-geneve)
````

### 68. `trouver-colocation-geneve-frontalier` (fr) · A

annexe A n° 31 · « postule en 2 minutes » → « demande ta visite en 2 minutes » (adresse ?src=bloc_offre inchangée)

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)
````

**Après**

````text
[demande ta visite en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)
````

### 69. `trouver-colocation-geneve-frontalier` (en) · A

appendix A no. 31 · “Apply in 2 minutes” → “Request your visit in 2 minutes”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[Apply in 2 minutes](/en/candidature)
````

**Après**

````text
[Request your visit in 2 minutes](/en/candidature)
````

### 70. `trouver-logement-avant-d-arriver-geneve` (fr) · A

annexe A n° 32 · « [la candidature se remplit à distance], avant même la première visite » → « [la visite peut se faire en vidéo], avant même ton arrivée »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
et [la candidature se remplit à distance](/candidature), avant même la première visite.
````

**Après**

````text
et [la visite peut se faire en vidéo](/candidature), avant même ton arrivée.
````

### 71. `trouver-logement-avant-d-arriver-geneve` (en) · A

appendix A no. 32 · “[the application can be done remotely], before you've even had a viewing” → “[the visit can be done by video], before you even arrive”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
and [the application can be done remotely](/en/candidature), before you've even had a viewing.
````

**Après**

````text
and [the visit can be done by video](/en/candidature), before you even arrive.
````

### 72. `vie-quotidienne-frontalier-courses-sport-sorties` (fr) · A

annexe A n° 33 · lien final « candidate ici » → « programme une visite »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[candidate ici](/candidature)
````

**Après**

````text
[programme une visite](/candidature)
````

### 73. `vie-quotidienne-frontalier-courses-sport-sorties` (en) · A

appendix A no. 33 · closing link “apply here” → “book a visit”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
[apply here](/en/candidature)
````

**Après**

````text
[book a visit](/en/candidature)
````

### 74. `vivre-a-annemasse-quand-on-travaille-a-geneve` (fr) · A

annexe A n° 34 · « la [candidature prend deux minutes] » → « la [demande de visite prend deux minutes] »

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
la [candidature prend deux minutes](/candidature)
````

**Après**

````text
la [demande de visite prend deux minutes](/candidature)
````

### 75. `vivre-a-annemasse-quand-on-travaille-a-geneve` (en) · A

appendix A no. 34 · “the [application takes two minutes]” → “the [visit request takes two minutes]”

Occurrences de l'ancre en base : 1 (attendu 1) · nouveau texte déjà présent : 0 (attendu 0) · garde « nouveau absent » : oui

**Avant**

````text
the [application takes two minutes](/en/candidature)
````

**Après**

````text
the [visit request takes two minutes](/en/candidature)
````
