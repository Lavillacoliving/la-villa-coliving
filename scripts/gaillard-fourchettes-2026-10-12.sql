-- ============================================================================
-- Lot du 12/10/2026 (2e réponse) : Gaillard retiré du corps de ou-habiter (Ambilly en 3), fourchettes de colocation-annemasse alignées sur 700 à 1 000 €.
-- Généré le 2026-10-12T10:13:26.819Z par scripts/build-slots-sql.mjs depuis scripts/gaillard-fourchettes.edits.mjs
--   · chaînes relevées sur la base vivante le 12/10 ; fourchette = MARKET_ROOM_EUR (src/data/stats.ts)
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-10-12T10:13:26.816Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Indépendant du code ; republication par le bot au prochain push ou cron.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 — ne pas normaliser les espaces.
-- 19 modifications · 2 articles · état en base à la génération (updated_at · longueur fr / en) :
--   colocation-annemasse-ville-la-grand-ambilly · 2026-10-12T08:41:56.358413+00:00 · 8621 / 7689
--   ou-habiter-frontalier-suisse-villes-france-pas-cher · 2026-10-12T08:59:28.760999+00:00 · 9618 / 9019
-- ============================================================================

BEGIN;

-- [1/19] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · FAITS · Gaillard retiré : la section 3 devient Ambilly (déplacée depuis sa section non numérotée)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## 3. Gaillard — La frontière à pied

**Distance Genève** : 3 km · **Temps de trajet** : 10 min en bus, 25 min à vélo · **Loyer T2** : 800-1 050 €/mois

Gaillard touche littéralement la frontière. Tu peux traverser à pied vers le quartier des Eaux-Vives ou Champel. Cher mais pratique.

**Pour qui ?** Frontaliers sans voiture qui travaillent dans le centre de Genève.

$f$, $r$## 3. Ambilly — Le charme urbain collé à la frontière

**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois

Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.

**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.

$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$## 3. Gaillard — La frontière à pied

**Distance Genève** : 3 km · **Temps de trajet** : 10 min en bus, 25 min à vélo · **Loyer T2** : 800-1 050 €/mois

Gaillard touche littéralement la frontière. Tu peux traverser à pied vers le quartier des Eaux-Vives ou Champel. Cher mais pratique.

**Pour qui ?** Frontaliers sans voiture qui travaillent dans le centre de Genève.

$f$ IN content_fr) > 0
  AND position($r$## 3. Ambilly — Le charme urbain collé à la frontière

**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois

Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.

**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.

$r$ IN content_fr) = 0;

-- [2/19] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · FAITS · ancienne section Ambilly retirée (déplacée en 3) ; « À noter pour Gaillard » → « À noter », puce Gaillard retirée
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## Ambilly — Le charme urbain collé à la frontière

**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois

Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.

**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.

## À noter pour Gaillard

- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).
- Gaillard est à **5 min de la douane de Moillesulaz**.

$f$, $r$## À noter

- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).

$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$## Ambilly — Le charme urbain collé à la frontière

**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois

Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.

**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.

## À noter pour Gaillard

- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).
- Gaillard est à **5 min de la douane de Moillesulaz**.

$f$ IN content_fr) > 0
  AND position($r$## À noter

- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).

$r$ IN content_fr) = 0;

-- [3/19] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · FAITS · tableau récapitulatif : ligne Gaillard → Ambilly (loyer studio, faute de T2 mesuré)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Gaillard | 10-25 min | 800-1 050 € | Frontière à pied |$f$, $r$| Ambilly | Genève-Eaux-Vives en 7 min de Léman Express, 24 min porte-à-porte depuis Le Loft | 700-900 € (studio) | Tram 17, frontière à pied |$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$| Gaillard | 10-25 min | 800-1 050 € | Frontière à pied |$f$ IN content_fr) > 0
  AND position($r$| Ambilly | Genève-Eaux-Vives en 7 min de Léman Express, 24 min porte-à-porte depuis Le Loft | 700-900 € (studio) | Tram 17, frontière à pied |$r$ IN content_fr) = 0;

