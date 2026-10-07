"use client";

import { cn } from "@/lib/utils";
import { SERIE } from "@/config/textes/parcours";

interface StreakCounterProps {
  count: number;
  className?: string;
}

/**
 * Série (étalon 3.8 A) : jours de pratique d'affilée, aide sous le compteur.
 * s17 tour 1 (DES-1-03, bug 4 QA) : texte en `accent-link` (≈ 6:1, plus
 * d'`accent-secondary` en texte), nom vocal en français.
 */
export function StreakCounter({ count, className }: StreakCounterProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <div className="inline-flex items-center gap-2 rounded-full bg-accent-secondary/10 px-4 py-2">
        <span
          className={cn("text-2xl", count > 0 && "animate-streak-pulse motion-reduce:animate-none")}
          role="img"
          aria-label={SERIE.ariaIcone}
        >
          🔥
        </span>
        <span className="text-base font-bold text-accent-link">{count > 0 ? SERIE.jours(count) : SERIE.zero}</span>
      </div>
      <p className="max-w-xs text-xs text-text-muted">{SERIE.aide}</p>
    </div>
  );
}
