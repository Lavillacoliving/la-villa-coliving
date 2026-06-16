import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';

interface Prospect {
  id: string; first_name: string; last_name: string;
  email: string | null; phone: string | null;
  source: string | null; status: string;
  property_interest: string | null; occupation: string | null;
  move_in_date: string | null; lease_duration: string | null;
  notes: string | null; assigned_to: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string,string> = {
  new: '#3b82f6', contacted: '#eab308', visit_scheduled: '#8b5cf6',
  visit_done: '#f97316', offer_sent: '#b8860b', signed: '#22c55e',
  lost: '#94a3b8'
};
const STATUS_LABELS: Record<string,string> = {
  new: 'Nouveau', contacted: 'Contacté', visit_scheduled: 'Visite planifiée',
  visit_done: 'Visite faite', offer_sent: 'Offre envoyée', signed: 'Signé', lost: 'Perdu'
};
const PIPELINE_STAGES = ['new','contacted','visit_scheduled','visit_done','signed'];
const PIPELINE_LABELS: Record<string,string> = {
  new:'Nouveau', contacted:'Contacté/Photos', visit_scheduled:'Visite planifiée',
  visit_done:'Visite faite', signed:'Signé'
};
// Valeurs autorisées par la contrainte prospects_source_check (value = stocké en base, label = affiché)
const SOURCE_OPTIONS: Array<[string, string]> = [
  ['messenger','Messenger'], ['instagram','Instagram'], ['whatsapp','WhatsApp'],
  ['facebook','Facebook'], ['leboncoin','Leboncoin'], ['site_web','Site web'], ['autre','Autre'],
];
const SOURCE_LABELS: Record<string, string> = Object.fromEntries(SOURCE_OPTIONS);

// property_interest est un UUID (FK properties) : affichage = nom de maison, stockage = UUID.
const PROPERTY_OPTIONS: Array<[string, string]> = [
  ['d39d074a-ad6d-471c-b7c7-0e576521730e','La Villa'],
  ['177ebcb2-6852-461c-8150-d416aa62ecf1','Le Loft'],
  ['45175bde-8b94-446a-9dd4-e6dee4b5a509','Le Lodge'],
  ['57ecaa58-81e3-4c8c-8681-d5ac50b0d437','Mont-Blanc'],
];
const PROPERTY_LABELS: Record<string, string> = Object.fromEntries(PROPERTY_OPTIONS);
const propertyName = (id: string | null) => (id ? (PROPERTY_LABELS[id] ?? '—') : '—');

// Durée du séjour : mêmes valeurs que le formulaire public de candidature
const DURATION_OPTIONS: Array<[string, string]> = [
  ['2-3','2-3 mois'], ['3-6','3-6 mois'], ['6-12','6-12 mois'], ['12+','12+ mois'],
];
const DURATION_LABELS: Record<string, string> = Object.fromEntries(DURATION_OPTIONS);

const EMPTY_PROSPECT: Partial<Prospect> = {
  first_name:'', last_name:'', email:null, phone:null,
  source:null, status:'new', property_interest:null,
  occupation:null, move_in_date:null, lease_duration:null,
  notes:null, assigned_to:null,
};

export default function DashboardProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState("active");
  const [viewMode, setViewMode] = useState<'pipeline'|'table'>('pipeline');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Prospect>|null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{label:string,fn:()=>void}|null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const {data} = await supabase.from("prospects").select("*").order("created_at",{ascending:false});
    setProspects(data||[]);
    setLoading(false);
  },[]);

  useEffect(() => { load(); }, [load]);

  const active = ["new","contacted","visit_scheduled","visit_done","offer_sent"];
  const filtered = statusFilter==="active" ? prospects.filter(p=>active.includes(p.status))
    : statusFilter==="all" ? prospects : prospects.filter(p=>p.status===statusFilter);

  const totalCount = prospects.length;
  const newCount = prospects.filter(p=>p.status==="new").length;
  const visitCount = prospects.filter(p=>["visit_scheduled","visit_done"].includes(p.status)).length;
  const signedCount = prospects.filter(p=>p.status==="signed").length;
  const lostCount = prospects.filter(p=>p.status==="lost").length;
  const conversionRate = totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 0;

  const openModal = (prospect?: Prospect) => {
    if (prospect) { setModal({...prospect}); setIsNew(false); }
    else { setModal({...EMPTY_PROSPECT}); setIsNew(true); }
  };

  const saveModal = async () => {
    if (!modal) return;
    if (!modal.first_name || !modal.last_name) { toast.warning('Prénom et nom obligatoires'); return; }
    setSaving(true);
    const data: any = {
      first_name: modal.first_name,
      last_name: modal.last_name,
      email: modal.email || null,
      phone: modal.phone || null,
      occupation: modal.occupation || null,
      source: modal.source || null,
      status: modal.status || 'new',
      property_interest: modal.property_interest || null,
      move_in_date: modal.move_in_date || null,
      lease_duration: modal.lease_duration || null,
      notes: modal.notes || null,
    };
    // assigned_to : on n'envoie la valeur que si renseignée, pour laisser le défaut DB ('gestionnaire') à l'insert
    if (modal.assigned_to) data.assigned_to = modal.assigned_to;
    let err;
    if (isNew) {
      ({ error: err } = await supabase.from('prospects').insert(data));
    } else {
      ({ error: err } = await supabase.from('prospects').update(data).eq('id', modal.id));
    }
    setSaving(false);
    if (err) { toast.error('Erreur: ' + err.message); return; }
    setModal(null);
    load();
  };

  const deleteProspect = () => {
    if (!modal?.id) return;
    setDeleteConfirm({label:`${modal.first_name} ${modal.last_name}`,fn:async()=>{
      const { error } = await supabase.from('prospects').delete().eq('id', modal.id);
      if (error) { toast.error('Erreur: ' + error.message); return; }
      setModal(null); load();
    }});
  };

  const convertToTenant = async () => {
    if (!modal?.id) return;
    if (!modal.property_interest) { toast.warning('Sélectionne une maison avant de convertir en locataire'); return; }
    const data: any = {
      first_name: modal.first_name, last_name: modal.last_name,
      email: modal.email || null, phone: modal.phone || null,
      room_number: 0, current_rent: 0,
      property_id: modal.property_interest, is_active: true, due_day: 5,
      move_in_date: modal.move_in_date || null,
      notes: 'Converti depuis prospect. ' + (modal.notes || ''),
    };
    const { error } = await supabase.from('tenants').insert(data);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    // Mark prospect as signed
    await supabase.from('prospects').update({ status: 'signed' }).eq('id', modal.id);
    toast.success(modal.first_name + ' converti en locataire');
    setModal(null); load();
  };

  // Quick status change via pipeline drag-like click
  const moveToStage = async (prospectId: string, newStatus: string) => {
    const { error } = await supabase.from('prospects').update({ status: newStatus }).eq('id', prospectId);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    load();
  };

  const exportExcel = async () => {
    const XLSX = await import('xlsx');
    const rows=filtered.map(p=>({Nom:p.first_name+" "+p.last_name,Email:p.email||"",Tél:p.phone||"",
      Métier:p.occupation||"",Source:SOURCE_LABELS[p.source||""]||p.source||"",
      Statut:STATUS_LABELS[p.status]||p.status,Maison:propertyName(p.property_interest),
      "Durée séjour":DURATION_LABELS[p.lease_duration||""]||p.lease_duration||"",
      "Emménagement souhaité":p.move_in_date||"",
      "Reçu le":p.created_at?new Date(p.created_at).toLocaleDateString("fr-FR"):"",
      Notes:p.notes||""}));
    const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Prospects");XLSX.writeFile(wb,"prospects.xlsx");
  };

  const S = {
    card:{background:"#fff",borderRadius:"12px",padding:"20px",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},
    label:{fontSize:"12px",color:"#888",marginBottom:"4px"},
    val:{fontSize:"24px",fontWeight:700 as const,color:"#1a1a2e"},
    btn:{padding:"6px 14px",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"13px"},
    input:{width:'100%',padding:'8px 10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'14px',boxSizing:'border-box' as const},
    fieldLabel:{fontSize:'12px',fontWeight:600 as const,color:'#555',marginBottom:'4px',display:'block' as const},
  };

  if(loading) return <p style={{textAlign:"center",padding:"40px",color:"#b8860b"}}>Chargement...</p>;

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          {[{v:"active",l:"Actifs"},{v:"all",l:"Tous"},{v:"signed",l:"Signés"},{v:"lost",l:"Perdus"}].map(e=>(
            <button key={e.v} onClick={()=>setStatusFilter(e.v)} style={{
              ...S.btn,background:statusFilter===e.v?"#b8860b":"#e5e7eb",color:statusFilter===e.v?"#fff":"#555"
            }}>{e.l}</button>))}
        </div>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          <button onClick={()=>setViewMode(viewMode==='pipeline'?'table':'pipeline')} style={{...S.btn,background:"#1a1a2e",color:"#fff"}}>{viewMode==='pipeline'?'Vue tableau':'Vue pipeline'}</button>
          <button onClick={exportExcel} style={{...S.btn,background:"#1a1a2e",color:"#fff"}}>Export Excel</button>
          <button onClick={()=>openModal()} style={{padding:"8px 20px",background:"#3D4A38",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600}}>+ Nouveau prospect</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"16px",marginBottom:"24px"}}>
        <div style={S.card}><p style={S.label}>Total</p><p style={S.val}>{totalCount}</p></div>
        <div style={S.card}><p style={S.label}>Nouveaux</p><p style={{...S.val,color:"#3b82f6"}}>{newCount}</p></div>
        <div style={S.card}><p style={S.label}>Visites</p><p style={{...S.val,color:"#8b5cf6"}}>{visitCount}</p></div>
        <div style={S.card}><p style={S.label}>Signés</p><p style={{...S.val,color:"#22c55e"}}>{signedCount}</p></div>
        <div style={S.card}><p style={S.label}>Taux conversion</p><p style={{...S.val,color:conversionRate>=40?"#22c55e":"#eab308"}}>{conversionRate}%</p></div>
      </div>

      {/* Pipeline View */}
      {viewMode === 'pipeline' && (
        <div style={{display:'grid',gridTemplateColumns:`repeat(${PIPELINE_STAGES.length}, minmax(200px, 1fr))`,gap:'12px',marginBottom:'24px',overflowX:'auto'}}>
          {PIPELINE_STAGES.map(stage => {
            const stageProspects = prospects.filter(p => p.status === stage);
            return (
              <div key={stage} style={{background:'#f8f8f8',borderRadius:'12px',padding:'12px',minHeight:'200px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px',paddingBottom:'8px',borderBottom:`3px solid ${STATUS_COLORS[stage]}`}}>
                  <span style={{fontSize:'13px',fontWeight:600,color:'#1a1a2e'}}>{PIPELINE_LABELS[stage]}</span>
                  <span style={{background:STATUS_COLORS[stage],color:'#fff',padding:'2px 8px',borderRadius:'10px',fontSize:'11px',fontWeight:700}}>{stageProspects.length}</span>
                </div>
                {stageProspects.map(p => (
                  <div key={p.id} onClick={()=>openModal(p)} style={{background:'#fff',borderRadius:'8px',padding:'10px 12px',marginBottom:'8px',cursor:'pointer',boxShadow:'0 1px 3px rgba(0,0,0,0.06)',borderLeft:`3px solid ${STATUS_COLORS[stage]}`,transition:'transform 0.15s'}}
                    onMouseOver={e=>e.currentTarget.style.transform='translateY(-1px)'}
                    onMouseOut={e=>e.currentTarget.style.transform='none'}>
                    <div style={{fontWeight:600,fontSize:'13px',color:'#1a1a2e',marginBottom:'4px'}}>{p.first_name} {p.last_name}</div>
                    {p.property_interest && <div style={{fontSize:'11px',color:'#888',marginBottom:'2px'}}>🏠 {propertyName(p.property_interest)}</div>}
                    {p.occupation && <div style={{fontSize:'11px',color:'#888',marginBottom:'2px'}}>💼 {p.occupation}</div>}
                    {p.lease_duration && <div style={{fontSize:'11px',color:'#888',marginBottom:'2px'}}>⏳ {DURATION_LABELS[p.lease_duration]||p.lease_duration}</div>}
                    {p.source && <div style={{fontSize:'11px',color:'#b8860b'}}>{SOURCE_LABELS[p.source]||p.source}</div>}
                    {p.created_at && <div style={{fontSize:'10px',color:'#aaa',marginTop:'4px'}}>Reçu: {new Date(p.created_at).toLocaleDateString('fr-FR')}</div>}
                    {/* Quick move buttons */}
                    <div style={{display:'flex',gap:'4px',marginTop:'6px',flexWrap:'wrap'}}>
                      {PIPELINE_STAGES.filter(s=>s!==stage).slice(0,3).map(s=>(
                        <button key={s} onClick={(e)=>{e.stopPropagation();moveToStage(p.id,s);}} style={{padding:'2px 6px',background:STATUS_COLORS[s]+'20',color:STATUS_COLORS[s],border:`1px solid ${STATUS_COLORS[s]}40`,borderRadius:'4px',fontSize:'10px',cursor:'pointer',whiteSpace:'nowrap'}} title={`Déplacer vers ${PIPELINE_LABELS[s]}`}>
                          → {PIPELINE_LABELS[s].split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {stageProspects.length===0 && <p style={{textAlign:'center',color:'#ccc',fontSize:'12px',padding:'20px 0'}}>Aucun prospect</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Lost prospects summary */}
      {lostCount > 0 && viewMode === 'pipeline' && (
        <div style={{...S.card,marginBottom:'24px',background:'#f9fafb',borderLeft:'4px solid #94a3b8'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontWeight:600,color:'#64748b'}}>Prospects perdus : {lostCount}</span>
            <button onClick={()=>setStatusFilter('lost')} style={{...S.btn,background:'#e5e7eb',color:'#555'}}>Voir</button>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div style={{...S.card,padding:0,overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"14px"}}>
            <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e5e7eb"}}>
              {["Nom","Métier","Source","Statut","Maison","Durée","Reçu le","Contact"].map(h=>(
                <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:600,color:"#555",fontSize:"12px",textTransform:"uppercase"}}>{h}</th>))}
            </tr></thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id} style={{borderBottom:"1px solid #f0f0f0",cursor:"pointer"}} onClick={()=>openModal(p)}>
                  <td style={{padding:"10px 16px",fontWeight:500}}>{p.first_name} {p.last_name}</td>
                  <td style={{padding:"10px 16px",fontSize:"12px"}}>{p.occupation||"-"}</td>
                  <td style={{padding:"10px 16px",fontSize:"12px"}}>{SOURCE_LABELS[p.source||""]||p.source||"-"}</td>
                  <td style={{padding:"10px 16px"}}><span style={{background:STATUS_COLORS[p.status]||"#94a3b8",color:"#fff",padding:"2px 10px",borderRadius:"12px",fontSize:"12px"}}>{STATUS_LABELS[p.status]||p.status}</span></td>
                  <td style={{padding:"10px 16px"}}>{propertyName(p.property_interest)}</td>
                  <td style={{padding:"10px 16px",color:"#888",fontSize:"12px"}}>{p.lease_duration?(DURATION_LABELS[p.lease_duration]||p.lease_duration):"-"}</td>
                  <td style={{padding:"10px 16px",color:"#888",fontSize:"12px"}}>{p.created_at?new Date(p.created_at).toLocaleDateString("fr-FR"):"-"}</td>
                  <td style={{padding:"10px 16px",fontSize:"12px"}}>{p.email && <span title={p.email}>✉️</span>} {p.phone && <a href={'tel:'+p.phone} title={p.phone} style={{textDecoration:'none'}}>📞</a>}</td>
                </tr>))}
              {filtered.length===0&&<tr><td colSpan={8} style={{padding:"40px",textAlign:"center",color:"#888"}}>Aucun prospect</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Prospect Modal */}
      {modal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,overflow:'auto',padding:'20px'}} onClick={()=>setModal(null)}>
          <div style={{background:'white',borderRadius:'16px',padding:'28px',width:'600px',maxWidth:'95vw',maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h2 style={{margin:0,fontSize:'20px'}}>{isNew?'Nouveau Prospect':'Fiche Prospect'}</h2>
              <button onClick={()=>setModal(null)} style={{background:'none',border:'none',fontSize:'24px',cursor:'pointer',color:'#888'}}>×</button>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
              <div><label style={S.fieldLabel}>Prénom *</label><input style={S.input} value={modal.first_name||''} onChange={e=>setModal({...modal,first_name:e.target.value})}/></div>
              <div><label style={S.fieldLabel}>Nom *</label><input style={S.input} value={modal.last_name||''} onChange={e=>setModal({...modal,last_name:e.target.value})}/></div>
              <div><label style={S.fieldLabel}>Email</label><input type="email" style={S.input} value={modal.email||''} onChange={e=>setModal({...modal,email:e.target.value||null})}/></div>
              <div><label style={S.fieldLabel}>Téléphone</label><input style={S.input} value={modal.phone||''} onChange={e=>setModal({...modal,phone:e.target.value||null})}/></div>
              <div><label style={S.fieldLabel}>Métier</label><input style={S.input} value={modal.occupation||''} onChange={e=>setModal({...modal,occupation:e.target.value||null})}/></div>
              <div><label style={S.fieldLabel}>Source</label>
                <select style={S.input} value={modal.source||''} onChange={e=>setModal({...modal,source:e.target.value||null})}>
                  <option value="">—</option>
                  {SOURCE_OPTIONS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div><label style={S.fieldLabel}>Statut</label>
                <select style={S.input} value={modal.status||'new'} onChange={e=>setModal({...modal,status:e.target.value})}>
                  {Object.entries(STATUS_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div><label style={S.fieldLabel}>Maison d'intérêt</label>
                <select style={S.input} value={modal.property_interest||''} onChange={e=>setModal({...modal,property_interest:e.target.value||null})}>
                  <option value="">— (indifférent)</option>
                  {PROPERTY_OPTIONS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div><label style={S.fieldLabel}>Durée du séjour</label>
                <select style={S.input} value={modal.lease_duration||''} onChange={e=>setModal({...modal,lease_duration:e.target.value||null})}>
                  <option value="">—</option>
                  {DURATION_OPTIONS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div><label style={S.fieldLabel}>Date d'emménagement souhaitée</label><input type="date" style={S.input} value={modal.move_in_date||''} onChange={e=>setModal({...modal,move_in_date:e.target.value||null})}/></div>
              <div><label style={S.fieldLabel}>Assigné à</label><input style={S.input} value={modal.assigned_to||''} onChange={e=>setModal({...modal,assigned_to:e.target.value||null})} placeholder="gestionnaire"/></div>
            </div>

            <div style={{marginBottom:'16px'}}>
              <label style={S.fieldLabel}>Notes</label>
              <textarea style={{...S.input,height:'80px',resize:'vertical'}} value={modal.notes||''} onChange={e=>setModal({...modal,notes:e.target.value||null})} placeholder="Notes internes sur le prospect..."/>
            </div>

            <div style={{display:'flex',gap:'8px',justifyContent:'space-between',flexWrap:'wrap'}}>
              <div style={{display:'flex',gap:'8px'}}>
                {!isNew && <button onClick={deleteProspect} style={{padding:'8px 16px',background:'#ef4444',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>Supprimer</button>}
                {!isNew && modal.status !== 'signed' && <button onClick={convertToTenant} style={{padding:'8px 16px',background:'#22c55e',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>✓ Convertir en locataire</button>}
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setModal(null)} style={{padding:'8px 16px',border:'1px solid #ddd',background:'#fff',borderRadius:'6px',cursor:'pointer'}}>Annuler</button>
                <button onClick={saveModal} disabled={saving} style={{padding:'8px 16px',background:'#b8860b',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:600}}>{saving?'...':'Enregistrer'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000}} onClick={()=>setDeleteConfirm(null)}>
          <div style={{background:'white',borderRadius:'12px',padding:'24px',width:'400px',maxWidth:'90vw'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{margin:'0 0 12px',fontSize:'16px'}}>⚠️ Confirmer la suppression</h3>
            <p style={{fontSize:'14px',color:'#555',margin:'0 0 20px'}}>Supprimer <strong>{deleteConfirm.label}</strong> ? Cette action est irréversible.</p>
            <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
              <button onClick={()=>setDeleteConfirm(null)} style={{padding:'8px 16px',border:'1px solid #ddd',background:'#fff',borderRadius:'6px',cursor:'pointer'}}>Annuler</button>
              <button onClick={()=>{deleteConfirm.fn();setDeleteConfirm(null);}} style={{padding:'8px 16px',background:'#ef4444',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:600}}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
