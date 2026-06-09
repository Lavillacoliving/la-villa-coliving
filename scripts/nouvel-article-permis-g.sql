-- ════════════════════════════════════════════════════════════════════════
-- P3 — NOUVEL ARTICLE : « Permis G frontalier » (démarches & renouvellement)
-- Date : 2026-06-08
-- Slug : permis-g-frontalier-geneve
-- ────────────────────────────────────────────────────────────────────────
-- Sujet administratif, ZÉRO recoupement avec les articles existants.
-- Faits vérifiés (sem.admin.ch = SEM, ge.ch / OCPM) :
--   conditions UE/AELE (contrat CH + domicile FR + retour hebdo ; zone
--   frontalière assouplie) ; demande par l'employeur à l'OCPM (2-6 sem.) ;
--   validité 5 ans (CDI/CDD >1 an) ou durée du contrat ; <90 j = annonce ;
--   renouvellement quasi-auto, avis 2-3 mois avant, ~65 CHF, 2-4 sem. ;
--   perte d'emploi : permis valable jusqu'à échéance, chômage en France.
-- Inséré is_published = TRUE (texte validé). Déploiement assuré par Claude.
-- ════════════════════════════════════════════════════════════════════════

INSERT INTO blog_posts (
  slug, title_fr, title_en,
  excerpt_fr, excerpt_en,
  meta_description_fr, meta_description_en,
  content_fr, content_en,
  author, category,
  image_url, read_time_min,
  is_published, published_at, tags
) VALUES (
  'permis-g-frontalier-geneve',
  'Permis G frontalier Genève : guide 2026',
  'Permis G: the Cross-Border Permit (2026)',
  'Permis G frontalier : conditions, demande à l''OCPM, validité 5 ans, renouvellement. Le guide simple pour vivre en France et travailler à Genève en 2026.',
  'Permis G explained: conditions, OCPM application, 5-year validity, renewal. The simple guide to living in France and working in Geneva in 2026.',
  'Permis G frontalier Genève : conditions, démarche OCPM, validité, renouvellement (~65 CHF). Vivre en France et travailler en Suisse en 2026, expliqué simplement.',
  'Permis G for Geneva cross-border workers: conditions, OCPM steps, validity, renewal (~65 CHF). Live in France and work in Switzerland in 2026, explained.',
  $$Le permis G, c'est le sésame de tout frontalier : l'autorisation qui vous permet de vivre en France et de travailler en Suisse. Bonne nouvelle, son obtention est simple et son renouvellement quasi automatique. Voici le mode d'emploi 2026, étape par étape.

## Qu'est-ce que le permis G ?

Le permis G — ou « autorisation frontalière » — est le titre qui autorise un ressortissant de l'UE/AELE à exercer une activité salariée en Suisse tout en résidant à l'étranger. C'est lui qui officialise votre statut de frontalier. Concrètement, vous travaillez à Genève, vous vivez côté France, et vous rentrez chez vous régulièrement : le permis G encadre cette situation.

## Quelles conditions pour l'obtenir ?

Trois conditions, cumulatives et simples :
- un **contrat de travail** avec un employeur établi en Suisse ;
- votre **domicile et centre de vie en France** (côté frontière) ;
- un **retour à votre domicile au moins une fois par semaine**.

Bon à savoir : pour les ressortissants de l'UE/AELE, l'ancienne obligation d'habiter dans une « zone frontalière » étroite a été largement assouplie — vous n'êtes plus tenu de vivre à quelques kilomètres de la frontière.

## Comment faire la demande à Genève ?

À Genève, c'est votre **employeur suisse** qui dépose la demande, auprès de l'**Office cantonal de la population et des migrations (OCPM)**. Préparez : le formulaire de demande, votre **contrat de travail**, une **pièce d'identité** et un **justificatif de domicile** en France. Comptez en général **2 à 6 semaines** de délai. Pour une mission de **moins de 90 jours**, pas de permis : une simple procédure d'annonce suffit.

## Combien de temps le permis G est-il valable ?

La durée dépend de votre contrat :
- **5 ans** si vous avez un CDI ou un CDD de plus d'un an ;
- **la durée du contrat** s'il fait moins d'un an.

## Comment le renouveler ?

C'est l'étape la plus simple : le renouvellement est **quasi automatique** tant que vous travaillez en Suisse. L'OCPM vous adresse un courrier **2 à 3 mois avant l'échéance**. Vous renvoyez votre contrat à jour et un justificatif de domicile récent, vous réglez les frais (**environ 65 CHF**), et vous recevez votre nouveau permis sous **2 à 4 semaines**. Anticipez : lancez la démarche dès réception du courrier pour éviter tout trou de validité.

## Que se passe-t-il si je perds mon emploi ?

Pas de panique : votre permis G **reste valable jusqu'à sa date d'échéance**. En tant que frontalier, vous percevez vos **allocations chômage en France** — pensez à vous inscrire à France Travail. Si vous retrouvez un poste en Suisse, votre statut frontalier reprend simplement son cours.

## Permis G et logement : pensez-y ensemble

Le permis G suppose une chose : une **adresse stable côté France** et un retour régulier chez vous. C'est là que le coliving prend tout son sens. Une chambre meublée dans une maison à 20 minutes de Genève vous donne un justificatif de domicile clair, un bail propre pour vos démarches, et une communauté de frontaliers qui connaissent déjà les rouages. De quoi sécuriser votre installation pendant que vous gérez la partie administrative. Découvrez [nos maisons](/nos-maisons).

## En résumé

- Le permis G = l'autorisation de travailler en Suisse en vivant en France.
- **Conditions** : contrat suisse + domicile en France + retour hebdomadaire.
- **Demande** : par l'employeur, à l'OCPM (Genève), 2 à 6 semaines.
- **Validité** : 5 ans (CDI/CDD > 1 an) ou la durée du contrat.
- **Renouvellement** : quasi automatique, ~65 CHF, 2 à 4 semaines.

Besoin d'une adresse stable près de Genève pour votre dossier ? [Contactez-nous](/candidature).

---

*À lire aussi :*
- [Frontalier Genève : guide complet 2026](/blog/living-in-france-working-in-geneva)
- [Impôt frontalier Genève 2026 : calcul net](/blog/fiscalite-frontalier-geneve-impots-2026)
- [Télétravail frontalier Genève : règles et limites 2026](/blog/teletravail-frontalier-geneve-regles-2026)$$,
  $$The permis G is every cross-border worker's golden ticket: the authorization that lets you live in France and work in Switzerland. Good news — getting it is simple, and renewing it is almost automatic. Here's the 2026 step-by-step.

## What is the permis G?

The permis G — or "cross-border commuter permit" — is the document that allows an EU/EFTA national to work as an employee in Switzerland while living abroad. It's what makes your cross-border status official. In practice: you work in Geneva, you live on the French side, and you return home regularly — the permis G frames that setup.

## What are the conditions to obtain it?

Three simple, cumulative conditions:
- an **employment contract** with an employer based in Switzerland;
- your **home and center of life in France** (near the border);
- a **return to your home at least once a week**.

Good to know: for EU/EFTA nationals, the old requirement to live within a narrow "border zone" has been largely relaxed — you no longer have to live a few kilometers from the border.

## How do you apply in Geneva?

In Geneva, your **Swiss employer** files the application with the **Cantonal Population and Migration Office (OCPM)**. Prepare: the application form, your **employment contract**, an **ID**, and **proof of residence** in France. Expect **2 to 6 weeks**. For an assignment of **under 90 days**, no permit is needed — a simple notification procedure is enough.

## How long is the permis G valid?

Validity depends on your contract:
- **5 years** for a permanent contract or a fixed-term contract over one year;
- **the contract's length** if it's under a year.

## How do you renew it?

This is the easiest step, because renewal is **almost automatic** as long as you work in Switzerland. The OCPM sends you a letter **2 to 3 months before expiry**. You return your up-to-date contract and a recent proof of residence, pay the fee (**about 65 CHF**), and receive your new permit within **2 to 4 weeks**. Plan ahead: start as soon as you get the letter to avoid any gap in validity.

## What if I lose my job?

Don't worry: your permis G **stays valid until its expiry date**. As a cross-border worker, you receive your **unemployment benefits in France** — remember to register with France Travail. If you find a new job in Switzerland, your cross-border status simply resumes.

## Permis G and housing: think of them together

The permis G assumes one thing: a **stable address on the French side** and a regular return home. That's exactly where coliving makes sense. A furnished room in a house 20 minutes from Geneva gives you a clear proof of residence, a clean lease for your paperwork, and a community of cross-border workers who already know the ropes. A solid way to secure your move while you handle the admin side. Discover [our houses](/en/nos-maisons).

## In short

- The permis G = permission to work in Switzerland while living in France.
- **Conditions**: Swiss contract + French residence + weekly return.
- **Application**: by the employer, to the OCPM (Geneva), 2 to 6 weeks.
- **Validity**: 5 years (permanent / over-1-year contract) or the contract's length.
- **Renewal**: almost automatic, ~65 CHF, 2 to 4 weeks.

Need a stable address near Geneva for your file? [Get in touch](/en/candidature).

---

*Also read:*
- [Living in France, Working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)
- [Geneva Cross-Border Tax: net pay 2026](/en/blog/fiscalite-frontalier-geneve-impots-2026)
- [Remote Work for Cross-Border Workers: Rules & Limits 2026](/en/blog/teletravail-frontalier-geneve-regles-2026)$$,
  'La Villa Team',
  'tips',
  '/images/le lodge gym_premium.webp',
  5,
  true,
  NOW(),
  ARRAY['permis G', 'frontalier', 'genève', 'OCPM', 'démarches', '2026']
);

-- ─── Vérification ───
SELECT slug, title_fr, is_published,
       LENGTH(content_fr) AS len_fr, LENGTH(content_en) AS len_en,
       LENGTH(title_fr) + LENGTH(' | La Villa Coliving') AS title_total_fr
FROM blog_posts WHERE slug = 'permis-g-frontalier-geneve';