-- [4/19] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · FAITS · En résumé : Gaillard → Ambilly
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- **Sans voiture, centre Genève** : Gaillard ou Annemasse$f$, $r$- **Sans voiture, centre Genève** : Ambilly ou Annemasse$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$- **Sans voiture, centre Genève** : Gaillard ou Annemasse$f$ IN content_fr) > 0
  AND position($r$- **Sans voiture, centre Genève** : Ambilly ou Annemasse$r$ IN content_fr) = 0;

-- [5/19] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · FAITS · Gaillard removed: section 3 becomes Ambilly (moved from its unnumbered section)
UPDATE blog_posts
SET content_en = replace(content_en, $f$## 3. Gaillard — The walk-across border

**Distance to Geneva**: 3 km · **Commute**: 10 min by bus, 25 min by bike · **2-room rent**: €800-1,050/month

Gaillard literally touches the border. You can walk across to Eaux-Vives or Champel. Pricey but practical.

**For whom?** Car-free workers commuting to central Geneva.

$f$, $r$## 3. Ambilly — Urban charm right on the border

**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month

Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.

**For whom?** Young professionals, car-free workers, urban lifestyle lovers.

$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$## 3. Gaillard — The walk-across border

**Distance to Geneva**: 3 km · **Commute**: 10 min by bus, 25 min by bike · **2-room rent**: €800-1,050/month

Gaillard literally touches the border. You can walk across to Eaux-Vives or Champel. Pricey but practical.

**For whom?** Car-free workers commuting to central Geneva.

$f$ IN content_en) > 0
  AND position($r$## 3. Ambilly — Urban charm right on the border

**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month

Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.

**For whom?** Young professionals, car-free workers, urban lifestyle lovers.

$r$ IN content_en) = 0;

-- [6/19] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · FAITS · old Ambilly section removed (moved to 3); « Worth noting for Gaillard » → « Worth noting », Gaillard bullet removed
UPDATE blog_posts
SET content_en = replace(content_en, $f$## Ambilly — Urban charm right on the border

**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month

Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.

**For whom?** Young professionals, car-free workers, urban lifestyle lovers.

## Worth noting for Gaillard

- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).
- Gaillard is **5 min from the Moillesulaz border crossing**.

$f$, $r$## Worth noting

- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).

$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$## Ambilly — Urban charm right on the border

**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month

Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.

**For whom?** Young professionals, car-free workers, urban lifestyle lovers.

## Worth noting for Gaillard

- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).
- Gaillard is **5 min from the Moillesulaz border crossing**.

$f$ IN content_en) > 0
  AND position($r$## Worth noting

- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).

$r$ IN content_en) = 0;

-- [7/19] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · FAITS · quick comparison: Gaillard row → Ambilly (studio rent, no measured 2-room figure)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Gaillard | 10-25 min | €800-1,050 | Walk across the border |$f$, $r$| Ambilly | Geneva Eaux-Vives in 7 min by Léman Express, 24 min door to door from Le Loft | €700-900 (studio) | Tram 17, walk to the border |$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$| Gaillard | 10-25 min | €800-1,050 | Walk across the border |$f$ IN content_en) > 0
  AND position($r$| Ambilly | Geneva Eaux-Vives in 7 min by Léman Express, 24 min door to door from Le Loft | €700-900 (studio) | Tram 17, walk to the border |$r$ IN content_en) = 0;

-- [8/19] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · FAITS · TL;DR: Gaillard → Ambilly
UPDATE blog_posts
SET content_en = replace(content_en, $f$- **Car-free, central Geneva**: Gaillard or Annemasse$f$, $r$- **Car-free, central Geneva**: Ambilly or Annemasse$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$- **Car-free, central Geneva**: Gaillard or Annemasse$f$ IN content_en) > 0
  AND position($r$- **Car-free, central Geneva**: Ambilly or Annemasse$r$ IN content_en) = 0;

-- [9/19] ou-habiter-frontalier-suisse-villes-france-pas-cher (en, excerpt_en) · FAITS · extrait EN : liste exacte des 7 villes (Ambilly remplace Gaillard)
UPDATE blog_posts
SET excerpt_en = replace(excerpt_en, $f$Annemasse, Ville-la-Grand, Saint-Julien, Ferney-Voltaire, Thonon, Divonne and more$f$, $r$Annemasse, Ville-la-Grand, Ambilly, Saint-Julien, Ferney-Voltaire, Thonon, Divonne$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Annemasse, Ville-la-Grand, Saint-Julien, Ferney-Voltaire, Thonon, Divonne and more$f$ IN excerpt_en) > 0
  AND position($r$Annemasse, Ville-la-Grand, Ambilly, Saint-Julien, Ferney-Voltaire, Thonon, Divonne$r$ IN excerpt_en) = 0;

