import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { TenantInfo } from '@/hooks/useTenant';
import { useEvents } from '@/hooks/useEvents';
import { supabase } from '@/lib/supabase';

interface PortailContext {
  tenant: TenantInfo;
  language: 'fr' | 'en';
}

const eventTypeLabels: Record<string, string> = {
  sport: 'Sport',
  yoga: 'Yoga',
  party: 'Party',
  other: 'Event',
};

export function CommunautePage() {
  const { tenant, language } = useOutletContext<PortailContext>();
  const { events, loading: eventsLoading } = useEvents(tenant.property_id);
  const [whatsappUrl, setWhatsappUrl] = useState<string|null>(null);
  const [sharedGroups, setSharedGroups] = useState<{label:{fr:string,en:string},url:string}[]>([]);
  const [colivers, setColivers] = useState<{first_name:string,bio:string|null,move_in_date:string|null}[]>([]);
  const [coliversLoading, setColiversLoading] = useState(true);

  useEffect(() => {
    // Fetch WhatsApp group URL for this property
    supabase.from('properties').select('whatsapp_group_url').eq('id', tenant.property_id).single()
      .then(({ data }) => { if (data?.whatsapp_group_url) setWhatsappUrl(data.whatsapp_group_url); });
    // Fetch shared groups from community_groups table (fallback to hardcoded if table doesn't exist)
    supabase.from('community_groups').select('*').order('sort_order')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setSharedGroups(data.map((g: any) => ({ label: { fr: g.label_fr || g.name, en: g.label_en || g.name }, url: g.url || '#' })));
        } else {
          setSharedGroups([
            { label: { fr: 'Sport & Fitness', en: 'Sport & Fitness' }, url: '#' },
            { label: { fr: 'Yoga', en: 'Yoga' }, url: '#' },
            { label: { fr: 'Événements', en: 'Events' }, url: '#' },
          ]);
        }
      });
    // Fetch colivers for directory (P2.11)
    setColiversLoading(true);
    supabase.from('tenants')
      .select('first_name, bio, move_in_date')
      .eq('property_id', tenant.property_id)
      .eq('is_active', true)
      .eq('is_visible_annuaire', true)
      .order('first_name')
      .then(({ data, error }) => {
        if (!error && data) setColivers(data);
        setColiversLoading(false);
      });
  }, [tenant.property_id]);

  const t = {
    fr: {
      events: 'Événements à venir',
      noEvents: 'Aucun événement prévu pour le moment.',
      date: 'Date',
      time: 'Heure',
      type: 'Type',
      location: 'Lieu',
      whatsapp: 'Groupes WhatsApp',
      whatsappDesc: 'Rejoins les groupes de ta maison et les groupes transversaux.',
      propertyGroup: 'Groupe de ta maison',
      sharedGroups: 'Groupes transversaux',
      join: 'Rejoindre',
      directory: 'Annuaire des colocs',
      directoryDesc: 'Découvre les colocs de ta maison.',
      noVisible: 'Aucun coloc visible pour le moment. Active ton profil dans les paramètres.',
      since: 'Depuis',
    },
    en: {
      events: 'Upcoming Events',
      noEvents: 'No upcoming events at the moment.',
      date: 'Date',
      time: 'Time',
      type: 'Type',
      location: 'Location',
      whatsapp: 'WhatsApp Groups',
      whatsappDesc: 'Join your house group and shared community groups.',
      propertyGroup: 'Your house group',
      sharedGroups: 'Shared groups',
      join: 'Join',
      directory: 'Coliver Directory',
      directoryDesc: 'Discover the colivers in your house.',
      noVisible: 'No visible colivers yet. Enable your profile in settings.',
      since: 'Since',
    },
  };

  const lang = t[language] || t.fr;

  const formatDate = (d: string) => new Date(d).toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="space-y-6">
      {/* Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
{lang.events}
        </h2>
        {eventsLoading ? (
          <div className="animate-pulse text-sm text-gray-400">...</div>
        ) : events.length === 0 ? (
          <p className="text-sm text-gray-500">{lang.noEvents}</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-semibold text-[#44403C] bg-[#F5F2ED] px-2 py-1 rounded">{eventTypeLabels[event.type] || eventTypeLabels.other}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {language === 'en' ? (event.title_en || event.title_fr) : event.title_fr}
                  </p>
                  {(language === 'en' ? event.description_en : event.description_fr) && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {language === 'en' ? (event.description_en || event.description_fr) : event.description_fr}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{formatDate(event.date)}</span>
                    {event.time && <span>{event.time.substring(0, 5)}</span>}
                    {event.location && <span>{event.location}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Groups */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
{lang.whatsapp}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{lang.whatsappDesc}</p>

        {/* Property group */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">{lang.propertyGroup}</h3>
          <div className="space-y-2">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-[#F5F2ED] rounded-lg hover:bg-[#E7E5E4] transition-colors"
              >
                <span className="text-sm font-medium text-[#1C1917]">{language === 'en' ? 'Group' : 'Groupe'} {tenant.property_name}</span>
                <span className="text-xs text-[#44403C] font-medium">{lang.join} →</span>
              </a>
            ) : (
              <p className="text-sm text-gray-400 italic">{language === 'en' ? 'No group link available yet.' : 'Lien de groupe pas encore disponible.'}</p>
            )}
          </div>
        </div>

        {/* Shared groups */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">{lang.sharedGroups}</h3>
          <div className="space-y-2">
            {sharedGroups.map((g, i) => (
              <a
                key={i}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-[#F5F2ED] rounded-lg hover:bg-[#E7E5E4] transition-colors"
              >
                <span className="text-sm font-medium text-[#1C1917]">{language === 'en' ? g.label.en : g.label.fr}</span>
                <span className="text-xs text-[#44403C] font-medium">{lang.join} →</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Coliver Directory */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
{lang.directory}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{lang.directoryDesc}</p>
        {coliversLoading ? (
          <div className="animate-pulse text-sm text-gray-400">...</div>
        ) : colivers.length === 0 ? (
          <p className="text-sm text-gray-400 italic">{lang.noVisible}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {colivers.map((c, i) => (
              <div key={i} className="flex flex-col items-center p-4 bg-[#F5F2ED] rounded-lg text-center">
                <div className="w-12 h-12 rounded-full bg-[#44403C] text-white flex items-center justify-center text-lg font-semibold mb-2">
                  {c.first_name.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm font-medium text-[#1C1917]">{c.first_name}</p>
                {c.bio && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.bio}</p>}
                {c.move_in_date && (
                  <p className="text-xs text-gray-400 mt-1">{lang.since} {new Date(c.move_in_date).toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR', { month: 'short', year: 'numeric' })}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
