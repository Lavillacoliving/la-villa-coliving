-- ════════════════════════════════════════════════════════════════════════
-- CORRECTIF P0-3 — Plafond 3e pilier 3a : 7 056 → 7 258 CHF
-- Date : 2026-06-08
-- Slug : fiscalite-frontalier-geneve-impots-2026
-- ────────────────────────────────────────────────────────────────────────
-- POURQUOI : le plafond 3a 2026 (avec caisse de pension / LPP) est de
-- 7 258 CHF, pas 7 056. Sources : Raiffeisen, UBS, AXA, ch.ch (inchangé
-- depuis 2025). On corrige le plafond ET le calcul d'économie associé
-- (15 % de 7 258 ≈ 1 089 CHF/an ≈ 91 CHF/mois).
-- REMARQUE : « 7 258 » apparaît déjà ailleurs dans l'article (nets de salaire)
-- → le REPLACE de « 7 056 » ne touche QUE les 2 mentions du plafond 3a.
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET
  content_fr = REPLACE(REPLACE(REPLACE(
                 content_fr,
                 '7 056', '7 258'),
                 '1 060 CHF d''économie', '1 089 CHF d''économie'),
                 'soit 88 CHF par mois', 'soit 91 CHF par mois'),
  content_en = REPLACE(REPLACE(REPLACE(
                 content_en,
                 '7,056', '7,258'),
                 '1,060 CHF in tax savings', '1,089 CHF in tax savings'),
                 'or 88 CHF per month', 'or 91 CHF per month'),
  updated_at = NOW()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';

-- ─── Vérification (attendu : ancien=false, nouveau=true) ───
SELECT
  slug,
  (content_fr LIKE '%7 056%')  AS fr_contient_encore_7056,  -- attendu : false
  (content_fr LIKE '%7 258 CHF par an%') AS fr_plafond_7258, -- attendu : true
  (content_en LIKE '%7,056%')  AS en_contient_encore_7056,  -- attendu : false
  (content_en LIKE '%7,258 CHF per year%') AS en_plafond_7258, -- attendu : true
  updated_at
FROM blog_posts
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