-- [10/19] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · zones : fourchette canonique (700 à 1 000 €, décision Jérôme 12/10) en tête de section, prix CHF par zone retirés
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## Les bonnes zones

**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant,$f$, $r$## Les bonnes zones

Dans ces quatre zones, compte 700 à 1 000 € par mois pour une chambre en colocation, selon l'annonce.

**Annemasse centre (près de la gare)** : Vibrant,$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$## Les bonnes zones

**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant,$f$ IN content_fr) > 0
  AND position($r$## Les bonnes zones

Dans ces quatre zones, compte 700 à 1 000 € par mois pour une chambre en colocation, selon l'annonce.

**Annemasse centre (près de la gare)** : Vibrant,$r$ IN content_fr) = 0;

-- [11/19] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · zones : prix CHF retiré (Annemasse Nord)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Annemasse Nord** : Prix : 950-1250 CHF. 10$f$, $r$**Annemasse Nord** : 10$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Annemasse Nord** : Prix : 950-1250 CHF. 10$f$ IN content_fr) > 0
  AND position($r$**Annemasse Nord** : 10$r$ IN content_fr) = 0;

-- [12/19] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · zones : prix CHF retiré (Ville-la-Grand)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Ville-la-Grand** : Prix : 900-1250 CHF. Plus$f$, $r$**Ville-la-Grand** : Plus$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Ville-la-Grand** : Prix : 900-1250 CHF. Plus$f$ IN content_fr) > 0
  AND position($r$**Ville-la-Grand** : Plus$r$ IN content_fr) = 0;

-- [13/19] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · zones : prix CHF retiré (Ambilly)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Ambilly** : Prix : 850-1150 CHF. Très$f$, $r$**Ambilly** : Très$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Ambilly** : Prix : 850-1150 CHF. Très$f$ IN content_fr) > 0
  AND position($r$**Ambilly** : Très$r$ IN content_fr) = 0;

-- [14/19] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · tableau des prix : chambre en colocation alignée sur 700-1 000 €
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Chambre en colocation classique | 550-800 €/mois (charges parfois en sus) |$f$, $r$| Chambre en colocation classique | 700-1 000 €/mois (charges parfois en sus) |$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$| Chambre en colocation classique | 550-800 €/mois (charges parfois en sus) |$f$ IN content_fr) > 0
  AND position($r$| Chambre en colocation classique | 700-1 000 €/mois (charges parfois en sus) |$r$ IN content_fr) = 0;

-- [15/19] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · zones: canonical range (€700 to €1,000) at the top, per-zone CHF prices removed
UPDATE blog_posts
SET content_en = replace(content_en, $f$## Best Zones

**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant,$f$, $r$## Best Zones

In these four areas, expect €700 to €1,000 a month for a room in a flatshare, depending on the listing.

**Annemasse center (near station)**: Vibrant,$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$## Best Zones

**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant,$f$ IN content_en) > 0
  AND position($r$## Best Zones

In these four areas, expect €700 to €1,000 a month for a room in a flatshare, depending on the listing.

**Annemasse center (near station)**: Vibrant,$r$ IN content_en) = 0;

-- [16/19] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · zones: CHF price removed (Annemasse North)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Annemasse North**: Price: 950-1250 CHF. 10$f$, $r$**Annemasse North**: 10$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Annemasse North**: Price: 950-1250 CHF. 10$f$ IN content_en) > 0
  AND position($r$**Annemasse North**: 10$r$ IN content_en) = 0;

-- [17/19] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · zones: CHF price removed (Ville-la-Grand)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Ville-la-Grand**: Price: 900-1250 CHF. More$f$, $r$**Ville-la-Grand**: More$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Ville-la-Grand**: Price: 900-1250 CHF. More$f$ IN content_en) > 0
  AND position($r$**Ville-la-Grand**: More$r$ IN content_en) = 0;

