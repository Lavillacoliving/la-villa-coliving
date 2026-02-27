import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

interface QuittanceData {
  // Bailleur
  bailleur_name: string;
  bailleur_address: string;
  bailleur_siret: string;
  // Locataire
  locataire_name: string;
  // Bien
  property_name: string;
  property_address: string;
  room_number: string;
  is_coliving: boolean;
  // Paiement
  month_label: string;      // "Février 2026"
  period_start: string;     // "01/02/2026"
  period_end: string;       // "28/02/2026"
  loyer_nu: number;         // rent minus charges
  charges: number;          // charges forfaitaires
  total: number;            // total received
  payment_date: string;     // date of payment
  // Meta
  generated_date: string;   // date of generation
}

const S = StyleSheet.create({
  page: { padding: 50, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30, borderBottom: "2 solid #b8860b", paddingBottom: 15 },
  logo: { width: 140, marginRight: 15 },
  headerText: { flex: 1, justifyContent: "center" },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#b8860b", marginTop: 20 },
  subtitle: { fontSize: 11, color: "#666" },
  grid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  col: { width: "45%" },
  colRight: { width: "45%", paddingLeft: 30 },
  label: { fontSize: 8, color: "#999", textTransform: "uppercase", marginBottom: 3, letterSpacing: 0.5 },
  value: { fontSize: 10, marginBottom: 2 },
  valueBold: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  valueColor: { fontSize: 10, color: "#333", marginBottom: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 10, color: "#333" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottom: "0.5 solid #eee" },
  rowLabel: { fontSize: 10, color: "#555" },
  rowValue: { fontSize: 10, textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderTop: "1.5 solid #b8860b", marginTop: 4 },
  totalLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
  totalValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#b8860b" },
  attestation: { marginTop: 30, padding: 15, backgroundColor: "#faf9f7", borderRadius: 4 },
  attestText: { fontSize: 10.5, lineHeight: 1.5, color: "#444" },
  attestAddress: { fontSize: 10.5, lineHeight: 1.5, color: "#444", fontFamily: "Helvetica-Bold", paddingLeft: 60 },
  signatureImage: { width: 120, height: 66, marginTop: 8, alignSelf: "flex-end" as const, marginRight: 30 },
  footer: { position: "absolute", bottom: 30, left: 50, right: 50, borderTop: "0.5 solid #ddd", paddingTop: 8 },
  footerText: { fontSize: 7, color: "#999", textAlign: "center" },
  period: { marginBottom: 20, padding: 12, backgroundColor: "#f8f6f0", borderRadius: 4, borderLeft: "3 solid #b8860b" },
  periodText: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#333" },
});

function fmt(n: number): string {
  const fixed = n.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return formatted + "," + decPart + " \u20AC";
}

// Split "8 rue du Mont-Blanc – 74100 Annemasse – France" into structured lines
function parseAddress(addr: string): { street: string; cityZip: string; country: string } {
  // Try splitting by " – " or " - "
  const parts = addr.split(/\s*[\u2013\u2014-]\s*/);
  if (parts.length >= 3) {
    return { street: parts[0], cityZip: parts[1], country: parts[2] };
  }
  if (parts.length === 2) {
    return { street: parts[0], cityZip: parts[1], country: "France" };
  }
  // Fallback: try to extract zip code pattern
  const match = addr.match(/^(.+?),?\s+(\d{5}\s+.+?)(?:,?\s+(France))?$/i);
  if (match) {
    return { street: match[1], cityZip: match[2], country: match[3] || "France" };
  }
  return { street: addr, cityZip: "", country: "France" };
}

// Split "34 rue du Foron, 74100 Ville-la-Grand" into street + cityZip
function parsePropertyAddress(addr: string): { street: string; cityZip: string } {
  const match = addr.match(/^(.+?),\s*(\d{5}\s+.+)$/);
  if (match) {
    return { street: match[1] + ",", cityZip: match[2] };
  }
  return { street: addr, cityZip: "" };
}

