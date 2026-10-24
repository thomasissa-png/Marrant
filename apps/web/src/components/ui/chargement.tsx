import { frTypo } from "@/lib/fr-typo";

/**
 * Contenu d'un bouton en cours de chargement (« On t'emmène au paiement… ») : roue + texte, pour
 * qu'il ne ressemble pas à un bouton désactivé (revue visuelle s21, pressé mobile C1/C2).
 */
export function Chargement({ texte }: { texte: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-2" data-testid="chargement">
      <span
        aria-hidden="true"
        className="block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
      />
      {frTypo(texte)}
    </span>
  );
}
