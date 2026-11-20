"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { frTypoTexte, pointMedianInsecable } from "@/lib/fr-typo";
import { trackUmami } from "@/lib/umami";
import { etapeLienTexte } from "@/config/textes/parcours";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { LienRetour } from "@/components/espace/lien-retour";
import { META_FORT } from "@/components/espace/typo";

/** Clic sur un lien d'ancre `#etape-N` : même ouverture que l'en-tête de l'étape (dépliée, calée sous l'en-tête collant). */
function versEtape(slug: string, ordre: number, allerAEtape: (ordre: number) => void) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackUmami("lien-etape-clic", { parcours: slug, etape: ordre });
    allerAEtape(ordre);
  };
}

/**
 * s26 parcours connecté (`docs/ux/parcours-connecte-s26.md` §5, trajets « étape suivante » et « retour »), abonné, espace
 * ouvert seulement : pied de l'étape ouverte. « Retour : Parcours » vers la carte du parcours sur /parcours
 * (`#parcours-{slug}`, déjà posé sur la carte), puis le lien `etapeLienTexte` de l'étape suivante (même ouverture que
 * `allerAEtape`) ; dernière étape : pas de lien « suivante ». Cibles de 44 px.
 */
export function PiedEtape({
  slug,
  suivante,
  allerAEtape,
}: {
  slug: string;
  suivante: { order: number; titre: string } | null;
  allerAEtape: (ordre: number) => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border pt-4" data-pied-etape="">
      <LienRetour href={`/parcours#parcours-${slug}`} label={TEXTES_ESPACE_NAVIGATION.parcours} />
      {suivante && (
        <a
          href={`#etape-${suivante.order}`}
          onClick={versEtape(slug, suivante.order, allerAEtape)}
          data-etape-suivante={suivante.order}
          className={cn(
            "inline-flex min-h-11 items-center gap-1 rounded-md underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
            META_FORT,
          )}
        >
          {pointMedianInsecable(frTypoTexte(etapeLienTexte(suivante.order, suivante.titre)))}
          <svg aria-hidden="true" className="h-4 w-4 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  );
}
