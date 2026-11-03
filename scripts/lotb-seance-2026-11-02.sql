-- Seance du lot B du 02/11/2026 (brief "Geneve profils") : retouches B1 a B6 + D-B6b (scripts/lotb-*.edits.mjs, decisions de Jerome du 02/11)
-- et depublication de avenant-fiscal-40-frontalier-geneve (fondu dans le teletravail). SQL 100 % ASCII (U&''), md5 controles avant et apres.
-- A appliquer AVANT la fusion de la PR du lot B (308). Sauvegarde : scripts/backups/lotb-2026-11-02.avant.json ; retour arriere : scripts/backups/lotb-2026-11-02.retour-arriere.sql
BEGIN;
DO $c$
DECLARE bad text;
BEGIN
  SELECT string_agg(e.slug, ', ') INTO bad FROM (VALUES
    ('assurance-sante-frontalier-lamal-cmu-budget','5c5be151cddca9a85625488fc5917566','bacc5e6d42bd65b22a2a8df008c5fbf6','438b842788931cf4c10974ad9f468960'),
    ('avenant-fiscal-40-frontalier-geneve','2035b9c948ce13032b7325205935d1b4','63c6fdb08e443a7fc11f8799baf36173','3e02c2fb2545959dc8d174141fc4d77d'),
    ('budget-colocation-geneve-guide-complet','a113283faf55dd324be34c5e72077793','063a43b101ff9b92ff8bdc08d76fdcd1','db042822292dcf9c811f1de68c0ca419'),
    ('colocation-annemasse-ville-la-grand-ambilly','1b3bb21a11ffcd67968d5957216f2c79','4d6ed401fa2c8880abca609e73d99399','15cb93aa2e8d51b0b31932b0325f1268'),
    ('cout-de-la-vie-suisse-france-frontalier-2026','5d8b72b4035085a15f25759c83b3f45c','8e30b130b882adc768c6f09982beacd6','4e48581c3deccfa0dc357ec5f6f1341e'),
    ('declaration-impots-frontalier-2026','fe183b989e9639a3013a45a15d23dd24','1a02ae64c010b69c646f4e0fa58ba7cf','138f287ba753ca731db82358f7c26ba5'),
    ('fiscalite-frontalier-geneve-impots-2026','a8c0ea70f7dda06689e84b056c341a74','539fae77d432bb546e56b2aebc1f96bc','5f2ff049e5ee1b41947576dd13105a58'),
    ('guide-ressources-frontalier-geneve','c6e2c262a3e38ae25836bacef32a9997','d995d842e638327d4fe857cf141ad99f','89723864ca9b5d50049e0cbc500be58f'),
    ('permis-g-frontalier-geneve','d6411be083b7be76f15b2d0f14ff3154','1e72043f6f629edcf5bd36f07b1eb57a','04f45d83750e40de37273157a0914fed'),
    ('quartiers-annemasse-ou-vivre-selon-profil','3eba893ec8e53672646650880c2999fe','1a78ee4f7420621a30a7bf4f2b7fe52a','831ce1b4c9a08b6a213eb4204b9dd75c'),
    ('teletravail-frontalier-geneve-regles-2026','e68fa492f9d4458f61eef75d16fed414','7121a2900428a4cdaa8283f948070c62','588f7e35b29aaabb51259945949002fa'),
    ('trouver-colocation-geneve-frontalier','c59f7b9a7bebd4b60e542f03ce9e3e1d','cdd385a5e3704ca1279be431056bceaf','e3f14badb2afc028ac88f9dc7cdd1cf4')) AS e(slug, f, en, m)
  LEFT JOIN blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(b.content_fr) <> e.f OR md5(b.content_en) <> e.en OR md5(coalesce(b.title_fr,'') || chr(31) || coalesce(b.title_en,'') || chr(31) || coalesce(b.meta_description_fr,'') || chr(31) || coalesce(b.meta_description_en,'')) <> e.m;
  IF bad IS NOT NULL THEN RAISE EXCEPTION 'etat avant inattendu, rien n''est ecrit : %', bad; END IF;
  IF (SELECT count(*) FROM blog_posts WHERE is_published) <> 43 THEN RAISE EXCEPTION 'nombre d''articles publies <> 43'; END IF;
