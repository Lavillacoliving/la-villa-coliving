-- ════════════════════════════════════════════════════════════════════════
-- CORRECTIF P1 — Chiffres de marché coliving Europe (figures non sourcées)
-- Date : 2026-06-08
-- Slug : coliving-vs-colocation-differences
-- ────────────────────────────────────────────────────────────────────────
-- POURQUOI : « Plus de 30 000 lits … (source : JLL, CBRE) » n'est pas
-- confirmé par une source nominative. Le JLL European Coliving Index recense
-- ~23 150 lits (construits ou en pipeline) en Europe, et aucune attribution
-- CBRE n'est retrouvée. → On corrige le chiffre et on retire « CBRE ».
-- La ligne « 15-20 % de croissance » est conservée (pas de source nominative à
-- défendre dessus).
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$- **Plus de 30 000 lits** en coliving professionnel en Europe en 2025 (source : JLL, CBRE)$o$,
    $n$- **~23 150 lits** en coliving en Europe, construits ou en cours de développement (source : JLL European Coliving Index)$n$),
  content_en = REPLACE(content_en,
    $oe$with over 30,000 professional coliving beds across Europe.$oe$,
    $ne$with around 23,150 coliving beds across Europe, built or in the development pipeline (source: JLL European Coliving Index).$ne$),
  updated_at = NOW()
WHERE slug = 'coliving-vs-colocation-differences';

-- ─── Vérification (ancien=false, nouveau=true) ───
SELECT
  slug,
  (content_fr LIKE '%30 000 lits%')   AS fr_vieux_30000,   -- false
  (content_fr LIKE '%CBRE%')          AS fr_cbre_present,  -- false
  (content_fr LIKE '%23 150%')        AS fr_23150,         -- true
  (content_en LIKE '%30,000 professional%') AS en_vieux_30000, -- false
  (content_en LIKE '%23,150%')        AS en_23150,         -- true
  updated_at
FROM blog_posts
WHERE slug = 'coliving-vs-colocation-differences';
