/**
 * Brief « Genève profils » v2 du 30/10/2026 — B4, `assurance-sante-frontalier-lamal-cmu-budget` et chapitre 2 de `guide-ressources-frontalier-geneve`.
 * Titres courts (D-T du 30/10). L'article devient la seule page détaillée : le guide garde l'intro et « Le droit d'option »,
 * puis une synthèse et le lien ; l'article reprend du guide priminfo, l'URSSAF et le calcul par foyer. Les chiffres sans source sont listés
 * dans le rapport ([à sourcer]), sans correction à l'aveugle.
 *   node scripts/build-slots-sql.mjs --edits ./<ce fichier> --name <base> --date 2026-11-02 --write-diff
 */

export const POST_STATE_WATCH = [];

export function sqlDoc() {
  return {
    "lot": "B4 assurance santé : titres, guide ressources réduit à une synthèse, article enrichi",
    "sources": "chaînes relevées sur la base vivante le 02/11/2026",
    "apply": "Après validation du diff par Jérôme (D-B0), dans la séance du lot B.",
    "encoding": "Fichier UTF-8 — ne pas normaliser les espaces.",
    "dryRunTitle": "Lot B — B4 assurance santé : aperçu SQL",
    "legend": "Légende : « Avant » = texte en base au 02/11 ; « Après » = texte proposé.",
    "versions": {}
  };
}

