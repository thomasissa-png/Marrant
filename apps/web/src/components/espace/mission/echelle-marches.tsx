import Link from "next/link";
import { TEXTES_GESTE, TEXTES_MISSION } from "@/config/textes/espace-cartes";
import type { NumeroMarche } from "@/lib/espace/missions";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { Coche } from "@/components/espace/aujourdhui/tableau";
import { META, META_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const M = frEspaceProfond(TEXTES_MISSION);
const G = frEspaceProfond(TEXTES_GESTE);

const MARCHES: readonly NumeroMarche[] = [1, 2, 3, 4, 5];

/** Adresse d'une marche (même forme que `hrefMarche` de la mission : toute marche se consulte, jamais un verrou). */
const adresse = (n: NumeroMarche) => `/mon-espace/s-entrainer?marche=${n}#mission`;

/**
 * Échelle des 5 marches (s26, `docs/design/rubriques-abonne-s26.md` §2.3 ; spec UX §3.2 b) : la progression de la
 * mission, avant d'y entrer. Marche en cours (`enCours`, celle de la mission affichée) en `META_FORT` sur fond élevé,
 * `aria-current="step"` ; marches réussies (`reussies`, dérivées de `lireRetoursMission`) marquées « Fait » avec la
 * coche `success`. Dès 1024 px, liste verticale avec les titres des marches ; dessous, 5 puces qui passent à la ligne
 * (jamais de défilement horizontal). Une seule des deux listes est affichée (et lue).
 */
export function EchelleMarches({ enCours, reussies }: { enCours: NumeroMarche; reussies: ReadonlySet<number> }) {
  return (
    <section aria-labelledby="echelle-titre" className={cn(CADRE_CARTE_NEUTRE, "min-w-0 p-6 [overflow-wrap:anywhere]")} data-echelle-marches={enCours}>
      <h2 id="echelle-titre" className={TITRE_CARTE}>
        {M.titre}
      </h2>
      <ol aria-labelledby="echelle-titre" className="mt-4 hidden lg:block" data-echelle="liste">
        {MARCHES.map((n) => {
          const courante = n === enCours;
          return (
            <li key={n} className="border-t border-border first:border-t-0">
              <Link
                href={adresse(n)}
                aria-current={courante ? "step" : undefined}
                className={cn(
                  "flex min-h-12 items-center justify-between gap-4 transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary",
                  courante ? cn("-mx-6 bg-background-elevated px-6", META_FORT) : META,
                )}
                data-marche={n}
              >
                <span className="min-w-0">
                  {M.marche(n)} · {M.titresMarches[n]}
                </span>
                {reussies.has(n) && (
                  <span className={cn("inline-flex flex-none items-center gap-2", META)} data-marche-faite>
                    <Coche className="h-4 w-4 text-success" />
                    {G.fait}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
      <ol aria-labelledby="echelle-titre" className="mt-4 flex flex-wrap gap-2 lg:hidden" data-echelle="puces">
        {MARCHES.map((n) => {
          const courante = n === enCours;
          return (
            <li key={n}>
              <Link
                href={adresse(n)}
                aria-current={courante ? "step" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                  courante ? cn("border-border-hover bg-background-elevated", META_FORT) : cn("border-transparent bg-background-elevated hover:border-border-hover", META),
                )}
                data-marche={n}
              >
                {reussies.has(n) && <Coche className="h-4 w-4 text-success" />}
                {M.marche(n)}
                {reussies.has(n) && <span className="sr-only">{`, ${G.fait}`}</span>}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
