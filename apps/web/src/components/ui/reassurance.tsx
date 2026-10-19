import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";

/**
 * Réassurance unique (`REASSURANCE_UNIQUE`), rendue de la même façon sous chaque plein qui porte
 * un prix (trajet de conversion s21, tour 2, revue visuelle : « gris minuscule » refusé par la
 * grille §11). Blanc cassé (≈ 13:1 sur la carte #1F1F1F, AA largement), 14 px, centrée.
 */
export function Reassurance({ className, testId }: { className?: string; testId?: string }) {
  return (
    <p className={cn("mt-2 text-center text-sm leading-snug text-text-primary/90", className)} data-testid={testId} data-reassurance="">
      {frTypo(REASSURANCE_UNIQUE)}
    </p>
  );
}
