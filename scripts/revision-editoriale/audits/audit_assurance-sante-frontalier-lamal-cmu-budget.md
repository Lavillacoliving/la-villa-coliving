# AUDIT — assurance-sante-frontalier-lamal-cmu-budget

Article : « Assurance santé frontalier : LAMal ou CMU ? (budget) »
Sources officielles consultées : cleiss.fr, ameli.fr, urssaf.fr, bag.admin.ch (OFSP), haute-savoie.gouv.fr (préfecture).
Verdict global : **8 ✓ / 0 ✶ / 3 ?** — aucun fait légal contredit par une source officielle. Les fourchettes de prix restent des estimations plausibles (non corrigées, conformément aux règles).

---

## 1. CLAIMS

| Affirmation (FR/EN) | Verdict | Source officielle + citation |
|---|:--:|---|
| Droit d'option : délai de **3 mois** après le début de l'activité en Suisse | **✓** | cleiss.fr FAQ : « vous disposez de 3 mois à compter de la prise d'activité professionnelle en Suisse ou du transfert de résidence en France pour exercer l'option ». Confirmé aussi par ameli.fr. https://www.cleiss.fr/faq/droit_d_option_des_frontaliers_france-suisse.html |
| Droit d'option **irréversible/irrévocable** en pratique (sauf changement de situation : fin de contrat, etc.) | **✓** | cleiss.fr : « le droit d'option ne peut s'exercer qu'une seule fois et il est irrévocable » ; exceptions listées : « reprise d'activité en Suisse (par ex. après une période de chômage), transfert de résidence en France […] ou passage à la retraite du seul régime suisse ». https://www.cleiss.fr/faq/droit_d_option_des_frontaliers_france-suisse.html |
| Si on ne fait rien → **affiliation d'office à la LAMal** | **✓** | cleiss.fr : « À défaut de s'être manifesté en faveur du système d'assurance maladie français au terme du délai de 3 mois, le frontalier […] est affilié d'office en Suisse ». https://www.cleiss.fr/faq/droit_d_option_des_frontaliers_france-suisse.html |
| Cotisation CMU-PUMa = **8 % du revenu fiscal de référence (après abattement)** | **✓** (assiette à préciser, voir note) | urssaf.fr : « le taux est de 8 % » ; préfecture Haute-Savoie : « (Revenus N-2 − abattement forfaitaire de 25 % du plafond de la sécurité sociale) × 8 % ». Le taux 8 % et le principe « après abattement » sont exacts. Précision possible : l'assiette officielle est le **revenu fiscal de référence N-2** et l'abattement est **25 % du PASS** (≈ 10 284 € pour cotisation 2024 ; ≈ 11 775 € pour 2026, PASS 2026 = 47 100 €). https://www.haute-savoie.gouv.fr/Demarches/Frontaliers-franco-suisses/Cotisations-maladie/Montant-de-votre-cotisation |
| Quote-part LAMal = **10 %** des frais après franchise, **max 700 CHF/an** (adulte) | **✓** | OFSP/BAG : « une quote-part de 10 % sur les coûts qui dépassent la franchise […] jusqu'à concurrence de 700 francs » (350 fr. enfants). https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts |
| Franchise LAMal **300 à 2 500 CHF** | **✓** | OFSP/BAG : franchise ordinaire 300 fr. ; options adultes 500, 1000, 1500, 2000 et 2500 fr. (donc plage 300→2500). https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts |
| LAMal couvre les soins en Suisse ET en France (carte européenne d'assurance maladie) | **✓** | cleiss.fr / cadre règlement UE 883/2004 sur la coordination : le frontalier LAMal a droit aux soins dans le pays de résidence (France) et la CEAM ouvre les soins en UE. Cohérent avec les sources officielles. https://www.cleiss.fr/faq/droit_d_option_des_frontaliers_france-suisse.html |
| Prime LAMal indépendante du salaire / cotisation CMU proportionnelle au revenu | **✓** | OFSP (prime par tête, par assureur/canton/âge) ; urssaf.fr (cotisation = % du revenu). Principe officiel confirmé. https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts |
| Primes LAMal frontalier 25-35 ans : **250-450 CHF/mois** (franchise 2500) ; 380-550 CHF (franchise 300) | **?** | Pas de source officielle de prix : les primes varient par assureur et sont publiées individuellement par l'OFSP/priminfo. Ordre de grandeur plausible → **non corrigé** (règle : ne pas toucher une fourchette plausible). |
| Écart **200-500 CHF/mois** entre les deux régimes (titre) | **?** | Dépend du salaire et de l'assureur ; plausible pour hauts revenus (la cotisation CMU croît sans plafond, la prime LAMal est fixe). Estimation non vérifiable contre une source légale → conservé. |
| Augmentations de prime LAMal « 5-10 % par an » | **?** | Variations annuelles réelles (la hausse moyenne nationale a dépassé ce seuil certaines années, été inférieure d'autres). Estimation plausible, pas de seuil légal → conservé. |

### Notes
- **Tableau comparatif & profils budgétaires** (lignes 47-65 FR / 145-163 EN) : simulations chiffrées (primes, nets, parts de loyer). Conformément aux règles, les fourchettes/simulations ne sont pas recalculées dès lors qu'elles sont plausibles ; seules les **assiettes légales** ont été vérifiées (taux 8 %, quote-part 10 %/700 CHF, franchise 300-2500 CHF, délai 3 mois) → toutes correctes.
- **Point d'attention rédactionnel (non bloquant, pas un ✶)** : « 8 % de votre revenu fiscal de référence (après abattement) » est juste sur le taux et le principe, mais l'abattement officiel est précisément **25 % du PASS** appliqué au revenu N-2. Le texte n'est pas faux ; il pourrait gagner en précision (voir lien injecté ci-dessous qui amène la formule exacte). Aucune correction imposée.

---

## 2. CORRECTIONS ✶

Aucune. Aucun fait légal n'est contredit par une source officielle. Les écarts éventuels portent uniquement sur des estimations de prix/simulations, que les règles interdisent de « corriger » en l'absence de barème officiel.

---

## 3. LIENS À INJECTER

Tous testés `200` (curl -sL, User-Agent navigateur). Ancres = locutions verbatim présentes dans l'article (version FR).

1. **Droit d'option / délai 3 mois (CLEISS)**
   `ANCRE:` dans les 3 mois suivant le début de votre activité en Suisse
   `URL:` https://www.cleiss.fr/faq/droit_d_option_des_frontaliers_france-suisse.html

2. **Cotisation CMU-PUMa 8 % + abattement (URSSAF / préfecture — source de la formule)**
   `ANCRE:` La cotisation CMU-PUMa est de 8 % de votre revenu fiscal de référence (après abattement)
   `URL:` https://www.haute-savoie.gouv.fr/Demarches/Frontaliers-franco-suisses/Cotisations-maladie/Montant-de-votre-cotisation
   *(alternative officielle équivalente, aussi 200 : https://www.urssaf.fr/accueil/particulier/travailleur-frontalier-suisse/declarer-payer-cotisations.html)*

3. **Quote-part 10 % / max 700 CHF (OFSP/BAG)**
   `ANCRE:` vous payez 10 % des frais médicaux restants après la franchise, jusqu'à un maximum de 700 CHF par an
   `URL:` https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts

4. **Régime frontalier suisse / cadre général (ameli.fr)**
   `ANCRE:` exercer votre "droit d'option" dans les 3 mois suivant le début de votre activité en Suisse
   `URL:` https://www.ameli.fr/assure/droits-demarches/europe-international/travailleur-frontalier-suisse
   *(à utiliser si on veut un 4ᵉ lien ; sinon retenir les liens 1-3. Note : l'ancre du lien 4 chevauche celle du lien 1 — choisir l'un OU l'autre pour le passage « droit d'option / 3 mois » afin d'éviter deux liens sur la même phrase.)*

### Version EN (ancres équivalentes, mêmes URLs)
- `ANCRE:` within 3 months of starting work in Switzerland → cleiss.fr (ou ameli.fr)
- `ANCRE:` The CMU-PUMa contribution is 8% of your reference tax income (after allowances) → haute-savoie.gouv.fr / urssaf.fr
- `ANCRE:` you pay 10% of remaining medical costs after the deductible, up to a maximum of 700 CHF per year → bag.admin.ch

---

### Annexe — vérification HTTP (codes)
- 200 — https://www.cleiss.fr/faq/droit_d_option_des_frontaliers_france-suisse.html
- 200 — https://www.ameli.fr/assure/droits-demarches/europe-international/travailleur-frontalier-suisse
- 200 — https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts
- 200 — https://www.haute-savoie.gouv.fr/Demarches/Frontaliers-franco-suisses/Cotisations-maladie/Montant-de-votre-cotisation
- 200 — https://www.urssaf.fr/accueil/particulier/travailleur-frontalier-suisse/declarer-payer-cotisations.html
