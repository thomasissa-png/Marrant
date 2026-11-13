"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Largeur à partir de laquelle les filtres restent dépliés, sans `details` visible (sm de Tailwind). */
export const LARGEUR_FILTRES_DEPLIES = "(min-width: 640px)";

/**
 * Filtres de « Quoi répondre » repliés sous 640 px (reste du D6, arbitrage @ux D6 n°1) : un seul
 * `<details>` fermé au chargement, `<summary>` de 44 px qui nomme les valeurs choisies (jamais un nombre
 * seul) ; la liste suit, au moins une ligne dans le premier écran à 375 px. Le contenu reste dans le DOM.
 * Dès 640 px : rendu déplié, summary masqué (CSS `::details-content` dans les navigateurs récents ; le
 * script ouvre le `details` dans les autres). Choisir une puce garde l'état ouvert (élément conservé).
 */
export function FiltresReplies({ resume, children }: { resume: string; children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const mq = window.matchMedia?.(LARGEUR_FILTRES_DEPLIES);
    if (!mq) return;
    const appliquer = () => {
      if (mq.matches && details.current) details.current.open = true;
    };
    appliquer();
    mq.addEventListener?.("change", appliquer);
    return () => mq.removeEventListener?.("change", appliquer);
  }, []);

  return (
    <details ref={details} className="group sm:[&::details-content]:[content-visibility:visible]" data-filtres-replies>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-lg border border-border-input px-4 py-2 text-sm font-semibold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary sm:hidden [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 [overflow-wrap:anywhere]">{resume}</span>
        <svg className="h-4 w-4 flex-none transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="space-y-4 pt-3 sm:pt-0">{children}</div>
    </details>
  );
}