-- [18/19] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · zones: CHF price removed (Ambilly)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Ambilly**: Price: 850-1150 CHF. Very$f$, $r$**Ambilly**: Very$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Ambilly**: Price: 850-1150 CHF. Very$f$ IN content_en) > 0
  AND position($r$**Ambilly**: Very$r$ IN content_en) = 0;

-- [19/19] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · price table: flatshare room aligned on 700-1,000 €
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Room in a traditional flatshare | 550-800 €/month (charges sometimes extra) |$f$, $r$| Room in a traditional flatshare | 700-1,000 €/month (charges sometimes extra) |$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$| Room in a traditional flatshare | 550-800 €/month (charges sometimes extra) |$f$ IN content_en) > 0
  AND position($r$| Room in a traditional flatshare | 700-1,000 €/month (charges sometimes extra) |$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · FAITS : « ## 3. Gaillard — La frontière à pied⏎⏎**Distance Genève** : 3 km · **Te… » → « ## 3. Ambilly — Le charme urbain collé à la frontière⏎⏎**Frontière à pi… »
-- [2] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · FAITS : « ## Ambilly — Le charme urbain collé à la frontière⏎⏎**Frontière à pied*… » → « ## À noter⏎⏎- Le **Tram 17**, déjà direct sur Genève, est **prolongé da… »
-- [3] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · FAITS : « | Gaillard | 10-25 min | 800-1 050 € | Frontière à pied | » → « | Ambilly | Genève-Eaux-Vives en 7 min de Léman Express, 24 min porte-à… »
-- [4] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · FAITS : « - **Sans voiture, centre Genève** : Gaillard ou Annemasse » → « - **Sans voiture, centre Genève** : Ambilly ou Annemasse »
-- [5] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · FAITS : « ## 3. Gaillard — The walk-across border⏎⏎**Distance to Geneva**: 3 km ·… » → « ## 3. Ambilly — Urban charm right on the border⏎⏎**Walk to border**: 8 … »
-- [6] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · FAITS : « ## Ambilly — Urban charm right on the border⏎⏎**Walk to border**: 8 min… » → « ## Worth noting⏎⏎- **Tram 17**, already direct to Geneva, is **extended… »
-- [7] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · FAITS : « | Gaillard | 10-25 min | €800-1,050 | Walk across the border | » → « | Ambilly | Geneva Eaux-Vives in 7 min by Léman Express, 24 min door to… »
-- [8] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · FAITS : « - **Car-free, central Geneva**: Gaillard or Annemasse » → « - **Car-free, central Geneva**: Ambilly or Annemasse »
-- [9] ou-habiter-frontalier-suisse-villes-france-pas-cher/en, excerpt_en · FAITS : « Annemasse, Ville-la-Grand, Saint-Julien, Ferney-Voltaire, Thonon, Divon… » → « Annemasse, Ville-la-Grand, Ambilly, Saint-Julien, Ferney-Voltaire, Thon… »
-- [10] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « ## Les bonnes zones⏎⏎**Annemasse centre (près de la gare)** : Prix : 10… » → « ## Les bonnes zones⏎⏎Dans ces quatre zones, compte 700 à 1 000 € par mo… »
-- [11] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « **Annemasse Nord** : Prix : 950-1250 CHF. 10 » → « **Annemasse Nord** : 10 »
-- [12] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « **Ville-la-Grand** : Prix : 900-1250 CHF. Plus » → « **Ville-la-Grand** : Plus »
-- [13] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « **Ambilly** : Prix : 850-1150 CHF. Très » → « **Ambilly** : Très »
-- [14] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « | Chambre en colocation classique | 550-800 €/mois (charges parfois en … » → « | Chambre en colocation classique | 700-1 000 €/mois (charges parfois e… »
-- [15] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « ## Best Zones⏎⏎**Annemasse center (near station)**: Price: 1000-1400 CH… » → « ## Best Zones⏎⏎In these four areas, expect €700 to €1,000 a month for a… »
-- [16] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « **Annemasse North**: Price: 950-1250 CHF. 10 » → « **Annemasse North**: 10 »
-- [17] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « **Ville-la-Grand**: Price: 900-1250 CHF. More » → « **Ville-la-Grand**: More »
-- [18] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « **Ambilly**: Price: 850-1150 CHF. Very » → « **Ambilly**: Very »
-- [19] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « | Room in a traditional flatshare | 550-800 €/month (charges sometimes … » → « | Room in a traditional flatshare | 700-1,000 €/month (charges sometime… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$## Les bonnes zones

**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant,$f$ IN content_fr) = 0
      AND position($f$**Annemasse Nord** : Prix : 950-1250 CHF. 10$f$ IN content_fr) = 0
      AND position($f$**Ville-la-Grand** : Prix : 900-1250 CHF. Plus$f$ IN content_fr) = 0
      AND position($f$**Ambilly** : Prix : 850-1150 CHF. Très$f$ IN content_fr) = 0
      AND position($f$| Chambre en colocation classique | 550-800 €/mois (charges parfois en sus) |$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$## 3. Gaillard — La frontière à pied

**Distance Genève** : 3 km · **Temps de trajet** : 10 min en bus, 25 min à vélo · **Loyer T2** : 800-1 050 €/mois

Gaillard touche littéralement la frontière. Tu peux traverser à pied vers le quartier des Eaux-Vives ou Champel. Cher mais pratique.

**Pour qui ?** Frontaliers sans voiture qui travaillent dans le centre de Genève.

$f$ IN content_fr) = 0
      AND position($f$## Ambilly — Le charme urbain collé à la frontière

**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois

Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.

**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.

## À noter pour Gaillard

- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).
- Gaillard est à **5 min de la douane de Moillesulaz**.

$f$ IN content_fr) = 0
      AND position($f$| Gaillard | 10-25 min | 800-1 050 € | Frontière à pied |$f$ IN content_fr) = 0
      AND position($f$- **Sans voiture, centre Genève** : Gaillard ou Annemasse$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$## Best Zones

**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant,$f$ IN content_en) = 0
      AND position($f$**Annemasse North**: Price: 950-1250 CHF. 10$f$ IN content_en) = 0
      AND position($f$**Ville-la-Grand**: Price: 900-1250 CHF. More$f$ IN content_en) = 0
      AND position($f$**Ambilly**: Price: 850-1150 CHF. Very$f$ IN content_en) = 0
      AND position($f$| Room in a traditional flatshare | 550-800 €/month (charges sometimes extra) |$f$ IN content_en) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$## 3. Gaillard — The walk-across border

**Distance to Geneva**: 3 km · **Commute**: 10 min by bus, 25 min by bike · **2-room rent**: €800-1,050/month

Gaillard literally touches the border. You can walk across to Eaux-Vives or Champel. Pricey but practical.

**For whom?** Car-free workers commuting to central Geneva.

$f$ IN content_en) = 0
      AND position($f$## Ambilly — Urban charm right on the border

**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month

Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.

**For whom?** Young professionals, car-free workers, urban lifestyle lovers.

## Worth noting for Gaillard

- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).
- Gaillard is **5 min from the Moillesulaz border crossing**.

$f$ IN content_en) = 0
      AND position($f$| Gaillard | 10-25 min | €800-1,050 | Walk across the border |$f$ IN content_en) = 0
      AND position($f$- **Car-free, central Geneva**: Gaillard or Annemasse$f$ IN content_en) = 0
      AND position($f$Annemasse, Ville-la-Grand, Saint-Julien, Ferney-Voltaire, Thonon, Divonne and more$f$ IN excerpt_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('colocation-annemasse-ville-la-grand-ambilly', 'ou-habiter-frontalier-suisse-villes-france-pas-cher')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Room in a traditional flatshare | 700-1,000 €/month (charges sometimes extra) |$r$, $f$| Room in a traditional flatshare | 550-800 €/month (charges sometimes extra) |$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$| Room in a traditional flatshare | 700-1,000 €/month (charges sometimes extra) |$r$ IN content_en) > 0
  AND position($f$| Room in a traditional flatshare | 550-800 €/month (charges sometimes extra) |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Ambilly**: Very$r$, $f$**Ambilly**: Price: 850-1150 CHF. Very$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Ambilly**: Very$r$ IN content_en) > 0
  AND position($f$**Ambilly**: Price: 850-1150 CHF. Very$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Ville-la-Grand**: More$r$, $f$**Ville-la-Grand**: Price: 900-1250 CHF. More$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Ville-la-Grand**: More$r$ IN content_en) > 0
  AND position($f$**Ville-la-Grand**: Price: 900-1250 CHF. More$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Annemasse North**: 10$r$, $f$**Annemasse North**: Price: 950-1250 CHF. 10$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Annemasse North**: 10$r$ IN content_en) > 0
  AND position($f$**Annemasse North**: Price: 950-1250 CHF. 10$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## Best Zones

In these four areas, expect €700 to €1,000 a month for a room in a flatshare, depending on the listing.

**Annemasse center (near station)**: Vibrant,$r$, $f$## Best Zones

**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant,$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$## Best Zones

In these four areas, expect €700 to €1,000 a month for a room in a flatshare, depending on the listing.

**Annemasse center (near station)**: Vibrant,$r$ IN content_en) > 0
  AND position($f$## Best Zones

**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant,$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Chambre en colocation classique | 700-1 000 €/mois (charges parfois en sus) |$r$, $f$| Chambre en colocation classique | 550-800 €/mois (charges parfois en sus) |$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$| Chambre en colocation classique | 700-1 000 €/mois (charges parfois en sus) |$r$ IN content_fr) > 0
  AND position($f$| Chambre en colocation classique | 550-800 €/mois (charges parfois en sus) |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Ambilly** : Très$r$, $f$**Ambilly** : Prix : 850-1150 CHF. Très$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Ambilly** : Très$r$ IN content_fr) > 0
  AND position($f$**Ambilly** : Prix : 850-1150 CHF. Très$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Ville-la-Grand** : Plus$r$, $f$**Ville-la-Grand** : Prix : 900-1250 CHF. Plus$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Ville-la-Grand** : Plus$r$ IN content_fr) > 0
  AND position($f$**Ville-la-Grand** : Prix : 900-1250 CHF. Plus$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Annemasse Nord** : 10$r$, $f$**Annemasse Nord** : Prix : 950-1250 CHF. 10$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Annemasse Nord** : 10$r$ IN content_fr) > 0
  AND position($f$**Annemasse Nord** : Prix : 950-1250 CHF. 10$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## Les bonnes zones

Dans ces quatre zones, compte 700 à 1 000 € par mois pour une chambre en colocation, selon l'annonce.

**Annemasse centre (près de la gare)** : Vibrant,$r$, $f$## Les bonnes zones

**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant,$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$## Les bonnes zones

Dans ces quatre zones, compte 700 à 1 000 € par mois pour une chambre en colocation, selon l'annonce.

**Annemasse centre (près de la gare)** : Vibrant,$r$ IN content_fr) > 0
  AND position($f$## Les bonnes zones

**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant,$f$ IN content_fr) = 0;

UPDATE blog_posts
SET excerpt_en = replace(excerpt_en, $r$Annemasse, Ville-la-Grand, Ambilly, Saint-Julien, Ferney-Voltaire, Thonon, Divonne$r$, $f$Annemasse, Ville-la-Grand, Saint-Julien, Ferney-Voltaire, Thonon, Divonne and more$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Annemasse, Ville-la-Grand, Ambilly, Saint-Julien, Ferney-Voltaire, Thonon, Divonne$r$ IN excerpt_en) > 0
  AND position($f$Annemasse, Ville-la-Grand, Saint-Julien, Ferney-Voltaire, Thonon, Divonne and more$f$ IN excerpt_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- **Car-free, central Geneva**: Ambilly or Annemasse$r$, $f$- **Car-free, central Geneva**: Gaillard or Annemasse$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$- **Car-free, central Geneva**: Ambilly or Annemasse$r$ IN content_en) > 0
  AND position($f$- **Car-free, central Geneva**: Gaillard or Annemasse$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Ambilly | Geneva Eaux-Vives in 7 min by Léman Express, 24 min door to door from Le Loft | €700-900 (studio) | Tram 17, walk to the border |$r$, $f$| Gaillard | 10-25 min | €800-1,050 | Walk across the border |$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$| Ambilly | Geneva Eaux-Vives in 7 min by Léman Express, 24 min door to door from Le Loft | €700-900 (studio) | Tram 17, walk to the border |$r$ IN content_en) > 0
  AND position($f$| Gaillard | 10-25 min | €800-1,050 | Walk across the border |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## Worth noting

- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).

$r$, $f$## Ambilly — Urban charm right on the border

**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month

Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.

**For whom?** Young professionals, car-free workers, urban lifestyle lovers.

## Worth noting for Gaillard

- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).
- Gaillard is **5 min from the Moillesulaz border crossing**.

