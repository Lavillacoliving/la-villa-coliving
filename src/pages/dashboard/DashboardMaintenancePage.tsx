import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { PROPERTY_FILTER_OPTIONS } from '@/lib/entities';

interface Ticket {
  id: string; title: string; description: string;
  status: string; priority: string; category: string;
  property_id: string; room_number: number | null;
  reported_by: string | null; assigned_to: string | null;
  created_at: string; resolved_at: string | null;
}
interface Property { id: string; name: string; slug: string; }
interface TenantLookup { id: string; first_name: string; last_name: string; }

const STATUS_COLORS: Record<string,string> = {
  open: '#ef4444', in_progress: '#eab308', resolved: '#22c55e', closed: '#94a3b8'
};
const STATUS_LABELS: Record<string,string> = {
  open: 'Ouvert', in_progress: 'En cours', resolved: 'Résolu', closed: 'Fermé'
};
const STATUS_ORDER = ['open','in_progress','resolved','closed'];
const PRIO_COLORS: Record<string,string> = {
  urgent: '#ef4444', high: '#f97316', normal: '#eab308', low: '#22c55e'
};
const PRIO_LABELS: Record<string,string> = {
  urgent: 'Urgent', high: 'Haute', normal: 'Moyenne', low: 'Basse'
};
const CAT_LABELS: Record<string,string> = {
  plomberie:'Plomberie',electricite:'Électricité',serrurerie:'Serrurerie',
  mobilier:'Mobilier',electromenager:'Électroménager',wifi:'WiFi/Réseau',
  chauffage:'Chauffage/Clim',piscine:'Piscine/Sauna',
  jardin_exterieur:'Jardin/Extérieur',menage:'Ménage',
  nuisible:'Nuisible',autre:'Autre',admin:'Admin',
  departure:'Départ',incident:'Incident',feedback:'Feedback'
};
const CATEGORIES = ['plomberie','electricite','serrurerie','mobilier','electromenager','wifi','chauffage','piscine','jardin_exterieur','menage','nuisible','autre','admin','departure','incident','feedback'];

const EMPTY_TICKET: Partial<Ticket> = {
  title:'', description:'', status:'open', priority:'normal', category:'Autre',
  property_id:'', room_number:null, reported_by:null, assigned_to:null,
};

