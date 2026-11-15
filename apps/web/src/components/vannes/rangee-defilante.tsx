"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { RANGEE_CHIPS_UNE_LIGNE } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

/** Pas d'un clic de chevron : environ trois pastilles. */
const PAS_DEFILEMENT = 320;

/**
 * v6 tour 1, point 8 (relectures Vannes F1 et D6) : la rangée unique des catégories (décision du 14/11, une
 * seule ligne T3-07) déborde dès 1 024 px. Des chevrons de 44 px, visibles dès `lg` et seulement du côté où il
 * reste des pastilles, la font défiler à la souris ; le fondu suit le même côté. Ils doublent le geste (Tab, doigt,
 * trackpad atteignent déjà chaque pastille) : `aria-hidden` et hors de l'ordre de tabulation, aucun libellé nouveau.
 */
export function RangeeDefilante({ children, label }: { children: ReactNode; label: string }) {
  const rangee = useRef<HTMLDivElement>(null);
  const [gauche, setGauche] = useState(false);
  // Premier rendu : la rangée des catégories déborde à toutes les largeurs desktop (environ 1 350 px pour 1 216).
  const [droite, setDroite] = useState(true);

  const mesurer = useCallback(() => {
    const el = rangee.current;
    if (!el) return;
    setGauche(el.scrollLeft > 1);
    setDroite(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = rangee.current;
    if (!el) return;
    mesurer();
    el.addEventListener("scroll", mesurer, { passive: true });
    window.addEventListener("resize", mesurer);
    return () => {
      el.removeEventListener("scroll", mesurer);
      window.removeEventListener("resize", mesurer);
    };
  }, [mesurer]);

  const defiler = (sens: 1 | -1) => rangee.current?.scrollBy({ left: sens * PAS_DEFILEMENT, behavior: "smooth" });

  return (
    <div className="relative mb-6" data-rangee-defilante="">
      <div
        ref={rangee}
        className={cn(
          RANGEE_CHIPS_UNE_LIGNE,
          gauche && droite && "lg:[mask-image:linear-gradient(to_right,transparent,#000_64px,#000_calc(100%-64px),transparent)]",
          gauche && !droite && "lg:[mask-image:linear-gradient(to_right,transparent,#000_64px)]",
          !gauche && droite && "lg:[mask-image:linear-gradient(to_right,#000_calc(100%-64px),transparent)]",
          !gauche && !droite && "lg:[mask-image:none]",
        )}
        role="tablist"
        aria-label={label}
      >
        {children}
      </div>
      {gauche && <Chevron sens={-1} onClick={() => defiler(-1)} />}
      {droite && <Chevron sens={1} onClick={() => defiler(1)} />}
    </div>
  );
}

function Chevron({ sens, onClick }: { sens: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      data-chevron={sens === 1 ? "droite" : "gauche"}
      onClick={onClick}
      className={cn(
        "absolute top-0 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-background-elevated text-text-primary shadow-md transition-colors hover:border-accent-primary lg:inline-flex",
        sens === 1 ? "right-0" : "left-0",
      )}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={sens === 1 ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
      </svg>
    </button>
  );
}
