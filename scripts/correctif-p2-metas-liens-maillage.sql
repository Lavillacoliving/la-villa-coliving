-- ════════════════════════════════════════════════════════════════════════
-- CORRECTIF P2 — Métas « IA » + liens morts + maillage interne
-- Date : 2026-06-08
-- 3 sections, exécutables d'un coup dans Supabase > SQL Editor.
-- ════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────
-- SECTION A — Réécriture des 6 méta-descriptions à signature « IA »
-- (« révolution », « transforme », « Découvrez », « solution moderne »,
--  « change tout ») → accroches concrètes, sans survente. FR + EN.
-- ─────────────────────────────────────────────────────────────────────

UPDATE blog_posts SET
  meta_description_fr = $m$Annemasse, 20 min de Cornavin en Léman Express : pourquoi des frontaliers y choisissent le coliving plutôt qu'un studio à Genève. Loyers, communauté, ce qui est inclus.$m$,
  meta_description_en = $e$Annemasse, 20 min from Cornavin by Léman Express: why cross-border workers pick coliving over a Geneva studio. Rents, community, what's included.$e$,
  updated_at = NOW()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages';

UPDATE blog_posts SET
  meta_description_fr = $m$Chambre meublée à Annemasse, Ville-la-Grand ou Ambilly : les vrais prix 2026, où chercher, et les pièges à éviter côté frontalier.$m$,
  meta_description_en = $e$Furnished room in Annemasse, Ville-la-Grand or Ambilly: real 2026 prices, where to look, and the cross-border pitfalls to avoid.$e$,
  updated_at = NOW()
WHERE slug = 'chambre-meublee-annemasse-geneve';

UPDATE blog_posts SET
  meta_description_fr = $m$Réseau, services tout inclus, stabilité, bien-être : les avantages concrets du coliving pour un jeune pro frontalier près de Genève.$m$,
  meta_description_en = $e$Network, all-inclusive services, stability, wellbeing: the concrete benefits of coliving for a young cross-border professional near Geneva.$e$,
  updated_at = NOW()
WHERE slug = 'avantages-coliving-jeunes-professionnels';

UPDATE blog_posts SET
  meta_description_fr = $m$Le coliving séduit les jeunes pros : effet de mode ou tendance de fond ? Ce qu'il apporte vraiment (budget, communauté, services) et ses limites.$m$,
  meta_description_en = $e$Coliving attracts young professionals: passing fad or lasting trend? What it really offers (budget, community, services) and its limits.$e$,
  updated_at = NOW()
WHERE slug = 'coliving-tendance-habitat-jeunes-professionnels-2024';

UPDATE blog_posts SET
  meta_description_fr = $m$Grand Genève 2026 : transports (tram, Léman Express), projets urbains et fiscalité — les nouveautés qui changent le quotidien des frontaliers.$m$,
  meta_description_en = $e$Greater Geneva 2026: transport (tram, Léman Express), urban projects and taxation — the updates that change cross-border workers' daily life.$e$,
  updated_at = NOW()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers';

UPDATE blog_posts SET
  meta_description_fr = $m$Le guide complet du coliving pour frontaliers genevois : économies, communauté et services tout inclus près de Genève dès 1 380 CHF/mois.$m$,
  meta_description_en = $e$The complete coliving guide for Geneva cross-border workers: savings, community and all-inclusive services near Geneva from 1,380 CHF/month.$e$,
  updated_at = NOW()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet';

-- ─────────────────────────────────────────────────────────────────────
-- SECTION B — Liens morts dans l'article « frais-dossier »
-- 2 slugs inexistants -> redirigés vers les articles vivants équivalents.
-- ─────────────────────────────────────────────────────────────────────

UPDATE blog_posts SET
  content_fr = REPLACE(REPLACE(content_fr,
    '/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier', '/blog/coliving-vs-colocation-differences'),
    '/blog/annemasse-coliving-geneve-frontaliers-guide-complet', '/blog/coliving-annemasse-geneve-frontaliers-avantages'),
  content_en = REPLACE(REPLACE(content_en,
    '/en/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier', '/en/blog/coliving-vs-colocation-differences'),
    '/en/blog/annemasse-coliving-geneve-frontaliers-guide-complet', '/en/blog/coliving-annemasse-geneve-frontaliers-avantages'),
  updated_at = NOW()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse';

