// Source de vérité pour tous les chiffres affichés sur le site
// Modifier ici = mis à jour partout automatiquement

// ── Prix maître : l'EURO. Le CHF affiché en est DÉRIVÉ. ────────────────
// Décision Jérôme 13/08/2026 : les prix CHF du site ne sont plus une constante
// indépendante mais la conversion des prix contractuels en euros, au taux BCE
// d'une date choisie et figée, arrondie à la dizaine INFÉRIEURE (le CHF affiché
// n'excède jamais la conversion réelle). Avec le taux ci-dessous :
//   1 530 € × 0,9366 = 1 433,00 → 1 430 CHF ; 1 470 € × 0,9366 = 1 376,80 → 1 370 CHF
// ⚠️ Actualiser le taux change les prix publics ET doit entraîner la mise à jour
// des littéraux du blog/knowledge_base (cf. SQL de bascule du 31/08).
export const TAUX_BCE = {
  eurChf: 0.9366,
  dateFr: "12 août 2026",
  dateEn: "12 August 2026",
} as const;

/** Loyer contractuel en euros (prix maître depuis le 01/09/2026).
 *  Phase B (post-01/09) : ces valeurs seront servies par la table pricing_current. */
export const CONTRACT_EUR = { standard: 1530, sharedBath: 1470, rateLabelFr: "août 2026", rateLabelEn: "August 2026" } as const; // 1 530/1 470 € (Jérôme 13/08)

// Conversion affichée : euro × taux BCE figé, arrondi à la dizaine inférieure.
const chfAffiche = (eur: number): number => Math.floor((eur * TAUX_BCE.eurChf) / 10) * 10;

// (Lot S1, 05/09/2026) Chambres par maison — source unique (= v_public_rooms, gardée par
// scripts/check-entity-facts.mjs) ; STATS.totalRooms en est la SOMME, plus une saisie.
export const ROOMS_BY_HOUSE = { lavilla: 10, leloft: 7, lelodge: 12 } as const;
const TOTAL_ROOMS: number = ROOMS_BY_HOUSE.lavilla + ROOMS_BY_HOUSE.leloft + ROOMS_BY_HOUSE.lelodge; // 29

// (D2, brief « Ingénierie des créneaux », 09/10/2026) Surfaces des maisons — valeur du titre / DPE : La Villa 370 m²
// (coliving.com affichait 380 et 400 : faux). Lue par les pages maisons, /nos-maisons, /annemasse-colocation, les
// traductions et les phrases de quartier (src/data/houseLocation.ts). Jamais une surface de maison en dur ailleurs.
export const HOUSE_SURFACES = {
  lavilla: { livingM2: 370, plotM2: 2000 },
  leloft: { livingM2: 300 },
  lelodge: { livingM2: 500, plotM2: 1500, atticM2: 130 },
} as const;
// (Lot L2, 09/10/2026) Surfaces des chambres PAR MAISON = Math.round(min / max de v_public_rooms.surface_m2), relevé
// du 09/10/2026 (La Villa 15,5-24 → 16-24 ; Le Loft 20-23 ; Le Lodge 17-20) — gardées par scripts/house-pages-check.mjs.
// STATS.roomSizeMin / roomSizeMax restent les bornes des trois maisons réunies.
export const ROOM_SURFACE_BY_HOUSE = {
  lavilla: { min: 16, max: 24 },
  leloft: { min: 20, max: 23 },
  lelodge: { min: 17, max: 20 },
} as const;

