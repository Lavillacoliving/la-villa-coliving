import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';

interface StorageItem {
  name: string;
  id: string | null;
  updated_at: string | null;
  metadata: { size?: number } | null;
}

function formatSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function getIcon(name: string, isFolder: boolean) {
  if (isFolder) return '📂';
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = { pdf: '📄', csv: '📊', xlsx: '📈', jpg: '📷', jpeg: '📷', png: '📷', md: '📝', json: '📘', txt: '📝', docx: '📄' };
  return map[ext] || '📄';
}

export default function DashboardDocumentsPage() {
  const [bucket, setBucket] = useState('compta');
  const toast = useToast();
  const [path, setPath] = useState('');
  const [items, setItems] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [folderModal, setFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string|null>(null);

  const load = useCallback(async (p?: string) => {
    const prefix = p !== undefined ? p : path;
    if (p !== undefined) setPath(p);
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 200, sortBy: { column: 'name', order: 'asc' } });
      if (error) { console.error('Storage error:', error); setItems([]); }
      else { setItems((data || []).filter(f => f.name !== '.emptyFolderPlaceholder')); }
    } catch (e) { console.error('loadDocuments error:', e); setItems([]); }
    setLoading(false);
  }, [bucket, path]);

  useEffect(() => { load(''); }, [bucket]);

  const switchBucket = (b: string) => { setBucket(b); setPath(''); setSearch(''); };

  const navigateTo = (folder: string) => {
    const newPath = path ? path + '/' + folder : folder;
    load(newPath);
  };

  const navigateBreadcrumb = (target: string) => { load(target); };

  const downloadFile = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, 300);
      if (error) { console.error(error); return; }
      window.open(data.signedUrl, '_blank');
    } catch (e) { console.error('download error:', e); }
  };

  const deleteFile = async (filePath: string) => {
    // confirm handled by modal
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) { toast.error('Erreur: ' + error.message); return; }
      load();
    } catch (e) { console.error('delete error:', e); }
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0, fail = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fp = path ? path + '/' + file.name : file.name;
      try {
        const { error } = await supabase.storage.from(bucket).upload(fp, file, { upsert: true });
        if (error) { fail++; console.error('Upload error:', fp, error); }
        else { ok++; }
      } catch (e) { fail++; console.error('Upload exception:', e); }
    }
    setUploading(false);
    toast.success(ok + ' fichier(s) ajouté(s)' + (fail > 0 ? ', ' + fail + ' erreur(s)' : ''));
    load();
  };


  const createFolder = async () => {
    if (!folderName.trim()) return;
    const n = folderName.trim();
    setFolderModal(false); setFolderName('');
    const folderPath = path ? path + '/' + n + '/.emptyFolderPlaceholder' : n + '/.emptyFolderPlaceholder';
    const { error } = await supabase.storage.from(bucket).upload(folderPath, new Blob(['']));
    if (error) { toast.error('Erreur: ' + error.message); return; }
    toast.success('Dossier "' + n + '" créé');
    load();
  };

  const filtered = search
    ? items.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  const folders = filtered.filter(f => f.id === null);
  const files = filtered.filter(f => f.id !== null);
  const breadcrumbParts = path ? path.split('/').filter(Boolean) : [];

  const S = {
    card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    btn: { padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a2e' }}>Documents</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {['compta', 'operations'].map(b => (
            <button key={b} onClick={() => switchBucket(b)} style={{ ...S.btn, background: bucket === b ? '#3D4A38' : '#e5e7eb', color: bucket === b ? '#fff' : '#555', fontWeight: bucket === b ? 600 : 400, textTransform: 'capitalize' }}>{b}</button>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px', fontSize: '14px', flexWrap: 'wrap' }}>
        <span onClick={() => navigateBreadcrumb('')} style={{ cursor: 'pointer', color: '#3D4A38', fontWeight: 600 }}>{bucket}</span>
        {breadcrumbParts.map((part, i) => {
          const target = breadcrumbParts.slice(0, i + 1).join('/');
          const isLast = i === breadcrumbParts.length - 1;
          return (
            <span key={i}>
              <span style={{ color: '#94a3b8', margin: '0 2px' }}>/</span>
              {isLast ? <span style={{ fontWeight: 600 }}>{part}</span> : <span onClick={() => navigateBreadcrumb(target)} style={{ cursor: 'pointer', color: '#3D4A38' }}>{part}</span>}
            </span>
          );
        })}
      </div>

      {/* Search + Upload */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un fichier..." style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', minWidth: '250px' }} />
        <button onClick={() => { setFolderName(''); setFolderModal(true); }} style={{ padding: '8px 16px', background: '#3D4A38', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, border: 'none' }}>+ Dossier</button>
        <label style={{ padding: '8px 16px', background: '#b8860b', color: '#fff', borderRadius: '8px', cursor: uploading ? 'wait' : 'pointer', fontSize: '13px', fontWeight: 600 }}>
          {uploading ? 'Upload...' : '📤 Ajouter des fichiers'}
          <input type="file" multiple style={{ display: 'none' }} onChange={e => uploadFiles(e.target.files)} disabled={uploading} />
        </label>
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#b8860b' }}>Chargement...</p>
      ) : filtered.length === 0 ? (
        <div style={{ ...S.card, textAlign: 'center', padding: '60px', color: '#888' }}>
          <p style={{ fontSize: '32px', marginBottom: '8px' }}>📂</p>
          <p>Aucun fichier dans ce dossier</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '12px' }}>
          {folders.map(f => (
            <div key={f.name} onClick={() => navigateTo(f.name)} style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid #3D4A38', transition: 'transform 0.15s' }}>
              <span style={{ fontSize: '24px' }}>📂</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{f.name}</div>
                <div style={{ color: '#888', fontSize: '12px' }}>Dossier</div>
              </div>
            </div>
          ))}
          {files.map(f => {
            const fp = path ? path + '/' + f.name : f.name;
            const sz = formatSize(f.metadata?.size);
            const dt = f.updated_at ? new Date(f.updated_at).toLocaleDateString('fr-FR') : '';
            return (
              <div key={f.name} style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid #94a3b8' }}>
                <span style={{ fontSize: '24px' }}>{getIcon(f.name, false)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>{sz}{dt ? ' — ' + dt : ''}</div>
                </div>
                <button onClick={() => downloadFile(fp)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px' }} title="Télécharger">⬇️</button>
                <button onClick={() => setDeleteTarget(fp)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px', color: '#ef4444' }} title="Supprimer">🗑️</button>
              </div>
            );
          })}
        </div>
      )}
      {/* Folder creation modal */}
{folderModal && (
<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setFolderModal(false)}>
<div style={{background:"#fff",borderRadius:"12px",padding:"24px",width:"380px",maxWidth:"90vw"}} onClick={e=>e.stopPropagation()}>
<h3 style={{margin:"0 0 16px",fontSize:"16px"}}>Nouveau dossier</h3>
<input autoFocus value={folderName} onChange={e=>setFolderName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")createFolder()}} placeholder="Nom du dossier" style={{width:"100%",padding:"10px 12px",border:"1px solid #ddd",borderRadius:"8px",fontSize:"14px",boxSizing:"border-box"}} />
<div style={{display:"flex",gap:"8px",justifyContent:"flex-end",marginTop:"16px"}}>
<button onClick={()=>setFolderModal(false)} style={{padding:"8px 16px",border:"1px solid #ddd",borderRadius:"8px",cursor:"pointer",background:"#fff",fontSize:"13px"}}>Annuler</button>
<button onClick={createFolder} style={{padding:"8px 16px",border:"none",borderRadius:"8px",cursor:"pointer",background:"#3D4A38",color:"#fff",fontSize:"13px",fontWeight:600}}>Créer</button>
</div></div></div>)}
{/* Delete confirmation modal */}
{deleteTarget && (
<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setDeleteTarget(null)}>
<div style={{background:"#fff",borderRadius:"12px",padding:"24px",width:"380px",maxWidth:"90vw"}} onClick={e=>e.stopPropagation()}>
<h3 style={{margin:"0 0 8px",fontSize:"16px"}}>Confirmer la suppression</h3>
<p style={{color:"#555",fontSize:"14px",margin:"0 0 20px"}}>Supprimer <strong>{deleteTarget.split("/").pop()}</strong> ?</p>
<div style={{display:"flex",gap:"8px",justifyContent:"flex-end"}}>
<button onClick={()=>setDeleteTarget(null)} style={{padding:"8px 16px",border:"1px solid #ddd",borderRadius:"8px",cursor:"pointer",background:"#fff",fontSize:"13px"}}>Annuler</button>
<button onClick={()=>{const t=deleteTarget;setDeleteTarget(null);deleteFile(t);}} style={{padding:"8px 16px",border:"none",borderRadius:"8px",cursor:"pointer",background:"#ef4444",color:"#fff",fontSize:"13px",fontWeight:600}}>Supprimer</button>
</div></div></div>)}

    </div>
  );
}
