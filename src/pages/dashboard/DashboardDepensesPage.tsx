import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Expense {
  transaction_id: string; entity_code: string; entity_name: string;
  month: string; accounting_date: string; label_simple: string;
  label_operation: string; category: string; subcategory: string|null;
  amount: number; reference: string|null; details: string|null;
}

function fmt(n:number) { return n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }

const ENTITY_BADGES: Record<string,{bg:string,color:string}> = {
  LMP:{bg:'#dcfce7',color:'#166534'}, SCI:{bg:'#E8E4FF',color:'#5A52B5'}, MB:{bg:'#FFF3E0',color:'#E65100'}
};

export default function DashboardDepensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0,7));
  const [entityFilter, setEntityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const {data} = await supabase.from('v_monthly_expenses').select('*').eq('month',month).order('accounting_date',{ascending:false});
      setExpenses(data||[]);
      setLoading(false);
    };
    load();
  },[month]);

  let filtered = entityFilter==='all' ? expenses : expenses.filter(e=>e.entity_code===entityFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(e => e.label_simple.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || (e.details||'').toLowerCase().includes(q) || e.label_operation.toLowerCase().includes(q));
  }

  const total = filtered.reduce((s,e)=>s+e.amount,0);
  const lmpTotal = filtered.filter(e=>e.entity_code==='LMP').reduce((s,e)=>s+e.amount,0);
  const sciTotal = filtered.filter(e=>e.entity_code==='SCI').reduce((s,e)=>s+e.amount,0);
  const mbTotal = filtered.filter(e=>e.entity_code==='MB').reduce((s,e)=>s+e.amount,0);
  const categories = [...new Set(filtered.map(e=>e.category))];

  // Category breakdown per entity
  const entitiesForBreakdown = entityFilter==='all' ? ['LMP','SCI','MB'] : [entityFilter];
  const breakdowns: {entity:string,label:string,cats:{name:string,total:number,count:number}[]}[] = [];
  entitiesForBreakdown.forEach(ec => {
    const entData = filtered.filter(e=>e.entity_code===ec);
    if (entData.length===0) return;
    const catMap: Record<string,{total:number,count:number}> = {};
    entData.forEach(e => { if(!catMap[e.category]) catMap[e.category]={total:0,count:0}; catMap[e.category].total+=e.amount; catMap[e.category].count++; });
    const sorted = Object.entries(catMap).sort((a,b)=>b[1].total-a[1].total).map(([n,d])=>({name:n,...d}));
    const label = ec==='LMP'?'La Villa (LMP)':ec==='SCI'?'Sleep In (SCI)':'Mont-Blanc (NP)';
    breakdowns.push({entity:ec,label,cats:sorted});
  });

  const prevMonth=()=>{const d=new Date(month+'-01');d.setMonth(d.getMonth()-1);setMonth(d.toISOString().slice(0,7));};
  const nextMonth=()=>{const d=new Date(month+'-01');d.setMonth(d.getMonth()+1);setMonth(d.toISOString().slice(0,7));};
  const exportExcel=()=>{
    const XLSX=(window as any).XLSX; if(!XLSX){alert('SheetJS');return;}
    const rows=filtered.map(e=>({Date:e.accounting_date,Fournisseur:e.label_simple,Opération:e.label_operation,Catégorie:e.category,Montant:e.amount,Entité:e.entity_name,Réf:e.reference||''}));
    const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Dépenses');XLSX.writeFile(wb,'depenses_'+month+'.xlsx');
  };

  const S = {
    card:{background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'},
    label:{fontSize:'12px',color:'#888',marginBottom:'4px',textTransform:'uppercase' as const},
    val:{fontSize:'28px',fontWeight:800 as const,color:'#1a1a2e'},
    sub:{fontSize:'12px',color:'#999',marginTop:'4px'},
    btn:{padding:'6px 14px',border:'none',borderRadius:'20px',cursor:'pointer',fontSize:'13px'},
  };

  if(loading) return <p style={{textAlign:'center',padding:'40px',color:'#b8860b'}}>Chargement...</p>;

  return (
    <div>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <button onClick={prevMonth} style={{border:'1px solid #ddd',background:'#fff',borderRadius:'6px',padding:'6px 12px',cursor:'pointer',fontSize:'16px'}}>←</button>
          <h2 style={{margin:0,fontSize:'20px',color:'#1a1a2e'}}>{new Date(month+'-01').toLocaleDateString('fr-FR',{month:'long',year:'numeric'}).replace(/^\w/,c=>c.toUpperCase())}</h2>
          <button onClick={nextMonth} style={{border:'1px solid #ddd',background:'#fff',borderRadius:'6px',padding:'6px 12px',cursor:'pointer',fontSize:'16px'}}>→</button>
        </div>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
          {[{v:'all',l:'Toutes les entités'},{v:'LMP',l:'La Villa (LMP)'},{v:'SCI',l:'Sleep In (SCI)'},{v:'MB',l:'Mont-Blanc (NP)'}].map(e=>(
            <button key={e.v} onClick={()=>setEntityFilter(e.v)} style={{...S.btn,background:entityFilter===e.v?'#3D4A38':'#e5e7eb',color:entityFilter===e.v?'#fff':'#555',fontWeight:entityFilter===e.v?600:400}}>{e.l}</button>
          ))}
          <button onClick={exportExcel} style={{padding:'6px 14px',background:'#b8860b',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>Export Excel</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'16px',marginBottom:'24px'}}>
        <div style={S.card}><p style={S.label}>Total dépenses</p><p style={S.val}>{fmt(total)}</p><p style={S.sub}>{filtered.length} transaction{filtered.length>1?'s':''}</p></div>
        <div style={S.card}><p style={S.label}>La Villa (LMP)</p><p style={S.val}>{fmt(lmpTotal)}</p><p style={S.sub}>{filtered.filter(e=>e.entity_code==='LMP').length} transaction{filtered.filter(e=>e.entity_code==='LMP').length>1?'s':''}</p></div>
        <div style={S.card}><p style={S.label}>Sleep In (SCI)</p><p style={S.val}>{fmt(sciTotal)}</p><p style={S.sub}>{filtered.filter(e=>e.entity_code==='SCI').length} transaction{filtered.filter(e=>e.entity_code==='SCI').length>1?'s':''}</p></div>
        <div style={S.card}><p style={S.label}>Mont-Blanc (NP)</p><p style={S.val}>{fmt(mbTotal)}</p><p style={S.sub}>{filtered.filter(e=>e.entity_code==='MB').length} transaction{filtered.filter(e=>e.entity_code==='MB').length>1?'s':''}</p></div>
        <div style={S.card}><p style={S.label}>Catégories</p><p style={S.val}>{categories.length}</p><p style={S.sub}>catégories distinctes</p></div>
      </div>

      {/* Category breakdown panels */}
      {breakdowns.length > 0 && (
        <div style={{display:'grid',gridTemplateColumns:`repeat(auto-fit,minmax(300px,1fr))`,gap:'16px',marginBottom:'24px'}}>
          {breakdowns.map(bd => (
            <div key={bd.entity} style={S.card}>
              <h3 style={{margin:'0 0 12px',fontSize:'16px',color:'#1a1a2e'}}>{bd.label}</h3>
              {bd.cats.map(cat => {
                const maxCat = bd.cats[0]?.total || 1;
                const pct = Math.round((cat.total/maxCat)*100);
                return (
                  <div key={cat.name}>
                    <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0',fontSize:'14px'}}>
                      <span>{cat.name}</span>
                      <span style={{display:'flex',gap:'12px'}}><strong>{fmt(cat.total)}</strong><span style={{color:'#999',fontSize:'12px'}}>{cat.count}</span></span>
                    </div>
                    <div style={{height:'4px',background:'#f0f0f0',borderRadius:'2px',marginBottom:'8px'}}>
                      <div style={{height:'100%',background:'#ef4444',borderRadius:'2px',width:pct+'%',transition:'width 0.3s'}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Detail table */}
      <h3 style={{margin:'0 0 12px',fontSize:'18px',color:'#1a1a2e'}}>Détail des dépenses</h3>
      <div style={{marginBottom:'16px'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher une dépense..." style={{padding:'8px 14px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',width:'300px',maxWidth:'100%'}}/>
      </div>

      <div style={{...S.card,padding:0,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
          <thead><tr style={{background:'#f8f8f8',borderBottom:'2px solid #e5e7eb'}}>
            {['Date','Libellé','Catégorie','Entité','Montant'].map(h=>(
              <th key={h} style={{padding:'12px 16px',textAlign:h==='Montant'?'right':'left',fontWeight:600,color:'#555',fontSize:'12px',textTransform:'uppercase'}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.sort((a,b)=>(b.accounting_date||'').localeCompare(a.accounting_date||'')||b.amount-a.amount).map(e=>{
              const badge = ENTITY_BADGES[e.entity_code]||{bg:'#e5e7eb',color:'#555'};
              return (
                <tr key={e.transaction_id} style={{borderBottom:'1px solid #f0f0f0'}}>
                  <td style={{padding:'10px 16px',color:'#888'}}>{e.accounting_date?new Date(e.accounting_date).toLocaleDateString('fr-FR'):'—'}</td>
                  <td style={{padding:'10px 16px',fontWeight:500}} title={e.details||e.label_operation}>{e.label_simple}</td>
                  <td style={{padding:'10px 16px'}}><span style={{fontSize:'13px'}}>{e.category}</span></td>
                  <td style={{padding:'10px 16px'}}><span style={{background:badge.bg,color:badge.color,padding:'2px 8px',borderRadius:'4px',fontSize:'12px',fontWeight:500}}>{e.entity_code}</span></td>
                  <td style={{padding:'10px 16px',textAlign:'right',fontWeight:600,color:'#ef4444'}}>{fmt(e.amount)}</td>
                </tr>
              );
            })}
            {filtered.length===0 && <tr><td colSpan={5} style={{padding:'40px',textAlign:'center',color:'#888'}}>Aucune dépense ce mois</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