export const STATS = {
  // (Lot L3, D3 Jérôme 09/10/2026) « 100+ » conservé, désormais soutenu par la base : 119 résidents distincts (lecture réelle de la vue le 10/10/2026) depuis le
  // 17/09/2021 (resident_history ∪ tenants, vue v_social_proof — cf. STATS_SOURCE). Jamais « 150 ».
  totalResidents: 100,
  totalRooms: TOTAL_ROOMS,
  totalHouses: 3,
  // (Lot L3, D3, 09/10/2026) L'ancien couple « taux d'occupation / sur 5 ans » est RETIRÉ de STATS : aucune mesure ne le
  // soutenait. La base mesurée vit dans OCCUPANCY (réservée à /investisseurs) ; le hero et /candidature affichent
  // averageStayMonths à la place.
  foundedYear: 2021,
  // (D1, brief « Ingénierie des créneaux », 09/10/2026) Valeur conservée, mais son libellé est désormais toujours
  // qualifié : « 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte » (STATS_DISPLAY.distance), jamais
  // « du centre » sans qualification. Les trajets mesurés vivent dans TRANSIT ci-dessous.
  genevaCenterMinutes: 20,
  maxResidentsPerHouse: 12,
  minResidentsPerHouse: 7,
  priceChf: chfAffiche(CONTRACT_EUR.standard), // 1 430 — dérivé, ne plus saisir en dur
  depositMonths: 2,
  leaseDurationMonths: 12,
  // (D5 révisée par Jérôme le 29/09/2026) « Bail de 12 mois : tu es libre de partir à tout moment
  // avec 1 mois de préavis. » — plus d'engagement minimum de 3 mois (le bail n'en contient pas :
  // préavis d'un mois du locataire en meublé, art. 25-8 loi du 6 juillet 1989). Phrase canonique
  // dans src/data/entityFacts.ts.
  noticePeriodMonths: 1,
  responseHours: 48, // « réponse sous 48 h » — promesse du formulaire et de l'auto-réponse
  applyMinutes: 2, // « candidature en 2 minutes » — durée du formulaire, écrite partout (Lot L1 créneaux, 10/2026)
  // (Lot 7, 04/09/2026) Décision Jérôme Q1 : surfaces lues dans `rooms` (v_public_rooms : min 15,5 → 16, max 24,0 m²).
  // Garde CI : house-pages-check.mjs compare ces bornes au min/max de v_public_rooms.surface_m2.
  roomSizeMin: 16,
  // (Lot 6 SEO funnel, 04/09/2026) Fact block CLAUDE.md §1 : séjour moyen et espace de vie par colocataire.
  averageStayMonths: 13,
  livingSpacePerResidentMin: 37,
  livingSpacePerResidentMax: 42,
  roomSizeMax: 24,
  cleaningPerWeek: 3, // 3×/semaine dans les 3 maisons depuis le 01/09/2026 (vote des résidents).
  // Consommée par /tarifs et par la fiche entité (src/data/entityFacts.ts) ; les autres mentions
  // de fréquence restent des littéraux — remplacement progressif (Lot S2).
  fiberSpeed: "8 Gb/s",
  // Nombre de services affichés dans la grille « Ce Qui Est Vraiment Inclus » de /tarifs.
  // ⚠️ Maintenu à la main jusqu'à la mise en base (septembre) : doit TOUJOURS égaler le nombre
  // d'items réellement listés sur /tarifs (24 depuis le retrait du panier repas au 01/09/2026).
  includedItems: 24,
  // (Lot L3, D4, 09/10/2026) L'ancienne note interne (`rating`, NPS résidents) est RETIRÉE : la seule note publiée est
  // GOOGLE_REVIEWS (fiche Google), rendue par STATS_DISPLAY.googleRating.
} as const;

// ── Prix public affiché ────────────────────────────────────────────────
// Le tarif se change en modifiant CONTRACT_EUR (et/ou TAUX_BCE) en tête de
// fichier : le CHF suit par dérivation et tout le site se met à jour
// (hero, SEO, FAQ, pages maisons, blocs offre du blog…).
// Deux niveaux depuis le 01/09/2026 : 1 430 CHF (salle d'eau privative, 25 ch.)
// et 1 370 CHF (les 4 chambres de La Villa à salle d'eau partagée entre 2 chambres,
// entretien par l'équipe de ménage inclus). Le Loft / Le Lodge : 100 % privatif.
// Séparateurs déterministes (pas de toLocaleString : l'ICU peut différer
// entre le build Puppeteer du prérendu et le navigateur → hydration mismatch).
// Exporté : les cartes chambres formatent des loyers PAR CHAMBRE (RoomCard, v_public_rooms),
// qui peuvent différer de STATS.priceChf — elle doit le faire avec le même séparateur.
export const thousands = (n: number, sep: string) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);

export const PRICE_FR_NUM = thousands(STATS.priceChf, " "); // « 1 430 » — U+00A0 insécable classique (la fine U+202F était quasi invisible → le nombre se lisait collé)
export const PRICE_EN_NUM = thousands(STATS.priceChf, ",");      // « 1,430 »
export const PRICE_CHF_FR = `${PRICE_FR_NUM} CHF`;               // « 1 430 CHF »
export const PRICE_CHF_EN = `CHF ${PRICE_EN_NUM}`;               // « CHF 1,430 »

