import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Ticket {
  id: string;
  ticket_number: number;
  category: string;
  priority: string;
  title: string;
  description: string | null;
  status: string;
  room_number: string | null;
  resolution_notes: string | null;
  resolved_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewTicket {
  tenant_id: string;
  type: string;
  subtype?: string;
  description: string;
  urgency?: string;
  is_anonymous?: boolean;
}

// Map portail type+subtype to DB category
function mapCategory(type: string, subtype?: string): string {
  if (type === 'maintenance') {
    const map: Record<string, string> = {
      plumbing: 'plomberie',
      electricity: 'electricite',
      furniture: 'mobilier',
      wifi: 'wifi',
      other: 'autre',
    };
    return map[subtype || ''] || 'autre';
  }
  const map: Record<string, string> = {
    cleaning: 'menage',
    admin: 'admin',
    departure: 'departure',
    incident: 'incident',
    feedback: 'feedback',
  };
  return map[type] || 'autre';
}

// Map portail type to human-readable title
function mapTitle(type: string, subtype?: string): string {
  const titles: Record<string, string> = {
    maintenance: 'Maintenance',
    admin: 'Demande administrative',
    cleaning: 'Ménage supplémentaire',
    departure: 'Notification de départ',
    incident: 'Déclaration de sinistre',
    feedback: 'Feedback / Réclamation',
  };
  let t = titles[type] || type;
  if (type === 'maintenance' && subtype) t += ' — ' + subtype;
  return t;
}

// Reverse map DB category back to portail type for display
function reverseMapType(category: string): { type: string; subtype: string | null } {
  const subtypeMap: Record<string, string> = {
    plomberie: 'plumbing',
    electricite: 'electricity',
    mobilier: 'furniture',
    wifi: 'wifi',
  };
  if (subtypeMap[category]) {
    return { type: 'maintenance', subtype: subtypeMap[category] };
  }
  const typeMap: Record<string, string> = {
    menage: 'cleaning',
    admin: 'admin',
    departure: 'departure',
    incident: 'incident',
    feedback: 'feedback',
  };
  if (typeMap[category]) {
    return { type: typeMap[category], subtype: null };
  }
  // For other maintenance categories (serrurerie, chauffage, etc.)
  return { type: 'maintenance', subtype: 'other' };
}

export function useTickets(tenantId: string | undefined) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    const { data } = await supabase
      .from('maintenance_tickets')
      .select('*')
      .eq('reported_by', tenantId)
      .order('created_at', { ascending: false });

    if (data) setTickets(data as Ticket[]);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const createTicket = async (ticket: NewTicket) => {
    // Map portail fields to DB columns
    const category = mapCategory(ticket.type, ticket.subtype);
    const title = mapTitle(ticket.type, ticket.subtype);
    const priority = ticket.urgency === 'urgent' ? 'urgent' : 'normal';

    // Build description with metadata
    let desc = ticket.description;
    if (ticket.is_anonymous) {
      desc = '[ANONYME] ' + desc;
    }

    const { data, error } = await supabase
      .from('maintenance_tickets')
      .insert({
        reported_by: ticket.tenant_id,
        category,
        title,
        description: desc,
        priority,
        status: 'open',
      })
      .select()
      .single();

    if (!error && data) {
      setTickets(prev => [data as Ticket, ...prev]);

      // Send ntfy notification to gestionnaire
      try {
        await fetch('https://ntfy.sh/lavilla-vps-2026', {
          method: 'POST',
          headers: {
            'Title': `Nouveau ticket #${(data as any).ticket_number}`,
            'Tags': priority === 'urgent' ? 'rotating_light' : 'ticket',
            'Priority': priority === 'urgent' ? '4' : '3',
            'Actions': `view, Voir Dashboard, https://www.lavillacoliving.com/dashboard/maintenance`,
          },
          body: `${title}\n${ticket.description.substring(0, 200)}`,
        });
      } catch (e) {
        // Notification failure should not block ticket creation
        console.warn('ntfy notification failed:', e);
      }
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

  // Helper to get portail-style type from DB ticket
  const getTicketType = (ticket: Ticket) => reverseMapType(ticket.category);

  return { tickets, loading, createTicket, uploadPhoto, refetch: fetchTickets, getTicketType };
}
