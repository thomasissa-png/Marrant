import Link from "next/link";
import { TEXTES_MISSION } from "@/config/textes/espace-cartes";
import type { NumeroMarche } from "@/lib/espace/missions";
import { frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { ETIQUETTE } from "@/components/espace/carte/styles";
import { Chevron, PASTILLE, TITRE_TUILE, TUILE } from "@/components/espace/aujourdhui/tableau";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const M = frEspaceProfond(TEXTES_MISSION);

/**
 * Z4 « Mission » (refonte s25, spec design §4 Z4 ; architecture v20 4.4 état 4) : jamais l'action principale (aucun
 * bouton plein). Toute la tuile est le lien (cible bien au-dessus de 44 px) vers la mission dans « S'entraîner » :
 * « Mission · Marche n », le titre de la marche, « Facultative » en pastille non bordée, chevron en bas à droite.
 * `fige` (extrait de l'aperçu) : la même tuile, sans lien.
 */
export function MissionLien({ marche, fige = false }: { marche: NumeroMarche; fige?: boolean }) {
  const contenu = (
    <>
      <span className={ETIQUETTE}>
        {M.titre} · {M.marche(marche)}
      </span>
      <span className={cn(TITRE_TUILE, "block")}>{M.titresMarches[marche]}</span>
      <span className="mt-auto flex items-end justify-between gap-3 pt-4">
        <span className={PASTILLE}>{M.facultative}</span>
        <Chevron className="text-text-muted" />
      </span>
    </>
  );
  if (fige) return <div className={TUILE}>{contenu}</div>;
  return (
    <Link
      href="/mon-espace/s-entrainer#mission"
      data-testid="mission-lien"
      className={cn(
        TUILE,
        "transition-colors hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {contenu}
    </Link>
  );
}
