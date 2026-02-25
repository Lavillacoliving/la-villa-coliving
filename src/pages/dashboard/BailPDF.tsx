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
  }).format(n).replace(/[  ]/g," ");
}

function fCHF(n: number): string {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(n).replace(/[  ]/g," ");
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
      <Page size="A4" style={s.page}>
        <View style={s.headerBlock}>
          <Image style={s.logo} src="https://www.lavillacoliving.com/logos/logo-full.png" />
          <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>
            {property.legal_entity_name}
          </Text>
          <Text style={s.headerTitle}>{"CONTRAT DE LOCATION\nDE LOGEMENT MEUBL\u00C9"}</Text>
          <Text style={s.headerSub}>{"Loi n\u00B0 89-462 du 6 juillet 1989"}</Text>
        </View>

        <View style={s.partyBox}>
          <Text style={s.partyLabel}>BAILLEUR :</Text>
          <Text>{ph(property.legal_entity_name, "Entit\u00E9 juridique")}</Text>
          <Text>SIRET : {ph(property.siret, "SIRET")} — TVA : {ph(property.tva, "TVA")}</Text>
          <Text>{"Si\u00E8ge social : "}{ph(property.siege_social, "Si\u00E8ge social")}</Text>
          <Text>{"Repr\u00E9sent\u00E9 par : J\u00E9r\u00F4me AUSTIN, G\u00E9rant"}</Text>
        </View>

        <View style={s.partyBox}>
          <Text style={s.partyLabel}>LOCATAIRE :</Text>
          <Text>{ph(form.locataire_nom, "Nom")} {ph(form.locataire_prenom, "Pr\u00E9nom")}</Text>
          <Text>{"N\u00E9(e) le "}{fDate(form.locataire_dob)}{" \u00E0 "}{ph(form.locataire_birthplace, "Lieu de naissance")}</Text>
          <Text>{"Nationalit\u00E9 : "}{ph(form.locataire_nationality, "Nationalit\u00E9")}</Text>
          <Text>{"Adresse pr\u00E9c\u00E9dente : "}{ph(form.locataire_previous_address, "Adresse")}</Text>
          <Text>Email : {ph(form.locataire_email, "Email")} {" \u2014 T\u00E9l : "}{ph(form.locataire_phone, "T\u00E9l\u00E9phone")}</Text>
          <Text>Profession : {ph(form.locataire_profession, "Profession")} {" \u2014 Employeur : "}{ph(form.locataire_employer, "Employeur")}</Text>
        </View>

        <Text style={s.articleTitle}>{"ARTICLE I \u2014 D\u00C9SIGNATION DES PARTIES"}</Text>
        <Text style={s.body}>
          {"Entre les parties ci-dessus d\u00E9sign\u00E9es, il est convenu ce qui suit."}
        </Text>

        <Text style={s.articleTitle}>{"ARTICLE II \u2014 OBJET DU CONTRAT"}</Text>
        <Text style={s.body}>
          {property.is_coliving
            ? "Le bailleur loue au locataire un logement meubl\u00E9 comprenant :"
            : "Le bailleur loue au locataire un appartement meubl\u00E9 comprenant :"}
        </Text>
        {property.is_coliving ? (
          <Bullet>Chambre : {ph(room.name, "Chambre")} — Surface : {room.surface_m2} m² — {"Étage : "}{room.floor}</Bullet>
        ) : (
          <Bullet>Appartement : {ph(room.name, "Logement")} — Surface : {room.surface_m2} m² — {"Étage : "}{room.floor}</Bullet>
        )}
        {room.location_detail && <Bullet>Emplacement : {room.location_detail}</Bullet>}
        <Bullet>Description : {ph(room.description, "Description")}</Bullet>
        <Bullet>Salle de bain : {ph(room.bathroom_type, "Type")}{room.bathroom_detail ? ` — ${room.bathroom_detail}` : ""}</Bullet>
        {room.has_parking && <Bullet>Parking : {room.parking_detail || "Oui"}</Bullet>}
        {room.has_balcony && <Bullet>Balcon : Oui</Bullet>}
        {room.has_terrace && <Bullet>Terrasse : Oui</Bullet>}
        {room.has_private_entrance && <Bullet>{"Entr\u00e9e priv\u00e9e : Oui"}</Bullet>}

        {property.is_coliving && (property.common_areas || []).length > 0 && (
          <View>
            <Text style={s.subTitle}>{"Acc\u00E8s aux parties communes :"}</Text>
            {(property.common_areas || []).map((area: string, i: number) => (
              <Bullet key={i}>{area}</Bullet>
            ))}
          </View>
        )}

        {property.is_coliving ? (
          <View>
            <Text style={s.subTitle}>Services inclus au loyer :</Text>
            <Bullet>{"\u00C9lectricit\u00E9, eau froide et chaude, chauffage"}</Bullet>
            <Bullet>Linge de lit (fourniture et entretien)</Bullet>
            <Bullet>{"M\u00E9nage 2 fois par semaine des parties communes"}</Bullet>
            <Bullet>{"Entretien des espaces ext\u00E9rieurs"}</Bullet>
            <Bullet>{"Piscine (acc\u00E8s et entretien)"}</Bullet>
            <Bullet>{"Événements communautaires"}</Bullet>
            <Bullet>Support WhatsApp/Email sous 48h</Bullet>
            <Bullet>Cours de yoga et coaching sportif</Bullet>
            <Bullet>{"Internet tr\u00E8s haut d\u00E9bit"}</Bullet>
            <Bullet>{"Acc\u00E8s streaming (Netflix, Spotify, etc.)"}</Bullet>
            <Bullet>Fournitures de base mensuelles</Bullet>
            <Bullet>{"Ordures m\u00E9nag\u00E8res, balayage, assainissement"}</Bullet>
          </View>
        ) : (
          <View>
            <Text style={s.subTitle}>{"Charges comprises dans le forfait :"}</Text>
            <Bullet>{"\u00C9lectricit\u00E9, eau froide et chaude, chauffage"}</Bullet>
            <Bullet>{"Ordures m\u00E9nag\u00E8res et assainissement"}</Bullet>
            <Bullet>{"Entretien des parties communes de l\u2019immeuble"}</Bullet>
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

        <Text style={s.articleTitle}>{"ARTICLE III \u2014 DATE DE PRISE D\u2019EFFET ET DUR\u00C9E"}</Text>
        <Text style={s.body}>
          {"La location prend effet le "}{fDate(form.entry_date)}{" pour une dur\u00E9e de douze (12) mois, soit jusqu\u2019au "}{fDate(exit_date)}.
        </Text>
        <Text style={s.body}>
          {"\u00C0 l\u2019expiration de cette p\u00E9riode, le contrat se renouvelle par reconduction tacite pour des p\u00E9riodes successives de douze mois, sauf d\u00E9nonciation notifi\u00E9e au moins un mois avant l\u2019expiration du contrat par le locataire, ou trois mois par le bailleur."}
        </Text>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.articleTitle}>{"ARTICLE IV \u2014 CONDITIONS FINANCI\u00C8RES"}</Text>

        <Text style={s.subTitle}>Loyer mensuel :</Text>
        <Bullet>En CHF : {fCHF(form.loyer_chf)} (taux BCE du {form.exchange_rate_date || "—"} : {rate})</Bullet>
        <Bullet>En EUR : {fEUR(loyer_eur)}</Bullet>
        {prorata_days > 0 && prorata_total_days > 0 && prorata_days < prorata_total_days ? (
          <View>
            <Text style={[s.body, { marginTop: 6 }]}>
              {"Prorata du premier mois : du "}{fDate(form.entry_date)}{" au dernier jour du mois ("}{prorata_days}{"/"}{prorata_total_days}{" jours) :"}
            </Text>
            <Bullet>En EUR : {fEUR(prorata_eur)}</Bullet>
            <Bullet>En CHF : {fCHF(prorata_chf)}</Bullet>
          </View>
        ) : (
          <Text style={s.body}>
            {"Entr\u00E9e le 1er du mois \u2014 pas de prorata."}
          </Text>
        )}

        <Text style={s.subTitle}>{"Charges forfaitaires mensuelles :"}</Text>
        <View style={s.tableHeader}>
          <Text style={[s.tableCellBold, { width: "50%" }]}>{"Cat\u00E9gorie"}</Text>
          <Text style={[s.tableCellBold, { width: "25%", textAlign: "right" }]}>EUR</Text>
          <Text style={[s.tableCellBold, { width: "25%", textAlign: "right" }]}>CHF</Text>
        </View>
        <View style={s.tableRow}>
          <Text style={[s.tableCell, { width: "50%" }]}>{"Énergie (eau, chauffage, \u00E9lec.)"}</Text>
          <Text style={[s.tableCell, { width: "25%", textAlign: "right" }]}>{fEUR(form.charges_energy / rate)}</Text>
          <Text style={[s.tableCell, { width: "25%", textAlign: "right" }]}>{fCHF(form.charges_energy)}</Text>
        </View>
        <View style={s.tableRow}>
          <Text style={[s.tableCell, { width: "50%" }]}>Maintenance et Entretien</Text>
          <Text style={[s.tableCell, { width: "25%", textAlign: "right" }]}>{fEUR(form.charges_maintenance / rate)}</Text>
          <Text style={[s.tableCell, { width: "25%", textAlign: "right" }]}>{fCHF(form.charges_maintenance)}</Text>
        </View>
        <View style={s.tableRow}>
          <Text style={[s.tableCell, { width: "50%" }]}>{property.is_coliving ? "Services (m\u00E9nage, yoga, support)" : "Charges diverses"}</Text>
          <Text style={[s.tableCell, { width: "25%", textAlign: "right" }]}>{fEUR(form.charges_services / rate)}</Text>
          <Text style={[s.tableCell, { width: "25%", textAlign: "right" }]}>{fCHF(form.charges_services)}</Text>
        </View>
        <View style={[s.tableHeader, { marginBottom: 8 }]}>
          <Text style={[s.tableCellBold, { width: "50%" }]}>TOTAL CHARGES</Text>
          <Text style={[s.tableCellBold, { width: "25%", textAlign: "right" }]}>{fEUR(totalCharges / rate)}</Text>
          <Text style={[s.tableCellBold, { width: "25%", textAlign: "right" }]}>{fCHF(totalCharges)}</Text>
        </View>

        <Text style={s.subTitle}>{"R\u00E9vision annuelle (IRL) :"}</Text>
        <Bullet>{"Trimestre de r\u00E9f\u00E9rence : "}{ph(form.irl_trimestre, "3\u00E8me trimestre 2025")}</Bullet>
        <Bullet>{"Indice de r\u00E9f\u00E9rence : "}{form.irl_indice}</Bullet>
        <Bullet>{"La r\u00E9vision s\u2019effectue chaque ann\u00E9e \u00E0 la date anniversaire du contrat."}</Bullet>

        <Text style={s.subTitle}>Frais de dossier :</Text>
        <Bullet>Montant : {fEUR(form.frais_dossier)} ({fCHF(form.frais_dossier * rate)}) — OFFERTS par le bailleur</Bullet>

        <Text style={s.subTitle}>{"Modalit\u00E9s de paiement :"}</Text>
        <Bullet>{"Le loyer et les charges doivent \u00EAtre vers\u00E9s avant le 5 du mois."}</Bullet>
        <Bullet>Virement bancaire sur le compte du bailleur.</Bullet>

        <Text style={s.articleTitle}>{"ARTICLE V \u2014 GARANTIES"}</Text>
        <Text style={s.body}>
          {"Le locataire versera un d\u00E9p\u00F4t de garantie \u00E9gal \u00E0 deux (2) mois de loyer, soit "}{fEUR(depot_eur)} ({fCHF(depot_eur * rate)}){", restitu\u00E9 dans les deux (2) mois suivant la fin du contrat, selon l\u2019\u00E9tat des lieux."}
        </Text>

        <Text style={s.articleTitle}>{"ARTICLE VI \u2014 CLAUSE R\u00C9SOLUTOIRE"}</Text>
        <Text style={s.body}>
          {"Le bailleur se r\u00E9serve le droit de r\u00E9silier le contrat en cas de non-paiement du loyer ou des charges, sans pr\u00E9judice du droit de poursuivre le recouvrement des sommes dues."}
        </Text>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.articleTitle}>{"ARTICLE VII \u2014 OBLIGATIONS DU LOCATAIRE"}</Text>
        <Text style={s.body}>{"Le locataire s\u2019engage \u00E0 :"}</Text>
        <Numbered n={1}>{"Payer le loyer et les charges aux dates et lieux convenus ;"}</Numbered>
        <Numbered n={2}>{"Maintenir le logement en bon \u00E9tat de propret\u00E9 et d\u2019entretien ;"}</Numbered>
        <Numbered n={3}>{"Respecter le silence et bonnes m\u0153urs, notamment entre 22h et 8h ;"}</Numbered>
        <Numbered n={4}>{"Ne point inviter d\u2019h\u00F4tes de mani\u00E8re prolong\u00E9e sans accord pr\u00E9alable ;"}</Numbered>
        {property.is_coliving && <Numbered n={5}>{"Utiliser les parties communes avec responsabilit\u00E9 et courtoisie ;"}</Numbered>}
        {property.is_coliving && <Numbered n={property.is_coliving ? 6 : 5}>{"Respecter le R\u00E8glement Int\u00E9rieur La Villa (annexe au pr\u00E9sent contrat) ;"}</Numbered>}
        <Numbered n={property.is_coliving ? 7 : 5}>{"D\u00E9clarer tout incident ou dommage aupr\u00E8s du bailleur dans les 48h ;"}</Numbered>
        <Numbered n={property.is_coliving ? 8 : 6}>{"Rendre le logement en bon \u00E9tat \u00E0 la fin du contrat (usure normale except\u00E9e) ;"}</Numbered>
        <Numbered n={property.is_coliving ? 9 : 7}>{"Participer aux \u00E9tats des lieux d\u2019entr\u00E9e et de sortie."}</Numbered>

        <Text style={s.articleTitle}>{"ARTICLE VIII \u2014 OBLIGATIONS DU BAILLEUR"}</Text>
        <Text style={s.body}>{"Le bailleur s\u2019engage \u00E0 :"}</Text>
        <Numbered n={1}>Assurer la jouissance paisible du logement ;</Numbered>
        <Numbered n={2}>{"Maintenir les lieux en bon \u00E9tat de r\u00E9paration et de viabilit\u00E9 ;"}</Numbered>
        <Numbered n={3}>{"Fournir les services d\u00E9crits \u00E0 l\u2019article II ;"}</Numbered>
        <Numbered n={4}>{"R\u00E9pondre aux demandes d\u2019entretien dans un d\u00E9lai raisonnable (max 48h) ;"}</Numbered>
        <Numbered n={5}>{"Respecter la vie priv\u00E9e du locataire et donner un pr\u00E9avis de 48h avant visite."}</Numbered>

        <Text style={s.articleTitle}>{"ARTICLE IX \u2014 \u00C9TAT DES LIEUX"}</Text>
        <Text style={s.body}>
          {"L\u2019\u00E9tat des lieux d\u2019entr\u00E9e et de sortie sera \u00E9tabli par la soci\u00E9t\u00E9 Nockee, prestataire mandat\u00E9 par le bailleur. Le locataire re\u00E7oit un exemplaire."}
        </Text>

        {!property.is_coliving && (
          <View>
            <Text style={s.articleTitle}>{"ARTICLE X \u2014 INVENTAIRE DU MOBILIER"}</Text>
            <Text style={s.body}>
              {"L\u2019inventaire d\u00E9taill\u00E9 du mobilier et des \u00E9quipements fournis est joint en annexe au pr\u00E9sent contrat. Le locataire s\u2019engage \u00E0 en prendre soin et \u00E0 le restituer en bon \u00E9tat."}
            </Text>
          </View>
        )}

        <Text style={s.articleTitle}>{property.is_coliving ? "ARTICLE X \u2014 DIAGNOSTICS TECHNIQUES" : "ARTICLE XI \u2014 DIAGNOSTICS TECHNIQUES"}</Text>
        <Text style={s.body}>
          {"Conform\u00E9ment \u00E0 la r\u00E9glementation fran\u00E7aise, le bailleur fournit au locataire :"}
        </Text>
        <Bullet>{"Diagnostic de Performance \u00C9nerg\u00E9tique (DPE)"}</Bullet>
        <Bullet>{"État du Risque et Pollution (ERP)"}</Bullet>
        <Bullet>{"Constat de Risque d\u2019Exposition au Plomb (CREP)"}</Bullet>
        <Bullet>Diagnostic Amiante</Bullet>
        <Bullet>Diagnostic Bruit</Bullet>

        {property.is_coliving && (
          <View>
            <Text style={s.articleTitle}>{"ARTICLE XI \u2014 R\u00C8GLEMENT INT\u00C9RIEUR"}</Text>
            <Text style={s.body}>
              {"Le locataire accepte le R\u00E8glement Int\u00E9rieur La Villa Coliving (la \u201CBible du Coliver\u201D), joint en annexe, qui pr\u00E9cise les r\u00E8gles de vie commune, l\u2019usage des parties communes et les proc\u00E9dures de gestion interne."}
            </Text>
          </View>
        )}

        <Text style={s.articleTitle}>{property.is_coliving ? "ARTICLE XII \u2014 ANNEXES" : "ARTICLE XII \u2014 ANNEXES"}</Text>
        <Text style={s.body}>{"Sont annex\u00E9es au pr\u00E9sent contrat :"}</Text>
        {!property.is_coliving && <Bullet>{"Inventaire du mobilier et \u00E9quipements"}</Bullet>}
        {property.is_coliving && <Bullet>{"R\u00E8glement Int\u00E9rieur La Villa Coliving"}</Bullet>}
        <Bullet>Diagnostics techniques</Bullet>
        <Bullet>{"Photos d\u2019\u00E9tat des lieux d\u2019entr\u00E9e"}</Bullet>
        {(form.annexe_documents || []).map((doc: string, i: number) => (
          <Bullet key={i}>{doc}</Bullet>
        ))}

        {form.clauses_particulieres?.trim() ? (
          <View>
            <Text style={s.articleTitle}>{"CLAUSES PARTICULI\u00C8RES"}</Text>
            <Text style={s.body}>{form.clauses_particulieres}</Text>
          </View>
        ) : null}

        <View style={s.signatureSection}>
          <View style={s.signatureBox}>
            <Text style={{ fontSize: 9 }}>{"Fait \u00E0 "}{ville}</Text>
            <Text style={s.signatureLabel}>Signature du bailleur</Text>
            <Text style={s.signatureName}>{"J\u00E9r\u00F4me AUSTIN"}</Text>
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
      </Page>
    </Document>
  );
}
