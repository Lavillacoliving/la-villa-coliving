/**
 * Rappel du tableau de bord (lot 2 du bail v3, 10/11/2026) : à partir du 1er février, signale les maisons dont les
 * charges de l'exercice précédent ne sont pas saisies et validées (D10 : saisie en février, appliquée aux baux signés
 * dès mars). Règle dans housesMissingCharges (src/lib/bailV3/charges.ts) ; aucun workflow n8n, aucun courriel.
 */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { expectedChargesYear, housesMissingCharges, localTodayIso, type ChargesExerciseFacts } from '@/lib/bailV3/charges';

/** Événement émis par l'onglet Maisons après une écriture : le bandeau se met à jour sans recharger la page. */
export const CHARGES_CHANGED_EVENT = 'lvc-charges-changed';

export function ChargesReminderView({ houses, year, onOpen }: { houses: Array<{ id: string; name: string }>; year: number; onOpen?: () => void }) {
  if (!houses.length) return null;
  return (
    <div role="status" data-testid="charges-reminder" style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', lineHeight: 1.6, color: '#9a3412', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ flex: 1, minWidth: '220px' }}>
        <strong>Charges {year} à saisir et à valider</strong> pour {houses.map((h) => h.name).join(', ')}. Tant que ce n'est pas fait, les nouveaux baux gardent le forfait précédent.
      </span>
      {onOpen && <button onClick={onOpen} style={{ padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', background: '#9a3412', color: '#fff', fontWeight: 600 }}>Ouvrir l'onglet Maisons</button>}
    </div>
  );
}

export default function ChargesReminderBanner() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [missing, setMissing] = useState<Array<{ id: string; name: string }>>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener(CHARGES_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(CHARGES_CHANGED_EVENT, refresh);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      supabase.from('properties').select('id, name').eq('is_coliving', true).order('name'),
      supabase.from('property_charges').select('id, property_id, fiscal_year, method, status, effective_from'),
    ]).then(([houses, charges]) => {
      // Lecture réservée à l'administrateur : en cas d'erreur, pas de bandeau plutôt qu'une fausse alerte.
      if (cancelled || houses.error || charges.error) return;
      setMissing(housesMissingCharges((charges.data || []) as ChargesExerciseFacts[], (houses.data || []) as Array<{ id: string; name: string }>, localTodayIso()));
    });
    return () => { cancelled = true; };
  }, [pathname, tick]);

  return <ChargesReminderView houses={missing} year={expectedChargesYear(localTodayIso())} onOpen={pathname.startsWith('/dashboard/maisons') ? undefined : () => nav('/dashboard/maisons')} />;
}