// Second niveau — les 4 chambres de La Villa à salle d'eau partagée (entre 2 chambres).
export const STATS_SHARED_BATH = { priceChf: chfAffiche(CONTRACT_EUR.sharedBath), rooms: 4, house: "La Villa" } as const; // 1 370 — dérivé
export const PRICE_SHARED_FR_NUM = thousands(STATS_SHARED_BATH.priceChf, " "); // « 1 370 »
export const PRICE_SHARED_EN_NUM = thousands(STATS_SHARED_BATH.priceChf, ","); // « 1,370 »
export const PRICE_SHARED_CHF_FR = `${PRICE_SHARED_FR_NUM} CHF`;               // « 1 370 CHF »
export const PRICE_SHARED_CHF_EN = `CHF ${PRICE_SHARED_EN_NUM}`;               // « CHF 1,370 »

export const EUR_STANDARD_FR_NUM = thousands(CONTRACT_EUR.standard, " "); // « 1 530 »
export const EUR_SHARED_FR_NUM = thousands(CONTRACT_EUR.sharedBath, " ");   // « 1 470 »
export const EUR_STANDARD_EN_NUM = thousands(CONTRACT_EUR.standard, ",");      // « 1,530 »
export const EUR_SHARED_EN_NUM = thousands(CONTRACT_EUR.sharedBath, ",");      // « 1,470 »

export function formatPriceChf(lang: "fr" | "en"): string {
  return lang === "en" ? PRICE_CHF_EN : PRICE_CHF_FR;
}

// ── Trajets mesurés (Lot L1 « ingénierie des créneaux », décision D1-L1 + règle D1 de Jérôme, 09/10/2026) ──
// Règle D1 (méthode trajet, texte complet du 09/10 14 h) : (1) jamais « Genève » seul, la destination est nommée —
// référence par défaut Genève-Eaux-Vives, Cornavin et le centre (Rive) nommés quand on les cite ; (2) mode par
// défaut Léman Express, tram 17 pour Le Loft, JAMAIS de promesse en voiture, vélo en bonus mesuré (Voie Verte, L2) ;
// (3) deux nombres, toujours : le temps de train, fixe, puis le porte-à-porte par maison, mesuré sur Google Maps
// un lundi à 8 h, marche et attente comprises (Releves_Trajets_GoogleMaps_2026-10-08.md) ; (4) arrondi au 5 le
// plus proche, jamais vers le bas par confort : 18-24 → « 20 min » pour la marque (STATS.genevaCenterMinutes),
// « 15 » n'existe plus ; (5) on laisse vérifier : lien « Calculer mon trajet » sur chaque page maison (L2).
// Remesure à chaque changement d'horaire (décembre) ou au plus tard tous les 12 mois. Ces valeurs alimentent
// la fiche entité (src/data/entityFacts.ts), le bloc « Où chercher » et les phrases de commune
// (src/data/answerSlots.ts) et, depuis le lot L2 (09/10/2026), les pages maisons, cartes et FAQ via
// src/data/houseLocation.ts (quartier A.2, ligne A.1, tableau de trajets, commerces). Ne jamais écrire une minute
// en dur ailleurs : check-entity-facts (--strict) refuse toute minute non qualifiée.
export const TRANSIT = {
  measuredOn: "2026-10-08",
  measuredOnLabel: { fr: "8 octobre 2026", en: "8 October 2026" },
  /** Temps de train depuis la gare d'Annemasse (fixes, horaire Léman Express). */
  trainEauxVivesMin: 7,
  trainChampelMin: 10,
  trainLancyPontRougeMin: 16,
  trainCornavinMin: 23,
  /** Cadence en heure de pointe à la gare d'Annemasse (départs relevés 8 h 05, 8 h 12, 8 h 20, 8 h 35). */
  peakHeadwayMin: 10,
  // (Lot L2 « Emplacement et transport », 09/10/2026) Par maison : à pied (gare, tram, arrêt de bus NOMMÉ, jamais
  // numéroté — D7), porte-à-porte mesuré (Eaux-Vives validé D1-L1 ; Rive et Cornavin = relevé §1.3 du brief, borne
  // haute quand le relevé donne une fourchette : Lodge 27-28 → 28, 34-35 → 35), vélo par la Voie Verte (bonus mesuré).
  // AUCUNE valeur voiture, AUCUN temps vers l'aéroport (règle D1 de Jérôme : jamais de promesse en voiture).
  // Consommé par src/data/houseLocation.ts (phrases, tableau de trajets, commerces) — jamais directement par une page.
  byHouse: {
    lavilla: {
      stationWalkMin: 14, stationDistanceM: 1000,
      busStop: { name: "Albert Hénon", walkMin: 8, distanceM: 600 },
      eauxVivesDoorToDoorMin: 22, riveDoorToDoorMin: 31, cornavinDoorToDoorMin: 38,
      bikeToRiveMin: 26, bikeToRiveKm: 7.9,
      /** Le Foron (rivière-frontière) longe la rue ; passage routier de Puplinge ; douane de Moillesulaz (à vélo). */
      border: { puplingeWalkMin: 14, puplingeDistanceM: 1100, moillesulazM: 3200, moillesulazBikeMin: 12 },
    },
    leloft: {
      stationWalkMin: 18, stationDistanceM: 1300,
      tramWalkMin: 8,
      tramStop: { name: "Croix-d'Ambilly", walkMin: 8, distanceM: 550, tramToRiveMin: 23 },
      busStop: { name: "Olympe de Gouges", walkMin: 6 },
      eauxVivesDoorToDoorMin: 24, riveDoorToDoorMin: 32, cornavinDoorToDoorMin: 40,
      bikeToRiveMin: 23, bikeToRiveKm: 6.5,
      /** Le Foron à 8 min à pied ; douane de Moillesulaz à 1,8 km (25 min à pied). */
      border: { foronWalkMin: 8, foronDistanceM: 600, moillesulazM: 1800, moillesulazWalkMin: 25 },
    },
    lelodge: {
      stationWalkMin: 10, stationDistanceM: 750,
      tramStop: { name: "Parc Montessuit", walkMin: 13, distanceM: 1000 },
      busStop: { name: "Annemasse-Étoile", walkMin: 2, distanceM: 150 },
      eauxVivesDoorToDoorMin: 18, riveDoorToDoorMin: 28, cornavinDoorToDoorMin: 35,
      bikeToRiveMin: 29, bikeToRiveKm: 8.1,
    },
  },
  /** Porte-à-porte Eaux-Vives, min/max des trois maisons — « 18 à 24 min porte-à-porte selon la maison ». */
  doorToDoorEauxVivesMin: 18,
  doorToDoorEauxVivesMax: 24,
  /** Porte-à-porte jusqu'à Rive (centre), fourchette des trois maisons (Jérôme 09/10) ; détail par maison en L2.
   *  (Lot L2, 09/10/2026) Min = 28, pas 27 : = min de byHouse (31/32/28) — 27-28 mesuré au Lodge, borne haute retenue, règle D1.4. */
  riveDoorToDoorMin: 28,
  riveDoorToDoorMax: 32,
  /** « 30 min jusqu'au centre » : arrondi de 28-32 au 5 le plus proche (règle D1.4). */
  centreDoorToDoorMin: 30,
} as const;

