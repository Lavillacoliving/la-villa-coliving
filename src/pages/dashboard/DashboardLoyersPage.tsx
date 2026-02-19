import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Payment {
  id: string; tenant_id: string; month: string;
  expected_amount: number; received_amount: number;
  adjusted_amount: number | null; payment_date: string | null;
  status: string; notes: string | null;
}
interface Tenant {
  id: string; first_name: string; last_name: string;
  room_number: number; current_rent: number;
  property_id: string; is_active: boolean;
}
interface Property { id: string; name: string; slug: string; }

const STATUS_COLORS: Record<string,string> = {
  paid: '#22c55e', partial: '#eab308', pending: '#94a3b8', late: '#ef4444'
};

function fmt(n: number) { return n.toLocaleString('fr-FR', {minimumFractionDigits:0, maximumFractionDigits:0}); }

export default function DashboardLoyersPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [month, setMonth] = useState(() => {
    const d = new Date(); return d.toISOString().slice(0,7);
  });
  const [entityFilter, setEntityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [pRes, tRes, prRes] = await Promise.all([
        supabase.from("payments").select("*").eq("month", month),
        supabase.from("tenants").select("*").eq("is_active", true),
        supabase.from("properties").select("id,name,slug"),
      ]);
      setPayments(pRes.data || []);
      setTenants(tRes.data || []);
      setProperties(prRes.data || []);
      setLoading(false);
    };
    load();
  }, [month]);

  const filtered = entityFilter === 'all' ? payments
    : payments.filter(p => {
        const t = tenants.find(t => t.id === p.tenant_id);
        if (!t) return false;
        const prop = properties.find(pr => pr.id === t.property_id);
        return prop?.slug === entityFilter;
      });

  const totalExpected = filtered.reduce((s,p) => s + p.expected_amount, 0);
  const totalReceived = filtered.reduce((s,p) => s + p.received_amount, 0);
  const paidCount = filtered.filter(p => p.status === 'paid').length;
  const lateCount = filtered.filter(p => p.status === 'late').length;
  const rate = filtered.length ? Math.round(paidCount / filtered.length * 100) : 0;

  const prevMonth = () => {
    const d = new Date(month + '-01'); d.setMonth(d.getMonth() - 1);
    setMonth(d.toISOString().slice(0,7));
  };
  const nextMonth = () => {
    const d = new Date(month + '-01'); d.setMonth(d.getMonth() + 1);
    setMonth(d.toISOString().slice(0,7));
  };

  const exportExcel = () => {
    const XLSX = (window as any).XLSX;
    if (!XLSX) { alert('SheetJS non charge'); return; }
    const rows = filtered.map(p => {
      const t = tenants.find(t => t.id === p.tenant_id);
      const prop = properties.find(pr => pr.id === t?.property_id);
      return {
        Mois: p.month, Propriete: prop?.name || '',
        Locataire: t ? t.first_name+' '+t.last_name : '',
        Chambre: t?.room_number || '', Attendu: p.expected_amount,
        Recu: p.received_amount, Statut: p.status, Notes: p.notes||''
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Loyers');
    XLSX.writeFile(wb, 'loyers_'+month+'.xlsx');
  };

  const card = {background:"#fff",borderRadius:"12px",padding:"20px",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"};
  const label = {fontSize:"12px",color:"#888",marginBottom:"4px"};
  const val = {fontSize:"24px",fontWeight:700 as const,color:"#1a1a2e"};

  if (loading) return <p style={{textAlign:"center",padding:"40px",color:"#b8860b"}}>Chargement...</p>;

  return (
    <div>
      {/* Month nav + entity filter */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <button onClick={prevMonth} style={{border:"1px solid #ddd",background:"#fff",borderRadius:"6px",padding:"6px 12px",cursor:"pointer"}}>&larr;</button>
          <h2 style={{margin:0,fontSize:"20px",color:"#1a1a2e"}}>{new Date(month+"-01").toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}</h2>
          <button onClick={nextMonth} style={{border:"1px solid #ddd",background:"#fff",borderRadius:"6px",padding:"6px 12px",cursor:"pointer"}}>&rarr;</button>
        </div>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          {[{v:"all",l:"Tous"},{v:"la-villa",l:"La Villa"},{v:"le-loft",l:"Le Loft"},{v:"le-lodge",l:"Le Lodge"}].map(e=>(
            <button key={e.v} onClick={()=>setEntityFilter(e.v)} style={{
              padding:"6px 14px",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"13px",
              background:entityFilter===e.v?"#b8860b":"#e5e7eb",
              color:entityFilter===e.v?"#fff":"#555",fontWeight:entityFilter===e.v?600:400
            }}>{e.l}</button>
          ))}
          <button onClick={exportExcel} style={{padding:"6px 14px",background:"#1a1a2e",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"13px"}}>Export Excel</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"16px",marginBottom:"24px"}}>
        <div style={card}><p style={label}>Attendu</p><p style={val}>{fmt(totalExpected)} EUR</p></div>
        <div style={card}><p style={label}>Encaisse</p><p style={{...val,color:totalReceived>=totalExpected?"#22c55e":"#ef4444"}}>{fmt(totalReceived)} EUR</p></div>
        <div style={card}><p style={label}>Taux encaissement</p><p style={val}>{rate}%</p></div>
        <div style={card}><p style={label}>Impayes</p><p style={{...val,color:lateCount>0?"#ef4444":"#22c55e"}}>{lateCount}</p></div>
      </div>

      {/* Payments Table */}
      <div style={{...card,padding:0,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"14px"}}>
          <thead>
            <tr style={{background:"#f8f8f8",borderBottom:"2px solid #e5e7eb"}}>
              {["Locataire","Chambre","Propriete","Attendu","Recu","Statut","Date","Notes"].map(h=>(
                <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const t = tenants.find(t => t.id === p.tenant_id);
              const prop = properties.find(pr => pr.id === t?.property_id);
              return (
                <tr key={p.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                  <td style={{padding:"10px 16px"}}>{t ? t.first_name+" "+t.last_name : "?"}</td>
                  <td style={{padding:"10px 16px"}}>{t?.room_number}</td>
                  <td style={{padding:"10px 16px"}}>{prop?.name || ""}</td>
                  <td style={{padding:"10px 16px"}}>{fmt(p.expected_amount)}</td>
                  <td style={{padding:"10px 16px"}}>{fmt(p.received_amount)}</td>
                  <td style={{padding:"10px 16px"}}>
                    <span style={{background:STATUS_COLORS[p.status]||"#94a3b8",color:"#fff",padding:"2px 10px",borderRadius:"12px",fontSize:"12px",fontWeight:600}}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{padding:"10px 16px",color:"#888"}}>{p.payment_date || "-"}</td>
                  <td style={{padding:"10px 16px",color:"#888",maxWidth:"200px",overflow:"hidden",textOverflow:"ellipsis"}}>{p.notes || ""}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{padding:"40px",textAlign:"center",color:"#888"}}>Aucun paiement pour ce mois</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
