-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  RUN-1 — CONTENU : fusions (01-07) + maillage interne (08)         ║
-- ║  Colle TOUT dans Supabase SQL Editor → Run. Projet tefpynkdxxfiefpkgitz ║
-- ║  Sans danger : idempotent (garde-fous), aucune dépublication ici.  ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- ════════ 01-fusion-budget.sql ════════
-- ════════════════════════════════════════════════════════════════════════
-- FUSION → budget-colocation-geneve-guide-complet
-- Récupère le contenu UNIQUE de : loyer-frontalier-geneve-combien-payer + studio-geneve-vs-colocation-france-budget + economies-coliving-tout-inclus-geneve
-- puis insère les sections dans la page CIBLE (avant la conclusion).
-- À LANCER AVANT la dépublication (09) et AVANT le rebuild.
-- Idempotent : ne réinsère pas si déjà présent (garde-fou sur une phrase unique).
-- Aperçu lisible du contenu ajouté : scripts/consolidation/salvage/budget-colocation-geneve-guide-complet.fr.md / .en.md
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET content_fr = replace(content_fr, $a$## Notre conseil : testez le coliving avant de vous engager$a$, $LVfr$## Prix réels par commune frontalière en 2026

Au-delà des fourchettes par zone, voici les prix réels constatés début 2026 commune par commune, pour une personne seule :

| Localisation | Studio | T2 | Chambre colocation | Coliving |
|---|---|---|---|---|
| **Genève centre** (Plainpalais, Eaux-Vives) | 1 800 – 2 500 CHF | 2 200 – 3 000 CHF | 1 200 – 1 600 CHF | — |
| **Genève périphérie** (Lancy, Onex, Vernier) | 1 400 – 1 800 CHF | 1 800 – 2 200 CHF | 900 – 1 200 CHF | — |
| **Annemasse centre** | 800 – 1 100 € | 950 – 1 300 € | 550 – 750 € | — |
| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | — |
| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 380 CHF |
| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 380 CHF |
| **Gaillard** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | — |
| **Cranves-Sales** | 650 – 850 € | 800 – 1 100 € | 450 – 650 € | — |
| **Vétraz-Monthoux** | 650 – 850 € | 800 – 1 050 € | 450 – 600 € | — |

Quelques repères quartier par quartier :

- **Annemasse-Gare** : le secteur le plus demandé depuis le Léman Express, accès direct Genève en 20 min. Beaucoup de neuf, prix en hausse de 5-8 % par an.
- **Annemasse-Château Rouge** : ancien quartier populaire en pleine transformation avec le tram, studios 750-950 € et en hausse rapide.
- **Ville-la-Grand centre** : résidentiel et calme, studios 700-900 €, bus 61 vers Genève.
- **Ambilly-Mairie** : le village frontalier par excellence, frontière à pied, ambiance villageoise, studios 700-950 €.
- **Gaillard** : commune collée à Genève côté Moillesulaz, pratique en voiture, offre plus réduite.
- **Cranves-Sales / Vétraz-Monthoux** : la deuxième couronne, 10 min d'Annemasse, loyers 10-15 % moins chers, studios 650-800 €. Idéal avec voiture.

## Le comparatif complet : coûts fixes ET coûts d'entrée

Le loyer ne dit pas tout. Voici les trois options mises côte à côte, charges, dépôt et investissement initial compris :

| Poste | Studio Genève | Coloc France | Coliving La Villa |
|-------|:---:|:---:|:---:|
| Loyer | 1 800-2 200 CHF | 500-700 € | 1 380 CHF |
| Charges (eau, élec, chauffage) | 80-150 CHF | 30-50 € | inclus |
| Internet | 45-60 CHF | 10-15 € | inclus |
| Assurance habitation | 30-50 CHF | 15-20 € | inclus |
| Ménage | 0 (vous-même) ou 100+ CHF | Aléatoire | 2×/semaine |
| Salle de sport | 80-120 CHF | 30-50 € | inclus |
| Streaming | 30-40 CHF | 15-20 € | inclus |
| Meubles (amortis/an) | 200-400 CHF | 50-100 € | inclus |
| **TOTAL mensuel** | **2 200-3 100 CHF** | **650-950 €** | **1 380 CHF** |
| Dépôt de garantie | 5 400-6 600 CHF | 1 000-1 400 € | 2 760 CHF |
| Investissement initial | 10 000-15 000 CHF | 2 000-4 000 € | 2 760 CHF |

C'est l'investissement initial qui surprend le plus quand on arrive dans la région : un studio à Genève demande **10 000 à 15 000 CHF avant même le premier mois de loyer** (3 mois de garantie + frais d'agence + meubles), soit 2-3 mois de salaire pour beaucoup de frontaliers. Une colocation côté France, **1 700 à 2 800 €**. Le coliving La Villa, **2 760 CHF de dépôt uniquement** — pas de meubles, pas de frais d'agence, pas d'installation : vous arrivez avec vos valises.

## Les économies invisibles : le temps et la charge mentale

On parle toujours d'euros, jamais de la charge mentale. Quand vous vivez seul en studio, c'est vous qui gérez tout : les factures, les réparations, le ménage, les courses pour le papier toilette, le détartrage du ballon d'eau chaude, la recherche d'un plombier à 22h quand la chasse d'eau fuit. Chaque micro-problème mange 15 à 60 minutes.

En estimation conservatrice, la gestion d'un studio prend **4 à 6 heures par mois**. À un taux horaire frontalier moyen de 35 €/h, c'est **140 à 210 € de temps "perdu"** chaque mois — un coût bien réel qui n'apparaît dans aucune annonce. Au coliving, une équipe s'occupe de tout : le ménage est fait, l'entretien est préventif, le WiFi marche, et si quelque chose casse, vous envoyez un message et c'est réglé. Chez La Villa, le temps de réponse moyen pour un problème technique est de moins de 24 heures.

Et il y a ce qu'aucun tableau ne capture : rentrer et trouver des gens dans le salon pour un apéro improvisé, le barbecue du samedi au bord de la piscine, le conseil d'un coliver qui connaît un bon médecin ou un bon garage, le réseau professionnel qui se crée quand des personnes de secteurs différents vivent sous le même toit. Aucun studio ne le fournit, aucune colocation aléatoire ne le garantit.

## Le bon timing : quand chercher ?

Le marché frontalier a ses cycles, et viser le bon moment peut faire la différence sur le prix comme sur le choix :

- **Septembre-novembre** : creux du marché, moins de concurrence. Le meilleur moment pour négocier.
- **Janvier-mars** : reprise et arrivée des nouveaux frontaliers. Marché tendu.
- **Juin-août** : haute saison et turn-over estival. Plus d'offre, mais prix au plus haut.

En coliving, la logique est différente : les chambres se libèrent ponctuellement toute l'année, donc la meilleure stratégie est de candidater dès maintenant pour figurer sur la liste d'attente.

## Notre conseil : testez le coliving avant de vous engager$LVfr$),
    content_en = replace(content_en, $b$## Our Advice: Try Coliving Before Committing$b$, $LVen$## Real Prices by Cross-Border Town in 2026

Beyond the zone-by-zone ranges, here are the real prices recorded in early 2026, town by town, for a single person:

| Location | Studio | 1-bed | Flatshare room | Coliving |
|---|---|---|---|---|
| **Geneva center** (Plainpalais, Eaux-Vives) | 1,800–2,500 CHF | 2,200–3,000 CHF | 1,200–1,600 CHF | — |
| **Geneva outskirts** (Lancy, Onex, Vernier) | 1,400–1,800 CHF | 1,800–2,200 CHF | 900–1,200 CHF | — |
| **Annemasse center** | 800–1,100 € | 950–1,300 € | 550–750 € | — |
| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | — |
| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,380 CHF |
| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,380 CHF |
| **Gaillard** | 700–950 € | 900–1,200 € | 500–700 € | — |
| **Cranves-Sales** | 650–850 € | 800–1,100 € | 450–650 € | — |
| **Vétraz-Monthoux** | 650–850 € | 800–1,050 € | 450–600 € | — |

A few neighborhood pointers:

- **Annemasse-Station**: the most in-demand area since the Léman Express, with direct Geneva access in 20 min. Lots of new builds, prices rising 5-8% per year.
- **Annemasse-Château Rouge**: a former working-class district transforming fast with the tram; studios 750-950 € and climbing quickly.
- **Ville-la-Grand center**: residential and quiet, studios 700-900 €, bus 61 to Geneva.
- **Ambilly-Mairie**: the quintessential border village, walking distance to the frontier, village feel, studios 700-950 €.
- **Gaillard**: a town right against Geneva on the Moillesulaz side, handy by car, with a smaller supply.
- **Cranves-Sales / Vétraz-Monthoux**: the second ring, 10 min from Annemasse, rents 10-15% cheaper, studios 650-800 €. Ideal with a car.

## The Full Comparison: Fixed Costs AND Move-In Costs

Rent doesn't tell the whole story. Here are the three options side by side, including charges, deposit, and initial investment:

| Item | Studio Geneva | Flatshare France | Coliving La Villa |
|------|:---:|:---:|:---:|
| Rent | 1,800-2,200 CHF | 500-700 € | 1,380 CHF |
| Utilities (water, electricity, heating) | 80-150 CHF | 30-50 € | included |
| Internet | 45-60 CHF | 10-15 € | included |
| Home insurance | 30-50 CHF | 15-20 € | included |
| Cleaning | DIY or 100+ CHF | Hit-or-miss | 2×/week |
| Gym membership | 80-120 CHF | 30-50 € | included |
| Streaming | 30-40 CHF | 15-20 € | included |
| Furniture (amortized/year) | 200-400 CHF | 50-100 € | included |
| **TOTAL monthly** | **2,200-3,100 CHF** | **650-950 €** | **1,380 CHF** |
| Security deposit | 5,400-6,600 CHF | 1,000-1,400 € | 2,760 CHF |
| Initial investment | 10,000-15,000 CHF | 2,000-4,000 € | 2,760 CHF |

The initial investment is what surprises people most when they arrive: a Geneva studio demands **10,000 to 15,000 CHF before your first month's rent** (3-month deposit + agency fees + furniture), the equivalent of 2-3 months' salary for many cross-border workers. A flatshare on the French side, **1,700 to 2,800 €**. La Villa coliving, **a 2,760 CHF deposit only** — no furniture, no agency fees, no setup: you arrive with your suitcases.

## Invisible Savings: Time and Mental Load

We always talk in euros, never about mental load. When you live alone in a studio, you manage everything: bills, repairs, cleaning, shopping for toilet paper, descaling the water heater, finding a plumber at 10 PM when the toilet leaks. Each micro-problem eats 15 to 60 minutes.

By a conservative estimate, managing a studio takes **4 to 6 hours per month**. At an average cross-border hourly rate of 35 €/h, that's **140 to 210 € of "lost" time** every month — a very real cost that appears in no listing. In coliving, a team handles everything: cleaning is done, maintenance is preventive, the WiFi works, and if something breaks you send a message and it's handled. At La Villa, the average response time for a technical issue is under 24 hours.

And there's what no table can capture: coming home to find people in the living room for a spontaneous drink, the Saturday barbecue by the pool, advice from a co-liver who knows a good doctor or a good mechanic, the professional network that naturally forms when people from different sectors live under one roof. No studio provides that, and no random flatshare guarantees it.

## Timing It Right: When to Search

The cross-border market has its cycles, and hitting the right window can make a difference on both price and choice:

- **September-November**: low season, less competition. The best time to negotiate.
- **January-March**: market picks up as new cross-border workers arrive. Tight market.
- **June-August**: high season and summer turnover. More supply, but prices at their peak.

In coliving the logic is different: rooms free up throughout the year, so the best strategy is to apply now to get on the waiting list.

## Our Advice: Try Coliving Before Committing$LVen$),
    updated_at = now(),
    meta_description_fr = $m1$Combien coûte vraiment un logement frontalier à Genève en 2026 ? Prix réels par ville (Annemasse, Ville-la-Grand, Ambilly…), studio vs colocation vs coliving tout inclus, charges cachées et vraies économies.$m1$,
    meta_description_en = $m2$What does cross-border housing near Geneva really cost in 2026? Real prices by town, studio vs flatshare vs all-inclusive coliving, hidden costs and the real savings.$m2$
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($g$Prix réels par commune frontalière$g$ IN content_fr) = 0;   -- garde-fou anti-doublon

-- Contrôle : la phrase-repère doit être présente 1 fois, et la longueur a augmenté.
SELECT slug,
       (position($g2$Prix réels par commune frontalière$g2$ IN content_fr) > 0) AS section_inseree,
       length(content_fr) AS len_fr, length(content_en) AS len_en, updated_at
FROM blog_posts WHERE slug = 'budget-colocation-geneve-guide-complet';

-- ════════ 02-fusion-ou-habiter.sql ════════
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

-- ════════ 03-fusion-colocation-annemasse.sql ════════
-- ════════════════════════════════════════════════════════════════════════
-- FUSION → colocation-annemasse-ville-la-grand-ambilly
-- Récupère le contenu UNIQUE de : chambre-meublee-annemasse-geneve
-- puis insère les sections dans la page CIBLE (avant la conclusion).
-- À LANCER AVANT la dépublication (09) et AVANT le rebuild.
-- Idempotent : ne réinsère pas si déjà présent (garde-fou sur une phrase unique).
-- Aperçu lisible du contenu ajouté : scripts/consolidation/salvage/colocation-annemasse-ville-la-grand-ambilly.fr.md / .en.md
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET content_fr = replace(content_fr, $a$## À lire aussi$a$, $LVfr$## Le vrai prix d'une chambre meublée en 2026

Une colocation, c'est souvent une chambre meublée dans un appartement partagé. Au-delà des fourchettes par zone, voici les prix réels constatés par **type de logement** en zone frontalière début 2026 — utile pour savoir si une annonce est honnête ou gonflée.

| Type de logement (zone frontalière FR) | Prix constaté 2026 |
| --- | --- |
| Chambre chez l'habitant | 500-700 €/mois (charges souvent incluses, confort variable) |
| Chambre en colocation classique | 550-800 €/mois (charges parfois en sus) |
| Studio meublé | 700-1 000 €/mois (charges rarement incluses) |
| Coliving premium tout compris | 1 380 CHF/mois |

Pour comparer, **côté Genève** : chambre en colocation 1 000-1 500 CHF/mois, studio meublé 1 600-2 200 CHF/mois, appartement meublé T2 2 000-2 800 CHF/mois. À budget égal avec un studio basique genevois, vous avez côté France une chambre bien plus confortable — la zone frontalière reste imbattable sur le rapport qualité-prix.

## Ce que « meublé » veut dire (et ne veut pas dire)

En France, un logement meublé doit légalement contenir un minimum : lit avec couette ou couverture, volets ou rideaux, plaques de cuisson, réfrigérateur, vaisselle, table et chaises, rangement, luminaires et matériel d'entretien. C'est le **décret du 31 juillet 2015**.

Dans la réalité, « meublé » recouvre des situations très différentes :

- **Meublé « annonce »** : un lit Ikea, une table bancale, un micro-ondes. Fonctionnel, pas agréable.
- **Meublé agence** : un cran au-dessus, mais souvent daté. Canapé fatigué, électroménager basique. Propre mais sans âme.
- **Meublé coliving premium** : lit queen-size, bureau ergonomique, rangements généreux, literie de qualité hôtelière.

**Le réflexe à avoir** : exigez toujours des photos récentes et un inventaire détaillé. Si le propriétaire refuse, passez votre chemin — les bonnes affaires n'ont rien à cacher.

## Meublé courte durée vs longue durée : quel choix pour un frontalier ?

Vous arrivez dans la région et vous hésitez entre un Airbnb temporaire et un bail meublé 12 mois ? Le comparatif honnête :

**Airbnb / courte durée (1-3 mois)**
- Prix : 1 200-2 000 €/mois pour un studio correct
- Avantage : flexibilité totale, aucun engagement
- Inconvénient : prix prohibitif sur la durée, pas d'adresse fixe (problème pour le permis G), aucune communauté

**Bail meublé 12 mois**
- Prix : 600-1 000 €/mois selon la commune et le standing
- Avantage : prix stabilisé, adresse fixe, droits du locataire
- Inconvénient : engagement 12 mois (1 mois de préavis en meublé), dépôt de garantie 2 mois

**Coliving (bail 12 mois)**
- Prix : 1 380 CHF/mois tout compris
- Avantage : emménagement en 2 semaines, communauté instantanée, tout inclus, adresse fixe
- Inconvénient : une chambre (pas un appartement entier), vie en communauté (pas pour tout le monde)

**Le point clé pour décider** : si vous arrivez pour la première fois, évitez l'Airbnb au-delà de 2 semaines — c'est un gouffre financier et, sans adresse fixe, vous bloquez vos démarches de permis G. Pour un frontalier qui s'installe durablement, le bail 12 mois (classique ou coliving) gagne sur le coût et la stabilité.

## À lire aussi$LVfr$),
    content_en = content_en || E'\n\n' || $LVen$## Real Prices for a Furnished Room in 2026

A flatshare usually means a furnished room in a shared apartment. Beyond the per-zone ranges, here are the real prices seen by **type of housing** in the cross-border area in early 2026 — handy for telling an honest listing from an inflated one.

| Type of housing (French cross-border zone) | Observed price 2026 |
| --- | --- |
| Room with a host family | 500-700 €/month (charges often included, comfort varies) |
| Room in a traditional flatshare | 550-800 €/month (charges sometimes extra) |
| Furnished studio | 700-1,000 €/month (charges rarely included) |
| All-inclusive premium coliving | 1,380 CHF/month |

For comparison, **on the Geneva side**: room in a flatshare 1,000-1,500 CHF/month, furnished studio 1,600-2,200 CHF/month, furnished one-bedroom (T2) 2,000-2,800 CHF/month. For the same budget as a basic Geneva studio, you get a far more comfortable room on the French side — the cross-border zone stays unbeatable on value.

## What "Furnished" Really Means (and Doesn't)

In France, a furnished rental must legally contain a minimum set of items: a bed with duvet or blanket, shutters or curtains, cooking hobs, a fridge, dishes, a table and chairs, storage, lights, and cleaning equipment. This is the **decree of 31 July 2015**.

In reality, "furnished" covers very different situations:

- **"Listing" furnished**: an Ikea bed, a wobbly table, a microwave. Functional, not pleasant.
- **Agency furnished**: a notch above, but often dated. Tired sofa, basic appliances. Clean but soulless.
- **Premium coliving furnished**: queen-size bed, ergonomic desk, generous storage, hotel-quality linens.

**The habit to keep**: always ask for recent photos and a detailed inventory. If the landlord refuses, walk away — good deals have nothing to hide.

## Short-Term vs Long-Term Furnished: Which to Choose as a Cross-Border Worker?

New to the region and torn between a temporary Airbnb and a 12-month furnished lease? The honest comparison:

**Airbnb / short-term (1-3 months)**
- Price: 1,200-2,000 €/month for a decent studio
- Upside: total flexibility, no commitment
- Downside: prohibitive over time, no fixed address (a problem for the G permit), no community

**12-month furnished lease**
- Price: 600-1,000 €/month depending on town and standing
- Upside: stable price, fixed address, tenant rights
- Downside: 12-month commitment (1-month notice on furnished), 2-month security deposit

**Coliving (12-month lease)**
- Price: 1,380 CHF/month all-inclusive
- Upside: move in within 2 weeks, instant community, everything included, fixed address
- Downside: a room (not a whole apartment), community living (not for everyone)

**The deciding factor**: if you're arriving for the first time, avoid Airbnb beyond 2 weeks — it's a money pit, and without a fixed address you stall your G-permit paperwork. For a cross-border worker settling in for the long run, the 12-month lease (classic or coliving) wins on both cost and stability.$LVen$,
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($g$Le vrai prix d'une chambre meublée en 2026$g$ IN content_fr) = 0;   -- garde-fou anti-doublon

-- Contrôle : la phrase-repère doit être présente 1 fois, et la longueur a augmenté.
SELECT slug,
       (position($g2$Le vrai prix d'une chambre meublée en 2026$g2$ IN content_fr) > 0) AS section_inseree,
       length(content_fr) AS len_fr, length(content_en) AS len_en, updated_at
FROM blog_posts WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly';

-- ════════ 04-fusion-transport.sql ════════
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

-- ════════ 05-fusion-newcomer.sql ════════
-- ════════════════════════════════════════════════════════════════════════
-- FUSION → demenager-geneve-frontalier-checklist
-- Récupère le contenu UNIQUE de : arriver-seul-geneve-guide-30-jours
-- puis insère les sections dans la page CIBLE (avant la conclusion).
-- À LANCER AVANT la dépublication (09) et AVANT le rebuild.
-- Idempotent : ne réinsère pas si déjà présent (garde-fou sur une phrase unique).
-- Aperçu lisible du contenu ajouté : scripts/consolidation/salvage/demenager-geneve-frontalier-checklist.fr.md / .en.md
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET content_fr = replace(content_fr, $a$## À lire aussi$a$, $LVfr$## Vos 30 premiers jours, jour par jour (si vous arrivez seul)

La checklist ci-dessus couvre le « quoi ». Voici le « quand » une fois sur place, semaine par semaine, pour ne pas tout faire en même temps : d'abord les bases vitales, puis le quotidien, puis le réseau.

**Semaine 1 (J1 à J7) — les bases vitales**
- J1-2 : rendre le logement fonctionnel et se connecter à internet (en coliving, c'est déjà fait).
- J3-4 : démarches françaises — passer en mairie pour un justificatif de domicile officiel, puis mettre à jour votre adresse auprès de la CPAM et de votre caisse de retraite.
- J5-7 : démarches suisses — vous rendre à l'Office cantonal de la population et des migrations (OCPM) pour activer votre permis G (prenez rendez-vous en ligne, les files sont légendaires). C'est aussi le moment de vous renseigner sur votre **assurance maladie** : vous avez 3 mois pour exercer votre droit d'option entre la LAMal suisse et la CMU française, et ce choix est quasi-irréversible — ne le laissez pas traîner.

**Semaine 2 (J8 à J14) — optimiser son quotidien**
Prenez le rythme : transport, courses, et inscription chez un médecin traitant côté français (les délais pour un premier rendez-vous peuvent être de 2 à 3 semaines, donc lancez-le tôt).

**Semaine 3 (J15 à J21) — créer du lien social**
La partie la plus sous-estimée, et la plus importante quand on arrive seul. Voir la section suivante.

**Semaine 4 (J22 à J30) — consolider et planifier**
Après un mois, vous avez une idée réaliste de vos dépenses et l'essentiel est coché. Ce qui reste souvent en suspens et peut attendre les mois suivants : la déclaration d'impôts, l'optimisation de votre 2e pilier (prévoyance professionnelle suisse), et éventuellement l'achat d'un véhicule si votre trajet le nécessite.

## Arriver seul : créer du lien (et la barrière culturelle)

On prépare le logement et l'administratif, rarement le réseau social. Pourtant c'est souvent ce qui fait la différence entre « tenir » et « s'épanouir ». Arriver seul peut peser, surtout quand vos collègues suisses rentrent chez eux le soir et que vous ne connaissez personne côté français.

**Les leviers concrets :**
- **Les groupes Facebook de frontaliers** sont très actifs (« Frontaliers Genevois », « Expats in Geneva », « Français à Genève ») : conseils pratiques et invitations à des événements.
- **Le sport** est un excellent vecteur social : salles de sport, clubs de course à pied, associations sportives locales permettent de rencontrer du monde rapidement.
- **Les événements du Grand Genève** (concerts, festivals, marchés) : consultez l'agenda du Grand Genève (grand-geneve.org).
- **Le coliving** a un avantage unique ici : des colocataires dès le premier soir, et des espaces communs et événements (barbecues, soirées jeux, apéros du vendredi) qui créent du lien naturellement.

**La barrière culturelle.** Le « froid suisse » est un cliché… qui contient une part de vérité. Les Genevois sont courtois, mais il faut plus de temps pour créer des amitiés profondes qu'en France. Ne le prenez pas personnellement, c'est culturel. Les expats et autres frontaliers sont souvent plus ouverts aux nouvelles rencontres : ils vivent exactement la même situation que vous.

## À lire aussi$LVfr$),
    content_en = replace(content_en, $b$## Realistic Timelines$b$, $LVen$## Your First 30 Days, Day by Day (If You Arrive Alone)

The checklist above covers the "what." Here's the "when" once you've landed, week by week, so you don't do everything at once: vital basics first, then daily life, then your network.

**Week 1 (Day 1-7) — the vital basics**
- Day 1-2: make your home functional and get connected to internet (in coliving, it's already done).
- Day 3-4: French steps — visit the town hall for an official proof of address, then update your address with CPAM and your pension fund.
- Day 5-7: Swiss steps — go to the Office cantonal de la population et des migrations (OCPM) to activate your G permit (book online, the queues are legendary). This is also the time to look into your **health insurance**: you have 3 months to exercise your right of option between Swiss LAMal and French CMU, and this choice is virtually irreversible — don't let it drag.

**Week 2 (Day 8-14) — optimising daily life**
Find your rhythm: transport, shopping, and registering with a GP on the French side (wait times for a first appointment can be 2-3 weeks, so start early).

**Week 3 (Day 15-21) — building social connections**
The most underestimated part, and the most important when you arrive alone. See the next section.

**Week 4 (Day 22-30) — consolidate and plan ahead**
After a month, you'll have a realistic idea of your expenses and the essentials are ticked off. What often remains pending and can wait for the following months: your tax declaration, optimising your 2nd pillar (Swiss occupational pension), and possibly buying a vehicle if your commute requires it.

## Arriving Alone: Building a Circle (and the Cultural Barrier)

People prepare the housing and the paperwork, rarely the social network. Yet that's often what makes the difference between "coping" and "thriving." Arriving alone can weigh on you, especially when your Swiss colleagues go home in the evening and you don't know anyone on the French side.

**Concrete strategies:**
- **Cross-border Facebook groups** are very active ("Frontaliers Genevois", "Expats in Geneva", "Français à Genève"): practical advice and event invitations.
- **Sport** is an excellent social vector: gyms, running clubs, and local sports associations help you meet people quickly.
- **Grand Genève events** (concerts, festivals, markets): check the Grand Genève agenda (grand-geneve.org).
- **Coliving** has a unique advantage here: housemates from the very first evening, plus common areas and events (barbecues, game nights, Friday drinks) that create connections naturally.

**The cultural barrier.** The "Swiss coldness" is a cliché… that contains some truth. Genevans are polite, but it takes longer to build deep friendships than in France. Don't take it personally — it's cultural. Expats and other cross-border workers are often more open to new encounters: they're living exactly the same situation as you.

## Realistic Timelines$LVen$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($g$Vos 30 premiers jours, jour par jour$g$ IN content_fr) = 0;   -- garde-fou anti-doublon

-- Contrôle : la phrase-repère doit être présente 1 fois, et la longueur a augmenté.
SELECT slug,
       (position($g2$Vos 30 premiers jours, jour par jour$g2$ IN content_fr) > 0) AS section_inseree,
       length(content_fr) AS len_fr, length(content_en) AS len_en, updated_at
FROM blog_posts WHERE slug = 'demenager-geneve-frontalier-checklist';

-- ════════ 06-fusion-pieges.sql ════════
-- ════════════════════════════════════════════════════════════════════════
-- FUSION → arnaques-logement-frontalier-geneve-eviter
-- Récupère le contenu UNIQUE de : 5-erreurs-logement-frontalier-geneve
-- puis insère les sections dans la page CIBLE (avant la conclusion).
-- À LANCER AVANT la dépublication (09) et AVANT le rebuild.
-- Idempotent : ne réinsère pas si déjà présent (garde-fou sur une phrase unique).
-- Aperçu lisible du contenu ajouté : scripts/consolidation/salvage/arnaques-logement-frontalier-geneve-eviter.fr.md / .en.md
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET content_fr = replace(content_fr, $a$## Que faire si vous êtes victime ?$a$, $LVfr$## Au-delà des arnaques : les erreurs classiques à éviter

Les arnaques ne sont pas le seul piège du marché frontalier. Voici les erreurs les plus courantes des candidats locataires, et comment les anticiper.

**Sous-estimer les délais de recherche**

- La demande est très forte près de Genève : comptez généralement entre **deux et quatre mois** pour trouver un logement qui correspond à vos critères et à votre budget.
- L'attractivité des salaires suisses génère une concurrence acharnée sur les biens disponibles.
- Commencez bien avant la date d'emménagement souhaitée : vous pourrez comparer les offres et négocier sereinement, sans décisions précipitées sous la pression du temps.

**Négliger les aspects financiers des cautions et garanties**

- En France, le dépôt de garantie ne peut légalement dépasser **un mois de loyer hors charges** pour un logement vide. Certains propriétaires tentent d'exiger davantage ou des garanties supplémentaires : restez vigilant.
- Comprenez bien les conditions de restitution de la caution.
- Réalisez un **état des lieux contradictoire détaillé** à l'entrée : photographiez chaque pièce et signalez le moindre défaut. C'est votre meilleure protection contre des retenues abusives au départ.

**Sous-évaluer la localisation et les transports**

- Beaucoup de frontaliers se focalisent sur le seul prix du loyer, sans considérer les coûts et contraintes de transport.
- Un logement éloigné des axes de transport public ou des routes vers Genève peut générer des frais de carburant considérables et des temps de trajet épuisants.
- Étudiez les horaires de bus, la fréquence des liaisons et les alternatives en cas de grève ou d'incident avant de signer.

**Ignorer la différence entre tout-inclus et charges séparées**

- La gestion des charges peut vite devenir un casse-tête administratif et financier.
- Une formule **tout-inclus** (un seul paiement mensuel) offre une prévisibilité budgétaire parfaite et évite les mauvaises surprises lors des régularisations de charges.

## Que faire si vous êtes victime ?$LVfr$),
    content_en = replace(content_en, $b$## What To Do If You're a Victim?$b$, $LVen$## Beyond Scams: The Classic Mistakes to Avoid

Scams aren't the only trap on the cross-border market. Here are the most common mistakes prospective tenants make — and how to stay ahead of them.

**Underestimating search timeframes**

- Demand is very high near Geneva: it generally takes **two to four months** to find housing that matches your criteria and budget.
- The appeal of Swiss salaries drives fierce competition for available properties.
- Start well before your desired move-in date: you'll be able to compare offers and negotiate calmly, instead of making hasty decisions under time pressure.

**Neglecting the financial side of deposits and guarantees**

- In France, the security deposit legally cannot exceed **one month's rent excluding charges** for an unfurnished property. Some landlords try to demand more, or extra guarantees — stay alert.
- Make sure you understand the conditions for getting the deposit back.
- Do a **detailed contradictory inventory** (état des lieux) when moving in: photograph every room and note any defect. It's your best protection against abusive deductions when you leave.

**Undervaluing location and transport**

- Many cross-border workers focus only on rent price, without factoring in transport costs and constraints.
- Housing far from public transport routes or the main roads to Geneva can generate considerable fuel costs and exhausting commute times.
- Study bus schedules, connection frequency, and fallback options in case of strikes or incidents before signing.

**Ignoring the difference between all-inclusive and separate charges**

- Managing rental charges can quickly become an administrative and financial headache.
- An **all-inclusive** formula (a single monthly payment) gives you perfect budget predictability and avoids unpleasant surprises from end-of-year charge adjustments.

## What To Do If You're a Victim?$LVen$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($g$Au-delà des arnaques : les erreurs classiques$g$ IN content_fr) = 0;   -- garde-fou anti-doublon

-- Contrôle : la phrase-repère doit être présente 1 fois, et la longueur a augmenté.
SELECT slug,
       (position($g2$Au-delà des arnaques : les erreurs classiques$g2$ IN content_fr) > 0) AS section_inseree,
       length(content_fr) AS len_fr, length(content_en) AS len_en, updated_at
FROM blog_posts WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';

-- ════════ 07-orphelin-avantages.sql ════════
-- ════════════════════════════════════════════════════════════════════════
-- FUSION → coliving-annemasse-geneve-frontaliers-avantages
-- Récupère le contenu UNIQUE de : annemasse-coliving-geneve-frontaliers-guide-complet (orphelin supprimé, récupéré via git+CSV)
-- puis insère les sections dans la page CIBLE (avant la conclusion).
-- À LANCER AVANT la dépublication (09) et AVANT le rebuild.
-- Idempotent : ne réinsère pas si déjà présent (garde-fou sur une phrase unique).
-- Aperçu lisible du contenu ajouté : scripts/consolidation/salvage/coliving-annemasse-geneve-frontaliers-avantages.fr.md / .en.md
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET content_fr = replace(content_fr, $a$## En résumé$a$, $LVfr$## Vie culturelle, sport et gastronomie à Annemasse

Choisir Annemasse, ce n'est pas seulement optimiser son budget et son trajet : c'est aussi adopter un véritable art de vivre, entre dynamisme culturel franco-suisse et grand air alpin. Voici ce qui rythme les soirées et les week-ends de nos coliveurs.

### Culture et divertissement

Vivre à Annemasse, c'est accéder à une richesse culturelle exceptionnelle. Le **Château Rouge**, centre culturel de la ville, programme spectacles, concerts et expositions tout au long de l'année. Le cinéma **Pathé Annemasse** propose les dernières sorties en version française et en version originale.

Et Genève, à quelques minutes, enrichit encore l'offre : Grand Théâtre, Orchestre de la Suisse Romande, musées d'art et d'histoire, festivals internationaux. Une programmation de niveau mondial à portée de Léman Express.

Bon à savoir : le projet d'agglomération **« Annemasse 2030 »** transforme le centre-ville avec de nouveaux espaces culturels, des zones piétonnes et un écoquartier innovant — une ville qui gagne en qualité de vie année après année.

### Sport et nature : l'art de vivre alpin

La proximité des Alpes transforme chaque week-end en aventure potentielle. **Chamonix** (1 h de route), **Megève** (45 minutes), **Les Gets** (30 minutes) : quelques-unes des plus belles stations de ski sont à portée de voiture.

L'été révèle d'autres plaisirs : randonnées au **Salève** (accessible en téléphérique depuis Genève), sports nautiques sur le **lac Léman**, via ferrata dans les **Aravis**. Les coliveurs de La Villa organisent régulièrement des sorties en groupe pour découvrir ces trésors naturels — l'occasion idéale de transformer des voisins en amis.

### Gastronomie : saveurs franco-suisses

Annemasse cultive sa tradition culinaire savoyarde tout en s'enrichissant d'influences cosmopolites. Le **marché du jeudi matin** propose fromages d'alpage, charcuteries artisanales et spécialités locales.

Côté restaurants, la diversité de la population se reflète dans l'assiette : authentiques bouchons savoyards, tables indiennes, pizzerias italiennes et sushi bars se côtoient. Sans oublier la proximité de Genève et sa gastronomie internationale de très haut niveau.

## En résumé$LVfr$),
    content_en = replace(content_en, $b$## In short$b$, $LVen$## Culture, sport and gastronomy in Annemasse

Choosing Annemasse isn't only about optimising your budget and your commute: it's also about embracing a genuine art of living, somewhere between Franco-Swiss cultural energy and the fresh air of the Alps. Here's what fills our colivers' evenings and weekends.

### Culture and entertainment

Living in Annemasse means access to exceptional cultural richness. **Château Rouge**, the city's cultural centre, programmes shows, concerts and exhibitions throughout the year. The **Pathé Annemasse** cinema screens the latest releases in both French and original versions.

And Geneva, just minutes away, enriches the offering even further: the Grand Théâtre, the Orchestre de la Suisse Romande, art and history museums, international festivals. World-class programming within reach of the Léman Express.

Worth knowing: the **"Annemasse 2030"** urban project is reshaping the city centre with new cultural spaces, pedestrian zones and an innovative eco-district — a town whose quality of life keeps improving year after year.

### Sport and nature: the Alpine art of living

The proximity of the Alps turns every weekend into a potential adventure. **Chamonix** (1 hour's drive), **Megève** (45 minutes), **Les Gets** (30 minutes): some of the finest ski resorts are a short drive away.

Summer reveals other pleasures: hiking at the **Salève** (reachable by cable car from Geneva), water sports on **Lake Geneva**, via ferrata in the **Aravis range**. La Villa's colivers regularly organise group outings to discover these natural treasures — the perfect way to turn neighbours into friends.

### Gastronomy: Franco-Swiss flavours

Annemasse nurtures its Savoyard culinary tradition while soaking up cosmopolitan influences. The **Thursday morning market** offers alpine cheeses, artisanal charcuterie and local specialities.

On the restaurant side, the diversity of the population shows up on the plate: authentic Savoyard bistros sit alongside Indian eateries, Italian pizzerias and sushi bars. Not to mention nearby Geneva and its very high-end international cuisine.

## In short$LVen$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($g$Vie culturelle, sport et gastronomie à Annemasse$g$ IN content_fr) = 0;   -- garde-fou anti-doublon

-- Contrôle : la phrase-repère doit être présente 1 fois, et la longueur a augmenté.
SELECT slug,
       (position($g2$Vie culturelle, sport et gastronomie à Annemasse$g2$ IN content_fr) > 0) AS section_inseree,
       length(content_fr) AS len_fr, length(content_en) AS len_en, updated_at
FROM blog_posts WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages';

-- ════════ 08-maillage-interne.sql ════════
-- ════════════════════════════════════════════════════════════════════════
-- 08 — MAILLAGE INTERNE : repointer les liens vers les pages redirigées
-- À LANCER APRÈS les fusions (01-07), AVANT la dépublication (09).
-- Ne touche QUE l'URL des liens, garde le texte d'ancrage intact.
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

-- ─── SECTION 1 : liens vers les 9 sources fusionnées → leur pilier ───
-- loyer-frontalier-geneve-combien-payer  →  /blog/budget-colocation-geneve-guide-complet   (10 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/loyer-frontalier-geneve-combien-payer)', '](/blog/budget-colocation-geneve-guide-complet)'),
  content_en = replace(content_en, '](/en/blog/loyer-frontalier-geneve-combien-payer)', '](/en/blog/budget-colocation-geneve-guide-complet)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/loyer-frontalier-geneve-combien-payer)%' OR content_en LIKE '%](/en/blog/loyer-frontalier-geneve-combien-payer)%';

-- studio-geneve-vs-colocation-france-budget  →  /blog/budget-colocation-geneve-guide-complet   (2 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/studio-geneve-vs-colocation-france-budget)', '](/blog/budget-colocation-geneve-guide-complet)'),
  content_en = replace(content_en, '](/en/blog/studio-geneve-vs-colocation-france-budget)', '](/en/blog/budget-colocation-geneve-guide-complet)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/studio-geneve-vs-colocation-france-budget)%' OR content_en LIKE '%](/en/blog/studio-geneve-vs-colocation-france-budget)%';

-- economies-coliving-tout-inclus-geneve  →  /blog/budget-colocation-geneve-guide-complet   (0 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/economies-coliving-tout-inclus-geneve)', '](/blog/budget-colocation-geneve-guide-complet)'),
  content_en = replace(content_en, '](/en/blog/economies-coliving-tout-inclus-geneve)', '](/en/blog/budget-colocation-geneve-guide-complet)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/economies-coliving-tout-inclus-geneve)%' OR content_en LIKE '%](/en/blog/economies-coliving-tout-inclus-geneve)%';

-- meilleurs-quartiers-frontaliers-geneve  →  /blog/ou-habiter-frontalier-suisse-villes-france-pas-cher   (11 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/meilleurs-quartiers-frontaliers-geneve)', '](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)'),
  content_en = replace(content_en, '](/en/blog/meilleurs-quartiers-frontaliers-geneve)', '](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/meilleurs-quartiers-frontaliers-geneve)%' OR content_en LIKE '%](/en/blog/meilleurs-quartiers-frontaliers-geneve)%';

-- chambre-meublee-annemasse-geneve  →  /blog/colocation-annemasse-ville-la-grand-ambilly   (7 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/chambre-meublee-annemasse-geneve)', '](/blog/colocation-annemasse-ville-la-grand-ambilly)'),
  content_en = replace(content_en, '](/en/blog/chambre-meublee-annemasse-geneve)', '](/en/blog/colocation-annemasse-ville-la-grand-ambilly)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/chambre-meublee-annemasse-geneve)%' OR content_en LIKE '%](/en/blog/chambre-meublee-annemasse-geneve)%';

-- temps-trajet-annemasse-geneve-par-quartier  →  /blog/transport-annemasse-geneve-leman-express   (2 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/temps-trajet-annemasse-geneve-par-quartier)', '](/blog/transport-annemasse-geneve-leman-express)'),
  content_en = replace(content_en, '](/en/blog/temps-trajet-annemasse-geneve-par-quartier)', '](/en/blog/transport-annemasse-geneve-leman-express)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/temps-trajet-annemasse-geneve-par-quartier)%' OR content_en LIKE '%](/en/blog/temps-trajet-annemasse-geneve-par-quartier)%';

-- geneve-sans-voiture-mobilite-douce-frontaliers  →  /blog/transport-annemasse-geneve-leman-express   (4 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/geneve-sans-voiture-mobilite-douce-frontaliers)', '](/blog/transport-annemasse-geneve-leman-express)'),
  content_en = replace(content_en, '](/en/blog/geneve-sans-voiture-mobilite-douce-frontaliers)', '](/en/blog/transport-annemasse-geneve-leman-express)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%' OR content_en LIKE '%](/en/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%';

-- arriver-seul-geneve-guide-30-jours  →  /blog/demenager-geneve-frontalier-checklist   (6 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/arriver-seul-geneve-guide-30-jours)', '](/blog/demenager-geneve-frontalier-checklist)'),
  content_en = replace(content_en, '](/en/blog/arriver-seul-geneve-guide-30-jours)', '](/en/blog/demenager-geneve-frontalier-checklist)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/arriver-seul-geneve-guide-30-jours)%' OR content_en LIKE '%](/en/blog/arriver-seul-geneve-guide-30-jours)%';

-- 5-erreurs-logement-frontalier-geneve  →  /blog/arnaques-logement-frontalier-geneve-eviter   (5 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/5-erreurs-logement-frontalier-geneve)', '](/blog/arnaques-logement-frontalier-geneve-eviter)'),
  content_en = replace(content_en, '](/en/blog/5-erreurs-logement-frontalier-geneve)', '](/en/blog/arnaques-logement-frontalier-geneve-eviter)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/5-erreurs-logement-frontalier-geneve)%' OR content_en LIKE '%](/en/blog/5-erreurs-logement-frontalier-geneve)%';

-- ─── SECTION 2 : supprimer les auto-liens créés dans les 5 piliers ───
-- (un pilier qui se retrouverait à pointer vers lui-même → on retire le lien,
--  on garde le texte). regexp_replace dénoue [texte](url) → texte.
UPDATE blog_posts SET
  content_fr = regexp_replace(content_fr, '\[([^\]]*)\]\(/blog/budget-colocation-geneve-guide-complet\)', '\1', 'g'),
  content_en = regexp_replace(content_en, '\[([^\]]*)\]\(/en/blog/budget-colocation-geneve-guide-complet\)', '\1', 'g'),
  updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet';

UPDATE blog_posts SET
  content_fr = regexp_replace(content_fr, '\[([^\]]*)\]\(/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher\)', '\1', 'g'),
  content_en = regexp_replace(content_en, '\[([^\]]*)\]\(/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher\)', '\1', 'g'),
  updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';

UPDATE blog_posts SET
  content_fr = regexp_replace(content_fr, '\[([^\]]*)\]\(/blog/colocation-annemasse-ville-la-grand-ambilly\)', '\1', 'g'),
  content_en = regexp_replace(content_en, '\[([^\]]*)\]\(/en/blog/colocation-annemasse-ville-la-grand-ambilly\)', '\1', 'g'),
  updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly';

UPDATE blog_posts SET
  content_fr = regexp_replace(content_fr, '\[([^\]]*)\]\(/blog/transport-annemasse-geneve-leman-express\)', '\1', 'g'),
  content_en = regexp_replace(content_en, '\[([^\]]*)\]\(/en/blog/transport-annemasse-geneve-leman-express\)', '\1', 'g'),
  updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express';

UPDATE blog_posts SET
  content_fr = regexp_replace(content_fr, '\[([^\]]*)\]\(/blog/arnaques-logement-frontalier-geneve-eviter\)', '\1', 'g'),
  content_en = regexp_replace(content_en, '\[([^\]]*)\]\(/en/blog/arnaques-logement-frontalier-geneve-eviter\)', '\1', 'g'),
  updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';

-- ─── SECTION 3 : dette préexistante — liens vers des pages déjà redirigées ───
-- what-is-coliving-and-why-it-matters  →  /le-coliving   (1 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/what-is-coliving-and-why-it-matters)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/what-is-coliving-and-why-it-matters)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/what-is-coliving-and-why-it-matters)%' OR content_en LIKE '%](/en/blog/what-is-coliving-and-why-it-matters)%';

-- coliving-tendance-habitat-jeunes-professionnels-2024  →  /le-coliving   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-tendance-habitat-jeunes-professionnels-2024)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/coliving-tendance-habitat-jeunes-professionnels-2024)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-tendance-habitat-jeunes-professionnels-2024)%' OR content_en LIKE '%](/en/blog/coliving-tendance-habitat-jeunes-professionnels-2024)%';

-- coliving-pour-qui-profil-ideal  →  /le-coliving   (1 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-pour-qui-profil-ideal)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/coliving-pour-qui-profil-ideal)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-pour-qui-profil-ideal)%' OR content_en LIKE '%](/en/blog/coliving-pour-qui-profil-ideal)%';

-- avantages-coliving-jeunes-professionnels  →  /le-coliving   (1 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/avantages-coliving-jeunes-professionnels)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/avantages-coliving-jeunes-professionnels)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/avantages-coliving-jeunes-professionnels)%' OR content_en LIKE '%](/en/blog/avantages-coliving-jeunes-professionnels)%';

-- vie-communautaire-coliving-temoignages  →  /le-coliving   (1 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/vie-communautaire-coliving-temoignages)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/vie-communautaire-coliving-temoignages)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/vie-communautaire-coliving-temoignages)%' OR content_en LIKE '%](/en/blog/vie-communautaire-coliving-temoignages)%';

