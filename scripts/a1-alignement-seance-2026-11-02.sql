-- Seance "alignement du brouillon A1" du 02/11/2026 (brief "Geneve profils") : Ferney aligne sur la nouvelle "villes"
-- (Cornavin a une quarantaine de minutes), 2 questions EN en double avec "villes" remplacees, phrase caution D3-bis.
-- Ne publie pas. SQL 100 % ASCII (U&''), md5 controles avant et apres.
BEGIN;
DO $c$ BEGIN
  IF (SELECT count(*) FROM blog_posts WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve' AND is_published = false AND published_at IS NULL
        AND md5(content_fr) = '25ee6240fec4f5bf7ab6667e81af8277' AND md5(content_en) = '114c41efaadddb01197fc333efed0fff') <> 1
    THEN RAISE EXCEPTION 'brouillon A1 inattendu avant, rien n''est ecrit'; END IF;
END $c$;
UPDATE blog_posts SET content_fr = U&'Quand on travaille \00E0 Gen\00E8ve, on habite c\00F4t\00E9 France pr\00E8s d''une gare du L\00E9man Express ou d''un arr\00EAt du tram 17 : Annemasse, Ville-la-Grand ou Ambilly pour un poste aux Eaux-Vives, \00E0 Champel ou dans le centre, Ferney-Voltaire et le Pays de Gex pour les Nations, l''a\00E9roport ou le CERN. La bonne question n''est donc pas \00AB quelle ville \00BB, mais \00AB \00E0 quelle distance d''une gare, d''un arr\00EAt de tram ou de la douane que tu passeras chaque matin \00BB. Quatre crit\00E8res tranchent : o\00F9 tu travailles dans Gen\00E8ve, si tu as une voiture, ton budget et la dur\00E9e de ton s\00E9jour. Quand on nous pose la question, notre r\00E9ponse commence d''ailleurs toujours par une autre : tu travailles o\00F9 ? Ce guide parle de Gen\00E8ve, pas de B\00E2le ni de Lausanne ; pour la liste commune par commune, [notre comparatif des villes c\00F4t\00E9 France](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) prend le relais.

**En bref**
- Sans voiture, choisis d''abord ta gare ou ton arr\00EAt de tram, puis la commune autour.
- Eaux-Vives, Champel, Cornavin ou centre : vise Annemasse, Ville-la-Grand ou Ambilly. Nations, a\00E9roport ou CERN : regarde vers Ferney-Voltaire et le Pays de Gex.
- Pour 6 \00E0 12 mois ou un premier poste, un meubl\00E9 sans dur\00E9e minimale t''\00E9vite de t''engager pour un an sur un mauvais choix.

## D''abord : o\00F9 tu travailles dans Gen\00E8ve change tout

Ton lieu de travail fait la moiti\00E9 de la r\00E9ponse : Gen\00E8ve s''\00E9tire d''est en ouest, et la m\00EAme commune c\00F4t\00E9 France peut \00EAtre \00E0 un trajet de train ou \00E0 une travers\00E9e de la ville.

| Tu travailles\2026 | C\00F4t\00E9 France, regarde vers | Comment tu y vas |
|---|---|---|
| Aux Eaux-Vives, \00E0 Champel ou aux HUG | Annemasse, Ville-la-Grand, Ambilly | L\00E9man Express depuis la gare d''Annemasse : Gen\00E8ve-Eaux-Vives en 7 min, Gen\00E8ve-Champel en 10 min ; compte 20 \00E0 25 min porte-\00E0-porte jusqu''aux Eaux-Vives |
| \00C0 Cornavin ou dans le centre | Annemasse, Ville-la-Grand, Ambilly | L\00E9man Express jusqu''\00E0 Cornavin en 23 min, sans changement ; tram 17 depuis Ambilly jusqu''\00E0 Rive |
| \00C0 Lancy, Carouge ou Plan-les-Ouates | Annemasse, ou Saint-Julien-en-Genevois | L\00E9man Express jusqu''\00E0 Lancy-Pont-Rouge en 16 min depuis Annemasse ; bus direct depuis Saint-Julien |
| Aux Nations, \00E0 l''a\00E9roport ou au CERN | Ferney-Voltaire et le Pays de Gex | Bus TPG direct depuis Ferney-Voltaire : Cornavin en une quarantaine de minutes porte-\00E0-porte ; teste ton trajet exact avant de signer |

