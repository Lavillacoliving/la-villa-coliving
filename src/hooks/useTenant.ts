import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { pickTenantFiche } from '@/lib/portail/quittance';

export interface TenantInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  room_number: string;
  current_rent: number;
  move_in_date: string;
  move_out_date: string | null;
  deposit_amount: number | null;
  due_day: number | null;
  bail_end: string | null;
  preavis_status: string;
  preavis_date: string | null;
  bio: string | null;
  is_visible_annuaire: boolean;
  property_id: string;
  property_name: string;
  property_address: string;
  property_city: string;
  legal_entity_name: string;
  siege_social: string;
  siret: string;
  charges_energy_chf: number;
  charges_maintenance_chf: number;
  charges_services_chf: number;
  is_coliving: boolean;
  date_of_birth: string | null;
  place_of_birth: string | null;
  /** Bail v3 : loyer hors charges et forfait de charges de la fiche (nuls pour un bail antérieur). */
  rent_eur: number | null;
  charges_forfait_eur: number | null;
  /** Entité juridique de la maison (bailleur du bail v3) ; nulle si elle n'est pas lisible ou pas renseignée. */
  lessor_entity: { legal_name: string | null; legal_form: string | null; trade_name: string | null; registration: string | null; siege: string | null } | null;
}

/** Ligne renvoyée par TENANT_SELECT : seuls les champs lus par le choix de la fiche sont typés ici. */
type TenantRow = Record<string, unknown> & { id: string; room_number: number | string | null; move_in_date: string | null };

// Fiche + maison + entité juridique de la maison, en une requête (mêmes droits que le locataire connecté).
const TENANT_SELECT = `
  id, first_name, last_name, email, phone, room_number,
  current_rent, move_in_date, move_out_date, deposit_amount, due_day,
  bail_end, preavis_status, preavis_date, bio, is_visible_annuaire,
  property_id, date_of_birth, place_of_birth, rent_eur, charges_forfait_eur,
  properties!inner(name, address, city, legal_entity_name, siege_social, siret, charges_energy_chf, charges_maintenance_chf, charges_services_chf, is_coliving,
    entities(legal_name, legal_form, trade_name, registration, siege))
`;

export function useTenant() {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    async function fetchTenant() {
      setLoading(true);

      // First try matching by user_id (most secure — M5 fix)
      let data: any = null;
      if (user?.id) {
        // Plusieurs fiches actives peuvent partager le même e-mail (doublons) : jamais maybeSingle(), on choisit.
        const res = await supabase
          .from('tenants')
          .select(TENANT_SELECT)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('move_in_date', { ascending: false })
          .limit(5);
        data = pickTenantFiche((res.data || []) as unknown as TenantRow[]);
      }

      // Fallback: match by email (backward compat for tenants without user_id)
      if (!data && user?.email) {
        const res = await supabase
          .from('tenants')
          .select(TENANT_SELECT)
          .eq('email', user.email)
          .eq('is_active', true)
          .order('move_in_date', { ascending: false })
          .limit(5);
        data = pickTenantFiche((res.data || []) as unknown as TenantRow[]);

        // Auto-link user_id if found by email but user_id was empty (M5 self-healing)
        if (data && user.id) {
          supabase
            .from('tenants')
            .update({ user_id: user.id })
            .eq('id', data.id)
            .then(() => {});
        }
      }

      if (data) {
        const prop = (data as any).properties;
        setTenant({
          ...data,
          property_name: prop?.name || '',
          property_address: prop?.address || '',
          property_city: prop?.city || '',
          legal_entity_name: prop?.legal_entity_name || '',
          siege_social: prop?.siege_social || '',
          siret: prop?.siret || '',
          charges_energy_chf: prop?.charges_energy_chf || 0,
          charges_maintenance_chf: prop?.charges_maintenance_chf || 0,
          charges_services_chf: prop?.charges_services_chf || 0,
          is_coliving: prop?.is_coliving ?? true,
          rent_eur: data.rent_eur ?? null,
          charges_forfait_eur: data.charges_forfait_eur ?? null,
          lessor_entity: prop?.entities ?? null,
        } as TenantInfo);
      }
      setLoading(false);
    }

    fetchTenant();
  }, [user?.email, user?.id]);

  return { tenant, loading };
}