END $c$;
-- b1
UPDATE blog_posts SET title_fr = replace(title_fr, U&'Co\00FBt de la vie Suisse vs France 2026 : prix r\00E9els et vrai bilan', U&'Co\00FBt de la vie Suisse-France 2026 : prix r\00E9els et salaire \00E0 viser'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
UPDATE blog_posts SET title_en = replace(title_en, U&'Switzerland vs France cost of living 2026', U&'Switzerland vs France cost of living 2026: real prices, salary needed'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
UPDATE blog_posts SET meta_description_fr = replace(meta_description_fr, U&'Prix de la vie en Suisse vs France en 2026 : loyer \00D72-3, courses, restaurants, LAMal vs CMU, transport. Le vrai bilan chiffr\00E9 d''un frontalier de Gen\00E8ve.', U&'Logement \00D72 \00E0 \00D73 \00E0 Gen\00E8ve, courses de base 30 \00E0 40 % moins ch\00E8res en France, LAMal ou CMU : le bilan 2026 du frontalier, et le salaire qui compense.'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
UPDATE blog_posts SET meta_description_en = replace(meta_description_en, U&'Cost of living Switzerland vs France 2026: rent \00D72-3, groceries, dining, LAMal vs CMU, transport. The real numbers for a Geneva cross-border worker.', U&'Housing \00D72 to \00D73 in Geneva, staples 30-40% cheaper in France, LAMal or CMU: the 2026 frontalier balance, and the salary that makes it worth it.'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'## Le vrai score : combien te revient ta vie ?', U&'## Quel salaire genevois compense vraiment le co\00FBt de la vie suisse ? Le cas du c\00E9libataire log\00E9 c\00F4t\00E9 France

Log\00E9 c\00F4t\00E9 France, un c\00E9libataire vit confortablement \00E0 partir d''environ 5 300 CHF net par mois, soit 90 000 CHF brut par an : son logement tout inclus reste sous 30 % de son net, et il lui reste 2 100 \00E0 2 800 CHF une fois les d\00E9penses courantes pay\00E9es. En dessous, \00E7a tient encore, mais la marge fond vite.

Pour le calcul, on a repris les postes de ce guide (courses optimis\00E9es c\00F4t\00E9 France, sant\00E9, abonnement L\00E9man Express, sorties) et le loyer d''une de nos chambres tout inclus c\00F4t\00E9 France, 1 370 \00E0 1 430 CHF par mois charges, fibre et m\00E9nage compris. Total : 2 510 \00E0 3 180 CHF de d\00E9penses par mois. Les salaires nets sont ceux de notre [grille des salaires suisses 2026](/blog/salaire-suisse-net-frontalier-2026), pour une personne seule sans enfant (bar\00E8me A).

| Salaire brut annuel (m\00E9diane du m\00E9tier) | Net mensuel estim\00E9 | Logement tout inclus, en part du net | Reste apr\00E8s d\00E9penses courantes |
|---|---|---|---|
| 72 000 CHF (m\00E9tiers techniques, administratif) | ~4 400 CHF | 31 \00E0 33 % | 1 200 \00E0 1 900 CHF |
| 90 000 CHF (sant\00E9 non m\00E9dicale) | ~5 300 CHF | 26 \00E0 27 % | 2 100 \00E0 2 800 CHF |
| 102 000 CHF (ing\00E9nierie, IT) | ~5 950 CHF | 23 \00E0 24 % | 2 750 \00E0 3 450 CHF |

Le seuil des 30 % est le rep\00E8re classique : au-del\00E0, le logement commence \00E0 rogner sur l''\00E9pargne. Avec une chambre tout inclus, tu passes sous ce seuil \00E0 partir de 4 600 \00E0 4 800 CHF net par mois. Le m\00EAme c\00E9libataire log\00E9 \00E0 Gen\00E8ve, dans un studio \00E0 1 600 \00E0 2 400 CHF hors charges, y consacrerait 30 \00E0 45 % d''un net de 5 300 CHF.

Ce sont des ordres de grandeur : ton net r\00E9el d\00E9pend de ta caisse de pension et de ta situation, et ta fiche de paie fait foi.

## Le vrai score : combien te revient ta vie ?'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
UPDATE blog_posts SET content_en = replace(content_en, U&'## The real score: what does your life cost?', U&'## What Geneva salary really makes up for the Swiss cost of living? A single person living on the French side

Living on the French side, a single person lives comfortably from about CHF 5,300 net a month, or CHF 90,000 gross a year: all-inclusive housing stays under 30% of net pay, and CHF 2,100 to 2,800 is left once everyday costs are paid. Below that it still works, but the margin shrinks fast.

For the maths, we took the items in this guide (groceries bought on the French side, healthcare, a L\00E9man Express pass, going out) and the rent of one of our all-inclusive rooms on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That''s CHF 2,510 to 3,180 of spending a month. Net salaries come from our [2026 Swiss salary grid](/en/blog/salaire-suisse-net-frontalier-2026), for a single person with no children (tax scale A).

| Gross annual salary (median for the role) | Estimated monthly net | All-inclusive housing, share of net | Left after everyday costs |
|---|---|---|---|
| CHF 72,000 (technical, admin) | ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |
| CHF 90,000 (healthcare, non-medical) | ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |
| CHF 102,000 (engineering, IT) | ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |

The 30% line is the usual benchmark: above it, housing starts eating into your savings. With an all-inclusive room, you drop below it from CHF 4,600 to 4,800 net a month. The same person renting a studio in Geneva at CHF 1,600 to 2,400 before bills would spend 30 to 45% of a CHF 5,300 net on it.

These are ballpark figures: your real net depends on your pension fund and your situation, and your payslip has the final word.

## The real score: what does your life cost?'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'- [Quartiers d''Annemasse : o\00F9 vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)', U&'- [Quartiers d''Annemasse : o\00F9 vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [O\00F9 habiter en France quand on travaille \00E0 Gen\00E8ve ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Vivre en France, travailler \00E0 Gen\00E8ve : le guide du frontalier](/blog/living-in-france-working-in-geneva)'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
UPDATE blog_posts SET content_en = replace(content_en, U&'- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)', U&'- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Living in France, working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'*Article mis \00E0 jour 2026-06.', U&'*Article mis \00E0 jour 2026-11.'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
UPDATE blog_posts SET content_en = replace(content_en, U&'*Article updated 2026-06.', U&'*Article updated 2026-11.'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
UPDATE blog_posts SET content_en = replace(content_en, U&'[See available rooms](/en/candidature)', U&'[See available rooms](/en/chambres-disponibles)'), updated_at = now() WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
-- b2
UPDATE blog_posts SET title_fr = replace(title_fr, U&'Budget colocation Gen\00E8ve 2026 : loyers r\00E9els et co\00FBt total', U&'Colocation \00E0 Gen\00E8ve : le vrai budget 2026, tout compris'), updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet';
UPDATE blog_posts SET title_en = replace(title_en, U&'Shared Housing Budget near Geneva: The Real Cost (2026)', U&'Flatshare in Geneva: the real 2026 budget, all costs included'), updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet';
UPDATE blog_posts SET meta_description_fr = replace(meta_description_fr, U&'Combien co\00FBte vraiment une colocation \00E0 Gen\00E8ve en 2026 ? Loyers r\00E9els par ville, studio vs colocation vs coliving, charges cach\00E9es et comment \00E9conomiser.', U&'Une chambre en colocation co\00FBte 1 200 \00E0 1 600 CHF \00E0 Gen\00E8ve centre, bien moins c\00F4t\00E9 France. Loyer, charges, caution, co\00FBt d''entr\00E9e : le vrai budget 2026.'), updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet';
UPDATE blog_posts SET meta_description_en = replace(meta_description_en, U&'What does cross-border housing near Geneva really cost in 2026? Real prices by town, studio vs flatshare vs coliving, hidden costs and savings.', U&'A flatshare room costs CHF 1,200 to 1,600 in central Geneva, far less on the French side. Rent, bills, deposit, move-in costs: the real 2026 budget.'), updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'(voir notre [coloc Gen\00E8ve tout inclus](/colocation-geneve), chambres et prix en CHF)', U&'(voir notre page [colocation \00E0 Gen\00E8ve](/colocation-geneve), c\00F4t\00E9 France et tout inclus, avec chambres et prix en CHF)'), updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet';
UPDATE blog_posts SET content_en = replace(content_en, U&'are turning to **shared housing on the French side** as a smart alternative.', U&'are turning to **shared housing on the French side** as a smart alternative (see our page on [flatshare in Geneva](/en/colocation-geneve), French side and all inclusive, with rooms and prices in CHF).'), updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'- [O\00F9 habiter en France quand on travaille \00E0 Gen\00E8ve ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)', U&'- [O\00F9 habiter en France quand on travaille \00E0 Gen\00E8ve ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Se loger c\00F4t\00E9 France avant d''arriver \00E0 Gen\00E8ve](/blog/trouver-logement-avant-d-arriver-geneve)'), updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet';
UPDATE blog_posts SET content_en = replace(content_en, U&'- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)', U&'- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Find housing in France before you arrive in Geneva](/en/blog/trouver-logement-avant-d-arriver-geneve)'), updated_at = now() WHERE slug = 'budget-colocation-geneve-guide-complet';
UPDATE blog_posts SET content_en = replace(content_en, U&'Finding a colocation near Geneva when you work in Switzerland is a particular journey:', U&'Finding a [flatshare in Geneva](/en/colocation-geneve), or just across the border, when you work in Switzerland is a particular journey:'), updated_at = now() WHERE slug = 'trouver-colocation-geneve-frontalier';
-- b3
UPDATE blog_posts SET title_fr = replace(title_fr, U&'T\00E9l\00E9travail frontalier 2026 : r\00E8gle des 40 %', U&'T\00E9l\00E9travail frontalier 2026 : 40 % fiscal, 49,9 % social'), updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'C''est l''effet de l''[avenant \00E0 la convention fiscale franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve), en vigueur', U&'C''est l''effet de l''[avenant \00E0 la convention fiscale franco-suisse](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), sign\00E9 le 27 juin 2023, en vigueur'), updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
UPDATE blog_posts SET content_en = replace(content_en, U&'This comes from the [amendment to the Franco-Swiss tax treaty](/en/blog/avenant-fiscal-40-frontalier-geneve), in force', U&'This comes from the [amendment to the Franco-Swiss tax treaty](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signed on 27 June 2023, in force'), updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'## L''impact fiscal du t\00E9l\00E9travail', U&'### Que se passe-t-il si je d\00E9passe 40 % ?

Tu deviens imposable en France sur la part de salaire qui correspond \00E0 tes jours de t\00E9l\00E9travail, et ce d\00E8s le premier jour t\00E9l\00E9travaill\00E9, pas seulement au-del\00E0 du seuil ([d\00E9tail officiel \2014 ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). Pour que tu ne paies pas deux fois, la convention franco-suisse applique un cr\00E9dit d''imp\00F4t (article 25A). Ta d\00E9claration se complique, sans plus. Si ton poste t''oblige \00E0 d\00E9passer, fais-toi accompagner par un fiduciaire sp\00E9cialis\00E9 en fiscalit\00E9 transfrontali\00E8re ; les associations de frontaliers tiennent aussi des permanences pour la d\00E9claration d''imp\00F4ts, et on les liste dans [notre guide des ressources du frontalier](/blog/guide-ressources-frontalier-geneve).

### Qu''est-ce que \00E7a change pour ma d\00E9claration ?

Si tu restes sous 40 %, rien par rapport aux ann\00E9es pr\00E9c\00E9dentes : tu d\00E9clares tes revenus en France sur le formulaire 2047, et le cr\00E9dit d''imp\00F4t neutralise l''imp\00F4t d\00E9j\00E0 pr\00E9lev\00E9 en Suisse. La nouveaut\00E9 est c\00F4t\00E9 employeur : depuis le 1er janvier 2026, ton employeur suisse doit suivre tes jours de t\00E9l\00E9travail et de missions hors de Suisse, puis transmettre ton taux annuel \00E0 l''administration fiscale suisse (AFC) d\00E9but 2027. Pour remplir le 2047 sans erreur, suis [notre pas-\00E0-pas de la d\00E9claration 2026](/blog/declaration-impots-frontalier-2026).

## L''impact fiscal du t\00E9l\00E9travail'), updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
UPDATE blog_posts SET content_en = replace(content_en, U&'## The tax impact of remote work', U&'### What happens if I go over 40%?

You become taxable in France on the share of your salary that matches your telework days, from the very first teleworked day, not just beyond the threshold ([official detail \2014 ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). So that you don''t pay twice, the Franco-Swiss treaty applies a tax credit (article 25A). Your tax return gets more involved, nothing worse. If your job means going over, get help from a fiduciary who specialises in cross-border tax; cross-border workers'' associations also run advice sessions on tax returns, and we list them in [our cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).

### What does it change for my tax return?

If you stay under 40%, nothing compared with previous years: you declare your income in France on form 2047, and the tax credit offsets the tax already withheld in Switzerland. What''s new is on the employer''s side: since 1 January 2026, your Swiss employer must track your telework days and assignments outside Switzerland, then report your annual rate to the Swiss tax administration (AFC) in early 2027. To fill in form 2047 without mistakes, follow [our 2026 tax return walkthrough](/en/blog/declaration-impots-frontalier-2026).

## The tax impact of remote work'), updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'- [5 erreurs \00E0 \00E9viter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)', U&'- [5 erreurs \00E0 \00E9viter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)
- [O\00F9 habiter en France quand on t\00E9l\00E9travaille deux jours par semaine](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)'), updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
UPDATE blog_posts SET content_en = replace(content_en, U&'- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)', U&'- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)
- [Where to live in France if you work from home two days a week](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)'), updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'- [Avenant fiscal 40 % frontalier (2026)](/blog/avenant-fiscal-40-frontalier-geneve)', U&'- [T\00E9l\00E9travail frontalier 2026 : 40 % fiscal, 49,9 % social](/blog/teletravail-frontalier-geneve-regles-2026)'), updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';
UPDATE blog_posts SET content_en = replace(content_en, U&'- [The 40% Tax Rule: Cross-Border Work 2026](/en/blog/avenant-fiscal-40-frontalier-geneve)', U&'- [Remote Work for Cross-Border Workers: Rules & Limits 2026](/en/blog/teletravail-frontalier-geneve-regles-2026)'), updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'[le d\00E9cryptage La Villa de l''avenant fiscal](/blog/avenant-fiscal-40-frontalier-geneve)', U&'[notre guide du t\00E9l\00E9travail frontalier](/blog/teletravail-frontalier-geneve-regles-2026)'), updated_at = now() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
UPDATE blog_posts SET content_en = replace(content_en, U&'[La Villa''s breakdown of the tax amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)', U&'[our cross-border remote work guide](/en/blog/teletravail-frontalier-geneve-regles-2026)'), updated_at = now() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'[la d\00E9claration pas \00E0 pas](/blog/declaration-impots-frontalier-2026), [l''avenant fiscal sur le t\00E9l\00E9travail](/blog/avenant-fiscal-40-frontalier-geneve) et [les r\00E8gles 2026 du t\00E9l\00E9travail](/blog/teletravail-frontalier-geneve-regles-2026).', U&'[la d\00E9claration pas \00E0 pas](/blog/declaration-impots-frontalier-2026) et [les r\00E8gles 2026 du t\00E9l\00E9travail, avenant fiscal compris](/blog/teletravail-frontalier-geneve-regles-2026).'), updated_at = now() WHERE slug = 'guide-ressources-frontalier-geneve';
UPDATE blog_posts SET content_en = replace(content_en, U&'> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/blog/declaration-impots-frontalier-2026), [the remote-work tax addendum](/blog/avenant-fiscal-40-frontalier-geneve) and [the 2026 remote-work rules](/blog/teletravail-frontalier-geneve-regles-2026).', U&'> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/en/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/en/blog/declaration-impots-frontalier-2026) and [the 2026 remote-work rules, tax amendment included](/en/blog/teletravail-frontalier-geneve-regles-2026).'), updated_at = now() WHERE slug = 'guide-ressources-frontalier-geneve';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'selon [l''avenant franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve)', U&'selon [l''avenant franco-suisse](/blog/teletravail-frontalier-geneve-regles-2026)'), updated_at = now() WHERE slug = 'permis-g-frontalier-geneve';
UPDATE blog_posts SET content_en = replace(content_en, U&'under [the Franco-Swiss amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)', U&'under [the Franco-Swiss amendment](/en/blog/teletravail-frontalier-geneve-regles-2026)'), updated_at = now() WHERE slug = 'permis-g-frontalier-geneve';
-- b4
UPDATE blog_posts SET title_fr = replace(title_fr, U&'Assurance sant\00E9 frontalier : LAMal ou CMU ? (budget)', U&'Assurance sant\00E9 frontalier : LAMal ou CMU-PUMa ? Co\00FBt 2026'), updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
UPDATE blog_posts SET title_en = replace(title_en, U&'Cross-Border Health Insurance: LAMal or CMU? (Budget)', U&'Cross-border health insurance: LAMal or CMU-PUMa? 2026 costs'), updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'La franchise, elle, est la m\00EAme pour tous : 300 CHF/an.', U&'La franchise, elle, est la m\00EAme pour tous : 300 CHF/an. Pour comparer les caisses, utilise le comparateur officiel de la Conf\00E9d\00E9ration, [priminfo.admin.ch](https://www.priminfo.admin.ch).'), updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'Tu es affili\00E9 \00E0 la CPAM fran\00E7aise et tu cotises en proportion de ton revenu fiscal de r\00E9f\00E9rence.', U&'L''affiliation passe par le Centre national des travailleurs frontaliers en Suisse, g\00E9r\00E9 par l''[URSSAF](https://www.urssaf.fr) ; tes soins rel\00E8vent ensuite de la CPAM de ton d\00E9partement, et tu cotises en proportion de ton revenu fiscal de r\00E9f\00E9rence.'), updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'Compte 30-80 \20AC/mois suppl\00E9mentaires pour une mutuelle qui couvre les d\00E9passements d''honoraires, le dentaire et l''optique.', U&'Compte 30-80 \20AC/mois suppl\00E9mentaires pour une mutuelle qui couvre les d\00E9passements d''honoraires, le dentaire et l''optique.

En couple ou en famille, le calcul change : revenus cumul\00E9s pour la CMU-PUMa, primes par personne pour la LAMal. Fais la simulation \00E0 l''\00E9chelle du foyer, pas seulement pour toi.'), updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'Faites ce calcul AVANT d''arriver.', U&'Fais ce calcul AVANT d''arriver.'), updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
UPDATE blog_posts SET content_en = replace(content_en, U&'The deductible is the same for everyone: 300 CHF/year.', U&'The deductible is the same for everyone: 300 CHF/year. To compare insurers, use the Swiss government''s official comparison tool, [priminfo.admin.ch](https://www.priminfo.admin.ch).'), updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
UPDATE blog_posts SET content_en = replace(content_en, U&'You''re affiliated with the French CPAM and contribute proportionally to your reference tax income.', U&'You join through the national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr); your care then comes under the CPAM of your French d\00E9partement, and you contribute in proportion to your reference tax income.'), updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
UPDATE blog_posts SET content_en = replace(content_en, U&'Count 30-80 \20AC/month extra for coverage of specialist surcharges, dental, and optical care.', U&'Count 30-80 \20AC/month extra for coverage of specialist surcharges, dental, and optical care.

As a couple or a family, the maths changes: pooled income for CMU-PUMa, one premium per person for LAMal. Run the numbers for the whole household, not just for yourself.'), updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'## Comment marche la LAMal (assurance suisse)

C''est l''option par d\00E9faut. Tu choisis un **assureur suisse** (Helsana, CSS, Swica, Groupe Mutuel\2026) et tu paies une **prime mensuelle** ; la **franchise est fixe pour les frontaliers : 300 CHF/an**, sans franchise \00E0 option contrairement aux r\00E9sidents suisses. Trois caract\00E9ristiques \00E0 comprendre :

- La prime varie selon **l''\00E2ge, le canton et la franchise choisie**, mais **pas selon ton salaire** : que tu gagnes 4 000 ou 12 000 CHF, c''est le m\00EAme montant. C''est ce qui la rend imbattable sur les hauts revenus.
- Apr\00E8s la franchise, une **[quote-part de 10 %](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** s''applique sur les frais, plafonn\00E9e \00E0 **700 CHF/an** : ton reste \00E0 charge annuel est donc born\00E9.
- La LAMal couvre les soins **en Suisse et en France** (avec la carte europ\00E9enne d''assurance maladie) et te donne acc\00E8s aux m\00E9decins suisses **sans m\00E9decin traitant** \2014 un confort r\00E9el si tu te soignes c\00F4t\00E9 suisse.

C\00F4t\00E9 \00E9volution des prix : les primes LAMal ont **historiquement augment\00E9 de 5 \00E0 10 % par an** (avec un pic \00E0 +16,6 % en 2024). Bonne nouvelle, **2026 est une ann\00E9e quasi blanche pour les frontaliers**, la hausse restant tr\00E8s contenue. Mais garde un \0153il sur l''horizon : une **r\00E9forme du m\00E9canisme de compensation des risques, qui pourrait rench\00E9rir les primes des assur\00E9s frontaliers, est attendue pour 2028** \2014 un point \00E0 anticiper dans un choix qui t''engage sur la dur\00E9e. Pour comparer les caisses, utilise le **comparateur officiel de la Conf\00E9d\00E9ration, [priminfo.admin.ch](https://www.priminfo.admin.ch)** \2014 il \00E9vite de te fier aux arguments commerciaux d''un seul assureur.

## Comment marche la CMU-PUMa (couverture fran\00E7aise)

Si tu exerces ton droit d''option dans les 3 mois, tu rejoins le r\00E9gime fran\00E7ais. L''affiliation passe par le **Centre national des travailleurs frontaliers en Suisse, g\00E9r\00E9 par l''[URSSAF](https://www.urssaf.fr)** ; tes soins rel\00E8vent ensuite de la **CPAM** de ton d\00E9partement. Ici, pas de prime mais une **cotisation d''environ 8 % de ton revenu fiscal de r\00E9f\00E9rence** (apr\00E8s abattement). Concr\00E8tement, pour un salaire brut de l''ordre de 70 000 CHF/an, la cotisation se situe autour de **330 \20AC/mois** ; elle grimpe pour les hauts salaires et descend pour les revenus modestes.

Deux contreparties : la couverture est surtout **c\00F4t\00E9 France**, et tu dois respecter un **parcours de soins coordonn\00E9** (d\00E9clarer un m\00E9decin traitant). L''avantage d\00E9cisif : **pas de franchise \00E0 avancer**, et une cotisation qui **n''augmente que si ton salaire augmente** \2014 pas de hausse annuelle subie comme en LAMal.

## LAMal ou CMU : le comparatif

| Crit\00E8re | LAMal (suisse) | CMU-PUMa (fran\00E7aise) |
|---|---|---|
| Base du co\00FBt | \00C2ge, canton, franchise \2014 **ind\00E9pendant du salaire** | **~8 % du revenu fiscal de r\00E9f\00E9rence** |
| Franchise | 300 CHF/an (fixe) + quote-part 10 % (max 700 CHF/an) | Pas de franchise \00E0 avancer |
| \00C9volution | Historiquement +5 \00E0 10 %/an ; **quasi stable en 2026**, r\00E9forme attendue en 2028 | Augmente seulement si le salaire augmente |
| Acc\00E8s aux soins | M\00E9decins suisses en direct, couvre Suisse + France | Parcours coordonn\00E9, m\00E9decin traitant en France |
| Le mieux pour\2026 | Hauts salaires (prime fixe) | Salaires modestes (< ~65 000 CHF brut/an) |

\00C0 titre indicatif, selon les ordres de grandeur relev\00E9s d\00E9but 2026 pour un frontalier de 25-35 ans, voici comment les deux options se croisent selon le salaire. **Note bien la logique du tableau : la prime LAMal ne bouge pas avec ton salaire** (elle d\00E9pend de ton \00E2ge, de ton canton et de ta franchise) \2014 c''est la cotisation CMU, elle, qui grimpe avec le revenu. C''est tout le c\0153ur de l''arbitrage.

| Salaire brut annuel | Prime LAMal (jeune adulte)* | Cotisation CMU-PUMa | Option qui ressort |
|---|---|---|---|
| 50 000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65 000 CHF | ~280 CHF | ~300 CHF | \00C9quivalent |
| 80 000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100 000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120 000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\\*Prime forfaitaire, **ind\00E9pendante du salaire** : elle varie selon l''\00E2ge et la caisse. La valeur de ~280 CHF correspond \00E0 un adulte de 25-35 ans chez une caisse comp\00E9titive ; les offres les moins ch\00E8res d\00E9marrent autour de 200 CHF. La franchise, elle, est fixe pour les frontaliers (300 CHF/an), avec une quote-part de 10 % plafonn\00E9e \00E0 700 CHF/an. Ordres de grandeur indicatifs, hors situation individuelle.*

## La r\00E8gle simple, et le r\00E9flexe \00E0 prendre

**En dessous d''environ 65 000 CHF brut/an, la CMU est souvent plus avantageuse** (cotisation proportionnelle, pas de franchise) ; au-dessus, la prime fixe de la LAMal prend l''avantage et l''\00E9cart se creuse avec le salaire. Mais le prix n''est pas tout : si tu te soignes surtout c\00F4t\00E9 suisse, la libert\00E9 d''acc\00E8s de la LAMal peut justifier quelques francs de plus.

Dans les deux cas, pr\00E9vois une **mutuelle compl\00E9mentaire (30 \00E0 80 \20AC/mois)** pour le dentaire, l''optique et les d\00E9passements d''honoraires. Et pense \00E0 un point souvent oubli\00E9 : en **couple ou en famille**, le calcul change (revenus cumul\00E9s pour la CMU, primes par personne pour la LAMal) \2014 fais la simulation \00E0 l''\00E9chelle du foyer, pas seulement individuelle. Avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le **GTE** (voir le chapitre Ressources) et les **courtiers frontaliers** d''Annemasse ou Saint-Julien proposent des simulations personnalis\00E9es, souvent gratuites.

> **Pour aller plus loin :** [LAMal ou CMU : le comparatif budget du frontalier](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec des profils chiffr\00E9s.', U&'## LAMal ou CMU-PUMa : la r\00E8gle simple

**En dessous d''environ 65 000 CHF brut par an, la CMU-PUMa est souvent plus avantageuse** : sa cotisation, environ 8 % de ton revenu fiscal de r\00E9f\00E9rence, suit ton salaire. Au-dessus, la prime de la LAMal, fixe quel que soit ton salaire, prend l''avantage, et l''\00E9cart se creuse avec le revenu. Le prix n''est pas tout : la LAMal donne acc\00E8s aux m\00E9decins suisses sans m\00E9decin traitant, la CMU-PUMa passe par un parcours de soins coordonn\00E9 c\00F4t\00E9 France. Dans les deux cas, pr\00E9vois une mutuelle compl\00E9mentaire (30 \00E0 80 \20AC par mois). En couple ou en famille, fais la simulation \00E0 l''\00E9chelle du foyer ; avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026). Le GTE (voir le chapitre Ressources) et les courtiers frontaliers d''Annemasse ou Saint-Julien proposent des simulations personnalis\00E9es, souvent gratuites.

> **Pour aller plus loin :** [le comparatif complet LAMal ou CMU-PUMa](/blog/assurance-sante-frontalier-lamal-cmu-budget), avec les co\00FBts 2026 selon ton salaire et des profils chiffr\00E9s.'), updated_at = now() WHERE slug = 'guide-ressources-frontalier-geneve';
UPDATE blog_posts SET content_en = replace(content_en, U&'## How LAMal works (Swiss insurance)

It is the default option. You pick a **Swiss insurer** (Helsana, CSS, Swica, Groupe Mutuel\2026) and pay a **monthly premium**; the **deductible is fixed for cross-border workers: 300 CHF/year**, with no optional higher deductibles, unlike Swiss residents. Three things to understand:

- The premium varies with **age, canton and chosen deductible**, but **not with your salary**: whether you earn 4,000 or 12,000 CHF, it is the same amount. That is what makes it unbeatable on high incomes.
- After the deductible, a **[10% co-payment](https://www.bag.admin.ch/fr/assurance-maladie-primes-et-participation-aux-couts)** applies, capped at **700 CHF/year**: your annual out-of-pocket is bounded.
- LAMal covers care **in Switzerland and in France** (with the European health insurance card) and gives direct access to Swiss doctors **without a referring GP**.

On price evolution: LAMal premiums have **historically risen 5 to 10% per year** (with a peak of +16.6% in 2024). The good news: **2026 is a near-flat year for cross-border workers**, with a very contained increase. But keep an eye on the horizon: a **reform of the risk-compensation mechanism, which could raise premiums for cross-border policyholders, is expected for 2028** \2014 worth anticipating in a choice that commits you for the long run. To compare insurers, use the **official federal comparator, [priminfo.admin.ch](https://www.priminfo.admin.ch)**.

## How CMU-PUMa works (French cover)

If you exercise your option within 3 months, you join the French system. Affiliation goes through the **national centre for cross-border workers in Switzerland, run by [URSSAF](https://www.urssaf.fr)**; your care then falls under your local **CPAM**. Here, no premium but a **contribution of about 8% of your reference tax income** (after an allowance). For a gross salary around 70,000 CHF/year, that is roughly **\20AC330/month**; it rises for high salaries and falls for modest incomes.

Two trade-offs: cover is mainly **on the French side**, and you must follow a **coordinated care pathway** (declare a referring GP). The decisive upside: **no deductible to advance**, and a contribution that **rises only if your salary rises** \2014 no annual increase imposed as with LAMal.

## LAMal vs CMU: the comparison

| Criterion | LAMal (Swiss) | CMU-PUMa (French) |
|---|---|---|
| Cost basis | Age, canton, deductible \2014 **independent of salary** | **~8% of reference tax income** |
| Deductible | Fixed 300 CHF/year + 10% co-pay (max 700 CHF/year) | No deductible to advance |
| Evolution | Historically +5 to 10%/year; **nearly stable in 2026**, reform expected in 2028 | Rises only if salary rises |
| Care access | Swiss doctors directly, covers CH + FR | Coordinated pathway, GP in France |
| Best for\2026 | High salaries (fixed premium) | Modest salaries (< ~65,000 CHF gross/year) |

By orders of magnitude observed in early 2026 for a 25-35-year-old, here is how the two cross over depending on salary. **Note the table''s logic: the LAMal premium does not move with your salary** (it depends on your age, canton and deductible) \2014 it is the CMU contribution that climbs with income. That is the very heart of the trade-off.

| Gross annual salary | LAMal premium (young adult)* | CMU-PUMa contribution | Option that stands out |
|---|---|---|---|
| 50,000 CHF | ~280 CHF | ~210 CHF | CMU |
| 65,000 CHF | ~280 CHF | ~300 CHF | Tie |
| 80,000 CHF | ~280 CHF | ~400 CHF | LAMal |
| 100,000 CHF | ~280 CHF | ~530 CHF | LAMal |
| 120,000 CHF | ~280 CHF | ~650 CHF | LAMal |

*\\*Flat premium, **independent of salary**: it varies with age and insurer. The ~280 CHF figure corresponds to a 25-35-year-old at a competitive insurer; the cheapest offers start around 200 CHF. The deductible is fixed for cross-border workers (300 CHF/year), with a 10% co-pay capped at 700 CHF/year. Indicative orders of magnitude, individual situations vary.*

## The simple rule, and the reflex to build

**Below about 65,000 CHF gross/year, CMU is often more favourable** (proportional contribution, no deductible); above, LAMal''s fixed premium wins and the gap widens with salary. But price is not everything: if you mostly see Swiss doctors, LAMal''s freedom of access can justify a few francs more.

In both cases, plan for a **top-up (\20AC30 to \20AC80/month)** for dental, optical and fee overruns. And mind an often-forgotten point: as a **couple or family**, the calculation changes (pooled income for CMU, per-person premiums for LAMal) \2014 simulate at household level, not just individually. With children, also see [La Villa''s family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The **GTE** (see the Resources chapter) and the **cross-border brokers** in Annemasse or Saint-Julien offer personalised, often free, simulations.

> **Go further:** [LAMal or CMU: the cross-border budget comparison](/blog/assurance-sante-frontalier-lamal-cmu-budget), with worked profiles.', U&'## LAMal or CMU-PUMa: the simple rule

**Below about CHF 65,000 gross a year, CMU-PUMa is often the better deal**: its contribution, about 8% of your reference taxable income, follows your salary. Above that, the LAMal premium, the same whatever you earn, takes the lead, and the gap widens as your income grows. Price isn''t everything: LAMal gives you direct access to Swiss doctors without a GP referral, while CMU-PUMa goes through a coordinated care pathway on the French side. Either way, plan for a top-up policy ("mutuelle", \20AC30 to \20AC80 a month). As a couple or a family, run the numbers for the whole household; with children, also see [La Villa''s family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). The GTE (see the Resources chapter) and the cross-border brokers in Annemasse or Saint-Julien offer personalised simulations, often free.

> **Go further:** [the full LAMal or CMU-PUMa comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget), with 2026 costs by salary and worked profiles.'), updated_at = now() WHERE slug = 'guide-ressources-frontalier-geneve';
-- b5
UPDATE blog_posts SET content_fr = replace(content_fr, U&'Chercher une colocation pr\00E8s de Gen\00E8ve c''est un jeu de chasse.', U&'Chercher une [colocation \00E0 Annemasse](/annemasse-colocation) ou ailleurs pr\00E8s de Gen\00E8ve, c''est un jeu de chasse.'), updated_at = now() WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly';
UPDATE blog_posts SET content_en = replace(content_en, U&'Looking for a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly, just across the border from Geneva?', U&'Looking for a room in a [flatshare in Annemasse](/en/annemasse-colocation), Ville-la-Grand or Ambilly, just across the border from Geneva?'), updated_at = now() WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly';
-- b6
UPDATE blog_posts SET content_fr = replace(content_fr, U&'## Quels quartiers \00E9viter, selon ton profil

Pas de \00AB mauvais quartier \00BB \00E0 Annemasse \2014 mais des secteurs qui collent mal \00E0 certains besoins :', U&'## Y a-t-il des quartiers \00E0 \00E9viter \00E0 Annemasse ?

Pas au sens d''un quartier \00E0 fuir : ce qui change ton quotidien \00E0 Annemasse, c''est la distance \00E0 une gare ou \00E0 un arr\00EAt de tram, et le bruit des grands axes. Voici les secteurs qui collent mal \00E0 certains besoins :'), updated_at = now() WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil';
UPDATE blog_posts SET content_en = replace(content_en, U&'## Which areas to avoid, by profile

No "bad neighbourhood" in Annemasse \2014 but areas that fit certain needs poorly:', U&'## Are there areas to avoid in Annemasse?

Not in the sense of a place to steer clear of: what shapes your daily life in Annemasse is the distance to a station or a tram stop, and the noise of the main roads. These are the areas that fit some needs poorly:'), updated_at = now() WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil';
-- b6-gaillard
UPDATE blog_posts SET content_fr = replace(content_fr, U&'**O\00F9 viser :** **Ambilly** et **Gaillard**. Depuis l\00E0,', U&'**O\00F9 viser :** **Ambilly**, c\00F4t\00E9 Moillesulaz. Depuis l\00E0,'), updated_at = now() WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil';
UPDATE blog_posts SET content_en = replace(content_en, U&'**Where to aim:** **Ambilly** and **Gaillard**. From there,', U&'**Where to aim:** **Ambilly**, on the Moillesulaz side. From there,'), updated_at = now() WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'**Ambilly** ou **Gaillard**, pr\00E8s du poste-fronti\00E8re de Moillesulaz :', U&'**Ambilly**, pr\00E8s du poste-fronti\00E8re de Moillesulaz :'), updated_at = now() WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil';
UPDATE blog_posts SET content_en = replace(content_en, U&'**Ambilly** or **Gaillard**, near the Moillesulaz crossing:', U&'**Ambilly**, near the Moillesulaz crossing:'), updated_at = now() WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil';
-- B3 : l'avenant est fondu dans le teletravail (308 dans vercel.json, PR du lot B)
UPDATE blog_posts SET is_published = false, updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve' AND is_published;
DO $c$
DECLARE bad text;
BEGIN
  SELECT string_agg(e.slug, ', ') INTO bad FROM (VALUES
    ('assurance-sante-frontalier-lamal-cmu-budget','d147ed0ecdc39c2d07dd756c0d6291ad','386f43387127f902613a42642f7cb63d','e063f4789051e982936d47b2bc5df8e6'),
    ('avenant-fiscal-40-frontalier-geneve','2035b9c948ce13032b7325205935d1b4','63c6fdb08e443a7fc11f8799baf36173','3e02c2fb2545959dc8d174141fc4d77d'),
    ('budget-colocation-geneve-guide-complet','a2b18c88763d64c85e2e335d828e8517','ab564b21ced4e0829609e3aa53a0d18b','fefd86990d76081da449a028c3f2522c'),
    ('colocation-annemasse-ville-la-grand-ambilly','7b569876cb65f0c4cafb40ba072929c3','63614d51731f084c0e4ed3478ce083f3','15cb93aa2e8d51b0b31932b0325f1268'),
    ('cout-de-la-vie-suisse-france-frontalier-2026','8d4385c6edcbe50e0891b7af760b3941','978ee5a0cf807441af5701897f40848e','10a867ea52747206611c31c72564e5b0'),
    ('declaration-impots-frontalier-2026','6099e8552d694f7672cf27457f10e481','127c3bebbd4a936498bb4b3c4f913d0c','138f287ba753ca731db82358f7c26ba5'),
    ('fiscalite-frontalier-geneve-impots-2026','949fbc874b257a7ad1ca9d9d76ed2722','7addcb4ac6725edbded357d21d7aaa3d','5f2ff049e5ee1b41947576dd13105a58'),
    ('guide-ressources-frontalier-geneve','f22317c127cffd50c4191a11fc8d7e2e','c309ed450a3111d86e23f920a79e7bd2','89723864ca9b5d50049e0cbc500be58f'),
    ('permis-g-frontalier-geneve','8b15099f1ec6d8d7e50704b38c8f45dd','dab11bae0ad2a97b3d2d73a4ad81a034','04f45d83750e40de37273157a0914fed'),
    ('quartiers-annemasse-ou-vivre-selon-profil','5e815f47cb1f22711d77c88b0ab45537','50479bd14de043ce0c2ee6cc73f6b859','831ce1b4c9a08b6a213eb4204b9dd75c'),
    ('teletravail-frontalier-geneve-regles-2026','fe6fe3246180cb5c6c4ac2e23db7256d','80441ad5d8c996d3999c7acab2861a83','53cded9f58a922c4cecb7bc6eda41e61'),
    ('trouver-colocation-geneve-frontalier','c59f7b9a7bebd4b60e542f03ce9e3e1d','8b1bf472971eebff579b91f9707c9ffd','e3f14badb2afc028ac88f9dc7cdd1cf4')) AS e(slug, f, en, m)
  LEFT JOIN blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(b.content_fr) <> e.f OR md5(b.content_en) <> e.en OR md5(coalesce(b.title_fr,'') || chr(31) || coalesce(b.title_en,'') || chr(31) || coalesce(b.meta_description_fr,'') || chr(31) || coalesce(b.meta_description_en,'')) <> e.m;
  IF bad IS NOT NULL THEN RAISE EXCEPTION 'md5 inattendu apres, rien n''est ecrit : %', bad; END IF;
  IF (SELECT is_published FROM blog_posts WHERE slug = 'avenant-fiscal-40-frontalier-geneve') IS NOT FALSE THEN RAISE EXCEPTION 'avenant encore publie'; END IF;
  IF (SELECT count(*) FROM blog_posts WHERE is_published) <> 42 THEN RAISE EXCEPTION 'nombre d''articles publies <> 42'; END IF;
  IF EXISTS (SELECT 1 FROM blog_posts WHERE is_published AND (content_fr LIKE '%/blog/avenant-fiscal-40-frontalier-geneve)%' OR content_en LIKE '%/blog/avenant-fiscal-40-frontalier-geneve)%'))
    THEN RAISE EXCEPTION 'lien restant vers l''avenant'; END IF;
END $c$;
COMMIT;
