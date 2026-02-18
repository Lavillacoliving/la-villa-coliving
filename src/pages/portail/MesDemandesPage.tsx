import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { TenantInfo } from '@/hooks/useTenant';
import { useTickets, type NewTicket } from '@/hooks/useTickets';

interface PortailContext {
  tenant: TenantInfo;
  language: 'fr' | 'en';
}

const ticketTypes = {
  maintenance: { fr: 'Entretien / Réparation', en: 'Maintenance / Repair', icon: '🔧' },
  admin: { fr: 'Demande administrative', en: 'Administrative Request', icon: '📋' },
  cleaning: { fr: 'Ménage supplémentaire', en: 'Extra Cleaning', icon: '🧹' },
  departure: { fr: 'Notification de départ', en: 'Departure Notice', icon: '🚪' },
  incident: { fr: 'Déclaration de sinistre', en: 'Incident Report', icon: '⚠️' },
  feedback: { fr: 'Feedback / Réclamation', en: 'Feedback / Complaint', icon: '💬' },
};

const maintenanceSubtypes = {
  plumbing: { fr: 'Plomberie', en: 'Plumbing' },
  electricity: { fr: 'Électricité', en: 'Electricity' },
  furniture: { fr: 'Mobilier', en: 'Furniture' },
  wifi: { fr: 'WiFi / Internet', en: 'WiFi / Internet' },
  other: { fr: 'Autre', en: 'Other' },
};

