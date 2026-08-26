# Carte du maillage interne — 2026-08-21

**Provenance** : branche `feature/acquisition-autorite` · HEAD `92289ec` · prérendus commités le 2026-08-21 08:33:41 +0000 · 117 pages analysées (117 au sitemap) · 4621 liens internes.

Méthode : un lien est **contextuel** s'il est dans `<main>` et n'est ni une carte (`related`/`cards`) ni du chrome ; `editorial` = lien markdown du blog (classe `text-[#D4A574] hover:underline`). Classes d'ancre : marque · URL nue · générique · exact/partiel (règle off-site 40/25/25/10, ici à titre d'alerte). Pilier `/colocation-geneve` : gelé 25/08 → 05/10 (page seule) — les liens **vers** lui restent autorisés.

## 1. Chiffres globaux

| zone | liens |
|---|---|
| nav | 922 |
| content | 1 859 |
| footer | 1 840 |

| sous-type | liens |
|---|---|
| footer | 1 840 |
| nav | 922 |
| editorial | 673 |
| related | 339 |
| content-other | 323 |
| cards | 291 |
| cta | 233 |

Moyenne d'entrants contextuels par page (hors blog) : FR 20.4 · EN 23.5. Domaines externes liés : 48.

## 2. Pages money — entrants par type

| page | nav | footer | éditorial | cta | related/cards | autres | **contextuels** | sources distinctes | éditoriaux depuis le blog |
|---|---|---|---|---|---|---|---|---|---|
| / | 57 | 114 | 0 | 0 | 0 | 1 | 1 | 1 | 0 |
| /annemasse-colocation | 0 | 0 | 15 | 0 | 1 | 7 | 22 | 19 | 15 |
| /chambre-a-louer-annemasse | 0 | 0 | 11 | 0 | 0 | 4 | 15 | 15 | 11 |
| /tarifs | 57 | 57 | 9 | 3 | 0 | 6 | 18 | 15 | 9 |
| /candidature | 57 | 114 | 40 | 96 | 2 | 7 | 143 | 51 | 40 |
| /nos-maisons | 57 | 57 | 24 | 5 | 1 | 3 | 32 | 24 | 24 |
| /lavilla | 0 | 0 | 5 | 2 | 46 | 1 | 8 | 6 | 5 |
| /leloft | 0 | 0 | 3 | 2 | 46 | 1 | 6 | 4 | 3 |
| /lelodge | 0 | 0 | 7 | 2 | 46 | 11 | 20 | 14 | 7 |
| /le-coliving | 0 | 57 | 5 | 0 | 0 | 1 | 6 | 5 | 5 |
| /en | 58 | 116 | 0 | 0 | 0 | 1 | 1 | 1 | 0 |
| /en/colocation-geneve | 58 | 58 | 44 | 1 | 1 | 39 | 84 | 41 | 44 |
| /en/annemasse-colocation | 0 | 0 | 15 | 0 | 2 | 7 | 22 | 19 | 15 |
| /en/chambre-a-louer-annemasse | 0 | 0 | 10 | 0 | 1 | 4 | 14 | 14 | 10 |
| /en/tarifs | 58 | 58 | 9 | 3 | 0 | 8 | 20 | 16 | 9 |
| /en/candidature | 58 | 116 | 34 | 98 | 2 | 7 | 139 | 52 | 34 |
| /en/nos-maisons | 58 | 58 | 21 | 6 | 1 | 4 | 31 | 25 | 21 |
| /en/lavilla | 0 | 0 | 5 | 2 | 47 | 1 | 8 | 6 | 5 |
| /en/leloft | 0 | 0 | 3 | 2 | 47 | 1 | 6 | 4 | 3 |
| /en/lelodge | 0 | 0 | 7 | 2 | 47 | 11 | 20 | 14 | 7 |
| /en/le-coliving | 0 | 58 | 3 | 0 | 0 | 1 | 4 | 4 | 3 |