export default function DashboardMaintenancePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const toast = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenantsLookup, setTenantsLookup] = useState<TenantLookup[]>([]);
  const [statusFilter, setStatusFilter] = useState("active");
  const [propFilter, setPropFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Ticket>|null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{label:string,fn:()=>void}|null>(null);
  const [photos, setPhotos] = useState<{name:string,url:string}[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [tRes,pRes,tnRes] = await Promise.all([
      supabase.from("maintenance_tickets").select("*").order("created_at",{ascending:false}),
      supabase.from("properties").select("id,name,slug"),
      supabase.from("tenants").select("id,first_name,last_name").eq("is_active",true),
    ]);
    setTickets(tRes.data||[]);
    setProperties(pRes.data||[]);
    setTenantsLookup(tnRes.data||[]);
    setLoading(false);
  },[]);

  useEffect(() => { load(); }, [load]);

  const filtered = tickets
    .filter(t => statusFilter==="active" ? ["open","in_progress"].includes(t.status) : statusFilter==="all" ? true : t.status===statusFilter)
    .filter(t => propFilter==="all" || properties.find(p=>p.id===t.property_id)?.slug===propFilter);

  const openCount = tickets.filter(t=>t.status==="open").length;
  const ipCount = tickets.filter(t=>t.status==="in_progress").length;
  const urgentCount = tickets.filter(t=>t.priority==="urgent"&&t.status!=="resolved"&&t.status!=="closed").length;
  const resolvedCount = tickets.filter(t=>t.status==="resolved"||t.status==="closed").length;

  const loadPhotos = async (ticketId: string) => {
    try {
      const { data } = await supabase.storage.from('operations').list(`maintenance/${ticketId}`, { limit: 20, sortBy: { column: 'name', order: 'asc' } });
      if (data && data.length > 0) {
        const urls = await Promise.all(data.filter(f => f.name !== '.emptyFolderPlaceholder').map(async f => {
          const { data: signed } = await supabase.storage.from('operations').createSignedUrl(`maintenance/${ticketId}/${f.name}`, 3600);
          return { name: f.name, url: signed?.signedUrl || '' };
        }));
        setPhotos(urls.filter(u => u.url));
      } else {
        setPhotos([]);
      }
    } catch { setPhotos([]); }
  };

  const uploadPhotos = async (files: FileList | null) => {
    if (!files || !modal?.id) return;
    setUploading(true);
    let ok = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const fname = `${Date.now()}_${i}.${ext}`;
      const { error } = await supabase.storage.from('operations').upload(`maintenance/${modal.id}/${fname}`, file, { upsert: false });
      if (!error) ok++;
    }
    setUploading(false);
    if (ok > 0) {
      toast.success(`${ok} photo(s) ajoutée(s)`);
      loadPhotos(modal.id);
    }
  };

  const deletePhoto = async (name: string) => {
    if (!modal?.id) return;
    await supabase.storage.from('operations').remove([`maintenance/${modal.id}/${name}`]);
    loadPhotos(modal.id);
  };

  const openModal = (ticket?: Ticket) => {
    if (ticket) { setModal({...ticket}); setIsNew(false); loadPhotos(ticket.id); }
    else { setModal({...EMPTY_TICKET}); setIsNew(true); setPhotos([]); }
  };

  const saveModal = async () => {
    if (!modal) return;
    if (!modal.title) { toast.warning('Titre obligatoire'); return; }
    if (!modal.property_id) { toast.warning('Propriété obligatoire'); return; }
    setSaving(true);
    const data: any = {
      title: modal.title,
      description: modal.description || '',
      status: modal.status || 'open',
      priority: modal.priority || 'normal',
      category: modal.category || 'autre',
      property_id: modal.property_id,
      room_number: modal.room_number || null,
      reported_by: modal.reported_by || null,
      assigned_to: modal.assigned_to || null,
    };
    if (modal.status === 'resolved' && !modal.resolved_at) {
      data.resolved_at = new Date().toISOString();
    }
    let err;
    if (isNew) {
      ({ error: err } = await supabase.from('maintenance_tickets').insert(data));
    } else {
      ({ error: err } = await supabase.from('maintenance_tickets').update(data).eq('id', modal.id));
    }
    setSaving(false);
    if (err) { toast.error('Erreur: ' + err.message); return; }
    setModal(null);
    load();
  };

  const deleteTicket = () => {
    if (!modal?.id) return;
    setDeleteConfirm({label:`"${modal.title}"`,fn:async()=>{
      const { error } = await supabase.from('maintenance_tickets').delete().eq('id', modal.id);
      if (error) { toast.error('Erreur: ' + error.message); return; }
      setModal(null); load();
    }});
  };

  // Quick status cycle on badge click
  const cycleStatus = async (ticketId: string, currentStatus: string) => {
    const idx = STATUS_ORDER.indexOf(currentStatus);
    const nextStatus = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    const update: any = { status: nextStatus };
    if (nextStatus === 'resolved') update.resolved_at = new Date().toISOString();
    const { error } = await supabase.from('maintenance_tickets').update(update).eq('id', ticketId);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    load();
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
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          {[{v:"active",l:"Actifs"},{v:"all",l:"Tous"},{v:"resolved",l:"Résolus"},{v:"closed",l:"Fermés"}].map(e=>(
            <button key={e.v} onClick={()=>setStatusFilter(e.v)} style={{
              ...S.btn, background:statusFilter===e.v?"#b8860b":"#e5e7eb",color:statusFilter===e.v?"#fff":"#555"
            }}>{e.l}</button>))}
        </div>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}>
          {PROPERTY_FILTER_OPTIONS.map(e=>(
            <button key={e.value} onClick={()=>setPropFilter(e.value)} style={{
              ...S.btn, background:propFilter===e.value?"#1a1a2e":"#e5e7eb",color:propFilter===e.value?"#fff":"#555"
            }}>{e.label}</button>))}
          <button onClick={()=>openModal()} style={{padding:"8px 20px",background:"#3D4A38",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600}}>+ Nouveau ticket</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"16px",marginBottom:"24px"}}>
        <div style={S.card}><p style={S.label}>Tickets ouverts</p><p style={{...S.val,color:openCount>0?"#ef4444":"#22c55e"}}>{openCount}</p></div>
        <div style={S.card}><p style={S.label}>En cours</p><p style={{...S.val,color:"#eab308"}}>{ipCount}</p></div>
        <div style={S.card}><p style={S.label}>Urgents</p><p style={{...S.val,color:urgentCount>0?"#ef4444":"#22c55e"}}>{urgentCount}</p></div>
        <div style={S.card}><p style={S.label}>Résolus</p><p style={{...S.val,color:"#22c55e"}}>{resolvedCount}</p></div>
      </div>

      <div style={{...S.card,padding:0,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"14px"}}>
          <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e5e7eb"}}>
            {["Titre","Propriété","Ch.","Priorité","Statut","Catégorie","Créé le","Assigné"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:600,color:"#555",fontSize:"12px",textTransform:"uppercase"}}>{h}</th>))}
          </tr></thead>
          <tbody>
            {filtered.map(t=>{
              const prop=properties.find(p=>p.id===t.property_id);
              return(<tr key={t.id} style={{borderBottom:"1px solid #f0f0f0",cursor:"pointer"}} onClick={()=>openModal(t)}>
                <td style={{padding:"10px 16px",fontWeight:500,maxWidth:"250px"}}>{t.title}</td>
                <td style={{padding:"10px 16px"}}>{prop?.name||""}</td>
                <td style={{padding:"10px 16px"}}>{t.room_number||"-"}</td>
                <td style={{padding:"10px 16px"}}><span style={{background:PRIO_COLORS[t.priority]||"#94a3b8",color:"#fff",padding:"2px 10px",borderRadius:"12px",fontSize:"12px"}}>{PRIO_LABELS[t.priority]||t.priority}</span></td>
                <td style={{padding:"10px 16px"}}>
                  <span
                    onClick={(e)=>{e.stopPropagation();cycleStatus(t.id,t.status);}}
                    style={{background:STATUS_COLORS[t.status]||"#94a3b8",color:"#fff",padding:"2px 10px",borderRadius:"12px",fontSize:"12px",cursor:"pointer",userSelect:"none"}}
                    title="Cliquer pour changer le statut"
                  >{STATUS_LABELS[t.status]||t.status}</span>
                </td>
                <td style={{padding:"10px 16px",fontSize:"12px"}}>{CAT_LABELS[t.category] || t.category}</td>
                <td style={{padding:"10px 16px",color:"#888",fontSize:"12px"}}>{new Date(t.created_at).toLocaleDateString("fr-FR")}</td>
                <td style={{padding:"10px 16px",color:"#888"}}>{t.assigned_to||"-"}</td>
              </tr>);})}
            {filtered.length===0&&<tr><td colSpan={8} style={{padding:"40px",textAlign:"center",color:"#888"}}>Aucun ticket</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Ticket Modal */}
      {modal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,overflow:'auto',padding:'20px'}} onClick={()=>setModal(null)}>
          <div style={{background:'white',borderRadius:'16px',padding:'28px',width:'600px',maxWidth:'95vw',maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h2 style={{margin:0,fontSize:'20px'}}>{isNew?'Nouveau Ticket':'Modifier Ticket'}</h2>
              <button onClick={()=>setModal(null)} style={{background:'none',border:'none',fontSize:'24px',cursor:'pointer',color:'#888'}}>×</button>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
              <div style={{gridColumn:'1 / -1'}}>
                <label style={S.fieldLabel}>Titre *</label>
                <input style={S.input} value={modal.title||''} onChange={e=>setModal({...modal,title:e.target.value})} placeholder="Résumé du problème"/>
              </div>
              <div>
                <label style={S.fieldLabel}>Propriété *</label>
                <select style={S.input} value={modal.property_id||''} onChange={e=>setModal({...modal,property_id:e.target.value})}>
                  <option value="">Choisir...</option>
                  {properties.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={S.fieldLabel}>Chambre</label>
                <input type="number" style={S.input} value={modal.room_number||''} onChange={e=>setModal({...modal,room_number:parseInt(e.target.value)||null})} placeholder="Optionnel"/>
              </div>
              <div>
                <label style={S.fieldLabel}>Priorité</label>
                <select style={S.input} value={modal.priority||'medium'} onChange={e=>setModal({...modal,priority:e.target.value})}>
                  <option value="low">Basse</option>
                  <option value="normal">Moyenne</option>
                  <option value="high">Haute</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label style={S.fieldLabel}>Catégorie</label>
                <select style={S.input} value={modal.category||'autre'} onChange={e=>setModal({...modal,category:e.target.value})}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{CAT_LABELS[c]||c}</option>)}
                </select>
              </div>
              <div>
                <label style={S.fieldLabel}>Statut</label>
                <select style={S.input} value={modal.status||'open'} onChange={e=>setModal({...modal,status:e.target.value})}>
                  {STATUS_ORDER.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label style={S.fieldLabel}>Assigné à</label>
                <input style={S.input} value={modal.assigned_to||''} onChange={e=>setModal({...modal,assigned_to:e.target.value})} placeholder="Nom du prestataire"/>
              </div>
              <div>
                <label style={S.fieldLabel}>Signalé par</label>
                <select style={S.input} value={modal.reported_by||''} onChange={e=>setModal({...modal,reported_by:e.target.value})}>
                  <option value="">— Aucun —</option>
                  {tenantsLookup.map(t=><option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                </select>
              </div>
            </div>

            <div style={{marginBottom:'16px'}}>
              <label style={S.fieldLabel}>Description</label>
              <textarea style={{...S.input,height:'100px',resize:'vertical'}} value={modal.description||''} onChange={e=>setModal({...modal,description:e.target.value})} placeholder="Détails du problème..."/>
            </div>

            {/* Photos (P2.12) */}
            <div style={{marginBottom:'16px'}}>
              <label style={S.fieldLabel}>Photos</label>
              {photos.length > 0 && (
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'8px'}}>
                  {photos.map(p => (
                    <div key={p.name} style={{position:'relative',width:'80px',height:'80px',borderRadius:'8px',overflow:'hidden',border:'1px solid #e5e7eb'}}>
                      <img src={p.url} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                      <button onClick={()=>deletePhoto(p.name)} style={{position:'absolute',top:'2px',right:'2px',background:'rgba(239,68,68,0.9)',color:'#fff',border:'none',borderRadius:'50%',width:'18px',height:'18px',fontSize:'11px',cursor:'pointer',lineHeight:'18px',padding:0}}>×</button>
                    </div>
                  ))}
                </div>
              )}
              {!isNew && modal?.id ? (
                <label style={{display:'inline-block',padding:'6px 14px',background:'#e5e7eb',borderRadius:'6px',cursor:uploading?'wait':'pointer',fontSize:'13px'}}>
                  {uploading ? 'Upload...' : '📷 Ajouter des photos'}
                  <input type="file" multiple accept="image/*" style={{display:'none'}} onChange={e=>uploadPhotos(e.target.files)} disabled={uploading} />
                </label>
              ) : (
                <p style={{fontSize:'12px',color:'#aaa',fontStyle:'italic'}}>Enregistrez le ticket d'abord pour ajouter des photos.</p>
              )}
            </div>

            {/* Resolved info */}
            {modal.resolved_at && (
              <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:'8px',padding:'10px',marginBottom:'16px',fontSize:'13px',color:'#15803d'}}>
                ✅ Résolu le {new Date(modal.resolved_at).toLocaleDateString('fr-FR')}
              </div>
            )}

            <div style={{display:'flex',gap:'8px',justifyContent:'space-between'}}>
              <div>{!isNew && <button onClick={deleteTicket} style={{padding:'8px 16px',background:'#ef4444',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>Supprimer</button>}</div>
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
