import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { PROSPECT_SOURCE_OPTIONS, PROSPECT_SOURCE_LABELS } from '@/lib/entities';
import { logAudit } from '@/lib/auditLog';

interface Prospect {
  id: string; first_name: string; last_name: string;
  email: string | null; phone: string | null;
  source: string | null; status: string;
  property_interest: string | null; occupation: string | null;
  move_in_date: string | null; lease_duration: string | null;
  notes: string | null; assigned_to: string | null;
  referred_by_tenant_id: string | null;
  lost_reason: string | null;
  is_test: boolean;
  created_at: string;
}

// Locataires actifs proposés dans le dropdown « Parrainé par » (programme parrainage)
interface ReferrerTenant {
  id: string; first_name: string; last_name: string; property_id: string | null;
}

// Statuts autorisés par la contrainte prospects_status_check (11 valeurs).
// do_not_contact : migration 26/07/2026 (scripts/migration-prospects-status-do-not-contact.sql).
// cold (« Froid ») : migration 02/09/2026 (scripts/migration-prospects-status-cold.sql)
//   = prospect en attente (timing lointain, sans réponse…) — ni actif, ni perdu.
// Toute valeur ajoutée ici DOIT l'être aussi dans la contrainte, sinon save
// refusé en 23514 (cf. Schema_Supabase_LaVilla.md §12 point 2bis).
const STATUS_COLORS: Record<string,string> = {
  new: '#3b82f6', contacted: '#eab308', photos_sent: '#06b6d4',
  interested: '#a855f7', visit_scheduled: '#8b5cf6', visit_done: '#f97316',
  contract_sent: '#b8860b', signed: '#22c55e', cold: '#64748b', lost: '#94a3b8',
  do_not_contact: '#475569'
};
const STATUS_LABELS: Record<string,string> = {
  new: 'Nouveau', contacted: 'Contacté', photos_sent: 'Photos envoyées',
  interested: 'Intéressé', visit_scheduled: 'Visite planifiée', visit_done: 'Visite faite',
  contract_sent: 'Contrat envoyé', signed: 'Signé', cold: 'Froid', lost: 'Perdu',
  do_not_contact: 'Ne pas recontacter'
};
// Raisons de perte — alignées sur prospects_lost_reason_check
// (scripts/migration-prospects-lost-reason.sql, 04/08/2026). Obligatoire côté UI
// au passage en « Perdu » : sans raison consignée, impossible de savoir pourquoi
// on perd (constat du 03/08 : 10 perdus, 0 raison).
const LOST_REASON_OPTIONS: Array<[string, string]> = [
  ['trop_cher', 'Trop cher / budget'],
  ['trop_loin', 'Trop loin / trajet'],
  ['timing_decale', 'Timing décalé'],
  ['autre_logement', 'A trouvé un autre logement'],
  ['sans_reponse', 'Sans réponse (relancé)'],
  ['profil_incompatible', 'Profil incompatible'],
  ['chambre_indisponible', 'Aucune chambre à proposer'],
  ['autre', 'Autre'],
];
const LOST_REASON_LABELS: Record<string, string> = Object.fromEntries(LOST_REASON_OPTIONS);

