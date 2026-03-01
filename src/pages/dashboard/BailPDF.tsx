import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface Property {
  id: string;
  name: string;
  legal_entity_name: string;
  siret: string;
  tva: string;
  siege_social: string;
  id_fiscal: string;
  common_areas: string[];
  contract_building_desc: string;
  is_coliving: boolean;
  manager_name: string | null;
  deposit_months: number;
}

interface Room {
  id: string;
  property_id: string;
  name: string;
  room_number: number;
  surface_m2: number;
  floor: string;
  location_detail: string | null;
  description: string;
  bathroom_type: string;
  bathroom_detail: string | null;
  has_parking: boolean;
  parking_detail: string | null;
  has_balcony: boolean;
  has_terrace: boolean;
  has_private_entrance: boolean;
  rent_chf: number;
  specifics: Record<string, any> | null;
  furniture_inventory: Array<{item: string; qty: number}> | null;
}

interface FormData {
  property_id: string;
  room_id: string;
  locataire_nom: string;
  locataire_prenom: string;
  locataire_dob: string;
  locataire_birthplace: string;
  locataire_nationality: string;
  locataire_previous_address: string;
  locataire_email: string;
  locataire_phone: string;
  locataire_profession: string;
  locataire_employer: string;
  entry_date: string;
  loyer_chf: number;
  exchange_rate: number;
  exchange_rate_date: string;
  charges_energy: number;
  charges_maintenance: number;
  charges_services: number;
  frais_dossier: number;
  irl_trimestre: string;
  irl_indice: number;
  clauses_particulieres: string;
  annexe_documents: string[];
}

export interface BailPDFData {
  property: Property;
  room: Room;
  form: FormData;
  exit_date: string;
  loyer_eur: number;
  depot_eur: number;
  prorata_eur: number;
  prorata_chf: number;
  prorata_days: number;
  prorata_total_days: number;
}

function ph(val: string | undefined | null, placeholder: string): string {
  return val?.trim() ? val : `[${placeholder}]`;
}

function fDate(d: string | undefined | null): string {
  if (!d) return "[date]";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "[date invalide]";
  }
}

function fEUR(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n).replace(/[  ]/g," ");
}

function fCHF(n: number): string {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(n).replace(/[  ]/g," ");
}

const gold = "#c9a96e";
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.6,
    color: "#333",
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 45,
  },
  headerBlock: {
    textAlign: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: gold,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginTop: 6,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 9,
    color: "#666",
    marginTop: 2,
  },
  partyBox: {
    backgroundColor: "#faf8f5",
    borderLeftWidth: 3,
    borderLeftColor: gold,
    padding: 10,
    marginVertical: 8,
    fontSize: 9,
  },
  partyLabel: {
    fontFamily: "Helvetica-Bold",
    color: gold,
    fontSize: 10,
    marginBottom: 4,
  },
  articleTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginTop: 18,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: gold,
    paddingBottom: 4,
  },
  /* Keep article headings with their content — avoid orphaned titles at page bottom */
  articleWrap: {
    marginTop: 0,
  },
  body: {
    textAlign: "justify",
    marginBottom: 4,
  },
  subTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginTop: 10,
    marginBottom: 4,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 10,
  },
  bulletDot: {
    width: 12,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  numberedItem: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 10,
  },
  numberedNum: {
    width: 18,
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: gold,
    backgroundColor: "#f9f7f4",
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
  },
  tableCellBold: {
    padding: 6,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 50,
  },
  signatureBox: {
    width: "40%",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 15,
    alignItems: "center",
  },
  signatureLabel: {
    fontSize: 9,
    marginTop: 10,
  },
  signatureName: {
    fontSize: 9,
    fontStyle: "italic",
    marginTop: 25,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: gold,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
  },
  logo: {
    width: 120,
    marginBottom: 6,
    alignSelf: "center",
  },
});

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.bullet}>
      <Text style={s.bulletDot}>{"\u2022"}</Text>
      <Text style={s.bulletText}>{children}</Text>
    </View>
  );
}

function Numbered({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <View style={s.numberedItem}>
      <Text style={s.numberedNum}>{n}.</Text>
      <Text style={s.bulletText}>{children}</Text>
    </View>
  );
}

