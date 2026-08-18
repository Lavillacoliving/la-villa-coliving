import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { logAudit } from '@/lib/auditLog';
import {
  globalAvailabilityLabel,
  type HouseKey,
  type HouseAvailability,
  type SiteAvailability,
} from '@/lib/availability';

/**
 * Dispo site — récapitulatif des 29 chambres vues comme le SITE les voit.
 *
 * Pourquoi cette page : la page Maisons colore ses badges depuis `is_active`,
 * alors que le site public (vue v_public_rooms) applique le critère composite
 * `lease_status IN ('active','signed')` + fenêtres move_in/move_out — le seul
 * fiable (des fiches périmées avec is_active=true faisaient passer leloft-6
 * pour occupée). Ici, chaque chambre montre : ce que le site affiche, qui
 * l'occupe selon le critère composite, et les fiches incohérentes à corriger.
 *
 * Modifiable : la date de sortie du locataire en place (le levier qui pilote
 * « Se libère le X » sur le site) et le statut maintenance de la chambre.
 * Le site public se met à jour immédiatement pour les visiteurs (fetch client) ;
 * le HTML prérendu suit au prochain déploiement ou au cron quotidien (≤ 24 h).
 */

interface PropertyRow { id: string; name: string; slug: string; is_coliving: boolean; }
interface RoomRow { id: string; property_id: string; room_number: number; name: string | null; status: 'active' | 'maintenance' | 'unavailable'; }
interface TenantRow {
  id: string; first_name: string; last_name: string;
  property_id: string; room_number: number;
  is_active: boolean; lease_status: string | null;
  move_in_date: string | null; move_out_date: string | null;
}
interface ViewRow { house_slug: string; room_number: number; availability: string; available_from: string | null; }

const HOUSE_ORDER: HouseKey[] = ['lavilla', 'leloft', 'lelodge'];

const fmtDate = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR');

