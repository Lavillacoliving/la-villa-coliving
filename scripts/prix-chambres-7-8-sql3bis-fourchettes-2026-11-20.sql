-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa (décision de Jérôme du 12/11/2026) — SQL 3 bis : les fourchettes écrites en clair par le SQL 3 deviennent les jetons {{PRIX_FOURCHETTE}} et {{PRIX_FOURCHETTE_TABLEAU}}
-- Généré le 2026-11-19T16:45:25.843Z par scripts/build-slots-sql.mjs depuis scripts/prix-chambres-7-8-fourchettes.edits.mjs
--   · source unique de la branche feat/prix-chambres-7-8 (src/data/stats.ts : CONTRACT_EUR, HOUSES_FROM ; src/data/answerSlots.ts : priceRangeText, priceRangeCell ; src/lib/contentTokens.ts) ; textes « Avant » lus en base le 13/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-19T16:45:25.840Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer APRÈS la mise en ligne du code de la branche feat/prix-chambres-7-8 (le site doit connaître les deux jetons), sans urgence : aucun changement visible. Contrôle : le prérendu suivant (check:slots).
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : il contient des espaces insécables (U+00A0, « 1 370 ») et des tirets cadratins — ne pas le faire transiter par un éditeur qui normalise les espaces. La forme à exécuter en séance (un seul bloc, littéraux ASCII) est le fichier .seance.sql du même nom.
-- 30 modifications · 11 articles · état en base à la génération (updated_at · longueur fr / en) :
--   budget-colocation-geneve-guide-complet · 2026-11-19T14:26:48.508096+00:00 · 18773 / 14790
--   colocation-annemasse-ville-la-grand-ambilly · 2026-11-19T14:26:48.508096+00:00 · 8746 / 7815
--   cout-de-la-vie-suisse-france-frontalier-2026 · 2026-11-19T14:26:48.508096+00:00 · 13257 / 11925
--   dossier-location-frontalier-suisse-france · 2026-11-19T14:26:48.508096+00:00 · 9011 / 8361
--   fiscalite-frontalier-geneve-impots-2026 · 2026-11-19T14:26:48.508096+00:00 · 10725 / 10067
--   guide-ressources-frontalier-geneve · 2026-11-19T14:26:48.508096+00:00 · 40438 / 37285
--   organisations-internationales-geneve-ou-habiter · 2026-11-19T14:26:48.508096+00:00 · 7446 / 6824
--   ou-habiter-en-france-quand-on-travaille-a-geneve · 2026-11-19T14:26:48.508096+00:00 · 14931 / 14749
--   salaire-suisse-net-frontalier-2026 · 2026-11-19T14:26:48.508096+00:00 · 13931 / 11229
--   trouver-colocation-geneve-frontalier · 2026-11-19T14:26:48.508096+00:00 · 5981 / 5597
--   trouver-logement-avant-d-arriver-geneve · 2026-11-19T14:26:48.508096+00:00 · 14606 / 14108
-- ============================================================================

BEGIN;

-- [1/30] budget-colocation-geneve-guide-complet (fr) · jeton · fourchette en clair → jeton (ligne « coliving » du tableau des loyers)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La Villa Coliving | — | — | 1 290 – 1 430 CHF |$f$, $r$La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$La Villa Coliving | — | — | 1 290 – 1 430 CHF |$f$ IN content_fr) > 0
  AND position($r$La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |$r$ IN content_fr) = 0;

-- [2/30] budget-colocation-geneve-guide-complet (en) · jeton · fourchette en clair → jeton (ligne « coliving » du tableau des loyers)
UPDATE blog_posts
SET content_en = replace(content_en, $f$La Villa Coliving | — | — | 1,290 – 1,430 CHF |$f$, $r$La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$La Villa Coliving | — | — | 1,290 – 1,430 CHF |$f$ IN content_en) > 0
  AND position($r$La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |$r$ IN content_en) = 0;

-- [3/30] budget-colocation-geneve-guide-complet (fr) · jeton · fourchette en clair → jeton (créneau vérifié par check:slots (budgetVariantText))
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving$f$, $r$Chambre en coliving côté France : {{PRIX_FOURCHETTE}} tout inclus chez La Villa Coliving$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving$f$ IN content_fr) > 0
  AND position($r$Chambre en coliving côté France : {{PRIX_FOURCHETTE}} tout inclus chez La Villa Coliving$r$ IN content_fr) = 0;

