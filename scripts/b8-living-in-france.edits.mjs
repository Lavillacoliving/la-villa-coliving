/**
 * Brief « Genève profils » v2 du 30/10/2026 — B8, page pilier `living-in-france-working-in-geneva` : liste DÉCLARATIVE pour
 * scripts/build-slots-sql.mjs (méthode du 13/10) :
 *   node scripts/build-slots-sql.mjs --edits ./b8-living-in-france.edits.mjs --name b8-living-in-france --date 2026-10-30 --write-diff
 * Deux familles de retouches, une ligne par retouche (chacune peut être retirée seule) :
 *  - BRIEF : titre FR court (D-T, validé le 30/10), méta FR, deux H2 PAA après « L'avantage financier », renvoi à « villes »
 *    dans « Où vivre ? », renvoi à A3 dans « Conseils pratiques ». Titre et méta EN inchangés. Le lien vers A1 sera posé avec
 *    la publication d'A1 (un lien vers un article non publié serait mort).
 *  - FAITS (D-B8b, recommandation du rapport) : erreurs (« couple », péage, LAMal avant l'arrivée, mairie), second palier
 *    de prix et comparaison avec Genève, chiffres sans source alignés sur les articles détaillés qui font foi (assurance-sante,
 *    salaire-suisse-net, cout-transport) ou retirés ; Gaillard retiré du corps.
 * Les titres « Les défis du logement frontalier » (ancre du bloc « Où chercher ») et « Conclusion… » (fiche entité) ne bougent pas.
 * Chaînes « find » copiées depuis la base le 30/10/2026 ; à appliquer APRÈS la publication d'A3 (lien vers A3).
 */

export const POST_STATE_WATCH = [/Gaillard/, /couple/i, /péage|toll/i, /4-6 (semaines|weeks)/];

export function sqlDoc() {
  return {
    lot: 'B8 (brief « Genève profils » du 30/10/2026) : page pilier living-in-france-working-in-geneva — titre FR court, méta FR, deux H2 PAA, renvois vers « villes » et A3, corrections D-B8b.',
    sources: 'chaînes relevées sur la base vivante le 30/10 ; chiffres = articles détaillés du site (assurance-sante, salaire-suisse-net, cout-transport) et OCPM (page « Activité salariée pour frontalier UE/AELE », mise à jour du 19/10/2026)',
    apply: 'Après la publication d\'A3 (le texte lie /blog/trouver-logement-avant-d-arriver-geneve). Republication par le bot au prochain push ou cron.',
    encoding: 'Fichier UTF-8 avec espaces insécables — ne pas normaliser les espaces.',
    dryRunTitle: 'B8 — page pilier « Vivre en France, travailler à Genève » : aperçu SQL',
    legend: 'Légende : « Avant » = texte en base au 30/10 ; « Après » = texte proposé. BRIEF = demandé par le brief ; FAITS = correction D-B8b.',
    versions: {},
  };
}

