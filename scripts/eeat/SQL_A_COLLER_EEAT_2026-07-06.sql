-- ============================================================
-- E-E-A-T 2026-07-06 -- 16 articles YMYL
-- 1) Auteur nomme (Jerome Austin) ; 2) marqueurs d'experience.
-- 68 marqueurs, ancres verifiees uniques contre la base.
-- SQL 100% ASCII (E'\uXXXX') -- coller tel quel dans Supabase.
-- ============================================================

-- 1) Signature auteur nommee sur les 16 articles YMYL
UPDATE blog_posts SET author = 'Jerome Austin' WHERE slug IN (
  'fiscalite-frontalier-geneve-impots-2026',
  'declaration-impots-frontalier-2026',
  'salaire-suisse-net-frontalier-2026',
  'avenant-fiscal-40-frontalier-geneve',
  'teletravail-frontalier-geneve-regles-2026',
  'permis-g-frontalier-geneve',
  'allocations-familiales-frontalier-geneve-2026',
  '3e-pilier-frontalier-geneve',
  'assurance-sante-frontalier-lamal-cmu-budget',
  'guide-ressources-frontalier-geneve',
  'cout-de-la-vie-suisse-france-frontalier-2026',
  'cout-transport-frontalier-geneve-2026',
  'budget-colocation-geneve-guide-complet',
  'dossier-location-frontalier-suisse-france',
  'banque-telephone-internet-frontalier-bons-plans',
  'arnaques-logement-frontalier-geneve-eviter'
);

-- 2) Marqueurs d'experience (retour de terrain, zero changement factuel)
-- fiscalite-frontalier-geneve-impots-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'En pratique, si vous n''avez que des revenus suisses et aucun revenu fran\u00e7ais, votre imp\u00f4t fran\u00e7ais est g\u00e9n\u00e9ralement nul ou tr\u00e8s faible.', E'En pratique \u2014 et on le v\u00e9rifie chaque ann\u00e9e sur les dossiers de nos r\u00e9sidents \u2014, si vous n''avez que des revenus suisses et aucun revenu fran\u00e7ais, votre imp\u00f4t fran\u00e7ais est g\u00e9n\u00e9ralement nul ou tr\u00e8s faible.'), updated_at = NOW() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';

-- fiscalite-frontalier-geneve-impots-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'In practice, if you only have Swiss income and no French income, your French tax is generally zero or very low.', E'In practice \u2014 and we see it every year on our residents'' files \u2014 if you only have Swiss income and no French income, your French tax is generally zero or very low.'), updated_at = NOW() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';

-- fiscalite-frontalier-geneve-impots-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'aupr\u00e8s de l''administration fiscale genevoise, et c''est souvent pertinent de se faire accompagner par un fiduciaire.', E'aupr\u00e8s de l''administration fiscale genevoise \u2014 une d\u00e9marche que beaucoup de nos r\u00e9sidents d\u00e9couvrent \u00e0 l''emm\u00e9nagement \u2014, et c''est souvent pertinent de se faire accompagner par un fiduciaire.'), updated_at = NOW() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';

-- fiscalite-frontalier-geneve-impots-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'to the Geneva tax administration, and it''s often worth getting help from a fiduciary.', E'to the Geneva tax administration \u2014 a step many of our residents only discover when they move in \u2014 and it''s often worth getting help from a fiduciary.'), updated_at = NOW() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';

-- declaration-impots-frontalier-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Oui, c''est **obligatoire**, m\u00eame si l''imp\u00f4t a d\u00e9j\u00e0 \u00e9t\u00e9 pr\u00e9lev\u00e9 \u00e0 Gen\u00e8ve.', E'Oui, c''est **obligatoire**, m\u00eame si l''imp\u00f4t a d\u00e9j\u00e0 \u00e9t\u00e9 pr\u00e9lev\u00e9 \u00e0 Gen\u00e8ve \u2014 c''est la question qu''on nous pose le plus \u00e0 l''emm\u00e9nagement, et la r\u00e9ponse ne change pas.'), updated_at = NOW() WHERE slug = 'declaration-impots-frontalier-2026';

-- declaration-impots-frontalier-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Yes, it''s **mandatory**, even though tax was already withheld in Geneva.', E'Yes, it''s **mandatory**, even though tax was already withheld in Geneva \u2014 it''s the question our residents ask us most often at move-in, and the answer never changes.'), updated_at = NOW() WHERE slug = 'declaration-impots-frontalier-2026';

