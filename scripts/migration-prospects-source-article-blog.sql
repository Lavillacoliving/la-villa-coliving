-- ════════════════════════════════════════════════════════════════════════
-- Migration : prospects_source_check — ajout de « article_blog » et « google »
-- Plan blog-conversion 07/07/2026 (attribution blog → BDD)
--
-- Avant : le canal déclaré par le candidat partait dans `notes` et
-- prospects.source valait toujours 'site_web'. Désormais l'Edge Function
-- mappe le canal déclaré (et l'origine bloc offre) vers source — il faut
-- que la contrainte accepte les 2 nouvelles valeurs.
--
-- ⚠️ À exécuter AVANT le recollage de l'Edge Function (sinon son filet de
-- sécurité retombe sur site_web — aucune candidature perdue, mais
-- l'attribution reste dégradée en attendant).
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE prospects DROP CONSTRAINT IF EXISTS prospects_source_check;

ALTER TABLE prospects ADD CONSTRAINT prospects_source_check
  CHECK (source IN (
    'site_web',
    'article_blog',   -- nouveau : lecteur venu d'un article (déclaré ou bloc offre)
    'google',         -- nouveau : recherche Google déclarée par le candidat
    'facebook',
    'instagram',
    'whatsapp',
    'messenger',
    'leboncoin',
    'appartager',
    'roomlala',
    'bouche_a_oreille',
    'email',
    'autre'
  ));

-- Vérification 1 : la contrainte liste bien 13 valeurs dont les 2 nouvelles
SELECT pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conname = 'prospects_source_check';

-- Vérification 2 : test d'insertion/rollback (ne laisse AUCUNE trace)
BEGIN;
INSERT INTO prospects (first_name, last_name, email, phone, source, status)
VALUES ('ZZTEST', 'MigrationSource', 'zztest-migration@example.com', '+33000000000', 'article_blog', 'new');
ROLLBACK;

-- Si les deux blocs passent sans erreur : migration OK.
