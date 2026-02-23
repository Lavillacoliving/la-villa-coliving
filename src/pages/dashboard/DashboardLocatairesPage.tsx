import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';

interface Tenant {
  id: string; first_name: string; last_name: string; email: string; phone: string;
  room_number: number; current_rent: number; property_id: string; is_active: boolean;
  move_in_date: string|null; move_out_date: string|null; deposit_amount: number|null;
  deposit_received_date: string|null; deposit_refunded_amount: number|null; deposit_refunded_date: string|null;
  due_day: number|null; date_of_birth: string|null; place_of_birth: string|null;
  bank_aliases: string[]|null; notes: string|null; entity_id: string|null;
}
interface Property { id: string; name: string; slug: string; entity_id: string; }

function fmt(n: number) { return n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }

const EMPTY_TENANT: Partial<Tenant> = {
  first_name:'',last_name:'',email:'',phone:'',room_number:0,current_rent:0,
  property_id:'',is_active:true,move_in_date:null,move_out_date:null,
  deposit_amount:null,deposit_received_date:null,deposit_refunded_amount:null,
  deposit_refunded_date:null,due_day:5,date_of_birth:null,place_of_birth:null,
  bank_aliases:null,notes:null,entity_id:null
};

export default function DashboardLocatairesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const toast = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all'|'active'|'inactive'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Tenant>|null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refundMode, setRefundMode] = useState(false);
  const [refundData, setRefundData] = useState({type:'full',amount:0,deductions:'',virementDone:false});
  const [activeTab, setActiveTab] = useState<'info'|'documents'>('info');
  const [tenantDocs, setTenantDocs] = useState<{name:string,id:string|null,updated_at:string|null,metadata:{size?:number}|null}[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [tRes,pRes] = await Promise.all([
      supabase.from('tenants').select('*').order('room_number'),
      supabase.from('properties').select('id,name,slug,entity_id'),
    ]);
    setTenants(tRes.data||[]);
    setProperties(pRes.data||[]);
    setLoading(false);
  },[]);

  useEffect(() => { load(); },[load]);

  const loadTenantDocs = useCallback(async (tenantId: string) => {
    const { data, error } = await supabase.storage.from('operations').list('tenants/' + tenantId, { limit: 100, sortBy: { column: 'name', order: 'asc' } });
    if (!error && data) {
      setTenantDocs(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
    } else { setTenantDocs([]); }
  }, []);

  const filtered = tenants
    .filter(t => statusFilter==='all' ? true : statusFilter==='active' ? t.is_active : !t.is_active)
    .filter(t => filter==='all' || properties.find(p=>p.id===t.property_id)?.slug===filter)
    .filter(t => !search || (t.first_name+' '+t.last_name).toLowerCase().includes(search.toLowerCase()));

  const activeCount = tenants.filter(t=>t.is_active).length;
  const totalRent = filtered.filter(t=>t.is_active).reduce((s,t)=>s+t.current_rent,0);

  const openModal = (tenant?: Tenant) => {
    if (tenant) { setModal({...tenant}); setIsNew(false); loadTenantDocs(tenant.id); }
    else { setModal({...EMPTY_TENANT}); setIsNew(true); setTenantDocs([]); }
    setRefundMode(false);
    setActiveTab('info');
  };


  const uploadTenantDoc = async (files: FileList | null) => {
    if (!files || !modal?.id) return;
    setUploadingDoc(true);
    let ok = 0, fail = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fp = 'tenants/' + modal.id + '/' + file.name;
      const { error } = await supabase.storage.from('operations').upload(fp, file, { upsert: true });
      if (error) { fail++; } else { ok++; }
    }
    setUploadingDoc(false);
    if (ok > 0) toast.success(ok + ' document(s) ajouté(s)');
    if (fail > 0) toast.error(fail + ' erreur(s) upload');
    if (modal.id) loadTenantDocs(modal.id);
  };

  const downloadTenantDoc = async (fileName: string) => {
    if (!modal?.id) return;
    const fp = 'tenants/' + modal.id + '/' + fileName;
    const { data, error } = await supabase.storage.from('operations').createSignedUrl(fp, 300);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    window.open(data.signedUrl, '_blank');
  };

  const deleteTenantDoc = async (fileName: string) => {
    if (!modal?.id) return;
    if (!confirm('Supprimer ' + fileName + ' ?')) return;
    const fp = 'tenants/' + modal.id + '/' + fileName;
    const { error } = await supabase.storage.from('operations').remove([fp]);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    toast.success('Document supprimé');
    loadTenantDocs(modal.id);
  };

  const saveModal = async () => {
    if (!modal) return;
    if (!modal.first_name || !modal.last_name) { toast.warning('Prénom et nom obligatoires'); return; }
    if (!modal.property_id) { toast.warning('Choisissez une propriété'); return; }
    if (!modal.room_number) { toast.warning('Numéro de chambre obligatoire'); return; }
    if (!modal.current_rent) { toast.warning('Loyer obligatoire'); return; }
    setSaving(true);
    const prop = properties.find(p=>p.id===modal.property_id);
    const data: any = {
      first_name:modal.first_name, last_name:modal.last_name, email:modal.email||null,
      phone:modal.phone||null, property_id:modal.property_id, room_number:modal.room_number,
      current_rent:modal.current_rent, due_day:modal.due_day||5, is_active:modal.is_active!==false,
      move_in_date:modal.move_in_date||null, move_out_date:modal.move_out_date||null,
      deposit_amount:modal.deposit_amount||null, deposit_received_date:modal.deposit_received_date||null,
      date_of_birth:modal.date_of_birth||null, place_of_birth:modal.place_of_birth||null,
      bank_aliases:modal.bank_aliases, notes:modal.notes||null, updated_at:new Date().toISOString()
    };

    let err;
    if (isNew) { ({error:err} = await supabase.from('tenants').insert(data)); }
    else { ({error:err} = await supabase.from('tenants').update(data).eq('id',modal.id)); }
    setSaving(false);
    if (err) { toast.error('Erreur: ' + err.message); return; }
    setModal(null); load();
  };

  const deleteTenant = async () => {
    if (!modal?.id) return;
    if (!confirm(`Supprimer ${modal.first_name} ${modal.last_name} ? Irréversible.`)) return;
    const {error} = await supabase.from('tenants').delete().eq('id',modal.id);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    setModal(null); load();
  };

  const confirmRefund = async () => {
    if (!modal?.id) return;
    if (!refundData.amount || refundData.amount<=0) { toast.warning('Montant invalide'); return; }
    if (!refundData.virementDone) { toast.warning('Confirmez le virement'); return; }
    if (refundData.type==='partial' && !refundData.deductions) { toast.warning('Détaillez les retenues'); return; }
    const today = new Date().toISOString().split('T')[0];
    const {error} = await supabase.from('tenants').update({deposit_refunded_amount:refundData.amount,deposit_refunded_date:today}).eq('id',modal.id);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    // Also update deposits table
    await supabase.from('deposits').update({amount_returned:refundData.amount,date_returned:today,deductions:(modal.deposit_amount||0)-refundData.amount,deduction_details:refundData.deductions||null,status:refundData.type==='full'?'returned':'partial_return'}).eq('tenant_id',modal.id);
    // n8n webhook
    try { await fetch('https://lavillacoliving.app.n8n.cloud/webhook/caution-refund',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tenant_id:modal.id,tenant_name:modal.first_name+' '+modal.last_name,tenant_email:modal.email,property_name:properties.find(p=>p.id===modal.property_id)?.name,room_number:modal.room_number,deposit_amount:modal.deposit_amount,refund_amount:refundData.amount,refund_type:refundData.type,deduction_details:refundData.deductions,refund_date:today})}); } catch(e) { console.warn('Webhook failed:',e); }
    setRefundMode(false); setModal(null); load();
  };

  const depositStatus = (t:Tenant) => {
    if (!t.deposit_amount) return {label:'—',color:'#888'};
    if (t.deposit_refunded_date) return {label:'Restituée',color:'#3b82f6'};
    if (t.deposit_received_date) return {label:'Reçue',color:'#22c55e'};
    return {label:'En attente',color:'#eab308'};
  };

  const exportExcel = () => {
    const XLSX=(window as any).XLSX; if(!XLSX)return;
    const rows=filtered.map(t=>{const p=properties.find(p=>p.id===t.property_id);return{Nom:t.first_name+' '+t.last_name,Ch:t.room_number,Propriété:p?.name||'',Loyer:t.current_rent,Entrée:t.move_in_date||'',Sortie:t.move_out_date||'',Email:t.email,Tél:t.phone,Caution:t.deposit_amount||'',Statut:t.is_active?'Actif':'Sorti'};});
    const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Locataires');XLSX.writeFile(wb,'locataires.xlsx');
  };

  const S = {
    card:{background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'},
    label:{fontSize:'12px',color:'#888',marginBottom:'4px',textTransform:'uppercase' as const},
    val:{fontSize:'28px',fontWeight:800 as const,color:'#1a1a2e'},
    btn:{padding:'6px 14px',border:'none',borderRadius:'20px',cursor:'pointer',fontSize:'13px'},
    input:{width:'100%',padding:'8px 10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'14px',boxSizing:'border-box' as const},
    fieldLabel:{fontSize:'12px',fontWeight:600 as const,color:'#555',marginBottom:'4px',display:'block'},
  };

  if (loading) return <p style={{textAlign:'center',padding:'40px',color:'#b8860b'}}>Chargement...</p>;

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
        <h2 style={{margin:0,fontSize:'20px',color:'#1a1a2e'}}>Fiches Locataires</h2>
        <button onClick={()=>openModal()} style={{padding:'8px 20px',background:'#3D4A38',color:'#fff',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'14px',fontWeight:600}}>+ Nouveau locataire</button>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap',alignItems:'center'}}>
        {[{v:'all',l:'Toutes les entités'},{v:'la-villa',l:'La Villa (LMP)'},{v:'le-loft',l:'Sleep In (SCI)'},{v:'le-lodge',l:'Le Lodge'}].map(e=>(
          <button key={e.v} onClick={()=>setFilter(e.v)} style={{...S.btn,background:filter===e.v?'#3D4A38':'#e5e7eb',color:filter===e.v?'#fff':'#555',fontWeight:filter===e.v?600:400}}>{e.l}</button>
        ))}
      </div>
      <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap',alignItems:'center'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Chercher un locataire..." style={{padding:'8px 14px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',minWidth:'200px'}}/>
        {[{v:'all' as const,l:'Tous'},{v:'active' as const,l:'Actifs'},{v:'inactive' as const,l:'Anciens'}].map(f=>(
          <button key={f.v} onClick={()=>setStatusFilter(f.v)} style={{...S.btn,background:statusFilter===f.v?'#5A6B52':'#fff',color:statusFilter===f.v?'#fff':'#555',border:statusFilter===f.v?'none':'1px solid #ddd'}}>{f.l}</button>
        ))}
        <button onClick={exportExcel} style={{padding:'6px 14px',background:'#1a1a2e',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px',marginLeft:'auto'}}>Export Excel</button>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'24px'}}>
        <div style={S.card}><p style={S.label}>Locataires actifs</p><p style={S.val}>{activeCount}</p></div>
        <div style={S.card}><p style={S.label}>Loyer total mensuel</p><p style={S.val}>{totalRent.toLocaleString('fr-FR')} €</p></div>
        <div style={S.card}><p style={S.label}>Affichés</p><p style={S.val}>{filtered.length}</p></div>
      </div>

      {/* Table */}
      <div style={{...S.card,padding:0,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
          <thead><tr style={{background:'#f8f8f8',borderBottom:'2px solid #e5e7eb'}}>
            {['Propriété','Ch.','Locataire','Loyer','Contact','Entrée','Caution','Statut'].map(h=>(
              <th key={h} style={{padding:'12px 16px',textAlign:'left',fontWeight:600,color:'#555',fontSize:'12px',textTransform:'uppercase'}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(t => {
              const prop = properties.find(p=>p.id===t.property_id);
              const ds = depositStatus(t);
              return (
                <tr key={t.id} style={{borderBottom:'1px solid #f0f0f0',opacity:t.is_active?1:0.5,cursor:'pointer'}} onClick={()=>openModal(t)}>
                  <td style={{padding:'10px 16px',fontSize:'12px'}}>{prop?.name||''}</td>
                  <td style={{padding:'10px 16px',fontWeight:600}}>Ch. {t.room_number}</td>
                  <td style={{padding:'10px 16px',fontWeight:500}}>{t.first_name} {t.last_name}</td>
                  <td style={{padding:'10px 16px'}}>{fmt(t.current_rent)}</td>
                  <td style={{padding:'10px 16px',fontSize:'12px'}}>{t.email && <span title={t.email}>✉️</span>} {t.phone && <a href={'tel:'+t.phone} title={t.phone} style={{textDecoration:'none'}}>📞</a>}</td>
                  <td style={{padding:'10px 16px',color:'#888',fontSize:'13px'}}>{t.move_in_date?new Date(t.move_in_date).toLocaleDateString('fr-FR'):'—'}</td>
                  <td style={{padding:'10px 16px'}}><span style={{color:ds.color,fontSize:'12px',fontWeight:500}}>{ds.label}</span></td>
                  <td style={{padding:'10px 16px'}}><span style={{background:t.is_active?'#22c55e':'#94a3b8',color:'#fff',padding:'2px 10px',borderRadius:'12px',fontSize:'12px'}}>{t.is_active?'Actif':'Sorti'}</span></td>
                </tr>
              );
            })}
            {filtered.length===0 && <tr><td colSpan={8} style={{padding:'40px',textAlign:'center',color:'#888'}}>Aucun locataire</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Tenant Modal */}
      {modal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,overflow:'auto',padding:'20px'}} onClick={()=>setModal(null)}>
          <div style={{background:'white',borderRadius:'16px',padding:'28px',width:'600px',maxWidth:'95vw',maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h2 style={{margin:0,fontSize:'20px'}}>{isNew?'Nouveau Locataire':'Fiche Locataire'}</h2>
              <button onClick={()=>setModal(null)} style={{background:'none',border:'none',fontSize:'24px',cursor:'pointer',color:'#888'}}>×</button>
            </div>


            {/* Tabs */}
            <div style={{display:'flex',gap:'0',marginBottom:'20px',borderBottom:'2px solid #e5e7eb'}}>
              <button onClick={()=>setActiveTab('info')} style={{padding:'8px 20px',border:'none',background:'none',cursor:'pointer',fontSize:'14px',fontWeight:activeTab==='info'?600:400,color:activeTab==='info'?'#b8860b':'#888',borderBottom:activeTab==='info'?'2px solid #b8860b':'2px solid transparent',marginBottom:'-2px'}}>Fiche</button>
              {!isNew && <button onClick={()=>setActiveTab('documents')} style={{padding:'8px 20px',border:'none',background:'none',cursor:'pointer',fontSize:'14px',fontWeight:activeTab==='documents'?600:400,color:activeTab==='documents'?'#b8860b':'#888',borderBottom:activeTab==='documents'?'2px solid #b8860b':'2px solid transparent',marginBottom:'-2px'}}>Documents</button>}
            </div>

            {activeTab === 'documents' && !isNew ? (
              /* Documents tab */
              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                  <h3 style={{margin:0,fontSize:'16px'}}>Documents du locataire</h3>
                  <label style={{padding:'6px 14px',background:'#b8860b',color:'#fff',borderRadius:'6px',cursor:uploadingDoc?'wait':'pointer',fontSize:'13px',fontWeight:600}}>
                    {uploadingDoc ? 'Upload...' : '+ Ajouter'}
                    <input type="file" multiple style={{display:'none'}} onChange={e=>uploadTenantDoc(e.target.files)} disabled={uploadingDoc}/>
                  </label>
                </div>
                {tenantDocs.length === 0 ? (
                  <div style={{textAlign:'center',padding:'40px',color:'#888',background:'#f9f9f9',borderRadius:'8px'}}>
                    <p style={{fontSize:'24px',margin:'0 0 8px'}}>📂</p>
                    <p>Aucun document</p>
                    <p style={{fontSize:'12px'}}>Ajoutez bail, assurance, pièce d'identité...</p>
                  </div>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    {tenantDocs.map(doc => {
                      const ext = doc.name.split('.').pop()?.toLowerCase() || '';
                      const icon: Record<string,string> = {pdf:'📄',jpg:'📷',jpeg:'📷',png:'📷',docx:'📝',xlsx:'📊'};
                      const sz = doc.metadata?.size ? (doc.metadata.size < 1048576 ? (doc.metadata.size/1024).toFixed(1)+' KB' : (doc.metadata.size/1048576).toFixed(1)+' MB') : '';
                      return (
                        <div key={doc.name} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:'#f9f9f9',borderRadius:'8px'}}>
                          <span style={{fontSize:'20px'}}>{icon[ext]||'📄'}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:500,fontSize:'14px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{doc.name}</div>
                            <div style={{color:'#888',fontSize:'12px'}}>{sz}{doc.updated_at ? ' — '+new Date(doc.updated_at).toLocaleDateString('fr-FR') : ''}</div>
                          </div>
                          <button onClick={()=>downloadTenantDoc(doc.name)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'16px'}} title="Télécharger">⬇️</button>
                          <button onClick={()=>deleteTenantDoc(doc.name)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'16px',color:'#ef4444'}} title="Supprimer">🗑️</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : !refundMode ? (
              <>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
                  <div><label style={S.fieldLabel}>Prénom *</label><input style={S.input} value={modal.first_name||''} onChange={e=>setModal({...modal,first_name:e.target.value})}/></div>
                  <div><label style={S.fieldLabel}>Nom *</label><input style={S.input} value={modal.last_name||''} onChange={e=>setModal({...modal,last_name:e.target.value})}/></div>
                  <div><label style={S.fieldLabel}>Date de naissance</label><input type="date" style={S.input} value={modal.date_of_birth||''} onChange={e=>setModal({...modal,date_of_birth:e.target.value})}/></div>
                  <div><label style={S.fieldLabel}>Lieu de naissance</label><input style={S.input} value={modal.place_of_birth||''} onChange={e=>setModal({...modal,place_of_birth:e.target.value})}/></div>
                  <div><label style={S.fieldLabel}>Email</label><input type="email" style={S.input} value={modal.email||''} onChange={e=>setModal({...modal,email:e.target.value})}/></div>
                  <div><label style={S.fieldLabel}>Téléphone</label><input style={S.input} value={modal.phone||''} onChange={e=>setModal({...modal,phone:e.target.value})}/></div>
                  <div><label style={S.fieldLabel}>Propriété *</label><select style={S.input} value={modal.property_id||''} onChange={e=>setModal({...modal,property_id:e.target.value})}><option value="">Choisir...</option>{properties.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                  <div><label style={S.fieldLabel}>Chambre *</label><input type="number" style={S.input} value={modal.room_number||''} onChange={e=>setModal({...modal,room_number:parseInt(e.target.value)||0})}/></div>
                  <div><label style={S.fieldLabel}>Loyer mensuel *</label><input type="number" step="0.01" style={S.input} value={modal.current_rent||''} onChange={e=>setModal({...modal,current_rent:parseFloat(e.target.value)||0})}/></div>
                  <div><label style={S.fieldLabel}>Jour d'échéance</label><input type="number" min="1" max="28" style={S.input} value={modal.due_day||5} onChange={e=>setModal({...modal,due_day:parseInt(e.target.value)||5})}/></div>
                  <div><label style={S.fieldLabel}>Date d'entrée</label><input type="date" style={S.input} value={modal.move_in_date||''} onChange={e=>setModal({...modal,move_in_date:e.target.value})}/></div>
                  <div><label style={S.fieldLabel}>Date de sortie</label><input type="date" style={S.input} value={modal.move_out_date||''} onChange={e=>setModal({...modal,move_out_date:e.target.value})}/></div>
                  <div><label style={S.fieldLabel}>Caution (€)</label><input type="number" step="0.01" style={S.input} value={modal.deposit_amount||''} onChange={e=>setModal({...modal,deposit_amount:parseFloat(e.target.value)||null})}/></div>
                  <div><label style={S.fieldLabel}>Date réception caution</label><input type="date" style={S.input} value={modal.deposit_received_date||''} onChange={e=>setModal({...modal,deposit_received_date:e.target.value})}/></div>
                </div>
                <div style={{marginBottom:'12px'}}><label style={S.fieldLabel}>Alias bancaires (séparés par virgule)</label><input style={S.input} value={(modal.bank_aliases||[]).join(', ')} onChange={e=>setModal({...modal,bank_aliases:e.target.value?e.target.value.split(',').map(a=>a.trim()).filter(Boolean):null})}/></div>
                <div style={{marginBottom:'12px'}}><label style={S.fieldLabel}>Notes</label><textarea style={{...S.input,height:'80px',resize:'vertical'}} value={modal.notes||''} onChange={e=>setModal({...modal,notes:e.target.value})}/></div>
                <div style={{marginBottom:'16px'}}><label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}><input type="checkbox" checked={modal.is_active!==false} onChange={e=>setModal({...modal,is_active:e.target.checked})}/> Actif</label></div>

                {/* Refund section */}
                {!isNew && modal.deposit_amount && !modal.deposit_refunded_date && (
                  <div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:'8px',padding:'12px',marginBottom:'16px'}}>
                    <button onClick={()=>{setRefundMode(true);setRefundData({type:'full',amount:modal.deposit_amount||0,deductions:'',virementDone:false});}} style={{padding:'8px 16px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>🏦 Restituer la caution</button>
                  </div>
                )}
                {modal.deposit_refunded_date && (
                  <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:'8px',padding:'12px',marginBottom:'16px',fontSize:'13px'}}>
                    ✅ Caution restituée le {new Date(modal.deposit_refunded_date).toLocaleDateString('fr-FR')} — {fmt(modal.deposit_refunded_amount||0)}
                  </div>
                )}

                <div style={{display:'flex',gap:'8px',justifyContent:'space-between'}}>
                  <div>{!isNew && <button onClick={deleteTenant} style={{padding:'8px 16px',background:'#ef4444',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>Supprimer</button>}</div>
                  <div style={{display:'flex',gap:'8px'}}>
                    <button onClick={()=>setModal(null)} style={{padding:'8px 16px',border:'1px solid #ddd',background:'#fff',borderRadius:'6px',cursor:'pointer'}}>Annuler</button>
                    <button onClick={saveModal} disabled={saving} style={{padding:'8px 16px',background:'#b8860b',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:600}}>{saving?'...':'Enregistrer'}</button>
                  </div>
                </div>
              </>
            ) : (
              /* Refund form */
              <div>
                <h3 style={{margin:'0 0 16px',fontSize:'16px'}}>🏦 Restitution de caution</h3>
                <div style={{marginBottom:'12px'}}><label style={S.fieldLabel}>Type</label><select style={S.input} value={refundData.type} onChange={e=>{const t=e.target.value;setRefundData({...refundData,type:t,amount:t==='full'?(modal.deposit_amount||0):refundData.amount});}}>
                  <option value="full">Restitution totale</option><option value="partial">Restitution partielle</option>
                </select></div>
                <div style={{marginBottom:'12px'}}><label style={S.fieldLabel}>Montant à restituer (€)</label><input type="number" step="0.01" style={S.input} value={refundData.amount} onChange={e=>setRefundData({...refundData,amount:parseFloat(e.target.value)||0})}/></div>
                {refundData.type==='partial' && <div style={{marginBottom:'12px'}}><label style={S.fieldLabel}>Détail des retenues</label><textarea style={{...S.input,height:'60px'}} value={refundData.deductions} onChange={e=>setRefundData({...refundData,deductions:e.target.value})}/></div>}
                <div style={{marginBottom:'16px'}}><label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}><input type="checkbox" checked={refundData.virementDone} onChange={e=>setRefundData({...refundData,virementDone:e.target.checked})}/> Je confirme que le virement a été effectué</label></div>
                <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
                  <button onClick={()=>setRefundMode(false)} style={{padding:'8px 16px',border:'1px solid #ddd',background:'#fff',borderRadius:'6px',cursor:'pointer'}}>Retour</button>
                  <button onClick={confirmRefund} style={{padding:'8px 16px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:600}}>Confirmer la restitution</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