-- [4/30] budget-colocation-geneve-guide-complet (en) · jeton · fourchette en clair → jeton (créneau vérifié par check:slots (budgetVariantText))
UPDATE blog_posts
SET content_en = replace(content_en, $f$Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving$f$, $r$Coliving room on the French side: {{PRIX_FOURCHETTE}} all inclusive at La Villa Coliving$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving$f$ IN content_en) > 0
  AND position($r$Coliving room on the French side: {{PRIX_FOURCHETTE}} all inclusive at La Villa Coliving$r$ IN content_en) = 0;

-- [5/30] budget-colocation-geneve-guide-complet (fr) · jeton · fourchette en clair → jeton (ligne Ville-la-Grand du tableau par commune (La Villa : trois paliers))
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| 500 – 700 € | 1 290 – 1 430 CHF |$f$, $r$| 500 – 700 € | {{PRIX_FOURCHETTE_TABLEAU}} |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| 500 – 700 € | 1 290 – 1 430 CHF |$f$ IN content_fr) > 0
  AND position($r$| 500 – 700 € | {{PRIX_FOURCHETTE_TABLEAU}} |$r$ IN content_fr) = 0;

-- [6/30] budget-colocation-geneve-guide-complet (en) · jeton · fourchette en clair → jeton (ligne Ville-la-Grand du tableau par commune (La Villa : trois paliers))
UPDATE blog_posts
SET content_en = replace(content_en, $f$| 500–700 € | 1,290 – 1,430 CHF |$f$, $r$| 500–700 € | {{PRIX_FOURCHETTE_TABLEAU}} |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| 500–700 € | 1,290 – 1,430 CHF |$f$ IN content_en) > 0
  AND position($r$| 500–700 € | {{PRIX_FOURCHETTE_TABLEAU}} |$r$ IN content_en) = 0;

-- [7/30] colocation-annemasse-ville-la-grand-ambilly (fr) · jeton · fourchette en clair → jeton (ligne « coliving » du tableau des prix)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |$f$, $r$| Coliving premium tout compris | {{PRIX_FOURCHETTE_TABLEAU}}/mois |$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |$f$ IN content_fr) > 0
  AND position($r$| Coliving premium tout compris | {{PRIX_FOURCHETTE_TABLEAU}}/mois |$r$ IN content_fr) = 0;

-- [8/30] colocation-annemasse-ville-la-grand-ambilly (en) · jeton · fourchette en clair → jeton (ligne « coliving » du tableau des prix)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |$f$, $r$| All-inclusive premium coliving | {{PRIX_FOURCHETTE_TABLEAU}}/month |$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |$f$ IN content_en) > 0
  AND position($r$| All-inclusive premium coliving | {{PRIX_FOURCHETTE_TABLEAU}}/month |$r$ IN content_en) = 0;

-- [9/30] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · jeton · fourchette en clair → jeton (créneau vérifié par check:slots (coutDeLaVieRowLabel))
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier$f$, $r$ex. La Villa Coliving : {{PRIX_FOURCHETTE}} tout inclus, 0 € de frais de dossier$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier$f$ IN content_fr) > 0
  AND position($r$ex. La Villa Coliving : {{PRIX_FOURCHETTE}} tout inclus, 0 € de frais de dossier$r$ IN content_fr) = 0;

-- [10/30] cout-de-la-vie-suisse-france-frontalier-2026 (en) · jeton · fourchette en clair → jeton (créneau vérifié par check:slots (coutDeLaVieRowLabel))
UPDATE blog_posts
SET content_en = replace(content_en, $f$e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee$f$, $r$e.g. La Villa Coliving: {{PRIX_FOURCHETTE}} all inclusive, no application fee$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee$f$ IN content_en) > 0
  AND position($r$e.g. La Villa Coliving: {{PRIX_FOURCHETTE}} all inclusive, no application fee$r$ IN content_en) = 0;

-- [11/30] dossier-location-frontalier-suisse-france (fr) · jeton · fourchette en clair → jeton (créneau vérifié par check:slots (adminSlot:dossier))
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier$f$, $r$Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier$f$ IN content_fr) > 0
  AND position($r$Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier$r$ IN content_fr) = 0;