Les temps quartier par quartier, gare par gare, sont dans [notre article sur les temps de trajet entre Annemasse et Gen\00E8ve](/blog/temps-trajet-annemasse-geneve-par-quartier).

## Profil 1 \2014 Tu arrives seul\00B7e, sans voiture, et tu veux que \00E7a marche tout de suite

Prends un logement \00E0 distance de marche d''une gare du L\00E9man Express ou d''un arr\00EAt du tram 17 : c''est le crit\00E8re n\00B0 1, avant le quartier et avant la surface.

Trois zones collent \00E0 ce profil :
- **Annemasse, autour de la gare** : le L\00E9man Express te met aux Eaux-Vives en 7 minutes, et le reste se fait \00E0 pied (commerces, restaurants, m\00E9decin).
- **Ambilly, le long du tram 17** : la commune est coll\00E9e \00E0 la fronti\00E8re, et le tram file direct sur Gen\00E8ve.
- **Ville-la-Grand, c\00F4t\00E9 Foron** : des rues calmes, la rivi\00E8re qui marque la fronti\00E8re \00E0 deux pas, et la gare d''Annemasse accessible \00E0 pied.

Arriver seul, c''est aussi arriver sans r\00E9seau. Une colocation ou un coliving r\00E8gle les deux probl\00E8mes d''un coup : un logement meubl\00E9 d\00E8s le premier soir, et des gens avec qui d\00EEner. [Se faire un r\00E9seau \00E0 Gen\00E8ve](/blog/se-faire-reseau-geneve-arriver-seul) donne d''autres pistes pour les premi\00E8res semaines.

C''est pour ce profil qu''on a pens\00E9 La Villa Coliving : trois maisons \00E0 Ville-la-Grand, Ambilly et Annemasse, \00E0 20 min de Gen\00E8ve-Eaux-Vives en L\00E9man Express, porte-\00E0-porte, avec des chambres meubl\00E9es pour une personne \00E0 1\00A0370 \00E0 1\00A0430 CHF par mois tout inclus. Le dossier tient en trois pi\00E8ces : contrat de travail sign\00E9 ou promesse d''embauche, pi\00E8ce d''identit\00E9, caution de 2 mois de loyer hors charges. 0\00A0\20AC de frais de dossier, 0\00A0\20AC de frais d''agence, et la caution peut se r\00E9gler en 2 ou 3 fois selon ton dossier.

## Profil 2 \2014 Tu as une voiture et tu travailles rive droite, aux Nations ou \00E0 l''a\00E9roport

Regarde vers Ferney-Voltaire et le Pays de Gex : tu es du bon c\00F4t\00E9 de Gen\00E8ve, et tu n''as pas la ville \00E0 traverser chaque matin.

Ferney-Voltaire est pris\00E9e des employ\00E9s des organisations internationales, de l''a\00E9roport et du CERN : un centre historique, des commerces, mais un march\00E9 tendu. Plus loin, le Pays de Gex devient plus r\00E9sidentiel. [Notre guide pour les organisations internationales](/blog/organisations-internationales-geneve-ou-habiter) d\00E9taille les options si tu y travailles.

Avant de signer, v\00E9rifie trois choses :
- **la douane et le bouchon du matin** : fais le trajet un jour de semaine, \00E0 ton heure de d\00E9part r\00E9elle ; un temps relev\00E9 un dimanche ne dit rien de ton quotidien ;
- **le stationnement \00E0 l''arriv\00E9e** : se garer \00E0 Gen\00E8ve co\00FBte cher, et c''est souvent le premier poste du budget voiture ([le vrai co\00FBt du transport frontalier](/blog/cout-transport-frontalier-geneve-2026)) ;
- **les parkings relais** : laisser la voiture \00E0 l''entr\00E9e de la ville et finir en tram ou en bus t''\00E9vite le centre aux heures de pointe.

Avec une voiture mais un poste aux Eaux-Vives ou \00E0 Champel, l''est reste plus simple : le L\00E9man Express t''\00E9pargne la route.

## Profil 3 \2014 Tu t\00E9l\00E9travailles deux jours par semaine et tu veux de l''espace

Si tu ne vas au bureau que trois jours par semaine, tu peux viser plus calme et plus grand : Ville-la-Grand, ou Saint-Julien-en-Genevois si ton bureau est c\00F4t\00E9 Plainpalais ou Onex.

