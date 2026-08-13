import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { logAudit } from '@/lib/auditLog';
import { resolveCharges } from '@/lib/charges';
import { pdf, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

interface Props { tenant: any; propertyName: string; onApplied?: () => void; }

const fmt = (n:number) => n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';

const S = StyleSheet.create({
  page: { padding: 60, fontSize: 10.5, fontFamily: 'Helvetica', lineHeight: 1.5, color: '#1a1a2e' },
  brand: { fontSize: 15, color: '#b8860b', fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  grey: { fontSize: 9, color: '#666666' },
  right: { textAlign: 'right', marginTop: 20 },
  obj: { fontFamily: 'Helvetica-Bold', fontSize: 11, marginTop: 24, marginBottom: 14 },
  p: { marginBottom: 8 },
  li: { marginLeft: 18, marginBottom: 2 },
  bold: { fontFamily: 'Helvetica-Bold' },
  foot: { position: 'absolute', bottom: 40, left: 60, right: 60, fontSize: 8.5, color: '#666666' },
});

function LetterPDF({ tenant, propertyName, calc }: { tenant:any, propertyName:string, calc:any }) {
  const today = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <Text style={S.brand}>La Villa Coliving</Text>
        <Text style={S.grey}>{propertyName}</Text>
        <Text style={{ marginTop: 30, fontFamily: 'Helvetica-Bold' }}>{tenant.first_name} {tenant.last_name}</Text>
        <Text>Chambre {tenant.room_number} — {propertyName}</Text>
        <Text style={S.right}>{today}</Text>
        <Text style={S.obj}>Objet : Notification de révision annuelle du loyer (IRL)</Text>
        <Text style={S.p}>Bonjour {tenant.first_name},</Text>
        <Text style={S.p}>Nous espérons que vous vous sentez pleinement chez vous au sein de La Villa Coliving et que votre expérience au quotidien continue d'y être agréable !</Text>
        <Text style={S.p}>Dans le cadre du fonctionnement normal de votre contrat de location, nous souhaitions vous informer de l'actualisation annuelle de votre loyer, conformément aux dispositions prévues dans votre bail et à l'indice de référence des loyers (IRL) publié par l'INSEE.</Text>
        <Text style={S.p}>Sur la base de l'indice suivant :</Text>
        <Text style={S.li}>• Indice de référence : IRL — T{calc.quarter} {calc.newYear}</Text>
        <Text style={S.li}>• Ancien indice ({calc.newYear-1}) : {calc.oldIndex.toFixed(2).replace('.', ',')}</Text>
        <Text style={S.li}>• Nouvel indice ({calc.newYear}) : {calc.newIndex.toFixed(2).replace('.', ',')}</Text>
        <Text style={{ ...S.p, marginTop: 8 }}>L'augmentation est applicable à partir du {calc.anniversaryStr} et est redevable à compter du loyer du mois de {calc.effectiveMonth}.</Text>
        <Text style={S.p}>Votre loyer sera ajusté comme suit :</Text>
        <Text style={S.li}>• Loyer actuel charges incluses : {fmt(calc.oldRent)}</Text>
        <Text style={{ ...S.li, fontFamily: 'Helvetica-Bold' }}>• Nouveau loyer charges incluses : {fmt(calc.newRent)}</Text>
        <Text style={S.li}>• Évolution mensuelle : +{fmt(calc.newRent - calc.oldRent)} (+{calc.pct.toFixed(2).replace('.', ',')} %)</Text>
        <Text style={{ ...S.p, marginTop: 8 }}>Nous tenons à souligner que cette révision est strictement encadrée par la réglementation et qu'elle reste modérée, afin de préserver l'équilibre entre qualité de vie et accessibilité.</Text>
        <Text style={S.p}>Nous vous remercions sincèrement pour la confiance que vous nous accordez. Nous restons bien entendu à votre écoute pour toute question ou échange.</Text>
        <Text style={{ marginTop: 12 }}>Bien chaleureusement,</Text>
        <Text style={{ marginTop: 20, fontFamily: 'Helvetica-Bold' }}>Jérôme Austin</Text>
        <Text>La Villa Coliving</Text>
        <Text style={S.foot}>La Villa Coliving — lavillacoliving.com — contact@lavillacoliving.com</Text>
      </Page>
    </Document>
  );
}

export default function IRLRevisionCard({ tenant, propertyName, onApplied }: Props) {
  const toast = useToast();
  const [indices, setIndices] = useState<{year:number,quarter:number,value:number}[]>([]);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    supabase.from('irl_indices').select('year,quarter,value').order('year').order('quarter')
      .then(({data}) => setIndices((data||[]).map(d=>({...d, value:Number(d.value)}))));
  }, []);

  if (!tenant.move_in_date) return <p style={{color:'#888',padding:'20px'}}>Pas de date d'entrée renseignée — impossible de calculer l'anniversaire du bail.</p>;
  if (indices.length === 0) return <p style={{color:'#888',padding:'20px'}}>Chargement des indices IRL…</p>;

  // Anniversaire du bail (jour/mois de la date d'entrée)
  const moveIn = new Date(tenant.move_in_date);
  const now = new Date();
  let anniv = new Date(now.getFullYear(), moveIn.getMonth(), moveIn.getDate());
  if (anniv < now) anniv = new Date(now.getFullYear()+1, moveIn.getMonth(), moveIn.getDate());
  const daysUntil = Math.ceil((anniv.getTime() - now.getTime()) / 86400000);
  const tooRecent = (now.getTime() - moveIn.getTime()) / 86400000 < 300;

  // Dernier indice publié + même trimestre année précédente
  const latest = indices[indices.length - 1];
  const old = indices.find(i => i.year === latest.year - 1 && i.quarter === latest.quarter);
  if (!old) return <p style={{color:'#888',padding:'20px'}}>Indice IRL de référence manquant en base (T{latest.quarter} {latest.year-1}).</p>;

  const oldRent = Number(tenant.current_rent);
  // Bail au forfait (2026-09) : seule l'assiette LOYER NU est indexable IRL —
  // le forfait de charges est fige au contrat. Les baux legacy gardent le
  // calcul historique (charges comprises).
  const { total: chargesFixes, isLegacy: chargesLegacy } = resolveCharges(tenant);
  const facteurIRL = latest.value / old.value;
  const newRent = chargesLegacy
    ? Math.round(oldRent * facteurIRL * 100) / 100
    : Math.round((Math.max(0, oldRent - chargesFixes) * facteurIRL + chargesFixes) * 100) / 100;
  const pct = (latest.value / old.value - 1) * 100;
  const effectiveMonth = new Date(anniv.getFullYear(), anniv.getMonth() + (anniv.getDate() > 1 ? 1 : 0), 1)
    .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const calc = {
    quarter: latest.quarter, newYear: latest.year, newIndex: latest.value, oldIndex: old.value,
    oldRent, newRent, pct,
    anniversaryStr: anniv.toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }),
    effectiveMonth,
  };

  const emailText = `Objet : ${propertyName} - Ch${tenant.room_number} - Évolution annuelle de votre loyer – information

Bonjour ${tenant.first_name},

Nous espérons que vous vous sentez pleinement chez vous au sein de La Villa Coliving et que votre expérience au quotidien continue d'y être agréable !

Dans le cadre du fonctionnement normal de votre contrat de location, nous souhaitions vous informer de l'actualisation annuelle de votre loyer, conformément aux dispositions prévues dans votre bail et à l'indice de référence des loyers (IRL) publié par l'INSEE.

Sur la base de l'indice suivant :
- Indice de référence : IRL – T${calc.quarter} ${calc.newYear}
- Ancien indice (${calc.newYear-1}) : ${calc.oldIndex.toFixed(2).replace('.', ',')}
- Nouvel indice (${calc.newYear}) : ${calc.newIndex.toFixed(2).replace('.', ',')}

L'augmentation est applicable à partir du ${calc.anniversaryStr} et est redevable à compter du loyer du mois de ${calc.effectiveMonth}. Votre loyer sera ajusté comme suit :
- Loyer actuel charges incluses : ${fmt(oldRent)}
- Nouveau loyer charges incluses : ${fmt(newRent)}
- Évolution mensuelle : +${fmt(newRent - oldRent)} (+${pct.toFixed(2).replace('.', ',')} %)

Nous tenons à souligner que cette révision est strictement encadrée par la réglementation et qu'elle reste modérée, afin de préserver l'équilibre entre qualité de vie et accessibilité.

Nous vous remercions sincèrement pour la confiance que vous nous accordez. Nous restons bien entendu à votre écoute pour toute question ou échange.

Bien chaleureusement,

Jérôme Austin
La Villa Coliving`;

  const downloadPdf = async () => {
    const blob = await pdf(<LetterPDF tenant={tenant} propertyName={propertyName} calc={calc} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Courrier_IRL_${tenant.last_name}_${tenant.first_name}_${anniv.toISOString().slice(0,10)}.pdf`;
    a.click(); URL.revokeObjectURL(url);
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(emailText);
    toast.success('Email copié dans le presse-papier ✓');
  };

  const applyRent = async () => {
    if (!window.confirm(`Appliquer le nouveau loyer de ${fmt(newRent)} (au lieu de ${fmt(oldRent)}) sur la fiche de ${tenant.first_name} ?\nLe payment du mois en cours n'est pas modifié — le nouveau montant s'appliquera à la génération de ${effectiveMonth}.`)) return;
    setApplying(true);
    const note = ` | Révision IRL T${calc.quarter} ${calc.newYear} (${calc.oldIndex}→${calc.newIndex}, +${pct.toFixed(2)}%) : ${oldRent} → ${newRent} €, applicable ${calc.anniversaryStr}, redevable dès ${effectiveMonth} (via dashboard)`;
    const { error } = await supabase.from('tenants')
      .update({ current_rent: newRent, notes: (tenant.notes || '') + note })
      .eq('id', tenant.id);
    setApplying(false);
    if (error) { toast.error('Erreur : ' + error.message); return; }
    await logAudit('irl_revision_applied', 'tenant', tenant.id, { name: `${tenant.first_name} ${tenant.last_name}`, from: oldRent, to: newRent, index: `T${calc.quarter} ${calc.newYear}` });
    toast.success(`Loyer mis à jour : ${fmt(newRent)} ✓`);
    onApplied && onApplied();
  };

  const urgent = daysUntil <= 60;
  const box = { background:'#fff', border:'1px solid '+(urgent?'#b8860b':'#e5e7eb'), borderRadius:'10px', padding:'16px', marginBottom:'12px' };
  const btn = { padding:'8px 16px', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:600 as const };

  return (
    <div>
      <div style={{...box, background: urgent ? '#fdf6e3' : '#fff'}}>
        <p style={{margin:'0 0 4px', fontSize:'14px', fontWeight:700, color:'#1a1a2e'}}>
          {urgent ? '🔔 ' : ''}Anniversaire du bail : {calc.anniversaryStr} <span style={{color:'#888', fontWeight:400}}>(dans {daysUntil} j — base : date d'entrée)</span>
        </p>
        {tooRecent && <p style={{margin:'4px 0 0', fontSize:'13px', color:'#b45309'}}>⚠️ Locataire présent depuis moins d'un an — vérifier que la 1ère révision est bien applicable.</p>}
      </div>
      <div style={box}>
        <p style={{margin:'0 0 8px', fontSize:'13px', color:'#555'}}>Indice : IRL T{calc.quarter} {calc.newYear} = <b>{calc.newIndex.toFixed(2).replace('.', ',')}</b> (vs {calc.oldIndex.toFixed(2).replace('.', ',')} en {calc.newYear-1}, +{pct.toFixed(2).replace('.', ',')} %)</p>
        <p style={{margin:0, fontSize:'16px', color:'#1a1a2e'}}>
          {fmt(oldRent)} → <b style={{color:'#b8860b'}}>{fmt(newRent)}</b> <span style={{fontSize:'13px', color:'#16a34a'}}>(+{fmt(newRent-oldRent)}/mois)</span>
        </p>
        <p style={{margin:'6px 0 0', fontSize:'12px', color:'#888'}}>Applicable au {calc.anniversaryStr}, redevable à compter du loyer de {effectiveMonth}.</p>
      </div>
      <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
        <button onClick={downloadPdf} style={{...btn, background:'#3D4A38', color:'#fff'}}>📄 Télécharger le courrier (PDF)</button>
        <button onClick={copyEmail} style={{...btn, background:'#b8860b', color:'#fff'}}>✉️ Copier l'email</button>
        <button onClick={applyRent} disabled={applying} style={{...btn, background:'#fff', color:'#3D4A38', border:'2px solid #3D4A38'}}>{applying ? '…' : `✓ Appliquer ${fmt(newRent)} à la fiche`}</button>
      </div>
      <p style={{marginTop:'10px', fontSize:'11px', color:'#999'}}>Indices INSEE stockés dans la table irl_indices (dernier : T{calc.quarter} {calc.newYear}). Pensez à ajouter le nouveau trimestre après chaque publication INSEE (mi-janvier, mi-avril, mi-juillet, mi-octobre).</p>
    </div>
  );
}
