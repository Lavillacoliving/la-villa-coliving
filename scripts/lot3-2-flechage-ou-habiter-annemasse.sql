-- Lot 3.2 — Flécher l'article le plus lu du site vers les money pages Annemasse
-- ============================================================================
-- Contexte : `ou-habiter-frontalier-suisse-villes-france-pas-cher` pèse 375 clics
-- sur 3 mois (FR 168 + EN 207) = 27,5 % de tout le trafic SEO du site. Il pointe
-- déjà vers /lavilla, /lelodge, /candidature et l'observatoire, mais JAMAIS vers
-- /annemasse-colocation ni /chambre-a-louer-annemasse — les pages qui visent
-- « colocation annemasse » (880 recherches/mois) et qui plafonnent aujourd'hui à
-- 20-22 impressions par 28 jours.
--
-- Insertion dans la section 1 (Annemasse), juste après la ligne « Pour qui ? ».
-- Registre « vous » (règle blog). Liens markdown relatifs, comme le reste du fichier.
--
-- Idempotent : le WHERE exige que l'ancre soit présente ET que le lien soit absent.
-- Ancres vérifiées uniques (1 occurrence) le 27/07/2026.
-- ============================================================================

-- 1) FR
UPDATE blog_posts
SET content_fr = REPLACE(
      content_fr,
      '**Pour qui ?** Jeunes pros qui veulent l''efficacité urbaine sans le prix de Genève.',
      '**Pour qui ?** Jeunes pros qui veulent l''efficacité urbaine sans le prix de Genève.'
      || E'\n\n'
      || 'Si c''est votre cas, deux pages vont plus loin que ce comparatif : '
      || '[colocation à Annemasse](/annemasse-colocation), qui détaille les chambres '
      || 'disponibles quartier par quartier, et [chambre à louer à Annemasse]'
      || '(/chambre-a-louer-annemasse), qui compare les formats (studio nu, chambre '
      || 'meublée, coliving tout inclus) à budget égal.'
    ),
    updated_at = NOW()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND content_fr LIKE '%**Pour qui ?** Jeunes pros qui veulent l''efficacité urbaine sans le prix de Genève.%'
  AND content_fr NOT LIKE '%/annemasse-colocation%';

-- 2) EN
UPDATE blog_posts
SET content_en = REPLACE(
      content_en,
      '**For whom?** Young pros who want urban efficiency without Geneva prices.',
      '**For whom?** Young pros who want urban efficiency without Geneva prices.'
      || E'\n\n'
      || 'If that sounds like you, two pages go further than this comparison: '
      || '[shared housing in Annemasse](/en/annemasse-colocation), which lists available '
      || 'rooms neighbourhood by neighbourhood, and [rooms to rent in Annemasse]'
      || '(/en/chambre-a-louer-annemasse), which compares the formats (bare studio, '
      || 'furnished room, all-inclusive coliving) at equal budget.'
    ),
    updated_at = NOW()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND content_en LIKE '%**For whom?** Young pros who want urban efficiency without Geneva prices.%'
  AND content_en NOT LIKE '%/en/annemasse-colocation%';

-- 3) Bonus repéré au passage : la version EN de `coliving-frais-dossier-geneve-annemasse`
--    (l'article que Google a élu sur « colocation geneve ») pointe vers les pages
--    Annemasse en FR mais PAS en EN. Même correctif, même logique.
UPDATE blog_posts
SET content_en = REPLACE(content_en, '](/annemasse-colocation)', '](/en/annemasse-colocation)'),
    updated_at = NOW()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
  AND content_en LIKE '%](/annemasse-colocation)%';

UPDATE blog_posts
SET content_en = REPLACE(content_en, '](/chambre-a-louer-annemasse)', '](/en/chambre-a-louer-annemasse)'),
    updated_at = NOW()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
  AND content_en LIKE '%](/chambre-a-louer-annemasse)%';

-- ============================================================================
-- VÉRIFICATION (à exécuter après)
-- ============================================================================
-- SELECT slug,
--        (content_fr LIKE '%/annemasse-colocation%')        AS fr_annemasse,
--        (content_fr LIKE '%/chambre-a-louer-annemasse%')   AS fr_chambre,
--        (content_en LIKE '%/en/annemasse-colocation%')     AS en_annemasse,
--        (content_en LIKE '%/en/chambre-a-louer-annemasse%') AS en_chambre,
--        array_length(regexp_split_to_array(content_fr,'\s+'),1) AS mots_fr
-- FROM blog_posts
-- WHERE slug IN ('ou-habiter-frontalier-suisse-villes-france-pas-cher',
--                'coliving-frais-dossier-geneve-annemasse');
--
-- Attendu : 4 colonnes booléennes à true sur les deux lignes.
-- Puis relancer le prérendu (Action prerender) pour que les liens soient dans le HTML servi.