export function MesDemandesPage() {
  const { tenant, language } = useOutletContext<PortailContext>();
  const { tickets, loading, createTicket, getTicketType } = useTickets(tenant.id);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('maintenance');
  const [formSubtype, setFormSubtype] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formUrgency, setFormUrgency] = useState('normal');
  const [formAnonymous, setFormAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = {
    fr: {
      title: 'Mes Demandes',
      newRequest: 'Nouvelle demande',
      type: 'Type de demande',
      subtype: 'Catégorie',
      description: 'Description',
      descPlaceholder: 'Décris ta demande en détail...',
      urgency: 'Urgence',
      normal: 'Normal',
      urgent: 'Urgent',
      anonymous: 'Demande anonyme',
      submit: 'Envoyer',
      cancel: 'Annuler',
      success: 'Demande envoyée avec succès !',
      myTickets: 'Mes demandes en cours',
      noTickets: 'Aucune demande pour le moment.',
      status: 'Statut',
      submitted: 'Envoyé',
      in_progress: 'En cours',
      resolved: 'Résolu',
      closed: 'Fermé',
      created: 'Créée le',
      comment: 'Commentaire gestionnaire',
      departureWarning: 'Rappel : le préavis est d\'1 mois. Un état des lieux de sortie sera planifié.',
      cleaningInfo: 'Service payant via notre prestataire Bouameur. Tarif selon la prestation.',
    },
    en: {
      title: 'My Requests',
      newRequest: 'New request',
      type: 'Request type',
      subtype: 'Category',
      description: 'Description',
      descPlaceholder: 'Describe your request in detail...',
      urgency: 'Urgency',
      normal: 'Normal',
      urgent: 'Urgent',
      anonymous: 'Anonymous request',
      submit: 'Submit',
      cancel: 'Cancel',
      success: 'Request submitted successfully!',
      myTickets: 'My current requests',
      noTickets: 'No requests yet.',
      status: 'Status',
      submitted: 'Submitted',
      in_progress: 'In progress',
      resolved: 'Resolved',
      closed: 'Closed',
      created: 'Created on',
      comment: 'Manager comment',
      departureWarning: 'Reminder: 1-month notice required. An exit inventory will be scheduled.',
      cleaningInfo: 'Paid service via our provider Bouameur. Rate depends on the service.',
    },
  };

  const lang = t[language] || t.fr;

  const handleSubmit = async () => {
    if (!formDesc.trim()) return;
    setSubmitting(true);

    const ticket: NewTicket = {
      tenant_id: tenant.id,
      type: formType,
      subtype: formType === 'maintenance' ? formSubtype : undefined,
      description: formDesc,
      urgency: formUrgency,
      is_anonymous: formAnonymous,
    };

    const { error } = await createTicket(ticket);
    setSubmitting(false);

    if (!error) {
      setSuccess(true);
      setFormDesc('');
      setShowForm(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const statusColors: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-600',
  };

  const statusLabel = (s: string) => (lang as any)[s] || s;

  return (
    <div className="space-y-6">
      {/* Header + New Request button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>📝</span> {lang.title}
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#b8860b] text-white text-sm font-medium rounded-lg hover:bg-[#a0750a] transition-colors"
        >
          {showForm ? lang.cancel : lang.newRequest}
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">
          ✅ {lang.success}
        </div>
      )}

      {/* New Request Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{lang.type}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(ticketTypes).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFormType(key)}
                  className={`p-3 rounded-lg border text-sm text-left transition-all ${
                    formType === key
                      ? 'border-[#b8860b] bg-[#b8860b]/5 text-[#b8860b] font-medium'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-lg">{val.icon}</span>
                  <span className="block mt-1">{language === 'en' ? val.en : val.fr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Departure warning */}
          {formType === 'departure' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
              {lang.departureWarning}
            </div>
          )}

          {/* Cleaning info */}
          {formType === 'cleaning' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
              {lang.cleaningInfo}
            </div>
          )}

          {/* Subtype for maintenance */}
          {formType === 'maintenance' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{lang.subtype}</label>
              <select
                value={formSubtype}
                onChange={(e) => setFormSubtype(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#b8860b]/30 focus:border-[#b8860b]"
              >
                <option value="">—</option>
                {Object.entries(maintenanceSubtypes).map(([key, val]) => (
                  <option key={key} value={key}>{language === 'en' ? val.en : val.fr}</option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{lang.description}</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder={lang.descPlaceholder}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#b8860b]/30 focus:border-[#b8860b] resize-none"
            />
          </div>

          {/* Urgency */}
          {formType === 'maintenance' && (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">{lang.urgency}</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="urgency" value="normal" checked={formUrgency === 'normal'} onChange={() => setFormUrgency('normal')} className="accent-[#b8860b]" />
                <span className="text-sm">{lang.normal}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="urgency" value="urgent" checked={formUrgency === 'urgent'} onChange={() => setFormUrgency('urgent')} className="accent-[#b8860b]" />
                <span className="text-sm text-red-600">{lang.urgent}</span>
              </label>
            </div>
          )}

          {/* Anonymous for feedback */}
          {formType === 'feedback' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formAnonymous} onChange={(e) => setFormAnonymous(e.target.checked)} className="accent-[#b8860b]" />
              <span className="text-sm text-gray-700">{lang.anonymous}</span>
            </label>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!formDesc.trim() || submitting}
            className="w-full py-3 bg-[#b8860b] text-white font-medium rounded-lg hover:bg-[#a0750a] transition-colors disabled:opacity-50"
          >
            {submitting ? '...' : lang.submit}
          </button>
        </div>
      )}

      {/* Existing Tickets */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{lang.myTickets}</h3>
        {loading ? (
          <div className="animate-pulse text-sm text-gray-400">...</div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">{lang.noTickets}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => {
              const { type: tType, subtype: tSub } = getTicketType(ticket);
              const typeInfo = ticketTypes[tType as keyof typeof ticketTypes];
              return (
                <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{typeInfo?.icon || '📄'}</span>
                      <span className="font-medium text-sm text-gray-900">
                        {language === 'en' ? typeInfo?.en : typeInfo?.fr || ticket.category}
                      </span>
                      {tSub && (
                        <span className="text-xs text-gray-500">({tSub})</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status] || statusColors.open}`}>
                      {statusLabel(ticket.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{ticket.description}</p>
                  <p className="text-xs text-gray-400">{lang.created} {new Date(ticket.created_at).toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR')}</p>
                  {ticket.resolution_notes && (
                    <div className="mt-2 bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                      <span className="font-medium">{lang.comment} :</span> {ticket.resolution_notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
