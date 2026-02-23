import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';

interface Payment {
  id: string; tenant_id: string; month: string;
  expected_amount: number; received_amount: number;
  adjusted_amount: number | null; payment_date: string | null;
  status: string; notes: string | null;
}
interface Tenant {
  id: string; first_name: string; last_name: string;
  room_number: number; current_rent: number;
  property_id: string; is_active: boolean; phone?: string;
  move_in_date: string | null; date_of_birth: string | null;
  properties?: { name: string } | null;
}
interface Property { id: string; name: string; slug: string; entity_id: string; }
interface IRLEntry { value: number; variation: number; }

const STATUS_COLORS: Record<string,string> = {
  paid:'#22c55e', partial:'#eab308', pending:'#94a3b8', late:'#ef4444', unpaid:'#dc2626'
};
const STATUS_LABELS: Record<string,string> = {
  paid:'Payé', partial:'Partiel', pending:'En attente', late:'En retard', unpaid:'Non payé'
};
const STATUS_ORDER = ['pending','paid','partial','late','unpaid'];
const ENTITY_MAP: Record<string,string> = {
  'la-villa':'La Villa (LMP)', 'le-loft':'Le Loft — Sleep In SCI', 'le-lodge':'Le Lodge — Sleep In SCI'
};

// Entity grouping: which slugs belong to which entity filter
const ENTITY_SLUGS: Record<string, string[]> = {
  'la-villa': ['la-villa'],
  'sleep-in': ['le-loft', 'le-lodge'],
  'mont-blanc': ['mont-blanc'],
};

function fmt(n: number) { return n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }


export default function DashboardLoyersPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const toast = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [irlData, setIrlData] = useState<Record<string,IRLEntry>>({});
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0,7));
  const [entityFilter, setEntityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notesModal, setNotesModal] = useState<{id:string,notes:string}|null>(null);
  const [notesSaving, setNotesSaving] = useState(false);
  // Inline editing
  const [editingPayment, setEditingPayment] = useState<string|null>(null);
  const [editData, setEditData] = useState<{received_amount:number,adjusted_amount:number|null,status:string,payment_date:string|null}>({received_amount:0,adjusted_amount:null,status:'pending',payment_date:null});
  const [editSaving, setEditSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [pRes,tRes,prRes,irlRes] = await Promise.all([
      supabase.from('payments').select('*').eq('month',month),
      supabase.from('tenants').select('*,properties(name)').eq('is_active',true),
      supabase.from('properties').select('id,name,slug,entity_id'),
      supabase.from('irl_indices').select('year,quarter,value,variation_pct').order('year').order('quarter'),
    ]);
    setPayments(pRes.data||[]);
    setTenants(tRes.data||[]);
    setProperties(prRes.data||[]);
    const irl: Record<string,IRLEntry> = {};
    (irlRes.data||[]).forEach((d:any) => { irl[d.year+'-Q'+d.quarter] = {value:parseFloat(d.value),variation:parseFloat(d.variation_pct)}; });
    setIrlData(irl);
    setLoading(false);
  },[month]);

  useEffect(() => { load(); },[load]);

  // Entity-based filtering (Sleep In = Le Loft + Le Lodge)
  const filtered = payments.filter(p => {
    const t = tenants.find(x => x.id === p.tenant_id);
    if (!t) return false;
    if (entityFilter !== 'all') {
      const prop = properties.find(pr => pr.id === t.property_id);
      const allowedSlugs = ENTITY_SLUGS[entityFilter];
      if (allowedSlugs) {
        if (!prop || !allowedSlugs.includes(prop.slug)) return false;
      } else {
        if (prop?.slug !== entityFilter) return false;
      }
    }
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search) {
      const name = (t.first_name+' '+t.last_name).toLowerCase();
      if (!name.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  // KPIs
  const totalExpected = filtered.reduce((s,p) => s+p.expected_amount,0);
  const getEffective = (p:Payment) => p.adjusted_amount !== null ? p.adjusted_amount : p.received_amount;
  const paidAmount = filtered.filter(p=>p.status==='paid').reduce((s,p)=>s+getEffective(p),0);
  const partialAmount = filtered.filter(p=>p.status==='partial').reduce((s,p)=>s+getEffective(p),0);
  const paidCount = filtered.filter(p=>p.status==='paid').length;
  const lateCount = filtered.filter(p=>p.status==='late'||p.status==='unpaid').length;
  const lateAmount = filtered.filter(p=>p.status==='late'||p.status==='unpaid').reduce((s,p)=>s+p.expected_amount,0);
  const rate = totalExpected>0 ? Math.round(((paidAmount+partialAmount)/totalExpected)*100) : 0;

  // Group by property
  const grouped: Record<string,{prop:Property,payments:Payment[]}> = {};
  filtered.forEach(p => {
    const t = tenants.find(x=>x.id===p.tenant_id);
    if (!t) return;
    const prop = properties.find(pr=>pr.id===t.property_id);
    if (!prop) return;
    if (!grouped[prop.id]) grouped[prop.id] = {prop,payments:[]};
    grouped[prop.id].payments.push(p);
  });
  const sortedGroups = Object.values(grouped).sort((a,b) => a.prop.name.localeCompare(b.prop.name));

  // IRL reminders
  const irlReminders: {name:string;room:number;property:string;daysUntil:number;date:Date;currentRent:number;newRent:number;pct:string;tenantId:string}[] = [];
  const irlKeys = Object.keys(irlData).sort().reverse();
  if (irlKeys.length > 0) {
    const latestKey = irlKeys[0];
    const latest = irlData[latestKey];
    const [lY,lQ] = latestKey.split('-Q').map(Number);
    const prevKey = (lY-1)+'-Q'+lQ;
    const prev = irlData[prevKey];
    if (latest && prev) {
      const factor = latest.value / prev.value;
      const pct = ((factor-1)*100).toFixed(2);
      const today = new Date();
      tenants.filter(t=>t.is_active && t.move_in_date).forEach(t => {
        const moveIn = new Date(t.move_in_date!);
        let next = new Date(today.getFullYear(),moveIn.getMonth(),moveIn.getDate());
        if (next < today) next.setFullYear(next.getFullYear()+1);
        const days = Math.ceil((next.getTime()-today.getTime())/(1000*60*60*24));
        if (days <= 61 && days >= 0) {
          const newRent = Math.round(t.current_rent * factor * 100)/100;
          if (newRent > t.current_rent) {
            const prop = properties.find(p=>p.id===t.property_id);
            irlReminders.push({name:t.first_name+' '+t.last_name,room:t.room_number,property:prop?.name||'',daysUntil:days,date:next,currentRent:t.current_rent,newRent,pct,tenantId:t.id});
          }
        }
      });
    }
  }

  // Birthday reminders
  const birthdayReminders: {name:string;room:number;property:string;daysUntil:number;date:Date;age:number}[] = [];
  const today = new Date();
  tenants.filter(t=>t.is_active && t.date_of_birth).forEach(t => {
    const dob = new Date(t.date_of_birth!);
    let next = new Date(today.getFullYear(),dob.getMonth(),dob.getDate());
    if (next < today) next.setFullYear(next.getFullYear()+1);
    const days = Math.ceil((next.getTime()-today.getTime())/(1000*60*60*24));
    if (days <= 30 && days >= 0) {
      const prop = properties.find(p=>p.id===t.property_id);
      birthdayReminders.push({name:t.first_name+' '+t.last_name,room:t.room_number,property:prop?.name||'',daysUntil:days,date:next,age:next.getFullYear()-dob.getFullYear()});
    }
  });
  birthdayReminders.sort((a,b)=>a.daysUntil-b.daysUntil);

  const applyIRL = async (tenantId:string,newRent:number) => {
    if (!confirm('Appliquer le nouveau loyer de '+fmt(newRent)+' ?')) return;
    const {error} = await supabase.from('tenants').update({current_rent:newRent}).eq('id',tenantId);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    load();
  };

  const saveNotes = async () => {
    if (!notesModal) return;
    setNotesSaving(true);
    await supabase.from('payments').update({notes:notesModal.notes}).eq('id',notesModal.id);
    setNotesSaving(false);
    setNotesModal(null);
    load();
  };

  // Inline edit: start editing a payment row
  const startEdit = (p: Payment) => {
    setEditingPayment(p.id);
    setEditData({
      received_amount: p.received_amount,
      adjusted_amount: p.adjusted_amount,
      status: p.status,
      payment_date: p.payment_date,
    });
  };

  const cancelEdit = () => {
    setEditingPayment(null);
  };

  const saveEdit = async () => {
    if (!editingPayment) return;
    setEditSaving(true);
    const update: any = {
      received_amount: editData.received_amount,
      adjusted_amount: editData.adjusted_amount,
      status: editData.status,
      payment_date: editData.payment_date || null,
    };
    const { error } = await supabase.from('payments').update(update).eq('id', editingPayment);
    setEditSaving(false);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    setEditingPayment(null);
    load();
  };

  // Quick status change (click on badge)
  const cycleStatus = async (paymentId: string, currentStatus: string) => {
    const idx = STATUS_ORDER.indexOf(currentStatus);
    const nextStatus = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    const { error } = await supabase.from('payments').update({ status: nextStatus }).eq('id', paymentId);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    load();
  };

  const prevMonth = () => { const d=new Date(month+'-01'); d.setMonth(d.getMonth()-1); setMonth(d.toISOString().slice(0,7)); };
  const nextMonth = () => { const d=new Date(month+'-01'); d.setMonth(d.getMonth()+1); setMonth(d.toISOString().slice(0,7)); };
  const exportExcel = () => {
    const XLSX=(window as any).XLSX; if(!XLSX){toast.error('SheetJS non chargé');return;}
    const rows=filtered.map(p=>{const t=tenants.find(x=>x.id===p.tenant_id);const pr=properties.find(x=>x.id===t?.property_id);
    return{Mois:p.month,Propriété:pr?.name||'',Locataire:t?t.first_name+' '+t.last_name:'',Chambre:t?.room_number||'',Attendu:p.expected_amount,Reçu:p.received_amount,Ajusté:p.adjusted_amount,Statut:p.status,Date:p.payment_date||'',Notes:p.notes||''};});
    const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Loyers');XLSX.writeFile(wb,'loyers_'+month+'.xlsx');
  };

  const S = {
    card:{background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'},
    label:{fontSize:'12px',color:'#888',marginBottom:'4px',textTransform:'uppercase' as const,letterSpacing:'0.05em'},
    val:{fontSize:'28px',fontWeight:800 as const,color:'#1a1a2e',lineHeight:1.2},
    sub:{fontSize:'12px',color:'#999',marginTop:'4px'},
    alert:{background:'linear-gradient(135deg,#fff5f5,#ffe8e8)',border:'2px solid #fecaca',borderRadius:'12px',padding:'16px 20px',marginBottom:'20px'},
    irlBox:{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',border:'2px solid #86efac',borderRadius:'12px',padding:'16px 20px',marginBottom:'20px'},
    bdayBox:{background:'linear-gradient(135deg,#fefce8,#fef9c3)',border:'2px solid #fde047',borderRadius:'12px',padding:'16px 20px',marginBottom:'20px'},
    btn:{padding:'6px 14px',border:'none',borderRadius:'20px',cursor:'pointer',fontSize:'13px',transition:'all 0.2s'},
    inlineInput:{padding:'4px 8px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'13px',width:'100px',boxSizing:'border-box' as const},
  };

  if (loading) return <p style={{textAlign:'center',padding:'40px',color:'#b8860b'}}>Chargement...</p>;

  return (
    <div>
      {/* Header: month nav + filters */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <button onClick={prevMonth} style={{border:'1px solid #ddd',background:'#fff',borderRadius:'6px',padding:'6px 12px',cursor:'pointer',fontSize:'16px'}}>←</button>
          <h2 style={{margin:0,fontSize:'20px',color:'#1a1a2e'}}>{new Date(month+'-01').toLocaleDateString('fr-FR',{month:'long',year:'numeric'}).replace(/^\w/,c=>c.toUpperCase())}</h2>
          <button onClick={nextMonth} style={{border:'1px solid #ddd',background:'#fff',borderRadius:'6px',padding:'6px 12px',cursor:'pointer',fontSize:'16px'}}>→</button>
        </div>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
          {[{v:'all',l:'Toutes'},{v:'la-villa',l:'La Villa (LMP)'},{v:'sleep-in',l:'Sleep In (SCI)'},{v:'mont-blanc',l:'Mont-Blanc'}].map(e=>(
            <button key={e.v} onClick={()=>setEntityFilter(e.v)} style={{...S.btn,background:entityFilter===e.v?'#3D4A38':'#e5e7eb',color:entityFilter===e.v?'#fff':'#555',fontWeight:entityFilter===e.v?600:400}}>{e.l}</button>
          ))}
          <button onClick={exportExcel} style={{padding:'6px 14px',background:'#b8860b',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>Export Excel</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'24px'}}>
        <div style={S.card}><p style={S.label}>Loyers encaissés</p><p style={S.val}>{paidCount}/{filtered.length}</p><p style={S.sub}>{fmt(paidAmount)}</p></div>
        <div style={S.card}><p style={S.label}>En retard</p><p style={{...S.val,color:lateCount>0?'#ef4444':'#22c55e'}}>{lateCount}</p><p style={S.sub}>{fmt(lateAmount)}</p></div>
        <div style={S.card}><p style={S.label}>Non payé</p><p style={{...S.val,color:filtered.filter(p=>p.status==='unpaid').length>0?'#dc2626':'#22c55e'}}>{filtered.filter(p=>p.status==='unpaid').length}</p><p style={S.sub}>{fmt(filtered.filter(p=>p.status==='unpaid').reduce((s,p)=>s+p.expected_amount,0))}</p></div>
        <div style={S.card}><p style={S.label}>Taux d'encaissement</p><p style={S.val}>{rate}%</p><p style={S.sub}>du mois</p></div>
      </div>

      {/* Alert banner */}
      {lateCount > 0 && today.getDate() >= 5 && (
        <div style={S.alert}>
          <strong>⚠️ Loyers impayés ou en retard</strong>
          <p style={{margin:'4px 0 0',fontSize:'14px',color:'#666'}}>Des loyers ne sont pas encore encaissés. Veuillez relancer les locataires en retard.</p>
        </div>
      )}

      {/* IRL Reminders */}
      {irlReminders.length > 0 && (
        <div style={S.irlBox}>
          <strong>📈 Augmentations IRL à prévoir</strong>
          {irlReminders.map((r,i) => (
            <div key={i} style={{marginTop:'8px',padding:'10px',background:'white',borderRadius:'8px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
              <div>
                <strong>{r.name}</strong> (Ch. {r.room}{r.property?' — '+r.property:''})
                <br/><span style={{fontSize:'13px',opacity:0.7}}>Anniversaire dans {r.daysUntil}j — le {r.date.toLocaleDateString('fr-FR')}</span>
              </div>
              <div style={{textAlign:'right'}}>
                <span style={{fontSize:'13px'}}>{fmt(r.currentRent)} → <strong style={{color:'#5A6B52'}}>{fmt(r.newRent)}</strong></span>
                <br/><span style={{fontSize:'12px',opacity:0.6}}>+{r.pct}%</span>
              </div>
              <button onClick={()=>applyIRL(r.tenantId,r.newRent)} style={{padding:'6px 16px',background:'#7C9A6D',color:'white',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>Appliquer</button>
            </div>
          ))}
        </div>
      )}

      {/* Birthday Reminders */}
      {birthdayReminders.length > 0 && (
        <div style={S.bdayBox}>
          <strong>🎂 Anniversaires à venir</strong>
          {birthdayReminders.map((r,i) => (
            <div key={i} style={{marginTop:'4px',fontSize:'14px'}}>
              {r.daysUntil===0?'🎉 ':'🎂 '}<strong>{r.name}</strong> (Ch. {r.room}{r.property?' — '+r.property:''}) — {r.daysUntil===0?<strong style={{color:'#7C9A6D'}}>Aujourd'hui !</strong>:`dans ${r.daysUntil}j (${r.date.toLocaleDateString('fr-FR')})`} — {r.age} ans
            </div>
          ))}
        </div>
      )}

      {/* Suivi des loyers */}
      <h3 style={{margin:'0 0 12px',fontSize:'18px',color:'#1a1a2e'}}>Suivi des loyers</h3>
      <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap',alignItems:'center'}}>
        {[{v:'all',l:'Tous'},{v:'paid',l:'Payés'},{v:'late',l:'En retard'},{v:'unpaid',l:'Non payés'}].map(f=>(
          <button key={f.v} onClick={()=>setStatusFilter(f.v)} style={{...S.btn,background:statusFilter===f.v?'#5A6B52':'#fff',color:statusFilter===f.v?'#fff':'#555',border:statusFilter===f.v?'none':'1px solid #ddd'}}>{f.l}</button>
        ))}
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Chercher un locataire..." style={{padding:'8px 14px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',minWidth:'200px'}}/>
      </div>

      {/* Payments table grouped by property */}
      <div style={{...S.card,padding:0,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
          <thead>
            <tr style={{background:'#f8f8f8',borderBottom:'2px solid #e5e7eb'}}>
              {['Chambre','Locataire','Loyer attendu','Statut','Date paiement','Montant reçu','Ajusté','Notes',''].map(h=>(
                <th key={h} style={{padding:'12px 16px',textAlign:'left',fontWeight:600,color:'#555',fontSize:'12px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedGroups.map(g => (
              <>
                <tr key={'h-'+g.prop.id}><td colSpan={9} style={{padding:'12px 16px',fontWeight:700,fontSize:'14px',background:'#fafaf8',borderBottom:'1px solid #e5e7eb'}}>🏠 {g.prop.name}{ENTITY_MAP[g.prop.slug]?' — '+ENTITY_MAP[g.prop.slug].split('—')[1]?.trim():''}</td></tr>
                {g.payments.sort((a,b)=>{const ta=tenants.find(x=>x.id===a.tenant_id);const tb=tenants.find(x=>x.id===b.tenant_id);return (ta?.room_number||0)-(tb?.room_number||0);}).map(p => {
                  const t = tenants.find(x=>x.id===p.tenant_id);
                  const isEditing = editingPayment === p.id;

                  if (isEditing) {
                    return (
                      <tr key={p.id} style={{borderBottom:'1px solid #f0f0f0',background:'#fffbeb'}}>
                        <td style={{padding:'10px 16px',fontWeight:600}}>Ch. {t?.room_number}</td>
                        <td style={{padding:'10px 16px'}}>{t?t.first_name+' '+t.last_name:'?'}</td>
                        <td style={{padding:'10px 16px'}}>{fmt(p.expected_amount)}</td>
                        <td style={{padding:'10px 16px'}}>
                          <select value={editData.status} onChange={e=>setEditData({...editData,status:e.target.value})} style={{...S.inlineInput,width:'120px'}}>
                            {STATUS_ORDER.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                          </select>
                        </td>
                        <td style={{padding:'10px 16px'}}>
                          <input type="date" value={editData.payment_date||''} onChange={e=>setEditData({...editData,payment_date:e.target.value||null})} style={S.inlineInput}/>
                        </td>
                        <td style={{padding:'10px 16px'}}>
                          <input type="number" step="0.01" value={editData.received_amount} onChange={e=>setEditData({...editData,received_amount:parseFloat(e.target.value)||0})} style={S.inlineInput}/>
                        </td>
                        <td style={{padding:'10px 16px'}}>
                          <input type="number" step="0.01" value={editData.adjusted_amount??''} onChange={e=>setEditData({...editData,adjusted_amount:e.target.value?parseFloat(e.target.value):null})} style={S.inlineInput} placeholder="—"/>
                        </td>
                        <td style={{padding:'10px 16px'}}>
                          <button onClick={()=>setNotesModal({id:p.id,notes:p.notes||''})} style={{background:'none',border:'none',cursor:'pointer',fontSize:'16px'}} title="Notes">📝</button>
                        </td>
                        <td style={{padding:'10px 16px',whiteSpace:'nowrap'}}>
                          <button onClick={saveEdit} disabled={editSaving} style={{padding:'4px 10px',background:'#22c55e',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontSize:'12px',marginRight:'4px'}}>{editSaving?'...':'✓'}</button>
                          <button onClick={cancelEdit} style={{padding:'4px 10px',background:'#ef4444',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontSize:'12px'}}>✕</button>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={p.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                      <td style={{padding:'10px 16px',fontWeight:600}}>Ch. {t?.room_number}</td>
                      <td style={{padding:'10px 16px'}}>{t?t.first_name+' '+t.last_name:'?'} {t?.phone && <a href={'tel:'+t.phone} style={{color:'#b8860b',textDecoration:'none'}} title="Appeler">📞</a>}</td>
                      <td style={{padding:'10px 16px'}}>{fmt(p.expected_amount)}</td>
                      <td style={{padding:'10px 16px'}}>
                        <span
                          onClick={()=>cycleStatus(p.id, p.status)}
                          style={{background:(STATUS_COLORS[p.status]||'#94a3b8')+'20',color:STATUS_COLORS[p.status]||'#94a3b8',padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:600,border:`1px solid ${STATUS_COLORS[p.status]||'#94a3b8'}40`,cursor:'pointer',userSelect:'none'}}
                          title="Cliquer pour changer le statut"
                        >
                          {p.status==='paid'?'✓ ':p.status==='partial'?'⚡ ':p.status==='late'?'⚠ ':''}{STATUS_LABELS[p.status]||p.status}
                        </span>
                      </td>
                      <td style={{padding:'10px 16px',color:'#888'}}>{p.payment_date?new Date(p.payment_date).toLocaleDateString('fr-FR'):'—'}</td>
                      <td style={{padding:'10px 16px'}}>{p.received_amount>0?fmt(p.received_amount):'—'}</td>
                      <td style={{padding:'10px 16px',color:'#888'}}>{p.adjusted_amount!==null?fmt(p.adjusted_amount):'—'}</td>
                      <td style={{padding:'10px 16px'}}>
                        <button onClick={()=>setNotesModal({id:p.id,notes:p.notes||''})} style={{background:'none',border:'none',cursor:'pointer',fontSize:'16px'}} title="Notes">📝</button>
                      </td>
                      <td style={{padding:'10px 16px'}}>
                        <button onClick={()=>startEdit(p)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'14px',color:'#b8860b'}} title="Modifier">✎</button>
                      </td>
                    </tr>
                  );
                })}
              </>
            ))}
            {sortedGroups.length===0 && <tr><td colSpan={9} style={{padding:'40px',textAlign:'center',color:'#888'}}>Aucun paiement pour ce mois</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Notes modal */}
      {notesModal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setNotesModal(null)}>
          <div style={{background:'white',borderRadius:'12px',padding:'24px',width:'400px',maxWidth:'90vw'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{margin:'0 0 12px'}}>Notes</h3>
            <textarea value={notesModal.notes} onChange={e=>setNotesModal({...notesModal,notes:e.target.value})} style={{width:'100%',height:'120px',border:'1px solid #ddd',borderRadius:'8px',padding:'10px',fontSize:'14px',resize:'vertical'}}/>
            <div style={{display:'flex',gap:'8px',marginTop:'12px',justifyContent:'flex-end'}}>
              <button onClick={()=>setNotesModal(null)} style={{padding:'8px 16px',border:'1px solid #ddd',background:'#fff',borderRadius:'6px',cursor:'pointer'}}>Annuler</button>
              <button onClick={saveNotes} disabled={notesSaving} style={{padding:'8px 16px',background:'#b8860b',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}}>{notesSaving?'...':'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
