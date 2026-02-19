import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Expense {
  transaction_id: string; entity_code: string; entity_name: string;
  month: string; accounting_date: string; label_simple: string;
  label_operation: string; category: string; subcategory: string | null;
  amount: number; reference: string | null; details: string | null;
}

function fmt(n: number) { return n.toLocaleString('fr-FR', {minimumFractionDigits:0, maximumFractionDigits:2}); }

export default function DashboardDepensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0,7));
  const [entityFilter, setEntityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const {data} = await supabase.from("v_monthly_expenses").select("*").eq("month",month).order("accounting_date",{ascending:false});
      setExpenses(data||[]);
      setLoading(false);
    };
    load();
  }, [month]);

  const filtered = entityFilter==="all" ? expenses : expenses.filter(e=>e.entity_code===entityFilter);

  const total = filtered.reduce((s,e)=>s+e.amount,0);
  const byCategory: Record<string,number> = {};
  filtered.forEach(e => { byCategory[e.category] = (byCategory[e.category]||0) + e.amount; });
  const topCats = Object.entries(byCategory).sort((a,b)=>b[1]-a[1]);

  const prevMonth=()=>{const d=new Date(month+"-01");d.setMonth(d.getMonth()-1);setMonth(d.toISOString().slice(0,7));};
  const nextMonth=()=>{const d=new Date(month+"-01");d.setMonth(d.getMonth()+1);setMonth(d.toISOString().slice(0,7));};

  const exportExcel=()=>{
    const XLSX=(window as any).XLSX;
    if(!XLSX){alert("SheetJS");return;}
    const rows=filtered.map(e=>({Date:e.accounting_date,Fournisseur:e.label_simple,
      Operation:e.label_operation,Categorie:e.category,Montant:e.amount,Entite:e.entity_name,Ref:e.reference||""}));
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
          {[{v:"all",l:"Toutes"},{v:"SCI",l:"Sleep In"},{v:"LMP",l:"La Villa"},{v:"MB",l:"Mont-Blanc"}].map(e=>(
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

      {topCats.length>0 && <div style={{...card,marginBottom:"24px"}}>
        <h3 style={{margin:"0 0 12px",fontSize:"16px",color:"#1a1a2e"}}>Par catégorie</h3>
        {topCats.map(([cat,amt])=>(
          <div key={cat} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f0f0f0"}}>
            <span>{cat}</span><span style={{fontWeight:600}}>{fmt(amt)} EUR</span>
          </div>))}
      </div>}

      <div style={{...card,padding:0,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"14px"}}>
          <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e5e7eb"}}>
            {["Date","Fournisseur","Opération","Catégorie","Montant","Entité"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>))}
          </tr></thead>
          <tbody>
            {filtered.map(e=>(
              <tr key={e.transaction_id} style={{borderBottom:"1px solid #f0f0f0"}}>
                <td style={{padding:"10px 16px",color:"#888"}}>{e.accounting_date}</td>
                <td style={{padding:"10px 16px",fontWeight:500}}>{e.label_simple}</td>
                <td style={{padding:"10px 16px",fontSize:"12px",maxWidth:"250px",overflow:"hidden",textOverflow:"ellipsis"}}>{e.label_operation}</td>
                <td style={{padding:"10px 16px"}}><span style={{background:"#e5e7eb",padding:"2px 8px",borderRadius:"8px",fontSize:"12px"}}>{e.category}</span></td>
                <td style={{padding:"10px 16px",fontWeight:600}}>{fmt(e.amount)} EUR</td>
                <td style={{padding:"10px 16px"}}>{e.entity_name}</td>
              </tr>))}
            {filtered.length===0&&<tr><td colSpan={6} style={{padding:"40px",textAlign:"center",color:"#888"}}>Aucune dépense ce mois</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
