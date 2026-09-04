-- ============================================================================
-- Lot 4 SEO funnel — maillage entrant vers la home (/), URL championne sur « coliving genève »
-- Plan validé le 03/09/2026 (Q10c : 8 ancres exactes « coliving Genève » + variantes marque). 4 exactes + 6 marque
-- dans les 10 articles GSC ; 4 exactes dans le code (/le-coliving, /nos-maisons, /annemasse-colocation, /chambre-a-louer-annemasse).
-- Relecture Jérôme du 04/09 intégrée : pas de chiffre de minutes (arbitrage 15/20 du fact block en attente), pas de
-- piscine/sauna attribués à tout le coliving, « chambres disponibles » → /chambres-disponibles, ancre #10 complète ;
-- #9 garde ?src=bloc_offre&article= (Lot 1 : traduit en utm_source=site / utm_medium=bloc_offre / utm_campaign=<slug>
-- sans redémarrer la session GA4 — un utm_* réel sur un lien interne casserait l'attribution, décision Q11a).
-- Constat avant : 0/40 article lie / dans son corps. À appliquer via MCP execute_sql (GO Jérôme 04/09).
-- Ne touche que content_fr. REPLACE exact d'un fragment vérifié unique par article ; idempotent.
-- ============================================================================

-- Contrôle AVANT (attendu : lien_home = false partout)
select slug, (content_fr ~ '\]\(/\)') as lien_home, substring(content_fr from '\[([^\]]+)\]\(/\)') as ancre, (content_fr ~ '\]\(/chambres-disponibles\)') as lien_dispo from blog_posts where slug in ('ou-habiter-frontalier-suisse-villes-france-pas-cher','choc-culturel-franco-suisse-expatrie-geneve','organisations-internationales-geneve-ou-habiter','quartiers-annemasse-ou-vivre-selon-profil','allocations-familiales-frontalier-geneve-2026','cout-de-la-vie-suisse-france-frontalier-2026','coliving-frais-dossier-geneve-annemasse','budget-colocation-geneve-guide-complet','trouver-colocation-geneve-frontalier','colocation-expats-geneve-guide') order by slug;

-- exacte : « coliving Genève »
update blog_posts set content_fr = replace(content_fr, $l4$rendent la vie franco-suisse beaucoup plus simple qu'il y a 5 ans. À toi de jouer.$l4$, $l4$rendent la vie franco-suisse beaucoup plus simple qu'il y a 5 ans. À toi de jouer.

Et si tu veux un point de chute clé en main pendant que tu compares : notre [coliving Genève](/) réunit 3 maisons côté France, à la frontière de Genève, chambre meublée, charges et fibre comprises.$l4$), updated_at = now() where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' and position($l4$rendent la vie franco-suisse beaucoup plus simple qu'il y a 5 ans. À toi de jouer.$l4$ in content_fr) > 0;

