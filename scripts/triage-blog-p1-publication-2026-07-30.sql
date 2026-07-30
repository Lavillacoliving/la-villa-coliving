-- Triage des 21 brouillons blog (brief 27/07) — SQL appliqué en prod le 30/07/2026
-- Trace des opérations exécutées via MCP Supabase (déjà appliquées, ne pas rejouer).
-- Les contenus des 3 articles P1 ont été réécrits au préalable (tutoiement, metas FR+EN,
-- maillage money pages, fact-check) directement dans blog_posts.

-- 1) Archivage des 14 brouillons morts (tag 'archive', lignes conservées)
update blog_posts set tags = array_append(tags, 'archive'), updated_at = now()
where is_published = false
  and not ('archive' = any(coalesce(tags, '{}')))
  and slug in (
    'coliving-premium-frontaliers-geneve-annemasse',
    'coliving-annemasse-frontaliers-geneve',
    'coliving-premium-annemasse-le-lodge-art-de-vivre',
    'loyer-frontalier-geneve-combien-payer',
    'economies-coliving-tout-inclus-geneve',
    'what-is-coliving-and-why-it-matters',
    'coliving-tendance-habitat-jeunes-professionnels-2024',
    'vie-communautaire-coliving-temoignages',
    'avantages-coliving-jeunes-professionnels',
    '5-erreurs-logement-frontalier-geneve',
    'geneve-sans-voiture-mobilite-douce-frontaliers',
    'arriver-seul-geneve-guide-30-jours',
    'coliving-travail-distance-geneve',
    'meilleurs-quartiers-frontaliers-geneve'
  );

-- 2) Suppression du brouillon 3e-pilier (fusion fiscale Lot 3.3 fait foi ; aucune réf blog_calendar)
delete from blog_posts where slug = '3e-pilier-frontalier-geneve' and is_published = false;

-- 3) Publication des 3 P1 (après retrait des 308 correspondantes dans vercel.json)
update blog_posts set is_published = true, published_at = now(), updated_at = now()
where slug in (
  'temps-trajet-annemasse-geneve-par-quartier',
  'lodge-annemasse-coliving-premium-portes-geneve',
  'coliving-communaute-reels-amis-geneve-annemasse'
) and is_published = false;
