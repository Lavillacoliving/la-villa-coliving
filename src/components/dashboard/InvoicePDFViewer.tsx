import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { INVOICE_STORAGE } from '@/lib/entities';

interface Props {
  storagePath?: string | null;
  filePath?: string | null;     // legacy Drive link or file ID (fallback)
  fileName?: string | null;
}

/** Convert a file_path to a clickable Google Drive URL.
 *  file_path might be: a full URL, a Drive file ID, or a path like "folder_id/file_id" */
function toDriveUrl(fp: string): string {
  if (fp.startsWith('http')) return fp;
  // Extract last segment as file ID (handles "folder/fileId" and plain "fileId")
  const parts = fp.split('/').filter(Boolean);
  const fileId = parts[parts.length - 1];
  // Google Drive file IDs are typically 25-60 chars, alphanumeric + dash/underscore
  if (/^[\w-]{20,}$/.test(fileId)) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
  // Fallback: return as-is (won't be a valid link but better than nothing)
  return fp;
}

export default function InvoicePDFViewer({ storagePath, filePath, fileName }: Props) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storagePath) {
      setSignedUrl(null);
      setError(null);
      return;
    }

    let cancelled = false;
    const generate = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: urlErr } = await supabase.storage
          .from(INVOICE_STORAGE.bucket)
          .createSignedUrl(storagePath, 300); // 5 min
        if (cancelled) return;
        if (urlErr) throw urlErr;
        setSignedUrl(data?.signedUrl || null);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Erreur chargement PDF');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    generate();
    return () => { cancelled = true; };
  }, [storagePath]);

  const driveUrl = filePath ? toDriveUrl(filePath) : null;

  // ─── No file at all ───
  if (!storagePath && !filePath) {
    return (
      <div style={S.box}>
        <div style={{ color: '#888', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
          Pas de fichier attaché — uploadez un PDF via l'onglet "Uploader un PDF"
        </div>
      </div>
    );
  }

  // ─── Only Drive link (legacy, won't work in iframe) ───
  if (!storagePath && filePath) {
    return (
      <div style={{ ...S.box, background: '#fffbeb', borderColor: '#fbbf24' }}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#92400e', margin: '0 0 8px' }}>
            📁 Fichier sur Google Drive — pas de preview intégrée.
          </p>
          <a href={driveUrl || '#'} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '8px 20px', background: '#b8860b', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: '6px' }}>
            📄 Ouvrir sur Google Drive
          </a>
          {fileName && <p style={{ fontSize: '11px', color: '#888', margin: '6px 0 0' }}>{fileName}</p>}
        </div>
      </div>
    );
  }

  // ─── Loading ───
  if (loading) {
    return (
      <div style={S.box}>
        <div style={{ padding: '30px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
          Chargement du PDF...
        </div>
      </div>
    );
  }

  // ─── Error ───
  if (error) {
    return (
      <div style={{ ...S.box, background: '#fef2f2', borderColor: '#fecaca' }}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#dc2626', margin: '0 0 8px' }}>{error}</p>
          {driveUrl && (
            <a href={driveUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'underline' }}>
              Fallback : ouvrir sur Drive
            </a>
          )}
        </div>
      </div>
    );
  }

  // ─── Signed URL not ready yet ───
  if (!signedUrl) {
    return (
      <div style={S.box}>
        <div style={{ color: '#888', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
          PDF non disponible en preview
          {driveUrl && (
            <div style={{ marginTop: '8px' }}>
              <a href={driveUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'underline' }}>
                Ouvrir sur Drive
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <iframe
        src={signedUrl}
        title={fileName || 'Facture PDF'}
        style={{ width: '100%', height: '450px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fff' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', padding: '0 4px' }}>
        <span style={{ fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
          {fileName || storagePath?.split('/').pop() || 'facture.pdf'}
        </span>
        <a href={signedUrl} download={fileName || 'facture.pdf'}
          style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          ⬇ Télécharger
        </a>
      </div>
    </div>
  );
}

const S = {
  box: {
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    background: '#f8f9fa',
    overflow: 'hidden',
  } as React.CSSProperties,
};
