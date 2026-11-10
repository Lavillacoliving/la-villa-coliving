-- ============================================================================
-- Mise à jour : trouver-logement-avant-d-arriver-geneve (page de décision — brief « Conquête IA »)
-- Généré le 2026-10-30 par scripts/build-article-sql.mjs depuis content/decision-pages/trouver-logement-avant-d-arriver-geneve.{fr,en}.md + .meta.json
-- Mode : update + publication · à appliquer par Jérôme (SQL Editor / MCP)
-- ⚠️ PUBLIER = appliquer ce SQL ET merger le code dans la même séance (prérendu 05 h / 13 h UTC).
-- ============================================================================

BEGIN;

UPDATE public.blog_posts SET
  title_fr = 'Se loger côté France avant d''arriver à Genève',
  title_en = 'Moving to Geneva? Find housing in France first',
  excerpt_fr = 'Tu commences à Genève dans deux mois et tu cherches un logement côté France sans pouvoir visiter ? Le calendrier à rebours qu''on conseille, de J-60 au jour J : où chercher, comment vérifier un bailleur, le dossier sans fiche de salaire suisse et la checklist du déménagement.',
  excerpt_en = 'Starting in Geneva in two months and looking for a place on the French side without being able to visit? The countdown we recommend, from D-60 to day 0: where to look, how to check a landlord, a rental file with no Swiss payslip and the moving checklist.',
  meta_description_fr = 'Tu commences à Genève en janvier ? Le calendrier J-60 → J0 pour te loger côté France à distance : où chercher, arnaques, dossier sans fiche de paie suisse.',
  meta_description_en = 'Starting in Geneva in January? A 60-day countdown to secure housing on the French side remotely: where to look, scams, a file with no Swiss payslip.',
  content_fr = $fr$Oui, tu peux trouver ton logement côté France avant d'arriver à Genève, à distance : commence deux mois avant ta prise de poste, compte deux à six semaines pour trouver et signer, et prépare un dossier qui tient sans fiche de salaire suisse. Dans les messages que nous recevons, trois écueils reviennent : chercher trop tard, ne pas repérer une annonce douteuse à distance, et un dossier refusé faute de bulletins de paie français. Voici le calendrier qu'on conseille.

**En bref**
- Le calendrier part de J-60 : périmètre et budget, recherche à J-45, dossier et signature à J-30, déménagement à J-15.
- À distance, on vérifie l'adresse, le bailleur et le bail avant de payer quoi que ce soit.
- Sans fiche de salaire suisse, ton contrat de travail ou ta promesse d'embauche est la pièce centrale : certains bailleurs côté France s'en contentent.

## Le calendrier à rebours : de J-60 à J0

Deux mois suffisent, à condition de lancer tôt ce qui dépend des autres (bailleur, employeur, administration) et de garder pour la fin ce qui ne dépend que de toi.

| Quand | Ce que tu fais | Ce que tu dois avoir en main |
|---|---|---|
| J-60 | Tu fixes ton périmètre, ton budget total et ton mode de transport | L'adresse de ton lieu de travail, ton salaire net estimé |
| J-45 | Tu cherches, tu visites en visio, tu vérifies chaque bailleur | Des alertes sur deux ou trois canaux |
| J-30 | Tu déposes ton dossier et tu signes | Contrat de travail ou promesse d'embauche, pièce d'identité, caution disponible |
| J-15 | Tu déposes ta demande de permis G et tu déroules la checklist déménagement | Ton bail signé, ton contrat de travail, ta pièce d'identité |
| J0 | État des lieux, puis assurance maladie et comptes | Bail, pièce d'identité, contrat de travail |

## J-60 : fixer ton périmètre, ton budget et ton mode de transport

Avant de regarder une annonce, décide où tu peux habiter, combien tu peux payer au total et si tu auras une voiture.

**Le périmètre part de ton lieu de travail.** Un poste aux Eaux-Vives ou aux HUG ne se vit pas comme un poste aux Nations ou à l'aéroport. [Les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.