$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$## Worth noting

- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).

$r$ IN content_en) > 0
  AND position($f$## Ambilly — Urban charm right on the border

**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month

Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.

**For whom?** Young professionals, car-free workers, urban lifestyle lovers.

## Worth noting for Gaillard

- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).
- Gaillard is **5 min from the Moillesulaz border crossing**.

$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## 3. Ambilly — Urban charm right on the border

**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month

Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.

**For whom?** Young professionals, car-free workers, urban lifestyle lovers.

$r$, $f$## 3. Gaillard — The walk-across border

**Distance to Geneva**: 3 km · **Commute**: 10 min by bus, 25 min by bike · **2-room rent**: €800-1,050/month

Gaillard literally touches the border. You can walk across to Eaux-Vives or Champel. Pricey but practical.

**For whom?** Car-free workers commuting to central Geneva.

$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$## 3. Ambilly — Urban charm right on the border

**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month

Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.

**For whom?** Young professionals, car-free workers, urban lifestyle lovers.

$r$ IN content_en) > 0
  AND position($f$## 3. Gaillard — The walk-across border

**Distance to Geneva**: 3 km · **Commute**: 10 min by bus, 25 min by bike · **2-room rent**: €800-1,050/month

Gaillard literally touches the border. You can walk across to Eaux-Vives or Champel. Pricey but practical.

**For whom?** Car-free workers commuting to central Geneva.

$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- **Sans voiture, centre Genève** : Ambilly ou Annemasse$r$, $f$- **Sans voiture, centre Genève** : Gaillard ou Annemasse$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$- **Sans voiture, centre Genève** : Ambilly ou Annemasse$r$ IN content_fr) > 0
  AND position($f$- **Sans voiture, centre Genève** : Gaillard ou Annemasse$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Ambilly | Genève-Eaux-Vives en 7 min de Léman Express, 24 min porte-à-porte depuis Le Loft | 700-900 € (studio) | Tram 17, frontière à pied |$r$, $f$| Gaillard | 10-25 min | 800-1 050 € | Frontière à pied |$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$| Ambilly | Genève-Eaux-Vives en 7 min de Léman Express, 24 min porte-à-porte depuis Le Loft | 700-900 € (studio) | Tram 17, frontière à pied |$r$ IN content_fr) > 0
  AND position($f$| Gaillard | 10-25 min | 800-1 050 € | Frontière à pied |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## À noter

- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).

