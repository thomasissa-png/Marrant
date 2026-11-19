import { cn } from "@/lib/utils";

/**
 * s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §4) : barre segmentée d'un parcours, un segment par étape
 * (`h-2 rounded-full`) : faite pleine (`bg-text-primary`), en cours cernée, à venir grise ; jamais violette. `enCours` :
 * numéro de l'étape en cours (`null` : aucune, parcours pas entamé, tous les segments « à venir »). Rôle `progressbar`,
 * valeur = étapes faites, texte de valeur = libellé existant passé par l'appelant (« Étape n sur N », « n/N étapes »).
 */
export function BarreSegmentee({
  faites,
  total,
  enCours,
  texte,
  labelledBy,
  className,
}: {
  faites: number;
  total: number;
  enCours: number | null;
  texte: string;
  labelledBy?: string;
  className?: string;
}) {
  return (
    <span
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={faites}
      aria-valuetext={texte}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : texte}
      className={cn("grid auto-cols-fr grid-flow-col gap-1", className)}
      data-barre-segmentee=""
    >
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
        const etat = n === enCours ? "en-cours" : n <= faites ? "fait" : "a-venir";
        return (
          <span
            key={n}
            className={cn(
              "block h-2 rounded-full",
              // s26 parcours, tour 5 (D9 de la relecture design v2 : segments vides noirs sur noir) : « à venir » en contour
              // `border-input` (3,33:1 sur le fond de carte, `tailwind.config.ts`), sans fond ; en cours, contour blanc ; fait, plein blanc.
              etat === "en-cours" ? "border border-text-primary bg-transparent" : etat === "fait" ? "bg-text-primary" : "border border-border-input bg-transparent",
            )}
            data-segment={etat}
          />
        );
      })}
    </span>
  );
}
