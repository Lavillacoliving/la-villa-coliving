import { useState } from 'react';

interface Task { id:string; name:string; state:'red'|'yellow'|'green'; priority:string; phase:string; status:string; doc:string; }
interface Domain { id:string; name:string; icon:string; tasks:Task[]; }
interface Phase { id:string; name:string; weeks:[number,number]; color:string; }

const PHASES: Phase[] = [
  {id:'phase-1a',name:'1A Savoir tacite',weeks:[1,4],color:'#3D4A38'},
  {id:'phase-1b',name:'1B Hub central',weeks:[1,4],color:'#5A6B52'},
  {id:'phase-2',name:'2 Automatisation',weeks:[5,10],color:'#3498DB'},
  {id:'phase-3',name:'3 Cadrage freelance',weeks:[11,13],color:'#D4897A'},
  {id:'phase-4',name:'4 Test & go-live',weeks:[14,19],color:'#7C9A6D'},
];

const DOMAINS: Domain[] = [
  {id:'d0',name:'Hub Central & Stockage',icon:'\ud83d\uddc4\ufe0f',tasks:[
    {id:'0.1',name:'Espace de stockage centralisé',state:'green',priority:'P1',phase:'phase-1b',status:'completed',doc:'Structure Supabase Storage + Drive'},
    {id:'0.2',name:'Intégrer hub au dashboard',state:'green',priority:'P1',phase:'phase-1b',status:'completed',doc:'7 tables Supabase + 7 onglets dashboard'},
  ]},
  {id:'d1',name:'Acquisition (prospects)',icon:'\ud83c\udfaf',tasks:[
    {id:'1.1',name:'Répondre premiers contacts',state:'yellow',priority:'P1',phase:'phase-2',status:'in_progress',doc:'Templates_Reponses_Prospects.md'},
    {id:'1.2',name:'Photos/vidéos chambres',state:'yellow',priority:'P1',phase:'phase-1b',status:'in_progress',doc:'Structure_Bibliotheque_Photos.md'},
    {id:'1.4',name:'Faire les visites (script)',state:'green',priority:'P1',phase:'phase-1a',status:'completed',doc:'Script_Visite_LaVilla.md'},
    {id:'1.5',name:'Relancer prospects silencieux',state:'yellow',priority:'P1',phase:'phase-2',status:'in_progress',doc:'Dépend tâche 1.8 (Messenger Bot)'},
    {id:'1.6',name:'Gérer annonces',state:'green',priority:'P2',phase:'phase-1a',status:'completed',doc:'Templates_Annonces_LaVilla.md'},
    {id:'1.7',name:'Posts Facebook régionaux',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'288 posts x3 + 29 groupes FB'},
    {id:'1.8',name:'Messenger Bot (Meta+n8n+Claude)',state:'red',priority:'P1',phase:'phase-2',status:'not_started',doc:''},
  ]},
  {id:'d2',name:'Gestion locataires',icon:'\ud83c\udfe0',tasks:[
    {id:'2.1',name:'Demandes quotidiennes WhatsApp',state:'yellow',priority:'P1',phase:'phase-1a',status:'in_progress',doc:'Analyse WhatsApp + FAQ'},
    {id:'2.2',name:'Coordination maintenance',state:'green',priority:'P1',phase:'phase-1a',status:'completed',doc:'6 prestataires + tickets'},
    {id:'2.3',name:'Check-in (emménagements)',state:'green',priority:'P1',phase:'phase-1a',status:'completed',doc:'Livret_Accueil_LaVilla.md'},
    {id:'2.4',name:'Check-out (départs)',state:'green',priority:'P1',phase:'phase-1a',status:'completed',doc:'Procedure check-out caution'},
    {id:'2.5',name:'Règlement Intérieur (Bibles Coliver)',state:'green',priority:'P1',phase:'phase-1a',status:'completed',doc:'Bible_Coliver_LaVilla.docx'},
    {id:'2.6',name:'Quittances de loyer',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'Template_Quittance_Loyer.md'},
    {id:'2.7',name:'Documents / dossiers locataires',state:'green',priority:'P1',phase:'phase-1a',status:'completed',doc:'Checklist_Documents_Entree.md'},
    {id:'2.8',name:'WhatsApp Business Bot',state:'red',priority:'P1',phase:'phase-2',status:'not_started',doc:''},
    {id:'2.9',name:'Table escalations + dashboard',state:'red',priority:'P1',phase:'phase-2',status:'not_started',doc:''},
    {id:'2.10',name:'Portail locataire (MVP déployé)',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'MVP Magic Link — Magic Link Auth'},
    {id:'2.11',name:'Onboarding communication canaux',state:'red',priority:'P2',phase:'phase-2',status:'not_started',doc:''},
    {id:'2.12',name:'Templates WhatsApp Meta',state:'red',priority:'P2',phase:'phase-2',status:'not_started',doc:''},
  ]},
  {id:'d3',name:'Gestion financière',icon:'\ud83d\udcb0',tasks:[
    {id:'3.1',name:'Encaissement loyers',state:'green',priority:'P1',phase:'phase-1b',status:'completed',doc:'3 workflows n8n Cloud actifs'},
    {id:'3.2',name:'Factures fournisseurs (V2)',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'PROCESS_FACTURES_V2.md'},
    {id:'3.3',name:'Paiement fournisseurs/charges',state:'green',priority:'P2',phase:'phase-1a',status:'completed',doc:'Repertoire prestataires'},
    {id:'3.4',name:'Gestion cautions',state:'green',priority:'P2',phase:'phase-1a',status:'completed',doc:'Procedure_Caution_LaVilla.md'},
    {id:'3.5',name:'Préparation COGESTRA',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'Template_Email_COGESTRA.md'},
    {id:'3.6',name:'Ajustement loyers (IRL)',state:'green',priority:'P3',phase:'phase-3',status:'completed',doc:'Modele_Courrier_IRL.md'},
    {id:'3.7',name:'Déclarations fiscales',state:'yellow',priority:'P2',phase:'phase-3',status:'in_progress',doc:'Calendrier_Fiscal.md'},
  ]},
  {id:'d4',name:'Maintenance & Entretien',icon:'\ud83d\udd27',tasks:[
    {id:'4.1',name:'Ménage parties communes',state:'green',priority:'P1',phase:'phase-1a',status:'completed',doc:'Template_Planning_Menage.md'},
    {id:'4.2',name:'Maintenance courante',state:'green',priority:'P1',phase:'phase-1a',status:'completed',doc:'Procedure_Urgence_Maintenance.md'},
    {id:'4.3',name:'Jardin et piscine',state:'green',priority:'P2',phase:'phase-1a',status:'completed',doc:'Procedure_Piscine_Saisonniere.md'},
    {id:'4.4',name:'États des lieux (Nockee)',state:'yellow',priority:'P1',phase:'phase-2',status:'in_progress',doc:'Recherche_API_EDL_Nockee.md'},
    {id:'4.5',name:'Stocks consommables',state:'green',priority:'P3',phase:'phase-3',status:'completed',doc:'Inventaire_Stocks_Consommables.md'},
    {id:'4.6',name:'WiFi et réseau',state:'green',priority:'P2',phase:'phase-1a',status:'completed',doc:'Guide_Depannage_WiFi_LaVilla.md'},
  ]},
  {id:'d5',name:'Mont-Blanc',icon:'\ud83c\udfd4\ufe0f',tasks:[
    {id:'5.1',name:'Intégrer dans le système',state:'green',priority:'P1',phase:'phase-1b',status:'completed',doc:'Integre Supabase + dashboard'},
    {id:'5.2',name:'Gestion locataire',state:'green',priority:'P3',phase:'phase-3',status:'completed',doc:'Procedure_Gestion_MontBlanc.md'},
  ]},
  {id:'d6',name:'Infrastructure technique',icon:'\u2699\ufe0f',tasks:[
    {id:'6.1',name:'Dashboard → One Stop Shop (7 onglets)',state:'green',priority:'P1',phase:'phase-1b',status:'completed',doc:'React 7 onglets + export Excel'},
    {id:'6.2',name:'VPS (scripts+crons)',state:'green',priority:'P2',phase:'phase-1b',status:'completed',doc:'VPS Hostinger operationnel'},
    {id:'6.3',name:'Site web',state:'yellow',priority:'P3',phase:'phase-3',status:'in_progress',doc:'SEO meta tags'},
    {id:'6.4',name:'Backups et sécurité',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'VPS scripts fixes post-D3'},
    {id:'6.5',name:'Site web → Supabase SoT',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'hooks+FAQ+RLS'},
    {id:'6.6',name:'Fusion 2 Supabase → 1',state:'green',priority:'P1',phase:'phase-1b',status:'completed',doc:'FAIT - Supabase unifie'},
    {id:'6.7',name:'Migration n8n → Cloud',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'FAIT - n8n Cloud 24e/mois'},
    {id:'6.8',name:'Migration dashboard → React (7 onglets)',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'Commit c4848521 — 7 onglets React'},
    {id:'6.9',name:'Export Excel + Sheet sync',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'Controle de gestion'},
    {id:'6.10',name:'Health Check Système hebdo (D7)',state:'green',priority:'P2',phase:'phase-2',status:'completed',doc:'Workflow kDfsLPOaHOPuHkfV'},
  ]},
  {id:'d7',name:'Administration & Juridique',icon:'\ud83d\udccb',tasks:[
    {id:'7.1',name:'Baux (modèle + RI + e-signature)',state:'green',priority:'P1',phase:'phase-2',status:'completed',doc:'Bail DOCX + GDrive + workflow caution'},
    {id:'7.2',name:'Assurances',state:'green',priority:'P2',phase:'phase-1a',status:'completed',doc:'Recap_Assurances_LaVilla.md'},
    {id:'7.3',name:'Conformité réglementaire',state:'green',priority:'P2',phase:'phase-3',status:'completed',doc:'Checklist_Conformite.md'},
  ]},
];

