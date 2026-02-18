import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface RentPayment {
  id: string;
  month: string;
  expected_amount: number;
  received_amount: number | null;
  status: string;
  payment_date: string | null;
}

export function usePayments(tenantId: string | undefined) {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    async function fetchPayments() {
      setLoading(true);
      const { data } = await supabase
        .from('payments')
        .select('id, month, expected_amount, received_amount, status, payment_date')
        .eq('tenant_id', tenantId)
        .order('month', { ascending: false })
        .limit(12);

      if (data) {
        setPayments(data as RentPayment[]);
      }
      setLoading(false);
    }

    fetchPayments();
  }, [tenantId]);

  return { payments, loading };
}
