-- ════════════════════════════════════════════════════════════════════════
-- CORRECTIF P0-2 / P1 — Article « Frontalier Genève : guide complet 2026 »
-- Date : 2026-06-08
-- Slug : living-in-france-working-in-geneva
-- ────────────────────────────────────────────────────────────────────────
-- 7 corrections chirurgicales (chaque UPDATE = 1 correction, FR + EN ensemble).
-- Les chaînes recherchées ont été vérifiées caractère par caractère contre la
-- base live (espaces normaux, pas d'espace insécable) → REPLACE fiable.
--
-- P0  : « régime français » → imposition à la source en Suisse (accord 1973,
--       crédit d'impôt art. 25A). Le bloc « impôt à la source » décrivait à tort
--       le modèle des AUTRES cantons (où la France taxe) → réécrit pour Genève.
-- P1  : 100 000 / 70 000 → 116 200 (OCSTAT fin 2025) ; suppression du « 200 000
--       salariés » (invérifiable) ; LAMal ~300 → 250-450 CHF ; Léman 18 → 20 min.
-- Bonus : retrait du tic « le coliving révolutionne » dans l'intro (cf. P2 ton IA).
-- ════════════════════════════════════════════════════════════════════════

-- ─── Fix 1 : intro — nombre de frontaliers + « révolutionne » ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$Chaque matin, plus de 100 000 frontaliers franchissent la frontière franco-suisse pour se rendre à leur travail à Genève. Vous envisagez de les rejoindre ? Ce guide complet vous explique comment vivre en France tout en travaillant en Suisse, et comment le coliving révolutionne le mode de vie des frontaliers.$o$,
    $n$Chaque matin, près de 116 200 frontaliers franchissent la frontière franco-suisse pour aller travailler dans le canton de Genève (chiffre OCSTAT, fin 2025). Vous envisagez de les rejoindre ? Ce guide complet vous explique comment vivre en France tout en travaillant en Suisse, et comment le coliving change la donne pour les frontaliers.$n$),
  content_en = REPLACE(content_en,
    $oe$Every morning, over 100,000 cross-border workers head from France to their jobs in Geneva. Are you thinking of joining them? This complete guide explains how to live in France while working in Switzerland, and how coliving is revolutionizing the lifestyle of cross-border workers.$oe$,
    $ne$Every morning, nearly 116,200 cross-border workers head from France to their jobs in the canton of Geneva (OCSTAT figure, end of 2025). Are you thinking of joining them? This complete guide explains how to live in France while working in Switzerland, and how coliving is changing the game for cross-border workers.$ne$),
  updated_at = NOW()
WHERE slug = 'living-in-france-working-in-geneva';

-- ─── Fix 2 : « 200 000 salariés » supprimé + 70 000→116 200, « +40% en 15 ans » retiré ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$Le flux migratoire est structurel. Genève compte environ 200 000 salariés, et la Suisse a signé des accords de libre circulation avec l'UE. La France reste le vivier principal de talents pour le plateau genevois. Le nombre de frontaliers a explosé de 40% en 15 ans, passant de 70 000 à plus de 100 000 aujourd'hui.$o$,
    $n$Le flux migratoire est structurel : la Suisse a signé des accords de libre circulation avec l'UE, et la France reste le vivier principal de talents pour le bassin genevois. Le nombre de frontaliers n'a cessé de progresser — d'environ 70 000 au milieu des années 2000 à 116 200 à fin 2025 dans le seul canton de Genève (OCSTAT).$n$),
  content_en = REPLACE(content_en,
    $oe$The migration flow is structural. Geneva has about 200,000 employees, and Switzerland has signed free movement agreements with the EU. France remains the primary talent pool for the Geneva plateau. The number of cross-border workers has exploded 40% in 15 years, from 70,000 to over 100,000 today.$oe$,
    $ne$The migration flow is structural: Switzerland has signed free movement agreements with the EU, and France remains the primary talent pool for the Geneva basin. The number of cross-border workers has kept rising — from around 70,000 in the mid-2000s to 116,200 by the end of 2025 in the canton of Geneva alone (OCSTAT).$ne$),
  updated_at = NOW()
WHERE slug = 'living-in-france-working-in-geneva';

-- ─── Fix 3 : ERREUR P0 « régime français » → imposition à la source en Suisse ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$C'est un point crucial et souvent mal compris. En tant que frontalier français, vous êtes soumis au régime français de la fiscalité, pas au régime suisse. Voici ce que vous devez savoir.$o$,
    $n$C'est un point crucial et souvent mal compris — et la réponse dépend de votre canton de travail. Si vous travaillez dans le canton de Genève, vous êtes imposé à la source en Suisse, en vertu de l'accord franco-suisse du 29 janvier 1973 (Genève reverse d'ailleurs une compensation financière aux départements français voisins). Voici ce que vous devez savoir.$n$),
  content_en = REPLACE(content_en,
    $oe$This is crucial and often misunderstood. As a French resident cross-border worker, you're subject to French tax rules, not Swiss ones. Here's what you need to know.$oe$,
    $ne$This is crucial and often misunderstood — and the answer depends on your canton of work. If you work in the canton of Geneva, you are taxed at source in Switzerland, under the Franco-Swiss agreement of 29 January 1973 (Geneva even pays financial compensation to the neighboring French departments). Here's what you need to know.$ne$),
  updated_at = NOW()
WHERE slug = 'living-in-france-working-in-geneva';

-- ─── Fix 4 : bloc « impôt à la source » §1 — réécrit pour Genève (crédit d'impôt art. 25A) ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$Vous payez un impôt à la source en Suisse sur votre salaire, mais ce n'est pas votre impôt final. C'est un acompte. À la fin de l'année, vous déclarez vos revenus aux impôts français, qui ajustent votre imposition selon le barème français progressif. La Suisse déduit ensuite un crédit d'impôt.$o$,
    $n$Pour un frontalier travaillant à Genève, l'impôt sur le revenu est prélevé directement à la source en Suisse, sur votre salaire. Vous déclarez ensuite ces mêmes revenus à l'administration française, mais la convention fiscale franco-suisse (article 25A) accorde un crédit d'impôt égal à l'impôt français correspondant : vous ne payez donc pas une seconde fois l'impôt en France sur votre salaire genevois. La double imposition est ainsi évitée.$n$),
  content_en = REPLACE(content_en,
    $oe$You pay a withholding tax in Switzerland on your salary, but it's not your final tax. It's a prepayment. At year-end, you declare your income to French tax authorities, who adjust your taxation according to progressive French rates. Switzerland then grants a tax credit.$oe$,
    $ne$For a cross-border worker employed in Geneva, income tax is withheld directly at source in Switzerland, on your salary. You then declare that same income to the French tax authorities, but the Franco-Swiss tax treaty (article 25A) grants a tax credit equal to the corresponding French tax: so you don't pay tax twice in France on your Geneva salary. Double taxation is thus avoided.$ne$),
  updated_at = NOW()
WHERE slug = 'living-in-france-working-in-geneva';

-- ─── Fix 5 : bloc « impôt à la source » §2 — « se règle en France » corrigé pour Genève ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$Le taux prélevé à la source en Suisse est généralement de 4 à 8% selon votre canton (Genève pratique un taux réduit pour les frontaliers). La majorité de votre imposition finale se règle en France.$o$,
    $n$Le taux prélevé à la source dépend de votre situation (barème, état civil, enfants à charge). Bonne nouvelle : vous pouvez souvent demander le statut de quasi-résident à Genève pour déduire certaines charges (3e pilier, frais professionnels). L'essentiel à retenir : pour Genève, l'imposition de votre salaire se règle d'abord côté suisse — voir notre [guide complet de la fiscalité frontalière](/blog/fiscalite-frontalier-geneve-impots-2026).$n$),
  content_en = REPLACE(content_en,
    $oe$The withholding rate in Switzerland is typically 4-8% depending on the canton (Geneva offers reduced rates for cross-border workers). Most of your final taxation is settled in France.$oe$,
    $ne$The withholding rate depends on your situation (tax scale, marital status, dependent children). Good news: you can often apply for quasi-resident status in Geneva to deduct certain expenses (3rd pillar, professional costs). The key point: for Geneva, the taxation of your salary is settled first on the Swiss side — see our [full cross-border tax guide](/en/blog/fiscalite-frontalier-geneve-impots-2026).$ne$),
  updated_at = NOW()
WHERE slug = 'living-in-france-working-in-geneva';

-- ─── Fix 6 : LAMal ~300 → 250-450 CHF/mois ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$La couverture maladie suisse (LAMal) est obligatoire, coûte ~300 CHF/mois, et offre généralement une couverture meilleure que la CMU française.$o$,
    $n$La couverture maladie suisse (LAMal) est obligatoire, coûte environ 250 à 450 CHF/mois selon l'âge et la franchise choisie, et offre généralement une couverture meilleure que la CMU française.$n$),
  content_en = REPLACE(content_en,
    $oe$Swiss health insurance (LAMal) is mandatory, costs ~300 CHF/month, and typically offers better coverage than French CMU.$oe$,
    $ne$Swiss health insurance (LAMal) is mandatory, costs about 250 to 450 CHF/month depending on age and the deductible you choose, and typically offers better coverage than French CMU.$ne$),
  updated_at = NOW()
WHERE slug = 'living-in-france-working-in-geneva';

-- ─── Fix 7 : Léman Express — réseau (pas une ligne Evian→St-Gervais) + 18 → 20 min ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$Lancé en décembre 2019, le Léman Express a transformé l'accessibilité frontalière. Cette ligne de train reliant Evian à Saint-Gervais en passant par Genève traverse plusieurs communes françaises (Saint-Julien, Etrembières, Annemasse). Le trajet Annemasse-Genève dure 18 minutes, et les tarifs mensuels frontaliers sont subventionnés : compter ~100 EUR/mois pour un abonnement illimité.$o$,
    $n$Lancé en décembre 2019, le Léman Express a transformé l'accessibilité frontalière. Ce réseau de plusieurs lignes (avec, au cœur du dispositif, la ligne CEVA Cornavin–Eaux-Vives–Annemasse) dessert de nombreuses communes françaises (Saint-Julien, Etrembières, Annemasse). Le trajet Annemasse–Genève Cornavin dure environ 20 minutes, et les tarifs mensuels frontaliers sont subventionnés : compter ~100 EUR/mois pour un abonnement illimité.$n$),
  content_en = REPLACE(content_en,
    $oe$Launched December 2019, the Léman Express transformed cross-border accessibility. This train line connecting Evian to Saint-Gervais via Geneva crosses several French communes (Saint-Julien, Etrembières, Annemasse). The Annemasse-Geneva journey takes 18 minutes, and cross-border monthly fares are subsidized: expect ~€100/month for unlimited passes.$oe$,
    $ne$Launched December 2019, the Léman Express transformed cross-border accessibility. This network of several lines (with the CEVA Cornavin–Eaux-Vives–Annemasse line at its core) serves many French communes (Saint-Julien, Etrembières, Annemasse). The Annemasse–Geneva Cornavin journey takes about 20 minutes, and cross-border monthly fares are subsidized: expect ~€100/month for unlimited passes.$ne$),
  updated_at = NOW()
WHERE slug = 'living-in-france-working-in-geneva';

-- ─── Vérification (anciennes formulations = false ; nouvelles = true) ───
SELECT
  slug,
  (content_fr LIKE '%régime français de la fiscalité%') AS fr_vieux_regime,     -- false
  (content_fr LIKE '%200 000 salariés%')                AS fr_vieux_200k,       -- false
  (content_fr LIKE '%dure 18 minutes%')                 AS fr_vieux_18min,      -- false
  (content_fr LIKE '%116 200%')                         AS fr_116200,           -- true
  (content_fr LIKE '%article 25A%')                     AS fr_art25a,           -- true
  (content_en LIKE '%French tax rules, not Swiss%')     AS en_vieux_regime,     -- false
  (content_en LIKE '%200,000 employees%')               AS en_vieux_200k,       -- false
  (content_en LIKE '%116,200%')                         AS en_116200,           -- true
  updated_at
FROM blog_posts
WHERE slug = 'living-in-france-working-in-geneva';
