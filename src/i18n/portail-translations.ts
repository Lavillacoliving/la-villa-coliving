// ============================================================================
// FALLBACK ONLY — NE PAS ÉDITER ICI
// ============================================================================
// La source de vérité est la table `property_content` dans Supabase (D4).
// Ce fichier sert uniquement de :
//   1. Fallback si la DB est indisponible (résilience)
//   2. Seed initial via seedPropertyContent() dans usePropertyContent.ts
//
// Pour modifier le contenu du portail locataire :
//   → Éditer directement dans Supabase (table property_content)
//   → Ou via le dashboard admin quand l'UI d'édition sera disponible
//
// Dernière sync DB : 2026-02-23 (21 rows, 3 propriétés × 7 sections)
// ============================================================================
// Source originale: Bibles du Coliver, FAQ, documents opérationnels La Villa

export interface PropertySection {
  section: string;
  content: string;
}

type PropertyContent = Record<string, Record<string, PropertySection[]>>;

// Contenu statique par propriété et par langue
const propertyContent: PropertyContent = {
  lavilla: {
    fr: [
      {
        section: 'rules',
        content: `Règlement intérieur — La Villa Coliving (Ville-la-Grand)

— Horaires de calme : 22h → 8h (pas de bruit excessif, musique au casque)
— Espaces communs : chacun nettoie après utilisation (cuisine, salle de bain partagée, salon)
— Vaisselle : laver et ranger le jour même — ne rien laisser dans l'évier
— Poubelles : chacun contribue à sortir les poubelles quand elles sont pleines
— Non-fumeur : interdiction de fumer à l'intérieur. Espace fumeur extérieur disponible.
— Animaux : non autorisés (sauf accord écrit préalable)
— Invités : autorisés en journée. Nuit = prévenir le gestionnaire + max 2 nuits/semaine.
— Portes : fermer la porte d'entrée à clé après 22h.
— Espaces personnels : chaque chambre est privative. Ne pas entrer dans les chambres des autres.
— Événements : toute fête/rassemblement doit être validé par le gestionnaire.`
      },
      {
        section: 'spaces',
        content: `Piscine (extérieure)
• Ouverte de mi-avril à fin septembre
• Horaires : 8h → 22h
• Douche obligatoire avant le bain
• Pas de nourriture/verre autour du bassin
• Pas de musique sans casque

Sauna
• Emplacement : sous-sol
• Utilisation libre aux horaires de la maison
• Poser une serviette sur le banc
• S'hydrater avant/après

Salle de sport
• Emplacement : sous-sol
• Équipements : banc de musculation, haltères, tapis
• Remettre les poids en place après utilisation
• Essuyer les machines après usage

Cuisines
• 2 cuisines disponibles (RDC + étage)
• Frigo : chaque coloc a un espace marqué à son nom
• Nettoyer le plan de travail après chaque utilisation
• Ne pas laisser de nourriture périmée

Buanderie
• Machine à laver + sèche-linge disponibles
• Produits fournis (lessive, adoucissant)
• Retirer son linge dès la fin du cycle
• Ne pas surcharger les machines`
      },
      {
        section: 'wifi',
        content: `WiFi — La Villa
• Réseau : LaVilla_WiFi
• Mot de passe : affiché dans la cuisine principale

Streaming
• Netflix : profil "La Villa" — identifiants dans la cuisine
• Canal+ : disponible sur la Smart TV du salon

En cas de problème WiFi :
1. Vérifier si d'autres colocs ont le même souci
2. Redémarrer la box (débrancher 30 sec, rebrancher)
3. Si le problème persiste → contacter Fanny sur WhatsApp`
      },
      {
        section: 'practical',
        content: `Poubelles
• Collecte ordures ménagères : mardi et vendredi
• Tri sélectif (bac jaune) : mercredi
• Verre : borne à 100m (direction centre-ville)

Chauffage
• Thermostat intelligent dans le couloir principal
• Ne PAS modifier le thermostat — contacter Fanny si besoin
• Température de consigne : 20°C jour / 18°C nuit

Emplacements utiles
• Tableau électrique : placard entrée RDC
• Ventouse WC : sous l'évier de chaque salle de bain
• Ampoules de rechange : placard buanderie
• Double clé : chez le gestionnaire

Parking
• Places non attribuées dans la cour
• Rack vélos à côté de l'entrée

Courrier
• Boîte aux lettres à l'entrée de la propriété
• Étiqueter ton nom sur ta case`
      },
      {
        section: 'emergency',
        content: `En cas d'urgence

Fuite d'eau
1. Couper la vanne d'arrêt (sous-sol, à gauche de l'escalier)
2. Prévenir immédiatement Fanny (WhatsApp)
3. Éponger si possible

Coupure électrique
1. Vérifier le disjoncteur (placard entrée RDC)
2. Réenclencher les disjoncteurs baissés
3. Si ça disjoncte à nouveau → appeler Fanny

Incendie
1. Évacuer immédiatement par les sorties de secours
2. Appeler les pompiers : 18 ou 112
3. Prévenir Fanny

Intrusion
1. Se mettre en sécurité dans sa chambre (verrouiller)
2. Appeler la police : 17
3. Prévenir Fanny

Numéros d'urgence
• Pompiers : 18
• SAMU : 15
• Police : 17
• Urgences européen : 112`
      },
      {
        section: 'contacts',
        content: `Contacts essentiels

Fanny (Gestionnaire)
• WhatsApp : +33 6 XX XX XX XX
• Email : fanny@lavillacoliving.com
• Disponible lundi-vendredi 9h-18h

Urgence maintenance
• En dehors des heures → WhatsApp Fanny (elle redirige)

Jérôme (Propriétaire)
• Email uniquement : jerome@lavillacoliving.com
• Pour sujets administratifs/contractuels uniquement

Ménage (Bouameur)
• Planning affiché dans la cuisine
• Pas de contact direct — passer par Fanny`
      },
      {
        section: 'cleaning',
        content: `Planning d'entretien

Ménage régulier (Société Bouameur)
• Jeudi : nettoyage léger (aspirateur communs, sanitaires)
• Lundi : nettoyage approfondi (sols, cuisines, salles de bain)

Deep clean bimestriel
• Un nettoyage complet tous les 2 mois (inclus vitres, sous meubles, etc.)
• Prochain : voir calendrier affiché en cuisine

Interventions planifiées
• Piscine : entretien hebdomadaire (mercredi)
• Jardin : tonte bimensuelle (printemps-automne)
• Chaudière : révision annuelle (octobre)`
      },
    ],
    en: [
      {
        section: 'rules',
        content: `House Rules — La Villa Coliving (Ville-la-Grand)

— Quiet hours: 10pm → 8am (no excessive noise, headphones for music)
— Common areas: clean after use (kitchen, shared bathroom, living room)
— Dishes: wash and put away the same day — nothing left in the sink
— Trash: everyone helps take out the trash when bins are full
— Non-smoking: no smoking indoors. Outdoor smoking area available.
— Pets: not allowed (unless prior written agreement)
— Guests: allowed during the day. Overnight = notify manager + max 2 nights/week.
— Doors: lock the front door after 10pm.
— Personal spaces: each room is private. Do not enter other rooms.
— Events: any party/gathering must be approved by the manager.`
      },
      {
        section: 'spaces',
        content: `Swimming Pool (outdoor)
• Open mid-April to end of September
• Hours: 8am → 10pm
• Shower required before swimming
• No food/glass around the pool
• No music without headphones

Sauna
• Location: basement
• Free use during house hours
• Place a towel on the bench
• Hydrate before/after

Gym
• Location: basement
• Equipment: weight bench, dumbbells, mats
• Put weights back after use
• Wipe machines after use

Kitchens
• 2 kitchens available (ground floor + upstairs)
• Fridge: each coliver has a labeled space
• Clean countertops after each use
• Remove expired food

Laundry
• Washing machine + dryer available
• Products provided (detergent, softener)
• Remove laundry when cycle ends
• Do not overload machines`
      },
      {
        section: 'wifi',
        content: `WiFi — La Villa
• Network: LaVilla_WiFi
• Password: displayed in the main kitchen

Streaming
• Netflix: "La Villa" profile — credentials in the kitchen
• Canal+: available on the living room Smart TV

WiFi troubleshooting:
1. Check if other colivers have the same issue
2. Restart the router (unplug 30 sec, replug)
3. If problem persists → contact Fanny on WhatsApp`
      },
      {
        section: 'practical',
        content: `Trash Collection
• Household waste: Tuesday and Friday
• Recycling (yellow bin): Wednesday
• Glass: drop-off point 100m away (toward town center)

Heating
• Smart thermostat in the main hallway
• Do NOT adjust the thermostat — contact Fanny if needed
• Set temperature: 20°C day / 18°C night

Useful Locations
• Electrical panel: entrance closet, ground floor
• Plunger: under each bathroom sink
• Spare bulbs: laundry room closet
• Spare key: with the manager

Parking
• Unassigned spots in the courtyard
• Bike rack next to the entrance

Mail
• Mailbox at the property entrance
• Label your name on your box`
      },
      {
        section: 'emergency',
        content: `In Case of Emergency

Water Leak
1. Turn off the water valve (basement, left of the stairs)
2. Notify Fanny immediately (WhatsApp)
3. Mop up if possible

Power Outage
1. Check the circuit breaker (entrance closet, ground floor)
2. Flip back any tripped breakers
3. If it trips again → call Fanny

Fire
1. Evacuate immediately via emergency exits
2. Call firefighters: 18 or 112
3. Notify Fanny

Break-in
1. Lock yourself in your room
2. Call police: 17
3. Notify Fanny

Emergency Numbers
• Firefighters: 18
• SAMU (ambulance): 15
• Police: 17
• European emergency: 112`
      },
      {
        section: 'contacts',
        content: `Key Contacts

Fanny (Property Manager)
• WhatsApp: +33 6 XX XX XX XX
• Email: fanny@lavillacoliving.com
• Available Monday-Friday 9am-6pm

Emergency Maintenance
• After hours → WhatsApp Fanny (she will redirect)

Jérôme (Owner)
• Email only: jerome@lavillacoliving.com
• For administrative/contractual matters only

Cleaning (Bouameur)
• Schedule displayed in the kitchen
• No direct contact — go through Fanny`
      },
      {
        section: 'cleaning',
        content: `Cleaning Schedule

Regular cleaning (Bouameur Company)
• Thursday: light cleaning (vacuuming common areas, bathrooms)
• Monday: deep cleaning (floors, kitchens, bathrooms)

Bi-monthly deep clean
• A thorough cleaning every 2 months (includes windows, under furniture, etc.)
• Next: see schedule posted in the kitchen

Planned Maintenance
• Pool: weekly maintenance (Wednesday)
• Garden: bi-monthly mowing (spring-autumn)
• Boiler: annual service (October)`
      },
    ],
  },

  leloft: {
    fr: [
      { section: 'rules', content: `Règlement intérieur — Le Loft (Ambilly)

— Horaires de calme : 22h → 8h
— Espaces communs : chacun nettoie après utilisation
— Vaisselle : laver et ranger le jour même
— Poubelles : chacun contribue à sortir les poubelles
— Non-fumeur à l'intérieur
— Animaux : non autorisés
— Invités : prévenir le gestionnaire pour les nuitées (max 2 nuits/semaine)
— Fermer la porte d'entrée à clé après 22h
— Événements soumis à validation` },
      { section: 'spaces', content: `Piscine (extérieure)
• Ouverte mi-avril → fin septembre, 8h-22h
• Douche obligatoire, pas de verre autour du bassin

Sauna
• Au sous-sol, utilisation libre, serviette obligatoire

Salle de sport
• Au sous-sol, haltères, banc, tapis
• Remettre en place après usage

Cuisine
• 1 cuisine commune, frigo avec espaces nominatifs
• Nettoyer après chaque utilisation

Buanderie
• Machine + sèche-linge, produits fournis` },
      { section: 'wifi', content: `WiFi — Le Loft
• Réseau : LeLoft_WiFi
• Mot de passe : affiché dans la cuisine

Streaming : Netflix profil "Le Loft"

Dépannage : redémarrer la box (30 sec) puis contacter Fanny` },
      { section: 'practical', content: `Poubelles : mardi et vendredi (OM), mercredi (tri)
Chauffage : thermostat couloir, ne pas modifier, 20°C/18°C
Tableau électrique : entrée RDC
Parking : places dans la cour, rack vélos disponible
Courrier : boîte aux lettres à l'entrée` },
      { section: 'emergency', content: `Urgences
Fuite d'eau → vanne sous-sol → WhatsApp Fanny
Coupure électrique → disjoncteur entrée RDC
Incendie → évacuer → 18/112 → Fanny
Intrusion → se confiner → 17 → Fanny

Pompiers : 18 | SAMU : 15 | Police : 17 | 112` },
      { section: 'contacts', content: `Fanny (Gestionnaire) : WhatsApp + fanny@lavillacoliving.com (lun-ven 9h-18h)
Urgence maintenance : WhatsApp Fanny
Jérôme (Propriétaire) : jerome@lavillacoliving.com (admin uniquement)
Ménage : planning en cuisine, passer par Fanny` },
      { section: 'cleaning', content: `Jeudi : nettoyage léger | Lundi : nettoyage approfondi
Deep clean bimestriel (voir planning cuisine)
Piscine : entretien hebdomadaire | Jardin : tonte bimensuelle` },
    ],
    en: [
      { section: 'rules', content: `House Rules — Le Loft (Ambilly)

— Quiet hours: 10pm → 8am
— Clean common areas after use
— Wash dishes same day
— Help take out the trash
— No smoking indoors
— No pets
— Overnight guests: notify manager (max 2 nights/week)
— Lock front door after 10pm
— Events subject to approval` },
      { section: 'spaces', content: `Swimming Pool (outdoor)
• Open mid-April → end September, 8am-10pm
• Shower required, no glass around pool

Sauna: basement, free use, towel required
Gym: basement, weights, bench, mats — put back after use
Kitchen: 1 shared kitchen, labeled fridge spaces, clean after use
Laundry: washer + dryer, products provided` },
      { section: 'wifi', content: `WiFi — Le Loft
• Network: LeLoft_WiFi | Password: posted in kitchen
Streaming: Netflix "Le Loft" profile
Troubleshooting: restart router (30 sec) then contact Fanny` },
      { section: 'practical', content: `Trash: Tuesday & Friday (household), Wednesday (recycling)
Heating: hallway thermostat, do not adjust, 20°C/18°C
Electrical panel: ground floor entrance
Parking: courtyard spots, bike rack available
Mail: mailbox at entrance` },
      { section: 'emergency', content: `Emergencies
Water leak → basement valve → WhatsApp Fanny
Power outage → breaker at entrance
Fire → evacuate → 18/112 → Fanny
Break-in → lock in room → 17 → Fanny

Firefighters: 18 | Ambulance: 15 | Police: 17 | 112` },
      { section: 'contacts', content: `Fanny (Manager): WhatsApp + fanny@lavillacoliving.com (Mon-Fri 9am-6pm)
Emergency maintenance: WhatsApp Fanny
Jérôme (Owner): jerome@lavillacoliving.com (admin only)
Cleaning: schedule in kitchen, contact via Fanny` },
      { section: 'cleaning', content: `Thursday: light cleaning | Monday: deep cleaning
Bi-monthly deep clean (see kitchen schedule)
Pool: weekly | Garden: bi-monthly` },
    ],
  },

  lelodge: {
    fr: [
      { section: 'rules', content: `Règlement intérieur — Le Lodge (Annemasse)

— Horaires de calme : 22h → 8h
— Espaces communs : chacun nettoie après utilisation
— Vaisselle : laver et ranger le jour même
— Poubelles : chacun contribue
— Non-fumeur à l'intérieur (terrasse disponible)
— Animaux : non autorisés
— Invités : prévenir le gestionnaire pour les nuitées (max 2 nuits/semaine)
— Badge d'accès : ne pas prêter, signaler toute perte
— Événements soumis à validation` },
      { section: 'spaces', content: `Piscine intérieure chauffée
• Ouverte toute l'année, 7h-22h
• Douche obligatoire, pas de verre

Sauna
• À côté de la piscine, utilisation libre
• Serviette obligatoire

Salle de sport
• Niveau -1, équipements complets
• Remettre en place après usage

Cuisines
• 2 cuisines (RDC + 1er étage)
• Frigo espaces nominatifs

Buanderie
• 2 machines + 2 sèche-linge
• Produits fournis

Bornes de recharge
• 2 bornes EV au parking souterrain
• Utilisation partagée, déplacer sa voiture une fois chargée` },
      { section: 'wifi', content: `WiFi — Le Lodge
• Réseau : LeLodge_WiFi
• Mot de passe : affiché dans les cuisines

Streaming : Netflix + Canal+ sur Smart TVs des salons

Dépannage : redémarrer box → Fanny` },
      { section: 'practical', content: `Poubelles : local poubelles au -1 (accès badge)
Chauffage : centralisé, contacter Fanny si besoin
Tableau électrique : local technique -1
Parking souterrain : 1 place par chambre (badge)
Courrier : boîtes aux lettres hall d'entrée
Bornes recharge EV : 2 bornes au -1` },
      { section: 'emergency', content: `Urgences
Fuite → vanne locale technique -1 → Fanny
Coupure électrique → local technique -1
Incendie → escaliers de secours → 18/112
Intrusion → se confiner → 17

Pompiers : 18 | SAMU : 15 | Police : 17 | 112` },
      { section: 'contacts', content: `Fanny : WhatsApp + fanny@lavillacoliving.com (lun-ven 9h-18h)
Urgence maintenance : WhatsApp Fanny
Jérôme : jerome@lavillacoliving.com (admin uniquement)
Ménage : planning affiché, passer par Fanny` },
      { section: 'cleaning', content: `Jeudi : nettoyage léger | Lundi : nettoyage approfondi
Deep clean bimestriel
Piscine : entretien quotidien (automatique) + hebdomadaire (prestataire)
Parties communes : nettoyage quotidien` },
    ],
    en: [
      { section: 'rules', content: `House Rules — Le Lodge (Annemasse)

— Quiet hours: 10pm → 8am
— Clean common areas after use
— Wash dishes same day
— Help with trash
— No smoking indoors (terrace available)
— No pets
— Overnight guests: notify manager (max 2 nights/week)
— Access badge: do not lend, report any loss
— Events subject to approval` },
      { section: 'spaces', content: `Indoor Heated Pool
• Open year-round, 7am-10pm
• Shower required, no glass

Sauna: next to pool, free use, towel required
Gym: level -1, full equipment, put back after use
Kitchens: 2 kitchens (ground floor + 1st floor), labeled fridge spaces
Laundry: 2 washers + 2 dryers, products provided
EV Charging: 2 stations in underground parking, move car when charged` },
      { section: 'wifi', content: `WiFi — Le Lodge
• Network: LeLodge_WiFi | Password: posted in kitchens
Streaming: Netflix + Canal+ on living room Smart TVs
Troubleshooting: restart router → contact Fanny` },
      { section: 'practical', content: `Trash: waste room at level -1 (badge access)
Heating: centralized, contact Fanny if needed
Electrical panel: technical room level -1
Underground parking: 1 spot per room (badge)
Mail: mailboxes in entrance hall
EV charging: 2 stations at level -1` },
      { section: 'emergency', content: `Emergencies
Water leak → valve in tech room -1 → Fanny
Power outage → tech room -1
Fire → emergency stairs → 18/112
Break-in → lock in room → 17

Firefighters: 18 | Ambulance: 15 | Police: 17 | 112` },
      { section: 'contacts', content: `Fanny (Manager): WhatsApp + fanny@lavillacoliving.com (Mon-Fri 9am-6pm)
Emergency: WhatsApp Fanny
Jérôme (Owner): jerome@lavillacoliving.com (admin only)
Cleaning: schedule posted, contact via Fanny` },
      { section: 'cleaning', content: `Thursday: light cleaning | Monday: deep cleaning
Bi-monthly deep clean
Pool: daily automated + weekly professional
Common areas: daily cleaning` },
    ],
  },
};

export function getPropertyContent(propertyKey: string, language: string): PropertySection[] {
  // Normalize key
  let key = propertyKey;
  if (key.includes('villa')) key = 'lavilla';
  else if (key.includes('loft')) key = 'leloft';
  else if (key.includes('lodge')) key = 'lelodge';

  const langKey = language === 'en' ? 'en' : 'fr';
  return propertyContent[key]?.[langKey] || propertyContent.lavilla?.fr || [];
}