-- declaration-impots-frontalier-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Pass\u00e9 cette date, c''est perdu pour l''ann\u00e9e.', E'Pass\u00e9 cette date, c''est perdu pour l''ann\u00e9e \u2014 c''est l''\u00e9ch\u00e9ance qu''on rappelle chaque ann\u00e9e \u00e0 nos r\u00e9sidents concern\u00e9s.'), updated_at = NOW() WHERE slug = 'declaration-impots-frontalier-2026';

-- declaration-impots-frontalier-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'After that, it''s lost for the year.', E'After that, it''s lost for the year \u2014 it''s the deadline we flag to our residents every year.'), updated_at = NOW() WHERE slug = 'declaration-impots-frontalier-2026';

-- salaire-suisse-net-frontalier-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'En Suisse comme en France, le salaire brut affich\u00e9 sur ton contrat n''est pas ce que tu touches sur ton compte.', E'En Suisse comme en France, le salaire brut affich\u00e9 sur ton contrat n''est pas ce que tu touches sur ton compte \u2014 c''est le premier point qu''on clarifie avec nos r\u00e9sidents qui commencent un poste \u00e0 Gen\u00e8ve.'), updated_at = NOW() WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- salaire-suisse-net-frontalier-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Just like in France, the gross figure on your Swiss contract is not what hits your account.', E'Just like in France, the gross figure on your Swiss contract is not what hits your account \u2014 the first thing we clarify with our residents starting a job in Geneva.'), updated_at = NOW() WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- salaire-suisse-net-frontalier-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'vivre \u00e0 Annemasse plut\u00f4t qu''\u00e0 Gen\u00e8ve centre te fait \u00e9conomiser **800 \u00e0 1 800 CHF/mois** sur ton loyer \u2014 soit 9 600 \u00e0 21 600 CHF/an.', E'vivre \u00e0 Annemasse plut\u00f4t qu''\u00e0 Gen\u00e8ve centre te fait \u00e9conomiser **800 \u00e0 1 800 CHF/mois** sur ton loyer \u2014 soit 9 600 \u00e0 21 600 CHF/an. C''est tr\u00e8s exactement l''arbitrage que font nos r\u00e9sidents, on le vit avec eux au quotidien.'), updated_at = NOW() WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- salaire-suisse-net-frontalier-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'living in Annemasse rather than central Geneva saves **800 to 1,800 CHF/month** in rent \u2014 9,600 to 21,600 CHF/year.', E'living in Annemasse rather than central Geneva saves **800 to 1,800 CHF/month** in rent \u2014 9,600 to 21,600 CHF/year. This is exactly the trade-off our residents make, and we live it with them daily.'), updated_at = NOW() WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- avenant-fiscal-40-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Le plus simple reste de rester sous le seuil ; si votre activit\u00e9 l''impose, faites-vous accompagner par un fiduciaire sp\u00e9cialis\u00e9 en fiscalit\u00e9 transfrontali\u00e8re.', E'Le plus simple reste de rester sous le seuil \u2014 c''est ce qu''on conseille \u00e0 nos r\u00e9sidents dans ce cas ; si votre activit\u00e9 l''impose, faites-vous accompagner par un fiduciaire sp\u00e9cialis\u00e9 en fiscalit\u00e9 transfrontali\u00e8re.'), updated_at = NOW() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- avenant-fiscal-40-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'The simplest approach is to stay under the threshold; if your job requires more, get help from a fiduciary specializing in cross-border taxation.', E'The simplest approach is to stay under the threshold \u2014 the advice we give our residents in this situation; if your job requires more, get help from a fiduciary specializing in cross-border taxation.'), updated_at = NOW() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- avenant-fiscal-40-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'sont d\u00e9sormais pleinement compatibles avec votre statut fiscal **et** social suisse.', E'sont d\u00e9sormais pleinement compatibles avec votre statut fiscal **et** social suisse \u2014 on le vit chaque semaine avec nos r\u00e9sidents qui t\u00e9l\u00e9travaillent.'), updated_at = NOW() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- avenant-fiscal-40-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'are now fully compatible with both your Swiss tax **and** social-security status.', E'are now fully compatible with both your Swiss tax **and** social-security status \u2014 something we see every week with our residents who work from home.'), updated_at = NOW() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- teletravail-frontalier-geneve-regles-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Le conseil pragmatique : restez sous 40 % (fiscal) et sous 49,9 % (social) pour profiter du t\u00e9l\u00e9travail sans aucune complication.', E'Le conseil pragmatique \u2014 celui qu''on donne \u00e0 nos r\u00e9sidents qui t\u00e9l\u00e9travaillent : restez sous 40 % (fiscal) et sous 49,9 % (social) pour profiter du t\u00e9l\u00e9travail sans aucune complication.'), updated_at = NOW() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';