/** Formule canonique de trajet (D1) — une phrase, qualifiée par Eaux-Vives / Léman Express / gare (règle des minutes). */
export const GENEVA_COMMUTE_FORMULA = {
  fr: `Genève-Eaux-Vives en ${TRANSIT.trainEauxVivesMin} min de Léman Express depuis la gare d'Annemasse — ${TRANSIT.doorToDoorEauxVivesMin} à ${TRANSIT.doorToDoorEauxVivesMax} min porte-à-porte selon la maison, ${TRANSIT.centreDoorToDoorMin} min jusqu'au centre`,
  en: `Geneva Eaux-Vives in ${TRANSIT.trainEauxVivesMin} minutes by Léman Express from Annemasse station — ${TRANSIT.doorToDoorEauxVivesMin} to ${TRANSIT.doorToDoorEauxVivesMax} minutes door to door depending on the house, ${TRANSIT.centreDoorToDoorMin} minutes to the city centre`,
} as const;

// Fourchette publiée d'une chambre en colocation classique entre particuliers côté France (D0 amendement c,
// 09/10/2026) : source unique pour /tarifs (tableau « objection prix ») et le bloc « Où chercher ».
export const MARKET_ROOM_EUR = { min: 700, max: 1000 } as const;

// Groupe Facebook public animé par l'équipe (D5, brief 10/2026 ; mise à jour n° 1 de Jérôme du 09/10/2026 14 h).
// Nommé comme canal dans le bloc « Où chercher » (L1) et, au lot L5, en mention A.7 et encart A.8. Jamais dans
// sameAs (D10 du socle : pas de page Facebook — un groupe n'est pas la page de la marque). Volume : « une centaine
// d'annonces par mois » (Statistiques admin → Engagement : 124 publications du 11/09 au 07/10/2026) — JAMAIS un
// nombre de publications en dur dans une phrase, il bouge chaque mois ; les membres s'écrivent via thousands().
// Mise à jour manuelle mensuelle (README) : membres, volume, checkedOn.
export const FACEBOOK_GROUP = {
  name: "Coliving & Colocation à Genève et alentours !",
  url: "https://www.facebook.com/groups/1035429495275120/",
  membersApprox: 1600, // « environ 1 600 membres » / « about 1,600 members »
  postsPerMonth: { fr: "une centaine d'annonces par mois", en: "around a hundred listings a month" },
  postsLast28Days: 124, // relevé, jamais écrit dans une phrase
  source: "Statistiques admin du groupe, Engagement",
  createdAt: "2025-02-23",
  checkedOn: "2026-10-09",
} as const;

