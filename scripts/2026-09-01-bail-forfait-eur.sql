-- =====================================================================
--  MIGRATION -- Bail 01/09/2026 : euro maitre + forfait de charges unique
--  Branche : feat/bail-services-2026-09
--  Brief   : BRIEF_Chantier_Bail_2026-09.md, section 3
--
--  DOCTRINE ROLLBACK-FIRST : on AJOUTE, on ne supprime RIEN.
--  Les colonnes charges_energy_chf / charges_maintenance_chf /
--  charges_services_chf restent en place, depreciees, pour que les baux
--  anterieurs au 01/09 restent regenerables A L'IDENTIQUE (rendu legacy
--  declenche par tenants.charges_forfait_eur IS NULL).
--
--  /!\ A EXECUTER AVANT TOUT CODE (le template lit ces colonnes).
--  /!\ FICHIER 100 % ASCII (gotcha mojibake au copier-coller).
--
--  PIEGE DE NOMMAGE (dette de schema section 12 bis no1) : les colonnes
--  existantes suffixees _chf contiennent en realite des EUR. Les
--  nouvelles colonnes sont explicitement suffixees _eur. Ne JAMAIS
--  reutiliser les anciennes pour des valeurs euro.
--
--  MODE D'EMPLOI
--   1. SECTION 0 : diagnostic. Lire les resultats AVANT d'aller plus loin.
--      En particulier le croisement bathroom_type <-> chambres 3/4/7/8.
--   2. SECTION 1 : ajout des colonnes (idempotent).
--   3. SECTION 2 : valeurs de la grille.
--   4. SECTION 3 : verification. Tout doit etre conforme au tableau attendu.
--   5. Le ROLLBACK est en SECTION 4 : le lire et l'archiver AVANT d'executer 1-2.
-- =====================================================================


-- =====================================================================
-- SECTION 0 -- DIAGNOSTIC (ne modifie rien)
-- =====================================================================

-- 0.1 Les colonnes existent-elles deja ? (migration rejouable)
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (   (table_name = 'rooms'      AND column_name IN ('rent_eur', 'rent_chf', 'bathroom_type'))
       OR (table_name = 'properties' AND column_name LIKE 'charges%')
       OR (table_name = 'tenants'    AND (column_name LIKE 'charges%' OR column_name LIKE '%rent%' OR column_name LIKE 'previous_tenant%')))
ORDER BY table_name, column_name;

-- 0.2 Etat actuel des maisons (le forfait cible ne concerne QUE les 3 colivings)
SELECT slug, name, charges_energy_chf, charges_maintenance_chf, charges_services_chf,
       (COALESCE(charges_energy_chf,0) + COALESCE(charges_maintenance_chf,0)
        + COALESCE(charges_services_chf,0)) AS total_actuel_eur
