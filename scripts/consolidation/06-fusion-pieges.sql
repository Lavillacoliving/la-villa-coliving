-- ════════════════════════════════════════════════════════════════════════
-- FUSION → arnaques-logement-frontalier-geneve-eviter
-- Récupère le contenu UNIQUE de : 5-erreurs-logement-frontalier-geneve
-- puis insère les sections dans la page CIBLE (avant la conclusion).
-- À LANCER AVANT la dépublication (09) et AVANT le rebuild.
-- Idempotent : ne réinsère pas si déjà présent (garde-fou sur une phrase unique).
-- Aperçu lisible du contenu ajouté : scripts/consolidation/salvage/arnaques-logement-frontalier-geneve-eviter.fr.md / .en.md
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts
SET content_fr = replace(content_fr, $a$## Que faire si vous êtes victime ?$a$, $LVfr$## Au-delà des arnaques : les erreurs classiques à éviter

Les arnaques ne sont pas le seul piège du marché frontalier. Voici les erreurs les plus courantes des candidats locataires, et comment les anticiper.

**Sous-estimer les délais de recherche**

- La demande est très forte près de Genève : comptez généralement entre **deux et quatre mois** pour trouver un logement qui correspond à vos critères et à votre budget.
- L'attractivité des salaires suisses génère une concurrence acharnée sur les biens disponibles.
- Commencez bien avant la date d'emménagement souhaitée : vous pourrez comparer les offres et négocier sereinement, sans décisions précipitées sous la pression du temps.

**Négliger les aspects financiers des cautions et garanties**

- En France, le dépôt de garantie ne peut légalement dépasser **un mois de loyer hors charges** pour un logement vide. Certains propriétaires tentent d'exiger davantage ou des garanties supplémentaires : restez vigilant.
- Comprenez bien les conditions de restitution de la caution.
- Réalisez un **état des lieux contradictoire détaillé** à l'entrée : photographiez chaque pièce et signalez le moindre défaut. C'est votre meilleure protection contre des retenues abusives au départ.

**Sous-évaluer la localisation et les transports**

- Beaucoup de frontaliers se focalisent sur le seul prix du loyer, sans considérer les coûts et contraintes de transport.
- Un logement éloigné des axes de transport public ou des routes vers Genève peut générer des frais de carburant considérables et des temps de trajet épuisants.
- Étudiez les horaires de bus, la fréquence des liaisons et les alternatives en cas de grève ou d'incident avant de signer.

**Ignorer la différence entre tout-inclus et charges séparées**

- La gestion des charges peut vite devenir un casse-tête administratif et financier.
- Une formule **tout-inclus** (un seul paiement mensuel) offre une prévisibilité budgétaire parfaite et évite les mauvaises surprises lors des régularisations de charges.

## Que faire si vous êtes victime ?$LVfr$),
    content_en = replace(content_en, $b$## What To Do If You're a Victim?$b$, $LVen$## Beyond Scams: The Classic Mistakes to Avoid

Scams aren't the only trap on the cross-border market. Here are the most common mistakes prospective tenants make — and how to stay ahead of them.

**Underestimating search timeframes**

- Demand is very high near Geneva: it generally takes **two to four months** to find housing that matches your criteria and budget.
- The appeal of Swiss salaries drives fierce competition for available properties.
- Start well before your desired move-in date: you'll be able to compare offers and negotiate calmly, instead of making hasty decisions under time pressure.

**Neglecting the financial side of deposits and guarantees**

- In France, the security deposit legally cannot exceed **one month's rent excluding charges** for an unfurnished property. Some landlords try to demand more, or extra guarantees — stay alert.
- Make sure you understand the conditions for getting the deposit back.
- Do a **detailed contradictory inventory** (état des lieux) when moving in: photograph every room and note any defect. It's your best protection against abusive deductions when you leave.

**Undervaluing location and transport**

- Many cross-border workers focus only on rent price, without factoring in transport costs and constraints.
- Housing far from public transport routes or the main roads to Geneva can generate considerable fuel costs and exhausting commute times.
- Study bus schedules, connection frequency, and fallback options in case of strikes or incidents before signing.

**Ignoring the difference between all-inclusive and separate charges**

- Managing rental charges can quickly become an administrative and financial headache.
- An **all-inclusive** formula (a single monthly payment) gives you perfect budget predictability and avoids unpleasant surprises from end-of-year charge adjustments.

## What To Do If You're a Victim?$LVen$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($g$Au-delà des arnaques : les erreurs classiques$g$ IN content_fr) = 0;   -- garde-fou anti-doublon

-- Contrôle : la phrase-repère doit être présente 1 fois, et la longueur a augmenté.
SELECT slug,
       (position($g2$Au-delà des arnaques : les erreurs classiques$g2$ IN content_fr) > 0) AS section_inseree,
       length(content_fr) AS len_fr, length(content_en) AS len_en, updated_at
FROM blog_posts WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';
