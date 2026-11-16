import Link from "next/link";
import { TEXTES_MISSION } from "@/config/textes/espace-cartes";
import type { NumeroMarche } from "@/lib/espace/missions";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { ETIQUETTE, TEXTE } from "@/components/espace/typo";
import { Chevron, PASTILLE, PIED_TUILE_GABARIT, TITRE_TUILE, TUILE } from "@/components/espace/aujourdhui/tableau";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const M = frEspaceProfond(TEXTES_MISSION);

/**
 * Z4 « Mission » (refonte s25, spec design §4 Z4 ; architecture v20 4.4 état 4) : jamais l'action principale (aucun
 * bouton plein). Toute la tuile est le lien (cible bien au-dessus de 44 px) vers la mission dans « S'entraîner » :
 * « Mission · Marche n », le titre de la marche, « Facultative » en pastille non bordée, chevron en bas à droite.
 * `fige` (extrait de l'aperçu) : la même tuile, sans lien.
 * v7 tour 2 (piste Mission) : `accroche`, la première phrase de l'énoncé de la mission ouverte (texte existant,
 * `accrocheMission`), sous le titre : la tuile n'a plus un grand vide entre le titre et la pastille.
 * v7 tour 3 (faute 1) : figée (extrait), l'accroche est coupée après sa 3e ligne (entre deux lignes, sans points de
 * suspension, la 3e déjà dans le fondu) : aucune ligne à cheval sur le point transparent, quelle que soit la largeur.
 */
export function MissionLien({ marche, accroche, fige = false }: { marche: NumeroMarche; accroche?: string; fige?: boolean }) {
  const contenu = (
    <>
      <span className={ETIQUETTE}>
        {M.titre} · {M.marche(marche)}
      </span>
      <span className={cn(TITRE_TUILE, "block", !accroche && "mb-4")}>{M.titresMarches[marche]}</span>
      {accroche && (
        <span className={cn("mb-4 mt-2 block", TEXTE, fige && "max-h-[4.5rem] overflow-hidden")} data-mission-accroche>
          {frEspace(accroche)}
        </span>
      )}
      {/* v7 tour 8 (piste) : pied au même gabarit que celui de l'étape voisine (filet, 48 px, chevron à droite), 16 px
          sous le corps. Le seul libellé existant de la mission (« Voir la marche n ») sert à passer d'une marche à
          l'autre dans « S'entraîner » et redoublerait l'étiquette : le pied garde « Facultative ». */}
      <span className={cn(PIED_TUILE_GABARIT, "transition-colors group-hover:bg-background-elevated")}>
        <span className={PASTILLE}>{M.facultative}</span>
        <Chevron className="text-text-secondary" />
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
        "group transition-colors hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {contenu}
    </Link>
  );
}
