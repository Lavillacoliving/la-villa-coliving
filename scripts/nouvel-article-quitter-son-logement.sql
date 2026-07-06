-- ════════════════════════════════════════════════════════════════════════
-- Nouvel article — Quitter son logement : le guide pratique
-- Cibles : "quitter son logement", "délai de préavis meublé",
--          "état des lieux de sortie checklist", "récupérer sa caution"
-- Date : 2026-07-06
-- Source : brouillon Claude Desktop (quitter-son-logement-guide-pratique.md),
--   adapté : tutoiement (décision 12/06), liens internes mappés sur slugs réels,
--   placeholder prestataire ménage neutralisé (jamais de n° perso en public),
--   note zone tendue Annemasse ajoutée.
-- Maillage : coliving-frais-dossier (caution), coliving-vs-colocation
--   (comparatif), demenager-geneve-checklist (arrivée), dossier-location.
-- Image : chambre La Villa-88 (jamais utilisée sur le blog — règle unicité).
-- FAQ en ## FAQ + questions en gras → JSON-LD FAQPage auto (BlogPostPage).
-- Title FR 40c + suffixe " | La Villa Coliving" = 60c (< 70). Meta FR 139c.
-- ✅ APPLIQUÉ en base le 2026-07-06 — vérifié via REST : publié, 0 mojibake,
--    8 liens internes FR + 8 EN. (Ce commit sert aussi à déclencher le
--    prerender, qui a tourné avant l'INSERT lors du push précédent.)
-- ════════════════════════════════════════════════════════════════════════

INSERT INTO blog_posts (
  slug, title_fr, title_en, excerpt_fr, excerpt_en,
  meta_description_fr, meta_description_en, content_fr, content_en,
  author, category, image_url, read_time_min, is_published, published_at, tags
) VALUES (
  'quitter-son-logement-guide-pratique',
  'Quitter son logement : le guide pratique',
  'Moving out: the practical guide',
  'Préavis, contrats, meubles, état des lieux : tout ce qu''il faut boucler pour partir l''esprit tranquille — et récupérer ta caution sans mauvaise surprise.',
  'Notice period, utility contracts, furniture, move-out inspection: everything to wrap up before you leave — and get your deposit back without surprises.',
  'Préavis, résiliation des contrats, meubles, état des lieux et caution : le guide pratique pour quitter son logement sans mauvaise surprise.',
  'Notice periods, utility contracts, furniture, move-out inspection and deposit: the practical guide to leaving your rental without surprises.',
  $$Quitter un logement, c'est d'abord une checklist administrative, avant d'être un déménagement. Fait dans le désordre ou en retard, cela coûte cher : préavis mal calculé et loyer qui court, caution amputée faute d'un état des lieux soigné, contrats d'énergie qu'on oublie de résilier et qui continuent d'être prélevés. Fait dans l'ordre, tout devient fluide.

Voici, étape par étape, tout ce qu'il faut boucler pour partir l'esprit tranquille — et récupérer ta caution sans mauvaise surprise. En fin d'article, nous partageons la checklist concrète que nous remettons à chacun de nos locataires avant leur départ.

## 1. Donner son préavis : le bon délai, au bon format

Première étape, la plus structurante : prévenir ton propriétaire. Et là, le délai dépend entièrement du type de logement.

- **Logement meublé** : le préavis est de **1 mois**, partout, sans condition. C'est l'un des grands avantages du meublé (et du coliving).
- **Logement vide** : le préavis est de **3 mois**, réduit à **1 mois** si le logement se situe en zone tendue — c'est le cas d'Annemasse et de la plupart des communes du Genevois français — ou pour certains motifs légaux (mutation professionnelle, perte ou obtention d'un emploi, raison de santé justifiée, entre autres).
- **Colocation** : tout dépend de ton bail. Avec un bail individuel par chambre, tu donnes ton propre préavis sans engager les autres. Avec un bail unique et une clause de solidarité, la situation est plus délicate — vérifie ton contrat.

Le format compte autant que le délai. Le congé doit être envoyé par **lettre recommandée avec accusé de réception**, par acte de commissaire de justice (ex-huissier), ou remis en main propre contre récépissé. Attention : le délai ne démarre **qu'à la réception** de la lettre, pas à son envoi. Anticipe de quelques jours et cale précisément ta date de départ.

## 2. Résilier ou transférer ses contrats

C'est l'étape la plus facile à oublier — et celle qui continue de te coûter de l'argent si tu la négliges. Passe chaque contrat en revue :

- **Électricité et gaz** : relève tes compteurs le jour du départ, résilie ton contrat, et souscris au besoin dans ton nouveau logement. Sans résiliation, la facturation continue.
- **Box internet** : préviens ton opérateur (un préavis s'applique souvent), renvoie la box dans les délais pour éviter les frais, et anticipe d'éventuels frais de résiliation.
- **Assurance habitation** : depuis la loi Hamon, tu peux résilier à tout moment après un an. Le déménagement est de toute façon un motif de résiliation reconnu.
- **Eau** : si tu disposes d'un compteur individuel, pense au relevé et à la clôture.
- **Changement d'adresse** : active la réexpédition du courrier auprès de La Poste, et mets à jour ton adresse auprès des impôts, de la CAF, de ta banque, de ton employeur, de la Sécurité sociale, et pour ta carte grise (obligatoire sous un mois).

Bon à savoir : en coliving, la plupart de ces contrats sont inclus dans un loyer tout compris. Il n'y a donc, tout simplement, **rien à résilier.**

## 3. Que faire de ses meubles

Si tu quittes un logement que tu avais meublé toi-même, la question du mobilier peut vite devenir un casse-tête. Trois options, à combiner :

- **Vendre** : Leboncoin et Marketplace pour les meubles, les plateformes de seconde main pour les petits objets. Le secret, c'est d'anticiper : de bonnes photos, des prix réalistes, et surtout **commencer tôt** — un canapé se vend rarement en 48 heures.
- **Donner** : Emmaüs, les ressourceries, les applications de don entre voisins et les *give box* de quartier permettent de se débarrasser proprement de ce qui ne se vend pas.
- **Stocker** : si ton prochain logement est plus petit ou incertain, un garde-meuble temporaire peut dépanner.

Pour ce qui reste, renseigne-toi sur l'enlèvement des encombrants auprès de ta mairie, et prévois une camionnette si nécessaire.

Là encore, un logement meublé — coliving en tête — supprime totalement cette étape : tu arrives et tu repars les mains libres.

## 4. Réussir son état des lieux de sortie

C'est le moment qui conditionne la restitution de ta caution. La règle est simple : le logement doit être restitué dans l'état où tu l'as trouvé, **usure normale mise à part.**

Deux notions à distinguer pour éviter les litiges. La **vétusté** — l'usure naturelle liée au temps qui passe — est à la charge du propriétaire et ne peut pas t'être facturée. Les **dégradations** — un trou, une casse, un défaut d'entretien — sont, elles, à ta charge. En cas de doute, une grille de vétusté sert de référence.

Concrètement, avant le rendez-vous :

- Compare pièce par pièce avec ton **état des lieux d'entrée**.
- Réalise un **nettoyage complet** (voir la checklist ci-dessous).
- Prépare la **restitution des clés**.
- Transmets ton **RIB** pour le virement de la caution.

Côté délai, le propriétaire dispose d'**un mois** pour te restituer la caution si l'état des lieux de sortie est conforme à celui d'entrée, et de **deux mois** en cas de retenues justifiées. Passé ce délai, la loi prévoit une majoration en ta faveur. Un état des lieux d'entrée précis est ta meilleure protection : sans lui, le logement est présumé avoir été remis en bon état.

Pour rappel, en meublé, le dépôt de garantie est plafonné à **2 mois de loyer hors charges**. Sur ce que ça donne en coliving (et ce qu'on ne te facture pas), vois notre article sur [les frais de dossier et la caution en coliving](/blog/coliving-frais-dossier-geneve-annemasse).

## L'exemple concret : la checklist que nous remettons à nos locataires

La théorie, c'est bien. Un modèle réel, c'est mieux. Voici le message que Fanny transmet à chacun de nos locataires de La Villa avant l'état des lieux de sortie. Tu peux t'en inspirer, quel que soit ton logement.

> Bonjour [Prénom],
>
> Le moment du départ se rapproche, et nous — ainsi que les autres colocataires — avons été ravis de t'avoir parmi nous ! Afin de t'aider à préparer ton départ et que tout se déroule au mieux, sans mauvaise surprise, voici une petite checklist avant l'état des lieux de sortie.
>
> **Caution** : pense à nous transmettre ton RIB afin que nous puissions procéder au virement de ta caution.
>
> **Inventaire** : vérifie que tout ce qui t'a été fourni à ton arrivée est toujours présent et dans le même état au moment de ton départ (clés, draps, serviette, raclette de douche, cintres, etc.).
>
> **Ménage** : les espaces privatifs doivent être restitués dans le même état que lors de leur mise à disposition. Pense bien à nettoyer partout, y compris :
> - Toutes les surfaces (sols, traces sur les murs, fenêtres intérieures et extérieures, plafond si nécessaire, dessus de la tête de lit, dessus des plinthes, etc.)
> - Sous le lit
> - Les draps, qui doivent être lavés et détachés si besoin
> - La salle de bain, en particulier le calcaire sur la robinetterie, la paroi de douche, l'intérieur des tiroirs, ainsi que l'intérieur des deux évacuations (douche et lavabo)
> - La bouche d'aération de la salle de bain
> - Le jour de l'état des lieux, pense à vider et nettoyer tes espaces dans la cuisine et le cellier
>
> Si tu manques de temps et que tu as besoin d'aide pour le ménage, tu peux contacter notre prestataire de notre part — demande-nous ses coordonnées.
>
> Si tu as le moindre doute, n'hésite pas à m'écrire ☺️
>
> Merci, et excellente fin de journée,
> Fanny

Ce niveau de détail n'est pas anodin : il évite les litiges, protège la caution du locataire, et garantit que la chambre suivante sera impeccable. C'est aussi, tout simplement, une marque de respect mutuel.

## En coliving, la moitié de cette liste disparaît

Tu l'auras remarqué en lisant ce guide : une bonne partie des corvées d'un départ tient au fait de gérer soi-même son logement — résilier ses contrats, revendre ses meubles, se débrouiller seul face à l'état des lieux.

En coliving, ces frictions s'effacent. Le logement est meublé, donc rien à vendre. Les charges et abonnements sont inclus, donc rien à résilier. L'état des lieux est accompagné, la caution restituée par virement, et l'engagement souple facilite la mobilité. Ce n'est pas un argument de vente — c'est simplement la conséquence logique d'un habitat clé en main. Pour choisir ton prochain logement en connaissance de cause, vois notre [comparatif coliving vs colocation](/blog/coliving-vs-colocation-differences).

## En résumé

Un départ réussi tient en quatre gestes : donner son préavis au bon délai et au bon format, résilier ou transférer ses contrats, écouler ses meubles à temps, et soigner son état des lieux pour récupérer sa caution. Anticipe chaque étape, et ce qui ressemble à un casse-tête devient une simple formalité.

Si tu cherches, pour la suite, un logement où l'on t'accompagne du premier au dernier jour — sans contrats à gérer, sans meubles à acheter, et avec une communauté déjà là —, découvre notre [coliving tout inclus à 20 min de Genève](/colocation-geneve) et [les chambres disponibles](/candidature).

## FAQ

**Quel est le délai de préavis pour quitter un logement meublé ?**
Un mois, partout en France, sans condition particulière. C'est l'un des principaux avantages du meublé par rapport au logement vide, où le préavis atteint trois mois (réduit à un mois en zone tendue ou pour certains motifs légaux).

**Sous combien de temps récupère-t-on sa caution ?**
Un mois si l'état des lieux de sortie est conforme à celui d'entrée, deux mois en cas de retenues justifiées. Au-delà, le propriétaire s'expose à une majoration au bénéfice du locataire. Pense à transmettre ton RIB pour accélérer le virement.

**Faut-il résilier soi-même ses contrats d'énergie et d'internet ?**
Oui, si tu gères tes propres abonnements : sans résiliation, la facturation continue de courir après ton départ. Relève tes compteurs le jour J et préviens tes fournisseurs dans les délais. En coliving, ces contrats sont inclus : il n'y a rien à résilier.

**Comment se passe un départ en coliving ?**
Beaucoup plus simplement : logement meublé (rien à revendre), charges et abonnements inclus (rien à résilier), état des lieux accompagné, caution restituée par virement, et engagement souple. La checklist se limite pour l'essentiel au nettoyage des espaces privatifs et à la restitution des clés.

## Pour aller plus loin

- [Frais de dossier et caution en coliving : ce que tu paies vraiment](/blog/coliving-frais-dossier-geneve-annemasse)
- [Coliving ou colocation : quelles différences ?](/blog/coliving-vs-colocation-differences)
- [S'installer près de Genève : la checklist du nouveau frontalier](/blog/demenager-geneve-frontalier-checklist)
- [Monter un dossier de location entre Suisse et France](/blog/dossier-location-frontalier-suisse-france)

---

*Article publié en juillet 2026. Les délais cités (préavis meublé 1 mois, vide 3 mois ou 1 mois en zone tendue, caution restituée sous 1 à 2 mois) reflètent le droit commun français ; vérifie toujours les clauses de ton bail et les règles applicables à ta situation.*$$,
  $$Leaving a rental is an admin checklist before it's a moving job. Done out of order or too late, it gets expensive: a miscalculated notice period and rent that keeps running, a deposit trimmed for lack of a careful move-out inspection, energy contracts you forget to cancel that keep getting charged. Done in the right order, everything flows.

Here is, step by step, everything to wrap up so you can leave with peace of mind — and get your deposit back without surprises. At the end of the article, we share the actual checklist we give each of our tenants before they move out. (This guide covers French rental law, which applies to the whole French side of Greater Geneva.)

## 1. Giving notice: the right period, in the right format

First and most structuring step: notifying your landlord. The notice period depends entirely on the type of rental.

- **Furnished rental**: the notice period is **1 month**, everywhere in France, no conditions. It's one of the big advantages of furnished housing (and of coliving).
- **Unfurnished rental**: the notice period is **3 months**, reduced to **1 month** if the property is in a "zone tendue" (high-demand area) — which is the case for Annemasse and most towns on the French side of Greater Geneva — or for certain legal grounds (job transfer, loss or start of a job, documented health reasons, among others).
- **Flatshare**: it all depends on your lease. With an individual per-room lease, you give your own notice without affecting the others. With a single joint lease and a solidarity clause, things are trickier — check your contract.

The format matters as much as the timing. Notice must be sent by **registered letter with acknowledgment of receipt**, served by a court officer (commissaire de justice, formerly huissier), or handed over in person against a signed receipt. Careful: the clock only starts **upon receipt** of the letter, not when you send it. Allow a few days' buffer and set your departure date precisely.

## 2. Cancelling or transferring your contracts

This is the easiest step to forget — and the one that keeps costing you money if you neglect it. Go through every contract:

- **Electricity and gas**: read your meters on departure day, cancel your contract, and sign up at your new place if needed. Without cancellation, billing continues.
- **Internet box**: notify your provider (a notice period often applies), return the box on time to avoid charges, and anticipate possible termination fees.
- **Home insurance**: since the Hamon law, you can cancel any time after one year. Moving out is in any case a recognised ground for termination.
- **Water**: if you have an individual meter, remember the reading and account closure.
- **Change of address**: activate mail forwarding with La Poste, and update your address with the tax office, the CAF, your bank, your employer, social security, and your vehicle registration (mandatory within one month).

Good to know: in coliving, most of these contracts are included in an all-inclusive rent. So there is, quite simply, **nothing to cancel.**

## 3. What to do with your furniture

If you're leaving a place you furnished yourself, the furniture question can quickly become a headache. Three options, to combine:

- **Sell**: Leboncoin and Marketplace for furniture, second-hand platforms for small items. The secret is anticipating: good photos, realistic prices, and above all **starting early** — a sofa rarely sells in 48 hours.
- **Donate**: Emmaüs, reuse centres, neighbour-to-neighbour donation apps and local *give boxes* let you responsibly clear out what doesn't sell.
- **Store**: if your next home is smaller or uncertain, temporary self-storage can help.

For whatever remains, check your town hall's bulky-waste collection, and plan a van if needed.

Here again, a furnished home — coliving first among them — removes this step entirely: you arrive and leave hands-free.

## 4. Nailing your move-out inspection

This is the moment that decides whether you get your deposit back. The rule is simple: the property must be returned in the state you found it, **normal wear and tear excepted.**

Two notions to distinguish to avoid disputes. **Wear and tear** (vétusté) — natural ageing over time — is the landlord's responsibility and cannot be billed to you. **Damage** — a hole, a breakage, lack of maintenance — is on you. When in doubt, a wear-and-tear reference grid applies.

Concretely, before the appointment:

- Compare room by room with your **move-in inspection report**.
- Do a **complete cleaning** (see the checklist below).
- Prepare the **return of the keys**.
- Send your **bank details (RIB)** for the deposit refund.

Timing-wise, the landlord has **one month** to return your deposit if the move-out inspection matches the move-in one, and **two months** if justified deductions apply. Beyond that, the law provides a penalty in your favour. A precise move-in inspection is your best protection: without one, the property is presumed to have been handed over in good condition.

As a reminder, for furnished rentals the deposit is capped at **2 months' rent excluding charges**. For how this works in coliving (and what we don't charge you), see our article on [application fees and deposits in coliving](/en/blog/coliving-frais-dossier-geneve-annemasse).

## The real-life example: the checklist we give our tenants

Theory is fine. A real template is better. Here is the message Fanny sends each of our tenants at La Villa before the move-out inspection. Feel free to adapt it, whatever your housing situation.

> Hello [First name],
>
> Your departure is getting closer, and we — along with the other housemates — have loved having you with us! To help you prepare and make sure everything goes smoothly, with no surprises, here's a little checklist before the move-out inspection.
>
> **Deposit**: remember to send us your bank details so we can transfer your deposit back.
>
> **Inventory**: check that everything provided when you arrived is still there and in the same condition (keys, sheets, towel, shower squeegee, hangers, etc.).
>
> **Cleaning**: private spaces must be returned in the same state as when they were handed over. Make sure to clean everywhere, including:
> - All surfaces (floors, marks on walls, windows inside and out, ceiling if needed, top of the headboard, top of the skirting boards, etc.)
> - Under the bed
> - The sheets, washed and stain-treated if needed
> - The bathroom, especially limescale on taps, the shower screen, inside the drawers, and inside both drains (shower and sink)
> - The bathroom air vent
> - On inspection day, remember to empty and clean your spaces in the kitchen and pantry
>
> If you're short on time and need help with the cleaning, you can contact our cleaning provider on our behalf — just ask us for their contact details.
>
> If you have any doubt at all, don't hesitate to write to me ☺️
>
> Thank you, and have a lovely day,
> Fanny

This level of detail is no accident: it prevents disputes, protects the tenant's deposit, and guarantees the room will be spotless for the next person. It's also, quite simply, a mark of mutual respect.

## In coliving, half of this list disappears

You'll have noticed while reading this guide: a good share of moving-out chores comes from managing your home yourself — cancelling contracts, reselling furniture, facing the inspection alone.

In coliving, these frictions vanish. The home is furnished, so nothing to sell. Utilities and subscriptions are included, so nothing to cancel. The inspection is guided, the deposit returned by bank transfer, and the flexible commitment makes moving on easy. It's not a sales pitch — it's simply the logical consequence of turnkey housing. To choose your next home with full knowledge, see our [coliving vs flatshare comparison](/en/blog/coliving-vs-colocation-differences).

## In short

A successful move-out comes down to four moves: give notice with the right period and format, cancel or transfer your contracts, clear out your furniture in time, and nail your move-out inspection to get your deposit back. Anticipate each step, and what looks like a headache becomes a formality.

If, for what comes next, you're looking for a home where you're supported from day one to the last — no contracts to manage, no furniture to buy, and a community already there — check out our [all-inclusive coliving 20 min from Geneva](/en/colocation-geneve) and [the available rooms](/en/candidature).

## FAQ

**What is the notice period for leaving a furnished rental?**
One month, everywhere in France, no particular conditions. It's one of the main advantages of furnished housing over unfurnished, where notice reaches three months (reduced to one month in high-demand areas or for certain legal grounds).

**How long does it take to get your deposit back?**
One month if the move-out inspection matches the move-in one, two months if justified deductions apply. Beyond that, the landlord faces a penalty in the tenant's favour. Remember to send your bank details to speed up the transfer.

**Do you have to cancel energy and internet contracts yourself?**
Yes, if you manage your own subscriptions: without cancellation, billing keeps running after you leave. Read your meters on the day and notify your providers on time. In coliving, these contracts are included: there is nothing to cancel.

**What does moving out of a coliving look like?**
Much simpler: furnished home (nothing to resell), utilities and subscriptions included (nothing to cancel), guided inspection, deposit returned by bank transfer, and flexible commitment. The checklist essentially comes down to cleaning your private spaces and returning the keys.

## Further reading

- [Application fees and deposits in coliving: what you really pay](/en/blog/coliving-frais-dossier-geneve-annemasse)
- [Coliving or flatshare: what's the difference?](/en/blog/coliving-vs-colocation-differences)
- [Settling near Geneva: the new frontalier checklist](/en/blog/demenager-geneve-frontalier-checklist)
- [Building a rental application between Switzerland and France](/en/blog/dossier-location-frontalier-suisse-france)

---

*Published July 2026. The periods cited (1 month's notice for furnished, 3 months or 1 month for unfurnished in high-demand areas, deposit returned within 1 to 2 months) reflect standard French law; always check your lease clauses and the rules applying to your situation.*$$,
  'La Villa Team', 'tips', '/images/la villa/rooms/La Villa-88.webp', 8, true, NOW(),
  ARRAY['préavis', 'état des lieux', 'caution', 'déménagement', 'meublé', 'checklist']
);

-- ═══════════════ VÉRIFICATION (à lancer après l'INSERT) ═══════════════
-- Attendu : 1 ligne, title_total ≤ 70, meta ≤ 155, mojibake = false partout.
SELECT slug, is_published,
       LENGTH(title_fr) + LENGTH(' | La Villa Coliving') AS title_total_fr,
       LENGTH(title_en) + LENGTH(' | La Villa Coliving') AS title_total_en,
       LENGTH(meta_description_fr) AS meta_fr_len,
       LENGTH(meta_description_en) AS meta_en_len,
       LENGTH(content_fr) AS chars_fr, LENGTH(content_en) AS chars_en,
       (content_fr LIKE '%Ã%' OR title_fr LIKE '%Ã%') AS mojibake_fr,
       (content_en LIKE '%Ã%') AS mojibake_en
FROM blog_posts WHERE slug = 'quitter-son-logement-guide-pratique';

-- En cas de mojibake (mojibake_fr = true) : supprimer et recoller depuis
-- un éditeur UTF-8 (VS Code ou GitHub — PAS TextEdit) :
-- DELETE FROM blog_posts WHERE slug = 'quitter-son-logement-guide-pratique';
