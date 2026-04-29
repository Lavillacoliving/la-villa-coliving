import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { filterByEntity } from '@/lib/entities';
import { logAudit } from '@/lib/auditLog';

type LeaseStatus = 'draft' | 'sent_yousign' | 'signed' | 'active' | 'cancelled';

interface Tenant {
  id: string; first_name: string; last_name: string; email: string; phone: string;
  room_number: number; current_rent: number; property_id: string; is_active: boolean;
  move_in_date: string|null; move_out_date: string|null; deposit_amount: number|null;
  deposit_received: boolean|null;
  deposit_received_date: string|null; deposit_refunded_amount: number|null; deposit_refunded_date: string|null;
  due_day: number|null; date_of_birth: string|null; place_of_birth: string|null;
  bank_aliases: string[]|null; notes: string|null; entity_id: string|null;
  // Charges individualisées (override propriété — NULL = hérite)
  charges_energy_chf: number|null; charges_maintenance_chf: number|null; charges_services_chf: number|null;
  // Cycle de vie du bail (workflow Yousign)
  lease_status: LeaseStatus|null;
}
interface Property {
  id: string; name: string; slug: string; entity_id: string; is_coliving: boolean;
  charges_energy_chf?: number|null; charges_maintenance_chf?: number|null; charges_services_chf?: number|null;
}

// Métadonnées d'affichage du statut bail
const LEASE_STATUS_META: Record<LeaseStatus, { label: string; color: string; bg: string }> = {
  draft:        { label: 'Brouillon',         color: '#7c3aed', bg: '#ede9fe' },
  sent_yousign: { label: 'Envoyé (Yousign)',  color: '#0891b2', bg: '#cffafe' },
  signed:       { label: 'Signé',             color: '#0d9488', bg: '#ccfbf1' },
  active:       { label: 'Actif',             color: '#16a34a', bg: '#dcfce7' },
  cancelled:    { label: 'Annulé',            color: '#dc2626', bg: '#fee2e2' },
};

function fmt(n: number) { return n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }

const EMPTY_TENANT: Partial<Tenant> = {
  first_name:'',last_name:'',email:'',phone:'',room_number:0,current_rent:0,
  property_id:'',is_active:true,move_in_date:null,move_out_date:null,
  deposit_amount:null,deposit_received:false,deposit_received_date:null,deposit_refunded_amount:null,
  deposit_refunded_date:null,due_day:5,date_of_birth:null,place_of_birth:null,
  bank_aliases:null,notes:null,entity_id:null,
  charges_energy_chf:null,charges_maintenance_chf:null,charges_services_chf:null,
  lease_status:'draft'
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
  // deleteConfirm removed — no deletion allowed from dashboard

  const load = useCallback(async () => {
    setLoading(true);
    const [tRes,pRes] = await Promise.all([
      supabase.from('tenants').select('*').order('room_number'),
      supabase.from('properties').select('id,name,slug,entity_id,is_coliving,charges_energy_chf,charges_maintenance_chf,charges_services_chf'),
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

  const filtered = filterByEntity(
    tenants
      .filter(t => statusFilter==='all' ? true : statusFilter==='active' ? t.is_active : !t.is_active)
      .filter(t => !search || (t.first_name+' '+t.last_name).toLowerCase().includes(search.toLowerCase())),
    filter,
    properties
  );

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
    const errors: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Sanitize filename: remove accents & special chars, add timestamp for uniqueness
      const dotIdx = file.name.lastIndexOf('.');
      const ext = dotIdx > 0 ? file.name.slice(dotIdx) : '';
      const baseName = dotIdx > 0 ? file.name.slice(0, dotIdx) : file.name;
      const safeName = baseName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
      const ts = Date.now() + '_' + i;
      const fp = 'tenants/' + modal.id + '/' + safeName + '_' + ts + ext;
      const { error } = await supabase.storage.from('operations').upload(fp, file);
      if (error) { fail++; errors.push(`${file.name}: ${error.message}`); console.error('[upload]', fp, error); } else { ok++; }
    }
    setUploadingDoc(false);
    if (ok > 0) toast.success(ok + ' document(s) ajouté(s)');
    if (fail > 0) toast.error(errors.join(' | ') || fail + ' erreur(s) upload');
    if (modal.id) loadTenantDocs(modal.id);
  };

  const downloadTenantDoc = async (fileName: string) => {
    if (!modal?.id) return;
    const fp = 'tenants/' + modal.id + '/' + fileName;
    const { data, error } = await supabase.storage.from('operations').createSignedUrl(fp, 300);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    window.open(data.signedUrl, '_blank');
  };

  // Document & tenant deletion disabled from dashboard — data is permanent

  // Construit le payload commun pour insert/update tenant
  const buildTenantPayload = (m: Partial<Tenant>): any => ({
    first_name:m.first_name, last_name:m.last_name, email:m.email||null,
    phone:m.phone||null, property_id:m.property_id, room_number:m.room_number,
    current_rent:m.current_rent, due_day:m.due_day||5, is_active:m.is_active!==false,
    move_in_date:m.move_in_date||null, move_out_date:m.move_out_date||null,
    deposit_amount:m.deposit_amount||null,
    deposit_received: m.deposit_received===true,
    deposit_received_date: m.deposit_received===true ? (m.deposit_received_date || new Date().toISOString().split('T')[0]) : null,
    date_of_birth:m.date_of_birth||null, place_of_birth:m.place_of_birth||null,
    bank_aliases:m.bank_aliases, notes:m.notes||null,
    // Charges override (NULL = hérite propriété)
    charges_energy_chf:      m.charges_energy_chf===null || m.charges_energy_chf===undefined || isNaN(Number(m.charges_energy_chf)) ? null : Number(m.charges_energy_chf),
    charges_maintenance_chf: m.charges_maintenance_chf===null || m.charges_maintenance_chf===undefined || isNaN(Number(m.charges_maintenance_chf)) ? null : Number(m.charges_maintenance_chf),
    charges_services_chf:    m.charges_services_chf===null || m.charges_services_chf===undefined || isNaN(Number(m.charges_services_chf)) ? null : Number(m.charges_services_chf),
    lease_status: m.lease_status || 'active',
    updated_at:new Date().toISOString(),
  });

  const saveModal = async () => {
    if (!modal) return;
    if (!modal.first_name || !modal.last_name) { toast.warning('Prénom et nom obligatoires'); return; }
    if (!modal.property_id) { toast.warning('Choisissez une propriété'); return; }
    if (!modal.room_number) { toast.warning('Numéro de chambre obligatoire'); return; }
    if (!modal.current_rent) { toast.warning('Loyer obligatoire'); return; }
    setSaving(true);
    const data = buildTenantPayload(modal);

    let err;
    if (isNew) { ({error:err} = await supabase.from('tenants').insert(data)); }
    else { ({error:err} = await supabase.from('tenants').update(data).eq('id',modal.id)); }
    setSaving(false);
    if (err) { toast.error('Erreur: ' + err.message); return; }
    setModal(null); load();
  };

  // Auto-save on close: silently saves if the form has enough data, otherwise just closes
  const closeModal = async () => {
    if (modal && !isNew && modal.first_name && modal.last_name && modal.property_id && modal.room_number && modal.current_rent) {
      await supabase.from('tenants').update(buildTenantPayload(modal)).eq('id', modal.id);
    }
    setModal(null); load();
  };

  // Transition de statut bail (workflow Yousign)
  const transitionLeaseStatus = async (next: LeaseStatus) => {
    if (!modal?.id) return;
    const prev = modal.lease_status || 'active';
    // Si on passe à 'active', on s'assure que la caution est marquée reçue
    const extra: any = { lease_status: next, updated_at: new Date().toISOString() };
    if (next === 'cancelled') {
      extra.is_active = false;
    }
    if (next === 'active') {
      extra.is_active = true;
    }
    const { error } = await supabase.from('tenants').update(extra).eq('id', modal.id);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    await logAudit('lease_status_changed', 'tenant', modal.id, { from: prev, to: next, name: `${modal.first_name} ${modal.last_name}` });
    setModal({ ...modal, lease_status: next, is_active: next==='cancelled' ? false : next==='active' ? true : (modal.is_active!==false) });
    toast.success(`Statut bail → ${LEASE_STATUS_META[next].label}`);
    load();
  };

  // Confirmation explicite de réception caution (toggle)
  const toggleDepositReceived = async (received: boolean) => {
    if (!modal?.id) return;
    const today = new Date().toISOString().split('T')[0];
    const upd: any = {
      deposit_received: received,
      deposit_received_date: received ? (modal.deposit_received_date || today) : null,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('tenants').update(upd).eq('id', modal.id);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    await logAudit(received ? 'deposit_received' : 'deposit_unreceived', 'tenant', modal.id, { name: `${modal.first_name} ${modal.last_name}`, amount: modal.deposit_amount });
    setModal({ ...modal, deposit_received: received, deposit_received_date: received ? (modal.deposit_received_date || today) : null });
    toast.success(received ? 'Caution marquée comme reçue ✓' : 'Caution remise en attente');
    load();
  };

  // Tenant deletion disabled — archive to "ancien" instead
  const archiveTenant = async () => {
    if (!modal?.id) return;
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('tenants').update({ is_active: false, move_out_date: modal.move_out_date || today }).eq('id', modal.id);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    await logAudit('tenant_deactivated', 'tenant', modal.id, { name: `${modal.first_name} ${modal.last_name}`, move_out_date: modal.move_out_date || today });
    toast.success(`${modal.first_name} ${modal.last_name} archivé(e)`);
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
    if (t.deposit_received === true || (t.deposit_received === null && t.deposit_received_date)) return {label:'Reçue',color:'#22c55e'};
    return {label:'En attente',color:'#eab308'};
  };

  // Charges effectives = override locataire si rempli, sinon valeur propriété
  const effectiveCharges = (m: Partial<Tenant>) => {
    const prop = properties.find(p => p.id === m.property_id);
    return {
      energy:      m.charges_energy_chf      ?? prop?.charges_energy_chf      ?? 0,
      maintenance: m.charges_maintenance_chf ?? prop?.charges_maintenance_chf ?? 0,
      services:    m.charges_services_chf    ?? prop?.charges_services_chf    ?? 0,
      isOverride: {
        energy:      m.charges_energy_chf      !== null && m.charges_energy_chf      !== undefined,
        maintenance: m.charges_maintenance_chf !== null && m.charges_maintenance_chf !== undefined,
        services:    m.charges_services_chf    !== null && m.charges_services_chf    !== undefined,
      }
    };
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
        {[{value:'all',label:'Toutes'},{value:'lavilla',label:'La Villa'},{value:'leloft',label:'Le Loft'},{value:'lelodge',label:'Le Lodge'},{value:'montblanc',label:'Mont-Blanc'}].map(e=>(
          <button key={e.value} onClick={()=>setFilter(e.value)} style={{...S.btn,background:filter===e.value?'#3D4A38':'#e5e7eb',color:filter===e.value?'#fff':'#555',fontWeight:filter===e.value?600:400}}>{e.label}</button>
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
            {['Propriété','Ch.','Locataire','Loyer','Contact','Entrée','Bail','Caution','Statut'].map(h=>(
              <th key={h} style={{padding:'12px 16px',textAlign:'left',fontWeight:600,color:'#555',fontSize:'12px',textTransform:'uppercase'}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(t => {
              const prop = properties.find(p=>p.id===t.property_id);
              const ds = depositStatus(t);
              const ls = LEASE_STATUS_META[(t.lease_status as LeaseStatus) || 'active'];
              return (
                <tr key={t.id} style={{borderBottom:'1px solid #f0f0f0',opacity:t.is_active?1:0.5,cursor:'pointer'}} onClick={()=>openModal(t)}>
                  <td style={{padding:'10px 16px',fontSize:'12px'}}>{prop?.name||''}</td>
                  <td style={{padding:'10px 16px',fontWeight:600}}>{properties.find(p=>p.id===t.property_id)?.is_coliving===false ? 'Appt.' : `Ch. ${t.room_number}`}</td>
                  <td style={{padding:'10px 16px',fontWeight:500}}>{t.first_name} {t.last_name}</td>
                  <td style={{padding:'10px 16px'}}>{fmt(t.current_rent)}</td>
                  <td style={{padding:'10px 16px',fontSize:'12px'}}>{t.email && <span title={t.email}>✉️</span>} {t.phone && <a href={'tel:'+t.phone} title={t.phone} style={{textDecoration:'none'}}>📞</a>}</td>
                  <td style={{padding:'10px 16px',color:'#888',fontSize:'13px'}}>{t.move_in_date?new Date(t.move_in_date).toLocaleDateString('fr-FR'):'—'}</td>
                  <td style={{padding:'10px 16px'}}><span style={{background:ls.bg,color:ls.color,padding:'2px 8px',borderRadius:'10px',fontSize:'11px',fontWeight:600}}>{ls.label}</span></td>
                  <td style={{padding:'10px 16px'}}><span style={{color:ds.color,fontSize:'12px',fontWeight:500}}>{ds.label}</span></td>
                  <td style={{padding:'10px 16px'}}><span style={{background:t.is_active?'#22c55e':'#94a3b8',color:'#fff',padding:'2px 10px',borderRadius:'12px',fontSize:'12px'}}>{t.is_active?'Actif':'Sorti'}</span></td>
                </tr>
              );
            })}
            {filtered.length===0 && <tr><td colSpan={9} style={{padding:'40px',textAlign:'center',color:'#888'}}>Aucun locataire</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Tenant Modal */}
      {modal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,overflow:'auto',padding:'20px'}} onClick={closeModal}>
          <div style={{background:'white',borderRadius:'16px',padding:'28px',width:'600px',maxWidth:'95vw',maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h2 style={{margin:0,fontSize:'20px'}}>{isNew?'Nouveau Locataire':'Fiche Locataire'}</h2>
              <button onClick={closeModal} style={{background:'none',border:'none',fontSize:'24px',cursor:'pointer',color:'#888'}}>×</button>
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
                      // Display clean name: strip timestamp suffix (_1740000000000_0) before extension
                      const displayName = doc.name.replace(/_\d{13,}_\d+(\.[^.]+)$/, '$1').replace(/_/g, ' ');
                      return (
                        <div key={doc.name} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:'#f9f9f9',borderRadius:'8px'}}>
                          <span style={{fontSize:'20px'}}>{icon[ext]||'📄'}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:500,fontSize:'14px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{displayName}</div>
                            <div style={{color:'#888',fontSize:'12px'}}>{sz}{doc.updated_at ? ' — '+new Date(doc.updated_at).toLocaleDateString('fr-FR') : ''}</div>
                          </div>
                          <button onClick={()=>downloadTenantDoc(doc.name)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'16px'}} title="Télécharger">⬇️</button>
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
                  <div><label style={S.fieldLabel}>{properties.find(p=>p.id===modal.property_id)?.is_coliving===false ? 'N° logement *' : 'Chambre *'}</label><input type="number" style={S.input} value={modal.room_number||''} onChange={e=>setModal({...modal,room_number:parseInt(e.target.value)||0})}/></div>
                  <div><label style={S.fieldLabel}>Loyer mensuel *</label><input type="number" step="0.01" style={S.input} value={modal.current_rent||''} onChange={e=>setModal({...modal,current_rent:parseFloat(e.target.value)||0})}/></div>
                  <div><label style={S.fieldLabel}>Jour d'échéance</label><input type="number" min="1" max="28" style={S.input} value={modal.due_day||5} onChange={e=>setModal({...modal,due_day:parseInt(e.target.value)||5})}/></div>
                  <div><label style={S.fieldLabel}>Date d'entrée</label><input type="date" style={S.input} value={modal.move_in_date||''} onChange={e=>setModal({...modal,move_in_date:e.target.value})}/></div>
                  <div><label style={S.fieldLabel}>Date de sortie</label><input type="date" style={S.input} value={modal.move_out_date||''} onChange={e=>setModal({...modal,move_out_date:e.target.value})}/></div>
                  <div><label style={S.fieldLabel}>Caution (€)</label><input type="number" step="0.01" style={S.input} value={modal.deposit_amount||''} onChange={e=>setModal({...modal,deposit_amount:parseFloat(e.target.value)||null})}/></div>
                  <div>
                    <label style={S.fieldLabel}>Réception caution</label>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',border:'1px solid #ddd',borderRadius:'6px',background:modal.deposit_received?'#f0fdf4':'#fffbeb'}}>
                      <input type="checkbox" checked={modal.deposit_received===true} disabled={!modal.id} onChange={e=>{ if(modal.id){ toggleDepositReceived(e.target.checked); } else { setModal({...modal,deposit_received:e.target.checked}); } }}/>
                      <span style={{fontSize:'13px',color:modal.deposit_received?'#16a34a':'#92400e'}}>
                        {modal.deposit_received ? `Reçue${modal.deposit_received_date ? ' le '+new Date(modal.deposit_received_date).toLocaleDateString('fr-FR') : ''}` : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* === STATUT BAIL (workflow Yousign) === */}
                {!isNew && (
                  <div style={{background:'#fafafa',border:'1px solid #e5e7eb',borderRadius:'8px',padding:'12px',marginBottom:'16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
                      <strong style={{fontSize:'13px',color:'#374151'}}>Cycle de vie du bail</strong>
                      {(() => { const ls = LEASE_STATUS_META[(modal.lease_status as LeaseStatus) || 'active']; return (
                        <span style={{background:ls.bg,color:ls.color,padding:'3px 10px',borderRadius:'12px',fontSize:'11px',fontWeight:600}}>{ls.label}</span>
                      ); })()}
                    </div>
                    <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                      {modal.lease_status === 'draft' && (
                        <>
                          <button onClick={()=>transitionLeaseStatus('sent_yousign')} style={{padding:'6px 12px',background:'#0891b2',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>📤 Marquer envoyé Yousign</button>
                          <button onClick={()=>transitionLeaseStatus('cancelled')} style={{padding:'6px 12px',background:'#fff',color:'#dc2626',border:'1px solid #fecaca',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>✕ Annuler</button>
                        </>
                      )}
                      {modal.lease_status === 'sent_yousign' && (
                        <>
                          <button onClick={()=>transitionLeaseStatus('signed')} style={{padding:'6px 12px',background:'#0d9488',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>✓ Marquer signé</button>
                          <button onClick={()=>transitionLeaseStatus('draft')} style={{padding:'6px 12px',background:'#fff',color:'#6b7280',border:'1px solid #ddd',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>↩ Retour brouillon</button>
                          <button onClick={()=>transitionLeaseStatus('cancelled')} style={{padding:'6px 12px',background:'#fff',color:'#dc2626',border:'1px solid #fecaca',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>✕ Annuler</button>
                        </>
                      )}
                      {modal.lease_status === 'signed' && (
                        <>
                          <button onClick={()=>transitionLeaseStatus('active')} style={{padding:'6px 12px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>🚀 Activer le bail</button>
                          <button onClick={()=>transitionLeaseStatus('cancelled')} style={{padding:'6px 12px',background:'#fff',color:'#dc2626',border:'1px solid #fecaca',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>✕ Annuler</button>
                        </>
                      )}
                      {modal.lease_status === 'active' && (
                        <span style={{fontSize:'12px',color:'#6b7280',fontStyle:'italic'}}>Bail actif. Pour archiver, utilise « Passer en ancien » en bas.</span>
                      )}
                      {modal.lease_status === 'cancelled' && (
                        <button onClick={()=>transitionLeaseStatus('draft')} style={{padding:'6px 12px',background:'#fff',color:'#7c3aed',border:'1px solid #ddd6fe',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>↻ Réactiver en brouillon</button>
                      )}
                    </div>
                    <div style={{marginTop:'8px',fontSize:'11px',color:'#9ca3af',lineHeight:1.4}}>
                      Brouillon → Envoyé Yousign → Signé → Actif. La caution se confirme séparément (champ ci-dessus).
                    </div>
                  </div>
                )}

                {/* === CHARGES INDIVIDUALISÉES (override propriété) === */}
                <div style={{background:'#fafafa',border:'1px solid #e5e7eb',borderRadius:'8px',padding:'12px',marginBottom:'16px'}}>
                  <div style={{marginBottom:'8px'}}>
                    <strong style={{fontSize:'13px',color:'#374151'}}>Charges individualisées</strong>
                    <span style={{fontSize:'11px',color:'#9ca3af',marginLeft:'8px'}}>vide = hérite de la propriété</span>
                  </div>
                  {(() => {
                    const ec = effectiveCharges(modal);
                    return (
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
                        {([
                          { key:'charges_energy_chf' as const,      label:'Énergie',     value: modal.charges_energy_chf,      effective: ec.energy,      override: ec.isOverride.energy },
                          { key:'charges_maintenance_chf' as const, label:'Maintenance', value: modal.charges_maintenance_chf, effective: ec.maintenance, override: ec.isOverride.maintenance },
                          { key:'charges_services_chf' as const,    label:'Services',    value: modal.charges_services_chf,    effective: ec.services,    override: ec.isOverride.services },
                        ]).map(f => (
                          <div key={f.key}>
                            <label style={{...S.fieldLabel,fontSize:'11px'}}>{f.label} (CHF)</label>
                            <input type="number" step="1" style={{...S.input,background:f.override?'#fef3c7':'#fff'}}
                              placeholder={`hérite (${f.effective})`}
                              value={f.value === null || f.value === undefined ? '' : f.value}
                              onChange={e=>{
                                const v = e.target.value;
                                setModal({...modal,[f.key]: v === '' ? null : parseFloat(v) || 0});
                              }}/>
                            <div style={{fontSize:'10px',color:f.override?'#b45309':'#9ca3af',marginTop:'2px'}}>
                              {f.override ? '↳ override actif' : `↳ ${f.effective} CHF (propriété)`}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
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
                  <div>{!isNew && modal.is_active !== false && <button onClick={archiveTenant} style={{padding:'8px 16px',background:'#6b7280',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>Passer en ancien</button>}</div>
                  <div style={{display:'flex',gap:'8px'}}>
                    <button onClick={closeModal} style={{padding:'8px 16px',border:'1px solid #ddd',background:'#fff',borderRadius:'6px',cursor:'pointer'}}>Fermer</button>
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