-- coliving-communaute-reels-amis-geneve-annemasse  →  /le-coliving   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-communaute-reels-amis-geneve-annemasse)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/coliving-communaute-reels-amis-geneve-annemasse)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-communaute-reels-amis-geneve-annemasse)%' OR content_en LIKE '%](/en/blog/coliving-communaute-reels-amis-geneve-annemasse)%';

-- coliving-geneve-frontaliers-guide-2024  →  /blog/coliving-geneve-frontaliers-guide-complet   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-geneve-frontaliers-guide-2024)', '](/blog/coliving-geneve-frontaliers-guide-complet)'),
  content_en = replace(content_en, '](/en/blog/coliving-geneve-frontaliers-guide-2024)', '](/en/blog/coliving-geneve-frontaliers-guide-complet)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-geneve-frontaliers-guide-2024)%' OR content_en LIKE '%](/en/blog/coliving-geneve-frontaliers-guide-2024)%';

-- coliving-geneve-frontalier-guide-complet  →  /blog/coliving-geneve-frontaliers-guide-complet   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-geneve-frontalier-guide-complet)', '](/blog/coliving-geneve-frontaliers-guide-complet)'),
  content_en = replace(content_en, '](/en/blog/coliving-geneve-frontalier-guide-complet)', '](/en/blog/coliving-geneve-frontaliers-guide-complet)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-geneve-frontalier-guide-complet)%' OR content_en LIKE '%](/en/blog/coliving-geneve-frontalier-guide-complet)%';

-- coliving-vs-colocation-choisir-mode-vie-geneve-frontalier  →  /blog/coliving-vs-colocation-differences   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)', '](/blog/coliving-vs-colocation-differences)'),
  content_en = replace(content_en, '](/en/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)', '](/en/blog/coliving-vs-colocation-differences)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%' OR content_en LIKE '%](/en/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%';

-- annemasse-coliving-geneve-frontaliers-guide-complet  →  /blog/coliving-annemasse-geneve-frontaliers-avantages   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/annemasse-coliving-geneve-frontaliers-guide-complet)', '](/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  content_en = replace(content_en, '](/en/blog/annemasse-coliving-geneve-frontaliers-guide-complet)', '](/en/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/annemasse-coliving-geneve-frontaliers-guide-complet)%' OR content_en LIKE '%](/en/blog/annemasse-coliving-geneve-frontaliers-guide-complet)%';

-- coliving-annemasse-geneve-alternative-premium  →  /blog/coliving-annemasse-geneve-frontaliers-avantages   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-annemasse-geneve-alternative-premium)', '](/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  content_en = replace(content_en, '](/en/blog/coliving-annemasse-geneve-alternative-premium)', '](/en/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-annemasse-geneve-alternative-premium)%' OR content_en LIKE '%](/en/blog/coliving-annemasse-geneve-alternative-premium)%';

-- ─── CONTRÔLE : plus aucun lien interne vers une page redirigée ───
SELECT slug FROM blog_posts
WHERE is_published = true AND (
      content_fr LIKE '%](/blog/loyer-frontalier-geneve-combien-payer)%' OR content_en LIKE '%](/en/blog/loyer-frontalier-geneve-combien-payer)%' OR
      content_fr LIKE '%](/blog/studio-geneve-vs-colocation-france-budget)%' OR content_en LIKE '%](/en/blog/studio-geneve-vs-colocation-france-budget)%' OR
      content_fr LIKE '%](/blog/economies-coliving-tout-inclus-geneve)%' OR content_en LIKE '%](/en/blog/economies-coliving-tout-inclus-geneve)%' OR
      content_fr LIKE '%](/blog/meilleurs-quartiers-frontaliers-geneve)%' OR content_en LIKE '%](/en/blog/meilleurs-quartiers-frontaliers-geneve)%' OR
      content_fr LIKE '%](/blog/chambre-meublee-annemasse-geneve)%' OR content_en LIKE '%](/en/blog/chambre-meublee-annemasse-geneve)%' OR
      content_fr LIKE '%](/blog/temps-trajet-annemasse-geneve-par-quartier)%' OR content_en LIKE '%](/en/blog/temps-trajet-annemasse-geneve-par-quartier)%' OR
      content_fr LIKE '%](/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%' OR content_en LIKE '%](/en/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%' OR
      content_fr LIKE '%](/blog/arriver-seul-geneve-guide-30-jours)%' OR content_en LIKE '%](/en/blog/arriver-seul-geneve-guide-30-jours)%' OR
      content_fr LIKE '%](/blog/5-erreurs-logement-frontalier-geneve)%' OR content_en LIKE '%](/en/blog/5-erreurs-logement-frontalier-geneve)%' OR
      content_fr LIKE '%](/blog/what-is-coliving-and-why-it-matters)%' OR content_en LIKE '%](/en/blog/what-is-coliving-and-why-it-matters)%' OR
      content_fr LIKE '%](/blog/coliving-tendance-habitat-jeunes-professionnels-2024)%' OR content_en LIKE '%](/en/blog/coliving-tendance-habitat-jeunes-professionnels-2024)%' OR
      content_fr LIKE '%](/blog/coliving-pour-qui-profil-ideal)%' OR content_en LIKE '%](/en/blog/coliving-pour-qui-profil-ideal)%' OR
      content_fr LIKE '%](/blog/avantages-coliving-jeunes-professionnels)%' OR content_en LIKE '%](/en/blog/avantages-coliving-jeunes-professionnels)%' OR
      content_fr LIKE '%](/blog/vie-communautaire-coliving-temoignages)%' OR content_en LIKE '%](/en/blog/vie-communautaire-coliving-temoignages)%' OR
      content_fr LIKE '%](/blog/coliving-communaute-reels-amis-geneve-annemasse)%' OR content_en LIKE '%](/en/blog/coliving-communaute-reels-amis-geneve-annemasse)%' OR
      content_fr LIKE '%](/blog/coliving-geneve-frontaliers-guide-2024)%' OR content_en LIKE '%](/en/blog/coliving-geneve-frontaliers-guide-2024)%' OR
      content_fr LIKE '%](/blog/coliving-geneve-frontalier-guide-complet)%' OR content_en LIKE '%](/en/blog/coliving-geneve-frontalier-guide-complet)%' OR
      content_fr LIKE '%](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%' OR content_en LIKE '%](/en/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%' OR
      content_fr LIKE '%](/blog/annemasse-coliving-geneve-frontaliers-guide-complet)%' OR content_en LIKE '%](/en/blog/annemasse-coliving-geneve-frontaliers-guide-complet)%' OR
      content_fr LIKE '%](/blog/coliving-annemasse-geneve-alternative-premium)%' OR content_en LIKE '%](/en/blog/coliving-annemasse-geneve-alternative-premium)%'
);  -- doit renvoyer 0 ligne