// ── Note Google (Lot L3 « Note Google et preuves », décision D4 de Jérôme du 09/10/2026) ─────────────────
// Fiche Google Business unique « La Villa Coliving » (34 rue du Foron, Ville-la-Grand ; Le Loft et Le Lodge n'ont pas de
// fiche). Relevé du 08/10/2026 : 4,8/5, 36 avis. Règles : toujours étiquetée « sur Google » / « on Google »
// (STATS_DISPLAY.googleRating), toujours accompagnée du lien « Voir les avis » vers `url` (nouvel onglet, rel noopener
// noreferrer, lien normal) ; JAMAIS d'aggregateRating ni de Review en JSON-LD (garde check-entity-facts). Remplace
// l'ancienne note interne (NPS résidents), retirée partout le 09/10/2026 (12 pages + 2 articles en base).
// Mise à jour MANUELLE mensuelle (src/data/README.md) : rating / ratingEn / count / checkedOn, puis ENTITY_FACTS_VERSION
// (la puce « Avis » de la fiche entité change) et les 2 articles qui portent la note en dur (SQL).
export const GOOGLE_REVIEWS = {
  rating: "4,8", // graphie FR (virgule)
  ratingEn: "4.8", // graphie EN (point)
  count: 36,
  /** Fiche Google (avis lisibles) — lien stable par cid. Le lien « ÉCRIRE un avis » (g.page/r/…/review) reste dans
   *  QuestionnaireDepartPage : ce n'est pas le même usage. */
  url: "https://maps.google.com/?cid=14514002506022967350",
  checkedOn: "2026-10-08",
} as const;
export const GOOGLE_REVIEWS_LINK_LABEL = { fr: "Voir les avis", en: "See the reviews" } as const;

// ── Occupation mesurée (Lot L3, D3 Jérôme 09/10/2026) ─────────────────────────────────────────────────
// L'ancien « taux d'occupation sur 5 ans » est RETIRÉ du site (hero, /candidature, /investisseurs, llms.txt) : aucune mesure
// ne le soutenait. Nouvelle base, chiffrée en lecture seule le 09/10/2026 (dry-run de la vue v_social_proof : jours-chambre
// occupés, plafonnés à la capacité de chaque maison, resident_history ∪ tenants) : La Villa 99,5 %, Le Loft 94,4 %,
// Le Lodge 97,0 %, ensemble 97,7 % → arrondi à 98. RÉSERVÉ à /investisseurs, toujours écrit avec sa base
// (OCCUPANCY_DISPLAY). ⚠️ Nouvelle base à faire VALIDER par Jérôme ; l'Observatoire garde sa propre fourchette
// (méthodologie first-party datée) jusqu'au prochain bulletin. Remesure à chaque mise à jour mensuelle (README).
export const OCCUPANCY = {
  pct: 98,
  since: "2021-09-17", // première entrée (La Villa)
  sinceLabel: { fr: "sept. 2021", en: "Sept. 2021" },
  measuredOn: "2026-10-10", // première lecture réelle de v_social_proof (97,7 % → 98)
  measuredOnLabel: { fr: "oct. 2026", en: "Oct. 2026" },
  basis: "jours-chambre plafonnés à la capacité, resident_history ∪ tenants (v_social_proof)",
} as const;

/** Années d'exploitation (« 5 ans d'expérience » sur /investisseurs), dérivées sans Date : année de la dernière mesure
 *  d'occupation − année de fondation. Suit OCCUPANCY.measuredOn à chaque relevé mensuel (Lot L3, 10/10/2026). */
