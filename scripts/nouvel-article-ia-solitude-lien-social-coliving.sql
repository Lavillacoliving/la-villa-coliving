-- ============================================================================
-- Nouvel article : ia-solitude-lien-social-coliving (article de service, sans prix)
-- Généré le 2026-11-19 par scripts/build-article-sql.mjs depuis content/decision-pages/ia-solitude-lien-social-coliving.{fr,en}.md + .meta.json
-- Mode : insert (brouillon, is_published = false) · à appliquer par Jérôme (SQL Editor / MCP)
-- Relecture : https://www.lavillacoliving.com/blog/ia-solitude-lien-social-coliving?preview=lavilla2026 (et /en/blog/…)
-- ============================================================================

BEGIN;

INSERT INTO public.blog_posts (
  slug, title_fr, title_en, excerpt_fr, excerpt_en, meta_description_fr, meta_description_en, content_fr, content_en, author, category, image_url, read_time_min, tags, source, is_published, published_at, updated_at
) VALUES (
  'ia-solitude-lien-social-coliving',
  'IA et solitude : demain, le vrai luxe sera humain',
  'AI and loneliness: tomorrow''s real luxury is human',
  'L''IA devient l''intermédiaire de tout, et nos petites rencontres du quotidien disparaissent sans bruit. Ce qu''on y gagne, ce qu''on y perd, et pourquoi le lien humain va devenir le vrai luxe.',
  'AI is becoming the go-between for everything, and our small everyday encounters are quietly disappearing. What we gain, what we lose, and why human connection is becoming the real luxury.',
  'L''IA fait de plus en plus à ta place, et tes rencontres du quotidien disparaissent. Les chiffres, ce qu''on y gagne, et comment recréer du lien.',
  'AI does more and more for you, and your everyday encounters are fading. The numbers, what we gain, and how to rebuild real human connection.',
  $fr$Une personne sur six dans le monde souffre de solitude. Ce n'est pas un slogan : c'est le constat de l'[Organisation mondiale de la santé](https://who.int/news/item/30-06-2025-social-connection-linked-to-improved-heath-and-reduced-risk-of-early-death), qui a fait du lien social une priorité de santé publique en 2025. Selon elle, la solitude est associée à environ 871 000 décès chaque année.

En France, ce ne sont pas les plus âgés qui se sentent le plus seuls. Ce sont les 25-39 ans : [35 % d'entre eux](https://www.carenews.com/fondation-de-france/news/35-des-jeunes-ages-de-25-a-39-ans-se-sentent-seuls-la-fondation-de-france) se disent particulièrement seuls, deux fois plus que les 60-69 ans (Fondation de France). Et c'est dans les grandes villes, là où l'on est le plus entouré, que [la solitude se fait le plus sentir](https://www.banquedesterritoires.fr/solitude-des-villes-isolement-des-champs-la-fondation-de-france-appelle-prendre-soin-de-nos-liens).

Le paradoxe est connu : on n'a jamais été aussi connectés. Ce qui l'est moins, c'est la vague qui arrive, et qui pourrait accentuer le phénomène sans que personne ne s'en rende compte : l'intelligence artificielle.

## On n'a jamais aussi peu vu les autres

Les chiffres américains, souvent en avance sur les nôtres, donnent le ton. Le temps que les Américains passent chaque jour à voir d'autres personnes est [passé de 45 à 35 minutes](https://www.axios.com/2026/07/05/americans-socializing-decline) en une vingtaine d'années. Chez les 15-24 ans, il a presque été divisé par deux : d'une heure à 35 minutes par jour.

Le télétravail a ajouté sa part. En France, la Dares observe que [le risque d'isolement augmente avec la fréquence du télétravail](https://www.vie-publique.fr/en-bref/298096-teletravail-quels-risques-psychosociaux), surtout chez les personnes qui vivent seules. Le bureau était un lieu de rencontres. Pour beaucoup, il ne l'est plus qu'à temps partiel.

Mais le télétravail n'est qu'un début.

## L'IA, nouvel intermédiaire de toutes nos interactions

L'IA générative est entrée dans la vie des Français à une vitesse rare : [48 % l'utilisent déjà](https://www.vie-publique.fr/en-bref/301989-barometre-du-numerique-2026-48-dutilisateurs-de-lia), contre 33 % un an plus tôt, et 85 % des jeunes adultes (Baromètre du numérique 2026). Surtout, elle ne se contente plus de répondre à nos questions. Elle commence à agir à notre place.

- **Le commerce.** Des agents IA comparent, choisissent et achètent pour nous. Selon [McKinsey](https://www.mckinsey.com/industries/retail/our-insights/who-wins-when-ai-does-the-shopping-new-evidence-on-agentic-commerce), environ un consommateur sur deux utilise déjà l'IA pour faire ses achats, et le commerce orchestré par des agents pourrait peser [3 000 à 5 000 milliards de dollars](https://www.mckinsey.com/industries/retail/our-insights/the-agentic-commerce-opportunity-how-ai-agents-are-ushering-in-a-new-era-for-consumers-and-merchants) d'ici 2030.
- **Le service client.** [Gartner prévoit](https://www.gartner.com/en/newsroom/press-releases/2025-03-05-gartner-predicts-agentic-ai-will-autonomously-resolve-80-percent-of-common-customer-service-issues-without-human-intervention-by-20290) que d'ici 2029, 80 % des demandes courantes seront traitées par une IA, sans aucun humain.
- **Le web.** Aux États-Unis, [68 % des recherches Google](https://searchengineland.com/google-zero-click-searches-reach-68-in-early-2026-study-479717) se terminent désormais sans aucun clic. L'IA répond, on ne va plus voir personne.
- **Les réseaux sociaux.** Ils sont de moins en moins sociaux. Selon [les propres chiffres de Meta](https://www.fastcompany.com/91386830/meta-social-media-ftc-monopoly-response), la part du temps passé à regarder des contenus publiés par des amis est tombée de 22 % à 17 % sur Facebook, et de 11 % à 7 % sur Instagram, entre 2023 et 2025. Le reste est choisi par un algorithme.
- **Les relations elles-mêmes.** Aux États-Unis, [72 % des adolescents](https://commonsensemedia.org/press-releases/nearly-3-in-4-teens-have-used-ai-companions-new-national-survey-finds) ont déjà discuté avec un « compagnon » IA. Et Mark Zuckerberg, le patron de Meta, [propose ouvertement des amis artificiels](https://www.entrepreneur.com/business-news/meta-ceo-mark-zuckerberg-wants-you-to-make-ai-friends/491349) pour combler le manque d'amis réels.

## Soyons justes : l'IA nous rend de vrais services

Il serait malhonnête de s'arrêter là. Ces changements, on les adopte parce qu'ils nous simplifient la vie, et ils le font réellement.

L'IA nous débarrasse de ce qui n'a aucune valeur pour nous : comparer vingt offres, remplir un formulaire, patienter une demi-heure au téléphone, rédiger un courrier administratif. Elle met à la portée de chacun ce qui était réservé à quelques-uns : comprendre un contrat, apprendre une langue, se faire expliquer un sujet complexe, se lancer dans un nouveau métier. Au travail, elle aide surtout ceux qui en ont le plus besoin : dans une [étude menée auprès de plus de 5 000 conseillers clients](https://www.nber.org/papers/w31161), l'IA a augmenté la productivité de 14 % en moyenne, et de 34 % chez les débutants.

Du temps gagné, moins de charge mentale, des savoirs plus accessibles : ce sont de vrais progrès, et il n'y a aucune raison d'y renoncer.

Mais à chaque fois, l'échange est le même. On gagne du temps, du confort, de l'efficacité. Et on perd, presque sans s'en apercevoir, une occasion de croiser quelqu'un. Pris un par un, ces renoncements sont minuscules. Mis bout à bout, ils dessinent un quotidien où l'on peut passer une journée entière sans parler à personne.

C'est un compromis que l'on accepte collectivement, et souvent à raison. Le problème n'est pas l'IA. C'est de ne pas voir ce qu'elle emporte avec elle, et de ne rien reconstruire à la place.

## Ce que l'on perd vraiment : les petites rencontres

Le vrai risque n'est pas qu'on remplace nos amis par des chatbots. Dans les faits, [moins de 2 % des messages](https://gizmodo.com/openai-how-people-use-chatgpt-2000658906) envoyés à ChatGPT portent sur les relations ou la réflexion personnelle (étude OpenAI, 2025).

Le risque est plus discret : l'IA supprime les occasions de croiser des humains. Le vendeur qui nous conseillait, la voix au téléphone, le collègue près de la machine à café, l'ami dont on voyait passer les nouvelles. Ces liens « faibles » paraissent anodins. Ils ne le sont pas.

Une expérience des psychologues Gillian Sandstrom et Elizabeth Dunn l'a [bien montré](https://www.psychologytoday.com/us/blog/ulterior-motives/201407/why-other-people-are-the-key-our-happiness). Des clients d'un café devaient soit passer commande le plus efficacement possible, soit échanger quelques mots avec le serveur : un sourire, un regard, une courte conversation. Ceux qui avaient pris ce temps ressortaient de meilleure humeur, avec un plus fort sentiment d'appartenance.

C'est précisément ce type d'échange que l'IA rend inutile. Et parler davantage aux machines ne compense pas : une étude du [MIT Media Lab et d'OpenAI](https://www.media.mit.edu/articles/study-finds-extensive-ai-chatbot-use-can-deepen-feelings-of-loneliness/) associe au contraire un usage intensif des chatbots à davantage de solitude et à moins d'interactions réelles.

## Quand l'humain devient rare, il devient précieux

Bonne nouvelle : les gens résistent. [Quatre consommateurs sur cinq](https://www.customerexperiencedive.com/news/customers-dislike-ai-customer-service/) préfèrent parler à un humain plutôt qu'à une IA au service client, même à résultat et délai égaux.

Les entreprises l'apprennent parfois à leurs dépens. En 2024, Klarna se vantait que son assistant IA faisait le travail de 700 conseillers. Un an plus tard, l'entreprise [réembauchait des humains](https://gizmodo.com/klarna-hiring-back-human-help-after-going-all-in-on-ai-2000600767) : la qualité n'était pas au rendez-vous.

Tout ce qui se raréfie prend de la valeur. Demain, l'information et la commodité seront abondantes : l'IA les fournira à volonté. Ce qui sera rare, c'est la présence. Un dîner partagé, une discussion qui s'éternise, quelqu'un qui remarque que tu as eu une mauvaise journée.

Et s'il est un lieu du quotidien qui résiste naturellement à la dématérialisation, c'est le logement. On peut tout commander, tout déléguer, tout automatiser : on rentre toujours chez soi le soir. La vraie question, c'est : qui y croise-t-on ?

## La Villa : on ne vend pas un logement, on crée des occasions

L'IA promet de nous libérer des tâches du quotidien. À La Villa, nous faisons la même chose, avec un objectif inverse : rendre ce temps libéré aux autres.

Car La Villa n'est pas un logement. C'est une suite d'occasions de vivre des moments forts avec des gens qu'on finit par aimer. Notre rôle, à Fanny et moi, tient en une phrase : tout faire pour que les liens se créent. Concrètement, cela passe par trois leviers.

### 1. Enlever ce qui sépare

Dans toute vie partagée, ce sont rarement les grandes choses qui abîment les relations. Ce sont les petites : la vaisselle qui traîne, le ménage que personne ne fait, le produit que personne ne rachète. Alors nous les avons supprimées. Le ménage des espaces communs, la vaisselle et les petites courses du quotidien sont pris en charge. Sans ces points de friction, il ne reste entre les résidents que le plaisir d'être ensemble.

### 2. Créer ce qui rassemble

Le lien ne se décrète pas, il se provoque. Nous organisons des cours de sport, des événements, des soirées pizza : des rendez-vous simples qui donnent une raison de se retrouver. Personne n'est obligé de venir, mais il y a toujours une bonne raison de rejoindre les autres.

### 3. Un cadre qui donne envie de rester

On va d'autant plus volontiers vers les autres qu'on a un vrai chez-soi où se retirer. C'est pourquoi [nos maisons](/nos-maisons) combinent de grands espaces individuels et de grands espaces collectifs. Et toutes sont équipées pour se retrouver : piscine, sauna, salle de sport, salle de jeux, home cinéma.

Notre métier n'est pas de fournir des mètres carrés et des meubles. C'est de faire en sorte que des personnes qui ne se connaissaient pas se sentent un jour chez elles, ensemble, que ce soit lors d'une soirée pizza ou au bord de la piscine un dimanche après-midi. Si tu veux voir à quoi ça ressemble au quotidien, on l'a raconté dans [la vie dans nos maisons](/blog/coliving-communaute-reels-amis-geneve-annemasse).

Dans un monde où l'IA supprime une à une les occasions de se croiser, nous faisons le chemin inverse : nous les multiplions.

## Pour qui c'est fait (et pour qui ça ne l'est pas)

La Villa s'adresse à celles et ceux qui veulent garder leur indépendance sans vivre seuls : qui ont besoin d'un vrai espace à eux, et qui ont aussi envie de rentrer le soir dans une maison vivante. Ceux qui arrivent dans une nouvelle ville, qui télétravaillent, ou qui ont simplement compris que les plus beaux moments se vivent rarement seul. Si tu découvres la région, on a aussi écrit un guide pour [choisir entre Annemasse, Ville-la-Grand et Ambilly](/blog/colocation-annemasse-ville-la-grand-ambilly).

Si tu cherches l'anonymat complet et ne souhaites croiser personne, ce n'est sans doute pas pour toi. Et c'est très bien ainsi : une communauté se construit avec des gens qui ont envie d'en faire partie.

## Et maintenant ?

L'IA va nous faire gagner un temps considérable. C'est une excellente nouvelle, à une condition : savoir ce qu'on en fait, et avec qui.

Le logement n'est plus seulement l'endroit où l'on dort. Il peut devenir l'endroit où l'on retrouve ce que le reste de nos journées nous retire peu à peu : les autres. Choisir où l'on vit, c'est aussi choisir avec qui l'on vit.

Si ça te parle, [découvre nos maisons](/nos-maisons) ou [candidate en ligne](/candidature) : on te répond sous 48 h.
$fr$,
  $en$One in six people worldwide is lonely. That's not a slogan: it's the finding of the [World Health Organization](https://who.int/news/item/30-06-2025-social-connection-linked-to-improved-heath-and-reduced-risk-of-early-death), which made social connection a public health priority in 2025. By its estimate, loneliness is linked to around 871,000 deaths every year.

In France, the loneliest people aren't the oldest. They're the 25-to-39-year-olds: [35% of them](https://www.carenews.com/fondation-de-france/news/35-des-jeunes-ages-de-25-a-39-ans-se-sentent-seuls-la-fondation-de-france) say they feel particularly lonely, twice as many as people aged 60 to 69 (Fondation de France). And it's in big cities, where we're surrounded by the most people, that [loneliness is felt the most](https://www.banquedesterritoires.fr/solitude-des-villes-isolement-des-champs-la-fondation-de-france-appelle-prendre-soin-de-nos-liens).

The paradox is well known: we've never been so connected. What's less obvious is the wave that's coming, and that could make things worse without anyone really noticing: artificial intelligence.

## We've never seen so little of each other

The American numbers, often a few years ahead of ours, set the tone. The time Americans spend each day with other people has [dropped from 45 to 35 minutes](https://www.axios.com/2026/07/05/americans-socializing-decline) in about twenty years. Among 15-to-24-year-olds, it has almost halved: from an hour a day to 35 minutes.

Remote work has played its part too. In France, the government's labour research office (Dares) found that [the risk of isolation rises with how often people work from home](https://www.vie-publique.fr/en-bref/298096-teletravail-quels-risques-psychosociaux), especially for those who live alone. The office used to be a place where you met people. For many, it now only is part of the week.

But remote work is just the beginning.

## AI, the new go-between for everything we do

Generative AI has entered people's lives in France at a rare speed: [48% already use it](https://www.vie-publique.fr/en-bref/301989-barometre-du-numerique-2026-48-dutilisateurs-de-lia), up from 33% a year earlier, and 85% of young adults (2026 Digital Barometer). More importantly, it no longer just answers our questions. It's starting to act on our behalf.

- **Shopping.** AI agents compare, choose and buy for us. According to [McKinsey](https://www.mckinsey.com/industries/retail/our-insights/who-wins-when-ai-does-the-shopping-new-evidence-on-agentic-commerce), roughly one consumer in two already uses AI to shop, and commerce run by agents could be worth [3 to 5 trillion dollars](https://www.mckinsey.com/industries/retail/our-insights/the-agentic-commerce-opportunity-how-ai-agents-are-ushering-in-a-new-era-for-consumers-and-merchants) by 2030.
- **Customer service.** [Gartner predicts](https://www.gartner.com/en/newsroom/press-releases/2025-03-05-gartner-predicts-agentic-ai-will-autonomously-resolve-80-percent-of-common-customer-service-issues-without-human-intervention-by-20290) that by 2029, 80% of common requests will be handled by AI, with no human involved.
- **The web.** In the United States, [68% of Google searches](https://searchengineland.com/google-zero-click-searches-reach-68-in-early-2026-study-479717) now end without a single click. The AI answers, and nobody visits anyone anymore.
- **Social media.** It's getting less and less social. According to [Meta's own figures](https://www.fastcompany.com/91386830/meta-social-media-ftc-monopoly-response), the share of time spent viewing posts from friends fell from 22% to 17% on Facebook, and from 11% to 7% on Instagram, between 2023 and 2025. The rest is picked by an algorithm.
- **Relationships themselves.** In the United States, [72% of teenagers](https://commonsensemedia.org/press-releases/nearly-3-in-4-teens-have-used-ai-companions-new-national-survey-finds) have already chatted with an AI "companion". And Mark Zuckerberg, Meta's CEO, [openly pitches artificial friends](https://www.entrepreneur.com/business-news/meta-ceo-mark-zuckerberg-wants-you-to-make-ai-friends/491349) to make up for the lack of real ones.

## To be fair: AI genuinely helps us

It would be dishonest to stop there. We adopt these changes because they make life easier, and they really do.

AI takes care of the things that mean nothing to us: comparing twenty offers, filling in a form, waiting half an hour on the phone, writing an admin letter. It puts within everyone's reach what used to be reserved for a few: understanding a contract, learning a language, getting a complex topic explained, starting out in a new career. At work, it helps most the people who need it most: in a [study of more than 5,000 customer support agents](https://www.nber.org/papers/w31161), AI raised productivity by 14% on average, and by 34% for beginners.

Time saved, less mental load, knowledge that's easier to reach: these are real gains, and there's no reason to give them up.

But every time, the trade is the same. We gain time, comfort and efficiency. And we lose, almost without noticing, a chance to run into someone. One by one, these small losses are tiny. Added up, they make for days where you can go from morning to night without talking to anyone.

It's a trade-off we accept collectively, and often rightly so. The problem isn't AI. It's not seeing what it takes away with it, and not rebuilding anything in its place.

## What we really lose: the small encounters

The real risk isn't that we'll replace our friends with chatbots. In practice, [less than 2% of messages](https://gizmodo.com/openai-how-people-use-chatgpt-2000658906) sent to ChatGPT are about relationships or personal reflection (OpenAI study, 2025).

The risk is quieter: AI removes the occasions to cross paths with other humans. The shop assistant who used to give us advice, the voice on the phone, the colleague by the coffee machine, the friend whose news we used to see. These "weak ties" seem trivial. They aren't.

An experiment by psychologists Gillian Sandstrom and Elizabeth Dunn [showed it clearly](https://www.psychologytoday.com/us/blog/ulterior-motives/201407/why-other-people-are-the-key-our-happiness). Coffee shop customers were asked either to order as efficiently as possible, or to have a short exchange with the barista: a smile, eye contact, a brief chat. Those who took the time left in a better mood, with a stronger sense of belonging.

That's exactly the kind of exchange AI makes unnecessary. And talking to machines more doesn't make up for it: a study by [MIT Media Lab and OpenAI](https://www.media.mit.edu/articles/study-finds-extensive-ai-chatbot-use-can-deepen-feelings-of-loneliness/) links heavy chatbot use to more loneliness and fewer real-life interactions, not less.

## When human contact becomes rare, it becomes precious

The good news: people push back. [Four consumers out of five](https://www.customerexperiencedive.com/news/customers-dislike-ai-customer-service/) would rather talk to a human than to an AI in customer service, even with the same outcome and the same wait.

Companies sometimes learn this the hard way. In 2024, Klarna boasted that its AI assistant was doing the work of 700 agents. A year later, the company was [hiring humans again](https://gizmodo.com/klarna-hiring-back-human-help-after-going-all-in-on-ai-2000600767): the quality just wasn't there.

Whatever becomes scarce gains value. Tomorrow, information and convenience will be abundant: AI will supply them on tap. What will be rare is presence. A shared dinner, a conversation that runs late, someone who notices you've had a bad day.

And if there's one part of daily life that naturally resists going digital, it's home. You can order everything, delegate everything, automate everything: you still come home in the evening. The real question is: who do you find there?

## La Villa: we don't sell housing, we create occasions

AI promises to free us from everyday chores. At La Villa, we do the same thing, with the opposite goal: giving that freed-up time back to other people.

Because La Villa isn't just a place to live. It's a string of occasions to share great moments with people you end up caring about. Our job, Fanny's and mine, fits in one sentence: do everything we can so that bonds form. In practice, that comes down to three things.

### 1. Remove what keeps people apart

In any shared home, it's rarely the big things that damage relationships. It's the small ones: the dishes left in the sink, the cleaning nobody does, the basics nobody rebuys. So we got rid of them. Cleaning of the shared spaces, the dishes and the small everyday groceries are taken care of. Without those points of friction, all that's left between residents is the pleasure of being together.

### 2. Create what brings people together

You can't order people to bond, but you can make it happen. We organise sports classes, events and pizza nights: simple get-togethers that give everyone a reason to meet. Nobody has to come, but there's always a good reason to join the others.

### 3. A setting that makes you want to stay

People reach out to others more easily when they have a real space of their own to retreat to. That's why [our houses](/en/nos-maisons) combine large private spaces with large shared ones. And every one of them is equipped for spending time together: pool, sauna, gym, games room, home cinema.

Our job isn't to provide square metres and furniture. It's to make people who didn't know each other feel at home one day, together, whether over a pizza night or by the pool on a Sunday afternoon. If you want to see what that looks like day to day, we wrote about [life in our houses](/en/blog/coliving-communaute-reels-amis-geneve-annemasse).

In a world where AI removes the occasions to cross paths one by one, we're going the other way: we multiply them.

## Who it's for (and who it isn't for)

La Villa is for people who want to keep their independence without living alone: who need a real space of their own, and who also want to come home in the evening to a house that feels alive. People who've just moved to a new city, who work from home, or who have simply figured out that the best moments are rarely lived alone. If you're new to the area, we also wrote a guide to [choosing between Annemasse, Ville-la-Grand and Ambilly](/en/blog/colocation-annemasse-ville-la-grand-ambilly).

If you're looking for complete anonymity and don't want to run into anyone, it's probably not for you. And that's absolutely fine: a community is built with people who want to be part of it.

## So, what now?

AI is going to save us a huge amount of time. That's great news, on one condition: knowing what we do with it, and who with.

Home is no longer just the place where we sleep. It can become the place where we get back what the rest of our days slowly takes away: other people. Choosing where you live is also choosing who you live with.

If this speaks to you, [discover our houses](/en/nos-maisons) or [apply online](/en/candidature): we'll get back to you within 48 hours.
$en$,
  'Jerome Austin',
  'community',
  '/images/ia-lien-social-coliving.webp',
  9,
  ARRAY['intelligence artificielle', 'solitude', 'lien social', 'communauté', 'coliving'],
  'manual',
  false,
  NULL,
  now()
);

COMMIT;

-- Vérification :
--   SELECT slug, is_published, published_at, updated_at, read_time_min, length(content_fr) AS fr, length(content_en) AS en,
--          (SELECT count(*) FROM regexp_matches(content_fr, '\*\*[^*]+\?\*\*', 'g')) AS faq_fr,
--          position('<!-- entity-facts -->' IN content_fr) AS marker_fr, position('<!-- entity-facts -->' IN content_en) AS marker_en
--   FROM blog_posts WHERE slug = 'ia-solitude-lien-social-coliving';
