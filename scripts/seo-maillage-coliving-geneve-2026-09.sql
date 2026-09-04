-- ============================================================================
-- Lot 4 SEO funnel — maillage entrant vers la home (/), URL championne sur « coliving genève »
-- Plan validé le 03/09/2026 (Q10c : 8 ancres exactes « coliving Genève » + 6 variantes marque, dont
-- 4 exactes + 6 marque dans les 10 articles GSC ; les 4 autres exactes sont dans le code : /nos-maisons,
-- pages maisons, /annemasse-colocation, /chambre-a-louer-annemasse). Constat avant : 0/40 article lie / dans son corps.
-- À appliquer via MCP execute_sql APRÈS validation de LOT4_MAILLAGE_COLIVING_GENEVE_2026-09-04.md par Jérôme.
-- Ne touche que content_fr. REPLACE exact d'un fragment vérifié unique par article ; idempotent (un 2ᵉ passage
-- ne trouve plus le fragment d'origine). Puis prérendu (bot) — le lien est rendu par BlogPostPage (LocalizedLink).
-- ============================================================================

-- Contrôle AVANT (attendu : lien_home = false partout)
select slug, (content_fr ~ '\]\(/\)') as lien_home, substring(content_fr from '\[([^\]]+)\]\(/\)') as ancre from blog_posts where slug in ('ou-habiter-frontalier-suisse-villes-france-pas-cher','choc-culturel-franco-suisse-expatrie-geneve','organisations-internationales-geneve-ou-habiter','quartiers-annemasse-ou-vivre-selon-profil','allocations-familiales-frontalier-geneve-2026','cout-de-la-vie-suisse-france-frontalier-2026','coliving-frais-dossier-geneve-annemasse','budget-colocation-geneve-guide-complet','trouver-colocation-geneve-frontalier','colocation-expats-geneve-guide') order by slug;

-- exacte : « coliving Genève »
update blog_posts set content_fr = replace(content_fr, $l4$rendent la vie franco-suisse beaucoup plus simple qu'il y a 5 ans. À toi de jouer.$l4$, $l4$rendent la vie franco-suisse beaucoup plus simple qu'il y a 5 ans. À toi de jouer.

Et si tu veux un point de chute clé en main pendant que tu compares : notre [coliving Genève](/) réunit 3 maisons côté France, chambre meublée, charges, fibre, piscine et sauna compris, à 20 minutes du centre.$l4$), updated_at = now() where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' and position($l4$rendent la vie franco-suisse beaucoup plus simple qu'il y a 5 ans. À toi de jouer.$l4$ in content_fr) > 0;