Deux points \00E0 garder en t\00EAte :
- **le seuil des 40\00A0%** : deux jours de t\00E9l\00E9travail sur une semaine de cinq restent compatibles avec l''imposition de ton salaire \00E0 la source en Suisse ; au-del\00E0 de 49,9\00A0%, c''est ta couverture sociale qui peut basculer c\00F4t\00E9 France. Les r\00E8gles, et les espaces de coworking c\00F4t\00E9 France, sont dans [notre article sur le t\00E9l\00E9travail frontalier](/blog/teletravail-frontalier-geneve-regles-2026).
- **un vrai coin bureau** : une pi\00E8ce o\00F9 tu dors et travailles m\00E9rite d''\00EAtre grande, calme et lumineuse. Regarde la surface de la chambre, pas seulement celle du logement.

## Profil 4 \2014 Ton budget est serr\00E9 ou c''est ton premier poste

Compare en co\00FBt total, pas en loyer : un studio pas cher qu''il faut meubler, \00E9quiper et abonner \00E0 tout peut co\00FBter plus cher, la premi\00E8re ann\00E9e, qu''une chambre tout inclus.

Pour un premier poste, deux pi\00E8ges reviennent : les frais d''agence et de dossier, et le garant en France que demandent souvent les agences quand ton dossier n''a pas de fiche de paie fran\00E7aise. [Ce que co\00FBtent les frais de dossier](/blog/coliving-frais-dossier-geneve-annemasse) et [le dossier de location frontalier](/blog/dossier-location-frontalier-suisse-france) t''aident \00E0 pr\00E9parer les deux.

Un rep\00E8re simple : un total logement sous 30\00A0% de ton salaire net te laisse de la marge. [Le vrai budget d''une colocation pr\00E8s de Gen\00E8ve](/blog/budget-colocation-geneve-guide-complet) d\00E9taille chaque ligne, et les ordres de grandeur sont plus bas dans cet article.

## Profil 5 \2014 Tu viens pour 6 \00E0 12 mois (mission, CDD, stage, p\00E9riode d''essai)

Cherche du meubl\00E9, sans dur\00E9e minimale et avec un pr\00E9avis court : une p\00E9riode d''essai qui tourne court ne doit pas te co\00FBter un an de loyer.

- **Le bail meubl\00E9 classique** dure un an, et tu peux le quitter \00E0 tout moment avec un mois de pr\00E9avis (loi du 6 juillet 1989, article 25-8).
- **Le bail mobilit\00E9**, de 1 \00E0 10 mois, est r\00E9serv\00E9 aux personnes en formation, en stage, en mission temporaire ou en mutation : il ne se renouvelle pas, et le bailleur ne peut pas demander de d\00E9p\00F4t de garantie (m\00EAme loi, articles 25-12 \00E0 25-18).
- **La colocation meubl\00E9e ou le coliving** : souvent tout inclus, parfois sans dur\00E9e minimale, ce qui reste le plus souple si tu ne sais pas encore combien de temps tu restes.

Les trois formats sont compar\00E9s dans [coliving, colocation ou studio \00E0 Gen\00E8ve](/blog/coliving-colocation-ou-studio-geneve-comparatif).

## Quand ce n''est pas le bon choix : ce qu''on ne te conseille pas

On pr\00E9f\00E8re te le dire avant que tu signes : voici quatre cas o\00F9 l''adresse que tu regardes risque de te co\00FBter cher au quotidien.

- **Un logement loin d''une gare ou d''un arr\00EAt de tram, sans voiture.** Au-del\00E0 d''un quart d''heure, la marche s''ajoute \00E0 chaque trajet, deux fois par jour, cinq jours par semaine.
- **Une commune au-del\00E0 de l''agglom\00E9ration d''Annemasse pour un poste aux Eaux-Vives.** Tu gagnes peut-\00EAtre sur le loyer, tu perds sur le trajet chaque jour.
- **Le mauvais c\00F4t\00E9 de Gen\00E8ve.** Annemasse pour un poste au CERN, ou Ferney-Voltaire pour un poste \00E0 Champel : tu traverses la ville matin et soir.
- **Une annonce trop belle.** Loyer bien sous le march\00E9, propri\00E9taire \00AB \00E0 l''\00E9tranger \00BB, paiement demand\00E9 avant la visite : [les arnaques au logement pr\00E8s de Gen\00E8ve](/blog/arnaques-logement-frontalier-geneve-eviter) montrent les cas qu''on voit passer.

Et si tu viens en couple ou en famille, notre formule n''est pas la bonne : nos chambres sont pour une personne. Cherche plut\00F4t un T2 ou un T3, et pr\00E9vois les d\00E9lais les plus longs du tableau ci-dessous.

