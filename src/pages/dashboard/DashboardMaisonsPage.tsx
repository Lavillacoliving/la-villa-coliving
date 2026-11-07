import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import PropertyContentEditor from '@/components/PropertyContentEditor';
import { useIsMobile } from '@/hooks/use-mobile';
import { logAudit } from '@/lib/auditLog';
import { LEGAL_FORM_OPTIONS, DPE_CLASSES, POOL_TYPE_OPTIONS } from '@/lib/entities';
import type { EntityRow, EntityLegalRow, Signatory, Mandate, PropertyEquipment, CurrentChargesRow } from '@/lib/bailV3/types';

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  slug: string;
  room_count: number;
  price_chf: number;
  deposit_months: number;
  legal_entity_name: string;
  legal_entity_type: string;
  siret: string;
  tva: string;
  siege_social: string;
  id_fiscal: string;
  common_areas: string[] | null;
  contract_building_desc: string | null;
  manager_name: string | null;
  entity_id: string;
  description_fr: string | null;
  description_en: string | null;
  features_fr: string | null;
  features_en: string | null;
  status: string;
  is_coliving: boolean;
  charges_energy_chf: number;
  charges_maintenance_chf: number;
  charges_services_chf: number;
  // Bail v3, lot 1 (26/10/2026)
  dpe_class: string | null;
  surface_total_m2: number | null;
  equipment: PropertyEquipment | null;
  setting_clause_fr: string | null;
  setting_clause_en: string | null;
  zone_tendue: boolean;
}

interface Room {
  id: string;
  property_id: string;
  room_number: number;
  name: string | null;
  surface_m2: number | null;
  floor: string | null;
  location_detail: string | null;
  description: string | null;
  bathroom_type: 'private' | 'shared' | null;
  bathroom_detail: string | null;
  has_parking: boolean;
  parking_detail: string | null;
  has_balcony: boolean;
  has_terrace: boolean;
  has_private_entrance: boolean;
  specifics: Record<string, any> | null;
  rent_chf: number | null;
  furniture_inventory: Array<{ item: string; qty: number }> | null;
  dpe_document_url: string | null;
  status: 'active' | 'maintenance' | 'unavailable';
  notes: string | null;
}

interface Tenant {
  id: string;
  first_name: string;
  last_name: string;
  property_id: string;
  room_number: number;
  is_active: boolean;
}

const EQUIPMENT_FLAGS: Array<[keyof PropertyEquipment, string]> = [
  ['sauna', 'Sauna'], ['gym', 'Salle de sport'], ['cinema', 'Home cinéma'], ['game_room', 'Salle de jeux'],
  ['pool_house', 'Pool house'], ['vegetable_garden', 'Potager'], ['volleyball', 'Terrain de volley'],
  ['terraces', 'Terrasses'], ['bbq', 'Barbecue'],
];

function equipmentSummary(eq: PropertyEquipment | null): string {
  if (!eq) return '—';
  const parts: string[] = [];
  const pool = POOL_TYPE_OPTIONS.find(([v]) => v === eq.pool)?.[1];
  if (pool && eq.pool !== 'none') parts.push(pool + (eq.pool_size ? ` (${eq.pool_size})` : ''));
  for (const [key, label] of EQUIPMENT_FLAGS) if (eq[key]) parts.push(label);
  if (eq.garden_m2) parts.push(`jardin ${eq.garden_m2.toLocaleString('fr-FR')} m²`);
  return parts.length ? parts.join(' · ') : '—';
}

const EMPTY_SIGNATORY: Signatory = { name: '', quality: '', order: 1, default: false };

function fmt(n: number, currency = 'CHF') {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ' + currency;
}

const EMPTY_ROOM: Partial<Room> = {
  property_id: '',
  room_number: 0,
  name: '',
  surface_m2: null,
  floor: '',
  location_detail: '',
  description: '',
  bathroom_type: 'private',
  bathroom_detail: '',
  has_parking: false,
  parking_detail: '',
  has_balcony: false,
  has_terrace: false,
  has_private_entrance: false,
  specifics: null,
  rent_chf: null,
  furniture_inventory: [],
  dpe_document_url: '',
  status: 'active',
  notes: '',
};


