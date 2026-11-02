-- ============================================================================
-- B3 fusion avenant → télétravail : sous-sections, titre FR, liens repointés
-- Généré le 2026-11-02T14:08:31.848Z par scripts/build-slots-sql.mjs depuis scripts/lotb-b3.edits.mjs
--   · chaînes relevées sur la base vivante le 02/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-02T14:08:31.846Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Après validation du diff par Jérôme (D-B0), dans la séance du lot B.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 — ne pas normaliser les espaces.
-- 15 modifications · 5 articles · état en base à la génération (updated_at · longueur fr / en) :
--   declaration-impots-frontalier-2026 · 2026-10-13T15:32:15.797408+00:00 · 5496 / 5030
--   fiscalite-frontalier-geneve-impots-2026 · 2026-10-13T15:33:01.979749+00:00 · 10712 / 10056
--   guide-ressources-frontalier-geneve · 2026-11-02T12:54:15.442979+00:00 · 45053 / 41246
--   permis-g-frontalier-geneve · 2026-10-30T17:15:30.671729+00:00 · 6150 / 5792
--   teletravail-frontalier-geneve-regles-2026 · 2026-10-13T15:39:32.874791+00:00 · 10091 / 9298
-- ============================================================================

BEGIN;

-- [1/15] teletravail-frontalier-geneve-regles-2026 (fr, title_fr) · B3 · titre FR (version courte validée le 30/10) ; titre EN inchangé (position 5,5)
UPDATE blog_posts
SET title_fr = replace(title_fr, $f$Télétravail frontalier 2026 : règle des 40 %$f$, $r$Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$Télétravail frontalier 2026 : règle des 40 %$f$ IN title_fr) > 0
  AND position($r$Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social$r$ IN title_fr) = 0;

-- [2/15] teletravail-frontalier-geneve-regles-2026 (fr) · B3 · le lien vers l'avenant (fondu ici) devient la source officielle ge.ch, avec la date de signature
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve), en vigueur$f$, $r$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signé le 27 juin 2023, en vigueur$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve), en vigueur$f$ IN content_fr) > 0
  AND position($r$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signé le 27 juin 2023, en vigueur$r$ IN content_fr) = 0;