-- teletravail-frontalier-geneve-regles-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Pragmatic advice: stay under 40% (tax) and under 49.9% (social) to enjoy remote work without any complications.', E'Pragmatic advice \u2014 the same we give our remote-working residents: stay under 40% (tax) and under 49.9% (social) to enjoy remote work without any complications.'), updated_at = NOW() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';

-- teletravail-frontalier-geneve-regles-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Concr\u00e8tement, sur une semaine de 5 jours, **2 jours de t\u00e9l\u00e9travail (40 %) sont compatibles** avec le maintien de votre fiscalit\u00e9 ET de votre couverture sociale suisses.', E'Concr\u00e8tement, sur une semaine de 5 jours, **2 jours de t\u00e9l\u00e9travail (40 %) sont compatibles** avec le maintien de votre fiscalit\u00e9 ET de votre couverture sociale suisses \u2014 c''est d''ailleurs le rythme qu''on observe le plus souvent chez nos r\u00e9sidents qui t\u00e9l\u00e9travaillent.'), updated_at = NOW() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';

-- teletravail-frontalier-geneve-regles-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Concretely, in a 5-day week, **2 days of remote work (40%) are compatible** with keeping both your Swiss taxation AND your Swiss social coverage.', E'Concretely, in a 5-day week, **2 days of remote work (40%) are compatible** with keeping both your Swiss taxation AND your Swiss social coverage \u2014 it''s also the rhythm we see most often among our residents who work remotely.'), updated_at = NOW() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';

-- permis-g-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Comptez en moyenne **environ 3 mois (12 semaines)** pour la d\u00e9livrance du permis \u2014 vous pouvez toutefois commencer \u00e0 travailler d\u00e8s l''envoi de votre dossier complet.', E'Comptez en moyenne **environ 3 mois (12 semaines)** pour la d\u00e9livrance du permis \u2014 vous pouvez toutefois commencer \u00e0 travailler d\u00e8s l''envoi de votre dossier complet. C''est le point sur lequel on rassure le plus souvent nos r\u00e9sidents \u00e0 l''emm\u00e9nagement : le d\u00e9lai impressionne, mais il ne retarde pas la prise de poste.'), updated_at = NOW() WHERE slug = 'permis-g-frontalier-geneve';

-- permis-g-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Expect **about 3 months (12 weeks) on average** for the permit to be issued \u2014 though you can start working as soon as your complete file is submitted.', E'Expect **about 3 months (12 weeks) on average** for the permit to be issued \u2014 though you can start working as soon as your complete file is submitted. It''s the point we most often reassure our residents about at move-in: the timeline looks long, but it doesn''t delay your start date.'), updated_at = NOW() WHERE slug = 'permis-g-frontalier-geneve';

-- permis-g-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Anticipez : lancez la d\u00e9marche d\u00e8s r\u00e9ception du courrier pour \u00e9viter tout trou de validit\u00e9.', E'Anticipez : lancez la d\u00e9marche d\u00e8s r\u00e9ception du courrier pour \u00e9viter tout trou de validit\u00e9 \u2014 c''est le rappel qu''on fait chaque ann\u00e9e \u00e0 nos r\u00e9sidents dont le permis arrive \u00e0 \u00e9ch\u00e9ance.'), updated_at = NOW() WHERE slug = 'permis-g-frontalier-geneve';

-- permis-g-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Plan ahead: start as soon as you get the letter to avoid any gap in validity.', E'Plan ahead: start as soon as you get the letter to avoid any gap in validity \u2014 it''s the reminder we give our residents every year when their permit comes up for renewal.'), updated_at = NOW() WHERE slug = 'permis-g-frontalier-geneve';

