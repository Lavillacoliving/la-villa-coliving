-- ============================================================================
-- B4 assurance santé : titres, guide ressources réduit à une synthèse, article enrichi
-- Généré le 2026-11-02T14:08:32.344Z par scripts/build-slots-sql.mjs depuis scripts/lotb-b4.edits.mjs
--   · chaînes relevées sur la base vivante le 02/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-02T14:08:32.341Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Après validation du diff par Jérôme (D-B0), dans la séance du lot B.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 — ne pas normaliser les espaces.
-- 11 modifications · 2 articles · état en base à la génération (updated_at · longueur fr / en) :
--   assurance-sante-frontalier-lamal-cmu-budget · 2026-10-13T15:30:10.955122+00:00 · 9126 / 8596
--   guide-ressources-frontalier-geneve · 2026-11-02T12:54:15.442979+00:00 · 45053 / 41246
-- ============================================================================

BEGIN;

-- [1/11] assurance-sante-frontalier-lamal-cmu-budget (fr, title_fr) · B4 · titre FR (version courte validée le 30/10)
UPDATE blog_posts
SET title_fr = replace(title_fr, $f$Assurance santé frontalier : LAMal ou CMU ? (budget)$f$, $r$Assurance santé frontalier : LAMal ou CMU-PUMa ? Coût 2026$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Assurance santé frontalier : LAMal ou CMU ? (budget)$f$ IN title_fr) > 0
  AND position($r$Assurance santé frontalier : LAMal ou CMU-PUMa ? Coût 2026$r$ IN title_fr) = 0;

-- [2/11] assurance-sante-frontalier-lamal-cmu-budget (en, title_en) · B4 · EN title (short version approved on 30/10)
UPDATE blog_posts
SET title_en = replace(title_en, $f$Cross-Border Health Insurance: LAMal or CMU? (Budget)$f$, $r$Cross-border health insurance: LAMal or CMU-PUMa? 2026 costs$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Cross-Border Health Insurance: LAMal or CMU? (Budget)$f$ IN title_en) > 0
  AND position($r$Cross-border health insurance: LAMal or CMU-PUMa? 2026 costs$r$ IN title_en) = 0;

-- [3/11] assurance-sante-frontalier-lamal-cmu-budget (fr) · B4 · l'article devient la seule page détaillée : il reprend du guide le comparateur officiel priminfo
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La franchise, elle, est la même pour tous : 300 CHF/an.$f$, $r$La franchise, elle, est la même pour tous : 300 CHF/an. Pour comparer les caisses, utilise le comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch).$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$La franchise, elle, est la même pour tous : 300 CHF/an.$f$ IN content_fr) > 0
  AND position($r$La franchise, elle, est la même pour tous : 300 CHF/an. Pour comparer les caisses, utilise le comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch).$r$ IN content_fr) = 0;

