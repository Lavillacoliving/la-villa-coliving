import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { PROSPECT_SOURCE_OPTIONS, PROSPECT_SOURCE_LABELS } from '@/lib/entities';
import { logAudit } from '@/lib/auditLog';
import { useIsMobile } from '@/hooks/use-mobile';

interface Prospect {
  id: string; first_name: string; last_name: string;
  email: string | null; phone: string | null;
  source: string | null; status: string;
  property_interest: string | null; occupation: string | null;
  move_in_date: string | null; lease_duration: string | null;
  notes: string | null; assigned_to: string | null;
  referred_by_tenant_id: string | null;
  lost_reason: string | null;
  // Date de relance (colonne existante next_followup_date) — affichée pour « À recontacter »
  next_followup_date: string | null;
  is_test: boolean;
  created_at: string;
}

// Locataires actifs proposés dans le dropdown « Parrainé par » (programme parrainage)
interface ReferrerTenant {
  id: string; first_name: string; last_name: string; property_id: string | null;
}

// Alerte chambre = inscription « Juste me prévenir » des pages maisons (table waitlist,
// écrite par le site depuis le 03/09/2026). Lue/traitée par le dashboard (policies
// is_admin(), migration scripts/migration-prospects-recontact-waitlist-alerts-2026-09-03.sql).
interface RoomAlert {
  id: string; created_at: string;
  nom: string; email: string;
  profil: string | null; propriete_souhaitee: string | null;
  date_souhaitee: string | null; message: string | null;
  prospect_id: string | null; handled_at: string | null;
}

// Statuts autorisés par la contrainte prospects_status_check (12 valeurs).
// do_not_contact : migration 26/07/2026 (scripts/migration-prospects-status-do-not-contact.sql).
// cold (« Froid ») : migration 02/09/2026 (scripts/migration-prospects-status-cold.sql).
// recontact (« À recontacter ») : migration 03/09/2026
//   (scripts/migration-prospects-recontact-waitlist-alerts-2026-09-03.sql) = à relancer
//   plus tard, date de relance facultative dans next_followup_date.
// Toute valeur ajoutée ici DOIT l'être aussi dans la contrainte, sinon save
// refusé en 23514 (cf. Schema_Supabase_LaVilla.md §12 point 2bis).
const STATUS_COLORS: Record<string,string> = {
  new: '#3b82f6', contacted: '#eab308', photos_sent: '#06b6d4',
  interested: '#a855f7', visit_scheduled: '#8b5cf6', visit_done: '#f97316',
  contract_sent: '#b8860b', signed: '#22c55e', recontact: '#d97706', cold: '#64748b',
  lost: '#94a3b8', do_not_contact: '#475569',
};
const STATUS_LABELS: Record<string,string> = {
  new: 'Nouveau à contacter', contacted: 'Contacté', photos_sent: 'Photos envoyées',
  interested: 'Intéressé', visit_scheduled: 'Visite planifiée', visit_done: 'Visite faite',
  contract_sent: 'Contrat à faire', signed: 'Contrat signé', recontact: 'À recontacter',
  cold: 'Froid', lost: 'Perdu', do_not_contact: 'Ne pas recontacter',
};
const ALERT_COLOR = '#0d9488';
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

// Colonnes du kanban v2 (maquette validée par Jérôme le 03/09/2026) :
//   parcours  : Nouveau à contacter → Contacté → Visite planifiée → Visite faite
//               → Contrat à faire → Contrat signé
//   attente   : À recontacter · Ne pas recontacter · Froid (Perdus repliés dessous)
// Une colonne regroupe parfois plusieurs statuts (« Contacté » = contacted +
// photos_sent + interested) : le statut exact est rappelé par une pastille sur la
// carte quand il diffère du statut principal. `quick` = boutons secondaires de la
// carte (le bouton « → étape suivante » vient de `next`, « ✕ Perdu » ouvre la fiche).
interface PipelineColumn {
  key: string; label: string; primary: string; statuses: string[];
  collapsed?: string[];
  next?: string;
  quick: string[];
  terminal?: boolean; // signé / attente : pas de rappel « date à renseigner » ni d'alerte date passée
  wait?: boolean;     // colonnes d'attente (après le séparateur)
}
const PIPELINE_COLUMNS: PipelineColumn[] = [
  { key:'new',             label:'Nouveau à contacter', primary:'new',             statuses:['new'],                                  next:'contacted',       quick:['recontact','do_not_contact','cold'] },
  { key:'contacted',       label:'Contacté',            primary:'contacted',       statuses:['contacted','photos_sent','interested'], next:'visit_scheduled', quick:['recontact','do_not_contact','cold'] },
  { key:'visit_scheduled', label:'Visite planifiée',    primary:'visit_scheduled', statuses:['visit_scheduled'],                      next:'visit_done',      quick:['recontact','do_not_contact','cold'] },
  { key:'visit_done',      label:'Visite faite',        primary:'visit_done',      statuses:['visit_done'],                           next:'contract_sent',   quick:['cold'] },
  { key:'contract_sent',   label:'Contrat à faire',     primary:'contract_sent',   statuses:['contract_sent'],                        next:'signed',          quick:['cold'] },
  { key:'signed',          label:'Contrat signé',       primary:'signed',          statuses:['signed'],                               quick:[], terminal:true },
  { key:'recontact',       label:'À recontacter',       primary:'recontact',       statuses:['recontact'],                            quick:['contacted','do_not_contact'], terminal:true, wait:true },
  { key:'do_not_contact',  label:'Ne pas recontacter',  primary:'do_not_contact',  statuses:['do_not_contact'],                       quick:['contacted'], terminal:true, wait:true },
  { key:'cold',            label:'Froid',               primary:'cold',            statuses:['cold'], collapsed:['lost'],             quick:['contacted','do_not_contact'], terminal:true, wait:true },
];
const QUICK_LABELS: Record<string, { label: string; title: string }> = {
  recontact:      { label: '↻ À recontacter',      title: 'Mettre de côté pour une relance plus tard (colonne « À recontacter », date de relance dans la fiche)' },
  do_not_contact: { label: '⛔ Ne pas recontacter', title: 'Ne plus solliciter cette personne (colonne « Ne pas recontacter »)' },
  cold:           { label: '❄ Froid',              title: 'Prospect froid : sort du pipeline actif, reste classé par mois d\'emménagement' },
  contacted:      { label: '↩ Réactiver',          title: 'Remettre dans le pipeline (Contacté)' },
};
const columnOf = (status: string): PipelineColumn =>
  PIPELINE_COLUMNS.find(c => c.statuses.includes(status) || (c.collapsed ?? []).includes(status)) ?? PIPELINE_COLUMNS[0];

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
// waitlist.propriete_souhaitee = slug (sans tiret, comme v_public_rooms) → UUID properties
const PROPERTY_BY_SLUG: Record<string, string> = {
  lavilla: 'd39d074a-ad6d-471c-b7c7-0e576521730e',
  leloft: '177ebcb2-6852-461c-8150-d416aa62ecf1',
  lelodge: '45175bde-8b94-446a-9dd4-e6dee4b5a509',
  montblanc: '57ecaa58-81e3-4c8c-8681-d5ac50b0d437',
};

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
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const currentMonthKey = () => todayKey().slice(0, 7);

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
  lost_reason:null, next_followup_date:null,
  is_test:false,
};