-- [3/15] teletravail-frontalier-geneve-regles-2026 (en) · B3 · the link to the merged amendment article becomes the official ge.ch source, with the signing date
UPDATE blog_posts
SET content_en = replace(content_en, $f$This comes from the [amendment to the Franco-Swiss tax treaty](/en/blog/avenant-fiscal-40-frontalier-geneve), in force$f$, $r$This comes from the [amendment to the Franco-Swiss tax treaty](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signed on 27 June 2023, in force$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$This comes from the [amendment to the Franco-Swiss tax treaty](/en/blog/avenant-fiscal-40-frontalier-geneve), in force$f$ IN content_en) > 0
  AND position($r$This comes from the [amendment to the Franco-Swiss tax treaty](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signed on 27 June 2023, in force$r$ IN content_en) = 0;

-- [4/15] teletravail-frontalier-geneve-regles-2026 (fr) · B3 · deux sous-sections reprises de l'avenant, sous « Les deux seuils 2026 » (« fiscal et social » y est déjà : pas de troisième)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## L'impact fiscal du télétravail$f$, $r$### Que se passe-t-il si je dépasse 40 % ?

Tu deviens imposable en France sur la part de salaire qui correspond à tes jours de télétravail, et ce dès le premier jour télétravaillé, pas seulement au-delà du seuil ([détail officiel — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). Pour que tu ne paies pas deux fois, la convention franco-suisse applique un crédit d'impôt (article 25A). Ta déclaration se complique, sans plus. Si ton poste t'oblige à dépasser, fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière ; les associations de frontaliers tiennent aussi des permanences pour la déclaration d'impôts, et on les liste dans [notre guide des ressources du frontalier](/blog/guide-ressources-frontalier-geneve).

### Qu'est-ce que ça change pour ma déclaration ?

Si tu restes sous 40 %, rien par rapport aux années précédentes : tu déclares tes revenus en France sur le formulaire 2047, et le crédit d'impôt neutralise l'impôt déjà prélevé en Suisse. La nouveauté est côté employeur : depuis le 1er janvier 2026, ton employeur suisse doit suivre tes jours de télétravail et de missions hors de Suisse, puis transmettre ton taux annuel à l'administration fiscale suisse (AFC) début 2027. Pour remplir le 2047 sans erreur, suis [notre pas-à-pas de la déclaration 2026](/blog/declaration-impots-frontalier-2026).

## L'impact fiscal du télétravail$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$## L'impact fiscal du télétravail$f$ IN content_fr) > 0
  AND position($r$### Que se passe-t-il si je dépasse 40 % ?

Tu deviens imposable en France sur la part de salaire qui correspond à tes jours de télétravail, et ce dès le premier jour télétravaillé, pas seulement au-delà du seuil ([détail officiel — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). Pour que tu ne paies pas deux fois, la convention franco-suisse applique un crédit d'impôt (article 25A). Ta déclaration se complique, sans plus. Si ton poste t'oblige à dépasser, fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière ; les associations de frontaliers tiennent aussi des permanences pour la déclaration d'impôts, et on les liste dans [notre guide des ressources du frontalier](/blog/guide-ressources-frontalier-geneve).

### Qu'est-ce que ça change pour ma déclaration ?

Si tu restes sous 40 %, rien par rapport aux années précédentes : tu déclares tes revenus en France sur le formulaire 2047, et le crédit d'impôt neutralise l'impôt déjà prélevé en Suisse. La nouveauté est côté employeur : depuis le 1er janvier 2026, ton employeur suisse doit suivre tes jours de télétravail et de missions hors de Suisse, puis transmettre ton taux annuel à l'administration fiscale suisse (AFC) début 2027. Pour remplir le 2047 sans erreur, suis [notre pas-à-pas de la déclaration 2026](/blog/declaration-impots-frontalier-2026).

## L'impact fiscal du télétravail$r$ IN content_fr) = 0;

-- [5/15] teletravail-frontalier-geneve-regles-2026 (en) · B3 · two subsections from the amendment article, under "The two 2026 thresholds" ("tax vs social" already there)
UPDATE blog_posts
SET content_en = replace(content_en, $f$## The tax impact of remote work$f$, $r$### What happens if I go over 40%?

You become taxable in France on the share of your salary that matches your telework days, from the very first teleworked day, not just beyond the threshold ([official detail — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). So that you don't pay twice, the Franco-Swiss treaty applies a tax credit (article 25A). Your tax return gets more involved, nothing worse. If your job means going over, get help from a fiduciary who specialises in cross-border tax; cross-border workers' associations also run advice sessions on tax returns, and we list them in [our cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).

### What does it change for my tax return?

If you stay under 40%, nothing compared with previous years: you declare your income in France on form 2047, and the tax credit offsets the tax already withheld in Switzerland. What's new is on the employer's side: since 1 January 2026, your Swiss employer must track your telework days and assignments outside Switzerland, then report your annual rate to the Swiss tax administration (AFC) in early 2027. To fill in form 2047 without mistakes, follow [our 2026 tax return walkthrough](/en/blog/declaration-impots-frontalier-2026).

## The tax impact of remote work$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$## The tax impact of remote work$f$ IN content_en) > 0
  AND position($r$### What happens if I go over 40%?

You become taxable in France on the share of your salary that matches your telework days, from the very first teleworked day, not just beyond the threshold ([official detail — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). So that you don't pay twice, the Franco-Swiss treaty applies a tax credit (article 25A). Your tax return gets more involved, nothing worse. If your job means going over, get help from a fiduciary who specialises in cross-border tax; cross-border workers' associations also run advice sessions on tax returns, and we list them in [our cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).

### What does it change for my tax return?

If you stay under 40%, nothing compared with previous years: you declare your income in France on form 2047, and the tax credit offsets the tax already withheld in Switzerland. What's new is on the employer's side: since 1 January 2026, your Swiss employer must track your telework days and assignments outside Switzerland, then report your annual rate to the Swiss tax administration (AFC) in early 2027. To fill in form 2047 without mistakes, follow [our 2026 tax return walkthrough](/en/blog/declaration-impots-frontalier-2026).

## The tax impact of remote work$r$ IN content_en) = 0;

-- [6/15] teletravail-frontalier-geneve-regles-2026 (fr) · B3 · « À lire aussi » : A1 (profil 3, télétravail)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)$f$, $r$- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)
- [Où habiter en France quand on télétravaille deux jours par semaine](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)$f$ IN content_fr) > 0
  AND position($r$- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)
- [Où habiter en France quand on télétravaille deux jours par semaine](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) = 0;

-- [7/15] teletravail-frontalier-geneve-regles-2026 (en) · B3 · "Also read": A1 (profile 3, remote work)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)$f$, $r$- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)
- [Where to live in France if you work from home two days a week](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)$f$ IN content_en) > 0
  AND position($r$- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)
- [Where to live in France if you work from home two days a week](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_en) = 0;

-- [8/15] declaration-impots-frontalier-2026 (fr) · B3-LIENS · puce « À lire aussi » repointée vers le télétravail
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Avenant fiscal 40 % frontalier (2026)](/blog/avenant-fiscal-40-frontalier-geneve)$f$, $r$- [Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social](/blog/teletravail-frontalier-geneve-regles-2026)$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$- [Avenant fiscal 40 % frontalier (2026)](/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_fr) > 0
  AND position($r$- [Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social](/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_fr) = 0;

-- [9/15] declaration-impots-frontalier-2026 (en) · B3-LIENS · "Also read" bullet repointed to remote work
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [The 40% Tax Rule: Cross-Border Work 2026](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$, $r$- [Remote Work for Cross-Border Workers: Rules & Limits 2026](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$- [The 40% Tax Rule: Cross-Border Work 2026](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_en) > 0
  AND position($r$- [Remote Work for Cross-Border Workers: Rules & Limits 2026](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_en) = 0;

-- [10/15] fiscalite-frontalier-geneve-impots-2026 (fr) · B3-LIENS · lien de la règle des 40 % repointé
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[le décryptage La Villa de l'avenant fiscal](/blog/avenant-fiscal-40-frontalier-geneve)$f$, $r$[notre guide du télétravail frontalier](/blog/teletravail-frontalier-geneve-regles-2026)$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$[le décryptage La Villa de l'avenant fiscal](/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_fr) > 0
  AND position($r$[notre guide du télétravail frontalier](/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_fr) = 0;

-- [11/15] fiscalite-frontalier-geneve-impots-2026 (en) · B3-LIENS · 40% rule link repointed
UPDATE blog_posts
SET content_en = replace(content_en, $f$[La Villa's breakdown of the tax amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$, $r$[our cross-border remote work guide](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$[La Villa's breakdown of the tax amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_en) > 0
  AND position($r$[our cross-border remote work guide](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_en) = 0;

-- [12/15] guide-ressources-frontalier-geneve (fr) · B3-LIENS · deux liens (avenant + télétravail) fondus en un
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026), [l'avenant fiscal sur le télétravail](/blog/avenant-fiscal-40-frontalier-geneve) et [les règles 2026 du télétravail](/blog/teletravail-frontalier-geneve-regles-2026).$f$, $r$[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026) et [les règles 2026 du télétravail, avenant fiscal compris](/blog/teletravail-frontalier-geneve-regles-2026).$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026), [l'avenant fiscal sur le télétravail](/blog/avenant-fiscal-40-frontalier-geneve) et [les règles 2026 du télétravail](/blog/teletravail-frontalier-geneve-regles-2026).$f$ IN content_fr) > 0
  AND position($r$[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026) et [les règles 2026 du télétravail, avenant fiscal compris](/blog/teletravail-frontalier-geneve-regles-2026).$r$ IN content_fr) = 0;

-- [13/15] guide-ressources-frontalier-geneve (en) · B3-LIENS · two links merged into one; the line also had /blog/ instead of /en/blog/ (fixed)
UPDATE blog_posts
SET content_en = replace(content_en, $f$> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/blog/declaration-impots-frontalier-2026), [the remote-work tax addendum](/blog/avenant-fiscal-40-frontalier-geneve) and [the 2026 remote-work rules](/blog/teletravail-frontalier-geneve-regles-2026).$f$, $r$> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/en/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/en/blog/declaration-impots-frontalier-2026) and [the 2026 remote-work rules, tax amendment included](/en/blog/teletravail-frontalier-geneve-regles-2026).$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/blog/declaration-impots-frontalier-2026), [the remote-work tax addendum](/blog/avenant-fiscal-40-frontalier-geneve) and [the 2026 remote-work rules](/blog/teletravail-frontalier-geneve-regles-2026).$f$ IN content_en) > 0
  AND position($r$> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/en/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/en/blog/declaration-impots-frontalier-2026) and [the 2026 remote-work rules, tax amendment included](/en/blog/teletravail-frontalier-geneve-regles-2026).$r$ IN content_en) = 0;

-- [14/15] permis-g-frontalier-geneve (fr) · B3-LIENS · lien repointé, ancre inchangée
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$selon [l'avenant franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve)$f$, $r$selon [l'avenant franco-suisse](/blog/teletravail-frontalier-geneve-regles-2026)$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$selon [l'avenant franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_fr) > 0
  AND position($r$selon [l'avenant franco-suisse](/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_fr) = 0;

-- [15/15] permis-g-frontalier-geneve (en) · B3-LIENS · link repointed, anchor unchanged
UPDATE blog_posts
SET content_en = replace(content_en, $f$under [the Franco-Swiss amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$, $r$under [the Franco-Swiss amendment](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$under [the Franco-Swiss amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_en) > 0
  AND position($r$under [the Franco-Swiss amendment](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] teletravail-frontalier-geneve-regles-2026/fr, title_fr · B3 : « Télétravail frontalier 2026 : règle des 40 % » → « Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social »
-- [2] teletravail-frontalier-geneve-regles-2026/fr · B3 : « C'est l'effet de l'[avenant à la convention fiscale franco-suisse](/blo… » → « C'est l'effet de l'[avenant à la convention fiscale franco-suisse](http… »
-- [3] teletravail-frontalier-geneve-regles-2026/en · B3 : « This comes from the [amendment to the Franco-Swiss tax treaty](/en/blog… » → « This comes from the [amendment to the Franco-Swiss tax treaty](https://… »
-- [4] teletravail-frontalier-geneve-regles-2026/fr · B3 : « ## L'impact fiscal du télétravail » → « ### Que se passe-t-il si je dépasse 40 % ?⏎⏎Tu deviens imposable en Fra… »
-- [5] teletravail-frontalier-geneve-regles-2026/en · B3 : « ## The tax impact of remote work » → « ### What happens if I go over 40%?⏎⏎You become taxable in France on the… »
-- [6] teletravail-frontalier-geneve-regles-2026/fr · B3 : « - [5 erreurs à éviter quand on cherche un logement frontalier](/blog/ar… » → « - [5 erreurs à éviter quand on cherche un logement frontalier](/blog/ar… »
-- [7] teletravail-frontalier-geneve-regles-2026/en · B3 : « - [5 mistakes to avoid when looking for cross-border housing](/en/blog/… » → « - [5 mistakes to avoid when looking for cross-border housing](/en/blog/… »
-- [8] declaration-impots-frontalier-2026/fr · B3-LIENS : « - [Avenant fiscal 40 % frontalier (2026)](/blog/avenant-fiscal-40-front… » → « - [Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social](/blog/tele… »
-- [9] declaration-impots-frontalier-2026/en · B3-LIENS : « - [The 40% Tax Rule: Cross-Border Work 2026](/en/blog/avenant-fiscal-40… » → « - [Remote Work for Cross-Border Workers: Rules & Limits 2026](/en/blog/… »
-- [10] fiscalite-frontalier-geneve-impots-2026/fr · B3-LIENS : « [le décryptage La Villa de l'avenant fiscal](/blog/avenant-fiscal-40-fr… » → « [notre guide du télétravail frontalier](/blog/teletravail-frontalier-ge… »
-- [11] fiscalite-frontalier-geneve-impots-2026/en · B3-LIENS : « [La Villa's breakdown of the tax amendment](/en/blog/avenant-fiscal-40-… » → « [our cross-border remote work guide](/en/blog/teletravail-frontalier-ge… »
-- [12] guide-ressources-frontalier-geneve/fr · B3-LIENS : « [la déclaration pas à pas](/blog/declaration-impots-frontalier-2026), [… » → « [la déclaration pas à pas](/blog/declaration-impots-frontalier-2026) et… »
-- [13] guide-ressources-frontalier-geneve/en · B3-LIENS : « > **Go further:** [Cross-border taxation in Geneva: 2026 rules](/blog/f… » → « > **Go further:** [Cross-border taxation in Geneva: 2026 rules](/en/blo… »
-- [14] permis-g-frontalier-geneve/fr · B3-LIENS : « selon [l'avenant franco-suisse](/blog/avenant-fiscal-40-frontalier-gene… » → « selon [l'avenant franco-suisse](/blog/teletravail-frontalier-geneve-reg… »
-- [15] permis-g-frontalier-geneve/en · B3-LIENS : « under [the Franco-Swiss amendment](/en/blog/avenant-fiscal-40-frontalie… » → « under [the Franco-Swiss amendment](/en/blog/teletravail-frontalier-gene… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'declaration-impots-frontalier-2026' THEN (position($f$- [Avenant fiscal 40 % frontalier (2026)](/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_fr) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$[le décryptage La Villa de l'avenant fiscal](/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026), [l'avenant fiscal sur le télétravail](/blog/avenant-fiscal-40-frontalier-geneve) et [les règles 2026 du télétravail](/blog/teletravail-frontalier-geneve-regles-2026).$f$ IN content_fr) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$selon [l'avenant franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_fr) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$Télétravail frontalier 2026 : règle des 40 %$f$ IN title_fr) = 0
      AND position($f$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve), en vigueur$f$ IN content_fr) = 0
      AND position($r$### Que se passe-t-il si je dépasse 40 % ?

Tu deviens imposable en France sur la part de salaire qui correspond à tes jours de télétravail, et ce dès le premier jour télétravaillé, pas seulement au-delà du seuil ([détail officiel — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). Pour que tu ne paies pas deux fois, la convention franco-suisse applique un crédit d'impôt (article 25A). Ta déclaration se complique, sans plus. Si ton poste t'oblige à dépasser, fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière ; les associations de frontaliers tiennent aussi des permanences pour la déclaration d'impôts, et on les liste dans [notre guide des ressources du frontalier](/blog/guide-ressources-frontalier-geneve).

### Qu'est-ce que ça change pour ma déclaration ?

Si tu restes sous 40 %, rien par rapport aux années précédentes : tu déclares tes revenus en France sur le formulaire 2047, et le crédit d'impôt neutralise l'impôt déjà prélevé en Suisse. La nouveauté est côté employeur : depuis le 1er janvier 2026, ton employeur suisse doit suivre tes jours de télétravail et de missions hors de Suisse, puis transmettre ton taux annuel à l'administration fiscale suisse (AFC) début 2027. Pour remplir le 2047 sans erreur, suis [notre pas-à-pas de la déclaration 2026](/blog/declaration-impots-frontalier-2026).

## L'impact fiscal du télétravail$r$ IN content_fr) > 0
      AND position($r$- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)
- [Où habiter en France quand on télétravaille deux jours par semaine](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) > 0)
  END AS fr_ok,
  CASE slug
    WHEN 'declaration-impots-frontalier-2026' THEN (position($f$- [The 40% Tax Rule: Cross-Border Work 2026](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_en) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$[La Villa's breakdown of the tax amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/blog/declaration-impots-frontalier-2026), [the remote-work tax addendum](/blog/avenant-fiscal-40-frontalier-geneve) and [the 2026 remote-work rules](/blog/teletravail-frontalier-geneve-regles-2026).$f$ IN content_en) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$under [the Franco-Swiss amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_en) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$This comes from the [amendment to the Franco-Swiss tax treaty](/en/blog/avenant-fiscal-40-frontalier-geneve), in force$f$ IN content_en) = 0
      AND position($r$### What happens if I go over 40%?

You become taxable in France on the share of your salary that matches your telework days, from the very first teleworked day, not just beyond the threshold ([official detail — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). So that you don't pay twice, the Franco-Swiss treaty applies a tax credit (article 25A). Your tax return gets more involved, nothing worse. If your job means going over, get help from a fiduciary who specialises in cross-border tax; cross-border workers' associations also run advice sessions on tax returns, and we list them in [our cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).

### What does it change for my tax return?

If you stay under 40%, nothing compared with previous years: you declare your income in France on form 2047, and the tax credit offsets the tax already withheld in Switzerland. What's new is on the employer's side: since 1 January 2026, your Swiss employer must track your telework days and assignments outside Switzerland, then report your annual rate to the Swiss tax administration (AFC) in early 2027. To fill in form 2047 without mistakes, follow [our 2026 tax return walkthrough](/en/blog/declaration-impots-frontalier-2026).

## The tax impact of remote work$r$ IN content_en) > 0
      AND position($r$- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)
- [Where to live in France if you work from home two days a week](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_en) > 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('declaration-impots-frontalier-2026', 'fiscalite-frontalier-geneve-impots-2026', 'guide-ressources-frontalier-geneve', 'permis-g-frontalier-geneve', 'teletravail-frontalier-geneve-regles-2026')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$under [the Franco-Swiss amendment](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$, $f$under [the Franco-Swiss amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$under [the Franco-Swiss amendment](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_en) > 0
  AND position($f$under [the Franco-Swiss amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$selon [l'avenant franco-suisse](/blog/teletravail-frontalier-geneve-regles-2026)$r$, $f$selon [l'avenant franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve)$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$selon [l'avenant franco-suisse](/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_fr) > 0
  AND position($f$selon [l'avenant franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/en/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/en/blog/declaration-impots-frontalier-2026) and [the 2026 remote-work rules, tax amendment included](/en/blog/teletravail-frontalier-geneve-regles-2026).$r$, $f$> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/blog/declaration-impots-frontalier-2026), [the remote-work tax addendum](/blog/avenant-fiscal-40-frontalier-geneve) and [the 2026 remote-work rules](/blog/teletravail-frontalier-geneve-regles-2026).$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/en/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/en/blog/declaration-impots-frontalier-2026) and [the 2026 remote-work rules, tax amendment included](/en/blog/teletravail-frontalier-geneve-regles-2026).$r$ IN content_en) > 0
  AND position($f$> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/blog/declaration-impots-frontalier-2026), [the remote-work tax addendum](/blog/avenant-fiscal-40-frontalier-geneve) and [the 2026 remote-work rules](/blog/teletravail-frontalier-geneve-regles-2026).$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026) et [les règles 2026 du télétravail, avenant fiscal compris](/blog/teletravail-frontalier-geneve-regles-2026).$r$, $f$[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026), [l'avenant fiscal sur le télétravail](/blog/avenant-fiscal-40-frontalier-geneve) et [les règles 2026 du télétravail](/blog/teletravail-frontalier-geneve-regles-2026).$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026) et [les règles 2026 du télétravail, avenant fiscal compris](/blog/teletravail-frontalier-geneve-regles-2026).$r$ IN content_fr) > 0
  AND position($f$[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026), [l'avenant fiscal sur le télétravail](/blog/avenant-fiscal-40-frontalier-geneve) et [les règles 2026 du télétravail](/blog/teletravail-frontalier-geneve-regles-2026).$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[our cross-border remote work guide](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$, $f$[La Villa's breakdown of the tax amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$[our cross-border remote work guide](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_en) > 0
  AND position($f$[La Villa's breakdown of the tax amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[notre guide du télétravail frontalier](/blog/teletravail-frontalier-geneve-regles-2026)$r$, $f$[le décryptage La Villa de l'avenant fiscal](/blog/avenant-fiscal-40-frontalier-geneve)$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$[notre guide du télétravail frontalier](/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_fr) > 0
  AND position($f$[le décryptage La Villa de l'avenant fiscal](/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Remote Work for Cross-Border Workers: Rules & Limits 2026](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$, $f$- [The 40% Tax Rule: Cross-Border Work 2026](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$- [Remote Work for Cross-Border Workers: Rules & Limits 2026](/en/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_en) > 0
  AND position($f$- [The 40% Tax Rule: Cross-Border Work 2026](/en/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social](/blog/teletravail-frontalier-geneve-regles-2026)$r$, $f$- [Avenant fiscal 40 % frontalier (2026)](/blog/avenant-fiscal-40-frontalier-geneve)$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$- [Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social](/blog/teletravail-frontalier-geneve-regles-2026)$r$ IN content_fr) > 0
  AND position($f$- [Avenant fiscal 40 % frontalier (2026)](/blog/avenant-fiscal-40-frontalier-geneve)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)
- [Where to live in France if you work from home two days a week](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$, $f$- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)
- [Where to live in France if you work from home two days a week](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)
- [Où habiter en France quand on télétravaille deux jours par semaine](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$, $f$- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)
- [Où habiter en France quand on télétravaille deux jours par semaine](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$### What happens if I go over 40%?

You become taxable in France on the share of your salary that matches your telework days, from the very first teleworked day, not just beyond the threshold ([official detail — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). So that you don't pay twice, the Franco-Swiss treaty applies a tax credit (article 25A). Your tax return gets more involved, nothing worse. If your job means going over, get help from a fiduciary who specialises in cross-border tax; cross-border workers' associations also run advice sessions on tax returns, and we list them in [our cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).

### What does it change for my tax return?

If you stay under 40%, nothing compared with previous years: you declare your income in France on form 2047, and the tax credit offsets the tax already withheld in Switzerland. What's new is on the employer's side: since 1 January 2026, your Swiss employer must track your telework days and assignments outside Switzerland, then report your annual rate to the Swiss tax administration (AFC) in early 2027. To fill in form 2047 without mistakes, follow [our 2026 tax return walkthrough](/en/blog/declaration-impots-frontalier-2026).

## The tax impact of remote work$r$, $f$## The tax impact of remote work$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$### What happens if I go over 40%?

You become taxable in France on the share of your salary that matches your telework days, from the very first teleworked day, not just beyond the threshold ([official detail — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). So that you don't pay twice, the Franco-Swiss treaty applies a tax credit (article 25A). Your tax return gets more involved, nothing worse. If your job means going over, get help from a fiduciary who specialises in cross-border tax; cross-border workers' associations also run advice sessions on tax returns, and we list them in [our cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).

### What does it change for my tax return?

If you stay under 40%, nothing compared with previous years: you declare your income in France on form 2047, and the tax credit offsets the tax already withheld in Switzerland. What's new is on the employer's side: since 1 January 2026, your Swiss employer must track your telework days and assignments outside Switzerland, then report your annual rate to the Swiss tax administration (AFC) in early 2027. To fill in form 2047 without mistakes, follow [our 2026 tax return walkthrough](/en/blog/declaration-impots-frontalier-2026).

## The tax impact of remote work$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$### Que se passe-t-il si je dépasse 40 % ?

Tu deviens imposable en France sur la part de salaire qui correspond à tes jours de télétravail, et ce dès le premier jour télétravaillé, pas seulement au-delà du seuil ([détail officiel — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). Pour que tu ne paies pas deux fois, la convention franco-suisse applique un crédit d'impôt (article 25A). Ta déclaration se complique, sans plus. Si ton poste t'oblige à dépasser, fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière ; les associations de frontaliers tiennent aussi des permanences pour la déclaration d'impôts, et on les liste dans [notre guide des ressources du frontalier](/blog/guide-ressources-frontalier-geneve).

### Qu'est-ce que ça change pour ma déclaration ?

Si tu restes sous 40 %, rien par rapport aux années précédentes : tu déclares tes revenus en France sur le formulaire 2047, et le crédit d'impôt neutralise l'impôt déjà prélevé en Suisse. La nouveauté est côté employeur : depuis le 1er janvier 2026, ton employeur suisse doit suivre tes jours de télétravail et de missions hors de Suisse, puis transmettre ton taux annuel à l'administration fiscale suisse (AFC) début 2027. Pour remplir le 2047 sans erreur, suis [notre pas-à-pas de la déclaration 2026](/blog/declaration-impots-frontalier-2026).

## L'impact fiscal du télétravail$r$, $f$## L'impact fiscal du télétravail$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$### Que se passe-t-il si je dépasse 40 % ?

Tu deviens imposable en France sur la part de salaire qui correspond à tes jours de télétravail, et ce dès le premier jour télétravaillé, pas seulement au-delà du seuil ([détail officiel — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). Pour que tu ne paies pas deux fois, la convention franco-suisse applique un crédit d'impôt (article 25A). Ta déclaration se complique, sans plus. Si ton poste t'oblige à dépasser, fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière ; les associations de frontaliers tiennent aussi des permanences pour la déclaration d'impôts, et on les liste dans [notre guide des ressources du frontalier](/blog/guide-ressources-frontalier-geneve).

### Qu'est-ce que ça change pour ma déclaration ?

Si tu restes sous 40 %, rien par rapport aux années précédentes : tu déclares tes revenus en France sur le formulaire 2047, et le crédit d'impôt neutralise l'impôt déjà prélevé en Suisse. La nouveauté est côté employeur : depuis le 1er janvier 2026, ton employeur suisse doit suivre tes jours de télétravail et de missions hors de Suisse, puis transmettre ton taux annuel à l'administration fiscale suisse (AFC) début 2027. Pour remplir le 2047 sans erreur, suis [notre pas-à-pas de la déclaration 2026](/blog/declaration-impots-frontalier-2026).

## L'impact fiscal du télétravail$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$This comes from the [amendment to the Franco-Swiss tax treaty](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signed on 27 June 2023, in force$r$, $f$This comes from the [amendment to the Franco-Swiss tax treaty](/en/blog/avenant-fiscal-40-frontalier-geneve), in force$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$This comes from the [amendment to the Franco-Swiss tax treaty](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signed on 27 June 2023, in force$r$ IN content_en) > 0
  AND position($f$This comes from the [amendment to the Franco-Swiss tax treaty](/en/blog/avenant-fiscal-40-frontalier-geneve), in force$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signé le 27 juin 2023, en vigueur$r$, $f$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve), en vigueur$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signé le 27 juin 2023, en vigueur$r$ IN content_fr) > 0
  AND position($f$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve), en vigueur$f$ IN content_fr) = 0;

UPDATE blog_posts
SET title_fr = replace(title_fr, $r$Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social$r$, $f$Télétravail frontalier 2026 : règle des 40 %$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social$r$ IN title_fr) > 0
  AND position($f$Télétravail frontalier 2026 : règle des 40 %$f$ IN title_fr) = 0;

COMMIT;
*/
