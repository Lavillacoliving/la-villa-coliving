-- ════════════════════════════════════════════════════════════════════════
-- P3 — NOUVEL ARTICLE : « Déclaration d'impôts frontalier 2026, pas à pas »
-- Date : 2026-06-08  ·  Slug : declaration-impots-frontalier-2026
-- Faits vérifiés (impots.gouv.fr, ge.ch, lesfrontaliers.ch) :
--   déclaration France obligatoire (2042 + 2047) ; crédit d'impôt = impôt
--   français (art. 25A) ; taux 2025 : 1 CHF = 1,07 € ; ouverture en ligne
--   10/04/2026 ; limites ~22 mai / 29 mai / 5 juin 2026 selon département ;
--   quasi-résident : demande DRIS/TOU avant le 31 mars si 90% revenus en CH.
-- Angle PRATIQUE (companion du pilier « fiscalité »), fortement maillé.
-- is_published = TRUE (texte validé). Déploiement assuré par Claude.
-- ════════════════════════════════════════════════════════════════════════

INSERT INTO blog_posts (
  slug, title_fr, title_en, excerpt_fr, excerpt_en,
  meta_description_fr, meta_description_en, content_fr, content_en,
  author, category, image_url, read_time_min, is_published, published_at, tags
) VALUES (
  'declaration-impots-frontalier-2026',
  'Déclaration frontalier 2026 : pas à pas',
  'Cross-Border Tax Return 2026: Step by Step',
  'Frontalier Genève : comment déclarer vos revenus suisses en France en 2026. Formulaires 2042/2047, crédit d''impôt, taux de change, dates, quasi-résident.',
  'Geneva cross-border worker: how to declare your Swiss income in France in 2026. Forms 2042/2047, tax credit, exchange rate, deadlines, quasi-resident.',
  'Déclaration frontalier 2026 pas à pas : formulaires 2047/2042, crédit d''impôt, taux 1 CHF = 1,07 €, dates limites, statut quasi-résident. Le guide pratique.',
  'Cross-border tax return 2026 step by step: forms 2047/2042, tax credit, 1 CHF = 1.07 € rate, deadlines, quasi-resident status. The practical guide.',
  $$Vous êtes frontalier à Genève : votre salaire est imposé à la source en Suisse. Pourtant, chaque printemps, vous devez **aussi** déclarer ces revenus en France. Pas de double imposition, rassurez-vous — juste une formalité à bien remplir. Voici le pas à pas 2026.

## Dois-je vraiment déclarer mes revenus suisses en France ?

Oui, c'est **obligatoire**, même si l'impôt a déjà été prélevé à Genève. En tant que résident français, vous déclarez l'ensemble de vos revenus mondiaux. Concrètement, vos revenus suisses se reportent sur le formulaire **2047** (revenus de source étrangère), puis sur votre déclaration principale **2042**.

## Comment la double imposition est-elle évitée ?

Grâce au mécanisme du **crédit d'impôt** prévu par la convention franco-suisse (article 25A). Pour un frontalier de Genève, vos revenus suisses sont ajoutés à votre base imposable française, **puis un crédit d'impôt égal à l'impôt français** calculé sur ces mêmes revenus vous est accordé. Résultat : ces revenus ne sont pas imposés une seconde fois en France — le crédit neutralise l'impôt.

## Quel taux de change utiliser ?

Pour convertir vos revenus 2025 perçus en francs suisses, le taux officiel à appliquer est **1 CHF = 1,07 €**. Utilisez-le sur votre salaire annuel (tel qu'il figure sur votre certificat de salaire suisse) avant de le reporter sur votre déclaration.

## Quelles sont les dates en 2026 ?

La déclaration en ligne a ouvert le **10 avril 2026** sur impots.gouv.fr. Les dates limites dépendent de votre département : autour du **22 mai, 29 mai ou 5 juin 2026** selon votre zone. Vérifiez la vôtre — un retard entraîne des pénalités.

## Suis-je quasi-résident, et est-ce intéressant ?

Si **au moins 90 % des revenus de votre foyer** sont imposés en Suisse, vous pouvez demander le statut de **quasi-résident** (taxation ordinaire ultérieure, TOU). Il permet de déduire de vrais frais (3e pilier, frais professionnels, intérêts d'emprunt…), comme un résident suisse. Attention au **délai impératif : avant le 31 mars** suivant l'année fiscale, via le formulaire **DRIS/TOU**. Passé cette date, c'est perdu pour l'année.

## Les formulaires à connaître

- **2042** : votre déclaration principale ;
- **2047** : vos revenus de source étrangère (Suisse) ;
- **2042-C** : compléments éventuels ;
- côté quasi-résident : **DRIS/TOU** pour la demande, puis le formulaire de taxation genevois.

## En résumé

- Revenus suisses à déclarer en France : **obligatoire** (2042 + 2047).
- Double imposition évitée par le **crédit d'impôt** (= impôt français, art. 25A).
- Taux de change 2025 : **1 CHF = 1,07 €**.
- Dates 2026 : ouverture **10 avril**, limites **22 mai → 5 juin** selon le département.
- Quasi-résident : demande **avant le 31 mars** (TOU) si 90 % des revenus en Suisse.

Pour le calcul brut → net et le détail du quasi-résident, voir notre [guide de la fiscalité frontalière](/blog/fiscalite-frontalier-geneve-impots-2026).

---

*À lire aussi :*
- [Impôt frontalier Genève 2026 : calcul net](/blog/fiscalite-frontalier-geneve-impots-2026)
- [3e pilier 3a frontalier Genève (2026)](/blog/3e-pilier-frontalier-geneve)
- [Avenant fiscal 40 % frontalier (2026)](/blog/avenant-fiscal-40-frontalier-geneve)$$,
  $$You're a Geneva cross-border worker: your salary is taxed at source in Switzerland. Yet every spring you must **also** declare that income in France. No double taxation, don't worry — just a formality to get right. Here's the 2026 step-by-step.

## Do I really have to declare my Swiss income in France?

Yes, it's **mandatory**, even though tax was already withheld in Geneva. As a French resident, you declare your worldwide income. In practice, your Swiss income goes on form **2047** (foreign-source income), then on your main return **2042**.

## How is double taxation avoided?

Through the **tax-credit** mechanism in the Franco-Swiss treaty (article 25A). For a Geneva cross-border worker, your Swiss income is added to your French tax base, **then a tax credit equal to the French tax** calculated on that same income is granted. The result: that income isn't taxed a second time in France — the credit neutralizes the tax.

## What exchange rate should I use?

To convert your 2025 income earned in Swiss francs, the official rate to apply is **1 CHF = 1.07 €**. Use it on your annual salary (as shown on your Swiss salary certificate) before reporting it on your return.

## What are the 2026 dates?

Online filing opened on **10 April 2026** on impots.gouv.fr. Deadlines depend on your department: around **22 May, 29 May or 5 June 2026** depending on your zone. Check yours — a late filing means penalties.

## Am I a quasi-resident, and is it worth it?

If **at least 90% of your household income** is taxed in Switzerland, you can request **quasi-resident** status (subsequent ordinary taxation, TOU). It lets you deduct real expenses (third pillar, professional costs, loan interest…), like a Swiss resident. Watch the **strict deadline: before 31 March** following the tax year, via the **DRIS/TOU** form. After that, it's lost for the year.

## The forms to know

- **2042**: your main return;
- **2047**: your foreign-source (Swiss) income;
- **2042-C**: any extras;
- quasi-resident side: **DRIS/TOU** for the request, then the Geneva taxation form.

## In short

- Swiss income must be declared in France: **mandatory** (2042 + 2047).
- Double taxation avoided by the **tax credit** (= French tax, art. 25A).
- 2025 exchange rate: **1 CHF = 1.07 €**.
- 2026 dates: opens **10 April**, deadlines **22 May → 5 June** by department.
- Quasi-resident: request **before 31 March** (TOU) if 90% of income is in Switzerland.

For the gross-to-net calculation and quasi-resident detail, see our [cross-border tax guide](/en/blog/fiscalite-frontalier-geneve-impots-2026).

---

*Also read:*
- [Geneva Cross-Border Tax: net pay 2026](/en/blog/fiscalite-frontalier-geneve-impots-2026)
- [Pillar 3a for Cross-Border Workers (2026)](/en/blog/3e-pilier-frontalier-geneve)
- [The 40% Tax Rule: Cross-Border Work 2026](/en/blog/avenant-fiscal-40-frontalier-geneve)$$,
  'La Villa Team', 'tips', '/images/le loft home_cinema.webp', 5, true, NOW(),
  ARRAY['déclaration', 'impôts', 'frontalier', 'genève', '2047', 'quasi-résident', '2026']
);

SELECT slug, title_fr, is_published, LENGTH(content_fr) AS len_fr, LENGTH(content_en) AS len_en,
       LENGTH(title_fr) + LENGTH(' | La Villa Coliving') AS title_total_fr
FROM blog_posts WHERE slug = 'declaration-impots-frontalier-2026';
