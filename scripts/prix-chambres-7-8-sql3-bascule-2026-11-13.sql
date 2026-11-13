-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa (décision de Jérôme du 12/11/2026) — SQL 3 : fourchette des maisons « 1 290 à 1 430 CHF » (9 articles), chiffres calculés à partir du prix (5 articles), libellés sans « dès » (3 articles)
-- Généré le 2026-11-13T07:35:37.535Z par scripts/build-slots-sql.mjs depuis scripts/prix-chambres-7-8-bascule.edits.mjs
--   · source unique de la branche feat/prix-chambres-7-8 (src/data/stats.ts : CONTRACT_EUR, HOUSES_FROM ; src/data/answerSlots.ts : priceRangeText, priceRangeCell ; src/lib/contentTokens.ts) ; textes « Avant » lus en base le 13/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-13T07:35:37.531Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer DANS LE MÊME CRÉNEAU que la fusion de la branche feat/prix-chambres-7-8, juste avant elle et après le SQL 1 : la garde check:slots de la branche exige « 1 290 à 1 430 CHF » dans 4 articles. La fourchette est écrite en clair (ses jetons ne sont connus que du nouveau code) ; le SQL 3 bis la convertit en jetons après la mise en ligne.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : il contient des espaces insécables (U+00A0, « 1 370 ») et des tirets cadratins — ne pas le faire transiter par un éditeur qui normalise les espaces. La forme à exécuter en séance (un seul bloc, littéraux ASCII) est le fichier .seance.sql du même nom.
-- 64 modifications · 12 articles · état en base à la génération (updated_at · longueur fr / en) :
--   assurance-sante-frontalier-lamal-cmu-budget · 2026-11-12T21:48:49.13221+00:00 · 9587 / 9039
--   budget-colocation-geneve-guide-complet · 2026-11-12T21:48:49.13221+00:00 · 18723 / 14725
--   colocation-annemasse-ville-la-grand-ambilly · 2026-11-12T14:44:18.845333+00:00 · 8740 / 7809
--   cout-de-la-vie-suisse-france-frontalier-2026 · 2026-11-12T21:48:49.13221+00:00 · 13254 / 11922
--   dossier-location-frontalier-suisse-france · 2026-10-30T17:15:30.671729+00:00 · 9008 / 8358
--   fiscalite-frontalier-geneve-impots-2026 · 2026-11-12T21:48:49.13221+00:00 · 10713 / 10055
--   guide-ressources-frontalier-geneve · 2026-11-12T21:48:49.13221+00:00 · 40430 / 37274
--   organisations-internationales-geneve-ou-habiter · 2026-11-12T21:48:49.13221+00:00 · 7443 / 6821
--   ou-habiter-en-france-quand-on-travaille-a-geneve · 2026-11-12T21:48:49.13221+00:00 · 14927 / 14746
--   salaire-suisse-net-frontalier-2026 · 2026-11-12T21:48:49.13221+00:00 · 13925 / 11223
--   trouver-colocation-geneve-frontalier · 2026-11-12T21:48:49.13221+00:00 · 5965 / 5580
--   trouver-logement-avant-d-arriver-geneve · 2026-11-12T21:48:49.13221+00:00 · 14603 / 14105
-- ============================================================================

BEGIN;

-- [1/64] budget-colocation-geneve-guide-complet (fr) · fourchette · ligne « coliving » du tableau des loyers
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La Villa Coliving | — | — | 1 370 – 1 430 CHF |$f$, $r$La Villa Coliving | — | — | 1 290 – 1 430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$La Villa Coliving | — | — | 1 370 – 1 430 CHF |$f$ IN content_fr) > 0
  AND position($r$La Villa Coliving | — | — | 1 290 – 1 430 CHF |$r$ IN content_fr) = 0;

-- [2/64] budget-colocation-geneve-guide-complet (en) · fourchette · ligne « coliving » du tableau des loyers
UPDATE blog_posts
SET content_en = replace(content_en, $f$La Villa Coliving | — | — | 1,370 – 1,430 CHF |$f$, $r$La Villa Coliving | — | — | 1,290 – 1,430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$La Villa Coliving | — | — | 1,370 – 1,430 CHF |$f$ IN content_en) > 0
  AND position($r$La Villa Coliving | — | — | 1,290 – 1,430 CHF |$r$ IN content_en) = 0;

-- [3/64] budget-colocation-geneve-guide-complet (fr) · fourchette · créneau vérifié par check:slots (budgetVariantText)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La Villa Coliving$f$, $r$Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La Villa Coliving$f$ IN content_fr) > 0
  AND position($r$Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving$r$ IN content_fr) = 0;

-- [4/64] budget-colocation-geneve-guide-complet (en) · fourchette · créneau vérifié par check:slots (budgetVariantText)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving$f$, $r$Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving$f$ IN content_en) > 0
  AND position($r$Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving$r$ IN content_en) = 0;

-- [5/64] budget-colocation-geneve-guide-complet (fr) · fourchette · ligne Ville-la-Grand du tableau par commune (La Villa : trois paliers)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| 500 – 700 € | 1 370 – 1 430 CHF |$f$, $r$| 500 – 700 € | 1 290 – 1 430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| 500 – 700 € | 1 370 – 1 430 CHF |$f$ IN content_fr) > 0
  AND position($r$| 500 – 700 € | 1 290 – 1 430 CHF |$r$ IN content_fr) = 0;

-- [6/64] budget-colocation-geneve-guide-complet (en) · fourchette · ligne Ville-la-Grand du tableau par commune (La Villa : trois paliers)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| 500–700 € | 1,370 – 1,430 CHF |$f$, $r$| 500–700 € | 1,290 – 1,430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| 500–700 € | 1,370 – 1,430 CHF |$f$ IN content_en) > 0
  AND position($r$| 500–700 € | 1,290 – 1,430 CHF |$r$ IN content_en) = 0;

-- [7/64] colocation-annemasse-ville-la-grand-ambilly (fr) · fourchette · ligne « coliving » du tableau des prix
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Coliving premium tout compris | 1 370 – 1 430 CHF/mois |$f$, $r$| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$| Coliving premium tout compris | 1 370 – 1 430 CHF/mois |$f$ IN content_fr) > 0
  AND position($r$| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |$r$ IN content_fr) = 0;

-- [8/64] colocation-annemasse-ville-la-grand-ambilly (en) · fourchette · ligne « coliving » du tableau des prix
UPDATE blog_posts
SET content_en = replace(content_en, $f$| All-inclusive premium coliving | 1,370 – 1,430 CHF/month |$f$, $r$| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$| All-inclusive premium coliving | 1,370 – 1,430 CHF/month |$f$ IN content_en) > 0
  AND position($r$| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |$r$ IN content_en) = 0;

-- [9/64] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · fourchette · créneau vérifié par check:slots (coutDeLaVieRowLabel)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$ex. La Villa Coliving : 1 370 à 1 430 CHF tout inclus, 0 € de frais de dossier$f$, $r$ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$ex. La Villa Coliving : 1 370 à 1 430 CHF tout inclus, 0 € de frais de dossier$f$ IN content_fr) > 0
  AND position($r$ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier$r$ IN content_fr) = 0;

-- [10/64] cout-de-la-vie-suisse-france-frontalier-2026 (en) · fourchette · créneau vérifié par check:slots (coutDeLaVieRowLabel)
UPDATE blog_posts
SET content_en = replace(content_en, $f$e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no application fee$f$, $r$e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no application fee$f$ IN content_en) > 0
  AND position($r$e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee$r$ IN content_en) = 0;

-- [11/64] dossier-location-frontalier-suisse-france (fr) · fourchette · créneau vérifié par check:slots (adminSlot:dossier)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Ambilly et Annemasse, 1 370 à 1 430 CHF par mois tout inclus), le dossier$f$, $r$Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$Ambilly et Annemasse, 1 370 à 1 430 CHF par mois tout inclus), le dossier$f$ IN content_fr) > 0
  AND position($r$Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier$r$ IN content_fr) = 0;

-- [12/64] dossier-location-frontalier-suisse-france (en) · fourchette · créneau vérifié par check:slots (adminSlot:dossier)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Ambilly and Annemasse, CHF 1,370 to 1,430 a month all inclusive), the file$f$, $r$Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$Ambilly and Annemasse, CHF 1,370 to 1,430 a month all inclusive), the file$f$ IN content_en) > 0
  AND position($r$Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file$r$ IN content_en) = 0;

