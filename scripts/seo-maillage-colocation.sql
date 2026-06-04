-- ============================================================
-- C5 — Maillage interne « colocation Genève » → /colocation-geneve
-- Projet : tefpynkdxxfiefpkgitz  (⚠️ vérifie le bon projet)
-- But : faire passer du jus SEO depuis les 2 articles à fortes impressions
--       vers la page money /colocation-geneve, avec une ancre ciblée.
-- Méthode : on APPEND un encart-lien en bas du contenu (sûr, idempotent —
--           pas de REPLACE risqué). Re-lançable sans doublon (garde le WHERE).
-- Lancer : Supabase → SQL Editor → New query → coller → Run.
-- ============================================================

UPDATE blog_posts SET
  content_fr = COALESCE(content_fr, '') ||
    E'\n\n---\n\n👉 **Vous cherchez une [colocation à Genève](/colocation-geneve) ?** Découvrez nos 3 maisons tout inclus dès 1 380 CHF/mois.',
  content_en = COALESCE(content_en, '') ||
    E'\n\n---\n\n👉 **Looking for [shared housing near Geneva](/colocation-geneve)?** Discover our 3 all-inclusive houses from CHF 1,380/month.'
WHERE slug IN ('meilleurs-quartiers-frontaliers-geneve', 'budget-colocation-geneve-guide-complet')
  AND content_fr NOT LIKE '%[colocation à Genève](/colocation-geneve)%';

-- contrôle : les 2 articles doivent contenir le lien ancré
SELECT slug,
       (content_fr LIKE '%[colocation à Genève](/colocation-geneve)%') AS lien_fr_ok,
       (content_en LIKE '%(/colocation-geneve)%')                      AS lien_en_ok
FROM blog_posts
WHERE slug IN ('meilleurs-quartiers-frontaliers-geneve', 'budget-colocation-geneve-guide-complet');