-- [12/30] dossier-location-frontalier-suisse-france (en) · jeton · fourchette en clair → jeton (créneau vérifié par check:slots (adminSlot:dossier))
UPDATE blog_posts
SET content_en = replace(content_en, $f$Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file$f$, $r$Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file$f$ IN content_en) > 0
  AND position($r$Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file$r$ IN content_en) = 0;

-- [13/30] fiscalite-frontalier-geneve-impots-2026 (fr) · jeton · fourchette en clair → jeton (créneau vérifié par check:slots (adminSlot:fiscalite))
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre$f$, $r$(chez La Villa Coliving, {{PRIX_FOURCHETTE}} par mois pour une chambre$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre$f$ IN content_fr) > 0
  AND position($r$(chez La Villa Coliving, {{PRIX_FOURCHETTE}} par mois pour une chambre$r$ IN content_fr) = 0;

-- [14/30] fiscalite-frontalier-geneve-impots-2026 (en) · jeton · fourchette en clair → jeton (créneau vérifié par check:slots (adminSlot:fiscalite))
UPDATE blog_posts
SET content_en = replace(content_en, $f$(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room$f$, $r$(at La Villa Coliving, {{PRIX_FOURCHETTE}} a month for a room$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room$f$ IN content_en) > 0
  AND position($r$(at La Villa Coliving, {{PRIX_FOURCHETTE}} a month for a room$r$ IN content_en) = 0;

-- [15/30] organisations-internationales-geneve-ou-habiter (fr) · jeton · fourchette en clair → jeton (ligne « coliving » du tableau des options)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |$f$, $r$(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, tout inclus |$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |$f$ IN content_fr) > 0
  AND position($r$(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, tout inclus |$r$ IN content_fr) = 0;

-- [16/30] organisations-internationales-geneve-ou-habiter (en) · jeton · fourchette en clair → jeton (ligne « coliving » du tableau des options)
UPDATE blog_posts
SET content_en = replace(content_en, $f$(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |$f$, $r$(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, all inclusive |$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |$f$ IN content_en) > 0
  AND position($r$(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, all inclusive |$r$ IN content_en) = 0;

-- [17/30] ou-habiter-en-france-quand-on-travaille-a-geneve (fr) · jeton · fourchette en clair → jeton (phrase du guide)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$pour une personne de 1 290 à 1 430 CHF par mois tout inclus$f$, $r$pour une personne de {{PRIX_FOURCHETTE}} par mois tout inclus$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$pour une personne de 1 290 à 1 430 CHF par mois tout inclus$f$ IN content_fr) > 0
  AND position($r$pour une personne de {{PRIX_FOURCHETTE}} par mois tout inclus$r$ IN content_fr) = 0;

-- [18/30] ou-habiter-en-france-quand-on-travaille-a-geneve (en) · jeton · fourchette en clair → jeton (phrase du guide)
UPDATE blog_posts
SET content_en = replace(content_en, $f$furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive$f$, $r$furnished single rooms at {{PRIX_FOURCHETTE}} a month, all inclusive$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive$f$ IN content_en) > 0
  AND position($r$furnished single rooms at {{PRIX_FOURCHETTE}} a month, all inclusive$r$ IN content_en) = 0;

-- [19/30] salaire-suisse-net-frontalier-2026 (fr) · jeton · fourchette en clair → jeton (phrase du coliving tout inclus)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coliving tout inclus (1 290 à 1 430 CHF par mois)$f$, $r$coliving tout inclus ({{PRIX_FOURCHETTE}} par mois)$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$coliving tout inclus (1 290 à 1 430 CHF par mois)$f$ IN content_fr) > 0
  AND position($r$coliving tout inclus ({{PRIX_FOURCHETTE}} par mois)$r$ IN content_fr) = 0;

-- [20/30] salaire-suisse-net-frontalier-2026 (en) · jeton · fourchette en clair → jeton (phrase du coliving tout inclus)
UPDATE blog_posts
SET content_en = replace(content_en, $f$all-inclusive coliving (CHF 1,290 to 1,430 a month)$f$, $r$all-inclusive coliving ({{PRIX_FOURCHETTE}} a month)$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$all-inclusive coliving (CHF 1,290 to 1,430 a month)$f$ IN content_en) > 0
  AND position($r$all-inclusive coliving ({{PRIX_FOURCHETTE}} a month)$r$ IN content_en) = 0;

-- [21/30] trouver-logement-avant-d-arriver-geneve (fr) · jeton · fourchette en clair → jeton (phrase du guide)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus$f$, $r$porte-à-porte, pour {{PRIX_FOURCHETTE}} par mois tout inclus$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus$f$ IN content_fr) > 0
  AND position($r$porte-à-porte, pour {{PRIX_FOURCHETTE}} par mois tout inclus$r$ IN content_fr) = 0;

-- [22/30] trouver-logement-avant-d-arriver-geneve (en) · jeton · fourchette en clair → jeton (phrase du guide)
UPDATE blog_posts
SET content_en = replace(content_en, $f$door to door, for CHF 1,290 to 1,430 a month all inclusive$f$, $r$door to door, for {{PRIX_FOURCHETTE}} a month all inclusive$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$door to door, for CHF 1,290 to 1,430 a month all inclusive$f$ IN content_en) > 0
  AND position($r$door to door, for {{PRIX_FOURCHETTE}} a month all inclusive$r$ IN content_en) = 0;

-- [23/30] budget-colocation-geneve-guide-complet (fr) · jeton · fourchette en clair → jeton (taux de change : fourchette en francs et loyer contractuel en euros)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$f$, $r$un loyer de {{PRIX_FOURCHETTE}} correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$f$ IN content_fr) > 0
  AND position($r$un loyer de {{PRIX_FOURCHETTE}} correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$r$ IN content_fr) = 0;

-- [24/30] budget-colocation-geneve-guide-complet (en) · jeton · fourchette en clair → jeton (exchange rate: range in francs and contractual rent in euros)
UPDATE blog_posts
SET content_en = replace(content_en, $f$a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$f$, $r$a {{PRIX_FOURCHETTE}} rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$f$ IN content_en) > 0
  AND position($r$a {{PRIX_FOURCHETTE}} rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$r$ IN content_en) = 0;

-- [25/30] guide-ressources-frontalier-geneve (fr) · jeton · fourchette en clair → jeton (« se situe autour de 1 370 CHF » → la fourchette des maisons)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$— coûte de 1 290 à 1 430 CHF par mois.)*$f$, $r$— coûte de {{PRIX_FOURCHETTE}} par mois.)*$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$— coûte de 1 290 à 1 430 CHF par mois.)*$f$ IN content_fr) > 0
  AND position($r$— coûte de {{PRIX_FOURCHETTE}} par mois.)*$r$ IN content_fr) = 0;

