import type { ParcoursSlug } from "@/lib/entrees-parcours";
import { FIN_ETAPE_1 } from "@/config/textes/cta-pages";

interface CarteEtapeSuivanteProps {
  parcours: ParcoursSlug;
  numero: number;
  titre: string;
  /** « Ce que tu vas apprendre » : texte déjà public de l'aperçu. */
  apercu?: string | null;
  className?: string;
}

/**
 * Carte « Étape 2 » (fin d'étape 1, concision v5) : surtitre « Étape 2 sur {N} », titre,
 * aperçu public. Rien de payant dévoilé, jamais de bouton dedans.
 */
export function CarteEtapeSuivante({ parcours, numero, titre, apercu, className }: CarteEtapeSuivanteProps) {
  return (
    <div
      className={`rounded-lg border border-accent-primary/40 bg-background-card p-4 text-left sm:p-5${className ? ` ${className}` : ""}`}
      data-carte-etape-suivante={numero}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {FIN_ETAPE_1.carteSurtitre(parcours, numero)}
      </p>
      <p className="mt-1 font-display text-lg font-bold text-text-primary">{titre}</p>
      {apercu && <p className="mt-2 line-clamp-3 text-sm text-text-secondary">{apercu}</p>}
    </div>
  );
}