## 3. Pages money sous-alimentées (< 3 entrants contextuels, ou 0 lien éditorial depuis le blog)

| page | contextuels | éditoriaux blog | motif |
|---|---|---|---|
| / | 1 | 0 | < 3 contextuels |
| /en | 1 | 0 | < 3 contextuels |

## 4. Orphelines

- **Strictes (0 entrant)** : aucune
- **Quasi-orphelines contextuelles (entrants seulement via nav/footer/cartes)** : /investisseurs, /mentions-legales, /en/investisseurs, /en/mentions-legales
- **Hors sitemap** : aucune

## 5. Ancres contextuelles entrantes par page money (vs 40 % marque / 25 % URL nue / 25 % générique / 10 % exact)

| page | n | marque | URL nue | générique | exact+partiel | top ancres | alerte |
|---|---|---|---|---|---|---|---|
| / | 1 | 0 % | 0 % | 100 % | 0 % | « coliving à genève » ×1 | — |
| /annemasse-colocation | 22 | 0 % | 0 % | 5 % | 95 % | « colocation à annemasse » ×16 · « voir le guide complet colocation annemasse » ×1 · « guide colocation annemasse » ×1 · « la colocation à annemasse » ×1 · « tu cherches côté annemasse ? colocation à annemasse → » ×1 | exact+partiel 95 % ≥ 50 % ; une même ancre 73 % |
| /chambre-a-louer-annemasse | 15 | 0 % | 0 % | 0 % | 100 % | « chambres à louer à annemasse » ×8 · « chambre à louer à annemasse » ×6 · « chambre à louer à annemasse — nos disponibilités » ×1 | exact+partiel 100 % ≥ 50 % |
| /tarifs | 18 | 6 % | 0 % | 22 % | 72 % | « tarifs » ×6 · « voir les tarifs » ×5 · « voir le détail des tarifs » ×2 · « nos tarifs tout compris » ×1 · « grille tarifaire » ×1 | exact+partiel 72 % ≥ 50 % |
| /candidature | 143 | 2 % | 0 % | 84 % | 14 % | « candidater — 2 min, gratuit » ×77 · « candidater » ×16 · « candidatez en 2 minutes → » ×6 · « candidatez ici » ×4 · « postuler » ×3 | — |
| /nos-maisons | 32 | 16 % | 0 % | 28 % | 56 % | « nos maisons » ×8 · « découvrir nos maisons » ×2 · « nos 3 maisons » ×2 · « trois maisons » ×2 · « découvrez la villa coliving » ×2 | exact+partiel 56 % ≥ 50 % |
| /lavilla | 8 | 0 % | 0 % | 50 % | 50 % | « découvrir » ×1 · « colocation à ville-la-grand » ×1 · « voir les détails » ×1 · « la villa » ×1 · « la villa, à ville-la-grand » ×1 | exact+partiel 50 % ≥ 50 % |
| /leloft | 6 | 0 % | 0 % | 67 % | 33 % | « découvrir » ×1 · « colocation à ambilly » ×1 · « voir les détails » ×1 · « le loft » ×1 · « loft, à ambilly » ×1 | — |
| /lelodge | 20 | 0 % | 0 % | 15 % | 85 % | « découvrir le lodge » ×10 · « le lodge » ×5 · « le lodge — 12 chambres annemasse » ×1 · « découvrir » ×1 · « voir les détails » ×1 | exact+partiel 85 % ≥ 50 % |
| /le-coliving | 6 | 33 % | 0 % | 17 % | 50 % | « le coliving » ×2 · « coliving : pour qui c'est fait (et pour qui non) » ×1 · « la villa coliving » ×1 · « qu'est-ce que le coliving et pourquoi c'est important en 2025 » ×1 · « vivre en coliving : témoignages et vie communautaire à la villa » ×1 | exact+partiel 50 % ≥ 50 % |
| /en | 1 | 0 % | 0 % | 100 % | 0 % | « coliving in geneva » ×1 | — |
| /en/colocation-geneve | 84 | 1 % | 0 % | 11 % | 88 % | « shared housing in geneva » ×33 · « shared housing near geneva » ×30 · « shared housing geneva » ×6 · « all-inclusive coliving 20 min from geneva » ×5 · « all-inclusive shared housing in geneva » ×2 | exact+partiel 88 % ≥ 50 % |
| /en/annemasse-colocation | 22 | 0 % | 0 % | 32 % | 68 % | « shared housing in annemasse » ×14 · « in annemasse » ×2 · « see full annemasse coliving guide » ×1 · « annemasse coliving guide » ×1 · « looking on the annemasse side? shared housing in annemasse → » ×1 | exact+partiel 68 % ≥ 50 % ; une même ancre 64 % |
| /en/chambre-a-louer-annemasse | 14 | 0 % | 0 % | 14 % | 86 % | « rooms for rent in annemasse » ×12 · « room for rent in annemasse » ×1 · « rooms to rent in annemasse » ×1 | exact+partiel 86 % ≥ 50 % ; une même ancre 86 % |
| /en/tarifs | 20 | 5 % | 0 % | 90 % | 5 % | « pricing » ×6 · « check rates » ×3 · « see full pricing » ×1 · « see pricing » ×1 · « see what's included in the rent » ×1 | — |
| /en/candidature | 139 | 2 % | 0 % | 80 % | 18 % | « apply — 2 min, free » ×75 · « apply now » ×18 · « apply » ×6 · « apply in 2 minutes » ×6 · « apply — reply within 48h » ×4 | — |
| /en/nos-maisons | 31 | 16 % | 0 % | 23 % | 61 % | « our houses » ×8 · « explore our houses » ×3 · « discover la villa coliving » ×3 · « our 3 houses » ×2 · « three houses » ×2 | exact+partiel 61 % ≥ 50 % |
| /en/lavilla | 8 | 0 % | 0 % | 50 % | 50 % | « discover » ×1 · « flatshare in ville-la-grand » ×1 · « view details » ×1 · « la villa » ×1 · « villa, in ville-la-grand » ×1 | exact+partiel 50 % ≥ 50 % |
| /en/leloft | 6 | 0 % | 0 % | 67 % | 33 % | « discover » ×1 · « flatshare in ambilly » ×1 · « view details » ×1 · « le loft » ×1 · « loft, in ambilly » ×1 | — |
| /en/lelodge | 20 | 0 % | 0 % | 15 % | 85 % | « discover le lodge » ×10 · « le lodge » ×5 · « le lodge — 12 rooms annemasse » ×1 · « discover » ×1 · « view details » ×1 | exact+partiel 85 % ≥ 50 % |
| /en/le-coliving | 4 | 25 % | 0 % | 75 % | 0 % | « what is coliving » ×1 · « coliving » ×1 · « coliving: who it's for (and who it's not) » ×1 · « la villa coliving » ×1 | — |