-- [13/64] fiscalite-frontalier-geneve-impots-2026 (fr) · fourchette · créneau vérifié par check:slots (adminSlot:fiscalite)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$(chez La Villa Coliving, 1 370 à 1 430 CHF par mois pour une chambre$f$, $r$(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$(chez La Villa Coliving, 1 370 à 1 430 CHF par mois pour une chambre$f$ IN content_fr) > 0
  AND position($r$(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre$r$ IN content_fr) = 0;

-- [14/64] fiscalite-frontalier-geneve-impots-2026 (en) · fourchette · créneau vérifié par check:slots (adminSlot:fiscalite)
UPDATE blog_posts
SET content_en = replace(content_en, $f$(at La Villa Coliving, CHF 1,370 to 1,430 a month for a room$f$, $r$(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$(at La Villa Coliving, CHF 1,370 to 1,430 a month for a room$f$ IN content_en) > 0
  AND position($r$(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room$r$ IN content_en) = 0;

-- [15/64] organisations-internationales-geneve-ou-habiter (fr) · fourchette · ligne « coliving » du tableau des options
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$(La Villa Coliving) | 1 370 – 1 430 CHF, tout inclus |$f$, $r$(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$(La Villa Coliving) | 1 370 – 1 430 CHF, tout inclus |$f$ IN content_fr) > 0
  AND position($r$(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |$r$ IN content_fr) = 0;

-- [16/64] organisations-internationales-geneve-ou-habiter (en) · fourchette · ligne « coliving » du tableau des options
UPDATE blog_posts
SET content_en = replace(content_en, $f$(La Villa Coliving) | 1,370 – 1,430 CHF, all inclusive |$f$, $r$(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$(La Villa Coliving) | 1,370 – 1,430 CHF, all inclusive |$f$ IN content_en) > 0
  AND position($r$(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |$r$ IN content_en) = 0;

-- [17/64] ou-habiter-en-france-quand-on-travaille-a-geneve (fr) · fourchette · phrase du guide
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$pour une personne à 1 370 à 1 430 CHF par mois tout inclus$f$, $r$pour une personne à 1 290 à 1 430 CHF par mois tout inclus$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$pour une personne à 1 370 à 1 430 CHF par mois tout inclus$f$ IN content_fr) > 0
  AND position($r$pour une personne à 1 290 à 1 430 CHF par mois tout inclus$r$ IN content_fr) = 0;

-- [18/64] ou-habiter-en-france-quand-on-travaille-a-geneve (en) · fourchette · phrase du guide
UPDATE blog_posts
SET content_en = replace(content_en, $f$furnished single rooms at CHF 1,370 to 1,430 a month, all inclusive$f$, $r$furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$furnished single rooms at CHF 1,370 to 1,430 a month, all inclusive$f$ IN content_en) > 0
  AND position($r$furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive$r$ IN content_en) = 0;

-- [19/64] salaire-suisse-net-frontalier-2026 (fr) · fourchette · phrase du coliving tout inclus
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coliving tout inclus (1 370 à 1 430 CHF par mois)$f$, $r$coliving tout inclus (1 290 à 1 430 CHF par mois)$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$coliving tout inclus (1 370 à 1 430 CHF par mois)$f$ IN content_fr) > 0
  AND position($r$coliving tout inclus (1 290 à 1 430 CHF par mois)$r$ IN content_fr) = 0;

-- [20/64] salaire-suisse-net-frontalier-2026 (en) · fourchette · phrase du coliving tout inclus
UPDATE blog_posts
SET content_en = replace(content_en, $f$all-inclusive coliving (CHF 1,370 to 1,430 a month)$f$, $r$all-inclusive coliving (CHF 1,290 to 1,430 a month)$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$all-inclusive coliving (CHF 1,370 to 1,430 a month)$f$ IN content_en) > 0
  AND position($r$all-inclusive coliving (CHF 1,290 to 1,430 a month)$r$ IN content_en) = 0;

-- [21/64] trouver-logement-avant-d-arriver-geneve (fr) · fourchette · phrase du guide
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$porte-à-porte, pour 1 370 à 1 430 CHF par mois tout inclus$f$, $r$porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$porte-à-porte, pour 1 370 à 1 430 CHF par mois tout inclus$f$ IN content_fr) > 0
  AND position($r$porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus$r$ IN content_fr) = 0;

-- [22/64] trouver-logement-avant-d-arriver-geneve (en) · fourchette · phrase du guide
UPDATE blog_posts
SET content_en = replace(content_en, $f$door to door, for CHF 1,370 to 1,430 a month all inclusive$f$, $r$door to door, for CHF 1,290 to 1,430 a month all inclusive$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$door to door, for CHF 1,370 to 1,430 a month all inclusive$f$ IN content_en) > 0
  AND position($r$door to door, for CHF 1,290 to 1,430 a month all inclusive$r$ IN content_en) = 0;

-- [23/64] budget-colocation-geneve-guide-complet (fr) · fourchette · taux de change : fourchette en francs et loyer contractuel en euros
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 470 à 1 530 €, libellé en euros$f$, $r$un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 470 à 1 530 €, libellé en euros$f$ IN content_fr) > 0
  AND position($r$un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$r$ IN content_fr) = 0;

-- [24/64] budget-colocation-geneve-guide-complet (en) · fourchette · exchange rate: range in francs and contractual rent in euros
UPDATE blog_posts
SET content_en = replace(content_en, $f$a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 to €1,530, set in euros$f$, $r$a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 to €1,530, set in euros$f$ IN content_en) > 0
  AND position($r$a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$r$ IN content_en) = 0;

-- [25/64] budget-colocation-geneve-guide-complet (fr) · libellé · titre de section : le prix d'appel s'écrit avec « dès »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$### 3. Coliving premium (1 370 CHF/mois tout compris)$f$, $r$### 3. Coliving premium (dès {{PRIX_DES}}/mois tout compris)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$### 3. Coliving premium (1 370 CHF/mois tout compris)$f$ IN content_fr) > 0
  AND position($r$### 3. Coliving premium (dès {{PRIX_DES}}/mois tout compris)$r$ IN content_fr) = 0;

-- [26/64] budget-colocation-geneve-guide-complet (en) · libellé · section heading: the entry price is written with "from"
UPDATE blog_posts
SET content_en = replace(content_en, $f$### 3. Premium coliving (1,370 CHF/month all-inclusive)$f$, $r$### 3. Premium coliving (from {{PRIX_DES}}/month all-inclusive)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$### 3. Premium coliving (1,370 CHF/month all-inclusive)$f$ IN content_en) > 0
  AND position($r$### 3. Premium coliving (from {{PRIX_DES}}/month all-inclusive)$r$ IN content_en) = 0;

-- [27/64] budget-colocation-geneve-guide-complet (fr) · libellé · puce du résumé : « dès »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- **Coliving tout inclus (1 370 CHF/mois)**$f$, $r$- **Coliving tout inclus (dès {{PRIX_DES}}/mois)**$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$- **Coliving tout inclus (1 370 CHF/mois)**$f$ IN content_fr) > 0
  AND position($r$- **Coliving tout inclus (dès {{PRIX_DES}}/mois)**$r$ IN content_fr) = 0;

-- [28/64] budget-colocation-geneve-guide-complet (en) · libellé · summary bullet: "from"
UPDATE blog_posts
SET content_en = replace(content_en, $f$- **All-inclusive coliving (CHF 1,370/month)**$f$, $r$- **All-inclusive coliving (from {{PRIX_DES}}/month)**$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$- **All-inclusive coliving (CHF 1,370/month)**$f$ IN content_en) > 0
  AND position($r$- **All-inclusive coliving (from {{PRIX_DES}}/month)**$r$ IN content_en) = 0;

-- [29/64] budget-colocation-geneve-guide-complet (fr) · libellé · tableau comparatif, ligne « Loyer » : « dès »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| 500-700 € | 1 370 CHF |$f$, $r$| 500-700 € | dès {{PRIX_DES}} |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| 500-700 € | 1 370 CHF |$f$ IN content_fr) > 0
  AND position($r$| 500-700 € | dès {{PRIX_DES}} |$r$ IN content_fr) = 0;

-- [30/64] budget-colocation-geneve-guide-complet (en) · libellé · comparison table, "Rent" row: "from"
UPDATE blog_posts
SET content_en = replace(content_en, $f$| 500-700 € | 1,370 CHF |$f$, $r$| 500-700 € | from {{PRIX_DES}} |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| 500-700 € | 1,370 CHF |$f$ IN content_en) > 0
  AND position($r$| 500-700 € | from {{PRIX_DES}} |$r$ IN content_en) = 0;

-- [31/64] budget-colocation-geneve-guide-complet (fr) · libellé · tableau comparatif, ligne « TOTAL mensuel » : « dès »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| **650-950 €** | **1 370 CHF** |$f$, $r$| **650-950 €** | **dès {{PRIX_DES}}** |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| **650-950 €** | **1 370 CHF** |$f$ IN content_fr) > 0
  AND position($r$| **650-950 €** | **dès {{PRIX_DES}}** |$r$ IN content_fr) = 0;

-- [32/64] budget-colocation-geneve-guide-complet (en) · libellé · comparison table, "TOTAL monthly" row: "from"
UPDATE blog_posts
SET content_en = replace(content_en, $f$| **650-950 €** | **1,370 CHF** |$f$, $r$| **650-950 €** | **from {{PRIX_DES}}** |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| **650-950 €** | **1,370 CHF** |$f$ IN content_en) > 0
  AND position($r$| **650-950 €** | **from {{PRIX_DES}}** |$r$ IN content_en) = 0;

-- [33/64] guide-ressources-frontalier-geneve (fr) · libellé · « se situe autour de 1 370 CHF » → la fourchette des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$— se situe autour de 1 370 CHF/mois.)*$f$, $r$— coûte de 1 290 à 1 430 CHF par mois.)*$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$— se situe autour de 1 370 CHF/mois.)*$f$ IN content_fr) > 0
  AND position($r$— coûte de 1 290 à 1 430 CHF par mois.)*$r$ IN content_fr) = 0;

-- [34/64] guide-ressources-frontalier-geneve (en) · libellé · "sits around 1,370 CHF" → the houses' price range
UPDATE blog_posts
SET content_en = replace(content_en, $f$— sits around 1,370 CHF/month.)*$f$, $r$— costs CHF 1,290 to 1,430 a month.)*$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$— sits around 1,370 CHF/month.)*$f$ IN content_en) > 0
  AND position($r$— costs CHF 1,290 to 1,430 a month.)*$r$ IN content_en) = 0;

