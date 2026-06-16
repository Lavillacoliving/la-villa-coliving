-- ════════════════════════════════════════════════════════════════════════
-- FUSION → demenager-geneve-frontalier-checklist
-- Récupère le contenu UNIQUE de : arriver-seul-geneve-guide-30-jours
-- puis insère les sections dans la page CIBLE (avant la conclusion).
-- À LANCER AVANT la dépublication (09) et AVANT le rebuild.
-- Idempotent : ne réinsère pas si déjà présent (garde-fou sur une phrase unique).
-- Aperçu lisible du contenu ajouté : scripts/consolidation/salvage/demenager-geneve-frontalier-checklist.fr.md / .en.md
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET content_fr = replace(content_fr, $a$## À lire aussi$a$, $LVfr$## Vos 30 premiers jours, jour par jour (si vous arrivez seul)

La checklist ci-dessus couvre le « quoi ». Voici le « quand » une fois sur place, semaine par semaine, pour ne pas tout faire en même temps : d'abord les bases vitales, puis le quotidien, puis le réseau.

**Semaine 1 (J1 à J7) — les bases vitales**
- J1-2 : rendre le logement fonctionnel et se connecter à internet (en coliving, c'est déjà fait).
- J3-4 : démarches françaises — passer en mairie pour un justificatif de domicile officiel, puis mettre à jour votre adresse auprès de la CPAM et de votre caisse de retraite.
- J5-7 : démarches suisses — vous rendre à l'Office cantonal de la population et des migrations (OCPM) pour activer votre permis G (prenez rendez-vous en ligne, les files sont légendaires). C'est aussi le moment de vous renseigner sur votre **assurance maladie** : vous avez 3 mois pour exercer votre droit d'option entre la LAMal suisse et la CMU française, et ce choix est quasi-irréversible — ne le laissez pas traîner.

**Semaine 2 (J8 à J14) — optimiser son quotidien**
Prenez le rythme : transport, courses, et inscription chez un médecin traitant côté français (les délais pour un premier rendez-vous peuvent être de 2 à 3 semaines, donc lancez-le tôt).

**Semaine 3 (J15 à J21) — créer du lien social**
La partie la plus sous-estimée, et la plus importante quand on arrive seul. Voir la section suivante.

**Semaine 4 (J22 à J30) — consolider et planifier**
Après un mois, vous avez une idée réaliste de vos dépenses et l'essentiel est coché. Ce qui reste souvent en suspens et peut attendre les mois suivants : la déclaration d'impôts, l'optimisation de votre 2e pilier (prévoyance professionnelle suisse), et éventuellement l'achat d'un véhicule si votre trajet le nécessite.

## Arriver seul : créer du lien (et la barrière culturelle)

On prépare le logement et l'administratif, rarement le réseau social. Pourtant c'est souvent ce qui fait la différence entre « tenir » et « s'épanouir ». Arriver seul peut peser, surtout quand vos collègues suisses rentrent chez eux le soir et que vous ne connaissez personne côté français.

**Les leviers concrets :**
- **Les groupes Facebook de frontaliers** sont très actifs (« Frontaliers Genevois », « Expats in Geneva », « Français à Genève ») : conseils pratiques et invitations à des événements.
- **Le sport** est un excellent vecteur social : salles de sport, clubs de course à pied, associations sportives locales permettent de rencontrer du monde rapidement.
- **Les événements du Grand Genève** (concerts, festivals, marchés) : consultez l'agenda du Grand Genève (grand-geneve.org).
- **Le coliving** a un avantage unique ici : des colocataires dès le premier soir, et des espaces communs et événements (barbecues, soirées jeux, apéros du vendredi) qui créent du lien naturellement.

**La barrière culturelle.** Le « froid suisse » est un cliché… qui contient une part de vérité. Les Genevois sont courtois, mais il faut plus de temps pour créer des amitiés profondes qu'en France. Ne le prenez pas personnellement, c'est culturel. Les expats et autres frontaliers sont souvent plus ouverts aux nouvelles rencontres : ils vivent exactement la même situation que vous.

## À lire aussi$LVfr$),
    content_en = replace(content_en, $b$## Realistic Timelines$b$, $LVen$## Your First 30 Days, Day by Day (If You Arrive Alone)

The checklist above covers the "what." Here's the "when" once you've landed, week by week, so you don't do everything at once: vital basics first, then daily life, then your network.

**Week 1 (Day 1-7) — the vital basics**
- Day 1-2: make your home functional and get connected to internet (in coliving, it's already done).
- Day 3-4: French steps — visit the town hall for an official proof of address, then update your address with CPAM and your pension fund.
- Day 5-7: Swiss steps — go to the Office cantonal de la population et des migrations (OCPM) to activate your G permit (book online, the queues are legendary). This is also the time to look into your **health insurance**: you have 3 months to exercise your right of option between Swiss LAMal and French CMU, and this choice is virtually irreversible — don't let it drag.

**Week 2 (Day 8-14) — optimising daily life**
Find your rhythm: transport, shopping, and registering with a GP on the French side (wait times for a first appointment can be 2-3 weeks, so start early).

**Week 3 (Day 15-21) — building social connections**
The most underestimated part, and the most important when you arrive alone. See the next section.

**Week 4 (Day 22-30) — consolidate and plan ahead**
After a month, you'll have a realistic idea of your expenses and the essentials are ticked off. What often remains pending and can wait for the following months: your tax declaration, optimising your 2nd pillar (Swiss occupational pension), and possibly buying a vehicle if your commute requires it.

## Arriving Alone: Building a Circle (and the Cultural Barrier)

People prepare the housing and the paperwork, rarely the social network. Yet that's often what makes the difference between "coping" and "thriving." Arriving alone can weigh on you, especially when your Swiss colleagues go home in the evening and you don't know anyone on the French side.

**Concrete strategies:**
- **Cross-border Facebook groups** are very active ("Frontaliers Genevois", "Expats in Geneva", "Français à Genève"): practical advice and event invitations.
- **Sport** is an excellent social vector: gyms, running clubs, and local sports associations help you meet people quickly.
- **Grand Genève events** (concerts, festivals, markets): check the Grand Genève agenda (grand-geneve.org).
- **Coliving** has a unique advantage here: housemates from the very first evening, plus common areas and events (barbecues, game nights, Friday drinks) that create connections naturally.

**The cultural barrier.** The "Swiss coldness" is a cliché… that contains some truth. Genevans are polite, but it takes longer to build deep friendships than in France. Don't take it personally — it's cultural. Expats and other cross-border workers are often more open to new encounters: they're living exactly the same situation as you.

## Realistic Timelines$LVen$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($g$Vos 30 premiers jours, jour par jour$g$ IN content_fr) = 0;   -- garde-fou anti-doublon

-- Contrôle : la phrase-repère doit être présente 1 fois, et la longueur a augmenté.
SELECT slug,
       (position($g2$Vos 30 premiers jours, jour par jour$g2$ IN content_fr) > 0) AS section_inseree,
       length(content_fr) AS len_fr, length(content_en) AS len_en, updated_at
FROM blog_posts WHERE slug = 'demenager-geneve-frontalier-checklist';
