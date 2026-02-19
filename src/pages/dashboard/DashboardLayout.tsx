import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = ['jerome@lavillacoliving.com', 'fanny@lavillacoliving.com'];

const TABS = [
  { id: 'loyers', label: 'Suivi Loyers', path: '/dashboard/loyers' },
  { id: 'locataires', label: 'Locataires', path: '/dashboard/locataires' },
  { id: 'depenses', label: 'Dépenses', path: '/dashboard/depenses' },
  { id: 'maintenance', label: 'Maintenance', path: '/dashboard/maintenance' },
  { id: 'prospects', label: 'Prospects', path: '/dashboard/prospects' },
];

export default function DashboardLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  const check = async () => {
    const { data:{user} } = await supabase.auth.getUser();
    setIsAdmin(!!(user && ADMIN_EMAILS.includes(user.email||"")));
    setLoading(false);
  };
  useEffect(() => { check(); }, []);

  const login = async (e:React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    const {error}=await supabase.auth.signInWithPassword({email,password:pw});
    if(error){setErr(error.message);setBusy(false);return;}
    await check(); setBusy(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  if(loading) return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#FAF8F5"}}><p style={{color:"#b8860b",fontSize:"18px"}}>Chargement...</p></div>;

  if(!isAdmin) return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#FAF8F5"}}>
      <form onSubmit={login} style={{background:"#fff",padding:"40px",borderRadius:"16px",boxShadow:"0 4px 24px rgba(0,0,0,0.08)",width:"380px",textAlign:"center"}}>
        <h2 style={{color:"#1a1a2e",marginBottom:"8px"}}>Tableau de Bord</h2>
        <p style={{color:"#888",marginBottom:"24px",fontSize:"14px"}}>Connexion administrateur</p>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required style={{width:"100%",padding:"12px",marginBottom:"12px",border:"1px solid #ddd",borderRadius:"8px",fontSize:"15px",boxSizing:"border-box"}} />
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mot de passe" required style={{width:"100%",padding:"12px",marginBottom:"16px",border:"1px solid #ddd",borderRadius:"8px",fontSize:"15px",boxSizing:"border-box"}} />
        {err && <p style={{color:"#e74c3c",fontSize:"13px",marginBottom:"12px"}}>{err}</p>}
        <button type="submit" disabled={busy} style={{width:"100%",padding:"12px",background:"#b8860b",color:"#fff",border:"none",borderRadius:"8px",fontSize:"15px",fontWeight:600,cursor:"pointer",opacity:busy?0.6:1}}>{busy?"Connexion...":"Se connecter"}</button>
      </form>
    </div>
  );

  const activeTab = TABS.find(t=>loc.pathname.startsWith(t.path))?.id||"loyers";

  return (
    <div style={{background:"#FAF8F5",minHeight:"100vh"}}>
      <header style={{background:"#1a1a2e",color:"#fff",padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={{margin:0,fontSize:"20px",color:"#b8860b"}}>La Villa — Tableau de Bord</h1>
          <p style={{margin:0,fontSize:"12px",opacity:0.7}}>Gestion locative</p>
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button onClick={()=>nav("/")} style={{background:"none",border:"1px solid #555",color:"#aaa",padding:"6px 12px",borderRadius:"6px",cursor:"pointer"}}>Site</button>
          <button onClick={logout} style={{background:"#c0392b",border:"none",color:"#fff",padding:"6px 12px",borderRadius:"6px",cursor:"pointer"}}>Logout</button>
        </div>
      </header>

      <nav style={{display:"flex",gap:"4px",padding:"8px 24px",background:"#1a1a2e",borderBottom:"2px solid #b8860b",overflowX:"auto"}}>
        {TABS.map(tab=>(
          <button key={tab.id} onClick={()=>nav(tab.path)} style={{padding:"10px 16px",border:"none",borderRadius:"8px 8px 0 0",cursor:"pointer",fontSize:"14px",whiteSpace:"nowrap",background:activeTab===tab.id?"#b8860b":"transparent",color:activeTab===tab.id?"#fff":"#aaa",fontWeight:activeTab===tab.id?600:400}}>{tab.label}</button>
        ))}
      </nav>

      <main style={{padding:"24px",maxWidth:"1400px",margin:"0 auto"}}>
        <Outlet />
      </main>
    </div>
  );
}
