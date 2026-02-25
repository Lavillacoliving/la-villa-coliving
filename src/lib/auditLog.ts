import { supabase } from '@/lib/supabase';

/**
 * Lightweight audit trail logger (P3.13).
 * Logs admin actions to the `audit_log` table in Supabase.
 *
 * Table schema (create in Supabase SQL editor):
 *
 * CREATE TABLE IF NOT EXISTS audit_log (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_email text,
 *   action text NOT NULL,
 *   entity_type text NOT NULL,
 *   entity_id text,
 *   details jsonb DEFAULT '{}',
 *   created_at timestamptz DEFAULT now()
 * );
 *
 * CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
 * CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
 */

export type AuditAction =
  | 'create' | 'update' | 'delete'
  | 'status_change' | 'payment_recorded'
  | 'lease_generated' | 'tenant_deactivated'
  | 'irl_applied' | 'prospect_converted'
  | 'file_uploaded' | 'file_deleted'
  | 'invoice_linked' | 'invoice_unlinked'
  | 'transaction_classified' | 'transaction_flagged'
  | 'deposit_returned' | 'deposit_adjusted' | 'split_group_created';

export type AuditEntityType =
  | 'tenant' | 'prospect' | 'payment' | 'maintenance_ticket'
  | 'event' | 'lease' | 'document' | 'room' | 'property'
  | 'bank_transaction' | 'invoice' | 'deposit';

export async function logAudit(
  action: AuditAction,
  entityType: AuditEntityType,
  entityId?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_log').insert({
      user_email: user?.email || 'unknown',
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {},
    });
  } catch (err) {
    // Non-blocking: if audit_log table doesn't exist, just log to console
    console.warn('[audit] Failed to log:', action, entityType, entityId, err);
  }
}