-- allocations-familiales-frontalier-geneve-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'**Ouvre d''abord tes droits en France** aupr\u00e8s de la **CAF de Haute-Savoie** (m\u00eame si la Suisse sera prioritaire \u2014 c''est la porte d''entr\u00e9e du syst\u00e8me).', E'**Ouvre d''abord tes droits en France** aupr\u00e8s de la **CAF de Haute-Savoie** (m\u00eame si la Suisse sera prioritaire \u2014 c''est la porte d''entr\u00e9e du syst\u00e8me). Contre-intuitif, mais c''est le point qu''on se retrouve \u00e0 r\u00e9expliquer le plus souvent aux frontaliers qu''on accompagne.'), updated_at = NOW() WHERE slug = 'allocations-familiales-frontalier-geneve-2026';

-- allocations-familiales-frontalier-geneve-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'**Open your rights in France first** with the **CAF of Haute-Savoie** (even if Switzerland will be priority \u2014 it''s the entry point).', E'**Open your rights in France first** with the **CAF of Haute-Savoie** (even if Switzerland will be priority \u2014 it''s the entry point). Counter-intuitive, but it''s the step we find ourselves re-explaining most often to the frontaliers we support.'), updated_at = NOW() WHERE slug = 'allocations-familiales-frontalier-geneve-2026';

-- allocations-familiales-frontalier-geneve-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Garde une copie de tout : contrat de travail suisse, acte de naissance, attestation de non-versement ou de versement de l''autre caisse. C''est le nerf de la guerre pour d\u00e9bloquer un dossier.', E'Garde une copie de tout : contrat de travail suisse, acte de naissance, attestation de non-versement ou de versement de l''autre caisse. C''est le nerf de la guerre pour d\u00e9bloquer un dossier \u2014 on le constate r\u00e9guli\u00e8rement en accompagnant nos r\u00e9sidents dans leurs d\u00e9marches : la pi\u00e8ce manquante est presque toujours ce qui bloque.'), updated_at = NOW() WHERE slug = 'allocations-familiales-frontalier-geneve-2026';

-- allocations-familiales-frontalier-geneve-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Keep copies of everything: Swiss work contract, birth certificate, proof of (non-)payment from the other fund.', E'Keep copies of everything: Swiss work contract, birth certificate, proof of (non-)payment from the other fund. We see it regularly when helping our residents with their paperwork: a missing document is almost always what holds a file up.'), updated_at = NOW() WHERE slug = 'allocations-familiales-frontalier-geneve-2026';

-- 3e-pilier-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Sans ce statut, si vous \u00eates uniquement impos\u00e9 \u00e0 la source, votre versement 3a **ne r\u00e9duit pas votre imp\u00f4t suisse** \u2014 il garde alors uniquement son int\u00e9r\u00eat \u00ab \u00e9pargne retraite \u00bb.', E'Sans ce statut, si vous \u00eates uniquement impos\u00e9 \u00e0 la source, votre versement 3a **ne r\u00e9duit pas votre imp\u00f4t suisse** \u2014 il garde alors uniquement son int\u00e9r\u00eat \u00ab \u00e9pargne retraite \u00bb. C''est le point qu''on v\u00e9rifie en premier avec nos r\u00e9sidents qui envisagent un 3a : quasi-r\u00e9sident ou pas, tout part de l\u00e0.'), updated_at = NOW() WHERE slug = '3e-pilier-frontalier-geneve';

-- 3e-pilier-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Without that status, if you''re taxed only at source, your 3a contribution **does not reduce your Swiss tax** \u2014 it then keeps only its "retirement savings" value.', E'Without that status, if you''re taxed only at source, your 3a contribution **does not reduce your Swiss tax** \u2014 it then keeps only its "retirement savings" value. It''s the first thing we check with our residents considering a 3a: quasi-resident or not, everything follows from that.'), updated_at = NOW() WHERE slug = '3e-pilier-frontalier-geneve';

-- 3e-pilier-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Dans tous les cas, faites le point sur votre statut avant de vous engager.', E'Dans tous les cas, faites le point sur votre statut avant de vous engager \u2014 c''est ce qu''on conseille syst\u00e9matiquement \u00e0 nos r\u00e9sidents avant toute ouverture de 3a.'), updated_at = NOW() WHERE slug = '3e-pilier-frontalier-geneve';

-- 3e-pilier-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Either way, check your status before committing.', E'Either way, check your status before committing \u2014 it''s what we systematically advise our residents before opening any 3a.'), updated_at = NOW() WHERE slug = '3e-pilier-frontalier-geneve';