-- exacte : « coliving Genève »
update blog_posts set content_fr = replace(content_fr, $l4$qui vivent le même ajustement culturel que toi, dans un cadre bienveillant et ouvert.$l4$, $l4$qui vivent le même ajustement culturel que toi, dans un cadre bienveillant et ouvert. C'est exactement ce que propose notre [coliving Genève](/) : 29 résidents de toutes nationalités dans 3 maisons côté France, à 20 minutes du centre.$l4$), updated_at = now() where slug = 'choc-culturel-franco-suisse-expatrie-geneve' and position($l4$qui vivent le même ajustement culturel que toi, dans un cadre bienveillant et ouvert.$l4$ in content_fr) > 0;

-- exacte : « coliving Genève »
update blog_posts set content_fr = replace(content_fr, $l4$Visite nos [maisons](/nos-maisons) ou consulte les [tarifs](/tarifs).$l4$, $l4$Notre [coliving Genève](/) est pensé pour ces arrivées rapides : chambre meublée, tout inclus, à 20 minutes du centre. Visite nos [maisons](/nos-maisons) ou consulte les [tarifs](/tarifs).$l4$), updated_at = now() where slug = 'organisations-internationales-geneve-ou-habiter' and position($l4$Visite nos [maisons](/nos-maisons) ou consulte les [tarifs](/tarifs).$l4$ in content_fr) > 0;

-- exacte : « coliving Genève »
update blog_posts set content_fr = replace(content_fr, $l4$toutes en coliving tout inclus.$l4$, $l4$toutes dans le même [coliving Genève](/), tout inclus.$l4$), updated_at = now() where slug = 'quartiers-annemasse-ou-vivre-selon-profil' and position($l4$toutes en coliving tout inclus.$l4$ in content_fr) > 0;

-- marque : « La Villa Coliving, coliving à Genève »
update blog_posts set content_fr = replace(content_fr, $l4$de trouver ton logement familial. [Découvre les chambres disponibles](/candidature).$l4$, $l4$de trouver ton logement familial. Envie de voir les maisons ? Passe par [La Villa Coliving, coliving à Genève](/). [Découvre les chambres disponibles](/candidature).$l4$), updated_at = now() where slug = 'allocations-familiales-frontalier-geneve-2026' and position($l4$de trouver ton logement familial. [Découvre les chambres disponibles](/candidature).$l4$ in content_fr) > 0;

-- marque : « notre coliving près de Genève »
update blog_posts set content_fr = replace(content_fr, $l4$tu sais exactement ce que te coûte ta vie chaque mois. [Découvre les chambres disponibles](/candidature).$l4$, $l4$tu sais exactement ce que te coûte ta vie chaque mois. C'est le principe de [notre coliving près de Genève](/) : un seul loyer, tout compris. [Découvre les chambres disponibles](/candidature).$l4$), updated_at = now() where slug = 'cout-de-la-vie-suisse-france-frontalier-2026' and position($l4$tu sais exactement ce que te coûte ta vie chaque mois. [Découvre les chambres disponibles](/candidature).$l4$ in content_fr) > 0;

-- marque : « La Villa Coliving à la frontière de Genève »
update blog_posts set content_fr = replace(content_fr, $l4$ou nos [chambres à louer à Annemasse](/chambre-a-louer-annemasse).$l4$, $l4$ou nos [chambres à louer à Annemasse](/chambre-a-louer-annemasse). Et pour voir l'ensemble de l'offre, passe par [La Villa Coliving à la frontière de Genève](/).$l4$), updated_at = now() where slug = 'coliving-frais-dossier-geneve-annemasse' and position($l4$ou nos [chambres à louer à Annemasse](/chambre-a-louer-annemasse).$l4$ in content_fr) > 0;

-- marque : « le coliving La Villa près de Genève »
update blog_posts set content_fr = replace(content_fr, $l4$amortissement des meubles) — c'est tout l'objet de ce guide.$l4$, $l4$amortissement des meubles) — c'est tout l'objet de ce guide.

Si tu préfères un chiffre unique et sans surprise, regarde [le coliving La Villa près de Genève](/) : loyer, charges, fibre et ménage dans un seul forfait.$l4$), updated_at = now() where slug = 'budget-colocation-geneve-guide-complet' and position($l4$amortissement des meubles) — c'est tout l'objet de ce guide.$l4$ in content_fr) > 0;

-- marque : « notre coliving à 20 minutes de Genève »
update blog_posts set content_fr = replace(content_fr, $l4$[Postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier).$l4$, $l4$Découvre [notre coliving à 20 minutes de Genève](/) ou [postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier).$l4$), updated_at = now() where slug = 'trouver-colocation-geneve-frontalier' and position($l4$[Postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier).$l4$ in content_fr) > 0;

-- marque : « La Villa Coliving »
update blog_posts set content_fr = replace(content_fr, $l4$**Envie de rejoindre La Villa Coliving$l4$, $l4$**Envie de rejoindre [La Villa Coliving](/)$l4$), updated_at = now() where slug = 'colocation-expats-geneve-guide' and position($l4$**Envie de rejoindre La Villa Coliving$l4$ in content_fr) > 0;

-- Contrôle APRÈS (attendu : lien_home = true partout, une ancre par article, 4 exactes « coliving Genève » + 6 variantes marque)
select slug, (content_fr ~ '\]\(/\)') as lien_home, substring(content_fr from '\[([^\]]+)\]\(/\)') as ancre from blog_posts where slug in ('ou-habiter-frontalier-suisse-villes-france-pas-cher','choc-culturel-franco-suisse-expatrie-geneve','organisations-internationales-geneve-ou-habiter','quartiers-annemasse-ou-vivre-selon-profil','allocations-familiales-frontalier-geneve-2026','cout-de-la-vie-suisse-france-frontalier-2026','coliving-frais-dossier-geneve-annemasse','budget-colocation-geneve-guide-complet','trouver-colocation-geneve-frontalier','colocation-expats-geneve-guide') order by slug;