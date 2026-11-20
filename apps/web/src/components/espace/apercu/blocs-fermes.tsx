import { Verrou } from "@/components/espace/apercu/badge-premium";
import { Bandeau, PastillesDa } from "@/components/espace/da-espace";
import { Badge } from "@/components/ui/badge";
import { META, META_FORT } from "@/components/espace/typo";
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
/** s26 contrôle d'ensemble, aperçus : `enPastilles` (aperçus de Mes questions et Mes répliques) = libellé réel en pastille violette, comme le fil de l'abonné. */
export function BlocsFermes({ libelles, className, enPastilles = false }: { libelles: readonly string[]; className?: string; enPastilles?: boolean }) {
  return (
    <ul className={cn("mt-4 grid grid-cols-1 gap-4", className)} data-blocs-fermes>
      {libelles.map((l) => (
        <li key={l} className="min-w-0 rounded-xl border border-border p-4" data-bloc-ferme={l}>
          <div className="flex items-center justify-between gap-2">
            {enPastilles ? (
              <p>
                <Badge variant="primary" className="max-w-full whitespace-normal text-sm font-semibold">
                  {l}
                </Badge>
              </p>
            ) : (
              <p className={META_FORT}>{l}</p>
            )}
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
 * titre, un effectif réel s'il existe, puis les barres. Le verrou est celui de `TuileFermee`.
 * s26 contrôle d'ensemble, aperçus (DA de l'accueil, décision de Thomas du 20/11) : le titre fermé passe en pastille
 * violette (même texte, toujours un `h2`), l'effectif à côté en `META`, et la tuile reçoit le bandeau violet de l'accueil
 * (hors du flux : la tuile qui l'entoure est un cadre `relative overflow-hidden`, `TUILE`).
 */
export function TitreFerme({ titre, effectif, emoji }: { titre: string; effectif?: number; emoji?: string }) {
  return (
    <>
      <PastillesDa as="h2" className="pr-8" emoji={emoji} pastille={titre} suite={effectif !== undefined ? <span className={META}>{effectif}</span> : undefined} />
      <BarresFermees />
      <Bandeau />
    </>
  );
}