export default function DashboardProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [alerts, setAlerts] = useState<RoomAlert[]>([]);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [activeTenants, setActiveTenants] = useState<ReferrerTenant[]>([]);
  const toast = useToast();
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState("active");
  const [viewMode, setViewMode] = useState<'pipeline'|'table'>('pipeline');
  // Vue pipeline : filtre par maison (les fiches « indifférent » restent visibles
  // quelle que soit la maison choisie — ce sont des candidats pour toutes).
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [showDead, setShowDead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Prospect>|null>(null);
  const [isNew, setIsNew] = useState(false);
  // Alerte chambre en cours de conversion : liée à la fiche dès qu'elle est enregistrée.
  const [pendingAlertId, setPendingAlertId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{label:string,fn:()=>void}|null>(null);
  // Mobile : onglet « Aujourd'hui » / « Colonnes », colonne affichée, feuille d'actions.
  const [mobileTab, setMobileTab] = useState<'today'|'columns'>('today');
  const [mobileCol, setMobileCol] = useState<string>('new');
  const [sheet, setSheet] = useState<Prospect | null>(null);
  const touchX = useRef<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    // Parrainage : peut parrainer tout locataire ACTIF, y compris en préavis
    // (is_active reste true jusqu'à la sortie — le préavis n'est pas un statut à part).
    const [pRes, tRes, aRes] = await Promise.all([
      supabase.from("prospects").select("*").order("created_at",{ascending:false}),
      supabase.from("tenants").select("id,first_name,last_name,property_id").eq("is_active", true).order("first_name"),
      supabase.from("waitlist").select("*").is("handled_at", null).order("created_at",{ascending:false}),
    ]);
    setProspects(pRes.data||[]);
    setActiveTenants(tRes.data||[]);
    // Alertes : si la migration du 03/09 n'est pas passée (policy absente → 42501), on
    // l'affiche plutôt que de faire croire à une colonne vide.
    setAlerts(aRes.error ? [] : ((aRes.data as RoomAlert[] | null) || []));
    setAlertsError(aRes.error ? aRes.error.message : null);
    setLoading(false);
  },[]);

  useEffect(() => { load(); }, [load]);

  // Statuts terminaux ou en attente volontairement absents : signed, recontact, cold,
  // lost, do_not_contact. Ils restent visibles via les filtres et leurs colonnes.
  const active = ["new","contacted","photos_sent","interested","visit_scheduled","visit_done","contract_sent"];
  const pipelineProspects = propertyFilter === 'all'
    ? prospects
    : prospects.filter(p => !p.property_interest || p.property_interest === propertyFilter);
  const pipelineAlerts = propertyFilter === 'all'
    ? alerts
    : alerts.filter(a => !a.propriete_souhaitee || PROPERTY_BY_SLUG[a.propriete_souhaitee] === propertyFilter);
  const filtered = statusFilter==="active" ? prospects.filter(p=>active.includes(p.status))
    : statusFilter==="all" ? prospects : prospects.filter(p=>p.status===statusFilter);

  const totalCount = prospects.length;
  const newCount = prospects.filter(p=>p.status==="new").length;
  const visitCount = prospects.filter(p=>["visit_scheduled","visit_done"].includes(p.status)).length;
  const signedCount = prospects.filter(p=>p.status==="signed").length;
  const conversionRate = totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 0;
  const today = todayKey();
  // « Aujourd'hui » (mobile) : ce qui attend une action, dans l'ordre d'urgence.
  const overdueFollowups = prospects.filter(p => p.status === 'recontact' && !!p.next_followup_date && p.next_followup_date <= today);
  const overdueMoveIns = prospects.filter(p => active.includes(p.status) && !!p.move_in_date && p.move_in_date < today);
  const todayCount = alerts.length + newCount + overdueFollowups.length + overdueMoveIns.length;

  const openModal = (prospect?: Prospect) => {
    setPendingAlertId(null);
    if (prospect) { setModal({...prospect}); setIsNew(false); }
    else { setModal({...EMPTY_PROSPECT}); setIsNew(true); }
  };

  // Alerte chambre → fiche prospect pré-remplie (nom complété par Jérôme, puis
  // enregistrée) ; l'alerte est marquée traitée et liée à la fiche à l'enregistrement.
  const createProspectFromAlert = (a: RoomAlert) => {
    const month = a.date_souhaitee && /^\d{4}-\d{2}$/.test(a.date_souhaitee) ? a.date_souhaitee : null;
    setModal({
      ...EMPTY_PROSPECT,
      first_name: a.nom, last_name: '',
      email: a.email,
      source: 'site_web', status: 'new',
      property_interest: a.propriete_souhaitee ? (PROPERTY_BY_SLUG[a.propriete_souhaitee] ?? null) : null,
      move_in_date: month ? `${month}-01` : null,
      notes: `Alerte chambre (site, « Juste me prévenir ») reçue le ${new Date(a.created_at).toLocaleDateString('fr-FR')}`
        + (month ? ` — souhaite emménager en ${monthLabel(month).toLowerCase()}` : '')
        + (a.message ? ` — ${a.message}` : ''),
    });
    setIsNew(true);
    setPendingAlertId(a.id);
  };

  const ignoreAlert = async (a: RoomAlert) => {
    const { error } = await supabase.from('waitlist').update({ handled_at: new Date().toISOString() }).eq('id', a.id);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    await logAudit('update', 'prospect', undefined, { alert_ignored: a.id, name: a.nom, email: a.email });
    toast.success('Alerte ignorée');
    load();
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
      // Date de relance (« À recontacter ») — conservée telle quelle pour les autres statuts
      next_followup_date: modal.next_followup_date || null,
      // Soumission de test (équipe) : exclue du bulletin SEO et des comptages (21/08/2026)
      is_test: !!modal.is_test,
    };
    // assigned_to : on n'envoie la valeur que si renseignée, pour laisser le défaut DB ('gestionnaire') à l'insert
    if (modal.assigned_to) data.assigned_to = modal.assigned_to;
    const prevStatus = isNew ? null : (prospects.find(p => p.id === modal.id)?.status ?? null);
    let err;
    let newId: string | null = null;
    if (isNew) {
      const res = await supabase.from('prospects').insert(data).select('id').single();
      err = res.error; newId = (res.data as { id: string } | null)?.id ?? null;
    } else {
      ({ error: err } = await supabase.from('prospects').update(data).eq('id', modal.id));
    }
    setSaving(false);
    if (err) { toast.error('Erreur: ' + err.message); return; }
    if (isNew) {
      await logAudit('create', 'prospect', newId ?? undefined, { name: `${modal.first_name} ${modal.last_name}`, status: data.status, ...(pendingAlertId ? { from_alert: pendingAlertId } : {}) });
      if (pendingAlertId) {
        const { error: aErr } = await supabase.from('waitlist')
          .update({ prospect_id: newId, handled_at: new Date().toISOString() }).eq('id', pendingAlertId);
        if (aErr) toast.warning('Fiche créée, mais l\'alerte n\'a pas pu être marquée traitée : ' + aErr.message);
        else toast.success('Fiche créée depuis l\'alerte chambre');
      }
    } else if (prevStatus && prevStatus !== data.status) {
      await logAudit('status_change', 'prospect', modal.id, {
        from: prevStatus, to: data.status,
        name: `${modal.first_name} ${modal.last_name}`,
        ...(data.status === 'lost' ? { lost_reason: data.lost_reason } : {}),
        ...(data.status === 'recontact' && data.next_followup_date ? { next_followup_date: data.next_followup_date } : {}),
      });
    }
    setModal(null);
    setPendingAlertId(null);
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

  // Changement de statut en un clic (boutons des cartes, feuille d'actions mobile)
  const moveToStage = async (prospectId: string, newStatus: string) => {
    const prev = prospects.find(p => p.id === prospectId);
    const { error } = await supabase.from('prospects').update({ status: newStatus }).eq('id', prospectId);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    await logAudit('status_change', 'prospect', prospectId, {
      from: prev?.status ?? null, to: newStatus,
      name: prev ? `${prev.first_name} ${prev.last_name}` : undefined,
    });
    setSheet(null);
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
      "Relance prévue":p.next_followup_date||"",
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

  // ── Rendu partagé ──────────────────────────────────────────────────────────
  const quickBtn = (p: Prospect, target: string, label: string, title: string) => (
    <button key={target} onClick={(e)=>{e.stopPropagation();moveToStage(p.id,target);}} title={title}
      style={{padding:'2px 6px',background:STATUS_COLORS[target]+'20',color:STATUS_COLORS[target],border:`1px solid ${STATUS_COLORS[target]}40`,borderRadius:'4px',fontSize:'10px',cursor:'pointer',whiteSpace:'nowrap'}}>
      {label}
    </button>
  );
  const lostBtn = (p: Prospect, big = false) => (
    <button onClick={(e)=>{e.stopPropagation();setSheet(null);setModal({...p, status:'lost'});setIsNew(false);}} title="Marquer perdu (la raison de perte est demandée)"
      style={big
        ? {display:'flex',alignItems:'center',gap:10,width:'100%',padding:'12px 10px',borderRadius:'10px',fontSize:'14px',fontWeight:600,background:STATUS_COLORS.lost+'20',color:'#475569',border:'none',textAlign:'left',minHeight:'44px'}
        : {padding:'2px 6px',background:STATUS_COLORS.lost+'20',color:'#475569',border:`1px solid ${STATUS_COLORS.lost}40`,borderRadius:'4px',fontSize:'10px',cursor:'pointer',whiteSpace:'nowrap'}}>
      ✕ Perdu{big ? ' (raison demandée)' : ''}
    </button>
  );
  const followupLine = (p: Prospect) => p.status === 'recontact' && p.next_followup_date ? (
    <div style={{fontSize:'11px',fontWeight:600,color:p.next_followup_date <= today ? '#c2410c' : '#b45309',marginBottom:'2px'}} title="Date de relance prévue">
      ↻ relance {p.next_followup_date <= today ? 'à faire (' : 'le '}{fmtDate(p.next_followup_date)}{p.next_followup_date <= today ? ')' : ''}
    </div>
  ) : null;

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
        {followupLine(p)}
        {p.property_interest && <div style={{fontSize:'11px',color:'#888',marginBottom:'2px'}}>🏠 {propertyName(p.property_interest)}</div>}
        {p.occupation && <div style={{fontSize:'11px',color:'#888',marginBottom:'2px'}}>💼 {p.occupation}</div>}
        {p.lease_duration && <div style={{fontSize:'11px',color:'#888',marginBottom:'2px'}}>⏳ {DURATION_LABELS[p.lease_duration]||p.lease_duration}</div>}
        {p.source && <div style={{fontSize:'11px',color:'#b8860b'}}>{SOURCE_LABELS[p.source]||p.source}</div>}
        {p.created_at && <div style={{fontSize:'10px',color:'#aaa',marginTop:'4px'}}>Reçu: {new Date(p.created_at).toLocaleDateString('fr-FR')}</div>}
        {/* Actions rapides : l'étape suivante, puis les mouvements qui ont un sens
            depuis cette colonne (À recontacter / Ne pas recontacter jusqu'à la visite). */}
        <div style={{display:'flex',gap:'4px',marginTop:'6px',flexWrap:'wrap'}}>
          {col.next && quickBtn(p, col.next, `→ ${STATUS_LABELS[col.next]}`, `Passer en « ${STATUS_LABELS[col.next]} »`)}
          {col.quick.filter(t => t !== p.status).map(t => quickBtn(p, t, QUICK_LABELS[t].label, QUICK_LABELS[t].title))}
          {!col.terminal && lostBtn(p)}
        </div>
      </div>
    );
  };
  const renderGroups = (list: Prospect[], col: PipelineColumn, card: (p: Prospect, col: PipelineColumn) => React.ReactNode = renderCard) => groupByMoveInMonth(list).map(g => {
    const warn = g.past && !col.terminal;
    return (
      <div key={g.key}>
        <div title={warn ? 'Date d\'emménagement dépassée : à mettre à jour, ou à passer en Froid / Perdu' : undefined}
          style={{display:'flex',justifyContent:'space-between',fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.03em',color:warn?'#c2410c':'#6b7280',margin:'10px 2px 6px'}}>
          <span>{warn ? '⚠ ' : ''}{g.label}</span><span>{g.items.length}</span>
        </div>
        {g.items.map(p => card(p, col))}
      </div>
    );
  });

  // Alerte chambre (waitlist) : carte + deux actions
  const alertMonth = (a: RoomAlert) => a.date_souhaitee && /^\d{4}-\d{2}/.test(a.date_souhaitee) ? monthLabel(a.date_souhaitee.slice(0, 7)) : (a.date_souhaitee || 'Mois inconnu');
  const renderAlert = (a: RoomAlert, compact = false) => (
    <div key={a.id} style={{background:'#fff',borderRadius:'8px',padding:'10px 12px',marginBottom:'8px',boxShadow:'0 1px 3px rgba(0,0,0,0.06)',borderLeft:`3px solid ${ALERT_COLOR}`}}>
      <div style={{fontWeight:600,fontSize:compact?'14px':'13px',color:'#1a1a2e',marginBottom:'4px'}}>{a.nom}</div>
      <div style={{fontSize:'12px',fontWeight:600,color:'#1a1a2e',marginBottom:'2px'}}>📅 {alertMonth(a)}</div>
      {a.propriete_souhaitee && <div style={{fontSize:'11px',color:'#888',marginBottom:'2px'}}>🏠 {propertyName(PROPERTY_BY_SLUG[a.propriete_souhaitee] ?? null)}</div>}
      <div style={{fontSize:'11px',color:'#888',marginBottom:'2px',overflow:'hidden',textOverflow:'ellipsis'}}>✉️ <a href={'mailto:'+a.email} onClick={e=>e.stopPropagation()} style={{color:'#888'}}>{a.email}</a></div>
      <div style={{fontSize:'11px',color:'#b8860b'}}>Site · « Juste me prévenir »</div>
      <div style={{fontSize:'10px',color:'#aaa',marginTop:'4px'}}>Reçu: {new Date(a.created_at).toLocaleDateString('fr-FR')}</div>
      <div style={{display:'flex',gap:'4px',marginTop:'6px',flexWrap:'wrap'}}>
        <button onClick={()=>createProspectFromAlert(a)} title="Ouvrir une fiche prospect pré-remplie (Nouveau à contacter) et marquer l'alerte traitée à l'enregistrement"
          style={compact
            ? {flex:1,padding:'10px',borderRadius:'8px',fontSize:'13px',fontWeight:600,background:ALERT_COLOR+'20',color:ALERT_COLOR,border:`1px solid ${ALERT_COLOR}55`,minHeight:'44px'}
            : {padding:'2px 6px',background:ALERT_COLOR+'20',color:ALERT_COLOR,border:`1px solid ${ALERT_COLOR}40`,borderRadius:'4px',fontSize:'10px',cursor:'pointer',whiteSpace:'nowrap'}}>
          → Créer le prospect
        </button>
        <button onClick={()=>ignoreAlert(a)} title="Marquer l'alerte traitée sans créer de fiche (doublon, adresse fantaisiste…)"
          style={compact
            ? {padding:'10px 14px',borderRadius:'8px',fontSize:'13px',background:STATUS_COLORS.lost+'20',color:'#475569',border:`1px solid ${STATUS_COLORS.lost}40`,minHeight:'44px'}
            : {padding:'2px 6px',background:STATUS_COLORS.lost+'20',color:'#475569',border:`1px solid ${STATUS_COLORS.lost}40`,borderRadius:'4px',fontSize:'10px',cursor:'pointer',whiteSpace:'nowrap'}}>
          ✕ Ignorer
        </button>
      </div>
    </div>
  );
  const alertsByMonth = (list: RoomAlert[]) => {
    const map = new Map<string, RoomAlert[]>();
    for (const a of [...list].sort((x, y) => (x.date_souhaitee || 'zz').localeCompare(y.date_souhaitee || 'zz') || y.created_at.localeCompare(x.created_at))) {
      const k = alertMonth(a);
      map.set(k, [...(map.get(k) ?? []), a]);
    }
    return [...map.entries()];
  };

  // ── Mobile : carte compacte + feuille d'actions ────────────────────────────
  const primaryAction = (p: Prospect) => {
    const col = columnOf(p.status);
    if (col.next) return { target: col.next, label: `→ ${STATUS_LABELS[col.next]}` };
    if (col.wait) return { target: 'contacted', label: '↩ Réactiver' };
    return null;
  };
  const renderCompact = (p: Prospect, col: PipelineColumn) => {
    const color = STATUS_COLORS[p.status] || STATUS_COLORS[col.primary];
    const act = primaryAction(p);
    return (
      <div key={p.id} style={{background:'#fff',borderRadius:'10px',padding:'10px 12px',marginBottom:'8px',boxShadow:'0 1px 3px rgba(0,0,0,0.06)',borderLeft:`3px solid ${color}`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
          <button onClick={()=>openModal(p)} style={{background:'none',border:'none',padding:0,textAlign:'left',fontWeight:600,fontSize:'14px',color:'#1a1a2e',flex:1,minWidth:0}}>
            {p.first_name} {p.last_name}{p.is_test && <span style={{marginLeft:6,fontSize:10,fontWeight:700,padding:'1px 6px',borderRadius:4,background:'#FEF3C7',color:'#92400E'}}>TEST</span>}
            {p.status !== col.primary && <span style={{marginLeft:6,fontSize:'10px',fontWeight:600,padding:'1px 7px',borderRadius:'10px',background:color+'20',color}}>{STATUS_LABELS[p.status]||p.status}</span>}
          </button>
          <button onClick={()=>setSheet(p)} aria-label="Autres actions" className="dash-tap-keep" style={{width:36,height:36,borderRadius:8,border:'1px solid #e5e7eb',background:'#fff',color:'#6b7280',fontSize:16,letterSpacing:1,flexShrink:0}}>···</button>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',fontSize:'12px',color:'#6b7280',marginTop:2}}>
          {p.move_in_date
            ? <span style={{fontWeight:600,color:'#1a1a2e'}}>📅 {fmtDate(p.move_in_date)}</span>
            : !col.terminal && <span style={{fontWeight:600,color:'#b45309'}}>📅 date à renseigner</span>}
          {p.property_interest && <span>🏠 {propertyName(p.property_interest)}</span>}
          {p.source && <span style={{color:'#b8860b'}}>{SOURCE_LABELS[p.source]||p.source}</span>}
        </div>
        {followupLine(p)}
        {act && (
          <button onClick={()=>moveToStage(p.id, act.target)}
            style={{display:'block',width:'100%',marginTop:8,padding:'10px',borderRadius:'8px',fontSize:'13px',fontWeight:600,background:STATUS_COLORS[act.target]+'20',color:STATUS_COLORS[act.target],border:`1px solid ${STATUS_COLORS[act.target]}55`,minHeight:'44px'}}>
            {act.label}
          </button>
        )}
      </div>
    );
  };
  const mobileColumns = [{ key:'alerts', label:'Alertes', color:ALERT_COLOR, count:pipelineAlerts.length }, ...PIPELINE_COLUMNS.map(c => ({
    key:c.key, label:c.label, color:STATUS_COLORS[c.primary],
    count: pipelineProspects.filter(p => c.statuses.includes(p.status)).length,
  }))];
  const mobileIndex = Math.max(0, mobileColumns.findIndex(c => c.key === mobileCol));
  const swipe = {
    onTouchStart: (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current; touchX.current = null;
      if (Math.abs(dx) < 60) return;
      const next = mobileColumns[mobileIndex + (dx < 0 ? 1 : -1)];
      if (next) setMobileCol(next.key);
    },
  };
  const sectionTitle = (label: string, n: number, hot = false) => (
    <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',color:hot?'#c2410c':'#6b7280',margin:'14px 2px 6px'}}><span>{label}</span><span>{n}</span></div>
  );

  return (
    <div style={isMobile && viewMode === 'pipeline' ? {paddingBottom: 72} : undefined}>
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
            : [{v:"active",l:"Actifs"},{v:"all",l:"Tous"},{v:"signed",l:"Signés"},{v:"recontact",l:"À recontacter"},{v:"do_not_contact",l:"Ne pas recontacter"},{v:"cold",l:"Froids"},{v:"lost",l:"Perdus"}].map(e=>(
              <button key={e.v} onClick={()=>setStatusFilter(e.v)} style={{
                ...S.btn,background:statusFilter===e.v?"#b8860b":"#e5e7eb",color:statusFilter===e.v?"#fff":"#555"
              }}>{e.l}</button>))}
        </div>
        <div className="dash-toolbar" style={{display:"flex",gap:"8px",alignItems:"center"}}>
          {!isMobile && <button onClick={()=>setViewMode(viewMode==='pipeline'?'table':'pipeline')} style={{...S.btn,background:"#1a1a2e",color:"#fff"}}>{viewMode==='pipeline'?'Vue tableau':'Vue pipeline'}</button>}
          <button onClick={exportExcel} style={{...S.btn,background:"#1a1a2e",color:"#fff"}}>Export Excel</button>
          <button onClick={()=>openModal()} style={{padding:"8px 20px",background:"#3D4A38",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600}}>+ Nouveau prospect</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"16px",marginBottom:"24px"}}>
        <div style={S.card}><p style={S.label}>Alertes chambre à traiter</p><p style={{...S.val,color:ALERT_COLOR}}>{alerts.length}</p></div>
        <div style={S.card}><p style={S.label}>Nouveaux à contacter</p><p style={{...S.val,color:"#3b82f6"}}>{newCount}</p></div>
        <div style={S.card}><p style={S.label}>Visites</p><p style={{...S.val,color:"#8b5cf6"}}>{visitCount}</p></div>
        <div style={S.card}><p style={S.label}>Contrats signés</p><p style={{...S.val,color:"#22c55e"}}>{signedCount}</p></div>
        <div style={S.card}><p style={S.label}>Taux conversion</p><p style={{...S.val,color:conversionRate>=40?"#22c55e":"#eab308"}}>{conversionRate}%</p></div>
      </div>
      {alertsError && (
        <div style={{background:'#FEF3C7',color:'#92400E',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',marginBottom:'16px'}}>
          ⚠️ Alertes chambre indisponibles : {alertsError}. La migration <code>scripts/migration-prospects-recontact-waitlist-alerts-2026-09-03.sql</code> doit être passée dans Supabase.
        </div>
      )}

      {/* ── Pipeline : ordinateur ── */}
      {viewMode === 'pipeline' && !isMobile && (
        <div className="dash-scroll-x" style={{overflowX:'auto',marginBottom:'24px'}}>
          <div className="dash-grid-keep" style={{display:'grid',gridTemplateColumns:`210px repeat(6, minmax(190px, 1fr)) 14px repeat(3, minmax(190px, 1fr))`,gap:'12px',minWidth:'max-content',alignItems:'start'}}>
            {/* Alertes chambre */}
            <div style={{background:ALERT_COLOR+'0f',outline:`2px dashed ${ALERT_COLOR}`,outlineOffset:'-2px',borderRadius:'12px',padding:'12px',minHeight:'200px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px',paddingBottom:'8px',borderBottom:`3px solid ${ALERT_COLOR}`}}>
                <span style={{fontSize:'13px',fontWeight:600,color:'#1a1a2e'}}>Alertes chambre</span>
                <span style={{background:ALERT_COLOR,color:'#fff',padding:'2px 8px',borderRadius:'10px',fontSize:'11px',fontWeight:700}}>{pipelineAlerts.length}</span>
              </div>
              {pipelineAlerts.length===0 && <p style={{textAlign:'center',color:'#9ca3af',fontSize:'12px',padding:'20px 0'}}>Aucune alerte à traiter</p>}
              {alertsByMonth(pipelineAlerts).map(([label, items]) => (
                <div key={label}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.03em',color:'#6b7280',margin:'10px 2px 6px'}}><span>{label}</span><span>{items.length}</span></div>
                  {items.map(a => renderAlert(a))}
                </div>
              ))}
            </div>
            {PIPELINE_COLUMNS.map((col, i) => {
              const color = STATUS_COLORS[col.primary];
              const main = pipelineProspects.filter(p => col.statuses.includes(p.status));
              const dead = pipelineProspects.filter(p => (col.collapsed ?? []).includes(p.status));
              const column = (
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
                        {showDead ? '▾' : '▸'} Perdus ({dead.length})
                      </button>
                      {showDead && renderGroups(dead, col)}
                    </div>
                  )}
                </div>
              );
              // Séparateur avant les colonnes d'attente
              return col.wait && !PIPELINE_COLUMNS[i-1]?.wait
                ? [<div key="sep" style={{alignSelf:'stretch',borderLeft:'2px dashed #d1d5db',position:'relative'}}><span style={{position:'absolute',top:6,left:'50%',transform:'translateX(-50%) rotate(180deg)',writingMode:'vertical-rl',fontSize:'10px',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#9ca3af',whiteSpace:'nowrap'}}>En attente</span></div>, column]
                : column;
            })}
          </div>
        </div>
      )}

      {/* ── Pipeline : mobile ── */}
      {viewMode === 'pipeline' && isMobile && (
        <div>
          {mobileTab === 'today' && (
            <div style={{background:'#f8f8f8',borderRadius:'12px',padding:'12px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:4}}>
                <b style={{fontSize:'15px'}}>À traiter aujourd'hui</b>
                <small style={{fontSize:'11px',color:'#6b7280'}}>{new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'short'})}</small>
              </div>
              {todayCount === 0 && <p style={{textAlign:'center',color:'#9ca3af',fontSize:'13px',padding:'24px 0'}}>Rien à traiter — tout est à jour ✓</p>}
              {alerts.length > 0 && <>{sectionTitle('Alertes chambre', alerts.length, true)}{alerts.map(a => renderAlert(a, true))}</>}
              {newCount > 0 && <>{sectionTitle('Nouveaux sans contact', newCount, true)}{groupByMoveInMonth(prospects.filter(p => p.status === 'new')).flatMap(g => g.items).map(p => renderCompact(p, columnOf('new')))}</>}
              {overdueFollowups.length > 0 && <>{sectionTitle('Relances à faire', overdueFollowups.length, true)}{overdueFollowups.map(p => renderCompact(p, columnOf('recontact')))}</>}
              {overdueMoveIns.length > 0 && <>{sectionTitle('Emménagements dépassés', overdueMoveIns.length)}{overdueMoveIns.map(p => renderCompact(p, columnOf(p.status)))}</>}
            </div>
          )}
          {mobileTab === 'columns' && (() => {
            const cur = mobileColumns[mobileIndex];
            const col = PIPELINE_COLUMNS.find(c => c.key === cur.key);
            const main = col ? pipelineProspects.filter(p => col.statuses.includes(p.status)) : [];
            const dead = col ? pipelineProspects.filter(p => (col.collapsed ?? []).includes(p.status)) : [];
            return (
              <div>
                {/* Puces de colonnes (défilement horizontal) */}
                <div className="dash-scroll-x" style={{display:'flex',gap:6,overflowX:'auto',padding:'2px 2px 10px',WebkitOverflowScrolling:'touch'}}>
                  {mobileColumns.map(c => {
                    const on = c.key === cur.key;
                    return (
                      <button key={c.key} onClick={()=>setMobileCol(c.key)} className="dash-tap-keep"
                        style={{flex:'0 0 auto',display:'flex',gap:6,alignItems:'center',fontSize:'12px',fontWeight:600,padding:'7px 10px',borderRadius:999,border:`1px solid ${on?'#1a1a2e':'#e5e7eb'}`,background:on?'#1a1a2e':'#fff',color:on?'#fff':'#6b7280',whiteSpace:'nowrap'}}>
                        {c.label}<span style={{background:on?c.color:'#e5e7eb',color:on?'#fff':'#1a1a2e',borderRadius:999,padding:'0 6px',fontSize:'11px'}}>{c.count}</span>
                      </button>
                    );
                  })}
                </div>
                <div {...swipe} style={{background:'#f8f8f8',borderRadius:'12px',padding:'12px',minHeight:'50vh'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:8,borderBottom:`3px solid ${cur.color}`,paddingBottom:8}}>
                    <b style={{fontSize:'15px'}}>{cur.label}</b>
                    <small style={{fontSize:'11px',color:'#6b7280'}}>{cur.count} · {cur.key==='alerts' ? 'par mois souhaité' : 'classés par mois'}</small>
                  </div>
                  {cur.key === 'alerts' ? (
                    <>
                      {pipelineAlerts.length===0 && <p style={{textAlign:'center',color:'#9ca3af',fontSize:'13px',padding:'24px 0'}}>Aucune alerte à traiter</p>}
                      {alertsByMonth(pipelineAlerts).map(([label, items]) => <div key={label}>{sectionTitle(label, items.length)}{items.map(a => renderAlert(a, true))}</div>)}
                    </>
                  ) : col ? (
                    <>
                      {main.length===0 && <p style={{textAlign:'center',color:'#9ca3af',fontSize:'13px',padding:'24px 0'}}>Aucun prospect</p>}
                      {renderGroups(main, col, renderCompact)}
                      {dead.length > 0 && (
                        <div style={{marginTop:'12px',borderTop:'1px dashed #d1d5db',paddingTop:'8px'}}>
                          <button onClick={()=>setShowDead(v=>!v)} style={{...S.btn,width:'100%',background:'#e5e7eb',color:'#555',textAlign:'left'}}>
                            {showDead ? '▾' : '▸'} Perdus ({dead.length})
                          </button>
                          {showDead && renderGroups(dead, col, renderCompact)}
                        </div>
                      )}
                    </>
                  ) : null}
                  <div style={{textAlign:'center',fontSize:'11px',color:'#b3b3ba',padding:'10px 0 2px'}}>← glisser pour changer de colonne →</div>
                </div>
              </div>
            );
          })()}
          {/* Barre d'onglets fixe */}
          <div style={{position:'fixed',left:0,right:0,bottom:0,zIndex:900,display:'grid',gridTemplateColumns:'repeat(3,1fr)',background:'#fff',borderTop:'1px solid #e5e7eb',boxShadow:'0 -2px 12px rgba(0,0,0,0.06)'}}>
            {([['today','☀️','Aujourd\'hui'],['columns','🗂️','Colonnes'],['table','☰','Tableau']] as const).map(([k,ico,l]) => {
              const on = k === 'table' ? false : mobileTab === k;
              return (
                <button key={k} onClick={()=>{ if (k === 'table') setViewMode('table'); else setMobileTab(k); }}
                  style={{background:'none',border:'none',padding:'8px 4px 10px',fontSize:'11px',color:on?'#b8860b':'#6b7280',fontWeight:on?700:500,minHeight:'52px'}}>
                  <span style={{display:'block',fontSize:'16px',marginBottom:2}}>{ico}</span>{l}{k==='today' && todayCount>0 && <span style={{marginLeft:4,background:'#c2410c',color:'#fff',borderRadius:999,padding:'0 6px',fontSize:'10px',fontWeight:700}}>{todayCount}</span>}
                </button>
              );
            })}
          </div>
          {/* Feuille d'actions */}
          {sheet && (() => {
            const col = columnOf(sheet.status);
            const act = primaryAction(sheet);
            const row = (target: string, label: string) => (
              <button key={target} onClick={()=>moveToStage(sheet.id, target)}
                style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'12px 10px',borderRadius:'10px',fontSize:'14px',fontWeight:600,background:STATUS_COLORS[target]+'18',color:STATUS_COLORS[target],border:'none',textAlign:'left',minHeight:'44px',marginBottom:6}}>
                {label}
              </button>
            );
            return (
              <div onClick={()=>setSheet(null)} style={{position:'fixed',inset:0,zIndex:950,background:'rgba(20,20,40,0.45)'}}>
                <div onClick={e=>e.stopPropagation()} style={{position:'absolute',left:0,right:0,bottom:0,background:'#fff',borderRadius:'18px 18px 0 0',padding:'10px 14px 22px',boxShadow:'0 -6px 24px rgba(0,0,0,0.18)',maxHeight:'80vh',overflowY:'auto'}}>
                  <div style={{width:40,height:4,borderRadius:2,background:'#e5e7eb',margin:'0 auto 10px'}} />
                  <div style={{fontSize:'15px',fontWeight:700,marginBottom:2}}>{sheet.first_name} {sheet.last_name}</div>
                  <div style={{fontSize:'12px',color:'#6b7280',marginBottom:10}}>{[sheet.occupation, propertyName(sheet.property_interest) !== '—' ? propertyName(sheet.property_interest) : null, sheet.move_in_date ? `emménagement ${fmtDate(sheet.move_in_date)}` : null].filter(Boolean).join(' · ') || STATUS_LABELS[sheet.status]}</div>
                  {act && row(act.target, act.label)}
                  {col.quick.filter(t => t !== sheet.status && t !== act?.target).map(t => row(t, QUICK_LABELS[t].label))}
                  {!col.terminal && <div style={{marginBottom:6}}>{lostBtn(sheet, true)}</div>}
                  <div style={{display:'grid',gridTemplateColumns:sheet.phone?'1fr 1fr 1fr':'1fr',gap:6,marginTop:4}}>
                    <button onClick={()=>{setSheet(null);openModal(sheet);}} style={{padding:'12px 8px',borderRadius:'10px',border:'1px solid #e5e7eb',background:'#fff',fontSize:'13px',fontWeight:600,color:'#1a1a2e',minHeight:'44px'}}>✎ Fiche</button>
                    {sheet.phone && <a href={'tel:'+sheet.phone} style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'12px 8px',borderRadius:'10px',border:'1px solid #e5e7eb',background:'#fff',fontSize:'13px',fontWeight:600,color:'#1a1a2e',textDecoration:'none',minHeight:'44px'}}>📞 Appeler</a>}
                    {sheet.phone && <a href={'https://wa.me/'+sheet.phone.replace(/[^0-9]/g,'').replace(/^0/,'33')} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'12px 8px',borderRadius:'10px',border:'1px solid #e5e7eb',background:'#fff',fontSize:'13px',fontWeight:600,color:'#1a1a2e',textDecoration:'none',minHeight:'44px'}}>💬 WhatsApp</a>}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div style={{...S.card,padding:0,overflow:"auto"}}>
          {isMobile && <div style={{padding:'10px 12px',borderBottom:'1px solid #f0f0f0'}}><button onClick={()=>setViewMode('pipeline')} style={{...S.btn,background:'#1a1a2e',color:'#fff'}}>← Retour au pipeline</button></div>}
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
                  <td data-label="Statut" style={{padding:"10px 16px"}}><span style={{background:STATUS_COLORS[p.status]||"#94a3b8",color:"#fff",padding:"2px 10px",borderRadius:"12px",fontSize:"12px"}}>{STATUS_LABELS[p.status]||p.status}</span>{p.status==='recontact' && p.next_followup_date && <span style={{marginLeft:6,fontSize:'11px',color:p.next_followup_date<=today?'#c2410c':'#6b7280'}}>↻ {fmtDate(p.next_followup_date)}</span>}</td>
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
        <div className="dash-modal-overlay" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,overflow:'auto',padding:'20px'}} onClick={()=>{setModal(null);setPendingAlertId(null);}}>
          <div className="dash-modal" style={{background:'white',borderRadius:'16px',padding:'28px',width:'600px',maxWidth:'95vw',maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h2 style={{margin:0,fontSize:'20px'}}>{isNew?(pendingAlertId?'Nouveau prospect (depuis une alerte chambre)':'Nouveau Prospect'):'Fiche Prospect'}</h2>
              <button onClick={()=>{setModal(null);setPendingAlertId(null);}} style={{background:'none',border:'none',fontSize:'24px',cursor:'pointer',color:'#888'}}>×</button>
            </div>
            {pendingAlertId && (
              <div style={{background:ALERT_COLOR+'14',color:'#115e59',borderRadius:'8px',padding:'8px 12px',fontSize:'12px',marginBottom:'14px'}}>
                Complète le nom, vérifie la maison et la date : à l'enregistrement, l'alerte est marquée traitée et liée à cette fiche.
              </div>
            )}

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
              {modal.status === 'recontact' && (
                <div><label style={S.fieldLabel}>Date de relance</label>
                  <input type="date" style={S.input} value={modal.next_followup_date||''} onChange={e=>setModal({...modal,next_followup_date:e.target.value||null})}/>
                  <div style={{fontSize:'10px',color:'#6b7280',marginTop:'2px'}}>Facultative — remonte dans « À traiter aujourd'hui » quand elle est passée</div>
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
                <button onClick={()=>{setModal(null);setPendingAlertId(null);}} style={{padding:'8px 16px',border:'1px solid #ddd',background:'#fff',borderRadius:'6px',cursor:'pointer'}}>Annuler</button>
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
