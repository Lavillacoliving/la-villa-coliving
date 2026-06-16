-- ════════════════════════════════════════════════════════════════════════
-- FUSION → ou-habiter-frontalier-suisse-villes-france-pas-cher
-- Récupère le contenu UNIQUE de : meilleurs-quartiers-frontaliers-geneve
-- puis insère les sections dans la page CIBLE (avant la conclusion).
-- À LANCER AVANT la dépublication (09) et AVANT le rebuild.
-- Idempotent : ne réinsère pas si déjà présent (garde-fou sur une phrase unique).
-- Aperçu lisible du contenu ajouté : scripts/consolidation/salvage/ou-habiter-frontalier-suisse-villes-france-pas-cher.fr.md / .en.md
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET content_fr = replace(content_fr, $a$## Tableau récapitulatif$a$, $LVfr$## Ambilly — Le charme urbain collé à la frontière

**Frontière à pied** : 5 min · **Temps de trajet Genève** : 10 min en voiture, 20 min en bus · **Loyer studio** : 700-900 €/mois

Ambilly est la commune française la plus proche de la frontière : comptez 5 minutes à pied jusqu'au poste de douane. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.

**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.

## À noter pour Gaillard

- Un **tram Annemasse-Genève** est prévu pour **2027**, en plus du Tram 17 déjà direct sur Genève.
- Gaillard est à **5 min de la douane de Moillesulaz**.

## Tableau récapitulatif$LVfr$),
    content_en = replace(content_en, $b$## Quick comparison$b$, $LVen$## Ambilly — Urban charm right on the border

**Walk to border**: 5 min · **Commute to Geneva**: 10 min by car, 20 min by bus · **Studio rent**: €700-900/month

Ambilly is the closest French town to the border — about a 5-minute walk to the border crossing. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.

**For whom?** Young professionals, car-free workers, urban lifestyle lovers.

## Worth noting for Gaillard

- An **Annemasse-Geneva tram** is planned for **2027**.
- Gaillard is **5 min from the Moillesulaz border crossing**.

## Quick comparison$LVen$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($g$Ambilly — Le charme urbain collé à la frontière$g$ IN content_fr) = 0;   -- garde-fou anti-doublon

-- Contrôle : la phrase-repère doit être présente 1 fois, et la longueur a augmenté.
SELECT slug,
       (position($g2$Ambilly — Le charme urbain collé à la frontière$g2$ IN content_fr) > 0) AS section_inseree,
       length(content_fr) AS len_fr, length(content_en) AS len_en, updated_at
FROM blog_posts WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