-- [4/11] assurance-sante-frontalier-lamal-cmu-budget (fr) · B4 · … et l'affiliation par l'URSSAF (CMU-PUMa)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Tu es affilié à la CPAM française et tu cotises en proportion de ton revenu fiscal de référence.$f$, $r$L'affiliation passe par le Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr) ; tes soins relèvent ensuite de la CPAM de ton département, et tu cotises en proportion de ton revenu fiscal de référence.$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Tu es affilié à la CPAM française et tu cotises en proportion de ton revenu fiscal de référence.$f$ IN content_fr) > 0
  AND position($r$L'affiliation passe par le Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr) ; tes soins relèvent ensuite de la CPAM de ton département, et tu cotises en proportion de ton revenu fiscal de référence.$r$ IN content_fr) = 0;

-- [5/11] assurance-sante-frontalier-lamal-cmu-budget (fr) · B4 · … et le calcul à l'échelle du foyer
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dépassements d'honoraires, le dentaire et l'optique.$f$, $r$Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dépassements d'honoraires, le dentaire et l'optique.

En couple ou en famille, le calcul change : revenus cumulés pour la CMU-PUMa, primes par personne pour la LAMal. Fais la simulation à l'échelle du foyer, pas seulement pour toi.$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dépassements d'honoraires, le dentaire et l'optique.$f$ IN content_fr) > 0
  AND position($r$Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dépassements d'honoraires, le dentaire et l'optique.

En couple ou en famille, le calcul change : revenus cumulés pour la CMU-PUMa, primes par personne pour la LAMal. Fais la simulation à l'échelle du foyer, pas seulement pour toi.$r$ IN content_fr) = 0;

-- [6/11] assurance-sante-frontalier-lamal-cmu-budget (fr) · CORRECTIF · vouvoiement → tutoiement
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Faites ce calcul AVANT d'arriver.$f$, $r$Fais ce calcul AVANT d'arriver.$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Faites ce calcul AVANT d'arriver.$f$ IN content_fr) > 0
  AND position($r$Fais ce calcul AVANT d'arriver.$r$ IN content_fr) = 0;

-- [7/11] assurance-sante-frontalier-lamal-cmu-budget (en) · B4 · the article takes over the official priminfo comparator from the guide
UPDATE blog_posts
SET content_en = replace(content_en, $f$The deductible is the same for everyone: 300 CHF/year.$f$, $r$The deductible is the same for everyone: 300 CHF/year. To compare insurers, use the Swiss government's official comparison tool, [priminfo.admin.ch](https://www.priminfo.admin.ch).$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$The deductible is the same for everyone: 300 CHF/year.$f$ IN content_en) > 0
  AND position($r$The deductible is the same for everyone: 300 CHF/year. To compare insurers, use the Swiss government's official comparison tool, [priminfo.admin.ch](https://www.priminfo.admin.ch).$r$ IN content_en) = 0;

-- [8/11] assurance-sante-frontalier-lamal-cmu-budget (en) · B4 · … and affiliation through URSSAF (CMU-PUMa)
UPDATE blog_posts
SET content_en = replace(content_en, $f$You're affiliated with the French CPAM and contribute proportionally to your reference tax income.$f$, $r$You join through the national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr); your care then comes under the CPAM of your French département, and you contribute in proportion to your reference tax income.$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$You're affiliated with the French CPAM and contribute proportionally to your reference tax income.$f$ IN content_en) > 0
  AND position($r$You join through the national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr); your care then comes under the CPAM of your French département, and you contribute in proportion to your reference tax income.$r$ IN content_en) = 0;

-- [9/11] assurance-sante-frontalier-lamal-cmu-budget (en) · B4 · … and the household calculation
UPDATE blog_posts
SET content_en = replace(content_en, $f$Count 30-80 €/month extra for coverage of specialist surcharges, dental, and optical care.$f$, $r$Count 30-80 €/month extra for coverage of specialist surcharges, dental, and optical care.

As a couple or a family, the maths changes: pooled income for CMU-PUMa, one premium per person for LAMal. Run the numbers for the whole household, not just for yourself.$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Count 30-80 €/month extra for coverage of specialist surcharges, dental, and optical care.$f$ IN content_en) > 0
  AND position($r$Count 30-80 €/month extra for coverage of specialist surcharges, dental, and optical care.

As a couple or a family, the maths changes: pooled income for CMU-PUMa, one premium per person for LAMal. Run the numbers for the whole household, not just for yourself.$r$ IN content_en) = 0;

-- [10/11] guide-ressources-frontalier-geneve (fr) · B4 · guide ressources, chapitre 2 : LAMal, CMU, comparatif et règle simple remplacés par une synthèse et le lien vers l'article (le droit d'option reste)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## Comment marche la LAMal (assurance suisse)

C'est l'option par défaut. Tu choisis un **assureur suisse** (Helsana, CSS, Swica, Groupe Mutuel…) et tu paies une **prime mensuelle** ; la **franchise est fixe pour les frontaliers : 300 CHF/an**, sans franchise à option contrairement aux résidents suisses. Trois caractéristiques à comprendre :

- La prime varie selon **l'âge, le canton et la franchise choisie**, mais **pas selon ton salaire** : que tu gagnes 4 000 ou 12 000 CHF, c'est le même montant. C'est ce qui la rend imbattable sur les hauts revenus.
- Après la franchise, une **[quote-part de 10 %](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** s'applique sur les frais, plafonnée à **700 CHF/an** : ton reste à charge annuel est donc borné.
- La LAMal couvre les soins **en Suisse et en France** (avec la carte européenne d'assurance maladie) et te donne accès aux médecins suisses **sans médecin traitant** — un confort réel si tu te soignes côté suisse.

Côté évolution des prix : les primes LAMal ont **historiquement augmenté de 5 à 10 % par an** (avec un pic à +16,6 % en 2024). Bonne nouvelle, **2026 est une année quasi blanche pour les frontaliers**, la hausse restant très contenue. Mais garde un œil sur l'horizon : une **réforme du mécanisme de compensation des risques, qui pourrait renchérir les primes des assurés frontaliers, est attendue pour 2028** — un point à anticiper dans un choix qui t'engage sur la durée. Pour comparer les caisses, utilise le **comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch)** — il évite de te fier aux arguments commerciaux d'un seul assureur.

## Comment marche la CMU-PUMa (couverture française)

Si tu exerces ton droit d'option dans les 3 mois, tu rejoins le régime français. L'affiliation passe par le **Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr)** ; tes soins relèvent ensuite de la **CPAM** de ton département. Ici, pas de prime mais une **cotisation d'environ 8 % de ton revenu fiscal de référence** (après abattement). Concrètement, pour un salaire brut de l'ordre de 70 000 CHF/an, la cotisation se situe autour de **330 €/mois** ; elle grimpe pour les hauts salaires et descend pour les revenus modestes.

Deux contreparties : la couverture est surtout **côté France**, et tu dois respecter un **parcours de soins coordonné** (déclarer un médecin traitant). L'avantage décisif : **pas de franchise à avancer**, et une cotisation qui **n'augmente que si ton salaire augmente** — pas de hausse annuelle subie comme en LAMal.

## LAMal ou CMU : le comparatif

| Critère | LAMal (suisse) | CMU-PUMa (française) |
|---|---|---|
| Base du coût | Âge, canton, franchise — **indépendant du salaire** | **~8 % du revenu fiscal de référence** |
| Franchise | 300 CHF/an (fixe) + quote-part 10 % (max 700 CHF/an) | Pas de franchise à avancer |
| Évolution | Historiquement +5 à 10 %/an ; **quasi stable en 2026**, réforme attendue en 2028 | Augmente seulement si le salaire augmente |
| Accès aux soins | Médecins suisses en direct, couvre Suisse + France | Parcours coordonné, médecin traitant en France |
| Le mieux pour… | Hauts salaires (prime fixe) | Salaires modestes (< ~65 000 CHF brut/an) |

À titre indicatif, selon les ordres de grandeur relevés début 2026 pour un frontalier de 25-35 ans, voici comment les deux options se croisent selon le salaire. **Note bien la logique du tableau : la prime LAMal ne bouge pas avec ton salaire** (elle dépend de ton âge, de ton canton et de ta franchise) — c'est la cotisation CMU, elle, qui grimpe avec le revenu. C'est tout le cœur de l'arbitrage.

| Salaire brut annuel | Prime LAMal (jeune adulte)* | Cotisation CMU-PUMa | Option qui ressort |
|---|---|---|---|
| 50 000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65 000 CHF | ~280 CHF | ~300 CHF | Équivalent |
| 80 000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100 000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120 000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\*Prime forfaitaire, **indépendante du salaire** : elle varie selon l'âge et la caisse. La valeur de ~280 CHF correspond à un adulte de 25-35 ans chez une caisse compétitive ; les offres les moins chères démarrent autour de 200 CHF. La franchise, elle, est fixe pour les frontaliers (300 CHF/an), avec une quote-part de 10 % plafonnée à 700 CHF/an. Ordres de grandeur indicatifs, hors situation individuelle.*

## La règle simple, et le réflexe à prendre

**En dessous d'environ 65 000 CHF brut/an, la CMU est souvent plus avantageuse** (cotisation proportionnelle, pas de franchise) ; au-dessus, la prime fixe de la LAMal prend l'avantage et l'écart se creuse avec le salaire. Mais le prix n'est pas tout : si tu te soignes surtout côté suisse, la liberté d'accès de la LAMal peut justifier quelques francs de plus.

Dans les deux cas, prévois une **mutuelle complémentaire (30 à 80 €/mois)** pour le dentaire, l'optique et les dépassements d'honoraires. Et pense à un point souvent oublié : en **couple ou en famille**, le calcul change (revenus cumulés pour la CMU, primes par personne pour la LAMal) — fais la simulation à l'échelle du foyer, pas seulement individuelle. Avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le **GTE** (voir le chapitre Ressources) et les **courtiers frontaliers** d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.

> **Pour aller plus loin :** [LAMal ou CMU : le comparatif budget du frontalier](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec des profils chiffrés.$f$, $r$## LAMal ou CMU-PUMa : la règle simple

**En dessous d'environ 65 000 CHF brut par an, la CMU-PUMa est souvent plus avantageuse** : sa cotisation, environ 8 % de ton revenu fiscal de référence, suit ton salaire. Au-dessus, la prime de la LAMal, fixe quel que soit ton salaire, prend l'avantage, et l'écart se creuse avec le revenu. Le prix n'est pas tout : la LAMal donne accès aux médecins suisses sans médecin traitant, la CMU-PUMa passe par un parcours de soins coordonné côté France. Dans les deux cas, prévois une mutuelle complémentaire (30 à 80 € par mois). En couple ou en famille, fais la simulation à l'échelle du foyer ; avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le GTE (voir le chapitre Ressources) et les courtiers frontaliers d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.

> **Pour aller plus loin :** [le comparatif complet LAMal ou CMU-PUMa](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec les coûts 2026 selon ton salaire et des profils chiffrés.$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$## Comment marche la LAMal (assurance suisse)

C'est l'option par défaut. Tu choisis un **assureur suisse** (Helsana, CSS, Swica, Groupe Mutuel…) et tu paies une **prime mensuelle** ; la **franchise est fixe pour les frontaliers : 300 CHF/an**, sans franchise à option contrairement aux résidents suisses. Trois caractéristiques à comprendre :

- La prime varie selon **l'âge, le canton et la franchise choisie**, mais **pas selon ton salaire** : que tu gagnes 4 000 ou 12 000 CHF, c'est le même montant. C'est ce qui la rend imbattable sur les hauts revenus.
- Après la franchise, une **[quote-part de 10 %](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** s'applique sur les frais, plafonnée à **700 CHF/an** : ton reste à charge annuel est donc borné.
- La LAMal couvre les soins **en Suisse et en France** (avec la carte européenne d'assurance maladie) et te donne accès aux médecins suisses **sans médecin traitant** — un confort réel si tu te soignes côté suisse.

Côté évolution des prix : les primes LAMal ont **historiquement augmenté de 5 à 10 % par an** (avec un pic à +16,6 % en 2024). Bonne nouvelle, **2026 est une année quasi blanche pour les frontaliers**, la hausse restant très contenue. Mais garde un œil sur l'horizon : une **réforme du mécanisme de compensation des risques, qui pourrait renchérir les primes des assurés frontaliers, est attendue pour 2028** — un point à anticiper dans un choix qui t'engage sur la durée. Pour comparer les caisses, utilise le **comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch)** — il évite de te fier aux arguments commerciaux d'un seul assureur.

## Comment marche la CMU-PUMa (couverture française)

Si tu exerces ton droit d'option dans les 3 mois, tu rejoins le régime français. L'affiliation passe par le **Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr)** ; tes soins relèvent ensuite de la **CPAM** de ton département. Ici, pas de prime mais une **cotisation d'environ 8 % de ton revenu fiscal de référence** (après abattement). Concrètement, pour un salaire brut de l'ordre de 70 000 CHF/an, la cotisation se situe autour de **330 €/mois** ; elle grimpe pour les hauts salaires et descend pour les revenus modestes.

Deux contreparties : la couverture est surtout **côté France**, et tu dois respecter un **parcours de soins coordonné** (déclarer un médecin traitant). L'avantage décisif : **pas de franchise à avancer**, et une cotisation qui **n'augmente que si ton salaire augmente** — pas de hausse annuelle subie comme en LAMal.

## LAMal ou CMU : le comparatif

| Critère | LAMal (suisse) | CMU-PUMa (française) |
|---|---|---|
| Base du coût | Âge, canton, franchise — **indépendant du salaire** | **~8 % du revenu fiscal de référence** |
| Franchise | 300 CHF/an (fixe) + quote-part 10 % (max 700 CHF/an) | Pas de franchise à avancer |
| Évolution | Historiquement +5 à 10 %/an ; **quasi stable en 2026**, réforme attendue en 2028 | Augmente seulement si le salaire augmente |
| Accès aux soins | Médecins suisses en direct, couvre Suisse + France | Parcours coordonné, médecin traitant en France |
| Le mieux pour… | Hauts salaires (prime fixe) | Salaires modestes (< ~65 000 CHF brut/an) |

À titre indicatif, selon les ordres de grandeur relevés début 2026 pour un frontalier de 25-35 ans, voici comment les deux options se croisent selon le salaire. **Note bien la logique du tableau : la prime LAMal ne bouge pas avec ton salaire** (elle dépend de ton âge, de ton canton et de ta franchise) — c'est la cotisation CMU, elle, qui grimpe avec le revenu. C'est tout le cœur de l'arbitrage.

| Salaire brut annuel | Prime LAMal (jeune adulte)* | Cotisation CMU-PUMa | Option qui ressort |
|---|---|---|---|
| 50 000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65 000 CHF | ~280 CHF | ~300 CHF | Équivalent |
| 80 000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100 000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120 000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\*Prime forfaitaire, **indépendante du salaire** : elle varie selon l'âge et la caisse. La valeur de ~280 CHF correspond à un adulte de 25-35 ans chez une caisse compétitive ; les offres les moins chères démarrent autour de 200 CHF. La franchise, elle, est fixe pour les frontaliers (300 CHF/an), avec une quote-part de 10 % plafonnée à 700 CHF/an. Ordres de grandeur indicatifs, hors situation individuelle.*

## La règle simple, et le réflexe à prendre

**En dessous d'environ 65 000 CHF brut/an, la CMU est souvent plus avantageuse** (cotisation proportionnelle, pas de franchise) ; au-dessus, la prime fixe de la LAMal prend l'avantage et l'écart se creuse avec le salaire. Mais le prix n'est pas tout : si tu te soignes surtout côté suisse, la liberté d'accès de la LAMal peut justifier quelques francs de plus.

Dans les deux cas, prévois une **mutuelle complémentaire (30 à 80 €/mois)** pour le dentaire, l'optique et les dépassements d'honoraires. Et pense à un point souvent oublié : en **couple ou en famille**, le calcul change (revenus cumulés pour la CMU, primes par personne pour la LAMal) — fais la simulation à l'échelle du foyer, pas seulement individuelle. Avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le **GTE** (voir le chapitre Ressources) et les **courtiers frontaliers** d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.

> **Pour aller plus loin :** [LAMal ou CMU : le comparatif budget du frontalier](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec des profils chiffrés.$f$ IN content_fr) > 0
  AND position($r$## LAMal ou CMU-PUMa : la règle simple

**En dessous d'environ 65 000 CHF brut par an, la CMU-PUMa est souvent plus avantageuse** : sa cotisation, environ 8 % de ton revenu fiscal de référence, suit ton salaire. Au-dessus, la prime de la LAMal, fixe quel que soit ton salaire, prend l'avantage, et l'écart se creuse avec le revenu. Le prix n'est pas tout : la LAMal donne accès aux médecins suisses sans médecin traitant, la CMU-PUMa passe par un parcours de soins coordonné côté France. Dans les deux cas, prévois une mutuelle complémentaire (30 à 80 € par mois). En couple ou en famille, fais la simulation à l'échelle du foyer ; avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le GTE (voir le chapitre Ressources) et les courtiers frontaliers d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.

> **Pour aller plus loin :** [le comparatif complet LAMal ou CMU-PUMa](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec les coûts 2026 selon ton salaire et des profils chiffrés.$r$ IN content_fr) = 0;

-- [11/11] guide-ressources-frontalier-geneve (en) · B4 · resources guide, chapter 2: LAMal, CMU, comparison and simple rule replaced by a summary and the link to the article (right of option stays)
UPDATE blog_posts
SET content_en = replace(content_en, $f$## How LAMal works (Swiss insurance)

It is the default option. You pick a **Swiss insurer** (Helsana, CSS, Swica, Groupe Mutuel…) and pay a **monthly premium**; the **deductible is fixed for cross-border workers: 300 CHF/year**, with no optional higher deductibles, unlike Swiss residents. Three things to understand:

- The premium varies with **age, canton and chosen deductible**, but **not with your salary**: whether you earn 4,000 or 12,000 CHF, it is the same amount. That is what makes it unbeatable on high incomes.
- After the deductible, a **[10% co-payment](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** applies, capped at **700 CHF/year**: your annual out-of-pocket is bounded.
- LAMal covers care **in Switzerland and in France** (with the European health insurance card) and gives direct access to Swiss doctors **without a referring GP**.

On price evolution: LAMal premiums have **historically risen 5 to 10% per year** (with a peak of +16.6% in 2024). The good news: **2026 is a near-flat year for cross-border workers**, with a very contained increase. But keep an eye on the horizon: a **reform of the risk-compensation mechanism, which could raise premiums for cross-border policyholders, is expected for 2028** — worth anticipating in a choice that commits you for the long run. To compare insurers, use the **official federal comparator, [priminfo.admin.ch](https://www.priminfo.admin.ch)**.

## How CMU-PUMa works (French cover)

If you exercise your option within 3 months, you join the French system. Affiliation goes through the **national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr)**; your care then falls under your local **CPAM**. Here, no premium but a **contribution of about 8% of your reference tax income** (after an allowance). For a gross salary around 70,000 CHF/year, that is roughly **€330/month**; it rises for high salaries and falls for modest incomes.

Two trade-offs: cover is mainly **on the French side**, and you must follow a **coordinated care pathway** (declare a referring GP). The decisive upside: **no deductible to advance**, and a contribution that **rises only if your salary rises** — no annual increase imposed as with LAMal.

## LAMal vs CMU: the comparison

| Criterion | LAMal (Swiss) | CMU-PUMa (French) |
|---|---|---|
| Cost basis | Age, canton, deductible — **independent of salary** | **~8% of reference tax income** |
| Deductible | Fixed 300 CHF/year + 10% co-pay (max 700 CHF/year) | No deductible to advance |
| Evolution | Historically +5 to 10%/year; **nearly stable in 2026**, reform expected in 2028 | Rises only if salary rises |
| Care access | Swiss doctors directly, covers CH + FR | Coordinated pathway, GP in France |
| Best for… | High salaries (fixed premium) | Modest salaries (< ~65,000 CHF gross/year) |

By orders of magnitude observed in early 2026 for a 25-35-year-old, here is how the two cross over depending on salary. **Note the table's logic: the LAMal premium does not move with your salary** (it depends on your age, canton and deductible) — it is the CMU contribution that climbs with income. That is the very heart of the trade-off.

| Gross annual salary | LAMal premium (young adult)* | CMU-PUMa contribution | Option that stands out |
|---|---|---|---|
| 50,000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65,000 CHF | ~280 CHF | ~300 CHF | Tie |
| 80,000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100,000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120,000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\*Flat premium, **independent of salary**: it varies with age and insurer. The ~280 CHF figure corresponds to a 25-35-year-old at a competitive insurer; the cheapest offers start around 200 CHF. The deductible is fixed for cross-border workers (300 CHF/year), with a 10% co-pay capped at 700 CHF/year. Indicative orders of magnitude, individual situations vary.*

## The simple rule, and the reflex to build

**Below about 65,000 CHF gross/year, CMU is often more favourable** (proportional contribution, no deductible); above, LAMal's fixed premium wins and the gap widens with salary. But price is not everything: if you mostly see Swiss doctors, LAMal's freedom of access can justify a few francs more.

In both cases, plan for a **top-up (€30 to €80/month)** for dental, optical and fee overruns. And mind an often-forgotten point: as a **couple or family**, the calculation changes (pooled income for CMU, per-person premiums for LAMal) — simulate at household level, not just individually. With children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The **GTE** (see the Resources chapter) and the **cross-border brokers** in Annemasse or Saint-Julien offer personalised, often free, simulations.

> **Go further:** [LAMal or CMU: the cross-border budget comparison](/blog/assurance-sante-frontalier-lamal-cmu-budget), with worked profiles.$f$, $r$## LAMal or CMU-PUMa: the simple rule

**Below about CHF 65,000 gross a year, CMU-PUMa is often the better deal**: its contribution, about 8% of your reference taxable income, follows your salary. Above that, the LAMal premium, the same whatever you earn, takes the lead, and the gap widens as your income grows. Price isn't everything: LAMal gives you direct access to Swiss doctors without a GP referral, while CMU-PUMa goes through a coordinated care pathway on the French side. Either way, plan for a top-up policy ("mutuelle", €30 to €80 a month). As a couple or a family, run the numbers for the whole household; with children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The GTE (see the Resources chapter) and the cross-border brokers in Annemasse or Saint-Julien offer personalised simulations, often free.

> **Go further:** [the full LAMal or CMU-PUMa comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget), with 2026 costs by salary and worked profiles.$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$## How LAMal works (Swiss insurance)

It is the default option. You pick a **Swiss insurer** (Helsana, CSS, Swica, Groupe Mutuel…) and pay a **monthly premium**; the **deductible is fixed for cross-border workers: 300 CHF/year**, with no optional higher deductibles, unlike Swiss residents. Three things to understand:

- The premium varies with **age, canton and chosen deductible**, but **not with your salary**: whether you earn 4,000 or 12,000 CHF, it is the same amount. That is what makes it unbeatable on high incomes.
- After the deductible, a **[10% co-payment](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** applies, capped at **700 CHF/year**: your annual out-of-pocket is bounded.
- LAMal covers care **in Switzerland and in France** (with the European health insurance card) and gives direct access to Swiss doctors **without a referring GP**.

On price evolution: LAMal premiums have **historically risen 5 to 10% per year** (with a peak of +16.6% in 2024). The good news: **2026 is a near-flat year for cross-border workers**, with a very contained increase. But keep an eye on the horizon: a **reform of the risk-compensation mechanism, which could raise premiums for cross-border policyholders, is expected for 2028** — worth anticipating in a choice that commits you for the long run. To compare insurers, use the **official federal comparator, [priminfo.admin.ch](https://www.priminfo.admin.ch)**.

## How CMU-PUMa works (French cover)

If you exercise your option within 3 months, you join the French system. Affiliation goes through the **national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr)**; your care then falls under your local **CPAM**. Here, no premium but a **contribution of about 8% of your reference tax income** (after an allowance). For a gross salary around 70,000 CHF/year, that is roughly **€330/month**; it rises for high salaries and falls for modest incomes.

Two trade-offs: cover is mainly **on the French side**, and you must follow a **coordinated care pathway** (declare a referring GP). The decisive upside: **no deductible to advance**, and a contribution that **rises only if your salary rises** — no annual increase imposed as with LAMal.

## LAMal vs CMU: the comparison

| Criterion | LAMal (Swiss) | CMU-PUMa (French) |
|---|---|---|
| Cost basis | Age, canton, deductible — **independent of salary** | **~8% of reference tax income** |
| Deductible | Fixed 300 CHF/year + 10% co-pay (max 700 CHF/year) | No deductible to advance |
| Evolution | Historically +5 to 10%/year; **nearly stable in 2026**, reform expected in 2028 | Rises only if salary rises |
| Care access | Swiss doctors directly, covers CH + FR | Coordinated pathway, GP in France |
| Best for… | High salaries (fixed premium) | Modest salaries (< ~65,000 CHF gross/year) |

By orders of magnitude observed in early 2026 for a 25-35-year-old, here is how the two cross over depending on salary. **Note the table's logic: the LAMal premium does not move with your salary** (it depends on your age, canton and deductible) — it is the CMU contribution that climbs with income. That is the very heart of the trade-off.

| Gross annual salary | LAMal premium (young adult)* | CMU-PUMa contribution | Option that stands out |
|---|---|---|---|
| 50,000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65,000 CHF | ~280 CHF | ~300 CHF | Tie |
| 80,000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100,000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120,000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\*Flat premium, **independent of salary**: it varies with age and insurer. The ~280 CHF figure corresponds to a 25-35-year-old at a competitive insurer; the cheapest offers start around 200 CHF. The deductible is fixed for cross-border workers (300 CHF/year), with a 10% co-pay capped at 700 CHF/year. Indicative orders of magnitude, individual situations vary.*

## The simple rule, and the reflex to build

**Below about 65,000 CHF gross/year, CMU is often more favourable** (proportional contribution, no deductible); above, LAMal's fixed premium wins and the gap widens with salary. But price is not everything: if you mostly see Swiss doctors, LAMal's freedom of access can justify a few francs more.

In both cases, plan for a **top-up (€30 to €80/month)** for dental, optical and fee overruns. And mind an often-forgotten point: as a **couple or family**, the calculation changes (pooled income for CMU, per-person premiums for LAMal) — simulate at household level, not just individually. With children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The **GTE** (see the Resources chapter) and the **cross-border brokers** in Annemasse or Saint-Julien offer personalised, often free, simulations.

> **Go further:** [LAMal or CMU: the cross-border budget comparison](/blog/assurance-sante-frontalier-lamal-cmu-budget), with worked profiles.$f$ IN content_en) > 0
  AND position($r$## LAMal or CMU-PUMa: the simple rule

**Below about CHF 65,000 gross a year, CMU-PUMa is often the better deal**: its contribution, about 8% of your reference taxable income, follows your salary. Above that, the LAMal premium, the same whatever you earn, takes the lead, and the gap widens as your income grows. Price isn't everything: LAMal gives you direct access to Swiss doctors without a GP referral, while CMU-PUMa goes through a coordinated care pathway on the French side. Either way, plan for a top-up policy ("mutuelle", €30 to €80 a month). As a couple or a family, run the numbers for the whole household; with children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The GTE (see the Resources chapter) and the cross-border brokers in Annemasse or Saint-Julien offer personalised simulations, often free.

> **Go further:** [the full LAMal or CMU-PUMa comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget), with 2026 costs by salary and worked profiles.$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] assurance-sante-frontalier-lamal-cmu-budget/fr, title_fr · B4 : « Assurance santé frontalier : LAMal ou CMU ? (budget) » → « Assurance santé frontalier : LAMal ou CMU-PUMa ? Coût 2026 »
-- [2] assurance-sante-frontalier-lamal-cmu-budget/en, title_en · B4 : « Cross-Border Health Insurance: LAMal or CMU? (Budget) » → « Cross-border health insurance: LAMal or CMU-PUMa? 2026 costs »
-- [3] assurance-sante-frontalier-lamal-cmu-budget/fr · B4 : « La franchise, elle, est la même pour tous : 300 CHF/an. » → « La franchise, elle, est la même pour tous : 300 CHF/an. Pour comparer l… »
-- [4] assurance-sante-frontalier-lamal-cmu-budget/fr · B4 : « Tu es affilié à la CPAM française et tu cotises en proportion de ton re… » → « L'affiliation passe par le Centre national des travailleurs frontaliers… »
-- [5] assurance-sante-frontalier-lamal-cmu-budget/fr · B4 : « Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dé… » → « Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dé… »
-- [6] assurance-sante-frontalier-lamal-cmu-budget/fr · CORRECTIF : « Faites ce calcul AVANT d'arriver. » → « Fais ce calcul AVANT d'arriver. »
-- [7] assurance-sante-frontalier-lamal-cmu-budget/en · B4 : « The deductible is the same for everyone: 300 CHF/year. » → « The deductible is the same for everyone: 300 CHF/year. To compare insur… »
-- [8] assurance-sante-frontalier-lamal-cmu-budget/en · B4 : « You're affiliated with the French CPAM and contribute proportionally to… » → « You join through the national centre for cross-border workers in Switze… »
-- [9] assurance-sante-frontalier-lamal-cmu-budget/en · B4 : « Count 30-80 €/month extra for coverage of specialist surcharges, dental… » → « Count 30-80 €/month extra for coverage of specialist surcharges, dental… »
-- [10] guide-ressources-frontalier-geneve/fr · B4 : « ## Comment marche la LAMal (assurance suisse)⏎⏎C'est l'option par défau… » → « ## LAMal ou CMU-PUMa : la règle simple⏎⏎**En dessous d'environ 65 000 C… »
-- [11] guide-ressources-frontalier-geneve/en · B4 : « ## How LAMal works (Swiss insurance)⏎⏎It is the default option. You pic… » → « ## LAMal or CMU-PUMa: the simple rule⏎⏎**Below about CHF 65,000 gross a… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$Assurance santé frontalier : LAMal ou CMU ? (budget)$f$ IN title_fr) = 0
      AND position($r$La franchise, elle, est la même pour tous : 300 CHF/an. Pour comparer les caisses, utilise le comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch).$r$ IN content_fr) > 0
      AND position($f$Tu es affilié à la CPAM française et tu cotises en proportion de ton revenu fiscal de référence.$f$ IN content_fr) = 0
      AND position($r$Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dépassements d'honoraires, le dentaire et l'optique.

En couple ou en famille, le calcul change : revenus cumulés pour la CMU-PUMa, primes par personne pour la LAMal. Fais la simulation à l'échelle du foyer, pas seulement pour toi.$r$ IN content_fr) > 0
      AND position($f$Faites ce calcul AVANT d'arriver.$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$## Comment marche la LAMal (assurance suisse)

C'est l'option par défaut. Tu choisis un **assureur suisse** (Helsana, CSS, Swica, Groupe Mutuel…) et tu paies une **prime mensuelle** ; la **franchise est fixe pour les frontaliers : 300 CHF/an**, sans franchise à option contrairement aux résidents suisses. Trois caractéristiques à comprendre :

- La prime varie selon **l'âge, le canton et la franchise choisie**, mais **pas selon ton salaire** : que tu gagnes 4 000 ou 12 000 CHF, c'est le même montant. C'est ce qui la rend imbattable sur les hauts revenus.
- Après la franchise, une **[quote-part de 10 %](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** s'applique sur les frais, plafonnée à **700 CHF/an** : ton reste à charge annuel est donc borné.
- La LAMal couvre les soins **en Suisse et en France** (avec la carte européenne d'assurance maladie) et te donne accès aux médecins suisses **sans médecin traitant** — un confort réel si tu te soignes côté suisse.

Côté évolution des prix : les primes LAMal ont **historiquement augmenté de 5 à 10 % par an** (avec un pic à +16,6 % en 2024). Bonne nouvelle, **2026 est une année quasi blanche pour les frontaliers**, la hausse restant très contenue. Mais garde un œil sur l'horizon : une **réforme du mécanisme de compensation des risques, qui pourrait renchérir les primes des assurés frontaliers, est attendue pour 2028** — un point à anticiper dans un choix qui t'engage sur la durée. Pour comparer les caisses, utilise le **comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch)** — il évite de te fier aux arguments commerciaux d'un seul assureur.

## Comment marche la CMU-PUMa (couverture française)

Si tu exerces ton droit d'option dans les 3 mois, tu rejoins le régime français. L'affiliation passe par le **Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr)** ; tes soins relèvent ensuite de la **CPAM** de ton département. Ici, pas de prime mais une **cotisation d'environ 8 % de ton revenu fiscal de référence** (après abattement). Concrètement, pour un salaire brut de l'ordre de 70 000 CHF/an, la cotisation se situe autour de **330 €/mois** ; elle grimpe pour les hauts salaires et descend pour les revenus modestes.

Deux contreparties : la couverture est surtout **côté France**, et tu dois respecter un **parcours de soins coordonné** (déclarer un médecin traitant). L'avantage décisif : **pas de franchise à avancer**, et une cotisation qui **n'augmente que si ton salaire augmente** — pas de hausse annuelle subie comme en LAMal.

## LAMal ou CMU : le comparatif

| Critère | LAMal (suisse) | CMU-PUMa (française) |
|---|---|---|
| Base du coût | Âge, canton, franchise — **indépendant du salaire** | **~8 % du revenu fiscal de référence** |
| Franchise | 300 CHF/an (fixe) + quote-part 10 % (max 700 CHF/an) | Pas de franchise à avancer |
| Évolution | Historiquement +5 à 10 %/an ; **quasi stable en 2026**, réforme attendue en 2028 | Augmente seulement si le salaire augmente |
| Accès aux soins | Médecins suisses en direct, couvre Suisse + France | Parcours coordonné, médecin traitant en France |
| Le mieux pour… | Hauts salaires (prime fixe) | Salaires modestes (< ~65 000 CHF brut/an) |

À titre indicatif, selon les ordres de grandeur relevés début 2026 pour un frontalier de 25-35 ans, voici comment les deux options se croisent selon le salaire. **Note bien la logique du tableau : la prime LAMal ne bouge pas avec ton salaire** (elle dépend de ton âge, de ton canton et de ta franchise) — c'est la cotisation CMU, elle, qui grimpe avec le revenu. C'est tout le cœur de l'arbitrage.

| Salaire brut annuel | Prime LAMal (jeune adulte)* | Cotisation CMU-PUMa | Option qui ressort |
|---|---|---|---|
| 50 000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65 000 CHF | ~280 CHF | ~300 CHF | Équivalent |
| 80 000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100 000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120 000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\*Prime forfaitaire, **indépendante du salaire** : elle varie selon l'âge et la caisse. La valeur de ~280 CHF correspond à un adulte de 25-35 ans chez une caisse compétitive ; les offres les moins chères démarrent autour de 200 CHF. La franchise, elle, est fixe pour les frontaliers (300 CHF/an), avec une quote-part de 10 % plafonnée à 700 CHF/an. Ordres de grandeur indicatifs, hors situation individuelle.*

## La règle simple, et le réflexe à prendre

**En dessous d'environ 65 000 CHF brut/an, la CMU est souvent plus avantageuse** (cotisation proportionnelle, pas de franchise) ; au-dessus, la prime fixe de la LAMal prend l'avantage et l'écart se creuse avec le salaire. Mais le prix n'est pas tout : si tu te soignes surtout côté suisse, la liberté d'accès de la LAMal peut justifier quelques francs de plus.

Dans les deux cas, prévois une **mutuelle complémentaire (30 à 80 €/mois)** pour le dentaire, l'optique et les dépassements d'honoraires. Et pense à un point souvent oublié : en **couple ou en famille**, le calcul change (revenus cumulés pour la CMU, primes par personne pour la LAMal) — fais la simulation à l'échelle du foyer, pas seulement individuelle. Avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le **GTE** (voir le chapitre Ressources) et les **courtiers frontaliers** d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.

> **Pour aller plus loin :** [LAMal ou CMU : le comparatif budget du frontalier](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec des profils chiffrés.$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$Cross-Border Health Insurance: LAMal or CMU? (Budget)$f$ IN title_en) = 0
      AND position($r$The deductible is the same for everyone: 300 CHF/year. To compare insurers, use the Swiss government's official comparison tool, [priminfo.admin.ch](https://www.priminfo.admin.ch).$r$ IN content_en) > 0
      AND position($f$You're affiliated with the French CPAM and contribute proportionally to your reference tax income.$f$ IN content_en) = 0
      AND position($r$Count 30-80 €/month extra for coverage of specialist surcharges, dental, and optical care.

As a couple or a family, the maths changes: pooled income for CMU-PUMa, one premium per person for LAMal. Run the numbers for the whole household, not just for yourself.$r$ IN content_en) > 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$## How LAMal works (Swiss insurance)

It is the default option. You pick a **Swiss insurer** (Helsana, CSS, Swica, Groupe Mutuel…) and pay a **monthly premium**; the **deductible is fixed for cross-border workers: 300 CHF/year**, with no optional higher deductibles, unlike Swiss residents. Three things to understand:

- The premium varies with **age, canton and chosen deductible**, but **not with your salary**: whether you earn 4,000 or 12,000 CHF, it is the same amount. That is what makes it unbeatable on high incomes.
- After the deductible, a **[10% co-payment](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** applies, capped at **700 CHF/year**: your annual out-of-pocket is bounded.
- LAMal covers care **in Switzerland and in France** (with the European health insurance card) and gives direct access to Swiss doctors **without a referring GP**.

On price evolution: LAMal premiums have **historically risen 5 to 10% per year** (with a peak of +16.6% in 2024). The good news: **2026 is a near-flat year for cross-border workers**, with a very contained increase. But keep an eye on the horizon: a **reform of the risk-compensation mechanism, which could raise premiums for cross-border policyholders, is expected for 2028** — worth anticipating in a choice that commits you for the long run. To compare insurers, use the **official federal comparator, [priminfo.admin.ch](https://www.priminfo.admin.ch)**.

## How CMU-PUMa works (French cover)

If you exercise your option within 3 months, you join the French system. Affiliation goes through the **national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr)**; your care then falls under your local **CPAM**. Here, no premium but a **contribution of about 8% of your reference tax income** (after an allowance). For a gross salary around 70,000 CHF/year, that is roughly **€330/month**; it rises for high salaries and falls for modest incomes.

Two trade-offs: cover is mainly **on the French side**, and you must follow a **coordinated care pathway** (declare a referring GP). The decisive upside: **no deductible to advance**, and a contribution that **rises only if your salary rises** — no annual increase imposed as with LAMal.

## LAMal vs CMU: the comparison

| Criterion | LAMal (Swiss) | CMU-PUMa (French) |
|---|---|---|
| Cost basis | Age, canton, deductible — **independent of salary** | **~8% of reference tax income** |
| Deductible | Fixed 300 CHF/year + 10% co-pay (max 700 CHF/year) | No deductible to advance |
| Evolution | Historically +5 to 10%/year; **nearly stable in 2026**, reform expected in 2028 | Rises only if salary rises |
| Care access | Swiss doctors directly, covers CH + FR | Coordinated pathway, GP in France |
| Best for… | High salaries (fixed premium) | Modest salaries (< ~65,000 CHF gross/year) |

By orders of magnitude observed in early 2026 for a 25-35-year-old, here is how the two cross over depending on salary. **Note the table's logic: the LAMal premium does not move with your salary** (it depends on your age, canton and deductible) — it is the CMU contribution that climbs with income. That is the very heart of the trade-off.

| Gross annual salary | LAMal premium (young adult)* | CMU-PUMa contribution | Option that stands out |
|---|---|---|---|
| 50,000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65,000 CHF | ~280 CHF | ~300 CHF | Tie |
| 80,000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100,000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120,000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\*Flat premium, **independent of salary**: it varies with age and insurer. The ~280 CHF figure corresponds to a 25-35-year-old at a competitive insurer; the cheapest offers start around 200 CHF. The deductible is fixed for cross-border workers (300 CHF/year), with a 10% co-pay capped at 700 CHF/year. Indicative orders of magnitude, individual situations vary.*

## The simple rule, and the reflex to build

**Below about 65,000 CHF gross/year, CMU is often more favourable** (proportional contribution, no deductible); above, LAMal's fixed premium wins and the gap widens with salary. But price is not everything: if you mostly see Swiss doctors, LAMal's freedom of access can justify a few francs more.

In both cases, plan for a **top-up (€30 to €80/month)** for dental, optical and fee overruns. And mind an often-forgotten point: as a **couple or family**, the calculation changes (pooled income for CMU, per-person premiums for LAMal) — simulate at household level, not just individually. With children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The **GTE** (see the Resources chapter) and the **cross-border brokers** in Annemasse or Saint-Julien offer personalised, often free, simulations.

> **Go further:** [LAMal or CMU: the cross-border budget comparison](/blog/assurance-sante-frontalier-lamal-cmu-budget), with worked profiles.$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('assurance-sante-frontalier-lamal-cmu-budget', 'guide-ressources-frontalier-geneve')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## LAMal or CMU-PUMa: the simple rule

**Below about CHF 65,000 gross a year, CMU-PUMa is often the better deal**: its contribution, about 8% of your reference taxable income, follows your salary. Above that, the LAMal premium, the same whatever you earn, takes the lead, and the gap widens as your income grows. Price isn't everything: LAMal gives you direct access to Swiss doctors without a GP referral, while CMU-PUMa goes through a coordinated care pathway on the French side. Either way, plan for a top-up policy ("mutuelle", €30 to €80 a month). As a couple or a family, run the numbers for the whole household; with children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The GTE (see the Resources chapter) and the cross-border brokers in Annemasse or Saint-Julien offer personalised simulations, often free.

> **Go further:** [the full LAMal or CMU-PUMa comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget), with 2026 costs by salary and worked profiles.$r$, $f$## How LAMal works (Swiss insurance)

It is the default option. You pick a **Swiss insurer** (Helsana, CSS, Swica, Groupe Mutuel…) and pay a **monthly premium**; the **deductible is fixed for cross-border workers: 300 CHF/year**, with no optional higher deductibles, unlike Swiss residents. Three things to understand:

- The premium varies with **age, canton and chosen deductible**, but **not with your salary**: whether you earn 4,000 or 12,000 CHF, it is the same amount. That is what makes it unbeatable on high incomes.
- After the deductible, a **[10% co-payment](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** applies, capped at **700 CHF/year**: your annual out-of-pocket is bounded.
- LAMal covers care **in Switzerland and in France** (with the European health insurance card) and gives direct access to Swiss doctors **without a referring GP**.

On price evolution: LAMal premiums have **historically risen 5 to 10% per year** (with a peak of +16.6% in 2024). The good news: **2026 is a near-flat year for cross-border workers**, with a very contained increase. But keep an eye on the horizon: a **reform of the risk-compensation mechanism, which could raise premiums for cross-border policyholders, is expected for 2028** — worth anticipating in a choice that commits you for the long run. To compare insurers, use the **official federal comparator, [priminfo.admin.ch](https://www.priminfo.admin.ch)**.

## How CMU-PUMa works (French cover)

If you exercise your option within 3 months, you join the French system. Affiliation goes through the **national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr)**; your care then falls under your local **CPAM**. Here, no premium but a **contribution of about 8% of your reference tax income** (after an allowance). For a gross salary around 70,000 CHF/year, that is roughly **€330/month**; it rises for high salaries and falls for modest incomes.

Two trade-offs: cover is mainly **on the French side**, and you must follow a **coordinated care pathway** (declare a referring GP). The decisive upside: **no deductible to advance**, and a contribution that **rises only if your salary rises** — no annual increase imposed as with LAMal.

## LAMal vs CMU: the comparison

| Criterion | LAMal (Swiss) | CMU-PUMa (French) |
|---|---|---|
| Cost basis | Age, canton, deductible — **independent of salary** | **~8% of reference tax income** |
| Deductible | Fixed 300 CHF/year + 10% co-pay (max 700 CHF/year) | No deductible to advance |
| Evolution | Historically +5 to 10%/year; **nearly stable in 2026**, reform expected in 2028 | Rises only if salary rises |
| Care access | Swiss doctors directly, covers CH + FR | Coordinated pathway, GP in France |
| Best for… | High salaries (fixed premium) | Modest salaries (< ~65,000 CHF gross/year) |

By orders of magnitude observed in early 2026 for a 25-35-year-old, here is how the two cross over depending on salary. **Note the table's logic: the LAMal premium does not move with your salary** (it depends on your age, canton and deductible) — it is the CMU contribution that climbs with income. That is the very heart of the trade-off.

| Gross annual salary | LAMal premium (young adult)* | CMU-PUMa contribution | Option that stands out |
|---|---|---|---|
| 50,000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65,000 CHF | ~280 CHF | ~300 CHF | Tie |
| 80,000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100,000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120,000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\*Flat premium, **independent of salary**: it varies with age and insurer. The ~280 CHF figure corresponds to a 25-35-year-old at a competitive insurer; the cheapest offers start around 200 CHF. The deductible is fixed for cross-border workers (300 CHF/year), with a 10% co-pay capped at 700 CHF/year. Indicative orders of magnitude, individual situations vary.*

## The simple rule, and the reflex to build

**Below about 65,000 CHF gross/year, CMU is often more favourable** (proportional contribution, no deductible); above, LAMal's fixed premium wins and the gap widens with salary. But price is not everything: if you mostly see Swiss doctors, LAMal's freedom of access can justify a few francs more.

In both cases, plan for a **top-up (€30 to €80/month)** for dental, optical and fee overruns. And mind an often-forgotten point: as a **couple or family**, the calculation changes (pooled income for CMU, per-person premiums for LAMal) — simulate at household level, not just individually. With children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The **GTE** (see the Resources chapter) and the **cross-border brokers** in Annemasse or Saint-Julien offer personalised, often free, simulations.

> **Go further:** [LAMal or CMU: the cross-border budget comparison](/blog/assurance-sante-frontalier-lamal-cmu-budget), with worked profiles.$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$## LAMal or CMU-PUMa: the simple rule

**Below about CHF 65,000 gross a year, CMU-PUMa is often the better deal**: its contribution, about 8% of your reference taxable income, follows your salary. Above that, the LAMal premium, the same whatever you earn, takes the lead, and the gap widens as your income grows. Price isn't everything: LAMal gives you direct access to Swiss doctors without a GP referral, while CMU-PUMa goes through a coordinated care pathway on the French side. Either way, plan for a top-up policy ("mutuelle", €30 to €80 a month). As a couple or a family, run the numbers for the whole household; with children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The GTE (see the Resources chapter) and the cross-border brokers in Annemasse or Saint-Julien offer personalised simulations, often free.

> **Go further:** [the full LAMal or CMU-PUMa comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget), with 2026 costs by salary and worked profiles.$r$ IN content_en) > 0
  AND position($f$## How LAMal works (Swiss insurance)

It is the default option. You pick a **Swiss insurer** (Helsana, CSS, Swica, Groupe Mutuel…) and pay a **monthly premium**; the **deductible is fixed for cross-border workers: 300 CHF/year**, with no optional higher deductibles, unlike Swiss residents. Three things to understand:

- The premium varies with **age, canton and chosen deductible**, but **not with your salary**: whether you earn 4,000 or 12,000 CHF, it is the same amount. That is what makes it unbeatable on high incomes.
- After the deductible, a **[10% co-payment](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** applies, capped at **700 CHF/year**: your annual out-of-pocket is bounded.
- LAMal covers care **in Switzerland and in France** (with the European health insurance card) and gives direct access to Swiss doctors **without a referring GP**.

On price evolution: LAMal premiums have **historically risen 5 to 10% per year** (with a peak of +16.6% in 2024). The good news: **2026 is a near-flat year for cross-border workers**, with a very contained increase. But keep an eye on the horizon: a **reform of the risk-compensation mechanism, which could raise premiums for cross-border policyholders, is expected for 2028** — worth anticipating in a choice that commits you for the long run. To compare insurers, use the **official federal comparator, [priminfo.admin.ch](https://www.priminfo.admin.ch)**.

## How CMU-PUMa works (French cover)

If you exercise your option within 3 months, you join the French system. Affiliation goes through the **national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr)**; your care then falls under your local **CPAM**. Here, no premium but a **contribution of about 8% of your reference tax income** (after an allowance). For a gross salary around 70,000 CHF/year, that is roughly **€330/month**; it rises for high salaries and falls for modest incomes.

Two trade-offs: cover is mainly **on the French side**, and you must follow a **coordinated care pathway** (declare a referring GP). The decisive upside: **no deductible to advance**, and a contribution that **rises only if your salary rises** — no annual increase imposed as with LAMal.

## LAMal vs CMU: the comparison

| Criterion | LAMal (Swiss) | CMU-PUMa (French) |
|---|---|---|
| Cost basis | Age, canton, deductible — **independent of salary** | **~8% of reference tax income** |
| Deductible | Fixed 300 CHF/year + 10% co-pay (max 700 CHF/year) | No deductible to advance |
| Evolution | Historically +5 to 10%/year; **nearly stable in 2026**, reform expected in 2028 | Rises only if salary rises |
| Care access | Swiss doctors directly, covers CH + FR | Coordinated pathway, GP in France |
| Best for… | High salaries (fixed premium) | Modest salaries (< ~65,000 CHF gross/year) |

By orders of magnitude observed in early 2026 for a 25-35-year-old, here is how the two cross over depending on salary. **Note the table's logic: the LAMal premium does not move with your salary** (it depends on your age, canton and deductible) — it is the CMU contribution that climbs with income. That is the very heart of the trade-off.

| Gross annual salary | LAMal premium (young adult)* | CMU-PUMa contribution | Option that stands out |
|---|---|---|---|
| 50,000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65,000 CHF | ~280 CHF | ~300 CHF | Tie |
| 80,000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100,000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120,000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\*Flat premium, **independent of salary**: it varies with age and insurer. The ~280 CHF figure corresponds to a 25-35-year-old at a competitive insurer; the cheapest offers start around 200 CHF. The deductible is fixed for cross-border workers (300 CHF/year), with a 10% co-pay capped at 700 CHF/year. Indicative orders of magnitude, individual situations vary.*

## The simple rule, and the reflex to build

**Below about 65,000 CHF gross/year, CMU is often more favourable** (proportional contribution, no deductible); above, LAMal's fixed premium wins and the gap widens with salary. But price is not everything: if you mostly see Swiss doctors, LAMal's freedom of access can justify a few francs more.

In both cases, plan for a **top-up (€30 to €80/month)** for dental, optical and fee overruns. And mind an often-forgotten point: as a **couple or family**, the calculation changes (pooled income for CMU, per-person premiums for LAMal) — simulate at household level, not just individually. With children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The **GTE** (see the Resources chapter) and the **cross-border brokers** in Annemasse or Saint-Julien offer personalised, often free, simulations.

> **Go further:** [LAMal or CMU: the cross-border budget comparison](/blog/assurance-sante-frontalier-lamal-cmu-budget), with worked profiles.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## LAMal ou CMU-PUMa : la règle simple

**En dessous d'environ 65 000 CHF brut par an, la CMU-PUMa est souvent plus avantageuse** : sa cotisation, environ 8 % de ton revenu fiscal de référence, suit ton salaire. Au-dessus, la prime de la LAMal, fixe quel que soit ton salaire, prend l'avantage, et l'écart se creuse avec le revenu. Le prix n'est pas tout : la LAMal donne accès aux médecins suisses sans médecin traitant, la CMU-PUMa passe par un parcours de soins coordonné côté France. Dans les deux cas, prévois une mutuelle complémentaire (30 à 80 € par mois). En couple ou en famille, fais la simulation à l'échelle du foyer ; avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le GTE (voir le chapitre Ressources) et les courtiers frontaliers d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.

> **Pour aller plus loin :** [le comparatif complet LAMal ou CMU-PUMa](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec les coûts 2026 selon ton salaire et des profils chiffrés.$r$, $f$## Comment marche la LAMal (assurance suisse)

C'est l'option par défaut. Tu choisis un **assureur suisse** (Helsana, CSS, Swica, Groupe Mutuel…) et tu paies une **prime mensuelle** ; la **franchise est fixe pour les frontaliers : 300 CHF/an**, sans franchise à option contrairement aux résidents suisses. Trois caractéristiques à comprendre :

- La prime varie selon **l'âge, le canton et la franchise choisie**, mais **pas selon ton salaire** : que tu gagnes 4 000 ou 12 000 CHF, c'est le même montant. C'est ce qui la rend imbattable sur les hauts revenus.
- Après la franchise, une **[quote-part de 10 %](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** s'applique sur les frais, plafonnée à **700 CHF/an** : ton reste à charge annuel est donc borné.
- La LAMal couvre les soins **en Suisse et en France** (avec la carte européenne d'assurance maladie) et te donne accès aux médecins suisses **sans médecin traitant** — un confort réel si tu te soignes côté suisse.

Côté évolution des prix : les primes LAMal ont **historiquement augmenté de 5 à 10 % par an** (avec un pic à +16,6 % en 2024). Bonne nouvelle, **2026 est une année quasi blanche pour les frontaliers**, la hausse restant très contenue. Mais garde un œil sur l'horizon : une **réforme du mécanisme de compensation des risques, qui pourrait renchérir les primes des assurés frontaliers, est attendue pour 2028** — un point à anticiper dans un choix qui t'engage sur la durée. Pour comparer les caisses, utilise le **comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch)** — il évite de te fier aux arguments commerciaux d'un seul assureur.

## Comment marche la CMU-PUMa (couverture française)

Si tu exerces ton droit d'option dans les 3 mois, tu rejoins le régime français. L'affiliation passe par le **Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr)** ; tes soins relèvent ensuite de la **CPAM** de ton département. Ici, pas de prime mais une **cotisation d'environ 8 % de ton revenu fiscal de référence** (après abattement). Concrètement, pour un salaire brut de l'ordre de 70 000 CHF/an, la cotisation se situe autour de **330 €/mois** ; elle grimpe pour les hauts salaires et descend pour les revenus modestes.

Deux contreparties : la couverture est surtout **côté France**, et tu dois respecter un **parcours de soins coordonné** (déclarer un médecin traitant). L'avantage décisif : **pas de franchise à avancer**, et une cotisation qui **n'augmente que si ton salaire augmente** — pas de hausse annuelle subie comme en LAMal.

## LAMal ou CMU : le comparatif

| Critère | LAMal (suisse) | CMU-PUMa (française) |
|---|---|---|
| Base du coût | Âge, canton, franchise — **indépendant du salaire** | **~8 % du revenu fiscal de référence** |
| Franchise | 300 CHF/an (fixe) + quote-part 10 % (max 700 CHF/an) | Pas de franchise à avancer |
| Évolution | Historiquement +5 à 10 %/an ; **quasi stable en 2026**, réforme attendue en 2028 | Augmente seulement si le salaire augmente |
| Accès aux soins | Médecins suisses en direct, couvre Suisse + France | Parcours coordonné, médecin traitant en France |
| Le mieux pour… | Hauts salaires (prime fixe) | Salaires modestes (< ~65 000 CHF brut/an) |

À titre indicatif, selon les ordres de grandeur relevés début 2026 pour un frontalier de 25-35 ans, voici comment les deux options se croisent selon le salaire. **Note bien la logique du tableau : la prime LAMal ne bouge pas avec ton salaire** (elle dépend de ton âge, de ton canton et de ta franchise) — c'est la cotisation CMU, elle, qui grimpe avec le revenu. C'est tout le cœur de l'arbitrage.

| Salaire brut annuel | Prime LAMal (jeune adulte)* | Cotisation CMU-PUMa | Option qui ressort |
|---|---|---|---|
| 50 000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65 000 CHF | ~280 CHF | ~300 CHF | Équivalent |
| 80 000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100 000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120 000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\*Prime forfaitaire, **indépendante du salaire** : elle varie selon l'âge et la caisse. La valeur de ~280 CHF correspond à un adulte de 25-35 ans chez une caisse compétitive ; les offres les moins chères démarrent autour de 200 CHF. La franchise, elle, est fixe pour les frontaliers (300 CHF/an), avec une quote-part de 10 % plafonnée à 700 CHF/an. Ordres de grandeur indicatifs, hors situation individuelle.*

## La règle simple, et le réflexe à prendre

**En dessous d'environ 65 000 CHF brut/an, la CMU est souvent plus avantageuse** (cotisation proportionnelle, pas de franchise) ; au-dessus, la prime fixe de la LAMal prend l'avantage et l'écart se creuse avec le salaire. Mais le prix n'est pas tout : si tu te soignes surtout côté suisse, la liberté d'accès de la LAMal peut justifier quelques francs de plus.

Dans les deux cas, prévois une **mutuelle complémentaire (30 à 80 €/mois)** pour le dentaire, l'optique et les dépassements d'honoraires. Et pense à un point souvent oublié : en **couple ou en famille**, le calcul change (revenus cumulés pour la CMU, primes par personne pour la LAMal) — fais la simulation à l'échelle du foyer, pas seulement individuelle. Avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le **GTE** (voir le chapitre Ressources) et les **courtiers frontaliers** d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.

> **Pour aller plus loin :** [LAMal ou CMU : le comparatif budget du frontalier](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec des profils chiffrés.$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$## LAMal ou CMU-PUMa : la règle simple

**En dessous d'environ 65 000 CHF brut par an, la CMU-PUMa est souvent plus avantageuse** : sa cotisation, environ 8 % de ton revenu fiscal de référence, suit ton salaire. Au-dessus, la prime de la LAMal, fixe quel que soit ton salaire, prend l'avantage, et l'écart se creuse avec le revenu. Le prix n'est pas tout : la LAMal donne accès aux médecins suisses sans médecin traitant, la CMU-PUMa passe par un parcours de soins coordonné côté France. Dans les deux cas, prévois une mutuelle complémentaire (30 à 80 € par mois). En couple ou en famille, fais la simulation à l'échelle du foyer ; avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le GTE (voir le chapitre Ressources) et les courtiers frontaliers d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.

> **Pour aller plus loin :** [le comparatif complet LAMal ou CMU-PUMa](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec les coûts 2026 selon ton salaire et des profils chiffrés.$r$ IN content_fr) > 0
  AND position($f$## Comment marche la LAMal (assurance suisse)

C'est l'option par défaut. Tu choisis un **assureur suisse** (Helsana, CSS, Swica, Groupe Mutuel…) et tu paies une **prime mensuelle** ; la **franchise est fixe pour les frontaliers : 300 CHF/an**, sans franchise à option contrairement aux résidents suisses. Trois caractéristiques à comprendre :

- La prime varie selon **l'âge, le canton et la franchise choisie**, mais **pas selon ton salaire** : que tu gagnes 4 000 ou 12 000 CHF, c'est le même montant. C'est ce qui la rend imbattable sur les hauts revenus.
- Après la franchise, une **[quote-part de 10 %](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** s'applique sur les frais, plafonnée à **700 CHF/an** : ton reste à charge annuel est donc borné.
- La LAMal couvre les soins **en Suisse et en France** (avec la carte européenne d'assurance maladie) et te donne accès aux médecins suisses **sans médecin traitant** — un confort réel si tu te soignes côté suisse.

Côté évolution des prix : les primes LAMal ont **historiquement augmenté de 5 à 10 % par an** (avec un pic à +16,6 % en 2024). Bonne nouvelle, **2026 est une année quasi blanche pour les frontaliers**, la hausse restant très contenue. Mais garde un œil sur l'horizon : une **réforme du mécanisme de compensation des risques, qui pourrait renchérir les primes des assurés frontaliers, est attendue pour 2028** — un point à anticiper dans un choix qui t'engage sur la durée. Pour comparer les caisses, utilise le **comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch)** — il évite de te fier aux arguments commerciaux d'un seul assureur.

## Comment marche la CMU-PUMa (couverture française)

Si tu exerces ton droit d'option dans les 3 mois, tu rejoins le régime français. L'affiliation passe par le **Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr)** ; tes soins relèvent ensuite de la **CPAM** de ton département. Ici, pas de prime mais une **cotisation d'environ 8 % de ton revenu fiscal de référence** (après abattement). Concrètement, pour un salaire brut de l'ordre de 70 000 CHF/an, la cotisation se situe autour de **330 €/mois** ; elle grimpe pour les hauts salaires et descend pour les revenus modestes.

Deux contreparties : la couverture est surtout **côté France**, et tu dois respecter un **parcours de soins coordonné** (déclarer un médecin traitant). L'avantage décisif : **pas de franchise à avancer**, et une cotisation qui **n'augmente que si ton salaire augmente** — pas de hausse annuelle subie comme en LAMal.

## LAMal ou CMU : le comparatif

| Critère | LAMal (suisse) | CMU-PUMa (française) |
|---|---|---|
| Base du coût | Âge, canton, franchise — **indépendant du salaire** | **~8 % du revenu fiscal de référence** |
| Franchise | 300 CHF/an (fixe) + quote-part 10 % (max 700 CHF/an) | Pas de franchise à avancer |
| Évolution | Historiquement +5 à 10 %/an ; **quasi stable en 2026**, réforme attendue en 2028 | Augmente seulement si le salaire augmente |
| Accès aux soins | Médecins suisses en direct, couvre Suisse + France | Parcours coordonné, médecin traitant en France |
| Le mieux pour… | Hauts salaires (prime fixe) | Salaires modestes (< ~65 000 CHF brut/an) |

À titre indicatif, selon les ordres de grandeur relevés début 2026 pour un frontalier de 25-35 ans, voici comment les deux options se croisent selon le salaire. **Note bien la logique du tableau : la prime LAMal ne bouge pas avec ton salaire** (elle dépend de ton âge, de ton canton et de ta franchise) — c'est la cotisation CMU, elle, qui grimpe avec le revenu. C'est tout le cœur de l'arbitrage.

| Salaire brut annuel | Prime LAMal (jeune adulte)* | Cotisation CMU-PUMa | Option qui ressort |
|---|---|---|---|
| 50 000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65 000 CHF | ~280 CHF | ~300 CHF | Équivalent |
| 80 000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100 000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120 000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\*Prime forfaitaire, **indépendante du salaire** : elle varie selon l'âge et la caisse. La valeur de ~280 CHF correspond à un adulte de 25-35 ans chez une caisse compétitive ; les offres les moins chères démarrent autour de 200 CHF. La franchise, elle, est fixe pour les frontaliers (300 CHF/an), avec une quote-part de 10 % plafonnée à 700 CHF/an. Ordres de grandeur indicatifs, hors situation individuelle.*

## La règle simple, et le réflexe à prendre

**En dessous d'environ 65 000 CHF brut/an, la CMU est souvent plus avantageuse** (cotisation proportionnelle, pas de franchise) ; au-dessus, la prime fixe de la LAMal prend l'avantage et l'écart se creuse avec le salaire. Mais le prix n'est pas tout : si tu te soignes surtout côté suisse, la liberté d'accès de la LAMal peut justifier quelques francs de plus.

Dans les deux cas, prévois une **mutuelle complémentaire (30 à 80 €/mois)** pour le dentaire, l'optique et les dépassements d'honoraires. Et pense à un point souvent oublié : en **couple ou en famille**, le calcul change (revenus cumulés pour la CMU, primes par personne pour la LAMal) — fais la simulation à l'échelle du foyer, pas seulement individuelle. Avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le **GTE** (voir le chapitre Ressources) et les **courtiers frontaliers** d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.

> **Pour aller plus loin :** [LAMal ou CMU : le comparatif budget du frontalier](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec des profils chiffrés.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Count 30-80 €/month extra for coverage of specialist surcharges, dental, and optical care.

As a couple or a family, the maths changes: pooled income for CMU-PUMa, one premium per person for LAMal. Run the numbers for the whole household, not just for yourself.$r$, $f$Count 30-80 €/month extra for coverage of specialist surcharges, dental, and optical care.$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Count 30-80 €/month extra for coverage of specialist surcharges, dental, and optical care.

As a couple or a family, the maths changes: pooled income for CMU-PUMa, one premium per person for LAMal. Run the numbers for the whole household, not just for yourself.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$You join through the national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr); your care then comes under the CPAM of your French département, and you contribute in proportion to your reference tax income.$r$, $f$You're affiliated with the French CPAM and contribute proportionally to your reference tax income.$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$You join through the national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr); your care then comes under the CPAM of your French département, and you contribute in proportion to your reference tax income.$r$ IN content_en) > 0
  AND position($f$You're affiliated with the French CPAM and contribute proportionally to your reference tax income.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$The deductible is the same for everyone: 300 CHF/year. To compare insurers, use the Swiss government's official comparison tool, [priminfo.admin.ch](https://www.priminfo.admin.ch).$r$, $f$The deductible is the same for everyone: 300 CHF/year.$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$The deductible is the same for everyone: 300 CHF/year. To compare insurers, use the Swiss government's official comparison tool, [priminfo.admin.ch](https://www.priminfo.admin.ch).$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Fais ce calcul AVANT d'arriver.$r$, $f$Faites ce calcul AVANT d'arriver.$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Fais ce calcul AVANT d'arriver.$r$ IN content_fr) > 0
  AND position($f$Faites ce calcul AVANT d'arriver.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dépassements d'honoraires, le dentaire et l'optique.

En couple ou en famille, le calcul change : revenus cumulés pour la CMU-PUMa, primes par personne pour la LAMal. Fais la simulation à l'échelle du foyer, pas seulement pour toi.$r$, $f$Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dépassements d'honoraires, le dentaire et l'optique.$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dépassements d'honoraires, le dentaire et l'optique.

En couple ou en famille, le calcul change : revenus cumulés pour la CMU-PUMa, primes par personne pour la LAMal. Fais la simulation à l'échelle du foyer, pas seulement pour toi.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$L'affiliation passe par le Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr) ; tes soins relèvent ensuite de la CPAM de ton département, et tu cotises en proportion de ton revenu fiscal de référence.$r$, $f$Tu es affilié à la CPAM française et tu cotises en proportion de ton revenu fiscal de référence.$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$L'affiliation passe par le Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr) ; tes soins relèvent ensuite de la CPAM de ton département, et tu cotises en proportion de ton revenu fiscal de référence.$r$ IN content_fr) > 0
  AND position($f$Tu es affilié à la CPAM française et tu cotises en proportion de ton revenu fiscal de référence.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La franchise, elle, est la même pour tous : 300 CHF/an. Pour comparer les caisses, utilise le comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch).$r$, $f$La franchise, elle, est la même pour tous : 300 CHF/an.$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$La franchise, elle, est la même pour tous : 300 CHF/an. Pour comparer les caisses, utilise le comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch).$r$ IN content_fr) > 0;

UPDATE blog_posts
SET title_en = replace(title_en, $r$Cross-border health insurance: LAMal or CMU-PUMa? 2026 costs$r$, $f$Cross-Border Health Insurance: LAMal or CMU? (Budget)$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Cross-border health insurance: LAMal or CMU-PUMa? 2026 costs$r$ IN title_en) > 0
  AND position($f$Cross-Border Health Insurance: LAMal or CMU? (Budget)$f$ IN title_en) = 0;

UPDATE blog_posts
SET title_fr = replace(title_fr, $r$Assurance santé frontalier : LAMal ou CMU-PUMa ? Coût 2026$r$, $f$Assurance santé frontalier : LAMal ou CMU ? (budget)$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Assurance santé frontalier : LAMal ou CMU-PUMa ? Coût 2026$r$ IN title_fr) > 0
  AND position($f$Assurance santé frontalier : LAMal ou CMU ? (budget)$f$ IN title_fr) = 0;

COMMIT;
*/
