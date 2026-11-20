-- ============================================================================
-- L'Appart (Lot 4, étape E5) — SQL n° 10a : le créneau « dossier » de dossier-location-frontalier-suisse-france nomme aussi L'Appart (décision n° 23 de la critique du 13/11/2026, à confirmer).
-- Généré le 2026-11-19T16:51:07.517Z par scripts/build-slots-sql.mjs depuis scripts/lappart-creneau-dossier.edits.mjs
--   · texte = source unique src/data/answerSlots.ts (adminSlotSentence('dossier')) ; ancien = la même phrase sans L'Appart ; fourchette des maisons en jeton {{PRIX_FOURCHETTE}} (état après le SQL 3 bis du Lot 1) (OU_CHERCHER_VERSION 2026-11-20)
--   · ancres vérifiées sur le fichier posts-apres-3bis.json (HORS LIGNE — ne pas appliquer ce SQL, régénérer sans --posts-json) : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer JUSTE AVANT la fusion du code de L'Appart (la garde check:slots exige la phrase de la source dans l'article). Les autres phrases d'articles de L'Appart (SQL n° 10) partent après la bascule.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : guillemets « » et accents — ne pas normaliser.
-- 2 modifications · 1 articles · état en base à la génération (updated_at · longueur fr / en) :
--   dossier-location-frontalier-suisse-france · 2026-11-19T14:26:48.508096+00:00 · 9013 / 8362
-- ============================================================================

BEGIN;

-- [1/2] dossier-location-frontalier-suisse-france (fr) · adminSlot · créneau « dossier » (check:slots, adminSlot:dossier) : trois maisons de coliving et L'Appart
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Chez La Villa Coliving (trois maisons à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.$f$, $r$Chez La Villa Coliving (trois maisons de coliving à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus, et une colocation à Annemasse dès 730 CHF par mois), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$Chez La Villa Coliving (trois maisons à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.$f$ IN content_fr) > 0
  AND position($r$Chez La Villa Coliving (trois maisons de coliving à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus, et une colocation à Annemasse dès 730 CHF par mois), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.$r$ IN content_fr) = 0;

-- [2/2] dossier-location-frontalier-suisse-france (en) · adminSlot · créneau « dossier » (check:slots, adminSlot:dossier) : trois maisons de coliving et L'Appart
UPDATE blog_posts
SET content_en = replace(content_en, $f$At La Villa Coliving (three houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.$f$, $r$At La Villa Coliving (three coliving houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive, and a flatshare in Annemasse from CHF 730 a month), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$At La Villa Coliving (three houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.$f$ IN content_en) > 0
  AND position($r$At La Villa Coliving (three coliving houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive, and a flatshare in Annemasse from CHF 730 a month), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] dossier-location-frontalier-suisse-france/fr · adminSlot : « Chez La Villa Coliving (trois maisons à Ville-la-Grand, Ambilly et Anne… » → « Chez La Villa Coliving (trois maisons de coliving à Ville-la-Grand, Amb… »
-- [2] dossier-location-frontalier-suisse-france/en · adminSlot : « At La Villa Coliving (three houses in Ville-la-Grand, Ambilly and Annem… » → « At La Villa Coliving (three coliving houses in Ville-la-Grand, Ambilly … »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$Chez La Villa Coliving (trois maisons à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$At La Villa Coliving (three houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('dossier-location-frontalier-suisse-france')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$At La Villa Coliving (three coliving houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive, and a flatshare in Annemasse from CHF 730 a month), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.$r$, $f$At La Villa Coliving (three houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$At La Villa Coliving (three coliving houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive, and a flatshare in Annemasse from CHF 730 a month), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.$r$ IN content_en) > 0
  AND position($f$At La Villa Coliving (three houses in Ville-la-Grand, Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Chez La Villa Coliving (trois maisons de coliving à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus, et une colocation à Annemasse dès 730 CHF par mois), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.$r$, $f$Chez La Villa Coliving (trois maisons à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$Chez La Villa Coliving (trois maisons de coliving à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus, et une colocation à Annemasse dès 730 CHF par mois), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.$r$ IN content_fr) > 0
  AND position($f$Chez La Villa Coliving (trois maisons à Ville-la-Grand, Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges.$f$ IN content_fr) = 0;

COMMIT;
*/
