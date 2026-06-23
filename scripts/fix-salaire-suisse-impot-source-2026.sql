-- ════════════════════════════════════════════════════════════════════════
-- CORRECTION article salaire-suisse-net-frontalier-2026
-- Date : 2026-06-23
-- Bug : taux impôt à la source sous-estimés (taux marginaux fédéraux
--       confondus avec taux effectifs totaux GE)
-- Sources vérifiées :
--  - lesfrontaliers.ch barème A0 2026
--  - talent.com Genève calculateur 2026 (80k → 25,3% total / 100k → 28,2%)
-- Méthode : REPLACE chirurgicaux sur ancrages précis (pas de réécriture)
-- ════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────
-- FR — Tableau taux impôt source
-- ─────────────────────────────────────────────────────
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  E'| Salaire annuel brut | Taux impôt source effectif |\n|---|---|\n| 60 000 CHF | environ 5 % |\n| 80 000 CHF | environ 7 % |\n| 100 000 CHF | environ 9 % |\n| 130 000 CHF | environ 11 % |\n| 180 000 CHF | environ 14 % |',
  E'| Salaire annuel brut | Taux impôt source effectif |\n|---|---|\n| 60 000 CHF | environ 9 % |\n| 80 000 CHF | environ 14-15 % |\n| 100 000 CHF | environ 17-18 % |\n| 130 000 CHF | environ 20-21 % |\n| 180 000 CHF | environ 22-23 % |'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- FR — Phrase d'intro tableau : ajout précision A0
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  E'Le barème genevois est progressif et varie selon ta situation familiale. Quelques ordres de grandeur 2026 pour un frontalier célibataire sans enfant (catégorie A) :',
  E'Le barème genevois est progressif et varie selon ta situation familiale. Le taux ci-dessous est le taux d''impôt source **effectif total** (fédéral + cantonal + communal) — Genève fait partie des cantons à fiscalité plus élevée. Ordres de grandeur 2026 pour un frontalier célibataire sans enfant (barème A0) :'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- FR — Exemple chiffré 7 000 CHF : continuer le calcul jusqu'au vrai net après impôt
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  E'- **Net avant impôt = 5 957 CHF**\n\nTu pars donc déjà avec **~15 % de prélèvements** avant même de toucher à la fiscalité.',
  E'- **Net avant impôt = 5 957 CHF**\n- Impôt à la source GE (barème A0, ~14,5 %) : 1 015 CHF\n- **Net réel après impôt = 4 942 CHF/mois** (≈ 5 290 EUR au taux 1,07)\n\nTu pars donc déjà avec **~15 % de cotisations sociales** + **~14 % d''impôt à la source** pour un célibataire à ce niveau — soit environ 70 % du brut qui arrive sur ton compte (avant prime LAMal/CMU).'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- FR — Tableau salaire par poste : corriger les nets (étaient sur-évalués)
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  E'| Métiers techniques, employé administratif | 6 000 CHF | 72 000 CHF | ~4 900 CHF |\n| Santé non médicale (infirmier·e, technicien·ne) | 7 500 CHF | 90 000 CHF | ~6 100 CHF |\n| Ingénierie, IT (développeur, data analyst) | 8 500 CHF | 102 000 CHF | ~6 850 CHF |\n| Cadres organisations internationales (OMS, ONU, CICR) | 9 200 CHF | 110 000 CHF | ~7 350 CHF |\n| Banque, finance (analyste, audit, conseil) | 11 000 CHF | 132 000 CHF | ~8 600 CHF |\n| Médecins, professions médicales | 12 500 CHF | 150 000 CHF | ~9 600 CHF |\n| Cadres dirigeants (industries, multinationales) | 16 000 CHF + | 192 000 CHF + | ~12 000 CHF + |',
  E'| Métiers techniques, employé administratif | 6 000 CHF | 72 000 CHF | ~4 400 CHF |\n| Santé non médicale (infirmier·e, technicien·ne) | 7 500 CHF | 90 000 CHF | ~5 300 CHF |\n| Ingénierie, IT (développeur, data analyst) | 8 500 CHF | 102 000 CHF | ~5 950 CHF |\n| Cadres organisations internationales (OMS, ONU, CICR) | 9 200 CHF | 110 000 CHF | ~6 350 CHF |\n| Banque, finance (analyste, audit, conseil) | 11 000 CHF | 132 000 CHF | ~7 400 CHF |\n| Médecins, professions médicales | 12 500 CHF | 150 000 CHF | ~8 200 CHF |\n| Cadres dirigeants (industries, multinationales) | 16 000 CHF + | 192 000 CHF + | ~10 200 CHF + |'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- FR — Phrase intro tableau salaire : préciser que le net inclut impôt source A0
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  E'Voici des médianes 2026 (sources : OFS, Salarium, Glassdoor Genève, ajustements 2025→2026 inflation/marché) — tous postes pour personnes 30-40 ans avec ~5 ans d''expérience, en CDI ETP.',
  E'Voici des médianes 2026 (sources : OFS, Salarium, Glassdoor Genève, ajustements 2025→2026 inflation/marché) — tous postes pour personnes 30-40 ans avec ~5 ans d''expérience, en CDI ETP. Le net mensuel estimé suppose un célibataire sans enfant (catégorie A0), barème GE 2026, hors prime LAMal/CMU.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- FR — FAQ "100 000 CHF" : correction net réel
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  E'**Combien je touche vraiment avec 100 000 CHF brut/an à Genève ?**\nEnviron **6 800 CHF/mois net après prélèvements obligatoires et impôt à la source** (catégorie A, célibataire sans enfant). Soit ~7 250 EUR/mois — avant prime LAMal/CMU.',
  E'**Combien je touche vraiment avec 100 000 CHF brut/an à Genève ?**\nEnviron **5 985 CHF/mois net** après prélèvements obligatoires (~10 %) et impôt à la source GE (~18 %) pour un célibataire sans enfant catégorie A0. Soit ~6 400 EUR/mois au taux 1,07 — avant prime LAMal/CMU. Avec conjoint et enfants (cat. C/H), compte 400 à 700 CHF/mois de plus.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- FR — FAQ "5 000 EUR" : correction fourchette
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  E'**Quel salaire suisse correspond à 5 000 € net en France ?**\nEnviron **7 800 à 8 500 CHF brut/mois** pour un frontalier célibataire catégorie A. Le ratio CHF/EUR (~1,07 mi-2026) et l''impôt à la source jouent en ta faveur.',
  E'**Quel salaire suisse correspond à 5 000 € net en France ?**\nEnviron **8 500 à 9 500 CHF brut/mois** pour un frontalier célibataire catégorie A0 (env. 102-114 000 CHF brut/an). Le ratio CHF/EUR (~1,07 mi-2026) joue en ta faveur, mais le barème impôt source GE est plus élevé qu''on ne le pense souvent.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- FR — Conclusion "En clair" : ajuster fourchette nette
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  E'Le salaire suisse, c''est en moyenne **15 % de prélèvements obligatoires** + **5 à 14 % d''impôt à la source** selon ton niveau et ta situation. Soit **un net entre 70 et 80 % du brut** pour la grande majorité des frontaliers.',
  E'Le salaire suisse, c''est en moyenne **15 % de cotisations sociales obligatoires** + **9 à 23 % d''impôt à la source GE** selon ton niveau et ta situation familiale (barème A0 célibataire le plus chargé). Soit **un net entre 60 et 75 % du brut** pour la majorité des frontaliers.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- FR — Note de fin : ajouter source officielle
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  E'Pour une simulation personnalisée, consulte ton expert-comptable ou la calculatrice officielle [État de Genève](https://www.ge.ch).',
  E'Pour une simulation personnalisée, consulte la [calculette officielle d''impôt à la source ge.ch](https://www.ge.ch/impot-source/calculette-baremes-perception-impot-source) (barèmes 2026 complets téléchargeables) ou ton expert-comptable.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';