-- assurance-sante-frontalier-lamal-cmu-budget (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Le droit d''option est irr\u00e9versible en pratique. Vous avez 3 mois apr\u00e8s le d\u00e9but de votre contrat suisse pour choisir.', E'Le droit d''option est irr\u00e9versible en pratique \u2014 c''est le point sur lequel on alerte chaque nouveau r\u00e9sident d\u00e8s l''emm\u00e9nagement. Vous avez 3 mois apr\u00e8s le d\u00e9but de votre contrat suisse pour choisir.'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'The right of option is practically irreversible. You have 3 months after your Swiss contract starts to choose.', E'The right of option is practically irreversible \u2014 it''s the point we flag to every new resident at move-in. You have 3 months after your Swiss contract starts to choose.'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Faites ce calcul AVANT d''arriver. Beaucoup de frontaliers d\u00e9couvrent la question de l''assurance sant\u00e9 apr\u00e8s avoir sign\u00e9 leur bail, et regrettent de ne pas avoir optimis\u00e9 plus t\u00f4t.', E'Faites ce calcul AVANT d''arriver. On le vit chaque ann\u00e9e avec nos r\u00e9sidents : beaucoup de frontaliers d\u00e9couvrent la question de l''assurance sant\u00e9 apr\u00e8s avoir sign\u00e9 leur bail, et regrettent de ne pas avoir optimis\u00e9 plus t\u00f4t.'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- assurance-sante-frontalier-lamal-cmu-budget (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Do this calculation BEFORE arriving. Many cross-border workers discover the health insurance question after signing their lease and regret not optimizing earlier.', E'Do this calculation BEFORE arriving. We see it every year with our residents: many cross-border workers discover the health insurance question after signing their lease and regret not optimizing earlier.'), updated_at = NOW() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';

-- guide-ressources-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'L''irr\u00e9versibilit\u00e9 est le point que beaucoup sous-estiment : une fois la CMU choisie, on ne revient pas facilement \u00e0 la LAMal. D''o\u00f9 l''importance de chiffrer les deux **avant** de d\u00e9cider, id\u00e9alement avant m\u00eame d''arriver.', E'L''irr\u00e9versibilit\u00e9 est le point que beaucoup sous-estiment : une fois la CMU choisie, on ne revient pas facilement \u00e0 la LAMal. C''est la question qu''on nous pose le plus \u00e0 l''emm\u00e9nagement \u2014 d''o\u00f9 l''importance de chiffrer les deux **avant** de d\u00e9cider, id\u00e9alement avant m\u00eame d''arriver.'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'The irreversibility is what many underestimate: once CMU is chosen, you do not easily return to LAMal. Hence the importance of costing both **before** deciding, ideally before you even arrive.', E'The irreversibility is what many underestimate: once CMU is chosen, you do not easily return to LAMal. It is the question we get asked most at move-in \u2014 hence the importance of costing both **before** deciding, ideally before you even arrive.'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'et la demande doit \u00eatre d\u00e9pos\u00e9e **chaque ann\u00e9e, avant le 31 mars** ; pass\u00e9 cette date, c''est perdu pour l''ann\u00e9e.', E'et la demande doit \u00eatre d\u00e9pos\u00e9e **chaque ann\u00e9e, avant le 31 mars** \u2014 une \u00e9ch\u00e9ance qu''on rappelle chaque printemps \u00e0 nos r\u00e9sidents ; pass\u00e9 cette date, c''est perdu pour l''ann\u00e9e.'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- guide-ressources-frontalier-geneve (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'and the request must be filed **every year, before 31 March**; after that, it is lost for the year.', E'and the request must be filed **every year, before 31 March** \u2014 a deadline we remind our residents of every spring; after that, it is lost for the year.'), updated_at = NOW() WHERE slug = 'guide-ressources-frontalier-geneve';

-- cout-de-la-vie-suisse-france-frontalier-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'**La strat\u00e9gie 50/50 qui marche :** gros des courses non p\u00e9rissables c\u00f4t\u00e9 France', E'**La strat\u00e9gie 50/50 qui marche \u2014 celle qu''on voit s''installer naturellement chez nos r\u00e9sidents :** gros des courses non p\u00e9rissables c\u00f4t\u00e9 France'), updated_at = NOW() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';

-- cout-de-la-vie-suisse-france-frontalier-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'**The 50/50 strategy that works:** bulk non-perishables on the French side', E'**The 50/50 strategy that works \u2014 the one we see our residents settle into naturally:** bulk non-perishables on the French side'), updated_at = NOW() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';