## Loyers c\00F4t\00E9 France : les ordres de grandeur

C\00F4t\00E9 France, compte 650 \00E0 820 \20AC hors charges pour un studio meubl\00E9 \00E0 Annemasse et 700 \00E0 1\00A0000 \20AC pour une chambre en colocation classique. Une chambre en coliving premium, tout inclus, se loue d\00E8s {{PRIX_DES}}/{{PRIX_DES_EUR}} par mois.

| Option | Prix | D\00E9lai r\00E9aliste | Dossier demand\00E9 | Dur\00E9e minimum |
|---|---|---|---|---|
| Studio meubl\00E9 \00E0 Annemasse | 650 \00E0 820 \20AC hors charges (annonces, septembre 2026) | 2 \00E0 6 semaines | Fiches de salaire, souvent un garant en France, d\00E9p\00F4t de 1 \00E0 2 mois | bail d''un an, pr\00E9avis d''un mois |
| Chambre en colocation classique | 700 \00E0 1\00A0000 \20AC selon la commune, charges souvent en plus (2026) | 2 \00E0 6 semaines | Dossier complet, garant fr\00E9quent | bail d''un an, pr\00E9avis d''un mois en meubl\00E9 |
| Chambre en coliving premium c\00F4t\00E9 France (ex. La Villa Coliving) | d\00E8s {{PRIX_DES}}/{{PRIX_DES_EUR}} tout inclus, {{PRIX_PRIVATIF}}/{{PRIX_PRIVATIF_EUR}} avec salle d''eau privative | 72 h d\00E8s le premier contact si une chambre est disponible | Contrat de travail ou promesse d''embauche, pi\00E8ce d''identit\00E9, caution de {{CAUTION_MOIS}} mois hors charges | aucune : bail de 12 mois, pr\00E9avis d''un mois |
| Studio meubl\00E9 ou appart''h\00F4tel | 1\00A0300 \00E0 1\00A0600 \20AC charges comprises (annonces, septembre 2026) | 1 jour \00E0 2 semaines | Carte bancaire ou dossier l\00E9ger | 1 nuit \00E0 1 mois |

<!-- entity-facts -->

Pour suivre les prix dans la dur\00E9e, [l''Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve) publie les loyers relev\00E9s dans les annonces c\00F4t\00E9 France. Et si le coliving te tente, [nos chambres disponibles](/chambres-disponibles) s''affichent en direct avec leur date de lib\00E9ration, et [la candidature se fait \00E0 distance](/candidature).

## Questions fr\00E9quentes

**O\00F9 est-il pr\00E9f\00E9rable d''habiter pour un frontalier pr\00E8s de Gen\00E8ve ?**

L\00E0 o\00F9 ton trajet est simple : pr\00E8s d''une gare du L\00E9man Express ou d''un arr\00EAt du tram 17 si tu n''as pas de voiture. Pour un poste aux Eaux-Vives, \00E0 Champel ou dans le centre, vise Annemasse, Ville-la-Grand ou Ambilly ; pour les Nations, l''a\00E9roport ou le CERN, Ferney-Voltaire et le Pays de Gex.

**Est-il possible de vivre en France et de travailler \00E0 Gen\00E8ve ?**

Oui : c''est le statut de frontalier, avec le permis G. Ressortissant de l''UE ou de l''AELE, tu d\00E9poses la demande en ligne aupr\00E8s de l''OCPM avant ton premier jour de travail, et tu rentres chez toi, c\00F4t\00E9 France, au moins une fois par semaine. [Notre guide pour vivre en France et travailler \00E0 Gen\00E8ve](/blog/living-in-france-working-in-geneva) d\00E9taille la fiscalit\00E9, la sant\00E9 et le transport.

**Peut-on vivre c\00F4t\00E9 France sans voiture quand on travaille \00E0 Gen\00E8ve ?**

Oui, si tu choisis ton logement autour d''une gare du L\00E9man Express ou d''un arr\00EAt du tram 17. Depuis la gare d''Annemasse, le L\00E9man Express rejoint Gen\00E8ve-Eaux-Vives en 7 minutes et Cornavin en 23 minutes, sans changement.

**Annemasse ou Ville-la-Grand ?**

Annemasse pour la vie de ville et la gare au pied de chez toi ; Ville-la-Grand pour des rues pavillonnaires plus calmes, avec la gare d''Annemasse accessible \00E0 pied ou \00E0 v\00E9lo. Si tu h\00E9sites, [les quartiers d''Annemasse selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil) t''aident \00E0 trancher.

