import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Tenant {
  id: string; first_name: string; last_name: string;
  email: string; phone: string; room_number: number;
  current_rent: number; property_id: string; is_active: boolean;
  move_in_date: string; move_out_date: string | null;
  deposit_amount: number; notes: string | null;
}
interface Property { id: string; name: string; slug: string; }

export default function DashboardLocatairesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [tRes, pRes] = await Promise.all([
        supabase.from('tenants').select('*').order('room_number'),
        supabase.from('properties').select('id,name,slug'),
      ]);
      setTenants(tRes.data || []);
      setProperties(pRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = tenants
    .filter(t => showInactive || t.is_active)
    .filter(t => {
      if (filter === 'all') return true;
      const prop = properties.find(p => p.id === t.property_id);
      return prop?.slug === filter;
    });

  const activeCount = tenants.filter(t => t.is_active).length;
  const totalRent = filtered.filter(t => t.is_active).reduce((s,t) => s + t.current_rent, 0);
  const exportExcel = () => {
    const XLSX=(window as any).XLSX;
    if(!XLSX)return;
    const rows=filtered.map(t=>{const p=properties.find(p=>p.id===t.property_id);return{Nom:t.first_name+" "+t.last_name,
      Ch:t.room_number,Prop:p?.name||"",Loyer:t.current_rent,Entree:t.move_in_date||"",Email:t.email,Tel:t.phone};});
    const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Locataires");XLSX.writeFile(wb,"locataires.xlsx");
  };

    const card = {background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'};
  const label = {fontSize:'12px',color:'#888',marginBottom:'4px'};
  const val = {fontSize:'24px',fontWeight:700 as const,color:'#1a1a2e'};

  if (loading) return <p style={{textAlign:'center',padding:'40px',color:'#b8860b'}}>Chargement...</p>;

  return (
    <div>
      {/* Filters */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <div style={{display:"flex",gap:"8px"}}>
          {[{v:"all",l:"Tous"},{v:"la-villa",l:"La Villa"},{v:"le-loft",l:"Le Loft"},{v:"le-lodge",l:"Le Lodge"}].map(e=>(
            <button key={e.v} onClick={()=>setFilter(e.v)} style={{
              padding:"6px 14px",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"13px",
              background:filter===e.v?"#b8860b":"#e5e7eb",color:filter===e.v?"#fff":"#555",fontWeight:filter===e.v?600:400
            }}>{e.l}</button>))}
        </div>
        <label style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"13px",color:"#666",cursor:"pointer"}}>
          <input type="checkbox" checked={showInactive} onChange={e=>setShowInactive(e.target.checked)} /> Afficher inactifs
        </label>
          <button onClick={exportExcel} style={{padding:"6px 14px",background:"#1a1a2e",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"13px",marginLeft:"8px"}}>Export Excel</button>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"16px",marginBottom:"24px"}}>
        <div style={card}><p style={label}>Locataires actifs</p><p style={val}>{activeCount}</p></div>
        <div style={card}><p style={label}>Loyer total mensuel</p><p style={val}>{totalRent.toLocaleString("fr-FR")} EUR</p></div>
        <div style={card}><p style={label}>Affichés</p><p style={val}>{filtered.length}</p></div>
      </div>

      {/* Table */}
      <div style={{...card,padding:0,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"14px"}}>
          <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e5e7eb"}}>
            {["Nom","Chambre","Propriété","Loyer","Entrée","Sortie","Email","Tél","Statut"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(t => {
              const prop = properties.find(p => p.id === t.property_id);
              return (
                <tr key={t.id} style={{borderBottom:"1px solid #f0f0f0",opacity:t.is_active?1:0.5}}>
                  <td style={{padding:"10px 16px",fontWeight:500}}>{t.first_name} {t.last_name}</td>
                  <td style={{padding:"10px 16px"}}>{t.room_number}</td>
                  <td style={{padding:"10px 16px"}}>{prop?.name||""}</td>
                  <td style={{padding:"10px 16px"}}>{t.current_rent} EUR</td>
                  <td style={{padding:"10px 16px",color:"#888"}}>{t.move_in_date||"-"}</td>
                  <td style={{padding:"10px 16px",color:"#888"}}>{t.move_out_date||"-"}</td>
                  <td style={{padding:"10px 16px",fontSize:"12px"}}>{t.email}</td>
                  <td style={{padding:"10px 16px",fontSize:"12px"}}>{t.phone}</td>
                  <td style={{padding:"10px 16px"}}>
                    <span style={{background:t.is_active?"#22c55e":"#94a3b8",color:"#fff",padding:"2px 10px",borderRadius:"12px",fontSize:"12px"}}>
                      {t.is_active?"Actif":"Sorti"}
                    </span></td>
                </tr>);
            })}
            {filtered.length===0 && <tr><td colSpan={9} style={{padding:"40px",textAlign:"center",color:"#888"}}>Aucun locataire</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
