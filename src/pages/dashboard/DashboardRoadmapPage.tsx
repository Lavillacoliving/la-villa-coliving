import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Task { id:string; name:string; state:'red'|'yellow'|'green'; priority:string; phase:string; status:string; doc:string; }
interface Domain { id:string; name:string; icon:string; tasks:Task[]; }
interface Phase { id:string; name:string; weeks:[number,number]; color:string; }

// Phases are structural/stable — kept in code
const PHASES: Phase[] = [
  {id:'phase-1a',name:'1A Savoir tacite',weeks:[1,4],color:'#3D4A38'},
  {id:'phase-1b',name:'1B Hub central',weeks:[1,4],color:'#5A6B52'},
  {id:'phase-2',name:'2 Automatisation',weeks:[5,10],color:'#3498DB'},
  {id:'phase-3',name:'3 Cadrage freelance',weeks:[11,13],color:'#D4897A'},
  {id:'phase-4',name:'4 Test & go-live',weeks:[14,19],color:'#7C9A6D'},
];

export default function DashboardRoadmapPage() {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<Record<string,boolean>>({});
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      const { data, error } = await supabase
        .from('roadmap_tasks')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        setLoading(false);
        return;
      }

      // Group tasks by domain
      const domainMap = new Map<string, Domain>();
      let maxDate = '';
      for (const row of data) {
        if (!domainMap.has(row.domain_id)) {
          domainMap.set(row.domain_id, {
            id: row.domain_id,
            name: row.domain_name,
            icon: row.domain_icon || '',
            tasks: [],
          });
        }
        domainMap.get(row.domain_id)!.tasks.push({
          id: row.id,
          name: row.name,
          state: row.state,
          priority: row.priority,
          phase: row.phase,
          status: row.status,
          doc: row.doc || '',
        });
        if (row.updated_at && row.updated_at > maxDate) maxDate = row.updated_at;
      }

      setDomains(Array.from(domainMap.values()));
      if (maxDate) {
        setLastUpdated(new Date(maxDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
      }
      setLoading(false);
    }

    fetchTasks();
  }, []);

  const allTasks = domains.flatMap(d => d.tasks);
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px', color: '#888' }}>
        Chargement de la roadmap...
      </div>
    );
  }

  if (total === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px', color: '#888' }}>
        Aucune tâche trouvée dans la roadmap.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a2e' }}>Roadmap Transition</h2>
        <span style={{ fontSize: '13px', color: '#888' }}>Dernière mise à jour : {lastUpdated || '—'}</span>
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
      {domains.map(domain => {
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
