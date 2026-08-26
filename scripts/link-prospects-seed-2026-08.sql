-- ============================================================================
-- SEED : public.link_prospects — cibles de netlinking / autorité (Piliers 1-4)
-- Fichier   : scripts/link-prospects-seed-2026-08.sql
-- Date      : 21/08/2026
-- Objet     : alimenter la table link_prospects (créée au préalable par une
--             migration séparée) avec 50 cibles consolidées depuis les 5 documents
--             de référence ci-dessous, leur statut réel au 21/08/2026 et les
--             contacts / URL EXACTEMENT tels que documentés (sinon NULL — rien
--             n'est inventé ; les 5 domaines complétés hors doc sont signalés
--             « à vérifier » dans notes).
-- Exécution : Supabase SQL Editor (coller le fichier entier) OU MCP Supabase
--             execute_sql (le fichier en un seul appel). Transaction begin/commit.
-- Idempotent: chaque INSERT est en ON CONFLICT (lower(domain), coalesce(url_cible,''))
--             DO NOTHING → ré-exécutable sans doublon ; ne met PAS à jour les lignes
--             existantes (les statuts saisis ensuite ne sont jamais écrasés).
-- Pré-requis: table public.link_prospects + index unique sur
--             (lower(domain), coalesce(url_cible,'')) + contrainte
--             status='live' ⇒ live_at ET live_url renseignés.
--
-- Sources (lecture seule) — citées ligne à ligne dans source_doc :
--   Plan_Autorite_Linkbuilding.md            (lavilla-docs, plan maître 09/06/2026 — PRIORITAIRE)
--   PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md  (22/06/2026, zones A→E, TOP 10, URL + emails)
--   Plan_Backlinks_LaVilla.md                (Projets-Cowork/3-Site-Web-SEO/SEO, tiers 1-4, DR)
--   KIT_PRESSE_OBSERVATOIRE_2026-07.md       (emails presse ; Le Messager pitché en août 2026)
--   BACKLINKS_SUBMISSIONS.md                 (fiches annuaires prêtes à coller)
--   Priorité en cas de divergence : Plan_Autorite_Linkbuilding > PLAN_AUTORITE_CIBLES_LOCALES
--   > Plan_Backlinks (chaque divergence est consignée dans notes).
--
-- Conventions :
--   pilier : 1 GBP/avis · 2 citations & annuaires · 3 éditorial frontalier · 4 partenariats B2B2C
--   tier   : 1 (valeur/priorité max) → 4 ; repris de Plan_Backlinks quand la cible y figure,
--            sinon dérivé des ⭐ du plan maître (⭐⭐⭐=1, ⭐⭐=2, ⭐=3) ; NULL si aucune source
--            ne classe la cible. Plan_Backlinks classe presse/relocation en « Tier 4 » (gagné,
--            long) : quand le plan maître donne des ⭐, c'est lui qui fait foi.
--   dr     : uniquement si chiffré dans une source (CAGI DR 56 ; La Carte des Colocs = DA 49 Moz).
--   dofollow_attendu : true = éditorial/institutionnel (CAGI confirmé) ; false = plateformes,
--            annuaires, forums, réseaux (glocals confirmé nofollow) ; NULL = inconnu.
--   anchor_class : mix cible 40 % marque / 25 % URL nue / 25 % générique / 10 % exact
--            → ici 19 marque / 12 url_nue / 12 generique / 4 exact sur 47 lignes actionnables
--            (les 3 lignes « exclu » n'ont ni cible ni ancre).
--   target_path : pages existantes uniquement. /colocation-geneve (FR) de retour en ligne à
--            partir du 25/08/2026 → utilisé pour les cibles FR « colocation » ; presse →
--            /observatoire-logement-frontalier-geneve ; CAGI / relocation / expat →
--            /en/colocation-geneve ou /candidature ; /join-us (ancienne URL citée dans
--            BACKLINKS_SUBMISSIONS) remplacée par /en/candidature.
--   template : A-E = annexe du plan maître ; kit_presse_1/2/3 = emails 1/2/3 du kit presse ;
--            backlinks_submissions_N = fiche §N de BACKLINKS_SUBMISSIONS.md ; NULL = inscription
--            en ligne sans email.
--
-- NON INSÉRÉS (volontairement) :
--   - opérateurs concurrents (pas des annuaires) : Loca Colocs, Colonies, Cohabs, Ecla, Room Estate ;
--   - domaines inexistants (PLAN_AUTORITE_CIBLES_LOCALES §corrections) : frontalier.com,
--     comparateur-frontalier.com, « helloGeneva » ;
--   - cibles citées sans URL/domaine documenté : Prime Relocation, inlingua / Alliance Française /
--     ESL, Radio Lac, 20 minutes CH, Le Courrier, Roomgo.ch, Weegee.ch, Just Landed ;
--   - Anibis.ch (Plan_Backlinks Tier 2 seulement ; absent du plan maître ; plateforme fusionnée
--     avec tutti.ch — à vérifier avant toute action) ;
--   - citations NAP génériques (Bing Places, Apple Business Connect, PagesJaunes, Yelp, Kompass,
--     Cylex) : hygiène NAP, pas des prospects de lien — à traiter hors table.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- [01] Google Business Profile — Pilier 1 (ligne de suivi, pas un backlink)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Google Business Profile — La Villa Coliving', 'business.google.com', null, 'autre', 1, 1, null, null, true,
   null, null, null, null,
   null,
   'Fiche GBP unique « La Villa Coliving » à 100 % de complétion (catégorie, NAP, zone desservie, photos, Q/R, posts) + process avis Google 2-4/mois : le levier le plus proche du formulaire, effet en semaines.',
   'a_contacter', null, null, null, null, null,
   '/colocation-geneve', 'lavillacoliving.com/colocation-geneve', 'url_nue', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 1 (1.1-1.4) ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md TOP 10 #1 ; Plan_Backlinks_LaVilla.md Tier 1 ; BACKLINKS_SUBMISSIONS.md §1',
   'CONTRADICTION : le plan maître (prioritaire) impose UNE seule fiche à l''adresse du bureau / point d''accueil (résidences sans accueil = risque de suspension) ; PLAN_AUTORITE_CIBLES_LOCALES (TOP 10 #1), Plan_Backlinks (Tier 1) et BACKLINKS_SUBMISSIONS §1 prévoient 3 fiches (1/maison). Lien de la fiche vers /colocation-geneve ou /candidature, jamais la home. Ne jamais mettre de mots-clés dans le nom de la fiche. Avis : authentiques uniquement, jamais de contrepartie.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [02] GTE — frontalier.org (Pilier 3, cible n°1)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('GTE — Groupement transfrontalier européen (frontalier.org)', 'frontalier.org', 'https://frontalier.org/partenaires/', 'association', 3, 1, null, true, true,
   null, null, null, 'https://frontalier.org/partenaires/',
   'A',
   'Référence n°1 des frontaliers (~20 000 adhérents, Frontalier Magazine, basé à Annemasse) : partenariat Club frontaliers (avantage résidents), contenu expert « se loger côté France » ou encart Frontalier Magazine (payant, ultra-ciblé).',
   'a_contacter', null, null, null, null, null,
   '/colocation-geneve', 'La Villa Coliving', 'marque', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 3 (tableau cibles ⭐⭐⭐) + Annexe Template A ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md TOP 10 #3 + Zone D',
   'Cité dans /blog/guide-ressources-frontalier-geneve. Le plus dur, le plus précieux : dofollow institutionnel fort attendu. Contact : page contact/partenariats du site, à défaut secrétariat/rédaction du Frontalier Magazine (aucun email dans les docs). CORRECTION DOC : frontalier.com n''existe pas → frontalier.org (PLAN_AUTORITE_CIBLES_LOCALES §corrections). Relance unique à J+7.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [03] CAGI — Genève internationale (Pilier 3, DR 56, dofollow confirmé)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('CAGI — Centre d''Accueil de la Genève Internationale', 'cagi.ch', 'https://www.cagi.ch/en/practical-infos/housing-types/', 'institutionnel', 3, 1, 56, true, true,
   'Service logement', 'info@cagi.ch', '+41 22 546 14 00', null,
   'B',
   'Figurer comme ressource logement meublé côté France sur la page « Types de logements » de la Genève internationale (OI, missions, expats premium) — la liste référence déjà Loca Colocs (précédent + caution officielle).',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'La Villa Coliving', 'marque', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 3 (⭐⭐⭐) + Annexe Template B ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md TOP 10 #5 + Zone D (communauté expat, ✅ dofollow) ; Plan_Backlinks_LaVilla.md Tier 1 (DR 56)',
   'Dofollow CONFIRMÉ (PLAN_AUTORITE_CIBLES_LOCALES). Meilleur lien du concurrent (Plan_Backlinks). Cité dans /blog/guide-ressources-frontalier-geneve. Téléphone = Service logement (Plan_Backlinks) ; email générique info@cagi.ch (cibles locales). Fournir une fiche descriptive claire (bloc « À propos » du kit presse).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [04] geneve-int.ch — portail officiel Genève internationale
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Genève internationale — portail officiel (geneve-int.ch)', 'geneve-int.ch', null, 'institutionnel', 3, 3, null, true, true,
   null, null, null, null,
   'B',
   'Être référencé sur la page « Trouver un logement » du portail officiel de la Genève internationale (même logique que le CAGI, autorité officielle).',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'La Villa Coliving', 'marque', null,
   'Plan_Backlinks_LaVilla.md Tier 3 (pages-ressources frontalier/expat)',
   'Source unique : Plan_Backlinks (absent du plan maître et du plan cibles locales ; mail ✍️ à rédiger). URL exacte de la page « Trouver un logement » non documentée. Template B (CAGI) à adapter.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [05] lesfrontaliers.ch — rubrique Immobilier
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('lesfrontaliers.ch — rubrique Immobilier', 'lesfrontaliers.ch', 'https://lesfrontaliers.ch/immobilier/', 'media_frontalier', 3, null, null, true, true,
   null, null, null, null,
   'kit_presse_1',
   'Relais de l''Observatoire dans la rubrique Immobilier (email 1 du kit presse adapté : « votre rubrique immobilier » au lieu de « vos lecteurs frontaliers »).',
   'a_contacter', null, null, null, null, null,
   '/observatoire-logement-frontalier-geneve', 'lavillacoliving.com/observatoire-logement-frontalier-geneve', 'url_nue', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md TOP 10 #9 + Zone D (organisations frontalières ⭐) ; KIT_PRESSE_OBSERVATOIRE_2026-07.md checklist #3',
   'Cluster immo frontalier actif. Email de la rédaction non documenté (à trouver sur le site). Second angle possible : lien contextuel vers /colocation-geneve si un article s''y prête (ne pas cumuler les ancres exactes). Envoi prévu le mardi, après Le Messager (ordre du kit).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [06] Guide du Frontalier
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Guide du Frontalier', 'guidedufrontalier.com', 'https://guidedufrontalier.com/location-frontiere-suisse', 'media_frontalier', 3, 3, null, true, true,
   null, null, null, null,
   'backlinks_submissions_8',
   'Proposer le coliving comme solution dans la page « location frontière suisse » (article / listing partenariat) — email prêt dans BACKLINKS_SUBMISSIONS §8.',
   'a_contacter', null, null, null, null, null,
   '/colocation-geneve', 'colocation Genève', 'exact', null,
   'Plan_Backlinks_LaVilla.md Tier 3 ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (organisations frontalières) ; BACKLINKS_SUBMISSIONS.md §8 (email partenariat)',
   'Email de contact non documenté (formulaire partenariat). Future cible « hub du frontalier » (Plan_Backlinks Tier 4 : faire lier les calculateurs). Ancre exacte 1/4 — ne la demander que si le lien est dofollow et contextuel.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [07] travailler-en-suisse.ch
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Travailler en Suisse — logement des frontaliers', 'travailler-en-suisse.ch', null, 'media_frontalier', 3, 3, null, true, true,
   null, null, null, null,
   'E',
   'Inclusion dans la rubrique « logement des frontaliers » comme solution meublée tout inclus côté France.',
   'a_contacter', null, null, null, null, null,
   '/annemasse-colocation', 'colocation Annemasse', 'exact', null,
   'Plan_Backlinks_LaVilla.md Tier 3 (pages-ressources frontalier/expat)',
   'Source unique : Plan_Backlinks (pitch court ✍️ à rédiger). Page cible exacte non documentée. Ancre exacte 2/4.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [08] Forum Welcome-Suisse — rubrique Immobilier (nofollow, trafic)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Forum Welcome-Suisse — rubrique Immobilier', 'forum.welcome-suisse.ch', 'https://forum.welcome-suisse.ch/c/immobilier/9', 'media_frontalier', 3, null, null, false, true,
   null, null, null, null,
   null,
   'Réponses utiles (non promotionnelles) dans les fils logement frontalier, avec lien vers la page colocation Genève quand c''est pertinent — lire les CGU avant.',
   'a_contacter', null, null, null, null, null,
   '/colocation-geneve', 'www.lavillacoliving.com/colocation-geneve', 'url_nue', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (organisations frontalières) + garde-fous',
   'Forum = nofollow probable ; valeur trafic/diversité. Pas de spam : une réponse utile vaut mieux que dix liens. Pas d''email : action manuelle sur le forum (template NULL).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [09] CA Frontaliers — rubrique Logement (effort élevé)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('CA Frontaliers (Crédit Agricole) — rubrique Logement', 'ca-frontaliers.com', 'https://ca-frontaliers.com/logement/', 'media_frontalier', 3, null, null, true, true,
   null, null, null, null,
   'C',
   'Proposer l''Observatoire (loyer studio réel-marché × temps de trajet, 17 communes) pour un dossier logement frontalier.',
   'a_contacter', null, null, null, null, null,
   '/observatoire-logement-frontalier-geneve', 'observatoire des loyers du Genevois français', 'generique', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (effort élevé) + §Pré-requis presse',
   'Effort élevé : conflit d''intérêt potentiel (Square Habitat, filiale immobilière du Crédit Agricole). Le sujet « loyers frontaliers » y est déjà traité (marronnier) → n''attaquer qu''avec le chiffre neuf (+44 % au m² pour un nouvel arrivant à Genève).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [10] Maison transfrontalière
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Maison transfrontalière', 'maison-transfrontaliere.com', null, 'institutionnel', 3, 2, null, true, true,
   null, null, null, null,
   'E',
   'Figurer comme fiche / ressource hébergement du réseau transfrontalier.',
   'a_contacter', null, null, null, null, null,
   '/colocation-geneve', 'hébergement frontalier côté France', 'generique', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 3 (tableau cibles ⭐⭐) + Pilier 2 (annuaires locaux/institutionnels) + Annexe Template E',
   'Absent du plan cibles locales et de Plan_Backlinks. Contact : page contact du site (non documenté).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [11] genevepascher.com — fiches frontaliers
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Genève pas cher — fiches frontaliers', 'genevepascher.com', null, 'annuaire', 2, null, null, null, true,
   null, null, null, null,
   'E',
   'Fiche ressource « se loger côté France » pour les frontaliers (site déjà repéré dans le paysage).',
   'a_contacter', null, null, null, null, null,
   '/colocation-geneve', 'chambre meublée tout inclus près de Genève', 'generique', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (annuaires locaux/institutionnels — Template E)',
   'Annuaire local : « parfois du dofollow » (plan maître) → dofollow inconnu. Contact non documenté.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [12] glocals.com — LIVE depuis le 08/06/2026 (profil nofollow)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('glocals.com — communauté expat Genève', 'glocals.com', 'https://www.glocals.com/classifieds/geneva/housing', 'communaute_expat', 3, 3, null, false, true,
   null, null, null, null,
   'backlinks_submissions_5',
   'Profil + annonces logement (Housing & Real Estate > Rooms / Shared Housing) : trafic expat anglophone qualifié, pas de jus SEO.',
   'live', null, null, null, '2026-06-08', 'https://www.glocals.com',
   '/en/candidature', 'La Villa Coliving', 'marque', true,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (état des inscriptions 08/06/2026 ✅ garder) + Pilier 3 (⭐, souvent nofollow) ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (❌ nofollow) ; Plan_Backlinks_LaVilla.md Tier 3 ; BACKLINKS_SUBMISSIONS.md §5',
   'Cité dans /blog/guide-ressources-frontalier-geneve. Profil NOFOLLOW. URL exacte du profil/annonce inconnue → live_url = domaine. L''annonce de BACKLINKS_SUBMISSIONS §5 pointe vers /join-us (ancienne URL, redirigée) → vérifier et mettre à jour vers /en/candidature. CONTRADICTION : Plan_Backlinks Tier 3 espérait du dofollow ; plan maître et cibles locales = nofollow (retenu).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [13] Expat.com — annuaire business
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Expat.com — annuaire business Genève', 'expat.com', 'https://www.expat.com/en/business', 'communaute_expat', 3, 3, null, false, true,
   null, null, null, null,
   'backlinks_submissions_4',
   'Fiche business (Accommodation > Shared Housing, Genève) — texte FR prêt dans BACKLINKS_SUBMISSIONS §4.',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'La Villa Coliving', 'marque', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 3 (⭐, Template E adapté) ; BACKLINKS_SUBMISSIONS.md §4 (priorité haute, gratuit)',
   'Souvent nofollow (plan maître) : trafic + diversité. Création de la fiche non tracée dans les docs (statut présumé : à faire).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [14] EasyExpat — guide logement Genève
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('EasyExpat — guide logement Genève', 'easyexpat.com', null, 'communaute_expat', 3, 3, null, false, true,
   null, null, null, null,
   'E',
   'Demander l''inclusion dans la page colocation / logement du guide Genève.',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'furnished coliving rooms near Geneva', 'generique', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 3 (⭐, Template E adapté) ; Plan_Backlinks_LaVilla.md Tier 3 + Tier 4 (hub du frontalier)',
   'Pitch court ✍️ à rédiger (Plan_Backlinks). Future cible « hub du frontalier » (faire lier les calculateurs). Souvent nofollow.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [15] Expatica — directory Suisse
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Expatica — directory Suisse', 'expatica.com', 'https://www.expatica.com/ch/directory', 'communaute_expat', 2, null, null, false, true,
   null, null, null, null,
   'backlinks_submissions_3',
   'Fiche Housing & Accommodation (texte EN prêt) — citation + trafic expat.',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'La Villa Coliving', 'marque', null,
   'BACKLINKS_SUBMISSIONS.md §3 (priorité haute, gratuit)',
   'Absent des 3 plans d''autorité (source unique : BACKLINKS_SUBMISSIONS). Directory = nofollow probable.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [16] Expat Arrivals — Accommodation in Geneva (dofollow ✅)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Expat Arrivals — Accommodation in Geneva', 'expatarrivals.com', null, 'communaute_expat', 3, null, null, true, true,
   null, null, null, null,
   'E',
   'La page « accommodation Geneva » invite des contributeurs : proposer un encart coliving côté France.',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'coliving Geneva', 'exact', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (communauté expat, ✅ dofollow)',
   'URL tronquée dans le doc (expatarrivals.com/.../accommodation-geneva) → à retrouver avant envoi. Ancre exacte EN 3/4 (contenu contributeur = ancre maîtrisable).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [17] Geneva Interns Association — housing tips
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Geneva Interns Association — housing tips', 'internsassociation.org', null, 'association', 4, null, null, true, true,
   null, null, null, null,
   'E',
   'Ajout en « housing resources » pour les stagiaires des organisations internationales (jeunes pros, séjours 6-12 mois).',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'www.lavillacoliving.com', 'url_nue', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (communauté expat, ✅ probable)',
   'URL tronquée dans le doc (internsassociation.org/.../housing-tips/). Dofollow probable. Pilier 4 (B2B2C jeunes pros).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [18] Knowitall.ch — feature coliving frontalier
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Knowitall.ch', 'knowitall.ch', null, 'communaute_expat', 3, null, null, true, true,
   null, null, null, null,
   'C',
   'Feature « coliving frontalier » pour la communauté anglophone de la région lémanique (pitch presse en anglais).',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'coliving near Geneva', 'generique', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (communauté expat, ✅ dofollow)',
   'Template C (presse) adapté en anglais ; l''ancre dépendra du rédacteur.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [19] InterNations Genève (nofollow, leads)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('InterNations Genève', 'internations.org', null, 'communaute_expat', 2, 3, null, false, true,
   null, null, null, null,
   'E',
   'Profil + mentions dans les classifieds housing Genève — leads expats, pas de SEO.',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'La Villa Coliving', 'marque', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (communauté expat, ❌ nofollow) ; Plan_Backlinks_LaVilla.md Tier 3',
   'Nofollow. Pas de spam dans les groupes. CONTRADICTION mineure : Plan_Backlinks espérait du dofollow.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [20] Lodge Relocation — Neighbouring France (Pilier 4)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Lodge Relocation — Neighbouring France', 'lodge-relocation.com', 'https://lodge-relocation.com/neighbouring-france/', 'partenaire_relocation', 4, 2, null, true, true,
   null, null, null, null,
   'D',
   'Partenariat B2B2C : La Villa = solution logement côté France pour leurs clients arrivant à Genève, lien depuis la page « Neighbouring France ».',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'La Villa Coliving', 'marque', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md TOP 10 #8 + Zone D (partenaires relocation ⭐) ; Plan_Autorite_Linkbuilding.md §2 Pilier 3/4 (agences de relocation ⭐⭐) + Annexe Template D',
   'Emplacement parfait pour un partenaire logement FR. Contact : formulaire pro / email direction (non documenté). Relance J+7 avec proposition de créneau 15 min.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [21] Relocation Genevoise (Pilier 4)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Relocation Genevoise', 'relocation-genevoise.ch', null, 'partenaire_relocation', 4, 2, null, true, true,
   null, null, null, null,
   'D',
   'Partenariat : accès prioritaire aux chambres pour leurs clients + référencement croisé sur les pages partenaires.',
   'a_contacter', null, null, null, null, null,
   '/candidature', 'La Villa Coliving', 'marque', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 3 (⭐⭐) + Pilier 4 + Annexe Template D',
   'Contact : formulaire pro ou email direction (non documenté). Plan_Backlinks classe relocation en Tier 4 (plan maître ⭐⭐ retenu).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [22] Leman Relocation (Pilier 4) — DOMAINE À VÉRIFIER
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Leman Relocation', 'lemanrelocation.com', null, 'partenaire_relocation', 4, 2, null, true, true,
   null, null, null, null,
   'D',
   'Partenariat B2B2C : solution logement côté France pour les cadres/expats relocalisés à Genève, lien depuis leur page ressources/partenaires.',
   'a_contacter', null, null, null, null, null,
   '/en/candidature', 'La Villa Coliving', 'marque', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 3 (⭐⭐) + Pilier 4 + Annexe Template D',
   'ATTENTION : domaine NON cité dans les sources (le plan maître ne donne que le nom « Leman Relocation ») — déduit du nom, À VÉRIFIER avant envoi (corriger domain si besoin). Prime Relocation (cibles locales) non inséré faute de domaine documenté.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [23] Le Messager — éd. Genevois — ENVOYÉ (août 2026, sans réponse)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Le Messager — édition Genevois', 'lemessager.fr', 'https://www.lemessager.fr', 'presse', 3, 2, null, true, true,
   'Rédaction Annemasse (éd. Genevois)', 'redactionannemasse@lemessager.fr', '04 50 07 31 90', null,
   'kit_presse_1',
   'Pitch data : données exclusives de l''Observatoire (+44 % au m² pour un nouvel arrivant à Genève, 17 communes classées) pour la rubrique frontaliers de l''hebdo qui couvre les 3 communes.',
   'envoye', '2026-08-10', null, null, null, null,
   '/observatoire-logement-frontalier-geneve', 'lavillacoliving.com/observatoire-logement-frontalier-geneve', 'url_nue', null,
   'KIT_PRESSE_OBSERVATOIRE_2026-07.md Email 1 + checklist #1 ; Plan_Autorite_Linkbuilding.md §2 Pilier 3 (⭐⭐) + Annexe Template C ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md TOP 10 #4 + Zone A',
   'Pitché en août 2026 (kit presse email 1) — DATE APPROXIMATIVE (sent_at = 10/08/2026 indicatif). Sans réponse au 21/08/2026. Relance : appel 04 50 07 31 90 à J+3 si silence (kit) ; 1 relance max à J+4 (kit) vs J+7 (plan maître) — relance non tracée (followup_at NULL). Le plan maître recommande d''écrire au/à la journaliste qui signe les sujets frontaliers plutôt qu''à la boîte générique. Plan_Backlinks classe la presse en Tier 4 (plan maître ⭐⭐ retenu).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [24] Le Dauphiné Libéré — Haute-Savoie
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Le Dauphiné Libéré — Haute-Savoie', 'ledauphine.com', 'https://www.ledauphine.com/haute-savoie', 'presse', 3, 2, null, true, true,
   null, 'LDLcentreann@ledauphine.com', null, null,
   'kit_presse_2',
   'Étude « combien coûte vraiment se loger dans le Genevois quand on travaille à Genève ? » — 17 communes, données ouvertes, témoignage terrain.',
   'a_contacter', null, null, null, null, null,
   '/observatoire-logement-frontalier-geneve', 'La Villa Coliving', 'marque', null,
   'KIT_PRESSE_OBSERVATOIRE_2026-07.md Email 2 + checklist #2 ; Plan_Autorite_Linkbuilding.md §2 Pilier 3 (⭐⭐, Template C adapté) ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone A (effort moyen-élevé)',
   'Envoyer après Le Messager (ordre du kit presse : mardi). Pas de pièce jointe lourde, liens seulement.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [25] Tribune de Genève (après 1-2 retombées FR)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Tribune de Genève', 'tdg.ch', 'https://www.tdg.ch', 'presse', 3, 4, null, true, true,
   null, 'redaction@tdg.ch', null, null,
   'kit_presse_3',
   'Le +44 % que paient les nouveaux locataires à Genève — données ouvertes, 17 communes françaises comparées (à envoyer après 1-2 retombées FR pour crédibiliser).',
   'a_contacter', null, null, null, null, null,
   '/observatoire-logement-frontalier-geneve', 'lavillacoliving.com/observatoire-logement-frontalier-geneve', 'url_nue', null,
   'KIT_PRESSE_OBSERVATOIRE_2026-07.md Email 3 + checklist #5 ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (presse Genève, haut effort) ; Plan_Backlinks_LaVilla.md Tier 4',
   'Vague 4 : n''envoyer qu''après 1-2 retombées FR. Marronnier « loyers frontaliers » déjà traité par la TdG → uniquement l''angle data (+44 %, sources OCSTAT / annonces juin 2026). Tier 4 = classement Plan_Backlinks (absente du plan maître).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [26] France 3 Auvergne-Rhône-Alpes
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('France 3 Auvergne-Rhône-Alpes', 'france3-regions.francetvinfo.fr', null, 'presse', 3, 2, null, true, true,
   null, null, null, null,
   'C',
   'Sujet logement / frontaliers (TV régionale) — à activer après les retombées presse écrite.',
   'a_contacter', null, null, null, null, null,
   '/observatoire-logement-frontalier-geneve', 'La Villa Coliving', 'marque', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 3 (⭐⭐, « france3-regions… », Template C adapté)',
   'Domaine complété (tronqué « france3-regions… » dans le doc) — à vérifier. Les radios/TV reprennent la presse écrite → après Le Messager / Le Dauphiné (kit presse).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [27] Léman Bleu — DOMAINE À VÉRIFIER
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Léman Bleu', 'lemanbleu.ch', null, 'presse', 3, 4, null, true, true,
   null, null, null, null,
   'kit_presse_3',
   'Email 3 raccourci après une première retombée (TV locale genevoise).',
   'a_contacter', null, null, null, null, null,
   '/observatoire-logement-frontalier-geneve', 'lavillacoliving.com/observatoire-logement-frontalier-geneve', 'url_nue', null,
   'KIT_PRESSE_OBSERVATOIRE_2026-07.md checklist #4 ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (presse Genève) ; Plan_Backlinks_LaVilla.md Tier 4',
   'Domaine non cité dans les docs (nom seul) — complété, à vérifier. Contact non documenté.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [28] GHI — DOMAINE À VÉRIFIER
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('GHI — Genève Home Informations', 'ghi.ch', null, 'presse', 3, null, null, true, true,
   null, null, null, null,
   'kit_presse_3',
   'Email 3 raccourci après une première retombée (hebdo gratuit genevois).',
   'a_contacter', null, null, null, null, null,
   '/observatoire-logement-frontalier-geneve', 'lavillacoliving.com/observatoire-logement-frontalier-geneve', 'url_nue', null,
   'KIT_PRESSE_OBSERVATOIRE_2026-07.md checklist #4 ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone D (presse Genève)',
   'Domaine non cité dans les docs (nom seul) — complété, à vérifier. Radio Lac, 20 minutes CH et Le Courrier (cadrage social) non insérés : mentions sans URL ni contact.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [29] Annemasse Agglo — Entreprises et commerces
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Annemasse – Les Voirons Agglomération — Entreprises et commerces', 'annemasse-agglo.fr', 'https://www.annemasse-agglo.fr/partenaires-et-pros/entreprises-et-commerces', 'collectivite', 2, null, null, true, false,
   null, null, null, null,
   'E',
   'Être relayé par le service développement économique (annuaire éco / acteurs locaux de l''hébergement).',
   'a_contacter', null, null, null, null, null,
   '/annemasse-colocation', 'hébergement en coliving sur Annemasse Agglo', 'generique', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (annuaires locaux/institutionnels — Template E) ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone A',
   'Annuaire local : « parfois du dofollow ». Couvre aussi Ambilly (Zone C : peu de cibles propres).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [30] Office de Tourisme des Monts du Genevois
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Office de Tourisme des Monts du Genevois', 'montsdugenevois.com', null, 'institutionnel', 2, null, null, true, true,
   null, null, null, null,
   'E',
   'Espace pro / hébergeur : figurer dans la rubrique hébergement (lien institutionnel local le plus facile).',
   'a_contacter', null, null, null, null, null,
   '/nos-maisons', 'chambres meublées tout inclus en coliving', 'generique', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md TOP 10 #7 + Zone A ; Plan_Autorite_Linkbuilding.md §2 Pilier 2 (« office de tourisme du Genevois / Annemasse », Template E)',
   'Modalités (espace hébergeur, acceptation du coliving longue durée) à valider de visu.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [31] Mairie de Ville-la-Grand
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Mairie de Ville-la-Grand', 'ville-la-grand.fr', null, 'collectivite', 2, null, null, true, false,
   null, 'secretariat.maire@vlg.fr', null, null,
   'E',
   'Entreprise implantée sur la commune (La Villa) → annuaire économique / actualités locales.',
   'a_contacter', null, null, null, null, null,
   '/lavilla', 'La Villa Coliving', 'marque', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone B (Ville-la-Grand)',
   'Ancrage géo (NAP) plutôt que thématique.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [32] Mairie d'Ambilly
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Mairie d''Ambilly', 'ambilly.fr', null, 'collectivite', 2, null, null, true, false,
   null, 'mairie@ambilly.fr', null, null,
   'E',
   'Entreprise implantée (Le Loft) → rubrique vie locale / annuaire.',
   'a_contacter', null, null, null, null, null,
   '/leloft', 'La Villa Coliving — Le Loft', 'marque', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone C (Ambilly)',
   'Petite commune : surtout un NAP local (citer « Ambilly ») ; le reste passe par Annemasse Agglo.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [33] CCI Haute-Savoie — DOMAINE À VÉRIFIER
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('CCI Haute-Savoie — annuaire des entreprises', 'haute-savoie.cci.fr', null, 'institutionnel', 2, null, null, true, false,
   null, null, null, null,
   'E',
   'Fiche dans l''annuaire entreprises de la CCI (ancrage géo, parfois dofollow).',
   'a_contacter', null, null, null, null, null,
   '/', 'www.lavillacoliving.com', 'url_nue', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (annuaires locaux/institutionnels)',
   'Domaine non cité dans le doc (nom seul) — complété, à vérifier. Prérequis probable : immatriculation / SIRET.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [34] Ville-la-Grand Basket — sponsoring (Pilier 4, non thématique)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Ville-la-Grand Basket — devenir partenaire', 'vlgbasket.fr', 'https://vlgbasket.fr/sponsors/devenir-partenaire-comment-et-pourquoi.html', 'association', 4, null, null, true, false,
   null, null, null, 'https://vlgbasket.fr/sponsors/devenir-partenaire-comment-et-pourquoi.html',
   'E',
   'Sponsoring local = backlink quasi garanti depuis la page sponsors, dans la commune de La Villa.',
   'a_contacter', null, null, null, null, null,
   '/lavilla', 'La Villa Coliving', 'marque', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md TOP 10 #10 + Zone B',
   'Lien sponsor (non thématique) : bon pour l''ancrage local, pas pour la pertinence. Coût du sponsoring à cadrer.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [35] Coworkimmo — coworking Annemasse / VLG
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Coworkimmo — coworking immobilier Annemasse', 'coworkimmo.com', 'https://coworkimmo.com/coworking-immobilier-annemasse', 'autre', 4, null, null, true, true,
   null, null, null, null,
   'E',
   'Partenariat logement ↔ coworking (zone commerciale de Ville-la-Grand) : référencement croisé.',
   'a_contacter', null, null, null, null, null,
   '/annemasse-colocation', 'se loger en coliving près d''Annemasse', 'generique', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone B (Ville-la-Grand)',
   'Effort faible. Dofollow à vérifier.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [36] Grand Forma — pôle Annemasse Agglo (école)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Grand Forma — pôle Annemasse Agglo', 'grandforma.fr', 'https://grandforma.fr/pole/annemasse-agglo', 'ecole', 4, null, null, true, true,
   null, null, null, null,
   'E',
   'Logement étudiant / alternant (~1 500 étudiants du supérieur) : ressource logement pour le pôle Annemasse.',
   'a_contacter', null, null, null, null, null,
   '/chambre-a-louer-annemasse', 'logement en coliving pour étudiants et alternants', 'generique', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone A ; Plan_Autorite_Linkbuilding.md §2 Pilier 4 (écoles / centres de formation transfrontaliers)',
   'Attention cible : bail 12 mois et loyer 1 380 CHF → viser alternants / jeunes pros plutôt qu''étudiants.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [37] Leman Langues (FLE)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Leman Langues (FLE)', 'leman-langues.com', null, 'ecole', 4, null, null, true, true,
   null, null, null, null,
   'E',
   'Logement des élèves FLE en séjour long (ressource hébergement de l''école).',
   'a_contacter', null, null, null, null, null,
   '/chambre-a-louer-annemasse', 'logement meublé pour élèves en séjour linguistique', 'generique', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone A',
   'Effort faible. inlingua / Alliance Française / ESL (Zone D, écoles de langues Genève) non insérés : pas d''URL documentée.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [38] La Carte des Colocs — LIVE depuis le 08/06/2026
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('La Carte des Colocs', 'lacartedescolocs.fr', 'https://www.lacartedescolocs.fr/proposer-un-logement', 'annuaire', 2, 1, 49, true, true,
   null, null, null, null,
   null,
   'Plateforme colocation n°1 en France, gratuite bailleur, trafic ultra-qualifié géolocalisé — réplication directe du lien que possède le concurrent.',
   'live', null, null, null, '2026-06-08', 'https://www.lacartedescolocs.fr',
   '/', 'La Villa Coliving', 'marque', null,
   'Plan_Autorite_Linkbuilding.md §1 + §2 Pilier 2 (état des inscriptions 08/06/2026 ✅ garder — top) ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md TOP 10 #2 + Zone E ; Plan_Backlinks_LaVilla.md Tier 1 (offre PRO, DA 49)',
   'Inscrit le 08/06/2026 (plan maître). URL de la fiche inconnue → live_url = domaine ; rel_nofollow inconnu. dr = DA 49 (métrique Moz citée par Plan_Backlinks, pas un DR Ahrefs). CONTRADICTION : Plan_Backlinks annonce un lien dofollow (offre PRO) vs « annuaires quasi tous nofollow » (plan maître) → vérifier sur la fiche. Action : soigner / tenir à jour la fiche, évaluer le passage en offre PRO.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [39] BookMyColiving — LIVE depuis le 08/06/2026
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('BookMyColiving', 'bookmycoliving.com', null, 'annuaire', 2, null, null, false, true,
   null, null, null, null,
   null,
   'Annuaire coliving gratuit à vie, zéro commission, leads directs à l''opérateur — 100 % cohérent avec le 0 frais.',
   'live', null, null, null, '2026-06-08', 'https://www.bookmycoliving.com',
   '/', 'La Villa Coliving', 'marque', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (état des inscriptions 08/06/2026 ✅ garder — top ; annuaires coliving sectoriels)',
   'Inscrit le 08/06/2026. URL de la fiche inconnue → live_url = domaine ; rel_nofollow inconnu. Action : compléter la fiche à fond.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [40] Appartager — LIVE depuis le 08/06/2026 (second rideau)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Appartager (SpareRoom)', 'appartager.com', null, 'annuaire', 2, 2, null, false, true,
   null, null, null, null,
   null,
   'Annonce bailleur gratuite (freemium) — second rideau : c''est le candidat qui paie l''abonnement pour contacter.',
   'live', null, null, null, '2026-06-08', 'https://www.appartager.com',
   '/', 'La Villa Coliving', 'marque', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (état des inscriptions 08/06/2026 ✅ second rideau) ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone E ; Plan_Backlinks_LaVilla.md Tier 2',
   'Inscrit le 08/06/2026 ; garder sans y investir d''énergie. URL de l''annonce inconnue ; rel_nofollow inconnu. Le plan cibles locales cite appartager.com/publiez-votre-announce (probable coquille « annonce »). Plan_Backlinks le liste encore ⬜ (obsolète).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [41] Coliving.com — fiche existante à réclamer (direct bookings uniquement)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Coliving.com — fiche Geneva', 'coliving.com', 'https://coliving.com/geneva', 'annuaire', 2, null, null, false, true,
   null, null, null, 'https://coliving.com/host',
   'backlinks_submissions_2',
   'Réclamer / compléter la fiche existante (coliving.com/geneva), activer « direct bookings » → toutes les demandes vers le site, jamais via leur paiement.',
   'en_discussion', null, null, null, null, null,
   '/en/candidature', 'La Villa Coliving', 'marque', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (⚠️ réservation directe UNIQUEMENT) ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md §corrections + TOP 10 #6 + Zone E ; BACKLINKS_SUBMISSIONS.md §2',
   'Fiche existante à réclamer (cibles locales : « tu es déjà sur coliving.com/geneva ») — BACKLINKS_SUBMISSIONS §2 prévoyait une création via coliving.com/host (obsolète). Commission = 1er mois de loyer sur les réservations via la plateforme (incohérent avec le 0 frais) → direct bookings uniquement. Avis Trustpilot médiocres. Vérifier le lien sortant de la fiche vers le site (backlink quasi acquis) ; seuil ≥ 6 chambres par maison à confirmer pour Le Lodge.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [42] Coliving-France — page référencement
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Coliving-France — référencement', 'coliving-france.fr', 'https://coliving-france.fr/referencement', 'annuaire', 2, null, null, false, true,
   null, null, null, null,
   null,
   'Annuaire FR coliving avec page référencement — trafic FR ciblé coliving.',
   'a_contacter', null, null, null, null, null,
   '/colocation-geneve', 'coliving Genève', 'exact', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (annuaires coliving sectoriels ⏳ à faire)',
   'Phase 1 (semaines 1-4). Ancre exacte 4/4 uniquement si le formulaire laisse choisir l''ancre et que le lien est dofollow ; sinon marque.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [43] Enjoy Coliving
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Enjoy Coliving', 'enjoycoliving.webflow.io', null, 'annuaire', 2, null, null, false, true,
   null, null, null, null,
   null,
   'Soumission gratuite ; discours « cooptation / communauté » aligné avec le positionnement.',
   'a_contacter', null, null, null, null, null,
   '/le-coliving', 'coliving en communauté près de Genève', 'generique', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (annuaires coliving sectoriels ⏳ à faire)',
   'Site Webflow (sous-domaine) : autorité faible, trafic de niche. Phase 1.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [44] Planet Nomad — promouvoir un coliving
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Planet Nomad — promouvoir un coliving', 'planet-nomad.com', null, 'annuaire', 2, null, null, false, true,
   null, null, null, null,
   null,
   'Annuaire de 200+ colivings (page « promouvoir un coliving »).',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'coliving near Geneva', 'generique', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (annuaires coliving sectoriels ⏳ à faire)',
   'Phase 1. URL exacte de la page « promouvoir un coliving » non documentée.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [45] Coliving.community — France
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Coliving.community — France', 'coliving.community', 'https://coliving.community/in/france', 'annuaire', 2, null, null, false, true,
   null, null, null, null,
   null,
   'Annuaire curé des colivings en France (gratuit).',
   'a_contacter', null, null, null, null, null,
   '/en/colocation-geneve', 'www.lavillacoliving.com', 'url_nue', null,
   'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone E (annuaires colocation/coliving)',
   'Curé : la fiche peut être refusée / modérée. Effort moyen.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [46] Leboncoin — 3 annonces (acquisition, nofollow)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Leboncoin — 3 annonces (1 par maison)', 'leboncoin.fr', null, 'annuaire', 2, 2, null, false, false,
   null, null, null, null,
   null,
   'Volume colossal, intention réelle : 3 annonces soignées (photos, loyer CHF tout inclus, 0 frais présenté comme modèle) — acquisition directe, pas SEO.',
   'a_contacter', null, null, null, null, null,
   '/candidature', 'www.lavillacoliving.com/candidature', 'url_nue', null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (⏳ À FAIRE — priorité) + §3 Phase 1 ; Plan_Backlinks_LaVilla.md Tier 2 (textes ✅ dans SEO_Textes_GBP_Annuaires.md §2)',
   'Lien souvent nofollow (voire absent). Phase 1 (semaines 1-4). Textes prêts dans SEO_Textes_GBP_Annuaires.md (non relu ici).')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [47] LinkedIn — page entreprise
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('LinkedIn — page entreprise La Villa Coliving', 'linkedin.com', null, 'autre', 2, null, null, false, false,
   null, null, null, null,
   null,
   'Page entreprise active (le concurrent a ~1 400 abonnés) : marque + canal B2B2C (RH genevoises, relocation).',
   'a_contacter', null, null, null, null, null,
   '/', 'www.lavillacoliving.com', 'url_nue', null,
   'Plan_Autorite_Linkbuilding.md §1 (ce que le concurrent a) + §2 Pilier 2 (⏳ À FAIRE — priorité) + §3 Phase 1',
   'Nofollow. Phase 1 (semaines 1-4). Renseigner url_cible / live_url avec l''URL de la page une fois créée.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [48] Roomlala — EXCLU (commission locataire)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Roomlala', 'roomlala.com', null, 'annuaire', 2, 2, null, false, false,
   null, null, null, null,
   null,
   'Ne pas utiliser : plateforme orientée chambre chez l''habitant / courte durée, avec commission facturée au locataire.',
   'exclu', null, null, null, null, null,
   null, null, null, null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (état des inscriptions 08/06/2026 ❌ retirer) + §À ne surtout pas faire ; Plan_Backlinks_LaVilla.md Tier 2 (obsolète) ; PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md Zone E',
   'MOTIF : commission AU LOCATAIRE de 12-20 % (jusqu''à 25 % du 1er loyer au-delà de 2 mois) = exact opposé du message 0 frais ; hors cible premium. Annonce créée le 08/06/2026 → à SUPPRIMER (plan maître : risque structurel, plateforme conçue pour la réservation interne avec commission). CONTRADICTION : Plan_Backlinks Tier 2 (texte ✅) et cibles locales Zone E la recommandent encore — plan maître prioritaire.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [49] Studapart — EXCLU (frais de dossier locataire)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Studapart', 'studapart.com', null, 'annuaire', 2, null, null, false, true,
   null, null, null, null,
   null,
   'Ne pas utiliser : frais de dossier facturés au locataire.',
   'exclu', null, null, null, null, null,
   null, null, null, null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (⚠️ Studapart) + §À ne surtout pas faire',
   'MOTIF : grosse audience mais facture des frais de dossier au locataire — incompatible avec « 0 frais » (même logique que Roomlala). Ne jamais router une réservation via un tunnel à commission locataire.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

-- ---------------------------------------------------------------------------
-- [50] Cohébergement.com — EXCLU (hors cible)
-- ---------------------------------------------------------------------------
insert into public.link_prospects
  (name, domain, url_cible, type, pilier, tier, dr, dofollow_attendu, thematique,
   contact_nom, contact_email, contact_tel, contact_url,
   template, angle, status, sent_at, followup_at, replied_at, live_at, live_url,
   target_path, anchor_text, anchor_class, rel_nofollow, source_doc, notes)
values
  ('Cohébergement.com', 'cohebergement.com', null, 'annuaire', 2, 2, null, false, false,
   null, null, null, null,
   null,
   'Ne pas utiliser : colocation / séjours chez l''habitant économiques, étudiants / courte durée, site daté.',
   'exclu', null, null, null, null, null,
   null, null, null, null,
   'Plan_Autorite_Linkbuilding.md §2 Pilier 2 (état des inscriptions 08/06/2026 ❌ laisser tomber) ; Plan_Backlinks_LaVilla.md Tier 2 (obsolète)',
   'MOTIF : hors cible pour du coliving frontalier premium ; pas un danger, aucun intérêt. Annonce créée le 08/06/2026 → ignorer ou supprimer. CONTRADICTION : Plan_Backlinks Tier 2 le recommandait (texte ✅) — plan maître prioritaire.')
on conflict (lower(domain), coalesce(url_cible,'')) do nothing;

commit;

-- ---------------------------------------------------------------------------
-- CONTRÔLE : répartition par status et par type (+ total)
-- Attendu après un 1er passage sur table vide : total 50 ·
--   status : a_contacter 41 · live 4 · envoye 1 · en_discussion 1 · exclu 3
--   type   : annuaire 13 · communaute_expat 7 · presse 6 · media_frontalier 5 ·
--            institutionnel 5 · association 3 · collectivite 3 ·
--            partenaire_relocation 3 · autre 3 · ecole 2
-- ---------------------------------------------------------------------------
select 'par status' as axe, status as valeur, count(*) as n
  from public.link_prospects group by status
union all
select 'par type', type, count(*)
  from public.link_prospects group by type
union all
select 'total', null, count(*)
  from public.link_prospects
order by 1, 3 desc, 2;
