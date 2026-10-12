import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";

/**
 * Plan Google Maps de la ZONE de la maison — section Localisation des pages maisons (demande Jérôme,
 * 02/09/2026, Lot A ; zone au lieu de l'adresse le 12/10/2026 après un cambriolage, décision Jérôme).
 *
 * Sécurité (12/10/2026) : la carte est centrée sur le point PUBLIC de la maison (publicGeo, choisi à ≈ 500 m de la
 * maison, même commune), SANS épingle (paramètre `ll`, pas `q`), avec un cercle « zone approximative » ; l'iframe est figée
 * (pointer-events: none) pour que le cercle reste juste ; aucun lien d'itinéraire vers la maison. L'adresse
 * exacte n'est donnée qu'à la prise de rendez-vous de visite (houseExactAddressNote).
 *
 * Chargé UNIQUEMENT au clic (« Afficher la carte ») :
 *  - CNIL : un iframe Google Maps dépose des cookies Google dès son chargement ; le charger
 *    sur action explicite du visiteur, avec la mention, dispense d'un bandeau de consentement ;
 *  - performance : zéro requête tierce et zéro poids au chargement de la page (LCP, CLS) ;
 *  - hydratation : l'état initial (carte non chargée) est identique au prérendu et au premier
 *    rendu client — aucun mismatch #418.
 */

interface HouseMapProps {
  name: string;
  /** Zone publiée (houseZone) — jamais l'adresse. */
  zone: string;
  /** Point PUBLIC de la maison (publicGeo, ≈ 500 m) — jamais les coordonnées exactes. */
  lat: number;
  lng: number;
  en: boolean;
}

/** Zoom de la carte : ≈ 6,6 m par pixel à cette latitude ; le cercle de 220 px couvre ≈ 1,4 km de diamètre. */
const ZOOM = 14;

export function HouseMap({ name, zone, lat, lng, en }: HouseMapProps) {
  const [loaded, setLoaded] = useState(false);
  const embedSrc = `https://maps.google.com/maps?ll=${lat},${lng}&z=${ZOOM}&hl=${en ? "en" : "fr"}&output=embed`;
  const areaLink = `https://www.google.com/maps/@${lat},${lng},${ZOOM}z`;

  const showMap = () => {
    setLoaded(true);
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "map_open", {
        house: name,
        page_path: window.location.pathname,
        language: en ? "en" : "fr",
      });
    } catch {
      /* noop — l'analytics ne bloque jamais l'UI */
    }
  };

  return (
    <div className="mt-10 card-ultra bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden">
      {loaded ? (
        <div className="relative h-72 md:h-96">
          <iframe
            title={en ? `Map of the area — ${name}` : `Carte du quartier — ${name}`}
            src={embedSrc}
            className="absolute inset-0 w-full h-full border-0 block pointer-events-none"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#B8860B] bg-[#D4A574]/20"
          />
          <p className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#1C1917] shadow-sm">
            {en ? "Approximate area" : "Zone approximative"}
          </p>
        </div>
      ) : (
        <div className="h-72 md:h-96 bg-[#FAF9F6] flex flex-col items-center justify-center text-center px-6">
          <MapPin className="text-[#D4A574] mb-3" size={32} />
          <p className="font-black text-[#1C1917] mb-1">{name}</p>
          <p className="text-sm text-[#57534E] mb-5">{zone}</p>
          <button
            type="button"
            onClick={showMap}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1917] text-white font-semibold rounded-full hover:bg-[#D4A574] hover:text-[#1C1917] transition-colors"
          >
            <MapPin size={18} />
            {en ? "Show the area" : "Afficher le quartier"}
          </button>
          <p className="mt-4 text-xs text-[#78716C] max-w-sm">
            {en
              ? "The map is loaded from Google Maps only when you ask for it (Google cookies)."
              : "La carte est chargée depuis Google Maps uniquement quand tu le demandes (cookies Google)."}
          </p>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-[#E7E5E4] text-sm">
        <span className="text-[#57534E]">{zone}</span>
        <a
          href={areaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-[#1C1917] hover:text-[#D4A574] transition-colors"
        >
          <ExternalLink size={16} />
          {en ? "See the area in Google Maps" : "Voir le quartier dans Google Maps"}
        </a>
      </div>
    </div>
  );
}