-- [35/64] trouver-colocation-geneve-frontalier (fr) · libellé · « ou autour de 1 370 CHF » → la fourchette des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$ou autour de 1 370 CHF tout inclus en coliving premium$f$, $r$ou de 1 290 à 1 430 CHF tout inclus en coliving premium$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$ou autour de 1 370 CHF tout inclus en coliving premium$f$ IN content_fr) > 0
  AND position($r$ou de 1 290 à 1 430 CHF tout inclus en coliving premium$r$ IN content_fr) = 0;

-- [36/64] trouver-colocation-geneve-frontalier (en) · libellé · "or around 1,370 CHF" → the houses' price range
UPDATE blog_posts
SET content_en = replace(content_en, $f$or around 1,370 CHF all-inclusive in premium coliving$f$, $r$or CHF 1,290 to 1,430 all-inclusive in premium coliving$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$or around 1,370 CHF all-inclusive in premium coliving$f$ IN content_en) > 0
  AND position($r$or CHF 1,290 to 1,430 all-inclusive in premium coliving$r$ IN content_en) = 0;

-- [37/64] budget-colocation-geneve-guide-complet (fr) · calcul · part du net à 4 500, 6 000 et 8 000 CHF, recalculée avec le prix d'appel
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$le coliving à 1 370 CHF représente exactement 30% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est 23% — très confortable. À 8 000 CHF, c'est 17% —$f$, $r$le coliving dès {{PRIX_DES}} représente 29% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est 22% — très confortable. À 8 000 CHF, c'est 16% —$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$le coliving à 1 370 CHF représente exactement 30% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est 23% — très confortable. À 8 000 CHF, c'est 17% —$f$ IN content_fr) > 0
  AND position($r$le coliving dès {{PRIX_DES}} représente 29% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est 22% — très confortable. À 8 000 CHF, c'est 16% —$r$ IN content_fr) = 0;

-- [38/64] budget-colocation-geneve-guide-complet (en) · calcul · share of net at CHF 6,000, recomputed with the entry price
UPDATE blog_posts
SET content_en = replace(content_en, $f$coliving at 1,370 CHF represents just 23% — very comfortable.$f$, $r$coliving from {{PRIX_DES}} represents just 22% — very comfortable.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$coliving at 1,370 CHF represents just 23% — very comfortable.$f$ IN content_en) > 0
  AND position($r$coliving from {{PRIX_DES}} represents just 22% — very comfortable.$r$ IN content_en) = 0;

-- [39/64] assurance-sante-frontalier-lamal-cmu-budget (fr) · calcul · part du net du profil junior (~4 200 CHF net)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le coliving, dès 1 370 CHF, représente environ 33 % de ton net$f$, $r$Le coliving, dès {{PRIX_DES}}, représente environ 31 % de ton net$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Le coliving, dès 1 370 CHF, représente environ 33 % de ton net$f$ IN content_fr) > 0
  AND position($r$Le coliving, dès {{PRIX_DES}}, représente environ 31 % de ton net$r$ IN content_fr) = 0;

-- [40/64] assurance-sante-frontalier-lamal-cmu-budget (en) · calcul · share of net, junior profile (~CHF 4,200 net)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Coliving, from 1,370 CHF, represents about 33% of your net$f$, $r$Coliving, from {{PRIX_DES}}, represents about 31% of your net$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Coliving, from 1,370 CHF, represents about 33% of your net$f$ IN content_en) > 0
  AND position($r$Coliving, from {{PRIX_DES}}, represents about 31% of your net$r$ IN content_en) = 0;

-- [41/64] assurance-sante-frontalier-lamal-cmu-budget (fr) · calcul · part du net entre 60 000 et 80 000 CHF brut (règle de trois sur les pourcentages publiés)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le coliving, dès 1 370 CHF, représente 23-27 % de ton net$f$, $r$Le coliving, dès {{PRIX_DES}}, représente 22-25 % de ton net$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Le coliving, dès 1 370 CHF, représente 23-27 % de ton net$f$ IN content_fr) > 0
  AND position($r$Le coliving, dès {{PRIX_DES}}, représente 22-25 % de ton net$r$ IN content_fr) = 0;

-- [42/64] assurance-sante-frontalier-lamal-cmu-budget (en) · calcul · share of net between CHF 60,000 and 80,000 gross (rule of three on the published percentages)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Coliving, from 1,370 CHF, represents 23-27% of your net$f$, $r$Coliving, from {{PRIX_DES}}, represents 22-25% of your net$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Coliving, from 1,370 CHF, represents 23-27% of your net$f$ IN content_en) > 0
  AND position($r$Coliving, from {{PRIX_DES}}, represents 22-25% of your net$r$ IN content_en) = 0;

-- [43/64] fiscalite-frontalier-geneve-impots-2026 (fr) · calcul · simulation 1 (net 4 070-4 340 CHF) : reste après le loyer
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Avec une chambre en coliving dès 1 370 CHF, il te reste environ 2 700-2 960 CHF$f$, $r$Avec une chambre en coliving dès {{PRIX_DES}}, il te reste environ 2 780-3 050 CHF$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Avec une chambre en coliving dès 1 370 CHF, il te reste environ 2 700-2 960 CHF$f$ IN content_fr) > 0
  AND position($r$Avec une chambre en coliving dès {{PRIX_DES}}, il te reste environ 2 780-3 050 CHF$r$ IN content_fr) = 0;

-- [44/64] fiscalite-frontalier-geneve-impots-2026 (en) · calcul · simulation 1 (net CHF 4,070-4,340): left after rent
UPDATE blog_posts
SET content_en = replace(content_en, $f$With a coliving room from 1,370 CHF, you have about 2,700-2,960 CHF left$f$, $r$With a coliving room from {{PRIX_DES}}, you have about 2,780-3,050 CHF left$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$With a coliving room from 1,370 CHF, you have about 2,700-2,960 CHF left$f$ IN content_en) > 0
  AND position($r$With a coliving room from {{PRIX_DES}}, you have about 2,780-3,050 CHF left$r$ IN content_en) = 0;

-- [45/64] fiscalite-frontalier-geneve-impots-2026 (fr) · calcul · simulation 2 (net 5 325-5 700 CHF) : part du net et reste
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le coliving, dès 1 370 CHF, représente 24-26 % du net. Il reste 3 950-4 320 CHF$f$, $r$Le coliving, dès {{PRIX_DES}}, représente 23-24 % du net. Il reste 4 035-4 410 CHF$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Le coliving, dès 1 370 CHF, représente 24-26 % du net. Il reste 3 950-4 320 CHF$f$ IN content_fr) > 0
  AND position($r$Le coliving, dès {{PRIX_DES}}, représente 23-24 % du net. Il reste 4 035-4 410 CHF$r$ IN content_fr) = 0;

-- [46/64] fiscalite-frontalier-geneve-impots-2026 (en) · calcul · simulation 2 (net CHF 5,325-5,700): share of net and remainder
UPDATE blog_posts
SET content_en = replace(content_en, $f$Coliving, from 1,370 CHF, represents 24-26% of net. That leaves 3,950-4,320 CHF$f$, $r$Coliving, from {{PRIX_DES}}, represents 23-24% of net. That leaves 4,035-4,410 CHF$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Coliving, from 1,370 CHF, represents 24-26% of net. That leaves 3,950-4,320 CHF$f$ IN content_en) > 0
  AND position($r$Coliving, from {{PRIX_DES}}, represents 23-24% of net. That leaves 4,035-4,410 CHF$r$ IN content_en) = 0;

-- [47/64] fiscalite-frontalier-geneve-impots-2026 (fr) · calcul · simulation 3 (net 7 258-7 800 CHF) : part du net
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le coliving, dès 1 370 CHF, ne représente que 18-19 % du net$f$, $r$Le coliving, dès {{PRIX_DES}}, ne représente que 17-18 % du net$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Le coliving, dès 1 370 CHF, ne représente que 18-19 % du net$f$ IN content_fr) > 0
  AND position($r$Le coliving, dès {{PRIX_DES}}, ne représente que 17-18 % du net$r$ IN content_fr) = 0;

-- [48/64] fiscalite-frontalier-geneve-impots-2026 (en) · calcul · simulation 3 (net CHF 7,258-7,800): share of net
UPDATE blog_posts
SET content_en = replace(content_en, $f$Coliving, from 1,370 CHF, represents only 18-19% of net$f$, $r$Coliving, from {{PRIX_DES}}, represents only 17-18% of net$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Coliving, from 1,370 CHF, represents only 18-19% of net$f$ IN content_en) > 0
  AND position($r$Coliving, from {{PRIX_DES}}, represents only 17-18% of net$r$ IN content_en) = 0;