export default function DashboardDispoPage() {
  const toast = useToast();
  const isMobile = useIsMobile();
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [viewRows, setViewRows] = useState<ViewRow[]>([]);
  const [loading, setLoading] = useState(true);
  // Édition de la date de sortie : clé = tenant.id, valeur = date en cours de saisie
  const [editDates, setEditDates] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [pRes, rRes, tRes, vRes] = await Promise.all([
      supabase.from('properties').select('id,name,slug,is_coliving'),
      supabase.from('rooms').select('id,property_id,room_number,name,status').order('room_number'),
      supabase.from('tenants').select('id,first_name,last_name,property_id,room_number,is_active,lease_status,move_in_date,move_out_date'),
      supabase.from('v_public_rooms').select('house_slug,room_number,availability,available_from'),
    ]);
    const firstErr = pRes.error || rRes.error || tRes.error || vRes.error;
    if (firstErr) toast.error('Erreur de chargement : ' + firstErr.message);
    setProperties(pRes.data || []);
    setRooms(rRes.data || []);
    setTenants(tRes.data || []);
    setViewRows(vRes.data || []);
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().slice(0, 10);

  // Critère composite — MÊME logique que v_public_rooms (jamais is_active).
  const isLease = (t: TenantRow) => t.lease_status === 'active' || t.lease_status === 'signed';
  const isCurrent = (t: TenantRow) =>
    isLease(t) && !!t.move_in_date && t.move_in_date <= today && (!t.move_out_date || t.move_out_date >= today);
  const isIncoming = (t: TenantRow) => isLease(t) && !!t.move_in_date && t.move_in_date > today;

  const tenantsFor = (propertyId: string, roomNumber: number) =>
    tenants.filter(t => t.property_id === propertyId && t.room_number === roomNumber);

  // Fiche incohérente : is_active en désaccord avec le critère composite.
  // C'est exactement le piège qui a fait diverger dashboard et site.
  const staleFlag = (t: TenantRow): string | null => {
    if (t.is_active && !isCurrent(t) && !isIncoming(t)) return 'is_active=oui mais bail non actif/signé sur la période — fiche à mettre à jour';
    if (!t.is_active && isCurrent(t)) return 'is_active=non mais bail actif/signé en cours — fiche à mettre à jour';
    return null;
  };

  // Libellé hero du site, recalculé depuis la vue (aperçu de ce que voit un visiteur).
  const siteLabel = (): string => {
    const byHouse = Object.fromEntries(
      HOUSE_ORDER.map(k => [k, { available: 0, upcoming: 0, nextFreeDate: null }]),
    ) as Record<HouseKey, HouseAvailability>;
    for (const r of viewRows) {
      const h = byHouse[r.house_slug as HouseKey];
      if (!h) continue;
      if (r.availability === 'available') h.available += 1;
      if (r.available_from) {
        h.upcoming += 1;
        if (!h.nextFreeDate || r.available_from < h.nextFreeDate) h.nextFreeDate = r.available_from;
      }
    }
    const dates = HOUSE_ORDER.map(k => byHouse[k].nextFreeDate).filter((d): d is string => !!d).sort();
    const a: SiteAvailability = {
      known: viewRows.length > 0,
      totalAvailable: HOUSE_ORDER.reduce((n, k) => n + byHouse[k].available, 0),
      upcoming: HOUSE_ORDER.reduce((n, k) => n + byHouse[k].upcoming, 0),
      nextFreeDate: dates[0] ?? null,
      byHouse,
    };
    return globalAvailabilityLabel(a, 'fr');
  };

  const saveMoveOut = async (t: TenantRow, newDate: string | null) => {
    setSaving(t.id);
    const { error } = await supabase.from('tenants')
      .update({ move_out_date: newDate, updated_at: new Date().toISOString() })
      .eq('id', t.id);
    if (error) { toast.error('Erreur : ' + error.message); setSaving(null); return; }
    await logAudit('move_out_date_changed', 'tenant', t.id, {
      from: t.move_out_date, to: newDate, name: `${t.first_name} ${t.last_name}`,
    });
    toast.success(newDate ? `Date de sortie → ${fmtDate(newDate)}` : 'Date de sortie effacée');
    setEditDates(prev => { const n = { ...prev }; delete n[t.id]; return n; });
    setSaving(null);
    load();
  };

  const toggleMaintenance = async (room: RoomRow) => {
    const next = room.status === 'maintenance' ? 'active' : 'maintenance';
    setSaving(room.id);
    const { error } = await supabase.from('rooms')
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq('id', room.id);
    if (error) { toast.error('Erreur : ' + error.message); setSaving(null); return; }
    await logAudit('room_status_changed', 'room', room.id, { from: room.status, to: next, room_number: room.room_number });
    toast.success(next === 'maintenance' ? 'Chambre passée en maintenance (affichée occupée)' : 'Chambre remise en service');
    setSaving(null);
    load();
  };

  const S = {
    card: { background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    badge: (color: string, bg: string) => ({
      display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
      fontSize: '12px', fontWeight: 600 as const, color, background: bg,
    }),
    btn: { padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
    input: { padding: '6px 10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px' },
  };

  // Badge « ce que le site affiche » pour une chambre.
  const siteBadge = (v: ViewRow | undefined) => {
    if (!v) return <span style={S.badge('#888', '#f3f4f6')}>Absente de la vue</span>;
    if (v.availability === 'available') return <span style={S.badge('#16a34a', '#dcfce7')}>LIBRE sur le site</span>;
    if (v.available_from) return <span style={S.badge('#b45309', '#fef3c7')}>Se libère le {fmtDate(v.available_from)}</span>;
    return <span style={S.badge('#2563eb', '#dbeafe')}>Occupée</span>;
  };

  if (loading) return <p style={{ color: '#888', padding: '40px', textAlign: 'center' }}>Chargement…</p>;

  const coliving = HOUSE_ORDER
    .map(slug => properties.find(p => p.slug === slug))
    .filter((p): p is PropertyRow => !!p);

  return (
    <div>
      {/* En-tête : ce que le hero de la home affiche en ce moment */}
      <div style={{ ...S.card, marginBottom: '20px', borderLeft: '4px solid #b8860b' }}>
        <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '6px' }}>
          Affiché en ce moment sur la home
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a2e' }}>{siteLabel()}</div>
        <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#888', lineHeight: 1.5 }}>
          Source : vue <code>v_public_rooms</code> — bail actif/signé + dates d'entrée/sortie (jamais la case
          « actif » seule). Une modification ici est visible immédiatement par les visiteurs ; le HTML statique
          lu par Google suit au prochain déploiement ou au cron quotidien (moins de 24 h).
        </p>
      </div>

      {coliving.map(property => {
        const propRooms = rooms
          .filter(r => r.property_id === property.id)
          .sort((a, b) => a.room_number - b.room_number);
        return (
          <div key={property.id} style={{ marginBottom: '28px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: '#1a1a2e' }}>
              {property.name}
              <span style={{ fontWeight: 400, color: '#888', fontSize: '13px' }}> — {propRooms.length} chambres</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '12px' }}>
              {propRooms.map(room => {
                const v = viewRows.find(x => x.house_slug === property.slug && x.room_number === room.room_number);
                const roomTenants = tenantsFor(property.id, room.room_number);
                const current = roomTenants.filter(isCurrent);
                const incoming = roomTenants.filter(isIncoming);
                const stale = roomTenants
                  .map(t => ({ t, flag: staleFlag(t) }))
                  .filter((x): x is { t: TenantRow; flag: string } => !!x.flag);
                const borderColor = !v ? '#ddd'
                  : v.availability === 'available' ? '#22c55e'
                  : v.available_from ? '#f59e0b' : '#3b82f6';
                return (
                  <div key={room.id} style={{ ...S.card, border: `2px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1a1a2e' }}>
                        Ch. {room.room_number}{room.name ? ` — ${room.name}` : ''}
                      </h4>
                      {siteBadge(v)}
                    </div>

                    {room.status === 'maintenance' && (
                      <div style={{ ...S.badge('#b45309', '#fef3c7'), marginBottom: '8px' }}>Maintenance (affichée occupée)</div>
                    )}

                    {/* Occupants selon le critère composite (= ce que voit le site) */}
                    {current.length === 0 && incoming.length === 0 && (
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#16a34a' }}>
                        Aucun bail actif/signé — chambre libre côté site.
                      </p>
                    )}
                    {current.map(t => (
                      <div key={t.id} style={{ margin: '6px 0', fontSize: '13px', color: '#1a1a2e' }}>
                        <strong>{t.first_name} {t.last_name}</strong>
                        <span style={{ color: '#888' }}>
                          {' '}· bail {t.lease_status} · entrée {t.move_in_date ? fmtDate(t.move_in_date) : '—'}
                        </span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                          <label style={{ fontSize: '12px', color: '#888' }}>Sortie :</label>
                          <input
                            type="date"
                            style={S.input}
                            value={editDates[t.id] ?? t.move_out_date ?? ''}
                            onChange={e => setEditDates(prev => ({ ...prev, [t.id]: e.target.value }))}
                          />
                          <button
                            style={{ ...S.btn, background: '#b8860b', color: '#fff', opacity: saving === t.id ? 0.6 : 1 }}
                            disabled={saving === t.id || (editDates[t.id] ?? t.move_out_date ?? '') === (t.move_out_date ?? '')}
                            onClick={() => saveMoveOut(t, editDates[t.id] || null)}
                          >
                            {saving === t.id ? '…' : 'Enregistrer'}
                          </button>
                          {t.move_out_date && (
                            <button
                              style={{ ...S.btn, background: '#f3f4f6', color: '#1a1a2e' }}
                              disabled={saving === t.id}
                              onClick={() => saveMoveOut(t, null)}
                            >
                              Effacer la date
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {incoming.map(t => (
                      <p key={t.id} style={{ margin: '6px 0', fontSize: '13px', color: '#0891b2' }}>
                        ↳ Repreneur : <strong>{t.first_name} {t.last_name}</strong> — entrée {t.move_in_date ? fmtDate(t.move_in_date) : '—'}
                        {' '}(la chambre reste « occupée » sur le site)
                      </p>
                    ))}

                    {/* Fiches incohérentes — la cause historique des badges faux */}
                    {stale.map(({ t, flag }) => (
                      <p key={t.id} style={{ margin: '6px 0 0', fontSize: '12px', color: '#dc2626' }}>
                        ⚠ {t.first_name} {t.last_name} : {flag}
                      </p>
                    ))}

                    <div style={{ marginTop: '10px' }}>
                      <button
                        style={{ ...S.btn, background: room.status === 'maintenance' ? '#dcfce7' : '#fef3c7', color: '#1a1a2e' }}
                        disabled={saving === room.id}
                        onClick={() => toggleMaintenance(room)}
                      >
                        {room.status === 'maintenance' ? 'Remettre en service' : 'Passer en maintenance'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
