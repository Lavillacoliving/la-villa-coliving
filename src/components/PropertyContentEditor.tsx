import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { seedPropertyContent, savePropertyContent, type PropertyContentRow } from '@/hooks/usePropertyContent';

interface Props {
  propertyId: string;
  propertyName: string;
}

const SECTION_LABELS: Record<string, string> = {
  rules: 'Règles de vie',
  spaces: 'Règles des espaces',
  wifi: 'WiFi & Streaming',
  practical: 'Infos pratiques',
  emergency: 'Urgences',
  contacts: 'Contacts essentiels',
  cleaning: 'Entretien & ménage',
  eco: 'Éco-responsabilité',
  departure: 'Préparer ton départ',
};

export default function PropertyContentEditor({ propertyId, propertyName }: Props) {
  const toast = useToast();
  const [rows, setRows] = useState<PropertyContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<PropertyContentRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('property_content')
      .select('*')
      .eq('property_id', propertyId)
      .order('sort_order');
    setRows(data || []);
    setLoading(false);
  }, [propertyId]);

  useEffect(() => { load(); }, [load]);

  const propertyKey = propertyName.toLowerCase().replace(/\s+/g, '-')
    .replace('la-villa', 'lavilla')
    .replace('le-loft', 'leloft')
    .replace('le-lodge', 'lelodge');

  const handleSeed = async () => {
    setSeeding(true);
    const { error, count } = await seedPropertyContent(propertyId, propertyKey);
    setSeeding(false);
    if (error) {
      toast.error('Erreur seed: ' + error.message);
    } else {
      toast.success(`${count} sections importées depuis le contenu initial`);
      load();
    }
  };

  const handleSave = async () => {
    if (!editingRow) return;
    setSaving(true);
    const { error } = await savePropertyContent(editingRow);
    setSaving(false);
    if (error) {
      toast.error('Erreur: ' + error.message);
    } else {
      toast.success('Section sauvegardée');
      setEditingRow(null);
      load();
    }
  };

  const S = {
    card: { background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } as React.CSSProperties,
    btn: { padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' } as React.CSSProperties,
    input: { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' as const } as React.CSSProperties,
    fieldLabel: { fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' } as React.CSSProperties,
  };

  return (
    <div style={{ ...S.card, marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>
          Contenu portail — Ma Maison ({rows.length} sections)
        </h3>
        {rows.length === 0 && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            style={{ ...S.btn, background: '#b8860b', color: '#fff', fontWeight: 600 }}
          >
            {seeding ? '...' : 'Importer contenu initial'}
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: '#888', fontSize: '13px' }}>Chargement...</p>
      ) : rows.length === 0 ? (
        <p style={{ color: '#888', fontSize: '13px' }}>
          Aucun contenu portail. Cliquez sur "Importer contenu initial" pour peupler depuis les données existantes.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {rows.map((row) => (
            <div
              key={row.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: '#f8f8f8',
                borderRadius: '8px',
                border: '1px solid #eee',
              }}
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a2e' }}>
                  {SECTION_LABELS[row.section] || row.section}
                </span>
                <span style={{ fontSize: '11px', color: '#888', marginLeft: '8px' }}>
                  {row.content_fr.length > 0 ? `${row.content_fr.length} car. FR` : 'vide'}
                  {' / '}
                  {row.content_en.length > 0 ? `${row.content_en.length} car. EN` : 'vide'}
                </span>
              </div>
              <button
                onClick={() => setEditingRow({ ...row })}
                style={{ ...S.btn, background: '#e8e0d4', color: '#5a4a30', fontWeight: 600 }}
              >
                Modifier
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editingRow && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 2000,
          }}
          onClick={() => setEditingRow(null)}
        >
          <div
            style={{
              background: 'white', borderRadius: '12px', padding: '24px',
              width: '700px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>
              Éditer : {SECTION_LABELS[editingRow.section] || editingRow.section}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={S.fieldLabel}>Titre FR</label>
                <input
                  style={S.input}
                  value={editingRow.title_fr}
                  onChange={e => setEditingRow({ ...editingRow, title_fr: e.target.value })}
                />
              </div>
              <div>
                <label style={S.fieldLabel}>Titre EN</label>
                <input
                  style={S.input}
                  value={editingRow.title_en}
                  onChange={e => setEditingRow({ ...editingRow, title_en: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={S.fieldLabel}>Contenu FR</label>
              <textarea
                style={{ ...S.input, height: '180px', resize: 'vertical', fontFamily: 'inherit' }}
                value={editingRow.content_fr}
                onChange={e => setEditingRow({ ...editingRow, content_fr: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={S.fieldLabel}>Contenu EN</label>
              <textarea
                style={{ ...S.input, height: '180px', resize: 'vertical', fontFamily: 'inherit' }}
                value={editingRow.content_en}
                onChange={e => setEditingRow({ ...editingRow, content_en: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingRow(null)}
                style={{ ...S.btn, background: '#fff', border: '1px solid #ddd' }}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ ...S.btn, background: '#b8860b', color: '#fff', fontWeight: 600 }}
              >
                {saving ? '...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