**Combien de temps pour aller \00E0 Gen\00E8ve depuis Annemasse ?**

En L\00E9man Express, 7 minutes jusqu''\00E0 Gen\00E8ve-Eaux-Vives et 23 minutes jusqu''\00E0 Cornavin, sans changement. Porte-\00E0-porte, depuis un logement \00E0 10 minutes \00E0 pied de la gare, compte 20 minutes jusqu''aux Eaux-Vives.

**O\00F9 habiter quand on travaille aux Nations ?**

C\00F4t\00E9 France, Ferney-Voltaire et le Pays de Gex sont du bon c\00F4t\00E9 de Gen\00E8ve : depuis Ferney, un bus TPG direct met Cornavin \00E0 une quarantaine de minutes porte-\00E0-porte. Depuis Annemasse, le L\00E9man Express t''am\00E8ne \00E0 Cornavin en 23 minutes, puis il reste la fin du trajet en tram ou en bus.

## Pour aller plus loin

- [Ville fronti\00E8re suisse pas ch\00E8re : 7 villes c\00F4t\00E9 France](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Vivre \00E0 Annemasse : quel quartier choisir selon ton profil ?](/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Vivre \00E0 Annemasse quand on travaille \00E0 Gen\00E8ve](/blog/vivre-a-annemasse-quand-on-travaille-a-geneve)
- [Temps de trajet Annemasse \2194 Gen\00E8ve selon ton quartier](/blog/temps-trajet-annemasse-geneve-par-quartier)
- [Le vrai budget d''une colocation pr\00E8s de Gen\00E8ve](/blog/budget-colocation-geneve-guide-complet)
- [Trouver une colocation \00E0 Gen\00E8ve](/blog/trouver-colocation-geneve-frontalier)
- [S''installer \00E0 Gen\00E8ve : c\00F4t\00E9 Suisse ou c\00F4t\00E9 France ?](/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france)
- [Se loger c\00F4t\00E9 France avant d''arriver \00E0 Gen\00E8ve](/blog/trouver-logement-avant-d-arriver-geneve)
- [Vivre en France, travailler \00E0 Gen\00E8ve : le guide complet](/blog/living-in-france-working-in-geneva)

## En clair

C\00F4t\00E9 France, on choisit d''abord un trajet, puis une commune. Pour un poste aux Eaux-Vives, \00E0 Champel ou dans le centre, Annemasse, Ville-la-Grand et Ambilly, pr\00E8s d''une gare ou du tram 17 ; pour les Nations, l''a\00E9roport ou le CERN, Ferney-Voltaire et le Pays de Gex. Sans voiture, la distance \00E0 pied jusqu''\00E0 la gare compte plus que le nom de la commune. Et pour un premier poste ou un s\00E9jour court, un meubl\00E9 sans dur\00E9e minimale te laisse le temps de conna\00EEtre la r\00E9gion avant de t''engager.

---

\+01F449 **Tu cherches o\00F9 te loger c\00F4t\00E9 France ?** \00C0 **La Villa Coliving** (Ville-la-Grand, Ambilly et Annemasse), une chambre meubl\00E9e tout inclus co\00FBte \00E0 partir de **1\00A0370 CHF/mois** \2014 charges, fibre et m\00E9nage compris, sans frais de dossier. Gen\00E8ve-Eaux-Vives en 7 min de L\00E9man Express depuis la gare d''Annemasse \2014 18 \00E0 24 min porte-\00E0-porte selon la maison, 30 min jusqu''au centre. \2192 [Nos maisons c\00F4t\00E9 France](/colocation-geneve)
',
  content_en = U&'If you work in Geneva, live on the French side close to a L\00E9man Express station or a tram 17 stop: Annemasse, Ville-la-Grand or Ambilly for a job in Eaux-Vives, Champel or the city centre, Ferney-Voltaire and the Pays de Gex for the UN district, the airport or CERN. So the real question isn''t "which town?" but "how far am I from a station, a tram stop, or the border crossing I''ll use every morning?". Four things decide it: where you work in Geneva, whether you have a car, your budget, and how long you''re staying. When people ask us, our answer always starts with another question: where''s your office? This guide is about Geneva, not Basel or Lausanne; for the town-by-town list, [our comparison of French towns near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) takes over.