-- [26/30] guide-ressources-frontalier-geneve (en) · jeton · fourchette en clair → jeton ("sits around 1,370 CHF" → the houses' price range)
UPDATE blog_posts
SET content_en = replace(content_en, $f$— costs CHF 1,290 to 1,430 a month.)*$f$, $r$— costs {{PRIX_FOURCHETTE}} a month.)*$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$— costs CHF 1,290 to 1,430 a month.)*$f$ IN content_en) > 0
  AND position($r$— costs {{PRIX_FOURCHETTE}} a month.)*$r$ IN content_en) = 0;

-- [27/30] trouver-colocation-geneve-frontalier (fr) · jeton · fourchette en clair → jeton (« ou autour de 1 370 CHF » → la fourchette des maisons)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$ou de 1 290 à 1 430 CHF tout inclus en coliving premium$f$, $r$ou de {{PRIX_FOURCHETTE}} tout inclus en coliving premium$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$ou de 1 290 à 1 430 CHF tout inclus en coliving premium$f$ IN content_fr) > 0
  AND position($r$ou de {{PRIX_FOURCHETTE}} tout inclus en coliving premium$r$ IN content_fr) = 0;

-- [28/30] trouver-colocation-geneve-frontalier (en) · jeton · fourchette en clair → jeton ("or around 1,370 CHF" → the houses' price range)
UPDATE blog_posts
SET content_en = replace(content_en, $f$or CHF 1,290 to 1,430 all-inclusive in premium coliving$f$, $r$or {{PRIX_FOURCHETTE}} all-inclusive in premium coliving$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$or CHF 1,290 to 1,430 all-inclusive in premium coliving$f$ IN content_en) > 0
  AND position($r$or {{PRIX_FOURCHETTE}} all-inclusive in premium coliving$r$ IN content_en) = 0;

-- [29/30] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · jeton · fourchette en clair → jeton (loyer pris pour le calcul (fourchette) et total des dépenses)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$f$, $r$côté France, {{PRIX_FOURCHETTE}} par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$f$ IN content_fr) > 0
  AND position($r$côté France, {{PRIX_FOURCHETTE}} par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$r$ IN content_fr) = 0;

