import { OFFRE_NOM } from "@/config/textes/offre";
import { cn } from "@/lib/utils";
import { META_FORT } from "@/components/espace/typo";

/** Tracé du verrou, partagé par la pastille, le verrou seul et les répliques fermées (même dessin, même taille : 16 px). */
export function Verrou({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4 flex-none text-text-secondary", className)} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0v4" />
    </svg>
  );
}

/**
 * Pastille « Premium » de l'aperçu verrouillé, en haut du hero : le seul repère écrit du « fermé » (échelle s25,
 * `docs/design/typo-harmonie-espace-s25.md` §2.2, arbitrage du 16/11). Verrou et mot (`OFFRE_NOM`), neutre : fond
 * élevé, 14/600 blanc, verrou gris ; sans bord (non cliquable). Plus de variante de coin ni de fin d'extrait.
 */
export function BadgePremium({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full bg-background-elevated px-3 py-1", META_FORT, className)} data-badge-premium>
      <Verrou />
      {OFFRE_NOM}
    </span>
  );
}

/**
 * Verrou seul d'un bloc de l'extrait fermé (arbitrage du 16/11) : l'icône de la pastille, sans mot ni fond, gris
 * secondaire, en haut à droite du bloc, hors du flux et hors du contenu atténué. Décoratif (l'extrait est masqué
 * aux lecteurs d'écran ; la pastille du hero et la phrase lue portent le « fermé »).
 * v7 tour 10 (relecture design du tour 9 : il flottait 3 px au-dessus de « 5 min ») : le verrou est centré dans une
 * boîte de la hauteur de la première ligne des tuiles (`h-5`, 20 px, celle d'`ETIQUETTE` et de `META`) : même centre
 * que l'étiquette et la durée.
 */
export function VerrouSeul({ className }: { className?: string }) {
  return (
    <span className={cn("absolute right-6 top-6 z-10 flex h-5 items-center max-e300:right-4 max-e300:top-4", className)} aria-hidden="true" data-verrou-ferme>
      <Verrou />
    </span>
  );
}