**In short**
- Without a car, pick your station or tram stop first, then the town around it.
- Eaux-Vives, Champel, Cornavin or the centre: aim for Annemasse, Ville-la-Grand or Ambilly. UN district, airport or CERN: look at Ferney-Voltaire and the Pays de Gex.
- For 6 to 12 months or a first job, a furnished place with no minimum stay saves you from a year-long commitment to the wrong choice.

## First: where you work in Geneva changes everything

Your workplace is half the answer: Geneva stretches from east to west, and the same French town can be one train ride away or a trip right across the city.

| You work\2026 | On the French side, look at | How you get there |
|---|---|---|
| In Eaux-Vives, Champel or at the HUG hospitals | Annemasse, Ville-la-Grand, Ambilly | L\00E9man Express from Annemasse station: Geneva Eaux-Vives in 7 min, Geneva Champel in 10 min; allow 20 to 25 min door to door to Eaux-Vives |
| At Cornavin or in the centre | Annemasse, Ville-la-Grand, Ambilly | L\00E9man Express to Cornavin in 23 min, no change; tram 17 from Ambilly to Rive |
| In Lancy, Carouge or Plan-les-Ouates | Annemasse, or Saint-Julien-en-Genevois | L\00E9man Express to Lancy-Pont-Rouge in 16 min from Annemasse; direct bus from Saint-Julien |
| In the UN district, at the airport or at CERN | Ferney-Voltaire and the Pays de Gex | Direct TPG bus from Ferney-Voltaire: Cornavin in about 40 minutes door to door; test your exact route before you sign |

Times for each neighbourhood, station by station, are in [our guide to commuting times between Annemasse and Geneva](/en/blog/temps-trajet-annemasse-geneve-par-quartier).

## Profile 1: you''re arriving alone, without a car, and you need it to work from day one

Find a place within walking distance of a L\00E9man Express station or a tram 17 stop: that comes first, before the neighbourhood and before the floor area.

Three areas fit this profile:
- **Annemasse, around the station**: the L\00E9man Express gets you to Eaux-Vives in 7 minutes, and everything else is on foot (shops, restaurants, a GP).
- **Ambilly, along tram 17**: the town sits right on the border, and the tram runs straight into Geneva.
- **Ville-la-Grand, by the Foron**: quiet streets, the river that marks the border close by, and Annemasse station within walking distance.

Arriving alone also means arriving without a network. A flatshare or a coliving solves both at once: a furnished place from the first night, and people to have dinner with. [Building a network in Geneva](/en/blog/se-faire-reseau-geneve-arriver-seul) has more ideas for the first few weeks.

This is the profile we had in mind for La Villa Coliving: three houses in Ville-la-Grand, Ambilly and Annemasse, 20 min from Geneva Eaux-Vives by L\00E9man Express, door to door, with furnished single rooms at CHF 1,370 to 1,430 a month, all inclusive. The file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of two months'' rent excluding bills. No application fee, no agency fee, and the deposit can be paid in 2 or 3 instalments depending on your application.

## Profile 2: you have a car and you work on the right bank, in the UN district or at the airport

Look at Ferney-Voltaire and the Pays de Gex: you''re on the right side of Geneva, with no city to cross every morning.

Ferney-Voltaire is popular with people working at the international organisations, the airport and CERN: a historic centre, shops, but a tight market. Further out, the Pays de Gex becomes more residential. If you''re joining an international organisation, [our guide for UN and IO staff](/en/blog/organisations-internationales-geneve-ou-habiter) goes through the options.

Before you sign, check three things:
- **the border crossing and the morning queue**: do the journey on a weekday, at the time you''ll really leave; a time checked on a Sunday tells you nothing about your daily life;
- **parking when you get there**: parking in Geneva is expensive, and it''s often the biggest item in a car budget ([the real cost of cross-border commuting](/en/blog/cout-transport-frontalier-geneve-2026));
- **park-and-ride**: leaving the car at the edge of the city and finishing by tram or bus keeps you out of the centre at rush hour.

With a car but a job in Eaux-Vives or Champel, the east side is still simpler: the L\00E9man Express keeps you off the road.

## Profile 3: you work from home two days a week and you want space

If you''re only in the office three days a week, you can aim for somewhere quieter and roomier: Ville-la-Grand, or Saint-Julien-en-Genevois if your office is around Plainpalais or Onex.