-- [30/30] cout-de-la-vie-suisse-france-frontalier-2026 (en) · jeton · fourchette en clair → jeton (rent used for the maths (range) and total spending)
UPDATE blog_posts
SET content_en = replace(content_en, $f$on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$f$, $r$on the French side, {{PRIX_FOURCHETTE}} a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$f$ IN content_en) > 0
  AND position($r$on the French side, {{PRIX_FOURCHETTE}} a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] budget-colocation-geneve-guide-complet/fr · jeton : « La Villa Coliving | — | — | 1 290 – 1 430 CHF | » → « La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} | »
-- [2] budget-colocation-geneve-guide-complet/en · jeton : « La Villa Coliving | — | — | 1,290 – 1,430 CHF | » → « La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} | »
-- [3] budget-colocation-geneve-guide-complet/fr · jeton : « Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La… » → « Chambre en coliving côté France : {{PRIX_FOURCHETTE}} tout inclus chez … »
-- [4] budget-colocation-geneve-guide-complet/en · jeton : « Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at L… » → « Coliving room on the French side: {{PRIX_FOURCHETTE}} all inclusive at … »
-- [5] budget-colocation-geneve-guide-complet/fr · jeton : « | 500 – 700 € | 1 290 – 1 430 CHF | » → « | 500 – 700 € | {{PRIX_FOURCHETTE_TABLEAU}} | »
-- [6] budget-colocation-geneve-guide-complet/en · jeton : « | 500–700 € | 1,290 – 1,430 CHF | » → « | 500–700 € | {{PRIX_FOURCHETTE_TABLEAU}} | »
-- [7] colocation-annemasse-ville-la-grand-ambilly/fr · jeton : « | Coliving premium tout compris | 1 290 – 1 430 CHF/mois | » → « | Coliving premium tout compris | {{PRIX_FOURCHETTE_TABLEAU}}/mois | »
-- [8] colocation-annemasse-ville-la-grand-ambilly/en · jeton : « | All-inclusive premium coliving | 1,290 – 1,430 CHF/month | » → « | All-inclusive premium coliving | {{PRIX_FOURCHETTE_TABLEAU}}/month | »
-- [9] cout-de-la-vie-suisse-france-frontalier-2026/fr · jeton : « ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de … » → « ex. La Villa Coliving : {{PRIX_FOURCHETTE}} tout inclus, 0 € de frais d… »
-- [10] cout-de-la-vie-suisse-france-frontalier-2026/en · jeton : « e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no applicatio… » → « e.g. La Villa Coliving: {{PRIX_FOURCHETTE}} all inclusive, no applicati… »
-- [11] dossier-location-frontalier-suisse-france/fr · jeton : « Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossi… » → « Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dos… »
-- [12] dossier-location-frontalier-suisse-france/en · jeton : « Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the f… » → « Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the … »
-- [13] fiscalite-frontalier-geneve-impots-2026/fr · jeton : « (chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre » → « (chez La Villa Coliving, {{PRIX_FOURCHETTE}} par mois pour une chambre »
-- [14] fiscalite-frontalier-geneve-impots-2026/en · jeton : « (at La Villa Coliving, CHF 1,290 to 1,430 a month for a room » → « (at La Villa Coliving, {{PRIX_FOURCHETTE}} a month for a room »
-- [15] organisations-internationales-geneve-ou-habiter/fr · jeton : « (La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus | » → « (La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, tout inclus | »
-- [16] organisations-internationales-geneve-ou-habiter/en · jeton : « (La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive | » → « (La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, all inclusive | »
-- [17] ou-habiter-en-france-quand-on-travaille-a-geneve/fr · jeton : « pour une personne de 1 290 à 1 430 CHF par mois tout inclus » → « pour une personne de {{PRIX_FOURCHETTE}} par mois tout inclus »
-- [18] ou-habiter-en-france-quand-on-travaille-a-geneve/en · jeton : « furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive » → « furnished single rooms at {{PRIX_FOURCHETTE}} a month, all inclusive »
-- [19] salaire-suisse-net-frontalier-2026/fr · jeton : « coliving tout inclus (1 290 à 1 430 CHF par mois) » → « coliving tout inclus ({{PRIX_FOURCHETTE}} par mois) »
-- [20] salaire-suisse-net-frontalier-2026/en · jeton : « all-inclusive coliving (CHF 1,290 to 1,430 a month) » → « all-inclusive coliving ({{PRIX_FOURCHETTE}} a month) »
-- [21] trouver-logement-avant-d-arriver-geneve/fr · jeton : « porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus » → « porte-à-porte, pour {{PRIX_FOURCHETTE}} par mois tout inclus »
-- [22] trouver-logement-avant-d-arriver-geneve/en · jeton : « door to door, for CHF 1,290 to 1,430 a month all inclusive » → « door to door, for {{PRIX_FOURCHETTE}} a month all inclusive »
-- [23] budget-colocation-geneve-guide-complet/fr · jeton : « un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PR… » → « un loyer de {{PRIX_FOURCHETTE}} correspond à un loyer contractuel de {{… »
-- [24] budget-colocation-geneve-guide-complet/en · jeton : « a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_D… » → « a {{PRIX_FOURCHETTE}} rent corresponds to a contractual rent of {{PRIX_… »
-- [25] guide-ressources-frontalier-geneve/fr · jeton : « — coûte de 1 290 à 1 430 CHF par mois.)* » → « — coûte de {{PRIX_FOURCHETTE}} par mois.)* »
-- [26] guide-ressources-frontalier-geneve/en · jeton : « — costs CHF 1,290 to 1,430 a month.)* » → « — costs {{PRIX_FOURCHETTE}} a month.)* »
-- [27] trouver-colocation-geneve-frontalier/fr · jeton : « ou de 1 290 à 1 430 CHF tout inclus en coliving premium » → « ou de {{PRIX_FOURCHETTE}} tout inclus en coliving premium »
-- [28] trouver-colocation-geneve-frontalier/en · jeton : « or CHF 1,290 to 1,430 all-inclusive in premium coliving » → « or {{PRIX_FOURCHETTE}} all-inclusive in premium coliving »
-- [29] cout-de-la-vie-suisse-france-frontalier-2026/fr · jeton : « côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compri… » → « côté France, {{PRIX_FOURCHETTE}} par mois charges, fibre et ménage comp… »
-- [30] cout-de-la-vie-suisse-france-frontalier-2026/en · jeton : « on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cl… » → « on the French side, {{PRIX_FOURCHETTE}} a month with bills, fibre and c… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$La Villa Coliving | — | — | 1 290 – 1 430 CHF |$f$ IN content_fr) = 0
      AND position($f$Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving$f$ IN content_fr) = 0
      AND position($f$| 500 – 700 € | 1 290 – 1 430 CHF |$f$ IN content_fr) = 0
      AND position($f$un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$f$ IN content_fr) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |$f$ IN content_fr) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier$f$ IN content_fr) = 0
      AND position($f$côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$f$ IN content_fr) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier$f$ IN content_fr) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$— coûte de 1 290 à 1 430 CHF par mois.)*$f$ IN content_fr) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$pour une personne de 1 290 à 1 430 CHF par mois tout inclus$f$ IN content_fr) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$coliving tout inclus (1 290 à 1 430 CHF par mois)$f$ IN content_fr) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$ou de 1 290 à 1 430 CHF tout inclus en coliving premium$f$ IN content_fr) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$La Villa Coliving | — | — | 1,290 – 1,430 CHF |$f$ IN content_en) = 0
      AND position($f$Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving$f$ IN content_en) = 0
      AND position($f$| 500–700 € | 1,290 – 1,430 CHF |$f$ IN content_en) = 0
      AND position($f$a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$f$ IN content_en) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |$f$ IN content_en) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee$f$ IN content_en) = 0
      AND position($f$on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$f$ IN content_en) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file$f$ IN content_en) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$— costs CHF 1,290 to 1,430 a month.)*$f$ IN content_en) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |$f$ IN content_en) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive$f$ IN content_en) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$all-inclusive coliving (CHF 1,290 to 1,430 a month)$f$ IN content_en) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$or CHF 1,290 to 1,430 all-inclusive in premium coliving$f$ IN content_en) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$door to door, for CHF 1,290 to 1,430 a month all inclusive$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('budget-colocation-geneve-guide-complet', 'colocation-annemasse-ville-la-grand-ambilly', 'cout-de-la-vie-suisse-france-frontalier-2026', 'dossier-location-frontalier-suisse-france', 'fiscalite-frontalier-geneve-impots-2026', 'guide-ressources-frontalier-geneve', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'salaire-suisse-net-frontalier-2026', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$on the French side, {{PRIX_FOURCHETTE}} a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$r$, $f$on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$on the French side, {{PRIX_FOURCHETTE}} a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$r$ IN content_en) > 0
  AND position($f$on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$côté France, {{PRIX_FOURCHETTE}} par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$r$, $f$côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$côté France, {{PRIX_FOURCHETTE}} par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$r$ IN content_fr) > 0
  AND position($f$côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$or {{PRIX_FOURCHETTE}} all-inclusive in premium coliving$r$, $f$or CHF 1,290 to 1,430 all-inclusive in premium coliving$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$or {{PRIX_FOURCHETTE}} all-inclusive in premium coliving$r$ IN content_en) > 0
  AND position($f$or CHF 1,290 to 1,430 all-inclusive in premium coliving$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$ou de {{PRIX_FOURCHETTE}} tout inclus en coliving premium$r$, $f$ou de 1 290 à 1 430 CHF tout inclus en coliving premium$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$ou de {{PRIX_FOURCHETTE}} tout inclus en coliving premium$r$ IN content_fr) > 0
  AND position($f$ou de 1 290 à 1 430 CHF tout inclus en coliving premium$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$— costs {{PRIX_FOURCHETTE}} a month.)*$r$, $f$— costs CHF 1,290 to 1,430 a month.)*$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$— costs {{PRIX_FOURCHETTE}} a month.)*$r$ IN content_en) > 0
  AND position($f$— costs CHF 1,290 to 1,430 a month.)*$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$— coûte de {{PRIX_FOURCHETTE}} par mois.)*$r$, $f$— coûte de 1 290 à 1 430 CHF par mois.)*$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$— coûte de {{PRIX_FOURCHETTE}} par mois.)*$r$ IN content_fr) > 0
  AND position($f$— coûte de 1 290 à 1 430 CHF par mois.)*$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$a {{PRIX_FOURCHETTE}} rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$r$, $f$a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$a {{PRIX_FOURCHETTE}} rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$r$ IN content_en) > 0
  AND position($f$a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$un loyer de {{PRIX_FOURCHETTE}} correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$r$, $f$un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$un loyer de {{PRIX_FOURCHETTE}} correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$r$ IN content_fr) > 0
  AND position($f$un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$door to door, for {{PRIX_FOURCHETTE}} a month all inclusive$r$, $f$door to door, for CHF 1,290 to 1,430 a month all inclusive$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$door to door, for {{PRIX_FOURCHETTE}} a month all inclusive$r$ IN content_en) > 0
  AND position($f$door to door, for CHF 1,290 to 1,430 a month all inclusive$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$porte-à-porte, pour {{PRIX_FOURCHETTE}} par mois tout inclus$r$, $f$porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$porte-à-porte, pour {{PRIX_FOURCHETTE}} par mois tout inclus$r$ IN content_fr) > 0
  AND position($f$porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$all-inclusive coliving ({{PRIX_FOURCHETTE}} a month)$r$, $f$all-inclusive coliving (CHF 1,290 to 1,430 a month)$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$all-inclusive coliving ({{PRIX_FOURCHETTE}} a month)$r$ IN content_en) > 0
  AND position($f$all-inclusive coliving (CHF 1,290 to 1,430 a month)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coliving tout inclus ({{PRIX_FOURCHETTE}} par mois)$r$, $f$coliving tout inclus (1 290 à 1 430 CHF par mois)$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$coliving tout inclus ({{PRIX_FOURCHETTE}} par mois)$r$ IN content_fr) > 0
  AND position($f$coliving tout inclus (1 290 à 1 430 CHF par mois)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$furnished single rooms at {{PRIX_FOURCHETTE}} a month, all inclusive$r$, $f$furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$furnished single rooms at {{PRIX_FOURCHETTE}} a month, all inclusive$r$ IN content_en) > 0
  AND position($f$furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$pour une personne de {{PRIX_FOURCHETTE}} par mois tout inclus$r$, $f$pour une personne de 1 290 à 1 430 CHF par mois tout inclus$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$pour une personne de {{PRIX_FOURCHETTE}} par mois tout inclus$r$ IN content_fr) > 0
  AND position($f$pour une personne de 1 290 à 1 430 CHF par mois tout inclus$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, all inclusive |$r$, $f$(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, all inclusive |$r$ IN content_en) > 0
  AND position($f$(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, tout inclus |$r$, $f$(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, tout inclus |$r$ IN content_fr) > 0
  AND position($f$(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$(at La Villa Coliving, {{PRIX_FOURCHETTE}} a month for a room$r$, $f$(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$(at La Villa Coliving, {{PRIX_FOURCHETTE}} a month for a room$r$ IN content_en) > 0
  AND position($f$(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$(chez La Villa Coliving, {{PRIX_FOURCHETTE}} par mois pour une chambre$r$, $f$(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$(chez La Villa Coliving, {{PRIX_FOURCHETTE}} par mois pour une chambre$r$ IN content_fr) > 0
  AND position($f$(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file$r$, $f$Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file$r$ IN content_en) > 0
  AND position($f$Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier$r$, $f$Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier$r$ IN content_fr) > 0
  AND position($f$Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$e.g. La Villa Coliving: {{PRIX_FOURCHETTE}} all inclusive, no application fee$r$, $f$e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$e.g. La Villa Coliving: {{PRIX_FOURCHETTE}} all inclusive, no application fee$r$ IN content_en) > 0
  AND position($f$e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$ex. La Villa Coliving : {{PRIX_FOURCHETTE}} tout inclus, 0 € de frais de dossier$r$, $f$ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$ex. La Villa Coliving : {{PRIX_FOURCHETTE}} tout inclus, 0 € de frais de dossier$r$ IN content_fr) > 0
  AND position($f$ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| All-inclusive premium coliving | {{PRIX_FOURCHETTE_TABLEAU}}/month |$r$, $f$| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$| All-inclusive premium coliving | {{PRIX_FOURCHETTE_TABLEAU}}/month |$r$ IN content_en) > 0
  AND position($f$| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Coliving premium tout compris | {{PRIX_FOURCHETTE_TABLEAU}}/mois |$r$, $f$| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$| Coliving premium tout compris | {{PRIX_FOURCHETTE_TABLEAU}}/mois |$r$ IN content_fr) > 0
  AND position($f$| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| 500–700 € | {{PRIX_FOURCHETTE_TABLEAU}} |$r$, $f$| 500–700 € | 1,290 – 1,430 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| 500–700 € | {{PRIX_FOURCHETTE_TABLEAU}} |$r$ IN content_en) > 0
  AND position($f$| 500–700 € | 1,290 – 1,430 CHF |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| 500 – 700 € | {{PRIX_FOURCHETTE_TABLEAU}} |$r$, $f$| 500 – 700 € | 1 290 – 1 430 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| 500 – 700 € | {{PRIX_FOURCHETTE_TABLEAU}} |$r$ IN content_fr) > 0
  AND position($f$| 500 – 700 € | 1 290 – 1 430 CHF |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Coliving room on the French side: {{PRIX_FOURCHETTE}} all inclusive at La Villa Coliving$r$, $f$Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Coliving room on the French side: {{PRIX_FOURCHETTE}} all inclusive at La Villa Coliving$r$ IN content_en) > 0
  AND position($f$Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Chambre en coliving côté France : {{PRIX_FOURCHETTE}} tout inclus chez La Villa Coliving$r$, $f$Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Chambre en coliving côté France : {{PRIX_FOURCHETTE}} tout inclus chez La Villa Coliving$r$ IN content_fr) > 0
  AND position($f$Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |$r$, $f$La Villa Coliving | — | — | 1,290 – 1,430 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |$r$ IN content_en) > 0
  AND position($f$La Villa Coliving | — | — | 1,290 – 1,430 CHF |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |$r$, $f$La Villa Coliving | — | — | 1 290 – 1 430 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |$r$ IN content_fr) > 0
  AND position($f$La Villa Coliving | — | — | 1 290 – 1 430 CHF |$f$ IN content_fr) = 0;

COMMIT;
*/