-- [49/64] fiscalite-frontalier-geneve-impots-2026 (fr) · calcul · part du net pour 5 300 à 7 000 CHF net (rentShareOfNet)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Ce loyer représente 20 à 27 % de ce net$f$, $r$Ce loyer représente 18 à 27 % de ce net$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Ce loyer représente 20 à 27 % de ce net$f$ IN content_fr) > 0
  AND position($r$Ce loyer représente 18 à 27 % de ce net$r$ IN content_fr) = 0;

-- [50/64] fiscalite-frontalier-geneve-impots-2026 (en) · calcul · share of net for CHF 5,300 to 7,000 net (rentShareOfNet)
UPDATE blog_posts
SET content_en = replace(content_en, $f$This rent represents 20 to 27% of this net$f$, $r$This rent represents 18 to 27% of this net$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$This rent represents 20 to 27% of this net$f$ IN content_en) > 0
  AND position($r$This rent represents 18 to 27% of this net$r$ IN content_en) = 0;

-- [51/64] organisations-internationales-geneve-ou-habiter (fr) · calcul · écart mensuel avec un studio côté France (studioPremiumChf)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le surcoût d'environ 500 à 800 CHF par mois$f$, $r$Le surcoût d'environ 400 à 800 CHF par mois$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$Le surcoût d'environ 500 à 800 CHF par mois$f$ IN content_fr) > 0
  AND position($r$Le surcoût d'environ 400 à 800 CHF par mois$r$ IN content_fr) = 0;

-- [52/64] organisations-internationales-geneve-ou-habiter (en) · calcul · monthly premium over a French-side studio (studioPremiumChf)
UPDATE blog_posts
SET content_en = replace(content_en, $f$The premium of roughly CHF 500 to 800 a month$f$, $r$The premium of roughly CHF 400 to 800 a month$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$The premium of roughly CHF 500 to 800 a month$f$ IN content_en) > 0
  AND position($r$The premium of roughly CHF 400 to 800 a month$r$ IN content_en) = 0;

-- [53/64] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · calcul · reste après dépenses à 5 300 CHF net (phrase d'introduction)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées$f$, $r$et il lui reste 2 100 à 2 850 CHF une fois les dépenses courantes payées$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées$f$ IN content_fr) > 0
  AND position($r$et il lui reste 2 100 à 2 850 CHF une fois les dépenses courantes payées$r$ IN content_fr) = 0;

-- [54/64] cout-de-la-vie-suisse-france-frontalier-2026 (en) · calcul · left after everyday costs at CHF 5,300 net (opening sentence)
UPDATE blog_posts
SET content_en = replace(content_en, $f$and CHF 2,100 to 2,800 is left once everyday costs are paid$f$, $r$and CHF 2,100 to 2,850 is left once everyday costs are paid$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$and CHF 2,100 to 2,800 is left once everyday costs are paid$f$ IN content_en) > 0
  AND position($r$and CHF 2,100 to 2,850 is left once everyday costs are paid$r$ IN content_en) = 0;

-- [55/64] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · calcul · loyer pris pour le calcul (fourchette) et total des dépenses
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois.$f$, $r$côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois.$f$ IN content_fr) > 0
  AND position($r$côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$r$ IN content_fr) = 0;

-- [56/64] cout-de-la-vie-suisse-france-frontalier-2026 (en) · calcul · rent used for the maths (range) and total spending
UPDATE blog_posts
SET content_en = replace(content_en, $f$on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month.$f$, $r$on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month.$f$ IN content_en) > 0
  AND position($r$on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$r$ IN content_en) = 0;

-- [57/64] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · calcul · tableau : 72 000 CHF brut (~4 400 CHF net)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |$f$, $r$| ~4 400 CHF | 29 à 33 % | 1 200 à 1 950 CHF |$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$| ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |$f$ IN content_fr) > 0
  AND position($r$| ~4 400 CHF | 29 à 33 % | 1 200 à 1 950 CHF |$r$ IN content_fr) = 0;

-- [58/64] cout-de-la-vie-suisse-france-frontalier-2026 (en) · calcul · table: CHF 72,000 gross (~CHF 4,400 net)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |$f$, $r$| ~CHF 4,400 | 29 to 33% | CHF 1,200 to 1,950 |$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$| ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |$f$ IN content_en) > 0
  AND position($r$| ~CHF 4,400 | 29 to 33% | CHF 1,200 to 1,950 |$r$ IN content_en) = 0;

-- [59/64] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · calcul · tableau : 90 000 CHF brut (~5 300 CHF net)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |$f$, $r$| ~5 300 CHF | 24 à 27 % | 2 100 à 2 850 CHF |$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$| ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |$f$ IN content_fr) > 0
  AND position($r$| ~5 300 CHF | 24 à 27 % | 2 100 à 2 850 CHF |$r$ IN content_fr) = 0;

-- [60/64] cout-de-la-vie-suisse-france-frontalier-2026 (en) · calcul · table: CHF 90,000 gross (~CHF 5,300 net)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |$f$, $r$| ~CHF 5,300 | 24 to 27% | CHF 2,100 to 2,850 |$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$| ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |$f$ IN content_en) > 0
  AND position($r$| ~CHF 5,300 | 24 to 27% | CHF 2,100 to 2,850 |$r$ IN content_en) = 0;

-- [61/64] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · calcul · tableau : 102 000 CHF brut (~5 950 CHF net)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |$f$, $r$| ~5 950 CHF | 22 à 24 % | 2 750 à 3 500 CHF |$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$| ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |$f$ IN content_fr) > 0
  AND position($r$| ~5 950 CHF | 22 à 24 % | 2 750 à 3 500 CHF |$r$ IN content_fr) = 0;

-- [62/64] cout-de-la-vie-suisse-france-frontalier-2026 (en) · calcul · table: CHF 102,000 gross (~CHF 5,950 net)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |$f$, $r$| ~CHF 5,950 | 22 to 24% | CHF 2,750 to 3,500 |$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$| ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |$f$ IN content_en) > 0
  AND position($r$| ~CHF 5,950 | 22 to 24% | CHF 2,750 to 3,500 |$r$ IN content_en) = 0;

-- [63/64] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · calcul · net à partir duquel le logement passe sous 30 %
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois$f$, $r$tu passes sous ce seuil à partir de 4 300 à 4 800 CHF net par mois$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois$f$ IN content_fr) > 0
  AND position($r$tu passes sous ce seuil à partir de 4 300 à 4 800 CHF net par mois$r$ IN content_fr) = 0;

-- [64/64] cout-de-la-vie-suisse-france-frontalier-2026 (en) · calcul · net pay from which housing drops below 30%
UPDATE blog_posts
SET content_en = replace(content_en, $f$you drop below it from CHF 4,600 to 4,800 net a month$f$, $r$you drop below it from CHF 4,300 to 4,800 net a month$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$you drop below it from CHF 4,600 to 4,800 net a month$f$ IN content_en) > 0
  AND position($r$you drop below it from CHF 4,300 to 4,800 net a month$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] budget-colocation-geneve-guide-complet/fr · fourchette : « La Villa Coliving | — | — | 1 370 – 1 430 CHF | » → « La Villa Coliving | — | — | 1 290 – 1 430 CHF | »