-- ─────────────────────────────────────────────────────────────────────
-- SECTION C — Maillage : 2 articles « quartiers » étaient orphelins
-- (0 lien interne). On ajoute un bloc « À lire aussi » vers le pilier
-- (meilleurs-quartiers) + voisins. Guard anti-doublon (NOT LIKE).
-- ─────────────────────────────────────────────────────────────────────

UPDATE blog_posts SET
  content_fr = content_fr || $$

---

*À lire aussi :*
- [Les meilleurs quartiers frontaliers de Genève](/blog/meilleurs-quartiers-frontaliers-geneve)
- [Coliving à Annemasse : les avantages pour frontaliers](/blog/coliving-annemasse-geneve-frontaliers-avantages)
- [Quel loyer quand on est frontalier à Genève ?](/blog/loyer-frontalier-geneve-combien-payer)
- [Frontalier Genève : guide complet 2026](/blog/living-in-france-working-in-geneva)$$,
  content_en = content_en || $$

---

*Also read:*
- [The best cross-border neighborhoods near Geneva](/en/blog/meilleurs-quartiers-frontaliers-geneve)
- [Coliving in Annemasse: the benefits for cross-border workers](/en/blog/coliving-annemasse-geneve-frontaliers-avantages)
- [How much rent as a Geneva cross-border worker?](/en/blog/loyer-frontalier-geneve-combien-payer)
- [Living in France, Working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)$$,
  updated_at = NOW()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND content_fr NOT LIKE '%meilleurs-quartiers-frontaliers-geneve%';

UPDATE blog_posts SET
  content_fr = content_fr || $$

---

*À lire aussi :*
- [Les meilleurs quartiers frontaliers de Genève](/blog/meilleurs-quartiers-frontaliers-geneve)
- [Où habiter côté France quand on est frontalier ?](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Chambre meublée à Annemasse près de Genève](/blog/chambre-meublee-annemasse-geneve)
- [Frontalier Genève : guide complet 2026](/blog/living-in-france-working-in-geneva)$$,
  content_en = content_en || $$

---

*Also read:*
- [The best cross-border neighborhoods near Geneva](/en/blog/meilleurs-quartiers-frontaliers-geneve)
- [Where to live on the French side as a cross-border worker?](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Furnished room in Annemasse near Geneva](/en/blog/chambre-meublee-annemasse-geneve)
- [Living in France, Working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)$$,
  updated_at = NOW()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND content_fr NOT LIKE '%meilleurs-quartiers-frontaliers-geneve%';

-- ─────────────────────────────────────────────────────────────────────
-- Vérification
-- ─────────────────────────────────────────────────────────────────────
SELECT slug,
  (meta_description_fr LIKE '%révolution%' OR meta_description_fr LIKE '%Découvrez%'
   OR meta_description_fr LIKE '%solution moderne%' OR meta_description_fr LIKE '%change tout%'
   OR meta_description_fr LIKE '%transforme%') AS meta_encore_IA
FROM blog_posts
WHERE slug IN ('coliving-annemasse-geneve-frontaliers-avantages','chambre-meublee-annemasse-geneve',
  'avantages-coliving-jeunes-professionnels','coliving-tendance-habitat-jeunes-professionnels-2024',
  'grand-geneve-2026-nouveautes-frontaliers','coliving-geneve-frontaliers-guide-complet')
ORDER BY slug;
-- (toutes les lignes doivent afficher meta_encore_IA = false)

SELECT 'liens morts restants' AS check,
  (content_fr LIKE '%choisir-mode-vie-geneve-frontalier%'
   OR content_fr LIKE '%annemasse-coliving-geneve-frontaliers-guide-complet%') AS fr_lien_mort
FROM blog_posts WHERE slug='coliving-frais-dossier-geneve-annemasse';
-- (fr_lien_mort doit être false)

SELECT slug, (content_fr LIKE '%À lire aussi%') AS a_maillage
FROM blog_posts
WHERE slug IN ('ou-habiter-frontalier-suisse-villes-france-pas-cher','coliving-annemasse-geneve-frontaliers-avantages')
ORDER BY slug;
-- (a_maillage doit être true pour les deux)