const EDITS = [
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "BRIEF",
    "note": "B8 · titre FR court (D-T validé le 30/10)",
    "column": "title_fr",
    "find": "Frontalier Genève : guide complet 2026",
    "replace": "Vivre en France, travailler à Genève : guide 2026"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "BRIEF",
    "note": "B8 · méta FR : réponse d'abord (statut, permis G, impôt, santé, où habiter)",
    "column": "meta_description_fr",
    "find": "Guide complet du frontalier : vivre en France, travailler à Genève. Salaires, fiscalité, transport, logement, coliving. Tout ce qu'il faut savoir.",
    "replace": "Frontalier à Genève : permis G, impôt à la source, LAMal ou CMU, où habiter côté France. Le guide complet pour vivre en France et travailler en Suisse."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · « loyers 2 à 3 fois plus chers » sans source → retiré",
    "find": "le coût de la vie suisse (loyers 2 à 3 fois plus chers qu'en France) pousse naturellement",
    "replace": "le coût du logement côté suisse pousse naturellement"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · « cotisations un peu moins élevées », « indexation continue » sans source → repère de salaire net sourcé (salaire-suisse-net)",
    "find": "Les cotisations sociales suisses sont un peu moins élevées, et surtout, le salaire suisse bénéficie d'une indexation continue sur la productivité et l'inflation.",
    "replace": "À titre de repère, pour un célibataire à 7 000 CHF brut par mois, environ 70 % du brut arrive sur ton compte une fois déduits les cotisations sociales et l'impôt à la source, avant l'assurance santé."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · « 30 à 40 % moins cher » et comparaison 1 370 / 2 200+ CHF (règle A.4) → retirés",
    "find": "De l'autre côté, le coût de la vie français est structurellement 30 à 40% moins cher. Un loyer de 1 370 CHF pour une chambre privée dans une maison partagée premium en Haute-Savoie remplace facilement un loyer de 2 200+ CHF en Suisse pour un petit studio. Les courses, les restaurants, l'essence : tout est moins cher en France.",
    "replace": "De l'autre côté, ton loyer, tes courses et tes sorties se paient aux prix français. L'écart varie selon les postes : c'est le calcul poste par poste qui dit ce qu'il te reste."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "BRIEF",
    "note": "B8 · deux H2 PAA après « L'avantage financier » (+ D-B8b : « +800 à 1 500 EUR d'épargne » sans source retiré)",
    "find": "Le différentiel net mensuel pour un frontalier isolé ? Compter sur +800 à 1 500 EUR d'épargne supplémentaire chaque mois par rapport à un même emploi basé à Genève avec logement suisse. Cumulé sur une carrière, c'est une différence substantielle en termes de patrimoine.\n\n## Le système fiscal : impôt à la source, CMU, LAMal",
    "replace": "## Est-ce avantageux de travailler en Suisse et de vivre en France ?\n\nOui, financièrement, c'est l'équation qui fait venir les frontaliers : ton salaire est versé en francs suisses, alors que ton loyer et tes courses se paient aux prix français. Ce qui réduit l'écart : l'assurance santé, le transport et le temps de trajet, et le taux de change, qui peut jouer dans les deux sens.\n\nTrois calculs te donnent la réponse pour ta situation :\n\n- [ce que coûte la vie de chaque côté, poste par poste](/blog/cout-de-la-vie-suisse-france-frontalier-2026) ;\n- [ton salaire net suisse](/blog/salaire-suisse-net-frontalier-2026), une fois les cotisations et l'impôt à la source déduits ;\n- [ta fiscalité de frontalier](/blog/fiscalite-frontalier-geneve-impots-2026), qui dépend de ton canton de travail.\n\n## Comment faire pour travailler en Suisse et habiter en France ?\n\nDans l'ordre : un contrat de travail avec un employeur genevois, un logement côté France, la demande de permis G, le choix de ton assurance santé, puis ta première déclaration d'impôts en France. Chaque étape a son guide détaillé.\n\n1. **Le contrat de travail.** C'est lui qui ouvre tout le reste : le permis G, ton dossier de location, ton assurance santé.\n2. **Le logement côté France.** Pour le permis G, il te faut un domicile côté France, où tu rentres au moins une fois par semaine. Si tu ne peux pas visiter avant d'arriver, [notre calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) va de J-60 au jour J.\n3. **Le permis G.** Ressortissant de l'UE ou de l'AELE, tu déposes toi-même la demande en ligne auprès de l'OCPM, avant ton premier jour de travail ; tu peux commencer dès l'envoi du dossier complet (OCPM, octobre 2026). [Le guide du permis G](/blog/permis-g-frontalier-geneve) détaille les conditions.\n4. **L'assurance santé.** Ta prise d'emploi ouvre un droit d'option de trois mois entre la LAMal et l'assurance maladie française, et le choix est irrévocable (ameli.fr, avril 2026) : [LAMal ou CMU-PUMa, notre comparatif](/blog/assurance-sante-frontalier-lamal-cmu-budget).\n5. **La déclaration d'impôts.** Ton salaire est imposé à la source à Genève, mais tu le déclares aussi en France chaque printemps : [la déclaration pas à pas](/blog/declaration-impots-frontalier-2026).\n\n## Le système fiscal : impôt à la source, CMU, LAMal"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · LAMal « 250 à 450 CHF » et « ~12 % » → valeurs des articles détaillés (assurance-sante : GTE 2026 ; salaire-suisse-net)",
    "find": "La LAMal coûte environ 250 à 450 CHF/mois selon l'âge et la franchise choisie, et offre généralement une couverture meilleure que la CMU française. Tu cotises aussi pour la retraite suisse (AVS), le chômage, et l'assurance invalidité. Au total, compter ~12% de cotisations sociales prélevées à la source.",
    "replace": "Pour un frontalier de 25 à 35 ans, la prime LAMal se situe généralement entre 200 et 350 CHF par mois selon la caisse (GTE, primes 2026), et elle ne dépend pas de ton salaire. Tu cotises aussi pour la retraite (AVS et caisse de pension), le chômage et l'assurance accident : environ 15 % de ton salaire brut pour un célibataire à 7 000 CHF par mois ([le calcul détaillé](/blog/salaire-suisse-net-frontalier-2026))."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · « les frontaliers optent généralement pour LAMal… moins chère » contredit assurance-sante (dépend du salaire) → réécrit",
    "find": "Une fois frontalier, tu perds la couverture par la Sécurité Sociale française si tu n'y cotises plus. Tu dois t'inscrire à la CMU française (Couverture Maladie Universelle) si tu n'es pas couvert par un régime professionnel, OU tu restes couvert uniquement par LAMal suisse. [Les frontaliers optent généralement pour LAMal suisse](https://www.cleiss.fr/faq/droit_d_option_des_frontaliers_france-suisse.html), qui est plus complète et moins chère que CMU + mutuelle française.",
    "replace": "Si tu choisis le régime français, tu es affilié à l'Assurance maladie (CMU-PUMa), avec une cotisation calculée sur ton revenu. Le bon choix dépend surtout de ton salaire : en dessous d'environ 65 000 CHF brut par an, le régime français revient souvent moins cher ; au-dessus, la LAMal, dont la prime est fixe, prend l'avantage ([notre comparatif LAMal ou CMU-PUMa](/blog/assurance-sante-frontalier-lamal-cmu-budget)). Les règles du droit d'option sont expliquées par le [CLEISS](https://www.cleiss.fr/faq/droit_d_option_des_frontaliers_france-suisse.html)."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · Léman Express : Saint-Julien retiré de la liste (desservi en bus selon « villes »), « ~100 EUR » → Léman Pass ≈ 115 CHF (CFF, comme cout-transport)",
    "find": "dessert de nombreuses communes françaises (Saint-Julien, Etrembières, Annemasse). [Le trajet Annemasse–Genève-Eaux-Vives dure 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/), et les tarifs mensuels frontaliers sont subventionnés : compter ~100 EUR/mois pour un abonnement illimité.",
    "replace": "dessert de nombreuses communes françaises, Annemasse en tête. [Le trajet Annemasse–Genève-Eaux-Vives dure 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/), et l'[abonnement mensuel Léman Pass](https://www.sbb.ch/fr/billets-offres/abonnements/abon-parcours-communautaires/communautes-tarifaires/leman-pass.html) entre Annemasse et Genève coûte environ 115 CHF."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · abonnement TPG « ~80 EUR » sans source → retiré",
    "find": "Un abonnement mensuel frontalier coûte ~80 EUR pour une zone complète.\n\nAvantage : plus flexible",
    "replace": "Avantage : plus flexible"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · voiture : « péage Genève » (n'existe pas) retiré, coûts alignés sur cout-transport, Gaillard retiré",
    "find": "Beaucoup de frontaliers optent pour la voiture, surtout s'ils habitent à Saint-Julien, Gaillard, ou plus loin d'Annemasse. Coûts : essence (~100 EUR/mois), assurance (~80 EUR/mois), péage Genève pour les heures de pointe (~30 EUR/mois), usure du véhicule. Total : ~210+ EUR/mois, sans compter les parking à Genève.",
    "replace": "Beaucoup de frontaliers optent pour la voiture, surtout s'ils habitent loin d'une gare ou d'un arrêt de tram. Coûts : carburant (80 à 120 € par mois pour 20 à 25 km par jour), assurance (60 à 100 € par mois), vignette autoroutière suisse, entretien, et surtout le parking à Genève, souvent le premier poste : [le calcul complet du coût du transport](/blog/cout-transport-frontalier-geneve-2026)."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "BRIEF",
    "note": "B8 · « Où vivre ? » renvoie à « villes » (A1 ajouté à sa publication) ; D-B8b : loyers sans source, Ambilly « gare SNCF », Saint-Julien « Léman Express » et paragraphe Gaillard corrigés",
    "find": "La zone frontalière offre plusieurs options, chacune avec ses avantages et inconvénients.\n\n**Annemasse** (9 km de Genève)\n\nLa capitale française des frontaliers. Gare du Léman Express, dynamique commerciale, petite vie locale. Loyers moyens : 700 EUR pour un T2, 900+ pour un T3. Densité de frontaliers : très forte. Ambiance : urbaine et fonctionnelle.\n\n**Ambilly** (8 km de Genève)\n\nVillage-dortoir entre Annemasse et Genève. Calme, proche du Léman Express, gare SNCF traditionnelle. Maisons avec jardins. Population mixte. Loyers similaires à Annemasse. Ambiance : tranquille, résidentielle.\n\n**Ville-la-Grand** (7 km de Genève)\n\nEntre Ambilly et Annemasse. Réputée plus agréable architecturalement. Accès facile à Genève. Écoles réputées, services. Loyers : légèrement plus chers (+5 à 10%). Ambiance : semi-urbaine, plus diverse.\n\n**Saint-Julien** (12 km de Genève)\n\nUn peu plus éloigné, mais très apprécié pour la qualité de vie. Montagne visible, environnement plus rural. Accès Léman Express, bus TPG. Loyers : -10% par rapport à Annemasse. Ambiance : villages de montagne, nature. Parfait si tu aimes la rando et les espaces verts.\n\n**Gaillard** (6 km de Genève)\n\nTrès proche, but peu de transports en commun optimisés. Besoin de voiture pour la plupart. Loyers : -15% par rapport à Annemasse car moins accessible. Ambiance : dortoir-voiture.\n\n**Recommandation** : vis à Annemasse, Ambilly ou Ville-la-Grand si possible. Évite Gaillard sauf si tu as une voiture et aimes conduire.",
    "replace": "Sans voiture, vis à distance de marche d'une gare du Léman Express ou d'un arrêt du tram 17 : c'est ce critère qui fait ton quotidien, plus que le nom de la commune. [Notre comparatif des villes côté France](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donne les trajets et les loyers commune par commune.\n\n**Annemasse**\n\nLa capitale française des frontaliers. Gare du Léman Express, dynamique commerciale, petite vie locale. Densité de frontaliers : très forte. Ambiance : urbaine et fonctionnelle.\n\n**Ambilly**\n\nCollée à la frontière, entre Annemasse et Genève, desservie par le tram 17, direct sur Genève. Restaurants, commerces et marchés sur place. Ambiance : urbaine et multiculturelle.\n\n**Ville-la-Grand**\n\nJuste à côté d'Annemasse. Quartiers pavillonnaires calmes, écoles bien notées, Léman Express depuis la gare d'Annemasse. Ambiance : résidentielle et calme.\n\n**Saint-Julien-en-Genevois**\n\nDe l'autre côté de Genève, au sud-ouest, apprécié pour la qualité de vie. Montagne visible, environnement plus rural, accès direct en bus. Une bonne option si tu travailles côté Plainpalais ou Onex, et si tu aimes la rando et les espaces verts.\n\n**Recommandation** : sans voiture, avec un poste aux Eaux-Vives, à Champel ou dans le centre, vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · « +8 % par an » sans source → retiré",
    "find": "loyers en hausse (+8% par an), rareté",
    "replace": "loyers en hausse, rareté"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · exemple chiffré « 1 200 + 100 + 30 + 40 + 10 ≈ 1 400 EUR » sans source → renvoi au budget détaillé",
    "find": "Pour une location traditionnelle, additionne : loyer (1 200 EUR) + électricité (100 EUR) + internet (30 EUR) + eau (40 EUR) + assurance (10 EUR) ≈ 1 400 EUR. En coliving, c'est inclus d'une ligne.",
    "replace": "Pour une location traditionnelle, additionne le loyer, l'électricité, internet, l'eau et l'assurance habitation : [le vrai budget d'une colocation](/blog/budget-colocation-geneve-guide-complet) fait le calcul poste par poste. En coliving, tout tient en une ligne."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · second palier par maison (hors /tarifs, règle §1) et « solo ou en couple » (chambres pour une personne) → corrigés",
    "find": "À La Villa Coliving, nous proposons trois adresses dans la zone privilégiée : Le Loft à Ambilly (7 chambres, 1 430 CHF/mois), Le Lodge à Annemasse (12 chambres, 1 430 CHF/mois), et La Villa à Ville-la-Grand (10 chambres, dès 1 370 CHF/mois). Chaque chambre est privée, meublée, et tous les espaces communs (salon, cuisine, piscine, jardin) sont partagés. C'est le meilleur ratio confort/coût pour un frontalier solo ou en couple.",
    "replace": "À La Villa Coliving, nous avons trois maisons : La Villa à Ville-la-Grand (10 chambres), Le Loft à Ambilly (7 chambres) et Le Lodge à Annemasse (12 chambres), avec des chambres dès 1 370 CHF par mois tout inclus. Chaque chambre est privée, meublée et pensée pour une personne ; les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "BRIEF",
    "note": "B8 · « Conseils pratiques » renvoie à A3 ; D-B8b : LAMal « 4-6 semaines avant » (contredit le droit d'option) → permis G avant le 1er jour",
    "find": "Ouvre un compte bancaire français si tu n'en as pas. Souscris à LAMal suisse bien avant ta date d'arrivée (4-6 semaines avant). Informe ton employeur suisse",
    "replace": "Commence par ton logement : [notre calendrier de J-60 au jour J](/blog/trouver-logement-avant-d-arriver-geneve) te dit quoi faire et quand, même à distance. Ouvre un compte bancaire français si tu n'en as pas. Dépose ta demande de permis G avant ton premier jour de travail. Informe ton employeur suisse"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · « inscription au registre en mairie… nécessaire pour les impôts » (inexact) → droit d'option santé",
    "find": "Visite ta mairie locale, demande une inscription au registre (Ambilly, Ville-la-Grand). C'est rapide et nécessaire pour les impôts. Active ta couverture maladie.",
    "replace": "Compare tes options d'assurance maladie : ton droit d'option démarre à ta prise de poste, tu as trois mois pour choisir entre la LAMal et l'assurance maladie française, et le choix est irrévocable."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "D-B8b · comptable « 50 EUR/mois » sans source → sans prix",
    "find": "Engage un comptable franco-suisse pour optimiser tes déclarations fiscales (50 EUR/mois, ça rapporte).",
    "replace": "Si ta situation fiscale est complexe (quasi-résident, revenus des deux côtés), un comptable franco-suisse peut t'aider pour ta première déclaration."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "fr",
    "mechanism": "BRIEF",
    "note": "B8 · « À lire aussi » : ancre héritée « 5 erreurs à éviter… » → ancre de l'article arnaques",
    "find": "[5 erreurs à éviter quand on cherche un logement en tant que frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)",
    "replace": "[Arnaques au logement près de Genève : les repérer](/blog/arnaques-logement-frontalier-geneve-eviter)"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · \"rents 2-3 times higher\" unsourced → removed",
    "find": "Switzerland's high cost of living (rents 2-3 times higher than France) naturally pushes",
    "replace": "the cost of housing on the Swiss side naturally pushes"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · \"slightly lower contributions\", \"continuous indexing\" unsourced → net-salary benchmark (salaire-suisse-net)",
    "find": "Swiss social contributions are slightly lower, and more importantly, Swiss salaries benefit from continuous indexing to productivity and inflation.",
    "replace": "As a benchmark, for a single person on CHF 7,000 gross a month, about 70% of gross pay reaches your account once social contributions and withholding tax are taken off, before health insurance."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · \"30-40% cheaper\" and CHF 1,370 / 2,200+ comparison (rule A.4) → removed",
    "find": "On the other hand, French cost of living is structurally 30-40% cheaper. A rent of CHF 1,370 for a private room in a premium shared house in Haute-Savoie easily replaces CHF 2,200+ for a small studio in Switzerland. Groceries, restaurants, fuel: everything is cheaper in France.",
    "replace": "On the other hand, your rent, your groceries and your evenings out are paid at French prices. The gap varies from one item to the next: working it out item by item is what tells you how much you keep."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "BRIEF",
    "note": "B8 · two PAA H2s after \"The financial advantage\" (+ D-B8b: unsourced \"€800 to €1,500 savings\" removed)",
    "find": "The net monthly financial advantage for a single cross-border worker? Expect €800 to €1,500 additional savings each month compared to working in Geneva with Swiss housing. Over a career, that's substantial wealth accumulation.\n\n## The tax system: withholding tax, CMU, LAMal",
    "replace": "## Is it worth working in Switzerland and living in France?\n\nFinancially, that's the equation that brings cross-border workers here: your salary is paid in Swiss francs, while your rent and groceries are paid at French prices. What narrows the gap: health insurance, transport and commuting time, and the exchange rate, which can move either way.\n\nThree calculations give you the answer for your own situation:\n\n- [what life costs on each side, item by item](/en/blog/cout-de-la-vie-suisse-france-frontalier-2026);\n- [your Swiss net salary](/en/blog/salaire-suisse-net-frontalier-2026), once contributions and withholding tax are taken off;\n- [your cross-border taxes](/en/blog/fiscalite-frontalier-geneve-impots-2026), which depend on the canton you work in.\n\n## How do you work in Switzerland and live in France?\n\nIn this order: an employment contract with a Geneva employer, a home on the French side, your G permit application, your choice of health insurance, then your first tax return in France. Each step has its own detailed guide.\n\n1. **The employment contract.** It unlocks everything else: your G permit, your rental file, your health insurance.\n2. **A home on the French side.** For the G permit, you need a home in France that you return to at least once a week. If you can't view places before you arrive, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) runs from D-60 to day 0.\n3. **The G permit.** As an EU or EFTA national, you file the application yourself online with the OCPM, before your first day at work; you can start as soon as your complete application has been sent (OCPM, October 2026). [Our G permit guide](/en/blog/permis-g-frontalier-geneve) covers the conditions.\n4. **Health insurance.** Your start date opens a three-month right of option between LAMal and French health insurance, and the choice is final (ameli.fr, April 2026): [LAMal or CMU-PUMa, compared](/en/blog/assurance-sante-frontalier-lamal-cmu-budget).\n5. **Your tax return.** Your salary is taxed at source in Geneva, but you also declare it in France every spring: [the return, step by step](/en/blog/declaration-impots-frontalier-2026).\n\n## The tax system: withholding tax, CMU, LAMal"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · LAMal \"250 to 450 CHF\" and \"~12%\" → detailed articles' values (assurance-sante: GTE 2026; salaire-suisse-net)",
    "find": "LAMal costs about 250 to 450 CHF/month depending on age and the deductible you choose, and typically offers better coverage than French CMU. You also contribute to Swiss retirement (AVS), unemployment, and disability insurance. Total: ~12% in social contributions withheld at source.",
    "replace": "For a cross-border worker aged 25 to 35, the LAMal premium is usually between CHF 200 and 350 a month depending on the insurer (GTE, 2026 premiums), and it doesn't depend on your salary. You also pay into retirement (AVS and a pension fund), unemployment and accident insurance: about 15% of your gross salary for a single person on CHF 7,000 a month ([the detailed calculation](/en/blog/salaire-suisse-net-frontalier-2026))."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · \"most cross-border workers choose LAMal… cheaper\" contradicts assurance-sante (depends on salary) → rewritten",
    "find": "Once you're a cross-border worker, you lose French Social Security coverage if you're no longer contributing there. You must either enroll in French CMU (Universal Health Coverage) if not covered by an occupational scheme, OR remain covered only by Swiss LAMal. [Most cross-border workers choose Swiss LAMal](https://www.cleiss.fr/faq/droit_d_option_des_frontaliers_france-suisse.html), which is more comprehensive and cheaper than CMU plus a French supplementary policy.",
    "replace": "If you choose the French system, you join French health insurance (CMU-PUMa), with a contribution based on your income. The right choice depends mostly on your salary: below roughly CHF 65,000 gross a year, the French system often works out cheaper; above that, LAMal, whose premium is fixed, takes the lead ([our LAMal vs CMU-PUMa comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget)). The rules of the right of option are explained by [CLEISS](https://www.cleiss.fr/faq/droit_d_option_des_frontaliers_france-suisse.html)."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · Léman Express: Saint-Julien removed from the list, \"~€100\" → Léman Pass ≈ CHF 115 (SBB, as in cout-transport)",
    "find": "serves many French communes (Saint-Julien, Etrembières, Annemasse). [The Annemasse–Geneva Eaux-Vives journey takes 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/), and cross-border monthly fares are subsidized: expect ~€100/month for unlimited passes.",
    "replace": "serves many French towns, Annemasse first among them. [The Annemasse–Geneva Eaux-Vives journey takes 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/), and a monthly [Léman Pass](https://www.sbb.ch/fr/billets-offres/abonnements/abon-parcours-communautaires/communautes-tarifaires/leman-pass.html) between Annemasse and Geneva costs about CHF 115."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · TPG pass \"~€80\" unsourced → removed",
    "find": "A monthly cross-border pass costs ~€80 for complete coverage.\n\nAdvantage: more flexible",
    "replace": "Advantage: more flexible"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · car: \"Geneva peak-hour toll\" (does not exist) removed, costs aligned on cout-transport, Gaillard removed",
    "find": "Many cross-border workers choose cars, especially if they live in Saint-Julien, Gaillard, or further from Annemasse. Costs: fuel (~€100/month), insurance (~€80/month), Geneva peak-hour toll (~€30/month), vehicle wear. Total: €210+/month, not counting Geneva parking.",
    "replace": "Many cross-border workers choose cars, especially if they live far from a station or a tram stop. Costs: fuel (€80 to €120 a month for 20 to 25 km a day), insurance (€60 to €100 a month), the Swiss motorway vignette, servicing, and above all parking in Geneva, often the biggest item: [the full cost of commuting](/en/blog/cout-transport-frontalier-geneve-2026)."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "BRIEF",
    "note": "B8 · \"Where to live?\" links to the towns guide (A1 added at its publication); D-B8b: unsourced rents, Ambilly \"SNCF station\", Saint-Julien \"Léman Express\" and the Gaillard paragraph corrected",
    "find": "The cross-border zone offers several options, each with advantages and disadvantages.\n\n**Annemasse** (9 km from Geneva)\n\nThe capital of French cross-border workers. Léman Express station, commercial activity, local life. Average rents: €700 for a 2-room, €900+ for 3-room. Cross-border worker density: very high. Vibe: urban and functional.\n\n**Ambilly** (8 km from Geneva)\n\nBedroom village between Annemasse and Geneva. Quiet, close to Léman Express, traditional SNCF station. Houses with gardens. Mixed population. Rents similar to Annemasse. Vibe: tranquil, residential.\n\n**Ville-la-Grand** (7 km from Geneva)\n\nBetween Ambilly and Annemasse. Considered more architecturally pleasant. Easy Geneva access. Reputed schools, services. Rents: slightly higher (+5-10%). Vibe: semi-urban, more diverse.\n\n**Saint-Julien** (12 km from Geneva)\n\nA bit farther, but highly appreciated for quality of life. Mountains visible, rural environment. Léman Express access, TPG buses. Rents: -10% vs. Annemasse. Vibe: mountain villages, nature. Perfect if you love hiking and green spaces.\n\n**Gaillard** (6 km from Geneva)\n\nVery close but few optimized public transport options. Car needed for most people. Rents: -15% vs. Annemasse due to poor accessibility. Vibe: car-dependent dormitory.\n\n**Recommendation**: live in Annemasse, Ambilly, or Ville-la-Grand if possible. Avoid Gaillard unless you have a car and enjoy commuting.",
    "replace": "Without a car, live within walking distance of a Léman Express station or a tram 17 stop: that, more than the name of the town, is what shapes your day-to-day. [Our comparison of French towns near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) gives commutes and rents town by town.\n\n**Annemasse**\n\nThe capital of French cross-border workers. Léman Express station, plenty of shops, local life. Cross-border worker density: very high. Vibe: urban and functional.\n\n**Ambilly**\n\nRight on the border, between Annemasse and Geneva, served by tram 17, which runs straight into Geneva. Restaurants, shops and markets on the spot. Vibe: urban and multicultural.\n\n**Ville-la-Grand**\n\nRight next to Annemasse. Quiet residential streets, well-rated schools, the Léman Express from Annemasse station. Vibe: residential and calm.\n\n**Saint-Julien-en-Genevois**\n\nOn the other side of Geneva, to the south-west, popular for its quality of life. Mountain views, a more rural setting, direct bus links. A good option if you work around Plainpalais or Onex, and if you like hiking and green space.\n\n**Recommendation**: without a car, with a job in Eaux-Vives, Champel or the centre, aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · \"+8% yearly\" unsourced → removed",
    "find": "rising rents (+8% yearly), scarcity",
    "replace": "rising rents, scarcity"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · worked example \"€1,200 + 100 + 30 + 40 + 10 ≈ €1,400\" unsourced → link to the detailed budget",
    "find": "For traditional rentals, add: rent (€1,200) + electricity (€100) + internet (€30) + water (€40) + insurance (€10) ≈ €1,400. In coliving, it's one line.",
    "replace": "For a traditional rental, add up rent, electricity, internet, water and home insurance: [the real cost of a flatshare](/en/blog/budget-colocation-geneve-guide-complet) works it out line by line. In coliving, it's one line."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · second price tier per house (outside /tarifs, rule §1) and \"single … or couple\" (rooms are for one person) → corrected",
    "find": "At La Villa Coliving, we offer three premium locations: Le Loft in Ambilly (7 rooms, CHF 1,430/month), Le Lodge in Annemasse (12 rooms, CHF 1,430/month), and La Villa in Ville-la-Grand (10 rooms, from CHF 1,370/month). Each room is private and furnished; all shared spaces (living room, kitchen, pool, garden) are communal. It's the best comfort/cost ratio for a single cross-border worker or couple.",
    "replace": "At La Villa Coliving, we have three houses: La Villa in Ville-la-Grand (10 rooms), Le Loft in Ambilly (7 rooms) and Le Lodge in Annemasse (12 rooms), with rooms from CHF 1,370 a month all inclusive. Each room is private, furnished and meant for one person; the shared spaces (living room, kitchen, pool, sauna, gym) are communal."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "BRIEF",
    "note": "B8 · \"Practical tips\" links to A3; D-B8b: LAMal \"4-6 weeks ahead\" (contradicts the right of option) → G permit before day one",
    "find": "Open a French bank account if you don't have one. Subscribe to Swiss LAMal well before arrival (4-6 weeks ahead). Inform your Swiss employer",
    "replace": "Start with your home: [our countdown from D-60 to day 0](/en/blog/trouver-logement-avant-d-arriver-geneve) tells you what to do and when, even from a distance. Open a French bank account if you don't have one. File your G permit application before your first day at work. Inform your Swiss employer"
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · \"town hall registration… necessary for taxes\" (inaccurate) → health insurance right of option",
    "find": "Visit your local town hall, request registration (Ambilly, Ville-la-Grand). It's quick and necessary for taxes. Activate health coverage.",
    "replace": "Compare your health insurance options: your right of option starts on your first day at work, you have three months to choose between LAMal and French health insurance, and the choice is final."
  },
  {
    "slug": "living-in-france-working-in-geneva",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "D-B8b · accountant \"€50+/month\" unsourced → no price",
    "find": "Hire a Franco-Swiss accountant to optimize tax filings (€50+/month, worth it).",
    "replace": "If your tax situation is complex (quasi-resident status, income on both sides), a Franco-Swiss accountant can help with your first return."
  }
];

export function buildEdits() {
  return EDITS.map((e) => ({ ...e }));
}
