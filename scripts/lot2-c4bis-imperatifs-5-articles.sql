-- ============================================================================
-- Lot 2 — partie C, lot C4 bis : impératifs de vouvoiement (verbes en -ez) restants dans le corps FR (content_fr)
-- de 5 articles publiés déjà au « tu » : budget-colocation-guide, choc-culturel, quartiers-annemasse,
-- organisations-internationales, ou-habiter-frontalier.
-- Plan SEO funnel validé le 03/09/2026 ; registre « tu » sur tout le blog (CLAUDE.md §5).
-- À appliquer via MCP execute_sql APRÈS validation du document LOT2_C4BIS_IMPERATIFS_2026-09-03.md par Jérôme.
-- Ne touche que content_fr. REPLACE exact : une phrase qui ne correspond plus reste inchangée
-- et apparaît dans le contrôle « après ». Puis prérendu : cron 05:00 UTC ou push d'un fichier surveillé.
-- Les 5 articles sont déjà à 0 « vous » (brut et hors URL) : le contrôle « vous » d'après doit rester à 0.
-- Deux contrôles -ez : le standard (celui de C1→C4, mot précédé d'un espace, *, >, # ou -) et un contrôle élargi
-- (tout mot en -ez, y compris après « [ » dans le texte d'un lien) qui a révélé 3 impératifs de plus dans le périmètre.
-- ============================================================================

-- Contrôle AVANT (attendu : vous 0 partout ; ez standard : budget 7, choc 8, quartiers 6, organisations 3, ou 2 ; ez élargi : budget 7, choc 10, quartiers 7, organisations 3, ou 2)
-- (dry-run du 03/09 : 0 partout après, sur les deux contrôles)
select slug, (select count(*) from regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '\m(vous|votre|vos)\M', 'gi')) as vous, (select count(*) from regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '(?:^|[\s*>#-])((?:[A-ZÉ][a-zé]+|[a-zé]+)ez)\M', 'g') as m where lower(m[1]) not in ('chez','assez','rez','nez')) as ez, (select count(*) from regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '([[:alpha:]]+ez)\M', 'g') as m where lower(m[1]) not in ('chez','assez','rez','nez')) as ez_large from blog_posts where slug in ('budget-colocation-geneve-guide-complet','choc-culturel-franco-suisse-expatrie-geneve','quartiers-annemasse-ou-vivre-selon-profil','organisations-internationales-geneve-ou-habiter','ou-habiter-frontalier-suisse-villes-france-pas-cher') order by slug;

-- budget-colocation-geneve-guide-complet : 7 fragments
update blog_posts set content_fr = replace(replace(replace(replace(replace(replace(replace(content_fr, $c4b$**Visez les communes de la deuxième couronne**$c4b$, $c4b$**Vise les communes de la deuxième couronne**$c4b$), $c4b$**Arrivez en basse saison**$c4b$, $c4b$**Arrive en basse saison**$c4b$), $c4b$**Négociez le bail**$c4b$, $c4b$**Négocie le bail**$c4b$), $c4b$**Considérez le coliving comme un$c4b$, $c4b$**Considère le coliving comme un$c4b$), $c4b$: additionnez loyer + charges + meubles + dépôt$c4b$, $c4b$: additionne loyer + charges + meubles + dépôt$c4b$), $c4b$**Tenez compte du taux de change**$c4b$, $c4b$**Tiens compte du taux de change**$c4b$), $c4b$mais prévoyez garant, caution, mobilier$c4b$, $c4b$mais prévois garant, caution, mobilier$c4b$), updated_at = now() where slug = 'budget-colocation-geneve-guide-complet';

-- choc-culturel-franco-suisse-expatrie-geneve : 7 fragments
update blog_posts set content_fr = replace(replace(replace(replace(replace(replace(replace(content_fr, $c4b$visez 5 minutes d'avance pour tout.$c4b$, $c4b$vise 5 minutes d'avance pour tout.$c4b$), $c4b$en réunion, écoutez plus, interrompez moins.$c4b$, $c4b$en réunion, écoute plus, interromps moins.$c4b$), $c4b$côté suisse, soyez à l'aise avec le sujet$c4b$, $c4b$côté suisse, sois à l'aise avec le sujet$c4b$), $c4b$ne confondez pas consensus avec faiblesse.$c4b$, $c4b$ne confonds pas consensus avec faiblesse.$c4b$), $c4b$le dimanche matin. Anticipez$c4b$, $c4b$le dimanche matin. Anticipe$c4b$), $c4b$Attendez que l'autre propose le tutoiement — ne forcez pas la transition.$c4b$, $c4b$Attends que l'autre propose le tutoiement — ne force pas la transition.$c4b$), $c4b$[Découvrez La Villa Coliving](/nos-maisons) et [candidatez ici](/candidature).$c4b$, $c4b$[Découvre La Villa Coliving](/nos-maisons) et [candidate ici](/candidature).$c4b$), updated_at = now() where slug = 'choc-culturel-franco-suisse-expatrie-geneve';

