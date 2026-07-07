-- ============================================================
-- CORRECTIONS FACTUELLES 07/07/2026 -- 4 articles (FR+EN)
-- guide-ressources, assurance-sante, budget-colocation, transport-annemasse
-- 34 remplacements, ancres verifiees uniques contre la base.
-- SQL 100% ASCII -- coller tel quel dans Supabase.
-- ============================================================

UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Trains **toutes les 15 minutes** en heure de pointe (toutes les 30 min en heures creuses)', E'Trains **toutes les 10 minutes** en heure de pointe (toutes les 15 minutes le reste de la journ\u00e9e)'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Trains **every 15 minutes** at peak (every 30 off-peak)', E'Trains **every 10 minutes** at peak (every 15 minutes the rest of the day)'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Un **abonnement toutes zones** co\u00fbte de l''ordre de **80 CHF/mois** (abonnement zones 10+210, [tpg.ch](https://www.tpg.ch))', E'L''**abonnement mensuel L\u00e9man Pass** zones 10+210 (Gen\u00e8ve + agglo d''Annemasse) co\u00fbte **119,50 \u20ac, soit ~115 CHF** \u2014 82,90 \u20ac en tarif jeune ([tac-mobilites.fr](https://www.tac-mobilites.fr/titres/abonnements-leman-pass))'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'An **all-zones pass** costs on the order of **80 CHF/month** (zones 10+210, [tpg.ch](https://www.tpg.ch))', E'A monthly **L\u00e9man Pass** for zones 10+210 (Geneva + Annemasse agglo) costs **\u20ac119.50, i.e. ~115 CHF** \u2014 \u20ac82.90 for under-26s ([tac-mobilites.fr](https://www.tac-mobilites.fr/titres/abonnements-leman-pass))'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'| L\u00e9man Express | ~80 CHF | ~20 min | Tr\u00e8s \u00e9lev\u00e9e |', E'| L\u00e9man Express | ~115 CHF | ~20 min | Tr\u00e8s \u00e9lev\u00e9e |'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'| L\u00e9man Express | ~80 CHF | ~20 min | Very high |', E'| L\u00e9man Express | ~115 CHF | ~20 min | Very high |'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'| Tram 17 (transfrontalier) | ~80 CHF (Unireso) | ~20 min (Croix d''Ambilly \u2192 Terrassi\u00e8re) | \u00c9lev\u00e9e |', E'| Tram 17 (transfrontalier) | ~115 CHF (L\u00e9man Pass 10+210) | ~20 min (Croix d''Ambilly \u2192 Terrassi\u00e8re) | \u00c9lev\u00e9e |'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'| Tram 17 (cross-border) | ~80 CHF (Unireso) | ~20 min (Croix d''Ambilly \u2192 Terrassi\u00e8re) | High |', E'| Tram 17 (cross-border) | ~115 CHF (L\u00e9man Pass 10+210) | ~20 min (Croix d''Ambilly \u2192 Terrassi\u00e8re) | High |'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'C''est l''option par d\u00e9faut. Tu choisis un **assureur suisse** (Helsana, CSS, Swica, Groupe Mutuel\u2026), une **franchise annuelle de 300 \u00e0 2 500 CHF**, et tu paies une **prime mensuelle**. Trois caract\u00e9ristiques \u00e0 comprendre :', E'C''est l''option par d\u00e9faut. Tu choisis un **assureur suisse** (Helsana, CSS, Swica, Groupe Mutuel\u2026) et tu paies une **prime mensuelle** ; la **franchise est fixe pour les frontaliers : 300 CHF/an**, sans franchise \u00e0 option contrairement aux r\u00e9sidents suisses. Trois caract\u00e9ristiques \u00e0 comprendre :'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'It is the default option. You pick a **Swiss insurer** (Helsana, CSS, Swica, Groupe Mutuel\u2026), an **annual deductible of 300 to 2,500 CHF**, and pay a **monthly premium**. Three things to understand:', E'It is the default option. You pick a **Swiss insurer** (Helsana, CSS, Swica, Groupe Mutuel\u2026) and pay a **monthly premium**; the **deductible is fixed for cross-border workers: 300 CHF/year**, with no optional higher deductibles, unlike Swiss residents. Three things to understand:'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'| Franchise | 300 \u00e0 2 500 CHF/an + quote-part 10 % (max 700 CHF/an) | Pas de franchise \u00e0 avancer |', E'| Franchise | 300 CHF/an (fixe) + quote-part 10 % (max 700 CHF/an) | Pas de franchise \u00e0 avancer |'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'| Deductible | 300 to 2,500 CHF/year + 10% co-pay (max 700 CHF/year) | No deductible to advance |', E'| Deductible | Fixed 300 CHF/year + 10% co-pay (max 700 CHF/year) | No deductible to advance |'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'*\\*Prime forfaitaire, **ind\u00e9pendante du salaire** : elle varie selon l''\u00e2ge, le canton et la franchise. La valeur de ~280 CHF correspond \u00e0 un adulte de 25-35 ans avec une franchise basse (300 CHF) chez une caisse comp\u00e9titive ; les offres les moins ch\u00e8res d\u00e9marrent autour de 200 CHF, et choisir une franchise \u00e9lev\u00e9e (2 500 CHF) ram\u00e8ne la prime vers ~200 CHF \u2014 mais en t''exposant \u00e0 davantage de frais \u00e0 ta charge avant remboursement. Ordres de grandeur indicatifs, hors situation individuelle.*', E'*\\*Prime forfaitaire, **ind\u00e9pendante du salaire** : elle varie selon l''\u00e2ge et la caisse. La valeur de ~280 CHF correspond \u00e0 un adulte de 25-35 ans chez une caisse comp\u00e9titive ; les offres les moins ch\u00e8res d\u00e9marrent autour de 200 CHF. La franchise, elle, est fixe pour les frontaliers (300 CHF/an), avec une quote-part de 10 % plafonn\u00e9e \u00e0 700 CHF/an. Ordres de grandeur indicatifs, hors situation individuelle.*'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'*\\*Flat premium, **independent of salary**: it varies with age, canton and deductible. The ~280 CHF figure corresponds to a 25-35-year-old with a low deductible (300 CHF) at a competitive insurer; the cheapest offers start around 200 CHF, and choosing a high deductible (2,500 CHF) brings the premium toward ~200 CHF \u2014 but exposing you to more out-of-pocket costs before reimbursement. Indicative orders of magnitude, individual situations vary.*', E'*\\*Flat premium, **independent of salary**: it varies with age and insurer. The ~280 CHF figure corresponds to a 25-35-year-old at a competitive insurer; the cheapest offers start around 200 CHF. The deductible is fixed for cross-border workers (300 CHF/year), with a 10% co-pay capped at 700 CHF/year. Indicative orders of magnitude, individual situations vary.*'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- assurance-sante-frontalier-lamal-cmu-budget (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Vous choisissez un assureur suisse (Helsana, CSS, Swica, Groupe Mutuel, etc.), une franchise annuelle (300 \u00e0 2 500 CHF \u2014 le montant que vous payez avant que l''assurance prenne le relais), et vous payez une prime mensuelle. La prime varie selon votre \u00e2ge, le canton, et la franchise choisie.', E'Vous choisissez un assureur suisse (Helsana, CSS, Swica, Groupe Mutuel, etc.) et vous payez une prime mensuelle. La franchise \u2014 le montant que vous payez avant que l''assurance prenne le relais \u2014 est fixe pour les frontaliers : 300 CHF par an, sans franchise \u00e0 option contrairement aux r\u00e9sidents suisses. La prime varie selon la caisse et votre \u00e2ge.'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'You choose a Swiss insurer (Helsana, CSS, Swica, Groupe Mutuel, etc.), an annual deductible (300 to 2,500 CHF \u2014 the amount you pay before insurance kicks in), and you pay a monthly premium. The premium varies by age, canton, and chosen deductible.', E'You choose a Swiss insurer (Helsana, CSS, Swica, Groupe Mutuel, etc.) and you pay a monthly premium. The deductible \u2014 the amount you pay before insurance kicks in \u2014 is fixed for cross-border workers: 300 CHF per year, with no optional higher deductibles, unlike Swiss residents. The premium varies by insurer and your age.'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Pour un frontalier de 25-35 ans travaillant \u00e0 Gen\u00e8ve, la prime LAMal se situe entre 250 et 450 CHF par mois avec une franchise de 2 500 CHF (la plus \u00e9conomique). Avec une franchise de 300 CHF (couverture maximale), comptez 380-550 CHF/mois.', E'Pour un frontalier de 25-35 ans travaillant \u00e0 Gen\u00e8ve, la prime LAMal se situe g\u00e9n\u00e9ralement entre 200 et 350 CHF par mois selon la caisse ([le point du GTE sur les primes 2026](https://www.frontalier.org/actualites/primes-lamal-2026-pour-les-frontaliers-une-annee-quasi-blanche-avant-la-reforme-de-2028/)). La franchise, elle, est la m\u00eame pour tous : 300 CHF/an.'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'For a cross-border worker aged 25-35 working in Geneva, the LAMal premium is between 250 and 450 CHF per month with a 2,500 CHF deductible (the most economical). With a 300 CHF deductible (maximum coverage), expect 380-550 CHF/month.', E'For a cross-border worker aged 25-35 working in Geneva, the LAMal premium is generally between 200 and 350 CHF per month depending on the insurer ([GTE overview of 2026 premiums](https://www.frontalier.org/actualites/primes-lamal-2026-pour-les-frontaliers-une-annee-quasi-blanche-avant-la-reforme-de-2028/)). The deductible is the same for everyone: 300 CHF/year.'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'| Salaire brut annuel | Prime LAMal (franchise 2500) | Cotisation CMU-PUMa | \u00c9cart mensuel | Option recommand\u00e9e |', E'| Salaire brut annuel | Prime LAMal (forfaitaire) | Cotisation CMU-PUMa | \u00c9cart mensuel | Option recommand\u00e9e |'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'| Annual gross salary | LAMal premium (2500 deductible) | CMU-PUMa contribution | Monthly gap | Recommended option |', E'| Annual gross salary | LAMal premium (flat) | CMU-PUMa contribution | Monthly gap | Recommended option |'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'| 65 000 CHF | ~320 CHF | ~300 CHF | 20 CHF | \u00c9quivalent |', E'| 65 000 CHF | ~300 CHF | ~300 CHF | 0 CHF | \u00c9quivalent |'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'| 65,000 CHF | ~320 CHF | ~300 CHF | 20 CHF | Equivalent |', E'| 65,000 CHF | ~300 CHF | ~300 CHF | 0 CHF | Equivalent |'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'| 80 000 CHF | ~350 CHF | ~400 CHF | -50 CHF | LAMal |', E'| 80 000 CHF | ~300 CHF | ~400 CHF | -100 CHF | LAMal |'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'| 80,000 CHF | ~350 CHF | ~400 CHF | -50 CHF | LAMal |', E'| 80,000 CHF | ~300 CHF | ~400 CHF | -100 CHF | LAMal |'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'| 100 000 CHF | ~380 CHF | ~530 CHF | -150 CHF | LAMal |', E'| 100 000 CHF | ~300 CHF | ~530 CHF | -230 CHF | LAMal |'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'| 100,000 CHF | ~380 CHF | ~530 CHF | -150 CHF | LAMal |', E'| 100,000 CHF | ~300 CHF | ~530 CHF | -230 CHF | LAMal |'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'| 120 000 CHF | ~400 CHF | ~650 CHF | -250 CHF | LAMal |', E'| 120 000 CHF | ~300 CHF | ~650 CHF | -350 CHF | LAMal |\n\n*Prime forfaitaire : ind\u00e9pendante du salaire, elle varie selon la caisse et l''\u00e2ge (ici un adulte de 25-35 ans). Franchise fixe de 300 CHF/an pour les frontaliers.*'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'| 120,000 CHF | ~400 CHF | ~650 CHF | -250 CHF | LAMal |', E'| 120,000 CHF | ~300 CHF | ~650 CHF | -350 CHF | LAMal |\n\n*Flat premium: independent of salary, it varies by insurer and age (here a 25-35-year-old adult). Fixed 300 CHF/year deductible for cross-border workers.*'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- budget-colocation-geneve-guide-complet (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'- **Transport** : abonnement L\u00e9man Express ~80 CHF/mois, ou voiture (assurance, essence, parking)', E'- **Transport** : abonnement L\u00e9man Express ~115 CHF/mois (L\u00e9man Pass zones 10+210), ou voiture (assurance, essence, parking)'), updated_at = NOW() WHERE slug = 'budget-colocation-geneve-guide-complet';

-- budget-colocation-geneve-guide-complet (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'transport (L\u00e9man Express ~80 CHF/month or car costs)', E'transport (L\u00e9man Express ~115 CHF/month or car costs)'), updated_at = NOW() WHERE slug = 'budget-colocation-geneve-guide-complet';

-- transport-annemasse-geneve-leman-express (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'**Fr\u00e9quence** : [Toutes les 15 min en heures de pointe](https://www.lemanexpress.com/fr/) (7h-9h, 17h-19h). Aux heures creuses : 30 min.', E'**Fr\u00e9quence** : [Toutes les 10 min en heures de pointe](https://www.lemanexpress.com/fr/) (7h-9h, 17h-19h). Le reste de la journ\u00e9e : toutes les 15 min.'), updated_at = NOW() WHERE slug = 'transport-annemasse-geneve-leman-express';

-- transport-annemasse-geneve-leman-express (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'**Frequency**: [Every 15 min peak hours](https://www.lemanexpress.com/en/) (7-9am, 5-7pm). Off-peak: 30 min.', E'**Frequency**: [Every 10 min at peak](https://www.lemanexpress.com/en/) (7-9am, 5-7pm). Rest of the day: every 15 min.'), updated_at = NOW() WHERE slug = 'transport-annemasse-geneve-leman-express';

-- transport-annemasse-geneve-leman-express (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'**Fr\u00e9quence** : D\u00e9pend la ligne. Certaines toutes les 15 min, certaines toutes les 30 min.', E'**Fr\u00e9quence** : D\u00e9pend de la ligne. Toutes les 10-15 min sur Gen\u00e8ve\u2013Annemasse, toutes les 30 min ou plus sur les branches.'), updated_at = NOW() WHERE slug = 'transport-annemasse-geneve-leman-express';

-- transport-annemasse-geneve-leman-express (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'**Frequency**: Depends line. Some every 15 min, some every 30 min.', E'**Frequency**: Depends on the line. Every 10-15 min on Geneva\u2013Annemasse, every 30 min or more on the branches.'), updated_at = NOW() WHERE slug = 'transport-annemasse-geneve-leman-express';

