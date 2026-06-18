# AUDIT — fiscalite-frontalier-geneve-impots-2026 (HUB fiscal)

Article : `/tmp/lavilla/_d_fiscalite-frontalier-geneve-impots-2026.md`
Date audit : 2026-06-17 · Méthode : RÈGLES `_D_RULES.md` (sources officielles, URLs testées 200, verdicts ✓/✶/?)

---

## 1. CLAIMS

| # | Affirmation (article) | Verdict | Source (URL + citation) |
|---|---|---|---|
| 1 | « impôt à la source en Suisse, déclaration en France, crédit d'impôt » (mécanisme en 3 étapes) | ✓ | impots.gouv.fr — « votre salaire est imposé à la source directement à Genève » + crédit d'impôt conventionnel. https://www.impots.gouv.fr/international-particulier/questions/je-reside-en-france-et-travaille-dans-le-canton-de-geneve-ou-je |
| 2 | Barèmes selon situation : célibataire sans enfant = barème A | ✓ | ge.ch impôt source — A0 = célibataire sans enfant ; barèmes officiels par situation familiale. https://www.ge.ch/impot-source/calculette-baremes-perception-impot-source |
| 3 | Célibataire (barème A0) : **taux effectif 12-17 %** selon le salaire | ✓ (ordre de grandeur) | Barème A0 GE : ~0 % jusqu'à 2 450 CHF/mois → **12,30 % à 90 000 CHF/an** → jusqu'à ~21,40 % au-delà de 200 000 CHF/an. La fourchette 12-17 % cadre avec les revenus 90-160k. Barèmes 2026 GE : https://www.ge.ch/document/baremes-2026-perception-impot-source |
| 4 | Simulations de net (4 070-4 340 / 5 325-5 700 / 7 258-7 800 CHF) | ✓ (non recalculé, RÈGLE §25 : estimations plausibles) | Assiettes vérifiées (cotisations ~12-15 %, IS A0) cohérentes ; pas d'erreur d'assiette manifeste. |
| 5 | Déclarer en France obligatoire même si impôt nul (crédit d'impôt absorbe) | ✓ | BOFiP art. 25 A-1 : revenus imposables en Suisse « pris en compte pour le calcul de l'impôt français », crédit d'impôt = montant de l'impôt français correspondant. https://bofip.impots.gouv.fr/bofip/3141-PGP.html/identifiant=BOI-INT-CVB-CHE-10-40-20160728 |
| 6 | Crédit d'impôt = convention fiscale franco-suisse (art. 25 A) | ✓ | BOFiP : « article 25 de la convention… paragraphe A pour la France ». Même URL que #5. |
| 7 | Quasi-résident depuis 2021, condition **90 % des revenus mondiaux** en Suisse | ✓ | ge.ch — « 90 % au moins de vos revenus bruts mondiaux doivent être imposables en Suisse ». https://www.ge.ch/demande-rectification-taxation-ordinaire-ulterieure/determiner-statut-quasi-resident |
| 8 | Demande via **formulaire DRIS/TOU** auprès de l'administration genevoise | ✓ | ge.ch — demande de rectification de l'IS / TOU (DRIS/TOU), au plus tard 31 mars de l'année suivante. Même URL que #7. |
| 9 | Quasi-résident permet de déduire 3e pilier, transport, garde, rachats LPP | ✓ | ge.ch — déductions frais réels possibles via TOU/quasi-résident (frais professionnels, prévoyance, etc.). https://www.ge.ch/taxation-ordinaire-ulterieure-tou/qu-est-ce-qu-quasi-resident |
| 10 | Pilier 3a 2026 : plafond salariés avec LPP = **7 258 CHF/an** | ✓ | ESTV/AFC — déduction max pilier 3a 2026 avec LPP = 7 258 CHF (inchangé vs 2025). https://www.estv.admin.ch/fr/taux-interet-deductions-maximales-pilier-3a-impot-federal-direct |
| 11 | Versements 3a déductibles du revenu imposable | ✓ | ch.ch / ESTV — cotisations 3a entièrement déductibles jusqu'au plafond légal. Même URL que #10. |
| 12 | Économie d'impôt 3a : ~1 089 CHF si taux marginal 15 % (= 15 % × 7 258) | ✓ (calcul arithmétique cohérent) | Calcul interne exact ; taux marginal = hypothèse explicite, non normatif. |
| 13 | Oublier le **formulaire 2047** (revenus de source étrangère) = risque double imposition | ✓ | impots.gouv.fr — le 2047 sert à déclarer les revenus de source étrangère, reporté ensuite sur la 2042. https://www.impots.gouv.fr/international-particulier/je-suis-frontalier-franco-suisse |
| 14 | **CSG-CRDS 17,2 %** sur revenus du patrimoine en France « même si vous travaillez en Suisse » | ✶ | **Faux pour le frontalier affilié LAMal.** Affilié à un régime de sécu autre que français (Suisse/EEE) ⇒ **exonéré de CSG (9,2 %) + CRDS (0,5 %)**, ne reste que le **prélèvement de solidarité 7,5 %**. Le 17,2 % ne vise que le frontalier affilié à la sécu française (CMU). impots.gouv.fr : « affiliés à un régime obligatoire de sécurité sociale autre que français… exonérés de CSG et de CRDS… restent soumis au prélèvement de solidarité au taux de 7,5 % ». https://www.impots.gouv.fr/international-particulier/questions/je-suis-non-resident-suis-je-redevable-des-contributions · service-public.fr F2329 : https://service-public.fr/particuliers/vosdroits/F2329 |
| 15 | Écart brut/net suisse 25-35 % | ✓ (ordre de grandeur) | Cohérent avec cotisations sociales (~12-15 %) + IS A0 (~8-18 %) ; fourchette plausible, non normative. |
| 16 | (Implicite/contexte) marché genevois = gros volume de frontaliers | ⚠ recommandation | L'article ne cite **aucun chiffre** de frontaliers dans son texte. Chiffre OFFICIEL courant disponible (voir §3, lien à ajouter). |

**Bilan : 14 ✓ · 1 ✶ · 0 ? · 1 recommandation (ajout chiffre).**

---

## 2. CORRECTIONS ✶

### ✶-1 — CSG-CRDS : le 17,2 % ne s'applique pas au frontalier affilié LAMal

**OLD (verbatim FR) :**
> Ne pas anticiper la CSG-CRDS. Si vous avez des revenus du patrimoine en France (revenus locatifs, plus-values), vous paierez les prélèvements sociaux français (17,2 %) même si vous travaillez en Suisse. C'est un point crucial pour les frontaliers investisseurs immobiliers.

**NEW (FR) :**
> Mal anticiper les prélèvements sociaux. Si vous avez des revenus du patrimoine en France (revenus locatifs, plus-values), vous y êtes soumis même en travaillant en Suisse. Mais le taux dépend de votre couverture santé : un frontalier affilié à la LAMal suisse est exonéré de CSG et de CRDS et ne paie que le prélèvement de solidarité de 7,2 % (et non les 17,2 % complets, qui ne visent que les frontaliers affiliés à la sécurité sociale française / CMU). Conservez votre attestation d'affiliation. C'est un point crucial pour les frontaliers investisseurs immobiliers.

**OLD (verbatim EN) :**
> Not anticipating CSG-CRDS. If you have asset income in France (rental income, capital gains), you'll pay French social levies (17.2%) even if you work in Switzerland. This is a crucial point for cross-border real estate investors.

**NEW (EN) :**
> Mis-anticipating social levies. If you have asset income in France (rental income, capital gains), it remains taxable there even if you work in Switzerland. But the rate depends on your health coverage: a cross-border worker covered by Swiss LAMal is exempt from CSG and CRDS and pays only the 7.2% solidarity levy (not the full 17.2%, which applies only to workers covered by French social security / CMU). Keep your affiliation certificate. This is a crucial point for cross-border real estate investors.

**SRC :** https://www.impots.gouv.fr/international-particulier/questions/je-suis-non-resident-suis-je-redevable-des-contributions
(confirmé aussi par service-public.fr F2329 : https://service-public.fr/particuliers/vosdroits/F2329)

> Note prudence : si l'auteur préfère une retouche minimale, garder « 17,2 % » mais ajouter « (réduit à 7,2 % de prélèvement de solidarité si vous êtes affilié à la LAMal suisse) ». Le point ✶ porte sur le **caractère systématique** du 17,2 %, pas sur l'existence d'un prélèvement.

---

## 3. LIENS À INJECTER (URLs testées 200)

> Aucun lien officiel n'est présent dans le corps de l'article (hors liens internes /tarifs, /candidature, blog). Pour un HUB fiscal YMYL, ajouter 3-4 sources officielles renforce E-E-A-T.

### LIEN 1 — Imposition à la source Genève + crédit d'impôt (impots.gouv.fr)
- **ANCRE (FR, verbatim) :** `votre imposition fonctionne en trois temps`
- **ANCRE (EN, verbatim) :** `your taxation works in three stages`
- **URL :** https://www.impots.gouv.fr/international-particulier/questions/je-reside-en-france-et-travaille-dans-le-canton-de-geneve-ou-je  ✅ 200

### LIEN 2 — Convention art. 25 A / crédit d'impôt (BOFiP)
- **ANCRE (FR, verbatim) :** `la convention fiscale franco-suisse prévoit un crédit d'impôt`
- **ANCRE (EN, verbatim) :** `the Franco-Swiss tax treaty provides a tax credit`
- **URL :** https://bofip.impots.gouv.fr/bofip/3141-PGP.html/identifiant=BOI-INT-CVB-CHE-10-40-20160728  ✅ 200

### LIEN 3 — Statut quasi-résident / TOU (ge.ch)
- **ANCRE (FR, verbatim) :** `il faut en faire la demande via le formulaire DRIS/TOU auprès de l'administration fiscale genevoise`
- **ANCRE (EN, verbatim) :** `you must apply via the DRIS/TOU form to the Geneva tax administration`
- **URL :** https://www.ge.ch/demande-rectification-taxation-ordinaire-ulterieure/determiner-statut-quasi-resident  ✅ 200

### LIEN 4 — Barèmes 2026 impôt à la source (ge.ch) [optionnel, sur le taux A0]
- **ANCRE (FR, verbatim) :** `le taux effectif se situe entre 12 et 17 % selon le salaire`
- **ANCRE (EN, verbatim) :** `the effective rate is between 12 and 17% depending on salary`
- **URL :** https://www.ge.ch/document/baremes-2026-perception-impot-source  ✅ 200
  (alternative landing : https://www.ge.ch/impot-source/calculette-baremes-perception-impot-source ✅ 200)

### LIEN 5 — Prélèvements sociaux non-résident (impots.gouv.fr) [à poser sur la correction ✶-1]
- **ANCRE (FR, verbatim) :** `vous paierez les prélèvements sociaux français` → devient lien (ou nouvelle phrase de la correction NEW)
- **URL :** https://www.impots.gouv.fr/international-particulier/questions/je-suis-non-resident-suis-je-redevable-des-contributions  ✅ 200

---

## 4. POINT FRONTALIERS — chiffre OFFICIEL courant (à ajouter)

L'article ne cite **pas** de nombre de frontaliers. Chiffre officiel à utiliser :

- **116 200 frontaliers actifs étrangers** dans le canton de Genève **à fin 2025** (+2 100 / **+1,9 %** vs 2024 — plus faible hausse depuis 2009).
- **Source : OCSTAT** (Office cantonal de la statistique, Genève) ; donnée trimestrielle issue de la STAF (OFS).
- Attention : plusieurs agrégateurs non officiels affichent encore ~107 000 — **chiffre périmé** (≈2023). Le 116 200 est le plus récent confirmé OCSTAT/fin 2025. → marqué ✶ si l'article venait à afficher « ~107 000 » ou un ordre de grandeur nettement inférieur.

Liens officiels pour sourcer ce chiffre (200) :
- OFS — Frontaliers (STAF, données trimestrielles) : https://www.bfs.admin.ch/bfs/fr/home/statistiques/travail-remuneration/activite-professionnelle-temps-travail/population-active/frontaliers.html  ✅ 200
- OCSTAT — tableaux frontaliers étrangers actifs : https://statistique.ge.ch/domaines/03/03_05/tableaux.asp  ✅ 200

**Suggestion de phrase à insérer** (intro ou section logement) :
> FR : « Avec 116 200 frontaliers actifs à fin 2025 (source OCSTAT), Genève reste le 1er canton employeur de France voisine. »
> EN : « With 116,200 active cross-border workers at the end of 2025 (source: OCSTAT), Geneva remains the leading employer canton for neighbouring France. »

---

## Notes méthodo / dates 2026
- Plafond 3a 7 258 CHF = bien la valeur **2026** (inchangée vs 2025) — pas une donnée 2025 recopiée par erreur : valeur correcte. ✓
- Barèmes IS Genève : version **2026** publiée et utilisée (taux A0 cohérents). ✓
- Toutes les URLs ci-dessus testées via `curl -sL -w "%{http_code}"` → **200**.
