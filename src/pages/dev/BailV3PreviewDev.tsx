/**
 * Page de développement (jamais servie en production : route montée seulement si import.meta.env.DEV) :
 * rend l'aperçu HTML du bail v3 sur les cas de maquette, sous la feuille de style globale du site, pour vérifier
 * visuellement l'aperçu sans compte admin. http://localhost:5175/dev/bail-v3?cas=LeLodge_1_SCI
 */
import { useEffect, useState } from 'react';
import { buildLeaseV3, type LeaseDoc, type LeaseV3Input } from '@/lib/bailV3/clauses';
import { LeaseDocHtml } from '@/lib/bailV3/renderHtml';
import { NOTICE_INFORMATION_2023, NOTICE_SOURCE, NOTICE_TITLE } from '@/data/noticeInformation2023';

export default function BailV3PreviewDev() {
  const [doc, setDoc] = useState<LeaseDoc | null>(null);
  const [keys, setKeys] = useState<string[]>([]);
  const cas = new URLSearchParams(window.location.search).get('cas') || 'LaVilla_2_indivision';
  const withNotice = new URLSearchParams(window.location.search).get('notice') === '1';
  useEffect(() => {
    import('../../../tools/bail-v3/cases').then((m) => {
      const cases = m.CASES as Record<string, LeaseV3Input>;
      setKeys(Object.keys(cases));
      setDoc(buildLeaseV3(cases[cas] || cases[Object.keys(cases)[0]]));
    });
  }, [cas]);
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: 30 }}>
      <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 13 }}>
        {keys.map((k) => <a key={k} href={`?cas=${k}${withNotice ? '&notice=1' : ''}`} style={{ margin: '0 8px', fontWeight: k === cas ? 700 : 400 }}>{k}</a>)}
      </div>
      {doc ? <div style={{ boxShadow: '0 0 20px rgba(0,0,0,0.15)' }}><LeaseDocHtml doc={doc} logoSrc="/logos/logo-full.png" notice={withNotice ? { title: NOTICE_TITLE, source: NOTICE_SOURCE, sections: NOTICE_INFORMATION_2023 } : null} /></div> : <p>Chargement…</p>}
    </div>
  );
}
