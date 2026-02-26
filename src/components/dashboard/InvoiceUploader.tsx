import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { INVOICE_STORAGE } from '@/lib/entities';

interface Props {
  entityId: string;
  onUploadSuccess: (storagePath: string, fileName: string) => void;
  onError?: (msg: string) => void;
}

export default function InvoiceUploader({ entityId, onUploadSuccess, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<{ name: string; path: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const entityCode = INVOICE_STORAGE.entityCodes[entityId];

  const handleFiles = async (files: FileList | File[]) => {
    setError(null);
    const file = Array.from(files)[0];
    if (!file) return;

    // Validate type
    if (!INVOICE_STORAGE.allowedMimes.includes(file.type)) {
      const msg = 'Seuls les fichiers PDF sont acceptés.';
      setError(msg);
      onError?.(msg);
      return;
    }

    // Validate size
    if (file.size / (1024 * 1024) > INVOICE_STORAGE.maxFileSizeMB) {
      const msg = `Fichier trop volumineux (max ${INVOICE_STORAGE.maxFileSizeMB} MB).`;
      setError(msg);
      onError?.(msg);
      return;
    }

    setUploading(true);
    try {
      const storagePath = INVOICE_STORAGE.buildPath(entityId, file.name);
      const { error: uploadErr } = await supabase.storage
        .from(INVOICE_STORAGE.bucket)
        .upload(storagePath, file, { upsert: false });

      if (uploadErr) throw uploadErr;

      setUploaded({ name: file.name, path: storagePath });
      onUploadSuccess(storagePath, file.name);
    } catch (err: any) {
      const msg = `Erreur upload : ${err?.message || 'inconnue'}`;
      setError(msg);
      onError?.(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  // ─── Already uploaded ───
  if (uploaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
        <span style={{ fontSize: '16px' }}>✅</span>
        <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {uploaded.name}
        </span>
        <button
          onClick={() => { setUploaded(null); setError(null); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '16px' }}
          title="Changer de fichier"
        >×</button>
      </div>
    );
  }

  if (!entityCode) {
    return (
      <div style={{ padding: '10px', background: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '8px', fontSize: '13px', color: '#92400e' }}>
        Entité non reconnue — upload impossible.
      </div>
    );
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#b8860b' : '#d1d5db'}`,
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          cursor: uploading ? 'wait' : 'pointer',
          background: dragOver ? '#fffbeb' : '#fafafa',
          transition: 'all 0.15s',
        }}
      >
        {uploading ? (
          <p style={{ margin: 0, fontSize: '13px', color: '#b8860b' }}>Upload en cours...</p>
        ) : (
          <>
            <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#555', fontWeight: 600 }}>
              Déposez un PDF ici
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
              ou cliquez pour sélectionner (max {INVOICE_STORAGE.maxFileSizeMB} MB)
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', color: '#dc2626' }}>
          {error}
        </div>
      )}
    </div>
  );
}