// Colonnes du kanban. Une colonne regroupe plusieurs statuts (ex. « Contacté /
// Photos » = contacted + photos_sent + interested) : plus aucun prospect ne
// disparaît du tableau (avant le 02/09, photos_sent / interested / contract_sent
// n'étaient visibles qu'en vue tableau). Le statut exact est rappelé par une
// pastille sur la carte quand il diffère du statut principal de la colonne.
// `collapsed` = statuts morts repliés par défaut sous la colonne « Froids / Morts ».
interface PipelineColumn {
  key: string; label: string; primary: string; statuses: string[];
  collapsed?: string[];
  next?: string;      // cible du bouton « → étape suivante »
  terminal?: boolean; // signé / froid : pas de rappel « date à renseigner » ni d'alerte date passée
}
const PIPELINE_COLUMNS: PipelineColumn[] = [
  { key:'new',             label:'Nouveau',                primary:'new',             statuses:['new'],                                  next:'contacted' },
  { key:'contacted',       label:'Contacté / Photos',      primary:'contacted',       statuses:['contacted','photos_sent','interested'], next:'visit_scheduled' },
  { key:'visit_scheduled', label:'Visite planifiée',       primary:'visit_scheduled', statuses:['visit_scheduled'],                      next:'visit_done' },
  { key:'visit_done',      label:'Visite faite / Contrat', primary:'visit_done',      statuses:['visit_done','contract_sent'],           next:'signed' },
  { key:'signed',          label:'Signé',                  primary:'signed',          statuses:['signed'],                               terminal:true },
  { key:'cold',            label:'Froids / Morts',         primary:'cold',            statuses:['cold'], collapsed:['lost','do_not_contact'], terminal:true },
];
// Sources prospects : liste centralisée dans entities.ts (alignée sur prospects_source_check)
const SOURCE_OPTIONS = PROSPECT_SOURCE_OPTIONS;
const SOURCE_LABELS = PROSPECT_SOURCE_LABELS;

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
  ['3_mois','3 mois'], ['6_mois','6 mois'], ['12_mois','12 mois'], ['flexible','Flexible'],
];
const DURATION_LABELS: Record<string, string> = Object.fromEntries(DURATION_OPTIONS);

// move_in_date est un `date` Postgres (YYYY-MM-DD) : formatage à la main pour
// éviter le décalage de fuseau de new Date('YYYY-MM-DD') (parsé en UTC).
const fmtDate = (iso: string | null) => iso ? iso.slice(0, 10).split('-').reverse().join('/') : '';
const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const monthLabel = (key: string) => {
  const [y, m] = key.split('-');
  const name = MONTHS_FR[Number(m) - 1] ?? m;
  return name.charAt(0).toUpperCase() + name.slice(1) + ' ' + y;
};
const currentMonthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

interface MonthGroup { key: string; label: string; past: boolean; items: Prospect[] }
// Classement d'une colonne par mois d'emménagement souhaité (croissant) — le
// pivot de la gestion à moyen terme : on voit d'un coup d'œil qui veut arriver
// quand, et qui relancer. Fiches sans date en dernier (les plus récentes d'abord).
const groupByMoveInMonth = (list: Prospect[]): MonthGroup[] => {
  const sorted = [...list].sort((a, b) => {
    if (a.move_in_date && b.move_in_date) {
      return a.move_in_date.localeCompare(b.move_in_date) || b.created_at.localeCompare(a.created_at);
    }
    if (a.move_in_date) return -1;
    if (b.move_in_date) return 1;
    return b.created_at.localeCompare(a.created_at);
  });
  const nowKey = currentMonthKey();
  const groups: MonthGroup[] = [];
  for (const p of sorted) {
    const key = p.move_in_date ? p.move_in_date.slice(0, 7) : 'unknown';
    const last = groups[groups.length - 1];
    if (last && last.key === key) { last.items.push(p); continue; }
    groups.push({
      key,
      label: key === 'unknown' ? 'Date inconnue' : monthLabel(key),
      past: key !== 'unknown' && key < nowKey,
      items: [p],
    });
  }
  return groups;
};

const EMPTY_PROSPECT: Partial<Prospect> = {
  first_name:'', last_name:'', email:null, phone:null,
  source:null, status:'new', property_interest:null,
  occupation:null, move_in_date:null, lease_duration:null,
  notes:null, assigned_to:null, referred_by_tenant_id:null,
  lost_reason:null,
  is_test:false,
};