export default function DashboardMaisonsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const toast = useToast();
  const isMobile = useIsMobile();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalRoom, setModalRoom] = useState<Partial<Room> | null>(null);
  const [isNewRoom, setIsNewRoom] = useState(false);
  const [savingRoom, setSavingRoom] = useState(false);
  const [editingProperty, setEditingProperty] = useState(false);
  const [editPropertyData, setEditPropertyData] = useState<Partial<Property> | null>(null);
  const [savingProperty, setSavingProperty] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{label:string,fn:()=>void}|null>(null);
  // Bail v3, lot 1 : bailleurs (entities + entity_legal) et forfait de charges courant (vue)
  const [entities, setEntities] = useState<EntityRow[]>([]);
  const [entityLegal, setEntityLegal] = useState<Record<string, EntityLegalRow>>({});
  const [currentCharges, setCurrentCharges] = useState<Record<string, CurrentChargesRow>>({});
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [editEntity, setEditEntity] = useState<Partial<EntityRow> | null>(null);
  const [editSignatories, setEditSignatories] = useState<Signatory[]>([]);
  const [editMandate, setEditMandate] = useState<Mandate | null>(null);
  const [savingEntity, setSavingEntity] = useState(false);

  const loadEntities = useCallback(async () => {
    const [eRes, lRes, cRes] = await Promise.all([
      supabase.from('entities').select('*').order('code'),
      supabase.from('entity_legal').select('*'),
      supabase.from('v_property_current_charges').select('*'),
    ]);
    setEntities((eRes.data as EntityRow[]) || []);
    const legal: Record<string, EntityLegalRow> = {};
    for (const row of (lRes.data as EntityLegalRow[]) || []) legal[row.entity_id] = row;
    setEntityLegal(legal);
    const charges: Record<string, CurrentChargesRow> = {};
    for (const row of (cRes.data as CurrentChargesRow[]) || []) charges[row.property_id] = row;
    setCurrentCharges(charges);
  }, []);

  const startEditEntity = (e: EntityRow) => {
    setEditingEntityId(e.id);
    setEditEntity({ ...e });
    const legal = entityLegal[e.id];
    setEditSignatories(legal?.signatories?.length ? legal.signatories.map(sg => ({ ...sg })) : [{ ...EMPTY_SIGNATORY }]);
    setEditMandate(legal?.mandate ? { ...legal.mandate } : null);
  };

  const saveEntity = async () => {
    if (!editingEntityId || !editEntity) return;
    const signatories = editSignatories.filter(sg => sg.name.trim()).map((sg, i) => ({ ...sg, name: sg.name.trim(), quality: sg.quality.trim(), order: i + 1 }));
    if (signatories.length === 0) { toast.warning('Au moins un signataire'); return; }
    if (editEntity.legal_form === 'indivision' && signatories.length < 2) { toast.warning('Une indivision a au moins deux signataires'); return; }
    setSavingEntity(true);
    const { error: e1 } = await supabase.from('entities').update({
      legal_form: editEntity.legal_form || null,
      legal_name: editEntity.legal_name || null,
      trade_name: editEntity.trade_name || null,
      registration: editEntity.registration || null,
      capital_eur: editEntity.capital_eur ?? null,
      siege: editEntity.siege || null,
      vat_mention: editEntity.vat_mention || 'Loyers et charges non soumis à la TVA (article 261 D 4° du CGI)',
      iban: editEntity.iban || null,
      bic: editEntity.bic || null,
    }).eq('id', editingEntityId);
    const mandate = editMandate && editMandate.mandatary.trim() ? editMandate : null;
    const { error: e2 } = e1 ? { error: null } : await supabase.from('entity_legal').upsert(
      { entity_id: editingEntityId, signatories, mandate, updated_at: new Date().toISOString() },
      { onConflict: 'entity_id' },
    );
    setSavingEntity(false);
    const error = e1 || e2;
    if (error) { toast.error('Erreur: ' + error.message); return; }
    logAudit('update', 'entity', editingEntityId, { legal_form: editEntity.legal_form, legal_name: editEntity.legal_name, signatories: signatories.map(sg => sg.name), mandate: mandate ? mandate.mandatary : null });
    toast.success('Bailleur enregistré');
    setEditingEntityId(null); setEditEntity(null);
    loadEntities();
  };

  const load = useCallback(async () => {
    setLoading(true);
    const [pRes, rRes, tRes] = await Promise.all([
      supabase.from('properties').select('*').order('name'),
      supabase.from('rooms').select('*').order('room_number'),
      supabase.from('tenants').select('id,first_name,last_name,property_id,room_number,is_active'),
    ]);
    setProperties(pRes.data || []);
    setRooms(rRes.data || []);
    setTenants(tRes.data || []);
    if (!selectedPropertyId && pRes.data && pRes.data.length > 0) {
      setSelectedPropertyId(pRes.data[0].id);
    }
    setLoading(false);
    loadEntities();
  }, [selectedPropertyId, loadEntities]);

  useEffect(() => {
    load();
  }, [load]);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const propertyRooms = selectedProperty ? rooms.filter(r => r.property_id === selectedProperty.id) : [];

  const openRoomModal = (room?: Room) => {
    if (!selectedProperty) return;
    if (room) {
      setModalRoom({ ...room });
      setIsNewRoom(false);
    } else {
      setModalRoom({ ...EMPTY_ROOM, property_id: selectedProperty.id });
      setIsNewRoom(true);
    }
  };

  const saveRoom = async () => {
    if (!modalRoom) return;
    if (!modalRoom.property_id) {
      toast.warning('Propriété manquante');
      return;
    }
    if (!modalRoom.room_number || modalRoom.room_number <= 0) {
      toast.warning('Numéro de chambre invalide');
      return;
    }
    setSavingRoom(true);
    const data: any = {
      property_id: modalRoom.property_id,
      room_number: modalRoom.room_number,
      name: modalRoom.name || null,
      surface_m2: modalRoom.surface_m2 || null,
      floor: modalRoom.floor || null,
      location_detail: modalRoom.location_detail || null,
      description: modalRoom.description || null,
      bathroom_type: modalRoom.bathroom_type || null,
      bathroom_detail: modalRoom.bathroom_detail || null,
      has_parking: modalRoom.has_parking || false,
      parking_detail: modalRoom.parking_detail || null,
      has_balcony: modalRoom.has_balcony || false,
      has_terrace: modalRoom.has_terrace || false,
      has_private_entrance: modalRoom.has_private_entrance || false,
      specifics: modalRoom.specifics || null,
      rent_chf: modalRoom.rent_chf || null,
      furniture_inventory: modalRoom.furniture_inventory || [],
      dpe_document_url: modalRoom.dpe_document_url || null,
      status: modalRoom.status || 'active',
      notes: modalRoom.notes || null,
    };
    let err;
    if (isNewRoom) {
      ({ error: err } = await supabase.from('rooms').insert(data));
    } else {
      ({ error: err } = await supabase.from('rooms').update(data).eq('id', modalRoom.id));
    }
    setSavingRoom(false);
    if (err) {
      toast.error('Erreur: ' + err.message);
      return;
    }
    setModalRoom(null);
    load();
  };

  const deleteRoom = () => {
    if (!modalRoom?.id) return;
    setDeleteConfirm({label:`Chambre ${modalRoom.room_number}`,fn:async()=>{
      const { error } = await supabase.from('rooms').delete().eq('id', modalRoom.id);
      if (error) { toast.error('Erreur: ' + error.message); return; }
      setModalRoom(null); load();
    }});
  };

  const saveProperty = async () => {
    if (!editPropertyData || !selectedPropertyId) return;
    if (!editPropertyData.name) {
      toast.warning('Nom de propriété obligatoire');
      return;
    }
    setSavingProperty(true);
    const data: any = {
      name: editPropertyData.name,
      address: editPropertyData.address || null,
      city: editPropertyData.city || null,
      legal_entity_name: editPropertyData.legal_entity_name || null,
      legal_entity_type: editPropertyData.legal_entity_type || null,
      siret: editPropertyData.siret || null,
      tva: editPropertyData.tva || null,
      siege_social: editPropertyData.siege_social || null,
      id_fiscal: editPropertyData.id_fiscal || null,
      common_areas: editPropertyData.common_areas || [],
      contract_building_desc: editPropertyData.contract_building_desc || null,
      manager_name: editPropertyData.manager_name || null,
      charges_energy_chf: editPropertyData.charges_energy_chf || 0,
      charges_maintenance_chf: editPropertyData.charges_maintenance_chf || 0,
      charges_services_chf: editPropertyData.charges_services_chf || 0,
      // Bail v3, lot 1
      dpe_class: editPropertyData.dpe_class || null,
      surface_total_m2: editPropertyData.surface_total_m2 || null,
      equipment: editPropertyData.equipment || {},
      setting_clause_fr: editPropertyData.setting_clause_fr || null,
      setting_clause_en: editPropertyData.setting_clause_en || null,
      zone_tendue: editPropertyData.zone_tendue !== false,
    };
    const { error } = await supabase.from('properties').update(data).eq('id', selectedPropertyId);
    setSavingProperty(false);
    if (error) {
      toast.error('Erreur: ' + error.message);
      return;
    }
    setEditingProperty(false);
    setEditPropertyData(null);
    load();
  };

  const getTenantForRoom = (roomNum: number) => {
    return tenants.find(t => t.property_id === selectedPropertyId && t.room_number === roomNum && t.is_active);
  };



  const S = {
    card: { background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    label: { fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' as const },
    val: { fontSize: '20px', fontWeight: 700 as const, color: '#1a1a2e' },
    btn: { padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
    input: {
      width: '100%',
      padding: '8px 10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box' as const,
    },
    fieldLabel: { fontSize: '12px', fontWeight: 600 as const, color: '#555', marginBottom: '4px', display: 'block' as const },
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: '#b8860b' }}>Chargement...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', height: isMobile ? 'auto' : 'calc(100vh - 120px)', overflow: isMobile ? 'visible' : 'hidden' }}>
      {/* LEFT PANEL: Properties */}
      <div style={{ width: isMobile ? '100%' : '280px', display: 'flex', flexDirection: 'column', overflow: isMobile ? 'visible' : 'auto', borderRight: isMobile ? 'none' : '1px solid #e5e7eb', paddingRight: isMobile ? 0 : '12px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>Propriétés</h3>
        {properties.map(p => (
          <div
            key={p.id}
            onClick={() => setSelectedPropertyId(p.id)}
            style={{
              padding: '12px',
              marginBottom: '8px',
              background: selectedPropertyId === p.id ? '#b8860b' : '#f5f5f5',
              color: selectedPropertyId === p.id ? '#fff' : '#1a1a2e',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: selectedPropertyId === p.id ? 600 : 400,
              transition: 'all 0.2s',
              border: selectedPropertyId === p.id ? '2px solid #9a6d04' : '1px solid #e5e7eb',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '2px' }}>{p.is_coliving ? '🏠' : '🏢'} {p.name}</div>
            <div style={{ fontSize: '11px', opacity: 0.85 }}>{p.is_coliving ? `${p.room_count} chambres` : 'Appartement'}</div>
            <div style={{ fontSize: '11px', opacity: 0.85 }}>{fmt(p.price_chf)}/mois</div>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL: Property details + rooms */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: isMobile ? 'visible' : 'auto' }}>
        {selectedProperty ? (
          <>
            {/* Property details card */}
            <div style={{ ...S.card, marginBottom: '20px' }}>
              {!editingProperty ? (
                <>
                  <div className="dash-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h2 style={{ margin: 0, fontSize: '24px', color: '#1a1a2e' }}>{selectedProperty.name}</h2>
                    <button
                      onClick={() => {
                        setEditingProperty(true);
                        setEditPropertyData({ ...selectedProperty });
                      }}
                      style={{ ...S.btn, background: '#b8860b', color: '#fff', fontSize: '12px' }}
                    >
                      Éditer
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={S.label}>Adresse</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a2e' }}>{selectedProperty.address || '—'}</p>
                    </div>
                    <div>
                      <p style={S.label}>Ville</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a2e' }}>{selectedProperty.city || '—'}</p>
                    </div>
                    <div>
                      <p style={S.label}>Entité légale</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a2e' }}>
                        {selectedProperty.legal_entity_name} ({selectedProperty.legal_entity_type})
                      </p>
                    </div>
                    <div>
                      <p style={S.label}>SIRET</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a2e' }}>{selectedProperty.siret || '—'}</p>
                    </div>
                    <div>
                      <p style={S.label}>TVA</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a2e' }}>{selectedProperty.tva || '—'}</p>
                    </div>
                    <div>
                      <p style={S.label}>ID Fiscal</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a2e' }}>{selectedProperty.id_fiscal || '—'}</p>
                    </div>
                    <div>
                      <p style={S.label}>DPE · surface totale · zone</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a2e' }}>
                        {selectedProperty.dpe_class ? `Classe ${selectedProperty.dpe_class}` : 'DPE —'} · {selectedProperty.surface_total_m2 ? `${selectedProperty.surface_total_m2} m²` : 'surface —'} · {selectedProperty.zone_tendue ? 'zone tendue' : 'hors zone tendue'}
                      </p>
                    </div>
                    <div>
                      <p style={S.label}>Forfait de charges courant (bail v3)</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a2e' }}>
                        {currentCharges[selectedProperty.id]
                          ? `${currentCharges[selectedProperty.id].per_room_month_eur.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € / chambre / mois — exercice ${currentCharges[selectedProperty.id].fiscal_year}, ${currentCharges[selectedProperty.id].status === 'valide' ? 'validé' : 'provisoire'} (${currentCharges[selectedProperty.id].room_count} chambres, ${currentCharges[selectedProperty.id].total_recoverable_eur.toLocaleString('fr-FR')} €/an)`
                          : 'Aucun forfait saisi'}
                      </p>
                    </div>
                  </div>
                  {selectedProperty.is_coliving && (
                    <div style={{ marginTop: '16px' }}>
                      <p style={S.label}>Équipements (art. 2.1)</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>{equipmentSummary(selectedProperty.equipment)}</p>
                      {selectedProperty.setting_clause_fr && (
                        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#777', fontStyle: 'italic' }}>{selectedProperty.setting_clause_fr}</p>
                      )}
                    </div>
                  )}
                  {selectedProperty.common_areas && selectedProperty.common_areas.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <p style={S.label}>Espaces communs</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {selectedProperty.common_areas.map((area, i) => (
                          <span
                            key={i}
                            style={{
                              background: '#f0f0f0',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              color: '#555',
                            }}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProperty.is_coliving && (
                    <div style={{ marginTop: '16px', padding: '12px', background: '#f9f7f4', borderRadius: '8px', borderLeft: '3px solid #c9a96e' }}>
                      <p style={{ ...S.label, color: '#c9a96e' }}>Charges forfaitaires mensuelles (EUR)</p>
                      <div style={{ display: 'flex', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: '20px', fontSize: '14px' }}>
                        <span>Énergie : <strong>{selectedProperty.charges_energy_chf || 0} €</strong></span>
                        <span>Maintenance : <strong>{selectedProperty.charges_maintenance_chf || 0} €</strong></span>
                        <span>Services : <strong>{selectedProperty.charges_services_chf || 0} €</strong></span>
                        <span style={{ color: '#b8860b', fontWeight: 700 }}>Total : {(selectedProperty.charges_energy_chf || 0) + (selectedProperty.charges_maintenance_chf || 0) + (selectedProperty.charges_services_chf || 0)} €</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Éditer propriété</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <label style={S.fieldLabel}>Nom</label>
                      <input
                        style={S.input}
                        value={editPropertyData?.name || ''}
                        onChange={e => setEditPropertyData({ ...editPropertyData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={S.fieldLabel}>Adresse</label>
                      <input
                        style={S.input}
                        value={editPropertyData?.address || ''}
                        onChange={e => setEditPropertyData({ ...editPropertyData, address: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={S.fieldLabel}>Entité légale</label>
                      <input
                        style={S.input}
                        value={editPropertyData?.legal_entity_name || ''}
                        onChange={e => setEditPropertyData({ ...editPropertyData, legal_entity_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={S.fieldLabel}>Type d'entité</label>
                      <select
                        style={S.input}
                        value={editPropertyData?.legal_entity_type || 'SCI'}
                        onChange={e => setEditPropertyData({ ...editPropertyData, legal_entity_type: e.target.value })}
                      >
                        <option value="Indivision">Indivision</option>
                        <option value="SCI">SCI</option>
                        <option value="SARL">SARL</option>
                        <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                      </select>
                    </div>
                    <div>
                      <label style={S.fieldLabel}>SIRET</label>
                      <input
                        style={S.input}
                        value={editPropertyData?.siret || ''}
                        onChange={e => setEditPropertyData({ ...editPropertyData, siret: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={S.fieldLabel}>TVA</label>
                      <input
                        style={S.input}
                        value={editPropertyData?.tva || ''}
                        onChange={e => setEditPropertyData({ ...editPropertyData, tva: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={S.fieldLabel}>Classe DPE</label>
                      <select style={S.input} value={editPropertyData?.dpe_class || ''} onChange={e => setEditPropertyData({ ...editPropertyData, dpe_class: e.target.value || null })}>
                        <option value="">—</option>
                        {DPE_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={S.fieldLabel}>Surface totale (m²)</label>
                      <input type="number" step="0.01" style={S.input} value={editPropertyData?.surface_total_m2 ?? ''} onChange={e => setEditPropertyData({ ...editPropertyData, surface_total_m2: e.target.value === '' ? null : Number(e.target.value) })} />
                    </div>
                    <div>
                      <label style={S.fieldLabel}>Zone tendue</label>
                      <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <input type="checkbox" checked={editPropertyData?.zone_tendue !== false} onChange={e => setEditPropertyData({ ...editPropertyData, zone_tendue: e.target.checked })} />
                        plafond de relocation (dernier loyer HC × IRL)
                      </label>
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px', padding: '12px', background: '#f9f7f4', borderRadius: '8px' }}>
                    <label style={{ ...S.fieldLabel, display: 'block', marginBottom: '8px' }}>Équipements de la maison (art. 2.1 du bail v3)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={S.fieldLabel}>Piscine</label>
                        <select style={S.input} value={editPropertyData?.equipment?.pool || 'none'} onChange={e => setEditPropertyData({ ...editPropertyData, equipment: { ...(editPropertyData?.equipment || {}), pool: e.target.value as PropertyEquipment['pool'] } })}>
                          {POOL_TYPE_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={S.fieldLabel}>Dimensions du bassin</label>
                        <input style={S.input} value={editPropertyData?.equipment?.pool_size || ''} onChange={e => setEditPropertyData({ ...editPropertyData, equipment: { ...(editPropertyData?.equipment || {}), pool_size: e.target.value || undefined } })} />
                      </div>
                      <div>
                        <label style={S.fieldLabel}>Jardin (m²)</label>
                        <input type="number" style={S.input} value={editPropertyData?.equipment?.garden_m2 ?? ''} onChange={e => setEditPropertyData({ ...editPropertyData, equipment: { ...(editPropertyData?.equipment || {}), garden_m2: e.target.value === '' ? undefined : Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
                      {EQUIPMENT_FLAGS.map(([key, label]) => (
                        <label key={key} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input type="checkbox" checked={!!editPropertyData?.equipment?.[key]} onChange={e => setEditPropertyData({ ...editPropertyData, equipment: { ...(editPropertyData?.equipment || {}), [key]: e.target.checked } })} />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={S.fieldLabel}>Phrase de cadre de l'art. 2.1 (FR)</label>
                      <textarea style={{ ...S.input, height: '90px' }} value={editPropertyData?.setting_clause_fr || ''} onChange={e => setEditPropertyData({ ...editPropertyData, setting_clause_fr: e.target.value })} />
                    </div>
                    <div>
                      <label style={S.fieldLabel}>Phrase de cadre de l'art. 2.1 (EN)</label>
                      <textarea style={{ ...S.input, height: '90px' }} value={editPropertyData?.setting_clause_en || ''} onChange={e => setEditPropertyData({ ...editPropertyData, setting_clause_en: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={S.fieldLabel}>Espaces communs (séparés par virgule)</label>
                    <textarea
                      style={{ ...S.input, height: '60px' }}
                      value={(editPropertyData?.common_areas || []).join(', ')}
                      onChange={e =>
                        setEditPropertyData({
                          ...editPropertyData,
                          common_areas: e.target.value
                            ? e.target.value
                                .split(',')
                                .map(a => a.trim())
                                .filter(Boolean)
                            : [],
                        })
                      }
                    />
                  </div>
                  <div style={{ marginTop: '16px', padding: '12px', background: '#f9f7f4', borderRadius: '8px', borderLeft: '3px solid #c9a96e' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#c9a96e', marginBottom: '8px', display: 'block' }}>Charges forfaitaires mensuelles (EUR)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={S.fieldLabel}>Énergie</label>
                        <input type="number" style={S.input} value={editPropertyData?.charges_energy_chf || 0} onChange={e => setEditPropertyData({ ...editPropertyData, charges_energy_chf: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div>
                        <label style={S.fieldLabel}>Maintenance</label>
                        <input type="number" style={S.input} value={editPropertyData?.charges_maintenance_chf || 0} onChange={e => setEditPropertyData({ ...editPropertyData, charges_maintenance_chf: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div>
                        <label style={S.fieldLabel}>Services</label>
                        <input type="number" style={S.input} value={editPropertyData?.charges_services_chf || 0} onChange={e => setEditPropertyData({ ...editPropertyData, charges_services_chf: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setEditingProperty(false);
                        setEditPropertyData(null);
                      }}
                      style={{
                        ...S.btn,
                        background: '#fff',
                        border: '1px solid #ddd',
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveProperty}
                      disabled={savingProperty}
                      style={{
                        ...S.btn,
                        background: '#b8860b',
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    >
                      {savingProperty ? '...' : 'Enregistrer'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Bailleurs (bail v3, lot 1) : identité juridique, signataires, mandat */}
            <div style={{ ...S.card, marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a2e' }}>Bailleurs (entités juridiques)</h3>
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#777' }}>Bloc imprimé en tête du bail v3. Les signataires et le mandat ne sont lisibles que par l'administrateur.</p>
              {entities.filter(e => e.code !== 'MB').map(e => {
                const legal = entityLegal[e.id];
                const isEditing = editingEntityId === e.id && editEntity;
                return (
                  <div key={e.id} style={{ borderTop: '1px solid #eee', padding: '12px 0' }}>
                    {!isEditing ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ fontSize: '13px', color: '#1a1a2e', lineHeight: 1.6 }}>
                          <strong>{e.legal_name || e.name}</strong> — {LEGAL_FORM_OPTIONS.find(([v]) => v === e.legal_form)?.[1] || 'forme non renseignée'}
                          {e.trade_name && <> · enseigne {e.trade_name}</>}
                          <br />{e.registration || 'immatriculation —'}{e.capital_eur ? ` · capital ${e.capital_eur.toLocaleString('fr-FR')} €` : ''} · siège {e.siege || '—'}
                          <br /><span style={{ color: '#777' }}>{e.vat_mention}</span>
                          <br />Signataires : {legal?.signatories?.length ? legal.signatories.map(sg => `${sg.name} (${sg.quality}${sg.default ? ', par défaut' : ''})`).join(' ; ') : '—'}
                          {' · '}Mandat : {legal?.mandate ? `${legal.mandate.mandatary} depuis le ${legal.mandate.since}` : 'aucun (art. 17 dormant)'}
                        </div>
                        <button onClick={() => startEditEntity(e)} style={{ ...S.btn, background: '#fff', border: '1px solid #ddd', fontSize: '12px', whiteSpace: 'nowrap' }}>Éditer</button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                          <div>
                            <label style={S.fieldLabel}>Forme juridique</label>
                            <select style={S.input} value={editEntity?.legal_form || ''} onChange={ev => setEditEntity({ ...editEntity, legal_form: (ev.target.value || null) as EntityRow['legal_form'] })}>
                              <option value="">—</option>
                              {LEGAL_FORM_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={S.fieldLabel}>Dénomination (imprimée au bail)</label>
                            <input style={S.input} value={editEntity?.legal_name || ''} onChange={ev => setEditEntity({ ...editEntity, legal_name: ev.target.value })} />
                          </div>
                          <div>
                            <label style={S.fieldLabel}>Enseigne</label>
                            <input style={S.input} value={editEntity?.trade_name || ''} onChange={ev => setEditEntity({ ...editEntity, trade_name: ev.target.value })} />
                          </div>
                          <div>
                            <label style={S.fieldLabel}>Immatriculation (SIRET / RCS)</label>
                            <input style={S.input} value={editEntity?.registration || ''} onChange={ev => setEditEntity({ ...editEntity, registration: ev.target.value })} />
                          </div>
                          <div>
                            <label style={S.fieldLabel}>Capital (€, SCI)</label>
                            <input type="number" style={S.input} value={editEntity?.capital_eur ?? ''} onChange={ev => setEditEntity({ ...editEntity, capital_eur: ev.target.value === '' ? null : Number(ev.target.value) })} />
                          </div>
                          <div>
                            <label style={S.fieldLabel}>Siège</label>
                            <input style={S.input} value={editEntity?.siege || ''} onChange={ev => setEditEntity({ ...editEntity, siege: ev.target.value })} />
                          </div>
                          <div>
                            <label style={S.fieldLabel}>IBAN</label>
                            <input style={S.input} value={editEntity?.iban || ''} onChange={ev => setEditEntity({ ...editEntity, iban: ev.target.value })} />
                          </div>
                          <div>
                            <label style={S.fieldLabel}>BIC</label>
                            <input style={S.input} value={editEntity?.bic || ''} onChange={ev => setEditEntity({ ...editEntity, bic: ev.target.value })} />
                          </div>
                          <div>
                            <label style={S.fieldLabel}>Mention TVA</label>
                            <input style={S.input} value={editEntity?.vat_mention || ''} onChange={ev => setEditEntity({ ...editEntity, vat_mention: ev.target.value })} />
                          </div>
                        </div>
                        <label style={{ ...S.fieldLabel, display: 'block', marginBottom: '6px' }}>Signataires du bail (ordre d'impression ; « par défaut » = proposé dans le générateur)</label>
                        {editSignatories.map((sg, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 2fr auto auto', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                            <input style={S.input} placeholder="Nom" value={sg.name} onChange={ev => setEditSignatories(editSignatories.map((x, j) => j === i ? { ...x, name: ev.target.value } : x))} />
                            <input style={S.input} placeholder="Qualité (gérant, propriétaire indivis…)" value={sg.quality} onChange={ev => setEditSignatories(editSignatories.map((x, j) => j === i ? { ...x, quality: ev.target.value } : x))} />
                            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <input type="checkbox" checked={!!sg.default} onChange={ev => setEditSignatories(editSignatories.map((x, j) => j === i ? { ...x, default: ev.target.checked } : x))} /> par défaut
                            </label>
                            <button onClick={() => setEditSignatories(editSignatories.filter((_, j) => j !== i))} style={{ ...S.btn, background: '#fff', border: '1px solid #ddd', fontSize: '12px' }}>✕</button>
                          </div>
                        ))}
                        <button onClick={() => setEditSignatories([...editSignatories, { ...EMPTY_SIGNATORY, order: editSignatories.length + 1 }])} style={{ ...S.btn, background: '#fff', border: '1px solid #ddd', fontSize: '12px', marginBottom: '10px' }}>+ Signataire</button>
                        <label style={{ ...S.fieldLabel, display: 'block', marginBottom: '6px' }}>Mandat de gestion (art. 17 — vide = dormant)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 2fr 2fr', gap: '8px', marginBottom: '10px' }}>
                          <input style={S.input} placeholder="Mandataire" value={editMandate?.mandatary || ''} onChange={ev => setEditMandate({ ...(editMandate || { mandatary: '', since: '', scope: '' }), mandatary: ev.target.value })} />
                          <input type="date" style={S.input} value={editMandate?.since || ''} onChange={ev => setEditMandate({ ...(editMandate || { mandatary: '', since: '', scope: '' }), since: ev.target.value })} />
                          <input style={S.input} placeholder="Étendue du mandat" value={editMandate?.scope || ''} onChange={ev => setEditMandate({ ...(editMandate || { mandatary: '', since: '', scope: '' }), scope: ev.target.value })} />
                          <input style={S.input} placeholder="Compte d'encaissement" value={editMandate?.account || ''} onChange={ev => setEditMandate({ ...(editMandate || { mandatary: '', since: '', scope: '' }), account: ev.target.value || undefined })} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setEditingEntityId(null); setEditEntity(null); }} style={{ ...S.btn, background: '#fff', border: '1px solid #ddd' }}>Annuler</button>
                          <button onClick={saveEntity} disabled={savingEntity} style={{ ...S.btn, background: '#b8860b', color: '#fff', fontWeight: 600 }}>{savingEntity ? '...' : 'Enregistrer'}</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rooms grid */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>
                  {selectedProperty.is_coliving ? `Chambres (${propertyRooms.length})` : 'Logement'}
                </h3>
              </div>

              {propertyRooms.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', padding: '40px 20px' }}>Aucune chambre pour le moment</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                  {propertyRooms.map(room => {
                    const tenant = getTenantForRoom(room.room_number);
                    const isOccupied = !!tenant;
                    const badgeColor = room.status === 'maintenance' ? '#f59e0b' : room.status === 'unavailable' ? '#ef4444' : isOccupied ? '#3b82f6' : '#22c55e';
                    const badgeLabel = room.status === 'maintenance' ? 'Maintenance' : room.status === 'unavailable' ? 'Non dispo' : isOccupied ? 'Occupée' : 'Libre';
                    const borderColor = room.status === 'maintenance' ? '#f59e0b' : room.status === 'unavailable' ? '#ef4444' : isOccupied ? '#3b82f6' : '#22c55e';
                    return (
                      <div
                        key={room.id}
                        onClick={() => openRoomModal(room)}
                        style={{
                          ...S.card,
                          cursor: 'pointer',
                          border: `2px solid ${borderColor}`,
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)')}
                        onMouseOut={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)')}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1a1a2e' }}>{selectedProperty.is_coliving ? `Ch. ${room.room_number}` : (room.name || 'Appartement')}</h4>
                          <span
                            style={{
                              background: badgeColor,
                              color: '#fff',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}
                          >
                            {badgeLabel}
                          </span>
                        </div>
                        {room.name && <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666', fontStyle: 'italic' }}>"{room.name}"</p>}
                        {room.surface_m2 != null && room.surface_m2 > 0 && <p style={{ margin: '4px 0', fontSize: '12px', color: '#555' }}>📐 {room.surface_m2} m²</p>}
                        {room.floor && <p style={{ margin: '4px 0', fontSize: '12px', color: '#555' }}>🏢 Étage {room.floor}</p>}
                        {room.bathroom_type && <p style={{ margin: '4px 0', fontSize: '12px', color: '#555' }}>🚿 {room.bathroom_type === 'private' ? 'SDB privée' : 'SDB partagée'}</p>}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                          {room.has_parking && <span style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>🅿️ Parking</span>}
                          {room.has_balcony && <span style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>🌞 Balcon</span>}
                          {room.has_terrace && <span style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>🪴 Terrasse</span>}
                          {room.has_private_entrance && <span style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>🚪 Entrée privée</span>}
                        </div>
                        {room.rent_chf && <p style={{ margin: '8px 0 0', fontSize: '14px', fontWeight: 600, color: '#b8860b' }}>{fmt(room.rent_chf)}/mois</p>}
                        {tenant && (
                          <div style={{ marginTop: '8px', background: '#f0fdf4', padding: '6px 8px', borderRadius: '6px', fontSize: '12px', color: '#15803d' }}>
                            👤 {tenant.first_name} {tenant.last_name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Property Content Editor — Portail Ma Maison */}
            <PropertyContentEditor propertyId={selectedProperty.id} propertyName={selectedProperty.name} />
          </>
        ) : (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Sélectionnez une propriété</p>
        )}
      </div>

      {/* ROOM MODAL */}
      {modalRoom && (
        <div
          className="dash-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflow: 'auto',
            padding: '20px',
          }}
          onClick={() => setModalRoom(null)}
        >
          <div
            className="dash-modal"
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              width: '600px',
              maxWidth: '95vw',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>
                {isNewRoom ? 'Nouvelle chambre' : `Chambre ${modalRoom.room_number}`}
              </h2>
              <button
                onClick={() => setModalRoom(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={S.fieldLabel}>Numéro de chambre *</label>
                <input
                  type="number"
                  style={S.input}
                  value={modalRoom.room_number || ''}
                  onChange={e => setModalRoom({ ...modalRoom, room_number: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label style={S.fieldLabel}>Nom (optionnel)</label>
                <input
                  style={S.input}
                  value={modalRoom.name || ''}
                  onChange={e => setModalRoom({ ...modalRoom, name: e.target.value })}
                  placeholder="ex: Suite Deluxe"
                />
              </div>
              <div>
                <label style={S.fieldLabel}>Surface (m²)</label>
                <input
                  type="number"
                  step="0.1"
                  style={S.input}
                  value={modalRoom.surface_m2 || ''}
                  onChange={e => setModalRoom({ ...modalRoom, surface_m2: parseFloat(e.target.value) || null })}
                />
              </div>
              <div>
                <label style={S.fieldLabel}>Étage</label>
                <input
                  style={S.input}
                  value={modalRoom.floor || ''}
                  onChange={e => setModalRoom({ ...modalRoom, floor: e.target.value })}
                  placeholder="ex: RDC, 1er"
                />
              </div>
              <div>
                <label style={S.fieldLabel}>Loyer CHF/mois</label>
                <input
                  type="number"
                  style={S.input}
                  value={modalRoom.rent_chf || ''}
                  onChange={e => setModalRoom({ ...modalRoom, rent_chf: parseInt(e.target.value) || null })}
                />
              </div>
              <div>
                <label style={S.fieldLabel}>Type SDB</label>
                <select
                  style={S.input}
                  value={modalRoom.bathroom_type || 'private'}
                  onChange={e => setModalRoom({ ...modalRoom, bathroom_type: (e.target.value as any) || 'private' })}
                >
                  <option value="private">Privée</option>
                  <option value="shared">Partagée</option>
                </select>
              </div>
              <div>
                <label style={S.fieldLabel}>Détail SDB</label>
                <input
                  style={S.input}
                  value={modalRoom.bathroom_detail || ''}
                  onChange={e => setModalRoom({ ...modalRoom, bathroom_detail: e.target.value })}
                  placeholder="ex: douche, baignoire..."
                />
              </div>
              <div>
                <label style={S.fieldLabel}>Statut</label>
                <select
                  style={S.input}
                  value={modalRoom.status || 'active'}
                  onChange={e => setModalRoom({ ...modalRoom, status: (e.target.value as any) || 'active' })}
                >
                  <option value="active">Actif</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Non disponible</option>
                </select>
              </div>
              <div>
                <label style={S.fieldLabel}>Localisation détaillée</label>
                <input
                  style={S.input}
                  value={modalRoom.location_detail || ''}
                  onChange={e => setModalRoom({ ...modalRoom, location_detail: e.target.value })}
                  placeholder="ex: côté jardin, vue lac"
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={S.fieldLabel}>Description</label>
              <textarea
                style={{ ...S.input, height: '60px', resize: 'vertical' }}
                value={modalRoom.description || ''}
                onChange={e => setModalRoom({ ...modalRoom, description: e.target.value })}
              />
            </div>

            {/* Amenities checkboxes */}
            <div style={{ marginBottom: '12px', background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={modalRoom.has_parking || false}
                  onChange={e => setModalRoom({ ...modalRoom, has_parking: e.target.checked })}
                />
                <span style={{ fontSize: '14px' }}>🅿️ Parking</span>
              </label>
              {modalRoom.has_parking && (
                <input
                  style={{ ...S.input, marginBottom: '8px', marginLeft: '24px' }}
                  placeholder="Détail parking (ex: garage, place extérieure)"
                  value={modalRoom.parking_detail || ''}
                  onChange={e => setModalRoom({ ...modalRoom, parking_detail: e.target.value })}
                />
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={modalRoom.has_balcony || false}
                  onChange={e => setModalRoom({ ...modalRoom, has_balcony: e.target.checked })}
                />
                <span style={{ fontSize: '14px' }}>🌞 Balcon</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={modalRoom.has_terrace || false}
                  onChange={e => setModalRoom({ ...modalRoom, has_terrace: e.target.checked })}
                />
                <span style={{ fontSize: '14px' }}>🪴 Terrasse</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={modalRoom.has_private_entrance || false}
                  onChange={e => setModalRoom({ ...modalRoom, has_private_entrance: e.target.checked })}
                />
                <span style={{ fontSize: '14px' }}>🚪 Entrée privée</span>
              </label>
            </div>

            {/* Furniture inventory */}
            <div style={{ marginBottom: '12px' }}>
              <label style={S.fieldLabel}>Inventaire mobilier</label>
              {(modalRoom.furniture_inventory || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    style={{ ...S.input, flex: 1 }}
                    placeholder="Objet"
                    value={item.item}
                    onChange={e => {
                      const newInv = [...(modalRoom.furniture_inventory || [])];
                      newInv[i] = { ...newInv[i], item: e.target.value };
                      setModalRoom({ ...modalRoom, furniture_inventory: newInv });
                    }}
                  />
                  <input
                    type="number"
                    min="1"
                    style={{ ...S.input, width: '60px' }}
                    placeholder="Qté"
                    value={item.qty}
                    onChange={e => {
                      const newInv = [...(modalRoom.furniture_inventory || [])];
                      newInv[i] = { ...newInv[i], qty: parseInt(e.target.value) || 1 };
                      setModalRoom({ ...modalRoom, furniture_inventory: newInv });
                    }}
                  />
                  <button
                    onClick={() => {
                      const newInv = (modalRoom.furniture_inventory || []).filter((_, idx) => idx !== i);
                      setModalRoom({ ...modalRoom, furniture_inventory: newInv });
                    }}
                    style={{
                      ...S.btn,
                      background: '#ef4444',
                      color: '#fff',
                      padding: '8px 12px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newInv = [...(modalRoom.furniture_inventory || []), { item: '', qty: 1 }];
                  setModalRoom({ ...modalRoom, furniture_inventory: newInv });
                }}
                style={{
                  ...S.btn,
                  background: '#3D4A38',
                  color: '#fff',
                  fontSize: '12px',
                  marginTop: '8px',
                }}
              >
                + Ajouter un item
              </button>
            </div>

            {/* Specifics for Le Lodge */}
            {selectedProperty?.slug === 'lelodge' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={S.fieldLabel}>Code d'accès porte</label>
                <input
                  style={S.input}
                  placeholder="ex: 1234"
                  value={modalRoom.specifics?.door_code || ''}
                  onChange={e => setModalRoom({ ...modalRoom, specifics: { ...modalRoom.specifics, door_code: e.target.value } })}
                />
              </div>
            )}

            {/* DPE document */}
            <div style={{ marginBottom: '12px' }}>
              <label style={S.fieldLabel}>URL document DPE</label>
              <input
                type="url"
                style={S.input}
                placeholder="https://..."
                value={modalRoom.dpe_document_url || ''}
                onChange={e => setModalRoom({ ...modalRoom, dpe_document_url: e.target.value })}
              />
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={S.fieldLabel}>Notes internes</label>
              <textarea
                style={{ ...S.input, height: '60px', resize: 'vertical' }}
                value={modalRoom.notes || ''}
                onChange={e => setModalRoom({ ...modalRoom, notes: e.target.value })}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              <div>{!isNewRoom && <button onClick={deleteRoom} style={{ ...S.btn, background: '#ef4444', color: '#fff' }}>Supprimer</button>}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setModalRoom(null)}
                  style={{
                    ...S.btn,
                    background: '#fff',
                    border: '1px solid #ddd',
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={saveRoom}
                  disabled={savingRoom}
                  style={{
                    ...S.btn,
                    background: '#b8860b',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {savingRoom ? '...' : 'Enregistrer'}
                </button>
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
