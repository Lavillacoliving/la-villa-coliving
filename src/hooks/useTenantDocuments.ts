import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Ligne de la table tenant_documents telle qu'elle existe en base : id, tenant_id, type, label, file_url, month,
 * uploaded_at. (Jusqu'au 10/11/2026 ce fichier décrivait des colonnes inexistantes — document_type, external_url,
 * uploaded_by — et l'ancien générateur de bail n'y enregistrait donc rien.)
 */
export interface TenantDocument {
  id: string;
  tenant_id: string;
  type: string;
  label: string;
  file_url: string | null;
  /** Mois concerné (AAAA-MM) pour une quittance. */
  month: string | null;
  uploaded_at: string;
}

export const DOCUMENT_TYPES = [
  // « Bail » et non « Bail signé » : le PDF déposé par le générateur est la version à signer.
  { value: 'bail', label_fr: 'Bail', label_en: 'Lease' },
  { value: 'annexe', label_fr: 'Annexe du bail', label_en: 'Lease appendix' },
  { value: 'quittance', label_fr: 'Quittance de loyer', label_en: 'Rent receipt' },
  { value: 'edl_entree', label_fr: 'État des lieux entrée', label_en: 'Check-in Report' },
  { value: 'edl_sortie', label_fr: 'État des lieux sortie', label_en: 'Check-out Report' },
  { value: 'attestation', label_fr: 'Attestation', label_en: 'Certificate' },
  { value: 'assurance', label_fr: 'Assurance habitation', label_en: 'Home Insurance' },
  { value: 'identite', label_fr: 'Pièce d\'identité', label_en: 'ID Document' },
  { value: 'autre', label_fr: 'Autre', label_en: 'Other' },
];

/**
 * Hook to fetch documents linked to a tenant from tenant_documents table
 */
export function useTenantDocuments(tenantId: string | null) {
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!tenantId) {
      setDocuments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('tenant_documents')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('uploaded_at', { ascending: false });
    setDocuments(data || []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { load(); }, [load]);

  return { documents, loading, reload: load };
}

/**
 * Add a document record to tenant_documents
 */
export async function addTenantDocument(doc: {
  tenant_id: string;
  type: string;
  label: string;
  file_url?: string;
  month?: string;
}) {
  const { data, error } = await supabase
    .from('tenant_documents')
    .insert({
      tenant_id: doc.tenant_id,
      type: doc.type,
      label: doc.label,
      file_url: doc.file_url || null,
      month: doc.month || null,
    })
    .select()
    .single();
  return { data, error };
}

/**
 * Delete a document record
 */
export async function deleteTenantDocument(docId: string) {
  const { error } = await supabase
    .from('tenant_documents')
    .delete()
    .eq('id', docId);
  return { error };
}

/**
 * Upload file to Storage then create document record
 */
export async function uploadTenantFile(
  tenantId: string,
  file: File,
  documentType: string,
  label: string
) {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `tenants/${tenantId}/${documentType}_${timestamp}_${safeName}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('operations')
    .upload(path, file, { upsert: false });

  if (uploadError) return { error: uploadError };

  // Create record in tenant_documents
  const { data, error } = await supabase
    .from('tenant_documents')
    .insert({
      tenant_id: tenantId,
      type: documentType,
      label: label || file.name,
      file_url: path, // Store the relative path, not the full URL
    })
    .select()
    .single();

  return { data, error };
}
