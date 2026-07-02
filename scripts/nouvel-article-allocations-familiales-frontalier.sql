-- ════════════════════════════════════════════════════════════════════════
-- Article #5 (DERNIER du cluster) — Allocations familiales frontalier Genève
-- Cible : "allocation familiale frontalier" (30/mois, compete 0) + longue traîne
-- Date : 2026-06-23
-- ⚠️ Article le + technique : règle de PRIORITÉ (CE 883/2004) clarifiée par cas
--   (le point où les guides concurrents se plantent).
-- Chiffres VÉRIFIÉS + croisés 2026 :
--   - Alloc GE : 311 CHF/enfant (411 dès 3e), formation 415/515, naissance 2073/3073
--     (sources ocas.ch, genevefamille.ch, ge.ch)
--   - CAF FR 2 enfants : 151,05 / 75,53 / 37,77 € selon revenus ; 1 enfant = 0 €
--     (service-public.fr, cleiss, aide-sociale.fr)
--   - Congé maternité : 14 sem fédéral, 16 sem Genève, 80% max 220 CHF/j
--   - Congé paternité : 2 sem (10 j), 80%
-- Maillage : 4 piliers fiscaux (slugs vérifiés) + liens croisés cluster.
-- ════════════════════════════════════════════════════════════════════════