## 6. Opportunités blog → pages money (mentions sans lien éditorial, ≥ 2)

Correction = SQL sur `blog_posts.content_fr/en` (pas dans le repo) ; ancre suggérée selon la distribution actuelle de la cible ; ne jamais re-pointer l'article élu vers le pilier en sens inverse pendant le gel.

| article | cible | mentions | extrait (1ʳᵉ mention) | ancre suggérée |
|---|---|---|---|---|
| /en/blog/lodge-annemasse-coliving-premium-portes-geneve | /en/colocation-geneve | 7 | …s exactly why we chose to open Le Lodge here. If you're exploring the area, our shared housing in Annemasse page gives you an overview of the local market. La Villa Coliving:… | générique ou marque |
| /en/blog/living-in-france-working-in-geneva | /en/annemasse-colocation | 7 | …ic Transport) TPG provides dense coverage from Geneva toward France. Main lines to Annemasse, Ville-la-Grand, Ambilly, etc., are frequent (every 15-30 minutes at peak hours… | générique ou marque |
| /blog/coliving-vs-colocation-differences | /lavilla | 6 | …chaque résident a : Sa chambre privée , beaucoup plus grande (jusqu'à 2 fois à La Villa), meublée et décorée avec soin Accès à des espaces communs premium : cuisine éq… | générique ou marque |
| /blog/budget-colocation-geneve-guide-complet | /lavilla | 6 | …acontent de leur ancien logement quand ils arrivent chez nous. En coliving chez La Villa, le prix affiché est le prix payé. Point. Quel pourcentage de votre salaire con… | générique ou marque |
| /blog/colocation-expats-geneve-guide | /lavilla | 6 | …ambre privée meublée avec lit double, bureau, rangements 🏊 Piscine (chauffée à La Villa, intérieure au Loft) 💪 Salle de sport et sauna 🧹 Ménage 2x/semaine 📶 Interne… | générique ou marque |
| /blog/temps-trajet-annemasse-geneve-par-quartier | /lelodge | 6 | …principal de la zone frontalière. La gare du Léman Express est en plein centre. Le Lodge de La Villa Coliving (12 chambres) est à Annemasse, à environ 9 minutes à pied… | générique ou marque |
| /en/blog/temps-trajet-annemasse-geneve-par-quartier | /en/lelodge | 6 | …der area. The Léman Express station is right in the center. La Villa Coliving's Le Lodge (12 rooms) is in Annemasse, about a 9-minute walk from the station. The advanta… | générique ou marque |
| /blog/guide-ressources-frontalier-geneve | /lavilla | 5 | …logement : le nerf de la guerre Les ressources et contacts à connaître Et chez La Villa ? FAQ — Les questions qu'on nous pose le plus En résumé Travailler en Suisse qu… | générique ou marque |
| /en/blog/cout-de-la-vie-suisse-france-frontalier-2026 | /en/annemasse-colocation | 5 | …s own. At equivalent size, housing in Geneva costs two to three times more than in Annemasse, 20 minutes away. Property type Geneva (CHF/mo) Annemasse (French side) Gap Stu… | générique ou marque |
| /en/blog/coliving-geneve-frontaliers-guide-complet | /en/annemasse-colocation | 5 | …location balance : Living near Geneva without paying Geneva prices is possible. In Annemasse, for example, you stay just minutes from your workplace while benefiting from F… | générique ou marque |
| /en/blog/guide-ressources-frontalier-geneve | /en/lavilla | 5 | …u, and how 6. Housing: the real challenge Resources and contacts to know And at La Villa? FAQ — the questions we hear most In short Working in Switzerland while living… | générique ou marque |
| /en/blog/budget-colocation-geneve-guide-complet | /en/lavilla | 5 | …esidents tell us about their previous housing when they move in. In coliving at La Villa, the listed price is the price you pay. Period. What Percentage of Your Salary… | générique ou marque |
| /en/blog/colocation-expats-geneve-guide | /en/lavilla | 5 | …d: 🛏️ Private furnished room with double bed, desk, storage 🏊 Pool (heated at La Villa, indoor at Le Loft) 💪 Gym and sauna 🧹 Cleaning 2x/week 📶 High-speed fiber in… | générique ou marque |
| /blog/temps-trajet-annemasse-geneve-par-quartier | /lavilla | 4 | …L'équivalent de 3 à 5 mois de loyer en coliving. Le hack mobilité des résidents La Villa Nos résidents ont trouvé la formule optimale : le Léman Express comme transport… | générique ou marque |
| /blog/grand-geneve-2026-nouveautes-frontaliers | /lavilla | 4 | …u Grand Genève. Nos trois maisons - Le Lodge à Annemasse, Le Loft à Ambilly, et La Villa à Ville-la-Grand - sont parfaitement positionnées pour profiter des amélioratio… | générique ou marque |
| /blog/temps-trajet-annemasse-geneve-par-quartier | /leloft | 4 | …uartier international. Depuis Ambilly Ambilly jouxte Annemasse et la frontière. Le Loft de La Villa Coliving (7 chambres) est à Ambilly. Les temps sont très proches de… | partiel (naturel) ou générique |
| /blog/espaces-verts-coliving-lodge-annemasse | /lelodge | 4 | …pour frontaliers 👉 Tu vises Annemasse et ses alentours ? À La Villa Coliving (Le Lodge à Annemasse, La Villa à Ville-la-Grand, Le Loft à Ambilly), une chambre meublée… | générique ou marque |
| /blog/coliving-frais-dossier-geneve-annemasse | /lelodge | 4 | …s, gratuitement . 👉 Tu vises Annemasse et ses alentours ? À La Villa Coliving (Le Lodge à Annemasse, La Villa à Ville-la-Grand, Le Loft à Ambilly), une chambre meublée… | générique ou marque |
| /blog/coliving-annemasse-geneve-frontaliers-avantages | /lelodge | 4 | …idents de La Villa Coliving de profiter pleinement des avantages des deux pays. Le Lodge Annemasse de La Villa Coliving tire parti de cette localisation exceptionnelle… | générique ou marque |
| /blog/coliving-transfrontalier-geneve-annemasse-nouvelle-vie | /lelodge | 4 | …uide complet 2026 👉 Tu vises Annemasse et ses alentours ? À La Villa Coliving (Le Lodge à Annemasse, La Villa à Ville-la-Grand, Le Loft à Ambilly), une chambre meublée… | générique ou marque |
| /blog/transport-annemasse-geneve-leman-express | /lelodge | 4 | …en 2 minutes → 👉 Vous visez Annemasse et ses alentours ? À La Villa Coliving (Le Lodge à Annemasse, La Villa à Ville-la-Grand, Le Loft à Ambilly), une chambre meublée… | générique ou marque |
| /en/blog/temps-trajet-annemasse-geneve-par-quartier | /en/colocation-geneve | 4 | …ighborhoods near Geneva 👉 Thinking of living in Annemasse or nearby? Check out shared housing in Annemasse or our rooms for rent in Annemasse — all-inclusive from CHF 1,380/… | générique ou marque |
| /en/blog/cout-transport-frontalier-geneve-2026 | /en/colocation-geneve | 4 | …Annemasse: travel times to Geneva Geneva without a car: the soft mobility guide Shared housing budget near Geneva: the complete guide 👉 Thinking of living in Annemasse or ne… | générique ou marque |
| /en/blog/guide-ressources-frontalier-geneve | /en/annemasse-colocation | 4 | …individually. The GTE (see the Resources chapter) and the cross-border brokers in Annemasse or Saint-Julien offer personalised, often free, simulations. Go further: LAMal… | générique ou marque |
| /en/blog/demenager-geneve-frontalier-checklist | /en/candidature | 4 | …l-inclusive from CHF 1,380 /month — 10 rooms · pool · garden — Ville-la-Grand . Apply — 2 min, free Your First 30 Days, Day by Day (If You Arrive Alone) The checklis… | partiel (naturel) ou générique |
| /en/blog/living-in-france-working-in-geneva | /en/candidature | 4 | …ation (tax scale, marital status, dependent children). Good news: you can often apply for quasi-resident status in Geneva to deduct certain expenses (3rd pillar, pro… | partiel (naturel) ou générique |
| /en/blog/temps-trajet-annemasse-geneve-par-quartier | /en/lavilla | 4 | …savings. The equivalent of 3 to 5 months of coliving rent. The mobility hack of La Villa residents Our residents have found the optimal formula: Léman Express as main t… | générique ou marque |
| /en/blog/grand-geneve-2026-nouveautes-frontaliers | /en/lavilla | 4 | …eva communes. Our three houses - Le Lodge in Annemasse, Le Loft in Ambilly, and La Villa in Ville-la-Grand - are perfectly positioned to benefit from transport improvem… | générique ou marque |
| /en/blog/temps-trajet-annemasse-geneve-par-quartier | /en/leloft | 4 | …t. From Ambilly Ambilly borders Annemasse and the frontier. La Villa Coliving's Le Loft (7 rooms) is in Ambilly. Times are very close to Ville-la-Grand, with a slight… | partiel (naturel) ou générique |
| /en/blog/espaces-verts-coliving-lodge-annemasse | /en/lelodge | 4 | …der workers 👉 Thinking of living in Annemasse or nearby? At La Villa Coliving (Le Lodge in Annemasse, La Villa in Ville-la-Grand, Le Loft in Ambilly), a furnished all-… | générique ou marque |
| /en/blog/coliving-frais-dossier-geneve-annemasse | /en/lelodge | 4 | …for free . 👉 Thinking of living in Annemasse or nearby? At La Villa Coliving (Le Lodge in Annemasse, La Villa in Ville-la-Grand, Le Loft in Ambilly), a furnished all-… | générique ou marque |
| /en/blog/coliving-transfrontalier-geneve-annemasse-nouvelle-vie | /en/lelodge | 4 | …plete guide 👉 Thinking of living in Annemasse or nearby? At La Villa Coliving (Le Lodge in Annemasse, La Villa in Ville-la-Grand, Le Loft in Ambilly), a furnished all-… | générique ou marque |
| /en/blog/transport-annemasse-geneve-leman-express | /en/lelodge | 4 | …k is human. 👉 Thinking of living in Annemasse or nearby? At La Villa Coliving (Le Lodge in Annemasse, La Villa in Ville-la-Grand, Le Loft in Ambilly), a furnished all-… | générique ou marque |
| /blog/quitter-son-logement-guide-pratique | /lavilla | 3 | …c'est mieux. Voici le message que Fanny transmet à chacun de nos locataires de La Villa avant l'état des lieux de sortie. Tu peux t'en inspirer, quel que soit ton loge… | générique ou marque |
| /blog/optimiser-espace-coliving-productivite-bien-etre | /lavilla | 3 | …n bon fauteuil. WiFi : testez la réception selon les coins de la chambre ; chez La Villa, la fibre est dimensionnée pour plusieurs visioconférences simultanées. Bruit :… | générique ou marque |
| /blog/se-faire-reseau-geneve-arriver-seul | /lavilla | 3 | …qui non) Envie de démarrer avec un réseau déjà en place ? Découvrez le coliving La Villa et candidatez ici . 👉 Vous cherchez une colocation à Genève ? À La Villa Coliv… | générique ou marque |
| /blog/organisations-internationales-geneve-ou-habiter | /lavilla | 3 | …Bail long Studio côté France 700-950 € 40-50 min ❌ Isolé ✅ Bail souple Coliving La Villa 1 380 CHF 35-45 min ✅ Communauté ✅ 1 mois préavis Le coliving est le meilleur c… | générique ou marque |
| /blog/cout-transport-frontalier-geneve-2026 | /lavilla | 3 | …u vises Annemasse et ses alentours ? À La Villa Coliving (Le Lodge à Annemasse, La Villa à Ville-la-Grand, Le Loft à Ambilly), une chambre meublée tout inclus coûte 1 3… | générique ou marque |
| /blog/living-in-france-working-in-geneva | /lavilla | 3 | …ambres, 1 380 CHF/mois), Le Lodge à Annemasse (12 chambres, 1 380 CHF/mois), et La Villa à Ville-la-Grand (10 chambres, 1 380 CHF/mois). Chaque chambre est privée, meub… | générique ou marque |
| /blog/colocation-annemasse-ville-la-grand-ambilly | /lelodge | 3 | …rche comment frontalier 1 chambre libre dès le 11 septembre La Villa Coliving · Le Lodge Tu cherches une chambre près de Genève ? Tout inclus dès 1 380 CHF /mois 29 cha… | générique ou marque |
| /en/blog/coliving-communaute-reels-amis-geneve-annemasse | /en/colocation-geneve | 3 | …Also read: Le Lodge: A Guided Tour of Premium Coliving in Annemasse Coliving vs flatshare: the real differences Building a network in Geneva when you arrive alone amitié… | générique ou marque |
| /en/blog/espaces-verts-coliving-lodge-annemasse | /en/colocation-geneve | 3 | …he water, a quiet Sunday in the sun. A real everyday luxury — rare in a classic flatshare and unaffordable on the Geneva side. Pétanque and darts: good times, no plannin… | générique ou marque |
| /en/blog/coliving-transfrontalier-geneve-annemasse-nouvelle-vie | /en/colocation-geneve | 3 | …Also read: Coliving in Annemasse: the benefits for cross-border workers Finding Shared Housing in Geneva (2026) Living in France, Working in Geneva: the complete guide 👉 Thi… | générique ou marque |
| /en/blog/se-faire-reseau-geneve-arriver-seul | /en/annemasse-colocation | 3 | …side is an excellent way to meet other professionals in the same situation. The Annemasse Agglo incubator, the shared spaces developing in the area — these places attract free… | générique ou marque |
| /en/blog/organisations-internationales-geneve-ou-habiter | /en/annemasse-colocation | 3 | …heron station (Léman Express), 10-15 minutes' walk from the Palais des Nations. From Annemasse by Léman Express: 25 minutes to Sécheron, then 10-15 minutes' walk or 1 bus sto… | générique ou marque |

_(109 autres dans le JSON)_

## 7. Fuites cross-langue (liens de contenu FR→EN ou EN→FR) et liens vers des redirections

_(aucune ligne)_

_(aucune ligne)_

## 8. Top donneurs (pages avec le plus de liens éditoriaux sortants)

| page | liens éditoriaux sortants |
|---|---|
| /blog/guide-ressources-frontalier-geneve | 22 |
| /en/blog/guide-ressources-frontalier-geneve | 22 |
| /blog/salaire-suisse-net-frontalier-2026 | 20 |
| /blog/cout-de-la-vie-suisse-france-frontalier-2026 | 15 |
| /blog/quartiers-annemasse-ou-vivre-selon-profil | 15 |
| /en/blog/cout-de-la-vie-suisse-france-frontalier-2026 | 15 |
| /en/blog/salaire-suisse-net-frontalier-2026 | 13 |
| /blog/lodge-annemasse-coliving-premium-portes-geneve | 12 |
| /blog/ecole-internationale-geneve-frontalier-ou-habiter | 12 |
| /blog/trouver-colocation-geneve-frontalier | 12 |
| /en/blog/lodge-annemasse-coliving-premium-portes-geneve | 12 |
| /en/blog/trouver-colocation-geneve-frontalier | 12 |
| /blog/allocations-familiales-frontalier-geneve-2026 | 11 |
| /en/blog/allocations-familiales-frontalier-geneve-2026 | 11 |
| /en/blog/quartiers-annemasse-ou-vivre-selon-profil | 11 |

## 9. Paramètres

- MONEY_ROUTES (présentes) : /, /annemasse-colocation, /chambre-a-louer-annemasse, /tarifs, /candidature, /nos-maisons, /lavilla, /leloft, /lelodge, /le-coliving, /en, /en/colocation-geneve, /en/annemasse-colocation, /en/chambre-a-louer-annemasse, /en/tarifs, /en/candidature, /en/nos-maisons, /en/lavilla, /en/leloft, /en/lelodge, /en/le-coliving
- Seuils : {"underfedContextual":3,"overOptimizedShare":0.5,"overOptimizedMinN":5,"sameAnchorShare":0.6,"mentionMin":2}
- Source : `public/prerendered/` (régénérer : `npm run build:local && npm run build`) · sitemap : `public/sitemap.xml` · redirections : `vercel.json`
- Script : `tools/link-graph.mjs` · config : `tools/lib/config.mjs` · extraction : `tools/lib/html-links.mjs` (réutilise `scripts/seo-lint.mjs`)