-- cout-de-la-vie-suisse-france-frontalier-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Le choix est structurant et difficilement r\u00e9versible \u2014 on le d\u00e9taille dans notre [comparatif LAMal vs CMU pour frontalier](/blog/assurance-sante-frontalier-lamal-cmu-budget).', E'Le choix est structurant et difficilement r\u00e9versible \u2014 c''est l''un des sujets sur lesquels on accompagne le plus nos r\u00e9sidents \u00e0 l''arriv\u00e9e, et on le d\u00e9taille dans notre [comparatif LAMal vs CMU pour frontalier](/blog/assurance-sante-frontalier-lamal-cmu-budget).'), updated_at = NOW() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';

-- cout-de-la-vie-suisse-france-frontalier-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'The choice is structural and hard to reverse \u2014 detailed in our [LAMal vs CMU comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget).', E'The choice is structural and hard to reverse \u2014 it''s one of the topics we help our residents with most on arrival, detailed in our [LAMal vs CMU comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget).'), updated_at = NOW() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';

-- cout-transport-frontalier-geneve-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Certaines entreprises suisses remboursent partiellement ou totalement l''abonnement de transport. Renseignez-vous aupr\u00e8s de votre RH', E'Certaines entreprises suisses remboursent partiellement ou totalement l''abonnement de transport \u2014 c''est l''un des premiers r\u00e9flexes qu''on conseille \u00e0 nos r\u00e9sidents \u00e0 l''arriv\u00e9e. Renseignez-vous aupr\u00e8s de votre RH'), updated_at = NOW() WHERE slug = 'cout-transport-frontalier-geneve-2026';

-- cout-transport-frontalier-geneve-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Some Swiss companies partially or fully reimburse transport passes. Check with your HR', E'Some Swiss companies partially or fully reimburse transport passes \u2014 it''s one of the first reflexes we suggest to our residents on arrival. Check with your HR'), updated_at = NOW() WHERE slug = 'cout-transport-frontalier-geneve-2026';

-- cout-transport-frontalier-geneve-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'Le coliving facilite le covoiturage naturellement : quand 10-12 personnes vivent dans la m\u00eame maison et travaillent dans la m\u00eame ville, les combinaisons se cr\u00e9ent d''elles-m\u00eames.', E'Le coliving facilite le covoiturage naturellement \u2014 on le constate au quotidien dans nos maisons : quand 10-12 personnes vivent dans la m\u00eame maison et travaillent dans la m\u00eame ville, les combinaisons se cr\u00e9ent d''elles-m\u00eames.'), updated_at = NOW() WHERE slug = 'cout-transport-frontalier-geneve-2026';

-- cout-transport-frontalier-geneve-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Coliving naturally facilitates carpooling: when 10-12 people live in the same house and work in the same city, combinations create themselves.', E'Coliving naturally facilitates carpooling \u2014 we see it every day in our houses: when 10-12 people live in the same house and work in the same city, combinations create themselves.'), updated_at = NOW() WHERE slug = 'cout-transport-frontalier-geneve-2026';

-- budget-colocation-geneve-guide-complet (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'**Exemple concret** : un loyer affich\u00e9 \u00e0 750 \u20ac/mois devient facilement **1 050 \u20ac/mois** une fois toutes les charges ajout\u00e9es. C''est 40% de plus que le chiffre de l''annonce.', E'**Exemple concret** : un loyer affich\u00e9 \u00e0 750 \u20ac/mois devient facilement **1 050 \u20ac/mois** une fois toutes les charges ajout\u00e9es. C''est 40% de plus que le chiffre de l''annonce \u2014 et c''est exactement ce que nos r\u00e9sidents nous racontent de leur ancien logement quand ils arrivent chez nous.'), updated_at = NOW() WHERE slug = 'budget-colocation-geneve-guide-complet';