INSERT INTO blog_posts (
  slug, title_fr, title_en, excerpt_fr, excerpt_en,
  meta_description_fr, meta_description_en, content_fr, content_en,
  author, category, image_url, read_time_min, is_published, published_at, tags
) VALUES (
  'allocations-familiales-frontalier-geneve-2026',
  'Allocations frontalier 2026 : ce que tu peux toucher',
  'Family allowances for frontaliers 2026',
  'Allocations familiales, congé maternité, prestations CAF : à quoi a droit un frontalier Genève en 2026 ? Le guide complet, par cas de figure.',
  'Family allowances, maternity leave, CAF benefits: what is a Geneva frontalier entitled to in 2026? The complete guide, case by case.',
  'Allocations familiales frontalier Genève 2026 : montants suisses (311 CHF/enfant), règle de priorité France/Suisse, complément différentiel, congé maternité, démarches.',
  'Geneva frontalier family allowances 2026: Swiss amounts (CHF 311/child), France/Switzerland priority rule, differential top-up, maternity leave, procedures.',
  $$« J'habite en France, je travaille à Genève, j'ai deux enfants — qui me verse les allocations, et combien ? » C'est l'une des questions les plus embrouillées du statut frontalier, parce que **deux systèmes se croisent** et que la plupart des guides expliquent la règle de priorité de travers. Voici le vrai fonctionnement 2026, par cas de figure, avec les montants exacts.

## Deux systèmes qui se croisent

Comme frontalier, tu es à cheval sur deux régimes :
- **La Suisse**, où tu travailles et cotises : allocations familiales versées par une **caisse de compensation cantonale** (à Genève, via l'OCAS).
- **La France**, où tu résides avec ta famille : prestations de la **CAF** (Caisse d'allocations familiales).

Tu ne cumules pas bêtement les deux. Un **règlement européen de coordination** (CE 883/2004, applicable entre la France et la Suisse) désigne quel pays paie **en priorité**, et l'autre verse éventuellement un **complément différentiel** s'il est plus généreux. Tout l'enjeu est de savoir lequel est prioritaire dans ta situation — et ça dépend d'un seul critère : **qui travaille où**.

## Les allocations familiales suisses (montants Genève 2026)

Bonne nouvelle : le système suisse est nettement plus généreux que le français, surtout pour les petites familles. À Genève en 2026 :

| Prestation | Montant 2026 |
|---|---|
| Allocation enfant (0-16 ans) | **311 CHF/mois** par enfant |
| Allocation enfant, dès le 3ᵉ | **411 CHF/mois** (dont supplément famille nombreuse) |
| Allocation de formation (16-25 ans) | **415 CHF/mois** (515 dès le 3ᵉ) |
| Allocation de naissance / adoption | **2 073 CHF** unique (3 073 dès le 3ᵉ) |

> Ces montants sont ceux du **canton de Genève** : chaque canton fixe les siens au-dessus du minimum fédéral (215 CHF/enfant). Si tu travailles à Vaud ou au Valais, vérifie le barème de ton canton d'emploi — c'est lui qui s'applique, pas celui de ton lieu de résidence.

**La différence choc avec la France :** en France, il n'y a **aucune allocation familiale pour un seul enfant** (elles ne démarrent qu'à partir de 2 enfants). À Genève, tu touches 311 CHF dès le premier. Pour une famille d'un enfant, l'écart est total.

## La règle de priorité : qui paie quoi (le vrai mécanisme)

C'est ici que 90 % des articles se trompent. La priorité ne dépend PAS bêtement du pays de résidence : elle dépend d'abord de **l'activité professionnelle**. Le règlement classe les droits dans cet ordre : 1) activité salariée, 2) pension, 3) résidence. Voici les deux cas réels.

### Cas 1 — Personne ne travaille en France → la Suisse est prioritaire
Si **tu es le seul à travailler** (en Suisse) et que ton conjoint est au foyer, sans emploi, ou si **vous êtes tous les deux frontaliers**, alors le seul droit « activité » est en Suisse. **La Suisse verse les allocations pleines** (311 CHF/enfant à Genève). La France n'interviendrait qu'en complément si ses montants étaient supérieurs — ce qui n'arrive quasiment jamais. En pratique : **tu touches les allocations suisses, un point c'est tout.**

### Cas 2 — Ton conjoint travaille (ou perçoit chômage/pension) en France → la France devient prioritaire
S'il y a une activité **dans les deux pays**, c'est le **pays de résidence des enfants** qui départage — donc la **France**. La **CAF verse en premier** selon son barème, puis **la Suisse complète la différence** (le fameux « complément différentiel ») si le montant suisse est plus élevé. Au final, ta famille perçoit **l'équivalent du montant le plus généreux** — mais réparti entre deux caisses, avec deux démarches.

### Exemple concret : 2 enfants, un seul parent frontalier
- **Cas 1 (conjoint au foyer)** : Genève verse **2 × 311 = 622 CHF/mois**. La France ne verse rien (Suisse prioritaire et plus généreuse). Total : **622 CHF**.
- **Cas 2 (conjoint salarié en France)** : la CAF verse d'abord les allocations françaises (pour 2 enfants : de 37,77 € à 151,05 €/mois selon vos revenus N-2), puis la Suisse verse le complément pour atteindre l'équivalent des 622 CHF. Total : **~622 CHF équivalent**, mais en deux versements.

Le montant final est proche dans les deux cas ; ce qui change, c'est **qui paie et quelles démarches tu dois faire**.

## Congé maternité et paternité frontalier

En tant que frontalière cotisant à l'AVS, tu relèves du **congé maternité suisse**, généralement plus court mais bien indemnisé :
- **14 semaines** au niveau fédéral (98 jours), **étendu à 16 semaines dans le canton de Genève**.
- Indemnité : **80 % du salaire**, plafonnée à **220 CHF/jour** (allocation APG).
- Conditions : avoir été assurée AVS pendant les 9 mois précédant l'accouchement, avoir travaillé au moins 5 mois durant cette période, et être toujours en emploi à l'accouchement.

Le **congé paternité / du 2ᵉ parent** est de **2 semaines** (10 jours indemnisés à 80 %), à prendre dans les 6 mois suivant la naissance. Attention : c'est le régime **suisse** qui s'applique (pas les 25 jours français), car tu cotises en Suisse.

## Les prestations CAF côté France : ce à quoi tu peux (ou non) prétendre

Comme tu résides en France, tu peux en théorie ouvrir des droits à la CAF — mais tes **revenus suisses élevés** t'excluent souvent des prestations sous plafond :
- **PAJE** (prime de naissance, allocation de base) : soumise à conditions de ressources et à la coordination européenne. Possible pour les revenus modestes, souvent hors d'atteinte pour un frontalier bien payé ; la prime de naissance peut donner lieu à un différentiel.
- **Aides au logement (APL)** : sous plafond de ressources — les revenus suisses dépassent généralement les seuils.
- **RSA / prime d'activité** : exclus dans la quasi-totalité des cas (revenus trop élevés).
- **AAH, AEEH** (handicap) : accessibles sous conditions spécifiques, indépendamment du niveau de salaire pour certaines.

En clair : côté français, compte surtout sur les **allocations familiales** (via le mécanisme de priorité) plus que sur les aides sous condition de ressources. Pour l'impact fiscal global, vois notre [guide fiscalité frontalier Genève 2026](/blog/fiscalite-frontalier-geneve-impots-2026).

## Démarches concrètes : qui contacter, quels papiers

1. **Ouvre d'abord tes droits en France** auprès de la **CAF de Haute-Savoie** (même si la Suisse sera prioritaire — c'est la porte d'entrée du système).
2. **Récupère le formulaire E411** (demande d'informations sur le droit aux prestations familiales), mis à disposition par la CAF dans ton espace personnel.
3. **Transmets-le à ta caisse suisse** (à Genève, l'OCAS) pour qu'elle calcule et verse l'allocation ou le complément différentiel.
4. Compte des délais de traitement de **2 à 5 semaines** côté suisse une fois le dossier complet.

Garde une copie de tout : contrat de travail suisse, acte de naissance, attestation de non-versement ou de versement de l'autre caisse. C'est le nerf de la guerre pour débloquer un dossier.

## Questions fréquentes

**Quel montant d'allocations familiales pour 2 enfants en frontalier ?**
À Genève, **622 CHF/mois** (2 × 311 CHF). Si ton conjoint travaille en France, la CAF verse d'abord la part française (37 à 151 €/mois selon vos revenus) et la Suisse complète jusqu'à l'équivalent suisse. Le total reste proche de 622 CHF.

**Le congé parental est-il payé en frontalier ?**
Le **congé maternité** (14 semaines, 16 à Genève) et le **congé paternité** (2 semaines) sont indemnisés à 80 % par le régime suisse (APG). Il n'existe pas de « congé parental » long rémunéré à la suisse comme en France ; au-delà, c'est un congé non payé négocié avec l'employeur.

**Faut-il déclarer les allocations suisses aux impôts français ?**
Les allocations familiales, suisses comme françaises, ne sont **pas soumises à l'impôt sur le revenu**. Tu déclares tes salaires suisses (voir notre [guide déclaration frontalier 2026](/blog/declaration-impots-frontalier-2026)), mais pas les allocations elles-mêmes. En cas de doute, confirme avec ton centre des impôts.

**Une famille mono-active frontalière a-t-elle droit à la PAJE ?**
Possible **sous conditions de ressources**, mais les revenus suisses dépassent fréquemment les plafonds PAJE. La prime à la naissance peut faire l'objet d'un complément différentiel. À vérifier au cas par cas avec la CAF.

**Que se passe-t-il en cas de divorce frontalier ?**
Les allocations suivent le **parent qui a la charge effective de l'enfant**. Si c'est le parent frontalier, il continue de percevoir via la Suisse ; si l'enfant vit principalement chez un parent travaillant en France, la priorité peut basculer. En garde alternée, des règles spécifiques s'appliquent — contacte ta caisse.

## Pour aller plus loin

- [Fiscalité frontalier Genève 2026](/blog/fiscalite-frontalier-geneve-impots-2026)
- [LAMal vs CMU : quelle assurance santé](/blog/assurance-sante-frontalier-lamal-cmu-budget)
- [Permis G frontalier : le guide](/blog/permis-g-frontalier-geneve)
- [Déclaration d'impôts frontalier 2026](/blog/declaration-impots-frontalier-2026)
- [Coût de la vie Suisse vs France pour une famille](/blog/cout-de-la-vie-suisse-france-frontalier-2026)

## En clair

Le système d'allocations frontalier fait peur mais suit une logique simple une fois la règle de priorité comprise : **personne ne travaille en France → la Suisse paie tout** (et généreusement, 311 CHF/enfant dès le premier à Genève) ; **un conjoint travaille en France → la France paie d'abord, la Suisse complète**. Dans les deux cas, ta famille touche l'équivalent du montant suisse — le plus avantageux d'Europe pour les petites familles.

Tu prépares ton installation de frontalier avant de fonder ta famille côté France ? Notre [coliving tout inclus à 20 min de Genève](/colocation-geneve) est un point de départ souple pour tes premiers mois — le temps de poser ton emploi et de trouver ton logement familial. [Découvre les chambres disponibles](/candidature).

---

*Article mis à jour 2026-06. Montants et règles vérifiés auprès des sources officielles (OCAS Genève, service-public.fr, CLEISS) pour 2026 ; ils évoluent et dépendent de ta situation exacte (canton d'emploi, activité du conjoint, revenus). Confirme toujours ton cas auprès de la CAF de Haute-Savoie et de ta caisse suisse.*$$,
  $$"I live in France, I work in Geneva, I have two kids — who pays the allowances, and how much?" It's one of the most tangled questions of the frontalier status, because **two systems overlap** and most guides explain the priority rule wrong. Here's how it really works in 2026, case by case, with the exact amounts.

## Two systems that overlap

As a cross-border worker, you straddle two schemes:
- **Switzerland**, where you work and contribute: family allowances paid by a **cantonal compensation fund** (in Geneva, via OCAS).
- **France**, where you live with your family: benefits from the **CAF** (family allowance fund).

You don't simply stack both. A **European coordination regulation** (EC 883/2004, applicable between France and Switzerland) designates which country pays **in priority**, and the other pays a possible **differential top-up** if it's more generous. The whole point is knowing which is priority in your situation — and it hinges on one thing: **who works where**.

## Swiss family allowances (Geneva amounts 2026)

Good news: the Swiss system is far more generous than the French one, especially for small families. In Geneva in 2026:

| Benefit | 2026 amount |
|---|---|
| Child allowance (age 0-16) | **CHF 311/month** per child |
| Child allowance, from the 3rd | **CHF 411/month** (incl. large-family supplement) |
| Training allowance (16-25) | **CHF 415/month** (515 from the 3rd) |
| Birth / adoption allowance | **CHF 2,073** one-off (3,073 from the 3rd) |

> These are **Canton of Geneva** amounts: each canton sets its own above the federal minimum (CHF 215/child). If you work in Vaud or Valais, check your canton of employment's scale — that's the one that applies, not your place of residence.

**The shocking difference with France:** in France, there is **no family allowance for a single child** (they only start from 2 children). In Geneva, you get CHF 311 from the first. For a one-child family, the gap is total.

## The priority rule: who pays what (the real mechanism)

This is where 90 % of articles get it wrong. Priority does NOT simply depend on the country of residence: it depends first on **professional activity**. The regulation ranks rights in this order: 1) employment, 2) pension, 3) residence. Here are the two real cases.

### Case 1 — Nobody works in France → Switzerland is priority
If **you're the only one working** (in Switzerland) and your partner is at home, unemployed, or if **you're both frontaliers**, then the only "activity" right is in Switzerland. **Switzerland pays the full allowance** (CHF 311/child in Geneva). France would only step in as a top-up if its amounts were higher — which almost never happens. In practice: **you get the Swiss allowances, full stop.**

### Case 2 — Your partner works (or gets unemployment/pension) in France → France becomes priority
If there's activity **in both countries**, the **children's country of residence** decides — so **France**. The **CAF pays first** per its scale, then **Switzerland tops up the difference** (the "differential supplement") if the Swiss amount is higher. In the end, your family receives **the more generous amount** — but split between two funds, with two procedures.

### Concrete example: 2 children, one frontalier parent
- **Case 1 (partner at home)**: Geneva pays **2 × 311 = CHF 622/month**. France pays nothing (Switzerland priority and more generous). Total: **CHF 622**.
- **Case 2 (partner employed in France)**: the CAF pays the French allowances first (for 2 children: €37.77 to €151.05/month depending on your N-2 income), then Switzerland tops up to the CHF 622 equivalent. Total: **~CHF 622 equivalent**, in two payments.

The final amount is close in both cases; what changes is **who pays and what procedures you must do**.

## Maternity and paternity leave for frontaliers

As a mother contributing to the AVS, you fall under **Swiss maternity leave**, generally shorter but well compensated:
- **14 weeks** at federal level (98 days), **extended to 16 weeks in the Canton of Geneva**.
- Benefit: **80 % of salary**, capped at **CHF 220/day** (APG allowance).
- Conditions: insured with AVS for the 9 months before birth, worked at least 5 months during that period, and still employed at birth.

**Paternity / second-parent leave** is **2 weeks** (10 compensated days at 80 %), to be taken within 6 months of birth. Note: the **Swiss** scheme applies (not the French 25 days), because you contribute in Switzerland.

## CAF benefits on the French side: what you can (or can't) claim

Since you live in France, you can in theory open CAF rights — but your **high Swiss income** often excludes you from means-tested benefits:
- **PAJE** (birth grant, base allowance): means-tested and subject to coordination. Possible for modest incomes, often out of reach for a well-paid frontalier; the birth grant may give a differential.
- **Housing benefit (APL)**: means-tested — Swiss income generally exceeds the thresholds.
- **RSA / activity bonus**: excluded in almost all cases (income too high).
- **Disability benefits (AAH, AEEH)**: accessible under specific conditions.

In short: on the French side, count mainly on **family allowances** (via the priority mechanism) rather than means-tested aid. For the overall tax impact, see our [Geneva frontalier tax guide 2026](/en/blog/fiscalite-frontalier-geneve-impots-2026).

## Concrete steps: who to contact, what papers

1. **Open your rights in France first** with the **CAF of Haute-Savoie** (even if Switzerland will be priority — it's the entry point).
2. **Get the E411 form** (request for information on family benefit entitlement), made available by the CAF in your personal account.
3. **Send it to your Swiss fund** (in Geneva, OCAS) so it calculates and pays the allowance or differential.
4. Expect processing times of **2 to 5 weeks** on the Swiss side once the file is complete.

Keep copies of everything: Swiss work contract, birth certificate, proof of (non-)payment from the other fund.

## FAQ

**How much family allowance for 2 children as a frontalier?**
In Geneva, **CHF 622/month** (2 × CHF 311). If your partner works in France, the CAF pays the French part first (€37 to €151/month depending on income) and Switzerland tops up to the Swiss equivalent. The total stays close to CHF 622.

**Is parental leave paid for frontaliers?**
**Maternity leave** (14 weeks, 16 in Geneva) and **paternity leave** (2 weeks) are paid at 80 % by the Swiss scheme (APG). There's no long paid "parental leave" Swiss-style as in France; beyond that, it's unpaid leave negotiated with your employer.

**Do you declare Swiss allowances on French taxes?**
Family allowances, Swiss or French, are **not subject to income tax**. You declare your Swiss salary (see our [frontalier tax filing guide](/en/blog/declaration-impots-frontalier-2026)), but not the allowances themselves. When in doubt, confirm with your tax office.

**Does a single-earner frontalier family qualify for PAJE?**
Possible **under means-testing**, but Swiss income often exceeds PAJE thresholds. The birth grant may give a differential. Check case by case with the CAF.

**What happens in a frontalier divorce?**
Allowances follow the **parent with effective custody of the child**. If that's the frontalier parent, they keep receiving via Switzerland; if the child mainly lives with a parent working in France, priority may switch. Shared custody has specific rules — contact your fund.

## Further reading

- [Geneva frontalier taxation 2026](/en/blog/fiscalite-frontalier-geneve-impots-2026)
- [LAMal vs CMU: which health insurance](/en/blog/assurance-sante-frontalier-lamal-cmu-budget)
- [Permis G frontalier guide](/en/blog/permis-g-frontalier-geneve)
- [Frontalier tax filing 2026](/en/blog/declaration-impots-frontalier-2026)
- [Cost of living Switzerland vs France for a family](/en/blog/cout-de-la-vie-suisse-france-frontalier-2026)

## In short

The frontalier allowance system looks scary but follows a simple logic once the priority rule is clear: **nobody works in France → Switzerland pays everything** (generously, CHF 311/child from the first in Geneva); **a partner works in France → France pays first, Switzerland tops up**. In both cases, your family receives the Swiss-equivalent amount — the most favourable in Europe for small families.

Setting up as a frontalier before starting your family on the French side? Our [all-inclusive coliving 20 min from Geneva](/en/colocation-geneve) is a flexible starting point for your first months — while you settle into the job and find your family home. [See available rooms](/en/candidature).

---

*Article updated 2026-06. Amounts and rules verified against official sources (OCAS Geneva, service-public.fr, CLEISS) for 2026; they change and depend on your exact situation (canton of employment, partner's activity, income). Always confirm your case with the CAF of Haute-Savoie and your Swiss fund.*$$,
  'La Villa Team', 'tips', '/images/le lodge/exterior/la villa coliving le lodge-117.webp', 10, true, NOW(),
  ARRAY['allocations familiales', 'frontalier', 'genève', 'caf', 'famille', '2026']
);

-- Vérification
SELECT slug, title_fr, is_published,
       LENGTH(content_fr) AS chars_fr, LENGTH(content_en) AS chars_en,
       LENGTH(title_fr) + LENGTH(' | La Villa Coliving') AS title_total_fr,
       LENGTH(title_en) + LENGTH(' | La Villa Coliving') AS title_total_en,
       LENGTH(excerpt_fr) AS excerpt_fr_len, LENGTH(excerpt_en) AS excerpt_en_len,
       LENGTH(meta_description_fr) AS meta_fr_len, LENGTH(meta_description_en) AS meta_en_len
FROM blog_posts WHERE slug = 'allocations-familiales-frontalier-geneve-2026';
