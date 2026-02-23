import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { logAudit } from '@/lib/auditLog';

interface Property { id: string; name: string; }

interface EventRow {
  id: string;
  property_id: string | null;
  type: string;
  title_fr: string;
  title_en: string | null;
  date: string;
  time: string | null;
  location: string | null;
  description_fr: string | null;
  description_en: string | null;
  created_at: string;
}

const EVENT_TYPES = ['sport', 'yoga', 'party', 'community', 'workshop', 'other'];
const TYPE_LABELS: Record<string, string> = { sport: 'Sport', yoga: 'Yoga', party: 'Party', community: 'Communauté', workshop: 'Atelier', other: 'Autre' };
const TYPE_COLORS: Record<string, string> = { sport: '#3b82f6', yoga: '#8b5cf6', party: '#ec4899', community: '#f59e0b', workshop: '#10b981', other: '#6b7280' };

const emptyForm = (): Omit<EventRow, 'id' | 'created_at'> => ({
  property_id: null, type: 'community', title_fr: '', title_en: null,
  date: new Date().toISOString().split('T')[0], time: '18:00',
  location: null, description_fr: null, description_en: null,
});

export default function DashboardEventsPage() {
  const toast = useToast();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<(Omit<EventRow, 'id' | 'created_at'> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; label: string } | null>(null);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  const load = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    let q = supabase.from('events').select('*').order('date', { ascending: filter !== 'past' });
    if (filter === 'upcoming') q = q.gte('date', today);
    if (filter === 'past') q = q.lt('date', today).order('date', { ascending: false });
    const [evRes, prRes] = await Promise.all([
      q.limit(100),
      supabase.from('properties').select('id,name'),
    ]);
    setEvents(evRes.data || []);
    setProperties(prRes.data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!modal) return;
    if (!modal.title_fr.trim() || !modal.date) { toast.warning('Titre FR et date obligatoires'); return; }
    setSaving(true);
    const payload = {
      property_id: modal.property_id || null,
      type: modal.type,
      title_fr: modal.title_fr.trim(),
      title_en: modal.title_en?.trim() || null,
      date: modal.date,
      time: modal.time || null,
      location: modal.location?.trim() || null,
      description_fr: modal.description_fr?.trim() || null,
      description_en: modal.description_en?.trim() || null,
    };
    try {
      if (modal.id) {
        const { error } = await supabase.from('events').update(payload).eq('id', modal.id);
        if (error) throw error;
        toast.success('Événement mis à jour');
        logAudit('update', 'event', modal.id, payload);
      } else {
        const { error } = await supabase.from('events').insert(payload);
        if (error) throw error;
        toast.success('Événement créé');
        logAudit('create', 'event', undefined, payload);
      }
      setModal(null);
      load();
    } catch (err: any) {
      toast.error('Erreur: ' + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    logAudit('delete', 'event', id);
    toast.success('Événement supprimé');
    load();
  };

  const propName = (id: string | null) => {
    if (!id) return 'Toutes les maisons';
    return properties.find(p => p.id === id)?.name || id;
  };

  const S = {
    card: { background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' } as React.CSSProperties,
    btn: { padding: '6px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 } as React.CSSProperties,
    input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const },
    label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px' } as React.CSSProperties,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a2e' }}>Événements</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {(['upcoming', 'past', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ ...S.btn, background: filter === f ? '#3D4A38' : '#e5e7eb', color: filter === f ? '#fff' : '#555' }}>
              {f === 'upcoming' ? 'À venir' : f === 'past' ? 'Passés' : 'Tous'}
            </button>
          ))}
          <button onClick={() => setModal(emptyForm())} style={{ ...S.btn, background: '#b8860b', color: '#fff' }}>+ Nouvel événement</button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#b8860b' }}>Chargement...</p>
      ) : events.length === 0 ? (
        <div style={{ ...S.card, textAlign: 'center', padding: '60px', color: '#888' }}>
          <p style={{ fontSize: '32px', marginBottom: '8px' }}>📅</p>
          <p>Aucun événement {filter === 'upcoming' ? 'à venir' : filter === 'past' ? 'passé' : ''}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {events.map(ev => {
            const isPast = ev.date < new Date().toISOString().split('T')[0];
            return (
              <div key={ev.id} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '16px', opacity: isPast ? 0.6 : 1, borderLeft: `4px solid ${TYPE_COLORS[ev.type] || '#6b7280'}` }}>
                <div style={{ minWidth: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e' }}>{new Date(ev.date + 'T00:00:00').getDate()}</div>
                  <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>{new Date(ev.date + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'short' })}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a2e' }}>{ev.title_fr}</span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: TYPE_COLORS[ev.type] || '#6b7280', color: '#fff' }}>{TYPE_LABELS[ev.type] || ev.type}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#888', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {ev.time && <span>🕐 {ev.time.substring(0, 5)}</span>}
                    <span>🏠 {propName(ev.property_id)}</span>
                    {ev.location && <span>📍 {ev.location}</span>}
                  </div>
                  {ev.description_fr && <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0' }}>{ev.description_fr}</p>}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setModal({ ...ev })} style={{ ...S.btn, background: '#e5e7eb', color: '#333' }}>✏️</button>
                  <button onClick={() => setDeleteConfirm({ id: ev.id, label: ev.title_fr })} style={{ ...S.btn, background: '#fef2f2', color: '#ef4444' }}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event create/edit modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '540px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px' }}>{modal.id ? 'Modifier l\'événement' : 'Nouvel événement'}</h3>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={S.label}>Titre FR *</label>
                  <input value={modal.title_fr} onChange={e => setModal({ ...modal, title_fr: e.target.value })} style={S.input} placeholder="Soirée cinéma" />
                </div>
                <div>
                  <label style={S.label}>Titre EN</label>
                  <input value={modal.title_en || ''} onChange={e => setModal({ ...modal, title_en: e.target.value })} style={S.input} placeholder="Movie night" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={S.label}>Date *</label>
                  <input type="date" value={modal.date} onChange={e => setModal({ ...modal, date: e.target.value })} style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Heure</label>
                  <input type="time" value={modal.time || ''} onChange={e => setModal({ ...modal, time: e.target.value })} style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Type</label>
                  <select value={modal.type} onChange={e => setModal({ ...modal, type: e.target.value })} style={S.input}>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={S.label}>Maison</label>
                  <select value={modal.property_id || ''} onChange={e => setModal({ ...modal, property_id: e.target.value || null })} style={S.input}>
                    <option value="">Toutes les maisons</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Lieu</label>
                  <input value={modal.location || ''} onChange={e => setModal({ ...modal, location: e.target.value })} style={S.input} placeholder="Salle commune, Jardin..." />
                </div>
              </div>
              <div>
                <label style={S.label}>Description FR</label>
                <textarea value={modal.description_fr || ''} onChange={e => setModal({ ...modal, description_fr: e.target.value })} style={{ ...S.input, minHeight: '60px', resize: 'vertical' }} placeholder="Description de l'événement..." />
              </div>
              <div>
                <label style={S.label}>Description EN</label>
                <textarea value={modal.description_en || ''} onChange={e => setModal({ ...modal, description_en: e.target.value })} style={{ ...S.input, minHeight: '60px', resize: 'vertical' }} placeholder="Event description..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setModal(null)} style={{ ...S.btn, background: '#e5e7eb', color: '#555', padding: '10px 20px' }}>Annuler</button>
              <button onClick={save} disabled={saving} style={{ ...S.btn, background: '#b8860b', color: '#fff', padding: '10px 20px', opacity: saving ? 0.6 : 1 }}>{saving ? 'Enregistrement...' : modal.id ? 'Mettre à jour' : 'Créer'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => setDeleteConfirm(null)}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '380px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>Confirmer la suppression</h3>
            <p style={{ color: '#555', fontSize: '14px', margin: '0 0 20px' }}>Supprimer l'événement <strong>{deleteConfirm.label}</strong> ?</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ ...S.btn, background: '#e5e7eb', color: '#555', padding: '8px 16px' }}>Annuler</button>
              <button onClick={() => { const id = deleteConfirm.id; setDeleteConfirm(null); deleteEvent(id); }} style={{ ...S.btn, background: '#ef4444', color: '#fff', padding: '8px 16px' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