-- budget-colocation-geneve-guide-complet (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'En coliving, la logique est diff\u00e9rente : les chambres se lib\u00e8rent ponctuellement toute l''ann\u00e9e, donc la meilleure strat\u00e9gie est de candidater d\u00e8s maintenant pour figurer sur la liste d''attente.', E'En coliving, la logique est diff\u00e9rente : les chambres se lib\u00e8rent ponctuellement toute l''ann\u00e9e \u2014 on le voit sur les candidatures qu''on re\u00e7oit chaque mois \u2014, donc la meilleure strat\u00e9gie est de candidater d\u00e8s maintenant pour figurer sur la liste d''attente.'), updated_at = NOW() WHERE slug = 'budget-colocation-geneve-guide-complet';

-- budget-colocation-geneve-guide-complet (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'**Real example:** a listed rent of 750 \u20ac/month easily becomes **1,050 \u20ac/month** once all charges are added. That''s 40% more than the ad price.', E'**Real example:** a listed rent of 750 \u20ac/month easily becomes **1,050 \u20ac/month** once all charges are added. That''s 40% more than the ad price \u2014 and it''s exactly what our residents tell us about their previous housing when they move in.'), updated_at = NOW() WHERE slug = 'budget-colocation-geneve-guide-complet';

-- budget-colocation-geneve-guide-complet (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'In coliving the logic is different: rooms free up throughout the year, so the best strategy is to apply now to get on the waiting list.', E'In coliving the logic is different: rooms free up throughout the year \u2014 we see it in the applications we receive every month \u2014 so the best strategy is to apply now to get on the waiting list.'), updated_at = NOW() WHERE slug = 'budget-colocation-geneve-guide-complet';

-- dossier-location-frontalier-suisse-france (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'C''est le document que la plupart des frontaliers oublient, et c''est celui qui fait pencher la balance.', E'C''est le document que la plupart des frontaliers oublient \u2014 on le constate sur les dossiers qu''on voit passer chaque mois \u2014 et c''est celui qui fait pencher la balance.'), updated_at = NOW() WHERE slug = 'dossier-location-frontalier-suisse-france';

-- dossier-location-frontalier-suisse-france (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'**Envoyer un dossier incomplet** : un dossier avec des pi\u00e8ces manquantes est \u00e9limin\u00e9 imm\u00e9diatement. Mieux vaut envoyer un jour plus tard qu''un dossier b\u00e2cl\u00e9.', E'**Envoyer un dossier incomplet** : un dossier avec des pi\u00e8ces manquantes est \u00e9limin\u00e9 imm\u00e9diatement \u2014 on le voit sur les candidatures qu''on re\u00e7oit, un dossier complet passe toujours devant. Mieux vaut envoyer un jour plus tard qu''un dossier b\u00e2cl\u00e9.'), updated_at = NOW() WHERE slug = 'dossier-location-frontalier-suisse-france';

-- dossier-location-frontalier-suisse-france (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'This is the document most cross-border workers forget, and it''s the one that tips the balance.', E'This is the document most cross-border workers forget \u2014 we see it in the application files that come through every month \u2014 and it''s the one that tips the balance.'), updated_at = NOW() WHERE slug = 'dossier-location-frontalier-suisse-france';

-- dossier-location-frontalier-suisse-france (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'**Sending an incomplete file**: an application with missing documents is eliminated immediately. Better to send a day later than a rushed file.', E'**Sending an incomplete file**: an application with missing documents is eliminated immediately \u2014 we see it in the applications we receive: a complete file always comes out ahead. Better to send a day later than a rushed file.'), updated_at = NOW() WHERE slug = 'dossier-location-frontalier-suisse-france';

-- banque-telephone-internet-frontalier-bons-plans (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'**R\u00e8gle d''or** : ne faites JAMAIS de change via votre banque traditionnelle. Utilisez Wise ou Revolut. L''\u00e9conomie sur un an repr\u00e9sente facilement 1 000 \u00e0 1 500 \u20ac.', E'**R\u00e8gle d''or** : ne faites JAMAIS de change via votre banque traditionnelle. Utilisez Wise ou Revolut. L''\u00e9conomie sur un an repr\u00e9sente facilement 1 000 \u00e0 1 500 \u20ac \u2014 c''est le premier conseil qu''on donne \u00e0 nos r\u00e9sidents \u00e0 l''emm\u00e9nagement.'), updated_at = NOW() WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';

-- banque-telephone-internet-frontalier-bons-plans (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'C''est l''option la plus populaire chez les frontaliers. 35 Go en Suisse suffisent largement', E'C''est l''option la plus populaire chez les frontaliers \u2014 et de loin la plus courante chez nos r\u00e9sidents aussi. 35 Go en Suisse suffisent largement'), updated_at = NOW() WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';

