import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

interface AttestationData {
  // Bailleur
  bailleur_name: string;        // "La Villa Coliving"
  bailleur_gerant: string;      // "Jérôme Austin"
  bailleur_structure: string;   // "La Villa LMP" ou "Sleep In SCI"
  bailleur_address: string;     // "34 rue du Foron, 74100 Ville-la-Grand"
  bailleur_siret: string;
  // Locataire
  locataire_civilite: string;   // "M." ou "Mme"
  locataire_name: string;       // "Prénom Nom"
  locataire_birth_date: string; // "12/03/1995"
  locataire_birth_place: string;// "Lyon"
  // Logement
  property_name: string;
  property_address: string;     // "34 rue du Foron, 74100 Ville-la-Grand"
  room_number: string;
  is_coliving: boolean;
  // Bail
  bail_date: string;            // date du contrat (move_in_date)
  occupation_since: string;     // date d'entrée effective
  // Meta
  generated_city: string;       // "Annemasse"
  generated_date: string;       // "27/02/2026"
}

const S = StyleSheet.create({
  page: { padding: 50, fontFamily: "Helvetica", fontSize: 10.5, color: "#1a1a1a", lineHeight: 1.7 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30, borderBottom: "2 solid #b8860b", paddingBottom: 15 },
  logo: { width: 140, marginRight: 15 },
  headerText: { flex: 1, justifyContent: "center" },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#b8860b", marginTop: 20 },
  // Bailleur block
  bailleurBlock: { marginBottom: 30 },
  bailleurLine: { fontSize: 10, color: "#333", marginBottom: 2 },
  bailleurBold: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#1a1a1a", marginBottom: 2 },
  // Object
  objet: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 25, borderBottom: "1 solid #e0e0e0", paddingBottom: 8 },
  // Body
  paragraph: { fontSize: 10.5, marginBottom: 14, textAlign: "justify" },
  paragraphBold: { fontSize: 10.5, marginBottom: 14, textAlign: "justify", fontFamily: "Helvetica-Bold" },
  // Address block in attestation
  addressBlock: { marginTop: 8, marginBottom: 14, paddingLeft: 40 },
  addressLine: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: "#333", marginBottom: 2 },
  // Signature
  signatureBlock: { marginTop: 40 },
  signatureLine: { fontSize: 10.5, marginBottom: 3 },
  signatureBold: { fontSize: 10.5, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  signatureRight: { fontSize: 10.5, textAlign: "right", paddingRight: 30, marginTop: 8 },
  // Footer
  footer: { position: "absolute", bottom: 30, left: 50, right: 50, borderTop: "0.5 solid #ddd", paddingTop: 8 },
  footerText: { fontSize: 7, color: "#999", textAlign: "center" },
});

export function AttestationResidencePDF({ data }: { data: AttestationData }) {
  const logement = data.is_coliving
    ? data.property_name + " \u2014 Chambre " + data.room_number
    : data.property_name;

  // Parse address: "34 rue du Foron, 74100 Ville-la-Grand" → street + cityZip
  const addrMatch = data.property_address.match(/^(.+?),\s*(\d{5}\s+.+)$/);
  const street = addrMatch ? addrMatch[1] : data.property_address;
  const cityZip = addrMatch ? addrMatch[2] : "";

  // Parse bailleur address similarly
  const bAddrMatch = data.bailleur_address.match(/^(.+?),\s*(\d{5}\s+.+)$/);
  const bStreet = bAddrMatch ? bAddrMatch[1] : data.bailleur_address;
  const bCityZip = bAddrMatch ? bAddrMatch[2] : "";

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* Header with logo */}
        <View style={S.header}>
          <Image style={S.logo} src="https://www.lavillacoliving.com/logos/NEW Logo La Villa-18.png" />
          <View style={S.headerText}>
            <Text style={S.title}>{"Attestation de R\u00E9sidence"}</Text>
          </View>
        </View>

        {/* Bailleur info block */}
        <View style={S.bailleurBlock}>
          <Text style={S.bailleurBold}>{data.bailleur_name}</Text>
          <Text style={S.bailleurLine}>{data.bailleur_structure}</Text>
          <Text style={S.bailleurLine}>{bStreet}</Text>
          {bCityZip ? <Text style={S.bailleurLine}>{bCityZip}</Text> : null}
          <Text style={S.bailleurLine}>France</Text>
          {data.bailleur_siret ? <Text style={S.bailleurLine}>{"SIRET : " + data.bailleur_siret}</Text> : null}
        </View>

        {/* Objet */}
        <Text style={S.objet}>
          {"Objet : Attestation de r\u00E9sidence"}
        </Text>

        {/* Corps */}
        <Text style={S.paragraph}>
          {"Je soussign\u00E9 " + data.bailleur_gerant + ", agissant en qualit\u00E9 de bailleur / g\u00E9rant de " + data.bailleur_structure + ", certifie que :"}
        </Text>

        <Text style={S.paragraph}>
          {data.locataire_civilite + " " + data.locataire_name +
            (data.locataire_birth_date ? ", n\u00E9(e) le " + data.locataire_birth_date : "") +
            (data.locataire_birth_place ? " \u00E0 " + data.locataire_birth_place : "") +
            ", occupe \u00E0 titre de r\u00E9sidence le logement situ\u00E9 au :"}
        </Text>

        {/* Adresse structurée */}
        <View style={S.addressBlock}>
          {data.is_coliving && <Text style={S.addressLine}>{logement}</Text>}
          <Text style={S.addressLine}>{street + ","}</Text>
          {cityZip ? <Text style={S.addressLine}>{cityZip}</Text> : null}
          <Text style={S.addressLine}>France</Text>
        </View>

        <Text style={S.paragraph}>
          {"en vertu d\u2019un contrat de location meubl\u00E9e en date du " + data.bail_date + "."}
        </Text>

        <Text style={S.paragraph}>
          {"Cette occupation est effective depuis le " + data.occupation_since + "."}
        </Text>

        <Text style={S.paragraph}>
          {"La pr\u00E9sente attestation est d\u00E9livr\u00E9e pour servir et valoir ce que de droit."}
        </Text>

        {/* Signature */}
        <View style={S.signatureBlock}>
          <Text style={S.signatureBold}>
            {"Fait \u00E0 " + data.generated_city + ", le " + data.generated_date}
          </Text>
          <Text style={[S.signatureRight, { marginTop: 30 }]}>
            {data.bailleur_gerant}
          </Text>
          <Text style={S.signatureRight}>
            {data.bailleur_name}
          </Text>
        </View>

        {/* Footer */}
        <View style={S.footer}>
          <Text style={S.footerText}>
            {"Document g\u00E9n\u00E9r\u00E9 automatiquement par La Villa Coliving \u2014 " + data.bailleur_structure + (data.bailleur_siret ? " \u2014 SIRET " + data.bailleur_siret : "")}
          </Text>
          <Text style={S.footerText}>
            {"www.lavillacoliving.com"}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
