/**
 * Page de développement (jamais servie en production : route montée seulement si import.meta.env.DEV) : la carte
 * « Forfait de charges » de l'onglet Maisons et le bandeau de rappel, branchés sur des données en mémoire (les trois
 * forfaits provisoires 2026), pour vérifier l'écran sans compte admin ni écriture en base.
 * http://localhost:5175/dev/charges?maison=lelodge&today=2027-02-10
 */
import { useMemo, useState } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import PropertyChargesCard from '@/components/dashboard/PropertyChargesCard';
import { ChargesReminderView } from '@/components/dashboard/ChargesReminderBanner';
import { expectedChargesYear, housesMissingCharges } from '@/lib/bailV3/charges';
import { memoryChargesStore } from '@/lib/bailV3/chargesStore';
import type { ChargesExercise } from '@/lib/bailV3/chargesEntry';

const HOUSES = [
  { id: 'lavilla', slug: 'lavilla', name: 'La Villa', address: '34 rue du Foron - 74100 Ville-la-Grand - France', room_count: 10, lessor: { name: 'Indivision Austin-Piot', address: '34 rue du Foron, 74100 Ville-la-Grand' }, total: 41312 },
  { id: 'lelodge', slug: 'lelodge', name: 'Le Lodge', address: '8 rue de Romagny - 74100 Annemasse - France', room_count: 12, lessor: { name: 'SCI Sleep In', address: '8 rue du Mont-Blanc, 74100 Annemasse' }, total: 48372 },
  { id: 'leloft', slug: 'leloft', name: 'Le Loft', address: '1 rue des Marronniers - 74100 Ambilly - France', room_count: 7, lessor: { name: 'SCI Sleep In', address: '8 rue du Mont-Blanc, 74100 Annemasse' }, total: 29883 },
];

const SEED: ChargesExercise[] = HOUSES.map((h) => ({
  id: `seed-${h.id}`, property_id: h.id, fiscal_year: 2026, method: 'provisional_2025_plus_10', status: 'provisoire',
  total_recoverable_eur: h.total, room_count: h.room_count, per_room_month_eur: Math.round((h.total / h.room_count / 12) * 100) / 100,
  effective_from: '2026-10-26', validated_at: null, validated_by: null, notes: 'Forfait provisoire : réel 2025 récupérable + 10 %.',
  lines: [{ id: `seed-${h.id}-l0`, property_charges_id: `seed-${h.id}`, poste_code: 'projection_2025_plus_10', label: 'Projection : charges récupérables réelles 2025 + 10 % (D12-bis)', amount_eur: h.total, recoverable_pct: 100, recoverable_eur: h.total, source: null, sort_order: 0 }],
}));

export default function ChargesPreviewDev() {
  const params = new URLSearchParams(window.location.search);
  const today = params.get('today') || '2026-11-10';
  const house = HOUSES.find((h) => h.id === params.get('maison')) || HOUSES[0];
  const store = useMemo(() => memoryChargesStore(SEED), []);
  const [, setTick] = useState(0);
  const missing = housesMissingCharges(store.all(), HOUSES, today);
  return (
    <ToastProvider>
      <div className="dash" style={{ background: '#FAF8F5', minHeight: '100vh', padding: 24 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ fontSize: 13, marginBottom: 12 }}>
            Aperçu de développement — données en mémoire, rien n'est écrit en base. Date simulée : <strong>{today}</strong>.{' '}
            {HOUSES.map((h) => <a key={h.id} href={`?maison=${h.id}&today=${today}`} style={{ margin: '0 6px', fontWeight: h.id === house.id ? 700 : 400 }}>{h.name}</a>)}
            {['2026-11-10', '2027-02-10', '2028-02-10'].map((d) => <a key={d} href={`?maison=${house.id}&today=${d}`} style={{ margin: '0 6px', fontWeight: d === today ? 700 : 400 }}>{d}</a>)}
          </p>
          <ChargesReminderView houses={missing} year={expectedChargesYear(today)} />
          <PropertyChargesCard key={house.id} property={house} lessor={house.lessor} store={store} todayIso={today} onChanged={() => setTick((t) => t + 1)} />
        </div>
      </div>
    </ToastProvider>
  );
}
