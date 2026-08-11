import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';


interface Expense {
  transaction_id: string; entity_code: string; entity_name: string;
  month: string; accounting_date: string; label_simple: string;
  label_operation: string; category: string; subcategory: string|null;
  amount: number; reference: string|null; details: string|null;
  rapprochement_status?: string; matched_invoice_id?: string|null;
  transaction_type: string; groupe: string;
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
  const [groupFilter, setGroupFilter] = useState<string|null>(null);
  const [revFilter, setRevFilter] = useState<string|null>(null);
  const [revenus, setRevenus] = useState<{transaction_id:string,entity_code:string,accounting_date:string,label_simple:string,locataire:string|null,amount:number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const {data} = await supabase.from('v_monthly_expenses').select('*').eq('month',month).order('accounting_date',{ascending:false});
      setExpenses(data||[]);
      const {data: rev} = await supabase.from('v_monthly_revenus').select('*').eq('month',month);
      setRevenus(rev||[]);
      setLoading(false);
    };
    load();
    setGroupFilter(null);
    setRevFilter(null);
  },[month]);

  let filtered = entityFilter==='all' ? expenses : expenses.filter(e=>e.entity_code===entityFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(e => e.label_simple.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || (e.details||'').toLowerCase().includes(q) || e.label_operation.toLowerCase().includes(q));
  }

  const depenses = filtered.filter(e=>e.transaction_type==='depense');
  const horsDep = filtered.filter(e=>e.transaction_type!=='depense' && e.transaction_type!=='loyer');
  const total = depenses.reduce((s,e)=>s+e.amount,0);
  const lmpTotal = depenses.filter(e=>e.entity_code==='LMP').reduce((s,e)=>s+e.amount,0);
  const sciTotal = depenses.filter(e=>e.entity_code==='SCI').reduce((s,e)=>s+e.amount,0);
  const mbTotal = depenses.filter(e=>e.entity_code==='MB').reduce((s,e)=>s+e.amount,0);
  const horsDepTotal = horsDep.reduce((s,e)=>s+e.amount,0);
  const categories = [...new Set(depenses.map(e=>e.category))];

  // Revenus (loyers encaissés)
  const revByEntity: Record<string,number> = {};
  revenus.forEach(r=>{revByEntity[r.entity_code]=(revByEntity[r.entity_code]||0)+Number(r.amount||0);});
  const revTotal = entityFilter==='all' ? Object.values(revByEntity).reduce((s,v)=>s+v,0) : (revByEntity[entityFilter]||0);
  const marge = revTotal - total;
  const revRows = revFilter ? revenus.filter(r=>revFilter==='all'||r.entity_code===revFilter).sort((a,b)=>(b.accounting_date||'').localeCompare(a.accounting_date||'')) : [];
  const tableRows = groupFilter ? filtered.filter(e=>(e.groupe||'10. Divers')===groupFilter) : filtered;

  // Category breakdown per entity
  const entitiesForBreakdown = entityFilter==='all' ? ['LMP','SCI','MB'] : [entityFilter];
  const breakdowns: {entity:string,label:string,cats:{key:string,name:string,total:number,count:number}[]}[] = [];
  entitiesForBreakdown.forEach(ec => {
    const entData = depenses.filter(e=>e.entity_code===ec);
    if (entData.length===0) return;
    const catMap: Record<string,{total:number,count:number}> = {};
    entData.forEach(e => { const g=e.groupe||'10. Divers'; if(!catMap[g]) catMap[g]={total:0,count:0}; catMap[g].total+=e.amount; catMap[g].count++; });
    const sorted = Object.entries(catMap).sort((a,b)=>a[0].localeCompare(b[0])).map(([n,d])=>({key:n,name:n.replace(/^\d+\.\s*/,''),...d}));
    const label = ec==='LMP'?'La Villa (LMP)':ec==='SCI'?'Sleep In (SCI)':'Mont-Blanc (NP)';
    breakdowns.push({entity:ec,label,cats:sorted});
  });

  const prevMonth=()=>{const d=new Date(month+'-01');d.setMonth(d.getMonth()-1);setMonth(d.toISOString().slice(0,7));};
  const nextMonth=()=>{const d=new Date(month+'-01');d.setMonth(d.getMonth()+1);setMonth(d.toISOString().slice(0,7));};
  const exportExcel=async ()=>{
    const XLSX = await import('xlsx');
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
        <div className="dash-toolbar" style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
          {[{v:'all',l:'Toutes les entités'},{v:'LMP',l:'La Villa (LMP)'},{v:'SCI',l:'Sleep In (SCI)'},{v:'MB',l:'Mont-Blanc (NP)'}].map(e=>(
            <button key={e.v} onClick={()=>setEntityFilter(e.v)} style={{...S.btn,background:entityFilter===e.v?'#3D4A38':'#e5e7eb',color:entityFilter===e.v?'#fff':'#555',fontWeight:entityFilter===e.v?600:400}}>{e.l}</button>
          ))}
          <button onClick={exportExcel} style={{padding:'6px 14px',background:'#b8860b',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>Export Excel</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'16px',marginBottom:'24px'}}>
        <div style={S.card}><p style={S.label}>Total dépenses</p><p style={S.val}>{fmt(total)}</p><p style={S.sub}>{depenses.length} transaction{depenses.length>1?'s':''}</p></div>
        <div style={S.card}><p style={S.label}>La Villa (LMP)</p><p style={S.val}>{fmt(lmpTotal)}</p><p style={S.sub}>{depenses.filter(e=>e.entity_code==='LMP').length} transaction{depenses.filter(e=>e.entity_code==='LMP').length>1?'s':''}</p></div>
        <div style={S.card}><p style={S.label}>Sleep In (SCI)</p><p style={S.val}>{fmt(sciTotal)}</p><p style={S.sub}>{depenses.filter(e=>e.entity_code==='SCI').length} transaction{depenses.filter(e=>e.entity_code==='SCI').length>1?'s':''}</p></div>
        <div style={S.card}><p style={S.label}>Mont-Blanc (NP)</p><p style={S.val}>{fmt(mbTotal)}</p><p style={S.sub}>{depenses.filter(e=>e.entity_code==='MB').length} transaction{depenses.filter(e=>e.entity_code==='MB').length>1?'s':''}</p></div>
        <div style={S.card}><p style={S.label}>Hors dépenses</p><p style={{...S.val,fontSize:'22px',color:'#888'}}>{fmt(horsDepTotal)}</p><p style={S.sub}>cautions, transferts, prélèvements</p></div>
        <div style={S.card}><p style={S.label}>Catégories</p><p style={S.val}>{categories.length}</p><p style={S.sub}>catégories distinctes</p></div>
      </div>

      {/* Revenus & marge */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'16px',marginBottom:'24px'}}>
        <div onClick={()=>setRevFilter(revFilter==='all'?null:'all')} title="Cliquer pour voir les loyers reçus"
          style={{...S.card,borderLeft:'4px solid #16a34a',cursor:'pointer',outline:revFilter==='all'?'2px solid #16a34a':'none'}}>
          <p style={S.label}>Revenus loyers</p><p style={{...S.val,color:'#16a34a'}}>{fmt(revTotal)}</p><p style={S.sub}>encaissés ce mois</p></div>
        {entityFilter==='all' && ['LMP','SCI','MB'].map(ec=>(
          <div key={ec} onClick={()=>setRevFilter(revFilter===ec?null:ec)} title="Cliquer pour voir les loyers reçus"
            style={{...S.card,cursor:'pointer',outline:revFilter===ec?'2px solid #16a34a':'none'}}>
            <p style={S.label}>{ec==='LMP'?'La Villa (LMP)':ec==='SCI'?'Sleep In (SCI)':'Mont-Blanc (NP)'}</p>
            <p style={{...S.val,fontSize:'22px',color:'#16a34a'}}>{fmt(revByEntity[ec]||0)}</p><p style={S.sub}>loyers</p></div>
        ))}
        <div style={{...S.card,borderLeft:`4px solid ${marge>=0?'#16a34a':'#ef4444'}`}}><p style={S.label}>Marge du mois</p><p style={{...S.val,color:marge>=0?'#16a34a':'#ef4444'}}>{fmt(marge)}</p><p style={S.sub}>revenus − dépenses</p></div>
      </div>

      {/* Loyers reçus (au clic sur une carte revenus) */}
      {revFilter && (
        <div style={{...S.card,padding:0,overflow:'auto',marginBottom:'24px',border:'1px solid #bbf7d0'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px'}}>
            <h3 style={{margin:0,fontSize:'16px',color:'#166534'}}>Loyers reçus — {revFilter==='all'?'toutes entités':revFilter==='LMP'?'La Villa (LMP)':revFilter==='SCI'?'Sleep In (SCI)':'Mont-Blanc (NP)'} ({revRows.length})</h3>
            <button onClick={()=>setRevFilter(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'16px',color:'#166534'}}>✕</button>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
            <thead><tr style={{background:'#f0fdf4',borderBottom:'2px solid #bbf7d0'}}>
              {['Date','Libellé','Locataire','Entité','Montant'].map(h=>(
                <th key={h} style={{padding:'10px 16px',textAlign:h==='Montant'?'right':'left',fontWeight:600,color:'#166534',fontSize:'12px',textTransform:'uppercase'}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {revRows.map(r=>{
                const badge = ENTITY_BADGES[r.entity_code]||{bg:'#e5e7eb',color:'#555'};
                return (
                  <tr key={r.transaction_id} style={{borderBottom:'1px solid #f0f0f0'}}>
                    <td style={{padding:'8px 16px',color:'#888'}}>{r.accounting_date?new Date(r.accounting_date).toLocaleDateString('fr-FR'):'—'}</td>
                    <td style={{padding:'8px 16px'}}>{(r.label_simple||'').split('\n')[0].slice(0,60)}</td>
                    <td style={{padding:'8px 16px',fontWeight:600}}>{r.locataire||'—'}</td>
                    <td style={{padding:'8px 16px'}}><span style={{background:badge.bg,color:badge.color,padding:'2px 8px',borderRadius:'4px',fontSize:'12px',fontWeight:500}}>{r.entity_code}</span></td>
                    <td style={{padding:'8px 16px',textAlign:'right',fontWeight:700,color:'#16a34a'}}>{fmt(r.amount)}</td>
                  </tr>
                );
              })}
              {revRows.length===0 && <tr><td colSpan={5} style={{padding:'30px',textAlign:'center',color:'#888'}}>Aucun loyer reçu</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Category breakdown panels */}
      {breakdowns.length > 0 && (
        <div style={{display:'grid',gridTemplateColumns:`repeat(auto-fit,minmax(300px,1fr))`,gap:'16px',marginBottom:'24px'}}>
          {breakdowns.map(bd => (
            <div key={bd.entity} style={S.card}>
              <h3 style={{margin:'0 0 12px',fontSize:'16px',color:'#1a1a2e'}}>{bd.label}</h3>
              {bd.cats.map(cat => {
                const maxCat = Math.max(...bd.cats.map(c=>c.total)) || 1;
                const pct = Math.round((cat.total/maxCat)*100);
                const selected = groupFilter===cat.key;
                return (
                  <div key={cat.key} onClick={()=>setGroupFilter(selected?null:cat.key)} title="Cliquer pour filtrer le détail"
                    style={{cursor:'pointer',background:selected?'#fdf3d7':'transparent',borderRadius:'6px',padding:'0 6px',margin:'0 -6px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0',fontSize:'14px',fontWeight:selected?700:400}}>
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

      {/* Hors dépenses */}
      {horsDep.length > 0 && (
        <div style={{...S.card,marginBottom:'24px'}}>
          <h3 style={{margin:'0 0 12px',fontSize:'16px',color:'#1a1a2e'}}>Hors dépenses (neutre pour la marge)</h3>
          {Object.entries(horsDep.reduce((m:Record<string,number>,e)=>{const g=e.groupe||e.transaction_type;m[g]=(m[g]||0)+e.amount;return m;},{})).map(([g,t])=>(
            <div key={g} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',fontSize:'14px',color:'#666'}}><span>{g}</span><strong>{fmt(t)}</strong></div>
          ))}
        </div>
      )}

      {/* Detail table */}
      <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'0 0 12px'}}>
        <h3 style={{margin:0,fontSize:'18px',color:'#1a1a2e'}}>Détail des dépenses</h3>
        {groupFilter && (
          <button onClick={()=>setGroupFilter(null)} style={{background:'#fdf3d7',border:'1px solid #b8860b',color:'#7a5a08',borderRadius:'20px',padding:'4px 12px',fontSize:'13px',cursor:'pointer',fontWeight:600}}>
            {groupFilter.replace(/^\d+\.\s*/,'')} ✕
          </button>
        )}
      </div>
      <div style={{marginBottom:'16px'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher une dépense..." style={{padding:'8px 14px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',width:'300px',maxWidth:'100%'}}/>
      </div>

      <div style={{...S.card,padding:0,overflow:'auto'}}>
        <table className="dash-table" style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
          <thead><tr style={{background:'#f8f8f8',borderBottom:'2px solid #e5e7eb'}}>
            {['Date','Libellé','Catégorie','Entité','Montant'].map(h=>(
              <th key={h} style={{padding:'12px 16px',textAlign:h==='Montant'?'right':'left',fontWeight:600,color:'#555',fontSize:'12px',textTransform:'uppercase'}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {tableRows.sort((a,b)=>(b.accounting_date||'').localeCompare(a.accounting_date||'')||b.amount-a.amount).map(e=>{
              const badge = ENTITY_BADGES[e.entity_code]||{bg:'#e5e7eb',color:'#555'};
              return (
                <tr key={e.transaction_id} style={{borderBottom:'1px solid #f0f0f0'}}>
                  <td data-label="Date" style={{padding:'10px 16px',color:'#888'}}>{e.accounting_date?new Date(e.accounting_date).toLocaleDateString('fr-FR'):'—'}</td>
                  <td data-label="Libellé" style={{padding:'10px 16px',fontWeight:500}} title={e.details||e.label_operation}>{e.label_simple}</td>
                  <td data-label="Catégorie" style={{padding:'10px 16px'}}><span style={{fontSize:'13px'}}>{e.category}</span></td>
                  <td data-label="Entité" style={{padding:'10px 16px'}}><span style={{background:badge.bg,color:badge.color,padding:'2px 8px',borderRadius:'4px',fontSize:'12px',fontWeight:500}}>{e.entity_code}</span></td>
                  <td data-label="Montant" style={{padding:'10px 16px',textAlign:'right',fontWeight:600,color:'#ef4444'}}>{fmt(e.amount)}</td>
                </tr>
              );
            })}
            {tableRows.length===0 && <tr><td colSpan={5} style={{padding:'40px',textAlign:'center',color:'#888'}}>Aucune dépense {groupFilter?'dans ce groupe':'ce mois'}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
