-- ============================================================================
-- Lot 2 — partie C, lot C4 ter : impératifs de vouvoiement (verbes en -ez) cachés dans le texte des liens Markdown
-- (ou après une parenthèse ouvrante) du corps FR (content_fr) de 12 articles publiés déjà au « tu » : arnaques-logement,
-- colocation-expats, coliving-frais-dossier, se-faire-reseau, vie-quotidienne, colocation-annemasse, demenager-checklist,
-- dossier-location, grand-geneve-2026, living-in-france, salaire-suisse-net, transport-annemasse.
-- Plan SEO funnel validé le 03/09/2026 ; registre « tu » sur tout le blog (CLAUDE.md §5).
-- À appliquer via MCP execute_sql APRÈS validation du document LOT2_C4TER_IMPERATIFS_CACHES_2026-09-03.md par Jérôme.
-- Ne touche que content_fr. REPLACE exact : une phrase qui ne correspond plus reste inchangée
-- et apparaît dans le contrôle « après ». Puis prérendu : cron 05:00 UTC ou push d'un fichier surveillé.
-- Seul le texte entre crochets d'un lien change ; l'URL reste intacte (vérifié par le générateur).
-- Les 12 articles sont déjà à 0 « vous » hors URL (1 « vous » brut subsiste dans une URL de colocation-annemasse, hors périmètre) :
-- le contrôle « vous » d'après doit rester identique à celui d'avant.
-- Le contrôle -ez standard (C1→C4 : mot précédé d'un espace, *, >, # ou -) voit 0 impératif sur ces 12 articles ;
-- c'est le contrôle ÉLARGI (tout mot en -ez, y compris après « [ » ou « ( ») qui fait foi ici : 19 avant, 0 attendu après.
-- Indépendant du lot C4 bis (5 autres articles) : les deux SQL peuvent s'appliquer dans n'importe quel ordre.
-- ============================================================================

-- Contrôle AVANT (attendu : vous_hors_url 0 partout, vous brut 1 sur colocation-annemasse (URL) et 0 ailleurs ; ez standard 0 partout ; ez élargi : arnaques 3, colocation 3, coliving 2, se 2, vie 2, colocation 1, demenager 1, dossier 1, grand 1, living 1, salaire 1, transport 1)
-- (dry-run du 03/09 : 0 partout après, sur les deux contrôles ; « vous » inchangé)
select slug, (select count(*) from regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '\m(vous|votre|vos)\M', 'gi')) as vous_brut, (select count(*) from regexp_matches(regexp_replace(regexp_replace(content_fr, '\]\([^)]*\)', ']', 'g'), 'rendez-vous', '', 'gi'), '\m(vous|votre|vos)\M', 'gi')) as vous_hors_url, (select count(*) from regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '(?:^|[\s*>#-])((?:[A-ZÉ][a-zé]+|[a-zé]+)ez)\M', 'g') as m where lower(m[1]) not in ('chez','assez','rez','nez')) as ez, (select count(*) from regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '([[:alpha:]]+ez)\M', 'g') as m where lower(m[1]) not in ('chez','assez','rez','nez')) as ez_large from blog_posts where slug in ('arnaques-logement-frontalier-geneve-eviter','colocation-expats-geneve-guide','coliving-frais-dossier-geneve-annemasse','se-faire-reseau-geneve-arriver-seul','vie-quotidienne-frontalier-courses-sport-sorties','colocation-annemasse-ville-la-grand-ambilly','demenager-geneve-frontalier-checklist','dossier-location-frontalier-suisse-france','grand-geneve-2026-nouveautes-frontaliers','living-in-france-working-in-geneva','salaire-suisse-net-frontalier-2026','transport-annemasse-geneve-leman-express') order by slug;

-- arnaques-logement-frontalier-geneve-eviter : 3 fragments
update blog_posts set content_fr = replace(replace(replace(content_fr, $c4t$[Candidatez chez La Villa Coliving](/candidature)$c4t$, $c4t$[Candidate chez La Villa Coliving](/candidature)$c4t$), $c4t$[Portez plainte au commissariat ou à la gendarmerie]$c4t$, $c4t$[Porte plainte au commissariat ou à la gendarmerie]$c4t$), $c4t$(vérifiez le domaine exact)$c4t$, $c4t$(vérifie le domaine exact)$c4t$), updated_at = now() where slug = 'arnaques-logement-frontalier-geneve-eviter';

