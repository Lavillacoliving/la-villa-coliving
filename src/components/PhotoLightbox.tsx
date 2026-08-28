import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { responsiveImage } from "@/lib/responsiveImage";

/**
 * Visionneuse plein écran des photos d'une chambre — LP payante (brief LOT 3, 26/08/2026).
 *
 * Pourquoi : Clarity (3 j, 61 sessions) classait les photos des cartes n°2, 3, 4, 6, 8 et 9
 * des éléments cliqués — sur les canapés, le lit, la douche. Autant de CLICS MORTS : les
 * visiteurs essayaient d'agrandir pour explorer, la page leur opposait des images inertes.
 *
 * Choix techniques :
 * — Radix Dialog (déjà en dépendance) plutôt qu'une implémentation maison : piège à focus,
 *   Échap, `aria-modal`, verrou du scroll et restitution du focus à la fermeture sont
 *   fournis et testés. On n'utilise PAS le wrapper `ui/dialog.tsx` : sa `DialogContent` est
 *   une carte centrée `max-w-lg`, l'inverse d'un plein écran.
 * — Ce module est chargé en `React.lazy` par la page et préchargé à l'idle : il ne pèse
 *   rien sur le chunk initial, et l'ouverture reste instantanée (brief C4 : la haute
 *   résolution n'entre jamais dans le flux de chargement de la page).
 * — Le geste tactile est en Pointer Events natifs : aucune librairie de swipe à embarquer.
 */

export interface LightboxPhoto {
  src: string;
  w: number;
  h: number;
  alt: { fr: string; en: string };
}

interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  /** Index affiché ; `null` = fermée. Piloté par la page (une seule lightbox à la fois). */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  en: boolean;
  /** Repère de la chambre, lu par les lecteurs d'écran à l'ouverture. */
  title: string;
}

/** Seuils du geste, en px. En deçà, l'image revient en place (un tap n'est pas un swipe). */
const SWIPE_NAV = 50;
const SWIPE_CLOSE = 90;

export default function PhotoLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
  en,
  title,
}: PhotoLightboxProps) {
  const open = index !== null;
  const current = open ? photos[index] : null;
  // `drag` ne sert QU'au retour visuel pendant le geste. La DÉCISION (naviguer /
  // fermer / rien) se prend sur `delta`, une ref : sur un flick rapide, `pointerup`
  // peut arriver avant que React n'ait re-rendu, et un handler qui lit l'état
  // capturerait alors la valeur du rendu précédent — geste perdu.
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const delta = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      // Boucle : depuis la dernière photo, « suivant » revient à la première.
      onIndexChange((index + delta + photos.length) % photos.length);
    },
    [index, onIndexChange, photos.length],
  );

  // ←/→ au clavier. Échap est déjà géré par Radix.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  // Précharge les deux voisines : le swipe suivant affiche une image déjà en cache.
  // Uniquement à l'ouverture — jamais au chargement de la page.
  //
  // ⚠️ `srcset`/`sizes` AVANT `src`, et identiques à ceux du <img> affiché : sans
  // eux le navigateur précharge l'ORIGINAL pleine taille, qui n'est pas le candidat
  // qu'il redemandera ensuite — on payait deux téléchargements, le second inutile.
  useEffect(() => {
    if (index === null) return;
    for (const d of [1, -1]) {
      const n = photos[(index + d + photos.length) % photos.length];
      if (!n) continue;
      const img = new Image();
      const responsive = responsiveImage(n.src, "100vw");
      if (responsive.srcSet && responsive.sizes) {
        img.sizes = responsive.sizes;
        img.srcset = responsive.srcSet;
      }
      img.src = n.src;
    }
  }, [index, photos]);

  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    delta.current = { x: 0, y: 0 };
    setDrag({ x: 0, y: 0 });
    // Garde le doigt « attaché » même s'il sort de la zone en cours de geste.
    // `setPointerCapture` lève (`NotFoundError`) si le pointeur n'est plus actif —
    // capture perdue, événement synthétique… Le geste doit survivre à cet échec.
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    delta.current = { x: e.clientX - start.current.x, y: e.clientY - start.current.y };
    setDrag(delta.current);
  };

  const onPointerUp = () => {
    const moved = start.current !== null;
    const d = delta.current;
    start.current = null;
    delta.current = { x: 0, y: 0 };
    setDrag(null);
    if (!moved) return;
    // Le geste dominant décide : horizontal = naviguer, vers le bas = fermer.
    // En deçà des seuils, l'image revient en place — un tap n'est pas un swipe.
    if (Math.abs(d.x) > Math.abs(d.y)) {
      if (Math.abs(d.x) > SWIPE_NAV) go(d.x < 0 ? 1 : -1);
    } else if (d.y > SWIPE_CLOSE) {
      onClose();
    }
  };

  const label = (fr: string, enText: string) => (en ? enText : fr);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        {/* Noir PLEIN, pas /95 : à 5 % de transparence le titre et les cartes de la page
              restaient lisibles derrière la photo — l'overlay avait l'air inachevé et
              la photo perdait tout son contraste. */}
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black" />
        <Dialog.Content
          className="fixed inset-0 z-[60] flex flex-col outline-none"
          aria-describedby={undefined}
          // Un clic sur le fond ferme ; les contrôles et l'image stoppent la propagation.
          onClick={onClose}
        >
          <Dialog.Title className="sr-only">
            {label(`Photos — ${title}`, `Photos — ${title}`)}
          </Dialog.Title>

          <Dialog.Close
            aria-label={label("Fermer la visionneuse", "Close the viewer")}
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-5 md:top-5"
          >
            <X className="h-6 w-6" />
          </Dialog.Close>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                aria-label={label("Photo précédente", "Previous photo")}
                className="absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-5 md:flex"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(1); }}
                aria-label={label("Photo suivante", "Next photo")}
                className="absolute right-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-5 md:flex"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          {current && (
            <div
              className="flex flex-1 items-center justify-center overflow-hidden px-3 pb-2 pt-16 md:px-20"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              // Sans ça, le navigateur intercepte le geste pour son propre défilement.
              style={{ touchAction: "none" }}
            >
              <img
                key={current.src}
                src={current.src}
                alt={en ? current.alt.en : current.alt.fr}
                {...responsiveImage(current.src, "100vw")}
                width={current.w}
                height={current.h}
                // La lightbox n'existe qu'après un geste : rien à décoder d'avance.
                decoding="async"
                draggable={false}
                className="max-h-full w-auto max-w-full select-none rounded-lg object-contain"
                style={
                  drag
                    ? { transform: `translate(${drag.x}px, ${Math.max(0, drag.y)}px)` }
                    : { transition: "transform 150ms ease-out" }
                }
              />
            </div>
          )}

          {current && (
            <div
              className="shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mx-auto max-w-2xl text-sm text-white/85">
                {en ? current.alt.en : current.alt.fr}
              </p>
              <p className="mt-1.5 text-xs font-medium tracking-wide text-white/55">
                {(index ?? 0) + 1} / {photos.length}
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
