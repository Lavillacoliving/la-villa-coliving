-- ════════════════════════════════════════════════════════════════════════
-- FUSION → transport-annemasse-geneve-leman-express
-- Récupère le contenu UNIQUE de : temps-trajet-annemasse-geneve-par-quartier + geneve-sans-voiture-mobilite-douce-frontaliers
-- puis insère les sections dans la page CIBLE (avant la conclusion).
-- À LANCER AVANT la dépublication (09) et AVANT le rebuild.
-- Idempotent : ne réinsère pas si déjà présent (garde-fou sur une phrase unique).
-- Aperçu lisible du contenu ajouté : scripts/consolidation/salvage/transport-annemasse-geneve-leman-express.fr.md / .en.md
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET content_fr = replace(content_fr, $a$## À lire aussi$a$, $LVfr$## Temps de trajet réels par quartier de départ × pôle d'emploi genevois

Le comparatif plus haut donne les moyennes. Mais le « bon » trajet dépend surtout de deux choses : d'où vous partez (Ville-la-Grand, Ambilly ou Annemasse centre) et où vous travaillez. Genève n'est pas un bloc unique : centre-ville (Cornavin), Plan-les-Ouates / Lancy (pôle industriel et tech), CERN à Meyrin, et le quartier des organisations internationales (Pregny-Chambésy). Voici les temps porte-à-porte réellement vécus par les frontaliers, mode par mode.

### Depuis Ville-la-Grand

| Destination | Léman Express | Voiture (hors pointe → pointe) | Bus | Vélo électrique |
|---|:---:|:---:|:---:|:---:|
| Centre (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |
| Plan-les-Ouates / Lancy | 40-50 min (via Lancy-Bachet 28 min) | 25-30 → 45-65 min | — | LEX + vélo pliant : 38 min |
| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) | 30-35 → 50-70 min | — | — |
| Organisations internationales (Pregny-Chambésy) | 35-40 min (Sécheron 25 min + 10 min à pied) | 25-30 → 45-60 min | — | — |

La gare d'Annemasse est à 10 min à pied (ou 3 min en vélo) de Ville-la-Grand. Pour le centre et le quartier international, le Léman Express est imbattable. Pour Plan-les-Ouates, le combo train + vélo pliant (descente à Lancy-Bachet) reste à 38 min quel que soit le trafic. Pour le CERN, la voiture garde l'avantage hors pointe, mais le LEX + tram 18 devient plus fiable aux heures chargées.

### Depuis Ambilly

Les temps sont très proches de Ville-la-Grand. Léger avantage pour les destinations passant par la douane de Moillesulaz (Chêne-Bourg, Eaux-Vives). La gare d'Annemasse est à 5-8 min en vélo. Pour les destinations sud (Plan-les-Ouates), la proximité de la douane de Pierre-à-Bochet peut faire gagner 5-10 minutes en voiture par rapport à Ville-la-Grand.

### Depuis Annemasse centre

La gare du Léman Express est en plein centre : 0-10 min à pied selon votre adresse, sans vélo ni bus pour rejoindre le train. C'est le point de départ le plus efficace. Pour les destinations non desservies par le train (zones industrielles de Meyrin, campus Firmenich à La Plaine), la voiture depuis Annemasse est un peu plus rapide que depuis Ville-la-Grand grâce à l'accès direct à l'autoroute. Vers l'aéroport, le Léman Express est direct (30 min).

### Quel logement choisir selon votre lieu de travail ?

- **Centre-ville ou quartier international** : Annemasse centre ou Ambilly (accès Léman Express direct) sont idéaux.
- **Plan-les-Ouates / Lancy** : Ville-la-Grand offre un bon compromis, avec le combo Léman Express + vélo pliant.
- **Aéroport** : Annemasse, Léman Express direct jusqu'à Genève-Aéroport (30 min).
- **CERN** : la voiture est souvent inévitable ; depuis Ville-la-Grand, c'est le trajet le plus court par l'autoroute.

## Nouvelles mobilités : trottinettes et autopartage

Au-delà du train, du vélo et du covoiturage, Genève propose deux services utiles pour les besoins ponctuels :

- **Trottinettes électriques** : Tier, Lime et Bird couvrent le centre-ville — pratique pour le dernier kilomètre entre la gare et le bureau.
- **Autopartage** : Mobility (l'équivalent suisse d'Autolib) permet de réserver une voiture à l'heure pour les occasions où le train ne suffit pas — courses à IKEA, déménagement de meubles, excursion le week-end — sans supporter le coût d'une voiture à l'année.

## À lire aussi$LVfr$),
    content_en = replace(content_en, $b$## Remember: Check Your Location$b$, $LVen$## Real travel times by departure neighborhood × Geneva employment hub

The comparison above gives the averages. But the "right" commute depends mostly on two things: where you leave from (Ville-la-Grand, Ambilly, or central Annemasse) and where you work. Geneva isn't a single block: city center (Cornavin), Plan-les-Ouates / Lancy (the industrial and tech hub), CERN in Meyrin, and the international organizations district (Pregny-Chambésy). Here are the door-to-door times cross-border workers actually experience, mode by mode.

### From Ville-la-Grand

| Destination | Léman Express | Car (off-peak → peak) | Bus | E-bike |
|---|:---:|:---:|:---:|:---:|
| Center (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |
| Plan-les-Ouates / Lancy | 40-50 min (via Lancy-Bachet 28 min) | 25-30 → 45-65 min | — | LEX + folding bike: 38 min |
| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) | 30-35 → 50-70 min | — | — |
| International organizations (Pregny-Chambésy) | 35-40 min (Sécheron 25 min + 10 min walk) | 25-30 → 45-60 min | — | — |

Annemasse station is a 10-min walk (or 3-min bike ride) from Ville-la-Grand. For the center and the international district, the Léman Express is unbeatable. For Plan-les-Ouates, the train + folding-bike combo (getting off at Lancy-Bachet) stays at 38 min regardless of traffic. For CERN, the car keeps the edge off-peak, but the LEX + tram 18 becomes more reliable at rush hour.

### From Ambilly

Times are very close to Ville-la-Grand. Slight advantage for destinations going through the Moillesulaz crossing (Chêne-Bourg, Eaux-Vives). Annemasse station is 5-8 min by bike. For southern destinations (Plan-les-Ouates), the nearby Pierre-à-Bochet crossing can save 5-10 minutes by car compared with Ville-la-Grand.

### From central Annemasse

The Léman Express station is right downtown: 0-10 min on foot depending on your address, with no bike or bus needed to reach the train. It's the most efficient starting point. For destinations not served by rail (Meyrin industrial zones, the Firmenich campus at La Plaine), driving from Annemasse is a bit faster than from Ville-la-Grand thanks to direct highway access. To the airport, the Léman Express is direct (30 min).

### Which housing to choose based on your workplace?

- **City center or international district**: central Annemasse or Ambilly (direct Léman Express access) are ideal.
- **Plan-les-Ouates / Lancy**: Ville-la-Grand is a good compromise, with the Léman Express + folding-bike combo.
- **Airport**: Annemasse, direct Léman Express to Geneva Airport (30 min).
- **CERN**: a car is often unavoidable; from Ville-la-Grand it's the shortest route via highway.

## New mobility: e-scooters and car-sharing

Beyond the train, the bike, and carpooling, Geneva offers two services that are handy for occasional needs:

- **Electric scooters**: Tier, Lime, and Bird cover the city center — useful for the last kilometer between the station and the office.
- **Car-sharing**: Mobility (the Swiss equivalent of Autolib) lets you book a car by the hour for the times when the train isn't enough — an IKEA run, moving furniture, a weekend trip — without bearing the cost of owning a car year-round.

## Remember: Check Your Location$LVen$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($g$Temps de trajet réels par quartier de départ$g$ IN content_fr) = 0;   -- garde-fou anti-doublon

-- Contrôle : la phrase-repère doit être présente 1 fois, et la longueur a augmenté.
SELECT slug,
       (position($g2$Temps de trajet réels par quartier de départ$g2$ IN content_fr) > 0) AS section_inseree,
       length(content_fr) AS len_fr, length(content_en) AS len_en, updated_at
FROM blog_posts WHERE slug = 'transport-annemasse-geneve-leman-express';
