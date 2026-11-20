import Link from "next/link";
import { TEXTES_GESTE, TEXTES_MISSION } from "@/config/textes/espace-cartes";
import type { NumeroMarche } from "@/lib/espace/missions";
import { CADRE_CARTE_ENTRAINER } from "@/components/espace/carte/styles";
import { EMOJI_CONTENU, RANGEE_PASTILLES } from "@/components/home/da-site";

import { Coche } from "@/components/espace/aujourdhui/tableau";
import { META, META_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";
import { EMOJIS_RUBRIQUES } from "@/components/espace/emojis";

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
 * s26 DA, s'entraîner et favoris (Thomas, 20/11) : carte à bandeau violet de l'accueil ; marche en cours au filet et au
 * texte violets (ligne active de la liste de Quoi répondre), puce en cours en pastille violette de l'accueil, émoji de
 * S'entraîner devant le titre. `cadre` : vide quand l'échelle est la tête de la carte de mission (page S'entraîner) ;
 * la carte s'étire alors à la hauteur de la colonne des cartes et les 5 lignes se partagent le surplus (`lg:flex-1`,
 * 44 px au moins), comme les lignes de la carte de progression de Parcours (s26 tour 2).
 */
export function EchelleMarches({ enCours, reussies, cadre = CADRE_CARTE_ENTRAINER }: { enCours: NumeroMarche; reussies: ReadonlySet<number>; cadre?: string }) {
  return (
    <section aria-labelledby="echelle-titre" className={cn(cadre, "min-w-0 px-6 pb-4 pt-6 [overflow-wrap:anywhere] lg:flex lg:flex-1 lg:flex-col")} data-echelle-marches={enCours}>
      <div className={RANGEE_PASTILLES}>
        <span className={EMOJI_CONTENU} aria-hidden="true">
          {EMOJIS_RUBRIQUES.sEntrainer}
        </span>
        <h2 id="echelle-titre" className={TITRE_CARTE}>
          {M.titre}
        </h2>
      </div>
      <ol aria-labelledby="echelle-titre" className="mt-4 hidden lg:flex lg:flex-1 lg:flex-col" data-echelle="liste">
        {MARCHES.map((n) => {
          const courante = n === enCours;
          return (
            <li key={n} className="flex border-t border-border first:border-t-0 lg:flex-1">
              <Link
                href={adresse(n)}
                aria-current={courante ? "step" : undefined}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between gap-4 transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary",
                  courante ? cn("relative -mx-6 w-[calc(100%+3rem)] bg-background-elevated px-6 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent-link", META_FORT, "text-accent-link") : META,
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
                  courante ? cn("border-accent-primary/40 bg-accent-primary/20", META_FORT, "text-accent-link") : cn("border-transparent bg-background-elevated hover:border-border-hover", META),
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