-- colocation-expats-geneve-guide : 2 fragments
update blog_posts set content_fr = replace(replace(content_fr, $c4t$[Candidatez en 2 minutes →](/candidature)$c4t$, $c4t$[Candidate en 2 minutes →](/candidature)$c4t$), $c4t$[Découvrez nos 3 maisons](/nos-maisons) et [postulez en 5 minutes](/candidature).$c4t$, $c4t$[Découvre nos 3 maisons](/nos-maisons) et [postule en 5 minutes](/candidature).$c4t$), updated_at = now() where slug = 'colocation-expats-geneve-guide';

-- coliving-frais-dossier-geneve-annemasse : 1 fragment
update blog_posts set content_fr = replace(content_fr, $c4t$[Découvrez nos maisons](/lavilla) ou [candidatez en 2 minutes, gratuitement](/candidature).$c4t$, $c4t$[Découvre nos maisons](/lavilla) ou [candidate en 2 minutes, gratuitement](/candidature).$c4t$), updated_at = now() where slug = 'coliving-frais-dossier-geneve-annemasse';

-- se-faire-reseau-geneve-arriver-seul : 1 fragment
update blog_posts set content_fr = replace(content_fr, $c4t$[Découvrez le coliving La Villa](/nos-maisons) et [candidatez ici](/candidature).$c4t$, $c4t$[Découvre le coliving La Villa](/nos-maisons) et [candidate ici](/candidature).$c4t$), updated_at = now() where slug = 'se-faire-reseau-geneve-arriver-seul';

-- vie-quotidienne-frontalier-courses-sport-sorties : 1 fragment
update blog_posts set content_fr = replace(content_fr, $c4t$[Découvrez La Villa Coliving](/nos-maisons) et [candidatez ici](/candidature).$c4t$, $c4t$[Découvre La Villa Coliving](/nos-maisons) et [candidate ici](/candidature).$c4t$), updated_at = now() where slug = 'vie-quotidienne-frontalier-courses-sport-sorties';

-- colocation-annemasse-ville-la-grand-ambilly : 1 fragment
update blog_posts set content_fr = replace(content_fr, $c4t$[Candidatez en 2 minutes →](/candidature)$c4t$, $c4t$[Candidate en 2 minutes →](/candidature)$c4t$), updated_at = now() where slug = 'colocation-annemasse-ville-la-grand-ambilly';

-- demenager-geneve-frontalier-checklist : 1 fragment
update blog_posts set content_fr = replace(content_fr, $c4t$[Candidatez en 2 minutes →](/candidature)$c4t$, $c4t$[Candidate en 2 minutes →](/candidature)$c4t$), updated_at = now() where slug = 'demenager-geneve-frontalier-checklist';

-- dossier-location-frontalier-suisse-france : 1 fragment
update blog_posts set content_fr = replace(content_fr, $c4t$[Candidatez chez La Villa Coliving](/candidature)$c4t$, $c4t$[Candidate chez La Villa Coliving](/candidature)$c4t$), updated_at = now() where slug = 'dossier-location-frontalier-suisse-france';

-- grand-geneve-2026-nouveautes-frontaliers : 1 fragment
update blog_posts set content_fr = replace(content_fr, $c4t$[Candidatez en 2 minutes →](/candidature)$c4t$, $c4t$[Candidate en 2 minutes →](/candidature)$c4t$), updated_at = now() where slug = 'grand-geneve-2026-nouveautes-frontaliers';

-- living-in-france-working-in-geneva : 1 fragment
update blog_posts set content_fr = replace(content_fr, $c4t$[Candidatez en 2 minutes →](/candidature)$c4t$, $c4t$[Candidate en 2 minutes →](/candidature)$c4t$), updated_at = now() where slug = 'living-in-france-working-in-geneva';

-- salaire-suisse-net-frontalier-2026 : 1 fragment
update blog_posts set content_fr = replace(content_fr, $c4t$[Postulez en 2 min](/candidature).$c4t$, $c4t$[Postule en 2 min](/candidature).$c4t$), updated_at = now() where slug = 'salaire-suisse-net-frontalier-2026';

