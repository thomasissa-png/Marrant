"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Rangée d'onglets qui défile sous 1 024 px (lot D11c, revue d'harmonie défaut 5, Favoris à 375 px) :
 * - premier onglet à la marge de la page (16 px, 24 dès 768) : la rangée s'accroche au bord de sa marge
 *   intérieure (`scroll-px-*`), plus au bord de l'écran (« Tout » était à x = 0) ;
 * - indice de suite comme la barre de l'espace : fondu de 40 px et chevron à droite, éteints en fin de course
 *   ou quand tout tient ; dès 1 024 px, la rangée passe à la ligne, sans indice.
 */
export function RangeeOnglets({ label, children }: { label: string; children: ReactNode }) {
  const rangee = useRef<HTMLDivElement>(null);
  const [suite, setSuite] = useState(false);

  const mesurer = useCallback(() => {
    const r = rangee.current;
    if (r) setSuite(r.scrollLeft + r.clientWidth < r.scrollWidth - 2);
  }, []);

  useEffect(() => {
    mesurer();
    const r = rangee.current;
    const observateur = typeof ResizeObserver === "undefined" || !r ? null : new ResizeObserver(mesurer);
    if (r) observateur?.observe(r);
    // Chaque onglet aussi : ses compteurs arrivent après le chargement, sans changer la taille de la rangée.
    for (const o of Array.from(r?.children ?? [])) observateur?.observe(o);
    window.addEventListener("resize", mesurer);
    return () => {
      observateur?.disconnect();
      window.removeEventListener("resize", mesurer);
    };
  }, [mesurer]);

  return (
    <div className="relative -mx-4 mb-6 md:-mx-6 lg:mx-0">
      <div
        ref={rangee}
        role="tablist"
        aria-label={label}
        onScroll={mesurer}
        className="flex snap-x flex-nowrap gap-2 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] md:scroll-px-6 md:px-6 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        data-indice-onglets
        className={`pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end bg-gradient-to-l from-background from-40% to-transparent text-text-secondary transition-opacity lg:hidden ${suite ? "" : "opacity-0"}`}
      >
        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
