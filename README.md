# la-villa-coliving

Site web de coliving près de Genève

## Mettre à jour la LP payante (« blast » de chambres)

Pages concernées : `/chambres-septembre` et `/en/rooms-september`. **Tout se passe dans
[`src/data/roomsSeptembre.ts`](src/data/roomsSeptembre.ts)** — aucun composant à toucher.

1. **Ouvrir / fermer une chambre** : son champ `status`, `"disponible"` ou `"réservée"`
   (accent compris — sinon le build échoue, c'est voulu). On ne supprime jamais une
   chambre : elle garde ses photos et ses textes pour le blast suivant.
2. **Changer de mois** : `LP_MONTH` (`{ fr: "octobre", en: "October" }`). L'URL, elle,
   ne bouge jamais — les campagnes Ads pointent dessus.
3. **Ajouter une chambre** : copier un bloc existant de `ROOMS_SEPTEMBRE` et remplir
   maison, repère, surface, salle d'eau, prix, date, atout et photos (dimensions
   RÉELLES des fichiers, `alt` FR et EN). `property` = slug sans tiret.
4. **Vérifier** : `npx tsc -b`, puis `npm run build:local`, puis un 2ᵉ `npm run build`,
   et relire le H1 dans `public/prerendered/chambres-septembre.html` (+ la version `en-`).
5. **Le reste est automatique** : le badge, le H1, le compteur, le CTA, les cartes et
   les metas se recalculent seuls — 2 chambres ou plus « Il ne reste que N chambres
   pour {mois} », 1 chambre « Dernière chambre disponible… », 0 chambre mode
   « Complet » avec liste d'attente vers `/candidature` et le bloc des 3 maisons.
