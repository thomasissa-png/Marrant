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

// s26 tour 2 : 44 px (cible tenue, `py-2.5` + 24) au lieu de 48 ; dès 1024 px, la ligne s’étire à la hauteur de sa rangée (`flex-1`).
const LIGNE_LIEN =
  "flex min-h-11 flex-1 items-center gap-x-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary [&:hover_[data-titre]]:underline";

/** Chevron du résumé replié (même dessin que le sommaire de l'abonné). */
function Chevron() {
  return (
    <svg className="h-5 w-5 flex-none text-text-secondary transition-transform group-open:rotate-180" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/**
 * s26 parcours connecté (`docs/design/parcours-connecte-s26.md` §3 ; `docs/ux/parcours-connecte-s26.md` §4), visiteur et
 * compte gratuit, espace ouvert seulement : carte de progression de l'en-tête 7/5 = ligne `progressionVisiteurTexte()`
 * puis la liste des étapes, chaque ligne un lien d'ancre `#etape-N` (numéro, titre ; « Lecture libre » en pastille sur
 * l'étape 1). Aucun bouton plein (le plein reste celui de l'en-tête collant), aucun cadenas. Zéro texte nouveau.
 * Tour 2 (UX §4, « visiteur : même `details` fermé ») : sous 1024 px, la liste est dans un `details` FERMÉ dont le
 * résumé porte la ligne d'offre ; dès 1024 px, liste dépliée dont les lignes se partagent la hauteur de la carte (étirée
 * à la hauteur de la colonne de gauche) : plus de vide en bas de carte. Deux rendus choisis par CSS seul (`lg:hidden`,
 * `hidden lg:flex`) : la page est rendue côté serveur (ISR), rien ne bouge à l'hydratation.
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
  const lignes = etapes.map((e) => (
          <li key={e.order} className="flex lg:flex-1">
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
  ));
  return (
    <div data-testid="liste-etapes-visiteur" className="lg:flex lg:flex-1 lg:flex-col">
      <p className={cn(META, "hidden lg:block")}>{progressionVisiteurTexte()}</p>
      <ol className="mt-2 hidden divide-y divide-border lg:flex lg:flex-1 lg:flex-col" data-liste-large="">
        {lignes}
      </ol>
      <details className="group lg:hidden" data-liste-repliee="">
        <summary className="cursor-pointer list-none rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary [&::-webkit-details-marker]:hidden">
          <span className="flex min-h-11 items-center justify-between gap-3">
            <span className={META}>{progressionVisiteurTexte()}</span>
            <Chevron />
          </span>
        </summary>
        <ol className="mt-2 divide-y divide-border">{lignes}</ol>
      </details>
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