Two things to keep in mind:
- **the 40% threshold**: two days of remote work in a five-day week keep your salary taxed at source in Switzerland; above 49.9%, it''s your social security cover that can switch to France. The rules, and coworking spaces on the French side, are in [our guide to remote work for cross-border workers](/en/blog/teletravail-frontalier-geneve-regles-2026).
- **a proper desk corner**: a room you sleep and work in needs to be big, quiet and bright. Look at the size of the room, not just the size of the home.

## Profile 4: your budget is tight, or it''s your first job

Compare total cost, not rent: a cheap studio you have to furnish, equip and connect to every utility can cost more in the first year than an all-inclusive room.

For a first job, two traps come up again and again: agency and application fees, and the guarantor in France that agencies often ask for when your file has no French payslips. [What application fees really cost](/en/blog/coliving-frais-dossier-geneve-annemasse) and [the cross-border rental file](/en/blog/dossier-location-frontalier-suisse-france) help you prepare for both.

A simple benchmark: total housing costs under 30% of your net salary leave you room to breathe. [The real cost of a flatshare near Geneva](/en/blog/budget-colocation-geneve-guide-complet) goes through every line, and the ballpark figures are further down this page.

## Profile 5: you''re coming for 6 to 12 months (assignment, fixed-term contract, internship, probation)

Look for a furnished place with no minimum stay and short notice: a probation period that ends early shouldn''t cost you a year''s rent.

- **A standard furnished lease** runs for a year, and you can leave at any time with one month''s notice (French law of 6 July 1989, article 25-8).
- **The "bail mobilit\00E9"**, from 1 to 10 months, is reserved for people in training, on an internship, on a temporary assignment or relocating for work: it can''t be renewed, and the landlord can''t ask for a deposit (same law, articles 25-12 to 25-18).
- **A furnished flatshare or a coliving**: often all inclusive, sometimes with no minimum stay, which is the most flexible option if you don''t yet know how long you''ll stay.

The three formats are compared in [coliving, flatshare or studio in Geneva](/en/blog/coliving-colocation-ou-studio-geneve-comparatif).

## When it''s not the right choice: what we''d steer you away from

We''d rather tell you before you sign: here are four cases where the place you''re looking at is likely to cost you every day.

- **A place far from a station or a tram stop, without a car.** Beyond a quarter of an hour''s walk, it adds to every journey, twice a day, five days a week.
- **A town beyond the Annemasse area for a job in Eaux-Vives.** You may save on rent, but you lose on the commute every day.
- **The wrong side of Geneva.** Annemasse for a job at CERN, or Ferney-Voltaire for a job in Champel: you cross the city morning and evening.
- **A listing that looks too good.** Rent well below the market, a landlord "abroad", payment requested before a viewing: [housing scams near Geneva](/en/blog/arnaques-logement-frontalier-geneve-eviter) shows the cases we come across.

And if you''re coming as a couple or a family, our format isn''t the right one: our rooms are for one person. Look for a one- or two-bedroom flat instead, and plan on the longer timelines in the table below.

## Rents on the French side: ballpark figures

On the French side, allow \20AC650 to \20AC820 excluding bills for a furnished studio in Annemasse, and \20AC700 to \20AC1,000 for a room in a standard flatshare. A premium coliving room, all inclusive, starts from {{PRIX_DES}}/{{PRIX_DES_EUR}} a month.

| Option | Price | Realistic timeline | Paperwork required | Minimum stay |
|---|---|---|---|---|
| Furnished studio in Annemasse | \20AC650 to \20AC820 excluding bills (listings, September 2026) | 2 to 6 weeks | Payslips, often a guarantor in France, deposit of 1 to 2 months | one-year lease, one month''s notice |
| Room in a standard flatshare | \20AC700 to \20AC1,000 depending on the town, bills often extra (2026) | 2 to 6 weeks | Full rental file, guarantor often required | one-year lease, one month''s notice when furnished |
| Premium coliving room, French side (e.g. La Villa Coliving) | from {{PRIX_DES}}/{{PRIX_DES_EUR}} all inclusive, {{PRIX_PRIVATIF}}/{{PRIX_PRIVATIF_EUR}} with a private shower room | 72 hours from first contact if a room is available | Employment contract or job offer, ID, deposit of {{CAUTION_MOIS}} months'' rent excluding bills | none: 12-month lease, one month''s notice |
| Furnished studio or serviced apartment | \20AC1,300 to \20AC1,600 bills included (listings, September 2026) | 1 day to 2 weeks | Bank card or light paperwork | 1 night to 1 month |

<!-- entity-facts -->