FROM properties
ORDER BY slug;
-- Attendu : La Villa 130+200+90 = 335 EUR -> passera a 386 (+15 %, justifie par
-- le menage 2->3x/semaine ; justification a ecrire dans l'annexe, cf. brief section 4.2).

-- 0.3 CROISEMENT CRITIQUE : les 4 chambres a salle d'eau partagee de La Villa
--     Le brief les designe comme les chambres 3, 4, 7 et 8. On verifie que la
--     base dit la meme chose via bathroom_type, AVANT de figer la grille.
SELECT r.room_number, r.name, r.bathroom_type, r.bathroom_detail, r.rent_chf, r.status
FROM rooms r
JOIN properties p ON p.id = r.property_id
WHERE p.slug = 'lavilla'
ORDER BY r.room_number;
-- /!\ SI bathroom_type ne vaut PAS 'shared' exactement pour 3, 4, 7 et 8 :
--   NE PAS executer la section 2 telle quelle. Corriger d'abord la donnee ou
--   la liste, et le signaler. La grille tarifaire en depend directement.

-- 0.4 Recapitulatif par maison (Mont-Blanc doit rester hors perimetre)
SELECT p.slug, count(*) AS nb_chambres,
       count(*) FILTER (WHERE r.bathroom_type = 'shared') AS nb_sde_partagee
FROM rooms r JOIN properties p ON p.id = r.property_id
GROUP BY p.slug ORDER BY p.slug;


-- =====================================================================
-- SECTION 1 -- AJOUT DES COLONNES (idempotent, aucune suppression)
-- =====================================================================

ALTER TABLE rooms      ADD COLUMN IF NOT EXISTS rent_eur                       numeric(10,2);
COMMENT ON COLUMN rooms.rent_eur IS
  'Loyer CC contractuel en EUR (grille au 01/09/2026 : 1540 privative, 1490 SDE partagee La Villa). Prix maitre depuis le 01/09/2026 ; rent_chf devient indicatif.';

ALTER TABLE properties ADD COLUMN IF NOT EXISTS charges_forfait_eur            numeric(10,2);
COMMENT ON COLUMN properties.charges_forfait_eur IS
  'Forfait de charges recuperables mensuel en EUR (decret 87-713). Remplace la somme charges_energy_chf + charges_maintenance_chf + charges_services_chf, conservees depreciees.';

ALTER TABLE tenants    ADD COLUMN IF NOT EXISTS charges_forfait_eur            numeric(10,2);
COMMENT ON COLUMN tenants.charges_forfait_eur IS
  'Forfait de charges du bail signe, en EUR. NULL = bail anterieur au 01/09/2026 -> le template bascule sur le rendu LEGACY (3 postes). Ne jamais retro-remplir.';

ALTER TABLE tenants    ADD COLUMN IF NOT EXISTS rent_eur                       numeric(10,2);
COMMENT ON COLUMN tenants.rent_eur IS
  'Loyer CC contractuel reellement signe, en EUR. Peut differer de la grille rooms.rent_eur (ajustement a la relocation).';

ALTER TABLE tenants    ADD COLUMN IF NOT EXISTS previous_tenant_rent_eur       numeric(10,2);
COMMENT ON COLUMN tenants.previous_tenant_rent_eur IS
  'Dernier loyer HORS CHARGES acquitte par l occupant precedent de la chambre (article 3, loi du 6 juillet 1989). Rendu dans le bail si depart < 18 mois.';

ALTER TABLE tenants    ADD COLUMN IF NOT EXISTS previous_tenant_departure_date date;
COMMENT ON COLUMN tenants.previous_tenant_departure_date IS
  'Date de depart de l occupant precedent. Sert la regle des 18 mois de l article 3 de la loi du 6 juillet 1989.';


-- =====================================================================
-- SECTION 2 -- VALEURS DE LA GRILLE
--   A n'executer QUE si le diagnostic 0.3 est conforme.
-- =====================================================================

-- 2.1 Forfait de charges par maison (colivings uniquement, Mont-Blanc exclu)
UPDATE properties SET charges_forfait_eur = 376 WHERE slug = 'lelodge';
UPDATE properties SET charges_forfait_eur = 386 WHERE slug = 'lavilla';
UPDATE properties SET charges_forfait_eur = 398 WHERE slug = 'leloft';
-- Mont-Blanc : volontairement laisse NULL (hors perimetre coliving).

-- 2.2 Grille des loyers CC par chambre
--     Standard : 1540 EUR. SDE partagee La Villa (ch. 3, 4, 7, 8) : 1490 EUR.
--     On cible par bathroom_type (source de verite en base), PAS par numero :
--     si le diagnostic 0.3 a montre un ecart, corriger la donnee d'abord.
UPDATE rooms r SET rent_eur = 1540
FROM properties p
WHERE p.id = r.property_id
  AND p.slug IN ('lavilla', 'leloft', 'lelodge')
  AND COALESCE(r.bathroom_type, 'private') <> 'shared';

UPDATE rooms r SET rent_eur = 1490
FROM properties p
WHERE p.id = r.property_id
  AND p.slug = 'lavilla'
  AND r.bathroom_type = 'shared';

-- 2.3 tenants : AUCUN remplissage.
--     Les baux existants doivent conserver charges_forfait_eur / rent_eur a NULL
--     pour declencher le rendu legacy. Seuls les baux generes apres le deploiement
--     du nouveau template ecriront ces colonnes.


-- =====================================================================
-- SECTION 3 -- VERIFICATION
-- =====================================================================

-- 3.1 Forfaits par maison -- attendu : lelodge 376, lavilla 386, leloft 398, montblanc NULL
SELECT slug, charges_forfait_eur,
       (COALESCE(charges_energy_chf,0) + COALESCE(charges_maintenance_chf,0)
        + COALESCE(charges_services_chf,0)) AS ancien_total_eur,
       charges_forfait_eur - (COALESCE(charges_energy_chf,0) + COALESCE(charges_maintenance_chf,0)
        + COALESCE(charges_services_chf,0)) AS ecart_eur
FROM properties ORDER BY slug;

-- 3.2 Grille des chambres -- attendu : 25 a 1540 et 4 a 1490 (Mont-Blanc NULL)
SELECT p.slug, r.bathroom_type, r.rent_eur, count(*) AS nb
FROM rooms r JOIN properties p ON p.id = r.property_id
GROUP BY p.slug, r.bathroom_type, r.rent_eur
ORDER BY p.slug, r.rent_eur NULLS LAST;

-- 3.3 Loyer nu deduit -- attendu : Lodge 1164, Villa 1154, Loft 1142, Villa SDE 1104
SELECT p.slug, r.rent_eur, p.charges_forfait_eur,
       r.rent_eur - p.charges_forfait_eur AS loyer_nu_eur,
       round((r.rent_eur - p.charges_forfait_eur) * 2, 2) AS depot_garantie_eur
FROM rooms r JOIN properties p ON p.id = r.property_id
WHERE r.rent_eur IS NOT NULL
GROUP BY p.slug, r.rent_eur, p.charges_forfait_eur
ORDER BY p.slug, r.rent_eur;
-- Depot attendu : 2328 / 2308 / 2284 standard, 2208 SDE partagee (brief section 4.8).

-- 3.4 Compatibilite ascendante -- attendu : 0 locataire avec un forfait renseigne
SELECT count(*) AS tenants_avec_forfait_eur FROM tenants WHERE charges_forfait_eur IS NOT NULL;

-- 3.5 La vue available_rooms fonctionne toujours (elle ne doit pas casser :
--     un ADD COLUMN ne modifie pas la liste figee des colonnes d'une vue)
SELECT count(*) AS available_rooms_ok FROM available_rooms;


-- =====================================================================
-- SECTION 4 -- ROLLBACK  (a archiver AVANT d'executer les sections 1-2)
--   Retire uniquement ce que cette migration a ajoute. Aucune donnee
--   preexistante n'est touchee : les colonnes _chf n'ont jamais ete
--   modifiees, donc l'etat anterieur est integralement restaure.
-- =====================================================================
--
-- ALTER TABLE rooms      DROP COLUMN IF EXISTS rent_eur;
-- ALTER TABLE properties DROP COLUMN IF EXISTS charges_forfait_eur;
-- ALTER TABLE tenants    DROP COLUMN IF EXISTS charges_forfait_eur;
-- ALTER TABLE tenants    DROP COLUMN IF EXISTS rent_eur;
-- ALTER TABLE tenants    DROP COLUMN IF EXISTS previous_tenant_rent_eur;
-- ALTER TABLE tenants    DROP COLUMN IF EXISTS previous_tenant_departure_date;
--
-- /!\ Ne PAS jouer le rollback si du code lisant ces colonnes est deja deploye.


-- =====================================================================
-- SECTION 5 -- CHECKLIST section 12 (Schema_Supabase_LaVilla.md)
-- =====================================================================
--
--  [x] 1. VUES. `available_rooms` est la seule vue touchant `rooms`. Un
--         ADD COLUMN ne casse pas une vue : la liste de colonnes est figee
--         a la creation (meme pour un SELECT *). Aucun DROP/CREATE requis.
--         Corollaire : les nouvelles colonnes ne sont PAS exposees par la
--         vue -- si le site devait un jour afficher rent_eur, il faudra
--         recreer la vue explicitement.
--         Verification incluse en 3.5.
--
--  [x] 2. RLS. Aucune policy n'est definie par colonne : les policies
--         portent sur la ligne. Les nouvelles colonnes heritent donc du
--         meme regime que leurs voisines. `rooms` et `properties` sont
--         lues par le site (anon) ; `tenants` est protegee (portail :
--         auth.uid() = tenants.user_id). Rien a modifier.
--         /!\ Consequence a connaitre : rooms.rent_eur devient lisible par
--         l'anon key, comme rent_chf aujourd'hui. C'est un prix public,
--         donc acceptable.
--
--  [x] 2bis. CONTRAINTES CHECK. Aucune contrainte CHECK ajoutee ni
--         modifiee. Les contraintes documentees (prospects.source/status/
--         lease_duration) ne sont pas concernees -> pas de mise a jour de
--         l'Edge Function send-candidature-email ni des dropdowns.
--
--  [ ] 3. entities.ts / logAudit. A FAIRE AVEC LE CODE, pas ici :
--         aucun ID ni constante n'est introduit par cette migration. Si le
--         formulaire ajoute une action d'audit (ex. bail nouveau format),
--         etendre le type AuditAction a ce moment-la.
--
--  [x] 4. TRACE. Ce fichier EST la trace (scripts/, comme le veut section 12.4 --
--         il n'existe pas de systeme de migration formel dans ce projet).
--         Commite sur la branche feat/bail-services-2026-09.
--
--  [ ] 5. BACKUP VPS. A CONFIRMER PAR JEROME : verifier que `rooms`,
--         `properties` et `tenants` figurent bien dans la liste explicite
--         de /opt/scripts/backup-supabase.sh (29 tables au 18/07/2026).
--         Ce sont des tables coeur, donc tres probablement presentes -- mais
--         la liste est explicite, pas automatique, et je ne peux pas la lire
--         d'ici. Aucune table nouvelle n'est creee : si elles y sont deja,
--         il n'y a rien a ajouter.
--
--  [ ] 6. DOCUMENTATION. A faire apres execution : Schema_Supabase_LaVilla.md
--         (section 3.2 properties, section 3.3 rooms, tenants) + section 12 bis (la dette no1
--         gagne un corollaire : les colonnes _eur coexistent desormais avec
--         les _chf trompeuses), Infrastructure_LaVilla.md, CLAUDE.md,
--         SESSION_STATE, connaissances projet claude.ai.
-- =====================================================================