-- quartiers-annemasse-ou-vivre-selon-profil : 6 fragments
update blog_posts set content_fr = replace(replace(replace(replace(replace(replace(content_fr, $c4b$mesurez le temps de marche réel jusqu'au quai$c4b$, $c4b$mesure le temps de marche réel jusqu'au quai$c4b$), $c4b$Visez **le cœur d'Annemasse**.$c4b$, $c4b$Vise **le cœur d'Annemasse**.$c4b$), $c4b$Comparez ce qui est comparable$c4b$, $c4b$Compare ce qui est comparable$c4b$), $c4b$Vérifiez juste le trajet retour$c4b$, $c4b$Vérifie juste le trajet retour$c4b$), $c4b$[Découvrez les chambres disponibles](/candidature) ou explorez notre$c4b$, $c4b$[Découvre les chambres disponibles](/candidature) ou explore notre$c4b$), $c4b$Vérifiez toujours les annonces réelles du moment.$c4b$, $c4b$Vérifie toujours les annonces réelles du moment.$c4b$), updated_at = now() where slug = 'quartiers-annemasse-ou-vivre-selon-profil';

-- organisations-internationales-geneve-ou-habiter : 2 fragments
update blog_posts set content_fr = replace(replace(content_fr, $c4b$Depuis Ville-la-Grand, comptez 30-35 minutes$c4b$, $c4b$Depuis Ville-la-Grand, compte 30-35 minutes$c4b$), $c4b$Visitez nos [maisons](/nos-maisons) ou consultez les [tarifs](/tarifs).$c4b$, $c4b$Visite nos [maisons](/nos-maisons) ou consulte les [tarifs](/tarifs).$c4b$), updated_at = now() where slug = 'organisations-internationales-geneve-ou-habiter';

-- ou-habiter-frontalier-suisse-villes-france-pas-cher : 2 fragments
update blog_posts set content_fr = replace(replace(content_fr, $c4b$: comptez 5 minutes à pied jusqu'au poste de douane.$c4b$, $c4b$: compte 5 minutes à pied jusqu'au poste de douane.$c4b$), $c4b$Consultez notre [Observatoire du logement frontalier Genève]$c4b$, $c4b$Consulte notre [Observatoire du logement frontalier Genève]$c4b$), updated_at = now() where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';

-- Contrôle APRÈS « vous » (attendu : 0 partout, en brut comme hors URL — ces articles étaient déjà à 0)
select slug, (select count(*) from regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '\m(vous|votre|vos)\M', 'gi')) as vous_brut, (select count(*) from regexp_matches(regexp_replace(regexp_replace(content_fr, '\]\([^)]*\)', ']', 'g'), 'rendez-vous', '', 'gi'), '\m(vous|votre|vos)\M', 'gi')) as vous_hors_url from blog_posts where slug in ('budget-colocation-geneve-guide-complet','choc-culturel-franco-suisse-expatrie-geneve','quartiers-annemasse-ou-vivre-selon-profil','organisations-internationales-geneve-ou-habiter','ou-habiter-frontalier-suisse-villes-france-pas-cher') order by slug;

-- Contrôle APRÈS des impératifs de vouvoiement restants, contrôle standard (verbes en -ez, « rendez-vous » neutralisé) : attendu 0 ligne
select slug, m[1] as mot from blog_posts, regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '(?:^|[\s*>#-])((?:[A-ZÉ][a-zé]+|[a-zé]+)ez)\M', 'g') as m where slug in ('budget-colocation-geneve-guide-complet','choc-culturel-franco-suisse-expatrie-geneve','quartiers-annemasse-ou-vivre-selon-profil','organisations-internationales-geneve-ou-habiter','ou-habiter-frontalier-suisse-villes-france-pas-cher') and lower(m[1]) not in ('chez','assez','rez','nez') order by 1, 2;

-- Contrôle APRÈS élargi (tout mot en -ez, texte des liens compris) : attendu 0 ligne
select slug, m[1] as mot from blog_posts, regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '([[:alpha:]]+ez)\M', 'g') as m where slug in ('budget-colocation-geneve-guide-complet','choc-culturel-franco-suisse-expatrie-geneve','quartiers-annemasse-ou-vivre-selon-profil','organisations-internationales-geneve-ou-habiter','ou-habiter-frontalier-suisse-villes-france-pas-cher') and lower(m[1]) not in ('chez','assez','rez','nez') order by 1, 2;
-- ---------------------------------------------------------------------------
-- APPLIQUÉ le 03/09/2026 (« C4 bis validé » par Jérôme) via MCP execute_sql, en un appel :
--   5 articles → 0 impératif en -ez (contrôle standard ET élargi), 0 « vous » hors URL.
-- ---------------------------------------------------------------------------