-- transport-annemasse-geneve-leman-express : 1 fragment
update blog_posts set content_fr = replace(content_fr, $c4t$[Candidatez en 2 minutes →](/candidature)$c4t$, $c4t$[Candidate en 2 minutes →](/candidature)$c4t$), updated_at = now() where slug = 'transport-annemasse-geneve-leman-express';

-- Contrôle APRÈS « vous » (attendu : hors URL 0 partout ; brut 1 sur colocation-annemasse (URL, hors périmètre) et 0 ailleurs — comme avant)
select slug, (select count(*) from regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '\m(vous|votre|vos)\M', 'gi')) as vous_brut, (select count(*) from regexp_matches(regexp_replace(regexp_replace(content_fr, '\]\([^)]*\)', ']', 'g'), 'rendez-vous', '', 'gi'), '\m(vous|votre|vos)\M', 'gi')) as vous_hors_url from blog_posts where slug in ('arnaques-logement-frontalier-geneve-eviter','colocation-expats-geneve-guide','coliving-frais-dossier-geneve-annemasse','se-faire-reseau-geneve-arriver-seul','vie-quotidienne-frontalier-courses-sport-sorties','colocation-annemasse-ville-la-grand-ambilly','demenager-geneve-frontalier-checklist','dossier-location-frontalier-suisse-france','grand-geneve-2026-nouveautes-frontaliers','living-in-france-working-in-geneva','salaire-suisse-net-frontalier-2026','transport-annemasse-geneve-leman-express') order by slug;

-- Contrôle APRÈS des impératifs de vouvoiement restants, contrôle standard (verbes en -ez, « rendez-vous » neutralisé) : attendu 0 ligne (déjà 0 avant)
select slug, m[1] as mot from blog_posts, regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '(?:^|[\s*>#-])((?:[A-ZÉ][a-zé]+|[a-zé]+)ez)\M', 'g') as m where slug in ('arnaques-logement-frontalier-geneve-eviter','colocation-expats-geneve-guide','coliving-frais-dossier-geneve-annemasse','se-faire-reseau-geneve-arriver-seul','vie-quotidienne-frontalier-courses-sport-sorties','colocation-annemasse-ville-la-grand-ambilly','demenager-geneve-frontalier-checklist','dossier-location-frontalier-suisse-france','grand-geneve-2026-nouveautes-frontaliers','living-in-france-working-in-geneva','salaire-suisse-net-frontalier-2026','transport-annemasse-geneve-leman-express') and lower(m[1]) not in ('chez','assez','rez','nez') order by 1, 2;

-- Contrôle APRÈS élargi (tout mot en -ez, texte des liens et parenthèses compris) : attendu 0 ligne (19 avant)
select slug, m[1] as mot from blog_posts, regexp_matches(regexp_replace(content_fr, 'rendez-vous', '', 'gi'), '([[:alpha:]]+ez)\M', 'g') as m where slug in ('arnaques-logement-frontalier-geneve-eviter','colocation-expats-geneve-guide','coliving-frais-dossier-geneve-annemasse','se-faire-reseau-geneve-arriver-seul','vie-quotidienne-frontalier-courses-sport-sorties','colocation-annemasse-ville-la-grand-ambilly','demenager-geneve-frontalier-checklist','dossier-location-frontalier-suisse-france','grand-geneve-2026-nouveautes-frontaliers','living-in-france-working-in-geneva','salaire-suisse-net-frontalier-2026','transport-annemasse-geneve-leman-express') and lower(m[1]) not in ('chez','assez','rez','nez') order by 1, 2;
-- ---------------------------------------------------------------------------
-- APPLIQUÉ le 03/09/2026 (« C4 ter validé » par Jérôme) via MCP execute_sql, en un appel :
--   12 articles → 0 impératif caché (contrôle élargi), URL intactes.
--   BILAN après C1 → C4 ter : 40 articles FR publiés, 0 « vous » hors URL, 0 impératif en -ez
--   (standard et élargi). Restent 8 articles NON publiés au « vous » (à traiter à leur publication).
-- ---------------------------------------------------------------------------
-- Prérendu : le run GitHub 33779369517 (push 23d30a2, 16:33 UTC) s'est arrêté sur une erreur interne GitHub
--   (« GitHub Actions has encountered an internal error »), build réussi ; relancé par ce commit le 03/09 à 18:45.