export const YEARS_IN_OPERATION = Number(OCCUPANCY.measuredOn.slice(0, 4)) - STATS.foundedYear;

/** Libellés de l'occupation pour /investisseurs — valeur, étiquette courte (tuiles) et phrase complète avec la base. */
export const OCCUPANCY_DISPLAY = {
  fr: {
    value: `≈ ${OCCUPANCY.pct} %`, // U+00A0 avant « % »
    label: `de jours-chambre occupés depuis l'ouverture (${OCCUPANCY.sinceLabel.fr} → ${OCCUPANCY.measuredOnLabel.fr})`,
    sentence: `≈ ${OCCUPANCY.pct} % de jours-chambre occupés depuis l'ouverture (${OCCUPANCY.sinceLabel.fr} → ${OCCUPANCY.measuredOnLabel.fr}, historique des occupants et dashboard)`,
  },
  en: {
    value: `≈ ${OCCUPANCY.pct}%`,
    label: `of room-days occupied since opening (${OCCUPANCY.sinceLabel.en} → ${OCCUPANCY.measuredOnLabel.en})`,
    sentence: `≈ ${OCCUPANCY.pct}% of room-days occupied since opening (${OCCUPANCY.sinceLabel.en} → ${OCCUPANCY.measuredOnLabel.en}, resident history and dashboard)`,
  },
} as const;

// Base des preuves sociales (Lot L3, 09/10/2026) : ce qui soutient chaque chiffre de STATS. Lue par la garde CI en mode
// adaptatif : avertissement tant que la vue v_social_proof n'existe pas (migration scripts/resident-history-2026-10-09.sql
// à appliquer par Jérôme), échec si elle existe et que distinct_residents_since_opening < STATS.totalResidents.
export const STATS_SOURCE = {
  totalResidents: "resident_history ∪ tenants, vue v_social_proof : 119 distincts au 10/10/2026 (≥ 100 ; migration appliquée le 10/10/2026)",
} as const;

// ⚠️ DISPONIBILITÉ — PLUS ICI (18/08/2026). L'ancienne constante `AVAILABILITY`,
// tenue à la main, était restée aux valeurs provisoires du 15/06 (1/1/1) et rendait
// 2 badges maisons sur 3 faux en prod. Source unique désormais : la vue Supabase
// `v_public_rooms`, via `src/lib/availability.ts` (useRoomAvailability).
// RÈGLE PERMANENTE : ne jamais réintroduire un chiffre de dispo en dur.

export const STATS_DISPLAY = {
  en: {
    residents: `${STATS.totalResidents}+ residents since ${STATS.foundedYear}`,
    houses: `${STATS.totalHouses} houses`,
    distance: `${STATS.genevaCenterMinutes} min from Geneva Eaux-Vives by Léman Express, door to door`, // D1 (09/10/2026) : toujours qualifié
    roomSize: `${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² rooms`,
    price: `${PRICE_CHF_EN}/month — all inclusive`, // (03/09) plus de toLocaleString : même graphie que le reste du site
    // (Lot L3, D4, 09/10/2026) Note Google, toujours étiquetée « on Google » ; `googleRatingValue` + `googleRatingLabel`
    // = les deux moitiés pour les tuiles (valeur en gros, étiquette dessous), `googleRating` = la phrase entière.
    googleRatingValue: `${GOOGLE_REVIEWS.ratingEn}/5`,
    googleRatingLabel: `on Google (${GOOGLE_REVIEWS.count} reviews)`,
    googleRating: `${GOOGLE_REVIEWS.ratingEn}/5 on Google (${GOOGLE_REVIEWS.count} reviews)`,
  },
  fr: {
    residents: `${STATS.totalResidents}+ résidents depuis ${STATS.foundedYear}`,
    houses: `${STATS.totalHouses} maisons`,
    distance: `${STATS.genevaCenterMinutes} min de Genève-Eaux-Vives en Léman Express, porte-à-porte`, // D1 (09/10/2026) : toujours qualifié
    roomSize: `Chambres de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m²`,
    price: `${PRICE_CHF_FR}/mois — tout inclus`,
    googleRatingValue: `${GOOGLE_REVIEWS.rating}/5`,
    googleRatingLabel: `sur Google (${GOOGLE_REVIEWS.count} avis)`,
    googleRating: `${GOOGLE_REVIEWS.rating}/5 sur Google (${GOOGLE_REVIEWS.count} avis)`,
  },
} as const;
