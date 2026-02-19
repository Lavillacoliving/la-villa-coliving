import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Ticket {
  id: string; title: string; description: string;
  status: string; priority: string; category: string;
  property_id: string; room_number: number | null;
  reported_by: string | null; assigned_to: string | null;
  created_at: string; resolved_at: string | null;
}
interface Property { id: string; name: string; slug: string; }

const STATUS_COLORS: Record<string,string> = {
  open: '#ef4444', in_progress: '#eab308', resolved: '#22c55e', closed: '#94a3b8'
};
const PRIO_COLORS: Record<string,string> = {
  urgent: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e'
};

export default function DashboardMaintenancePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [statusFilter, setStatusFilter] = useState("active");
  const [propFilter, setPropFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [tRes,pRes] = await Promise.all([
        supabase.from("maintenance_tickets").select("*").order("created_at",{ascending:false}),
        supabase.from("properties").select("id,name,slug"),
      ]);
      setTickets(tRes.data||[]);
      setProperties(pRes.data||[]);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = tickets
    .filter(t => statusFilter==="active" ? ["open","in_progress"].includes(t.status) : statusFilter==="all" ? true : t.status===statusFilter)
    .filter(t => propFilter==="all" || properties.find(p=>p.id===t.property_id)?.slug===propFilter);

  const openCount = tickets.filter(t=>t.status==="open").length;
  const ipCount = tickets.filter(t=>t.status==="in_progress").length;
  const urgentCount = tickets.filter(t=>t.priority==="urgent"&&t.status!=="resolved"&&t.status!=="closed").length;

  const card={background:"#fff",borderRadius:"12px",padding:"20px",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"};
  const lbl={fontSize:"12px",color:"#888",marginBottom:"4px"};
  const vl={fontSize:"24px",fontWeight:700 as const,color:"#1a1a2e"};

  if(loading) return <p style={{textAlign:"center",padding:"40px",color:"#b8860b"}}>Chargement...</p>;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <div style={{display:"flex",gap:"8px"}}>
          {[{v:"active",l:"Actifs"},{v:"all",l:"Tous"},{v:"resolved",l:"Résolus"},{v:"closed",l:"Fermés"}].map(e=>(
            <button key={e.v} onClick={()=>setStatusFilter(e.v)} style={{
              padding:"6px 14px",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"13px",
              background:statusFilter===e.v?"#b8860b":"#e5e7eb",color:statusFilter===e.v?"#fff":"#555"
            }}>{e.l}</button>))}
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          {[{v:"all",l:"Toutes"},{v:"la-villa",l:"La Villa"},{v:"le-loft",l:"Le Loft"},{v:"le-lodge",l:"Le Lodge"}].map(e=>(
            <button key={e.v} onClick={()=>setPropFilter(e.v)} style={{
              padding:"6px 14px",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"13px",
              background:propFilter===e.v?"#1a1a2e":"#e5e7eb",color:propFilter===e.v?"#fff":"#555"
            }}>{e.l}</button>))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"16px",marginBottom:"24px"}}>
        <div style={card}><p style={lbl}>Tickets ouverts</p><p style={{...vl,color:openCount>0?"#ef4444":"#22c55e"}}>{openCount}</p></div>
        <div style={card}><p style={lbl}>En cours</p><p style={{...vl,color:"#eab308"}}>{ipCount}</p></div>
        <div style={card}><p style={lbl}>Urgents</p><p style={{...vl,color:urgentCount>0?"#ef4444":"#22c55e"}}>{urgentCount}</p></div>
      </div>

      <div style={{...card,padding:0,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"14px"}}>
          <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e5e7eb"}}>
            {["Titre","Propriété","Ch.","Priorité","Statut","Catégorie","Créé le","Assigné"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>))}
          </tr></thead>
          <tbody>
            {filtered.map(t=>{
              const prop=properties.find(p=>p.id===t.property_id);
              return(<tr key={t.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                <td style={{padding:"10px 16px",fontWeight:500,maxWidth:"250px"}}>{t.title}</td>
                <td style={{padding:"10px 16px"}}>{prop?.name||""}</td>
                <td style={{padding:"10px 16px"}}>{t.room_number||"-"}</td>
                <td style={{padding:"10px 16px"}}><span style={{background:PRIO_COLORS[t.priority]||"#94a3b8",color:"#fff",padding:"2px 10px",borderRadius:"12px",fontSize:"12px"}}>{t.priority}</span></td>
                <td style={{padding:"10px 16px"}}><span style={{background:STATUS_COLORS[t.status]||"#94a3b8",color:"#fff",padding:"2px 10px",borderRadius:"12px",fontSize:"12px"}}>{t.status}</span></td>
                <td style={{padding:"10px 16px",fontSize:"12px"}}>{t.category}</td>
                <td style={{padding:"10px 16px",color:"#888",fontSize:"12px"}}>{new Date(t.created_at).toLocaleDateString("fr-FR")}</td>
                <td style={{padding:"10px 16px",color:"#888"}}>{t.assigned_to||"-"}</td>
              </tr>);})}
            {filtered.length===0&&<tr><td colSpan={8} style={{padding:"40px",textAlign:"center",color:"#888"}}>Aucun ticket</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