export function BailPDF({ data }: { data: BailPDFData }) {
  const { property, room, form, exit_date, loyer_eur, depot_eur, prorata_eur, prorata_chf, prorata_days, prorata_total_days } = data;
  const totalCharges = form.charges_energy + form.charges_maintenance + form.charges_services;
  const rate = form.exchange_rate || 0.9145;
  const ville = property.siege_social?.split(",")[0]?.trim() || "[Ville]";

  return (
    <Document>
      {/* ===== SINGLE PAGE — react-pdf handles automatic page breaks ===== */}
      <Page size="A4" style={s.page} wrap>

        {/* ---------- HEADER ---------- */}
        <View style={s.headerBlock} fixed={false}>
          <Image style={s.logo} src="https://www.lavillacoliving.com/logos/logo-full.png" />
          <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>
            {property.legal_entity_name}
          </Text>
          <Text style={s.headerTitle}>{"CONTRAT DE LOCATION\nDE LOGEMENT MEUBL\u00C9"}</Text>
          <Text style={s.headerSub}>{"Loi n\u00B0 89-462 du 6 juillet 1989"}</Text>
        </View>

        {/* ---------- BAILLEUR ---------- */}
        <View style={s.partyBox}>
          <Text style={s.partyLabel}>BAILLEUR :</Text>
          <Text>{ph(property.legal_entity_name, "Entit\u00E9 juridique")}</Text>
          {property.is_coliving ? (
            <View>
              <Text>SIRET : {ph(property.siret, "SIRET")} — TVA : {ph(property.tva, "TVA")}</Text>
              <Text>{"Si\u00E8ge social : "}{ph(property.siege_social, "Si\u00E8ge social")}</Text>
              <Text>{"Repr\u00E9sent\u00E9 par : J\u00E9r\u00F4me AUSTIN, G\u00E9rant"}</Text>
            </View>
          ) : (
            <Text>{"Domicili\u00E9(s) \u00E0 : "}{ph(property.siege_social, "Adresse")}</Text>
          )}
        </View>

        {/* ---------- LOCATAIRE ---------- */}
        <View style={s.partyBox}>
          <Text style={s.partyLabel}>LOCATAIRE :</Text>
          <Text>{ph(form.locataire_nom, "Nom")} {ph(form.locataire_prenom, "Pr\u00E9nom")}</Text>
          <Text>{"N\u00E9(e) le "}{fDate(form.locataire_dob)}{" \u00E0 "}{ph(form.locataire_birthplace, "Lieu de naissance")}</Text>
          <Text>{"Nationalit\u00E9 : "}{ph(form.locataire_nationality, "Nationalit\u00E9")}</Text>
          <Text>{"Adresse pr\u00E9c\u00E9dente : "}{ph(form.locataire_previous_address, "Adresse")}</Text>
          <Text>Email : {ph(form.locataire_email, "Email")}</Text>
          <Text>{"\u2014 T\u00E9l : "}{ph(form.locataire_phone, "T\u00E9l\u00E9phone")}</Text>
          <Text>Profession : {ph(form.locataire_profession, "Profession")}</Text>
          <Text>Employeur : {ph(form.locataire_employer, "Employeur")}</Text>
        </View>

        {/* ---------- ARTICLE I ---------- */}
        <View wrap={false} minPresenceAhead={40}>
          <Text style={s.articleTitle}>{"ARTICLE I \u2014 D\u00C9SIGNATION DES PARTIES"}</Text>
          <Text style={s.body}>
            {"Entre les parties ci-dessus d\u00E9sign\u00E9es, il est convenu ce qui suit."}
          </Text>
        </View>

        {/* ---------- ARTICLE II ---------- */}
        <View minPresenceAhead={60}>
          <Text style={s.articleTitle}>{"ARTICLE II \u2014 OBJET DU CONTRAT"}</Text>
          <Text style={s.body}>
            {property.is_coliving
              ? "Le bailleur loue au locataire un logement meubl\u00E9 comprenant :"
              : "Le bailleur loue au locataire un appartement meubl\u00E9 comprenant :"}
          </Text>
        </View>

        {property.is_coliving ? (
          <View>
            <Bullet>Chambre : {ph(room.name, "Chambre")} — Surface : {room.surface_m2} m² — {"Étage : "}{room.floor}</Bullet>
            {room.location_detail && <Bullet>Emplacement : {room.location_detail}</Bullet>}
            <Bullet>Description : {ph(room.description, "Description")}</Bullet>
            <Bullet>Salle de bain : {ph(room.bathroom_type, "Type")}{room.bathroom_detail ? ` — ${room.bathroom_detail}` : ""}</Bullet>
            {room.has_parking && <Bullet>Parking : {room.parking_detail || "Oui"}</Bullet>}
            {room.has_balcony && <Bullet>Balcon : Oui</Bullet>}
            {room.has_terrace && <Bullet>Terrasse : Oui</Bullet>}
            {room.has_private_entrance && <Bullet>{"Entr\u00e9e priv\u00e9e : Oui"}</Bullet>}
          </View>
        ) : (
          <View>
            <Text style={s.subTitle}>{"A. Consistance du logement"}</Text>
            <Text style={s.body}>
              {"Localisation du logement : 8 rue du Mont-Blanc - Annemasse, 5\u00E8me \u00E9tage droite et face."}
            </Text>
            <Text style={s.body}>
              {"Surface habitable : 150 m2. Comprenant : 1 Double Salon, 3 chambres, 2 salles d\u2019eau, 2 WC dont un avec lave main, cuisines \u00E9quip\u00E9e 2 balcons. Chauffage et eau chaude collective. Appartement meubl\u00E9 : r\u00E9f\u00E9rence \u00E0 l\u2019\u00E9tat des Lieux d\u2019entr\u00E9e."}
            </Text>
            <Text style={s.body}>
              {"Figurant ainsi au cadastre : Section N\u00B0 Lieudit Surface - A 4276 Rue du Mont Blanc 00 ha 40 a 08 ca. Les lots de copropri\u00E9t\u00E9 suivants :"}
            </Text>
            <Bullet>{"Lot num\u00E9ro trente-huit (38) \u2014 Un parking situ\u00E9 au rez-de-chauss\u00E9e portant le num\u00E9ro 8 au plan, et les quatre/dix milli\u00E8mes (4/10000\u00E8mes) des parties communes g\u00E9n\u00E9rales."}</Bullet>
            <Bullet>{"Lot num\u00E9ro quatre cent trente-sept (437) \u2014 Et les quatre-vingt-treize/dix milli\u00E8mes (93/10000\u00E8mes) des parties communes g\u00E9n\u00E9rales."}</Bullet>
            <Bullet>{"Lot num\u00E9ro quatre cent trente-huit (438) \u2014 Et les soixante-deux/dix milli\u00E8mes (62/10000\u00E8mes) des parties communes g\u00E9n\u00E9rales."}</Bullet>
            <Bullet>{"Identifiant fiscal du logement : 740120062912"}</Bullet>
            <Text style={s.subTitle}>{"B. Destination des locaux : usage d\u2019habitation"}</Text>
            <Text style={s.subTitle}>{"C. D\u00E9signation des locaux et \u00E9quipements accessoires de l\u2019immeuble \u00E0 usage privatif du locataire :"}</Text>
            <Text style={s.body}>{"Place de Parking Num\u00E9ro 8 (Identifiant fiscal: 740120062917)"}</Text>
          </View>
        )}

        {/* Parties communes */}
        {property.is_coliving && (property.common_areas || []).length > 0 && (
          <View>
            <Text style={s.subTitle}>{"Acc\u00E8s aux parties communes :"}</Text>
            {(property.common_areas || []).map((area: string, i: number) => (
              <Bullet key={i}>{area}</Bullet>
            ))}
          </View>
        )}

        {/* Charges & Services coliving */}
        {property.is_coliving ? (
          <View>
            <Text style={s.subTitle}>{"Charges & Services inclus dans le forfait location TOUT INCLUS à «La Villa»"}</Text>

            <Text style={[s.subTitle, { fontSize: 9, marginTop: 8 }]}>{"EAU & ÉNERGIE :"}</Text>
            <Bullet>{"\u00C9lectricit\u00E9"}</Bullet>
            <Bullet>{"Eau froide et chaude"}</Bullet>
            <Bullet>{"Eau n\u00E9cessaire \u00E0 l\u2019entretien courant des parties communes"}</Bullet>
            <Bullet>{"Eau n\u00E9cessaire \u00E0 l\u2019entretien courant des espaces ext\u00E9rieurs"}</Bullet>
            <Bullet>{"Produits n\u00E9cessaires \u00E0 l\u2019exploitation, \u00E0 l\u2019entretien et au traitement de l\u2019eau"}</Bullet>
            <Bullet>{"Fourniture d\u2019\u00E9nergie quelle que soit sa nature"}</Bullet>
            <Bullet>{"Chauffage et production d\u2019eau chaude"}</Bullet>
            <Bullet>{"Distribution d\u2019eau dans les parties privatives (contr\u00F4le des raccordements, r\u00E9glage de d\u00E9bit et temp\u00E9ratures, d\u00E9pannage, remplacement des joints cloches des chasses d\u2019eau)"}</Bullet>
            <Bullet>{"Tout entretien"}</Bullet>

            <Text style={[s.subTitle, { fontSize: 9, marginTop: 8 }]}>SERVICES</Text>
            <Bullet>{"Mise \u00E0 disposition d\u2019une parure de linge de lit et serviette."}</Bullet>
            <Bullet>{"M\u00E9nage 2 fois par semaine dans les parties communes int\u00E9rieur. M\u00E9nage de la chambre en option."}</Bullet>
            <Bullet>{"Entretien r\u00E9gulier des parties communes ext\u00E9rieur : pisciniste, jardinier, \u00E9lagage, nettoyage"}</Bullet>
            <Bullet>{"Box pour diner communautaire livr\u00E9e 1 fois/mois"}</Bullet>
            <Bullet>{"\u00C9v\u00E8nements communautaires r\u00E9currents"}</Bullet>
            <Bullet>{"R\u00E9solution des probl\u00E8mes Contact via WhatsApp, r\u00E9ponse en moins de 48h."}</Bullet>
            <Bullet>{"Cours de yoga"}</Bullet>
            <Bullet>{"Cours de remise en forme (coaching Sportif)"}</Bullet>
            <Bullet>{"Fournitures de base : 1 panier de base livr\u00E9 chaque mois pour la communaut\u00E9 (papier toilette, Essuie-tout, lessive, produits d\u2019entretiens, ..) en fonction de votre demande"}</Bullet>
            <Bullet>{"Gestion des d\u00E9parts : \u00E0 vous de rencontrer notre s\u00E9lection de nouveaux candidats et de les s\u00E9lectionner"}</Bullet>

            <Text style={[s.subTitle, { fontSize: 9, marginTop: 8 }]}>{"ENTRETIEN"}</Text>
            <Text style={[s.body, { fontSize: 9 }]}>
              {"Entretien des parties communes int\u00E9rieures et ext\u00E9rieures : r\u00E9paration et entretien et remplacement des \u00E9l\u00E9ments d\u00E9fectueux des parties communes de la maison. Entretien des ext\u00E9rieurs et de la piscine. M\u00E9nage effectu\u00E9 deux fois par semaine pour que les espaces communs brillent !"}
            </Text>
            <Text style={[s.subTitle, { fontSize: 8, marginTop: 4 }]}>{"PARTIES COMMUNES INT\u00C9RIEURES"}</Text>
            <Bullet>{"Fourniture de produits d\u2019entretien (balais et sacs n\u00E9cessaires \u00E0 l\u2019\u00E9limination des d\u00E9chets) et de produits de d\u00E9sinsectisation et d\u00E9sinfection"}</Bullet>
            <Bullet>{"Entretien de la minuterie, des tapis, des vide-ordures"}</Bullet>
            <Bullet>{"R\u00E9paration des appareils d\u2019entretien de propret\u00E9 tels que l\u2019aspirateur"}</Bullet>
            <Bullet>{"Frais de personnel d\u2019entretien."}</Bullet>
            <Text style={[s.subTitle, { fontSize: 8, marginTop: 4 }]}>{"PARTIES COMMUNES EXT\u00C9RIEURES"}</Text>
            <Bullet>{"Voies de circulation"}</Bullet>
            <Bullet>{"Aires de stationnement"}</Bullet>
            <Bullet>{"Abords des espaces verts"}</Bullet>
            <Bullet>{"\u00C9quipements : piscine, terrasse, barbecue, jeux"}</Bullet>

            <Text style={[s.subTitle, { fontSize: 9, marginTop: 8 }]}>ABONNEMENTS</Text>
            <Bullet>{"Eau, \u00C9lectricit\u00E9, Gaz,"}</Bullet>
            <Bullet>{"Entretien Chaudi\u00E8re"}</Bullet>
            <Bullet>{"Internet"}</Bullet>
            <Bullet>{"Abonnements num\u00E9riques de divertissement"}</Bullet>

            <Text style={[s.subTitle, { fontSize: 9, marginTop: 8 }]}>TAXES</Text>
            <Bullet>{"Taxe ou redevance d\u2019enl\u00E8vement des ordures m\u00E9nag\u00E8res"}</Bullet>
            <Bullet>{"Taxe de balayage"}</Bullet>
            <Bullet>{"Redevance assainissement."}</Bullet>
          </View>
        ) : (
          <View>
            <Text style={s.subTitle}>{"Charges r\u00E9cup\u00E9rables (provisions avec r\u00E9gularisation annuelle) :"}</Text>
            <Bullet>{"Chauffage et eau chaude collective"}</Bullet>
            <Bullet>{"Eau froide"}</Bullet>
            <Bullet>{"Ordures m\u00E9nag\u00E8res"}</Bullet>
            <Bullet>{"Entretien des parties communes de l\u2019immeuble"}</Bullet>
            <Bullet>{"Ascenseur"}</Bullet>
          </View>
        )}

        {!property.is_coliving && room.furniture_inventory && room.furniture_inventory.length > 0 && (
          <View>
            <Text style={s.subTitle}>{"Inventaire du mobilier fourni :"}</Text>
            {room.furniture_inventory.map((fi: any, i: number) => (
              <Bullet key={i}>{fi.item}{fi.qty > 1 ? ` (\u00d7${fi.qty})` : ""}</Bullet>
            ))}
          </View>
        )}

        {/* ---------- ARTICLE III ---------- */}
        <View wrap={false} minPresenceAhead={30}>
          <Text style={s.articleTitle}>{"ARTICLE III \u2014 DATE DE PRISE D\u2019EFFET ET DUR\u00C9E"}</Text>
          <Text style={s.body}>
            {"La location prend effet le "}{fDate(form.entry_date)}{" pour une dur\u00E9e de douze (12) mois, soit jusqu\u2019au "}{fDate(exit_date)}.
          </Text>
          <Text style={s.body}>
            {"\u00C0 l\u2019expiration de cette p\u00E9riode, le contrat se renouvelle par reconduction tacite pour des p\u00E9riodes successives de douze mois, sauf d\u00E9nonciation notifi\u00E9e au moins un mois avant l\u2019expiration du contrat par le locataire, ou trois mois par le bailleur."}
          </Text>
        </View>

        {/* ---------- ARTICLE IV ---------- */}
        <View minPresenceAhead={60}>
          <Text style={s.articleTitle}>{"ARTICLE IV \u2014 CONDITIONS FINANCI\u00C8RES"}</Text>
        </View>

        {property.is_coliving ? (
          <View>
            <Text style={s.subTitle}>Loyer mensuel :</Text>
            <Text style={s.body}>{fEUR(loyer_eur)} - (taux BCE du {form.exchange_rate_date || "\u2014"} : {rate})</Text>
            {prorata_days > 0 && prorata_total_days > 0 && prorata_days < prorata_total_days ? (
              <View>
                <Text style={[s.body, { marginTop: 6 }]}>
                  {"Prorata du premier mois : du "}{fDate(form.entry_date)}{" au dernier jour du mois ("}{prorata_days}{"/"}{prorata_total_days}{" jours) :"}
                </Text>
                <Bullet>En EUR : {fEUR(prorata_eur)}</Bullet>
                <Bullet>En CHF : {fCHF(prorata_chf)}</Bullet>
              </View>
            ) : (
              <Text style={s.body}>{"Entr\u00E9e le 1er du mois \u2014 pas de prorata."}</Text>
            )}

            <Text style={s.subTitle}>{"Charges forfaitaires mensuelles :"}</Text>
            <Text style={[s.body, { fontSize: 9, color: "#666" }]}>
              {"Le montant mensuel des charges forfaitaires et des services est inclus dans le loyer principal."}
            </Text>
            <View style={s.tableHeader}>
              <Text style={[s.tableCellBold, { width: "60%" }]}>{"Cat\u00E9gorie"}</Text>
              <Text style={[s.tableCellBold, { width: "40%", textAlign: "right" }]}>EUR</Text>
            </View>
            <View style={s.tableRow}>
              <Text style={[s.tableCell, { width: "60%" }]}>{"Énergie (eau, chauffage, \u00E9lec.)"}</Text>
              <Text style={[s.tableCell, { width: "40%", textAlign: "right" }]}>{fEUR(form.charges_energy)}</Text>
            </View>
            <View style={s.tableRow}>
              <Text style={[s.tableCell, { width: "60%" }]}>Maintenance et Entretien</Text>
              <Text style={[s.tableCell, { width: "40%", textAlign: "right" }]}>{fEUR(form.charges_maintenance)}</Text>
            </View>
            <View style={s.tableRow}>
              <Text style={[s.tableCell, { width: "60%" }]}>{"Services (m\u00E9nage, yoga, support)"}</Text>
              <Text style={[s.tableCell, { width: "40%", textAlign: "right" }]}>{fEUR(form.charges_services)}</Text>
            </View>
            <View style={[s.tableHeader, { marginBottom: 8 }]}>
              <Text style={[s.tableCellBold, { width: "60%" }]}>TOTAL CHARGES</Text>
              <Text style={[s.tableCellBold, { width: "40%", textAlign: "right" }]}>{fEUR(totalCharges)}</Text>
            </View>

            <Text style={s.subTitle}>Frais de dossier :</Text>
            <Bullet>Montant : {fEUR(form.frais_dossier)} ({fCHF(form.frais_dossier * rate)}) — OFFERTS par le bailleur</Bullet>
            <Text style={[s.body, { marginTop: 6, fontSize: 9 }]}>
              {"En cas de d\u00E9part \u00E0 une date inf\u00E9rieure \u00E0 3 mois r\u00E9volu \u00E0 partir de la date de d\u00E9but du contrat, le locataire sera redevable aupr\u00E8s du bailleur des frais de dossier administratifs de services et d\u2019\u00E9tats des lieux, offerts dans ce pr\u00E9sent contrat."}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={s.subTitle}>Loyer mensuel :</Text>
            <Bullet>Loyer : {fEUR(loyer_eur)}</Bullet>

            <Text style={s.subTitle}>{"Provisions sur charges (avec r\u00E9gularisation annuelle) :"}</Text>
            <Bullet>Montant mensuel : {fEUR(totalCharges)}</Bullet>
            <Text style={[s.body, { fontSize: 9, color: "#666" }]}>
              {"La r\u00E9gularisation des charges est effectu\u00E9e annuellement, au vu des d\u00E9penses r\u00E9elles. Le trop-per\u00E7u est restitu\u00E9 au locataire ou le compl\u00E9ment est demand\u00E9."}
            </Text>
          </View>
        )}

        <Text style={s.subTitle}>{"R\u00E9vision annuelle (IRL) :"}</Text>
        <Bullet>{"Trimestre de r\u00E9f\u00E9rence : "}{ph(form.irl_trimestre, "3\u00E8me trimestre 2025")}</Bullet>
        <Bullet>{"Indice de r\u00E9f\u00E9rence : "}{form.irl_indice}</Bullet>
        <Bullet>{"La r\u00E9vision s\u2019effectue chaque ann\u00E9e \u00E0 la date anniversaire du contrat."}</Bullet>

        <Text style={s.subTitle}>{"Modalit\u00E9s de paiement :"}</Text>
        <Bullet>{"Le loyer et les charges doivent \u00EAtre vers\u00E9s avant le 5 du mois."}</Bullet>
        <Bullet>Virement bancaire sur le compte du bailleur.</Bullet>

        {/* ---------- ARTICLE V ---------- */}
        <View wrap={false} minPresenceAhead={30}>
          <Text style={s.articleTitle}>{"ARTICLE V \u2014 GARANTIES"}</Text>
          <Text style={s.body}>
            {property.is_coliving
              ? <>{"Le locataire versera un d\u00E9p\u00F4t de garantie \u00E9gal \u00E0 deux (2) mois de loyer, soit "}{fEUR(depot_eur)} ({fCHF(depot_eur * rate)}){", restitu\u00E9 dans les deux (2) mois suivant la fin du contrat, selon l\u2019\u00E9tat des lieux."}</>
              : <>{"Le locataire versera un d\u00E9p\u00F4t de garantie \u00E9gal \u00E0 un (1) mois de loyer hors charges, soit "}{fEUR(depot_eur)}{", restitu\u00E9 dans les deux (2) mois suivant la fin du contrat, d\u00E9duction faite des sommes \u00E9ventuellement dues."}</>
            }
          </Text>
        </View>

        {/* ---------- ARTICLE VI ---------- */}
        <View wrap={false} minPresenceAhead={30}>
          <Text style={s.articleTitle}>{"ARTICLE VI \u2014 CLAUSE R\u00C9SOLUTOIRE"}</Text>
          <Text style={s.body}>
            {"Le bailleur se r\u00E9serve le droit de r\u00E9silier le contrat en cas de non-paiement du loyer ou des charges, sans pr\u00E9judice du droit de poursuivre le recouvrement des sommes dues."}
          </Text>
        </View>

        {/* ---------- ARTICLE VII ---------- */}
        <View minPresenceAhead={60}>
          <Text style={s.articleTitle}>{"ARTICLE VII \u2014 OBLIGATIONS DU LOCATAIRE"}</Text>
          <Text style={s.body}>{"Le locataire s\u2019engage \u00E0 :"}</Text>
        </View>
        <Numbered n={1}>{"Payer le loyer et les charges aux dates et lieux convenus ;"}</Numbered>
        <Numbered n={2}>{"Maintenir le logement en bon \u00E9tat de propret\u00E9 et d\u2019entretien ;"}</Numbered>
        <Numbered n={3}>{"Respecter le silence et bonnes m\u0153urs, notamment entre 22h et 8h ;"}</Numbered>
        <Numbered n={4}>{"Ne point inviter d\u2019h\u00F4tes de mani\u00E8re prolong\u00E9e sans accord pr\u00E9alable ;"}</Numbered>
        {property.is_coliving && <Numbered n={5}>{"Utiliser les parties communes avec responsabilit\u00E9 et courtoisie ;"}</Numbered>}
        {property.is_coliving && <Numbered n={6}>{"Respecter le R\u00E8glement Int\u00E9rieur La Villa (annexe au pr\u00E9sent contrat) ;"}</Numbered>}
        <Numbered n={property.is_coliving ? 7 : 5}>{"D\u00E9clarer tout incident ou dommage aupr\u00E8s du bailleur dans les 48h ;"}</Numbered>
        <Numbered n={property.is_coliving ? 8 : 6}>{"Rendre le logement en bon \u00E9tat \u00E0 la fin du contrat (usure normale except\u00E9e) ;"}</Numbered>
        <Numbered n={property.is_coliving ? 9 : 7}>{"Participer aux \u00E9tats des lieux d\u2019entr\u00E9e et de sortie."}</Numbered>

        {/* ---------- ARTICLE VIII ---------- */}
        <View wrap={false} minPresenceAhead={40}>
          <Text style={s.articleTitle}>{"ARTICLE VIII \u2014 OBLIGATIONS DU BAILLEUR"}</Text>
          <Text style={s.body}>{"Le bailleur s\u2019engage \u00E0 :"}</Text>
          <Numbered n={1}>Assurer la jouissance paisible du logement ;</Numbered>
          <Numbered n={2}>{"Maintenir les lieux en bon \u00E9tat de r\u00E9paration et de viabilit\u00E9 ;"}</Numbered>
          <Numbered n={3}>{"Fournir les services d\u00E9crits \u00E0 l\u2019article II ;"}</Numbered>
          <Numbered n={4}>{"R\u00E9pondre aux demandes d\u2019entretien dans un d\u00E9lai raisonnable (max 48h) ;"}</Numbered>
          <Numbered n={5}>{"Respecter la vie priv\u00E9e du locataire et donner un pr\u00E9avis de 48h avant visite."}</Numbered>
        </View>

        {/* ---------- ARTICLE IX ---------- */}
        <View wrap={false} minPresenceAhead={30}>
          <Text style={s.articleTitle}>{"ARTICLE IX \u2014 \u00C9TAT DES LIEUX"}</Text>
          <Text style={s.body}>
            {property.is_coliving
              ? "L\u2019\u00E9tat des lieux d\u2019entr\u00E9e et de sortie sera \u00E9tabli via Etadly. Le locataire recevra un exemplaire apr\u00E8s sa r\u00E9alisation."
              : "L\u2019\u00E9tat des lieux d\u2019entr\u00E9e et de sortie sera \u00E9tabli contradictoirement entre les parties. Le locataire re\u00E7oit un exemplaire."}
          </Text>
        </View>

        {/* ---------- ARTICLE X (Mont-Blanc only: Inventaire) ---------- */}
        {!property.is_coliving && (
          <View wrap={false} minPresenceAhead={30}>
            <Text style={s.articleTitle}>{"ARTICLE X \u2014 INVENTAIRE DU MOBILIER"}</Text>
            <Text style={s.body}>
              {"L\u2019inventaire d\u00E9taill\u00E9 du mobilier et des \u00E9quipements fournis est joint en annexe au pr\u00E9sent contrat. Le locataire s\u2019engage \u00E0 en prendre soin et \u00E0 le restituer en bon \u00E9tat."}
            </Text>
          </View>
        )}

        {/* ---------- Diagnostics ---------- */}
        <View wrap={false} minPresenceAhead={40}>
          <Text style={s.articleTitle}>{property.is_coliving ? "ARTICLE X \u2014 DIAGNOSTICS TECHNIQUES" : "ARTICLE XI \u2014 DIAGNOSTICS TECHNIQUES"}</Text>
          <Text style={s.body}>
            {"Conform\u00E9ment \u00E0 la r\u00E9glementation fran\u00E7aise, le bailleur fournit au locataire :"}
          </Text>
          <Bullet>{"Diagnostic de Performance \u00C9nerg\u00E9tique (DPE)"}</Bullet>
          <Bullet>{"État du Risque et Pollution (ERP)"}</Bullet>
          <Bullet>{"Constat de Risque d\u2019Exposition au Plomb (CREP)"}</Bullet>
          <Bullet>Diagnostic Amiante</Bullet>
          <Bullet>Diagnostic Bruit</Bullet>
        </View>

        {/* ---------- Règlement intérieur (coliving only) ---------- */}
        {property.is_coliving && (
          <View wrap={false} minPresenceAhead={30}>
            <Text style={s.articleTitle}>{"ARTICLE XI \u2014 R\u00C8GLEMENT INT\u00C9RIEUR"}</Text>
            <Text style={s.body}>
              {"Le locataire accepte le R\u00E8glement Int\u00E9rieur La Villa Coliving (la \u201CBible du Coliver\u201D), joint en annexe, qui pr\u00E9cise les r\u00E8gles de vie commune, l\u2019usage des parties communes et les proc\u00E9dures de gestion interne."}
            </Text>
          </View>
        )}

        {/* ---------- ANNEXES ---------- */}
        <View wrap={false} minPresenceAhead={20}>
          <Text style={s.articleTitle}>{property.is_coliving ? "ARTICLE XII \u2014 ANNEXES" : "ARTICLE XII \u2014 ANNEXES"}</Text>
          <Text style={s.body}>{"Sont annex\u00E9es au pr\u00E9sent contrat :"}</Text>
          {!property.is_coliving && <Bullet>{"Notice d\u2019information relative aux droits et obligations des locataires et des bailleurs"}</Bullet>}
          {!property.is_coliving && <Bullet>{"RIB du bailleur"}</Bullet>}
          {property.is_coliving && <Bullet>{"R\u00E8glement Int\u00E9rieur La Villa Coliving"}</Bullet>}
          <Bullet>Diagnostics techniques</Bullet>
          {(form.annexe_documents || []).map((doc: string, i: number) => (
            <Bullet key={i}>{doc}</Bullet>
          ))}
        </View>

        {/* ---------- Clauses particulières ---------- */}
        {form.clauses_particulieres?.trim() ? (
          <View wrap={false} minPresenceAhead={30}>
            <Text style={s.articleTitle}>{"CLAUSES PARTICULI\u00C8RES"}</Text>
            <Text style={s.body}>{form.clauses_particulieres}</Text>
          </View>
        ) : null}

        {/* ---------- SIGNATURES ---------- */}
        <View wrap={false}>
          <View style={s.signatureSection}>
            <View style={s.signatureBox}>
              <Text style={{ fontSize: 9 }}>{"Fait \u00E0 "}{ville}</Text>
              <Text style={s.signatureLabel}>Signature du bailleur</Text>
              <Text style={s.signatureName}>{property.manager_name || "J\u00E9r\u00F4me AUSTIN"}</Text>
            </View>
            <View style={s.signatureBox}>
              <Text style={{ fontSize: 9 }}>Le {fDate(form.entry_date)}</Text>
              <Text style={s.signatureLabel}>Signature du locataire</Text>
              <Text style={s.signatureName}>{ph(form.locataire_prenom, "Pr\u00E9nom")} {ph(form.locataire_nom, "Nom")}</Text>
            </View>
          </View>

          <View style={s.footer}>
            <Text>{"Lu et approuv\u00E9"}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