-- exacte : « coliving Genève »
update blog_posts set content_fr = replace(content_fr, $l4$qui vivent le même ajustement culturel que toi, dans un cadre bienveillant et ouvert.$l4$, $l4$qui vivent le même ajustement culturel que toi, dans un cadre bienveillant et ouvert. C'est exactement ce que propose notre [coliving Genève](/) : 29 résidents de toutes nationalités dans 3 maisons côté France, à la frontière de Genève.$l4$), updated_at = now() where slug = 'choc-culturel-franco-suisse-expatrie-geneve' and position($l4$qui vivent le même ajustement culturel que toi, dans un cadre bienveillant et ouvert.$l4$ in content_fr) > 0;

-- exacte : « coliving Genève »
update blog_posts set content_fr = replace(content_fr, $l4$Visite nos [maisons](/nos-maisons) ou consulte les [tarifs](/tarifs).$l4$, $l4$Notre [coliving Genève](/) est pensé pour ces arrivées rapides : chambre meublée, tout inclus, côté France à la frontière de Genève. Visite nos [maisons](/nos-maisons) ou consulte les [tarifs](/tarifs).$l4$), updated_at = now() where slug = 'organisations-internationales-geneve-ou-habiter' and position($l4$Visite nos [maisons](/nos-maisons) ou consulte les [tarifs](/tarifs).$l4$ in content_fr) > 0;

-- exacte : « coliving Genève »
update blog_posts set content_fr = replace(content_fr, $l4$toutes en coliving tout inclus.$l4$, $l4$toutes dans le même [coliving Genève](/), tout inclus.$l4$), updated_at = now() where slug = 'quartiers-annemasse-ou-vivre-selon-profil' and position($l4$toutes en coliving tout inclus.$l4$ in content_fr) > 0;

-- marque : « La Villa Coliving, coliving à Genève »
update blog_posts set content_fr = replace(content_fr, $l4$de trouver ton logement familial. [Découvre les chambres disponibles](/candidature).$l4$, $l4$de trouver ton logement familial. Envie de voir les maisons ? Passe par [La Villa Coliving, coliving à Genève](/). [Découvre les chambres disponibles](/chambres-disponibles).$l4$), updated_at = now() where slug = 'allocations-familiales-frontalier-geneve-2026' and position($l4$de trouver ton logement familial. [Découvre les chambres disponibles](/candidature).$l4$ in content_fr) > 0;

-- marque : « notre coliving près de Genève »
update blog_posts set content_fr = replace(content_fr, $l4$tu sais exactement ce que te coûte ta vie chaque mois. [Découvre les chambres disponibles](/candidature).$l4$, $l4$tu sais exactement ce que te coûte ta vie chaque mois. C'est le principe de [notre coliving près de Genève](/) : un seul loyer, tout compris. [Découvre les chambres disponibles](/chambres-disponibles).$l4$), updated_at = now() where slug = 'cout-de-la-vie-suisse-france-frontalier-2026' and position($l4$tu sais exactement ce que te coûte ta vie chaque mois. [Découvre les chambres disponibles](/candidature).$l4$ in content_fr) > 0;

-- marque : « La Villa Coliving à la frontière de Genève »
update blog_posts set content_fr = replace(content_fr, $l4$ou nos [chambres à louer à Annemasse](/chambre-a-louer-annemasse).$l4$, $l4$ou nos [chambres à louer à Annemasse](/chambre-a-louer-annemasse). Et pour voir l'ensemble de l'offre, passe par [La Villa Coliving à la frontière de Genève](/).$l4$), updated_at = now() where slug = 'coliving-frais-dossier-geneve-annemasse' and position($l4$ou nos [chambres à louer à Annemasse](/chambre-a-louer-annemasse).$l4$ in content_fr) > 0;

-- marque : « le coliving La Villa près de Genève »
update blog_posts set content_fr = replace(content_fr, $l4$amortissement des meubles) — c'est tout l'objet de ce guide.$l4$, $l4$amortissement des meubles) — c'est tout l'objet de ce guide.

Si tu préfères un chiffre unique et sans surprise, regarde [le coliving La Villa près de Genève](/) : loyer, charges, fibre et ménage dans un seul forfait.$l4$), updated_at = now() where slug = 'budget-colocation-geneve-guide-complet' and position($l4$amortissement des meubles) — c'est tout l'objet de ce guide.$l4$ in content_fr) > 0;

-- marque : « notre coliving à la frontière de Genève »
update blog_posts set content_fr = replace(content_fr, $l4$[Postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier).$l4$, $l4$Découvre [notre coliving à la frontière de Genève](/) ou [postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier).$l4$), updated_at = now() where slug = 'trouver-colocation-geneve-frontalier' and position($l4$[Postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier).$l4$ in content_fr) > 0;

-- marque : « La Villa Coliving, coliving à la frontière de Genève »
update blog_posts set content_fr = replace(content_fr, $l4$**Envie de rejoindre La Villa Coliving$l4$, $l4$**Envie de rejoindre [La Villa Coliving, coliving à la frontière de Genève](/)$l4$), updated_at = now() where slug = 'colocation-expats-geneve-guide' and position($l4$**Envie de rejoindre La Villa Coliving$l4$ in content_fr) > 0;

-- Contrôle APRÈS (attendu : lien_home = true partout, une ancre par article — 4 exactes + 6 marque —, lien_dispo = true sur allocations et cout-de-la-vie)
select slug, (content_fr ~ '\]\(/\)') as lien_home, substring(content_fr from '\[([^\]]+)\]\(/\)') as ancre, (content_fr ~ '\]\(/chambres-disponibles\)') as lien_dispo from blog_posts where slug in ('ou-habiter-frontalier-suisse-villes-france-pas-cher','choc-culturel-franco-suisse-expatrie-geneve','organisations-internationales-geneve-ou-habiter','quartiers-annemasse-ou-vivre-selon-profil','allocations-familiales-frontalier-geneve-2026','cout-de-la-vie-suisse-france-frontalier-2026','coliving-frais-dossier-geneve-annemasse','budget-colocation-geneve-guide-complet','trouver-colocation-geneve-frontalier','colocation-expats-geneve-guide') order by slug;-- ---------------------------------------------------------------------------
-- APPLIQUÉ le 04/09/2026 (GO Jérôme après ses 6 corrections) via MCP execute_sql, en un appel :
--   10 articles → 1 lien vers / chacun (4 ancres exactes « coliving Genève », 6 variantes marque),
--   allocations et cout-de-la-vie lient aussi /chambres-disponibles ; 10 articles mis à jour (updated_at).
--   En attente : arbitrage 15/20 min du fact block (les 4 phrases n'affichent aucun chiffre).
-- ---------------------------------------------------------------------------
