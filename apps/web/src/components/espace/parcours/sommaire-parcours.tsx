"use client";

import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { frTypoParcours, frEspaceProfond } from "@/lib/fr-typo";
// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

/**
 * Page d'un parcours, abonné, interrupteur ouvert (s24, lot D4 ; architecture v20 5.1) : barre globale
 * (étapes validées sur étapes du parcours), « {n} sur {total} étapes », liste numérotée des étapes ;
 * par ligne UN seul bouton : « Reprendre » (première étape non validée, « Commencer » si aucune ne
 * l'est) ou « Voir » ; « Fait » est un statut en TEXTE (coche dessinée en plus, jamais la couleur
 * seule). Ancres `#etape-N` inchangées : le bouton ouvre l'étape comme son en-tête.
 */
export function SommaireParcours({
  etapes,
  faites,
  onOuvrir,
}: {
  etapes: ReadonlyArray<{ order: number; titre: string }>;
  faites: readonly number[];
  onOuvrir: (order: number) => void;
}) {
  const total = etapes.length;
  const n = etapes.filter((e) => faites.includes(e.order)).length;
  const aReprendre = etapes.find((e) => !faites.includes(e.order))?.order ?? null;
  const avancee = P.sommaire.faites(n, total);

  return (
    <div data-testid="sommaire-parcours">
      <p id="sommaire-avancee" className="text-sm font-semibold text-text-primary">
        {avancee}
      </p>
      <div
        role="progressbar"
        aria-labelledby="sommaire-avancee"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={n}
        aria-valuetext={avancee}
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background-elevated"
      >
        <div className="h-full rounded-full bg-accent-primary" style={{ width: total > 0 ? `${(n / total) * 100}%` : "0%" }} />
      </div>
      <ol className="mt-4 divide-y divide-border">
        {etapes.map((e) => {
          const fait = faites.includes(e.order);
          const bouton = e.order === aReprendre ? (n === 0 ? P.sommaire.commencer : P.sommaire.reprendre) : P.sommaire.voir;
          const principal = e.order === aReprendre;
          return (
            <li key={e.order} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 max-e300:py-2">
              <span className="font-display text-base font-bold text-text-muted" aria-hidden="true">
                {e.order}
              </span>
              <span id={`sommaire-etape-${e.order}`} className="min-w-0 flex-1 text-sm text-text-primary [overflow-wrap:anywhere]">
                <span className="sr-only">{`${e.order}. `}</span>
                {frTypoParcours(e.titre)}
              </span>
              {fait && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-text-secondary" data-statut="fait">
                  <svg className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {P.sommaire.fait}
                </span>
              )}
              <button
                type="button"
                id={principal ? "sommaire-reprendre" : undefined}
                onClick={() => onOuvrir(e.order)}
                aria-describedby={`sommaire-etape-${e.order}`}
                className={cn(buttonVariants({ variant: principal ? "primary" : "outline" }), "min-h-11 px-4 max-e300:w-full")}
              >
                {bouton}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
