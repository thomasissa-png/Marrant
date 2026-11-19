"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { frTypoParcours, frTypoTexte } from "@/lib/fr-typo";
import { trackUmami } from "@/lib/umami";
import { etapeLienTexte, progressionVisiteurTexte } from "@/config/textes/parcours";
import { ETAPE_LIBRE_BADGE } from "@/config/textes/offre";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { PASTILLE } from "@/components/espace/aujourdhui/tableau";
import { LienRetour } from "@/components/espace/lien-retour";
import { META, META_FORT } from "@/components/espace/typo";

/** Clic sur un lien d'ancre `#etape-N` : même ouverture que l'en-tête de l'étape (dépliée, calée sous l'en-tête collant). */
function versEtape(slug: string, ordre: number, allerAEtape: (ordre: number) => void) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackUmami("lien-etape-clic", { parcours: slug, etape: ordre });
    allerAEtape(ordre);
  };
}

const LIGNE_LIEN =
  "flex min-h-12 items-center gap-x-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary [&:hover_[data-titre]]:underline";

/**
 * s26 parcours connecté (`docs/design/parcours-connecte-s26.md` §3 ; `docs/ux/parcours-connecte-s26.md` §4), visiteur et
 * compte gratuit, espace ouvert seulement : carte de progression de l'en-tête 7/5 = ligne `progressionVisiteurTexte()`
 * puis la liste des étapes, chaque ligne un lien d'ancre `#etape-N` (numéro, titre ; « Lecture libre » en pastille sur
 * l'étape 1). Aucun bouton plein (le plein reste celui de l'en-tête collant), aucun cadenas. Zéro texte nouveau.
 */
export function ListeEtapesVisiteur({
  slug,
  etapes,
  allerAEtape,
}: {
  slug: string;
  etapes: ReadonlyArray<{ order: number; titre: string; libre: boolean }>;
  allerAEtape: (ordre: number) => void;
}) {
  return (
    <div data-testid="liste-etapes-visiteur">
      <p className={META}>{progressionVisiteurTexte()}</p>
      <ol className="mt-2 divide-y divide-border">
        {etapes.map((e) => (
          <li key={e.order}>
            <a href={`#etape-${e.order}`} onClick={versEtape(slug, e.order, allerAEtape)} className={LIGNE_LIEN}>
              <span className="w-5 flex-none text-base font-semibold tabular-nums text-text-secondary" aria-hidden="true">
                {e.order}
              </span>
              <span data-titre="" className="min-w-0 flex-1 text-sm text-text-primary underline-offset-2 [overflow-wrap:anywhere]">
                <span className="sr-only">{`${e.order}. `}</span>
                {frTypoParcours(e.titre)}
              </span>
              {e.libre && <span className={cn(PASTILLE, "flex-none font-normal text-success")}>{ETAPE_LIBRE_BADGE}</span>}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
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
          {frTypoTexte(etapeLienTexte(suivante.order, suivante.titre))}
          <svg aria-hidden="true" className="h-4 w-4 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  );
}