-- [2] budget-colocation-geneve-guide-complet/en · fourchette : « La Villa Coliving | — | — | 1,370 – 1,430 CHF | » → « La Villa Coliving | — | — | 1,290 – 1,430 CHF | »
-- [3] budget-colocation-geneve-guide-complet/fr · fourchette : « Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La… » → « Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La… »
-- [4] budget-colocation-geneve-guide-complet/en · fourchette : « Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at L… » → « Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at L… »
-- [5] budget-colocation-geneve-guide-complet/fr · fourchette : « | 500 – 700 € | 1 370 – 1 430 CHF | » → « | 500 – 700 € | 1 290 – 1 430 CHF | »
-- [6] budget-colocation-geneve-guide-complet/en · fourchette : « | 500–700 € | 1,370 – 1,430 CHF | » → « | 500–700 € | 1,290 – 1,430 CHF | »
-- [7] colocation-annemasse-ville-la-grand-ambilly/fr · fourchette : « | Coliving premium tout compris | 1 370 – 1 430 CHF/mois | » → « | Coliving premium tout compris | 1 290 – 1 430 CHF/mois | »
-- [8] colocation-annemasse-ville-la-grand-ambilly/en · fourchette : « | All-inclusive premium coliving | 1,370 – 1,430 CHF/month | » → « | All-inclusive premium coliving | 1,290 – 1,430 CHF/month | »
-- [9] cout-de-la-vie-suisse-france-frontalier-2026/fr · fourchette : « ex. La Villa Coliving : 1 370 à 1 430 CHF tout inclus, 0 € de frais de … » → « ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de … »
-- [10] cout-de-la-vie-suisse-france-frontalier-2026/en · fourchette : « e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no applicatio… » → « e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no applicatio… »
-- [11] dossier-location-frontalier-suisse-france/fr · fourchette : « Ambilly et Annemasse, 1 370 à 1 430 CHF par mois tout inclus), le dossi… » → « Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossi… »
-- [12] dossier-location-frontalier-suisse-france/en · fourchette : « Ambilly and Annemasse, CHF 1,370 to 1,430 a month all inclusive), the f… » → « Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the f… »
-- [13] fiscalite-frontalier-geneve-impots-2026/fr · fourchette : « (chez La Villa Coliving, 1 370 à 1 430 CHF par mois pour une chambre » → « (chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre »
-- [14] fiscalite-frontalier-geneve-impots-2026/en · fourchette : « (at La Villa Coliving, CHF 1,370 to 1,430 a month for a room » → « (at La Villa Coliving, CHF 1,290 to 1,430 a month for a room »
-- [15] organisations-internationales-geneve-ou-habiter/fr · fourchette : « (La Villa Coliving) | 1 370 – 1 430 CHF, tout inclus | » → « (La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus | »
-- [16] organisations-internationales-geneve-ou-habiter/en · fourchette : « (La Villa Coliving) | 1,370 – 1,430 CHF, all inclusive | » → « (La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive | »
-- [17] ou-habiter-en-france-quand-on-travaille-a-geneve/fr · fourchette : « pour une personne à 1 370 à 1 430 CHF par mois tout inclus » → « pour une personne à 1 290 à 1 430 CHF par mois tout inclus »
-- [18] ou-habiter-en-france-quand-on-travaille-a-geneve/en · fourchette : « furnished single rooms at CHF 1,370 to 1,430 a month, all inclusive » → « furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive »
-- [19] salaire-suisse-net-frontalier-2026/fr · fourchette : « coliving tout inclus (1 370 à 1 430 CHF par mois) » → « coliving tout inclus (1 290 à 1 430 CHF par mois) »
-- [20] salaire-suisse-net-frontalier-2026/en · fourchette : « all-inclusive coliving (CHF 1,370 to 1,430 a month) » → « all-inclusive coliving (CHF 1,290 to 1,430 a month) »
-- [21] trouver-logement-avant-d-arriver-geneve/fr · fourchette : « porte-à-porte, pour 1 370 à 1 430 CHF par mois tout inclus » → « porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus »
-- [22] trouver-logement-avant-d-arriver-geneve/en · fourchette : « door to door, for CHF 1,370 to 1,430 a month all inclusive » → « door to door, for CHF 1,290 to 1,430 a month all inclusive »
-- [23] budget-colocation-geneve-guide-complet/fr · fourchette : « un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 47… » → « un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PR… »
-- [24] budget-colocation-geneve-guide-complet/en · fourchette : « a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 t… » → « a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_D… »
-- [25] budget-colocation-geneve-guide-complet/fr · libellé : « ### 3. Coliving premium (1 370 CHF/mois tout compris) » → « ### 3. Coliving premium (dès {{PRIX_DES}}/mois tout compris) »
-- [26] budget-colocation-geneve-guide-complet/en · libellé : « ### 3. Premium coliving (1,370 CHF/month all-inclusive) » → « ### 3. Premium coliving (from {{PRIX_DES}}/month all-inclusive) »
-- [27] budget-colocation-geneve-guide-complet/fr · libellé : « - **Coliving tout inclus (1 370 CHF/mois)** » → « - **Coliving tout inclus (dès {{PRIX_DES}}/mois)** »
-- [28] budget-colocation-geneve-guide-complet/en · libellé : « - **All-inclusive coliving (CHF 1,370/month)** » → « - **All-inclusive coliving (from {{PRIX_DES}}/month)** »
-- [29] budget-colocation-geneve-guide-complet/fr · libellé : « | 500-700 € | 1 370 CHF | » → « | 500-700 € | dès {{PRIX_DES}} | »
-- [30] budget-colocation-geneve-guide-complet/en · libellé : « | 500-700 € | 1,370 CHF | » → « | 500-700 € | from {{PRIX_DES}} | »
-- [31] budget-colocation-geneve-guide-complet/fr · libellé : « | **650-950 €** | **1 370 CHF** | » → « | **650-950 €** | **dès {{PRIX_DES}}** | »
-- [32] budget-colocation-geneve-guide-complet/en · libellé : « | **650-950 €** | **1,370 CHF** | » → « | **650-950 €** | **from {{PRIX_DES}}** | »
-- [33] guide-ressources-frontalier-geneve/fr · libellé : « — se situe autour de 1 370 CHF/mois.)* » → « — coûte de 1 290 à 1 430 CHF par mois.)* »
-- [34] guide-ressources-frontalier-geneve/en · libellé : « — sits around 1,370 CHF/month.)* » → « — costs CHF 1,290 to 1,430 a month.)* »
-- [35] trouver-colocation-geneve-frontalier/fr · libellé : « ou autour de 1 370 CHF tout inclus en coliving premium » → « ou de 1 290 à 1 430 CHF tout inclus en coliving premium »
-- [36] trouver-colocation-geneve-frontalier/en · libellé : « or around 1,370 CHF all-inclusive in premium coliving » → « or CHF 1,290 to 1,430 all-inclusive in premium coliving »
-- [37] budget-colocation-geneve-guide-complet/fr · calcul : « le coliving à 1 370 CHF représente exactement 30% — c'est serré mais te… » → « le coliving dès {{PRIX_DES}} représente 29% — c'est serré mais tenable,… »
-- [38] budget-colocation-geneve-guide-complet/en · calcul : « coliving at 1,370 CHF represents just 23% — very comfortable. » → « coliving from {{PRIX_DES}} represents just 22% — very comfortable. »
-- [39] assurance-sante-frontalier-lamal-cmu-budget/fr · calcul : « Le coliving, dès 1 370 CHF, représente environ 33 % de ton net » → « Le coliving, dès {{PRIX_DES}}, représente environ 31 % de ton net »
-- [40] assurance-sante-frontalier-lamal-cmu-budget/en · calcul : « Coliving, from 1,370 CHF, represents about 33% of your net » → « Coliving, from {{PRIX_DES}}, represents about 31% of your net »
-- [41] assurance-sante-frontalier-lamal-cmu-budget/fr · calcul : « Le coliving, dès 1 370 CHF, représente 23-27 % de ton net » → « Le coliving, dès {{PRIX_DES}}, représente 22-25 % de ton net »
-- [42] assurance-sante-frontalier-lamal-cmu-budget/en · calcul : « Coliving, from 1,370 CHF, represents 23-27% of your net » → « Coliving, from {{PRIX_DES}}, represents 22-25% of your net »
-- [43] fiscalite-frontalier-geneve-impots-2026/fr · calcul : « Avec une chambre en coliving dès 1 370 CHF, il te reste environ 2 700-2… » → « Avec une chambre en coliving dès {{PRIX_DES}}, il te reste environ 2 78… »
-- [44] fiscalite-frontalier-geneve-impots-2026/en · calcul : « With a coliving room from 1,370 CHF, you have about 2,700-2,960 CHF left » → « With a coliving room from {{PRIX_DES}}, you have about 2,780-3,050 CHF … »
-- [45] fiscalite-frontalier-geneve-impots-2026/fr · calcul : « Le coliving, dès 1 370 CHF, représente 24-26 % du net. Il reste 3 950-4… » → « Le coliving, dès {{PRIX_DES}}, représente 23-24 % du net. Il reste 4 03… »
-- [46] fiscalite-frontalier-geneve-impots-2026/en · calcul : « Coliving, from 1,370 CHF, represents 24-26% of net. That leaves 3,950-4… » → « Coliving, from {{PRIX_DES}}, represents 23-24% of net. That leaves 4,03… »
-- [47] fiscalite-frontalier-geneve-impots-2026/fr · calcul : « Le coliving, dès 1 370 CHF, ne représente que 18-19 % du net » → « Le coliving, dès {{PRIX_DES}}, ne représente que 17-18 % du net »
-- [48] fiscalite-frontalier-geneve-impots-2026/en · calcul : « Coliving, from 1,370 CHF, represents only 18-19% of net » → « Coliving, from {{PRIX_DES}}, represents only 17-18% of net »
-- [49] fiscalite-frontalier-geneve-impots-2026/fr · calcul : « Ce loyer représente 20 à 27 % de ce net » → « Ce loyer représente 18 à 27 % de ce net »
-- [50] fiscalite-frontalier-geneve-impots-2026/en · calcul : « This rent represents 20 to 27% of this net » → « This rent represents 18 to 27% of this net »
-- [51] organisations-internationales-geneve-ou-habiter/fr · calcul : « Le surcoût d'environ 500 à 800 CHF par mois » → « Le surcoût d'environ 400 à 800 CHF par mois »
-- [52] organisations-internationales-geneve-ou-habiter/en · calcul : « The premium of roughly CHF 500 to 800 a month » → « The premium of roughly CHF 400 to 800 a month »
-- [53] cout-de-la-vie-suisse-france-frontalier-2026/fr · calcul : « et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées » → « et il lui reste 2 100 à 2 850 CHF une fois les dépenses courantes payées »
-- [54] cout-de-la-vie-suisse-france-frontalier-2026/en · calcul : « and CHF 2,100 to 2,800 is left once everyday costs are paid » → « and CHF 2,100 to 2,850 is left once everyday costs are paid »
-- [55] cout-de-la-vie-suisse-france-frontalier-2026/fr · calcul : « côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compri… » → « côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compri… »
-- [56] cout-de-la-vie-suisse-france-frontalier-2026/en · calcul : « on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cl… » → « on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cl… »
-- [57] cout-de-la-vie-suisse-france-frontalier-2026/fr · calcul : « | ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF | » → « | ~4 400 CHF | 29 à 33 % | 1 200 à 1 950 CHF | »
-- [58] cout-de-la-vie-suisse-france-frontalier-2026/en · calcul : « | ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 | » → « | ~CHF 4,400 | 29 to 33% | CHF 1,200 to 1,950 | »
-- [59] cout-de-la-vie-suisse-france-frontalier-2026/fr · calcul : « | ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF | » → « | ~5 300 CHF | 24 à 27 % | 2 100 à 2 850 CHF | »
-- [60] cout-de-la-vie-suisse-france-frontalier-2026/en · calcul : « | ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 | » → « | ~CHF 5,300 | 24 to 27% | CHF 2,100 to 2,850 | »
-- [61] cout-de-la-vie-suisse-france-frontalier-2026/fr · calcul : « | ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF | » → « | ~5 950 CHF | 22 à 24 % | 2 750 à 3 500 CHF | »
-- [62] cout-de-la-vie-suisse-france-frontalier-2026/en · calcul : « | ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 | » → « | ~CHF 5,950 | 22 to 24% | CHF 2,750 to 3,500 | »
-- [63] cout-de-la-vie-suisse-france-frontalier-2026/fr · calcul : « tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois » → « tu passes sous ce seuil à partir de 4 300 à 4 800 CHF net par mois »
-- [64] cout-de-la-vie-suisse-france-frontalier-2026/en · calcul : « you drop below it from CHF 4,600 to 4,800 net a month » → « you drop below it from CHF 4,300 to 4,800 net a month »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$Le coliving, dès 1 370 CHF, représente environ 33 % de ton net$f$ IN content_fr) = 0
      AND position($f$Le coliving, dès 1 370 CHF, représente 23-27 % de ton net$f$ IN content_fr) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$La Villa Coliving | — | — | 1 370 – 1 430 CHF |$f$ IN content_fr) = 0
      AND position($f$Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La Villa Coliving$f$ IN content_fr) = 0
      AND position($f$| 500 – 700 € | 1 370 – 1 430 CHF |$f$ IN content_fr) = 0
      AND position($f$un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 470 à 1 530 €, libellé en euros$f$ IN content_fr) = 0
      AND position($f$### 3. Coliving premium (1 370 CHF/mois tout compris)$f$ IN content_fr) = 0
      AND position($f$- **Coliving tout inclus (1 370 CHF/mois)**$f$ IN content_fr) = 0
      AND position($f$| 500-700 € | 1 370 CHF |$f$ IN content_fr) = 0
      AND position($f$| **650-950 €** | **1 370 CHF** |$f$ IN content_fr) = 0
      AND position($f$le coliving à 1 370 CHF représente exactement 30% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est 23% — très confortable. À 8 000 CHF, c'est 17% —$f$ IN content_fr) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$| Coliving premium tout compris | 1 370 – 1 430 CHF/mois |$f$ IN content_fr) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$ex. La Villa Coliving : 1 370 à 1 430 CHF tout inclus, 0 € de frais de dossier$f$ IN content_fr) = 0
      AND position($f$et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées$f$ IN content_fr) = 0
      AND position($f$côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois.$f$ IN content_fr) = 0
      AND position($f$| ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |$f$ IN content_fr) = 0
      AND position($f$| ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |$f$ IN content_fr) = 0
      AND position($f$| ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |$f$ IN content_fr) = 0
      AND position($f$tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois$f$ IN content_fr) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$Ambilly et Annemasse, 1 370 à 1 430 CHF par mois tout inclus), le dossier$f$ IN content_fr) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$(chez La Villa Coliving, 1 370 à 1 430 CHF par mois pour une chambre$f$ IN content_fr) = 0
      AND position($f$Avec une chambre en coliving dès 1 370 CHF, il te reste environ 2 700-2 960 CHF$f$ IN content_fr) = 0
      AND position($f$Le coliving, dès 1 370 CHF, représente 24-26 % du net. Il reste 3 950-4 320 CHF$f$ IN content_fr) = 0
      AND position($f$Le coliving, dès 1 370 CHF, ne représente que 18-19 % du net$f$ IN content_fr) = 0
      AND position($f$Ce loyer représente 20 à 27 % de ce net$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$— se situe autour de 1 370 CHF/mois.)*$f$ IN content_fr) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$(La Villa Coliving) | 1 370 – 1 430 CHF, tout inclus |$f$ IN content_fr) = 0
      AND position($f$Le surcoût d'environ 500 à 800 CHF par mois$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$pour une personne à 1 370 à 1 430 CHF par mois tout inclus$f$ IN content_fr) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$coliving tout inclus (1 370 à 1 430 CHF par mois)$f$ IN content_fr) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$ou autour de 1 370 CHF tout inclus en coliving premium$f$ IN content_fr) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$porte-à-porte, pour 1 370 à 1 430 CHF par mois tout inclus$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$Coliving, from 1,370 CHF, represents about 33% of your net$f$ IN content_en) = 0
      AND position($f$Coliving, from 1,370 CHF, represents 23-27% of your net$f$ IN content_en) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$La Villa Coliving | — | — | 1,370 – 1,430 CHF |$f$ IN content_en) = 0
      AND position($f$Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving$f$ IN content_en) = 0
      AND position($f$| 500–700 € | 1,370 – 1,430 CHF |$f$ IN content_en) = 0
      AND position($f$a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 to €1,530, set in euros$f$ IN content_en) = 0
      AND position($f$### 3. Premium coliving (1,370 CHF/month all-inclusive)$f$ IN content_en) = 0
      AND position($f$- **All-inclusive coliving (CHF 1,370/month)**$f$ IN content_en) = 0
      AND position($f$| 500-700 € | 1,370 CHF |$f$ IN content_en) = 0
      AND position($f$| **650-950 €** | **1,370 CHF** |$f$ IN content_en) = 0
      AND position($f$coliving at 1,370 CHF represents just 23% — very comfortable.$f$ IN content_en) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$| All-inclusive premium coliving | 1,370 – 1,430 CHF/month |$f$ IN content_en) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no application fee$f$ IN content_en) = 0
      AND position($f$and CHF 2,100 to 2,800 is left once everyday costs are paid$f$ IN content_en) = 0
      AND position($f$on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month.$f$ IN content_en) = 0
      AND position($f$| ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |$f$ IN content_en) = 0
      AND position($f$| ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |$f$ IN content_en) = 0
      AND position($f$| ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |$f$ IN content_en) = 0
      AND position($f$you drop below it from CHF 4,600 to 4,800 net a month$f$ IN content_en) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$Ambilly and Annemasse, CHF 1,370 to 1,430 a month all inclusive), the file$f$ IN content_en) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$(at La Villa Coliving, CHF 1,370 to 1,430 a month for a room$f$ IN content_en) = 0
      AND position($f$With a coliving room from 1,370 CHF, you have about 2,700-2,960 CHF left$f$ IN content_en) = 0
      AND position($f$Coliving, from 1,370 CHF, represents 24-26% of net. That leaves 3,950-4,320 CHF$f$ IN content_en) = 0
      AND position($f$Coliving, from 1,370 CHF, represents only 18-19% of net$f$ IN content_en) = 0
      AND position($f$This rent represents 20 to 27% of this net$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$— sits around 1,370 CHF/month.)*$f$ IN content_en) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$(La Villa Coliving) | 1,370 – 1,430 CHF, all inclusive |$f$ IN content_en) = 0
      AND position($f$The premium of roughly CHF 500 to 800 a month$f$ IN content_en) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$furnished single rooms at CHF 1,370 to 1,430 a month, all inclusive$f$ IN content_en) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$all-inclusive coliving (CHF 1,370 to 1,430 a month)$f$ IN content_en) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$or around 1,370 CHF all-inclusive in premium coliving$f$ IN content_en) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$door to door, for CHF 1,370 to 1,430 a month all inclusive$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('assurance-sante-frontalier-lamal-cmu-budget', 'budget-colocation-geneve-guide-complet', 'colocation-annemasse-ville-la-grand-ambilly', 'cout-de-la-vie-suisse-france-frontalier-2026', 'dossier-location-frontalier-suisse-france', 'fiscalite-frontalier-geneve-impots-2026', 'guide-ressources-frontalier-geneve', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'salaire-suisse-net-frontalier-2026', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$you drop below it from CHF 4,300 to 4,800 net a month$r$, $f$you drop below it from CHF 4,600 to 4,800 net a month$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$you drop below it from CHF 4,300 to 4,800 net a month$r$ IN content_en) > 0
  AND position($f$you drop below it from CHF 4,600 to 4,800 net a month$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tu passes sous ce seuil à partir de 4 300 à 4 800 CHF net par mois$r$, $f$tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$tu passes sous ce seuil à partir de 4 300 à 4 800 CHF net par mois$r$ IN content_fr) > 0
  AND position($f$tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| ~CHF 5,950 | 22 to 24% | CHF 2,750 to 3,500 |$r$, $f$| ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$| ~CHF 5,950 | 22 to 24% | CHF 2,750 to 3,500 |$r$ IN content_en) > 0
  AND position($f$| ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| ~5 950 CHF | 22 à 24 % | 2 750 à 3 500 CHF |$r$, $f$| ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$| ~5 950 CHF | 22 à 24 % | 2 750 à 3 500 CHF |$r$ IN content_fr) > 0
  AND position($f$| ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| ~CHF 5,300 | 24 to 27% | CHF 2,100 to 2,850 |$r$, $f$| ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$| ~CHF 5,300 | 24 to 27% | CHF 2,100 to 2,850 |$r$ IN content_en) > 0
  AND position($f$| ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| ~5 300 CHF | 24 à 27 % | 2 100 à 2 850 CHF |$r$, $f$| ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$| ~5 300 CHF | 24 à 27 % | 2 100 à 2 850 CHF |$r$ IN content_fr) > 0
  AND position($f$| ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| ~CHF 4,400 | 29 to 33% | CHF 1,200 to 1,950 |$r$, $f$| ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$| ~CHF 4,400 | 29 to 33% | CHF 1,200 to 1,950 |$r$ IN content_en) > 0
  AND position($f$| ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| ~4 400 CHF | 29 à 33 % | 1 200 à 1 950 CHF |$r$, $f$| ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$| ~4 400 CHF | 29 à 33 % | 1 200 à 1 950 CHF |$r$ IN content_fr) > 0
  AND position($f$| ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$r$, $f$on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,430 to 3,180 of spending a month.$r$ IN content_en) > 0
  AND position($f$on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$r$, $f$côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$côté France, 1 290 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.$r$ IN content_fr) > 0
  AND position($f$côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$and CHF 2,100 to 2,850 is left once everyday costs are paid$r$, $f$and CHF 2,100 to 2,800 is left once everyday costs are paid$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$and CHF 2,100 to 2,850 is left once everyday costs are paid$r$ IN content_en) > 0
  AND position($f$and CHF 2,100 to 2,800 is left once everyday costs are paid$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$et il lui reste 2 100 à 2 850 CHF une fois les dépenses courantes payées$r$, $f$et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$et il lui reste 2 100 à 2 850 CHF une fois les dépenses courantes payées$r$ IN content_fr) > 0
  AND position($f$et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$The premium of roughly CHF 400 to 800 a month$r$, $f$The premium of roughly CHF 500 to 800 a month$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$The premium of roughly CHF 400 to 800 a month$r$ IN content_en) > 0
  AND position($f$The premium of roughly CHF 500 to 800 a month$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le surcoût d'environ 400 à 800 CHF par mois$r$, $f$Le surcoût d'environ 500 à 800 CHF par mois$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$Le surcoût d'environ 400 à 800 CHF par mois$r$ IN content_fr) > 0
  AND position($f$Le surcoût d'environ 500 à 800 CHF par mois$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$This rent represents 18 to 27% of this net$r$, $f$This rent represents 20 to 27% of this net$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$This rent represents 18 to 27% of this net$r$ IN content_en) > 0
  AND position($f$This rent represents 20 to 27% of this net$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Ce loyer représente 18 à 27 % de ce net$r$, $f$Ce loyer représente 20 à 27 % de ce net$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Ce loyer représente 18 à 27 % de ce net$r$ IN content_fr) > 0
  AND position($f$Ce loyer représente 20 à 27 % de ce net$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Coliving, from {{PRIX_DES}}, represents only 17-18% of net$r$, $f$Coliving, from 1,370 CHF, represents only 18-19% of net$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Coliving, from {{PRIX_DES}}, represents only 17-18% of net$r$ IN content_en) > 0
  AND position($f$Coliving, from 1,370 CHF, represents only 18-19% of net$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le coliving, dès {{PRIX_DES}}, ne représente que 17-18 % du net$r$, $f$Le coliving, dès 1 370 CHF, ne représente que 18-19 % du net$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Le coliving, dès {{PRIX_DES}}, ne représente que 17-18 % du net$r$ IN content_fr) > 0
  AND position($f$Le coliving, dès 1 370 CHF, ne représente que 18-19 % du net$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Coliving, from {{PRIX_DES}}, represents 23-24% of net. That leaves 4,035-4,410 CHF$r$, $f$Coliving, from 1,370 CHF, represents 24-26% of net. That leaves 3,950-4,320 CHF$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Coliving, from {{PRIX_DES}}, represents 23-24% of net. That leaves 4,035-4,410 CHF$r$ IN content_en) > 0
  AND position($f$Coliving, from 1,370 CHF, represents 24-26% of net. That leaves 3,950-4,320 CHF$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le coliving, dès {{PRIX_DES}}, représente 23-24 % du net. Il reste 4 035-4 410 CHF$r$, $f$Le coliving, dès 1 370 CHF, représente 24-26 % du net. Il reste 3 950-4 320 CHF$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Le coliving, dès {{PRIX_DES}}, représente 23-24 % du net. Il reste 4 035-4 410 CHF$r$ IN content_fr) > 0
  AND position($f$Le coliving, dès 1 370 CHF, représente 24-26 % du net. Il reste 3 950-4 320 CHF$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$With a coliving room from {{PRIX_DES}}, you have about 2,780-3,050 CHF left$r$, $f$With a coliving room from 1,370 CHF, you have about 2,700-2,960 CHF left$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$With a coliving room from {{PRIX_DES}}, you have about 2,780-3,050 CHF left$r$ IN content_en) > 0
  AND position($f$With a coliving room from 1,370 CHF, you have about 2,700-2,960 CHF left$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Avec une chambre en coliving dès {{PRIX_DES}}, il te reste environ 2 780-3 050 CHF$r$, $f$Avec une chambre en coliving dès 1 370 CHF, il te reste environ 2 700-2 960 CHF$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Avec une chambre en coliving dès {{PRIX_DES}}, il te reste environ 2 780-3 050 CHF$r$ IN content_fr) > 0
  AND position($f$Avec une chambre en coliving dès 1 370 CHF, il te reste environ 2 700-2 960 CHF$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Coliving, from {{PRIX_DES}}, represents 22-25% of your net$r$, $f$Coliving, from 1,370 CHF, represents 23-27% of your net$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Coliving, from {{PRIX_DES}}, represents 22-25% of your net$r$ IN content_en) > 0
  AND position($f$Coliving, from 1,370 CHF, represents 23-27% of your net$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le coliving, dès {{PRIX_DES}}, représente 22-25 % de ton net$r$, $f$Le coliving, dès 1 370 CHF, représente 23-27 % de ton net$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Le coliving, dès {{PRIX_DES}}, représente 22-25 % de ton net$r$ IN content_fr) > 0
  AND position($f$Le coliving, dès 1 370 CHF, représente 23-27 % de ton net$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Coliving, from {{PRIX_DES}}, represents about 31% of your net$r$, $f$Coliving, from 1,370 CHF, represents about 33% of your net$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Coliving, from {{PRIX_DES}}, represents about 31% of your net$r$ IN content_en) > 0
  AND position($f$Coliving, from 1,370 CHF, represents about 33% of your net$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le coliving, dès {{PRIX_DES}}, représente environ 31 % de ton net$r$, $f$Le coliving, dès 1 370 CHF, représente environ 33 % de ton net$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Le coliving, dès {{PRIX_DES}}, représente environ 31 % de ton net$r$ IN content_fr) > 0
  AND position($f$Le coliving, dès 1 370 CHF, représente environ 33 % de ton net$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$coliving from {{PRIX_DES}} represents just 22% — very comfortable.$r$, $f$coliving at 1,370 CHF represents just 23% — very comfortable.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$coliving from {{PRIX_DES}} represents just 22% — very comfortable.$r$ IN content_en) > 0
  AND position($f$coliving at 1,370 CHF represents just 23% — very comfortable.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$le coliving dès {{PRIX_DES}} représente 29% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est 22% — très confortable. À 8 000 CHF, c'est 16% —$r$, $f$le coliving à 1 370 CHF représente exactement 30% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est 23% — très confortable. À 8 000 CHF, c'est 17% —$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$le coliving dès {{PRIX_DES}} représente 29% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est 22% — très confortable. À 8 000 CHF, c'est 16% —$r$ IN content_fr) > 0
  AND position($f$le coliving à 1 370 CHF représente exactement 30% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est 23% — très confortable. À 8 000 CHF, c'est 17% —$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$or CHF 1,290 to 1,430 all-inclusive in premium coliving$r$, $f$or around 1,370 CHF all-inclusive in premium coliving$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$or CHF 1,290 to 1,430 all-inclusive in premium coliving$r$ IN content_en) > 0
  AND position($f$or around 1,370 CHF all-inclusive in premium coliving$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$ou de 1 290 à 1 430 CHF tout inclus en coliving premium$r$, $f$ou autour de 1 370 CHF tout inclus en coliving premium$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$ou de 1 290 à 1 430 CHF tout inclus en coliving premium$r$ IN content_fr) > 0
  AND position($f$ou autour de 1 370 CHF tout inclus en coliving premium$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$— costs CHF 1,290 to 1,430 a month.)*$r$, $f$— sits around 1,370 CHF/month.)*$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$— costs CHF 1,290 to 1,430 a month.)*$r$ IN content_en) > 0
  AND position($f$— sits around 1,370 CHF/month.)*$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$— coûte de 1 290 à 1 430 CHF par mois.)*$r$, $f$— se situe autour de 1 370 CHF/mois.)*$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$— coûte de 1 290 à 1 430 CHF par mois.)*$r$ IN content_fr) > 0
  AND position($f$— se situe autour de 1 370 CHF/mois.)*$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| **650-950 €** | **from {{PRIX_DES}}** |$r$, $f$| **650-950 €** | **1,370 CHF** |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| **650-950 €** | **from {{PRIX_DES}}** |$r$ IN content_en) > 0
  AND position($f$| **650-950 €** | **1,370 CHF** |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| **650-950 €** | **dès {{PRIX_DES}}** |$r$, $f$| **650-950 €** | **1 370 CHF** |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| **650-950 €** | **dès {{PRIX_DES}}** |$r$ IN content_fr) > 0
  AND position($f$| **650-950 €** | **1 370 CHF** |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| 500-700 € | from {{PRIX_DES}} |$r$, $f$| 500-700 € | 1,370 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| 500-700 € | from {{PRIX_DES}} |$r$ IN content_en) > 0
  AND position($f$| 500-700 € | 1,370 CHF |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| 500-700 € | dès {{PRIX_DES}} |$r$, $f$| 500-700 € | 1 370 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| 500-700 € | dès {{PRIX_DES}} |$r$ IN content_fr) > 0
  AND position($f$| 500-700 € | 1 370 CHF |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- **All-inclusive coliving (from {{PRIX_DES}}/month)**$r$, $f$- **All-inclusive coliving (CHF 1,370/month)**$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$- **All-inclusive coliving (from {{PRIX_DES}}/month)**$r$ IN content_en) > 0
  AND position($f$- **All-inclusive coliving (CHF 1,370/month)**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- **Coliving tout inclus (dès {{PRIX_DES}}/mois)**$r$, $f$- **Coliving tout inclus (1 370 CHF/mois)**$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$- **Coliving tout inclus (dès {{PRIX_DES}}/mois)**$r$ IN content_fr) > 0
  AND position($f$- **Coliving tout inclus (1 370 CHF/mois)**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$### 3. Premium coliving (from {{PRIX_DES}}/month all-inclusive)$r$, $f$### 3. Premium coliving (1,370 CHF/month all-inclusive)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$### 3. Premium coliving (from {{PRIX_DES}}/month all-inclusive)$r$ IN content_en) > 0
  AND position($f$### 3. Premium coliving (1,370 CHF/month all-inclusive)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$### 3. Coliving premium (dès {{PRIX_DES}}/mois tout compris)$r$, $f$### 3. Coliving premium (1 370 CHF/mois tout compris)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$### 3. Coliving premium (dès {{PRIX_DES}}/mois tout compris)$r$ IN content_fr) > 0
  AND position($f$### 3. Coliving premium (1 370 CHF/mois tout compris)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$r$, $f$a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 to €1,530, set in euros$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros$r$ IN content_en) > 0
  AND position($f$a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 to €1,530, set in euros$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$r$, $f$un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 470 à 1 530 €, libellé en euros$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$un loyer de 1 290 à 1 430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros$r$ IN content_fr) > 0
  AND position($f$un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 470 à 1 530 €, libellé en euros$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$door to door, for CHF 1,290 to 1,430 a month all inclusive$r$, $f$door to door, for CHF 1,370 to 1,430 a month all inclusive$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$door to door, for CHF 1,290 to 1,430 a month all inclusive$r$ IN content_en) > 0
  AND position($f$door to door, for CHF 1,370 to 1,430 a month all inclusive$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus$r$, $f$porte-à-porte, pour 1 370 à 1 430 CHF par mois tout inclus$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$porte-à-porte, pour 1 290 à 1 430 CHF par mois tout inclus$r$ IN content_fr) > 0
  AND position($f$porte-à-porte, pour 1 370 à 1 430 CHF par mois tout inclus$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$all-inclusive coliving (CHF 1,290 to 1,430 a month)$r$, $f$all-inclusive coliving (CHF 1,370 to 1,430 a month)$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$all-inclusive coliving (CHF 1,290 to 1,430 a month)$r$ IN content_en) > 0
  AND position($f$all-inclusive coliving (CHF 1,370 to 1,430 a month)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coliving tout inclus (1 290 à 1 430 CHF par mois)$r$, $f$coliving tout inclus (1 370 à 1 430 CHF par mois)$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$coliving tout inclus (1 290 à 1 430 CHF par mois)$r$ IN content_fr) > 0
  AND position($f$coliving tout inclus (1 370 à 1 430 CHF par mois)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive$r$, $f$furnished single rooms at CHF 1,370 to 1,430 a month, all inclusive$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive$r$ IN content_en) > 0
  AND position($f$furnished single rooms at CHF 1,370 to 1,430 a month, all inclusive$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$pour une personne à 1 290 à 1 430 CHF par mois tout inclus$r$, $f$pour une personne à 1 370 à 1 430 CHF par mois tout inclus$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$pour une personne à 1 290 à 1 430 CHF par mois tout inclus$r$ IN content_fr) > 0
  AND position($f$pour une personne à 1 370 à 1 430 CHF par mois tout inclus$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |$r$, $f$(La Villa Coliving) | 1,370 – 1,430 CHF, all inclusive |$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |$r$ IN content_en) > 0
  AND position($f$(La Villa Coliving) | 1,370 – 1,430 CHF, all inclusive |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |$r$, $f$(La Villa Coliving) | 1 370 – 1 430 CHF, tout inclus |$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$(La Villa Coliving) | 1 290 – 1 430 CHF, tout inclus |$r$ IN content_fr) > 0
  AND position($f$(La Villa Coliving) | 1 370 – 1 430 CHF, tout inclus |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room$r$, $f$(at La Villa Coliving, CHF 1,370 to 1,430 a month for a room$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room$r$ IN content_en) > 0
  AND position($f$(at La Villa Coliving, CHF 1,370 to 1,430 a month for a room$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre$r$, $f$(chez La Villa Coliving, 1 370 à 1 430 CHF par mois pour une chambre$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$(chez La Villa Coliving, 1 290 à 1 430 CHF par mois pour une chambre$r$ IN content_fr) > 0
  AND position($f$(chez La Villa Coliving, 1 370 à 1 430 CHF par mois pour une chambre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file$r$, $f$Ambilly and Annemasse, CHF 1,370 to 1,430 a month all inclusive), the file$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file$r$ IN content_en) > 0
  AND position($f$Ambilly and Annemasse, CHF 1,370 to 1,430 a month all inclusive), the file$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier$r$, $f$Ambilly et Annemasse, 1 370 à 1 430 CHF par mois tout inclus), le dossier$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$Ambilly et Annemasse, 1 290 à 1 430 CHF par mois tout inclus), le dossier$r$ IN content_fr) > 0
  AND position($f$Ambilly et Annemasse, 1 370 à 1 430 CHF par mois tout inclus), le dossier$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee$r$, $f$e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no application fee$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee$r$ IN content_en) > 0
  AND position($f$e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no application fee$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier$r$, $f$ex. La Villa Coliving : 1 370 à 1 430 CHF tout inclus, 0 € de frais de dossier$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$ex. La Villa Coliving : 1 290 à 1 430 CHF tout inclus, 0 € de frais de dossier$r$ IN content_fr) > 0
  AND position($f$ex. La Villa Coliving : 1 370 à 1 430 CHF tout inclus, 0 € de frais de dossier$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |$r$, $f$| All-inclusive premium coliving | 1,370 – 1,430 CHF/month |$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |$r$ IN content_en) > 0
  AND position($f$| All-inclusive premium coliving | 1,370 – 1,430 CHF/month |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |$r$, $f$| Coliving premium tout compris | 1 370 – 1 430 CHF/mois |$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$| Coliving premium tout compris | 1 290 – 1 430 CHF/mois |$r$ IN content_fr) > 0
  AND position($f$| Coliving premium tout compris | 1 370 – 1 430 CHF/mois |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| 500–700 € | 1,290 – 1,430 CHF |$r$, $f$| 500–700 € | 1,370 – 1,430 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| 500–700 € | 1,290 – 1,430 CHF |$r$ IN content_en) > 0
  AND position($f$| 500–700 € | 1,370 – 1,430 CHF |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| 500 – 700 € | 1 290 – 1 430 CHF |$r$, $f$| 500 – 700 € | 1 370 – 1 430 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| 500 – 700 € | 1 290 – 1 430 CHF |$r$ IN content_fr) > 0
  AND position($f$| 500 – 700 € | 1 370 – 1 430 CHF |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving$r$, $f$Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving$r$ IN content_en) > 0
  AND position($f$Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving$r$, $f$Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La Villa Coliving$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Chambre en coliving côté France : 1 290 à 1 430 CHF tout inclus chez La Villa Coliving$r$ IN content_fr) > 0
  AND position($f$Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La Villa Coliving$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$La Villa Coliving | — | — | 1,290 – 1,430 CHF |$r$, $f$La Villa Coliving | — | — | 1,370 – 1,430 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$La Villa Coliving | — | — | 1,290 – 1,430 CHF |$r$ IN content_en) > 0
  AND position($f$La Villa Coliving | — | — | 1,370 – 1,430 CHF |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La Villa Coliving | — | — | 1 290 – 1 430 CHF |$r$, $f$La Villa Coliving | — | — | 1 370 – 1 430 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$La Villa Coliving | — | — | 1 290 – 1 430 CHF |$r$ IN content_fr) > 0
  AND position($f$La Villa Coliving | — | — | 1 370 – 1 430 CHF |$f$ IN content_fr) = 0;

COMMIT;
*/