To follow prices over time, [the cross-border housing observatory](/en/observatoire-logement-frontalier-geneve) publishes the rents found in listings on the French side. And if coliving appeals, our [available rooms](/en/chambres-disponibles) are shown live with their availability date, and [you can apply remotely](/en/candidature).

## FAQ

**How much does a room on the French side cost?**

Allow \20AC700 to \20AC1,000 a month for a room in a standard flatshare, depending on the town, with bills often extra (2026). A premium coliving room, all inclusive, starts from {{PRIX_DES}}/{{PRIX_DES_EUR}} a month. Compare the total cost rather than the rent alone: a cheap place you have to furnish and connect to every utility can end up costing more.

**Where should I live if I''m only in Geneva for 6 to 12 months?**

Somewhere furnished, with short notice. A standard furnished lease runs for a year, but you can leave at any time with one month''s notice; the "bail mobilit\00E9", from 1 to 10 months, is for people in training, on an internship, on a temporary assignment or relocating for work. If you don''t yet know how long you''ll stay, a furnished flatshare or a coliving, often all inclusive, is the most flexible option.

**Is Annemasse a good place to live if you work in Geneva?**

Yes, especially if you work in Eaux-Vives, Champel or the centre: the station puts you on the L\00E9man Express, and daily life is on foot. For a job at CERN or the airport, the other side of Geneva is a better fit. [Living in Annemasse when you work in Geneva](/en/blog/vivre-a-annemasse-quand-on-travaille-a-geneve) covers the details.

**How far is Annemasse from the Geneva border?**

Very close: Annemasse''s neighbours, Ambilly and Ville-la-Grand, share a border with the canton of Geneva. From Annemasse station, the L\00E9man Express reaches Geneva Eaux-Vives in 7 minutes; from a place 10 minutes'' walk from the station, allow 20 minutes door to door.

**Ferney-Voltaire or Annemasse: which side of Geneva?**

The side your office is on. Ferney-Voltaire for the UN district, the airport and CERN; Annemasse for Eaux-Vives, Champel, Cornavin and the centre, by L\00E9man Express.

**Do you need to live in Switzerland to get a permit?**

No. The G permit is exactly that: as an EU or EFTA national, you work in Geneva and live in a neighbouring country, returning home at least once a week, and you file the application online with the OCPM before your first day at work. [Our guide to living in France and working in Geneva](/en/blog/living-in-france-working-in-geneva) covers tax, health insurance and transport.

## Further reading

- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Living in Annemasse when you work in Geneva](/en/blog/vivre-a-annemasse-quand-on-travaille-a-geneve)
- [Commuting times between Annemasse and Geneva](/en/blog/temps-trajet-annemasse-geneve-par-quartier)
- [The real cost of a flatshare near Geneva](/en/blog/budget-colocation-geneve-guide-complet)
- [Finding a flatshare in Geneva](/en/blog/trouver-colocation-geneve-frontalier)
- [Moving to Geneva: Swiss side or French side?](/en/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france)
- [Find housing in France before you arrive in Geneva](/en/blog/trouver-logement-avant-d-arriver-geneve)
- [Living in France, working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)

## The bottom line

On the French side, you choose a commute first, then a town. For a job in Eaux-Vives, Champel or the centre: Annemasse, Ville-la-Grand and Ambilly, near a station or tram 17. For the UN district, the airport or CERN: Ferney-Voltaire and the Pays de Gex. Without a car, the walk to the station matters more than the name of the town. And for a first job or a short stay, a furnished place with no minimum stay gives you time to get to know the area before you commit.

---

\+01F449 **Looking for a place on the French side?** At **La Villa Coliving** (Ville-la-Grand, Ambilly and Annemasse), a fully furnished all-inclusive room costs from **CHF 1,370/month** \2014 utilities, fiber and cleaning included, no application fee. Geneva Eaux-Vives in 7 minutes by L\00E9man Express from Annemasse station \2014 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre. \2192 [Our houses on the French side](/en/colocation-geneve)
',
  read_time_min = 13, updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve' AND is_published = false;
DO $c$ BEGIN
  IF (SELECT count(*) FROM blog_posts WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve' AND is_published = false AND published_at IS NULL
        AND md5(content_fr) = 'a760dd16475d48c19ef8b09869c5d780' AND md5(content_en) = '06c15f82c14411e2f8e9b69ecf2c5115') <> 1
    THEN RAISE EXCEPTION 'brouillon A1 inattendu apres, rien n''est ecrit'; END IF;
END $c$;
COMMIT;