-- ─────────────────────────────────────────────────────
-- EN — mêmes corrections
-- ─────────────────────────────────────────────────────

-- EN — Tableau taux impôt source
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  E'| Annual gross salary | Effective source tax rate |\n|---|---|\n| 60,000 CHF | around 5 % |\n| 80,000 CHF | around 7 % |\n| 100,000 CHF | around 9 % |\n| 130,000 CHF | around 11 % |\n| 180,000 CHF | around 14 % |',
  E'| Annual gross salary | Effective source tax rate |\n|---|---|\n| 60,000 CHF | around 9 % |\n| 80,000 CHF | around 14-15 % |\n| 100,000 CHF | around 17-18 % |\n| 130,000 CHF | around 20-21 % |\n| 180,000 CHF | around 22-23 % |'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- EN — Intro tableau
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  E'The Geneva schedule is progressive and depends on your family situation. Some 2026 ballpark figures for a single cross-border worker with no children (category A):',
  E'The Geneva schedule is progressive and depends on your family situation. The rate below is the **total effective source tax** (federal + cantonal + communal) — Geneva sits in the higher-tax bracket among Swiss cantons. 2026 ballpark for a single frontalier with no children (category A0):'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- EN — Exemple 7 000 CHF
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  E'- **Net before tax = 5,957 CHF**\n\nSo you''re already at **~15 % deductions** before any taxation.',
  E'- **Net before tax = 5,957 CHF**\n- Geneva source tax (A0 schedule, ~14.5 %): 1,015 CHF\n- **Real net after tax = 4,942 CHF/month** (≈ 5,290 EUR at 1.07 rate)\n\nSo for a single category-A0 cross-border worker at this level: **~15 % social contributions** + **~14 % source tax** — roughly 70 % of gross lands in your account (before LAMal/CMU premium).'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- EN — Tableau salaire par poste
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  E'| Technical, admin support | 6,000 CHF | 72,000 CHF | ~4,900 CHF |\n| Healthcare (nurse, technician) | 7,500 CHF | 90,000 CHF | ~6,100 CHF |\n| Engineering, IT (developer, data analyst) | 8,500 CHF | 102,000 CHF | ~6,850 CHF |\n| International organisation staff (WHO, UN, ICRC) | 9,200 CHF | 110,000 CHF | ~7,350 CHF |\n| Banking, finance (analyst, audit, advisory) | 11,000 CHF | 132,000 CHF | ~8,600 CHF |\n| Physicians, medical specialists | 12,500 CHF | 150,000 CHF | ~9,600 CHF |\n| Executives (industry, multinationals) | 16,000 CHF + | 192,000 CHF + | ~12,000 CHF + |',
  E'| Technical, admin support | 6,000 CHF | 72,000 CHF | ~4,400 CHF |\n| Healthcare (nurse, technician) | 7,500 CHF | 90,000 CHF | ~5,300 CHF |\n| Engineering, IT (developer, data analyst) | 8,500 CHF | 102,000 CHF | ~5,950 CHF |\n| International organisation staff (WHO, UN, ICRC) | 9,200 CHF | 110,000 CHF | ~6,350 CHF |\n| Banking, finance (analyst, audit, advisory) | 11,000 CHF | 132,000 CHF | ~7,400 CHF |\n| Physicians, medical specialists | 12,500 CHF | 150,000 CHF | ~8,200 CHF |\n| Executives (industry, multinationals) | 16,000 CHF + | 192,000 CHF + | ~10,200 CHF + |'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- EN — Intro tableau salaire
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  E'Here are 2026 medians (sources: OFS, Salarium, Glassdoor Geneva, 2025→2026 inflation/market adjustments) — all roles for ages 30-40 with ~5 years of experience, full-time permanent contract.',
  E'Here are 2026 medians (sources: OFS, Salarium, Glassdoor Geneva, 2025→2026 inflation/market adjustments) — all roles for ages 30-40 with ~5 years of experience, full-time permanent contract. Estimated monthly net assumes single no-children (category A0), Geneva 2026 source tax, excluding LAMal/CMU premium.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- EN — FAQ 100 000 CHF
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  E'**What''s the real net on 100,000 CHF gross/year in Geneva?**\nAbout **6,800 CHF/month net** after mandatory deductions and source tax (category A, single, no dependents). Roughly 7,250 EUR/month — before LAMal/CMU premium.',
  E'**What''s the real net on 100,000 CHF gross/year in Geneva?**\nAbout **5,985 CHF/month net** after mandatory deductions (~10 %) and Geneva source tax (~18 %) for a single category-A0 worker. Roughly 6,400 EUR/month at 1.07 rate — before LAMal/CMU premium. With spouse and children (cat. C/H), add 400 to 700 CHF/month.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- EN — FAQ 5 000 EUR
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  E'**What Swiss salary equals 5,000 € net in France?**\nAround **7,800 to 8,500 CHF gross/month** for a single category-A frontalier. CHF/EUR ratio (~1.07 mid-2026) and source tax both work in your favour.',
  E'**What Swiss salary equals 5,000 € net in France?**\nAround **8,500 to 9,500 CHF gross/month** for a single category-A0 frontalier (102-114k CHF gross/year). CHF/EUR ratio (~1.07 mid-2026) works in your favour, but GE source tax is higher than commonly assumed.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- EN — Conclusion
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  E'Swiss salary: on average **15 % mandatory deductions** + **5-14 % source tax** depending on your level and situation. Net is **70-80 % of gross** for most cross-border workers.',
  E'Swiss salary: on average **15 % mandatory social contributions** + **9-23 % Geneva source tax** depending on your level and family situation (A0 single is the heaviest). Net is **60-75 % of gross** for most cross-border workers.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- EN — Note de fin
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  E'For a personalised simulation, consult your accountant or the official [Canton of Geneva calculator](https://www.ge.ch).',
  E'For a personalised simulation, use the [official Geneva source-tax calculator](https://www.ge.ch/impot-source/calculette-baremes-perception-impot-source) (full 2026 schedules downloadable) or consult your accountant.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- Touch updated_at + republish to bust cache
UPDATE blog_posts SET updated_at = NOW() WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- Vérification finale
SELECT slug, LENGTH(content_fr) AS chars_fr, LENGTH(content_en) AS chars_en,
       (content_fr LIKE '%environ 14-15 %%') AS fix_table_fr_ok,
       (content_en LIKE '%around 14-15 %%') AS fix_table_en_ok,
       (content_fr LIKE '%5 985 CHF/mois net%' OR content_fr LIKE '%5 985 CHF/mois%') AS fix_faq_100k_fr_ok,
       (content_en LIKE '%5,985 CHF/month%') AS fix_faq_100k_en_ok
FROM blog_posts WHERE slug = 'salaire-suisse-net-frontalier-2026';
