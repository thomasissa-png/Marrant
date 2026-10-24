import { cn } from "@/lib/utils";
import { frTypo } from "@/lib/fr-typo";
import { FENETRE_COMPTE } from "@/config/textes/cta-pages";

/**
 * « D'abord ton compte, puis le paiement. » (textes-trajet-v2 W06 et T01) : sous le plein d'un
 * visiteur qui va à /register, avant la réassurance. Jamais pour un compte connecté.
 */
export function LigneCompte({ className }: { className?: string }) {
  return (
    <p className={cn("mt-2 text-center text-sm leading-snug text-text-secondary", className)} data-testid="ligne-compte">
      {frTypo(FENETRE_COMPTE)}
    </p>
  );
}