$r$, $f$## Ambilly — Le charme urbain collé à la frontière

**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois

Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.

**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.

## À noter pour Gaillard

- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).
- Gaillard est à **5 min de la douane de Moillesulaz**.

$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$## À noter

- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).

$r$ IN content_fr) > 0
  AND position($f$## Ambilly — Le charme urbain collé à la frontière

**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois

Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.

**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.

## À noter pour Gaillard

- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).
- Gaillard est à **5 min de la douane de Moillesulaz**.

$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## 3. Ambilly — Le charme urbain collé à la frontière

**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois

Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.

**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.

$r$, $f$## 3. Gaillard — La frontière à pied

**Distance Genève** : 3 km · **Temps de trajet** : 10 min en bus, 25 min à vélo · **Loyer T2** : 800-1 050 €/mois

Gaillard touche littéralement la frontière. Tu peux traverser à pied vers le quartier des Eaux-Vives ou Champel. Cher mais pratique.

**Pour qui ?** Frontaliers sans voiture qui travaillent dans le centre de Genève.

$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$## 3. Ambilly — Le charme urbain collé à la frontière

**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois

Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.

**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.

$r$ IN content_fr) > 0
  AND position($f$## 3. Gaillard — La frontière à pied

**Distance Genève** : 3 km · **Temps de trajet** : 10 min en bus, 25 min à vélo · **Loyer T2** : 800-1 050 €/mois

Gaillard touche littéralement la frontière. Tu peux traverser à pied vers le quartier des Eaux-Vives ou Champel. Cher mais pratique.

**Pour qui ?** Frontaliers sans voiture qui travaillent dans le centre de Genève.

$f$ IN content_fr) = 0;

COMMIT;
*/