export function QuittancePDF({ data }: { data: QuittanceData }) {
  const bailleurAddr = parseAddress(data.bailleur_address);
  const propAddr = parsePropertyAddress(data.property_address);

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* Header with logo */}
        <View style={S.header}>
          <Image style={S.logo} src="https://www.lavillacoliving.com/logos/NEW Logo La Villa-18.png" />
          <View style={S.headerText}>
            <Text style={S.title}>Quittance de Loyer</Text>
          </View>
        </View>

        {/* Period */}
        <View style={S.period}>
          <Text style={S.periodText}>
            {"P\u00E9riode : " + data.month_label + " (du " + data.period_start + " au " + data.period_end + ")"}
          </Text>
        </View>

        {/* Bailleur / Locataire */}
        <View style={S.grid}>
          <View style={S.col}>
            <Text style={S.label}>Bailleur</Text>
            <Text style={S.valueBold}>{data.bailleur_name}</Text>
            <Text style={S.valueColor}>{bailleurAddr.street}</Text>
            <Text style={S.valueColor}>{bailleurAddr.cityZip}</Text>
            <Text style={S.valueColor}>{bailleurAddr.country}</Text>
            {data.bailleur_siret ? <Text style={S.value}>{"SIRET : " + data.bailleur_siret}</Text> : null}
          </View>
          <View style={S.colRight}>
            <Text style={S.label}>Locataire</Text>
            <Text style={S.valueBold}>{data.locataire_name}</Text>
            {data.is_coliving ? (
              <>
                <Text style={S.valueColor}>{data.bailleur_name + " - " + data.property_name}</Text>
                <Text style={S.valueColor}>{"Chambre " + data.room_number}</Text>
              </>
            ) : (
              <Text style={S.valueColor}>{data.property_name}</Text>
            )}
            <Text style={S.valueColor}>{propAddr.street}</Text>
            <Text style={S.valueColor}>{propAddr.cityZip}</Text>
            <Text style={S.valueColor}>France</Text>
          </View>
        </View>

        {/* Detail du paiement */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>{"D\u00E9tail du paiement"}</Text>
          <View style={S.row}>
            <Text style={S.rowLabel}>Loyer nu</Text>
            <Text style={S.rowValue}>{fmt(data.loyer_nu)}</Text>
          </View>
          <View style={S.row}>
            <Text style={S.rowLabel}>Charges forfaitaires</Text>
            <Text style={S.rowValue}>{fmt(data.charges)}</Text>
          </View>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>{"Total re\u00E7u"}</Text>
            <Text style={S.totalValue}>{fmt(data.total)}</Text>
          </View>
        </View>

        {/* Payment date */}
        <View style={{ marginBottom: 10 }}>
          <Text style={S.value}>{"Date de paiement : " + data.payment_date}</Text>
        </View>

        {/* Attestation */}
        <View style={S.attestation}>
          <Text style={S.attestText}>
            {"Je soussign\u00E9(e), repr\u00E9sentant(e) de " + data.bailleur_name + ", reconnais avoir re\u00E7u de " + data.locataire_name + " la somme de " + fmt(data.total) + " au titre du loyer et des charges forfaitaires pour la p\u00E9riode du " + data.period_start + " au " + data.period_end + ", pour le logement situ\u00E9 :"}
          </Text>
          {data.is_coliving ? (
            <>
              <Text style={S.attestAddress}>{data.property_name}</Text>
              <Text style={S.attestAddress}>{"Chambre " + data.room_number}</Text>
            </>
          ) : (
            <Text style={S.attestAddress}>{data.property_name}</Text>
          )}
          <Text style={S.attestAddress}>{propAddr.street}</Text>
          <Text style={S.attestAddress}>{propAddr.cityZip + ","}</Text>
          <Text style={S.attestAddress}>France</Text>

          <Text style={[S.attestText, { marginTop: 15 }]}>
            {"Cette quittance annule tous les re\u00E7us qui auraient pu \u00EAtre \u00E9tablis pr\u00E9c\u00E9demment en cas de paiement partiel du montant ci-dessus. Elle ne pr\u00E9juge pas des sommes restant dues au titre de loyers pr\u00E9c\u00E9dents impay\u00E9s."}
          </Text>

          <Text style={[S.attestText, { marginTop: 20, fontFamily: "Helvetica-Bold" }]}>
            {"Fait \u00E0 Annemasse, le " + data.generated_date}
          </Text>
          <Image style={S.signatureImage} src="https://www.lavillacoliving.com/images/signature-jerome.png" />
          <Text style={[S.attestText, { textAlign: "right", paddingRight: 30, marginTop: 4 }]}>
            {"J\u00E9r\u00F4me Austin"}
          </Text>
          <Text style={[S.attestText, { textAlign: "right", paddingRight: 30 }]}>
            {data.bailleur_name}
          </Text>
        </View>

        {/* Footer */}
        <View style={S.footer}>
          <Text style={S.footerText}>
            {"Document g\u00E9n\u00E9r\u00E9 automatiquement par La Villa Coliving \u2014 " + data.bailleur_name + (data.bailleur_siret ? " \u2014 SIRET " + data.bailleur_siret : "")}
          </Text>
          <Text style={S.footerText}>
            {"Conform\u00E9ment \u00E0 la loi n\u00B089-462 du 6 juillet 1989 (art. 21) \u2014 www.lavillacoliving.com"}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
