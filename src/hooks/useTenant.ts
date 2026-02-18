import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
}

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
      const { data } = await supabase
        .from('tenants')
        .select(`
          id, first_name, last_name, email, phone, room_number,
          current_rent, move_in_date, move_out_date, deposit_amount, due_day,
          bail_end, preavis_status, preavis_date, bio, is_visible_annuaire,
          property_id,
          properties!inner(name, address)
        `)
        .eq('email', user!.email!)
        .eq('is_active', true)
        .single();

      if (data) {
        const prop = (data as any).properties;
        setTenant({
          ...data,
          property_name: prop?.name || '',
          property_address: prop?.address || '',
        } as TenantInfo);
      }
      setLoading(false);
    }

    fetchTenant();
  }, [user?.email]);

  return { tenant, loading };
}
