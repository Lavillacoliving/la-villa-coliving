import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Ticket {
  id: string;
  type: string;
  subtype: string | null;
  description: string;
  photos_urls: string[] | null;
  urgency: string;
  status: string;
  is_anonymous: boolean;
  gestionnaire_comment: string | null;
  resolution_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewTicket {
  tenant_id: string;
  type: string;
  subtype?: string;
  description: string;
  photos_urls?: string[];
  urgency?: string;
  is_anonymous?: boolean;
}

export function useTickets(tenantId: string | undefined) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (data) setTickets(data as Ticket[]);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const createTicket = async (ticket: NewTicket) => {
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticket)
      .select()
      .single();

    if (!error && data) {
      setTickets(prev => [data as Ticket, ...prev]);
    }
    return { data, error };
  };

  const uploadPhoto = async (tenantId: string, file: File) => {
    const fileName = `${tenantId}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('tenant-files')
      .upload(fileName, file);

    if (error) return { url: null, error };

    const { data: urlData } = supabase.storage
      .from('tenant-files')
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  };

  return { tickets, loading, createTicket, uploadPhoto, refetch: fetchTickets };
}
