import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Expense {
  id: string; entity_id: string; category: string;
  description: string; amount: number; expense_date: string;
  supplier: string | null; payment_method: string | null;
  notes: string | null;
}
interface Entity { id: string; name: string; slug: string; }

function fmt(n: number) { return n.toLocaleString('fr-FR', {minimumFractionDigits:0, maximumFractionDigits:0}); }

export default function DashboardDepensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0,7));
  const [entityFilter, setEntityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const sd = month + "-01"; const ed = month + "-31";
      const [eRes, entRes] = await Promise.all([
        supabase.from("expenses").select("*").gte("expense_date",sd).lte("expense_date",ed).order("expense_date",{ascending:false}),
        supabase.from("entities").select("id,name,slug"),
      ]);
      setExpenses(eRes.data||[]);
      setEntities(entRes.data||[]);
      setLoading(false);
    };
    load();
  }, [month]);

  const filtered = entityFilter==="all" ? expenses : expenses.filter(e=>{
    const ent = entities.find(en=>en.id===e.entity_id); return ent?.slug===entityFilter;
  });

  const total = filtered.reduce((s,e)=>s+e.amount,0);
  const byCategory: Record<string,number> = {};
  filtered.forEach(e => { byCategory[e.category] = (byCategory[e.category]||0) + e.amount; });
  const topCats = Object.entries(byCategory).sort((a,b)=>b[1]-a[1]);

  const prevMonth = () => { const d=new Date(month+"-01"); d.setMonth(d.getMonth()-1); setMonth(d.toISOString().slice(0,7)); };
  const nextMonth = () => { const d=new Date(month+"-01"); d.setMonth(d.getMonth()+1); setMonth(d.toISOString().slice(0,7)); };

  const exportExcel = () => {
    const XLSX=(window as any).XLSX;
    if(!XLSX){alert("SheetJS non charge");return;}
    const rows=filtered.map(e=>({
      Date:e.expense_date,Categorie:e.category,Description:e.description,
      Montant:e.amount,Fournisseur:e.supplier||"",
      Entite:entities.find(en=>en.id===e.entity_id)?.name||"",Notes:e.notes||""
    }));
    const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Depenses");XLSX.writeFile(wb,"depenses_"+month+".xlsx");
  };

  const card={background:"#fff",borderRadius:"12px",padding:"20px",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"};
  const lbl={fontSize:"12px",color:"#888",marginBottom:"4px"};
  const vl={fontSize:"24px",fontWeight:700 as const,color:"#1a1a2e"};

  if(loading) return <p style={{textAlign:"center",padding:"40px",color:"#b8860b"}}>Chargement...</p>;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <button onClick={prevMonth} style={{border:"1px solid #ddd",background:"#fff",borderRadius:"6px",padding:"6px 12px",cursor:"pointer"}}>&larr;</button>
          <h2 style={{margin:0,fontSize:"20px",color:"#1a1a2e"}}>{new Date(month+"-01").toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}</h2>
          <button onClick={nextMonth} style={{border:"1px solid #ddd",background:"#fff",borderRadius:"6px",padding:"6px 12px",cursor:"pointer"}}>&rarr;</button>
        </div>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          {[{v:"all",l:"Toutes"},{v:"sleep-in",l:"Sleep In"},{v:"la-villa-lmp",l:"La Villa"}].map(e=>(
            <button key={e.v} onClick={()=>setEntityFilter(e.v)} style={{
              padding:"6px 14px",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"13px",
              background:entityFilter===e.v?"#b8860b":"#e5e7eb",color:entityFilter===e.v?"#fff":"#555"
            }}>{e.l}</button>))}
          <button onClick={exportExcel} style={{padding:"6px 14px",background:"#1a1a2e",color:"#fff",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"13px"}}>Export Excel</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"16px",marginBottom:"24px"}}>
        <div style={card}><p style={lbl}>Total dépenses</p><p style={vl}>{fmt(total)} EUR</p></div>
        <div style={card}><p style={lbl}>Nb opérations</p><p style={vl}>{filtered.length}</p></div>
        <div style={card}><p style={lbl}>Top catégorie</p><p style={vl}>{topCats[0]?topCats[0][0]:"—"}</p></div>
      </div>

      {/* Category breakdown */}
      {topCats.length>0 && <div style={{...card,marginBottom:"24px"}}>
        <h3 style={{margin:"0 0 12px",fontSize:"16px",color:"#1a1a2e"}}>Répartition par catégorie</h3>
        {topCats.map(([cat,amt])=>(
          <div key={cat} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f0f0f0"}}>
            <span>{cat}</span><span style={{fontWeight:600}}>{fmt(amt)} EUR</span>
          </div>))}
      </div>}

      <div style={{...card,padding:0,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"14px"}}>
          <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e5e7eb"}}>
            {["Date","Catégorie","Description","Montant","Fournisseur","Entité"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>))}
          </tr></thead>
          <tbody>
            {filtered.map(e=>{
              const ent=entities.find(en=>en.id===e.entity_id);
              return(<tr key={e.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                <td style={{padding:"10px 16px",color:"#888"}}>{e.expense_date}</td>
                <td style={{padding:"10px 16px"}}><span style={{background:"#e5e7eb",padding:"2px 8px",borderRadius:"8px",fontSize:"12px"}}>{e.category}</span></td>
                <td style={{padding:"10px 16px"}}>{e.description}</td>
                <td style={{padding:"10px 16px",fontWeight:600}}>{fmt(e.amount)} EUR</td>
                <td style={{padding:"10px 16px",color:"#888"}}>{e.supplier||""}</td>
                <td style={{padding:"10px 16px"}}>{ent?.name||""}</td>
              </tr>);})}
            {filtered.length===0&&<tr><td colSpan={6} style={{padding:"40px",textAlign:"center",color:"#888"}}>Aucune dépense ce mois</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
