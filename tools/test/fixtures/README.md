# Fixtures synthétiques

Données INVENTÉES pour `node --test tools/test/` (aucune donnée Search Console réelle).

- `csv-en/` export UI anglais (France, 3 mois, fenêtre via Chart.csv)
- `csv-fr/` export UI français (Suisse, 28 jours), Requêtes.csv avec BOM + CRLF
- `csv-compare/` export comparé 9 colonnes (Suisse, 2 périodes)
- `csv-queryfilter/` export filtré sur une requête (watchlist seulement)
- `sonde-*.json` réponses Search Analytics API sous 4 formes (+ requête seule)

Exception (L'Appart, brief du 12/11/2026) : deux relevés de la vue publique `v_public_rooms` (les 18 colonnes que le site lit
déjà, ni adresse, ni nom de personne, ni clé), pour les sélecteurs de chambres et les gardes par gamme.

- `v_public_rooms.etat-A.json` : la vue avant L'Appart (29 lignes : La Villa 10, Le Lodge 12, Le Loft 7), prix du
  13/11/2026 (chambres 7 et 8 de La Villa à 1 380 € / 1 290 CHF). Disponibilités du 13/11/2026 : un test qui a besoin
  d'un état précis le fixe lui-même.
- `v_public_rooms.etat-B.json` : la même, puis les 4 lignes de L'Appart après la bascule (chambres 2, 3, 4 et la suite
  n° 5 ; occupées, libres dans le mois d'ouverture, sans étage). Lignes simulées, pas encore en base. Leur jour
  (`available_from`) est FICTIF : le site ne publie que le mois d'ouverture (V2-22, 19/11/2026) ; un jour qui fuirait dans
  une page se lirait dans les tests.
