-- ════════════════════════════════════════════════════════════════════════
-- CORRECTIF P0-1 — Article « Télétravail frontalier Genève : règles 2026 »
-- Date : 2026-06-08
-- Slug : teletravail-frontalier-geneve-regles-2026
-- ────────────────────────────────────────────────────────────────────────
-- POURQUOI : l'article reposait entièrement sur un seuil UNIQUE de 25 %
-- (« depuis l'accord Suisse-UE de juillet 2023 »). FAUX en 2026.
-- La réalité 2026, ce sont DEUX seuils :
--   • FISCAL 40 %  : avenant à la convention fiscale franco-suisse, en vigueur
--     le 24/07/2025, applicable dès le 01/01/2026. < 40 % de télétravail annuel
--     → 100 % du salaire reste imposé à la source en Suisse (+ 10 j/an de
--     missions hors de Suisse inclus dans les 40 %). Source : ge.ch.
--   • SOCIAL 49,9 % : accord-cadre européen en vigueur depuis le 01/07/2023.
--     Jusqu'à 49,9 % de télétravail → maintien de la sécu sociale suisse,
--     sous condition d'attestation A1 (plateforme ALPS).
-- CONSÉQUENCE : 2 jours/semaine (40 %) sont désormais compatibles avec le
-- maintien de la fiscalité ET de la couverture sociale suisses.
--
-- NATURE : l'erreur irrigue tout l'article (~10 occurrences/langue : titre H2,
-- excerpt, logique « 1 jour OK / 2 jours risqué », section fiscale 2020/2023).
-- → On remplace donc content_fr / content_en EN ENTIER (plus sûr qu'un REPLACE).
-- L'angle coliving / WiFi / coworking est conservé à l'identique.
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET
  excerpt_fr = $exfr$Les deux seuils 2026 (40 % fiscal, 49,9 % social), l'impact concret, les espaces de travail en coliving et coworking. Tout ce qu'un frontalier doit savoir sur le télétravail.$exfr$,
  excerpt_en = $exen$The two 2026 thresholds (40% tax, 49.9% social security), the real impact, coliving and coworking workspaces. Everything a cross-border worker needs to know about remote work.$exen$,
  content_fr = $fr$## La question à 500 CHF/mois

Le télétravail a explosé depuis 2020. Pour les frontaliers, c'est à la fois une opportunité et un champ de mines réglementaire. Travailler depuis chez soi côté France quand on est employé en Suisse, ça change quoi exactement ? La réponse courte : potentiellement votre fiscalité, votre couverture sociale, et votre budget transport. La réponse longue, c'est cet article.

## Les deux seuils 2026 : 40 % (fiscal) et 49,9 % (social)

En 2026, il y a deux seuils à ne pas confondre — un fiscal, un social.

**Fiscal : 40 %.** Tant que vous télétravaillez moins de 40 % de votre temps de travail annuel depuis la France, l'intégralité de votre salaire reste imposée à la source en Suisse. C'est l'effet de l'avenant à la convention fiscale franco-suisse, en vigueur depuis le 24 juillet 2025 et applicable depuis le 1er janvier 2026. Bon à savoir : jusqu'à 10 jours par an de missions temporaires hors de Suisse peuvent être inclus dans ces 40 %.

**Social : 49,9 %.** Vous pouvez télétravailler jusqu'à 49,9 % de votre temps tout en restant affilié à la sécurité sociale suisse (AVS, LPP, chômage et assurance santé). C'est l'effet de l'accord-cadre européen en vigueur depuis le 1er juillet 2023. La condition : détenir une attestation A1 à jour, que votre employeur demande via la plateforme suisse ALPS.

Concrètement, sur une semaine de 5 jours, **2 jours de télétravail (40 %) sont compatibles** avec le maintien de votre fiscalité ET de votre couverture sociale suisses. C'est le changement majeur de 2026 : on est passé d'un seuil unique de 25 % (l'ancienne règle d'avant l'accord-cadre) à deux seuils bien plus souples.

### Ce qui est autorisé sans complication

Jusqu'à 2 jours de télétravail par semaine (40 %). Des journées ponctuelles à domicile pour des raisons personnelles (rendez-vous médical, livraison, grève des transports). Le travail à distance pendant un arrêt maladie partiel, si votre médecin l'autorise.

### Ce qui nécessite une vigilance

Trois jours ou plus par semaine depuis la France (60 % et au-delà). Vous franchissez alors le seuil social de 49,9 % : vous risquez un basculement vers la sécurité sociale française, ce qui changerait vos cotisations, votre LPP et votre couverture santé. Vous dépassez aussi le seuil fiscal de 40 % : les jours travaillés en France au-delà de la limite deviennent imposables en France. Au-delà de 40 %, validez systématiquement l'impact avec votre employeur et un spécialiste.

## L'impact fiscal du télétravail

La fiscalité est distincte de la sécurité sociale, mais la logique 2026 est désormais simple. Tant que vous restez sous 40 % de télétravail annuel, **rien ne change** : l'intégralité de votre rémunération reste imposée à la source à Genève, comme si vous étiez 100 % sur place. C'est tout l'intérêt de l'avenant entré en application le 1er janvier 2026, qui a sécurisé une pratique devenue courante depuis le Covid.

Au-delà de 40 %, les jours télétravaillés depuis la France redeviennent imposables en France pour la part excédentaire, et la convention fiscale franco-suisse joue alors son mécanisme de crédit d'impôt pour éviter la double imposition. L'impact reste gérable, mais il demande une déclaration soignée.

Le conseil pragmatique : restez sous 40 % (fiscal) et sous 49,9 % (social) pour profiter du télétravail sans aucune complication. Au-delà, consultez un fiduciaire spécialisé en fiscalité transfrontalière.

## Travailler depuis chez soi quand on vit en colocation ou coliving

La question pratique du télétravail, au-delà de la réglementation, c'est : avez-vous un endroit décent pour travailler ? Dans un studio, la réponse est oui — mais avec les inconvénients de l'isolement total pendant 8 heures. En colocation traditionnelle, c'est souvent problématique : bruit, espace partagé, WiFi instable, pas de bureau dédié.

### L'avantage coliving pour le télétravail

Chez La Villa Coliving, chaque chambre est équipée d'un bureau et d'une chaise de travail. La fibre optique est dimensionnée pour que 10 personnes puissent faire des visioconférences simultanément sans ralentissement. Les espaces communs offrent des alternatives : table de la salle à manger pour un changement de décor, jardin en été pour les calls informels, salon pour le travail collaboratif.

Le WiFi est un point critique pour le télétravail. Nos maisons sont équipées de fibre optique (1 Gbps descendant) avec des points d'accès WiFi 6 dans chaque chambre. Pas de "désolé, le WiFi rame, tu peux répéter ?" en plein call Teams avec ton manager à Genève.

### L'écosystème coliving comme "mini-coworking"

Un avantage inattendu du coliving pour les télétravailleurs : vous n'êtes pas seul. Quand 3-4 résidents travaillent depuis la maison le même jour, ça crée une ambiance de coworking informel. La pause café est partagée, le déjeuner est collectif, et l'isolement du télétravailleur en studio n'existe pas.

C'est un facteur de bien-être que les études sur le télétravail confirment : le principal problème du remote n'est pas la productivité, c'est l'isolement social. Le coliving résout ce problème structurellement.

## Les espaces de coworking côté France

Pour les journées de télétravail où vous avez besoin d'un environnement ultra-professionnel (client en visite, présentation importante, besoin de calme absolu), des espaces de coworking existent dans la zone frontalière.

À Annemasse, l'Espace Coworking du centre-ville propose des postes à la journée (15-25 €) ou à l'abonnement (150-250 €/mois). À Archamps, la Technopole propose des bureaux partagés dans un cadre plus corporate. À Saint-Julien-en-Genevois, plusieurs espaces ont ouvert depuis 2022.

Ces espaces sont une option pour le télétravail intensif, mais pour 1 à 2 jours par semaine, le bureau de votre chambre en coliving est largement suffisant et ne coûte rien de plus.

## L'impact sur votre budget transport

Le télétravail réduit votre budget transport au prorata des jours passés à la maison : 1 jour par semaine, c'est −20 % ; 2 jours, c'est −40 %. En Léman Express, ça ne change rien au prix (l'abonnement est illimité). En voiture, comptez 80-140 CHF/mois économisés par jour hebdomadaire de télétravail (essence + parking sur ~4 jours par mois).

Mais le vrai gain est ailleurs : le télétravail vous permet de vivre plus loin de Genève sans que le trajet soit pénalisant. Des communes comme Cranves-Sales, Vétraz-Monthoux ou Bonne, 10-15 minutes plus loin qu'Annemasse, sont 10-15 % moins chères. Avec 1 à 2 jours de télétravail, le surcoût de trajet est marginal.

## Le cadre juridique employeur : ce que votre RH doit savoir

Si votre employeur n'a pas encore formalisé sa politique de télétravail transfrontalier, voici les points clés à discuter avec les RH.

L'accord de télétravail doit spécifier le pourcentage maximum, en restant dans les limites légales : ≤ 40 % côté fiscal, < 50 % côté social. Pensez à l'attestation A1, que l'employeur demande via la plateforme ALPS pour sécuriser votre affiliation sociale suisse. L'assurance accident professionnel (LAA) en Suisse couvre-t-elle le télétravail depuis la France ? Dans la plupart des cas, oui, si c'est formalisé. Les outils de travail (laptop, écran, chaise ergonomique) sont-ils fournis pour le domicile ? Certaines entreprises suisses remboursent un forfait de 50-100 CHF/mois pour le télétravail.

La plupart des grandes entreprises suisses ont désormais un cadre clair. Les PME sont souvent en retard. Pour les règles fiscales à jour, l'administration cantonale genevoise (ge.ch) fait référence ; pour le cadre général du télétravail, le rapport du SECO (Secrétariat d'État à l'économie) est une bonne ressource à partager.

## Notre recommandation

Jusqu'à 2 jours de télétravail par semaine (40 %), c'est désormais le sweet spot pour les frontaliers : c'est légal, c'est pratique, et ça améliore la qualité de vie sans complications. En coliving, ces journées sont particulièrement agréables : vous travaillez depuis votre chambre ou les espaces communs, vous déjeunez avec les autres résidents présents, et vous profitez de la piscine ou du sauna après le travail.

Ne dépassez pas 40 % (fiscal) sans valider l'impact, et restez sous 49,9 % (social) pour conserver votre couverture suisse. Au-delà, prenez un conseil juridique spécialisé. Et surtout, formalisez l'accord avec votre employeur par écrit.

Envie de tester le télétravail en coliving ? Consultez nos [maisons](/nos-maisons) ou [postulez](/candidature).

---

*À lire aussi :*
- [Parking, vélo, Léman Express : le vrai coût de transport](/blog/cout-transport-frontalier-geneve-2026)
- [Se faire un réseau à Genève quand on arrive seul](/blog/se-faire-reseau-geneve-arriver-seul)
- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/5-erreurs-logement-frontalier-geneve)$fr$,
  content_en = $en$## The 500 CHF/month question

Remote work has exploded since 2020. For cross-border workers, it's both an opportunity and a regulatory minefield. Working from home on the French side when you're employed in Switzerland — what exactly changes? The short answer: potentially your taxation, social coverage, and transport budget. The long answer is this article.

## The two 2026 thresholds: 40% (tax) and 49.9% (social security)

In 2026 there are two thresholds not to be confused — one for tax, one for social security.

**Tax: 40%.** As long as you telework less than 40% of your annual working time from France, your entire salary remains taxed at source in Switzerland. This comes from the amendment to the Franco-Swiss tax treaty, in force since 24 July 2025 and applicable from 1 January 2026. Good to know: up to 10 days per year of temporary assignments outside Switzerland can be included within that 40%.

**Social security: 49.9%.** You can telework up to 49.9% of your time while remaining affiliated with Swiss social security (AVS, LPP, unemployment and health insurance). This comes from the European framework agreement in force since 1 July 2023. The condition: holding a valid A1 certificate, which your employer requests via the Swiss ALPS platform.

Concretely, in a 5-day week, **2 days of remote work (40%) are compatible** with keeping both your Swiss taxation AND your Swiss social coverage. That's the big change of 2026: we moved from a single 25% threshold (the old rule, before the framework agreement) to two far more flexible thresholds.

### What's allowed without complications

Up to 2 days of remote work per week (40%). Occasional days at home for personal reasons (medical appointment, delivery, transport strike). Remote work during partial sick leave, if your doctor authorizes it.

### What requires vigilance

Three or more days per week from France (60% and beyond). You then cross the 49.9% social-security threshold: you risk switching to French social security, which would change your contributions, LPP, and health coverage. You also exceed the 40% tax threshold: days worked in France beyond the limit become taxable in France. Above 40%, always validate the impact with your employer and a specialist.

## The tax impact of remote work

Taxation is separate from social security, but the 2026 logic is now simple. As long as you stay under 40% annual remote work, **nothing changes**: your entire compensation remains taxed at source in Geneva, as if you were on site 100% of the time. That's the whole point of the amendment that took effect on 1 January 2026, which secured a practice that had become common since Covid.

Beyond 40%, the days teleworked from France become taxable again in France for the excess portion, and the Franco-Swiss tax treaty then applies its tax-credit mechanism to avoid double taxation. The impact stays manageable, but it requires careful filing.

Pragmatic advice: stay under 40% (tax) and under 49.9% (social) to enjoy remote work without any complications. Beyond that, consult a fiduciary specializing in cross-border taxation.

## Working from home when you live in a flatshare or coliving

The practical question of remote work, beyond regulation, is: do you have a decent place to work? In a studio, the answer is yes — but with the drawbacks of total isolation for 8 hours. In traditional flatsharing, it's often problematic: noise, shared space, unstable WiFi, no dedicated desk.

### The coliving advantage for remote work

At La Villa Coliving, each room is equipped with a desk and work chair. Fiber optic internet is sized so 10 people can have simultaneous video calls without slowdown. Common areas offer alternatives: dining table for a change of scenery, garden in summer for informal calls, living room for collaborative work.

WiFi is a critical point for remote work. Our houses are equipped with fiber optic (1 Gbps download) with WiFi 6 access points in each room. No "sorry, WiFi's lagging, can you repeat?" during a Teams call with your manager in Geneva.

### The coliving ecosystem as "mini-coworking"

An unexpected advantage of coliving for remote workers: you're not alone. When 3-4 residents work from home on the same day, it creates an informal coworking atmosphere. Coffee breaks are shared, lunch is collective, and the isolation of the studio remote worker doesn't exist.

This is a wellbeing factor that remote work studies confirm: the main problem with remote isn't productivity, it's social isolation. Coliving solves this problem structurally.

## Coworking spaces on the French side

For remote work days when you need an ultra-professional environment (client visit, important presentation, need for absolute quiet), coworking spaces exist in the border area.

In Annemasse, the central Espace Coworking offers day passes (15-25 €) or subscriptions (150-250 €/month). In Archamps, the Technopole offers shared offices in a more corporate setting. In Saint-Julien-en-Genevois, several spaces have opened since 2022.

These spaces are an option for intensive remote work, but for 1 to 2 days per week, your coliving room desk is more than sufficient and costs nothing extra.

## The impact on your transport budget

Remote work reduces your transport budget in proportion to the days spent at home: 1 day per week is −20%; 2 days is −40%. With the Léman Express, it doesn't change the price (the pass is unlimited). By car, count on 80-140 CHF/month saved per weekly remote-work day (fuel + parking over ~4 days per month).

But the real gain is elsewhere: remote work allows you to live further from Geneva without the commute being penalizing. Municipalities like Cranves-Sales, Vétraz-Monthoux, or Bonne, 10-15 minutes further than Annemasse, are 10-15% cheaper. With 1 to 2 days of remote work, the additional commute cost is marginal.

## The employer legal framework: what your HR needs to know

If your employer hasn't yet formalized its cross-border remote work policy, here are the key points to discuss with HR.

The remote work agreement should specify the maximum percentage, staying within the legal limits: ≤ 40% for tax, < 50% for social security. Remember the A1 certificate, which the employer requests via the ALPS platform to secure your Swiss social affiliation. Does Swiss professional accident insurance (LAA) cover remote work from France? In most cases, yes, if formalized. Are work tools (laptop, screen, ergonomic chair) provided for home? Some Swiss companies reimburse a flat rate of 50-100 CHF/month for remote work.

Most large Swiss companies now have a clear framework. SMEs are often behind. For up-to-date tax rules, the Geneva cantonal administration (ge.ch) is the reference; for the general remote-work framework, the SECO (State Secretariat for Economic Affairs) report is a good resource to share.

## Our recommendation

Up to 2 days of remote work per week (40%) is now the sweet spot for cross-border workers: it's legal, practical, and improves quality of life without complications. In coliving, those days are particularly pleasant: you work from your room or common areas, have lunch with other residents present, and enjoy the pool or sauna after work.

Don't exceed 40% (tax) without validating the impact, and stay under 49.9% (social) to keep your Swiss coverage. Beyond that, get specialized legal advice. And above all, formalize the agreement with your employer in writing.

Want to try remote work in coliving? Check our [houses](/en/nos-maisons) or [apply](/en/candidature).

---

*Also read:*
- [Parking, bike, Léman Express: the real transport cost](/en/blog/cout-transport-frontalier-geneve-2026)
- [Building a network in Geneva when you arrive alone](/en/blog/se-faire-reseau-geneve-arriver-seul)
- [5 mistakes to avoid when looking for cross-border housing](/en/blog/5-erreurs-logement-frontalier-geneve)$en$,
  updated_at = NOW()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026';

-- ─── Vérification ───────────────────────────────────────────────────────
-- Les anciennes formulations FAUSSES doivent avoir disparu ; les nouveaux
-- seuils doivent être présents. (Note : une SEULE mention « 25 % » subsiste
-- volontairement côté FR, pour expliquer qu'on a quitté cette ancienne règle.)
SELECT
  slug,
  (content_fr LIKE '%La règle des 25%')   AS fr_vieux_titre_present,   -- attendu : false
  (content_fr LIKE '%seuil fiscal de 40%') AS fr_seuil_40_present,     -- attendu : true
  (content_fr LIKE '%49,9%')              AS fr_seuil_499_present,     -- attendu : true
  (content_en LIKE '%The 25% rule%')      AS en_vieux_titre_present,   -- attendu : false
  (content_en LIKE '%49.9%')              AS en_seuil_499_present,     -- attendu : true
  LENGTH(content_fr)                       AS taille_fr,
  LENGTH(content_en)                       AS taille_en,
  updated_at
FROM blog_posts
WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
