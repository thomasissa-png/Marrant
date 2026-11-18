import { Verrou } from "@/components/espace/apercu/badge-premium";
import { META_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";

/** Deux barres neutres à la place d'un texte fermé (mêmes classes que `RepliquesFermees`). */
export function BarresFermees() {
  return (
    <div className="mt-4 flex flex-col gap-4" aria-hidden="true" data-barres-replique>
      <span className="block h-2 w-full rounded-full bg-border-hover" />
      <span className="block h-2 w-2/3 rounded-full bg-border-hover" />
    </div>
  );
}

/**
 * s26 (`docs/ux/rubriques-premium-s26.md` §0 et §5) : `RepliquesFermees` généralisé à une liste de LIBELLÉS. Chaque bloc
 * fermé = son libellé réel (constante de la fiche, jamais le contenu), un verrou et deux barres neutres. Verrouillage
 * RÉEL : ce composant ne reçoit que des libellés, le texte fermé n'entre ni dans le HTML ni dans les données envoyées.
 * `RepliquesFermees` reste tel quel pour « Aujourd'hui » et « Quoi répondre » (clés de registres, rendu figé par ses tests).
 * Neutre (aucun violet), 14/600 (`META_FORT`) : aucune taille ni combinaison ajoutée.
 */
export function BlocsFermes({ libelles, className }: { libelles: readonly string[]; className?: string }) {
  return (
    <ul className={cn("mt-4 grid grid-cols-1 gap-4", className)} data-blocs-fermes>
      {libelles.map((l) => (
        <li key={l} className="min-w-0 rounded-xl border border-border p-4" data-bloc-ferme={l}>
          <div className="flex items-center justify-between gap-2">
            <p className={META_FORT}>{l}</p>
            <Verrou />
          </div>
          <BarresFermees />
        </li>
      ))}
    </ul>
  );
}

/**
 * Corps d'une tuile de la rangée 2 réduite à son titre fermé (spec s26 : « en titres fermés, verrou + barres ») : le
 * titre (`TITRE_CARTE`), un effectif réel s'il existe, puis les barres. Le verrou est celui de `TuileFermee`.
 */
export function TitreFerme({ titre, effectif }: { titre: string; effectif?: number }) {
  return (
    <>
      <h2 className={cn("pr-8", TITRE_CARTE)}>
        {titre}
        {effectif !== undefined && <span className="ml-2 text-text-secondary">{effectif}</span>}
      </h2>
      <BarresFermees />
    </>
  );
}
