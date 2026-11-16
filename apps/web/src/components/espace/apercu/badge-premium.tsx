import { OFFRE_NOM } from "@/config/textes/offre";
import { cn } from "@/lib/utils";

/**
 * Pastille « Premium » de l'aperçu verrouillé (refonte s25, spec design §3.1) : le verrou ne vit jamais seul, il
 * porte le mot (`OFFRE_NOM`). Sans bord : non cliquable. `grand` : hero et fin d'extrait. `coin` : en haut à droite
 * d'un bloc fermé, hors du flux (le contenu ne bouge pas).
 */
export function BadgePremium({ grand = false, coin = false, className }: { grand?: boolean; coin?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-accent-primary/15 font-semibold text-accent-link",
        grand ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs",
        coin && "absolute right-3 top-3 z-10 md:right-4 md:top-4",
        className,
      )}
      data-badge-premium
    >
      <svg className={cn("flex-none", grand ? "h-4 w-4" : "h-3.5 w-3.5")} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0v4" />
      </svg>
      {OFFRE_NOM}
    </span>
  );
}