-- banque-telephone-internet-frontalier-bons-plans (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'**Golden rule**: NEVER do currency exchange through your traditional bank. Use Wise or Revolut. The savings over a year easily represent \u20ac1,000-1,500.', E'**Golden rule**: NEVER do currency exchange through your traditional bank. Use Wise or Revolut. The savings over a year easily represent \u20ac1,000-1,500 \u2014 it''s the first tip we give our residents when they move in.'), updated_at = NOW() WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';

-- banque-telephone-internet-frontalier-bons-plans (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'This is the most popular option among cross-border workers. 35 GB in Switzerland is more than enough', E'This is the most popular option among cross-border workers \u2014 and by far the most common one among our residents too. 35 GB in Switzerland is more than enough'), updated_at = NOW() WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';

-- arnaques-logement-frontalier-geneve-eviter (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'C''est la r\u00e8gle d''or : **ne versez jamais un centime avant d''avoir visit\u00e9 le logement ET v\u00e9rifi\u00e9 l''identit\u00e9 du propri\u00e9taire**.', E'C''est la r\u00e8gle d''or \u2014 celle qu''on r\u00e9p\u00e8te \u00e0 chaque candidat qui nous raconte sa recherche : **ne versez jamais un centime avant d''avoir visit\u00e9 le logement ET v\u00e9rifi\u00e9 l''identit\u00e9 du propri\u00e9taire**.'), updated_at = NOW() WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';

-- arnaques-logement-frontalier-geneve-eviter (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'La demande est tr\u00e8s forte pr\u00e8s de Gen\u00e8ve : comptez g\u00e9n\u00e9ralement entre **deux et quatre mois** pour trouver un logement qui correspond \u00e0 vos crit\u00e8res et \u00e0 votre budget.', E'La demande est tr\u00e8s forte pr\u00e8s de Gen\u00e8ve : comptez g\u00e9n\u00e9ralement entre **deux et quatre mois** pour trouver un logement qui correspond \u00e0 vos crit\u00e8res et \u00e0 votre budget \u2014 c''est ce que nos r\u00e9sidents nous racontent le plus souvent de leur recherche avant d''arriver chez nous.'), updated_at = NOW() WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';

-- arnaques-logement-frontalier-geneve-eviter (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'This is the golden rule: **never pay a single cent before visiting the property AND verifying the owner''s identity**.', E'This is the golden rule \u2014 the one we repeat to every applicant who tells us about their search: **never pay a single cent before visiting the property AND verifying the owner''s identity**.'), updated_at = NOW() WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';

-- arnaques-logement-frontalier-geneve-eviter (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'Demand is very high near Geneva: it generally takes **two to four months** to find housing that matches your criteria and budget.', E'Demand is very high near Geneva: it generally takes **two to four months** to find housing that matches your criteria and budget \u2014 it''s what our residents most often tell us about their search before joining us.'), updated_at = NOW() WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';

-- salaire-suisse-net-frontalier-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'le plafond 2026 est de **7 056 CHF/an**', E'le plafond 2026 est de **7 258 CHF/an**'), updated_at = NOW() WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- salaire-suisse-net-frontalier-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'the 2026 cap is **7,056 CHF/year**', E'the 2026 cap is **7,258 CHF/year**'), updated_at = NOW() WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- salaire-suisse-net-frontalier-2026 (content_fr)
UPDATE blog_posts SET content_fr = REPLACE(content_fr, E'La convention franco-suisse de 1966 (et son avenant de 2022)', E'La convention franco-suisse de 1966 (modifi\u00e9e en dernier lieu en 2023)'), updated_at = NOW() WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- salaire-suisse-net-frontalier-2026 (content_en)
UPDATE blog_posts SET content_en = REPLACE(content_en, E'The Franco-Swiss convention (1966, updated 2022)', E'The Franco-Swiss convention (1966, last updated 2023)'), updated_at = NOW() WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- 3) Correctif affichage : 18 apostrophes doublees ('' -> ') dans la version EN
--    de salaire-suisse (artefact d'echappement SQL visible en prod : "you''re", "It''s"...)
UPDATE blog_posts SET content_en = REPLACE(content_en, '''''', ''''), updated_at = NOW()
WHERE slug = 'salaire-suisse-net-frontalier-2026';
