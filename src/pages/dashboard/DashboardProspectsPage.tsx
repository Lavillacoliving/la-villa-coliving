import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Prospect {
  id: string; first_name: string; last_name: string;
  email: string | null; phone: string | null;
  source: string | null; status: string;
  property_interest: string | null; budget: number | null;
  move_in_target: string | null; notes: string | null;
  created_at: string; last_contact: string | null;
}

const STATUS_COLORS: Record<string,string> = {
  new: '#3b82f6', contacted: '#eab308', visit_scheduled: '#8b5cf6',
  visit_done: '#f97316', offer_sent: '#b8860b', signed: '#22c55e',
  lost: '#94a3b8'
};

export default function DashboardProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [statusFilter, setStatusFilter] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const {data} = await supabase.from("prospects").select("*").order("created_at",{ascending:false});
      setProspects(data||[]);
      setLoading(false);
    };
    load();
  }, []);

  const active = ["new","contacted","visit_scheduled","visit_done","offer_sent"];
  const filtered = statusFilter==="active" ? prospects.filter(p=>active.includes(p.status))
    : statusFilter==="all" ? prospects : prospects.filter(p=>p.status===statusFilter);

  const newCount = prospects.filter(p=>p.status==="new").length;
  const visitCount = prospects.filter(p=>["visit_scheduled","visit_done"].includes(p.status)).length;
  const signedCount = prospects.filter(p=>p.status==="signed").length;

  const exportExcel = () => {
    const XLSX=(window as any).XLSX;
    if(!XLSX){alert("SheetJS non charge");return;}
    const rows=filtered.map(p=>({Nom:p.first_name+" "+p.last_name,Email:p.email||"",Tel:p.phone||"",
      Source:p.source||"",Statut:p.status,Interet:p.property_interest||"",
      Budget:p.budget||"",Cible:p.move_in_target||"",Contact:p.last_contact||"",Notes:p.notes||""}));
    const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Prospects");XLSX.writeFile(wb,"prospects.xlsx");
  };

  const card={background:"#fff",borderRadius:"12px",padding:"20px",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"};
  const lbl={fontSize:"12px",color:"#888",marginBottom:"4px"};
  const vl={fontSize:"24px",fontWeight:700 as const,color:"#1a1a2e"};

  if(loading) return <p style={{textAlign:"center",padding:"40px",color:"#b8860b"}}>Chargement...</p>;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <div style={{display:"flex",gap:"8px"}}>
          {[{v:"active",l:"Actifs"},{v:"all",l:"Tous"},{v:"signed",l:"Signés"},{v:"lost",l:"Perdus"}].map(e=>(
            <button key={e.v} onClick={()=>setStatusFilter(e.v)} style={{
              padding:"6px 14px",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"13px",
              background:statusFilter===e.v?"#b8860b":"#e5e7eb",color:statusFilter===e.v?"#fff":"#555"
            }}>{e.l}</button>))}
        </div>
        <button onClick={exportExcel} style={{padding:"6px 14px",background:"#1a1a2e",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"13px"}}>Export Excel</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"16px",marginBottom:"24px"}}>
        <div style={card}><p style={lbl}>Nouveaux</p><p style={{...vl,color:"#3b82f6"}}>{newCount}</p></div>
        <div style={card}><p style={lbl}>Visites</p><p style={{...vl,color:"#8b5cf6"}}>{visitCount}</p></div>
        <div style={card}><p style={lbl}>Signés</p><p style={{...vl,color:"#22c55e"}}>{signedCount}</p></div>
      </div>

      <div style={{...card,padding:0,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"14px"}}>
          <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e5e7eb"}}>
            {["Nom","Source","Statut","Intérêt","Budget","Cible","Dernier contact","Email","Tél"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>))}
          </tr></thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                <td style={{padding:"10px 16px",fontWeight:500}}>{p.first_name} {p.last_name}</td>
                <td style={{padding:"10px 16px",fontSize:"12px"}}>{p.source||"-"}</td>
                <td style={{padding:"10px 16px"}}><span style={{background:STATUS_COLORS[p.status]||"#94a3b8",color:"#fff",padding:"2px 10px",borderRadius:"12px",fontSize:"12px"}}>{p.status}</span></td>
                <td style={{padding:"10px 16px"}}>{p.property_interest||"-"}</td>
                <td style={{padding:"10px 16px"}}>{p.budget?p.budget+" CHF":"-"}</td>
                <td style={{padding:"10px 16px",color:"#888"}}>{p.move_in_target||"-"}</td>
                <td style={{padding:"10px 16px",color:"#888",fontSize:"12px"}}>{p.last_contact?new Date(p.last_contact).toLocaleDateString("fr-FR"):"-"}</td>
                <td style={{padding:"10px 16px",fontSize:"12px"}}>{p.email||"-"}</td>
                <td style={{padding:"10px 16px",fontSize:"12px"}}>{p.phone||"-"}</td>
              </tr>))}
            {filtered.length===0&&<tr><td colSpan={9} style={{padding:"40px",textAlign:"center",color:"#888"}}>Aucun prospect</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