const EDITS = [
  {
    "slug": "assurance-sante-frontalier-lamal-cmu-budget",
    "lang": "fr",
    "column": "title_fr",
    "mechanism": "B4",
    "note": "titre FR (version courte validée le 30/10)",
    "find": "Assurance santé frontalier : LAMal ou CMU ? (budget)",
    "replace": "Assurance santé frontalier : LAMal ou CMU-PUMa ? Coût 2026"
  },
  {
    "slug": "assurance-sante-frontalier-lamal-cmu-budget",
    "lang": "en",
    "column": "title_en",
    "mechanism": "B4",
    "note": "EN title (short version approved on 30/10)",
    "find": "Cross-Border Health Insurance: LAMal or CMU? (Budget)",
    "replace": "Cross-border health insurance: LAMal or CMU-PUMa? 2026 costs"
  },
  {
    "slug": "assurance-sante-frontalier-lamal-cmu-budget",
    "lang": "fr",
    "mechanism": "B4",
    "note": "l'article devient la seule page détaillée : il reprend du guide le comparateur officiel priminfo",
    "find": "La franchise, elle, est la même pour tous : 300 CHF/an.",
    "replace": "La franchise, elle, est la même pour tous : 300 CHF/an. Pour comparer les caisses, utilise le comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch)."
  },
  {
    "slug": "assurance-sante-frontalier-lamal-cmu-budget",
    "lang": "fr",
    "mechanism": "B4",
    "note": "… et l'affiliation par l'URSSAF (CMU-PUMa)",
    "find": "Tu es affilié à la CPAM française et tu cotises en proportion de ton revenu fiscal de référence.",
    "replace": "L'affiliation passe par le Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr) ; tes soins relèvent ensuite de la CPAM de ton département, et tu cotises en proportion de ton revenu fiscal de référence."
  },
  {
    "slug": "assurance-sante-frontalier-lamal-cmu-budget",
    "lang": "fr",
    "mechanism": "B4",
    "note": "… et le calcul à l'échelle du foyer",
    "find": "Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dépassements d'honoraires, le dentaire et l'optique.",
    "replace": "Compte 30-80 €/mois supplémentaires pour une mutuelle qui couvre les dépassements d'honoraires, le dentaire et l'optique.\n\nEn couple ou en famille, le calcul change : revenus cumulés pour la CMU-PUMa, primes par personne pour la LAMal. Fais la simulation à l'échelle du foyer, pas seulement pour toi."
  },
  {
    "slug": "assurance-sante-frontalier-lamal-cmu-budget",
    "lang": "fr",
    "mechanism": "CORRECTIF",
    "note": "vouvoiement → tutoiement",
    "find": "Faites ce calcul AVANT d'arriver.",
    "replace": "Fais ce calcul AVANT d'arriver."
  },
  {
    "slug": "assurance-sante-frontalier-lamal-cmu-budget",
    "lang": "en",
    "mechanism": "B4",
    "note": "the article takes over the official priminfo comparator from the guide",
    "find": "The deductible is the same for everyone: 300 CHF/year.",
    "replace": "The deductible is the same for everyone: 300 CHF/year. To compare insurers, use the Swiss government's official comparison tool, [priminfo.admin.ch](https://www.priminfo.admin.ch)."
  },
  {
    "slug": "assurance-sante-frontalier-lamal-cmu-budget",
    "lang": "en",
    "mechanism": "B4",
    "note": "… and affiliation through URSSAF (CMU-PUMa)",
    "find": "You're affiliated with the French CPAM and contribute proportionally to your reference tax income.",
    "replace": "You join through the national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr); your care then comes under the CPAM of your French département, and you contribute in proportion to your reference tax income."
  },
  {
    "slug": "assurance-sante-frontalier-lamal-cmu-budget",
    "lang": "en",
    "mechanism": "B4",
    "note": "… and the household calculation",
    "find": "Count 30-80 €/month extra for coverage of specialist surcharges, dental, and optical care.",
    "replace": "Count 30-80 €/month extra for coverage of specialist surcharges, dental, and optical care.\n\nAs a couple or a family, the maths changes: pooled income for CMU-PUMa, one premium per person for LAMal. Run the numbers for the whole household, not just for yourself."
  },
  {
    "slug": "guide-ressources-frontalier-geneve",
    "lang": "fr",
    "mechanism": "B4",
    "note": "guide ressources, chapitre 2 : LAMal, CMU, comparatif et règle simple remplacés par une synthèse et le lien vers l'article (le droit d'option reste)",
    "find": "## Comment marche la LAMal (assurance suisse)\n\nC'est l'option par défaut. Tu choisis un **assureur suisse** (Helsana, CSS, Swica, Groupe Mutuel…) et tu paies une **prime mensuelle** ; la **franchise est fixe pour les frontaliers : 300 CHF/an**, sans franchise à option contrairement aux résidents suisses. Trois caractéristiques à comprendre :\n\n- La prime varie selon **l'âge, le canton et la franchise choisie**, mais **pas selon ton salaire** : que tu gagnes 4 000 ou 12 000 CHF, c'est le même montant. C'est ce qui la rend imbattable sur les hauts revenus.\n- Après la franchise, une **[quote-part de 10 %](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** s'applique sur les frais, plafonnée à **700 CHF/an** : ton reste à charge annuel est donc borné.\n- La LAMal couvre les soins **en Suisse et en France** (avec la carte européenne d'assurance maladie) et te donne accès aux médecins suisses **sans médecin traitant** — un confort réel si tu te soignes côté suisse.\n\nCôté évolution des prix : les primes LAMal ont **historiquement augmenté de 5 à 10 % par an** (avec un pic à +16,6 % en 2024). Bonne nouvelle, **2026 est une année quasi blanche pour les frontaliers**, la hausse restant très contenue. Mais garde un œil sur l'horizon : une **réforme du mécanisme de compensation des risques, qui pourrait renchérir les primes des assurés frontaliers, est attendue pour 2028** — un point à anticiper dans un choix qui t'engage sur la durée. Pour comparer les caisses, utilise le **comparateur officiel de la Confédération, [priminfo.admin.ch](https://www.priminfo.admin.ch)** — il évite de te fier aux arguments commerciaux d'un seul assureur.\n\n## Comment marche la CMU-PUMa (couverture française)\n\nSi tu exerces ton droit d'option dans les 3 mois, tu rejoins le régime français. L'affiliation passe par le **Centre national des travailleurs frontaliers en Suisse, géré par l'[URSSAF](https://www.urssaf.fr)** ; tes soins relèvent ensuite de la **CPAM** de ton département. Ici, pas de prime mais une **cotisation d'environ 8 % de ton revenu fiscal de référence** (après abattement). Concrètement, pour un salaire brut de l'ordre de 70 000 CHF/an, la cotisation se situe autour de **330 €/mois** ; elle grimpe pour les hauts salaires et descend pour les revenus modestes.\n\nDeux contreparties : la couverture est surtout **côté France**, et tu dois respecter un **parcours de soins coordonné** (déclarer un médecin traitant). L'avantage décisif : **pas de franchise à avancer**, et une cotisation qui **n'augmente que si ton salaire augmente** — pas de hausse annuelle subie comme en LAMal.\n\n## LAMal ou CMU : le comparatif\n\n| Critère | LAMal (suisse) | CMU-PUMa (française) |\n|---|---|---|\n| Base du coût | Âge, canton, franchise — **indépendant du salaire** | **~8 % du revenu fiscal de référence** |\n| Franchise | 300 CHF/an (fixe) + quote-part 10 % (max 700 CHF/an) | Pas de franchise à avancer |\n| Évolution | Historiquement +5 à 10 %/an ; **quasi stable en 2026**, réforme attendue en 2028 | Augmente seulement si le salaire augmente |\n| Accès aux soins | Médecins suisses en direct, couvre Suisse + France | Parcours coordonné, médecin traitant en France |\n| Le mieux pour… | Hauts salaires (prime fixe) | Salaires modestes (< ~65 000 CHF brut/an) |\n\nÀ titre indicatif, selon les ordres de grandeur relevés début 2026 pour un frontalier de 25-35 ans, voici comment les deux options se croisent selon le salaire. **Note bien la logique du tableau : la prime LAMal ne bouge pas avec ton salaire** (elle dépend de ton âge, de ton canton et de ta franchise) — c'est la cotisation CMU, elle, qui grimpe avec le revenu. C'est tout le cœur de l'arbitrage.\n\n| Salaire brut annuel | Prime LAMal (jeune adulte)* | Cotisation CMU-PUMa | Option qui ressort |\n|---|---|---|---|\n| 50 000 CHF | ~280 CHF | ~210 CHF | CMU |\n| 65 000 CHF | ~280 CHF | ~300 CHF | Équivalent |\n| 80 000 CHF | ~280 CHF | ~400 CHF | LAMal |\n| 100 000 CHF | ~280 CHF | ~530 CHF | LAMal |\n| 120 000 CHF | ~280 CHF | ~650 CHF | LAMal |\n\n*\\*Prime forfaitaire, **indépendante du salaire** : elle varie selon l'âge et la caisse. La valeur de ~280 CHF correspond à un adulte de 25-35 ans chez une caisse compétitive ; les offres les moins chères démarrent autour de 200 CHF. La franchise, elle, est fixe pour les frontaliers (300 CHF/an), avec une quote-part de 10 % plafonnée à 700 CHF/an. Ordres de grandeur indicatifs, hors situation individuelle.*\n\n## La règle simple, et le réflexe à prendre\n\n**En dessous d'environ 65 000 CHF brut/an, la CMU est souvent plus avantageuse** (cotisation proportionnelle, pas de franchise) ; au-dessus, la prime fixe de la LAMal prend l'avantage et l'écart se creuse avec le salaire. Mais le prix n'est pas tout : si tu te soignes surtout côté suisse, la liberté d'accès de la LAMal peut justifier quelques francs de plus.\n\nDans les deux cas, prévois une **mutuelle complémentaire (30 à 80 €/mois)** pour le dentaire, l'optique et les dépassements d'honoraires. Et pense à un point souvent oublié : en **couple ou en famille**, le calcul change (revenus cumulés pour la CMU, primes par personne pour la LAMal) — fais la simulation à l'échelle du foyer, pas seulement individuelle. Avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le **GTE** (voir le chapitre Ressources) et les **courtiers frontaliers** d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.\n\n> **Pour aller plus loin :** [LAMal ou CMU : le comparatif budget du frontalier](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec des profils chiffrés.",
    "replace": "## LAMal ou CMU-PUMa : la règle simple\n\n**En dessous d'environ 65 000 CHF brut par an, la CMU-PUMa est souvent plus avantageuse** : sa cotisation, environ 8 % de ton revenu fiscal de référence, suit ton salaire. Au-dessus, la prime de la LAMal, fixe quel que soit ton salaire, prend l'avantage, et l'écart se creuse avec le revenu. Le prix n'est pas tout : la LAMal donne accès aux médecins suisses sans médecin traitant, la CMU-PUMa passe par un parcours de soins coordonné côté France. Dans les deux cas, prévois une mutuelle complémentaire (30 à 80 € par mois). En couple ou en famille, fais la simulation à l'échelle du foyer ; avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le GTE (voir le chapitre Ressources) et les courtiers frontaliers d'Annemasse ou Saint-Julien proposent des simulations personnalisées, souvent gratuites.\n\n> **Pour aller plus loin :** [le comparatif complet LAMal ou CMU-PUMa](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec les coûts 2026 selon ton salaire et des profils chiffrés."
  },
  {
    "slug": "guide-ressources-frontalier-geneve",
    "lang": "en",
    "mechanism": "B4",
    "note": "resources guide, chapter 2: LAMal, CMU, comparison and simple rule replaced by a summary and the link to the article (right of option stays)",
    "find": "## How LAMal works (Swiss insurance)\n\nIt is the default option. You pick a **Swiss insurer** (Helsana, CSS, Swica, Groupe Mutuel…) and pay a **monthly premium**; the **deductible is fixed for cross-border workers: 300 CHF/year**, with no optional higher deductibles, unlike Swiss residents. Three things to understand:\n\n- The premium varies with **age, canton and chosen deductible**, but **not with your salary**: whether you earn 4,000 or 12,000 CHF, it is the same amount. That is what makes it unbeatable on high incomes.\n- After the deductible, a **[10% co-payment](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** applies, capped at **700 CHF/year**: your annual out-of-pocket is bounded.\n- LAMal covers care **in Switzerland and in France** (with the European health insurance card) and gives direct access to Swiss doctors **without a referring GP**.\n\nOn price evolution: LAMal premiums have **historically risen 5 to 10% per year** (with a peak of +16.6% in 2024). The good news: **2026 is a near-flat year for cross-border workers**, with a very contained increase. But keep an eye on the horizon: a **reform of the risk-compensation mechanism, which could raise premiums for cross-border policyholders, is expected for 2028** — worth anticipating in a choice that commits you for the long run. To compare insurers, use the **official federal comparator, [priminfo.admin.ch](https://www.priminfo.admin.ch)**.\n\n## How CMU-PUMa works (French cover)\n\nIf you exercise your option within 3 months, you join the French system. Affiliation goes through the **national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr)**; your care then falls under your local **CPAM**. Here, no premium but a **contribution of about 8% of your reference tax income** (after an allowance). For a gross salary around 70,000 CHF/year, that is roughly **€330/month**; it rises for high salaries and falls for modest incomes.\n\nTwo trade-offs: cover is mainly **on the French side**, and you must follow a **coordinated care pathway** (declare a referring GP). The decisive upside: **no deductible to advance**, and a contribution that **rises only if your salary rises** — no annual increase imposed as with LAMal.\n\n## LAMal vs CMU: the comparison\n\n| Criterion | LAMal (Swiss) | CMU-PUMa (French) |\n|---|---|---|\n| Cost basis | Age, canton, deductible — **independent of salary** | **~8% of reference tax income** |\n| Deductible | Fixed 300 CHF/year + 10% co-pay (max 700 CHF/year) | No deductible to advance |\n| Evolution | Historically +5 to 10%/year; **nearly stable in 2026**, reform expected in 2028 | Rises only if salary rises |\n| Care access | Swiss doctors directly, covers CH + FR | Coordinated pathway, GP in France |\n| Best for… | High salaries (fixed premium) | Modest salaries (< ~65,000 CHF gross/year) |\n\nBy orders of magnitude observed in early 2026 for a 25-35-year-old, here is how the two cross over depending on salary. **Note the table's logic: the LAMal premium does not move with your salary** (it depends on your age, canton and deductible) — it is the CMU contribution that climbs with income. That is the very heart of the trade-off.\n\n| Gross annual salary | LAMal premium (young adult)* | CMU-PUMa contribution | Option that stands out |\n|---|---|---|---|\n| 50,000 CHF | ~280 CHF | ~210 CHF | CMU |\n| 65,000 CHF | ~280 CHF | ~300 CHF | Tie |\n| 80,000 CHF | ~280 CHF | ~400 CHF | LAMal |\n| 100,000 CHF | ~280 CHF | ~530 CHF | LAMal |\n| 120,000 CHF | ~280 CHF | ~650 CHF | LAMal |\n\n*\\*Flat premium, **independent of salary**: it varies with age and insurer. The ~280 CHF figure corresponds to a 25-35-year-old at a competitive insurer; the cheapest offers start around 200 CHF. The deductible is fixed for cross-border workers (300 CHF/year), with a 10% co-pay capped at 700 CHF/year. Indicative orders of magnitude, individual situations vary.*\n\n## The simple rule, and the reflex to build\n\n**Below about 65,000 CHF gross/year, CMU is often more favourable** (proportional contribution, no deductible); above, LAMal's fixed premium wins and the gap widens with salary. But price is not everything: if you mostly see Swiss doctors, LAMal's freedom of access can justify a few francs more.\n\nIn both cases, plan for a **top-up (€30 to €80/month)** for dental, optical and fee overruns. And mind an often-forgotten point: as a **couple or family**, the calculation changes (pooled income for CMU, per-person premiums for LAMal) — simulate at household level, not just individually. With children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The **GTE** (see the Resources chapter) and the **cross-border brokers** in Annemasse or Saint-Julien offer personalised, often free, simulations.\n\n> **Go further:** [LAMal or CMU: the cross-border budget comparison](/blog/assurance-sante-frontalier-lamal-cmu-budget), with worked profiles.",
    "replace": "## LAMal or CMU-PUMa: the simple rule\n\n**Below about CHF 65,000 gross a year, CMU-PUMa is often the better deal**: its contribution, about 8% of your reference taxable income, follows your salary. Above that, the LAMal premium, the same whatever you earn, takes the lead, and the gap widens as your income grows. Price isn't everything: LAMal gives you direct access to Swiss doctors without a GP referral, while CMU-PUMa goes through a coordinated care pathway on the French side. Either way, plan for a top-up policy (\"mutuelle\", €30 to €80 a month). As a couple or a family, run the numbers for the whole household; with children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The GTE (see the Resources chapter) and the cross-border brokers in Annemasse or Saint-Julien offer personalised simulations, often free.\n\n> **Go further:** [the full LAMal or CMU-PUMa comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget), with 2026 costs by salary and worked profiles."
  }
];

export function buildEdits() {
  return EDITS;
}