export default function DashboardProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [activeTenants, setActiveTenants] = useState<ReferrerTenant[]>([]);
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState("active");
  const [viewMode, setViewMode] = useState<'pipeline'|'table'>('pipeline');
  // Vue pipeline : filtre par maison (les fiches « indifférent » restent visibles
  // quelle que soit la maison choisie — ce sont des candidats pour toutes).
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [showDead, setShowDead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Prospect>|null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{label:string,fn:()=>void}|null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    // Parrainage : peut parrainer tout locataire ACTIF, y compris en préavis
    // (is_active reste true jusqu'à la sortie — le préavis n'est pas un statut à part).
    const [pRes, tRes] = await Promise.all([
      supabase.from("prospects").select("*").order("created_at",{ascending:false}),
      supabase.from("tenants").select("id,first_name,last_name,property_id").eq("is_active", true).order("first_name"),
    ]);
    setProspects(pRes.data||[]);
    setActiveTenants(tRes.data||[]);
    setLoading(false);
  },[]);

  useEffect(() => { load(); }, [load]);

  // Statuts terminaux ou en attente volontairement absents : signed, cold, lost,
  // do_not_contact. Un prospect « Froid » ou « Ne pas recontacter » sort donc de
  // la vue « Actifs » — c'est tout l'intérêt de ces statuts. Ils restent visibles
  // via les filtres « Froids » / « Tous » et dans la colonne « Froids / Morts ».
  const active = ["new","contacted","photos_sent","interested","visit_scheduled","visit_done","contract_sent"];
  const pipelineProspects = propertyFilter === 'all'
    ? prospects
    : prospects.filter(p => !p.property_interest || p.property_interest === propertyFilter);
  const filtered = statusFilter==="active" ? prospects.filter(p=>active.includes(p.status))
    : statusFilter==="all" ? prospects : prospects.filter(p=>p.status===statusFilter);

  const totalCount = prospects.length;
  const newCount = prospects.filter(p=>p.status==="new").length;
  const visitCount = prospects.filter(p=>["visit_scheduled","visit_done"].includes(p.status)).length;
  const signedCount = prospects.filter(p=>p.status==="signed").length;
  const conversionRate = totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 0;

  const openModal = (prospect?: Prospect) => {
    if (prospect) { setModal({...prospect}); setIsNew(false); }
    else { setModal({...EMPTY_PROSPECT}); setIsNew(true); }
  };

  const saveModal = async () => {
    if (!modal) return;
    if (!modal.first_name || !modal.last_name) { toast.warning('Prénom et nom obligatoires'); return; }
    // Raison de perte obligatoire au passage en « Perdu » (plan A1, 04/08/2026)
    if (modal.status === 'lost' && !modal.lost_reason) {
      toast.warning('Indique la raison de la perte (menu « Raison de perte »)');
      return;
    }
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
      referred_by_tenant_id: modal.referred_by_tenant_id || null,
      // La raison n'a de sens que pour « Perdu » — nettoyée sinon (retour en pipeline)
      lost_reason: modal.status === 'lost' ? (modal.lost_reason || null) : null,
      // Soumission de test (équipe) : exclue du bulletin SEO et des comptages (21/08/2026)
      is_test: !!modal.is_test,
    };
    // assigned_to : on n'envoie la valeur que si renseignée, pour laisser le défaut DB ('gestionnaire') à l'insert
    if (modal.assigned_to) data.assigned_to = modal.assigned_to;
    const prevStatus = isNew ? null : (prospects.find(p => p.id === modal.id)?.status ?? null);
    let err;
    if (isNew) {
      ({ error: err } = await supabase.from('prospects').insert(data));
    } else {
      ({ error: err } = await supabase.from('prospects').update(data).eq('id', modal.id));
    }
    setSaving(false);
    if (err) { toast.error('Erreur: ' + err.message); return; }
    if (isNew) {
      await logAudit('create', 'prospect', undefined, { name: `${modal.first_name} ${modal.last_name}`, status: data.status });
    } else if (prevStatus && prevStatus !== data.status) {
      await logAudit('status_change', 'prospect', modal.id, {
        from: prevStatus, to: data.status,
        name: `${modal.first_name} ${modal.last_name}`,
        ...(data.status === 'lost' ? { lost_reason: data.lost_reason } : {}),
      });
    }
    setModal(null);
    load();
  };

  const deleteProspect = () => {
    if (!modal?.id) return;
    setDeleteConfirm({label:`${modal.first_name} ${modal.last_name}`,fn:async()=>{
      const { error } = await supabase.from('prospects').delete().eq('id', modal.id);
      if (error) { toast.error('Erreur: ' + error.message); return; }
      await logAudit('delete', 'prospect', modal.id, { name: `${modal.first_name} ${modal.last_name}` });
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
      // Parrainage : c'est la colonne côté tenants qui fait foi pour le versement
      // du crédit de 150 € (bouton « Créditer parrainage » sur la fiche locataire).
      referred_by_tenant_id: modal.referred_by_tenant_id || null,
    };
    const { error } = await supabase.from('tenants').insert(data);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    // Mark prospect as signed
    await supabase.from('prospects').update({ status: 'signed' }).eq('id', modal.id);
    await logAudit('prospect_converted', 'prospect', modal.id, {
      name: `${modal.first_name} ${modal.last_name}`,
      property_id: modal.property_interest,
    });
    toast.success(modal.first_name + ' converti en locataire');
    setModal(null); load();
  };

  // Quick status change via pipeline drag-like click
  const moveToStage = async (prospectId: string, newStatus: string) => {
    const prev = prospects.find(p => p.id === prospectId);
    const { error } = await supabase.from('prospects').update({ status: newStatus }).eq('id', prospectId);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    await logAudit('status_change', 'prospect', prospectId, {
      from: prev?.status ?? null, to: newStatus,
      name: prev ? `${prev.first_name} ${prev.last_name}` : undefined,
    });
    load();
  };

  const exportExcel = async () => {
    const XLSX = await import('xlsx');
    const rows=filtered.map(p=>({Nom:p.first_name+" "+p.last_name,Email:p.email||"",Tél:p.phone||"",
      Métier:p.occupation||"",Source:SOURCE_LABELS[p.source||""]||p.source||"",
      Statut:STATUS_LABELS[p.status]||p.status,
      "Raison perte":p.lost_reason?(LOST_REASON_LABELS[p.lost_reason]||p.lost_reason):"",
      Maison:propertyName(p.property_interest),
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
          {/* En vue pipeline les colonnes SONT les statuts : le filtre de statut
              n'y avait aucun effet (source de confusion). On y propose à la place
              un filtre par maison. */}
          {viewMode === 'pipeline'
            ? ([['all','Toutes maisons'] as [string,string], ...PROPERTY_OPTIONS]).map(([v,l])=>(
              <button key={v} onClick={()=>setPropertyFilter(v)} title={v==='all'?undefined:'Inclut les prospects sans préférence de maison'} style={{
                ...S.btn,background:propertyFilter===v?"#b8860b":"#e5e7eb",color:propertyFilter===v?"#fff":"#555"
              }}>{l}</button>))
            : [{v:"active",l:"Actifs"},{v:"all",l:"Tous"},{v:"signed",l:"Signés"},{v:"cold",l:"Froids"},{v:"lost",l:"Perdus"}].map(e=>(
              <button key={e.v} onClick={()=>setStatusFilter(e.v)} style={{
                ...S.btn,background:statusFilter===e.v?"#b8860b":"#e5e7eb",color:statusFilter===e.v?"#fff":"#555"
              }}>{e.l}</button>))}
        </div>
        <div className="dash-toolbar" style={{display:"flex",gap:"8px",alignItems:"center"}}>
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
      {viewMode === 'pipeline' && (() => {
        const quickBtn = (p: Prospect, target: string, label: string, title: string) => (
          <button key={target} onClick={(e)=>{e.stopPropagation();moveToStage(p.id,target);}} title={title}
            style={{padding:'2px 6px',background:STATUS_COLORS[target]+'20',color:STATUS_COLORS[target],border:`1px solid ${STATUS_COLORS[target]}40`,borderRadius:'4px',fontSize:'10px',cursor:'pointer',whiteSpace:'nowrap'}}>
            {label}
          </button>
        );
        const renderCard = (p: Prospect, col: PipelineColumn) => {
          const color = STATUS_COLORS[p.status] || STATUS_COLORS[col.primary];
          const showStatusBadge = p.status !== col.primary;
          const dateMissing = !p.move_in_date && !col.terminal;
          return (
            <div key={p.id} onClick={()=>openModal(p)} style={{background:'#fff',borderRadius:'8px',padding:'10px 12px',marginBottom:'8px',cursor:'pointer',boxShadow:'0 1px 3px rgba(0,0,0,0.06)',borderLeft:`3px solid ${color}`,transition:'transform 0.15s'}}
              onMouseOver={e=>e.currentTarget.style.transform='translateY(-1px)'}
              onMouseOut={e=>e.currentTarget.style.transform='none'}>
              <div style={{fontWeight:600,fontSize:'13px',color:'#1a1a2e',marginBottom:'4px'}}>{p.first_name} {p.last_name}{p.is_test && <span style={{marginLeft:6,fontSize:10,fontWeight:700,padding:'1px 6px',borderRadius:4,background:'#FEF3C7',color:'#92400E'}}>TEST</span>}</div>
              {showStatusBadge && (
                <div style={{marginBottom:'4px'}}>
                  <span style={{display:'inline-block',fontSize:'10px',fontWeight:600,padding:'1px 7px',borderRadius:'10px',background:color+'20',color}}>
                    {STATUS_LABELS[p.status]||p.status}{p.status==='lost' && p.lost_reason ? ` · ${LOST_REASON_LABELS[p.lost_reason]||p.lost_reason}` : ''}
                  </span>
                </div>
              )}
              {/* Date d'emménagement souhaitée : visible sur chaque fiche, et
                  signalée quand elle manque (c'est elle qui classe la colonne). */}
              {p.move_in_date
                ? <div style={{fontSize:'12px',fontWeight:600,color:'#1a1a2e',marginBottom:'2px'}} title="Date d'emménagement souhaitée">📅 {fmtDate(p.move_in_date)}</div>
                : dateMissing && <div style={{fontSize:'11px',fontWeight:600,color:'#b45309',marginBottom:'2px'}}>📅 Date d'emménagement à renseigner</div>}
              {p.property_interest && <div style={{fontSize:'11px',color:'#888',marginBottom:'2px'}}>🏠 {propertyName(p.property_interest)}</div>}
              {p.occupation && <div style={{fontSize:'11px',color:'#888',marginBottom:'2px'}}>💼 {p.occupation}</div>}
              {p.lease_duration && <div style={{fontSize:'11px',color:'#888',marginBottom:'2px'}}>⏳ {DURATION_LABELS[p.lease_duration]||p.lease_duration}</div>}
              {p.source && <div style={{fontSize:'11px',color:'#b8860b'}}>{SOURCE_LABELS[p.source]||p.source}</div>}
              {p.created_at && <div style={{fontSize:'10px',color:'#aaa',marginTop:'4px'}}>Reçu: {new Date(p.created_at).toLocaleDateString('fr-FR')}</div>}
              {/* Actions rapides : seulement les mouvements qui ont un sens depuis
                  cette colonne (avant : 3 boutons arbitraires, dont deux « Visite »). */}
              <div style={{display:'flex',gap:'4px',marginTop:'6px',flexWrap:'wrap'}}>
                {col.next && quickBtn(p, col.next, `→ ${STATUS_LABELS[col.next]}`, `Passer en « ${STATUS_LABELS[col.next]} »`)}
                {col.key !== 'cold' && p.status !== 'signed' && quickBtn(p, 'cold', '❄ Froid', 'Mettre en attente (prospect froid) : sort du pipeline actif, reste classé par mois d\'emménagement pour la relance')}
                {col.key === 'cold' && p.status !== 'do_not_contact' && quickBtn(p, 'contacted', '↩ Réactiver', 'Remettre dans le pipeline (Contacté)')}
                {!col.terminal && (
                  <button onClick={(e)=>{e.stopPropagation();openModal({...p, status:'lost'});}} title="Marquer perdu (la raison de perte est demandée)"
                    style={{padding:'2px 6px',background:STATUS_COLORS.lost+'20',color:'#475569',border:`1px solid ${STATUS_COLORS.lost}40`,borderRadius:'4px',fontSize:'10px',cursor:'pointer',whiteSpace:'nowrap'}}>
                    ✕ Perdu
                  </button>
                )}
              </div>
            </div>
          );
        };
        const renderGroups = (list: Prospect[], col: PipelineColumn) => groupByMoveInMonth(list).map(g => {
          const warn = g.past && !col.terminal;
          return (
            <div key={g.key}>
              <div title={warn ? 'Date d\'emménagement dépassée : à mettre à jour, ou à passer en Froid / Perdu' : undefined}
                style={{display:'flex',justifyContent:'space-between',fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.03em',color:warn?'#c2410c':'#6b7280',margin:'10px 2px 6px'}}>
                <span>{warn ? '⚠ ' : ''}{g.label}</span><span>{g.items.length}</span>
              </div>
              {g.items.map(p => renderCard(p, col))}
            </div>
          );
        });
        return (
          <div style={{display:'grid',gridTemplateColumns:`repeat(${PIPELINE_COLUMNS.length}, minmax(190px, 1fr))`,gap:'12px',marginBottom:'24px',overflowX:'auto'}}>
            {PIPELINE_COLUMNS.map(col => {
              const color = STATUS_COLORS[col.primary];
              const main = pipelineProspects.filter(p => col.statuses.includes(p.status));
              const collapsedStatuses = col.collapsed ?? [];
              const dead = pipelineProspects.filter(p => collapsedStatuses.includes(p.status));
              return (
                <div key={col.key} style={{background:'#f8f8f8',borderRadius:'12px',padding:'12px',minHeight:'200px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px',paddingBottom:'8px',borderBottom:`3px solid ${color}`}}>
                    <span style={{fontSize:'13px',fontWeight:600,color:'#1a1a2e'}}>{col.label}</span>
                    <span style={{background:color,color:'#fff',padding:'2px 8px',borderRadius:'10px',fontSize:'11px',fontWeight:700}}>{main.length}</span>
                  </div>
                  {main.length===0 && <p style={{textAlign:'center',color:'#ccc',fontSize:'12px',padding:'20px 0'}}>Aucun prospect</p>}
                  {renderGroups(main, col)}
                  {dead.length > 0 && (
                    <div style={{marginTop:'12px',borderTop:'1px dashed #d1d5db',paddingTop:'8px'}}>
                      <button onClick={()=>setShowDead(v=>!v)} style={{...S.btn,width:'100%',background:'#e5e7eb',color:'#555',textAlign:'left'}}>
                        {showDead ? '▾' : '▸'} Perdus / Ne pas recontacter ({dead.length})
                      </button>
                      {showDead && renderGroups(dead, col)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Table View */}
      {viewMode === 'table' && (
        <div style={{...S.card,padding:0,overflow:"auto"}}>
          <table className="dash-table" style={{width:"100%",borderCollapse:"collapse",fontSize:"14px"}}>
            <thead><tr style={{background:"#f8f8f8",borderBottom:"2px solid #e5e7eb"}}>
              {["Nom","Métier","Source","Statut","Maison","Durée","Emménagement","Reçu le","Contact"].map(h=>(
                <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:600,color:"#555",fontSize:"12px",textTransform:"uppercase"}}>{h}</th>))}
            </tr></thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id} style={{borderBottom:"1px solid #f0f0f0",cursor:"pointer"}} onClick={()=>openModal(p)}>
                  <td data-label="Nom" style={{padding:"10px 16px",fontWeight:500}}>{p.first_name} {p.last_name}</td>
                  <td data-label="Métier" style={{padding:"10px 16px",fontSize:"12px"}}>{p.occupation||"-"}</td>
                  <td data-label="Source" style={{padding:"10px 16px",fontSize:"12px"}}>{SOURCE_LABELS[p.source||""]||p.source||"-"}</td>
                  <td data-label="Statut" style={{padding:"10px 16px"}}><span style={{background:STATUS_COLORS[p.status]||"#94a3b8",color:"#fff",padding:"2px 10px",borderRadius:"12px",fontSize:"12px"}}>{STATUS_LABELS[p.status]||p.status}</span></td>
                  <td data-label="Maison" style={{padding:"10px 16px"}}>{propertyName(p.property_interest)}</td>
                  <td data-label="Durée" style={{padding:"10px 16px",color:"#888",fontSize:"12px"}}>{p.lease_duration?(DURATION_LABELS[p.lease_duration]||p.lease_duration):"-"}</td>
                  <td data-label="Emménagement" style={{padding:"10px 16px",fontSize:"12px",fontWeight:500}}>{p.move_in_date?fmtDate(p.move_in_date):<span style={{color:"#b45309"}}>à renseigner</span>}</td>
                  <td data-label="Reçu le" style={{padding:"10px 16px",color:"#888",fontSize:"12px"}}>{p.created_at?new Date(p.created_at).toLocaleDateString("fr-FR"):"-"}</td>
                  <td data-label="Contact" style={{padding:"10px 16px",fontSize:"12px"}}>{p.email && <span title={p.email}>✉️</span>} {p.phone && <a href={'tel:'+p.phone} title={p.phone} style={{textDecoration:'none'}}>📞</a>}</td>
                </tr>))}
              {filtered.length===0&&<tr><td colSpan={9} style={{padding:"40px",textAlign:"center",color:"#888"}}>Aucun prospect</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Prospect Modal */}
      {modal && (
        <div className="dash-modal-overlay" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,overflow:'auto',padding:'20px'}} onClick={()=>setModal(null)}>
          <div className="dash-modal" style={{background:'white',borderRadius:'16px',padding:'28px',width:'600px',maxWidth:'95vw',maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
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
              {modal.status === 'lost' && (
                <div><label style={S.fieldLabel}>Raison de perte *</label>
                  <select style={S.input} value={modal.lost_reason||''} onChange={e=>setModal({...modal,lost_reason:e.target.value||null})}>
                    <option value="">— à renseigner —</option>
                    {LOST_REASON_OPTIONS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              )}
              <div><label style={S.fieldLabel}>Test</label>
                <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer'}}>
                  <input type="checkbox" checked={!!modal.is_test} onChange={e=>setModal({...modal,is_test:e.target.checked})} />
                  Soumission de test — exclue du bulletin et des statistiques
                </label>
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
              {/* Parrainage : rattachement parrain ↔ filleul fait à la main à la
                  qualification (note « Parrain déclaré : … » visible ci-dessous).
                  Éditable quelle que soit la source — un parrainage peut se déclarer
                  après coup. Surligné si source=parrainage sans parrain rattaché. */}
              {(() => {
                const needsReferrer = modal.source === 'parrainage' && !modal.referred_by_tenant_id;
                return (
                  <div>
                    <label style={S.fieldLabel}>Parrainé par</label>
                    <select
                      style={{...S.input, ...(needsReferrer ? {border:'1px solid #f59e0b', background:'#fffbeb'} : {})}}
                      value={modal.referred_by_tenant_id||''}
                      onChange={e=>setModal({...modal,referred_by_tenant_id:e.target.value||null})}
                    >
                      <option value="">— (aucun parrain)</option>
                      {activeTenants.map(t=>(
                        <option key={t.id} value={t.id}>
                          {t.first_name} {t.last_name} — {t.property_id ? (PROPERTY_LABELS[t.property_id] ?? '?') : '?'}
                        </option>
                      ))}
                    </select>
                    {needsReferrer && (
                      <div style={{fontSize:'10px',color:'#b45309',marginTop:'2px'}}>↳ source « Parrainage » : rattachement à faire</div>
                    )}
                  </div>
                );
              })()}
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
        <div className="dash-modal-overlay" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000}} onClick={()=>setDeleteConfirm(null)}>
          <div className="dash-modal dash-modal-compact" style={{background:'white',borderRadius:'12px',padding:'24px',width:'400px',maxWidth:'90vw'}} onClick={e=>e.stopPropagation()}>
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