export default function DashboardRoadmapPage() {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<Record<string,boolean>>({});

  const allTasks = DOMAINS.flatMap(d => d.tasks);
  const total = allTasks.length;
  const completed = allTasks.filter(t => t.status === 'completed').length;
  const inProgress = allTasks.filter(t => t.status === 'in_progress').length;
  const notStarted = total - completed - inProgress;
  const docsCount = allTasks.filter(t => t.doc).length;
  const pct = total > 0 ? Math.round((completed + inProgress * 0.5) / total * 100) : 0;

  const toggleDomain = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const filterTask = (t: Task) => {
    if (filter === 'all') return true;
    if (filter === 'in_progress') return t.status === 'in_progress';
    if (filter === 'not_started') return t.status === 'not_started';
    if (filter === 'completed') return t.status === 'completed';
    if (filter.startsWith('P')) return t.priority === filter;
    return true;
  };

  const S = {
    card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    kpi: { background: '#fff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  };

  const stColors: Record<string,string> = { red: '#ef4444', yellow: '#eab308', green: '#22c55e' };
  const stBg: Record<string,string> = { completed: '#dcfce7', in_progress: '#dbeafe', not_started: '#f1f5f9' };
  const stLabel: Record<string,string> = { completed: '✅ Terminé', in_progress: '🟡 En cours', not_started: '⚪ À faire' };
  const prColors: Record<string,string> = { P1: '#ef4444', P2: '#eab308', P3: '#94a3b8' };
  const phLabel: Record<string,string> = { 'phase-1a': 'Ph 1A', 'phase-1b': 'Ph 1B', 'phase-2': 'Ph 2', 'phase-3': 'Ph 3', 'phase-4': 'Ph 4' };
  const phBg: Record<string,string> = { 'phase-1a': '#dcfce7', 'phase-1b': '#dcfce7', 'phase-2': '#dbeafe', 'phase-3': '#fef3c7', 'phase-4': '#e0e7ff' };

  const months = ['Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août'];

  const FILTERS = [
    { id: 'all', l: 'Toutes' }, { id: 'in_progress', l: '🟡 En cours' }, { id: 'not_started', l: '⚪ À faire' },
    { id: 'completed', l: '✅ Terminé' }, { id: 'P1', l: 'P1 Bloquant' }, { id: 'P2', l: 'P2 Important' }, { id: 'P3', l: 'P3 Confort' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a2e' }}>Roadmap Transition</h2>
        <span style={{ fontSize: '13px', color: '#888' }}>Dernière mise à jour : 19/02/2026</span>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { v: total, l: 'Tâches totales', c: '#94a3b8' },
          { v: completed, l: 'Terminées ✅', c: '#22c55e' },
          { v: inProgress, l: 'En cours 🟡', c: '#3498DB' },
          { v: notStarted, l: 'À faire ⚪', c: '#94a3b8' },
          { v: docsCount, l: 'Documents 📄', c: '#b8860b' },
          { v: pct + '%', l: 'Avancement', c: '#22c55e' },
        ].map((k, i) => (
          <div key={i} style={{ ...S.kpi, borderTop: `3px solid ${k.c}` }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: k.c }}>{k.v}</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ ...S.card, marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Progression globale</span>
          <span style={{ fontWeight: 800, fontSize: '16px', color: '#3D4A38' }}>{pct}%</span>
        </div>
        <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ height: '100%', background: '#4A5C42', width: (completed / total * 100) + '%', transition: 'width 0.8s' }} />
          <div style={{ height: '100%', background: '#5DADE2', width: (inProgress / total * 100) + '%', transition: 'width 0.8s' }} />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#888' }}>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#4A5C42', marginRight: '4px' }} />Terminé</span>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#5DADE2', marginRight: '4px' }} />En cours</span>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#f0f0f0', marginRight: '4px' }} />À faire</span>
        </div>
      </div>

      {/* Gantt */}
      <div style={{ ...S.card, marginBottom: '24px', overflowX: 'auto' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#1a1a2e' }}>Timeline</h3>
        <div style={{ minWidth: '650px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', fontSize: '12px', color: '#888', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
            <div />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', textAlign: 'center' }}>
              {months.map(m => <div key={m}>{m}</div>)}
            </div>
          </div>
          {PHASES.map(ph => (
            <div key={ph.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center', minHeight: '38px', marginTop: '4px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{ph.name}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>Sem {ph.weeks[0]}-{ph.weeks[1]}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24,1fr)', gap: '1px', height: '26px' }}>
                <div style={{ gridColumn: `${ph.weeks[0]} / span ${ph.weeks[1] - ph.weeks[0] + 1}`, borderRadius: '6px', background: ph.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, color: 'white' }}>
                  {ph.name.split(' ').slice(1).join(' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)', background: filter === f.id ? '#1a1a2e' : '#fff', color: filter === f.id ? '#fff' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>{f.l}</button>
        ))}
      </div>

      {/* Domains */}
      {DOMAINS.map(domain => {
        const ft = domain.tasks.filter(filterTask);
        if (ft.length === 0) return null;
        const stats = { completed: 0, in_progress: 0, not_started: 0 };
        domain.tasks.forEach(t => { if (stats[t.status as keyof typeof stats] !== undefined) stats[t.status as keyof typeof stats]++; });
        const isOpen = expanded[domain.id];

        return (
          <div key={domain.id} style={{ ...S.card, marginBottom: '12px', padding: 0, overflow: 'hidden' }}>
            <div onClick={() => toggleDomain(domain.id)} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>{domain.icon} {domain.name}</span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {stats.completed > 0 && <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: '#dcfce7', color: '#22c55e', fontWeight: 600 }}>{stats.completed} ✅</span>}
                {stats.in_progress > 0 && <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: '#dbeafe', color: '#2980B9', fontWeight: 600 }}>{stats.in_progress} 🟡</span>}
                {stats.not_started > 0 && <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>{stats.not_started} ⚪</span>}
                <span style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', fontSize: '18px', color: '#94a3b8' }}>›</span>
              </div>
            </div>
            {isOpen && (
              <div style={{ padding: '0 20px 16px' }}>
                {ft.map(t => (
                  <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 60px 90px 70px', alignItems: 'start', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stColors[t.state], marginTop: '6px', marginLeft: '8px' }} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{t.id} {t.name}</div>
                      {t.doc && <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '2px' }}>📄 {t.doc}</div>}
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 700, color: prColors[t.priority] }}>{t.priority}</div>
                    <div style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', textAlign: 'center', background: stBg[t.status] || '#eee', fontWeight: 500, whiteSpace: 'nowrap' }}>{stLabel[t.status] || t.status}</div>
                    <div style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', textAlign: 'center', background: phBg[t.phase] || '#eee', fontWeight: 500, whiteSpace: 'nowrap' }}>{phLabel[t.phase] || t.phase}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