**Sans voiture, reste à distance de marche d'une gare du Léman Express ou d'un arrêt du tram 17.** Depuis la gare d'Annemasse, le Léman Express rejoint Genève-Eaux-Vives en 7 minutes et Cornavin en 23 minutes, sans changement ; compte 20 minutes porte-à-porte jusqu'à Genève-Eaux-Vives depuis Annemasse, Ville-la-Grand ou Ambilly. Si ton poste t'impose une voiture, ne te fie pas aux temps de train : teste le trajet un matin de semaine, ou fais-le tester par quelqu'un sur place.

**Le budget se calcule en total.** Loyer, charges, internet, assurances, transport : [le guide du budget colocation](/blog/budget-colocation-geneve-guide-complet) détaille chaque poste. Un repère : un coût total sous 30 % de ton salaire net te laisse de la marge.

## J-45 : chercher à distance sans te faire avoir

Cherche sur deux ou trois canaux, demande une visite en visio pour chaque logement retenu, et vérifie le bailleur avant de verser le moindre euro.

**Où chercher.** Les plateformes de colocation entre particuliers (La Carte des Colocs, Leboncoin, Roomlala, avec des frais de service possibles pour le locataire selon l'annonce), les groupes Facebook de logement autour de Genève, les agences, et, si tu rejoins une organisation internationale, la bourse du logement du CAGI. [Notre guide pour trouver une colocation](/blog/trouver-colocation-geneve-frontalier) compare ces canaux.

**La visite en visio.** Demande un appel vidéo en direct, pas une vidéo enregistrée : la rue, la salle de bains, le chauffage. Un refus n'est pas une preuve d'arnaque, mais c'est un signal.

**Ce que tu peux vérifier d'ici :**
- l'adresse existe et ressemble aux photos (Street View) ;
- si le bailleur est une société, elle figure sur l'annuaire officiel des entreprises, à la même adresse ;
- la fiche Google du lieu et la date de ses avis ;
- le téléphone répond, et c'est le même que dans l'annonce.

**Les signaux d'alerte :** un loyer nettement sous le marché, un bailleur « à l'étranger » qui ne peut pas faire visiter, un paiement demandé avant toute visite ou par un moyen intraçable. La règle : aucun versement avant d'avoir vu le logement, au moins en visio, et signé un bail. Les cas qu'on voit passer sont dans [notre guide des arnaques au logement](/blog/arnaques-logement-frontalier-geneve-eviter), et la méthode, appliquée à nous-mêmes, dans [comment vérifier qu'un coliving est réel](/blog/non-la-villa-coliving-nest-pas-une-arnaque).

## J-30 : le dossier quand tu n'as pas encore de fiche de salaire suisse

Ton contrat de travail ou ta promesse d'embauche est ta pièce maîtresse : ajoute une pièce d'identité et une caution prête, et privilégie les bailleurs qui lisent ton contrat plutôt que tes trois derniers bulletins.

Une agence te demandera souvent trois bulletins, un avis d'imposition et un garant en France. À défaut, une attestation de ton employeur (salaire, date de prise de poste) et tes derniers bulletins, même étrangers, aident : [le guide du dossier de location](/blog/dossier-location-frontalier-suisse-france) liste les pièces.

Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite. Nos trois maisons sont à Ville-la-Grand, Ambilly et Annemasse, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, pour 1 370 à 1 430 CHF par mois tout inclus. Le bail meublé de résidence principale de 12 mois est utilisable comme justificatif de domicile ; il n'y a aucun frais de dossier, et la caution peut se régler en deux ou trois fois.

**Signer à distance.** Un bail se signe en ligne : la signature électronique vaut la signature sur papier (Code civil, art. 1366 et 1367). L'état des lieux d'entrée, lui, se fait à la remise des clés (loi du 6 juillet 1989, art. 3-2), et le dépôt de garantie d'un meublé ne dépasse pas deux mois de loyer hors charges (même loi, art. 25-6).

## Quelles options peut-on signer à distance ?

Toutes, mais pas avec le même dossier ni le même délai.

| Option | Prix | Délai réaliste | Dossier demandé | Durée minimum |
|---|---|---|---|---|
| Studio meublé à Annemasse | 650 à 820 € hors charges (annonces, septembre 2026) | 2 à 6 semaines | Fiches de salaire, souvent un garant en France, dépôt 1 à 2 mois | bail d'un an, préavis d'un mois |
| Chambre en colocation classique | 700 à 1 000 € selon la commune, charges souvent en plus (2026) | 2 à 6 semaines | Dossier complet, garant fréquent | bail d'un an, préavis d'un mois en meublé |
| Chambre en coliving premium côté France (ex. La Villa Coliving) | dès {{PRIX_DES}}/{{PRIX_DES_EUR}} tout inclus, {{PRIX_PRIVATIF}}/{{PRIX_PRIVATIF_EUR}} avec salle d'eau privative | 72 h dès le premier contact si une chambre est disponible | Contrat de travail ou promesse d'embauche, pièce d'identité, caution {{CAUTION_MOIS}} mois hors charges | aucune : bail de 12 mois, préavis d'un mois |
| Studio meublé ou appart'hôtel | 1 300 à 1 600 € charges comprises (annonces, septembre 2026) | 1 jour à 2 semaines | Carte bancaire ou dossier léger | 1 nuit à 1 mois |

<!-- entity-facts -->

Pour un poste qui commence en janvier, la bonne fenêtre, c'est maintenant : nos [chambres libres](/chambres-disponibles) s'affichent en direct avec leur date de disponibilité, et [la candidature se remplit à distance](/candidature), avant même la première visite.

## J-15 : la checklist déménagement

Ton bail est signé ; il reste ton permis G, tes papiers, les contrats du logement, le courrier et tes affaires.

- **Permis G :** ressortissant de l'UE ou de l'AELE, tu déposes toi-même la demande en ligne auprès de l'OCPM, avant ton premier jour de travail, avec ta pièce d'identité et ton contrat de travail. Il te faut un domicile côté France, où tu rentres au moins une fois par semaine. Tu peux commencer à travailler dès l'envoi du dossier complet ; la délivrance prend en moyenne 12 semaines, 4 mois en ce moment (OCPM, octobre 2026). Le détail est dans [le guide du permis G](/blog/permis-g-frontalier-geneve).
- **Papiers, en PDF et en original :** contrat de travail, pièce d'identité, bail signé, attestation d'assurance habitation si le logement ne l'inclut pas.
- **Contrats du logement :** dans un studio, commande l'électricité et la box internet dès la signature (jusqu'à deux semaines chacun). En colocation ou en coliving, vérifie ce qui est inclus.
- **Courrier :** fais-le suivre par La Poste et donne ta nouvelle adresse à ton employeur et à ta banque.
- **Affaires :** garde en bagage à main tout ce qu'il te faut la première semaine, papiers compris.

**Les délais réalistes :** six à huit semaines de « je cherche » à « je suis installé ». C'est pour ça que tout commence à J-60.

## J0 → J+30 : arriver, déclarer, respirer

Le jour J, tu fais l'état des lieux et tu photographies tout ; dans le mois, tu choisis ton assurance maladie et tu ouvres tes comptes.

**L'assurance maladie.** Ta prise d'emploi ouvre ton droit d'option : trois mois pour choisir entre la LAMal et l'assurance maladie française, et le choix est irrévocable (ameli.fr, avril 2026). [Notre comparatif LAMal ou CMU-PUMa](/blog/assurance-sante-frontalier-lamal-cmu-budget) t'aide à trancher.

**Le reste du premier mois** (banque, impôts, transport, médecin) est détaillé semaine par semaine dans [notre guide pour s'installer à Genève, côté Suisse ou côté France](/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france). Si tu arrives seul, [se faire un réseau à Genève](/blog/se-faire-reseau-geneve-arriver-seul) donne des pistes pour les premières semaines.

## Pourquoi décembre est à la fois le pire et le meilleur moment

C'est le pire mois pour commencer à chercher, et un bon mois pour trouver si tu t'y es mis en novembre.

Le pire, parce que tout ralentit : fêtes, congés des agences et des bailleurs, visites difficiles à caler. Le meilleur, parce qu'il y a moins de monde en face (les recherches de logement autour de Genève baissent en décembre avant de repartir en janvier, d'après Google Keyword Planner) et que des logements se libèrent : en meublé, le locataire part avec un mois de préavis (loi du 6 juillet 1989, art. 25-8), donc un départ au 31 décembre devient une annonce en décembre. Un dossier prêt en novembre arrive au bon moment.

## Quand ce n'est pas le bon choix

Si ton employeur te loge les premières semaines à Genève, visite sur place et signe ensuite. Si tu dois résider en Suisse, lis plutôt [s'installer côté Suisse ou côté France](/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france). En couple ou en famille, vise un studio ou un appartement, avec le délai haut du tableau. Et si ton poste est dans le canton de Vaud, le Genevois français n'est pas forcément le bon côté.

## Questions fréquentes

**Comment trouver un logement rapidement près de Genève ?**

Cherche côté France, près d'une gare du Léman Express ou du tram 17, et vise les formats qui se signent vite : colocation, coliving, meublé de courte durée. Prépare ton dossier avant de chercher.

**Combien de temps faut-il pour trouver un logement côté France ?**

Deux à six semaines pour trouver et signer un studio ou une colocation classique, six à huit semaines de bout en bout. Un coliving ou un appart'hôtel va plus vite quand une chambre est libre. Commence deux mois avant ta prise de poste.

**Peut-on louer sans fiche de salaire suisse ?**

Oui. Les agences demandent souvent des bulletins français, mais certains bailleurs évaluent ton contrat : contrat de travail signé ou promesse d'embauche, pièce d'identité et caution suffisent alors.

**Peut-on signer un bail à distance ?**

Oui : la signature électronique vaut la signature manuscrite (Code civil, art. 1366 et 1367). L'état des lieux se fait à la remise des clés. Ne verse rien avant d'avoir signé un bail et vu le logement, au moins en visio.

**Faut-il un garant quand on est frontalier ?**

Pas toujours. Les agences en demandent souvent un quand le dossier n'a pas de bulletins français ; d'autres bailleurs s'en passent si le contrat couvre le loyer. Chez nous, un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.

**Janvier : est-ce trop tard pour chercher en décembre ?**

Non, mais c'est serré : chaque étape prend plus de temps. En contrepartie, il y a moins de candidats et des logements se libèrent au 31 décembre. Vise les formats qui se signent vite.

## Pour aller plus loin

- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Le vrai budget d'une colocation près de Genève](/blog/budget-colocation-geneve-guide-complet)
- [Arnaques au logement frontalier : les reconnaître](/blog/arnaques-logement-frontalier-geneve-eviter)
- [Dossier de location frontalier : les pièces](/blog/dossier-location-frontalier-suisse-france)
- [Permis G frontalier : le guide](/blog/permis-g-frontalier-geneve)
- [Vivre en France et travailler à Genève : le guide du frontalier](/blog/living-in-france-working-in-geneva)

## En clair

Se loger côté France avant d'arriver à Genève se joue sur le calendrier : périmètre et budget à J-60, recherche à J-45, signature à J-30 avec un dossier sans fiche de salaire suisse, checklist à J-15. Ta demande de permis G part avant ton premier jour de travail. Pour janvier, c'est en novembre qu'il faut s'y mettre.

---

👉 **Tu cherches où te loger côté France ?** À **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meublée tout inclus coûte à partir de **1 370 CHF/mois** — charges, fibre et ménage compris, sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre. → [Colocation à Genève](/colocation-geneve)
$fr$,
  content_en = $en$Yes, you can line up a home on the French side before you land in Geneva, entirely remotely: start two months before your first day, allow two to six weeks to find a place and sign, and build a rental file that works without a Swiss payslip. In the messages we get, the same three problems keep coming up: starting too late, not spotting a dodgy listing from a distance, and a file turned down for lack of French payslips. Here's the timeline we recommend.

**In short**
- The countdown starts at D-60: area and budget, searching at D-45, file and signature at D-30, the move at D-15.
- Remotely, you check the address, the landlord and the lease before paying anything.
- Without a Swiss payslip, your employment contract or job offer is the document that matters: some landlords on the French side need nothing more.

## The countdown: from D-60 to day 0

Two months is enough, provided you start early on whatever depends on other people (landlord, employer, authorities) and leave what depends only on you until the end.

| When | What you do | What you need in hand |
|---|---|---|
| D-60 | Set your area, your total budget and how you'll commute | Your workplace address, your estimated net salary |
| D-45 | Search, view by video call, check every landlord | Alerts on two or three channels |
| D-30 | Submit your file and sign | Employment contract or job offer, ID, deposit ready |
| D-15 | Apply for your G permit and work through the moving checklist | Your signed lease, your employment contract, your ID |
| Day 0 | Check-in inventory, then health insurance and accounts | Lease, ID, employment contract |

## D-60: set your area, your budget and how you'll commute

Before you look at a single listing, decide where you can live, what you can pay in total and whether you'll have a car.

**Your area starts from your workplace.** A job in Eaux-Vives or at the HUG hospitals is a different daily life from a job at the UN or the airport. [The French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.

**Without a car, stay within walking distance of a Léman Express station or a tram 17 stop.** From Annemasse station, the Léman Express reaches Geneva Eaux-Vives in 7 minutes and Cornavin in 23 minutes, with no change; allow 20 minutes door to door to Geneva Eaux-Vives from Annemasse, Ville-la-Grand or Ambilly. If your job means driving, don't go by train times: test the drive on a weekday morning, or have someone on the spot do it for you.

**Budget for the total.** Rent, bills, internet, insurance, transport: [our guide to the real cost of a flatshare](/en/blog/budget-colocation-geneve-guide-complet) breaks down every line. A benchmark: a total under 30% of your net salary leaves you room to breathe.

## D-45: search remotely without getting caught out

Search on two or three channels, ask for a live video viewing of every place you shortlist, and check the landlord before you send a single euro.

**Where to look.** Peer-to-peer flatshare platforms (La Carte des Colocs, Leboncoin, Roomlala, where the tenant may pay a service fee depending on the listing), housing Facebook groups around Geneva, letting agencies and, if you're joining an international organisation, the CAGI housing board. [Our guide to finding a flatshare](/en/blog/trouver-colocation-geneve-frontalier) compares these channels.

**The video viewing.** Ask for a live video call, not a recorded clip: the street, the bathroom, the heating. A refusal doesn't prove it's a scam, but it's worth noting.

**What you can check from where you are:**
- the address exists and matches the photos (Street View);
- if the landlord is a company, it appears in France's official business register, at the same address;
- the Google listing for the place and the dates of its reviews;
- the phone number answers, and it's the one in the listing.

**Red flags:** rent well below the market, a landlord "abroad" who can't arrange a viewing, a payment requested before any viewing or through an untraceable channel. The rule: no payment until you've seen the place, at least on video, and signed a lease. The cases we see are in [our guide to housing scams](/en/blog/arnaques-logement-frontalier-geneve-eviter), and the method, applied to ourselves, in [how to check a coliving is real](/en/blog/non-la-villa-coliving-nest-pas-une-arnaque).

## D-30: your rental file before your first Swiss payslip

Your employment contract or job offer is the key document: add an ID and a deposit you can pay straight away, and favour landlords who read your contract rather than your last three payslips.

A letting agency will often ask for three payslips, a tax notice and a guarantor in France. Failing that, a letter from your employer (salary, start date) and your latest payslips, even foreign ones, help: [our guide to the rental file](/en/blog/dossier-location-frontalier-suisse-france) lists the documents.

No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit. Our three houses are in Ville-la-Grand, Ambilly and Annemasse, 20 min from Geneva Eaux-Vives by Léman Express, door to door, for CHF 1,370 to 1,430 a month all inclusive. The 12-month furnished main-residence lease works as proof of residence; there's no application fee, and the deposit can be paid in two or three instalments.

**Signing remotely.** A lease can be signed online: under French law, an electronic signature carries the same weight as a paper one (Civil Code, articles 1366 and 1367). The check-in inventory, however, happens when the keys are handed over (law of 6 July 1989, article 3-2), and the deposit on a furnished let can't exceed two months' rent excluding bills (same law, article 25-6).

## Which options can you sign remotely?

All of them, but not with the same paperwork or on the same timeline.

| Option | Price | Realistic timeline | Paperwork required | Minimum stay |
|---|---|---|---|---|
| Furnished studio in Annemasse | €650 to €820 excluding bills (listings, September 2026) | 2 to 6 weeks | Payslips, often a guarantor in France, deposit of 1 to 2 months | one-year lease, one month's notice |
| Room in a standard flatshare | €700 to €1,000 depending on the town, bills often extra (2026) | 2 to 6 weeks | Full rental file, guarantor often required | one-year lease, one month's notice when furnished |
| Premium coliving room, French side (e.g. La Villa Coliving) | from {{PRIX_DES}}/{{PRIX_DES_EUR}} all inclusive, {{PRIX_PRIVATIF}}/{{PRIX_PRIVATIF_EUR}} with a private shower room | 72 hours from first contact if a room is available | Employment contract or job offer, ID, deposit of {{CAUTION_MOIS}} months' rent excluding bills | none: 12-month lease, one month's notice |
| Furnished studio or serviced apartment | €1,300 to €1,600 bills included (listings, September 2026) | 1 day to 2 weeks | Bank card or light paperwork | 1 night to 1 month |

<!-- entity-facts -->

If your job starts in January, now is the window: our [available rooms](/en/chambres-disponibles) are shown live with their availability date, and [the application can be done remotely](/en/candidature), before you've even had a viewing.

## D-15: the moving checklist

Your lease is signed; what's left is your G permit, your paperwork, the utilities, your mail and your things.

- **G permit:** as an EU or EFTA national, you file the application yourself online with the OCPM, before your first day at work, with your ID and your employment contract. You need a home on the French side that you return to at least once a week. You can start work as soon as your complete application has been sent; the permit itself takes 12 weeks on average, currently four months (OCPM, October 2026). [Our G permit guide](/en/blog/permis-g-frontalier-geneve) has the details.
- **Paperwork, as PDFs and originals:** employment contract, ID, signed lease, home insurance certificate if your place doesn't include it.
- **Utilities:** in a studio, order electricity and internet as soon as you sign (up to two weeks each). In a flatshare or coliving, check what's included.
- **Mail:** set up forwarding with La Poste and give your new address to your employer and your bank.
- **Your things:** keep everything you need for the first week in your hand luggage, documents included.

**Realistic timelines:** six to eight weeks from "I'm looking" to "I've moved in". That's why it all starts at D-60.

## Day 0 to day 30: arrive, register, breathe

On day 0 you do the check-in inventory and photograph everything; within the month you choose your health insurance and open your accounts.

**Health insurance.** Your start date opens your right of option: three months to choose between LAMal and French health insurance, and the choice can't be undone (ameli.fr, April 2026). [Our LAMal vs CMU-PUMa comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget) helps you decide.

**The rest of your first month** (bank, tax, transport, a GP) is covered week by week in [our guide to moving to Geneva, Swiss side or French side](/en/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france). If you're arriving on your own, [building a network in Geneva](/en/blog/se-faire-reseau-geneve-arriver-seul) has ideas for the first few weeks.

## Why December is both the worst and the best time

It's the worst month to start looking, and a good month to find something if you started in November.

The worst, because everything slows down: holidays, agencies and landlords away, viewings hard to schedule. The best, because there's less competition (housing searches around Geneva dip in December before picking up in January, according to Google Keyword Planner) and because places come up: in a furnished let, the tenant leaves on one month's notice (law of 6 July 1989, article 25-8), so a move-out on 31 December becomes a listing in December. A file that's ready in November lands at the right moment.

## When it's not the right choice

If your employer is housing you in Geneva for the first few weeks, view places in person and sign afterwards. If you need to live in Switzerland, read [Swiss side or French side](/en/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france) instead. As a couple or a family, look for a studio or a flat, and plan on the longer timelines in the table. And if your job is in the canton of Vaud, the French side of Geneva may not be the right side.

## FAQ

**How do you find housing quickly near Geneva?**

Look on the French side, near a Léman Express station or a tram 17 stop, and aim for formats that can be signed quickly: a flatshare, coliving, a short furnished let. Get your file ready before you start.

**How long does it take on the French side?**

Two to six weeks to find and sign a studio or a standard flatshare, six to eight weeks end to end. Coliving or a serviced apartment is faster when a room is free. Start two months before your first day.

**Can you rent without a Swiss payslip?**

Yes. Agencies often ask for French payslips, but some landlords assess your contract: a signed employment contract or job offer, an ID and a deposit are then enough.

**Can you sign a lease remotely?**

Yes: under French law, an electronic signature carries the same weight as a handwritten one (Civil Code, articles 1366 and 1367). The check-in inventory happens when the keys are handed over. Don't pay anything before you've signed a lease and seen the place, at least on video.

**Do you need a guarantor as a cross-border worker?**

Not always. Agencies often ask for one when your file has no French payslips; other landlords do without if your contract covers the rent. With us, a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.

**Is December too late to find a room for January?**

No, but it's tight: every step takes longer. On the other hand, there are fewer applicants and places free up on 31 December. Go for formats that can be signed quickly.

## Further reading

- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [The real cost of a flatshare near Geneva](/en/blog/budget-colocation-geneve-guide-complet)
- [Housing scams near Geneva: how to spot them](/en/blog/arnaques-logement-frontalier-geneve-eviter)
- [The cross-border rental file](/en/blog/dossier-location-frontalier-suisse-france)
- [The G permit: a guide](/en/blog/permis-g-frontalier-geneve)
- [Living in France, working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)

## The bottom line

Getting a home on the French side before you arrive in Geneva comes down to timing: area and budget at D-60, searching at D-45, signing at D-30 with a file that works without a Swiss payslip, the checklist at D-15. Your G permit application goes in before your first day at work. For January, November is when to get started.

---

👉 **Looking for a place on the French side?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** — utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre. → [A room on the French side](/en/colocation-geneve)
$en$,
  author = 'Jerome Austin',
  category = 'tips',
  image_url = '/images/le loft/exterior/la villa coliving le loft-114.webp',
  read_time_min = 12,
  tags = ARRAY['arrivée', 'mutation', 'relocation', 'logement', 'frontalier', 'genève', 'checklist', '2027'],
  is_published = true,
  published_at = COALESCE(published_at, now()),
  updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve';

-- Consolidation de « demenager-geneve-frontalier-checklist » dans « trouver-logement-avant-d-arriver-geneve » : dépublication (JAMAIS de DELETE — runbook scripts/consolidation/00-RUNBOOK.md)
UPDATE public.blog_posts SET is_published = false, updated_at = now() WHERE slug = 'demenager-geneve-frontalier-checklist';
-- Repointage des liens internes vers l'ancien slug (FR, EN, et liens /blog/ écrits dans l'EN)
UPDATE public.blog_posts SET
  content_fr = replace(content_fr, '](/blog/demenager-geneve-frontalier-checklist)', '](/blog/trouver-logement-avant-d-arriver-geneve)'),
  content_en = replace(replace(content_en, '](/en/blog/demenager-geneve-frontalier-checklist)', '](/en/blog/trouver-logement-avant-d-arriver-geneve)'), '](/blog/demenager-geneve-frontalier-checklist)', '](/en/blog/trouver-logement-avant-d-arriver-geneve)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/demenager-geneve-frontalier-checklist)%' OR content_en LIKE '%/blog/demenager-geneve-frontalier-checklist)%';
-- Côté code (même PR) : node scripts/redirects.mjs --add /blog/demenager-geneve-frontalier-checklist /blog/trouver-logement-avant-d-arriver-geneve ; retirer « demenager-geneve-frontalier-checklist » de src/data/blogIntentBuckets.ts ;
-- ajouter la paire à scripts/redirects.expected.json.

COMMIT;

-- Vérification :
--   SELECT slug, is_published, published_at, updated_at, read_time_min, length(content_fr) AS fr, length(content_en) AS en,
--          (SELECT count(*) FROM regexp_matches(content_fr, '\*\*[^*]+\?\*\*', 'g')) AS faq_fr,
--          position('<!-- entity-facts -->' IN content_fr) AS marker_fr, position('<!-- entity-facts -->' IN content_en) AS marker_en
--   FROM blog_posts WHERE slug = 'trouver-logement-avant-d-arriver-geneve';
--   SELECT slug FROM blog_posts WHERE is_published AND (content_fr LIKE '%](/blog/demenager-geneve-frontalier-checklist)%' OR content_en LIKE '%/blog/demenager-geneve-frontalier-checklist)%');  -- attendu : 0 ligne
